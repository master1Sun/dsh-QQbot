import type { IncomingMessage } from "node:http";
import type { Duplex } from "node:stream";
/** 广播事件名：机器人列表或连接状态变化（客户端据此重新拉取 bots.list）。 */
export declare const WS_EVENT_BOTS_CHANGED = "bots-changed";
export interface WsHub {
    /** 向所有在线客户端广播一个事件（JSON 文本帧）。 */
    broadcast(event: string, data?: unknown): void;
    /** 接管一个已通过鉴权的 HTTP upgrade 连接，完成握手后开始收发帧。 */
    handleUpgrade(req: IncomingMessage, socket: Duplex, head: Buffer): void;
    /** 当前在线客户端数（诊断用）。 */
    clientCount(): number;
    /** 停止心跳并关闭所有连接（插件卸载时调用）。 */
    dispose(): void;
}
export declare function createWsHub({ logger }: {
    logger: Pick<Console, "warn">;
}): WsHub;
