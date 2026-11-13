/**
 * 本地开发用的最小类型垫片（ambient，**不含 import/export**）。
 *
 * `@deepseek-ai/dsh-*` 在本仓库是可选 peer 依赖，由宿主 dsh 在运行时提供，
 * 本地 node_modules 里没有它们的类型声明。此前 `npm run typecheck` 会长期报
 * 二十多条 TS2307/TS7006，真正的错误被噪声淹没（本次排查就差点漏掉
 * `removeChat` 死参数与 `webhookRuleId` 只写不读两处）。
 *
 * 这里只补「本插件实际用到的导出」，形状按调用点的最低需要声明；真实契约
 * 仍以宿主版本为准（运行时由宿主保证，构建产物不含此文件）。
 *
 * 注意：本文件必须是全局脚本（没有 import/export），否则会被当成模块增强，
 * 反而报「模块不存在」。新增宿主 API 时在这里补一行即可。
 */

declare module "@deepseek-ai/dsh-host-webserver" {
  /** 一条 HTTP 路由（宿主 webServer 注册用）。 */
  export interface WebRoute {
    path: string;
    handler?: (...args: any[]) => unknown;
    [key: string]: any;
  }
  /** 一条 HTTP upgrade 路由（WebSocket 握手用）。 */
  export interface WebUpgradeRoute {
    path: string;
    handler?: (...args: any[]) => unknown;
    [key: string]: any;
  }
}

declare module "@deepseek-ai/dsh-agent" {
  /** Agent 实例（只用到标识字段，其余交给宿主）。 */
  export interface Agent {
    readonly id?: string;
    readonly sessionId?: string;
    [key: string]: any;
  }
}

declare module "@deepseek-ai/dsh-llm" {
  /** 消息 id（宿主内部标识，插件只透传）。 */
  export type MessageId = string;
  /** 消息内容块（text / image 等，按 type 区分）。 */
  export interface ContentBlock {
    type: string;
    [key: string]: any;
  }
  /** 构造一条 user 消息。 */
  export function createUserMessage(input: any): any;
}

declare module "@deepseek-ai/dsh-util-values" {
  /** JSON 值（工具参数/返回值）。 */
  export type JsonValue = any;
}

declare module "@deepseek-ai/dsh-tools" {
  export type JsonSchemaNode = any;
  export interface ToolDefinition {
    [key: string]: any;
  }
  export interface ToolOutputDefinition {
    [key: string]: any;
  }
  export interface ToolRunContext {
    [key: string]: any;
  }
}

declare module "@deepseek-ai/dsh-credentials" {
  /** 把环境变量名转成凭据引用（宿主 credentials 服务可解析）。 */
  export function credentialRef(name: string): string;
}

declare module "@deepseek-ai/dsh-webhook" {
  /** 投递给规则的一次事件（event 为宿主解析后的载荷）。 */
  export interface WebhookDelivery<TKind = any> {
    event: any;
    [key: string]: any;
  }
  /**
   * 一条 webhook 规则；泛型参数是规则种类（本插件用 "qq"）。
   * 这里只声明插件实现时用到的字段，其余交给宿主。
   */
  export interface WebhookRule<TKind = any> {
    id?: string;
    kind?: TKind;
    run?(delivery: WebhookDelivery<TKind>, ...rest: any[]): unknown;
    [key: string]: any;
  }
  export interface WebhookSessionRequest {
    [key: string]: any;
  }
  /** 事件名 -> 载荷 的映射表，由各插件通过模块增强补充。 */
  export interface WebhookEventMap {
    [key: string]: any;
  }
}
