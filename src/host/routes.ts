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

const MAX_BODY_BYTES = 256 * 1024;

export interface RouteContext {
  logger: Pick<Console, "info" | "warn" | "error">;
  admin: AdminService;
}

/** 读取一段有上界的请求体。 */
async function readBody(req: import("node:http").IncomingMessage): Promise<Buffer> {
  const declared = Number(req.headers["content-length"]);
  if (Number.isSafeInteger(declared) && declared > MAX_BODY_BYTES) {
    req.resume();
    throw new Error("body too large");
  }
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string);
    size += buf.length;
    if (size > MAX_BODY_BYTES) throw new Error("body too large");
    chunks.push(buf);
  }
  return Buffer.concat(chunks, size);
}

function json(res: import("node:http").ServerResponse, status: number, body: unknown): void {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(payload);
}

export function makeQqbotRoutes({ logger, admin }: RouteContext): WebRoute {
  const handler = async (req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse) => {
    const method = (req.method ?? "GET").toUpperCase();
    const pathname = (req.url ?? "").split("?", 1)[0] ?? "";
    const prefix = admin.callbackPath();
    const tail = pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname;
    const segments = tail.split("/").filter(Boolean);

    try {
      // 管理端点（委托 admin service）。
      if (method === "GET" && segments[0] === "status" && segments.length === 1) {
        return json(res, 200, admin.status());
      }
      if (segments[0] === "qr" && segments.length === 1) {
        if (method === "POST") return json(res, 200, await admin.qrStart());
        if (method === "GET") return json(res, 200, admin.qrState());
        if (method === "DELETE") return json(res, 200, admin.qrCancel());
      }
      if (method === "POST" && segments[0] === "send" && segments.length === 1) {
        const adminToken = admin.adminToken();
        if (!adminToken) return json(res, 403, { ok: false, error: "adminToken 未配置，主动消息端点已禁用" });
        if (String(req.headers["x-qqbot-admin"] ?? "") !== adminToken) {
          return json(res, 401, { ok: false, error: "invalid admin token" });
        }
        const body = await readBody(req);
        let payload: Record<string, unknown>;
        try {
          payload = JSON.parse(body.toString("utf8")) as Record<string, unknown>;
        } catch {
          return json(res, 400, { ok: false, error: "invalid json" });
        }
        return json(res, 200, await admin.sendProactive(payload));
      }

      return json(res, 404, { ok: false, error: `no route ${method} ${tail}` });
    } catch (error) {
      const message = error instanceof Error ? error.message : "internal error";
      const status = message === "body too large" ? 413 : 500;
      if (status >= 500) logger.error("[dsh-qqbot] 路由处理失败:", error);
      return json(res, status, { ok: false, error: message });
    }
  };

  return {
    kind: "prefix" as const,
    get path() {
      return admin.callbackPath();
    },
    handler,
  };
}
