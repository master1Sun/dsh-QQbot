/**
 * 消息本地归档（审计轨迹）：把收发的消息追加写入 ~/.dsh/qqbot/archive/。
 *
 * 目的：群里让机器人「使坏」也有据可查——谁在什么时候发了什么、机器人
 * 回复了什么、走了哪个会话，全部落盘。
 *
 * 文件按天滚动：archive-YYYY-MM-DD.jsonl，每行一条 JSON 记录：
 *   { ts, kind, event?, chat, group?, sender?, senderName?, content, sessionId?, note? }
 * （旧版按月文件 archive-YYYY-MM.jsonl 在首次列举时自动拆分为按天文件）
 *
 * 写入失败只告警，不影响收发主流程。
 */
import { appendFile, mkdir, open, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pluginDataDir } from "./store-file.js";
import { shanghaiDay, toShanghaiISO } from "../../shared/time.js";

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
    const line = `${JSON.stringify({ ts: toShanghaiISO(now), ...(this.#bot ? { bot: this.#bot } : {}), ...record })}\n`;
    try {
      const dir = join(pluginDataDir(), "archive");
      await mkdir(dir, { recursive: true });
      await appendFile(join(dir, `archive-${shanghaiDay(now)}.jsonl`), line, "utf8");
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
  /** 读取涉及的天数（供 UI 提示覆盖范围）。 */
  daysRead: number;
}

/** 列出按天归档文件（文件名倒序：最新在前）。 */
async function listDayFiles(): Promise<string[]> {
  const dir = join(pluginDataDir(), "archive");
  try {
    return (await readdir(dir)).filter((f) => /^archive-\d{4}-\d{2}-\d{2}\.jsonl$/.test(f)).sort().reverse();
  } catch {
    return [];
  }
}

const MONTH_FILE_RE = /^archive-\d{4}-\d{2}\.jsonl$/;
let migration: Promise<void> | null = null;

/**
 * 把旧版按月归档文件拆分为按天文件（每进程至多执行一次）。
 * 单条 ts 缺失/损坏时按文件名月份的第一天归组；拆分失败保留原月文件并告警。
 */
function migrateMonthlyArchives(logger: Pick<Console, "warn" | "error">): Promise<void> {
  migration ??= (async () => {
    const dir = join(pluginDataDir(), "archive");
    let monthFiles: string[] = [];
    try {
      monthFiles = (await readdir(dir)).filter((f) => MONTH_FILE_RE.test(f));
    } catch {
      return;
    }
    for (const file of monthFiles) {
      const path = join(dir, file);
      let raw = "";
      try {
        raw = await readFile(path, "utf8");
      } catch {
        continue;
      }
      const defaultDay = `${file.slice(8, -6)}-01`;
      const byDay = new Map<string, string[]>();
      for (const line of raw.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        let day = defaultDay;
        try {
          const ts = JSON.parse(trimmed)?.ts;
          if (typeof ts === "string" && /^\d{4}-\d{2}-\d{2}/.test(ts)) day = ts.slice(0, 10);
        } catch {
          // ts 缺失：按默认日归组
        }
        const bucket = byDay.get(day) ?? [];
        bucket.push(trimmed);
        byDay.set(day, bucket);
      }
      try {
        for (const [day, lines] of byDay) {
          await appendFile(join(dir, `archive-${day}.jsonl`), `${lines.join("\n")}\n`, "utf8");
        }
        await rm(path, { force: true });
        logger.warn(`[dsh-qqbot] 归档迁移：${file} 已拆分为 ${byDay.size} 个天文件`);
      } catch (error) {
        logger.warn(`[dsh-qqbot] 归档迁移失败（保留原文件 ${file}）:`, error);
        return;
      }
    }
  })();
  return migration;
}

/** 记录是否有效且匹配机器人过滤（bot 为空不过滤）。 */
function recordMatchesBot(record: unknown, bot: string): boolean {
  return (
    !!(record && typeof record === "object" && typeof (record as ArchivedEntry).content === "string") &&
    !(bot && (record as ArchivedEntry).bot && (record as ArchivedEntry).bot !== bot)
  );
}

function safeParseRecord(line: string): ArchivedEntry | null {
  try {
    const parsed = JSON.parse(line);
    return parsed && typeof parsed === "object" ? (parsed as ArchivedEntry) : null;
  } catch {
    return null;
  }
}

