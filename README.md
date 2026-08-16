# dsh-skills-manage

A DeepSeek Harness (DSH) plugin that adds a visual **Skills Manager** page to the Web GUI:

- **Browse** every skill visible to the current session
- **Search & filter** by name/description, model-invocable, user-invocable
- **Read** the full markdown body, when-to-use guidance, provider, source and file path
- **Copy** any skill's content with one click
- **Refresh** the catalog on demand

It installs as a persistent repository plugin: after adding the plugin row to your profile's
`cordis.patch.yml`, the feature survives restarts — no dynamic-plugin re-creation needed.

## Features

| Capability | Where |
| --- | --- |
| Settings page entry | `settings.section` slot, id `skill-manager` |
| Skill catalog JSON API | `GET /api/skill-manager/list`, `GET /api/skill-manager/get` |
| Session scoping | Host resolves the current session's agent scope for accurate skill visibility |
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

- **Host half** (`lib/index.js`): consumes the `skills` service, exposes two JSON routes on
  the web server, and resolves the viewing scope from the current session via the `agents`
  service.
- **Browser half** (`lib/client.js`): a `window.__ModuleLoader__` bundle that registers the
  `settings.section` entry and renders the management UI with React.

## License

MIT
