/**
 * 消息本地归档（审计轨迹）：把收发的消息追加写入 ~/.dsh/qqbot/archive/。
 *
 * 目的：群里让机器人「使坏」也有据可查——谁在什么时候发了什么、机器人
 * 回复了什么、走了哪个会话，全部落盘。
 *
 * 文件按月滚动：archive-YYYY-MM.jsonl，每行一条 JSON 记录：
 *   { ts, kind, event?, chat, group?, sender?, senderName?, content, sessionId?, note? }
 *
 * 写入失败只告警，不影响收发主流程。
 */
import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { pluginDataDir } from "./store-file.js";
import { shanghaiMonth, toShanghaiISO } from "../shared/time.js";

export type ArchiveKind = "inbound" | "reply" | "proactive" | "session";

export interface ArchiveRecord {
  kind: ArchiveKind;
  /** 聊天键 `scope:openid` 或会话键。 */
  chat: string;
  /** 来源机器人 AppID（多机器人并存时区分归属）。 */
  bot?: string;
  /** QQ 事件类型（inbound 时）。 */
  event?: string;
  group?: string;
  sender?: string;
  senderName?: string;
  content: string;
  sessionId?: string;
  /** 附加说明（过滤判定、错误等）。 */
  note?: string;
}

export class Archiver {
  #enabled: () => boolean;
  #logger: Pick<Console, "warn" | "error">;
  /** 来源机器人 AppID：多机器人各持一个归档器，记录里自动带上归属。 */
  #bot: string;
  #warned = false;

  constructor(enabled: () => boolean, logger: Pick<Console, "warn" | "error">, bot = "") {
    this.#enabled = enabled;
    this.#logger = logger;
    this.#bot = bot;
  }

  async append(record: ArchiveRecord): Promise<void> {
    if (!this.#enabled()) return;
    const now = new Date();
    const month = shanghaiMonth(now);
    const line = `${JSON.stringify({ ts: toShanghaiISO(now), ...(this.#bot ? { bot: this.#bot } : {}), ...record })}\n`;
    try {
      const dir = join(pluginDataDir(), "archive");
      await mkdir(dir, { recursive: true });
      await appendFile(join(dir, `archive-${month}.jsonl`), line, "utf8");
      this.#warned = false;
    } catch (error) {
      if (!this.#warned) {
        this.#warned = true;
        this.#logger.error("[dsh-qqbot] 消息归档写入失败（仅提示一次）:", error);
      }
    }
  }
}
