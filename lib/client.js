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
var React18 = __toESM(require("react"), 1);

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
  "common.langProbe": "简体中文",
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
  "session.hint": "工作区、模型与预设。",
  "session.workspace": "工作区目录",
  "session.workspaceHint": "会话读写文件的目录，留空用默认工作区；只对新建会话生效。",
  "session.chooseDir": "选择目录",
  "session.defaultWorkspace": "默认工作区（~/.dsh/file）",
  "session.modelHint": "留空跟随宿主默认模型；切换后已有会话需重置。",
  "session.followDefaultModel": "跟随默认模型",
  "session.preset": "Agent 预设",
  "session.presetHint": "机器人的行事风格与可用工具。",
  // 宿主内置 preset 不发布名称，目录接口只能回退到 id；这里按官方译名本地化。
  "session.presetStandard": "标准模式",
  "session.presetPtc": "PTC 模式",
  "session.presetMinimal": "极简模式",
  "session.presetCordis": "创造模式",
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
  "runtime.disabled": "会话运行时未就绪：QQ 消息会被直接丢弃，不会创建会话，也不会回复。",
  "runtime.disabledHint": "通常是宿主 dsh 升级后缺少 @deepseek-ai/dsh-webhook。请安装与宿主同版本的该插件并重启 dsh web；插件也会后台自动重试。可在终端执行 curl http://127.0.0.1:3080/qqbot/status 查看 runtimeReady。",
  "runtime.recheck": "重新检查",
  // ── list ──
  "list.addBot": "＋ 添加机器人",
  "list.empty": "还没有配置成功的机器人",
  "list.emptyHint": "点击上方「＋ 添加机器人」，用手机 QQ 扫码，或手动填写 AppID / AppSecret。配置成功后即可在详情中设置行为参数。",
  "list.cardHint": "点击机器人卡片可进入详情：查看 QQ 连接状态、调整行为配置。",
  "list.cardOpen": "进入详情",
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
  "qr.step1": "点击二维码下方的「生成二维码」，出现二维码后开始 3 分钟倒计时。",
  "qr.step2": "打开手机 QQ，从右上角「＋」菜单进入「扫一扫」，扫描这张二维码。",
  "qr.step3": "按 QQ 页面提示完成确认，把这个机器人授权给本机 dsh 使用。",
  "qr.step4": "本页每 2 秒检查一次结果，绑定成功后会自动进入机器人详情页。",
  "qr.note1": "二维码 3 分钟内有效；过期后会自动换一张新的，不需要手动刷新页面。",
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
  "detail.groupRuntime": "运行",
  "detail.groupRuntimeHint": "数值按机器人独立累计",
  "detail.groupConfig": "配置",
  "detail.groupConfigHint": "每个机器人彼此独立，改动即时生效",
  "detail.groupManage": "管理",
  "detail.actionSchedule": "定时消息",
  "detail.actionScheduleHint": "定时主动推送",
  "detail.actionArchive": "消息归档",
  "detail.actionArchiveHint": "按天查阅收发记录与所属会话",
  "detail.summarySchedule": "新增 / 编辑 / 启用禁用 / 测试发送",
  "detail.summaryArchive": "按天查阅收发记录",
  "detail.summaryStats": "收到 {0} · 回复 {1} · 主动 {2} · 错误 {3}",
  "detail.summarySession": "{0} · {1}",
  "detail.summaryPolicy": "{0}/{1} 项开关已开启",
  "detail.summaryTune": "8 项数值参数",
  "detail.summaryGroup": "{0} 个群覆盖",
  "detail.summaryConn": "{0} · WebSocket {1}",
  "detail.customWorkspace": "自定义工作区",
  "detail.aboutTitle": "关于",
  "detail.aboutHint": "版本与版权信息。",
  "detail.aboutVersion": "当前版本",
  "detail.aboutAuthor": "作者",
  "detail.aboutLicense": "许可证",
  "detail.aboutRepo": "开源地址",
  "detail.aboutCopyright": "本插件按「现状」提供，使用者自担风险。",
  // ── app ──
  "app.title": "QQ 机器人",
  "app.settingsTitle": "QQ 机器人设置",
  "app.subtitle": "把 QQ 机器人接入 DeepSeek Harness",
  // ── stats ──
  "stats.title": "运行统计",
  "stats.hint": "消息、会话与回复的累计情况。",
  "stats.resetHint": "把该机器人的运行计数清零（立即生效并落盘）",
  "stats.resetConfirm": "确定把该机器人的运行计数清零？此操作不可撤销。",
  "stats.received": "收到消息",
  "stats.sessions": "创建会话",
  "stats.passive": "被动回复",
  "stats.proactive": "主动消息",
  "stats.bound": "绑定会话",
  "stats.pendingQueue": "待回复队列",
  "stats.groupBuffer": "群消息缓冲",
  "stats.errors": "错误",
  // ── console（机器人管理控制台弹窗） ──
  "console.title": "机器人管理控制台",
  "console.titleBot": "管理控制台 · {0}",
  "console.hint": "在这里查看运行状态并使用各项能力。",
  "console.menuLabel": "功能菜单",
  "console.grpOverview": "概览",
  "console.grpRuntime": "运行",
  "console.grpConfig": "配置",
  "console.grpManage": "管理",
  "console.navOverview": "运营总览",
  "console.navSchedule": "定时消息",
  "console.navArchive": "消息归档",
  "console.navSession": "会话与模型",
  "console.navPolicy": "回复策略",
  "console.navTune": "回复调优",
  "console.navOverride": "按群覆盖",
  "console.navManifest": "配置清单",
  "console.navPlatform": "群聊管理",
  "console.navGuild": "频道管理",
  "console.navEvents": "事件说明",
  "console.chartDaily": "近 7 天收到消息",
  "console.chartCompose": "消息构成",
  "console.barTip": "{0}：{1} 条",
  "console.legendPassive": "被动回复 {0}",
  "console.legendProactive": "主动消息 {0}",
  "console.ovPrimary": "主机器人",
  "console.ovSecondary": "已添加",
  "console.ovTodayLabel": "今日消息",
  "console.ovToday": "今日 {0} 条",
  "console.ovGroups": "群聊",
  "console.ovShare": "占比 {0}",
  "console.ovTotalReplies": "回复总数",
  "console.ovWeekTotal": "7 天合计 {0}",
  "console.ovPeakDay": "最高 {0} · {1} 条",
  "console.ovPeak": "峰值",
  "console.ovStatusTitle": "运行状态",
  "console.ovConnect": "连接",
  "console.ovLastConnect": "上次连接",
  "console.ovNever": "尚未连接",
  "console.ovNoData": "暂无数据",
  "console.ovWaiting": "等待回复",
  "console.ovClear": "已清空",
  "console.ovNormal": "运行正常",
  "console.ovAttention": "需留意",
  "ui.modernMode": "新版界面",
  "ui.legacyMode": "旧版界面",
  "console.ovArchiveKinds": "归档消息分类",
  "console.ovArchiveScopes": "会话来源",
  "console.ovArchiveMonths": "归档月份分布",
  "console.ovArchiveTotal": "共 {0} 条",
  "console.ovArchiveChats": "{0} 个会话",
  "console.ovArchiveGroup": "群聊",
  "console.ovArchiveC2c": "单聊",
  "console.navKwConfig": "违规字样处置配置",
  "console.navKwLogs": "违规字样处置记录",
  // ── policy ──
  "policy.title": "消息与回复策略",
  "policy.hint": "听哪些消息、怎么回。",
  "policy.fullGroupReply": "群全量消息回复",
  "policy.fullGroupReplyHint": "开启后群里非 @ 消息也参与评分，达阈值才回复；@ 消息始终回复。",
  "policy.acceptDm": "接受单聊消息",
  "policy.acceptDmHint": "是否响应 QQ 私聊（C2C）消息。关闭后机器人只处理群消息，私聊一律忽略。",
  "policy.respondBots": "响应机器人消息",
  "policy.respondBotsHint": "开启后其他机器人的消息也触发回复；默认关闭以防互相触发刷屏。",
  "policy.markdown": "Markdown 回复",
  "policy.markdownHint": "优先 Markdown 发送，被平台拒绝时自动降级纯文本。",
  "policy.quote": "回复引用原话",
  "policy.quoteHint": "回复以 QQ 原生引用卡片定位到原消息，仅群聊生效：off=不引用，at=仅群 @（推荐），all=全部；失败自动降级普通回复。",
  "policy.quoteScope": "回复引用原话范围",
  "policy.quoteScopeOff": "off（不引用）",
  "policy.quoteScopeAt": "at（仅群 @，推荐）",
  "policy.quoteScopeAll": "all（群聊全部回复）",
  "policy.quoteLimit": "引用字数上限",
  "policy.quoteLimitHint": "文本引用最多显示的字数，超出省略号结尾。",
  "policy.chatPreset": "群聊聊天预设（已停用）",
  "policy.chatPresetHint": "已停用：群聊现已与单聊能力一致，仅供历史配置识别。",
  "policy.followAgentPreset": "跟随 Agent 预设",
  "policy.secretEnv": "AppSecret 凭据引用（secretEnv）",
  "policy.secretEnvShort": "AppSecret 凭据引用",
  "policy.secretEnvHint": "AppSecret 的凭据引用替代来源，优先级高于明文；留空用扫码/手动填写的密钥。",
  "policy.secretEnvPlaceholder": "如 my-qq-app-secret（留空不启用）",
  // ── quota ──
  "quota.daily": "主动消息日配额",
  "quota.dailyHint": "单日主动消息上限（定时、欢迎语、补发、发图均计入），0 不限；平台配额极少，建议默认 50。",
  "quota.unlimitedZero": "0（不限）",
  // ── feature ──
  "feature.multimodal": "多模态消息",
  "feature.multimodalHint": "图片 / 文件 / 语音以附件注入会话，模型可直接处理；关闭只留占位说明。",
  "feature.memory": "长期记忆",
  "feature.memoryHint": "每个会话有跨 /new 的持久记忆；对话里说「记住」即可写入。",
  "feature.welcome": "欢迎语",
  "feature.welcomeHint": "新成员进群或新好友添加时，机器人自动发送欢迎语（文案见下方输入框，{nick} 会替换为对方标识）。走主动消息通道，消耗每日配额。",
  "feature.emojiRecall": "表情撤回",
  "feature.emojiRecallHint": "任何人对机器人发出的消息点 🗑️ 表情回应，机器人就撤回那条消息（需要平台的「消息撤回」权限）。",
  "feature.buttonApproval": "按钮审批",
  "feature.buttonApprovalHint": "敏感操作前发送「✅允许 / ❌拒绝」按钮，点击即回传；超时视为拒绝。",
  "feature.fileContent": "文件内容识别",
  "feature.fileContentHint": "收到文本类文件（txt/md/json/csv/代码等，≤1MB）时自动下载并截取正文注入模型上下文，AI 直接读懂文件内容再回复；二进制文件（docx/pdf 等）仅列文件名。需配合「附件转发」开关。",
  "feature.welcomeText": "欢迎语文案",
  "feature.welcomeTextHint": "开启「欢迎语」后发送的内容；{nick} 会替换为新成员标识。留空使用默认文案「欢迎 {nick}！@我即可与我对话。」。",
  "feature.welcomeDefault": "欢迎 {nick}！@我即可与我对话。",
  "feature.bannedWords": "敏感词列表",
  "feature.bannedWordsHint": "逗号分隔；群消息命中任意一词即撤回并跳过回复。",
  "feature.bannedWordsPlaceholder": "词1, 词2（留空不启用）",
  "feature.passiveFallback": "被动失败转主动消息",
  "feature.passiveFallbackHint": "被动回复超时或失败时，改用主动消息接口补发一次。主动消息每日配额极少，仅在排查问题时临时开启。",
  "feature.archive": "消息本地归档",
  "feature.archiveHint": "把收到的消息与发出的回复写入 ~/.dsh/qqbot/archive/，作为审计轨迹留档，方便事后排查。",
  "feature.archiveMedia": "归档媒体保存",
  "feature.archiveMediaHint": "归档时是否把聊天里的图片 / 视频 / 文件下载到本地保存（~/.dsh/qqbot/archive/images|videos|files/）。平台给的附件地址很快就会失效，不保存就只能看到文件名、看不到内容。默认「不保存」：只留文字，不落任何媒体文件。",
  "feature.archiveMediaOff": "不保存（仅文字）",
  "feature.archiveMediaImage": "仅图片",
  "feature.archiveMediaImageVideo": "图片 + 视频",
  "feature.archiveMediaAll": "图片 + 视频 + 文件",
  "feature.sanitizeReply": "回复内容净化",
  "feature.sanitizeReplyHint": "发送前剥离模型输出里的 system-reminder、<think> 等隐藏标签块，防止内部提示词与推理过程泄漏给聊天对象。仅影响发送内容，归档与模型上下文保留原文。",
  "feature.ssrfGuard": "媒体链接安全校验（SSRF 防护）",
  "feature.ssrfGuardHint": "发图 / 发文件前校验 URL 不指向内网，防被诱导探测内网服务。",
  "feature.forceVerifyImage": "Markdown 图片强校验",
  "feature.forceVerifyImageHint": "开启后，Markdown 回复里的图片转存失败时整条消息中断发送并报错（默认关闭：消息照发但图片丢失）。",
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
  "tune.hint": "回复频率与分片长度。",
  "tune.allZero": "0（完全不设限）",
  "tune.offZero": "0（关闭）",
  "tune.groupValueThreshold": "群消息价值阈值",
  "tune.atContext": "AT 上下文条数",
  "tune.minGroupInterval": "群回复最小间隔",
  "tune.sameSenderInterval": "同人回复间隔",
  "tune.chunkChars": "分片字符数",
  "tune.maxReplies": "每条消息最大回复",
  "tune.groupValueThresholdHint": "0–10 分：达标才回复，越高越安静；@ 消息不受限。0 = 完全不设限，每条群消息都回复，且忽略下面两个间隔。",
  "tune.atContextHint": "@ 时附带群里最近 N 条消息作上下文，0 只发被 @ 的那条。",
  "tune.minGroupIntervalHint": "同群两次非 @ 回复的最小间隔，防刷屏；@ 回复不受限。阈值设 0 时此间隔不生效。",
  "tune.sameSenderIntervalHint": "同一人在此间隔内不会被回复第二次。阈值设 0 时此间隔不生效。",
  "tune.chunkCharsHint": "超长回复按此字数切分依次发送，自动选句读边界。",
  "tune.maxRepliesHint": "单条消息最多触发的回复数，QQ 平台硬上限 5。",
  // ── conn ──
  "conn.title": "连接与移除",
  "conn.hint": "启用、主机器人、重连与移除。",
  "conn.disableBot": "停用此机器人",
  "conn.enableBot": "启用此机器人",
  "conn.disableHint": "停用后不连 QQ、不收发消息。",
  "conn.disable": "停用",
  "conn.enable": "启用",
  "conn.primaryHint": "未指定机器人时（定时消息等）默认用它。",
  "conn.check": "检查连接",
  "conn.retry": "重试连接",
  "conn.retryHint": "按当前凭据重新建立 QQ WebSocket 长连接。收不到消息时先点它排查。",
  "conn.checking": "检查中…",
  "conn.remove": "移除接入",
  "conn.removeHint": "删除凭据与配置，立即停止且不可恢复。",
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
  "picker.computer": "此电脑（选择磁盘）",
  // ── sched ──
  "sched.tabScheduled": "定时消息",
  "sched.scopeCurrentBot": "当前机器人",
  "sched.scopeCurrent": "当前",
  "sched.scopeAllBots": "所有机器人",
  "sched.groupTasks": "群聊任务",
  "sched.dmTasks": "单聊任务",
  "sched.collapseGroup": "收起该分组",
  "sched.expandGroup": "展开该分组",
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
  "sched.archiveIntro": "开启「消息本地归档」后，收发的消息会写入 ~/.dsh/qqbot/archive/（按群 / 个人分目录、按月份分文件）。这里只读展示最近的记录，最新在前。",
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
  "sched.enabledToast": "已启用，下次运行 {0}",
  "sched.enabledNoNext": "已启用，但算不出下次运行时间，请检查触发配置",
  "sched.disabledToast": "已禁用，不再执行",
  "sched.bg.create": "新建定时消息",
  "sched.bg.update": "修改定时消息",
  "sched.bg.remove": "删除定时消息",
  "sched.bg.enable": "启用定时消息",
  "sched.bg.disable": "禁用定时消息",
  "sched.bg.runOnce": "测试执行定时消息",
  "sched.bg.send": "定时消息发送",
  "sched.bg.sent": "已发送",
  "sched.bg.skipped": "已跳过发送",
  "sched.bg.done": "操作成功",
  "sched.noNextRun": "算不出下次运行，请检查触发配置",
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
  "sched.form.atEveryone": "@全体成员",
  "sched.form.atEveryoneHint": "发送时 @ 该群全体成员。需要机器人是群管理员，且每个群每天只能 @ 全体 1 次。",
  "sched.form.atEveryoneOn": "发送时将 @全体成员",
  "sched.form.atEveryoneOff": "不 @ 全体成员",
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
  "archive.subtitle": "本地落盘的最近收发记录（只读，按当前机器人过滤）",
  "archive.subtitle2": "本地落盘的收发记录（按当前机器人过滤）：左栏按「会话 → 月份」展开选择，右栏按时间倒序查看消息（头像 / 昵称 / 时间 / 引用卡片），默认显示最近 300 条，可「加载更多 / 显示全部」；标题栏删除图标仅清除当前月份归档，其余月份保留。",
  "archive.loading": "正在读取归档…",
  "archive.loadingChats": "正在读取会话列表…",
  "archive.empty": "该天没有记录。开启「消息本地归档」并收到消息后，这里会出现记录。",
  "archive.chatsList": "归档会话",
  "archive.noChats": "暂无归档会话",
  "archive.pickChat": "从左侧选择一段会话查看记录",
  "archive.pickMonth": "从左侧选择「会话 → 月份」查看归档记录",
  "archive.chatEmpty": "该会话暂无记录",
  "archive.noMonths": "暂无按月归档",
  "archive.unknownMonth": "未知月份",
  "archive.monthCount": "本月 {0} 条",
  "archive.loadMore": "加载更多",
  "archive.showAll": "显示全部",
  "archive.shownOf": "已显示 {0} / 共 {1} 条",
  "archive.dateFiles": "归档日期文件",
  "archive.noFiles": "暂无归档文件",
  "archive.deleteHint": "删除该天归档（仅此机器人的记录）",
  "archive.received": "收到",
  "archive.reply": "回复",
  "archive.proactive": "主动",
  "archive.session": "会话",
  "archive.people": "个人",
  "archive.groups": "群聊",
  "archive.them": "对方",
  "archive.groupMemberNum": "群成员 {0} 人",
  "archive.groupMembersShort": "{0}人",
  "archive.groupClass": "分类 {0}",
  "archive.groupTags": "标签 {0}",
  "archive.groupMemo": "简介 {0}",
  "archive.monthCountTotal": "归档记录条数",
  // ── 平台能力（QQ OpenAPI 20260810~20261116 新增接口） ──
  "common.copy": "复制",
  "pt.tabTitle": "群聊管理",
  "pt.tabHint": "QQ 群资料 / 成员 / 黑名单 / 入群审批 / 群规审核，以及分享链接、菜单等通用能力。",
  "pt.tabSummary": "群管理 · 审批 · 群规审核",
  "pt.shareTitle": "好友分享链接",
  "pt.shareHint": "生成一条邀请链接，用户打开即可添加机器人为好友；可附带回传参数用于追踪来源。",
  "pt.shareGen": "生成链接",
  "pt.shareDone": "分享链接已生成，点击「复制」发给需要的人",
  "pt.selfTitle": "机器人信息",
  "pt.selfLoad": "查看",
  "pt.selfName": "昵称",
  "pt.selfId": "机器人 ID",
  "pt.selfBot": "是否机器人",
  "pt.selfBotYes": "是",
  "pt.selfBotNo": "否",
  "pt.selfWelcome": "入群欢迎语",
  "pt.menuTitle": "自定义菜单（单聊）",
  "pt.menuHint": "C2C 单聊底部菜单。可按指令清单一键生成，或直接编辑 JSON；保存后整份覆盖平台现有菜单。",
  "pt.menuGen": "按指令清单生成",
  "pt.menuSaved": "菜单已保存（version={0}），单聊界面可能需要重新打开才会刷新",
  "pt.menuLoaded": "已加载 {0} 个菜单项",
  "pt.menuEmpty": "当前没有配置菜单",
  "pt.menuBadJson": "菜单内容不是合法的 JSON 数组",
  "pt.menuPlaceholder": "点击「按指令清单生成」或「刷新」填充菜单 JSON，可手工编辑后保存",
  "pt.panelsTitle": "指令面板",
  "pt.panelsHint": "QQ 客户端里展示的指令面板（每机器人最多 20 个）。可在这里新建、修改、删除面板，并把具体面板关联到指定群。",
  "pt.panelsLoaded": "已加载指令面板",
  "pt.panelsCount": "共 {0} 个面板",
  "pt.panelsItems": "{0} 个元素",
  "pt.panelsEmpty": "该场景还没有指令面板，点「新建面板」开始。",
  "pt.panelNew": "新建面板",
  "pt.panelView": "查看",
  "pt.panelViewing": "查看面板（只读）",
  "pt.panelEditing": "修改面板（面板 ID 已存在，保存后覆盖其元素与备注）",
  "pt.panelCreating": "新建面板（填写元素与备注后保存）",
  "pt.panelRemark": "面板备注（选填，便于识别用途）",
  "pt.panelItems": "面板元素（每个元素是一个按钮，最多 20 个）",
  "pt.panelHelpTitle": "填写示例（点开看）",
  "pt.panelHelpExample": "命令按钮的作用：成员点一下，就把命令填进聊天输入框（不会自动发送），成员确认后再点发送，机器人才会执行。所以它省的是「记命令、打命令」的功夫，不是点一下就运行。\n\n示例：两个按钮\n\n1) 类型选「命令」，名称从下拉选「/help 帮助」，描述填「查看机器人用法」\n   → 成员点它，输入框填入 /help，再点发送，机器人回复帮助\n\n2) 类型选「链接」，名称填「帮助中心」，描述填「点我打开帮助」\n   链接填 https://example.com/help\n   → 成员点它，直接打开这个网页\n\n「仅管理员可见」勾上后普通成员看不到该按钮。",
  "pt.panelItemNo": "按钮 {0}",
  "pt.panelItemDel": "删除按钮",
  "pt.panelItemType": "类型",
  "pt.panelItemTypeCmd": "命令（点按后填入输入框）",
  "pt.panelItemTypeLink": "链接（点按后打开网页）",
  "pt.panelItemName": "显示名称",
  "pt.panelItemCmd": "命令（点按后填入输入框）",
  "pt.panelCmdInvalid": "无效命令（请以 / 开头）",
  "pt.panelCmdPick": "请选择命令",
  "pt.panelCmdNeedSelect": "命令按钮必须选择一个命令",
  "pt.panelAdminYes": "是",
  "pt.panelAdminNo": "否",
  "pt.panelItemNamePh": "如：帮助中心",
  "pt.cmdHelp": "帮助",
  "pt.cmdStatus": "运行状态",
  "pt.cmdNew": "新会话",
  "pt.cmdSession": "会话信息",
  "pt.cmdMemory": "长期记忆",
  "pt.cmdForget": "清空记忆",
  "pt.cmdRecall": "撤回消息",
  "pt.cmdBroadcast": "广播消息",
  "pt.cmdSchedule": "定时消息",
  "pt.cmdStop": "停止任务",
  "pt.cmdSteer": "补充指令",
  "pt.cmdPerm": "权限设置",
  "pt.panelItemDesc": "描述",
  "pt.panelItemDescPh": "如：每日签到",
  "pt.panelItemLink": "链接地址（须 https:// 开头）",
  "pt.panelItemAdmin": "仅管理员可见",
  "pt.panelItemAdd": "添加按钮",
  "pt.panelItemCount": "{0} / {1} 个",
  "pt.panelItemsEmpty": "还没有按钮，点「添加按钮」开始",
  "pt.panelNeedItem": "面板至少要有 1 个按钮",
  "pt.panelItemNeedName": "每个按钮都要填显示名称",
  "pt.panelItemBadLink": "链接按钮的地址必须以 https:// 开头",
  "pt.panelCreated": "面板已创建",
  "pt.panelUpdated": "面板已修改",
  "pt.panelDeleted": "面板已删除",
  "pt.materialTitle": "素材上传（Markdown 内嵌图）",
  "pt.materialHint": "把图片上传到 QQ 素材库，得到 qqbot-media:// 引用后可写进 Markdown 回复里图文混排（单机器人上限 100 张，90 天未被引用会过期）。",
  "pt.materialUpload": "上传",
  "pt.materialDone": "上传成功，引用已复制到剪贴板",
  "pt.materialCopied": "已复制，可粘贴进 Markdown 内容",
  "pt.cardTitle": "图文卡片发送",
  "pt.cardHint": "向群聊/单聊发送图文卡片（标题 1-50 字、描述 1-200 字、链接与封面图须 https）。适合公告、推广等排版场景。",
  "pt.cardScope": "目标类型",
  "pt.cardOpenid": "目标 openid",
  "pt.cardOpenidPlaceholder": "群或用户的 openid（可在归档弹窗查看）",
  "pt.cardTitleLabel": "标题",
  "pt.cardDesc": "描述",
  "pt.cardUrl": "跳转链接",
  "pt.cardPic": "封面图 URL",
  "pt.cardPicHint": "须为公网可直接打开的 https 图片直链（浏览器打开显示图片，非网页），不能有防盗链；素材上传得到的 qqbot-media:// 引用不能用作卡片封面。QQ 服务端会实时拉取转存，偶发失败可重试。",
  "pt.cardSend": "发送卡片",
  "pt.cardSent": "图文卡片已发送",
  "pt.errProactiveDenied": "主动消息无权限：机器人需在 QQ 开放平台申请「主动消息」能力，或改用下方「回复消息」在收到用户消息后 5 分钟内被动回复。",
  "pt.errImageTransfer": "封面图转存失败（40034141）：QQ 服务器拉取这张图片失败。请确认封面图是公网可直接访问、无防盗链的 https 图片直链（不是网页链接、也不是 qqbot-media:// 素材引用），可先重试；持续失败请换一个稳定图床的图片。",
  "pt.errHostRestart": "宿主插件尚未加载这个新接口。请重启 dsh web（关闭后重新运行 dsh web），再刷新设置页后重试。",
  "pt.cardReplyMsg": "回复消息（可选）",
  "pt.cardReplyNone": "不回复 · 主动发送（需主动消息权限）",
  "pt.cardReplyLoad": "刷新可回复消息",
  "pt.cardReplyEmpty": "最近 5 分钟内暂无可回复的消息（需先有人 @ 机器人或发消息）",
  "pt.cardReplyHint": "被动回复：选一条最近消息，5 分钟内有效，无需主动消息权限",
  "pt.cardRepliesLoaded": "已加载 {0} 条可回复消息",
  "pt.replyLeft": "剩 {0}s",
  "pt.joinTitle": "入群审批",
  "pt.joinHint": "可让 AI 按你写的入群要求自动审核放行，也可手动通过/拒绝（机器人需为该群管理员）。",
  "pt.jaNeedAdmin": "此群机器人还不是管理员，无法使用入群审批。请先在 QQ 群设置里把机器人设为管理员。",
  "pt.jaTitle": "AI 自动审批",
  "pt.jaDesc": "写好入群要求，点「AI 自动审批」，符合要求的新申请会被自动放行；拿不准的保留给你人工处理。",
  "pt.jaSaved": "自动审批配置已保存",
  "pt.jaOn": "● 自动审批已开启",
  "pt.jaOff": "○ 自动审批已关闭",
  "pt.jaEnable": "开启自动审批",
  "pt.jaDisable": "关闭自动审批",
  "pt.jaEnableCheck": "启用 AI 自动审批",
  "pt.jaEnableCheckDesc": "勾选后才会自动放行；取消勾选只关闭执行，所有设置都会保留。",
  "pt.jaSecEnable": "① 是否启用",
  "pt.jaSecReq": "② 入群要求（符合就自动通过）",
  "pt.jaSecReqDesc": "用大白话写下什么样的介绍才算合格，每行一条，例如「说明来自哪个群」「写明真实姓名」。AI 会按这些要求判断，只有明确符合才放行。",
  "pt.jaReqPlaceholder": "每行一条要求，例如：\n介绍里说明加入原因\n不能是广告或营销号",
  "pt.jaAllowEmpty": "介绍为空也交给 AI 判断（默认：空介绍直接保留人工）",
  "pt.jaRun": "AI 自动审批",
  "pt.jaNeedEnable": "请先开启并保存自动审批配置",
  "pt.jaRunDone": "AI 审批完成：通过 {0} 人，保留人工 {1} 人，失败 {2} 人",
  "pt.jaResPass": "自动通过 {0}",
  "pt.jaResKeep": "保留人工 {0}",
  "pt.jaResFail": "失败 {0}",
  "pt.jaLogsLoaded": "审批记录已加载",
  "pt.jaTabAuto": "AI 自动审批",
  "pt.jaTabManual": "手动审批",
  "pt.jaSummaryReq": "{0} 条要求",
  "pt.jaSummaryWhite": "免审批 {0} 人",
  "pt.jaSummaryEmptyOn": "空介绍交 AI",
  "pt.jaSummaryEmptyOff": "空介绍转人工",
  "pt.jaGroupRules": "规则设置",
  "pt.jaGroupRulesDesc": "决定是否开启，以及什么样的入群介绍才算合格",
  "pt.jaSecEnableTip": "开启后才会自动放行；关闭时所有设置保留。",
  "pt.jaSecEmpty": "空介绍如何处理",
  "pt.jaSecEmptyDesc": "默认空介绍直接保留人工，勾选后也交给 AI 判断。",
  "pt.jaSecWhite": "免审批名单",
  "pt.jaSecWhiteDesc": "名单内的成员申请入群时直接通过，无需 AI 判断，也不会被要求填写介绍。填写成员昵称或 openid，每行一个。",
  "pt.jaWhitePlaceholder": "每行一个昵称或 openid，例如：\n张三\nbearer",
  "pt.jaGroupRun": "执行与记录",
  "pt.jaGroupRunDesc": "规则保存后点「AI 自动审批」执行，结果和记录都在这里",
  "pt.jaSecRun": "执行自动审批",
  "pt.jaSecRunDesc": "拉取待审申请，把明确符合要求的新申请自动放行，其余保留人工。",
  "pt.jaManualDesc": "拉取本群待处理申请，逐条手动通过或拒绝（机器人需为群管理员）。",
  "pt.joinEmpty": "暂无待处理申请",
  "pt.joinEmptyDesc": "点右上角「拉取申请」加载本群最近的入群申请。",
  "pt.jaManualTitle": "手动审批待处理申请",
  "pt.jaAct.pass": "已放行",
  "pt.jaAct.keep": "保留人工",
  "pt.jaAct.decline": "已拒绝",
  "pt.jaAct.error": "审批失败",
  "pt.jaViewRecords": "查看审批记录",
  "pt.jaGroupExec": "执行自动审批",
  "pt.jaGroupExecDesc": "规则保存后点「AI 自动审批」执行，结果在这里看，详细记录去「审批记录」Tab",
  "pt.jaGroupAuto": "自动运行",
  "pt.jaGroupAutoDesc": "启用后由系统定期执行，无需手动点击",
  "pt.jaSecAuto": "执行方式",
  "pt.jaSecAutoDesc": "保存配置后，系统每 5 分钟自动检查一次本群入群申请：符合条件的自动通过，其余保留人工；同一批申请不会重复审核。",
  "pt.jaAutoOn": "自动审批运行中：每 5 分钟检查一次，执行结果见「审批记录」Tab",
  "pt.jaAutoOff": "未启用：勾选「启用 AI 自动审批」并保存后即开始自动运行",
  "pt.jaEmptyKeep": "空介绍 → 保留人工（推荐）",
  "pt.jaEmptyKeepDesc": "信息不足时不放行，交给你人工判断，最稳妥。",
  "pt.jaEmptyAi": "空介绍 → 交给 AI 判断",
  "pt.jaEmptyAiDesc": "没有介绍也可能被自动放行，适合只按昵称等其它信息判断的场景。",
  "pt.jaTabRecords": "审批记录",
  "pt.jaStatTotal": "本次记录",
  "pt.jaStatPass": "自动通过",
  "pt.jaStatKeep": "保留人工",
  "pt.jaStatFail": "失败/拒绝",
  "pt.jaRecordsTitle": "自动审批记录",
  "pt.jaRecordsHint": "按时间倒序，只显示最近 30 条，包含 AI 判定理由与申请理由原文。",
  "pt.jaRecordsEmpty": "暂无审批记录",
  "pt.jaRecordsEmptyDesc": "执行一次「AI 自动审批」后，这里会显示每条申请的判定结果与申请理由。",
  "pt.jaRecordReason": "判定理由",
  "pt.jaRecordIntro": "申请理由",
  "pt.jaRecordIntroEmpty": "（申请人未填写介绍）",
  "pt.joinLoaded": "已加载入群申请",
  "pt.joinSelf": "主动申请",
  "pt.joinInvited": "受邀",
  "pt.joinApproveBtn": "通过",
  "pt.joinDeclineBtn": "拒绝",
  "pt.joinApproved": "已通过「{0}」的入群申请",
  "pt.joinDeclined": "已拒绝「{0}」的入群申请",
  "pt.joinDefaultReason": "管理员在设置页手动拒绝",
  "pt.strategiesLoad": "查策略",
  "pt.strategiesLoaded": "已加载自动审批策略",
  "pt.strategiesCount": "共 {0} 个策略",
  "pt.strategyCreate": "为本群创建策略",
  "pt.strategyCreated": "自动审批策略已创建（{0}）",
  "pt.strategyDeleted": "策略已删除",
  "pt.joinNeedGroup": "先在上方填写群 openid，再创建策略",
  "pt.admTitle": "群管理",
  "pt.admHint": "查看群成员并执行禁言 / 解除禁言 / 移除。需要机器人管理员身份、平台接口白名单权限，且群主开启对应权限开关。",
  "pt.roleOwner": "群主",
  "pt.roleAdmin": "管理员",
  "pt.muteDuration": "禁言时长",
  "pt.muteMinutes": "{0} 分钟",
  "pt.muteHours": "{0} 小时",
  "pt.muteDays": "{0} 天",
  "pt.muteBtn": "禁言",
  "pt.unmuteBtn": "解除禁言",
  "pt.removeBtn": "移除成员",
  "pt.muteDone": "已禁言 {0} 名成员",
  "pt.unmuteDone": "已解除 {0} 名成员的禁言",
  "pt.removeDone": "已移除 {0} 名成员",
  "pt.selectedCount": "已选 {0} 名成员",
  "pt.groupPlaceholder": "搜索或选择群（已配置 + 归档群）",
  "pt.comboEmpty": "无匹配项，可直接手动输入 openid",
  // ── 群选择器 + 权限检测 ──
  "pt.groupPickerTitle": "当前群",
  "pt.groupPickerHint": "从已配置群和消息归档里出现过的群中选择，或手动输入群 openid。选中后会检测机器人在该群的管理员权限。",
  "pt.groupNoSelect": "请先选择一个群",
  "pt.groupSourceConfig": "已配置",
  "pt.groupSourceArchive": "归档",
  "pt.groupArchiveHint": "最近发言 {0} · {1} 条记录",
  "pt.permChecking": "正在检测群权限…",
  "pt.permAdmin": "机器人是该群管理员，管理功能可用",
  "pt.permOwner": "机器人是该群群主，管理功能可用",
  "pt.permMember": "机器人只是该群普通成员，禁言 / 移除成员 / 入群审批 / 群黑名单等操作需要管理员权限，请在 QQ 群设置里把机器人设为管理员。",
  "pt.permUnknown": "无法获取群内状态：{0}",
  "pt.permNeedAdmin": "此操作需要机器人管理员权限",
  "pt.permDeniedTip": "当前群无管理员权限，相关按钮已禁用",
  "pt.permRefresh": "重新检测权限",
  // ── 群信息 ──
  "pt.infoTitle": "群资料",
  "pt.infoHint": "群名称、简介、分类、标签与成员数。群名为平台实时数据，归档里只记录 openid。",
  "pt.infoName": "群名称",
  "pt.infoMemo": "群简介",
  "pt.infoClass": "群分类",
  "pt.infoTags": "群标签",
  "pt.infoMembers": "成员数",
  "pt.infoUnion": "跨应用群标识",
  "pt.infoEmpty": "暂无",
  // ── 群成员管理 ──
  "pt.membersTitle": "群成员管理",
  "pt.membersSearch": "搜索成员昵称或 openid",
  "pt.membersTotal": "共 {0} 名成员",
  "pt.membersNoMore": "已加载全部成员",
  "pt.memberDetail": "成员详情",
  "pt.memberDetailLoaded": "成员资料：{0}",
  "pt.selectAll": "全选本页",
  "pt.clearSelect": "取消选择",
  "pt.needSelectMember": "请先在成员列表里勾选要操作的成员",
  // ── 群黑名单 ──
  "pt.blackTitle": "群黑名单",
  "pt.blackHint": "查询 / 添加 / 移出群黑名单。仅对不在群内的成员可加入黑名单（先在成员管理里移除）。",
  "pt.blackLoaded": "已加载 {0} 名黑名单成员",
  "pt.blackAdd": "加入黑名单",
  "pt.blackDel": "移出黑名单",
  "pt.blackAdded": "已加入黑名单（失败 {0} 人）",
  "pt.blackRemoved": "已移出黑名单（失败 {0} 人）",
  "pt.blackEmpty": "黑名单为空",
  "pt.blackPick": "选择要拉黑的成员 openid（可手输）",
  "pt.blackBannedAt": "拉黑时间",
  // ── 审批策略增强 ──
  "pt.stStrategy": "策略",
  "pt.stEnable": "启用",
  "pt.stDisable": "停用",
  "pt.stExec": "执行扫描",
  "pt.stExecDone": "已触发全量扫描，约 10 分钟完成",
  "pt.stWhitelist": "白名单号码",
  "pt.stWhitelistAdd": "加白",
  "pt.stWhitelistDel": "删白",
  "pt.stWhitelistDone": "白名单操作完成，当前约 {0} 个号码",
  "pt.stWhitelistPlaceholder": "QQ 号码，多个用逗号/空格分隔",
  "pt.stGroupAdd": "加入当前群",
  "pt.stGroupDel": "移出当前群",
  "pt.stGroupDone": "关联群已更新",
  "pt.stRemark": "备注",
  "pt.stExpire": "过期时间",
  "pt.stSave": "保存修改",
  "pt.stSaved": "策略已更新",
  "pt.stSelectFirst": "请先加载策略列表并展开要编辑的策略",
  "pt.stGuideTitle": "自动审批策略（新人加群自动通过）",
  "pt.stGuideDesc": "开启后，新成员申请加群时机器人会按策略自动通过，不用你手动一个个点「通过」。按下面 1→5 的顺序设置即可，每一步都有说明。",
  "pt.stRefresh": "刷新列表",
  "pt.stCreate": "新建策略",
  "pt.stLoadFirst": "点上方「查看策略」加载你已创建的自动审批策略",
  "pt.stEmpty": "还没有策略。点「新建策略」创建一条，创建后默认对当前群生效",
  "pt.stCardTitle": "策略 {0}",
  "pt.stCardGroups": "生效群 {0} 个",
  "pt.stRunning": "运行中",
  "pt.stPaused": "已停用",
  "pt.stExpand": "展开设置",
  "pt.stSecSwitch": "是否开启自动通过",
  "pt.stSecSwitchDesc": "开启＝新成员加群申请自动通过；停用＝暂停自动通过，但设置都会保留，随时可再开启。",
  "pt.stSecGroups": "对哪些群生效",
  "pt.stSecGroupsDesc": "策略只对加入的群生效。{0}若还没加入，点「加入当前群」。",
  "pt.stIncluded": "当前群已加入 ✔",
  "pt.stNotIncluded": "当前群未加入",
  "pt.stSecWhite": "免审批名单（可选）",
  "pt.stSecWhiteDesc": "名单里的 QQ 号申请加群时直接通过，不受其他条件限制。适合给自己人或常用账号放行。",
  "pt.stSecScan": "立即处理已积压的申请",
  "pt.stSecScanDesc": "如果开启前有没处理的入群申请，点这里让机器人马上补处理一次（约 10 分钟）。日常新申请会自动处理，不用重复点。",
  "pt.stSecMore": "改名与删除",
  "pt.stDelete": "删除策略",
  "pt.stId": "策略编号",
  "pt.catGroup": "群聊管理",
  "pt.catGroupHint": "先选择群，下面所有功能都针对这个群",
  "pt.catGeneral": "通用能力",
  "pt.catGeneralHint": "不针对某个群，作用于机器人本身",
  "pt.stepPick": "第 1 步 · 选择群",
  "pt.groupEmpty": "请先在上方选择群，选群后即可使用下面的群管理功能",
  "pt.tabStrategy": "审批策略",
  "pt.navModeration": "群规审核",
  "pt.modGuideTitle": "AI 群规审核（自动禁言违规成员）",
  "pt.modGuideDesc": "机器人按你设的群规自动审核群消息，命中违规就按严重程度禁言不同时长。只有机器人是管理员的群才能启用（下方会自动检测）。拿不准的消息不会误判，可放心使用。",
  "pt.modNeedAdmin": "此群机器人还不是管理员，无法启用群规审核。请先在 QQ 群设置里把机器人设为管理员。",
  "pt.modSaved": "审核配置已保存",
  "pt.modOn": "● 审核已开启",
  "pt.modOff": "○ 审核已关闭",
  "pt.modEnable": "开启审核",
  "pt.modDisable": "关闭审核",
  "pt.modEnableCheck": "启用自动审核",
  "pt.modSecEnable": "是否开启自动审核",
  "pt.modSecEnableDesc": "开启后才会审核群消息；关闭即停止，所有设置都保留。",
  "pt.modSecCats": "要检查哪些违规类型",
  "pt.modSecCatsDesc": "勾选需要重点防范的类型，AI 只按勾选的类型和下面的群规判断，不会自己加戏。",
  "pt.modCat.illegal": "违法违规（诈骗/毒品/暴恐等）",
  "pt.modCat.porn_gamble": "色情赌博",
  "pt.modCat.abuse": "辱骂 / 人身攻击",
  "pt.modCat.ad_spam": "广告 / 垃圾引流",
  "pt.modCat.flood": "刷屏 / 骚扰",
  "pt.modCat.custom": "本群自定义群规",
  "pt.modCat.none": "未违规",
  "pt.modSecRules": "本群自定义规则（可选）",
  "pt.modSecRulesDesc": "用大白话写下这个群禁止什么、允许什么，每行一条。AI 会优先遵守你写的规则，例如「禁止发二维码」「可以讨论股票但不荐股」。只写一串数字或词（如「1」「+1」）也能识别为禁令，写完可用下方「规则自测」验证效果。",
  "pt.modRulesPlaceholder": "每行一条规则，例如：\n禁止发布二维码和 external 链接\n禁止辱骂新成员",
  "pt.modTestTitle": "规则自测（不真的禁言）",
  "pt.modTestPlaceholder": "输入一条测试消息，例如：1",
  "pt.modTestBtn": "测试",
  "pt.modTestEmpty": "请先输入测试内容",
  "pt.modTestNoReason": "模型未给出理由",
  "pt.modTestCat": "归类：{0}",
  "pt.modTestRule": "命中规则：{0}",
  "pt.modTestNoRule": "未命中具体规则",
  "pt.modTestDuration": "按此配置首犯将禁言 {0}（模拟，未执行）",
  "pt.modSecDuration": "违规了禁言多久",
  "pt.modRangeFrom": "最短",
  "pt.modRangeTo": "最长",
  "pt.modLevel.light": "轻微",
  "pt.modLevel.medium": "中等",
  "pt.modLevel.severe": "严重",
  "pt.modLevel.none": "未违规",
  "pt.modSecEscalate": "违规叠加惩罚（连续违规逐次加重）",
  "pt.modSecEscalateDesc": "同一成员连续违规可以逐次加重，算法和时长都由你定。关掉后每次只按上面填的基础时长处理，不会因次数增加而变重。",
  "pt.modEscOn": "开启叠加",
  "pt.modEscOff": "关闭叠加",
  "pt.modEscEnableCheck": "启用叠加惩罚",
  "pt.modEscOffHint": "已关闭叠加惩罚：每次违规都只按对应等级的基础时长禁言，重复违规不会加重。",
  "pt.modEscMode": "叠加方式",
  "pt.modEscMode.linear": "线性递增：基础 ×（1 + 系数 ×（第N次−1））",
  "pt.modEscMode.geometric": "倍数递增：基础 × 系数 的（第N次−1）次方",
  "pt.modEscMode.custom": "自定义阶梯：按违规次数直接填每次分钟数",
  "pt.modEscFactor": "递增系数",
  "pt.modEscCap": "叠加上限（分钟）",
  "pt.modEscWindow": "清零窗口（天）",
  "pt.modEscSteps": "阶梯时长（分钟，第N次对应第N个数）",
  "pt.modEscStepsPlaceholder": "10, 60, 1440, 43200",
  "pt.modEscStepsHint": "填写前几次违规各自的分钟数，用逗号或换行分隔；次数超出最后一项就一直按最后一项处理。留空则按线性递增计算。",
  "pt.modEscPreview": "以范围中值 {0} 为例，效果预览：",
  "pt.modEscPrevItem": "第 {0} 次 {1}",
  "pt.modSecWhite": "免审名单（可选）",
  "pt.modSecWhiteDesc": "这些成员发的消息不审核、不处罚，每行一个 openid。适合信任的管理员或机器人自己。",
  "pt.modWhitePlaceholder": "每行一个成员 openid（可在群成员里查看）",
  "pt.modTabConfig": "审核配置",
  "pt.modTabLogs": "处罚记录",
  "pt.modTabMuted": "禁言成员",
  "pt.mutedTitle": "群内禁言成员",
  "pt.mutedHint": "查看本群正在禁言的成员，勾选后可批量续费、减轻或解除禁言（机器人需为管理员）。",
  "pt.mutedEmpty": "当前没有被禁言的成员",
  "pt.mutedEmptyDesc": "本群现在没有正在禁言的成员，列表中显示的是尚未到期的禁言。",
  "pt.muteAdjustDuration": "调整时长",
  "pt.mutedRenew": "续费禁言",
  "pt.mutedReduce": "减轻禁言",
  "pt.mutedRenewed": "已为 {0} 名成员续费禁言",
  "pt.mutedReduced": "已为 {0} 名成员减轻禁言",
  "pt.mutedUntil": "到期",
  "pt.modCfgTitle": "配置自动审核规则",
  "pt.modCfgDesc": "按下面 6 步设定好后保存，机器人就会自动执行。",
  "pt.modGroupDetect": "开关与检测范围",
  "pt.modGroupDetectDesc": "决定是否开启，以及检查哪些违规内容",
  "pt.modGroupPunish": "处罚规则与例外",
  "pt.modGroupPunishDesc": "违规后禁言多久，以及谁可以免检",
  "pt.modSummaryCats": "检测 {0} 类违规",
  "pt.modSummaryDur": "禁言 {0} 分",
  "pt.modLogsScope": "仅显示最近 30 条",
  "pt.modStatTotal": "总记录",
  "pt.modStatMuted": "已禁言",
  "pt.modStatEsc": "累进加重",
  "pt.modStatFailed": "未执行",
  "pt.modReasonLabel": "判定理由",
  "pt.modDuration": "禁言 {0}",
  "pt.modSilent": "已静默记录",
  "pt.modSourceBehavior": "刷屏检测",
  "pt.modSourceLlm": "AI 判定",
  "pt.modSourceLocal": "本地规则",
  "pt.modRecalled": "已撤回消息",
  "pt.modDurMin": "{0} 分钟",
  "pt.modDurHour": "{0} 小时",
  "pt.modDurDay": "{0} 天",
  "pt.modStrikeShort": "第 {0} 次违规",
  "pt.modFailed": "未执行",
  "pt.modLogsHint": "本群最近的处罚记录，按时间从新到旧。",
  "pt.modLogsEmpty": "还没有处罚记录",
  "pt.modLogsEmptyDesc": "成员违规被禁言后会显示在这里。",
  "pt.modLogsTitle": "处罚记录",
  "pt.modLogsLoaded": "处罚记录已加载",
  "pt.modErrAdminTarget": "命中了违规规则，但 QQ 不允许禁言群主 / 管理员 / 机器人本身（错误码 40103004）。请用普通成员的小号发送违规内容来测试。",
  "pt.modNoticeFailed": "群内 @ 通知发送失败（不影响禁言）",
  "pt.modStrike": "第 {0} 次违规 · 基础 {1} 分钟 → 本次 {2} 分钟（累进加重）",
  "pt.navInfo": "群资料",
  "pt.navMembers": "群成员",
  "pt.navBlack": "黑名单",
  "pt.navJoin": "入群审批",
  "pt.navShare": "分享链接",
  "pt.navMenu": "菜单",
  "pt.navPanels": "面板",
  "pt.scopeC2c": "单聊",
  "pt.scopeGroup": "群聊",
  "pt.navMaterial": "素材",
  "pt.navCard": "图文卡片",
  "archive.member": "群成员",
  "archive.noContent": "（无内容）",
  "archive.showingLatest": "已显示最近 {0} 条（更早记录仍在归档文件里）",
  "archive.chatShowingLatest": "已显示最近 {0} 条（更早记录仍在归档文件里）",
  "archive.totalRecords": "共 {0} 条记录",
  "archive.chatTotal": "共 {0} 条",
  "archive.recordCount": "{0} 条记录",
  "archive.deleteLabel": "删除 {0} 归档",
  "archive.deleteMonthLabel": "删除 {0} 在 {1} 的归档",
  "archive.deleteMonthHint": "仅删除该会话当前月份的归档记录，其余月份保留",
  "archive.deleteConfirm": "确定删除 {0} 的归档记录？此机器人该天的记录将被清除，其他机器人的记录保留。",
  "archive.deleteMonthConfirm": "确定删除「{0}」在 {1} 的全部归档记录？此操作不可恢复，其余月份与该会话其他数据不受影响。",
  "archive.deleteMonthRequired": "未选择具体月份，已取消删除。请在左侧展开会话并选中要删除的月份。",
  "archive.sessionLine": "会话 {0}{1}{2}",
  "archive.searchPlaceholder": "搜索消息内容或发送者",
  "archive.memberFilter": "按群成员过滤",
  "archive.memberAll": "全部成员",
  "archive.dayFilter": "按日期过滤",
  "archive.clearFilters": "清除筛选",
  "archive.dateAll": "全部日期",
  "archive.dateClear": "清除",
  "archive.dateHint": "选择结束日期",
  "archive.dateMarkHint": "圆点 = 当天有消息",
  "archive.exportCsv": "导出 CSV",
  "archive.exportCsvHint": "按当前筛选条件导出本月全部记录（CSV）",
  "archive.colTime": "时间",
  "archive.colType": "类型",
  "archive.colSender": "发送者",
  "archive.colContent": "内容",
  "archive.colNote": "备注",
  "archive.kindInbound": "收到的消息",
  "archive.kindReply": "机器人回复",
  "archive.kindProactive": "主动消息",
  "archive.filterNoMatch": "没有符合筛选条件的记录",
  "archive.image": "图片",
  "archive.video": "视频",
  "archive.file": "文件",
  "archive.mediaLoading": "正在载入媒体…",
  "archive.mediaFailed": "媒体已失效或未能保存",
  "archive.imageCount": "{0} 张图片",
  "archive.sticker": "表情包",
  "archive.recalled": "已撤回",
  "archive.recalledNoContent": "消息已撤回，原文未保留",
  "archive.mediaSkippedItem": "「{0}」未保存：{1}",
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
  "update.keepOpen": "更新尚未执行完，请勿关闭本面板",
  // ── replyLocale ──
  "replyLocale.label": "回复语言（replyLocale）",
  "replyLocale.labelShort": "回复语言",
  "replyLocale.hint": "机器人系统文案（/help、定时消息用法等）的语言，不影响 AI 对话内容。",
  "replyLocale.zh": "中文（默认）",
  // ── group ──
  "group.title": "按群配置",
  "group.hint": "给单个群覆盖默认行为。",
  "group.empty": "还没有按群覆盖配置，所有群都使用上方机器人默认配置。",
  "group.overrideHint": "未设置的字段跟随机器人默认。",
  "group.add": "添加群覆盖",
  "group.edit": "编辑群覆盖",
  "group.group": "群",
  "group.noOverrides": "无覆盖字段",
  "group.required": "请填写群 openid",
  "group.dialogHint": "留空/选择「跟随默认」的字段继续使用机器人级配置，仅此群生效",
  "group.secIdentity": "群标识",
  "group.secTrigger": "触发与阈值",
  "group.secPacing": "回复节奏",
  "group.secContent": "内容与过滤",
  "group.openid": "群 openid",
  "group.openidHint": "要单独配置的群 openid（o 开头的长串）。可在群里让 AI 用 /session 查看。",
  "group.fullReply": "群全量回复",
  "group.fullReplyHint": "该群非 @ 消息是否参与价值评分并回复。",
  "group.followDefault": "跟随默认",
  "group.valueThreshold": "价值阈值",
  "group.valueThresholdHint": "仅群全量回复开启时有效：0-10 分，达到阈值才回复；0 = 完全不设限（每条都回，且忽略两个间隔）。",
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
  // ── manifest（配置清单 JSON 编辑器）──
  "manifest.entryTitle": "配置清单（JSON）",
  "manifest.entryDesc": "以 JSON 查看并直接编辑全部可配置字段。",
  "manifest.entrySummary": "查看并编辑全部配置项",
  "manifest.title": "配置清单 · JSON 编辑",
  "manifest.hint": "以 JSON 查看并直接修改当前机器人的全部可配置字段，保存后立即生效。",
  "manifest.editorTitle": "配置 JSON",
  "manifest.helpTitle": "字段帮助",
  "manifest.issueCount": "发现 {0} 处问题，请修正后再保存",
  "manifest.validCount": "格式正确 · 共 {0} 个字段",
  "manifest.jsonRoot": "JSON 顶层",
  "manifest.noIssue": "✓ 格式与取值均正确，可以保存",
  "manifest.locateHint": "点击定位到出错字段",
  "manifest.searchPlaceholder": "搜索字段名或说明…",
  "manifest.fieldTotal": "共 {0} 个字段",
  "manifest.noHelpMatch": "没有匹配的字段",
  "manifest.issue.syntax": "JSON 语法错误：{0}",
  "manifest.issue.notObject": "顶层必须是一个 JSON 对象 { ... }",
  "manifest.issue.unknown": '未知字段 "{0}"：该字段不可配置或拼写有误',
  "manifest.issue.type": '字段 "{0}" 类型错误，应为 {1}',
  "manifest.issue.enum": '字段 "{0}" 取值无效，允许值：{1}',
  "manifest.issue.range": '字段 "{0}" 超出范围，允许区间：{1}',
  "manifest.issue.override": '按群覆盖 "{0}" 结构错误，应为 {1}',
  "manifest.reload": "重新载入",
  "manifest.reloadConfirm": "当前修改尚未保存，重新载入将丢弃这些修改。确定继续吗？",
  "manifest.validateBeforeSave": "请先修正校验发现的问题，再保存",
  "manifest.saveHint": "保存后立即对该机器人热生效，无需重启。",
  "manifest.unsavedHint": "有未保存的修改（保存前会再次校验）。",
  "manifest.savedNotice": "配置清单已保存并热生效。",
  "manifest.loadFailed": "读取配置失败：{0}",
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
  "unit.seconds": "{0} 秒",
  "panel.subtitle": "管理定时消息：增删改查与测试发送",
  "panel.scope": "机器人",
  "panel.allBots": "所有机器人",
  "panel.scheduled": "定时消息",
  "panel.archive": "历史归档",
  "panel.days": "天",
  "panel.records": "条",
  "panel.loading": "加载中…",
  "panel.noSchedules": "暂无定时消息",
  "panel.noArchive": "暂无归档",
  "panel.noRecords": "当天无记录",
  "panel.disabled": "已停用",
  "panel.suspended": "已暂停",
  "panel.next": "下次",
  "panel.noNext": "无下次运行",
  "panel.ai": "AI",
  "panel.tool": "命令",
  "panel.failed": "失败",
  "panel.dm": "单聊",
  "panel.group": "群",
  "panel.user": "用户",
  "panel.system": "系统",
  "panel.bot": "机器人",
  "panel.archiveAllHint": "所有机器人模式仅显示聚合条数；选择单个机器人可展开预览记录",
  "panel.tabId": "面板",
  "sched.view": "查看",
  "sched.back": "返回",
  "sched.detailTitle": "执行逻辑详情",
  "sched.detailSubtitle": "这条定时任务到点后的完整执行流程如下",
  "sched.flow.trigger": "定时触发",
  "sched.flow.enabled": "任务已启用",
  "sched.flow.disabled": "已禁用 · 本次不执行",
  "sched.flow.recipient": "接收对象",
  "sched.flow.gate": "门控检查",
  "sched.flow.gateAlways": "无条件执行",
  "sched.flow.gateNonempty": "输出非空才执行",
  "sched.flow.gateChanged": "输出变化才执行",
  "sched.flow.action": "执行内容",
  "sched.flow.modeText": "直接发送文本",
  "sched.flow.modeAi": "AI 生成回复",
  "sched.flow.modeTool": "运行命令",
  "sched.flow.resultMode": "结果处理",
  "sched.flow.resultRaw": "原样发送输出",
  "sched.flow.resultAi": "AI 整理后发送",
  "sched.flow.notify": "通知条件",
  "sched.flow.verify": "发送前自校验",
  "sched.flow.deliver": "推送消息",
  "sched.flow.end": "结束",
  "sched.flow.yes": "是",
  "sched.flow.no": "否",
  "sched.flow.skip": "跳过本次",
  "sched.flow.nextRun": "下次运行：{0}",
  // ── 频道管理（QQ Guild：竖向 Tab 弹窗） ──
  "gv.title": "频道管理",
  "gv.hint": "QQ 频道 / 子频道 / 成员 / 消息 / 内容管理与 AI 接管；部分接口需管理员或私域权限。",
  "gv.summary": "频道 · 内容 · AI 接管",
  "gv.tab.guilds": "频道列表",
  "gv.tab.info": "频道详情",
  "gv.tab.channels": "子频道",
  "gv.tab.members": "频道成员",
  "gv.tab.roles": "身份组",
  "gv.tab.message": "发消息",
  "gv.tab.events": "事件说明",
  "gv.needGuild": "请先到「频道列表」加载并选择一个频道",
  "gv.needChannel": "请先选择一个子频道",
  "gv.noPermission": "接口无权限：请确认机器人已加入频道、具备管理员权限，且已开通对应接口（部分能力仅私域机器人）。",
  "gv.selected": "当前频道",
  "gv.guildsDesc": "机器人已加入的频道。点选一张卡片，其它 Tab 就操作这个频道。",
  "gv.guildsTotal": "共 {0} 个频道",
  "gv.guildsEmpty": "还没有加入任何频道。请先在 QQ 开放平台把机器人添加到频道。",
  "gv.setupTitle": "先让机器人加入频道",
  "gv.setupStep1": "① 打开 QQ 开发者中心 → 你的机器人 → 把「允许机器人被添加到任意频道使用（提供公开服务）」开关打开。",
  "gv.setupStep2": "② 开启后，让频道主 / 管理员用手机 QQ 扫机器人的二维码，把机器人加入频道。",
  "gv.setupFoot": "加入频道后回到这里点「刷新」，就能看到并管理频道能力了。",
  "gv.setupLink": "打开 QQ 开发者中心",
  "gv.guildMembers": "{0} 人",
  "gv.guildOwner": "创建者",
  "gv.infoDesc": "频道实时资料（GET /guilds/{guild_id}）。",
  "gv.infoName": "频道名称",
  "gv.infoId": "频道 ID",
  "gv.infoOwner": "创建者 ID",
  "gv.infoMember": "成员数",
  "gv.infoMax": "成员上限",
  "gv.infoIntro": "简介",
  "gv.infoJoined": "加入时间",
  "gv.infoEmpty": "暂无数据",
  "gv.chDesc": "创建 / 修改 / 删除子频道（需要管理员权限，部分接口仅私域机器人）。",
  "gv.chList": "子频道列表",
  "gv.chType": "类型",
  "gv.chType.0": "文字",
  "gv.chType.2": "语音",
  "gv.chType.4": "分组",
  "gv.chType.10005": "直播",
  "gv.chType.10006": "应用",
  "gv.chType.10007": "论坛",
  "gv.chCreate": "新建子频道",
  "gv.chEdit": "修改子频道",
  "gv.chDel": "删除子频道",
  "gv.chName": "名称",
  "gv.chSubType": "子类型（文字频道：0 闲聊 / 1 公告 / 2 攻略 / 3 开黑）",
  "gv.chPosition": "排序值（分组须 ≥2）",
  "gv.chParent": "所属分组 ID",
  "gv.chParentHint": "0 = 顶层，不属于任何分组",
  "gv.chSpeak": "发言权限（0 无效 / 1 所有人 / 2 管理员与指定成员）",
  "gv.chPrivate": "私密类型（0 公开 / 1 管理员可见 / 2 管理员与指定成员）",
  "gv.chCreated": "子频道已创建",
  "gv.chUpdated": "子频道已修改",
  "gv.chDeleted": "子频道已删除",
  "gv.memDesc": "频道成员列表与详情（仅私域机器人；开通后需把机器人移出频道再重新加入才会生效）。",
  "gv.memList": "成员列表",
  "gv.memSearch": "搜索昵称 / ID",
  "gv.memDetail": "查看成员详情",
  "gv.memMore": "加载更多",
  "gv.memTotal": "已加载 {0} 人",
  "gv.memRoles": "身份组",
  "gv.memJoined": "加入时间",
  "gv.memNick": "频道昵称",
  "gv.memBot": "机器人",
  "gv.memEmpty": "暂无成员数据（公域机器人不支持此接口）",
  "gv.roleDesc": "创建 / 修改 / 删除身份组，并给成员增删身份组（需管理员；身份组 5「子频道管理员」需指定子频道）。",
  "gv.roleList": "身份组列表",
  "gv.roleName": "名称",
  "gv.roleColor": "颜色（十进制 ARGB，如 4294927682）",
  "gv.roleHoist": "在成员列表中单独展示",
  "gv.roleCount": "{0} 人",
  "gv.roleDefault": "系统默认",
  "gv.roleCreate": "新建身份组",
  "gv.roleEdit": "修改身份组",
  "gv.roleDel": "删除身份组",
  "gv.roleCreated": "身份组已创建",
  "gv.roleUpdated": "身份组已修改",
  "gv.roleDeleted": "身份组已删除",
  "gv.roleAssign": "给成员分配身份组",
  "gv.roleUserId": "成员 ID",
  "gv.roleRoleId": "身份组 ID",
  "gv.roleAssignChannel": "子频道 ID（身份组 5 必填）",
  "gv.roleAdd": "添加",
  "gv.roleRemove": "移除",
  "gv.roleAssigned": "已添加成员身份组",
  "gv.roleUnassigned": "已移除成员身份组",
  "gv.msgDesc": "向子频道发送文本消息（需发言权限；主动消息默认每个子频道每天 20 条、每个频道每天最多 2 个子频道）。",
  "gv.msgChannel": "目标子频道",
  "gv.msgContent": "消息内容",
  "gv.msgPlaceholder": "输入要发送的文本…",
  "gv.msgSend": "发送消息",
  "gv.msgSent": "请求已提交",
  "gv.msgReceipt": "发送回执",
  "gv.msgId": "QQ 消息 ID",
  "gv.msgHasId": "QQ 已创建这条消息，请到对应子频道内查看。",
  "gv.msgNoId": "QQ 未返回消息 ID —— 主动消息可能已被限流或未真正投递，见下方排查。",
  "gv.msgTipTitle": "提示成功却看不到消息？按顺序排查",
  "gv.msgTip": "1) 机器人必须已加入该频道，且在该子频道有发言权限；2) 这里发的是主动消息（不带 msg_id 引用），默认每个子频道每天 20 条、每个频道每天最多 2 个子频道，超额会被 QQ 静默丢弃但接口仍返回成功；3) 请到 QQ 里对应的子频道内查看，不是私聊；4) 主动消息优先发给近 7 天与机器人有互动的频道，长期无互动的频道可能收不到。",
  "gv.msgRaw": "平台原始返回",
  "gv.evtDesc": "下面按用途汇总本插件已接入的频道 OpenAPI，并保留 WebSocket 基础事件速查。",
  "gv.evtGuildCreate": "频道创建",
  "gv.evtGuildUpdate": "频道更新",
  "gv.evtGuildDelete": "频道解散",
  "gv.evtChannelCreate": "子频道创建",
  "gv.evtChannelUpdate": "子频道更新",
  "gv.evtChannelDelete": "子频道删除",
  "gv.evtFields": "关键字段",
  "gv.evtFieldId": "频道 / 子频道 ID",
  "gv.evtFieldName": "名称",
  "gv.evtFieldOwner": "创建者 / 操作人",
  "gv.evtFieldCount": "成员数 / 上限",
  "gv.evtFieldTime": "加入时间",
  "gv.docTitle": "频道 OpenAPI 速查",
  "gv.docIntro": "方法 / 路径为 QQ 官方原样；路径里的 {guild_id}、{channel_id} 等占位符请替换为真实 ID。能否调用还取决于机器人身份、开发者中心授权与子频道类型，右侧提示列出常见限制。",
  "gv.docEventTitle": "WebSocket 基础事件",
  "gv.docGroup.guild": "频道与子频道",
  "gv.docGroup.member": "频道成员",
  "gv.docGroup.role": "身份组与子频道权限",
  "gv.docGroup.message": "消息与发言",
  "gv.docGroup.content": "内容管理",
  "gv.docGroup.permission": "接口权限",
  "gv.docNote.admin": "需频道管理员",
  "gv.docNote.private": "仅私域机器人；需在开发者中心开通权限，开通后把机器人移出频道再重新加入",
  "gv.docNote.privateShort": "仅私域机器人",
  "gv.docNote.quota": "主动消息默认每子频道每天 20 条；被动回复 5 分钟内有效，且不占主动额度",
  "gv.docNote.msgId": "必须用真实消息 ID，不能用子频道 ID 代替",
  "gv.docNote.noAnnounceList": "官方无公告列表接口（实测 405）；本插件不会调用，公告请用消息 ID 发布 / 删除",
  "gv.docNote.forum": "仅论坛子频道；现行接口只需 channel_id，不需要 forum_id",
  "gv.docNote.schedule": "需日程子频道；时间戳须为毫秒字符串，开始晚于当前、时长 ≤ 7 天",
  "gv.docNote.builtin": "内置身份组（1/2/4/5）不可删除",
  "gv.docNote.pin": "单个子频道最多 20 条精华",
  "gv.docNote.memberRole": "身份组 5（子频道管理员）需指定 channel.id",
  "gv.doc.guilds": "拉取机器人已加入的频道列表，用于选择「当前频道」。",
  "gv.doc.guildGet": "获取频道名称、头像、创建者、成员数 / 上限、简介等资料。",
  "gv.doc.channels": "获取频道下全部子频道（文字 / 语音 / 分组 / 直播 / 应用 / 论坛）。",
  "gv.doc.channelGet": "获取单个子频道的名称、类型、排序、私密类型与发言权限。",
  "gv.doc.channelCreate": "新建子频道，可指定名称、类型、排序、分组、私密类型与发言权限。",
  "gv.doc.channelPatch": "修改子频道的名称、位置、分组、私密类型或发言权限。",
  "gv.doc.channelDelete": "删除指定子频道，删除前请在界面二次确认。",
  "gv.doc.channelOnline": "查询指定子频道的在线成员数。",
  "gv.doc.memberList": "分页拉取频道成员，用于成员下拉、详情与身份组操作。",
  "gv.doc.memberGet": "获取单个频道成员的资料（昵称、加入时间等）。",
  "gv.doc.memberDelete": "把指定成员移出频道。",
  "gv.doc.memberRoles": "查询指定成员已拥有的身份组。",
  "gv.doc.memberRolePut": "给成员添加一个身份组。",
  "gv.doc.memberRoleDelete": "移除成员的某个身份组。",
  "gv.doc.roleMembers": "分页查询指定身份组下的成员。",
  "gv.doc.muteAll": "全员禁言 / 解除，也可传 user_ids 批量禁言或解除。",
  "gv.doc.muteMember": "禁言或解除禁言指定成员，时长单位为秒。",
  "gv.doc.roles": "获取身份组列表（1 全体成员 / 2 管理员 / 4 创建者 / 5 子频道管理员）。",
  "gv.doc.roleCreate": "新建自定义身份组，可设名称、颜色、是否单独展示与权限。",
  "gv.doc.rolePatch": "修改身份组的名称、颜色、展示方式或权限。",
  "gv.doc.roleDelete": "删除自定义身份组。",
  "gv.doc.channelRoleGet": "查询某身份组在指定子频道的权限位。",
  "gv.doc.channelRolePatch": "添加 / 移除某身份组在指定子频道的权限位。",
  "gv.doc.messageSend": "向子频道发送文本消息；带 msg_id / event_id 时是被动回复。",
  "gv.doc.messageList": "拉取子频道消息列表，主要用来复制真实消息 ID 供撤回 / 精华 / 公告使用。",
  "gv.doc.messageDelete": "撤回子频道消息，可用 hide_tip 控制是否隐藏「消息已撤回」小灰条。",
  "gv.doc.msgSettingGet": "查询机器人在该频道的消息频率设置。",
  "gv.doc.msgSettingPut": "修改机器人在该频道的消息频率设置。",
  "gv.doc.announceList": "官方没有公告查询列表接口；这里列出说明，避免误调用。",
  "gv.doc.announceCreate": "把子频道里的一条消息发布为频道公告。",
  "gv.doc.announceDelete": "删除一条公告；message_id 传 all 表示删除全部。",
  "gv.doc.pins": "获取子频道的精华消息列表。",
  "gv.doc.pinAdd": "把一条消息添加为精华消息。",
  "gv.doc.pinDelete": "移除一条精华消息。",
  "gv.doc.schedules": "获取子频道的日程列表。",
  "gv.doc.scheduleGet": "获取单个日程的详情。",
  "gv.doc.scheduleCreate": "在日程子频道创建新日程。",
  "gv.doc.schedulePatch": "修改已有日程的名称、起止时间或提醒方式。",
  "gv.doc.scheduleDelete": "删除指定日程。",
  "gv.doc.audio": "语音 / 直播子频道的音频控制（机器人上麦 / 下麦等）。",
  "gv.doc.threads": "获取论坛子频道的帖子列表（官方现行路径，无 forum_id）。",
  "gv.doc.threadGet": "获取单个帖子的详情。",
  "gv.doc.threadCreate": "在论坛子频道发表新帖子，内容按官方 JSON 格式填写。",
  "gv.doc.threadDelete": "删除指定帖子。",
  "gv.doc.channelPermGet": "查询子频道的权限设置。",
  "gv.doc.channelPermAll": "修改子频道的全员权限。",
  "gv.doc.apiPermGet": "查询该频道每个接口的授权状态。",
  "gv.doc.apiPermPost": "对未授权接口申请授权，官方会返回授权链接。",
  "gv.delConfirm": "确定删除「{0}」吗？此操作不可撤销。",
  // ── 频道发言 / 内容 / AI 接管 ──
  "gv.tab.speak": "发言管理",
  "gv.tab.content": "内容管理",
  "gv.tab.ai": "AI 接管",
  "gv.speakDesc": "禁言成员或全员、解除禁言，以及机器人在频道内的消息频率设置。禁言类操作需要机器人是频道管理员。",
  "gv.st.all": "全员禁言",
  "gv.st.member": "指定成员",
  "gv.st.frequency": "消息频率",
  "gv.st.keyword": "违规字样",
  "gv.muteAllTitle": "全员禁言 / 解除",
  "gv.muteOneTitle": "禁言指定成员 / 解除",
  "gv.muteMinutes": "时长（分钟）",
  "gv.muteMinutesHint": "0 分钟 = 解除禁言；填 1–43200（30 天封顶）",
  "gv.muteUserId": "成员用户 ID",
  "gv.muteUserPlaceholder": "从「频道成员」复制用户 ID",
  "gv.muteAll": "全员禁言",
  "gv.unmuteAll": "解除全员",
  "gv.muteOne": "禁言该成员",
  "gv.unmuteOne": "解除该成员",
  "gv.muteNeedUser": "请先填写成员用户 ID",
  "gv.muteDone": "禁言已执行",
  "gv.muteUnmuted": "已解除禁言",
  "gv.settingTitle": "消息频率设置",
  "gv.settingHint": "官方字段：disable_create_dm / disable_push_msg / channel_ids / channel_push_max_num。修改后保存即写回频道。",
  "gv.settingSave": "保存设置",
  "gv.settingSaved": "消息频率设置已保存",
  "gv.settingInvalidJson": "JSON 格式错误，请检查后重试",
  // ── 违规词自动处置（发言管理 Tab） ──
  "gv.kwSectionTitle": "违规字样自动处置（本地关键词，零 AI 调用）",
  "gv.kwSectionDesc": "新发帖 / 评论 / 频道发言命中违规词时，自动禁言违规者本人并删除该内容。纯本地子串匹配，不调用模型；机器人需为频道管理员才能禁言/删帖。",
  "gv.kwSubConfig": "处置配置",
  "gv.kwSubLogs": "处置记录",
  "gv.kwTitle": "总开关",
  "gv.kwEnable": "启用违规字样自动处置",
  "gv.kwEnableHint": "仅对本频道生效；关闭后不再自动检测和处置。",
  "gv.kwWordsTitle": "违规词表（每行一个）",
  "gv.kwWordsPlaceholder": "例如：赌博\n诈骗\n色情\n违禁品交易",
  "gv.kwWordsHint": "命中任意一个词（子串匹配、忽略大小写）即处置。留空或关闭开关时不生效。词表越短越精准，过短通用词可能误伤。",
  "gv.kwActionTitle": "命中后执行的动作",
  "gv.kwMuteMinutes": "禁言时长（分钟）",
  "gv.kwMuteMinutesHint": "命中后禁言违规者本人；0 = 不禁言只删除。上限 30 天（43200 分钟）。",
  "gv.kwDeleteContent": "删除违规内容（普通消息撤回 / 论坛帖子删除）",
  "gv.kwDeleteThreadOnReply": "评论/回复命中时也删除整个主题帖（谨慎）",
  "gv.kwActionHint": "官方没有「删单条评论」接口：普通发言可直接撤回，论坛新帖可删除整帖；评论/回复默认只禁言不删帖，开启上一项会删除其所在主题帖（含他人回复）。",
  "gv.kwScopeTitle": "生效范围",
  "gv.kwWhitelist": "免处置成员",
  "gv.kwWhitelistPlaceholder": "每行一个成员 user id",
  "gv.kwWhitelistHint": "名单内成员发的违规内容不处置。",
  "gv.kwChannels": "只在这些子频道生效",
  "gv.kwChannelsPlaceholder": "每行一个子频道 ID；留空 = 全部",
  "gv.kwChannelsHint": "留空表示对本频道下所有子频道生效。",
  "gv.kwSave": "保存违规词处置配置",
  "gv.kwSaved": "违规词处置配置已保存",
  "gv.kwNeedWords": "请先填写至少一个违规词",
  "gv.kwLogsTitle": "处置记录（最近 30 条）",
  "gv.kwLogsRefresh": "刷新",
  "gv.kwLogsEmpty": "还没有命中记录",
  "gv.kwMatched": "命中词",
  "gv.contentDesc": "撤回子频道内的消息。管理员可撤回普通成员消息，频道主可撤回所有人消息；发送超过时限的消息不可撤回。",
  "gv.recallMessageId": "消息 ID",
  "gv.recallMessagePlaceholder": "从频道消息事件或客户端复制链接获取",
  "gv.recallMessageHint": "机器人只能撤回自己发送的消息，或管理员/频道主撤回他人消息",
  "gv.recallHideTip": "隐藏撤回小灰条（hide_tip）",
  "gv.recallDo": "撤回消息",
  "gv.recallDone": "消息已撤回",
  "gv.aiDesc": "AI 审核频道消息（警告/撤回/禁言），并可为新帖与评论@自动回帖。需先在「设置 → 模型」配置 AI 模型；频道消息不会进入普通会话回复。",
  "gv.aiEnableTitle": "总开关",
  "gv.aiEnable": "启用频道 AI 接管",
  "gv.aiEnableHint": "仅对本频道生效；关闭后 AI 不审核本频道任何消息。",
  "gv.aiActionTitle": "命中违规后执行的动作（可多选）",
  "gv.aiActMute": "禁言违规成员（需管理员）",
  "gv.aiActRecall": "撤回违规消息（需管理员）",
  "gv.aiActWarn": "发警告消息（最稳妥）",
  "gv.aiActionHint": "动作失败不影响其他动作；失败原因会记在处罚日志里。建议至少开启「发警告」。",
  "gv.aiDurationTitle": "三级禁言时长（分钟）",
  "gv.aiDurLight": "轻微",
  "gv.aiDurMedium": "明显",
  "gv.aiDurSevere": "严重",
  "gv.aiDurationHint": "近 30 天多次违规会逐次加重，累计封顶 30 天；连续 30 天不违规自动清零。",
  "gv.aiRulesTitle": "自定义频道规则",
  "gv.aiRulesPlaceholder": "每行一条，例如：禁止发布外部二维码",
  "gv.aiRulesHint": "规则会注入 AI 判定提示；内置分类（违法/色情赌博/辱骂/广告/刷屏）始终可用。",
  "gv.aiScopeTitle": "生效范围与免审",
  "gv.aiWhitelist": "免审用户 ID",
  "gv.aiWhitelistPlaceholder": "每行一个用户 ID",
  "gv.aiWhitelistHint": "命中名单的成员消息直接跳过，不调用 AI。",
  "gv.aiChannels": "只审核这些子频道",
  "gv.aiChannelsPlaceholder": "每行一个子频道 ID；留空 = 全部",
  "gv.aiChannelsHint": "留空表示审核本频道下所有子频道。",
  "gv.aiSave": "保存 AI 接管配置",
  "gv.aiSaved": "AI 接管配置已保存",
  "gv.aiLogsTitle": "处罚记录（最近 30 条）",
  "gv.aiLogsEmpty": "暂无 AI 处置记录",
  "gv.aiLogMinutes": "禁言",
  "gv.aiLogStrike": "第 N 次",
  // ── 频道二级弹窗 / 内容管理 / 成员扩展 / 接口权限 ──
  "gv.errApiPermission": "应用无接口访问权限：该能力需在 QQ 开发者中心为机器人单独开通，且多数仅私域机器人可用；开通后需把机器人移出频道再重新加入才生效。",
  "gv.roleNamePlaceholder": "新身份组",
  "gv.roleColorArgb": "颜色（十进制 ARGB）",
  "gv.roleColorHint": "上方取色器选颜色，或直接填十进制 ARGB（QQ 官方格式，高 8 位为透明度）。",
  "gv.idPasteHint": "可手动粘贴，或点输入框从下拉候选里选",
  "gv.userIdPlaceholder": "用户 ID",
  "gv.tab.apiPerm": "接口权限",
  "gv.apiPermDesc": "查看该频道的接口授权状态，或申请开通未授权的接口权限。",
  "gv.apiPermHint": "成员列表、帖子等接口需在开发者中心开通；查询后会列出每个接口的授权状态，未开通的可申请授权链接。",
  "gv.apiPermGet": "查询接口权限",
  "gv.apiPermCount": "共 {0} 个接口 · 已授权 {1} · 未授权 {2}",
  "gv.apiPermOnlyUnauth": "只看未授权",
  "gv.apiPermColMethod": "方法",
  "gv.apiPermColPath": "接口",
  "gv.apiPermColDesc": "说明",
  "gv.apiPermColState": "状态",
  "gv.apiPermStateOk": "已授权",
  "gv.apiPermStateNo": "未授权",
  "gv.apiPermEmpty": "没有符合条件的接口。",
  "gv.apiPermRaw": "查看原始 JSON",
  "gv.ct.recall": "撤回消息",
  "gv.ct.announce": "频道公告",
  "gv.ct.pin": "精华消息",
  "gv.ct.schedule": "日程",
  "gv.ct.audio": "音频控制",
  "gv.ct.forum": "帖子",
  "gv.announceChannel": "目标子频道",
  "gv.announceType": "公告类型",
  "gv.announceTypeWelcome": "欢迎公告",
  "gv.announceTypeMember": "成员公告",
  "gv.annList": "获取公告列表",
  "gv.annCreate": "发布公告",
  "gv.annCreated": "公告已发布",
  "gv.annDelete": "删除公告",
  "gv.annDeleted": "公告已删除",
  "gv.annHintTitle": "公告怎么用（官方无列表接口）",
  "gv.annHint": "QQ 官方不提供「公告列表」查询接口（GET 会报 405 请求方法非法），所以无法拉取已有公告。公告的本质是「把子频道里的一条消息设为公告」：先在目标子频道发一条消息，复制它的消息 ID 粘贴到上面，再点「发布公告」；删除时同样填该消息 ID。需机器人是该频道管理员。",
  "gv.pinMessageId": "消息 ID",
  "gv.pinHint": "从「加载消息」的下拉里选真实消息 ID，或粘贴消息 ID；不能用子频道 ID。单子频道最多 20 条精华，只有可见消息可设为精华。",
  "gv.pinTip": "消息 ID 不是子频道 ID。先点「加载本频道消息」拉取最近消息，再从「消息 ID」下拉里选一条；只有真实消息 ID 才能设为精华（填子频道 ID 会报 501009 格式错误）。也可先用「发消息」发送一条，从发送回执里复制消息 ID。",
  "gv.pinMsgPlaceholder": "先加载消息再选择，或粘贴真实消息 ID",
  "gv.pinLoad": "加载本频道消息",
  "gv.pinLoaded": "已加载 {0} 条消息，请从「消息 ID」下拉选择",
  "gv.pinLoadEmpty": "没拉到消息：可能该子频道暂不可见或机器人无权限，可改用「发消息」的回执 ID。",
  "gv.errBadMsgId": "消息 ID 格式不对：这里要填真实的消息 ID，不是子频道 ID。请先点「加载本频道消息」从下拉里选择一条。",
  "gv.pinList": "获取精华列表",
  "gv.pinAdd": "添加精华",
  "gv.pinAdded": "已添加精华消息",
  "gv.pinDelete": "删除精华",
  "gv.pinDeleted": "已删除精华消息",
  "gv.scheduleId": "日程 ID",
  "gv.scheduleIdPlaceholder": "修改 / 删除时填写",
  "gv.scheduleBody": "日程内容（JSON）",
  "gv.scheduleHint": "毫秒时间戳字符串：开始须晚于当前、结束晚于开始、时长≤7 天，remind_type 取 0-5（0 不提醒 / 1 开始提醒 / 2 前 5 分 / 3 前 15 分 / 4 前 30 分 / 5 前 60 分）。模板已填好未来 1 小时的可用时间，改个名字就能创建。日程须建在「日程」类型子频道，机器人需是该频道管理员。",
  "gv.schReset": "重置模板",
  "gv.schResetDone": "已重置为可用模板（1 小时后开始、持续 1 小时）",
  "gv.schErrName": "日程名称（name）不能为空",
  "gv.schErrStart": "开始时间（start_timestamp）须是毫秒时间戳字符串，如 1735000000000",
  "gv.schErrEnd": "结束时间（end_timestamp）须是毫秒时间戳字符串",
  "gv.schErrPast": "开始时间须晚于当前时间（官方 302015）",
  "gv.schErrEndBeforeStart": "结束时间须晚于开始时间（官方 302016）",
  "gv.schErrTooLong": "日程持续时间不能超过 7 天（官方 302014）",
  "gv.schErrRemind": "remind_type 只能是 0-5 的字符串",
  "gv.schErrEmpty": "日程对象为空或字段无效，请检查 JSON（官方 302017）",
  "gv.schErrType": "参数类型转换失败，时间戳须是不带小数的毫秒字符串（官方 302018）",
  "gv.schErr302013": "创建日程触发安全打击，请稍后重试或修改内容（官方 302013）",
  "gv.schErr302019": "平台下游异常，请稍后重试（官方 302019）",
  "gv.schErr302020": "日程内容或账号违规，请修改内容（官方 302020）",
  "gv.schErr302021": "该频道当日新增日程已达上限，请明天再试（官方 302021）",
  "gv.schErr302022": "跳转子频道须属于当前频道（官方 302022）",
  "gv.schErr302023": "开始时跳转不能绑定日程子频道本身（官方 302023）",
  "gv.schErr302024": "绑定的跳转子频道不存在，请检查 ID（官方 302024）",
  "gv.schList": "获取日程列表",
  "gv.schGet": "获取日程详情",
  "gv.schCreate": "创建日程",
  "gv.schCreated": "日程已创建",
  "gv.schPatch": "修改日程",
  "gv.schPatched": "日程已修改",
  "gv.schDelete": "删除日程",
  "gv.schDeleted": "日程已删除",
  "gv.audioBody": "音频控制参数（JSON）",
  "gv.audioHint": "官方 POST /channels/{id}/audio；选语音 / 直播子频道，参数按官方约定填写（如 audio_url、text）。机器人上麦 / 下麦也走此接口。",
  "gv.audioDo": "执行音频控制",
  "gv.audioDone": "音频控制已执行",
  "gv.forumId": "论坛子频道 ID（forum_id）",
  "gv.forumIdPlaceholder": "论坛子频道 ID",
  "gv.forumThreadId": "帖子 ID（thread_id）",
  "gv.forumThreadIdPlaceholder": "查看 / 删除时填写",
  "gv.forumBody": "帖子内容（JSON）",
  "gv.forumTip": "只需选论坛子频道，不用再填 forum_id：官方现行接口只用子频道 ID。帖子内容按官方格式填 JSON（title 标题 + content 富文本），仅私域机器人可用，开通后需把机器人移出频道再重新加入。",
  "gv.forumList": "获取帖子列表",
  "gv.forumGet": "获取帖子详情",
  "gv.forumCreate": "发表帖子",
  "gv.forumCreated": "帖子已发表",
  "gv.forumDelete": "删除帖子",
  "gv.forumDeleted": "帖子已删除",
  "gv.invalidJson": "JSON 格式错误，请检查后重试",
  "gv.memMoreTitle": "更多成员能力",
  "gv.memOnlineChannel": "在线数子频道",
  "gv.memOnline": "查在线人数",
  "gv.memRoleId": "身份组 ID",
  "gv.memRoleIdPlaceholder": "用于查身份组成员",
  "gv.memRoleList": "查身份组成员",
  "gv.memKick": "移出频道",
  "gv.memKicked": "成员已移出频道",
  "gv.memKickConfirm": "确定把成员 {0} 移出频道吗？此操作不可撤销。",
  "gv.aiSubConfig": "接管配置",
  "gv.aiSubLogs": "处罚记录",
  "gv.aiSubReply": "自动回帖",
  "gv.replyEnableTitle": "自动回帖总开关",
  "gv.replyEnable": "开启频道 AI 自动回帖",
  "gv.replyEnableHint": "按频道独立配置；关闭后该频道不再产生任何自动回帖。",
  "gv.replyTriggers": "回帖触发",
  "gv.replyOnPost": "新主题 / 新帖子自动回一次",
  "gv.replyOnMention": "评论 / 消息 @机器人时回复",
  "gv.replyOnce": "同一主题 / 帖子只回一次",
  "gv.replyTriggerHint": "「只回一次」在重启后依然有效（30 天内），@回复按单条评论分别计数。",
  "gv.replyPrompt": "自定义回帖要求",
  "gv.replyPromptPlaceholder": "例如：用简短友好的语气回答，回答不了就请对方补充信息",
  "gv.replyPromptHint": "追加到模型提示词；模型判断内容无意义或纯广告时会保持静默。",
  "gv.replyScopeTitle": "生效范围与免回帖",
  "gv.replyWhitelist": "免回帖成员 ID",
  "gv.replyWhitelistPlaceholder": "每行一个成员 ID",
  "gv.replyChannels": "生效子频道 ID",
  "gv.replyChannelsPlaceholder": "每行一个子频道 ID；留空 = 该频道全部",
  "gv.replyScopeHint": "只会在这几类事件触发：论坛新主题/新帖、论坛评论、私域频道普通消息、@机器人消息。",
  "gv.replyIntents": "事件订阅（私域权限）",
  "gv.replyGuildMessages": "订阅频道全量消息 MESSAGE_CREATE",
  "gv.replyForumEvents": "订阅论坛事件 FORUM_*",
  "gv.replyIntentsHint": "仅私域机器人可申请；无权限却开启会导致 WebSocket 连接失败。开关保存后会自动重连。",
  "gv.replyIntentsLink": "前往 QQ 开放平台开通权限",
  "gv.replySave": "保存回帖配置",
  "gv.replySaved": "自动回帖配置已保存",
  "gv.replyLogsTitle": "回帖记录",
  "gv.replyLogsEmpty": "还没有回帖记录",
  "gv.replyLogOk": "已回复",
  "gv.replyLogFail": "失败",
  // ── AI 执行记录（触发在 agent 聊天里；群聊管理 / 频道管理共用） ──
  "ai.title": "执行记录",
  "ai.titleGroup": "群聊执行记录",
  "ai.titleGuild": "频道执行记录",
  "ai.subtitle": "这里只展示操作记录；直接在 agent 聊天里说出要做的事即可。",
  "ai.subtitleGroup": "只显示本群最近 30 条操作记录，独立保存。",
  "ai.subtitleGuild": "只显示本频道最近 30 条操作记录，独立保存。",
  "ai.refresh": "刷新",
  "ai.srcLocal": "本地识别",
  "ai.srcLlm": "AI 识别",
  "ai.srcCache": "缓存",
  "ai.srcNone": "未识别",
  "ai.usage": "用量",
  "ai.usageStat": "本地 {0} · 缓存 {1} · AI 调用 {2} · 已省约 {3} token",
  "ai.logEmpty": "还没有操作记录。在 agent 聊天里说一句「禁言张三 10 分钟」就能触发，记录会出现在这里。",
  "ai.logOk": "已执行",
  "ai.logFail": "未执行",
  "ai.logTarget": "目标：{0}",
  "ai.disclaimerGroup": "在 agent 聊天里说一句话就能管理群聊，操作立即生效；常见指令本地快速识别，复杂需求交给 AI 理解。执行记录自动留档，重启后依然可查阅。",
  "ai.disclaimerGuild": "在 agent 聊天里说一句话就能管理频道，操作立即生效；常见指令本地快速识别，复杂需求交给 AI 理解。执行记录自动留档，重启后依然可查阅。",
  "gv.tab.assistant": "执行记录"
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
  "common.langProbe": "English",
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
  "session.hint": "Workspace, model, and preset.",
  "session.workspace": "Workspace directory",
  "session.workspaceHint": "Where sessions read and write files; empty = default workspace, applies to new sessions only.",
  "session.chooseDir": "Choose directory",
  "session.defaultWorkspace": "Default workspace (~/.dsh/file)",
  "session.modelHint": "Empty follows the host default model; existing sessions need a reset.",
  "session.followDefaultModel": "Follow default model",
  "session.preset": "Agent preset",
  "session.presetHint": "Behavior style and available tools.",
  // Shipped presets publish no name; the catalog falls back to the id, so localize here.
  "session.presetStandard": "Standard mode",
  "session.presetPtc": "PTC mode",
  "session.presetMinimal": "Minimal mode",
  "session.presetCordis": "Creator mode",
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
  "runtime.disabled": "Session runtime unavailable: incoming QQ messages are dropped — no sessions and no replies.",
  "runtime.disabledHint": "Usually the host dsh upgrade removed @deepseek-ai/dsh-webhook. Install the version matching your dsh host and restart dsh web; the plugin also retries in the background. Check runtimeReady via curl http://127.0.0.1:3080/qqbot/status.",
  "runtime.recheck": "Recheck",
  // ── list ──
  "list.addBot": "+ Add bot",
  "list.empty": "No bot configured yet",
  "list.emptyHint": "Click “+ Add bot” above, scan the QR code with the mobile QQ app, or enter the AppID / AppSecret manually. Once connected, behavior settings become available in the bot details.",
  "list.cardHint": "Click a bot card to open its details: view the QQ connection status and adjust behavior settings.",
  "list.cardOpen": "Open details",
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
  "qr.step1": "Click “Generate QR code” below the QR area; a 3-minute countdown starts once it appears.",
  "qr.step2": "Open mobile QQ, tap “+” in the top-right corner, choose “Scan”, and scan this code.",
  "qr.step3": "Follow the QQ prompts to confirm and authorize this bot for the local dsh.",
  "qr.step4": "This page checks the result every 2 seconds and opens the bot details automatically once linked.",
  "qr.note1": "The QR code is valid for 3 minutes; a new one is generated automatically when it expires — no need to refresh the page.",
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
  "detail.groupRuntime": "Runtime",
  "detail.groupRuntimeHint": "Counters are tracked per bot",
  "detail.groupConfig": "Configuration",
  "detail.groupConfigHint": "Each bot is independent; changes apply instantly",
  "detail.groupManage": "Management",
  "detail.actionSchedule": "Scheduled messages",
  "detail.actionScheduleHint": "Scheduled proactive pushes",
  "detail.actionArchive": "Message archive",
  "detail.actionArchiveHint": "Browse sent and received messages by day",
  "detail.summarySchedule": "Create / edit / enable / test send",
  "detail.summaryArchive": "Browse records by day",
  "detail.summaryStats": "{0} received · {1} replied · {2} proactive · {3} errors",
  "detail.summarySession": "{0} · {1}",
  "detail.summaryPolicy": "{0}/{1} switches on",
  "detail.summaryTune": "8 numeric settings",
  "detail.summaryGroup": "{0} group overrides",
  "detail.summaryConn": "{0} · WebSocket {1}",
  "detail.customWorkspace": "Custom workspace",
  "detail.aboutTitle": "About",
  "detail.aboutHint": "Version and license info.",
  "detail.aboutVersion": "Version",
  "detail.aboutAuthor": "Author",
  "detail.aboutLicense": "License",
  "detail.aboutRepo": "Source",
  "detail.aboutCopyright": "Provided “as is”, without warranty of any kind. Use at your own risk.",
  // ── app ──
  "app.title": "QQ Bot",
  "app.settingsTitle": "QQ Bot settings",
  "app.subtitle": "Connect QQ bots to DeepSeek Harness",
  // ── stats ──
  "stats.title": "Run statistics",
  "stats.hint": "A running tally of messages, sessions and replies.",
  "stats.resetHint": "Zero out this bot's run counters (takes effect and persists immediately)",
  "stats.resetConfirm": "Reset this bot's run counters to zero? This cannot be undone.",
  "stats.received": "Messages received",
  "stats.sessions": "Sessions created",
  "stats.passive": "Passive replies",
  "stats.proactive": "Proactive messages",
  "stats.bound": "Bound sessions",
  "stats.pendingQueue": "Reply queue",
  "stats.groupBuffer": "Group buffer",
  "stats.errors": "Errors",
  // ── console (bot management console modal) ──
  "console.title": "Bot management console",
  "console.titleBot": "Management console · {0}",
  "console.hint": "Check running status and use every feature from here.",
  "console.menuLabel": "Feature menu",
  "console.grpOverview": "Overview",
  "console.grpRuntime": "Runtime",
  "console.grpConfig": "Configuration",
  "console.grpManage": "Management",
  "console.navOverview": "Operations overview",
  "console.navSchedule": "Scheduled messages",
  "console.navArchive": "Message archive",
  "console.navSession": "Session & model",
  "console.navPolicy": "Reply policy",
  "console.navTune": "Reply tuning",
  "console.navOverride": "Per-group overrides",
  "console.navManifest": "Configuration JSON",
  "console.navPlatform": "Group management",
  "console.navGuild": "Guild management",
  "console.navEvents": "Event reference",
  "console.chartDaily": "Messages received in the last 7 days",
  "console.chartCompose": "Message breakdown",
  "console.barTip": "{0}: {1} messages",
  "console.legendPassive": "Passive replies {0}",
  "console.legendProactive": "Proactive messages {0}",
  "console.ovPrimary": "Primary bot",
  "console.ovSecondary": "Added",
  "console.ovTodayLabel": "Today's messages",
  "console.ovToday": "{0} today",
  "console.ovGroups": "Groups",
  "console.ovShare": "Share {0}",
  "console.ovTotalReplies": "Total replies",
  "console.ovWeekTotal": "7-day total {0}",
  "console.ovPeakDay": "Peak {0} · {1}",
  "console.ovPeak": "Peak",
  "console.ovStatusTitle": "Runtime status",
  "console.ovConnect": "Connection",
  "console.ovLastConnect": "Last connected",
  "console.ovNever": "Not connected yet",
  "console.ovNoData": "No data yet",
  "console.ovWaiting": "Awaiting reply",
  "console.ovClear": "All clear",
  "console.ovNormal": "Healthy",
  "console.ovAttention": "Needs attention",
  "ui.modernMode": "New interface",
  "ui.legacyMode": "Classic interface",
  "console.ovArchiveKinds": "Archived messages by type",
  "console.ovArchiveScopes": "Chat sources",
  "console.ovArchiveMonths": "Archived by month",
  "console.ovArchiveTotal": "{0} total",
  "console.ovArchiveChats": "{0} chats",
  "console.ovArchiveGroup": "Group",
  "console.ovArchiveC2c": "Direct",
  "console.navKwConfig": "Keyword rule config",
  "console.navKwLogs": "Keyword rule log",
  // ── policy ──
  "policy.title": "Message & reply policy",
  "policy.hint": "What to handle and how to reply.",
  "policy.fullGroupReply": "Reply to all group messages",
  "policy.fullGroupReplyHint": "When on, non-@ group messages are also scored and replied above the threshold; @-mentions always get replies.",
  "policy.acceptDm": "Accept direct messages",
  "policy.acceptDmHint": "Whether to respond to QQ direct (C2C) messages. When off, the bot processes group messages only and ignores DMs.",
  "policy.respondBots": "Respond to bot messages",
  "policy.respondBotsHint": "When on, messages from other bots also trigger replies; off by default to prevent bots triggering each other.",
  "policy.markdown": "Markdown replies",
  "policy.markdownHint": "Prefer Markdown; falls back to plain text automatically if the platform rejects it.",
  "policy.quote": "Quote the user's message",
  "policy.quoteHint": "Reply quotes the original message via QQ's native quote card; group chats only: off = no quote, at = group @-mentions only (recommended), all = every group reply. Falls back to a plain reply on failure.",
  "policy.quoteScope": "Quote reply scope",
  "policy.quoteScopeOff": "off (no quote)",
  "policy.quoteScopeAt": "at (group @-mentions only, recommended)",
  "policy.quoteScopeAll": "all (every group reply)",
  "policy.quoteLimit": "Quote preview length",
  "policy.quoteLimitHint": "Max characters shown in a text quote; extra is ellipsized.",
  "policy.chatPreset": "Group chat preset (retired)",
  "policy.chatPresetHint": "Deprecated: group and DM chats now share the same capabilities; kept only for old configs.",
  "policy.followAgentPreset": "Follow Agent Preset",
  "policy.secretEnv": "AppSecret credential reference (secretEnv)",
  "policy.secretEnvShort": "AppSecret credential reference",
  "policy.secretEnvHint": "Credential reference replacing plaintext AppSecret, takes priority when filled; empty uses the scanned / entered secret.",
  "policy.secretEnvPlaceholder": "e.g. my-qq-app-secret (leave empty to disable)",
  // ── quota ──
  "quota.daily": "Daily proactive quota",
  "quota.dailyHint": "Daily cap of proactive messages (schedules, welcome, redelivery, images all count); 0 = unlimited, but the platform quota is tiny — keep the default 50.",
  "quota.unlimitedZero": "0 (unlimited)",
  // ── feature ──
  "feature.multimodal": "Multimodal messages",
  "feature.multimodalHint": "Images / files / voice are injected as attachments the model can handle directly; off keeps only a placeholder.",
  "feature.memory": "Long-term memory",
  "feature.memoryHint": "Each chat keeps a persistent memory across /new; say “remember” in chat to write.",
  "feature.welcome": "Welcome message",
  "feature.welcomeHint": "When a new member joins a group or adds the bot as a friend, the bot sends a welcome message automatically (text in the input below; {nick} is replaced with their identifier). Sent via the proactive channel and counts against the daily quota.",
  "feature.emojiRecall": "Emoji-recall",
  "feature.emojiRecallHint": "Anyone reacting 🗑️ to a message the bot sent makes the bot recall that message (requires the platform's “message recall” permission).",
  "feature.buttonApproval": "Button approvals",
  "feature.buttonApprovalHint": "Sensitive operations send an “✅ Allow / ❌ Deny” button message; timeout counts as denial.",
  "feature.fileContent": "File content ingestion",
  "feature.fileContentHint": "When a text-like file (txt/md/json/csv/code, ≤1MB) arrives, its content is downloaded and excerpted into the model context so the AI can read it before replying; binary files (docx/pdf etc.) are listed by name only. Requires the “Attachment forwarding” switch.",
  "feature.welcomeText": "Welcome text",
  "feature.welcomeTextHint": "Content sent when “Welcome message” is on; {nick} is replaced with the new member's identifier. Leave empty to use the default “Welcome {nick}! @me to chat with me.”.",
  "feature.welcomeDefault": "Welcome {nick}! @me to chat with me.",
  "feature.bannedWords": "Banned words",
  "feature.bannedWordsHint": "Comma-separated; a hit recalls the message and skips the reply.",
  "feature.bannedWordsPlaceholder": "word1, word2 (leave empty to disable)",
  "feature.passiveFallback": "Fall back to proactive messages",
  "feature.passiveFallbackHint": "When a passive reply times out or fails, retry once via the proactive-message API. The daily proactive quota is tiny — enable only temporarily while debugging.",
  "feature.archive": "Local message archive",
  "feature.archiveHint": "Writes received messages and sent replies to ~/.dsh/qqbot/archive/ as an audit trail for later troubleshooting.",
  "feature.archiveMedia": "Archive media files",
  "feature.archiveMediaHint": `Whether images / videos / files from chats are downloaded and kept locally (~/.dsh/qqbot/archive/images|videos|files/). The platform's attachment URLs expire quickly, so without saving you only see the file name, not the content. Defaults to "Don't save" (text only, no media files on disk).`,
  "feature.archiveMediaOff": "Don't save (text only)",
  "feature.archiveMediaImage": "Images only",
  "feature.archiveMediaImageVideo": "Images + videos",
  "feature.archiveMediaAll": "Images + videos + files",
  "feature.sanitizeReply": "Reply sanitization",
  "feature.sanitizeReplyHint": "Strips hidden tag blocks such as system-reminder and <think> from model output before sending, preventing internal prompts and reasoning from leaking to chat partners. Only affects outgoing content; archives and model context keep the original text.",
  "feature.ssrfGuard": "Media URL safety check (SSRF guard)",
  "feature.ssrfGuardHint": "Media URLs are checked against intranet addresses before sending, guarding against probing.",
  "feature.forceVerifyImage": "Strict Markdown image verification",
  "feature.forceVerifyImageHint": "When on, a Markdown reply whose image fails to transfer is aborted with an error (default off: the message still sends without the image).",
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
  "tune.hint": "Reply rate and chunk sizes.",
  "tune.allZero": "0 (no limits at all)",
  "tune.offZero": "0 (off)",
  "tune.groupValueThreshold": "Group message value threshold",
  "tune.atContext": "AT context messages",
  "tune.minGroupInterval": "Min group reply interval",
  "tune.sameSenderInterval": "Same-sender reply interval",
  "tune.chunkChars": "Chunk size (chars)",
  "tune.maxReplies": "Max replies per message",
  "tune.groupValueThresholdHint": "0–10: reply only above the score; higher = quieter; @-mentions exempt. 0 = no limits at all: every group message gets a reply and both intervals below are ignored.",
  "tune.atContextHint": "Attach the latest N group messages for context when @-mentioned; 0 = only the mention.",
  "tune.minGroupIntervalHint": "Min interval between non-@ replies in one group; @-replies exempt. Ignored when the threshold is 0.",
  "tune.sameSenderIntervalHint": "The same sender won't get a second reply within this interval. Ignored when the threshold is 0.",
  "tune.chunkCharsHint": "Long replies are split into chunks of this size and sent in order.",
  "tune.maxRepliesHint": "Max replies per message (QQ platform hard cap 5).",
  // ── conn ──
  "conn.title": "Connection & removal",
  "conn.hint": "Enable, primary, reconnect, remove.",
  "conn.disableBot": "Disable this bot",
  "conn.enableBot": "Enable this bot",
  "conn.disableHint": "Disabled bots stay offline and handle no messages.",
  "conn.disable": "Disable",
  "conn.enable": "Enable",
  "conn.primaryHint": "Default bot when none is specified (scheduled tasks, etc.).",
  "conn.check": "Check connection",
  "conn.retry": "Retry connection",
  "conn.retryHint": "Rebuilds the QQ WebSocket long connection with the current credentials. Click this first when messages stop arriving.",
  "conn.checking": "Checking…",
  "conn.remove": "Remove integration",
  "conn.removeHint": "Deletes credentials and config; stops immediately, cannot be undone.",
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
  "picker.computer": "This PC (choose a drive)",
  // ── sched ──
  "sched.tabScheduled": "Scheduled",
  "sched.scopeCurrentBot": "Current bot",
  "sched.scopeCurrent": "Current",
  "sched.scopeAllBots": "All bots",
  "sched.groupTasks": "Group tasks",
  "sched.dmTasks": "Direct chats",
  "sched.collapseGroup": "Collapse this group",
  "sched.expandGroup": "Expand this group",
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
  "sched.archiveIntro": 'With "message archiving" on, sent/received messages are written to ~/.dsh/qqbot/archive/ (one folder per group/user, one file per month). This shows recent records read-only, newest first.',
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
  "sched.enabledToast": "Enabled — next run {0}",
  "sched.enabledNoNext": "Enabled, but the next run time cannot be computed. Check the trigger settings.",
  "sched.disabledToast": "Disabled — will no longer run",
  "sched.bg.create": "Create scheduled message",
  "sched.bg.update": "Update scheduled message",
  "sched.bg.remove": "Delete scheduled message",
  "sched.bg.enable": "Enable scheduled message",
  "sched.bg.disable": "Disable scheduled message",
  "sched.bg.runOnce": "Test-run scheduled message",
  "sched.bg.send": "Scheduled message send",
  "sched.bg.sent": "Sent",
  "sched.bg.skipped": "Send skipped",
  "sched.bg.done": "Done",
  "sched.noNextRun": "Next run time cannot be computed — check the trigger settings",
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
  "sched.form.atEveryone": "@ everyone",
  "sched.form.atEveryoneHint": "Mention everyone in the group when sending. The bot must be a group admin, and each group allows only one @-everyone per day.",
  "sched.form.atEveryoneOn": "Will @ everyone when sending",
  "sched.form.atEveryoneOff": "Will not @ everyone",
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
  "archive.subtitle": "Recent locally archived messages (read-only; filtered by the current bot)",
  "archive.subtitle2": `Locally archived messages (filtered by the current bot): expand a conversation → month on the left; on the right, view messages newest-first (avatar, name, time, quoted reply), showing the latest 300 by default with "Load more / Show all"; the header delete icon clears only the current month's archive, keeping other months.`,
  "archive.loading": "Loading archive…",
  "archive.loadingChats": "Loading conversations…",
  "archive.empty": 'No records on this day. Records appear here once "message archiving" is on and messages arrive.',
  "archive.chatsList": "Archived conversations",
  "archive.noChats": "No archived conversations",
  "archive.pickChat": "Pick a conversation on the left to view its messages",
  "archive.pickMonth": 'Pick a "conversation → month" on the left to view archived messages',
  "archive.chatEmpty": "No records in this conversation",
  "archive.noMonths": "No monthly archive",
  "archive.unknownMonth": "Unknown month",
  "archive.monthCount": "{0} this month",
  "archive.loadMore": "Load more",
  "archive.showAll": "Show all",
  "archive.shownOf": "Showing {0} / {1} records",
  "archive.dateFiles": "Archive date files",
  "archive.noFiles": "No archive files yet",
  "archive.deleteHint": "Delete this day's archive (only this bot's records)",
  "archive.received": "Received",
  "archive.reply": "Reply",
  "archive.proactive": "Proactive",
  "archive.session": "Session",
  "archive.people": "Direct",
  "archive.groups": "Groups",
  "archive.them": "Them",
  "archive.groupMemberNum": "{0} group members",
  "archive.groupMembersShort": "{0} members",
  "archive.groupClass": "Category {0}",
  "archive.groupTags": "Tags {0}",
  "archive.groupMemo": "About {0}",
  "archive.monthCountTotal": "Archived message count",
  // ── 平台能力 ──
  "common.copy": "Copy",
  "pt.tabTitle": "Group management",
  "pt.tabHint": "QQ group profile, members, blacklist, join approvals and group rule review, plus share links, menus and more.",
  "pt.tabSummary": "Group · Approval · Rule Review",
  "pt.shareTitle": "Friend share link",
  "pt.shareHint": "Generate an invite link so users can add the bot as a friend; an optional callback payload tracks the source.",
  "pt.shareGen": "Generate link",
  "pt.shareDone": "Share link generated — press Copy to share it",
  "pt.selfTitle": "Bot info",
  "pt.selfLoad": "View",
  "pt.selfName": "Nickname",
  "pt.selfId": "Bot ID",
  "pt.selfBot": "Is bot",
  "pt.selfBotYes": "Yes",
  "pt.selfBotNo": "No",
  "pt.selfWelcome": "Join welcome",
  "pt.menuTitle": "Custom menu (C2C)",
  "pt.menuHint": "Bottom menu in direct chats. Generate from the command list or edit the JSON directly; saving replaces the whole menu.",
  "pt.menuGen": "Generate from commands",
  "pt.menuSaved": "Menu saved (version={0}); reopen a chat to see the update",
  "pt.menuLoaded": "Loaded {0} menu items",
  "pt.menuEmpty": "No menu configured yet",
  "pt.menuBadJson": "Menu content is not a valid JSON array",
  "pt.menuPlaceholder": 'Fill via "Generate from commands" or Refresh, then edit and save',
  "pt.panelsTitle": "Command panels",
  "pt.panelsHint": "Command panels shown in the QQ client (max 20 per bot). Create, edit and delete panels here, and link specific panels to chosen groups.",
  "pt.panelsLoaded": "Command panels loaded",
  "pt.panelsCount": "{0} panels in total",
  "pt.panelsItems": "{0} items",
  "pt.panelsEmpty": 'No command panels for this scope yet. Click "New panel" to start.',
  "pt.panelNew": "New panel",
  "pt.panelView": "View",
  "pt.panelViewing": "View panel (read-only)",
  "pt.panelEditing": "Edit panel (existing ID; saving overwrites its items and remark)",
  "pt.panelCreating": "New panel (fill in items and remark, then save)",
  "pt.panelRemark": "Panel remark (optional, for your own reference)",
  "pt.panelItems": "Panel buttons (one button per item, max 20)",
  "pt.panelHelpTitle": "Example (expand to view)",
  "pt.panelHelpExample": 'What a command button does: tapping it fills the command into the chat input box (it does NOT auto-send). The member then taps send, and only then does the bot execute it. So it saves typing/remembering the command — it is not a one-tap run.\n\nExample: two buttons\n\n1) Type Command, pick "/help Help" from the name dropdown, description "See bot usage"\n   → tapping it fills /help into the input box; after the member taps send, the bot replies with help\n\n2) Type Link, name "Help center", description "Open help"\n   Link: https://example.com/help\n   → tapping it opens that page directly\n\nTick "Admins only" to hide a button from regular members.',
  "pt.panelItemNo": "Button {0}",
  "pt.panelItemDel": "Remove button",
  "pt.panelItemType": "Type",
  "pt.panelItemTypeCmd": "Command (fills the input box on tap)",
  "pt.panelItemTypeLink": "Link (opens a web page on tap)",
  "pt.panelItemName": "Display name",
  "pt.panelItemCmd": "Command (fills the input box on tap)",
  "pt.panelCmdInvalid": "Invalid command (must start with /)",
  "pt.panelCmdPick": "Select a command",
  "pt.panelCmdNeedSelect": "Command buttons must have a command selected",
  "pt.panelAdminYes": "Yes",
  "pt.panelAdminNo": "No",
  "pt.panelItemNamePh": "e.g. Help center",
  "pt.cmdHelp": "Help",
  "pt.cmdStatus": "Status",
  "pt.cmdNew": "New session",
  "pt.cmdSession": "Session info",
  "pt.cmdMemory": "Long-term memory",
  "pt.cmdForget": "Clear memory",
  "pt.cmdRecall": "Recall message",
  "pt.cmdBroadcast": "Broadcast",
  "pt.cmdSchedule": "Scheduled messages",
  "pt.cmdStop": "Stop task",
  "pt.cmdSteer": "Add instruction",
  "pt.cmdPerm": "Permissions",
  "pt.panelItemDesc": "Description",
  "pt.panelItemDescPh": "e.g. Daily check-in",
  "pt.panelItemLink": "Link URL (must start with https://)",
  "pt.panelItemAdmin": "Admins only",
  "pt.panelItemAdd": "Add button",
  "pt.panelItemCount": "{0} / {1}",
  "pt.panelItemsEmpty": 'No buttons yet — click "Add button" to start',
  "pt.panelNeedItem": "A panel needs at least 1 button",
  "pt.panelItemNeedName": "Every button needs a display name",
  "pt.panelItemBadLink": "A link button's URL must start with https://",
  "pt.panelCreated": "Panel created",
  "pt.panelUpdated": "Panel updated",
  "pt.panelDeleted": "Panel deleted",
  "pt.materialTitle": "Material upload (Markdown inline image)",
  "pt.materialHint": "Upload an image to QQ's material library and get a qqbot-media:// reference for Markdown messages (max 100 images per bot; unused for 90 days expires).",
  "pt.materialUpload": "Upload",
  "pt.materialDone": "Uploaded — reference copied to clipboard",
  "pt.materialCopied": "Copied; paste it into Markdown content",
  "pt.cardTitle": "Picture card",
  "pt.cardHint": "Send a picture card to groups/direct chats (title 1-50 chars, description 1-200 chars, https links only).",
  "pt.cardScope": "Target type",
  "pt.cardOpenid": "Target openid",
  "pt.cardOpenidPlaceholder": "Group or user openid (see the archive dialog)",
  "pt.cardTitleLabel": "Title",
  "pt.cardDesc": "Description",
  "pt.cardUrl": "Jump link",
  "pt.cardPic": "Cover image URL",
  "pt.cardPicHint": "Must be a public https image URL that opens directly in a browser (an image, not a web page), with no hotlink protection; the qqbot-media:// reference from material upload cannot be used as a card cover. QQ servers fetch and re-host it in real time, so a retry may fix occasional failures.",
  "pt.cardSend": "Send card",
  "pt.cardSent": "Picture card sent",
  "pt.errProactiveDenied": 'Proactive messages denied: apply for the "proactive message" capability on the QQ Open Platform, or pick a recent message below to reply within the 5-minute passive window.',
  "pt.errImageTransfer": "Cover image re-host failed (40034141): QQ servers could not fetch this image. Make sure the cover is a public, hotlink-free https image URL (not a web page link, and not a qqbot-media:// material reference); try again, and if it keeps failing use an image from a stable host.",
  "pt.errHostRestart": "The host plugin has not loaded this new endpoint yet. Restart dsh web, then refresh the settings page and try again.",
  "pt.cardReplyMsg": "Reply to (optional)",
  "pt.cardReplyNone": "No reply · proactive (needs permission)",
  "pt.cardReplyLoad": "Refresh replyable messages",
  "pt.cardReplyEmpty": "No replyable messages in the last 5 minutes (someone must @ the bot or send a message first)",
  "pt.cardReplyHint": "Passive reply: pick a recent message, valid for 5 minutes, no proactive permission needed",
  "pt.cardRepliesLoaded": "Loaded {0} replyable messages",
  "pt.replyLeft": "{0}s left",
  "pt.joinTitle": "Join approvals",
  "pt.joinHint": "Let AI auto-approve by your rules, or approve/decline manually (bot must be group admin).",
  "pt.jaNeedAdmin": "The bot is not an admin in this group, so join approvals are unavailable. Please make the bot an admin in QQ group settings first.",
  "pt.jaTitle": "AI auto-approval",
  "pt.jaDesc": 'Write your entry requirements, then click "AI auto-approve". Requests that clearly match are approved; uncertain ones are left for manual review.',
  "pt.jaSaved": "Auto-approval config saved",
  "pt.jaOn": "● Auto-approval on",
  "pt.jaOff": "○ Auto-approval off",
  "pt.jaEnable": "Turn on",
  "pt.jaDisable": "Turn off",
  "pt.jaEnableCheck": "Enable AI auto-approval",
  "pt.jaEnableCheckDesc": "Only when ticked can requests be auto-approved; unticking only pauses execution and keeps all settings.",
  "pt.jaSecEnable": "① Enable or not",
  "pt.jaSecReq": "② Entry requirements (match = auto-approve)",
  "pt.jaSecReqDesc": 'Write in plain language what a good intro looks like, one per line, e.g. "says which group they came from" or "gives real name". AI approves only when clearly matching.',
  "pt.jaReqPlaceholder": "One requirement per line, e.g.:\nIntro explains the reason to join\nNot an ad or marketing account",
  "pt.jaAllowEmpty": "Let AI judge empty intros too (default: keep empty intros for manual review)",
  "pt.jaRun": "AI auto-approve",
  "pt.jaNeedEnable": "Turn on and save the config first",
  "pt.jaRunDone": "AI review done: {0} approved, {1} kept for manual, {2} failed",
  "pt.jaResPass": "Approved {0}",
  "pt.jaResKeep": "Manual {0}",
  "pt.jaResFail": "Failed {0}",
  "pt.jaLogsLoaded": "Approval history loaded",
  "pt.jaTabAuto": "AI auto-approval",
  "pt.jaTabManual": "Manual review",
  "pt.jaSummaryReq": "{0} requirement(s)",
  "pt.jaSummaryWhite": "{0} on allowlist",
  "pt.jaSummaryEmptyOn": "Empty intros → AI",
  "pt.jaSummaryEmptyOff": "Empty intros → manual",
  "pt.jaGroupRules": "Rules setup",
  "pt.jaGroupRulesDesc": "Turn it on and define what counts as a valid introduction",
  "pt.jaSecEnableTip": "Auto-approval only runs when enabled; all settings are kept when off.",
  "pt.jaSecEmpty": "How to handle empty intros",
  "pt.jaSecEmptyDesc": "By default empty intros go straight to manual review; tick to let AI judge them too.",
  "pt.jaSecWhite": "Allowlist (auto-approve)",
  "pt.jaSecWhiteDesc": "Members on this list are approved automatically without AI judging or needing an intro. Enter member nicknames or openids, one per line.",
  "pt.jaWhitePlaceholder": "One nickname or openid per line, e.g.:\nAlice\nbearer",
  "pt.jaGroupRun": "Run & history",
  "pt.jaGroupRunDesc": 'After saving rules, click "AI auto-approve"; results and history show here',
  "pt.jaSecRun": "Run auto-approval",
  "pt.jaSecRunDesc": "Fetch pending requests, auto-approve those that clearly match, and keep the rest for manual review.",
  "pt.jaManualDesc": "Fetch this group's pending requests and approve or decline them one by one (bot must be group admin).",
  "pt.joinEmpty": "No pending requests",
  "pt.joinEmptyDesc": `Click "Load requests" above to fetch this group's recent join requests.`,
  "pt.jaManualTitle": "Pending requests (manual)",
  "pt.jaAct.pass": "Approved",
  "pt.jaAct.keep": "Kept for manual",
  "pt.jaAct.decline": "Declined",
  "pt.jaAct.error": "Failed",
  "pt.jaViewRecords": "View approval history",
  "pt.jaGroupExec": "Run auto-approval",
  "pt.jaGroupExecDesc": 'After saving rules, click "AI auto-approve"; see results here and details in the Approval history tab',
  "pt.jaGroupAuto": "Automatic run",
  "pt.jaGroupAutoDesc": "Runs on a schedule once enabled - no manual click needed",
  "pt.jaSecAuto": "How it runs",
  "pt.jaSecAutoDesc": "After saving, the system checks this group's join requests every 5 minutes: matching requests are approved, the rest stay for manual review, and the same request is never reviewed twice.",
  "pt.jaAutoOn": "Auto-approval active: checks every 5 minutes; see results in the Approval history tab",
  "pt.jaAutoOff": 'Not enabled: tick "Enable AI auto-approval" and save to start automatic runs',
  "pt.jaEmptyKeep": "Empty intro → manual review (recommended)",
  "pt.jaEmptyKeepDesc": "With too little info the request is left to you — the safest option.",
  "pt.jaEmptyAi": "Empty intro → let AI judge",
  "pt.jaEmptyAiDesc": "Requests without an intro may still be auto-approved, useful when judging by other signals such as nickname.",
  "pt.jaTabRecords": "Approval history",
  "pt.jaStatTotal": "Records",
  "pt.jaStatPass": "Auto-approved",
  "pt.jaStatKeep": "Manual",
  "pt.jaStatFail": "Failed / declined",
  "pt.jaRecordsTitle": "Auto-approval history",
  "pt.jaRecordsHint": "Newest first, latest 30 only, including the AI verdict and the applicant's original reason.",
  "pt.jaRecordsEmpty": "No approval records yet",
  "pt.jaRecordsEmptyDesc": 'Run "AI auto-approve" once and each verdict with its application reason will appear here.',
  "pt.jaRecordReason": "AI verdict",
  "pt.jaRecordIntro": "Application reason",
  "pt.jaRecordIntroEmpty": "(No introduction provided)",
  "pt.joinLoaded": "Join requests loaded",
  "pt.joinSelf": "Self applied",
  "pt.joinInvited": "Invited",
  "pt.joinApproveBtn": "Approve",
  "pt.joinDeclineBtn": "Decline",
  "pt.joinApproved": 'Approved join request of "{0}"',
  "pt.joinDeclined": 'Declined join request of "{0}"',
  "pt.joinDefaultReason": "Declined manually from the settings page",
  "pt.strategiesLoad": "Strategies",
  "pt.strategiesLoaded": "Approval strategies loaded",
  "pt.strategiesCount": "{0} strategies in total",
  "pt.strategyCreate": "Create for this group",
  "pt.strategyCreated": "Approval strategy created ({0})",
  "pt.strategyDeleted": "Strategy deleted",
  "pt.joinNeedGroup": "Fill in the group openid above before creating a strategy",
  "pt.admTitle": "Group management",
  "pt.admHint": "View group members, then mute / unmute / remove them. Requires bot admin rights, API whitelist access and the owner's permission switches.",
  "pt.roleOwner": "Owner",
  "pt.roleAdmin": "Admin",
  "pt.muteDuration": "Mute duration",
  "pt.muteMinutes": "{0} min",
  "pt.muteHours": "{0} h",
  "pt.muteDays": "{0} d",
  "pt.muteBtn": "Mute",
  "pt.unmuteBtn": "Unmute",
  "pt.removeBtn": "Remove",
  "pt.muteDone": "Muted {0} members",
  "pt.unmuteDone": "Unmuted {0} members",
  "pt.removeDone": "Removed {0} members",
  "pt.selectedCount": "{0} members selected",
  "pt.groupPlaceholder": "Search or pick a group (configured + archived)",
  "pt.comboEmpty": "No match — type an openid manually",
  // ── Group picker + permission detection ──
  "pt.groupPickerTitle": "Current group",
  "pt.groupPickerHint": "Pick from configured groups and groups seen in the message archive, or type a group openid. Admin rights are checked after selection.",
  "pt.groupNoSelect": "Pick a group first",
  "pt.groupSourceConfig": "Configured",
  "pt.groupSourceArchive": "Archive",
  "pt.groupArchiveHint": "Last message {0} · {1} records",
  "pt.permChecking": "Checking group permissions…",
  "pt.permAdmin": "Bot is an admin of this group — management features are available",
  "pt.permOwner": "Bot is the owner of this group — management features are available",
  "pt.permMember": "Bot is only a regular member here. Mute / remove / join approvals / blacklist require admin rights — promote the bot in QQ group settings.",
  "pt.permUnknown": "Could not read group state: {0}",
  "pt.permNeedAdmin": "This action requires bot admin rights",
  "pt.permDeniedTip": "No admin rights on this group — related buttons are disabled",
  "pt.permRefresh": "Recheck permissions",
  // ── Group info ──
  "pt.infoTitle": "Group profile",
  "pt.infoHint": "Group name, memo, class, tags and member count. The name comes from the platform; the archive only stores openids.",
  "pt.infoName": "Name",
  "pt.infoMemo": "Memo",
  "pt.infoClass": "Class",
  "pt.infoTags": "Tags",
  "pt.infoMembers": "Members",
  "pt.infoUnion": "Union group ID",
  "pt.infoEmpty": "None",
  // ── Group member management ──
  "pt.membersTitle": "Group members",
  "pt.membersSearch": "Search member name or openid",
  "pt.membersTotal": "{0} members in total",
  "pt.membersNoMore": "All members loaded",
  "pt.memberDetail": "Member details",
  "pt.memberDetailLoaded": "Member profile: {0}",
  "pt.selectAll": "Select this page",
  "pt.clearSelect": "Clear selection",
  "pt.needSelectMember": "Select members from the list first",
  // ── Group blacklist ──
  "pt.blackTitle": "Group blacklist",
  "pt.blackHint": "Query / add / remove blacklist entries. A user can only be blacklisted when not in the group (remove them via member management first).",
  "pt.blackLoaded": "Loaded {0} blacklisted members",
  "pt.blackAdd": "Add to blacklist",
  "pt.blackDel": "Remove from blacklist",
  "pt.blackAdded": "Blacklisted ({0} failed)",
  "pt.blackRemoved": "Removed from blacklist ({0} failed)",
  "pt.blackEmpty": "Blacklist is empty",
  "pt.blackPick": "Pick member openid to blacklist (or type manually)",
  "pt.blackBannedAt": "Banned at",
  // ── Approval strategy enhancements ──
  "pt.stStrategy": "Strategy",
  "pt.stEnable": "Enable",
  "pt.stDisable": "Disable",
  "pt.stExec": "Run scan",
  "pt.stExecDone": "Full scan started; takes about 10 minutes",
  "pt.stWhitelist": "Whitelist numbers",
  "pt.stWhitelistAdd": "Add",
  "pt.stWhitelistDel": "Remove",
  "pt.stWhitelistDone": "Whitelist updated; about {0} numbers now",
  "pt.stWhitelistPlaceholder": "QQ numbers, separated by commas or spaces",
  "pt.stGroupAdd": "Add current group",
  "pt.stGroupDel": "Remove current group",
  "pt.stGroupDone": "Linked groups updated",
  "pt.stRemark": "Remark",
  "pt.stExpire": "Expires at",
  "pt.stSave": "Save changes",
  "pt.stSaved": "Strategy updated",
  "pt.stSelectFirst": "Load the strategy list and expand a strategy first",
  "pt.stGuideTitle": "Auto-approval strategy (auto-accept new members)",
  "pt.stGuideDesc": "Once on, the bot auto-accepts join requests by rule — no need to tap Accept one by one. Follow steps 1→5 below; each has its own explanation.",
  "pt.stRefresh": "Refresh list",
  "pt.stCreate": "New strategy",
  "pt.stLoadFirst": 'Tap "View strategies" above to load the auto-approval strategies you already created',
  "pt.stEmpty": 'No strategies yet. Tap "New strategy" to create one — it applies to the current group by default',
  "pt.stCardTitle": "Strategy {0}",
  "pt.stCardGroups": "{0} group(s)",
  "pt.stRunning": "Running",
  "pt.stPaused": "Paused",
  "pt.stExpand": "Expand settings",
  "pt.stSecSwitch": "Turn auto-accept on/off",
  "pt.stSecSwitchDesc": "On = join requests are auto-accepted; Off = auto-accept paused but all settings are kept and can be resumed anytime.",
  "pt.stSecGroups": "Which groups it applies to",
  "pt.stSecGroupsDesc": 'The strategy only affects groups added here. {0} If not added yet, tap "Add current group".',
  "pt.stIncluded": "Current group added ✔",
  "pt.stNotIncluded": "Current group not added",
  "pt.stSecWhite": "No-approval list (optional)",
  "pt.stSecWhiteDesc": "QQ numbers on this list are accepted directly, regardless of other conditions. Handy for people you trust.",
  "pt.stSecScan": "Process pending requests now",
  "pt.stSecScanDesc": "If requests piled up before you turned the strategy on, tap here to process them once (about 10 min). New requests are handled automatically — no need to tap again.",
  "pt.stSecMore": "Rename & delete",
  "pt.stDelete": "Delete strategy",
  "pt.stId": "Strategy ID",
  "pt.catGroup": "Group management",
  "pt.catGroupHint": "Pick a group first — everything below applies to that group",
  "pt.catGeneral": "General features",
  "pt.catGeneralHint": "Not tied to any group — apply to the bot itself",
  "pt.stepPick": "Step 1 · Pick a group",
  "pt.groupEmpty": "Select a group above to unlock the group management features",
  "pt.tabStrategy": "Approval strategies",
  "pt.navModeration": "Group Rule Review",
  "pt.modGuideTitle": "AI group moderation (auto-mute violators)",
  "pt.modGuideDesc": "The bot reviews group messages by your rules and mutes violators for a duration based on severity. Only groups where the bot is admin can enable it (detected below). Ambiguous messages are never flagged — safe to use.",
  "pt.modNeedAdmin": "The bot is not an admin in this group, so group rule review cannot be enabled. Please make the bot an admin in QQ group settings first.",
  "pt.modSaved": "Moderation config saved",
  "pt.modOn": "● Moderation on",
  "pt.modOff": "○ Moderation off",
  "pt.modEnable": "Turn on",
  "pt.modDisable": "Turn off",
  "pt.modEnableCheck": "Enable auto-moderation",
  "pt.modSecEnable": "Turn auto-moderation on/off",
  "pt.modSecEnableDesc": "Messages are only reviewed when on; turning off stops reviewing but keeps all settings.",
  "pt.modSecCats": "Which violation types to check",
  "pt.modSecCatsDesc": "Pick the types you want to guard against. The AI only judges by the checked types and your rules below — nothing else.",
  "pt.modCat.illegal": "Illegal activity (scams/drugs/violence, etc.)",
  "pt.modCat.porn_gamble": "Pornography / gambling",
  "pt.modCat.abuse": "Insults / personal attacks",
  "pt.modCat.ad_spam": "Ads / spam links",
  "pt.modCat.flood": "Flooding / harassment",
  "pt.modCat.custom": "Custom group rules",
  "pt.modCat.none": "No violation",
  "pt.modSecRules": "Custom group rules (optional)",
  "pt.modSecRulesDesc": 'Write in plain language what is banned or allowed in this group, one rule per line. The AI follows your rules first, e.g. "No QR codes" or "Stock talk OK but no stock tips". Short rules like "1" or "+1" also count as bans; use Rule test below to check the result.',
  "pt.modRulesPlaceholder": "One rule per line, e.g.:\nNo QR codes or external links\nDon't insult new members",
  "pt.modTestTitle": "Rule test (no real mute)",
  "pt.modTestPlaceholder": "Enter a test message, e.g. 1",
  "pt.modTestBtn": "Test",
  "pt.modTestEmpty": "Enter test content first",
  "pt.modTestNoReason": "No reason from the model",
  "pt.modTestCat": "Category: {0}",
  "pt.modTestRule": "Matched rule: {0}",
  "pt.modTestNoRule": "No specific rule matched",
  "pt.modTestDuration": "Would mute a first offense {0} with this config (simulated, not executed)",
  "pt.modSecDuration": "Mute duration by severity",
  "pt.modRangeFrom": "Min",
  "pt.modRangeTo": "Max",
  "pt.modLevel.light": "Light",
  "pt.modLevel.medium": "Medium",
  "pt.modLevel.severe": "Severe",
  "pt.modLevel.none": "No violation",
  "pt.modSecEscalate": "Escalating penalties (harsher for repeat offenses)",
  "pt.modSecEscalateDesc": "Repeat offenses by the same member can get harsher, with the method and durations fully up to you. Turn it off to always use the base duration above, no matter how many times they offend.",
  "pt.modEscOn": "Escalation on",
  "pt.modEscOff": "Escalation off",
  "pt.modEscEnableCheck": "Enable escalating penalties",
  "pt.modEscOffHint": "Escalation is off: every offense uses the base duration for its severity, with no increase for repeat offenses.",
  "pt.modEscMode": "Escalation method",
  "pt.modEscMode.linear": "Linear: base × (1 + factor × (offense − 1))",
  "pt.modEscMode.geometric": "Geometric: base × factor ^ (offense − 1)",
  "pt.modEscMode.custom": "Custom steps: set minutes for each offense number",
  "pt.modEscFactor": "Increase factor",
  "pt.modEscCap": "Escalation cap (minutes)",
  "pt.modEscWindow": "Reset window (days)",
  "pt.modEscSteps": "Step durations (minutes, one per offense number)",
  "pt.modEscStepsPlaceholder": "10, 60, 1440, 43200",
  "pt.modEscStepsHint": "Enter the minutes for the first few offenses, separated by commas or line breaks. Past the last value, that last value keeps applying. Leave empty to use linear escalation.",
  "pt.modEscPreview": "Preview with the range midpoint {0}:",
  "pt.modEscPrevItem": "Offense #{0}: {1}",
  "pt.modSecWhite": "Exempt list (optional)",
  "pt.modSecWhiteDesc": "Messages from these members are never reviewed or muted, one openid per line. Good for trusted admins or bots.",
  "pt.modWhitePlaceholder": "One member openid per line (see group members)",
  "pt.modTabConfig": "Configuration",
  "pt.modTabLogs": "History",
  "pt.modTabMuted": "Muted members",
  "pt.mutedTitle": "Muted members in this group",
  "pt.mutedHint": "See who is currently muted here; select members to extend, shorten, or lift their mute in bulk (bot must be admin).",
  "pt.mutedEmpty": "No muted members right now",
  "pt.mutedEmptyDesc": "No one is currently muted; this list only shows mutes that have not expired yet.",
  "pt.muteAdjustDuration": "Adjust by",
  "pt.mutedRenew": "Extend mute",
  "pt.mutedReduce": "Shorten mute",
  "pt.mutedRenewed": "Extended mute for {0} member(s)",
  "pt.mutedReduced": "Shortened mute for {0} member(s)",
  "pt.mutedUntil": "Until",
  "pt.modCfgTitle": "Configure auto-moderation",
  "pt.modCfgDesc": "Set up the 6 steps below and save; the bot will take care of the rest.",
  "pt.modGroupDetect": "Switch & detection scope",
  "pt.modGroupDetectDesc": "Decide whether to turn it on and what to check",
  "pt.modGroupPunish": "Rules & exceptions",
  "pt.modGroupPunishDesc": "How long to mute, and who is exempt",
  "pt.modSummaryCats": "{0} violation types",
  "pt.modSummaryDur": "Mute {0}m",
  "pt.modLogsScope": "Latest 30 only",
  "pt.modStatTotal": "Total",
  "pt.modStatMuted": "Muted",
  "pt.modStatEsc": "Escalated",
  "pt.modStatFailed": "Not applied",
  "pt.modReasonLabel": "Reason",
  "pt.modDuration": "Muted {0}",
  "pt.modSilent": "Recorded silently",
  "pt.modSourceBehavior": "Flood detection",
  "pt.modSourceLlm": "AI verdict",
  "pt.modSourceLocal": "Local rule",
  "pt.modRecalled": "Message recalled",
  "pt.modDurMin": "{0} min",
  "pt.modDurHour": "{0} h",
  "pt.modDurDay": "{0} d",
  "pt.modStrikeShort": "Offense #{0}",
  "pt.modFailed": "Not applied",
  "pt.modLogsHint": "Recent moderation actions for this group, newest first.",
  "pt.modLogsEmpty": "No moderation history yet",
  "pt.modLogsEmptyDesc": "Actions appear here when a member is muted for a violation.",
  "pt.modLogsTitle": "Moderation history",
  "pt.modLogsLoaded": "Moderation history loaded",
  "pt.modErrAdminTarget": "A rule was matched, but QQ does not allow muting the group owner, an admin, or the bot itself (error 40103004). Test with a regular member account instead.",
  "pt.modNoticeFailed": "Failed to send the in-group @ notice (mute still applies)",
  "pt.modStrike": "Offense #{0} · base {1} min → this {2} min (escalating)",
  "pt.navInfo": "Profile",
  "pt.navMembers": "Members",
  "pt.navBlack": "Blacklist",
  "pt.navJoin": "Join approval",
  "pt.navShare": "Share link",
  "pt.navMenu": "Menu",
  "pt.navPanels": "Panels",
  "pt.scopeC2c": "C2C",
  "pt.scopeGroup": "Group",
  "pt.navMaterial": "Material",
  "pt.navCard": "Picture card",
  "archive.member": "Member",
  "archive.noContent": "(no content)",
  "archive.showingLatest": "Showing latest {0} (older records remain in the archive files)",
  "archive.chatShowingLatest": "Showing latest {0} (older records remain in the archive files)",
  "archive.totalRecords": "{0} record(s) in total",
  "archive.chatTotal": "{0} total",
  "archive.recordCount": "{0} record(s)",
  "archive.deleteLabel": "Delete the {0} archive",
  "archive.deleteConfirm": "Delete the {0} archive records? This bot's records for that day are cleared; other bots' records are kept.",
  "archive.deleteMonthLabel": "Delete {0}'s archive for {1}",
  "archive.deleteMonthHint": "Delete only this conversation's archive for the current month; other months are kept",
  "archive.deleteMonthConfirm": 'Delete all archived messages of "{0}" for {1}? This cannot be undone; other months and other conversations are unaffected.',
  "archive.deleteMonthRequired": "No month selected, so nothing was deleted. Expand the conversation on the left and pick the month to delete.",
  "archive.sessionLine": "Session {0}{1}{2}",
  "archive.searchPlaceholder": "Search content or sender",
  "archive.memberFilter": "Filter by member",
  "archive.memberAll": "All members",
  "archive.dayFilter": "Filter by date",
  "archive.clearFilters": "Clear filters",
  "archive.dateAll": "All dates",
  "archive.dateClear": "Clear",
  "archive.dateHint": "Pick the end date",
  "archive.dateMarkHint": "Dots mark days with messages",
  "archive.exportCsv": "Export CSV",
  "archive.exportCsvHint": "Export all records of this month with current filters (CSV)",
  "archive.colTime": "Time",
  "archive.colType": "Type",
  "archive.colSender": "Sender",
  "archive.colContent": "Content",
  "archive.colNote": "Note",
  "archive.kindInbound": "Incoming message",
  "archive.kindReply": "Bot reply",
  "archive.kindProactive": "Proactive message",
  "archive.filterNoMatch": "No records match the filters",
  "archive.image": "Image",
  "archive.video": "Video",
  "archive.file": "File",
  "archive.mediaLoading": "Loading media…",
  "archive.mediaFailed": "Media expired or could not be saved",
  "archive.imageCount": "{0} image(s)",
  "archive.sticker": "Sticker",
  "archive.recalled": "Recalled",
  "archive.recalledNoContent": "Message recalled, original content unavailable",
  "archive.mediaSkippedItem": '"{0}" not saved: {1}',
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
  "update.keepOpen": "Update still running — do not close this panel",
  // ── replyLocale ──
  "replyLocale.label": "Reply language (replyLocale)",
  "replyLocale.labelShort": "Reply language",
  "replyLocale.hint": "Language for system texts (/help, schedule usage, etc.); AI replies unaffected.",
  "replyLocale.zh": "Chinese (default)",
  // ── group ──
  "group.title": "Per-group config",
  "group.hint": "Override defaults for one group.",
  "group.empty": "No per-group overrides yet; every group uses the bot defaults above.",
  "group.overrideHint": "Unset fields follow the bot default.",
  "group.add": "Add group override",
  "group.edit": "Edit group override",
  "group.group": "Group",
  "group.noOverrides": "No overridden fields",
  "group.required": "Please enter the group openid",
  "group.dialogHint": 'Fields left empty or set to "Follow default" keep using the bot-level config; changes apply to this group only.',
  "group.secIdentity": "Group",
  "group.secTrigger": "Triggers & threshold",
  "group.secPacing": "Reply pacing",
  "group.secContent": "Content & filters",
  "group.openid": "Group openid",
  "group.openidHint": 'The openid of the group to configure (a long id starting with "o"). Ask the AI to run /session in that group to find it.',
  "group.fullReply": "Full group reply",
  "group.fullReplyHint": "Whether non-@ messages in this group are value-scored and answered.",
  "group.followDefault": "Follow default",
  "group.valueThreshold": "Value threshold",
  "group.valueThresholdHint": "Only effective when full group reply is on: score 0-10; the bot replies at or above the threshold. 0 = no limits at all (every message gets a reply, both intervals ignored).",
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
  // ── manifest（配置清单 JSON 编辑器）──
  "manifest.entryTitle": "Config manifest (JSON)",
  "manifest.entryDesc": "View and edit every configurable field as JSON.",
  "manifest.entrySummary": "View and edit all config fields",
  "manifest.title": "Config manifest · JSON editor",
  "manifest.hint": "View and edit all configurable fields of the current bot as JSON. Changes take effect immediately after saving.",
  "manifest.editorTitle": "Config JSON",
  "manifest.helpTitle": "Field help",
  "manifest.issueCount": "{0} issue(s) found — fix them before saving",
  "manifest.validCount": "Valid JSON · {0} fields",
  "manifest.jsonRoot": "JSON root",
  "manifest.noIssue": "✓ Format and values are valid — ready to save",
  "manifest.locateHint": "Click to locate the offending field",
  "manifest.searchPlaceholder": "Search field name or help…",
  "manifest.fieldTotal": "{0} fields",
  "manifest.noHelpMatch": "No matching field",
  "manifest.issue.syntax": "JSON syntax error: {0}",
  "manifest.issue.notObject": "The top level must be a JSON object { ... }",
  "manifest.issue.unknown": 'Unknown field "{0}": not configurable or misspelled',
  "manifest.issue.type": 'Field "{0}" has the wrong type; expected {1}',
  "manifest.issue.enum": 'Field "{0}" has an invalid value; allowed: {1}',
  "manifest.issue.range": 'Field "{0}" is out of range; allowed: {1}',
  "manifest.issue.override": 'Per-group override "{0}" has an invalid structure; expected {1}',
  "manifest.reload": "Reload",
  "manifest.reloadConfirm": "You have unsaved changes. Reloading will discard them. Continue?",
  "manifest.validateBeforeSave": "Fix the validation issues before saving",
  "manifest.saveHint": "Saving applies changes to this bot immediately — no restart needed.",
  "manifest.unsavedHint": "You have unsaved changes (validated again on save).",
  "manifest.savedNotice": "Config manifest saved and applied.",
  "manifest.loadFailed": "Failed to load config: {0}",
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
  "unit.seconds": "{0} s",
  "panel.subtitle": "Manage scheduled messages: create, edit, delete and test",
  "panel.scope": "Bot",
  "panel.allBots": "All bots",
  "panel.scheduled": "Scheduled",
  "panel.archive": "Archive",
  "panel.days": "days",
  "panel.records": "records",
  "panel.loading": "Loading…",
  "panel.noSchedules": "No scheduled messages",
  "panel.noArchive": "No archive yet",
  "panel.noRecords": "No records that day",
  "panel.disabled": "Disabled",
  "panel.suspended": "Suspended",
  "panel.next": "Next",
  "panel.noNext": "No next run",
  "panel.ai": "AI",
  "panel.tool": "Cmd",
  "panel.failed": "Failed",
  "panel.dm": "DM",
  "panel.group": "Group",
  "panel.user": "User",
  "panel.system": "System",
  "panel.bot": "Bot",
  "panel.archiveAllHint": "All-bots mode shows aggregated counts only; pick a single bot to expand and preview records",
  "panel.tabId": "Tab",
  "sched.view": "View",
  "sched.back": "Back",
  "sched.detailTitle": "Execution details",
  "sched.detailSubtitle": "The full execution flow of this scheduled task when it fires",
  "sched.flow.trigger": "Scheduled trigger",
  "sched.flow.enabled": "Task enabled",
  "sched.flow.disabled": "Disabled · skipped this run",
  "sched.flow.recipient": "Recipient",
  "sched.flow.gate": "Gate check",
  "sched.flow.gateAlways": "Run unconditionally",
  "sched.flow.gateNonempty": "Run only if output non-empty",
  "sched.flow.gateChanged": "Run only if output changed",
  "sched.flow.action": "Action",
  "sched.flow.modeText": "Send text directly",
  "sched.flow.modeAi": "AI generates reply",
  "sched.flow.modeTool": "Run command",
  "sched.flow.resultMode": "Result handling",
  "sched.flow.resultRaw": "Send output as-is",
  "sched.flow.resultAi": "AI summarizes then sends",
  "sched.flow.notify": "Notify condition",
  "sched.flow.verify": "Self-check before send",
  "sched.flow.deliver": "Deliver message",
  "sched.flow.end": "End",
  "sched.flow.yes": "Yes",
  "sched.flow.no": "No",
  "sched.flow.skip": "Skip this run",
  "sched.flow.nextRun": "Next run: {0}",
  // ── Guild manager (vertical-tab dialog) ──
  "gv.title": "Guild Manager",
  "gv.hint": "QQ guilds, channels, members, messages, content management and AI moderation; some endpoints need admin or a private bot.",
  "gv.summary": "Guilds · Content · AI",
  "gv.tab.guilds": "Guilds",
  "gv.tab.info": "Guild Info",
  "gv.tab.channels": "Channels",
  "gv.tab.members": "Members",
  "gv.tab.roles": "Roles",
  "gv.tab.message": "Send Message",
  "gv.tab.events": "Events",
  "gv.needGuild": "Load and pick a guild in the Guilds tab first",
  "gv.needChannel": "Pick a channel first",
  "gv.noPermission": "No access: make sure the bot joined the guild, has administrator rights, and the endpoint is enabled (some features are private-bot only).",
  "gv.selected": "Current",
  "gv.guildsDesc": "Guilds the bot has joined. Pick a card and the other tabs operate on that guild.",
  "gv.guildsTotal": "{0} guilds",
  "gv.guildsEmpty": "No guilds yet. Add the bot to a guild on the QQ Open Platform first.",
  "gv.setupTitle": "Add the bot to a guild first",
  "gv.setupStep1": '① Open the QQ Developer Center → your bot → turn ON "Allow the bot to be added to any guild (public service)".',
  "gv.setupStep2": "② Once enabled, have the guild owner / admin scan the bot's QR code in mobile QQ to add it to the guild.",
  "gv.setupFoot": "After joining, come back and hit Refresh to see and manage guild features.",
  "gv.setupLink": "Open QQ Developer Center",
  "gv.guildMembers": "{0} members",
  "gv.guildOwner": "Owner",
  "gv.infoDesc": "Live guild profile (GET /guilds/{guild_id}).",
  "gv.infoName": "Name",
  "gv.infoId": "Guild ID",
  "gv.infoOwner": "Owner ID",
  "gv.infoMember": "Members",
  "gv.infoMax": "Member limit",
  "gv.infoIntro": "Description",
  "gv.infoJoined": "Joined at",
  "gv.infoEmpty": "No data",
  "gv.chDesc": "Create / edit / delete channels (administrator; some endpoints are private-bot only).",
  "gv.chList": "Channels",
  "gv.chType": "Type",
  "gv.chType.0": "Text",
  "gv.chType.2": "Voice",
  "gv.chType.4": "Category",
  "gv.chType.10005": "Live",
  "gv.chType.10006": "App",
  "gv.chType.10007": "Forum",
  "gv.chCreate": "Create channel",
  "gv.chEdit": "Edit channel",
  "gv.chDel": "Delete channel",
  "gv.chName": "Name",
  "gv.chSubType": "Sub-type (text: 0 chat / 1 announcement / 2 guide / 3 gaming)",
  "gv.chPosition": "Position (category must be >= 2)",
  "gv.chParent": "Parent category ID",
  "gv.chParentHint": "0 = top level, no parent",
  "gv.chSpeak": "Speak permission (0 none / 1 everyone / 2 admins and selected)",
  "gv.chPrivate": "Privacy (0 public / 1 admins only / 2 admins and selected)",
  "gv.chCreated": "Channel created",
  "gv.chUpdated": "Channel updated",
  "gv.chDeleted": "Channel deleted",
  "gv.memDesc": "Guild members and details (private bots only; after enabling, remove and re-add the bot to apply).",
  "gv.memList": "Members",
  "gv.memSearch": "Search nickname / ID",
  "gv.memDetail": "Member details",
  "gv.memMore": "Load more",
  "gv.memTotal": "{0} loaded",
  "gv.memRoles": "Roles",
  "gv.memJoined": "Joined at",
  "gv.memNick": "Nickname",
  "gv.memBot": "Bot",
  "gv.memEmpty": "No members (public bots cannot use this endpoint)",
  "gv.roleDesc": "Create / edit / delete roles and assign them to members (administrator; role 5 needs a channel ID).",
  "gv.roleList": "Roles",
  "gv.roleName": "Name",
  "gv.roleColor": "Color (decimal ARGB, e.g. 4294927682)",
  "gv.roleHoist": "Show separately in member list",
  "gv.roleCount": "{0} members",
  "gv.roleDefault": "Built-in",
  "gv.roleCreate": "Create role",
  "gv.roleEdit": "Edit role",
  "gv.roleDel": "Delete role",
  "gv.roleCreated": "Role created",
  "gv.roleUpdated": "Role updated",
  "gv.roleDeleted": "Role deleted",
  "gv.roleAssign": "Assign a role to a member",
  "gv.roleUserId": "Member ID",
  "gv.roleRoleId": "Role ID",
  "gv.roleAssignChannel": "Channel ID (required for role 5)",
  "gv.roleAdd": "Add",
  "gv.roleRemove": "Remove",
  "gv.roleAssigned": "Role added to member",
  "gv.roleUnassigned": "Role removed from member",
  "gv.msgDesc": "Send text to a channel (needs speak permission; proactive messages default to 20/day per channel and 2 channels/day per guild).",
  "gv.msgChannel": "Target channel",
  "gv.msgContent": "Message",
  "gv.msgPlaceholder": "Type the text to send…",
  "gv.msgSend": "Send",
  "gv.msgSent": "Request submitted",
  "gv.msgReceipt": "Delivery receipt",
  "gv.msgId": "QQ message ID",
  "gv.msgHasId": "QQ created this message — check the matching channel in QQ.",
  "gv.msgNoId": "QQ returned no message ID — the proactive message may have been throttled or not delivered. See checklist below.",
  "gv.msgTipTitle": "Says sent but not visible? Check in order",
  "gv.msgTip": "1) The bot must have joined the guild and have speak permission in that channel; 2) This sends a proactive message (no msg_id reference) — default cap is 20/day per channel and 2 channels/day per guild; over the cap QQ may silently drop it while still returning success; 3) Look inside the matching channel in QQ, not in a DM; 4) Proactive messages favor channels with recent (7-day) bot interaction — long-idle channels may receive nothing.",
  "gv.msgRaw": "Raw platform response",
  "gv.evtDesc": "Below is a grouped reference of the guild OpenAPI endpoints supported by this plugin, plus a quick WebSocket event guide.",
  "gv.evtGuildCreate": "Guild created",
  "gv.evtGuildUpdate": "Guild updated",
  "gv.evtGuildDelete": "Guild deleted",
  "gv.evtChannelCreate": "Channel created",
  "gv.evtChannelUpdate": "Channel updated",
  "gv.evtChannelDelete": "Channel deleted",
  "gv.evtFields": "Key fields",
  "gv.evtFieldId": "Guild / channel ID",
  "gv.evtFieldName": "Name",
  "gv.evtFieldOwner": "Owner / operator",
  "gv.evtFieldCount": "Members / limit",
  "gv.evtFieldTime": "Joined at",
  "gv.docTitle": "Guild OpenAPI reference",
  "gv.docIntro": "Methods and paths match QQ's official docs; replace placeholders such as {guild_id} and {channel_id} with real IDs. Availability also depends on the bot's role, Developer Center authorization, and channel type. Common limits are shown on the right.",
  "gv.docEventTitle": "Basic WebSocket events",
  "gv.docGroup.guild": "Guild & channels",
  "gv.docGroup.member": "Guild members",
  "gv.docGroup.role": "Roles & channel permissions",
  "gv.docGroup.message": "Messages & speaking",
  "gv.docGroup.content": "Content management",
  "gv.docGroup.permission": "API permissions",
  "gv.docNote.admin": "Requires guild administrator",
  "gv.docNote.private": "Private-domain bots only; enable in Developer Center, then remove and re-add the bot to the guild",
  "gv.docNote.privateShort": "Private-domain bots only",
  "gv.docNote.quota": "Proactive messages: 20 per channel per day by default; passive replies are valid for 5 minutes and do not use the quota",
  "gv.docNote.msgId": "Use a real message ID, not a channel ID",
  "gv.docNote.noAnnounceList": "No official announce-list API (HTTP 405); this plugin never calls it. Publish/delete announcements by message ID",
  "gv.docNote.forum": "Forum channels only; the current API needs only channel_id, not forum_id",
  "gv.docNote.schedule": "Schedule channels only; timestamps must be millisecond strings, start in the future and last at most 7 days",
  "gv.docNote.builtin": "Built-in roles (1/2/4/5) cannot be deleted",
  "gv.docNote.pin": "Up to 20 pins per channel",
  "gv.docNote.memberRole": "Role 5 (channel administrator) requires channel.id",
  "gv.doc.guilds": "List guilds the bot has joined; used to pick the current guild.",
  "gv.doc.guildGet": "Get guild name, icon, owner, member count / limit, description, and similar details.",
  "gv.doc.channels": "List all channels in a guild (text / voice / category / live / app / forum).",
  "gv.doc.channelGet": "Get a channel's name, type, position, privacy type, and speaking permission.",
  "gv.doc.channelCreate": "Create a channel with name, type, position, parent, privacy, and speaking permission.",
  "gv.doc.channelPatch": "Change a channel's name, position, parent, privacy type, or speaking permission.",
  "gv.doc.channelDelete": "Delete a channel; the UI asks for confirmation first.",
  "gv.doc.channelOnline": "Get the number of online members in a channel.",
  "gv.doc.memberList": "List guild members page by page for member pickers, details, and role actions.",
  "gv.doc.memberGet": "Get one guild member's profile (nickname, joined time, etc.).",
  "gv.doc.memberDelete": "Remove a member from the guild.",
  "gv.doc.memberRoles": "List the roles a member currently has.",
  "gv.doc.memberRolePut": "Add a role to a member.",
  "gv.doc.memberRoleDelete": "Remove a role from a member.",
  "gv.doc.roleMembers": "List members who have a given role, page by page.",
  "gv.doc.muteAll": "Mute or unmute everyone, or pass user_ids to mute/unmute several members.",
  "gv.doc.muteMember": "Mute or unmute one member; duration is in seconds.",
  "gv.doc.roles": "List roles (1 all members / 2 administrator / 4 owner / 5 channel administrator).",
  "gv.doc.roleCreate": "Create a custom role with name, color, hoist flag, and permissions.",
  "gv.doc.rolePatch": "Change a role's name, color, hoist flag, or permissions.",
  "gv.doc.roleDelete": "Delete a custom role.",
  "gv.doc.channelRoleGet": "Get a role's permission bits in one channel.",
  "gv.doc.channelRolePatch": "Add or remove a role's permission bits in one channel.",
  "gv.doc.messageSend": "Send a text message to a channel; including msg_id / event_id makes it a passive reply.",
  "gv.doc.messageList": "List channel messages, mainly to copy real message IDs for recall, pins, and announcements.",
  "gv.doc.messageDelete": "Recall a channel message; hide_tip controls whether the 'message recalled' notice is hidden.",
  "gv.doc.msgSettingGet": "Get the bot's message frequency settings in this guild.",
  "gv.doc.msgSettingPut": "Change the bot's message frequency settings in this guild.",
  "gv.doc.announceList": "QQ has no announce-list API; listed here only as guidance to avoid a failed call.",
  "gv.doc.announceCreate": "Promote a channel message to a guild announcement.",
  "gv.doc.announceDelete": "Delete an announcement; use message_id=all to remove all.",
  "gv.doc.pins": "List pinned messages in a channel.",
  "gv.doc.pinAdd": "Pin a message in a channel.",
  "gv.doc.pinDelete": "Unpin a message.",
  "gv.doc.schedules": "List schedules in a channel.",
  "gv.doc.scheduleGet": "Get details of one schedule.",
  "gv.doc.scheduleCreate": "Create a schedule in a schedule channel.",
  "gv.doc.schedulePatch": "Change a schedule's name, time range, or reminder.",
  "gv.doc.scheduleDelete": "Delete a schedule.",
  "gv.doc.audio": "Audio control for voice / live channels (bot mic on/off, etc.).",
  "gv.doc.threads": "List threads in a forum channel (current official path, no forum_id).",
  "gv.doc.threadGet": "Get details of one thread.",
  "gv.doc.threadCreate": "Publish a thread in a forum channel using the official JSON format.",
  "gv.doc.threadDelete": "Delete a thread.",
  "gv.doc.channelPermGet": "Get channel permissions.",
  "gv.doc.channelPermAll": "Change a channel's permissions for everyone.",
  "gv.doc.apiPermGet": "Check authorization status for each API in this guild.",
  "gv.doc.apiPermPost": "Request authorization for an unauthorized API; QQ returns an authorization link.",
  "gv.delConfirm": 'Delete "{0}"? This cannot be undone.',
  // ── Guild speak / content / AI moderation ──
  "gv.tab.speak": "Speaking",
  "gv.tab.content": "Content",
  "gv.tab.ai": "AI Moderation",
  "gv.speakDesc": "Mute all or a specific member, lift mutes, and configure the bot's message frequency in the guild. Muting requires the bot to be a guild administrator.",
  "gv.st.all": "Mute all",
  "gv.st.member": "Members",
  "gv.st.frequency": "Frequency",
  "gv.st.keyword": "Keywords",
  "gv.muteAllTitle": "Mute all / unmute",
  "gv.muteOneTitle": "Mute a member / unmute",
  "gv.muteMinutes": "Duration (minutes)",
  "gv.muteMinutesHint": "0 minutes = unmute; 1-43200 (30-day cap)",
  "gv.muteUserId": "Member user ID",
  "gv.muteUserPlaceholder": "Copy the user ID from Guild Members",
  "gv.muteAll": "Mute all",
  "gv.unmuteAll": "Unmute all",
  "gv.muteOne": "Mute member",
  "gv.unmuteOne": "Unmute member",
  "gv.muteNeedUser": "Enter a member user ID first",
  "gv.muteDone": "Mute applied",
  "gv.muteUnmuted": "Mute lifted",
  "gv.settingTitle": "Message frequency",
  "gv.settingHint": "Official fields: disable_create_dm / disable_push_msg / channel_ids / channel_push_max_num. Saving writes back to the guild.",
  "gv.settingSave": "Save settings",
  "gv.settingSaved": "Message frequency saved",
  "gv.settingInvalidJson": "Invalid JSON, please check and retry",
  // ── Keyword auto-moderation (Speak tab) ──
  "gv.kwSectionTitle": "Illegal-keyword auto action (local, zero AI calls)",
  "gv.kwSectionDesc": "When a new post, comment, or channel message matches a banned keyword, auto-mute the sender and delete the content. Pure local substring match, no model calls; the bot must be a guild administrator to mute/delete.",
  "gv.kwSubConfig": "Configuration",
  "gv.kwSubLogs": "Action log",
  "gv.kwTitle": "Master switch",
  "gv.kwEnable": "Enable keyword auto action",
  "gv.kwEnableHint": "Applies to this guild only; when off, no detection or action runs.",
  "gv.kwWordsTitle": "Banned keywords (one per line)",
  "gv.kwWordsPlaceholder": "e.g. gambling\nscam\nporn\ncontraband",
  "gv.kwWordsHint": "Matching any word (substring, case-insensitive) triggers the action. Empty list or disabled switch = inactive. Shorter, specific words are safer—overly generic words may cause false positives.",
  "gv.kwActionTitle": "Actions on match",
  "gv.kwMuteMinutes": "Mute duration (minutes)",
  "gv.kwMuteMinutesHint": "Mute the sender on match; 0 = delete only, no mute. Max 30 days (43200 minutes).",
  "gv.kwDeleteContent": "Delete offending content (recall message / delete forum thread)",
  "gv.kwDeleteThreadOnReply": "Also delete the whole thread when a comment/reply matches (caution)",
  "gv.kwActionHint": "QQ has no API to delete a single comment: regular messages can be recalled, new forum threads can be deleted. Comments/replies only mute by default; enabling the option above deletes the whole thread (including others' replies).",
  "gv.kwScopeTitle": "Scope",
  "gv.kwWhitelist": "Exempt members",
  "gv.kwWhitelistPlaceholder": "One member user ID per line",
  "gv.kwWhitelistHint": "Content from members on this list is not actioned.",
  "gv.kwChannels": "Only these channels",
  "gv.kwChannelsPlaceholder": "One channel ID per line; empty = all",
  "gv.kwChannelsHint": "Empty applies to all channels in this guild.",
  "gv.kwSave": "Save keyword action config",
  "gv.kwSaved": "Keyword action config saved",
  "gv.kwNeedWords": "Enter at least one banned keyword first",
  "gv.kwLogsTitle": "Action log (latest 30)",
  "gv.kwLogsRefresh": "Refresh",
  "gv.kwLogsEmpty": "No matches yet",
  "gv.kwMatched": "Matched",
  "gv.contentDesc": "Delete messages in a channel. Administrators can delete regular members' messages; owners can delete anyone's. Messages older than the time limit cannot be deleted.",
  "gv.recallMessageId": "Message ID",
  "gv.recallMessagePlaceholder": "Get it from channel message events or client copy link",
  "gv.recallMessageHint": "The bot can delete its own messages, or others' if it is an administrator/owner",
  "gv.recallHideTip": "Hide the deletion notice (hide_tip)",
  "gv.recallDo": "Delete message",
  "gv.recallDone": "Message deleted",
  "gv.aiDesc": "Let AI review channel messages (warn / delete / mute) and auto-reply to new posts or @mentions. Configure an AI model in Settings first; channel messages do not enter normal chat replies.",
  "gv.aiEnableTitle": "Master switch",
  "gv.aiEnable": "Enable AI moderation for this guild",
  "gv.aiEnableHint": "Only applies to this guild; when off, AI reviews nothing here.",
  "gv.aiActionTitle": "Actions on violation (multiple)",
  "gv.aiActMute": "Mute the offender (admin required)",
  "gv.aiActRecall": "Delete the message (admin required)",
  "gv.aiActWarn": "Post a warning (most reliable)",
  "gv.aiActionHint": "A failing action does not block others; reasons are logged. Keep at least 'Post a warning' on.",
  "gv.aiDurationTitle": "Mute duration by level (minutes)",
  "gv.aiDurLight": "Light",
  "gv.aiDurMedium": "Medium",
  "gv.aiDurSevere": "Severe",
  "gv.aiDurationHint": "Repeat violations within 30 days escalate, capped at 30 days; 30 days without violations resets the count.",
  "gv.aiRulesTitle": "Custom guild rules",
  "gv.aiRulesPlaceholder": "One per line, e.g. No external QR codes",
  "gv.aiRulesHint": "Rules are injected into AI judgment; built-in categories (illegal/porn-gamble/abuse/ad/spam/flood) always apply.",
  "gv.aiScopeTitle": "Scope and exemptions",
  "gv.aiWhitelist": "Exempt user IDs",
  "gv.aiWhitelistPlaceholder": "One user ID per line",
  "gv.aiWhitelistHint": "Messages from listed users skip AI entirely.",
  "gv.aiChannels": "Only review these channels",
  "gv.aiChannelsPlaceholder": "One channel ID per line; empty = all",
  "gv.aiChannelsHint": "Empty means review all channels in this guild.",
  "gv.aiSave": "Save AI moderation config",
  "gv.aiSaved": "AI moderation config saved",
  "gv.aiLogsTitle": "Moderation log (latest 30)",
  "gv.aiLogsEmpty": "No AI moderation records yet",
  "gv.aiLogMinutes": "Mute",
  "gv.aiLogStrike": "Strike",
  // ── Guild sub-dialog / content / member extras / API permission ──
  "gv.errApiPermission": "The app has no access to this API: enable it for the bot in the QQ Developer Center. Most such endpoints are private-bot only; after enabling, remove and re-add the bot to the guild.",
  "gv.roleNamePlaceholder": "New role",
  "gv.roleColorArgb": "Color (decimal ARGB)",
  "gv.roleColorHint": "Pick a color above, or enter the decimal ARGB value (QQ format, top 8 bits = alpha).",
  "gv.idPasteHint": "Paste manually, or click the field to pick from the dropdown",
  "gv.userIdPlaceholder": "User ID",
  "gv.tab.apiPerm": "API Access",
  "gv.apiPermDesc": "View API authorization status for this guild, or request access to unauthorized endpoints.",
  "gv.apiPermHint": "Member lists, forums and others must be enabled in the Developer Center; the query lists each endpoint's status with links to request access.",
  "gv.apiPermGet": "Query API access",
  "gv.apiPermCount": "{0} APIs · {1} granted · {2} not granted",
  "gv.apiPermOnlyUnauth": "Only show unauthorized",
  "gv.apiPermColMethod": "Method",
  "gv.apiPermColPath": "Endpoint",
  "gv.apiPermColDesc": "Description",
  "gv.apiPermColState": "Status",
  "gv.apiPermStateOk": "Granted",
  "gv.apiPermStateNo": "Not granted",
  "gv.apiPermEmpty": "No API matches this filter.",
  "gv.apiPermRaw": "View raw JSON",
  "gv.ct.recall": "Recall",
  "gv.ct.announce": "Announcements",
  "gv.ct.pin": "Pinned",
  "gv.ct.schedule": "Schedules",
  "gv.ct.audio": "Audio",
  "gv.ct.forum": "Forums",
  "gv.announceChannel": "Target channel",
  "gv.announceType": "Announcement type",
  "gv.announceTypeWelcome": "Welcome",
  "gv.announceTypeMember": "Member",
  "gv.annList": "Get announcements",
  "gv.annCreate": "Publish",
  "gv.annCreated": "Announcement published",
  "gv.annDelete": "Delete",
  "gv.annDeleted": "Announcement deleted",
  "gv.annHintTitle": "How announcements work (no official list API)",
  "gv.annHint": 'QQ has no "list announcements" API (GET returns 405 Method Not Allowed), so existing announcements cannot be listed. An announcement is simply "promoting a message in a channel": first send a message in the target channel, copy its message ID into the field above, then click Publish. To delete, use the same message ID. The bot must be a guild admin.',
  "gv.pinMessageId": "Message ID",
  "gv.pinHint": 'Pick a real message from the "Load messages" dropdown, or paste a message ID — never the channel ID. Up to 20 pins per channel; only visible messages can be pinned.',
  "gv.pinTip": 'The message ID is NOT the channel ID. First click "Load channel messages" to fetch recent messages, then pick one from the "Message ID" dropdown; only a real message ID can be pinned (using the channel ID causes a 501009 format error). You can also send a message via "Send message" and copy its ID from the delivery receipt.',
  "gv.pinMsgPlaceholder": "Load messages then pick, or paste a real message ID",
  "gv.pinLoad": "Load channel messages",
  "gv.pinLoaded": 'Loaded {0} messages — pick one from the "Message ID" dropdown',
  "gv.pinLoadEmpty": 'No messages found: the channel may not be visible or the bot lacks permission — try the ID from a "Send message" receipt instead.',
  "gv.errBadMsgId": 'Invalid message ID: this field needs a real message ID, not the channel ID. Click "Load channel messages" first and pick one from the dropdown.',
  "gv.pinList": "Get pins",
  "gv.pinAdd": "Add pin",
  "gv.pinAdded": "Message pinned",
  "gv.pinDelete": "Remove pin",
  "gv.pinDeleted": "Pin removed",
  "gv.scheduleId": "Schedule ID",
  "gv.scheduleIdPlaceholder": "For edit / delete",
  "gv.scheduleBody": "Schedule (JSON)",
  "gv.scheduleHint": 'Millisecond timestamp strings: start must be in the future, end after start, duration ≤ 7 days, remind_type 0-5 (0 none / 1 at start / 2 5m before / 3 15m before / 4 30m before / 5 60m before). The template is pre-filled with a valid time 1 hour out — just change the name. Schedules must be created in a "Schedule" type channel and the bot must be an admin.',
  "gv.schReset": "Reset template",
  "gv.schResetDone": "Reset to a valid template (starts in 1 hour, lasts 1 hour)",
  "gv.schErrName": "Schedule name cannot be empty",
  "gv.schErrStart": "start_timestamp must be a millisecond timestamp string, e.g. 1735000000000",
  "gv.schErrEnd": "end_timestamp must be a millisecond timestamp string",
  "gv.schErrPast": "Start time must be in the future (official 302015)",
  "gv.schErrEndBeforeStart": "End time must be after start time (official 302016)",
  "gv.schErrTooLong": "Schedule duration cannot exceed 7 days (official 302014)",
  "gv.schErrRemind": "remind_type must be a string from 0-5",
  "gv.schErrEmpty": "Schedule object is empty or fields are invalid, check the JSON (official 302017)",
  "gv.schErrType": "Parameter type conversion failed; timestamps must be integer millisecond strings (official 302018)",
  "gv.schErr302013": "Schedule creation triggered a security check; retry later or edit the content (official 302013)",
  "gv.schErr302019": "Platform downstream error, please retry later (official 302019)",
  "gv.schErr302020": "Schedule content or account violated rules, please edit (official 302020)",
  "gv.schErr302021": "Daily schedule limit reached for this channel, try again tomorrow (official 302021)",
  "gv.schErr302022": "The jump channel must belong to the current guild (official 302022)",
  "gv.schErr302023": "Start-time jump cannot target the schedule channel itself (official 302023)",
  "gv.schErr302024": "Jump channel not found, check the ID (official 302024)",
  "gv.schList": "Get schedules",
  "gv.schGet": "Get detail",
  "gv.schCreate": "Create",
  "gv.schCreated": "Schedule created",
  "gv.schPatch": "Modify",
  "gv.schPatched": "Schedule modified",
  "gv.schDelete": "Delete",
  "gv.schDeleted": "Schedule deleted",
  "gv.audioBody": "Audio params (JSON)",
  "gv.audioHint": "Official POST /channels/{id}/audio; pick a voice / live channel and fill params as documented (e.g. audio_url, text). Bot mic on/off also uses this endpoint.",
  "gv.audioDo": "Run audio control",
  "gv.audioDone": "Audio control executed",
  "gv.forumId": "Forum channel ID (forum_id)",
  "gv.forumIdPlaceholder": "Forum channel ID",
  "gv.forumThreadId": "Thread ID",
  "gv.forumThreadIdPlaceholder": "For view / delete",
  "gv.forumBody": "Thread content (JSON)",
  "gv.forumTip": "Just pick the forum channel — no forum_id needed: the current official API uses only the channel ID. Fill the content as JSON in the official format (title + RichText content). Requires a private-domain bot; after enabling, remove and re-add the bot to the guild.",
  "gv.forumList": "Get threads",
  "gv.forumGet": "Get detail",
  "gv.forumCreate": "Publish thread",
  "gv.forumCreated": "Thread published",
  "gv.forumDelete": "Delete thread",
  "gv.forumDeleted": "Thread deleted",
  "gv.invalidJson": "Invalid JSON, please check and retry",
  "gv.memMoreTitle": "More member tools",
  "gv.memOnlineChannel": "Channel for online count",
  "gv.memOnline": "Get online count",
  "gv.memRoleId": "Role ID",
  "gv.memRoleIdPlaceholder": "To list role members",
  "gv.memRoleList": "List role members",
  "gv.memKick": "Remove member",
  "gv.memKicked": "Member removed",
  "gv.memKickConfirm": "Remove member {0} from the guild? This cannot be undone.",
  "gv.aiSubConfig": "Config",
  "gv.aiSubLogs": "Records",
  "gv.aiSubReply": "Auto replies",
  "gv.replyEnableTitle": "Auto-reply master switch",
  "gv.replyEnable": "Enable AI auto-replies for this guild",
  "gv.replyEnableHint": "Configured per guild. Turning it off stops all auto-replies in that guild.",
  "gv.replyTriggers": "Reply triggers",
  "gv.replyOnPost": "Reply once to new threads / posts",
  "gv.replyOnMention": "Reply when a comment / message mentions the bot",
  "gv.replyOnce": "Reply only once per thread / post",
  "gv.replyTriggerHint": "The once-per-post rule survives restarts for 30 days; @mentions are counted per comment.",
  "gv.replyPrompt": "Custom reply instructions",
  "gv.replyPromptPlaceholder": "e.g. keep it short and friendly; ask for details if you cannot answer",
  "gv.replyPromptHint": "Appended to the model prompt. The model stays silent for meaningless content or pure ads.",
  "gv.replyScopeTitle": "Scope and exclusions",
  "gv.replyWhitelist": "Excluded member IDs",
  "gv.replyWhitelistPlaceholder": "One member ID per line",
  "gv.replyChannels": "Allowed channel IDs",
  "gv.replyChannelsPlaceholder": "One channel ID per line; empty = all channels",
  "gv.replyScopeHint": "Triggers: forum thread / post creation, forum replies, private-channel messages and @bot messages.",
  "gv.replyIntents": "Event subscription (private domain)",
  "gv.replyGuildMessages": "Subscribe to MESSAGE_CREATE",
  "gv.replyForumEvents": "Subscribe to FORUM_* events",
  "gv.replyIntentsHint": "Private-domain bots only. Enabling without permission breaks the WebSocket connection. Saving reconnects automatically.",
  "gv.replyIntentsLink": "Open QQ Open Platform to grant permissions",
  "gv.replySave": "Save auto-reply config",
  "gv.replySaved": "Auto-reply config saved",
  "gv.replyLogsTitle": "Reply records",
  "gv.replyLogsEmpty": "No replies yet",
  "gv.replyLogOk": "Replied",
  "gv.replyLogFail": "Failed",
  // ── AI activity log (triggered in agent chat; shared by group / guild management) ──
  "ai.title": "Activity log",
  "ai.titleGroup": "Group activity log",
  "ai.titleGuild": "Guild activity log",
  "ai.subtitle": "Read-only history. Just say what you want in the agent chat to trigger an action.",
  "ai.subtitleGroup": "Only the 30 most recent actions for this group; records are stored independently.",
  "ai.subtitleGuild": "Only the 30 most recent actions for this guild; records are stored independently.",
  "ai.refresh": "Refresh",
  "ai.srcLocal": "Local",
  "ai.srcLlm": "AI",
  "ai.srcCache": "Cache",
  "ai.srcNone": "Unrecognized",
  "ai.usage": "Usage",
  "ai.usageStat": "Local {0} · Cache {1} · AI calls {2} · ~{3} tokens saved",
  "ai.logEmpty": 'No actions yet. Say "mute Jack for 10 minutes" in the agent chat and the record will appear here.',
  "ai.logOk": "Done",
  "ai.logFail": "Not done",
  "ai.logTarget": "Target: {0}",
  "ai.disclaimerGroup": "Manage this group just by saying it in the agent chat — actions take effect immediately. Common commands are handled locally, while more complex requests are understood by AI. Every action is logged automatically and stays available after a restart.",
  "ai.disclaimerGuild": "Manage this guild just by saying it in the agent chat — actions take effect immediately. Common commands are handled locally, while more complex requests are understood by AI. Every action is logged automatically and stays available after a restart.",
  "gv.tab.assistant": "Activity log"
});

// src/client/i18n/index.ts
var QQBOT_LOCALE_NAMESPACE = "dsh-qqbot";
function hostLocaleToOurs(locale) {
  const normalized = locale.trim().toLowerCase().replace(/_/g, "-");
  if (normalized.startsWith("en")) return "en";
  if (normalized.startsWith("zh") || normalized === "cn") return "cn";
  return "cn";
}
var currentLocale = "cn";
var lookup;
var listeners = /* @__PURE__ */ new Set();
var hostBound = false;
function setTranslator(next) {
  lookup = typeof next === "function" ? next : void 0;
  hostBound = typeof next === "function";
  syncLocaleFromTranslator();
  emit();
}
function probeLocale() {
  if (!hostBound || !lookup) return null;
  const probe = lookup("common.langProbe");
  if (typeof probe !== "string" || !probe) return null;
  return probe === cn["common.langProbe"] ? "cn" : "en";
}
function syncLocaleFromTranslator() {
  const mapped = probeLocale();
  if (mapped) currentLocale = mapped;
}
function setLocale(locale) {
  const mapped = probeLocale() ?? hostLocaleToOurs(locale);
  if (mapped === currentLocale) return;
  currentLocale = mapped;
  emit();
}
function getLocale() {
  return currentLocale;
}
function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function useLocale() {
  const [loc, setLoc] = React.useState(getLocale());
  React.useEffect(() => subscribe(() => setLoc(getLocale())), []);
  return loc;
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
function fieldLabels() {
  return {
    workspacePath: t("session.workspace"),
    agentPreset: t("session.preset"),
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
}
function fieldHelp() {
  return {
    valueThreshold: t("tune.groupValueThresholdHint"),
    atContextMessages: t("tune.atContextHint"),
    groupCooldownMs: t("tune.minGroupIntervalHint"),
    senderCooldownMs: t("tune.sameSenderIntervalHint"),
    replyChunkChars: t("tune.chunkCharsHint"),
    maxRepliesPerMessage: t("tune.maxRepliesHint"),
    quoteMaxChars: t("policy.quoteLimitHint"),
    quotaPerDay: t("quota.dailyHint")
  };
}
function switchDefs() {
  return [
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
    },
    {
      key: "forceVerifyImage",
      label: t("feature.forceVerifyImage"),
      desc: t("feature.forceVerifyImageHint"),
      def: false
    }
  ];
}
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
  const dim = typeof props.size === "number" ? `${props.size}px` : "1em";
  return h(
    "svg",
    {
      viewBox: "0 0 24 24",
      width: dim,
      height: dim,
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

// src/client/settings-nav-icon.ts
var QBOT_SETTINGS_NAV_MARKER = "data-qbot-settings-nav";
var NAV_ICON_MASK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 3.5v2.5'/%3E%3Ccircle cx='12' cy='2.5' r='.9' fill='black' stroke='none'/%3E%3Crect x='5' y='6' width='14' height='12' rx='3.5'/%3E%3Ccircle cx='9.4' cy='11.5' r='.9' fill='black' stroke='none'/%3E%3Ccircle cx='14.6' cy='11.5' r='.9' fill='black' stroke='none'/%3E%3Cpath d='M9.5 14.8q2.5 1.8 5 0'/%3E%3C/svg%3E";
var QBOT_SETTINGS_NAV_CSS = `
[${QBOT_SETTINGS_NAV_MARKER}] svg > * {
  display: none !important;
}
[${QBOT_SETTINGS_NAV_MARKER}] svg {
  background-color: currentColor;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-image: url("${NAV_ICON_MASK}");
  mask-image: url("${NAV_ICON_MASK}");
}
`;
function registerQbotSettingsNavIcon(label) {
  let disposed = false;
  const sync = () => {
    if (disposed) return;
    const currentLabel = label().trim();
    const buttons = document.querySelectorAll(
      '[role="dialog"] nav button'
    );
    for (const button of Array.from(buttons)) {
      const matches2 = currentLabel.length > 0 && button.textContent?.trim() === currentLabel;
      if (matches2) button.setAttribute(QBOT_SETTINGS_NAV_MARKER, "");
      else button.removeAttribute(QBOT_SETTINGS_NAV_MARKER);
    }
  };
  sync();
  const observer = new MutationObserver(sync);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
  return () => {
    disposed = true;
    observer.disconnect();
    document.querySelectorAll(`[${QBOT_SETTINGS_NAV_MARKER}]`).forEach((element) => {
      element.removeAttribute(QBOT_SETTINGS_NAV_MARKER);
    });
  };
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
    const envelope = err;
    if (envelope.ok === false && envelope.error != null && envelope.error !== err) {
      return errText(envelope.error);
    }
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
var BUILT_IN_PRESET_LABELS = {
  standard: "session.presetStandard",
  ptc: "session.presetPtc",
  minimal: "session.presetMinimal",
  cordis: "session.presetCordis"
};
var presetOptions = (list) => [
  { value: "", label: t("session.followHostDefault") },
  ...list.filter((p) => p && typeof p.id === "string" && p.id).map((p) => {
    const label = typeof p.label === "string" && p.label ? p.label : p.id;
    const key = BUILT_IN_PRESET_LABELS[p.id];
    return { value: p.id, label: key && label === p.id ? t(key) : label };
  })
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
/* 品牌令牌放到 :root，保证右侧面板（不在 .qbot-page 内）也能解析，
   按钮/强调色在深色与浅色下都正确。宿主若定义 --dsw-alias-* 则在各自作用域覆盖。 */
:root {
  --qbot-blue: #1677ff;
  --qbot-blue-dark: #0958d9;
  --qbot-business: var(--dsw-alias-state-business-primary, #3370ff);
}

.qbot-page {
  --qbot-blue: #1677ff;
  --qbot-blue-dark: #0958d9;
  --qbot-business: var(--dsw-alias-state-business-primary, #3370ff);
  /* 铺满设置面板宽度：不再限 max-width，避免右侧大片空白（对齐词库设置页改法） */
  width: 100%;
  padding: 2px 0 30px;
  color: var(--dsw-alias-label-primary, #1f2329);
  box-sizing: border-box;
}
.qbot-page *, .qbot-page *::before, .qbot-page *::after { box-sizing: border-box; }

/* ── 页面底部页脚：常规软件 About 风格（细分隔线 + 居中 + 低调链接） ── */
.qbot-pageFoot { margin: 10px 2px 0; padding: 12px 8px 2px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); color: var(--dsw-alias-label-tertiary, #8f959e); text-align: center; }
.qbot-pageFootBody { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 4px 10px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 11.5px; line-height: 1.5; }
.qbot-pageFootDot { color: var(--dsw-alias-border-l2, #dfe1e5); user-select: none; }
.qbot-pageFootCopy { margin-top: 5px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; line-height: 1.6; }
.qbot-uiSwitch { display: inline-flex; align-items: center; gap: 5px; margin-left: 8px; vertical-align: middle; color: var(--dsw-alias-label-tertiary, #8f959e); cursor: pointer; user-select: none; }
.qbot-uiSwitchInput { position: absolute; width: 1px; height: 1px; opacity: 0; }
.qbot-uiSwitchTrack { position: relative; flex: none; width: 22px; height: 12px; border-radius: 999px; background: var(--dsw-alias-border-l2, #dfe1e5); transition: background .15s ease; }
.qbot-uiSwitchTrack::after { content: ""; position: absolute; top: 2px; left: 2px; width: 8px; height: 8px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgb(31 35 41 / 16%); transition: transform .15s ease, background .15s ease; }
.qbot-uiSwitch:hover .qbot-uiSwitchTrack { background: var(--dsw-alias-border-l3, #c9cdd4); }
.qbot-uiSwitchInput:checked + .qbot-uiSwitchTrack { background: rgb(22 119 255 / 26%); }
.qbot-uiSwitchInput:hover:checked + .qbot-uiSwitchTrack { background: rgb(22 119 255 / 38%); }
.qbot-uiSwitchInput:checked + .qbot-uiSwitchTrack::after { background: var(--qbot-blue, #1677ff); transform: translateX(10px); }
.qbot-uiSwitchInput:focus-visible + .qbot-uiSwitchTrack { outline: 2px solid var(--qbot-blue, #1677ff); outline-offset: 2px; }
.qbot-uiSwitchLabel { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10px; }

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
.qbot-hint { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; }

/* ── 通知（dim-statusNotice / info 变体）──────────────────────────────── */
.qbot-statusNotice { display: flex; align-items: flex-start; gap: 10px; padding: 13px 15px; border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 22%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 10px; color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 8%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 13px; line-height: 1.5; }
/* 会话运行时缺失告警：主文案 + 修复指引竖排，常驻不淡出（与 8s 消失的 infoNotice 区分）。 */
.qbot-runtimeNotice { flex-direction: column; gap: 6px; }
.qbot-runtimeNotice strong { font-weight: 650; }
.qbot-runtimeNotice span { min-width: 0; font-weight: 400; overflow-wrap: anywhere; }
.qbot-runtimeNotice .qbot-btn { align-self: flex-start; }

.qbot-infoNotice { display: flex; align-items: flex-start; gap: 10px; padding: 13px 15px; border: 1px solid color-mix(in srgb, var(--qbot-business) 22%, var(--dsw-alias-border-l2, #dfe1e5)); border-radius: 10px; color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 7%, var(--dsw-alias-bg-layer-1, #fff)); font-size: 13px; line-height: 1.5; animation: qbotNoticeOut 8s ease-in forwards; }
.qbot-noticeText { flex: 1 1 auto; min-width: 0; overflow-wrap: anywhere; }
/* 提示条右侧倒计时胶囊：右对齐、等宽数字、随 8s 自动消失同步归零。 */
.qbot-noticeCount { margin-left: auto; flex: none; align-self: flex-start; font-variant-numeric: tabular-nums; font-weight: 600; font-size: 12px; line-height: 1.4; padding: 1px 9px; border-radius: 999px; white-space: nowrap; background: color-mix(in srgb, var(--qbot-business) 14%, var(--dsw-alias-bg-layer-1, #fff)); border: 1px solid color-mix(in srgb, var(--qbot-business) 28%, var(--dsw-alias-border-l2, #dfe1e5)); }
/* 页面级更新提示（qbot-page 是普通块布局，无 channelPage 的 flex gap，需自带下边距与面板隔开） */
.qbot-updateNotice { margin: 0 0 18px; }
/* 进行中：不吃 8s 淡出动画（更新可能耗时较久），并改为竖排以突出「请勿关闭」警示行。 */
.qbot-updateNotice.is-busy { flex-direction: column; align-items: stretch; gap: 6px; animation: none; }
.qbot-updateMsg { min-width: 0; overflow-wrap: anywhere; }
.qbot-updateKeepOpen { color: var(--dsw-alias-state-error-primary, #d54941); font-size: 13px; font-weight: 650; line-height: 1.5; }

/* ── 机器人卡片（dim-botCard）─────────────────────────────────────────── */
.qbot-botList { min-width: 0; width: 100%; max-width: 100%; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; align-items: stretch; }
/* 奇数张时最后一张占满整行：1 张铺满、3 张 2+1、2 张并排，不留半行空白 */
.qbot-botCard:last-child:nth-child(odd) { grid-column: 1 / -1; }
.qbot-botCard { position: relative; min-width: 0; width: 100%; max-width: 100%; min-height: 156px; display: flex; flex-direction: column; gap: 12px; padding: 16px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 3%); font: inherit; text-align: left; cursor: pointer; transition: border-color .16s ease, box-shadow .16s ease, transform .16s ease; }
.qbot-botCard:hover { border-color: color-mix(in srgb, var(--qbot-blue) 25%, var(--dsw-alias-border-l2, #e5e6eb)); box-shadow: 0 6px 18px rgb(31 35 41 / 6%); transform: translateY(-2px); }
.qbot-botCard:focus-visible { outline: none; border-color: color-mix(in srgb, var(--qbot-blue) 72%, var(--dsw-alias-border-l2, #dfe1e5)); box-shadow: 0 0 0 1px color-mix(in srgb, var(--qbot-blue) 24%, transparent) inset, 0 3px 12px rgb(22 119 255 / 7%); }
.qbot-botCardHead { min-width: 0; display: flex; align-items: center; gap: 12px; }
.qbot-botAvatar { flex: none; width: 44px; height: 44px; display: grid; place-items: center; overflow: hidden; border-radius: 12px; color: #fff; background: var(--qbot-blue); }
.qbot-botAvatar svg { width: 30px; height: 30px; }
.qbot-botCardTitle { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
.qbot-botCardTitle strong { overflow: hidden; color: var(--dsw-alias-label-primary, #1f2329); font-size: 15px; font-weight: 650; line-height: normal; text-overflow: ellipsis; white-space: nowrap; }
.qbot-botCardMeta { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.45; overflow-wrap: anywhere; }
.qbot-botCardStatus { min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 10px; border-radius: 9px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-botCardRole { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; white-space: nowrap; }
.qbot-botCardFoot { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 8px; color: var(--qbot-blue); font-size: 12px; font-weight: 600; }
.qbot-botCardArrow { font-size: 16px; line-height: 1; transition: transform .16s ease; }
.qbot-botCard:hover .qbot-botCardArrow { transform: translateX(3px); }

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
.qbot-fieldLabel { display: block; min-width: 0; overflow-wrap: anywhere; }
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
.qbot-modalList { flex: 1 1 auto; min-width: 0; min-height: 0; margin: 12px var(--qbot-gutter, 20px) 0; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; }
/* 无外壳管理器根（右侧面板 / 设置页弹窗共用）：宽度完全由父容器决定，禁止撑破父级 */
/* 无外壳管理器根（右侧面板 / 设置页弹窗共用）：宽度完全由父容器决定，禁止撑破父级。
   --qbot-gutter 是唯一的水平留白来源：列表容器外边距、编辑表单内边距、底部操作区共用，
   因此表单卡片与列表容器的外边缘始终对齐，面板宽窄变化时同步收敛，不会出现两套间距。 */
.qbot-schedRoot { --qbot-gutter: clamp(12px, 3.2%, 20px); min-width: 0; width: 100%; max-width: 100%; }
/* 吸顶：tabs/notice 固定在面板头部，仅内层内容区滚动 */
.qbot-modalListScroll { flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; display: flex; flex-direction: column; gap: 2px; padding: 0 6px 6px; }
.qbot-dirRow { display: flex; align-items: center; gap: 10px; min-height: 38px; padding: 0 10px; border: 0; border-radius: 8px; color: var(--dsw-alias-label-primary, #1f2329); background: transparent; font: inherit; font-size: 13px; text-align: left; cursor: pointer; transition: background .12s ease; }
.qbot-dirRow.is-selected { background: var(--dsw-alias-bg-active, rgba(22, 119, 255, .14)); font-weight: 600; }
.qbot-dirRow:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-dirRow svg { flex: none; width: 16px; height: 16px; color: var(--qbot-business); }
.qbot-modalState { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 96px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; }
.qbot-modalError { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-modalFoot { min-width: 0; flex: none; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 12px clamp(10px, 3.2%, 20px) 14px; font-variant-numeric: tabular-nums; }
/* 弹窗底部内联错误：常驻可见，不随弹窗内容滚动而移出视口 */
.qbot-footError { margin: 0; color: var(--dsw-alias-state-error-primary, #d54941); font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; }
/* 宽弹窗：定时消息 / 消息归档 列表内容较长，放宽上限 */
.qbot-modalWide { width: min(760px, 100%); }
/* ── 概览第一行右侧操作区（定时消息 / 消息归档 入口） ── */
.qbot-heroActions { display: flex; align-items: center; gap: 8px; margin-left: auto; padding-left: 12px; flex: none; }
/* ── 定时消息弹窗：范围 Tab + 群聊/单聊分组 ── */
.qbot-schedTabs { min-width: 0; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; padding: 10px 12px 8px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-module-platform, #f7f8fa); border-radius: 9px 9px 0 0; flex: none; }
.qbot-schedTab { flex: none; padding: 5px 14px; border: 1px solid transparent; border-radius: 999px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; cursor: pointer; }
.qbot-schedTab:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-schedTab.is-active { background: var(--dsw-alias-bg-layer-1, #fff); border-color: var(--dsw-alias-border-l2, #e5e6eb); color: var(--qbot-blue); font-weight: 600; box-shadow: 0 1px 2px rgb(31 35 41 / 6%); }
/* 右侧面板「定时消息」工具栏：机器人作用域 + 刷新（自适应面板宽度、可换行） */
.qbot-schedToolbar { flex: none; position: sticky; top: 0; z-index: 2; min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; padding: 10px clamp(8px, 3%, 14px); border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-fieldInline { min-width: 0; flex: 1 1 auto; display: inline-flex; align-items: center; gap: 8px; }
.qbot-fieldInlineLabel { flex: none; font-size: 12px; font-weight: 600; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-schedToolbar .qbot-settingSelect { flex: 1 1 auto; min-width: 0; max-width: 240px; }
.qbot-schedRefresh { flex: none; }
/* 面板级错误提示：走错误态令牌，深浅色均正确 */
.qbot-schedPanelError { margin: 10px clamp(8px, 3%, 14px); padding: 8px 12px; border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 34%, transparent); border-radius: 8px; background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 8%, transparent); color: var(--dsw-alias-state-error-primary, #d54941); font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-schedAdd { margin-left: auto; padding: 4px 12px; font-size: 12px; }

/* 消息归档双栏：左会话列表（个人/群聊）/ 右消息内容（卡片式） */
.qbot-modalAlert { flex: none; margin: 10px 20px 0; padding: 8px 12px; border-radius: 8px; background: var(--dsw-alias-state-error-bg, #fee9e7); color: var(--dsw-alias-state-error-primary, #d54941); font-size: 12px; font-weight: 600; }
.qbot-modalWide { width: min(880px, 100%); height: min(80vh, 760px); }
/* 定时编辑态底部动作条：与表单区隔一层，按钮靠右、提示靠左 */
.qbot-schedEditFoot { border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: color-mix(in srgb, var(--dsw-alias-bg-module-platform, #f7f8fa) 55%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-schedEditFoot .qbot-viewActions { margin-left: auto; }
.qbot-archSplit { flex: 1 1 auto; min-height: 140px; margin: 12px 20px 0; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; overflow: hidden; display: flex; }
.qbot-archSplit.is-refreshing { opacity: 0.6; pointer-events: none; }
/* 左栏：会话列表 */
.qbot-archSide { width: 252px; flex: none; overflow-y: auto; padding: 8px; border-right: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-archSideEmpty { padding: 14px 8px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.6; }
.qbot-archChats { display: flex; flex-direction: column; gap: 12px; }
.qbot-convSection { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.qbot-convSectionTitle { padding: 4px 8px 2px; font-size: 11px; font-weight: 700; letter-spacing: .08em; color: var(--dsw-alias-label-tertiary, #8f959e); text-transform: uppercase; }
/* 左栏会话 → 月份 两级折叠树 */
.qbot-convGroup { border-radius: 10px; }
.qbot-convGroup.is-open { background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-convGroupHeadRow { display: flex; align-items: stretch; gap: 2px; }
.qbot-convGroupHead { flex: 1; min-width: 0; display: flex; align-items: center; gap: 9px; padding: 7px 6px; border: 0; border-radius: 10px; background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.qbot-convGroupHead:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-convGroupName { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-convGroupCount { flex: none; min-width: 20px; padding: 0 6px; height: 18px; display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; background: var(--dsw-alias-bg-layer-1, #fff); border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); color: var(--dsw-alias-label-secondary, #646a73); font-size: 10.5px; font-weight: 700; font-variant-numeric: tabular-nums; }
.qbot-convGroupMembers { flex: none; padding: 0 6px; height: 16px; display: inline-flex; align-items: center; border-radius: 999px; background: color-mix(in srgb, var(--qbot-blue, #2466e8) 12%, transparent); color: var(--qbot-blue, #2466e8); font-size: 10px; font-weight: 600; white-space: nowrap; }
.qbot-chevron { flex: none; color: var(--dsw-alias-label-tertiary, #8f959e); transition: transform .15s ease; }
.qbot-convGroup.is-open .qbot-chevron { transform: rotate(90deg); }
.qbot-convMonths { display: flex; flex-direction: column; gap: 1px; padding: 2px 0 6px; }
.qbot-convMonth { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 6px 6px 28px; border: 0; border-radius: 8px; background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.qbot-convMonth:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-convMonth.is-active { background: var(--dsw-alias-bg-active, rgba(22, 119, 255, .14)); }
.qbot-convMonthMeta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.qbot-convMonthName { font-size: 12.5px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-convMonth.is-active .qbot-convMonthName { color: var(--qbot-blue); }
.qbot-convMonthSub { font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-convMonthCount { flex: none; font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); font-variant-numeric: tabular-nums; }
.qbot-convMonthEmpty { padding: 4px 6px 4px 28px; font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-avatarXs { width: 18px; height: 18px; flex: none; }
/* 右栏：消息内容（标题栏固定，仅消息列表滚动，滚动条不越过标题） */
.qbot-archMain { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: hidden; }
.qbot-archChatHead { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 14px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-archChatTitleWrap { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.qbot-archChatTitle { display: inline-flex; align-items: center; gap: 8px; min-width: 0; font-size: 14px; font-weight: 650; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-archChatTitle > span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-archGroupMeta { min-width: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; padding-left: 36px; font-size: 11px; font-weight: 400; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-archGroupMeta > span { min-width: 0; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding: 1px 7px; border-radius: 999px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-archChatActions { flex: none; display: inline-flex; align-items: center; gap: 4px; }
.qbot-archChatDel:disabled { opacity: 0.5; cursor: default; }
.qbot-archChatDel { flex: none; width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; border: 0; border-radius: 8px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); cursor: pointer; }
.qbot-archChatDel:hover { background: var(--dsw-alias-state-error-bg, #fee9e7); color: var(--dsw-alias-state-error-primary, #d54941); }
/* 右栏筛选栏（仿聊天记录搜索）：关键词 / 群成员（仅群聊） / 日期，客户端过滤已加载记录 */
.qbot-archSearchBar { flex: none; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 8px 14px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-archSearchBox { flex: 1 1 170px; min-width: 0; display: flex; align-items: center; gap: 7px; height: 32px; padding: 0 9px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 9px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); transition: border-color .15s ease, background .15s ease; }
.qbot-archSearchBox:focus-within { border-color: var(--qbot-business); background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-archSearchIcon { flex: none; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-archSearchInput { flex: 1 1 auto; min-width: 0; height: 100%; border: 0; outline: none; background: transparent; font: inherit; font-size: 12.5px; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-archSearchInput::placeholder { color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-archSearchX { flex: none; width: 18px; height: 18px; display: inline-flex; align-items: center; justify-content: center; border: 0; border-radius: 50%; background: transparent; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 15px; line-height: 1; cursor: pointer; }
.qbot-archSearchX:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); color: var(--dsw-alias-label-primary, #1f2329); }

/* ── 群成员下拉（自定义弹层，替代原生 select）：只高亮选中项与悬停项 ── */
.qbot-archMemberWrap { flex: none; position: relative; }
.qbot-archMemberBtn { max-width: 168px; height: 32px; padding: 0 9px; display: inline-flex; align-items: center; justify-content: space-between; gap: 6px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); font: inherit; font-size: 12.5px; color: var(--dsw-alias-label-primary, #1f2329); cursor: pointer; transition: border-color .15s ease; }
.qbot-archMemberBtn:hover { border-color: var(--dsw-alias-border-l3, #d8dadf); }
.qbot-archMemberBtn.is-on { border-color: color-mix(in srgb, var(--qbot-business) 45%, transparent); color: var(--qbot-business); font-weight: 600; }
.qbot-archMemberBtnText { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-archMemberCaret { flex: none; opacity: 0.65; }
.qbot-archMemberPanel { position: absolute; top: calc(100% + 6px); left: 0; z-index: 60; min-width: 200px; max-width: 280px; max-height: 248px; overflow-y: auto; overflow-x: hidden; padding: 6px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 12px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 8px 24px rgb(31 35 41 / 14%); }
.qbot-archMemberItem { display: flex; width: 100%; align-items: center; border: 0; border-radius: 8px; background: transparent; padding: 7px 10px; font: inherit; font-size: 12.5px; line-height: 1.4; text-align: left; color: var(--dsw-alias-label-primary, #1f2329); cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
/* 悬停高亮：淡灰 */
.qbot-archMemberItem:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
/* 选中高亮：淡品牌底 + 品牌色字（不是大色块） */
.qbot-archMemberItem.is-on { background: color-mix(in srgb, var(--qbot-business) 10%, transparent); color: var(--qbot-business); font-weight: 600; }
.qbot-archMemberItem.is-on:hover { background: color-mix(in srgb, var(--qbot-business) 16%, transparent); }

/* ── 日期范围选择器：触发按钮 + 弹出日历（有消息的日子打点标记） ── */
.qbot-archDateWrap { flex: none; position: relative; }
.qbot-archDateBtn { height: 32px; min-width: 136px; padding: 0 10px; display: inline-flex; align-items: center; justify-content: space-between; gap: 6px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); font: inherit; font-size: 12.5px; color: var(--dsw-alias-label-primary, #1f2329); cursor: pointer; transition: border-color .15s ease; }
.qbot-archDateBtn:hover { border-color: var(--dsw-alias-border-l3, #d8dadf); }
.qbot-archDateBtn.is-on { border-color: color-mix(in srgb, var(--qbot-business) 45%, transparent); color: var(--qbot-business); font-weight: 600; }
.qbot-archDateBtnText { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-archDatePanel { position: absolute; top: calc(100% + 6px); right: 0; z-index: 60; width: 254px; padding: 10px 12px 8px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 12px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 8px 24px rgb(31 35 41 / 14%); }
.qbot-archDateHead { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
.qbot-archDateTitle { flex: 1; min-width: 0; text-align: center; font-size: 13px; font-weight: 650; color: var(--dsw-alias-label-primary, #1f2329); white-space: nowrap; }
.qbot-archDateNav { flex: none; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; border: 0; border-radius: 7px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); font-size: 14px; line-height: 1; cursor: pointer; }
.qbot-archDateNav:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-archDateGrid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.qbot-archDateWd { text-align: center; padding: 2px 0 4px; font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-archDateCell { position: relative; height: 28px; display: inline-flex; align-items: center; justify-content: center; border: 0; border-radius: 7px; background: transparent; font: inherit; font-size: 12px; line-height: 1; color: var(--dsw-alias-label-primary, #1f2329); cursor: pointer; font-variant-numeric: tabular-nums; transition: background .12s ease; }
.qbot-archDateCell:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-archDateCell.is-out { color: var(--dsw-alias-label-quaternary, #b8bcc2); cursor: default; pointer-events: none; }
/* 打点：当天有消息 */
.qbot-archDateCell::after { content: ""; position: absolute; bottom: 3px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background: transparent; }
.qbot-archDateCell.is-marked::after { background: color-mix(in srgb, var(--qbot-business) 72%, transparent); }
/* 范围中间日 / 起止端点 */
.qbot-archDateCell.is-inrange { background: color-mix(in srgb, var(--qbot-business) 12%, transparent); border-radius: 0; }
.qbot-archDateCell.is-edge, .qbot-archDateCell.is-edge:hover { background: var(--qbot-business); color: #fff; font-weight: 650; }
.qbot-archDateCell.is-edge.is-marked::after { background: rgb(255 255 255 / 85%); }
.qbot-archDateFoot { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 8px; padding-top: 6px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-archDateClear { flex: none; border: 0; background: transparent; padding: 2px 6px; border-radius: 6px; color: var(--dsw-alias-label-secondary, #646a73); font: inherit; font-size: 12px; cursor: pointer; }
.qbot-archDateClear:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-archDateHint { min-width: 0; font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); text-align: right; }
/* 一键清除：固定尺寸的 × 图标按钮，常驻占位（隐藏用 visibility），避免出现/消失引起布局抖动 */
.qbot-archSearchClear { flex: none; width: 32px; height: 32px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border: 1px solid color-mix(in srgb, var(--qbot-business) 38%, transparent); border-radius: 9px; background: color-mix(in srgb, var(--qbot-business) 8%, transparent); color: var(--qbot-business); font: inherit; font-size: 16px; line-height: 1; cursor: pointer; }
.qbot-archSearchClear:hover { background: color-mix(in srgb, var(--qbot-business) 14%, transparent); }
.qbot-archSearchClear:disabled { cursor: default; }
.qbot-archState { flex: 1 1 auto; min-height: 0; display: flex; align-items: center; justify-content: center; padding: 12px 14px; text-align: center; }
.qbot-archMore { padding: 8px 14px 2px; font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-msgList { flex: 1 1 auto; min-height: 0; padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto; overflow-x: hidden; }
/* 消息卡片：聊天式左右对话——用户消息靠左、机器人靠右（头像在外侧），内容收进气泡 */
.qbot-msgCard { display: flex; gap: 10px; align-items: flex-start; min-width: 0; }
.qbot-msgCard.is-bot { flex-direction: row-reverse; }
.qbot-msgAvatar { flex: none; }
/* 真实头像（消息事件学习的 avatar URL），与占位图标同尺寸。 */
.qbot-avatarImg { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; display: block; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
/* 左栏会话头 / 月份节点的真实头像尺寸，与占位图标对齐。 */
.qbot-avatarImg.qbot-convAvatarImg { width: 34px; height: 34px; }
.qbot-avatarImg.qbot-convMonthAvatarImg { width: 18px; height: 18px; }
/* 气泡：不占满全宽（max-width 86%），按内容收缩；用户灰底、机器人淡品牌底 */
.qbot-msgBody { min-width: 0; flex: 0 1 auto; max-width: min(86%, 760px); display: flex; flex-direction: column; gap: 4px; padding: 9px 12px 10px; border-radius: 14px 14px 14px 4px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-msgCard.is-bot .qbot-msgBody { border-radius: 14px 14px 4px 14px; border-color: color-mix(in srgb, var(--qbot-blue) 16%, transparent); background: color-mix(in srgb, var(--qbot-blue) 8%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-msgHead { display: flex; align-items: baseline; gap: 8px; }
.qbot-msgCard.is-bot .qbot-msgHead { justify-content: flex-end; }
.qbot-msgName { font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-msgTime { font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); font-variant-numeric: tabular-nums; }
/* 引用块：嵌在气泡内，改用浮起的白底 + 左侧竖线 */
.qbot-msgQuote { margin: 2px 0; padding: 7px 10px; border-left: 3px solid var(--dsw-alias-border-l2, #d0d3d9); border-radius: 0 8px 8px 0; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-msgQuoteName { font-size: 11px; font-weight: 600; color: var(--dsw-alias-label-secondary, #646a73); margin-bottom: 2px; }
.qbot-msgQuoteText { font-size: 12px; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; }
.qbot-msgText { font-size: 13.5px; line-height: 1.65; color: var(--dsw-alias-label-primary, #1f2329); overflow-wrap: anywhere; word-break: break-word; white-space: pre-wrap; }
.qbot-msgFace { display: inline-block; font-size: 11px; line-height: 1.5; padding: 1px 8px; margin: 0 2px; border-radius: 999px; background: var(--dsw-alias-fill-secondary, rgba(31,35,41,.06)); color: var(--dsw-alias-label-secondary, #646a73); vertical-align: baseline; }
.qbot-msgNote { font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); }
/* 已撤回标记：消息头的小徽章 + 原文未保留时的占位文案 */
.qbot-msgRecalled { display: inline-block; font-size: 10px; line-height: 1.5; padding: 0 6px; border-radius: 999px; background: var(--dsw-alias-fill-secondary, rgba(31,35,41,.06)); color: var(--dsw-alias-label-tertiary, #8f959e); font-weight: 500; }
.qbot-msgRecalledHint { color: var(--dsw-alias-label-tertiary, #8f959e); font-style: italic; }
/* 归档媒体：图片缩略图 / 视频 / 文件条目 */
.qbot-archMediaList { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px; }
.qbot-archMedia { display: flex; flex-direction: column; gap: 4px; max-width: 100%; min-width: 0; }
.qbot-archMediaBtn { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding: 6px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); cursor: pointer; max-width: 240px; min-width: 0; transition: border-color .15s ease, background .15s ease; }
.qbot-archMediaBtn:hover { border-color: color-mix(in srgb, var(--qbot-blue) 40%, transparent); }
.qbot-archMediaBtn.is-expanded { border-color: var(--qbot-blue); }
.qbot-archMediaImg { display: block; width: 100%; max-width: 228px; height: auto; max-height: 320px; object-fit: contain; border-radius: 6px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-archMediaPlaceholder { display: flex; align-items: center; justify-content: center; width: 180px; height: 110px; font-size: 12px; color: var(--dsw-alias-label-tertiary, #8f959e); border-radius: 6px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); text-align: center; padding: 8px; }
.qbot-archMediaName { font-size: 11px; color: var(--dsw-alias-label-secondary, #646a73); max-width: 228px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-archMediaSize { font-size: 10px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-archMediaIcon { font-size: 18px; line-height: 1; color: var(--qbot-blue); }
.qbot-archMediaBtn.is-file, .qbot-archMediaBtn.is-video { flex-direction: row; align-items: center; gap: 8px; padding: 7px 10px; }
.qbot-archMediaErr { font-size: 10px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-archMediaVideo { display: block; max-width: 100%; max-height: 360px; border-radius: 8px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-msgCard.is-bot .qbot-msgName { color: var(--qbot-blue); }
/* 右栏按月分组分隔线 */
.qbot-monthGroup { display: flex; flex-direction: column; gap: 14px; }
.qbot-monthDivider { display: flex; align-items: center; gap: 8px; margin: 2px 0 0; padding: 0 2px; }
.qbot-monthDividerLabel { font-size: 12px; font-weight: 700; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-monthDivider::before, .qbot-monthDivider::after { content: ""; height: 1px; background: var(--dsw-alias-border-l1, #eef0f3); }
.qbot-monthDivider::before { flex: none; width: 14px; }
.qbot-monthDivider::after { flex: 1; }
.qbot-monthDividerCount { font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); font-variant-numeric: tabular-nums; }
/* 右栏底部分页条（显示进度 + 加载更多 / 显示全部） */
.qbot-archFoot { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: nowrap; padding: 4px 14px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-archFootInfo { flex: none; font-size: 12px; color: var(--dsw-alias-label-tertiary, #8f959e); font-variant-numeric: tabular-nums; }
.qbot-archFootMore { flex: none; display: flex; align-items: center; justify-content: flex-end; gap: 8px; margin-left: auto; color: var(--dsw-alias-border-l1, #eef0f3); }
.qbot-archFootLink { flex: none; padding: 1px 4px; border: 0; border-radius: 6px; background: transparent; font-size: 12px; line-height: 1.3; color: var(--dsw-alias-label-tertiary, #8f959e); cursor: pointer; white-space: nowrap; }
.qbot-archFootLink:hover:not(:disabled) { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-archFootLink:disabled { opacity: .55; cursor: default; }
.qbot-archFootSep { flex: none; color: var(--dsw-alias-border-l1, #eef0f3); }
/* Markdown：代码块换行，避免横向滚动条 */
.qbot-md pre { white-space: pre-wrap; word-break: break-word; max-width: 100%; }
/* 头像（无真实头像图，用图标占位）：浅色底 + 品牌色图标，与控制台浅色风格一致 */
.qbot-avatar { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; color: var(--qbot-blue, #1677ff); }
.qbot-avatar svg { width: 22px; height: 22px; }
.qbot-avatar-bot { background: color-mix(in srgb, var(--qbot-blue, #1677ff) 13%, var(--dsw-alias-bg-layer-1, #fff)); color: var(--qbot-blue, #1677ff); }
.qbot-avatar-person { background: color-mix(in srgb, #8f959e 16%, var(--dsw-alias-bg-layer-1, #fff)); color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-avatar-group { background: color-mix(in srgb, var(--qbot-business, #7c4dff) 12%, var(--dsw-alias-bg-layer-1, #fff)); color: var(--qbot-business, #7c4dff); }
.qbot-avatarSm { width: 22px; height: 22px; }
.qbot-avatarSm svg { width: 13px; height: 13px; }
.qbot-modalStateInline { min-height: 60px; padding: 0; }
/* 分组（群聊 / 单聊）：标题即折叠开关，可收起以减少滚动长度。
   同时作为「任务卡」的宽度容器：卡片实际可用宽度随面板拖拽变化，
   由下方 @container schedgroup 决定正文与操作列是并排还是上下堆叠。 */
.qbot-schedGroup { container-type: inline-size; container-name: schedgroup; min-width: 0; display: flex; flex-direction: column; gap: 6px; padding: 8px clamp(8px, 2.5%, 12px) 4px; }
.qbot-schedGroupTitle {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  margin: 4px 0 2px;
  padding: 4px 6px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  font: inherit;
  font-size: 12.5px;
  font-weight: 650;
  text-align: left;
  color: var(--dsw-alias-label-secondary, #646a73);
  cursor: pointer;
  transition: background .14s ease;
}
.qbot-schedGroupTitle:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-schedGroupTitle:focus-visible { outline: 2px solid color-mix(in srgb, var(--qbot-business) 55%, transparent); outline-offset: 1px; }
.qbot-schedGroupTitle[data-scope="group"] { color: var(--qbot-blue); }
.qbot-schedGroupTitle::after { content: ""; flex: 1; height: 1px; background: var(--dsw-alias-border-l1, #eef0f3); }
/* 折叠指示箭头：展开朝下，收起朝右（纯 CSS 旋转，随主题色 currentColor） */
.qbot-schedCaret { flex: none; width: 7px; height: 7px; border-right: 1.6px solid currentColor; border-bottom: 1.6px solid currentColor; transform: rotate(45deg); transition: transform .18s ease; transform-origin: 50% 50%; }
.qbot-schedGroup.is-collapsed .qbot-schedCaret { transform: rotate(-45deg); }
.qbot-schedCount { flex: none; min-width: 20px; text-align: center; padding: 0 6px; border-radius: 999px; background: var(--dsw-alias-interactive-bg-hover, #eef0f3); color: var(--dsw-alias-label-secondary, #646a73); font-size: 11px; font-weight: 600; font-variant-numeric: tabular-nums; }
.qbot-schedGroupTitle[data-scope="group"] .qbot-schedCount { color: var(--qbot-blue); background: color-mix(in srgb, var(--qbot-business) 12%, transparent); }
.qbot-schedGroup.is-collapsed .qbot-schedGroupTitle { opacity: .82; }
/* 定时消息行：任务卡片式（类型徽标 + 内容 + 元信息 + 操作列） */
.qbot-schedRow { min-width: 0; position: relative; display: flex; align-items: flex-start; gap: 12px; padding: 11px 13px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 12px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 4%); }
.qbot-schedMain { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.qbot-schedTop { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.qbot-chipWarn { color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-schedContent { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 550; line-height: 1.55; overflow-wrap: anywhere; white-space: pre-wrap; }
.qbot-schedMeta { min-width: 0; max-width: 100%; display: flex; align-items: center; gap: 8px 12px; flex-wrap: wrap; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 12px; }
/* 元信息里的每一项都必须可收缩：flex item 默认 min-width:auto，遇到无空格长串
   （典型是 python 报错里的绝对路径）会把整行撑破、溢出卡片外。 */
.qbot-schedMeta > * { min-width: 0; max-width: 100%; overflow-wrap: anywhere; word-break: break-word; }
/* 运行失败原因：独占整行、必须换行（报错常含无空格长路径），默认限高 + 内部滚动，
   点击展开 / 收起查看完整报错；滚动条本身即「还有更多内容」的提示。 */
.qbot-schedError {
  flex: 1 1 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  margin-top: 2px;
  padding: 5px 9px;
  border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 22%, transparent);
  border-radius: 7px;
  background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 7%, transparent);
  color: var(--dsw-alias-state-error-primary, #d54941);
  overflow-wrap: anywhere;
  word-break: break-word;
  max-height: 7.5em;
  overflow-y: auto;
  overscroll-behavior: contain;
  cursor: pointer;
  transition: background .15s ease;
}
.qbot-schedError:hover { background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 12%, transparent); }
.qbot-schedError.is-expanded { max-height: none; overflow-y: visible; }
.qbot-schedError:focus-visible { outline: 2px solid color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 55%, transparent); outline-offset: 2px; }
.qbot-schedRemove { flex: none; }
/* 行内操作列：查看 / 测试 / 编辑 / 启用禁用 / 删除 右对齐紧凑排布；
   删除前用细分隔条与常规操作隔开，弱化视觉权重。 */
.qbot-schedOps { display: inline-flex; flex-direction: row; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 6px; flex: none; align-self: flex-start; margin-left: auto; }
.qbot-schedOps .qbot-btn { min-height: 28px; padding: 3px 11px; font-size: 12px; line-height: 1; border-radius: 7px; }
.qbot-schedView { color: var(--qbot-business, #3370ff); border-color: color-mix(in srgb, var(--qbot-business, #3370ff) 42%, transparent); }
.qbot-schedView:hover:not(:disabled) { background: color-mix(in srgb, var(--qbot-business, #3370ff) 10%, transparent); }
.qbot-schedDivider { width: 1px; height: 16px; margin: 0 1px; background: var(--dsw-alias-border-l2, #dfe1e5); align-self: center; }
.qbot-schedTest { border-color: color-mix(in srgb, var(--qbot-business) 42%, transparent); color: var(--qbot-business); }
.qbot-schedTest:hover:not(:disabled) { background: color-mix(in srgb, var(--qbot-business) 10%, transparent); }
.qbot-schedTest:disabled { opacity: .6; cursor: default; }
/* 测试执行结果横幅（列表顶部） */
.qbot-schedNotice { min-width: 0; max-width: calc(100% - 16px); margin: 8px; padding: 8px 12px; border-radius: 8px; font-size: 12px; line-height: 1.5; border: 1px solid color-mix(in srgb, var(--qbot-business) 34%, transparent); background: color-mix(in srgb, var(--qbot-business) 8%, transparent); color: var(--qbot-business); flex: none; overflow-wrap: anywhere; word-break: break-word; white-space: pre-wrap; max-height: 32vh; overflow-y: auto; overscroll-behavior: contain; }
.qbot-schedNotice.is-error { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 34%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 8%, transparent); color: var(--dsw-alias-state-error-primary, #d54941); }
/* 成功提示：8 秒内保持可读，最后 0.8s 淡出后由组件卸载（见自动收起定时器） */
@keyframes qbotNoticeOut { 0%, 90% { opacity: 1; } 100% { opacity: 0; } }
.qbot-schedNotice.is-autoHide { animation: qbotNoticeOut 8s ease-in forwards; }
/* 列表卡片：左侧品牌色条强化层次 + 悬浮反馈 */
.qbot-schedRow { transition: border-color .15s ease, box-shadow .15s ease; }
.qbot-schedRow::before { content: ""; position: absolute; left: 0; top: 9px; bottom: 9px; width: 3px; border-radius: 0 3px 3px 0; background: var(--qbot-business); }
.qbot-schedRow:hover { border-color: color-mix(in srgb, var(--qbot-business) 32%, var(--dsw-alias-border-l2, #e5e6eb)); box-shadow: 0 3px 12px rgb(31 35 41 / 9%); }
.qbot-schedRow.is-failed::before { background: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-schedRow.is-disabled::before { background: var(--dsw-alias-border-l2, #e5e6eb); }
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
/* ── 定时编辑表单：三步向导卡片（发送给谁 / 什么时候 / 做什么） ──
   宽度自适应面板：字段一律单列堆叠、控件宽度 100%、容器 min-width:0，
   窄面板不挤压文字、不产生横向滚动条；宽面板自动铺满，间距由 clamp 收敛。 */
.qbot-schedForm { gap: 14px; counter-reset: qbot-schedStep; min-width: 0; padding-bottom: 2px; }
.qbot-schedSection {
  min-width: 0; width: 100%; max-width: 100%; box-sizing: border-box;
  border: 1px solid var(--dsw-alias-border-l2, #e5e6eb);
  border-radius: 14px;
  background: var(--dsw-alias-bg-layer-1, #fff);
  box-shadow: 0 1px 3px rgb(31 35 41 / 5%);
  transition: border-color .16s ease, box-shadow .16s ease;
}
.qbot-schedSection:focus-within { border-color: color-mix(in srgb, var(--qbot-business) 42%, var(--dsw-alias-border-l2, #e5e6eb)); box-shadow: 0 2px 10px color-mix(in srgb, var(--qbot-business) 12%, transparent); }
.qbot-schedSectionHead {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  padding: 12px clamp(12px, 3%, 16px);
  border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3);
  border-radius: 13px 13px 0 0;
  background: linear-gradient(100deg, color-mix(in srgb, var(--qbot-business) 9%, var(--dsw-alias-bg-layer-1, #fff)), var(--dsw-alias-bg-layer-1, #fff) 78%);
}
/* 步骤序号：实心品牌圆牌，由 CSS 计数器生成，与文案解耦，随语言切换保持 1/2/3 顺序 */
.qbot-schedSectionHead::before {
  counter-increment: qbot-schedStep;
  content: counter(qbot-schedStep);
  flex: none;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--qbot-business), color-mix(in srgb, var(--qbot-business) 78%, var(--qbot-blue, #3370ff)));
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  box-shadow: 0 2px 5px color-mix(in srgb, var(--qbot-business) 32%, transparent);
}
.qbot-schedSectionTitle { flex: 1 1 auto; min-width: 0; font-size: 14px; font-weight: 680; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-schedSectionDesc { flex: 1 1 100%; min-width: 0; margin-left: 34px; font-size: 12px; line-height: 1.5; color: var(--dsw-alias-label-tertiary, #8f959e); overflow-wrap: anywhere; }
.qbot-schedSectionBody { min-width: 0; display: flex; flex-direction: column; gap: 15px; padding: 15px clamp(12px, 3%, 16px) 17px; }
/* 字段行 / 编辑栅格：一律单列竖向堆叠（步骤式配置），子项允许收缩 */
.qbot-schedFieldRow, .qbot-editGrid { min-width: 0; display: grid; grid-template-columns: minmax(0, 1fr); gap: 14px; align-items: start; }
.qbot-schedFieldCol { min-width: 0; display: flex; flex-direction: column; gap: 14px; }
/* 触发条件分段按钮：等宽弹性铺满，绝不横向溢出（窄面板由省略号收敛） */
.qbot-schedSeg { min-width: 0; max-width: 100%; width: 100%; box-sizing: border-box; display: flex; flex-wrap: nowrap; gap: 4px; padding: 3px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-segBtn { flex: 1 1 0; min-width: 0; padding: 5px 6px; border: 1px solid transparent; border-radius: 8px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); font: inherit; font-size: 12.5px; line-height: 1.4; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; transition: background .15s ease, color .15s ease; }
.qbot-segBtn:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-segBtn.is-on { background: var(--dsw-alias-bg-layer-1, #fff); border-color: var(--dsw-alias-border-l2, #e5e6eb); color: var(--qbot-business); font-weight: 600; box-shadow: 0 1px 2px rgb(31 35 41 / 6%); }
/* 勾选框行：原生 checkbox + 状态文字，整行可点 */
.qbot-checkRow { min-width: 0; align-self: flex-start; display: inline-flex; align-items: center; gap: 9px; padding: 7px 12px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); cursor: pointer; transition: border-color .16s ease, background .16s ease; }
.qbot-checkRow:hover { border-color: color-mix(in srgb, var(--qbot-business) 45%, var(--dsw-alias-border-l2, #e5e6eb)); }
.qbot-checkRow:has(.qbot-checkbox:checked) { border-color: color-mix(in srgb, var(--qbot-business) 42%, transparent); background: color-mix(in srgb, var(--qbot-business) 6%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-checkbox { appearance: none; flex: none; width: 17px; height: 17px; margin: 0; border: 1.5px solid var(--dsw-alias-border-l2, #c9cdd4); border-radius: 5px; background: var(--dsw-alias-bg-layer-1, #fff); cursor: pointer; position: relative; transition: background .15s ease, border-color .15s ease; }
.qbot-checkbox:hover { border-color: var(--qbot-business); }
.qbot-checkbox:checked { background: var(--qbot-business); border-color: var(--qbot-business); }
.qbot-checkbox:checked::after { content: ""; position: absolute; left: 5px; top: 2px; width: 4px; height: 8px; border: solid #fff; border-width: 0 2px 2px 0; transform: rotate(45deg); }
.qbot-checkbox:focus-visible { outline: 2px solid color-mix(in srgb, var(--qbot-business) 45%, transparent); outline-offset: 2px; }
.qbot-checkText { min-width: 0; font-size: 13px; line-height: 1.4; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-checkRow:has(.qbot-checkbox:checked) .qbot-checkText { color: var(--qbot-business); font-weight: 600; }
/* 星期过滤：七等分网格，随面板宽度自适应，不再固定像素导致溢出 */
.qbot-weekdayPicker { min-width: 0; display: flex; flex-direction: column; gap: 8px; }
.qbot-weekdayRow { min-width: 0; display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 5px; }
.qbot-weekdayBtn { min-width: 0; height: 32px; padding: 0; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 8px; background: var(--dsw-alias-bg-layer-1, #fff); color: var(--dsw-alias-label-secondary, #646a73); font: inherit; font-size: 13px; cursor: pointer; transition: background .12s ease, color .12s ease, border-color .12s ease; }
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
/* 数字输入 + 单位：单位紧随其后，输入框吃满剩余宽度，
   右边缘与同列的下拉 / 文本域对齐（全表单控件宽度一致） */
.qbot-schedNumber { min-width: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.qbot-schedNumber .qbot-input { flex: 1 1 auto; width: 100%; min-width: 0; max-width: none; }
.qbot-schedUnit { font-size: 12px; color: var(--dsw-alias-label-tertiary, #8f959e); }
/* cron 预览 */
.qbot-schedPreview { min-width: 0; padding: 7px 12px; border: 1px solid color-mix(in srgb, var(--qbot-business) 30%, transparent); border-left: 3px solid var(--qbot-business); border-radius: 8px; background: color-mix(in srgb, var(--qbot-business) 8%, transparent); color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-schedPreview.is-warn { border-color: var(--dsw-alias-state-warn-primary, #d97706); border-left-color: var(--dsw-alias-state-warn-primary, #d97706); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 10%, transparent); }
/* 时区：下拉 + 自定义输入 */
.qbot-schedTz { display: flex; flex-direction: column; gap: 6px; }
.qbot-schedTz .qbot-settingSelect { max-width: 100%; }
/* 表单内控件宽度统一：输入框 / 文本域 / 下拉 / 接收对象选择器一律铺满当前列，
   右边缘互相对齐，宽度随面板变化保持一致。
   写在具体控件规则之后，用于覆盖 .qbot-settingSelect 的全局 260px 上限等问题。 */
.qbot-schedForm .qbot-input,
.qbot-schedForm .qbot-textarea,
.qbot-schedForm .qbot-settingSelect,
.qbot-schedForm .qbot-idPicker,
.qbot-schedForm .qbot-idPicker .qbot-input { width: 100%; min-width: 0; max-width: 100%; box-sizing: border-box; }
/* 命令编辑区 */
.qbot-schedCmd { display: flex; flex-direction: column; gap: 8px; }
.qbot-schedCmd .qbot-textarea { resize: vertical; }
/* ── 定时消息编辑表单：标签 + 控件 + 提示 竖向三行式（步骤内单列堆叠） ── */
.qbot-editForm { min-width: 0; width: 100%; max-width: 100%; box-sizing: border-box; display: flex; flex-direction: column; gap: 14px; padding: 14px 16px 18px; }
/* 定时消息编辑视图：编辑表单放在无边的 modalBody 里，与带边框的列表容器区分。
   overflow-x: hidden 是「不出现横向滚动条」的兜底（overflow-y:auto 会把另一轴隐式变为 auto）。 */
.qbot-modalBody { flex: 1 1 auto; min-width: 0; min-height: 140px; margin: 12px 0 0; overflow: hidden; display: flex; flex-direction: column; }
.qbot-modalBody .qbot-editForm { flex: 1 1 auto; min-width: 0; min-height: 0; overflow-y: auto; overflow-x: hidden; padding: 14px var(--qbot-gutter, 20px) 18px; overscroll-behavior: contain; }
/* 群覆盖弹窗：editForm 直接作为 modalList（overflow:hidden）的子元素，内容超高时自身成为滚动层，
   否则超出部分被裁掉无法查看/编辑（弹窗高度固定 72vh，字段多时必然溢出）。 */
.qbot-modalList > .qbot-editForm { flex: 1 1 auto; min-width: 0; min-height: 0; overflow-y: auto; overflow-x: hidden; overscroll-behavior: contain; }
/* 注：.qbot-editGrid 已在上方「定时编辑表单」块中与 .qbot-schedFieldRow 统一为单列，此处不再重复定义。 */
.qbot-editRow { min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.qbot-editRow > * { min-width: 0; max-width: 100%; }
.qbot-editLabel { min-width: 0; font-size: 13px; font-weight: 600; line-height: 1.45; color: var(--dsw-alias-label-primary, #1f2329); overflow-wrap: anywhere; }
.qbot-editHint { min-width: 0; font-size: 12px; line-height: 1.5; color: var(--dsw-alias-label-tertiary, #8f959e); overflow-wrap: anywhere; }
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

/* ── 详情页：面包屑（只标位置；身份与状态统一由 hero 承载） ────────────── */
.qbot-detailNav { position: sticky; top: 0; z-index: 40; min-width: 0; display: flex; align-items: center; gap: 12px; margin: -2px 0 0; padding: 8px 2px 6px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-detailCrumb { min-width: 0; display: flex; align-items: center; gap: 10px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: normal; }
.qbot-detailCrumbSep { color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-detailCrumb > span:last-child { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-primary, #1f2329); }
/* 平台能力操作结果：贴着面包屑下方吸顶，只有警告 / 操作成功才出现，5 秒自动消失。 */
/* 层级必须高于 sticky 的标题栏(40)与返回栏(40)，否则 top:42px 处会被标题栏压住只露一条边。 */
.qbot-detailToast { position: sticky; top: 68px; z-index: 41; min-width: 0; margin: 4px 0 0; padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 9px; font-size: 12.5px; line-height: 1.55; overflow-wrap: anywhere; cursor: pointer; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 6px 18px rgb(31 35 41 / 14%); }
.qbot-detailToast.is-error { border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 35%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 8%, var(--dsw-alias-bg-layer-1, #fff)); color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-detailToast.is-success { border: 1px solid color-mix(in srgb, var(--qbot-business) 35%, transparent); background: color-mix(in srgb, var(--qbot-business) 8%, var(--dsw-alias-bg-layer-1, #fff)); color: var(--qbot-business); }

/* ── 详情页：概览横幅 ─────────────────────────────────────────────────── */
.qbot-hero { position: relative; overflow: hidden; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 2px rgb(31 35 41 / 3%); }
.qbot-hero::before { content: ""; position: absolute; inset: 0 0 auto; height: 3px; background: linear-gradient(90deg, var(--qbot-blue), color-mix(in srgb, var(--qbot-blue) 25%, transparent)); }
.qbot-heroMain { display: flex; align-items: center; gap: 14px; padding: 20px 20px 14px; }
.qbot-heroAvatar { flex: none; width: 52px; height: 52px; display: grid; place-items: center; border-radius: 16px; color: #fff; background: linear-gradient(140deg, #3d8bff, var(--qbot-blue-dark)); box-shadow: 0 8px 20px rgb(22 119 255 / 22%); }
.qbot-heroAvatar svg { width: 30px; height: 30px; }
.qbot-heroIdentity { min-width: 0; flex: 1 1 auto; display: flex; flex-direction: column; gap: 6px; }
.qbot-heroNameRow { min-width: 0; display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
.qbot-heroNameRow h2 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font: 700 18px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; }
.qbot-chip { flex: none; max-width: 100%; overflow: hidden; text-overflow: ellipsis; padding: 2px 9px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 999px; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f7f8fa); font-size: 11px; font-weight: 600; line-height: 17px; white-space: nowrap; }
.qbot-chip.is-active { border-color: color-mix(in srgb, var(--qbot-business) 32%, transparent); color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 10%, transparent); }
.qbot-heroMeta { display: flex; align-items: center; gap: 8px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 12px; line-height: normal; }
.qbot-metaDot { width: 3px; height: 3px; border-radius: 50%; background: currentColor; opacity: .6; }
/* 状态压成一行 inline，不再用表格状三格；窄容器自动换行。 */
.qbot-heroStatusLine { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 18px; margin: 0 20px 18px; padding: 9px 13px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-heroStatusItem { min-width: 0; display: inline-flex; align-items: center; gap: 7px; font-size: 12px; line-height: normal; }
.qbot-heroStatusItem + .qbot-heroStatusItem { padding-left: 18px; border-left: 1px solid var(--dsw-alias-border-l2, #e5e6eb); }
.qbot-heroStatusLabel { color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-heroStatusItem strong { color: var(--dsw-alias-label-primary, #1f2329); font-weight: 650; font-variant-numeric: tabular-nums; }

/* ── 详情页：分组网格（运行 / 配置 / 管理） ──────────────────────────────
   auto-fit + minmax 按「网格自身可用宽度」决定列数：够 652px 就两列，否则一列，
   不依赖容器查询（避免给祖先加 containment 影响 sticky 面包屑），也不依赖视口宽度。
   分组标题与「已展开」的分区横跨整行——表单行是「说明 + 控件」双列结构，
   半宽下会被挤成窄缝，展开即独占一行也避免把邻卡拉高。 */
.qbot-detailGrid { min-width: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 12px; align-items: stretch; }
/* 详情页横向 Tab：运行 / 配置 / 管理 */
.qbot-detailTabs { display: flex; align-items: stretch; gap: 4px; padding: 3px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-detailTab { flex: 1 1 0; min-width: 0; display: inline-flex; align-items: center; justify-content: center; gap: 7px; height: 34px; padding: 0 10px; border: 0; border-radius: 8px; color: var(--dsw-alias-label-secondary, #646a73); background: transparent; font: inherit; font-size: 13px; font-weight: 600; line-height: normal; white-space: nowrap; cursor: pointer; transition: background .14s ease, color .14s ease, box-shadow .14s ease; }
.qbot-detailTab:hover { color: var(--dsw-alias-label-primary, #1f2329); background: color-mix(in srgb, var(--dsw-alias-bg-layer-1, #fff) 55%, transparent); }
.qbot-detailTab.is-active { color: var(--qbot-blue); background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 1px 3px rgb(31 35 41 / 10%); }
.qbot-detailTabCount { flex: none; min-width: 18px; padding: 1px 6px; border-radius: 999px; color: var(--dsw-alias-label-tertiary, #8f959e); background: color-mix(in srgb, var(--dsw-alias-label-tertiary, #8f959e) 12%, transparent); font-size: 11px; line-height: 16px; text-align: center; font-variant-numeric: tabular-nums; }
.qbot-detailTab.is-active .qbot-detailTabCount { color: var(--qbot-blue); background: color-mix(in srgb, var(--qbot-blue) 12%, transparent); }
/* 所有分区卡（展开 / 折叠）始终占满整行，不再并排缩成半列。 */
.qbot-detailGrid > .qbot-section { grid-column: 1 / -1; align-self: start; }

/* 分区头：彩色图标 + 标题 + 一句说明 + 当前值摘要 chip */
.qbot-sectionIcon { flex: none; width: 28px; height: 28px; display: grid; place-items: center; border-radius: 9px; color: var(--qbot-business, #3370ff); background: color-mix(in srgb, var(--qbot-business, #3370ff) 10%, transparent); font-size: 14px; line-height: 1; }
.qbot-sectionIcon[data-tone="success"] { color: var(--dsw-alias-state-success-primary, #20a162); background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #20a162) 12%, transparent); }
.qbot-sectionIcon[data-tone="warning"] { color: var(--dsw-alias-state-warn-primary, #d97706); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 12%, transparent); }
.qbot-sectionIcon[data-tone="danger"] { color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 12%, transparent); }
.qbot-sectionSummary { align-self: flex-start; max-width: 100%; min-width: 0; margin-top: 5px; padding: 2px 8px; border-radius: 999px; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f7f8fa); font-size: 11px; line-height: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* 快捷入口卡：整卡可点，视觉与折叠卡对齐 */
.qbot-actionCard { width: 100%; min-width: 0; display: flex; align-items: center; gap: 12px; padding: 14px 16px; font: inherit; text-align: left; cursor: pointer; transition: border-color .16s ease, background .16s ease; }
.qbot-actionCard:hover:not(:disabled) { border-color: color-mix(in srgb, var(--qbot-business, #3370ff) 45%, var(--dsw-alias-border-l2, #e5e6eb)); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-actionCard:disabled { cursor: default; opacity: .6; }
.qbot-actionCard .qbot-sectionTitle { flex: 1 1 auto; }
.qbot-actionCardTitle { color: var(--dsw-alias-label-primary, #1f2329); font-size: 15px; line-height: normal; font-weight: 680; }
.qbot-actionCardDesc { color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.5; }
.qbot-actionCard .qbot-sectionChevron { margin-left: 0; font-size: 16px; }

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
.qbot-sectionHead { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 92px; box-sizing: border-box; padding: 14px 16px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-sectionTitle { min-width: 0; flex: 1 1 auto; display: flex; flex-direction: column; gap: 3px; }
.qbot-sectionTitle h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 15px; line-height: normal; font-weight: 680; }
.qbot-sectionTitle p { margin: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.6; }
/* 危险区只靠边框 + 图标辨识，标题保持主色（红字读起来像报错，不是分区） */
.qbot-section.is-danger .qbot-sectionTitle h3 { color: var(--dsw-alias-label-primary, #1f2329); }
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
/* 关于卡：版本 / 作者 / 许可证 / 开源地址 */
.qbot-aboutList { display: flex; flex-direction: column; }
.qbot-aboutRow { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-width: 0; padding: 10px 2px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-aboutRow > span { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; }
.qbot-aboutRow > code, .qbot-aboutRow > strong { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 600; line-height: normal; text-align: right; overflow-wrap: anywhere; }
.qbot-aboutRow > code { font: 13px ui-monospace, SFMono-Regular, Menlo, monospace; }

/* ── 平台能力（设置页管理 Tab：分享链接 / 菜单 / 面板 / 卡片 / 审批 / 群管理） ──
   布局已改为左侧分组导航（见下方 .qbot-ptLayout / .qbot-ptNav*），与频道管理同款。 */
/* 选群入口卡：淡品牌色底 + 左侧步骤标签。 */
.qbot-ptPickCard { min-width: 0; display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; padding: 12px; border: 1px solid color-mix(in srgb, var(--qbot-business) 25%, transparent); border-radius: 11px; background: color-mix(in srgb, var(--qbot-business) 4%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-ptStepTag { align-self: flex-start; padding: 2px 8px; border-radius: 6px; background: color-mix(in srgb, var(--qbot-business) 12%, transparent); color: var(--qbot-business); font-size: 11px; font-weight: 600; }
/* 子标签导航：横向可换行，选中态品牌色下划线。 */
.qbot-ptSubNav { min-width: 0; display: flex; flex-wrap: wrap; gap: 4px; padding: 3px; border-radius: 10px; background: var(--dsw-alias-bg-layer-2, #f7f8fa); }
.qbot-ptSubTab { min-width: 0; padding: 6px 12px; border: 0; border-radius: 8px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); font: inherit; font-size: 12.5px; cursor: pointer; white-space: nowrap; }
.qbot-ptSubTab:hover { background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptSubTab.is-active { background: var(--dsw-alias-bg-layer-1, #fff); color: var(--qbot-business); font-weight: 600; box-shadow: 0 1px 4px rgb(31 35 41 / 8%); }
.qbot-ptSubPane { min-width: 0; }
/* 未选群空态引导。 */
.qbot-ptEmpty { min-width: 0; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 26px 14px; border: 1px dashed var(--dsw-alias-border-l2, #e5e6eb); border-radius: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 12.5px; text-align: center; }
.qbot-ptEmptyIcon { font-size: 18px; color: var(--dsw-alias-label-tertiary, #8f959e); }
/* 操作按钮行：与上方内容分隔，避免挤在一起。 */
.qbot-ptOps { padding-top: 8px; border-top: 1px dashed var(--dsw-alias-border-l1, #eef0f3); }
/* 能力卡片分区：每个能力一块，标题 + 说明 + 内容。 */
.qbot-ptBlock { min-width: 0; display: flex; flex-direction: column; gap: 10px; padding: 12px 14px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 12px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptBlockHead { min-width: 0; display: flex; flex-direction: column; gap: 3px; padding-bottom: 8px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-ptBlockTitle { font-size: 13px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptBlockDesc { font-size: 12px; line-height: 1.5; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-ptRow { min-width: 0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.qbot-ptShareUrl { min-width: 0; flex: 1 1 220px; font-size: 12px; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; }
.qbot-ptFieldLabel { flex: none; font-size: 12px; color: var(--dsw-alias-label-secondary, #646a73); }
/* 图文卡片·被动回复选择区。 */
.qbot-ptReply { min-width: 0; display: flex; flex-direction: column; gap: 7px; padding: 9px 11px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-layer-2, #f7f8fa); }
.qbot-ptReplySelect { width: 100%; }
.qbot-ptTextarea { min-width: 0; width: 100%; box-sizing: border-box; padding: 9px 11px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); color: var(--dsw-alias-label-primary, #1f2329); font: 12px ui-monospace, SFMono-Regular, Menlo, monospace; line-height: 1.55; resize: vertical; }
.qbot-ptTextarea:focus { outline: none; border-color: var(--qbot-business); }
.qbot-ptList { min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.qbot-ptPanelRow { min-width: 0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 7px 10px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptPanelRow > .qbot-mono { font-size: 11.5px; color: var(--dsw-alias-label-tertiary, #8f959e); overflow-wrap: anywhere; }
.qbot-ptPanelRemark { min-width: 0; flex: 1 1 120px; font-size: 12px; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; }
.qbot-ptGrid { min-width: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 8px; }
.qbot-ptField { min-width: 0; display: flex; flex-direction: column; gap: 5px; font-size: 12px; color: var(--dsw-alias-label-secondary, #646a73); }
/* 禁言时长范围：最短 ~ 最长，两个输入框等宽且可被容器压缩。 */
.qbot-ptDurRange { min-width: 0; width: 100%; display: flex; align-items: center; gap: 6px; }
.qbot-ptDurRange > .qbot-settingInput { min-width: 0; flex: 1 1 0; width: 0; box-sizing: border-box; }
.qbot-ptDurSep { flex: none; font-size: 12px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-ptFieldWide { grid-column: 1 / -1; }
.qbot-ptFieldHint { font-size: 11px; line-height: 1.5; color: var(--dsw-alias-label-tertiary, #8f959e); overflow-wrap: anywhere; }
/* Combo 放进纵向 Field 时不能被 flex:1 1 240px 当高度撑高整行。 */
.qbot-ptField > .qbot-ptCombo { flex: 0 0 auto; width: 100%; }
.qbot-ptGroupPick { min-width: 0; flex: 1 1 240px; }
/* ── 群 / openid 可搜索选择器（按钮 + 弹出搜索面板，候选项带来源徽章） ── */
.qbot-ptCombo { position: relative; min-width: 0; flex: 1 1 240px; }
.qbot-ptComboBtn { min-width: 0; width: 100%; height: 32px; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 0 10px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); color: var(--dsw-alias-label-tertiary, #8f959e); font: inherit; font-size: 12.5px; text-align: left; cursor: pointer; }
.qbot-ptComboBtn.is-on { color: var(--dsw-alias-label-primary, #1f2329); border-color: color-mix(in srgb, var(--qbot-business) 40%, var(--dsw-alias-border-l2, #e5e6eb)); }
.qbot-ptComboBtn:hover { border-color: var(--qbot-business); }
.qbot-ptComboBtnText { min-width: 0; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* fixed 定位挂到 body，避开 .qbot-section 的 overflow:hidden 裁切；坐标由 JS 计算（下方不够则翻到上方）。
   z-index 高于弹窗遮罩（9999）、低于全局确认框（10010），保证平台能力弹窗内也能正常展开。 */
.qbot-ptComboPanel { position: fixed; z-index: 10005; overflow: hidden; padding: 6px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 8px 24px rgb(31 35 41 / 12%); display: flex; flex-direction: column; gap: 5px; }
.qbot-ptComboSearch { width: 100%; flex: none; }
.qbot-ptComboList { flex: 1 1 auto; min-height: 0; overflow-y: auto; display: flex; flex-direction: column; gap: 2px; }
.qbot-ptComboItem { min-width: 0; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; padding: 6px 8px; border: 0; border-radius: 7px; background: transparent; color: var(--dsw-alias-label-primary, #1f2329); text-align: left; cursor: pointer; }
.qbot-ptComboItem:hover { background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); }
.qbot-ptComboItem.is-on { background: color-mix(in srgb, var(--qbot-business) 12%, transparent); }
.qbot-ptComboItemLabel { min-width: 0; flex: 1 1 130px; font-size: 12px; overflow-wrap: anywhere; }
.qbot-ptComboSource { flex: none; padding: 1px 6px; border-radius: 6px; font-size: 10.5px; line-height: 1.6; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); }
.qbot-ptComboSource.is-config { color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 10%, transparent); }
.qbot-ptComboItemHint { flex: 1 1 100%; font-size: 10.5px; color: var(--dsw-alias-label-tertiary, #8f959e); overflow-wrap: anywhere; }
.qbot-ptComboEmpty { padding: 8px 9px; font-size: 12px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-ptComboManual { padding: 6px 9px; border: 1px dashed var(--dsw-alias-border-l2, #e5e6eb); border-radius: 7px; background: color-mix(in srgb, var(--qbot-business) 5%, transparent); color: var(--qbot-business); font-size: 11.5px; text-align: left; cursor: pointer; overflow-wrap: anywhere; }
.qbot-ptComboManual:hover { border-color: var(--qbot-business); }
/* ── 平台能力弹窗：头部下方吸顶提示 + 自滚动主体 ── */
.qbot-ptDialogToast { position: static; top: auto; z-index: auto; margin: 0 20px 2px; }
.qbot-ptDialogBody { flex: 1 1 auto; min-width: 0; min-height: 0; overflow: hidden; display: flex; }
.qbot-ptModal { width: min(980px, 100%); height: min(84vh, 800px); }
/* 群聊管理：左侧分组导航（群聊 / 通用两大组），与频道管理同款布局。 */
.qbot-ptLayout { flex: 1 1 auto; min-width: 0; min-height: 0; display: flex; }
.qbot-ptNav { flex: none; width: 168px; display: flex; flex-direction: column; gap: 3px; padding: 14px 10px; border-right: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-module-platform, #f7f8fa); overflow-y: auto; overscroll-behavior: contain; }
.qbot-ptNavGroup { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.qbot-ptNavGroup + .qbot-ptNavGroup { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-ptNavGroupTitle { flex: none; padding: 3px 10px 5px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; font-weight: 650; letter-spacing: 0.4px; }
.qbot-ptNavItem { flex: none; min-width: 0; display: flex; align-items: center; gap: 8px; padding: 8px 10px; border: 1px solid transparent; border-radius: 9px; color: var(--dsw-alias-label-secondary, #646a73); background: transparent; font: inherit; font-size: 12.5px; text-align: left; cursor: pointer; }
.qbot-ptNavItem:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-ptNavItem.is-active { border-color: color-mix(in srgb, var(--qbot-blue, #1677ff) 32%, transparent); background: var(--dsw-alias-bg-layer-1, #fff); color: var(--qbot-blue, #1677ff); font-weight: 650; }
.qbot-ptNavIcon { flex: none; width: 18px; text-align: center; font-size: 14px; }
.qbot-ptContent { flex: 1 1 auto; min-width: 0; min-height: 0; padding: 16px 20px 20px; overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain; }
.qbot-ptDialogFoot { border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
/* ── 权限状态横幅 ── */
.qbot-ptPerm { min-width: 0; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 9px 12px; border-radius: 10px; font-size: 12px; line-height: 1.55; }
.qbot-ptPerm.is-checking { border: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-layer-2, #f7f8fa); color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-ptPerm.is-admin { border: 1px solid color-mix(in srgb, var(--qbot-business) 28%, transparent); background: color-mix(in srgb, var(--qbot-business) 6%, transparent); color: var(--qbot-business); }
.qbot-ptPerm.is-member, .qbot-ptPerm.is-error { border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 28%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 6%, transparent); color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-ptPermBadge { flex: none; padding: 2px 8px; border-radius: 6px; background: color-mix(in srgb, currentColor 12%, transparent); font-weight: 600; font-size: 11px; }
.qbot-ptPermText { min-width: 0; flex: 1 1 200px; overflow-wrap: anywhere; }
.qbot-ptPermRetry { flex: none; }
.qbot-ptPermTip { min-width: 0; padding: 6px 10px; border-left: 3px solid var(--dsw-alias-state-error-primary, #d54941); background: var(--dsw-alias-bg-layer-2, #f7f8fa); color: var(--dsw-alias-state-error-primary, #d54941); font-size: 11.5px; }
.qbot-ptGroupId { min-width: 0; flex: 1 1 200px; font: 11px ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--dsw-alias-label-tertiary, #8f959e); overflow-wrap: anywhere; }
/* ── 群资料栅格 ── */
.qbot-ptInfoGrid { min-width: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: 8px; }
/* 指令面板：列表元信息 / 编辑表单 */
.qbot-ptPanelMeta { min-width: 0; flex: 1 1 100%; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.qbot-ptPanelForm { min-width: 0; display: flex; flex-direction: column; gap: 8px; padding: 10px 11px; border: 1px solid color-mix(in srgb, var(--qbot-business) 25%, transparent); border-radius: 10px; background: color-mix(in srgb, var(--qbot-business) 4%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-ptPanelForm .qbot-settingInput:disabled,
.qbot-ptPanelForm .qbot-ptTextarea:disabled,
.qbot-ptPanelForm .qbot-settingSelect:disabled,
.qbot-ptPanelForm .qbot-checkbox:disabled { opacity: 1; cursor: default; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-layer-2, #f7f8fa); border-color: var(--dsw-alias-border-l1, #eef0f3); }
.qbot-ptPanelHelp { min-width: 0; border: 1px dashed color-mix(in srgb, var(--qbot-business) 40%, transparent); border-radius: 9px; padding: 7px 10px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptPanelHelp > summary { cursor: pointer; font-size: 12px; color: var(--qbot-business); font-weight: 600; }
.qbot-ptPanelHelpCode { margin: 9px 0 2px; padding: 9px 11px; white-space: pre-wrap; overflow-wrap: anywhere; font: 11.5px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-layer-2, #f7f8fa); border-radius: 8px; }
.qbot-ptItemCard { min-width: 0; display: flex; flex-direction: column; gap: 9px; padding: 10px 11px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptItemHead { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
.qbot-ptItemHeadOps { min-width: 0; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.qbot-ptItemNo { font-size: 12px; font-weight: 650; color: var(--dsw-alias-label-secondary, #646a73); }
/* 查看模式的「仅管理员可见」状态徽标：明确显示是/否，勾选态一眼可见。 */
.qbot-ptAdminBadge { font-size: 11.5px; padding: 3px 9px; border-radius: 6px; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-layer-2, #f7f8fa); border: 1px solid var(--dsw-alias-border-l1, #eef0f3); white-space: nowrap; }
.qbot-ptAdminBadge.is-on { color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 10%, transparent); border-color: color-mix(in srgb, var(--qbot-business) 30%, transparent); }
/* 查看模式的命令值纯文本回显 + 无效值提醒。 */
.qbot-ptCmdReadonly { min-height: 32px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 6px 10px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 7px; background: var(--dsw-alias-bg-layer-2, #f7f8fa); font-size: 12px; overflow-wrap: anywhere; }
.qbot-ptCmdWarn { font-size: 11px; color: var(--dsw-alias-state-error-primary, #d54941); }
/* 元素字段两列固定栅格：类型较窄、名称较宽，描述/链接整行。 */
.qbot-ptItemGrid { min-width: 0; display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr); gap: 9px 10px; }
.qbot-ptItemGrid .qbot-ptFieldWide { grid-column: 1 / -1; }
.qbot-ptItemGrid .qbot-ptField > .qbot-settingInput,
.qbot-ptItemGrid .qbot-ptField > .qbot-settingSelect { width: 100%; box-sizing: border-box; }
/* 「删除按钮」改为轻量危险按钮，不抢主操作视觉。 */
.qbot-ptItemDel { min-height: 28px; padding: 0 9px; font-size: 11.5px; color: var(--dsw-alias-state-error-primary, #d54941); border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 28%, var(--dsw-alias-border-l2, #dfe1e5)); background: transparent; }
/* 表单底部操作栏：添加靠左、保存/取消靠右并分开。 */
.qbot-ptPanelActions { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; padding-top: 10px; margin-top: 2px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-ptPanelActionsEnd { margin-left: auto; }
.qbot-ptAddBtn { border-style: dashed; color: var(--qbot-business); }
.qbot-ptSelf { min-width: 0; display: flex; flex-direction: column; gap: 8px; padding-top: 9px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-ptInfoCell { min-width: 0; display: flex; flex-direction: column; gap: 3px; padding: 8px 10px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-layer-2, #f7f8fa); }
.qbot-ptInfoLabel { font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-ptInfoValue { min-width: 0; font-size: 12.5px; color: var(--dsw-alias-label-primary, #1f2329); overflow-wrap: anywhere; }
.qbot-ptTags { display: inline-flex; flex-wrap: wrap; gap: 4px; }
/* ── 成员行 / 搜索 ── */
.qbot-ptSearch { min-width: 0; flex: 1 1 180px; }
.qbot-ptMemberCheck { min-width: 0; flex: 1; display: flex; align-items: center; gap: 8px; cursor: pointer; }
.qbot-ptMemberInfo { flex: none; padding: 2px 8px; font-size: 12px; }
/* ── AI 群规审核：违规类型 + 配置/记录双 tab ───────────────────────────── */
.qbot-ptModCats { min-width: 0; display: flex; flex-wrap: wrap; gap: 6px 12px; }
.qbot-ptModCat { min-width: 0; display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--dsw-alias-label-primary, #1f2329); cursor: pointer; }
.qbot-ptModPane { min-width: 0; display: flex; flex-direction: column; gap: 12px; }
/* 配置 Hero：状态总览卡，开启时用品牌色渐变强调。 */
.qbot-ptModHero { min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap; padding: 15px 17px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 2px 10px rgb(31 35 41 / 4%); }
.qbot-ptModHero.is-on { border-color: color-mix(in srgb, var(--qbot-business) 32%, transparent); background: linear-gradient(120deg, color-mix(in srgb, var(--qbot-business) 9%, var(--dsw-alias-bg-layer-1, #fff)), var(--dsw-alias-bg-layer-1, #fff) 72%); }
.qbot-ptModHeroMain { min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.qbot-ptModHeroTitle { min-width: 0; display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
.qbot-ptModHeroTitle > strong { font-size: 14px; font-weight: 700; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptModHeroIcon { flex: none; width: 28px; height: 28px; display: inline-grid; place-items: center; border-radius: 9px; background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); color: var(--dsw-alias-label-secondary, #646a73); font-size: 15px; font-weight: 700; }
.qbot-ptModHero.is-on .qbot-ptModHeroIcon { background: var(--qbot-business); color: #fff; }
.qbot-ptModHeroDesc { min-width: 0; font-size: 11.5px; line-height: 1.55; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; }
.qbot-ptModHeroSummary { min-width: 0; display: flex; flex-wrap: wrap; gap: 6px; }
.qbot-ptModHeroSummary > span { display: inline-flex; padding: 2px 9px; border-radius: 999px; font-size: 11px; font-weight: 550; color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 9%, transparent); }
.qbot-ptModHeroActions { flex: none; display: flex; align-items: center; gap: 8px; }
/* 分组头：左侧色条 + 主标题 + 副标题，形成清晰的两段层次。 */
.qbot-ptModGroupHead { min-width: 0; display: flex; align-items: stretch; gap: 10px; margin-top: 2px; }
.qbot-ptModGroupBar { flex: none; width: 3px; border-radius: 3px; background: var(--qbot-business); }
.qbot-ptModGroupText { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.qbot-ptModGroupText strong { font-size: 13px; font-weight: 700; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptModGroupText span { font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-ptModGroup { min-width: 0; display: flex; flex-direction: column; gap: 8px; }
/* 表单项：左 label（序号 + 标题 + 说明）+ 右控件区，Element UI 风格两栏布局。
   flex-wrap：宽面板两栏（label 固定 150px），窄面板自动堆叠，无需容器查询名。 */
.qbot-ptModStep { min-width: 0; display: flex; flex-wrap: wrap; align-items: flex-start; gap: 12px; padding: 13px 14px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 11px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptModStepHead { flex: 0 0 150px; min-width: 0; display: flex; align-items: flex-start; gap: 9px; padding-top: 5px; }
.qbot-ptModStepNo { flex: none; width: 20px; height: 20px; display: inline-grid; place-items: center; border-radius: 6px; background: var(--qbot-business); color: #fff; font-size: 11px; font-weight: 700; }
.qbot-ptModStepText { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.qbot-ptModStepText strong { font-size: 12.5px; font-weight: 650; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptModStepText span { font-size: 11px; line-height: 1.5; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; }
.qbot-ptModStepBody { flex: 1 1 280px; min-width: 0; display: flex; flex-direction: column; gap: 9px; }
/* 开关勾选行：整行可点，勾选后高亮。 */
.qbot-ptModCheck { min-width: 0; align-self: flex-start; display: inline-flex; align-items: center; gap: 9px; padding: 7px 12px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); cursor: pointer; transition: border-color .16s ease, background .16s ease; }
.qbot-ptModCheck:hover { border-color: color-mix(in srgb, var(--qbot-business) 45%, var(--dsw-alias-border-l2, #e5e6eb)); }
.qbot-ptModCheck:has(.qbot-checkbox:checked) { border-color: color-mix(in srgb, var(--qbot-business) 45%, transparent); background: color-mix(in srgb, var(--qbot-business) 6%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-ptModCheck > span { font-size: 12.5px; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-ptModCheck:has(.qbot-checkbox:checked) > span { color: var(--qbot-business); font-weight: 600; }
.qbot-ptModStatus { display: inline-flex; align-items: center; gap: 6px; padding: 3px 9px; border-radius: 999px; font-size: 11.5px; font-weight: 600; white-space: nowrap; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); }
.qbot-ptModStatusDot { flex: none; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.qbot-ptModStatus.is-on { color: var(--dsw-alias-state-success-primary, #20a162); background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #20a162) 12%, transparent); }
/* 规则自测：虚线内嵌卡，输入 + 测试按钮一行，判定结果就地展示（不弹 toast）。 */
.qbot-ptModTest { min-width: 0; display: flex; flex-direction: column; gap: 7px; padding: 9px 10px; border: 1px dashed var(--dsw-alias-border-l2, #dee0e3); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptModTestTitle { font-size: 11.5px; font-weight: 650; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-ptModTestRow { min-width: 0; display: flex; align-items: center; gap: 8px; }
.qbot-ptModTestRow .qbot-settingInput { min-width: 0; flex: 1 1 auto; }
.qbot-ptModTestRow .qbot-btn { flex: none; }
.qbot-ptModTestResult { min-width: 0; display: flex; align-items: center; flex-wrap: wrap; gap: 6px; padding: 7px 9px; border-radius: 8px; background: var(--dsw-alias-bg-layer-2, #f7f8fa); }
.qbot-ptModTestResult.is-none { opacity: 0.86; }
.qbot-ptModTestReason { min-width: 0; font-size: 11.5px; color: var(--dsw-alias-label-primary, #1f2329); overflow-wrap: anywhere; }
.qbot-ptModTestChip { flex: none; font-size: 10.5px; color: var(--dsw-alias-label-tertiary, #8f959e); }
/* 叠加惩罚：开启时展开参数卡，关闭时一行说明；预览按前 3 次违规展示效果。 */
.qbot-ptModEsc { min-width: 0; display: flex; flex-direction: column; gap: 8px; padding: 9px 10px; border: 1px dashed var(--dsw-alias-border-l2, #dee0e3); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptModEsc .qbot-ptField > .qbot-settingInput,
.qbot-ptModEsc .qbot-ptField > .qbot-settingSelect { width: 100%; box-sizing: border-box; }
.qbot-ptModEscOff { min-width: 0; padding: 8px 10px; border-radius: 8px; font-size: 11.5px; line-height: 1.5; color: var(--dsw-alias-label-tertiary, #8f959e); background: var(--dsw-alias-bg-layer-2, #f7f8fa); overflow-wrap: anywhere; }
.qbot-ptModEscPreview { min-width: 0; display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; padding: 7px 9px; border-radius: 8px; background: color-mix(in srgb, var(--qbot-business) 8%, transparent); }
.qbot-ptModEscPreview > span { min-width: 0; font-size: 11px; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; }
.qbot-ptModEscPreview > strong { min-width: 0; font-size: 11.5px; font-weight: 650; color: var(--qbot-business); overflow-wrap: anywhere; }
.qbot-ptModSaveBar { display: flex; justify-content: flex-end; margin-top: 2px; padding: 11px 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 11px; background: var(--dsw-alias-bg-layer-2, #f7f8fa); }
/* 概览统计：固定一行四列，紧凑卡片；数字带语义色。 */
.qbot-ptModStats { min-width: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px; }
.qbot-ptModStat { min-width: 0; display: flex; flex-direction: column; gap: 1px; padding: 8px 10px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptModStat strong { font-size: 17px; line-height: 1.15; font-weight: 700; font-variant-numeric: tabular-nums; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptModStat span { font-size: 10.5px; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-ptModStat.is-ok strong { color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-ptModStat.is-esc strong { color: var(--qbot-business); }
.qbot-ptModStat.is-fail strong { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-ptModLogHead { min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.qbot-ptModLogHeadText { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.qbot-ptModLogHeadText strong { font-size: 13px; font-weight: 650; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptModLogHeadText span { font-size: 11.5px; color: var(--dsw-alias-label-secondary, #646a73); }
/* 时间线：左侧圆点 + 连接线，右侧记录卡 */
.qbot-ptModTimeline { min-width: 0; display: flex; flex-direction: column; gap: 0; margin-top: 2px; }
.qbot-ptModRec { min-width: 0; position: relative; display: grid; grid-template-columns: 12px minmax(0, 1fr); gap: 6px; padding-bottom: 6px; }
.qbot-ptModRec::before { content: ""; position: absolute; left: 5px; top: 14px; bottom: -1px; width: 1px; background: var(--dsw-alias-border-l2, #e5e6eb); }
.qbot-ptModRec:last-child { padding-bottom: 0; }
.qbot-ptModRec:last-child::before { display: none; }
.qbot-ptModRecDot { position: relative; z-index: 1; width: 11px; height: 11px; margin-top: 4px; border: 2px solid var(--dsw-alias-bg-layer-1, #fff); border-radius: 50%; background: var(--dsw-alias-label-tertiary, #8f959e); box-shadow: 0 0 0 1px var(--dsw-alias-border-l2, #e5e6eb); }
.qbot-ptModRec.is-light .qbot-ptModRecDot { background: #f59e0b; }
.qbot-ptModRec.is-medium .qbot-ptModRecDot { background: var(--qbot-business); }
.qbot-ptModRec.is-severe .qbot-ptModRecDot { background: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-ptModRecCard { min-width: 0; display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptModRec.is-failed .qbot-ptModRecCard { border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 28%, var(--dsw-alias-border-l1, #eef0f3)); }
.qbot-ptModRecHead { min-width: 0; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.qbot-ptModRecAvatar { flex: none; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; background: linear-gradient(140deg, color-mix(in srgb, var(--qbot-business) 70%, #3d8bff), var(--qbot-business)); color: #fff; font-size: 10px; font-weight: 700; }
.qbot-ptModRecWho { min-width: 0; flex: 1 1 80px; font-size: 12px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2329); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-ptModRecTime { flex: none; font-size: 10.5px; color: var(--dsw-alias-label-tertiary, #8f959e); font-variant-numeric: tabular-nums; }
.qbot-ptModLevel { flex: none; padding: 1px 7px; border-radius: 999px; font-size: 10.5px; font-weight: 600; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); }
.qbot-ptModLevel.is-light { color: #b45309; background: color-mix(in srgb, #f59e0b 16%, transparent); }
.qbot-ptModLevel.is-medium { color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 12%, transparent); }
.qbot-ptModLevel.is-severe { color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 12%, transparent); }
.qbot-ptModRecQuote { min-width: 0; padding: 4px 8px; border-left: 2px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 0 6px 6px 0; background: var(--dsw-alias-bg-layer-2, #f7f8fa); font-size: 11.5px; line-height: 1.45; color: var(--dsw-alias-label-primary, #1f2329); overflow-wrap: anywhere; }
.qbot-ptModRecReason { min-width: 0; display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; font-size: 11px; line-height: 1.45; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; }
.qbot-ptModRecReasonTag { flex: none; font-weight: 600; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-ptModRecChips { min-width: 0; display: flex; flex-wrap: wrap; gap: 4px 5px; }
.qbot-ptModChip { display: inline-flex; align-items: center; padding: 1px 7px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 999px; font-size: 10.5px; font-weight: 550; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-layer-2, #f7f8fa); }
.qbot-ptModChip.is-strike { color: var(--qbot-business); border-color: color-mix(in srgb, var(--qbot-business) 24%, transparent); background: color-mix(in srgb, var(--qbot-business) 8%, transparent); }
.qbot-ptModChip.is-meta { font-weight: 400; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-ptModChip.is-error { color: var(--dsw-alias-state-error-primary, #d54941); border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 24%, transparent); background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 8%, transparent); }
.qbot-ptModRecErr { min-width: 0; padding: 5px 8px; border-radius: 7px; font-size: 10.5px; line-height: 1.45; color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 8%, transparent); overflow-wrap: anywhere; }
.qbot-ptModRecErr.is-warn { color: var(--dsw-alias-state-warn-primary, #d97706); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 9%, transparent); }
.qbot-ptModLogEmpty { min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 7px; padding: 30px 16px; border: 1px dashed var(--dsw-alias-border-l2, #e5e6eb); border-radius: 12px; text-align: center; }
.qbot-ptModLogEmptyIcon { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 14px; color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 10%, transparent); font-size: 22px; }
.qbot-ptModLogEmpty strong { font-size: 13px; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptModLogEmpty span { font-size: 11.5px; color: var(--dsw-alias-label-tertiary, #8f959e); }
/* AI 审核 · 禁言成员：批量操作条 + 成员列表（紧凑卡片）。 */
.qbot-ptMutedOps { min-width: 0; display: flex; flex-direction: column; gap: 9px; padding: 11px 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 11px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptMutedOpsTop { min-width: 0; display: flex; align-items: center; gap: 9px; }
.qbot-ptMutedOpsSpacer { flex: 1 1 auto; min-width: 8px; }
/* 常驻定宽徽标：勾选数量变化时只换文字，不让整行控件左右跳动。 */
.qbot-ptMutedCount { flex: none; width: 92px; padding: 3px 6px; border-radius: 999px; background: var(--dsw-alias-bg-layer-2, #f7f8fa); color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; font-weight: 600; font-variant-numeric: tabular-nums; text-align: center; white-space: nowrap; }
.qbot-ptMutedCount.is-on { color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 10%, transparent); }
.qbot-ptMutedDuration { flex: none; display: inline-flex; align-items: center; gap: 7px; font-size: 11.5px; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-ptMutedDuration .qbot-settingSelect { width: 118px; max-width: none; height: 30px; font-size: 12px; }
.qbot-ptMutedOpsActions { min-width: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; padding-top: 9px; border-top: 1px dashed var(--dsw-alias-border-l1, #eef0f3); }
.qbot-btn.qbot-ptMutedBtn { width: 100%; min-width: 0; min-height: 32px; padding: 0 6px; font-size: 12.5px; }
.qbot-ptMutedCheck { min-width: 0; display: inline-flex; align-items: center; gap: 6px; flex: none; font-size: 12px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2329); cursor: pointer; }
.qbot-ptMutedList { min-width: 0; display: flex; flex-direction: column; gap: 5px; max-height: 340px; overflow-y: auto; padding: 2px; }
.qbot-ptMutedRow { min-width: 0; display: flex; align-items: center; gap: 9px; padding: 8px 10px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); cursor: pointer; transition: border-color .15s ease, background .15s ease; }
.qbot-ptMutedRow:hover { background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); }
.qbot-ptMutedRow.is-on { border-color: color-mix(in srgb, var(--qbot-business) 45%, transparent); background: color-mix(in srgb, var(--qbot-business) 6%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-ptMutedAvatar { flex: none; width: 26px; height: 26px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; background: linear-gradient(140deg, color-mix(in srgb, var(--qbot-business) 70%, #3d8bff), var(--qbot-business)); color: #fff; font-size: 11px; font-weight: 700; }
.qbot-ptMutedWho { min-width: 0; flex: 1 1 90px; font-size: 12.5px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2329); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-ptMutedExpire { flex: none; font-size: 11px; color: var(--dsw-alias-label-secondary, #646a73); font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.qbot-ptModLogEmpty .qbot-btn { margin-top: 4px; }
.qbot-settingInput { height: 32px; padding: 0 10px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); font: inherit; font-size: 12.5px; color: var(--dsw-alias-label-primary, #1f2329); box-sizing: border-box; min-width: 0; }
.qbot-settingInput:focus { outline: none; border-color: var(--qbot-business); }
.qbot-ptReqRow { min-width: 0; display: flex; align-items: center; gap: 10px; padding: 8px 10px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptReqMain { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 3px; }
.qbot-ptReqMain > strong { font-size: 13px; color: var(--dsw-alias-label-primary, #1f2329); overflow-wrap: anywhere; }
.qbot-ptReqMain > .qbot-hint { font-size: 11.5px; }
.qbot-ptReqVerify { font-size: 12px; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; }
.qbot-ptReqRisk { font-size: 11.5px; color: var(--dsw-alias-state-error-primary, #d54941); overflow-wrap: anywhere; }
.qbot-ptReqOps { flex: none; display: flex; gap: 6px; }
/* 入群 AI 自动审批配置卡 */
.qbot-ptJaResult { min-width: 0; display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px; }
.qbot-ptJaR { display: inline-flex; padding: 3px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; }
.qbot-ptJaR.is-ok { color: var(--dsw-alias-state-success-primary, #20a162); background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #20a162) 12%, transparent); }
.qbot-ptJaR.is-keep { color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); }
.qbot-ptJaR.is-fail { color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 10%, transparent); }
.qbot-ptJaAutoState { min-width: 0; display: inline-flex; align-items: center; gap: 8px; padding: 7px 11px; border-radius: 9px; font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-ptJaAutoState.is-on { color: var(--dsw-alias-state-success-primary, #20a162); background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #20a162) 10%, transparent); border: 1px solid color-mix(in srgb, var(--dsw-alias-state-success-primary, #20a162) 24%, transparent); }
.qbot-ptJaAutoState.is-off { color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f7f8fa); border: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-ptJaAutoDot { flex: none; width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.qbot-ptJaEnableCheck { min-width: 0; display: flex; align-items: center; gap: 9px; padding: 9px 11px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); cursor: pointer; }
.qbot-ptJaEnableCheck.is-on { border-color: color-mix(in srgb, var(--qbot-business) 45%, transparent); background: color-mix(in srgb, var(--qbot-business) 6%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-ptJaEnableText { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.qbot-ptJaEnableText strong { font-size: 12.5px; font-weight: 650; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptJaEnableText span { font-size: 11px; line-height: 1.5; color: var(--dsw-alias-label-tertiary, #8f959e); overflow-wrap: anywhere; }
/* 空介绍处理：两张并列选项卡，选中态有边框/底色/勾选标记，形成层次。 */
.qbot-ptJaEmptyOpts { min-width: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.qbot-btn.qbot-ptJaEmptyOpt { width: 100%; min-width: 0; height: auto; min-height: 62px; display: flex; align-items: flex-start; gap: 9px; padding: 10px; text-align: left; white-space: normal; border-radius: 10px; }
.qbot-ptJaEmptyOpt:hover:not(:disabled) { border-color: color-mix(in srgb, var(--qbot-business) 38%, var(--dsw-alias-border-l2, #dfe1e5)); }
.qbot-ptJaEmptyOpt.is-on { border-color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 8%, var(--dsw-alias-bg-layer-1, #fff)); box-shadow: 0 0 0 2px color-mix(in srgb, var(--qbot-business) 12%, transparent); }
.qbot-ptJaEmptyIcon { flex: none; width: 26px; height: 26px; display: grid; place-items: center; border-radius: 8px; background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); color: var(--dsw-alias-label-secondary, #646a73); font-size: 13px; }
.qbot-ptJaEmptyOpt.is-on .qbot-ptJaEmptyIcon { background: var(--qbot-business); color: #fff; }
.qbot-ptJaEmptyText { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 3px; }
.qbot-ptJaEmptyText strong { font-size: 12px; font-weight: 650; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptJaEmptyText span { font-size: 11px; line-height: 1.5; color: var(--dsw-alias-label-tertiary, #8f959e); overflow-wrap: anywhere; }
.qbot-ptJaEmptyCheck { flex: none; width: 16px; height: 16px; display: grid; place-items: center; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 50%; color: transparent; font-size: 10px; }
.qbot-ptJaEmptyOpt.is-on .qbot-ptJaEmptyCheck { border-color: var(--qbot-business); background: var(--qbot-business); color: #fff; }
/* 审批记录：统计条 + 卡片列表（申请人 / 结果 / 判定理由 / 申请理由）。 */
.qbot-ptJaRecordList { min-width: 0; display: flex; flex-direction: column; gap: 8px; }
.qbot-ptJaRecord { min-width: 0; display: flex; flex-direction: column; gap: 7px; padding: 11px 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-left: 3px solid var(--dsw-alias-label-tertiary, #8f959e); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ptJaRecord.is-pass { border-left-color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-ptJaRecord.is-keep { border-left-color: #d97706; }
.qbot-ptJaRecord.is-decline, .qbot-ptJaRecord.is-error { border-left-color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-ptJaRecordHead { min-width: 0; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.qbot-ptJaRecordAvatar { flex: none; width: 24px; height: 24px; display: grid; place-items: center; border-radius: 7px; background: color-mix(in srgb, var(--qbot-business) 14%, transparent); color: var(--qbot-business); font-size: 11px; font-weight: 700; }
.qbot-ptJaRecordWho { min-width: 0; flex: 1 1 90px; font-size: 12.5px; font-weight: 650; color: var(--dsw-alias-label-primary, #1f2329); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-ptJaRecordAct { flex: none; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); }
.qbot-ptJaRecordAct.is-pass { color: var(--dsw-alias-state-success-primary, #20a162); background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #20a162) 12%, transparent); }
.qbot-ptJaRecordAct.is-keep { color: #d97706; background: color-mix(in srgb, #d97706 12%, transparent); }
.qbot-ptJaRecordAct.is-decline, .qbot-ptJaRecordAct.is-error { color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 10%, transparent); }
.qbot-ptJaRecordTime { flex: none; font-size: 11px; color: var(--dsw-alias-label-tertiary, #8f959e); font-variant-numeric: tabular-nums; }
.qbot-ptJaRecordRow { min-width: 0; display: flex; align-items: flex-start; gap: 8px; font-size: 11.5px; line-height: 1.55; }
.qbot-ptJaRecordLabel { flex: none; min-width: 52px; color: var(--dsw-alias-label-tertiary, #8f959e); font-weight: 600; }
.qbot-ptJaRecordValue, .qbot-ptJaRecordIntro { min-width: 0; flex: 1; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; }
.qbot-ptJaRecordIntro { padding: 6px 9px; border-radius: 7px; background: var(--dsw-alias-bg-layer-2, #f7f8fa); color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-ptJaRecordErr { font-size: 11px; color: var(--dsw-alias-state-error-primary, #d54941); overflow-wrap: anywhere; }
.qbot-ptMembers { min-width: 0; display: flex; flex-direction: column; gap: 4px; max-height: 280px; overflow-y: auto; padding: 2px; }
.qbot-ptMemberRow { min-width: 0; display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 8px; cursor: pointer; }
.qbot-ptMemberRow:hover { background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); }
.qbot-ptMemberName { min-width: 0; flex: 1; font-size: 12.5px; color: var(--dsw-alias-label-primary, #1f2329); overflow-wrap: anywhere; }
.qbot-aboutLink { min-width: 0; color: var(--qbot-blue, #1677ff); font-size: 11.5px; font-weight: 500; line-height: 1.5; text-decoration: none; overflow-wrap: anywhere; }
.qbot-aboutLink:hover { text-decoration: underline; }
.qbot-aboutFoot { padding: 10px 2px 0; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; line-height: 1.7; text-align: center; }

/* 文本输入设置行（textarea）：说明在上、输入框通栏在下，长文本不再被窄框截断 */
.qbot-settingRow.is-wide { grid-template-columns: minmax(0, 1fr); }
.qbot-settingControl.is-wide { width: 100%; min-width: 0; justify-content: stretch; }
.qbot-settingControl.is-wide > .qbot-textarea { width: 100%; }
.qbot-textarea { display: block; width: 100%; min-width: 0; min-height: 56px; max-height: 240px; padding: 8px 11px; border: 1px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; outline: none; resize: vertical; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: inherit; font-size: 13px; line-height: 1.6; transition: border-color .16s ease, box-shadow .16s ease; }
.qbot-textarea:focus { border-color: #4e5969; box-shadow: 0 0 0 3px rgb(78 89 105 / 10%); }
.qbot-textarea::placeholder { color: var(--dsw-alias-label-tertiary, #8f959e); font-family: inherit; }

/* ── 按群覆盖弹窗：分组卡片 + 两列字段网格 ──────────────────────────────
   旧版是「标签 / 控件 / 说明」单列竖排、控件固定 260px，右半边全空且纵向过长。
   现在按语义分 4 组浅底卡片，组内两列（窄屏一列）通栏控件，标签与说明都收短。 */
.qbot-ovModal { height: auto; max-height: min(86vh, 800px); }
.qbot-ovModal .qbot-modalHead { padding-bottom: 10px; }
.qbot-ovModal .qbot-modalList { border: 0; border-radius: 0; margin: 0; background: transparent; }
.qbot-ovForm { flex: 1 1 auto; min-width: 0; min-height: 0; display: flex; flex-direction: column; gap: 12px; padding: 2px 20px 16px; overflow-y: auto; overscroll-behavior: contain; }
.qbot-ovGroup { min-width: 0; display: flex; flex-direction: column; gap: 11px; padding: 13px 15px 15px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 12px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-ovGroupHead { display: flex; align-items: center; gap: 7px; }
/* 组名前的品牌色短条：比圆点更「栏目感」，也不抢占视线 */
.qbot-ovGroupDot { flex: none; width: 14px; height: 3px; border-radius: 2px; background: var(--qbot-blue); }
.qbot-ovGroupHead h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; line-height: 1.4; font-weight: 700; letter-spacing: .02em; }
.qbot-ovGrid { min-width: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 12px 16px; align-items: start; }
.qbot-ovField { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
.qbot-ovField.is-wide { grid-column: 1 / -1; }
.qbot-ovLabel { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; line-height: 1.5; font-weight: 600; }
/* 控件通栏：不再受 .qbot-settingSelect 的 260px 上限，列多宽就多宽 */
.qbot-ovField .qbot-settingSelect { width: 100%; max-width: none; height: 34px; }
.qbot-ovField .qbot-input { height: 34px; }
.qbot-ovHint { min-width: 0; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11.5px; line-height: 1.6; overflow-wrap: anywhere; }
.qbot-ovForm .qbot-textarea { min-height: 52px; background: var(--dsw-alias-bg-layer-1, #fff); }
/* 编辑已有群时 openid 只读：弱化文字但保持可选中复制 */
.qbot-ovModal .qbot-input:read-only { color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-ovModal .qbot-modalFoot { border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }

/* ── 详情页：工作区卡片 ───────────────────────────────────────────────── */
.qbot-workspaceCard { min-width: 0; display: flex; flex-direction: column; gap: 9px; padding: 13px 14px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-workspaceCardHead { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; column-gap: 16px; row-gap: 8px; }
.qbot-workspacePath { min-width: 0; display: block; padding: 8px 11px; border: 1px dashed var(--dsw-alias-border-l2, #dfe1e5); border-radius: 8px; color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-bg-layer-1, #fff); font: 12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; }

/* ── 详情页：运行统计指标卡 ───────────────────────────────────────────── */
.qbot-metricGrid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.qbot-metric { min-width: 0; min-height: 96px; display: flex; flex-direction: column; gap: 6px; padding: 11px 13px 10px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-left: 3px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 11px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-metric[data-tone="success"] { border-left-color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-metric[data-tone="warning"] { border-left-color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-metric[data-tone="error"] { border-left-color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-metricTop { display: flex; align-items: center; gap: 7px; min-width: 0; }
.qbot-metricIcon { flex: none; width: 18px; height: 18px; display: grid; place-items: center; border-radius: 5px; background: var(--dsw-alias-bg-layer-1, #fff); color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; line-height: 1; }
.qbot-metric[data-tone="success"] .qbot-metricIcon { color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-metric[data-tone="warning"] .qbot-metricIcon { color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-metric[data-tone="error"] .qbot-metricIcon { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-metricLabel { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 11px; line-height: normal; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.qbot-metricValue { color: var(--dsw-alias-label-primary, #1f2329); font-size: 21px; line-height: 1.15; font-weight: 700; font-variant-numeric: tabular-nums; }
.qbot-metricSub { min-height: 13px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; line-height: 1.2; }
.qbot-metric[data-tone="error"] .qbot-metricValue { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-metric[data-tone="warning"] .qbot-metricValue { color: var(--dsw-alias-state-warn-primary, #d97706); }

/* ── openid 可搜索下拉（归档会话候选）────────────────────────────────── */
.qbot-idPicker { position: relative; min-width: 0; }
.qbot-idPickerMenu { position: absolute; z-index: 30; top: calc(100% + 4px); left: 0; right: 0; max-height: 240px; overflow-y: auto; padding: 4px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 8px 24px rgb(31 35 41 / 12%); }
.qbot-idPickerItem { width: 100%; display: flex; flex-direction: column; gap: 2px; padding: 6px 8px; border: 0; border-radius: 8px; background: transparent; font: inherit; text-align: left; cursor: pointer; }
.qbot-idPickerItem:hover { background: var(--dsw-alias-bg-module-platform, #f2f3f5); }
.qbot-idPickerItem.is-current { background: color-mix(in srgb, var(--qbot-blue, #1677ff) 10%, transparent); }
.qbot-idPickerHead { min-width: 0; display: flex; align-items: center; gap: 6px; }
.qbot-idPickerName { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dsw-alias-label-primary, #1f2329); font-size: 12px; font-weight: 600; line-height: 1.4; }
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
  .qbot-detailGrid { grid-template-columns: minmax(0, 1fr); }
  .qbot-heroStatusItem + .qbot-heroStatusItem { padding-left: 0; border-left: 0; }
  .qbot-heroMain { flex-wrap: wrap; }
  .qbot-sectionHead { flex-wrap: wrap; align-items: flex-start; }
  .qbot-settingRow, .qbot-workspaceCardHead { grid-template-columns: minmax(0, 1fr); }
  .qbot-settingControl { justify-content: flex-start; min-width: 0; }
  .qbot-settingSelect { max-width: none; }
}
@media (pointer: coarse) {
  .qbot-segTabs button, .qbot-switchRow { min-height: 44px; }
}

/* ── 定时任务「查看」：执行逻辑流程图 ── */
.qbot-schedDetail { display: flex; flex-direction: column; height: 100%; min-height: 0; box-sizing: border-box; }
.qbot-schedDetailHead { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); flex: none; }
.qbot-schedDetailHead h3 { margin: 0; font-size: 15px; font-weight: 680; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-schedDetailHead p { margin: 2px 0 0; font-size: 12px; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-schedDetailBody { flex: 1 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 16px 14px 20px; }
.qbot-flow { display: flex; flex-direction: column; align-items: stretch; }
.qbot-flowNode { position: relative; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-left: 3px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); padding: 10px 12px; }
.qbot-flowNode--trigger { border-left-color: var(--qbot-business, #3370ff); }
.qbot-flowNode--action { border-left-color: var(--qbot-business, #3370ff); }
.qbot-flowNode--deliver { border-left-color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-flowTitle { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 650; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-flowBadge { flex: none; display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 999px; font-size: 10px; font-weight: 700; color: #fff; background: var(--qbot-business, #3370ff); }
.qbot-flowDetail { margin-top: 6px; font-size: 12px; line-height: 1.6; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; white-space: pre-wrap; }
.qbot-flowDetail .qbot-mono, .qbot-flowDetail code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
.qbot-flowConn { width: 2px; height: 16px; margin: 0 auto; background: var(--dsw-alias-border-l2, #dfe1e5); position: relative; }
.qbot-flowConn::after { content: ""; position: absolute; left: 50%; bottom: -1px; transform: translateX(-50%); border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid var(--dsw-alias-border-l2, #dfe1e5); }
.qbot-flowDecision { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border: 1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 40%, transparent); border-radius: 10px; background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 8%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-flowQ { flex: none; width: 20px; height: 20px; display: grid; place-items: center; border-radius: 50%; color: var(--dsw-alias-state-warn-primary, #d97706); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 16%, transparent); font-weight: 700; font-size: 12px; }
.qbot-flowDecisionBody { min-width: 0; flex: 1 1 auto; }
.qbot-flowDecisionQ { font-size: 12.5px; font-weight: 600; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-flowAnswer { display: inline-flex; align-items: center; margin-top: 4px; padding: 1px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; color: var(--dsw-alias-state-success-primary, #20a162); background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #20a162) 12%, transparent); }
.qbot-flowAnswer.is-no { color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 12%, transparent); }
.qbot-flowAnswer.is-warn { color: var(--dsw-alias-state-warn-primary, #d97706); background: color-mix(in srgb, var(--dsw-alias-state-warn-primary, #d97706) 12%, transparent); }

/* ── 宽度自适应（容器查询）─────────────────────────────────────────────────
   右侧面板宽度由用户拖拽决定，视口级 @media 不会随面板变化而触发，
   因此改用容器查询，按「实际可用宽度」响应：
     · qbotpanel  —— 由面板根节点 .qbot-schedPanel 声明，负责面板级留白与字号收敛；
     · schedgroup —— 由分组容器 .qbot-schedGroup 声明，负责单张任务卡内部是并排还是堆叠。
   设置页弹窗（.qbot-modal，固定宽度）未声明容器，保持基础流体布局，
   改用 --qbot-gutter 统一水平留白，因此两种载体下表单与列表的外边缘都对齐。 */
.qbot-schedPanel { container-type: inline-size; container-name: qbotpanel; width: 100%; min-width: 0; }
/* 右侧面板 tab chip 的 QQ 机器人图标：跟随品牌色（已在 :root 定义），深浅色自适应 */
.qbot-panelMark { flex: none; color: var(--qbot-business, #3370ff); }

/* 面板收窄：间距同步收敛，工具条与主操作整行铺满 */
@container qbotpanel (max-width: 460px) {
  .qbot-schedRoot { --qbot-gutter: 10px; }
  .qbot-schedToolbar { padding: 9px 10px; }
  .qbot-fieldInline { flex: 1 1 100%; }
  .qbot-schedToolbar .qbot-settingSelect { flex: 1 1 auto; max-width: none; }
  .qbot-schedRefresh { flex: 1 1 auto; }
  .qbot-schedTabs { padding: 8px 10px 6px; }
  .qbot-schedAdd { flex: 1 1 100%; margin-left: 0; }
  .qbot-schedSection { padding: 12px 10px; border-radius: 10px; }
  .qbot-schedGroup { padding-left: 6px; padding-right: 6px; }
  .qbot-schedMeta { gap: 6px 10px; }
  .qbot-schedDetailHead { flex-wrap: wrap; }
  .qbot-schedDetailBody { padding: 12px 10px 16px; }
  .qbot-flowNode, .qbot-flowDecision { padding: 8px 10px; }
  .qbot-schedPresets { gap: 5px; }
  .qbot-ptMutedOpsTop { flex-wrap: wrap; }
  .qbot-ptMutedOpsSpacer { display: none; }
  .qbot-ptJaEmptyOpts { grid-template-columns: minmax(0, 1fr); }
}
@container qbotpanel (max-width: 320px) {
  .qbot-schedSectionDesc { font-size: 11.5px; }
  .qbot-schedOps { gap: 5px; }
  .qbot-schedOps .qbot-btn { padding: 3px 9px; }
  .qbot-schedMeta { font-size: 11px; }
  .qbot-chip { padding: 1px 7px; font-size: 10.5px; }
}

/* 面板拉宽：内距与行距同步放大，避免卡片被拉长后内边距反而显得局促。
   表单字段不限宽（max-width:100%）——面板多宽字段就铺多宽，与列表容器左右对齐；
   仅流程图保留 720px 上限（流程图是节点串联，超宽后连线过长反而难读）。
   列表保持单列——任务卡是「内容 + 操作」结构，多列会把操作列压回窄缝。 */
@container qbotpanel (min-width: 640px) {
  .qbot-editRow { max-width: 100%; }
  .qbot-flow { max-width: 720px; }
  .qbot-schedGroup { padding: 10px 14px 6px; }
  .qbot-schedRow { padding: 12px 14px; gap: 14px; }
  .qbot-schedMeta { gap: 6px 14px; }
  .qbot-schedSection { padding: 16px clamp(14px, 3%, 18px); }
  .qbot-schedSectionBody { gap: 16px; }
}
@container qbotpanel (min-width: 900px) {
  .qbot-editRow { max-width: 100%; }
}

/* 任务卡自身宽度：正文与操作列并排约需 560px，低于此值改为上下堆叠，
   避免正文被 5 个操作按钮挤成一条窄缝。
   放在面板级查询之后，两种条件同时命中时以「堆叠」为准（更安全的形态）。 */
@container schedgroup (max-width: 560px) {
  .qbot-schedRow { flex-direction: column; align-items: stretch; gap: 8px; }
  .qbot-schedOps { width: 100%; margin-left: 0; justify-content: flex-start; align-self: auto; }
}

/* ── 配置清单（JSON 编辑器弹窗）────────────────────────────────────────── */
.qbot-cmModal { position: relative; width: min(1080px, 100%); height: min(86vh, 820px); }
.qbot-cmBody { flex: 1 1 auto; min-width: 0; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) minmax(280px, 34%); gap: 14px; padding: 0 clamp(10px, 2.4%, 20px) 4px; }
.qbot-cmEditorPane, .qbot-cmHelpPane { min-width: 0; min-height: 0; display: flex; flex-direction: column; }
.qbot-cmPaneHead { flex: none; display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 28px; }
.qbot-cmPaneHead strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 700; }
.qbot-cmStatus { font-size: 11.5px; font-weight: 600; padding: 2px 9px; border-radius: 999px; white-space: nowrap; }
.qbot-cmStatus.is-ok { color: var(--dsw-alias-state-success-primary, #2ea121); background: color-mix(in srgb, var(--dsw-alias-state-success-primary, #2ea121) 12%, transparent); }
.qbot-cmStatus.is-error { color: var(--dsw-alias-state-error-primary, #d54941); background: var(--dsw-alias-state-error-bg, #fee9e7); }
.qbot-cmHelpCount { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11.5px; }

/* 编辑器：行号槽 + 等宽文本域，二者行高严格一致（20px）。 */
.qbot-cmCodeWrap { flex: 1 1 auto; min-height: 160px; display: flex; margin-top: 8px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 10px; overflow: hidden; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-cmGutter { flex: none; width: 46px; padding: 10px 8px 10px 0; overflow: hidden; text-align: right; background: var(--dsw-alias-bg-module-platform, #f7f8fa); border-right: 1px solid var(--dsw-alias-border-l1, #eef0f3); user-select: none; }
.qbot-cmGutter div { height: 20px; line-height: 20px; font: 12px/20px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; color: var(--dsw-alias-label-tertiary, #8f959e); }
.qbot-cmGutter div.is-err { color: var(--dsw-alias-state-error-primary, #d54941); font-weight: 700; }
.qbot-cmCode { flex: 1 1 auto; min-width: 0; min-height: 0; resize: none; border: 0; outline: 0; padding: 10px 12px; background: transparent; color: var(--dsw-alias-label-primary, #1f2329); font: 12px/20px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; tab-size: 2; white-space: pre; overflow: auto; }
.qbot-cmCode:focus { outline: 0; }

/* 校验结果列表：贴着编辑器下方，最多 4 行高度，超出滚动。 */
.qbot-cmIssues { flex: none; max-height: 104px; margin-top: 8px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; padding-right: 2px; }
.qbot-cmIssues.is-empty { max-height: none; color: var(--dsw-alias-state-success-primary, #2ea121); font-size: 12px; padding: 4px 2px; }
.qbot-cmIssue { flex: none; display: flex; align-items: baseline; gap: 8px; width: 100%; text-align: left; padding: 5px 9px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 7px; background: var(--dsw-alias-state-error-bg, #fee9e7); cursor: pointer; }
.qbot-cmIssue:hover { border-color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-cmIssuePath { flex: none; max-width: 45%; color: var(--dsw-alias-state-error-primary, #d54941); font: 11.5px/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-cmIssueMsg { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 11.5px; line-height: 1.5; overflow-wrap: anywhere; }

/* 右侧帮助面板：搜索框 + 可折叠分组。 */
.qbot-cmSearch { flex: none; width: 100%; height: 32px; margin-top: 8px; }
.qbot-cmHelpScroll { flex: 1 1 auto; min-height: 0; margin-top: 8px; overflow-y: auto; overscroll-behavior: contain; padding-right: 4px; display: flex; flex-direction: column; gap: 8px; }
/* flex:none 是关键：若允许收缩，分组卡会被压扁且滚动容器永远不出现滚动条。 */
.qbot-cmHelpGroup { flex: none; min-width: 0; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); overflow: hidden; }
.qbot-cmHelpGroupHead { display: flex; align-items: center; gap: 7px; width: 100%; padding: 8px 10px; border: 0; background: transparent; cursor: pointer; text-align: left; }
.qbot-cmHelpGroupHead strong { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; font-weight: 700; }
.qbot-cmHelpChevron { flex: none; color: var(--qbot-blue); font-size: 12px; }
.qbot-cmHelpGroupCount { margin-left: auto; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; }
.qbot-cmHelpGroupDesc { margin: 0 10px 4px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; line-height: 1.5; }
.qbot-cmHelpFields { display: flex; flex-direction: column; gap: 1px; padding: 0 6px 6px; }
.qbot-cmHelpField { flex: none; min-width: 0; padding: 7px 8px; border-radius: 6px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-cmHelpFieldTop { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.qbot-cmHelpKey { min-width: 0; color: var(--qbot-blue); font: 600 11.5px/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-cmHelpType { flex: none; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f7f8fa); border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 4px; padding: 0 5px; font: 10.5px/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
.qbot-cmHelpText { margin: 4px 0 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 11.5px; line-height: 1.6; overflow-wrap: anywhere; }
/* 字段帮助：限制 / 示例 / 配错后果，逐行对齐，标签定宽不抖动。 */
.qbot-cmHelpLine { display: flex; align-items: baseline; gap: 6px; margin-top: 5px; min-width: 0; }
.qbot-cmHelpTag { flex: none; padding: 1px 6px; border-radius: 4px; font-size: 10.5px; line-height: 1.6; font-weight: 600; white-space: nowrap; }
.qbot-cmHelpTagRange { color: var(--qbot-blue); background: color-mix(in srgb, var(--qbot-blue) 10%, transparent); }
.qbot-cmHelpTagExample { color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-cmHelpValue { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font: 11px/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; overflow-wrap: anywhere; }
.qbot-cmHelpNote { display: flex; align-items: baseline; gap: 6px; margin-top: 5px; min-width: 0; }
.qbot-cmHelpNoteTag { flex: none; padding: 1px 6px; border-radius: 4px; color: var(--dsw-alias-state-warning-primary, #d98c00); background: color-mix(in srgb, var(--dsw-alias-state-warning-primary, #ffb400) 12%, transparent); font-size: 10.5px; line-height: 1.6; font-weight: 600; white-space: nowrap; }
.qbot-cmHelpNoteText { min-width: 0; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; line-height: 1.6; overflow-wrap: anywhere; }

.qbot-cmFoot { border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-cmFootLeft { flex: 1 1 auto; min-width: 0; }
.qbot-footOk { margin: 0; color: var(--dsw-alias-state-success-primary, #2ea121); font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; }
.qbot-cmLoadErr { position: absolute; inset: 0; z-index: 2; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 24px; text-align: center; color: var(--dsw-alias-state-error-primary, #d54941); background: var(--dsw-alias-bg-layer-1, #fff); font-size: 13px; }
.qbot-cmLoadErr p { margin: 0; overflow-wrap: anywhere; }

/* 窄屏：帮助面板移到编辑器下方，各占约一半高度。 */
@media (max-width: 780px) {
  .qbot-cmBody { grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(200px, 1fr) minmax(180px, 1fr); }
}

/* ── 频道管理弹窗：与平台能力同一外壳，内部竖向 Tab ─────────────────── */
.qbot-sectionIcon[data-tone="info"] { color: var(--qbot-blue, #1677ff); background: color-mix(in srgb, var(--qbot-blue, #1677ff) 12%, transparent); }
.qbot-gvModal { width: min(980px, 100%); height: min(84vh, 800px); }
.qbot-gvBody { flex: 1 1 auto; min-width: 0; min-height: 0; overflow: hidden; display: flex; }
.qbot-gvLayout { flex: 1 1 auto; min-width: 0; min-height: 0; display: flex; }
.qbot-gvNav { flex: none; width: 150px; display: flex; flex-direction: column; gap: 4px; padding: 14px 10px; border-right: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-module-platform, #f7f8fa); overflow-y: auto; overscroll-behavior: contain; }
.qbot-gvNavItem { flex: none; min-width: 0; display: flex; align-items: center; gap: 8px; padding: 9px 10px; border: 1px solid transparent; border-radius: 9px; color: var(--dsw-alias-label-secondary, #646a73); background: transparent; font: inherit; font-size: 12.5px; text-align: left; cursor: pointer; }
.qbot-gvNavItem:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-gvNavItem.is-active { border-color: color-mix(in srgb, var(--qbot-blue, #1677ff) 32%, transparent); background: var(--dsw-alias-bg-layer-1, #fff); color: var(--qbot-blue, #1677ff); font-weight: 650; }
.qbot-gvNavIcon { flex: none; width: 18px; text-align: center; font-size: 14px; }
.qbot-gvContent { flex: 1 1 auto; min-width: 0; min-height: 0; padding: 16px 20px 20px; overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain; }
.qbot-gvScope { position: sticky; top: -16px; z-index: 3; display: flex; align-items: center; gap: 8px; min-width: 0; margin: -16px -20px 16px; padding: 9px 20px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-gvScopeDot { flex: none; width: 7px; height: 7px; border-radius: 50%; background: var(--qbot-blue, #1677ff); }
.qbot-gvScopeName { min-width: 0; max-width: 220px; font-size: 12.5px; font-weight: 650; color: var(--dsw-alias-label-primary, #1f2329); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-gvScopeId { min-width: 0; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; overflow-wrap: anywhere; }
.qbot-gvPane { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.qbot-gvPaneHead strong { display: block; color: var(--dsw-alias-label-primary, #1f2329); font-size: 14px; font-weight: 650; }
.qbot-gvPaneHead p { margin: 4px 0 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; }
.qbot-gvPaneActions { display: flex; align-items: center; gap: 10px; min-width: 0; flex-wrap: wrap; }
.qbot-gvCount { flex: 1 1 auto; min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; font-variant-numeric: tabular-nums; }
.qbot-gvSearch { flex: 1 1 220px; min-width: 0; max-width: 320px; }
.qbot-gvGuildGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 230px), 1fr)); gap: 10px; }
.qbot-gvGuildCard { min-width: 0; display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 11px; background: var(--dsw-alias-bg-layer-1, #fff); text-align: left; cursor: pointer; transition: border-color .16s ease, background .16s ease; }
.qbot-gvGuildCard:hover { border-color: color-mix(in srgb, var(--qbot-blue, #1677ff) 45%, var(--dsw-alias-border-l2, #e5e6eb)); }
.qbot-gvGuildCard.is-on { border-color: var(--qbot-blue, #1677ff); background: color-mix(in srgb, var(--qbot-blue, #1677ff) 6%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-gvGuildAvatar { flex: none; width: 36px; height: 36px; display: grid; place-items: center; border-radius: 9px; background: color-mix(in srgb, var(--qbot-blue, #1677ff) 14%, transparent); color: var(--qbot-blue, #1677ff); font-size: 15px; font-weight: 700; }
.qbot-gvGuildMain { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.qbot-gvGuildMain strong { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.qbot-gvGuildMain small { color: var(--dsw-alias-label-secondary, #646a73); font-size: 11px; }
.qbot-gvBadge { flex: none; padding: 2px 7px; border-radius: 999px; background: color-mix(in srgb, var(--qbot-blue, #1677ff) 12%, transparent); color: var(--qbot-blue, #1677ff); font-size: 10.5px; }
.qbot-gvEmpty { padding: 22px 12px; border: 1px dashed var(--dsw-alias-border-l2, #e5e6eb); border-radius: 10px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12.5px; line-height: 1.6; text-align: center; overflow-wrap: anywhere; }
/* 频道列表顶部引导：到开发者中心开启公开服务 / 扫码加入频道 */
.qbot-gvSetup { min-width: 0; display: flex; flex-direction: column; gap: 7px; padding: 12px 14px; border: 1px solid color-mix(in srgb, var(--qbot-blue, #1677ff) 26%, transparent); border-radius: 10px; background: color-mix(in srgb, var(--qbot-blue, #1677ff) 6%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-gvSetupHead { display: flex; align-items: center; gap: 7px; }
.qbot-gvSetupIcon { flex: none; color: var(--qbot-blue, #1677ff); font-size: 14px; line-height: 1; }
.qbot-gvSetupHead strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; }
.qbot-gvSetupSteps { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 4px; }
.qbot-gvSetupSteps li { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; }
.qbot-gvSetupFoot { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px 12px; }
.qbot-gvSetupFoot > span { min-width: 0; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; line-height: 1.6; overflow-wrap: anywhere; }
.qbot-gvSetupLink { flex: none; color: var(--qbot-blue, #1677ff); font-size: 11.5px; font-weight: 600; text-decoration: none; white-space: nowrap; }
.qbot-gvSetupLink:hover { text-decoration: underline; }
.qbot-gvInfoGrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap: 10px; }
.qbot-gvInfoCell { min-width: 0; padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-gvInfoCell.is-wide { grid-column: 1 / -1; }
.qbot-gvInfoLabel { display: block; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; }
.qbot-gvInfoValue { display: block; margin-top: 4px; color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-gvList { min-width: 0; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; overflow: hidden; }
.qbot-gvListHead { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 9px 12px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-gvListHead strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; }
.qbot-gvRow { min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 9px 12px; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-gvRow:last-child { border-bottom: 0; }
.qbot-gvRow.is-button { width: 100%; border-left: 0; border-right: 0; border-top: 0; background: transparent; font: inherit; text-align: left; cursor: pointer; }
.qbot-gvRow.is-button:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-gvRowMain { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.qbot-gvRowMain strong { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; overflow-wrap: anywhere; }
.qbot-gvRowMain small { min-width: 0; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; overflow-wrap: anywhere; }
.qbot-gvRowOps { flex: none; display: flex; align-items: center; gap: 6px; }
.qbot-gvRowOps .qbot-btn { padding: 4px 9px; font-size: 11.5px; }
.qbot-btnDanger { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-btnDanger:hover:not(:disabled) { border-color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-gvRowMore { flex: none; color: var(--qbot-blue, #1677ff); font-size: 11.5px; }
.qbot-gvStack { min-width: 0; display: flex; flex-direction: column; gap: 12px; }
.qbot-gvFormRow { min-width: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 150px), 1fr)); gap: 10px; align-items: end; }
.qbot-gvForm { min-width: 0; display: flex; flex-direction: column; gap: 10px; padding: 13px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: color-mix(in srgb, var(--dsw-alias-bg-module-platform, #f7f8fa) 55%, transparent); }
.qbot-gvKwCard { border-color: var(--qbot-blue, #1677ff); border-left-width: 3px; }
.qbot-gvKwCard > .qbot-gvFormHead strong { color: var(--qbot-blue, #1677ff); }
.qbot-gvFormHead strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; }
.qbot-gvField { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
.qbot-gvFieldLabel { color: var(--dsw-alias-label-secondary, #646a73); font-size: 11.5px; font-weight: 600; }
.qbot-gvFieldHint { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; line-height: 1.5; }
.qbot-gvField .qbot-input, .qbot-gvField .qbot-settingSelect { width: 100%; min-width: 0; }
.qbot-gvInputShort { max-width: 220px; }
.qbot-gvCheck { min-width: 0; display: flex; align-items: center; gap: 7px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; }
.qbot-gvFormActions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.qbot-gvAiLogs { min-width: 0; display: flex; flex-direction: column; gap: 8px; max-height: 320px; overflow-y: auto; }
.qbot-gvAiLog { flex: none; min-width: 0; display: flex; flex-direction: column; gap: 5px; padding: 10px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 8px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-gvAiLogHead { display: flex; align-items: center; gap: 8px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 11px; }
.qbot-gvAiLevel { flex: none; padding: 1px 7px; border-radius: 6px; background: var(--dsw-alias-interactive-bg-hover, #f2f3f5); color: var(--dsw-alias-label-secondary, #646a73); font-size: 10.5px; font-weight: 600; }
.qbot-gvAiLevel.is-light { color: #b26a00; background: color-mix(in srgb, #ff9f1a 15%, transparent); }
.qbot-gvAiLevel.is-medium { color: var(--qbot-business); background: color-mix(in srgb, var(--qbot-business) 12%, transparent); }
.qbot-gvAiLevel.is-severe { color: #d92b2b; background: color-mix(in srgb, #d92b2b 12%, transparent); }
.qbot-gvAiLogBody { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 12px; line-height: 1.55; overflow-wrap: anywhere; }
.qbot-gvAiLogMeta { min-width: 0; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-gvDetail { min-width: 0; padding: 12px; border: 1px solid color-mix(in srgb, var(--qbot-blue, #1677ff) 32%, transparent); border-radius: 10px; background: color-mix(in srgb, var(--qbot-blue, #1677ff) 5%, var(--dsw-alias-bg-layer-1, #fff)); }
.qbot-gvDetailHead { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
.qbot-gvDetailHead strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; }
.qbot-gvEventGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr)); gap: 10px; }
.qbot-gvEventCard { min-width: 0; display: flex; flex-direction: column; gap: 7px; padding: 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-gvEventCard strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; }
.qbot-gvEventCard code { color: var(--qbot-blue, #1677ff); font-size: 10.5px; }
.qbot-gvEventFields { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
.qbot-gvEventLabel { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; }
.qbot-gvEventField { padding: 2px 6px; border-radius: 5px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); color: var(--dsw-alias-label-secondary, #646a73); font-size: 10.5px; }
/* 事件说明页：频道 OpenAPI 全量速查（按用途分组，方法与路径同时展示） */
.qbot-gvDocIntro { min-width: 0; padding: 9px 11px; border: 1px solid color-mix(in srgb, var(--qbot-blue, #1677ff) 24%, transparent); border-radius: 9px; background: color-mix(in srgb, var(--qbot-blue, #1677ff) 5%, var(--dsw-alias-bg-layer-1, #fff)); color: var(--dsw-alias-label-secondary, #646a73); font-size: 11.5px; line-height: 1.6; overflow-wrap: anywhere; }
.qbot-gvDocGroups { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.qbot-gvDocGroup { min-width: 0; padding: 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-gvDocGroupHead { display: flex; align-items: center; gap: 8px; min-width: 0; margin-bottom: 10px; }
.qbot-gvDocGroupHead strong { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; font-weight: 650; }
.qbot-gvDocGroupHead span { flex: none; min-width: 20px; padding: 1px 6px; border-radius: 9px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10px; text-align: center; }
.qbot-gvDocGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 245px), 1fr)); gap: 8px; min-width: 0; }
.qbot-gvDocCard { min-width: 0; display: flex; flex-direction: column; gap: 6px; padding: 9px 10px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 8px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-gvDocCardTop { display: flex; align-items: flex-start; gap: 7px; min-width: 0; }
.qbot-gvDocMethod { flex: none; min-width: 45px; padding: 2px 4px; border-radius: 4px; font-size: 9.5px; font-weight: 700; line-height: 1.5; text-align: center; letter-spacing: .2px; }
.qbot-gvDocMethod.is-get { color: var(--qbot-blue, #1677ff); background: color-mix(in srgb, var(--qbot-blue, #1677ff) 12%, transparent); }
.qbot-gvDocMethod.is-post { color: var(--qbot-business, #722ed1); background: color-mix(in srgb, var(--qbot-business, #722ed1) 12%, transparent); }
.qbot-gvDocMethod.is-patch { color: #b26a00; background: color-mix(in srgb, #ff9f1a 15%, transparent); }
.qbot-gvDocMethod.is-put { color: #9254de; background: color-mix(in srgb, #9254de 12%, transparent); }
.qbot-gvDocMethod.is-delete { color: #d92b2b; background: color-mix(in srgb, #d92b2b 12%, transparent); }
.qbot-gvDocPath { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 10.5px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-gvDocDesc { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 10.5px; line-height: 1.55; overflow-wrap: anywhere; }
.qbot-gvDocNotes { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; min-width: 0; }
.qbot-gvDocNote { padding: 1px 5px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 4px; background: var(--dsw-alias-bg-layer-1, #fff); color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 9.5px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-gvDocSectionTitle { min-width: 0; margin-top: 4px; color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; font-weight: 650; }
/* 接口权限：每个接口一行的表格式清单（auth_status=1 才是已授权）。 */
.qbot-gvPermBar { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 11.5px; }
.qbot-gvPermTable { min-width: 0; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 10px; overflow: hidden; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-gvPermHead, .qbot-gvPermRow { display: grid; grid-template-columns: 58px minmax(0, 1.25fr) minmax(0, 1fr) 72px; align-items: center; gap: 10px; min-width: 0; padding: 8px 10px; }
.qbot-gvPermHead { background: var(--dsw-alias-bg-module-platform, #f7f8fa); color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; font-weight: 650; }
.qbot-gvPermRow + .qbot-gvPermRow { border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-gvPermRow:hover { background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-gvPermPath { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 10.5px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-gvPermDesc { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 11px; line-height: 1.5; overflow-wrap: anywhere; }
.qbot-gvPermState { justify-self: start; flex: none; padding: 2px 7px; border-radius: 999px; font-size: 10.5px; line-height: 1.5; white-space: nowrap; }
.qbot-gvPermState.is-ok { color: var(--dsw-alias-state-success-color, #27855b); background: color-mix(in srgb, var(--dsw-alias-state-success-color, #27855b) 12%, transparent); }
.qbot-gvPermState.is-no { color: var(--dsw-alias-state-error-primary, #d54941); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #d54941) 10%, transparent); }
.qbot-gvPermRaw { min-width: 0; }
.qbot-gvPermRaw summary { cursor: pointer; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; }
.qbot-gvPermRaw pre { max-height: 260px; margin: 8px 0 0; padding: 10px; overflow: auto; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 8px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); font-size: 10.5px; line-height: 1.55; }
@media (max-width: 560px) {
  .qbot-gvPermHead, .qbot-gvPermRow { grid-template-columns: 48px minmax(0, 1fr) 68px; }
  .qbot-gvPermHead span:nth-child(3), .qbot-gvPermDesc { display: none; }
}
/* 二级弹窗（子频道 / 身份组编辑）：盖在主弹窗内容之上 */
.qbot-gvSubOverlay { position: fixed; inset: 0; z-index: 10006; display: flex; align-items: center; justify-content: center; padding: 24px; background: rgb(0 0 0 / 42%); }
.qbot-gvSubModal { width: min(520px, 100%); max-height: min(86vh, 720px); overflow-y: auto; overscroll-behavior: contain; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 14px; background: var(--dsw-alias-bg-layer-1, #fff); box-shadow: 0 12px 40px rgb(0 0 0 / 22%); }
.qbot-gvSubModal > .qbot-modalHead { position: sticky; top: 0; z-index: 2; background: var(--dsw-alias-bg-layer-1, #fff); }
/* 二级弹窗内的吸顶提示：盖在滚动内容之上，5 秒自动消失（由组件定时器控制）。 */
.qbot-gvSubToast { position: sticky; top: 52px; z-index: 3; margin: 0 16px 6px; }
.qbot-gvSubModal > .qbot-gvForm { margin: 16px; }
/* 子 Tab（内容管理 / AI 接管） */
.qbot-gvSubTabs { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; padding: 3px; border-radius: 9px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-gvSubTab { flex: none; padding: 6px 12px; border: 0; border-radius: 7px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); font: inherit; font-size: 12px; cursor: pointer; }
.qbot-gvSubTab:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-gvSubTab.is-on { background: var(--dsw-alias-bg-layer-1, #fff); color: var(--qbot-blue, #1677ff); font-weight: 650; box-shadow: 0 1px 3px rgb(31 35 41 / 10%); }
/* 颜色选择器 + 十进制 ARGB */
.qbot-gvColorRow { display: flex; align-items: center; gap: 8px; min-width: 0; }
.qbot-gvColorPick { flex: none; width: 44px; height: 34px; padding: 2px; border: 1px solid var(--dsw-alias-border-l2, #e5e6eb); border-radius: 8px; background: var(--dsw-alias-bg-layer-1, #fff); cursor: pointer; }
.qbot-gvColorNum { flex: 1 1 auto; min-width: 0; }
/* ID 输入框（datalist 下拉 + 手动粘贴） */
.qbot-gvIdInput { min-width: 0; display: flex; flex-direction: column; }
.qbot-gvIdInput .qbot-input { width: 100%; min-width: 0; }
/* 接口返回 JSON 展示框 */
.qbot-gvResult { min-width: 0; max-height: 260px; overflow: auto; overscroll-behavior: contain; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-gvResult pre { margin: 0; padding: 12px; color: var(--dsw-alias-label-secondary, #646a73); font: 11.5px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; overflow-wrap: anywhere; }
/* 发消息回执 + 排查说明 */
.qbot-gvReceiptOk, .qbot-gvReceiptWarn { display: flex; flex-direction: column; gap: 4px; font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; }
.qbot-gvReceiptOk code { color: var(--dsw-alias-label-primary, #1f2329); font: 11.5px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; }
.qbot-gvReceiptOk span { color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-gvReceiptWarn { color: var(--dsw-alias-state-warning-primary, #d8961b); }
.qbot-gvRawDetails { min-width: 0; font-size: 12px; color: var(--dsw-alias-label-secondary, #646a73); }
.qbot-gvRawDetails summary { cursor: pointer; }
.qbot-gvRawDetails pre { margin: 8px 0 0; padding: 12px; border-radius: 8px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); color: var(--dsw-alias-label-secondary, #646a73); font: 11.5px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; overflow: auto; overflow-wrap: anywhere; }
.qbot-gvTip { background: color-mix(in srgb, var(--dsw-alias-state-info-bg, #e8f3ff) 40%, transparent); }
.qbot-gvTip p { margin: 0; font-size: 12px; line-height: 1.7; color: var(--dsw-alias-label-secondary, #646a73); overflow-wrap: anywhere; }
@media (max-width: 640px) {
  .qbot-gvNav { width: 112px; padding: 10px 6px; }
  .qbot-gvContent { padding: 14px 12px 18px; }
  .qbot-gvScope { margin: -14px -12px 16px; padding: 8px 12px; }
  .qbot-ptNav { width: 130px; padding: 10px 6px; }
  .qbot-ptNavItem { padding: 8px 7px; font-size: 12px; }
  .qbot-ptContent { padding: 14px 12px 18px; }
  .qbot-ptItemGrid { grid-template-columns: minmax(0, 1fr); }
}

/* ── AI 执行记录（群聊管理 / 频道管理共用；触发在 agent 聊天里） ── */
/* 不设固定高度 / 不建嵌套滚动：整块跟着弹窗右侧内容一起滚，避免鼠标停在这里时滚轮被吞。 */
.qbot-aiPanel { display: flex; flex-direction: column; min-width: 0; gap: 12px; }
.qbot-aiHead { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex: none; }
.qbot-aiHead strong { display: block; font-size: 15px; color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-aiSub { margin: 3px 0 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; line-height: 1.5; }
.qbot-aiDisclaimer { flex: none; margin: 0; padding: 8px 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 9px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); color: var(--dsw-alias-label-secondary, #646a73); font-size: 11.5px; line-height: 1.55; }
.qbot-aiBody { min-height: 120px; min-width: 0; padding: 14px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 12px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
/* 时间轴：左列时间 → 中间轴线/状态节点 → 右列事件卡（空状态也占一行）。 */
.qbot-aiTimeline { min-width: 0; display: flex; flex-direction: column; gap: 12px; }
.qbot-aiTlRow { min-width: 0; display: grid; grid-template-columns: minmax(74px, 96px) 18px minmax(0, 1fr); align-items: stretch; }
.qbot-aiTlTime { padding-top: 11px; text-align: right; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; line-height: 1.45; overflow-wrap: anywhere; }
.qbot-aiTlNode { position: relative; display: flex; justify-content: center; }
.qbot-aiTlNode::before { content: ""; position: relative; z-index: 1; width: 9px; height: 9px; margin-top: 14px; border-radius: 50%; background: var(--dsw-alias-state-success-primary, #27855b); box-shadow: 0 0 0 3px var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-aiTlNode::after { content: ""; position: absolute; top: 21px; bottom: -12px; left: 50%; width: 1px; transform: translateX(-50%); background: var(--dsw-alias-border-l2, #e5e6eb); }
.qbot-aiTlRow:last-child .qbot-aiTlNode::after { display: none; }
.qbot-aiTlRow.is-fail .qbot-aiTlNode::before { background: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-aiTlRow.is-empty .qbot-aiTlNode::before { background: var(--dsw-alias-border-l2, #e5e6eb); }
.qbot-aiTlContent { min-width: 0; }
.qbot-aiEmpty { margin: 0; padding: 16px 14px; border: 1px dashed var(--dsw-alias-border-l2, #e5e6eb); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 12px; line-height: 1.7; overflow-wrap: anywhere; }
.qbot-aiLog { min-width: 0; display: flex; flex-direction: column; gap: 6px; padding: 10px 12px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-left: 3px solid var(--dsw-alias-state-success-primary, #27855b); border-radius: 10px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-aiLog.is-fail { border-left-color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-aiLogHead { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.qbot-aiLogState { margin-left: auto; color: var(--dsw-alias-label-secondary, #646a73); font-size: 11px; font-weight: 650; }
.qbot-aiLog.is-fail .qbot-aiLogState { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-aiSrc { padding: 1px 6px; border-radius: 4px; font-size: 10px; line-height: 1.5; color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-aiSrc.is-local { color: var(--dsw-alias-state-success-color, #27855b); }
.qbot-aiSrc.is-llm { color: var(--qbot-blue, #1677ff); }
.qbot-aiSrc.is-cache { color: #b06f00; }
.qbot-aiLogAction { color: var(--dsw-alias-label-primary, #1f2329); font-size: 12.5px; font-weight: 650; }
.qbot-aiLogText { color: var(--dsw-alias-label-secondary, #646a73); font-size: 11.5px; line-height: 1.55; overflow-wrap: anywhere; white-space: pre-wrap; }
.qbot-aiBubble { min-width: 0; padding: 8px 10px; border-radius: 8px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); color: var(--dsw-alias-label-primary, #1f2329); font-size: 12px; line-height: 1.6; overflow-wrap: anywhere; white-space: pre-wrap; }
.qbot-aiLogTarget { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; overflow-wrap: anywhere; }
.qbot-aiUsage { display: flex; align-items: baseline; gap: 8px; flex: none; padding-top: 8px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; }
.qbot-aiUsage > span:first-child { font-weight: 650; }
@media (max-width: 640px) {
  .qbot-aiLogHead { gap: 6px; }
  .qbot-aiTlRow { grid-template-columns: minmax(56px, 72px) 14px minmax(0, 1fr); }
  .qbot-aiTlTime { font-size: 10px; }
}

/* ═══ 机器人管理控制台弹窗（左菜单 + 右内容 + 运营大屏） ═══════════════════ */
.qbot-consoleOverlay { z-index: 9000; backdrop-filter: none; }
/* 弹窗宽高联动缩放：以 1120:860（≈1.3:1）为基准比例，窗口任一维变小时宽高一起等比收小，大屏则封顶不再放大。 */
.qbot-consoleModal { position: relative; width: min(1120px, calc(100vw - 48px), calc((100vh - 48px) * 1.3)); height: min(860px, calc(100vh - 48px), calc((100vw - 48px) / 1.3)); }
/* 顶部悬浮提示：绝对定位、脱离文档流，出现/消失不挤压内容，避免抖动；层级高于内容区与内部弹窗。 */
.qbot-consoleToast { position: absolute; top: 66px; left: 50%; transform: translateX(-50%); z-index: 10020; max-width: min(620px, calc(100% - 48px)); margin: 0; box-shadow: 0 10px 30px rgb(31 35 41 / 20%); animation: none; }
.qbot-consoleBody { flex: 1 1 auto; min-width: 0; min-height: 0; display: flex; overflow: hidden; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-consoleMenu { flex: none; width: 210px; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 10px 9px 16px; border-right: 1px solid var(--dsw-alias-border-l1, #eef0f3); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-consoleMenuGroup { margin-bottom: 4px; }
.qbot-consoleMenuGroup + .qbot-consoleMenuGroup { margin-top: 8px; padding-top: 10px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
/* 一级：分区标题——小号灰字、字距拉开、左侧色条 */
.qbot-consoleMenuGroupTitle { display: flex; align-items: center; gap: 8px; padding: 5px 10px 6px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; font-weight: 700; letter-spacing: .1em; }
.qbot-consoleMenuGroupTitle .qbot-consoleMenuIcon { width: 15px; font-size: 11px; opacity: .75; }
/* 二级：能力项——正常字号、带图标、缩进一级 */
.qbot-consoleMenuItem { width: 100%; display: flex; align-items: center; gap: 9px; padding: 8px 10px 8px 20px; margin: 1px 0; border: 0; border-radius: 8px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12.5px; text-align: left; cursor: pointer; }
.qbot-consoleMenuItem:hover { background: var(--dsw-alias-interactive-bg-hover, #eef0f3); color: var(--dsw-alias-label-primary, #1f2329); }
.qbot-consoleMenuItem.is-active { background: var(--dsw-alias-bg-layer-1, #fff); color: var(--qbot-blue, #1677ff); font-weight: 650; box-shadow: 0 1px 3px rgb(31 35 41 / 8%); }
.qbot-consoleMenuIcon { flex: none; width: 18px; text-align: center; opacity: .85; }
.qbot-consoleMenuLabel { flex: 1 1 auto; min-width: 0; overflow-wrap: anywhere; }
.qbot-consoleContent { flex: 1 1 auto; min-width: 0; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 24px 30px 28px; }
/* 运营总览：单屏自适应，压缩留白让所有区块一屏放得下，不出现外层滚动条。 */
.qbot-consoleContent.is-overview { display: flex; flex-direction: column; overflow: hidden; padding: 18px 26px 20px; }
.qbot-consoleContent.is-overview .qbot-consolePaneHead { flex: none; margin-bottom: 12px; }
.qbot-consoleContent.is-overview .qbot-consoleOverview { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; }
/* 归档/配置清单：内容区切换为定高 flex 列，让内嵌弹窗跟随外框高度、内部自行滚动。 */
.qbot-consoleContent.is-fill { display: flex; flex-direction: column; overflow: hidden; }
.qbot-consoleContent.is-fill .qbot-consolePaneBody { flex: 1 1 auto; min-width: 0; min-height: 0; display: flex; flex-direction: column; }
.qbot-consolePaneHead { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; margin-bottom: 16px; }
/* 右侧顶部横向子 tab：替代原来左侧竖排的子菜单，定高 flex 列的直接子元素需 flex:none。 */
.qbot-consoleSubTabs { flex: none; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin: -4px 0 16px; padding: 4px; border-radius: 9px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-consoleSubTab { flex: none; padding: 6px 13px; border: 0; border-radius: 7px; background: transparent; color: var(--dsw-alias-label-secondary, #646a73); font: inherit; font-size: 12.5px; cursor: pointer; white-space: nowrap; transition: background .14s ease, color .14s ease, box-shadow .14s ease; }
.qbot-consoleSubTab:hover { color: var(--dsw-alias-label-primary, #1f2329); background: var(--dsw-alias-interactive-bg-hover, #eef0f3); }
.qbot-consoleSubTab.is-active { color: var(--qbot-blue, #1677ff); background: var(--dsw-alias-bg-layer-1, #fff); font-weight: 650; box-shadow: 0 1px 3px rgb(31 35 41 / 8%); }
.qbot-consoleCrumb { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-bottom: 4px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11.5px; }
.qbot-consoleCrumb i { color: var(--dsw-alias-label-placeholder, #bbbfc4); font-style: normal; }
.qbot-consoleHeadActions { display: flex; align-items: center; gap: 8px; flex: none; }
.qbot-consolePaneHead h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 16px; font-weight: 650; }
.qbot-consolePaneHead p { margin: 3px 0 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; }
.qbot-consoleMetricGrid { flex: none; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-bottom: 12px; }
.qbot-consoleMetric { min-width: 0; min-height: 92px; display: flex; flex-direction: column; gap: 5px; padding: 10px 13px 9px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-left: 3px solid var(--dsw-alias-border-l2, #dfe1e5); border-radius: 11px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-consoleMetric[data-tone="success"] { border-left-color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-consoleMetric[data-tone="warning"] { border-left-color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-consoleMetric[data-tone="error"] { border-left-color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-consoleMetricTop { display: flex; align-items: center; gap: 7px; min-width: 0; }
.qbot-consoleMetricIcon { flex: none; width: 18px; height: 18px; display: grid; place-items: center; border-radius: 5px; background: var(--dsw-alias-bg-layer-1, #fff); color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; line-height: 1; }
.qbot-consoleMetric[data-tone="success"] .qbot-consoleMetricIcon { color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-consoleMetric[data-tone="warning"] .qbot-consoleMetricIcon { color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-consoleMetric[data-tone="error"] .qbot-consoleMetricIcon { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-consoleMetricLabel { min-width: 0; color: var(--dsw-alias-label-secondary, #646a73); font-size: 11.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.qbot-consoleMetricValue { color: var(--dsw-alias-label-primary, #1f2329); font-size: 21px; line-height: 1.15; font-weight: 700; font-variant-numeric: tabular-nums; }
.qbot-consoleMetricSub { min-height: 13px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; line-height: 1.2; }
.qbot-consoleMetric[data-tone="success"] .qbot-consoleMetricValue { color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-consoleMetric[data-tone="warning"] .qbot-consoleMetricValue { color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-consoleMetric[data-tone="error"] .qbot-consoleMetricValue { color: var(--dsw-alias-state-error-primary, #d54941); }
.qbot-consoleCharts { display: grid; grid-template-columns: 1.3fr 1fr 1.15fr; gap: 12px; }
.qbot-consoleOverview > .qbot-consoleCharts:not(.qbot-ovArchive) { flex: 1 1 auto; min-height: 0; grid-template-rows: minmax(0, 1fr) auto; }
.qbot-consoleOverview > .qbot-consoleCharts:not(.qbot-ovArchive) > .qbot-consoleChart { display: flex; flex-direction: column; }
.qbot-consoleChart { min-width: 0; padding: 12px 14px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 12px; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-consoleChartTitle { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; margin-bottom: 14px; }
.qbot-consoleBars { display: flex; align-items: flex-end; gap: 10px; height: 150px; }
.qbot-consoleBarCol { flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 6px; height: 100%; }
.qbot-consoleBar { width: 100%; max-width: 42px; min-height: 3px; border-radius: 5px 5px 0 0; background: var(--qbot-blue, #1677ff); transition: height .25s ease; }
.qbot-consoleBarCol span { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; font-variant-numeric: tabular-nums; }
.qbot-consoleCompose { display: flex; flex-direction: column; gap: 14px; }
.qbot-consoleComposeBar { display: flex; width: 100%; height: 16px; border-radius: 8px; overflow: hidden; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-consoleComposeBar .is-passive { background: var(--qbot-blue, #1677ff); }
.qbot-consoleComposeBar .is-proactive { background: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-consoleComposeLegend { display: flex; flex-direction: column; gap: 9px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12px; }
.qbot-consoleComposeLegend span { display: inline-flex; align-items: center; gap: 7px; }
.qbot-consoleComposeLegend i { width: 9px; height: 9px; border-radius: 3px; flex: none; }
.qbot-consoleComposeLegend i.is-passive { background: var(--qbot-blue, #1677ff); }
.qbot-consoleComposeLegend i.is-proactive { background: var(--dsw-alias-state-success-primary, #20a162); }
/* 运营总览：状态横幅 + 带刻度的趋势 + 构成环 + 运行信息，纯查看无操作按钮。 */
.qbot-ovHero { flex: none; display: flex; align-items: center; gap: 18px; min-width: 0; margin-bottom: 12px; padding: 10px 16px; border: 1px solid var(--dsw-alias-border-l1, #eef0f3); border-radius: 12px; background: linear-gradient(100deg, rgb(22 119 255 / 8%), transparent 62%), var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ovHeroId { flex: 1 1 auto; min-width: 0; display: flex; align-items: center; gap: 11px; }
.qbot-ovAvatar { flex: none; width: 40px; height: 40px; display: grid; place-items: center; border-radius: 11px; background: var(--qbot-blue, #1677ff); color: #fff; font-size: 18px; box-shadow: 0 3px 10px rgb(22 119 255 / 24%); }
.qbot-ovHeroMeta { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.qbot-ovHeroMeta strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 14px; font-weight: 650; overflow-wrap: anywhere; }
.qbot-ovHeroMeta span { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11px; }
.qbot-ovConn { flex: none; display: inline-flex; align-items: center; gap: 7px; padding: 5px 11px; border-radius: 999px; font-size: 11.5px; font-weight: 600; }
.qbot-ovConn i { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.qbot-ovConn.is-success { color: var(--dsw-alias-state-success-primary, #20a162); background: rgb(32 161 98 / 10%); }
.qbot-ovConn.is-warning { color: var(--dsw-alias-state-warn-primary, #d97706); background: rgb(217 119 6 / 10%); }
.qbot-ovConn.is-error { color: var(--dsw-alias-state-error-primary, #d54941); background: rgb(213 73 65 / 10%); }
.qbot-ovConn.is-muted { color: var(--dsw-alias-label-secondary, #646a73); background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-ovHeroFacts { flex: none; display: flex; align-items: center; }
.qbot-ovHeroFacts > div { min-width: 78px; display: flex; flex-direction: column; gap: 3px; padding: 0 14px; border-left: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
.qbot-ovHeroFacts span { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; white-space: nowrap; }
.qbot-ovHeroFacts strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 16px; font-weight: 650; font-variant-numeric: tabular-nums; }
.qbot-ovChartHead { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
.qbot-ovChartHead > div { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.qbot-ovChartHead strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 13px; font-weight: 650; }
.qbot-ovChartHead > div span { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; }
.qbot-ovChartTag { flex: none; padding: 4px 9px; border-radius: 6px; background: rgb(22 119 255 / 9%); color: var(--qbot-blue, #1677ff); font-size: 10.5px; font-weight: 650; font-variant-numeric: tabular-nums; }
.qbot-ovBars { position: relative; flex: 1 1 auto; min-height: 118px; }
.qbot-ovBars::before { content: ""; position: absolute; inset: 0 0 17px; pointer-events: none; background: repeating-linear-gradient(to top, var(--dsw-alias-border-l1, #eef0f3) 0 1px, transparent 1px 25%); }
.qbot-ovBarArea { flex: 1 1 auto; width: 100%; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 4px; }
.qbot-ovBarValue { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10px; font-variant-numeric: tabular-nums; }
.qbot-ovBarArea .qbot-consoleBar { max-width: 34px; }
.qbot-consoleBar.is-today { background: linear-gradient(180deg, #6aa8ff, var(--qbot-blue, #1677ff)); }
.qbot-ovDonutChart, .qbot-ovStatus { display: flex; flex-direction: column; }
.qbot-ovDonutBody { flex: 1 1 auto; display: flex; align-items: center; justify-content: center; gap: 16px; }
.qbot-ovDonut { flex: none; width: 104px; height: 104px; display: grid; place-items: center; border-radius: 50%; }
.qbot-ovDonutInner { width: 72px; height: 72px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; border-radius: 50%; background: var(--dsw-alias-bg-layer-1, #fff); }
.qbot-ovDonutInner strong { color: var(--dsw-alias-label-primary, #1f2329); font-size: 18px; font-weight: 700; font-variant-numeric: tabular-nums; }
.qbot-ovDonutInner span { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10px; }
.qbot-ovDonutBody .qbot-consoleComposeLegend { flex: 1 1 auto; min-width: 0; }
.qbot-ovStatusList { flex: 1 1 auto; align-content: center; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 10px; }
.qbot-ovStatusRow { min-width: 0; display: flex; flex-direction: column; gap: 3px; padding: 7px 10px; border-radius: 8px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-ovStatusLabel { color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; white-space: nowrap; }
.qbot-ovStatusValue { min-width: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 12px; font-weight: 600; overflow-wrap: anywhere; font-variant-numeric: tabular-nums; }
.qbot-ovStatusValue[data-tone="success"] { color: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-ovStatusValue[data-tone="warning"] { color: var(--dsw-alias-state-warn-primary, #d97706); }
.qbot-ovStatusValue[data-tone="error"] { color: var(--dsw-alias-state-error-primary, #d54941); }
/* 运营总览：消息归档分类 / 来源 / 月份分布 */
.qbot-ovArchive { grid-column: 1 / -1; min-height: 0; margin-top: 12px; grid-template-columns: 1.2fr 1fr 1fr; }
.qbot-ovArcBar { display: flex; width: 100%; height: 14px; margin-bottom: 13px; border-radius: 7px; overflow: hidden; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-ovArcBar span { display: block; height: 100%; transition: width .25s ease; }
.qbot-ovArcBar .is-inbound, .qbot-ovArcBar .is-group { background: var(--qbot-blue, #1677ff); }
.qbot-ovArcBar .is-reply { background: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-ovArcBar .is-proactive, .qbot-ovArcBar .is-c2c { background: var(--qbot-business, #9254de); }
.qbot-ovArcLegend { display: flex; flex-direction: column; gap: 8px; }
.qbot-ovArcLegend span { min-width: 0; display: flex; align-items: center; gap: 7px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 11.5px; }
.qbot-ovArcLegend i { flex: none; width: 8px; height: 8px; border-radius: 2px; }
.qbot-ovArcLegend i.is-inbound, .qbot-ovArcLegend i.is-group { background: var(--qbot-blue, #1677ff); }
.qbot-ovArcLegend i.is-reply { background: var(--dsw-alias-state-success-primary, #20a162); }
.qbot-ovArcLegend i.is-proactive, .qbot-ovArcLegend i.is-c2c { background: var(--qbot-business, #9254de); }
.qbot-ovArcLegend b { color: var(--dsw-alias-label-primary, #1f2329); font-weight: 650; font-variant-numeric: tabular-nums; }
.qbot-ovArcLegend em { margin-left: auto; color: var(--dsw-alias-label-tertiary, #8f959e); font-style: normal; font-variant-numeric: tabular-nums; }
.qbot-ovArcMonthList { flex: 1 1 auto; display: flex; flex-direction: column; justify-content: center; gap: 8px; }
.qbot-ovArcMonth { display: flex; align-items: center; gap: 8px; }
.qbot-ovArcMonth > span { flex: none; width: 34px; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 10.5px; font-variant-numeric: tabular-nums; }
.qbot-ovArcMonthTrack { flex: 1 1 auto; min-width: 0; height: 7px; border-radius: 4px; overflow: hidden; background: var(--dsw-alias-bg-module-platform, #f7f8fa); }
.qbot-ovArcMonthTrack i { display: block; height: 100%; border-radius: 4px; background: var(--qbot-blue, #1677ff); }
.qbot-ovArcMonth strong { flex: none; width: 30px; text-align: right; color: var(--dsw-alias-label-secondary, #646a73); font-size: 10.5px; font-weight: 600; font-variant-numeric: tabular-nums; }
.qbot-ovArcEmpty { flex: 1 1 auto; display: grid; place-items: center; color: var(--dsw-alias-label-tertiary, #8f959e); font-size: 11.5px; }
.qbot-consoleEmbed { min-width: 0; }
.qbot-consoleConfig { max-width: 920px; }
.qbot-consoleConfig > .qbot-section { margin-bottom: 12px; }
/* 配置分区平铺：去掉卡片外壳，表单直接清单显示。 */
.qbot-consoleConfig > .qbot-sectionBody { padding: 2px 0 0; border: 0; background: transparent; }
/* 控制台内嵌的独立弹窗类组件：剥掉自己的遮罩与定高外壳，作为内容区面板留在弹窗内。 */
.qbot-consoleSub { min-width: 0; }
.qbot-consoleSub > .qbot-modalOverlay { position: static; inset: auto; z-index: auto; display: block; padding: 0; background: transparent; backdrop-filter: none; animation: none; }
/* 内容区由左侧菜单切换，内嵌面板自带的关闭按钮一律不显示 */
.qbot-consoleContent .qbot-consoleSub .qbot-modalClose,
.qbot-consoleContent > .qbot-consoleEmbed .qbot-modalClose { display: none !important; }
/* 控制台内弹出的二级弹窗：脱离内容区滚动裁切，层级高于控制台本体 */
.qbot-consoleOverlay .qbot-modalOverlay,
.qbot-consoleOverlay .qbot-gvSubOverlay,
.qbot-consoleOverlay .qbot-confirmOverlay { z-index: 10010; }
.qbot-consoleSub > .qbot-modalOverlay > .qbot-modal,
.qbot-consoleSub > .qbot-modalOverlay > .qbot-modal.qbot-modalWide,
.qbot-consoleSub > .qbot-modalOverlay > .qbot-modal.qbot-cmModal,
.qbot-consoleSub > .qbot-modalOverlay > .qbot-modal.qbot-gvModal { width: 100%; height: auto; max-height: none; margin: 0; border: 0; border-radius: 0; box-shadow: none; background: transparent; overflow: visible; animation: none; }
.qbot-consoleSub > .qbot-modalOverlay > .qbot-modal > .qbot-modalHead { padding: 0 0 12px; }
.qbot-consoleSub > .qbot-modalOverlay > .qbot-modal > .qbot-modalFoot { padding: 12px 0 0; }
.qbot-consoleSub .qbot-modalAlert { margin: 0 0 12px; }
/* fill 模式：外框定高，内嵌弹窗铺满；隐藏自带头部(顶部描述重复)与归档底部按钮，
   让内部列表/编辑器各自滚动，样式与外框一致(去掉卡片边框与圆角)。 */
.qbot-consoleContent.is-fill .qbot-consoleSub,
.qbot-consoleContent.is-fill .qbot-consoleSub > .qbot-modalOverlay { flex: 1 1 auto; min-width: 0; min-height: 0; display: flex; flex-direction: column; }
.qbot-consoleContent.is-fill .qbot-consoleSub > .qbot-modalOverlay { position: relative; inset: auto; z-index: auto; padding: 0; background: transparent; backdrop-filter: none; animation: none; }
.qbot-consoleContent.is-fill .qbot-consoleSub > .qbot-modalOverlay > .qbot-modal { flex: 1 1 auto; min-height: 0; height: auto; max-height: none; border: 0; border-radius: 0; box-shadow: none; background: transparent; overflow: hidden; }
.qbot-consoleContent.is-fill .qbot-consoleSub > .qbot-modalOverlay > .qbot-modal > .qbot-modalHead { display: none; }
.qbot-consoleSubArchive > .qbot-modalOverlay > .qbot-modal > .qbot-modalFoot { display: none; }
.qbot-consoleSubArchive > .qbot-modalOverlay > .qbot-modal > .qbot-modalAlert { margin: 0 0 8px; }
.qbot-consoleContent.is-fill .qbot-consoleSub.qbot-consoleSubArchive .qbot-archSplit { flex: 1 1 auto; min-height: 0; margin: 0; border: 0; border-radius: 0; }
.qbot-consoleContent.is-fill .qbot-consoleSub.qbot-consoleSubManifest .qbot-cmBody { flex: 1 1 auto; min-height: 0; padding: 0 0 4px; }
/* 单一滚动：内容区是唯一滚动容器，内层不再各建滚动区吞掉滚轮。 */
.qbot-consoleContent .qbot-modalListScroll,
.qbot-consoleContent .qbot-modalBody,
.qbot-consoleContent .qbot-modalBody .qbot-editForm,
.qbot-consoleContent .qbot-gvNav,
.qbot-consoleContent .qbot-gvContent,
.qbot-consoleContent .qbot-ptNav,
.qbot-consoleContent .qbot-ptContent,
.qbot-consoleContent .qbot-archSide,
.qbot-consoleContent .qbot-msgList,
.qbot-consoleContent .qbot-cmHelpScroll { overflow: visible !important; overscroll-behavior: auto !important; }
.qbot-consoleContent .qbot-modalList { overflow: visible !important; min-height: 0 !important; }
/* 非 fill 视图：内层任何滚动区都允许滚动链，滚轮滚到边界后交给内容区，避免被 contain 吞掉。 */
.qbot-consoleContent:not(.is-fill) * { overscroll-behavior: auto !important; }
/* 带 max-height 的内部小滚动区（成员/禁言名单、结果区、日志）改为可滚动链，滚轮滚到边界后交给内容区。 */
.qbot-consoleContent .qbot-ptMutedList,
.qbot-consoleContent .qbot-ptMembers,
.qbot-consoleContent .qbot-gvAiLogs,
.qbot-consoleContent .qbot-gvResult,
.qbot-consoleContent .qbot-gvSubModal { overscroll-behavior: auto !important; }
/* fill 模式例外：归档/配置清单在定高容器内自行滚动，恢复其内层的 overflow 与滚动链隔离。 */
.qbot-consoleContent.is-fill .qbot-archSide,
.qbot-consoleContent.is-fill .qbot-msgList { overflow-y: auto !important; overscroll-behavior: contain !important; }
.qbot-consoleContent.is-fill .qbot-cmCode { overflow: auto !important; }
.qbot-consoleContent.is-fill .qbot-cmHelpScroll { overflow-y: auto !important; overscroll-behavior: contain !important; }
.qbot-consoleContent.is-fill .qbot-cmIssues { overflow-y: auto !important; }
/* 内嵌模式下，导航由控制台左侧树接管，隐藏组件自带导航。
   群聊的入群审批 / 群规审核沿用各自组件内部的 subNav（与旧版弹窗一致），故不隐藏 qbot-ptSubNav。 */
.qbot-consoleContent .qbot-gvLayout.is-embedded .qbot-gvNav,
.qbot-consoleContent .qbot-gvLayout.is-embedded .qbot-gvSubTabs,
.qbot-consoleContent .qbot-ptLayout.is-embedded .qbot-ptNav { display: none !important; }
.qbot-consoleContent .qbot-gvLayout.is-embedded .qbot-gvContent,
.qbot-consoleContent .qbot-ptLayout.is-embedded .qbot-ptContent { padding: 0; }
.qbot-consoleEntry { max-width: 460px; margin: 48px auto; display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; }
.qbot-consoleEntryIcon { width: 52px; height: 52px; display: grid; place-items: center; border-radius: 14px; background: var(--dsw-alias-bg-module-platform, #f7f8fa); color: var(--qbot-blue, #1677ff); font-size: 22px; }
.qbot-consoleEntry h3 { margin: 0; color: var(--dsw-alias-label-primary, #1f2329); font-size: 16px; font-weight: 650; }
.qbot-consoleEntry p { margin: 0 0 4px; color: var(--dsw-alias-label-secondary, #646a73); font-size: 12.5px; line-height: 1.6; }
@media (max-width: 720px) {
  .qbot-consoleBody { flex-direction: column; }
  .qbot-consoleMenu { width: 100%; max-height: 30vh; border-right: 0; border-bottom: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
  .qbot-consoleMetricGrid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .qbot-consoleCharts { grid-template-columns: 1fr; }
  .qbot-ovHero { flex-wrap: wrap; gap: 10px; }
  .qbot-ovHeroFacts { width: 100%; justify-content: space-between; padding-top: 10px; border-top: 1px solid var(--dsw-alias-border-l1, #eef0f3); }
  .qbot-ovHeroFacts > div { flex: 1 1 0; padding: 0 10px; }
  .qbot-ovHeroFacts > div:first-child { padding-left: 0; border-left: 0; }
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
  const QR_DURATION_MS = 3 * 6e4;
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
var React6 = __toESM(require("react"), 1);

// src/client/group-info.ts
var React4 = __toESM(require("react"), 1);
var GROUP_INFO_CACHE = /* @__PURE__ */ new Map();
var groupInfoCacheKey = (appId, openid) => `${appId}:${openid}`;
function useGroupInfos(rpcCall, appId, ids, limit = 30) {
  const [map, setMap] = React4.useState({});
  const idsKey = ids.join("\0");
  React4.useEffect(() => {
    let alive = true;
    const collect = () => {
      const next = {};
      for (const id of ids) {
        const info = GROUP_INFO_CACHE.get(groupInfoCacheKey(appId, id));
        if (info) next[id] = info;
      }
      if (alive) setMap(next);
    };
    const missing = ids.filter((id) => !GROUP_INFO_CACHE.has(groupInfoCacheKey(appId, id)));
    if (!missing.length) {
      if (ids.length) collect();
      else setMap({});
      return;
    }
    void Promise.all(missing.slice(0, limit).map(async (id) => {
      const key = groupInfoCacheKey(appId, id);
      try {
        const res = await rpcCall("platform.group.info", { ...appId ? { appId } : {}, groupOpenid: id });
        if (res.ok) GROUP_INFO_CACHE.set(key, val(res) ?? {});
      } catch {
      }
      if (!GROUP_INFO_CACHE.has(key)) GROUP_INFO_CACHE.set(key, {});
    })).then(collect);
    return () => {
      alive = false;
    };
  }, [idsKey, rpcCall, appId, limit]);
  return map;
}

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
      const body2 = [];
      i += 1;
      while (i < rawLines.length && !/^```/.test(rawLines[i].trim())) {
        body2.push(rawLines[i]);
        i += 1;
      }
      i += 1;
      out.push(`<pre><code>${escapeHtml(body2.join("\n"))}</code></pre>`);
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
      const body2 = [];
      while (i < rawLines.length && /^\s*&gt;?\s?|^\s*>\s?/.test(rawLines[i]) && rawLines[i].trim()) {
        body2.push(rawLines[i].replace(/^\s*&gt;\s?|^\s*>\s?/, ""));
        i += 1;
      }
      out.push(`<blockquote>${para(body2)}</blockquote>`);
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

// src/client/dialogs/archive-media.tsx
var React5 = __toESM(require("react"), 1);
var mediaCache = /* @__PURE__ */ new Map();
function cacheKey(kind, file) {
  return `${kind}:${file}`;
}
function humanSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
function ArchivedMediaView(props) {
  const { rpcCall, item, expanded, onToggle } = props;
  const kind = item.kind === "video" || item.kind === "file" ? item.kind : "image";
  const file = String(item.file ?? "");
  const key = cacheKey(kind, file);
  const [src, setSrc] = React5.useState(() => mediaCache.get(key) ?? "");
  const [failed, setFailed] = React5.useState(false);
  const [loading, setLoading] = React5.useState(false);
  const holderRef = React5.useRef(null);
  const load = React5.useCallback(async () => {
    if (!file || loading) return "";
    if (mediaCache.has(key)) {
      const cached = mediaCache.get(key) ?? "";
      setSrc(cached);
      return cached;
    }
    setLoading(true);
    try {
      const res = await rpcCall("archive.media", { kind, file });
      if (!res.ok) {
        setFailed(true);
        return "";
      }
      const data = res.value ?? res.data ?? {};
      const mime = String(data.mime ?? "application/octet-stream");
      const base64 = String(data.base64 ?? "");
      if (!base64) {
        setFailed(true);
        return "";
      }
      const url = `data:${mime};base64,${base64}`;
      mediaCache.set(key, url);
      setSrc(url);
      return url;
    } catch {
      setFailed(true);
      return "";
    } finally {
      setLoading(false);
    }
  }, [file, kind, key, loading, rpcCall]);
  React5.useEffect(() => {
    if (src || failed || !file || kind !== "image") return void 0;
    const node = holderRef.current;
    if (!node) return void 0;
    if (typeof IntersectionObserver !== "function") {
      void load();
      return void 0;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        void load();
      }
    }, { rootMargin: "200px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [file, kind, src, failed]);
  if (!file) return null;
  const label = item.name || (kind === "image" ? t("archive.image") : kind === "video" ? t("archive.video") : t("archive.file"));
  const sizeText = humanSize(Number(item.size ?? 0));
  const downloadFile = async () => {
    const url = src || await load();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = label;
    a.click();
  };
  if (kind === "file") {
    return h(
      "div",
      { className: "qbot-archMedia is-file", ref: holderRef },
      h(
        "button",
        {
          type: "button",
          className: "qbot-archMediaBtn is-file",
          onClick: () => void downloadFile(),
          title: label,
          "aria-label": label
        },
        h("span", { className: "qbot-archMediaIcon", "aria-hidden": "true" }, "⭳"),
        h("span", { className: "qbot-archMediaName" }, label),
        sizeText ? h("span", { className: "qbot-archMediaSize" }, sizeText) : null
      ),
      failed ? h("span", { className: "qbot-archMediaErr" }, t("archive.mediaFailed")) : null
    );
  }
  if (kind === "video") {
    return h(
      "div",
      { className: "qbot-archMedia is-video", ref: holderRef },
      expanded ? h("video", {
        className: "qbot-archMediaVideo",
        src: src || void 0,
        controls: true,
        preload: "metadata",
        poster: void 0
      }) : h(
        "button",
        {
          type: "button",
          className: "qbot-archMediaBtn is-video",
          onClick: () => {
            onToggle();
            if (!src) void load();
          },
          title: label,
          "aria-label": label
        },
        h("span", { className: "qbot-archMediaIcon", "aria-hidden": "true" }, "▶"),
        h("span", { className: "qbot-archMediaName" }, label),
        sizeText ? h("span", { className: "qbot-archMediaSize" }, sizeText) : null
      ),
      failed ? h("span", { className: "qbot-archMediaErr" }, t("archive.mediaFailed")) : null
    );
  }
  return h(
    "div",
    { className: "qbot-archMedia", ref: holderRef },
    h(
      "button",
      {
        type: "button",
        className: `qbot-archMediaBtn${expanded ? " is-expanded" : ""}`,
        onClick: onToggle,
        title: label,
        "aria-label": label
      },
      src ? h("img", { className: "qbot-archMediaImg", src, alt: label, loading: "lazy" }) : h(
        "span",
        { className: "qbot-archMediaPlaceholder" },
        failed ? t("archive.mediaFailed") : loading ? t("archive.mediaLoading") : t("archive.image")
      ),
      h("span", { className: "qbot-archMediaName" }, label)
    )
  );
}

// src/client/dialogs/archive-dialog.tsx
function chatKey(scope, openid) {
  return `${scope}:${openid}`;
}
function fmtMonth(month) {
  const [y, m] = month.split("-");
  if (y && m) return `${y}年${Number(m)}月`;
  return month;
}
function chatTitle(c, info) {
  const tail = String(c.openid ?? "").slice(-6);
  if (c.scope === "c2c") return c.name || `用户 ${tail}`;
  if (info?.group_name) return info.group_name;
  return c.lastSenderName ? `群 · ${c.lastSenderName}` : `群 ${tail}`;
}
var FACE_TAG_RE = /<faceType=[^>]*>/g;
function faceSegments(content) {
  const out = [];
  let last = 0;
  for (const m of content.matchAll(FACE_TAG_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push({ face: false, text: content.slice(last, idx) });
    out.push({ face: true, text: "" });
    last = idx + m[0].length;
  }
  if (last < content.length) out.push({ face: false, text: content.slice(last) });
  return out;
}
function faceClean(content, label) {
  return content.replace(FACE_TAG_RE, label);
}
function Avatar(p) {
  const s = p.size ?? 40;
  const common = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };
  let glyph;
  if (p.kind === "bot") {
    glyph = h(
      "g",
      null,
      h("rect", { x: 5, y: 7, width: 14, height: 11, rx: 3 }),
      h("path", { d: "M12 4v3" }),
      h("circle", { cx: 12, cy: 3, r: 0.9, fill: "currentColor", stroke: "none" }),
      h("circle", { cx: 9.3, cy: 12.5, r: 1, fill: "currentColor", stroke: "none" }),
      h("circle", { cx: 14.7, cy: 12.5, r: 1, fill: "currentColor", stroke: "none" })
    );
  } else if (p.kind === "group") {
    glyph = h(
      "g",
      null,
      h("circle", { cx: 9, cy: 9, r: 3 }),
      h("circle", { cx: 17, cy: 10, r: 2.3 }),
      h("path", { d: "M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" }),
      h("path", { d: "M14.5 19c0-2.2 1.4-3.7 3.2-3.9" })
    );
  } else {
    glyph = h(
      "g",
      null,
      h("circle", { cx: 12, cy: 8.5, r: 3.4 }),
      h("path", { d: "M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" })
    );
  }
  return h(
    "span",
    { className: `qbot-avatar qbot-avatar-${p.kind}` },
    h("svg", { ...common, "aria-hidden": "true" }, glyph)
  );
}
function miniAvatar(kind) {
  return h(
    "span",
    { className: `qbot-avatar qbot-avatar-${kind} qbot-avatarXs` },
    h(
      "svg",
      { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
      kind === "group" ? h("g", null, h("circle", { cx: 9, cy: 9, r: 3 }), h("circle", { cx: 17, cy: 10, r: 2.3 }), h("path", { d: "M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" }), h("path", { d: "M14.5 19c0-2.2 1.4-3.7 3.2-3.9" })) : h("g", null, h("circle", { cx: 12, cy: 8.5, r: 3.4 }), h("path", { d: "M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" }))
    )
  );
}
var pad2 = (n) => String(n).padStart(2, "0");
var RECORDS_PAGE = 300;
var isoOf = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
var dispDate = (iso) => iso.replaceAll("-", "/");
var DATE_WD = {
  cn: ["一", "二", "三", "四", "五", "六", "日"],
  en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
};
var DATE_MON = {
  cn: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};
function DateRangePicker(props) {
  const { from, to, marked, defaultMonth, onChange, label } = props;
  const locale = useLocale();
  const [open, setOpen] = React6.useState(false);
  const [view, setView] = React6.useState(() => {
    const now = /* @__PURE__ */ new Date();
    return { y: now.getFullYear(), m: now.getMonth() + 1 };
  });
  const rootRef = React6.useRef(null);
  React6.useEffect(() => {
    if (!open) return;
    const base = (from || defaultMonth || "").slice(0, 7);
    const parts = base.split("-").map(Number);
    if (parts.length === 2 && parts.every((n) => Number.isFinite(n))) setView({ y: parts[0], m: parts[1] });
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc, true);
    return () => document.removeEventListener("pointerdown", onDoc, true);
  }, [open, from, defaultMonth]);
  const shiftMonth = (delta) => {
    setView((v) => {
      const d = new Date(v.y, v.m - 1 + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() + 1 };
    });
  };
  const pick = (iso) => {
    if (!from || from && to) {
      onChange(iso, "");
      return;
    }
    if (iso < from) onChange(iso, from);
    else onChange(from, iso);
  };
  const active = Boolean(from || to);
  const btnLabel = from && to ? `${dispDate(from)} ~ ${dispDate(to)}` : from ? `${dispDate(from)} ~ …` : t("archive.dateAll");
  const lead = (new Date(view.y, view.m - 1, 1).getDay() + 6) % 7;
  const daysIn = new Date(view.y, view.m, 0).getDate();
  const cells = [];
  for (let i = lead; i >= 1; i -= 1) {
    const d = new Date(view.y, view.m - 1, 1 - i);
    cells.push({ iso: isoOf(d), day: d.getDate(), out: true });
  }
  for (let d = 1; d <= daysIn; d += 1) cells.push({ iso: `${view.y}-${pad2(view.m)}-${pad2(d)}`, day: d, out: false });
  {
    const tail = (7 - cells.length % 7) % 7;
    for (let i = 1; i <= tail; i += 1) {
      const d = new Date(view.y, view.m, i);
      cells.push({ iso: isoOf(d), day: d.getDate(), out: true });
    }
  }
  return h(
    "div",
    { className: "qbot-archDateWrap", ref: rootRef },
    h(
      "button",
      {
        type: "button",
        className: `qbot-archDateBtn${active ? " is-on" : ""}`,
        onClick: () => setOpen((v) => !v),
        "aria-label": label,
        "aria-expanded": open,
        title: label
      },
      h(
        "svg",
        { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
        h("rect", { x: 3.5, y: 5, width: 17, height: 15.5, rx: 3 }),
        h("path", { d: "M3.5 9.5h17" }),
        h("path", { d: "M8 3v3M16 3v3" })
      ),
      h("span", { className: "qbot-archDateBtnText" }, btnLabel)
    ),
    open ? h(
      "div",
      { className: "qbot-archDatePanel", role: "dialog", "aria-label": label },
      h(
        "div",
        { className: "qbot-archDateHead" },
        h("button", { type: "button", className: "qbot-archDateNav", "aria-label": "‹", onClick: () => shiftMonth(-1) }, "‹"),
        h("span", { className: "qbot-archDateTitle" }, locale === "en" ? `${DATE_MON[locale][view.m - 1]} ${view.y}` : `${view.y}年${DATE_MON[locale][view.m - 1]}`),
        h("button", { type: "button", className: "qbot-archDateNav", "aria-label": "›", onClick: () => shiftMonth(1) }, "›")
      ),
      h(
        "div",
        { className: "qbot-archDateGrid" },
        DATE_WD[locale].map((w) => h("span", { key: `wd-${w}`, className: "qbot-archDateWd" }, w)),
        cells.map((c) => {
          const cls = [
            "qbot-archDateCell",
            c.out ? "is-out" : "",
            marked.has(c.iso) ? "is-marked" : "",
            c.iso === from || c.iso === to ? "is-edge" : "",
            from && to && c.iso > from && c.iso < to ? "is-inrange" : ""
          ].filter(Boolean).join(" ");
          return h("button", {
            key: c.iso,
            type: "button",
            className: cls,
            disabled: c.out,
            onClick: () => pick(c.iso)
          }, String(c.day));
        })
      ),
      h(
        "div",
        { className: "qbot-archDateFoot" },
        h("button", {
          type: "button",
          className: "qbot-archDateClear",
          onClick: () => {
            onChange("", "");
          }
        }, t("archive.dateClear")),
        h("span", { className: "qbot-archDateHint" }, from && !to ? t("archive.dateHint") : t("archive.dateMarkHint"))
      )
    ) : null
  );
}
function MemberPicker(props) {
  const { value, options, onChange, label, allText } = props;
  const [open, setOpen] = React6.useState(false);
  const rootRef = React6.useRef(null);
  React6.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc, true);
    return () => document.removeEventListener("pointerdown", onDoc, true);
  }, [open]);
  const pick = (v) => {
    onChange(v);
    setOpen(false);
  };
  const current = options.find((o) => o.value === value);
  return h(
    "div",
    { className: "qbot-archMemberWrap", ref: rootRef },
    h(
      "button",
      {
        type: "button",
        className: `qbot-archMemberBtn${value ? " is-on" : ""}`,
        onClick: () => setOpen((v) => !v),
        "aria-label": label,
        "aria-expanded": open,
        title: value ? current?.label ?? value : label
      },
      h("span", { className: "qbot-archMemberBtnText" }, value ? current?.label ?? value : allText),
      h(
        "svg",
        { className: "qbot-archMemberCaret", width: 12, height: 12, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
        h("path", { d: "M6 9l6 6 6-6" })
      )
    ),
    open ? h(
      "div",
      { className: "qbot-archMemberPanel", role: "listbox", "aria-label": label },
      h("button", {
        type: "button",
        role: "option",
        "aria-selected": !value,
        className: `qbot-archMemberItem${!value ? " is-on" : ""}`,
        title: allText,
        onClick: () => pick("")
      }, allText),
      options.map((o) => h("button", {
        key: o.value,
        type: "button",
        role: "option",
        "aria-selected": o.value === value,
        className: `qbot-archMemberItem${o.value === value ? " is-on" : ""}`,
        title: o.label,
        onClick: () => pick(o.value)
      }, o.label))
    ) : null
  );
}
function ArchiveDialog(props) {
  const { rpcCall, detailAppId, onClose } = props;
  const [loadingChats, setLoadingChats] = React6.useState(true);
  const [error, setError] = React6.useState("");
  const [chats, setChats] = React6.useState([]);
  const [expanded, setExpanded] = React6.useState(/* @__PURE__ */ new Set());
  const [active, setActive] = React6.useState(null);
  const [loadingRecords, setLoadingRecords] = React6.useState(false);
  const [records, setRecords] = React6.useState([]);
  const [visibleCount, setVisibleCount] = React6.useState(RECORDS_PAGE);
  const [search, setSearch] = React6.useState("");
  const [member, setMember] = React6.useState("");
  const [rangeFrom, setRangeFrom] = React6.useState("");
  const [rangeTo, setRangeTo] = React6.useState("");
  const [expandedMedia, setExpandedMedia] = React6.useState("");
  const [profiles, setProfiles] = React6.useState({});
  const [selfInfo, setSelfInfo] = React6.useState({});
  React6.useEffect(() => {
    let alive = true;
    void Promise.resolve(rpcCall("platform.selfInfo", detailAppId ? { appId: detailAppId } : {})).then((res) => {
      if (!alive || !res.ok) return;
      const data = val(res) ?? {};
      if (data.username || data.avatar) setSelfInfo({ name: data.username, avatar: data.avatar });
    }).catch(() => void 0);
    return () => {
      alive = false;
    };
  }, [rpcCall, detailAppId]);
  const groupInfoMap = useGroupInfos(
    rpcCall,
    detailAppId ?? "",
    [...new Set(chats.filter((c) => c.scope === "group").map((c) => c.openid))]
  );
  React6.useEffect(() => {
    const openids = [.../* @__PURE__ */ new Set([
      ...chats.filter((c) => c.scope === "c2c" && c.openid).map((c) => c.openid),
      ...records.filter((r) => r.kind === "inbound" && typeof r.sender === "string" && r.sender).map((r) => String(r.sender))
    ])].slice(0, 30);
    const missing = openids.filter((o) => !profiles[o]);
    if (!missing.length) return;
    let alive = true;
    rpcCall("platform.userInfo", { ...detailAppId ? { appId: detailAppId } : {}, openids: missing }).then((res) => {
      if (!alive || !res.ok) return;
      const users = val(res)?.users ?? {};
      if (Object.keys(users).length) {
        setProfiles((prev) => ({ ...prev, ...users }));
      } else {
        setProfiles((prev) => ({ ...prev, ...Object.fromEntries(missing.map((o) => [o, {}])) }));
      }
    }).catch(() => void 0);
    return () => {
      alive = false;
    };
  }, [chats, records, rpcCall, detailAppId]);
  const loadChats = React6.useCallback(async (preferKey = "", preferMonth = "") => {
    setLoadingChats(true);
    setError("");
    try {
      const res = await rpcCall("archive.chats", detailAppId ? { appId: detailAppId } : {});
      if (!res.ok) {
        setError(errText(res.error));
        return;
      }
      const v = val(res) ?? {};
      const list = Array.isArray(v.chats) ? v.chats : [];
      setChats(list);
      const pick = list.find((c) => chatKey(c.scope, c.openid) === preferKey) ?? list[0] ?? null;
      if (pick) {
        const key = chatKey(pick.scope, pick.openid);
        const month = preferKey && preferMonth ? preferMonth : pick.months?.[0]?.month ?? "";
        setExpanded((prev) => new Set(prev).add(key));
        await selectChat({ scope: pick.scope, openid: pick.openid, key, title: chatTitle(pick), month });
      } else {
        setActive(null);
        setRecords([]);
      }
    } catch (error2) {
      setError(errText(error2));
    } finally {
      setLoadingChats(false);
    }
  }, [rpcCall, detailAppId]);
  const loadRecords = React6.useCallback(async (chat) => {
    setLoadingRecords(true);
    setError("");
    try {
      const res = await rpcCall("archive.chat", {
        chat: chat.key,
        month: chat.month,
        ...detailAppId ? { appId: detailAppId } : {},
        limit: 1e5,
        offset: 0,
        order: "desc"
      });
      if (!res.ok) {
        setError(errText(res.error));
        return;
      }
      const v = val(res) ?? {};
      setRecords(Array.isArray(v.records) ? v.records : []);
    } catch (error2) {
      setError(errText(error2));
    } finally {
      setLoadingRecords(false);
    }
  }, [rpcCall, detailAppId]);
  const selectChat = React6.useCallback(async (chat) => {
    setActive(chat);
    setSearch("");
    setMember("");
    setRangeFrom("");
    setRangeTo("");
    setVisibleCount(RECORDS_PAGE);
    setExpanded((prev) => new Set(prev).add(chat.key));
    await loadRecords(chat);
  }, [loadRecords]);
  const removeChat = async (chat) => {
    const month = chat.month || "";
    if (!month) {
      setError(t("archive.deleteMonthRequired"));
      return;
    }
    if (!await confirmDlg({ message: fmt("archive.deleteMonthConfirm", chat.title, fmtMonth(month)), danger: true })) return;
    setError("");
    const res = await rpcCall("archive.removeChat", { chat: chat.key, month, ...detailAppId ? { appId: detailAppId } : {} });
    if (!res.ok) {
      setError(errText(res.error));
      return;
    }
    setRecords([]);
    setVisibleCount(RECORDS_PAGE);
    await loadChats(chat.key, "");
  };
  const toggleGroup = React6.useCallback((key) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);
  React6.useEffect(() => {
    void loadChats("", "");
  }, [loadChats]);
  const c2cList = chats.filter((c) => c.scope === "c2c");
  const groupList = chats.filter((c) => c.scope === "group");
  const activeGroupInfo = active?.scope === "group" ? groupInfoMap[active.openid] : void 0;
  const activeTitle = active ? activeGroupInfo?.group_name || active.title : "";
  const groupMeta = activeGroupInfo && (activeGroupInfo.group_member_num || activeGroupInfo.group_class_text || (activeGroupInfo.group_tags?.length ?? 0) > 0 || activeGroupInfo.group_finger_memo) ? h(
    "div",
    { className: "qbot-archGroupMeta" },
    activeGroupInfo.group_member_num ? h("span", null, fmt("archive.groupMemberNum", String(activeGroupInfo.group_member_num))) : null,
    activeGroupInfo.group_class_text ? h("span", null, fmt("archive.groupClass", activeGroupInfo.group_class_text)) : null,
    (activeGroupInfo.group_tags?.length ?? 0) > 0 ? h("span", null, fmt("archive.groupTags", (activeGroupInfo.group_tags ?? []).join("、"))) : null,
    activeGroupInfo.group_finger_memo ? h("span", { title: activeGroupInfo.group_finger_memo }, fmt("archive.groupMemo", activeGroupInfo.group_finger_memo)) : null
  ) : null;
  const kw = search.trim().toLowerCase();
  const filtersActive = Boolean(kw || member || rangeFrom || rangeTo);
  const matchRecord = React6.useCallback((r) => {
    const sender = String(r.senderName || r.sender || "");
    if (member && sender !== member) return false;
    if (rangeFrom || rangeTo) {
      const d = String(r.ts ?? "").slice(0, 10);
      if (rangeFrom && d < rangeFrom) return false;
      if (rangeTo && d > rangeTo) return false;
    }
    if (kw) {
      const recalledTag = r.recalled === true ? `
${t("archive.recalled")}` : "";
      const hay = `${sender}
${faceClean(String(r.content ?? ""), t("archive.sticker"))}
${String(r.note ?? "")}${recalledTag}`.toLowerCase();
      if (!hay.includes(kw)) return false;
    }
    return true;
  }, [member, rangeFrom, rangeTo, kw]);
  const matched = filtersActive ? records.filter(matchRecord) : records;
  const visible = matched.slice(0, visibleCount);
  const exportCsv = (chat) => {
    try {
      const all = filtersActive ? records.filter(matchRecord) : records;
      const rows = [...all].reverse();
      const esc = (s) => `"${s.replaceAll('"', '""')}"`;
      const lines = [
        [t("archive.colTime"), t("archive.colType"), t("archive.colSender"), t("archive.colContent"), t("archive.colNote")].map(esc).join(",")
      ];
      for (const r of rows) {
        const isBot = r.kind === "reply" || r.kind === "proactive";
        const kindLabel = r.kind === "reply" ? t("archive.kindReply") : r.kind === "proactive" ? t("archive.kindProactive") : t("archive.kindInbound");
        const name2 = isBot ? t("idpick.bot") : String(r.senderName || r.sender || "") || (chat.scope === "group" ? t("archive.member") : t("archive.them"));
        const noteParts = [String(r.note ?? "")];
        if (r.recalled === true) noteParts.unshift(t("archive.recalled"));
        lines.push([
          String(r.ts ?? ""),
          kindLabel,
          name2,
          String(r.content ?? ""),
          noteParts.filter(Boolean).join(" · ")
        ].map(esc).join(","));
      }
      const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${chat.title}-${chat.month}.csv`.replace(/[\\/:*?"<>|]/g, "_");
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error2) {
      setError(errText(error2));
    }
  };
  const markedDays = React6.useMemo(() => {
    const s = /* @__PURE__ */ new Set();
    for (const r of records) {
      const d = String(r.ts ?? "").slice(0, 10);
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) s.add(d);
    }
    return s;
  }, [records]);
  const memberOptions = [];
  if (active?.scope === "group") {
    const seen = /* @__PURE__ */ new Set();
    for (const r of records) {
      const name2 = String(r.senderName || r.sender || "").trim();
      if (!name2 || seen.has(name2)) continue;
      seen.add(name2);
      memberOptions.push({ value: name2, label: name2 });
    }
    memberOptions.sort((a, b) => a.label.localeCompare(b.label));
  }
  const quoteByIndex = new Array(visible.length).fill(null);
  {
    let lastInbound = null;
    for (let i = visible.length - 1; i >= 0; i -= 1) {
      const r = visible[i];
      const isBot = r.kind === "reply" || r.kind === "proactive";
      const name2 = isBot ? t("idpick.bot") : r.senderName || r.sender || (active?.scope === "group" ? t("archive.member") : t("archive.them"));
      if (r.kind === "reply") quoteByIndex[i] = lastInbound;
      if (r.kind === "inbound") lastInbound = { name: name2, content: faceClean(String(r.content ?? ""), t("archive.sticker")) };
    }
  }
  const monthGroups = [];
  for (const r of visible) {
    const m = (r.ts || "").slice(0, 7);
    const g = monthGroups[monthGroups.length - 1];
    if (g && g.month === m) g.items.push(r);
    else monthGroups.push({ month: m, items: [r] });
  }
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
      error ? h("div", { className: "qbot-modalAlert", role: "alert" }, error) : null,
      h(
        "div",
        { className: `qbot-archSplit${loadingRecords ? " is-refreshing" : ""}` },
        // 左栏：会话 → 月份 两级折叠树
        h(
          "div",
          { className: "qbot-archSide", "aria-label": t("archive.chatsList") },
          loadingChats ? h("div", { className: "qbot-modalState qbot-modalStateInline" }, h("span", { className: "qbot-spinner", "aria-hidden": "true" }), t("archive.loadingChats")) : chats.length === 0 ? h("div", { className: "qbot-archSideEmpty" }, t("archive.noChats")) : h(
            "div",
            { className: "qbot-archChats" },
            c2cList.length > 0 ? h(
              "div",
              { className: "qbot-convSection" },
              h("div", { className: "qbot-convSectionTitle" }, t("archive.people")),
              c2cList.map((c) => renderConvGroup(c, active, expanded, selectChat, toggleGroup, groupInfoMap, profiles))
            ) : null,
            groupList.length > 0 ? h(
              "div",
              { className: "qbot-convSection" },
              h("div", { className: "qbot-convSectionTitle" }, t("archive.groups")),
              groupList.map((c) => renderConvGroup(c, active, expanded, selectChat, toggleGroup, groupInfoMap, profiles))
            ) : null
          )
        ),
        // 右栏：选中会话+月份的记录（倒序、按月分组、可翻页）
        h(
          "div",
          { className: "qbot-archMain" },
          !active ? h("div", { className: "qbot-archState" }, h("div", { className: "qbot-modalState" }, t("archive.pickMonth"))) : h(
            "div",
            { className: "qbot-archChatHead" },
            h(
              "div",
              { className: "qbot-archChatTitleWrap" },
              h(
                "div",
                { className: "qbot-archChatTitle" },
                active.scope === "c2c" && profiles[active.openid]?.avatar ? h("img", { className: "qbot-avatarImg qbot-convMonthAvatarImg", src: profiles[active.openid].avatar, alt: "", loading: "lazy", referrerPolicy: "no-referrer" }) : h(
                  "span",
                  { className: `qbot-avatar qbot-avatar-${active.scope === "group" ? "group" : "person"} qbot-avatarSm` },
                  h(
                    "svg",
                    { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
                    active.scope === "group" ? h("g", null, h("circle", { cx: 9, cy: 9, r: 3 }), h("circle", { cx: 17, cy: 10, r: 2.3 }), h("path", { d: "M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" }), h("path", { d: "M14.5 19c0-2.2 1.4-3.7 3.2-3.9" })) : h("g", null, h("circle", { cx: 12, cy: 8.5, r: 3.4 }), h("path", { d: "M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" }))
                  )
                ),
                h("span", null, `${activeTitle} · ${fmtMonth(active.month)}`)
              ),
              groupMeta
            ),
            h(
              "div",
              { className: "qbot-archChatActions" },
              h("button", {
                type: "button",
                className: "qbot-archChatDel",
                "aria-label": t("archive.exportCsv"),
                title: t("archive.exportCsvHint"),
                disabled: false,
                onClick: () => void exportCsv(active)
              }, h(
                "svg",
                { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
                h("path", { d: "M12 4v11" }),
                h("path", { d: "M7.5 11.5 12 16l4.5-4.5" }),
                h("path", { d: "M4.5 19.5h15" })
              )),
              h("button", {
                type: "button",
                className: "qbot-archChatDel",
                "aria-label": fmt("archive.deleteMonthLabel", active.title, fmtMonth(active.month)),
                title: t("archive.deleteMonthHint"),
                onClick: () => void removeChat(active)
              }, h(
                "svg",
                { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
                h("path", { d: "M4 7h16" }),
                h("path", { d: "M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" }),
                h("path", { d: "M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" }),
                h("path", { d: "M10 11v6M14 11v6" })
              ))
            )
          ),
          // 筛选栏（仿聊天记录搜索）：关键词 / 群成员（仅群聊且有候选）/ 日期，客户端过滤已加载记录。
          // 筛选栏（仿聊天记录搜索）：关键词 / 群成员（仅群聊且有候选）/ 日期，客户端过滤已加载记录。
          active ? h(
            "div",
            { className: "qbot-archSearchBar" },
            h(
              "div",
              { className: "qbot-archSearchBox" },
              h(
                "svg",
                { className: "qbot-archSearchIcon", width: 15, height: 15, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
                h("circle", { cx: 11, cy: 11, r: 7 }),
                h("path", { d: "M20 20l-3.5-3.5" })
              ),
              h("input", {
                type: "text",
                className: "qbot-archSearchInput",
                placeholder: t("archive.searchPlaceholder"),
                value: search,
                onChange: (ev) => setSearch(ev.target.value),
                "aria-label": t("archive.searchPlaceholder")
              }),
              // ×常驻占位（visibility 切换）：有无文字都不增减节点，避免布局抖动。
              h("button", {
                type: "button",
                className: "qbot-archSearchX",
                "aria-label": t("archive.clearFilters"),
                style: { visibility: search ? "visible" : "hidden" },
                tabIndex: search ? 0 : -1,
                disabled: !search,
                onClick: () => setSearch("")
              }, "×")
            ),
            active.scope === "group" && memberOptions.length > 0 ? h(MemberPicker, {
              value: member,
              options: memberOptions,
              onChange: (v) => setMember(v),
              label: t("archive.memberFilter"),
              allText: t("archive.memberAll")
            }) : null,
            h(DateRangePicker, {
              from: rangeFrom,
              to: rangeTo,
              marked: markedDays,
              defaultMonth: active?.month || "",
              onChange: (f, tt) => {
                setRangeFrom(f);
                setRangeTo(tt);
              },
              label: t("archive.dayFilter")
            })
          ) : null,
          h(
            "div",
            { className: "qbot-msgList" },
            loadingRecords && records.length === 0 ? h("div", { className: "qbot-modalState" }, h("span", { className: "qbot-spinner", "aria-hidden": "true" }), t("archive.loading")) : matched.length === 0 ? h("div", { className: "qbot-modalState" }, filtersActive ? t("archive.filterNoMatch") : t("archive.chatEmpty")) : monthGroups.map((group) => h(
              "div",
              { className: "qbot-monthGroup", key: group.month },
              h(
                "div",
                { className: "qbot-monthDivider" },
                h("span", { className: "qbot-monthDividerLabel" }, group.month ? fmtMonth(group.month) : t("archive.unknownMonth")),
                h("span", { className: "qbot-monthDividerCount" }, fmt("archive.monthCount", group.items.length))
              ),
              group.items.map((r, i) => {
                const isBot = r.kind === "reply" || r.kind === "proactive";
                const isRecalled = r.recalled === true;
                const profile = !isBot && typeof r.sender === "string" ? profiles[r.sender] : void 0;
                const name2 = isBot ? selfInfo.name || t("idpick.bot") : r.senderName || profile?.name || r.sender || (active?.scope === "group" ? t("archive.member") : t("archive.them"));
                const avatarKind = isBot ? "bot" : active?.scope === "group" ? "group" : "person";
                const avatarUrl = isBot ? selfInfo.avatar : profile?.avatar;
                const quote = r.kind === "reply" ? quoteByIndex[i] : null;
                const content = String(r.content ?? "");
                const useMd = isBot || looksLikeMarkdown(content);
                const faceSegs = faceSegments(content);
                const hasFace = faceSegs.some((s) => s.face);
                const media = Array.isArray(r.media) ? r.media : [];
                const mediaSkipped = Array.isArray(r.mediaSkipped) ? r.mediaSkipped : [];
                return h(
                  "div",
                  { key: `${r.ts ?? ""}-${i}`, className: `qbot-msgCard ${isBot ? "is-bot" : "is-user"}` },
                  h(
                    "div",
                    { className: "qbot-msgAvatar" },
                    avatarUrl ? h("img", { className: "qbot-avatarImg", src: avatarUrl, alt: "", loading: "lazy", referrerPolicy: "no-referrer" }) : h(Avatar, { kind: avatarKind })
                  ),
                  h(
                    "div",
                    { className: "qbot-msgBody" },
                    h(
                      "div",
                      { className: "qbot-msgHead" },
                      h("span", { className: "qbot-msgName" }, name2),
                      isRecalled ? h("span", { className: "qbot-msgRecalled" }, t("archive.recalled")) : null,
                      h("span", { className: "qbot-msgTime" }, formatTime(r.ts))
                    ),
                    quote ? h(
                      "div",
                      { className: "qbot-msgQuote" },
                      h("div", { className: "qbot-msgQuoteName" }, quote.name),
                      h("div", { className: "qbot-msgQuoteText" }, quote.content)
                    ) : null,
                    isRecalled && !content && media.length === 0 ? h("div", { className: "qbot-msgText qbot-msgRecalledHint" }, t("archive.recalledNoContent")) : hasFace ? h(
                      "div",
                      { className: "qbot-msgText" },
                      faceSegs.map((s, si) => s.face ? h("span", { className: "qbot-msgFace", key: `f${si}` }, t("archive.sticker")) : s.text ? h("span", { key: `t${si}` }, s.text) : null)
                    ) : useMd ? h("div", {
                      className: "qbot-msgText qbot-md",
                      dangerouslySetInnerHTML: { __html: renderMarkdown(content) }
                    }) : h("div", { className: "qbot-msgText" }, content),
                    media.length > 0 ? h(
                      "div",
                      { className: "qbot-archMediaList" },
                      media.map((m, mi) => h(ArchivedMediaView, {
                        key: `${String(m.file ?? "")}-${mi}`,
                        rpcCall,
                        item: m,
                        expanded: expandedMedia === `${i}:${mi}`,
                        onToggle: () => setExpandedMedia((prev) => prev === `${i}:${mi}` ? "" : `${i}:${mi}`)
                      }))
                    ) : null,
                    mediaSkipped.length > 0 ? h(
                      "div",
                      { className: "qbot-msgNote" },
                      mediaSkipped.map((s, si) => h(
                        "div",
                        { key: `s${si}` },
                        fmt("archive.mediaSkippedItem", String(s?.name ?? "(未命名)"), String(s?.reason ?? "未知原因"))
                      ))
                    ) : null,
                    r.note && r.kind !== "reply" ? h("div", { className: "qbot-msgNote" }, String(r.note)) : null
                  )
                );
              })
            ))
          ),
          // 底栏：统计 + 分页动作（分页基于筛选后的结果；数据已是全量，无需提示加载限制）。
          active && records.length > 0 ? h(
            "div",
            { className: "qbot-archFoot" },
            h("span", { className: "qbot-archFootInfo" }, fmt("archive.shownOf", visible.length, matched.length)),
            visibleCount < matched.length ? h(
              "div",
              { className: "qbot-archFootMore" },
              h("button", { type: "button", className: "qbot-archFootLink", disabled: loadingRecords, onClick: () => setVisibleCount(visibleCount + RECORDS_PAGE) }, t("archive.loadMore")),
              h("span", { className: "qbot-archFootSep" }, "·"),
              h("button", { type: "button", className: "qbot-archFootLink", disabled: loadingRecords, onClick: () => setVisibleCount(matched.length) }, t("archive.showAll"))
            ) : null
          ) : null
        )
      ),
      h(
        "div",
        { className: "qbot-modalFoot" },
        h("span", { className: "qbot-hint" }, ""),
        h(
          "div",
          { className: "qbot-viewActions" },
          h("button", { className: "qbot-btn", type: "button", disabled: loadingChats || loadingRecords, onClick: () => void loadChats(active?.key ?? "", active?.month ?? "") }, t("common.refresh")),
          h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: onClose }, t("common.close"))
        )
      )
    )
  );
}
function renderConvGroup(c, active, expanded, selectChat, toggleGroup, groupInfoMap, profiles) {
  const key = chatKey(c.scope, c.openid);
  const isOpen = expanded.has(key);
  const info = c.scope === "group" ? groupInfoMap[c.openid] : void 0;
  const title = chatTitle(c, info);
  const memberNum = info?.group_member_num;
  const personAvatar = c.scope === "c2c" ? profiles[c.openid]?.avatar : void 0;
  return h(
    "div",
    { key, className: `qbot-convGroup${isOpen ? " is-open" : ""}` },
    h(
      "div",
      { className: "qbot-convGroupHeadRow" },
      h(
        "button",
        {
          type: "button",
          className: "qbot-convGroupHead",
          onClick: () => toggleGroup(key),
          "aria-expanded": isOpen,
          title
        },
        personAvatar ? h("img", { className: "qbot-avatarImg qbot-convAvatarImg", src: personAvatar, alt: "", loading: "lazy", referrerPolicy: "no-referrer" }) : h(Avatar, { kind: c.scope === "group" ? "group" : "person", size: 34 }),
        h("span", { className: "qbot-convGroupName" }, title),
        memberNum && memberNum > 0 ? h("span", { className: "qbot-convGroupMembers", title: fmt("archive.groupMemberNum", String(memberNum)) }, fmt("archive.groupMembersShort", String(memberNum))) : null,
        h("span", { className: "qbot-convGroupCount", title: t("archive.monthCountTotal") }, `${c.count}`),
        h(
          "svg",
          { className: "qbot-chevron", width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" },
          h("path", { d: "M9 6l6 6-6 6" })
        )
      )
    ),
    isOpen ? h(
      "div",
      { className: "qbot-convMonths" },
      (c.months?.length ?? 0) > 0 ? c.months.map((m) => {
        const isActive = active?.key === key && active.month === m.month;
        return h(
          "button",
          {
            type: "button",
            key: m.month,
            className: `qbot-convMonth${isActive ? " is-active" : ""}`,
            onClick: () => void selectChat({ scope: c.scope, openid: c.openid, key, title, month: m.month }),
            title: fmtMonth(m.month)
          },
          personAvatar ? h("img", { className: "qbot-avatarImg qbot-convMonthAvatarImg", src: personAvatar, alt: "", loading: "lazy", referrerPolicy: "no-referrer" }) : miniAvatar(c.scope === "group" ? "group" : "person"),
          h(
            "span",
            { className: "qbot-convMonthMeta" },
            h("span", { className: "qbot-convMonthName" }, fmtMonth(m.month)),
            h("span", { className: "qbot-convMonthSub" }, title)
          ),
          h("span", { className: "qbot-convMonthCount" }, `${m.count}`)
        );
      }) : h("div", { className: "qbot-convMonthEmpty" }, t("archive.noMonths"))
    ) : null
  );
}

// src/client/dialogs/config-manifest-dialog.tsx
var React7 = __toESM(require("react"), 1);

// src/client/config-manifest.ts
var CONFIG_GROUPS = [
  { id: "session", label: ["会话与模型", "Session & model"], desc: ["工作区、模型路由与权限预设", "Workspace, model routing & permission preset"] },
  { id: "access", label: ["接入与范围", "Access & scope"], desc: ["允许哪些群 / 用户、是否响应机器人", "Which groups / users are allowed, bot-to-bot replies"] },
  { id: "reply", label: ["消息与回复", "Messages & replies"], desc: ["回复格式、引用、上下文与全量回复策略", "Reply format, quoting, context & full-group policy"] },
  { id: "pacing", label: ["节奏与调优", "Pacing & tuning"], desc: ["冷却、分块、阈值与频次", "Cooldowns, chunking, thresholds & frequency"] },
  { id: "archive", label: ["归档", "Archive"], desc: ["消息与媒体落盘", "Message & media persistence"] },
  { id: "voice", label: ["语音与文件", "Voice & files"], desc: ["ASR / TTS、入站图片与文件内容识别", "ASR / TTS, inbound images & file ingestion"] },
  { id: "features", label: ["功能开关", "Feature toggles"], desc: ["欢迎语、审批按钮、记忆、撤回等", "Welcome, approval buttons, memory, recall & more"] },
  { id: "security", label: ["安全与权限", "Security & permissions"], desc: ["净化、SSRF、路径白名单、管理员", "Sanitization, SSRF, path whitelist, admins"] },
  { id: "advanced", label: ["高级 / 传输", "Advanced / transport"], desc: ["接口地址、体积上限等，通常无需修改", "API endpoints, size caps — normally leave as-is"] }
];
var ENUM_ARCHIVE_MEDIA = ["off", "image", "imageVideo", "all"];
var ENUM_QUOTE = ["off", "at", "all"];
var ENUM_VOICE = ["off", "note", "download", "asr", "stt"];
var ENUM_LOCALE = ["zh", "en"];
var CONFIG_FIELDS = [
  // ── 会话与模型 ──────────────────────────────────────────────────────────
  {
    key: "workspacePath",
    group: "session",
    type: "string",
    help: ["Agent 工作区绝对路径，留空使用宿主默认工作区。设置页有目录选择器可直接挑。", "Absolute path to the agent workspace; empty = host default. Use the directory picker in settings."],
    example: ["D:\\projects\\mybot（Windows）或 /home/me/agent（Linux）", "D:\\projects\\mybot (Windows) or /home/me/agent (Linux)"],
    notes: ["路径必须真实存在且可读写；填了不存在的目录会导致会话启动失败。留空最省心。", "The path must exist and be readable/writable; a bad path prevents the session from starting. Leave empty to be safe."]
  },
  {
    key: "agentPreset",
    group: "session",
    type: "string",
    help: ["Agent 预设 id，留空跟随宿主默认。可选值见设置页下拉。", "Agent preset id; empty = host default. See the dropdown in settings."],
    example: ["留空（默认）", "empty (default)"],
    notes: ["手填了下拉里没有的 id，会被宿主忽略或导致该会话加载失败，建议用下拉选。", "An id not in the dropdown is ignored or may break the session; prefer the dropdown."]
  },
  {
    key: "permissionPreset",
    group: "session",
    type: "string",
    help: ["权限预设 id（对话权限注入），留空跟随宿主默认。", "Permission preset id (conversation permission injection); empty = host default."],
    example: ["留空（默认）", "empty (default)"],
    notes: ["无效的 id 会让对话权限注入被跳过，AI 行为约束减弱。", "An invalid id skips permission injection and weakens AI behaviour constraints."]
  },
  {
    key: "model",
    group: "session",
    type: "string",
    help: ['显式模型路由，格式 "provider/model[:输出token上限]"，留空跟随默认模型。', 'Explicit model route, format "provider/model[:maxTokens]"; empty = default model.'],
    example: ["openai/gpt-4o:4096", "openai/gpt-4o:4096"],
    notes: ['缺少 "/" 或模型名写错会导致所有回复失败；冒号后是单次输出 token 上限，省略则用模型默认。', 'Missing "/" or a bad model name breaks all replies. The part after ":" is the max output tokens; omit to use the model default.']
  },
  {
    key: "secretEnv",
    group: "session",
    type: "string",
    help: ["环境变量名，运行时从该环境变量读取 AppSecret。一般留空（凭据已存 credentials.json）。", "Env var name to read AppSecret at runtime. Usually empty (credentials live in credentials.json)."],
    example: ["QQBOT_SECRET", "QQBOT_SECRET"],
    notes: ["填了变量名但系统里没有该环境变量，会导致启动时读不到密钥、连接失败。", "Naming a variable that does not exist makes startup fail to read the secret."]
  },
  // ── 接入与范围 ──────────────────────────────────────────────────────────
  {
    key: "allowC2c",
    group: "access",
    type: "boolean",
    help: ["是否处理单聊（私聊）消息。", "Whether to handle one-to-one (direct) messages."],
    example: ["true（默认，处理私聊）", "true (default, handle direct messages)"],
    notes: ["关闭后私聊消息被全部忽略，但群聊不受影响。", "Off ignores all direct messages; group chats are unaffected."]
  },
  {
    key: "allowGroups",
    group: "access",
    type: "string[]",
    help: ["允许响应的群 openid 列表。", "Group openids allowed to trigger replies."],
    example: ['["*"]（默认，所有群）或 ["<群openid>"]', '["*"] (default, all groups) or ["<group openid>"]'],
    notes: ['数组元素必须是字符串；["*"] 放行所有群，填错 openid 会让对应群静默不回复。', 'Elements must be strings. ["*"] allows all groups; a wrong openid silently silences that group.']
  },
  {
    key: "allowUsers",
    group: "access",
    type: "string[]",
    help: ["允许响应的用户 openid 列表。", "User openids allowed to trigger replies."],
    example: ['["*"]（默认，所有用户）', '["*"] (default, all users)'],
    notes: ["与 allowGroups 同时生效：两个列表都放行才会回复；openid 填错会导致该用户消息被忽略。", "Applied together with allowGroups: both must allow a message. A wrong openid silences that user."]
  },
  {
    key: "respondToBots",
    group: "access",
    type: "boolean",
    help: ["是否响应其它机器人发出的消息。默认关闭。", "Whether to reply to messages sent by other bots. Off by default."],
    example: ["false（默认，不响应机器人）", "false (default, ignore bots)"],
    notes: ["开启后其它机器人的消息也会触发回复，可能造成机器人之间互相刷屏、用量暴涨。", "On makes bots reply to each other, risking reply loops and a spike in usage."]
  },
  // ── 消息与回复 ──────────────────────────────────────────────────────────
  {
    key: "markdownReply",
    group: "reply",
    type: "boolean",
    help: ["回复优先用 QQ Markdown（msg_type=2），被平台拒绝时逐条回退纯文本。", "Prefer QQ Markdown for replies (msg_type=2); falls back to plain text per message if rejected."],
    example: ["true（默认，优先 Markdown）", "true (default, prefer Markdown)"],
    notes: ["Markdown 被平台拒绝时会自动逐条降级，无需手动关闭；关闭则所有回复都用纯文本。", "Rejected Markdown auto-falls back per message; no need to turn it off manually."]
  },
  {
    key: "quoteReply",
    group: "reply",
    type: "enum",
    options: ENUM_QUOTE,
    help: ["出站引用范围（仅群聊）。", "Outbound quote scope (groups only)."],
    example: ['"at"（默认，仅 @ 回复引用）', '"at" (default, quote @ replies only)'],
    notes: ["off=不引用；at=仅 @ 回复引用；all=每条回复都引用，视觉更啰嗦。填其它值会保存失败。", "off=none; at=@ replies only; all=quote every reply (more verbose). Other values fail validation."]
  },
  {
    key: "quoteMaxChars",
    group: "reply",
    type: "number",
    min: 20,
    max: 1e3,
    help: ["入站引用注入模型的被引用原文字数上限，超长截断。", "Max chars of quoted original text injected into the model; truncated if longer."],
    example: ["120（默认）", "120 (default)"],
    notes: ["调太小引用被截得看不懂，调太大增加 token 消耗；必须是 20–1000 的整数。", "Too small truncates quotes unintelligibly; too large costs more tokens. Must be an integer in 20–1000."]
  },
  {
    key: "groupFullReply",
    group: "reply",
    type: "boolean",
    help: ["群全量消息价值回复总开关：关闭后群内只响应 @ 与命令。", "Master switch for value-based replies to all group messages. Off = only @ mentions and commands."],
    example: ["true（默认，全量回复）", "true (default, reply to all)"],
    notes: ["这是控制 token 用量的关键开关；关闭后群里不 @ 机器人就不会收到回复。", "Key switch for token usage. When off, the bot stays silent unless @ mentioned or given a command."]
  },
  {
    key: "proactiveFallback",
    group: "reply",
    type: "boolean",
    help: ["当被动回复凭证失效时，是否降级为主动消息重发。", "Whether to fall back to a proactive message if the passive-reply credential expires."],
    example: ["false（默认，不降级）", "false (default, no fallback)"],
    notes: ["降级依赖主动消息额度，额度不足时同样会失败；开启前请确认配额充足。", "Fallback uses the proactive quota; it still fails when the quota is exhausted."]
  },
  {
    key: "typingIndicator",
    group: "reply",
    type: "boolean",
    help: ["单聊处理期间发送「正在输入」状态，回复发出后停止。", "Show a typing indicator during direct-chat processing."],
    example: ["true（默认，单聊显示）", "true (default, shown in direct chat)"],
    notes: ["平台只支持单聊的「正在输入」状态，在群聊里开启也无效。", "The platform only supports this in direct chat; enabling it in groups has no effect."]
  },
  {
    key: "sanitizeReplies",
    group: "reply",
    type: "boolean",
    help: ["剥离模型输出中的 system-reminder、<think> 等隐藏标签块，防内部内容泄漏。", "Strip hidden tags such as system-reminder / <think> from model output to prevent leaks."],
    example: ["true（默认，剥离）", "true (default, strip)"],
    notes: ["关闭后可能把内部提示词 / 标签原样发到群里；除非调试，建议保持开启。", "Off may leak internal prompts/tags into the group; keep on unless debugging."]
  },
  {
    key: "replyLocale",
    group: "reply",
    type: "enum",
    options: ENUM_LOCALE,
    help: ["发给 QQ 用户的回复文案语言。", "Language of reply text sent to QQ users."],
    example: ['"zh"（默认，中文）', '"zh" (default, Chinese)'],
    notes: ["只影响发给用户的回复语言，不影响设置页界面语言；填其它值会保存失败。", "Affects only replies to users, not the settings UI language. Other values fail validation."]
  },
  {
    key: "atContextMessages",
    group: "reply",
    type: "number",
    min: 0,
    max: 50,
    help: ["群内 @ 机器人时附带的最近消息条数。", "How many recent group messages to attach on @ mention."],
    example: ["10（默认）", "10 (default)"],
    notes: ["0=不附带历史；调太大每次 @ 都带一堆消息，显著增加 token，必须是 0–50 的整数。", "0=no history. Too large drags in many messages per @ and costs more tokens. Integer 0–50."]
  },
  {
    key: "groupBufferMax",
    group: "reply",
    type: "number",
    min: 0,
    max: 200,
    help: ["每个群的上下文缓冲最大条数。", "Max buffered context messages per group."],
    example: ["50（默认）", "50 (default)"],
    notes: ["调太大长群的内存占用与 token 都会上升；0=不缓存上下文。必须是 0–200 的整数。", "Too large raises memory and token cost in busy groups. 0=no context. Integer 0–200."]
  },
  // ── 节奏与调优 ──────────────────────────────────────────────────────────
  {
    key: "valueThreshold",
    group: "pacing",
    type: "number",
    min: 0,
    max: 10,
    help: ["全量回复的价值评分阈值：达到才回复。", "Value-score threshold for full-group replies."],
    example: ["5（默认）", "5 (default)"],
    notes: ["调高回复更少、更省 token；设 0 则几乎每条都回、用量激增。必须是 0–10 的整数。", "Higher = fewer replies and less token; 0 replies to nearly everything. Integer 0–10."]
  },
  {
    key: "groupCooldownMs",
    group: "pacing",
    type: "number",
    min: 0,
    max: 18e5,
    help: ["同群两次全量回复的最小间隔（毫秒），@ 回复不受此限。", "Min interval between two full-group replies in ms; @ replies exempt."],
    example: ["60000（默认，1 分钟）", "60000 (default, 1 minute)"],
    notes: ["单位是毫秒（60000=1 分钟，上限 1800000=30 分钟）；调太小群内回复过于频繁，容易被平台限流。", "Unit is ms (60000=1 min, max 1800000=30 min). Too small spams replies and may hit rate limits."]
  },
  {
    key: "senderCooldownMs",
    group: "pacing",
    type: "number",
    min: 0,
    max: 18e5,
    help: ["同一发送者两次被全量回复的最小间隔（毫秒）。", "Min interval between full-group replies to the same sender in ms."],
    example: ["30000（默认，30 秒）", "30000 (default, 30 seconds)"],
    notes: ["专门防单人刷屏；0=不限制同一人。单位毫秒，上限 1800000（30 分钟）。", "Prevents one person from spamming. 0=no limit. Unit ms, max 1800000 (30 min)."]
  },
  {
    key: "replyChunkChars",
    group: "pacing",
    type: "number",
    min: 200,
    max: 4e3,
    help: ["单条回复的最大字符数，超长自动分条发送。", "Max chars per reply message; longer replies are split."],
    example: ["1000（默认）", "1000 (default)"],
    notes: ["太小会把回复拆成很多条刷屏，太大可能超过 QQ 单条消息长度上限被拒。必须是 200–4000 的整数。", "Too small splits replies into many messages; too large may exceed QQ's per-message limit. Integer 200–4000."]
  },
  {
    key: "maxRepliesPerMessage",
    group: "pacing",
    type: "number",
    min: 1,
    max: 5,
    help: ["单条用户消息最多触发几条回复。", "Max replies per user message."],
    example: ["5（默认，平台上限）", "5 (default, platform maximum)"],
    notes: ["平台硬上限 5，填超过 5 会被校验拦下；调小可减少刷屏和用量。", "Hard platform limit is 5; higher values fail validation. Lower values reduce spam and usage."]
  },
  {
    key: "quotaPerDay",
    group: "pacing",
    type: "number",
    min: 0,
    max: 1e5,
    help: ["主动消息每日配额，超出后停止主动发送并告警。", "Daily proactive-message quota; stops sending with an alert when exceeded."],
    example: ["50（默认）", "50 (default)"],
    notes: ["只限制主动消息，被动回复不受影响；0=不限制（可能产生额外费用）。", "Limits proactive messages only; passive replies are unaffected. 0=unlimited (may cost more)."]
  },
  // ── 归档 ────────────────────────────────────────────────────────────────
  {
    key: "archiveEnabled",
    group: "archive",
    type: "boolean",
    help: ["是否开启消息本地归档（审计轨迹），写入 ~/.dsh/qqbot/archive/。", "Enable local message archiving (audit trail) under ~/.dsh/qqbot/archive/."],
    example: ["true（默认，开启）", "true (default, on)"],
    notes: ["关闭后不再写本地归档，历史消息无法追溯；开启会占用磁盘空间。", "Off stops archiving and loses the audit trail; on uses disk space."]
  },
  {
    key: "archiveMedia",
    group: "archive",
    type: "enum",
    options: ENUM_ARCHIVE_MEDIA,
    help: ["媒体保存级别。", "Media persistence level."],
    example: ['"off"（默认，仅文本）', '"off" (default, text only)'],
    notes: ["off=仅文本；image=含图片；imageVideo=含图片视频；all=全部文件（最占磁盘）。填其它值会保存失败。", "off=text only; image; imageVideo; all=every file (most disk). Other values fail validation."]
  },
  // ── 语音与文件 ──────────────────────────────────────────────────────────
  {
    key: "multimodalInbound",
    group: "voice",
    type: "boolean",
    help: ["是否把入站图片 / 文件转发进会话，让模型「看」到内容。", "Forward inbound images / files into the session so the model can see them."],
    example: ["true（默认，转发）", "true (default, forward)"],
    notes: ["关闭后模型看不到图片 / 文件内容；开启会增加 token 消耗并依赖模型的多模态能力。", "Off hides image/file content from the model; on costs more tokens and needs model vision support."]
  },
  {
    key: "voiceTranscription",
    group: "voice",
    type: "enum",
    options: ENUM_VOICE,
    help: ["语音处理方式。", "Voice handling mode."],
    example: ['"note"（默认，注入说明占位）', '"note" (default, placeholder)'],
    notes: ["off=忽略；note=占位说明；download=下载注入 URL；asr=外部 ASR；stt=OpenAI 兼容 STT。选 asr/stt 须先配好对应服务，否则语音转写失败。", "off=ignore; note=placeholder; download=URL; asr=external; stt=OpenAI-compatible STT. asr/stt need their service configured first."]
  },
  {
    key: "asrEndpoint",
    group: "voice",
    type: "string",
    help: ["外部 ASR 服务地址（POST {url} → {text}），voiceTranscription=asr 时使用。", "External ASR endpoint (POST {url} → {text}), used when voiceTranscription=asr."],
    example: ["https://asr.example.com/transcribe", "https://asr.example.com/transcribe"],
    notes: ["地址不可达或返回格式不符会导致语音处理失败；仅 asr 模式生效，其它模式可留空。", "An unreachable endpoint or bad response breaks voice processing. Only used in asr mode."]
  },
  {
    key: "sttBaseUrl",
    group: "voice",
    type: "string",
    help: ["STT 服务 Base URL（OpenAI 兼容），voiceTranscription=stt 时使用。", "STT service base URL (OpenAI-compatible), used when voiceTranscription=stt."],
    example: ["https://api.openai.com/v1", "https://api.openai.com/v1"],
    notes: ["须为 OpenAI 兼容的 /audio/transcriptions 服务根地址；填错会导致转写鉴权或连接失败。", "Must be an OpenAI-compatible /audio/transcriptions base; a wrong URL breaks transcription."]
  },
  {
    key: "sttApiKey",
    group: "voice",
    type: "string",
    help: ["STT 服务 API Key（Bearer），voiceTranscription=stt 时使用。", "STT service API key (Bearer), used when voiceTranscription=stt."],
    example: ["sk-xxxxxxxx", "sk-xxxxxxxx"],
    notes: ["密钥错误会鉴权失败、语音转不出文字；本地 STT 服务若无需密钥可留空。", "A wrong key fails auth and yields no transcript; leave empty for keyless local STT."]
  },
  {
    key: "sttModel",
    group: "voice",
    type: "string",
    help: ["STT 模型名。", "STT model name."],
    example: ["whisper-1（默认）", "whisper-1 (default)"],
    notes: ["模型名在服务里不存在会导致转写失败；仅 stt 模式生效。", "A model name missing from the service breaks transcription. Only used in stt mode."]
  },
  {
    key: "ttsReply",
    group: "voice",
    type: "boolean",
    help: ["单聊回复自动转语音（文字→TTS→语音气泡）；合成失败回退文字。", "Convert direct-chat replies to speech; falls back to text on synthesis failure."],
    example: ["false（默认，不转语音）", "false (default, text only)"],
    notes: ["只对单聊生效；语音服务未配置时合成失败，会自动回退成文字，不影响正常回复。", "Direct chat only. If TTS is unconfigured, synthesis fails and falls back to text."]
  },
  {
    key: "ttsBaseUrl",
    group: "voice",
    type: "string",
    help: ["TTS 服务 Base URL（OpenAI 兼容 /audio/speech）。", "TTS service base URL (OpenAI-compatible /audio/speech)."],
    example: ["https://api.openai.com/v1", "https://api.openai.com/v1"],
    notes: ["须为 OpenAI 兼容的服务根地址；填错会导致语音合成失败并回退文字。ttsReply=true 时需配置。", "Must be an OpenAI-compatible base; a wrong URL breaks synthesis and falls back to text. Needed when ttsReply=true."]
  },
  {
    key: "ttsApiKey",
    group: "voice",
    type: "string",
    help: ["TTS 服务 API Key（Bearer）。", "TTS service API key (Bearer)."],
    example: ["sk-xxxxxxxx", "sk-xxxxxxxx"],
    notes: ["密钥错误会合成失败并回退文字；本地无需密钥的服务可留空。", "A wrong key breaks synthesis and falls back to text; leave empty for keyless services."]
  },
  {
    key: "ttsModel",
    group: "voice",
    type: "string",
    help: ["TTS 模型名。", "TTS model name."],
    example: ["tts-1（默认）", "tts-1 (default)"],
    notes: ["模型名在服务里不存在会合成失败并回退文字。", "A model name missing from the service breaks synthesis and falls back to text."]
  },
  {
    key: "ttsVoice",
    group: "voice",
    type: "string",
    help: ["TTS 发音人（voice 参数）。", "TTS voice parameter."],
    example: ["alloy（默认）", "alloy (default)"],
    notes: ["发音人不存在通常会回退默认音色；可选值取决于所使用的 TTS 服务。", "An unknown voice usually falls back to the default timbre; options depend on the TTS service."]
  },
  {
    key: "fileIngestion",
    group: "voice",
    type: "boolean",
    help: ["收到文本类文件（txt/md/json/csv/代码等）时下载并截取内容注入模型。", "Download and inject text files (txt/md/json/csv/code) into the model context."],
    example: ["true（默认，读取文本）", "true (default, read text)"],
    notes: ["只处理文本类文件，二进制文件会被跳过；读取大文件会截取片段并增加 token。", "Only text files are read; binaries are skipped. Large files are truncated and cost tokens."]
  },
  // ── 功能开关 ────────────────────────────────────────────────────────────
  {
    key: "approvalButtons",
    group: "features",
    type: "boolean",
    help: ["AI 请求敏感操作时发送「允许 / 拒绝」按钮消息，点击回调回传决定。", "Send Allow/Deny button messages when the AI requests a sensitive action."],
    example: ["true（默认，发按钮）", "true (default, send buttons)"],
    notes: ["关闭后敏感操作不再发确认按钮；保持开启可避免 AI 误操作未经你确认。", "Off stops confirmation buttons for sensitive actions; keep on to avoid unconfirmed AI actions."]
  },
  {
    key: "welcomeEnabled",
    group: "features",
    type: "boolean",
    help: ["入群 / 加好友欢迎语开关。", "Enable welcome messages on group join / friend add."],
    example: ["true（默认，开启）", "true (default, on)"],
    notes: ["关闭后新成员入群 / 加好友不再发欢迎语；欢迎语内容见 welcomeMessage。", "Off stops welcome messages. The text is set by welcomeMessage."]
  },
  {
    key: "welcomeMessage",
    group: "features",
    type: "string",
    help: ["欢迎语模板，{nick} 会替换为新成员昵称。", "Welcome message template; {nick} is replaced with the nickname."],
    example: ["欢迎 {nick} 加入群聊！", "Welcome {nick} to the group!"],
    notes: ["留空则不发送；{nick} 之外的占位符不会替换，会原样显示。需 welcomeEnabled=true 才生效。", "Empty sends nothing. Placeholders other than {nick} stay literal. Needs welcomeEnabled=true."]
  },
  {
    key: "reactionRecall",
    group: "features",
    type: "boolean",
    help: ["用户用 🗑️ 表情回应机器人消息时撤回它。", "Recall a bot message when a user reacts to it with 🗑️."],
    example: ["true（默认，开启）", "true (default, on)"],
    notes: ["只能撤回机器人自己发的消息；机器人对该消息无撤回权限时操作会失败。", "Only the bot's own messages can be recalled; it fails without recall permission."]
  },
  {
    key: "bannedWords",
    group: "features",
    type: "string[]",
    help: ["群消息命中这些词时撤回并跳过回复（敏感词过滤）。", "Recall the message and skip replying when it contains any of these words."],
    example: ['["广告", "刷单"]（默认空数组 []）', '["spam", "scam"] (default empty [])'],
    notes: ["按子串匹配，命中即撤回且不调用 AI；词太短可能误伤正常消息，词表默认 []。", "Substring match: a hit is recalled with no AI call. Too-short words cause false positives. Default []."]
  },
  {
    key: "memoryEnabled",
    group: "features",
    type: "boolean",
    help: ["每聊天开启长期记忆（跨 /new 保留上下文）。", "Enable per-chat long-term memory (context survives /new)."],
    example: ["true（默认，开启）", "true (default, on)"],
    notes: ["关闭后每次 /new 都丢失上下文；开启会增加每轮记忆读取的 token。", "Off loses context on every /new; on adds memory-reading tokens each turn."]
  },
  {
    key: "guildMessageEvents",
    group: "features",
    type: "boolean",
    help: ["订阅频道私域全量消息事件 MESSAGE_CREATE。", "Subscribe to private-domain channel MESSAGE_CREATE events."],
    example: ["false（默认，关闭）", "false (default, off)"],
    notes: ["需私域权限；无权限却开启会导致 WebSocket 鉴权失败掉线，改动此值会强制重连。非私域机器人务必保持关闭。", "Requires private-domain permission. Enabling without it breaks the WebSocket auth and forces a reconnect. Keep off for public bots."]
  },
  {
    key: "forumEvents",
    group: "features",
    type: "boolean",
    help: ["订阅频道论坛事件 FORUM_*（用于新帖自动回帖与评论 @ 回复）。", "Subscribe to channel FORUM_* events (powers auto-reply to new posts and @mentions)."],
    example: ["false（默认，关闭）", "false (default, off)"],
    notes: ["需私域权限并开通论坛；无权限开启会掉线，改动此值会强制重连。非私域机器人务必保持关闭。", "Requires private-domain permission and forum access. Enabling without them breaks the connection and forces a reconnect."]
  },
  // ── 安全与权限 ──────────────────────────────────────────────────────────
  {
    key: "ssrfGuard",
    group: "security",
    type: "boolean",
    help: ["媒体 URL SSRF 防护：拒绝请求内网 / 保留地址。", "SSRF guard for media URLs: reject private / reserved addresses."],
    example: ["true（默认，开启防护）", "true (default, guard on)"],
    notes: ["关闭后媒体 URL 可能请求到内网地址，有 SSRF 安全风险；建议始终开启。", "Off lets media URLs reach internal addresses (SSRF risk). Keep it on."]
  },
  {
    key: "localPathWhitelist",
    group: "security",
    type: "boolean",
    help: ["本地路径白名单：qqbot_send_* 工具只能发送工作区 / 数据目录内的文件。", "Restrict qqbot_send_* tools to files inside the workspace / data directory."],
    example: ["false（默认，不限制）", "false (default, unrestricted)"],
    notes: ["开启后发送工作区外的文件会被拒绝；若 AI 总报「路径不在白名单」，可关闭或把文件移进工作区。", "On rejects files outside the workspace. If AI reports 'path not whitelisted', turn it off or move the file in."]
  },
  {
    key: "permissionInjection",
    group: "security",
    type: "boolean",
    help: ["「对话权限」注入：把 _default.md 包成指令块注入 prompt 顶部。", "Inject the conversation-permission block (_default.md) at the top of the prompt."],
    example: ["true（默认，注入）", "true (default, inject)"],
    notes: ["关闭后不再注入权限指令，AI 行为约束减弱；一般保持开启。", "Off skips the permission block and weakens AI constraints. Keep it on."]
  },
  {
    key: "permissionAdmins",
    group: "security",
    type: "string[]",
    help: ["权限管理员 openid 白名单。", "Permission-admin openid whitelist."],
    example: ['[]（默认，不设限）或 ["<用户openid>"]', '[] (default, no restriction) or ["<user openid>"]'],
    notes: ['空数组=不设限；["*"]=所有人都是管理员；填入具体 openid 则仅这些人拥有管理员权限。', 'Empty = no restriction; ["*"] = everyone is an admin; specific openids restrict admin rights to those users.']
  },
  // ── 高级 ───────────────────────────────────────────────────────────────
  {
    key: "archiveMediaMaxImageMB",
    group: "advanced",
    type: "number",
    min: 1,
    max: 512,
    help: ["归档单张图片体积上限 MB。需重启生效。", "Max archived image size in MB. Requires restart."],
    example: ["8（默认）", "8 (default)"],
    notes: ["超过上限的图片不归档，只保留记录；必须是 1–512 的整数。改完需重启宿主才生效。", "Oversized images are not archived (record only). Integer 1–512. Restart the host to apply."]
  },
  {
    key: "archiveMediaMaxVideoMB",
    group: "advanced",
    type: "number",
    min: 1,
    max: 2048,
    help: ["归档单个视频体积上限 MB。需重启生效。", "Max archived video size in MB. Requires restart."],
    example: ["64（默认）", "64 (default)"],
    notes: ["超过上限的视频不归档，只保留记录；必须是 1–2048 的整数。改完需重启宿主才生效。", "Oversized videos are not archived (record only). Integer 1–2048. Restart the host to apply."]
  },
  {
    key: "archiveMediaMaxFileMB",
    group: "advanced",
    type: "number",
    min: 1,
    max: 1024,
    help: ["归档其它文件体积上限 MB。需重启生效。", "Max archived file size in MB. Requires restart."],
    example: ["32（默认）", "32 (default)"],
    notes: ["超过上限的文件不归档，只保留记录；必须是 1–1024 的整数。改完需重启宿主才生效。", "Oversized files are not archived (record only). Integer 1–1024. Restart the host to apply."]
  },
  {
    key: "scheduleMaxPerChat",
    group: "advanced",
    type: "number",
    min: 0,
    max: 500,
    help: ["每个群 / 单聊允许的定时消息条数上限。", "Max scheduled messages per chat."],
    example: ["15（默认）", "15 (default)"],
    notes: ["达到上限后无法再新建定时任务；0=不限。必须是 0–500 的整数。", "No new schedules once the cap is hit; 0=unlimited. Integer 0–500."]
  },
  {
    key: "groupOverrides",
    group: "advanced",
    type: "object",
    help: ["按群覆盖配置：群 openid → 覆盖字段对象。仅允许聊天行为子集，缺省键跟随机器人默认。", "Per-group overrides: group openid → override object. Only a subset of chat fields; unset keys follow bot defaults."],
    example: ['{"123456": {"groupFullReply": false, "valueThreshold": 8}}', '{"123456": {"groupFullReply": false, "valueThreshold": 8}}'],
    notes: ["只可写允许的聊天字段（如 groupFullReply / valueThreshold / bannedWords 等），写其它字段会校验报错；openid 填错则该群不生效。", "Only approved chat fields are allowed (e.g. groupFullReply / valueThreshold / bannedWords); other fields fail validation, and a wrong openid has no effect."]
  }
];
var GROUP_OVERRIDE_FIELDS = [
  "groupFullReply",
  "valueThreshold",
  "groupCooldownMs",
  "senderCooldownMs",
  "atContextMessages",
  "replyChunkChars",
  "maxRepliesPerMessage",
  "markdownReply",
  "memoryEnabled",
  "bannedWords"
];
var isPlainObject = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
function syntaxDetail(text, error) {
  const message = error instanceof Error ? error.message : String(error);
  const posMatch = /position\s+(\d+)/i.exec(message);
  if (posMatch) {
    const pos = Math.min(Number(posMatch[1]), text.length);
    const before = text.slice(0, pos);
    const line = before.split("\n").length;
    const col = pos - before.lastIndexOf("\n");
    return `line ${line}, column ${col}: ${message}`;
  }
  return message;
}
function checkType(value, meta) {
  switch (meta.type) {
    case "string":
      return typeof value === "string" ? null : "type";
    case "number":
      if (typeof value !== "number" || !Number.isSafeInteger(value)) return "type";
      if (meta.min !== void 0 && value < meta.min || meta.max !== void 0 && value > meta.max) return "range";
      return null;
    case "boolean":
      return typeof value === "boolean" ? null : "type";
    case "string[]":
      return Array.isArray(value) && value.every((v) => typeof v === "string") ? null : "type";
    case "enum":
      return typeof value === "string" && meta.options?.includes(value) ? null : "enum";
    case "object":
      return isPlainObject(value) ? null : "type";
  }
}
function expectText(meta, lang) {
  const zh = meta.type === "string[]" ? "字符串数组" : meta.type === "boolean" ? "布尔值 true/false" : meta.type === "number" ? "整数" : meta.type === "object" ? "对象" : meta.type === "enum" ? "枚举值" : "字符串";
  const en2 = meta.type === "string[]" ? "array of strings" : meta.type === "boolean" ? "boolean true/false" : meta.type === "number" ? "integer" : meta.type === "object" ? "object" : meta.type === "enum" ? "enum value" : "string";
  return lang === 0 ? zh : en2;
}
function checkOverrides(value, issues) {
  for (const [openid, raw] of Object.entries(value)) {
    if (!isPlainObject(raw)) {
      issues.push({ code: "override", path: `groupOverrides.${openid}`, detail: "object" });
      continue;
    }
    for (const [field2, val2] of Object.entries(raw)) {
      if (!GROUP_OVERRIDE_FIELDS.includes(field2)) {
        issues.push({ code: "unknown", path: `groupOverrides.${openid}.${field2}` });
        continue;
      }
      const meta = CONFIG_FIELDS.find((m) => m.key === field2);
      if (!meta) continue;
      const code = checkType(val2, meta);
      if (code) issues.push({ code, path: `groupOverrides.${openid}.${field2}` });
    }
  }
}
function parseAndValidate(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    return { ok: false, value: void 0, issues: [{ code: "syntax", path: "", detail: syntaxDetail(text, error) }] };
  }
  if (!isPlainObject(parsed)) {
    return { ok: false, value: void 0, issues: [{ code: "notObject", path: "" }] };
  }
  const value = parsed;
  const issues = [];
  const known = new Set(CONFIG_FIELDS.map((m) => m.key));
  for (const key of Object.keys(value)) {
    if (!known.has(key)) issues.push({ code: "unknown", path: key });
  }
  for (const meta of CONFIG_FIELDS) {
    if (!(meta.key in value)) continue;
    const code = checkType(value[meta.key], meta);
    if (code) issues.push({ code, path: meta.key, detail: typeDetail(meta) });
  }
  if (isPlainObject(value.groupOverrides)) checkOverrides(value.groupOverrides, issues);
  return { ok: true, value, issues };
}
function typeDetail(meta) {
  if (meta.type === "enum") return meta.options?.join(" | ") ?? "";
  if (meta.type === "number") return `[${meta.min ?? "-∞"}, ${meta.max ?? "∞"}]`;
  return "";
}

// src/client/dialogs/config-manifest-dialog.tsx
function issueText(issue, lang) {
  switch (issue.code) {
    case "syntax":
      return fmt("manifest.issue.syntax", issue.detail ?? "");
    case "notObject":
      return t("manifest.issue.notObject");
    case "unknown":
      return fmt("manifest.issue.unknown", issue.path);
    case "enum":
      return fmt("manifest.issue.enum", issue.path, issue.detail ?? "");
    case "range":
      return fmt("manifest.issue.range", issue.path, issue.detail ?? "");
    case "override":
      return fmt("manifest.issue.override", issue.path, issue.detail ?? "");
    case "type": {
      const key = issue.path.split(".")[0];
      const meta = CONFIG_FIELDS.find((m) => m.key === key);
      return fmt("manifest.issue.type", issue.path, meta ? expectText(meta, lang) : "");
    }
  }
}
function typeBadge(meta, lang) {
  switch (meta.type) {
    case "string":
      return lang === 0 ? "字符串" : "string";
    case "number":
      return lang === 0 ? "整数" : "integer";
    case "boolean":
      return "boolean";
    case "string[]":
      return "string[]";
    case "enum":
      return lang === 0 ? "枚举" : "enum";
    case "object":
      return lang === 0 ? "对象" : "object";
  }
}
function limitValue(meta) {
  if (meta.type === "number" && (meta.min !== void 0 || meta.max !== void 0)) {
    return `[${meta.min ?? "−∞"}, ${meta.max ?? "∞"}]`;
  }
  if (meta.type === "enum" && meta.options?.length) {
    return meta.options.map((o) => `"${o}"`).join(" / ");
  }
  return "";
}
var HELP_LABELS = {
  range: ["范围", "Range"],
  values: ["可选", "Values"],
  example: ["示例", "Example"],
  note: ["配错会", "If wrong"]
};
function ConfigManifestDialog(props) {
  const { appId, rpcCall, onClose, onSaved } = props;
  useLocale();
  const lang = t("common.langProbe") === "简体中文" ? 0 : 1;
  const [text, setText] = React7.useState("");
  const [baseline, setBaseline] = React7.useState("");
  const [loading, setLoading] = React7.useState(true);
  const [loadErr, setLoadErr] = React7.useState("");
  const [saving, setSaving] = React7.useState(false);
  const [notice, setNotice] = React7.useState(null);
  const [query, setQuery] = React7.useState("");
  const [collapsed, setCollapsed] = React7.useState({});
  const textareaRef = React7.useRef(null);
  const gutterRef = React7.useRef(null);
  const load = React7.useCallback(async () => {
    setLoading(true);
    setLoadErr("");
    setNotice(null);
    try {
      const res = await rpcCall("config.get", { appId });
      if (!res.ok) {
        setLoadErr(errText(res.error));
        return;
      }
      const config = val(res)?.config ?? {};
      const pretty = JSON.stringify(config, null, 2);
      setText(pretty);
      setBaseline(pretty);
    } catch (e) {
      setLoadErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [appId, rpcCall]);
  React7.useEffect(() => {
    void load();
  }, [load]);
  const result = React7.useMemo(() => parseAndValidate(text), [text]);
  const issues = result.issues;
  const dirty = text !== baseline;
  const errorLines = React7.useMemo(() => {
    const lines = /* @__PURE__ */ new Set();
    const source = text.split("\n");
    for (const issue of issues) {
      if (issue.code === "syntax") {
        const line = /line\s+(\d+)/i.exec(issue.detail ?? "");
        if (line) lines.add(Number(line[1]));
        continue;
      }
      if (!issue.path) continue;
      const leaf = issue.path.split(".").pop() ?? "";
      const idx = source.findIndex((l) => l.includes(`"${leaf}"`));
      if (idx >= 0) lines.add(idx + 1);
    }
    return lines;
  }, [text, issues]);
  React7.useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 6e3);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const locateIssue = (issue) => {
    const ta = textareaRef.current;
    if (!ta) return;
    if (issue.code === "syntax") {
      const line = /line\s+(\d+)/i.exec(issue.detail ?? "");
      if (!line) return;
      const lines = text.split("\n");
      let offset = 0;
      for (let i = 0; i < Number(line[1]) - 1 && i < lines.length; i++) offset += lines[i].length + 1;
      ta.focus();
      ta.setSelectionRange(offset, offset + Math.min(lines[Number(line[1]) - 1]?.length ?? 0, 40));
      return;
    }
    const leaf = issue.path.split(".").pop() ?? "";
    const idx = text.indexOf(`"${leaf}"`);
    if (idx < 0) return;
    ta.focus();
    ta.setSelectionRange(idx, idx + leaf.length + 2);
  };
  const reload = async () => {
    if (dirty && !await confirmDlg({ message: t("manifest.reloadConfirm") })) return;
    void load();
  };
  const save = async () => {
    if (!result.ok || issues.length > 0) {
      setNotice({ tone: "error", text: t("manifest.validateBeforeSave") });
      return;
    }
    setSaving(true);
    setNotice(null);
    try {
      const res = await rpcCall("config.save", { appId, ...result.value ?? {} });
      if (!res.ok) {
        setNotice({ tone: "error", text: errText(res.error) });
        return;
      }
      setBaseline(text);
      onSaved();
      onClose();
    } catch (e) {
      setNotice({ tone: "error", text: e instanceof Error ? e.message : String(e) });
    } finally {
      setSaving(false);
    }
  };
  const q = query.trim().toLowerCase();
  const helpGroups = CONFIG_GROUPS.map((group) => {
    const fields = CONFIG_FIELDS.filter((m) => {
      if (m.group !== group.id) return false;
      if (!q) return true;
      return m.key.toLowerCase().includes(q) || m.help[0].toLowerCase().includes(q) || m.help[1].toLowerCase().includes(q) || (m.example?.[0].toLowerCase().includes(q) ?? false) || (m.example?.[1].toLowerCase().includes(q) ?? false) || (m.notes?.[0].toLowerCase().includes(q) ?? false) || (m.notes?.[1].toLowerCase().includes(q) ?? false);
    });
    return { group, fields };
  }).filter((g) => g.fields.length > 0);
  const lineCount = text.split("\n").length;
  const shownCount = helpGroups.reduce((n, g) => n + g.fields.length, 0);
  const helpGroupNode = ({ group, fields }) => {
    const isCollapsed = Boolean(collapsed[group.id]);
    return h(
      "div",
      { className: "qbot-cmHelpGroup", key: group.id },
      h(
        "button",
        {
          type: "button",
          className: "qbot-cmHelpGroupHead",
          onClick: () => setCollapsed((c) => ({ ...c, [group.id]: !c[group.id] }))
        },
        h("span", { className: "qbot-cmHelpChevron" }, isCollapsed ? "▸" : "▾"),
        h("strong", null, group.label[lang]),
        h("span", { className: "qbot-cmHelpGroupCount" }, String(fields.length))
      ),
      !isCollapsed ? h("div", { className: "qbot-cmHelpGroupDesc" }, group.desc[lang]) : null,
      !isCollapsed ? h(
        "div",
        { className: "qbot-cmHelpFields" },
        fields.map((m) => {
          const limit = limitValue(m);
          return h(
            "div",
            { className: "qbot-cmHelpField", key: m.key },
            h(
              "div",
              { className: "qbot-cmHelpFieldTop" },
              h("code", { className: "qbot-cmHelpKey", title: m.key }, m.key),
              h("span", { className: "qbot-cmHelpType" }, typeBadge(m, lang))
            ),
            h("p", { className: "qbot-cmHelpText" }, m.help[lang]),
            limit ? h(
              "div",
              { className: "qbot-cmHelpLine" },
              h(
                "span",
                { className: "qbot-cmHelpTag qbot-cmHelpTagRange" },
                (m.type === "enum" ? HELP_LABELS.values : HELP_LABELS.range)[lang]
              ),
              h("code", { className: "qbot-cmHelpValue" }, limit)
            ) : null,
            m.example ? h(
              "div",
              { className: "qbot-cmHelpLine" },
              h("span", { className: "qbot-cmHelpTag qbot-cmHelpTagExample" }, HELP_LABELS.example[lang]),
              h("code", { className: "qbot-cmHelpValue" }, m.example[lang])
            ) : null,
            m.notes ? h(
              "div",
              { className: "qbot-cmHelpNote" },
              h("span", { className: "qbot-cmHelpNoteTag" }, HELP_LABELS.note[lang]),
              h("span", { className: "qbot-cmHelpNoteText" }, m.notes[lang])
            ) : null
          );
        })
      ) : null
    );
  };
  return h(
    "div",
    { className: "qbot-modalOverlay" },
    h(
      "div",
      {
        className: "qbot-modal qbot-cmModal",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": t("manifest.title")
      },
      // ── 头部 ──
      h(
        "div",
        { className: "qbot-modalHead" },
        h(
          "div",
          null,
          h("strong", null, t("manifest.title")),
          h("p", null, t("manifest.hint"))
        ),
        h("button", {
          className: "qbot-modalClose",
          type: "button",
          "aria-label": t("common.close"),
          onClick: onClose
        }, "×")
      ),
      // ── 主体：左编辑器 / 右帮助 ──
      h(
        "div",
        { className: "qbot-cmBody" },
        h(
          "section",
          { className: "qbot-cmEditorPane" },
          h(
            "div",
            { className: "qbot-cmPaneHead" },
            h("strong", null, t("manifest.editorTitle")),
            h(
              "span",
              { className: `qbot-cmStatus${issues.length ? " is-error" : " is-ok"}` },
              issues.length ? fmt("manifest.issueCount", String(issues.length)) : fmt("manifest.validCount", String(Object.keys(result.value ?? {}).length))
            )
          ),
          h(
            "div",
            { className: "qbot-cmCodeWrap" },
            h(
              "div",
              { className: "qbot-cmGutter", ref: gutterRef },
              Array.from({ length: lineCount }, (_, i) => h("div", {
                key: i,
                className: errorLines.has(i + 1) ? "is-err" : ""
              }, String(i + 1)))
            ),
            h("textarea", {
              ref: textareaRef,
              className: "qbot-cmCode",
              value: text,
              spellCheck: false,
              "aria-label": t("manifest.editorTitle"),
              onChange: (e) => setText(e.target.value),
              onScroll: (e) => {
                if (gutterRef.current) gutterRef.current.scrollTop = e.target.scrollTop;
              }
            })
          ),
          // 校验结果列表
          issues.length ? h(
            "div",
            { className: "qbot-cmIssues", role: "alert" },
            issues.map((issue, i) => h(
              "button",
              {
                key: `${issue.code}-${issue.path}-${i}`,
                type: "button",
                className: "qbot-cmIssue",
                title: t("manifest.locateHint"),
                onClick: () => locateIssue(issue)
              },
              h("span", { className: "qbot-cmIssuePath" }, issue.path || t("manifest.jsonRoot")),
              h("span", { className: "qbot-cmIssueMsg" }, issueText(issue, lang))
            ))
          ) : h("div", { className: "qbot-cmIssues is-empty" }, t("manifest.noIssue"))
        ),
        h(
          "section",
          { className: "qbot-cmHelpPane" },
          h(
            "div",
            { className: "qbot-cmPaneHead" },
            h("strong", null, t("manifest.helpTitle")),
            h("span", { className: "qbot-cmHelpCount" }, fmt("manifest.fieldTotal", String(shownCount)))
          ),
          h("input", {
            className: "qbot-input qbot-cmSearch",
            type: "search",
            value: query,
            placeholder: t("manifest.searchPlaceholder"),
            "aria-label": t("manifest.searchPlaceholder"),
            onChange: (e) => setQuery(e.target.value)
          }),
          h(
            "div",
            { className: "qbot-cmHelpScroll" },
            helpGroups.map((g) => helpGroupNode(g)),
            shownCount === 0 ? h("div", { className: "qbot-modalState" }, t("manifest.noHelpMatch")) : null
          )
        )
      ),
      // ── 底部 ──
      h(
        "div",
        { className: "qbot-modalFoot qbot-cmFoot" },
        h(
          "div",
          { className: "qbot-cmFootLeft" },
          notice ? h("p", { className: notice.tone === "error" ? "qbot-footError" : "qbot-footOk", role: "alert" }, notice.text) : h("span", { className: "qbot-hint" }, dirty ? t("manifest.unsavedHint") : t("manifest.saveHint"))
        ),
        h(
          "div",
          { className: "qbot-viewActions" },
          h("button", {
            className: "qbot-btn",
            type: "button",
            disabled: loading || saving,
            onClick: () => void reload()
          }, t("manifest.reload")),
          h("button", {
            className: "qbot-btn",
            type: "button",
            disabled: saving,
            onClick: onClose
          }, t("common.cancel")),
          h("button", {
            className: "qbot-btn qbot-btnPrimary",
            type: "button",
            disabled: loading || saving || issues.length > 0,
            title: issues.length ? t("manifest.validateBeforeSave") : void 0,
            onClick: () => void save()
          }, saving ? t("common.saving") : t("common.save"))
        )
      ),
      // 加载错误覆盖层
      loadErr ? h(
        "div",
        { className: "qbot-cmLoadErr", role: "alert" },
        h("p", null, fmt("manifest.loadFailed", loadErr)),
        h("button", { className: "qbot-btn", type: "button", onClick: () => void load() }, t("common.refresh"))
      ) : null
    )
  );
}

// src/client/dialogs/override-dialog.tsx
var React9 = __toESM(require("react"), 1);

// src/client/id-picker.tsx
var React8 = __toESM(require("react"), 1);
var NOOP_RPC = async () => ({ ok: false, error: "" });
function useArchiveChats(rpcCall, appId) {
  const [chats, setChats] = React8.useState([]);
  const [loading, setLoading] = React8.useState(true);
  const [error, setError] = React8.useState("");
  const reload = React8.useCallback(async () => {
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
  React8.useEffect(() => {
    void reload();
  }, [reload]);
  return { chats, loading, error, reload };
}
var MAX_RENDER = 50;
function OpenIdPicker(props) {
  const { chats, scope, value, onChange, readOnly, loading, error, placeholder, ariaLabel, rpcCall, appId } = props;
  const [open, setOpen] = React8.useState(false);
  const pool = React8.useMemo(() => chats.filter((c) => c.scope === scope), [chats, scope]);
  const groupInfoMap = useGroupInfos(rpcCall ?? NOOP_RPC, appId ?? "", rpcCall ? pool.map((c) => c.openid) : []);
  const q = value.trim().toLowerCase();
  const list = q ? pool.filter(
    (c) => c.openid.toLowerCase().includes(q) || (c.name || "").toLowerCase().includes(q) || (c.lastSenderName || "").toLowerCase().includes(q) || (groupInfoMap[c.openid]?.group_name || "").toLowerCase().includes(q)
  ) : pool;
  const shown = list.slice(0, MAX_RENDER);
  const itemTitle = (c) => scope === "c2c" ? c.name || t("idpick.user") : groupInfoMap[c.openid]?.group_name ? String(groupInfoMap[c.openid].group_name) : c.lastSenderName ? fmt("idpick.groupRecentSpeaker", c.lastSenderName) : t("sched.form.scopeGroup");
  const memberNum = (c) => {
    const n = groupInfoMap[c.openid]?.group_member_num;
    return typeof n === "number" && n > 0 ? n : 0;
  };
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
            h(
              "span",
              { className: "qbot-idPickerHead" },
              h("span", { className: "qbot-idPickerName" }, itemTitle(c)),
              scope === "group" && memberNum(c) > 0 ? h(
                "span",
                { className: "qbot-convGroupMembers", title: fmt("archive.groupMemberNum", String(memberNum(c))) },
                fmt("archive.groupMembersShort", String(memberNum(c)))
              ) : null
            ),
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
  const num2 = (v) => v === void 0 || v === null ? "" : String(v);
  return {
    openid,
    groupFullReply: tri(ov.groupFullReply),
    valueThreshold: num2(ov.valueThreshold),
    atContextMessages: num2(ov.atContextMessages),
    groupCooldownMs: num2(ov.groupCooldownMs),
    senderCooldownMs: num2(ov.senderCooldownMs),
    markdownReply: tri(ov.markdownReply),
    memoryEnabled: tri(ov.memoryEnabled),
    replyChunkChars: num2(ov.replyChunkChars),
    maxRepliesPerMessage: num2(ov.maxRepliesPerMessage),
    bannedWords: Array.isArray(ov.bannedWords) ? ov.bannedWords.join(", ") : ""
  };
}
function OverrideDialog(props) {
  const { overrides, editOpenid, rpcCall, appId, onClose, onSave } = props;
  const [draft, setDraft] = React9.useState(() => buildDraft(overrides, editOpenid));
  const [error, setError] = React9.useState("");
  const [saving, setSaving] = React9.useState(false);
  const archiveChats = useArchiveChats(rpcCall, appId);
  React9.useEffect(() => {
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
  const ovGroup = (groupKey, title, fields) => h(
    "section",
    { className: "qbot-ovGroup", key: groupKey },
    h(
      "header",
      { className: "qbot-ovGroupHead" },
      h("span", { className: "qbot-ovGroupDot", "aria-hidden": "true" }),
      h("h3", null, title)
    ),
    h("div", { className: "qbot-ovGrid" }, ...fields)
  );
  const ovField = (label, hint, control, wide) => h(
    "div",
    { className: `qbot-ovField${wide ? " is-wide" : ""}`, key: label },
    h("span", { className: "qbot-ovLabel" }, label),
    control,
    hint ? h("span", { className: "qbot-ovHint" }, hint) : null
  );
  const ovSelect = (field2, ariaLabel, options) => h("select", {
    className: "qbot-settingSelect",
    value: String(draft[field2] ?? ""),
    onChange: (ev) => setOverrideField(String(field2), ev.target.value),
    "aria-label": ariaLabel
  }, ...options);
  const triOptions = () => [
    h("option", { key: "", value: "" }, t("group.followDefault")),
    h("option", { key: "on", value: "on" }, t("conn.enable")),
    h("option", { key: "off", value: "off" }, t("conn.disable"))
  ];
  const numOptions = (candidates, labelFn) => [
    h("option", { key: "", value: "" }, t("group.followDefault")),
    ...candidates.map((n) => h("option", { key: n, value: String(n) }, labelFn(n)))
  ];
  const form = h(
    "div",
    { className: "qbot-ovForm" },
    ovGroup("identity", t("group.secIdentity"), [
      ovField(
        t("group.openid"),
        t("group.openidHintPicker"),
        h(OpenIdPicker, {
          chats: archiveChats.chats,
          rpcCall,
          appId,
          scope: "group",
          value: String(draft.openid ?? ""),
          readOnly: Boolean(editOpenid),
          loading: archiveChats.loading,
          error: archiveChats.error,
          placeholder: t("group.openid"),
          onChange: (v) => setOverrideField("openid", v),
          ariaLabel: t("group.openid")
        }),
        true
      )
    ]),
    ovGroup("trigger", t("group.secTrigger"), [
      ovField(
        t("group.fullReply"),
        t("group.fullReplyHint"),
        ovSelect("groupFullReply", t("group.fullReply"), triOptions())
      ),
      ovField(
        t("group.valueThreshold"),
        t("group.valueThresholdHint"),
        ovSelect("valueThreshold", t("group.valueThreshold"), numOptions(
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          // 0 = 完全不设限（与机器人级同一语义）；早先从 1 起，群级关不掉阈值。
          (n) => n === 0 ? t("tune.allZero") : fmt("override.scoreOption", n)
        ))
      ),
      ovField(
        t("group.atContext"),
        t("group.atContextHint"),
        ovSelect("atContextMessages", t("group.atContext"), numOptions(
          [0, 2, 4, 6, 8, 10, 15, 20, 30, 50],
          (n) => n === 0 ? t("tune.offZero") : fmt("override.countOption", n)
        ))
      )
    ]),
    ovGroup("pacing", t("group.secPacing"), [
      ovField(
        t("group.groupCooldown"),
        t("group.groupCooldownHint"),
        ovSelect("groupCooldownMs", t("group.groupCooldown"), numOptions(COOLDOWN_OPTIONS, cooldownLabel))
      ),
      ovField(
        t("group.senderCooldown"),
        t("group.senderCooldownHint"),
        ovSelect("senderCooldownMs", t("group.senderCooldown"), numOptions(COOLDOWN_OPTIONS, cooldownLabel))
      ),
      ovField(
        t("group.chunkLength"),
        t("group.chunkLengthHint"),
        ovSelect("replyChunkChars", t("group.chunkLength"), numOptions(
          [200, 300, 500, 800, 1e3, 1500, 2e3, 3e3, 4e3],
          (n) => String(n)
        ))
      ),
      ovField(
        t("group.maxReplies"),
        t("group.maxRepliesHint"),
        ovSelect("maxRepliesPerMessage", t("group.maxReplies"), numOptions(
          [1, 2, 3, 4, 5],
          (n) => fmt("override.countOption", n)
        ))
      )
    ]),
    ovGroup("content", t("group.secContent"), [
      ovField(
        t("policy.markdown"),
        t("group.markdownHint"),
        ovSelect("markdownReply", t("policy.markdown"), triOptions())
      ),
      // 长期记忆（memoryEnabled）已从界面移除（默认常开，仅 bots.json 可配）；
      // 草稿仍读取/回写该字段，避免保存时丢掉配置文件里已设置的值。
      ovField(
        t("feature.bannedWords"),
        t("group.bannedWordsHint"),
        TextArea({
          rows: 2,
          value: String(draft.bannedWords ?? ""),
          placeholder: t("group.bannedWordsPlaceholder"),
          onChange: (ev) => setOverrideField("bannedWords", ev.target.value),
          "aria-label": t("feature.bannedWords")
        }),
        true
      )
    ])
  );
  return h(
    "div",
    { className: "qbot-modalOverlay" },
    h(
      "div",
      {
        className: "qbot-modal qbot-modalWide qbot-ovModal",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": t("group.title")
      },
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
      h("div", { className: "qbot-modalList" }, form),
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

// src/client/dialogs/platform-tools-dialog.tsx
var React12 = __toESM(require("react"), 1);

// src/client/dialogs/platform-tools.tsx
var React11 = __toESM(require("react"), 1);
var import_react_dom = require("react-dom");

// src/shared/moderation-escalation.ts
var DEFAULT_ESCALATION = {
  escalateEnabled: true,
  escalateMode: "linear",
  escalateFactor: 1,
  escalateSteps: [],
  escalateCap: 43200
};
var MUTE_MAX_MINUTES = 43200;
var clamp = (value, min, max, fallback) => {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
};
function normalizeEscalateSteps(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((v) => Number(v)).filter((v) => Number.isFinite(v) && v >= 1).map((v) => Math.min(MUTE_MAX_MINUTES, Math.round(v))).slice(0, 20);
}
function escalateDuration(baseMinutes, settings, offense) {
  const base = Math.max(0, Math.floor(Number(baseMinutes) || 0));
  if (base <= 0) return 0;
  const n = Math.max(1, Math.floor(Number(offense) || 1));
  if (!settings.escalateEnabled) return base;
  const cap = Math.round(clamp(settings.escalateCap, 1, MUTE_MAX_MINUTES, MUTE_MAX_MINUTES));
  const factor = clamp(settings.escalateFactor, 0.1, 10, 1);
  let minutes;
  if (settings.escalateMode === "custom") {
    const steps = normalizeEscalateSteps(settings.escalateSteps);
    minutes = steps.length ? steps[Math.min(n, steps.length) - 1] : base * n;
  } else if (settings.escalateMode === "geometric") {
    minutes = base * Math.pow(factor, n - 1);
  } else {
    minutes = base * (1 + factor * (n - 1));
  }
  return Math.max(1, Math.min(cap, Math.round(minutes)));
}

// src/client/dialogs/ai-chat-panel.tsx
var React10 = __toESM(require("react"), 1);
function AiOpsLogPanel(props) {
  const { rpcCall, appId, scope, groupOpenid, guildId } = props;
  useLocale();
  const [logs, setLogs] = React10.useState([]);
  const [loading, setLoading] = React10.useState(false);
  const [usage, setUsage] = React10.useState({ local: 0, cache: 0, llm: 0, savedTokens: 0 });
  const load = React10.useCallback(async () => {
    setLoading(true);
    try {
      const [logRes, statRes] = await Promise.all([
        rpcCall("ai.logs", { appId, scope, groupOpenid, guildId, limit: 30 }),
        rpcCall("ai.stats", { scope })
      ]);
      if (logRes.ok) {
        const rows = val(logRes)?.logs;
        setLogs(Array.isArray(rows) ? rows.slice(0, 30) : []);
      }
      if (statRes.ok) {
        const s = val(statRes)?.stats ?? {};
        setUsage({
          local: Number(s.local) || 0,
          cache: Number(s.cache) || 0,
          llm: Number(s.llm) || 0,
          savedTokens: Number(s.savedTokens) || 0
        });
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [rpcCall, appId, scope, groupOpenid, guildId]);
  React10.useEffect(() => {
    let alive = true;
    void load();
    const timer = setInterval(() => {
      if (alive) void load();
    }, 15e3);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [load]);
  const sourceLabel = (s) => s === "local" ? t("ai.srcLocal") : s === "llm" ? t("ai.srcLlm") : s === "cache" ? t("ai.srcCache") : s === "none" ? t("ai.srcNone") : "";
  const targetOf = (row) => {
    if (row.scope === "group") return row.groupOpenid;
    return row.channelId || row.guildId;
  };
  return h(
    "div",
    { className: "qbot-aiPanel" },
    h(
      "div",
      { className: "qbot-aiHead" },
      h(
        "div",
        null,
        h("strong", null, t(scope === "guild" ? "ai.titleGuild" : "ai.titleGroup")),
        h("p", { className: "qbot-aiSub" }, t(scope === "guild" ? "ai.subtitleGuild" : "ai.subtitleGroup"))
      ),
      h("button", {
        className: "qbot-btn",
        type: "button",
        disabled: loading,
        onClick: () => void load()
      }, loading ? t("common.refreshing") : t("ai.refresh"))
    ),
    h("p", { className: "qbot-aiDisclaimer" }, t(scope === "guild" ? "ai.disclaimerGuild" : "ai.disclaimerGroup")),
    h(
      "div",
      { className: "qbot-aiBody" },
      h(
        "div",
        { className: "qbot-aiTimeline" },
        logs.length === 0 ? h(
          "div",
          { className: "qbot-aiTlRow is-empty" },
          h("div", { className: "qbot-aiTlTime" }, "—"),
          h("div", { className: "qbot-aiTlNode" }),
          h(
            "div",
            { className: "qbot-aiTlContent" },
            h("div", { className: "qbot-aiEmpty" }, t("ai.logEmpty"))
          )
        ) : logs.map((row) => {
          const target = targetOf(row);
          return h(
            "div",
            {
              key: row.id,
              className: `qbot-aiTlRow is-${row.ok ? "ok" : "fail"}`
            },
            h("div", { className: "qbot-aiTlTime" }, formatTime(row.at)),
            h("div", { className: "qbot-aiTlNode" }),
            h(
              "div",
              { className: "qbot-aiTlContent" },
              h(
                "div",
                {
                  className: `qbot-aiLog is-${row.ok ? "ok" : "fail"}`
                },
                h(
                  "div",
                  { className: "qbot-aiLogHead" },
                  row.source ? h("span", { className: `qbot-aiSrc is-${row.source}` }, sourceLabel(row.source)) : null,
                  h("span", { className: "qbot-aiLogState" }, row.ok ? t("ai.logOk") : t("ai.logFail"))
                ),
                h("div", { className: "qbot-aiLogAction" }, row.actionLabel || row.action || "—"),
                h("div", { className: "qbot-aiLogText" }, row.text),
                h("div", { className: "qbot-aiBubble" }, row.reply || row.error || ""),
                target ? h("div", { className: "qbot-aiLogTarget" }, fmt("ai.logTarget", target)) : null
              )
            )
          );
        })
      )
    ),
    h(
      "div",
      { className: "qbot-aiUsage" },
      h("span", null, t("ai.usage")),
      h("span", null, fmt("ai.usageStat", usage.local, usage.cache, usage.llm, usage.savedTokens))
    )
  );
}
var AiChatPanel = AiOpsLogPanel;

// src/client/dialogs/platform-tools.tsx
function friendlyError(message) {
  if (/40034105|主动消息失败|proactive message.*denied/i.test(message)) return t("pt.errProactiveDenied");
  if (/40034141|40034004|图片转存失败|富媒体信息转存失败/i.test(message)) return t("pt.errImageTransfer");
  if (/unknown endpoint/i.test(message)) return t("pt.errHostRestart");
  return message;
}
function modErrorText(error) {
  if (!error) return "";
  if (/40103004|不允许被禁言/.test(error)) return t("pt.modErrAdminTarget");
  return error;
}
function fmtExpire(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
var ADMIN_ROLES = /* @__PURE__ */ new Set(["admin", "owner"]);
var COMMAND_MENU_ITEMS = [
  { cmd: "/help", name: "帮助" },
  { cmd: "/status", name: "运行状态" },
  { cmd: "/new", name: "新会话" },
  { cmd: "/session", name: "会话信息" },
  { cmd: "/schedule", name: "定时消息" },
  { cmd: "/memory", name: "长期记忆" }
];
var PANEL_CMD_LABELS = {
  "/help": "pt.cmdHelp",
  "/status": "pt.cmdStatus",
  "/new": "pt.cmdNew",
  "/session": "pt.cmdSession",
  "/memory": "pt.cmdMemory",
  "/forget": "pt.cmdForget",
  "/recall": "pt.cmdRecall",
  "/broadcast": "pt.cmdBroadcast",
  "/schedule": "pt.cmdSchedule",
  "/stop": "pt.cmdStop",
  "/steer": "pt.cmdSteer",
  "/perm": "pt.cmdPerm"
};
var PANEL_COMMANDS = Object.keys(PANEL_CMD_LABELS);
function normalizePanelCmd(raw) {
  const name2 = typeof raw === "string" ? raw.trim() : "";
  if (PANEL_COMMANDS.includes(name2)) return name2;
  const withSlash = name2.startsWith("/") ? name2 : `/${name2}`;
  return PANEL_COMMANDS.includes(withSlash) ? withSlash : name2;
}
function PlatformTools({ rpcCall, appId, groups, onNotify, focus, embedded, group: groupProp, onGroupChange }) {
  useLocale();
  const [busy, setBusy] = React11.useState("");
  const run = React11.useCallback(async (key, fn) => {
    if (!appId) return;
    setBusy(key);
    try {
      const ok = await fn();
      if (typeof ok === "string" && ok) onNotify?.(ok, "success");
    } catch (e) {
      onNotify?.(friendlyError(errText(e)), "error");
    } finally {
      setBusy("");
    }
  }, [appId, onNotify]);
  const btn = (key, label, onClick, primary = false, extra = {}) => h("button", {
    className: `qbot-btn${primary ? " qbot-btnPrimary" : ""}`,
    type: "button",
    disabled: busy === key || extra.disabled === true,
    onClick,
    ...extra
  }, busy === key ? t("common.loading") : label);
  const [groupOptions, setGroupOptions] = React11.useState([]);
  const groupsKey = groups.join("\0");
  React11.useEffect(() => {
    let alive = true;
    const opts = groups.filter((g) => g && g.trim() !== "*").map((g) => ({ value: g, label: g, source: "config" }));
    setGroupOptions(opts);
    if (appId) {
      void rpcCall("platform.archiveChats", { appId }).then((res) => {
        if (!alive || !res.ok) return;
        const chats = val(res)?.chats ?? [];
        const extras = [];
        const seen = new Set(opts.map((o) => o.value));
        for (const c of chats) {
          if (c.scope !== "group" || !c.openid || seen.has(c.openid)) continue;
          seen.add(c.openid);
          const when = c.lastTs ? formatTime(c.lastTs) : "";
          extras.push({
            value: c.openid,
            label: c.lastSenderName ? `${c.lastSenderName} · ${c.openid.slice(0, 12)}…` : c.openid,
            source: "archive",
            hint: fmt("pt.groupArchiveHint", when || "—", String(c.count ?? 0))
          });
        }
        setGroupOptions([...opts, ...extras]);
      }).catch(() => void 0);
    }
    return () => {
      alive = false;
    };
  }, [rpcCall, appId, groupsKey]);
  const groupInfoMap = useGroupInfos(rpcCall, appId, groupOptions.map((o) => o.value));
  const displayOptions = React11.useMemo(() => groupOptions.map((o) => {
    const info = groupInfoMap[o.value];
    return {
      ...o,
      label: info?.group_name || o.label,
      memberNum: info?.group_member_num && info.group_member_num > 0 ? info.group_member_num : void 0
    };
  }), [groupOptions, groupInfoMap]);
  const [groupLocal, setGroupLocal] = React11.useState("");
  const group = groupProp !== void 0 ? groupProp : groupLocal;
  const setGroup = React11.useCallback((g) => {
    setGroupLocal(g);
    onGroupChange?.(g);
  }, [onGroupChange]);
  const [perm, setPerm] = React11.useState("idle");
  const [permMsg, setPermMsg] = React11.useState("");
  const canAdmin = perm === "admin";
  const checkPerm = React11.useCallback((g) => {
    if (!g) {
      setPerm("idle");
      setPermMsg("");
      return;
    }
    setPerm("checking");
    setPermMsg("");
    void rpcCall("platform.bot.state", { appId, groupOpenid: g }).then((res) => {
      if (!res.ok) {
        setPerm("error");
        setPermMsg(errText(res.error));
        return;
      }
      const role = String(val(res)?.member_role ?? "member");
      if (role === "owner") {
        setPerm("admin");
        setPermMsg(t("pt.permOwner"));
      } else if (ADMIN_ROLES.has(role)) {
        setPerm("admin");
        setPermMsg(t("pt.permAdmin"));
      } else {
        setPerm("member");
        setPermMsg(t("pt.permMember"));
      }
    }).catch((e) => {
      setPerm("error");
      setPermMsg(errText(e));
    });
  }, [rpcCall, appId]);
  const MOD_CATS = ["illegal", "porn_gamble", "abuse", "ad_spam", "flood"];
  const DEFAULT_DURATION = { min: 10, max: 43200 };
  const clampDur = (v, fallback) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 1 ? Math.min(43200, Math.round(n)) : fallback;
  };
  const oneDurRange = (raw, fallback) => {
    if (typeof raw === "number" || typeof raw === "string" && raw.trim()) {
      const n = clampDur(raw, fallback.min);
      return { min: n, max: n };
    }
    const o = raw && typeof raw === "object" ? raw : {};
    const min = clampDur(o.min, fallback.min);
    const max = clampDur(o.max, fallback.max);
    return min <= max ? { min, max } : { min: max, max: min };
  };
  const normalizeDuration = (raw) => {
    if (raw && typeof raw === "object" && (raw.min !== void 0 || raw.max !== void 0)) {
      return oneDurRange(raw, DEFAULT_DURATION);
    }
    const legacy = raw && typeof raw === "object" ? ["light", "medium", "severe"].map((lv) => raw[lv]).filter((v) => v !== void 0) : [];
    if (legacy.length) {
      const ranges = legacy.map((v) => oneDurRange(v, DEFAULT_DURATION));
      return {
        min: Math.min(...ranges.map((r) => r.min)),
        max: Math.max(...ranges.map((r) => r.max))
      };
    }
    return oneDurRange(raw, DEFAULT_DURATION);
  };
  const rangeMid = (r) => Math.round((r.min + r.max) / 2);
  const durRangeLabel = (r) => `${r.min}–${r.max}`;
  const emptyModConfig = () => ({
    enabled: false,
    categories: [...MOD_CATS],
    rules: [],
    durations: DEFAULT_DURATION,
    whitelist: [],
    ...DEFAULT_ESCALATION,
    escalateSteps: [],
    strikeWindowDays: 30,
    strictness: "lenient"
  });
  const stepsText = (steps) => (steps ?? []).join(", ");
  const [modCfg, setModCfg] = React11.useState(emptyModConfig());
  const [modCfgLoaded, setModCfgLoaded] = React11.useState(false);
  const [modRulesText, setModRulesText] = React11.useState("");
  const [modWhiteText, setModWhiteText] = React11.useState("");
  const [modStepsText, setModStepsText] = React11.useState("");
  const [modTestText, setModTestText] = React11.useState("");
  const [modTestResult, setModTestResult] = React11.useState(null);
  const [modLogs, setModLogs] = React11.useState([]);
  const [modLogsLoaded, setModLogsLoaded] = React11.useState(false);
  const [modInnerTab, setModInnerTab] = React11.useState(focus?.modTab ?? "config");
  const loadModeration = () => void run("mod.get", async () => {
    if (!group) throw new Error(t("pt.groupNoSelect"));
    const res = await rpcCall("moderation.config.get", { appId, groupOpenid: group });
    if (!res.ok) throw new Error(errText(res));
    const cfg = { ...emptyModConfig(), ...val(res)?.config ?? {} };
    cfg.durations = normalizeDuration(cfg.durations);
    cfg.strictness = "lenient";
    setModCfg(cfg);
    setModRulesText((cfg.rules ?? []).join("\n"));
    setModWhiteText((cfg.whitelist ?? []).join("\n"));
    setModStepsText(stepsText(cfg.escalateSteps));
    setModCfgLoaded(true);
  });
  const modDraft = () => ({
    enabled: modCfg.enabled,
    categories: modCfg.categories,
    // 规则按行拆（占位符写明「每行一条」）；按逗号拆会把「禁止发广告，违者踢出」这类复合规则割裂。
    rules: modRulesText.split(/\r?\n/).map((s) => s.trim()).filter(Boolean),
    whitelist: modWhiteText.split(/[\n，,\s]+/).map((s) => s.trim()).filter(Boolean),
    durations: normalizeDuration(modCfg.durations),
    escalateEnabled: modCfg.escalateEnabled,
    escalateMode: modCfg.escalateMode,
    escalateFactor: Math.max(0.1, Math.min(10, Number(modCfg.escalateFactor) || 1)),
    escalateSteps: modStepsText.split(/[\n，,、\s]+/).map((s) => Number(s.trim())).filter((n) => Number.isFinite(n) && n >= 1).map((n) => Math.min(43200, Math.round(n))).slice(0, 20),
    escalateCap: Math.max(1, Math.min(43200, Math.round(Number(modCfg.escalateCap) || 43200))),
    strikeWindowDays: Math.max(1, Math.min(3650, Math.round(Number(modCfg.strikeWindowDays) || 30))),
    strictness: "lenient"
  });
  const saveModeration = () => void run("mod.save", async () => {
    if (!group) throw new Error(t("pt.groupNoSelect"));
    const draft = modDraft();
    const res = await rpcCall("moderation.config.save", { appId, groupOpenid: group, config: draft });
    if (!res.ok) throw new Error(errText(res));
    const saved = val(res)?.config ?? draft;
    setModCfg(saved);
    setModStepsText(stepsText(saved.escalateSteps));
    return t("pt.modSaved");
  });
  const testModeration = () => void run("mod.test", async () => {
    if (!group) throw new Error(t("pt.groupNoSelect"));
    if (!modTestText.trim()) throw new Error(t("pt.modTestEmpty"));
    const res = await rpcCall("moderation.test", {
      appId,
      groupOpenid: group,
      content: modTestText,
      config: modDraft()
    });
    if (!res.ok) throw new Error(errText(res));
    setModTestResult(val(res));
  });
  const loadModLogs = () => void run("mod.logs", async () => {
    const res = await rpcCall("moderation.logs", { appId, groupOpenid: group, limit: 100 });
    if (!res.ok) throw new Error(errText(res));
    setModLogs(Array.isArray(val(res)?.logs) ? val(res).logs : []);
    setModLogsLoaded(true);
  });
  const resetModDraft = () => {
    setModCfg(emptyModConfig());
    setModRulesText("");
    setModWhiteText("");
    setModStepsText("");
    setModTestText("");
    setModTestResult(null);
    setModCfgLoaded(false);
    setModLogs([]);
    setModLogsLoaded(false);
  };
  const fmtDuration = (mins) => {
    const m = Math.max(0, Math.round(Number(mins) || 0));
    if (m < 60) return fmt("pt.modDurMin", String(m));
    if (m < 1440) return fmt("pt.modDurHour", String(Math.round(m / 60 * 10) / 10));
    return fmt("pt.modDurDay", String(Math.round(m / 1440 * 10) / 10));
  };
  const [muted, setMuted] = React11.useState([]);
  const [mutedLoaded, setMutedLoaded] = React11.useState(false);
  const [mutedChecked, setMutedChecked] = React11.useState(/* @__PURE__ */ new Set());
  const [muteAdjustMinutes, setMuteAdjustMinutes] = React11.useState(30);
  const fetchMuted = async () => {
    if (!group) throw new Error(t("pt.groupNoSelect"));
    const res = await rpcCall("platform.mute.get", { appId, groupOpenid: group });
    if (!res.ok) throw new Error(errText(res));
    const list = val(res)?.members ?? [];
    setMuted(list);
    setMutedLoaded(true);
    setMutedChecked(/* @__PURE__ */ new Set());
    return list.length;
  };
  const loadMuted = () => void run("mod.muted", async () => {
    await fetchMuted();
  });
  const toggleMutedCheck = (openid) => setMutedChecked((prev) => {
    const next = new Set(prev);
    if (next.has(openid)) next.delete(openid);
    else next.add(openid);
    return next;
  });
  const adjustMuted = (deltaMinutes) => void run("mod.muteAdj", async () => {
    const ids = [...mutedChecked];
    if (!ids.length) throw new Error(t("pt.needSelectMember"));
    const res = await rpcCall("platform.mute.adjust", { appId, groupOpenid: group, memberOpenids: ids, deltaMinutes });
    if (!res.ok) throw new Error(errText(res));
    const verb = deltaMinutes > 0 ? t("pt.mutedRenewed") : t("pt.mutedReduced");
    await fetchMuted().catch(() => void 0);
    return `${fmt(verb, String(ids.length))} · ${fmtDuration(Math.abs(deltaMinutes))}`;
  });
  const unmuteMuted = () => void run("mod.muteUn", async () => {
    const ids = [...mutedChecked];
    if (!ids.length) throw new Error(t("pt.needSelectMember"));
    const res = await rpcCall("platform.mute.set", { appId, groupOpenid: group, memberOpenids: ids, minutes: 0 });
    if (!res.ok) throw new Error(errText(res));
    setMuted((prev) => prev.filter((m) => !mutedChecked.has(m.member_openid)));
    setMutedChecked(/* @__PURE__ */ new Set());
    return fmt("pt.unmuteDone", String(ids.length));
  });
  const pickGroup = (g) => {
    setGroup(g);
    setProfile(null);
    setMembers([]);
    setMemberDetail(null);
    setBlacklist([]);
    setRequests([]);
    setChecked(/* @__PURE__ */ new Set());
    resetModDraft();
    setModLogs([]);
    setModLogsLoaded(false);
    setJaCfg(defaultJaCfg());
    setJaReqText("");
    setJaWhiteText("");
    setJaCfgLoaded(false);
    setJaLogs([]);
    setJaLogsLoaded(false);
    setMuted([]);
    setMutedLoaded(false);
    setMutedChecked(/* @__PURE__ */ new Set());
  };
  const [profile, setProfile] = React11.useState(null);
  const loadProfile = () => void run("info", async () => {
    if (!group) throw new Error(t("pt.groupNoSelect"));
    const res = await rpcCall("platform.group.info", { appId, groupOpenid: group });
    if (!res.ok) throw new Error(errText(res));
    setProfile(val(res) ?? {});
  });
  const [members, setMembers] = React11.useState([]);
  const [memberCursor, setMemberCursor] = React11.useState("");
  const [memberDetail, setMemberDetail] = React11.useState(null);
  const [checked, setChecked] = React11.useState(/* @__PURE__ */ new Set());
  const [memberSearch, setMemberSearch] = React11.useState("");
  const [muteMinutes, setMuteMinutes] = React11.useState(10);
  const loadMembers = (nextCursor = "") => void run("adm.members", async () => {
    if (!group) throw new Error(t("pt.groupNoSelect"));
    const res = await rpcCall("platform.group.members", { appId, groupOpenid: group, cursor: nextCursor });
    if (!res.ok) throw new Error(errText(res));
    const list = val(res)?.members ?? [];
    setMemberCursor(String(val(res)?.nextCursor ?? ""));
    setMembers((prev) => nextCursor ? [...prev, ...list] : list);
    if (!nextCursor) {
      setChecked(/* @__PURE__ */ new Set());
      setMemberDetail(null);
    }
  });
  const toggleCheck = (openid) => setChecked((prev) => {
    const next = new Set(prev);
    if (next.has(openid)) next.delete(openid);
    else next.add(openid);
    return next;
  });
  const shownMembers = members.filter((m) => {
    const q = memberSearch.trim().toLowerCase();
    return !q || (m.username || "").toLowerCase().includes(q) || m.member_openid.toLowerCase().includes(q);
  });
  const checkedList = [...checked];
  const muteSelected = (minutes) => void run("adm.mute", async () => {
    if (!checkedList.length) throw new Error(t("pt.needSelectMember"));
    const res = await rpcCall("platform.mute.set", { appId, groupOpenid: group, memberOpenids: checkedList, minutes });
    if (!res.ok) throw new Error(errText(res));
    return minutes > 0 ? fmt("pt.muteDone", checkedList.length) : fmt("pt.unmuteDone", checkedList.length);
  });
  const removeSelected = () => void run("adm.remove", async () => {
    const res = await rpcCall("platform.group.removeMembers", { appId, groupOpenid: group, memberOpenids: checkedList });
    if (!res.ok) throw new Error(errText(res));
    setMembers((prev) => prev.filter((m) => !checked.has(m.member_openid)));
    setChecked(/* @__PURE__ */ new Set());
    return fmt("pt.removeDone", checkedList.length);
  });
  const showMemberDetail = (m) => void run(`adm.detail:${m.member_openid}`, async () => {
    const res = await rpcCall("platform.group.member", { appId, groupOpenid: group, memberOpenid: m.member_openid });
    if (!res.ok) throw new Error(errText(res));
    const info = val(res) ?? {};
    setMemberDetail({
      member_openid: m.member_openid,
      username: info.username ?? m.username,
      member_role: info.member_role ?? m.member_role,
      ...info
    });
  });
  const [blacklist, setBlacklist] = React11.useState([]);
  const [blackPick, setBlackPick] = React11.useState("");
  const loadBlacklist = () => void run("black.list", async () => {
    if (!group) throw new Error(t("pt.groupNoSelect"));
    const res = await rpcCall("platform.blacklist.list", { appId, groupOpenid: group, limit: 100 });
    if (!res.ok) throw new Error(errText(res));
    const list = val(res)?.users ?? [];
    setBlacklist(list);
  });
  const changeBlacklist = (op, openids) => void run(`black.${op}`, async () => {
    if (!openids.length) throw new Error(t("pt.groupNoSelect"));
    const res = await rpcCall("platform.blacklist.set", { appId, groupOpenid: group, op, memberOpenids: openids });
    if (!res.ok) throw new Error(errText(res));
    const fail = val(res)?.failOpenids ?? [];
    if (op === "add") {
      setBlacklist((prev) => [...prev, ...openids.filter((o) => !fail.includes(o)).map((o) => ({
        member_openid: o,
        username: o,
        banned_at: ""
      }))]);
      setBlackPick("");
      return fmt("pt.blackAdded", fail.length);
    }
    setBlacklist((prev) => prev.filter((b) => !openids.includes(b.member_openid)));
    return fmt("pt.blackRemoved", fail.length);
  });
  const blackCandidates = members.filter((m) => !blacklist.some((b) => b.member_openid === m.member_openid)).map((m) => ({ value: m.member_openid, label: `${m.username || m.member_openid.slice(0, 10)} · ${m.member_openid.slice(0, 10)}…`, source: "archive" }));
  const [requests, setRequests] = React11.useState([]);
  const loadRequests = () => void run("join.list", async () => {
    if (!group) throw new Error(t("pt.groupNoSelect"));
    const res = await rpcCall("platform.join.requests", { appId, groupOpenid: group, limit: 50 });
    if (!res.ok) throw new Error(errText(res));
    setRequests(val(res)?.list ?? []);
  });
  const approveJoin = (row, approve) => void run(
    `join.${approve ? "ok" : "no"}:${row.member_openid}`,
    async () => {
      const res = await rpcCall("platform.join.approve", {
        appId,
        groupOpenid: group,
        memberOpenid: row.member_openid,
        approve,
        joinRequestId: row.join_request_id,
        rejectReason: approve ? "" : t("pt.joinDefaultReason")
      });
      if (!res.ok) throw new Error(errText(res));
      setRequests((prev) => prev.filter((r) => r.member_openid !== row.member_openid));
      return approve ? fmt("pt.joinApproved", row.username) : fmt("pt.joinDeclined", row.username);
    }
  );
  const defaultJaCfg = () => ({ enabled: false, requirements: [], allowEmpty: false, whitelist: [] });
  const [jaCfg, setJaCfg] = React11.useState(defaultJaCfg());
  const [jaCfgLoaded, setJaCfgLoaded] = React11.useState(false);
  const [jaReqText, setJaReqText] = React11.useState("");
  const [jaWhiteText, setJaWhiteText] = React11.useState("");
  const [jaLogs, setJaLogs] = React11.useState([]);
  const [jaLogsLoaded, setJaLogsLoaded] = React11.useState(false);
  const [jaInnerTab, setJaInnerTab] = React11.useState(focus?.joinTab ?? "auto");
  const loadJoinAuto = () => void run("ja.get", async () => {
    if (!group) throw new Error(t("pt.groupNoSelect"));
    const res = await rpcCall("join.auto.config.get", { appId, groupOpenid: group });
    if (!res.ok) throw new Error(errText(res));
    const cfg = val(res)?.config ?? defaultJaCfg();
    setJaCfg(cfg);
    setJaReqText((cfg.requirements ?? []).join("\n"));
    setJaWhiteText((cfg.whitelist ?? []).join("\n"));
    setJaCfgLoaded(true);
  });
  const saveJoinAuto = () => void run("ja.save", async () => {
    if (!group) throw new Error(t("pt.groupNoSelect"));
    const draft = {
      enabled: jaCfg.enabled,
      allowEmpty: jaCfg.allowEmpty,
      requirements: jaReqText.split(/[\n，,]+/).map((s) => s.trim()).filter(Boolean),
      whitelist: jaWhiteText.split(/[\n，,]+/).map((s) => s.trim()).filter(Boolean)
    };
    const res = await rpcCall("join.auto.config.save", { appId, groupOpenid: group, config: draft });
    if (!res.ok) throw new Error(errText(res));
    setJaCfg(val(res)?.config ?? draft);
    return t("pt.jaSaved");
  });
  const loadJoinAutoLogs = () => void run("ja.logs", async () => {
    const res = await rpcCall("join.auto.logs", { appId, groupOpenid: group, limit: 30 });
    if (!res.ok) throw new Error(errText(res));
    setJaLogs(Array.isArray(val(res)?.logs) ? val(res).logs : []);
    setJaLogsLoaded(true);
  });
  const pickJoinTab = (k) => setJaInnerTab(k);
  const [shareUrl, setShareUrl] = React11.useState("");
  const genShareLink = () => void run("share", async () => {
    const res = await rpcCall("platform.shareLink", { appId });
    if (!res.ok) throw new Error(errText(res));
    setShareUrl(String(val(res)?.url ?? ""));
    return t("pt.shareDone");
  });
  const [selfInfo, setSelfInfo] = React11.useState(null);
  const loadSelfInfo = () => void run("self", async () => {
    const res = await rpcCall("platform.selfInfo", { appId });
    if (!res.ok) throw new Error(errText(res));
    setSelfInfo(val(res) ?? {});
  });
  const [menuJson, setMenuJson] = React11.useState("");
  const [menuDirty, setMenuDirty] = React11.useState(false);
  const loadMenu = () => void run("menu.load", async () => {
    const res = await rpcCall("platform.menu.get", { appId });
    if (!res.ok) throw new Error(errText(res));
    const items = Array.isArray(val(res)?.items) ? val(res).items : [];
    setMenuJson(JSON.stringify(items, null, 2));
    setMenuDirty(false);
  });
  const saveMenu = () => void run("menu.save", async () => {
    let items;
    try {
      items = JSON.parse(menuJson);
    } catch {
      throw new Error(t("pt.menuBadJson"));
    }
    if (!Array.isArray(items)) throw new Error(t("pt.menuBadJson"));
    const res = await rpcCall("platform.menu.put", { appId, items });
    if (!res.ok) throw new Error(errText(res));
    setMenuDirty(false);
    return fmt("pt.menuSaved", String(val(res)?.version ?? "?"));
  });
  const genMenu = () => {
    setMenuJson(JSON.stringify(COMMAND_MENU_ITEMS.map((c) => ({
      type: "send_message",
      name: c.name,
      send_message: c.cmd
    })), null, 2));
    setMenuDirty(true);
  };
  const PANEL_ITEM_MAX = 20;
  const emptyPanelItem = () => ({ type: "command", name: "/help", desc: "", only_admin: false, link: "" });
  const normalizePanelItems = (raw) => {
    const rows = Array.isArray(raw) ? raw : [];
    return rows.slice(0, PANEL_ITEM_MAX).map((r) => {
      const type = r?.type === "link" ? "link" : "command";
      return {
        type,
        // 命令按钮回显时补回丢失的前导 /（如 status -> /status），查看/编辑都能正确还原。
        name: type === "command" ? normalizePanelCmd(r?.name) : String(r?.name ?? ""),
        desc: String(r?.desc ?? ""),
        only_admin: r?.only_admin === true,
        link: String(r?.link ?? "")
      };
    });
  };
  const [panels, setPanels] = React11.useState([]);
  const [panelsLoaded, setPanelsLoaded] = React11.useState(false);
  const [panelFormMode, setPanelFormMode] = React11.useState("");
  const [panelEditId, setPanelEditId] = React11.useState("");
  const [panelItems, setPanelItems] = React11.useState([]);
  const [panelRemark, setPanelRemark] = React11.useState("");
  const panelReadonly = panelFormMode === "view";
  const panelCmdChoices = () => PANEL_COMMANDS.map((cmd) => ({ cmd, labelKey: PANEL_CMD_LABELS[cmd] }));
  const panelCmdCmds = PANEL_COMMANDS;
  const loadPanels = () => void run("panels.load", async () => {
    const res = await rpcCall("platform.panels.list", { appId, scope: "group" });
    if (!res.ok) throw new Error(errText(res));
    const list = Array.isArray(val(res)?.panels) ? val(res).panels : [];
    setPanels(list);
    setPanelsLoaded(true);
    setPanelFormMode("");
  });
  const startNewPanel = () => {
    setPanelFormMode("create");
    setPanelEditId("");
    setPanelItems([{ type: "command", name: "/help", desc: "", only_admin: false, link: "" }]);
    setPanelRemark("");
  };
  const openPanel = (p, mode) => {
    setPanelFormMode(mode);
    setPanelEditId(p.panel_id ?? "");
    setPanelItems(normalizePanelItems(p.panel?.items));
    setPanelRemark(p.panel?.remark ?? "");
  };
  const closePanelForm = () => {
    setPanelFormMode("");
    setPanelEditId("");
  };
  const updatePanelItem = (idx, patch) => setPanelItems((prev) => prev.map((it, i) => i === idx ? { ...it, ...patch } : it));
  const addPanelItem = () => setPanelItems((prev) => prev.length >= PANEL_ITEM_MAX ? prev : [...prev, emptyPanelItem()]);
  const removePanelItem = (idx) => setPanelItems((prev) => prev.filter((_, i) => i !== idx));
  const savePanel = () => void run("panels.save", async () => {
    if (!panelItems.length) throw new Error(t("pt.panelNeedItem"));
    if (panelItems.some((it) => !it.name.trim())) throw new Error(t("pt.panelItemNeedName"));
    if (panelItems.some((it) => it.type === "command" && !panelCmdCmds.includes(normalizePanelCmd(it.name)))) {
      throw new Error(t("pt.panelCmdNeedSelect"));
    }
    if (panelItems.some((it) => it.type === "link" && !/^https:\/\//i.test(it.link.trim()))) throw new Error(t("pt.panelItemBadLink"));
    const items = panelItems.map((it) => ({
      type: it.type,
      name: it.type === "command" ? normalizePanelCmd(it.name) : it.name.trim(),
      desc: it.desc.trim(),
      ...it.only_admin ? { only_admin: true } : {},
      ...it.type === "link" ? { link: it.link.trim() } : {}
    }));
    const panel = { items, ...panelRemark.trim() ? { remark: panelRemark.trim().slice(0, 255) } : {} };
    if (panelEditId) {
      const res2 = await rpcCall("platform.panel.update", { appId, panelId: panelEditId, panel });
      if (!res2.ok) throw new Error(errText(res2));
      closePanelForm();
      loadPanels();
      return t("pt.panelUpdated");
    }
    const body2 = { scope: "group", target_type: "all", panel };
    const res = await rpcCall("platform.panel.create", { appId, body: body2 });
    if (!res.ok) throw new Error(errText(res));
    closePanelForm();
    loadPanels();
    return t("pt.panelCreated");
  });
  const deletePanel = (panelId) => void run(`panels.del:${panelId}`, async () => {
    const res = await rpcCall("platform.panel.delete", { appId, panelId });
    if (!res.ok) throw new Error(errText(res));
    setPanels((prev) => prev.filter((p) => p.panel_id !== panelId));
    if (panelEditId === panelId) closePanelForm();
    return t("pt.panelDeleted");
  });
  const [materialUrl, setMaterialUrl] = React11.useState("");
  const [materialRef, setMaterialRef] = React11.useState("");
  const uploadMaterial = () => void run("material", async () => {
    const res = await rpcCall("platform.uploadMaterial", { appId, url: materialUrl.trim() });
    if (!res.ok) throw new Error(errText(res));
    const ref = String(val(res)?.url ?? "");
    setMaterialRef(ref);
    if (ref) void navigator.clipboard?.writeText(ref).catch(() => void 0);
    return t("pt.materialDone");
  });
  const [cardScope, setCardScope] = React11.useState("group");
  const [cardOpenid, setCardOpenid] = React11.useState("");
  const [cardTitle, setCardTitle] = React11.useState("");
  const [cardDesc, setCardDesc] = React11.useState("");
  const [cardUrl, setCardUrl] = React11.useState("");
  const [cardPic, setCardPic] = React11.useState("");
  const [replyMsgs, setReplyMsgs] = React11.useState([]);
  const [replyMsgId, setReplyMsgId] = React11.useState("");
  const loadReplyMsgs = () => void run("card.replies", async () => {
    if (!cardOpenid.trim()) throw new Error(t("pt.cardOpenidPlaceholder"));
    const res = await rpcCall("platform.recentMessages", {
      appId,
      scope: cardScope,
      openid: cardOpenid.trim()
    });
    if (!res.ok) throw new Error(errText(res));
    const list = val(res)?.messages ?? [];
    setReplyMsgs(list);
    setReplyMsgId(list.length ? list[0].msgId : "");
  });
  const pickCardScope = (v) => {
    setCardScope(v);
    setReplyMsgs([]);
    setReplyMsgId("");
  };
  const pickCardOpenid = (v) => {
    setCardOpenid(v);
    setReplyMsgs([]);
    setReplyMsgId("");
  };
  const sendCard = () => void run("card", async () => {
    const res = await rpcCall("platform.sendCard", {
      appId,
      scope: cardScope,
      openid: cardOpenid.trim(),
      msgId: replyMsgId || void 0,
      title: cardTitle,
      description: cardDesc,
      url: cardUrl,
      picUrl: cardPic
    });
    if (!res.ok) throw new Error(errText(res));
    return t("pt.cardSent");
  });
  const block = (title, hint, ...children) => h(
    "section",
    { className: "qbot-ptBlock" },
    h(
      "div",
      { className: "qbot-ptBlockHead" },
      h("span", { className: "qbot-ptBlockTitle" }, title),
      h("span", { className: "qbot-ptBlockDesc" }, hint)
    ),
    ...children
  );
  const adminBtn = (key, label, onClick, primary = false) => btn(key, label, onClick, primary, { disabled: !canAdmin, title: canAdmin ? void 0 : t("pt.permNeedAdmin") });
  const permBanner = group ? h(
    "div",
    { className: `qbot-ptPerm is-${perm}`, role: "status" },
    perm === "checking" ? h("span", { className: "qbot-ptPermText" }, t("pt.permChecking")) : h(
      React11.Fragment,
      null,
      h(
        "span",
        { className: "qbot-ptPermBadge" },
        perm === "admin" ? t("pt.roleAdmin") : perm === "member" ? t("archive.member") : "!"
      ),
      h(
        "span",
        { className: "qbot-ptPermText" },
        perm === "error" ? fmt("pt.permUnknown", permMsg) : permMsg
      ),
      h("button", {
        type: "button",
        className: "qbot-btn qbot-ptPermRetry",
        onClick: () => checkPerm(group)
      }, t("pt.permRefresh"))
    )
  ) : null;
  const [navKey, setNavKey] = React11.useState(focus?.nav ?? "g:info");
  const subNav = (tabs, active, onPick) => h(
    "div",
    { className: "qbot-ptSubNav", role: "tablist" },
    tabs.map((tab) => h("button", {
      key: tab.key,
      type: "button",
      role: "tab",
      "aria-selected": active === tab.key,
      className: `qbot-ptSubTab${active === tab.key ? " is-active" : ""}`,
      onClick: () => onPick(tab.key)
    }, tab.label))
  );
  const modGroupHead = (title, desc) => h(
    "div",
    { className: "qbot-ptModGroupHead" },
    h("span", { className: "qbot-ptModGroupBar", "aria-hidden": "true" }),
    h(
      "div",
      { className: "qbot-ptModGroupText" },
      h("strong", null, title),
      h("span", null, desc)
    )
  );
  const modStep = (no, title, desc, ...content) => h(
    "div",
    { className: "qbot-ptModStep" },
    h(
      "div",
      { className: "qbot-ptModStepHead" },
      h("span", { className: "qbot-ptModStepNo" }, no),
      h(
        "div",
        { className: "qbot-ptModStepText" },
        h("strong", null, title),
        desc ? h("span", null, desc) : null
      )
    ),
    h("div", { className: "qbot-ptModStepBody" }, ...content)
  );
  const modEscPreview = () => {
    const draft = modDraft();
    const base = rangeMid(draft.durations);
    return [1, 2, 3].map((n) => fmt("pt.modEscPrevItem", String(n), fmtDuration(escalateDuration(base, draft, n)))).join(" / ");
  };
  const modEscalateStep = modStep(
    "5",
    t("pt.modSecEscalate"),
    "",
    h(
      "label",
      { className: "qbot-ptModCheck" },
      h("input", {
        type: "checkbox",
        className: "qbot-checkbox",
        checked: modCfg.escalateEnabled,
        disabled: !canAdmin,
        onChange: (e) => setModCfg((c) => ({ ...c, escalateEnabled: e.target.checked }))
      }),
      h("span", null, t("pt.modEscEnableCheck"))
    ),
    modCfg.escalateEnabled ? h(
      "div",
      { className: "qbot-ptModEsc" },
      h(
        "div",
        { className: "qbot-ptGrid" },
        h(
          "label",
          { key: "mode", className: "qbot-ptField" },
          h("span", null, t("pt.modEscMode")),
          h(
            "select",
            {
              className: "qbot-settingSelect",
              value: modCfg.escalateMode,
              onChange: (e) => setModCfg((c) => ({ ...c, escalateMode: e.target.value })),
              "aria-label": t("pt.modEscMode")
            },
            ["linear", "geometric", "custom"].map((m) => h("option", { key: m, value: m }, t(`pt.modEscMode.${m}`)))
          )
        ),
        modCfg.escalateMode === "custom" ? null : h(
          "label",
          { key: "factor", className: "qbot-ptField" },
          h("span", null, t("pt.modEscFactor")),
          h("input", {
            className: "qbot-settingInput",
            type: "number",
            min: 0.1,
            max: 10,
            step: 0.1,
            value: modCfg.escalateFactor,
            onChange: (e) => setModCfg((c) => ({ ...c, escalateFactor: e.target.value })),
            "aria-label": t("pt.modEscFactor")
          })
        ),
        h(
          "label",
          { key: "cap", className: "qbot-ptField" },
          h("span", null, t("pt.modEscCap")),
          h("input", {
            className: "qbot-settingInput",
            type: "number",
            min: 1,
            max: 43200,
            value: modCfg.escalateCap,
            onChange: (e) => setModCfg((c) => ({ ...c, escalateCap: e.target.value })),
            "aria-label": t("pt.modEscCap")
          })
        ),
        h(
          "label",
          { key: "window", className: "qbot-ptField" },
          h("span", null, t("pt.modEscWindow")),
          h("input", {
            className: "qbot-settingInput",
            type: "number",
            min: 1,
            max: 3650,
            value: modCfg.strikeWindowDays,
            onChange: (e) => setModCfg((c) => ({ ...c, strikeWindowDays: e.target.value })),
            "aria-label": t("pt.modEscWindow")
          })
        )
      ),
      modCfg.escalateMode === "custom" ? h(
        "label",
        { className: "qbot-ptField qbot-ptFieldWide" },
        h("span", null, t("pt.modEscSteps")),
        h("textarea", {
          className: "qbot-ptTextarea",
          rows: 2,
          value: modStepsText,
          placeholder: t("pt.modEscStepsPlaceholder"),
          onChange: (e) => setModStepsText(e.target.value)
        }),
        h("span", { className: "qbot-ptFieldHint" }, t("pt.modEscStepsHint"))
      ) : null,
      h(
        "div",
        { className: "qbot-ptModEscPreview" },
        h("span", null, fmt("pt.modEscPreview", fmtDuration(rangeMid(modCfg.durations)))),
        h("strong", null, modEscPreview())
      )
    ) : h("div", { className: "qbot-ptModEscOff" }, t("pt.modEscOffHint"))
  );
  const modCatsStep = modStep(
    "2",
    t("pt.modSecCats"),
    "",
    h(
      "div",
      { className: "qbot-ptModCats" },
      MOD_CATS.map((cat) => h(
        "label",
        { key: cat, className: "qbot-ptModCat" },
        h("input", {
          type: "checkbox",
          className: "qbot-checkbox",
          checked: modCfg.categories.includes(cat),
          onChange: () => {
            const on = modCfg.categories.includes(cat);
            setModCfg((c) => ({
              ...c,
              categories: on ? c.categories.filter((x) => x !== cat) : [...c.categories, cat]
            }));
          }
        }),
        h("span", null, t(`pt.modCat.${cat}`))
      ))
    )
  );
  const modConfigPane = h(
    React11.Fragment,
    null,
    h(
      "div",
      { className: `qbot-ptModHero${modCfgLoaded && modCfg.enabled ? " is-on" : ""}` },
      h(
        "div",
        { className: "qbot-ptModHeroMain" },
        h(
          "div",
          { className: "qbot-ptModHeroTitle" },
          h("span", { className: "qbot-ptModHeroIcon", "aria-hidden": "true" }, modCfgLoaded && modCfg.enabled ? "✓" : "◎"),
          h("strong", null, t("pt.modCfgTitle")),
          modCfgLoaded ? h(
            "span",
            { className: `qbot-ptModStatus${modCfg.enabled ? " is-on" : " is-off"}` },
            h("span", { className: "qbot-ptModStatusDot" }),
            modCfg.enabled ? t("pt.modOn") : t("pt.modOff")
          ) : null
        ),
        h("div", { className: "qbot-ptModHeroDesc" }, t("pt.modCfgDesc")),
        modCfgLoaded ? h(
          "div",
          { className: "qbot-ptModHeroSummary" },
          h("span", null, fmt("pt.modSummaryCats", String(modCfg.categories.length))),
          h("span", null, fmt("pt.modSummaryDur", durRangeLabel(modCfg.durations)))
        ) : null
      )
    ),
    modCfgLoaded ? h(
      React11.Fragment,
      null,
      // ── 分组一：开关与检测范围 ──────────────────────────────────────
      modGroupHead(t("pt.modGroupDetect"), t("pt.modGroupDetectDesc")),
      h(
        "div",
        { className: "qbot-ptModGroup" },
        modStep(
          "1",
          t("pt.modSecEnable"),
          "",
          h(
            "label",
            { className: "qbot-ptModCheck" },
            h("input", {
              type: "checkbox",
              className: "qbot-checkbox",
              checked: modCfg.enabled,
              disabled: !canAdmin,
              onChange: (e) => setModCfg((c) => ({ ...c, enabled: e.target.checked }))
            }),
            h("span", null, t("pt.modEnableCheck"))
          )
        ),
        modCatsStep,
        // ── 分组二：处罚规则与例外 ──────────────────────────────────────
        modGroupHead(t("pt.modGroupPunish"), t("pt.modGroupPunishDesc")),
        h(
          "div",
          { className: "qbot-ptModGroup" },
          modStep(
            "3",
            t("pt.modSecRules"),
            "",
            h("textarea", {
              className: "qbot-ptTextarea",
              rows: 3,
              value: modRulesText,
              placeholder: t("pt.modRulesPlaceholder"),
              onChange: (e) => setModRulesText(e.target.value)
            }),
            // 规则自测：用草稿配置判定，改完规则不用先保存；只显示模型判定，不真的禁言。
            h(
              "div",
              { className: "qbot-ptModTest" },
              h("div", { className: "qbot-ptModTestTitle" }, t("pt.modTestTitle")),
              h(
                "div",
                { className: "qbot-ptModTestRow" },
                h("input", {
                  className: "qbot-settingInput",
                  value: modTestText,
                  placeholder: t("pt.modTestPlaceholder"),
                  onChange: (e) => setModTestText(e.target.value),
                  "aria-label": t("pt.modTestTitle")
                }),
                adminBtn("mod.test", t("pt.modTestBtn"), testModeration)
              ),
              modTestResult ? h(
                "div",
                { className: `qbot-ptModTestResult is-${modTestResult.level}` },
                h(
                  "span",
                  { className: `qbot-ptModLevel is-${modTestResult.level}` },
                  t(`pt.modLevel.${modTestResult.level}`)
                ),
                h(
                  "span",
                  { className: "qbot-ptModTestReason" },
                  modTestResult.reason || t("pt.modTestNoReason")
                ),
                modTestResult.category && modTestResult.category !== "none" ? h(
                  "span",
                  { className: "qbot-ptModTestChip" },
                  fmt("pt.modTestCat", t(`pt.modCat.${modTestResult.category}`))
                ) : null,
                h(
                  "span",
                  { className: "qbot-ptModTestChip" },
                  fmt("pt.modTestRule", modTestResult.rule || t("pt.modTestNoRule"))
                ),
                h(
                  "span",
                  { className: "qbot-ptModTestChip" },
                  fmt("pt.modTestDuration", fmtDuration(modTestResult.minutes))
                )
              ) : null
            )
          ),
          modStep(
            "4",
            t("pt.modSecDuration"),
            "",
            h(
              "div",
              { className: "qbot-ptGrid" },
              h(
                "div",
                { className: "qbot-ptField" },
                h(
                  "div",
                  { className: "qbot-ptDurRange" },
                  h("input", {
                    className: "qbot-settingInput",
                    type: "number",
                    min: 1,
                    max: 43200,
                    value: modCfg.durations.min,
                    onChange: (e) => setModCfg((c) => ({
                      ...c,
                      durations: { ...c.durations, min: e.target.value }
                    })),
                    "aria-label": t("pt.modRangeFrom")
                  }),
                  h("span", { className: "qbot-ptDurSep", "aria-hidden": "true" }, "~"),
                  h("input", {
                    className: "qbot-settingInput",
                    type: "number",
                    min: 1,
                    max: 43200,
                    value: modCfg.durations.max,
                    onChange: (e) => setModCfg((c) => ({
                      ...c,
                      durations: { ...c.durations, max: e.target.value }
                    })),
                    "aria-label": t("pt.modRangeTo")
                  })
                )
              )
            )
          ),
          modEscalateStep,
          modStep(
            "6",
            t("pt.modSecWhite"),
            "",
            h("textarea", {
              className: "qbot-ptTextarea",
              rows: 2,
              value: modWhiteText,
              placeholder: t("pt.modWhitePlaceholder"),
              onChange: (e) => setModWhiteText(e.target.value)
            })
          )
        ),
        h(
          "div",
          { className: "qbot-ptModSaveBar" },
          adminBtn("mod.save", t("common.save"), saveModeration, true)
        )
      )
    ) : null
  );
  const recentLogs = modLogs.slice(0, 30);
  const modLogStats = h(
    "div",
    { className: "qbot-ptModStats" },
    h(
      "div",
      { className: "qbot-ptModStat" },
      h("strong", null, String(recentLogs.length)),
      h("span", null, t("pt.modStatTotal"))
    ),
    h(
      "div",
      { className: "qbot-ptModStat is-ok" },
      h("strong", null, String(recentLogs.filter((l) => !l.error && !l.privileged && l.minutes > 0).length)),
      h("span", null, t("pt.modStatMuted"))
    ),
    h(
      "div",
      { className: "qbot-ptModStat is-esc" },
      h("strong", null, String(recentLogs.filter((l) => (l.strikeCount ?? 0) > 1).length)),
      h("span", null, t("pt.modStatEsc"))
    ),
    h(
      "div",
      { className: "qbot-ptModStat is-fail" },
      h("strong", null, String(recentLogs.filter((l) => !!l.error).length)),
      h("span", null, t("pt.modStatFailed"))
    )
  );
  const modLogCard = (log, i) => {
    const who = log.senderName || log.sender || "?";
    return h(
      "div",
      { key: i, className: `qbot-ptModRec is-${log.level}${log.error ? " is-failed" : ""}` },
      h("span", { className: "qbot-ptModRecDot", "aria-hidden": "true" }),
      h(
        "div",
        { className: "qbot-ptModRecCard" },
        h(
          "div",
          { className: "qbot-ptModRecHead" },
          h("span", { className: "qbot-ptModRecAvatar", "aria-hidden": "true" }, who.slice(0, 1).toUpperCase()),
          h("span", { className: "qbot-ptModRecWho" }, who),
          h("span", { className: `qbot-ptModLevel is-${log.level}` }, t(`pt.modLevel.${log.level}`)),
          h("time", { className: "qbot-ptModRecTime" }, formatTime(log.at))
        ),
        h("div", { className: "qbot-ptModRecQuote" }, log.content || "—"),
        h(
          "div",
          { className: "qbot-ptModRecReason" },
          h("span", { className: "qbot-ptModRecReasonTag" }, t("pt.modReasonLabel")),
          h("span", null, log.reason || log.category)
        ),
        h(
          "div",
          { className: "qbot-ptModRecChips" },
          log.privileged ? h("span", { className: "qbot-ptModChip is-meta" }, t("pt.modSilent")) : h("span", { className: "qbot-ptModChip" }, fmt("pt.modDuration", fmtDuration(log.minutes))),
          log.source ? h(
            "span",
            { className: "qbot-ptModChip is-meta" },
            t(log.source === "behavior" ? "pt.modSourceBehavior" : log.source === "local" ? "pt.modSourceLocal" : "pt.modSourceLlm")
          ) : null,
          log.recalled ? h("span", { className: "qbot-ptModChip is-ok" }, t("pt.modRecalled")) : null,
          typeof log.strikeCount === "number" ? h("span", { className: "qbot-ptModChip is-strike" }, fmt("pt.modStrikeShort", String(log.strikeCount))) : null,
          log.escalated && typeof log.strikeCount === "number" ? h(
            "span",
            { className: "qbot-ptModChip is-meta" },
            fmt("pt.modStrike", String(log.strikeCount), String(log.baseMinutes ?? 0), String(log.minutes))
          ) : null,
          log.error ? h("span", { className: "qbot-ptModChip is-error" }, t("pt.modFailed")) : null
        ),
        log.error ? h("div", { className: "qbot-ptModRecErr" }, modErrorText(log.error)) : null,
        log.noticeError ? h("div", { className: "qbot-ptModRecErr is-warn" }, `${t("pt.modNoticeFailed")}：${log.noticeError}`) : null
      )
    );
  };
  const modLogsPane = h(
    React11.Fragment,
    null,
    h(
      "div",
      { className: "qbot-ptModLogHead" },
      h(
        "div",
        { className: "qbot-ptModLogHeadText" },
        h("strong", null, t("pt.modLogsTitle")),
        h("span", null, `${t("pt.modLogsHint")} ${t("pt.modLogsScope")}`)
      )
    ),
    modLogsLoaded && recentLogs.length ? h(
      React11.Fragment,
      null,
      modLogStats,
      h("div", { className: "qbot-ptModTimeline" }, recentLogs.map(modLogCard))
    ) : h(
      "div",
      { className: "qbot-ptModLogEmpty" },
      h("span", { className: "qbot-ptModLogEmptyIcon", "aria-hidden": "true" }, "◎"),
      h("strong", null, t("pt.modLogsEmpty")),
      h("span", null, t("pt.modLogsEmptyDesc"))
    )
  );
  const mutedActionBtn = (key, label, variant, onClick) => h("button", {
    type: "button",
    className: `qbot-btn qbot-ptMutedBtn${variant ? ` ${variant}` : ""}`,
    disabled: busy === key || !canAdmin || mutedChecked.size === 0,
    title: !canAdmin ? t("pt.permNeedAdmin") : !mutedChecked.size ? t("pt.needSelectMember") : void 0,
    onClick
  }, busy === key ? t("common.loading") : label);
  const mutedPane = h(
    React11.Fragment,
    null,
    h(
      "div",
      { className: "qbot-ptModLogHead" },
      h(
        "div",
        { className: "qbot-ptModLogHeadText" },
        h("strong", null, t("pt.mutedTitle")),
        h("span", null, t("pt.mutedHint"))
      )
    ),
    mutedLoaded && muted.length ? h(
      React11.Fragment,
      null,
      h(
        "div",
        { className: "qbot-ptMutedOps" },
        h(
          "div",
          { className: "qbot-ptMutedOpsTop" },
          h(
            "label",
            { className: "qbot-ptMutedCheck" },
            h("input", {
              type: "checkbox",
              className: "qbot-checkbox",
              checked: mutedChecked.size > 0 && muted.every((m) => mutedChecked.has(m.member_openid)),
              onChange: () => setMutedChecked((prev) => {
                const all = muted.every((m) => prev.has(m.member_openid));
                const next = new Set(prev);
                for (const m of muted) {
                  if (all) next.delete(m.member_openid);
                  else next.add(m.member_openid);
                }
                return next;
              })
            }),
            h("span", null, t("pt.selectAll"))
          ),
          // 常驻固定宽度：勾选数变化只改文字，不再让后续控件左右跳动。
          h(
            "span",
            { className: `qbot-ptMutedCount${mutedChecked.size ? " is-on" : ""}` },
            fmt("pt.selectedCount", mutedChecked.size)
          ),
          h("span", { className: "qbot-ptMutedOpsSpacer" }),
          h(
            "label",
            { className: "qbot-ptMutedDuration" },
            h("span", null, t("pt.muteAdjustDuration")),
            h(
              "select",
              {
                className: "qbot-settingSelect",
                value: String(muteAdjustMinutes),
                onChange: (e) => setMuteAdjustMinutes(Number(e.target.value)),
                "aria-label": t("pt.muteAdjustDuration")
              },
              [10, 30, 60, 360, 1440, 43200].map((m) => h("option", { key: m, value: String(m) }, m < 60 ? fmt("pt.muteMinutes", m) : m < 1440 ? fmt("pt.muteHours", m / 60) : fmt("pt.muteDays", m / 1440)))
            )
          )
        ),
        h(
          "div",
          { className: "qbot-ptMutedOpsActions" },
          mutedActionBtn("mod.muteRenew", t("pt.mutedRenew"), "qbot-btnPrimary", () => adjustMuted(muteAdjustMinutes)),
          mutedActionBtn("mod.muteReduce", t("pt.mutedReduce"), "", () => adjustMuted(-muteAdjustMinutes)),
          mutedActionBtn("mod.muteUn", t("pt.unmuteBtn"), "qbot-btnDanger", unmuteMuted)
        )
      ),
      h(
        "div",
        { className: "qbot-ptMutedList" },
        muted.map((m) => h(
          "label",
          { key: m.member_openid, className: `qbot-ptMutedRow${mutedChecked.has(m.member_openid) ? " is-on" : ""}` },
          h("input", {
            type: "checkbox",
            className: "qbot-checkbox",
            checked: mutedChecked.has(m.member_openid),
            onChange: () => toggleMutedCheck(m.member_openid)
          }),
          h(
            "span",
            { className: "qbot-ptMutedAvatar", "aria-hidden": "true" },
            (m.username || m.member_openid).slice(0, 1).toUpperCase()
          ),
          h(
            "span",
            { className: "qbot-ptMutedWho" },
            m.username || m.member_openid.slice(0, 10) + "…"
          ),
          h(
            "span",
            { className: "qbot-ptMutedExpire" },
            `${t("pt.mutedUntil")} ${fmtExpire(m.mute_expire_at)}`
          )
        ))
      )
    ) : h(
      "div",
      { className: "qbot-ptModLogEmpty" },
      h("span", { className: "qbot-ptModLogEmptyIcon", "aria-hidden": "true" }, "◎"),
      h("strong", null, t("pt.mutedEmpty")),
      h("span", null, t("pt.mutedEmptyDesc"))
    )
  );
  const modTabs = [
    { key: "config", label: t("pt.modTabConfig") },
    { key: "logs", label: t("pt.modTabLogs") },
    { key: "muted", label: t("pt.modTabMuted") }
  ];
  const pickModTab = (k) => setModInnerTab(k);
  const moderationBody = block(
    t("pt.modGuideTitle"),
    t("pt.modGuideDesc"),
    !group ? h(
      "div",
      { className: "qbot-ptEmpty" },
      h("span", { className: "qbot-ptEmptyIcon" }, "⌁"),
      h("span", null, t("pt.groupNoSelect"))
    ) : perm === "checking" || perm === "idle" ? h("div", { className: "qbot-ptPermTip" }, t("pt.permChecking")) : perm === "error" ? h("div", { className: "qbot-ptPermTip" }, fmt("pt.permUnknown", permMsg)) : perm !== "admin" ? h("div", { className: "qbot-ptPermTip" }, t("pt.modNeedAdmin")) : h(
      React11.Fragment,
      null,
      subNav(modTabs, modInnerTab, pickModTab),
      h(
        "div",
        { className: "qbot-ptModPane" },
        modInnerTab === "config" ? modConfigPane : modInnerTab === "logs" ? modLogsPane : mutedPane
      )
    )
  );
  const joinAutoPane = h(
    React11.Fragment,
    null,
    h(
      "div",
      { className: `qbot-ptModHero${jaCfgLoaded && jaCfg.enabled ? " is-on" : ""}` },
      h(
        "div",
        { className: "qbot-ptModHeroMain" },
        h(
          "div",
          { className: "qbot-ptModHeroTitle" },
          h("span", { className: "qbot-ptModHeroIcon", "aria-hidden": "true" }, jaCfgLoaded && jaCfg.enabled ? "✓" : "◎"),
          h("strong", null, t("pt.jaTitle")),
          jaCfgLoaded ? h(
            "span",
            { className: `qbot-ptModStatus${jaCfg.enabled ? " is-on" : " is-off"}` },
            h("span", { className: "qbot-ptModStatusDot" }),
            jaCfg.enabled ? t("pt.jaOn") : t("pt.jaOff")
          ) : null
        ),
        h("div", { className: "qbot-ptModHeroDesc" }, t("pt.jaDesc")),
        jaCfgLoaded ? h(
          "div",
          { className: "qbot-ptModHeroSummary" },
          h("span", null, fmt("pt.jaSummaryReq", String(jaReqText.split(/[\n，,]+/).map((s) => s.trim()).filter(Boolean).length))),
          h("span", null, fmt("pt.jaSummaryWhite", String(jaWhiteText.split(/[\n，,]+/).map((s) => s.trim()).filter(Boolean).length))),
          h("span", null, jaCfg.allowEmpty ? t("pt.jaSummaryEmptyOn") : t("pt.jaSummaryEmptyOff"))
        ) : null
      )
    ),
    jaCfgLoaded ? h(
      React11.Fragment,
      null,
      // ── 分组一：规则设置 ──────────────────────────────────────────────
      modGroupHead(t("pt.jaGroupRules"), t("pt.jaGroupRulesDesc")),
      h(
        "div",
        { className: "qbot-ptModGroup" },
        modStep(
          "1",
          t("pt.jaSecEnable"),
          "",
          h(
            "label",
            { className: `qbot-ptJaEnableCheck${jaCfg.enabled ? " is-on" : ""}` },
            h("input", {
              type: "checkbox",
              className: "qbot-checkbox",
              checked: jaCfg.enabled,
              disabled: !canAdmin,
              onChange: (e) => setJaCfg((c) => ({ ...c, enabled: e.target.checked }))
            }),
            h(
              "span",
              { className: "qbot-ptJaEnableText" },
              h("strong", null, t("pt.jaEnableCheck")),
              h("span", null, t("pt.jaEnableCheckDesc"))
            )
          )
        ),
        modStep(
          "2",
          t("pt.jaSecReq"),
          "",
          h("textarea", {
            className: "qbot-ptTextarea",
            rows: 3,
            value: jaReqText,
            placeholder: t("pt.jaReqPlaceholder"),
            onChange: (e) => setJaReqText(e.target.value)
          })
        ),
        modStep(
          "3",
          t("pt.jaSecEmpty"),
          "",
          h(
            "div",
            { className: "qbot-ptJaEmptyOpts" },
            h(
              "button",
              {
                type: "button",
                className: `qbot-ptJaEmptyOpt${!jaCfg.allowEmpty ? " is-on" : ""}`,
                disabled: !canAdmin,
                onClick: () => setJaCfg((c) => ({ ...c, allowEmpty: false }))
              },
              h("span", { className: "qbot-ptJaEmptyIcon", "aria-hidden": "true" }, "◎"),
              h(
                "span",
                { className: "qbot-ptJaEmptyText" },
                h("strong", null, t("pt.jaEmptyKeep")),
                h("span", null, t("pt.jaEmptyKeepDesc"))
              ),
              h("span", { className: "qbot-ptJaEmptyCheck", "aria-hidden": "true" }, !jaCfg.allowEmpty ? "✓" : "")
            ),
            h(
              "button",
              {
                type: "button",
                className: `qbot-ptJaEmptyOpt${jaCfg.allowEmpty ? " is-on" : ""}`,
                disabled: !canAdmin,
                onClick: () => setJaCfg((c) => ({ ...c, allowEmpty: true }))
              },
              h("span", { className: "qbot-ptJaEmptyIcon", "aria-hidden": "true" }, "✦"),
              h(
                "span",
                { className: "qbot-ptJaEmptyText" },
                h("strong", null, t("pt.jaEmptyAi")),
                h("span", null, t("pt.jaEmptyAiDesc"))
              ),
              h("span", { className: "qbot-ptJaEmptyCheck", "aria-hidden": "true" }, jaCfg.allowEmpty ? "✓" : "")
            )
          )
        ),
        modStep(
          "4",
          t("pt.jaSecWhite"),
          "",
          h("textarea", {
            className: "qbot-ptTextarea",
            rows: 3,
            value: jaWhiteText,
            placeholder: t("pt.jaWhitePlaceholder"),
            disabled: !canAdmin,
            onChange: (e) => setJaWhiteText(e.target.value)
          })
        )
      ),
      // ── 分组二：自动运行（无需手动点击） ──────────────────────────────
      modGroupHead(t("pt.jaGroupAuto"), t("pt.jaGroupAutoDesc")),
      h(
        "div",
        { className: "qbot-ptModGroup" },
        modStep(
          "5",
          t("pt.jaSecAuto"),
          "",
          h(
            "div",
            { className: `qbot-ptJaAutoState ${jaCfg.enabled ? "is-on" : "is-off"}` },
            h("span", { className: "qbot-ptJaAutoDot", "aria-hidden": "true" }),
            h("span", null, jaCfg.enabled ? t("pt.jaAutoOn") : t("pt.jaAutoOff"))
          )
        )
      ),
      h(
        "div",
        { className: "qbot-ptModSaveBar" },
        adminBtn("ja.save", t("common.save"), saveJoinAuto, true)
      )
    ) : null
  );
  const recentJaLogs = jaLogs.slice(0, 30);
  const jaLogStats = h(
    "div",
    { className: "qbot-ptModStats" },
    h(
      "div",
      { className: "qbot-ptModStat" },
      h("strong", null, String(recentJaLogs.length)),
      h("span", null, t("pt.jaStatTotal"))
    ),
    h(
      "div",
      { className: "qbot-ptModStat is-ok" },
      h("strong", null, String(recentJaLogs.filter((l) => l.action === "pass").length)),
      h("span", null, t("pt.jaStatPass"))
    ),
    h(
      "div",
      { className: "qbot-ptModStat is-esc" },
      h("strong", null, String(recentJaLogs.filter((l) => l.action === "keep").length)),
      h("span", null, t("pt.jaStatKeep"))
    ),
    h(
      "div",
      { className: "qbot-ptModStat is-fail" },
      h("strong", null, String(recentJaLogs.filter((l) => l.action === "error" || l.action === "decline").length)),
      h("span", null, t("pt.jaStatFail"))
    )
  );
  const joinRecordsPane = h(
    React11.Fragment,
    null,
    h(
      "div",
      { className: "qbot-ptModLogHead" },
      h(
        "div",
        { className: "qbot-ptModLogHeadText" },
        h("strong", null, t("pt.jaRecordsTitle")),
        h("span", null, t("pt.jaRecordsHint"))
      )
    ),
    jaLogsLoaded && recentJaLogs.length ? h(
      React11.Fragment,
      null,
      jaLogStats,
      h("div", { className: "qbot-ptJaRecordList" }, recentJaLogs.map((log, i) => h(
        "div",
        { key: i, className: `qbot-ptJaRecord is-${log.action}` },
        h(
          "div",
          { className: "qbot-ptJaRecordHead" },
          h("span", { className: "qbot-ptJaRecordAvatar", "aria-hidden": "true" }, (log.username || "?").slice(0, 1).toUpperCase()),
          h("span", { className: "qbot-ptJaRecordWho" }, log.username || "—"),
          h("span", { className: `qbot-ptJaRecordAct is-${log.action}` }, t(`pt.jaAct.${log.action}`)),
          h("time", { className: "qbot-ptJaRecordTime" }, formatTime(log.at))
        ),
        h(
          "div",
          { className: "qbot-ptJaRecordRow" },
          h("span", { className: "qbot-ptJaRecordLabel" }, t("pt.jaRecordReason")),
          h("span", { className: "qbot-ptJaRecordValue" }, log.reason || "—")
        ),
        h(
          "div",
          { className: "qbot-ptJaRecordRow" },
          h("span", { className: "qbot-ptJaRecordLabel" }, t("pt.jaRecordIntro")),
          h("span", { className: "qbot-ptJaRecordIntro" }, log.intro || t("pt.jaRecordIntroEmpty"))
        ),
        log.error ? h("div", { className: "qbot-ptJaRecordErr" }, log.error) : null
      )))
    ) : h(
      "div",
      { className: "qbot-ptModLogEmpty" },
      h("span", { className: "qbot-ptModLogEmptyIcon", "aria-hidden": "true" }, "◎"),
      h("strong", null, t("pt.jaRecordsEmpty")),
      h("span", null, t("pt.jaRecordsEmptyDesc"))
    )
  );
  const joinManualPane = h(
    React11.Fragment,
    null,
    h(
      "div",
      { className: "qbot-ptModLogHead" },
      h(
        "div",
        { className: "qbot-ptModLogHeadText" },
        h("strong", null, t("pt.jaManualTitle")),
        h("span", null, t("pt.jaManualDesc"))
      )
    ),
    requests.length ? h(
      "div",
      { className: "qbot-ptList" },
      requests.map((r) => h(
        "div",
        { key: r.join_request_id, className: "qbot-ptReqRow" },
        h(
          "div",
          { className: "qbot-ptReqMain" },
          h("strong", null, r.username || r.member_openid.slice(0, 10) + "…"),
          h(
            "span",
            { className: "qbot-hint" },
            `${r.apply_at?.slice(0, 16).replace("T", " ") ?? ""} · ${r.apply_source === "invited" ? t("pt.joinInvited") : t("pt.joinSelf")}`
          ),
          r.verify_info?.verify_message ? h("span", { className: "qbot-ptReqVerify" }, `「${r.verify_info.verify_message}」`) : null,
          r.risk_tips ? h("span", { className: "qbot-ptReqRisk" }, r.risk_tips) : null
        ),
        h(
          "div",
          { className: "qbot-ptReqOps" },
          adminBtn(`join.ok:${r.member_openid}`, t("pt.joinApproveBtn"), () => approveJoin(r, true), true),
          adminBtn(`join.no:${r.member_openid}`, t("pt.joinDeclineBtn"), () => approveJoin(r, false))
        )
      ))
    ) : h(
      "div",
      { className: "qbot-ptModLogEmpty" },
      h("span", { className: "qbot-ptModLogEmptyIcon", "aria-hidden": "true" }, "◎"),
      h("strong", null, t("pt.joinEmpty")),
      h("span", null, t("pt.joinEmptyDesc"))
    )
  );
  const joinTabs = [
    { key: "auto", label: t("pt.jaTabAuto") },
    { key: "manual", label: t("pt.jaTabManual") },
    { key: "records", label: t("pt.jaTabRecords") }
  ];
  const groupPanes = [
    { key: "info", label: t("pt.navInfo"), body: block(
      t("pt.infoTitle"),
      t("pt.infoHint"),
      profile ? h(
        "div",
        { className: "qbot-ptInfoGrid" },
        infoCell(t("pt.infoName"), profile.group_name),
        infoCell(t("pt.infoMemo"), profile.group_finger_memo),
        infoCell(t("pt.infoClass"), profile.group_class_text),
        infoCell(t("pt.infoTags"), Array.isArray(profile.group_tags) && profile.group_tags.length ? h(
          "span",
          { className: "qbot-ptTags" },
          profile.group_tags.map((tag) => h("span", { key: tag, className: "qbot-chip" }, tag))
        ) : t("pt.infoEmpty")),
        infoCell(t("pt.infoMembers"), String(profile.group_member_num ?? 0)),
        infoCell(t("pt.infoUnion"), profile.union_group_openid || t("pt.infoEmpty")),
        infoCell("group_openid", profile.group_openid)
      ) : null
    ) },
    { key: "members", label: t("pt.navMembers"), body: block(
      t("pt.membersTitle"),
      t("pt.admHint"),
      memberCursor || members.length ? h(
        "div",
        { className: "qbot-ptRow" },
        memberCursor ? adminBtn("adm.more", t("archive.loadMore"), () => loadMembers(memberCursor)) : null,
        members.length ? h("span", { className: "qbot-hint" }, fmt("pt.membersTotal", members.length)) : null
      ) : null,
      members.length ? h(
        "div",
        { className: "qbot-ptRow" },
        h("input", {
          className: "qbot-settingInput qbot-ptSearch",
          value: memberSearch,
          placeholder: t("pt.membersSearch"),
          onChange: (e) => setMemberSearch(e.target.value),
          "aria-label": t("pt.membersSearch")
        }),
        h("button", { type: "button", className: "qbot-btn", onClick: () => {
          const page = new Set(shownMembers.map((m) => m.member_openid));
          setChecked((prev) => {
            const all = [...page].every((o) => prev.has(o));
            const next = new Set(prev);
            for (const o of page) {
              if (all) next.delete(o);
              else next.add(o);
            }
            return next;
          });
        } }, checked.size && shownMembers.length && shownMembers.every((m) => checked.has(m.member_openid)) ? t("pt.clearSelect") : t("pt.selectAll")),
        checked.size ? h("span", { className: "qbot-hint" }, fmt("pt.selectedCount", checked.size)) : null
      ) : null,
      shownMembers.length ? h(
        "div",
        { className: "qbot-ptMembers" },
        shownMembers.map((m) => h(
          "div",
          { key: m.member_openid, className: "qbot-ptMemberRow" },
          h(
            "label",
            { className: "qbot-ptMemberCheck" },
            h("input", {
              type: "checkbox",
              className: "qbot-checkbox",
              checked: checked.has(m.member_openid),
              onChange: () => toggleCheck(m.member_openid)
            }),
            h("span", { className: "qbot-ptMemberName" }, m.username || m.member_openid.slice(0, 10) + "…"),
            m.member_role && m.member_role !== "member" ? h("span", { className: "qbot-chip is-active" }, m.member_role === "owner" ? t("pt.roleOwner") : t("pt.roleAdmin")) : null,
            m.bot ? h("span", { className: "qbot-chip" }, "Bot") : null
          ),
          h("button", {
            type: "button",
            className: "qbot-btn qbot-ptMemberInfo",
            title: t("pt.memberDetail"),
            onClick: () => showMemberDetail(m)
          }, "ⓘ")
        ))
      ) : null,
      // 成员详情是查询结果，直接在列表下方内联展示，不用吸顶 toast。
      memberDetail ? h(
        "div",
        { className: "qbot-ptInfoGrid" },
        infoCell(t("pt.memberDetail"), h("code", { className: "qbot-mono" }, JSON.stringify(memberDetail, null, 2)))
      ) : null,
      members.length ? h(
        "div",
        { className: "qbot-ptRow qbot-ptOps" },
        h(
          "select",
          {
            className: "qbot-settingSelect",
            value: String(muteMinutes),
            onChange: (e) => setMuteMinutes(Number(e.target.value)),
            "aria-label": t("pt.muteDuration")
          },
          [10, 30, 60, 360, 1440, 43200].map((m) => h("option", { key: m, value: String(m) }, m < 60 ? fmt("pt.muteMinutes", m) : m < 1440 ? fmt("pt.muteHours", m / 60) : fmt("pt.muteDays", m / 1440)))
        ),
        adminBtn("adm.mute", t("pt.muteBtn"), () => muteSelected(muteMinutes), true),
        adminBtn("adm.unmute", t("pt.unmuteBtn"), () => muteSelected(0)),
        adminBtn("adm.remove", t("pt.removeBtn"), removeSelected)
      ) : null
    ) },
    { key: "black", label: t("pt.navBlack"), body: block(
      t("pt.blackTitle"),
      t("pt.blackHint"),
      blacklist.length ? h(
        "div",
        { className: "qbot-ptRow" },
        h("span", { className: "qbot-hint" }, fmt("pt.blackLoaded", blacklist.length))
      ) : null,
      h(
        "div",
        { className: "qbot-ptRow" },
        h(GroupPicker, {
          value: blackPick,
          options: blackCandidates,
          onChange: setBlackPick,
          placeholder: t("pt.blackPick"),
          label: t("pt.blackTitle")
        }),
        adminBtn("black.add", t("pt.blackAdd"), () => changeBlacklist("add", blackPick ? [blackPick.trim()] : [])),
        adminBtn("black.del", t("pt.blackDel"), () => changeBlacklist("del", blacklist.map((b) => b.member_openid)))
      ),
      blacklist.length ? h(
        "div",
        { className: "qbot-ptList" },
        blacklist.map((b) => h(
          "div",
          { key: b.member_openid, className: "qbot-ptPanelRow" },
          h("code", { className: "qbot-mono" }, b.member_openid),
          h("span", { className: "qbot-ptPanelRemark" }, b.username || "—"),
          b.banned_at ? h("span", { className: "qbot-hint" }, formatTime(b.banned_at)) : null,
          h("button", {
            type: "button",
            className: "qbot-btn qbot-btnDanger",
            disabled: !canAdmin,
            onClick: () => changeBlacklist("del", [b.member_openid])
          }, t("pt.blackDel"))
        ))
      ) : null
    ) },
    { key: "join", label: t("pt.navJoin"), body: block(
      t("pt.joinTitle"),
      t("pt.joinHint"),
      !group ? h(
        "div",
        { className: "qbot-ptEmpty" },
        h("span", { className: "qbot-ptEmptyIcon" }, "⌁"),
        h("span", null, t("pt.groupNoSelect"))
      ) : perm !== "admin" ? h("div", { className: "qbot-ptPermTip" }, t("pt.jaNeedAdmin")) : h(
        React11.Fragment,
        null,
        subNav(joinTabs, jaInnerTab, (k) => pickJoinTab(k)),
        h(
          "div",
          { className: "qbot-ptModPane" },
          jaInnerTab === "auto" ? joinAutoPane : jaInnerTab === "records" ? joinRecordsPane : joinManualPane
        )
      )
    ) },
    { key: "moderation", label: t("pt.navModeration"), body: moderationBody },
    { key: "panels", label: t("pt.panelsTitle"), body: block(
      t("pt.panelsTitle"),
      t("pt.panelsHint"),
      h(
        "div",
        { className: "qbot-ptRow" },
        btn("panels.new", t("pt.panelNew"), startNewPanel, false)
      ),
      panelsLoaded && panels.length ? h("div", { className: "qbot-ptRow qbot-hint" }, fmt("pt.panelsCount", panels.length)) : panelsLoaded ? h("div", { className: "qbot-ptEmpty" }, t("pt.panelsEmpty")) : null,
      ...panels.map((p) => h(
        "div",
        { key: p.panel_id, className: "qbot-ptPanelRow" },
        h(
          "div",
          { className: "qbot-ptPanelMeta" },
          h("code", { className: "qbot-mono" }, p.panel_id ?? "—"),
          h("span", { className: "qbot-hint" }, fmt("pt.panelsItems", p.panel?.items?.length ?? 0)),
          p.panel?.remark ? h("span", { className: "qbot-ptPanelRemark" }, p.panel.remark) : null
        ),
        h(
          "div",
          { className: "qbot-ptRow" },
          btn(`panels.view:${p.panel_id}`, t("pt.panelView"), () => openPanel(p, "view")),
          btn(`panels.edit:${p.panel_id}`, t("common.edit"), () => openPanel(p, "edit")),
          btn(`panels.del:${p.panel_id}`, t("common.delete"), () => deletePanel(p.panel_id ?? ""))
        )
      )),
      // 表单：仅点新增/编辑/查看后展开；查看模式全部禁用
      panelFormMode ? h(
        "div",
        { className: "qbot-ptPanelForm" },
        h(
          "div",
          { className: "qbot-ptFieldLabel" },
          panelFormMode === "create" ? t("pt.panelCreating") : panelFormMode === "edit" ? t("pt.panelEditing") : t("pt.panelViewing")
        ),
        h(
          "label",
          { className: "qbot-ptField qbot-ptFieldWide" },
          h("span", null, t("pt.panelRemark")),
          h("input", {
            className: "qbot-settingInput",
            value: panelRemark,
            maxLength: 255,
            placeholder: t("pt.panelRemark"),
            "aria-label": t("pt.panelRemark"),
            disabled: panelReadonly,
            onChange: (e) => setPanelRemark(e.target.value)
          })
        ),
        // 填写示例（折叠）
        h(
          "details",
          { className: "qbot-ptPanelHelp" },
          h("summary", null, t("pt.panelHelpTitle")),
          h("pre", { className: "qbot-ptPanelHelpCode" }, t("pt.panelHelpExample"))
        ),
        // 面板元素：结构化表单
        h("div", { className: "qbot-ptFieldLabel" }, t("pt.panelItems")),
        ...panelItems.map((it, idx) => h(
          "div",
          { key: idx, className: "qbot-ptItemCard" },
          h(
            "div",
            { className: "qbot-ptItemHead" },
            h("span", { className: "qbot-ptItemNo" }, fmt("pt.panelItemNo", idx + 1)),
            h(
              "div",
              { className: "qbot-ptItemHeadOps" },
              // 查看模式用明确的「是/否」文本回显，避免 disabled checkbox 被宿主样式渲染成看不出勾选态的灰块。
              panelReadonly ? h(
                "span",
                { className: `qbot-ptAdminBadge${it.only_admin ? " is-on" : ""}` },
                `${t("pt.panelItemAdmin")}：${it.only_admin ? t("pt.panelAdminYes") : t("pt.panelAdminNo")}`
              ) : h(
                "label",
                { className: "qbot-ptCheckRow" },
                h("input", {
                  type: "checkbox",
                  className: "qbot-checkbox",
                  checked: it.only_admin,
                  onChange: (e) => updatePanelItem(idx, { only_admin: e.target.checked })
                }),
                h("span", null, t("pt.panelItemAdmin"))
              ),
              panelReadonly ? null : btn(`panels.itemDel:${idx}`, t("pt.panelItemDel"), () => removePanelItem(idx), false, { className: "qbot-btn qbot-ptItemDel" })
            )
          ),
          h(
            "div",
            { className: "qbot-ptItemGrid" },
            h(
              "label",
              { className: "qbot-ptField qbot-ptItemType" },
              h("span", null, t("pt.panelItemType")),
              h(
                "select",
                {
                  className: "qbot-settingSelect",
                  value: it.type,
                  disabled: panelReadonly,
                  onChange: (e) => updatePanelItem(idx, { type: e.target.value, ...e.target.value === "link" ? { link: it.link || "https://" } : {} }),
                  "aria-label": t("pt.panelItemType")
                },
                h("option", { value: "command" }, t("pt.panelItemTypeCmd")),
                h("option", { value: "link" }, t("pt.panelItemTypeLink"))
              )
            ),
            h(
              "label",
              { className: "qbot-ptField qbot-ptItemName" },
              h("span", null, it.type === "command" ? t("pt.panelItemCmd") : t("pt.panelItemName")),
              it.type === "command" ? panelReadonly ? h(
                "div",
                { className: "qbot-ptCmdReadonly" },
                h("code", { className: "qbot-mono" }, it.name || "—"),
                !panelCmdCmds.includes(it.name) ? h("span", { className: "qbot-ptCmdWarn" }, t("pt.panelCmdInvalid")) : null
              ) : h(
                "select",
                {
                  className: "qbot-settingSelect",
                  value: panelCmdCmds.includes(it.name) ? it.name : "",
                  onChange: (e) => updatePanelItem(idx, { name: e.target.value }),
                  "aria-label": t("pt.panelItemCmd")
                },
                // 占位项：无合法命令被选中时显示；无效旧值不进下拉，保存前必须重选。
                h("option", { value: "" }, t("pt.panelCmdPick")),
                ...panelCmdChoices().map((c) => h("option", { key: c.cmd, value: c.cmd }, `${c.cmd} ${t(c.labelKey)}`))
              ) : h("input", {
                className: "qbot-settingInput",
                value: it.name,
                maxLength: 14,
                placeholder: t("pt.panelItemNamePh"),
                disabled: panelReadonly,
                onChange: (e) => updatePanelItem(idx, { name: e.target.value }),
                "aria-label": t("pt.panelItemName")
              })
            ),
            h(
              "label",
              { className: "qbot-ptField qbot-ptFieldWide" },
              h("span", null, t("pt.panelItemDesc")),
              h("input", {
                className: "qbot-settingInput",
                value: it.desc,
                maxLength: 80,
                placeholder: t("pt.panelItemDescPh"),
                disabled: panelReadonly,
                onChange: (e) => updatePanelItem(idx, { desc: e.target.value }),
                "aria-label": t("pt.panelItemDesc")
              })
            ),
            it.type === "link" ? h(
              "label",
              { className: "qbot-ptField qbot-ptFieldWide" },
              h("span", null, t("pt.panelItemLink")),
              h("input", {
                className: "qbot-settingInput",
                value: it.link,
                placeholder: "https://example.com",
                disabled: panelReadonly,
                onChange: (e) => updatePanelItem(idx, { link: e.target.value }),
                "aria-label": t("pt.panelItemLink")
              })
            ) : null
          )
        )),
        panelItems.length === 0 ? h("div", { className: "qbot-ptEmpty" }, t("pt.panelItemsEmpty")) : null,
        h(
          "div",
          { className: "qbot-ptPanelActions" },
          panelReadonly ? null : h(
            "div",
            { className: "qbot-ptRow" },
            btn(
              "panels.itemAdd",
              t("pt.panelItemAdd"),
              addPanelItem,
              false,
              { className: "qbot-btn qbot-ptAddBtn", disabled: panelItems.length >= PANEL_ITEM_MAX }
            ),
            h("span", { className: "qbot-hint" }, fmt("pt.panelItemCount", panelItems.length, PANEL_ITEM_MAX))
          ),
          h(
            "div",
            { className: "qbot-ptRow qbot-ptPanelActionsEnd" },
            panelReadonly ? null : btn("panels.save", t("common.save"), savePanel, true),
            btn("panels.cancel", panelReadonly ? t("common.close") : t("common.cancel"), closePanelForm)
          )
        )
      ) : null
    ) }
  ];
  const generalPanes = [
    { key: "share", label: t("pt.navShare"), body: block(
      t("pt.shareTitle"),
      t("pt.shareHint"),
      h(
        "div",
        { className: "qbot-ptRow" },
        btn("share", t("pt.shareGen"), genShareLink, true),
        shareUrl ? h("span", { className: "qbot-ptShareUrl", title: shareUrl }, shareUrl) : null,
        shareUrl ? h(
          "button",
          {
            type: "button",
            className: "qbot-btn",
            onClick: () => {
              if (shareUrl) void navigator.clipboard?.writeText(shareUrl).catch(() => void 0);
            }
          },
          t("common.copy")
        ) : null
      ),
      h(
        "div",
        { className: "qbot-ptSelf" },
        h(
          "div",
          { className: "qbot-ptRow" },
          h("span", { className: "qbot-ptFieldLabel" }, t("pt.selfTitle")),
          btn("self.load", t("pt.selfLoad"), loadSelfInfo)
        ),
        selfInfo ? h(
          "div",
          { className: "qbot-ptInfoGrid" },
          infoCell(t("pt.selfName"), selfInfo.username || "—"),
          infoCell(t("pt.selfId"), selfInfo.id || "—"),
          infoCell(t("pt.selfBot"), selfInfo.bot ? t("pt.selfBotYes") : t("pt.selfBotNo")),
          selfInfo.welcomeMsg ? infoCell(t("pt.selfWelcome"), selfInfo.welcomeMsg) : null
        ) : null
      )
    ) },
    { key: "menu", label: t("pt.navMenu"), body: block(
      t("pt.menuTitle"),
      t("pt.menuHint"),
      h(
        "div",
        { className: "qbot-ptRow" },
        btn("menu.gen", t("pt.menuGen"), genMenu),
        btn("menu.save", t("common.save"), saveMenu, menuDirty)
      ),
      h("textarea", {
        className: "qbot-ptTextarea",
        rows: 8,
        value: menuJson,
        placeholder: t("pt.menuPlaceholder"),
        onChange: (e) => {
          setMenuJson(e.target.value);
          setMenuDirty(true);
        },
        spellCheck: false,
        "aria-label": t("pt.menuTitle")
      })
    ) },
    { key: "material", label: t("pt.navMaterial"), body: block(
      t("pt.materialTitle"),
      t("pt.materialHint"),
      h(
        "div",
        { className: "qbot-ptRow" },
        h("input", {
          className: "qbot-settingInput qbot-ptGroupPick",
          value: materialUrl,
          placeholder: "https://…(png/jpeg/gif/webp ≤10MB)",
          onChange: (e) => setMaterialUrl(e.target.value),
          "aria-label": t("pt.materialTitle")
        }),
        btn("material", t("pt.materialUpload"), uploadMaterial)
      ),
      materialRef ? h(
        "div",
        { className: "qbot-ptRow" },
        h("code", { className: "qbot-ptShareUrl" }, materialRef),
        h("span", { className: "qbot-hint" }, t("pt.materialCopied"))
      ) : null
    ) },
    { key: "card", label: t("pt.navCard"), body: block(
      t("pt.cardTitle"),
      t("pt.cardHint"),
      h(
        "div",
        { className: "qbot-ptGrid" },
        h(
          "label",
          { className: "qbot-ptField" },
          h("span", null, t("pt.cardScope")),
          h(
            "select",
            { className: "qbot-settingSelect", value: cardScope, onChange: (e) => pickCardScope(e.target.value) },
            h("option", { value: "group" }, t("pt.scopeGroup")),
            h("option", { value: "c2c" }, t("pt.scopeC2c"))
          )
        ),
        h(
          "label",
          { className: "qbot-ptField" },
          h("span", null, t("pt.cardOpenid")),
          h(GroupPicker, {
            value: cardOpenid,
            options: cardScope === "group" ? displayOptions : [],
            onChange: pickCardOpenid,
            placeholder: t("pt.cardOpenidPlaceholder"),
            label: t("pt.cardOpenid")
          })
        )
      ),
      // 被动回复选择：绕开主动消息权限限制。
      h(
        "div",
        { className: "qbot-ptReply" },
        h(
          "div",
          { className: "qbot-ptRow" },
          h("span", { className: "qbot-ptFieldLabel" }, t("pt.cardReplyMsg")),
          btn("card.replies", t("pt.cardReplyLoad"), loadReplyMsgs)
        ),
        h("div", { className: "qbot-ptBlockDesc" }, t("pt.cardReplyHint")),
        replyMsgs.length ? h(
          "select",
          {
            className: "qbot-settingSelect qbot-ptReplySelect",
            value: replyMsgId,
            onChange: (e) => setReplyMsgId(e.target.value),
            "aria-label": t("pt.cardReplyMsg")
          },
          h("option", { value: "" }, t("pt.cardReplyNone")),
          ...replyMsgs.map((m) => h(
            "option",
            { key: m.msgId, value: m.msgId },
            `${m.senderName || m.sender || "?"}：${m.content.slice(0, 24)} · ${fmt("pt.replyLeft", m.leftSec)}`
          ))
        ) : null
      ),
      h(
        "div",
        { className: "qbot-ptGrid" },
        h(
          "label",
          { className: "qbot-ptField" },
          h("span", null, t("pt.cardTitleLabel")),
          h("input", { className: "qbot-settingInput", value: cardTitle, maxLength: 50, onChange: (e) => setCardTitle(e.target.value) })
        ),
        h(
          "label",
          { className: "qbot-ptField qbot-ptFieldWide" },
          h("span", null, t("pt.cardPic")),
          h("input", { className: "qbot-settingInput", value: cardPic, placeholder: "https://…/cover.jpg", onChange: (e) => setCardPic(e.target.value) }),
          h("span", { className: "qbot-ptFieldHint" }, t("pt.cardPicHint"))
        )
      ),
      h(
        "label",
        { className: "qbot-ptField qbot-ptFieldWide" },
        h("span", null, t("pt.cardDesc")),
        h("textarea", { className: "qbot-ptTextarea", rows: 2, maxLength: 200, value: cardDesc, onChange: (e) => setCardDesc(e.target.value) })
      ),
      h(
        "label",
        { className: "qbot-ptField qbot-ptFieldWide" },
        h("span", null, t("pt.cardUrl")),
        h("input", { className: "qbot-settingInput", value: cardUrl, placeholder: "https://…", onChange: (e) => setCardUrl(e.target.value) })
      ),
      h("div", { className: "qbot-ptRow" }, btn("card", t("pt.cardSend"), sendCard, true))
    ) }
  ];
  const GROUP_NAV_KEYS = ["info", "join", "moderation"];
  const NAV_GROUPS = [
    {
      title: t("pt.catGroup"),
      items: groupPanes.map((p, i) => ({ ...p, icon: ["◈", "♙", "⊘", "⌑", "✦", "▦"][i] ?? "•" })).filter((p) => GROUP_NAV_KEYS.includes(p.key)).map((p) => ({ key: `g:${p.key}`, label: p.label, icon: p.icon }))
    }
  ];
  const isGroupScope = navKey.startsWith("g:");
  const activeKey = navKey.slice(2);
  const activeGroupPane = groupPanes.find((p) => p.key === activeKey) ?? groupPanes[0];
  const activeGeneralPane = generalPanes.find((p) => p.key === activeKey) ?? generalPanes[0];
  React11.useEffect(() => {
    if (!focus) return;
    setNavKey(focus.nav);
    if (focus.joinTab) setJaInnerTab(focus.joinTab);
    if (focus.modTab) setModInnerTab(focus.modTab);
  }, [focus?.nav, focus?.joinTab, focus?.modTab]);
  const lastPermGroup = React11.useRef("");
  React11.useEffect(() => {
    if (group && group !== lastPermGroup.current) {
      lastPermGroup.current = group;
      checkPerm(group);
    }
    if (!group) lastPermGroup.current = "";
  }, [group, checkPerm]);
  React11.useEffect(() => {
    if (!isGroupScope) {
      if (activeKey === "menu") loadMenu();
      return;
    }
    if (activeKey === "panels") {
      loadPanels();
      return;
    }
    if (!group) return;
    switch (activeKey) {
      case "info":
        loadProfile();
        break;
      case "black":
        loadBlacklist();
        break;
      case "members":
        if (canAdmin) loadMembers("");
        break;
      case "join":
        if (!canAdmin) break;
        if (jaInnerTab === "auto") loadJoinAuto();
        else if (jaInnerTab === "manual") loadRequests();
        else if (jaInnerTab === "records") loadJoinAutoLogs();
        break;
      case "moderation":
        if (!canAdmin) break;
        if (modInnerTab === "config") {
          if (!modCfgLoaded) loadModeration();
        } else if (modInnerTab === "logs") loadModLogs();
        else if (modInnerTab === "muted") loadMuted();
        break;
      default:
        break;
    }
  }, [activeKey, group, isGroupScope, canAdmin, jaInnerTab, modInnerTab]);
  return h(
    "div",
    { className: `qbot-ptLayout${embedded ? " is-embedded" : ""}` },
    // ══ 左侧分组导航（群聊 / 通用 两大组，与频道管理同款） ════════════════════
    embedded ? null : h(
      "nav",
      { className: "qbot-ptNav", role: "tablist", "aria-label": t("pt.tabTitle") },
      NAV_GROUPS.map((group2) => h(
        "div",
        { className: "qbot-ptNavGroup", key: group2.title },
        h("div", { className: "qbot-ptNavGroupTitle" }, group2.title),
        ...group2.items.map((item) => h(
          "button",
          {
            key: item.key,
            type: "button",
            role: "tab",
            "aria-selected": navKey === item.key,
            className: `qbot-ptNavItem${navKey === item.key ? " is-active" : ""}`,
            onClick: () => setNavKey(item.key)
          },
          h("span", { className: "qbot-ptNavIcon", "aria-hidden": "true" }, item.icon),
          h("span", null, item.label)
        ))
      ))
    ),
    h(
      "div",
      { className: "qbot-ptContent" },
      isGroupScope ? h(
        React11.Fragment,
        null,
        // 选群卡片：群聊组内细项共用（执行记录也按群过滤）；指令面板作用于全部群，无需选群。
        activeKey === "panels" ? null : h(
          "div",
          { className: "qbot-ptPickCard" },
          h("div", { className: "qbot-ptStepTag" }, t("pt.stepPick")),
          h(
            "div",
            { className: "qbot-ptRow" },
            h(GroupPicker, {
              value: group,
              options: displayOptions,
              onChange: pickGroup,
              placeholder: t("pt.groupPlaceholder"),
              label: t("pt.groupPickerTitle")
            }),
            group ? h("span", { className: "qbot-ptGroupId", title: group }, group) : null
          ),
          permBanner,
          !canAdmin && perm === "member" ? h("div", { className: "qbot-ptPermTip" }, t("pt.permDeniedTip")) : null
        ),
        activeKey === "assistant" ? h(AiChatPanel, {
          key: group || "nogroup",
          rpcCall,
          appId,
          scope: "group",
          groupOpenid: group || ""
        }) : activeKey === "panels" ? h("div", { className: "qbot-ptSubPane" }, activeGroupPane.body) : group ? h("div", { className: "qbot-ptSubPane" }, activeGroupPane.body) : h(
          "div",
          { className: "qbot-ptEmpty" },
          h("span", { className: "qbot-ptEmptyIcon" }, "⌁"),
          h("span", null, t("pt.groupEmpty"))
        )
      ) : h("div", { className: "qbot-ptSubPane" }, activeGeneralPane.body)
    )
  );
}
function infoCell(label, content) {
  return h(
    "div",
    { className: "qbot-ptInfoCell" },
    h("span", { className: "qbot-ptInfoLabel" }, label),
    h("span", { className: "qbot-ptInfoValue" }, content || t("pt.infoEmpty"))
  );
}
function GroupPicker(props) {
  const { value, options, onChange, placeholder, label } = props;
  const [open, setOpen] = React11.useState(false);
  const [query, setQuery] = React11.useState("");
  const btnRef = React11.useRef(null);
  const panelRef = React11.useRef(null);
  const [pos, setPos] = React11.useState({
    left: 0,
    top: 0,
    width: 0,
    placement: "bottom"
  });
  const PANEL_MAX = 300;
  const GAP = 4;
  const reposition = React11.useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const placement = spaceBelow < Math.min(PANEL_MAX, 180) + GAP && r.top > spaceBelow ? "top" : "bottom";
    setPos({
      left: r.left,
      top: placement === "bottom" ? r.bottom + GAP : r.top - GAP,
      width: r.width,
      placement
    });
  }, []);
  React11.useEffect(() => {
    if (!open) return;
    reposition();
    const onDoc = (e) => {
      const target = e.target;
      if (btnRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc, true);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      document.removeEventListener("pointerdown", onDoc, true);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open, reposition]);
  const q = query.trim().toLowerCase();
  const filtered = q ? options.filter((o) => o.value.toLowerCase().includes(q) || o.label.toLowerCase().includes(q)) : options;
  const current = options.find((o) => o.value === value);
  const panelStyle = {
    left: pos.left,
    width: pos.width,
    maxHeight: PANEL_MAX,
    ...pos.placement === "bottom" ? { top: pos.top } : { bottom: window.innerHeight - pos.top }
  };
  return h(
    React11.Fragment,
    null,
    h(
      "div",
      { className: "qbot-ptCombo" },
      h(
        "button",
        {
          ref: btnRef,
          type: "button",
          className: `qbot-ptComboBtn${value ? " is-on" : ""}`,
          onClick: () => setOpen((v) => !v),
          "aria-label": label,
          "aria-expanded": open,
          title: value ? current?.label ?? value : placeholder
        },
        h("span", { className: "qbot-ptComboBtnText" }, value ? current?.label ?? value : placeholder),
        current?.memberNum ? h(
          "span",
          { className: "qbot-convGroupMembers", title: fmt("archive.groupMemberNum", String(current.memberNum)) },
          fmt("archive.groupMembersShort", String(current.memberNum))
        ) : null,
        h(
          "svg",
          {
            className: "qbot-archMemberCaret",
            width: 12,
            height: 12,
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: 2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            "aria-hidden": "true"
          },
          h("path", { d: "M6 9l6 6 6-6" })
        )
      )
    ),
    open ? (0, import_react_dom.createPortal)(
      h(
        "div",
        { ref: panelRef, className: `qbot-ptComboPanel is-${pos.placement}`, role: "listbox", "aria-label": label, style: panelStyle },
        h("input", {
          className: "qbot-settingInput qbot-ptComboSearch",
          value: query,
          placeholder: t("pt.membersSearch"),
          onChange: (e) => setQuery(e.target.value),
          "aria-label": t("pt.membersSearch"),
          autoFocus: true
        }),
        h(
          "div",
          { className: "qbot-ptComboList" },
          filtered.length ? filtered.slice(0, 80).map((o) => h(
            "button",
            {
              key: o.value,
              type: "button",
              role: "option",
              "aria-selected": o.value === value,
              className: `qbot-ptComboItem${o.value === value ? " is-on" : ""}`,
              title: o.value,
              onClick: () => {
                onChange(o.value);
                setQuery("");
                setOpen(false);
              }
            },
            h("span", { className: "qbot-ptComboItemLabel" }, o.label),
            o.memberNum ? h(
              "span",
              { className: "qbot-convGroupMembers", title: fmt("archive.groupMemberNum", String(o.memberNum)) },
              fmt("archive.groupMembersShort", String(o.memberNum))
            ) : null,
            h(
              "span",
              { className: `qbot-ptComboSource is-${o.source}` },
              o.source === "config" ? t("pt.groupSourceConfig") : t("pt.groupSourceArchive")
            ),
            o.hint ? h("span", { className: "qbot-ptComboItemHint" }, o.hint) : null
          )) : h("div", { className: "qbot-ptComboEmpty" }, t("pt.comboEmpty"))
        ),
        query.trim() ? h(
          "button",
          {
            type: "button",
            className: "qbot-ptComboManual",
            onClick: () => {
              onChange(query.trim());
              setQuery("");
              setOpen(false);
            }
          },
          `${t("pt.comboEmpty")} → ${query.trim()}`
        ) : null
      ),
      document.body
    ) : null
  );
}

// src/client/dialogs/platform-tools-dialog.tsx
function PlatformToolsDialog(props) {
  const { rpcCall, appId, groups, onClose } = props;
  useLocale();
  const [notice, setNotice] = React12.useState(null);
  React12.useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(null), 5e3);
    return () => window.clearTimeout(id);
  }, [notice]);
  return h(
    "div",
    {
      className: "qbot-modalOverlay"
    },
    h(
      "div",
      {
        className: "qbot-modal qbot-modalWide qbot-ptModal",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": t("pt.tabTitle")
      },
      h(
        "div",
        { className: "qbot-modalHead" },
        h(
          "div",
          null,
          h("strong", null, t("pt.tabTitle")),
          h("p", null, t("pt.tabHint"))
        ),
        h("button", {
          className: "qbot-modalClose",
          type: "button",
          "aria-label": t("common.close"),
          onClick: onClose
        }, "×")
      ),
      notice ? h("div", {
        className: `qbot-detailToast qbot-ptDialogToast is-${notice.tone}`,
        role: notice.tone === "error" ? "alert" : "status",
        onClick: () => setNotice(null)
      }, notice.text) : null,
      h(
        "div",
        { className: "qbot-ptDialogBody" },
        h(PlatformTools, {
          key: appId || "default",
          rpcCall,
          appId,
          groups,
          onNotify: (text, tone) => setNotice({ text, tone })
        })
      ),
      h(
        "div",
        { className: "qbot-modalFoot qbot-ptDialogFoot" },
        h("span", { className: "qbot-hint" }, t("pt.tabSummary")),
        h("button", {
          className: "qbot-btn qbot-btnPrimary",
          type: "button",
          onClick: onClose
        }, t("common.close"))
      )
    )
  );
}

// src/client/dialogs/guild-manager-dialog.tsx
var React13 = __toESM(require("react"), 1);
var TEXT_KEYS = [
  { key: "guilds", icon: "◈" },
  { key: "info", icon: "ⓘ" },
  { key: "channels", icon: "☰" },
  { key: "members", icon: "♙" },
  { key: "roles", icon: "◆" },
  { key: "message", icon: "✎" },
  { key: "speak", icon: "◉" },
  { key: "content", icon: "⌫" },
  { key: "ai", icon: "✦" },
  { key: "assistant", icon: "✧" },
  { key: "apiPerm", icon: "⚿" },
  { key: "events", icon: "⌁" }
];
var CHANNEL_TYPES = [0, 2, 4, 10005, 10006, 10007];
var DEFAULT_ROLE_IDS = /* @__PURE__ */ new Set(["1", "2", "4", "5"]);
var str = (v) => typeof v === "string" ? v : typeof v === "number" ? String(v) : "";
var num = (v) => typeof v === "number" && Number.isFinite(v) ? v : 0;
var splitLines = (v) => v.split("\n").map((s) => s.trim()).filter(Boolean);
var intOf = (v, fallback = 0) => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
};
var defaultScheduleBody = () => {
  const start = Date.now() + 60 * 60 * 1e3;
  const end = start + 60 * 60 * 1e3;
  return JSON.stringify({
    name: "新日程",
    start_timestamp: String(start),
    end_timestamp: String(end),
    remind_type: "1"
  }, null, 2);
};
var checkScheduleBody = (body2) => {
  if (!str(body2.name).trim()) return "gv.schErrName";
  const start = Number(body2.start_timestamp);
  const end = Number(body2.end_timestamp);
  if (!body2.start_timestamp || !Number.isFinite(start)) return "gv.schErrStart";
  if (!body2.end_timestamp || !Number.isFinite(end)) return "gv.schErrEnd";
  if (start <= Date.now()) return "gv.schErrPast";
  if (end <= start) return "gv.schErrEndBeforeStart";
  if (end - start > 7 * 24 * 60 * 60 * 1e3) return "gv.schErrTooLong";
  if (!["0", "1", "2", "3", "4", "5"].includes(str(body2.remind_type))) return "gv.schErrRemind";
  return "";
};
function friendlyError2(message) {
  if (/unknown endpoint|unknown rpc/i.test(message)) return t("pt.errHostRestart");
  if (/11253|40012010|应用无接口访问权限|api.*permission|no api.*access/i.test(message)) return t("gv.errApiPermission");
  if (/501009|unmarshal error|消息.*(格式|无效)|invalid.*message.?id/i.test(message)) return `${t("gv.errBadMsgId")}（${message}）`;
  const sch = {
    "302013": "gv.schErr302013",
    "302014": "gv.schErrTooLong",
    "302015": "gv.schErrPast",
    "302016": "gv.schErrEndBeforeStart",
    "302017": "gv.schErrEmpty",
    "302018": "gv.schErrType",
    "302019": "gv.schErr302019",
    "302020": "gv.schErr302020",
    "302021": "gv.schErr302021",
    "302022": "gv.schErr302022",
    "302023": "gv.schErr302023",
    "302024": "gv.schErr302024"
  };
  const schCode = /3020(1[3-9]|2[0-4])/.exec(message)?.[0];
  if (schCode) return `${t(sch[schCode])}（${schCode}）`;
  if (/403|401|no permission|权限不足|not admin|500013|500014/i.test(message)) return `${t("gv.noPermission")}（${message}）`;
  return message;
}
function argbToHex(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n < 0) return "#7b00cc";
  const rgb = n & 16777215;
  return `#${rgb.toString(16).padStart(6, "0")}`;
}
function hexToArgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return 4294967295;
  return (4278190080 | parseInt(m[1], 16)) >>> 0;
}
function channelName(c) {
  return c.name || `子频道 ${str(c.id).slice(-6)}`;
}
function channelTypeLabel(c) {
  const key = `gv.chType.${c.type ?? 0}`;
  const label = t(key);
  return label === key ? t("gv.chType.0") : label;
}
function guildFrom(v) {
  const list = Array.isArray(v) ? v : [];
  return list.filter((g) => !!g && typeof g === "object").map((g) => ({
    id: str(g.id),
    name: str(g.name),
    icon: str(g.icon) || void 0,
    owner_id: str(g.owner_id) || void 0,
    owner: g.owner === true,
    member_count: num(g.member_count),
    max_members: num(g.max_members),
    description: str(g.description) || void 0,
    joined_at: str(g.joined_at) || void 0
  })).filter((g) => !!g.id);
}
function channelsFrom(v) {
  const list = Array.isArray(v) ? v : [];
  return list.filter((c) => !!c && typeof c === "object").map((c) => ({
    id: str(c.id),
    guild_id: str(c.guild_id) || void 0,
    name: str(c.name) || void 0,
    type: num(c.type),
    sub_type: num(c.sub_type),
    position: num(c.position),
    parent_id: str(c.parent_id) || void 0,
    private_type: num(c.private_type),
    speak_permission: num(c.speak_permission)
  })).filter((c) => !!c.id);
}
function rolesFrom(v) {
  const list = Array.isArray(v) ? v : [];
  return list.filter((r) => !!r && typeof r === "object").map((r) => ({
    id: str(r.id || r.role_id),
    name: str(r.name),
    color: num(r.color),
    hoist: num(r.hoist),
    number: num(r.number),
    member_limit: num(r.member_limit)
  }));
}
function paneHead(title, desc) {
  return h(
    "div",
    { className: "qbot-gvPaneHead" },
    h("strong", null, title),
    h("p", null, desc)
  );
}
function idInput(opts) {
  return h(
    "div",
    { className: "qbot-gvIdInput" },
    h("input", {
      className: "qbot-input qbot-mono",
      list: opts.listId,
      value: opts.value,
      placeholder: opts.placeholder ?? opts.label,
      "aria-label": opts.label,
      onChange: (e) => opts.onChange(e.target.value)
    }),
    h(
      "datalist",
      { id: opts.listId },
      opts.candidates.map((c) => h("option", { key: c.value, value: c.value }, c.label))
    )
  );
}
function infoCell2(label, content) {
  return h(
    "div",
    { className: "qbot-gvInfoCell" },
    h("span", { className: "qbot-gvInfoLabel" }, label),
    h("span", { className: "qbot-gvInfoValue" }, content || "—")
  );
}
function field(label, control, hint) {
  return h(
    "label",
    { className: "qbot-gvField" },
    h("span", { className: "qbot-gvFieldLabel" }, label),
    control,
    hint ? h("small", { className: "qbot-gvFieldHint" }, hint) : null
  );
}
function GuildManager(props) {
  const { rpcCall, appId, onNotify, initialTab, focus, embedded } = props;
  useLocale();
  const [active, setActive] = React13.useState(focus?.tab ?? initialTab ?? "guilds");
  const [busy, setBusy] = React13.useState("");
  const [guilds, setGuilds] = React13.useState([]);
  const [guild, setGuild] = React13.useState(null);
  const [info, setInfo] = React13.useState(null);
  const [channels, setChannels] = React13.useState([]);
  const [channelId, setChannelId] = React13.useState("");
  const [members, setMembers] = React13.useState([]);
  const [memberAfter, setMemberAfter] = React13.useState("");
  const [memberQuery, setMemberQuery] = React13.useState("");
  const [memberDetail, setMemberDetail] = React13.useState(null);
  const [roles, setRoles] = React13.useState([]);
  const [chEditId, setChEditId] = React13.useState("");
  const [chName, setChName] = React13.useState("");
  const [chType, setChType] = React13.useState("0");
  const [chSubType, setChSubType] = React13.useState("1");
  const [chPosition, setChPosition] = React13.useState("1");
  const [chParent, setChParent] = React13.useState("0");
  const [chPrivate, setChPrivate] = React13.useState("0");
  const [chSpeak, setChSpeak] = React13.useState("1");
  const [roleEditId, setRoleEditId] = React13.useState("");
  const [roleName, setRoleName] = React13.useState("");
  const [roleColor, setRoleColor] = React13.useState("4294967295");
  const [roleHoist, setRoleHoist] = React13.useState(false);
  const [assignUser, setAssignUser] = React13.useState("");
  const [assignRole, setAssignRole] = React13.useState("");
  const [assignChannel, setAssignChannel] = React13.useState("");
  const [messageChannel, setMessageChannel] = React13.useState("");
  const [messageText, setMessageText] = React13.useState("");
  const [messageResult, setMessageResult] = React13.useState(null);
  const [speakTab, setSpeakTab] = React13.useState(focus?.speakTab ?? "all");
  const [muteUserId, setMuteUserId] = React13.useState("");
  const [muteMinutes, setMuteMinutes] = React13.useState("10");
  const [msgSettingText, setMsgSettingText] = React13.useState("");
  const [kwEnabled, setKwEnabled] = React13.useState(false);
  const [kwWords, setKwWords] = React13.useState("");
  const [kwMuteMinutes, setKwMuteMinutes] = React13.useState("60");
  const [kwDeleteContent, setKwDeleteContent] = React13.useState(true);
  const [kwDeleteThreadOnReply, setKwDeleteThreadOnReply] = React13.useState(false);
  const [kwWhitelist, setKwWhitelist] = React13.useState("");
  const [kwChannels, setKwChannels] = React13.useState("");
  const [kwLogs, setKwLogs] = React13.useState([]);
  const [kwTab, setKwTab] = React13.useState(focus?.kwTab ?? "config");
  const [recallChannel, setRecallChannel] = React13.useState("");
  const [recallMessageId, setRecallMessageId] = React13.useState("");
  const [recallHideTip, setRecallHideTip] = React13.useState(true);
  const [chDialog, setChDialog] = React13.useState(false);
  const [roleDialog, setRoleDialog] = React13.useState(false);
  const [assignDialog, setAssignDialog] = React13.useState(false);
  const [contentTab, setContentTab] = React13.useState(focus?.contentTab ?? "recall");
  const [contentResult, setContentResult] = React13.useState(null);
  const [announceMsgId, setAnnounceMsgId] = React13.useState("");
  const [announceChannel, setAnnounceChannel] = React13.useState("");
  const [announceType, setAnnounceType] = React13.useState("1");
  const [pinMsgId, setPinMsgId] = React13.useState("");
  const [pinMessages, setPinMessages] = React13.useState([]);
  const [pinMessagesLoaded, setPinMessagesLoaded] = React13.useState(false);
  const [scheduleBody, setScheduleBody] = React13.useState(defaultScheduleBody());
  const [scheduleId, setScheduleId] = React13.useState("");
  const [audioBody, setAudioBody] = React13.useState('{\n  "audio_url": "",\n  "text": ""\n}');
  const [forumThreadId, setForumThreadId] = React13.useState("");
  const [forumBody, setForumBody] = React13.useState('{\n  "title": "",\n  "content": ""\n}');
  const [apiPermResult, setApiPermResult] = React13.useState(null);
  const [apiPermOnlyUnauth, setApiPermOnlyUnauth] = React13.useState(false);
  const [aiTab, setAiTab] = React13.useState(focus?.aiTab ?? "config");
  const [roleColorHex, setRoleColorHex] = React13.useState("#7b00cc");
  const [aiLogs, setAiLogs] = React13.useState([]);
  const [aiEnabled, setAiEnabled] = React13.useState(false);
  const [aiMute, setAiMute] = React13.useState(true);
  const [aiRecall, setAiRecall] = React13.useState(false);
  const [aiWarn, setAiWarn] = React13.useState(true);
  const [aiDurLight, setAiDurLight] = React13.useState("10");
  const [aiDurMedium, setAiDurMedium] = React13.useState("1440");
  const [aiDurSevere, setAiDurSevere] = React13.useState("43200");
  const [aiRules, setAiRules] = React13.useState("");
  const [aiWhitelist, setAiWhitelist] = React13.useState("");
  const [aiChannels, setAiChannels] = React13.useState("");
  const [replyLogs, setReplyLogs] = React13.useState([]);
  const [replyEnabled, setReplyEnabled] = React13.useState(false);
  const [replyOnPost, setReplyOnPost] = React13.useState(true);
  const [replyOnMention, setReplyOnMention] = React13.useState(true);
  const [replyOnce, setReplyOnce] = React13.useState(true);
  const [replyPrompt, setReplyPrompt] = React13.useState("");
  const [replyWhitelist, setReplyWhitelist] = React13.useState("");
  const [replyChannels, setReplyChannels] = React13.useState("");
  const [replyGuildMessages, setReplyGuildMessages] = React13.useState(false);
  const [replyForumEvents, setReplyForumEvents] = React13.useState(false);
  const [subNotice, setSubNotice] = React13.useState(null);
  React13.useEffect(() => {
    if (!subNotice) return;
    const id = window.setTimeout(() => setSubNotice(null), 5e3);
    return () => window.clearTimeout(id);
  }, [subNotice]);
  const notify = React13.useCallback((text, tone) => {
    onNotify(text, tone);
    setSubNotice({ text, tone });
  }, [onNotify]);
  const notifyError = React13.useCallback((text) => notify(text, "error"), [notify]);
  const notifySuccess = React13.useCallback((text) => notify(text, "success"), [notify]);
  const call = React13.useCallback(async (endpoint, payload = {}, successText = "") => {
    const res = await rpcCall(endpoint, { appId, ...payload });
    if (!res.ok) throw new Error(friendlyError2(errText(res.error)));
    const data = val(res);
    if (successText) onNotify(successText, "success");
    return data;
  }, [appId, rpcCall, onNotify]);
  const run = React13.useCallback(async (key, fn) => {
    setBusy(key);
    try {
      await fn();
    } catch (e) {
      notifyError(friendlyError2(e instanceof Error ? e.message : String(e)));
    } finally {
      setBusy("");
    }
  }, [notifyError]);
  const btn = (key, label, onClick, primary = false, disabled = false) => h("button", {
    className: `qbot-btn${primary ? " qbot-btnPrimary" : ""}`,
    type: "button",
    disabled: busy === key || disabled,
    onClick
  }, busy === key ? t("common.loading") : label);
  const loadGuilds = React13.useCallback(async () => {
    await run("guilds", async () => {
      setGuilds(guildFrom(await call("guild.list")));
    });
  }, [call, run]);
  React13.useEffect(() => {
    void loadGuilds();
  }, [loadGuilds]);
  const pickGuild = (g) => {
    if (guild?.id === g.id) return;
    setGuild(g);
    setInfo(null);
    setChannels([]);
    setChannelId("");
    setMessageChannel("");
    setMembers([]);
    setMemberAfter("");
    setMemberDetail(null);
    setRoles([]);
    setChEditId("");
    setRoleEditId("");
    setMsgSettingText("");
    setRecallChannel("");
    setRecallMessageId("");
    setPinMessages([]);
    setPinMessagesLoaded(false);
    setPinMsgId("");
    setAiLogs([]);
    setReplyLogs([]);
  };
  React13.useEffect(() => {
    if (!guild?.id) return;
    const id = guild.id;
    if (active === "info") {
      void run("info", async () => {
        setInfo(await call("guild.info", { guildId: id }) ?? {});
      });
    } else if (active === "channels") {
      void run("channels", async () => {
        const list = channelsFrom(await call("guild.channels", { guildId: id }));
        setChannels(list);
        setChannelId((prev) => prev && list.some((c) => c.id === prev) ? prev : list[0]?.id ?? "");
      });
    } else if (active === "members") {
      void run("members", async () => {
        const data = await call("guild.members", { guildId: id, after: "0", limit: 100 }) ?? {};
        setMembers(Array.isArray(data.members) ? data.members : []);
        setMemberAfter(str(data.next));
      });
    } else if (active === "roles") {
      void run("roles", async () => {
        setRoles(rolesFrom(await call("guild.roles", { guildId: id })));
      });
    } else if (active === "speak") {
      void run("speak", async () => {
        const setting = await call("guild.setting.get", { guildId: id }) ?? {};
        setMsgSettingText(JSON.stringify(setting, null, 2));
        const kc = await call("guild.keyword.config.get", { guildId: id }) ?? {};
        const kcfg = kc.config ?? {};
        setKwEnabled(kcfg.enabled === true);
        setKwWords(Array.isArray(kcfg.words) ? kcfg.words.join("\n") : "");
        setKwMuteMinutes(String(kcfg.muteMinutes ?? 60));
        setKwDeleteContent(kcfg.deleteContent !== false);
        setKwDeleteThreadOnReply(kcfg.deleteThreadOnReply === true);
        setKwWhitelist(Array.isArray(kcfg.whitelist) ? kcfg.whitelist.join("\n") : "");
        setKwChannels(Array.isArray(kcfg.channelIds) ? kcfg.channelIds.join("\n") : "");
        const kl = await call("guild.keyword.logs", { guildId: id, limit: 30 }) ?? {};
        setKwLogs(Array.isArray(kl.logs) ? kl.logs : []);
      });
    } else if (active === "ai") {
      void run("ai", async () => {
        const mc = await call("guild.mod.config.get", { guildId: id }) ?? {};
        const cfg = mc.config ?? {};
        setAiEnabled(cfg.enabled === true);
        setAiMute(cfg.actions?.mute !== false);
        setAiRecall(cfg.actions?.recall === true);
        setAiWarn(cfg.actions?.warn !== false);
        setAiDurLight(String(cfg.durations?.light ?? 10));
        setAiDurMedium(String(cfg.durations?.medium ?? 1440));
        setAiDurSevere(String(cfg.durations?.severe ?? 43200));
        setAiRules(Array.isArray(cfg.rules) ? cfg.rules.join("\n") : "");
        setAiWhitelist(Array.isArray(cfg.whitelist) ? cfg.whitelist.join("\n") : "");
        setAiChannels(Array.isArray(cfg.channelIds) ? cfg.channelIds.join("\n") : "");
        const logs = await call("guild.mod.logs", { guildId: id, limit: 30 }) ?? {};
        setAiLogs(Array.isArray(logs.logs) ? logs.logs : []);
        const rc = await call("guild.reply.config.get", { guildId: id }) ?? {};
        const rcfg = rc.config ?? {};
        setReplyEnabled(rcfg.enabled === true);
        setReplyOnPost(rcfg.onPost !== false);
        setReplyOnMention(rcfg.onMention !== false);
        setReplyOnce(rcfg.once !== false);
        setReplyPrompt(typeof rcfg.prompt === "string" ? rcfg.prompt : "");
        setReplyWhitelist(Array.isArray(rcfg.whitelist) ? rcfg.whitelist.join("\n") : "");
        setReplyChannels(Array.isArray(rcfg.channelIds) ? rcfg.channelIds.join("\n") : "");
        const rlogs = await call("guild.reply.logs", { guildId: id, limit: 30 }) ?? {};
        setReplyLogs(Array.isArray(rlogs.logs) ? rlogs.logs : []);
        const bc = await call("config.get") ?? {};
        const botCfg = bc.config ?? {};
        setReplyGuildMessages(botCfg.guildMessageEvents === true);
        setReplyForumEvents(botCfg.forumEvents === true);
      });
    }
  }, [active, guild?.id]);
  React13.useEffect(() => {
    if (!focus) return;
    setActive(focus.tab);
    if (focus.speakTab) setSpeakTab(focus.speakTab);
    if (focus.kwTab) setKwTab(focus.kwTab);
    if (focus.contentTab) setContentTab(focus.contentTab);
    if (focus.aiTab) setAiTab(focus.aiTab);
  }, [focus?.tab, focus?.speakTab, focus?.kwTab, focus?.contentTab, focus?.aiTab]);
  const needGuild = h("div", { className: "qbot-gvEmpty", role: "status" }, t("gv.needGuild"));
  const setupHint = h(
    "div",
    { className: "qbot-gvSetup", role: "note" },
    h(
      "div",
      { className: "qbot-gvSetupHead" },
      h("span", { className: "qbot-gvSetupIcon", "aria-hidden": "true" }, "ⓘ"),
      h("strong", null, t("gv.setupTitle"))
    ),
    h(
      "ol",
      { className: "qbot-gvSetupSteps" },
      h("li", null, t("gv.setupStep1")),
      h("li", null, t("gv.setupStep2"))
    ),
    h(
      "div",
      { className: "qbot-gvSetupFoot" },
      h("span", null, t("gv.setupFoot")),
      h("a", {
        className: "qbot-gvSetupLink",
        href: "https://bot.q.qq.com/",
        target: "_blank",
        rel: "noreferrer noopener"
      }, t("gv.setupLink"))
    )
  );
  const guildsPane = () => h(
    "div",
    { className: "qbot-gvPane" },
    paneHead(t("gv.tab.guilds"), t("gv.guildsDesc")),
    setupHint,
    h(
      "div",
      { className: "qbot-gvPaneActions" },
      h("span", { className: "qbot-gvCount" }, fmt("gv.guildsTotal", String(guilds.length))),
      btn("guilds", t("common.refresh"), () => void loadGuilds())
    ),
    guilds.length ? h("div", { className: "qbot-gvGuildGrid" }, guilds.map((g) => h(
      "button",
      {
        key: g.id,
        type: "button",
        className: `qbot-gvGuildCard${guild?.id === g.id ? " is-on" : ""}`,
        title: g.description || g.name,
        onClick: () => pickGuild(g)
      },
      h("span", { className: "qbot-gvGuildAvatar" }, (g.name || "?").slice(0, 1)),
      h(
        "span",
        { className: "qbot-gvGuildMain" },
        h("strong", null, g.name || t("gv.infoEmpty")),
        h("small", null, fmt("gv.guildMembers", String(g.member_count)))
      ),
      guild?.id === g.id ? h("span", { className: "qbot-gvBadge" }, t("gv.selected")) : null
    ))) : h("div", { className: "qbot-gvEmpty" }, t("gv.guildsEmpty"))
  );
  const infoPane = () => h(
    "div",
    { className: "qbot-gvPane" },
    paneHead(t("gv.tab.info"), t("gv.infoDesc")),
    !guild ? needGuild : info ? h(
      "div",
      { className: "qbot-gvInfoGrid" },
      infoCell2(t("gv.infoName"), str(info.name) || guild.name),
      infoCell2(t("gv.infoId"), guild.id),
      infoCell2(t("gv.infoOwner"), str(info.owner_id) || str(info.owner)),
      infoCell2(t("gv.infoMember"), num(info.member_count) || ""),
      infoCell2(t("gv.infoMax"), num(info.max_members) || ""),
      infoCell2(t("gv.infoJoined"), str(info.joined_at) ? formatTime(info.joined_at) : ""),
      h(
        "div",
        { className: "qbot-gvInfoCell is-wide" },
        h("span", { className: "qbot-gvInfoLabel" }, t("gv.infoIntro")),
        h("span", { className: "qbot-gvInfoValue" }, str(info.description) || "—")
      )
    ) : h("div", { className: "qbot-gvEmpty" }, t("gv.infoEmpty"))
  );
  const saveChannel = () => void run("chSave", async () => {
    if (!guild) return;
    const name2 = chName.trim();
    if (!name2) {
      notifyError(t("gv.chName"));
      return;
    }
    if (chEditId) {
      await call("guild.channel.patch", {
        channelId: chEditId,
        body: {
          name: name2,
          position: intOf(chPosition, 1),
          parent_id: chParent.trim() || "0",
          private_type: intOf(chPrivate),
          speak_permission: intOf(chSpeak, 1)
        }
      }, t("gv.chUpdated"));
    } else {
      await call("guild.channel.create", {
        guildId: guild.id,
        body: {
          name: name2,
          type: intOf(chType),
          sub_type: intOf(chSubType, 1),
          position: intOf(chPosition, 1),
          parent_id: chParent.trim() || "0",
          private_type: intOf(chPrivate),
          speak_permission: intOf(chSpeak, 1)
        }
      }, t("gv.chCreated"));
    }
    setChDialog(false);
    setChEditId("");
    setChName("");
    const list = channelsFrom(await call("guild.channels", { guildId: guild.id }));
    setChannels(list);
  });
  const openChannelDialog = (c) => {
    if (c) {
      setChEditId(c.id);
      setChName(c.name ?? "");
      setChType(String(c.type ?? 0));
      setChSubType(String(c.sub_type ?? 1));
      setChPosition(String(c.position ?? 1));
      setChParent(c.parent_id ?? "0");
      setChPrivate(String(c.private_type ?? 0));
      setChSpeak(String(c.speak_permission ?? 1));
    } else {
      setChEditId("");
      setChName("");
      setChType("0");
      setChSubType("1");
      setChPosition("1");
      setChParent("0");
      setChPrivate("0");
      setChSpeak("1");
    }
    setChDialog(true);
  };
  const channelForm = () => h(
    "div",
    { className: "qbot-gvForm" },
    h(
      "div",
      { className: "qbot-gvFormHead" },
      h("strong", null, chEditId ? t("gv.chEdit") : t("gv.chCreate"))
    ),
    field(t("gv.chName"), h("input", {
      className: "qbot-input",
      value: chName,
      placeholder: "公告区",
      onChange: (e) => setChName(e.target.value)
    })),
    field(t("gv.chType"), h("select", {
      className: "qbot-settingSelect",
      value: chType,
      disabled: !!chEditId,
      onChange: (e) => setChType(e.target.value)
    }, CHANNEL_TYPES.map((v) => h("option", { key: v, value: String(v) }, t(`gv.chType.${v}`))))),
    field(t("gv.chSubType"), h("input", {
      className: "qbot-input",
      type: "number",
      value: chSubType,
      disabled: !!chEditId,
      onChange: (e) => setChSubType(e.target.value)
    })),
    field(t("gv.chPosition"), h("input", {
      className: "qbot-input",
      type: "number",
      value: chPosition,
      onChange: (e) => setChPosition(e.target.value)
    })),
    field(t("gv.chParent"), h("input", {
      className: "qbot-input",
      value: chParent,
      placeholder: "0",
      onChange: (e) => setChParent(e.target.value)
    }), t("gv.chParentHint")),
    field(t("gv.chPrivate"), h("select", {
      className: "qbot-settingSelect",
      value: chPrivate,
      onChange: (e) => setChPrivate(e.target.value)
    }, ["0", "1", "2"].map((v) => h("option", { key: v, value: v }, v)))),
    field(t("gv.chSpeak"), h("select", {
      className: "qbot-settingSelect",
      value: chSpeak,
      onChange: (e) => setChSpeak(e.target.value)
    }, ["0", "1", "2"].map((v) => h("option", { key: v, value: v }, v)))),
    h(
      "div",
      { className: "qbot-gvFormActions" },
      btn("chSave", t("common.save"), saveChannel, true),
      h("button", { className: "qbot-btn", type: "button", onClick: () => {
        setChDialog(false);
        setChEditId("");
        setChName("");
      } }, t("common.cancel"))
    )
  );
  const channelsPane = () => h(
    "div",
    { className: "qbot-gvPane" },
    paneHead(t("gv.tab.channels"), t("gv.chDesc")),
    !guild ? needGuild : h(
      React13.Fragment,
      null,
      h(
        "div",
        { className: "qbot-gvList" },
        h(
          "div",
          { className: "qbot-gvListHead" },
          h("strong", null, t("gv.chList")),
          h(
            "div",
            { className: "qbot-gvRowOps" },
            h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: () => openChannelDialog() }, t("gv.chCreate")),
            btn("channels", t("common.refresh"), () => void run("channels", async () => {
              const list = channelsFrom(await call("guild.channels", { guildId: guild.id }));
              setChannels(list);
            }))
          )
        ),
        channels.length ? channels.map((c) => h(
          "div",
          { key: c.id, className: "qbot-gvRow" },
          h(
            "div",
            { className: "qbot-gvRowMain" },
            h("strong", null, channelName(c)),
            h("small", null, `${channelTypeLabel(c)} · ${c.id}`)
          ),
          h(
            "div",
            { className: "qbot-gvRowOps" },
            h("button", {
              className: "qbot-btn",
              type: "button",
              onClick: () => openChannelDialog(c)
            }, t("common.edit")),
            h("button", {
              className: "qbot-btn qbot-btnDanger",
              type: "button",
              disabled: busy === `chDel:${c.id}`,
              onClick: () => void run(`chDel:${c.id}`, async () => {
                if (!await confirmDlg({ message: fmt("gv.delConfirm", channelName(c)) })) return;
                await call("guild.channel.delete", { channelId: c.id }, t("gv.chDeleted"));
                setChannels((prev) => prev.filter((x) => x.id !== c.id));
                if (channelId === c.id) setChannelId("");
                if (messageChannel === c.id) setMessageChannel("");
              })
            }, t("common.delete"))
          )
        )) : h("div", { className: "qbot-gvEmpty" }, t("gv.infoEmpty"))
      )
    )
  );
  const membersPane = () => {
    const q = memberQuery.trim().toLowerCase();
    const shown = q ? members.filter((m) => {
      const user = m.user && typeof m.user === "object" ? m.user : {};
      return str(user.id).toLowerCase().includes(q) || str(user.username).toLowerCase().includes(q) || str(m.nick).toLowerCase().includes(q);
    }) : members;
    return h(
      "div",
      { className: "qbot-gvPane" },
      paneHead(t("gv.tab.members"), t("gv.memDesc")),
      !guild ? needGuild : h(
        React13.Fragment,
        null,
        memberDetail ? h(
          "div",
          { className: "qbot-gvDetail" },
          h(
            "div",
            { className: "qbot-gvDetailHead" },
            h("strong", null, str(memberDetail.user?.username) || str(memberDetail.nick) || t("gv.memDetail")),
            h("button", { className: "qbot-modalClose", type: "button", "aria-label": t("common.close"), onClick: () => setMemberDetail(null) }, "×")
          ),
          h(
            "div",
            { className: "qbot-gvInfoGrid" },
            infoCell2(t("gv.infoId"), str(memberDetail.user?.id)),
            infoCell2(t("gv.memNick"), str(memberDetail.nick)),
            infoCell2(t("gv.memRoles"), Array.isArray(memberDetail.roles) ? memberDetail.roles.join(" / ") : ""),
            infoCell2(t("gv.memJoined"), str(memberDetail.joined_at) ? formatTime(memberDetail.joined_at) : ""),
            infoCell2(t("gv.memBot"), memberDetail.user && memberDetail.user.bot === true ? t("gv.memBot") : "")
          )
        ) : null,
        h(
          "div",
          { className: "qbot-gvPaneActions" },
          h("input", {
            className: "qbot-input qbot-gvSearch",
            type: "search",
            value: memberQuery,
            placeholder: t("gv.memSearch"),
            "aria-label": t("gv.memSearch"),
            onChange: (e) => setMemberQuery(e.target.value)
          }),
          h("span", { className: "qbot-gvCount" }, fmt("gv.memTotal", String(shown.length)))
        ),
        h(
          "div",
          { className: "qbot-gvList" },
          shown.length ? shown.map((m, i) => {
            const user = m.user && typeof m.user === "object" ? m.user : {};
            const uid = str(user.id);
            return h(
              "button",
              {
                key: `${uid}:${i}`,
                type: "button",
                className: "qbot-gvRow is-button",
                onClick: () => void run(`mem:${uid}`, async () => {
                  setMemberDetail(await call("guild.member", { guildId: guild.id, userId: uid }) ?? m);
                })
              },
              h(
                "div",
                { className: "qbot-gvRowMain" },
                h("strong", null, str(user.username) || str(m.nick) || uid),
                h("small", null, `${uid}${Array.isArray(m.roles) && m.roles.length ? ` · ${m.roles.join("/")}` : ""}`)
              ),
              h("span", { className: "qbot-gvRowMore" }, t("gv.memDetail"))
            );
          }) : h("div", { className: "qbot-gvEmpty" }, t("gv.memEmpty"))
        ),
        memberAfter ? h(
          "div",
          { className: "qbot-gvPaneActions" },
          btn("more", t("gv.memMore"), () => void run("more", async () => {
            const data = await call("guild.members", { guildId: guild.id, after: memberAfter, limit: 100 }) ?? {};
            const next = Array.isArray(data.members) ? data.members : [];
            setMembers((prev) => {
              const seen = new Set(prev.map((m) => str(m.user?.id)));
              return [...prev, ...next.filter((m) => !seen.has(str(m.user?.id)))];
            });
            setMemberAfter(str(data.next));
          }))
        ) : null,
        // 更多成员能力：在线数（按子频道）/ 身份组成员 / 删除成员
        h(
          "div",
          { className: "qbot-gvForm" },
          h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.memMoreTitle"))),
          h(
            "div",
            { className: "qbot-gvFormRow" },
            field(t("gv.memOnlineChannel"), h(
              "select",
              {
                className: "qbot-settingSelect",
                value: channelId,
                onChange: (e) => setChannelId(e.target.value)
              },
              h("option", { value: "" }, "—"),
              channels.map((c) => h("option", { key: c.id, value: c.id }, channelName(c)))
            )),
            field(t("gv.memRoleId"), h("input", {
              className: "qbot-input qbot-mono",
              value: assignRole,
              placeholder: t("gv.memRoleIdPlaceholder"),
              "aria-label": t("gv.memRoleId"),
              onChange: (e) => setAssignRole(e.target.value)
            }))
          ),
          h(
            "div",
            { className: "qbot-gvFormActions" },
            btn("memOnline", t("gv.memOnline"), () => void run("memOnline", async () => {
              if (!channelId) {
                notifyError(t("gv.needChannel"));
                return;
              }
              setContentResult(await call("guild.channel.online", { channelId }));
            })),
            btn("memRoleList", t("gv.memRoleList"), () => void run("memRoleList", async () => {
              if (!assignRole.trim()) {
                notifyError(t("gv.memRoleId"));
                return;
              }
              setContentResult(await call("guild.role.members", { guildId: guild.id, roleId: assignRole.trim() }));
            })),
            btn("memKick", t("gv.memKick"), () => void run("memKick", async () => {
              if (!assignUser.trim()) {
                notifyError(t("gv.roleUserId"));
                return;
              }
              if (!await confirmDlg({ message: fmt("gv.memKickConfirm", assignUser.trim()) })) return;
              setContentResult(await call("guild.member.delete", { guildId: guild.id, userId: assignUser.trim() }, t("gv.memKicked")));
              setMembers((prev) => prev.filter((m) => str(m.user?.id) !== assignUser.trim()));
            }))
          ),
          h(
            "div",
            { className: "qbot-gvResult" },
            contentResult === null ? null : h("pre", null, JSON.stringify(contentResult, null, 2))
          )
        )
      )
    );
  };
  const onRoleColorPick = (hex) => {
    setRoleColorHex(hex);
    setRoleColor(String(hexToArgb(hex)));
  };
  const onRoleColorNumber = (v) => {
    setRoleColor(v);
    setRoleColorHex(argbToHex(v));
  };
  const saveRole = () => void run("roleSave", async () => {
    if (!guild) return;
    const name2 = roleName.trim();
    if (!name2) {
      notifyError(t("gv.roleName"));
      return;
    }
    const color = intOf(roleColor, 4294967295) ?? 4294967295;
    const body2 = { name: name2, color, hoist: roleHoist ? 1 : 0 };
    if (roleEditId) {
      await call("guild.role.patch", { guildId: guild.id, roleId: roleEditId, body: body2 }, t("gv.roleUpdated"));
    } else {
      await call("guild.role.create", { guildId: guild.id, body: body2 }, t("gv.roleCreated"));
    }
    setRoleDialog(false);
    setRoleEditId("");
    setRoleName("");
    setRoles(rolesFrom(await call("guild.roles", { guildId: guild.id })));
  });
  const openRoleDialog = (r) => {
    if (r) {
      setRoleEditId(str(r.id));
      setRoleName(r.name ?? "");
      setRoleColor(String(r.color ?? 4294967295));
      setRoleColorHex(argbToHex(r.color));
      setRoleHoist(r.hoist === 1);
    } else {
      setRoleEditId("");
      setRoleName("");
      setRoleColor("4294967295");
      setRoleColorHex("#ffffff");
      setRoleHoist(false);
    }
    setRoleDialog(true);
  };
  const roleForm = () => h(
    "div",
    { className: "qbot-gvForm" },
    h(
      "div",
      { className: "qbot-gvFormHead" },
      h("strong", null, roleEditId ? t("gv.roleEdit") : t("gv.roleCreate"))
    ),
    field(t("gv.roleName"), h("input", {
      className: "qbot-input",
      value: roleName,
      placeholder: t("gv.roleNamePlaceholder"),
      onChange: (e) => setRoleName(e.target.value)
    })),
    field(t("gv.roleColor"), h(
      "div",
      { className: "qbot-gvColorRow" },
      h("input", {
        className: "qbot-gvColorPick",
        type: "color",
        value: roleColorHex,
        "aria-label": t("gv.roleColor"),
        onChange: (e) => onRoleColorPick(e.target.value)
      }),
      h("input", {
        className: "qbot-input qbot-gvColorNum",
        type: "number",
        value: roleColor,
        "aria-label": t("gv.roleColorArgb"),
        onChange: (e) => onRoleColorNumber(e.target.value)
      })
    ), t("gv.roleColorHint")),
    h(
      "label",
      { className: "qbot-gvCheck" },
      h("input", { type: "checkbox", checked: roleHoist, onChange: (e) => setRoleHoist(e.target.checked) }),
      h("span", null, t("gv.roleHoist"))
    ),
    h(
      "div",
      { className: "qbot-gvFormActions" },
      btn("roleSave", t("common.save"), saveRole, true),
      h("button", { className: "qbot-btn", type: "button", onClick: () => {
        setRoleDialog(false);
        setRoleEditId("");
        setRoleName("");
      } }, t("common.cancel"))
    )
  );
  const rolesPane = () => h(
    "div",
    { className: "qbot-gvPane" },
    paneHead(t("gv.tab.roles"), t("gv.roleDesc")),
    !guild ? needGuild : h(
      React13.Fragment,
      null,
      h(
        "div",
        { className: "qbot-gvList" },
        h(
          "div",
          { className: "qbot-gvListHead" },
          h("strong", null, t("gv.roleList")),
          h(
            "div",
            { className: "qbot-gvRowOps" },
            h("button", { className: "qbot-btn", type: "button", onClick: () => setAssignDialog(true) }, t("gv.roleAssign")),
            h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: () => openRoleDialog() }, t("gv.roleCreate")),
            btn("roles", t("common.refresh"), () => void run("roles", async () => {
              setRoles(rolesFrom(await call("guild.roles", { guildId: guild.id })));
            }))
          )
        ),
        roles.length ? roles.map((r) => {
          const rid = str(r.id);
          const isDefault = DEFAULT_ROLE_IDS.has(rid);
          return h(
            "div",
            { key: rid, className: "qbot-gvRow" },
            h(
              "div",
              { className: "qbot-gvRowMain" },
              h("strong", null, r.name || rid),
              h("small", null, `${rid} · ${fmt("gv.roleCount", String(r.number))}${isDefault ? ` · ${t("gv.roleDefault")}` : ""}`)
            ),
            isDefault ? null : h(
              "div",
              { className: "qbot-gvRowOps" },
              h("button", {
                className: "qbot-btn",
                type: "button",
                onClick: () => openRoleDialog(r)
              }, t("common.edit")),
              h("button", {
                className: "qbot-btn qbot-btnDanger",
                type: "button",
                disabled: busy === `roleDel:${rid}`,
                onClick: () => void run(`roleDel:${rid}`, async () => {
                  if (!await confirmDlg({ message: fmt("gv.delConfirm", r.name || rid) })) return;
                  await call("guild.role.delete", { guildId: guild.id, roleId: rid }, t("gv.roleDeleted"));
                  setRoles((prev) => prev.filter((x) => str(x.id) !== rid));
                })
              }, t("common.delete"))
            )
          );
        }) : h("div", { className: "qbot-gvEmpty" }, t("gv.infoEmpty"))
      )
    )
  );
  const assignRoleMember = async (add) => {
    if (!guild) return;
    await run(add ? "roleAdd" : "roleRemove", async () => {
      if (!assignUser.trim() || !assignRole.trim()) {
        notifyError(`${t("gv.roleUserId")} / ${t("gv.roleRoleId")}`);
        return;
      }
      await call("guild.role.member", {
        guildId: guild.id,
        userId: assignUser.trim(),
        roleId: assignRole.trim(),
        add,
        channelId: assignChannel.trim()
      }, add ? t("gv.roleAssigned") : t("gv.roleUnassigned"));
      setAssignDialog(false);
    });
  };
  const assignRoleForm = () => h(
    "div",
    { className: "qbot-gvForm" },
    h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.roleAssign"))),
    field(t("gv.roleUserId"), idInput({
      value: assignUser,
      onChange: setAssignUser,
      placeholder: t("gv.userIdPlaceholder"),
      label: t("gv.roleUserId"),
      listId: "gv-assign-user-list",
      candidates: members.map((m) => {
        const u = m.user && typeof m.user === "object" ? m.user : {};
        return { value: str(u.id), label: str(u.username) || str(m.nick) || str(u.id) };
      }).filter((c) => !!c.value)
    }), t("gv.idPasteHint")),
    field(t("gv.roleRoleId"), h("input", {
      className: "qbot-input",
      value: assignRole,
      placeholder: "身份组 ID",
      onChange: (e) => setAssignRole(e.target.value)
    })),
    field(t("gv.roleAssignChannel"), h("input", {
      className: "qbot-input",
      value: assignChannel,
      placeholder: "仅身份组 5 需要",
      onChange: (e) => setAssignChannel(e.target.value)
    })),
    h(
      "div",
      { className: "qbot-gvFormActions" },
      btn("roleAdd", t("gv.roleAdd"), () => void assignRoleMember(true), true),
      btn("roleRemove", t("gv.roleRemove"), () => void assignRoleMember(false))
    )
  );
  const messagePane = () => h(
    "div",
    { className: "qbot-gvPane" },
    paneHead(t("gv.tab.message"), t("gv.msgDesc")),
    !guild ? needGuild : h(
      React13.Fragment,
      null,
      h(
        "div",
        { className: "qbot-gvForm" },
        field(t("gv.msgChannel"), h(
          "select",
          {
            className: "qbot-settingSelect",
            value: messageChannel || channelId,
            onChange: (e) => {
              setMessageChannel(e.target.value);
              setMessageResult(null);
            }
          },
          h("option", { value: "" }, "—"),
          channels.map((c) => h("option", { key: c.id, value: c.id }, channelName(c)))
        )),
        field(t("gv.msgContent"), h("textarea", {
          className: "qbot-ptTextarea",
          rows: 5,
          value: messageText,
          placeholder: t("gv.msgPlaceholder"),
          "aria-label": t("gv.msgContent"),
          onChange: (e) => setMessageText(e.target.value)
        })),
        h(
          "div",
          { className: "qbot-gvFormActions" },
          btn("msgSend", t("gv.msgSend"), () => void run("msgSend", async () => {
            const cid = messageChannel || channelId;
            if (!cid) {
              notifyError(t("gv.needChannel"));
              return;
            }
            if (!messageText.trim()) {
              notifyError(t("gv.msgContent"));
              return;
            }
            const res = await call("guild.message.send", { channelId: cid, content: messageText }, t("gv.msgSent"));
            setMessageResult(res ?? {});
            setMessageText("");
          }), true)
        )
      ),
      messageResult !== null ? (() => {
        const msgId = str(messageResult?.id);
        return h(
          "div",
          { className: "qbot-gvForm qbot-gvReceipt" },
          h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.msgReceipt"))),
          msgId ? h(
            "div",
            { className: "qbot-gvReceiptOk" },
            h("code", null, `${t("gv.msgId")}: ${msgId}`),
            h("span", null, t("gv.msgHasId"))
          ) : h("div", { className: "qbot-gvReceiptWarn" }, t("gv.msgNoId")),
          h(
            "details",
            { className: "qbot-gvRawDetails" },
            h("summary", null, t("gv.msgRaw")),
            h("pre", null, JSON.stringify(messageResult, null, 2))
          )
        );
      })() : null,
      h(
        "div",
        { className: "qbot-gvForm qbot-gvTip" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.msgTipTitle"))),
        h("p", null, t("gv.msgTip"))
      )
    )
  );
  const doMute = async (userId, minutes) => {
    if (!guild) return;
    await run("mute", async () => {
      if (!userId.trim()) {
        notifyError(t("gv.muteNeedUser"));
        return;
      }
      await call(
        userId === "*" ? "guild.mute.all" : "guild.mute.member",
        userId === "*" ? { guildId: guild.id, minutes } : { guildId: guild.id, userId: userId.trim(), minutes },
        minutes === 0 ? t("gv.muteUnmuted") : t("gv.muteDone")
      );
    });
  };
  const saveMsgSetting = async () => {
    if (!guild) return;
    await run("settingSave", async () => {
      let body2;
      try {
        body2 = JSON.parse(msgSettingText);
      } catch {
        notifyError(t("gv.settingInvalidJson"));
        return;
      }
      await call("guild.setting.put", { guildId: guild.id, body: body2 }, t("gv.settingSaved"));
    });
  };
  const saveKeywordConfig = async () => {
    if (!guild) return;
    if (kwEnabled && !splitLines(kwWords).length) {
      notifyError(t("gv.kwNeedWords"));
      return;
    }
    await run("kwSave", async () => {
      const config = {
        enabled: kwEnabled,
        words: splitLines(kwWords),
        muteMinutes: intOf(kwMuteMinutes, 60),
        deleteContent: kwDeleteContent,
        deleteThreadOnReply: kwDeleteThreadOnReply,
        whitelist: splitLines(kwWhitelist),
        channelIds: splitLines(kwChannels)
      };
      await call("guild.keyword.config.save", { guildId: guild.id, config }, t("gv.kwSaved"));
    });
  };
  const reloadKeywordLogs = async () => {
    if (!guild) return;
    await run("kwLogs", async () => {
      const kl = await call("guild.keyword.logs", { guildId: guild.id, limit: 30 }) ?? {};
      setKwLogs(Array.isArray(kl.logs) ? kl.logs : []);
    });
  };
  const keywordPane = () => h(
    "div",
    { className: "qbot-gvStack" },
    h(
      "div",
      { className: "qbot-gvSubTabs" },
      h("button", {
        type: "button",
        role: "tab",
        "aria-selected": kwTab === "config",
        className: `qbot-gvSubTab${kwTab === "config" ? " is-on" : ""}`,
        onClick: () => setKwTab("config")
      }, t("gv.kwSubConfig")),
      h("button", {
        type: "button",
        role: "tab",
        "aria-selected": kwTab === "logs",
        className: `qbot-gvSubTab${kwTab === "logs" ? " is-on" : ""}`,
        onClick: () => {
          setKwTab("logs");
          void reloadKeywordLogs();
        }
      }, t("gv.kwSubLogs"))
    ),
    kwTab === "config" ? h(
      "div",
      { className: "qbot-gvStack" },
      h(
        "div",
        { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.kwTitle"))),
        h(
          "label",
          { className: "qbot-gvCheck" },
          h("input", { type: "checkbox", checked: kwEnabled, onChange: (e) => setKwEnabled(e.target.checked) }),
          t("gv.kwEnable")
        ),
        h("small", { className: "qbot-gvFieldHint" }, t("gv.kwEnableHint"))
      ),
      h(
        "div",
        { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.kwWordsTitle"))),
        h("textarea", {
          className: "qbot-ptTextarea",
          rows: 6,
          value: kwWords,
          placeholder: t("gv.kwWordsPlaceholder"),
          "aria-label": t("gv.kwWordsTitle"),
          onChange: (e) => setKwWords(e.target.value)
        }),
        h("small", { className: "qbot-gvFieldHint" }, t("gv.kwWordsHint"))
      ),
      h(
        "div",
        { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.kwActionTitle"))),
        field(t("gv.kwMuteMinutes"), h("input", {
          className: "qbot-input qbot-gvInputShort",
          type: "number",
          min: "0",
          max: "43200",
          value: kwMuteMinutes,
          onChange: (e) => setKwMuteMinutes(e.target.value)
        }), t("gv.kwMuteMinutesHint")),
        h(
          "label",
          { className: "qbot-gvCheck" },
          h("input", { type: "checkbox", checked: kwDeleteContent, onChange: (e) => setKwDeleteContent(e.target.checked) }),
          t("gv.kwDeleteContent")
        ),
        h(
          "label",
          { className: "qbot-gvCheck" },
          h("input", { type: "checkbox", checked: kwDeleteThreadOnReply, onChange: (e) => setKwDeleteThreadOnReply(e.target.checked) }),
          t("gv.kwDeleteThreadOnReply")
        ),
        h("small", { className: "qbot-gvFieldHint" }, t("gv.kwActionHint"))
      ),
      h(
        "div",
        { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.kwScopeTitle"))),
        field(t("gv.kwWhitelist"), h("textarea", {
          className: "qbot-ptTextarea",
          rows: 3,
          value: kwWhitelist,
          placeholder: t("gv.kwWhitelistPlaceholder"),
          "aria-label": t("gv.kwWhitelist"),
          onChange: (e) => setKwWhitelist(e.target.value)
        }), t("gv.kwWhitelistHint")),
        field(t("gv.kwChannels"), h("textarea", {
          className: "qbot-ptTextarea",
          rows: 3,
          value: kwChannels,
          placeholder: t("gv.kwChannelsPlaceholder"),
          "aria-label": t("gv.kwChannels"),
          onChange: (e) => setKwChannels(e.target.value)
        }), t("gv.kwChannelsHint"))
      ),
      h(
        "div",
        { className: "qbot-gvFormActions" },
        btn("kwSave", t("gv.kwSave"), () => void saveKeywordConfig(), true)
      )
    ) : null,
    kwTab === "logs" ? h(
      "div",
      { className: "qbot-gvForm" },
      h(
        "div",
        { className: "qbot-gvFormHead" },
        h("strong", null, t("gv.kwLogsTitle")),
        btn("kwLogs", t("gv.kwLogsRefresh"), () => void reloadKeywordLogs())
      ),
      kwLogs.length ? h("div", { className: "qbot-gvAiLogs" }, kwLogs.map((l, i) => h(
        "div",
        { key: i, className: "qbot-gvAiLog" },
        h(
          "div",
          { className: "qbot-gvAiLogHead" },
          h("span", { className: "qbot-gvAiLevel is-severe" }, str(l.source)),
          h("span", null, `${str(l.senderName || str(l.sender).slice(0, 8))} · ${formatTime(str(l.at))}`)
        ),
        h("div", { className: "qbot-gvAiLogBody" }, str(l.content)),
        h(
          "div",
          { className: "qbot-gvAiLogMeta" },
          `${t("gv.kwMatched")}: ${(Array.isArray(l.matched) ? l.matched : []).join(",") || "—"} · ${t("gv.kwMuteMinutes")} ${num(l.muteMinutes)} [${(Array.isArray(l.actions) ? l.actions : []).join(",") || "—"}]` + (Array.isArray(l.errors) && l.errors.length ? ` · ${l.errors.join("; ")}` : "")
        )
      ))) : h("div", { className: "qbot-gvEmpty" }, t("gv.kwLogsEmpty"))
    ) : null
  );
  const speakPane = () => h(
    "div",
    { className: "qbot-gvPane" },
    paneHead(t("gv.tab.speak"), t("gv.speakDesc")),
    !guild ? needGuild : h(
      "div",
      { className: "qbot-gvStack" },
      h(
        "div",
        { className: "qbot-gvSubTabs", role: "tablist" },
        [
          { key: "all", label: t("gv.st.all") },
          { key: "member", label: t("gv.st.member") },
          { key: "frequency", label: t("gv.st.frequency") },
          { key: "keyword", label: t("gv.st.keyword") }
        ].map((x) => h("button", {
          key: x.key,
          type: "button",
          role: "tab",
          "aria-selected": speakTab === x.key,
          className: `qbot-gvSubTab${speakTab === x.key ? " is-on" : ""}`,
          onClick: () => setSpeakTab(x.key)
        }, x.label))
      ),
      speakTab === "all" ? h(
        "div",
        { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.muteAllTitle"))),
        field(t("gv.muteMinutes"), h("input", {
          className: "qbot-input qbot-gvInputShort",
          type: "number",
          min: "0",
          max: "43200",
          value: muteMinutes,
          onChange: (e) => setMuteMinutes(e.target.value)
        }), t("gv.muteMinutesHint")),
        h(
          "div",
          { className: "qbot-gvFormActions" },
          btn("muteAll", t("gv.muteAll"), () => void doMute("*", intOf(muteMinutes, 10))),
          btn("unmuteAll", t("gv.unmuteAll"), () => void doMute("*", 0))
        )
      ) : null,
      speakTab === "member" ? h(
        "div",
        { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.muteOneTitle"))),
        field(t("gv.muteUserId"), idInput({
          value: muteUserId,
          onChange: setMuteUserId,
          placeholder: t("gv.muteUserPlaceholder"),
          label: t("gv.muteUserId"),
          listId: "gv-mute-user-list",
          candidates: members.map((m) => {
            const u = m.user && typeof m.user === "object" ? m.user : {};
            return { value: str(u.id), label: str(u.username) || str(m.nick) || str(u.id) };
          }).filter((c) => !!c.value)
        }), t("gv.idPasteHint")),
        h(
          "div",
          { className: "qbot-gvFormActions" },
          btn("muteOne", t("gv.muteOne"), () => void doMute(muteUserId, intOf(muteMinutes, 10))),
          btn("unmuteOne", t("gv.unmuteOne"), () => void doMute(muteUserId, 0))
        )
      ) : null,
      speakTab === "frequency" ? h(
        "div",
        { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.settingTitle"))),
        h("small", { className: "qbot-gvFieldHint" }, t("gv.settingHint")),
        h("textarea", {
          className: "qbot-ptTextarea",
          rows: 8,
          value: msgSettingText,
          spellCheck: false,
          "aria-label": t("gv.settingTitle"),
          onChange: (e) => setMsgSettingText(e.target.value)
        }),
        h(
          "div",
          { className: "qbot-gvFormActions" },
          btn("settingSave", t("gv.settingSave"), () => void saveMsgSetting(), true)
        )
      ) : null,
      speakTab === "keyword" ? h(
        "div",
        { className: "qbot-gvForm qbot-gvKwCard" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.kwSectionTitle"))),
        h("small", { className: "qbot-gvFieldHint" }, t("gv.kwSectionDesc")),
        keywordPane()
      ) : null
    )
  );
  const CONTENT_TABS = [
    { key: "recall", label: t("gv.ct.recall") },
    { key: "announce", label: t("gv.ct.announce") },
    { key: "pin", label: t("gv.ct.pin") },
    { key: "schedule", label: t("gv.ct.schedule") },
    { key: "audio", label: t("gv.ct.audio") },
    { key: "forum", label: t("gv.ct.forum") }
  ];
  const subTabs = h(
    "div",
    { className: "qbot-gvSubTabs", role: "tablist" },
    CONTENT_TABS.map((x) => h("button", {
      key: x.key,
      type: "button",
      role: "tab",
      "aria-selected": contentTab === x.key,
      className: `qbot-gvSubTab${contentTab === x.key ? " is-on" : ""}`,
      onClick: () => {
        setContentTab(x.key);
        setContentResult(null);
      }
    }, x.label))
  );
  const jsonBox = h(
    "div",
    { className: "qbot-gvResult" },
    contentResult === null ? null : h("pre", null, JSON.stringify(contentResult, null, 2))
  );
  const recallForm = () => h(
    "div",
    { className: "qbot-gvForm" },
    field(t("gv.msgChannel"), h(
      "select",
      {
        className: "qbot-settingSelect",
        value: recallChannel || channelId,
        onChange: (e) => setRecallChannel(e.target.value)
      },
      h("option", { value: "" }, "—"),
      channels.map((c) => h("option", { key: c.id, value: c.id }, channelName(c)))
    )),
    field(t("gv.recallMessageId"), idInput({
      value: recallMessageId,
      onChange: setRecallMessageId,
      placeholder: t("gv.recallMessagePlaceholder"),
      label: t("gv.recallMessageId"),
      listId: "gv-recall-msg-list",
      candidates: []
    }), t("gv.recallMessageHint")),
    h(
      "label",
      { className: "qbot-gvCheck" },
      h("input", { type: "checkbox", checked: recallHideTip, onChange: (e) => setRecallHideTip(e.target.checked) }),
      t("gv.recallHideTip")
    ),
    h(
      "div",
      { className: "qbot-gvFormActions" },
      btn("recall", t("gv.recallDo"), () => void run("recall", async () => {
        const cid = recallChannel || channelId;
        if (!cid) {
          notifyError(t("gv.needChannel"));
          return;
        }
        if (!recallMessageId.trim()) {
          notifyError(t("gv.recallMessageId"));
          return;
        }
        await call("guild.message.delete", {
          channelId: cid,
          messageId: recallMessageId.trim(),
          hideTip: recallHideTip
        }, t("gv.recallDone"));
      }), true)
    )
  );
  const announceForm = () => h(
    "div",
    { className: "qbot-gvStack" },
    h(
      "div",
      { className: "qbot-gvForm qbot-gvTip" },
      h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.annHintTitle"))),
      h("p", null, t("gv.annHint"))
    ),
    h(
      "div",
      { className: "qbot-gvForm" },
      field(t("gv.announceChannel"), h(
        "select",
        {
          className: "qbot-settingSelect",
          value: announceChannel || channelId,
          onChange: (e) => setAnnounceChannel(e.target.value)
        },
        h("option", { value: "" }, "—"),
        channels.map((c) => h("option", { key: c.id, value: c.id }, channelName(c)))
      )),
      field(t("gv.recallMessageId"), h("input", {
        className: "qbot-input",
        value: announceMsgId,
        placeholder: t("gv.idPasteHint"),
        "aria-label": t("gv.recallMessageId"),
        onChange: (e) => setAnnounceMsgId(e.target.value)
      })),
      field(t("gv.announceType"), h(
        "select",
        {
          className: "qbot-settingSelect",
          value: announceType,
          onChange: (e) => setAnnounceType(e.target.value)
        },
        h("option", { value: "1" }, t("gv.announceTypeWelcome")),
        h("option", { value: "0" }, t("gv.announceTypeMember"))
      )),
      h(
        "div",
        { className: "qbot-gvFormActions" },
        btn("annCreate", t("gv.annCreate"), () => void run("annCreate", async () => {
          if (!announceMsgId.trim()) {
            notifyError(t("gv.recallMessageId"));
            return;
          }
          setContentResult(await call("guild.announce.create", {
            guildId: guild.id,
            body: { message_id: announceMsgId.trim(), channel_id: announceChannel || channelId, announces_type: intOf(announceType, 1) }
          }, t("gv.annCreated")));
        }), true),
        btn("annDel", t("gv.annDelete"), () => void run("annDel", async () => {
          if (!announceMsgId.trim()) {
            notifyError(t("gv.recallMessageId"));
            return;
          }
          setContentResult(await call("guild.announce.delete", { guildId: guild.id, messageId: announceMsgId.trim() }, t("gv.annDeleted")));
        }))
      )
    ),
    jsonBox
  );
  const pinCandidates = pinMessages.map((m) => ({
    value: m.id,
    label: `${String(m.content || "").replace(/\s+/g, " ").slice(0, 28) || "—"} · ${m.author || "—"} · ${m.id.slice(-8)}`
  }));
  const pinForm = () => h(
    "div",
    { className: "qbot-gvStack" },
    h("div", { className: "qbot-gvForm qbot-gvTip" }, h("p", null, t("gv.pinTip"))),
    h(
      "div",
      { className: "qbot-gvForm" },
      field(t("gv.msgChannel"), h(
        "select",
        {
          className: "qbot-settingSelect",
          value: channelId,
          onChange: (e) => {
            setChannelId(e.target.value);
            setPinMessages([]);
            setPinMessagesLoaded(false);
            setPinMsgId("");
          }
        },
        h("option", { value: "" }, "—"),
        channels.map((c) => h("option", { key: c.id, value: c.id }, channelName(c)))
      )),
      field(t("gv.pinMessageId"), idInput({
        value: pinMsgId,
        onChange: setPinMsgId,
        placeholder: t("gv.pinMsgPlaceholder"),
        label: t("gv.pinMessageId"),
        listId: "gv-pin-msg-list",
        candidates: pinCandidates
      }), t("gv.pinHint")),
      h(
        "div",
        { className: "qbot-gvFormActions" },
        btn("pinLoad", t("gv.pinLoad"), () => void run("pinLoad", async () => {
          if (!channelId) {
            notifyError(t("gv.needChannel"));
            return;
          }
          const list = await call("guild.message.list", { channelId, limit: 50 });
          const rows = (Array.isArray(list) ? list : []).filter((m) => m && typeof m === "object" && m.id);
          setPinMessages(rows);
          setPinMessagesLoaded(true);
        })),
        btn("pinList", t("gv.pinList"), () => void run("pinList", async () => {
          if (!channelId) {
            notifyError(t("gv.needChannel"));
            return;
          }
          setContentResult(await call("guild.pin.list", { channelId }));
        })),
        btn("pinAdd", t("gv.pinAdd"), () => void run("pinAdd", async () => {
          if (!channelId || !pinMsgId.trim()) {
            notifyError(t("gv.pinMessageId"));
            return;
          }
          if (pinMsgId.trim() === channelId) {
            notifyError(t("gv.errBadMsgId"));
            return;
          }
          setContentResult(await call("guild.pin.add", { channelId, messageId: pinMsgId.trim() }, t("gv.pinAdded")));
        }), true),
        btn("pinDel", t("gv.pinDelete"), () => void run("pinDel", async () => {
          if (!channelId || !pinMsgId.trim()) {
            notifyError(t("gv.pinMessageId"));
            return;
          }
          if (pinMsgId.trim() === channelId) {
            notifyError(t("gv.errBadMsgId"));
            return;
          }
          setContentResult(await call("guild.pin.delete", { channelId, messageId: pinMsgId.trim() }, t("gv.pinDeleted")));
        }))
      ),
      // 查询结果内联展示，不弹吸顶提示。
      pinMessagesLoaded ? h(
        "div",
        { className: "qbot-gvFieldHint" },
        pinMessages.length ? fmt("gv.pinLoaded", pinMessages.length) : t("gv.pinLoadEmpty")
      ) : null
    ),
    jsonBox
  );
  const scheduleForm = () => h(
    "div",
    { className: "qbot-gvStack" },
    h(
      "div",
      { className: "qbot-gvForm" },
      field(t("gv.msgChannel"), h(
        "select",
        {
          className: "qbot-settingSelect",
          value: channelId,
          onChange: (e) => setChannelId(e.target.value)
        },
        h("option", { value: "" }, "—"),
        channels.map((c) => h("option", { key: c.id, value: c.id }, channelName(c)))
      )),
      field(t("gv.scheduleId"), h("input", {
        className: "qbot-input qbot-mono",
        value: scheduleId,
        placeholder: t("gv.scheduleIdPlaceholder"),
        "aria-label": t("gv.scheduleId"),
        onChange: (e) => setScheduleId(e.target.value)
      })),
      field(t("gv.scheduleBody"), h("textarea", {
        className: "qbot-ptTextarea qbot-mono",
        rows: 8,
        value: scheduleBody,
        "aria-label": t("gv.scheduleBody"),
        onChange: (e) => setScheduleBody(e.target.value)
      }), t("gv.scheduleHint")),
      h(
        "div",
        { className: "qbot-gvFormActions" },
        btn("schReset", t("gv.schReset"), () => {
          setScheduleBody(defaultScheduleBody());
          notifySuccess(t("gv.schResetDone"));
        }),
        btn("schList", t("gv.schList"), () => void run("schList", async () => {
          if (!channelId) {
            notifyError(t("gv.needChannel"));
            return;
          }
          setContentResult(await call("guild.schedule.list", { channelId }));
        })),
        btn("schGet", t("gv.schGet"), () => void run("schGet", async () => {
          if (!channelId || !scheduleId.trim()) {
            notifyError(t("gv.scheduleId"));
            return;
          }
          setContentResult(await call("guild.schedule.get", { channelId, scheduleId: scheduleId.trim() }));
        })),
        btn("schCreate", t("gv.schCreate"), () => void run("schCreate", async () => {
          if (!channelId) {
            notifyError(t("gv.needChannel"));
            return;
          }
          let body2;
          try {
            body2 = JSON.parse(scheduleBody);
          } catch {
            notifyError(t("gv.invalidJson"));
            return;
          }
          const err = checkScheduleBody(body2);
          if (err) {
            notifyError(t(err));
            return;
          }
          setContentResult(await call("guild.schedule.create", { channelId, body: body2 }, t("gv.schCreated")));
        }), true),
        btn("schPatch", t("gv.schPatch"), () => void run("schPatch", async () => {
          if (!channelId || !scheduleId.trim()) {
            notifyError(t("gv.scheduleId"));
            return;
          }
          let body2;
          try {
            body2 = JSON.parse(scheduleBody);
          } catch {
            notifyError(t("gv.invalidJson"));
            return;
          }
          const err = checkScheduleBody(body2);
          if (err) {
            notifyError(t(err));
            return;
          }
          setContentResult(await call("guild.schedule.patch", { channelId, scheduleId: scheduleId.trim(), body: body2 }, t("gv.schPatched")));
        })),
        btn("schDel", t("gv.schDelete"), () => void run("schDel", async () => {
          if (!channelId || !scheduleId.trim()) {
            notifyError(t("gv.scheduleId"));
            return;
          }
          setContentResult(await call("guild.schedule.delete", { channelId, scheduleId: scheduleId.trim() }, t("gv.schDeleted")));
        }))
      )
    ),
    jsonBox
  );
  const audioForm = () => h(
    "div",
    { className: "qbot-gvStack" },
    h(
      "div",
      { className: "qbot-gvForm" },
      field(t("gv.msgChannel"), h(
        "select",
        {
          className: "qbot-settingSelect",
          value: channelId,
          onChange: (e) => setChannelId(e.target.value)
        },
        h("option", { value: "" }, "—"),
        channels.filter((c) => c.type === 2 || c.type === 10005).map((c) => h("option", { key: c.id, value: c.id }, channelName(c)))
      )),
      field(t("gv.audioBody"), h("textarea", {
        className: "qbot-ptTextarea",
        rows: 6,
        value: audioBody,
        "aria-label": t("gv.audioBody"),
        onChange: (e) => setAudioBody(e.target.value)
      }), t("gv.audioHint")),
      h(
        "div",
        { className: "qbot-gvFormActions" },
        btn("audioDo", t("gv.audioDo"), () => void run("audioDo", async () => {
          if (!channelId) {
            notifyError(t("gv.needChannel"));
            return;
          }
          let body2;
          try {
            body2 = JSON.parse(audioBody);
          } catch {
            notifyError(t("gv.invalidJson"));
            return;
          }
          setContentResult(await call("guild.audio", { channelId, body: body2 }, t("gv.audioDone")));
        }), true)
      )
    ),
    jsonBox
  );
  const forumForm = () => h(
    "div",
    { className: "qbot-gvStack" },
    h("div", { className: "qbot-gvForm qbot-gvTip" }, h("p", null, t("gv.forumTip"))),
    h(
      "div",
      { className: "qbot-gvForm" },
      field(t("gv.msgChannel"), h(
        "select",
        {
          className: "qbot-settingSelect",
          value: channelId,
          onChange: (e) => setChannelId(e.target.value)
        },
        h("option", { value: "" }, "—"),
        channels.filter((c) => c.type === 10007).map((c) => h("option", { key: c.id, value: c.id }, channelName(c)))
      )),
      field(t("gv.forumThreadId"), h("input", {
        className: "qbot-input qbot-mono",
        value: forumThreadId,
        placeholder: t("gv.forumThreadIdPlaceholder"),
        "aria-label": t("gv.forumThreadId"),
        onChange: (e) => setForumThreadId(e.target.value)
      })),
      field(t("gv.forumBody"), h("textarea", {
        className: "qbot-ptTextarea",
        rows: 6,
        value: forumBody,
        "aria-label": t("gv.forumBody"),
        onChange: (e) => setForumBody(e.target.value)
      })),
      h(
        "div",
        { className: "qbot-gvFormActions" },
        btn("forumList", t("gv.forumList"), () => void run("forumList", async () => {
          if (!channelId) {
            notifyError(t("gv.needChannel"));
            return;
          }
          setContentResult(await call("guild.forum.threads", { channelId }));
        })),
        btn("forumGet", t("gv.forumGet"), () => void run("forumGet", async () => {
          if (!channelId || !forumThreadId.trim()) {
            notifyError(t("gv.forumThreadId"));
            return;
          }
          setContentResult(await call("guild.forum.thread.get", { channelId, threadId: forumThreadId.trim() }));
        })),
        btn("forumCreate", t("gv.forumCreate"), () => void run("forumCreate", async () => {
          if (!channelId) {
            notifyError(t("gv.needChannel"));
            return;
          }
          let body2;
          try {
            body2 = JSON.parse(forumBody);
          } catch {
            notifyError(t("gv.invalidJson"));
            return;
          }
          setContentResult(await call("guild.forum.thread.create", { channelId, body: body2 }, t("gv.forumCreated")));
        }), true),
        btn("forumDel", t("gv.forumDelete"), () => void run("forumDel", async () => {
          if (!channelId || !forumThreadId.trim()) {
            notifyError(t("gv.forumThreadId"));
            return;
          }
          setContentResult(await call("guild.forum.thread.delete", { channelId, threadId: forumThreadId.trim() }, t("gv.forumDeleted")));
        }))
      )
    ),
    jsonBox
  );
  const contentPane = () => h(
    "div",
    { className: "qbot-gvPane" },
    paneHead(t("gv.tab.content"), t("gv.contentDesc")),
    !guild ? needGuild : h(
      React13.Fragment,
      null,
      subTabs,
      contentTab === "recall" ? recallForm() : null,
      contentTab === "announce" ? announceForm() : null,
      contentTab === "pin" ? pinForm() : null,
      contentTab === "schedule" ? scheduleForm() : null,
      contentTab === "audio" ? audioForm() : null,
      contentTab === "forum" ? forumForm() : null
    )
  );
  const lines = (v) => v.split("\n").map((s) => s.trim()).filter(Boolean);
  const saveAiConfig = async () => {
    if (!guild) return;
    await run("aiSave", async () => {
      const config = {
        enabled: aiEnabled,
        actions: { mute: aiMute, recall: aiRecall, warn: aiWarn },
        durations: { light: intOf(aiDurLight, 10), medium: intOf(aiDurMedium, 1440), severe: intOf(aiDurSevere, 43200) },
        rules: lines(aiRules),
        whitelist: lines(aiWhitelist),
        channelIds: lines(aiChannels)
      };
      await call("guild.mod.config.save", { guildId: guild.id, config }, t("gv.aiSaved"));
    });
  };
  const saveReplyConfig = async () => {
    if (!guild) return;
    await run("replySave", async () => {
      const config = {
        enabled: replyEnabled,
        onPost: replyOnPost,
        onMention: replyOnMention,
        once: replyOnce,
        prompt: replyPrompt,
        whitelist: lines(replyWhitelist),
        channelIds: lines(replyChannels)
      };
      await call("guild.reply.config.save", { guildId: guild.id, config }, t("gv.replySaved"));
      await call("config.save", { guildMessageEvents: replyGuildMessages, forumEvents: replyForumEvents });
    });
  };
  const aiPane = () => h(
    "div",
    { className: "qbot-gvPane" },
    paneHead(t("gv.tab.ai"), t("gv.aiDesc")),
    !guild ? needGuild : h(
      React13.Fragment,
      null,
      h(
        "div",
        { className: "qbot-gvSubTabs", role: "tablist" },
        h("button", {
          type: "button",
          role: "tab",
          "aria-selected": aiTab === "config",
          className: `qbot-gvSubTab${aiTab === "config" ? " is-on" : ""}`,
          onClick: () => setAiTab("config")
        }, t("gv.aiSubConfig")),
        h("button", {
          type: "button",
          role: "tab",
          "aria-selected": aiTab === "logs",
          className: `qbot-gvSubTab${aiTab === "logs" ? " is-on" : ""}`,
          onClick: () => setAiTab("logs")
        }, t("gv.aiSubLogs")),
        h("button", {
          type: "button",
          role: "tab",
          "aria-selected": aiTab === "reply",
          className: `qbot-gvSubTab${aiTab === "reply" ? " is-on" : ""}`,
          onClick: () => setAiTab("reply")
        }, t("gv.aiSubReply")),
        h("button", {
          type: "button",
          role: "tab",
          "aria-selected": aiTab === "replyLogs",
          className: `qbot-gvSubTab${aiTab === "replyLogs" ? " is-on" : ""}`,
          onClick: () => setAiTab("replyLogs")
        }, t("gv.replyLogsTitle"))
      ),
      aiTab === "config" ? h(
        "div",
        { className: "qbot-gvStack" },
        h(
          "div",
          { className: "qbot-gvForm" },
          h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.aiEnableTitle"))),
          h(
            "label",
            { className: "qbot-gvCheck" },
            h("input", { type: "checkbox", checked: aiEnabled, onChange: (e) => setAiEnabled(e.target.checked) }),
            t("gv.aiEnable")
          ),
          h("small", { className: "qbot-gvFieldHint" }, t("gv.aiEnableHint"))
        ),
        h(
          "div",
          { className: "qbot-gvForm" },
          h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.aiActionTitle"))),
          h(
            "label",
            { className: "qbot-gvCheck" },
            h("input", { type: "checkbox", checked: aiMute, onChange: (e) => setAiMute(e.target.checked) }),
            t("gv.aiActMute")
          ),
          h(
            "label",
            { className: "qbot-gvCheck" },
            h("input", { type: "checkbox", checked: aiRecall, onChange: (e) => setAiRecall(e.target.checked) }),
            t("gv.aiActRecall")
          ),
          h(
            "label",
            { className: "qbot-gvCheck" },
            h("input", { type: "checkbox", checked: aiWarn, onChange: (e) => setAiWarn(e.target.checked) }),
            t("gv.aiActWarn")
          ),
          h("small", { className: "qbot-gvFieldHint" }, t("gv.aiActionHint"))
        ),
        h(
          "div",
          { className: "qbot-gvForm" },
          h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.aiDurationTitle"))),
          h(
            "div",
            { className: "qbot-gvFormRow" },
            field(t("gv.aiDurLight"), h("input", { className: "qbot-input", type: "number", min: "1", max: "43200", value: aiDurLight, onChange: (e) => setAiDurLight(e.target.value) })),
            field(t("gv.aiDurMedium"), h("input", { className: "qbot-input", type: "number", min: "1", max: "43200", value: aiDurMedium, onChange: (e) => setAiDurMedium(e.target.value) })),
            field(t("gv.aiDurSevere"), h("input", { className: "qbot-input", type: "number", min: "1", max: "43200", value: aiDurSevere, onChange: (e) => setAiDurSevere(e.target.value) }))
          ),
          h("small", { className: "qbot-gvFieldHint" }, t("gv.aiDurationHint"))
        ),
        h(
          "div",
          { className: "qbot-gvForm" },
          h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.aiRulesTitle"))),
          h("textarea", {
            className: "qbot-ptTextarea",
            rows: 5,
            value: aiRules,
            placeholder: t("gv.aiRulesPlaceholder"),
            "aria-label": t("gv.aiRulesTitle"),
            onChange: (e) => setAiRules(e.target.value)
          }),
          h("small", { className: "qbot-gvFieldHint" }, t("gv.aiRulesHint"))
        ),
        h(
          "div",
          { className: "qbot-gvForm" },
          h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.aiScopeTitle"))),
          field(t("gv.aiWhitelist"), h("textarea", {
            className: "qbot-ptTextarea",
            rows: 3,
            value: aiWhitelist,
            placeholder: t("gv.aiWhitelistPlaceholder"),
            "aria-label": t("gv.aiWhitelist"),
            onChange: (e) => setAiWhitelist(e.target.value)
          }), t("gv.aiWhitelistHint")),
          field(t("gv.aiChannels"), h("textarea", {
            className: "qbot-ptTextarea",
            rows: 3,
            value: aiChannels,
            placeholder: t("gv.aiChannelsPlaceholder"),
            "aria-label": t("gv.aiChannels"),
            onChange: (e) => setAiChannels(e.target.value)
          }), t("gv.aiChannelsHint"))
        ),
        h(
          "div",
          { className: "qbot-gvFormActions" },
          btn("aiSave", t("gv.aiSave"), () => void saveAiConfig(), true)
        )
      ) : null,
      aiTab === "logs" ? h(
        "div",
        { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.aiLogsTitle"))),
        aiLogs.length ? h("div", { className: "qbot-gvAiLogs" }, aiLogs.map((l, i) => h(
          "div",
          { key: i, className: "qbot-gvAiLog" },
          h(
            "div",
            { className: "qbot-gvAiLogHead" },
            h("span", { className: `qbot-gvAiLevel is-${str(l.level)}` }, str(l.level)),
            h("span", null, `${str(l.senderName || str(l.sender).slice(0, 8))} · ${formatTime(str(l.at))}`)
          ),
          h("div", { className: "qbot-gvAiLogBody" }, str(l.content)),
          h(
            "div",
            { className: "qbot-gvAiLogMeta" },
            `${str(l.category)} · ${t("gv.aiLogMinutes")} ${num(l.minutes)} · ${t("gv.aiLogStrike")} ${num(l.strikeCount)}`,
            ` [${(Array.isArray(l.actions) ? l.actions : []).join(",") || "—"}]`,
            l.reason ? ` · ${str(l.reason)}` : ""
          )
        ))) : h("div", { className: "qbot-gvEmpty" }, t("gv.aiLogsEmpty"))
      ) : null,
      aiTab === "reply" ? h(
        "div",
        { className: "qbot-gvStack" },
        h(
          "div",
          { className: "qbot-gvForm" },
          h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.replyEnableTitle"))),
          h(
            "label",
            { className: "qbot-gvCheck" },
            h("input", { type: "checkbox", checked: replyEnabled, onChange: (e) => setReplyEnabled(e.target.checked) }),
            t("gv.replyEnable")
          ),
          h("small", { className: "qbot-gvFieldHint" }, t("gv.replyEnableHint"))
        ),
        h(
          "div",
          { className: "qbot-gvForm" },
          h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.replyTriggers"))),
          h(
            "label",
            { className: "qbot-gvCheck" },
            h("input", { type: "checkbox", checked: replyOnPost, onChange: (e) => setReplyOnPost(e.target.checked) }),
            t("gv.replyOnPost")
          ),
          h(
            "label",
            { className: "qbot-gvCheck" },
            h("input", { type: "checkbox", checked: replyOnMention, onChange: (e) => setReplyOnMention(e.target.checked) }),
            t("gv.replyOnMention")
          ),
          h(
            "label",
            { className: "qbot-gvCheck" },
            h("input", { type: "checkbox", checked: replyOnce, onChange: (e) => setReplyOnce(e.target.checked) }),
            t("gv.replyOnce")
          ),
          h("small", { className: "qbot-gvFieldHint" }, t("gv.replyTriggerHint"))
        ),
        h(
          "div",
          { className: "qbot-gvForm" },
          h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.replyPrompt"))),
          h("textarea", {
            className: "qbot-ptTextarea",
            rows: 4,
            value: replyPrompt,
            placeholder: t("gv.replyPromptPlaceholder"),
            "aria-label": t("gv.replyPrompt"),
            onChange: (e) => setReplyPrompt(e.target.value)
          }),
          h("small", { className: "qbot-gvFieldHint" }, t("gv.replyPromptHint"))
        ),
        h(
          "div",
          { className: "qbot-gvForm" },
          h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.replyScopeTitle"))),
          field(t("gv.replyWhitelist"), h("textarea", {
            className: "qbot-ptTextarea",
            rows: 3,
            value: replyWhitelist,
            placeholder: t("gv.replyWhitelistPlaceholder"),
            "aria-label": t("gv.replyWhitelist"),
            onChange: (e) => setReplyWhitelist(e.target.value)
          })),
          field(t("gv.replyChannels"), h("textarea", {
            className: "qbot-ptTextarea",
            rows: 3,
            value: replyChannels,
            placeholder: t("gv.replyChannelsPlaceholder"),
            "aria-label": t("gv.replyChannels"),
            onChange: (e) => setReplyChannels(e.target.value)
          })),
          h("small", { className: "qbot-gvFieldHint" }, t("gv.replyScopeHint"))
        ),
        h(
          "div",
          { className: "qbot-gvForm" },
          h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.replyIntents"))),
          h(
            "label",
            { className: "qbot-gvCheck" },
            h("input", { type: "checkbox", checked: replyGuildMessages, onChange: (e) => setReplyGuildMessages(e.target.checked) }),
            t("gv.replyGuildMessages")
          ),
          h(
            "label",
            { className: "qbot-gvCheck" },
            h("input", { type: "checkbox", checked: replyForumEvents, onChange: (e) => setReplyForumEvents(e.target.checked) }),
            t("gv.replyForumEvents")
          ),
          h("small", { className: "qbot-gvFieldHint" }, t("gv.replyIntentsHint")),
          h("a", {
            className: "qbot-gvSetupLink",
            href: "https://q.qq.com/qqbot/",
            target: "_blank",
            rel: "noreferrer noopener"
          }, t("gv.replyIntentsLink"))
        ),
        h(
          "div",
          { className: "qbot-gvFormActions" },
          btn("replySave", t("gv.replySave"), () => void saveReplyConfig(), true)
        )
      ) : null,
      aiTab === "replyLogs" ? h(
        "div",
        { className: "qbot-gvForm" },
        h("div", { className: "qbot-gvFormHead" }, h("strong", null, t("gv.replyLogsTitle"))),
        replyLogs.length ? h("div", { className: "qbot-gvAiLogs" }, replyLogs.map((l, i) => h(
          "div",
          { key: i, className: "qbot-gvAiLog" },
          h(
            "div",
            { className: "qbot-gvAiLogHead" },
            h(
              "span",
              { className: `qbot-gvAiLevel is-${l.ok ? "light" : "severe"}` },
              l.ok ? t("gv.replyLogOk") : t("gv.replyLogFail")
            ),
            h("span", null, `${str(l.senderName || str(l.sender).slice(0, 8))} · ${formatTime(str(l.at))}`)
          ),
          h("div", { className: "qbot-gvAiLogBody" }, str(l.reply || l.content)),
          h(
            "div",
            { className: "qbot-gvAiLogMeta" },
            `${str(l.trigger === "mention" ? t("gv.replyOnMention") : t("gv.replyOnPost"))} · ${str(l.source)}`,
            l.error ? ` · ${str(l.error)}` : ""
          )
        ))) : h("div", { className: "qbot-gvEmpty" }, t("gv.replyLogsEmpty"))
      ) : null
    )
  );
  const EVENTS = [
    { key: "guild_create", label: t("gv.evtGuildCreate"), fields: ["id", "name", "owner_id", "member_count", "joined_at"] },
    { key: "guild_update", label: t("gv.evtGuildUpdate"), fields: ["id", "name", "owner_id", "member_count"] },
    { key: "guild_delete", label: t("gv.evtGuildDelete"), fields: ["id", "op_user_id"] },
    { key: "channel_create", label: t("gv.evtChannelCreate"), fields: ["id", "guild_id", "name", "type"] },
    { key: "channel_update", label: t("gv.evtChannelUpdate"), fields: ["id", "guild_id", "name", "type"] },
    { key: "channel_delete", label: t("gv.evtChannelDelete"), fields: ["id", "guild_id", "op_user_id"] }
  ];
  const fieldLabels2 = {
    id: t("gv.evtFieldId"),
    guild_id: t("gv.evtFieldId"),
    name: t("gv.evtFieldName"),
    owner_id: t("gv.evtFieldOwner"),
    op_user_id: t("gv.evtFieldOwner"),
    member_count: t("gv.evtFieldCount"),
    joined_at: t("gv.evtFieldTime"),
    type: t("gv.chType")
  };
  const API_GROUPS = [
    {
      titleKey: "gv.docGroup.guild",
      items: [
        { method: "GET", path: "/users/@me/guilds", descKey: "gv.doc.guilds" },
        { method: "GET", path: "/guilds/{guild_id}", descKey: "gv.doc.guildGet" },
        { method: "GET", path: "/guilds/{guild_id}/channels", descKey: "gv.doc.channels" },
        { method: "GET", path: "/channels/{channel_id}", descKey: "gv.doc.channelGet" },
        { method: "POST", path: "/guilds/{guild_id}/channels", descKey: "gv.doc.channelCreate", notes: ["gv.docNote.admin"] },
        { method: "PATCH", path: "/channels/{channel_id}", descKey: "gv.doc.channelPatch", notes: ["gv.docNote.admin"] },
        { method: "DELETE", path: "/channels/{channel_id}", descKey: "gv.doc.channelDelete", notes: ["gv.docNote.admin"] },
        { method: "GET", path: "/channels/{channel_id}/online_nums", descKey: "gv.doc.channelOnline" }
      ]
    },
    {
      titleKey: "gv.docGroup.member",
      items: [
        { method: "GET", path: "/guilds/{guild_id}/members", descKey: "gv.doc.memberList", notes: ["gv.docNote.private"] },
        { method: "GET", path: "/guilds/{guild_id}/members/{user_id}", descKey: "gv.doc.memberGet", notes: ["gv.docNote.private"] },
        { method: "DELETE", path: "/guilds/{guild_id}/members/{user_id}", descKey: "gv.doc.memberDelete", notes: ["gv.docNote.admin"] },
        { method: "PATCH", path: "/guilds/{guild_id}/mute", descKey: "gv.doc.muteAll", notes: ["gv.docNote.admin"] },
        { method: "PATCH", path: "/guilds/{guild_id}/members/{user_id}/mute", descKey: "gv.doc.muteMember", notes: ["gv.docNote.admin"] },
        { method: "GET", path: "/guilds/{guild_id}/members/{user_id}/roles", descKey: "gv.doc.memberRoles" },
        { method: "PUT", path: "/guilds/{guild_id}/members/{user_id}/roles/{role_id}", descKey: "gv.doc.memberRolePut", notes: ["gv.docNote.admin", "gv.docNote.memberRole"] },
        { method: "DELETE", path: "/guilds/{guild_id}/members/{user_id}/roles/{role_id}", descKey: "gv.doc.memberRoleDelete", notes: ["gv.docNote.admin", "gv.docNote.memberRole"] },
        { method: "GET", path: "/guilds/{guild_id}/roles/{role_id}/members", descKey: "gv.doc.roleMembers", notes: ["gv.docNote.privateShort"] }
      ]
    },
    {
      titleKey: "gv.docGroup.role",
      items: [
        { method: "GET", path: "/guilds/{guild_id}/roles", descKey: "gv.doc.roles" },
        { method: "POST", path: "/guilds/{guild_id}/roles", descKey: "gv.doc.roleCreate", notes: ["gv.docNote.admin"] },
        { method: "PATCH", path: "/guilds/{guild_id}/roles/{role_id}", descKey: "gv.doc.rolePatch", notes: ["gv.docNote.admin"] },
        { method: "DELETE", path: "/guilds/{guild_id}/roles/{role_id}", descKey: "gv.doc.roleDelete", notes: ["gv.docNote.admin", "gv.docNote.builtin"] },
        { method: "GET", path: "/channels/{channel_id}/roles/{role_id}", descKey: "gv.doc.channelRoleGet" },
        { method: "PATCH", path: "/channels/{channel_id}/roles/{role_id}", descKey: "gv.doc.channelRolePatch", notes: ["gv.docNote.admin"] }
      ]
    },
    {
      titleKey: "gv.docGroup.message",
      items: [
        { method: "POST", path: "/channels/{channel_id}/messages", descKey: "gv.doc.messageSend", notes: ["gv.docNote.quota"] },
        { method: "GET", path: "/channels/{channel_id}/messages", descKey: "gv.doc.messageList", notes: ["gv.docNote.msgId"] },
        { method: "DELETE", path: "/channels/{channel_id}/messages/{message_id}", descKey: "gv.doc.messageDelete", notes: ["gv.docNote.admin", "gv.docNote.msgId"] },
        { method: "GET", path: "/guilds/{guild_id}/message/setting", descKey: "gv.doc.msgSettingGet" },
        { method: "PUT", path: "/guilds/{guild_id}/message/setting", descKey: "gv.doc.msgSettingPut", notes: ["gv.docNote.admin"] }
      ]
    },
    {
      titleKey: "gv.docGroup.content",
      items: [
        { method: "GET", path: "/guilds/{guild_id}/announces", descKey: "gv.doc.announceList", notes: ["gv.docNote.noAnnounceList"] },
        { method: "POST", path: "/guilds/{guild_id}/announces", descKey: "gv.doc.announceCreate", notes: ["gv.docNote.admin", "gv.docNote.msgId"] },
        { method: "DELETE", path: "/guilds/{guild_id}/announces/{message_id}", descKey: "gv.doc.announceDelete", notes: ["gv.docNote.admin"] },
        { method: "GET", path: "/channels/{channel_id}/pins", descKey: "gv.doc.pins" },
        { method: "PUT", path: "/channels/{channel_id}/pins/{message_id}", descKey: "gv.doc.pinAdd", notes: ["gv.docNote.admin", "gv.docNote.msgId", "gv.docNote.pin"] },
        { method: "DELETE", path: "/channels/{channel_id}/pins/{message_id}", descKey: "gv.doc.pinDelete", notes: ["gv.docNote.admin", "gv.docNote.msgId"] },
        { method: "GET", path: "/channels/{channel_id}/schedules", descKey: "gv.doc.schedules" },
        { method: "GET", path: "/channels/{channel_id}/schedules/{schedule_id}", descKey: "gv.doc.scheduleGet" },
        { method: "POST", path: "/channels/{channel_id}/schedules", descKey: "gv.doc.scheduleCreate", notes: ["gv.docNote.admin", "gv.docNote.schedule"] },
        { method: "PATCH", path: "/channels/{channel_id}/schedules/{schedule_id}", descKey: "gv.doc.schedulePatch", notes: ["gv.docNote.admin", "gv.docNote.schedule"] },
        { method: "DELETE", path: "/channels/{channel_id}/schedules/{schedule_id}", descKey: "gv.doc.scheduleDelete", notes: ["gv.docNote.admin"] },
        { method: "POST", path: "/channels/{channel_id}/audio", descKey: "gv.doc.audio" },
        { method: "GET", path: "/channels/{channel_id}/threads", descKey: "gv.doc.threads", notes: ["gv.docNote.forum"] },
        { method: "GET", path: "/channels/{channel_id}/threads/{thread_id}", descKey: "gv.doc.threadGet", notes: ["gv.docNote.forum"] },
        { method: "PUT", path: "/channels/{channel_id}/threads", descKey: "gv.doc.threadCreate", notes: ["gv.docNote.forum"] },
        { method: "DELETE", path: "/channels/{channel_id}/threads/{thread_id}", descKey: "gv.doc.threadDelete", notes: ["gv.docNote.forum"] }
      ]
    },
    {
      titleKey: "gv.docGroup.permission",
      items: [
        { method: "GET", path: "/channels/{channel_id}/permissions", descKey: "gv.doc.channelPermGet" },
        { method: "PUT", path: "/channels/{channel_id}/permissions/all", descKey: "gv.doc.channelPermAll", notes: ["gv.docNote.admin"] },
        { method: "GET", path: "/guilds/{guild_id}/api_permission", descKey: "gv.doc.apiPermGet" },
        { method: "POST", path: "/guilds/{guild_id}/api_permission", descKey: "gv.doc.apiPermPost" }
      ]
    }
  ];
  const eventsPane = () => h(
    "div",
    { className: "qbot-gvPane" },
    paneHead(t("gv.tab.events"), t("gv.evtDesc")),
    h("div", { className: "qbot-gvDocIntro" }, t("gv.docIntro")),
    h("div", { className: "qbot-gvDocGroups" }, API_GROUPS.map((g) => h(
      "section",
      { key: g.titleKey, className: "qbot-gvDocGroup" },
      h(
        "div",
        { className: "qbot-gvDocGroupHead" },
        h("strong", null, t(g.titleKey)),
        h("span", null, String(g.items.length))
      ),
      h("div", { className: "qbot-gvDocGrid" }, g.items.map((item) => h(
        "div",
        { key: `${item.method} ${item.path}`, className: "qbot-gvDocCard" },
        h(
          "div",
          { className: "qbot-gvDocCardTop" },
          h("span", { className: `qbot-gvDocMethod is-${item.method.toLowerCase()}` }, item.method),
          h("code", { className: "qbot-gvDocPath" }, item.path)
        ),
        h("div", { className: "qbot-gvDocDesc" }, t(item.descKey)),
        item.notes?.length ? h("div", { className: "qbot-gvDocNotes" }, item.notes.map((note) => h("span", { key: note, className: "qbot-gvDocNote" }, t(note)))) : null
      )))
    ))),
    h("div", { className: "qbot-gvDocSectionTitle" }, t("gv.docEventTitle")),
    h("div", { className: "qbot-gvEventGrid" }, EVENTS.map((e) => h(
      "div",
      { key: e.key, className: "qbot-gvEventCard" },
      h("strong", null, e.label),
      h("code", null, e.key.toUpperCase()),
      h(
        "div",
        { className: "qbot-gvEventFields" },
        h("span", { className: "qbot-gvEventLabel" }, t("gv.evtFields")),
        e.fields.map((f) => h("span", { key: f, className: "qbot-gvEventField" }, fieldLabels2[f] || f))
      )
    )))
  );
  const apiPermPane = () => {
    const all = Array.isArray(apiPermResult?.apis) ? apiPermResult.apis : [];
    const isOk = (row) => Number(row.auth_status) === 1;
    const okCount = all.filter(isOk).length;
    const rows = apiPermOnlyUnauth ? all.filter((row) => !isOk(row)) : all;
    return h(
      "div",
      { className: "qbot-gvPane" },
      paneHead(t("gv.tab.apiPerm"), t("gv.apiPermDesc")),
      !guild ? needGuild : h(
        "div",
        { className: "qbot-gvStack" },
        h(
          "div",
          { className: "qbot-gvForm" },
          h("small", { className: "qbot-gvFieldHint" }, t("gv.apiPermHint")),
          h(
            "div",
            { className: "qbot-gvFormActions" },
            btn("apiPermGet", t("gv.apiPermGet"), () => void run("apiPermGet", async () => {
              setApiPermResult(await call("guild.apiPerm.get", { guildId: guild.id }));
            }), true)
          )
        ),
        apiPermResult === null ? null : h(
          "div",
          { className: "qbot-gvStack" },
          h(
            "div",
            { className: "qbot-gvPermBar" },
            h("span", null, fmt("gv.apiPermCount", all.length, okCount, all.length - okCount)),
            h(
              "label",
              { className: "qbot-gvCheck" },
              h("input", {
                type: "checkbox",
                checked: apiPermOnlyUnauth,
                onChange: (e) => setApiPermOnlyUnauth(e.target.checked)
              }),
              t("gv.apiPermOnlyUnauth")
            )
          ),
          rows.length ? h(
            "div",
            { className: "qbot-gvPermTable" },
            h(
              "div",
              { className: "qbot-gvPermHead" },
              h("span", null, t("gv.apiPermColMethod")),
              h("span", null, t("gv.apiPermColPath")),
              h("span", null, t("gv.apiPermColDesc")),
              h("span", null, t("gv.apiPermColState"))
            ),
            rows.map((row, i) => {
              const method = str(row.method).toUpperCase();
              const granted = isOk(row);
              return h(
                "div",
                { key: `${method}-${str(row.path)}-${i}`, className: "qbot-gvPermRow" },
                method ? h("span", { className: `qbot-gvDocMethod is-${method.toLowerCase()}` }, method) : h("span", null, "—"),
                h("code", { className: "qbot-gvPermPath" }, str(row.path) || "—"),
                h("span", { className: "qbot-gvPermDesc" }, str(row.desc) || "—"),
                h("span", {
                  className: `qbot-gvPermState is-${granted ? "ok" : "no"}`,
                  title: `auth_status=${str(row.auth_status)}`
                }, granted ? t("gv.apiPermStateOk") : t("gv.apiPermStateNo"))
              );
            })
          ) : h("div", { className: "qbot-gvEmpty" }, t("gv.apiPermEmpty")),
          h(
            "details",
            { className: "qbot-gvPermRaw" },
            h("summary", null, t("gv.apiPermRaw")),
            h("pre", null, JSON.stringify(apiPermResult, null, 2))
          )
        )
      )
    );
  };
  const assistantPane = () => h(
    "div",
    { className: "qbot-gvPane" },
    h(AiChatPanel, {
      key: guild?.id || "noguild",
      rpcCall,
      appId,
      scope: "guild",
      guildId: guild?.id || "",
      channelId: channelId || messageChannel || recallChannel || ""
    })
  );
  const panes = {
    guilds: guildsPane,
    info: infoPane,
    channels: channelsPane,
    members: membersPane,
    roles: rolesPane,
    message: messagePane,
    speak: speakPane,
    content: contentPane,
    ai: aiPane,
    apiPerm: apiPermPane,
    events: eventsPane,
    assistant: assistantPane
  };
  const subDialog = (title, body2, onClose) => h(
    "div",
    { className: "qbot-gvSubOverlay" },
    h(
      "div",
      { className: "qbot-gvSubModal", role: "dialog", "aria-modal": "true", "aria-label": title },
      h(
        "div",
        { className: "qbot-modalHead" },
        h("strong", null, title),
        h("button", { className: "qbot-modalClose", type: "button", "aria-label": t("common.close"), onClick: onClose }, "×")
      ),
      subNotice ? h("div", {
        className: `qbot-detailToast qbot-gvSubToast is-${subNotice.tone}`,
        role: subNotice.tone === "error" ? "alert" : "status",
        onClick: () => setSubNotice(null)
      }, subNotice.text) : null,
      body2
    )
  );
  return h(
    React13.Fragment,
    null,
    h(
      "div",
      { className: `qbot-gvLayout${embedded ? " is-embedded" : ""}` },
      embedded ? null : h(
        "nav",
        { className: "qbot-gvNav", role: "tablist", "aria-label": t("gv.title") },
        TEXT_KEYS.map((tab) => h(
          "button",
          {
            key: tab.key,
            type: "button",
            role: "tab",
            "aria-selected": active === tab.key,
            className: `qbot-gvNavItem${active === tab.key ? " is-active" : ""}`,
            onClick: () => setActive(tab.key)
          },
          h("span", { className: "qbot-gvNavIcon", "aria-hidden": "true" }, tab.icon),
          h("span", null, t(`gv.tab.${tab.key}`))
        ))
      ),
      h(
        "div",
        { className: "qbot-gvContent" },
        guild && active !== "guilds" && active !== "events" ? h(
          "div",
          { className: "qbot-gvScope" },
          h("span", { className: "qbot-gvScopeDot", "aria-hidden": "true" }),
          h("span", { className: "qbot-gvScopeName", title: guild.name }, guild.name),
          h("code", { className: "qbot-gvScopeId" }, guild.id)
        ) : null,
        panes[active]()
      )
    ),
    chDialog ? subDialog(chEditId ? t("gv.chEdit") : t("gv.chCreate"), channelForm(), () => {
      setChDialog(false);
      setChEditId("");
    }) : null,
    roleDialog ? subDialog(roleEditId ? t("gv.roleEdit") : t("gv.roleCreate"), roleForm(), () => {
      setRoleDialog(false);
      setRoleEditId("");
    }) : null,
    assignDialog ? subDialog(t("gv.roleAssign"), assignRoleForm(), () => setAssignDialog(false)) : null
  );
}
function GuildManagerDialog(props) {
  const { rpcCall, appId, onClose, initialTab } = props;
  useLocale();
  const [notice, setNotice] = React13.useState(null);
  React13.useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(null), 5e3);
    return () => window.clearTimeout(id);
  }, [notice]);
  return h(
    "div",
    {
      className: "qbot-modalOverlay"
    },
    h(
      "div",
      {
        className: "qbot-modal qbot-modalWide qbot-gvModal",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": t("gv.title")
      },
      h(
        "div",
        { className: "qbot-modalHead" },
        h(
          "div",
          null,
          h("strong", null, t("gv.title")),
          h("p", null, t("gv.hint"))
        ),
        h("button", {
          className: "qbot-modalClose",
          type: "button",
          "aria-label": t("common.close"),
          onClick: onClose
        }, "×")
      ),
      notice ? h("div", {
        className: `qbot-detailToast qbot-ptDialogToast is-${notice.tone}`,
        role: notice.tone === "error" ? "alert" : "status",
        onClick: () => setNotice(null)
      }, notice.text) : null,
      h(
        "div",
        { className: "qbot-gvBody" },
        h(GuildManager, {
          key: `${appId || "default"}-${initialTab ?? "guilds"}`,
          rpcCall,
          appId,
          initialTab,
          onNotify: (text, tone) => setNotice({ text, tone })
        })
      ),
      h(
        "div",
        { className: "qbot-modalFoot qbot-ptDialogFoot" },
        h("span", { className: "qbot-hint" }, t("gv.summary")),
        h("button", {
          className: "qbot-btn qbot-btnPrimary",
          type: "button",
          onClick: onClose
        }, t("common.close"))
      )
    )
  );
}

// src/client/schedule-manager.tsx
var React14 = __toESM(require("react"), 1);

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
function parseField(field2, min, max, names) {
  const tokens = field2.split(",");
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

// src/client/workbench/bg-tasks.ts
function getBackgroundTasks() {
  const wb = window.__dshFileWorkbenchWorkbench__;
  if (wb && typeof wb.apiVersion === "number" && wb.apiVersion >= 3 && wb.backgroundTasks && typeof wb.backgroundTasks.start === "function") {
    return wb.backgroundTasks;
  }
  return null;
}
async function runAsBackgroundTask(label, fn, detail) {
  const api = getBackgroundTasks();
  if (!api) {
    await fn();
    return;
  }
  const task = api.start(label, detail ? { detail } : void 0);
  let outcome = { ok: true };
  try {
    const r = await fn();
    if (r && typeof r === "object") outcome = r;
  } catch (e) {
    outcome = { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
  if (outcome.ok) task.done(outcome.message);
  else task.fail(outcome.message);
}

// src/client/schedule-manager.tsx
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
function isValidTimeZone(tz) {
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}
function tzOptions() {
  return [
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
}
var DEFAULT_TZ = "Asia/Shanghai";
function localTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TZ;
  } catch {
    return DEFAULT_TZ;
  }
}
function schedBgDetail(entry) {
  if (!entry) return void 0;
  const s = entry.mode === "tool" ? String(entry.command ?? entry.content ?? "") : String(entry.content ?? "");
  const text = s.trim();
  return text ? text.slice(0, 60) : void 0;
}
function cmdTemplates() {
  return [
    { label: "Python", cmd: "python C:/scripts/report.py" },
    { label: "PowerShell", cmd: "powershell -ExecutionPolicy Bypass -File C:/scripts/check.ps1" },
    { label: t("sched.form.templateBat"), cmd: "C:/scripts/backup.bat" },
    { label: "Node", cmd: "node C:/scripts/sync.mjs" },
    { label: "VBS", cmd: "cscript //Nologo C:/scripts/task.vbs" },
    { label: "Perl", cmd: "perl C:/scripts/task.pl" }
  ];
}
function intervalPresets() {
  return [
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
}
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
    atEveryone: false,
    tool: "",
    args: {}
  };
}
function ScheduleManager(props) {
  const { rpcCall, detailAppId, forceScope, onClose, toast } = props;
  useLocale();
  const notify = (ok, text) => {
    if (toast) toast(ok ? "ok" : "error", text);
    else setSchedNotice({ ok, text });
  };
  const [scheduleModal, setScheduleModal] = React14.useState({
    loading: true,
    error: "",
    items: [],
    botScope: forceScope ?? "current",
    editing: null,
    editError: "",
    saving: false,
    maxPerChat: 15
  });
  const [scheduleRemoving, setScheduleRemoving] = React14.useState("");
  const [scheduleToggling, setScheduleToggling] = React14.useState("");
  const [scheduleTesting, setScheduleTesting] = React14.useState("");
  const [scheduleViewing, setScheduleViewing] = React14.useState(null);
  const [schedNotice, setSchedNotice] = React14.useState(null);
  const [collapsedGroups, setCollapsedGroups] = React14.useState({});
  const [expandedErrors, setExpandedErrors] = React14.useState({});
  const archiveChats = useArchiveChats(rpcCall, detailAppId);
  const [cronPreview, setCronPreview] = React14.useState(null);
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
  React14.useEffect(() => {
    if (!schedNotice || toast) return;
    const timer = setTimeout(() => setSchedNotice(null), 8e3);
    return () => clearTimeout(timer);
  }, [schedNotice]);
  React14.useEffect(() => {
    if (scheduleModal.editError && toast) toast("error", scheduleModal.editError);
  }, [scheduleModal.editError]);
  React14.useEffect(() => {
    if (scheduleModal.error && toast) toast("error", scheduleModal.error);
  }, [scheduleModal.error]);
  React14.useEffect(() => {
    const s = forceScope ?? "current";
    setScheduleViewing(null);
    setScheduleModal((prev) => prev ? { ...prev, botScope: s } : prev);
    void loadSchedules(s);
  }, [forceScope, detailAppId]);
  const switchScheduleScope = (botScope) => {
    setScheduleModal(
      (prev) => prev && prev.botScope !== botScope ? { ...prev, botScope, loading: true, editing: null, editError: "" } : prev
    );
    void loadSchedules(botScope);
  };
  React14.useEffect(() => {
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
          atEveryone: entry.atEveryone === true,
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
    if ((e.type === "cron" || e.type === "at") && !isValidTimeZone(tz)) {
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
      // @全体成员：仅群聊 text 任务携带（宿主侧会再校验 scope/mode）。
      ...e.mode === "text" && e.scope === "group" ? { atEveryone: e.atEveryone === true } : {},
      // 任务契约：ai / tool 模式通用（text 是固定句子直发，无需分诊）。
      ...e.mode === "ai" || e.mode === "tool" ? {
        ...String(e.goal ?? "").trim() ? { goal: String(e.goal).trim() } : {},
        ...String(e.notifyWhen ?? "").trim() ? { notifyWhen: String(e.notifyWhen).trim() } : {},
        verify: e.verify === true
      } : {},
      ...e.appId ? { appId: e.appId } : detailAppId ? { appId: detailAppId } : {}
    };
    await runAsBackgroundTask(
      e.id ? t("sched.bg.update") : t("sched.bg.create"),
      async () => {
        const res = await rpcCall("schedule.add", payload);
        if (res.ok) {
          setScheduleModal((prev) => prev ? { ...prev, editing: null, saving: false } : prev);
          await loadSchedules(scheduleModal?.botScope ?? "current");
          return { ok: true, message: t("sched.bg.done") };
        }
        setScheduleModal((prev) => prev ? { ...prev, saving: false, editError: errText(res.error) } : prev);
        return { ok: false, message: errText(res.error) };
      },
      String(e.content ?? "").trim().slice(0, 60) || void 0
    );
  };
  const removeSchedule = async (id) => {
    if (!await confirmDlg({ message: t("sched.removeTaskConfirm"), danger: true })) return;
    setScheduleRemoving(id);
    const scopeNow = scheduleModal?.botScope ?? "current";
    try {
      await runAsBackgroundTask(
        t("sched.bg.remove"),
        async () => {
          const res = await rpcCall("schedule.remove", { id });
          if (res.ok) {
            await loadSchedules(scopeNow);
            return { ok: true, message: t("sched.bg.done") };
          }
          notify(false, errText(res.error));
          return { ok: false, message: errText(res.error) };
        },
        schedBgDetail(scheduleModal?.items.find((x) => String(x.id) === id))
      );
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
      await runAsBackgroundTask(
        currentlyEnabled ? t("sched.bg.disable") : t("sched.bg.enable"),
        async () => {
          const res = await rpcCall("schedule.setEnabled", { id, enabled: !currentlyEnabled });
          if (!res.ok) {
            notify(false, errText(res.error));
            return { ok: false, message: errText(res.error) };
          }
          const s = val(res) ?? {};
          const nextAt = s.schedule?.nextRunAt ?? s.nextRunAt;
          notify(
            currentlyEnabled ? true : nextAt ? true : false,
            currentlyEnabled ? t("sched.disabledToast") : nextAt ? fmt("sched.enabledToast", formatTime(nextAt)) : t("sched.enabledNoNext")
          );
          await loadSchedules(scopeNow);
          return { ok: true, message: t("sched.bg.done") };
        },
        schedBgDetail(scheduleModal?.items.find((x) => String(x.id) === id))
      );
    } finally {
      setScheduleToggling("");
    }
  };
  const runOnceSchedule = async (id) => {
    if (!id) return;
    setSchedNotice(null);
    setScheduleTesting(id);
    try {
      await runAsBackgroundTask(
        t("sched.bg.runOnce"),
        async () => {
          const res = await rpcCall("schedule.runOnce", { id });
          if (res.ok) {
            const v = val(res) ?? {};
            notify(true, typeof v.message === "string" ? v.message : t("sched.testSent"));
            return { ok: true, message: typeof v.message === "string" ? v.message : t("sched.testSent") };
          }
          notify(false, errText(res.error));
          return { ok: false, message: errText(res.error) };
        },
        schedBgDetail(scheduleModal?.items.find((x) => String(x.id) === id))
      );
    } finally {
      setScheduleTesting("");
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
    const list = tzOptions();
    if (!list.some((o) => o.value === local)) {
      options.push({ value: local, label: fmt("sched.form.localTz", local) });
    }
    options.push(...list);
    if (!options.some((o) => o.value === current)) {
      options.push({ value: String(current), label: String(current) });
    }
    return h(
      "div",
      { className: "qbot-schedTz" },
      h(
        "select",
        {
          className: "qbot-settingSelect",
          value: String(current),
          onChange: (ev) => setEditField("tz", String(ev.target.value)),
          "aria-label": t("sched.form.timezone")
        },
        ...options.map((o) => h("option", { key: o.value, value: o.value }, o.label))
      )
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
          intervalPresets().map(
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
        "label",
        { className: "qbot-checkRow" },
        h("input", {
          type: "checkbox",
          className: "qbot-checkbox",
          checked: e.verify === true,
          onChange: (ev) => setEditField("verify", ev.target.checked),
          "aria-label": t("sched.form.selfCheck")
        }),
        h(
          "span",
          { className: "qbot-checkText" },
          e.verify === true ? t("sched.form.checkOn") : t("sched.form.checkOff")
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
                cmdTemplates().map(
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
    if (e.mode === "text") {
      if (e.scope !== "group") return contentRow;
      const atEveryoneRow = editRow(
        t("sched.form.atEveryone"),
        t("sched.form.atEveryoneHint"),
        h(
          "div",
          { className: "qbot-checkRow" },
          h("input", {
            type: "checkbox",
            className: "qbot-checkbox",
            checked: e.atEveryone === true,
            onChange: (ev) => setEditField("atEveryone", ev.target.checked),
            "aria-label": t("sched.form.atEveryone")
          }),
          h(
            "span",
            { className: "qbot-checkText" },
            e.atEveryone === true ? t("sched.form.atEveryoneOn") : t("sched.form.atEveryoneOff")
          )
        )
      );
      return h("div", { className: "qbot-schedFieldCol" }, contentRow, atEveryoneRow);
    }
    return h("div", { className: "qbot-schedFieldCol" }, contentRow, ...contractFields(e));
  };
  const flowNode = (kind, title, detail) => h(
    "div",
    { className: `qbot-flowNode qbot-flowNode--${kind}` },
    h("div", { className: "qbot-flowTitle" }, title),
    detail ? h("div", { className: "qbot-flowDetail" }, detail) : null
  );
  const flowDecision = (question, answer, answerClass, note) => h(
    "div",
    { className: "qbot-flowDecision" },
    h("span", { className: "qbot-flowQ", "aria-hidden": "true" }, "?"),
    h(
      "div",
      { className: "qbot-flowDecisionBody" },
      h("div", { className: "qbot-flowDecisionQ" }, question),
      h("span", { className: `qbot-flowAnswer${answerClass ? ` ${answerClass}` : ""}` }, answer),
      note ? h("div", { className: "qbot-flowDetail" }, note) : null
    )
  );
  const flowConn = () => h("div", { className: "qbot-flowConn", "aria-hidden": "true" });
  const buildFlow = (e) => {
    const enabled = e.enabled !== false;
    const nodes = [];
    const join = () => {
      if (nodes.length) nodes.push(flowConn());
    };
    let typeDesc = summarizeType(e);
    if ((e.type === "daily" || e.type === "interval") && Array.isArray(e.weekdays) && e.weekdays.length) {
      typeDesc += ` · ${weekdayText(e.weekdays)}`;
    }
    nodes.push(flowNode("trigger", t("sched.flow.trigger"), typeDesc));
    join();
    nodes.push(flowDecision(t("sched.flow.enabled"), enabled ? t("sched.flow.yes") : t("sched.flow.no"), enabled ? "" : "is-no", enabled ? void 0 : t("sched.flow.skip")));
    if (!enabled) {
      join();
      nodes.push(flowNode("deliver", t("sched.flow.end"), t("sched.flow.disabled")));
      return nodes;
    }
    join();
    nodes.push(flowNode("recipient", t("sched.flow.recipient"), `${e.scope === "group" ? t("sched.form.scopeGroup") : t("sched.form.scopeDm")} · ${chatLabel(String(e.openid ?? ""))}`));
    join();
    const content = String(e.content ?? e.goal ?? "").trim();
    const actionText = e.mode === "tool" ? `${t("sched.flow.modeTool")}${e.genPrompt ? `（${t("sched.commandAiScript")}）` : ""}：${String(e.command || e.genPrompt || "").trim() || "—"}` : e.mode === "ai" ? `${t("sched.flow.modeAi")}：${content || "—"}` : `${t("sched.flow.modeText")}：${content || "—"}`;
    nodes.push(flowNode("action", t("sched.flow.action"), actionText));
    if (e.mode === "tool") {
      join();
      nodes.push(flowDecision(t("sched.flow.resultMode"), e.resultMode === "ai" ? t("sched.flow.resultAi") : t("sched.flow.resultRaw"), e.resultMode === "ai" ? "is-warn" : ""));
      join();
      const gate = e.gate === "nonempty" ? t("sched.flow.gateNonempty") : e.gate === "changed" ? t("sched.flow.gateChanged") : t("sched.flow.gateAlways");
      nodes.push(flowDecision(t("sched.flow.gate"), gate, e.gate === "always" ? "" : "is-warn"));
    }
    if ((e.mode === "ai" || e.mode === "tool") && String(e.notifyWhen ?? "").trim()) {
      join();
      nodes.push(flowDecision(t("sched.flow.notify"), String(e.notifyWhen).trim(), "is-warn"));
    }
    if (e.verify === true) {
      join();
      nodes.push(flowDecision(t("sched.flow.verify"), t("sched.flow.yes"), ""));
    }
    join();
    nodes.push(flowNode("deliver", t("sched.flow.deliver"), e.nextRunAt ? fmt("sched.flow.nextRun", formatTime(String(e.nextRunAt))) : t("sched.noNextRun")));
    return nodes;
  };
  const detailView = (e) => h(
    "div",
    { className: "qbot-schedDetail" },
    h(
      "div",
      { className: "qbot-schedDetailHead" },
      h("button", { className: "qbot-btn", type: "button", onClick: () => setScheduleViewing(null) }, t("sched.back")),
      h("div", null, h("h3", null, t("sched.detailTitle")), h("p", null, t("sched.detailSubtitle")))
    ),
    h("div", { className: "qbot-schedDetailBody" }, h("div", { className: "qbot-flow" }, ...buildFlow(e)))
  );
  const ROOT = { display: "flex", flexDirection: "column", flex: "1 1 auto", minHeight: 0, boxSizing: "border-box" };
  return h(
    "div",
    { className: "qbot-schedRoot", style: ROOT },
    ed ? [
      h(
        "div",
        { key: "body", className: "qbot-modalBody" },
        h(
          "div",
          { className: "qbot-editForm qbot-schedForm" },
          scheduleModal.editError && !toast ? h("div", { key: "editErr", className: "qbot-schedNotice is-error" }, scheduleModal.editError) : null,
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
                  rpcCall,
                  appId: detailAppId,
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
        { key: "foot", className: "qbot-modalFoot qbot-schedEditFoot" },
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
    ] : scheduleViewing ? detailView(scheduleViewing) : h(
      "div",
      { className: `qbot-modalList${scheduleModal.loading && scheduleModal.items.length > 0 ? " is-refreshing" : ""}` },
      [
        schedNotice && !toast ? h(
          "div",
          { key: "notice", className: `qbot-schedNotice is-autoHide${schedNotice.ok ? "" : " is-error"}` },
          schedNotice.text
        ) : null,
        h(
          "div",
          { key: "tabs", className: "qbot-schedTabs", role: "tablist" },
          forceScope ? null : [
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
            )
          ],
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
          scheduleModal.error ? h(
            "div",
            { key: "listErr", className: "qbot-schedNotice is-error" },
            scheduleModal.error
          ) : scheduleModal.items.length === 0 ? scheduleModal.loading ? h(
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
            const collapsed = collapsedGroups[g.scope] === true;
            return h(
              "div",
              { key: g.scope, className: `qbot-schedGroup${collapsed ? " is-collapsed" : ""}` },
              h(
                "button",
                {
                  type: "button",
                  className: "qbot-schedGroupTitle",
                  "data-scope": g.scope,
                  "aria-expanded": !collapsed,
                  title: collapsed ? t("sched.expandGroup") : t("sched.collapseGroup"),
                  onClick: () => setCollapsedGroups((prev) => ({ ...prev, [g.scope]: !collapsed }))
                },
                h("span", { className: "qbot-schedCaret", "aria-hidden": "true" }),
                g.title,
                h("span", { className: "qbot-schedCount" }, `${rows.length}`)
              ),
              collapsed ? null : rows.map(
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
                        e.enabled === false ? t("sched.disabledNoRun") : e.genStatus === "pending" ? t("sched.scriptReadyHint") : fmt("sched.next", e.nextRunAt ? formatTime(e.nextRunAt) : t("sched.noNextRun"))
                      ),
                      e.lastError ? h(
                        "div",
                        {
                          className: `qbot-schedError${expandedErrors[String(e.id)] ? " is-expanded" : ""}`,
                          title: String(e.lastError),
                          role: "button",
                          tabIndex: 0,
                          "aria-expanded": expandedErrors[String(e.id)] === true,
                          onClick: () => setExpandedErrors((prev) => ({ ...prev, [String(e.id)]: !prev[String(e.id)] })),
                          onKeyDown: (ev) => {
                            if (ev.key === "Enter" || ev.key === " ") {
                              ev.preventDefault();
                              setExpandedErrors((prev) => ({ ...prev, [String(e.id)]: !prev[String(e.id)] }));
                            }
                          }
                        },
                        String(e.lastError)
                      ) : null,
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
                        className: "qbot-btn qbot-schedView",
                        type: "button",
                        onClick: () => setScheduleViewing(e)
                      },
                      t("sched.view")
                    ),
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
                    h("span", { className: "qbot-schedDivider", "aria-hidden": "true" }),
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
    !ed && !scheduleViewing ? h(
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
        onClose ? h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: onClose }, t("common.close")) : null
      )
    ) : null
  );
}

// src/client/dialogs/schedule-dialog.tsx
function ScheduleDialog(props) {
  const { rpcCall, detailAppId, onClose } = props;
  useLocale();
  return h(
    "div",
    { className: "qbot-modalOverlay" },
    h(
      "div",
      { className: "qbot-modal qbot-modalWide", role: "dialog", "aria-modal": "true", "aria-label": t("sched.title") },
      h(
        "div",
        { className: "qbot-modalHead" },
        h("div", null, h("strong", null, t("sched.title")), h("p", null, t("sched.hint"))),
        h(
          "button",
          { className: "qbot-modalClose", type: "button", "aria-label": t("common.close"), onClick: onClose },
          "×"
        )
      ),
      h(ScheduleManager, { rpcCall, detailAppId, onClose })
    )
  );
}

// src/client/dialogs/console-dialog.tsx
var React15 = __toESM(require("react"), 1);
var platLeaf = (id, label, icon, nav, extra) => ({
  id,
  label,
  icon,
  view: { kind: "platform", focus: { nav, ...extra } }
});
var guildLeaf = (id, label, icon, tab, extra) => ({
  id,
  label,
  icon,
  view: { kind: "guild", focus: { tab, ...extra } }
});
var NAV_TREE_ALL = [
  {
    id: "overview",
    label: "console.grpOverview",
    icon: "▤",
    items: [{ id: "overview", label: "console.navOverview", icon: "◈", view: { kind: "overview" } }]
  },
  {
    id: "runtime",
    label: "console.grpRuntime",
    icon: "◷",
    items: [
      { id: "schedule", label: "console.navSchedule", icon: "◷", view: { kind: "schedule" } },
      { id: "archive", label: "console.navArchive", icon: "▣", view: { kind: "archive" } }
    ]
  },
  {
    id: "config",
    label: "console.grpConfig",
    icon: "◇",
    items: [
      { id: "session", label: "console.navSession", icon: "◇", view: { kind: "config", pane: "session" } },
      { id: "policy", label: "console.navPolicy", icon: "⇄", view: { kind: "config", pane: "policy" } },
      { id: "tune", label: "console.navTune", icon: "≋", view: { kind: "config", pane: "tune" } },
      { id: "override", label: "console.navOverride", icon: "▦", view: { kind: "config", pane: "override" } },
      { id: "manifest", label: "console.navManifest", icon: "{ }", view: { kind: "config", pane: "manifest" } }
    ]
  },
  {
    id: "group",
    label: "console.navPlatform",
    icon: "⚡",
    items: [
      platLeaf("g:info", "pt.navInfo", "◈", "g:info"),
      // 入群审批 / 群规审核：与旧版弹窗一致，导航里是单个项，子页用组件内部 subNav 切换。
      platLeaf("g:join", "pt.navJoin", "⌑", "g:join", { joinTab: "auto" }),
      platLeaf("g:moderation", "pt.navModeration", "✦", "g:moderation", { modTab: "config" })
    ]
  },
  {
    id: "guild",
    label: "console.navGuild",
    icon: "◈",
    items: [
      guildLeaf("guilds", "gv.tab.guilds", "◈", "guilds"),
      guildLeaf("info", "gv.tab.info", "ⓘ", "info"),
      guildLeaf("channels", "gv.tab.channels", "☰", "channels"),
      guildLeaf("members", "gv.tab.members", "♙", "members"),
      guildLeaf("roles", "gv.tab.roles", "◆", "roles"),
      guildLeaf("message", "gv.tab.message", "✎", "message"),
      {
        id: "speak",
        label: "gv.tab.speak",
        icon: "◉",
        view: { kind: "guild", focus: { tab: "speak", speakTab: "all" } },
        children: [
          guildLeaf("speak:all", "gv.st.all", "·", "speak", { speakTab: "all" }),
          guildLeaf("speak:member", "gv.st.member", "·", "speak", { speakTab: "member" }),
          guildLeaf("speak:frequency", "gv.st.frequency", "·", "speak", { speakTab: "frequency" }),
          guildLeaf("speak:keyword:config", "console.navKwConfig", "·", "speak", { speakTab: "keyword", kwTab: "config" }),
          guildLeaf("speak:keyword:logs", "console.navKwLogs", "·", "speak", { speakTab: "keyword", kwTab: "logs" })
        ]
      },
      {
        id: "content",
        label: "gv.tab.content",
        icon: "⌫",
        view: { kind: "guild", focus: { tab: "content", contentTab: "recall" } },
        children: [
          guildLeaf("content:recall", "gv.ct.recall", "·", "content", { contentTab: "recall" }),
          guildLeaf("content:announce", "gv.ct.announce", "·", "content", { contentTab: "announce" }),
          guildLeaf("content:pin", "gv.ct.pin", "·", "content", { contentTab: "pin" }),
          guildLeaf("content:schedule", "gv.ct.schedule", "·", "content", { contentTab: "schedule" }),
          guildLeaf("content:audio", "gv.ct.audio", "·", "content", { contentTab: "audio" }),
          guildLeaf("content:forum", "gv.ct.forum", "·", "content", { contentTab: "forum" })
        ]
      },
      {
        id: "ai",
        label: "gv.tab.ai",
        icon: "✦",
        view: { kind: "guild", focus: { tab: "ai", aiTab: "config" } },
        children: [
          guildLeaf("ai:config", "gv.aiSubConfig", "·", "ai", { aiTab: "config" }),
          guildLeaf("ai:logs", "gv.aiSubLogs", "·", "ai", { aiTab: "logs" }),
          guildLeaf("ai:reply", "gv.aiSubReply", "·", "ai", { aiTab: "reply" }),
          guildLeaf("ai:replyLogs", "gv.replyLogsTitle", "·", "ai", { aiTab: "replyLogs" })
        ]
      },
      guildLeaf("apiPerm", "gv.tab.apiPerm", "⚿", "apiPerm"),
      guildLeaf("assistant", "gv.tab.assistant", "✧", "assistant"),
      guildLeaf("events", "gv.tab.events", "⌁", "events")
    ]
  },
  {
    id: "manage",
    label: "console.grpManage",
    icon: "✧",
    items: [
      { id: "connection", label: "conn.title", icon: "⚙", view: { kind: "connection" } }
    ]
  }
];
var GUILD_UI_VISIBLE = false;
var NAV_TREE = GUILD_UI_VISIBLE ? NAV_TREE_ALL : NAV_TREE_ALL.filter((g) => g.id !== "guild");
function findPath(id) {
  for (const group of NAV_TREE) {
    for (const item of group.items) {
      if (item.id === id) return { group, leaf: item };
      for (const child of item.children ?? []) {
        if (child.id === id) return { group, parent: item, leaf: child };
      }
    }
  }
  return void 0;
}
function lastDays(n) {
  const out = [];
  const now = Date.now();
  const offset = 8 * 60 * 60 * 1e3;
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now + offset - i * 864e5);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}
function ConsoleDialog(props) {
  const { rpcCall, bot, groups, onClose, configPanes, connectionPane, onConfigSaved } = props;
  useLocale();
  const [selected, setSelected] = React15.useState("overview");
  const [pickedGroup, setPickedGroup] = React15.useState("");
  const [notice, setNotice] = React15.useState(null);
  const notify = React15.useCallback((text, tone) => {
    if (!text) return;
    setNotice({ text, tone });
  }, []);
  React15.useEffect(() => {
    if (!notice) return void 0;
    const id = window.setTimeout(() => setNotice(null), 5e3);
    return () => window.clearTimeout(id);
  }, [notice]);
  const appId = bot?.appId ?? "";
  const counters = bot?.counters ?? { received: 0, sessions: 0, replies: 0, proactive: 0, errors: 0 };
  const daily = bot?.daily ?? {};
  const buffered = Array.isArray(bot?.groupBuffers) ? bot.groupBuffers.reduce((n, b) => n + Number(b?.buffered ?? 0), 0) : 0;
  const pending = Number(bot?.pendingReplies ?? 0);
  const errors = Number(counters.errors ?? 0);
  const [archiveStats, setArchiveStats] = React15.useState(null);
  React15.useEffect(() => {
    let alive = true;
    rpcCall("archive.stats", appId ? { appId } : {}).then((res) => {
      if (alive && res.ok) setArchiveStats(val(res) ?? null);
    }).catch(() => {
    });
    return () => {
      alive = false;
    };
  }, [rpcCall, appId]);
  const path = findPath(selected) ?? findPath("overview");
  const view = path.leaf.view;
  const metric = (label, value, tone = "", sub = "", glyph = "·") => h(
    "div",
    { className: "qbot-consoleMetric", "data-tone": tone, key: label },
    h(
      "div",
      { className: "qbot-consoleMetricTop" },
      h("span", { className: "qbot-consoleMetricIcon", "aria-hidden": "true" }, glyph),
      h("span", { className: "qbot-consoleMetricLabel" }, label)
    ),
    h("strong", { className: "qbot-consoleMetricValue" }, String(value)),
    sub ? h("span", { className: "qbot-consoleMetricSub" }, sub) : null
  );
  const overviewPane = () => {
    const days = lastDays(7);
    const values = days.map((d) => Number(daily[d] ?? 0));
    const max = Math.max(1, ...values);
    const todayCount = values[values.length - 1] ?? 0;
    const weekTotal = values.reduce((sum, n) => sum + n, 0);
    const peak = Math.max(0, ...values);
    const peakDay = days[values.indexOf(peak)] ?? "";
    const passive = Number(counters.replies ?? 0);
    const proact = Number(counters.proactive ?? 0);
    const total = passive + proact;
    const pct = (n) => total > 0 ? Math.round(n / total * 100) : 0;
    const passivePct = pct(passive);
    const proactPct = total > 0 ? 100 - passivePct : 0;
    const wsState = bot?.ws?.state ?? "";
    const conn = bot?.enabled === false ? { tone: "muted", text: t("status.disabled") } : wsState === "connected" ? { tone: "success", text: t("status.connected") } : wsState === "connecting" ? { tone: "warning", text: t("status.connecting") } : { tone: "error", text: t("status.disconnected") };
    const lastConnect = bot?.ws?.lastConnectedAt ? new Date(bot.ws.lastConnectedAt).toLocaleString() : t("console.ovNever");
    const donut = total > 0 ? `conic-gradient(var(--qbot-blue, #1677ff) 0 ${passivePct}%, var(--dsw-alias-state-success-primary, #20a162) ${passivePct}% 100%)` : "var(--dsw-alias-bg-module-platform, #f7f8fa)";
    const statusRow = (label, text, tone = "") => h(
      "div",
      { className: "qbot-ovStatusRow", key: label },
      h("span", { className: "qbot-ovStatusLabel" }, label),
      h("strong", { className: "qbot-ovStatusValue", "data-tone": tone }, text)
    );
    const arc = archiveStats ?? {
      total: 0,
      chats: 0,
      groups: 0,
      dmChats: 0,
      kinds: { inbound: 0, reply: 0, proactive: 0 },
      scopes: { group: 0, c2c: 0 },
      months: []
    };
    const arcPct = (n) => arc.total > 0 ? Math.round(n / arc.total * 100) : 0;
    const arcLegend = (css, label, count) => h(
      "span",
      { key: css },
      h("i", { className: `is-${css}` }),
      label,
      h("b", null, String(count)),
      h("em", null, `${arcPct(count)}%`)
    );
    const maxMonth = Math.max(1, ...arc.months.map((m) => Number(m.count ?? 0)));
    return h(
      React15.Fragment,
      null,
      h(
        "div",
        { className: "qbot-ovHero" },
        h(
          "div",
          { className: "qbot-ovHeroId" },
          h("div", { className: "qbot-ovAvatar", "aria-hidden": "true" }, "◈"),
          h(
            "div",
            { className: "qbot-ovHeroMeta" },
            h("strong", null, bot?.appIdMasked ?? "—"),
            h("span", null, bot?.primary ? t("console.ovPrimary") : t("console.ovSecondary"))
          )
        ),
        h(
          "div",
          { className: `qbot-ovConn is-${conn.tone}` },
          h("i", { "aria-hidden": "true" }),
          conn.text
        ),
        h(
          "div",
          { className: "qbot-ovHeroFacts" },
          h("div", null, h("span", null, t("console.ovTodayLabel")), h("strong", null, String(todayCount))),
          h("div", null, h("span", null, t("stats.sessions")), h("strong", null, String(counters.sessions ?? 0))),
          h("div", null, h("span", null, t("console.ovGroups")), h("strong", null, String(groups.length)))
        )
      ),
      h(
        "div",
        { className: "qbot-consoleMetricGrid" },
        metric(t("stats.received"), counters.received ?? 0, "", fmt("console.ovToday", String(todayCount)), "◉"),
        metric(t("stats.sessions"), counters.sessions ?? 0, "success", "", "◇"),
        metric(t("stats.passive"), passive, "success", fmt("console.ovShare", `${passivePct}%`), "↩"),
        metric(t("stats.proactive"), proact, "", fmt("console.ovShare", `${proactPct}%`), "↗"),
        metric(t("stats.bound"), bot?.boundSessions ?? 0, "", "", "⧉"),
        metric(
          t("stats.pendingQueue"),
          pending,
          pending > 0 ? "warning" : "",
          pending > 0 ? t("console.ovWaiting") : t("console.ovClear"),
          "◷"
        ),
        metric(t("stats.groupBuffer"), buffered, "", "", "▤"),
        metric(
          t("stats.errors"),
          errors,
          errors > 0 ? "error" : "",
          errors > 0 ? t("console.ovAttention") : t("console.ovNormal"),
          "!"
        )
      ),
      h(
        "div",
        { className: "qbot-consoleCharts" },
        h(
          "div",
          { className: "qbot-consoleChart qbot-ovTrend" },
          h(
            "div",
            { className: "qbot-ovChartHead" },
            h(
              "div",
              null,
              h("strong", null, t("console.chartDaily")),
              h("span", null, fmt("console.ovPeakDay", peakDay.slice(5), String(peak)))
            ),
            h("span", { className: "qbot-ovChartTag" }, fmt("console.ovWeekTotal", String(weekTotal)))
          ),
          h(
            "div",
            { className: "qbot-consoleBars qbot-ovBars" },
            ...days.map((day, i) => h(
              "div",
              { className: "qbot-consoleBarCol", key: day },
              h(
                "div",
                { className: "qbot-ovBarArea" },
                h("span", { className: "qbot-ovBarValue" }, String(values[i])),
                h("div", {
                  className: `qbot-consoleBar${i === days.length - 1 ? " is-today" : ""}`,
                  style: { height: `${Math.max(2, Math.round(values[i] / max * 100))}%` },
                  title: fmt("console.barTip", day.slice(5), String(values[i]))
                })
              ),
              h("span", null, day.slice(5))
            ))
          )
        ),
        h(
          "div",
          { className: "qbot-consoleChart qbot-ovDonutChart" },
          h("div", { className: "qbot-ovChartHead" }, h("strong", null, t("console.chartCompose"))),
          h(
            "div",
            { className: "qbot-ovDonutBody" },
            h(
              "div",
              { className: "qbot-ovDonut", style: { background: donut } },
              h(
                "div",
                { className: "qbot-ovDonutInner" },
                h("strong", null, String(total)),
                h("span", null, t("console.ovTotalReplies"))
              )
            ),
            h(
              "div",
              { className: "qbot-consoleComposeLegend" },
              h("span", null, h("i", { className: "is-passive" }), fmt("console.legendPassive", String(passive))),
              h("span", null, h("i", { className: "is-proactive" }), fmt("console.legendProactive", String(proact)))
            )
          )
        ),
        h(
          "div",
          { className: "qbot-consoleChart qbot-ovStatus" },
          h("div", { className: "qbot-ovChartHead" }, h("strong", null, t("console.ovStatusTitle"))),
          h(
            "div",
            { className: "qbot-ovStatusList" },
            statusRow(t("console.ovConnect"), conn.text, conn.tone),
            statusRow(t("console.ovLastConnect"), lastConnect),
            statusRow(t("console.ovGroups"), String(groups.length)),
            statusRow(t("console.ovPeak"), peak > 0 ? `${peakDay.slice(5)} · ${peak}` : t("console.ovNoData"))
          )
        ),
        h(
          "div",
          { className: "qbot-consoleCharts qbot-ovArchive" },
          h(
            "div",
            { className: "qbot-consoleChart qbot-ovArcKind" },
            h(
              "div",
              { className: "qbot-ovChartHead" },
              h("strong", null, t("console.ovArchiveKinds")),
              h("span", null, fmt("console.ovArchiveTotal", String(arc.total)))
            ),
            h(
              "div",
              { className: "qbot-ovArcBar" },
              h("span", { className: "is-inbound", style: { width: `${arcPct(arc.kinds.inbound)}%` } }),
              h("span", { className: "is-reply", style: { width: `${arcPct(arc.kinds.reply)}%` } }),
              h("span", { className: "is-proactive", style: { width: `${arcPct(arc.kinds.proactive)}%` } })
            ),
            h(
              "div",
              { className: "qbot-ovArcLegend" },
              arcLegend("inbound", t("stats.received"), arc.kinds.inbound),
              arcLegend("reply", t("stats.passive"), arc.kinds.reply),
              arcLegend("proactive", t("stats.proactive"), arc.kinds.proactive)
            )
          ),
          h(
            "div",
            { className: "qbot-consoleChart qbot-ovArcScope" },
            h(
              "div",
              { className: "qbot-ovChartHead" },
              h("strong", null, t("console.ovArchiveScopes")),
              h("span", null, fmt("console.ovArchiveChats", String(arc.chats)))
            ),
            h(
              "div",
              { className: "qbot-ovArcBar" },
              h("span", { className: "is-group", style: { width: `${arcPct(arc.scopes.group)}%` } }),
              h("span", { className: "is-c2c", style: { width: `${arcPct(arc.scopes.c2c)}%` } })
            ),
            h(
              "div",
              { className: "qbot-ovArcLegend" },
              arcLegend("group", t("console.ovArchiveGroup"), arc.scopes.group),
              arcLegend("c2c", t("console.ovArchiveC2c"), arc.scopes.c2c)
            )
          ),
          h(
            "div",
            { className: "qbot-consoleChart qbot-ovArcMonths" },
            h("div", { className: "qbot-ovChartHead" }, h("strong", null, t("console.ovArchiveMonths"))),
            arc.months.length ? h(
              "div",
              { className: "qbot-ovArcMonthList" },
              ...arc.months.map((m) => h(
                "div",
                { className: "qbot-ovArcMonth", key: m.month },
                h("span", null, String(m.month).slice(2)),
                h(
                  "div",
                  { className: "qbot-ovArcMonthTrack" },
                  h("i", { style: { width: `${Math.max(2, Math.round(Number(m.count ?? 0) / maxMonth * 100))}%` } })
                ),
                h("strong", null, String(m.count ?? 0))
              ))
            ) : h("div", { className: "qbot-ovArcEmpty" }, t("console.ovNoData"))
          )
        )
      )
    );
  };
  const subDialog = (node, extra = "") => h("div", { className: `qbot-consoleSub${extra ? ` ${extra}` : ""}` }, node);
  const flatPane = (node) => {
    if (!React15.isValidElement(node)) return node;
    const kids = React15.Children.toArray(node.props.children);
    const body2 = kids.find((k) => React15.isValidElement(k) && String(k.props.className ?? "").includes("qbot-sectionBody"));
    return body2 ?? node;
  };
  const isFill = view.kind === "archive" || view.kind === "config" && view.pane === "manifest";
  const content = () => {
    switch (view.kind) {
      case "overview":
        return h("div", { className: "qbot-consoleOverview" }, overviewPane());
      case "schedule":
        return h(
          "div",
          { className: "qbot-consoleEmbed" },
          // 嵌入控制台时不传 onClose，避免内容区再出现一个「关闭」按钮；提示统一走弹窗顶部悬浮条。
          h(ScheduleManager, { rpcCall, detailAppId: appId, toast: (level, msg) => notify(msg, level === "ok" ? "success" : "error") })
        );
      case "archive":
        return subDialog(h(ArchiveDialog, {
          rpcCall,
          detailAppId: appId,
          onClose: () => setSelected("overview")
        }), "qbot-consoleSubArchive");
      case "config":
        return view.pane === "manifest" ? subDialog(h(ConfigManifestDialog, {
          appId,
          rpcCall,
          onClose: () => setSelected("overview"),
          onSaved: () => {
            void onConfigSaved();
            notify(t("manifest.savedNotice"), "success");
          }
        }), "qbot-consoleSubManifest") : h("div", { className: "qbot-consoleEmbed qbot-consoleConfig" }, flatPane(configPanes[view.pane]));
      case "assistant":
        return h(
          "div",
          { className: "qbot-consoleEmbed" },
          h(AiOpsLogPanel, { rpcCall, appId, scope: "group" })
        );
      case "connection":
        return h("div", { className: "qbot-consoleEmbed qbot-consoleConfig" }, flatPane(connectionPane));
      case "platform":
        return h(
          "div",
          { className: "qbot-consoleEmbed" },
          h(PlatformTools, {
            rpcCall,
            appId,
            groups,
            onNotify: notify,
            embedded: true,
            focus: view.focus,
            group: pickedGroup,
            onGroupChange: setPickedGroup
          })
        );
      case "guild":
        return h(
          "div",
          { className: "qbot-consoleEmbed" },
          h(GuildManager, {
            rpcCall,
            appId,
            onNotify: notify,
            embedded: true,
            focus: view.focus
          })
        );
      default:
        return h("div", { className: "qbot-consoleOverview" }, overviewPane());
    }
  };
  const pickLeaf = (item) => {
    setSelected(item.children?.length ? item.children[0].id : item.id);
  };
  return h(
    "div",
    {
      className: "qbot-modalOverlay qbot-consoleOverlay"
    },
    h(
      "div",
      {
        className: "qbot-modal qbot-consoleModal",
        role: "dialog",
        "aria-modal": "true",
        "aria-label": t("console.title")
      },
      h(
        "div",
        { className: "qbot-modalHead" },
        h(
          "div",
          null,
          h("strong", null, fmt("console.titleBot", bot?.appIdMasked ?? "—")),
          h("p", null, t("console.hint"))
        ),
        h("button", {
          className: "qbot-modalClose",
          type: "button",
          "aria-label": t("common.close"),
          onClick: onClose
        }, "×")
      ),
      // 顶部悬浮提示：绝对定位脱离文档流，出现/消失不挤压内容，不抖动。
      notice ? h("div", {
        className: `qbot-detailToast qbot-consoleToast is-${notice.tone}`,
        role: notice.tone === "error" ? "alert" : "status",
        onClick: () => setNotice(null)
      }, notice.text) : null,
      h(
        "div",
        { className: "qbot-consoleBody" },
        h(
          "nav",
          { className: "qbot-consoleMenu", "aria-label": t("console.menuLabel") },
          ...NAV_TREE.map((g) => h(
            "div",
            { className: "qbot-consoleMenuGroup", key: g.id },
            h(
              "div",
              { className: "qbot-consoleMenuGroupTitle" },
              h("span", { className: "qbot-consoleMenuIcon", "aria-hidden": "true" }, g.icon),
              h("span", null, t(g.label))
            ),
            ...g.items.map((item) => {
              const isBranchActive = selected === item.id || item.children?.some((c) => c.id === selected);
              return h(
                "button",
                {
                  key: item.id,
                  type: "button",
                  className: `qbot-consoleMenuItem${isBranchActive ? " is-active" : ""}`,
                  "aria-current": isBranchActive ? "page" : void 0,
                  onClick: () => pickLeaf(item)
                },
                h("span", { className: "qbot-consoleMenuIcon", "aria-hidden": "true" }, item.icon),
                h("span", { className: "qbot-consoleMenuLabel" }, t(item.label))
              );
            })
          ))
        ),
        h(
          "div",
          { className: `qbot-consoleContent${isFill ? " is-fill" : ""}${view.kind === "overview" ? " is-overview" : ""}` },
          h(
            "div",
            { className: "qbot-consolePaneHead" },
            h(
              "div",
              null,
              h(
                "div",
                { className: "qbot-consoleCrumb" },
                t(path.group.label),
                path.parent ? h("span", null, h("i", null, "›"), t(path.parent.label)) : null,
                path.parent ? h("span", null, h("i", null, "›"), t(path.leaf.label)) : null
              ),
              h("h3", null, t(path.leaf.label))
            )
          ),
          // 子项从左侧竖排移到右侧顶部横向 tab（如「入群审批」「群规审核」的子页）。
          path.parent?.children?.length ? h(
            "div",
            { className: "qbot-consoleSubTabs", "aria-label": t(path.parent.label) },
            ...path.parent.children.map((child) => h("button", {
              key: child.id,
              type: "button",
              className: `qbot-consoleSubTab${selected === child.id ? " is-active" : ""}`,
              "aria-current": selected === child.id ? "page" : void 0,
              onClick: () => setSelected(child.id)
            }, t(child.label)))
          ) : null,
          h("div", { className: "qbot-consolePaneBody" }, content())
        )
      )
    )
  );
}

// src/client/dialogs/workspace-picker.tsx
var React16 = __toESM(require("react"), 1);
var COMPUTER_PATH = "__computer__";
function WorkspacePickerDialog(props) {
  const { rpcCall, initialPath, onClose, onPick } = props;
  const [picker, setPicker] = React16.useState({
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
  React16.useEffect(() => {
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
        picker.loading ? t("common.loading") : picker.selected || (picker.path === COMPUTER_PATH ? t("picker.computer") : picker.path) || "—"
      ),
      // 目录行包一层滚动容器：外层 .qbot-modalList 是 overflow:hidden 的定高框，
      // 不包内层 .qbot-modalListScroll(overflow-y:auto) 时内容超长会被裁掉、无滚动条。
      h(
        "div",
        { className: `qbot-modalList${picker.loading && picker.dirs.length > 0 ? " is-refreshing" : ""}` },
        h(
          "div",
          { className: "qbot-modalListScroll" },
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
        )
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
            // 「此电脑」虚拟层本身不可选定：未点选某个盘符时禁用「选定此文件夹」。
            disabled: picker.loading || !picker.path || picker.path === COMPUTER_PATH && !picker.selected,
            onClick: pickDirectory
          }, t("picker.chooseFolder"))
        )
      )
    )
  );
}

// src/client/right-panel/api.ts
var rpcCallRef = null;
function setRpcCall(fn) {
  rpcCallRef = fn;
}
function getRpcCall() {
  return rpcCallRef;
}

// src/client/workbench/schedule-view.tsx
var import_client = require("react-dom/client");

// src/client/right-panel/ScheduleTab.tsx
var React17 = __toESM(require("react"), 1);
var root = {
  display: "flex",
  flexDirection: "column",
  flex: "1 1 auto",
  minHeight: 0,
  boxSizing: "border-box",
  color: "inherit"
};
var body = {
  flex: "1 1 auto",
  minHeight: 0,
  display: "flex",
  flexDirection: "column"
};
function ScheduleTab(props) {
  const { toast } = props ?? {};
  useLocale();
  const [bots, setBots] = React17.useState([]);
  const [scopeAppId, setScopeAppId] = React17.useState("");
  const [loadingBots, setLoadingBots] = React17.useState(true);
  const [botError, setBotError] = React17.useState("");
  const loadBots = React17.useCallback(async () => {
    const call = getRpcCall();
    if (!call) return;
    setLoadingBots(true);
    setBotError("");
    try {
      const res = await call("bots.list");
      if (res.ok) {
        const v = val(res) ?? {};
        setBots(Array.isArray(v.bots) ? v.bots : []);
      } else {
        setBotError(errText(res.error));
      }
    } catch (e) {
      setBotError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoadingBots(false);
    }
  }, []);
  React17.useEffect(() => {
    void loadBots();
  }, [loadBots]);
  const forceScope = scopeAppId ? "current" : "all";
  const detailAppId = scopeAppId || "";
  const rpc = getRpcCall();
  return h(
    "div",
    // .qbot-schedPanel 声明容器查询作用域：面板拖拽宽度时按实际宽度响应式降级/升级布局。
    { className: "qbot-schedPanel", style: root },
    h(
      "div",
      { className: "qbot-schedToolbar" },
      h(
        "label",
        { className: "qbot-fieldInline", htmlFor: "qbot-sched-scope" },
        h("span", { className: "qbot-fieldInlineLabel" }, t("panel.scope")),
        h(
          "select",
          {
            id: "qbot-sched-scope",
            className: "qbot-settingSelect",
            value: scopeAppId,
            disabled: loadingBots && bots.length === 0,
            onChange: (ev) => setScopeAppId(String(ev.target.value)),
            "aria-label": t("panel.scope")
          },
          h("option", { value: "" }, t("sched.scopeAllBots")),
          bots.map(
            (b) => h("option", { key: b.appId, value: b.appId }, `${b.appIdMasked ?? b.appId}${b.primary ? " ★" : ""}`)
          )
        )
      ),
      h(
        "button",
        {
          className: "qbot-btn qbot-schedRefresh",
          type: "button",
          onClick: () => void loadBots(),
          disabled: loadingBots
        },
        loadingBots ? t("panel.loading") : t("common.refresh")
      )
    ),
    botError ? h("div", { className: "qbot-schedPanelError" }, botError) : rpc ? h(
      "div",
      { style: body, key: scopeAppId || "all" },
      h(ScheduleManager, { rpcCall: rpc, detailAppId, forceScope, toast })
    ) : h("div", { className: "qbot-modalState" }, t("panel.loading"))
  );
}

// src/client/workbench/schedule-view.tsx
var QQBOT_WORKBENCH_VIEW_ID = "@sunjuntao/dsh-qqbot.schedule";
function getWorkbenchApi() {
  try {
    const w = window;
    const api = w.__dshFileWorkbenchWorkbench__;
    if (api && api.activityBar && typeof api.activityBar.register === "function") return api;
  } catch {
  }
  return null;
}
var installed = false;
function installScheduleWorkbenchView() {
  if (installed) return;
  installed = true;
  const attempt = (n) => {
    const api = getWorkbenchApi();
    if (api) {
      api.activityBar.register({
        id: QQBOT_WORKBENCH_VIEW_ID,
        title: { zh: "QQ 定时消息", en: "QQ Scheduled Messages" },
        icon: "clock",
        order: 60,
        mount(el, ctx) {
          el.style.minHeight = "0";
          el.style.overflowY = "auto";
          el.style.overflowX = "hidden";
          el.style.position = "relative";
          el.style.boxSizing = "border-box";
          const onWheel = (e) => {
            if (!e.deltaY) return;
            const max = el.scrollHeight - el.clientHeight;
            if (max <= 1) return;
            const atTop = el.scrollTop <= 0;
            const atBottom = el.scrollTop >= max - 1;
            if (e.deltaY < 0 && atTop || e.deltaY > 0 && atBottom) return;
            const unit = e.deltaMode === 1 ? 18 : e.deltaMode === 2 ? el.clientHeight : 1;
            el.scrollTop += e.deltaY * unit;
            e.preventDefault();
            e.stopPropagation();
          };
          el.addEventListener("wheel", onWheel, { passive: false, capture: true });
          const KEY = "__qbotSchedReact__";
          const store = el;
          let entry = store[KEY];
          let container;
          let root2;
          if (entry && entry.root) {
            container = entry.container;
            root2 = entry.root;
          } else {
            container = document.createElement("div");
            container.className = "qbot-schedReactRoot";
            container.style.cssText = "min-height:100%;width:100%;box-sizing:border-box";
            el.appendChild(container);
            root2 = (0, import_client.createRoot)(container);
            store[KEY] = { root: root2, container };
          }
          root2.render(
            h(ScheduleTab, {
              toast: typeof ctx?.toast === "function" ? (lvl, msg) => ctx.toast(lvl, msg) : void 0
            })
          );
          return () => {
            el.removeEventListener("wheel", onWheel, { capture: true });
            try {
              store[KEY] = void 0;
            } catch {
            }
            try {
              root2.unmount();
            } catch {
            }
            try {
              container.remove();
            } catch {
            }
          };
        }
      });
      return;
    }
    if (n < 150) window.setTimeout(() => attempt(n + 1), 200);
  };
  attempt(0);
}

// src/client/workbench/sched-send-tasks.ts
var WS_PATH = "/qqbot-settings/events";
var RECONNECT_MAX_MS = 3e4;
var installed2 = false;
function installSchedSendTasks() {
  if (installed2 || typeof window === "undefined") return;
  installed2 = true;
  connectWithBackoff();
}
function connectWithBackoff() {
  let backoff = 1e3;
  const open = () => {
    let ws;
    try {
      ws = new WebSocket(`${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}${WS_PATH}`);
    } catch {
      scheduleReconnect();
      return;
    }
    ws.onopen = () => {
      backoff = 1e3;
    };
    ws.onmessage = (ev) => {
      handleFrame(typeof ev.data === "string" ? ev.data : "");
    };
    ws.onclose = () => scheduleReconnect();
    ws.onerror = () => {
      try {
        ws.close();
      } catch {
      }
    };
  };
  const scheduleReconnect = () => {
    setTimeout(open, backoff);
    backoff = Math.min(backoff * 2, RECONNECT_MAX_MS);
  };
  open();
}
function handleFrame(text) {
  if (!text) return;
  let event = "";
  let data = null;
  try {
    const parsed = JSON.parse(text);
    event = typeof parsed.event === "string" ? parsed.event : "";
    data = parsed.data ?? null;
  } catch {
    return;
  }
  if (event !== "sched-send") return;
  const info = data;
  if (!info || typeof info.summary !== "string") return;
  const api = getBackgroundTasks();
  if (!api) return;
  const detail = info.appId ? `${info.appId} · ${info.summary}` : info.summary;
  const task = api.start(t("sched.bg.send"), { detail });
  if (info.skipped) {
    task.done(info.reason ?? t("sched.bg.skipped"));
  } else if (info.ok) {
    task.done(t("sched.bg.sent"));
  } else {
    task.fail(info.reason ?? "failed");
  }
}

// src/client/index.tsx
var name = "qqbot-settings";
var inject = ["slots", "connection", "locale"];
var PLUGIN_AUTHOR = "master1Sun";
var PLUGIN_LICENSE = "MIT";
var PLUGIN_REPO_URL = "https://github.com/master1Sun/dsh-QQbot";
var RPC_CHANNEL = "/qqbot-settings";
var NOTICE_TTL_SECONDS = 8;
var GUILD_UI_VISIBLE2 = false;
var UPDATE_IDLE = { busy: false, message: "", done: false };
var updateStore = /* @__PURE__ */ (() => {
  let current = UPDATE_IDLE;
  const listeners2 = /* @__PURE__ */ new Set();
  return {
    snapshot() {
      return current;
    },
    publish(next) {
      current = next.busy ? next : UPDATE_IDLE;
      for (const listener of [...listeners2]) {
        try {
          listener(next);
        } catch {
        }
      }
    },
    subscribe(listener) {
      listeners2.add(listener);
      return () => {
        listeners2.delete(listener);
      };
    }
  };
})();
function publishUpdate(next) {
  updateStore.publish(next);
}
function QqbotSettingsTab({ rpcCall }) {
  const [status, setStatus] = React18.useState(null);
  const [bots, setBots] = React18.useState(null);
  const [catalogs, setCatalogs] = React18.useState(EMPTY_CATALOGS);
  const [form, setForm] = React18.useState({});
  const [page, setPage] = React18.useState("list");
  const [detailAppId, setDetailAppId] = React18.useState("");
  const [detailTab, setDetailTab] = React18.useState("runtime");
  const [scheduleOpen, setScheduleOpen] = React18.useState(false);
  const [archiveOpen, setArchiveOpen] = React18.useState(false);
  const [pickerOpen, setPickerOpen] = React18.useState(false);
  const [manifestOpen, setManifestOpen] = React18.useState(false);
  const [overrideEdit, setOverrideEdit] = React18.useState(null);
  const [notice, setNotice] = React18.useState("");
  const [platformOpen, setPlatformOpen] = React18.useState(false);
  const [guildOpen, setGuildOpen] = React18.useState(false);
  const [consoleOpen, setConsoleOpen] = React18.useState(false);
  const [modernUi, setModernUi] = React18.useState(() => {
    try {
      return window.localStorage.getItem("dsh-qqbot.ui.modern") !== "0";
    } catch {
      return true;
    }
  });
  const switchUiMode = (modern) => {
    try {
      window.localStorage.setItem("dsh-qqbot.ui.modern", modern ? "1" : "0");
    } catch {
    }
    setModernUi(modern);
    setConsoleOpen(false);
    setPage("list");
  };
  const [loadError, setLoadError] = React18.useState("");
  const [reconnecting, setReconnecting] = React18.useState(false);
  const [update, setLocalUpdate] = React18.useState(() => updateStore.snapshot());
  const setUpdate = publishUpdate;
  React18.useEffect(() => updateStore.subscribe(setLocalUpdate), []);
  const refresh = React18.useCallback(async (appId) => {
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
  React18.useEffect(() => {
    void refresh();
  }, [refresh]);
  React18.useEffect(() => {
    if (page !== "detail" && !consoleOpen) return void 0;
    if (!detailAppId) return void 0;
    let alive = true;
    rpcCall("config.get", { appId: detailAppId }).then((res) => {
      if (!alive) return;
      if (res.ok) setForm({ ...val(res)?.config ?? {} });
    });
    return () => {
      alive = false;
    };
  }, [page, consoleOpen, detailAppId, rpcCall]);
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
  const dialogOpenRef = React18.useRef(false);
  dialogOpenRef.current = Boolean(scheduleOpen || archiveOpen || pickerOpen || overrideEdit !== null || manifestOpen || platformOpen || guildOpen);
  React18.useEffect(() => {
    if (!notice || dialogOpenRef.current) return;
    const el = document.getElementById("qbot-notice");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [notice]);
  const noticeLeft = useCountdown(notice, NOTICE_TTL_SECONDS, () => setNotice(""));
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
      setConsoleOpen(false);
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
  React18.useEffect(() => {
    if (!update.message || update.busy) return void 0;
    const timer = setTimeout(() => publishUpdate({ ...update, message: "" }), NOTICE_TTL_SECONDS * 1e3);
    return () => clearTimeout(timer);
  }, [update]);
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
  const numSelect = (key, candidates, labelFn) => {
    const labels = fieldLabels();
    const helps = fieldHelp();
    return SettingRow({
      label: labels[key] ?? key,
      desc: helps[key] ?? "",
      control: h("select", {
        className: "qbot-settingSelect",
        value: String(form[key] ?? ""),
        onChange: (event) => void saveField(key, Number(event?.target?.value)),
        "aria-label": labels[key] ?? key
      }, withCurrent(candidates, form[key], labelFn).map((o) => h("option", { key: o.value, value: o.value }, o.label)))
    });
  };
  const detailBot = React18.useMemo(
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
  const runtimeAlert = bots && !bots.runtimeReady ? h(
    "div",
    { className: "qbot-statusNotice qbot-runtimeNotice", role: "alert" },
    h("strong", null, t("runtime.disabled")),
    h("span", null, t("runtime.disabledHint")),
    h("button", {
      className: "qbot-btn",
      type: "button",
      onClick: () => void refresh()
    }, t("runtime.recheck"))
  ) : null;
  const listView = h(
    "div",
    { className: "qbot-channelPage" },
    runtimeAlert,
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
              if (modernUi) setConsoleOpen(true);
              else {
                setDetailTab("runtime");
                setPage("detail");
              }
            }
          },
          h(
            "div",
            { className: "qbot-botCardHead" },
            h("span", { className: "qbot-botAvatar", "aria-hidden": "true" }, h(QqLogoGlyph)),
            h(
              "span",
              { className: "qbot-botCardTitle" },
              h("strong", null, bot.appIdMasked),
              h("span", { className: "qbot-botCardMeta" }, fmt(
                "notice.sourceSavedAt",
                bot.source === "qr" ? t("qr.tabScan") : t("qr.tabManual"),
                formatTime(bot.savedAt)
              ))
            )
          ),
          h(
            "div",
            { className: "qbot-botCardStatus" },
            StateLabel({ tone: st.tone, text: st.text }),
            h("span", { className: "qbot-botCardRole" }, bot.primary ? t("status.primaryBot") : bot.enabled ? t("status.enabled") : t("status.disabled"))
          ),
          h(
            "div",
            { className: "qbot-botCardFoot" },
            h("span", null, t("list.cardOpen")),
            h("span", { className: "qbot-botCardArrow", "aria-hidden": "true" }, "→")
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
      ) : null
    ),
    h("p", { className: "qbot-hint" }, t("list.cardHint"))
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
  const sectionCard = (title, desc, body2, action, opts) => h(
    "details",
    {
      className: opts?.danger ? "qbot-section is-danger" : "qbot-section",
      open: opts?.open ?? false
    },
    h(
      "summary",
      { className: "qbot-sectionHead" },
      h(
        "span",
        { className: "qbot-sectionIcon", "data-tone": opts?.tone ?? "info", "aria-hidden": "true" },
        opts?.icon ?? "◆"
      ),
      h(
        "div",
        { className: "qbot-sectionTitle" },
        h("h3", null, title),
        h("p", null, desc),
        opts?.summary ? h("span", { className: "qbot-sectionSummary" }, opts.summary) : null
      ),
      action ? h("div", { className: "qbot-sectionAction", onClick: (e) => e.stopPropagation() }, action) : null,
      h("span", { className: "qbot-sectionChevron", "aria-hidden": "true" }, "▸")
    ),
    h("div", { className: "qbot-sectionBody" }, body2)
  );
  const detailTabs = [
    { id: "runtime", label: t("detail.groupRuntime"), count: (status ? 1 : 0) + 2 },
    { id: "config", label: t("detail.groupConfig"), count: 5 },
    { id: "manage", label: t("detail.groupManage"), count: 2 }
  ];
  const detailTabBar = h(
    "div",
    { className: "qbot-detailTabs", role: "tablist" },
    detailTabs.map((tb) => h(
      "button",
      {
        key: tb.id,
        type: "button",
        role: "tab",
        className: `qbot-detailTab${detailTab === tb.id ? " is-active" : ""}`,
        "aria-selected": detailTab === tb.id ? "true" : "false",
        onClick: () => setDetailTab(tb.id)
      },
      h("span", null, tb.label),
      h("span", { className: "qbot-detailTabCount" }, String(tb.count))
    ))
  );
  const actionCard = (opts) => h(
    "button",
    {
      type: "button",
      className: "qbot-section qbot-actionCard",
      disabled: opts.disabled,
      onClick: opts.onClick
    },
    h("span", { className: "qbot-sectionIcon", "data-tone": opts.tone, "aria-hidden": "true" }, opts.icon),
    h(
      "span",
      { className: "qbot-sectionTitle" },
      h("span", { className: "qbot-actionCardTitle" }, opts.title),
      h("span", { className: "qbot-actionCardDesc" }, opts.desc),
      h("span", { className: "qbot-sectionSummary" }, opts.summary)
    ),
    h("span", { className: "qbot-sectionChevron", "aria-hidden": "true" }, "›")
  );
  const metricCard = (m) => h(
    "div",
    { className: "qbot-metric", "data-tone": m.tone, key: m.label },
    h(
      "div",
      { className: "qbot-metricTop" },
      h("span", { className: "qbot-metricIcon", "aria-hidden": "true" }, m.glyph ?? "·"),
      h("span", { className: "qbot-metricLabel" }, m.label)
    ),
    h("strong", { className: "qbot-metricValue" }, m.value),
    m.sub ? h("span", { className: "qbot-metricSub" }, m.sub) : null
  );
  const metrics = detailBot ? (() => {
    const c = detailBot.counters ?? { received: 0, sessions: 0, replies: 0, proactive: 0, errors: 0 };
    const buffered = Array.isArray(detailBot.groupBuffers) ? detailBot.groupBuffers.reduce((n, b) => n + Number(b?.buffered ?? 0), 0) : 0;
    const errors = Number(c.errors ?? 0);
    const pending = Number(detailBot.pendingReplies ?? 0);
    const passive = Number(c.replies ?? 0);
    const proact = Number(c.proactive ?? 0);
    const replyTotal = passive + proact;
    const share = (n) => replyTotal > 0 ? Math.round(n / replyTotal * 100) : 0;
    const todayKey = new Date(Date.now() + 8 * 60 * 60 * 1e3).toISOString().slice(0, 10);
    const todayCount = Number(detailBot.daily?.[todayKey] ?? 0);
    return [
      { label: t("stats.received"), value: String(c.received ?? 0), tone: "neutral", glyph: "◉", sub: fmt("console.ovToday", String(todayCount)) },
      { label: t("stats.sessions"), value: String(c.sessions ?? 0), tone: "neutral", glyph: "◇" },
      { label: t("stats.passive"), value: String(passive), tone: "success", glyph: "↩", sub: fmt("console.ovShare", `${share(passive)}%`) },
      { label: t("stats.proactive"), value: String(proact), tone: "neutral", glyph: "↗", sub: fmt("console.ovShare", `${share(proact)}%`) },
      { label: t("stats.bound"), value: String(detailBot.boundSessions ?? 0), tone: "neutral", glyph: "⧉" },
      { label: t("stats.pendingQueue"), value: String(pending), tone: pending > 0 ? "warning" : "neutral", glyph: "◷", sub: pending > 0 ? t("console.ovWaiting") : t("console.ovClear") },
      { label: t("stats.groupBuffer"), value: String(buffered), tone: "neutral", glyph: "▤" },
      { label: t("stats.errors"), value: String(errors), tone: errors > 0 ? "error" : "neutral", glyph: "!", sub: errors > 0 ? t("console.ovAttention") : t("console.ovNormal") }
    ];
  })() : [];
  const counters = detailBot?.counters ?? {};
  const statSummary = fmt(
    "detail.summaryStats",
    String(counters.received ?? 0),
    String(counters.replies ?? 0),
    String(counters.proactive ?? 0),
    String(counters.errors ?? 0)
  );
  const curModel = String(form.model ?? "").trim();
  const modelLabel = curModel ? catalogs.models.find((m) => m.id === curModel)?.label ?? curModel : t("session.followDefaultModel");
  const workspaceLabel = String(form.workspacePath ?? "").trim() ? t("detail.customWorkspace") : t("session.defaultWorkspace");
  const sessionSummary = fmt("detail.summarySession", modelLabel, workspaceLabel);
  const switches = switchDefs();
  const enabledSwitches = switches.filter((it) => Boolean(form[it.key] ?? it.def)).length;
  const policySummary = fmt("detail.summaryPolicy", String(enabledSwitches), String(switches.length));
  const groupSummary = fmt("detail.summaryGroup", String(Object.keys(groupOverrides).length));
  const connSummary = fmt(
    "detail.summaryConn",
    detailBot ? detailBot.enabled ? t("status.enabled") : t("status.disabled") : "—",
    wsLabel
  );
  const connectionPane = sectionCard(
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
    { danger: true, icon: "!", tone: "danger", summary: connSummary }
  );
  const configPanes = {
    session: sectionCard(
      t("session.title"),
      t("session.hint"),
      h(
        "div",
        { className: "qbot-settingList" },
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
              h("span", { className: "qbot-settingDesc" }, t("session.workspaceHint"))
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
          label: t("session.preset"),
          desc: t("session.presetHint"),
          control: h("select", {
            className: "qbot-settingSelect",
            value: String(form.agentPreset ?? ""),
            onChange: (e) => void saveField("agentPreset", e.target.value),
            "aria-label": t("session.preset")
          }, presetOptions(catalogs.agentPresets).map((o) => h("option", { key: o.value, value: o.value }, o.label)))
        })
      ),
      void 0,
      { icon: "◇", tone: "info", summary: sessionSummary }
    ),
    policy: sectionCard(
      t("policy.title"),
      t("policy.hint"),
      h(
        "div",
        { className: "qbot-settingList" },
        switches.map((it) => SettingRow({
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
        SettingRow({
          rowKey: "archiveMedia",
          label: t("feature.archiveMedia"),
          desc: t("feature.archiveMediaHint"),
          control: h(
            "select",
            {
              className: "qbot-settingSelect",
              value: String(form.archiveMedia ?? "off"),
              onChange: (e) => void saveField("archiveMedia", e.target.value),
              "aria-label": t("feature.archiveMedia")
            },
            h("option", { value: "off" }, t("feature.archiveMediaOff")),
            h("option", { value: "image" }, t("feature.archiveMediaImage")),
            h("option", { value: "imageVideo" }, t("feature.archiveMediaImageVideo")),
            h("option", { value: "all" }, t("feature.archiveMediaAll"))
          )
        }),
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
      ),
      void 0,
      { icon: "⇄", tone: "success", summary: policySummary }
    ),
    tune: sectionCard(
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
      void 0,
      { icon: "≋", tone: "warning", summary: t("detail.summaryTune") }
    ),
    override: sectionCard(
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
      void 0,
      { icon: "▦", tone: "info", summary: groupSummary }
    ),
    manifest: actionCard({
      icon: "{ }",
      tone: "business",
      title: t("manifest.entryTitle"),
      desc: t("manifest.entryDesc"),
      summary: t("manifest.entrySummary"),
      disabled: !detailBot,
      onClick: () => setManifestOpen(true)
    })
  };
  const detailView = h(
    "div",
    { className: "qbot-channelPage" },
    // ── 面包屑：只标位置。身份与状态统一由下方 hero 承载，避免三层重复 ──
    h(
      "div",
      { className: "qbot-detailNav" },
      h("button", { className: "qbot-btn", type: "button", onClick: () => {
        setPage("list");
        setNotice("");
      } }, t("add.backToList")),
      h(
        "div",
        { className: "qbot-detailCrumb" },
        h("span", { className: "qbot-detailCrumbSep", "aria-hidden": "true" }, "/"),
        h("span", null, detailBot ? detailBot.appIdMasked : t("detail.noneSelected"))
      )
    ),
    loadError ? h("div", { className: "qbot-statusNotice", role: "alert" }, loadError) : null,
    runtimeAlert,
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
        )
      ),
      // 状态压成一行：连接健康 / WebSocket / 最近连接，不再用表格状三格。
      h(
        "div",
        { className: "qbot-heroStatusLine" },
        h(
          "span",
          { className: "qbot-heroStatusItem" },
          h("span", { className: "qbot-stateDot", "data-tone": connState.tone }),
          h("span", { className: "qbot-heroStatusLabel" }, t("detail.connectionStatus")),
          h("strong", null, connState.text)
        ),
        h(
          "span",
          { className: "qbot-heroStatusItem" },
          h("span", { className: "qbot-stateDot", "data-tone": wsTone }),
          h("span", { className: "qbot-heroStatusLabel" }, "WebSocket"),
          h("strong", null, wsLabel)
        ),
        h(
          "span",
          { className: "qbot-heroStatusItem" },
          h("span", { className: "qbot-heroStatusLabel" }, t("detail.lastConnected")),
          h("strong", null, lastChecked)
        )
      ),
      cardSummary ? h(
        "div",
        { className: "qbot-heroFoot", id: "qbot-notice", role: "status" },
        h("span", { className: "qbot-noticeText", key: "text" }, cardSummary),
        notice ? countdownBadge(noticeLeft) : null
      ) : null
    ),
    // ── 横向 Tab：运行 / 配置 / 管理（默认「运行」），每个 Tab 只渲染自己的卡片 ──
    detailTabBar,
    h(
      "div",
      { className: "qbot-detailGrid", key: detailTab },
      ...detailTab === "runtime" ? [
        // ── 运行统计（持久化：跨重启累计，stats/<appId>.json；可复位清零） ──
        status ? sectionCard(
          t("stats.title"),
          t("stats.hint"),
          h(
            "div",
            { className: "qbot-metricGrid" },
            metrics.map((m) => metricCard(m))
          ),
          void 0,
          { icon: "▤", tone: "info", summary: statSummary }
        ) : null,
        // 定时消息 / 消息归档从 hero 收进「运行」组，整卡可点，入口唯一。
        actionCard({
          icon: "◷",
          tone: "success",
          title: t("detail.actionSchedule"),
          desc: t("detail.actionScheduleHint"),
          summary: t("detail.summarySchedule"),
          disabled: !detailBot,
          onClick: () => setScheduleOpen(true)
        }),
        actionCard({
          icon: "▣",
          tone: "warning",
          title: t("detail.actionArchive"),
          desc: t("detail.actionArchiveHint"),
          summary: t("detail.summaryArchive"),
          disabled: !detailBot,
          onClick: () => setArchiveOpen(true)
        })
      ] : detailTab === "config" ? [
        configPanes.session,
        configPanes.policy,
        configPanes.tune,
        configPanes.override,
        configPanes.manifest
      ] : [
        // ── 平台能力入口：整卡可点，群管理 / 通用能力在独立弹窗里操作 ──
        actionCard({
          icon: "⚡",
          tone: "success",
          title: t("pt.tabTitle"),
          desc: t("pt.tabHint"),
          summary: t("pt.tabSummary"),
          disabled: !detailBot,
          onClick: () => setPlatformOpen(true)
        }),
        // ── 频道管理入口：界面暂隐藏（能力保留），见 GUILD_UI_VISIBLE ──
        GUILD_UI_VISIBLE2 ? actionCard({
          icon: "◈",
          tone: "info",
          title: t("gv.title"),
          desc: t("gv.hint"),
          summary: t("gv.summary"),
          disabled: !detailBot,
          onClick: () => setGuildOpen(true)
        }) : null,
        // ── 连接与移除（放在管理 Tab 最下面；关于已移到页面底部页脚） ──
        connectionPane
      ]
    )
  );
  const addBotView = h(AddBotView, {
    rpcCall,
    notice,
    setNotice,
    onBotReady: async (appId) => {
      await refresh();
      setDetailAppId(appId);
      setDetailTab("runtime");
      if (modernUi) {
        setPage("list");
        setConsoleOpen(true);
      } else {
        setConsoleOpen(false);
        setPage("detail");
      }
    },
    onBack: () => setPage("list")
  });
  const pageFoot = h(
    "footer",
    { className: "qbot-pageFoot" },
    h(
      "div",
      { className: "qbot-pageFootBody" },
      h("span", null, `© ${(/* @__PURE__ */ new Date()).getFullYear()} ${PLUGIN_AUTHOR}`),
      h("span", { className: "qbot-pageFootDot" }, "·"),
      h("span", null, `${PLUGIN_LICENSE} License`),
      h("span", { className: "qbot-pageFootDot" }, "·"),
      h("a", {
        className: "qbot-aboutLink",
        href: PLUGIN_REPO_URL,
        target: "_blank",
        rel: "noreferrer noopener",
        "aria-label": t("detail.aboutRepo")
      }, "GitHub")
    ),
    h(
      "div",
      { className: "qbot-pageFootCopy" },
      t("detail.aboutCopyright"),
      h(
        "label",
        { className: "qbot-uiSwitch" },
        h("input", {
          type: "checkbox",
          className: "qbot-uiSwitchInput",
          checked: modernUi,
          onChange: (ev) => switchUiMode(ev.target.checked),
          "aria-label": modernUi ? t("ui.modernMode") : t("ui.legacyMode")
        }),
        h("span", { className: "qbot-uiSwitchTrack", "aria-hidden": "true" }),
        h(
          "span",
          { className: "qbot-uiSwitchLabel" },
          modernUi ? t("ui.modernMode") : t("ui.legacyMode")
        )
      )
    )
  );
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
            h("span", { className: "qbot-brandVersion" }, `v${true ? "3.0.2" : "0.0.2"}`),
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
    // 更新期间（busy）的提示条不自动淡出，并额外给出「请勿关闭」警示：
    // update.apply 会下载并覆盖安装目录，中途切走 / 关闭面板不影响宿主执行，
    // 但用户看不到结果、也容易误以为卡死，所以显式告知。
    update.message ? h(
      "div",
      {
        className: `qbot-infoNotice qbot-updateNotice${update.busy ? " is-busy" : ""}`,
        role: "status",
        "aria-busy": update.busy ? "true" : "false"
      },
      h("span", { className: "qbot-updateMsg" }, update.message),
      update.busy ? h("strong", { className: "qbot-updateKeepOpen" }, t("update.keepOpen")) : null
    ) : null,
    h(
      "div",
      { className: "qbot-panel", id: "qbot-panel" },
      page === "list" ? h(React18.Fragment, null, listView, pageFoot) : page === "add" ? h(React18.Fragment, null, addBotView, pageFoot) : h(React18.Fragment, null, detailView, pageFoot)
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
    // ── 配置清单（JSON 编辑）弹窗 ──
    manifestOpen ? h(ConfigManifestDialog, {
      appId: detailAppId,
      rpcCall,
      onClose: () => setManifestOpen(false),
      onSaved: () => {
        void refresh(detailAppId || void 0);
        setNotice(t("manifest.savedNotice"));
      }
    }) : null,
    // ── 平台能力弹窗（自包含组件：选群 / 群管理 / 通用能力） ──
    platformOpen ? h(PlatformToolsDialog, {
      rpcCall,
      appId: detailAppId || detailBot?.appId || "",
      groups: Array.isArray(form.allowGroups) ? form.allowGroups : [],
      onClose: () => setPlatformOpen(false)
    }) : null,
    // ── 频道管理弹窗（自包含组件：竖向 Tab 的频道 OpenAPI 能力） ──
    guildOpen ? h(GuildManagerDialog, {
      rpcCall,
      appId: detailAppId || detailBot?.appId || "",
      onClose: () => setGuildOpen(false)
    }) : null,
    // ── 机器人管理控制台弹窗（设置页卡片入口；左菜单 + 运营大屏） ──
    consoleOpen ? h(ConsoleDialog, {
      rpcCall,
      bot: detailBot,
      groups: Array.isArray(form.allowGroups) ? form.allowGroups : [],
      onClose: () => setConsoleOpen(false),
      onNotify: (text, _tone) => setNotice(text),
      configPanes,
      connectionPane,
      onConfigSaved: async () => {
        await refresh(detailAppId || void 0);
        setNotice(t("manifest.savedNotice"));
      }
    }) : null,
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
  setRpcCall(rpcCall);
  ctx.effect(() => installStyles(), "qqbot-settings: styles");
  ctx.effect(
    () => {
      let style = document.getElementById("qbot-settings-nav-style");
      if (!style) {
        style = document.createElement("style");
        style.id = "qbot-settings-nav-style";
        style.textContent = QBOT_SETTINGS_NAV_CSS;
        document.head.appendChild(style);
      }
      const disposeMarker = registerQbotSettingsNavIcon(() => t("app.title"));
      return () => {
        disposeMarker();
        style?.remove();
      };
    },
    "qqbot-settings: settings navigation icon"
  );
  ctx.slots.inject("settings.section", () => ctx.slots.register(
    {
      name: "settings.section",
      id: "dsh-qqbot",
      order: 31,
      // 宿主新版导航行自带系统图标（navIcon），label 契约是纯文本；
      // 这里不再内嵌 QqBotGlyph，否则会和宿主图标重复。
      label: () => t("app.title"),
      inject: () => ({ rpcCall })
    },
    QqbotSettingsTab
  ));
  installScheduleWorkbenchView();
  installSchedSendTasks();
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

