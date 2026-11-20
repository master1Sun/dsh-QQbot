/**
 * AI 群规审核：按「机器人 + 群」维度的配置与处罚日志落盘。
 *
 * 为什么独立于 bots.json 的 groupOverrides：
 *  - 审核配置是对象（分类/时长/白名单/规则），塞进 groupOverrides 白名单解析器会很别扭；
 *  - 处罚日志频繁追加，独立文件避免污染机器人配置文件；
 *  - 与行为配置解耦，便于将来单独清理/导出。
 *
 * 落盘结构：
 *  - ~/.dsh/qqbot/moderation.json          配置 + 累进违规计数（不再写日志）
 *  - ~/.dsh/qqbot/moderation-logs/YYYY-MM.json  处罚日志，按发生月份独立保存，每月保留最近 LOG_CAP 条
 * 旧版 moderation.json 内嵌的 logs 会在首次加载时迁移到对应月份文件（失败则保留旧字段，不丢数据）。
 * 读不到时返回空结构（容错，不阻断消息链路）。
 */
import { mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";
import { readStoreJson, writeStoreJson, pluginDataDir } from "../infra/store-file.js";
import {
  DEFAULT_ESCALATION, MUTE_MAX_MINUTES, normalizeEscalateSteps,
  type EscalateMode, type EscalationSettings,
} from "../../shared/moderation-escalation.js";

const MODERATION_PATH = () => join(pluginDataDir(), "moderation.json");
const LOG_DIR = () => join(pluginDataDir(), "moderation-logs");
const logPath = (month: string) => join(LOG_DIR(), `${month}.json`);

/** 内置违规分类（id 稳定，文案在客户端 dict）。 */
export const MODERATION_CATEGORIES = [
  "illegal",    // 违法违规
  "porn_gamble", // 色情赌博
  "abuse",      // 辱骂 / 人身攻击
  "ad_spam",    // 广告 / 垃圾信息
  "flood",      // 刷屏 / 骚扰
] as const;
export type ModerationCategory = (typeof MODERATION_CATEGORIES)[number];

export type MuteLevel = "none" | "light" | "medium" | "severe";

/** 单群审核配置。缺省字段在 normalize 时补齐。 */
export interface ModerationConfig extends EscalationSettings {
  enabled: boolean;
  /** 启用的内置分类 id（空 = 不启用内置分类，只看自定义群规）。 */
  categories: string[];
  /** 用户自定义群规（自然语言，逐条）。 */
  rules: string[];
  /** 三级禁言时长（分钟）；严重级上限 43200（30 天，平台限制）。 */
  durations: { light: number; medium: number; severe: number };
  /** 免审成员 openid（命中直接跳过，不调模型）。 */
  whitelist: string[];
  /** 判定尺度：lenient 宽松（默认，只判明确违规）/ normal 标准 / strict 严格。 */
  strictness: "lenient" | "normal" | "strict";
  /** 累进窗口天数：连续 N 天无新违规即从第 1 次重算（默认 30）。 */
  strikeWindowDays: number;
}

/** 处罚/审核日志。 */
export interface ModerationLog {
  at: string;
  appId: string;
  groupId: string;
  sender: string;
  senderName: string;
  content: string;
  level: MuteLevel;
  reason: string;
  category: string;
  /** 实际执行的禁言分钟数（0 = 未禁言）。 */
  minutes: number;
  /** 执行失败原因（禁言未成功但命中违规时记录）。 */
  error?: string;
  /** 群内 @ 通知发送失败原因（不影响禁言执行）。 */
  noticeError?: string;
  /** 该成员在本群的第几次违规（累进处罚）。 */
  strikeCount?: number;
  /** 累进前的等级基础时长（分钟），方便看出加重了多少。 */
  baseMinutes?: number;
  /** 本次是否真的因叠加惩罚而加重（关掉叠加或首犯时为 false）。 */
  escalated?: boolean;
}

/** 单个成员的累进违规记录（按 机器人 + 群 + 成员 独立计数）。 */
export interface ModerationStrike {
  count: number;
  totalMinutes: number;
  lastAt: string;
  lastLevel: string;
}

/** 单次禁言封顶：30 天（QQ 平台上限），分钟。 */
export const MUTE_CAP_MINUTES = MUTE_MAX_MINUTES;
/** 默认累进窗口：连续 30 天无新违规即清零重计（单群配置可覆盖）。 */
const DEFAULT_STRIKE_WINDOW_DAYS = 30;
/** 天数 → 毫秒。 */
const DAY_MS = 24 * 60 * 60 * 1000;

interface ModerationFile {
  configs: Record<string, ModerationConfig>;
  strikes: Record<string, ModerationStrike>;
  /** 旧版内嵌日志：迁移失败时暂存，写配置时回写，避免覆盖文件丢日志。 */
  legacyLogs?: ModerationLog[];
}

const LOG_CAP = 300;
const STRIKE_CAP = 5000;

/** 配置键：机器人 + 群。 */
export function modKey(appId: string, groupId: string): string {
  return `${appId || "?"}::${groupId || "?"}`;
}

/** 累进违规键：机器人 + 群 + 成员，成员之间互不影响。 */
export function strikeKey(appId: string, groupId: string, sender: string): string {
  return `${modKey(appId, groupId)}::${sender || "?"}`;
}

/** 日志归属月份：取 ISO 时间前 7 位（YYYY-MM）；异常时间落 unknown.json。 */
function logMonth(log: ModerationLog): string {
  const at = log && typeof log.at === "string" ? log.at : "";
  const m = /^(\d{4}-\d{2})/.exec(at);
  return m ? m[1]! : "unknown";
}

/** 日志按时间倒序，每月最多 LOG_CAP 条。 */
function sortAndCap(logs: ModerationLog[]): void {
  logs.sort((a, b) => String(b?.at ?? "").localeCompare(String(a?.at ?? "")));
  if (logs.length > LOG_CAP) logs.length = LOG_CAP;
}

/** 容错归一化的违规记录。 */
function normalizeStrike(raw: unknown): ModerationStrike {
  const src = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  return {
    count: Math.max(0, Math.min(10000, Math.round(Number(src.count) || 0))),
    totalMinutes: Math.max(0, Math.min(MUTE_CAP_MINUTES, Math.round(Number(src.totalMinutes) || 0))),
    lastAt: typeof src.lastAt === "string" ? src.lastAt : "",
    lastLevel: typeof src.lastLevel === "string" ? src.lastLevel : "",
  };
}

/**
 * 判断一条累进记录是否已过清零窗口（连续 N 天无新违规 → 清零重计）。
 * 用 lastAt（最后一次违规时间）作为窗口锚点：窗口内持续违规则 count 继续涨（时长受叠加封顶约束），
 * 一旦超过 N 天没违规，下次违规从第 1 次算起，避免次数无限叠加。
 */
function isStrikeExpired(strike: ModerationStrike, now: number, windowDays = DEFAULT_STRIKE_WINDOW_DAYS): boolean {
  if (!strike.lastAt) return true;
  const t = Date.parse(strike.lastAt);
  if (!Number.isFinite(t)) return true;
  return now - t >= Math.max(1, windowDays) * DAY_MS;
}

/** 默认配置：审核关闭、启用全部内置分类、三级时长 10 分钟 / 1 天 / 30 天，叠加惩罚沿用旧行为。 */
export function defaultConfig(): ModerationConfig {
  return {
    enabled: false,
    categories: [...MODERATION_CATEGORIES],
    rules: [],
    durations: { light: 10, medium: 1440, severe: 43200 },
    whitelist: [],
    strictness: "lenient",
    ...DEFAULT_ESCALATION,
    escalateSteps: [],
    strikeWindowDays: DEFAULT_STRIKE_WINDOW_DAYS,
  };
}

const clampMin = (v: unknown, fallback: number): number => {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(43200, Math.max(1, Math.round(n)));
};

/** 叠加系数：0.1–10，保留一位小数。 */
const clampFactor = (v: unknown, fallback: number): number => {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(10, Math.max(0.1, Math.round(n * 10) / 10));
};

/** 清零窗口天数：1–3650 天。 */
const clampWindowDays = (v: unknown, fallback: number): number => {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(3650, Math.max(1, Math.round(n)));
};

/** 归一化单群配置（容错：非法字段回退默认）。导出供「规则自测」复用草稿配置。 */
export function normalizeConfig(raw: unknown): ModerationConfig {
  const src = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  const d = defaultConfig();
  const durationsRaw = src.durations && typeof src.durations === "object" ? src.durations as Record<string, unknown> : {};
  return {
    enabled: typeof src.enabled === "boolean" ? src.enabled : d.enabled,
    categories: Array.isArray(src.categories)
      ? src.categories.filter((c): c is string => typeof c === "string" && (MODERATION_CATEGORIES as readonly string[]).includes(c))
      : d.categories,
    rules: Array.isArray(src.rules)
      ? src.rules.filter((r): r is string => typeof r === "string" && r.trim().length > 0).map((r) => r.trim())
      : d.rules,
    durations: {
      light: clampMin(durationsRaw.light, d.durations.light),
      medium: clampMin(durationsRaw.medium, d.durations.medium),
      severe: clampMin(durationsRaw.severe, d.durations.severe),
    },
    whitelist: Array.isArray(src.whitelist)
      ? src.whitelist.filter((o): o is string => typeof o === "string" && o.trim().length > 0).map((o) => o.trim())
      : d.whitelist,
    // 判定尺度：老配置没有该字段，默认宽松（减少误判），用户可在设置页调整。
    strictness: src.strictness === "normal" || src.strictness === "strict" ? src.strictness : d.strictness,
    // 叠加惩罚：老配置没有这些字段，回退默认（开启 + 线性系数 1 = 原来的 × 次数），行为不变。
    escalateEnabled: typeof src.escalateEnabled === "boolean" ? src.escalateEnabled : d.escalateEnabled,
    escalateMode: (["linear", "geometric", "custom"] as const).includes(src.escalateMode as EscalateMode)
      ? src.escalateMode as EscalateMode
      : d.escalateMode,
    escalateFactor: clampFactor(src.escalateFactor, d.escalateFactor),
    escalateSteps: normalizeEscalateSteps(src.escalateSteps),
    escalateCap: Math.round(clampMin(src.escalateCap, d.escalateCap)),
    strikeWindowDays: Math.round(clampWindowDays(src.strikeWindowDays, d.strikeWindowDays)),
  };
}

export class ModerationStore {
  #file: ModerationFile | null = null;
  /** month → 日志数组（时间倒序）。 */
  #logs: Map<string, ModerationLog[]> | null = null;
  #loading: Promise<ModerationFile> | null = null;

  async #load(): Promise<ModerationFile> {
    if (this.#file) return this.#file;
    if (this.#loading) return this.#loading;
    this.#loading = this.#doLoad().finally(() => { this.#loading = null; });
    return this.#loading;
  }

  async #doLoad(): Promise<ModerationFile> {
    const raw = await readStoreJson<unknown>(MODERATION_PATH());
    const src = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
    const configsRaw = src.configs && typeof src.configs === "object" ? src.configs as Record<string, unknown> : {};
    const configs: Record<string, ModerationConfig> = {};
    for (const [key, value] of Object.entries(configsRaw)) {
      configs[key] = normalizeConfig(value);
    }
    const strikesRaw = src.strikes && typeof src.strikes === "object" ? src.strikes as Record<string, unknown> : {};
    const strikes: Record<string, ModerationStrike> = {};
    for (const [key, value] of Object.entries(strikesRaw)) strikes[key] = normalizeStrike(value);
    const legacy = Array.isArray(src.logs) ? (src.logs as ModerationLog[]).filter((l) => l && typeof l === "object") : [];
    const file: ModerationFile = { configs, strikes, ...(legacy.length ? { legacyLogs: legacy } : {}) };
    this.#file = file;
    // 配置与日志在同一次加载里初始化：任何写操作前旧日志都已迁移，不会被配置覆盖丢掉。
    await this.#initLogs(legacy);
    return file;
  }

  /** 读取全部月份文件，并把旧版内嵌日志并入对应月份（去重、倒序、封顶）。 */
  async #initLogs(legacy: ModerationLog[]): Promise<void> {
    const map = new Map<string, ModerationLog[]>();
    let names: string[] = [];
    try { names = await readdir(LOG_DIR()); } catch { /* 目录不存在 */ }
    for (const name of names) {
      const month = name.replace(/\.json$/, "");
      if (!/^\d{4}-\d{2}$/.test(month)) continue;
      try {
        const raw = await readStoreJson<unknown>(logPath(month));
        if (Array.isArray(raw)) {
          map.set(month, raw.filter((l) => l && typeof l === "object" && !Array.isArray(l)) as ModerationLog[]);
        }
      } catch { /* 单月文件损坏：跳过，不影响其它月份 */ }
    }
    const touched = new Set<string>();
    for (const log of legacy) {
      const month = logMonth(log);
      const arr = map.get(month) ?? [];
      // 去重：同时刻 + 同群 + 同成员 + 同内容视为同一条（重复迁移不会翻倍）。
      if (!arr.some((x) => x.at === log.at && x.groupId === log.groupId && x.sender === log.sender && x.content === log.content)) {
        arr.push(log);
        map.set(month, arr);
        touched.add(month);
      }
    }
    for (const arr of map.values()) sortAndCap(arr);
    this.#logs = map;
    if (touched.size) {
      try {
        for (const month of touched) await this.#writeLogMonth(month, map);
        // 迁移成功：配置落盘时不再回写旧 logs 字段。
        if (this.#file) delete this.#file.legacyLogs;
      } catch { /* 迁移失败：保留 legacyLogs，配置落盘时回写，下次重启再试 */ }
      // 日志已安全落盘，立即重写配置去掉旧 logs 字段，避免双份存储（失败不影响数据）。
      if (this.#file && !this.#file.legacyLogs) await this.#save().catch(() => undefined);
    }
  }

  async #writeLogMonth(month: string, map = this.#logs): Promise<void> {
    await mkdir(LOG_DIR(), { recursive: true });
    await writeStoreJson(logPath(month), map?.get(month) ?? []);
  }

  async #save(): Promise<void> {
    if (!this.#file) return;
    const { configs, strikes, legacyLogs } = this.#file;
    await writeStoreJson(MODERATION_PATH(), legacyLogs?.length ? { configs, strikes, logs: legacyLogs } : { configs, strikes });
  }

  /** 读取单群配置（未配置时返回全默认副本）。 */
  async getConfig(appId: string, groupId: string): Promise<ModerationConfig> {
    const file = await this.#load();
    return { ...(file.configs[modKey(appId, groupId)] ?? defaultConfig()) };
  }

  /** 保存单群配置（归一化后写入）。 */
  async setConfig(appId: string, groupId: string, raw: unknown): Promise<ModerationConfig> {
    const file = await this.#load();
    const cfg = normalizeConfig(raw);
    file.configs[modKey(appId, groupId)] = cfg;
    await this.#save();
    return cfg;
  }

  /** 删除单群配置（恢复默认/关闭）。 */
  async removeConfig(appId: string, groupId: string): Promise<void> {
    const file = await this.#load();
    delete file.configs[modKey(appId, groupId)];
    await this.#save();
  }

  /** 列出所有已配置的群（供设置页展示/批量管理）。 */
  async listConfigs(): Promise<Array<{ key: string; appId: string; groupId: string; config: ModerationConfig }>> {
    const file = await this.#load();
    return Object.entries(file.configs).map(([key, config]) => {
      const sep = key.indexOf("::");
      return {
        key,
        appId: sep > 0 ? key.slice(0, sep) : "",
        groupId: sep > 0 ? key.slice(sep + 2) : key,
        config,
      };
    });
  }

  /** 追加一条处罚日志到对应月份文件（每月保留最近 LOG_CAP 条）。 */
  async appendLog(log: ModerationLog): Promise<void> {
    await this.#load();
    const map = this.#logs ?? new Map<string, ModerationLog[]>();
    this.#logs = map;
    const month = logMonth(log);
    const arr = map.get(month) ?? [];
    arr.unshift(log);
    if (arr.length > LOG_CAP) arr.length = LOG_CAP;
    map.set(month, arr);
    await this.#writeLogMonth(month, map);
  }

  /** 查询日志（跨月份合并，可按 appId / 群过滤，按时间倒序）。 */
  async listLogs(filter: { appId?: string; groupId?: string; limit?: number } = {}): Promise<ModerationLog[]> {
    await this.#load();
    const limit = Math.min(300, Math.max(1, Math.round(filter.limit ?? 100)));
    const all: ModerationLog[] = [];
    for (const arr of (this.#logs ?? new Map()).values()) all.push(...arr);
    all.sort((a, b) => String(b?.at ?? "").localeCompare(String(a?.at ?? "")));
    return all
      .filter((l) => (!filter.appId || l.appId === filter.appId) && (!filter.groupId || l.groupId === filter.groupId))
      .slice(0, limit);
  }

  /** 读取某成员在本群的累进违规记录（无记录 / 超过清零窗口返回全零）。 */
  async getStrike(appId: string, groupId: string, sender: string, windowDays = DEFAULT_STRIKE_WINDOW_DAYS): Promise<ModerationStrike> {
    const file = await this.#load();
    const strike = normalizeStrike(file.strikes[strikeKey(appId, groupId, sender)]);
    return isStrikeExpired(strike, Date.now(), windowDays)
      ? { count: 0, totalMinutes: 0, lastAt: "", lastLevel: "" }
      : strike;
  }

  /**
   * 记录一次违规：窗口内次数 +1、累计禁言分钟相加（封顶 30 天）；
   * 超过清零窗口则视为新周期，从 count=1 重新计，不再无限叠加。
   * 保留最近 STRIKE_CAP 个成员。
   */
  async recordStrike(
    appId: string, groupId: string, sender: string, minutes: number, level: string,
    windowDays = DEFAULT_STRIKE_WINDOW_DAYS,
  ): Promise<ModerationStrike> {
    const file = await this.#load();
    const key = strikeKey(appId, groupId, sender);
    const now = Date.now();
    const existing = normalizeStrike(file.strikes[key]);
    // 窗口已过 → 清零重计；窗口内 → 沿用次数与累计。
    const prev = isStrikeExpired(existing, now, windowDays)
      ? { count: 0, totalMinutes: 0, lastAt: "", lastLevel: "" }
      : existing;
    const next: ModerationStrike = {
      count: Math.min(10000, prev.count + 1),
      totalMinutes: Math.min(MUTE_CAP_MINUTES, prev.totalMinutes + Math.max(0, Math.round(minutes))),
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
