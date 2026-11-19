/**
 * 频道 AI 自动回帖服务：
 *  - 新主题 / 新帖子 / 私域频道普通消息 → 在对应子频道 AI 回帖一次；
 *  - 评论 / 消息 @机器人 → 再回复一次。
 *
 * 事件来源：SDK 归一化的 AT_MESSAGE_CREATE 走 handleMessage；
 * MESSAGE_CREATE / FORUM_* 走 rawEvent → handleChannelMessage / handleForumEvent。
 * 所有失败吞掉并写日志，绝不影响消息链路。
 */
import type { BotRuntime } from "../bots.js";
import { generateGuildReply, type GuildReplyDeps } from "./engine.js";
import { GuildReplyStore, type GuildReplyConfig, type GuildReplyLog } from "./store.js";

export interface GuildInboundLike {
  guildId?: string;
  channelId?: string;
  messageId?: string;
  sender?: string;
  senderName?: string;
  content?: string;
  rawEventType?: string;
  isBot?: boolean;
  raw?: unknown;
}

const FORUM_POST_EVENTS = new Set(["FORUM_THREAD_CREATE", "FORUM_POST_CREATE"]);
const FORUM_MENTION_EVENTS = new Set(["FORUM_REPLY_CREATE"]);

/** 富文本（paragraphs/elems/text）→ 纯文本；普通文本原样返回。 */
function richTextToPlain(raw: unknown): string {
  if (typeof raw !== "string" || !raw.trim()) return "";
  const text = raw.trim();
  if (!text.startsWith("{") && !text.startsWith("[")) return text;
  const out: string[] = [];
  const re = /"text"\s*:\s*"((?:\\.|[^"\\])*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    try {
      const value = JSON.parse(`"${m[1]}"`) as unknown;
      if (typeof value === "string" && value.trim()) out.push(value.trim());
    } catch { /* 单段解析失败跳过 */ }
  }
  return out.join("\n").trim();
}

