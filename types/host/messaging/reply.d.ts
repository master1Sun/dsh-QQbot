/**
 * 回复泵：监听 session/event，把助手回复发回「来源机器人」对应的 QQ 聊天。
 *
 * 流程：
 *  1. `user/message`（source.kind === "webhook"）→ 用 deliveryId 找到来源机器人，
 *     在其独立状态里绑定 QQ 回复目标与 DSH 会话（含聊天键复用绑定）；
 *  2. `assistant/message` → 按 (会话, turn) 收集文本；
 *  3. `turn/end` → 按该机器人的配置分片，优先 Markdown、被拒逐片回退纯文本。
 *
 * 被动回复失败时，按该机器人的配置可选改用主动消息重发（配额极少，默认关闭）。
 *
 * AI 报错：宿主 turn/end 事件 reason.kind === "error"（LlmFailure）时，把报错提示
 * 回复给用户（而非静默）——已有部分文本则附加提示，无文本则只发提示；
 * 同一聊天 60 秒内只提示一次。
 */
import type { BotRuntimeManager } from "../bots.js";
import type { Outbox } from "./outbox.js";
import type { QuotaTracker } from "../infra/quota.js";
export interface ReplyPumpContext {
    /** 多机器人运行时：按来源把回复路由到对应机器人的状态与客户端。 */
    bots: BotRuntimeManager;
    /** 投递出箱：发送失败时把剩余内容入箱重投（可靠性）。 */
    outbox?: Outbox;
    /** 主动消息每日配额（合成事件回复 / 主动兜底消耗）。 */
    quota?: QuotaTracker;
    /**
     * 定时任务被静默（AI 判定本次无需发送）时的回调：
     * 把「跳过原因」写回对应任务条目，设置页可据此解释「为什么这次没发」。
     */
    onScheduleSilent?: (scheduleId: string, reason: string) => void | Promise<void>;
    logger: Pick<Console, "info" | "warn" | "error">;
}
export declare function installReplyPump(ctx: unknown, { bots, outbox, quota, logger, onScheduleSilent }: ReplyPumpContext): () => void;