/**
 * 读取归档最近记录（设置页「消息归档」弹窗用）：
 *  - 按天文件从最新往旧读，凑满 limit 即止；
 *  - bot 非空时只返回该机器人的记录；
 *  - 单条 JSON 解析失败跳过，不影响整体（归档为只读操作，绝不写回）。
 */
export async function readArchiveRecords(opts: { bot?: string; limit?: number } = {}): Promise<ArchiveReadResult> {
  const bot = typeof opts.bot === "string" ? opts.bot : "";
  const limit = Math.min(500, Math.max(10, Number(opts.limit) || 120));
  const dir = join(pluginDataDir(), "archive");
  const files = await listDayFiles();
  const collected: ArchivedEntry[] = [];
  let daysRead = 0;
  for (const file of files) {
    daysRead += 1;
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
    moreAvailable: collected.length > limit || daysRead < files.length,
    daysRead,
  };
}

/** 归档中的会话聚合项（供设置页「接收方 openid」下拉候选）。 */
export interface ArchivedChat {
  scope: "group" | "c2c";
  openid: string;
  /** 最近一次已知的展示名：单聊=用户昵称；群聊平台不下发群名，恒为空。 */
  name: string;
  /** 群聊场景：该群最近一次发言者的昵称（帮助辨认是哪个群）。 */
  lastSenderName: string;
  /** 该会话最近一次出现的时间（ISO 字符串）。 */
  lastTs: string;
  /** 扫描范围内该会话出现的记录条数。 */
  count: number;
}

/**
 * 聚合归档中出现过的群/单聊会话（设置页 openid 下拉候选）：
 *  - 按天文件从最新往旧读，凑满 limit 条记录即止；
 *  - 群会话取 chat 前缀 group:，单聊取 c2c:；session 事件与无法解析的键跳过；
 *  - 名称取该会话最近一次的 senderName（QQ 平台不下发群名，群聊用最近发言者辅助辨认）。
 */
export async function listArchiveChats(opts: { bot?: string; limit?: number } = {}): Promise<{
  chats: ArchivedChat[];
  moreAvailable: boolean;
}> {
  const bot = typeof opts.bot === "string" ? opts.bot : "";
  const limit = Math.min(5000, Math.max(200, Number(opts.limit) || 2000));
  const dir = join(pluginDataDir(), "archive");
  const files = await listDayFiles();
  const map = new Map<string, ArchivedChat>();
  let scanned = 0;
  let daysRead = 0;
  for (const file of files) {
    daysRead += 1;
    let raw = "";
    try {
      raw = await readFile(join(dir, file), "utf8");
    } catch {
      continue;
    }
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const rec = safeParseRecord(trimmed);
      if (!rec || rec.kind === "session") continue;
      if (bot && rec.bot && rec.bot !== bot) continue;
      scanned += 1;
      const chat = typeof rec.chat === "string" ? rec.chat : "";
      let scope: "group" | "c2c" | null = null;
      let openid = "";
      if (chat.startsWith("group:")) {
        scope = "group";
        openid = chat.slice("group:".length);
      } else if (chat.startsWith("c2c:")) {
        scope = "c2c";
        openid = chat.slice("c2c:".length);
      }
      if (!scope || !openid) continue;
      const key = `${scope}:${openid}`;
      const ts = typeof rec.ts === "string" ? rec.ts : "";
      const senderName = typeof rec.senderName === "string" ? rec.senderName : "";
      const prev = map.get(key);
      if (!prev) {
        map.set(key, {
          scope,
          openid,
          name: scope === "c2c" ? senderName : "",
          lastSenderName: senderName,
          lastTs: ts,
          count: 1,
        });
      } else {
        prev.count += 1;
        // ts 为 ISO 字符串，字典序即时间序；只让更新的记录覆盖名称。
        if (ts && ts >= prev.lastTs) {
          prev.lastTs = ts;
          if (scope === "c2c" && senderName) prev.name = senderName;
          if (senderName) prev.lastSenderName = senderName;
        }
      }
    }
    if (scanned >= limit) break;
  }
  const chats = [...map.values()]
    .sort((a, b) => (a.lastTs < b.lastTs ? 1 : a.lastTs > b.lastTs ? -1 : 0))
    .slice(0, 300);
  return { chats, moreAvailable: daysRead < files.length };
}

/** 天级条数缓存：key = `${bot}:${mtimeMs}:${size}`，文件未变时免重读。 */
const dayCountCache = new Map<string, { key: string; count: number }>();

/**
 * 列举每个归档天的记录条数（按机器人过滤），供设置页日期列表展示。
 * 传入 logger 时先把旧月文件拆分为天文件；条数结果带 stat 指纹缓存。
 */
