/**
 * AI 群规审核服务：把「消息 → 判定 → 禁言 → 日志」串起来，供消息管线与 RPC 共用。
 *
 * 触发前提（全部满足才审）：
 *  1. 该「机器人 + 群」在 moderation.json 里显式开启了 enabled；
 *  2. 发送者不在白名单、不是机器人自己、消息有文本内容；
 *  3. 机器人在该群是管理员（member_role=admin/owner）——禁言接口要求，也避免无权限群白烧模型 token。
 *
 * 管理员状态做 5 分钟内存缓存（按 appId::groupId），避免每条消息都调 bot_state 接口。
 */
import type { BotRuntime } from "../bots.js";
import { ModerationStore, type ModerationConfig } from "./store.js";
import { type ModerateDeps, type ModerationContext } from "./moderate.js";
export declare class ModerationService {
    #private;
    readonly store: ModerationStore;
    constructor(deps: ModerateDeps, logger: Pick<Console, "info" | "warn" | "error">);
    /** 清缓存（设置页改了权限/切群后可调）。 */
    invalidateAdmin(appId: string, groupId: string): void;
    /**
     * 刷屏/骚扰行为检测：模型只看单条消息，识别不出「短时间内连发/重复灌水」，
     * 这里在消息进审核前按滑动窗口做本地判定，命中直接走统一处置链路。
     * 返回 true 表示已处置或处于冷却期（调用方应阻断后续回复）。
     */
    observe(params: {
        bot: BotRuntime;
        groupId: string;
        sender: string;
        senderName: string;
        content: string;
        messageId?: string;
    }): Promise<boolean>;
    /**
     * 审核一条群消息。返回是否「已处置」（调用方可据此决定是否继续正常回复链路）。
     * 任何异常都被吞掉并记日志——审核绝不能阻断正常消息处理。
     */
    review(params: {
        bot: BotRuntime;
        groupId: string;
        sender: string;
        senderName: string;
        content: string;
        /** 违规消息的 msg_id；提供时命中违规会先撤回原消息再处置。 */
        messageId?: string;
        /** 对话语境（前文群聊 + 被引用的原话），帮模型分辨玩笑/互怼/引用与真违规。 */
        context?: ModerationContext;
    }): Promise<{
        actioned: boolean;
        level: string;
        reason: string;
    }>;
    /**
     * 规则自测：用指定配置（或已保存配置）对一段文本做一次纯判定。
     * 只调模型，不 @ 通知、不禁言、不写处罚日志与违规计数——供设置页验证自定义规则写法。
     */
    testMessage(params: {
        appId: string;
        groupId: string;
        content: string;
        config?: ModerationConfig;
    }): Promise<{
        level: string;
        category: string;
        reason: string;
        minutes: number;
        rules: string[];
        rule: string;
    }>;
}
