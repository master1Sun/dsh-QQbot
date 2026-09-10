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

// src/client/i18n/index.ts
var React = __toESM(require("react"), 1);

// src/client/i18n/dict.ts
var cn = Object.freeze({
  // ── common ──
  "common.unknownError": "未知错误",
  "common.statusReadFailed": "状态读取失败",
  "common.rpcFailed": "RPC 调用失败",
  "common.unlimited": "不限制",
  "common.close": "关闭",
  "common.cancel": "取消",
  "common.ok": "确定",
  "common.confirmTitle": "确认操作",
  "common.confirmDelete": "确认删除",
  "common.confirmDisable": "确认禁用",
  "common.refresh": "刷新",
  "common.refreshing": "刷新中…",
  "common.loading": "加载中…",
  "common.reset": "复位",
  "common.resetting": "复位中…",
  "common.note": "说明",
  "common.saving": "保存中…",
  "common.edit": "编辑",
  "common.create": "创建",
  "common.delete": "删除",
  "common.saveFailed": "保存失败，请稍后重试",
  "common.save": "保存",
  "common.test": "测试",
  "common.testing": "测试中…",
  "common.runFailed": "执行失败",
  // ── notice ──
  "notice.setPrimary": "已设为主机器人",
  "notice.botEnabled": "机器人已启用",
  "notice.botDisabled": "机器人已停用",
  "notice.botRemoved": "机器人已删除",
  "notice.reconnectStarted": "已重新发起连接，请稍候查看状态",
  "notice.lastFailedPrefix": "上次失败：",
  "notice.qrLinked": "扫码成功，AppID {0} 已启用",
  "notice.credentialsSaved": "凭据已保存，AppID {0} 已启用",
  "notice.saveFailedPrefix": "保存失败：{0}",
  "notice.operationFailedPrefix": "操作失败：{0}",
  "notice.removeFailedPrefix": "删除失败：{0}",
  "notice.retryFailedPrefix": "重试失败：{0}",
  "notice.checkFailedPrefix": "检查失败：{0}",
  "notice.updateFailedPrefix": "更新失败：{0}",
  "notice.testSendFailedPrefix": "测试发送失败：{0}",
  "notice.lastGenFailedPrefix": "上次生成失败：{0}",
  "notice.workspaceSavedPrefix": "工作区已保存：{0}（对新建会话生效）",
  "notice.groupOverrideSaved": "群 {0} 的覆盖配置已保存（立即生效）",
  "notice.groupOverrideSaveNoEffect": "保存未生效：群 {0} 的覆盖未写入配置，请重试",
  "notice.archiveReadFailed": "归档读取失败：{0}（可直接粘贴 openid）",
  "notice.qqNotReadyDetail": "QQ 连接未就绪：{0}。插件会自动重试。",
  "notice.sourceSavedAt": "{0} · 保存于 {1}",
  "notice.savedAtPrefix": "保存于 {0}",
  "notice.currentSuffix": "{0}（当前）",
  "notice.scriptGenerated": "已生成脚本：{0}。修改描述词并保存会重新生成。",
  "notice.lastGenFailedRetry": "上次生成失败：{0}。重新保存即重试。",
  // ── session ──
  "session.model": "模型",
  "session.followHostDefault": "跟随 Host 默认",
  "session.title": "会话与模型",
  "session.hint": "决定这个机器人以什么身份、在哪个目录、用哪个模型干活；每个机器人彼此独立，改动只对之后新建的会话生效。",
  "session.workspace": "工作区目录",
  "session.workspaceHint": "QQ 消息创建的会话都在这个目录里读写文件。留空则使用默认工作区；改动只对新建会话生效。",
  "session.chooseDir": "选择目录",
  "session.defaultWorkspace": "默认工作区（~/.dsh/file）",
  "session.modelHint": "这个机器人会话使用的模型；留空则跟随宿主默认模型。切换后已有会话需要重置才会生效。",
  "session.followDefaultModel": "跟随默认模型",
  "session.presetHint": "决定机器人的行事风格与可用工具。@ 机器人和单聊消息都走这个 Preset；群里非 @ 的回复走聊天 Preset（默认跟随本 Preset，仅可在 bots.json 配置），不会执行工具。",
  // ── status ──
  "status.disabled": "已停用",
  "status.connected": "已连接",
  "status.connecting": "正在连接",
  "status.disconnected": "未连接",
  "status.primaryConnected": "主机器人已连接",
  "status.someConnected": "部分机器人已连接",
  "status.allDisconnected": "全部未连接",
  "status.noBot": "未配置机器人",
  "status.primaryBot": "主机器人",
  "status.enabled": "已启用",
  "status.notConfigured": "未配置",
  "status.running": "运行正常",
  "status.notReady": "连接未就绪",
  "status.unchecked": "尚未检查",
  "status.qqNotReadyDefault": "QQ 连接未就绪，插件会自动重试。",
  "status.idle": "空闲",
  "status.connectingShort": "连接中",
  "status.reconnecting": "重连中",
  "status.disconnectedShort": "已断开",
  "status.error": "异常",
  "status.localTimeZone": "本机时区",
  "status.configuredBots": "已配置机器人（{0}）",
  // ── list ──
  "list.addBot": "＋ 添加机器人",
  "list.empty": "还没有配置成功的机器人",
  "list.emptyHint": "点击上方「＋ 添加机器人」，用手机 QQ 扫码，或手动填写 AppID / AppSecret。配置成功后即可在详情中设置行为参数。",
  "list.cardHint": "点击机器人卡片可进入详情：查看 QQ 连接状态、调整行为配置。",
  // ── qr ──
  "qr.tabScan": "扫码接入",
  "qr.tabManual": "手动填写",
  "qr.linked": "绑定成功",
  "qr.failed": "扫码失败",
  "qr.refreshing": "正在刷新二维码",
  "qr.waitingScan": "等待手机 QQ 扫码",
  "qr.notGenerated": "二维码未生成",
  "qr.alt": "用于绑定 QQ 机器人的一次性二维码",
  "qr.refreshingNow": "正在刷新二维码…",
  "qr.noQrYet": "还没有生成二维码",
  "qr.soonNewQr": "几秒后会自动出现新的一张",
  "qr.clickGenerate": "点击下方「生成二维码」开始",
  "qr.validFor": "二维码有效时间",
  "qr.regenerate": "重新生成二维码",
  "qr.generate": "生成二维码",
  "qr.cancelScan": "取消扫码",
  "qr.title": "手机 QQ 扫码接入",
  "qr.intro": "推荐方式。扫码后 QQ 会把机器人的 AppID 与 AppSecret 直接下发给本机 dsh，不需要手动复制，保存后立即生效。",
  "qr.steps": "操作步骤",
  "qr.step1": "点击二维码下方的「生成二维码」，出现二维码后开始 5 分钟倒计时。",
  "qr.step2": "打开手机 QQ，从右上角「＋」菜单进入「扫一扫」，扫描这张二维码。",
  "qr.step3": "按 QQ 页面提示完成确认，把这个机器人授权给本机 dsh 使用。",
  "qr.step4": "本页每 2 秒检查一次结果，绑定成功后会自动进入机器人详情页。",
  "qr.note1": "二维码 5 分钟内有效；过期后会自动换一张新的，不需要手动刷新页面。",
  "qr.note2": "扫码期间请保持本设置页打开，关闭页面会中断等待。",
  "qr.note3": "凭据会写入 ~/.dsh/qqbot/credentials.json（仅当前用户可读），写入后立即生效，不需要重启 dsh。",
  "qr.stepTitleScan": "手机 QQ 扫一扫",
  "qr.stepTitleConfirm": "在 QQ 里确认绑定",
  "qr.stepTitleRedirect": "等待自动跳转",
  // ── manual ──
  "manual.title": "手动填写 AppID / AppSecret",
  "manual.intro": "适合已经在 QQ 开放平台创建过机器人的情况：先从开放平台把凭据复制出来，再回到这里填写保存。",
  "manual.step1Title": "第 1 步 · 在 QQ 开放平台取得凭据",
  "manual.openPlatform": "打开 QQ 开放平台",
  "manual.step1a": "浏览器访问 q.qq.com，用 QQ 登录。",
  "manual.pickBot": "选择机器人",
  "manual.step1b": "在机器人列表里点开要接入的机器人；还没有的话先创建一个。",
  "manual.copyCreds": "复制 AppID 与 AppSecret",
  "manual.step1c": "进入该机器人的「开发设置」页面，复制 AppID（机器人 ID）与 AppSecret（机器人密钥）。",
  "manual.step2Title": "第 2 步 · 填到这里并保存",
  "manual.appIdPlaceholder": "机器人 ID",
  "manual.appSecretPlaceholder": "开发设置里的机器人密钥",
  "manual.saveAndEnable": "保存并启用",
  "manual.note1": "保存后凭据写入 ~/.dsh/qqbot/credentials.json（权限 0600），立即生效，并自动设为当前使用的机器人。",
  "manual.note2": "这里不会校验凭据是否正确。保存后请到机器人详情看「连接状态」：显示「运行正常」才是接通；未就绪就点「重试连接」。",
  "manual.note3": "消息接收走 WebSocket 长连接，开放平台不需要填回调地址；但机器人回复要走 OpenAPI，需要把本机出口 IP 加进开放平台的 IP 白名单。",
  "manual.note4": "AppSecret 保存后不再回显；需要更换时重新填一次保存即可覆盖。",
  // ── add ──
  "add.backToList": "← 返回列表",
  "add.title": "添加机器人",
  "add.intro": "两种方式任选其一：扫码由 QQ 自动下发凭据；手动填写需要你先去 QQ 开放平台复制 AppID / AppSecret。接入成功后凭据立即生效，并自动成为当前使用的机器人。",
  // ── detail ──
  "detail.noneSelected": "未选择机器人",
  "detail.connectionStatus": "连接状态",
  "detail.lastConnected": "最近连接",
  // ── app ──
  "app.title": "QQ 机器人",
  "app.settingsTitle": "QQ 机器人设置",
  "app.subtitle": "把 QQ 机器人接入 DeepSeek Harness",
  // ── stats ──
  "stats.title": "运行统计",
  "stats.hint": "该机器人的持久运行计数（重启不清零）；数值不会自动刷新，需要时点「刷新」。",
  "stats.resetHint": "把该机器人的运行计数清零（立即生效并落盘）",
  "stats.received": "收到消息",
  "stats.sessions": "创建会话",
  "stats.passive": "被动回复",
  "stats.proactive": "主动消息",
  "stats.bound": "绑定会话",
  "stats.pendingQueue": "待回复队列",
  "stats.groupBuffer": "群消息缓冲",
  "stats.errors": "错误",
  // ── policy ──
  "policy.title": "消息与回复策略",
  "policy.hint": "控制这个机器人「听哪些消息、怎么回」，每个机器人彼此独立。所有开关改完立即生效，不需要重启。",
  "policy.fullGroupReply": "群全量消息回复",
  "policy.fullGroupReplyHint": "开启后，群里没有 @ 机器人的消息也会参与价值评分，达到阈值才回复；@ 机器人的消息始终回复并可使用工具。关闭后，机器人只处理 @ 它的群消息。",
  "policy.acceptDm": "接受单聊消息",
  "policy.acceptDmHint": "是否响应 QQ 私聊（C2C）消息。关闭后机器人只处理群消息，私聊一律忽略。",
  "policy.respondBots": "响应机器人消息",
  "policy.respondBotsHint": "开启后，其他机器人发出的消息也会触发本机器人回复。默认关闭：其他机器人的消息一律忽略，防止同群的多个机器人互相触发、循环刷屏。注意 QQ 平台在群聊里通常不向机器人推送其他机器人的消息，此开关只在平台确实推送时才有实际效果。",
  "policy.markdown": "Markdown 回复",
  "policy.markdownHint": "优先以 QQ Markdown 格式发送，排版更好看；若平台拒绝该格式，会自动降级为纯文本重发，不会丢消息。",
  "policy.quote": "回复引用原话",
  "policy.quoteHint": "回复以 QQ 原生引用卡片定位到用户那条原消息（message_reference，走主动消息通道发送，不与 msg_id 同传——手机端两者同传会堆叠重复引用）。仅群聊生效，单聊一律不引用：off=不引用；at=仅群 @ 回复（推荐）；all=群聊全部回复。卡片发送失败时自动降级为普通被动回复（无卡片，内容不丢）。此外，用户引用聊天里某条消息时，被引用的原文会始终注入模型上下文，让它知道对方在回应什么。",
  "policy.quoteScope": "回复引用原话范围",
  "policy.quoteScopeOff": "off（不引用）",
  "policy.quoteScopeAt": "at（仅群 @，推荐）",
  "policy.quoteScopeAll": "all（群聊全部回复）",
  "policy.quoteLimit": "引用字数上限",
  "policy.quoteLimitHint": "文本引用最多显示多少字（仅主动消息回退为文本引用时使用；原生引用气泡由 QQ 客户端自行截断），超出部分以省略号结尾。",
  "policy.chatPreset": "群聊聊天 Preset",
  "policy.chatPresetHint": "群内非 @ 的全量消息（只聊天、不执行工具）使用的 Preset；留空则跟随上方 Agent Preset。用于让群全量回复风格与 @/单聊区分开。",
  "policy.followAgentPreset": "跟随 Agent Preset",
  "policy.secretEnv": "AppSecret 凭据引用（secretEnv）",
  "policy.secretEnvShort": "AppSecret 凭据引用",
  "policy.secretEnvHint": "DSH 凭据引用作为 AppSecret 的替代来源（优先级高于明文 AppSecret）。填写后机器人在运行时凭此引用解析出真实密钥，无需在开放平台明文保存。留空则使用扫码/手动填写的 AppSecret。",
  "policy.secretEnvPlaceholder": "如 my-qq-app-secret（留空不启用）",
  // ── quota ──
  "quota.daily": "主动消息日配额",
  "quota.dailyHint": "本机器人单日最多发送多少条主动消息（定时消息、欢迎语、出箱补发、AI 发图都计入）。每个机器人独立计数、互不挤占。0 表示不限制——但 QQ 平台主动消息配额极少，超发会被限流，建议保持默认 50。",
  "quota.unlimitedZero": "0（不限）",
  // ── feature ──
  "feature.multimodal": "多模态消息",
  "feature.multimodalHint": "群里/私聊发来的图片、文件、语音会以附件形式注入会话上下文：视觉模型可以直接看图，语音优先使用平台自带转写文本。关闭后非文字内容只保留占位说明。",
  "feature.memory": "长期记忆",
  "feature.memoryHint": "每个群/单聊维护一份持久记忆（跨 /new 保留）。对话里说「记住某事」AI 会自动写入；用 /记忆 查看、/清空记忆 清空。",
  "feature.welcome": "欢迎语",
  "feature.welcomeHint": "新成员进群或新好友添加时，机器人自动发送欢迎语（文案见下方输入框，{nick} 会替换为对方标识）。走主动消息通道，消耗每日配额。",
  "feature.emojiRecall": "表情撤回",
  "feature.emojiRecallHint": "任何人对机器人发出的消息点 🗑️ 表情回应，机器人就撤回那条消息（需要平台的「消息撤回」权限）。",
  "feature.buttonApproval": "按钮审批",
  "feature.buttonApprovalHint": "AI 执行敏感操作前可发送「✅允许 / ❌拒绝」按钮消息，点击即回传决定；超时未点击视为拒绝。审批消息占用主动消息配额。",
  "feature.fileContent": "文件内容识别",
  "feature.fileContentHint": "收到文本类文件（txt/md/json/csv/代码等，≤1MB）时自动下载并截取正文注入模型上下文，AI 直接读懂文件内容再回复；二进制文件（docx/pdf 等）仅列文件名。需配合「附件转发」开关。",
  "feature.welcomeText": "欢迎语文案",
  "feature.welcomeTextHint": "开启「欢迎语」后发送的内容；{nick} 会替换为新成员标识。留空使用默认文案「欢迎 {nick}！@我即可与我对话。」。",
  "feature.welcomeDefault": "欢迎 {nick}！@我即可与我对话。",
  "feature.bannedWords": "敏感词列表",
  "feature.bannedWordsHint": "逗号分隔。群消息包含其中任意一词时，机器人撤回该消息并跳过回复（需要消息撤回权限；无权限时仅拦截回复）。",
  "feature.bannedWordsPlaceholder": "词1, 词2（留空不启用）",
  "feature.passiveFallback": "被动失败转主动消息",
  "feature.passiveFallbackHint": "被动回复超时或失败时，改用主动消息接口补发一次。主动消息每日配额极少，仅在排查问题时临时开启。",
  "feature.archive": "消息本地归档",
  "feature.archiveHint": "把收到的消息与发出的回复写入 ~/.dsh/qqbot/archive/，作为审计轨迹留档，方便事后排查。",
  "feature.sanitizeReply": "回复内容净化",
  "feature.sanitizeReplyHint": "发送前剥离模型输出里的 system-reminder、<think> 等隐藏标签块，防止内部提示词与推理过程泄漏给聊天对象。仅影响发送内容，归档与模型上下文保留原文。",
  "feature.ssrfGuard": "媒体链接安全校验（SSRF 防护）",
  "feature.ssrfGuardHint": "AI 发图/发文件/发语音时，校验 URL 不指向内网或保留地址（127.0.0.1、192.168.x.x、169.254 元数据等），QQ 官方域名直通。防止模型被诱导让本机请求内网服务。关闭后仅要求 http/https 协议。",
  "feature.pathWhitelist": "本地文件路径白名单",
  "feature.pathWhitelistHint": "AI 发图/发文件/发语音时，本机路径必须位于工作区目录或插件数据目录内，防止把任意本机文件（如凭据、密钥）发送给聊天对象。关闭后允许任意本机路径（不推荐）。",
  // ── voice ──
  "voice.title": "语音消息处理",
  "voice.hint": "收到语音消息时如何处理：off=忽略；note=使用平台自带的转写文本（推荐，无转写时显示占位）；download=把音频地址注入上下文；asr=调用下方自定义转写服务（POST {url} → {text}）；stt=下载语音本地转码后调用 OpenAI 兼容 /audio/transcriptions 转写（失败自动回退平台转写文本）。",
  "voice.mode": "语音消息处理方式",
  "voice.modeOff": "off（忽略语音）",
  "voice.modeNote": "note（平台转写，推荐）",
  "voice.modeStt": "stt（STT 服务自动转写）",
  "voice.modeDownload": "download（注入音频地址）",
  "voice.modeAsr": "asr（自定义转写服务）",
  "voice.asrTitle": "自定义转写服务",
  "voice.asrHint": "voiceTranscription=asr 时使用的 HTTP 服务地址：机器人 POST { url: <音频地址> }，服务返回 { text: <转写文本> }。留空则回退为占位说明。",
  "voice.urlPlaceholder": "https://…（留空不启用）",
  "voice.asrUrl": "自定义转写服务地址",
  "voice.sttBaseUrl": "STT 服务地址（Base URL）",
  "voice.sttBaseUrlHint": "voiceTranscription=stt 时使用，OpenAI 兼容的接口根地址（不含 /audio/transcriptions 后缀）。语音会先下载到本地（SILK 自动转 WAV）再上传转写。",
  "voice.sttBaseUrlShort": "STT 服务地址",
  "voice.sttBaseUrlPlaceholder": "https://api.openai.com/v1（留空不启用）",
  "voice.sttApiKey": "STT 服务 API Key",
  "voice.sttApiKeyHint": "voiceTranscription=stt 时使用，以 Bearer 方式携带。仅保存在本机 bots.json，不会随消息外发（转写请求除外）。",
  "voice.apiKeyPlaceholder": "sk-…（留空不启用）",
  "voice.sttModel": "STT 模型",
  "voice.sttModelHint": "voiceTranscription=stt 时使用的转写模型名，如 whisper-1。",
  "voice.ttsBaseUrl": "TTS 服务地址（Base URL）",
  "voice.ttsBaseUrlHint": "开启「语音回复」时使用，OpenAI 兼容的接口根地址（不含 /audio/speech 后缀）。合成的 WAV 语音直接作为 QQ 语音消息发送。",
  "voice.ttsBaseUrlShort": "TTS 服务地址",
  "voice.ttsApiKey": "TTS 服务 API Key",
  "voice.ttsApiKeyHint": "开启「语音回复」时使用，以 Bearer 方式携带。仅保存在本机 bots.json。",
  "voice.ttsModelVoice": "TTS 模型 / 发音人",
  "voice.ttsModelVoiceHint": "TTS 模型名（如 tts-1）与发音人（voice，如 alloy / nova / shimmer）。",
  "voice.typing": "正在输入状态",
  "voice.typingHint": "私聊收到消息后，AI 处理期间向对方显示「对方正在输入…」（QQ 平台能力仅限单聊），回复发出后自动停止；处理超过 5 分钟自动关闭以防状态永挂。发送失败不影响正常回复。",
  "voice.ttsReply": "语音回复（文字转语音）",
  "voice.ttsReplyHint": "私聊回复自动经 TTS 服务合成语音气泡发送（QQ 平台语音消息仅支持单聊，群聊仍发文字）。需配置下方 TTS 服务（OpenAI 兼容 /audio/speech）；合成或发送失败自动回退文字回复，内容不丢。",
  "voice.ttsModel": "TTS 模型名",
  "voice.ttsVoice": "TTS 发音人",
  // ── tune ──
  "tune.title": "回复调优",
  "tune.hint": "调节这个机器人「回得多不多、切得多碎」，每个机器人彼此独立。改完立即生效，建议先按默认值跑一段时间再微调。",
  "tune.allZero": "0（全部回复）",
  "tune.offZero": "0（关闭）",
  "tune.groupValueThreshold": "群消息价值阈值",
  "tune.atContext": "AT 上下文条数",
  "tune.minGroupInterval": "群回复最小间隔",
  "tune.sameSenderInterval": "同人回复间隔",
  "tune.chunkChars": "分片字符数",
  "tune.maxReplies": "每条消息最大回复",
  "tune.groupValueThresholdHint": "0–10 分。机器人给每条群消息打分，只有达到分数才会回复；分数越高越安静。设为 0 表示群里所有消息都回复（容易刷屏）。@ 机器人的消息不受此限制，一定会回复。",
  "tune.atContextHint": "@ 机器人时，额外附带群里最近 N 条消息一起送给模型，让它听懂上下文。设为 0 则只发送被 @ 的这一条。条数越多越聪明，也越耗 token。",
  "tune.minGroupIntervalHint": "同一个群里，两次「非 @ 触发」的回复之间至少要隔这么久，用来防止机器人刷屏。@ 机器人的回复不受限制。",
  "tune.sameSenderIntervalHint": "同一个人在这么短的时间内不会被回复第二次，避免被同一个人连续刷屏。",
  "tune.chunkCharsHint": "QQ 单条消息有长度限制，超长的回复会按这个字数切成多条依次发送。太小会切得很碎，太大会被平台截断。",
  "tune.maxRepliesHint": "一条用户消息最多触发几次被动回复（QQ 平台硬上限为 5）。调小可以避免机器人一次性连发多条。",
  // ── conn ──
  "conn.title": "连接与移除",
  "conn.hint": "管理机器人的启用状态、设为主机器人、重建 QQ 长连接，或删除接入配置。",
  "conn.disableBot": "停用此机器人",
  "conn.enableBot": "启用此机器人",
  "conn.disableHint": "停用的机器人不会建立 QQ 长连接，也不会接收或回复消息；其它已启用的机器人不受影响。",
  "conn.disable": "停用",
  "conn.enable": "启用",
  "conn.primaryHint": "未显式指定机器人时（配置编辑、主动消息、定时任务），默认作用于主机器人。所有「已启用」的机器人都会同时接收并回复消息。",
  "conn.check": "检查连接",
  "conn.retry": "重试连接",
  "conn.retryHint": "按当前凭据重新建立 QQ WebSocket 长连接。收不到消息时先点它排查。",
  "conn.checking": "检查中…",
  "conn.remove": "移除接入",
  "conn.removeHint": "删除这个机器人的凭据与配置，删除后它会立刻停止接收消息，且无法撤销。",
  "conn.setPrimary": "设为主机器人",
  "conn.removeConfirm": "确定删除机器人 {0}？删除后该机器人停止接收消息。",
  // ── picker ──
  "picker.title": "选择工作区目录",
  "picker.subtitle": "逐级浏览并选定机器人读取文件的文件夹",
  "picker.loading": "正在读取目录…",
  "picker.upOneLevel": "上一级",
  "picker.rowHint": "单击选中，双击进入",
  "picker.emptyDirs": "该目录下没有子文件夹",
  "picker.footerHint": "单击选中，双击进入；未选中时选定当前浏览的目录",
  "picker.chooseFolder": "选定此文件夹",
  // ── sched ──
  "sched.tabScheduled": "定时消息",
  "sched.scopeCurrentBot": "当前机器人",
  "sched.scopeCurrent": "当前",
  "sched.scopeAllBots": "所有机器人",
  "sched.groupTasks": "群聊任务",
  "sched.dmTasks": "单聊任务",
  "sched.lastFailed": "上次失败",
  "sched.form.scope": "发送范围",
  "sched.form.scopeHint": "发送到群聊还是单聊。改动范围后请确认下方 openid 与之匹配。",
  "sched.form.scopeGroup": "群聊",
  "sched.form.scopeDm": "单聊",
  "sched.form.recipient": "接收方 openid",
  "sched.form.recipientHint": "接收消息的群或用户 openid（o 开头的长串）。机器人收到过该群/该用户消息后，可让 AI 用 /session 查到。",
  "sched.form.recipientPlaceholder": "群或用户的 openid",
  "sched.form.type": "发送类型",
  "sched.form.typeHintLegacy": "每天=到点每日发送一次；间隔=按分钟循环发送。",
  "sched.form.daily": "每天（指定时刻）",
  "sched.form.intervalLegacy": "间隔（循环分钟）",
  "sched.form.dailyTime": "每天发送时间",
  "sched.form.dailyTimeHint": "上海时间（UTC+8）；点击输入框用时间选择器选取。",
  "sched.form.intervalMinutes": "间隔分钟",
  "sched.form.intervalMinutesHint": "两次发送之间的间隔分钟数，最小 5 分钟。间隔越小消耗的主动消息配额越多。",
  "sched.form.sendModeLegacy": "发送方式",
  "sched.form.sendModeHintLegacy": "直接发送=到点原样发送下方内容；AI 生成=把下方内容作为指令交给 AI，生成结果再回复（会创建会话、消耗 token）。",
  "sched.form.text": "直接发送文本",
  "sched.form.aiLegacy": "AI 生成内容",
  "sched.form.aiTask": "AI 智能任务（自主取数并决定发不发）",
  "sched.form.aiTaskShort": "AI 智能任务",
  "sched.form.content": "内容",
  "sched.form.aiTaskContentHint": "给 AI 的任务指令（如「总结昨天群聊的重点」「价格低于 100 再提醒我」）。到点 AI 会自己调用工具取数、加工，再决定发什么；若判断无事可报会自动静默——不打扰大家，也不占主动消息配额。",
  "sched.form.textContentHint": "到点直接发送的文本，上限 2000 字。",
  "sched.form.textPlaceholder": "总结今天的待办",
  "sched.form.aiTaskPlaceholder": "例如：总结昨天群聊的重点；没有重点就别发",
  "sched.form.legacyPlaceholder": "记得喝水",
  "sched.contentLegacy": "定时消息内容",
  "sched.saveHintLegacy": "保存后立即生效并重新计算下次发送时间",
  "sched.saveChanges": "保存修改",
  "sched.form.legacyPlaceholder3": "例如：总结今天的待办",
  "sched.sectionTitle": "定时消息与归档",
  "sched.sectionHint": "定时消息：查看 / 删除这个机器人已设置的定时发送任务（聊天里的 /定时 命令与 AI 设置的任务都在这里）。消息归档：只读查看本地落盘的最近收发记录，按当前机器人过滤。",
  "sched.legacyTitle": "定时消息管理",
  "sched.legacyHint": "列出这个机器人名下的全部定时消息（每天定时与间隔循环），可单条删除；删除立即生效并落盘。",
  "sched.viewScheduled": "查看定时消息",
  "sched.archiveIntro": "开启「消息本地归档」后，收发的消息会写入 ~/.dsh/qqbot/archive/（按天分文件）。这里只读展示最近的记录，最新在前。",
  "sched.viewArchive": "查看归档",
  "sched.dialogSubtitle": "这个机器人名下的全部定时发送任务（含聊天命令与 AI 设置的）",
  "sched.loading": "正在读取定时消息…",
  "sched.empty": "还没有定时消息。可在聊天里发 /定时 每天 09:00 内容、让 AI 帮你设置，或点上方「＋ 新增」。",
  "sched.addNew": "＋ 新增",
  "sched.newScheduled": "新增定时消息",
  "sched.sourceAiShort": "AI 生成",
  "sched.sourceSettings": "来自设置页",
  "sched.sourceAi": "来自 AI",
  "sched.sourceCommand": "来自聊天命令",
  "sched.removing": "删除中…",
  "sched.removeConfirm": "确定删除这条定时消息？删除后立即停止发送。",
  "sched.disable": "禁用",
  "sched.disabled": "已禁用",
  "sched.disabling": "禁用中…",
  "sched.enabling": "启用中…",
  "sched.disabledNoRun": "已禁用，不会执行",
  "sched.disableConfirm": "确定禁用这条定时任务？禁用后不再执行，可随时重新启用。",
  "sched.commandSource": "命令来源",
  "sched.commandManual": "手写命令",
  "sched.commandAiScript": "AI 生成脚本",
  "sched.aiScriptPrompt": "AI 脚本描述词",
  "sched.scriptGenerating": "脚本生成中…",
  "sched.scriptFailed": "脚本生成失败",
  "sched.scriptReadyHint": "生成完成后开始执行；已过的触发时刻不补跑",
  "sched.scriptGeneratingHint": "脚本生成中…完成后自动回填命令并按计划执行。",
  "sched.commandSourceHint": "手写命令=自己写完整命令行；AI 生成脚本=只写任务描述，保存后由 AI 后台生成脚本并自动回填命令。",
  "sched.aiScriptPromptHint": "描述这个定时任务要做的事（如「抓取某网页今日价格并输出一行文本」）。保存后 AI 后台生成脚本：生成期间任务不执行；完成后自动按计划执行（已过的触发时刻不补跑）。",
  "sched.title": "定时任务管理",
  "sched.hint": "支持 daily / interval / cron / at 四种触发条件，以及 文本 / AI 智能任务 / 执行命令 三种执行方式。",
  "sched.pending": "待补算",
  "sched.newTask": "新增定时任务",
  "sched.loadingTasks": "正在读取定时任务…",
  "sched.emptyTasks": "还没有定时任务。可在聊天里发 /定时 每天 09:00 内容、让 AI 帮你设置，或点上方「＋ 新增」。",
  "sched.removeTaskConfirm": "确定删除这条定时任务？删除后立即停止发送。",
  "sched.saveHint": "保存后立即生效并重新计算下次触发时间",
  "sched.form.stepRecipient": "① 发送给谁",
  "sched.form.stepRecipientHint": "决定这条任务往哪个群或哪个用户发。",
  "sched.form.scopeHint2": "群聊或单聊；改动范围后请确认下方 openid 与之匹配。",
  "sched.form.recipientHint2": "接收消息的群或用户 openid。机器人收到过该群/该用户消息后，可让 AI 用 /session 查到。",
  "sched.form.stepTrigger": "② 什么时候触发",
  "sched.form.stepTriggerHint": "选择触发条件并填写对应参数。",
  "sched.form.trigger": "触发条件",
  "sched.form.triggerHint": "每天=指定时刻；间隔=按分钟循环；cron=标准表达式（可带时区）；一次性 at=绝对时间，到点后自动删除。",
  "sched.form.dailyShort": "每天",
  "sched.form.interval": "间隔",
  "sched.form.at": "一次性 at",
  "sched.form.timeHint": "按所选时区解释；点击输入框可用时间选择器。",
  "sched.form.timezone": "时区",
  "sched.form.tzDailyHint": "daily 默认按中国标准时间发送；如需按其他时区，请改用 cron。",
  "sched.form.tzCronHint": "cron 表达式按该时区解释。",
  "sched.form.tzAtHint": "at 时间按该时区解释。",
  "sched.form.tzCustomOption": "自定义（手动输入 IANA 时区）",
  "sched.form.tzCustom": "自定义时区",
  "sched.form.intervalHint": "两次发送之间的间隔，最小 5 分钟。间隔越小消耗的主动消息配额越多。",
  "sched.form.minutesUnit": "分钟",
  "sched.form.quick": "快捷",
  "sched.form.quick5m": "5 分",
  "sched.form.quick10m": "10 分",
  "sched.form.quick15m": "15 分",
  "sched.form.quick30m": "30 分",
  "sched.form.quick1h": "1 小时",
  "sched.form.quick2h": "2 小时",
  "sched.form.quick6h": "6 小时",
  "sched.form.quick12h": "12 小时",
  "sched.form.quick24h": "24 小时",
  "sched.form.cron": "cron 表达式",
  "sched.form.cronHint": "标准 5 段：分 时 日 月 周（如 0 9 * * 1-5 = 工作日 9 点）。支持 */步长、范围、列表、月份与星期英文名。",
  "sched.form.atTime": "at 时间",
  "sched.form.atHint": "一次性触发时间，到点执行一次后自动删除。",
  "sched.form.weekdayFilter": "星期过滤（可选）",
  "sched.form.weekdayHint": "仅在这些星期触发；不选 = 每天。0=周日。",
  "sched.form.weekdayFilterShort": "星期过滤",
  "sched.form.weekdays": "工作日",
  "sched.form.weekend": "周末",
  "sched.form.cronNoMatch": "未来 5 年内无匹配，请检查表达式",
  "sched.form.cronIncomplete": "表达式还不完整或非法（应为 5 段：分 时 日 月 周）",
  "sched.form.stepAction": "③ 到点做什么",
  "sched.form.stepActionHint": "选择执行方式；除「直接发送文本」外，都能在「执行」与「发送」之间插入加工与判断。",
  "sched.form.action": "执行方式",
  "sched.form.actionHint": "文本=到点原样发送；AI 智能任务=把内容当任务指令，到点 AI 自己取数、加工、决定发不发；执行命令=确定性跑一条命令，再按加工指令与发送门控推送给用户。",
  "sched.form.tool": "执行命令并推送结果",
  "sched.form.command": "要执行的命令",
  "sched.form.commandHint": "到点由服务端执行这条命令行，捕获 stdout/stderr 与退出码后推送给用户。支持 python / powershell -File / .bat / node / vbs(cscript //Nologo) / perl / php / ruby 等。",
  "sched.form.templates": "模板",
  "sched.form.templateBat": "bat 批处理",
  "sched.form.cwd": "工作目录（可选）",
  "sched.form.cwdHint": "命令的工作目录；留空则使用插件进程目录。脚本里用相对路径时建议填写。",
  "sched.form.cwdPlaceholder": "例如 C:/scripts",
  "sched.form.cwdShort": "工作目录",
  "sched.form.timeout": "执行超时（秒）",
  "sched.form.timeoutHint": "命令最长执行时间，超时会被强制终止。默认 120 秒；报表、爬取等慢脚本可调大到 600 秒。",
  "sched.form.env": "环境变量（可选）",
  "sched.form.envHint": "每行一条 KEY=VALUE，注入到命令进程；脚本可用 os.environ / process.env 读取。适合传密钥，避免写进命令行（命令行会出现在日志里）。",
  "sched.form.envShort": "环境变量",
  "sched.form.resultMode": "结果处理",
  "sched.form.resultModeHint": "raw = 直接把命令输出推送给用户；ai = 先按「数据加工指令」把输出整理后推送（输出很长或含噪音时推荐）。",
  "sched.form.resultRaw": "raw：直接推送原始输出",
  "sched.form.resultAiLegacy": "ai：交给 AI 整理后推送",
  "sched.form.resultAi": "ai：交给 AI 加工后推送",
  "sched.form.dataInstruction": "数据加工指令（可选）",
  "sched.form.dataInstructionHint": "规定把命令输出处理成什么样再发：筛选、排序、限行、固定格式都写在这里。留空则用内置的「整理成一段简洁播报」要求。",
  "sched.form.dataInstructionPlaceholder": "例如：只保留今天新增的订单，按金额从高到低排列，最多 5 条；没有新增就什么都别发",
  "sched.form.dataInstructionShort": "数据加工指令",
  "sched.form.goal": "任务目标（可选）",
  "sched.form.goalHint": "一句话说明这条任务服务于什么判断，供 AI 分诊时理解意图。",
  "sched.form.goalPlaceholder": "例如：盯住竞品价格波动",
  "sched.form.goalShort": "任务目标",
  "sched.form.notifyWhen": "通知条件（可选）",
  "sched.form.notifyWhenHint": "用自然语言写明「什么时候才值得打扰大家」。不满足时本次静默不发，也不占主动消息配额。",
  "sched.form.notifyWhenPlaceholder": "例如：只有涨幅超过 5%、或出现异常时才提醒",
  "sched.form.notifyWhenShort": "通知条件",
  "sched.form.selfCheck": "发送前自校验",
  "sched.form.selfCheckHint": "开启后，投递前再复核一次草稿是否满足上面的目标与通知条件，不达标就不发。tool 模式为独立模型二次复核，ai 模式为强化自查。",
  "sched.form.checkOff": "关闭校验",
  "sched.form.checkOn": "开启校验",
  "sched.form.conditional": "条件触发",
  "sched.form.gate": "发送门控",
  "sched.form.gateHint": "投递到 QQ 前的最后一道判断：changed 适合「有变化才播报」，nonempty 适合「有异常才报警」。被拦下时不投递，也不消耗主动消息配额。",
  "sched.form.gateAlways": "always：每次都发（默认）",
  "sched.form.gateNonempty": "nonempty：没有实质输出就跳过",
  "sched.form.gateChanged": "changed：与上次内容相同就跳过",
  "sched.gateEmpty": "门控：无输出不发",
  "sched.gateUnchanged": "门控：无变化不发",
  "sched.lastSkipped": "上次已跳过发送",
  "sched.lastSkippedPrefix": "上次跳过（",
  "sched.lastSkippedSep": "）：",
  "sched.nothingToSend": "本次无需发送",
  "sched.form.legacyPlaceholder2": "例如：记得喝水",
  "sched.content": "定时任务内容",
  "sched.form.summaryCommandToAi": "命令 → AI 播报",
  "sched.form.summaryCommandToAiProcess": "命令 → AI 加工",
  "sched.form.summaryCommandToRaw": "命令 → 原始输出",
  "sched.form.recipientRequired": "请填写接收方 openid（群或用户）",
  "sched.form.timeInvalid": "时间格式应为 HH:mm（如 09:30）",
  "sched.form.intervalTooSmall": "间隔不能小于 5 分钟",
  "sched.form.cronInvalid": "cron 表达式非法（标准 5 段，如 0 9 * * 1-5）",
  "sched.form.atInvalid": "请选择有效的 at 时间",
  "sched.form.atMustBeFuture": "at 时间必须晚于当前时间",
  "sched.form.tzInvalid": "时区格式不正确（应为 IANA 时区，如 Asia/Shanghai）",
  "sched.form.commandRequired": "请填写要执行的命令（如 python C:/scripts/report.py）",
  "sched.form.contentRequired": "内容不能为空",
  "sched.form.recipientHintPicker": "接收消息的群或用户 openid。点击输入框可从消息归档下拉选择：群聊候选显示群 id，单聊候选显示用户 id 与昵称；也可直接粘贴。",
  "sched.testSentHint": "已测试发送一次（不计入主动消息配额）",
  "sched.form.onShort": "开",
  "sched.form.offShort": "关",
  "sched.testSent": "已测试发送一次",
  "sched.testSendHint": "测试发送一次（不计入主动消息配额）",
  "sched.aiScriptRequired": "请填写 AI 脚本描述词（如：抓取某网页今日价格并输出）",
  "sched.aiScriptPlaceholder": "例如：访问 https://example.com/price 抓取今日价格，输出一行「今日价格：xx 元」",
  "sched.aiGenerating": "（AI 生成中）{0}",
  "sched.ownerBot": "该任务归属机器人 {0}",
  "sched.nextSend": "下次发送 {0}",
  "sched.nextRun": "下次运行：{0}",
  "sched.next": "下次 {0}",
  "sched.lastSkippedFull": "上次跳过（{0}）：{1}",
  "sched.current": "当前：{0}",
  "sched.totalCount": "共 {0} 条",
  "sched.totalCountPerChatMax": "共 {0} 条（每个群/单聊最多 {1} 条）",
  "sched.allBotsTotalCount": "所有机器人共 {0} 条",
  "sched.allBotsCountPerChatMax": "所有机器人共 {0} 条（每个群/单聊最多 {1} 条）",
  "sched.perChatMaxTasks": "每个群/单聊最多 {0} 条定时任务",
  "sched.form.dailyAt": "每天 {0}",
  "sched.form.everyMinutes": "每 {0} 分钟",
  "sched.form.everyHours": "每 {0} 小时",
  "sched.form.onceAt": "一次性 {0}",
  "sched.form.every24h": "每 24 小时",
  "sched.form.weekdayPrefix": "周{0}",
  "sched.form.localTz": "本机时区 · {0}",
  // ── archive ──
  "archive.tab": "消息归档",
  "archive.subtitle": "本地落盘的最近收发记录（只读，最新在前；按当前机器人过滤）",
  "archive.subtitle2": "本地落盘的收发记录（按当前机器人过滤）：左栏选日期查看内容，× 删除该天归档",
  "archive.loading": "正在读取归档…",
  "archive.empty": "该天没有记录。开启「消息本地归档」并收到消息后，这里会出现记录。",
  "archive.dateFiles": "归档日期文件",
  "archive.noFiles": "暂无归档文件",
  "archive.deleteHint": "删除该天归档（仅此机器人的记录）",
  "archive.received": "收到",
  "archive.reply": "回复",
  "archive.proactive": "主动",
  "archive.session": "会话",
  "archive.showingLatest": "已显示最近 {0} 条（更早记录仍在归档文件里）",
  "archive.totalRecords": "共 {0} 条记录",
  "archive.recordCount": "{0} 条记录",
  "archive.deleteLabel": "删除 {0} 归档",
  "archive.deleteConfirm": "确定删除 {0} 的归档记录？此机器人该天的记录将被清除，其他机器人的记录保留。",
  "archive.sessionLine": "会话 {0}{1}{2}",
  // ── idpick ──
  "idpick.user": "用户",
  "idpick.bot": "机器人",
  "idpick.title": "归档会话候选",
  "idpick.loading": "正在读取归档会话…",
  "idpick.empty": "归档里还没有该类型的会话记录，可直接粘贴 openid",
  "idpick.noMatch": "没有匹配的候选，可直接粘贴 openid",
  "idpick.candidates": "共 {0} 个候选，输入关键词继续过滤",
  "idpick.groupRecentSpeaker": "群聊 · 最近发言成员：{0}",
  "idpick.groupIdLabel": "群 id：{0}",
  "idpick.userIdLabel": "用户 id：{0}",
  "idpick.memberSuffix": "{0}（成员 {1}）",
  // ── update ──
  "update.hint": "从 GitHub 检查新版本；发现新版本会自动下载并更新，重启 DSH 后生效",
  "update.updated": "已更新 ✓",
  "update.check": "检查更新",
  "update.checking": "正在检查更新…",
  "update.noNewVersion": "暂无新版本（当前 v{0} 已是最新）",
  "update.found": "发现新版本 v{0}，正在自动更新…",
  "update.updatedTo": "已自动更新到 v{0}（备份于安装目录 .update-backup/），重启 DSH 后生效",
  // ── replyLocale ──
  "replyLocale.label": "回复语言（replyLocale）",
  "replyLocale.labelShort": "回复语言",
  "replyLocale.hint": "机器人直接发给 QQ 用户的系统文案（/help、/status、定时消息用法、欢迎语等）使用的语言。中文为源语言；选择 English 时这些文案自动翻译为英文，未命中的内容保持原文不丢信息。AI 对话内容本身不受影响。",
  "replyLocale.zh": "中文（默认）",
  // ── group ──
  "group.title": "按群配置",
  "group.hint": "为特定群单独覆盖行为配置（阈值/冷却/敏感词/上下文等），其余字段跟随机器人默认。适合把某一个群调得更活跃或更安静，而不影响其他群。",
  "group.empty": "还没有按群覆盖配置，所有群都使用上方机器人默认配置。",
  "group.overrideHint": "覆盖字段未设置时跟随机器人默认；全部清空并保存即删除该群覆盖。",
  "group.add": "添加群覆盖",
  "group.edit": "编辑群覆盖",
  "group.group": "群",
  "group.noOverrides": "无覆盖字段",
  "group.required": "请填写群 openid",
  "group.dialogHint": "留空/选择「跟随默认」的字段继续使用机器人级配置，仅此群生效",
  "group.openid": "群 openid",
  "group.openidHint": "要单独配置的群 openid（o 开头的长串）。可在群里让 AI 用 /session 查看。",
  "group.fullReply": "群全量回复",
  "group.fullReplyHint": "该群非 @ 消息是否参与价值评分并回复。",
  "group.followDefault": "跟随默认",
  "group.valueThreshold": "价值阈值",
  "group.valueThresholdHint": "仅群全量回复开启时有效：0-10 分，达到阈值才回复。",
  "group.atContext": "@ 上下文条数",
  "group.atContextHint": "@ 机器人时附带的本群最近消息条数。",
  "group.groupCooldown": "同群冷却",
  "group.groupCooldownHint": "该群两次全量回复的最小间隔（@ 回复不受限）。",
  "group.senderCooldown": "同人冷却",
  "group.senderCooldownHint": "同一人在该群两次被回复的最小间隔。",
  "group.chunkLength": "分片长度",
  "group.chunkLengthHint": "单条回复的最大字符数，超过会拆成多条发送。",
  "group.maxReplies": "每条消息回复上限",
  "group.maxRepliesHint": "该群每条用户消息最多被动回复几条（平台上限 5）。",
  "group.markdownHint": "该群回复是否优先使用 QQ Markdown。",
  "group.memoryHint": "该群是否维护跨会话长期记忆。",
  "group.bannedWordsHint": "仅该群生效的敏感词（逗号分隔），命中即撤回并跳过回复；与机器人级敏感词叠加。",
  "group.bannedWordsPlaceholder": "词1, 词2（留空跟随默认）",
  "group.saveHint": "保存后立即生效，无需重启",
  "group.overrideRequired": "请至少设置一个覆盖字段：全部「跟随默认」等同于不添加该群覆盖。",
  "group.openidHintPicker": "要单独配置的群 openid（o 开头的长串）。点击输入框可从消息归档下拉选择，候选标注「群 id」；也可直接粘贴。",
  "group.removeConfirm": "确定删除群 {0} 的覆盖配置？删除后该群恢复使用机器人默认配置。",
  "group.summaryFullReply": "全量回复 {0}",
  "group.summaryThreshold": "阈值 {0}",
  "group.summaryContext": "上下文 {0} 条",
  "group.summaryGroupCooldown": "群冷却 {0}",
  "group.summarySenderCooldown": "同人冷却 {0}",
  "group.summaryChunk": "分片 {0}",
  "group.summaryMaxReplies": "回复上限 {0}",
  "group.summaryMarkdown": "Markdown {0}",
  "group.summaryMemory": "记忆 {0}",
  "group.summaryBannedWords": "敏感词 {0} 个",
  "group.summaryChatPreset": "聊天 Preset {0}",
  // ── tz ──
  "tz.shanghai": "中国标准时间 · Asia/Shanghai（UTC+8）",
  "tz.hongkong": "中国香港 · Asia/Hong_Kong（UTC+8）",
  "tz.taipei": "中国台湾 · Asia/Taipei（UTC+8）",
  "tz.singapore": "新加坡 · Asia/Singapore（UTC+8）",
  "tz.tokyo": "日本 · Asia/Tokyo（UTC+9）",
  "tz.seoul": "韩国 · Asia/Seoul（UTC+9）",
  "tz.kolkata": "印度 · Asia/Kolkata（UTC+5:30）",
  "tz.dubai": "阿联酋 · Asia/Dubai（UTC+4）",
  "tz.moscow": "俄罗斯 · Europe/Moscow（UTC+3）",
  "tz.berlin": "中欧 · Europe/Berlin（UTC+1/+2）",
  "tz.london": "英国 · Europe/London（UTC+0/+1）",
  "tz.saopaulo": "巴西 · America/Sao_Paulo（UTC-3）",
  "tz.newyork": "美国东部 · America/New_York（UTC-5/-4）",
  "tz.chicago": "美国中部 · America/Chicago（UTC-6/-5）",
  "tz.denver": "美国山地 · America/Denver（UTC-7/-6）",
  "tz.losangeles": "美国西部 · America/Los_Angeles（UTC-8/-7）",
  "tz.sydney": "澳大利亚 · Australia/Sydney（UTC+10/+11）",
  "tz.auckland": "新西兰 · Pacific/Auckland（UTC+12/+13）",
  "tz.utc": "协调世界时 · UTC（UTC+0）",
  // ── err ──
  "err.noBotAvailable": "没有可用的机器人（请先添加机器人）",
  "err.appIdSecretRequired": "appId 与 appSecret 必填",
  "err.missingAppId": "缺少 appId",
  "err.missingId": "缺少 id",
  "err.missingScopeOpenid": "缺少 scope/openid",
  "err.scopeOpenidContentRequired": "scope/openid/content 必填",
  "err.enabledMustBeBoolean": "enabled 必须是布尔值",
  "err.schedulerUnavailable": "调度器不可用",
  "err.botNotExists": "机器人不存在",
  "err.qrMissingCreds": "扫码结果缺少凭据",
  "err.emptyResponse": "空响应",
  "err.badType": "type 必须是 daily / interval / cron / at 之一",
  "err.contentTooLong": "内容过长（上限 2000 字）",
  "err.commandRequiredForTool": "工具模式必须填写要执行的命令（如 python C:/scripts/report.py），或填写 AI 脚本描述词",
  "err.aiScriptPromptTooLong": "AI 脚本描述词过长（上限 2000 字）",
  "err.cwdMustBeString": "工作目录（cwd）必须是字符串",
  "err.badResultMode": "结果处理（resultMode）必须是 raw 或 ai",
  "err.badWeekdays": "weekdays 必须是非空数字数组",
  "err.badWeekdayValue": "weekdays 元素必须是 0-6（0=周日）",
  "err.badAtIso": "at 必须是合法 ISO 时间",
  "err.badTimeShanghai": "time 格式应为 HH:mm（上海时间，如 09:30）",
  "err.taskNotFound": "未找到该定时任务",
  "err.messageNotFound": "未找到该定时消息",
  "err.taskGone": "定时任务不存在（可能已被删除）",
  "err.dispatchedNoBus": "已派发（环境无会话总线，无法确认投递，请稍后查看聊天）",
  "err.dispatchedNoId": "已派发（无 deliveryId，无法确认投递，请稍后查看聊天）",
  "err.botNotFoundPrefix": "未找到机器人 {0}",
  "err.dirNotExistPrefix": "目录不存在: {0}",
  "err.notADirPrefix": "不是目录: {0}",
  "err.dirUnreadablePrefix": "无法读取目录: {0}",
  // ── weekday ──
  "weekday.mon": "一",
  "weekday.tue": "二",
  "weekday.wed": "三",
  "weekday.thu": "四",
  "weekday.fri": "五",
  "weekday.sat": "六",
  "weekday.sun": "日",
  // ── override ──
  "override.scoreOption": "{0} 分",
  "override.countOption": "{0} 条",
  "override.charsOption": "{0} 字",
  "override.perDayOption": "{0} 条/天",
  // ── unit ──
  "unit.minutes": "{0} 分钟",
  "unit.seconds": "{0} 秒"
});
var en = Object.freeze({
  // ── common ──
  "common.unknownError": "Unknown error",
  "common.statusReadFailed": "Failed to read status",
  "common.rpcFailed": "RPC call failed",
  "common.unlimited": "No limit",
  "common.close": "Close",
  "common.cancel": "Cancel",
  "common.ok": "OK",
  "common.confirmTitle": "Confirm",
  "common.confirmDelete": "Delete",
  "common.confirmDisable": "Disable",
  "common.refresh": "Refresh",
  "common.refreshing": "Refreshing…",
  "common.loading": "Loading…",
  "common.reset": "Reset",
  "common.resetting": "Resetting…",
  "common.note": "Note",
  "common.saving": "Saving…",
  "common.edit": "Edit",
  "common.create": "Create",
  "common.delete": "Delete",
  "common.saveFailed": "Save failed; please retry later",
  "common.save": "Save",
  "common.test": "Test",
  "common.testing": "Testing…",
  "common.runFailed": "Run failed",
  // ── notice ──
  "notice.setPrimary": "Set as primary bot",
  "notice.botEnabled": "Bot enabled",
  "notice.botDisabled": "Bot disabled",
  "notice.botRemoved": "Bot removed",
  "notice.reconnectStarted": "Reconnection started; check the status shortly",
  "notice.lastFailedPrefix": "Last failed: ",
  "notice.qrLinked": "QR link succeeded; AppID {0} is enabled",
  "notice.credentialsSaved": "Credentials saved; AppID {0} is enabled",
  "notice.saveFailedPrefix": "Save failed: {0}",
  "notice.operationFailedPrefix": "Operation failed: {0}",
  "notice.removeFailedPrefix": "Removal failed: {0}",
  "notice.retryFailedPrefix": "Retry failed: {0}",
  "notice.checkFailedPrefix": "Check failed: {0}",
  "notice.updateFailedPrefix": "Update failed: {0}",
  "notice.testSendFailedPrefix": "Test send failed: {0}",
  "notice.lastGenFailedPrefix": "Last generation failed: {0}",
  "notice.workspaceSavedPrefix": "Workspace saved: {0} (applies to new sessions)",
  "notice.groupOverrideSaved": "Override for group {0} saved (takes effect immediately)",
  "notice.groupOverrideSaveNoEffect": "Save did not take effect: the override for group {0} was not written; please retry",
  "notice.archiveReadFailed": "Archive read failed: {0} (you can paste an openid directly)",
  "notice.qqNotReadyDetail": "QQ connection not ready: {0}. The plugin will retry automatically.",
  "notice.sourceSavedAt": "{0} · saved at {1}",
  "notice.savedAtPrefix": "Saved at {0}",
  "notice.currentSuffix": "{0} (current)",
  "notice.scriptGenerated": "Generated script: {0}. Edit the prompt and save to regenerate.",
  "notice.lastGenFailedRetry": "Last generation failed: {0}. Save again to retry.",
  // ── session ──
  "session.model": "Model",
  "session.followHostDefault": "Follow host default",
  "session.title": "Session & model",
  "session.hint": "Controls which identity, directory, and model this bot works with; each bot is independent, and changes apply only to newly created sessions.",
  "session.workspace": "Workspace directory",
  "session.workspaceHint": "Sessions created from QQ messages read and write files inside this directory. Leave empty for the default workspace; changes apply only to new sessions.",
  "session.chooseDir": "Choose directory",
  "session.defaultWorkspace": "Default workspace (~/.dsh/file)",
  "session.modelHint": "The model used by this bot’s sessions; leave empty to follow the host default. Existing sessions need a reset for the change to apply.",
  "session.followDefaultModel": "Follow default model",
  "session.presetHint": "Sets the bot’s behavior style and available tools. @-mentions and direct messages use this Preset; non-@ group replies use the chat preset (follows this Preset by default, configurable only in bots.json) and never run tools.",
  // ── status ──
  "status.disabled": "Disabled",
  "status.connected": "Connected",
  "status.connecting": "Connecting",
  "status.disconnected": "Not connected",
  "status.primaryConnected": "Primary bot connected",
  "status.someConnected": "Some bots connected",
  "status.allDisconnected": "All bots disconnected",
  "status.noBot": "No bots configured",
  "status.primaryBot": "Primary bot",
  "status.enabled": "Enabled",
  "status.notConfigured": "Not configured",
  "status.running": "Running",
  "status.notReady": "Connection not ready",
  "status.unchecked": "Not checked yet",
  "status.qqNotReadyDefault": "QQ connection not ready; the plugin will retry automatically.",
  "status.idle": "Idle",
  "status.connectingShort": "Connecting",
  "status.reconnecting": "Reconnecting",
  "status.disconnectedShort": "Disconnected",
  "status.error": "Error",
  "status.localTimeZone": "Local time zone",
  "status.configuredBots": "Configured bots ({0})",
  // ── list ──
  "list.addBot": "+ Add bot",
  "list.empty": "No bot configured yet",
  "list.emptyHint": "Click “+ Add bot” above, scan the QR code with the mobile QQ app, or enter the AppID / AppSecret manually. Once connected, behavior settings become available in the bot details.",
  "list.cardHint": "Click a bot card to open its details: view the QQ connection status and adjust behavior settings.",
  // ── qr ──
  "qr.tabScan": "Scan QR to connect",
  "qr.tabManual": "Manual entry",
  "qr.linked": "Linked",
  "qr.failed": "QR scan failed",
  "qr.refreshing": "Refreshing QR code",
  "qr.waitingScan": "Waiting for mobile QQ to scan",
  "qr.notGenerated": "QR code not generated",
  "qr.alt": "One-time QR code for linking the QQ bot",
  "qr.refreshingNow": "Refreshing QR code…",
  "qr.noQrYet": "No QR code yet",
  "qr.soonNewQr": "A new one will appear in a few seconds",
  "qr.clickGenerate": "Click “Generate QR code” below to start",
  "qr.validFor": "QR code valid for",
  "qr.regenerate": "Regenerate QR code",
  "qr.generate": "Generate QR code",
  "qr.cancelScan": "Cancel scanning",
  "qr.title": "Scan with mobile QQ",
  "qr.intro": "Recommended. After scanning, QQ delivers the bot’s AppID and AppSecret straight to the local dsh — nothing to copy by hand, and it takes effect immediately once saved.",
  "qr.steps": "Steps",
  "qr.step1": "Click “Generate QR code” below the QR area; a 5-minute countdown starts once it appears.",
  "qr.step2": "Open mobile QQ, tap “+” in the top-right corner, choose “Scan”, and scan this code.",
  "qr.step3": "Follow the QQ prompts to confirm and authorize this bot for the local dsh.",
  "qr.step4": "This page checks the result every 2 seconds and opens the bot details automatically once linked.",
  "qr.note1": "The QR code is valid for 5 minutes; a new one is generated automatically when it expires — no need to refresh the page.",
  "qr.note2": "Keep this settings page open while scanning; closing it interrupts the wait.",
  "qr.note3": "Credentials are written to ~/.dsh/qqbot/credentials.json (readable by the current user only), take effect immediately, and require no dsh restart.",
  "qr.stepTitleScan": "Scan with mobile QQ",
  "qr.stepTitleConfirm": "Confirm in QQ",
  "qr.stepTitleRedirect": "Wait for auto-redirect",
  // ── manual ──
  "manual.title": "Enter AppID / AppSecret manually",
  "manual.intro": "For bots already created on the QQ Open Platform: copy the credentials there first, then come back here to save them.",
  "manual.step1Title": "Step 1 · Get the credentials from the QQ Open Platform",
  "manual.openPlatform": "Open the QQ Open Platform",
  "manual.step1a": "Visit q.qq.com in a browser and sign in with QQ.",
  "manual.pickBot": "Pick the bot",
  "manual.step1b": "Open the bot you want to connect from the bot list; create one first if none exists.",
  "manual.copyCreds": "Copy the AppID and AppSecret",
  "manual.step1c": "Open the bot’s “Developer settings” page and copy the AppID (bot ID) and the AppSecret (bot key).",
  "manual.step2Title": "Step 2 · Fill them in here and save",
  "manual.appIdPlaceholder": "Bot ID",
  "manual.appSecretPlaceholder": "The bot key from Developer settings",
  "manual.saveAndEnable": "Save and enable",
  "manual.note1": "After saving, the credentials are written to ~/.dsh/qqbot/credentials.json (mode 0600), take effect immediately, and the bot becomes the primary one automatically.",
  "manual.note2": "Credentials are not validated here. After saving, check “Connection status” in the bot details: “Running” means connected; if not ready, click “Retry connection”.",
  "manual.note3": "Messages are received over a WebSocket long connection, so no callback URL is needed on the Open Platform; but replies go through the OpenAPI, which requires adding this machine’s outbound IP to the platform’s IP allowlist.",
  "manual.note4": "The AppSecret is never shown again after saving; to change it, simply fill it in and save again to overwrite.",
  // ── add ──
  "add.backToList": "← Back to list",
  "add.title": "Add bot",
  "add.intro": "Choose either way: scanning lets QQ deliver the credentials automatically; manual entry requires copying the AppID / AppSecret from the QQ Open Platform first. Once connected, the credentials take effect immediately and the bot becomes the primary one.",
  // ── detail ──
  "detail.noneSelected": "No bot selected",
  "detail.connectionStatus": "Connection status",
  "detail.lastConnected": "Last connected",
  // ── app ──
  "app.title": "QQ Bot",
  "app.settingsTitle": "QQ Bot settings",
  "app.subtitle": "Connect QQ bots to DeepSeek Harness",
  // ── stats ──
  "stats.title": "Run statistics",
  "stats.hint": "Persistent run counters for this bot (kept across restarts); they do not refresh automatically — click “Refresh” when needed.",
  "stats.resetHint": "Zero out this bot's run counters (takes effect and persists immediately)",
  "stats.received": "Messages received",
  "stats.sessions": "Sessions created",
  "stats.passive": "Passive replies",
  "stats.proactive": "Proactive messages",
  "stats.bound": "Bound sessions",
  "stats.pendingQueue": "Reply queue",
  "stats.groupBuffer": "Group buffer",
  "stats.errors": "Errors",
  // ── policy ──
  "policy.title": "Message & reply policy",
  "policy.hint": "Controls which messages this bot listens to and how it replies; each bot is independent. Every switch takes effect immediately — no restart needed.",
  "policy.fullGroupReply": "Reply to all group messages",
  "policy.fullGroupReplyHint": "When on, group messages that do not @ the bot also go through value scoring and get a reply only above the threshold; @-mentions are always answered and can use tools. When off, only messages that @ the bot are processed.",
  "policy.acceptDm": "Accept direct messages",
  "policy.acceptDmHint": "Whether to respond to QQ direct (C2C) messages. When off, the bot processes group messages only and ignores DMs.",
  "policy.respondBots": "Respond to bot messages",
  "policy.respondBotsHint": "When on, messages sent by other bots can also trigger replies from this bot. Off by default: other bots' messages are always ignored, preventing multiple bots in the same group from triggering each other in a loop. Note: the QQ platform usually does not push other bots' messages to a bot in groups, so this switch only takes effect when the platform actually delivers them.",
  "policy.markdown": "Markdown replies",
  "policy.markdownHint": "Send in QQ Markdown format first for nicer layout; if the platform rejects it, the message is resent as plain text automatically — nothing is lost.",
  "policy.quote": "Quote the user's message",
  "policy.quoteHint": "Replies quote the user's original message via QQ's native quote card (message_reference), sent over the proactive-message channel without msg_id — sending both together makes mobile QQ show the same content twice. Group chats only — DMs are never quoted: off = no quote; at = group @-mentions only (recommended); all = every group reply. If the card fails to send, the reply falls back to a plain passive reply (no card, nothing lost). Also, when a user quotes another message, the quoted text is always injected into the model context.",
  "policy.quoteScope": "Quote reply scope",
  "policy.quoteScopeOff": "off (no quote)",
  "policy.quoteScopeAt": "at (group @-mentions only, recommended)",
  "policy.quoteScopeAll": "all (every group reply)",
  "policy.quoteLimit": "Quote preview length",
  "policy.quoteLimitHint": "How many characters of the quoted text to show when a reply falls back to a text quote (proactive messages only; native quote cards are truncated by the QQ client itself); longer text ends with an ellipsis.",
  "policy.chatPreset": "Group chat preset",
  "policy.chatPresetHint": "Preset used for full group messages that do not @ the bot (chat only, no tools); leave empty to follow the Agent Preset above. Use it to give group-wide replies a style distinct from @-mentions and DMs.",
  "policy.followAgentPreset": "Follow Agent Preset",
  "policy.secretEnv": "AppSecret credential reference (secretEnv)",
  "policy.secretEnvShort": "AppSecret credential reference",
  "policy.secretEnvHint": "A DSH credential reference used instead of a plaintext AppSecret (takes priority over it). When set, the bot resolves the real secret from this reference at runtime, so no plaintext secret needs to be kept on the open platform. Leave empty to use the AppSecret from QR login / manual entry.",
  "policy.secretEnvPlaceholder": "e.g. my-qq-app-secret (leave empty to disable)",
  // ── quota ──
  "quota.daily": "Daily proactive quota",
  "quota.dailyHint": "How many proactive messages this bot may send per day at most (scheduled messages, welcome greetings, outbox redelivery, and AI-sent images all count). Each bot is counted and limited independently. 0 means unlimited — but the QQ platform's proactive quota is tiny; over-sending gets rate-limited. Keep the default 50.",
  "quota.unlimitedZero": "0 (unlimited)",
  // ── feature ──
  "feature.multimodal": "Multimodal messages",
  "feature.multimodalHint": "Images, files, and voice from groups/DMs are injected into the session context as attachments: vision models can see the images directly, and voice uses the platform's built-in transcript first. When off, non-text content is reduced to a placeholder note.",
  "feature.memory": "Long-term memory",
  "feature.memoryHint": "Each group/DM keeps a persistent memory (survives /new). Say “remember something” in chat and the AI writes it down automatically; use /memory to view and /forget to clear it.",
  "feature.welcome": "Welcome message",
  "feature.welcomeHint": "When a new member joins a group or adds the bot as a friend, the bot sends a welcome message automatically (text in the input below; {nick} is replaced with their identifier). Sent via the proactive channel and counts against the daily quota.",
  "feature.emojiRecall": "Emoji-recall",
  "feature.emojiRecallHint": "Anyone reacting 🗑️ to a message the bot sent makes the bot recall that message (requires the platform's “message recall” permission).",
  "feature.buttonApproval": "Button approvals",
  "feature.buttonApprovalHint": "Before performing sensitive operations the AI can send a “✅ Allow / ❌ Deny” button message; a click returns the decision immediately, and no click within the timeout counts as denial. Approval messages consume the proactive-message quota.",
  "feature.fileContent": "File content ingestion",
  "feature.fileContentHint": "When a text-like file (txt/md/json/csv/code, ≤1MB) arrives, its content is downloaded and excerpted into the model context so the AI can read it before replying; binary files (docx/pdf etc.) are listed by name only. Requires the “Attachment forwarding” switch.",
  "feature.welcomeText": "Welcome text",
  "feature.welcomeTextHint": "Content sent when “Welcome message” is on; {nick} is replaced with the new member's identifier. Leave empty to use the default “Welcome {nick}! @me to chat with me.”.",
  "feature.welcomeDefault": "Welcome {nick}! @me to chat with me.",
  "feature.bannedWords": "Banned words",
  "feature.bannedWordsHint": "Comma-separated. If a group message contains any of these words, the bot recalls the message and skips replying (requires message-recall permission; without it, only the reply is blocked).",
  "feature.bannedWordsPlaceholder": "word1, word2 (leave empty to disable)",
  "feature.passiveFallback": "Fall back to proactive messages",
  "feature.passiveFallbackHint": "When a passive reply times out or fails, retry once via the proactive-message API. The daily proactive quota is tiny — enable only temporarily while debugging.",
  "feature.archive": "Local message archive",
  "feature.archiveHint": "Writes received messages and sent replies to ~/.dsh/qqbot/archive/ as an audit trail for later troubleshooting.",
  "feature.sanitizeReply": "Reply sanitization",
  "feature.sanitizeReplyHint": "Strips hidden tag blocks such as system-reminder and <think> from model output before sending, preventing internal prompts and reasoning from leaking to chat partners. Only affects outgoing content; archives and model context keep the original text.",
  "feature.ssrfGuard": "Media URL safety check (SSRF guard)",
  "feature.ssrfGuardHint": "When the AI sends images/files/voice, URLs are checked against intranet and reserved addresses (127.0.0.1, 192.168.x.x, 169.254 metadata, etc.); official QQ domains pass through. Prevents the model from being tricked into probing intranet services. When off, only the http/https scheme is enforced.",
  "feature.pathWhitelist": "Local path whitelist",
  "feature.pathWhitelistHint": "When the AI sends images/files/voice, local paths must reside inside the workspace or plugin data directory, preventing arbitrary local files (credentials, keys, etc.) from being sent to chat partners. When off, any local path is allowed (not recommended).",
  // ── voice ──
  "voice.title": "Voice message handling",
  "voice.hint": "How to handle incoming voice messages: off = ignore; note = use the platform's built-in transcript (recommended; shows a placeholder when none); download = inject the audio URL into context; asr = call the custom transcription service below (POST {url} → {text}); stt = download the audio, convert it locally and call an OpenAI-compatible /audio/transcriptions endpoint (falls back to the platform transcript on failure).",
  "voice.mode": "Voice message handling mode",
  "voice.modeOff": "off (ignore voice)",
  "voice.modeNote": "note (platform transcript, recommended)",
  "voice.modeStt": "stt (auto-transcribe via STT service)",
  "voice.modeDownload": "download (inject audio URL)",
  "voice.modeAsr": "asr (custom transcription service)",
  "voice.asrTitle": "Custom transcription service",
  "voice.asrHint": "HTTP service used when voiceTranscription=asr: the bot POSTs { url: <audio URL> } and the service returns { text: <transcript> }. Leave empty to fall back to a placeholder note.",
  "voice.urlPlaceholder": "https://… (leave empty to disable)",
  "voice.asrUrl": "Custom transcription service URL",
  "voice.sttBaseUrl": "STT service base URL",
  "voice.sttBaseUrlHint": "Used when voiceTranscription=stt: the root URL of an OpenAI-compatible endpoint (without the /audio/transcriptions suffix). Voice files are downloaded locally (SILK auto-converted to WAV) before being uploaded for transcription.",
  "voice.sttBaseUrlShort": "STT service base URL",
  "voice.sttBaseUrlPlaceholder": "https://api.openai.com/v1 (leave empty to disable)",
  "voice.sttApiKey": "STT service API key",
  "voice.sttApiKeyHint": "Used when voiceTranscription=stt, sent as a Bearer token. Stored only in the local bots.json and never sent with messages (except the transcription request itself).",
  "voice.apiKeyPlaceholder": "sk-… (leave empty to disable)",
  "voice.sttModel": "STT model",
  "voice.sttModelHint": "Transcription model used when voiceTranscription=stt, e.g. whisper-1.",
  "voice.ttsBaseUrl": "TTS service base URL",
  "voice.ttsBaseUrlHint": "Used when “Text-to-speech replies” is on: the root URL of an OpenAI-compatible endpoint (without the /audio/speech suffix). The synthesized WAV is sent directly as a QQ voice message.",
  "voice.ttsBaseUrlShort": "TTS service base URL",
  "voice.ttsApiKey": "TTS service API key",
  "voice.ttsApiKeyHint": "Used when “Text-to-speech replies” is on, sent as a Bearer token. Stored only in the local bots.json.",
  "voice.ttsModelVoice": "TTS model / voice",
  "voice.ttsModelVoiceHint": "TTS model name (e.g. tts-1) and voice (e.g. alloy / nova / shimmer).",
  "voice.typing": "Typing indicator",
  "voice.typingHint": "When a DM arrives, shows “typing…” to the other side while the AI is processing (QQ platform capability is DM-only); stops automatically once the reply is sent, or after 5 minutes as a failsafe. Send failures never affect normal replies.",
  "voice.ttsReply": "Voice replies (text-to-speech)",
  "voice.ttsReplyHint": "DM replies are automatically synthesized into voice bubbles via the TTS service (QQ voice messages are DM-only; groups still get text). Requires the TTS service below (OpenAI-compatible /audio/speech); on synthesis or send failure the bot falls back to the text reply — no content is lost.",
  "voice.ttsModel": "TTS model",
  "voice.ttsVoice": "TTS voice",
  // ── tune ──
  "tune.title": "Reply tuning",
  "tune.hint": "Tunes how often this bot replies and how finely replies are split; each bot is independent. Changes apply immediately — run with defaults for a while before fine-tuning.",
  "tune.allZero": "0 (reply to all)",
  "tune.offZero": "0 (off)",
  "tune.groupValueThreshold": "Group message value threshold",
  "tune.atContext": "AT context messages",
  "tune.minGroupInterval": "Min group reply interval",
  "tune.sameSenderInterval": "Same-sender reply interval",
  "tune.chunkChars": "Chunk size (chars)",
  "tune.maxReplies": "Max replies per message",
  "tune.groupValueThresholdHint": "0–10 points. The bot scores every group message and replies only when the score is reached; the higher the score, the quieter the bot. 0 means it replies to every group message (prone to flooding). Messages that @ the bot bypass this and always get a reply.",
  "tune.atContextHint": "When the bot is @-mentioned, the latest N group messages are attached for context so the model understands the conversation. 0 sends only the @-mention itself. More context is smarter but costs more tokens.",
  "tune.minGroupIntervalHint": "In one group, two replies triggered without an @-mention are at least this far apart, preventing flooding. @-mention replies are not throttled.",
  "tune.sameSenderIntervalHint": "The same person will not get a second reply within this window, preventing one user from spamming the bot.",
  "tune.chunkCharsHint": "A single QQ message has a length limit; longer replies are split into chunks of this size and sent in order. Too small splits messages into fragments; too large gets truncated by the platform.",
  "tune.maxRepliesHint": "How many passive replies one user message may trigger at most (the QQ platform hard-caps at 5). Lower it to avoid the bot sending many messages at once.",
  // ── conn ──
  "conn.title": "Connection & removal",
  "conn.hint": "Manage the bot’s enabled state, set it as primary, rebuild the QQ long connection, or delete the integration.",
  "conn.disableBot": "Disable this bot",
  "conn.enableBot": "Enable this bot",
  "conn.disableHint": "A disabled bot keeps no QQ long connection and neither receives nor replies to messages; other enabled bots are unaffected.",
  "conn.disable": "Disable",
  "conn.enable": "Enable",
  "conn.primaryHint": "When no bot is specified explicitly (config editing, proactive messages, scheduled tasks), the primary bot is the default. All enabled bots receive and reply simultaneously.",
  "conn.check": "Check connection",
  "conn.retry": "Retry connection",
  "conn.retryHint": "Rebuilds the QQ WebSocket long connection with the current credentials. Click this first when messages stop arriving.",
  "conn.checking": "Checking…",
  "conn.remove": "Remove integration",
  "conn.removeHint": "Deletes this bot’s credentials and configuration. It stops receiving messages immediately and the action cannot be undone.",
  "conn.setPrimary": "Set as primary bot",
  "conn.removeConfirm": "Remove bot {0}? It will stop receiving messages after removal.",
  // ── picker ──
  "picker.title": "Choose workspace directory",
  "picker.subtitle": "Browse level by level and pick the folder the bot may read files from",
  "picker.loading": "Reading directory…",
  "picker.upOneLevel": "Up one level",
  "picker.rowHint": "Click to select, double-click to enter",
  "picker.emptyDirs": "No subfolders in this directory",
  "picker.footerHint": "Click to select, double-click to enter; with nothing selected, the currently browsed directory is chosen",
  "picker.chooseFolder": "Choose this folder",
  // ── sched ──
  "sched.tabScheduled": "Scheduled",
  "sched.scopeCurrentBot": "Current bot",
  "sched.scopeCurrent": "Current",
  "sched.scopeAllBots": "All bots",
  "sched.groupTasks": "Group tasks",
  "sched.dmTasks": "Direct chats",
  "sched.lastFailed": "Last failed",
  "sched.form.scope": "Target chat",
  "sched.form.scopeHint": "Send to a group or a direct chat. After changing this, make sure the openid below matches.",
  "sched.form.scopeGroup": "Group",
  "sched.form.scopeDm": "Direct chat",
  "sched.form.recipient": "Recipient openid",
  "sched.form.recipientHint": 'The openid (long id starting with "o") of the group or user receiving the message. Once the bot has seen that group/user, ask the AI to run /session to look it up.',
  "sched.form.recipientPlaceholder": "group or user openid",
  "sched.form.type": "Schedule type",
  "sched.form.typeHintLegacy": "Daily = sent once at the set time each day; Interval = sent repeatedly every N minutes.",
  "sched.form.daily": "Daily (set time)",
  "sched.form.intervalLegacy": "Interval (minutes)",
  "sched.form.dailyTime": "Daily time",
  "sched.form.dailyTimeHint": "Asia/Shanghai time (UTC+8); click the field to pick a time.",
  "sched.form.intervalMinutes": "Interval minutes",
  "sched.form.intervalMinutesHint": "Minutes between sends, minimum 5. Shorter intervals consume more proactive-message quota.",
  "sched.form.sendModeLegacy": "Send mode",
  "sched.form.sendModeHintLegacy": "Direct = send the text below as-is at send time; AI = treat the text below as a prompt for the AI and send its generated reply (creates a session, costs tokens).",
  "sched.form.text": "Send text directly",
  "sched.form.aiLegacy": "Generate with AI",
  "sched.form.aiTask": "AI smart task (fetch data and decide whether to send)",
  "sched.form.aiTaskShort": "AI smart task",
  "sched.form.content": "Content",
  "sched.form.aiTaskContentHint": `A task instruction for the AI (e.g. "summarize yesterday's chat highlights", "alert me only if the price drops below 100"). At send time the AI fetches data with tools, processes it, and decides what to send; if there is nothing worth reporting it stays silent — no noise, and no proactive-message quota consumed.`,
  "sched.form.textContentHint": "Text sent as-is at send time, up to 2000 characters.",
  "sched.form.textPlaceholder": "e.g. summarize today's todos",
  "sched.form.aiTaskPlaceholder": "e.g. Summarize yesterday's chat highlights; say nothing if there are none",
  "sched.form.legacyPlaceholder": "e.g. drink some water",
  "sched.contentLegacy": "Scheduled message content",
  "sched.saveHintLegacy": "Takes effect immediately on save; the next send time is recomputed.",
  "sched.saveChanges": "Save changes",
  "sched.form.legacyPlaceholder3": "e.g. summarize today's todos",
  "sched.sectionTitle": "Scheduled messages & archive",
  "sched.sectionHint": "Scheduled messages: view/remove timed tasks set for this bot (both /schedule chat commands and AI-created ones). Archive: read-only view of recent locally archived messages, filtered by the current bot.",
  "sched.legacyTitle": "Scheduled message manager",
  "sched.legacyHint": "Lists all scheduled messages under this bot (daily and interval), each removable; removal takes effect immediately and is persisted.",
  "sched.viewScheduled": "View scheduled messages",
  "sched.archiveIntro": 'With "message archiving" on, sent/received messages are written to ~/.dsh/qqbot/archive/ (one file per day). This shows recent records read-only, newest first.',
  "sched.viewArchive": "View archive",
  "sched.dialogSubtitle": "All scheduled send tasks under this bot (from chat commands and AI alike)",
  "sched.loading": "Loading scheduled messages…",
  "sched.empty": "No scheduled messages yet. Send /schedule daily 09:00 text in chat, ask the AI to set one up, or click “+ New” above.",
  "sched.addNew": "+ New",
  "sched.newScheduled": "New scheduled message",
  "sched.sourceAiShort": "AI-generated",
  "sched.sourceSettings": "From settings",
  "sched.sourceAi": "From AI",
  "sched.sourceCommand": "From chat command",
  "sched.removing": "Removing…",
  "sched.removeConfirm": "Remove this scheduled message? It stops sending immediately.",
  "sched.disable": "Disable",
  "sched.disabled": "Disabled",
  "sched.disabling": "Disabling…",
  "sched.enabling": "Enabling…",
  "sched.disabledNoRun": "Disabled — will not run",
  "sched.disableConfirm": "Disable this scheduled task? It stops running until you re-enable it.",
  "sched.commandSource": "Command source",
  "sched.commandManual": "Manual command",
  "sched.commandAiScript": "AI-generate script",
  "sched.aiScriptPrompt": "AI script prompt",
  "sched.scriptGenerating": "Generating script…",
  "sched.scriptFailed": "Script generation failed",
  "sched.scriptReadyHint": "Runs once the script is ready; missed times are not replayed",
  "sched.scriptGeneratingHint": "Generating script… The command is filled in automatically when done, then the schedule resumes.",
  "sched.commandSourceHint": "Manual command = write the full command line yourself; AI-generate script = just describe the task, and AI writes the script in the background and fills in the command automatically.",
  "sched.aiScriptPromptHint": `Describe what this scheduled task should do (e.g. "fetch today's price from a page and print one line"). After saving, AI generates the script in the background: the task does not run until it is ready, then resumes on schedule (missed times are not replayed).`,
  "sched.title": "Scheduled task manager",
  "sched.hint": "Four triggers — daily / interval / cron / at — and three actions: text / AI smart task / run a command.",
  "sched.pending": "TBD",
  "sched.newTask": "New scheduled task",
  "sched.loadingTasks": "Loading scheduled tasks…",
  "sched.emptyTasks": "No scheduled tasks yet. Send /schedule daily 09:00 text in chat, ask the AI to set one up, or click “+ New” above.",
  "sched.removeTaskConfirm": "Delete this scheduled task? It stops firing immediately.",
  "sched.saveHint": "Takes effect immediately on save; the next run time is recomputed.",
  "sched.form.stepRecipient": "① Recipient",
  "sched.form.stepRecipientHint": "Decides which group or user this task sends to.",
  "sched.form.scopeHint2": "Group or direct chat; after changing this, make sure the openid below matches.",
  "sched.form.recipientHint2": "The openid of the group or user that receives the message. Once the bot has seen them, ask the AI to run /session to look it up.",
  "sched.form.stepTrigger": "② When it fires",
  "sched.form.stepTriggerHint": "Pick a trigger and fill in its parameters.",
  "sched.form.trigger": "Trigger",
  "sched.form.triggerHint": "daily = at a set time; interval = every N minutes; cron = a standard expression (with time zone); one-time at = an absolute time, removed after it fires.",
  "sched.form.dailyShort": "Daily",
  "sched.form.interval": "Interval",
  "sched.form.at": "One-time at",
  "sched.form.timeHint": "Interpreted in the selected time zone; click the field to use the time picker.",
  "sched.form.timezone": "Time zone",
  "sched.form.tzDailyHint": "daily defaults to China Standard Time; switch to cron if you need another time zone.",
  "sched.form.tzCronHint": "The cron expression is interpreted in this time zone.",
  "sched.form.tzAtHint": "The one-time time is interpreted in this time zone.",
  "sched.form.tzCustomOption": "Custom (enter an IANA time zone)",
  "sched.form.tzCustom": "Custom time zone",
  "sched.form.intervalHint": "Gap between two sends, minimum 5 minutes. Shorter intervals consume more proactive-message quota.",
  "sched.form.minutesUnit": "min",
  "sched.form.quick": "Quick",
  "sched.form.quick5m": "5m",
  "sched.form.quick10m": "10m",
  "sched.form.quick15m": "15m",
  "sched.form.quick30m": "30m",
  "sched.form.quick1h": "1h",
  "sched.form.quick2h": "2h",
  "sched.form.quick6h": "6h",
  "sched.form.quick12h": "12h",
  "sched.form.quick24h": "24h",
  "sched.form.cron": "Cron expression",
  "sched.form.cronHint": "Standard 5 fields: minute hour day month weekday (e.g. 0 9 * * 1-5 = 9am on weekdays). Supports */step, ranges, lists, and month/weekday names.",
  "sched.form.atTime": "One-time run at",
  "sched.form.atHint": "A one-off time — the task runs once and is then removed automatically.",
  "sched.form.weekdayFilter": "Weekday filter (optional)",
  "sched.form.weekdayHint": "Fires only on these weekdays; selecting none means every day. 0 = Sunday.",
  "sched.form.weekdayFilterShort": "Weekday filter",
  "sched.form.weekdays": "Weekdays",
  "sched.form.weekend": "Weekend",
  "sched.form.cronNoMatch": "No match within the next 5 years — check the expression",
  "sched.form.cronIncomplete": "Expression is incomplete or invalid (5 fields expected: minute hour day month weekday)",
  "sched.form.stepAction": "③ What it does",
  "sched.form.stepActionHint": "Pick an action. Except for plain text sending, every action can insert processing and a decision between “run” and “send”.",
  "sched.form.action": "Action",
  "sched.form.actionHint": "text = send as-is; AI smart task = treat the content as a task instruction and let the AI fetch data, process it, and decide whether to send; run command = deterministically run a command, then push it through the processing instruction and send gate.",
  "sched.form.tool": "Run a command and push its output",
  "sched.form.command": "Command to run",
  "sched.form.commandHint": "The server runs this command line at the scheduled time, captures stdout/stderr plus the exit code, then pushes the result to the user. Supports python / powershell -File / .bat / node / vbs (cscript //Nologo) / perl / php / ruby and more.",
  "sched.form.templates": "Templates",
  "sched.form.templateBat": "Batch file (.bat)",
  "sched.form.cwd": "Working directory (optional)",
  "sched.form.cwdHint": "Working directory for the command; leave empty for the plugin process directory. Recommended when the script uses relative paths.",
  "sched.form.cwdPlaceholder": "e.g. C:/scripts",
  "sched.form.cwdShort": "Working directory",
  "sched.form.timeout": "Execution timeout (seconds)",
  "sched.form.timeoutHint": "Maximum run time for the command; it is killed when exceeded. Default 120 seconds; raise up to 600 for slow scripts such as reports or crawlers.",
  "sched.form.env": "Environment variables (optional)",
  "sched.form.envHint": "One KEY=VALUE per line, injected into the command process; scripts read them via os.environ / process.env. Good for secrets, so they stay out of the command line (which appears in logs).",
  "sched.form.envShort": "Environment variables",
  "sched.form.resultMode": "Result handling",
  "sched.form.resultModeHint": "raw = push the command output as-is; ai = process it according to the “data processing instruction” first (recommended when output is long or noisy).",
  "sched.form.resultRaw": "raw: push raw output",
  "sched.form.resultAiLegacy": "ai: summarize with AI, then push",
  "sched.form.resultAi": "ai: process with AI, then push",
  "sched.form.dataInstruction": "Data processing instruction (optional)",
  "sched.form.dataInstructionHint": "Describe how the command output should be shaped before sending: filtering, sorting, row limits, fixed formats. Leave empty to use the built-in “condense into a short report” requirement.",
  "sched.form.dataInstructionPlaceholder": "e.g. Keep only orders created today, sorted by amount descending, at most 5; send nothing if there are none",
  "sched.form.dataInstructionShort": "Data processing instruction",
  "sched.form.goal": "Task goal (optional)",
  "sched.form.goalHint": "One line on what decision this task serves, so the AI understands intent when triaging.",
  "sched.form.goalPlaceholder": "e.g. watch a competitor's price moves",
  "sched.form.goalShort": "Task goal",
  "sched.form.notifyWhen": "Notify condition (optional)",
  "sched.form.notifyWhenHint": "State in plain language when it is worth interrupting people. When unmet, nothing is sent this round and no proactive-message quota is consumed.",
  "sched.form.notifyWhenPlaceholder": "e.g. notify only when the change exceeds 5% or an anomaly appears",
  "sched.form.notifyWhenShort": "Notify condition",
  "sched.form.selfCheck": "Self-check before sending",
  "sched.form.selfCheckHint": "When on, the draft is reviewed once more against the goal and notify condition before delivery; if it falls short, nothing is sent. For tool mode this is a second, independent model review; for ai mode it is a strengthened self-check.",
  "sched.form.checkOff": "Off",
  "sched.form.checkOn": "On",
  "sched.form.conditional": "Conditional",
  "sched.form.gate": "Send gate",
  "sched.form.gateHint": "The final check before delivering to QQ: changed suits “report only on change”, nonempty suits “alert only on output”. When blocked, nothing is delivered and no proactive-message quota is consumed.",
  "sched.form.gateAlways": "always: send every time (default)",
  "sched.form.gateNonempty": "nonempty: skip when there is no real output",
  "sched.form.gateChanged": "changed: skip when identical to the previous send",
  "sched.gateEmpty": "gate: skip if empty",
  "sched.gateUnchanged": "gate: skip if unchanged",
  "sched.lastSkipped": "last run skipped",
  "sched.lastSkippedPrefix": "Last skipped (",
  "sched.lastSkippedSep": "): ",
  "sched.nothingToSend": "nothing to send",
  "sched.form.legacyPlaceholder2": "e.g. drink some water",
  "sched.content": "Scheduled task content",
  "sched.form.summaryCommandToAi": "command → AI report",
  "sched.form.summaryCommandToAiProcess": "command → AI processing",
  "sched.form.summaryCommandToRaw": "command → raw output",
  "sched.form.recipientRequired": "Enter the recipient openid (group or user)",
  "sched.form.timeInvalid": "Time must look like HH:mm (e.g. 09:30)",
  "sched.form.intervalTooSmall": "Interval must be at least 5 minutes",
  "sched.form.cronInvalid": "Invalid cron expression (standard 5 fields, e.g. 0 9 * * 1-5)",
  "sched.form.atInvalid": "Pick a valid one-time date and time",
  "sched.form.atMustBeFuture": "The one-time time must be later than now",
  "sched.form.tzInvalid": "Invalid time zone (expected an IANA zone such as Asia/Shanghai)",
  "sched.form.commandRequired": "Enter the command to run (e.g. python C:/scripts/report.py)",
  "sched.form.contentRequired": "Content must not be empty",
  "sched.form.recipientHintPicker": "The openid of the group or user receiving messages. Click the field to pick from archived chats: group candidates show the group id, DM candidates show the user id and nickname; pasting one in works too.",
  "sched.testSentHint": "Test sent once (not counted against the proactive-message quota)",
  "sched.form.onShort": "on",
  "sched.form.offShort": "off",
  "sched.testSent": "Test sent once",
  "sched.testSendHint": "Send a test once (not counted against the proactive-message quota)",
  "sched.aiScriptRequired": "Enter the AI script prompt (e.g. fetch today's price from a webpage and print it)",
  "sched.aiScriptPlaceholder": "e.g. fetch today's price from https://example.com/price and print one line like “Today's price: xx yuan”",
  "sched.aiGenerating": "(AI generating) {0}",
  "sched.ownerBot": "This task belongs to bot {0}",
  "sched.nextSend": "Next send: {0}",
  "sched.nextRun": "Next run: {0}",
  "sched.next": "Next: {0}",
  "sched.lastSkippedFull": "Last skipped ({0}): {1}",
  "sched.current": "Current: {0}",
  "sched.totalCount": "{0} in total",
  "sched.totalCountPerChatMax": "{0} in total (max {1} per chat)",
  "sched.allBotsTotalCount": "All bots: {0} in total",
  "sched.allBotsCountPerChatMax": "All bots: {0} in total (max {1} per chat)",
  "sched.perChatMaxTasks": "Max {0} scheduled tasks per group/DM",
  "sched.form.dailyAt": "Daily at {0}",
  "sched.form.everyMinutes": "Every {0} min",
  "sched.form.everyHours": "Every {0} h",
  "sched.form.onceAt": "Once at {0}",
  "sched.form.every24h": "Every 24 h",
  "sched.form.weekdayPrefix": "Week {0}",
  "sched.form.localTz": "Local time zone · {0}",
  // ── archive ──
  "archive.tab": "Archive",
  "archive.subtitle": "Recent locally archived messages (read-only, newest first; filtered by the current bot)",
  "archive.subtitle2": "Locally archived messages (filtered by the current bot): pick a date on the left to view it, click × to delete that day's archive",
  "archive.loading": "Loading archive…",
  "archive.empty": 'No records on this day. Records appear here once "message archiving" is on and messages arrive.',
  "archive.dateFiles": "Archive date files",
  "archive.noFiles": "No archive files yet",
  "archive.deleteHint": "Delete this day's archive (only this bot's records)",
  "archive.received": "Received",
  "archive.reply": "Reply",
  "archive.proactive": "Proactive",
  "archive.session": "Session",
  "archive.showingLatest": "Showing latest {0} (older records remain in the archive files)",
  "archive.totalRecords": "{0} record(s) in total",
  "archive.recordCount": "{0} record(s)",
  "archive.deleteLabel": "Delete the {0} archive",
  "archive.deleteConfirm": "Delete the {0} archive records? This bot's records for that day are cleared; other bots' records are kept.",
  "archive.sessionLine": "Session {0}{1}{2}",
  // ── idpick ──
  "idpick.user": "User",
  "idpick.bot": "Bot",
  "idpick.title": "Archived chat candidates",
  "idpick.loading": "Loading archived chats…",
  "idpick.empty": "No chats of this type in the archive yet — you can paste an openid directly",
  "idpick.noMatch": "No matching candidates — you can paste an openid directly",
  "idpick.candidates": "{0} candidates — type to filter more",
  "idpick.groupRecentSpeaker": "Group · recent speaker: {0}",
  "idpick.groupIdLabel": "Group id: {0}",
  "idpick.userIdLabel": "User id: {0}",
  "idpick.memberSuffix": "{0} (member: {1})",
  // ── update ──
  "update.hint": "Check GitHub for a new version; if found it is downloaded and applied automatically. Restart DSH to take effect.",
  "update.updated": "Updated ✓",
  "update.check": "Check for updates",
  "update.checking": "Checking for updates…",
  "update.noNewVersion": "No new version (v{0} is the latest)",
  "update.found": "New version v{0} found; updating automatically…",
  "update.updatedTo": "Updated to v{0} (old files backed up in .update-backup/ inside the install directory). Restart DSH to take effect.",
  // ── replyLocale ──
  "replyLocale.label": "Reply language (replyLocale)",
  "replyLocale.labelShort": "Reply language",
  "replyLocale.hint": "Language for system texts the bot sends directly to QQ users (/help, /status, schedule usage, welcome message, etc.). Chinese is the source language; choosing English translates them, and unmatched texts stay as-is so no information is lost. AI conversation content is unaffected.",
  "replyLocale.zh": "Chinese (default)",
  // ── group ──
  "group.title": "Per-group config",
  "group.hint": "Override behavior settings (threshold/cooldowns/banned words/context, etc.) for specific groups; everything else follows the bot default. Useful for making one group more or less chatty without affecting others.",
  "group.empty": "No per-group overrides yet; every group uses the bot defaults above.",
  "group.overrideHint": "Fields left unset follow the bot default; clearing every field and saving removes the override for that group.",
  "group.add": "Add group override",
  "group.edit": "Edit group override",
  "group.group": "Group",
  "group.noOverrides": "No overridden fields",
  "group.required": "Please enter the group openid",
  "group.dialogHint": 'Fields left empty or set to "Follow default" keep using the bot-level config; changes apply to this group only.',
  "group.openid": "Group openid",
  "group.openidHint": 'The openid of the group to configure (a long id starting with "o"). Ask the AI to run /session in that group to find it.',
  "group.fullReply": "Full group reply",
  "group.fullReplyHint": "Whether non-@ messages in this group are value-scored and answered.",
  "group.followDefault": "Follow default",
  "group.valueThreshold": "Value threshold",
  "group.valueThresholdHint": "Only effective when full group reply is on: score 0-10; the bot replies at or above the threshold.",
  "group.atContext": "@ context messages",
  "group.atContextHint": "How many recent group messages are attached when someone @-mentions the bot.",
  "group.groupCooldown": "Group cooldown",
  "group.groupCooldownHint": "Minimum interval between two full replies in this group (@ replies are not limited).",
  "group.senderCooldown": "Per-sender cooldown",
  "group.senderCooldownHint": "Minimum interval between replies to the same sender in this group.",
  "group.chunkLength": "Chunk length",
  "group.chunkLengthHint": "Max characters per reply; longer replies are split into multiple messages.",
  "group.maxReplies": "Replies per message",
  "group.maxRepliesHint": "Max passive replies per user message in this group (platform limit: 5).",
  "group.markdownHint": "Whether replies in this group prefer QQ Markdown.",
  "group.memoryHint": "Whether this group maintains cross-session long-term memory.",
  "group.bannedWordsHint": "Banned words that only apply to this group (comma-separated). A hit recalls the message and skips the reply; combined with bot-level banned words.",
  "group.bannedWordsPlaceholder": "word1, word2 (leave empty to follow default)",
  "group.saveHint": "Takes effect immediately after saving — no restart needed",
  "group.overrideRequired": 'Set at least one override field: leaving everything at "Follow default" is the same as not adding this group override.',
  "group.openidHintPicker": 'The openid of the group to configure (a long id starting with "o"). Click the field to pick from archived chats — candidates are labelled "Group id"; pasting one in works too.',
  "group.removeConfirm": "Delete the override for group {0}? That group will fall back to the bot's default config.",
  "group.summaryFullReply": "Full reply {0}",
  "group.summaryThreshold": "Threshold {0}",
  "group.summaryContext": "Context {0} msgs",
  "group.summaryGroupCooldown": "Group cooldown {0}",
  "group.summarySenderCooldown": "Sender cooldown {0}",
  "group.summaryChunk": "Chunk {0}",
  "group.summaryMaxReplies": "Max {0} replies",
  "group.summaryMarkdown": "Markdown {0}",
  "group.summaryMemory": "Memory {0}",
  "group.summaryBannedWords": "{0} banned words",
  "group.summaryChatPreset": "Chat preset {0}",
  // ── tz ──
  "tz.shanghai": "China Standard Time · Asia/Shanghai (UTC+8)",
  "tz.hongkong": "Hong Kong, China · Asia/Hong_Kong (UTC+8)",
  "tz.taipei": "Taiwan, China · Asia/Taipei (UTC+8)",
  "tz.singapore": "Singapore · Asia/Singapore (UTC+8)",
  "tz.tokyo": "Japan · Asia/Tokyo (UTC+9)",
  "tz.seoul": "Korea · Asia/Seoul (UTC+9)",
  "tz.kolkata": "India · Asia/Kolkata (UTC+5:30)",
  "tz.dubai": "UAE · Asia/Dubai (UTC+4)",
  "tz.moscow": "Russia · Europe/Moscow (UTC+3)",
  "tz.berlin": "Central Europe · Europe/Berlin (UTC+1/+2)",
  "tz.london": "United Kingdom · Europe/London (UTC+0/+1)",
  "tz.saopaulo": "Brazil · America/Sao_Paulo (UTC-3)",
  "tz.newyork": "US Eastern · America/New_York (UTC-5/-4)",
  "tz.chicago": "US Central · America/Chicago (UTC-6/-5)",
  "tz.denver": "US Mountain · America/Denver (UTC-7/-6)",
  "tz.losangeles": "US Pacific · America/Los_Angeles (UTC-8/-7)",
  "tz.sydney": "Australia · Australia/Sydney (UTC+10/+11)",
  "tz.auckland": "New Zealand · Pacific/Auckland (UTC+12/+13)",
  "tz.utc": "Coordinated Universal Time · UTC (UTC+0)",
  // ── err ──
  "err.noBotAvailable": "No bot available (add a bot first)",
  "err.appIdSecretRequired": "appId and appSecret are required",
  "err.missingAppId": "Missing appId",
  "err.missingId": "Missing id",
  "err.missingScopeOpenid": "Missing scope/openid",
  "err.scopeOpenidContentRequired": "scope/openid/content are required",
  "err.enabledMustBeBoolean": "enabled must be a boolean",
  "err.schedulerUnavailable": "Scheduler unavailable",
  "err.botNotExists": "Bot does not exist",
  "err.qrMissingCreds": "QR scan result is missing credentials",
  "err.emptyResponse": "Empty response",
  "err.badType": "type must be one of daily / interval / cron / at",
  "err.contentTooLong": "Content too long (limit: 2000 characters)",
  "err.commandRequiredForTool": "Command mode requires a command to run (e.g. python C:/scripts/report.py), or an AI script prompt",
  "err.aiScriptPromptTooLong": "AI script prompt too long (limit: 2000 characters)",
  "err.cwdMustBeString": "Working directory (cwd) must be a string",
  "err.badResultMode": "Result handling (resultMode) must be raw or ai",
  "err.badWeekdays": "weekdays must be a non-empty numeric array",
  "err.badWeekdayValue": "weekdays entries must be 0-6 (0 = Sunday)",
  "err.badAtIso": "at must be a valid ISO time",
  "err.badTimeShanghai": "time must look like HH:mm (Shanghai time, e.g. 09:30)",
  "err.taskNotFound": "Scheduled task not found",
  "err.messageNotFound": "Scheduled message not found",
  "err.taskGone": "Scheduled task not found (it may have been removed)",
  "err.dispatchedNoBus": "Dispatched (no session bus in this environment; delivery cannot be confirmed — check the chat later)",
  "err.dispatchedNoId": "Dispatched (no deliveryId; delivery cannot be confirmed — check the chat later)",
  "err.botNotFoundPrefix": "Bot not found: {0}",
  "err.dirNotExistPrefix": "Directory does not exist: {0}",
  "err.notADirPrefix": "Not a directory: {0}",
  "err.dirUnreadablePrefix": "Cannot read directory: {0}",
  // ── weekday ──
  "weekday.mon": "Mon",
  "weekday.tue": "Tue",
  "weekday.wed": "Wed",
  "weekday.thu": "Thu",
  "weekday.fri": "Fri",
  "weekday.sat": "Sat",
  "weekday.sun": "Sun",
  // ── override ──
  "override.scoreOption": "{0} pt",
  "override.countOption": "{0} msgs",
  "override.charsOption": "{0} chars",
  "override.perDayOption": "{0}/day",
  // ── unit ──
  "unit.minutes": "{0} min",
  "unit.seconds": "{0} s"
});