export async function listArchiveDays(
  bot = "",
  logger?: Pick<Console, "warn" | "error">,
): Promise<Array<{ day: string; count: number }>> {
  if (logger) await migrateMonthlyArchives(logger);
  const dir = join(pluginDataDir(), "archive");
  const result: Array<{ day: string; count: number }> = [];
  for (const file of await listDayFiles()) {
    const day = file.slice(8, -6);
    const path = join(dir, file);
    let fingerprint = "";
    try {
      const st = await stat(path);
      fingerprint = `${bot}:${Math.round(st.mtimeMs)}:${st.size}`;
    } catch {
      result.push({ day, count: 0 });
      continue;
    }
    const cached = dayCountCache.get(file);
    if (cached && cached.key === fingerprint) {
      result.push({ day, count: cached.count });
      continue;
    }
    let count = 0;
    try {
      const raw = await readFile(path, "utf8");
      for (const line of raw.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const record = safeParseRecord(trimmed);
        if (record && recordMatchesBot(record, bot)) count += 1;
      }
    } catch {
      continue;
    }
    dayCountCache.set(file, { key: fingerprint, count });
    result.push({ day, count });
  }
  return result;
}

/** 读天文件尾部时最多加载的字节数（避免超大文件全量读入）。 */
const READ_TAIL_BYTES = 1_000_000;

/**
 * 读取指定一天的归档（取尾部 limit 条，时间倒序）。
 * 文件超过 READ_TAIL_BYTES 时只读尾部，moreAvailable 提示头部还有更早记录。
 */
export async function readArchiveDay(opts: { day?: string; bot?: string; limit?: number } = {}): Promise<ArchiveReadResult> {
  const day = typeof opts.day === "string" ? opts.day : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return { records: [], moreAvailable: false, daysRead: 0 };
  const bot = typeof opts.bot === "string" ? opts.bot : "";
  const limit = Math.min(500, Math.max(10, Number(opts.limit) || 500));
  const path = join(pluginDataDir(), "archive", `archive-${day}.jsonl`);
  let raw = "";
  let truncated = false;
  try {
    const handle = await open(path, "r");
    try {
      const size = (await handle.stat()).size;
      const start = Math.max(0, size - READ_TAIL_BYTES);
      const buf = Buffer.alloc(size - start);
      if (buf.length > 0) await handle.read(buf, 0, buf.length, start);
      truncated = start > 0;
      raw = buf.toString("utf8");
    } finally {
      await handle.close();
    }
  } catch {
    return { records: [], moreAvailable: false, daysRead: 0 };
  }
  if (truncated) {
    // 首行多半是被截断的半行：丢弃
    const nl = raw.indexOf("\n");
    raw = nl >= 0 ? raw.slice(nl + 1) : "";
  }
  const matches: ArchivedEntry[] = [];
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const record = safeParseRecord(trimmed);
    if (record && recordMatchesBot(record, bot)) matches.push(record);
  }
  const picked = matches.length > limit ? matches.slice(-limit) : matches;
  picked.sort((a, b) => (a.ts < b.ts ? 1 : a.ts > b.ts ? -1 : 0));
  return { records: picked, moreAvailable: truncated, daysRead: 1 };
}

/** 删除某天的归档记录（按机器人过滤；bot 为空清空全天）。 */
export async function removeArchiveDay(opts: { day?: string; bot?: string } = {}): Promise<{ removed: number; fileDeleted: boolean }> {
  const day = typeof opts.day === "string" ? opts.day : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new Error("日期格式应为 YYYY-MM-DD");
  const bot = typeof opts.bot === "string" ? opts.bot : "";
  const dir = join(pluginDataDir(), "archive");
  const path = join(dir, `archive-${day}.jsonl`);
  let raw = "";
  try {
    raw = await readFile(path, "utf8");
  } catch {
    return { removed: 0, fileDeleted: false };
  }
  const kept: string[] = [];
  let removed = 0;
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const record = safeParseRecord(trimmed);
    if (record && recordMatchesBot(record, bot)) removed += 1;
    else kept.push(trimmed);
  }
  if (kept.length === 0) {
    await rm(path, { force: true });
    dayCountCache.delete(`archive-${day}.jsonl`);
    return { removed, fileDeleted: true };
  }
  await writeFile(path, `${kept.join("\n")}\n`, "utf8");
  return { removed, fileDeleted: false };
}
