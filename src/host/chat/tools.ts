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
import type { BotRuntimeManager } from "../bots.js";
import type { ChatMemoryStore } from "../infra/memory.js";
import type { ScriptGenerator } from "../schedule/script-gen.js";
import type { BotState } from "../../shared/types.js";
import { assertLocalMediaPath, assertSafeMediaUrl, defaultAllowedRoots } from "../infra/net-guard.js";
import { sanitizeOutgoingText } from "../messaging/sanitize.js";

export interface QqbotToolsContext {
  /** 多机器人运行时：按会话反查来源机器人（各自独立的状态 / 客户端）。 */
  bots: BotRuntimeManager;
  store: ScheduleStore;
  /** AI 脚本生成器：tool 模式含 genPrompt 的任务保存后入队生成。 */
  scriptGen?: ScriptGenerator;
  /** 每聊天长期记忆（qqbot_memory_* 工具）。 */
  memory?: ChatMemoryStore;
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
          resultMode: entry.resultMode ?? "raw",
          ...(entry.tool ? { tool: entry.tool, args: entry.args ?? {} } : {}),
        }
      : { content: entry.content }),
    enabled: entry.enabled,
    nextRunAt: entry.nextRunAt ?? null,
    lastSentAt: entry.lastSentAt ?? null,
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

export function buildQqbotTools({ bots, store, scriptGen, memory, logger }: QqbotToolsContext): ToolDefinition[] {
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
        "执行方式：text（直接发送 content）、ai（把 content 当指令交给 AI 生成）、tool（到点执行一条命令并把结果推送给用户）。",
        "tool 模式即「生成工具 → 解析工具 → 执行 → 回传结果」：你需要自己写出完整可执行命令行（command），例如",
        '"python C:/scripts/report.py"、"powershell -File C:/scripts/check.ps1"、"C:/scripts/backup.bat"、"node C:/scripts/sync.mjs"；',
        "可用 cwd 指定工作目录；resultMode=raw 直接推送原始输出，resultMode=ai 则把输出交给 AI 整理成简洁播报后再推送（输出很长时推荐）。",
        `daily/interval 可附加 weekdays（0-6 数组，仅在该星期触发）。每个聊天的条数上限由机器人配置 scheduleMaxPerChat 决定（默认 ${MAX_SCHEDULES_PER_CHAT} 条，0 = 不限）；超限时先让用户删除旧任务。`,
        "用户说「每天九点提醒我…」「每 30 分钟发一次…」「每周一到周五早九点播报」「下周三下午三点提醒我开会」",
        "「每天早上跑一次那个 py 脚本把结果发我」时调用。"
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
          resultMode: {
            type: "string",
            enum: ["raw", "ai"],
            description: "tool 模式结果处理：raw=直接推送命令输出（默认）；ai=把输出交给 AI 整理成播报后推送"
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
          cwd?: string; resultMode?: string; tool?: string; args?: Record<string, unknown>;
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
          resultMode: a.resultMode,
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
  const runtime = ctx.get("tools", false) as
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
