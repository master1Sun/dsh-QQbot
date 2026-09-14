/** DSH 家目录下的插件数据目录。 */
export declare function pluginDataDir(): string;
export declare const credentialsPath: () => string;
export declare const botsPath: () => string;
export declare const globalPath: () => string;
/** 读取插件数据目录下的任意 JSON 文件。 */
export declare function readStoreJson<T>(path: string): Promise<T | null>;
/** 原子写入（tmp + rename），凭据文件限制 0600。 */
export declare function writeJson(path: string, value: unknown, { privateFile }?: {
    privateFile?: boolean | undefined;
}): Promise<void>;
/** 原子写入插件数据目录下的任意 JSON 文件。 */
export declare function writeStoreJson(path: string, value: unknown): Promise<void>;
/** 单个机器人的完整行为配置：字段与运行时 QqbotConfig 一一对应（均为可选，缺省走默认值）。 */
export interface StoredBotConfig {
    /** 工作区目录（DSH 会话读写的根目录）。 */
    workspacePath?: string;
    /** @ 与单聊消息使用的对话 Preset（可调用工具）。 */
    agentPreset?: string;
    /** 群全量非 AT 消息使用的聊天 Preset（不执行工具）；留空跟随 agentPreset。 */
    agentPresetChat?: string;
    /** 权限 Preset。 */
    permissionPreset?: string;
    /** 模型选择（设置页写入 { provider, model }）；兼容历史 "provider/model[:上限]" 字符串，留空跟随宿主默认模型。 */
    model?: {
        provider: string;
        model: string;
    } | string;
    /** AppSecret 的 DSH 凭据引用（优先级高于 appSecret 明文）。 */
    secretEnv?: string;
    /** 是否接受单聊（C2C）消息。 */
    allowC2c?: boolean;
    /** 允许回复的群 openid 白名单，"*" 表示全部。 */
    allowGroups?: string[];
    /** 允许回复的用户 openid 白名单，"*" 表示全部。 */
    allowUsers?: string[];
    /** @ 时附带的群最近消息条数（0 = 仅当前条）。 */
    atContextMessages?: number;
    /** 群消息缓冲最大条数（0 = 不缓冲）。 */
    groupBufferMax?: number;
    /** 单条回复分片字符数。 */
    replyChunkChars?: number;
    /** 每条用户消息最大被动回复次数。 */
    maxRepliesPerMessage?: number;
    /** 被动回复失败时改用主动消息补发。 */
    proactiveFallback?: boolean;
    /** 消息本地归档（审计轨迹）。 */
    archiveEnabled?: boolean;
    /** 回复优先用 QQ Markdown。 */
    markdownReply?: boolean;
    /** 出站引用范围：off=不引用；at=仅群 @；all=群聊全部回复。 */
    quoteReply?: "off" | "at" | "all";
    /** 引用原话的字数上限（20–1000）。 */
    quoteMaxChars?: number;
    /** 是否响应其他机器人发出的消息（默认忽略）。 */
    respondToBots?: boolean;
    /** 群全量消息价值回复总开关。 */
    groupFullReply?: boolean;
    /** 价值评分阈值（0–10）。 */
    valueThreshold?: number;
    /** 同群两次全量回复最小间隔（毫秒）。 */
    groupCooldownMs?: number;
    /** 同一发送者两次被回复最小间隔（毫秒）。 */
    senderCooldownMs?: number;
    /** 自定义 QQ API 网关地址（留空跟随默认值）。 */
    apiBase?: string;
    /** 自定义 token 换取地址（留空跟随默认值）。 */
    tokenUrl?: string;
    /** 入站图片/文件附件转发进会话（多模态）。 */
    multimodalInbound?: boolean;
    /** 语音消息处理方式：off / note / download / asr / stt。 */
    voiceTranscription?: "off" | "note" | "download" | "asr" | "stt";
    /** 外部语音转写服务地址（voiceTranscription=asr 时使用）。 */
    asrEndpoint?: string;
    /** STT 服务 Base URL（OpenAI 兼容 /audio/transcriptions，voiceTranscription=stt 时使用）。 */
    sttBaseUrl?: string;
    /** STT 服务 API Key（Bearer）。 */
    sttApiKey?: string;
    /** STT 模型名（默认 whisper-1）。 */
    sttModel?: string;
    /** 单聊回复自动转语音（文字 → TTS → 语音气泡）。 */
    ttsReply?: boolean;
    /** TTS 服务 Base URL（OpenAI 兼容 /audio/speech）。 */
    ttsBaseUrl?: string;
    /** TTS 服务 API Key（Bearer）。 */
    ttsApiKey?: string;
    /** TTS 模型名（默认 tts-1）。 */
    ttsModel?: string;
    /** TTS 发音人（voice 参数，默认 alloy）。 */
    ttsVoice?: string;
    /** 单聊「正在输入」状态（回复发出后停止）。 */
    typingIndicator?: boolean;
    /** 按钮审批开关（AI 敏感操作前发按钮消息等待点击）。 */
    approvalButtons?: boolean;
    /** 文件内容识别（文本类文件下载并注入上下文）。 */
    fileIngestion?: boolean;
    /** 入群/加好友欢迎语开关。 */
    welcomeEnabled?: boolean;
    /** 欢迎语模板（{nick} 占位昵称）。 */
    welcomeMessage?: string;
    /** 🗑️ 表情回应撤回机器人消息。 */
    reactionRecall?: boolean;
    /** 群消息命中即撤回并跳过回复。 */
    bannedWords?: string[];
    /** 每聊天长期记忆开关。 */
    memoryEnabled?: boolean;
    /** 主动消息每日配额（0=不限）。 */
    quotaPerDay?: number;
    /** 发给 QQ 用户的回复文案语言（zh/en）。 */
    replyLocale?: "zh" | "en";
    /** 出站回复净化（剥离 system-reminder / <think> 等隐藏块）。 */
    sanitizeReplies?: boolean;
    /** 媒体 URL SSRF 防护（拒绝内网/保留地址）。 */
    ssrfGuard?: boolean;
    /** 本地路径白名单（仅工作区/插件数据目录内的文件可发送）。 */
    localPathWhitelist?: boolean;
    /** 对话权限注入：把「用户权限设定」块 prepend 到会话 prompt（/perm 自助管理）。 */
    permissionInjection?: boolean;
    /** 权限管理员名单（openid 列表；空=不设限，任何人可用 /perm 修改；"*"=全部）。 */
    permissionAdmins?: string[];
    /** 按群覆盖配置：群 openid → 覆盖字段（聊天行为子集）。 */
    groupOverrides?: Record<string, unknown>;
    [key: string]: unknown;
}
/** 行为配置字段（config.get / config.save 序列化时统一引用，不含传输/凭据字段）。 */
export declare const BOT_CONFIG_FIELDS: readonly ["workspacePath", "agentPreset", "agentPresetChat", "permissionPreset", "model", "secretEnv", "allowC2c", "allowGroups", "allowUsers", "atContextMessages", "groupBufferMax", "replyChunkChars", "maxRepliesPerMessage", "proactiveFallback", "archiveEnabled", "markdownReply", "groupFullReply", "valueThreshold", "groupCooldownMs", "senderCooldownMs", "quoteReply", "quoteMaxChars", "respondToBots", "multimodalInbound", "voiceTranscription", "asrEndpoint", "sttBaseUrl", "sttApiKey", "sttModel", "ttsReply", "ttsBaseUrl", "ttsApiKey", "ttsModel", "ttsVoice", "typingIndicator", "approvalButtons", "fileIngestion", "welcomeEnabled", "welcomeMessage", "reactionRecall", "bannedWords", "memoryEnabled", "quotaPerDay", "replyLocale", "scheduleMaxPerChat", "sanitizeReplies", "ssrfGuard", "localPathWhitelist", "permissionInjection", "permissionAdmins", "groupOverrides"];
/**
 * 行为配置默认值（与 config.ts resolveConfig 的缺省值一致）。
 * 建库 / 加载时把每个机器人 config 补齐到这份完整结构，使 bots.json 自包含、
 * 可直接作为文档阅读，避免「只存了改过的字段、其余靠运行时默认值」导致配置文件不全。
 * 注意：仅补齐「缺失」的字段，绝不强覆盖已显式设置的值。
 */
