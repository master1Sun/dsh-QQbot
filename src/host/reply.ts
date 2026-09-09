/**
 * 回复泵：监听 session/event，把助手回复发回「来源机器人」对应的 QQ 聊天。
 *
 * 流程：
 *  1. `user/message`（source.kind === "webhook"）→ 用 deliveryId 找到来源机器人，
 *     在其独立状态里绑定 QQ 回复目标与 DSH 会话（含聊天键复用绑定）；
 *  2. `assistant/message` → 按 (会话, turn) 收集文本；
 *  3. `turn/end` → 按该机器人的配置分片，优先 Markdown、被拒逐片回退纯文本。
 *
 * 被动回复失败时，按该机器人的配置可选改用主动消息重发（配额极少，默认关闭）。
 */
import type { BotRuntime, BotRuntimeManager } from "./bots.js";
import { PASSIVE_REPLY_LIMIT } from "./qq/api.js";
import type { Outbox } from "./outbox.js";
import type { QuotaTracker } from "./quota.js";
import {
  appendAssistantText,
  assistantTextOf,
  bindSession,
  chunkReply,
  rememberSent,
  sessionIdOf,
  takeTurnText,
  webhookDeliveryIdOf,
} from "./state.js";

export interface ReplyPumpContext {
  /** 多机器人运行时：按来源把回复路由到对应机器人的状态与客户端。 */
  bots: BotRuntimeManager;
  /** 投递出箱：发送失败时把剩余内容入箱重投（可靠性）。 */
  outbox?: Outbox;
  /** 主动消息每日配额（合成事件回复 / 主动兜底消耗）。 */
  quota?: QuotaTracker;
  logger: Pick<Console, "info" | "warn" | "error">;
}

type SessionBus = {
  on(event: string, listener: (session: unknown, event: { type: string; data?: unknown }) => void): unknown;
  off(event: string, listener: (session: unknown, event: { type: string; data?: unknown }) => void): unknown;
};

