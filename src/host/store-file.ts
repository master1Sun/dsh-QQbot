/**
 * 插件持久化存储（多机器人·全新结构）：
 *
 *   ~/.dsh/qqbot/bots.json    机器人库（唯一事实来源）
 *     { primaryAppId, bots: [{ appId, appSecret, source, savedAt, enabled, config }] }
 *   ~/.dsh/qqbot/global.json  全局项：管理令牌 + 新机器人默认配置
 *   ~/.dsh/qqbot/credentials.json  仅 CLI/调试导出的当前主机器人凭据（不再是配置来源）
 *
 * 设计要点：
 *  - 凭据/传输（appId、secret、secretEnv、apiBase、tokenUrl）与连接状态按机器人独立；
 *  - 行为配置（工作区目录 / 消息回复策略 / 回复调优）同样按机器人独立保存，每个机器人一份完整 config；
 *  - 全部机器人默认同时连接（enabled），不存在「只连一个」的切换语义。
 */
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

/** DSH 家目录下的插件数据目录。 */
export function pluginDataDir(): string {
  const home = process.env.HOME || process.env.USERPROFILE || homedir();
  const dshHome = process.env.DSH_HOME || join(home, ".dsh");
  return join(dshHome, "qqbot");
}

export const credentialsPath = () => join(pluginDataDir(), "credentials.json");
export const botsPath = () => join(pluginDataDir(), "bots.json");
export const globalPath = () => join(pluginDataDir(), "global.json");

async function readJson<T>(path: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as T;
  } catch {
    return null;
  }
}

/** 读取插件数据目录下的任意 JSON 文件。 */
export function readStoreJson<T>(path: string): Promise<T | null> {
  return readJson<T>(path);
}

/** 原子写入（tmp + rename），凭据文件限制 0600。 */
export async function writeJson(path: string, value: unknown, { privateFile = false } = {}): Promise<void> {
  await mkdir(pluginDataDir(), { recursive: true });
  const tmp = `${path}.tmp-${process.pid}`;
  const text = JSON.stringify(value, null, 2);
  await writeFile(tmp, text, privateFile ? { mode: 0o600 } : "utf8");
  if (!privateFile) await writeFile(tmp, text, "utf8");
  await rm(path, { force: true });
  await rename(tmp, path);
}

/** 原子写入插件数据目录下的任意 JSON 文件。 */
export function writeStoreJson(path: string, value: unknown): Promise<void> {
  return writeJson(path, value);
}

// ── 机器人库（bots.json）────────────────────────────────────────────────────

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
  /** "provider/model[:上限]"；留空跟随宿主默认模型。 */
  model?: string;
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
  /** 语音消息处理方式：off / note / download / asr。 */
  voiceTranscription?: "off" | "note" | "download" | "asr";
  /** 外部语音转写服务地址（voiceTranscription=asr 时使用）。 */
  asrEndpoint?: string;
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
  /** 按群覆盖配置：群 openid → 覆盖字段（聊天行为子集）。 */
  groupOverrides?: Record<string, unknown>;
  [key: string]: unknown;
}

/** 行为配置字段（config.get / config.save 序列化时统一引用，不含传输/凭据字段）。 */
export const BOT_CONFIG_FIELDS = [
  "workspacePath", "agentPreset", "agentPresetChat", "permissionPreset", "model", "secretEnv",
  "allowC2c", "allowGroups", "allowUsers", "atContextMessages", "groupBufferMax",
  "replyChunkChars", "maxRepliesPerMessage", "proactiveFallback", "archiveEnabled",
  "markdownReply", "groupFullReply", "valueThreshold", "groupCooldownMs", "senderCooldownMs",
  "quoteReply", "quoteMaxChars", "respondToBots",
  "multimodalInbound", "voiceTranscription", "asrEndpoint",
  "welcomeEnabled", "welcomeMessage", "reactionRecall", "bannedWords",
  "memoryEnabled", "quotaPerDay", "replyLocale",
  "sanitizeReplies", "ssrfGuard", "localPathWhitelist", "groupOverrides",
] as const;

