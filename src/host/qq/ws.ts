/**
 * QQ WebSocket 接收源（@tencent-connect/qqbot-nodejs 官方 SDK，transport=websocket）。
 *
 * 本机主动拨出 QQ 网关（wss 长连接）接收事件，无需公网 IP / 域名 / 回调配置：
 *   appId+appSecret → access_token → GET /gateway → wss → IDENTIFY(intents)
 *   → 群 AT / 群全量 / 单聊事件 → 复用 webhookRuntime 会话管道。
 *
 * 事件映射：InboundMessage.raw（平台原始事件体）即 webhook 模式信封里的 d，
 * 组回 { eventType, payload: { op:0, id, t, d } } 喂给既有 rule.ts 管道。
 */
import { QQBot, type QQBotInboundMessage, type QQBotOptions } from "@tencent-connect/qqbot-nodejs";
import { FULL_INTENTS } from "@tencent-connect/qqbot-nodejs/protocol";
import type { QqbotConfig } from "../../shared/config.js";
import type { QqEnvelope } from "../../shared/types.js";

export type WsState = "idle" | "connecting" | "connected" | "reconnecting" | "failed";

export interface WsStatus {
  state: WsState;
  appId: string;
  lastConnectedAt: number | null;
  lastError: string | null;
  /** 本次连接以来收到的事件数（rule.ts 的 received 计数器之外的总闸）。 */
  events: number;
}

export interface QqWsSourceOptions {
  logger: Pick<Console, "info" | "warn" | "error">;
  /** 组装好的事件 → index.ts 转发进 webhookRuntime.dispatch。 */
  onEvent: (eventType: string, payload: QqEnvelope, deliveryId: string) => void;
  /** 原始网关事件（成员进出、表情、好友等 SDK 未单独封装的事件）出口。 */
  onRawEvent?: (eventType: string, data: unknown) => void;
  /** 频道 READY 数据（含机器人在频道侧的 user.id），用于识别评论里的 @机器人。 */
  onReady?: (data: unknown) => void;
  /** 频道消息（kind=guild）：不进会话管线，交给频道 AI 接管服务审核。 */
  onGuildMessage?: (message: QQBotInboundMessage) => void;
  /** 按钮回调（INTERACTION_CREATE，SDK 单独封装为 interaction 事件）出口。 */
  onInteraction?: (event: unknown) => void;
  /**
   * 连接状态变化出口（state / lastError 实际变化时触发）。
   * 收到事件的 events 计数递增不触发——那是每条消息都发生的高频变化。
   */
  onStatusChange?: (appId: string, status: WsStatus) => void;
}

/** 单次连接就绪超时（毫秒）：token 换取 + 网关重试 + wss 握手 + READY。 */
const CONNECT_TIMEOUT_MS = 60_000;
/**
 * SDK 内部只做少量快速重试，最终失败交给本类统一退避重启。
 * 否则 SDK 默认无限重连与外层重试会互相叠加，把 /gateway 限流越冲越狠。
 */
const SDK_RECONNECT = Object.freeze({ maxAttempts: 2, delays: [1_000, 3_000] as const });
/** 插件级完整重连退避：5s → 10s → 20s → … → 5min；限流则从 1min 起步。 */
const BASE_RETRY_MS = 5_000;
const MAX_RETRY_MS = 5 * 60_000;
const RATE_LIMIT_RETRY_MS = 60_000;
/** 私域频道全量消息 / 论坛事件（默认不订阅：无权限会导致网关鉴权失败）。 */
const INTENT_GUILD_MESSAGES = 1 << 9;
const INTENT_FORUMS_EVENT = 1 << 28;

/** QQ / SDK 的限流错误文案（SDK 只识别英文，中文文案需在这里兜住）。 */
function isRateLimitError(message: string): boolean {
  return /频率限制|请求过于频繁|Too many requests|\b429\b|100001/i.test(message);
}

/**
 * 项目类型基线里的 SDK（1.0.4）还没有 reconnect 字段，但宿主实际加载的 1.0.5 已支持。
 * 这里用交叉类型兜住，等基线升级后可直接删掉。
 */
type QqBotOptionsWithReconnect = QQBotOptions & {
  reconnect?: { maxAttempts: number; delays: readonly number[] };
};

