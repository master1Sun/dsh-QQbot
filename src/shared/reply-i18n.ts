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

const TABLES: Readonly<Record<ReplyLocale, Readonly<Record<string, string>>>> = Object.freeze({
  zh: cn,
  en,
});

/** 用位置参数替换 {0} {1} …；缺参时保留占位符本身。 */
function interpolate(template: string, args: ReadonlyArray<string | number>): string {
  if (!args.length) return template;
  return template.replace(/\{(\d+)\}/g, (whole, rawIndex) => {
    const index = Number(rawIndex);
    return index < args.length ? String(args[index]) : whole;
  });
}

/** 按语言取字段文案并插值；未命中字段名时原样返回（不丢信息）。 */
export function tr(locale: ReplyLocale, key: string, ...args: Array<string | number>): string {
  if (!key) return key;
  const table = TABLES[locale] ?? cn;
  const template = table[key] ?? cn[key] ?? key;
  return interpolate(template, args);
}

/** 该字段名是否存在于双语表（用于校验与兜底判断）。 */
export function hasReplyKey(key: string): boolean {
  return Object.prototype.hasOwnProperty.call(en, key);
}

/** /help 全文（整块翻译，避免逐行拼装错位）。 */
const HELP_CN = [
  "QQ 机器人已连接 DeepSeek Harness。",
  "",
  "直接发消息即可对话（同一群/单聊复用同一会话）。",
  "/help            显示本帮助",
  "/status          查看连接与统计",
  "/new             开启全新会话",
  "/stop            停止当前任务",
  "/steer <指令>    给正在运行的任务补充要求",
  "/session         查看当前绑定的会话 id",
  "/记忆            查看本聊天的长期记忆",
  "/清空记忆        清空本聊天的长期记忆",
  "/撤回            撤回机器人最近一条消息",
  "/广播 <内容>     向机器人所在的已知群广播",
  "/定时 查看 | /定时 每天 HH:mm 内容 | /定时 间隔 分钟 内容 | /定时 取消 序号",
  "        也支持：/定时 每周一三五 下午3:00 内容 | /定时 cron <5段> 内容 | /定时 在 2026-09-20 15:00 内容",
  "        加「智能」走 AI 生成、加「脚本」执行命令：/定时 智能 每天 20:00 总结群聊重点",
  "/perm set/view/clear  设置·查看·清除默认对话权限（注入 prompt，对所有人生效）",
].join("\n");

const HELP_EN = [
  "The QQ bot is connected to DeepSeek Harness.",
  "",
  "Just send messages to chat (each group/DM reuses one session).",
  "/help            Show this help",
  "/status          Connection & stats",
  "/new             Start a fresh session",
  "/stop            Stop the running task",
  "/steer <text>    Add instructions to the running task",
  "/session         Show the bound session id",
  "/memory          View this chat's long-term memory",
  "/forget          Clear this chat's long-term memory",
  "/recall          Recall the bot's latest message",
  "/broadcast <text>  Broadcast to all known groups",
  "/schedule list | /schedule daily HH:mm text | /schedule interval minutes text | /schedule cancel index",
  "        also: /schedule Mon,Wed,Fri 3:00pm text | /schedule cron <5 fields> text | /schedule at 2026-09-20 15:00 text",
  "        prefix 'ai' for AI-generated or 'tool' to run a command: /schedule ai daily 20:00 summarize highlights",
  "/perm set/view/clear  Set · view · clear the default conversation permission (injected into prompt, applies to everyone)",
].join("\n");

/** /help 全文（整块翻译，避免逐行拼装错位）。 */
export function helpText(locale: ReplyLocale): string {
  return locale === "en" ? HELP_EN : HELP_CN;
}
