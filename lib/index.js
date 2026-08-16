/**
 * dsh-skill-manager — host half.
 *
 * Exposes the skill catalog to the browser UI through JSON routes on the
 * web server:
 *   GET    /api/skill-manager/list    -> skill summaries
 *   GET    /api/skill-manager/get     -> one full skill body
 *   POST   /api/skill-manager/create  -> create a user skill (user-dsh layer)
 *   POST   /api/skill-manager/update  -> update a user skill
 *   POST   /api/skill-manager/delete  -> delete a user skill
 *
 * The browser bundle (exports["./client"]) renders the settings page and
 * calls these routes with fetch.
 *
 * Write operations are confined to the user skill root (<DSH_HOME>/skills,
 * the `user-dsh` layer). Skills from other layers (bundled, preset, project,
 * runtime) are read-only.
 */

import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { basename, dirname, join, resolve, sep } from 'node:path'
import { homedir } from 'node:os'
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'
import { resolveDshHome } from '@deepseek-ai/dsh-home-paths'

const API_PREFIX = '/api/skill-manager'
const SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** User skill root (the `user-dsh` layer this plugin may write). */
const userSkillRoot = join(resolveDshHome(), 'skills')

/** Local-only guard: reject requests whose Host header is not loopback. */
function trusted(req) {
  const host = req.headers.host || ''
  return host === 'localhost'
    || host.startsWith('localhost:')
    || host === '127.0.0.1'
    || host.startsWith('127.0.0.1:')
    || host === '[::1]'
    || host.startsWith('[::1]:')
}

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(body))
}

/** Collect and parse a JSON request body. */
async function readJsonBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const text = Buffer.concat(chunks).toString('utf8')
  if (!text) return {}
  return JSON.parse(text)
}

/**
 * Display name resolution with layered fallback:
 *   1. the skill directory's folder name (as the user sees it in Finder /
 *      the user skill root) — e.g. `工作日报` for a directory `工作日报`
 *      whose frontmatter name is `daily-work-log`;
 *   2. the frontmatter `name` (kebab-case invocation name) as the final
 *      fallback when no directory is available (runtime/bundled skills).
 */
function displayNameOf(s) {
  const dir = s.resourceBase && s.resourceBase.kind === 'directory'
    ? s.resourceBase.path
    : (typeof s.path === 'string' ? dirname(s.path) : undefined)
  if (typeof dir === 'string' && dir.length > 0) {
    const folder = basename(dir)
    if (folder && folder !== '.') return folder
  }
  return s.name
}

function summaryOf(s) {
  return {
    name: s.name,
    displayName: displayNameOf(s),
    description: s.description,
    whenToUse: s.whenToUse ?? null,
    modelInvocable: !!s.invocation?.modelInvocable,
    userInvocable: !!s.invocation?.userInvocable,
    provider: s.provider,
    source: s.source,
  }
}

/** True when the given absolute path lives under the user skill root. */
function isUnderUserRoot(candidate) {
  return candidate.startsWith(userSkillRoot + sep)
}

/** Split a SKILL.md file into its frontmatter data and body text. */
function splitSkillFile(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text)
  if (!match) return { data: {}, body: text }
  let data = {}
  try {
    data = parseYaml(match[1]) || {}
  } catch {
    data = {}
  }
  return { data, body: text.slice(match[0].length) }
}

/** Serialize frontmatter + body back to a SKILL.md file. */
function buildSkillFile(data, body) {
  const head = ['---', stringifyYaml(data).trimEnd(), '---'].join('\n')
  const cleanBody = typeof body === 'string' ? body.replace(/^\r?\n/, '') : ''
  return head + '\n' + cleanBody
}

/** Validate a skill frontmatter name/description, throwing on bad input. */
function validateMeta(name, description) {
  if (typeof name !== 'string' || !SKILL_NAME.test(name)) {
    throw new Error('技能名称必须为小写 kebab-case（如 daily-work-log）')
  }
  if (typeof description !== 'string' || !description.trim()) {
    throw new Error('description（描述）不能为空')
  }
}

export const name = 'dsh-skill-manager'
export const inject = ['skills', 'agents', 'webServer']

