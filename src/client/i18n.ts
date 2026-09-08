/**
 * dsh-qqbot 设置界面国际化。
 *
 * 契约对齐 @xmanrui/dsh-im 的 plugin-src/client/i18n.js：
 *  - 以界面源代码中的中文为源语言（zh 字典即 key 本身），EN 字典给出英文译文；
 *  - apply() 里经 ctx.locale.register(namespace, { zh, en }) 注册进宿主，
 *    ctx.locale.bind(namespace) 拿到翻译函数，随宿主语言切换实时生效；
 *  - UI 统一走本模块导出的 h()（React.createElement 包装）：字符串子节点与
 *    aria-label/alt/placeholder/title/label 属性在渲染时翻译；
 *  - 含插值的模板串（setNotice、confirm 等）经 localizeText 的动态规则翻译。
 */
import * as React from "react";

export const QQBOT_LOCALE_NAMESPACE = "dsh-qqbot";

const EN = Object.freeze({
  "$locale": "en",

  // ── 通用 / 通知 ──
  "未知错误": "Unknown error",
  "状态读取失败": "Failed to read status",
  "RPC 调用失败": "RPC call failed",
  "已设为主机器人": "Set as primary bot",
  "机器人已启用": "Bot enabled",
  "机器人已停用": "Bot disabled",
  "机器人已删除": "Bot removed",
  "已重新发起连接，请稍候查看状态": "Reconnection started; check the status shortly",
  "不限制": "No limit",
  "模型": "Model",
  "跟随 Host 默认": "Follow host default",
  "关闭": "Close",
  "取消": "Cancel",
  "刷新": "Refresh",
  "刷新中…": "Refreshing…",
  "加载中…": "Loading…",

  // ── 状态文案 ──
  "已停用": "Disabled",
  "已连接": "Connected",
  "正在连接": "Connecting",
  "未连接": "Not connected",
  "主机器人已连接": "Primary bot connected",
  "部分机器人已连接": "Some bots connected",
  "全部未连接": "All bots disconnected",
  "未配置机器人": "No bots configured",
  "主机器人": "Primary bot",
  "已启用": "Enabled",
  "未配置": "Not configured",
  "运行正常": "Running",
  "连接未就绪": "Connection not ready",
  "尚未检查": "Not checked yet",
  "QQ 连接未就绪，插件会自动重试。": "QQ connection not ready; the plugin will retry automatically.",
  "空闲": "Idle",
  "连接中": "Connecting",
  "重连中": "Reconnecting",
  "已断开": "Disconnected",
  "异常": "Error",

  // ── 列表视图 ──
  "＋ 添加机器人": "+ Add bot",
  "扫码接入": "Scan QR to connect",
  "手动填写": "Manual entry",
  "还没有配置成功的机器人": "No bot configured yet",
  "点击上方「＋ 添加机器人」，用手机 QQ 扫码，或手动填写 AppID / AppSecret。配置成功后即可在详情中设置行为参数。":
    "Click “+ Add bot” above, scan the QR code with the mobile QQ app, or enter the AppID / AppSecret manually. Once connected, behavior settings become available in the bot details.",
  "点击机器人卡片可进入详情：查看 QQ 连接状态、调整行为配置。":
    "Click a bot card to open its details: view the QQ connection status and adjust behavior settings.",

  // ── 扫码面板 ──
  "绑定成功": "Linked",
  "扫码失败": "QR scan failed",
  "正在刷新二维码": "Refreshing QR code",
  "等待手机 QQ 扫码": "Waiting for mobile QQ to scan",
  "二维码未生成": "QR code not generated",
  "用于绑定 QQ 机器人的一次性二维码": "One-time QR code for linking the QQ bot",
  "正在刷新二维码…": "Refreshing QR code…",
  "还没有生成二维码": "No QR code yet",
  "几秒后会自动出现新的一张": "A new one will appear in a few seconds",
  "点击下方「生成二维码」开始": "Click “Generate QR code” below to start",
  "二维码有效时间": "QR code valid for",
  "重新生成二维码": "Regenerate QR code",
  "生成二维码": "Generate QR code",
  "取消扫码": "Cancel scanning",
  "手机 QQ 扫码接入": "Scan with mobile QQ",
  "推荐方式。扫码后 QQ 会把机器人的 AppID 与 AppSecret 直接下发给本机 dsh，不需要手动复制，保存后立即生效。":
    "Recommended. After scanning, QQ delivers the bot’s AppID and AppSecret straight to the local dsh — nothing to copy by hand, and it takes effect immediately once saved.",
  "操作步骤": "Steps",
  "点击二维码下方的「生成二维码」，出现二维码后开始 5 分钟倒计时。":
    "Click “Generate QR code” below the QR area; a 5-minute countdown starts once it appears.",
  "打开手机 QQ，从右上角「＋」菜单进入「扫一扫」，扫描这张二维码。":
    "Open mobile QQ, tap “＋” in the top-right corner, choose “Scan”, and scan this code.",
  "按 QQ 页面提示完成确认，把这个机器人授权给本机 dsh 使用。":
    "Follow the QQ prompts to confirm and authorize this bot for the local dsh.",
  "本页每 2 秒检查一次结果，绑定成功后会自动进入机器人详情页。":
    "This page checks the result every 2 seconds and opens the bot details automatically once linked.",
  "二维码 5 分钟内有效；过期后会自动换一张新的，不需要手动刷新页面。":
    "The QR code is valid for 5 minutes; a new one is generated automatically when it expires — no need to refresh the page.",
  "扫码期间请保持本设置页打开，关闭页面会中断等待。":
    "Keep this settings page open while scanning; closing it interrupts the wait.",
  "凭据会写入 ~/.dsh/qqbot/credentials.json（仅当前用户可读），写入后立即生效，不需要重启 dsh。":
    "Credentials are written to ~/.dsh/qqbot/credentials.json (readable by the current user only), take effect immediately, and require no dsh restart.",

  // ── 手动填写面板 ──
  "手动填写 AppID / AppSecret": "Enter AppID / AppSecret manually",
  "适合已经在 QQ 开放平台创建过机器人的情况：先从开放平台把凭据复制出来，再回到这里填写保存。":
    "For bots already created on the QQ Open Platform: copy the credentials there first, then come back here to save them.",
  "第 1 步 · 在 QQ 开放平台取得凭据": "Step 1 · Get the credentials from the QQ Open Platform",
  "打开 QQ 开放平台": "Open the QQ Open Platform",
  "浏览器访问 q.qq.com，用 QQ 登录。": "Visit q.qq.com in a browser and sign in with QQ.",
  "选择机器人": "Pick the bot",
  "在机器人列表里点开要接入的机器人；还没有的话先创建一个。":
    "Open the bot you want to connect from the bot list; create one first if none exists.",
  "复制 AppID 与 AppSecret": "Copy the AppID and AppSecret",
  "进入该机器人的「开发设置」页面，复制 AppID（机器人 ID）与 AppSecret（机器人密钥）。":
    "Open the bot’s “Developer settings” page and copy the AppID (bot ID) and the AppSecret (bot key).",
  "第 2 步 · 填到这里并保存": "Step 2 · Fill them in here and save",
  "机器人 ID": "Bot ID",
  "开发设置里的机器人密钥": "The bot key from Developer settings",
  "保存并启用": "Save and enable",
  "保存后凭据写入 ~/.dsh/qqbot/credentials.json（权限 0600），立即生效，并自动设为当前使用的机器人。":
    "After saving, the credentials are written to ~/.dsh/qqbot/credentials.json (mode 0600), take effect immediately, and the bot becomes the primary one automatically.",
  "这里不会校验凭据是否正确。保存后请到机器人详情看「连接状态」：显示「运行正常」才是接通；未就绪就点「重试连接」。":
    "Credentials are not validated here. After saving, check “Connection status” in the bot details: “Running” means connected; if not ready, click “Retry connection”.",
  "消息接收走 WebSocket 长连接，开放平台不需要填回调地址；但机器人回复要走 OpenAPI，需要把本机出口 IP 加进开放平台的 IP 白名单。":
    "Messages are received over a WebSocket long connection, so no callback URL is needed on the Open Platform; but replies go through the OpenAPI, which requires adding this machine’s outbound IP to the platform’s IP allowlist.",
  "AppSecret 保存后不再回显；需要更换时重新填一次保存即可覆盖。":
    "The AppSecret is never shown again after saving; to change it, simply fill it in and save again to overwrite.",

  // ── 添加页 ──
  "← 返回列表": "← Back to list",
  "添加机器人": "Add bot",
  "两种方式任选其一：扫码由 QQ 自动下发凭据；手动填写需要你先去 QQ 开放平台复制 AppID / AppSecret。接入成功后凭据立即生效，并自动成为当前使用的机器人。":
    "Choose either way: scanning lets QQ deliver the credentials automatically; manual entry requires copying the AppID / AppSecret from the QQ Open Platform first. Once connected, the credentials take effect immediately and the bot becomes the primary one.",

  // ── 详情页骨架 ──
  "机器人详情": "Bot details",
  "连接状态 · 行为配置 · 运行统计": "Connection status · Behavior settings · Run statistics",
  "未选择机器人": "No bot selected",
  "连接状态": "Connection status",
  "最近连接": "Last connected",
  "QQ 机器人": "QQ Bot",
  "QQ 机器人设置": "QQ Bot settings",
  "把 QQ 机器人接入 DeepSeek Harness": "Connect QQ bots to DeepSeek Harness",

  // ── 运行统计 ──
  "运行统计": "Run statistics",
  "本次 Host 启动以来的累计计数；数值不会自动刷新，需要时点「刷新」。":
    "Cumulative counters since the host started; they do not refresh automatically — click “Refresh” when needed.",
  "收到消息": "Messages received",
  "创建会话": "Sessions created",
  "被动回复": "Passive replies",
  "主动消息": "Proactive messages",
  "绑定会话": "Bound sessions",
  "待回复队列": "Reply queue",
  "群消息缓冲": "Group buffer",
  "错误": "Errors",

  // ── 会话与模型 ──
  "会话与模型": "Session & model",
  "决定这个机器人以什么身份、在哪个目录、用哪个模型干活；每个机器人彼此独立，改动只对之后新建的会话生效。":
    "Controls which identity, directory, and model this bot works with; each bot is independent, and changes apply only to newly created sessions.",
  "工作区目录": "Workspace directory",
  "QQ 消息创建的会话都在这个目录里读写文件。留空则使用默认工作区；改动只对新建会话生效。":
    "Sessions created from QQ messages read and write files inside this directory. Leave empty for the default workspace; changes apply only to new sessions.",
  "选择目录": "Choose directory",
  "默认工作区（~/.dsh/file）": "Default workspace (~/.dsh/file)",
  "这个机器人会话使用的模型；留空则跟随宿主默认模型。切换后已有会话需要重置才会生效。":
    "The model used by this bot’s sessions; leave empty to follow the host default. Existing sessions need a reset for the change to apply.",
  "跟随默认模型": "Follow default model",
  "决定机器人的行事风格与可用工具。@ 机器人和单聊消息都走这个 Preset；群里非 @ 的回复走聊天 Preset，不会执行工具。":
    "Sets the bot’s behavior style and available tools. @-mentions and direct messages use this Preset; non-@ group replies use the chat preset and never run tools.",

  // ── 消息与回复策略（开关）──
  "消息与回复策略": "Message & reply policy",
  "控制这个机器人「听哪些消息、怎么回」，每个机器人彼此独立。所有开关改完立即生效，不需要重启。":
    "Controls which messages this bot listens to and how it replies; each bot is independent. Every switch takes effect immediately — no restart needed.",
  "群全量消息回复": "Reply to all group messages",
  "开启后，群里没有 @ 机器人的消息也会参与价值评分，达到阈值才回复；@ 机器人的消息始终回复并可使用工具。关闭后，机器人只处理 @ 它的群消息。":
    "When on, group messages that do not @ the bot also go through value scoring and get a reply only above the threshold; @-mentions are always answered and can use tools. When off, only messages that @ the bot are processed.",
  "接受单聊消息": "Accept direct messages",
  "是否响应 QQ 私聊（C2C）消息。关闭后机器人只处理群消息，私聊一律忽略。":
    "Whether to respond to QQ direct (C2C) messages. When off, the bot processes group messages only and ignores DMs.",
  "Markdown 回复": "Markdown replies",
  "优先以 QQ Markdown 格式发送，排版更好看；若平台拒绝该格式，会自动降级为纯文本重发，不会丢消息。":
    "Send in QQ Markdown format first for nicer layout; if the platform rejects it, the message is resent as plain text automatically — nothing is lost.",
  "回复引用原话": "Quote the user's message",
  "回复以原生引用气泡指向触发消息（点击可跳转定位到被引用的那句话）；仅主动消息（如定时任务回复）无法原生引用，回退为文本引用（Markdown 引用块 /「昵称：原话」）。off=不引用；at=仅 @/单聊（避免群全量刷屏，推荐）；all=全部回复都引用。此外，用户引用聊天里某条消息时，被引用的原文会始终注入模型上下文，让它知道对方在回应什么。":
    "Replies point at the triggering message with a native quote bubble (click it to jump to the quoted message). Only proactive messages (e.g. scheduled-task replies) cannot carry a native reference and fall back to a text quote (Markdown blockquote / “nickname: message”). off = no quote; at = @-mentions & DMs only (avoids group flooding, recommended); all = every reply. Also, when a user quotes another message in chat, the quoted text is always injected into the model's context so it knows what the user is responding to.",
  "回复引用原话范围": "Quote reply scope",
  "off（不引用）": "off (no quote)",
  "at（仅 @/单聊，推荐）": "at (@ & DMs only, recommended)",
  "all（全部回复）": "all (every reply)",
  "引用字数上限": "Quote preview length",
  "文本引用最多显示多少字（仅主动消息回退为文本引用时使用；原生引用气泡由 QQ 客户端自行截断），超出部分以省略号结尾。":
    "How many characters of the quoted text to show at most (used only when a proactive message falls back to a text quote; the native quote bubble is truncated by the QQ client itself). Longer text ends with an ellipsis.",

  // ── 新功能开关（多模态 / 记忆 / 欢迎语 / 表情撤回 / 语音 / 敏感词 / 配额）──
  "主动消息日配额": "Daily proactive quota",
  "单日最多发送多少条主动消息（定时消息、欢迎语、出箱补发、AI 发图都计入）。0 表示不限制——但 QQ 平台主动消息配额极少，超发会被限流，建议保持默认 50。":
    "How many proactive messages may be sent per day at most (scheduled messages, welcome greetings, outbox redelivery, and AI-sent images all count). 0 means unlimited — but the QQ platform's proactive quota is tiny; over-sending gets rate-limited. Keep the default 50.",
  "多模态消息": "Multimodal messages",
  "群里/私聊发来的图片、文件、语音会以附件形式注入会话上下文：视觉模型可以直接看图，语音优先使用平台自带转写文本。关闭后非文字内容只保留占位说明。":
    "Images, files, and voice from groups/DMs are injected into the session context as attachments: vision models can see the images directly, and voice uses the platform's built-in transcript first. When off, non-text content is reduced to a placeholder note.",
  "长期记忆": "Long-term memory",
  "每个群/单聊维护一份持久记忆（跨 /new 保留）。对话里说「记住某事」AI 会自动写入；用 /记忆 查看、/清空记忆 清空。":
    "Each group/DM keeps a persistent memory (survives /new). Say “remember something” in chat and the AI writes it down automatically; use /记忆 to view and /清空记忆 to clear it.",
  "欢迎语": "Welcome message",
  "新成员进群或新好友添加时，机器人自动发送欢迎语（文案见下方输入框，{nick} 会替换为对方标识）。走主动消息通道，消耗每日配额。":
    "When a new member joins a group or adds the bot as a friend, the bot sends a welcome message automatically (text in the input below; {nick} is replaced with their identifier). Sent via the proactive channel and counts against the daily quota.",
  "表情撤回": "Emoji-recall",
  "任何人对机器人发出的消息点 🗑️ 表情回应，机器人就撤回那条消息（需要平台的「消息撤回」权限）。":
    "Anyone reacting 🗑️ to a message the bot sent makes the bot recall that message (requires the platform's “message recall” permission).",
  "语音消息处理": "Voice message handling",
  "收到语音消息时如何处理：off=忽略；note=使用平台自带的转写文本（推荐，无转写时显示占位）；download=把音频地址注入上下文；asr=调用下方自定义转写服务（POST {url} → {text}）。":
    "How to handle incoming voice messages: off = ignore; note = use the platform's built-in transcript (recommended; shows a placeholder when none); download = inject the audio URL into context; asr = call the custom transcription service below (POST {url} → {text}).",
  "语音消息处理方式": "Voice message handling mode",
  "off（忽略语音）": "off (ignore voice)",
  "note（平台转写，推荐）": "note (platform transcript, recommended)",
  "download（注入音频地址）": "download (inject audio URL)",
  "asr（自定义转写服务）": "asr (custom transcription service)",
  "自定义转写服务": "Custom transcription service",
  "voiceTranscription=asr 时使用的 HTTP 服务地址：机器人 POST { url: <音频地址> }，服务返回 { text: <转写文本> }。留空则回退为占位说明。":
    "HTTP service used when voiceTranscription=asr: the bot POSTs { url: <audio URL> } and the service returns { text: <transcript> }. Leave empty to fall back to a placeholder note.",
  "https://…（留空不启用）": "https://… (leave empty to disable)",
  "自定义转写服务地址": "Custom transcription service URL",
  "欢迎语文案": "Welcome text",
  "开启「欢迎语」后发送的内容；{nick} 会替换为新成员标识。留空使用默认文案「欢迎 {nick}！@我即可与我对话。」。":
    "Content sent when “Welcome message” is on; {nick} is replaced with the new member's identifier. Leave empty to use the default “Welcome {nick}! @me to chat with me.”.",
  "欢迎 {nick}！@我即可与我对话。": "Welcome {nick}! @me to chat with me.",
  "敏感词列表": "Banned words",
  "逗号分隔。群消息包含其中任意一词时，机器人撤回该消息并跳过回复（需要消息撤回权限；无权限时仅拦截回复）。":
    "Comma-separated. If a group message contains any of these words, the bot recalls the message and skips replying (requires message-recall permission; without it, only the reply is blocked).",
  "词1, 词2（留空不启用）": "word1, word2 (leave empty to disable)",
  "0（不限）": "0 (unlimited)",
  "被动失败转主动消息": "Fall back to proactive messages",
  "被动回复超时或失败时，改用主动消息接口补发一次。主动消息每日配额极少，仅在排查问题时临时开启。":
    "When a passive reply times out or fails, retry once via the proactive-message API. The daily proactive quota is tiny — enable only temporarily while debugging.",
  "消息本地归档": "Local message archive",
  "把收到的消息与发出的回复写入 ~/.dsh/qqbot/archive/，作为审计轨迹留档，方便事后排查。":
    "Writes received messages and sent replies to ~/.dsh/qqbot/archive/ as an audit trail for later troubleshooting.",

  // ── 回复调优 ──
  "回复调优": "Reply tuning",
  "调节这个机器人「回得多不多、切得多碎」，每个机器人彼此独立。改完立即生效，建议先按默认值跑一段时间再微调。":
    "Tunes how often this bot replies and how finely replies are split; each bot is independent. Changes apply immediately — run with defaults for a while before fine-tuning.",
  "0（全部回复）": "0 (reply to all)",
  "0（关闭）": "0 (off)",
  "群消息价值阈值": "Group message value threshold",
  "AT 上下文条数": "AT context messages",
  "群回复最小间隔": "Min group reply interval",
  "同人回复间隔": "Same-sender reply interval",
  "分片字符数": "Chunk size (chars)",
  "每条消息最大回复": "Max replies per message",
  "0–10 分。机器人给每条群消息打分，只有达到分数才会回复；分数越高越安静。设为 0 表示群里所有消息都回复（容易刷屏）。@ 机器人的消息不受此限制，一定会回复。":
    "0–10 points. The bot scores every group message and replies only when the score is reached; the higher the score, the quieter the bot. 0 means it replies to every group message (prone to flooding). Messages that @ the bot bypass this and always get a reply.",
  "@ 机器人时，额外附带群里最近 N 条消息一起送给模型，让它听懂上下文。设为 0 则只发送被 @ 的这一条。条数越多越聪明，也越耗 token。":
    "When the bot is @-mentioned, the latest N group messages are attached for context so the model understands the conversation. 0 sends only the @-mention itself. More context is smarter but costs more tokens.",
  "同一个群里，两次「非 @ 触发」的回复之间至少要隔这么久，用来防止机器人刷屏。@ 机器人的回复不受限制。":
    "In one group, two replies triggered without an @-mention are at least this far apart, preventing flooding. @-mention replies are not throttled.",
  "同一个人在这么短的时间内不会被回复第二次，避免被同一个人连续刷屏。":
    "The same person will not get a second reply within this window, preventing one user from spamming the bot.",
  "QQ 单条消息有长度限制，超长的回复会按这个字数切成多条依次发送。太小会切得很碎，太大会被平台截断。":
    "A single QQ message has a length limit; longer replies are split into chunks of this size and sent in order. Too small splits messages into fragments; too large gets truncated by the platform.",
  "一条用户消息最多触发几次被动回复（QQ 平台硬上限为 5）。调小可以避免机器人一次性连发多条。":
    "How many passive replies one user message may trigger at most (the QQ platform hard-caps at 5). Lower it to avoid the bot sending many messages at once.",

  // ── 连接与移除 ──
  "连接与移除": "Connection & removal",
  "管理机器人的启用状态、设为主机器人、重建 QQ 长连接，或删除接入配置。":
    "Manage the bot’s enabled state, set it as primary, rebuild the QQ long connection, or delete the integration.",
  "停用此机器人": "Disable this bot",
  "启用此机器人": "Enable this bot",
  "停用的机器人不会建立 QQ 长连接，也不会接收或回复消息；其它已启用的机器人不受影响。":
    "A disabled bot keeps no QQ long connection and neither receives nor replies to messages; other enabled bots are unaffected.",
  "停用": "Disable",
  "启用": "Enable",
  "未显式指定机器人时（配置编辑、主动消息、定时任务），默认作用于主机器人。所有「已启用」的机器人都会同时接收并回复消息。":
    "When no bot is specified explicitly (config editing, proactive messages, scheduled tasks), the primary bot is the default. All enabled bots receive and reply simultaneously.",
  "检查连接": "Check connection",
  "重试连接": "Retry connection",
  "按当前凭据重新建立 QQ WebSocket 长连接。收不到消息时先点它排查。":
    "Rebuilds the QQ WebSocket long connection with the current credentials. Click this first when messages stop arriving.",
  "检查中…": "Checking…",
  "移除接入": "Remove integration",
  "删除这个机器人的凭据与配置，删除后它会立刻停止接收消息，且无法撤销。":
    "Deletes this bot’s credentials and configuration. It stops receiving messages immediately and the action cannot be undone.",

  // ── 目录选择弹窗 ──
  "选择工作区目录": "Choose workspace directory",
  "逐级浏览并选定机器人读取文件的文件夹":
    "Browse level by level and pick the folder the bot may read files from",
  "正在读取目录…": "Reading directory…",
  "上一级": "Up one level",
  "单击选中，双击进入": "Click to select, double-click to enter",
  "该目录下没有子文件夹": "No subfolders in this directory",
  "单击选中，双击进入；未选中时选定当前浏览的目录":
    "Click to select, double-click to enter; with nothing selected, the currently browsed directory is chosen",
  "选定此文件夹": "Choose this folder",

  // ── 补齐：扫码步骤标题 / 设为主机器人按钮 / 补充说明小标题（实现时遗漏）──
  "说明": "Note",
  "手机 QQ 扫一扫": "Scan with mobile QQ",
  "在 QQ 里确认绑定": "Confirm in QQ",
  "等待自动跳转": "Wait for auto-redirect",
  "设为主机器人": "Set as primary bot",
});

