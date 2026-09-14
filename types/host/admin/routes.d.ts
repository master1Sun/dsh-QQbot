/**
 * HTTP 路由（前缀 /qqbot）：仅管理端点。
 *
 * 消息接收走 QQ WebSocket 长连接（src/qq/ws.ts），本机主动拨出，无 HTTP 回调入口。
 *
 *  GET    <prefix>/status   运行状态（委托 admin service）
 *  GET    <prefix>/qr       扫码登录状态快照（二维码 SVG）
 *  POST   <prefix>/qr       发起扫码登录
 *  DELETE <prefix>/qr       取消扫码
 *  POST   <prefix>/send     群/单聊主动消息（需 adminToken，可指定 appId）
 */
import type { WebRoute } from "@deepseek-ai/dsh-host-webserver";
import type { AdminService } from "./admin.js";
export interface RouteContext {
    logger: Pick<Console, "info" | "warn" | "error">;
    admin: AdminService;
}
export declare function makeQqbotRoutes({ logger, admin }: RouteContext): WebRoute;
