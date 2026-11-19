/**
 * 频道违规词自动处置服务：新帖 / 发言 → 本地违规词子串匹配 → 禁言违规者本人 + 删除违规内容 → 日志。
 *
 * 与「频道 AI 接管」（LLM 语义判定）独立：这里零模型调用、命中即处置，适合明确的违规违法字样。
 * 所有动作失败都被吞掉并记进日志，绝不影响消息链路其它部分。
 *
 * 事件来源（index.ts 接入）：
 *  - onGuildMessage（SDK 归一化的 AT_MESSAGE_CREATE / MESSAGE_CREATE）→ reviewMessage
 *  - onRawEvent MESSAGE_CREATE → reviewMessage（私域全量消息）
 *  - onRawEvent FORUM_THREAD_CREATE / FORUM_POST_CREATE / FORUM_REPLY_CREATE → reviewForum
 *
 * 删除能力边界（QQ 官方）：
 *  - 普通子频道消息：DELETE /channels/{channel_id}/messages/{message_id}（撤回）
 *  - 论坛主题帖：DELETE /channels/{channel_id}/threads/{thread_id}（仅私域；无需 forum_id）
 *  - 单条评论/回复：官方无删除接口，只能删整个主题帖（默认关闭，避免误删他人回复）
 */
import type { BotRuntime } from "../bots.js";
import {
  GuildKeywordStore, type GuildKeywordConfig, type GuildKeywordLog,
} from "./store.js";

const asRecord = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : {};
const str = (v: unknown): string => (typeof v === "string" ? v : v == null ? "" : String(v));

/** 富文本（paragraphs/elems/text）→ 纯文本；普通文本原样返回。与 guild-reply 的实现一致。 */
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
  return out.join(" ");
}

/** 违规词表命中：子串匹配，忽略大小写；返回命中的词（最多 5 个展示）。 */
function matchWords(content: string, words: string[]): string[] {
  if (!content) return [];
  const low = content.toLowerCase();
  const hit: string[] = [];
  for (const w of words) {
    const word = w.trim().toLowerCase();
    if (word && low.includes(word)) hit.push(w.trim());
    if (hit.length >= 5) break;
  }
  return hit;
}

export interface KeywordReviewParams {
  bot: BotRuntime;
  guildId: string;
  channelId: string;
  /** 普通消息=messageId；论坛=thread_id（用于删帖）。 */
  targetId: string;
  /** message / forum_thread / forum_post / forum_reply。 */
  source: string;
  sender: string;
  senderName: string;
  content: string;
  /** 论坛回复命中时，其所在主题帖 id（删整帖用）。 */
  threadId?: string;
}

export class GuildKeywordService {
  readonly store = new GuildKeywordStore();
  readonly #logger: Pick<Console, "info" | "warn" | "error">;
  /** 去重：同一事件 SDK 可能重复推送；key = appId:targetId:source。 */
  readonly #seen = new Map<string, number>();
  static readonly SEEN_TTL = 10_000;

  constructor(logger: Pick<Console, "info" | "warn" | "error">) {
    this.#logger = logger;
  }

