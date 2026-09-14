import { createValueFilterState } from "./infra/value-filter.js";
import { Archiver } from "./infra/archive.js";
import { RefIndex } from "./messaging/ref-index.js";
import { SelfOpenidStore } from "./messaging/self-id.js";
import { TypingKeeper } from "./messaging/typing.js";
import { ApprovalManager } from "./messaging/approval.js";
import { QqApiClient } from "./qq/api.js";
import { QqWsSource, type WsStatus } from "./qq/ws.js";
import { type QqbotConfig } from "../shared/config.js";
import { type StoredBot } from "./infra/store-file.js";
import type { BotState, QqEnvelope } from "../shared/types.js";
export interface BotRuntime {
    readonly appId: string;
    /** 当前生效的凭据（secretEnv 解析后覆盖明文）。 */
    appSecret: string;
    /** 是否建立连接并收发消息。 */
    enabled: boolean;
    /** 存储层条目（source / savedAt 等展示信息）。 */
    stored: StoredBot;
    config: QqbotConfig;
    state: BotState;
    valueFilterState: ReturnType<typeof createValueFilterState>;
    client: QqApiClient;
    ws: QqWsSource;
    /** 单聊「正在输入」状态保持器（typingIndicator 开启时随会话处理启停）。 */
    typing: TypingKeeper;
    /** 按钮审批管理器：qqbot_request_approval 工具发按钮消息等点击，INTERACTION_CREATE 回调唤醒。 */
    approvals: ApprovalManager;
    archiver: Archiver;
    /**
     * 引用索引（REFIDX → 原文）：用户引用别人消息时，平台只给索引键不给原文，
     * 靠这份本地索引恢复被引用内容并注入模型上下文。每个机器人一份，独立落盘。
     */
    refIndex: RefIndex;
    /** 宿主解析出的真实 Preset id（空串 = 解析失败，禁止创建会话）。 */
    presets: {
        agentPreset: string;
        permissionPreset: string;
    };
    /** 群 openid → 本机器人在该群视角的 openid（AT 事件学习，供全量 @ 精确判定）。 */
    selfOpenids: Map<string, string>;
    /** 自身 openid 学习结果的持久化存储。 */
    selfStore: SelfOpenidStore;
}
export interface BotRuntimeManagerOptions {
    logger: Pick<Console, "info" | "warn" | "error">;
    /** cordis entry 显式配置（最高优先级，全局覆盖）。 */
    entryConfig: Partial<QqbotConfig>;
    /** HTTP 管理端点令牌（全局项，注入每个 bot 的配置）。 */
    adminToken: () => string;
    /** AppSecret 解析：secretEnv 凭据引用优先，失败回退明文。 */
    resolveSecret: (bot: StoredBot) => Promise<string>;
    /** 把配置里的 Preset 名解析成宿主真实 id；失败时返回空串（禁止建会话）。 */
    resolvePresets: (config: QqbotConfig) => Promise<{
        agentPreset: string;
        permissionPreset: string;
    }>;
    /** 事件出口：由 index.ts 转发进 webhookRuntime。 */
    onEvent: (bot: BotRuntime, eventType: string, payload: QqEnvelope, deliveryId: string) => void;
    /** 原始网关事件出口（成员进出/表情/好友等），由 index.ts 分派给事件处理器。 */
    onRawEvent?: (bot: BotRuntime, eventType: string, data: unknown) => void;
    /** 按钮回调（INTERACTION_CREATE）出口，由 index.ts 分派给审批管理器。 */
    onInteraction?: (bot: BotRuntime, event: unknown) => void;
}
export declare class BotRuntimeManager {
    #private;
    constructor(options: BotRuntimeManagerOptions);
    list(): BotRuntime[];
    get(appId: string | undefined): BotRuntime | undefined;
    /** 主机器人：未指定归属的主动消息 / 定时消息用它发送。 */
    primary(): BotRuntime | undefined;
    primaryAppId(): string;
    statusOf(appId: string): WsStatus;
    /** deliveryId 属于哪个机器人（事件分发前登记）。 */
    botForDelivery(deliveryId: string): BotRuntime | undefined;
    /** 会话属于哪个机器人（会话绑定时登记）。 */
    botForSession(sessionId: string): BotRuntime | undefined;
    /** 遍历所有机器人，找到绑定了该会话的那个（tools 用）。 */
    findBySession(sessionId: string): BotRuntime | undefined;
    registerDelivery(deliveryId: string, appId: string): void;
    releaseDelivery(deliveryId: string): void;
    noteSession(sessionId: string, appId: string): void;
    /**
     * 按存储层重建/更新/停止各机器人连接。
     * 串行执行（#syncing 排队），避免并发保存时两个 sync 交错启停。
     */
    sync(): Promise<void>;
    /** 手动重连指定机器人（设置界面「重试连接」）。 */
    reconnect(appId?: string): Promise<BotRuntime | undefined>;
    /**
     * 复位某机器人的运行统计（设置界面「复位」按钮）：内存清零 + 立即落盘。
     * 不传 appId 复位主机器人。返回被复位的机器人；不存在返回 undefined。
     */
    resetCounters(appId?: string): Promise<BotRuntime | undefined>;
    stopAll(): Promise<void>;
}
