/**
 * 运行统计持久化：每个机器人一份 JSON（~/.dsh/qqbot/stats/<appId>.json）。
 *
 * 计数在内存（BotState.counters）实时累加，由 BotRuntimeManager 定期（10s，值变化才写）
 * 落盘；启动时读回并与内存计数取 max 合并（计数单调递增，max 合并对竞态安全），
 * 重启不清零。复位 = 内存清零 + 立即落盘（reset）。
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pluginDataDir } from "./store-file.js";
import { toShanghaiISO } from "../../shared/time.js";
import type { BotCounters } from "../../shared/types.js";

export const ZERO_COUNTERS: BotCounters = { received: 0, sessions: 0, replies: 0, proactive: 0, errors: 0 };

function statsPath(appId: string): string {
  return join(pluginDataDir(), "stats", `${appId.replace(/[^A-Za-z0-9_-]/g, "_")}.json`);
}

function dailyStatsPath(appId: string): string {
  return join(pluginDataDir(), "stats", `${appId.replace(/[^A-Za-z0-9_-]/g, "_")}.daily.json`);
}

/** 按天计数最多保留的天数，避免长期运行文件无限膨胀。 */
const DAILY_KEEP_DAYS = 60;

export class StatsStore {
  readonly #logger: Pick<Console, "warn" | "error">;

  constructor(logger: Pick<Console, "warn" | "error">) {
    this.#logger = logger;
  }

  /** 读某机器人的持久计数；文件缺失/损坏返回全零。 */
  async load(appId: string): Promise<BotCounters> {
    const counters: BotCounters = { ...ZERO_COUNTERS };
    try {
      const raw = JSON.parse(await readFile(statsPath(appId), "utf8")) as Partial<BotCounters> | null;
      for (const key of Object.keys(ZERO_COUNTERS) as (keyof BotCounters)[]) {
        const v = Number(raw?.[key]);
        if (Number.isSafeInteger(v) && v > 0) counters[key] = v;
      }
    } catch {
      /* 文件缺失或损坏 → 从零开始 */
    }
    return counters;
  }

  /** 落盘某机器人的计数（附带更新时间）。 */
  async save(appId: string, counters: BotCounters): Promise<void> {
    try {
      await mkdir(join(pluginDataDir(), "stats"), { recursive: true });
      await writeFile(
        statsPath(appId),
        JSON.stringify({ ...counters, updatedAt: toShanghaiISO() }, null, 2),
        "utf8",
      );
    } catch (error) {
      this.#logger.warn(`[dsh-qqbot] 运行统计落盘失败（机器人 ${appId}）:`, error);
    }
  }

  /** 读某机器人的按天收到消息数；文件缺失/损坏返回空表。 */
  async loadDaily(appId: string): Promise<Record<string, number>> {
    try {
      const raw = JSON.parse(await readFile(dailyStatsPath(appId), "utf8")) as Record<string, unknown> | null;
      const out: Record<string, number> = {};
      if (raw && typeof raw === "object") {
        for (const [day, v] of Object.entries(raw)) {
          const n = Number(v);
          if (/^\d{4}-\d{2}-\d{2}$/.test(day) && Number.isSafeInteger(n) && n > 0) out[day] = n;
        }
      }
      return out;
    } catch {
      return {};
    }
  }

  /** 落盘某机器人的按天收到消息数（只保留最近 DAILY_KEEP_DAYS 天）。 */
  async saveDaily(appId: string, daily: Record<string, number>): Promise<void> {
    try {
      await mkdir(join(pluginDataDir(), "stats"), { recursive: true });
      const trimmed: Record<string, number> = {};
      for (const day of Object.keys(daily).sort().slice(-DAILY_KEEP_DAYS)) {
        trimmed[day] = daily[day];
      }
      await writeFile(dailyStatsPath(appId), JSON.stringify(trimmed, null, 2), "utf8");
    } catch (error) {
      this.#logger.warn(`[dsh-qqbot] 按天统计落盘失败（机器人 ${appId}）:`, error);
    }
  }
}
