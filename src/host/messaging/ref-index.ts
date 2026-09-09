/**
 * 引用索引（REFIDX）：让机器人能「看懂」用户引用的是哪条消息。
 *
 * 背景（与 openclaw 的 REFIDX 方案同源）：
 *   QQ 客户端在引用消息时，事件里**不携带被引用消息的原文**，只在
 *   `message_scene.ext` 里给两个索引键：
 *     - `msg_idx=REFIDX_xxx`      当前这条消息的索引
 *     - `ref_msg_idx=REFIDX_yyy`  当前消息「引用了」的那条消息的索引
 *   因此插件需要自己把每条消息的 idx → 原文 存起来，用户后续引用时才能还原。
 *
 * 存储：
 *   ~/.dsh/qqbot/ref-index-<appId>.jsonl（每个机器人一份，按 AppID 隔离），每行一条 JSON。
 *   进程启动时加载尾部若干条进内存；写入为追加，文件过大时按内存内容重写瘦身。
 *
 * 边界：
 *   - 索引是「尽力而为」的缓存：查不到只是没有引用上下文，绝不影响正常回复；
 *   - 写入失败只告警一次，不抛给主流程；
 *   - 恢复出来的引用原文属于**外部未信任数据**，注入提示词时必须显式标注。
 */
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pluginDataDir } from "../infra/store-file.js";
import type { QqMessagePayload } from "../../shared/types.js";

export interface RefIndexEntry {
  /** QQ 引用索引键（REFIDX_*）。 */
  idx: string;
  /** 聊天键 `scope:openid`。 */
  chat: string;
  /** 消息 id（被动回复凭证，不保证存在）。 */
  msgId?: string;
  /** 发送者 openid。 */
  sender: string;
  /** 发送者昵称（群名片/用户名，可能为空）。 */
  senderName: string;
  /** 消息文本（已截断到 ENTRY_CONTENT_LIMIT）。 */
  content: string;
  /** 事件里的 RFC3339 时间戳原文。 */
  timestamp: string;
  /** 是否机器人自己发出的消息。 */
  fromBot: boolean;
  /** 入库时间（epoch ms），用于容量淘汰。 */
  at: number;
}

/** 单条索引保存的内容上限（防止大段刷屏撑爆文件）。 */
const ENTRY_CONTENT_LIMIT = 500;
/** 内存容量上限，超出淘汰最旧的一半。 */
const DEFAULT_MAX = 2000;
/** 追加写累计到该条数后重写文件瘦身。 */
const COMPACT_EVERY = 500;

export interface RefIndexOptions {
  logger: Pick<Console, "info" | "warn" | "error">;
  /** 机器人 AppID（决定落盘文件名）。 */
  appId: string;
  max?: number;
}

/** 引用索引里的 `key=REFIDX_x` 形式。 */
const EXT_PATTERN = /(msg_idx|ref_msg_idx)\s*=\s*([^\s,;]+)/;

/**
 * 解析消息事件里的引用索引键。
 * 返回 selfIdx（本条消息）与 refIdx（本条消息引用的那条），都可能是空。
 */
export function parseRefIdx(payload: QqMessagePayload): { selfIdx: string; refIdx: string } {
  const ext = payload.message_scene?.ext;
  if (!Array.isArray(ext)) return { selfIdx: "", refIdx: "" };
  let selfIdx = "";
  let refIdx = "";
  for (const raw of ext) {
    if (typeof raw !== "string") continue;
    const m = EXT_PATTERN.exec(raw);
    if (!m) continue;
    const [, key, value] = m;
    if (!value) continue;
    if (key === "ref_msg_idx") refIdx = value;
    else if (!selfIdx) selfIdx = value;
  }
  return { selfIdx, refIdx };
}

/** 压缩成单行文本：换行折叠、空白收敛，便于放在引用行里。 */
export function oneLine(text: string, limit = ENTRY_CONTENT_LIMIT): string {
  const flat = text.replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();
  if (flat.length <= limit) return flat;
  return `${flat.slice(0, limit)}…`;
}

export class RefIndex {
  readonly #logger: Pick<Console, "info" | "warn" | "error">;
  readonly #path: string;
  readonly #max: number;
  readonly #entries = new Map<string, RefIndexEntry>();
  /** 串行化落盘，避免并发 append 交错。 */
  #queue: Promise<void> = Promise.resolve();
  #sinceCompact = 0;
  #warned = false;
  #loaded = false;

