/**
 * 宿主侧回复文案国际化（发给 QQ 用户的文字，与设置界面 i18n 相互独立）。
 *
 * 背景：设置界面（client）经宿主 locale 服务双语化；但 commands/events
 * 直接发给 QQ 用户的文案原本是中文硬编码。这里提供一套轻量字典：
 *  - 中文为源语言（key 即中文原文），EN 给出译文；
 *  - 语言来自每机器人独立配置 `replyLocale`（"zh" | "en"，默认 "zh"）；
 *  - `tr(locale, text)`：精确字典 → 动态规则 → 原样返回（未命中的中文/
 *    平台错误消息在英文环境下保持原文，绝不因翻译丢失信息）。
 */

export type ReplyLocale = "zh" | "en";

/** zh 原文 → EN 译文（仅收录实际发给 QQ 用户的文案）。 */
const EN: Readonly<Record<string, string>> = Object.freeze({
  // ── /status 标签 ──
  "机器人": "Bot",
  "凭据": "Credentials",
  "已配置": "configured",
  "未配置，请在设置中扫码或填写 AppID/AppSecret":
    "not configured — scan the QR code or enter the AppID/AppSecret in settings",
  "工作区": "Workspace",
  "收消息": "received",
  "会话回复": "replies",
  "主动消息": "proactive",
  "错误": "errors",
  "主动消息配额": "Proactive quota",
  "未启用": "disabled",
  "群上下文缓冲": "Group context buffer",
  "条": "msgs",

  // ── /new /session ──
  "当前聊天还没有绑定会话，下一条消息将创建新会话。":
    "No session bound in this chat yet; the next message will create one.",
  "当前聊天还没有绑定会话。": "No session bound in this chat yet.",

  // ── /定时 ──
  "每天": "daily",
  "每": "every",
  "分钟": "min",
  "（上次失败：": " (last failed: ",
  "）": ")",
  "当前聊天还没有定时消息。用法：/定时 每天 09:00 内容 或 /定时 间隔 30 内容（每聊天最多 5 条）。":
    "No scheduled messages in this chat yet. Usage: /定时 daily 09:00 text or /定时 interval 30 text (max 5 per chat).",
  "当前定时消息：": "Scheduled messages:",
  "定时消息用法（也可直接用自然语言让 AI 帮你设置）：":
    "Scheduled message usage (you can also just ask the AI in natural language):",
  "/定时 查看": "/定时 list",
  "/定时 每天 09:00 记得喝水": "/定时 daily 09:00 drink some water",
  "/定时 间隔 30 休息一下": "/定时 interval 30 take a break",
  "用法：/定时 取消 <序号>": "Usage: /定时 cancel <index>",

  // ── /记忆 /清空记忆 ──
  "长期记忆未启用（可在设置中开启）。": "Long-term memory is off (enable it in settings).",
  "本聊天还没有长期记忆。对话中让我「记住某事」即可自动写入。":
    "No long-term memory in this chat yet. Say \"remember something\" in conversation to store it.",
  "本聊天的长期记忆：": "This chat's long-term memory:",
  "本聊天没有可清空的记忆。": "Nothing to clear in this chat's memory.",

  // ── /撤回 ──
  "没有找到本机器人最近发出的消息（仅能撤回本次运行期间发送的）。":
    "No recent message found (only messages sent during this run can be recalled).",
  "已撤回最近一条消息。": "Latest message recalled.",

  // ── /广播 ──
  "用法：/广播 <内容>（向本机器人已见过的所有群发送）":
    "Usage: /广播 <text> (send to all groups this bot has seen)",
  "本机器人还没有记录到任何群（收到群消息后才会加入广播范围）。":
    "No groups recorded yet (groups join the broadcast list after a group message arrives).",

  // ── /stop /steer ──
  "当前会话没有正在运行的任务。": "No running task in this session.",
  "已请求停止当前任务。": "Stop requested for the running task.",
  "当前会话空闲，没有需要停止的任务。": "This session is idle; nothing to stop.",
  "用法：/steer <补充指令>": "Usage: /steer <extra instructions>",
  "当前没有正在运行的任务；直接发送消息即可。": "No running task; just send a message.",
  "已向当前任务补充指令。": "Instructions sent to the running task.",

  // ── 欢迎语默认文案（events.ts）──
  "欢迎 {nick}！@我即可与我对话。": "Welcome {nick}! @me to chat with me.",
  "新朋友": "new friend",

  // ── AI 报错提示（reply.ts，后接平台错误消息）──
  "⚠️ AI 回复出错：": "⚠️ AI reply failed: ",

  // ── ScheduleStore 错误（commands 回显时翻译）──
  "缺少 scope/openid": "Missing scope/openid",
  "消息内容不能为空": "Message content must not be empty",
  "消息内容过长（上限 2000 字）": "Message too long (2000 chars max)",
  "type 必须是 daily 或 interval": "type must be daily or interval",
  "time 格式应为 HH:mm（上海时间，如 09:30）": "time must be HH:mm (Asia/Shanghai, e.g. 09:30)",
  "间隔不能小于 5 分钟": "Interval must be at least 5 minutes",
  "未找到该定时消息": "Scheduled message not found",
});

