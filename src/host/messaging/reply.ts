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
 *
 * AI 报错：宿主 turn/end 事件 reason.kind === "error"（LlmFailure）时，把报错提示
 * 回复给用户（而非静默）——已有部分文本则附加提示，无文本则只发提示；
 * 同一聊天 60 秒内只提示一次。
 */
import type { BotRuntime, BotRuntimeManager } from "../bots.js";
import { PASSIVE_REPLY_LIMIT } from "../qq/api.js";
import type { Outbox } from "./outbox.js";
import type { QuotaTracker } from "../infra/quota.js";
import { tr } from "../../shared/reply-i18n.js";
import { configForGroup } from "../../shared/config.js";
import { sanitizeOutgoingText } from "./sanitize.js";
import { synthesizeSpeech } from "./voice.js";
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

/** AI 报错提示的限流窗口：同一聊天 60 秒内最多提示一次（连续报错不刷屏）。 */
const ERROR_NOTICE_WINDOW_MS = 60_000;

/**
 * 判断一次发送失败是否「平台明确拒绝、确定未创建消息」（可安全降级重发）：
 * 仅 HTTP 4xx（含 429）算数——平台返回了明确拒绝即未落库；
 * 网络异常 / 超时 / 5xx 均视为结果不确定（平台可能已创建消息），
 * 此类失败后重发会造成同一条内容出现两次（手机端重复的头号来源），改走投递出箱。
 */
function certainNotSent(error: unknown): boolean {
  const message = error instanceof Error ? error.message : "";
  const m = /^QQ 发送失败: HTTP (\d{3})/.exec(message);
  if (!m) return false;
  const status = Number(m[1]);
  return status >= 400 && status < 500;
}

/**
 * 从 turn/end 的 reason 里解析 AI 失败消息（LlmFailure.message）。
 * 宿主无独立错误事件：turn 失败时 reason.kind === "error"，
 * error 为结构化失败（provider 报错如 billing error / 超时等）。无失败返回 null。
 */
function failureMessageOf(reason: unknown): string | null {
  const r = reason as { kind?: unknown; error?: { message?: unknown } } | null | undefined;
  if (!r || r.kind !== "error" || !r.error) return null;
  const message = typeof r.error.message === "string" ? r.error.message.trim() : "";
  return message ? message.slice(0, 300) : null;
}

type SessionBus = {
  on(event: string, listener: (session: unknown, event: { type: string; data?: unknown }) => void): unknown;
  off(event: string, listener: (session: unknown, event: { type: string; data?: unknown }) => void): unknown;
};

