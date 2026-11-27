/**
 * 配置清单字段元数据（客户端专用，纯数据 + 校验函数）。
 *
 * 用途：
 *  1) 「配置清单」弹窗里列出当前机器人所有可配置字段，按用途分组，逐字段给出帮助说明；
 *  2) 保存前对用户编辑的 JSON 做「格式 / 类型 / 取值」三层校验，精确指出哪个字段错在哪。
 *
 * 字段集合必须与宿主 BOT_CONFIG_FIELDS（src/host/infra/store-file.ts）保持一致——
 * 那里定义了 config.get 会回读、config.save 会写回的全部字段。凭据类字段
 * （appId/appSecret/source/credentialSource/adminToken）不在其中，因此不 exposed。
 *
 * 帮助文案用 zh/en 二元组，渲染时按当前语言选取（避免模块级 t() 冻结语言）。
 */
import { MAX_REPLIES_CAP } from "../shared/passive-reply.js";

export type FieldType = "string" | "number" | "boolean" | "string[]" | "enum" | "object";

export interface ConfigFieldMeta {
  key: string;
  /** 分组 id（见 CONFIG_GROUPS）。 */
  group: string;
  type: FieldType;
  /** type=enum 时的合法取值。 */
  options?: readonly string[];
  /** type=number 时的合法区间（含端点）。 */
  min?: number;
  max?: number;
  /** [中文, English] 主说明：这个字段是干什么的。 */
  help: readonly [string, string];
  /** [中文, English] 配置示例：推荐写法 / 典型值。 */
  example?: readonly [string, string];
  /** [中文, English] 限制补充与配错的后果（取值范围由 min/max/options 自动生成，不必重复写）。 */
  notes?: readonly [string, string];
}

export interface ConfigFieldGroup {
  id: string;
  label: readonly [string, string];
  desc: readonly [string, string];
}

/** 按用途分组，帮助面板按此顺序展示。 */
export const CONFIG_GROUPS: readonly ConfigFieldGroup[] = [
  { id: "session", label: ["会话与模型", "Session & model"], desc: ["工作区、模型路由与权限预设", "Workspace, model routing & permission preset"] },
  { id: "access", label: ["接入与范围", "Access & scope"], desc: ["允许哪些群 / 用户、是否响应机器人", "Which groups / users are allowed, bot-to-bot replies"] },
  { id: "reply", label: ["消息与回复", "Messages & replies"], desc: ["回复格式、引用、上下文与全量回复策略", "Reply format, quoting, context & full-group policy"] },
  { id: "pacing", label: ["节奏与调优", "Pacing & tuning"], desc: ["冷却、分块、阈值与频次", "Cooldowns, chunking, thresholds & frequency"] },
  { id: "archive", label: ["归档", "Archive"], desc: ["消息与媒体落盘", "Message & media persistence"] },
  { id: "voice", label: ["语音与文件", "Voice & files"], desc: ["ASR / TTS、入站图片与文件内容识别", "ASR / TTS, inbound images & file ingestion"] },
  { id: "features", label: ["功能开关", "Feature toggles"], desc: ["欢迎语、审批按钮、记忆、撤回等", "Welcome, approval buttons, memory, recall & more"] },
  { id: "security", label: ["安全与权限", "Security & permissions"], desc: ["净化、SSRF、路径白名单、管理员", "Sanitization, SSRF, path whitelist, admins"] },
  { id: "advanced", label: ["高级 / 传输", "Advanced / transport"], desc: ["接口地址、体积上限等，通常无需修改", "API endpoints, size caps — normally leave as-is"] },
];

const ENUM_ARCHIVE_MEDIA = ["off", "image", "imageVideo", "all"] as const;
const ENUM_QUOTE = ["off", "at", "all"] as const;
const ENUM_VOICE = ["off", "note", "download", "asr", "stt"] as const;
const ENUM_LOCALE = ["zh", "en"] as const;

/**
 * 字段清单。顺序与分组仅影响帮助面板展示；校验以 key 为准。
 * 注意：model 在 config.get 里是 "provider/model[:cap]" 字符串，保存时也按字符串写回。
 */
