/**
 * Agent 可用的 QQ 频道 OpenAPI 精简目录。
 *
 * 与设置页「事件说明」展示的 48 条接口一致，但描述压成一行，
 * 只在 agent 明确需要时由 qqbot_api_help 工具返回，平时不占 prompt。
 * qqbot_api_call 也用这份目录做白名单，避免模型拼出任意路径。
 */
export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
/** [方法, 路径模板, 用途, 限制标记(逗号分隔)] —— 标记仅用于提示，不影响调用。 */
export type ApiEntry = readonly [ApiMethod, string, string, string?];
export declare const GUILD_API_CATALOG: ReadonlyArray<ApiEntry>;
/**
 * Agent 可用的 QQ 群官方 OpenAPI 精简目录（与频道目录并列）。
 * 群 OpenID 由 qqbot_api_call 从当前会话自动填充 {group_openid}。
 */
export declare const GROUP_API_CATALOG: ReadonlyArray<ApiEntry>;
/** 展示给 agent 的一行说明（限制标记压成短括号，避免长篇）。 */
export declare function describeApi(entry: ApiEntry): string;
/** 按场景取目录（默认频道，保持旧调用兼容）。 */
export declare function catalogForScope(scope?: string): ReadonlyArray<ApiEntry>;
/** 关键词匹配方法/路径/用途；limit 控制返回条数，避免长 prompt。 */
export declare function findApiEntries(keyword?: string, limit?: number, scope?: string): ApiEntry[];
/** 仅允许白名单内、且非「禁止调用」的接口；接受路径模板或已填好的真实路径。 */
export declare function matchExecutableApi(method: string, input: string, scope?: string): {
    entry: ApiEntry;
    values: Record<string, string>;
} | null;
/** 把路径模板编译成只接受安全 ID 的正则，防止模型拼出路径穿越。 */
export declare function pathTemplateRegex(template: string): RegExp;
