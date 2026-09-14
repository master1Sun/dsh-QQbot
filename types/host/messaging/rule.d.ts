import type { WebhookRule } from "@deepseek-ai/dsh-webhook";
import type { Agent as LiveAgent } from "@deepseek-ai/dsh-agent";
import type { BotRuntime } from "../bots.js";
import type { ScheduleStore } from "../schedule/schedule.js";
import type { ChatMemoryStore } from "../infra/memory.js";
export interface QqRuleContext {
    /** 按 AppID 取机器人运行时；取不到或事件无归属时返回主机器人。 */
    resolveBot: (appId?: string) => BotRuntime | undefined;
    /** 运行时 Agent 注册表（会话复用与 /stop /steer）。 */
    agents: {
        get(id: string): LiveAgent | undefined;
    };
    schedules: ScheduleStore;
    /** 每聊天长期记忆（memoryEnabled 开启时注入 prompt）。 */
    memory?: ChatMemoryStore;
    /** 主动消息每日配额（/广播 等命令消耗）。 */
    quota?: import("../infra/quota.js").QuotaTracker;
    logger: Pick<Console, "info" | "warn" | "error">;
}
export declare function createQqRule({ resolveBot, agents, schedules, memory, quota, logger, }: QqRuleContext): WebhookRule<"qq">;
