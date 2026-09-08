# dsh-QQbot

把 [QQ 官方机器人](https://q.qq.com)（WebSocket 长连接模式）接入本机 [DeepSeek Harness（dsh）](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)。

```
QQ 群/单聊消息 ──WebSocket 长连接（主动外连）──▶ dsh-qqbot ──webhookRuntime──▶ DSH 会话
QQ 聊天窗口 ◀──被动回复──── 回复泵（session/event）◀── 助手回复
定时消息  ──30s 调度──▶ QQ 群/单聊（每日 / 固定间隔）
```

## 功能

- **WebSocket 接收**：`@tencent-connect/qqbot-nodejs` 官方 SDK 长连接，本机主动拨出 QQ 网关收事件（心跳/断线重连/RESUME 续传），**无需公网 IP、域名与回调配置**；事件经 `ctx.webhookRuntime` 走 DSH 官方 webhook 通道创建会话。
- **群 AT 消息**（`GROUP_AT_MESSAGE_CREATE`）：@机器人直接回复，默认附带最近 10 条群聊记录作上下文（`atContextMessages` 可调，0 关闭），**可执行工具**。
- **群全量消息**（`GROUP_MESSAGE_CREATE`）：全部消息入环形缓冲；@机器人 → 跳过价值过滤直接回复（可执行工具）；非 @ 消息 → 价值评分过滤通过后**仅聊天/问答，不执行工具**（使用 `agentPresetChat`）。
- **单聊**（`C2C_MESSAGE_CREATE`）：创建 DSH 会话并回复。
- **会话复用**：同一群/单聊复用同一会话（`agent.followup`），`/new` 解绑重开。
- **多模态**：入站图片/文件/语音附件注入会话上下文（视觉模型可看图，语音优先用平台自带转写文本）；出站支持发图/文件/语音（SDK 富媒体上传，AI 工具 `qqbot_send_image`）。
- **语音转写**：`voiceTranscription` 四档——`off` 忽略 / `note` 平台转写（`asr_refer_text`，推荐）/ `download` 注入音频地址 / `asr` 调用自定义转写服务（`asrEndpoint`）。
- **事件处理**：入群/加好友自动欢迎语（`welcomeEnabled` + `welcomeMessage`，`{nick}` 占位）；机器人消息被 🗑️ 表情回应时自动撤回（`reactionRecall`，需消息撤回权限）。
- **聊天命令**：`/help` `/status` `/new` `/stop` `/steer <指令>` `/session` `/记忆` `/清空记忆` `/撤回` `/广播 <内容>` `/定时 …`。
- **定时消息**：`/定时 每天 09:00 内容`、`/定时 间隔 30 内容`、`/定时 查看`、`/定时 取消 <序号>`；设置界面可新建/删除；**每个群最多 5 条**；也可让 AI 直接帮你设置。**AI 动态模式**：`mode=ai` 时 content 为生成指令，到点由 AI 在目标聊天生成内容后回复（如「每天早上总结昨日群聊」）。
- **群管理**：`bannedWords` 敏感词命中即撤回并跳过回复；`/广播` 向机器人已见过的所有群群发。
- **长期记忆**：每聊天持久记忆（`~/.dsh/qqbot/memory/`），跨 `/new` 保留；会话开始自动注入；AI 工具 `qqbot_memory_add/list/clear` + `/记忆` `/清空记忆` 命令。
- **可靠投递**：回复发送失败时剩余内容写入投递出箱（`~/.dsh/qqbot/outbox.json`），每 60s 重投（走主动消息通道），最多重试 5 次。
- **主动消息配额**：`quotaPerDay`（默认 50）按上海日计数；定时消息、欢迎语、出箱补发、AI 发图/发消息全部计入，超限自动停止并告警；`/status` 可查用量。
- **AI 工具**：`qqbot_schedule_list` / `qqbot_schedule_add`（支持 mode=ai）/ `qqbot_schedule_remove` / `qqbot_send_message` / `qqbot_send_image` / `qqbot_memory_add` / `qqbot_memory_list` / `qqbot_memory_clear`，通过 `exec.agent.id` 反查当前聊天，用户说「每天九点提醒我喝水」「记住这个群在准备团建」即可自动完成。
- **登录方式**：设置页扫码（官方 SDK）、终端 `dsh-qqbot login` 扫码、手动填写 AppID/AppSecret；凭据落盘 `~/.dsh/qqbot/credentials.json`（0600）并热生效。
- **设置界面**：dsh 设置 → **QQ 机器人**，可扫码、填凭据、选择会话工作区（文件夹浏览）、调行为配置、查定时消息。
- **消息归档**：`~/.dsh/qqbot/archive/archive-YYYY-MM.jsonl`，记录 inbound / reply / proactive / session，可在设置中开关。
- **被动回复**：按 `msg_id` + `msg_seq` 回复，遵守官方限额（群 5 分钟 / 5 次，单聊 60 分钟 / 4 次）；优先 Markdown（失败逐片降级纯文本），超长自动分片。
- **回复引用**：被动回复携带 `message_reference`（v2 透传字段，已实测生效），QQ 客户端渲染为可点击定位的原生引用气泡；平台拒绝时自动去引用重发并熔断。仅主动消息（无 msg_id）回退为文本引用「引用 昵称：原话」。范围由 `quoteReply` 控制（`at` 仅 @/单聊，`all` 全部）。同时本地维护 REFIDX 引用索引（`~/.dsh/qqbot/ref-index-<appId>.jsonl`），用户引用聊天中某条消息时，被引用原文恢复后注入模型上下文（标注为外部未信任数据）。
- **主动消息**：`POST /api/qqbot/send`（需 `adminToken`）；被动失败可配 `proactiveFallback` 兜底。主动消息配额极少，慎用。

## 依赖：webhook 运行时

QQ 消息要创建 DSH 会话，需要 `@deepseek-ai/dsh-webhook` 提供的 `ctx.webhookRuntime`：

- 宿主已启用 → 插件直接使用；
- 未启用 → 插件会尝试自行加载它（该包是可选 peer，随 dsh 安装自带）；
- 仍不可用 → 插件**降级运行**（不创建会话），dsh 正常启动，设置界面与 `/status` 可查；
  状态里 `sessionEnabled: false` 即表示这种状态。

推荐在 profile 中显式启用（web profile 的 `cordis.patch.yml`）：

```yaml
- insert:
    - id: webhook
      name: "@deepseek-ai/dsh-webhook"
```

## 安装

```sh
# 在 dsh web profile 中安装
dsh plugin --profile web add <本目录或 git 地址>
```

开发模式：`npm run deploy`（构建并同步到 `~/.dsh/profiles/web/node_modules/@sunjuntao/dsh-qqbot`）。

构建前需链接 dsh 类型依赖（`postinstall` 已自动执行）：

```sh
npm install          # 自动执行 link-dsh-deps
npm run typecheck    # 类型检查（含设置界面 tsx）
npm run build        # 仅产出 lib/index.js（host）+ lib/client.js（设置界面）
npm run build:cli    # 需要终端登录时单独构建 lib/cli.js（node bin/dsh-qqbot.mjs）
npm run build:types  # 类型声明输出到根 types/（可选）
```

## 目录结构

```
src/host/     插件运行时（bots/admin/rule/reply/schedule/qq(api+ws)…）
src/client/   设置界面（index.tsx + i18n.ts，挂 dsh 设置页「QQ 机器人」）
src/shared/   前后端共用（config / time / types）
src/cli.ts    终端凭据管理 CLI（build:cli 单独打包）
scripts/build/   构建脚本（build.mjs / build-cli.mjs）
scripts/deploy/  部署脚本（sync-to-profile.mjs / link-dsh-deps.mjs）
scripts/dev/     开发辅助（diag-qq-api.mjs / preview-add-page.mjs）
verify-client.mjs / render-verify.mjs   根级契约与渲染校验
```

## 配置

| 字段 | 默认 | 说明 |
|---|---|---|
| `appId` / `appSecret` | 环境 `QQBOT_APP_ID` / `QQBOT_APP_SECRET` | 机器人凭据（推荐扫码或 `secretEnv`） |
| `secretEnv` | — | AppSecret 的 DSH 凭据引用（优先级最高） |
| `adminToken` | — | `/send` 主动消息端点令牌 |
| `workspacePath` | 启动目录 | 会话工作区；设置页可点「选择…」浏览文件夹自选 |
| `agentPreset` / `agentPresetChat` | `default` / 跟随前者 | AT 用 Preset / 群全量非 @ 聊天用 Preset |
| `permissionPreset` | `default` | 会话权限 Preset |
| `model` | 部署默认 | 显式模型路由，`provider/model` 或 `provider/model:输出上限` |
| `allowC2c` | `true` | 是否接受单聊 |
| `allowGroups` / `allowUsers` | `["*"]` | 群 / 用户 openid 白名单 |
| `atContextMessages` | `10` | AT 消息附带的群聊上下文条数（0 关闭） |
| `groupBufferMax` | `50` | 每群全量消息缓冲条数 |
| `groupFullReply` | `true` | 群全量消息价值回复总开关 |
| `valueThreshold` | `5` | 价值评分阈值（0–10） |
| `groupCooldownMs` / `senderCooldownMs` | `60000` / `30000` | 同群 / 同人回复最小间隔 |
| `replyChunkChars` | `1000` | 单条回复分片最大字符数 |
| `maxRepliesPerMessage` | `5` | 每条消息最多被动回复次数（官方上限） |
| `markdownReply` | `true` | 优先 Markdown 回复，被拒降级纯文本 |
| `quoteReply` | `at` | 出站引用范围：`off` 不引用；`at` 仅 @/单聊（避免群全量刷屏，推荐）；`all` 全部回复都引用。原生引用气泡（可点击定位）；仅主动消息回退为文本引用 |
| `quoteMaxChars` | `120` | 文本引用的字数上限（仅主动消息回退文本引用时生效） |
| `archiveEnabled` | `true` | 消息本地归档（审计轨迹） |
| `proactiveFallback` | `false` | 被动回复失败时改用主动消息重发 |
| `multimodalInbound` | `true` | 入站图片/文件/语音附件注入会话上下文 |
| `voiceTranscription` | `note` | 语音处理：off / note / download / asr |
| `asrEndpoint` | — | 自定义语音转写服务（POST {url} → {text}） |
| `welcomeEnabled` / `welcomeMessage` | `false` / — | 入群/加好友欢迎语（{nick} 占位） |
| `reactionRecall` | `false` | 🗑️ 表情回应撤回机器人消息 |
| `bannedWords` | `[]` | 群消息敏感词（命中撤回并跳过回复） |
| `memoryEnabled` | `true` | 每聊天长期记忆（跨 /new） |
| `quotaPerDay` | `50` | 主动消息每日配额（0=不限） |

## 设置界面

dsh 设置 → **QQ 机器人**：

- **扫码登录**：生成二维码 SVG，手机 QQ 扫码即完成，凭据立即生效。
- **工作区**：只读路径 +「选择…」打开文件夹浏览器，可逐级进入子目录后「选定此文件夹」，保存后新建会话生效。
- **行为配置**：Preset、模型、白名单、冷却、阈值、分片、归档、Markdown 等。
- **定时消息**：按群查看/新建/取消，单群上限 5 条。

## QQ 开放平台侧配置

1. 开发设置拿到 `appId` / `secret`，配置 **IP 白名单**（回复走 OpenAPI 需要出口 IP 在白名单内）。
2. 消息接收为 WebSocket 长连接，q.qq.com **无需配置回调地址**。
3. 手机 QQ 群设置：机器人「可获取的群聊消息范围」设为全部、开启「机器人主动在群聊内发言」（如需主动消息/定时消息）。

## 已知边界

- 定时消息存在 `~/.dsh/qqbot/schedules.json`，调度精度 30 秒；进程未运行时不会触发。
- webhookRuntime 为进程内 fire-and-forget：进程崩溃会丢未入会话的消息，无重试队列。
- 群被动回复窗口只有 5 分钟，超长任务回复可能发送失败（可开 `proactiveFallback`，但注意主动消息配额）。
- 文件夹浏览器只列子目录（跳过以 `.` 开头的目录），不会创建或删除任何文件。

## License

MIT
