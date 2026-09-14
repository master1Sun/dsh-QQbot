import type { Agent } from "@deepseek-ai/dsh-agent";
import type { QqApiClient } from "../qq/api.js";
import type { QqbotConfig } from "../../shared/config.js";
import { type ScheduleStore } from "../schedule/schedule.js";
import type { ChatMemoryStore } from "../infra/memory.js";
import type { QuotaTracker } from "../infra/quota.js";
import type { BotState, ReplyTarget } from "../../shared/types.js";
export interface CommandContext {
    getConfig: () => QqbotConfig;
    state: BotState;
    client: QqApiClient;
    agents: {
        get(id: string): Agent | undefined;
    };
    schedules: ScheduleStore;
    /** 每聊天长期记忆（/记忆 /清空记忆）。 */
    memory?: ChatMemoryStore;
    /** 主动消息每日配额（/广播 消耗）。 */
    quota?: QuotaTracker;
    logger: Pick<Console, "info" | "warn" | "error">;
    /** 来源机器人 AppID：定时消息按机器人归属，由它自己发送。 */
    appId: string;
}
/**
 * 解析 /定时 的「一次性」时间：支持以下写法（一律按上海时间 UTC+8 解释），
 * 并返回去掉时间部分后剩余的正文：
 *   - `2026-09-20 15:00` / `2026-09-20T15:00`（显式日期）
 *   - `09-20 15:00`（今年）
 *   - `9月20日 15:00` / `9月20号下午3点`
 *   - `15:00`（今天；若已过则顺延到明天）
 * 无有效时间或时间已过（显式日期情形）返回 null。
 */
export declare function parseAtTime(input: string, now: Date): {
    at: string;
    content: string;
} | null;
export declare const HELP_TEXT: string;
export interface CommandOutcome {
    handled: boolean;
    reply?: string;
}
/** 解析并执行命令；非命令返回 { handled: false }。 */
export declare function runCommand(text: string, { scope, openid, sender, msgId }: {
    scope: ReplyTarget["scope"];
    openid: string;
    sender: string;
    msgId: string;
}, ctx: CommandContext): Promise<CommandOutcome>;