  #dedupe(key: string): boolean {
    if (!key) return false;
    const now = Date.now();
    for (const [k, at] of this.#seen) if (now - at > GuildKeywordService.SEEN_TTL) this.#seen.delete(k);
    if (this.#seen.has(key)) return true;
    this.#seen.set(key, now);
    return false;
  }

  /** 统一处置入口。命中返回 true，未命中/未开启/去重返回 false。 */
  async review(params: KeywordReviewParams): Promise<boolean> {
    const { bot, guildId, channelId, targetId, source, sender, senderName, content } = params;
    if (!guildId || !content.trim()) return false;

    let cfg: GuildKeywordConfig;
    try { cfg = await this.store.getConfig(bot.appId, guildId); } catch { return false; }
    if (!cfg.enabled || !cfg.words.length) return false;
    if (sender && cfg.whitelist.includes(sender)) return false;
    if (cfg.channelIds.length && channelId && !cfg.channelIds.includes(channelId)) return false;
    if (this.#dedupe(`${bot.appId}:${source}:${targetId || `${guildId}:${sender}:${content.slice(0, 40)}`}`)) return false;

    const matched = matchWords(content, cfg.words);
    if (!matched.length) return false;

    const log: GuildKeywordLog = {
      at: new Date().toISOString(),
      appId: bot.appId, guildId, channelId,
      targetId, source, sender, senderName,
      content: content.slice(0, 500),
      matched, actions: [], errors: [],
      muteMinutes: cfg.muteMinutes,
    };

    // 动作 1：删除违规内容（普通消息撤回 / 论坛主题帖删除）。
    if (cfg.deleteContent) {
      if (source === "message" && channelId && targetId) {
        try {
          await bot.client.deleteGuildMessage(channelId, targetId, true);
          log.actions.push("delete");
        } catch (error) {
          log.errors.push(`delete: ${error instanceof Error ? error.message : String(error)}`);
        }
      } else if (source === "forum_thread" && channelId && targetId) {
        try {
          await bot.client.deleteGuildForumThread(channelId, targetId);
          log.actions.push("delete_thread");
        } catch (error) {
          log.errors.push(`delete_thread: ${error instanceof Error ? error.message : String(error)}`);
        }
      } else if ((source === "forum_post" || source === "forum_reply")) {
        const threadId = params.threadId || "";
        if (cfg.deleteThreadOnReply && channelId && threadId) {
          try {
            await bot.client.deleteGuildForumThread(channelId, threadId);
            log.actions.push("delete_thread");
          } catch (error) {
            log.errors.push(`delete_thread: ${error instanceof Error ? error.message : String(error)}`);
          }
        } else {
          log.errors.push("delete: 官方无删除单条评论接口（未开启删整帖）");
        }
      }
    }

    // 动作 2：禁言违规者本人。
    if (cfg.muteMinutes > 0 && sender) {
      try {
        await bot.client.muteGuildMember(guildId, sender, cfg.muteMinutes);
        log.actions.push("mute");
      } catch (error) {
        log.errors.push(`mute: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    try { await this.store.appendLog(log); }
    catch (error) { this.#logger.warn("[guild-keyword] 日志落盘失败:", error instanceof Error ? error.message : error); }

    this.#logger.info(
      `[guild-keyword] 命中：频道 ${guildId.slice(0, 8)}… ${source} `
      + `${senderName || sender.slice(0, 8)} → [${matched.join(",")}]`
      + ` 动作 [${log.actions.join(",") || "无"}]`
      + (log.errors.length ? ` 失败 [${log.errors.join("; ")}]` : ""),
    );
    return true;
  }

  /** SDK 归一化的频道消息（AT_MESSAGE_CREATE 等）。 */
  async reviewMessage(bot: BotRuntime, message: {
    guildId?: string; channelId?: string; messageId?: string;
    senderId?: string; senderName?: string; content?: string; raw?: unknown;
  }): Promise<void> {
    const raw = asRecord(message.raw);
    const author = asRecord(raw.author);
    if (author.bot === true) return;
    await this.review({
      bot,
      guildId: str(message.guildId) || str(raw.guild_id),
      channelId: str(message.channelId) || str(raw.channel_id),
      targetId: str(message.messageId) || str(raw.id),
      source: "message",
      sender: str(message.senderId) || str(author.id),
      senderName: str(message.senderName) || str(author.username),
      content: str(message.content) || str(raw.content),
    });
  }

  /** 私域 MESSAGE_CREATE 原始事件。 */
  async reviewChannelMessage(bot: BotRuntime, data: unknown): Promise<void> {
    const raw = asRecord(data);
    const author = asRecord(raw.author);
    if (author.bot === true) return;
    await this.review({
      bot,
      guildId: str(raw.guild_id),
      channelId: str(raw.channel_id),
      targetId: str(raw.id),
      source: "message",
      sender: str(author.id),
      senderName: str(author.username) || str(author.member_nickname),
      content: str(raw.content),
    });
  }

  /** 论坛事件：新帖 / 评论 / 回复。 */
  async reviewForum(bot: BotRuntime, eventType: string, data: unknown): Promise<void> {
    const raw = asRecord(data);
    const guildId = str(raw.guild_id);
    const channelId = str(raw.channel_id);
    const sender = str(raw.author_id);
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
    await this.review({
      bot, guildId, channelId,
      targetId: source === "forum_thread" ? threadId : (postId || replyId || threadId),
      source, sender, senderName: sender.slice(0, 10), content,
      threadId: source === "forum_thread" ? "" : threadId,
    });
  }

  /** 事件类型是否由本服务处理（论坛三类）。 */
  static handlesForum(eventType: string): boolean {
    return eventType === "FORUM_THREAD_CREATE"
      || eventType === "FORUM_POST_CREATE"
      || eventType === "FORUM_REPLY_CREATE";
  }
}