export const CONFIG_FIELDS: readonly ConfigFieldMeta[] = [
  // ── 会话与模型 ──────────────────────────────────────────────────────────
  { key: "workspacePath", group: "session", type: "string",
    help: ["Agent 工作区绝对路径，留空使用宿主默认工作区。设置页有目录选择器可直接挑。", "Absolute path to the agent workspace; empty = host default. Use the directory picker in settings."],
    example: ["D:\\projects\\mybot（Windows）或 /home/me/agent（Linux）", "D:\\projects\\mybot (Windows) or /home/me/agent (Linux)"],
    notes: ["路径必须真实存在且可读写；填了不存在的目录会导致会话启动失败。留空最省心。", "The path must exist and be readable/writable; a bad path prevents the session from starting. Leave empty to be safe."] },
  { key: "agentPreset", group: "session", type: "string",
    help: ["Agent 预设 id，留空跟随宿主默认。可选值见设置页下拉。", "Agent preset id; empty = host default. See the dropdown in settings."],
    example: ["留空（默认）", "empty (default)"],
    notes: ["手填了下拉里没有的 id，会被宿主忽略或导致该会话加载失败，建议用下拉选。", "An id not in the dropdown is ignored or may break the session; prefer the dropdown."] },
  { key: "permissionPreset", group: "session", type: "string",
    help: ["工作区权限：会话的沙箱 + 审批权限预设 id，每个机器人独立。留空跟随宿主默认权限。设置页有下拉可直接选。", "Workspace permission: the sandbox + approval preset id for this bot's sessions. Empty = host default. Use the dropdown in settings."],
    example: ["workspace-write（默认，仅可在工作区内修改）", "workspace-write (default, write inside the workspace only)"],
    notes: ["常用取值：read-only=仅可查看；workspace-write=工作区内修改；danger-full-access=完全权限（不做审批）；auto=自动审查（实验性）。填了宿主不存在的 id 会让权限注入被跳过并回落到宿主默认。改完只对新建会话生效。", "Common values: read-only; workspace-write; danger-full-access (no approval prompts); auto (experimental review). An id the host does not know is skipped and falls back to the host default. Applies to new sessions only."] },
  { key: "model", group: "session", type: "string",
    help: ["显式模型路由，格式 \"provider/model[:输出token上限]\"，留空跟随默认模型。", "Explicit model route, format \"provider/model[:maxTokens]\"; empty = default model."],
    example: ["openai/gpt-4o:4096", "openai/gpt-4o:4096"],
    notes: ["缺少 \"/\" 或模型名写错会导致所有回复失败；冒号后是单次输出 token 上限，省略则用模型默认。", "Missing \"/\" or a bad model name breaks all replies. The part after \":\" is the max output tokens; omit to use the model default."] },
  { key: "secretEnv", group: "session", type: "string",
    help: ["环境变量名，运行时从该环境变量读取 AppSecret。一般留空（凭据已存 credentials.json）。", "Env var name to read AppSecret at runtime. Usually empty (credentials live in credentials.json)."],
    example: ["QQBOT_SECRET", "QQBOT_SECRET"],
    notes: ["填了变量名但系统里没有该环境变量，会导致启动时读不到密钥、连接失败。", "Naming a variable that does not exist makes startup fail to read the secret."] },

  // ── 接入与范围 ──────────────────────────────────────────────────────────
  { key: "allowC2c", group: "access", type: "boolean",
    help: ["是否处理单聊（私聊）消息。", "Whether to handle one-to-one (direct) messages."],
    example: ["true（默认，处理私聊）", "true (default, handle direct messages)"],
    notes: ["关闭后私聊消息被全部忽略，但群聊不受影响。", "Off ignores all direct messages; group chats are unaffected."] },
  { key: "allowGroups", group: "access", type: "string[]",
    help: ["允许响应的群 openid 列表。", "Group openids allowed to trigger replies."],
    example: ["[\"*\"]（默认，所有群）或 [\"<群openid>\"]", "[\"*\"] (default, all groups) or [\"<group openid>\"]"],
    notes: ["数组元素必须是字符串；[\"*\"] 放行所有群，填错 openid 会让对应群静默不回复。", "Elements must be strings. [\"*\"] allows all groups; a wrong openid silently silences that group."] },
  { key: "allowUsers", group: "access", type: "string[]",
    help: ["允许响应的用户 openid 列表。", "User openids allowed to trigger replies."],
    example: ["[\"*\"]（默认，所有用户）", "[\"*\"] (default, all users)"],
    notes: ["与 allowGroups 同时生效：两个列表都放行才会回复；openid 填错会导致该用户消息被忽略。", "Applied together with allowGroups: both must allow a message. A wrong openid silences that user."] },
  { key: "respondToBots", group: "access", type: "boolean",
    help: ["是否响应其它机器人发出的消息。默认关闭。", "Whether to reply to messages sent by other bots. Off by default."],
    example: ["false（默认，不响应机器人）", "false (default, ignore bots)"],
    notes: ["开启后其它机器人的消息也会触发回复，可能造成机器人之间互相刷屏、用量暴涨。", "On makes bots reply to each other, risking reply loops and a spike in usage."] },

  // ── 消息与回复 ──────────────────────────────────────────────────────────
  { key: "markdownReply", group: "reply", type: "boolean",
    help: ["允许用 QQ Markdown（msg_type=2）回复。开启后**按内容自动判定**：代码、表格、清单、粗体等才用 Markdown，日常闲聊走纯文本。", "Allow QQ Markdown (msg_type=2) replies. When on, the format is chosen per message by content: code, tables, lists and emphasis use Markdown, casual chat goes plain."],
    example: ["true（默认，按内容自动选择）", "true (default, chosen by content)"],
    notes: ["被平台拒绝时自动降级纯文本，无需手动关闭；关闭则所有回复都用纯文本。", "Rejected Markdown falls back to plain text automatically; turning this off forces plain text everywhere."] },
  { key: "quoteReply", group: "reply", type: "enum", options: ENUM_QUOTE,
    help: ["出站引用范围（仅群聊）。", "Outbound quote scope (groups only)."],
    example: ["\"at\"（默认，仅 @ 回复引用）", "\"at\" (default, quote @ replies only)"],
    notes: ["off=不引用；at=仅 @ 回复引用；all=每条回复都引用，视觉更啰嗦。填其它值会保存失败。", "off=none; at=@ replies only; all=quote every reply (more verbose). Other values fail validation."] },
  { key: "quoteMaxChars", group: "reply", type: "number", min: 20, max: 1000,
    help: ["入站引用注入模型的被引用原文字数上限，超长截断。", "Max chars of quoted original text injected into the model; truncated if longer."],
    example: ["120（默认）", "120 (default)"],
    notes: ["调太小引用被截得看不懂，调太大增加 token 消耗；必须是 20–1000 的整数。", "Too small truncates quotes unintelligibly; too large costs more tokens. Must be an integer in 20–1000."] },
  { key: "groupFullReply", group: "reply", type: "boolean",
    help: ["群全量消息价值回复总开关：关闭后群内只响应 @ 与命令。", "Master switch for value-based replies to all group messages. Off = only @ mentions and commands."],
    example: ["true（默认，全量回复）", "true (default, reply to all)"],
    notes: ["这是控制 token 用量的关键开关；关闭后群里不 @ 机器人就不会收到回复。", "Key switch for token usage. When off, the bot stays silent unless @ mentioned or given a command."] },
  { key: "proactiveFallback", group: "reply", type: "boolean",
    help: ["当被动回复凭证失效时，是否降级为主动消息重发。", "Whether to fall back to a proactive message if the passive-reply credential expires."],
    example: ["false（默认，不降级）", "false (default, no fallback)"],
    notes: ["降级依赖主动消息额度，额度不足时同样会失败；开启前请确认配额充足。", "Fallback uses the proactive quota; it still fails when the quota is exhausted."] },
  { key: "typingIndicator", group: "reply", type: "boolean",
    help: ["单聊处理期间发送「正在输入」状态，回复发出后停止。", "Show a typing indicator during direct-chat processing."],
    example: ["true（默认，单聊显示）", "true (default, shown in direct chat)"],
    notes: ["平台只支持单聊的「正在输入」状态，在群聊里开启也无效。", "The platform only supports this in direct chat; enabling it in groups has no effect."] },
  { key: "sanitizeReplies", group: "reply", type: "boolean",
    help: ["剥离模型输出中的 system-reminder、<think> 等隐藏标签块，防内部内容泄漏。", "Strip hidden tags such as system-reminder / <think> from model output to prevent leaks."],
    example: ["true（默认，剥离）", "true (default, strip)"],
    notes: ["关闭后可能把内部提示词 / 标签原样发到群里；除非调试，建议保持开启。", "Off may leak internal prompts/tags into the group; keep on unless debugging."] },
  { key: "replyLocale", group: "reply", type: "enum", options: ENUM_LOCALE,
    help: ["发给 QQ 用户的回复文案语言。", "Language of reply text sent to QQ users."],
    example: ["\"zh\"（默认，中文）", "\"zh\" (default, Chinese)"],
    notes: ["只影响发给用户的回复语言，不影响设置页界面语言；填其它值会保存失败。", "Affects only replies to users, not the settings UI language. Other values fail validation."] },
  { key: "atContextMessages", group: "reply", type: "number", min: 0, max: 50,
    help: ["群内 @ 机器人时附带的最近消息条数。", "How many recent group messages to attach on @ mention."],
    example: ["10（默认）", "10 (default)"],
    notes: ["0=不附带历史；调太大每次 @ 都带一堆消息，显著增加 token，必须是 0–50 的整数。", "0=no history. Too large drags in many messages per @ and costs more tokens. Integer 0–50."] },
  { key: "groupBufferMax", group: "reply", type: "number", min: 0, max: 200,
    help: ["每个群的上下文缓冲最大条数。", "Max buffered context messages per group."],
    example: ["50（默认）", "50 (default)"],
    notes: ["调太大长群的内存占用与 token 都会上升；0=不缓存上下文。必须是 0–200 的整数。", "Too large raises memory and token cost in busy groups. 0=no context. Integer 0–200."] },

  // ── 节奏与调优 ──────────────────────────────────────────────────────────
  { key: "valueThreshold", group: "pacing", type: "number", min: 0, max: 10,
    help: ["全量回复的价值评分阈值：达到才回复。", "Value-score threshold for full-group replies."],
    example: ["5（默认）", "5 (default)"],
    notes: ["调高回复更少、更省 token；设 0 则几乎每条都回、用量激增。必须是 0–10 的整数。", "Higher = fewer replies and less token; 0 replies to nearly everything. Integer 0–10."] },
  { key: "groupCooldownMs", group: "pacing", type: "number", min: 0, max: 1800000,
    help: ["同群两次全量回复的最小间隔（毫秒），@ 回复不受此限。", "Min interval between two full-group replies in ms; @ replies exempt."],
    example: ["60000（默认，1 分钟）", "60000 (default, 1 minute)"],
    notes: ["单位是毫秒（60000=1 分钟，上限 1800000=30 分钟）；调太小群内回复过于频繁，容易被平台限流。", "Unit is ms (60000=1 min, max 1800000=30 min). Too small spams replies and may hit rate limits."] },
  { key: "senderCooldownMs", group: "pacing", type: "number", min: 0, max: 1800000,
    help: ["同一发送者两次被全量回复的最小间隔（毫秒）。", "Min interval between full-group replies to the same sender in ms."],
    example: ["30000（默认，30 秒）", "30000 (default, 30 seconds)"],
    notes: ["专门防单人刷屏；0=不限制同一人。单位毫秒，上限 1800000（30 分钟）。", "Prevents one person from spamming. 0=no limit. Unit ms, max 1800000 (30 min)."] },
  { key: "replyChunkChars", group: "pacing", type: "number", min: 200, max: 4000,
    help: ["单条回复的最大字符数，超长自动分条发送。", "Max chars per reply message; longer replies are split."],
    example: ["1000（默认）", "1000 (default)"],
    notes: ["太小会把回复拆成很多条刷屏，太大可能超过 QQ 单条消息长度上限被拒。必须是 200–4000 的整数。", "Too small splits replies into many messages; too large may exceed QQ's per-message limit. Integer 200–4000."] },
  { key: "maxRepliesPerMessage", group: "pacing", type: "number", min: 1, max: MAX_REPLIES_CAP,
    help: ["单条用户消息最多触发几条回复。", "Max replies per user message."],
    example: ["5（默认）", "5 (default)"],
    notes: ["群默认上限 5 次；机器人为该群群主/管理员时平台放宽到 50 次（官方 20261117）；单聊每条消息固定 4 次。群内设为 ≥10 且机器人为该群群主/管理员时，助手会「边生成边发」分段提前发送（每段占 1 次）。填超过 50 会被校验拦下；调小可减少刷屏和用量。", "Groups default to 5; the platform raises the cap to 50 when the bot is the group owner/admin (official 2026-11-17 change). Direct chats are fixed at 4. In groups, a value ≥ 10 lets the bot send each finished section as it is written (when it is the group owner/admin), one reply slot per section. Values above 50 fail validation; lower values reduce spam and usage."] },
  { key: "quotaPerDay", group: "pacing", type: "number", min: 0, max: 100000,
    help: ["主动消息每日配额，超出后停止主动发送并告警。", "Daily proactive-message quota; stops sending with an alert when exceeded."],
    example: ["50（默认）", "50 (default)"],
    notes: ["只限制主动消息，被动回复不受影响；0=不限制（可能产生额外费用）。", "Limits proactive messages only; passive replies are unaffected. 0=unlimited (may cost more)."] },

  // ── 归档 ────────────────────────────────────────────────────────────────
  { key: "archiveEnabled", group: "archive", type: "boolean",
    help: ["是否开启消息本地归档（审计轨迹），写入 ~/.dsh/qqbot/archive/。", "Enable local message archiving (audit trail) under ~/.dsh/qqbot/archive/."],
    example: ["true（默认，开启）", "true (default, on)"],
    notes: ["关闭后不再写本地归档，历史消息无法追溯；开启会占用磁盘空间。", "Off stops archiving and loses the audit trail; on uses disk space."] },
  { key: "archiveMedia", group: "archive", type: "enum", options: ENUM_ARCHIVE_MEDIA,
    help: ["媒体保存级别。", "Media persistence level."],
    example: ["\"off\"（默认，仅文本）", "\"off\" (default, text only)"],
    notes: ["off=仅文本；image=含图片；imageVideo=含图片视频；all=全部文件（最占磁盘）。填其它值会保存失败。", "off=text only; image; imageVideo; all=every file (most disk). Other values fail validation."] },

  // ── 语音与文件 ──────────────────────────────────────────────────────────
  { key: "multimodalInbound", group: "voice", type: "boolean",
    help: ["是否把入站图片 / 文件转发进会话，让模型「看」到内容。", "Forward inbound images / files into the session so the model can see them."],
    example: ["true（默认，转发）", "true (default, forward)"],
    notes: ["关闭后模型看不到图片 / 文件内容；开启会增加 token 消耗并依赖模型的多模态能力。", "Off hides image/file content from the model; on costs more tokens and needs model vision support."] },
  { key: "voiceTranscription", group: "voice", type: "enum", options: ENUM_VOICE,
    help: ["语音处理方式。", "Voice handling mode."],
    example: ["\"note\"（默认，注入说明占位）", "\"note\" (default, placeholder)"],
    notes: ["off=忽略；note=占位说明；download=下载注入 URL；asr=外部 ASR；stt=OpenAI 兼容 STT。选 asr/stt 须先配好对应服务，否则语音转写失败。", "off=ignore; note=placeholder; download=URL; asr=external; stt=OpenAI-compatible STT. asr/stt need their service configured first."] },
  { key: "asrEndpoint", group: "voice", type: "string",
    help: ["外部 ASR 服务地址（POST {url} → {text}），voiceTranscription=asr 时使用。", "External ASR endpoint (POST {url} → {text}), used when voiceTranscription=asr."],
    example: ["https://asr.example.com/transcribe", "https://asr.example.com/transcribe"],
    notes: ["地址不可达或返回格式不符会导致语音处理失败；仅 asr 模式生效，其它模式可留空。", "An unreachable endpoint or bad response breaks voice processing. Only used in asr mode."] },
  { key: "sttBaseUrl", group: "voice", type: "string",
    help: ["STT 服务 Base URL（OpenAI 兼容），voiceTranscription=stt 时使用。", "STT service base URL (OpenAI-compatible), used when voiceTranscription=stt."],
    example: ["https://api.openai.com/v1", "https://api.openai.com/v1"],
    notes: ["须为 OpenAI 兼容的 /audio/transcriptions 服务根地址；填错会导致转写鉴权或连接失败。", "Must be an OpenAI-compatible /audio/transcriptions base; a wrong URL breaks transcription."] },
  { key: "sttApiKey", group: "voice", type: "string",
    help: ["STT 服务 API Key（Bearer），voiceTranscription=stt 时使用。", "STT service API key (Bearer), used when voiceTranscription=stt."],
    example: ["sk-xxxxxxxx", "sk-xxxxxxxx"],
    notes: ["密钥错误会鉴权失败、语音转不出文字；本地 STT 服务若无需密钥可留空。", "A wrong key fails auth and yields no transcript; leave empty for keyless local STT."] },
  { key: "sttModel", group: "voice", type: "string",
    help: ["STT 模型名。", "STT model name."],
    example: ["whisper-1（默认）", "whisper-1 (default)"],
    notes: ["模型名在服务里不存在会导致转写失败；仅 stt 模式生效。", "A model name missing from the service breaks transcription. Only used in stt mode."] },
  { key: "ttsReply", group: "voice", type: "boolean",
    help: ["单聊回复自动转语音（文字→TTS→语音气泡）；合成失败回退文字。", "Convert direct-chat replies to speech; falls back to text on synthesis failure."],
    example: ["false（默认，不转语音）", "false (default, text only)"],
    notes: ["只对单聊生效；语音服务未配置时合成失败，会自动回退成文字，不影响正常回复。", "Direct chat only. If TTS is unconfigured, synthesis fails and falls back to text."] },
  { key: "ttsBaseUrl", group: "voice", type: "string",
    help: ["TTS 服务 Base URL（OpenAI 兼容 /audio/speech）。", "TTS service base URL (OpenAI-compatible /audio/speech)."],
    example: ["https://api.openai.com/v1", "https://api.openai.com/v1"],
    notes: ["须为 OpenAI 兼容的服务根地址；填错会导致语音合成失败并回退文字。ttsReply=true 时需配置。", "Must be an OpenAI-compatible base; a wrong URL breaks synthesis and falls back to text. Needed when ttsReply=true."] },
  { key: "ttsApiKey", group: "voice", type: "string",
    help: ["TTS 服务 API Key（Bearer）。", "TTS service API key (Bearer)."],
    example: ["sk-xxxxxxxx", "sk-xxxxxxxx"],
    notes: ["密钥错误会合成失败并回退文字；本地无需密钥的服务可留空。", "A wrong key breaks synthesis and falls back to text; leave empty for keyless services."] },
  { key: "ttsModel", group: "voice", type: "string",
    help: ["TTS 模型名。", "TTS model name."],
    example: ["tts-1（默认）", "tts-1 (default)"],
    notes: ["模型名在服务里不存在会合成失败并回退文字。", "A model name missing from the service breaks synthesis and falls back to text."] },
  { key: "ttsVoice", group: "voice", type: "string",
    help: ["TTS 发音人（voice 参数）。", "TTS voice parameter."],
    example: ["alloy（默认）", "alloy (default)"],
    notes: ["发音人不存在通常会回退默认音色；可选值取决于所使用的 TTS 服务。", "An unknown voice usually falls back to the default timbre; options depend on the TTS service."] },
  { key: "fileIngestion", group: "voice", type: "boolean",
    help: ["收到文本类文件（txt/md/json/csv/代码等）时下载并截取内容注入模型。", "Download and inject text files (txt/md/json/csv/code) into the model context."],
    example: ["true（默认，读取文本）", "true (default, read text)"],
    notes: ["只处理文本类文件，二进制文件会被跳过；读取大文件会截取片段并增加 token。", "Only text files are read; binaries are skipped. Large files are truncated and cost tokens."] },

  // ── 功能开关 ────────────────────────────────────────────────────────────
  { key: "approvalButtons", group: "features", type: "boolean",
    help: ["AI 请求敏感操作时发送「允许 / 拒绝」按钮消息，点击回调回传决定。", "Send Allow/Deny button messages when the AI requests a sensitive action."],
    example: ["true（默认，发按钮）", "true (default, send buttons)"],
    notes: ["关闭后敏感操作不再发确认按钮；保持开启可避免 AI 误操作未经你确认。", "Off stops confirmation buttons for sensitive actions; keep on to avoid unconfirmed AI actions."] },
  { key: "welcomeEnabled", group: "features", type: "boolean",
    help: ["入群 / 加好友欢迎语开关。", "Enable welcome messages on group join / friend add."],
    example: ["true（默认，开启）", "true (default, on)"],
    notes: ["关闭后新成员入群 / 加好友不再发欢迎语；欢迎语内容见 welcomeMessage。", "Off stops welcome messages. The text is set by welcomeMessage."] },
  { key: "welcomeMessage", group: "features", type: "string",
    help: ["欢迎语模板，{nick} 会替换为新成员昵称。", "Welcome message template; {nick} is replaced with the nickname."],
    example: ["欢迎 {nick} 加入群聊！", "Welcome {nick} to the group!"],
    notes: ["留空则不发送；{nick} 之外的占位符不会替换，会原样显示。需 welcomeEnabled=true 才生效。", "Empty sends nothing. Placeholders other than {nick} stay literal. Needs welcomeEnabled=true."] },
  { key: "reactionRecall", group: "features", type: "boolean",
    help: ["用户用 🗑️ 表情回应机器人消息时撤回它。", "Recall a bot message when a user reacts to it with 🗑️."],
    example: ["true（默认，开启）", "true (default, on)"],
    notes: ["只能撤回机器人自己发的消息；机器人对该消息无撤回权限时操作会失败。", "Only the bot's own messages can be recalled; it fails without recall permission."] },
  { key: "bannedWords", group: "features", type: "string[]",
    help: ["群消息命中这些词时撤回并跳过回复（敏感词过滤）。", "Recall the message and skip replying when it contains any of these words."],
    example: ["[\"广告\", \"刷单\"]（默认空数组 []）", "[\"spam\", \"scam\"] (default empty [])"],
    notes: ["按子串匹配，命中即撤回且不调用 AI；词太短可能误伤正常消息，词表默认 []。", "Substring match: a hit is recalled with no AI call. Too-short words cause false positives. Default []."] },
  { key: "memoryEnabled", group: "features", type: "boolean",
    help: ["每聊天开启长期记忆（跨 /new 保留上下文）。", "Enable per-chat long-term memory (context survives /new)."],
    example: ["true（默认，开启）", "true (default, on)"],
    notes: ["关闭后每次 /new 都丢失上下文；开启会增加每轮记忆读取的 token。", "Off loses context on every /new; on adds memory-reading tokens each turn."] },
  { key: "guildMessageEvents", group: "features", type: "boolean",
    help: ["订阅频道私域全量消息事件 MESSAGE_CREATE。", "Subscribe to private-domain channel MESSAGE_CREATE events."],
    example: ["false（默认，关闭）", "false (default, off)"],
    notes: ["需私域权限；无权限却开启会导致 WebSocket 鉴权失败掉线，改动此值会强制重连。非私域机器人务必保持关闭。", "Requires private-domain permission. Enabling without it breaks the WebSocket auth and forces a reconnect. Keep off for public bots."] },
  { key: "forumEvents", group: "features", type: "boolean",
    help: ["订阅频道论坛事件 FORUM_*（用于新帖自动回帖与评论 @ 回复）。", "Subscribe to channel FORUM_* events (powers auto-reply to new posts and @mentions)."],
    example: ["false（默认，关闭）", "false (default, off)"],
    notes: ["需私域权限并开通论坛；无权限开启会掉线，改动此值会强制重连。非私域机器人务必保持关闭。", "Requires private-domain permission and forum access. Enabling without them breaks the connection and forces a reconnect."] },

  // ── 安全与权限 ──────────────────────────────────────────────────────────
  { key: "ssrfGuard", group: "security", type: "boolean",
    help: ["媒体 URL SSRF 防护：拒绝请求内网 / 保留地址。", "SSRF guard for media URLs: reject private / reserved addresses."],
    example: ["true（默认，开启防护）", "true (default, guard on)"],
    notes: ["关闭后媒体 URL 可能请求到内网地址，有 SSRF 安全风险；建议始终开启。", "Off lets media URLs reach internal addresses (SSRF risk). Keep it on."] },
  { key: "localPathWhitelist", group: "security", type: "boolean",
    help: ["本地路径白名单：qqbot_send_* 工具只能发送工作区 / 数据目录内的文件。", "Restrict qqbot_send_* tools to files inside the workspace / data directory."],
    example: ["false（默认，不限制）", "false (default, unrestricted)"],
    notes: ["开启后发送工作区外的文件会被拒绝；若 AI 总报「路径不在白名单」，可关闭或把文件移进工作区。", "On rejects files outside the workspace. If AI reports 'path not whitelisted', turn it off or move the file in."] },
  { key: "permissionInjection", group: "security", type: "boolean",
    help: ["「对话权限」注入：把 _default.md 包成指令块注入 prompt 顶部。", "Inject the conversation-permission block (_default.md) at the top of the prompt."],
    example: ["true（默认，注入）", "true (default, inject)"],
    notes: ["关闭后不再注入权限指令，AI 行为约束减弱；一般保持开启。", "Off skips the permission block and weakens AI constraints. Keep it on."] },
  { key: "permissionAdmins", group: "security", type: "string[]",
    help: ["权限管理员 openid 白名单。", "Permission-admin openid whitelist."],
    example: ["[]（默认，不设限）或 [\"<用户openid>\"]", "[] (default, no restriction) or [\"<user openid>\"]"],
    notes: ["空数组=不设限；[\"*\"]=所有人都是管理员；填入具体 openid 则仅这些人拥有管理员权限。", "Empty = no restriction; [\"*\"] = everyone is an admin; specific openids restrict admin rights to those users."] },

  // ── 高级 ───────────────────────────────────────────────────────────────
  { key: "archiveMediaMaxImageMB", group: "advanced", type: "number", min: 1, max: 512,
    help: ["归档单张图片体积上限 MB。需重启生效。", "Max archived image size in MB. Requires restart."],
    example: ["8（默认）", "8 (default)"],
    notes: ["超过上限的图片不归档，只保留记录；必须是 1–512 的整数。改完需重启宿主才生效。", "Oversized images are not archived (record only). Integer 1–512. Restart the host to apply."] },
  { key: "archiveMediaMaxVideoMB", group: "advanced", type: "number", min: 1, max: 2048,
    help: ["归档单个视频体积上限 MB。需重启生效。", "Max archived video size in MB. Requires restart."],
    example: ["64（默认）", "64 (default)"],
    notes: ["超过上限的视频不归档，只保留记录；必须是 1–2048 的整数。改完需重启宿主才生效。", "Oversized videos are not archived (record only). Integer 1–2048. Restart the host to apply."] },
  { key: "archiveMediaMaxFileMB", group: "advanced", type: "number", min: 1, max: 1024,
    help: ["归档其它文件体积上限 MB。需重启生效。", "Max archived file size in MB. Requires restart."],
    example: ["32（默认）", "32 (default)"],
    notes: ["超过上限的文件不归档，只保留记录；必须是 1–1024 的整数。改完需重启宿主才生效。", "Oversized files are not archived (record only). Integer 1–1024. Restart the host to apply."] },
  { key: "scheduleMaxPerChat", group: "advanced", type: "number", min: 0, max: 500,
    help: ["每个群 / 单聊允许的定时消息条数上限。", "Max scheduled messages per chat."],
    example: ["15（默认）", "15 (default)"],
    notes: ["达到上限后无法再新建定时任务；0=不限。必须是 0–500 的整数。", "No new schedules once the cap is hit; 0=unlimited. Integer 0–500."] },
  { key: "groupOverrides", group: "advanced", type: "object",
    help: ["按群覆盖配置：群 openid → 覆盖字段对象。仅允许聊天行为子集，缺省键跟随机器人默认。", "Per-group overrides: group openid → override object. Only a subset of chat fields; unset keys follow bot defaults."],
    example: ["{\"123456\": {\"groupFullReply\": false, \"valueThreshold\": 8}}", "{\"123456\": {\"groupFullReply\": false, \"valueThreshold\": 8}}"],
    notes: ["只可写允许的聊天字段（如 groupFullReply / valueThreshold / bannedWords 等），写其它字段会校验报错；openid 填错则该群不生效。", "Only approved chat fields are allowed (e.g. groupFullReply / valueThreshold / bannedWords); other fields fail validation, and a wrong openid has no effect."] },
];

