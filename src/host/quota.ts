/**
 * 主动消息每日配额：QQ 平台主动消息额度极少，超发会被限流/封禁。
 * 本模块按「上海日」计数主动消息用量，超过 quotaPerDay 后拒绝主动发送并告警。
 *
 * 用量落盘 ~/.dsh/qqbot/quota.json（{ date, used }），跨重启保留；
 * 日期变化自动归零。quotaPerDay=0 表示不限制。
 */
import { readStoreJson, writeStoreJson, pluginDataDir } from "./store-file.js";
import { join } from "node:path";
import { toShanghaiISO } from "../shared/time.js";

const QUOTA_PATH = () => join(pluginDataDir(), "quota.json");

interface QuotaFile {
  date: string;
  used: number;
}

export class QuotaTracker {
  #file: QuotaFile | null = null;
  #loaded = false;
  readonly #logger: Pick<Console, "warn" | "error">;
  /** 每日配额上限（0=不限），由各机器人的 config 提供。 */
  #limit: () => number;

  constructor(logger: Pick<Console, "warn" | "error">, limit: () => number) {
    this.#logger = logger;
    this.#limit = limit;
  }

  async #load(): Promise<QuotaFile> {
    const today = toShanghaiISO(new Date()).slice(0, 10);
    if (!this.#loaded || this.#file?.date !== today) {
      const stored = await readStoreJson<QuotaFile>(QUOTA_PATH());
      this.#file = stored && stored.date === today && typeof stored.used === "number"
        ? stored
        : { date: today, used: 0 };
      this.#loaded = true;
    }
    return this.#file!;
  }

  async #save(): Promise<void> {
    if (!this.#file) return;
    try {
      await writeStoreJson(QUOTA_PATH(), this.#file);
    } catch (error) {
      this.#logger.warn("[dsh-qqbot] 配额落盘失败:", error);
    }
  }

  /** 当前用量（今日）。 */
  async usage(): Promise<{ used: number; limit: number; remaining: number | null }> {
    const file = await this.#load();
    const limit = this.#limit();
    return {
      used: file.used,
      limit,
      remaining: limit > 0 ? Math.max(0, limit - file.used) : null,
    };
  }

  /** 消耗 n 次主动消息额度；超限返回 false（调用方应放弃发送）。 */
  async tryConsume(n = 1): Promise<boolean> {
    const limit = this.#limit();
    const file = await this.#load();
    if (limit > 0 && file.used + n > limit) {
      this.#logger.warn(`[dsh-qqbot] 主动消息已达每日配额（${file.used}/${limit}），跳过发送`);
      return false;
    }
    file.used += n;
    await this.#save();
    return true;
  }
}
