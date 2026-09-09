window.__ModuleLoader__.load({
	id: "@sunjuntao/dsh-qqbot",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.tsx
var client_exports = {};
__export(client_exports, {
  QqbotSettingsTab: () => QqbotSettingsTab,
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(client_exports);
var React9 = __toESM(require("react"), 1);

// src/client/i18n.ts
var React = __toESM(require("react"), 1);
var QQBOT_LOCALE_NAMESPACE = "dsh-qqbot";
var EN = Object.freeze({
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
  "点击上方「＋ 添加机器人」，用手机 QQ 扫码，或手动填写 AppID / AppSecret。配置成功后即可在详情中设置行为参数。": "Click “+ Add bot” above, scan the QR code with the mobile QQ app, or enter the AppID / AppSecret manually. Once connected, behavior settings become available in the bot details.",
  "点击机器人卡片可进入详情：查看 QQ 连接状态、调整行为配置。": "Click a bot card to open its details: view the QQ connection status and adjust behavior settings.",
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
  "推荐方式。扫码后 QQ 会把机器人的 AppID 与 AppSecret 直接下发给本机 dsh，不需要手动复制，保存后立即生效。": "Recommended. After scanning, QQ delivers the bot’s AppID and AppSecret straight to the local dsh — nothing to copy by hand, and it takes effect immediately once saved.",
  "操作步骤": "Steps",
  "点击二维码下方的「生成二维码」，出现二维码后开始 5 分钟倒计时。": "Click “Generate QR code” below the QR area; a 5-minute countdown starts once it appears.",
  "打开手机 QQ，从右上角「＋」菜单进入「扫一扫」，扫描这张二维码。": "Open mobile QQ, tap “＋” in the top-right corner, choose “Scan”, and scan this code.",
  "按 QQ 页面提示完成确认，把这个机器人授权给本机 dsh 使用。": "Follow the QQ prompts to confirm and authorize this bot for the local dsh.",
  "本页每 2 秒检查一次结果，绑定成功后会自动进入机器人详情页。": "This page checks the result every 2 seconds and opens the bot details automatically once linked.",
  "二维码 5 分钟内有效；过期后会自动换一张新的，不需要手动刷新页面。": "The QR code is valid for 5 minutes; a new one is generated automatically when it expires — no need to refresh the page.",
  "扫码期间请保持本设置页打开，关闭页面会中断等待。": "Keep this settings page open while scanning; closing it interrupts the wait.",
  "凭据会写入 ~/.dsh/qqbot/credentials.json（仅当前用户可读），写入后立即生效，不需要重启 dsh。": "Credentials are written to ~/.dsh/qqbot/credentials.json (readable by the current user only), take effect immediately, and require no dsh restart.",
  // ── 手动填写面板 ──
  "手动填写 AppID / AppSecret": "Enter AppID / AppSecret manually",
  "适合已经在 QQ 开放平台创建过机器人的情况：先从开放平台把凭据复制出来，再回到这里填写保存。": "For bots already created on the QQ Open Platform: copy the credentials there first, then come back here to save them.",
  "第 1 步 · 在 QQ 开放平台取得凭据": "Step 1 · Get the credentials from the QQ Open Platform",
  "打开 QQ 开放平台": "Open the QQ Open Platform",
  "浏览器访问 q.qq.com，用 QQ 登录。": "Visit q.qq.com in a browser and sign in with QQ.",
  "选择机器人": "Pick the bot",
  "在机器人列表里点开要接入的机器人；还没有的话先创建一个。": "Open the bot you want to connect from the bot list; create one first if none exists.",
  "复制 AppID 与 AppSecret": "Copy the AppID and AppSecret",
  "进入该机器人的「开发设置」页面，复制 AppID（机器人 ID）与 AppSecret（机器人密钥）。": "Open the bot’s “Developer settings” page and copy the AppID (bot ID) and the AppSecret (bot key).",
  "第 2 步 · 填到这里并保存": "Step 2 · Fill them in here and save",
  "机器人 ID": "Bot ID",
  "开发设置里的机器人密钥": "The bot key from Developer settings",
  "保存并启用": "Save and enable",
  "保存后凭据写入 ~/.dsh/qqbot/credentials.json（权限 0600），立即生效，并自动设为当前使用的机器人。": "After saving, the credentials are written to ~/.dsh/qqbot/credentials.json (mode 0600), take effect immediately, and the bot becomes the primary one automatically.",
  "这里不会校验凭据是否正确。保存后请到机器人详情看「连接状态」：显示「运行正常」才是接通；未就绪就点「重试连接」。": "Credentials are not validated here. After saving, check “Connection status” in the bot details: “Running” means connected; if not ready, click “Retry connection”.",
  "消息接收走 WebSocket 长连接，开放平台不需要填回调地址；但机器人回复要走 OpenAPI，需要把本机出口 IP 加进开放平台的 IP 白名单。": "Messages are received over a WebSocket long connection, so no callback URL is needed on the Open Platform; but replies go through the OpenAPI, which requires adding this machine’s outbound IP to the platform’s IP allowlist.",
  "AppSecret 保存后不再回显；需要更换时重新填一次保存即可覆盖。": "The AppSecret is never shown again after saving; to change it, simply fill it in and save again to overwrite.",
  // ── 添加页 ──
  "← 返回列表": "← Back to list",
  "添加机器人": "Add bot",
  "两种方式任选其一：扫码由 QQ 自动下发凭据；手动填写需要你先去 QQ 开放平台复制 AppID / AppSecret。接入成功后凭据立即生效，并自动成为当前使用的机器人。": "Choose either way: scanning lets QQ deliver the credentials automatically; manual entry requires copying the AppID / AppSecret from the QQ Open Platform first. Once connected, the credentials take effect immediately and the bot becomes the primary one.",
  // ── 详情页骨架 ──
  "未选择机器人": "No bot selected",
  "连接状态": "Connection status",
  "最近连接": "Last connected",
  "QQ 机器人": "QQ Bot",
  "QQ 机器人设置": "QQ Bot settings",
  "把 QQ 机器人接入 DeepSeek Harness": "Connect QQ bots to DeepSeek Harness",
  // ── 运行统计 ──
  "运行统计": "Run statistics",
  "该机器人的持久运行计数（重启不清零）；数值不会自动刷新，需要时点「刷新」。": "Persistent run counters for this bot (kept across restarts); they do not refresh automatically — click “Refresh” when needed.",
  "复位": "Reset",
  "复位中…": "Resetting…",
  "把该机器人的运行计数清零（立即生效并落盘）": "Zero out this bot's run counters (takes effect and persists immediately)",
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
  "决定这个机器人以什么身份、在哪个目录、用哪个模型干活；每个机器人彼此独立，改动只对之后新建的会话生效。": "Controls which identity, directory, and model this bot works with; each bot is independent, and changes apply only to newly created sessions.",
  "工作区目录": "Workspace directory",
  "QQ 消息创建的会话都在这个目录里读写文件。留空则使用默认工作区；改动只对新建会话生效。": "Sessions created from QQ messages read and write files inside this directory. Leave empty for the default workspace; changes apply only to new sessions.",
  "选择目录": "Choose directory",
  "默认工作区（~/.dsh/file）": "Default workspace (~/.dsh/file)",
  "这个机器人会话使用的模型；留空则跟随宿主默认模型。切换后已有会话需要重置才会生效。": "The model used by this bot’s sessions; leave empty to follow the host default. Existing sessions need a reset for the change to apply.",
  "跟随默认模型": "Follow default model",
  "决定机器人的行事风格与可用工具。@ 机器人和单聊消息都走这个 Preset；群里非 @ 的回复走聊天 Preset（默认跟随本 Preset，仅可在 bots.json 配置），不会执行工具。": "Sets the bot’s behavior style and available tools. @-mentions and direct messages use this Preset; non-@ group replies use the chat preset (follows this Preset by default, configurable only in bots.json) and never run tools.",
  // ── 消息与回复策略（开关）──
  "消息与回复策略": "Message & reply policy",
  "控制这个机器人「听哪些消息、怎么回」，每个机器人彼此独立。所有开关改完立即生效，不需要重启。": "Controls which messages this bot listens to and how it replies; each bot is independent. Every switch takes effect immediately — no restart needed.",
  "群全量消息回复": "Reply to all group messages",
  "开启后，群里没有 @ 机器人的消息也会参与价值评分，达到阈值才回复；@ 机器人的消息始终回复并可使用工具。关闭后，机器人只处理 @ 它的群消息。": "When on, group messages that do not @ the bot also go through value scoring and get a reply only above the threshold; @-mentions are always answered and can use tools. When off, only messages that @ the bot are processed.",
  "接受单聊消息": "Accept direct messages",
  "是否响应 QQ 私聊（C2C）消息。关闭后机器人只处理群消息，私聊一律忽略。": "Whether to respond to QQ direct (C2C) messages. When off, the bot processes group messages only and ignores DMs.",
  "响应机器人消息": "Respond to bot messages",
  "开启后，其他机器人发出的消息也会触发本机器人回复。默认关闭：其他机器人的消息一律忽略，防止同群的多个机器人互相触发、循环刷屏。注意 QQ 平台在群聊里通常不向机器人推送其他机器人的消息，此开关只在平台确实推送时才有实际效果。": "When on, messages sent by other bots can also trigger replies from this bot. Off by default: other bots' messages are always ignored, preventing multiple bots in the same group from triggering each other in a loop. Note: the QQ platform usually does not push other bots' messages to a bot in groups, so this switch only takes effect when the platform actually delivers them.",
  "Markdown 回复": "Markdown replies",
  "优先以 QQ Markdown 格式发送，排版更好看；若平台拒绝该格式，会自动降级为纯文本重发，不会丢消息。": "Send in QQ Markdown format first for nicer layout; if the platform rejects it, the message is resent as plain text automatically — nothing is lost.",
  "回复引用原话": "Quote the user's message",
  "回复以 QQ 原生引用卡片定位到用户那条原消息（message_reference，走主动消息通道发送，不与 msg_id 同传——手机端两者同传会堆叠重复引用）。仅群聊生效，单聊一律不引用：off=不引用；at=仅群 @ 回复（推荐）；all=群聊全部回复。卡片发送失败时自动降级为普通被动回复（无卡片，内容不丢）。此外，用户引用聊天里某条消息时，被引用的原文会始终注入模型上下文，让它知道对方在回应什么。": "Replies quote the user's original message via QQ's native quote card (message_reference), sent over the proactive-message channel without msg_id — sending both together makes mobile QQ show the same content twice. Group chats only — DMs are never quoted: off = no quote; at = group @-mentions only (recommended); all = every group reply. If the card fails to send, the reply falls back to a plain passive reply (no card, nothing lost). Also, when a user quotes another message, the quoted text is always injected into the model context.",
  "回复引用原话范围": "Quote reply scope",
  "off（不引用）": "off (no quote)",
  "at（仅群 @，推荐）": "at (group @-mentions only, recommended)",
  "all（群聊全部回复）": "all (every group reply)",
  "引用字数上限": "Quote preview length",
  "文本引用最多显示多少字（仅主动消息回退为文本引用时使用；原生引用气泡由 QQ 客户端自行截断），超出部分以省略号结尾。": "How many characters of the quoted text to show when a reply falls back to a text quote (proactive messages only; native quote cards are truncated by the QQ client itself); longer text ends with an ellipsis.",
  // ── 群聊聊天 Preset / secretEnv 凭据引用 ──
  "群聊聊天 Preset": "Group chat preset",
  "群内非 @ 的全量消息（只聊天、不执行工具）使用的 Preset；留空则跟随上方 Agent Preset。用于让群全量回复风格与 @/单聊区分开。": "Preset used for full group messages that do not @ the bot (chat only, no tools); leave empty to follow the Agent Preset above. Use it to give group-wide replies a style distinct from @-mentions and DMs.",
  "跟随 Agent Preset": "Follow Agent Preset",
  "AppSecret 凭据引用（secretEnv）": "AppSecret credential reference (secretEnv)",
  "AppSecret 凭据引用": "AppSecret credential reference",
  "DSH 凭据引用作为 AppSecret 的替代来源（优先级高于明文 AppSecret）。填写后机器人在运行时凭此引用解析出真实密钥，无需在开放平台明文保存。留空则使用扫码/手动填写的 AppSecret。": "A DSH credential reference used instead of a plaintext AppSecret (takes priority over it). When set, the bot resolves the real secret from this reference at runtime, so no plaintext secret needs to be kept on the open platform. Leave empty to use the AppSecret from QR login / manual entry.",
  "如 my-qq-app-secret（留空不启用）": "e.g. my-qq-app-secret (leave empty to disable)",
  // ── 新功能开关（多模态 / 记忆 / 欢迎语 / 表情撤回 / 语音 / 敏感词 / 配额）──
  "主动消息日配额": "Daily proactive quota",
  "单日最多发送多少条主动消息（定时消息、欢迎语、出箱补发、AI 发图都计入）。0 表示不限制——但 QQ 平台主动消息配额极少，超发会被限流，建议保持默认 50。": "How many proactive messages may be sent per day at most (scheduled messages, welcome greetings, outbox redelivery, and AI-sent images all count). 0 means unlimited — but the QQ platform's proactive quota is tiny; over-sending gets rate-limited. Keep the default 50.",
  "多模态消息": "Multimodal messages",
  "群里/私聊发来的图片、文件、语音会以附件形式注入会话上下文：视觉模型可以直接看图，语音优先使用平台自带转写文本。关闭后非文字内容只保留占位说明。": "Images, files, and voice from groups/DMs are injected into the session context as attachments: vision models can see the images directly, and voice uses the platform's built-in transcript first. When off, non-text content is reduced to a placeholder note.",
  "长期记忆": "Long-term memory",
  "每个群/单聊维护一份持久记忆（跨 /new 保留）。对话里说「记住某事」AI 会自动写入；用 /记忆 查看、/清空记忆 清空。": "Each group/DM keeps a persistent memory (survives /new). Say “remember something” in chat and the AI writes it down automatically; use /记忆 to view and /清空记忆 to clear it.",
  "欢迎语": "Welcome message",
  "新成员进群或新好友添加时，机器人自动发送欢迎语（文案见下方输入框，{nick} 会替换为对方标识）。走主动消息通道，消耗每日配额。": "When a new member joins a group or adds the bot as a friend, the bot sends a welcome message automatically (text in the input below; {nick} is replaced with their identifier). Sent via the proactive channel and counts against the daily quota.",
  "表情撤回": "Emoji-recall",
  "任何人对机器人发出的消息点 🗑️ 表情回应，机器人就撤回那条消息（需要平台的「消息撤回」权限）。": "Anyone reacting 🗑️ to a message the bot sent makes the bot recall that message (requires the platform's “message recall” permission).",
  "语音消息处理": "Voice message handling",
  "收到语音消息时如何处理：off=忽略；note=使用平台自带的转写文本（推荐，无转写时显示占位）；download=把音频地址注入上下文；asr=调用下方自定义转写服务（POST {url} → {text}）；stt=下载语音本地转码后调用 OpenAI 兼容 /audio/transcriptions 转写（失败自动回退平台转写文本）。": "How to handle incoming voice messages: off = ignore; note = use the platform's built-in transcript (recommended; shows a placeholder when none); download = inject the audio URL into context; asr = call the custom transcription service below (POST {url} → {text}); stt = download the audio, convert it locally and call an OpenAI-compatible /audio/transcriptions endpoint (falls back to the platform transcript on failure).",
  "语音消息处理方式": "Voice message handling mode",
  "off（忽略语音）": "off (ignore voice)",
  "note（平台转写，推荐）": "note (platform transcript, recommended)",
  "stt（STT 服务自动转写）": "stt (auto-transcribe via STT service)",
  "download（注入音频地址）": "download (inject audio URL)",
  "asr（自定义转写服务）": "asr (custom transcription service)",
  "自定义转写服务": "Custom transcription service",
  "voiceTranscription=asr 时使用的 HTTP 服务地址：机器人 POST { url: <音频地址> }，服务返回 { text: <转写文本> }。留空则回退为占位说明。": "HTTP service used when voiceTranscription=asr: the bot POSTs { url: <audio URL> } and the service returns { text: <transcript> }. Leave empty to fall back to a placeholder note.",
  "https://…（留空不启用）": "https://… (leave empty to disable)",
  "自定义转写服务地址": "Custom transcription service URL",
  "STT 服务地址（Base URL）": "STT service base URL",
  "voiceTranscription=stt 时使用，OpenAI 兼容的接口根地址（不含 /audio/transcriptions 后缀）。语音会先下载到本地（SILK 自动转 WAV）再上传转写。": "Used when voiceTranscription=stt: the root URL of an OpenAI-compatible endpoint (without the /audio/transcriptions suffix). Voice files are downloaded locally (SILK auto-converted to WAV) before being uploaded for transcription.",
  "STT 服务地址": "STT service base URL",
  "https://api.openai.com/v1（留空不启用）": "https://api.openai.com/v1 (leave empty to disable)",
  "STT 服务 API Key": "STT service API key",
  "voiceTranscription=stt 时使用，以 Bearer 方式携带。仅保存在本机 bots.json，不会随消息外发（转写请求除外）。": "Used when voiceTranscription=stt, sent as a Bearer token. Stored only in the local bots.json and never sent with messages (except the transcription request itself).",
  "sk-…（留空不启用）": "sk-… (leave empty to disable)",
  "STT 模型": "STT model",
  "voiceTranscription=stt 时使用的转写模型名，如 whisper-1。": "Transcription model used when voiceTranscription=stt, e.g. whisper-1.",
  "TTS 服务地址（Base URL）": "TTS service base URL",
  "开启「语音回复」时使用，OpenAI 兼容的接口根地址（不含 /audio/speech 后缀）。合成的 WAV 语音直接作为 QQ 语音消息发送。": "Used when “Text-to-speech replies” is on: the root URL of an OpenAI-compatible endpoint (without the /audio/speech suffix). The synthesized WAV is sent directly as a QQ voice message.",
  "TTS 服务地址": "TTS service base URL",
  "TTS 服务 API Key": "TTS service API key",
  "开启「语音回复」时使用，以 Bearer 方式携带。仅保存在本机 bots.json。": "Used when “Text-to-speech replies” is on, sent as a Bearer token. Stored only in the local bots.json.",
  "TTS 模型 / 发音人": "TTS model / voice",
  "TTS 模型名（如 tts-1）与发音人（voice，如 alloy / nova / shimmer）。": "TTS model name (e.g. tts-1) and voice (e.g. alloy / nova / shimmer).",
  "正在输入状态": "Typing indicator",
  "私聊收到消息后，AI 处理期间向对方显示「对方正在输入…」（QQ 平台能力仅限单聊），回复发出后自动停止；处理超过 5 分钟自动关闭以防状态永挂。发送失败不影响正常回复。": "When a DM arrives, shows “typing…” to the other side while the AI is processing (QQ platform capability is DM-only); stops automatically once the reply is sent, or after 5 minutes as a failsafe. Send failures never affect normal replies.",
  "语音回复（文字转语音）": "Voice replies (text-to-speech)",
  "私聊回复自动经 TTS 服务合成语音气泡发送（QQ 平台语音消息仅支持单聊，群聊仍发文字）。需配置下方 TTS 服务（OpenAI 兼容 /audio/speech）；合成或发送失败自动回退文字回复，内容不丢。": "DM replies are automatically synthesized into voice bubbles via the TTS service (QQ voice messages are DM-only; groups still get text). Requires the TTS service below (OpenAI-compatible /audio/speech); on synthesis or send failure the bot falls back to the text reply — no content is lost.",
  "TTS 模型名": "TTS model",
  "TTS 发音人": "TTS voice",
  "按钮审批": "Button approvals",
  "AI 执行敏感操作前可发送「✅允许 / ❌拒绝」按钮消息，点击即回传决定；超时未点击视为拒绝。审批消息占用主动消息配额。": "Before performing sensitive operations the AI can send a “✅ Allow / ❌ Deny” button message; a click returns the decision immediately, and no click within the timeout counts as denial. Approval messages consume the proactive-message quota.",
  "文件内容识别": "File content ingestion",
  "收到文本类文件（txt/md/json/csv/代码等，≤1MB）时自动下载并截取正文注入模型上下文，AI 直接读懂文件内容再回复；二进制文件（docx/pdf 等）仅列文件名。需配合「附件转发」开关。": "When a text-like file (txt/md/json/csv/code, ≤1MB) arrives, its content is downloaded and excerpted into the model context so the AI can read it before replying; binary files (docx/pdf etc.) are listed by name only. Requires the “Attachment forwarding” switch.",
  "欢迎语文案": "Welcome text",
  "开启「欢迎语」后发送的内容；{nick} 会替换为新成员标识。留空使用默认文案「欢迎 {nick}！@我即可与我对话。」。": "Content sent when “Welcome message” is on; {nick} is replaced with the new member's identifier. Leave empty to use the default “Welcome {nick}! @me to chat with me.”.",
  "欢迎 {nick}！@我即可与我对话。": "Welcome {nick}! @me to chat with me.",
  "敏感词列表": "Banned words",
  "逗号分隔。群消息包含其中任意一词时，机器人撤回该消息并跳过回复（需要消息撤回权限；无权限时仅拦截回复）。": "Comma-separated. If a group message contains any of these words, the bot recalls the message and skips replying (requires message-recall permission; without it, only the reply is blocked).",
  "词1, 词2（留空不启用）": "word1, word2 (leave empty to disable)",
  "0（不限）": "0 (unlimited)",
  "被动失败转主动消息": "Fall back to proactive messages",
  "被动回复超时或失败时，改用主动消息接口补发一次。主动消息每日配额极少，仅在排查问题时临时开启。": "When a passive reply times out or fails, retry once via the proactive-message API. The daily proactive quota is tiny — enable only temporarily while debugging.",
  "消息本地归档": "Local message archive",
  "把收到的消息与发出的回复写入 ~/.dsh/qqbot/archive/，作为审计轨迹留档，方便事后排查。": "Writes received messages and sent replies to ~/.dsh/qqbot/archive/ as an audit trail for later troubleshooting.",
  // ── 回复调优 ──
  "回复调优": "Reply tuning",
  "调节这个机器人「回得多不多、切得多碎」，每个机器人彼此独立。改完立即生效，建议先按默认值跑一段时间再微调。": "Tunes how often this bot replies and how finely replies are split; each bot is independent. Changes apply immediately — run with defaults for a while before fine-tuning.",
  "0（全部回复）": "0 (reply to all)",
  "0（关闭）": "0 (off)",
  "群消息价值阈值": "Group message value threshold",
  "AT 上下文条数": "AT context messages",
  "群回复最小间隔": "Min group reply interval",
  "同人回复间隔": "Same-sender reply interval",
  "分片字符数": "Chunk size (chars)",
  "每条消息最大回复": "Max replies per message",
  "0–10 分。机器人给每条群消息打分，只有达到分数才会回复；分数越高越安静。设为 0 表示群里所有消息都回复（容易刷屏）。@ 机器人的消息不受此限制，一定会回复。": "0–10 points. The bot scores every group message and replies only when the score is reached; the higher the score, the quieter the bot. 0 means it replies to every group message (prone to flooding). Messages that @ the bot bypass this and always get a reply.",
  "@ 机器人时，额外附带群里最近 N 条消息一起送给模型，让它听懂上下文。设为 0 则只发送被 @ 的这一条。条数越多越聪明，也越耗 token。": "When the bot is @-mentioned, the latest N group messages are attached for context so the model understands the conversation. 0 sends only the @-mention itself. More context is smarter but costs more tokens.",
  "同一个群里，两次「非 @ 触发」的回复之间至少要隔这么久，用来防止机器人刷屏。@ 机器人的回复不受限制。": "In one group, two replies triggered without an @-mention are at least this far apart, preventing flooding. @-mention replies are not throttled.",
  "同一个人在这么短的时间内不会被回复第二次，避免被同一个人连续刷屏。": "The same person will not get a second reply within this window, preventing one user from spamming the bot.",
  "QQ 单条消息有长度限制，超长的回复会按这个字数切成多条依次发送。太小会切得很碎，太大会被平台截断。": "A single QQ message has a length limit; longer replies are split into chunks of this size and sent in order. Too small splits messages into fragments; too large gets truncated by the platform.",
  "一条用户消息最多触发几次被动回复（QQ 平台硬上限为 5）。调小可以避免机器人一次性连发多条。": "How many passive replies one user message may trigger at most (the QQ platform hard-caps at 5). Lower it to avoid the bot sending many messages at once.",
  // ── 连接与移除 ──
  "连接与移除": "Connection & removal",
  "管理机器人的启用状态、设为主机器人、重建 QQ 长连接，或删除接入配置。": "Manage the bot’s enabled state, set it as primary, rebuild the QQ long connection, or delete the integration.",
  "停用此机器人": "Disable this bot",
  "启用此机器人": "Enable this bot",
  "停用的机器人不会建立 QQ 长连接，也不会接收或回复消息；其它已启用的机器人不受影响。": "A disabled bot keeps no QQ long connection and neither receives nor replies to messages; other enabled bots are unaffected.",
  "停用": "Disable",
  "启用": "Enable",
  "未显式指定机器人时（配置编辑、主动消息、定时任务），默认作用于主机器人。所有「已启用」的机器人都会同时接收并回复消息。": "When no bot is specified explicitly (config editing, proactive messages, scheduled tasks), the primary bot is the default. All enabled bots receive and reply simultaneously.",
  "检查连接": "Check connection",
  "重试连接": "Retry connection",
  "按当前凭据重新建立 QQ WebSocket 长连接。收不到消息时先点它排查。": "Rebuilds the QQ WebSocket long connection with the current credentials. Click this first when messages stop arriving.",
  "检查中…": "Checking…",
  "移除接入": "Remove integration",
  "删除这个机器人的凭据与配置，删除后它会立刻停止接收消息，且无法撤销。": "Deletes this bot’s credentials and configuration. It stops receiving messages immediately and the action cannot be undone.",
  // ── 目录选择弹窗 ──
  "选择工作区目录": "Choose workspace directory",
  "逐级浏览并选定机器人读取文件的文件夹": "Browse level by level and pick the folder the bot may read files from",
  "正在读取目录…": "Reading directory…",
  "上一级": "Up one level",
  "单击选中，双击进入": "Click to select, double-click to enter",
  "该目录下没有子文件夹": "No subfolders in this directory",
  "单击选中，双击进入；未选中时选定当前浏览的目录": "Click to select, double-click to enter; with nothing selected, the currently browsed directory is chosen",
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
  "发送到群聊还是单聊。改动范围后请确认下方 openid 与之匹配。": "Send to a group or a direct chat. After changing this, make sure the openid below matches.",
  "群聊": "Group",
  "单聊": "Direct chat",
  "接收方 openid": "Recipient openid",
  "接收消息的群或用户 openid（o 开头的长串）。机器人收到过该群/该用户消息后，可让 AI 用 /session 查到。": 'The openid (long id starting with "o") of the group or user receiving the message. Once the bot has seen that group/user, ask the AI to run /session to look it up.',
  "群或用户的 openid": "group or user openid",
  "发送类型": "Schedule type",
  "每天=到点每日发送一次；间隔=按分钟循环发送。": "Daily = sent once at the set time each day; Interval = sent repeatedly every N minutes.",
  "每天（指定时刻）": "Daily (set time)",
  "间隔（循环分钟）": "Interval (minutes)",
  "每天发送时间": "Daily time",
  "上海时间（UTC+8）；点击输入框用时间选择器选取。": "Asia/Shanghai time (UTC+8); click the field to pick a time.",
  "间隔分钟": "Interval minutes",
  "两次发送之间的间隔分钟数，最小 5 分钟。间隔越小消耗的主动消息配额越多。": "Minutes between sends, minimum 5. Shorter intervals consume more proactive-message quota.",
  "发送方式": "Send mode",
  "直接发送=到点原样发送下方内容；AI 生成=把下方内容作为指令交给 AI，生成结果再回复（会创建会话、消耗 token）。": "Direct = send the text below as-is at send time; AI = treat the text below as a prompt for the AI and send its generated reply (creates a session, costs tokens).",
  "直接发送文本": "Send text directly",
  "AI 生成内容": "Generate with AI",
  "内容": "Content",
  "给 AI 的生成指令（如「播报今天的天气」），到点由 AI 生成内容后发送。": `Prompt for the AI (e.g. "report today's weather"); the AI generates and sends the content at send time.`,
  "到点直接发送的文本，上限 2000 字。": "Text sent as-is at send time, up to 2000 characters.",
  "总结今天的待办": "e.g. summarize today's todos",
  "记得喝水": "e.g. drink some water",
  "定时消息内容": "Scheduled message content",
  "保存后立即生效并重新计算下次发送时间": "Takes effect immediately on save; the next send time is recomputed.",
  "保存中…": "Saving…",
  "保存修改": "Save changes",
  "编辑": "Edit",
  "从 GitHub 检查新版本；发现新版本会自动下载并更新，重启 DSH 后生效": "Check GitHub for a new version; if found it is downloaded and applied automatically. Restart DSH to take effect.",
  "已更新 ✓": "Updated ✓",
  "检查更新": "Check for updates",
  "正在检查更新…": "Checking for updates…",
  "例如：总结今天的待办": "e.g. summarize today's todos",
  // ── 定时消息与归档（详情页卡片 + 两个独立弹窗）──
  "定时消息与归档": "Scheduled messages & archive",
  "定时消息：查看 / 删除这个机器人已设置的定时发送任务（聊天里的 /定时 命令与 AI 设置的任务都在这里）。消息归档：只读查看本地落盘的最近收发记录，按当前机器人过滤。": "Scheduled messages: view/remove timed tasks set for this bot (both /定时 chat commands and AI-created ones). Archive: read-only view of recent locally archived messages, filtered by the current bot.",
  "定时消息管理": "Scheduled message manager",
  "列出这个机器人名下的全部定时消息（每天定时与间隔循环），可单条删除；删除立即生效并落盘。": "Lists all scheduled messages under this bot (daily and interval), each removable; removal takes effect immediately and is persisted.",
  "查看定时消息": "View scheduled messages",
  "开启「消息本地归档」后，收发的消息会写入 ~/.dsh/qqbot/archive/（按天分文件）。这里只读展示最近的记录，最新在前。": 'With "message archiving" on, sent/received messages are written to ~/.dsh/qqbot/archive/ (one file per day). This shows recent records read-only, newest first.',
  "查看归档": "View archive",
  // ── replyLocale 下拉 ──
  "回复语言（replyLocale）": "Reply language (replyLocale)",
  "回复语言": "Reply language",
  "机器人直接发给 QQ 用户的系统文案（/help、/status、定时消息用法、欢迎语等）使用的语言。中文为源语言；选择 English 时这些文案自动翻译为英文，未命中的内容保持原文不丢信息。AI 对话内容本身不受影响。": "Language for system texts the bot sends directly to QQ users (/help, /status, schedule usage, welcome message, etc.). Chinese is the source language; choosing English translates them, and unmatched texts stay as-is so no information is lost. AI conversation content is unaffected.",
  "中文（默认）": "Chinese (default)",
  // ── 定时消息弹窗 ──
  "这个机器人名下的全部定时发送任务（含聊天命令与 AI 设置的）": "All scheduled send tasks under this bot (from chat commands and AI alike)",
  "正在读取定时消息…": "Loading scheduled messages…",
  "还没有定时消息。可在聊天里发 /定时 每天 09:00 内容、让 AI 帮你设置，或点上方「＋ 新增」。": "No scheduled messages yet. Send /定时 daily 09:00 text in chat, ask the AI to set one up, or click “＋ New” above.",
  "＋ 新增": "＋ New",
  "新增定时消息": "New scheduled message",
  "创建": "Create",
  "AI 生成": "AI-generated",
  "来自设置页": "From settings",
  "来自 AI": "From AI",
  "来自聊天命令": "From chat command",
  "上次失败：": "Last failed: ",
  "删除中…": "Removing…",
  "确定删除这条定时消息？删除后立即停止发送。": "Remove this scheduled message? It stops sending immediately.",
  // ── 定时任务启用 / 禁用 ──
  "禁用": "Disable",
  "已禁用": "Disabled",
  "禁用中…": "Disabling…",
  "启用中…": "Enabling…",
  "已禁用，不会执行": "Disabled — will not run",
  "确定禁用这条定时任务？禁用后不再执行，可随时重新启用。": "Disable this scheduled task? It stops running until you re-enable it.",
  // ── 定时任务 AI 脚本生成 ──
  "命令来源": "Command source",
  "手写命令": "Manual command",
  "AI 生成脚本": "AI-generate script",
  "AI 脚本描述词": "AI script prompt",
  "脚本生成中…": "Generating script…",
  "脚本生成失败": "Script generation failed",
  "生成完成后开始执行；已过的触发时刻不补跑": "Runs once the script is ready; missed times are not replayed",
  "脚本生成中…完成后自动回填命令并按计划执行。": "Generating script… The command is filled in automatically when done, then the schedule resumes.",
  "手写命令=自己写完整命令行；AI 生成脚本=只写任务描述，保存后由 AI 后台生成脚本并自动回填命令。": "Manual command = write the full command line yourself; AI-generate script = just describe the task, and AI writes the script in the background and fills in the command automatically.",
  "描述这个定时任务要做的事（如「抓取某网页今日价格并输出一行文本」）。保存后 AI 后台生成脚本：生成期间任务不执行；完成后自动按计划执行（已过的触发时刻不补跑）。": `Describe what this scheduled task should do (e.g. "fetch today's price from a page and print one line"). After saving, AI generates the script in the background: the task does not run until it is ready, then resumes on schedule (missed times are not replayed).`,
  // ── 归档弹窗 ──
  "本地落盘的最近收发记录（只读，最新在前；按当前机器人过滤）": "Recent locally archived messages (read-only, newest first; filtered by the current bot)",
  "本地落盘的收发记录（按当前机器人过滤）：左栏选日期查看内容，× 删除该天归档": "Locally archived messages (filtered by the current bot): pick a date on the left to view it, click × to delete that day's archive",
  "正在读取归档…": "Loading archive…",
  "该天没有记录。开启「消息本地归档」并收到消息后，这里会出现记录。": 'No records on this day. Records appear here once "message archiving" is on and messages arrive.',
  "归档日期文件": "Archive date files",
  "暂无归档文件": "No archive files yet",
  "删除该天归档（仅此机器人的记录）": "Delete this day's archive (only this bot's records)",
  "收到": "Received",
  "回复": "Reply",
  "主动": "Proactive",
  "会话": "Session",
  // ── 安全开关（回复净化 / SSRF 防护 / 本地路径白名单） ──
  "回复内容净化": "Reply sanitization",
  "发送前剥离模型输出里的 system-reminder、<think> 等隐藏标签块，防止内部提示词与推理过程泄漏给聊天对象。仅影响发送内容，归档与模型上下文保留原文。": "Strips hidden tag blocks such as system-reminder and <think> from model output before sending, preventing internal prompts and reasoning from leaking to chat partners. Only affects outgoing content; archives and model context keep the original text.",
  "媒体链接安全校验（SSRF 防护）": "Media URL safety check (SSRF guard)",
  "AI 发图/发文件/发语音时，校验 URL 不指向内网或保留地址（127.0.0.1、192.168.x.x、169.254 元数据等），QQ 官方域名直通。防止模型被诱导让本机请求内网服务。关闭后仅要求 http/https 协议。": "When the AI sends images/files/voice, URLs are checked against intranet and reserved addresses (127.0.0.1, 192.168.x.x, 169.254 metadata, etc.); official QQ domains pass through. Prevents the model from being tricked into probing intranet services. When off, only the http/https scheme is enforced.",
  "本地文件路径白名单": "Local path whitelist",
  "AI 发图/发文件/发语音时，本机路径必须位于工作区目录或插件数据目录内，防止把任意本机文件（如凭据、密钥）发送给聊天对象。关闭后允许任意本机路径（不推荐）。": "When the AI sends images/files/voice, local paths must reside inside the workspace or plugin data directory, preventing arbitrary local files (credentials, keys, etc.) from being sent to chat partners. When off, any local path is allowed (not recommended).",
  // ── 按群配置（群级覆盖） ──
  "按群配置": "Per-group config",
  "为特定群单独覆盖行为配置（阈值/冷却/敏感词/上下文等），其余字段跟随机器人默认。适合把某一个群调得更活跃或更安静，而不影响其他群。": "Override behavior settings (threshold/cooldowns/banned words/context, etc.) for specific groups; everything else follows the bot default. Useful for making one group more or less chatty without affecting others.",
  "还没有按群覆盖配置，所有群都使用上方机器人默认配置。": "No per-group overrides yet; every group uses the bot defaults above.",
  "覆盖字段未设置时跟随机器人默认；全部清空并保存即删除该群覆盖。": "Fields left unset follow the bot default; clearing every field and saving removes the override for that group.",
  "添加群覆盖": "Add group override",
  "编辑群覆盖": "Edit group override",
  "删除": "Delete",
  "群": "Group",
  "无覆盖字段": "No overridden fields",
  "请填写群 openid": "Please enter the group openid",
  "留空/选择「跟随默认」的字段继续使用机器人级配置，仅此群生效": 'Fields left empty or set to "Follow default" keep using the bot-level config; changes apply to this group only.',
  "群 openid": "Group openid",
  "要单独配置的群 openid（o 开头的长串）。可在群里让 AI 用 /session 查看。": 'The openid of the group to configure (a long id starting with "o"). Ask the AI to run /session in that group to find it.',
  "群全量回复": "Full group reply",
  "该群非 @ 消息是否参与价值评分并回复。": "Whether non-@ messages in this group are value-scored and answered.",
  "跟随默认": "Follow default",
  "价值阈值": "Value threshold",
  "仅群全量回复开启时有效：0-10 分，达到阈值才回复。": "Only effective when full group reply is on: score 0-10; the bot replies at or above the threshold.",
  "@ 上下文条数": "@ context messages",
  "@ 机器人时附带的本群最近消息条数。": "How many recent group messages are attached when someone @-mentions the bot.",
  "同群冷却": "Group cooldown",
  "该群两次全量回复的最小间隔（@ 回复不受限）。": "Minimum interval between two full replies in this group (@ replies are not limited).",
  "同人冷却": "Per-sender cooldown",
  "同一人在该群两次被回复的最小间隔。": "Minimum interval between replies to the same sender in this group.",
  "分片长度": "Chunk length",
  "单条回复的最大字符数，超过会拆成多条发送。": "Max characters per reply; longer replies are split into multiple messages.",
  "每条消息回复上限": "Replies per message",
  "该群每条用户消息最多被动回复几条（平台上限 5）。": "Max passive replies per user message in this group (platform limit: 5).",
  "该群回复是否优先使用 QQ Markdown。": "Whether replies in this group prefer QQ Markdown.",
  "该群是否维护跨会话长期记忆。": "Whether this group maintains cross-session long-term memory.",
  // 聊天 Preset（agentPresetChat）已从群覆盖弹窗移除，仅 bots.json 可配；词条保留备用。
  "仅该群生效的敏感词（逗号分隔），命中即撤回并跳过回复；与机器人级敏感词叠加。": "Banned words that only apply to this group (comma-separated). A hit recalls the message and skips the reply; combined with bot-level banned words.",
  "词1, 词2（留空跟随默认）": "word1, word2 (leave empty to follow default)",
  "保存后立即生效，无需重启": "Takes effect immediately after saving — no restart needed",
  // ── 定时任务管理（daily / interval / cron / at × 文本 / AI / 执行命令）──
  "定时任务管理": "Scheduled task manager",
  "支持 daily / interval / cron / at 四种触发条件，以及 文本 / AI 生成 / 执行命令 三种执行方式。": "Four triggers — daily / interval / cron / at — and three actions: text / AI-generated / run a command.",
  "待补算": "TBD",
  "新增定时任务": "New scheduled task",
  "正在读取定时任务…": "Loading scheduled tasks…",
  "还没有定时任务。可在聊天里发 /定时 每天 09:00 内容、让 AI 帮你设置，或点上方「＋ 新增」。": "No scheduled tasks yet. Send /timer daily 09:00 text in chat, ask the AI to set one up, or click “＋ New” above.",
  "确定删除这条定时任务？删除后立即停止发送。": "Delete this scheduled task? It stops firing immediately.",
  "保存后立即生效并重新计算下次触发时间": "Takes effect immediately on save; the next run time is recomputed.",
  // 编辑表单 · ① 发送给谁
  "① 发送给谁": "① Recipient",
  "决定这条任务往哪个群或哪个用户发。": "Decides which group or user this task sends to.",
  "群聊或单聊；改动范围后请确认下方 openid 与之匹配。": "Group or direct chat; after changing this, make sure the openid below matches.",
  "接收消息的群或用户 openid。机器人收到过该群/该用户消息后，可让 AI 用 /session 查到。": "The openid of the group or user that receives the message. Once the bot has seen them, ask the AI to run /session to look it up.",
  // 编辑表单 · ② 什么时候触发
  "② 什么时候触发": "② When it fires",
  "选择触发条件并填写对应参数。": "Pick a trigger and fill in its parameters.",
  "触发条件": "Trigger",
  "每天=指定时刻；间隔=按分钟循环；cron=标准表达式（可带时区）；一次性 at=绝对时间，到点后自动删除。": "daily = at a set time; interval = every N minutes; cron = a standard expression (with time zone); one-time at = an absolute time, removed after it fires.",
  "每天": "Daily",
  "间隔": "Interval",
  "一次性 at": "One-time at",
  "按所选时区解释；点击输入框可用时间选择器。": "Interpreted in the selected time zone; click the field to use the time picker.",
  "时区": "Time zone",
  "daily 默认按中国标准时间发送；如需按其他时区，请改用 cron。": "daily defaults to China Standard Time; switch to cron if you need another time zone.",
  "cron 表达式按该时区解释。": "The cron expression is interpreted in this time zone.",
  "at 时间按该时区解释。": "The one-time time is interpreted in this time zone.",
  "自定义（手动输入 IANA 时区）": "Custom (enter an IANA time zone)",
  "自定义时区": "Custom time zone",
  "两次发送之间的间隔，最小 5 分钟。间隔越小消耗的主动消息配额越多。": "Gap between two sends, minimum 5 minutes. Shorter intervals consume more proactive-message quota.",
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
  "标准 5 段：分 时 日 月 周（如 0 9 * * 1-5 = 工作日 9 点）。支持 */步长、范围、列表、月份与星期英文名。": "Standard 5 fields: minute hour day month weekday (e.g. 0 9 * * 1-5 = 9am on weekdays). Supports */step, ranges, lists, and month/weekday names.",
  "at 时间": "One-time run at",
  "一次性触发时间，到点执行一次后自动删除。": "A one-off time — the task runs once and is then removed automatically.",
  "星期过滤（可选）": "Weekday filter (optional)",
  "仅在这些星期触发；不选 = 每天。0=周日。": "Fires only on these weekdays; selecting none means every day. 0 = Sunday.",
  "星期过滤": "Weekday filter",
  "工作日": "Weekdays",
  "周末": "Weekend",
  "未来 5 年内无匹配，请检查表达式": "No match within the next 5 years — check the expression",
  "表达式还不完整或非法（应为 5 段：分 时 日 月 周）": "Expression is incomplete or invalid (5 fields expected: minute hour day month weekday)",
  // 编辑表单 · ③ 到点做什么
  "③ 到点做什么": "③ What it does",
  "选择执行方式并填写内容。": "Pick an action and fill in its content.",
  "执行方式": "Action",
  "文本=到点原样发送；AI 生成=把内容当指令交给 AI 生成后回复；执行命令=到点跑一条命令并把输出推送给用户。": "text = send as-is; AI = treat the content as a prompt and reply with what the AI generates; run command = execute a command and push its output to the user.",
  "执行命令并推送结果": "Run a command and push its output",
  "要执行的命令": "Command to run",
  "到点由服务端执行这条命令行，捕获 stdout/stderr 与退出码后推送给用户。支持 python / powershell -File / .bat / node / vbs(cscript //Nologo) / perl / php / ruby 等。": "The server runs this command line at the scheduled time, captures stdout/stderr plus the exit code, then pushes the result to the user. Supports python / powershell -File / .bat / node / vbs (cscript //Nologo) / perl / php / ruby and more.",
  "模板": "Templates",
  "bat 批处理": "Batch file (.bat)",
  "工作目录（可选）": "Working directory (optional)",
  "命令的工作目录；留空则使用插件进程目录。脚本里用相对路径时建议填写。": "Working directory for the command; leave empty for the plugin process directory. Recommended when the script uses relative paths.",
  "例如 C:/scripts": "e.g. C:/scripts",
  "工作目录": "Working directory",
  "结果处理": "Result handling",
  "raw = 直接把命令输出推送给用户；ai = 先把输出交给 AI 整理成简洁播报再推送（输出很长或含噪音时推荐）。": "raw = push the command output as-is; ai = let the AI turn it into a short report first (recommended when output is long or noisy).",
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
  "请至少设置一个覆盖字段：全部「跟随默认」等同于不添加该群覆盖。": 'Set at least one override field: leaving everything at "Follow default" is the same as not adding this group override.',
  "保存失败，请稍后重试": "Save failed; please retry later",
  "保存": "Save",
  // ── openid 归档下拉（id-picker + 两个弹窗的新提示）──
  "接收消息的群或用户 openid。点击输入框可从消息归档下拉选择：群聊候选显示群 id，单聊候选显示用户 id 与昵称；也可直接粘贴。": "The openid of the group or user receiving messages. Click the field to pick from archived chats: group candidates show the group id, DM candidates show the user id and nickname; pasting one in works too.",
  "要单独配置的群 openid（o 开头的长串）。点击输入框可从消息归档下拉选择，候选标注「群 id」；也可直接粘贴。": 'The openid of the group to configure (a long id starting with "o"). Click the field to pick from archived chats — candidates are labelled "Group id"; pasting one in works too.',
  "归档会话候选": "Archived chat candidates",
  "正在读取归档会话…": "Loading archived chats…",
  "归档里还没有该类型的会话记录，可直接粘贴 openid": "No chats of this type in the archive yet — you can paste an openid directly",
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
  "工具模式必须填写要执行的命令（如 python C:/scripts/report.py），或填写 AI 脚本描述词": "Command mode requires a command to run (e.g. python C:/scripts/report.py), or an AI script prompt",
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
  "已派发（环境无会话总线，无法确认投递，请稍后查看聊天）": "Dispatched (no session bus in this environment; delivery cannot be confirmed — check the chat later)",
  "已派发（无 deliveryId，无法确认投递，请稍后查看聊天）": "Dispatched (no deliveryId; delivery cannot be confirmed — check the chat later)",
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
  "请填写 AI 脚本描述词（如：抓取某网页今日价格并输出）": "Enter the AI script prompt (e.g. fetch today's price from a webpage and print it)",
  "例如：访问 https://example.com/price 抓取今日价格，输出一行「今日价格：xx 元」": "e.g. fetch today's price from https://example.com/price and print one line like “Today's price: xx yuan”"
});
var en = EN;
var zh = Object.freeze(Object.fromEntries(
  Object.keys(EN).map((key) => [key, key === "$locale" ? "zh" : key])
));
var translate = (key) => key;
function setTranslator(next) {
  translate = typeof next === "function" ? next : (key) => key;
}
function isEnglish() {
  return translate("$locale") === "en";
}
function translateDynamic(text) {
  let m;
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
  m = /^每天 (\d{1,2}:\d{2})$/.exec(text);
  if (m) return `Daily at ${m[1]}`;
  m = /^每 (\d+) 分钟$/.exec(text);
  if (m) return `Every ${m[1]} min`;
  m = /^下次发送 (.+)$/.exec(text);
  if (m) return `Next send: ${m[1]}`;
  m = /^群 (.+) 的覆盖配置已保存（立即生效）$/.exec(text);
  if (m) return `Override for group ${m[1]} saved (takes effect immediately)`;
  m = /^确定删除群 (.+) 的覆盖配置？删除后该群恢复使用机器人默认配置。$/.exec(text);
  if (m) return `Delete the override for group ${m[1]}? That group will fall back to the bot's default config.`;
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
  m = /^(\d+) 分钟$/.exec(text);
  if (m) return `${m[1]} min`;
  m = /^(\d+) 小时$/.exec(text);
  if (m) return `${m[1]} h`;
  m = /^该任务归属机器人 (.+)$/.exec(text);
  if (m) return `This task belongs to bot ${m[1]}`;
  m = /^每 (\d+) 小时$/.exec(text);
  if (m) return `Every ${m[1]} h`;
  m = /^一次性 (.+)$/.exec(text);
  if (m) return `Once at ${m[1]}`;
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
  m = /^暂无新版本（当前 v(.+) 已是最新）$/.exec(text);
  if (m) return `No new version (v${m[1]} is the latest)`;
  m = /^发现新版本 v(.+)，正在自动更新…$/.exec(text);
  if (m) return `New version v${m[1]} found; updating automatically…`;
  m = /^已自动更新到 v(.+)（备份于安装目录 \.update-backup\/），重启 DSH 后生效$/.exec(text);
  if (m) return `Updated to v${m[1]} (old files backed up in .update-backup/ inside the install directory). Restart DSH to take effect.`;
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
  m = /^会话 (.+)$/.exec(text);
  if (m) return `Session ${m[1]}`;
  m = /^周([一二三四五六日\d、]+)$/.exec(text);
  if (m) {
    const wd = { "一": "Mon", "二": "Tue", "三": "Wed", "四": "Thu", "五": "Fri", "六": "Sat", "日": "Sun", "、": ", " };
    return `Week ${[...m[1]].map((c) => wd[c] ?? c).join("")}`;
  }
  return text;
}
function localizeText(value) {
  if (typeof value !== "string") return value;
  const exact = translate(value);
  if (exact !== value || !isEnglish()) return exact;
  return translateDynamic(value);
}
var LOCALIZED_PROPS = Object.freeze([
  "aria-label",
  "alt",
  "placeholder",
  "title",
  "label"
]);
function localizeChild(child) {
  if (typeof child === "string") return localizeText(child);
  if (Array.isArray(child)) return child.map(localizeChild);
  return child;
}
function h(type, props = {}, ...children) {
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

// src/client/types.ts
var EMPTY_CATALOGS = { models: [], agentPresets: [] };

// src/client/meta.ts
var FIELD_LABELS = {
  workspacePath: "工作区目录",
  agentPreset: "Agent Preset",
  model: "模型",
  valueThreshold: "群消息价值阈值",
  atContextMessages: "AT 上下文条数",
  groupCooldownMs: "群回复最小间隔",
  senderCooldownMs: "同人回复间隔",
  replyChunkChars: "分片字符数",
  maxRepliesPerMessage: "每条消息最大回复",
  quoteMaxChars: "引用字数上限",
  quotaPerDay: "主动消息日配额"
};
var FIELD_HELP = {
  valueThreshold: "0–10 分。机器人给每条群消息打分，只有达到分数才会回复；分数越高越安静。设为 0 表示群里所有消息都回复（容易刷屏）。@ 机器人的消息不受此限制，一定会回复。",
  atContextMessages: "@ 机器人时，额外附带群里最近 N 条消息一起送给模型，让它听懂上下文。设为 0 则只发送被 @ 的这一条。条数越多越聪明，也越耗 token。",
  groupCooldownMs: "同一个群里，两次「非 @ 触发」的回复之间至少要隔这么久，用来防止机器人刷屏。@ 机器人的回复不受限制。",
  senderCooldownMs: "同一个人在这么短的时间内不会被回复第二次，避免被同一个人连续刷屏。",
  replyChunkChars: "QQ 单条消息有长度限制，超长的回复会按这个字数切成多条依次发送。太小会切得很碎，太大会被平台截断。",
  maxRepliesPerMessage: "一条用户消息最多触发几次被动回复（QQ 平台硬上限为 5）。调小可以避免机器人一次性连发多条。",
  quoteMaxChars: "文本引用最多显示多少字（仅主动消息回退为文本引用时使用；原生引用气泡由 QQ 客户端自行截断），超出部分以省略号结尾。",
  quotaPerDay: "单日最多发送多少条主动消息（定时消息、欢迎语、出箱补发、AI 发图都计入）。0 表示不限制——但 QQ 平台主动消息配额极少，超发会被限流，建议保持默认 50。"
};
var SWITCH_DEFS = [
  {
    key: "groupFullReply",
    label: "群全量消息回复",
    desc: "开启后，群里没有 @ 机器人的消息也会参与价值评分，达到阈值才回复；@ 机器人的消息始终回复并可使用工具。关闭后，机器人只处理 @ 它的群消息。",
    def: true
  },
  {
    key: "respondToBots",
    label: "响应机器人消息",
    desc: "开启后，其他机器人发出的消息也会触发本机器人回复。默认关闭：其他机器人的消息一律忽略，防止同群的多个机器人互相触发、循环刷屏。注意 QQ 平台在群聊里通常不向机器人推送其他机器人的消息，此开关只在平台确实推送时才有实际效果。",
    def: false
  },
  // archiveEnabled / memoryEnabled / fileIngestion 已从界面移除（默认常开，仅 bots.json 可配）——
  // 见本文件顶部注释；配置解析与默认值仍在 shared/config.ts 与 store-file.ts 中保留。
  {
    key: "approvalButtons",
    label: "按钮审批",
    desc: "AI 执行敏感操作前可发送「✅允许 / ❌拒绝」按钮消息，点击即回传决定；超时未点击视为拒绝。审批消息占用主动消息配额。",
    def: true
  },
  {
    key: "ssrfGuard",
    label: "媒体链接安全校验（SSRF 防护）",
    desc: "AI 发图/发文件/发语音时，校验 URL 不指向内网或保留地址（127.0.0.1、192.168.x.x、169.254 元数据等），QQ 官方域名直通。防止模型被诱导让本机请求内网服务。关闭后仅要求 http/https 协议。",
    def: true
  }
];
var COOLDOWN_OPTIONS = [0, 1e4, 3e4, 6e4, 12e4, 3e5, 6e5, 18e5];
function cooldownLabel(ms) {
  if (ms === 0) return "不限制";
  if (ms % 6e4 === 0 && ms >= 6e4) return `${ms / 6e4} 分钟`;
  return `${ms / 1e3} 秒`;
}

// src/client/glyphs.tsx
function QqLogoGlyph() {
  return h(
    "svg",
    { viewBox: "0 0 24 24", focusable: "false", "aria-hidden": "true" },
    h("path", {
      fill: "currentColor",
      d: "M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 2.394 4.771-.612.188-1.363.479-1.845.835-.434.32-.379.646-.301.778.343.578 5.883.369 7.482.189 1.6.18 7.14.389 7.483-.189.078-.132.132-.458-.301-.778-.483-.356-1.233-.646-1.846-.836 1.637-1.384 2.393-3.302 2.393-4.771 0 0 1.563 2.537 2.103 2.472.251-.03.581-1.39-.438-4.673"
    })
  );
}
function FolderGlyph() {
  return h(
    "svg",
    { viewBox: "0 0 24 24", focusable: "false", "aria-hidden": "true" },
    h("path", {
      fill: "currentColor",
      d: "M3 6.5A1.5 1.5 0 0 1 4.5 5h4.1c.47 0 .91.22 1.2.6L11 7h8.5A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z"
    })
  );
}
function FolderUpGlyph() {
  return h(
    "svg",
    { viewBox: "0 0 24 24", focusable: "false", "aria-hidden": "true" },
    h("path", {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M11 19l-7-7 7-7M4 12h16"
    })
  );
}
function QqBotGlyph(props) {
  return h(
    "svg",
    {
      viewBox: "0 0 24 24",
      width: "1em",
      height: "1em",
      focusable: "false",
      "aria-hidden": "true",
      className: props.className
    },
    h("circle", { cx: 12, cy: 2.9, r: 1.2, fill: "currentColor" }),
    h("line", { x1: 12, y1: 4, x2: 12, y2: 6.2, stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" }),
    h(
      "mask",
      { id: `qbot-face-${props.uid}` },
      h("rect", { x: 0, y: 0, width: 24, height: 24, fill: "#fff" }),
      h("circle", { cx: 9.3, cy: 12, r: 1.6, fill: "#000" }),
      h("circle", { cx: 14.7, cy: 12, r: 1.6, fill: "#000" }),
      h("path", { d: "M9.4 15.1 Q12 17.1 14.6 15.1", fill: "none", stroke: "#000", strokeWidth: 1.5, strokeLinecap: "round" })
    ),
    h("rect", { x: 4.5, y: 6, width: 15, height: 13, rx: 4.5, fill: "currentColor", mask: `url(#qbot-face-${props.uid})` })
  );
}

// src/client/ui.tsx
var React2 = __toESM(require("react"), 1);

// src/shared/time.ts
var SHANGHAI_TZ = "Asia/Shanghai";
var SHANGHAI_OFFSET_MS = 8 * 60 * 60 * 1e3;

// src/client/ui.tsx
function OnlineBadge(props) {
  return h(
    "span",
    { className: "qbot-onlineBadge" },
    h("span", { className: "qbot-stateDot", "data-tone": props.tone }),
    props.text
  );
}
function StateLabel(props) {
  return h(
    "span",
    { className: "qbot-stateLabel" },
    h("span", { className: "qbot-stateDot", "data-tone": props.tone }),
    props.text
  );
}
function Field(props, children) {
  return h(
    "label",
    { className: "qbot-field" },
    h("span", { className: "qbot-fieldLabel" }, props.label),
    children
  );
}
function TextInput(props) {
  return h("input", { className: "qbot-input", ...props });
}
function TextArea(props) {
  return h("textarea", { className: "qbot-textarea", ...props });
}
function SettingRow(props) {
  return h(
    "div",
    { className: `qbot-settingRow${props.wide ? " is-wide" : ""}`, key: props.rowKey },
    h(
      "div",
      { className: "qbot-settingCopy" },
      h("span", { className: "qbot-settingTitle" }, props.label),
      h("span", { className: "qbot-settingDesc" }, props.desc)
    ),
    h("div", { className: `qbot-settingControl${props.wide ? " is-wide" : ""}` }, props.control)
  );
}
function errText(err) {
  if (err == null) return "未知错误";
  if (typeof err === "string") return err;
  if (typeof err === "object") {
    const e = err;
    if (typeof e.message === "string" && e.message) return e.message;
    if (typeof e.code === "string" && e.code) return e.code;
    try {
      const json = JSON.stringify(err);
      if (json && json !== "{}") return json;
    } catch {
    }
  }
  return String(err);
}
var val = (res) => res && typeof res === "object" ? res.value ?? res.data : void 0;
function formatTime(raw) {
  let ts;
  if (typeof raw === "number") ts = raw;
  else if (typeof raw === "string" && raw) ts = Date.parse(raw);
  else return "—";
  if (Number.isNaN(ts)) return typeof raw === "string" ? raw : "—";
  return new Date(ts).toLocaleString(void 0, { timeZone: SHANGHAI_TZ });
}
function formatRemaining(ms) {
  const total = Math.max(0, Math.ceil(ms / 1e3));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
var presetOptions = (list) => [
  { value: "", label: "跟随 Host 默认" },
  ...list.filter((p) => p && typeof p.id === "string" && p.id).map((p) => ({ value: p.id, label: typeof p.label === "string" && p.label ? p.label : p.id }))
];
function editRow(label, hint, control) {
  return h(
    "div",
    { className: "qbot-editRow" },
    h("span", { className: "qbot-editLabel" }, label),
    control,
    h("span", { className: "qbot-editHint" }, hint)
  );
}
var confirmDispatcher = null;
function confirmDlg(opts) {
  if (typeof confirmDispatcher !== "function") {
    return Promise.resolve(window.confirm(opts.message));
  }
  return new Promise((resolve) => confirmDispatcher({ ...opts, resolve }));
}
function ConfirmHost() {
  const [pending, setPending] = React2.useState(null);
  React2.useEffect(() => {
    confirmDispatcher = (opts) => setPending(opts);
    return () => {
      confirmDispatcher = null;
    };
  }, []);
  React2.useEffect(() => {
    if (!pending) return;
    const onKey = (ev) => {
      if (ev.key !== "Escape") return;
      ev.stopPropagation();
      setPending((cur) => {
        cur?.resolve(false);
        return null;
      });
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [pending !== null]);
  if (!pending) return null;
  const done = (ok) => {
    setPending(null);
    pending.resolve(ok);
  };
  return h(
    "div",
    { className: "qbot-confirmOverlay", role: "alertdialog", "aria-modal": "true", "aria-label": localizeText("确认操作") },
    h(
      "div",
      { className: "qbot-confirmBox" },
      h("div", { className: "qbot-confirmMsg" }, pending.message),
      h(
        "div",
        { className: "qbot-confirmFoot" },
        h(
          "button",
          { type: "button", className: "qbot-btn", onClick: () => done(false) },
          pending.cancelLabel ?? localizeText("取消")
        ),
        h("button", {
          type: "button",
          autoFocus: true,
          className: `qbot-btn ${pending.danger ? "qbot-btnDanger" : "qbot-btnPrimary"}`,
          onClick: () => done(true)
        }, pending.confirmLabel ?? localizeText(pending.danger ? "确认删除" : "确定"))
      )
    )
  );
}

// src/client/styles.ts
var CSS_TEXT = `
.qbot-page {
  --qbot-blue: #1677ff;
  --qbot-blue-dark: #0958d9;
  --qbot-business: var(--dsw-alias-state-business-primary, #3370ff);
  width: 100%;
  max-width: 1080px;
  padding: 2px 0 30px;
  color: var(--dsw-alias-label-primary, #1f2329);
  box-sizing: border-box;
}
.qbot-page *, .qbot-page *::before, .qbot-page *::after { box-sizing: border-box; }

/* ── 标题栏（dim-title）────────────────────────────────────────────────── */
/* sticky 吸顶：长页面滚动时标题栏（含连接状态）常驻视口顶部；负顶 margin 抵消
   .qbot-page 的 2px 顶部 padding，使吸附时背景无缝贴合滚动容器顶缘。 */
.qbot-title { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: -2px 0 8px; padding: 8px 2px 10px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-brand { min-width: 0; width: max-content; max-width: 100%; display: flex; flex-direction: column; align-items: flex-start; gap: 1px; margin: -2px -6px; padding: 2px 6px; border-radius: 8px; }
.qbot-brandHeading { display: flex; align-items: baseline; gap: 8px; white-space: nowrap; }
.qbot-brandName { color: var(--dsw-alias-label-primary, #1f2329); font-size: 20px; line-height: 24px; font-weight: 800; letter-spacing: .04em; }
.qbot-brandVersion { color: var(--dsw-alias-label-tertiary, #8f959e); font: 500 10px/16px ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 0; }
.qbot-updateBtn { align-self: center; min-height: 20px; padding: 1px 9px; border-radius: 999px; font-size: 11px; line-height: 16px; font-weight: 560; }
.qbot-updateBtn:disabled { cursor: default; opacity: .65; }
.qbot-updateBtn.is-done { color: var(--dsw-alias-state-success-primary, #2ea121); border-color: color-mix(in srgb, var(--dsw-alias-state-success-primary, #2ea121) 45%, var(--dsw-alias-border-l2, #dfe1e5)); }
.qbot-title p { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 18px; font-weight: 500; white-space: nowrap; }
.qbot-titleActions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex-wrap: wrap; }

/* 标题栏品牌区：QQ 机器人图标 + 文案（横向排列） */
.qbot-brand { flex-direction: row; align-items: center; gap: 10px; }
.qbot-brandText { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.qbot-brandGlyph { flex: none; width: 30px; height: 30px; color: var(--qbot-blue, #1677ff); }

/* 设置侧栏导航项：QQ 机器人图标 + 文案，隐藏宿主默认齿轮 */
.qbot-navLabel { display: inline-flex; align-items: center; gap: 8px; }
.qbot-navGlyph { flex: none; width: 18px; height: 18px; color: inherit; }
.qbot-navText { white-space: nowrap; }
.VOzbGW_navCell:has(.qbot-navLabel) .VOzbGW_navIcon { display: none !important; }

/* ── 面板（dim-panel）──────────────────────────────────────────────────── */
.qbot-panel { min-width: 0; }

/* ── 状态胶囊 / 状态标签（dim-onlineBadge / dim-stateLabel / dim-stateDot）─ */
.qbot-onlineBadge { min-height: 30px; display: inline-flex; align-items: center; gap: 7px; padding: 0 11px; border: 0; border-radius: 999px; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f2f3f5); font: inherit; font-size: 12px; font-weight: 400; line-height: normal; white-space: nowrap; }
.qbot-stateLabel { display: inline-flex; align-items: center; gap: 8px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: normal; font-weight: 600; }
.qbot-stateDot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--dsw-alias-label-tertiary, #8f959e); box-shadow: none; }
.qbot-stateDot[data-tone="success"] { background: var(--dsw-alias-state-success-primary, #20a162); box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-success-primary, #20a162) 14%, transparent); }
.qbot-stateDot[data-tone="warning"] { background: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-stateDot[data-tone="error"] { background: var(--dsw-alias-state-error-primary, #d54941); }

/* ── 面板通用（dim-channelPage / dim-surfaceCard）─────────────────────── */
.qbot-channelPage { min-width: 0; width: 100%; max-width: none; display: flex; flex-direction: column; gap: 12px; padding: 0 0 24px; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-surfaceCard { position: relative; overflow: hidden; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 3%); }
.qbot-surfaceBody { padding: 24px; display: flex; flex-direction: column; gap: 12px; }
.qbot-cardTitle { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 17px; line-height: 1.35; font-weight: 650; }
.qbot-listHeading { min-height: 0; display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: 0; }
.qbot-listHeading h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 14px; line-height: normal; font-weight: 650; }
.qbot-listTitle { min-width: 0; display: inline-flex; align-items: center; gap: 10px; }
.qbot-hint { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.6; }

/* ── 通知（dim-statusNotice / info 变体）──────────────────────────────── */
.qbot-statusNotice { display: flex; align-items: flex-start; gap: 10px; padding: 13px 15px; border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 22%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 10px; color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 8%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 13px; line-height: 1.5; }
.qbot-infoNotice { display: flex; align-items: flex-start; gap: 10px; padding: 13px 15px; border: 1px solid color-mix(in srgb, var(--qbot-business) 22%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 10px; color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 7%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 13px; line-height: 1.5; }
/* 页面级更新提示（qbot-page 是普通块布局，无 channelPage 的 flex gap，需自带下边距与面板隔开） */
.qbot-updateNotice { margin: 0 0 18px; }

/* ── 机器人卡片（dim-botCard）─────────────────────────────────────────── */
.qbot-botList { min-width: 0; width: 100%; max-width: 100%; display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; }
.qbot-botCard { position: relative; min-width: 0; width: 100%; max-width: 100%; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 3%); font: inherit; text-align: left; cursor: pointer; transition: border-color .16s ease, box-shadow .16s ease; }
.qbot-botCard:hover { border-color: color-mix(in srgb, var(--qbot-blue) 25%, var(--dsw-alias-border-l2, #e5e6eb)); box-shadow: 0 5px 16px rgb(31 35 41 / 5%); }
.qbot-botCard:focus-visible { outline: none; border-color: color-mix(in srgb, var(--qbot-blue) 72%, var(--dsw-alias-border-l2, #dfe1e5)); box-shadow: 0 0 0 1px color-mix(in srgb, var(--qbot-blue) 24%, transparent) inset, 0 3px 12px rgb(22 119 255 / 7%); }
.qbot-botCardBody { padding: 12px; display: flex; align-items: center; gap: 12px; }
.qbot-botTop { min-width: 0; flex: 1 1 auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.qbot-botIdentity { min-width: 0; flex: 1 1 0; display: flex; align-items: center; gap: 10px; }
.qbot-botAvatar { flex: none; width: 38px; height: 38px; display: grid; place-items: center; overflow: hidden; border-radius: 11px; color: #fff; background: var(--qbot-blue); }
.qbot-botAvatar svg { width: 27px; height: 27px; }
.qbot-botName { min-width: 0; }
.qbot-botName h3 { overflow: hidden; margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 15px; font-weight: 650; line-height: normal; text-overflow: ellipsis; white-space: nowrap; }
.qbot-botName p { overflow: hidden; margin: 4px 0 0; color: var(--dsw-alias-label-secondary, #646a73); font: 12px ui-monospace, SFMono-Regular, monospace; line-height: normal; text-overflow: ellipsis; white-space: nowrap; }
.qbot-botTools { flex: none; display: flex; align-items: center; gap: 8px; }
.qbot-botHealthGroup { min-width: 0; max-width: 100%; flex: none; display: grid; justify-items: end; gap: 5px; }
.qbot-lastChecked { display: inline-flex; align-items: baseline; gap: 4px; color: var(--dsw-alias-label-tertiary, #8f959e); font: inherit; font-size: 11px; font-weight: 400; line-height: normal; white-space: nowrap; }
.qbot-botChevron { flex: none; width: 9px; height: 9px; border-right: 1.6px solid var(--dsw-alias-label-tertiary, #8f959e); border-bottom: 1.6px solid var(--dsw-alias-label-tertiary, #8f959e); transform: rotate(-45deg); }

/* ── 空状态（dim-emptyView）───────────────────────────────────────────── */
.qbot-emptyView { min-height: 230px; display: grid; grid-template-columns: minmax(0, 1fr) 180px; align-items: center; gap: 30px; }
.qbot-emptyCopy { min-width: 0; }
.qbot-emptyCopy h3 { margin: 8px 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 18px; line-height: 1.35; font-weight: 650; }
.qbot-emptyCopy > p { max-width: 560px; margin: 0; color: var(--dsw-alias-label-secondary, #646a73); line-height: 1.65; }
.qbot-emptyBrand { width: 110px; height: 110px; display: grid; place-items: center; justify-self: center; border-radius: 28px; color: #fff; background: var(--qbot-blue); box-shadow: 0 18px 45px rgb(22 119 255 / 18%); }
.qbot-emptyBrand svg { width: 56px; height: 56px; }

/* ── 分段 Tab（dim-contextTabs）───────────────────────────────────────── */
.qbot-segTabs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 3px; padding: 3px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 8px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-segTabs button { min-width: 0; min-height: 34px; padding: 5px 12px; border: 0; border-radius: 6px; color: var(--dsw-alias-label-secondary, #646a73); background: transparent; font: inherit; font-weight: 500; cursor: pointer; transition: color .15s ease, background .15s ease, box-shadow .15s ease; }
.qbot-segTabs button:hover:not([aria-selected="true"]) { color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-segTabs button[aria-selected="true"] { color: var(--qbot-business); background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 3px rgb(31 35 41 / 12%); }

/* ── 扫码布局（dim-qrLayout / dim-qrFrame / dim-steps）────────────────── */
/* 设置面板实际宽度有限，扫码区改为纵向：二维码在上，说明在下（不再左右分栏）。 */
.qbot-qrLayout { display: flex; flex-direction: column; align-items: stretch; gap: 22px; }
.qbot-qrColumn { width: 100%; min-width: 0; max-width: 320px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.qbot-qrFrame { position: relative; width: min(270px, 100%); height: auto; aspect-ratio: 1; display: grid; place-items: center; overflow: hidden; padding: 10px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 16px; background: #fff; }
.qbot-qrFrame::before { content: ""; position: absolute; inset: 7px; z-index: 0; border: 1px solid color-mix(in srgb, var(--qbot-blue) 16%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 12px; pointer-events: none; }
.qbot-qrSvg { position: relative; z-index: 1; width: 100%; height: 100%; }
.qbot-qrSvg svg { width: 100%; height: 100%; display: block; }
.qbot-qrFallback { position: relative; z-index: 1; display: grid; place-items: center; gap: 8px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; line-height: 1.5; text-align: center; }
.qbot-qrPending { position: absolute; left: 10px; right: 10px; bottom: 10px; z-index: 2; padding: 5px 0; border-radius: 8px; color: var(--qbot-blue); background: rgb(255 255 255 / 92%); font-size: 12px; font-weight: 600; text-align: center; backdrop-filter: blur(3px); }
.qbot-countdown { width: 100%; margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: normal; }
.qbot-qrCopy { width: 100%; min-width: 0; display: flex; flex-direction: column; gap: 12px; overflow-wrap: anywhere; }
.qbot-qrCopy h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 18px; line-height: 1.35; font-weight: 650; }
.qbot-qrCopy > p { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); line-height: 1.65; }
.qbot-qrLead { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12.5px; line-height: 1.7; }

/* ── 添加机器人：页面层级（页头）───────────────────────────────────────── */
.qbot-addView { gap: 14px; }
/* 返回导航吸顶（添加页 / 详情页）：滚动时返回按钮（详情页含连接状态）常驻顶部 */
.qbot-addNav { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; gap: 10px; margin: -2px 0 0; padding: 8px 2px 6px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-addHead { display: flex; flex-direction: column; gap: 5px; }
.qbot-addHead h2 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 19px; line-height: 1.35; font-weight: 700; }
.qbot-addHead p { max-width: 760px; margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12.5px; line-height: 1.75; }

/* ── 添加机器人：引导块（第二层层次）──────────────────────────────────── */
.qbot-manualPanel { gap: 16px; }
.qbot-copyHead { display: flex; flex-direction: column; gap: 5px; }
.qbot-copyHead h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 17px; line-height: 1.35; font-weight: 650; }
.qbot-copyHead p { max-width: 660px; margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12.5px; line-height: 1.7; }
.qbot-guideBlock { min-width: 0; display: flex; flex-direction: column; gap: 10px; padding: 14px 15px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-guideTitle { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; font-weight: 700; letter-spacing: .1em; }
.qbot-steps.is-rich { width: 100%; margin: 0; }
.qbot-steps.is-rich li { flex-direction: column; align-items: flex-start; gap: 2px; min-height: 0; padding: 2px 0 9px 36px; }
.qbot-steps.is-rich li:last-child { padding-bottom: 0; }
.qbot-steps.is-rich li strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; line-height: 1.5; }
.qbot-steps.is-rich li > span { color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.7; }

/* ── 添加机器人：补充说明（第三层层次）────────────────────────────────── */
.qbot-noteList { min-width: 0; display: flex; flex-direction: column; gap: 7px; padding: 13px 15px; border: 1px dashed var(--dsw-alias-border-l2, #dfe1e5); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-noteTitle { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; font-weight: 700; letter-spacing: .1em; }
.qbot-noteList ul { display: flex; flex-direction: column; gap: 6px; margin: 0; padding: 0; list-style: none; }
.qbot-noteList li { position: relative; padding-left: 13px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.75; }
.qbot-noteList li::before { content: ""; position: absolute; left: 0; top: 9px; width: 4px; height: 4px; border-radius: 50%; background: var(--dsw-alias-border-l2, #c9cdd4); }

/* ── 扫码：二维码占位 + 操作区 ─────────────────────────────────────────── */
.qbot-qrPlaceholder { position: relative; z-index: 1; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; text-align: center; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-qrPlaceholderIcon { display: grid; place-items: center; width: 54px; height: 54px; border-radius: 16px; color: var(--qbot-blue); background: color-mix(in srgb, var(--qbot-blue) 10%, transparent); }
.qbot-qrPlaceholderIcon svg { width: 28px; height: 28px; }
.qbot-qrPlaceholder strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; }
.qbot-qrPlaceholderHint { font-size: 12px; line-height: 1.6; }
.qbot-qrActions { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 10px; }
.qbot-qrError { margin: 12px 0 0; color: var(--dsw-alias-state-error-primary, #d54941); font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-steps { margin: 18px 0 0; padding: 0; list-style: none; counter-reset: qbot-step; }
.qbot-steps li { position: relative; min-height: 28px; display: flex; align-items: center; padding: 5px 0 5px 36px; color: var(--dsw-alias-label-secondary, #646a73); line-height: 1.5; counter-increment: qbot-step; }
.qbot-steps li::before { content: counter(qbot-step); position: absolute; left: 0; top: 4px; width: 25px; height: 25px; display: grid; place-items: center; border-radius: 8px; color: #4d93f8; background: color-mix(in srgb, var(--qbot-blue) 16%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 12px; font-weight: 650; }

/* ── 凭据表单（dim-credentialPanel / dim-credentialField）─────────────── */
.qbot-credentialPanel { display: grid; gap: 18px; }
.qbot-credentialTitle { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 17px; line-height: 1.35; font-weight: 650; }
.qbot-credentialForm { min-width: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 12px; }
.qbot-credentialActions { grid-column: 1 / -1; }
.qbot-field { min-width: 0; display: grid; gap: 7px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: normal; font-weight: 560; }
.qbot-input { width: 100%; min-width: 0; height: 38px; padding: 0 11px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; outline: none; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: 13px ui-monospace, SFMono-Regular, Menlo, monospace; transition: border-color .16s ease, box-shadow .16s ease; }
.qbot-input:focus { border-color: #4e5969; box-shadow: 0 0 0 3px rgb(78 89 105 / 10%); }
.qbot-input::placeholder { color: var(--dsw-alias-label-tertiary, #8f959e); font-family: inherit; }
select.qbot-input { cursor: pointer; font-family: inherit; }

/* ── 配置网格 ─────────────────────────────────────────────────────────── */
.qbot-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 12px; }

/* ── 卡片层级：标题块 / 分组标签 ──────────────────────────────────────── */
.qbot-cardHead { display: flex; flex-direction: column; gap: 5px; }
.qbot-cardHead .qbot-cardTitle { margin: 0; }
.qbot-subLabel { margin: 8px 0 -6px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; font-weight: 680; letter-spacing: .12em; }

/* ── 工作区路径字段 ───────────────────────────────────────────────────── */
.qbot-pathField { display: flex; align-items: stretch; gap: 8px; }
.qbot-pathBox { flex: 1 1 auto; min-width: 0; height: 34px; display: flex; align-items: center; padding: 0 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 8px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-pathText { overflow: hidden; color: var(--dsw-alias-label-primary, #1f2329); font: 12px ui-monospace, SFMono-Regular, Menlo, monospace; text-overflow: ellipsis; white-space: nowrap; }
.qbot-pathField .qbot-btn { flex: none; min-height: 34px; }

/* ── 高级选项折叠区（模仿 dsh-im dim-collapsibleAccount）──────────────── */
.qbot-collapsible { min-width: 0; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-collapsibleHead { min-width: 0; display: flex; align-items: center; gap: 10px; padding: 13px 15px; border-radius: 10px; cursor: pointer; user-select: none; -webkit-user-select: none; transition: background .15s ease; }
.qbot-collapsibleHead:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-collapsibleHead:focus-visible { outline: 2px solid var(--qbot-business); outline-offset: 2px; }
.qbot-collapsibleCopy { min-width: 0; flex: 1 1 auto; display: flex; flex-direction: column; gap: 2px; }
.qbot-collapsibleCopy strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; line-height: normal; font-weight: 650; }
.qbot-collapsibleCopy span { overflow: hidden; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: normal; text-overflow: ellipsis; white-space: nowrap; }
.qbot-collapsibleChevron { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: 9px; height: 9px; border-right: 1.6px solid var(--dsw-alias-label-tertiary, #8f959e); border-bottom: 1.6px solid var(--dsw-alias-label-tertiary, #8f959e); transform: rotate(-45deg); transition: transform .22s cubic-bezier(.4, 0, .2, 1); transform-origin: 50% 50%; }
.qbot-collapsible.is-open .qbot-collapsibleChevron { transform: rotate(45deg); }
.qbot-collapsibleBody { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .22s cubic-bezier(.4, 0, .2, 1); }
.qbot-collapsible.is-open > .qbot-collapsibleBody { grid-template-rows: 1fr; }
.qbot-collapsibleInner { min-height: 0; overflow: hidden; }
.qbot-collapsible:not(.is-open) .qbot-collapsibleInner { visibility: hidden; }
.qbot-collapsibleContent { display: flex; flex-direction: column; gap: 14px; padding: 2px 15px 15px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); padding-top: 14px; }

/* ── 目录选择弹窗 ─────────────────────────────────────────────────────── */
.qbot-modalOverlay { position: fixed; inset: 0; z-index: 9999; display: grid; place-items: center; padding: 24px; background: rgb(31 35 41 / 42%); backdrop-filter: blur(2px); animation: qbotFadeIn 0.16s ease-out; }
/* 自定义确认框：z-index 高于 modalOverlay，盖在任意打开的弹窗之上 */
.qbot-confirmOverlay { position: fixed; inset: 0; z-index: 10010; display: grid; place-items: center; padding: 24px; background: rgb(31 35 41 / 46%); backdrop-filter: blur(2px); animation: qbotFadeIn 0.16s ease-out; }
.qbot-confirmBox { width: min(420px, 92vw); display: flex; flex-direction: column; gap: 16px; padding: 18px 20px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 12px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 12px 40px rgb(31 35 41 / 18%); animation: qbotPopIn 0.16s ease-out; }
.qbot-confirmMsg { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13.5px; line-height: 1.6; overflow-wrap: anywhere; white-space: pre-wrap; }
.qbot-confirmFoot { display: flex; justify-content: flex-end; gap: 10px; }
.qbot-modal { width: min(560px, 100%); height: min(72vh, 640px); display: flex; flex-direction: column; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 24px 64px rgb(31 35 41 / 24%); overflow: hidden; animation: qbotPopIn 0.18s ease-out; }
@keyframes qbotFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes qbotPopIn { from { opacity: 0; transform: scale(0.97) translateY(6px); } to { opacity: 1; transform: none; } }
.qbot-modalHead { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; padding: 18px 20px 14px; }
.qbot-modalHead strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 16px; line-height: 1.4; font-weight: 650; }
.qbot-modalHead p { margin: 2px 0 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; }
.qbot-modalClose { flex: none; width: 28px; height: 28px; border: 0; border-radius: 8px; color: var(--dsw-alias-label-tertiary, #8f959e); background: transparent; font-size: 18px; line-height: 1; cursor: pointer; }
.qbot-modalClose:hover { color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-modalPath { margin: 0 20px; padding: 8px 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 8px; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-module-platform, #f7f8fa); font-size: 12px; overflow-wrap: anywhere; }
.qbot-modalList { flex: 1 1 auto; min-height: 0; margin: 12px 20px 0; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; }
/* 吸顶：tabs/notice 固定在面板头部，仅内层内容区滚动 */
.qbot-modalListScroll { flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; display: flex; flex-direction: column; gap: 2px; padding: 0 6px 6px; }
.qbot-dirRow { display: flex; align-items: center; gap: 10px; min-height: 38px; padding: 0 10px; border: 0; border-radius: 8px; color: var(--dsw-alias-label-primary, #1f2329); background: transparent; font: inherit; font-size: 13px; text-align: left; cursor: pointer; transition: background .12s ease; }
.qbot-dirRow.is-selected { background: var(--dsw-alias-bg-active, rgba(22, 119, 255, .14)); font-weight: 600; }
.qbot-dirRow:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-dirRow svg { flex: none; width: 16px; height: 16px; color: var(--qbot-business); }
.qbot-modalState { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 96px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; }
.qbot-modalError { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-modalFoot { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 14px 20px 18px; }
/* 弹窗底部内联错误：常驻可见，不随弹窗内容滚动而移出视口 */
.qbot-footError { margin: 0; color: var(--dsw-alias-state-error-primary, #d54941); font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; }
/* 宽弹窗：定时消息 / 消息归档 列表内容较长，放宽上限 */
.qbot-modalWide { width: min(760px, 100%); }
/* ── 概览第一行右侧操作区（定时消息 / 消息归档 入口） ── */
.qbot-heroActions { display: flex; align-items: center; gap: 8px; margin-left: auto; padding-left: 12px; flex: none; }
/* ── 定时消息弹窗：范围 Tab + 群聊/单聊分组 ── */
.qbot-schedTabs { display: flex; align-items: center; gap: 4px; padding: 10px 12px 8px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-module-platform, #f7f8fa); border-radius: 9px 9px 0 0; flex: none; }
.qbot-schedTab { flex: none; padding: 5px 14px; border: 1px solid transparent; border-radius: 999px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; cursor: pointer; }
.qbot-schedTab:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-schedTab.is-active { background: var(--dsw-alias-bg-layer-1, #fff); border-color: var(--dsw-alias-border-l2, #e5e6eb); color: var(--qbot-blue); font-weight: 600; box-shadow: 0 1px 2px rgb(31 35 41 / 6%); }
.qbot-schedAdd { margin-left: auto; padding: 4px 12px; font-size: 12px; }

/* 消息归档双栏：左月份文件 / 右记录内容 */
.qbot-modalAlert { flex: none; margin: 10px 20px 0; padding: 8px 12px; border-radius: 8px; background: var(--dsw-alias-state-error-bg, #fee9e7); color: var(--dsw-alias-state-error-primary, #d54941); font-size: 12px; font-weight: 600; }
.qbot-archSplit { flex: 1 1 auto; min-height: 140px; margin: 12px 20px 0; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; overflow: hidden; display: flex; }
.qbot-archSide { width: 176px; flex: none; overflow-y: auto; padding: 8px; border-right: 1px solid var(--dsw-alias-border-l1, #eef0f3); display: flex; flex-direction: column; gap: 4px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-archSideEmpty { padding: 10px 6px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; }
.qbot-archMonth { display: flex; align-items: center; gap: 2px; border-radius: 8px; }
.qbot-archMonth.is-active { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-archMonthBtn { flex: 1; min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 6px; padding: 6px 8px; border: 0; border-radius: 8px; background: transparent; color: inherit; font-size: 12px; cursor: pointer; text-align: left; }
.qbot-archMonthBtn:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-archMonth.is-active .qbot-archMonthBtn:hover { background: transparent; }
.qbot-archMonthName { font-family: var(--dsw-alias-font-mono, ui-monospace, monospace); font-weight: 600; }
.qbot-archMonth.is-active .qbot-archMonthName { color: var(--qbot-blue); }
.qbot-archMonthCount { color: var(--dsw-alias-label-secondary, #646a73); font-size: 11px; }
.qbot-archMonthDel { flex: none; width: 20px; height: 20px; padding: 0; border: 0; border-radius: 6px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; line-height: 1; cursor: pointer; opacity: 0; }
.qbot-archMonth:hover .qbot-archMonthDel, .qbot-archMonthDel:focus-visible { opacity: 1; }
.qbot-archMonthDel:hover { background: var(--dsw-alias-state-error-bg, #fee9e7); color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-archMain { flex: 1; min-width: 0; overflow-y: auto; padding: 10px 12px; display: flex; flex-direction: column; gap: 2px; }
.qbot-schedGroup { display: flex; flex-direction: column; gap: 6px; padding: 8px 12px 4px; }
.qbot-schedGroupTitle { display: flex; align-items: center; gap: 8px; margin: 4px 0 2px; font-size: 12px; font-weight: 600; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-schedGroupTitle[data-scope="group"] { color: var(--qbot-blue); }
.qbot-schedGroupTitle::after { content: ""; flex: 1; height: 1px; background: var(--dsw-alias-border-l1, #eef0f3); }
.qbot-schedCount { flex: none; min-width: 20px; text-align: center; padding: 0 6px; border-radius: 999px; background: var(--dsw-alias-interactive-bg-hover, #eef0f3); color: var(--dsw-alias-label-secondary, #646a73); font-size: 11px; font-weight: 600; }
/* 定时消息行：任务卡片式（类型徽标 + 内容 + 元信息 + 删除） */
.qbot-schedRow { display: flex; align-items: flex-start; gap: 12px; padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-schedMain { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.qbot-schedTop { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.qbot-chipWarn { color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-schedContent { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; line-height: 1.5; overflow-wrap: anywhere; white-space: pre-wrap; }
.qbot-schedMeta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 12px; }
.qbot-schedError { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-schedRemove { flex: none; }
/* 行内操作列：测试 / 启用禁用 / 编辑 / 删除 横向排布、可换行，紧凑对齐 */
.qbot-schedOps { display: flex; flex-direction: row; flex-wrap: wrap; gap: 6px; flex: none; align-self: center; }
.qbot-schedOps .qbot-btn { padding: 4px 12px; font-size: 12px; }
.qbot-schedTest { border-color: color-mix(in srgb, var(--qbot-business) 42%, transparent); color: var(--qbot-business); }
.qbot-schedTest:hover:not(:disabled) { background: color-mix(in srgb, var(--qbot-business) 10%, transparent); }
.qbot-schedTest:disabled { opacity: .6; cursor: default; }
/* 测试执行结果横幅（列表顶部） */
.qbot-schedNotice { margin: 8px 8px 0; padding: 8px 12px; border-radius: 8px; font-size: 12px; line-height: 1.5; border: 1px solid color-mix(in srgb, var(--qbot-business) 34%, transparent); background: color-mix(in srgb, var(--qbot-business) 8%, transparent); color: var(--qbot-business); flex: none; }
.qbot-schedNotice.is-error { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 34%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 8%, transparent); color: var(--dsw-alias-state-error-primary, #d54941); }
/* 列表卡片：悬浮反馈 + 左侧色条强化层次 */
.qbot-schedRow { position: relative; transition: border-color .15s ease, box-shadow .15s ease; }
.qbot-schedRow:hover { border-color: var(--dsw-alias-border-l2, #e5e6eb); box-shadow: 0 2px 8px rgb(31 35 41 / 6%); }
.qbot-schedEdit { padding: 4px 12px; font-size: 12px; }
.qbot-schedRemove { padding: 4px 12px; font-size: 12px; }
/* 禁用态：虚线边框 + 左侧内容降透明，让「不会再执行」一眼可辨 */
.qbot-schedRow.is-disabled { background: var(--dsw-alias-bg-layer-1, #fff); border-style: dashed; }
.qbot-schedRow.is-disabled .qbot-schedMain { opacity: .55; }
.qbot-schedRow.is-disabled .qbot-chip.is-active { border-color: var(--dsw-alias-border-l2, #e5e6eb); color: var(--dsw-alias-label-tertiary, #8f959e); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-schedRow.is-failed { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 45%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 6%, var(--dsw-alias-bg-module-platform, #f7f8fa)); }
.qbot-schedRow.is-failed .qbot-schedError { font-weight: 600; }
.qbot-chipOff { border-color: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 34%, transparent); color: var(--dsw-alias-state-warn-primary, #d97706); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 10%, transparent); }
.qbot-schedToggle { padding: 4px 12px; font-size: 12px; }
.qbot-schedToggle.is-off { border-color: color-mix(in srgb, var(--qbot-business) 32%, transparent); color: var(--qbot-business); }
/* AI 脚本生成状态条（编辑表单内） */
.qbot-schedGen { padding: 8px 12px; border-radius: 8px; font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-schedGen.is-pending { border: 1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 34%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 8%, transparent); color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-schedGen.is-done { border: 1px solid color-mix(in srgb, var(--qbot-business) 28%, transparent); background: color-mix(in srgb, var(--qbot-business) 8%, transparent); color: var(--qbot-business); }
.qbot-schedGen.is-error { border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 34%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 8%, transparent); color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-chipInfo { border-color: color-mix(in srgb, var(--qbot-business) 32%, transparent); color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 10%, transparent); }
.qbot-chipError { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 34%, transparent); color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 10%, transparent); }
.qbot-schedContent.qbot-mono, .qbot-schedCmd .qbot-textarea { font-family: var(--dsw-alias-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace); }
/* ── 定时编辑表单：三步分区（发送给谁 / 什么时候 / 做什么） ── */
.qbot-schedForm { gap: 0; }
.qbot-schedSection { padding: 14px 16px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 12px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-schedSection + .qbot-schedSection { margin-top: 12px; }
.qbot-schedSectionHead { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; padding-bottom: 10px; margin-bottom: 12px; border-bottom: 1px dashed var(--dsw-alias-border-l1, #eef0f3); }
.qbot-schedSectionTitle { font-size: 13.5px; font-weight: 650; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-schedSectionDesc { font-size: 12px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-schedSectionBody { display: flex; flex-direction: column; gap: 14px; }
.qbot-schedFieldRow { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 16px; }
.qbot-schedFieldCol { display: flex; flex-direction: column; gap: 14px; }
@media (max-width: 640px) {
  .qbot-schedFieldRow { grid-template-columns: 1fr; }
}
/* 触发条件分段按钮 */
.qbot-schedSeg { display: inline-flex; gap: 4px; padding: 3px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-segBtn { padding: 5px 14px; border: 1px solid transparent; border-radius: 8px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12.5px; cursor: pointer; transition: background .15s ease, color .15s ease; }
.qbot-segBtn:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-segBtn.is-on { background: var(--dsw-alias-bg-layer-1, #fff); border-color: var(--dsw-alias-border-l2, #e5e6eb); color: var(--qbot-business); font-weight: 600; box-shadow: 0 1px 2px rgb(31 35 41 / 6%); }
/* 星期过滤：按钮 + 快捷 + 当前结果 */
.qbot-weekdayPicker { display: flex; flex-direction: column; gap: 8px; }
.qbot-weekdayRow { display: flex; gap: 6px; }
.qbot-weekdayBtn { width: 34px; height: 32px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 8px; background: var(--dsw-alias-bg-layer-1, #fff); color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; cursor: pointer; transition: background .12s ease, color .12s ease, border-color .12s ease; }
.qbot-weekdayBtn:hover { border-color: color-mix(in srgb, var(--qbot-business) 45%, transparent); }
.qbot-weekdayBtn.is-on { background: var(--qbot-business); border-color: var(--qbot-business); color: #fff; font-weight: 600; box-shadow: 0 1px 3px rgb(31 35 41 / 12%); }
.qbot-weekdayQuick { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.qbot-weekdayHint { font-size: 12px; color: var(--dsw-alias-label-tertiary, #8f959e); }
/* 通用小按钮（快捷值 / 模板） */
.qbot-miniBtn { flex: none; padding: 3px 10px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 999px; background: var(--dsw-alias-bg-layer-1, #fff); color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; cursor: pointer; transition: background .12s ease, color .12s ease, border-color .12s ease; }
.qbot-miniBtn:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-miniBtn.is-on { border-color: color-mix(in srgb, var(--qbot-business) 40%, transparent); color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 10%, transparent); font-weight: 600; }
/* 快捷值行 */
.qbot-schedPresets { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.qbot-schedPresetLabel { font-size: 12px; color: var(--dsw-alias-label-tertiary, #8f959e); }
/* 数字输入 + 单位 */
.qbot-schedNumber { display: flex; align-items: center; gap: 8px; }
.qbot-schedNumber .qbot-input { width: 110px; }
.qbot-schedUnit { font-size: 12px; color: var(--dsw-alias-label-tertiary, #8f959e); }
/* cron 预览 */
.qbot-schedPreview { padding: 7px 12px; border: 1px solid color-mix(in srgb, var(--qbot-business) 30%, transparent); border-left: 3px solid var(--qbot-business); border-radius: 8px; background: color-mix(in srgb, var(--qbot-business) 8%, transparent); color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; }
.qbot-schedPreview.is-warn { border-color: var(--dsw-alias-state-warn-primary, #d97706); border-left-color: var(--dsw-alias-state-warn-primary, #d97706); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 10%, transparent); }
/* 时区：下拉 + 自定义输入 */
.qbot-schedTz { display: flex; flex-direction: column; gap: 6px; }
.qbot-schedTz .qbot-settingSelect { max-width: 100%; }
/* 命令编辑区 */
.qbot-schedCmd { display: flex; flex-direction: column; gap: 8px; }
.qbot-schedCmd .qbot-textarea { resize: vertical; }
/* ── 定时消息编辑表单：标签 + 控件 + 提示 三行式 ── */
.qbot-editForm { display: flex; flex-direction: column; gap: 14px; padding: 14px 16px 18px; }
/* 定时消息编辑视图：编辑表单放在无边的 modalBody 里，与带边框的列表容器区分 */
.qbot-modalBody { flex: 1 1 auto; min-height: 140px; margin: 12px 20px 0; overflow: hidden; display: flex; flex-direction: column; }
.qbot-modalBody .qbot-editForm { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: 4px 2px 10px; overscroll-behavior: contain; }
/* 群覆盖弹窗：editForm 直接作为 modalList（overflow:hidden）的子元素，内容超高时自身成为滚动层，
   否则超出部分被裁掉无法查看/编辑（弹窗高度固定 72vh，字段多时必然溢出）。 */
.qbot-modalList > .qbot-editForm { flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; }
.qbot-editGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 16px; }
.qbot-editRow { display: flex; flex-direction: column; gap: 4px; }
.qbot-editLabel { font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-editHint { font-size: 12px; line-height: 1.5; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-editActions { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-top: 2px; }
/* ── 归档时间轴：左竖线 + 节点圆点；用户蓝气泡靠左、机器人灰气泡靠右 ── */
.qbot-timeline { position: relative; display: flex; flex-direction: column; gap: 14px; padding: 6px 4px 6px 30px; }
.qbot-timeline::before { content: ""; position: absolute; left: 10px; top: 0; bottom: 0; width: 2px; border-radius: 1px; background: var(--dsw-alias-border-l2, #e5e6eb); }
.qbot-tlItem { position: relative; }
.qbot-tlDot { position: absolute; left: -25px; top: 26px; width: 10px; height: 10px; border-radius: 50%; background: var(--dsw-alias-label-tertiary, #8f959e); box-shadow: 0 0 0 3px var(--dsw-alias-bg-layer-1, #fff); }
.qbot-tlItem.is-user .qbot-tlDot { background: var(--qbot-blue); }
.qbot-tlBody { display: flex; flex-direction: column; gap: 4px; max-width: 84%; }
.qbot-tlItem.is-user .qbot-tlBody { align-items: flex-start; }
.qbot-tlItem.is-bot .qbot-tlBody { margin-left: auto; align-items: flex-end; }
.qbot-tlMeta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-tlRole { font-weight: 650; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-tlItem.is-user .qbot-tlRole { color: var(--qbot-blue); }
.qbot-tlBubble { padding: 8px 12px; border-radius: 12px; font-size: 13px; line-height: 1.55; overflow-wrap: anywhere; white-space: pre-wrap; color: var(--dsw-alias-label-primary, #1f2329); }
/* Markdown 可视化：块级元素排版（转义后的受控 HTML，非用户可写标签） */
.qbot-tlBubble.qbot-md { white-space: normal; }
.qbot-tlBubble.qbot-md > :first-child { margin-top: 0; }
.qbot-tlBubble.qbot-md > :last-child { margin-bottom: 0; }
.qbot-tlBubble.qbot-md p { margin: 4px 0; }
.qbot-tlBubble.qbot-md h3, .qbot-tlBubble.qbot-md h4, .qbot-tlBubble.qbot-md h5, .qbot-tlBubble.qbot-md h6 { margin: 8px 0 4px; font-size: 13.5px; line-height: 1.4; font-weight: 650; }
.qbot-tlBubble.qbot-md ul, .qbot-tlBubble.qbot-md ol { margin: 4px 0; padding-left: 20px; }
.qbot-tlBubble.qbot-md li { margin: 2px 0; }
.qbot-tlBubble.qbot-md blockquote { margin: 4px 0; padding: 2px 10px; border-left: 3px solid var(--dsw-alias-border-l2, #e5e6eb); color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-tlBubble.qbot-md code { padding: 1px 5px; border-radius: 5px; background: color-mix(in srgb, var(--dsw-alias-label-primary, #1f2329) 8%, transparent); font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; }
.qbot-tlBubble.qbot-md pre { margin: 6px 0; padding: 8px 10px; border-radius: 8px; background: color-mix(in srgb, var(--dsw-alias-label-primary, #1f2329) 6%, transparent); overflow-x: auto; }
.qbot-tlBubble.qbot-md pre code { padding: 0; background: transparent; font-size: 12px; line-height: 1.5; }
.qbot-tlBubble.qbot-md a { color: var(--qbot-blue); text-decoration: none; }
.qbot-tlBubble.qbot-md a:hover { text-decoration: underline; }
.qbot-tlBubble.qbot-md strong { font-weight: 650; }
.qbot-tlBubble.qbot-md del { opacity: 0.65; }
/* 用户：蓝色高亮气泡（左） */
.qbot-tlItem.is-user .qbot-tlBubble { background: color-mix(in srgb, var(--qbot-blue) 9%, var(--dsw-alias-bg-layer-1, #fff)); border: 1px solid color-mix(in srgb, var(--qbot-blue) 32%, transparent); border-top-left-radius: 4px; }
/* 机器人：中性灰气泡（右） */
.qbot-tlItem.is-bot .qbot-tlBubble { background: var(--dsw-alias-bg-module-platform, #f7f8fa); border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-top-right-radius: 4px; }
.qbot-tlNote { font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-tlSystem { position: relative; text-align: center; font-size: 12px; color: var(--dsw-alias-label-tertiary, #8f959e); padding: 2px 0; }

/* ── 开关行（dim-contextSwitchRow / dim-contextSwitch）────────────────── */
.qbot-switches { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 3px 24px; }
.qbot-switchRow { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 34px; cursor: pointer; }
.qbot-switchText { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; line-height: normal; }
.qbot-switch { appearance: none; flex: none; width: 32px; height: 19px; margin: 0; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 12px; background: var(--dsw-alias-interactive-bg-hover, #eef0f3); cursor: pointer; transition: background .16s ease, border-color .16s ease; }
.qbot-switch::before { content: ""; display: block; width: 13px; height: 13px; margin: 2px; border-radius: 50%; background: var(--dsw-alias-label-secondary, #646a73); transition: transform .16s ease, background .16s ease; }
.qbot-switch:checked { border-color: var(--qbot-business); background: var(--qbot-business); }
.qbot-switch:checked::before { transform: translateX(13px); background: #fff; }

/* ── 按钮（dim-viewActions / dim-cardActions / dim-updateButton）──────── */
.qbot-viewActions { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }
.qbot-cardActions { display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 8px; margin: 0; padding-top: 6px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-btn { min-height: 34px; display: inline-flex; align-items: center; justify-content: center; padding: 0 13px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: inherit; font-size: 13px; font-weight: 560; line-height: normal; white-space: nowrap; cursor: pointer; transition: border-color .15s ease, background .15s ease, color .15s ease; }
.qbot-btn:hover:not(:disabled) { border-color: #aeb3bb; background: var(--dsw-alias-interactive-bg-hover, #f7f8fa); }
.qbot-btn:focus-visible { outline: 2px solid color-mix(in srgb, var(--qbot-blue) 62%, white); outline-offset: 2px; }
.qbot-btn:disabled { opacity: .55; cursor: default; }
.qbot-btnPrimary, .qbot-btnPrimary:hover:not(:disabled) { border-color: var(--qbot-blue); color: #fff; background: var(--qbot-blue); }
.qbot-btnPrimary:hover:not(:disabled) { border-color: var(--qbot-blue-dark); background: var(--qbot-blue-dark); }
.qbot-btnDanger { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-btnDanger:hover:not(:disabled) { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 40%, var(--dsw-alias-border-l2, #dfe1e5)); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 7%, var(--dsw-alias-bg-layer-1, #fff)); }

/* ── KV 网格（dim-updateVersions）─────────────────────────────────────── */
.qbot-kv { display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 8px 18px; margin: 0; font-size: 12px; line-height: 18px; }
.qbot-kv > div { display: contents; }
.qbot-kv dt { color: var(--dsw-alias-label-secondary, #646a73); white-space: nowrap; }
.qbot-kv dd { min-width: 0; margin: 0; overflow-wrap: anywhere; }
.qbot-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }

/* ── 双卡并排 / 加载 ──────────────────────────────────────────────────── */
.qbot-cardPair { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 12px; align-items: start; }
.qbot-spinner { width: 24px; height: 24px; border: 3px solid var(--dsw-alias-border-l2, #e6e8eb); border-top-color: var(--qbot-blue); border-radius: 50%; animation: qbot-spin .8s linear infinite; }
@keyframes qbot-spin { to { transform: rotate(360deg); } }

/* ── 扫码倒计时（dim-countdown / dim-progress）────────────────────────── */
.qbot-qrFrame img { position: relative; z-index: 1; width: 100%; height: 100%; display: block; image-rendering: pixelated; }
.qbot-countdown { width: 100%; margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: normal; }
.qbot-countdownTop { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
.qbot-countdownTop strong { color: var(--dsw-alias-label-primary, #1f2329); font-variant-numeric: tabular-nums; }
.qbot-progress { height: 4px; overflow: hidden; margin: 0; border-radius: 99px; background: var(--dsw-alias-bg-module-platform, #eef0f3); }
.qbot-progress span { display: block; width: var(--qbot-progress, 100%); height: 100%; border-radius: 99px; background: var(--qbot-blue); transition: width 1s linear; }

/* ── 账号卡折叠头（dim-collapsibleAccount 头部 + dim-botCardTools）────── */
.qbot-accountHead { min-width: 0; display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; user-select: none; -webkit-user-select: none; }
.qbot-accountHead:hover { background: var(--dsw-alias-interactive-bg-hover, #f7f8fa); }
.qbot-accountHead:focus-visible { outline: 2px solid var(--qbot-business); outline-offset: -2px; border-radius: 14px; }
.qbot-accountTools { min-width: 0; flex: 1 1 auto; display: flex; align-items: center; justify-content: flex-end; gap: 12px; }
.qbot-healthGroup { min-width: 0; display: grid; justify-items: end; gap: 3px; }


/* ── 高级选项行（dim-contextEnhancement 行样式）───────────────────────── */
.qbot-enhanceRow { border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-enhanceRow > .qbot-collapsibleHead { padding: 10px 12px; border-radius: 9px; gap: 8px; }
.qbot-enhanceLead { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 8px; color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 10%, transparent); }
.qbot-enhanceLead svg { width: 15px; height: 15px; }
.qbot-enhanceRow .qbot-collapsibleHead strong { flex: 1 1 auto; color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; }
.qbot-enhanceChip { flex: none; padding: 2px 8px; border-radius: 999px; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-layer-1, #fff); border: 1px solid var(--dsw-alias-border-l1, #eef0f3); font-size: 11px; white-space: nowrap; }
.qbot-enhanceRow .qbot-collapsibleContent { padding: 2px 12px 12px; }

/* ── 底部操作（dim-cardFooter / dim-cardSummary）──────────────────────── */
.qbot-cardFooter { display: flex; align-items: center; justify-content: flex-end; gap: 10px; margin-top: 6px; padding-top: 12px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-cardSummary { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font: inherit; font-size: 12px; font-weight: 400; line-height: normal; overflow-wrap: anywhere; white-space: normal; }

/* ── 详情页：顶部导航 ─────────────────────────────────────────────────── */
.qbot-detailNav { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; gap: 14px; margin: -2px 0 0; padding: 8px 2px 6px; background: var(--dsw-alias-bg-layer-1, #fff); }
/* 吸顶导航条（详情页）：返回 + 机器人身份（图标/编号/启用状态/连接状态）常驻顶部 */
.qbot-detailIdentity { min-width: 0; display: flex; align-items: center; gap: 9px; }
.qbot-detailAvatar { flex: none; width: 28px; height: 28px; display: grid; place-items: center; border-radius: 9px; color: #fff; background: linear-gradient(140deg, #3d8bff, var(--qbot-blue-dark)); }
.qbot-detailAvatar svg { width: 17px; height: 17px; }
.qbot-detailIdentity > strong { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-primary, #1f2329); font-size: 15px; line-height: normal; font-weight: 700; }
/* 吸顶导航条右侧的连接状态胶囊：推到行尾，滚动时始终可见 */
.qbot-detailNavState { margin-left: auto; }

/* ── 详情页：概览横幅 ─────────────────────────────────────────────────── */
.qbot-hero { position: relative; overflow: hidden; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 3%); }
.qbot-hero::before { content: ""; position: absolute; inset: 0 0 auto; height: 3px; background: linear-gradient(90deg, var(--qbot-blue), color-mix(in srgb, var(--qbot-blue) 25%, transparent)); }
.qbot-heroMain { display: flex; align-items: center; gap: 14px; padding: 20px 20px 14px; }
.qbot-heroAvatar { flex: none; width: 52px; height: 52px; display: grid; place-items: center; border-radius: 16px; color: #fff; background: linear-gradient(140deg, #3d8bff, var(--qbot-blue-dark)); box-shadow: 0 8px 20px rgb(22 119 255 / 22%); }
.qbot-heroAvatar svg { width: 30px; height: 30px; }
.qbot-heroIdentity { min-width: 0; flex: 1 1 auto; display: flex; flex-direction: column; gap: 6px; }
.qbot-heroNameRow { min-width: 0; display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
.qbot-heroNameRow h2 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font: 700 18px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; }
.qbot-chip { flex: none; padding: 2px 9px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 999px; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f7f8fa); font-size: 11px; font-weight: 600; line-height: 17px; white-space: nowrap; }
.qbot-chip.is-active { border-color: color-mix(in srgb, var(--qbot-business) 32%, transparent); color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 10%, transparent); }
.qbot-heroMeta { display: flex; align-items: center; gap: 8px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 12px; line-height: normal; }
.qbot-metaDot { width: 3px; height: 3px; border-radius: 50%; background: currentColor; opacity: .6; }
.qbot-heroStats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; margin: 0 20px 20px; padding: 1px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-border-l1, #eef0f3); overflow: hidden; }
.qbot-heroStat { min-width: 0; display: flex; flex-direction: column; gap: 5px; padding: 11px 14px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-heroStatLabel { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; font-weight: 600; letter-spacing: .06em; }
.qbot-heroStatValue { display: flex; align-items: center; gap: 7px; color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; line-height: normal; }
.qbot-heroFoot { margin: 0 20px 18px; padding: 10px 13px; border: 1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 24%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 9px; color: var(--dsw-alias-label-secondary, #646a73); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 7%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; }

/* ── 详情页：分区卡片（第一层层次，details/summary 折叠）──────────────── */
.qbot-section { border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 3%); overflow: hidden; }
.qbot-section.is-danger { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 26%, var(--dsw-alias-border-l2, #e5e6eb)); }
.qbot-section > summary.qbot-sectionHead { cursor: pointer; list-style: none; user-select: none; }
/* 分区头部操作按钮组（如运行统计的 刷新/复位）：并排靠右 */
.qbot-sectionActions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex-wrap: wrap; }
.qbot-section > summary.qbot-sectionHead::-webkit-details-marker { display: none; }
.qbot-section:not([open]) > summary.qbot-sectionHead { border-bottom-color: transparent; }
.qbot-sectionChevron { flex: none; align-self: center; margin-left: auto; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 13px; line-height: 1; transition: transform .18s ease; }
.qbot-sectionAction + .qbot-sectionChevron { margin-left: 0; }
.qbot-section > summary.qbot-sectionHead:hover .qbot-sectionTitle h3 { color: color-mix(in srgb, var(--dsw-alias-brand-primary, #4e5969) 72%, var(--dsw-alias-label-primary, #1f2329)); }
.qbot-section[open] > summary.qbot-sectionHead .qbot-sectionChevron { transform: rotate(90deg); }
.qbot-sectionHead { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 16px 20px 13px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-sectionTitle { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.qbot-sectionTitle h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 15px; line-height: normal; font-weight: 680; }
.qbot-sectionTitle p { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.6; }
.qbot-section.is-danger .qbot-sectionTitle h3 { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-sectionAction { flex: none; display: flex; align-items: center; gap: 8px; }
.qbot-sectionBody { min-width: 0; padding: 14px 20px 18px; background: var(--dsw-alias-bg-layer-1, #fff); }

/* ── 详情页：设置行列表（第二层层次）─────────────────────────────────── */
.qbot-settingList { display: flex; flex-direction: column; gap: 8px; }
.qbot-settingRow { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; column-gap: 16px; row-gap: 8px; padding: 12px 14px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); transition: border-color .15s ease, background .15s ease; }
.qbot-settingRow:hover { border-color: var(--dsw-alias-border-l2, #dfe1e5); }
.qbot-settingCopy { min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.qbot-settingTitle { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; line-height: normal; }
.qbot-settingDesc { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.65; }
.qbot-settingControl { flex: none; display: flex; align-items: center; justify-content: flex-end; min-width: 190px; }
.qbot-settingSelect { width: 100%; min-width: 0; max-width: 260px; height: 34px; padding: 0 9px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; outline: none; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: inherit; font-size: 13px; cursor: pointer; transition: border-color .16s ease, box-shadow .16s ease; }
.qbot-settingSelect:focus { border-color: #4e5969; box-shadow: 0 0 0 3px rgb(78 89 105 / 10%); }

/* 文本输入设置行（textarea）：说明在上、输入框通栏在下，长文本不再被窄框截断 */
.qbot-settingRow.is-wide { grid-template-columns: minmax(0, 1fr); }
.qbot-settingControl.is-wide { width: 100%; min-width: 0; justify-content: stretch; }
.qbot-settingControl.is-wide > .qbot-textarea { width: 100%; }
.qbot-textarea { display: block; width: 100%; min-width: 0; min-height: 56px; max-height: 240px; padding: 8px 11px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; outline: none; resize: vertical; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: inherit; font-size: 13px; line-height: 1.6; transition: border-color .16s ease, box-shadow .16s ease; }
.qbot-textarea:focus { border-color: #4e5969; box-shadow: 0 0 0 3px rgb(78 89 105 / 10%); }
.qbot-textarea::placeholder { color: var(--dsw-alias-label-tertiary, #8f959e); font-family: inherit; }

/* ── 详情页：工作区卡片 ───────────────────────────────────────────────── */
.qbot-workspaceCard { min-width: 0; display: flex; flex-direction: column; gap: 9px; padding: 13px 14px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-workspaceCardHead { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; column-gap: 16px; row-gap: 8px; }
.qbot-workspacePath { min-width: 0; display: block; padding: 8px 11px; border: 1px dashed var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: 12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; }

/* ── 详情页：运行统计指标卡 ───────────────────────────────────────────── */
.qbot-metricGrid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.qbot-metric { min-width: 0; display: flex; flex-direction: column; gap: 5px; padding: 12px 13px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-left: 3px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-metric[data-tone="success"] { border-left-color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-metric[data-tone="warning"] { border-left-color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-metric[data-tone="error"] { border-left-color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-metricLabel { color: var(--dsw-alias-label-secondary, #646a73); font-size: 11px; line-height: normal; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.qbot-metricValue { color: var(--dsw-alias-label-primary, #1f2329); font-size: 19px; line-height: 1.2; font-weight: 700; font-variant-numeric: tabular-nums; }
.qbot-metric[data-tone="error"] .qbot-metricValue { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-metric[data-tone="warning"] .qbot-metricValue { color: var(--dsw-alias-state-warn-primary, #d97706); }

/* ── openid 可搜索下拉（归档会话候选）────────────────────────────────── */
.qbot-idPicker { position: relative; min-width: 0; }
.qbot-idPickerMenu { position: absolute; z-index: 30; top: calc(100% + 4px); left: 0; right: 0; max-height: 240px; overflow-y: auto; padding: 4px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 8px 24px rgb(31 35 41 / 12%); }
.qbot-idPickerItem { width: 100%; display: flex; flex-direction: column; gap: 2px; padding: 6px 8px; border: 0; border-radius: 8px; background: transparent; font: inherit; text-align: left; cursor: pointer; }
.qbot-idPickerItem:hover { background: var(--dsw-alias-bg-module-platform, #f2f3f5); }
.qbot-idPickerItem.is-current { background: color-mix(in srgb, var(--qbot-blue, #1677ff) 10%, transparent); }
.qbot-idPickerName { color: var(--dsw-alias-label-primary, #1f2329); font-size: 12px; font-weight: 600; line-height: 1.4; }
.qbot-idPickerId { color: var(--dsw-alias-label-tertiary, #8f959e); font: 500 11px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; word-break: break-all; }
.qbot-idPickerState { padding: 8px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 12px; line-height: 1.5; text-align: center; }

/* ── 响应式 ───────────────────────────────────────────────────────────── */
@media (max-width: 900px) {
  .qbot-metricGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 760px) {
  .qbot-emptyView { grid-template-columns: 1fr; }
  .qbot-emptyBrand { display: none; }
  .qbot-credentialForm, .qbot-grid, .qbot-switches { grid-template-columns: 1fr; }
  .qbot-heroStats { grid-template-columns: 1fr; }
  .qbot-heroMain { flex-wrap: wrap; }
  .qbot-sectionHead { flex-direction: column; align-items: stretch; }
  .qbot-settingRow, .qbot-workspaceCardHead { grid-template-columns: minmax(0, 1fr); }
  .qbot-settingControl { justify-content: flex-start; min-width: 0; }
  .qbot-settingSelect { max-width: none; }
}
@media (pointer: coarse) {
  .qbot-segTabs button, .qbot-switchRow { min-height: 44px; }
}
`;

// src/client/add-bot-view.tsx
var React3 = __toESM(require("react"), 1);
function AddBotView(props) {
  const { rpcCall, notice, setNotice, onBotReady, onBack } = props;
  const [addTab, setAddTab] = React3.useState("qr");
  const [qr, setQr] = React3.useState(null);
  const [manual, setManual] = React3.useState({ appId: "", appSecret: "" });
  const [now, setNow] = React3.useState(Date.now());
  const pollRef = React3.useRef(null);
  React3.useEffect(() => {
    if (qr?.status !== "pending") return void 0;
    const timer = setInterval(() => setNow(Date.now()), 1e3);
    return () => clearInterval(timer);
  }, [qr?.status, qr?.expiresAt]);
  React3.useEffect(() => () => {
    if (pollRef.current) clearInterval(pollRef.current);
  }, []);
  const startQr = async () => {
    setNotice("");
    const res = await rpcCall("qr.start");
    const snap = res.ok ? val(res) : { status: "failure", error: errText(res.error) };
    setQr(snap);
    if (snap.status === "pending" || snap.status === "success") {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(async () => {
        const state = await rpcCall("qr.state");
        const current = state.ok ? val(state) : { status: "failure" };
        setQr(current);
        if (current.status === "success" || current.status === "failure" || current.status === "idle") {
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = null;
          if (current.status === "success") {
            setNotice(`扫码成功，AppID ${current.appId} 已启用`);
            await onBotReady(current.appId ?? "");
          }
        }
      }, 2e3);
    }
  };
  const cancelQr = async () => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
    const res = await rpcCall("qr.cancel");
    setQr(res.ok ? val(res) : null);
  };
  const saveManual = async () => {
    setNotice("");
    const res = await rpcCall("credentials.save", manual);
    if (res.ok) {
      const appId = val(res)?.appId || manual.appId;
      setManual({ appId: "", appSecret: "" });
      setNotice(`凭据已保存，AppID ${appId} 已启用`);
      await onBotReady(appId);
    } else {
      setNotice(`保存失败：${errText(res.error)}`);
    }
  };
  const QR_DURATION_MS = 5 * 6e4;
  const qrRemaining = qr?.status === "pending" && qr?.expiresAt ? Math.max(0, qr.expiresAt - now) : 0;
  const qrProgress = Math.round(Math.min(1, qrRemaining / QR_DURATION_MS) * 100);
  const qrPending = qr?.status === "pending";
  const qrRefreshing = qrPending && !qr?.qrCodeDataUrl;
  const guideBlock = (title, steps) => h(
    "div",
    { className: "qbot-guideBlock" },
    h("span", { className: "qbot-guideTitle" }, title),
    h(
      "ol",
      { className: "qbot-steps is-rich" },
      steps.map((s) => h(
        "li",
        { key: s.title },
        h("strong", null, s.title),
        h("span", null, s.desc)
      ))
    )
  );
  const noteList = (notes) => h(
    "div",
    { className: "qbot-noteList" },
    h("span", { className: "qbot-noteTitle" }, "说明"),
    h("ul", null, notes.map((n, i) => h("li", { key: i }, n)))
  );
  const qrStatusText = qr?.status === "success" ? "绑定成功" : qr?.status === "failure" ? "扫码失败" : qrRefreshing ? "正在刷新二维码" : qrPending ? "等待手机 QQ 扫码" : "二维码未生成";
  const qrStatusTone = qr?.status === "success" ? "success" : qr?.status === "failure" ? "error" : qrPending ? "warning" : "neutral";
  const qrPane = h(
    "section",
    { className: "qbot-surfaceCard" },
    h(
      "div",
      { className: "qbot-surfaceBody qbot-qrLayout" },
      h(
        "div",
        { className: "qbot-qrColumn" },
        h(
          "div",
          { className: "qbot-qrFrame" },
          qr?.qrCodeDataUrl ? h("img", { src: qr.qrCodeDataUrl, alt: "用于绑定 QQ 机器人的一次性二维码" }) : h(
            "div",
            { className: "qbot-qrPlaceholder" },
            h("span", { className: "qbot-qrPlaceholderIcon", "aria-hidden": "true" }, h(QqLogoGlyph)),
            h("strong", null, qrRefreshing ? "正在刷新二维码…" : "还没有生成二维码"),
            h(
              "span",
              { className: "qbot-qrPlaceholderHint" },
              qrRefreshing ? "几秒后会自动出现新的一张" : "点击下方「生成二维码」开始"
            )
          )
        ),
        h(
          "div",
          { className: "qbot-countdown" },
          h(
            "div",
            { className: "qbot-countdownTop" },
            h("span", null, "二维码有效时间"),
            h("strong", null, qrPending && qr?.qrCodeDataUrl ? formatRemaining(qrRemaining) : "--:--")
          ),
          h("div", { className: "qbot-progress", style: { "--qbot-progress": `${qrProgress}%` } }, h("span"))
        ),
        h(
          "div",
          { className: "qbot-qrActions" },
          h(
            "button",
            { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: startQr },
            qrPending ? "重新生成二维码" : "生成二维码"
          ),
          qrPending ? h("button", { className: "qbot-btn", type: "button", onClick: cancelQr }, "取消扫码") : null
        )
      ),
      h(
        "div",
        { className: "qbot-qrCopy" },
        StateLabel({ tone: qrStatusTone, text: qrStatusText }),
        h("h3", null, "手机 QQ 扫码接入"),
        h(
          "p",
          { className: "qbot-qrLead" },
          "推荐方式。扫码后 QQ 会把机器人的 AppID 与 AppSecret 直接下发给本机 dsh，不需要手动复制，保存后立即生效。"
        ),
        guideBlock("操作步骤", [
          { title: "生成二维码", desc: "点击二维码下方的「生成二维码」，出现二维码后开始 5 分钟倒计时。" },
          { title: "手机 QQ 扫一扫", desc: "打开手机 QQ，从右上角「＋」菜单进入「扫一扫」，扫描这张二维码。" },
          { title: "在 QQ 里确认绑定", desc: "按 QQ 页面提示完成确认，把这个机器人授权给本机 dsh 使用。" },
          { title: "等待自动跳转", desc: "本页每 2 秒检查一次结果，绑定成功后会自动进入机器人详情页。" }
        ]),
        qr?.status === "failure" ? h("p", { className: "qbot-qrError" }, qr.error ?? "扫码失败") : null,
        noteList([
          "二维码 5 分钟内有效；过期后会自动换一张新的，不需要手动刷新页面。",
          "扫码期间请保持本设置页打开，关闭页面会中断等待。",
          "凭据会写入 ~/.dsh/qqbot/credentials.json（仅当前用户可读），写入后立即生效，不需要重启 dsh。"
        ])
      )
    )
  );
  const manualPane = h(
    "section",
    { className: "qbot-surfaceCard" },
    h(
      "div",
      { className: "qbot-surfaceBody qbot-manualPanel" },
      h(
        "div",
        { className: "qbot-copyHead" },
        h("h3", null, "手动填写 AppID / AppSecret"),
        h("p", null, "适合已经在 QQ 开放平台创建过机器人的情况：先从开放平台把凭据复制出来，再回到这里填写保存。")
      ),
      guideBlock("第 1 步 · 在 QQ 开放平台取得凭据", [
        { title: "打开 QQ 开放平台", desc: "浏览器访问 q.qq.com，用 QQ 登录。" },
        { title: "选择机器人", desc: "在机器人列表里点开要接入的机器人；还没有的话先创建一个。" },
        { title: "复制 AppID 与 AppSecret", desc: "进入该机器人的「开发设置」页面，复制 AppID（机器人 ID）与 AppSecret（机器人密钥）。" }
      ]),
      h(
        "div",
        { className: "qbot-guideBlock" },
        h("span", { className: "qbot-guideTitle" }, "第 2 步 · 填到这里并保存"),
        h(
          "div",
          { className: "qbot-credentialForm" },
          Field(
            { label: "AppID" },
            TextInput({
              value: manual.appId,
              placeholder: "机器人 ID",
              onChange: (e) => setManual({ ...manual, appId: e.target.value })
            })
          ),
          Field(
            { label: "AppSecret" },
            TextInput({
              type: "password",
              value: manual.appSecret,
              placeholder: "开发设置里的机器人密钥",
              onChange: (e) => setManual({ ...manual, appSecret: e.target.value })
            })
          )
        ),
        h(
          "div",
          { className: "qbot-credentialActions" },
          h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: saveManual }, "保存并启用")
        )
      ),
      noteList([
        "保存后凭据写入 ~/.dsh/qqbot/credentials.json（权限 0600），立即生效，并自动设为当前使用的机器人。",
        "这里不会校验凭据是否正确。保存后请到机器人详情看「连接状态」：显示「运行正常」才是接通；未就绪就点「重试连接」。",
        "消息接收走 WebSocket 长连接，开放平台不需要填回调地址；但机器人回复要走 OpenAPI，需要把本机出口 IP 加进开放平台的 IP 白名单。",
        "AppSecret 保存后不再回显；需要更换时重新填一次保存即可覆盖。"
      ])
    )
  );
  const addView = h(
    "div",
    { className: "qbot-channelPage qbot-addView" },
    notice ? h("div", { className: "qbot-infoNotice" }, notice) : null,
    h(
      "div",
      { className: "qbot-addNav" },
      h("button", { className: "qbot-btn", type: "button", onClick: onBack }, "← 返回列表")
    ),
    h(
      "header",
      { className: "qbot-addHead" },
      h("h2", null, "添加机器人"),
      h(
        "p",
        null,
        "两种方式任选其一：扫码由 QQ 自动下发凭据；手动填写需要你先去 QQ 开放平台复制 AppID / AppSecret。接入成功后凭据立即生效，并自动成为当前使用的机器人。"
      )
    ),
    h(
      "div",
      { className: "qbot-segTabs", role: "tablist" },
      h("button", {
        type: "button",
        role: "tab",
        "aria-selected": addTab === "qr",
        onClick: () => setAddTab("qr")
      }, "扫码接入"),
      h("button", {
        type: "button",
        role: "tab",
        "aria-selected": addTab === "manual",
        onClick: () => setAddTab("manual")
      }, "手动填写")
    ),
    addTab === "qr" ? qrPane : manualPane
  );
  return addView;
}

// src/client/dialogs/archive-dialog.tsx
var React4 = __toESM(require("react"), 1);

// src/client/md.ts
var escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
function inline(text) {
  let out = text;
  const codes = [];
  out = out.replace(/`([^`\n]+)`/g, (_m, c) => {
    codes.push(c);
    return `\0${codes.length - 1}\0`;
  });
  out = out.replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, label, url) => `<a href="${url}" target="_blank" rel="noreferrer noopener">${label}</a>`);
  out = out.replace(/\*\*([^*\n][^*\n]*?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  out = out.replace(/~~([^~\n]+)~~/g, "<del>$1</del>");
  out = out.replace(/\u0000(\d+)\u0000/g, (_m, i) => `<code>${codes[Number(i)]}</code>`);
  return out;
}
function para(lines) {
  return `<p>${lines.map(inline).join("<br>")}</p>`;
}
function renderMarkdown(src) {
  const rawLines = String(src ?? "").replace(/\r\n?/g, "\n").split("\n");
  const out = [];
  let i = 0;
  while (i < rawLines.length) {
    const line = rawLines[i];
    const trimmed = line.trim();
    if (/^```/.test(trimmed)) {
      const body = [];
      i += 1;
      while (i < rawLines.length && !/^```/.test(rawLines[i].trim())) {
        body.push(rawLines[i]);
        i += 1;
      }
      i += 1;
      out.push(`<pre><code>${escapeHtml(body.join("\n"))}</code></pre>`);
      continue;
    }
    if (!trimmed) {
      i += 1;
      continue;
    }
    const heading = /^(#{1,6})\s+(.+)$/.exec(trimmed);
    if (heading) {
      const level = Math.min(heading[1].length + 2, 6);
      out.push(`<h${level}>${inline(escapeHtml(heading[2]))}</h${level}>`);
      i += 1;
      continue;
    }
    if (/^&gt;|^>/.test(trimmed)) {
      const body = [];
      while (i < rawLines.length && /^\s*&gt;?\s?|^\s*>\s?/.test(rawLines[i]) && rawLines[i].trim()) {
        body.push(rawLines[i].replace(/^\s*&gt;\s?|^\s*>\s?/, ""));
        i += 1;
      }
      out.push(`<blockquote>${para(body)}</blockquote>`);
      continue;
    }
    const bullet = /^[-*]\s+(.+)$/;
    const ordered = /^\d+[.)]\s+(.+)$/;
    if (bullet.test(trimmed) || ordered.test(trimmed)) {
      const isOrdered = ordered.test(trimmed);
      const items = [];
      while (i < rawLines.length) {
        const cur = rawLines[i].trim();
        const m = isOrdered ? ordered.exec(cur) : bullet.exec(cur);
        if (!m) break;
        items.push(`<li>${inline(escapeHtml(m[1]))}</li>`);
        i += 1;
      }
      out.push(isOrdered ? `<ol>${items.join("")}</ol>` : `<ul>${items.join("")}</ul>`);
      continue;
    }
    const paraLines = [];
    while (i < rawLines.length) {
      const cur = rawLines[i];
      const t = cur.trim();
      if (!t || /^```/.test(t) || /^(#{1,6})\s/.test(t) || /^[-*]\s/.test(t) || /^\d+[.)]\s/.test(t) || /^>\s?/.test(t)) break;
      paraLines.push(escapeHtml(cur));
      i += 1;
    }
    if (paraLines.length) out.push(para(paraLines));
  }
  return out.join("");
}
function looksLikeMarkdown(src) {
  return /```|^#{1,6}\s|\*\*[^*\n]+\*\*|~~[^~\n]+~~|\[[^\]\n]+\]\(https?:\/\/|^\s*[-*]\s+\S|^\s*\d+[.)]\s+\S/m.test(String(src ?? ""));
}

// src/client/dialogs/archive-dialog.tsx
function ArchiveDialog(props) {
  const { rpcCall, detailAppId, onClose } = props;
  const [archiveModal, setArchiveModal] = React4.useState({
    loading: true,
    error: "",
    records: [],
    moreAvailable: false,
    daysRead: 0,
    days: [],
    activeDay: ""
  });
  const loadArchiveRecords = async (day) => {
    if (!day) {
      setArchiveModal((prev) => prev ? { ...prev, loading: false, activeDay: "", records: [], moreAvailable: false, daysRead: 0 } : prev);
      return;
    }
    setArchiveModal((prev) => prev ? { ...prev, loading: true, activeDay: day, error: "" } : prev);
    const res = await rpcCall("archive.list", { day, ...detailAppId ? { appId: detailAppId } : {}, limit: 120 });
    if (res.ok) {
      const v = val(res) ?? {};
      setArchiveModal((prev) => prev ? {
        ...prev,
        loading: false,
        error: "",
        records: Array.isArray(v.records) ? v.records : [],
        moreAvailable: Boolean(v.moreAvailable),
        daysRead: Number(v.daysRead ?? 0)
      } : prev);
    } else {
      setArchiveModal((prev) => prev ? { ...prev, loading: false, error: errText(res.error) } : prev);
    }
  };
  const loadArchiveDays = async (prefer = "") => {
    setArchiveModal((prev) => prev ? { ...prev, loading: true, error: "" } : prev);
    const res = await rpcCall("archive.days", detailAppId ? { appId: detailAppId } : {});
    if (!res.ok) {
      setArchiveModal((prev) => prev ? { ...prev, loading: false, error: errText(res.error) } : prev);
      return;
    }
    const v = val(res) ?? {};
    const days = Array.isArray(v.days) ? v.days.map((d) => ({ day: String(d.day ?? ""), count: Number(d.count ?? 0) })) : [];
    const next = days.some((d) => d.day === prefer) ? prefer : days[0]?.day ?? "";
    setArchiveModal((prev) => prev ? { ...prev, days } : prev);
    await loadArchiveRecords(next);
  };
  const removeArchiveDayFile = async (day) => {
    if (!await confirmDlg({ message: localizeText(`确定删除 ${day} 的归档记录？此机器人该天的记录将被清除，其他机器人的记录保留。`), danger: true })) return;
    const res = await rpcCall("archive.removeDay", { day, ...detailAppId ? { appId: detailAppId } : {} });
    if (!res.ok) {
      setArchiveModal((prev) => prev ? { ...prev, error: errText(res.error) } : prev);
      return;
    }
    const v = val(res) ?? {};
    const days = Array.isArray(v.days) ? v.days.map((d) => ({ day: String(d.day ?? ""), count: Number(d.count ?? 0) })) : [];
    const next = days.some((d) => d.day === day) ? day : days[0]?.day ?? "";
    setArchiveModal((prev) => prev ? { ...prev, days } : prev);
    await loadArchiveRecords(next);
  };
  React4.useEffect(() => {
    void loadArchiveDays("");
  }, []);
  return h(
    "div",
    { className: "qbot-modalOverlay" },
    h(
      "div",
      { className: "qbot-modal qbot-modalWide", role: "dialog", "aria-modal": "true", "aria-label": "消息归档" },
      h(
        "div",
        { className: "qbot-modalHead" },
        h(
          "div",
          null,
          h("strong", null, "消息归档"),
          h("p", null, "本地落盘的收发记录（按当前机器人过滤）：左栏选日期查看内容，× 删除该天归档")
        ),
        h("button", { className: "qbot-modalClose", type: "button", "aria-label": "关闭", onClick: onClose }, "×")
      ),
      // 报错固定条：常驻弹窗头部下方（读取/删除失败时不随内容滚动）。
      archiveModal.error ? h("div", { className: "qbot-modalAlert", role: "alert" }, archiveModal.error) : null,
      h(
        "div",
        { className: `qbot-archSplit${archiveModal.loading && archiveModal.records.length > 0 ? " is-refreshing" : ""}` },
        // 左栏：归档日期文件（点击切换内容，× 删除该天归档）
        h(
          "div",
          { className: "qbot-archSide", "aria-label": "归档日期文件" },
          archiveModal.days.length === 0 && !archiveModal.loading ? h("div", { className: "qbot-archSideEmpty" }, "暂无归档文件") : archiveModal.days.map((d) => {
            const active = d.day === archiveModal.activeDay;
            return h(
              "div",
              { key: d.day, className: `qbot-archMonth${active ? " is-active" : ""}` },
              h(
                "button",
                {
                  type: "button",
                  className: "qbot-archMonthBtn",
                  onClick: () => void loadArchiveRecords(d.day),
                  title: `${d.count} 条记录`
                },
                h("span", { className: "qbot-archMonthName" }, d.day),
                h("span", { className: "qbot-archMonthCount" }, `${d.count}`)
              ),
              h("button", {
                type: "button",
                className: "qbot-archMonthDel",
                "aria-label": `删除 ${d.day} 归档`,
                title: "删除该天归档（仅此机器人的记录）",
                onClick: () => void removeArchiveDayFile(d.day)
              }, "×")
            );
          })
        ),
        // 右栏：选中日期的记录内容
        h(
          "div",
          { className: "qbot-archMain" },
          archiveModal.loading && archiveModal.records.length === 0 ? h("div", { className: "qbot-modalState" }, h("span", { className: "qbot-spinner", "aria-hidden": "true" }), "正在读取归档…") : archiveModal.records.length === 0 ? h("div", { className: "qbot-modalState" }, "该天没有记录。开启「消息本地归档」并收到消息后，这里会出现记录。") : h(
            "div",
            { className: "qbot-timeline" },
            archiveModal.records.map((r, i) => {
              const key = `${r.ts ?? ""}-${i}`;
              if (r.kind === "session") {
                return h(
                  "div",
                  { key, className: "qbot-tlSystem" },
                  `会话 ${formatTime(r.ts)}${r.content ? ` · ${String(r.content)}` : ""}${r.note ? ` · ${String(r.note)}` : ""}`
                );
              }
              const isUser = r.kind === "inbound";
              const content = String(r.content ?? "");
              const useMd = !isUser || looksLikeMarkdown(content);
              return h(
                "div",
                { key, className: `qbot-tlItem ${isUser ? "is-user" : "is-bot"}` },
                h("span", { className: "qbot-tlDot", "aria-hidden": "true" }),
                h(
                  "div",
                  { className: "qbot-tlBody" },
                  h(
                    "div",
                    { className: "qbot-tlMeta" },
                    h("span", { className: "qbot-tlRole" }, isUser ? "用户" : "机器人"),
                    r.senderName || r.sender ? h("span", { className: "qbot-mono" }, String(r.senderName || r.sender)) : null,
                    h("span", { className: "qbot-mono" }, String(r.chat ?? "—")),
                    h("span", null, formatTime(r.ts))
                  ),
                  useMd ? h("div", {
                    className: "qbot-tlBubble qbot-md",
                    // renderMarkdown 内部先整体 HTML 转义再叠加受控标签，URL 仅放行 http/https。
                    dangerouslySetInnerHTML: { __html: renderMarkdown(content) }
                  }) : h("div", { className: "qbot-tlBubble" }, content),
                  r.note ? h("div", { className: "qbot-tlNote" }, String(r.note)) : null
                )
              );
            })
          )
        )
      ),
      h(
        "div",
        { className: "qbot-modalFoot" },
        h(
          "span",
          { className: "qbot-hint" },
          archiveModal.moreAvailable ? `已显示最近 ${archiveModal.records.length} 条（更早记录仍在归档文件里）` : `共 ${archiveModal.records.length} 条记录`
        ),
        h(
          "div",
          { className: "qbot-viewActions" },
          h("button", { className: "qbot-btn", type: "button", disabled: archiveModal.loading, onClick: () => void loadArchiveDays(archiveModal.activeDay) }, "刷新"),
          h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: onClose }, "关闭")
        )
      )
    )
  );
}

// src/client/dialogs/override-dialog.tsx
var React6 = __toESM(require("react"), 1);

// src/client/id-picker.tsx
var React5 = __toESM(require("react"), 1);
function useArchiveChats(rpcCall, appId) {
  const [chats, setChats] = React5.useState([]);
  const [loading, setLoading] = React5.useState(true);
  const [error, setError] = React5.useState("");
  const reload = React5.useCallback(async () => {
    setLoading(true);
    const res = await rpcCall("archive.chats", appId ? { appId } : {});
    if (res.ok) {
      const v = val(res) ?? {};
      setChats(Array.isArray(v.chats) ? v.chats.filter((c) => c && typeof c.openid === "string") : []);
      setError("");
    } else {
      setChats([]);
      setError(errText(res.error));
    }
    setLoading(false);
  }, [rpcCall, appId]);
  React5.useEffect(() => {
    void reload();
  }, [reload]);
  return { chats, loading, error, reload };
}
var MAX_RENDER = 50;
function OpenIdPicker(props) {
  const { chats, scope, value, onChange, readOnly, loading, error, placeholder, ariaLabel } = props;
  const [open, setOpen] = React5.useState(false);
  const pool = React5.useMemo(() => chats.filter((c) => c.scope === scope), [chats, scope]);
  const q = value.trim().toLowerCase();
  const list = q ? pool.filter(
    (c) => c.openid.toLowerCase().includes(q) || (c.name || "").toLowerCase().includes(q) || (c.lastSenderName || "").toLowerCase().includes(q)
  ) : pool;
  const shown = list.slice(0, MAX_RENDER);
  const itemTitle = (c) => scope === "c2c" ? c.name || "用户" : c.lastSenderName ? `群聊 · 最近发言成员：${c.lastSenderName}` : "群聊";
  const idPrefix = scope === "group" ? "群 id：" : "用户 id：";
  return h(
    "div",
    { className: "qbot-idPicker", "data-open": open ? "true" : void 0 },
    h("input", {
      className: "qbot-input qbot-mono",
      value,
      readOnly: Boolean(readOnly),
      placeholder: placeholder ?? "群或用户的 openid",
      autoComplete: "off",
      onFocus: () => setOpen(true),
      onBlur: () => setOpen(false),
      onKeyDown: (ev) => {
        if (ev.key === "Escape") setOpen(false);
      },
      onChange: (ev) => {
        setOpen(true);
        onChange(ev.target.value);
      },
      "aria-label": ariaLabel ?? "接收方 openid"
    }),
    open && !readOnly ? h(
      "div",
      { className: "qbot-idPickerMenu", role: "listbox", "aria-label": "归档会话候选" },
      loading ? h("div", { className: "qbot-idPickerState" }, "正在读取归档会话…") : error ? h("div", { className: "qbot-idPickerState" }, `归档读取失败：${error}（可直接粘贴 openid）`) : shown.length === 0 ? h(
        "div",
        { className: "qbot-idPickerState" },
        pool.length === 0 ? "归档里还没有该类型的会话记录，可直接粘贴 openid" : "没有匹配的候选，可直接粘贴 openid"
      ) : [
        ...shown.map(
          (c) => h(
            "button",
            {
              key: `${c.scope}:${c.openid}`,
              type: "button",
              role: "option",
              "aria-selected": c.openid === value,
              className: `qbot-idPickerItem${c.openid === value ? " is-current" : ""}`,
              // 阻止 mousedown 默认行为保住输入框焦点，避免 blur 先于 click 关闭菜单。
              onMouseDown: (ev) => ev.preventDefault(),
              onClick: () => {
                onChange(c.openid);
                setOpen(false);
              }
            },
            h("span", { className: "qbot-idPickerName" }, itemTitle(c)),
            h("span", { className: "qbot-idPickerId" }, `${idPrefix}${c.openid}`)
          )
        ),
        list.length > shown.length ? h("div", { className: "qbot-idPickerState" }, `共 ${list.length} 个候选，输入关键词继续过滤`) : null
      ]
    ) : null
  );
}

// src/client/dialogs/override-dialog.tsx
function buildDraft(overrides, openid) {
  const ov = openid ? overrides[openid] ?? {} : {};
  const tri = (v) => v === void 0 || v === null ? "" : v ? "on" : "off";
  const num = (v) => v === void 0 || v === null ? "" : String(v);
  return {
    openid,
    groupFullReply: tri(ov.groupFullReply),
    valueThreshold: num(ov.valueThreshold),
    atContextMessages: num(ov.atContextMessages),
    groupCooldownMs: num(ov.groupCooldownMs),
    senderCooldownMs: num(ov.senderCooldownMs),
    markdownReply: tri(ov.markdownReply),
    memoryEnabled: tri(ov.memoryEnabled),
    replyChunkChars: num(ov.replyChunkChars),
    maxRepliesPerMessage: num(ov.maxRepliesPerMessage),
    agentPresetChat: typeof ov.agentPresetChat === "string" ? ov.agentPresetChat : "",
    bannedWords: Array.isArray(ov.bannedWords) ? ov.bannedWords.join(", ") : ""
  };
}
function OverrideDialog(props) {
  const { overrides, editOpenid, rpcCall, appId, onClose, onSave } = props;
  const [draft, setDraft] = React6.useState(() => buildDraft(overrides, editOpenid));
  const [error, setError] = React6.useState("");
  const [saving, setSaving] = React6.useState(false);
  const archiveChats = useArchiveChats(rpcCall, appId);
  const setOverrideField = (key, value) => {
    setError("");
    setDraft((prev) => ({ ...prev, [key]: value }));
  };
  const saveOverride = async () => {
    const d = draft;
    const openid = d.openid.trim();
    if (!openid) {
      setError("请填写群 openid");
      return;
    }
    const ov = {};
    if (d.groupFullReply) ov.groupFullReply = d.groupFullReply === "on";
    if (d.valueThreshold !== "") ov.valueThreshold = Number(d.valueThreshold);
    if (d.atContextMessages !== "") ov.atContextMessages = Number(d.atContextMessages);
    if (d.groupCooldownMs !== "") ov.groupCooldownMs = Number(d.groupCooldownMs);
    if (d.senderCooldownMs !== "") ov.senderCooldownMs = Number(d.senderCooldownMs);
    if (d.markdownReply) ov.markdownReply = d.markdownReply === "on";
    if (d.memoryEnabled) ov.memoryEnabled = d.memoryEnabled === "on";
    if (d.replyChunkChars !== "") ov.replyChunkChars = Number(d.replyChunkChars);
    if (d.maxRepliesPerMessage !== "") ov.maxRepliesPerMessage = Number(d.maxRepliesPerMessage);
    if (d.agentPresetChat.trim()) ov.agentPresetChat = d.agentPresetChat.trim();
    if (d.bannedWords.trim()) {
      ov.bannedWords = d.bannedWords.split(/[,，]/).map((w) => w.trim()).filter(Boolean);
    }
    const next = { ...overrides };
    if (Object.keys(ov).length === 0) {
      if (!editOpenid) {
        setError("请至少设置一个覆盖字段：全部「跟随默认」等同于不添加该群覆盖。");
        return;
      }
      delete next[openid];
    } else {
      next[openid] = ov;
    }
    setSaving(true);
    try {
      const r = await onSave(next, openid);
      if (r && r.ok === false) {
        setError(r.error || "保存失败，请稍后重试");
        return;
      }
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };
  return h(
    "div",
    { className: "qbot-modalOverlay" },
    h(
      "div",
      { className: "qbot-modal qbot-modalWide", role: "dialog", "aria-modal": "true", "aria-label": "按群配置" },
      h(
        "div",
        { className: "qbot-modalHead" },
        h(
          "div",
          null,
          h("strong", null, editOpenid ? "编辑群覆盖" : "添加群覆盖"),
          h("p", null, "留空/选择「跟随默认」的字段继续使用机器人级配置，仅此群生效")
        ),
        h("button", { className: "qbot-modalClose", type: "button", "aria-label": "关闭", onClick: onClose }, "×")
      ),
      h(
        "div",
        { className: "qbot-modalList" },
        h(
          "div",
          { className: "qbot-editForm" },
          editRow(
            "群 openid",
            "要单独配置的群 openid（o 开头的长串）。点击输入框可从消息归档下拉选择，候选标注「群 id」；也可直接粘贴。",
            h(OpenIdPicker, {
              chats: archiveChats.chats,
              scope: "group",
              value: String(draft.openid ?? ""),
              readOnly: Boolean(editOpenid),
              loading: archiveChats.loading,
              error: archiveChats.error,
              placeholder: "群 openid",
              onChange: (v) => setOverrideField("openid", v),
              ariaLabel: "群 openid"
            })
          ),
          editRow(
            "群全量回复",
            "该群非 @ 消息是否参与价值评分并回复。",
            h(
              "select",
              {
                className: "qbot-settingSelect",
                value: String(draft.groupFullReply),
                onChange: (ev) => setOverrideField("groupFullReply", ev.target.value),
                "aria-label": "群全量回复"
              },
              h("option", { value: "" }, "跟随默认"),
              h("option", { value: "on" }, "启用"),
              h("option", { value: "off" }, "停用")
            )
          ),
          editRow(
            "价值阈值",
            "仅群全量回复开启时有效：0-10 分，达到阈值才回复。",
            h(
              "select",
              {
                className: "qbot-settingSelect",
                value: String(draft.valueThreshold),
                onChange: (ev) => setOverrideField("valueThreshold", ev.target.value),
                "aria-label": "价值阈值"
              },
              h("option", { value: "" }, "跟随默认"),
              [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => h("option", { key: n, value: String(n) }, `${n} 分`))
            )
          ),
          editRow(
            "@ 上下文条数",
            "@ 机器人时附带的本群最近消息条数。",
            h(
              "select",
              {
                className: "qbot-settingSelect",
                value: String(draft.atContextMessages),
                onChange: (ev) => setOverrideField("atContextMessages", ev.target.value),
                "aria-label": "@ 上下文条数"
              },
              h("option", { value: "" }, "跟随默认"),
              [0, 2, 4, 6, 8, 10, 15, 20, 30, 50].map((n) => h("option", { key: n, value: String(n) }, n === 0 ? "0（关闭）" : `${n} 条`))
            )
          ),
          editRow(
            "同群冷却",
            "该群两次全量回复的最小间隔（@ 回复不受限）。",
            h(
              "select",
              {
                className: "qbot-settingSelect",
                value: String(draft.groupCooldownMs),
                onChange: (ev) => setOverrideField("groupCooldownMs", ev.target.value),
                "aria-label": "同群冷却"
              },
              h("option", { value: "" }, "跟随默认"),
              COOLDOWN_OPTIONS.map((n) => h("option", { key: n, value: String(n) }, cooldownLabel(n)))
            )
          ),
          editRow(
            "同人冷却",
            "同一人在该群两次被回复的最小间隔。",
            h(
              "select",
              {
                className: "qbot-settingSelect",
                value: String(draft.senderCooldownMs),
                onChange: (ev) => setOverrideField("senderCooldownMs", ev.target.value),
                "aria-label": "同人冷却"
              },
              h("option", { value: "" }, "跟随默认"),
              COOLDOWN_OPTIONS.map((n) => h("option", { key: n, value: String(n) }, cooldownLabel(n)))
            )
          ),
          editRow(
            "分片长度",
            "单条回复的最大字符数，超过会拆成多条发送。",
            h(
              "select",
              {
                className: "qbot-settingSelect",
                value: String(draft.replyChunkChars),
                onChange: (ev) => setOverrideField("replyChunkChars", ev.target.value),
                "aria-label": "分片长度"
              },
              h("option", { value: "" }, "跟随默认"),
              [200, 300, 500, 800, 1e3, 1500, 2e3, 3e3, 4e3].map((n) => h("option", { key: n, value: String(n) }, `${n}`))
            )
          ),
          editRow(
            "每条消息回复上限",
            "该群每条用户消息最多被动回复几条（平台上限 5）。",
            h(
              "select",
              {
                className: "qbot-settingSelect",
                value: String(draft.maxRepliesPerMessage),
                onChange: (ev) => setOverrideField("maxRepliesPerMessage", ev.target.value),
                "aria-label": "每条消息回复上限"
              },
              h("option", { value: "" }, "跟随默认"),
              [1, 2, 3, 4, 5].map((n) => h("option", { key: n, value: String(n) }, `${n} 条`))
            )
          ),
          editRow(
            "Markdown 回复",
            "该群回复是否优先使用 QQ Markdown。",
            h(
              "select",
              {
                className: "qbot-settingSelect",
                value: String(draft.markdownReply),
                onChange: (ev) => setOverrideField("markdownReply", ev.target.value),
                "aria-label": "Markdown 回复"
              },
              h("option", { value: "" }, "跟随默认"),
              h("option", { value: "on" }, "启用"),
              h("option", { value: "off" }, "停用")
            )
          ),
          // 长期记忆（memoryEnabled）与聊天 Preset（agentPresetChat）已从界面移除
          //（默认常开/留空跟随 Agent Preset，仅 bots.json 可配）；
          // 草稿仍读取/回写这两个字段，避免保存时丢掉配置文件里已设置的值。
          editRow(
            "敏感词列表",
            "仅该群生效的敏感词（逗号分隔），命中即撤回并跳过回复；与机器人级敏感词叠加。",
            TextArea({
              rows: 2,
              value: String(draft.bannedWords ?? ""),
              placeholder: "词1, 词2（留空跟随默认）",
              onChange: (ev) => setOverrideField("bannedWords", ev.target.value),
              "aria-label": "敏感词列表"
            })
          )
        )
      ),
      h(
        "div",
        { className: "qbot-modalFoot" },
        error ? h("p", { className: "qbot-footError", role: "alert" }, error) : h("span", { className: "qbot-hint" }, "保存后立即生效，无需重启"),
        h(
          "div",
          { className: "qbot-viewActions" },
          h("button", { className: "qbot-btn", type: "button", disabled: saving, onClick: onClose }, "取消"),
          h("button", {
            className: "qbot-btn qbot-btnPrimary",
            type: "button",
            disabled: saving,
            onClick: () => void saveOverride()
          }, saving ? "保存中…" : "保存")
        )
      )
    )
  );
}

// src/client/dialogs/schedule-dialog.tsx
var React7 = __toESM(require("react"), 1);

// src/shared/cron.ts
var MONTH_NAMES = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12
};
var DOW_NAMES = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6
};
function tzOffsetMs(epochMs, tz) {
  try {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    const parts = dtf.formatToParts(new Date(epochMs));
    const m = {};
    for (const p of parts) if (p.type !== "literal") m[p.type] = p.value;
    let hour = Number(m.hour);
    if (hour === 24) hour = 0;
    const wall = Date.UTC(
      Number(m.year),
      Number(m.month) - 1,
      Number(m.day),
      hour,
      Number(m.minute),
      Number(m.second)
    );
    return wall - epochMs;
  } catch {
    if (tz === SHANGHAI_TZ) return 8 * 60 * 60 * 1e3;
    return tzOffsetMs(epochMs, SHANGHAI_TZ);
  }
}
var offsetCache = /* @__PURE__ */ new Map();
function wallToEpoch(y, mo, d, h2, mi, tz) {
  const key = `${tz}|${y}-${mo}-${d}`;
  let off = offsetCache.get(key);
  if (off === void 0) {
    off = tzOffsetMs(Date.UTC(y, mo - 1, d, 12, 0, 0), tz);
    offsetCache.set(key, off);
  }
  return Date.UTC(y, mo - 1, d, h2, mi, 0, 0) - off;
}
function normalizeTz(tz) {
  if (tz && tz.trim()) return tz.trim();
  return SHANGHAI_TZ;
}
function resolveToken(token, names) {
  const s = token.trim().toLowerCase();
  if (/^\d+$/.test(s)) return Number(s);
  if (names && names[s] !== void 0) return names[s];
  return null;
}
function parseField(field, min, max, names) {
  const tokens = field.split(",");
  const result = /* @__PURE__ */ new Set();
  for (const raw of tokens) {
    const tok = raw.trim();
    if (tok === "") return null;
    let stepStr;
    let range = tok;
    const slash = tok.indexOf("/");
    if (slash >= 0) {
      range = tok.slice(0, slash);
      stepStr = tok.slice(slash + 1);
    }
    const step = stepStr === void 0 ? 1 : Number(stepStr);
    if (!Number.isInteger(step) || step < 1) return null;
    let lo;
    let hi;
    if (range === "*" || range === "?") {
      lo = min;
      hi = max;
    } else if (range.includes("-")) {
      const [a, b] = range.split("-");
      const la = resolveToken(a, names);
      const lb = resolveToken(b, names);
      if (la == null || lb == null || la > lb) return null;
      lo = la;
      hi = lb;
    } else {
      const v = resolveToken(range, names);
      if (v == null) return null;
      lo = hi = v;
    }
    if (lo < min || hi > max) return null;
    for (let i = lo; i <= hi; i += step) result.add(i);
  }
  return [...result].sort((a, b) => a - b);
}
function parseCron(expr) {
  const fields = expr.trim().split(/\s+/);
  if (fields.length !== 5) return null;
  const minute = parseField(fields[0], 0, 59);
  const hour = parseField(fields[1], 0, 23);
  const dom = parseField(fields[2], 1, 31);
  const month = parseField(fields[3], 1, 12, MONTH_NAMES);
  const dowRaw = parseField(fields[4], 0, 7, DOW_NAMES);
  if (!minute || !hour || !dom || !month || !dowRaw) return null;
  const dow = dowRaw.map((v) => v === 7 ? 0 : v);
  return {
    minute,
    hour,
    dom,
    month,
    dow,
    domStar: fields[2] === "*" || fields[2] === "?",
    dowStar: fields[4] === "*" || fields[4] === "?"
  };
}
function isValidCron(expr) {
  return parseCron(expr) !== null;
}
function matches(c, mo, d, h2, mi, wd) {
  if (!c.month.includes(mo)) return false;
  const domOk = c.dom.includes(d);
  const dowOk = c.dow.includes(wd);
  let dayOk;
  if (c.domStar && c.dowStar) dayOk = true;
  else if (c.domStar) dayOk = dowOk;
  else if (c.dowStar) dayOk = domOk;
  else dayOk = domOk || dowOk;
  if (!dayOk) return false;
  return c.hour.includes(h2) && c.minute.includes(mi);
}
var MAX_LOOKAHEAD_MINUTES = 5 * 366 * 24 * 60;
function nextCronRun(expr, tz, now) {
  const c = parseCron(expr);
  if (!c) return null;
  const tzz = normalizeTz(tz);
  const startWall = new Date(now.getTime() + tzOffsetMs(now.getTime(), tzz) + 6e4);
  let cursor = new Date(startWall.getTime());
  for (let i = 0; i < MAX_LOOKAHEAD_MINUTES; i++) {
    const y = cursor.getUTCFullYear();
    const mo = cursor.getUTCMonth() + 1;
    const d = cursor.getUTCDate();
    const h2 = cursor.getUTCHours();
    const mi = cursor.getUTCMinutes();
    const epoch = wallToEpoch(y, mo, d, h2, mi, tzz);
    if (epoch > now.getTime()) {
      const wd = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
      if (matches(c, mo, d, h2, mi, wd)) return new Date(epoch);
    }
    cursor = new Date(cursor.getTime() + 6e4);
  }
  return null;
}

// src/client/dialogs/schedule-dialog.tsx
var WEEKDAYS = [
  { v: 0, label: "日", en: "Su" },
  { v: 1, label: "一", en: "Mo" },
  { v: 2, label: "二", en: "Tu" },
  { v: 3, label: "三", en: "We" },
  { v: 4, label: "四", en: "Th" },
  { v: 5, label: "五", en: "Fr" },
  { v: 6, label: "六", en: "Sa" }
];
function wdLabel(v) {
  const hit = WEEKDAYS.find((x) => x.v === v);
  return isEnglish() ? hit?.en ?? String(v) : hit?.label ?? String(v);
}
var TZ_LIST = [
  { value: "Asia/Shanghai", label: "中国标准时间 · Asia/Shanghai（UTC+8）" },
  { value: "Asia/Hong_Kong", label: "中国香港 · Asia/Hong_Kong（UTC+8）" },
  { value: "Asia/Taipei", label: "中国台湾 · Asia/Taipei（UTC+8）" },
  { value: "Asia/Singapore", label: "新加坡 · Asia/Singapore（UTC+8）" },
  { value: "Asia/Tokyo", label: "日本 · Asia/Tokyo（UTC+9）" },
  { value: "Asia/Seoul", label: "韩国 · Asia/Seoul（UTC+9）" },
  { value: "Asia/Kolkata", label: "印度 · Asia/Kolkata（UTC+5:30）" },
  { value: "Asia/Dubai", label: "阿联酋 · Asia/Dubai（UTC+4）" },
  { value: "Europe/Moscow", label: "俄罗斯 · Europe/Moscow（UTC+3）" },
  { value: "Europe/Berlin", label: "中欧 · Europe/Berlin（UTC+1/+2）" },
  { value: "Europe/London", label: "英国 · Europe/London（UTC+0/+1）" },
  { value: "America/Sao_Paulo", label: "巴西 · America/Sao_Paulo（UTC-3）" },
  { value: "America/New_York", label: "美国东部 · America/New_York（UTC-5/-4）" },
  { value: "America/Chicago", label: "美国中部 · America/Chicago（UTC-6/-5）" },
  { value: "America/Denver", label: "美国山地 · America/Denver（UTC-7/-6）" },
  { value: "America/Los_Angeles", label: "美国西部 · America/Los_Angeles（UTC-8/-7）" },
  { value: "Australia/Sydney", label: "澳大利亚 · Australia/Sydney（UTC+10/+11）" },
  { value: "Pacific/Auckland", label: "新西兰 · Pacific/Auckland（UTC+12/+13）" },
  { value: "UTC", label: "协调世界时 · UTC（UTC+0）" }
];
var DEFAULT_TZ = "Asia/Shanghai";
var TZ_CUSTOM = "__custom__";
function localTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TZ;
  } catch {
    return DEFAULT_TZ;
  }
}
var CMD_TEMPLATES = [
  { label: "Python", cmd: "python C:/scripts/report.py" },
  { label: "PowerShell", cmd: "powershell -ExecutionPolicy Bypass -File C:/scripts/check.ps1" },
  { label: "bat 批处理", cmd: "C:/scripts/backup.bat" },
  { label: "Node", cmd: "node C:/scripts/sync.mjs" },
  { label: "VBS", cmd: "cscript //Nologo C:/scripts/task.vbs" },
  { label: "Perl", cmd: "perl C:/scripts/task.pl" }
];
var INTERVAL_PRESETS = [
  { v: 5, label: "5 分" },
  { v: 10, label: "10 分" },
  { v: 15, label: "15 分" },
  { v: 30, label: "30 分" },
  { v: 60, label: "1 小时" },
  { v: 120, label: "2 小时" },
  { v: 360, label: "6 小时" },
  { v: 720, label: "12 小时" },
  { v: 1440, label: "24 小时" }
];
function datetimeLocalToInstant(local, tz) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(local);
  if (!m) return null;
  const epoch = wallToEpoch(Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4]), Number(m[5]), tz);
  if (!Number.isFinite(epoch)) return null;
  return new Date(epoch).toISOString();
}
function instantToDatetimeLocal(iso, tz) {
  const epoch = new Date(iso).getTime();
  if (!Number.isFinite(epoch)) return "";
  const wd = new Date(epoch + tzOffsetMs(epoch, tz));
  const p = (n) => String(n).padStart(2, "0");
  return `${wd.getUTCFullYear()}-${p(wd.getUTCMonth() + 1)}-${p(wd.getUTCDate())}T${p(wd.getUTCHours())}:${p(wd.getUTCMinutes())}`;
}
function section(title, desc, children) {
  return h(
    "section",
    { className: "qbot-schedSection" },
    h(
      "header",
      { className: "qbot-schedSectionHead" },
      h("span", { className: "qbot-schedSectionTitle" }, title),
      h("span", { className: "qbot-schedSectionDesc" }, desc)
    ),
    h("div", { className: "qbot-schedSectionBody" }, children)
  );
}
function blankEntry(detailAppId) {
  return {
    id: "",
    appId: detailAppId ?? "",
    scope: "group",
    openid: "",
    type: "daily",
    time: "09:00",
    minutes: 30,
    cron: "0 9 * * *",
    tz: localTimeZone(),
    atLocal: "",
    weekdays: [],
    mode: "text",
    content: "",
    command: "",
    genPrompt: "",
    cwd: "",
    resultMode: "raw",
    tool: "",
    args: {}
  };
}
function ScheduleDialog(props) {
  const { rpcCall, detailAppId, onClose } = props;
  const [scheduleModal, setScheduleModal] = React7.useState({
    loading: true,
    error: "",
    items: [],
    botScope: "current",
    editing: null,
    editError: "",
    saving: false
  });
  const [scheduleRemoving, setScheduleRemoving] = React7.useState("");
  const [scheduleToggling, setScheduleToggling] = React7.useState("");
  const [scheduleTesting, setScheduleTesting] = React7.useState("");
  const [schedNotice, setSchedNotice] = React7.useState(null);
  const archiveChats = useArchiveChats(rpcCall, detailAppId);
  const [cronPreview, setCronPreview] = React7.useState(null);
  const loadSchedules = async (botScope) => {
    setScheduleModal((prev) => prev ? { ...prev, loading: true, error: "" } : prev);
    const payload = botScope === "current" && detailAppId ? { appId: detailAppId } : { allBots: true };
    const res = await rpcCall("schedule.list", payload);
    if (res.ok) {
      const v = val(res) ?? {};
      setScheduleModal(
        (prev) => prev ? { ...prev, loading: false, error: "", items: Array.isArray(v.schedules) ? v.schedules : [] } : prev
      );
    } else {
      setScheduleModal((prev) => prev ? { ...prev, loading: false, error: errText(res.error) } : prev);
    }
  };
  React7.useEffect(() => {
    void loadSchedules("current");
  }, []);
  const switchScheduleScope = (botScope) => {
    setScheduleModal(
      (prev) => prev && prev.botScope !== botScope ? { ...prev, botScope, loading: true, editing: null, editError: "" } : prev
    );
    void loadSchedules(botScope);
  };
  React7.useEffect(() => {
    const e = scheduleModal?.editing;
    if (e && e.type === "cron" && isValidCron(String(e.cron ?? ""))) {
      const next = nextCronRun(String(e.cron), String(e.tz || DEFAULT_TZ), /* @__PURE__ */ new Date());
      setCronPreview(
        next ? { ok: true, text: `下次运行：${formatTime(next.toISOString())}` } : { ok: false, text: "未来 5 年内无匹配，请检查表达式" }
      );
    } else if (e && e.type === "cron" && String(e.cron ?? "").trim()) {
      setCronPreview({ ok: false, text: "表达式还不完整或非法（应为 5 段：分 时 日 月 周）" });
    } else {
      setCronPreview(null);
    }
  }, [scheduleModal?.editing?.cron, scheduleModal?.editing?.tz, scheduleModal?.editing?.type]);
  const openScheduleEdit = (entry) => {
    const base = blankEntry(typeof entry.appId === "string" ? entry.appId : detailAppId);
    setScheduleModal(
      (prev) => prev ? {
        ...prev,
        editing: {
          ...base,
          id: String(entry.id ?? ""),
          appId: typeof entry.appId === "string" ? entry.appId : "",
          scope: entry.scope === "group" ? "group" : "c2c",
          openid: String(entry.openid ?? ""),
          type: ["daily", "interval", "cron", "at"].includes(entry.type) ? entry.type : "daily",
          time: String(entry.time ?? "09:00"),
          minutes: Number(entry.minutes ?? 30),
          cron: String(entry.cron ?? "0 9 * * *"),
          tz: String(entry.tz ?? DEFAULT_TZ),
          atLocal: entry.type === "at" && entry.at ? instantToDatetimeLocal(String(entry.at), String(entry.tz || DEFAULT_TZ)) : "",
          weekdays: Array.isArray(entry.weekdays) ? entry.weekdays.slice() : [],
          mode: entry.mode === "ai" ? "ai" : entry.mode === "tool" ? "tool" : "text",
          content: entry.mode === "tool" ? "" : String(entry.content ?? ""),
          command: String(entry.command ?? (entry.mode === "tool" && !entry.genPrompt ? String(entry.content ?? "") : "")),
          genPrompt: String(entry.genPrompt ?? ""),
          // AI 生成子模式：曾用描述词的任务默认仍走 AI 生成。
          _cmdMode: entry.genPrompt ? "ai" : "manual",
          genStatus: String(entry.genStatus ?? ""),
          genError: String(entry.genError ?? ""),
          cwd: String(entry.cwd ?? ""),
          resultMode: entry.resultMode === "ai" ? "ai" : "raw",
          tool: typeof entry.tool === "string" ? entry.tool : "",
          args: entry.args && typeof entry.args === "object" ? { ...entry.args } : {}
        },
        editError: "",
        saving: false
      } : prev
    );
  };
  const openScheduleCreate = () => {
    setScheduleModal(
      (prev) => prev ? { ...prev, editing: blankEntry(detailAppId ?? ""), editError: "", saving: false } : prev
    );
  };
  const setEditField = (key, value) => {
    setScheduleModal((prev) => prev?.editing ? { ...prev, editError: "", editing: { ...prev.editing, [key]: value } } : prev);
  };
  const toggleWeekday = (v) => {
    setScheduleModal((prev) => {
      if (!prev?.editing) return prev;
      const cur = Array.isArray(prev.editing.weekdays) ? prev.editing.weekdays : [];
      const next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v].sort((a, b) => a - b);
      return { ...prev, editError: "", editing: { ...prev.editing, weekdays: next } };
    });
  };
  const setWeekdays = (list) => {
    setScheduleModal((prev) => prev?.editing ? { ...prev, editError: "", editing: { ...prev.editing, weekdays: [...list] } } : prev);
  };
  const saveScheduleEdit = async () => {
    const e = scheduleModal?.editing;
    if (!e) return;
    if (!String(e.openid ?? "").trim()) {
      setScheduleModal((prev) => prev ? { ...prev, editError: "请填写接收方 openid（群或用户）" } : prev);
      return;
    }
    if (e.type === "daily" && !/^\d{1,2}:\d{2}$/.test(String(e.time ?? ""))) {
      setScheduleModal((prev) => prev ? { ...prev, editError: "时间格式应为 HH:mm（如 09:30）" } : prev);
      return;
    }
    if (e.type === "interval" && !(Number(e.minutes) >= 5)) {
      setScheduleModal((prev) => prev ? { ...prev, editError: "间隔不能小于 5 分钟" } : prev);
      return;
    }
    if (e.type === "cron" && !isValidCron(String(e.cron ?? ""))) {
      setScheduleModal((prev) => prev ? { ...prev, editError: "cron 表达式非法（标准 5 段，如 0 9 * * 1-5）" } : prev);
      return;
    }
    let atInstant = null;
    if (e.type === "at") {
      atInstant = datetimeLocalToInstant(String(e.atLocal ?? ""), String(e.tz || DEFAULT_TZ));
      if (!atInstant) {
        setScheduleModal((prev) => prev ? { ...prev, editError: "请选择有效的 at 时间" } : prev);
        return;
      }
      if (new Date(atInstant).getTime() <= Date.now()) {
        setScheduleModal((prev) => prev ? { ...prev, editError: "at 时间必须晚于当前时间" } : prev);
        return;
      }
    }
    const tz = String(e.tz || DEFAULT_TZ).trim() || DEFAULT_TZ;
    if ((e.type === "cron" || e.type === "at") && !/^[A-Za-z]+(\/[A-Za-z_+-]+)?$|^UTC$/.test(tz)) {
      setScheduleModal((prev) => prev ? { ...prev, editError: "时区格式不正确（应为 IANA 时区，如 Asia/Shanghai）" } : prev);
      return;
    }
    if (e.mode === "tool") {
      const aiMode = String(e._cmdMode ?? "manual") === "ai";
      if (aiMode) {
        if (!String(e.genPrompt ?? "").trim()) {
          setScheduleModal((prev) => prev ? { ...prev, editError: "请填写 AI 脚本描述词（如：抓取某网页今日价格并输出）" } : prev);
          return;
        }
      } else if (!String(e.command ?? "").trim()) {
        setScheduleModal((prev) => prev ? { ...prev, editError: "请填写要执行的命令（如 python C:/scripts/report.py）" } : prev);
        return;
      }
    } else if (!String(e.content ?? "").trim()) {
      setScheduleModal((prev) => prev ? { ...prev, editError: "内容不能为空" } : prev);
      return;
    }
    setScheduleModal((prev) => prev ? { ...prev, saving: true, editError: "" } : prev);
    const payload = {
      id: e.id,
      scope: e.scope,
      openid: String(e.openid ?? "").trim(),
      type: e.type,
      ...e.type === "daily" ? { time: String(e.time ?? "").trim() } : {},
      ...e.type === "interval" ? { minutes: Number(e.minutes) } : {},
      ...e.type === "cron" ? { cron: String(e.cron ?? "").trim(), tz } : {},
      ...e.type === "at" ? { at: atInstant, tz } : {},
      ...Array.isArray(e.weekdays) && e.weekdays.length ? { weekdays: e.weekdays } : {},
      mode: e.mode,
      ...e.mode === "tool" ? String(e._cmdMode ?? "manual") === "ai" ? {
        // AI 生成模式：只传描述词，宿主后台生成脚本后回填 command。
        genPrompt: String(e.genPrompt ?? "").trim(),
        resultMode: e.resultMode === "ai" ? "ai" : "raw"
      } : {
        command: String(e.command ?? "").trim(),
        ...String(e.cwd ?? "").trim() ? { cwd: String(e.cwd).trim() } : {},
        resultMode: e.resultMode === "ai" ? "ai" : "raw"
      } : { content: String(e.content ?? "").trim() },
      ...e.appId ? { appId: e.appId } : detailAppId ? { appId: detailAppId } : {}
    };
    const res = await rpcCall("schedule.add", payload);
    if (res.ok) {
      setScheduleModal((prev) => prev ? { ...prev, editing: null, saving: false } : prev);
      await loadSchedules(scheduleModal?.botScope ?? "current");
    } else {
      setScheduleModal((prev) => prev ? { ...prev, saving: false, editError: errText(res.error) } : prev);
    }
  };
  const removeSchedule = async (id) => {
    if (!await confirmDlg({ message: localizeText("确定删除这条定时任务？删除后立即停止发送。"), danger: true })) return;
    setScheduleRemoving(id);
    const scopeNow = scheduleModal?.botScope ?? "current";
    try {
      const res = await rpcCall("schedule.remove", { id });
      if (res.ok) await loadSchedules(scopeNow);
      else setScheduleModal((prev) => prev ? { ...prev, error: errText(res.error) } : prev);
    } finally {
      setScheduleRemoving("");
    }
  };
  const toggleSchedule = async (id, currentlyEnabled) => {
    if (currentlyEnabled) {
      const ok = await confirmDlg({
        message: localizeText("确定禁用这条定时任务？禁用后不再执行，可随时重新启用。"),
        confirmLabel: localizeText("确认禁用"),
        danger: true
      });
      if (!ok) return;
    }
    setScheduleToggling(id);
    const scopeNow = scheduleModal?.botScope ?? "current";
    try {
      const res = await rpcCall("schedule.setEnabled", { id, enabled: !currentlyEnabled });
      if (res.ok) await loadSchedules(scopeNow);
      else setScheduleModal((prev) => prev ? { ...prev, error: errText(res.error) } : prev);
    } finally {
      setScheduleToggling("");
    }
  };
  const runOnceSchedule = async (id) => {
    if (!id) return;
    setSchedNotice(null);
    setScheduleTesting(id);
    const res = await rpcCall("schedule.runOnce", { id });
    setScheduleTesting("");
    if (res.ok) {
      const v = val(res) ?? {};
      setSchedNotice({ ok: true, text: typeof v.message === "string" ? v.message : "已测试发送一次" });
    } else {
      setSchedNotice({ ok: false, text: errText(res.error) });
    }
    await loadSchedules(scheduleModal?.botScope ?? "current");
  };
  const ed = scheduleModal.editing;
  const chatLabel = (openid) => {
    const short = `${openid.slice(0, 16)}${openid.length > 16 ? "…" : ""}`;
    const hit = archiveChats.chats.find((c) => c.openid === openid);
    const name2 = hit ? hit.scope === "c2c" ? hit.name : hit.lastSenderName : "";
    if (!name2) return short;
    return hit && hit.scope === "group" ? `${short}（成员 ${name2}）` : `${short}（${name2}）`;
  };
  const summarizeType = (e) => {
    if (e.type === "cron") return `cron ${e.cron ?? ""}${e.tz && e.tz !== DEFAULT_TZ ? ` · ${e.tz}` : ""}`;
    if (e.type === "at") return `一次性 ${e.at ? formatTime(e.at) : localizeText("待补算")}`;
    if (e.type === "interval") {
      const m = Number(e.minutes ?? 0);
      return m >= 60 && m % 60 === 0 && m < 1440 ? `每 ${m / 60} 小时` : m === 1440 ? "每 24 小时" : `每 ${m} 分钟`;
    }
    return `每天 ${e.time ?? "--:--"}`;
  };
  const weekdayText = (list) => {
    if (!list || list.length === 0 || list.length === 7) return localizeText("每天");
    if (isEnglish()) return list.map((w) => WEEKDAYS.find((x) => x.v === w)?.en ?? String(w)).join(", ");
    return `周${list.map((w) => WEEKDAYS.find((x) => x.v === w)?.label ?? String(w)).join("、")}`;
  };
  const tzSelect = (current) => {
    const local = localTimeZone();
    const options = [];
    if (!TZ_LIST.some((t) => t.value === local)) {
      options.push({ value: local, label: `本机时区 · ${local}` });
    }
    options.push(...TZ_LIST);
    const isKnown = options.some((o) => o.value === current);
    return h(
      "div",
      { className: "qbot-schedTz" },
      h(
        "select",
        {
          className: "qbot-settingSelect",
          value: isKnown ? String(current) : TZ_CUSTOM,
          onChange: (ev) => {
            const v = String(ev.target.value);
            setEditField("tz", v === TZ_CUSTOM ? local : v);
          },
          "aria-label": "时区"
        },
        ...options.map(
          (o) => h(
            "option",
            { key: o.value, value: o.value },
            o.value === local && o.label.startsWith("本机时区") ? o.label : o.label
          )
        ),
        h("option", { value: TZ_CUSTOM }, "自定义（手动输入 IANA 时区）")
      ),
      !isKnown ? TextInput({
        className: "qbot-input qbot-mono",
        value: String(current ?? ""),
        placeholder: "Asia/Shanghai",
        onChange: (ev) => setEditField("tz", ev.target.value),
        "aria-label": "自定义时区"
      }) : null
    );
  };
  const weekdayPicker = (current) => {
    const list = Array.isArray(current) ? current : [];
    return h(
      "div",
      { className: "qbot-weekdayPicker" },
      h(
        "div",
        { className: "qbot-weekdayRow", role: "group", "aria-label": "星期过滤" },
        WEEKDAYS.map(
          (w) => h(
            "button",
            {
              key: w.v,
              type: "button",
              className: `qbot-weekdayBtn${list.includes(w.v) ? " is-on" : ""}`,
              "aria-pressed": list.includes(w.v),
              onClick: () => toggleWeekday(w.v)
            },
            wdLabel(w.v)
          )
        )
      ),
      h(
        "div",
        { className: "qbot-weekdayQuick" },
        h("button", { type: "button", className: "qbot-miniBtn", onClick: () => setWeekdays([]) }, "每天"),
        h("button", { type: "button", className: "qbot-miniBtn", onClick: () => setWeekdays([1, 2, 3, 4, 5]) }, "工作日"),
        h("button", { type: "button", className: "qbot-miniBtn", onClick: () => setWeekdays([0, 6]) }, "周末"),
        h("span", { className: "qbot-weekdayHint" }, `当前：${weekdayText(list)}`)
      )
    );
  };
  const timeField = (e) => {
    if (e.type === "daily") {
      return h(
        "div",
        { className: "qbot-schedFieldRow" },
        editRow(
          "每天发送时间",
          "按所选时区解释；点击输入框可用时间选择器。",
          h("input", {
            type: "time",
            className: "qbot-input qbot-mono",
            value: String(e.time ?? ""),
            onChange: (ev) => setEditField("time", ev.target.value),
            "aria-label": "每天发送时间"
          })
        ),
        editRow("时区", "daily 默认按中国标准时间发送；如需按其他时区，请改用 cron。", tzSelect(String(e.tz || DEFAULT_TZ)))
      );
    }
    if (e.type === "interval") {
      return h(
        "div",
        { className: "qbot-schedFieldRow" },
        editRow(
          "间隔分钟",
          "两次发送之间的间隔，最小 5 分钟。间隔越小消耗的主动消息配额越多。",
          h(
            "div",
            { className: "qbot-schedNumber" },
            h("input", {
              type: "number",
              className: "qbot-input qbot-mono",
              min: 5,
              step: 1,
              value: String(e.minutes ?? 30),
              onChange: (ev) => setEditField("minutes", Number(ev.target.value)),
              "aria-label": "间隔分钟"
            }),
            h("span", { className: "qbot-schedUnit" }, "分钟")
          )
        ),
        h(
          "div",
          { className: "qbot-schedPresets" },
          h("span", { className: "qbot-schedPresetLabel" }, "快捷"),
          INTERVAL_PRESETS.map(
            (p) => h(
              "button",
              {
                key: p.v,
                type: "button",
                className: `qbot-miniBtn${Number(e.minutes) === p.v ? " is-on" : ""}`,
                onClick: () => setEditField("minutes", p.v)
              },
              p.label
            )
          )
        )
      );
    }
    if (e.type === "cron") {
      return h(
        "div",
        { className: "qbot-schedFieldRow" },
        editRow(
          "cron 表达式",
          "标准 5 段：分 时 日 月 周（如 0 9 * * 1-5 = 工作日 9 点）。支持 */步长、范围、列表、月份与星期英文名。",
          TextInput({
            className: "qbot-input qbot-mono",
            value: String(e.cron ?? ""),
            placeholder: "0 9 * * 1-5",
            onChange: (ev) => setEditField("cron", ev.target.value),
            "aria-label": "cron 表达式"
          })
        ),
        editRow("时区", "cron 表达式按该时区解释。", tzSelect(String(e.tz || DEFAULT_TZ)))
      );
    }
    return h(
      "div",
      { className: "qbot-schedFieldRow" },
      editRow(
        "at 时间",
        "一次性触发时间，到点执行一次后自动删除。",
        h("input", {
          type: "datetime-local",
          className: "qbot-input qbot-mono",
          value: String(e.atLocal ?? ""),
          onChange: (ev) => setEditField("atLocal", ev.target.value),
          "aria-label": "at 时间"
        })
      ),
      editRow("时区", "at 时间按该时区解释。", tzSelect(String(e.tz || DEFAULT_TZ)))
    );
  };
  const actionField = (e) => {
    if (e.mode === "tool") {
      const aiMode = String(e._cmdMode ?? "manual") === "ai";
      return h(
        "div",
        { className: "qbot-schedFieldCol" },
        editRow(
          "命令来源",
          "手写命令=自己写完整命令行；AI 生成脚本=只写任务描述，保存后由 AI 后台生成脚本并自动回填命令。",
          h(
            "div",
            { className: "qbot-schedSeg", role: "group", "aria-label": "命令来源" },
            h(
              "button",
              {
                type: "button",
                className: `qbot-segBtn${!aiMode ? " is-on" : ""}`,
                "aria-pressed": !aiMode,
                onClick: () => setEditField("_cmdMode", "manual")
              },
              "手写命令"
            ),
            h(
              "button",
              {
                type: "button",
                className: `qbot-segBtn${aiMode ? " is-on" : ""}`,
                "aria-pressed": aiMode,
                onClick: () => setEditField("_cmdMode", "ai")
              },
              "AI 生成脚本"
            )
          )
        ),
        aiMode ? [
          editRow(
            "AI 脚本描述词",
            "描述这个定时任务要做的事（如「抓取某网页今日价格并输出一行文本」）。保存后 AI 后台生成脚本：生成期间任务不执行；完成后自动按计划执行（已过的触发时刻不补跑）。",
            TextArea({
              rows: 3,
              value: String(e.genPrompt ?? ""),
              placeholder: "例如：访问 https://example.com/price 抓取今日价格，输出一行「今日价格：xx 元」",
              onChange: (ev) => setEditField("genPrompt", ev.target.value),
              "aria-label": "AI 脚本描述词"
            })
          ),
          e.id && String(e.genStatus ?? "") === "pending" ? h("div", { className: "qbot-schedGen is-pending" }, "脚本生成中…完成后自动回填命令并按计划执行。") : null,
          e.id && String(e.genStatus ?? "") === "done" ? h("div", { className: "qbot-schedGen is-done" }, `已生成脚本：${String(e.command ?? "")}。修改描述词并保存会重新生成。`) : null,
          e.id && String(e.genStatus ?? "") === "error" ? h("div", { className: "qbot-schedGen is-error" }, `上次生成失败：${String(e.genError ?? "未知错误")}。重新保存即重试。`) : null
        ] : [
          editRow(
            "要执行的命令",
            "到点由服务端执行这条命令行，捕获 stdout/stderr 与退出码后推送给用户。支持 python / powershell -File / .bat / node / vbs(cscript //Nologo) / perl / php / ruby 等。",
            h(
              "div",
              { className: "qbot-schedCmd" },
              TextArea({
                rows: 3,
                className: "qbot-textarea qbot-mono",
                value: String(e.command ?? ""),
                placeholder: "python C:/scripts/report.py",
                onChange: (ev) => setEditField("command", ev.target.value),
                "aria-label": "要执行的命令"
              }),
              h(
                "div",
                { className: "qbot-schedPresets" },
                h("span", { className: "qbot-schedPresetLabel" }, "模板"),
                CMD_TEMPLATES.map(
                  (t) => h("button", { key: t.label, type: "button", className: "qbot-miniBtn", onClick: () => setEditField("command", t.cmd) }, t.label)
                )
              )
            )
          ),
          editRow(
            "工作目录（可选）",
            "命令的工作目录；留空则使用插件进程目录。脚本里用相对路径时建议填写。",
            TextInput({
              className: "qbot-input qbot-mono",
              value: String(e.cwd ?? ""),
              placeholder: "例如 C:/scripts",
              onChange: (ev) => setEditField("cwd", ev.target.value),
              "aria-label": "工作目录"
            })
          )
        ],
        editRow(
          "结果处理",
          "raw = 直接把命令输出推送给用户；ai = 先把输出交给 AI 整理成简洁播报再推送（输出很长或含噪音时推荐）。",
          h(
            "select",
            {
              className: "qbot-settingSelect",
              value: e.resultMode === "ai" ? "ai" : "raw",
              onChange: (ev) => setEditField("resultMode", ev.target.value),
              "aria-label": "结果处理"
            },
            h("option", { value: "raw" }, "raw：直接推送原始输出"),
            h("option", { value: "ai" }, "ai：交给 AI 整理后推送")
          )
        )
      );
    }
    return editRow(
      "内容",
      e.mode === "ai" ? "给 AI 的生成指令（如「播报今天的天气」），到点由 AI 生成内容后发送。" : "到点直接发送的文本，上限 2000 字。",
      TextArea({
        rows: 3,
        value: String(e.content ?? ""),
        placeholder: e.mode === "ai" ? "例如：总结今天的待办" : "例如：记得喝水",
        onChange: (ev) => setEditField("content", ev.target.value),
        "aria-label": "定时任务内容"
      })
    );
  };
  return h(
    "div",
    { className: "qbot-modalOverlay" },
    h(
      "div",
      { className: "qbot-modal qbot-modalWide", role: "dialog", "aria-modal": "true", "aria-label": "定时任务管理" },
      h(
        "div",
        { className: "qbot-modalHead" },
        h(
          "div",
          null,
          h("strong", null, "定时任务管理"),
          h("p", null, "支持 daily / interval / cron / at 四种触发条件，以及 文本 / AI 生成 / 执行命令 三种执行方式。")
        ),
        h("button", { className: "qbot-modalClose", type: "button", "aria-label": "关闭", onClick: onClose }, "×")
      ),
      ed ? [
        h(
          "div",
          { key: "body", className: "qbot-modalBody" },
          h(
            "div",
            { className: "qbot-editForm qbot-schedForm" },
            section(
              "① 发送给谁",
              "决定这条任务往哪个群或哪个用户发。",
              h(
                "div",
                { className: "qbot-editGrid" },
                editRow(
                  "发送范围",
                  "群聊或单聊；改动范围后请确认下方 openid 与之匹配。",
                  h(
                    "select",
                    {
                      className: "qbot-settingSelect",
                      value: String(ed.scope),
                      onChange: (ev) => {
                        setEditField("openid", "");
                        setEditField("scope", ev.target.value);
                      },
                      "aria-label": "发送范围"
                    },
                    h("option", { value: "group" }, "群聊"),
                    h("option", { value: "c2c" }, "单聊")
                  )
                ),
                editRow(
                  "接收方 openid",
                  "接收消息的群或用户 openid。点击输入框可从消息归档下拉选择：群聊候选显示群 id，单聊候选显示用户 id 与昵称；也可直接粘贴。",
                  h(OpenIdPicker, {
                    chats: archiveChats.chats,
                    scope: ed.scope === "group" ? "group" : "c2c",
                    value: String(ed.openid ?? ""),
                    loading: archiveChats.loading,
                    error: archiveChats.error,
                    onChange: (v) => setEditField("openid", v),
                    ariaLabel: "接收方 openid"
                  })
                )
              )
            ),
            section(
              "② 什么时候触发",
              "选择触发条件并填写对应参数。",
              h(
                "div",
                { className: "qbot-schedFieldCol" },
                editRow(
                  "触发条件",
                  "每天=指定时刻；间隔=按分钟循环；cron=标准表达式（可带时区）；一次性 at=绝对时间，到点后自动删除。",
                  h(
                    "div",
                    { className: "qbot-schedSeg", role: "group", "aria-label": "触发条件" },
                    [
                      { v: "daily", label: "每天" },
                      { v: "interval", label: "间隔" },
                      { v: "cron", label: "cron" },
                      { v: "at", label: "一次性 at" }
                    ].map(
                      (t) => h(
                        "button",
                        {
                          key: t.v,
                          type: "button",
                          className: `qbot-segBtn${ed.type === t.v ? " is-on" : ""}`,
                          "aria-pressed": ed.type === t.v,
                          onClick: () => {
                            setEditField("type", t.v);
                            if (t.v === "interval" && !(Number(ed.minutes) >= 5)) setEditField("minutes", 30);
                            if (t.v === "cron" && !String(ed.cron ?? "").trim()) setEditField("cron", "0 9 * * *");
                          }
                        },
                        t.label
                      )
                    )
                  )
                ),
                timeField(ed),
                cronPreview ? h(
                  "div",
                  { className: `qbot-schedPreview${cronPreview.ok ? "" : " is-warn"}` },
                  cronPreview.text
                ) : null,
                ed.type === "daily" || ed.type === "interval" ? editRow(
                  "星期过滤（可选）",
                  "仅在这些星期触发；不选 = 每天。0=周日。",
                  weekdayPicker(ed.weekdays)
                ) : null
              )
            ),
            section(
              "③ 到点做什么",
              "选择执行方式并填写内容。",
              h(
                "div",
                { className: "qbot-schedFieldCol" },
                editRow(
                  "执行方式",
                  "文本=到点原样发送；AI 生成=把内容当指令交给 AI 生成后回复；执行命令=到点跑一条命令并把输出推送给用户。",
                  h(
                    "select",
                    {
                      className: "qbot-settingSelect",
                      value: String(ed.mode ?? "text"),
                      onChange: (ev) => setEditField("mode", ev.target.value),
                      "aria-label": "执行方式"
                    },
                    h("option", { value: "text" }, "直接发送文本"),
                    h("option", { value: "ai" }, "AI 生成内容"),
                    h("option", { value: "tool" }, "执行命令并推送结果")
                  )
                ),
                actionField(ed)
              )
            )
          )
        ),
        h(
          "div",
          { key: "foot", className: "qbot-modalFoot" },
          h(
            "span",
            { className: "qbot-hint" },
            ed.appId && ed.appId !== detailAppId ? `该任务归属机器人 ${ed.appId.slice(0, 4)}••••${ed.appId.slice(-4)}` : "保存后立即生效并重新计算下次触发时间"
          ),
          h(
            "div",
            { className: "qbot-viewActions" },
            h(
              "button",
              {
                className: "qbot-btn",
                type: "button",
                disabled: scheduleModal.saving,
                onClick: () => setScheduleModal((prev) => prev ? { ...prev, editing: null, editError: "" } : prev)
              },
              "取消"
            ),
            h(
              "button",
              {
                className: "qbot-btn qbot-btnPrimary",
                type: "button",
                disabled: scheduleModal.saving,
                onClick: () => void saveScheduleEdit()
              },
              scheduleModal.saving ? "保存中…" : ed.id ? "保存修改" : "创建"
            )
          )
        )
      ] : h(
        "div",
        { className: `qbot-modalList${scheduleModal.loading && scheduleModal.items.length > 0 ? " is-refreshing" : ""}` },
        [
          schedNotice ? h(
            "div",
            { key: "notice", className: `qbot-schedNotice${schedNotice.ok ? "" : " is-error"}` },
            schedNotice.text
          ) : null,
          h(
            "div",
            { key: "tabs", className: "qbot-schedTabs", role: "tablist" },
            h(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": scheduleModal.botScope === "current",
                className: `qbot-schedTab${scheduleModal.botScope === "current" ? " is-active" : ""}`,
                onClick: () => switchScheduleScope("current")
              },
              "当前机器人"
            ),
            h(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": scheduleModal.botScope === "all",
                className: `qbot-schedTab${scheduleModal.botScope === "all" ? " is-active" : ""}`,
                onClick: () => switchScheduleScope("all")
              },
              "所有机器人"
            ),
            h(
              "button",
              { type: "button", className: "qbot-btn qbot-btnPrimary qbot-schedAdd", onClick: openScheduleCreate, "aria-label": "新增定时任务" },
              "＋ 新增"
            )
          ),
          // 吸顶：tabs 与 notice 固定在面板头部，仅此内层滚动。
          h(
            "div",
            { key: "scroll", className: "qbot-modalListScroll" },
            scheduleModal.error ? null : scheduleModal.items.length === 0 ? scheduleModal.loading ? h(
              "div",
              { key: "loading", className: "qbot-modalState" },
              h("span", { className: "qbot-spinner", "aria-hidden": "true" }),
              "正在读取定时任务…"
            ) : h(
              "div",
              { key: "empty", className: "qbot-modalState" },
              "还没有定时任务。可在聊天里发 /定时 每天 09:00 内容、让 AI 帮你设置，或点上方「＋ 新增」。"
            ) : [{ scope: "group", title: "群聊任务" }, { scope: "c2c", title: "单聊任务" }].map((g) => {
              const rows = scheduleModal.items.filter((e) => e.scope === g.scope);
              if (rows.length === 0) return null;
              return h(
                "div",
                { key: g.scope, className: "qbot-schedGroup" },
                h(
                  "div",
                  { className: "qbot-schedGroupTitle", "data-scope": g.scope },
                  g.title,
                  h("span", { className: "qbot-schedCount" }, `${rows.length}`)
                ),
                rows.map(
                  (e) => h(
                    "div",
                    { key: String(e.id), className: `qbot-schedRow${e.enabled === false ? " is-disabled" : ""}${e.lastError ? " is-failed" : ""}` },
                    h(
                      "div",
                      { className: "qbot-schedMain" },
                      h(
                        "div",
                        { className: "qbot-schedTop" },
                        e.enabled === false ? h("span", { className: "qbot-chip qbot-chipOff" }, "已禁用") : null,
                        h("span", { className: "qbot-chip is-active" }, summarizeType(e)),
                        e.mode === "ai" ? h("span", { className: "qbot-chip" }, "AI 生成") : null,
                        e.mode === "tool" ? h(
                          "span",
                          { className: "qbot-chip" },
                          e.resultMode === "ai" ? "命令 → AI 播报" : "命令 → 原始输出"
                        ) : null,
                        Array.isArray(e.weekdays) && e.weekdays.length ? h("span", { className: "qbot-chip" }, weekdayText(e.weekdays)) : null,
                        e.lastError ? h("span", { className: "qbot-chip qbot-chipError" }, "执行失败") : null,
                        e.genStatus === "pending" ? h("span", { className: "qbot-chip qbot-chipInfo" }, "脚本生成中…") : null,
                        e.genStatus === "error" ? h("span", { className: "qbot-chip qbot-chipError" }, "脚本生成失败") : null
                      ),
                      h(
                        "div",
                        { className: "qbot-schedContent" },
                        e.mode === "tool" && e.genStatus === "pending" ? `（AI 生成中）${String(e.genPrompt ?? "")}` : e.mode === "tool" ? String(e.command ?? e.content ?? "") : String(e.content ?? "")
                      ),
                      h(
                        "div",
                        { className: "qbot-schedMeta" },
                        h(
                          "span",
                          null,
                          `${e.scope === "group" ? "群" : "用户"} ${chatLabel(String(e.openid ?? ""))}`
                        ),
                        h(
                          "span",
                          null,
                          e.createdBy === "settings" ? "来自设置页" : e.createdBy === "ai" ? "来自 AI" : "来自聊天命令"
                        ),
                        h(
                          "span",
                          null,
                          e.enabled === false ? localizeText("已禁用，不会执行") : e.genStatus === "pending" ? localizeText("生成完成后开始执行；已过的触发时刻不补跑") : `下次 ${e.nextRunAt ? formatTime(e.nextRunAt) : localizeText("待补算")}`
                        ),
                        e.lastError ? h("span", { className: "qbot-schedError" }, String(e.lastError)) : null
                      )
                    ),
                    h(
                      "div",
                      { className: "qbot-schedOps" },
                      h(
                        "button",
                        {
                          className: "qbot-btn qbot-schedTest",
                          type: "button",
                          title: "测试发送一次（不计入主动消息配额）",
                          disabled: scheduleTesting === String(e.id),
                          onClick: () => void runOnceSchedule(String(e.id))
                        },
                        scheduleTesting === String(e.id) ? "测试中…" : "测试"
                      ),
                      h(
                        "button",
                        {
                          className: `qbot-btn qbot-schedToggle${e.enabled === false ? " is-off" : ""}`,
                          type: "button",
                          "aria-pressed": e.enabled === false,
                          disabled: scheduleToggling === String(e.id),
                          onClick: () => void toggleSchedule(String(e.id), e.enabled !== false)
                        },
                        scheduleToggling === String(e.id) ? e.enabled === false ? "启用中…" : "禁用中…" : e.enabled === false ? "启用" : "禁用"
                      ),
                      h("button", { className: "qbot-btn qbot-schedEdit", type: "button", onClick: () => openScheduleEdit(e) }, "编辑"),
                      h(
                        "button",
                        {
                          className: "qbot-btn qbot-btnDanger qbot-schedRemove",
                          type: "button",
                          disabled: scheduleRemoving === String(e.id),
                          onClick: () => void removeSchedule(String(e.id))
                        },
                        scheduleRemoving === String(e.id) ? "删除中…" : "删除"
                      )
                    )
                  )
                )
              );
            })
          )
        ]
      ),
      !ed ? h(
        "div",
        { className: "qbot-modalFoot" },
        h(
          "span",
          { className: "qbot-hint" },
          scheduleModal.botScope === "all" ? `所有机器人共 ${scheduleModal.items.length} 条（每个群/单聊最多 5 条）` : `共 ${scheduleModal.items.length} 条（每个群/单聊最多 5 条）`
        ),
        h(
          "div",
          { className: "qbot-viewActions" },
          h("button", { className: "qbot-btn", type: "button", disabled: scheduleModal.loading, onClick: () => void loadSchedules(scheduleModal.botScope) }, "刷新"),
          h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: onClose }, "关闭")
        )
      ) : null
    )
  );
}

// src/client/dialogs/workspace-picker.tsx
var React8 = __toESM(require("react"), 1);
function WorkspacePickerDialog(props) {
  const { rpcCall, initialPath, onClose, onPick } = props;
  const [picker, setPicker] = React8.useState({
    path: "",
    parent: null,
    dirs: [],
    selected: "",
    loading: true,
    error: ""
  });
  const browseTo = async (target) => {
    setPicker((prev) => prev ? { ...prev, loading: true, error: "", selected: "" } : prev);
    const res = await rpcCall("workspace.browse", target ? { path: target } : {});
    if (res.ok) {
      const v = val(res) ?? {};
      setPicker({
        path: String(v.path ?? ""),
        parent: v.parent ?? null,
        dirs: Array.isArray(v.dirs) ? v.dirs : [],
        selected: "",
        loading: false,
        error: ""
      });
    } else {
      setPicker((prev) => prev ? { ...prev, loading: false, error: errText(res.error) } : prev);
    }
  };
  const pickDirectory = () => {
    const chosen = picker.selected || picker.path;
    if (!chosen) return;
    onPick(chosen);
  };
  React8.useEffect(() => {
    void browseTo(initialPath || void 0);
  }, []);
  return h(
    "div",
    { className: "qbot-modalOverlay" },
    h(
      "div",
      { className: "qbot-modal", role: "dialog", "aria-modal": "true", "aria-label": "选择工作区目录" },
      h(
        "div",
        { className: "qbot-modalHead" },
        h(
          "div",
          null,
          h("strong", null, "选择工作区目录"),
          h("p", null, "逐级浏览并选定机器人读取文件的文件夹")
        ),
        h("button", { className: "qbot-modalClose", type: "button", "aria-label": "关闭", onClick: onClose }, "×")
      ),
      h(
        "div",
        { className: "qbot-modalPath qbot-mono" },
        picker.loading ? "加载中…" : picker.selected || picker.path || "—"
      ),
      h(
        "div",
        { className: `qbot-modalList${picker.loading && picker.dirs.length > 0 ? " is-refreshing" : ""}` },
        picker.error ? h("div", { className: "qbot-modalState qbot-modalError" }, picker.error) : picker.loading && picker.dirs.length === 0 ? h("div", { className: "qbot-modalState" }, h("span", { className: "qbot-spinner", "aria-hidden": "true" }), "正在读取目录…") : [
          picker.parent ? h(
            "button",
            { key: "__up", type: "button", className: "qbot-dirRow", onClick: () => void browseTo(picker.parent ?? void 0) },
            h(FolderUpGlyph),
            "上一级"
          ) : null,
          picker.dirs.map((d) => h(
            "button",
            {
              key: d.path,
              type: "button",
              className: `qbot-dirRow${picker.selected === d.path ? " is-selected" : ""}`,
              title: "单击选中，双击进入",
              onClick: () => setPicker((prev) => prev ? { ...prev, selected: d.path } : prev),
              onDoubleClick: () => void browseTo(d.path)
            },
            h(FolderGlyph),
            d.name
          )),
          !picker.loading && picker.dirs.length === 0 ? h("div", { className: "qbot-modalState" }, "该目录下没有子文件夹") : null
        ]
      ),
      h(
        "div",
        { className: "qbot-modalFoot" },
        h("span", { className: "qbot-hint" }, "单击选中，双击进入；未选中时选定当前浏览的目录"),
        h(
          "div",
          { className: "qbot-viewActions" },
          h("button", { className: "qbot-btn", type: "button", onClick: onClose }, "取消"),
          h("button", {
            className: "qbot-btn qbot-btnPrimary",
            type: "button",
            disabled: picker.loading || !picker.path,
            onClick: pickDirectory
          }, "选定此文件夹")
        )
      )
    )
  );
}

// src/client/index.tsx
var name = "qqbot-settings";
var inject = ["slots", "connection", "locale"];
var RPC_CHANNEL = "/qqbot-settings";
function QqbotSettingsTab({ rpcCall }) {
  const [status, setStatus] = React9.useState(null);
  const [bots, setBots] = React9.useState(null);
  const [catalogs, setCatalogs] = React9.useState(EMPTY_CATALOGS);
  const [form, setForm] = React9.useState({});
  const [page, setPage] = React9.useState("list");
  const [detailAppId, setDetailAppId] = React9.useState("");
  const [scheduleOpen, setScheduleOpen] = React9.useState(false);
  const [archiveOpen, setArchiveOpen] = React9.useState(false);
  const [pickerOpen, setPickerOpen] = React9.useState(false);
  const [overrideEdit, setOverrideEdit] = React9.useState(null);
  const [notice, setNotice] = React9.useState("");
  const [loadError, setLoadError] = React9.useState("");
  const [refreshing, setRefreshing] = React9.useState(false);
  const [reconnecting, setReconnecting] = React9.useState(false);
  const [update, setUpdate] = React9.useState({
    busy: false,
    message: "",
    done: false
  });
  const refresh = React9.useCallback(async (appId) => {
    try {
      const [s, c, b, cat] = await Promise.all([
        rpcCall("status"),
        rpcCall("config.get", appId ? { appId } : {}),
        rpcCall("bots.list"),
        rpcCall("catalogs")
      ]);
      if (s.ok) setStatus(val(s) ?? null);
      else setLoadError(errText(s.error ?? "状态读取失败"));
      if (c.ok) {
        const stored = val(c)?.config ?? {};
        setForm({ ...stored });
      }
      if (b.ok) setBots(val(b) ?? null);
      if (cat.ok) setCatalogs({ ...EMPTY_CATALOGS, ...val(cat) ?? {} });
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : String(error));
    }
  }, [rpcCall]);
  React9.useEffect(() => {
    void refresh();
  }, [refresh]);
  React9.useEffect(() => {
    if (page !== "detail") return void 0;
    if (!detailAppId) return void 0;
    let alive = true;
    rpcCall("config.get", { appId: detailAppId }).then((res) => {
      if (!alive) return;
      if (res.ok) setForm({ ...val(res)?.config ?? {} });
    });
    return () => {
      alive = false;
    };
  }, [page, detailAppId, rpcCall]);
  const saveField = async (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    const res = await rpcCall("config.save", { appId: detailAppId || void 0, [key]: value });
    if (!res.ok) {
      const message = `保存失败：${errText(res.error)}`;
      setNotice(message);
      return { ok: false, error: message };
    }
    setNotice("");
    await refresh(detailAppId || void 0);
    return { ok: true, data: val(res) };
  };
  const dialogOpenRef = React9.useRef(false);
  dialogOpenRef.current = Boolean(scheduleOpen || archiveOpen || pickerOpen || overrideEdit !== null);
  React9.useEffect(() => {
    if (!notice || dialogOpenRef.current) return;
    const el = document.getElementById("qbot-notice");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [notice]);
  React9.useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 8e3);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const refreshStats = async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  };
  const [resetting, setResetting] = React9.useState(false);
  const resetStats = async () => {
    setResetting(true);
    try {
      const res = await rpcCall("stats.reset", detailAppId ? { appId: detailAppId } : {});
      if (res.ok) await refresh();
    } finally {
      setResetting(false);
    }
  };
  const setPrimaryBot = async (appId) => {
    setNotice("");
    const res = await rpcCall("bots.setPrimary", { appId });
    setNotice(res.ok ? "已设为主机器人" : `操作失败：${errText(res.error)}`);
    if (res.ok) await refresh();
  };
  const toggleEnabled = async (bot, enabled) => {
    setNotice("");
    const res = await rpcCall("bots.enable", { appId: bot.appId, enabled });
    setNotice(res.ok ? enabled ? "机器人已启用" : "机器人已停用" : `操作失败：${errText(res.error)}`);
    if (res.ok) await refresh();
  };
  const removeBot = async (bot) => {
    if (!await confirmDlg({ message: localizeText(`确定删除机器人 ${bot.appIdMasked}？删除后该机器人停止接收消息。`), danger: true })) return;
    setNotice("");
    const res = await rpcCall("bots.remove", { appId: bot.appId });
    if (res.ok) {
      await refresh();
      setPage("list");
      setNotice("机器人已删除");
    } else {
      setNotice(`删除失败：${errText(res.error)}`);
    }
  };
  const retryConnection = async () => {
    setNotice("");
    setReconnecting(true);
    try {
      const res = await rpcCall("bots.reconnect", detailAppId ? { appId: detailAppId } : {});
      if (res.ok) await refresh();
      setNotice(res.ok ? "已重新发起连接，请稍候查看状态" : `重试失败：${errText(res.error)}`);
    } finally {
      setReconnecting(false);
    }
  };
  const runUpdateCheck = async () => {
    setUpdate({ busy: true, message: "正在检查更新…", done: false });
    try {
      const res = await rpcCall("update.check");
      if (!res.ok) {
        setUpdate({ busy: false, message: `检查失败：${errText(res.error)}`, done: false });
        return;
      }
      const v = val(res) ?? {};
      if (!v.hasUpdate) {
        setUpdate({ busy: false, message: `暂无新版本（当前 v${v.current || "?"} 已是最新）`, done: false });
        return;
      }
      setUpdate({ busy: true, message: `发现新版本 v${v.latest}，正在自动更新…`, done: false });
      const applied = await rpcCall("update.apply");
      if (applied.ok) {
        const r = val(applied) ?? {};
        setUpdate({
          busy: false,
          message: `已自动更新到 v${r.updatedTo ?? v.latest}（备份于安装目录 .update-backup/），重启 DSH 后生效`,
          done: true
        });
      } else {
        setUpdate({ busy: false, message: `更新失败：${errText(applied.error)}`, done: false });
      }
    } catch (error) {
      setUpdate({
        busy: false,
        message: `检查失败：${error instanceof Error ? error.message : String(error)}`,
        done: false
      });
    }
  };
  React9.useEffect(() => {
    if (!update.message || update.busy) return void 0;
    const timer = setTimeout(() => setUpdate((u) => ({ ...u, message: "" })), 8e3);
    return () => clearTimeout(timer);
  }, [update.message, update.busy]);
  const groupOverrides = form.groupOverrides && typeof form.groupOverrides === "object" && !Array.isArray(form.groupOverrides) ? form.groupOverrides : {};
  const overrideSummary = (ov) => {
    const parts = [];
    if (ov.groupFullReply !== void 0) parts.push(`全量回复 ${ov.groupFullReply ? "开" : "关"}`);
    if (ov.valueThreshold !== void 0) parts.push(`阈值 ${ov.valueThreshold}`);
    if (ov.atContextMessages !== void 0) parts.push(`上下文 ${ov.atContextMessages} 条`);
    if (ov.groupCooldownMs !== void 0) parts.push(`群冷却 ${cooldownLabel(Number(ov.groupCooldownMs))}`);
    if (ov.senderCooldownMs !== void 0) parts.push(`同人冷却 ${cooldownLabel(Number(ov.senderCooldownMs))}`);
    if (ov.replyChunkChars !== void 0) parts.push(`分片 ${ov.replyChunkChars}`);
    if (ov.maxRepliesPerMessage !== void 0) parts.push(`回复上限 ${ov.maxRepliesPerMessage}`);
    if (ov.markdownReply !== void 0) parts.push(`Markdown ${ov.markdownReply ? "开" : "关"}`);
    if (ov.memoryEnabled !== void 0) parts.push(`记忆 ${ov.memoryEnabled ? "开" : "关"}`);
    if (Array.isArray(ov.bannedWords) && ov.bannedWords.length > 0) parts.push(`敏感词 ${ov.bannedWords.length} 个`);
    if (typeof ov.agentPresetChat === "string" && ov.agentPresetChat) parts.push(`聊天 Preset ${ov.agentPresetChat}`);
    return parts.length > 0 ? parts.join(" · ") : "无覆盖字段";
  };
  const removeOverride = async (openid) => {
    if (!await confirmDlg({ message: localizeText(`确定删除群 ${openid.slice(0, 10)}… 的覆盖配置？删除后该群恢复使用机器人默认配置。`), danger: true })) return;
    const next = { ...groupOverrides };
    delete next[openid];
    await saveField("groupOverrides", next);
  };
  const modelGroups = () => {
    const groups = [];
    const index = /* @__PURE__ */ new Map();
    for (const m of catalogs.models) {
      if (!m || typeof m.id !== "string" || !m.id) continue;
      const slash = m.id.indexOf("/");
      const label = String(m.group ?? (slash > 0 ? m.id.slice(0, slash) : "模型"));
      const option = { value: m.id, label: typeof m.label === "string" && m.label ? m.label : m.id };
      const at = index.get(label);
      if (at === void 0) {
        index.set(label, groups.length);
        groups.push({ label, options: [option] });
      } else {
        groups[at].options.push(option);
      }
    }
    return groups;
  };
  const withCurrent = (candidates, current, labelFn) => {
    const list = candidates.map((n) => ({ value: String(n), label: labelFn ? labelFn(n) : String(n) }));
    const cur = Number(current);
    if (Number.isSafeInteger(cur) && !candidates.includes(cur)) {
      list.unshift({ value: String(cur), label: labelFn ? labelFn(cur) : String(cur) });
    }
    return list;
  };
  const numSelect = (key, candidates, labelFn) => SettingRow({
    label: FIELD_LABELS[key] ?? key,
    desc: FIELD_HELP[key] ?? "",
    control: h("select", {
      className: "qbot-settingSelect",
      value: String(form[key] ?? ""),
      onChange: (event) => void saveField(key, Number(event?.target?.value)),
      "aria-label": FIELD_LABELS[key] ?? key
    }, withCurrent(candidates, form[key], labelFn).map((o) => h("option", { key: o.value, value: o.value }, o.label)))
  });
  const detailBot = React9.useMemo(
    () => bots?.bots.find((b) => b.appId === detailAppId) ?? null,
    [bots, detailAppId]
  );
  const botState = (bot) => {
    if (!bot.enabled) return { tone: "neutral", text: "已停用" };
    return bot.ws?.state === "connected" ? { tone: "success", text: "已连接" } : bot.ws?.state === "connecting" ? { tone: "warning", text: "正在连接" } : { tone: "error", text: "未连接" };
  };
  const globalBadge = (() => {
    const all = bots?.bots ?? [];
    const primary = all.find((b) => b.primary);
    const anyConnected = all.some((b) => b.ws?.state === "connected");
    if (primary?.ws?.state === "connected") return OnlineBadge({ tone: "success", text: "主机器人已连接" });
    if (anyConnected) return OnlineBadge({ tone: "warning", text: "部分机器人已连接" });
    if (all.length) return OnlineBadge({ tone: "error", text: "全部未连接" });
    return OnlineBadge({ tone: "neutral", text: "未配置机器人" });
  })();
  const listView = h(
    "div",
    { className: "qbot-channelPage" },
    loadError ? h("div", { className: "qbot-statusNotice", role: "alert" }, loadError) : null,
    notice ? h("div", { className: "qbot-infoNotice", id: "qbot-notice", role: "status" }, notice) : null,
    h(
      "div",
      { className: "qbot-listHeading" },
      h("h3", null, `已配置机器人（${bots?.bots.length ?? 0}）`),
      h("button", {
        className: "qbot-btn qbot-btnPrimary",
        type: "button",
        onClick: () => {
          setNotice("");
          setPage("add");
        }
      }, "＋ 添加机器人")
    ),
    h(
      "div",
      { className: "qbot-botList" },
      (bots?.bots ?? []).map((bot) => {
        const st = botState(bot);
        return h(
          "button",
          {
            key: bot.appId,
            type: "button",
            className: "qbot-botCard",
            onClick: () => {
              setDetailAppId(bot.appId);
              setNotice("");
              setPage("detail");
            }
          },
          h(
            "div",
            { className: "qbot-botCardBody" },
            h(
              "div",
              { className: "qbot-botTop" },
              h(
                "div",
                { className: "qbot-botIdentity" },
                h("span", { className: "qbot-botAvatar", "aria-hidden": "true" }, h(QqLogoGlyph)),
                h(
                  "div",
                  { className: "qbot-botName" },
                  h("h3", null, bot.appIdMasked),
                  h("p", null, `${bot.source === "qr" ? "扫码接入" : "手动填写"} · 保存于 ${formatTime(bot.savedAt)}`)
                )
              ),
              h(
                "div",
                { className: "qbot-botTools" },
                h(
                  "div",
                  { className: "qbot-botHealthGroup" },
                  StateLabel({ tone: st.tone, text: st.text }),
                  h("span", { className: "qbot-lastChecked" }, bot.primary ? "主机器人" : bot.enabled ? "已启用" : "已停用")
                )
              ),
              h("div", { className: "qbot-botChevron", "aria-hidden": "true" })
            )
          )
        );
      }),
      (bots?.bots.length ?? 0) === 0 ? h(
        "div",
        { className: "qbot-surfaceCard" },
        h(
          "div",
          { className: "qbot-surfaceBody qbot-emptyView" },
          h("div", { className: "qbot-emptyBrand", "aria-hidden": "true" }, h(QqLogoGlyph)),
          h(
            "div",
            { className: "qbot-emptyCopy" },
            h("h3", null, "还没有配置成功的机器人"),
            h("p", null, "点击上方「＋ 添加机器人」，用手机 QQ 扫码，或手动填写 AppID / AppSecret。配置成功后即可在详情中设置行为参数。")
          )
        )
      ) : null,
      h("p", { className: "qbot-hint" }, "点击机器人卡片可进入详情：查看 QQ 连接状态、调整行为配置。")
    )
  );
  const wsInfo = detailBot ? {
    state: String(detailBot.ws?.state ?? "idle"),
    lastConnectedAt: typeof detailBot.ws?.lastConnectedAt === "number" ? detailBot.ws.lastConnectedAt : null,
    lastError: typeof detailBot.ws?.lastError === "string" ? detailBot.ws.lastError : null
  } : null;
  const connState = !detailBot ? { tone: "neutral", text: "未配置" } : detailBot.ws?.state === "connected" ? { tone: "success", text: "运行正常" } : wsInfo?.state === "connecting" ? { tone: "warning", text: "正在连接" } : { tone: "error", text: "连接未就绪" };
  const lastChecked = wsInfo?.lastConnectedAt ? formatTime(wsInfo.lastConnectedAt) : "尚未检查";
  const cardSummary = notice || (detailBot && detailBot.ws?.state !== "connected" ? wsInfo?.lastError ? `QQ 连接未就绪：${wsInfo.lastError}。插件会自动重试。` : "QQ 连接未就绪，插件会自动重试。" : "");
  const WS_LABELS = {
    idle: "空闲",
    connecting: "连接中",
    connected: "已连接",
    reconnecting: "重连中",
    closed: "已断开",
    error: "异常"
  };
  const wsLabel = wsInfo ? WS_LABELS[wsInfo.state] ?? wsInfo.state : "—";
  const wsTone = wsInfo?.state === "connected" ? "success" : wsInfo?.state === "connecting" || wsInfo?.state === "reconnecting" ? "warning" : wsInfo?.state === "closed" || wsInfo?.state === "error" ? "error" : "neutral";
  const sectionCard = (title, desc, body, action, opts) => h(
    "details",
    {
      className: opts?.danger ? "qbot-section is-danger" : "qbot-section",
      open: opts?.open ?? false
    },
    h(
      "summary",
      { className: "qbot-sectionHead" },
      h(
        "div",
        { className: "qbot-sectionTitle" },
        h("h3", null, title),
        h("p", null, desc)
      ),
      action ? h("div", { className: "qbot-sectionAction", onClick: (e) => e.stopPropagation() }, action) : null,
      h("span", { className: "qbot-sectionChevron", "aria-hidden": "true" }, "▸")
    ),
    h("div", { className: "qbot-sectionBody" }, body)
  );
  const metricCard = (label, value, tone) => h(
    "div",
    { className: "qbot-metric", "data-tone": tone, key: label },
    h("span", { className: "qbot-metricLabel" }, label),
    h("strong", { className: "qbot-metricValue" }, value)
  );
  const metrics = detailBot ? (() => {
    const c = detailBot.counters ?? { received: 0, sessions: 0, replies: 0, proactive: 0, errors: 0 };
    const buffered = Array.isArray(detailBot.groupBuffers) ? detailBot.groupBuffers.reduce((n, b) => n + Number(b?.buffered ?? 0), 0) : 0;
    const errors = Number(c.errors ?? 0);
    const pending = Number(detailBot.pendingReplies ?? 0);
    return [
      { label: "收到消息", value: String(c.received ?? 0), tone: "neutral" },
      { label: "创建会话", value: String(c.sessions ?? 0), tone: "neutral" },
      { label: "被动回复", value: String(c.replies ?? 0), tone: "success" },
      { label: "主动消息", value: String(c.proactive ?? 0), tone: "neutral" },
      { label: "绑定会话", value: String(detailBot.boundSessions ?? 0), tone: "neutral" },
      { label: "待回复队列", value: String(pending), tone: pending > 0 ? "warning" : "neutral" },
      { label: "群消息缓冲", value: String(buffered), tone: "neutral" },
      { label: "错误", value: String(errors), tone: errors > 0 ? "error" : "neutral" }
    ];
  })() : [];
  const detailView = h(
    "div",
    { className: "qbot-channelPage" },
    // ── 顶部导航：返回 + 机器人身份（QQ 图标 / 编号 / 启用状态 / 连接状态），整条 sticky 吸顶 ──
    h(
      "div",
      { className: "qbot-detailNav" },
      h("button", { className: "qbot-btn", type: "button", onClick: () => {
        setPage("list");
        setNotice("");
      } }, "← 返回列表"),
      h(
        "div",
        { className: "qbot-detailIdentity" },
        h("span", { className: "qbot-detailAvatar", "aria-hidden": "true" }, h(QqLogoGlyph)),
        h("strong", null, detailBot ? detailBot.appIdMasked : "未选择机器人"),
        detailBot ? h(
          "span",
          { className: `qbot-chip${detailBot.primary ? " is-active" : ""}` },
          detailBot.primary ? "主机器人" : detailBot.enabled ? "已启用" : "已停用"
        ) : null,
        h(
          "span",
          { className: "qbot-onlineBadge qbot-detailNavState" },
          h("span", { className: "qbot-stateDot", "data-tone": connState.tone }),
          connState.text
        )
      )
    ),
    loadError ? h("div", { className: "qbot-statusNotice", role: "alert" }, loadError) : null,
    // ── 概览：机器人身份 + 连接状态 ──
    h(
      "section",
      { className: "qbot-hero" },
      h(
        "div",
        { className: "qbot-heroMain" },
        h("span", { className: "qbot-heroAvatar", "aria-hidden": "true" }, h(QqLogoGlyph)),
        h(
          "div",
          { className: "qbot-heroIdentity" },
          h(
            "div",
            { className: "qbot-heroNameRow" },
            h("h2", null, detailBot ? detailBot.appIdMasked : "未选择机器人"),
            detailBot ? h(
              "span",
              { className: `qbot-chip${detailBot.primary ? " is-active" : ""}` },
              detailBot.primary ? "主机器人" : detailBot.enabled ? "已启用" : "已停用"
            ) : null
          ),
          h(
            "div",
            { className: "qbot-heroMeta" },
            h("span", null, detailBot ? detailBot.source === "qr" ? "扫码接入" : "手动填写" : "—"),
            h("span", { className: "qbot-metaDot", "aria-hidden": "true" }),
            h("span", null, detailBot ? `保存于 ${formatTime(detailBot.savedAt)}` : "—")
          )
        ),
        h(
          "div",
          { className: "qbot-heroActions" },
          h("button", {
            className: "qbot-btn",
            type: "button",
            disabled: !detailBot,
            onClick: () => setScheduleOpen(true)
          }, "定时消息"),
          h("button", {
            className: "qbot-btn",
            type: "button",
            disabled: !detailBot,
            onClick: () => setArchiveOpen(true)
          }, "消息归档")
        )
      ),
      h(
        "div",
        { className: "qbot-heroStats" },
        h(
          "div",
          { className: "qbot-heroStat" },
          h("span", { className: "qbot-heroStatLabel" }, "连接状态"),
          h(
            "div",
            { className: "qbot-heroStatValue" },
            h("span", { className: "qbot-stateDot", "data-tone": connState.tone }),
            h("strong", null, connState.text)
          )
        ),
        h(
          "div",
          { className: "qbot-heroStat" },
          h("span", { className: "qbot-heroStatLabel" }, "WebSocket"),
          h(
            "div",
            { className: "qbot-heroStatValue" },
            h("span", { className: "qbot-stateDot", "data-tone": wsTone }),
            h("strong", null, wsLabel)
          )
        ),
        h(
          "div",
          { className: "qbot-heroStat" },
          h("span", { className: "qbot-heroStatLabel" }, "最近连接"),
          h("div", { className: "qbot-heroStatValue" }, h("strong", null, lastChecked))
        )
      ),
      cardSummary ? h("div", { className: "qbot-heroFoot", id: "qbot-notice", role: "status" }, cardSummary) : null
    ),
    // ── 运行统计（持久化：跨重启累计，stats/<appId>.json；可复位清零） ──
    status ? sectionCard(
      "运行统计",
      "该机器人的持久运行计数（重启不清零）；数值不会自动刷新，需要时点「刷新」。",
      h(
        "div",
        { className: "qbot-metricGrid" },
        metrics.map((m) => metricCard(m.label, m.value, m.tone))
      ),
      h(
        "div",
        { className: "qbot-sectionActions" },
        h("button", {
          className: "qbot-btn",
          type: "button",
          disabled: refreshing,
          onClick: () => void refreshStats()
        }, refreshing ? "刷新中…" : "刷新"),
        h("button", {
          className: "qbot-btn qbot-btnDanger",
          type: "button",
          disabled: resetting || refreshing,
          title: "把该机器人的运行计数清零（立即生效并落盘）",
          onClick: () => void resetStats()
        }, resetting ? "复位中…" : "复位")
      )
    ) : null,
    // ── 会话与模型 ──
    sectionCard(
      "会话与模型",
      "决定这个机器人以什么身份、在哪个目录、用哪个模型干活；每个机器人彼此独立，改动只对之后新建的会话生效。",
      h(
        "div",
        { className: "qbot-settingList" },
        // 工作区：路径较长，独占一行展示
        h(
          "div",
          { className: "qbot-workspaceCard" },
          h(
            "div",
            { className: "qbot-workspaceCardHead" },
            h(
              "div",
              { className: "qbot-settingCopy" },
              h("span", { className: "qbot-settingTitle" }, "工作区目录"),
              h(
                "span",
                { className: "qbot-settingDesc" },
                "QQ 消息创建的会话都在这个目录里读写文件。留空则使用默认工作区；改动只对新建会话生效。"
              )
            ),
            h("button", { className: "qbot-btn", type: "button", onClick: () => setPickerOpen(true) }, "选择目录")
          ),
          h(
            "code",
            { className: "qbot-workspacePath", title: String(form.workspacePath ?? "") },
            String(form.workspacePath ?? "").trim() || "默认工作区（~/.dsh/file）"
          )
        ),
        SettingRow({
          label: "模型",
          desc: "这个机器人会话使用的模型；留空则跟随宿主默认模型。切换后已有会话需要重置才会生效。",
          control: h(
            "select",
            {
              className: "qbot-settingSelect",
              value: String(form.model ?? ""),
              onChange: (e) => void saveField("model", e.target.value),
              "aria-label": "模型"
            },
            h("option", { value: "" }, "跟随默认模型"),
            modelGroups().map((g) => h(
              "optgroup",
              { key: g.label, label: g.label },
              g.options.map((o) => h("option", { key: o.value, value: o.value }, o.label))
            ))
          )
        }),
        SettingRow({
          label: "Agent Preset",
          desc: "决定机器人的行事风格与可用工具。@ 机器人和单聊消息都走这个 Preset；群里非 @ 的回复走聊天 Preset（默认跟随本 Preset，仅可在 bots.json 配置），不会执行工具。",
          control: h("select", {
            className: "qbot-settingSelect",
            value: String(form.agentPreset ?? ""),
            onChange: (e) => void saveField("agentPreset", e.target.value),
            "aria-label": "Agent Preset"
          }, presetOptions(catalogs.agentPresets).map((o) => h("option", { key: o.value, value: o.value }, o.label)))
        })
        // 群聊聊天 Preset（agentPresetChat）与 AppSecret 凭据引用（secretEnv）已从界面移除，
        // 仅通过 bots.json 配置——默认 agentPresetChat 留空即跟随上方 Agent Preset（见 rule.ts）。
      )
    ),
    // ── 消息与回复策略（开关） ──
    sectionCard(
      "消息与回复策略",
      "控制这个机器人「听哪些消息、怎么回」，每个机器人彼此独立。所有开关改完立即生效，不需要重启。",
      h(
        "div",
        { className: "qbot-settingList" },
        SWITCH_DEFS.map((it) => SettingRow({
          rowKey: it.key,
          label: it.label,
          desc: it.desc,
          control: h("input", {
            type: "checkbox",
            className: "qbot-switch",
            checked: Boolean(form[it.key] ?? it.def),
            onChange: (e) => void saveField(it.key, e.target.checked),
            "aria-label": it.label
          })
        })),
        SettingRow({
          rowKey: "quoteReply",
          label: "回复引用原话",
          desc: "回复以 QQ 原生引用卡片定位到用户那条原消息（message_reference，走主动消息通道发送，不与 msg_id 同传——手机端两者同传会堆叠重复引用）。仅群聊生效，单聊一律不引用：off=不引用；at=仅群 @ 回复（推荐）；all=群聊全部回复。卡片发送失败时自动降级为普通被动回复（无卡片，内容不丢）。此外，用户引用聊天里某条消息时，被引用的原文会始终注入模型上下文，让它知道对方在回应什么。",
          control: h(
            "select",
            {
              className: "qbot-settingSelect",
              value: String(form.quoteReply ?? "at"),
              onChange: (e) => void saveField("quoteReply", e.target.value),
              "aria-label": "回复引用原话范围"
            },
            h("option", { value: "off" }, "off（不引用）"),
            h("option", { value: "at" }, "at（仅群 @，推荐）"),
            h("option", { value: "all" }, "all（群聊全部回复）")
          )
        }),
        // 语音相关配置（语音消息处理 / ASR / STT / TTS）已从界面移除，仅通过 bots.json 配置——
        // 详见 meta.ts SWITCH_DEFS 顶部注释。
        SettingRow({
          rowKey: "replyLocale",
          label: "回复语言（replyLocale）",
          desc: "机器人直接发给 QQ 用户的系统文案（/help、/status、定时消息用法、欢迎语等）使用的语言。中文为源语言；选择 English 时这些文案自动翻译为英文，未命中的内容保持原文不丢信息。AI 对话内容本身不受影响。",
          control: h(
            "select",
            {
              className: "qbot-settingSelect",
              value: String(form.replyLocale ?? "zh"),
              onChange: (e) => void saveField("replyLocale", e.target.value),
              "aria-label": "回复语言"
            },
            h("option", { value: "zh" }, "中文（默认）"),
            h("option", { value: "en" }, "English")
          )
        }),
        // 欢迎语开关与文案已从界面移除（默认开启），仅通过 bots.json 配置 welcomeEnabled / welcomeMessage。
        SettingRow({
          rowKey: "bannedWords",
          wide: true,
          label: "敏感词列表",
          desc: "逗号分隔。群消息包含其中任意一词时，机器人撤回该消息并跳过回复（需要消息撤回权限；无权限时仅拦截回复）。",
          control: TextArea({
            rows: 3,
            defaultValue: Array.isArray(form.bannedWords) ? form.bannedWords.join(", ") : "",
            placeholder: "词1, 词2（留空不启用）",
            onBlur: (e) => {
              const words = String(e?.target?.value ?? "").split(/[,，]/).map((w) => w.trim()).filter(Boolean);
              void saveField("bannedWords", words);
            },
            "aria-label": "敏感词列表"
          })
        })
      )
    ),
    // ── 回复调优（数值） ──
    sectionCard(
      "回复调优",
      "调节这个机器人「回得多不多、切得多碎」，每个机器人彼此独立。改完立即生效，建议先按默认值跑一段时间再微调。",
      h(
        "div",
        { className: "qbot-settingList" },
        numSelect("valueThreshold", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (n) => n === 0 ? "0（全部回复）" : `${n} 分`),
        numSelect("atContextMessages", [0, 2, 4, 6, 8, 10, 15, 20, 30, 50], (n) => n === 0 ? "0（关闭）" : `${n} 条`),
        numSelect("groupCooldownMs", COOLDOWN_OPTIONS, cooldownLabel),
        numSelect("senderCooldownMs", COOLDOWN_OPTIONS, cooldownLabel),
        numSelect("replyChunkChars", [200, 300, 500, 800, 1e3, 1500, 2e3, 3e3, 4e3]),
        numSelect("maxRepliesPerMessage", [1, 2, 3, 4, 5]),
        numSelect("quoteMaxChars", [40, 60, 80, 100, 120, 160, 200, 300, 500], (n) => `${n} 字`),
        numSelect("quotaPerDay", [0, 10, 20, 30, 50, 100, 200, 500], (n) => n === 0 ? "0（不限）" : `${n} 条/天`)
      ),
      void 0
    ),
    // ── 按群配置（群级覆盖） ──
    sectionCard(
      "按群配置",
      "为特定群单独覆盖行为配置（阈值/冷却/敏感词/上下文等），其余字段跟随机器人默认。适合把某一个群调得更活跃或更安静，而不影响其他群。",
      h(
        "div",
        { className: "qbot-settingList" },
        Object.keys(groupOverrides).length === 0 ? h("div", { className: "qbot-modalState" }, "还没有按群覆盖配置，所有群都使用上方机器人默认配置。") : Object.entries(groupOverrides).map(([openid, ov]) => h(
          "div",
          { key: openid, className: "qbot-schedRow" },
          h(
            "div",
            { className: "qbot-schedMain" },
            h(
              "div",
              { className: "qbot-schedTop" },
              h("span", { className: "qbot-chip is-active" }, "群"),
              h(
                "code",
                { className: "qbot-mono", title: openid },
                `${openid.slice(0, 12)}${openid.length > 12 ? "…" : ""}`
              )
            ),
            h("div", { className: "qbot-schedContent" }, overrideSummary(ov))
          ),
          h(
            "div",
            { className: "qbot-schedOps" },
            h("button", { className: "qbot-btn qbot-schedEdit", type: "button", onClick: () => setOverrideEdit(openid) }, "编辑"),
            h("button", { className: "qbot-btn qbot-btnDanger", type: "button", onClick: () => void removeOverride(openid) }, "删除")
          )
        )),
        h(
          "div",
          { className: "qbot-editActions" },
          h("span", { className: "qbot-hint" }, "覆盖字段未设置时跟随机器人默认；全部清空并保存即删除该群覆盖。"),
          h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: () => setOverrideEdit("") }, "添加群覆盖")
        )
      ),
      void 0
    ),
    // ── 连接与移除 ──
    sectionCard(
      "连接与移除",
      "管理机器人的启用状态、设为主机器人、重建 QQ 长连接，或删除接入配置。",
      h(
        "div",
        { className: "qbot-settingList" },
        detailBot ? SettingRow({
          label: detailBot.enabled ? "停用此机器人" : "启用此机器人",
          desc: "停用的机器人不会建立 QQ 长连接，也不会接收或回复消息；其它已启用的机器人不受影响。",
          control: h("button", {
            className: "qbot-btn",
            type: "button",
            disabled: detailBot.primary,
            onClick: () => void toggleEnabled(detailBot, !detailBot.enabled)
          }, detailBot.enabled ? "停用" : "启用")
        }) : null,
        detailBot && !detailBot.primary ? SettingRow({
          label: "设为主机器人",
          desc: "未显式指定机器人时（配置编辑、主动消息、定时任务），默认作用于主机器人。所有「已启用」的机器人都会同时接收并回复消息。",
          control: h("button", {
            className: "qbot-btn",
            type: "button",
            onClick: () => void setPrimaryBot(detailBot.appId)
          }, "设为主机器人")
        }) : null,
        SettingRow({
          label: detailBot?.ws?.state === "connected" ? "检查连接" : "重试连接",
          desc: "按当前凭据重新建立 QQ WebSocket 长连接。收不到消息时先点它排查。",
          control: h("button", {
            className: "qbot-btn",
            type: "button",
            disabled: reconnecting || !detailBot,
            onClick: () => void retryConnection()
          }, reconnecting ? "检查中…" : detailBot?.ws?.state === "connected" ? "检查连接" : "重试连接")
        }),
        detailBot ? SettingRow({
          label: "移除接入",
          desc: "删除这个机器人的凭据与配置，删除后它会立刻停止接收消息，且无法撤销。",
          control: h("button", {
            className: "qbot-btn qbot-btnDanger",
            type: "button",
            onClick: () => void removeBot(detailBot)
          }, "移除接入")
        }) : null
      ),
      void 0,
      { danger: true }
    )
  );
  const addBotView = h(AddBotView, {
    rpcCall,
    notice,
    setNotice,
    onBotReady: async (appId) => {
      await refresh();
      setDetailAppId(appId);
      setPage("detail");
    },
    onBack: () => setPage("list")
  });
  return h(
    "section",
    { className: "qbot-page", "aria-label": "QQ 机器人设置" },
    h(
      "header",
      { className: "qbot-title" },
      h(
        "div",
        { className: "qbot-brand" },
        h(QqBotGlyph, { className: "qbot-brandGlyph", uid: "brand" }),
        h(
          "div",
          { className: "qbot-brandText" },
          h(
            "div",
            { className: "qbot-brandHeading" },
            h("strong", { className: "qbot-brandName" }, "QQ 机器人"),
            h("span", { className: "qbot-brandVersion" }, `v${true ? "0.1.3" : "0.0.2"}`),
            h("button", {
              className: `qbot-btn qbot-updateBtn${update.done ? " is-done" : ""}`,
              type: "button",
              disabled: update.busy,
              title: "从 GitHub 检查新版本；发现新版本会自动下载并更新，重启 DSH 后生效",
              onClick: () => void runUpdateCheck()
            }, update.busy ? "检查中…" : update.done ? "已更新 ✓" : "检查更新")
          ),
          h("p", null, "把 QQ 机器人接入 DeepSeek Harness")
        )
      ),
      h("div", { className: "qbot-titleActions" }, globalBadge)
    ),
    update.message ? h("div", { className: "qbot-infoNotice qbot-updateNotice", role: "status" }, update.message) : null,
    h(
      "div",
      { className: "qbot-panel", id: "qbot-panel" },
      page === "list" ? listView : page === "add" ? addBotView : detailView
    ),
    pickerOpen ? h(WorkspacePickerDialog, {
      rpcCall,
      initialPath: String(form.workspacePath ?? "").trim(),
      onClose: () => setPickerOpen(false),
      onPick: (dir) => {
        setPickerOpen(false);
        void (async () => {
          await saveField("workspacePath", dir);
          setNotice(`工作区已保存：${dir}（对新建会话生效）`);
        })();
      }
    }) : null,
    // ── 定时消息管理弹窗（自包含组件） ──
    scheduleOpen ? h(ScheduleDialog, { rpcCall, detailAppId, onClose: () => setScheduleOpen(false) }) : null,
    // ── 按群配置（群级覆盖）编辑弹窗 ──
    overrideEdit !== null ? h(OverrideDialog, {
      overrides: groupOverrides,
      editOpenid: overrideEdit,
      rpcCall,
      appId: detailAppId,
      onClose: () => setOverrideEdit(null),
      onSave: async (next, openid) => {
        const r = await saveField("groupOverrides", next);
        if (!r.ok) return r;
        const short = `${openid.slice(0, 10)}${openid.length > 10 ? "…" : ""}`;
        if (next[openid]) {
          const saved = r.data?.groupOverrides ?? {};
          if (!(openid in saved)) {
            const message = `保存未生效：群 ${short} 的覆盖未写入配置，请重试`;
            setNotice(message);
            return { ok: false, error: message };
          }
        }
        setNotice(`群 ${short} 的覆盖配置已保存（立即生效）`);
        return { ok: true };
      }
    }) : null,
    // ── 消息归档弹窗（自包含组件） ──
    archiveOpen ? h(ArchiveDialog, { rpcCall, detailAppId, onClose: () => setArchiveOpen(false) }) : null,
    // ── 全局自定义确认框（window.confirm 的替代，置顶于所有弹窗） ──
    h(ConfirmHost, null)
  );
}
function apply(ctx) {
  ctx.effect(
    () => ctx.locale?.register?.(QQBOT_LOCALE_NAMESPACE, { zh, en }),
    "qqbot-settings: locale dictionaries"
  );
  const t = ctx.locale?.bind?.(QQBOT_LOCALE_NAMESPACE);
  setTranslator(typeof t === "function" ? t : void 0);
  const rpcCall = async (endpoint, payload, signal) => {
    const raw = await ctx.connection.rpc.call(RPC_CHANNEL, endpoint, payload ?? {}, signal);
    if (raw && typeof raw === "object" && "code" in raw && !("ok" in raw)) {
      const r = raw;
      const msg = typeof r.message === "string" && r.message ? r.message : typeof r.code === "string" ? r.code : "RPC 调用失败";
      return { ok: false, error: msg };
    }
    return raw;
  };
  ctx.effect(() => installStyles(), "qqbot-settings: styles");
  ctx.slots.inject("settings.section", () => ctx.slots.register(
    {
      name: "settings.section",
      id: "dsh-qqbot",
      order: 31,
      label: () => h(
        "span",
        { className: "qbot-navLabel" },
        h(QqBotGlyph, { className: "qbot-navGlyph", uid: "nav" }),
        h("span", { className: "qbot-navText" }, localizeText("QQ 机器人"))
      ),
      inject: () => ({ rpcCall })
    },
    QqbotSettingsTab
  ));
}
function installStyles() {
  if (typeof document === "undefined") return () => {
  };
  const existing = document.querySelector('style[data-plugin-css="dsh-qqbot"]');
  if (existing) return () => {
  };
  const style = document.createElement("style");
  style.dataset.plugin = "@sunjuntao/dsh-qqbot";
  style.dataset.pluginCss = "dsh-qqbot";
  style.textContent = CSS_TEXT;
  document.head.append(style);
  return () => style.remove();
}
		module.exports = { name, apply, inject };
		return module.exports;
	}
});

