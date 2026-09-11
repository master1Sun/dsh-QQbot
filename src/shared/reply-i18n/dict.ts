/**
 * 发给 QQ 用户的回复文案表（自动生成，勿手改）。
 *
 * 结构：字段名 → 文案。cn / en 两张表字段名完全一致。
 * 取值走 ../reply-i18n.ts 导出的 tr(locale, key, ...args)；文案里的 {0} {1} … 为位置参数。
 */

/** 简体中文 */
export const cn: Readonly<Record<string, string>> = Object.freeze({
  // ── status ──
  "status.bot": "机器人",
  "status.credentials": "凭据",
  "status.configured": "已配置",
  "status.notConfigured": "未配置，请在设置中扫码或填写 AppID/AppSecret",
  "status.workspace": "工作区",
  "status.received": "收消息",
  "status.replies": "会话回复",
  "status.proactive": "主动消息",
  "status.errors": "错误",
  "status.proactiveQuota": "主动消息配额",
  "status.disabled": "未启用",
  "status.groupBuffer": "群上下文缓冲",
  "status.countUnit": "条",
  "status.quotaTodayUnlimited": "今日 {0}（不限）",
  "status.quotaRatio": "今日 {0}/{1}",

  // ── session ──
  "session.none": "当前聊天还没有绑定会话，下一条消息将创建新会话。",
  "session.noneShort": "当前聊天还没有绑定会话。",
  "session.bound": "当前绑定会话：{0}",
  "session.unbound": "已解绑会话 {0}…，下一条消息开启全新会话。",

  // ── cmd ──
  "cmd.unknown": "未知命令 {0}，输入 /help 查看可用命令。",

  // ── schedule ──
  "schedule.tabDaily": "每天",
  "schedule.tabEvery": "每",
  "schedule.tabWeekly": "每周",
  "schedule.tabCron": "cron",
  "schedule.tabOnce": "一次性",
  "schedule.unitMin": "分钟",
  "schedule.suffixAi": "·AI",
  "schedule.suffixScript": "·脚本",
  "schedule.suffixGate": "·门控",
  "schedule.prefixDisabled": "[已禁用]",
  "schedule.suffixLastFailed": "（上次失败：",
  "schedule.suffixLastSkipped": "（上次跳过：",
  "schedule.closeParen": "）",
  "schedule.empty": "当前聊天还没有定时消息。用法：/定时 每天 09:00 内容 或 /定时 间隔 30 内容。",
  "schedule.listTitle": "当前定时消息：",
  "schedule.usageTitle": "定时消息用法（也可直接用自然语言让 AI 帮你设置）：",
  "schedule.exampleList": "/定时 查看",
  "schedule.exampleDaily": "/定时 每天 09:00 记得喝水",
  "schedule.exampleInterval": "/定时 间隔 30 休息一下",
  "schedule.usageCancel": "用法：/定时 取消 <序号>",
  "schedule.usageCancelMax": "/定时 取消 <序号>（每聊天最多 {0} 条）",
  "schedule.usageToggle": "用法：/定时 启用|禁用 <序号>",
  "schedule.usageToggleShort": "/定时 启用|禁用 <序号>",
  "schedule.timeFormat": "时间格式应为 HH:mm，例如 09:30。",
  "schedule.exampleWeekdays": "/定时 每周一三五 下午 3:00 提醒交周报",
  "schedule.exampleCron": "/定时 cron 0 9 * * 1-5 站会提醒",
  "schedule.exampleAt": "/定时 在 2026-09-20 15:00 交周报",
  "schedule.exampleAi": "/定时 智能 每天 20:00 总结今天群聊的重点",
  "schedule.exampleTool": "/定时 脚本 每天 08:00 python C:/scripts/report.py",
  "schedule.createdDaily": "已设置：每天 {0} 发送「{1}」",
  "schedule.createdInterval": "已设置：每 {0} 分钟发送「{1}」",
  "schedule.createdWeekly": "已设置：每周{0} {1} 发送「{2}」",
  "schedule.createdCron": "已设置：cron「{0}」",
  "schedule.createdCronWithText": "已设置：cron「{0}」发送「{1}」",
  "schedule.createdAt": "已设置：{0}（上海时间）发送「{1}」",
  "schedule.enabled": "已启用：{0}",
  "schedule.disabled": "已禁用：{0}",
  "schedule.enabledNext": "已启用：{0}\n下次运行：{1}（禁用期间错过的触发不补发）",
  "schedule.removed": "已删除：{0}",
  "schedule.emptyWithMax": "当前聊天还没有定时消息。用法：/定时 每天 09:00 内容 或 /定时 间隔 30 内容（每聊天最多 {0} 条）。",

  // ── memory ──
  "memory.disabled": "长期记忆未启用（可在设置中开启）。",
  "memory.empty": "本聊天还没有长期记忆。对话中让我「记住某事」即可自动写入。",
  "memory.title": "本聊天的长期记忆：",
  "memory.nothingToClear": "本聊天没有可清空的记忆。",
  "memory.cleared": "已清空本聊天的 {0} 条长期记忆。",

  // ── recall ──
  "recall.none": "没有找到本机器人最近发出的消息（仅能撤回本次运行期间发送的）。",
  "recall.done": "已撤回最近一条消息。",
  "recall.failed": "撤回失败：{0}",

  // ── broadcast ──
  "broadcast.usage": "用法：/广播 <内容>（向本机器人已见过的所有群发送）",
  "broadcast.noGroups": "本机器人还没有记录到任何群（收到群消息后才会加入广播范围）。",
  "broadcast.done": "广播完成：成功 {0} 个群。",
  "broadcast.donePartial": "广播完成：成功 {0} 个群，跳过/失败 {1} 个。",

  // ── stop ──
  "stop.none": "当前会话没有正在运行的任务。",
  "stop.requested": "已请求停止当前任务。",
  "stop.idle": "当前会话空闲，没有需要停止的任务。",

  // ── steer ──
  "steer.usage": "用法：/steer <补充指令>",
  "steer.idle": "当前没有正在运行的任务；直接发送消息即可。",
  "steer.sent": "已向当前任务补充指令。",

  // ── welcome ──
  "welcome.default": "欢迎 {nick}！@我即可与我对话。",
  "welcome.newFriend": "新朋友",

  // ── reply ──
  "reply.aiError": "⚠️ AI 回复出错：",

  // ── scheduleErr ──
  "scheduleErr.missingScopeOpenid": "缺少 scope/openid",
  "scheduleErr.emptyContent": "内容不能为空",
  "scheduleErr.contentTooLong": "内容过长（上限 2000 字）",
  "scheduleErr.badType": "type 必须是 daily / interval / cron / at 之一",
  "scheduleErr.badTime": "time 格式应为 HH:mm（上海时间，如 09:30）",
  "scheduleErr.intervalTooSmall": "间隔不能小于 5 分钟",
  "scheduleErr.badCron": "cron 表达式非法（标准 5 段，如 \"0 9 * * 1-5\"）",
  "scheduleErr.badAt": "at 必须是合法 ISO 时间",
  "scheduleErr.atInPast": "at 时间必须晚于当前时间",
  "scheduleErr.taskNotFound": "未找到该定时任务",
  "scheduleErr.atExpired": "该一次性任务的时间已过，已自动删除（未补发）",
  "scheduleErr.notFound": "未找到该定时消息",
  "scheduleErr.notFoundIndex": "未找到该定时消息（序号 1-{0}）",
  "scheduleErr.perChatMax": "每个群/单聊最多 {0} 条定时任务",

  // ── perm ──
  "perm.adminOnlySet": "只有权限管理员可以设置默认权限（permissionAdmins 已配置名单，仅名单内可改）。",
  "perm.adminOnlyClear": "只有权限管理员可以清除默认权限（permissionAdmins 已配置名单，仅名单内可改）。",
  "perm.usageSet": "用法：/perm set <对所有用户生效的权限内容>",
  "perm.saved": "已保存所有用户的默认权限，新对话将注入。",
  "perm.cleared": "已清除默认权限。",
  "perm.current": "当前默认权限：",
  "perm.none": "尚未设置默认权限。",
  "perm.nothingToClear": "没有可清除的默认权限。",
  "perm.usageAll": "用法：/perm set <内容> | /perm view | /perm clear",
});

