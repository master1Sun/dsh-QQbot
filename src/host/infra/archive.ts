/**
 * 消息本地归档（审计轨迹）：把收发的消息按「会话 + 月份」落盘到
 *   ~/.dsh/qqbot/archive/<会话目录>/YYYY-MM.jsonl
 * 每行一条 JSON 记录：
 *   { ts, kind, event?, chat, bot?, group?, sender?, senderName?, content, sessionId?, note? }
 *
 * 会话目录名由 chat 键派生，保证同一会话稳定归到一处且 Windows 文件名安全：
 *   group:<openid> -> group_<openid>/
 *   c2c:<openid>   -> c2c_<openid>/
 *   其它值         -> misc_<chat 的 sha1 前 12 位>/（记录内的 chat 字段仍是原始值）
 * 机器人归属保留在记录内的 bot 字段（多机器人共享同一会话文件，读取/删除时按 bot 过滤）。
 *
 * 兼容：旧版按天文件 archive-YYYY-MM-DD.jsonl（以及更早的按月文件
 * archive-YYYY-MM.jsonl）在首次访问时自动迁移到新结构，原文件移入
 * archive/_legacy/ 留作备份，不删除、不丢数据。
 *
 * 写入失败只告警，不影响收发主流程。
 */
import { appendFile, mkdir, readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { pluginDataDir } from "./store-file.js";
import { toShanghaiISO } from "../../shared/time.js";

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

const LEGACY_DIRNAME = "_legacy";
/** 新结构月份文件名：2026-09.jsonl */
const MONTH_FILE_RE = /^(\d{4}-\d{2})\.jsonl$/;
/** 旧结构：archive-2026-09-09.jsonl / archive-2026-09.jsonl */
const OLD_DAY_FILE_RE = /^archive-\d{4}-\d{2}-\d{2}\.jsonl$/;
const OLD_MONTH_FILE_RE = /^archive-\d{4}-\d{2}\.jsonl$/;

interface MonthFile {
  /** 会话目录名（相对 archive 根目录）。 */
  chatDir: string;
  /** 月份 `YYYY-MM`。 */
  month: string;
  /** 绝对路径。 */
  path: string;
  /** 相对路径 `<chatDir>/<month>.jsonl`，供日志与删除结果使用。 */
  rel: string;
}

function archiveRoot(): string {
  return join(pluginDataDir(), "archive");
}

/** chat 键 -> 安全且稳定的目录名。 */
export function chatDirName(chat: string): string {
  const safe = typeof chat === "string" ? chat : "";
  const m = /^(group|c2c):([A-Za-z0-9_-]+)$/.exec(safe);
  if (m) return `${m[1]}_${m[2]}`;
  const hash = createHash("sha1").update(safe || "unknown").digest("hex").slice(0, 12);
  return `misc_${hash}`;
}

/** ts -> `YYYY-MM`；ts 非法时用兜底月份。 */
function monthOf(ts: string, fallback = ""): string {
  return typeof ts === "string" && /^\d{4}-\d{2}-\d{2}/.test(ts) ? ts.slice(0, 7) : fallback;
}

function monthFile(chatDir: string, month: string): MonthFile {
  const rel = `${chatDir}/${month}.jsonl`;
  return { chatDir, month, path: join(archiveRoot(), chatDir, `${month}.jsonl`), rel };
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

/** 读取文件的有效行（trim 后去空行）；文件不存在/不可读返回空数组。 */
async function readLines(path: string): Promise<string[]> {
  try {
    const raw = await readFile(path, "utf8");
    return raw.split("\n").map((l) => l.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function byTsDesc(a: ArchivedEntry, b: ArchivedEntry): number {
  return a.ts < b.ts ? 1 : a.ts > b.ts ? -1 : 0;
}

// ── 旧结构迁移 ──────────────────────────────────────────────────────────────

let migration: Promise<void> | null = null;

type Logger = Pick<Console, "warn" | "error">;

/** 全进程只跑一次；任何入口（写入/读取/删除）都会先确保迁移完成。 */
function ensureMigration(logger?: Logger): Promise<void> {
  migration ??= migrateLegacyArchives(logger ?? console);
  return migration;
}

async function migrateLegacyArchives(logger: Logger): Promise<void> {
  const root = archiveRoot();
  let legacy: string[] = [];
  try {
    legacy = (await readdir(root)).filter((f) => OLD_DAY_FILE_RE.test(f) || OLD_MONTH_FILE_RE.test(f));
  } catch {
    return; // 目录不存在：全新安装，无需迁移
  }
  if (legacy.length === 0) return;

  // 先把全部旧记录按目标文件聚合到内存，避免中途失败留下半套新文件。
  const byTarget = new Map<string, string[]>();
  for (const file of legacy) {
    let raw = "";
    try {
      raw = await readFile(join(root, file), "utf8");
    } catch {
      continue;
    }
    // archive-YYYY-MM[-DD].jsonl -> YYYY-MM（8..15 正好是 7 个字符）。
    // 注意别写成 slice(8, 14)：那会得到 "2026-0"，生成不匹配 MONTH_FILE_RE 的文件名，
    // 导致「缺 ts 的损坏行」迁移后从列表/读取里彻底消失（旧文件又被移进 _legacy）。
    const fallbackMonth = file.slice(8, 15);
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      let chat = "unknown";
      let ts = "";
      try {
        const rec = JSON.parse(trimmed);
        if (typeof rec.chat === "string") chat = rec.chat;
        if (typeof rec.ts === "string") ts = rec.ts;
      } catch {
        // 损坏行也照原样迁移，不丢数据
      }
      // 月份必须是合法的 YYYY-MM，否则目标文件不会被 listMonthFiles 识别（数据静默不可见）。
      // ts 与文件名都推不出月份时（极端的损坏行），退到 1970-01 这个显眼的「未知时间」桶。
      const month = monthOf(ts, fallbackMonth);
      const safeMonth = /^\d{4}-\d{2}$/.test(month) ? month : "1970-01";
      const target = monthFile(chatDirName(chat), safeMonth);
      const bucket = byTarget.get(target.rel) ?? [];
      bucket.push(trimmed);
      byTarget.set(target.rel, bucket);
    }
  }
  if (byTarget.size === 0) return;

  try {
    const writtenDirs = new Set<string>();
    for (const [rel, lines] of byTarget) {
      const chatDir = rel.slice(0, rel.indexOf("/"));
      if (!writtenDirs.has(chatDir)) {
        await mkdir(join(root, chatDir), { recursive: true });
        writtenDirs.add(chatDir);
      }
      const path = join(root, chatDir, rel.slice(rel.indexOf("/") + 1));
      // 按整行去重：既对比文件里已有的内容（迁移中断重跑安全），也去掉本批内的重复行。
      const seen = new Set(await readLines(path));
      const fresh: string[] = [];
      for (const l of lines) {
        if (seen.has(l)) continue;
        seen.add(l);
        fresh.push(l);
      }
      if (fresh.length) await appendFile(path, `${fresh.join("\n")}\n`, "utf8");
    }
    // 全部写成功后才把旧文件移入备份目录（保留可回滚，不在读取范围内）。
    const backupDir = join(root, LEGACY_DIRNAME);
    await mkdir(backupDir, { recursive: true });
    for (const file of legacy) {
      const dest = join(backupDir, file);
      try {
        await rm(dest, { force: true });
        await rename(join(root, file), dest);
      } catch {
        // 单个文件移动失败：保留在根目录，下次迁移会靠整行去重安全重试
      }
    }
    logger.warn(`[dsh-qqbot] 归档迁移：${legacy.length} 个旧文件已按「会话/月份」拆为 ${byTarget.size} 个文件，旧文件备份至 archive/${LEGACY_DIRNAME}/`);
  } catch (error) {
    logger.warn("[dsh-qqbot] 归档迁移失败（保留旧文件，下次重试）:", error);
    migration = null;
  }
}

/** 列举所有 `<会话目录>/YYYY-MM.jsonl`（月份倒序，便于「最近记录」优先读新文件）。 */
async function listMonthFiles(): Promise<MonthFile[]> {
  const root = archiveRoot();
  const out: MonthFile[] = [];
  let dirs: string[] = [];
  try {
    dirs = (await readdir(root, { withFileTypes: true }))
      .filter((d) => d.isDirectory() && d.name !== LEGACY_DIRNAME)
      .map((d) => d.name);
  } catch {
    return out;
  }
  for (const chatDir of dirs) {
    let files: string[] = [];
    try {
      files = await readdir(join(root, chatDir));
    } catch {
      continue;
    }
    for (const f of files) {
      const m = MONTH_FILE_RE.exec(f);
      if (m) out.push(monthFile(chatDir, m[1]));
    }
  }
  out.sort((a, b) => b.month.localeCompare(a.month) || a.chatDir.localeCompare(b.chatDir));
  return out;
}

// ── 写入 ────────────────────────────────────────────────────────────────────

export class Archiver {
  #enabled: () => boolean;
  #logger: Logger;
  /** 来源机器人 AppID：多机器人各持一个归档器，记录里自动带上归属。 */
  #bot: string;
  #warned = false;

  constructor(enabled: () => boolean, logger: Logger, bot = "") {
    this.#enabled = enabled;
    this.#logger = logger;
    this.#bot = bot;
  }

  async append(record: ArchiveRecord): Promise<void> {
    if (!this.#enabled()) return;
    const ts = toShanghaiISO(new Date());
    const line = `${JSON.stringify({ ts, ...(this.#bot ? { bot: this.#bot } : {}), ...record })}\n`;
    try {
      await ensureMigration(this.#logger);
      const target = monthFile(chatDirName(record.chat), ts.slice(0, 7));
      await mkdir(join(archiveRoot(), target.chatDir), { recursive: true });
      await appendFile(target.path, line, "utf8");
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
  /** 读取涉及的文件数（历史字段名，供 UI 提示覆盖范围）。 */
  daysRead: number;
}

/**
 * 读取归档最近记录（设置页「消息归档」弹窗用）：
 * 汇总各会话月份文件的记录，按 ts 倒序取 limit 条；bot 非空时只返回该机器人的记录。
 * 单条 JSON 解析失败跳过，不影响整体（归档为只读操作，绝不写回）。
 */
export async function readArchiveRecords(opts: { bot?: string; limit?: number } = {}): Promise<ArchiveReadResult> {
  await ensureMigration();
  const bot = typeof opts.bot === "string" ? opts.bot : "";
  const limit = Math.min(500, Math.max(10, Number(opts.limit) || 120));
  const files = await listMonthFiles();
  const collected: ArchivedEntry[] = [];
  for (const file of files) {
    for (const line of await readLines(file.path)) {
      const parsed = safeParseRecord(line);
      if (!parsed || typeof parsed.content !== "string") continue;
      if (bot && parsed.bot && parsed.bot !== bot) continue;
      collected.push(parsed);
    }
  }
  collected.sort(byTsDesc);
  return {
    records: collected.slice(0, limit),
    moreAvailable: collected.length > limit,
    daysRead: files.length,
  };
}

/** 会话下的月份归档项（左栏「会话 → 月份」二级分组用，倒序：最新月份在前）。 */
export interface ArchivedMonth {
  /** 月份键 `YYYY-MM`。 */
  month: string;
  /** 该月记录条数。 */
  count: number;
  /** 该月最近一条记录的时间（ISO 字符串）。 */
  lastTs: string;
  /** 该月最近一条记录的正文（供月节点预览）。 */
  lastContent: string;
}

/** 归档中的会话聚合项（供设置页「接收方 openid」下拉候选，以及归档弹窗左栏列表）。 */
export interface ArchivedChat {
  scope: "group" | "c2c";
  openid: string;
  /** 最近一次已知的展示名：单聊=用户昵称；群聊平台不下发群名，恒为空。 */
  name: string;
  /** 群聊场景：该群最近一次发言者的昵称（帮助辨认是哪个群）。 */
  lastSenderName: string;
  /** 该会话最近一次出现的时间（ISO 字符串）。 */
  lastTs: string;
  /** 该会话最近一条记录的正文（供左栏预览）。 */
  lastContent: string;
  /** 扫描范围内该会话出现的记录条数。 */
  count: number;
  /** 该会话按月份分组的归档（倒序：最新月份在前），每会话最多保留 60 个月。 */
  months: ArchivedMonth[];
}

/**
 * 聚合归档中出现过的群/单聊会话（设置页 openid 下拉候选 + 归档弹窗左栏）：
 * 遍历各会话的月份文件，按 chat 键聚合，月份直接取文件名；session 事件跳过。
 */
export async function listArchiveChats(opts: { bot?: string; limit?: number } = {}): Promise<{
  chats: ArchivedChat[];
  moreAvailable: boolean;
}> {
  await ensureMigration();
  const bot = typeof opts.bot === "string" ? opts.bot : "";
  // limit 表示「最多返回多少个会话」（不是扫描条数）：必须扫完全部记录，否则
  // 归档一多（>2000 条）就会静默少算条数、丢掉较早的月份和会话。
  const limit = Math.min(5000, Math.max(1, Number(opts.limit) || 300));
  const files = await listMonthFiles();
  const map = new Map<string, ArchivedChat>();
  const monthsByChat = new Map<string, Map<string, ArchivedMonth>>();
  for (const file of files) {
    for (const line of await readLines(file.path)) {
      const rec = safeParseRecord(line);
      if (!rec || rec.kind === "session") continue;
      if (bot && rec.bot && rec.bot !== bot) continue;
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
      const content = typeof rec.content === "string" ? rec.content : "";
      const prev = map.get(key);
      if (!prev) {
        map.set(key, {
          scope,
          openid,
          name: scope === "c2c" ? senderName : "",
          lastSenderName: senderName,
          lastTs: ts,
          lastContent: content,
          count: 1,
          months: [],
        });
      } else {
        prev.count += 1;
        // ts 为 ISO 字符串，字典序即时间序；只让更新的记录覆盖名称/预览。
        if (ts && ts >= prev.lastTs) {
          prev.lastTs = ts;
          if (scope === "c2c" && senderName) prev.name = senderName;
          if (senderName) prev.lastSenderName = senderName;
          if (content) prev.lastContent = content;
        }
      }
      const month = monthOf(ts, file.month);
      if (month) {
        let mm = monthsByChat.get(key);
        if (!mm) {
          mm = new Map();
          monthsByChat.set(key, mm);
        }
        const m = mm.get(month);
        if (!m) mm.set(month, { month, count: 1, lastTs: ts, lastContent: content });
        else {
          m.count += 1;
          if (ts && ts >= m.lastTs) {
            m.lastTs = ts;
            if (content) m.lastContent = content;
          }
        }
      }
    }
  }
  const chats = [...map.values()]
    .sort((a, b) => (a.lastTs < b.lastTs ? 1 : a.lastTs > b.lastTs ? -1 : 0))
    .slice(0, limit)
    .map((c) => {
      const mm = monthsByChat.get(`${c.scope}:${c.openid}`);
      const months = mm
        ? [...mm.values()].sort((a, b) => (a.month < b.month ? 1 : a.month > b.month ? -1 : 0)).slice(0, 60)
        : [];
      return { ...c, months };
    });
  return { chats, moreAvailable: map.size > chats.length };
}

/**
 * 列举每个归档天的记录条数（按机器人过滤），供设置页日期列表展示。
 * 新结构按会话+月份存文件，这里从记录 ts 重新按天聚合，UI 的日期列表语义保持不变。
 */
export async function listArchiveDays(
  bot = "",
  logger?: Logger,
): Promise<Array<{ day: string; count: number }>> {
  await ensureMigration(logger);
  const counts = new Map<string, number>();
  for (const file of await listMonthFiles()) {
    for (const line of await readLines(file.path)) {
      const record = safeParseRecord(line);
      if (!record || !recordMatchesBot(record, bot)) continue;
      const ts = typeof record.ts === "string" ? record.ts : "";
      if (!/^\d{4}-\d{2}-\d{2}/.test(ts)) continue;
      const day = ts.slice(0, 10);
      counts.set(day, (counts.get(day) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([day, count]) => ({ day, count }));
}

/**
 * 读取指定一天的归档（跨所有会话的该月文件，时间倒序取最新 limit 条）。
 */
export async function readArchiveDay(opts: { day?: string; bot?: string; limit?: number } = {}): Promise<ArchiveReadResult> {
  await ensureMigration();
  const day = typeof opts.day === "string" ? opts.day : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return { records: [], moreAvailable: false, daysRead: 0 };
  const bot = typeof opts.bot === "string" ? opts.bot : "";
  const limit = Math.min(500, Math.max(10, Number(opts.limit) || 500));
  const files = (await listMonthFiles()).filter((f) => f.month === day.slice(0, 7));
  const matched: ArchivedEntry[] = [];
  for (const file of files) {
    for (const line of await readLines(file.path)) {
      const record = safeParseRecord(line);
      if (!record || !recordMatchesBot(record, bot)) continue;
      if (typeof record.ts === "string" && record.ts.slice(0, 10) === day) matched.push(record);
    }
  }
  matched.sort(byTsDesc);
  const picked = matched.slice(0, limit);
  return { records: picked, moreAvailable: matched.length > limit, daysRead: files.length };
}

/**
 * 读取指定会话（group:<openid> / c2c:<openid>）的归档记录，支持按月份过滤、倒序/升序、分页。
 * 新结构下按月份可直接定位单个文件，无需全库扫描。
 *  - order 默认 "desc"：最新记录在前（右栏时间倒序展示）；
 *  - month 形如 "2026-11" 时只读该会话对应月份文件；
 *  - limit + offset 实现「限制 300 条 / 加载更多 / 显示全部」；total 返回命中总数。
 * bot 非空时只返回该机器人的记录。
 */
export async function readArchiveChat(opts: { bot?: string; chat?: string; month?: string; limit?: number; offset?: number; order?: "desc" | "asc" } = {}): Promise<ArchiveReadResult & { total: number }> {
  await ensureMigration();
  const bot = typeof opts.bot === "string" ? opts.bot : "";
  const chat = typeof opts.chat === "string" ? opts.chat : "";
  if (!chat) return { records: [], moreAvailable: false, daysRead: 0, total: 0 };
  const month = typeof opts.month === "string" && /^\d{4}-\d{2}$/.test(opts.month) ? opts.month : "";
  const order = opts.order === "asc" ? "asc" : "desc";
  const limit = Math.min(2000, Math.max(10, Number(opts.limit) || 300));
  const offset = Math.max(0, Number(opts.offset) || 0);
  const dir = chatDirName(chat);
  const files: MonthFile[] = month
    ? [monthFile(dir, month)]
    : (await listMonthFiles()).filter((f) => f.chatDir === dir);
  const matched: ArchivedEntry[] = [];
  let daysRead = 0;
  for (const file of files) {
    const lines = await readLines(file.path);
    if (lines.length === 0) continue;
    daysRead += 1;
    for (const line of lines) {
      const rec = safeParseRecord(line);
      if (!rec) continue;
      if (bot && rec.bot && rec.bot !== bot) continue;
      if (typeof rec.chat !== "string" || rec.chat !== chat) continue;
      matched.push(rec);
    }
  }
  matched.sort((a, b) => (a.ts < b.ts ? (order === "asc" ? -1 : 1) : a.ts > b.ts ? (order === "asc" ? 1 : -1) : 0));
  const total = matched.length;
  const picked = matched.slice(offset, offset + limit);
  return { records: picked, total, moreAvailable: offset + picked.length < total, daysRead };
}

/**
 * 删除某会话的归档记录：指定 month 时只删该会话该月文件（UI 的「删除当前月份」）；
 * 未指定 month 时删除该会话所有月份。按 bot 过滤，其它机器人的记录保留。
 */
export async function removeArchiveChat(opts: { bot?: string; chat?: string; month?: string } = {}): Promise<{ removed: number; filesDeleted: string[] }> {
  await ensureMigration();
  const bot = typeof opts.bot === "string" ? opts.bot : "";
  const chat = typeof opts.chat === "string" ? opts.chat : "";
  const month = typeof opts.month === "string" && /^\d{4}-\d{2}$/.test(opts.month) ? opts.month : "";
  if (!chat) throw new Error("chat 不能为空");
  const dir = chatDirName(chat);
  const files: MonthFile[] = month
    ? [monthFile(dir, month)]
    : (await listMonthFiles()).filter((f) => f.chatDir === dir);
  let removed = 0;
  const filesDeleted: string[] = [];
  for (const file of files) {
    const lines = await readLines(file.path);
    if (lines.length === 0) continue;
    const kept: string[] = [];
    for (const line of lines) {
      const rec = safeParseRecord(line);
      const recChat = rec && typeof rec.chat === "string" ? rec.chat : "";
      const recBot = rec && typeof rec.bot === "string" ? rec.bot : "";
      const matchChat = recChat === chat;
      const matchBot = !bot || !recBot || recBot === bot;
      if (matchChat && matchBot) removed += 1;
      else kept.push(line);
    }
    if (kept.length === 0) {
      await rm(file.path, { force: true });
      filesDeleted.push(file.rel);
    } else {
      await writeFile(file.path, `${kept.join("\n")}\n`, "utf8");
    }
  }
  // 会话目录已空则顺手移除，避免留下一堆空目录。
  try {
    const dirPath = join(archiveRoot(), dir);
    if ((await readdir(dirPath)).length === 0) await rm(dirPath, { recursive: true, force: true });
  } catch {
    // 目录不存在或不可读：忽略
  }
  return { removed, filesDeleted };
}

/** 删除某天的归档记录（跨所有会话；按机器人过滤；bot 为空清空全天）。 */
export async function removeArchiveDay(opts: { day?: string; bot?: string } = {}): Promise<{ removed: number; fileDeleted: boolean }> {
  await ensureMigration();
  const day = typeof opts.day === "string" ? opts.day : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new Error("日期格式应为 YYYY-MM-DD");
  const bot = typeof opts.bot === "string" ? opts.bot : "";
  const files = (await listMonthFiles()).filter((f) => f.month === day.slice(0, 7));
  let removed = 0;
  let fileDeleted = false;
  for (const file of files) {
    const lines = await readLines(file.path);
    if (lines.length === 0) continue;
    const kept: string[] = [];
    for (const line of lines) {
      const record = safeParseRecord(line);
      const isDay = !!record && typeof record.ts === "string" && record.ts.slice(0, 10) === day;
      if (isDay && recordMatchesBot(record, bot)) removed += 1;
      else kept.push(line);
    }
    if (kept.length === 0) {
      await rm(file.path, { force: true });
      fileDeleted = true;
    } else if (kept.length !== lines.length) {
      await writeFile(file.path, `${kept.join("\n")}\n`, "utf8");
    }
  }
  return { removed, fileDeleted };
}
