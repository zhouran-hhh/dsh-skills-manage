# dsh-skills-manage

> **简体中文**：[README.zh-CN.md](README.zh-CN.md)

A DeepSeek Harness (DSH) plugin that adds a visual **Skills Manager** page to the Web GUI:

- **Create** new skills (written to the `~/.dsh/skills` user skill root)
- **Delete** user skills (built-in/preset skills are read-only — copy first)
- **Update** a skill's name, description, when-to-use and body
- **Browse** every skill visible to the current session; search by name/description; filter by
  model-invocable / user-invocable; read the full markdown body, provider, source and file path;
  copy any skill's content with one click

Installed as a persistent repository plugin, the feature survives restarts once the plugin row is
registered in your profile's `cordis.patch.yml` — no dynamic-plugin re-creation needed.

## Features

| Capability | Where |
| --- | --- |
| Settings page entry | `settings.section` slot, id `skill-manager` |
| Skill catalog JSON API | `GET /api/skill-manager/list`, `GET /api/skill-manager/get` |
| Skill write JSON API | `POST /api/skill-manager/create`, `/update`, `/delete` |
| Session scoping | Host resolves the current session's agent scope for accurate skill visibility |
| Write safety boundary | Only `<DSH_HOME>/skills` (`user-dsh` layer) is writable; names must be kebab-case; update/delete paths are validated |
| Theme | Uses DSH theme CSS variables (light/dark aware) |

## Install

### 1. Add the package to your profile

In `$DSH_HOME/profiles/web/`:

```bash
npm install /path/to/dsh-skills-manage   # or: pnpm add dsh-skill-manager
```

or reference the local vendor copy in `package.json`:

```json
{
  "dependencies": {
    "dsh-skill-manager": "file:./vendor/dsh-skill-manager"
  }
}
```

### 2. Register the plugin row

In `$DSH_HOME/profiles/web/cordis.patch.yml`:

```yaml
- insert:
    - id: skill-manager
      name: 'dsh-skill-manager'
```

### 3. Restart DSH

The composition is read at startup. After restarting, open **Settings → 技能管理 (Skills)**.

## How it works

- **Host half** (`lib/index.js`): consumes the `skills` service, exposes five JSON routes on the
  web server, resolves the viewing scope from the current session via the `agents` service, and
  performs write operations directly on `<DSH_HOME>/skills` (the `user-dsh` layer); the filesystem
  provider watches for changes and refreshes the catalog automatically — no restart needed.
- **Browser half** (`lib/client.js`): a `window.__ModuleLoader__` bundle that registers the
  `settings.section` entry and renders the management UI with React.

## Write permissions

- **Writable**: skills with source `user-dsh` (under `~/.dsh/skills/`)
- **Read-only**: `bundled`, `project-dsh`/`project-agents`, `custom`, `runtime` and other sources

## License

MIT
