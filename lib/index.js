/**
 * dsh-skill-manager — host half.
 *
 * Exposes the skill catalog to the browser UI through two JSON routes on the
 * web server:
 *   GET /api/skill-manager/list  -> skill summaries
 *   GET /api/skill-manager/get   -> one full skill body
 *
 * The browser bundle (exports["./client"]) renders the settings page and
 * calls these routes with fetch.
 */

const API_PREFIX = '/api/skill-manager'

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

function summaryOf(s) {
  return {
    name: s.name,
    description: s.description,
    whenToUse: s.whenToUse ?? null,
    modelInvocable: !!s.invocation?.modelInvocable,
    userInvocable: !!s.invocation?.userInvocable,
    provider: s.provider,
    source: s.source,
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
}
