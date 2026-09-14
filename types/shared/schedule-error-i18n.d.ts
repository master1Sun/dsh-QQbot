/**
 * 把 ScheduleStore 返回的中文错误串按字段名翻译；未命中字段名时原样返回。
 *
 * ScheduleStore 是纯逻辑层，不感知语言，`error` 直接给中文原文。
 * 命令层回显时经此转一道；zh 环境下 tr() 会按字段名取 cn 文案（与原文一致），
 * 因此可以安全地对两个语言环境统一处理。
 */
import type { ReplyLocale } from "./reply-i18n.js";
/**
 * 翻译 ScheduleStore 的错误串。
 * 命中 → 按字段名取对应语言文案；未命中 → 原样返回（绝不丢信息）。
 */
export declare function trScheduleError(locale: ReplyLocale, error: string): string;