export declare const DEFAULT_BEHAVIOR_CONFIG: StoredBotConfig;
/** 把行为配置补齐到完整结构（只填缺失键），返回是否发生过补齐。 */
export declare function ensureCompleteConfig(config: StoredBotConfig): {
    config: StoredBotConfig;
    changed: boolean;
};
export interface StoredBot {
    appId: string;
    appSecret: string;
    source: "qr" | "manual";
    savedAt: string;
    userOpenid?: string;
    /** 是否建立连接并收发消息（默认 true，可单独停用）。 */
    enabled: boolean;
    /** 该机器人独立的行为配置。 */
    config: StoredBotConfig;
}
export interface BotsFile {
    /** 主机器人：主动消息 / 定时消息未指定归属时的默认发送者。 */
    primaryAppId?: string;
    bots: StoredBot[];
}
/** 全局配置：目前只有 HTTP 管理端点令牌；其余配置一律按机器人独立保存。 */
export interface GlobalConfig {
    /** HTTP 管理端点令牌（/send 等）。 */
    adminToken?: string;
}
/** 读取机器人库；文件缺失或结构非法 → 空库（全新结构，不做旧格式迁移）。 */
export declare function loadBotsFile(): Promise<BotsFile>;
export declare function saveBotsFile(file: BotsFile): Promise<BotsFile>;
/** 插入或更新一个机器人（按 AppID 去重；已有条目保留 savedAt 与既有配置字段）。 */
export declare function upsertBot(bot: StoredBot): Promise<BotsFile>;
/** 局部合并某个机器人的行为配置（传 null 表示删除该键）。 */
export declare function patchBotConfig(appId: string, patch: Record<string, unknown>): Promise<BotsFile>;
/** 启用 / 停用某个机器人（停用即断开连接，配置保留）。 */
export declare function setBotEnabled(appId: string, enabled: boolean): Promise<BotsFile>;
/** 设定主机器人。 */
export declare function setPrimaryBot(appId: string): Promise<BotsFile>;
/** 移除机器人；被移除的是主机器人时，主位顺延给第一个剩余的。 */
export declare function removeBot(appId: string): Promise<BotsFile>;
/** 取主机器人（显式 primary → 第一个）。 */
export declare function primaryBotOf(file: BotsFile): StoredBot | null;
export declare function loadGlobalConfig(): Promise<GlobalConfig>;
export declare function saveGlobalConfig(config: GlobalConfig): Promise<void>;
export interface StoredCredentials {
    appId: string;
    appSecret: string;
    userOpenid?: string;
    savedAt: string;
    source: "qr" | "manual";
}
export declare function loadCredentials(): Promise<StoredCredentials | null>;
export declare function saveCredentials(credentials: StoredCredentials): Promise<void>;
export declare function clearCredentialsFile(): Promise<void>;