// src/client/i18n/index.ts
var QQBOT_LOCALE_NAMESPACE = "dsh-qqbot";
var HOST_TO_OURS = Object.freeze({
  zh: "cn",
  "zh-CN": "cn",
  cn: "cn",
  en: "en",
  "en-US": "en"
});
var currentLocale = "cn";
var lookup;
var listeners = /* @__PURE__ */ new Set();
var hostBound = false;
function setTranslator(next) {
  lookup = typeof next === "function" ? next : void 0;
  hostBound = typeof next === "function";
  emit();
}
function setLocale(locale) {
  const mapped = HOST_TO_OURS[locale] ?? (locale === "en" ? "en" : "cn");
  if (mapped === currentLocale) return;
  currentLocale = mapped;
  emit();
}
function emit() {
  for (const fn of listeners) fn();
}
function isEnglish() {
  return currentLocale === "en";
}
function t(key) {
  if (!key) return key;
  if (hostBound && lookup) {
    const hit = lookup(key);
    if (typeof hit === "string" && hit) return hit;
  }
  const table = currentLocale === "en" ? en : cn;
  return table[key] ?? key;
}
function fmt(key, ...args) {
  const template = t(key);
  if (!args.length) return template;
  return template.replace(/\{(\d+)\}/g, (whole, idx) => {
    const i = Number(idx);
    return i < args.length ? String(args[i]) : whole;
  });
}
var ZH_TO_KEY = Object.freeze(
  Object.fromEntries(Object.entries(cn).map(([key, zh]) => [zh, key]))
);
function localizeText(value) {
  if (typeof value !== "string" || !value) return value;
  if (keyExists(value)) return t(value);
  const key = ZH_TO_KEY[value];
  if (key) return t(key);
  return value;
}
function keyExists(key) {
  return Object.prototype.hasOwnProperty.call(cn, key);
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
var hostDictionaries = Object.freeze({ zh: cn, en });
var HOST_LOCALES = Object.freeze(["zh", "en"]);

// src/client/types.ts
var EMPTY_CATALOGS = { models: [], agentPresets: [] };

// src/client/meta.ts
var FIELD_LABELS = {
  workspacePath: t("session.workspace"),
  agentPreset: "Agent Preset",
  model: t("session.model"),
  valueThreshold: t("tune.groupValueThreshold"),
  atContextMessages: t("tune.atContext"),
  groupCooldownMs: t("tune.minGroupInterval"),
  senderCooldownMs: t("tune.sameSenderInterval"),
  replyChunkChars: t("tune.chunkChars"),
  maxRepliesPerMessage: t("tune.maxReplies"),
  quoteMaxChars: t("policy.quoteLimit"),
  quotaPerDay: t("quota.daily")
};
var FIELD_HELP = {
  valueThreshold: t("tune.groupValueThresholdHint"),
  atContextMessages: t("tune.atContextHint"),
  groupCooldownMs: t("tune.minGroupIntervalHint"),
  senderCooldownMs: t("tune.sameSenderIntervalHint"),
  replyChunkChars: t("tune.chunkCharsHint"),
  maxRepliesPerMessage: t("tune.maxRepliesHint"),
  quoteMaxChars: t("policy.quoteLimitHint"),
  quotaPerDay: t("quota.dailyHint")
};
var SWITCH_DEFS = [
  {
    key: "groupFullReply",
    label: t("policy.fullGroupReply"),
    desc: t("policy.fullGroupReplyHint"),
    def: true
  },
  {
    key: "respondToBots",
    label: t("policy.respondBots"),
    desc: t("policy.respondBotsHint"),
    def: false
  },
  // archiveEnabled / memoryEnabled / fileIngestion 已从界面移除（默认常开，仅 bots.json 可配）——
  // 见本文件顶部注释；配置解析与默认值仍在 shared/config.ts 与 store-file.ts 中保留。
  {
    key: "approvalButtons",
    label: t("feature.buttonApproval"),
    desc: t("feature.buttonApprovalHint"),
    def: true
  },
  {
    key: "ssrfGuard",
    label: t("feature.ssrfGuard"),
    desc: t("feature.ssrfGuardHint"),
    def: true
  }
];
var COOLDOWN_OPTIONS = [0, 1e4, 3e4, 6e4, 12e4, 3e5, 6e5, 18e5];
function cooldownLabel(ms) {
  if (ms === 0) return t("common.unlimited");
  if (ms % 6e4 === 0 && ms >= 6e4) return fmt("unit.minutes", ms / 6e4);
  return fmt("unit.seconds", ms / 1e3);
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
function useCountdown(activeKey, seconds, onExpire) {
  const [left, setLeft] = React2.useState(0);
  React2.useEffect(() => {
    if (!activeKey) {
      setLeft(0);
      return;
    }
    let remain = seconds;
    setLeft(remain);
    const id = setInterval(() => {
      remain -= 1;
      if (remain <= 0) {
        clearInterval(id);
        setLeft(0);
        onExpire();
        return;
      }
      setLeft(remain);
    }, 1e3);
    return () => clearInterval(id);
  }, [activeKey, seconds]);
  return left;
}
function countdownBadge(left) {
  return h("span", { className: "qbot-noticeCount", key: "countdown" }, `${left}s`);
}
function errText(err) {
  if (err == null) return t("common.unknownError");
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
  { value: "", label: t("session.followHostDefault") },
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
    { className: "qbot-confirmOverlay", role: "alertdialog", "aria-modal": "true", "aria-label": t("common.confirmTitle") },
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
          pending.cancelLabel ?? t("common.cancel")
        ),
        h("button", {
          type: "button",
          autoFocus: true,
          className: `qbot-btn ${pending.danger ? "qbot-btnDanger" : "qbot-btnPrimary"}`,
          onClick: () => done(true)
        }, pending.confirmLabel ?? t(pending.danger ? "common.confirmDelete" : "common.ok"))
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
.qbot-infoNotice { display: flex; align-items: flex-start; gap: 10px; padding: 13px 15px; border: 1px solid color-mix(in srgb, var(--qbot-business) 22%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 10px; color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 7%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 13px; line-height: 1.5; animation: qbotNoticeOut 8s ease-in forwards; }
/* 提示条右侧倒计时胶囊：右对齐、等宽数字、随 8s 自动消失同步归零。 */
.qbot-noticeCount { margin-left: auto; flex: none; align-self: flex-start; font-variant-numeric: tabular-nums; font-weight: 600; font-size: 12px; line-height: 1.4; padding: 1px 9px; border-radius: 999px; white-space: nowrap; background: color-mix(in srgb, var(--qbot-business) 14%, var(--dsw-alias-bg-layer-1, #fff)); border: 1px solid color-mix(in srgb, var(--qbot-business) 28%, var(--dsw-alias-border-l2, #dfe1e5)); }
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
.qbot-schedNotice { margin: 8px; padding: 8px 12px; border-radius: 8px; font-size: 12px; line-height: 1.5; border: 1px solid color-mix(in srgb, var(--qbot-business) 34%, transparent); background: color-mix(in srgb, var(--qbot-business) 8%, transparent); color: var(--qbot-business); flex: none; }
.qbot-schedNotice.is-error { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 34%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 8%, transparent); color: var(--dsw-alias-state-error-primary, #d54941); }
/* 成功提示：8 秒内保持可读，最后 0.8s 淡出后由组件卸载（见自动收起定时器） */
@keyframes qbotNoticeOut { 0%, 90% { opacity: 1; } 100% { opacity: 0; } }
.qbot-schedNotice.is-autoHide { animation: qbotNoticeOut 8s ease-in forwards; }
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
.qbot-heroFoot { display: flex; align-items: flex-start; gap: 10px; margin: 0 20px 18px; padding: 10px 13px; border: 1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 24%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 9px; color: var(--dsw-alias-label-secondary, #646a73); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 7%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; }

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
            setNotice(fmt("notice.qrLinked", current.appId ?? ""));
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
      setNotice(fmt("notice.credentialsSaved", appId));
      await onBotReady(appId);
    } else {
      setNotice(fmt("notice.saveFailedPrefix", errText(res.error)));
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
    h("span", { className: "qbot-noteTitle" }, t("common.note")),
    h("ul", null, notes.map((n, i) => h("li", { key: i }, n)))
  );
  const qrStatusText = qr?.status === "success" ? t("qr.linked") : qr?.status === "failure" ? t("qr.failed") : qrRefreshing ? t("qr.refreshing") : qrPending ? t("qr.waitingScan") : t("qr.notGenerated");
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
          qr?.qrCodeDataUrl ? h("img", { src: qr.qrCodeDataUrl, alt: t("qr.alt") }) : h(
            "div",
            { className: "qbot-qrPlaceholder" },
            h("span", { className: "qbot-qrPlaceholderIcon", "aria-hidden": "true" }, h(QqLogoGlyph)),
            h("strong", null, qrRefreshing ? t("qr.refreshingNow") : t("qr.noQrYet")),
            h(
              "span",
              { className: "qbot-qrPlaceholderHint" },
              qrRefreshing ? t("qr.soonNewQr") : t("qr.clickGenerate")
            )
          )
        ),
        h(
          "div",
          { className: "qbot-countdown" },
          h(
            "div",
            { className: "qbot-countdownTop" },
            h("span", null, t("qr.validFor")),
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
            qrPending ? t("qr.regenerate") : t("qr.generate")
          ),
          qrPending ? h("button", { className: "qbot-btn", type: "button", onClick: cancelQr }, t("qr.cancelScan")) : null
        )
      ),
      h(
        "div",
        { className: "qbot-qrCopy" },
        StateLabel({ tone: qrStatusTone, text: qrStatusText }),
        h("h3", null, t("qr.title")),
        h(
          "p",
          { className: "qbot-qrLead" },
          t("qr.intro")
        ),
        guideBlock(t("qr.steps"), [
          { title: t("qr.generate"), desc: t("qr.step1") },
          { title: t("qr.stepTitleScan"), desc: t("qr.step2") },
          { title: t("qr.stepTitleConfirm"), desc: t("qr.step3") },
          { title: t("qr.stepTitleRedirect"), desc: t("qr.step4") }
        ]),
        qr?.status === "failure" ? h("p", { className: "qbot-qrError" }, qr.error ?? t("qr.failed")) : null,
        noteList([
          t("qr.note1"),
          t("qr.note2"),
          t("qr.note3")
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
        h("h3", null, t("manual.title")),
        h("p", null, t("manual.intro"))
      ),
      guideBlock(t("manual.step1Title"), [
        { title: t("manual.openPlatform"), desc: t("manual.step1a") },
        { title: t("manual.pickBot"), desc: t("manual.step1b") },
        { title: t("manual.copyCreds"), desc: t("manual.step1c") }
      ]),
      h(
        "div",
        { className: "qbot-guideBlock" },
        h("span", { className: "qbot-guideTitle" }, t("manual.step2Title")),
        h(
          "div",
          { className: "qbot-credentialForm" },
          Field(
            { label: "AppID" },
            TextInput({
              value: manual.appId,
              placeholder: t("manual.appIdPlaceholder"),
              onChange: (e) => setManual({ ...manual, appId: e.target.value })
            })
          ),
          Field(
            { label: "AppSecret" },
            TextInput({
              type: "password",
              value: manual.appSecret,
              placeholder: t("manual.appSecretPlaceholder"),
              onChange: (e) => setManual({ ...manual, appSecret: e.target.value })
            })
          )
        ),
        h(
          "div",
          { className: "qbot-credentialActions" },
          h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: saveManual }, t("manual.saveAndEnable"))
        )
      ),
      noteList([
        t("manual.note1"),
        t("manual.note2"),
        t("manual.note3"),
        t("manual.note4")
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
      h("button", { className: "qbot-btn", type: "button", onClick: onBack }, t("add.backToList"))
    ),
    h(
      "header",
      { className: "qbot-addHead" },
      h("h2", null, t("add.title")),
      h(
        "p",
        null,
        t("add.intro")
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
      }, t("qr.tabScan")),
      h("button", {
        type: "button",
        role: "tab",
        "aria-selected": addTab === "manual",
        onClick: () => setAddTab("manual")
      }, t("qr.tabManual"))
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
      const t2 = cur.trim();
      if (!t2 || /^```/.test(t2) || /^(#{1,6})\s/.test(t2) || /^[-*]\s/.test(t2) || /^\d+[.)]\s/.test(t2) || /^>\s?/.test(t2)) break;
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
    if (!await confirmDlg({ message: fmt("archive.deleteConfirm", day), danger: true })) return;
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
      { className: "qbot-modal qbot-modalWide", role: "dialog", "aria-modal": "true", "aria-label": t("archive.tab") },
      h(
        "div",
        { className: "qbot-modalHead" },
        h(
          "div",
          null,
          h("strong", null, t("archive.tab")),
          h("p", null, t("archive.subtitle2"))
        ),
        h("button", { className: "qbot-modalClose", type: "button", "aria-label": t("common.close"), onClick: onClose }, "×")
      ),
      // 报错固定条：常驻弹窗头部下方（读取/删除失败时不随内容滚动）。
      archiveModal.error ? h("div", { className: "qbot-modalAlert", role: "alert" }, archiveModal.error) : null,
      h(
        "div",
        { className: `qbot-archSplit${archiveModal.loading && archiveModal.records.length > 0 ? " is-refreshing" : ""}` },
        // 左栏：归档日期文件（点击切换内容，× 删除该天归档）
        h(
          "div",
          { className: "qbot-archSide", "aria-label": t("archive.dateFiles") },
          archiveModal.days.length === 0 && !archiveModal.loading ? h("div", { className: "qbot-archSideEmpty" }, t("archive.noFiles")) : archiveModal.days.map((d) => {
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
                  title: fmt("archive.recordCount", d.count)
                },
                h("span", { className: "qbot-archMonthName" }, d.day),
                h("span", { className: "qbot-archMonthCount" }, `${d.count}`)
              ),
              h("button", {
                type: "button",
                className: "qbot-archMonthDel",
                "aria-label": fmt("archive.deleteLabel", d.day),
                title: t("archive.deleteHint"),
                onClick: () => void removeArchiveDayFile(d.day)
              }, "×")
            );
          })
        ),
        // 右栏：选中日期的记录内容
        h(
          "div",
          { className: "qbot-archMain" },
          archiveModal.loading && archiveModal.records.length === 0 ? h("div", { className: "qbot-modalState" }, h("span", { className: "qbot-spinner", "aria-hidden": "true" }), t("archive.loading")) : archiveModal.records.length === 0 ? h("div", { className: "qbot-modalState" }, t("archive.empty")) : h(
            "div",
            { className: "qbot-timeline" },
            archiveModal.records.map((r, i) => {
              const key = `${r.ts ?? ""}-${i}`;
              if (r.kind === "session") {
                return h(
                  "div",
                  { key, className: "qbot-tlSystem" },
                  fmt("archive.sessionLine", formatTime(r.ts), r.content ? ` · ${String(r.content)}` : "", r.note ? ` · ${String(r.note)}` : "")
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
                    h("span", { className: "qbot-tlRole" }, isUser ? t("idpick.user") : t("idpick.bot")),
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
          archiveModal.moreAvailable ? fmt("archive.showingLatest", archiveModal.records.length) : fmt("archive.totalRecords", archiveModal.records.length)
        ),
        h(
          "div",
          { className: "qbot-viewActions" },
          h("button", { className: "qbot-btn", type: "button", disabled: archiveModal.loading, onClick: () => void loadArchiveDays(archiveModal.activeDay) }, t("common.refresh")),
          h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: onClose }, t("common.close"))
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
  const itemTitle = (c) => scope === "c2c" ? c.name || t("idpick.user") : c.lastSenderName ? fmt("idpick.groupRecentSpeaker", c.lastSenderName) : t("sched.form.scopeGroup");
  const idPrefix = scope === "group" ? t("idpick.groupIdLabel") : t("idpick.userIdLabel");
  return h(
    "div",
    { className: "qbot-idPicker", "data-open": open ? "true" : void 0 },
    h("input", {
      className: "qbot-input qbot-mono",
      value,
      readOnly: Boolean(readOnly),
      placeholder: placeholder ?? t("sched.form.recipientPlaceholder"),
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
      "aria-label": ariaLabel ?? t("sched.form.recipient")
    }),
    open && !readOnly ? h(
      "div",
      { className: "qbot-idPickerMenu", role: "listbox", "aria-label": t("idpick.title") },
      loading ? h("div", { className: "qbot-idPickerState" }, t("idpick.loading")) : error ? h("div", { className: "qbot-idPickerState" }, fmt("notice.archiveReadFailed", error)) : shown.length === 0 ? h(
        "div",
        { className: "qbot-idPickerState" },
        pool.length === 0 ? t("idpick.empty") : t("idpick.noMatch")
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
        list.length > shown.length ? h("div", { className: "qbot-idPickerState" }, fmt("idpick.candidates", list.length)) : null
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
  React6.useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 8e3);
    return () => clearTimeout(timer);
  }, [error]);
  const setOverrideField = (key, value) => {
    setError("");
    setDraft((prev) => ({ ...prev, [key]: value }));
  };
  const saveOverride = async () => {
    const d = draft;
    const openid = d.openid.trim();
    if (!openid) {
      setError(t("group.required"));
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
        setError(t("group.overrideRequired"));
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
        setError(r.error || t("common.saveFailed"));
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
      { className: "qbot-modal qbot-modalWide", role: "dialog", "aria-modal": "true", "aria-label": t("group.title") },
      h(
        "div",
        { className: "qbot-modalHead" },
        h(
          "div",
          null,
          h("strong", null, editOpenid ? t("group.edit") : t("group.add")),
          h("p", null, t("group.dialogHint"))
        ),
        h("button", { className: "qbot-modalClose", type: "button", "aria-label": t("common.close"), onClick: onClose }, "×")
      ),
      h(
        "div",
        { className: "qbot-modalList" },
        h(
          "div",
          { className: "qbot-editForm" },
          editRow(
            t("group.openid"),
            t("group.openidHintPicker"),
            h(OpenIdPicker, {
              chats: archiveChats.chats,
              scope: "group",
              value: String(draft.openid ?? ""),
              readOnly: Boolean(editOpenid),
              loading: archiveChats.loading,
              error: archiveChats.error,
              placeholder: t("group.openid"),
              onChange: (v) => setOverrideField("openid", v),
              ariaLabel: t("group.openid")
            })
          ),
          editRow(
            t("group.fullReply"),
            t("group.fullReplyHint"),
            h(
              "select",
              {
                className: "qbot-settingSelect",
                value: String(draft.groupFullReply),
                onChange: (ev) => setOverrideField("groupFullReply", ev.target.value),
                "aria-label": t("group.fullReply")
              },
              h("option", { value: "" }, t("group.followDefault")),
              h("option", { value: "on" }, t("conn.enable")),
              h("option", { value: "off" }, t("conn.disable"))
            )
          ),
          editRow(
            t("group.valueThreshold"),
            t("group.valueThresholdHint"),
            h(
              "select",
              {
                className: "qbot-settingSelect",
                value: String(draft.valueThreshold),
                onChange: (ev) => setOverrideField("valueThreshold", ev.target.value),
                "aria-label": t("group.valueThreshold")
              },
              h("option", { value: "" }, t("group.followDefault")),
              [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => h("option", { key: n, value: String(n) }, fmt("override.scoreOption", n)))
            )
          ),
          editRow(
            t("group.atContext"),
            t("group.atContextHint"),
            h(
              "select",
              {
                className: "qbot-settingSelect",
                value: String(draft.atContextMessages),
                onChange: (ev) => setOverrideField("atContextMessages", ev.target.value),
                "aria-label": t("group.atContext")
              },
              h("option", { value: "" }, t("group.followDefault")),
              [0, 2, 4, 6, 8, 10, 15, 20, 30, 50].map((n) => h("option", { key: n, value: String(n) }, n === 0 ? t("tune.offZero") : fmt("override.countOption", n)))
            )
          ),
          editRow(
            t("group.groupCooldown"),
            t("group.groupCooldownHint"),
            h(
              "select",
              {
                className: "qbot-settingSelect",
                value: String(draft.groupCooldownMs),
                onChange: (ev) => setOverrideField("groupCooldownMs", ev.target.value),
                "aria-label": t("group.groupCooldown")
              },
              h("option", { value: "" }, t("group.followDefault")),
              COOLDOWN_OPTIONS.map((n) => h("option", { key: n, value: String(n) }, cooldownLabel(n)))
            )
          ),
          editRow(
            t("group.senderCooldown"),
            t("group.senderCooldownHint"),
            h(
              "select",
              {
                className: "qbot-settingSelect",
                value: String(draft.senderCooldownMs),
                onChange: (ev) => setOverrideField("senderCooldownMs", ev.target.value),
                "aria-label": t("group.senderCooldown")
              },
              h("option", { value: "" }, t("group.followDefault")),
              COOLDOWN_OPTIONS.map((n) => h("option", { key: n, value: String(n) }, cooldownLabel(n)))
            )
          ),
          editRow(
            t("group.chunkLength"),
            t("group.chunkLengthHint"),
            h(
              "select",
              {
                className: "qbot-settingSelect",
                value: String(draft.replyChunkChars),
                onChange: (ev) => setOverrideField("replyChunkChars", ev.target.value),
                "aria-label": t("group.chunkLength")
              },
              h("option", { value: "" }, t("group.followDefault")),
              [200, 300, 500, 800, 1e3, 1500, 2e3, 3e3, 4e3].map((n) => h("option", { key: n, value: String(n) }, `${n}`))
            )
          ),
          editRow(
            t("group.maxReplies"),
            t("group.maxRepliesHint"),
            h(
              "select",
              {
                className: "qbot-settingSelect",
                value: String(draft.maxRepliesPerMessage),
                onChange: (ev) => setOverrideField("maxRepliesPerMessage", ev.target.value),
                "aria-label": t("group.maxReplies")
              },
              h("option", { value: "" }, t("group.followDefault")),
              [1, 2, 3, 4, 5].map((n) => h("option", { key: n, value: String(n) }, fmt("override.countOption", n)))
            )
          ),
          editRow(
            t("policy.markdown"),
            t("group.markdownHint"),
            h(
              "select",
              {
                className: "qbot-settingSelect",
                value: String(draft.markdownReply),
                onChange: (ev) => setOverrideField("markdownReply", ev.target.value),
                "aria-label": t("policy.markdown")
              },
              h("option", { value: "" }, t("group.followDefault")),
              h("option", { value: "on" }, t("conn.enable")),
              h("option", { value: "off" }, t("conn.disable"))
            )
          ),
          // 长期记忆（memoryEnabled）与聊天 Preset（agentPresetChat）已从界面移除
          //（默认常开/留空跟随 Agent Preset，仅 bots.json 可配）；
          // 草稿仍读取/回写这两个字段，避免保存时丢掉配置文件里已设置的值。
          editRow(
            t("feature.bannedWords"),
            t("group.bannedWordsHint"),
            TextArea({
              rows: 2,
              value: String(draft.bannedWords ?? ""),
              placeholder: t("group.bannedWordsPlaceholder"),
              onChange: (ev) => setOverrideField("bannedWords", ev.target.value),
              "aria-label": t("feature.bannedWords")
            })
          )
        )
      ),
      h(
        "div",
        { className: "qbot-modalFoot" },
        error ? h("p", { className: "qbot-footError", role: "alert" }, error) : h("span", { className: "qbot-hint" }, t("group.saveHint")),
        h(
          "div",
          { className: "qbot-viewActions" },
          h("button", { className: "qbot-btn", type: "button", disabled: saving, onClick: onClose }, t("common.cancel")),
          h("button", {
            className: "qbot-btn qbot-btnPrimary",
            type: "button",
            disabled: saving,
            onClick: () => void saveOverride()
          }, saving ? t("common.saving") : t("common.save"))
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
  { v: 0, label: t("weekday.sun"), en: "Su" },
  { v: 1, label: t("weekday.mon"), en: "Mo" },
  { v: 2, label: t("weekday.tue"), en: "Tu" },
  { v: 3, label: t("weekday.wed"), en: "We" },
  { v: 4, label: t("weekday.thu"), en: "Th" },
  { v: 5, label: t("weekday.fri"), en: "Fr" },
  { v: 6, label: t("weekday.sat"), en: "Sa" }
];
function wdLabel(v) {
  const hit = WEEKDAYS.find((x) => x.v === v);
  return isEnglish() ? hit?.en ?? String(v) : hit?.label ?? String(v);
}
var TZ_LIST = [
  { value: "Asia/Shanghai", label: t("tz.shanghai") },
  { value: "Asia/Hong_Kong", label: t("tz.hongkong") },
  { value: "Asia/Taipei", label: t("tz.taipei") },
  { value: "Asia/Singapore", label: t("tz.singapore") },
  { value: "Asia/Tokyo", label: t("tz.tokyo") },
  { value: "Asia/Seoul", label: t("tz.seoul") },
  { value: "Asia/Kolkata", label: t("tz.kolkata") },
  { value: "Asia/Dubai", label: t("tz.dubai") },
  { value: "Europe/Moscow", label: t("tz.moscow") },
  { value: "Europe/Berlin", label: t("tz.berlin") },
  { value: "Europe/London", label: t("tz.london") },
  { value: "America/Sao_Paulo", label: t("tz.saopaulo") },
  { value: "America/New_York", label: t("tz.newyork") },
  { value: "America/Chicago", label: t("tz.chicago") },
  { value: "America/Denver", label: t("tz.denver") },
  { value: "America/Los_Angeles", label: t("tz.losangeles") },
  { value: "Australia/Sydney", label: t("tz.sydney") },
  { value: "Pacific/Auckland", label: t("tz.auckland") },
  { value: "UTC", label: t("tz.utc") }
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
  { label: t("sched.form.templateBat"), cmd: "C:/scripts/backup.bat" },
  { label: "Node", cmd: "node C:/scripts/sync.mjs" },
  { label: "VBS", cmd: "cscript //Nologo C:/scripts/task.vbs" },
  { label: "Perl", cmd: "perl C:/scripts/task.pl" }
];
var INTERVAL_PRESETS = [
  { v: 5, label: t("sched.form.quick5m") },
  { v: 10, label: t("sched.form.quick10m") },
  { v: 15, label: t("sched.form.quick15m") },
  { v: 30, label: t("sched.form.quick30m") },
  { v: 60, label: t("sched.form.quick1h") },
  { v: 120, label: t("sched.form.quick2h") },
  { v: 360, label: t("sched.form.quick6h") },
  { v: 720, label: t("sched.form.quick12h") },
  { v: 1440, label: t("sched.form.quick24h") }
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
function parseEnvText(text) {
  const out = {};
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const k = line.slice(0, eq).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(k)) continue;
    out[k] = line.slice(eq + 1).trim();
  }
  return Object.keys(out).length ? out : void 0;
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
    timeoutSec: 120,
    envText: "",
    resultMode: "raw",
    parsePrompt: "",
    gate: "always",
    goal: "",
    notifyWhen: "",
    verify: false,
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
    saving: false,
    maxPerChat: 15
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
        (prev) => prev ? {
          ...prev,
          loading: false,
          error: "",
          items: Array.isArray(v.schedules) ? v.schedules : [],
          maxPerChat: Number.isFinite(Number(v.maxPerChat)) ? Number(v.maxPerChat) : prev.maxPerChat
        } : prev
      );
    } else {
      setScheduleModal((prev) => prev ? { ...prev, loading: false, error: errText(res.error) } : prev);
    }
  };
  React7.useEffect(() => {
    if (!schedNotice) return;
    const timer = setTimeout(() => setSchedNotice(null), 8e3);
    return () => clearTimeout(timer);
  }, [schedNotice]);
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
        next ? { ok: true, text: fmt("sched.nextRun", formatTime(next.toISOString())) } : { ok: false, text: t("sched.form.cronNoMatch") }
      );
    } else if (e && e.type === "cron" && String(e.cron ?? "").trim()) {
      setCronPreview({ ok: false, text: t("sched.form.cronIncomplete") });
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
          // 超时以「秒」编辑（后端存毫秒），便于非技术用户理解。
          timeoutSec: entry.timeoutMs ? Math.round(Number(entry.timeoutMs) / 1e3) : 120,
          // 环境变量：每行 KEY=VALUE，提交时解析成对象。
          envText: entry.env && typeof entry.env === "object" ? Object.entries(entry.env).map(([k, v]) => `${k}=${v}`).join("\n") : "",
          resultMode: entry.resultMode === "ai" ? "ai" : "raw",
          parsePrompt: String(entry.parsePrompt ?? ""),
          gate: entry.gate === "nonempty" ? "nonempty" : entry.gate === "changed" ? "changed" : "always",
          goal: String(entry.goal ?? ""),
          notifyWhen: String(entry.notifyWhen ?? ""),
          verify: entry.verify === true,
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
      setScheduleModal((prev) => prev ? { ...prev, editError: t("sched.form.recipientRequired") } : prev);
      return;
    }
    if (e.type === "daily" && !/^\d{1,2}:\d{2}$/.test(String(e.time ?? ""))) {
      setScheduleModal((prev) => prev ? { ...prev, editError: t("sched.form.timeInvalid") } : prev);
      return;
    }
    if (e.type === "interval" && !(Number(e.minutes) >= 5)) {
      setScheduleModal((prev) => prev ? { ...prev, editError: t("sched.form.intervalTooSmall") } : prev);
      return;
    }
    if (e.type === "cron" && !isValidCron(String(e.cron ?? ""))) {
      setScheduleModal((prev) => prev ? { ...prev, editError: t("sched.form.cronInvalid") } : prev);
      return;
    }
    let atInstant = null;
    if (e.type === "at") {
      atInstant = datetimeLocalToInstant(String(e.atLocal ?? ""), String(e.tz || DEFAULT_TZ));
      if (!atInstant) {
        setScheduleModal((prev) => prev ? { ...prev, editError: t("sched.form.atInvalid") } : prev);
        return;
      }
      if (new Date(atInstant).getTime() <= Date.now()) {
        setScheduleModal((prev) => prev ? { ...prev, editError: t("sched.form.atMustBeFuture") } : prev);
        return;
      }
    }
    const tz = String(e.tz || DEFAULT_TZ).trim() || DEFAULT_TZ;
    if ((e.type === "cron" || e.type === "at") && !/^[A-Za-z]+(\/[A-Za-z_+-]+)?$|^UTC$/.test(tz)) {
      setScheduleModal((prev) => prev ? { ...prev, editError: t("sched.form.tzInvalid") } : prev);
      return;
    }
    if (e.mode === "tool") {
      const aiMode = String(e._cmdMode ?? "manual") === "ai";
      if (aiMode) {
        if (!String(e.genPrompt ?? "").trim()) {
          setScheduleModal((prev) => prev ? { ...prev, editError: t("sched.aiScriptRequired") } : prev);
          return;
        }
      } else if (!String(e.command ?? "").trim()) {
        setScheduleModal((prev) => prev ? { ...prev, editError: t("sched.form.commandRequired") } : prev);
        return;
      }
    } else if (!String(e.content ?? "").trim()) {
      setScheduleModal((prev) => prev ? { ...prev, editError: t("sched.form.contentRequired") } : prev);
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
      ...e.mode === "tool" ? {
        // 生成方式二选一：AI 生成脚本（只传描述词，宿主后台生成后回填 command）/ 手写命令。
        ...String(e._cmdMode ?? "manual") === "ai" ? { genPrompt: String(e.genPrompt ?? "").trim() } : {
          command: String(e.command ?? "").trim(),
          ...String(e.cwd ?? "").trim() ? { cwd: String(e.cwd).trim() } : {},
          ...Number(e.timeoutSec) > 0 ? { timeoutMs: Math.round(Number(e.timeoutSec) * 1e3) } : {},
          ...parseEnvText(String(e.envText ?? "")) ? { env: parseEnvText(String(e.envText ?? "")) } : {}
        },
        // 「加工 → 门控」两段对两种生成方式都生效（脚本生成完成后走同一条流水线）。
        resultMode: e.resultMode === "ai" ? "ai" : "raw",
        gate: e.gate === "nonempty" || e.gate === "changed" ? e.gate : "always",
        ...String(e.parsePrompt ?? "").trim() ? { parsePrompt: String(e.parsePrompt).trim() } : {}
      } : { content: String(e.content ?? "").trim() },
      // 任务契约：ai / tool 模式通用（text 是固定句子直发，无需分诊）。
      ...e.mode === "ai" || e.mode === "tool" ? {
        ...String(e.goal ?? "").trim() ? { goal: String(e.goal).trim() } : {},
        ...String(e.notifyWhen ?? "").trim() ? { notifyWhen: String(e.notifyWhen).trim() } : {},
        verify: e.verify === true
      } : {},
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
    if (!await confirmDlg({ message: t("sched.removeTaskConfirm"), danger: true })) return;
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
        message: t("sched.disableConfirm"),
        confirmLabel: t("common.confirmDisable"),
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
      setSchedNotice({ ok: true, text: typeof v.message === "string" ? v.message : t("sched.testSent") });
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
    return hit && hit.scope === "group" ? fmt("idpick.memberSuffix", short, name2) : `${short}（${name2}）`;
  };
  const summarizeType = (e) => {
    if (e.type === "cron") return `cron ${e.cron ?? ""}${e.tz && e.tz !== DEFAULT_TZ ? ` · ${e.tz}` : ""}`;
    if (e.type === "at") return fmt("sched.form.onceAt", e.at ? formatTime(e.at) : t("sched.pending"));
    if (e.type === "interval") {
      const m = Number(e.minutes ?? 0);
      return m >= 60 && m % 60 === 0 && m < 1440 ? fmt("sched.form.everyHours", m / 60) : m === 1440 ? t("sched.form.every24h") : fmt("sched.form.everyMinutes", m);
    }
    return fmt("sched.form.dailyAt", e.time ?? "--:--");
  };
  const weekdayText = (list) => {
    if (!list || list.length === 0 || list.length === 7) return t("sched.form.dailyShort");
    if (isEnglish()) return list.map((w) => WEEKDAYS.find((x) => x.v === w)?.en ?? String(w)).join(", ");
    return fmt("sched.form.weekdayPrefix", list.map((w) => WEEKDAYS.find((x) => x.v === w)?.label ?? String(w)).join("、"));
  };
  const tzSelect = (current) => {
    const local = localTimeZone();
    const options = [];
    if (!TZ_LIST.some((t2) => t2.value === local)) {
      options.push({ value: local, label: fmt("sched.form.localTz", local) });
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
          "aria-label": t("sched.form.timezone")
        },
        ...options.map(
          (o) => h(
            "option",
            { key: o.value, value: o.value },
            o.value === local && o.label.startsWith(t("status.localTimeZone")) ? o.label : o.label
          )
        ),
        h("option", { value: TZ_CUSTOM }, t("sched.form.tzCustomOption"))
      ),
      !isKnown ? TextInput({
        className: "qbot-input qbot-mono",
        value: String(current ?? ""),
        placeholder: "Asia/Shanghai",
        onChange: (ev) => setEditField("tz", ev.target.value),
        "aria-label": t("sched.form.tzCustom")
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
        { className: "qbot-weekdayRow", role: "group", "aria-label": t("sched.form.weekdayFilterShort") },
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
        h("button", { type: "button", className: "qbot-miniBtn", onClick: () => setWeekdays([]) }, t("sched.form.dailyShort")),
        h("button", { type: "button", className: "qbot-miniBtn", onClick: () => setWeekdays([1, 2, 3, 4, 5]) }, t("sched.form.weekdays")),
        h("button", { type: "button", className: "qbot-miniBtn", onClick: () => setWeekdays([0, 6]) }, t("sched.form.weekend")),
        h("span", { className: "qbot-weekdayHint" }, fmt("sched.current", weekdayText(list)))
      )
    );
  };
  const timeField = (e) => {
    if (e.type === "daily") {
      return h(
        "div",
        { className: "qbot-schedFieldRow" },
        editRow(
          t("sched.form.dailyTime"),
          t("sched.form.timeHint"),
          h("input", {
            type: "time",
            className: "qbot-input qbot-mono",
            value: String(e.time ?? ""),
            onChange: (ev) => setEditField("time", ev.target.value),
            "aria-label": t("sched.form.dailyTime")
          })
        ),
        editRow(t("sched.form.timezone"), t("sched.form.tzDailyHint"), tzSelect(String(e.tz || DEFAULT_TZ)))
      );
    }
    if (e.type === "interval") {
      return h(
        "div",
        { className: "qbot-schedFieldRow" },
        editRow(
          t("sched.form.intervalMinutes"),
          t("sched.form.intervalHint"),
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
              "aria-label": t("sched.form.intervalMinutes")
            }),
            h("span", { className: "qbot-schedUnit" }, t("sched.form.minutesUnit"))
          )
        ),
        h(
          "div",
          { className: "qbot-schedPresets" },
          h("span", { className: "qbot-schedPresetLabel" }, t("sched.form.quick")),
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
          t("sched.form.cron"),
          t("sched.form.cronHint"),
          TextInput({
            className: "qbot-input qbot-mono",
            value: String(e.cron ?? ""),
            placeholder: "0 9 * * 1-5",
            onChange: (ev) => setEditField("cron", ev.target.value),
            "aria-label": t("sched.form.cron")
          })
        ),
        editRow(t("sched.form.timezone"), t("sched.form.tzCronHint"), tzSelect(String(e.tz || DEFAULT_TZ)))
      );
    }
    return h(
      "div",
      { className: "qbot-schedFieldRow" },
      editRow(
        t("sched.form.atTime"),
        t("sched.form.atHint"),
        h("input", {
          type: "datetime-local",
          className: "qbot-input qbot-mono",
          value: String(e.atLocal ?? ""),
          onChange: (ev) => setEditField("atLocal", ev.target.value),
          "aria-label": t("sched.form.atTime")
        })
      ),
      editRow(t("sched.form.timezone"), t("sched.form.tzAtHint"), tzSelect(String(e.tz || DEFAULT_TZ)))
    );
  };
  const contractFields = (e) => [
    editRow(
      t("sched.form.goal"),
      t("sched.form.goalHint"),
      TextInput({
        className: "qbot-input",
        value: String(e.goal ?? ""),
        placeholder: t("sched.form.goalPlaceholder"),
        onChange: (ev) => setEditField("goal", ev.target.value),
        "aria-label": t("sched.form.goalShort")
      })
    ),
    editRow(
      t("sched.form.notifyWhen"),
      t("sched.form.notifyWhenHint"),
      TextArea({
        rows: 2,
        value: String(e.notifyWhen ?? ""),
        placeholder: t("sched.form.notifyWhenPlaceholder"),
        onChange: (ev) => setEditField("notifyWhen", ev.target.value),
        "aria-label": t("sched.form.notifyWhenShort")
      })
    ),
    editRow(
      t("sched.form.selfCheck"),
      t("sched.form.selfCheckHint"),
      h(
        "div",
        { className: "qbot-schedSeg", role: "group", "aria-label": t("sched.form.selfCheck") },
        h(
          "button",
          {
            type: "button",
            className: `qbot-segBtn${e.verify !== true ? " is-on" : ""}`,
            "aria-pressed": e.verify !== true,
            onClick: () => setEditField("verify", false)
          },
          t("sched.form.checkOff")
        ),
        h(
          "button",
          {
            type: "button",
            className: `qbot-segBtn${e.verify === true ? " is-on" : ""}`,
            "aria-pressed": e.verify === true,
            onClick: () => setEditField("verify", true)
          },
          t("sched.form.checkOn")
        )
      )
    )
  ];
  const actionField = (e) => {
    if (e.mode === "tool") {
      const aiMode = String(e._cmdMode ?? "manual") === "ai";
      return h(
        "div",
        { className: "qbot-schedFieldCol" },
        editRow(
          t("sched.commandSource"),
          t("sched.commandSourceHint"),
          h(
            "div",
            { className: "qbot-schedSeg", role: "group", "aria-label": t("sched.commandSource") },
            h(
              "button",
              {
                type: "button",
                className: `qbot-segBtn${!aiMode ? " is-on" : ""}`,
                "aria-pressed": !aiMode,
                onClick: () => setEditField("_cmdMode", "manual")
              },
              t("sched.commandManual")
            ),
            h(
              "button",
              {
                type: "button",
                className: `qbot-segBtn${aiMode ? " is-on" : ""}`,
                "aria-pressed": aiMode,
                onClick: () => setEditField("_cmdMode", "ai")
              },
              t("sched.commandAiScript")
            )
          )
        ),
        aiMode ? [
          editRow(
            t("sched.aiScriptPrompt"),
            t("sched.aiScriptPromptHint"),
            TextArea({
              rows: 3,
              value: String(e.genPrompt ?? ""),
              placeholder: t("sched.aiScriptPlaceholder"),
              onChange: (ev) => setEditField("genPrompt", ev.target.value),
              "aria-label": t("sched.aiScriptPrompt")
            })
          ),
          e.id && String(e.genStatus ?? "") === "pending" ? h("div", { className: "qbot-schedGen is-pending" }, t("sched.scriptGeneratingHint")) : null,
          e.id && String(e.genStatus ?? "") === "done" ? h("div", { className: "qbot-schedGen is-done" }, fmt("notice.scriptGenerated", String(e.command ?? ""))) : null,
          e.id && String(e.genStatus ?? "") === "error" ? h("div", { className: "qbot-schedGen is-error" }, fmt("notice.lastGenFailedRetry", String(e.genError ?? t("common.unknownError")))) : null
        ] : [
          editRow(
            t("sched.form.command"),
            t("sched.form.commandHint"),
            h(
              "div",
              { className: "qbot-schedCmd" },
              TextArea({
                rows: 3,
                className: "qbot-textarea qbot-mono",
                value: String(e.command ?? ""),
                placeholder: "python C:/scripts/report.py",
                onChange: (ev) => setEditField("command", ev.target.value),
                "aria-label": t("sched.form.command")
              }),
              h(
                "div",
                { className: "qbot-schedPresets" },
                h("span", { className: "qbot-schedPresetLabel" }, t("sched.form.templates")),
                CMD_TEMPLATES.map(
                  (t2) => h("button", { key: t2.label, type: "button", className: "qbot-miniBtn", onClick: () => setEditField("command", t2.cmd) }, t2.label)
                )
              )
            )
          ),
          editRow(
            t("sched.form.cwd"),
            t("sched.form.cwdHint"),
            TextInput({
              className: "qbot-input qbot-mono",
              value: String(e.cwd ?? ""),
              placeholder: t("sched.form.cwdPlaceholder"),
              onChange: (ev) => setEditField("cwd", ev.target.value),
              "aria-label": t("sched.form.cwdShort")
            })
          ),
          editRow(
            t("sched.form.timeout"),
            t("sched.form.timeoutHint"),
            TextInput({
              className: "qbot-input",
              type: "number",
              min: 1,
              max: 600,
              value: String(e.timeoutSec ?? 120),
              placeholder: "120",
              onChange: (ev) => setEditField("timeoutSec", ev.target.value),
              "aria-label": t("sched.form.timeout")
            })
          ),
          editRow(
            t("sched.form.env"),
            t("sched.form.envHint"),
            TextArea({
              rows: 2,
              className: "qbot-textarea qbot-mono",
              value: String(e.envText ?? ""),
              placeholder: "API_KEY=xxxx\nREPORT_DIR=D:/reports",
              onChange: (ev) => setEditField("envText", ev.target.value),
              "aria-label": t("sched.form.envShort")
            })
          )
        ],
        editRow(
          t("sched.form.resultMode"),
          t("sched.form.resultModeHint"),
          h(
            "select",
            {
              className: "qbot-settingSelect",
              value: e.resultMode === "ai" ? "ai" : "raw",
              onChange: (ev) => setEditField("resultMode", ev.target.value),
              "aria-label": t("sched.form.resultMode")
            },
            h("option", { value: "raw" }, t("sched.form.resultRaw")),
            h("option", { value: "ai" }, t("sched.form.resultAi"))
          )
        ),
        e.resultMode === "ai" ? editRow(
          t("sched.form.dataInstruction"),
          t("sched.form.dataInstructionHint"),
          TextArea({
            rows: 3,
            value: String(e.parsePrompt ?? ""),
            placeholder: t("sched.form.dataInstructionPlaceholder"),
            onChange: (ev) => setEditField("parsePrompt", ev.target.value),
            "aria-label": t("sched.form.dataInstructionShort")
          })
        ) : null,
        editRow(
          t("sched.form.gate"),
          t("sched.form.gateHint"),
          h(
            "select",
            {
              className: "qbot-settingSelect",
              value: e.gate === "nonempty" ? "nonempty" : e.gate === "changed" ? "changed" : "always",
              onChange: (ev) => setEditField("gate", ev.target.value),
              "aria-label": t("sched.form.gate")
            },
            h("option", { value: "always" }, t("sched.form.gateAlways")),
            h("option", { value: "nonempty" }, t("sched.form.gateNonempty")),
            h("option", { value: "changed" }, t("sched.form.gateChanged"))
          )
        ),
        ...contractFields(e)
      );
    }
    const contentRow = editRow(
      t("sched.form.content"),
      e.mode === "ai" ? t("sched.form.aiTaskContentHint") : t("sched.form.textContentHint"),
      TextArea({
        rows: 3,
        value: String(e.content ?? ""),
        placeholder: e.mode === "ai" ? t("sched.form.aiTaskPlaceholder") : t("sched.form.legacyPlaceholder2"),
        onChange: (ev) => setEditField("content", ev.target.value),
        "aria-label": t("sched.content")
      })
    );
    if (e.mode !== "ai") return contentRow;
    return h("div", { className: "qbot-schedFieldCol" }, contentRow, ...contractFields(e));
  };
  return h(
    "div",
    { className: "qbot-modalOverlay" },
    h(
      "div",
      { className: "qbot-modal qbot-modalWide", role: "dialog", "aria-modal": "true", "aria-label": t("sched.title") },
      h(
        "div",
        { className: "qbot-modalHead" },
        h(
          "div",
          null,
          h("strong", null, t("sched.title")),
          h("p", null, t("sched.hint"))
        ),
        h("button", { className: "qbot-modalClose", type: "button", "aria-label": t("common.close"), onClick: onClose }, "×")
      ),
      ed ? [
        h(
          "div",
          { key: "body", className: "qbot-modalBody" },
          h(
            "div",
            { className: "qbot-editForm qbot-schedForm" },
            section(
              t("sched.form.stepRecipient"),
              t("sched.form.stepRecipientHint"),
              h(
                "div",
                { className: "qbot-editGrid" },
                editRow(
                  t("sched.form.scope"),
                  t("sched.form.scopeHint2"),
                  h(
                    "select",
                    {
                      className: "qbot-settingSelect",
                      value: String(ed.scope),
                      onChange: (ev) => {
                        setEditField("openid", "");
                        setEditField("scope", ev.target.value);
                      },
                      "aria-label": t("sched.form.scope")
                    },
                    h("option", { value: "group" }, t("sched.form.scopeGroup")),
                    h("option", { value: "c2c" }, t("sched.form.scopeDm"))
                  )
                ),
                editRow(
                  t("sched.form.recipient"),
                  t("sched.form.recipientHintPicker"),
                  h(OpenIdPicker, {
                    chats: archiveChats.chats,
                    scope: ed.scope === "group" ? "group" : "c2c",
                    value: String(ed.openid ?? ""),
                    loading: archiveChats.loading,
                    error: archiveChats.error,
                    onChange: (v) => setEditField("openid", v),
                    ariaLabel: t("sched.form.recipient")
                  })
                )
              )
            ),
            section(
              t("sched.form.stepTrigger"),
              t("sched.form.stepTriggerHint"),
              h(
                "div",
                { className: "qbot-schedFieldCol" },
                editRow(
                  t("sched.form.trigger"),
                  t("sched.form.triggerHint"),
                  h(
                    "div",
                    { className: "qbot-schedSeg", role: "group", "aria-label": t("sched.form.trigger") },
                    [
                      { v: "daily", label: t("sched.form.dailyShort") },
                      { v: "interval", label: t("sched.form.interval") },
                      { v: "cron", label: "cron" },
                      { v: "at", label: t("sched.form.at") }
                    ].map(
                      (t2) => h(
                        "button",
                        {
                          key: t2.v,
                          type: "button",
                          className: `qbot-segBtn${ed.type === t2.v ? " is-on" : ""}`,
                          "aria-pressed": ed.type === t2.v,
                          onClick: () => {
                            setEditField("type", t2.v);
                            if (t2.v === "interval" && !(Number(ed.minutes) >= 5)) setEditField("minutes", 30);
                            if (t2.v === "cron" && !String(ed.cron ?? "").trim()) setEditField("cron", "0 9 * * *");
                          }
                        },
                        t2.label
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
                  t("sched.form.weekdayFilter"),
                  t("sched.form.weekdayHint"),
                  weekdayPicker(ed.weekdays)
                ) : null
              )
            ),
            section(
              t("sched.form.stepAction"),
              t("sched.form.stepActionHint"),
              h(
                "div",
                { className: "qbot-schedFieldCol" },
                editRow(
                  t("sched.form.action"),
                  t("sched.form.actionHint"),
                  h(
                    "select",
                    {
                      className: "qbot-settingSelect",
                      value: String(ed.mode ?? "text"),
                      onChange: (ev) => setEditField("mode", ev.target.value),
                      "aria-label": t("sched.form.action")
                    },
                    h("option", { value: "text" }, t("sched.form.text")),
                    h("option", { value: "ai" }, t("sched.form.aiTask")),
                    h("option", { value: "tool" }, t("sched.form.tool"))
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
            ed.appId && ed.appId !== detailAppId ? fmt("sched.ownerBot", `${ed.appId.slice(0, 4)}••••${ed.appId.slice(-4)}`) : t("sched.saveHint")
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
              t("common.cancel")
            ),
            h(
              "button",
              {
                className: "qbot-btn qbot-btnPrimary",
                type: "button",
                disabled: scheduleModal.saving,
                onClick: () => void saveScheduleEdit()
              },
              scheduleModal.saving ? t("common.saving") : ed.id ? t("sched.saveChanges") : t("common.create")
            )
          )
        )
      ] : h(
        "div",
        { className: `qbot-modalList${scheduleModal.loading && scheduleModal.items.length > 0 ? " is-refreshing" : ""}` },
        [
          schedNotice ? h(
            "div",
            { key: "notice", className: `qbot-schedNotice is-autoHide${schedNotice.ok ? "" : " is-error"}` },
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
              t("sched.scopeCurrentBot")
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
              t("sched.scopeAllBots")
            ),
            h(
              "button",
              { type: "button", className: "qbot-btn qbot-btnPrimary qbot-schedAdd", onClick: openScheduleCreate, "aria-label": t("sched.newTask") },
              t("sched.addNew")
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
              t("sched.loadingTasks")
            ) : h(
              "div",
              { key: "empty", className: "qbot-modalState" },
              t("sched.emptyTasks")
            ) : [{ scope: "group", title: t("sched.groupTasks") }, { scope: "c2c", title: t("sched.dmTasks") }].map((g) => {
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
                        e.enabled === false ? h("span", { className: "qbot-chip qbot-chipOff" }, t("sched.disabled")) : null,
                        h("span", { className: "qbot-chip is-active" }, summarizeType(e)),
                        e.mode === "ai" ? h("span", { className: "qbot-chip" }, t("sched.form.aiTaskShort")) : null,
                        e.mode === "tool" ? h(
                          "span",
                          { className: "qbot-chip" },
                          e.resultMode === "ai" ? t("sched.form.summaryCommandToAiProcess") : t("sched.form.summaryCommandToRaw")
                        ) : null,
                        e.mode === "tool" && e.gate && e.gate !== "always" ? h(
                          "span",
                          { className: "qbot-chip" },
                          e.gate === "nonempty" ? t("sched.gateEmpty") : t("sched.gateUnchanged")
                        ) : null,
                        (e.mode === "ai" || e.mode === "tool") && e.notifyWhen ? h("span", { className: "qbot-chip" }, t("sched.form.conditional")) : null,
                        (e.mode === "ai" || e.mode === "tool") && e.verify === true ? h("span", { className: "qbot-chip" }, t("sched.form.selfCheck")) : null,
                        Array.isArray(e.weekdays) && e.weekdays.length ? h("span", { className: "qbot-chip" }, weekdayText(e.weekdays)) : null,
                        e.lastError ? h("span", { className: "qbot-chip qbot-chipError" }, t("common.runFailed")) : null,
                        e.lastSkipAt ? h("span", { className: "qbot-chip qbot-chipInfo" }, t("sched.lastSkipped")) : null,
                        e.genStatus === "pending" ? h("span", { className: "qbot-chip qbot-chipInfo" }, t("sched.scriptGenerating")) : null,
                        e.genStatus === "error" ? h("span", { className: "qbot-chip qbot-chipError" }, t("sched.scriptFailed")) : null
                      ),
                      h(
                        "div",
                        { className: "qbot-schedContent" },
                        e.mode === "tool" && e.genStatus === "pending" ? fmt("sched.aiGenerating", String(e.genPrompt ?? "")) : e.mode === "tool" ? String(e.command ?? e.content ?? "") : String(e.content ?? "")
                      ),
                      h(
                        "div",
                        { className: "qbot-schedMeta" },
                        h(
                          "span",
                          null,
                          `${t(e.scope === "group" ? "sched.form.scopeGroup" : "idpick.user")} ${chatLabel(String(e.openid ?? ""))}`
                        ),
                        h(
                          "span",
                          null,
                          e.createdBy === "settings" ? t("sched.sourceSettings") : e.createdBy === "ai" ? t("sched.sourceAi") : t("sched.sourceCommand")
                        ),
                        h(
                          "span",
                          null,
                          e.enabled === false ? t("sched.disabledNoRun") : e.genStatus === "pending" ? t("sched.scriptReadyHint") : fmt("sched.next", e.nextRunAt ? formatTime(e.nextRunAt) : t("sched.pending"))
                        ),
                        e.lastError ? h("span", { className: "qbot-schedError" }, String(e.lastError)) : null,
                        e.lastSkipAt ? h(
                          "span",
                          null,
                          t("sched.lastSkippedPrefix"),
                          formatTime(e.lastSkipAt),
                          "）：",
                          String(e.lastSkipReason ?? t("sched.nothingToSend"))
                        ) : null
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
                          title: t("sched.testSendHint"),
                          disabled: scheduleTesting === String(e.id),
                          onClick: () => void runOnceSchedule(String(e.id))
                        },
                        scheduleTesting === String(e.id) ? t("common.testing") : t("common.test")
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
                        scheduleToggling === String(e.id) ? e.enabled === false ? t("sched.enabling") : t("sched.disabling") : e.enabled === false ? t("conn.enable") : t("sched.disable")
                      ),
                      h("button", { className: "qbot-btn qbot-schedEdit", type: "button", onClick: () => openScheduleEdit(e) }, t("common.edit")),
                      h(
                        "button",
                        {
                          className: "qbot-btn qbot-btnDanger qbot-schedRemove",
                          type: "button",
                          disabled: scheduleRemoving === String(e.id),
                          onClick: () => void removeSchedule(String(e.id))
                        },
                        scheduleRemoving === String(e.id) ? t("sched.removing") : t("common.delete")
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
          scheduleModal.maxPerChat > 0 ? scheduleModal.botScope === "all" ? fmt("sched.allBotsCountPerChatMax", scheduleModal.items.length, scheduleModal.maxPerChat) : fmt("sched.totalCountPerChatMax", scheduleModal.items.length, scheduleModal.maxPerChat) : scheduleModal.botScope === "all" ? fmt("sched.allBotsTotalCount", scheduleModal.items.length) : fmt("sched.totalCount", scheduleModal.items.length)
        ),
        h(
          "div",
          { className: "qbot-viewActions" },
          h("button", { className: "qbot-btn", type: "button", disabled: scheduleModal.loading, onClick: () => void loadSchedules(scheduleModal.botScope) }, t("common.refresh")),
          h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: onClose }, t("common.close"))
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
      { className: "qbot-modal", role: "dialog", "aria-modal": "true", "aria-label": t("picker.title") },
      h(
        "div",
        { className: "qbot-modalHead" },
        h(
          "div",
          null,
          h("strong", null, t("picker.title")),
          h("p", null, t("picker.subtitle"))
        ),
        h("button", { className: "qbot-modalClose", type: "button", "aria-label": t("common.close"), onClick: onClose }, "×")
      ),
      h(
        "div",
        { className: "qbot-modalPath qbot-mono" },
        picker.loading ? t("common.loading") : picker.selected || picker.path || "—"
      ),
      h(
        "div",
        { className: `qbot-modalList${picker.loading && picker.dirs.length > 0 ? " is-refreshing" : ""}` },
        picker.error ? h("div", { className: "qbot-modalState qbot-modalError" }, picker.error) : picker.loading && picker.dirs.length === 0 ? h("div", { className: "qbot-modalState" }, h("span", { className: "qbot-spinner", "aria-hidden": "true" }), t("picker.loading")) : [
          picker.parent ? h(
            "button",
            { key: "__up", type: "button", className: "qbot-dirRow", onClick: () => void browseTo(picker.parent ?? void 0) },
            h(FolderUpGlyph),
            t("picker.upOneLevel")
          ) : null,
          picker.dirs.map((d) => h(
            "button",
            {
              key: d.path,
              type: "button",
              className: `qbot-dirRow${picker.selected === d.path ? " is-selected" : ""}`,
              title: t("picker.rowHint"),
              onClick: () => setPicker((prev) => prev ? { ...prev, selected: d.path } : prev),
              onDoubleClick: () => void browseTo(d.path)
            },
            h(FolderGlyph),
            d.name
          )),
          !picker.loading && picker.dirs.length === 0 ? h("div", { className: "qbot-modalState" }, t("picker.emptyDirs")) : null
        ]
      ),
      h(
        "div",
        { className: "qbot-modalFoot" },
        h("span", { className: "qbot-hint" }, t("picker.footerHint")),
        h(
          "div",
          { className: "qbot-viewActions" },
          h("button", { className: "qbot-btn", type: "button", onClick: onClose }, t("common.cancel")),
          h("button", {
            className: "qbot-btn qbot-btnPrimary",
            type: "button",
            disabled: picker.loading || !picker.path,
            onClick: pickDirectory
          }, t("picker.chooseFolder"))
        )
      )
    )
  );
}

// src/client/index.tsx
var name = "qqbot-settings";
var inject = ["slots", "connection", "locale"];
var RPC_CHANNEL = "/qqbot-settings";
var NOTICE_TTL_SECONDS = 8;
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
      else setLoadError(errText(s.error ?? t("common.statusReadFailed")));
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
      const message = fmt("notice.saveFailedPrefix", errText(res.error));
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
  const noticeLeft = useCountdown(notice, NOTICE_TTL_SECONDS, () => setNotice(""));
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
    setNotice(res.ok ? t("notice.setPrimary") : fmt("notice.operationFailedPrefix", errText(res.error)));
    if (res.ok) await refresh();
  };
  const toggleEnabled = async (bot, enabled) => {
    setNotice("");
    const res = await rpcCall("bots.enable", { appId: bot.appId, enabled });
    setNotice(res.ok ? enabled ? t("notice.botEnabled") : t("notice.botDisabled") : fmt("notice.operationFailedPrefix", errText(res.error)));
    if (res.ok) await refresh();
  };
  const removeBot = async (bot) => {
    if (!await confirmDlg({ message: fmt("conn.removeConfirm", bot.appIdMasked), danger: true })) return;
    setNotice("");
    const res = await rpcCall("bots.remove", { appId: bot.appId });
    if (res.ok) {
      await refresh();
      setPage("list");
      setNotice(t("notice.botRemoved"));
    } else {
      setNotice(fmt("notice.removeFailedPrefix", errText(res.error)));
    }
  };
  const retryConnection = async () => {
    setNotice("");
    setReconnecting(true);
    try {
      const res = await rpcCall("bots.reconnect", detailAppId ? { appId: detailAppId } : {});
      if (res.ok) await refresh();
      setNotice(res.ok ? t("notice.reconnectStarted") : fmt("notice.retryFailedPrefix", errText(res.error)));
    } finally {
      setReconnecting(false);
    }
  };
  const runUpdateCheck = async () => {
    setUpdate({ busy: true, message: t("update.checking"), done: false });
    try {
      const res = await rpcCall("update.check");
      if (!res.ok) {
        setUpdate({ busy: false, message: fmt("notice.checkFailedPrefix", errText(res.error)), done: false });
        return;
      }
      const v = val(res) ?? {};
      if (!v.hasUpdate) {
        setUpdate({ busy: false, message: fmt("update.noNewVersion", v.current || "?"), done: false });
        return;
      }
      setUpdate({ busy: true, message: fmt("update.found", v.latest ?? "?"), done: false });
      const applied = await rpcCall("update.apply");
      if (applied.ok) {
        const r = val(applied) ?? {};
        setUpdate({
          busy: false,
          message: fmt("update.updatedTo", r.updatedTo ?? v.latest ?? "?"),
          done: true
        });
      } else {
        setUpdate({ busy: false, message: fmt("notice.updateFailedPrefix", errText(applied.error)), done: false });
      }
    } catch (error) {
      setUpdate({
        busy: false,
        message: fmt("notice.checkFailedPrefix", error instanceof Error ? error.message : String(error)),
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
    if (ov.groupFullReply !== void 0) parts.push(fmt("group.summaryFullReply", ov.groupFullReply ? t("sched.form.onShort") : t("sched.form.offShort")));
    if (ov.valueThreshold !== void 0) parts.push(fmt("group.summaryThreshold", String(ov.valueThreshold)));
    if (ov.atContextMessages !== void 0) parts.push(fmt("group.summaryContext", String(ov.atContextMessages)));
    if (ov.groupCooldownMs !== void 0) parts.push(fmt("group.summaryGroupCooldown", cooldownLabel(Number(ov.groupCooldownMs))));
    if (ov.senderCooldownMs !== void 0) parts.push(fmt("group.summarySenderCooldown", cooldownLabel(Number(ov.senderCooldownMs))));
    if (ov.replyChunkChars !== void 0) parts.push(fmt("group.summaryChunk", String(ov.replyChunkChars)));
    if (ov.maxRepliesPerMessage !== void 0) parts.push(fmt("group.summaryMaxReplies", String(ov.maxRepliesPerMessage)));
    if (ov.markdownReply !== void 0) parts.push(fmt("group.summaryMarkdown", ov.markdownReply ? t("sched.form.onShort") : t("sched.form.offShort")));
    if (ov.memoryEnabled !== void 0) parts.push(fmt("group.summaryMemory", ov.memoryEnabled ? t("sched.form.onShort") : t("sched.form.offShort")));
    if (Array.isArray(ov.bannedWords) && ov.bannedWords.length > 0) parts.push(fmt("group.summaryBannedWords", ov.bannedWords.length));
    if (typeof ov.agentPresetChat === "string" && ov.agentPresetChat) parts.push(fmt("group.summaryChatPreset", ov.agentPresetChat));
    return parts.length > 0 ? parts.join(" · ") : t("group.noOverrides");
  };
  const removeOverride = async (openid) => {
    if (!await confirmDlg({ message: fmt("group.removeConfirm", `${openid.slice(0, 10)}…`), danger: true })) return;
    const next = { ...groupOverrides };
    delete next[openid];
    await saveField("groupOverrides", next);
  };
  const modelGroups = () => {
    const groups = [];
    const index = /* @__PURE__ */ new Map();
    const seen = /* @__PURE__ */ new Set();
    const push = (groupLabel, option) => {
      if (seen.has(option.value)) return;
      seen.add(option.value);
      const at = index.get(groupLabel);
      if (at === void 0) {
        index.set(groupLabel, groups.length);
        groups.push({ label: groupLabel, options: [option] });
      } else {
        groups[at].options.push(option);
      }
    };
    const cur = String(form.model ?? "").trim();
    if (cur && !catalogs.models.some((m) => m && typeof m.id === "string" && m.id === cur)) {
      push(t("sched.scopeCurrent"), { value: cur, label: fmt("notice.currentSuffix", cur) });
    }
    for (const m of catalogs.models) {
      if (!m || typeof m.id !== "string" || !m.id) continue;
      const slash = m.id.indexOf("/");
      const label = String(m.group ?? (slash > 0 ? m.id.slice(0, slash) : t("session.model")));
      push(label, { value: m.id, label: typeof m.label === "string" && m.label ? m.label : m.id });
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
    if (!bot.enabled) return { tone: "neutral", text: t("status.disabled") };
    return bot.ws?.state === "connected" ? { tone: "success", text: t("status.connected") } : bot.ws?.state === "connecting" ? { tone: "warning", text: t("status.connecting") } : { tone: "error", text: t("status.disconnected") };
  };
  const globalBadge = (() => {
    const all = bots?.bots ?? [];
    const primary = all.find((b) => b.primary);
    const anyConnected = all.some((b) => b.ws?.state === "connected");
    if (primary?.ws?.state === "connected") return OnlineBadge({ tone: "success", text: t("status.primaryConnected") });
    if (anyConnected) return OnlineBadge({ tone: "warning", text: t("status.someConnected") });
    if (all.length) return OnlineBadge({ tone: "error", text: t("status.allDisconnected") });
    return OnlineBadge({ tone: "neutral", text: t("status.noBot") });
  })();
  const listView = h(
    "div",
    { className: "qbot-channelPage" },
    loadError ? h("div", { className: "qbot-statusNotice", role: "alert" }, loadError) : null,
    notice ? h(
      "div",
      { className: "qbot-infoNotice", id: "qbot-notice", role: "status", key: `notice-${notice}` },
      h("span", { className: "qbot-noticeText", key: "text" }, notice),
      countdownBadge(noticeLeft)
    ) : null,
    h(
      "div",
      { className: "qbot-listHeading" },
      h("h3", null, fmt("status.configuredBots", bots?.bots.length ?? 0)),
      h("button", {
        className: "qbot-btn qbot-btnPrimary",
        type: "button",
        onClick: () => {
          setNotice("");
          setPage("add");
        }
      }, t("list.addBot"))
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
                  h("p", null, fmt("notice.sourceSavedAt", bot.source === "qr" ? t("qr.tabScan") : t("qr.tabManual"), formatTime(bot.savedAt)))
                )
              ),
              h(
                "div",
                { className: "qbot-botTools" },
                h(
                  "div",
                  { className: "qbot-botHealthGroup" },
                  StateLabel({ tone: st.tone, text: st.text }),
                  h("span", { className: "qbot-lastChecked" }, bot.primary ? t("status.primaryBot") : bot.enabled ? t("status.enabled") : t("status.disabled"))
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
            h("h3", null, t("list.empty")),
            h("p", null, t("list.emptyHint"))
          )
        )
      ) : null,
      h("p", { className: "qbot-hint" }, t("list.cardHint"))
    )
  );
  const wsInfo = detailBot ? {
    state: String(detailBot.ws?.state ?? "idle"),
    lastConnectedAt: typeof detailBot.ws?.lastConnectedAt === "number" ? detailBot.ws.lastConnectedAt : null,
    lastError: typeof detailBot.ws?.lastError === "string" ? detailBot.ws.lastError : null
  } : null;
  const connState = !detailBot ? { tone: "neutral", text: t("status.notConfigured") } : detailBot.ws?.state === "connected" ? { tone: "success", text: t("status.running") } : wsInfo?.state === "connecting" ? { tone: "warning", text: t("status.connecting") } : { tone: "error", text: t("status.notReady") };
  const lastChecked = wsInfo?.lastConnectedAt ? formatTime(wsInfo.lastConnectedAt) : t("status.unchecked");
  const cardSummary = notice || (detailBot && detailBot.ws?.state !== "connected" ? wsInfo?.lastError ? fmt("notice.qqNotReadyDetail", wsInfo.lastError) : t("status.qqNotReadyDefault") : "");
  const WS_LABELS = {
    idle: t("status.idle"),
    connecting: t("status.connectingShort"),
    connected: t("status.connected"),
    reconnecting: t("status.reconnecting"),
    closed: t("status.disconnectedShort"),
    error: t("status.error")
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
      { label: t("stats.received"), value: String(c.received ?? 0), tone: "neutral" },
      { label: t("stats.sessions"), value: String(c.sessions ?? 0), tone: "neutral" },
      { label: t("stats.passive"), value: String(c.replies ?? 0), tone: "success" },
      { label: t("stats.proactive"), value: String(c.proactive ?? 0), tone: "neutral" },
      { label: t("stats.bound"), value: String(detailBot.boundSessions ?? 0), tone: "neutral" },
      { label: t("stats.pendingQueue"), value: String(pending), tone: pending > 0 ? "warning" : "neutral" },
      { label: t("stats.groupBuffer"), value: String(buffered), tone: "neutral" },
      { label: t("stats.errors"), value: String(errors), tone: errors > 0 ? "error" : "neutral" }
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
      } }, t("add.backToList")),
      h(
        "div",
        { className: "qbot-detailIdentity" },
        h("span", { className: "qbot-detailAvatar", "aria-hidden": "true" }, h(QqLogoGlyph)),
        h("strong", null, detailBot ? detailBot.appIdMasked : t("detail.noneSelected")),
        detailBot ? h(
          "span",
          { className: `qbot-chip${detailBot.primary ? " is-active" : ""}` },
          detailBot.primary ? t("status.primaryBot") : detailBot.enabled ? t("status.enabled") : t("status.disabled")
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
            h("h2", null, detailBot ? detailBot.appIdMasked : t("detail.noneSelected")),
            detailBot ? h(
              "span",
              { className: `qbot-chip${detailBot.primary ? " is-active" : ""}` },
              detailBot.primary ? t("status.primaryBot") : detailBot.enabled ? t("status.enabled") : t("status.disabled")
            ) : null
          ),
          h(
            "div",
            { className: "qbot-heroMeta" },
            h("span", null, detailBot ? detailBot.source === "qr" ? t("qr.tabScan") : t("qr.tabManual") : "—"),
            h("span", { className: "qbot-metaDot", "aria-hidden": "true" }),
            h("span", null, detailBot ? fmt("notice.savedAtPrefix", formatTime(detailBot.savedAt)) : "—")
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
          }, t("sched.tabScheduled")),
          h("button", {
            className: "qbot-btn",
            type: "button",
            disabled: !detailBot,
            onClick: () => setArchiveOpen(true)
          }, t("archive.tab"))
        )
      ),
      h(
        "div",
        { className: "qbot-heroStats" },
        h(
          "div",
          { className: "qbot-heroStat" },
          h("span", { className: "qbot-heroStatLabel" }, t("detail.connectionStatus")),
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
          h("span", { className: "qbot-heroStatLabel" }, t("detail.lastConnected")),
          h("div", { className: "qbot-heroStatValue" }, h("strong", null, lastChecked))
        )
      ),
      cardSummary ? h(
        "div",
        { className: "qbot-heroFoot", id: "qbot-notice", role: "status" },
        h("span", { className: "qbot-noticeText", key: "text" }, cardSummary),
        notice ? countdownBadge(noticeLeft) : null
      ) : null
    ),
    // ── 运行统计（持久化：跨重启累计，stats/<appId>.json；可复位清零） ──
    status ? sectionCard(
      t("stats.title"),
      t("stats.hint"),
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
        }, refreshing ? t("common.refreshing") : t("common.refresh")),
        h("button", {
          className: "qbot-btn qbot-btnDanger",
          type: "button",
          disabled: resetting || refreshing,
          title: t("stats.resetHint"),
          onClick: () => void resetStats()
        }, resetting ? t("common.resetting") : t("common.reset"))
      )
    ) : null,
    // ── 会话与模型 ──
    sectionCard(
      t("session.title"),
      t("session.hint"),
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
              h("span", { className: "qbot-settingTitle" }, t("session.workspace")),
              h(
                "span",
                { className: "qbot-settingDesc" },
                t("session.workspaceHint")
              )
            ),
            h("button", { className: "qbot-btn", type: "button", onClick: () => setPickerOpen(true) }, t("session.chooseDir"))
          ),
          h(
            "code",
            { className: "qbot-workspacePath", title: String(form.workspacePath ?? "") },
            String(form.workspacePath ?? "").trim() || t("session.defaultWorkspace")
          )
        ),
        SettingRow({
          label: t("session.model"),
          desc: t("session.modelHint"),
          control: h(
            "select",
            {
              // key 随「当前值 + 目录规模」变化：目录异步到达时强制重挂载，
              // 避免「value 先于 option 设置」导致 select 卡在第一项「跟随默认模型」。
              key: `model-${String(form.model ?? "")}-${catalogs.models.length}`,
              className: "qbot-settingSelect",
              value: String(form.model ?? ""),
              onChange: (e) => void saveField("model", e.target.value),
              "aria-label": t("session.model")
            },
            h("option", { value: "" }, t("session.followDefaultModel")),
            modelGroups().map((g) => h(
              "optgroup",
              { key: g.label, label: g.label },
              g.options.map((o) => h("option", { key: o.value, value: o.value }, o.label))
            ))
          )
        }),
        SettingRow({
          label: "Agent Preset",
          desc: t("session.presetHint"),
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
      t("policy.title"),
      t("policy.hint"),
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
          label: t("policy.quote"),
          desc: t("policy.quoteHint"),
          control: h(
            "select",
            {
              className: "qbot-settingSelect",
              value: String(form.quoteReply ?? "at"),
              onChange: (e) => void saveField("quoteReply", e.target.value),
              "aria-label": t("policy.quoteScope")
            },
            h("option", { value: "off" }, t("policy.quoteScopeOff")),
            h("option", { value: "at" }, t("policy.quoteScopeAt")),
            h("option", { value: "all" }, t("policy.quoteScopeAll"))
          )
        }),
        // 语音相关配置（语音消息处理 / ASR / STT / TTS）已从界面移除，仅通过 bots.json 配置——
        // 详见 meta.ts SWITCH_DEFS 顶部注释。
        SettingRow({
          rowKey: "replyLocale",
          label: t("replyLocale.label"),
          desc: t("replyLocale.hint"),
          control: h(
            "select",
            {
              className: "qbot-settingSelect",
              value: String(form.replyLocale ?? "zh"),
              onChange: (e) => void saveField("replyLocale", e.target.value),
              "aria-label": t("replyLocale.labelShort")
            },
            h("option", { value: "zh" }, t("replyLocale.zh")),
            h("option", { value: "en" }, "English")
          )
        }),
        // 欢迎语开关与文案已从界面移除（默认开启），仅通过 bots.json 配置 welcomeEnabled / welcomeMessage。
        SettingRow({
          rowKey: "bannedWords",
          wide: true,
          label: t("feature.bannedWords"),
          desc: t("feature.bannedWordsHint"),
          control: TextArea({
            rows: 3,
            defaultValue: Array.isArray(form.bannedWords) ? form.bannedWords.join(", ") : "",
            placeholder: t("feature.bannedWordsPlaceholder"),
            onBlur: (e) => {
              const words = String(e?.target?.value ?? "").split(/[,，]/).map((w) => w.trim()).filter(Boolean);
              void saveField("bannedWords", words);
            },
            "aria-label": t("feature.bannedWords")
          })
        })
      )
    ),
    // ── 回复调优（数值） ──
    sectionCard(
      t("tune.title"),
      t("tune.hint"),
      h(
        "div",
        { className: "qbot-settingList" },
        numSelect("valueThreshold", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (n) => n === 0 ? t("tune.allZero") : fmt("override.scoreOption", n)),
        numSelect("atContextMessages", [0, 2, 4, 6, 8, 10, 15, 20, 30, 50], (n) => n === 0 ? t("tune.offZero") : fmt("override.countOption", n)),
        numSelect("groupCooldownMs", COOLDOWN_OPTIONS, cooldownLabel),
        numSelect("senderCooldownMs", COOLDOWN_OPTIONS, cooldownLabel),
        numSelect("replyChunkChars", [200, 300, 500, 800, 1e3, 1500, 2e3, 3e3, 4e3]),
        numSelect("maxRepliesPerMessage", [1, 2, 3, 4, 5]),
        numSelect("quoteMaxChars", [40, 60, 80, 100, 120, 160, 200, 300, 500], (n) => fmt("override.charsOption", n)),
        numSelect("quotaPerDay", [0, 10, 20, 30, 50, 100, 200, 500], (n) => n === 0 ? t("quota.unlimitedZero") : fmt("override.perDayOption", n))
      ),
      void 0
    ),
    // ── 按群配置（群级覆盖） ──
    sectionCard(
      t("group.title"),
      t("group.hint"),
      h(
        "div",
        { className: "qbot-settingList" },
        Object.keys(groupOverrides).length === 0 ? h("div", { className: "qbot-modalState" }, t("group.empty")) : Object.entries(groupOverrides).map(([openid, ov]) => h(
          "div",
          { key: openid, className: "qbot-schedRow" },
          h(
            "div",
            { className: "qbot-schedMain" },
            h(
              "div",
              { className: "qbot-schedTop" },
              h("span", { className: "qbot-chip is-active" }, t("group.group")),
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
            h("button", { className: "qbot-btn qbot-schedEdit", type: "button", onClick: () => setOverrideEdit(openid) }, t("common.edit")),
            h("button", { className: "qbot-btn qbot-btnDanger", type: "button", onClick: () => void removeOverride(openid) }, t("common.delete"))
          )
        )),
        h(
          "div",
          { className: "qbot-editActions" },
          h("span", { className: "qbot-hint" }, t("group.overrideHint")),
          h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: () => setOverrideEdit("") }, t("group.add"))
        )
      ),
      void 0
    ),
    // ── 连接与移除 ──
    sectionCard(
      t("conn.title"),
      t("conn.hint"),
      h(
        "div",
        { className: "qbot-settingList" },
        detailBot ? SettingRow({
          label: detailBot.enabled ? t("conn.disableBot") : t("conn.enableBot"),
          desc: t("conn.disableHint"),
          control: h("button", {
            className: "qbot-btn",
            type: "button",
            disabled: detailBot.primary,
            onClick: () => void toggleEnabled(detailBot, !detailBot.enabled)
          }, detailBot.enabled ? t("conn.disable") : t("conn.enable"))
        }) : null,
        detailBot && !detailBot.primary ? SettingRow({
          label: t("conn.setPrimary"),
          desc: t("conn.primaryHint"),
          control: h("button", {
            className: "qbot-btn",
            type: "button",
            onClick: () => void setPrimaryBot(detailBot.appId)
          }, t("conn.setPrimary"))
        }) : null,
        SettingRow({
          label: detailBot?.ws?.state === "connected" ? t("conn.check") : t("conn.retry"),
          desc: t("conn.retryHint"),
          control: h("button", {
            className: "qbot-btn",
            type: "button",
            disabled: reconnecting || !detailBot,
            onClick: () => void retryConnection()
          }, reconnecting ? t("conn.checking") : detailBot?.ws?.state === "connected" ? t("conn.check") : t("conn.retry"))
        }),
        detailBot ? SettingRow({
          label: t("conn.remove"),
          desc: t("conn.removeHint"),
          control: h("button", {
            className: "qbot-btn qbot-btnDanger",
            type: "button",
            onClick: () => void removeBot(detailBot)
          }, t("conn.remove"))
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
    { className: "qbot-page", "aria-label": t("app.settingsTitle") },
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
            h("strong", { className: "qbot-brandName" }, t("app.title")),
            h("span", { className: "qbot-brandVersion" }, `v${true ? "0.1.3" : "0.0.2"}`),
            h("button", {
              className: `qbot-btn qbot-updateBtn${update.done ? " is-done" : ""}`,
              type: "button",
              disabled: update.busy,
              title: t("update.hint"),
              onClick: () => void runUpdateCheck()
            }, update.busy ? t("conn.checking") : update.done ? t("update.updated") : t("update.check"))
          ),
          h("p", null, t("app.subtitle"))
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
          setNotice(fmt("notice.workspaceSavedPrefix", dir));
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
            const message = fmt("notice.groupOverrideSaveNoEffect", short);
            setNotice(message);
            return { ok: false, error: message };
          }
        }
        setNotice(fmt("notice.groupOverrideSaved", short));
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
    () => ctx.locale?.register?.(QQBOT_LOCALE_NAMESPACE, hostDictionaries),
    "qqbot-settings: locale dictionaries"
  );
  const bound = ctx.locale?.bind?.(QQBOT_LOCALE_NAMESPACE);
  setTranslator(typeof bound === "function" ? bound : void 0);
  try {
    const initial = ctx.locale?.getLocale?.();
    if (typeof initial === "string") setLocale(initial);
  } catch {
  }
  ctx.effect(() => {
    const off = ctx.locale?.subscribe?.((locale) => setLocale(locale));
    return typeof off === "function" ? off : () => {
    };
  }, "qqbot-settings: locale subscription");
  const rpcCall = async (endpoint, payload, signal) => {
    const raw = await ctx.connection.rpc.call(RPC_CHANNEL, endpoint, payload ?? {}, signal);
    if (raw && typeof raw === "object" && "code" in raw && !("ok" in raw)) {
      const r = raw;
      const msg = typeof r.message === "string" && r.message ? r.message : typeof r.code === "string" ? r.code : t("common.rpcFailed");
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
        h("span", { className: "qbot-navText" }, t("app.title"))
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

