/**
 * dsh-qqbot 设置界面文案表（自动生成，勿手改）。
 *
 * 结构：字段名 → 文案。cn / en 两张表字段名完全一致。
 * 取值一律走 i18n/index.ts 导出的 t() / fmt() / localizeText()，不要再写中文字面量。
 * {0} {1} … 为位置参数，配 fmt(key, ...args) 使用。
 */
/** 简体中文 */
export declare const cn: Readonly<Record<string, string>>;
/** English */
export declare const en: Readonly<Record<string, string>>;
/** 语言标识：项目内部用 cn/en，注册到宿主时映射为 zh/en。 */
export type LocaleId = "cn" | "en";