/** 允许出现在 groupOverrides 里的字段（与 shared/config.ts GROUP_OVERRIDE_FIELDS 一致）。 */
export const GROUP_OVERRIDE_FIELDS: readonly string[] = [
  "groupFullReply", "valueThreshold", "groupCooldownMs", "senderCooldownMs",
  "atContextMessages", "replyChunkChars", "maxRepliesPerMessage",
  "markdownReply", "memoryEnabled", "bannedWords",
];

/** 校验问题的分类，渲染层据此生成中英提示。 */
export type IssueCode =
  | "syntax"        // JSON 语法错误
  | "notObject"     // 顶层不是对象
  | "unknown"       // 未知字段
  | "type"          // 类型不符
  | "enum"          // 枚举取值非法
  | "range"         // 数值越界
  | "override";     // groupOverrides 内部结构错误

export interface ManifestIssue {
  code: IssueCode;
  /** 出错字段路径，如 valueThreshold 或 groupOverrides.<openid>.bannedWords。 */
  path: string;
  /** 附加信息：期望类型 / 合法取值 / 区间 / 语法错误详情。 */
  detail?: string;
}

type ParsedResult =
  | { ok: true; value: Record<string, unknown>; issues: ManifestIssue[] }
  | { ok: false; value: undefined; issues: ManifestIssue[] };

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** 从 JSON.parse 的报错里提取行列，给出可读的语法错误详情。 */
function syntaxDetail(text: string, error: unknown): string {
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

/** 判断单个值是否符合字段类型，返回 IssueCode（无问题返回 null）。 */
function checkType(value: unknown, meta: ConfigFieldMeta): IssueCode | null {
  switch (meta.type) {
    case "string":
      return typeof value === "string" ? null : "type";
    case "number":
      // 后端 resolveConfig 对每个数值字段走 clampInt（只认安全整数），小数会被当无效值
      // 回落默认——必须在编辑器这层拦住，否则「保存成功但重开变默认值」。
      if (typeof value !== "number" || !Number.isSafeInteger(value)) return "type";
      if ((meta.min !== undefined && value < meta.min) || (meta.max !== undefined && value > meta.max)) return "range";
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

/** 类型期望的中文描述，用于错误提示。 */
export function expectText(meta: ConfigFieldMeta, lang: 0 | 1): string {
  const zh = meta.type === "string[]" ? "字符串数组" : meta.type === "boolean" ? "布尔值 true/false"
    : meta.type === "number" ? "整数" : meta.type === "object" ? "对象" : meta.type === "enum" ? "枚举值" : "字符串";
  const en = meta.type === "string[]" ? "array of strings" : meta.type === "boolean" ? "boolean true/false"
    : meta.type === "number" ? "integer" : meta.type === "object" ? "object" : meta.type === "enum" ? "enum value" : "string";
  return lang === 0 ? zh : en;
}

/** 校验 groupOverrides 内部结构，把问题 push 进 issues。 */
function checkOverrides(value: Record<string, unknown>, issues: ManifestIssue[]): void {
  for (const [openid, raw] of Object.entries(value)) {
    if (!isPlainObject(raw)) {
      issues.push({ code: "override", path: `groupOverrides.${openid}`, detail: "object" });
      continue;
    }
    for (const [field, val] of Object.entries(raw)) {
      if (!GROUP_OVERRIDE_FIELDS.includes(field)) {
        issues.push({ code: "unknown", path: `groupOverrides.${openid}.${field}` });
        continue;
      }
      const meta = CONFIG_FIELDS.find((m) => m.key === field);
      if (!meta) continue;
      // 覆盖里的数值字段允许省略，但出现时须类型正确；区间与主字段一致。
      const code = checkType(val, meta);
      if (code) issues.push({ code, path: `groupOverrides.${openid}.${field}` });
    }
  }
}

/**
 * 解析并校验用户编辑的 JSON 文本。
 * 语法错误时 ok=false（value 不可用）；结构 / 字段问题以 issues 返回，可继续展示。
 */
export function parseAndValidate(text: string): ParsedResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    return { ok: false, value: undefined, issues: [{ code: "syntax", path: "", detail: syntaxDetail(text, error) }] };
  }
  if (!isPlainObject(parsed)) {
    return { ok: false, value: undefined, issues: [{ code: "notObject", path: "" }] };
  }
  const value = parsed;
  const issues: ManifestIssue[] = [];
  const known = new Set(CONFIG_FIELDS.map((m) => m.key));

  // 未知字段：可能拼错，或写了不可通过 config.save 配置的系统级字段。
  for (const key of Object.keys(value)) {
    if (!known.has(key)) issues.push({ code: "unknown", path: key });
  }
  // 已知字段逐项校验。
  for (const meta of CONFIG_FIELDS) {
    if (!(meta.key in value)) continue;
    const code = checkType(value[meta.key], meta);
    if (code) issues.push({ code, path: meta.key, detail: typeDetail(meta) });
  }
  // 按群覆盖的结构校验。
  if (isPlainObject(value.groupOverrides)) checkOverrides(value.groupOverrides, issues);

  return { ok: true, value, issues };
}

function typeDetail(meta: ConfigFieldMeta): string {
  if (meta.type === "enum") return meta.options?.join(" | ") ?? "";
  if (meta.type === "number") return `[${meta.min ?? "-∞"}, ${meta.max ?? "∞"}]`;
  return "";
}