/** 富文本里是否 @了本机器人（拿不到 bot user id 时退化为「文本含 @」）。 */
function mentionsBot(raw: unknown, botUserId: string): boolean {
  const text = typeof raw === "string" ? raw : JSON.stringify(raw ?? "");
  if (!text) return false;
  if (botUserId) {
    if (text.includes(botUserId)) return true;
    const ids = [...text.matchAll(/<@!?(\d+)>/g)].map((m) => m[1]);
    if (ids.includes(botUserId)) return true;
    const users = [...text.matchAll(/"user_id"\s*:\s*"(\d+)"/g)].map((m) => m[1]);
    return users.includes(botUserId);
  }
  // SDK READY 尚未拿到 bot user id 时的兜底：只在文本里明确带 @ 才认为被点名。
  return text.includes("@") || /"mention"/i.test(text);
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export class GuildReplyService {
  readonly store = new GuildReplyStore();
  readonly #deps: GuildReplyDeps;
  readonly #logger: Pick<Console, "info" | "warn" | "error">;
  /** appId → 机器人在频道侧的 user id（READY.d.user.id），用于判断评论是否 @了本机器人。 */
  readonly #botUsers = new Map<string, string>();

  constructor(deps: GuildReplyDeps, logger: Pick<Console, "info" | "warn" | "error">) {
    this.#deps = deps;
    this.#logger = logger;
  }

  setBotUser(appId: string, userId: unknown): void {
    const id = str(userId);
    if (id && appId) this.#botUsers.set(appId, id);
  }

  /** 事件是否由本服务处理（index.ts 用来决定要不要走通用 rawEvent 管线）。 */
  static handles(eventType: string): boolean {
    return eventType === "MESSAGE_CREATE"
      || FORUM_POST_EVENTS.has(eventType)
      || FORUM_MENTION_EVENTS.has(eventType);
  }

  #allowed(cfg: GuildReplyConfig, channelId: string, sender: string): boolean {
    if (!cfg.enabled) return false;
    if (sender && cfg.whitelist.includes(sender)) return false;
    if (cfg.channelIds.length && channelId && !cfg.channelIds.includes(channelId)) return false;
    return true;
  }

  async #send(bot: BotRuntime, cfg: GuildReplyConfig, params: {
    guildId: string;
    channelId: string;
    trigger: "post" | "mention";
    source: string;
    key: string;
    sender: string;
    senderName: string;
    content: string;
    messageId?: string;
  }): Promise<void> {
    const { guildId, channelId, trigger, source, key, sender, senderName, content } = params;
    if (!guildId || !channelId || !content.trim()) return;
    if (!this.#allowed(cfg, channelId, sender)) return;
    if (trigger === "post" && !cfg.onPost) return;
    if (trigger === "mention" && !cfg.onMention) return;
    // once 只管「新帖回帖一次」；@评论按单条评论各回一次。
    if (trigger === "post" && cfg.once && await this.store.wasReplied(key)) return;

    let reply = "";
    try {
      reply = await generateGuildReply(this.#deps, bot.appId, cfg, { trigger, senderName, content });
    } catch (error) {
      this.#logger.warn("[guild-reply] 模型调用失败:", error instanceof Error ? error.message : error);
      await this.store.appendLog({
        at: new Date().toISOString(), appId: bot.appId, guildId, channelId, trigger, source, key,
        sender, senderName, content: content.slice(0, 500), reply: "", messageId: params.messageId ?? "",
        ok: false, error: error instanceof Error ? error.message : String(error),
      });
      return;
    }
    // 模型主动选择静默：不发送、不占位，允许后续新帖正常触发。
    if (!reply) return;

    let error = "";
    try {
      // @消息用 msg_id 走被动回复（5 分钟内有效，不占主动消息额度）；
      // 论坛事件拿不到事件 id（SDK rawEvent 未透传 payload.id），走主动子频道消息。
      await bot.client.sendChannelMessage(channelId, reply, params.messageId ? { msgId: params.messageId } : {});
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }

    if (trigger === "post" && cfg.once && !error) await this.store.markReplied(key, params.messageId ?? "");
    await this.store.appendLog({
      at: new Date().toISOString(), appId: bot.appId, guildId, channelId, trigger, source, key,
      sender, senderName, content: content.slice(0, 500), reply: reply.slice(0, 1000),
      messageId: params.messageId ?? "", ok: !error, error,
    });
    if (error) this.#logger.warn("[guild-reply] 发送失败:", error);
    else this.#logger.info(`[guild-reply] 已回帖：${guildId.slice(0, 8)}… / ${channelId.slice(0, 8)}… ${trigger}`);
  }

  /** SDK 归一化的频道消息（AT_MESSAGE_CREATE / MESSAGE_CREATE 经 rawEvent 转换后复用）。 */
  async handleMessage(bot: BotRuntime, message: GuildInboundLike): Promise<void> {
    const raw = asRecord(message.raw);
    const author = asRecord(raw.author);
    if (message.isBot === true || author.bot === true) return;
    const guildId = str(message.guildId) || str(raw.guild_id);
    const channelId = str(message.channelId) || str(raw.channel_id);
    const messageId = str(message.messageId) || str(raw.id);
    const sender = str(message.sender) || str(author.id);
    const senderName = str(message.senderName) || str(author.username);
    const content = str(message.content) || str(raw.content);
    const isAt = message.rawEventType === "AT_MESSAGE_CREATE" || mentionsBot(raw.content, this.#botUsers.get(bot.appId) ?? "");
    const trigger: "post" | "mention" = isAt ? "mention" : "post";
    let cfg: GuildReplyConfig;
    try { cfg = await this.store.getConfig(bot.appId, guildId); } catch { return; }
    if (!this.#allowed(cfg, channelId, sender)) return;
    const key = `${guildId}:${channelId}:${trigger}:${messageId || `${sender}:${content.slice(0, 40)}`}`;
    await this.#send(bot, cfg, {
      guildId, channelId, trigger, source: "message", key, sender, senderName, content, messageId,
    });
  }

  /** 私域 MESSAGE_CREATE 原始事件（SDK 未归一化为 message）。 */
  async handleChannelMessage(bot: BotRuntime, data: unknown): Promise<void> {
    const raw = asRecord(data);
    await this.handleMessage(bot, {
      guildId: str(raw.guild_id),
      channelId: str(raw.channel_id),
      messageId: str(raw.id),
      sender: str(asRecord(raw.author).id),
      senderName: str(asRecord(raw.author).username),
      content: str(raw.content),
      rawEventType: "MESSAGE_CREATE",
      raw,
    });
  }

  /** 论坛事件：新主题/新帖回帖一次，评论 @机器人再回复。 */
  async handleForumEvent(bot: BotRuntime, eventType: string, data: unknown): Promise<void> {
    const raw = asRecord(data);
    const guildId = str(raw.guild_id);
    const channelId = str(raw.channel_id);
    const sender = str(raw.author_id);
    const trigger: "post" | "mention" = FORUM_MENTION_EVENTS.has(eventType) ? "mention" : "post";
    const info = asRecord(
      eventType === "FORUM_THREAD_CREATE" ? raw.thread_info
        : eventType === "FORUM_POST_CREATE" ? raw.post_info
          : raw.reply_info,
    );
    const source = eventType === "FORUM_THREAD_CREATE" ? "forum_thread"
      : eventType === "FORUM_POST_CREATE" ? "forum_post" : "forum_reply";
    const threadId = str(info.thread_id);
    const postId = str(info.post_id);
    const replyId = str(info.reply_id);
    const rich = info.title && info.content ? `${info.title}\n${info.content}` : (info.content ?? info.title ?? "");
    const content = richTextToPlain(rich);
    const botUserId = this.#botUsers.get(bot.appId) ?? "";
    if (trigger === "mention" && !mentionsBot(rich, botUserId)) return;

    let cfg: GuildReplyConfig;
    try { cfg = await this.store.getConfig(bot.appId, guildId); } catch { return; }
    if (!this.#allowed(cfg, channelId, sender)) return;

    const key = trigger === "post"
      ? `${guildId}:${channelId}:thread:${threadId || postId || replyId || content.slice(0, 40)}`
      : `${guildId}:${channelId}:thread:${threadId}:mention:${replyId || postId || content.slice(0, 40)}`;
    const label = trigger === "mention" ? "评论" : "新帖";
    await this.#send(bot, cfg, {
      guildId, channelId, trigger, source, key, sender,
      senderName: sender.slice(0, 10),
      content: content ? `${label}：${content}` : "",
    });
  }
}

/** 日志展示用：把任意值安全转字符串（客户端不依赖）。 */
export const guildReplyLogText = (log: GuildReplyLog): string =>
  `[${log.trigger}] ${log.senderName || log.sender} → ${log.ok ? log.reply : `失败：${log.error}`}`;
