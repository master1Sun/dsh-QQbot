/**
 * SSE 推送中枢：向设置界面长连接推送「机器人列表 / 连接状态已变化」事件。
 *
 * 背景：客户端此前用 15s 轮询 bots.list 检测登录状态变化；本模块提供宿主侧
 * `GET /qqbot-settings/events` 的 SSE 端点（text/event-stream），宿主在
 * 机器人增删 / 启停 / 连接状态迁移时 broadcast，客户端即时收到通知。
 *
 * - 复用 RPC 通道同一前缀与鉴权栅栏（fence 在 rpc-channel 的 handler 里先行执行）；
 * - 客户端断开（req close）自动清理；写失败（客户端已消失）自动摘除该连接；
 * - 25s 心跳注释行保活，避免中间层空闲超时掐断连接；
 * - 客户端侧由 EventSource 自带重连（retry: 3000），宿主无需维护会话状态。
 */
import type { IncomingMessage, ServerResponse } from "node:http";

/** SSE 事件名：机器人列表或连接状态变化（客户端据此重新拉取 bots.list）。 */
export const SSE_EVENT_BOTS_CHANGED = "bots-changed";

/** 心跳间隔（毫秒）：仅写注释行，不触发客户端事件。 */
const HEARTBEAT_INTERVAL_MS = 25_000;

export interface SseHub {
  /** 向所有在线客户端广播一个事件。 */
  broadcast(event: string, data?: unknown): void;
  /** 接入一个已通过鉴权的 SSE 连接（接管 res，直到客户端断开）。 */
  open(req: IncomingMessage, res: ServerResponse): void;
  /** 当前在线客户端数（诊断用）。 */
  clientCount(): number;
  /** 停止心跳并关闭所有连接（插件卸载时调用）。 */
  dispose(): void;
}

export function createSseHub({ logger }: { logger: Pick<Console, "warn"> }): SseHub {
  const clients = new Set<ServerResponse>();
  const timer = setInterval(() => {
    for (const res of clients) {
      try {
        res.write(`: ping ${Date.now()}\n\n`);
      } catch {
        // 写失败：客户端已消失，close 事件会完成清理
      }
    }
  }, HEARTBEAT_INTERVAL_MS);
  timer.unref?.();

  return {
    open(req, res) {
      res.writeHead(200, {
        "content-type": "text/event-stream; charset=utf-8",
        "cache-control": "no-cache, no-transform",
        connection: "keep-alive",
        "x-accel-buffering": "no",
      });
      // 连接建立后立即告知重连间隔，并推一帧注释行完成握手（部分代理需要首字节才认为连接成功）。
      res.write("retry: 3000\n\n");
      res.write(`: connected ${Date.now()}\n\n`);
      clients.add(res);
      req.on("close", () => {
        clients.delete(res);
      });
      req.on("error", () => {
        clients.delete(res);
      });
    },

    broadcast(event, data) {
      if (clients.size === 0) return;
      const frame = `event: ${event}\ndata: ${JSON.stringify(data ?? { at: Date.now() })}\n\n`;
      for (const res of [...clients]) {
        try {
          res.write(frame, (error) => {
            if (error) clients.delete(res);
          });
        } catch (error) {
          clients.delete(res);
          logger.warn("[dsh-qqbot] SSE 推送失败，已摘除该客户端:", error);
        }
      }
    },

    clientCount() {
      return clients.size;
    },

    dispose() {
      clearInterval(timer);
      for (const res of [...clients]) {
        try {
          res.end();
        } catch { /* 客户端已断开 */ }
      }
      clients.clear();
    },
  };
}
