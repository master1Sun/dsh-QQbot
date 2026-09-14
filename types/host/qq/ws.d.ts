/**
 * QQ WebSocket 接收源（@tencent-connect/qqbot-nodejs 官方 SDK，transport=websocket）。
 *
 * 本机主动拨出 QQ 网关（wss 长连接）接收事件，无需公网 IP / 域名 / 回调配置：
 *   appId+appSecret → access_token → GET /gateway → wss → IDENTIFY(intents)
 *   → 群 AT / 群全量 / 单聊事件 → 复用 webhookRuntime 会话管道。
 *
 * 事件映射：InboundMessage.raw（平台原始事件体）即 webhook 模式信封里的 d，
 * 组回 { eventType, payload: { op:0, id, t, d } } 喂给既有 rule.ts 管道。
 */
import { QQBot } from "@tencent-connect/qqbot-nodejs";
import type { QqbotConfig } from "../../shared/config.js";
import type { QqEnvelope } from "../../shared/types.js";
export type WsState = "idle" | "connecting" | "connected" | "failed";
export interface WsStatus {
    state: WsState;
    appId: string;
    lastConnectedAt: number | null;
    lastError: string | null;
    /** 本次连接以来收到的事件数（rule.ts 的 received 计数器之外的总闸）。 */
    events: number;
}
export interface QqWsSourceOptions {
    logger: Pick<Console, "info" | "warn" | "error">;
    /** 组装好的事件 → index.ts 转发进 webhookRuntime.dispatch。 */
    onEvent: (eventType: string, payload: QqEnvelope, deliveryId: string) => void;
    /** 原始网关事件（成员进出、表情、好友等 SDK 未单独封装的事件）出口。 */
    onRawEvent?: (eventType: string, data: unknown) => void;
    /** 按钮回调（INTERACTION_CREATE，SDK 单独封装为 interaction 事件）出口。 */
    onInteraction?: (event: unknown) => void;
}
export declare class QqWsSource {
    #private;
    constructor(options: QqWsSourceOptions);
    get status(): WsStatus;
    /** 底层 SDK 实例（已连接后可用），供媒体上传 / 撤回 / 原生 API 调用。 */
    get sdk(): QQBot | null;
    /** 按当前配置启动连接；已连接时先停再起（凭据热更新路径）。 */
    start(config: QqbotConfig): Promise<void>;
    /** 等待当前 start() 完成（不抛错，错误已在状态里）。 */
    settle(): Promise<void>;
    stop(): Promise<void>;
}
