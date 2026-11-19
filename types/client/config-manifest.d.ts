/**
 * 配置清单字段元数据（客户端专用，纯数据 + 校验函数）。
 *
 * 用途：
 *  1) 「配置清单」弹窗里列出当前机器人所有可配置字段，按用途分组，逐字段给出帮助说明；
 *  2) 保存前对用户编辑的 JSON 做「格式 / 类型 / 取值」三层校验，精确指出哪个字段错在哪。
 *
 * 字段集合必须与宿主 BOT_CONFIG_FIELDS（src/host/infra/store-file.ts）保持一致——
 * 那里定义了 config.get 会回读、config.save 会写回的全部字段。凭据类字段
 * （appId/appSecret/source/credentialSource/adminToken）不在其中，因此不 exposed。
 *
 * 帮助文案用 zh/en 二元组，渲染时按当前语言选取（避免模块级 t() 冻结语言）。
 */
export type FieldType = "string" | "number" | "boolean" | "string[]" | "enum" | "object";
export interface ConfigFieldMeta {
    key: string;
    /** 分组 id（见 CONFIG_GROUPS）。 */
    group: string;
    type: FieldType;
    /** type=enum 时的合法取值。 */
    options?: readonly string[];
    /** type=number 时的合法区间（含端点）。 */
    min?: number;
    max?: number;
    /** [中文, English] 主说明：这个字段是干什么的。 */
    help: readonly [string, string];
    /** [中文, English] 配置示例：推荐写法 / 典型值。 */
    example?: readonly [string, string];
    /** [中文, English] 限制补充与配错的后果（取值范围由 min/max/options 自动生成，不必重复写）。 */
    notes?: readonly [string, string];
}
export interface ConfigFieldGroup {
    id: string;
    label: readonly [string, string];
    desc: readonly [string, string];
}
/** 按用途分组，帮助面板按此顺序展示。 */
export declare const CONFIG_GROUPS: readonly ConfigFieldGroup[];
/**
 * 字段清单。顺序与分组仅影响帮助面板展示；校验以 key 为准。
 * 注意：model 在 config.get 里是 "provider/model[:cap]" 字符串，保存时也按字符串写回。
 */
export declare const CONFIG_FIELDS: readonly ConfigFieldMeta[];
/** 允许出现在 groupOverrides 里的字段（与 shared/config.ts GROUP_OVERRIDE_FIELDS 一致）。 */
export declare const GROUP_OVERRIDE_FIELDS: readonly string[];
/** 校验问题的分类，渲染层据此生成中英提示。 */
export type IssueCode = "syntax" | "notObject" | "unknown" | "type" | "enum" | "range" | "override";
export interface ManifestIssue {
    code: IssueCode;
    /** 出错字段路径，如 valueThreshold 或 groupOverrides.<openid>.bannedWords。 */
    path: string;
    /** 附加信息：期望类型 / 合法取值 / 区间 / 语法错误详情。 */
    detail?: string;
}
type ParsedResult = {
    ok: true;
    value: Record<string, unknown>;
    issues: ManifestIssue[];
} | {
    ok: false;
    value: undefined;
    issues: ManifestIssue[];
};
/** 类型期望的中文描述，用于错误提示。 */
export declare function expectText(meta: ConfigFieldMeta, lang: 0 | 1): string;
/**
 * 解析并校验用户编辑的 JSON 文本。
 * 语法错误时 ok=false（value 不可用）；结构 / 字段问题以 issues 返回，可继续展示。
 */
export declare function parseAndValidate(text: string): ParsedResult;
export {};
