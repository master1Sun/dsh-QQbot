/**
 * 原始网关事件处理（SDK rawEvent 透传，覆盖非消息类事件）：
 *
 *  - GROUP_MEMBER_ADD / FRIEND_ADD   → 欢迎语（welcomeEnabled + welcomeMessage，{nick} 占位）；
 *  - MESSAGE_REACTION_ADD            → reactionRecall 开启时，🗑️ 表情回应机器人消息 → 撤回它；
 *  - GROUP_MSG_RECALL / C2C_MSG_RECALL → 仅记归档，不动作。
 *
 * 所有动作走主动消息通道（受每日配额约束），失败只告警不影响主流程。
 */
import type { BotRuntime } from "../bots.js";
export interface RawEventOutcome {
    handled: boolean;
    note?: string;
}
/** 分派一个原始事件；永不抛错。 */
export declare function handleRawEvent(bot: BotRuntime, eventType: string, data: unknown): Promise<RawEventOutcome>;
