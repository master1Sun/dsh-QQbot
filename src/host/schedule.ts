/**
 * 定时主动消息：每个群/单聊最多 5 条，持久化于 ~/.dsh/qqbot/schedules.json。
 *
 * 两种类型：
 *  - daily：每天 HH:mm（上海时间）发送一次；
 *  - interval：每 N 分钟循环发送。
 *
 * 调度器每 30 秒 tick 一次：到点 → 主动消息通道发送 → 计算并落盘下一次时间。
 * 重启后 nextRunAt 缺失或已过期时自动补算（daily 取下一个未来时刻，interval 取 now+间隔）。
 */
import { randomUUID } from "node:crypto";
import type { BotRuntime } from "./bots.js";
import type { QuotaTracker } from "./quota.js";
import { pluginDataDir, readStoreJson, writeStoreJson } from "./store-file.js";
import { SHANGHAI_OFFSET_MS, shanghaiWallClock, toShanghaiISO, toShanghaiISOOrNull } from "../shared/time.js";

export const MAX_SCHEDULES_PER_CHAT = 5;

export interface ScheduleEntry {
  id: string;
  /** 归属机器人 AppID：由该机器人发送（缺省 = 主机器人）。 */
  appId?: string;
  scope: "group" | "c2c";
  openid: string;
  type: "daily" | "interval";
  /** daily 时的 HH:mm（上海时间）。 */
  time?: string;
  /** interval 时的分钟数。 */
  minutes?: number;
  /**
   * mode=text 时为直接发送的内容；mode=ai 时为交给 AI 的生成指令
   * （到点由调度器在目标聊天创建会话生成内容并回复）。
   */
  mode?: "text" | "ai";
  content: string;
  createdAt: string;
  createdBy?: string;
  enabled: boolean;
  /** ISO 时间（上海时区，含 +08:00 偏移）；缺失或过期时由调度器补算。 */
  nextRunAt?: string;
  lastSentAt?: string;
  lastError?: string;
}

const SCHEDULES_PATH = () => joinPath(pluginDataDir(), "schedules.json");

function joinPath(dir: string, name: string): string {
  return dir.endsWith("\\") || dir.endsWith("/") ? dir + name : `${dir}/${name}`;
}

export class ScheduleStore {
  #entries: ScheduleEntry[] = [];
  #loaded = false;
  readonly #logger: Pick<Console, "warn" | "error">;

  constructor(logger: Pick<Console, "warn" | "error">) {
    this.#logger = logger;
  }

