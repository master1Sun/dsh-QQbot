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
import type { QqbotConfig } from "../../shared/config.js";
import type { QqEnvelope } from "../../shared/types.js";

export type WsState = "idle" | "connecting" | "connected" | "failed";

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
}

/** 连接就绪超时（毫秒）：token 换取 + wss 握手 + READY。 */
const CONNECT_TIMEOUT_MS = 20_000;

export class QqWsSource {
  readonly #logger: QqWsSourceOptions["logger"];
  readonly #onEvent: QqWsSourceOptions["onEvent"];
  readonly #onRawEvent: QqWsSourceOptions["onRawEvent"];
  #bot: QQBot | null = null;
  #abort: AbortController | null = null;
  #starting: Promise<void> | null = null;
  #status: WsStatus = { state: "idle", appId: "", lastConnectedAt: null, lastError: null, events: 0 };

  constructor(options: QqWsSourceOptions) {
    this.#logger = options.logger;
    this.#onEvent = options.onEvent;
    this.#onRawEvent = options.onRawEvent;
  }

  get status(): WsStatus {
    return { ...this.#status };
  }

  /** 底层 SDK 实例（已连接后可用），供媒体上传 / 撤回 / 原生 API 调用。 */
  get sdk(): QQBot | null {
    return this.#bot;
  }

  /** 按当前配置启动连接；已连接时先停再起（凭据热更新路径）。 */
  async start(config: QqbotConfig): Promise<void> {
    await this.stop();
    if (!config.appId || !config.appSecret) {
      this.#status = { ...this.#status, state: "idle", appId: config.appId, lastError: null };
      this.#logger.warn("[dsh-qqbot] WebSocket 未启动：凭据不完整（请扫码登录或填写 AppID/AppSecret）");
      return;
    }
    const run = this.#start(config).catch((error) => {
      const message = error instanceof Error ? error.message : String(error);
      this.#status = { ...this.#status, state: "failed", lastError: message };
      this.#logger.error("[dsh-qqbot] WebSocket 连接失败:", error);
    });
    this.#starting = run;
    return run;
  }

  /** 等待当前 start() 完成（不抛错，错误已在状态里）。 */
  async settle(): Promise<void> {
    await this.#starting?.catch(() => undefined);
  }

  async stop(): Promise<void> {
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
    this.#status = { ...this.#status, state: "idle" };
  }

  async #start(config: QqbotConfig): Promise<void> {
    const options: QQBotOptions = {
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
    };
    const bot = new QQBot(options);
    const abort = new AbortController();
    this.#bot = bot;
    this.#abort = abort;
    this.#status = { state: "connecting", appId: config.appId, lastConnectedAt: null, lastError: null, events: 0 };

    bot.on("ready", () => {
      this.#status = { ...this.#status, state: "connected", lastConnectedAt: Date.now(), lastError: null };
      this.#logger.info(`[dsh-qqbot] QQ WebSocket 已连接（AppID ${config.appId}），开始接收消息`);
    });
    bot.on("resumed", () => {
      this.#status = { ...this.#status, state: "connected", lastError: null };
      this.#logger.info("[dsh-qqbot] QQ WebSocket 会话已恢复（RESUME）");
    });
    bot.on("error", (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      this.#status = { ...this.#status, lastError: message };
      if (this.#status.state === "connected") {
        this.#logger.warn("[dsh-qqbot] QQ WebSocket 连接错误（SDK 将自动重连）:", error);
      }
    });
    bot.on("message", (_ctx: unknown, message: QQBotInboundMessage) => {
      try {
        this.#accept(message);
      } catch (error) {
        this.#logger.error("[dsh-qqbot] 事件处理失败:", error);
      }
    });
    // 原始网关事件：覆盖成员进出、表情回应、好友添加、撤回等 SDK 未单独封装的事件。
    bot.on("rawEvent", (ctx: { eventType: string; data: unknown }) => {
      try {
        this.#onRawEvent?.(ctx.eventType, ctx.data);
      } catch (error) {
        this.#logger.error("[dsh-qqbot] 原始事件处理失败:", error);
      }
    });

    const ready = new Promise<void>((resolve, reject) => {
      const onReady = () => {
        cleanup();
        resolve();
      };
      const onError = (error: unknown) => {
        cleanup();
        reject(error instanceof Error ? error : new Error(String(error)));
      };
      const cleanup = () => {
        bot.off("ready", onReady);
        bot.off("resumed", onReady);
        bot.off("error", onError);
      };
      bot.on("ready", onReady);
      bot.on("resumed", onReady);
      bot.on("error", onError);
    });

    const runTask = Promise.resolve().then(() => bot.start(abort.signal));
    runTask.catch((error) => {
      if (abort.signal.aborted) return;
      this.#status = { ...this.#status, state: "failed", lastError: error instanceof Error ? error.message : String(error) };
      this.#logger.error("[dsh-qqbot] QQ WebSocket 连接停止:", error);
    });

    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      // ready：网关就绪；runTask：bot.start() 本身抛错（如 token 换取失败）——
      // 两者任一先决出结果即结束等待，避免真实错误被连接超时掩盖。
      await Promise.race([
        ready,
        runTask,
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error("WebSocket 连接超时（20s 内未 READY）")), CONNECT_TIMEOUT_MS);
        }),
      ]);
    } finally {
      clearTimeout(timer);
    }
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
