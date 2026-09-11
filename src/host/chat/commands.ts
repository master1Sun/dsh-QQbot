/**
 * QQ 聊天内命令：
 *
 *   /help            帮助
 *   /status          连接与统计状态
 *   /new             当前群/单聊解绑会话，下条消息开新会话
 *   /stop            停止当前会话正在运行的任务（agent.cancel）
 *   /steer <文本>    向正在运行的任务补充纠偏指令（agent.steer）
 *   /session         查看当前绑定的会话 id
 *
 * 命令在 rule 中最先处理：命中即直接被动回复，不进入 DSH 会话。
 * 以 / 开头但未识别的命令同样直接提示（未知命令），绝不交给 AI 回答。
 */
import { randomUUID } from "node:crypto";
import type { Agent } from "@deepseek-ai/dsh-agent";
import type { MessageId } from "@deepseek-ai/dsh-llm";
import type { QqApiClient } from "../qq/api.js";
import { PASSIVE_REPLY_LIMIT } from "../qq/api.js";
import type { QqbotConfig } from "../../shared/config.js";
import { helpText, tr, type ReplyLocale } from "../../shared/reply-i18n.js";
import { trScheduleError } from "../../shared/schedule-error-i18n.js";
import { type ScheduleEntry, type ScheduleStore } from "../schedule/schedule.js";
import type { ChatMemoryStore, MemoryEntry } from "../infra/memory.js";
import type { QuotaTracker } from "../infra/quota.js";
import { clearRecordQueue, lastSent, rememberSent } from "../messaging/state.js";
import { clearDefault, isPermissionAdmin, readDefault, writeDefault } from "../infra/permissions.js";
import type { BotState, PassiveReplyRecord, ReplyTarget } from "../../shared/types.js";

export interface CommandContext {
  getConfig: () => QqbotConfig;
  state: BotState;
  client: QqApiClient;
  agents: { get(id: string): Agent | undefined };
  schedules: ScheduleStore;
  /** 每聊天长期记忆（/记忆 /清空记忆）。 */
  memory?: ChatMemoryStore;
  /** 主动消息每日配额（/广播 消耗）。 */
  quota?: QuotaTracker;
  logger: Pick<Console, "info" | "warn" | "error">;
  /** 来源机器人 AppID：定时消息按机器人归属，由它自己发送。 */
  appId: string;
}

/** MessageId 是带标签的固化类型，构造时做一次安全转换。 */
function newMessageId(): MessageId {
  return randomUUID() as unknown as MessageId;
}

/**
 * 解析 /定时 的「一次性」时间：支持以下写法（一律按上海时间 UTC+8 解释），
 * 并返回去掉时间部分后剩余的正文：
 *   - `2026-09-20 15:00` / `2026-09-20T15:00`（显式日期）
 *   - `09-20 15:00`（今年）
 *   - `9月20日 15:00` / `9月20号下午3点`
 *   - `15:00`（今天；若已过则顺延到明天）
 * 无有效时间或时间已过（显式日期情形）返回 null。
 */
