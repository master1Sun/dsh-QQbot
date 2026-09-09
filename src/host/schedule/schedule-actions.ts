/**
 * 定时任务动作注册表（tool 模式的确定性动作）：send_message / send_image /
 * send_file / send_voice。动作不开 LLM，直接调用 BotRuntime 的发送 API 把
 * 内容送到目标聊天；媒体发送前过 SSRF / 本地路径白名单守卫。
 */
import type { BotRuntime } from "../bots.js";
import { sanitizeOutgoingText } from "../messaging/sanitize.js";
import { assertLocalMediaPath, assertSafeMediaUrl, defaultAllowedRoots } from "../infra/net-guard.js";

/** 定时动作的参数来源（url 或本机路径二选一）。 */
interface MediaSource {
  url?: string;
  localPath?: string;
}

interface ActionContext {
  bot: BotRuntime;
  scope: "group" | "c2c";
  openid: string;
  logger: Pick<Console, "info" | "warn" | "error">;
}

interface ActionArgSpec {
  key: string;
  type: "content" | "url" | "localPath" | "fileName";
  label: string;
  required?: boolean;
  placeholder?: string;
}

export interface ScheduledAction {
  id: string;
  label: string;
  description: string;
  args: ActionArgSpec[];
  execute(args: Record<string, unknown>, ctx: ActionContext): Promise<void>;
}

/** 媒体守卫：url 走 SSRF 检查，本地路径走白名单；被拒返回原因文案。 */
async function guardMedia(source: MediaSource, bot: BotRuntime, logger: Pick<Console, "info" | "warn" | "error">): Promise<string | null> {
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

function resolveSource(args: Record<string, unknown>): MediaSource | null {
  const url = typeof args.url === "string" && args.url.trim() ? args.url.trim() : void 0;
  const localPath = typeof args.localPath === "string" && args.localPath.trim() ? args.localPath.trim() : void 0;
  if (url) return { url };
  if (localPath) return { localPath };
  return null;
}

export const SCHEDULED_ACTIONS: ScheduledAction[] = [
  {
    id: "send_message",
    label: "发送文本",
    description: "向目标聊天发送一段固定文本（最常用，等价于 text 模式但经动作调用）。",
    args: [{ key: "content", type: "content", label: "文本内容", required: true, placeholder: "到点发送的文本" }],
    async execute(args, ctx) {
      const content = sanitizeOutgoingText(String(args.content ?? "").trim());
      if (!content) throw new Error("content 不能为空");
      await ctx.bot.client.sendText({ scope: ctx.scope, openid: ctx.openid }, content);
      ctx.logger.info(`[dsh-qqbot] 定时动作 send_message → ${ctx.scope}:${ctx.openid}`);
    },
  },
  {
    id: "send_image",
    label: "发送图片",
    description: "向目标聊天发送一张图片（url 或本机路径二选一）。",
    args: [
      { key: "url", type: "url", label: "图片 URL", placeholder: "公网可访问的图片地址" },
      { key: "localPath", type: "localPath", label: "本机路径", placeholder: "工作区目录内的图片路径" },
      { key: "content", type: "content", label: "随图文字", placeholder: "可省略" },
    ],
    async execute(args, ctx) {
      const source = resolveSource(args);
      if (!source) throw new Error("url 与 localPath 必须提供其一");
      const blocked = await guardMedia(source, ctx.bot, ctx.logger);
      if (blocked) throw new Error(blocked);
      await ctx.bot.client.sendImage(
        { scope: ctx.scope, openid: ctx.openid },
        source,
        { content: typeof args.content === "string" ? args.content : void 0 },
      );
      ctx.logger.info(`[dsh-qqbot] 定时动作 send_image → ${ctx.scope}:${ctx.openid}`);
    },
  },
  {
    id: "send_file",
    label: "发送文件",
    description: "向目标聊天发送一个文件（图片以外的任意富媒体，url 或本机路径二选一）。",
    args: [
      { key: "url", type: "url", label: "文件 URL", placeholder: "公网可访问的文件地址" },
      { key: "localPath", type: "localPath", label: "本机路径", placeholder: "工作区目录内的文件路径" },
      { key: "fileName", type: "fileName", label: "文件名", placeholder: "平台展示用，可省略" },
      { key: "content", type: "content", label: "随文件文字", placeholder: "可省略" },
    ],
    async execute(args, ctx) {
      const source = resolveSource(args);
      if (!source) throw new Error("url 与 localPath 必须提供其一");
      const blocked = await guardMedia(source, ctx.bot, ctx.logger);
      if (blocked) throw new Error(blocked);
      await ctx.bot.client.sendFile(
        { scope: ctx.scope, openid: ctx.openid },
        source,
        {
          fileName: typeof args.fileName === "string" ? args.fileName : void 0,
          content: typeof args.content === "string" ? args.content : void 0,
        },
      );
      ctx.logger.info(`[dsh-qqbot] 定时动作 send_file → ${ctx.scope}:${ctx.openid}`);
    },
  },
  {
    id: "send_voice",
    label: "发送语音",
    description: "向目标聊天发送一条语音消息（url 或本机路径二选一）。",
    args: [
      { key: "url", type: "url", label: "音频 URL", placeholder: "公网可访问的音频地址" },
      { key: "localPath", type: "localPath", label: "本机路径", placeholder: "工作区目录内的音频路径" },
    ],
    async execute(args, ctx) {
      const source = resolveSource(args);
      if (!source) throw new Error("url 与 localPath 必须提供其一");
      const blocked = await guardMedia(source, ctx.bot, ctx.logger);
      if (blocked) throw new Error(blocked);
      await ctx.bot.client.sendVoice({ scope: ctx.scope, openid: ctx.openid }, source);
      ctx.logger.info(`[dsh-qqbot] 定时动作 send_voice → ${ctx.scope}:${ctx.openid}`);
    },
  },
];

export const SCHEDULED_ACTION_IDS = SCHEDULED_ACTIONS.map((a) => a.id);

/** 按名称执行定时动作：先校验必填参数，再交由动作实现。 */
export async function runScheduledAction(
  tool: string,
  args: Record<string, unknown> | undefined,
  ctx: ActionContext,
): Promise<void> {
  const action = SCHEDULED_ACTIONS.find((a) => a.id === tool);
  if (!action) throw new Error(`未知定时动作 ${tool}`);
  for (const a of action.args) {
    if (a.required && (args?.[a.key] === void 0 || args?.[a.key] === "")) {
      throw new Error(`动作 ${action.id} 缺少必填参数 ${a.key}`);
    }
  }
  await action.execute(args ?? {}, ctx);
}