export function installReplyPump(ctx: unknown, { bots, outbox, quota, logger }: ReplyPumpContext): () => void {
  const bus = ctx as SessionBus;

  const send = async (bot: BotRuntime, sessionId: string, text: string) => {
    const config = bot.config;
    const record = bot.state.recordBySession.get(sessionId);
    if (!record) return;
    const limit = Math.min(config.maxRepliesPerMessage, PASSIVE_REPLY_LIMIT[record.target.scope]);
    // 原生引用卡片：仅群聊生效——单聊（C2C）一律不引用；群聊再按 quoteReply 门控
    // （off=不引用；at=仅群 @ 回复，避免群全量刷屏；all=群聊全部回复都引用）。
    // 引用卡片由 QQ 的 message_reference 渲染（可点击定位到用户原消息），这是平台原生能力，非文本前缀。
    // 官方规定 message_reference.message_id 必须用事件 ext 里的 msg_idx（REFIDX_*），
    // 传原始 msg id 平台无法解析，会导致重复消息等异常——索引缺失时干脆不带引用。
    // 限制：message_reference 与 Markdown 同时携带时，部分场景下平台会剥离 Markdown 改为纯文本
    // （引用卡片仍保留）。这是 QQ 平台约束，无法两全；若需保留 Markdown 排版，请将 quoteReply 设为 off。
    const quoteMsgId = record.target.scope === "group"
      && config.quoteReply !== "off"
      && (config.quoteReply === "all" || record.quoteMention)
      ? record.selfIdx || undefined
      : undefined;
    const chunks = chunkReply(text, config.replyChunkChars, limit);
    if (chunks.length === 0) return;
    let usedMarkdown = config.markdownReply;
    // 合成事件（定时任务）没有 msg_id → 整条回复走主动消息，消耗每日配额。
    const isProactive = !record.msgId;
    for (const [index, chunk] of chunks.entries()) {
      if (record.nextSeq > limit) {
        logger.warn(`[dsh-qqbot] 消息 ${record.msgId} 被动回复次数已达上限，剩余内容未发送`);
        break;
      }
      if (isProactive && quota && !(await quota.tryConsume())) break;
      const seq = record.nextSeq++;
      try {
        const result = await bot.client.sendReply(record.target, chunk, {
          msgId: record.msgId || undefined,
          msgSeq: seq,
          markdown: usedMarkdown,
          quoteMsgId,
        });
        // 平台拒绝 Markdown 后，后续分片直接走纯文本（少一次注定失败的请求）。
        if (result.mode === "text") usedMarkdown = false;
        // 记录自己发出的消息 id（供表情撤回 / /撤回 命令使用）。
        if (result.id) rememberSent(bot.state, record.chatKey, result.id);
        bot.state.counters.replies += 1;
      } catch (error) {
        if (config.proactiveFallback && record.target.scope === "group") {
          try {
            if (quota && !(await quota.tryConsume())) throw new Error("主动消息配额已用尽");
            const fallback = await bot.client.sendReply(record.target, chunk, { markdown: false });
            if (fallback.id) rememberSent(bot.state, record.chatKey, fallback.id);
            bot.state.counters.proactive += 1;
            continue;
          } catch (fallbackError) {
            logger.error("[dsh-qqbot] 主动消息兜底也失败:", fallbackError);
          }
        }
        bot.state.counters.errors += 1;
        logger.error(`[dsh-qqbot] 回复发送失败（msg_seq=${seq}）:`, error);
        // 可靠性：剩余未发送内容入箱，由后台重投（走主动消息通道）。
        const remaining = chunks.slice(index).join("\n\n");
        if (remaining && outbox) {
          await outbox.push({
            appId: bot.appId,
            scope: record.target.scope,
            openid: record.target.openid,
            content: remaining,
          });
          logger.info(`[dsh-qqbot] 剩余 ${remaining.length} 字已入投递出箱，稍后重投`);
        }
        break;
      }
    }
  };

  const onSessionEvent = (session: unknown, event: { type: string; data?: unknown }) => {
    try {
      switch (event.type) {
        case "user/message": {
          const deliveryId = webhookDeliveryIdOf(event.data);
          if (!deliveryId) return;
          const sessionId = sessionIdOf(session);
          if (!sessionId) return;
          // 来源机器人：事件分发时登记的 deliveryId → appId。
          const bot = bots.botForDelivery(deliveryId);
          if (!bot) return;
          const record = bindSession(bot.state, deliveryId, sessionId);
          bots.noteSession(sessionId, bot.appId);
          bots.releaseDelivery(deliveryId);
          if (record) {
            logger.info(
              `[dsh-qqbot] 会话 ${sessionId} 已绑定机器人 ${bot.appId} 的 QQ ${record.target.scope} ${record.target.openid}`,
            );
          }
          return;
        }
        case "assistant/message": {
          const sessionId = sessionIdOf(session);
          if (!sessionId) return;
          const bot = bots.botForSession(sessionId);
          if (!bot || !bot.state.recordBySession.has(sessionId)) return;
          const data = event.data as { turn?: unknown } | undefined;
          const turn = Number(data?.turn);
          if (!Number.isSafeInteger(turn)) return;
          appendAssistantText(bot.state, sessionId, turn, assistantTextOf(event.data));
          return;
        }
        case "turn/end": {
          const sessionId = sessionIdOf(session);
          if (!sessionId) return;
          const bot = bots.botForSession(sessionId);
          if (!bot || !bot.state.recordBySession.has(sessionId)) return;
          const data = event.data as { turn?: unknown } | undefined;
          const turn = Number(data?.turn);
          if (!Number.isSafeInteger(turn)) return;
          const text = takeTurnText(bot.state, sessionId, turn);
          if (!text) return;
          const record = bot.state.recordBySession.get(sessionId);
          void bot.archiver.append({
            kind: "reply",
            chat: record ? record.target.scope + ":" + record.target.openid : sessionId,
            content: text.slice(0, 2000),
            sessionId,
          });
          void send(bot, sessionId, text);
          return;
        }
        default:
          return;
      }
    } catch (error) {
      logger.error("[dsh-qqbot] 处理会话事件失败:", error);
    }
  };

  bus.on("session/event", onSessionEvent as never);
  return () => {
    bus.off("session/event", onSessionEvent as never);
  };
}
