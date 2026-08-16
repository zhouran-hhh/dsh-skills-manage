<div align="center">

**English** | [**简体中文**](#zh-cn)

</div>

# dsh-skills-manage

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

**Option A — GitHub Release (recommended for end users):**

1. Download the latest source zip/tarball from the
   [Releases page](https://github.com/zhouran-hhh/dsh-skills-manage/releases) (or `git clone` / `git checkout v0.2.0`).
2. Unzip it and place the folder as `$DSH_HOME/profiles/web/vendor/dsh-skill-manager/`.
3. In `$DSH_HOME/profiles/web/package.json` add:

```json
{
  "dependencies": {
    "dsh-skill-manager": "file:./vendor/dsh-skill-manager"
  }
}
```

**Option B — npm / direct install:**

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

---

<div id="zh-cn">

<div align="center">

[**English**](#english) | **简体中文**

</div>

# dsh-skills-manage（技能管理）

一个 DeepSeek Harness（DSH）插件，为 Web 界面添加可视化的 **技能管理（Skills Manager）** 页面：

- **增**：新建技能（自动写入 `~/.dsh/skills/` 用户技能根目录）
- **删**：删除用户技能（内置/预设技能只读，需先复制）
- **改**：编辑技能的名称、描述、适用场景和正文
- **查**：浏览当前会话可见的全部技能；按名称/描述搜索；按「模型可调用 / 用户可调用」筛选；查看完整 Markdown 正文、来源与文件路径；一键复制

安装为**常驻仓库插件**后：在 profile 的 `cordis.patch.yml` 中注册插件行，功能在进程重启后依然存在，无需每次重新创建动态插件。

## 功能总览

| 能力 | 位置 |
| --- | --- |
| 设置页入口 | `settings.section` 槽位，id `skill-manager` |
| 技能目录 JSON API | `GET /api/skill-manager/list`、`GET /api/skill-manager/get` |
| 技能写操作 JSON API | `POST /api/skill-manager/create`、`/update`、`/delete` |
| 会话作用域 | Host 端通过 `agents` 服务解析当前会话的 scope，技能可见性与会话一致 |
| 写操作安全边界 | 仅允许操作 `<DSH_HOME>/skills`（`user-dsh` 层）；名称强制 kebab-case；删除/更新校验路径 |
| 主题适配 | 使用 DSH 主题 CSS 变量，自动适配浅色/深色模式 |

## 安装

### 1. 将包加入 profile

**方式 A — GitHub Release（推荐给普通用户）：**

1. 从 [Releases 页面](https://github.com/zhouran-hhh/dsh-skills-manage/releases) 下载最新源码 zip/tarball（或 `git clone` / `git checkout v0.2.0`）。
2. 解压后放到 `$DSH_HOME/profiles/web/vendor/dsh-skill-manager/`。
3. 在 `$DSH_HOME/profiles/web/package.json` 中加入：

```json
{
  "dependencies": {
    "dsh-skill-manager": "file:./vendor/dsh-skill-manager"
  }
}
```

**方式 B — npm / 直接安装：**

```bash
npm install /path/to/dsh-skills-manage   # 或: pnpm add dsh-skill-manager
```

或直接引用本地 vendor 副本（`package.json`）：

```json
{
  "dependencies": {
    "dsh-skill-manager": "file:./vendor/dsh-skill-manager"
  }
}
```

### 2. 注册插件行

在 `$DSH_HOME/profiles/web/cordis.patch.yml` 中：

```yaml
- insert:
    - id: skill-manager
      name: 'dsh-skill-manager'
```

### 3. 重启 DSH

组合配置在启动时读取。重启后打开 **设置 → 技能管理** 即可使用。

## 工作原理

- **Host 半**（`lib/index.js`）：消费 `skills` 服务，在 Web 服务器上暴露 5 个 JSON 路由；通过 `agents` 服务解析当前会话的查看 scope；写操作直接读写 `<DSH_HOME>/skills`（`user-dsh` 层），文件系统提供器监听变更并自动刷新目录，无需重启。
- **浏览器半**（`lib/client.js`）：`window.__ModuleLoader__` 格式的 bundle，注册 `settings.section` 入口，用 React 渲染管理界面。

## 权限说明

- **可增删改**：来源为 `user-dsh` 的技能（位于 `~/.dsh/skills/`）
- **只读**：`bundled`（内置）、`project-dsh`/`project-agents`（项目）、`custom`（自定义目录）、`runtime`（运行时注册）等其它来源的技能

## License

MIT

</div>
