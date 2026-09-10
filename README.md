# dsh-QQbot

把 [QQ 官方机器人](https://q.qq.com)（WebSocket 长连接模式）接入本机 [DeepSeek Harness（dsh）](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)，让 AI 直接在 QQ 群聊 / 单聊里工作。

> 功能详解、操作步骤与全部配置参数见 **[用户手册.md](./用户手册.md)**。

```
QQ 群/单聊 ──WebSocket（每机器人一条）──▶ dsh-qqbot ──webhookRuntime──▶ DSH 会话
QQ 窗口  ◀──被动回复── 回复泵（按来源机器人路由）◀── 助手回复
定时消息 ──30s 调度──▶ QQ 群/单聊
```

## 核心能力

- **多机器人**：`bots.json` 唯一事实来源，每机器人独立凭据与配置，全部启用的同时在线，回复 / 定时 / 主动消息都由来源机器人发出。
- **免公网接入**：官方 SDK 长连接主动外连 QQ 网关，**无需公网 IP、域名与回调配置**。
- **消息响应**：群 @ 直接回复（可执行工具，附带最近 10 条上下文）；群未 @ 消息经价值评分过滤后才以「只聊天」方式插话；单聊直接会话。
- **会话与记忆**：同一群/单聊复用会话（`/new` 重开）；长期记忆跨会话保留（`/记忆`、`/清空记忆`）。
- **多模态与语音**：入站图片 / 文件 / 语音入上下文；语音转写五档（默认平台转写）、可选单聊 TTS 语音回复、单聊「正在输入」状态。
- **定时消息**：`/定时 每天 09:00 …`、`间隔`、`查看`、`取消`（每群/单聊默认 15 条，bots.json `scheduleMaxPerChat` 可调，0=不限）；`mode=ai` 到点由 AI 现场生成内容。
- **群管理**：敏感词撤回、`/广播`、入群欢迎语、🗑️ 表情撤回、敏感操作按钮审批。
- **AI 工具**：`qqbot_schedule_*`、`qqbot_send_message/image/file/voice`、`qqbot_memory_*`、`qqbot_request_approval`——直接说话即可（「每天九点提醒我喝水」）。
- **安全与可靠**：回复净化、媒体 SSRF 防护、可选本地路径白名单；发送失败进出箱每 60s 重投；主动消息每日配额可控；消息本地归档。
- **设置界面**：dsh 设置 → **QQ 机器人**，扫码或手动添加机器人，行为配置即改即生效。

## 安装

```sh
dsh plugin --profile web add <本目录或 git 地址>
```

开发模式：`npm run build && npm run sync`（同步到 `~/.dsh/profiles/web/node_modules/@sunjuntao/dsh-qqbot`）。

依赖 `@deepseek-ai/dsh-webhook` 提供的 `ctx.webhookRuntime`；不可用时插件降级运行（不创建会话，设置页与 `/status` 可查）。

## 快速上手

1. QQ 开放平台建机器人，拿 `appId` / `appSecret`，配置出口 **IP 白名单**；群设置里把「可获取的群聊消息范围」设为全部。
2. dsh 设置 → **QQ 机器人** → 添加机器人（扫码或手动填写），保存即热生效。
3. 拉机器人进群 @ 它说话，或加好友私聊。

## 配置速览

行为配置**按机器人独立**存于 `~/.dsh/qqbot/bots.json`，热生效无需重启。最常用几项：

| 字段 | 默认 | 说明 |
|---|---|---|
| `agentPreset` | `default` | @ 与单聊使用的 Preset |
| `groupFullReply` / `valueThreshold` | `true` / `5` | 群未 @ 消息是否参与回复 / 价值阈值（越高越安静） |
| `groupCooldownMs` / `senderCooldownMs` | `60000` / `30000` | 同群 / 同人回复最小间隔 |
| `atContextMessages` | `10` | @ 消息附带的群聊上下文条数 |
| `quotaPerDay` | `50` | 主动消息每日配额（0=不限） |
| `bannedWords` | `[]` | 群敏感词（命中撤回并跳过回复） |
| `groupOverrides` | `{}` | 按群 openid 覆盖行为字段 |

**界面隐藏配置项**：归档 `archiveEnabled`、长期记忆 `memoryEnabled`、文件识别 `fileIngestion`、欢迎语、表情撤回、Markdown、回复净化、正在输入、按钮审批、多模态等**默认常开**；`ttsReply`、路径白名单、主动兜底默认关；`secretEnv`、`agentPresetChat`（留空跟随 `agentPreset`）、`voiceTranscription`（默认 `note`）、`scheduleMaxPerChat`（默认 15）、`permissionAdmins` 等**仅 bots.json 可配**。完整清单与参数关联见手册。

## 目录结构

```
src/host/     插件运行时（admin/ messaging/ schedule/ chat/ qq/ infra/）
src/client/   设置界面（挂 dsh 设置页「QQ 机器人」）
src/shared/   前后端共用（config / time / types）
src/cli.ts    终端凭据管理 CLI
scripts/      build / deploy / dev 脚本
```

主要数据落在 `~/.dsh/qqbot/`：`bots.json`（机器人库，唯一事实来源）、`global.json`（`adminToken`）、`schedules.json`、`memory/`、`archive/`、`outbox.json`、`permissions/<appId>/`、`stats/`。

## 已知边界

- 定时消息调度精度 30 秒，进程未运行时不触发。
- 群被动回复窗口 5 分钟 / 5 次，超长任务可能发送失败（可开 `proactiveFallback`，但消耗主动配额）。
- 群聊历史上下文只回放**文本**，不含历史附件的图片 / 文件。
- webhookRuntime 为进程内 fire-and-forget，进程崩溃会丢未入会话的消息。

## License

MIT
