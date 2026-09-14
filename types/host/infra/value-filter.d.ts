/**
 * 群全量消息价值过滤：不是每条消息都值得回复。
 *
 * 启发式评分（0–10），达到阈值才创建会话回复：
 *  加分 — 疑问句、求助/请求词、指向机器人/AI、技术内容、链接/代码痕迹、较长的实质内容；
 *  减分 — 纯表情/单字/纯数字、短噪声、短时间重复消息、同人连续刷屏。
 * 叠加两层冷却：每群最小回复间隔、同一发送者最小回复间隔，防止刷屏。
 *
 * 直接 @机器人（GROUP_AT_MESSAGE_CREATE）与单聊不经过此过滤，始终回复。
 */
import type { GroupBufferEntry, QqMessagePayload } from "../../shared/types.js";
export interface ValueFilterConfig {
    /** 是否启用群全量回复。 */
    enabled: boolean;
    /** 评分达到该值才回复（0–10）。 */
    threshold: number;
    /** 同一群两次「全量模式回复」的最小间隔（毫秒）。 */
    groupCooldownMs: number;
    /** 同一发送者两次被回复的最小间隔（毫秒）。 */
    senderCooldownMs: number;
}
export interface ValueFilterState {
    /** groupOpenid → 上次全量回复时间。 */
    lastGroupReplyAt: Map<string, number>;
    /** `${group}:${sender}` → 上次回复时间。 */
    lastSenderReplyAt: Map<string, number>;
    /** groupOpenid → 内容指纹 → 最近出现时间（重复消息识别）。 */
    recentTexts: Map<string, Map<string, number>>;
    /** `${group}:${sender}` → 最近发送时间序列（刷屏识别）。 */
    senderTimes: Map<string, number[]>;
}
export declare function createValueFilterState(): ValueFilterState;
export interface ValueVerdict {
    reply: boolean;
    score: number;
    reasons: string[];
    blockedBy?: "cooldown-group" | "cooldown-sender" | "duplicate" | "below-threshold";
}
/** 群消息价值评估：返回是否回复与评分依据。 */
export declare function evaluateGroupMessage(payload: QqMessagePayload, filter: ValueFilterConfig, state: ValueFilterState, now?: number): ValueVerdict;
/**
 * 全量模式回复使用的提示词：不做任何指令包装，群里收到什么就原样交给模型——
 * 最近群聊记录（含发言者与时间）+ 触发消息本身，最后一行即最新收到的消息。
 */
export declare function buildGroupFullPrompt(trigger: QqMessagePayload, context: GroupBufferEntry[]): string;
