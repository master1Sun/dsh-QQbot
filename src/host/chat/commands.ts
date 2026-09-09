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
import { MAX_SCHEDULES_PER_CHAT, type ScheduleEntry, type ScheduleStore } from "../schedule/schedule.js";
import type { ChatMemoryStore, MemoryEntry } from "../infra/memory.js";
import type { QuotaTracker } from "../infra/quota.js";
import { lastSent, rememberSent } from "../messaging/state.js";
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
  /** 文案翻译助手：zh 原样返回；en 走字典/动态规则，未命中保持原文。 */
  const T = (text: string): string => tr(locale, text);

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
      const usage = ctx.quota ? await ctx.quota.usage() : null;
      const quotaText = usage
        ? (usage.limit > 0 ? T(`今日 ${usage.used}/${usage.limit}`) : T(`今日 ${usage.used}（不限）`))
        : T("未启用");
      const buffered = [...ctx.state.groupBuffer.values()].reduce((n, list) => n + list.length, 0);
      await reply([
        `${T("机器人")}: AppID ${config.appId}`,
        `${T("凭据")}: ${configured ? `${T("已配置")}（${config.credentialSource}）` : T("未配置，请在设置中扫码或填写 AppID/AppSecret")}`,
        `${T("工作区")}: ${config.workspacePath}`,
        `${T("收消息")}: ${counters.received} · ${T("会话回复")}: ${counters.replies} · ${T("主动消息")}: ${counters.proactive} · ${T("错误")}: ${counters.errors}`,
        `${T("主动消息配额")}: ${quotaText}`,
        `${T("群上下文缓冲")}: ${buffered} ${T("条")}`,
      ].join("\n"));
      return { handled: true };
    }

    case "/new": {
      const boundId = ctx.state.chatSession.get(chatKey);
      if (boundId) {
        ctx.state.recordBySession.delete(boundId);
        ctx.state.chatSession.delete(chatKey);
        await reply(T(`已解绑会话 ${boundId.slice(0, 8)}…，下一条消息开启全新会话。`));
      } else {
        await reply(T("当前聊天还没有绑定会话，下一条消息将创建新会话。"));
      }
      return { handled: true };
    }

    case "/session": {
      const boundId = ctx.state.chatSession.get(chatKey);
      await reply(boundId ? T(`当前绑定会话：${boundId}`) : T("当前聊天还没有绑定会话。"));
      return { handled: true };
    }

    case "/定时":
    case "/schedule":
    case "/定时消息": {
      const whenOf = (entry: ScheduleEntry): string =>
        entry.type === "daily"
          ? `${T("每天")} ${entry.time}`
          : `${T("每")} ${entry.minutes} ${T("分钟")}`;
      const describe = (entry: ScheduleEntry, index: number): string => {
        const failed = entry.lastError ? `${T("（上次失败：")}${entry.lastError}${T("）")}` : "";
        return `${index}. [${whenOf(entry)}] ${entry.content}${failed}`;
      };
      const sub = arg.split(/\s+/)[0] ?? "";
      const rest = arg.slice(sub.length).trim();

      // 查看
      if (!sub || sub === "查看" || sub === "list") {
        const mine = ctx.schedules.listForChat(scope, openid);
        await reply(mine.length === 0
          ? T(`当前聊天还没有定时消息。用法：/定时 每天 09:00 内容 或 /定时 间隔 30 内容（每聊天最多 ${MAX_SCHEDULES_PER_CHAT} 条）。`)
          : [T("当前定时消息："), ...mine.map(describe)].join("\n"));
        return { handled: true };
      }

      // 取消
      if (sub === "取消" || sub === "删除" || sub === "remove" || sub === "cancel") {
        const target = rest.trim();
        if (!target) {
          await reply(T("用法：/定时 取消 <序号>"));
          return { handled: true };
        }
        const result = await ctx.schedules.remove(scope, openid, target);
        await reply(result.ok ? T(`已删除：${describe(result.entry!, 0).slice(3)}`) : T(result.error ?? ""));
        return { handled: true };
      }

      // 每天 HH:mm 内容
      const daily = /^(?:每天|每日|daily)\s+(\d{1,2}:\d{2})\s*([\s\S]+)$/.exec(rest);
      if (daily) {
        const result = await ctx.schedules.add({
          scope, openid, type: "daily", time: daily[1], content: daily[2], createdBy: sender, appId: ctx.appId,
        });
        await reply(result.ok
          ? T(`已设置：每天 ${daily[1]} 发送「${daily[2].slice(0, 50)}」`)
          : T(result.error ?? ""));
        return { handled: true };
      }

      // 间隔 N 内容
      const interval = /^(?:间隔|每\s*(\d+)\s*分钟|interval)\s*(?:(\d+)\s*分钟?)?\s*([\s\S]+)$/.exec(rest);
      if (interval) {
        const minutes = Number(interval[1] ?? interval[2] ?? 0);
        const result = await ctx.schedules.add({
          scope, openid, type: "interval", minutes, content: interval[3], createdBy: sender, appId: ctx.appId,
        });
        await reply(result.ok
          ? T(`已设置：每 ${minutes} 分钟发送「${interval[3].slice(0, 50)}」`)
          : T(result.error ?? ""));
        return { handled: true };
      }

      await reply([
        T("定时消息用法（也可直接用自然语言让 AI 帮你设置）："),
        T("/定时 查看"),
        T("/定时 每天 09:00 记得喝水"),
        T("/定时 间隔 30 休息一下"),
        T(`/定时 取消 <序号>（每聊天最多 ${MAX_SCHEDULES_PER_CHAT} 条）`),
      ].join("\n"));
      return { handled: true };
    }

    case "/记忆":
    case "/memory": {
      if (!ctx.memory || !config.memoryEnabled) {
        await reply(T("长期记忆未启用（可在设置中开启）。"));
        return { handled: true };
      }
      const entries: MemoryEntry[] = await ctx.memory.load(chatKey);
      await reply(entries.length === 0
        ? T("本聊天还没有长期记忆。对话中让我「记住某事」即可自动写入。")
        : [T("本聊天的长期记忆："), ...entries.map((e, i) => `${i + 1}. ${e.text}`)].join("\n"));
      return { handled: true };
    }

    case "/清空记忆":
    case "/forget": {
      if (!ctx.memory || !config.memoryEnabled) {
        await reply(T("长期记忆未启用（可在设置中开启）。"));
        return { handled: true };
      }
      const removed = await ctx.memory.clear(chatKey);
      await reply(removed > 0 ? T(`已清空本聊天的 ${removed} 条长期记忆。`) : T("本聊天没有可清空的记忆。"));
      return { handled: true };
    }

    case "/撤回":
    case "/recall": {
      const targetId = lastSent(ctx.state, chatKey, 1);
      if (!targetId) {
        await reply(T("没有找到本机器人最近发出的消息（仅能撤回本次运行期间发送的）。"));
        return { handled: true };
      }
      try {
        await ctx.client.recall({ scope, openid }, targetId);
        await reply(T("已撤回最近一条消息。"));
      } catch (error) {
        await reply(T(`撤回失败：${error instanceof Error ? error.message : String(error)}`));
      }
      return { handled: true };
    }

    case "/广播":
    case "/broadcast": {
      if (!arg) {
        await reply(T("用法：/广播 <内容>（向本机器人已见过的所有群发送）"));
        return { handled: true };
      }
      const groups = [...ctx.state.groupBuffer.keys()];
      if (groups.length === 0) {
        await reply(T("本机器人还没有记录到任何群（收到群消息后才会加入广播范围）。"));
        return { handled: true };
      }
      let sent = 0;
      let skipped = 0;
      for (const group of groups) {
        if (ctx.quota && !(await ctx.quota.tryConsume())) {
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
      await reply(T(`广播完成：成功 ${sent} 个群${skipped > 0 ? `，跳过/失败 ${skipped} 个` : ""}。`));
      return { handled: true };
    }

    case "/stop": {
      const boundId = ctx.state.chatSession.get(chatKey);
      const agent = boundId ? ctx.agents.get(boundId) : undefined;
      if (!agent) {
        await reply(T("当前会话没有正在运行的任务。"));
        return { handled: true };
      }
      if (agent.status === "running") {
        agent.cancel({ kind: "user" }, { keepInbox: true });
        await reply(T("已请求停止当前任务。"));
      } else {
        await reply(T("当前会话空闲，没有需要停止的任务。"));
      }
      return { handled: true };
    }

    case "/steer": {
      if (!arg) {
        await reply(T("用法：/steer <补充指令>"));
        return { handled: true };
      }
      const boundId = ctx.state.chatSession.get(chatKey);
      const agent = boundId ? ctx.agents.get(boundId) : undefined;
      if (!agent || agent.status !== "running") {
        await reply(T("当前没有正在运行的任务；直接发送消息即可。"));
        return { handled: true };
      }
      agent.steer({
        id: newMessageId(),
        role: "user",
        content: [{ type: "text", text: arg }],
        source: { kind: "user" },
      });
      await reply(T("已向当前任务补充指令。"));
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
        await reply(current ? `${T("当前默认权限：")}\n\n${current}` : T("尚未设置默认权限。"));
      } else if (sub === "set") {
        if (!isAdmin) {
          await reply(T("只有权限管理员可以设置默认权限（permissionAdmins 已配置名单，仅名单内可改）。"));
          return { handled: true };
        }
        if (!rest) {
          await reply(T("用法：/perm set <对所有用户生效的权限内容>"));
          return { handled: true };
        }
        await writeDefault(ctx.appId, rest);
        await reply(T("已保存所有用户的默认权限，新对话将注入。"));
      } else if (sub === "clear") {
        if (!isAdmin) {
          await reply(T("只有权限管理员可以清除默认权限（permissionAdmins 已配置名单，仅名单内可改）。"));
          return { handled: true };
        }
        await reply(await clearDefault(ctx.appId) ? T("已清除默认权限。") : T("没有可清除的默认权限。"));
      } else {
        await reply(T("用法：/perm set <内容> | /perm view | /perm clear"));
      }
      return { handled: true };
    }

    default:
      // 以 / 开头视为命令意图：未知命令直接反馈，不进入 AI 会话。
      await reply(T(`未知命令 ${cmd}，输入 /help 查看可用命令。`));
      return { handled: true };
  }
}
