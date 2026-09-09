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
import { appendFile, mkdir, readdir, readFile } from "node:fs/promises";
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

export interface ArchivedEntry extends ArchiveRecord {
  ts: string;
  bot?: string;
}

export interface ArchiveReadResult {
  /** 最近记录（时间倒序：最新在前）。 */
  records: ArchivedEntry[];
  /** 归档里还有更早的记录未包含在本次结果中。 */
  moreAvailable: boolean;
  /** 读取涉及的月份数（供 UI 提示覆盖范围）。 */
  monthsRead: number;
}

/**
 * 读取归档最近记录（设置页「消息归档」弹窗用）：
 *  - 按月文件从最新往旧读，凑满 limit 即止；
 *  - bot 非空时只返回该机器人的记录；
 *  - 单条 JSON 解析失败跳过，不影响整体（归档为只读操作，绝不写回）。
 */
export async function readArchiveRecords(opts: { bot?: string; limit?: number } = {}): Promise<ArchiveReadResult> {
  const bot = typeof opts.bot === "string" ? opts.bot : "";
  const limit = Math.min(500, Math.max(10, Number(opts.limit) || 120));
  const dir = join(pluginDataDir(), "archive");
  let files: string[] = [];
  try {
    files = (await readdir(dir)).filter((f) => /^archive-\d{4}-\d{2}\.jsonl$/.test(f)).sort().reverse();
  } catch {
    return { records: [], moreAvailable: false, monthsRead: 0 };
  }
  const collected: ArchivedEntry[] = [];
  let monthsRead = 0;
  for (const file of files) {
    monthsRead += 1;
    let raw = "";
    try {
      raw = await readFile(join(dir, file), "utf8");
    } catch {
      continue;
    }
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const parsed = JSON.parse(trimmed) as ArchivedEntry;
        if (!parsed || typeof parsed !== "object" || typeof parsed.content !== "string") continue;
        if (bot && parsed.bot && parsed.bot !== bot) continue;
        collected.push(parsed);
      } catch {
        // 单行损坏：跳过
      }
    }
    if (collected.length >= limit) break;
  }
  collected.sort((a, b) => (a.ts < b.ts ? 1 : a.ts > b.ts ? -1 : 0));
  return {
    records: collected.slice(0, limit),
    moreAvailable: collected.length > limit || monthsRead < files.length,
    monthsRead,
  };
}
