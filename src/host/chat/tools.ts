/**
 * QQ 机器人会话工具：把定时消息与主动发送暴露给 DSH Agent，
 * 让用户直接用自然语言「每天九点提醒我喝水」时由 AI 调用完成。
 *
 * 工具通过 exec.agent.id（= 会话 id）反查绑定的 QQ 聊天与来源机器人，
 * 因此 AI 在哪个群/单聊里被调用，操作的就是哪个聊天的定时消息、由哪个机器人发送。
 *
 * 注册为全局工具（ctx.tools.register）；未绑定聊天的会话调用会收到明确错误。
 */
import type { Context } from "@deepseek-ai/cordis";
import type { ContentBlock } from "@deepseek-ai/dsh-llm";
import type { JsonValue } from "@deepseek-ai/dsh-util-values";
import type { JsonSchemaNode, ToolDefinition, ToolOutputDefinition, ToolRunContext } from "@deepseek-ai/dsh-tools";
import { MAX_SCHEDULES_PER_CHAT, ScheduleStore, type ScheduleEntry } from "../schedule/schedule.js";
import type { BotRuntimeManager, BotRuntime } from "../bots.js";
import type { ChatMemoryStore } from "../infra/memory.js";
import type { ScriptGenerator } from "../schedule/script-gen.js";
import type { BotState } from "../../shared/types.js";
import { assertLocalMediaPath, assertSafeMediaUrl, defaultAllowedRoots } from "../infra/net-guard.js";
import { sanitizeOutgoingText } from "../messaging/sanitize.js";
import { saveArchivedMedia, saveArchivedLocalMedia, mediaModeAllows, maxBytesFor } from "../infra/archive-media.js";
import type { AiOpsService } from "../ai-ops/service.js";
import type { AiEntity, AiScope } from "../ai-ops/catalog.js";
import { describeApi, findApiEntries, matchExecutableApi, type ApiMethod } from "../ai-ops/api-catalog.js";

export interface QqbotToolsContext {
  /** 多机器人运行时：按会话反查来源机器人（各自独立的状态 / 客户端）。 */
  bots: BotRuntimeManager;
  store: ScheduleStore;
  /** AI 脚本生成器：tool 模式含 genPrompt 的任务保存后入队生成。 */
  scriptGen?: ScriptGenerator;
  /** 每聊天长期记忆（qqbot_memory_* 工具）。 */
  memory?: ChatMemoryStore;
  /** AI 操作助手：让 agent 在聊天里直接说人话操作群 / 频道。 */
  aiOps?: AiOpsService;
  logger: Pick<Console, "info" | "warn" | "error">;
}

/** sessionId → 绑定的聊天键（群/单聊）。 */
function resolveChat(state: BotState, sessionId: string): { scope: "group" | "c2c"; openid: string } | null {
  for (const [chatKey, boundId] of state.chatSession) {
    if (boundId !== sessionId) continue;
    const [scope, openid] = chatKey.split(":", 2);
    if (scope === "group" || scope === "c2c") return { scope, openid };
  }
  return null;
}

function describeEntry(entry: ScheduleEntry, index: number): Record<string, unknown> {
  return {
    index,
    id: entry.id,
    type: entry.type,
    mode: entry.mode ?? "text",
    ...(entry.type === "daily" ? { time: entry.time } : {}),
    ...(entry.type === "interval" ? { minutes: entry.minutes } : {}),
    ...(entry.type === "cron" ? { cron: entry.cron, tz: entry.tz } : {}),
    ...(entry.type === "at" ? { at: entry.at } : {}),
    ...(entry.weekdays?.length ? { weekdays: entry.weekdays } : {}),
    ...(entry.mode === "tool"
      ? {
          command: entry.command ?? "",
          ...(entry.cwd ? { cwd: entry.cwd } : {}),
          ...(entry.timeoutMs ? { timeoutMs: entry.timeoutMs } : {}),
          ...(entry.env ? { env: entry.env } : {}),
          resultMode: entry.resultMode ?? "raw",
          ...(entry.parsePrompt ? { parsePrompt: entry.parsePrompt } : {}),
          gate: entry.gate ?? "always",
          ...(entry.tool ? { tool: entry.tool, args: entry.args ?? {} } : {}),
        }
      : { content: entry.content }),
    // 任务契约（ai / tool 两种模式通用）。
    ...(entry.mode === "ai" || entry.mode === "tool"
      ? {
          ...(entry.goal ? { goal: entry.goal } : {}),
          ...(entry.notifyWhen ? { notifyWhen: entry.notifyWhen } : {}),
          verify: entry.verify === true,
        }
      : {}),
    enabled: entry.enabled,
    nextRunAt: entry.nextRunAt ?? null,
    lastSentAt: entry.lastSentAt ?? null,
    ...(entry.lastSkipAt ? { lastSkipAt: entry.lastSkipAt, lastSkipReason: entry.lastSkipReason ?? "" } : {}),
    lastError: entry.lastError ?? null,
  };
}

function textResult(value: unknown): ContentBlock[] {
  return [{ type: "text", text: JSON.stringify(value) }] as ContentBlock[];
}

/** 四个工具共用的输出契约：值为任意 JSON 对象，渲染为一段文本。 */
const OBJECT_OUTPUT: ToolOutputDefinition = {
  schema: { type: "object" } as JsonSchemaNode,
  render: (_args: unknown, value: JsonValue) => textResult(value),
};