/** 动态模板（英文环境）：无法穷举的插值串。 */
function trDynamic(text: string): string | null {
  let m: RegExpExecArray | null;
  m = /^已解绑会话 (.+?)…，下一条消息开启全新会话。$/.exec(text);
  if (m) return `Session ${m[1]}… unbound; the next message starts a fresh session.`;
  m = /^当前绑定会话：(.+)$/.exec(text);
  if (m) return `Bound session: ${m[1]}`;
  m = /^未知命令 (.+?)，输入 \/help 查看可用命令。$/.exec(text);
  if (m) return `Unknown command ${m[1]}. Type /help to list commands.`;
  m = /^已清空本聊天的 (\d+) 条长期记忆。$/.exec(text);
  if (m) return `Cleared ${m[1]} memory entries for this chat.`;
  m = /^撤回失败：([\s\S]+)$/.exec(text);
  if (m) return `Recall failed: ${m[1]}`;
  m = /^广播完成：成功 (\d+) 个群(，跳过\/失败 (\d+) 个)?。$/.exec(text);
  if (m) return `Broadcast finished: ${m[1]} group(s) sent${m[3] ? `, ${m[3]} skipped/failed` : ""}.`;
  m = /^已设置：每天 (\d{1,2}:\d{2}) 发送「(.*)」$/.exec(text);
  if (m) return `Scheduled: daily at ${m[1]} sending "${m[2]}"`;
  m = /^已设置：每 (\d+) 分钟发送「(.*)」$/.exec(text);
  if (m) return `Scheduled: every ${m[1]} min sending "${m[2]}"`;
  m = /^已删除：([\s\S]+)$/.exec(text);
  if (m) return `Removed: ${m[1]}`;
  m = /^未找到该定时消息（序号 1-(\d+)）$/.exec(text);
  if (m) return `Scheduled message not found (index 1-${m[1]})`;
  m = /^每个群\/单聊最多 (\d+) 条定时消息$/.exec(text);
  if (m) return `Max ${m[1]} scheduled messages per chat`;
  m = /^\/定时 取消 <序号>（每聊天最多 (\d+) 条）$/.exec(text);
  if (m) return `/定时 cancel <index> (max ${m[1]} per chat)`;
  m = /^今日 (\d+)\/(\d+)$/.exec(text);
  if (m) return `today ${m[1]}/${m[2]}`;
  m = /^今日 (\d+)（不限）$/.exec(text);
  if (m) return `today ${m[1]} (unlimited)`;
  return null;
}

/** 按语言翻译发给 QQ 用户的文案；未命中原样返回（不丢信息）。 */
export function tr(locale: ReplyLocale, text: string): string {
  if (locale !== "en" || !text) return text;
  return EN[text] ?? trDynamic(text) ?? text;
}

/** /help 全文（整块翻译，避免逐行拼装错位）。 */
export function helpText(locale: ReplyLocale): string {
  if (locale !== "en") {
    return [
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
    ].join("\n");
  }
  return [
    "The QQ bot is connected to DeepSeek Harness.",
    "",
    "Just send messages to chat (each group/DM reuses one session).",
    "/help            Show this help",
    "/status          Connection & stats",
    "/new             Start a fresh session",
    "/stop            Stop the running task",
    "/steer <text>    Add instructions to the running task",
    "/session         Show the bound session id",
    "/记忆            View this chat's long-term memory",
    "/清空记忆        Clear this chat's long-term memory",
    "/撤回            Recall the bot's latest message",
    "/广播 <text>     Broadcast to all known groups",
    "/定时 list | /定时 daily HH:mm text | /定时 interval minutes text | /定时 cancel index",
  ].join("\n");
}
