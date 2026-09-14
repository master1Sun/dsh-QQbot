/**
 * 发给 QQ 用户的回复文案表（自动生成，勿手改）。
 *
 * 结构：字段名 → 文案。cn / en 两张表字段名完全一致。
 * 取值走 ../reply-i18n.ts 导出的 tr(locale, key, ...args)；文案里的 {0} {1} … 为位置参数。
 */
/** 简体中文 */
export declare const cn: Readonly<Record<string, string>>;
/** English */
export declare const en: Readonly<Record<string, string>>;