/**
 * 行为配置默认值（与 config.ts resolveConfig 的缺省值一致）。
 * 建库 / 加载时把每个机器人 config 补齐到这份完整结构，使 bots.json 自包含、
 * 可直接作为文档阅读，避免「只存了改过的字段、其余靠运行时默认值」导致配置文件不全。
 * 注意：仅补齐「缺失」的字段，绝不强覆盖已显式设置的值。
 */
export const DEFAULT_BEHAVIOR_CONFIG: StoredBotConfig = {
  workspacePath: "",
  agentPreset: "",
  agentPresetChat: "",
  permissionPreset: "",
  model: "",
  secretEnv: "",
  allowC2c: true,
  allowGroups: ["*"],
  allowUsers: ["*"],
  atContextMessages: 10,
  groupBufferMax: 50,
  replyChunkChars: 1000,
  maxRepliesPerMessage: 5,
  proactiveFallback: false,
  archiveEnabled: true,
  markdownReply: true,
  quoteReply: "at",
  quoteMaxChars: 120,
  respondToBots: false,
  groupFullReply: true,
  valueThreshold: 5,
  groupCooldownMs: 60_000,
  senderCooldownMs: 30_000,
  multimodalInbound: true,
  voiceTranscription: "note",
  asrEndpoint: "",
  welcomeEnabled: false,
  welcomeMessage: "",
  reactionRecall: false,
  bannedWords: [],
  memoryEnabled: true,
  quotaPerDay: 50,
  replyLocale: "zh",
  sanitizeReplies: true,
  ssrfGuard: true,
  localPathWhitelist: true,
  groupOverrides: {},
};

/** 把行为配置补齐到完整结构（只填缺失键），返回是否发生过补齐。 */
export function ensureCompleteConfig(
  config: StoredBotConfig,
): { config: StoredBotConfig; changed: boolean } {
  const out: StoredBotConfig = { ...config };
  let changed = false;
  const defs = DEFAULT_BEHAVIOR_CONFIG as Record<string, unknown>;
  const cur = out as Record<string, unknown>;
  for (const f of BOT_CONFIG_FIELDS) {
    if (!(f in cur) || cur[f] === undefined || cur[f] === null) {
      const def = defs[f];
      // 对象/数组默认值（bannedWords / groupOverrides）逐 bot 克隆，避免共享可变引用。
      cur[f] = def !== null && typeof def === "object"
        ? (Array.isArray(def) ? [...def] : { ...def })
        : def;
      changed = true;
    }
  }
  return { config: out, changed };
}

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

function validBot(value: unknown): value is StoredBot {
  const b = value as Partial<StoredBot> | null;
  return Boolean(
    b
    && typeof b.appId === "string" && b.appId
    && typeof b.appSecret === "string" && b.appSecret
    && typeof b.enabled === "boolean"
    && b.config !== null && typeof b.config === "object",
  );
}

const EMPTY_BOTS: BotsFile = { bots: [] };

/** 读取机器人库；文件缺失或结构非法 → 空库（全新结构，不做旧格式迁移）。 */
export async function loadBotsFile(): Promise<BotsFile> {
  const raw = await readJson<BotsFile & { shared?: Record<string, unknown> | null }>(botsPath());
  const data = raw ?? null;
  if (!data || !Array.isArray(data.bots)) return { ...EMPTY_BOTS, bots: [] };
  let normalized = false;
  const bots = data.bots.filter(validBot).map((bot) => {
    const { config, changed } = ensureCompleteConfig(bot.config ?? {});
    if (changed) normalized = true;
    return {
      ...bot,
      source: bot.source === "qr" ? "qr" as const : "manual" as const,
      config,
    };
  });
  const primaryAppId = typeof data.primaryAppId === "string"
    && bots.some((b) => b.appId === data.primaryAppId)
    ? data.primaryAppId
    : bots[0]?.appId;
  const file: BotsFile = { primaryAppId, bots };

  // 兼容迁移：旧「全局共享」版把行为配置抽到顶层 shared、各机器人 config 被剥离。
  // 改回每机器人独立后，把 shared 重新并回每个机器人 config（shared 字段随后丢弃）。
  const legacy = data.shared && typeof data.shared === "object" ? data.shared : null;
  if (legacy && Object.keys(legacy).length > 0) {
    for (const bot of bots) {
      bot.config = { ...legacy, ...bot.config };
    }
    (file as BotsFile & { shared?: unknown }).shared = undefined;
    normalized = true;
  }
  // 补齐 / 迁移后统一落盘一次（已完整的配置不会触发，避免无谓写入）。
  if (normalized) await saveBotsFile(file);
  return file;
}

