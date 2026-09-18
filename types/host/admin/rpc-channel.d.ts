/** 与前端 `RPC_CHANNEL` 保持一致。 */
export declare const RPC_CHANNEL = "/qqbot-settings";
/** 浏览器鉴权栅栏（来自 connection service）：拒绝不受信来源与未认证会话。 */
export interface RpcFence {
    requestRejection(request: {
        readonly headers: Readonly<Record<string, string | readonly string[] | undefined>>;
    }): 401 | 403 | undefined;
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
    /**
     * `<channel>/events` 的 WebSocket 推送端点：通过鉴权栅栏后由调用方接管
     * upgrade 后的 socket。未提供时不注册升级路由（升级请求直接被销毁）。
     */
    onWsUpgrade?: (req: import("node:http").IncomingMessage, socket: import("node:stream").Duplex, head: Buffer) => void;
}
/**
 * 在具备 `webServer` 注入的作用域里注册设置界面 RPC 通道。
 *
 * 用 `ctx.inject(["webServer"], cb)` 而非直接读 `ctx.webServer`：
 * effect 的执行上下文会绑定到「读取到该服务的那个 context」，只有在 inject 命中
 * 的子作用域里 `webServer` 才可解析（框架挂 `/api` 也是同一写法）。
 * 卸载由该 inject 作用域的生命周期负责。
 */
export declare function registerRpcChannel({ ctx, fence, dispatch, onWsUpgrade }: RpcChannelOptions): void;
