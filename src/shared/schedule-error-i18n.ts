/**
 * 把 ScheduleStore 返回的中文错误串按字段名翻译；未命中字段名时原样返回。
 *
 * ScheduleStore 是纯逻辑层，不感知语言，`error` 直接给中文原文。
 * 命令层回显时经此转一道；zh 环境下 tr() 会按字段名取 cn 文案（与原文一致），
 * 因此可以安全地对两个语言环境统一处理。
 */

import { tr } from "./reply-i18n.js";
import type { ReplyLocale } from "./reply-i18n.js";

/** 中文原文 → 字段名；只收录 ScheduleStore 实际会返回的错误。 */
const ERROR_KEYS: Readonly<Record<string, string>> = Object.freeze({
  "缺少 scope/openid": "scheduleErr.missingScopeOpenid",
  "内容不能为空": "scheduleErr.emptyContent",
  "内容过长（上限 2000 字）": "scheduleErr.contentTooLong",
  "type 必须是 daily / interval / cron / at 之一": "scheduleErr.badType",
  "time 格式应为 HH:mm（上海时间，如 09:30）": "scheduleErr.badTime",
  "间隔不能小于 5 分钟": "scheduleErr.intervalTooSmall",
  'cron 表达式非法（标准 5 段，如 "0 9 * * 1-5"）': "scheduleErr.badCron",
  "at 必须是合法 ISO 时间": "scheduleErr.badAt",
  "at 时间必须晚于当前时间": "scheduleErr.atInPast",
  "未找到该定时任务": "scheduleErr.taskNotFound",
  "未找到该定时消息": "scheduleErr.notFound",
  "该一次性任务的时间已过，已自动删除（未补发）": "scheduleErr.atExpired",
});

/** 带位置参数的动态错误（序号/上限随聊天状态变化）。 */
const ERROR_MATCHERS: ReadonlyArray<readonly [string, RegExp]> = [
  ["scheduleErr.notFoundIndex", /^未找到该定时消息（序号 1-(\d+)）$/],
  ["scheduleErr.perChatMax", /^每个群\/单聊最多 (\d+) 条定时任务$/],
];

/**
 * 翻译 ScheduleStore 的错误串。
 * 命中 → 按字段名取对应语言文案；未命中 → 原样返回（绝不丢信息）。
 */
export function trScheduleError(locale: ReplyLocale, error: string): string {
  const key = ERROR_KEYS[error];
  if (key) return tr(locale, key);
  for (const [name, re] of ERROR_MATCHERS) {
    const m = re.exec(error);
    if (m) return tr(locale, name, ...m.slice(1));
  }
  return error;
}
