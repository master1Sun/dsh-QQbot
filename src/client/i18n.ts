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
  "确定": "OK",
  "确认操作": "Confirm",
  "确认删除": "Delete",
  "确认禁用": "Disable",
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
  "未选择机器人": "No bot selected",
  "连接状态": "Connection status",
  "最近连接": "Last connected",
  "QQ 机器人": "QQ Bot",
  "QQ 机器人设置": "QQ Bot settings",
  "把 QQ 机器人接入 DeepSeek Harness": "Connect QQ bots to DeepSeek Harness",

  // ── 运行统计 ──
  "运行统计": "Run statistics",
  "该机器人的持久运行计数（重启不清零）；数值不会自动刷新，需要时点「刷新」。":
    "Persistent run counters for this bot (kept across restarts); they do not refresh automatically — click “Refresh” when needed.",
  "复位": "Reset",
  "复位中…": "Resetting…",
  "把该机器人的运行计数清零（立即生效并落盘）":
    "Zero out this bot's run counters (takes effect and persists immediately)",
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
  "决定机器人的行事风格与可用工具。@ 机器人和单聊消息都走这个 Preset；群里非 @ 的回复走聊天 Preset（默认跟随本 Preset，仅可在 bots.json 配置），不会执行工具。":
    "Sets the bot’s behavior style and available tools. @-mentions and direct messages use this Preset; non-@ group replies use the chat preset (follows this Preset by default, configurable only in bots.json) and never run tools.",

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
  "响应机器人消息": "Respond to bot messages",
  "开启后，其他机器人发出的消息也会触发本机器人回复。默认关闭：其他机器人的消息一律忽略，防止同群的多个机器人互相触发、循环刷屏。注意 QQ 平台在群聊里通常不向机器人推送其他机器人的消息，此开关只在平台确实推送时才有实际效果。":
    "When on, messages sent by other bots can also trigger replies from this bot. Off by default: other bots' messages are always ignored, preventing multiple bots in the same group from triggering each other in a loop. Note: the QQ platform usually does not push other bots' messages to a bot in groups, so this switch only takes effect when the platform actually delivers them.",
  "Markdown 回复": "Markdown replies",
  "优先以 QQ Markdown 格式发送，排版更好看；若平台拒绝该格式，会自动降级为纯文本重发，不会丢消息。":
    "Send in QQ Markdown format first for nicer layout; if the platform rejects it, the message is resent as plain text automatically — nothing is lost.",
  "回复引用原话": "Quote the user's message",
  "回复以 QQ 原生引用卡片定位到用户那条原消息（message_reference，走主动消息通道发送，不与 msg_id 同传——手机端两者同传会堆叠重复引用）。仅群聊生效，单聊一律不引用：off=不引用；at=仅群 @ 回复（推荐）；all=群聊全部回复。卡片发送失败时自动降级为普通被动回复（无卡片，内容不丢）。此外，用户引用聊天里某条消息时，被引用的原文会始终注入模型上下文，让它知道对方在回应什么。":
    "Replies quote the user's original message via QQ's native quote card (message_reference), sent over the proactive-message channel without msg_id — sending both together makes mobile QQ show the same content twice. Group chats only — DMs are never quoted: off = no quote; at = group @-mentions only (recommended); all = every group reply. If the card fails to send, the reply falls back to a plain passive reply (no card, nothing lost). Also, when a user quotes another message, the quoted text is always injected into the model context.",
  "回复引用原话范围": "Quote reply scope",
  "off（不引用）": "off (no quote)",
  "at（仅群 @，推荐）": "at (group @-mentions only, recommended)",
  "all（群聊全部回复）": "all (every group reply)",
  "引用字数上限": "Quote preview length",
  "文本引用最多显示多少字（仅主动消息回退为文本引用时使用；原生引用气泡由 QQ 客户端自行截断），超出部分以省略号结尾。":
    "How many characters of the quoted text to show when a reply falls back to a text quote (proactive messages only; native quote cards are truncated by the QQ client itself); longer text ends with an ellipsis.",

  // ── 群聊聊天 Preset / secretEnv 凭据引用 ──
  "群聊聊天 Preset": "Group chat preset",
  "群内非 @ 的全量消息（只聊天、不执行工具）使用的 Preset；留空则跟随上方 Agent Preset。用于让群全量回复风格与 @/单聊区分开。":
    "Preset used for full group messages that do not @ the bot (chat only, no tools); leave empty to follow the Agent Preset above. Use it to give group-wide replies a style distinct from @-mentions and DMs.",
  "跟随 Agent Preset": "Follow Agent Preset",
  "AppSecret 凭据引用（secretEnv）": "AppSecret credential reference (secretEnv)",
  "AppSecret 凭据引用": "AppSecret credential reference",
  "DSH 凭据引用作为 AppSecret 的替代来源（优先级高于明文 AppSecret）。填写后机器人在运行时凭此引用解析出真实密钥，无需在开放平台明文保存。留空则使用扫码/手动填写的 AppSecret。":
    "A DSH credential reference used instead of a plaintext AppSecret (takes priority over it). When set, the bot resolves the real secret from this reference at runtime, so no plaintext secret needs to be kept on the open platform. Leave empty to use the AppSecret from QR login / manual entry.",
  "如 my-qq-app-secret（留空不启用）": "e.g. my-qq-app-secret (leave empty to disable)",

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
  "收到语音消息时如何处理：off=忽略；note=使用平台自带的转写文本（推荐，无转写时显示占位）；download=把音频地址注入上下文；asr=调用下方自定义转写服务（POST {url} → {text}）；stt=下载语音本地转码后调用 OpenAI 兼容 /audio/transcriptions 转写（失败自动回退平台转写文本）。":
    "How to handle incoming voice messages: off = ignore; note = use the platform's built-in transcript (recommended; shows a placeholder when none); download = inject the audio URL into context; asr = call the custom transcription service below (POST {url} → {text}); stt = download the audio, convert it locally and call an OpenAI-compatible /audio/transcriptions endpoint (falls back to the platform transcript on failure).",
  "语音消息处理方式": "Voice message handling mode",
  "off（忽略语音）": "off (ignore voice)",
  "note（平台转写，推荐）": "note (platform transcript, recommended)",
  "stt（STT 服务自动转写）": "stt (auto-transcribe via STT service)",
  "download（注入音频地址）": "download (inject audio URL)",
  "asr（自定义转写服务）": "asr (custom transcription service)",
  "自定义转写服务": "Custom transcription service",
  "voiceTranscription=asr 时使用的 HTTP 服务地址：机器人 POST { url: <音频地址> }，服务返回 { text: <转写文本> }。留空则回退为占位说明。":
    "HTTP service used when voiceTranscription=asr: the bot POSTs { url: <audio URL> } and the service returns { text: <transcript> }. Leave empty to fall back to a placeholder note.",
  "https://…（留空不启用）": "https://… (leave empty to disable)",
  "自定义转写服务地址": "Custom transcription service URL",
  "STT 服务地址（Base URL）": "STT service base URL",
  "voiceTranscription=stt 时使用，OpenAI 兼容的接口根地址（不含 /audio/transcriptions 后缀）。语音会先下载到本地（SILK 自动转 WAV）再上传转写。":
    "Used when voiceTranscription=stt: the root URL of an OpenAI-compatible endpoint (without the /audio/transcriptions suffix). Voice files are downloaded locally (SILK auto-converted to WAV) before being uploaded for transcription.",
  "STT 服务地址": "STT service base URL",
  "https://api.openai.com/v1（留空不启用）": "https://api.openai.com/v1 (leave empty to disable)",
  "STT 服务 API Key": "STT service API key",
  "voiceTranscription=stt 时使用，以 Bearer 方式携带。仅保存在本机 bots.json，不会随消息外发（转写请求除外）。":
    "Used when voiceTranscription=stt, sent as a Bearer token. Stored only in the local bots.json and never sent with messages (except the transcription request itself).",
  "sk-…（留空不启用）": "sk-… (leave empty to disable)",
  "STT 模型": "STT model",
  "voiceTranscription=stt 时使用的转写模型名，如 whisper-1。": "Transcription model used when voiceTranscription=stt, e.g. whisper-1.",
  "TTS 服务地址（Base URL）": "TTS service base URL",
  "开启「语音回复」时使用，OpenAI 兼容的接口根地址（不含 /audio/speech 后缀）。合成的 WAV 语音直接作为 QQ 语音消息发送。":
    "Used when “Text-to-speech replies” is on: the root URL of an OpenAI-compatible endpoint (without the /audio/speech suffix). The synthesized WAV is sent directly as a QQ voice message.",
  "TTS 服务地址": "TTS service base URL",
  "TTS 服务 API Key": "TTS service API key",
  "开启「语音回复」时使用，以 Bearer 方式携带。仅保存在本机 bots.json。":
    "Used when “Text-to-speech replies” is on, sent as a Bearer token. Stored only in the local bots.json.",
  "TTS 模型 / 发音人": "TTS model / voice",
  "TTS 模型名（如 tts-1）与发音人（voice，如 alloy / nova / shimmer）。":
    "TTS model name (e.g. tts-1) and voice (e.g. alloy / nova / shimmer).",
  "正在输入状态": "Typing indicator",
  "私聊收到消息后，AI 处理期间向对方显示「对方正在输入…」（QQ 平台能力仅限单聊），回复发出后自动停止；处理超过 5 分钟自动关闭以防状态永挂。发送失败不影响正常回复。":
    "When a DM arrives, shows “typing…” to the other side while the AI is processing (QQ platform capability is DM-only); stops automatically once the reply is sent, or after 5 minutes as a failsafe. Send failures never affect normal replies.",
  "语音回复（文字转语音）": "Voice replies (text-to-speech)",
  "私聊回复自动经 TTS 服务合成语音气泡发送（QQ 平台语音消息仅支持单聊，群聊仍发文字）。需配置下方 TTS 服务（OpenAI 兼容 /audio/speech）；合成或发送失败自动回退文字回复，内容不丢。":
    "DM replies are automatically synthesized into voice bubbles via the TTS service (QQ voice messages are DM-only; groups still get text). Requires the TTS service below (OpenAI-compatible /audio/speech); on synthesis or send failure the bot falls back to the text reply — no content is lost.",
  "TTS 模型名": "TTS model",
  "TTS 发音人": "TTS voice",
  "按钮审批": "Button approvals",
  "AI 执行敏感操作前可发送「✅允许 / ❌拒绝」按钮消息，点击即回传决定；超时未点击视为拒绝。审批消息占用主动消息配额。":
    "Before performing sensitive operations the AI can send a “✅ Allow / ❌ Deny” button message; a click returns the decision immediately, and no click within the timeout counts as denial. Approval messages consume the proactive-message quota.",
  "文件内容识别": "File content ingestion",
  "收到文本类文件（txt/md/json/csv/代码等，≤1MB）时自动下载并截取正文注入模型上下文，AI 直接读懂文件内容再回复；二进制文件（docx/pdf 等）仅列文件名。需配合「附件转发」开关。":
    "When a text-like file (txt/md/json/csv/code, ≤1MB) arrives, its content is downloaded and excerpted into the model context so the AI can read it before replying; binary files (docx/pdf etc.) are listed by name only. Requires the “Attachment forwarding” switch.",
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

  // ── 概览第一行按钮 + 定时/归档弹窗（范围 Tab、分组标题、时间轴角色）──
  "定时消息": "Scheduled",
  "消息归档": "Archive",
  "当前机器人": "Current bot",
  "所有机器人": "All bots",
  "群聊任务": "Group tasks",
  "单聊任务": "Direct chats",
  "用户": "User",
  "机器人": "Bot",
  "上次失败": "Last failed",

  // ── 定时消息编辑表单（字段 + 提示）──
  "发送范围": "Target chat",
  "发送到群聊还是单聊。改动范围后请确认下方 openid 与之匹配。":
    "Send to a group or a direct chat. After changing this, make sure the openid below matches.",
  "群聊": "Group",
  "单聊": "Direct chat",
  "接收方 openid": "Recipient openid",
  "接收消息的群或用户 openid（o 开头的长串）。机器人收到过该群/该用户消息后，可让 AI 用 /session 查到。":
    "The openid (long id starting with \"o\") of the group or user receiving the message. Once the bot has seen that group/user, ask the AI to run /session to look it up.",
  "群或用户的 openid": "group or user openid",
  "发送类型": "Schedule type",
  "每天=到点每日发送一次；间隔=按分钟循环发送。":
    "Daily = sent once at the set time each day; Interval = sent repeatedly every N minutes.",
  "每天（指定时刻）": "Daily (set time)",
  "间隔（循环分钟）": "Interval (minutes)",
  "每天发送时间": "Daily time",
  "上海时间（UTC+8）；点击输入框用时间选择器选取。":
    "Asia/Shanghai time (UTC+8); click the field to pick a time.",
  "间隔分钟": "Interval minutes",
  "两次发送之间的间隔分钟数，最小 5 分钟。间隔越小消耗的主动消息配额越多。":
    "Minutes between sends, minimum 5. Shorter intervals consume more proactive-message quota.",
  "发送方式": "Send mode",
  "直接发送=到点原样发送下方内容；AI 生成=把下方内容作为指令交给 AI，生成结果再回复（会创建会话、消耗 token）。":
    "Direct = send the text below as-is at send time; AI = treat the text below as a prompt for the AI and send its generated reply (creates a session, costs tokens).",
  "直接发送文本": "Send text directly",
  "AI 生成内容": "Generate with AI",
  "内容": "Content",
  "给 AI 的生成指令（如「播报今天的天气」），到点由 AI 生成内容后发送。":
    "Prompt for the AI (e.g. \"report today's weather\"); the AI generates and sends the content at send time.",
  "到点直接发送的文本，上限 2000 字。":
    "Text sent as-is at send time, up to 2000 characters.",
  "总结今天的待办": "e.g. summarize today's todos",
  "记得喝水": "e.g. drink some water",
  "定时消息内容": "Scheduled message content",
  "保存后立即生效并重新计算下次发送时间":
    "Takes effect immediately on save; the next send time is recomputed.",
  "保存中…": "Saving…",
  "保存修改": "Save changes",
  "编辑": "Edit",
  "从 GitHub 检查新版本；发现新版本会自动下载并更新，重启 DSH 后生效":
    "Check GitHub for a new version; if found it is downloaded and applied automatically. Restart DSH to take effect.",
  "已更新 ✓": "Updated ✓",
  "检查更新": "Check for updates",
  "正在检查更新…": "Checking for updates…",
  "例如：总结今天的待办": "e.g. summarize today's todos",

  // ── 定时消息与归档（详情页卡片 + 两个独立弹窗）──
  "定时消息与归档": "Scheduled messages & archive",
  "定时消息：查看 / 删除这个机器人已设置的定时发送任务（聊天里的 /定时 命令与 AI 设置的任务都在这里）。消息归档：只读查看本地落盘的最近收发记录，按当前机器人过滤。":
    "Scheduled messages: view/remove timed tasks set for this bot (both /定时 chat commands and AI-created ones). Archive: read-only view of recent locally archived messages, filtered by the current bot.",
  "定时消息管理": "Scheduled message manager",
  "列出这个机器人名下的全部定时消息（每天定时与间隔循环），可单条删除；删除立即生效并落盘。":
    "Lists all scheduled messages under this bot (daily and interval), each removable; removal takes effect immediately and is persisted.",
  "查看定时消息": "View scheduled messages",
  "开启「消息本地归档」后，收发的消息会写入 ~/.dsh/qqbot/archive/（按天分文件）。这里只读展示最近的记录，最新在前。":
    "With \"message archiving\" on, sent/received messages are written to ~/.dsh/qqbot/archive/ (one file per day). This shows recent records read-only, newest first.",
  "查看归档": "View archive",

  // ── replyLocale 下拉 ──
  "回复语言（replyLocale）": "Reply language (replyLocale)",
  "回复语言": "Reply language",
  "机器人直接发给 QQ 用户的系统文案（/help、/status、定时消息用法、欢迎语等）使用的语言。中文为源语言；选择 English 时这些文案自动翻译为英文，未命中的内容保持原文不丢信息。AI 对话内容本身不受影响。":
    "Language for system texts the bot sends directly to QQ users (/help, /status, schedule usage, welcome message, etc.). Chinese is the source language; choosing English translates them, and unmatched texts stay as-is so no information is lost. AI conversation content is unaffected.",
  "中文（默认）": "Chinese (default)",

  // ── 定时消息弹窗 ──
  "这个机器人名下的全部定时发送任务（含聊天命令与 AI 设置的）":
    "All scheduled send tasks under this bot (from chat commands and AI alike)",
  "正在读取定时消息…": "Loading scheduled messages…",
  "还没有定时消息。可在聊天里发 /定时 每天 09:00 内容、让 AI 帮你设置，或点上方「＋ 新增」。":
    "No scheduled messages yet. Send /定时 daily 09:00 text in chat, ask the AI to set one up, or click “＋ New” above.",
  "＋ 新增": "＋ New",
  "新增定时消息": "New scheduled message",
  "创建": "Create",
  "AI 生成": "AI-generated",
  "来自设置页": "From settings",
  "来自 AI": "From AI",
  "来自聊天命令": "From chat command",
  "上次失败：": "Last failed: ",
  "删除中…": "Removing…",
  "确定删除这条定时消息？删除后立即停止发送。":
    "Remove this scheduled message? It stops sending immediately.",
  // ── 定时任务启用 / 禁用 ──
  "禁用": "Disable",
  "已禁用": "Disabled",
  "禁用中…": "Disabling…",
  "启用中…": "Enabling…",
  "已禁用，不会执行": "Disabled — will not run",
  "确定禁用这条定时任务？禁用后不再执行，可随时重新启用。":
    "Disable this scheduled task? It stops running until you re-enable it.",
  // ── 定时任务 AI 脚本生成 ──
  "命令来源": "Command source",
  "手写命令": "Manual command",
  "AI 生成脚本": "AI-generate script",
  "AI 脚本描述词": "AI script prompt",
  "脚本生成中…": "Generating script…",
  "脚本生成失败": "Script generation failed",
  "生成完成后开始执行；已过的触发时刻不补跑": "Runs once the script is ready; missed times are not replayed",
  "脚本生成中…完成后自动回填命令并按计划执行。": "Generating script… The command is filled in automatically when done, then the schedule resumes.",
  "手写命令=自己写完整命令行；AI 生成脚本=只写任务描述，保存后由 AI 后台生成脚本并自动回填命令。":
    "Manual command = write the full command line yourself; AI-generate script = just describe the task, and AI writes the script in the background and fills in the command automatically.",
  "描述这个定时任务要做的事（如「抓取某网页今日价格并输出一行文本」）。保存后 AI 后台生成脚本：生成期间任务不执行；完成后自动按计划执行（已过的触发时刻不补跑）。":
    "Describe what this scheduled task should do (e.g. \"fetch today's price from a page and print one line\"). After saving, AI generates the script in the background: the task does not run until it is ready, then resumes on schedule (missed times are not replayed).",

  // ── 归档弹窗 ──
  "本地落盘的最近收发记录（只读，最新在前；按当前机器人过滤）":
    "Recent locally archived messages (read-only, newest first; filtered by the current bot)",
  "本地落盘的收发记录（按当前机器人过滤）：左栏选日期查看内容，× 删除该天归档":
    "Locally archived messages (filtered by the current bot): pick a date on the left to view it, click × to delete that day's archive",
  "正在读取归档…": "Loading archive…",
  "该天没有记录。开启「消息本地归档」并收到消息后，这里会出现记录。":
    "No records on this day. Records appear here once \"message archiving\" is on and messages arrive.",
  "归档日期文件": "Archive date files",
  "暂无归档文件": "No archive files yet",
  "删除该天归档（仅此机器人的记录）": "Delete this day's archive (only this bot's records)",
  "收到": "Received",
  "回复": "Reply",
  "主动": "Proactive",
  "会话": "Session",

  // ── 安全开关（回复净化 / SSRF 防护 / 本地路径白名单） ──
  "回复内容净化": "Reply sanitization",
  "发送前剥离模型输出里的 system-reminder、<think> 等隐藏标签块，防止内部提示词与推理过程泄漏给聊天对象。仅影响发送内容，归档与模型上下文保留原文。":
    "Strips hidden tag blocks such as system-reminder and <think> from model output before sending, preventing internal prompts and reasoning from leaking to chat partners. Only affects outgoing content; archives and model context keep the original text.",
  "媒体链接安全校验（SSRF 防护）": "Media URL safety check (SSRF guard)",
  "AI 发图/发文件/发语音时，校验 URL 不指向内网或保留地址（127.0.0.1、192.168.x.x、169.254 元数据等），QQ 官方域名直通。防止模型被诱导让本机请求内网服务。关闭后仅要求 http/https 协议。":
    "When the AI sends images/files/voice, URLs are checked against intranet and reserved addresses (127.0.0.1, 192.168.x.x, 169.254 metadata, etc.); official QQ domains pass through. Prevents the model from being tricked into probing intranet services. When off, only the http/https scheme is enforced.",
  "本地文件路径白名单": "Local path whitelist",
  "AI 发图/发文件/发语音时，本机路径必须位于工作区目录或插件数据目录内，防止把任意本机文件（如凭据、密钥）发送给聊天对象。关闭后允许任意本机路径（不推荐）。":
    "When the AI sends images/files/voice, local paths must reside inside the workspace or plugin data directory, preventing arbitrary local files (credentials, keys, etc.) from being sent to chat partners. When off, any local path is allowed (not recommended).",

  // ── 按群配置（群级覆盖） ──
  "按群配置": "Per-group config",
  "为特定群单独覆盖行为配置（阈值/冷却/敏感词/上下文等），其余字段跟随机器人默认。适合把某一个群调得更活跃或更安静，而不影响其他群。":
    "Override behavior settings (threshold/cooldowns/banned words/context, etc.) for specific groups; everything else follows the bot default. Useful for making one group more or less chatty without affecting others.",
  "还没有按群覆盖配置，所有群都使用上方机器人默认配置。":
    "No per-group overrides yet; every group uses the bot defaults above.",
  "覆盖字段未设置时跟随机器人默认；全部清空并保存即删除该群覆盖。":
    "Fields left unset follow the bot default; clearing every field and saving removes the override for that group.",
  "添加群覆盖": "Add group override",
  "编辑群覆盖": "Edit group override",
  "删除": "Delete",
  "群": "Group",
  "无覆盖字段": "No overridden fields",
  "请填写群 openid": "Please enter the group openid",
  "留空/选择「跟随默认」的字段继续使用机器人级配置，仅此群生效":
    "Fields left empty or set to \"Follow default\" keep using the bot-level config; changes apply to this group only.",
  "群 openid": "Group openid",
  "要单独配置的群 openid（o 开头的长串）。可在群里让 AI 用 /session 查看。":
    "The openid of the group to configure (a long id starting with \"o\"). Ask the AI to run /session in that group to find it.",
  "群全量回复": "Full group reply",
  "该群非 @ 消息是否参与价值评分并回复。":
    "Whether non-@ messages in this group are value-scored and answered.",
  "跟随默认": "Follow default",
  "价值阈值": "Value threshold",
  "仅群全量回复开启时有效：0-10 分，达到阈值才回复。":
    "Only effective when full group reply is on: score 0-10; the bot replies at or above the threshold.",
  "@ 上下文条数": "@ context messages",
  "@ 机器人时附带的本群最近消息条数。":
    "How many recent group messages are attached when someone @-mentions the bot.",
  "同群冷却": "Group cooldown",
  "该群两次全量回复的最小间隔（@ 回复不受限）。":
    "Minimum interval between two full replies in this group (@ replies are not limited).",
  "同人冷却": "Per-sender cooldown",
  "同一人在该群两次被回复的最小间隔。":
    "Minimum interval between replies to the same sender in this group.",
  "分片长度": "Chunk length",
  "单条回复的最大字符数，超过会拆成多条发送。":
    "Max characters per reply; longer replies are split into multiple messages.",
  "每条消息回复上限": "Replies per message",
  "该群每条用户消息最多被动回复几条（平台上限 5）。":
    "Max passive replies per user message in this group (platform limit: 5).",
  "该群回复是否优先使用 QQ Markdown。":
    "Whether replies in this group prefer QQ Markdown.",
  "该群是否维护跨会话长期记忆。":
    "Whether this group maintains cross-session long-term memory.",
  // 聊天 Preset（agentPresetChat）已从群覆盖弹窗移除，仅 bots.json 可配；词条保留备用。
  "仅该群生效的敏感词（逗号分隔），命中即撤回并跳过回复；与机器人级敏感词叠加。":
    "Banned words that only apply to this group (comma-separated). A hit recalls the message and skips the reply; combined with bot-level banned words.",
  "词1, 词2（留空跟随默认）": "word1, word2 (leave empty to follow default)",
  "保存后立即生效，无需重启": "Takes effect immediately after saving — no restart needed",
  // ── 定时任务管理（daily / interval / cron / at × 文本 / AI / 执行命令）──
  "定时任务管理": "Scheduled task manager",
  "支持 daily / interval / cron / at 四种触发条件，以及 文本 / AI 生成 / 执行命令 三种执行方式。":
    "Four triggers — daily / interval / cron / at — and three actions: text / AI-generated / run a command.",
  "待补算": "TBD",
  "新增定时任务": "New scheduled task",
  "正在读取定时任务…": "Loading scheduled tasks…",
  "还没有定时任务。可在聊天里发 /定时 每天 09:00 内容、让 AI 帮你设置，或点上方「＋ 新增」。":
    "No scheduled tasks yet. Send /timer daily 09:00 text in chat, ask the AI to set one up, or click “＋ New” above.",
  "确定删除这条定时任务？删除后立即停止发送。":
    "Delete this scheduled task? It stops firing immediately.",
  "保存后立即生效并重新计算下次触发时间":
    "Takes effect immediately on save; the next run time is recomputed.",

  // 编辑表单 · ① 发送给谁
  "① 发送给谁": "① Recipient",
  "决定这条任务往哪个群或哪个用户发。": "Decides which group or user this task sends to.",
  "群聊或单聊；改动范围后请确认下方 openid 与之匹配。":
    "Group or direct chat; after changing this, make sure the openid below matches.",
  "接收消息的群或用户 openid。机器人收到过该群/该用户消息后，可让 AI 用 /session 查到。":
    "The openid of the group or user that receives the message. Once the bot has seen them, ask the AI to run /session to look it up.",

  // 编辑表单 · ② 什么时候触发
  "② 什么时候触发": "② When it fires",
  "选择触发条件并填写对应参数。": "Pick a trigger and fill in its parameters.",
  "触发条件": "Trigger",
  "每天=指定时刻；间隔=按分钟循环；cron=标准表达式（可带时区）；一次性 at=绝对时间，到点后自动删除。":
    "daily = at a set time; interval = every N minutes; cron = a standard expression (with time zone); one-time at = an absolute time, removed after it fires.",
  "每天": "Daily",
  "间隔": "Interval",
  "一次性 at": "One-time at",
  "按所选时区解释；点击输入框可用时间选择器。":
    "Interpreted in the selected time zone; click the field to use the time picker.",
  "时区": "Time zone",
  "daily 默认按中国标准时间发送；如需按其他时区，请改用 cron。":
    "daily defaults to China Standard Time; switch to cron if you need another time zone.",
  "cron 表达式按该时区解释。": "The cron expression is interpreted in this time zone.",
  "at 时间按该时区解释。": "The one-time time is interpreted in this time zone.",
  "自定义（手动输入 IANA 时区）": "Custom (enter an IANA time zone)",
  "自定义时区": "Custom time zone",
  "两次发送之间的间隔，最小 5 分钟。间隔越小消耗的主动消息配额越多。":
    "Gap between two sends, minimum 5 minutes. Shorter intervals consume more proactive-message quota.",
  "分钟": "min",
  "快捷": "Quick",
  "5 分": "5m",
  "10 分": "10m",
  "15 分": "15m",
  "30 分": "30m",
  "1 小时": "1h",
  "2 小时": "2h",
  "6 小时": "6h",
  "12 小时": "12h",
  "24 小时": "24h",
  "cron 表达式": "Cron expression",
  "标准 5 段：分 时 日 月 周（如 0 9 * * 1-5 = 工作日 9 点）。支持 */步长、范围、列表、月份与星期英文名。":
    "Standard 5 fields: minute hour day month weekday (e.g. 0 9 * * 1-5 = 9am on weekdays). Supports */step, ranges, lists, and month/weekday names.",
  "at 时间": "One-time run at",
  "一次性触发时间，到点执行一次后自动删除。":
    "A one-off time — the task runs once and is then removed automatically.",
  "星期过滤（可选）": "Weekday filter (optional)",
  "仅在这些星期触发；不选 = 每天。0=周日。":
    "Fires only on these weekdays; selecting none means every day. 0 = Sunday.",
  "星期过滤": "Weekday filter",
  "工作日": "Weekdays",
  "周末": "Weekend",
  "未来 5 年内无匹配，请检查表达式": "No match within the next 5 years — check the expression",
  "表达式还不完整或非法（应为 5 段：分 时 日 月 周）":
    "Expression is incomplete or invalid (5 fields expected: minute hour day month weekday)",

  // 编辑表单 · ③ 到点做什么
  "③ 到点做什么": "③ What it does",
  "选择执行方式并填写内容。": "Pick an action and fill in its content.",
  "执行方式": "Action",
  "文本=到点原样发送；AI 生成=把内容当指令交给 AI 生成后回复；执行命令=到点跑一条命令并把输出推送给用户。":
    "text = send as-is; AI = treat the content as a prompt and reply with what the AI generates; run command = execute a command and push its output to the user.",
  "执行命令并推送结果": "Run a command and push its output",
  "要执行的命令": "Command to run",
  "到点由服务端执行这条命令行，捕获 stdout/stderr 与退出码后推送给用户。支持 python / powershell -File / .bat / node / vbs(cscript //Nologo) / perl / php / ruby 等。":
    "The server runs this command line at the scheduled time, captures stdout/stderr plus the exit code, then pushes the result to the user. Supports python / powershell -File / .bat / node / vbs (cscript //Nologo) / perl / php / ruby and more.",
  "模板": "Templates",
  "bat 批处理": "Batch file (.bat)",
  "工作目录（可选）": "Working directory (optional)",
  "命令的工作目录；留空则使用插件进程目录。脚本里用相对路径时建议填写。":
    "Working directory for the command; leave empty for the plugin process directory. Recommended when the script uses relative paths.",
  "例如 C:/scripts": "e.g. C:/scripts",
  "工作目录": "Working directory",
  "结果处理": "Result handling",
  "raw = 直接把命令输出推送给用户；ai = 先把输出交给 AI 整理成简洁播报再推送（输出很长或含噪音时推荐）。":
    "raw = push the command output as-is; ai = let the AI turn it into a short report first (recommended when output is long or noisy).",
  "raw：直接推送原始输出": "raw: push raw output",
  "ai：交给 AI 整理后推送": "ai: summarize with AI, then push",
  "例如：记得喝水": "e.g. drink some water",
  "定时任务内容": "Scheduled task content",
  "命令 → AI 播报": "command → AI report",
  "命令 → 原始输出": "command → raw output",

  // 校验提示（编辑表单）
  "请填写接收方 openid（群或用户）": "Enter the recipient openid (group or user)",
  "时间格式应为 HH:mm（如 09:30）": "Time must look like HH:mm (e.g. 09:30)",
  "间隔不能小于 5 分钟": "Interval must be at least 5 minutes",
  "cron 表达式非法（标准 5 段，如 0 9 * * 1-5）": "Invalid cron expression (standard 5 fields, e.g. 0 9 * * 1-5)",
  "请选择有效的 at 时间": "Pick a valid one-time date and time",
  "at 时间必须晚于当前时间": "The one-time time must be later than now",
  "时区格式不正确（应为 IANA 时区，如 Asia/Shanghai）": "Invalid time zone (expected an IANA zone such as Asia/Shanghai)",
  "请填写要执行的命令（如 python C:/scripts/report.py）": "Enter the command to run (e.g. python C:/scripts/report.py)",
  "内容不能为空": "Content must not be empty",

  // 时区下拉（常用 IANA 时区）
  "中国标准时间 · Asia/Shanghai（UTC+8）": "China Standard Time · Asia/Shanghai (UTC+8)",
  "中国香港 · Asia/Hong_Kong（UTC+8）": "Hong Kong, China · Asia/Hong_Kong (UTC+8)",
  "中国台湾 · Asia/Taipei（UTC+8）": "Taiwan, China · Asia/Taipei (UTC+8)",
  "新加坡 · Asia/Singapore（UTC+8）": "Singapore · Asia/Singapore (UTC+8)",
  "日本 · Asia/Tokyo（UTC+9）": "Japan · Asia/Tokyo (UTC+9)",
  "韩国 · Asia/Seoul（UTC+9）": "Korea · Asia/Seoul (UTC+9)",
  "印度 · Asia/Kolkata（UTC+5:30）": "India · Asia/Kolkata (UTC+5:30)",
  "阿联酋 · Asia/Dubai（UTC+4）": "UAE · Asia/Dubai (UTC+4)",
  "俄罗斯 · Europe/Moscow（UTC+3）": "Russia · Europe/Moscow (UTC+3)",
  "中欧 · Europe/Berlin（UTC+1/+2）": "Central Europe · Europe/Berlin (UTC+1/+2)",
  "英国 · Europe/London（UTC+0/+1）": "United Kingdom · Europe/London (UTC+0/+1)",
  "巴西 · America/Sao_Paulo（UTC-3）": "Brazil · America/Sao_Paulo (UTC-3)",
  "美国东部 · America/New_York（UTC-5/-4）": "US Eastern · America/New_York (UTC-5/-4)",
  "美国中部 · America/Chicago（UTC-6/-5）": "US Central · America/Chicago (UTC-6/-5)",
  "美国山地 · America/Denver（UTC-7/-6）": "US Mountain · America/Denver (UTC-7/-6)",
  "美国西部 · America/Los_Angeles（UTC-8/-7）": "US Pacific · America/Los_Angeles (UTC-8/-7)",
  "澳大利亚 · Australia/Sydney（UTC+10/+11）": "Australia · Australia/Sydney (UTC+10/+11)",
  "新西兰 · Pacific/Auckland（UTC+12/+13）": "New Zealand · Pacific/Auckland (UTC+12/+13)",
  "协调世界时 · UTC（UTC+0）": "Coordinated Universal Time · UTC (UTC+0)",

  "请至少设置一个覆盖字段：全部「跟随默认」等同于不添加该群覆盖。":
    "Set at least one override field: leaving everything at \"Follow default\" is the same as not adding this group override.",
  "保存失败，请稍后重试": "Save failed; please retry later",
  "保存": "Save",

  // ── openid 归档下拉（id-picker + 两个弹窗的新提示）──
  "接收消息的群或用户 openid。点击输入框可从消息归档下拉选择：群聊候选显示群 id，单聊候选显示用户 id 与昵称；也可直接粘贴。":
    "The openid of the group or user receiving messages. Click the field to pick from archived chats: group candidates show the group id, DM candidates show the user id and nickname; pasting one in works too.",
  "要单独配置的群 openid（o 开头的长串）。点击输入框可从消息归档下拉选择，候选标注「群 id」；也可直接粘贴。":
    "The openid of the group to configure (a long id starting with \"o\"). Click the field to pick from archived chats — candidates are labelled \"Group id\"; pasting one in works too.",
  "归档会话候选": "Archived chat candidates",
  "正在读取归档会话…": "Loading archived chats…",
  "归档里还没有该类型的会话记录，可直接粘贴 openid":
    "No chats of this type in the archive yet — you can paste an openid directly",
  "没有匹配的候选，可直接粘贴 openid": "No matching candidates — you can paste an openid directly",

  // ── 宿主（host）返回的错误/提示文案（经 errText 嵌入设置页提示条，2026-09-10 补齐） ──
  "没有可用的机器人（请先添加机器人）": "No bot available (add a bot first)",
  "appId 与 appSecret 必填": "appId and appSecret are required",
  "缺少 appId": "Missing appId",
  "缺少 id": "Missing id",
  "缺少 scope/openid": "Missing scope/openid",
  "scope/openid/content 必填": "scope/openid/content are required",
  "enabled 必须是布尔值": "enabled must be a boolean",
  "调度器不可用": "Scheduler unavailable",
  "机器人不存在": "Bot does not exist",
  "扫码结果缺少凭据": "QR scan result is missing credentials",
  "空响应": "Empty response",
  "type 必须是 daily / interval / cron / at 之一": "type must be one of daily / interval / cron / at",
  "内容过长（上限 2000 字）": "Content too long (limit: 2000 characters)",
  "工具模式必须填写要执行的命令（如 python C:/scripts/report.py），或填写 AI 脚本描述词":
    "Command mode requires a command to run (e.g. python C:/scripts/report.py), or an AI script prompt",
  "AI 脚本描述词过长（上限 2000 字）": "AI script prompt too long (limit: 2000 characters)",
  "工作目录（cwd）必须是字符串": "Working directory (cwd) must be a string",
  "结果处理（resultMode）必须是 raw 或 ai": "Result handling (resultMode) must be raw or ai",
  "weekdays 必须是非空数字数组": "weekdays must be a non-empty numeric array",
  "weekdays 元素必须是 0-6（0=周日）": "weekdays entries must be 0-6 (0 = Sunday)",
  "at 必须是合法 ISO 时间": "at must be a valid ISO time",
  "time 格式应为 HH:mm（上海时间，如 09:30）": "time must look like HH:mm (Shanghai time, e.g. 09:30)",
  "未找到该定时任务": "Scheduled task not found",
  "未找到该定时消息": "Scheduled message not found",
  "定时任务不存在（可能已被删除）": "Scheduled task not found (it may have been removed)",
  "已测试发送一次（不计入主动消息配额）": "Test sent once (not counted against the proactive-message quota)",
  "已派发（环境无会话总线，无法确认投递，请稍后查看聊天）":
    "Dispatched (no session bus in this environment; delivery cannot be confirmed — check the chat later)",
  "已派发（无 deliveryId，无法确认投递，请稍后查看聊天）":
    "Dispatched (no deliveryId; delivery cannot be confirmed — check the chat later)",

  // ── 定时任务弹窗（2026-09-10 覆盖检查补齐） ──
  "一": "Mon",
  "二": "Tue",
  "三": "Wed",
  "四": "Thu",
  "五": "Fri",
  "六": "Sat",
  "日": "Sun",
  "开": "on",
  "关": "off",
  "本机时区": "Local time zone",
  "测试": "Test",
  "测试中…": "Testing…",
  "执行失败": "Run failed",
  "已测试发送一次": "Test sent once",
  "测试发送一次（不计入主动消息配额）": "Send a test once (not counted against the proactive-message quota)",
  "请填写 AI 脚本描述词（如：抓取某网页今日价格并输出）":
    "Enter the AI script prompt (e.g. fetch today's price from a webpage and print it)",
  "例如：访问 https://example.com/price 抓取今日价格，输出一行「今日价格：xx 元」":
    "e.g. fetch today's price from https://example.com/price and print one line like “Today's price: xx yuan”",
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
  // ── 前缀 + 宿主错误文案：捕获组递归 localizeText，让嵌入的宿主错误也被翻译 ──
  m = /^保存失败：([\s\S]+)$/.exec(text);
  if (m) return `Save failed: ${localizeText(m[1])}`;
  m = /^操作失败：([\s\S]+)$/.exec(text);
  if (m) return `Operation failed: ${localizeText(m[1])}`;
  m = /^删除失败：([\s\S]+)$/.exec(text);
  if (m) return `Removal failed: ${localizeText(m[1])}`;
  m = /^重试失败：([\s\S]+)$/.exec(text);
  if (m) return `Retry failed: ${localizeText(m[1])}`;
  m = /^检查失败：([\s\S]+)$/.exec(text);
  if (m) return `Check failed: ${localizeText(m[1])}`;
  m = /^更新失败：([\s\S]+)$/.exec(text);
  if (m) return `Update failed: ${localizeText(m[1])}`;
  m = /^测试发送失败：([\s\S]+)$/.exec(text);
  if (m) return `Test send failed: ${localizeText(m[1])}`;
  m = /^上次生成失败：([\s\S]+)$/.exec(text);
  if (m) return `Last generation failed: ${localizeText(m[1])}`;
  m = /^归档读取失败：(.+)（可直接粘贴 openid）$/.exec(text);
  if (m) return `Archive read failed: ${localizeText(m[1])} (you can paste an openid directly)`;
  m = /^上次失败：([\s\S]+)$/.exec(text);
  if (m) return `Last failed: ${localizeText(m[1])}`;
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
  // ── 定时消息 / 归档弹窗（含插值的动态串） ──
  m = /^每天 (\d{1,2}:\d{2})$/.exec(text);
  if (m) return `Daily at ${m[1]}`;
  m = /^每 (\d+) 分钟$/.exec(text);
  if (m) return `Every ${m[1]} min`;
  m = /^下次发送 (.+)$/.exec(text);
  if (m) return `Next send: ${m[1]}`;
  // ── 按群配置（群级覆盖）（动态串；须先于下方「群/用户」通用规则） ──
  m = /^群 (.+) 的覆盖配置已保存（立即生效）$/.exec(text);
  if (m) return `Override for group ${m[1]} saved (takes effect immediately)`;
  m = /^确定删除群 (.+) 的覆盖配置？删除后该群恢复使用机器人默认配置。$/.exec(text);
  if (m) return `Delete the override for group ${m[1]}? That group will fall back to the bot's default config.`;
  // 覆盖摘要（overrideSummary）
  m = /^全量回复 (开|关)$/.exec(text);
  if (m) return `Full reply ${m[1] === "开" ? "on" : "off"}`;
  m = /^阈值 (\d+)$/.exec(text);
  if (m) return `Threshold ${m[1]}`;
  m = /^上下文 (\d+) 条$/.exec(text);
  if (m) return `Context ${m[1]} msgs`;
  m = /^群冷却 不限制$/.exec(text);
  if (m) return "Group cooldown: no limit";
  m = /^群冷却 ([\d.]+) (分钟|秒)$/.exec(text);
  if (m) return `Group cooldown ${m[1]} ${m[2] === "分钟" ? "min" : "s"}`;
  m = /^同人冷却 不限制$/.exec(text);
  if (m) return "Sender cooldown: no limit";
  m = /^同人冷却 ([\d.]+) (分钟|秒)$/.exec(text);
  if (m) return `Sender cooldown ${m[1]} ${m[2] === "分钟" ? "min" : "s"}`;
  m = /^分片 (\d+)$/.exec(text);
  if (m) return `Chunk ${m[1]}`;
  m = /^回复上限 (\d+)$/.exec(text);
  if (m) return `Max ${m[1]} replies`;
  m = /^Markdown (开|关)$/.exec(text);
  if (m) return `Markdown ${m[1] === "开" ? "on" : "off"}`;
  m = /^记忆 (开|关)$/.exec(text);
  if (m) return `Memory ${m[1] === "开" ? "on" : "off"}`;
  m = /^敏感词 (\d+) 个$/.exec(text);
  if (m) return `${m[1]} banned words`;
  m = /^聊天 Preset (.+)$/.exec(text);
  if (m) return `Chat preset ${m[1]}`;
  // ── openid 归档下拉（id-picker；动态串。「（成员 …）」须先于下方「群/用户」通用规则） ──
  // （归档读取失败 / 上次失败 / 上次生成失败 已上移到文件头部的前缀规则区，带嵌入错误翻译）
  m = /^共 (\d+) 个候选，输入关键词继续过滤$/.exec(text);
  if (m) return `${m[1]} candidates — type to filter more`;
  m = /^群聊 · 最近发言成员：(.+)$/.exec(text);
  if (m) return `Group · recent speaker: ${m[1]}`;
  m = /^群 id：(.+)$/.exec(text);
  if (m) return `Group id: ${m[1]}`;
  m = /^用户 id：(.+)$/.exec(text);
  if (m) return `User id: ${m[1]}`;
  m = /^(.+?)（成员 (.+?)）$/.exec(text);
  if (m) return `${localizeText(m[1])} (member: ${m[2]})`;
  m = /^(群|用户) (.+)$/.exec(text);
  if (m) return `${m[1] === "群" ? "Group" : "User"} ${m[2]}`;
  // ── 定时任务 AI 脚本生成（动态串） ──
  m = /^（AI 生成中）([\s\S]+)$/.exec(text);
  if (m) return `(AI generating) ${m[1]}`;
  m = /^已生成脚本：(.+?)。修改描述词并保存会重新生成。$/.exec(text);
  if (m) return `Generated script: ${m[1]}. Edit the prompt and save to regenerate.`;
  m = /^共 (\d+) 条（每个群\/单聊最多 5 条）$/.exec(text);
  if (m) return `${m[1]} in total (max 5 per chat)`;
  m = /^所有机器人共 (\d+) 条（每个群\/单聊最多 5 条）$/.exec(text);
  if (m) return `All bots: ${m[1]} in total (max 5 per chat)`;
  m = /^已显示最近 (\d+) 条（更早记录仍在归档文件里）$/.exec(text);
  if (m) return `Showing latest ${m[1]} (older records remain in the archive files)`;
  m = /^共 (\d+) 条记录$/.exec(text);
  if (m) return `${m[1]} record(s) in total`;
  // ── 定时消息编辑表单（动态串） ──
  m = /^(\d+) 分钟$/.exec(text);
  if (m) return `${m[1]} min`;
  m = /^(\d+) 小时$/.exec(text);
  if (m) return `${m[1]} h`;
  m = /^该任务归属机器人 (.+)$/.exec(text);
  if (m) return `This task belongs to bot ${m[1]}`;
  // ── 定时任务管理（cron / at / 执行命令；动态串） ──
  m = /^每 (\d+) 小时$/.exec(text);
  if (m) return `Every ${m[1]} h`;
  m = /^一次性 (.+)$/.exec(text);
  if (m) return `Once at ${m[1]}`;
  // 「下次运行：」须先于通用「下次 」规则，否则会被吞掉「运行：」二字。
  m = /^下次运行：(.+)$/.exec(text);
  if (m) return `Next run: ${m[1]}`;
  m = /^下次 (.+)$/.exec(text);
  if (m) return `Next: ${localizeText(m[1])}`;
  m = /^当前：(.+)$/.exec(text);
  if (m) return `Current: ${localizeText(m[1])}`;
  m = /^本机时区 · (.+)$/.exec(text);
  if (m) return `Local time zone · ${m[1]}`;
  m = /^(\d+) 分$/.exec(text);
  if (m) return `${m[1]}m`;
  m = /^(\d+) 条记录$/.exec(text);
  if (m) return `${m[1]} record(s)`;
  m = /^删除 (.+) 归档$/.exec(text);
  if (m) return `Delete the ${m[1]} archive`;
  m = /^确定删除 (.+) 的归档记录？此机器人该天的记录将被清除，其他机器人的记录保留。$/.exec(text);
  if (m) return `Delete the ${m[1]} archive records? This bot's records for that day are cleared; other bots' records are kept.`;
  // ── 版本检查 / 自更新（动态串） ──
  m = /^暂无新版本（当前 v(.+) 已是最新）$/.exec(text);
  if (m) return `No new version (v${m[1]} is the latest)`;
  m = /^发现新版本 v(.+)，正在自动更新…$/.exec(text);
  if (m) return `New version v${m[1]} found; updating automatically…`;
  m = /^已自动更新到 v(.+)（备份于安装目录 \.update-backup\/），重启 DSH 后生效$/.exec(text);
  if (m) return `Updated to v${m[1]} (old files backed up in .update-backup/ inside the install directory). Restart DSH to take effect.`;
  // ── 宿主（host）返回的含参数错误/提示（经 errText 进入提示条） ──
  m = /^未找到机器人 (.+)$/.exec(text);
  if (m) return `Bot not found: ${m[1]}`;
  m = /^目录不存在: (.+)$/.exec(text);
  if (m) return `Directory does not exist: ${m[1]}`;
  m = /^不是目录: (.+)$/.exec(text);
  if (m) return `Not a directory: ${m[1]}`;
  m = /^无法读取目录: (.+)$/.exec(text);
  if (m) return `Cannot read directory: ${localizeText(m[1])}`;
  m = /^未找到该定时消息（序号 1-(\d+)）$/.exec(text);
  if (m) return `Scheduled message not found (index 1-${m[1]})`;
  m = /^每个群\/单聊最多 (\d+) 条定时任务$/.exec(text);
  if (m) return `Max ${m[1]} scheduled tasks per group/DM`;
  m = /^机器人 (.+) 不可用（已删除或未启用）$/.exec(text);
  if (m) return `Bot ${m[1]} is unavailable (removed or disabled)`;
  m = /^保存未生效：群 (.+) 的覆盖未写入配置，请重试$/.exec(text);
  if (m) return `Save did not take effect: the override for group ${m[1]} was not written; please retry`;
  // ── 归档时间轴「会话 …」行（内容为用户消息原文，无法翻译，保持原样） ──
  m = /^会话 (.+)$/.exec(text);
  if (m) return `Session ${m[1]}`;
  // ── 定时任务星期过滤标签（周一、周三 → Mon, Wed） ──
  m = /^周([一二三四五六日\d、]+)$/.exec(text);
  if (m) {
    const wd: Record<string, string> = { "一": "Mon", "二": "Tue", "三": "Wed", "四": "Thu", "五": "Fri", "六": "Sat", "日": "Sun", "、": ", " };
    return `Week ${[...m[1]].map((c) => wd[c] ?? c).join("")}`;
  }
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