export const en = EN;
export const zh = Object.freeze(Object.fromEntries(
  Object.keys(EN).map((key) => [key, key === "$locale" ? "zh" : key]),
) as Record<string, string>);

let translate: (key: string) => string = (key) => key;

/** 注入宿主翻译函数（ctx.locale.bind(namespace)）；传空则退化为原样返回。 */
export function setTranslator(next?: (key: string) => string) {
  translate = typeof next === "function" ? next : (key) => key;
}

export function isEnglish() {
  return translate("$locale") === "en";
}

/** 含插值的中文模板串 → 英文（仅英文环境下走到这里）。 */
function translateDynamic(text: string): string {
  let m: RegExpExecArray | null;
  m = /^保存失败：(.+)$/.exec(text);
  if (m) return `Save failed: ${m[1]}`;
  m = /^操作失败：(.+)$/.exec(text);
  if (m) return `Operation failed: ${m[1]}`;
  m = /^删除失败：(.+)$/.exec(text);
  if (m) return `Removal failed: ${m[1]}`;
  m = /^重试失败：(.+)$/.exec(text);
  if (m) return `Retry failed: ${m[1]}`;
  m = /^已配置机器人（(\d+)）$/.exec(text);
  if (m) return `Configured bots (${m[1]})`;
  m = /^扫码成功，AppID (.+) 已启用$/.exec(text);
  if (m) return `QR link succeeded; AppID ${m[1]} is enabled`;
  m = /^凭据已保存，AppID (.+) 已启用$/.exec(text);
  if (m) return `Credentials saved; AppID ${m[1]} is enabled`;
  m = /^工作区已保存：(.+)（对新建会话生效）$/.exec(text);
  if (m) return `Workspace saved: ${m[1]} (applies to new sessions)`;
  m = /^确定删除机器人 (.+)？删除后该机器人停止接收消息。$/.exec(text);
  if (m) return `Remove bot ${m[1]}? It will stop receiving messages after removal.`;
  m = /^QQ 连接未就绪：(.+)。插件会自动重试。$/.exec(text);
  if (m) return `QQ connection not ready: ${m[1]}. The plugin will retry automatically.`;
  m = /^(扫码接入|手动填写) · 保存于 (.+)$/.exec(text);
  if (m) return `${localizeText(m[1])} · saved at ${m[2]}`;
  m = /^保存于 (.+)$/.exec(text);
  if (m) return `Saved at ${m[1]}`;
  m = /^([\d.]+) 分钟$/.exec(text);
  if (m) return `${m[1]} min`;
  m = /^([\d.]+) 秒$/.exec(text);
  if (m) return `${m[1]} s`;
  m = /^(\d+) 分$/.exec(text);
  if (m) return `${m[1]} pt`;
  m = /^(\d+) 条$/.exec(text);
  if (m) return `${m[1]} msgs`;
  m = /^(\d+) 字$/.exec(text);
  if (m) return `${m[1]} chars`;
  m = /^(\d+) 条\/天$/.exec(text);
  if (m) return `${m[1]}/day`;
  return text;
}