export function parseAtTime(input: string, now: Date): { at: string; content: string } | null {
  const SH = 8 * 60 * 60 * 1000;
  const wall = new Date(now.getTime() + SH);
  const pickClock = (text: string): { h: number; m: number; rest: string } | null => {
    const m = /^(早上|早晨|上午|中午|下午|傍晚|晚上|晚|凌晨)?\s*(\d{1,2})\s*(?:[:：点时]\s*(\d{1,2})?\s*分?)?/.exec(text);
    if (!m || m[2] === undefined) return null;
    let h = Number(m[2]);
    const mm = m[3] === undefined || m[3] === "" ? 0 : Number(m[3]);
    if (!Number.isFinite(h) || !Number.isFinite(mm) || h > 23 || mm > 59) return null;
    const period = m[1] ?? "";
    if (/下午|傍晚|晚|晚上/.test(period) && h < 12) h += 12;
    if (/中午/.test(period) && h < 12) h = 12;
    if (/凌晨/.test(period) && h === 12) h = 0;
    return { h, m: mm, rest: text.slice(m[0].length).trim() };
  };
  const build = (y: number, mo: number, d: number, h: number, mi: number): { at: string; content: string } | null => {
    const epoch = Date.UTC(y, mo - 1, d, h, mi) - SH;
    if (!Number.isFinite(epoch)) return null;
    return { at: new Date(epoch).toISOString(), content: "" };
  };

  // ① 显式日期：YYYY-MM-DD / MM-DD / YYYY/MM/DD
  let m = /^(\d{4})[-/年](\d{1,2})[-/月](\d{1,2})[日号]?[ T]*([\s\S]*)$/.exec(input);
  if (m) {
    const clock = pickClock(m[4]) ?? { h: 0, m: 0, rest: m[4] };
    const built = build(Number(m[1]), Number(m[2]), Number(m[3]), clock.h, clock.m);
    if (!built) return null;
    return { ...built, content: clock.rest };
  }
  // ② 月-日（当年）
  m = /^(\d{1,2})[-/月](\d{1,2})[日号]?[ T]*([\s\S]*)$/.exec(input);
  if (m) {
    const clock = pickClock(m[3]) ?? { h: 0, m: 0, rest: m[3] };
    const y = wall.getUTCFullYear();
    let built = build(y, Number(m[1]), Number(m[2]), clock.h, clock.m);
    if (!built) return null;
    if (new Date(built.at).getTime() <= now.getTime()) built = build(y + 1, Number(m[1]), Number(m[2]), clock.h, clock.m);
    return built ? { ...built, content: clock.rest } : null;
  }
  // ③ 仅时分：今天，已过则明天
  const clock = pickClock(input);
  if (clock && clock.rest) {
    const y = wall.getUTCFullYear();
    const mo = wall.getUTCMonth() + 1;
    const d = wall.getUTCDate();
    let built = build(y, mo, d, clock.h, clock.m);
    if (!built) return null;
    if (new Date(built.at).getTime() <= now.getTime()) {
      const next = new Date(Date.UTC(y, mo - 1, d) + 24 * 60 * 60 * 1000 - SH);
      built = build(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate(), clock.h, clock.m);
    }
    return built ? { ...built, content: clock.rest } : null;
  }
  return null;
}

export const HELP_TEXT = helpText("zh");

/** 会话当前绑定的被动回复记录（如无则用兜底目标）。 */
function recordFor(state: BotState, chatKey: string, fallbackTarget: ReplyTarget, fallbackMsgId: string): PassiveReplyRecord {
  const existing = state.recordBySession.get(chatKey);
  if (existing) {
    return { ...existing, msgId: fallbackMsgId || existing.msgId, nextSeq: 1, receivedAt: Date.now() };
  }
  return { target: fallbackTarget, chatKey, msgId: fallbackMsgId, nextSeq: 1, receivedAt: Date.now(), quoteMention: true };
}

export interface CommandOutcome {
  handled: boolean;
  reply?: string;
}

