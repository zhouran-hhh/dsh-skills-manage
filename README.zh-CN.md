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

在 `$DSH_HOME/profiles/web/` 中：

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