export function installReplyPump(ctx: unknown, { bots, outbox, quota, logger }: ReplyPumpContext): () => void {
  const bus = ctx as SessionBus;

  const send = async (bot: BotRuntime, sessionId: string, rawText: string) => {
    const record = bot.state.recordBySession.get(sessionId);
    if (!record) return;
    // 生效配置 = 按群覆盖合并（群聊时群覆盖 > 机器人默认；单聊用机器人配置）。
    const config = record.target.scope === "group"
      ? configForGroup(bot.config, record.target.openid)
      : bot.config;
    // 出站净化：剥离模型输出里的 system-reminder / <think> 等隐藏块（防内部内容泄漏）。
    const text = sanitizeOutgoingText(rawText, { enabled: config.sanitizeReplies });
    if (!text) return;
    const limit = Math.min(config.maxRepliesPerMessage, PASSIVE_REPLY_LIMIT[record.target.scope]);
    // 出站引用组合矩阵（平台主动消息能力收敛后实测定版）：
    //   仅 message_reference（主动通道，不传 msg_id）→ 手机端同一条内容出现两条；
    //   仅 msg_id                                    → 两端都不显示引用（实测「引用没了」）；
    //   msg_id + message_reference 被动同传           → 唯一「有引用且只出现一次」的组合。
    // 门控：仅群聊（单聊一律不引用）+ quoteReply（off=不引用；at=仅群 @；all=群聊全部回复）
    // + 必须有 REFIDX 索引（官方要求 message_reference.message_id 用事件 ext 的 msg_idx，
    //   原始 msg id 平台无法解析）+ 必须有 msg_id（被动凭证，同传必需）。
    // 门控：仅群聊（单聊一律不引用）+ quoteReply（off=不引用；at=仅群 @；all=群聊全部回复）
    // + 必须有 REFIDX 索引（官方要求 message_reference.message_id 用事件 ext 的 msg_idx，
    //   原始 msg id 平台无法解析）→ 索引缺失或未过门控时走普通被动回复。
    // 引用发送仅在被平台明确拒绝（HTTP 4xx，确定未创建消息）时降级为普通被动回复
    // （无卡片），并写入归档；结果不确定的失败（超时/网络/5xx）不重发——重发会造成同一条内容
    // 出现两次（手机端「两条重复内容」的头号来源），直接抛出走投递出箱。
    // 限制：message_reference 与 Markdown 同时携带时，部分场景下平台会剥离 Markdown 改为纯文本
    // （引用卡片仍保留）。这是 QQ 平台约束，无法两全；若需保留 Markdown 排版，请将 quoteReply 设为 off。
    const quoteReply = record.target.scope === "group"
      && config.quoteReply !== "off"
      && (config.quoteReply === "all" || record.quoteMention)
      && Boolean(record.selfIdx)
      && Boolean(record.msgId);
    const chunks = chunkReply(text, config.replyChunkChars, limit);
    if (chunks.length === 0) return;
    // 本条回复即将发出：停掉单聊「正在输入」状态（TTS 成功路径同样受益）。
    bot.typing.stop(record.chatKey);
    // 语音回复（ttsReply + 单聊）：整条回复合成语音气泡发送（WAV 直传）。
    // QQ 平台语音消息仅支持单聊，群聊忽略；合成/发送失败回退文字回复（内容不丢）。
    if (config.ttsReply && record.target.scope === "c2c" && record.nextSeq <= limit
      && config.ttsBaseUrl && config.ttsApiKey) {
      try {
        const audioPath = await synthesizeSpeech(
          text,
          { baseUrl: config.ttsBaseUrl, apiKey: config.ttsApiKey, model: config.ttsModel, voice: config.ttsVoice },
          logger,
        );
        if (audioPath) {
          await bot.client.sendVoice(record.target, { localPath: audioPath }, { msgId: record.msgId || undefined });
          record.nextSeq += 1;
          bot.state.counters.replies += 1;
          logger.info(`[dsh-qqbot] 已发送语音回复 chat=${record.chatKey}（文字转语音）`);
          return;
        }
      } catch (error) {
        logger.warn("[dsh-qqbot] 语音回复发送失败，回退文字回复:", error instanceof Error ? error.message : error);
      }
    }
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
      // withQuote=true：被动回复（msg_id + msgSeq）同传引用卡片（message_reference=REFIDX）；
      // false：普通被动回复（msg_id，无卡片）。
      const sendOnce = (withQuote: boolean) =>
        bot.client.sendReply(record.target, chunk, withQuote
          ? { msgId: record.msgId || undefined, msgSeq: seq, markdown: usedMarkdown, quoteMsgId: record.selfIdx }
          : { msgId: record.msgId || undefined, msgSeq: seq, markdown: usedMarkdown });
      try {
        let channel = quoteReply ? "被动(引用)" : "被动";
        let result: { mode: "markdown" | "text"; id?: string };
        if (quoteReply) {
          try {
            result = await sendOnce(true);
          } catch (quoteError) {
            // 仅「平台明确拒绝」（4xx，确定未创建消息）才降级重发；
            // 结果不确定的失败（网络/超时/5xx）直接抛出，避免重发造成两条重复内容。
            if (!certainNotSent(quoteError)) throw quoteError;
            logger.warn(
              "[dsh-qqbot] 引用卡片被平台拒绝，本片降级为普通被动回复（无卡片）:",
              quoteError instanceof Error ? quoteError.message : quoteError,
            );
            bot.archiver.append({
              kind: "session",
              chat: record.chatKey,
              group: record.target.scope === "group" ? record.target.openid : undefined,
              sender: "",
              content: "",
              note: `引用卡片被平台拒绝（${quoteError instanceof Error ? quoteError.message.slice(0, 120) : String(quoteError)}），本条已降级为普通被动回复（无引用）`,
            });
            channel = "被动(引用降级)";
            result = await sendOnce(false);
          }
        } else {
          result = await sendOnce(false);
        }
        // 平台拒绝 Markdown 后，后续分片直接走纯文本（少一次注定失败的请求）。
        if (result.mode === "text") usedMarkdown = false;
        // 诊断日志：与手机端「两条重复内容」表现精确关联（每次实际 API 调用一行）。
        logger.info(
          `[dsh-qqbot] 已发送 chat=${record.chatKey} seq=${seq} 通道=${channel} 格式=${result.mode} 消息id=${result.id ?? "-"}`,
        );
        // 记录自己发出的消息 id（供表情撤回 / /撤回 命令使用）。
        if (result.id) rememberSent(bot.state, record.chatKey, result.id);
        bot.state.counters.replies += 1;
      } catch (error) {
        // 主动兜底同样只在「平台明确拒绝」（确定未发送）时进行：
        // 结果不确定的失败重发会造成重复内容，直接入投递出箱由后台处理。
        if (config.proactiveFallback && record.target.scope === "group" && certainNotSent(error)) {
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
          // reason.kind === "error" 表示该 turn 因 AI 失败结束（LlmFailure）：
          // 已有部分文本则照常发送并附上提示；完全没有文本时把报错提示发给用户
          // （而非静默），同一聊天 60 秒内只提示一次（连续报错不刷屏）。
          const data = event.data as
            | { turn?: unknown; reason?: { kind?: unknown; error?: { message?: unknown } } }
            | undefined;
          const turn = Number(data?.turn);
          if (!Number.isSafeInteger(turn)) return;
          const text = takeTurnText(bot.state, sessionId, turn);
          const failure = failureMessageOf(data?.reason);
          const record = bot.state.recordBySession.get(sessionId);
          let notice: string | null = null;
          if (failure) {
            const now = Date.now();
            const last = record ? bot.state.errorNoticeAt.get(record.chatKey) ?? 0 : 0;
            if (!record || now - last >= ERROR_NOTICE_WINDOW_MS) {
              if (record) bot.state.errorNoticeAt.set(record.chatKey, now);
              if (bot.state.errorNoticeAt.size > 256) {
                for (const [key, at] of bot.state.errorNoticeAt) {
                  if (now - at > ERROR_NOTICE_WINDOW_MS) bot.state.errorNoticeAt.delete(key);
                }
              }
              const locale = bot.config.replyLocale === "en" ? "en" : "zh";
              notice = tr(locale, "⚠️ AI 回复出错：") + failure;
            } else {
              logger.warn(`[dsh-qqbot] AI 报错（限流窗口内未重复提示）: ${failure}`);
            }
          }
          const content = notice ? (text ? `${text}\n\n${notice}` : notice) : text;
          if (!content) return;
          void bot.archiver.append({
            kind: "reply",
            chat: record ? record.target.scope + ":" + record.target.openid : sessionId,
            content: content.slice(0, 2000),
            sessionId,
          });
          void send(bot, sessionId, content);
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
