/**
 * 「正在输入」状态保持器（参考 oc-src typingIndicator 中间件）：
 *
 * 单聊收到消息进入 AI 处理期间，向 QQ 发送 msg_type=6 input_notify（平台窗口约 60s），
 * 每 50s 重发一次保持状态可见，直到回复发出（stop）或达到最长保持时限（防止
 * 会话异常结束导致定时器泄漏/状态永挂）。
 *
 * 仅单聊（C2C）生效——QQ 平台的输入状态 API 不支持群聊；发送失败静默降级
 * （不影响消息处理主流程），仅记 warn 日志。
 */
import type { ReplyTarget } from "../../shared/types.js";

interface TypingClient {
  sendTyping(target: ReplyTarget, opts?: { msgId?: string; seconds?: number }): Promise<void>;
}

type Logger = Pick<Console, "warn">;

/** 每次发送的状态持续秒数（平台窗口约 60s，取 60）。 */
const DURATION_SEC = 60;
/** 重发间隔：小于平台窗口，保证状态无缝。 */
const KEEPALIVE_INTERVAL_MS = 50_000;
/** 最长保持时限：超过后自动停止（AI 处理通常远短于此）。 */
const MAX_LIFETIME_MS = 5 * 60_000;

export class TypingKeeper {
  readonly #client: TypingClient;
  readonly #logger: Logger;
  /** chatKey → 定时器。同一聊天重复 start 会先清旧定时器再重启。 */
  readonly #timers = new Map<string, ReturnType<typeof setInterval>>();

  constructor(client: TypingClient, logger: Logger) {
    this.#client = client;
    this.#logger = logger;
  }

  /**
   * 开始为某个单聊保持「正在输入」状态。非 c2c / 缺 msgId（合成事件）时忽略。
   * 立即发送一次，随后每 50s 重发；达到 MAX_LIFETIME_MS 后自动停止。
   */
  start(chatKey: string, target: ReplyTarget, msgId: string): void {
    if (target.scope !== "c2c" || !msgId) return;
    this.stop(chatKey);
    const send = () =>
      this.#client.sendTyping(target, { msgId, seconds: DURATION_SEC }).catch((error) => {
        // 平台拒绝/网络抖动只降级不重试（下一轮 keepalive 会再试）。
        this.#logger.warn(
          `[dsh-qqbot] 发送输入状态失败（不影响消息处理）: ${error instanceof Error ? error.message : String(error)}`,
        );
      });
    void send();
    const startedAt = Date.now();
    const timer = setInterval(() => {
      if (Date.now() - startedAt >= MAX_LIFETIME_MS) {
        this.stop(chatKey);
        return;
      }
      void send();
    }, KEEPALIVE_INTERVAL_MS);
    timer.unref?.();
    this.#timers.set(chatKey, timer);
  }

  /** 停止某个聊天的状态保持（回复发出 / 会话结束时调用）。 */
  stop(chatKey: string): void {
    const timer = this.#timers.get(chatKey);
    if (!timer) return;
    clearInterval(timer);
    this.#timers.delete(chatKey);
  }

  /** 停止全部（机器人移除 / 停机时调用，防定时器泄漏）。 */
  stopAll(): void {
    for (const timer of this.#timers.values()) clearInterval(timer);
    this.#timers.clear();
  }
}
