/**
 * 设置项元数据（纯数据，无 UI 逻辑）：
 * 字段标签 / 数值项说明 / 开关定义 / 冷却时长候选与文案。
 */

export const FIELD_LABELS: Record<string, string> = {
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
  quotaPerDay: "主动消息日配额",
};

/** 数值项说明：写清「影响什么 + 什么时候生效」，配置界面直接展示。 */
export const FIELD_HELP: Record<string, string> = {
  valueThreshold:
    "0–10 分。机器人给每条群消息打分，只有达到分数才会回复；分数越高越安静。设为 0 表示群里所有消息都回复（容易刷屏）。@ 机器人的消息不受此限制，一定会回复。",
  atContextMessages:
    "@ 机器人时，额外附带群里最近 N 条消息一起送给模型，让它听懂上下文。设为 0 则只发送被 @ 的这一条。条数越多越聪明，也越耗 token。",
  groupCooldownMs:
    "同一个群里，两次「非 @ 触发」的回复之间至少要隔这么久，用来防止机器人刷屏。@ 机器人的回复不受限制。",
  senderCooldownMs:
    "同一个人在这么短的时间内不会被回复第二次，避免被同一个人连续刷屏。",
  replyChunkChars:
    "QQ 单条消息有长度限制，超长的回复会按这个字数切成多条依次发送。太小会切得很碎，太大会被平台截断。",
  maxRepliesPerMessage:
    "一条用户消息最多触发几次被动回复（QQ 平台硬上限为 5）。调小可以避免机器人一次性连发多条。",
  quoteMaxChars:
    "文本引用最多显示多少字（仅主动消息回退为文本引用时使用；原生引用气泡由 QQ 客户端自行截断），超出部分以省略号结尾。",
  quotaPerDay:
    "单日最多发送多少条主动消息（定时消息、欢迎语、出箱补发、AI 发图都计入）。0 表示不限制——但 QQ 平台主动消息配额极少，超发会被限流，建议保持默认 50。",
};

/**
 * 开关项说明：逐条写清开启/关闭后的实际行为。
 *
 * 注意：以下配置项**刻意不出现在设置页**，只能通过 bots.json（配置文件）调整，
 * 界面不再提供开关（默认值见 shared/config.ts resolveConfig）：
 *   allowC2c（默认开）· markdownReply（默认开）· proactiveFallback（默认关）
 *   multimodalInbound（默认开）· welcomeEnabled（默认开）· reactionRecall（默认开）
 *   sanitizeReplies（默认开）· typingIndicator（默认开）· ttsReply（默认关）
 *   localPathWhitelist（默认关）· voiceTranscription（默认 note，平台转写）
 *   archiveEnabled（默认开）· memoryEnabled（默认开）· fileIngestion（默认开）
 * 另有以下**字段**（非开关）同样不出现在设置页：
 *   secretEnv（默认空，AppSecret 凭据引用）· agentPresetChat（默认空，群聊聊天 Preset，留空跟随 agentPreset）
 */
export const SWITCH_DEFS: Array<{ key: string; label: string; desc: string; def: boolean }> = [
  {
    key: "groupFullReply",
    label: "群全量消息回复",
    desc: "开启后，群里没有 @ 机器人的消息也会参与价值评分，达到阈值才回复；@ 机器人的消息始终回复并可使用工具。关闭后，机器人只处理 @ 它的群消息。",
    def: true,
  },
  {
    key: "respondToBots",
    label: "响应机器人消息",
    desc: "开启后，其他机器人发出的消息也会触发本机器人回复。默认关闭：其他机器人的消息一律忽略，防止同群的多个机器人互相触发、循环刷屏。注意 QQ 平台在群聊里通常不向机器人推送其他机器人的消息，此开关只在平台确实推送时才有实际效果。",
    def: false,
  },
  // archiveEnabled / memoryEnabled / fileIngestion 已从界面移除（默认常开，仅 bots.json 可配）——
  // 见本文件顶部注释；配置解析与默认值仍在 shared/config.ts 与 store-file.ts 中保留。
  {
    key: "approvalButtons",
    label: "按钮审批",
    desc: "AI 执行敏感操作前可发送「✅允许 / ❌拒绝」按钮消息，点击即回传决定；超时未点击视为拒绝。审批消息占用主动消息配额。",
    def: true,
  },
  {
    key: "ssrfGuard",
    label: "媒体链接安全校验（SSRF 防护）",
    desc: "AI 发图/发文件/发语音时，校验 URL 不指向内网或保留地址（127.0.0.1、192.168.x.x、169.254 元数据等），QQ 官方域名直通。防止模型被诱导让本机请求内网服务。关闭后仅要求 http/https 协议。",
    def: true,
  },
];

export const COOLDOWN_OPTIONS = [0, 10_000, 30_000, 60_000, 120_000, 300_000, 600_000, 1_800_000];

export function cooldownLabel(ms: number): string {
  if (ms === 0) return "不限制";
  if (ms % 60_000 === 0 && ms >= 60_000) return `${ms / 60_000} 分钟`;
  return `${ms / 1000} 秒`;
}