export class QqWsSource {
  readonly #logger: QqWsSourceOptions["logger"];
  readonly #onEvent: QqWsSourceOptions["onEvent"];
  readonly #onRawEvent: QqWsSourceOptions["onRawEvent"];
  readonly #onReady: QqWsSourceOptions["onReady"];
  readonly #onGuildMessage: QqWsSourceOptions["onGuildMessage"];
  readonly #onInteraction: QqWsSourceOptions["onInteraction"];
  readonly #onStatusChange: QqWsSourceOptions["onStatusChange"];
  #bot: QQBot | null = null;
  #abort: AbortController | null = null;
  #starting: Promise<void> | null = null;
  #retryTimer: ReturnType<typeof setTimeout> | null = null;
  #retryDelay = BASE_RETRY_MS;
  /** 每次 stop / start 自增：旧连接的延迟回调、READY、错误一律失效。 */
  #generation = 0;
  #status: WsStatus = { state: "idle", appId: "", lastConnectedAt: null, lastError: null, events: 0 };

  constructor(options: QqWsSourceOptions) {
    this.#logger = options.logger;
    this.#onEvent = options.onEvent;
    this.#onRawEvent = options.onRawEvent;
    this.#onReady = options.onReady;
    this.#onGuildMessage = options.onGuildMessage;
    this.#onInteraction = options.onInteraction;
    this.#onStatusChange = options.onStatusChange;
  }

  get status(): WsStatus {
    return { ...this.#status };
  }

  /**
   * 统一的状态赋值入口：实际发生 state / lastError 变化时触发 onStatusChange。
   * events 计数递增走裸赋值（#accept），不经过这里。
   */
  #setStatus(status: WsStatus): void {
    const prev = this.#status;
    this.#status = status;
    if (prev.state !== status.state || prev.lastError !== status.lastError) {
      try {
        this.#onStatusChange?.(status.appId, { ...status });
      } catch {
        /* 通知失败不影响连接生命周期 */
      }
    }
  }

  /** 底层 SDK 实例（已连接后可用），供媒体上传 / 撤回 / 原生 API 调用。 */
  get sdk(): QQBot | null {
    return this.#bot;
  }

  /** 按当前配置启动连接；已连接时先停再起（凭据热更新路径）。 */
  async start(config: QqbotConfig): Promise<void> {
    await this.stop();
    if (!config.appId || !config.appSecret) {
      this.#setStatus({ ...this.#status, state: "idle", appId: config.appId, lastError: null });
      this.#logger.warn("[dsh-qqbot] WebSocket 未启动：凭据不完整（请扫码登录或填写 AppID/AppSecret）");
      return;
    }
    this.#starting = this.#launch(config, "initial");
    return this.#starting;
  }

  /** 等待当前 start() 完成（不抛错，错误已在状态里）。 */
  async settle(): Promise<void> {
    await this.#starting?.catch(() => undefined);
  }