/** 翻译任意文案：先查精确字典，未命中且为英文环境时走动态规则。 */
export function localizeText(value: string): string {
  if (typeof value !== "string") return value;
  const exact = translate(value);
  if (exact !== value || !isEnglish()) return exact;
  return translateDynamic(value);
}

/** 需要翻译的属性名（对齐 dsh-im，另加 optgroup 的 label）。 */
const LOCALIZED_PROPS: ReadonlyArray<string> = Object.freeze([
  "aria-label",
  "alt",
  "placeholder",
  "title",
  "label",
]);

function localizeChild(child: any): any {
  if (typeof child === "string") return localizeText(child);
  if (Array.isArray(child)) return child.map(localizeChild);
  return child;
}

/**
 * React.createElement 的本地化包装：字符串子节点与指定字符串属性
 * 在渲染时翻译。设置界面的所有元素都应通过它创建。
 */
export function h(type: any, props: any = {}, ...children: any[]) {
  let localizedProps = props;
  if (props) {
    for (const key of LOCALIZED_PROPS) {
      if (typeof props[key] === "string") {
        if (localizedProps === props) localizedProps = { ...props };
        localizedProps[key] = localizeText(props[key]);
      }
    }
  }
  return React.createElement(type, localizedProps, ...children.map(localizeChild));
}