  async load(): Promise<ScheduleEntry[]> {
    if (this.#loaded) return this.#entries;
    const data = await readStoreJson<ScheduleEntry[]>(SCHEDULES_PATH());
    const valid = Array.isArray(data) ? data.filter((e) => e && e.id && e.openid && e.content) : [];
    if (Array.isArray(data) && valid.length !== data.length) {
      this.#logger.warn(`[dsh-qqbot] 定时消息文件存在 ${data.length - valid.length} 条无效记录，已忽略`);
    }
    this.#entries = valid;
    this.#loaded = true;
    return this.#entries;
  }

  async save(): Promise<void> {
    await writeStoreJson(SCHEDULES_PATH(), this.#entries);
  }

  list(): ScheduleEntry[] {
    return [...this.#entries];
  }

  listForChat(scope: string, openid: string): ScheduleEntry[] {
    return this.#entries.filter((e) => e.scope === scope && e.openid === openid);
  }

  countForChat(scope: string, openid: string): number {
    return this.listForChat(scope, openid).length;
  }

  /**
   * 添加定时消息；超过单聊上限或参数非法时返回错误文案。
   * 传 id 时为编辑（保留原 id），否则新建。
   */
  async add(input: {
    scope: string;
    openid: string;
    type: string;
    time?: string;
    minutes?: number;
    content: string;
    createdBy?: string;
    id?: string;
    /** 归属机器人 AppID（缺省 = 主机器人）。 */
    appId?: string;
    /** text=直接发送 content；ai=content 为生成指令，到点由 AI 生成后回复。 */
    mode?: string;
  }): Promise<{ ok: true; entry: ScheduleEntry } | { ok: false; error: string }> {
    const scope = input.scope === "c2c" ? "c2c" : input.scope === "group" ? "group" : null;
    if (!scope || !input.openid) return { ok: false, error: "缺少 scope/openid" };
    const content = input.content.trim();
    if (!content) return { ok: false, error: "消息内容不能为空" };
    if (content.length > 2000) return { ok: false, error: "消息内容过长（上限 2000 字）" };

    const type = input.type === "daily" ? "daily" : input.type === "interval" ? "interval" : null;
    if (!type) return { ok: false, error: "type 必须是 daily 或 interval" };

    if (type === "daily") {
      if (!/^\d{1,2}:\d{2}$/.test(input.time ?? "") || !nextDailyRun(input.time!, new Date())) {
        return { ok: false, error: "time 格式应为 HH:mm（上海时间，如 09:30）" };
      }
    } else {
      const minutes = Number(input.minutes);
      if (!Number.isSafeInteger(minutes) || minutes < 5) {
        return { ok: false, error: "间隔不能小于 5 分钟" };
      }
    }

    const existing = input.id ? this.#entries.find((e) => e.id === input.id) : undefined;
    if (input.id && !existing) return { ok: false, error: "未找到该定时消息" };
    if (!existing && this.countForChat(scope, input.openid) >= MAX_SCHEDULES_PER_CHAT) {
      return { ok: false, error: `每个群/单聊最多 ${MAX_SCHEDULES_PER_CHAT} 条定时消息` };
    }

    const entry: ScheduleEntry = {
      ...(existing ?? { id: randomUUID(), createdAt: toShanghaiISO() }),
      scope,
      openid: input.openid,
      type,
      ...(type === "daily" ? { time: input.time, minutes: undefined } : { minutes: Number(input.minutes), time: undefined }),
      mode: input.mode === "ai" ? "ai" as const : "text" as const,
      content,
      enabled: true,
      ...(input.createdBy ? { createdBy: input.createdBy } : {}),
      ...(input.appId ? { appId: input.appId } : {}),
      nextRunAt: undefined,
      lastError: undefined,
    };
    entry.nextRunAt = toShanghaiISOOrNull(nextRunFor(entry, new Date()));
    if (existing) {
      Object.assign(existing, entry, { id: existing.id, createdAt: existing.createdAt });
    } else {
      this.#entries.push(entry);
    }
    await this.save();
    return { ok: true, entry };
  }

  /** 按序号（聊天内）或 id 删除。 */
  async remove(scope: string, openid: string, idOrIndex: string): Promise<{ ok: true; entry: ScheduleEntry } | { ok: false; error: string }> {
    const mine = this.listForChat(scope, openid);
    let entry: ScheduleEntry | undefined;
    const index = Number(idOrIndex);
    if (Number.isSafeInteger(index) && index >= 1) {
      entry = mine[index - 1];
    } else {
      entry = mine.find((e) => e.id === idOrIndex);
    }
    if (!entry) return { ok: false, error: `未找到该定时消息（序号 1-${mine.length}）` };
    this.#entries = this.#entries.filter((e) => e.id !== entry!.id);
    await this.save();
    return { ok: true, entry };
  }

  /** 设置页用：仅凭全局 id 删除（无需 scope/openid）。 */
  async removeById(id: string): Promise<{ ok: true; entry: ScheduleEntry } | { ok: false; error: string }> {
    await this.load();
    const entry = this.#entries.find((e) => e.id === id);
    if (!entry) return { ok: false, error: "未找到该定时消息" };
    this.#entries = this.#entries.filter((e) => e.id !== id);
    await this.save();
    return { ok: true, entry };
  }

  /** 到达执行时间的条目（now 之前）。 */
  dueEntries(now: Date): ScheduleEntry[] {
    return this.#entries.filter((e) => {
      if (!e.enabled) return false;
      if (!e.nextRunAt) return false;
      return new Date(e.nextRunAt).getTime() <= now.getTime();
    });
  }
}

/** daily HH:mm 的下一个上海时区时刻。 */
export function nextDailyRun(time: string, now: Date): Date | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  if (hour > 23 || minute > 59) return null;
  // 以上海墙钟为基准，定位下一个 hour:minute 对应的真实瞬时。
  const wall = shanghaiWallClock(now); // UTC 字段 = 上海墙钟
  const target = new Date(wall);
  target.setUTCHours(hour, minute, 0, 0);
  let realMs = target.getTime() - SHANGHAI_OFFSET_MS; // 还原为真实瞬时
  if (realMs <= now.getTime()) realMs += 24 * 60 * 60 * 1000;
  return new Date(realMs);
}

/** interval 分钟的下一个时刻。 */
export function nextIntervalRun(minutes: number, now: Date): Date | null {
  if (!Number.isSafeInteger(minutes) || minutes < 5) return null;
  return new Date(now.getTime() + minutes * 60_000);
}

