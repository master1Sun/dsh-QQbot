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
    sendTyping(target: ReplyTarget, opts?: {
        msgId?: string;
        seconds?: number;
    }): Promise<void>;
}
type Logger = Pick<Console, "warn">;
export declare class TypingKeeper {
    #private;
    constructor(client: TypingClient, logger: Logger);
    /**
     * 开始为某个单聊保持「正在输入」状态。非 c2c / 缺 msgId（合成事件）时忽略。
     * 立即发送一次，随后每 50s 重发；达到 MAX_LIFETIME_MS 后自动停止。
     */
    start(chatKey: string, target: ReplyTarget, msgId: string): void;
    /** 停止某个聊天的状态保持（回复发出 / 会话结束时调用）。 */
    stop(chatKey: string): void;
    /** 停止全部（机器人移除 / 停机时调用，防定时器泄漏）。 */
    stopAll(): void;
}
export {};
