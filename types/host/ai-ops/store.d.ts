export type AiOpsScope = "group" | "guild";
/** 一条 AI 操作记录。 */
export interface AiOpsLogEntry {
    id: number;
    at: string;
    appId: string;
    scope: AiOpsScope;
    groupOpenid?: string;
    guildId?: string;
    channelId?: string;
    /** 用户在聊天里说的原话。 */
    text: string;
    action?: string;
    actionLabel?: string;
    ok: boolean;
    source: "local" | "llm" | "cache" | "none";
    reply: string;
    error?: string;
    usedLlm: boolean;
}
/** 场景专属记录文件路径（两侧必须一致，避免运行时与排查时找错文件）。 */
export declare function aiOpsLogPath(scope: AiOpsScope): string;
/** 读取某场景的记录；文件缺失 / 损坏一律视为空，不影响机器人启动。 */
export declare function loadAiOpsLogs(scope: AiOpsScope): Promise<AiOpsLogEntry[]>;
/** 原子写入某场景的记录（调用方保证串行，避免并发写覆盖）。 */
export declare function saveAiOpsLogs(scope: AiOpsScope, logs: AiOpsLogEntry[]): Promise<void>;