/** 解析并执行命令；非命令返回 { handled: false }。 */
export async function runCommand(
  text: string,
  { scope, openid, sender, msgId }: { scope: ReplyTarget["scope"]; openid: string; sender: string; msgId: string },
  ctx: CommandContext,
): Promise<CommandOutcome> {
  const trimmed = text.trim();
  if (!trimmed.startsWith("/")) return { handled: false };
  const [rawCmd, ...rest] = trimmed.split(/\s+/);
  const cmd = (rawCmd ?? "").toLowerCase();
  const arg = rest.join(" ").trim();
  const config = ctx.getConfig();
  const chatKey = `${scope}:${openid}`;
  // 发给 QQ 用户的文案语言（每机器人独立配置 replyLocale，默认中文）。
  const locale: ReplyLocale = config.replyLocale === "en" ? "en" : "zh";
  /** 文案翻译助手：按字段名取文案 + 位置参数；zh/en 各自独立字典。 */
  const T = (key: string, ...args: Array<string | number>): string => tr(locale, key, ...args);

  const reply = async (content: string): Promise<void> => {
    const record = recordFor(ctx.state, chatKey, { scope, openid }, msgId);
    const limit = Math.min(config.maxRepliesPerMessage, PASSIVE_REPLY_LIMIT[scope]);
    try {
      await ctx.client.sendReply(record.target, content, {
        msgId: record.msgId,
        msgSeq: record.nextSeq,
        markdown: false,
      });
      record.nextSeq = Math.min(record.nextSeq + 1, limit);
    } catch (error) {
      ctx.logger.error("[dsh-qqbot] 命令回复发送失败:", error);
    }
  };

  switch (cmd) {
    case "/help":
    case "/菜单":
      await reply(helpText(locale));
      return { handled: true };

    case "/status": {
      const { counters } = ctx.state;
      const configured = Boolean(config.appId && config.appSecret) || Boolean(config.secretEnv);
      const usage = ctx.quota ? await ctx.quota.usage(ctx.appId) : null;
      const quotaText = usage
        ? usage.limit > 0
          ? T("status.quotaRatio", usage.used, usage.limit)
          : T("status.quotaTodayUnlimited", usage.used)
        : T("status.disabled");
      const buffered = [...ctx.state.groupBuffer.values()].reduce((n, list) => n + list.length, 0);
      await reply([
        `${T("status.bot")}: AppID ${config.appId}`,
        `${T("status.credentials")}: ${configured ? `${T("status.configured")}（${config.credentialSource}）` : T("status.notConfigured")}`,
        `${T("status.workspace")}: ${config.workspacePath}`,
        `${T("status.received")}: ${counters.received} · ${T("status.replies")}: ${counters.replies} · ${T("status.proactive")}: ${counters.proactive} · ${T("status.errors")}: ${counters.errors}`,
        `${T("status.proactiveQuota")}: ${quotaText}`,
        `${T("status.groupBuffer")}: ${buffered} ${T("status.countUnit")}`,
      ].join("\n"));
      return { handled: true };
    }

    case "/new": {
      const boundId = ctx.state.chatSession.get(chatKey);
      if (boundId) {
        ctx.state.recordBySession.delete(boundId);
        clearRecordQueue(ctx.state, boundId);
        ctx.state.chatSession.delete(chatKey);
        await reply(T("session.unbound", boundId.slice(0, 8)));
      } else {
        await reply(T("session.none"));
      }
      return { handled: true };
    }

    case "/session": {
      const boundId = ctx.state.chatSession.get(chatKey);
      await reply(boundId ? T("session.bound", boundId) : T("session.noneShort"));
      return { handled: true };
    }

    case "/定时":
    case "/schedule":
    case "/定时消息": {
      // 触发条件/执行方式的展示文案：四种触发 + 三种模式 + 周几 + 契约标记。
      const WDC = ["日", "一", "二", "三", "四", "五", "六"];
      const wdText = (list?: number[]): string =>
        list?.length ? `${T("schedule.tabWeekly")}${list.map((w) => WDC[((w % 7) + 7) % 7]).join("")}` : "";
      const modeText = (m?: string): string =>
        m === "ai" ? T("schedule.suffixAi") : m === "tool" ? T("schedule.suffixScript") : "";
      const whenOf = (entry: ScheduleEntry): string => {
        const wd = wdText(entry.weekdays);
        if (entry.type === "daily") return `${wd}${T("schedule.tabDaily")} ${entry.time}`;
        if (entry.type === "interval") return `${wd}${T("schedule.tabEvery")} ${entry.minutes} ${T("schedule.unitMin")}`;
        if (entry.type === "cron") return `${T("schedule.tabCron")} ${entry.cron}`;
        if (entry.type === "at") return `${T("schedule.tabOnce")} ${entry.at ? entry.at.slice(0, 16).replace("T", " ") : ""}`;
        return entry.type;
      };
      const describe = (entry: ScheduleEntry, index: number): string => {
        const failed = entry.lastError
          ? `${T("schedule.suffixLastFailed")}${entry.lastError}${T("schedule.closeParen")}`
          : "";
        const off = entry.enabled === false ? `${T("schedule.prefixDisabled")}` : "";
        const gated =
          entry.gate && entry.gate !== "always" ? `${T("schedule.suffixGate")}${entry.gate}` : "";
        const silent = entry.lastSkipReason
          ? `${T("schedule.suffixLastSkipped")}${entry.lastSkipReason}${T("schedule.closeParen")}`
          : "";
        const body = entry.mode === "tool" ? entry.command ?? entry.content : entry.content;
        return `${off}${index}. [${whenOf(entry)}${modeText(entry.mode)}${gated}] ${body}${failed}${silent}`;
      };
      const sub = arg.split(/\s+/)[0] ?? "";
      const rest = arg.slice(sub.length).trim();

      // 查看
      if (!sub || sub === "查看" || sub === "list") {
        const mine = ctx.schedules.listForChat(scope, openid);
        // 单聊天条数上限由机器人配置 scheduleMaxPerChat 决定（默认 15，0 = 不限）。
        const limit = config.scheduleMaxPerChat;
        await reply(mine.length === 0
          ? limit > 0
            ? T("schedule.emptyWithMax", limit)
            : T("schedule.empty")
          : [T("schedule.listTitle"), ...mine.map(describe)].join("\n"));
        return { handled: true };
      }

      // 取消
      if (sub === "取消" || sub === "删除" || sub === "remove" || sub === "cancel") {
        const target = rest.trim();
        if (!target) {
          await reply(T("schedule.usageCancel"));
          return { handled: true };
        }
        const result = await ctx.schedules.remove(scope, openid, target);
        await reply(
          result.ok
            ? T("schedule.removed", describe(result.entry!, 0).replace(/^\d+\.\s*/, ""))
            : trScheduleError(locale, result.error ?? ""),
        );
        return { handled: true };
      }

      // 启用 / 禁用
      if (sub === "启用" || sub === "禁用" || sub === "enable" || sub === "disable") {
        const target = rest.trim();
        if (!target) {
          await reply(T("schedule.usageToggle"));
          return { handled: true };
        }
        const mine = ctx.schedules.listForChat(scope, openid);
        const idx = Number(target);
        const hit = Number.isSafeInteger(idx) && idx >= 1 ? mine[idx - 1] : mine.find((e) => e.id === target);
        if (!hit) {
          await reply(T("scheduleErr.notFoundIndex", mine.length));
          return { handled: true };
        }
        const wantEnabled = sub === "启用" || sub === "enable";
        const result = await ctx.schedules.setEnabled(hit.id, wantEnabled);
        if (!result.ok) {
          await reply(trScheduleError(locale, result.error ?? ""));
          return { handled: true };
        }
        const line = describe(result.entry!, mine.indexOf(hit) + 1).replace(/^\d+\.\s*/, "");
        // 重新启用只排到下一个触发点（不补发禁用期间错过的），所以必须回显下次时间。
        const next = wantEnabled ? result.entry?.nextRunAt?.slice(0, 16).replace("T", " ") : "";
        await reply(next
          ? T("schedule.enabledNext", line, next)
          : T(wantEnabled ? "schedule.enabled" : "schedule.disabled", line));
        return { handled: true };
      }

      // ── 解析可选的「周几」前缀：周一 / 每周一三五 / 工作日 / 周末 / 每天 ──
      // 返回 { weekdays, rest }：weekdays 为空数组表示未限定。
      const parseWeekdays = (input: string): { weekdays: number[]; rest: string } => {
        const patterns: Array<{ re: RegExp; days: number[] }> = [
          { re: /^(?:每周)?工作日\s*/, days: [1, 2, 3, 4, 5] },
          { re: /^(?:每周)?周末\s*/, days: [0, 6] },
        ];
        for (const p of patterns) {
          if (p.re.test(input)) return { weekdays: p.days, rest: input.replace(p.re, "").trim() };
        }
        // 每周一 / 每周一三五 [每周]一、三 / 周一到周五
        const m = /^(?:每(?:周|星期)|周|星期)((?:(?:[日一二三四五六])(?:[、,，到至和及])?)+)\s*/.exec(input);
        if (!m) return { weekdays: [], rest: input };
        const body = m[1];
        // 区间写法：三到五 / 三至五
        const range = /^([日一二三四五六])[到至]([日一二三四五六])$/.exec(body);
        const num = (c: string) => WDC.indexOf(c);
        let days: number[];
        if (range) {
          const a = num(range[1]);
          const b = num(range[2]);
          if (a < 0 || b < 0) return { weekdays: [], rest: input };
          days = [];
          for (let cur = a; ; cur = (cur + 1) % 7) {
            days.push(cur);
            if (cur === b) break;
            if (days.length >= 7) break;
          }
        } else {
          days = [];
          for (const ch of body) {
            const n = num(ch);
            if (n >= 0 && !days.includes(n)) days.push(n);
          }
        }
        if (!days.length) return { weekdays: [], rest: input };
        return { weekdays: days, rest: input.slice(m[0].length).trim() };
      };
      const wdPrefixed = parseWeekdays(rest);
      const restNoWd = wdPrefixed.rest;
      // 「每天」是 daily 的关键字，同时也是「不加周几过滤」的语义 → 有『每天』前缀时丢弃 weekdays。
      const isDailyKeyword = /^(?:每天|每日|daily)\b/.test(restNoWd);

      // ── 执行方式前缀：ai|智能|AI … / tool|脚本|命令 … / text|文本 … ──
      const parseMode = (input: string): { mode?: "text" | "ai" | "tool"; rest: string } => {
        const m = /^(ai|智能|文本|text|脚本|命令|tool)\s+/i.exec(input);
        if (!m) return { rest: input };
        const k = m[1].toLowerCase();
        const mode = k === "ai" || k === "智能" ? "ai" : k === "文本" || k === "text" ? "text" : "tool";
        return { mode, rest: input.slice(m[0].length).trim() };
      };
      const modePrefixed = parseMode(restNoWd);
      const mode = modePrefixed.mode;
      const body = modePrefixed.rest;

      // 时间段前缀：早|上午|中午|下午|晚|晚上 → 24 小时制小时偏移
      const parseClock = (input: string): { time?: string; rest: string } => {
        const m = /^(早上|早晨|上午|中午|下午|傍晚|晚上|晚|凌晨)?\s*(\d{1,2})(?:[:：点时](\d{1,2})?分?)?\s*/.exec(input);
        if (!m || m[2] === undefined) return { rest: input };
        let h = Number(m[2]);
        const mm = m[3] === undefined ? 0 : Number(m[3]);
        if (!Number.isFinite(h) || !Number.isFinite(mm) || mm > 59) return { rest: input };
        const period = m[1] ?? "";
        if (/下午|傍晚|晚|晚上/.test(period) && h < 12) h += 12;
        if (/中午/.test(period) && h < 12) h = 12;
        if (/凌晨/.test(period) && h === 12) h = 0;
        // 「九点」类中文数字已由模型/用户写成阿拉伯数字；此处只处理 0-23。
        if (h > 23) return { rest: input };
        return { time: `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`, rest: input.slice(m[0].length).trim() };
      };

      // 每天 [时间段] HH:mm 内容（无时间段的纯 HH:mm 也支持）
      const daily = /^(\d{1,2}:\d{2})\s*([\s\S]+)$/.exec(body);
      if (isDailyKeyword || daily) {
        let time: string | undefined;
        let content = "";
        if (daily) {
          time = daily[1];
          content = daily[2];
        } else {
          const clock = parseClock(body.replace(/^(?:每天|每日|daily)\s*/, ""));
          if (clock.time && clock.rest) {
            time = clock.time;
            content = clock.rest;
          }
        }
        if (time && content) {
          const hh = Number(time.split(":")[0]);
          const mm = Number(time.split(":")[1]);
          if (hh > 23 || mm > 59) {
            await reply(T("schedule.timeFormat"));
            return { handled: true };
          }
          const weekdays = isDailyKeyword ? undefined : wdPrefixed.weekdays;
          const result = await ctx.schedules.add({
            scope, openid, type: "daily", time, content, createdBy: sender, appId: ctx.appId,
            ...(mode ? { mode } : {}),
            ...(weekdays?.length ? { weekdays } : {}),
          });
          await reply(result.ok
            ? weekdays?.length
              ? T("schedule.createdWeekly", weekdays.map((w) => WDC[w]).join(""), time, content.slice(0, 50))
              : T("schedule.createdDaily", time, content.slice(0, 50))
            : trScheduleError(locale, result.error ?? ""));
          return { handled: true };
        }
      }

      // 间隔 N 内容
      const interval = /^(?:间隔|每\s*(\d+)\s*分钟|interval)\s*(?:(\d+)\s*分钟?)?\s*([\s\S]+)$/.exec(body);
      if (interval) {
        const minutes = Number(interval[1] ?? interval[2] ?? 0);
        const content = interval[3];
        const result = await ctx.schedules.add({
          scope, openid, type: "interval", minutes, content, createdBy: sender, appId: ctx.appId,
          ...(mode ? { mode } : {}),
          ...(wdPrefixed.weekdays.length ? { weekdays: wdPrefixed.weekdays } : {}),
        });
        await reply(result.ok
          ? T("schedule.createdInterval", minutes, content.slice(0, 50))
          : trScheduleError(locale, result.error ?? ""));
        return { handled: true };
      }

      // cron <5 段表达式> [内容]
      const cronRe = /^cron\s+((?:\S+\s+){4}\S+)\s*([\s\S]*)$/i.exec(body);
      if (cronRe) {
        const expr = cronRe[1].trim();
        let content = cronRe[2].trim();
        // 允许 cron 与内容间用「|」或「发送」分隔；没有内容时用占位（cron 任务多为 ai 模式）。
        content = content.replace(/^[|｜]\s*/, "").replace(/^发送\s*/, "");
        const result = await ctx.schedules.add({
          scope, openid, type: "cron", cron: expr, content: content || (mode === "ai" ? "" : content),
          createdBy: sender, appId: ctx.appId,
          ...(mode ? { mode } : {}),
        });
        if (result.ok) {
          await reply(content
            ? T("schedule.createdCronWithText", expr, content.slice(0, 50))
            : T("schedule.createdCron", expr));
        } else {
          await reply(trScheduleError(locale, result.error ?? ""));
        }
        return { handled: true };
      }

      // at <时间> [内容]：支持 YYYY-MM-DD HH:mm / MM-DD HH:mm / HH:mm（今天或明天）
      const atRe = /^(?:at|一次性|定时)\s*(?:在)?\s*([\s\S]+)$/i.exec(body);
      if (atRe || /^\d{4}-\d{1,2}-\d{1,2}[ T]\d{1,2}[:：]\d{2}/.test(body) || /^\d{1,2}月\d{1,2}[日号]/.test(body)) {
        const raw = (atRe ? atRe[1] : body).trim();
        const parsed = parseAtTime(raw, new Date());
        if (parsed) {
          const result = await ctx.schedules.add({
            scope, openid, type: "at", at: parsed.at, content: parsed.content,
            createdBy: sender, appId: ctx.appId,
            ...(mode ? { mode } : {}),
          });
          await reply(result.ok
            ? T("schedule.createdAt", parsed.at.slice(0, 16).replace("T", " "), parsed.content.slice(0, 50))
            : trScheduleError(locale, result.error ?? ""));
          return { handled: true };
        }
      }

      await reply([
        T("schedule.usageTitle"),
        T("schedule.exampleList"),
        T("schedule.exampleDaily"),
        T("schedule.exampleWeekdays"),
        T("schedule.exampleInterval"),
        T("schedule.exampleCron"),
        T("schedule.exampleAt"),
        T("schedule.exampleAi"),
        T("schedule.exampleTool"),
        T("schedule.usageToggleShort"),
        config.scheduleMaxPerChat > 0
          ? T("schedule.usageCancelMax", config.scheduleMaxPerChat)
          : T("schedule.usageCancel"),
      ].join("\n"));
      return { handled: true };
    }

    case "/记忆":
    case "/memory": {
      if (!ctx.memory || !config.memoryEnabled) {
        await reply(T("memory.disabled"));
        return { handled: true };
      }
      const entries: MemoryEntry[] = await ctx.memory.load(chatKey);
      await reply(entries.length === 0
        ? T("memory.empty")
        : [T("memory.title"), ...entries.map((e, i) => `${i + 1}. ${e.text}`)].join("\n"));
      return { handled: true };
    }

    case "/清空记忆":
    case "/forget": {
      if (!ctx.memory || !config.memoryEnabled) {
        await reply(T("memory.disabled"));
        return { handled: true };
      }
      const removed = await ctx.memory.clear(chatKey);
      await reply(removed > 0 ? T("memory.cleared", removed) : T("memory.nothingToClear"));
      return { handled: true };
    }

    case "/撤回":
    case "/recall": {
      const targetId = lastSent(ctx.state, chatKey, 1);
      if (!targetId) {
        await reply(T("recall.none"));
        return { handled: true };
      }
      try {
        await ctx.client.recall({ scope, openid }, targetId);
        await reply(T("recall.done"));
      } catch (error) {
        await reply(T("recall.failed", error instanceof Error ? error.message : String(error)));
      }
      return { handled: true };
    }

    case "/广播":
    case "/broadcast": {
      if (!arg) {
        await reply(T("broadcast.usage"));
        return { handled: true };
      }
      const groups = [...ctx.state.groupBuffer.keys()];
      if (groups.length === 0) {
        await reply(T("broadcast.noGroups"));
        return { handled: true };
      }
      let sent = 0;
      let skipped = 0;
      for (const group of groups) {
        if (ctx.quota && !(await ctx.quota.tryConsume(1, ctx.appId))) {
          skipped += 1;
          continue;
        }
        try {
          const id = await ctx.client.sendText({ scope: "group", openid: group }, arg);
          if (id) rememberSent(ctx.state, `group:${group}`, id);
          ctx.state.counters.proactive += 1;
          sent += 1;
        } catch (error) {
          skipped += 1;
          ctx.logger.warn(`[dsh-qqbot] 广播到群 ${group.slice(0, 12)}… 失败:`, error);
        }
      }
      await reply(skipped > 0
        ? T("broadcast.donePartial", sent, skipped)
        : T("broadcast.done", sent));
      return { handled: true };
    }

    case "/stop": {
      const boundId = ctx.state.chatSession.get(chatKey);
      const agent = boundId ? ctx.agents.get(boundId) : undefined;
      if (!agent) {
        await reply(T("stop.none"));
        return { handled: true };
      }
      if (agent.status === "running") {
        agent.cancel({ kind: "user" }, { keepInbox: true });
        await reply(T("stop.requested"));
      } else {
        await reply(T("stop.idle"));
      }
      return { handled: true };
    }

    case "/steer": {
      if (!arg) {
        await reply(T("steer.usage"));
        return { handled: true };
      }
      const boundId = ctx.state.chatSession.get(chatKey);
      const agent = boundId ? ctx.agents.get(boundId) : undefined;
      if (!agent || agent.status !== "running") {
        await reply(T("steer.idle"));
        return { handled: true };
      }
      agent.steer({
        id: newMessageId(),
        role: "user",
        content: [{ type: "text", text: arg }],
        source: { kind: "user" },
      });
      await reply(T("steer.sent"));
      return { handled: true };
    }
    case "/perm":
    case "/权限": {
      // 默认权限自助管理：view 任何人可读；set/clear 受 permissionAdmins 约束
      // （名单为空=不设限，任何人可改；"*"=全部）。
      const isAdmin = isPermissionAdmin(config.permissionAdmins, sender);
      const parts = arg.split(/\s+/);
      const sub = (parts[0] ?? "").toLowerCase();
      const rest = arg.slice(sub.length).trim();
      if (sub === "view") {
        const current = await readDefault(ctx.appId);
        await reply(current ? `${T("perm.current")}\n\n${current}` : T("perm.none"));
      } else if (sub === "set") {
        if (!isAdmin) {
          await reply(T("perm.adminOnlySet"));
          return { handled: true };
        }
        if (!rest) {
          await reply(T("perm.usageSet"));
          return { handled: true };
        }
        await writeDefault(ctx.appId, rest);
        await reply(T("perm.saved"));
      } else if (sub === "clear") {
        if (!isAdmin) {
          await reply(T("perm.adminOnlyClear"));
          return { handled: true };
        }
        await reply(await clearDefault(ctx.appId) ? T("perm.cleared") : T("perm.nothingToClear"));
      } else {
        await reply(T("perm.usageAll"));
      }
      return { handled: true };
    }

    default:
      // 以 / 开头视为命令意图：未知命令直接反馈，不进入 AI 会话。
      await reply(T("cmd.unknown", cmd));
      return { handled: true };
  }
}
