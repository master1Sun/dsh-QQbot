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

/** 开关项说明：逐条写清开启/关闭后的实际行为。 */
export const SWITCH_DEFS: Array<{ key: string; label: string; desc: string; def: boolean }> = [
  {
    key: "groupFullReply",
    label: "群全量消息回复",
    desc: "开启后，群里没有 @ 机器人的消息也会参与价值评分，达到阈值才回复；@ 机器人的消息始终回复并可使用工具。关闭后，机器人只处理 @ 它的群消息。",
    def: true,
  },
  {
    key: "allowC2c",
    label: "接受单聊消息",
    desc: "是否响应 QQ 私聊（C2C）消息。关闭后机器人只处理群消息，私聊一律忽略。",
    def: true,
  },
  {
    key: "respondToBots",
    label: "响应机器人消息",
    desc: "开启后，其他机器人发出的消息也会触发本机器人回复。默认关闭：其他机器人的消息一律忽略，防止同群的多个机器人互相触发、循环刷屏。注意 QQ 平台在群聊里通常不向机器人推送其他机器人的消息，此开关只在平台确实推送时才有实际效果。",
    def: false,
  },
  {
    key: "markdownReply",
    label: "Markdown 回复",
    desc: "优先以 QQ Markdown 格式发送，排版更好看；若平台拒绝该格式，会自动降级为纯文本重发，不会丢消息。",
    def: true,
  },
  {
    key: "proactiveFallback",
    label: "被动失败转主动消息",
    desc: "被动回复超时或失败时，改用主动消息接口补发一次。主动消息每日配额极少，仅在排查问题时临时开启。",
    def: false,
  },
  {
    key: "archiveEnabled",
    label: "消息本地归档",
    desc: "把收到的消息与发出的回复写入 ~/.dsh/qqbot/archive/，作为审计轨迹留档，方便事后排查。",
    def: true,
  },
  {
    key: "multimodalInbound",
    label: "多模态消息",
    desc: "群里/私聊发来的图片、文件、语音会以附件形式注入会话上下文：视觉模型可以直接看图，语音优先使用平台自带转写文本。关闭后非文字内容只保留占位说明。",
    def: true,
  },
  {
    key: "memoryEnabled",
    label: "长期记忆",
    desc: "每个群/单聊维护一份持久记忆（跨 /new 保留）。对话里说「记住某事」AI 会自动写入；用 /记忆 查看、/清空记忆 清空。",
    def: true,
  },
  {
    key: "welcomeEnabled",
    label: "欢迎语",
    desc: "新成员进群或新好友添加时，机器人自动发送欢迎语（文案见下方输入框，{nick} 会替换为对方标识）。走主动消息通道，消耗每日配额。",
    def: false,
  },
  {
    key: "reactionRecall",
    label: "表情撤回",
    desc: "任何人对机器人发出的消息点 🗑️ 表情回应，机器人就撤回那条消息（需要平台的「消息撤回」权限）。",
    def: false,
  },
  {
    key: "sanitizeReplies",
    label: "回复内容净化",
    desc: "发送前剥离模型输出里的 system-reminder、<think> 等隐藏标签块，防止内部提示词与推理过程泄漏给聊天对象。仅影响发送内容，归档与模型上下文保留原文。",
    def: true,
  },
  {
    key: "ssrfGuard",
    label: "媒体链接安全校验（SSRF 防护）",
    desc: "AI 发图/发文件/发语音时，校验 URL 不指向内网或保留地址（127.0.0.1、192.168.x.x、169.254 元数据等），QQ 官方域名直通。防止模型被诱导让本机请求内网服务。关闭后仅要求 http/https 协议。",
    def: true,
  },
  {
    key: "localPathWhitelist",
    label: "本地文件路径白名单",
    desc: "AI 发图/发文件/发语音时，本机路径必须位于工作区目录或插件数据目录内，防止把任意本机文件（如凭据、密钥）发送给聊天对象。关闭后允许任意本机路径（不推荐）。",
    def: true,
  },
];

export const COOLDOWN_OPTIONS = [0, 10_000, 30_000, 60_000, 120_000, 300_000, 600_000, 1_800_000];

export function cooldownLabel(ms: number): string {
  if (ms === 0) return "不限制";
  if (ms % 60_000 === 0 && ms >= 60_000) return `${ms / 60_000} 分钟`;
  return `${ms / 1000} 秒`;
}
