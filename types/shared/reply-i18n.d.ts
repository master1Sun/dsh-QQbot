/**
 * 宿主侧回复文案国际化（发给 QQ 用户的文字，与设置界面 i18n 相互独立）。
 *
 * 结构：字段名 → 文案，cn / en 两张独立表（见 ./reply-i18n/dict.ts）。
 * 语言来自每机器人独立配置 `replyLocale`（"zh" | "en"，默认 "zh"）。
 *
 * 取值：
 *   tr(locale, "schedule.createdDaily", "09:00", "喝水") →
 *     zh: "已设置：每天 09:00 发送「喝水」"
 *     en: "Scheduled: daily at 09:00 sending \"喝水\""
 *
 * 文案里的 {0} {1} … 为位置参数；zh 表同样支持占位符，
 * 未传参时原样保留（便于排错）。未命中的字段名原样返回，绝不因翻译丢信息。
 */
import { cn, en } from "./reply-i18n/dict.js";
export type ReplyLocale = "zh" | "en";
/** 中文文案表（源语言，字段名与 en 完全一致）。 */
export { cn as replyCn, en as replyEn };
/** 按语言取字段文案并插值；未命中字段名时原样返回（不丢信息）。 */
export declare function tr(locale: ReplyLocale, key: string, ...args: Array<string | number>): string;
/** 该字段名是否存在于双语表（用于校验与兜底判断）。 */
export declare function hasReplyKey(key: string): boolean;
/** /help 全文（整块翻译，避免逐行拼装错位）。 */
export declare function helpText(locale: ReplyLocale): string;