/** English */
export const en: Readonly<Record<string, string>> = Object.freeze({
  // ── status ──
  "status.bot": "Bot",
  "status.credentials": "Credentials",
  "status.configured": "configured",
  "status.notConfigured": "not configured — scan the QR code or enter the AppID/AppSecret in settings",
  "status.workspace": "Workspace",
  "status.received": "received",
  "status.replies": "replies",
  "status.proactive": "proactive",
  "status.errors": "errors",
  "status.proactiveQuota": "Proactive quota",
  "status.disabled": "disabled",
  "status.groupBuffer": "Group context buffer",
  "status.countUnit": "msgs",
  "status.quotaTodayUnlimited": "today {0} (unlimited)",
  "status.quotaRatio": "today {0}/{1}",

  // ── session ──
  "session.none": "No session bound in this chat yet; the next message will create one.",
  "session.noneShort": "No session bound in this chat yet.",
  "session.bound": "Bound session: {0}",
  "session.unbound": "Session {0}… unbound; the next message starts a fresh session.",

  // ── cmd ──
  "cmd.unknown": "Unknown command {0}. Type /help to list commands.",

  // ── schedule ──
  "schedule.tabDaily": "daily",
  "schedule.tabEvery": "every",
  "schedule.tabWeekly": "every ",
  "schedule.tabCron": "cron",
  "schedule.tabOnce": "one-off",
  "schedule.unitMin": "min",
  "schedule.suffixAi": " ·AI",
  "schedule.suffixScript": " ·script",
  "schedule.suffixGate": " ·gate:",
  "schedule.prefixDisabled": "[disabled] ",
  "schedule.suffixLastFailed": " (last failed: ",
  "schedule.suffixLastSkipped": " (last skipped: ",
  "schedule.closeParen": ")",
  "schedule.empty": "No scheduled messages in this chat yet. Usage: /schedule daily 09:00 text or /schedule interval 30 text.",
  "schedule.listTitle": "Scheduled messages:",
  "schedule.usageTitle": "Scheduled message usage (you can also just ask the AI in natural language):",
  "schedule.exampleList": "/schedule list",
  "schedule.exampleDaily": "/schedule daily 09:00 drink some water",
  "schedule.exampleInterval": "/schedule interval 30 take a break",
  "schedule.usageCancel": "Usage: /schedule cancel <index>",
  "schedule.usageCancelMax": "/schedule cancel <index> (max {0} per chat)",
  "schedule.usageToggle": "Usage: /schedule enable|disable <index>",
  "schedule.usageToggleShort": "/schedule enable|disable <index>",
  "schedule.timeFormat": "Time format should be HH:mm, e.g. 09:30.",
  "schedule.exampleWeekdays": "/schedule Mon,Wed,Fri 3:00pm remind me to submit the weekly report",
  "schedule.exampleCron": "/schedule cron 0 9 * * 1-5 standup reminder",
  "schedule.exampleAt": "/schedule at 2026-09-20 15:00 submit the weekly report",
  "schedule.exampleAi": "/schedule ai daily 20:00 summarize today's group highlights",
  "schedule.exampleTool": "/schedule tool daily 08:00 python C:/scripts/report.py",
  "schedule.createdDaily": "Scheduled: daily at {0} sending \"{1}\"",
  "schedule.createdInterval": "Scheduled: every {0} min sending \"{1}\"",
  "schedule.createdWeekly": "Scheduled: weekly on {0} at {1} sending \"{2}\"",
  "schedule.createdCron": "Scheduled: cron \"{0}\"",
  "schedule.createdCronWithText": "Scheduled: cron \"{0}\" sending \"{1}\"",
  "schedule.createdAt": "Scheduled: one-off at {0} (Asia/Shanghai) sending \"{1}\"",
  "schedule.enabled": "Enabled: {0}",
  "schedule.disabled": "Disabled: {0}",
  "schedule.enabledNext": "Enabled: {0}\nNext run: {1} (missed triggers are not sent retroactively)",
  "schedule.removed": "Removed: {0}",
  "schedule.emptyWithMax": "No scheduled messages in this chat yet. Usage: /schedule daily 09:00 text or /schedule interval 30 text (max {0} per chat).",

  // ── memory ──
  "memory.disabled": "Long-term memory is off (enable it in settings).",
  "memory.empty": "No long-term memory in this chat yet. Say \"remember something\" in conversation to store it.",
  "memory.title": "This chat's long-term memory:",
  "memory.nothingToClear": "Nothing to clear in this chat's memory.",
  "memory.cleared": "Cleared {0} memory entries for this chat.",

  // ── recall ──
  "recall.none": "No recent message found (only messages sent during this run can be recalled).",
  "recall.done": "Latest message recalled.",
  "recall.failed": "Recall failed: {0}",

  // ── broadcast ──
  "broadcast.usage": "Usage: /broadcast <text> (send to all groups this bot has seen)",
  "broadcast.noGroups": "No groups recorded yet (groups join the broadcast list after a group message arrives).",
  "broadcast.done": "Broadcast finished: {0} group(s) sent.",
  "broadcast.donePartial": "Broadcast finished: {0} group(s) sent, {1} skipped/failed.",

  // ── stop ──
  "stop.none": "No running task in this session.",
  "stop.requested": "Stop requested for the running task.",
  "stop.idle": "This session is idle; nothing to stop.",

  // ── steer ──
  "steer.usage": "Usage: /steer <extra instructions>",
  "steer.idle": "No running task; just send a message.",
  "steer.sent": "Instructions sent to the running task.",

  // ── welcome ──
  "welcome.default": "Welcome {nick}! @me to chat with me.",
  "welcome.newFriend": "new friend",

  // ── reply ──
  "reply.aiError": "⚠️ AI reply failed: ",

  // ── scheduleErr ──
  "scheduleErr.missingScopeOpenid": "Missing scope/openid",
  "scheduleErr.emptyContent": "Content must not be empty",
  "scheduleErr.contentTooLong": "Content too long (2000 chars max)",
  "scheduleErr.badType": "type must be one of daily / interval / cron / at",
  "scheduleErr.badTime": "time must be HH:mm (Asia/Shanghai, e.g. 09:30)",
  "scheduleErr.intervalTooSmall": "Interval must be at least 5 minutes",
  "scheduleErr.badCron": "Invalid cron expression (standard 5 fields, e.g. \"0 9 * * 1-5\")",
  "scheduleErr.badAt": "at must be a valid ISO time",
  "scheduleErr.atInPast": "at must be later than now",
  "scheduleErr.taskNotFound": "Scheduled task not found",
  "scheduleErr.atExpired": "That one-off task's time has passed; it was removed without resending",
  "scheduleErr.notFound": "Scheduled message not found",
  "scheduleErr.notFoundIndex": "Scheduled message not found (index 1-{0})",
  "scheduleErr.perChatMax": "Max {0} scheduled tasks per chat",

  // ── perm ──
  "perm.adminOnlySet": "Only permission admins can set the default permission (permissionAdmins is configured; only listed members can change it).",
  "perm.adminOnlyClear": "Only permission admins can clear the default permission (permissionAdmins is configured; only listed members can change it).",
  "perm.usageSet": "Usage: /perm set <permission text applied to all users>",
  "perm.saved": "Default permission for all users saved; new conversations will inject it.",
  "perm.cleared": "Default permission cleared.",
  "perm.current": "Current default permission:",
  "perm.none": "No default permission set yet.",
  "perm.nothingToClear": "No default permission to clear.",
  "perm.usageAll": "Usage: /perm set <text> | /perm view | /perm clear",
});