  constructor({ logger, appId, max = DEFAULT_MAX }: RefIndexOptions) {
    this.#logger = logger;
    this.#max = max;
    const safeAppId = appId.replace(/[^\w.-]/g, "") || "default";
    this.#path = join(pluginDataDir(), `ref-index-${safeAppId}.jsonl`);
  }

  /** 落盘路径（设置界面展示用）。 */
  get path(): string {
    return this.#path;
  }

  /** 异步加载历史索引；失败只告警（索引是缓存，缺了不影响主流程）。 */
  load(): Promise<void> {
    if (this.#loaded) return Promise.resolve();
    this.#loaded = true;
    return this.#queue = this.#queue.then(() => this.#load()).catch((error) => {
      this.#warn("[dsh-qqbot] 引用索引加载失败（将只索引本次运行内的消息）:", error);
    });
  }

  async #load(): Promise<void> {
    let raw: string;
    try {
      raw = await readFile(this.#path, "utf8");
    } catch {
      return; // 文件不存在：首次运行
    }
    const lines = raw.split("\n").filter((l) => l.trim().length > 0);
    const start = Math.max(0, lines.length - this.#max);
    for (const line of lines.slice(start)) {
      try {
        const entry = JSON.parse(line) as RefIndexEntry;
        if (entry && typeof entry.idx === "string" && entry.idx) this.#entries.set(entry.idx, entry);
      } catch { /* 坏行跳过 */ }
    }
    if (this.#entries.size > 0) {
      this.#logger.info?.(`[dsh-qqbot] 引用索引已加载 ${this.#entries.size} 条（${this.#path}）`);
    }
  }

  /** 登记一条消息；排入异步落盘队列，调用方不必等待。 */
  record(entry: RefIndexEntry): void {
    if (!entry.idx) return;
    this.#entries.set(entry.idx, entry);
    if (this.#entries.size > this.#max) this.#evict();
    void this.#persist(entry);
  }

  /** 按索引键取回原文；不存在返回 null。 */
  resolve(idx: string): RefIndexEntry | null {
    if (!idx) return null;
    return this.#entries.get(idx) ?? null;
  }

  /** 当前索引条数（状态展示）。 */
  get size(): number {
    return this.#entries.size;
  }

  #evict(): void {
    const drop = Math.floor(this.#max / 2);
    const sorted = [...this.#entries.values()].sort((a, b) => a.at - b.at);
    for (const entry of sorted.slice(0, Math.max(0, drop))) this.#entries.delete(entry.idx);
  }

  #persist(entry: RefIndexEntry): Promise<void> {
    const task = this.#queue.then(async () => {
      try {
        await mkdir(pluginDataDir(), { recursive: true });
        await appendFile(this.#path, `${JSON.stringify(entry)}\n`, "utf8");
        this.#warned = false;
        this.#sinceCompact += 1;
        if (this.#sinceCompact >= COMPACT_EVERY) await this.#compact();
      } catch (error) {
        this.#warn("[dsh-qqbot] 引用索引写入失败（仅提示一次）:", error);
      }
    });
    this.#queue = task;
    return task;
  }

  /** 文件瘦身：用当前内存内容整体重写，去掉已被淘汰的历史行。 */
  async #compact(): Promise<void> {
    this.#sinceCompact = 0;
    try {
      const text = [...this.#entries.values()].map((e) => JSON.stringify(e)).join("\n");
      await writeFile(this.#path, text ? `${text}\n` : "", "utf8");
    } catch (error) {
      this.#warn("[dsh-qqbot] 引用索引瘦身失败（仅提示一次）:", error);
    }
  }

  #warn(message: string, error: unknown): void {
    if (this.#warned) return;
    this.#warned = true;
    this.#logger.error(message, error);
  }
}

/** 构造一条入站消息的索引条目（无 idx 时返回 null）。 */
export function inboundRefEntry(
  idx: string,
  chat: string,
  payload: QqMessagePayload,
  sender: string,
  content: string,
): RefIndexEntry | null {
  if (!idx) return null;
  return {
    idx,
    chat,
    ...(payload.id ? { msgId: payload.id } : {}),
    sender,
    senderName: payload.author?.username ?? "",
    content: oneLine(content),
    timestamp: payload.timestamp ?? "",
    fromBot: payload.author?.bot === true,
    at: Date.now(),
  };
}
