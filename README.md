# dsh-QQbot

把 [QQ 官方机器人](https://q.qq.com)（WebSocket 长连接模式）接入本机 [DeepSeek Harness（dsh）](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)。

```
QQ 群/单聊消息 ──WebSocket 长连接（主动外连，每机器人一条）──▶ dsh-qqbot ──webhookRuntime──▶ DSH 会话
QQ 聊天窗口 ◀──被动回复──── 回复泵（session/event，按来源机器人路由）◀── 助手回复
定时消息  ──30s 调度──▶ QQ 群/单聊（每日 / 固定间隔，由归属机器人发送）
```

## 功能

- **多机器人**：`~/.dsh/qqbot/bots.json` 是唯一事实来源，每个机器人独立凭据、独立行为配置、独立状态；全部启用的机器人**同时**保持 WebSocket 长连接（`BotRuntimeManager`），事件按归属路由（deliveryId→appId / sessionId→appId），回复、主动消息、定时消息都由来源机器人发送。同群里多个机器人各自判定、各自回复，互不共享上下文。
- **WebSocket 接收**：`@tencent-connect/qqbot-nodejs` 官方 SDK 长连接，本机主动拨出 QQ 网关收事件（心跳/断线重连/RESUME 续传），**无需公网 IP、域名与回调配置**；事件经 `ctx.webhookRuntime` 走 DSH 官方 webhook 通道创建会话。
- **群 AT 消息**（`GROUP_AT_MESSAGE_CREATE`）：@机器人直接回复，默认附带最近 10 条群聊记录作上下文（`atContextMessages` 可调，0 关闭），**可执行工具**。
- **群全量消息**（`GROUP_MESSAGE_CREATE`）：全部消息入环形缓冲；@机器人 → 跳过价值过滤直接回复（可执行工具）；非 @ 消息 → 价值评分过滤通过后**仅聊天/问答，不执行工具**（使用 `agentPresetChat`）。@ 判定三级：`mentions` bot 标记 → 已学习的本机器人该群 openid（AT 事件 content 首个 `<@id>` 自动学习并持久化到 `~/.dsh/qqbot/self-openids/<appId>.json`，多机器人同群时精确区分 @ 的是哪台）→ 该群从未 @ 过时回退宽匹配（含任意 `<@...>` 即算 @）。
- **单聊**（`C2C_MESSAGE_CREATE`）：创建 DSH 会话并回复。
- **会话复用**：同一群/单聊复用同一会话（`agent.followup`），`/new` 解绑重开。
- **多模态**：入站图片/文件/语音附件注入会话上下文（视觉模型可看图，语音优先用平台自带转写文本）；出站支持发图/文件/语音（SDK 富媒体上传，AI 工具 `qqbot_send_image` / `qqbot_send_file` / `qqbot_send_voice`）。
- **语音转写**：`voiceTranscription` 四档——`off` 忽略 / `note` 平台转写（`asr_refer_text`，推荐）/ `download` 注入音频地址 / `asr` 调用自定义转写服务（`asrEndpoint`）。
- **事件处理**：入群/加好友自动欢迎语（`welcomeEnabled` + `welcomeMessage`，`{nick}` 占位）；机器人消息被 🗑️ 表情回应时自动撤回（`reactionRecall`，需消息撤回权限）。
- **聊天命令**：`/help` `/status` `/new` `/stop` `/steer <指令>` `/session` `/记忆` `/清空记忆` `/撤回` `/广播 <内容>` `/定时 …`。
- **定时消息**：`/定时 每天 09:00 内容`、`/定时 间隔 30 内容`、`/定时 查看`、`/定时 取消 <序号>`；设置界面可新建/删除；**每个群最多 5 条**；也可让 AI 直接帮你设置。**AI 动态模式**：`mode=ai` 时 content 为生成指令，到点由 AI 在目标聊天生成内容后回复（如「每天早上总结昨日群聊」）。
- **群管理**：`bannedWords` 敏感词——群消息（@ 与全量均覆盖）命中即撤回原消息并跳过回复（需消息撤回权限，无权限时仅拦截回复）；`/广播` 向机器人已见过的所有群群发。
- **安全防护**：`sanitizeReplies` 回复净化——发送前剥离模型输出里的 `system-reminder`、`<think>` 等隐藏标签块，防止内部提示词与推理过程泄漏（归档与模型上下文保留原文）；`ssrfGuard` 媒体链接校验——AI 发图/文件/语音时拒绝内网与保留地址（含 DNS 解析后全记录校验，QQ 官方域名直通）；`localPathWhitelist` 本地路径白名单——本机文件仅允许工作区目录与插件数据目录内。
- **按群配置**：`groupOverrides` 按群 openid 覆盖行为字段（群全量回复/价值阈值/@ 上下文/双冷却/分片/回复上限/Markdown/记忆/聊天 Preset/敏感词），设置页可视化编辑、保存即生效；未覆盖字段跟随机器人默认。
- **长期记忆**：每聊天持久记忆（`~/.dsh/qqbot/memory/<chatKey>.md`，Markdown 格式，人可直接阅读编辑），跨 `/new` 保留；只存重要对话内容本身——不带日期与装饰符号，写入时自动剥离 emoji、markdown 标记与行首列表符；会话开始自动注入；AI 工具 `qqbot_memory_add/list/clear` + `/记忆` `/清空记忆` 命令。
- **可靠投递**：回复发送失败时剩余内容写入投递出箱（`~/.dsh/qqbot/outbox.json`），每 60s 重投（走主动消息通道），最多重试 5 次。
- **主动消息配额**：`quotaPerDay`（默认 50）按上海日计数；定时消息、欢迎语、出箱补发、AI 发消息/发图/发文件/发语音全部计入，超限自动停止并告警；`/status` 可查用量。
- **AI 工具**：`qqbot_schedule_list` / `qqbot_schedule_add`（支持 mode=ai）/ `qqbot_schedule_remove` / `qqbot_send_message` / `qqbot_send_image` / `qqbot_send_file` / `qqbot_send_voice` / `qqbot_memory_add` / `qqbot_memory_list` / `qqbot_memory_clear`，通过 `exec.agent.id` 反查当前聊天与来源机器人，用户说「每天九点提醒我喝水」「记住这个群在准备团建」即可自动完成。
- **登录方式**：设置页「添加机器人」——扫码（官方 SDK 下发凭据）或手动填写 AppID/AppSecret，凭据按机器人写入 `bots.json` 并立即热生效；`secretEnv`（DSH 凭据引用，优先级最高）在机器人详情中按机器人配置；终端 `dsh-qqbot login` 扫码写入 `credentials.json`（0600），作为 entry 单机器人模式的兜底凭据。
- **设置界面**：dsh 设置 → **QQ 机器人**，机器人列表卡片（主机器人标识 / 启用状态 / 连接状态）→ 点卡片进详情（连接状态、行为配置、运行统计、移除接入），支持添加 / 删除 / 启用停用 / 设为主机器人 / 重试连接。
- **消息归档**：`~/.dsh/qqbot/archive/archive-YYYY-MM.jsonl`，记录 inbound / reply / proactive / session，可在设置中开关。
- **被动回复**：按 `msg_id` + `msg_seq` 回复，遵守官方限额（群 5 分钟 / 5 次，单聊 60 分钟 / 4 次）；优先 Markdown（失败逐片降级纯文本），超长自动分片。
- **回复引用**：出站引用为**原生引用卡片**——按 `quoteReply` 范围（`at` 仅群 @，`all` 全部，`off` 不引用；单聊一律不引用）附带 `message_reference`，QQ 客户端渲染为可点击定位到用户原消息的引用卡片。带引用的消息走主动消息通道（不传 `msg_id`）：实测 `msg_id` 与 `message_reference` 同传时，手机端同一条内容会出现两次（电脑端正常）；仅 `msg_id` 则两端都不显示引用；仅 `message_reference` 是「有引用且内容只出现一次」的唯一组合。卡片仅在**平台明确拒绝**（HTTP 4xx，确定未创建消息）时降级为普通被动回复；结果不确定的失败（超时/网络/5xx）不重发，直接走投递出箱——结果不确定时重发正是「同一条内容出现两次」的来源。入站方向始终生效：本地维护 REFIDX 引用索引（`~/.dsh/qqbot/ref-index-<appId>.jsonl`），用户引用聊天中某条消息时，被引用原文恢复后注入模型上下文（标注为外部未信任数据）。
- **AI 报错提示**：AI 请求失败（如 API 余额不足、超时）时向来源聊天回复 `⚠️ AI 回复出错：<平台错误信息>`，不再静默无回复；已有部分正常文本则附加在文本之后。同一聊天 60 秒内最多提示一次，连续报错不刷屏。
- **主动消息**：`POST /qqbot/send`（需 `adminToken`，可带 `appId` 指定机器人）；被动失败可配 `proactiveFallback` 兜底。主动消息配额极少，慎用。

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

## 存储布局

```
~/.dsh/qqbot/bots.json            机器人库：primaryAppId + bots[]（凭据与行为配置每机器人独立）
~/.dsh/qqbot/global.json          全局配置：仅 adminToken
~/.dsh/qqbot/credentials.json     终端 dsh-qqbot login 的兜底凭据（0600）
~/.dsh/qqbot/schedules.json       定时消息（调度精度 30s）
~/.dsh/qqbot/memory/              每聊天长期记忆
~/.dsh/qqbot/archive/             消息归档（月度 jsonl）
~/.dsh/qqbot/outbox.json          投递出箱（失败重投）
~/.dsh/qqbot/ref-index-<appId>.jsonl   入站引用索引（每机器人一份）
```

## 配置

行为配置**按机器人独立**保存于 `bots.json`，设置页修改即改即生效（热更新，无需重启）；下表字段每个机器人各一份。`global.json` 只存 `adminToken`。

| 字段 | 默认 | 说明 |
|---|---|---|
| `appId` / `appSecret` | 每机器人独立（`bots.json`） | 机器人凭据，添加机器人时写入；环境变量 `QQBOT_APP_ID` / `QQBOT_APP_SECRET` 仅作 entry 模式兜底 |
| `secretEnv` | — | AppSecret 的 DSH 凭据引用（优先级最高，设置页机器人详情可编辑） |
| `adminToken` | — | `/send` 主动消息端点令牌（全局，`global.json`） |
| `workspacePath` | 启动目录 | 会话工作区；设置页可点「选择…」浏览文件夹自选 |
| `agentPreset` / `agentPresetChat` | `default` / 跟随前者 | AT 用 Preset / 群全量非 @ 聊天用 Preset |
| `permissionPreset` | `default` | 会话权限 Preset |
| `model` | 部署默认 | 显式模型路由，`provider/model` 或 `provider/model:输出上限` |
| `allowC2c` | `true` | 是否接受单聊 |
| `respondToBots` | `false` | 是否响应其他机器人发出的消息（QQ 群聊通常不向机器人推送其他机器人消息，仅平台确实推送时生效） |
| `allowGroups` / `allowUsers` | `["*"]` | 群 / 用户 openid 白名单 |
| `atContextMessages` | `10` | AT 消息附带的群聊上下文条数（0 关闭） |
| `groupBufferMax` | `50` | 每群全量消息缓冲条数 |
| `groupFullReply` | `true` | 群全量消息价值回复总开关 |
| `valueThreshold` | `5` | 价值评分阈值（0–10） |
| `groupCooldownMs` / `senderCooldownMs` | `60000` / `30000` | 同群 / 同人回复最小间隔 |
| `replyChunkChars` | `1000` | 单条回复分片最大字符数 |
| `maxRepliesPerMessage` | `5` | 每条消息最多被动回复次数（官方上限） |
| `markdownReply` | `true` | 优先 Markdown 回复，被拒降级纯文本 |
| `sanitizeReplies` | `true` | 发送前剥离 `system-reminder`/`<think>` 等隐藏标签块（出站防泄漏） |
| `quoteReply` | `at` | 出站引用范围（仅群聊生效，单聊一律不引用）：`off` 不引用；`at` 仅群 @ 回复（推荐）；`all` 群聊全部回复。引用为原生 `message_reference` 卡片，走主动消息通道（不传 `msg_id`，两者同传手机端内容会重复）；仅平台明确拒绝（HTTP 4xx）时降级普通被动回复，结果不确定的失败（超时/网络/5xx）不重发、走投递出箱 |
| `quoteMaxChars` | `120` | 引用原话注入上下文的字数上限（入站引用恢复用） |
| `archiveEnabled` | `true` | 消息本地归档（审计轨迹） |
| `proactiveFallback` | `false` | 被动回复失败时改用主动消息重发 |
| `multimodalInbound` | `true` | 入站图片/文件/语音附件注入会话上下文 |
| `voiceTranscription` | `note` | 语音处理：off / note / download / asr |
| `asrEndpoint` | — | 自定义语音转写服务（POST {url} → {text}） |
| `welcomeEnabled` / `welcomeMessage` | `false` / — | 入群/加好友欢迎语（{nick} 占位） |
| `reactionRecall` | `false` | 🗑️ 表情回应撤回机器人消息 |
| `bannedWords` | `[]` | 群消息敏感词（@ 与全量均覆盖；命中撤回并跳过回复） |
| `groupOverrides` | `{}` | 按群覆盖配置（群 openid → 行为字段子集：groupFullReply / valueThreshold / atContextMessages / 双冷却 / replyChunkChars / maxRepliesPerMessage / markdownReply / memoryEnabled / agentPresetChat / bannedWords；浅合并，群覆盖优先；设置页「按群配置」编辑） |
| `memoryEnabled` | `true` | 每聊天长期记忆（跨 /new） |
| `quotaPerDay` | `50` | 主动消息每日配额（0=不限） |

## 设置界面

dsh 设置 → **QQ 机器人**：

- **机器人列表**：卡片展示每个机器人的 AppID（脱敏）、接入方式、保存时间、主机器人标识与启用状态；支持设为主机器人 / 启用停用 / 删除。
- **添加机器人**：分段 Tab——扫码登录（生成二维码，手机 QQ 扫码即完成，凭据自动落盘）| 手动填写（AppID/AppSecret）。
- **机器人详情**：连接状态（含「重试连接」）、运行统计（按机器人持久化到 `~/.dsh/qqbot/stats/<appId>.json`，跨重启累计，每 10s 落盘一次，可「复位」清零）；行为配置——工作区（文件夹浏览）、模型、Agent Preset、群聊聊天 Preset、secretEnv、白名单、冷却、阈值、分片、归档、Markdown、敏感词、回复净化 / SSRF 防护 / 本地路径白名单安全开关等，即改即生效；**按群配置**卡片可为特定群单独覆盖行为字段（弹窗编辑，保存即生效）。
- **定时消息**：按群查看/新建/取消，单群上限 5 条。

## QQ 开放平台侧配置

1. 开发设置拿到 `appId` / `secret`，配置 **IP 白名单**（回复走 OpenAPI 需要出口 IP 在白名单内）。
2. 消息接收为 WebSocket 长连接，q.qq.com **无需配置回调地址**。
3. 手机 QQ 群设置：机器人「可获取的群聊消息范围」设为全部、开启「机器人主动在群聊内发言」（如需主动消息/定时消息）。

## 已知边界

- 定时消息存在 `~/.dsh/qqbot/schedules.json`，调度精度 30 秒；进程未运行时不会触发。
- webhookRuntime 为进程内 fire-and-forget：进程崩溃会丢未入会话的消息，无重试队列。
- 群被动回复窗口只有 5 分钟，超长任务回复可能发送失败（可开 `proactiveFallback`，但注意主动消息配额）。
- 群聊历史上下文（AT 附带记录 / 群全量缓冲）只回放**文本**，不含历史消息的图片/文件附件（仅触发消息本身带附件进上下文）。
- 文件夹浏览器只列子目录（跳过以 `.` 开头的目录），不会创建或删除任何文件。

## License

MIT
