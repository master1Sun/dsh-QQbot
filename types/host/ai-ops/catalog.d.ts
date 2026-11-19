/**
 * AI 操作助手：动作码表 + 零 token 的本地意图解析。
 *
 * 设计目标（用户硬要求）：「尽量控制减少 AI 接口调用请求和用量，用最少的 token 解决最大的智能化需求」。
 * 因此绝大多数指令在本地用正则解析完成，**完全不调用 LLM**；只有本地无法理解的指令
 * 才走一次极小的 LLM 路由调用（见 service.ts）。所有面向用户的回复都是本地模板生成，
 * 绝不让 LLM 生成长篇文字——这是省 token 的关键。
 */
export type AiScope = "group" | "guild";
export type AiEntityKind = "member" | "channel" | "role";
/** 客户端把已加载的成员/子频道/身份组以极简 {id,name} 传来，用于本地把昵称解析成 ID。 */
export interface AiEntity {
    id: string;
    name: string;
    kind: AiEntityKind;
}
/** 归一化后的操作意图。short key 是为 LLM 输出省 token。 */
export interface AiAction {
    a: string;
    who?: string;
    min?: number;
    text?: string;
    id?: string;
    pass?: boolean;
    type?: number;
}
export interface AiResolveContext {
    scope: AiScope;
    groupOpenid?: string;
    guildId?: string;
    channelId?: string;
    entities: AiEntity[];
}
export interface AiChatRequest extends AiResolveContext {
    appId: string;
    text: string;
}
/** {code, desc} —— LLM 兜底时按 scope 只发这一小段，避免全量表。 */
export declare const GROUP_ACTIONS: ReadonlyArray<readonly [string, string]>;
export declare const GUILD_ACTIONS: ReadonlyArray<readonly [string, string]>;
export declare const COMMON_ACTIONS: ReadonlyArray<readonly [string, string]>;
export declare const actionsForScope: (scope: AiScope) => ReadonlyArray<readonly [string, string]>;
/** 给 LLM 的极简路由提示词：只列当前 scope 的动作，短 key，要求单行 JSON。 */
export declare function routerSystemPrompt(scope: AiScope): string;
/** 把「10分钟 / 半小时 / 1小时 / 1天 / 永久 / 十分钟」解析为分钟，QQ 上限 7 天。 */
export declare function parseMinutes(input: string): number | null;
/** 从剩余文本里把昵称解析成实体 ID；要求唯一命中，避免误伤。 */
export declare function resolveEntity(raw: string | undefined, entities: AiEntity[], kinds?: AiEntityKind[]): {
    id: string;
    name: string;
} | null;
/**
 * 尝试用纯本地规则理解指令。返回 null 表示需要 LLM 兜底。
 * 顺序很重要：更具体的模式放前面（如「解除禁言」要先于「禁言」）。
 */
export declare function parseLocal(text: string, scope: AiScope): AiAction | null;
/** 解析 LLM 返回的紧凑 JSON（容错：去代码围栏、抓第一个 {}、字段白名单）。 */
export declare function parseRouterJson(raw: string, scope: AiScope): AiAction | null;
/** 智能建议：完全本地生成（零 token、零 RPC），基于 scope 与已加载实体。 */
export declare function suggestActions(ctx: AiResolveContext): string[];
/** 动作的可读名称（本地模板，不耗 token）。 */
export declare const ACTION_LABELS: Readonly<Record<string, string>>;
