/**
 * 插件配置：运行时解析。
 *
 * 配置来源合并（高 → 低）：cordis entry 配置 > config.json（设置界面保存）>
 * credentials.json（扫码 / 手动保存的凭据）> 环境变量（仅 appId/appSecret）> 默认值。
 * 解析是容错的：缺凭据不抛错（插件照常加载，状态接口提示未配置，引导扫码/填写）。
 */
/** 可选的显式模型路由，格式 "provider/model[:输出token上限]"。 */
export interface QqbotModelSelection {
    provider: string;
    model: string;
    maxTokens?: number;
}
/**
 * 按群覆盖配置：对特定群 openid 覆盖一部分行为字段，其余字段跟随机器人默认。
 * 只允许覆盖"聊天行为"子集（阈值/冷却/白名单/敏感词/Preset 等），
 * 不放行凭据、传输（apiBase/tokenUrl）、工作区等系统级字段。
 * 所有字段可选：缺省 = 跟随机器人级配置。
 */
export interface GroupOverrideConfig {
    groupFullReply?: boolean;
    valueThreshold?: number;
    groupCooldownMs?: number;
    senderCooldownMs?: number;
    atContextMessages?: number;
    replyChunkChars?: number;
    maxRepliesPerMessage?: number;
    markdownReply?: boolean;
    memoryEnabled?: boolean;
    bannedWords?: string[];
    /** 该群全量（非 @）消息使用的聊天 Preset。 */
    agentPresetChat?: string;
}
/** 群覆盖里允许出现的字段（写入/合并时的白名单，防止夹带系统级字段）。 */
export declare const GROUP_OVERRIDE_FIELDS: readonly ["groupFullReply", "valueThreshold", "groupCooldownMs", "senderCooldownMs", "atContextMessages", "replyChunkChars", "maxRepliesPerMessage", "markdownReply", "memoryEnabled", "bannedWords", "agentPresetChat"];
export interface QqbotConfig {
    appId: string;
    appSecret: string;
    secretEnv: string;
    /** 凭据来源（status 展示）：config / secretEnv / store / env / none。 */
    credentialSource: string;
    source: string;
    adminToken: string;
    workspacePath: string;
    agentPreset: string;
    /** 群全量非 AT 消息使用的聊天 Preset（不执行工具）；留空跟随 agentPreset。 */
    agentPresetChat: string;
    permissionPreset: string;
    model: QqbotModelSelection | null;
    allowC2c: boolean;
    allowGroups: string[];
    allowUsers: string[];
    /** 是否响应其他机器人发出的消息（默认关闭：忽略，防止机器人互相触发刷屏）。 */
    respondToBots: boolean;
    atContextMessages: number;
    groupBufferMax: number;
    replyChunkChars: number;
    maxRepliesPerMessage: number;
    proactiveFallback: boolean;
    /** 消息本地归档（审计轨迹），写入 ~/.dsh/qqbot/archive/。 */
    archiveEnabled: boolean;
    /** 回复优先用 QQ Markdown（msg_type=2），平台拒绝时逐条回退纯文本。 */
    markdownReply: boolean;
    /**
     * 出站引用范围（仅群聊生效，单聊一律不引用）：off=不引用；at=仅群 @ 回复引用（避免群全量刷屏）；
     * all=群聊全部回复都引用。引用通过 QQ 原生 message_reference 渲染为可点击定位的引用卡片。
     * 引用卡片与被动回复凭证 msg_id 同传（2026-09 实测矩阵：仅 message_reference 的主动消息通道
     * 手机端同一条内容出现两条；仅 msg_id 不显示引用；被动同传是唯一「有引用且只出现一次」的组合）。
     * 卡片发送失败自动降级为普通被动回复（无卡片，内容不丢）。
     * 入站引用（解析用户引用的上一条消息并注入上下文）不受此开关影响，始终生效。
     */
    quoteReply: "off" | "at" | "all";
    /** 入站引用上下文注入模型的被引用原文字数上限（超长截断）。 */
    quoteMaxChars: number;
    /** 群全量消息价值回复总开关。 */
    groupFullReply: boolean;
    /** 价值评分阈值（0–10）。 */
    valueThreshold: number;
    /** 同群两次全量回复最小间隔（毫秒）。 */
    groupCooldownMs: number;
    /** 同一发送者两次被回复最小间隔（毫秒）。 */
    senderCooldownMs: number;
    apiBase: string;
    tokenUrl: string;
    /** 入站图片/文件附件转发进会话（让模型"看"图）。 */
    multimodalInbound: boolean;
    /**
     * 语音消息处理方式：off=忽略；note=注入说明占位（优先平台自带转写）；
     * download=下载并注入 URL；asr=调用 asrEndpoint 转写（POST { url } → { text }）；
     * stt=下载音频本地转码后调用 OpenAI 兼容 /audio/transcriptions 转写（失败回退平台转写）。
     */
    voiceTranscription: "off" | "note" | "download" | "asr" | "stt";
    /** 外部语音转写服务（POST 音频字节/URL → 返回文本），voiceTranscription=asr 时使用。 */
    asrEndpoint: string;
    /** STT 服务 Base URL（OpenAI 兼容，如 https://api.openai.com/v1），voiceTranscription=stt 时使用。 */
    sttBaseUrl: string;
    /** STT 服务 API Key（Bearer），voiceTranscription=stt 时使用。 */
    sttApiKey: string;
    /** STT 模型名（如 whisper-1），voiceTranscription=stt 时使用。 */
    sttModel: string;
    /** 单聊回复自动转语音（文字 → TTS → 语音气泡）。合成失败自动回退文字回复。 */
    ttsReply: boolean;
    /** TTS 服务 Base URL（OpenAI 兼容 /audio/speech）。 */
    ttsBaseUrl: string;
    /** TTS 服务 API Key（Bearer）。 */
    ttsApiKey: string;
    /** TTS 模型名（如 tts-1 / gpt-4o-mini-tts）。 */
    ttsModel: string;
    /** TTS 发音人（OpenAI 兼容接口的 voice 参数）。 */
    ttsVoice: string;
    /** 单聊处理消息期间发送「正在输入」状态（QQ 平台能力仅限单聊），回复发出后停止。 */
    typingIndicator: boolean;
    /** 按钮审批：AI 请求执行敏感操作时发送「允许/拒绝」按钮消息，点击回调回传决定。 */
    approvalButtons: boolean;
    /** 文件内容识别：收到文本类文件（txt/md/json/csv/代码等）时下载并截取内容注入模型上下文。 */
    fileIngestion: boolean;
    /** 入群/加好友欢迎语开关。 */
    welcomeEnabled: boolean;
    /** 欢迎语模板（{nick} 占位昵称）。 */
    welcomeMessage: string;
    /** 用户用 🗑️ 表情回应机器人消息时撤回它。 */
    reactionRecall: boolean;
    /** 群消息命中这些词时撤回并跳过回复（敏感词过滤）。 */
    bannedWords: string[];
    /** 每聊天的长期记忆（跨 /new 保留上下文）。 */
    memoryEnabled: boolean;
    /**
     * 每个群/单聊允许的定时消息条数上限（0 = 不限，默认 15）。
     * 仅 bots.json 可配（设置页不展示）。
     */
    scheduleMaxPerChat: number;
    /** 主动消息每日配额（0=不限制）；超出后停止主动发送并告警。 */
    quotaPerDay: number;
    /** 发给 QQ 用户的回复文案语言：zh=中文（默认）；en=英文。 */
    replyLocale: "zh" | "en";
    /** 出站回复净化：剥离模型输出中的 system-reminder / <think> 等隐藏标签块（防内部内容泄漏）。 */
    sanitizeReplies: boolean;
    /** 媒体 URL SSRF 防护：拒绝请求内网/保留地址（qqbot_send_* 工具的 url 来源）。 */
    ssrfGuard: boolean;
    /** 本地路径白名单：qqbot_send_* 工具只能发送工作区/插件数据目录内的文件。 */
    localPathWhitelist: boolean;
    /** 「对话权限」注入：把 _default.md 包成指令块注入 prompt 顶部（openclaw 风格）。 */
    permissionInjection: boolean;
    /** 权限管理员 openid 白名单：空 = 不设限（任何人可改默认权限）；配了则仅名单内可改，"*" = 全部。 */
    permissionAdmins: string[];
    /** 按群覆盖配置：群 openid → 覆盖字段（仅聊天行为子集）。 */
    groupOverrides: Record<string, GroupOverrideConfig>;
}
/** "provider/model" 或 "provider/model:cap" → 显式模型路由；非法返回 null。 */
export declare function parseModelSelection(raw: string): QqbotModelSelection | null;
/**
 * QqbotModelSelection → "provider/model[:cap]"。
 * config.get 回读设置页用：生效配置里的 model 已解析为对象，
 * 设置页下拉期望与保存时一致的字符串形式，须反向序列化。
 */
export declare function stringifyModelSelection(model: QqbotModelSelection | null | undefined): string;
/** 容错解析按群覆盖配置：只保留白名单字段、数值 clamp、丢弃非法群 openid。 */
export declare function resolveGroupOverrides(raw: unknown): Record<string, GroupOverrideConfig>;
/**
 * 按群取生效配置：该群有覆盖时合并（群覆盖 > 机器人默认），否则原样返回。
 * 返回浅拷贝（有覆盖时），调用方可安全读取；不会修改传入对象。
 */
export declare function configForGroup(config: QqbotConfig, groupOpenid: string): QqbotConfig;
export interface ConfigOverrides {
    /** cordis entry 传入的显式配置（最高优先级，只取非空值）。 */
    entry?: Partial<QqbotConfig>;
    /** 设置界面 config.json。 */
    stored?: Record<string, unknown>;
    /** credentials.json（扫码 / 手动保存）。 */
    credentials?: {
        appId?: string;
        appSecret?: string;
    };
}
/** 容错解析：缺凭据不抛错，credentialSource 记录实际来源。 */
export declare function resolveConfig({ entry, stored, credentials }?: ConfigOverrides): QqbotConfig;