export function apply(ctx) {
  const register = (path, handler) => {
    ctx.effect(() => ctx.webServer.register({ kind: 'exact', path, handler }), `skill-manager:${path}`)
  }

  register(`${API_PREFIX}/list`, async (req, res) => {
    try {
      if (!trusted(req)) return json(res, 403, { error: 'forbidden' })
      const url = new URL(req.url, 'http://localhost')
      const sessionId = url.searchParams.get('sessionId')
      const agent = typeof sessionId === 'string' && sessionId ? ctx.agents.get(sessionId) : undefined
      const options = agent ? { scope: agent } : {}
      const list = await ctx.skills.list(options)
      json(res, 200, { items: list.map(summaryOf) })
    } catch (error) {
      json(res, 500, { error: String(error && error.message ? error.message : error) })
    }
  })

  register(`${API_PREFIX}/get`, async (req, res) => {
    try {
      if (!trusted(req)) return json(res, 403, { error: 'forbidden' })
      const url = new URL(req.url, 'http://localhost')
      const nameArg = url.searchParams.get('name')
      if (typeof nameArg !== 'string' || !nameArg) return json(res, 400, { error: 'missing name' })
      const sessionId = url.searchParams.get('sessionId')
      const agent = typeof sessionId === 'string' && sessionId ? ctx.agents.get(sessionId) : undefined
      const options = agent ? { scope: agent } : {}
      const skill = await ctx.skills.get(nameArg, options)
      if (!skill) return json(res, 404, { error: `skill "${nameArg}" not found` })
      json(res, 200, {
        skill: {
          ...summaryOf(skill),
          path: skill.path ?? null,
          content: skill.content,
        },
      })
    } catch (error) {
      json(res, 500, { error: String(error && error.message ? error.message : error) })
    }
  })

  register(`${API_PREFIX}/create`, async (req, res) => {
    try {
      if (!trusted(req)) return json(res, 403, { error: 'forbidden' })
      const body = await readJsonBody(req)
      const skillName = body.name
      validateMeta(skillName, body.description)
      const target = join(userSkillRoot, skillName, 'SKILL.md')
      try {
        await readFile(target, 'utf8')
        return json(res, 409, { error: `技能 "${skillName}" 已存在` })
      } catch (e) {
        if (e.code !== 'ENOENT') throw e
      }
      const data = { name: skillName, description: body.description }
      if (typeof body.whenToUse === 'string' && body.whenToUse.trim()) data.whenToUse = body.whenToUse
      const content = typeof body.content === 'string' ? body.content : ''
      await mkdir(dirname(target), { recursive: true })
      await writeFile(target, buildSkillFile(data, content), 'utf8')
      json(res, 200, { ok: true, name: skillName, path: target })
    } catch (error) {
      json(res, 500, { error: String(error && error.message ? error.message : error) })
    }
  })

  register(`${API_PREFIX}/update`, async (req, res) => {
    try {
      if (!trusted(req)) return json(res, 403, { error: 'forbidden' })
      const body = await readJsonBody(req)
      const oldPath = typeof body.path === 'string' ? resolve(body.path) : ''
      if (!isUnderUserRoot(oldPath)) return json(res, 403, { error: '目标不在用户技能目录内' })
      const skillName = body.name
      validateMeta(skillName, body.description)

      const oldDir = dirname(oldPath)
      const text = await readFile(oldPath, 'utf8')
      const { data, body: existingBody } = splitSkillFile(text)

      // Preserve unknown frontmatter fields; overwrite the editable ones.
      data.name = skillName
      data.description = body.description
      if (typeof body.whenToUse === 'string' && body.whenToUse.trim()) {
        data.whenToUse = body.whenToUse
      } else {
        delete data.whenToUse
      }
      const content = typeof body.content === 'string' ? body.content : existingBody

      // The directory (and therefore the display name, which follows the
      // folder name) is owned by the user and never renamed here; only the
      // SKILL.md file is rewritten. `oldDir` is kept only to stay under the
      // user root check above.
      void oldDir
      await writeFile(oldPath, buildSkillFile(data, content), 'utf8')
      json(res, 200, { ok: true, name: skillName, path: oldPath })
    } catch (error) {
      json(res, 500, { error: String(error && error.message ? error.message : error) })
    }
  })

  register(`${API_PREFIX}/delete`, async (req, res) => {
    try {
      if (!trusted(req)) return json(res, 403, { error: 'forbidden' })
      const body = await readJsonBody(req)
      const target = typeof body.path === 'string' ? resolve(body.path) : ''
      if (!isUnderUserRoot(target)) return json(res, 403, { error: '目标不在用户技能目录内' })
      await rm(dirname(target), { recursive: true, force: true })
      json(res, 200, { ok: true })
    } catch (error) {
      json(res, 500, { error: String(error && error.message ? error.message : error) })
    }
  })
}
