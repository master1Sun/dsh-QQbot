/**
 * 群全量消息价值过滤：不是每条消息都值得回复。
 *
 * 评分（0–10）采用「意图分（互斥取最强）+ 内容分（累加封顶）+ 噪声惩罚」的分层结构，
 * 而不是把所有命中关键词无脑相加：后者会让一句普通技术闲聊轻易顶到 10 分，
 * 阈值 5 形同虚设。分层后 10 分只留给「明确点名机器人求助 + 内容充实」的消息。
 *
 * 另外叠加两层冷却（每群 / 每发送者）与两层刷屏拦截（重复内容 / 同人连发）。
 * 阈值设为 0 时这一切全部跳过（不评分也不限频），见 evaluateGroupMessage 开头的早退。
 * 所有状态带 TTL 与容量淘汰，长时间运行不会随群/用户数量无限增长。
 *
 * 直接 @机器人（GROUP_AT_MESSAGE_CREATE）与单聊不经过此过滤，始终回复；
 * 因此这里不再用「内容里出现 AI/机器人 等词」来猜测用户是否在找机器人——
 * 那种近似会让普通闲聊绕过全部冷却，且与界面说明不符。
 */
import type { GroupBufferEntry, QqMessagePayload } from "../../shared/types.js";
export interface ValueFilterConfig {
    /** 是否启用群全量回复（rule.ts 已提前判定，这里保留供将来扩展）。 */
    enabled: boolean;
    /** 评分达到该值才回复（0–10）。0 = 完全不设限：不评分、不冷却、不拦重复/刷屏。 */
    threshold: number;
    /** 同一群两次「全量模式回复」的最小间隔（毫秒）。 */
    groupCooldownMs: number;
    /** 同一发送者两次被回复的最小间隔（毫秒）。 */
    senderCooldownMs: number;
}
export interface RecentText {
    /** 最近一次出现时间。 */
    at: number;
    /** 时间窗内累计出现次数（含本次）。 */
    hits: number;
}
export interface ValueFilterState {
    /** groupOpenid → 上次全量回复时间。 */
    lastGroupReplyAt: Map<string, number>;
    /** `${group}:${sender}` → 上次回复时间。 */
    lastSenderReplyAt: Map<string, number>;
    /** groupOpenid → 归一化内容指纹 → 最近出现信息（重复消息识别）。 */
    recentTexts: Map<string, Map<string, RecentText>>;
    /** `${group}:${sender}` → 60 秒窗口内的发送时刻（同人连发识别）。 */
    senderTimes: Map<string, number[]>;
    /** 上次状态清扫时间（节流，避免每条消息都全表扫描）。 */
    lastSweepAt: number;
}
export declare function createValueFilterState(): ValueFilterState;
export interface ValueVerdict {
    reply: boolean;
    score: number;
    reasons: string[];
    blockedBy?: "cooldown-group" | "cooldown-sender" | "duplicate" | "flood" | "below-threshold";
}
/** 群消息价值评估：返回是否回复与评分依据。 */
export declare function evaluateGroupMessage(payload: QqMessagePayload, filter: ValueFilterConfig, state: ValueFilterState, now?: number): ValueVerdict;
/**
 * 全量模式回复使用的提示词：不做任何指令包装，群里收到什么就原样交给模型——
 * 最近群聊记录（含发言者与时间）+ 触发消息本身，最后一行即最新收到的消息。
 *
 * 触发消息在构造前已入群缓冲，因此这里必须识别并复用缓冲的最后一条，
 * 不能无条件再追加一遍（旧实现用「带 - [HH:mm] 前缀的行」与「裸的 name: content」
 * 做全等比较，永远不相等，导致触发消息被重复注入两次）。
 */
export declare function buildGroupFullPrompt(trigger: QqMessagePayload, context: GroupBufferEntry[]): string;
