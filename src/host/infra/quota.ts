/**
 * 主动消息每日配额：QQ 平台主动消息额度极少，超发会被限流/封禁。
 * 本模块按「上海日」计数主动消息用量，超过 quotaPerDay 后拒绝主动发送并告警。
 *
 * **按机器人分池**：每个机器人（appId）有独立的每日额度与已用量，
 * 互不挤占——A 机器人刷满不会影响 B 机器人。
 * 用量落盘 ~/.dsh/qqbot/quota.json（{ date, used: { [appId]: n } }），跨重启保留；
 * 日期变化自动归零。quotaPerDay=0 表示不限制。
 *
 * 未指定 appId 的调用（旧路径 / 主机器人兜底）归入 `__primary__` 池，
 * 与主机器人的真实 appId 视作同一个池（见 normalizePool）。
 */
import { readStoreJson, writeStoreJson, pluginDataDir } from "./store-file.js";
import { join } from "node:path";
import { toShanghaiISO } from "../../shared/time.js";

const QUOTA_PATH = () => join(pluginDataDir(), "quota.json");

/** 未指定归属时的兜底池名（主机器人）。 */
const PRIMARY_POOL = "__primary__";

interface QuotaFile {
  date: string;
  /** appId → 今日已用次数。 */
  used: Record<string, number>;
}

/** 解析配额池名：空 → 主机器人池。 */
function normalizePool(appId?: string): string {
  const id = (appId ?? "").trim();
  return id || PRIMARY_POOL;
}

export class QuotaTracker {
  #file: QuotaFile | null = null;
  #loaded = false;
  readonly #logger: Pick<Console, "warn" | "error">;
  /** 按 appId 解析每日配额上限（0=不限）。 */
  #limit: (appId?: string) => number;

  constructor(logger: Pick<Console, "warn" | "error">, limit: (appId?: string) => number) {
    this.#logger = logger;
    this.#limit = limit;
  }

  /** 读到今日配额文件；日期变化或格式变更时重置结构。 */
  async #load(): Promise<QuotaFile> {
    const today = toShanghaiISO(new Date()).slice(0, 10);
    if (!this.#loaded || this.#file?.date !== today) {
      const stored = await readStoreJson<unknown>(QUOTA_PATH());
      this.#file = this.#normalize(stored, today);
      this.#loaded = true;
    }
    return this.#file!;
  }

  /**
   * 兼容两种历史格式：
   *  - 旧：{ date, used: number }（全局单池）→ 迁入主机器人池；
   *  - 新：{ date, used: { [appId]: number } }。
   */
  #normalize(stored: unknown, today: string): QuotaFile {
    if (!stored || typeof stored !== "object") return { date: today, used: {} };
    const raw = stored as { date?: unknown; used?: unknown };
    if (raw.date !== today) return { date: today, used: {} };
    if (typeof raw.used === "number") {
      return { date: today, used: { [PRIMARY_POOL]: raw.used } };
    }
    if (raw.used && typeof raw.used === "object" && !Array.isArray(raw.used)) {
      const used: Record<string, number> = {};
      for (const [k, v] of Object.entries(raw.used as Record<string, unknown>)) {
        const n = Number(v);
        if (Number.isFinite(n) && n > 0) used[k] = Math.floor(n);
      }
      return { date: today, used };
    }
    return { date: today, used: {} };
  }

  async #save(): Promise<void> {
    if (!this.#file) return;
    try {
      await writeStoreJson(QUOTA_PATH(), this.#file);
    } catch (error) {
      this.#logger.warn("[dsh-qqbot] 配额落盘失败:", error);
    }
  }

  /** 读当前用量（指定机器人）。 */
  async usage(appId?: string): Promise<{ used: number; limit: number; remaining: number | null }> {
    const file = await this.#load();
    const pool = normalizePool(appId);
    const used = file.used[pool] ?? 0;
    const limit = this.#limit(appId);
    return {
      used,
      limit,
      remaining: limit > 0 ? Math.max(0, limit - used) : null,
    };
  }

  /** 消耗 n 次主动消息额度；超限返回 false（调用方应放弃发送）。 */
  async tryConsume(n = 1, appId?: string): Promise<boolean> {
    const limit = this.#limit(appId);
    const file = await this.#load();
    const pool = normalizePool(appId);
    const used = file.used[pool] ?? 0;
    if (limit > 0 && used + n > limit) {
      this.#logger.warn(
        `[dsh-qqbot] 机器人 ${appId ?? "(主)"} 主动消息已达每日配额（${used}/${limit}），跳过发送`
      );
      return false;
    }
    file.used[pool] = used + n;
    await this.#save();
    return true;
  }

  /**
   * 归还 n 次主动消息额度（指定机器人）。
   * 调用方先在发送前预扣（避免并发超发），事后发现「其实没投递」时归还：
   * 例如定时任务被发送门控拦下、或 AI 判定本次没有值得发送的内容（静默）。
   * 归还不设上限校验，且不会低于 0。
   */
  async refund(n = 1, appId?: string): Promise<void> {
    const file = await this.#load();
    const pool = normalizePool(appId);
    file.used[pool] = Math.max(0, (file.used[pool] ?? 0) - n);
    await this.#save();
  }
}