  async stop(): Promise<void> {
    // 先让所有旧回调失效：超时器、SDK 错误、延迟重连都不能再改新连接的状态。
    this.#generation += 1;
    if (this.#retryTimer) clearTimeout(this.#retryTimer);
    this.#retryTimer = null;
    this.#retryDelay = BASE_RETRY_MS;
    this.#starting = null;
    const bot = this.#bot;
    const abort = this.#abort;
    this.#bot = null;
    this.#abort = null;
    abort?.abort();
    try {
      bot?.stop();
    } catch {
      /* 已停止 */
    }
    this.#setStatus({ ...this.#status, state: "idle" });
  }

  /**
   * 单次连接尝试。SDK 内部只允许少量快速重试；最终失败由本类按退避重启，
   * 避免「SDK 无限重连 + 外层再次 start」互相叠加把 /gateway 限流冲得更严重。
   */
  async #launch(config: QqbotConfig, mode: "initial" | "retry"): Promise<void> {
    const generation = this.#generation;
    const options: QqBotOptionsWithReconnect = {
      appId: config.appId,
      appSecret: config.appSecret,
      logger: {
        error: (...args: unknown[]) => this.#logger.error(...args),
        warn: (...args: unknown[]) => this.#logger.warn(...args),
        info: (...args: unknown[]) => this.#logger.info(...args),
        debug: () => {},
      },
      transport: "websocket",
      tokenPrefetch: "sync",
      reconnect: SDK_RECONNECT,
      intents: FULL_INTENTS
        | (config.guildMessageEvents ? INTENT_GUILD_MESSAGES : 0)
        | (config.forumEvents ? INTENT_FORUMS_EVENT : 0),
    };
    const bot = new QQBot(options);
    const abort = new AbortController();
    this.#bot = bot;
    this.#abort = abort;
    this.#setStatus({
      state: mode === "retry" ? "reconnecting" : "connecting",
      appId: config.appId,
      lastConnectedAt: mode === "initial" ? null : this.#status.lastConnectedAt,
      lastError: mode === "initial" ? null : this.#status.lastError,
      events: mode === "initial" ? 0 : this.#status.events,
    });

    let readyResolve = (): void => {};
    let cleanupReady = (): void => {};
    let failed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const ready = new Promise<void>((resolve) => {
      readyResolve = resolve;
      const onReady = () => {
        cleanupReady();
        resolve();
      };
      cleanupReady = () => {
        bot.off("ready", onReady);
        bot.off("resumed", onReady);
      };
      bot.on("ready", onReady);
      bot.on("resumed", onReady);
    });

    /** 统一失败出口：只处理一次，并立刻停止旧 SDK，防止它继续后台重连。 */
    const fail = (error: unknown): void => {
      if (failed || generation !== this.#generation) return;
      failed = true;
      clearTimeout(timer);
      cleanupReady();
      abort.abort();
      this.#bot = null;
      this.#abort = null;
      const message = error instanceof Error ? error.message : String(error);
      this.#setStatus({ ...this.#status, state: "failed", lastError: message });
      this.#logger.error("[dsh-qqbot] QQ WebSocket 连接失败:", error);
      this.#scheduleRetry(config, message, generation);
    };

    bot.on("ready", (data: unknown) => {
      if (generation !== this.#generation || failed) return;
      try { this.#onReady?.(data); } catch { /* 通知失败不影响连接生命周期 */ }
      // READY 即握手成功：清掉退避状态，后续断线由 SDK 自己的重连处理。
      if (this.#retryTimer) clearTimeout(this.#retryTimer);
      this.#retryTimer = null;
      this.#retryDelay = BASE_RETRY_MS;
      this.#setStatus({ ...this.#status, state: "connected", lastConnectedAt: Date.now(), lastError: null });
      this.#logger.info(`[dsh-qqbot] QQ WebSocket 已连接（AppID ${config.appId}），开始接收消息`);
      readyResolve();
    });
    bot.on("resumed", () => {
      if (generation !== this.#generation || failed) return;
      this.#setStatus({ ...this.#status, state: "connected", lastError: null });
      this.#logger.info("[dsh-qqbot] QQ WebSocket 会话已恢复（RESUME）");
      readyResolve();
    });
    bot.on("error", (error: unknown) => {
      if (generation !== this.#generation || failed) return;
      const message = error instanceof Error ? error.message : String(error);
      // 已连接时的瞬时错误交给 SDK 重连，状态保持 connected；握手阶段则显示「重连中」。
      const state = this.#status.state === "connected" ? "connected" : "reconnecting";
      this.#setStatus({ ...this.#status, state, lastError: message });
      if (state === "connected") {
        this.#logger.warn("[dsh-qqbot] QQ WebSocket 连接错误（SDK 将自动重连）:", error);
      }
    });
    bot.on("message", (_ctx: unknown, message: QQBotInboundMessage) => {
      if (generation !== this.#generation) return;
      try {
        // 频道消息（guild）不进 webhook 会话管线，交给频道 AI 接管服务。
        if ((message.kind === "guild" || message.kind === "dm") && this.#onGuildMessage) {
          this.#onGuildMessage(message);
          return;
        }
        this.#accept(message);
      } catch (error) {
        this.#logger.error("[dsh-qqbot] 事件处理失败:", error);
      }
    });
    // 原始网关事件：覆盖成员进出、表情回应、好友添加、撤回等 SDK 未单独封装的事件。
    bot.on("rawEvent", (ctx: { eventType: string; data: unknown }) => {
      if (generation !== this.#generation) return;
      try {
        this.#onRawEvent?.(ctx.eventType, ctx.data);
      } catch (error) {
        this.#logger.error("[dsh-qqbot] 原始事件处理失败:", error);
      }
    });
    // 按钮回调：INTERACTION_CREATE 被 SDK 封装成独立的 interaction 事件（不进 rawEvent）。
    bot.on("interaction", (_ctx: unknown, event: unknown) => {
      if (generation !== this.#generation) return;
      try {
        this.#onInteraction?.(event);
      } catch (error) {
        this.#logger.error("[dsh-qqbot] 按钮回调处理失败:", error);
      }
    });

    const runTask = Promise.resolve().then(() => bot.start(abort.signal));
    runTask.catch((error) => {
      if (abort.signal.aborted) return;
      fail(error);
    });

    timer = setTimeout(() => {
      fail(new Error(`WebSocket 连接超时（${Math.round(CONNECT_TIMEOUT_MS / 1000)}s 内未 READY）`));
    }, CONNECT_TIMEOUT_MS);

    try {
      // runTask 拒绝 = SDK 重试预算耗尽 / 致命关闭；ready 兑现 = 握手成功。
      // 不再让每次普通 error 都打断等待，否则网关限流时会被误判成彻底失败。
      await Promise.race([ready, runTask]);
    } catch (error) {
      fail(error);
    } finally {
      clearTimeout(timer);
      cleanupReady();
    }
  }

  /** 连接最终失败后安排一次完整重启：限流 1 分钟起步，其余 5s 起指数退避。 */
  #scheduleRetry(config: QqbotConfig, message: string, generation: number): void {
    if (generation !== this.#generation) return;
    if (this.#retryTimer) clearTimeout(this.#retryTimer);
    const rateLimited = isRateLimitError(message);
    const delay = rateLimited
      ? Math.max(RATE_LIMIT_RETRY_MS, this.#retryDelay)
      : this.#retryDelay;
    this.#retryDelay = Math.min(MAX_RETRY_MS, Math.max(BASE_RETRY_MS, delay * 2));
    const seconds = Math.round(delay / 1000);
    this.#logger.warn(`[dsh-qqbot] ${seconds}s 后自动重连 AppID ${config.appId}${rateLimited ? "（平台限流，已拉长退避）" : ""}`);
    this.#retryTimer = setTimeout(() => {
      this.#retryTimer = null;
      if (generation !== this.#generation) return;
      void this.#launch(config, "retry").catch((error) => {
        this.#logger.error("[dsh-qqbot] 自动重连失败:", error);
      });
    }, delay);
    this.#retryTimer.unref?.();
  }

  /** InboundMessage → webhook 信封（复用 rule.ts / webhookRuntime 管道）。 */
  #accept(message: QQBotInboundMessage): void {
    const eventType = message.rawEventType;
    // 非消息事件（READY / HEARTBEAT 等）由 SDK 过滤；kind 不是 c2c/group 的（频道等）忽略。
    if (!eventType || (message.kind !== "c2c" && message.kind !== "group")) return;
    const raw = (message.raw ?? {}) as unknown as Record<string, unknown>;
    // messageId / 时间戳兜底：原始事件缺字段时补齐，rule.ts 依赖 d.id 做被动回复与去重。
    // 附件（图片/文件/语音）与 msgType 一并带入，供 rule 层做多模态/语音转写判断。
    const payload: QqEnvelope = {
      op: 0,
      id: message.messageId || String(raw.id ?? ""),
      t: eventType,
      d: {
        ...raw,
        id: raw.id ?? message.messageId,
        content: raw.content ?? message.content,
        ...(message.msgType !== undefined ? { msg_type: message.msgType } : {}),
        ...(Array.isArray(message.attachments) && message.attachments.length > 0
          ? { attachments: message.attachments }
          : {}),
      },
    };
    this.#status = { ...this.#status, events: this.#status.events + 1 };
    const deliveryId = `qqws:${message.messageId || `${eventType}:${Date.now()}:${this.#status.events}`}`;
    this.#onEvent(eventType, payload, deliveryId);
  }
}
