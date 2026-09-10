/**
 * 设置界面 RPC 通道（前缀 /qqbot-settings）。
 *
 * 背景：dsh 设置页「QQ 机器人」前端通过 `ctx.connection.rpc.call("/qqbot-settings", endpoint, payload)` 调用本插件。
 * 理论上应当用 `ctx.connection.rpc.handle("/qqbot-settings", handler)` 注册，但当前 dsh 版本里
 * `HostConnectionService.register()` 用的是 `owner = this.ctx`，而该 service 是在
 * `dsh-client-connection` 插件自己的 fiber context 上构造的（其 inject 只有 `["credentials"]`），
 * 因此 `owner.webServer` 解析会抛 `cannot get property "webServer" without inject`，
 * 自定义通道永远注册不上，请求穿透到静态兜底返回 HTTP 405。
 *
 * 框架自己挂 `/api` 时走的是
 * `ctx.inject(["webServer"], (webCtx) => webCtx.effect(() => webCtx.webServer.register(route)))`，
 * 本文件按同样方式自行注册 prefix 路由，并复刻 `rpcFetchHandler` 的报文校验与
 * `/api` 那层的浏览器鉴权栅栏（Host/Origin 检查 + 会话认证），保证行为等价。
 */
import type { WebRoute } from "@deepseek-ai/dsh-host-webserver";

/** 与前端 `RPC_CHANNEL` 保持一致。 */
export const RPC_CHANNEL = "/qqbot-settings";

/** 端点段：字母数字与 `_$.-`，对应 dsh 的 ENDPOINT_SEGMENT_PATTERN。 */
const ENDPOINT_SEGMENT_PATTERN = /^[A-Za-z0-9_$.-]+$/;

/** 请求体上限。 */
const MAX_RPC_BODY_BYTES = 1024 * 1024;

/** 客户端请求信封（对应 dsh 的 clientRequestSchema）。 */
interface ClientRequestEnvelope {
  type: "client-request";
  rpcId: string;
  method: string;
  payload?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readEnvelope(body: unknown): ClientRequestEnvelope | undefined {
  if (!isRecord(body)) return undefined;
  if (body.type !== "client-request") return undefined;
  if (typeof body.rpcId !== "string" || body.rpcId === "") return undefined;
  if (typeof body.method !== "string" || body.method === "") return undefined;
  return { type: "client-request", rpcId: body.rpcId, method: body.method, payload: body.payload };
}

/** `/qqbot-settings/<endpoint>` → `<endpoint>`；不合法返回 undefined。 */
function endpointFromPath(channel: string, pathname: string): string | undefined {
  if (!pathname.startsWith(`${channel}/`)) return undefined;
  const endpoint = pathname.slice(channel.length + 1);
  const segments = endpoint.split("/");
  if (segments.some((segment) => segment === "" || segment === "." || segment === ".." || !ENDPOINT_SEGMENT_PATTERN.test(segment))) {
    return undefined;
  }
  return endpoint;
}

function serverResponse(rpcId: string, result: unknown): Response {
  return Response.json({ type: "server-response", rpcId, result });
}

function failure(rpcId: string, code: string, message: string): Response {
  return serverResponse(rpcId, { ok: false, error: { code, message, details: {} } });
}

/** 浏览器鉴权栅栏（来自 connection service）：拒绝不受信来源与未认证会话。 */
export interface RpcFence {
  requestRejection(request: { readonly headers: Readonly<Record<string, string | readonly string[] | undefined>> }): 401 | 403 | undefined;
}

export interface RpcChannelOptions {
  /** 插件的 context：必须已 inject `webServer`（本文件会用它开 inject 子作用域）。 */
  ctx: {
    inject(names: readonly string[], callback: (subCtx: unknown) => unknown): unknown;
  };
  /** 鉴权栅栏；拿不到时退化为不校验。 */
  fence?: RpcFence;
  /** RPC 分发：endpoint → 结果。 */
  dispatch(endpoint: string, payload: Record<string, unknown>): Promise<unknown>;
}

/** 读取完整请求体。 */
async function readRawBody(req: import("node:http").IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string);
    size += buf.length;
    if (size > MAX_RPC_BODY_BYTES) throw new Error("rpc body too large");
    chunks.push(buf);
  }
  return Buffer.concat(chunks, size);
}

/**
 * 在具备 `webServer` 注入的作用域里注册设置界面 RPC 通道。
 *
 * 用 `ctx.inject(["webServer"], cb)` 而非直接读 `ctx.webServer`：
 * effect 的执行上下文会绑定到「读取到该服务的那个 context」，只有在 inject 命中
 * 的子作用域里 `webServer` 才可解析（框架挂 `/api` 也是同一写法）。
 * 卸载由该 inject 作用域的生命周期负责。
 */
export function registerRpcChannel({ ctx, fence, dispatch }: RpcChannelOptions): void {
  ctx.inject(["webServer"], (webCtxUnknown) => {
    const webCtx = webCtxUnknown as {
      webServer: { register(route: WebRoute): () => void };
      effect(callback: () => unknown, label?: string): unknown;
    };
    const route: WebRoute = {
      kind: "prefix",
      path: RPC_CHANNEL,
      handler: async (req, res) => {
        // 鉴权栅栏在分发之前执行，行为与 dsh `/api` 一致。
        if (fence) {
          try {
            const rejection = fence.requestRejection({ headers: req.headers as Readonly<Record<string, string | string[] | undefined>> });
            if (rejection !== undefined) {
              res.writeHead(rejection);
              res.end(rejection === 401 ? "unauthorized" : "forbidden");
              return;
            }
          } catch {
            // 栅栏自身异常不应阻断本插件通道。
          }
        }

        const endpoint = endpointFromPath(RPC_CHANNEL, new URL(req.url ?? "/", "http://localhost").pathname);
        if ((req.method ?? "GET").toUpperCase() !== "POST" || endpoint === undefined) {
          res.writeHead(404);
          res.end("not found");
          return;
        }
        const contentType = String(req.headers["content-type"] ?? "").split(";", 1)[0]?.trim().toLowerCase();
        if (contentType !== "application/json") {
          res.writeHead(415);
          res.end("content type must be application/json");
          return;
        }

        let body: unknown;
        try {
          body = JSON.parse((await readRawBody(req)).toString("utf8"));
        } catch {
          res.writeHead(400);
          res.end("body is not JSON");
          return;
        }

        const envelope = readEnvelope(body);
        if (!envelope) {
          res.writeHead(400);
          res.end("invalid client-request message");
          return;
        }
        if (envelope.method !== endpoint) {
          await writeJson(res, failure(envelope.rpcId, "gateway/bad-request", `method ${JSON.stringify(envelope.method)} does not match endpoint ${JSON.stringify(endpoint)}`));
          return;
        }

        try {
          const result = await dispatch(endpoint, isRecord(envelope.payload) ? envelope.payload : {});
          await writeJson(res, serverResponse(envelope.rpcId, result));
        } catch (error) {
          res.writeHead(500);
          res.end(`handler failure: ${String(error)}`);
        }
      },
    };

    webCtx.effect(() => webCtx.webServer.register(route), `dsh-qqbot: ${RPC_CHANNEL} rpc channel`);
  });
}

async function writeJson(res: import("node:http").ServerResponse, response: Response): Promise<void> {
  const buffer = Buffer.from(await response.arrayBuffer());
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });
  res.writeHead(response.status, headers);
  res.end(buffer);
}
