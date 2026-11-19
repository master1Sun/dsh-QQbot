/**
 * 频道 AI 自动回帖：按「机器人 + 频道」配置，按月日志，持久化「已回过」指纹。
 *
 * 落盘结构：
 *  - ~/.dsh/qqbot/guild-reply.json                  配置 + 回帖指纹
 *  - ~/.dsh/qqbot/guild-reply-logs/YYYY-MM.json     回帖日志（按发生月份）
 *
 * once=true 时，同一个主题 / 帖子 / 文字消息只自动回一次；进程重启后依然有效。
 */
import { mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";
import { readStoreJson, writeStoreJson, pluginDataDir } from "../infra/store-file.js";

const CONFIG_PATH = () => join(pluginDataDir(), "guild-reply.json");
const LOG_DIR = () => join(pluginDataDir(), "guild-reply-logs");
const logPath = (month: string) => join(LOG_DIR(), `${month}.json`);

export interface GuildReplyConfig {
  /** 总开关。 */
  enabled: boolean;
  /** 新主题 / 新帖子 / 私域频道普通消息触发一次 AI 回帖。 */
  onPost: boolean;
  /** 评论 / 消息 @机器人时回复（论坛事件为 FORUM_REPLY_CREATE）。 */
  onMention: boolean;
  /** 同一主题 / 帖子只回一次（默认开）。@回复按单条评论单独计数。 */
  once: boolean;
  /** 频道自定义回帖要求（追加到系统提示词）。 */
  prompt: string;
  /** 免回帖成员 id。 */
  whitelist: string[];
  /** 只在这些子频道回帖；空 = 该频道全部子频道。 */
  channelIds: string[];
}

export interface GuildReplyLog {
  at: string;
  appId: string;
  guildId: string;
  channelId: string;
  /** post = 新帖；mention = @/评论。 */
  trigger: "post" | "mention";
  /** message / forum_thread / forum_post / forum_reply。 */
  source: string;
  key: string;
  sender: string;
  senderName: string;
  content: string;
  reply: string;
  messageId: string;
  ok: boolean;
  error: string;
}

interface ReplyMark {
  at: string;
  messageId: string;
}

interface ReplyFile {
  configs: Record<string, GuildReplyConfig>;
  replied: Record<string, ReplyMark>;
}

const REPLY_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const REPLY_CAP = 5000;
const LOG_CAP = 300;

export function guildReplyKey(appId: string, guildId: string): string {
  return `${appId || "?"}::${guildId || "?"}`;
}

export function defaultGuildReplyConfig(): GuildReplyConfig {
  return {
    enabled: false,
    onPost: true,
    onMention: true,
    once: true,
    prompt: "",
    whitelist: [],
    channelIds: [],
  };
}

function normalizeConfig(raw: unknown): GuildReplyConfig {
  const src = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  const d = defaultGuildReplyConfig();
  const list = (v: unknown): string[] => Array.isArray(v)
    ? v.filter((x): x is string => typeof x === "string" && x.trim().length > 0).map((x) => x.trim())
    : [];
  return {
    enabled: typeof src.enabled === "boolean" ? src.enabled : d.enabled,
    onPost: typeof src.onPost === "boolean" ? src.onPost : d.onPost,
    onMention: typeof src.onMention === "boolean" ? src.onMention : d.onMention,
    once: typeof src.once === "boolean" ? src.once : d.once,
    prompt: typeof src.prompt === "string" ? src.prompt.trim().slice(0, 2000) : d.prompt,
    whitelist: list(src.whitelist),
    channelIds: list(src.channelIds),
  };
}

function normalizeMark(raw: unknown): ReplyMark {
  const src = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  return { at: typeof src.at === "string" ? src.at : "", messageId: typeof src.messageId === "string" ? src.messageId : "" };
}

function logMonth(log: GuildReplyLog): string {
  const m = /^(\d{4}-\d{2})/.exec(String(log?.at ?? ""));
  return m ? m[1]! : "unknown";
}

function validMark(mark: ReplyMark, now: number): boolean {
  if (!mark.at) return false;
  const t = Date.parse(mark.at);
  return Number.isFinite(t) && now - t < REPLY_WINDOW_MS;
}

export class GuildReplyStore {
  #file: ReplyFile | null = null;
  #logs: Map<string, GuildReplyLog[]> | null = null;
  #loading: Promise<ReplyFile> | null = null;

  async #load(): Promise<ReplyFile> {
    if (this.#file) return this.#file;
    if (this.#loading) return this.#loading;
    this.#loading = this.#doLoad().finally(() => { this.#loading = null; });
    return this.#loading;
  }

  async #doLoad(): Promise<ReplyFile> {
    const raw = await readStoreJson<unknown>(CONFIG_PATH());
    const src = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
    const configsRaw = src.configs && typeof src.configs === "object" ? src.configs as Record<string, unknown> : {};
    const repliedRaw = src.replied && typeof src.replied === "object" ? src.replied as Record<string, unknown> : {};
    const configs: Record<string, GuildReplyConfig> = {};
    for (const [key, value] of Object.entries(configsRaw)) configs[key] = normalizeConfig(value);
    const replied: Record<string, ReplyMark> = {};
    const now = Date.now();
    for (const [key, value] of Object.entries(repliedRaw)) {
      const mark = normalizeMark(value);
      if (validMark(mark, now)) replied[key] = mark;
    }
    this.#file = { configs, replied };
    await this.#initLogs();
    return this.#file;
  }

  async #initLogs(): Promise<void> {
    const map = new Map<string, GuildReplyLog[]>();
    let names: string[] = [];
    try { names = await readdir(LOG_DIR()); } catch { /* 目录不存在 */ }
    for (const name of names) {
      const month = name.replace(/\.json$/, "");
      if (!/^\d{4}-\d{2}$/.test(month)) continue;
      try {
        const raw = await readStoreJson<unknown>(logPath(month));
        if (Array.isArray(raw)) {
          map.set(month, (raw as GuildReplyLog[]).filter((l) => l && typeof l === "object" && !Array.isArray(l)));
        }
      } catch { /* 单月损坏跳过 */ }
    }
    for (const arr of map.values()) arr.sort((a, b) => String(b?.at ?? "").localeCompare(String(a?.at ?? "")));
    this.#logs = map;
  }

  async #save(): Promise<void> {
    if (this.#file) await writeStoreJson(CONFIG_PATH(), this.#file);
  }

  async getConfig(appId: string, guildId: string): Promise<GuildReplyConfig> {
    const file = await this.#load();
    return { ...(file.configs[guildReplyKey(appId, guildId)] ?? defaultGuildReplyConfig()) };
  }

  async setConfig(appId: string, guildId: string, raw: unknown): Promise<GuildReplyConfig> {
    const file = await this.#load();
    const cfg = normalizeConfig(raw);
    file.configs[guildReplyKey(appId, guildId)] = cfg;
    await this.#save();
    return cfg;
  }

  /** 是否已经回过（30 天内有效）。 */
  async wasReplied(key: string): Promise<boolean> {
    if (!key) return false;
    const file = await this.#load();
    return validMark(normalizeMark(file.replied[key]), Date.now());
  }

  async markReplied(key: string, messageId: string): Promise<void> {
    if (!key) return;
    const file = await this.#load();
    file.replied[key] = { at: new Date().toISOString(), messageId: String(messageId ?? "").slice(0, 200) };
    const keys = Object.keys(file.replied);
    if (keys.length > REPLY_CAP) {
      const stale = keys
        .filter((k) => k !== key)
        .sort((a, b) => String(file.replied[a]?.at ?? "").localeCompare(String(file.replied[b]?.at ?? "")))
        .slice(0, keys.length - REPLY_CAP);
      for (const k of stale) delete file.replied[k];
    }
    await this.#save();
  }

  async appendLog(log: GuildReplyLog): Promise<void> {
    await this.#load();
    const map = this.#logs ?? new Map<string, GuildReplyLog[]>();
    this.#logs = map;
    const month = logMonth(log);
    const arr = map.get(month) ?? [];
    arr.unshift(log);
    if (arr.length > LOG_CAP) arr.length = LOG_CAP;
    map.set(month, arr);
    await mkdir(LOG_DIR(), { recursive: true });
    await writeStoreJson(logPath(month), arr);
  }

  async listLogs(filter: { appId?: string; guildId?: string; limit?: number } = {}): Promise<GuildReplyLog[]> {
    await this.#load();
    const limit = Math.min(300, Math.max(1, Math.round(filter.limit ?? 100)));
    const all: GuildReplyLog[] = [];
    for (const arr of (this.#logs ?? new Map()).values()) all.push(...arr);
    all.sort((a, b) => String(b?.at ?? "").localeCompare(String(a?.at ?? "")));
    return all
      .filter((l) => (!filter.appId || l.appId === filter.appId) && (!filter.guildId || l.guildId === filter.guildId))
      .slice(0, limit);
  }
}
