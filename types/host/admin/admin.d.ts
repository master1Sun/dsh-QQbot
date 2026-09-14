import type { ModelOption } from "./catalogs.js";
import type { QrLoginManager } from "../qq/qr-login.js";
import type { ScheduleStore, Scheduler } from "../schedule/schedule.js";
import type { ScriptGenerator } from "../schedule/script-gen.js";
import type { BotRuntimeManager } from "../bots.js";
import { type GlobalConfig } from "../infra/store-file.js";
import type { QqbotConfig } from "../../shared/config.js";
export interface AdminServiceContext {
    /** 多机器人运行时：所有按 appId 的查询 / 操作入口。 */
    bots: BotRuntimeManager;
    /** 全局配置（仅 adminToken；其余配置一律按机器人独立保存）。 */
    gconf: GlobalConfig;
    schedules: ScheduleStore;
    /** 调度器：设置页「测试」按钮执行一次（schedule.runOnce）。 */
    scheduler?: Scheduler;
    /** AI 脚本生成器：保存含 genPrompt 的任务后入队生成。 */
    scriptGen?: ScriptGenerator;
    qr: QrLoginManager;
    logger: Pick<Console, "info" | "warn" | "error">;
    /** webhook 运行时是否可用（不可用时 QQ 消息不会创建会话）。 */
    runtimeReady: () => boolean;
    /** cordis entry 显式配置（热更新时保持其优先级）。 */
    entryConfig: Partial<QqbotConfig>;
    /** 已配置的模型目录（读自宿主 settings.yaml）。 */
    listModels?: () => Promise<ModelOption[]>;
    /** 宿主 Agent Preset 目录（ctx.agentPresets 服务：list() + defaultId）。 */
    listAgentPresets?: () => Promise<{
        defaultId: string;
        items: Array<{
            id: string;
            label: string;
        }>;
    }>;
}
export declare function createAdminService(ctx: AdminServiceContext): {
    status: () => {
        ok: boolean;
        data: {
            sessionEnabled: boolean;
            runtimeReady: boolean;
            primaryAppId: string;
            bots: {
                appId: string;
                appIdMasked: string;
                source: "qr" | "manual";
                savedAt: string;
                enabled: boolean;
                primary: boolean;
                ws: {
                    state: import("../qq/ws.js").WsState;
                    lastConnectedAt: number | null;
                    lastError: string | null;
                };
                counters: {
                    received: number;
                    sessions: number;
                    replies: number;
                    proactive: number;
                    errors: number;
                };
                pendingReplies: number;
                boundSessions: number;
                groupBuffers: {
                    openid: string;
                    buffered: number;
                }[];
                /** 该机器人独立的行为配置（设置界面编辑对象）。 */
                config: {
                    [key: string]: unknown;
                    workspacePath?: string;
                    agentPreset?: string;
                    agentPresetChat?: string;
                    permissionPreset?: string;
                    model?: {
                        provider: string;
                        model: string;
                    } | string;
                    secretEnv?: string;
                    allowC2c?: boolean;
                    allowGroups?: string[];
                    allowUsers?: string[];
                    atContextMessages?: number;
                    groupBufferMax?: number;
                    replyChunkChars?: number;
                    maxRepliesPerMessage?: number;
                    proactiveFallback?: boolean;
                    archiveEnabled?: boolean;
                    markdownReply?: boolean;
                    quoteReply?: "off" | "at" | "all";
                    quoteMaxChars?: number;
                    respondToBots?: boolean;
                    groupFullReply?: boolean;
                    valueThreshold?: number;
                    groupCooldownMs?: number;
                    senderCooldownMs?: number;
                    apiBase?: string;
                    tokenUrl?: string;
                    multimodalInbound?: boolean;
                    voiceTranscription?: "off" | "note" | "download" | "asr" | "stt";
                    asrEndpoint?: string;
                    sttBaseUrl?: string;
                    sttApiKey?: string;
                    sttModel?: string;
                    ttsReply?: boolean;
                    ttsBaseUrl?: string;
                    ttsApiKey?: string;
                    ttsModel?: string;
                    ttsVoice?: string;
                    typingIndicator?: boolean;
                    approvalButtons?: boolean;
                    fileIngestion?: boolean;
                    welcomeEnabled?: boolean;
                    welcomeMessage?: string;
                    reactionRecall?: boolean;
                    bannedWords?: string[];
                    memoryEnabled?: boolean;
                    quotaPerDay?: number;
                    replyLocale?: "zh" | "en";
                    sanitizeReplies?: boolean;
                    ssrfGuard?: boolean;
                    localPathWhitelist?: boolean;
                    permissionInjection?: boolean;
                    permissionAdmins?: string[];
                    groupOverrides?: Record<string, unknown>;
                };
            }[];
        };
    };
    configGet: (appId?: string) => Promise<{
        ok: boolean;
        data: {
            appId: string;
            config: Record<string, unknown>;
        };
    }>;
    configSave: (payload: Record<string, unknown>) => Promise<{
        ok: boolean;
        error: string;
        data?: undefined;
    } | {
        ok: boolean;
        data: {
            saved: boolean;
            appId: string;
            groupOverrides: Record<string, unknown>;
        };
        error?: undefined;
    }>;
    credentialsSave: (payload: {
        appId?: unknown;
        appSecret?: unknown;
    }) => Promise<{
        ok: boolean;
        error: string;
        data?: undefined;
    } | {
        ok: boolean;
        data: {
            appId: string;
        };
        error?: undefined;
    }>;
    qrStart: () => Promise<{
        ok: boolean;
        data: import("../qq/qr-login.js").QrLoginSnapshot;
    }>;
    qrState: () => {
        ok: boolean;
        data: import("../qq/qr-login.js").QrLoginSnapshot;
    };
    qrCancel: () => {
        ok: boolean;
        data: import("../qq/qr-login.js").QrLoginSnapshot;
    };
    sendProactive: (payload: {
        appId?: unknown;
        scope?: unknown;
        openid?: unknown;
        content?: unknown;
    }) => Promise<{
        ok: boolean;
        error: string;
        data?: undefined;
    } | {
        ok: boolean;
        data: {
            sent: boolean;
            appId: string;
        };
        error?: undefined;
    }>;
    handle: (endpoint: string, payload?: Record<string, unknown>) => Promise<unknown>;
    /** 当前 adminToken（HTTP /send 鉴权用）。 */
    adminToken: () => string;
    /** 当前管理路由前缀（/status /qr /send）。 */
    callbackPath: () => string;
};
export type AdminService = ReturnType<typeof createAdminService>;
