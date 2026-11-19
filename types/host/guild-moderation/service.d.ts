/**
 * 频道 AI 接管服务：频道消息 → AI 判定 → 按配置执行动作（禁言/撤回/警告）→ 日志。
 *
 * 触发前提（全部满足才审）：
 *  1. 该「机器人 + 频道」在 guild-moderation.json 里显式开启 enabled；
 *  2. 发送者不在白名单、不是机器人自己、有文本内容；
 *  3. 配置 channelIds 为空或命中当前子频道；
 *  4. 消息来自 rawEvent 的 AT_MESSAGE_CREATE / MESSAGE_CREATE（频道消息不进会话管线）。
 *
 * 所有动作失败都被吞掉并记进日志，绝不影响消息链路其它部分。
 */
import type { BotRuntime } from "../bots.js";
import { GuildModStore } from "./store.js";
import { type GuildModerateDeps } from "./engine.js";
export declare class GuildModerationService {
    #private;
    readonly store: GuildModStore;
    static readonly SEEN_TTL = 10000;
    constructor(deps: GuildModerateDeps, logger: Pick<Console, "info" | "warn" | "error">);
    /**
     * 审核一条频道消息。返回是否命中违规（actioned = 至少执行了一个动作或判定为违规）。
     * 频道消息不进会话管线，这里返回仅用于日志展示。
     */
    review(params: {
        bot: BotRuntime;
        guildId: string;
        channelId: string;
        messageId: string;
        sender: string;
        senderName: string;
        content: string;
    }): Promise<{
        actioned: boolean;
        level: string;
        reason: string;
    }>;
}