/** 媒体来源安全校验：URL 过 SSRF 防护，本地路径过白名单；不通过返回错误消息。 */
async function guardMediaSource(
  source: { url?: string; localPath?: string },
  bot: { config: { ssrfGuard: boolean; localPathWhitelist: boolean; workspacePath: string } },
  logger: Pick<Console, "warn">,
): Promise<string | null> {
  try {
    if (source.url) {
      await assertSafeMediaUrl(source.url, { ssrfGuard: bot.config.ssrfGuard, logger });
    }
    if (source.localPath) {
      await assertLocalMediaPath(source.localPath, {
        localPathWhitelist: bot.config.localPathWhitelist,
        allowedRoots: defaultAllowedRoots(bot.config.workspacePath),
        logger,
      });
    }
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

export function buildQqbotTools({ bots, store, scriptGen, memory, aiOps, logger }: QqbotToolsContext): ToolDefinition[] {
  /**
   * 归档一条「机器人主动发出的媒体」（图片 / 视频 / 文件）。
   *
   * 媒体先落地成本地副本（平台的发送结果不回传可长期访问的地址），再写入
   * 归档记录，前端归档弹窗才能显示出站媒体的缩略图。
   * 未开启归档媒体保存（archiveMedia=off）或落地失败时只跳过 media，
   * 不影响发送本身。
   */
  const archiveOutboundMedia = async (
    bot: BotRuntime,
    scope: "group" | "c2c",
    openid: string,
    source: { url?: string; localPath?: string },
    kind: "image" | "video" | "file",
    content?: string,
  ): Promise<void> => {
    const mode = bot.config.archiveMedia ?? "off";
    if (!mediaModeAllows(mode, kind)) return;
    const media = source.url
      ? await saveArchivedMedia(source.url, { kind, logger, maxBytes: maxBytesFor(kind, bot.config) })
      : source.localPath
        ? await saveArchivedLocalMedia(source.localPath, { kind, logger, maxBytes: maxBytesFor(kind, bot.config) })
        : null;
    if (!media) return;
    await bot.archiver.append({
      kind: "proactive",
      chat: `${scope}:${openid}`,
      content: content ?? "",
      note: kind,
      media: [media],
    });
  };

  /** 按会话反查来源机器人；未绑定聊天时抛出模型可读的错误。 */
  const requireBot = (exec: { agent?: { id?: unknown } }): {
    appId: string;
    state: BotState;
    scope: "group" | "c2c";
    openid: string;
  } => {
    const sessionId = typeof exec.agent?.id === "string" ? exec.agent.id : "";
    const bot = sessionId ? bots.findBySession(sessionId) : undefined;
    if (!bot) {
      throw new Error("当前会话没有绑定 QQ 聊天：请用户先在 QQ 群/单聊里给机器人发一条消息后再试。");
    }
    const chat = resolveChat(bot.state, sessionId);
    if (!chat) {
      throw new Error("当前会话绑定的 QQ 聊天已失效：请用户在群里重新发一条消息。");
    }
    return { appId: bot.appId, state: bot.state, ...chat };
  };

  /** 聊天里没有设置页那种「已加载成员表」，这里按当前聊天上下文自动拉一份极简实体表。 */
  const loadAiEntities = async (
    bot: BotRuntime, scope: AiScope, groupOpenid: string, guildId: string,
  ): Promise<AiEntity[]> => {
    const out: AiEntity[] = [];
    const nameOf = (v: unknown): string => (typeof v === "string" || typeof v === "number" ? String(v) : "");
    try {
      if (scope === "group") {
        const { members } = await bot.client.listGroupMembers(groupOpenid, "");
        for (const m of members.slice(0, 300)) {
          const row = m as unknown as Record<string, unknown>;
          const id = nameOf(row.member_openid ?? row.openid ?? row.user_openid);
          if (!id) continue;
          out.push({ id, name: nameOf(row.username ?? row.nickname ?? row.nick) || id, kind: "member" });
        }
      } else if (guildId) {
        const [chRes, roleRes, memRes] = await Promise.allSettled([
          bot.client.listGuildChannels(guildId),
          bot.client.listGuildRoles(guildId),
          bot.client.listGuildMembers(guildId, { limit: 100 }),
        ]);
        if (chRes.status === "fulfilled" && Array.isArray(chRes.value)) {
          for (const c of chRes.value as Array<Record<string, unknown>>) {
            const id = nameOf(c.id);
            if (id) out.push({ id, name: nameOf(c.name) || id, kind: "channel" });
          }
        }
        if (roleRes.status === "fulfilled" && Array.isArray(roleRes.value)) {
          for (const r of roleRes.value as Array<Record<string, unknown>>) {
            const id = nameOf(r.id ?? r.role_id);
            if (id) out.push({ id, name: nameOf(r.name) || id, kind: "role" });
          }
        }
        if (memRes.status === "fulfilled" && Array.isArray(memRes.value.members)) {
          for (const m of (memRes.value.members as Array<Record<string, unknown>>).slice(0, 300)) {
            const user = (m.user && typeof m.user === "object" ? m.user : {}) as Record<string, unknown>;
            const id = nameOf(user.id ?? m.member_openid);
            if (!id) continue;
            out.push({ id, name: nameOf(user.username ?? m.nick) || id, kind: "member" });
          }
        }
      }
    } catch (error) {
      logger.warn("[dsh-qqbot] AI 操作实体表加载失败，改用 ID 解析:", error instanceof Error ? error.message : error);
    }
    return out;
  };

  return [
    {
      name: "qqbot_schedule_list",
      description: "列出当前 QQ 聊天（群/单聊）的全部定时主动消息。当用户想查看定时消息/提醒列表时调用。",
      parameters: { type: "object", properties: {}, additionalProperties: false },
      output: OBJECT_OUTPUT,
      async execute(_args: unknown, exec: ToolRunContext) {
        const { scope, openid, appId } = requireBot(exec);
        const mine = store.listForChat(scope, openid);
        return {
          ok: true,
          chat: `${scope}:${openid}`,
          max: store.maxPerChat(appId),
          count: mine.length,
          schedules: mine.map(describeEntry),
        };
      },
    },
    {
      name: "qqbot_schedule_add",
      description: [
        "为当前 QQ 聊天添加一条定时主动任务（由来源机器人发送）。",
        "定时类型：daily（每天 HH:mm）、interval（每 N 分钟，>=5）、cron（标准 5 段表达式，可带时区）、at（一次性绝对时间，到点后自动删除）。",
        "执行方式：text（直接发送 content）、ai（把 content 当任务指令，到点由 AI 自主取数、加工并决定是否发送）、tool（到点执行一条命令并按加工/门控规则推送结果）。",
        "tool 模式是一条「取数 → 加工 → 门控 → 投递」的流水线：你需要自己写出完整可执行命令行（command），例如",
        '"python C:/scripts/report.py"、"powershell -File C:/scripts/check.ps1"、"C:/scripts/backup.bat"、"node C:/scripts/sync.mjs"；',
        "可用 cwd 指定工作目录；resultMode=raw 直接推送原始输出，resultMode=ai 则先按 parsePrompt（未填则用内置的「简洁播报」要求）整理后再推送。",
        "gate 决定本次「值不值得发」：always（默认，总是发）、nonempty（没有实质产出就跳过）、changed（与上次内容一致就跳过）；被拦下时不投递、不消耗主动消息配额。",
        "ai 模式适合「内容每次都要现算」的任务（如每天汇总群聊重点、按条件播报）：到点它会自己调用工具取数加工，若判断无事可报会自动静默不发。",
        "任务契约（ai/tool 可用）把「什么时候该发」交给语义判断：goal 说明任务目标、notifyWhen 用自然语言写明通知条件（如「只有涨幅超过 5% 才提醒」），不满足时本次静默不发、不占配额；verify=true 则在投递前再做一次自校验。",
        `daily/interval 可附加 weekdays（0-6 数组，仅在该星期触发）。每个聊天的条数上限由机器人配置 scheduleMaxPerChat 决定（默认 ${MAX_SCHEDULES_PER_CHAT} 条，0 = 不限）；超限时先让用户删除旧任务。`,
        "用户说「每天九点提醒我…」「每 30 分钟发一次…」「每周一到周五早九点播报」「下周三下午三点提醒我开会」",
        "「每天早上跑一次那个 py 脚本，只把异常行发我」（→ tool + gate=nonempty，或 resultMode=ai 配 parsePrompt 筛选）时调用。"
      ].join(" "),
      parameters: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["daily", "interval", "cron", "at"], description: "定时类型" },
          time: { type: "string", description: "daily 时的发送时间，格式 HH:mm（上海时间），如 09:30" },
          minutes: { type: "number", description: "interval 时的间隔分钟数（>=5）" },
          cron: { type: "string", description: 'cron 类型时的 5 段表达式，如 "0 9 * * 1-5"' },
          tz: { type: "string", description: "cron/at 的时区（IANA，如 Asia/Shanghai / America/New_York），默认 Asia/Shanghai" },
          at: { type: "string", description: "at 类型时的 ISO 时间（如 2026-09-10T09:00:00+08:00）" },
          weekdays: { type: "array", items: { type: "number" }, description: "daily/interval 的星期过滤（0=周日..6=周六）" },
          content: { type: "string", description: "text/ai 模式的内容（tool 模式可省略）" },
          mode: { type: "string", enum: ["text", "ai", "tool"], description: "执行方式（默认 text）" },
          command: {
            type: "string",
            description: 'tool 模式要执行的完整命令行，如 "python C:/scripts/report.py" / "powershell -File C:/scripts/check.ps1" / "C:/scripts/backup.bat"。与 genPrompt 二选一'
          },
          genPrompt: {
            type: "string",
            description: "AI 脚本描述词：填写任务目标（如「抓取某网页价格写入 csv」），保存后由系统后台让 AI 生成脚本落盘并自动回填命令。生成期间任务不执行，生成完成后按计划执行（过点不补跑）"
          },
          cwd: { type: "string", description: "tool 模式命令的工作目录（可选）" },
          timeoutMs: {
            type: "number",
            description: "tool 模式：命令执行超时毫秒数（下限 1000，上限 600000，默认 120000）。报表/爬取类慢脚本可调大"
          },
          env: {
            type: "object",
            description: "tool 模式：追加到命令进程的环境变量（键值均为字符串），如 {\"API_KEY\":\"xxx\"}；避免把敏感值写进命令行"
          },
          resultMode: {
            type: "string",
            enum: ["raw", "ai"],
            description: "tool 模式结果处理：raw=直接推送命令输出（默认）；ai=按 parsePrompt 把输出加工成播报后推送"
          },
          parsePrompt: {
            type: "string",
            description: "数据加工指令（tool + resultMode=ai 时用）：规定把命令输出整理成什么样，如「只保留涨幅超过 5% 的，每行一条」「压缩成一句话摘要」。留空则用内置的简洁播报要求"
          },
          gate: {
            type: "string",
            enum: ["always", "nonempty", "changed"],
            description: "发送门控（tool 模式）：always=总是发送（默认）；nonempty=命令没有实质输出时跳过；changed=与上次发送内容一致时跳过。跳过不投递、不消耗主动消息配额"
          },
          goal: {
            type: "string",
            description: "任务契约·目标（ai/tool 模式）：这条任务服务于什么判断，供 AI 分诊时理解意图，如「盯住竞品价格波动」"
          },
          notifyWhen: {
            type: "string",
            description: "任务契约·通知条件（ai/tool 模式，自然语言）：满足什么才值得发送，如「只有涨幅超过 5%、或出现异常时才提醒」。不满足时本次静默不发、不占配额"
          },
          verify: {
            type: "boolean",
            description: "任务契约·发送前自校验（ai/tool 模式）：开启后投递前复核草稿是否满足契约，不达标则不发送（tool 模式为独立模型二次复核，ai 模式为强化自查）"
          },
          tool: { type: "string", description: "@deprecated 旧版动作 id，已由 command 取代" },
          args: { type: "object", description: "@deprecated 旧版动作参数，已由 command 取代" }
        },
        required: ["type"],
        additionalProperties: false,
      },
      output: OBJECT_OUTPUT,
      async execute(args: unknown, exec: ToolRunContext) {
        const { appId, scope, openid } = requireBot(exec);
        const a = args as {
          type?: string; time?: string; minutes?: number; cron?: string; tz?: string; at?: string;
          weekdays?: unknown; content?: string; mode?: string; command?: string; genPrompt?: string;
          cwd?: string; timeoutMs?: number; env?: Record<string, string>;
          resultMode?: string; parsePrompt?: string; gate?: string;
          goal?: string; notifyWhen?: string; verify?: boolean;
          tool?: string; args?: Record<string, unknown>;
        };
        const result = await store.add({
          scope,
          openid,
          type: a.type ?? "",
          time: a.time,
          minutes: a.minutes,
          cron: a.cron,
          tz: a.tz,
          at: a.at,
          weekdays: a.weekdays,
          content: a.content,
          command: a.command,
          genPrompt: a.genPrompt,
          cwd: a.cwd,
          timeoutMs: a.timeoutMs,
          env: a.env,
          resultMode: a.resultMode,
          parsePrompt: a.parsePrompt,
          gate: a.gate,
          goal: a.goal,
          notifyWhen: a.notifyWhen,
          verify: a.verify,
          tool: a.tool,
          args: a.args,
          appId,
          mode: a.mode,
        });
        if (!result.ok) return { ok: false, error: result.error };
        if (result.entry?.genStatus === "pending") scriptGen?.enqueue(result.entry);
        const mine = store.listForChat(scope, openid);
        logger.info(`[dsh-qqbot] AI 添加定时任务 → ${scope}:${openid}（机器人 ${appId}）`);
        return {
          ok: true,
          chat: `${scope}:${openid}`,
          schedule: describeEntry(result.entry!, mine.indexOf(result.entry!) + 1),
          // 0 = 不限：剩余额度无意义，回传 null
          remaining: store.maxPerChat(appId) > 0 ? store.maxPerChat(appId) - mine.length : null,
        };
      },
    },
    {
      name: "qqbot_schedule_remove",
      description: "删除当前 QQ 聊天的一条定时主动消息（按 qqbot_schedule_list 返回的序号）。",
      parameters: {
        type: "object",
        properties: {
          index: { type: "number", description: "要删除的序号（1 开始）" },
        },
        required: ["index"],
        additionalProperties: false,
      },
      output: OBJECT_OUTPUT,
      async execute(args: unknown, exec: ToolRunContext) {
        const { scope, openid } = requireBot(exec);
        const index = Number((args as { index?: unknown }).index);
        if (!Number.isSafeInteger(index) || index < 1) {
          return { ok: false, error: "index 必须是正整数序号" };
        }
        const result = await store.remove(scope, openid, String(index));
        if (!result.ok) return { ok: false, error: result.error };
        return { ok: true, removed: describeEntry(result.entry!, index) };
      },
    },
    {
      name: "qqbot_schedule_set",
      description: "启用或禁用当前 QQ 聊天的一条定时主动消息（按 qqbot_schedule_list 返回的序号）。禁用后该任务不再执行（不发送、不占主动消息配额），可随时重新启用；重新启用后从当前时刻重算下次运行，不补跑禁用期间的任务。",
      parameters: {
        type: "object",
        properties: {
          index: { type: "number", description: "要修改的序号（1 开始，见 qqbot_schedule_list）" },
          enabled: { type: "boolean", description: "true=启用（恢复执行）；false=禁用（暂停执行）" }
        },
        required: ["index", "enabled"],
        additionalProperties: false,
      },
      output: OBJECT_OUTPUT,
      async execute(args: unknown, exec: ToolRunContext) {
        const { appId, scope, openid } = requireBot(exec);
        const a = args as { index?: unknown; enabled?: unknown };
        const index = Number(a.index);
        if (!Number.isSafeInteger(index) || index < 1) {
          return { ok: false, error: "index 必须是正整数序号" };
        }
        if (typeof a.enabled !== "boolean") {
          return { ok: false, error: "enabled 必须是布尔值（true=启用 / false=禁用）" };
        }
        const mine = store.listForChat(scope, openid);
        const target = mine[index - 1];
        if (!target) return { ok: false, error: `未找到该定时消息（序号 1-${mine.length}）` };
        const result = await store.setEnabled(target.id, a.enabled);
        if (!result.ok) return { ok: false, error: result.error };
        logger.info(`[dsh-qqbot] AI ${a.enabled ? "启用" : "禁用"}定时任务 → ${scope}:${openid}（机器人 ${appId}）`);
        return { ok: true, schedule: describeEntry(result.entry!, index) };
      },
    },
    {
      name: "qqbot_schedule_update",
      description: [
        "就地修改当前 QQ 聊天里已存在的一条定时任务（按 qqbot_schedule_list 返回的序号）。",
        "只传需要改动的字段，未传的字段保持原值——不必先删除再重建。",
        "改触发时间时，传与 type 对应的字段：daily 传 time；interval 传 minutes；cron 传 cron（可加 tz）；at 传 at。",
        "若要切换触发类型，必须同时传 type 与新类型对应的字段。",
        "改执行方式时传 mode（text/ai/tool）；切换 mode 后请同时补齐对应的 content / command / genPrompt。",
        "weekdays 传空数组 [] 表示清除星期过滤。",
        "用户说「把那条提醒从九点改成十点」「第二条改成每 30 分钟」「把每天的改成只有工作日」时调用。"
      ].join(" "),
      parameters: {
        type: "object",
        properties: {
          index: { type: "number", description: "要修改的序号（1 开始，见 qqbot_schedule_list）" },
          type: { type: "string", enum: ["daily", "interval", "cron", "at"], description: "新的触发类型（不切换则省略）" },
          time: { type: "string", description: "daily 的发送时间 HH:mm（上海时间）" },
          minutes: { type: "number", description: "interval 的间隔分钟数（>=5）" },
          cron: { type: "string", description: 'cron 的 5 段表达式，如 "0 9 * * 1-5"' },
          tz: { type: "string", description: "cron 的时区（IANA），默认 Asia/Shanghai" },
          at: { type: "string", description: "at 的 ISO 时间（必须晚于当前时刻）" },
          weekdays: {
            type: "array",
            items: { type: "number" },
            description: "daily/interval 的星期过滤（0=周日..6=周六）；传 [] 清除过滤"
          },
          content: { type: "string", description: "text/ai 模式的新内容" },
          mode: { type: "string", enum: ["text", "ai", "tool"], description: "新的执行方式" },
          command: { type: "string", description: "tool 模式的新命令行" },
          genPrompt: { type: "string", description: "tool 模式：改填 AI 脚本描述词（会触发重新生成脚本）" },
          cwd: { type: "string", description: "tool 模式的工作目录" },
          timeoutMs: { type: "number", description: "tool 模式的命令执行超时毫秒数（1000-600000）" },
          env: { type: "object", description: "tool 模式的命令环境变量（键值均为字符串）" },
          resultMode: { type: "string", enum: ["raw", "ai"], description: "tool 模式的结果处理方式" },
          parsePrompt: { type: "string", description: "tool+resultMode=ai 的数据加工指令" },
          gate: { type: "string", enum: ["always", "nonempty", "changed"], description: "tool 模式的发送门控" },
          goal: { type: "string", description: "任务契约·目标（ai/tool）" },
          notifyWhen: { type: "string", description: "任务契约·通知条件（ai/tool）" },
          verify: { type: "boolean", description: "任务契约·发送前自校验（ai/tool）" }
        },
        required: ["index"],
        additionalProperties: false,
      },
      output: OBJECT_OUTPUT,
      async execute(args: unknown, exec: ToolRunContext) {
        const { appId, scope, openid } = requireBot(exec);
        const a = args as Record<string, unknown>;
        const index = Number(a.index);
        if (!Number.isSafeInteger(index) || index < 1) {
          return { ok: false, error: "index 必须是正整数序号" };
        }
        const mine = store.listForChat(scope, openid);
        const target = mine[index - 1];
        if (!target) return { ok: false, error: `未找到该定时消息（序号 1-${mine.length}）` };
        // 仅透传显式给出的字段（undefined 交给 Store.add 保留原值）。
        const patch: Record<string, unknown> = { id: target.id };
        for (const key of [
          "type", "time", "minutes", "cron", "tz", "at", "weekdays",
          "content", "mode", "command", "genPrompt", "cwd", "timeoutMs", "env",
          "resultMode", "parsePrompt", "gate", "goal", "notifyWhen", "verify",
        ] as const) {
          if (a[key] !== undefined) patch[key] = a[key];
        }
        const result = await store.update(target.id, patch);
        if (!result.ok) return { ok: false, error: result.error };
        if (result.entry?.genStatus === "pending") scriptGen?.enqueue(result.entry);
        logger.info(`[dsh-qqbot] AI 修改定时任务 #${index} → ${scope}:${openid}（机器人 ${appId}）`);
        return { ok: true, chat: `${scope}:${openid}`, schedule: describeEntry(result.entry!, index) };
      },
    },
    {
      name: "qqbot_send_message",
      description: "立即向当前 QQ 聊天（群/单聊）主动发送一条文本消息（用来源机器人的凭据）。注意：主动消息配额有限，仅在用户明确要求发送时使用。",
      parameters: {
        type: "object",
        properties: {
          content: { type: "string", description: "要发送的文本内容" },
        },
        required: ["content"],
        additionalProperties: false,
      },
      output: OBJECT_OUTPUT,
      async execute(args: unknown, exec: ToolRunContext) {
        const { appId, state, scope, openid } = requireBot(exec);
        const bot = bots.get(appId);
        if (!bot) return { ok: false, error: "来源机器人已不可用" };
        const content = sanitizeOutgoingText(String((args as { content?: unknown }).content ?? "").trim());
        if (!content) return { ok: false, error: "content 不能为空" };
        await bot.client.sendText({ scope, openid }, content);
        state.counters.proactive += 1;
        logger.info(`[dsh-qqbot] AI 主动发送消息（机器人 ${appId}）→ ${scope}:${openid}`);
        return { ok: true, sent: true };
      },
    },
    {
      name: "qqbot_send_image",
      description: [
        "立即向当前 QQ 聊天（群/单聊）发送一张图片。",
        "来源三选一：url（公网可访问的图片地址）/ localPath（本机路径，须在工作区目录内）/ buffer 不可用。",
        "注意：走富媒体上传通道，配额有限，仅在用户明确要求发图时使用。",
      ].join(" "),
      parameters: {
        type: "object",
        properties: {
          url: { type: "string", description: "图片 URL（与 localPath 二选一）" },
          localPath: { type: "string", description: "本机图片路径（与 url 二选一）" },
          content: { type: "string", description: "随图说明文字（可省略）" },
        },
        additionalProperties: false,
      },
      output: OBJECT_OUTPUT,
      async execute(args: unknown, exec: ToolRunContext) {
        const { appId, scope, openid } = requireBot(exec);
        const bot = bots.get(appId);
        if (!bot) return { ok: false, error: "来源机器人已不可用" };
        const a = args as { url?: string; localPath?: string; content?: string };
        const source = a.url ? { url: a.url } : a.localPath ? { localPath: a.localPath } : null;
        if (!source) return { ok: false, error: "url 与 localPath 必须提供其一" };
        const blocked = await guardMediaSource(source, bot, logger);
        if (blocked) return { ok: false, error: blocked };
        await bot.client.sendImage({ scope, openid }, source, { content: a.content });
        bot.state.counters.proactive += 1;
        logger.info(`[dsh-qqbot] AI 发送图片（机器人 ${appId}）→ ${scope}:${openid}`);
        // 归档：把发出的图片落地保存，设置页的归档弹窗才能显示缩略图。
        void archiveOutboundMedia(bot, scope, openid, source, "image", a.content);
        return { ok: true, sent: true };
      },
    },
    {
      name: "qqbot_send_file",
      description: [
        "立即向当前 QQ 聊天（群/单聊）发送一个文件（图片以外的任意富媒体）。",
        "来源二选一：url（公网可访问的文件地址）/ localPath（本机路径）。",
        "注意：走富媒体上传通道，配额有限，仅在用户明确要求发送文件时使用。",
      ].join(" "),
      parameters: {
        type: "object",
        properties: {
          url: { type: "string", description: "文件 URL（与 localPath 二选一）" },
          localPath: { type: "string", description: "本机文件路径（与 url 二选一）" },
          fileName: { type: "string", description: "文件名（平台展示用，可省略）" },
          content: { type: "string", description: "随文件说明文字（可省略）" },
        },
        additionalProperties: false,
      },
      output: OBJECT_OUTPUT,
      async execute(args: unknown, exec: ToolRunContext) {
        const { appId, scope, openid } = requireBot(exec);
        const bot = bots.get(appId);
        if (!bot) return { ok: false, error: "来源机器人已不可用" };
        const a = args as { url?: string; localPath?: string; fileName?: string; content?: string };
        const source = a.url ? { url: a.url } : a.localPath ? { localPath: a.localPath } : null;
        if (!source) return { ok: false, error: "url 与 localPath 必须提供其一" };
        const blocked = await guardMediaSource(source, bot, logger);
        if (blocked) return { ok: false, error: blocked };
        await bot.client.sendFile({ scope, openid }, source, { fileName: a.fileName, content: a.content });
        bot.state.counters.proactive += 1;
        logger.info(`[dsh-qqbot] AI 发送文件（机器人 ${appId}）→ ${scope}:${openid}`);
        // 归档：文件落地保存（受「归档媒体保存」设置控制）。
        void archiveOutboundMedia(bot, scope, openid, source, "file", a.content);
        return { ok: true, sent: true };
      },
    },
    {
      name: "qqbot_send_voice",
      description: [
        "立即向当前 QQ 聊天（群/单聊）发送一条语音消息。",
        "来源二选一：url（公网可访问的音频地址）/ localPath（本机音频路径）。",
        "仅在用户明确要求发送语音时使用。",
      ].join(" "),
      parameters: {
        type: "object",
        properties: {
          url: { type: "string", description: "音频 URL（与 localPath 二选一）" },
          localPath: { type: "string", description: "本机音频路径（与 url 二选一）" },
        },
        additionalProperties: false,
      },
      output: OBJECT_OUTPUT,
      async execute(args: unknown, exec: ToolRunContext) {
        const { appId, scope, openid } = requireBot(exec);
        const bot = bots.get(appId);
        if (!bot) return { ok: false, error: "来源机器人已不可用" };
        const a = args as { url?: string; localPath?: string };
        const source = a.url ? { url: a.url } : a.localPath ? { localPath: a.localPath } : null;
        if (!source) return { ok: false, error: "url 与 localPath 必须提供其一" };
        const blocked = await guardMediaSource(source, bot, logger);
        if (blocked) return { ok: false, error: blocked };
        await bot.client.sendVoice({ scope, openid }, source);
        bot.state.counters.proactive += 1;
        logger.info(`[dsh-qqbot] AI 发送语音（机器人 ${appId}）→ ${scope}:${openid}`);
        return { ok: true, sent: true };
      },
    },
    {
      name: "qqbot_request_approval",
      description: [
        "在执行敏感/不可逆操作（执行命令、删除、对外发送、大额变更等）之前，向当前 QQ 聊天发送一条带「✅允许 / ❌拒绝」按钮的审批消息，并阻塞等待用户点击。",
        "返回 decision：allow=用户允许；deny=用户拒绝；timeout=超时未点击（视为拒绝）。",
        "用户点击后你会收到结果，再根据结果决定是否继续执行操作。被拒绝时不要重试同一操作。",
        "注意：审批消息占用主动消息配额，仅对真正高风险的操作使用；普通回复不需要审批。",
      ].join(" "),
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "要审批的操作，一句话说清（如「执行命令 rm -rf C:/tmp/cache」）" },
          description: { type: "string", description: "操作说明/影响范围（可省略）" },
          timeoutSeconds: { type: "number", description: "等待时长（秒，10-600，默认 120）" },
        },
        required: ["title"],
        additionalProperties: false,
      },
      output: OBJECT_OUTPUT,
      async execute(args: unknown, exec: ToolRunContext) {
        const bot = (() => {
          const sessionId = typeof exec.agent?.id === "string" ? exec.agent.id : "";
          return sessionId ? bots.findBySession(sessionId) : undefined;
        })();
        if (!bot) return { ok: false, error: "当前会话没有绑定 QQ 聊天，无法请求审批" };
        const chat = resolveChat(bot.state, String(exec.agent?.id ?? ""));
        if (!chat) return { ok: false, error: "当前会话绑定的 QQ 聊天已失效，无法请求审批" };
        if (!bot.config.approvalButtons) {
          return { ok: false, error: "按钮审批未开启（设置页「按钮审批」开关），请直接向用户文字确认" };
        }
        const a = args as { title?: string; description?: string; timeoutSeconds?: number };
        const title = String(a.title ?? "").trim();
        if (!title) return { ok: false, error: "title 不能为空" };
        const decision = await bot.approvals.request({ scope: chat.scope, openid: chat.openid }, {
          title,
          description: a.description ? String(a.description) : undefined,
          timeoutSeconds: a.timeoutSeconds,
        });
        bot.state.counters.proactive += 1;
        logger.info(`[dsh-qqbot] AI 审批请求「${title.slice(0, 40)}」→ ${decision}（机器人 ${bot.appId}）`);
        return { ok: true, decision, approved: decision === "allow" };
      },
    },
    {
      name: "qqbot_manage",
      description: [
        "在用户直接要求管理当前 QQ 群 / 频道时调用：禁言或解除成员、移出群、拉黑、查看或审批入群申请、发消息、开关 AI 群规审核 / 入群审批 / 频道 AI 接管 / 自动回帖、查看子频道与成员、创建或删除子频道、全员禁言、撤回消息等。",
        "把用户的原话原样放进 instruction，工具会在当前会话绑定的聊天上下文里执行，并把执行结果返回给用户。绝大多数指令本地解析、不额外调用模型；设置页「执行记录」Tab 会同步留痕。官方 OpenAPI 用法可查 qqbot_api_help，白名单接口可用 qqbot_api_call 执行。",
      ].join(" "),
      parameters: {
        type: "object",
        properties: {
          instruction: { type: "string", description: "用户要求操作的原话，例如：禁言张三 10 分钟 / 开启AI群规审核" },
          guildId: { type: "string", description: "频道操作时指定频道 ID；群聊操作留空" },
          channelId: { type: "string", description: "频道发消息 / 撤回消息时指定子频道 ID" },
          entities: {
            type: "array",
            description: "可选：当前对话里提到的成员 / 子频道 / 身份组 {id,name,kind}；留空时工具会自动从当前群/频道拉取",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                kind: { type: "string", enum: ["member", "channel", "role"] },
              },
              required: ["id", "name", "kind"],
              additionalProperties: false,
            },
          },
        },
        required: ["instruction"],
        additionalProperties: false,
      },
      output: OBJECT_OUTPUT,
      async execute(args: unknown, exec: ToolRunContext) {
        if (!aiOps) throw new Error("AI 操作助手服务不可用，请重启 dsh web 后再试。");
        const a = (args ?? {}) as {
          instruction?: unknown; guildId?: unknown; channelId?: unknown; entities?: unknown;
        };
        const instruction = typeof a.instruction === "string" ? a.instruction.trim() : "";
        if (!instruction) throw new Error("instruction 必填：请传入用户要求操作的原话。");
        const chat = requireBot(exec);
        const guildId = typeof a.guildId === "string" ? a.guildId.trim() : "";
        if (chat.scope !== "group" && !guildId) {
          throw new Error("当前是单聊会话，没有可管理的群。请在 QQ 群里对话，或在 guildId 里指定频道。");
        }
        const scope: AiScope = guildId ? "guild" : "group";
        let entities: AiEntity[] = Array.isArray(a.entities)
          ? a.entities.flatMap((row) => {
              if (!row || typeof row !== "object") return [];
              const r = row as Record<string, unknown>;
              const id = typeof r.id === "string" ? r.id : "";
              const name = typeof r.name === "string" ? r.name : id;
              const kind = r.kind === "channel" || r.kind === "role" ? r.kind : "member";
              return id ? [{ id, name, kind }] : [];
            })
          : [];
        // 只读/开关类指令不需要昵称解析，跳过实体表拉取，少打一次 OpenAPI。
        const needsEntities = /禁言|解除|移出|拉黑|黑名单|通过|拒绝|审批|删除|删掉|撤回|发送|创建/.test(instruction);
        if (needsEntities && !entities.length) {
          const bot = bots.get(chat.appId);
          if (bot) entities = await loadAiEntities(bot, scope, chat.scope === "group" ? chat.openid : "", guildId);
        }
        const out = await aiOps.chat({
          appId: chat.appId,
          scope,
          text: instruction,
          groupOpenid: scope === "group" ? chat.openid : "",
          guildId,
          channelId: typeof a.channelId === "string" ? a.channelId.trim() : "",
          entities,
        });
        return {
          ok: out.ok,
          reply: out.reply,
          source: out.source,
          action: out.action?.a ?? "",
          usedLlm: out.usedLlm,
          chat: scope === "group" ? `group:${chat.openid}` : `guild:${guildId}`,
        };
      },
    },
    {
      name: "qqbot_api_help",
      description: [
        "按需查询本插件已接入的 QQ 官方 OpenAPI 用法（HTTP 方法 / 路径 / 参数 / 权限限制），覆盖频道与群聊两个场景。",
        "仅当用户明确要求某个官方接口、或 qqbot_manage 覆盖不了时才调用；不要一次拉全量。可用 qqbot_api_call 执行白名单内的接口。",
      ].join(" "),
      parameters: {
        type: "object",
        properties: {
          scope: { type: "string", enum: ["guild", "group"], description: "场景：guild=频道，group=群聊；默认根据当前会话判断" },
          keyword: { type: "string", description: "接口关键词，如 身份组 / pins / threads / 禁言 / 黑名单 / panels；留空返回精简清单" },
          limit: { type: "number", description: "最多返回几条（1-48，默认 12）" },
        },
        additionalProperties: false,
      },
      output: OBJECT_OUTPUT,
      async execute(args: unknown, exec: ToolRunContext) {
        const a = (args ?? {}) as { scope?: unknown; keyword?: unknown; limit?: unknown };
        const keyword = typeof a.keyword === "string" ? a.keyword.trim().slice(0, 60) : "";
        const limit = typeof a.limit === "number" ? a.limit : 12;
        // scope 显式指定优先；否则按当前会话（群聊会话→group，其余→guild）
        let scope = a.scope === "group" || a.scope === "guild" ? a.scope : "";
        if (!scope) {
          try { scope = requireBot(exec).scope === "group" ? "group" : "guild"; } catch { scope = "guild"; }
        }
        const rows = findApiEntries(keyword, limit, scope);
        return {
          ok: true,
          scope,
          count: rows.length,
          hint: scope === "group"
            ? "路径里的 {group_openid} 由 qqbot_api_call 从当前会话自动填充；{member_openid} 等从 params 填充。"
            : "路径里的 {guild_id} / {channel_id} 等由 qqbot_api_call 从 guildId、channelId、params 自动填充。",
          apis: rows.map(describeApi),
        };
      },
    },
    {
      name: "qqbot_api_call",
      description: [
        "执行白名单内的 QQ 官方 OpenAPI（先 qqbot_api_help 查用法）：频道场景可操作身份组/消息/精华/日程/帖子/权限；群聊场景可操作群资料/成员/禁言/入群审批/黑名单/消息/面板。",
        "只允许本插件已接入的接口；路径占位符从 scope 对应的上下文与 params 填充，禁止手拼其它路径。群聊的 {group_openid} 自动取当前会话。写操作立即生效，用户明确要求再调用。",
      ].join(" "),
      parameters: {
        type: "object",
        properties: {
          scope: { type: "string", enum: ["guild", "group"], description: "场景：guild=频道，group=群聊；默认根据当前会话判断" },
          method: { type: "string", enum: ["GET", "POST", "PUT", "PATCH", "DELETE"], description: "HTTP 方法" },
          path: { type: "string", description: "qqbot_api_help 返回的官方路径模板" },
          guildId: { type: "string", description: "频道 ID；{guild_id} 占位符由它填充" },
          channelId: { type: "string", description: "子频道 ID；{channel_id} 占位符由它填充" },
          params: { type: "object", description: "其余路径占位符，如 {user_id,role_id,message_id,strategy_id,panel_id,member_openid}" },
          query: { type: "object", description: "URL 查询参数，如 {limit:20,cursor:\"xxx\"}" },
          body: { type: "object", description: "请求体 JSON（POST / PUT / PATCH）" },
        },
        required: ["method", "path"],
        additionalProperties: false,
      },
      output: OBJECT_OUTPUT,
      async execute(args: unknown, exec: ToolRunContext) {
        const a = (args ?? {}) as Record<string, unknown>;
        const method = typeof a.method === "string" ? a.method.toUpperCase() : "";
        const inputPath = typeof a.path === "string" ? a.path.trim() : "";
        const chat = requireBot(exec);
        // scope 显式指定优先；否则按当前会话（群聊→group，其余→guild）
        let scope = a.scope === "group" || a.scope === "guild" ? a.scope : "";
        if (!scope) scope = chat.scope === "group" ? "group" : "guild";
        const matched = matchExecutableApi(method, inputPath, scope);
        if (!matched) throw new Error(`接口不在${scope === "group" ? "群聊" : "频道"}白名单：${method} ${inputPath}。请先调用 qqbot_api_help 查看支持的接口。`);
        const template = matched.entry[1];
        const guildId = typeof a.guildId === "string" ? a.guildId.trim() : matched.values.guild_id ?? "";
        const channelId = typeof a.channelId === "string" ? a.channelId.trim() : matched.values.channel_id ?? "";
        if (template.includes("{guild_id}") && !guildId) throw new Error("该接口需要 guildId（频道 ID）。");
        if (template.includes("{channel_id}") && !channelId) throw new Error("该接口需要 channelId（子频道 ID）。");
        const bot = bots.get(chat.appId);
        if (!bot) throw new Error("机器人运行时不可用，请稍后重试。");
        const params = (a.params && typeof a.params === "object" ? a.params : {}) as Record<string, unknown>;
        const placeholders: Record<string, string> = {
          ...matched.values,
          guild_id: guildId,
          channel_id: channelId,
          // 群聊场景：当前会话的群 openid 自动填充
          group_openid: chat.scope === "group" ? chat.openid : "",
        };
        for (const [key, value] of Object.entries(params)) {
          if (typeof value === "string" || typeof value === "number") placeholders[key] = String(value).trim();
        }
        const path = template.replace(/\{([a-z_]+)\}/g, (_m, key: string) => {
          const value = placeholders[key] ?? "";
          if (!/^[A-Za-z0-9_-]{1,128}$/.test(value)) {
            throw new Error(`路径参数 ${key} 缺失或非法（只允许字母、数字、_、-）。${key === "group_openid" ? "当前会话不是群聊，请在 QQ 群里对话。" : ""}`);
          }
          return value;
        });
        const query = (a.query && typeof a.query === "object" ? a.query : {}) as Record<string, string | number | boolean>;
        const raw = await bot.client.request(method as ApiMethod, path, a.body, query);
        const json = JSON.stringify(raw);
        return {
          ok: true,
          scope,
          method,
          path,
          truncated: json.length > 4000,
          data: json.length > 4000 ? `${json.slice(0, 4000)}…（结果已截断）` : raw,
        };
      },
    },
    {
      name: "qqbot_memory_add",
      description:
        "向当前 QQ 聊天的长期记忆写入一条重要事实（跨会话保留）。只记关键对话内容：身份、偏好、约定、进行中的事项；不要闲聊、不要 emoji 或任何符号装饰、不要「【标签】」前缀，直接写内容本身。用户说「记住…」时调用。",
      parameters: {
        type: "object",
        properties: {
          text: { type: "string", description: "要记住的重要内容（一句话，200 字内；纯文本，不带 emoji 和装饰符号）" },
        },
        required: ["text"],
        additionalProperties: false,
      },
      output: OBJECT_OUTPUT,
      async execute(args: unknown, exec: ToolRunContext) {
        const { scope, openid } = requireBot(exec);
        if (!memory) return { ok: false, error: "长期记忆未启用" };
        const text = String((args as { text?: unknown }).text ?? "").trim();
        if (!text) return { ok: false, error: "text 不能为空" };
        const ok = await memory.add(`${scope}:${openid}`, text);
        return ok ? { ok: true, saved: text } : { ok: false, error: "写入失败（内容为空）" };
      },
    },
    {
      name: "qqbot_memory_list",
      description: "列出当前 QQ 聊天的全部长期记忆。用户问「你还记得什么」时调用。",
      parameters: { type: "object", properties: {}, additionalProperties: false },
      output: OBJECT_OUTPUT,
      async execute(_args: unknown, exec: ToolRunContext) {
        const { scope, openid } = requireBot(exec);
        if (!memory) return { ok: false, error: "长期记忆未启用" };
        const entries = await memory.load(`${scope}:${openid}`);
        return { ok: true, chat: `${scope}:${openid}`, count: entries.length, memories: entries };
      },
    },
    {
      name: "qqbot_memory_clear",
      description: "清空当前 QQ 聊天的全部长期记忆。用户明确要求遗忘/清空记忆时调用。",
      parameters: { type: "object", properties: {}, additionalProperties: false },
      output: OBJECT_OUTPUT,
      async execute(_args: unknown, exec: ToolRunContext) {
        const { scope, openid } = requireBot(exec);
        if (!memory) return { ok: false, error: "长期记忆未启用" };
        const removed = await memory.clear(`${scope}:${openid}`);
        return { ok: true, removed };
      },
    },
  ];
}

/** 把工具注册到 host（全局）；返回卸载函数。 */
export function registerQqbotTools(ctx: Context, deps: QqbotToolsContext): () => void {
  // 旧版 cordis 没有 ctx.get，此时直接视为「服务不可用」，而不是抛 TypeError。
  const runtime = (typeof ctx.get === "function" ? ctx.get("tools", false) : undefined) as
    | { register(definition: ToolDefinition): () => void }
    | undefined;
  if (!runtime || typeof runtime.register !== "function") {
    deps.logger.warn("[dsh-qqbot] ctx.tools 不可用，AI 定时工具未注册（聊天命令仍可用）");
    return () => {};
  }
  const disposers: Array<() => void> = [];
  for (const definition of buildQqbotTools(deps)) {
    try {
      disposers.push(runtime.register(definition));
    } catch (error) {
      deps.logger.warn(`[dsh-qqbot] 工具 ${definition.name} 注册失败:`, error);
    }
  }
  return () => {
    for (const dispose of disposers) {
      try {
        dispose();
      } catch {
        /* 忽略重复卸载 */
      }
    }
  };
}
