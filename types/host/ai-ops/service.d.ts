import type { ScriptGenLlm } from "../schedule/script-gen.js";
import type { BotRuntimeManager } from "../bots.js";
import type { ModerationService } from "../moderation/service.js";
import type { JoinApprovalService } from "../join-approval/service.js";
import type { GuildModerationService } from "../guild-moderation/service.js";
import type { GuildReplyService } from "../guild-reply/service.js";
import { type AiAction, type AiChatRequest, type AiResolveContext } from "./catalog.js";
import { type AiOpsLogEntry, type AiOpsScope } from "./store.js";
export type { AiOpsLogEntry, AiOpsScope } from "./store.js";
export { aiOpsLogPath } from "./store.js";
export interface AiOpsDeps {
    getLlm: () => ScriptGenLlm | undefined;
    resolveModel: (appId?: string) => {
        provider: string;
        model: string;
    } | undefined;
    /** 延迟取机器人管理器（装配顺序上它在本服务之后创建）。 */
    getBots: () => BotRuntimeManager;
    moderation?: ModerationService;
    joinApproval?: JoinApprovalService;
    guildModeration?: GuildModerationService;
    guildReply?: GuildReplyService;
    logger: Pick<Console, "info" | "warn" | "error">;
}
export interface AiOpsResult {
    ok: boolean;
    action?: AiAction;
    source: "local" | "llm" | "cache" | "none";
    /** 面向用户的短回复（本地模板生成，零 token）。 */
    reply: string;
    data?: unknown;
    error?: string;
    /** 本次是否调用了 LLM（前端据此显示用量提示）。 */
    usedLlm: boolean;
}
export interface AiOpsStats {
    /** 本地解析命中次数（零 token）。 */
    local: number;
    /** 缓存命中次数（零 token）。 */
    cache: number;
    /** LLM 路由调用次数（有 token）。 */
    llm: number;
    /** 解析失败次数。 */
    failed: number;
    /** 估算累计节省的 prompt token（按每次 LLM 调用约 320 token 估算）。 */
    savedTokens: number;
}
export interface AiOpsLogFilter {
    appId?: string;
    scope?: AiOpsScope;
    groupOpenid?: string;
    guildId?: string;
    limit?: number;
}
export declare class AiOpsService {
    #private;
    constructor(deps: AiOpsDeps);
    /** 等待两份场景日志从磁盘加载完成（构造时已启动，RPC / 记录前再 await 一次即可）。 */
    ready(): Promise<void>;
    /** 不传 scope 时返回两场景合计（兼容旧调用点）。 */
    stats(scope?: AiOpsScope): AiOpsStats;
    /** 执行记录：只取指定场景的文件；默认最新在前，按机器人 / 群 / 频道过滤。 */
    logs(filter?: AiOpsLogFilter): AiOpsLogEntry[];
    /** 智能建议：纯本地、零 token、零 RPC。 */
    suggest(ctx: AiResolveContext): string[];
    /** 能力清单（本地模板，help 动作与兜底都用它）。 */
    private helpText;
    chat(req: AiChatRequest): Promise<AiOpsResult>;
}