export async function saveBotsFile(file: BotsFile): Promise<BotsFile> {
  await writeJson(botsPath(), file, { privateFile: true });
  return file;
}

/** 插入或更新一个机器人（按 AppID 去重；已有条目保留 savedAt 与既有配置字段）。 */
export async function upsertBot(bot: StoredBot): Promise<BotsFile> {
  const file = await loadBotsFile();
  const index = file.bots.findIndex((b) => b.appId === bot.appId);
  if (index >= 0) {
    const prev = file.bots[index]!;
    file.bots[index] = {
      ...prev,
      ...bot,
      savedAt: prev.savedAt || bot.savedAt,
      // 先合并再补齐缺失键：prev 的显式值优先，seed 默认值只填补空缺。
      config: ensureCompleteConfig({ ...prev.config, ...bot.config }).config,
    };
  } else {
    file.bots.push(bot);
    // 第一个机器人自动成为主机器人。
    if (!file.primaryAppId) file.primaryAppId = bot.appId;
  }
  return saveBotsFile(file);
}

/** 局部合并某个机器人的行为配置（传 null 表示删除该键）。 */
export async function patchBotConfig(
  appId: string,
  patch: Record<string, unknown>,
): Promise<BotsFile> {
  const file = await loadBotsFile();
  const bot = file.bots.find((b) => b.appId === appId);
  if (!bot) return file;
  const next: StoredBotConfig = { ...bot.config };
  for (const [key, value] of Object.entries(patch)) {
    if (value === null) delete next[key];
    else next[key] = value as StoredBotConfig[string];
  }
  bot.config = next;
  return saveBotsFile(file);
}

/** 启用 / 停用某个机器人（停用即断开连接，配置保留）。 */
export async function setBotEnabled(appId: string, enabled: boolean): Promise<BotsFile> {
  const file = await loadBotsFile();
  const bot = file.bots.find((b) => b.appId === appId);
  if (!bot) return file;
  bot.enabled = enabled;
  return saveBotsFile(file);
}

/** 设定主机器人。 */
export async function setPrimaryBot(appId: string): Promise<BotsFile> {
  const file = await loadBotsFile();
  if (!file.bots.some((b) => b.appId === appId)) return file;
  file.primaryAppId = appId;
  return saveBotsFile(file);
}

/** 移除机器人；被移除的是主机器人时，主位顺延给第一个剩余的。 */
export async function removeBot(appId: string): Promise<BotsFile> {
  const file = await loadBotsFile();
  file.bots = file.bots.filter((b) => b.appId !== appId);
  if (file.primaryAppId === appId) file.primaryAppId = file.bots[0]?.appId;
  return saveBotsFile(file);
}
/** 取主机器人（显式 primary → 第一个）。 */
export function primaryBotOf(file: BotsFile): StoredBot | null {
  return file.bots.find((b) => b.appId === file.primaryAppId) ?? file.bots[0] ?? null;
}

// ── 全局配置（global.json）─────────────────────────────────────────────────

export async function loadGlobalConfig(): Promise<GlobalConfig> {
  return (await readJson<GlobalConfig>(globalPath())) ?? {};
}

export async function saveGlobalConfig(config: GlobalConfig): Promise<void> {
  await writeJson(globalPath(), config);
}

// ── 凭据导出（credentials.json，仅 CLI / 人工排查用）───────────────────────

export interface StoredCredentials {
  appId: string;
  appSecret: string;
  userOpenid?: string;
  savedAt: string;
  source: "qr" | "manual";
}

export async function loadCredentials(): Promise<StoredCredentials | null> {
  const data = await readJson<StoredCredentials>(credentialsPath());
  if (!data || typeof data.appId !== "string" || typeof data.appSecret !== "string") return null;
  if (!data.appId || !data.appSecret) return null;
  return data;
}

export async function saveCredentials(credentials: StoredCredentials): Promise<void> {
  await writeJson(credentialsPath(), credentials, { privateFile: true });
}

export async function clearCredentialsFile(): Promise<void> {
  await rm(credentialsPath(), { force: true });
}
