/**
 * 频道 AI 接管：按「机器人 + 频道」维度的配置 + 按月处罚日志落盘。
 *
 * 落盘结构：
 *  - ~/.dsh/qqbot/guild-moderation.json                       配置 + 累进计数
 *  - ~/.dsh/qqbot/guild-moderation-logs/YYYY-MM.json          处置日志（按发生月份）
 *
 * 与群审核（moderation.json）完全独立：频道 ID 体系、可用接口（禁言/撤回/警告）都不同。
 */
import { mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";
import { readStoreJson, writeStoreJson, pluginDataDir } from "../infra/store-file.js";

const CONFIG_PATH = () => join(pluginDataDir(), "guild-moderation.json");
const LOG_DIR = () => join(pluginDataDir(), "guild-moderation-logs");
const logPath = (month: string) => join(LOG_DIR(), `${month}.json`);

/** 违规分类（id 稳定，文案在客户端 dict）。 */
export const GUILD_MOD_CATEGORIES = [
  "illegal", "porn_gamble", "abuse", "ad_spam", "flood",
] as const;
export type GuildModCategory = (typeof GUILD_MOD_CATEGORIES)[number];

export type GuildMuteLevel = "none" | "light" | "medium" | "severe";

/** 命中违规后要执行的动作（可多选）。 */
export interface GuildActions {
  mute: boolean;   // 禁言成员（需管理员权限）
  recall: boolean; // 撤回违规消息（需管理员/频道主权限）
  warn: boolean;   // 在子频道发警告消息
}

/** 单频道 AI 接管配置。 */
export interface GuildModConfig {
  enabled: boolean;
  categories: string[];
  rules: string[];
  /** 三级禁言时长（分钟），严重级封顶 30 天。 */
  durations: { light: number; medium: number; severe: number };
  actions: GuildActions;
  /** 免审成员 user id。 */
  whitelist: string[];
  /** 只审核这些子频道；空 = 全部。 */
  channelIds: string[];
}

/** 处置日志。 */
export interface GuildModLog {
  at: string;
  appId: string;
  guildId: string;
  channelId: string;
  messageId: string;
  sender: string;
  senderName: string;
  content: string;
  level: GuildMuteLevel;
  reason: string;
  category: string;
  minutes: number;
  actions: string[];
  errors: string[];
  strikeCount: number;
  baseMinutes: number;
}

/** 单成员累进违规记录（机器人 + 频道 + 成员）。 */
export interface GuildStrike {
  count: number;
  totalMinutes: number;
  lastAt: string;
  lastLevel: string;
}

export const GUILD_MUTE_CAP_MINUTES = 30 * 24 * 60;
const STRIKE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const LOG_CAP = 300;
const STRIKE_CAP = 5000;

interface ConfigFile {
  configs: Record<string, GuildModConfig>;
  strikes: Record<string, GuildStrike>;
}

/** 配置键：机器人 + 频道。 */
export function guildModKey(appId: string, guildId: string): string {
  return `${appId || "?"}::${guildId || "?"}`;
}

function strikeKey(appId: string, guildId: string, sender: string): string {
  return `${guildModKey(appId, guildId)}::${sender || "?"}`;
}

function logMonth(log: GuildModLog): string {
  const at = log && typeof log.at === "string" ? log.at : "";
  const m = /^(\d{4}-\d{2})/.exec(at);
  return m ? m[1]! : "unknown";
}

function sortAndCap(logs: GuildModLog[]): void {
  logs.sort((a, b) => String(b?.at ?? "").localeCompare(String(a?.at ?? "")));
  if (logs.length > LOG_CAP) logs.length = LOG_CAP;
}

const clampMin = (v: unknown, fallback: number): number => {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(GUILD_MUTE_CAP_MINUTES, Math.max(1, Math.round(n)));
};

export function defaultGuildModConfig(): GuildModConfig {
  return {
    enabled: false,
    categories: [...GUILD_MOD_CATEGORIES] as string[],
    rules: [],
    durations: { light: 10, medium: 1440, severe: 43200 },
    actions: { mute: true, recall: false, warn: true },
    whitelist: [],
    channelIds: [],
  };
}

function normalizeConfig(raw: unknown): GuildModConfig {
  const src = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  const d = defaultGuildModConfig();
  const durationsRaw = src.durations && typeof src.durations === "object" ? src.durations as Record<string, unknown> : {};
  const actionsRaw = src.actions && typeof src.actions === "object" ? src.actions as Record<string, unknown> : {};
  return {
    enabled: typeof src.enabled === "boolean" ? src.enabled : d.enabled,
    categories: Array.isArray(src.categories)
      ? src.categories.filter((c): c is string => typeof c === "string" && (GUILD_MOD_CATEGORIES as readonly string[]).includes(c))
      : d.categories,
    rules: Array.isArray(src.rules)
      ? src.rules.filter((r): r is string => typeof r === "string" && r.trim().length > 0).map((r) => r.trim())
      : d.rules,
    durations: {
      light: clampMin(durationsRaw.light, d.durations.light),
      medium: clampMin(durationsRaw.medium, d.durations.medium),
      severe: clampMin(durationsRaw.severe, d.durations.severe),
    },
    actions: {
      mute: typeof actionsRaw.mute === "boolean" ? actionsRaw.mute : d.actions.mute,
      recall: typeof actionsRaw.recall === "boolean" ? actionsRaw.recall : d.actions.recall,
      warn: typeof actionsRaw.warn === "boolean" ? actionsRaw.warn : d.actions.warn,
    },
    whitelist: Array.isArray(src.whitelist)
      ? src.whitelist.filter((o): o is string => typeof o === "string" && o.trim().length > 0).map((o) => o.trim())
      : d.whitelist,
    channelIds: Array.isArray(src.channelIds)
      ? src.channelIds.filter((o): o is string => typeof o === "string" && o.trim().length > 0).map((o) => o.trim())
      : d.channelIds,
  };
}

function normalizeStrike(raw: unknown): GuildStrike {
  const src = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  return {
    count: Math.max(0, Math.min(10000, Math.round(Number(src.count) || 0))),
    totalMinutes: Math.max(0, Math.min(GUILD_MUTE_CAP_MINUTES, Math.round(Number(src.totalMinutes) || 0))),
    lastAt: typeof src.lastAt === "string" ? src.lastAt : "",
    lastLevel: typeof src.lastLevel === "string" ? src.lastLevel : "",
  };
}

function isExpired(strike: GuildStrike, now: number): boolean {
  if (!strike.lastAt) return true;
  const t = Date.parse(strike.lastAt);
  return !Number.isFinite(t) || now - t >= STRIKE_WINDOW_MS;
}

export class GuildModStore {
  #file: ConfigFile | null = null;
  #logs: Map<string, GuildModLog[]> | null = null;
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
    const configs: Record<string, GuildModConfig> = {};
    for (const [key, value] of Object.entries(configsRaw)) configs[key] = normalizeConfig(value);
    const strikesRaw = src.strikes && typeof src.strikes === "object" ? src.strikes as Record<string, unknown> : {};
    const strikes: Record<string, GuildStrike> = {};
    for (const [key, value] of Object.entries(strikesRaw)) strikes[key] = normalizeStrike(value);
    this.#file = { configs, strikes };
    await this.#initLogs();
    return this.#file;
  }

  async #initLogs(): Promise<void> {
    const map = new Map<string, GuildModLog[]>();
    let names: string[] = [];
    try { names = await readdir(LOG_DIR()); } catch { /* 目录不存在 */ }
    for (const name of names) {
      const month = name.replace(/\.json$/, "");
      if (!/^\d{4}-\d{2}$/.test(month)) continue;
      try {
        const raw = await readStoreJson<unknown>(logPath(month));
        if (Array.isArray(raw)) {
          map.set(month, (raw as GuildModLog[]).filter((l) => l && typeof l === "object" && !Array.isArray(l)));
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

  async getConfig(appId: string, guildId: string): Promise<GuildModConfig> {
    const file = await this.#load();
    return { ...(file.configs[guildModKey(appId, guildId)] ?? defaultGuildModConfig()) };
  }

  async setConfig(appId: string, guildId: string, raw: unknown): Promise<GuildModConfig> {
    const file = await this.#load();
    const cfg = normalizeConfig(raw);
    file.configs[guildModKey(appId, guildId)] = cfg;
    await this.#save();
    return cfg;
  }

  async removeConfig(appId: string, guildId: string): Promise<void> {
    const file = await this.#load();
    delete file.configs[guildModKey(appId, guildId)];
    await this.#save();
  }

  async listConfigs(): Promise<Array<{ key: string; appId: string; guildId: string; config: GuildModConfig }>> {
    const file = await this.#load();
    return Object.entries(file.configs).map(([key, config]) => {
      const sep = key.indexOf("::");
      return {
        key,
        appId: sep > 0 ? key.slice(0, sep) : "",
        guildId: sep > 0 ? key.slice(sep + 2) : key,
        config,
      };
    });
  }

  async appendLog(log: GuildModLog): Promise<void> {
    await this.#load();
    const map = this.#logs ?? new Map<string, GuildModLog[]>();
    this.#logs = map;
    const month = logMonth(log);
    const arr = map.get(month) ?? [];
    arr.unshift(log);
    if (arr.length > LOG_CAP) arr.length = LOG_CAP;
    map.set(month, arr);
    await this.#writeLogMonth(month);
  }

  async listLogs(filter: { appId?: string; guildId?: string; limit?: number } = {}): Promise<GuildModLog[]> {
    await this.#load();
    const limit = Math.min(300, Math.max(1, Math.round(filter.limit ?? 100)));
    const all: GuildModLog[] = [];
    for (const arr of (this.#logs ?? new Map()).values()) all.push(...arr);
    all.sort((a, b) => String(b?.at ?? "").localeCompare(String(a?.at ?? "")));
    return all
      .filter((l) => (!filter.appId || l.appId === filter.appId) && (!filter.guildId || l.guildId === filter.guildId))
      .slice(0, limit);
  }

  async getStrike(appId: string, guildId: string, sender: string): Promise<GuildStrike> {
    const file = await this.#load();
    const strike = normalizeStrike(file.strikes[strikeKey(appId, guildId, sender)]);
    return isExpired(strike, Date.now())
      ? { count: 0, totalMinutes: 0, lastAt: "", lastLevel: "" }
      : strike;
  }

  async recordStrike(appId: string, guildId: string, sender: string, minutes: number, level: string): Promise<GuildStrike> {
    const file = await this.#load();
    const key = strikeKey(appId, guildId, sender);
    const now = Date.now();
    const existing = normalizeStrike(file.strikes[key]);
    const prev = isExpired(existing, now)
      ? { count: 0, totalMinutes: 0, lastAt: "", lastLevel: "" }
      : existing;
    const next: GuildStrike = {
      count: Math.min(10000, prev.count + 1),
      totalMinutes: Math.min(GUILD_MUTE_CAP_MINUTES, prev.totalMinutes + Math.max(0, Math.round(minutes))),
      lastAt: new Date(now).toISOString(),
      lastLevel: level,
    };
    file.strikes[key] = next;
    const keys = Object.keys(file.strikes);
    if (keys.length > STRIKE_CAP) {
      const stale = keys
        .filter((k) => k !== key)
        .sort((a, b) => (file.strikes[a]?.lastAt ?? "").localeCompare(file.strikes[b]?.lastAt ?? ""))
        .slice(0, keys.length - STRIKE_CAP);
      for (const k of stale) delete file.strikes[k];
    }
    await this.#save();
    return next;
  }
}
