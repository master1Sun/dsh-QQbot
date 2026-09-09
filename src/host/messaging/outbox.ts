/**
 * 投递出箱（可靠性）：被动回复发送失败时，把剩余内容写入 ~/.dsh/qqbot/outbox.json，
 * 由后台定时 flush 重试投递。被动回复窗口（群 5 分钟 / 单聊 60 分钟）大概率已过，
 * 因此重投统一走主动消息通道（受每日配额约束），保证「内容不丢」而非「原样送达」。
 *
 * 容量上限 200 条，超出丢弃最旧；每条最多重试 5 次，之后标记失败并清除。
 */
import { randomUUID } from "node:crypto";
import { readStoreJson, writeStoreJson, pluginDataDir } from "../infra/store-file.js";
import { join } from "node:path";
import { toShanghaiISO } from "../../shared/time.js";

const OUTBOX_PATH = () => join(pluginDataDir(), "outbox.json");
const OUTBOX_CAP = 200;
const MAX_ATTEMPTS = 5;

export interface OutboxItem {
  id: string;
  /** 归属机器人 AppID（由它重投）。 */
  appId: string;
  scope: "group" | "c2c";
  openid: string;
  content: string;
  createdAt: string;
  attempts: number;
  lastError?: string;
}

export class Outbox {
  #items: OutboxItem[] = [];
  #loaded = false;
  readonly #logger: Pick<Console, "warn" | "error">;

  constructor(logger: Pick<Console, "warn" | "error">) {
    this.#logger = logger;
  }

  async load(): Promise<OutboxItem[]> {
    if (this.#loaded) return this.#items;
    const data = await readStoreJson<OutboxItem[]>(OUTBOX_PATH());
    this.#items = Array.isArray(data)
      ? data.filter((i) => i && i.appId && i.openid && typeof i.content === "string" && i.content)
      : [];
    this.#loaded = true;
    return this.#items;
  }

  async #save(): Promise<void> {
    try {
      await writeStoreJson(OUTBOX_PATH(), this.#items);
    } catch (error) {
      this.#logger.warn("[dsh-qqbot] 出箱落盘失败:", error);
    }
  }

  /** 入箱一条待重投内容。 */
  async push(item: { appId: string; scope: "group" | "c2c"; openid: string; content: string }): Promise<void> {
    await this.load();
    this.#items.push({
      id: randomUUID(),
      appId: item.appId,
      scope: item.scope,
      openid: item.openid,
      content: item.content.slice(0, 4000),
      createdAt: toShanghaiISO(),
      attempts: 0,
    });
    if (this.#items.length > OUTBOX_CAP) this.#items.splice(0, this.#items.length - OUTBOX_CAP);
    await this.#save();
  }

  size(): number {
    return this.#items.length;
  }

  /**
   * 重投一轮。sender 由调用方提供（消耗主动消息配额后实际发送）。
   * 发送成功或超过重试上限的条目移出队列。
   */
  async flush(sender: (item: OutboxItem) => Promise<void>): Promise<{ sent: number; dropped: number }> {
    await this.load();
    if (this.#items.length === 0) return { sent: 0, dropped: 0 };
    const pending = [...this.#items];
    let sent = 0;
    let dropped = 0;
    for (const item of pending) {
      try {
        await sender(item);
        this.#items = this.#items.filter((i) => i.id !== item.id);
        sent += 1;
      } catch (error) {
        item.attempts += 1;
        item.lastError = error instanceof Error ? error.message : String(error);
        if (item.attempts >= MAX_ATTEMPTS) {
          this.#items = this.#items.filter((i) => i.id !== item.id);
          dropped += 1;
          this.#logger.warn(`[dsh-qqbot] 出箱条目重试 ${item.attempts} 次仍失败，已丢弃: ${item.lastError}`);
        }
      }
    }
    if (sent > 0 || dropped > 0) await this.#save();
    return { sent, dropped };
  }
}