/** 按条目类型计算下一次执行时间。 */
export function nextRunFor(entry: ScheduleEntry, now: Date): Date | null {
  if (entry.type === "daily") return entry.time ? nextDailyRun(entry.time, now) : null;
  if (entry.type === "interval") return nextIntervalRun(Number(entry.minutes), now);
  return null;
}

export interface SchedulerContext {
  store: ScheduleStore;
  /** 按 AppID 取机器人运行时（定时消息由归属机器人发送）；缺省取主机器人。 */
  resolveBot: (appId?: string) => BotRuntime | undefined;
  /** 主动消息每日配额（定时发送消耗）。 */
  quota?: QuotaTracker;
  /**
   * AI 模式生成回调：由 index.ts 提供——把 prompt 当作合成事件注入 webhookRuntime，
   * 机器人在目标聊天创建会话生成内容并回复（回复走主动消息通道）。
   */
  generateAndSend?: (entry: ScheduleEntry, bot: BotRuntime) => Promise<void>;
  logger: Pick<Console, "info" | "warn" | "error">;
}

/** 进程内调度循环（30 秒 tick）。 */
export class Scheduler {
  #ctx: SchedulerContext;
  #timer: ReturnType<typeof setInterval> | null = null;
  #running = false;

  constructor(ctx: SchedulerContext) {
    this.#ctx = ctx;
  }

  start(): void {
    if (this.#timer) return;
    // 启动时补算所有缺失/过期的 nextRunAt。
    void this.#ctx.store.load().then((entries) => {
      const now = new Date();
      let changed = false;
      for (const entry of entries) {
        if (!entry.enabled) continue;
        const next = new Date(entry.nextRunAt ?? 0);
        if (!entry.nextRunAt || next.getTime() <= now.getTime()) {
          const computed = nextRunFor(entry, now);
          entry.nextRunAt = toShanghaiISOOrNull(computed);
          changed = true;
        }
      }
      if (changed) void this.#ctx.store.save();
    });
    this.#timer = setInterval(() => {
      void this.tick();
    }, 30_000);
    this.#timer.unref?.();
  }

  stop(): void {
    if (this.#timer) clearInterval(this.#timer);
    this.#timer = null;
  }

  async tick(now = new Date()): Promise<void> {
    if (this.#running) return;
    this.#running = true;
    try {
      await this.#ctx.store.load();
      for (const entry of this.#ctx.store.dueEntries(now)) {
        // 定时消息由归属机器人发送；机器人被删除/停用时顺延，不误发给别人。
        const bot = this.#ctx.resolveBot(entry.appId);
        if (!bot) {
          entry.lastError = `机器人 ${entry.appId ?? "(未指定)"} 不可用（已删除或未启用）`;
          entry.nextRunAt = toShanghaiISOOrNull(nextRunFor(entry, now));
          continue;
        }
        // 主动消息配额：不足时顺延到下个周期（不置 lastError，属正常等待）。
        if (this.#ctx.quota && !(await this.#ctx.quota.tryConsume())) {
          entry.nextRunAt = toShanghaiISOOrNull(new Date(now.getTime() + 5 * 60_000));
          continue;
        }
        try {
          if (entry.mode === "ai" && this.#ctx.generateAndSend) {
            // AI 模式：把 prompt 当作合成事件注入会话管线，机器人生成并回复。
            await this.#ctx.generateAndSend(entry, bot);
          } else {
            await bot.client.sendText(
              { scope: entry.scope, openid: entry.openid },
              entry.content,
            );
          }
          bot.state.counters.proactive += 1;
          entry.lastSentAt = toShanghaiISO(now);
          entry.lastError = undefined;
          const next = nextRunFor(entry, now);
          entry.nextRunAt = toShanghaiISOOrNull(next);
          this.#ctx.logger.info(
            `[dsh-qqbot] 定时消息已发送（机器人 ${bot.appId}，mode=${entry.mode ?? "text"}）→ ${entry.scope}:${entry.openid}`,
          );
        } catch (error) {
          entry.lastError = error instanceof Error ? error.message : String(error);
          // daily 丢失后顺延到明天；interval 顺延一个周期，避免失败风暴。
          const next = nextRunFor(entry, now);
          entry.nextRunAt = toShanghaiISOOrNull(next);
          this.#ctx.logger.error("[dsh-qqbot] 定时消息发送失败:", error);
        }
        void bot.archiver.append({
          kind: "proactive",
          chat: `${entry.scope}:${entry.openid}`,
          content: entry.content,
          note: `schedule:${entry.type}`,
        });
      }
      await this.#ctx.store.save();
    } finally {
      this.#running = false;
    }
  }
}
