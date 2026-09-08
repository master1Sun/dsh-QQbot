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
import { MAX_SCHEDULES_PER_CHAT, ScheduleStore, type ScheduleEntry } from "./schedule.js";
import type { BotRuntimeManager } from "./bots.js";
import type { ChatMemoryStore } from "./memory.js";
import type { BotState } from "../shared/types.js";

export interface QqbotToolsContext {
  /** 多机器人运行时：按会话反查来源机器人（各自独立的状态 / 客户端）。 */
  bots: BotRuntimeManager;
  store: ScheduleStore;
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
    ...(entry.type === "daily" ? { time: entry.time } : { minutes: entry.minutes }),
    content: entry.content,
    enabled: entry.enabled,
    nextRunAt: entry.nextRunAt ?? null,
    lastSentAt: entry.lastSentAt ?? null,
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

export function buildQqbotTools({ bots, store, memory, logger }: QqbotToolsContext): ToolDefinition[] {
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
        const { scope, openid } = requireBot(exec);
        const mine = store.listForChat(scope, openid);
        return {
          ok: true,
          chat: `${scope}:${openid}`,
          max: MAX_SCHEDULES_PER_CHAT,
          count: mine.length,
          schedules: mine.map(describeEntry),
        };
      },
    },
    {
      name: "qqbot_schedule_add",
      description: [
        "为当前 QQ 聊天添加一条定时主动消息（由来源机器人发送）。",
        "两种类型：daily（每天固定 HH:mm 发送一次，需提供 time）；interval（每 N 分钟循环发送，需提供 minutes，最小 5）。",
        "每个聊天最多 5 条。用户说「每天九点提醒我…」「每 30 分钟发一次…」时调用。",
      ].join(" "),
      parameters: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["daily", "interval"], description: "定时类型" },
          time: { type: "string", description: "daily 时的发送时间，格式 HH:mm（本地时区），如 09:30" },
          minutes: { type: "number", description: "interval 时的间隔分钟数（>=5）" },
          content: { type: "string", description: "mode=text 时为要发送的消息内容；mode=ai 时为交给 AI 的生成指令（如「总结这个群昨天聊了什么」）" },
          mode: { type: "string", enum: ["text", "ai"], description: "text=到点直接发送 content；ai=到点由 AI 按 content 生成内容后回复（默认 text）" },
        },
        required: ["type", "content"],
        additionalProperties: false,
      },
      output: OBJECT_OUTPUT,
      async execute(args: unknown, exec: ToolRunContext) {
        const { appId, scope, openid } = requireBot(exec);
        const a = args as { type?: string; time?: string; minutes?: number; content?: string; mode?: string };
        const result = await store.add({
          scope,
          openid,
          type: a.type ?? "",
          time: a.time,
          minutes: a.minutes,
          content: a.content ?? "",
          appId,
          mode: a.mode,
        });
        if (!result.ok) return { ok: false, error: result.error };
        const mine = store.listForChat(scope, openid);
        logger.info(`[dsh-qqbot] AI 添加定时消息 → ${scope}:${openid}（机器人 ${appId}）`);
        return {
          ok: true,
          chat: `${scope}:${openid}`,
          schedule: describeEntry(result.entry, mine.indexOf(result.entry) + 1),
          remaining: MAX_SCHEDULES_PER_CHAT - mine.length,
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
        return { ok: true, removed: describeEntry(result.entry, index) };
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
        const content = String((args as { content?: unknown }).content ?? "").trim();
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
        "来源三选一：url（公网可访问的图片地址）/ localPath（本机路径）/ buffer 不可用。",
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
        await bot.client.sendImage({ scope, openid }, source, { content: a.content });
        bot.state.counters.proactive += 1;
        logger.info(`[dsh-qqbot] AI 发送图片（机器人 ${appId}）→ ${scope}:${openid}`);
        return { ok: true, sent: true };
      },
    },
    {
      name: "qqbot_memory_add",
      description: "向当前 QQ 聊天的长期记忆写入一条事实（跨会话保留，如「这个群在准备 10 月的团建」）。用户说「记住…」时调用。",
      parameters: {
        type: "object",
        properties: {
          text: { type: "string", description: "要记住的事实（一句话，200 字内）" },
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
