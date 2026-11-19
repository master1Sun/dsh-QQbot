/**
 * 频道违规词自动处置：按「机器人 + 频道」维度的配置 + 按月处置日志落盘。
 *
 * 与「频道 AI 接管」（guild-moderation，LLM 语义判定）完全独立：
 * 这里只做本地违规词表匹配，零模型调用；命中后禁言违规者本人 + 删除违规内容。
 *
 * 落盘结构：
 *  - ~/.dsh/qqbot/guild-keyword-mod.json                  配置
 *  - ~/.dsh/qqbot/guild-keyword-mod-logs/YYYY-MM.json      处置日志（按月）
 */
import { mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";
import { readStoreJson, writeStoreJson, pluginDataDir } from "../infra/store-file.js";

const CONFIG_PATH = () => join(pluginDataDir(), "guild-keyword-mod.json");
const LOG_DIR = () => join(pluginDataDir(), "guild-keyword-mod-logs");
const logPath = (month: string) => join(LOG_DIR(), `${month}.json`);

/** 单频道违规词自动处置配置。 */
export interface GuildKeywordConfig {
  /** 总开关。 */
  enabled: boolean;
  /** 违规词表：命中任意一个（子串匹配，忽略大小写）即处置。 */
  words: string[];
  /** 命中后禁言违规者的时长（分钟），0 = 不禁言只删除。 */
  muteMinutes: number;
  /** 是否删除违规内容（普通消息撤回 / 论坛帖子删除）。 */
  deleteContent: boolean;
  /**
   * 评论/回复命中时是否删除其所在的整个主题帖。
   * 官方无「删单条评论」接口，只能删整帖——会连带他人回复，默认关闭。
   */
  deleteThreadOnReply: boolean;
  /** 免处置成员 user id（白名单）。 */
  whitelist: string[];
  /** 只在这些子频道生效；空 = 全部。 */
  channelIds: string[];
}

/** 处置日志。 */
export interface GuildKeywordLog {
  at: string;
  appId: string;
  guildId: string;
  channelId: string;
  /** 平台消息 id（普通消息）或 thread_id（论坛）。 */
  targetId: string;
  /** 事件来源：message / forum_thread / forum_post / forum_reply。 */
  source: string;
  sender: string;
  senderName: string;
  content: string;
  /** 命中的违规词（可能多个）。 */
  matched: string[];
  /** 已执行的动作：mute / delete / delete_thread。 */
  actions: string[];
  /** 动作失败原因。 */
  errors: string[];
  muteMinutes: number;
}

const LOG_CAP = 300;

interface ConfigFile {
  configs: Record<string, GuildKeywordConfig>;
}

export function guildKeywordKey(appId: string, guildId: string): string {
  return `${appId || "?"}::${guildId || "?"}`;
}

function clampMin(v: unknown, fallback: number): number {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(30 * 24 * 60, Math.max(0, Math.round(n)));
}

export function defaultGuildKeywordConfig(): GuildKeywordConfig {
  return {
    enabled: false,
    words: [],
    muteMinutes: 60,
    deleteContent: true,
    deleteThreadOnReply: false,
    whitelist: [],
    channelIds: [],
  };
}

function normalizeConfig(raw: unknown): GuildKeywordConfig {
  const src = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  const d = defaultGuildKeywordConfig();
  const cleanList = (v: unknown): string[] => Array.isArray(v)
    ? v.filter((s): s is string => typeof s === "string" && s.trim().length > 0).map((s) => s.trim())
    : [];
  return {
    enabled: typeof src.enabled === "boolean" ? src.enabled : d.enabled,
    words: cleanList(src.words),
    muteMinutes: clampMin(src.muteMinutes, d.muteMinutes),
    deleteContent: typeof src.deleteContent === "boolean" ? src.deleteContent : d.deleteContent,
    deleteThreadOnReply: typeof src.deleteThreadOnReply === "boolean" ? src.deleteThreadOnReply : d.deleteThreadOnReply,
    whitelist: cleanList(src.whitelist),
    channelIds: cleanList(src.channelIds),
  };
}

function logMonth(log: GuildKeywordLog): string {
  const m = /^(\d{4}-\d{2})/.exec(typeof log?.at === "string" ? log.at : "");
  return m ? m[1]! : "unknown";
}

function sortAndCap(logs: GuildKeywordLog[]): void {
  logs.sort((a, b) => String(b?.at ?? "").localeCompare(String(a?.at ?? "")));
  if (logs.length > LOG_CAP) logs.length = LOG_CAP;
}

export class GuildKeywordStore {
  #file: ConfigFile | null = null;
  #logs: Map<string, GuildKeywordLog[]> | null = null;
  #loading: Promise<ConfigFile> | null = null;

  async #load(): Promise<ConfigFile> {
    if (this.#file) return this.#file;
    if (this.#loading) return this.#loading;
    this.#loading = this.#doLoad().finally(() => { this.#loading = null; });
    return this.#loading;
  }

  async #doLoad(): Promise<ConfigFile> {
    const raw = await readStoreJson<unknown>(CONFIG_PATH());
    const src = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
    const configsRaw = src.configs && typeof src.configs === "object" ? src.configs as Record<string, unknown> : {};
    const configs: Record<string, GuildKeywordConfig> = {};
    for (const [key, value] of Object.entries(configsRaw)) configs[key] = normalizeConfig(value);
    this.#file = { configs };
    await this.#initLogs();
    return this.#file;
  }

  async #initLogs(): Promise<void> {
    const map = new Map<string, GuildKeywordLog[]>();
    let names: string[] = [];
    try { names = await readdir(LOG_DIR()); } catch { /* 目录不存在 */ }
    for (const name of names) {
      const month = name.replace(/\.json$/, "");
      if (!/^\d{4}-\d{2}$/.test(month)) continue;
      try {
        const raw = await readStoreJson<unknown>(logPath(month));
        if (Array.isArray(raw)) {
          map.set(month, (raw as GuildKeywordLog[]).filter((l) => l && typeof l === "object" && !Array.isArray(l)));
        }
      } catch { /* 单月损坏跳过 */ }
    }
    for (const arr of map.values()) sortAndCap(arr);
    this.#logs = map;
  }

  async #writeLogMonth(month: string): Promise<void> {
    await mkdir(LOG_DIR(), { recursive: true });
    await writeStoreJson(logPath(month), this.#logs?.get(month) ?? []);
  }

  async #save(): Promise<void> {
    if (this.#file) await writeStoreJson(CONFIG_PATH(), this.#file);
  }

  async getConfig(appId: string, guildId: string): Promise<GuildKeywordConfig> {
    const file = await this.#load();
    return { ...(file.configs[guildKeywordKey(appId, guildId)] ?? defaultGuildKeywordConfig()) };
  }

  async setConfig(appId: string, guildId: string, raw: unknown): Promise<GuildKeywordConfig> {
    const file = await this.#load();
    const cfg = normalizeConfig(raw);
    file.configs[guildKeywordKey(appId, guildId)] = cfg;
    await this.#save();
    return cfg;
  }

  async appendLog(log: GuildKeywordLog): Promise<void> {
    await this.#load();
    const map = this.#logs ?? new Map<string, GuildKeywordLog[]>();
    this.#logs = map;
    const month = logMonth(log);
    const arr = map.get(month) ?? [];
    arr.unshift(log);
    if (arr.length > LOG_CAP) arr.length = LOG_CAP;
    map.set(month, arr);
    await this.#writeLogMonth(month);
  }

  async listLogs(filter: { appId?: string; guildId?: string; limit?: number } = {}): Promise<GuildKeywordLog[]> {
    await this.#load();
    const limit = Math.min(300, Math.max(1, Math.round(filter.limit ?? 100)));
    const all: GuildKeywordLog[] = [];
    for (const arr of (this.#logs ?? new Map()).values()) all.push(...arr);
    all.sort((a, b) => String(b?.at ?? "").localeCompare(String(a?.at ?? "")));
    return all
      .filter((l) => (!filter.appId || l.appId === filter.appId) && (!filter.guildId || l.guildId === filter.guildId))
      .slice(0, limit);
  }
}
