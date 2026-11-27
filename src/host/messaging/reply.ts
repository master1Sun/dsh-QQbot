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
import { basename, isAbsolute, join } from "node:path";
import { stat } from "node:fs/promises";
import type { BotRuntime, BotRuntimeManager } from "../bots.js";
import {
  INCREMENTAL_FLUSH_CHARS,
  INCREMENTAL_MIN_BUDGET,
  PASSIVE_REPLY_LIMIT,
  effectiveReplyLimit,
  isGroupAdminRole,
} from "../../shared/passive-reply.js";
import { botRoleInGroup } from "../qq/group-role.js";
import type { Outbox } from "./outbox.js";
import type { QuotaTracker } from "../infra/quota.js";
import { tr } from "../../shared/reply-i18n.js";
import { SILENT_MARKER, isSilentReply, type PassiveReplyRecord } from "../../shared/types.js";
import { configForGroup } from "../../shared/config.js";
import { sanitizeOutgoingText } from "./sanitize.js";
import { looksLikeMarkdown, isSensitiveFilePath } from "./format.js";
import { synthesizeSpeech } from "./voice.js";
import {
  appendAssistantText,
  assistantTextOf,
  beginTurnSend,
  bindSession,
  chunkReply,
  dequeueRecord,
  peekRecord,
  peekTurnText,
  removeRecord,
  rememberSent,
  resolveChatTarget,
  sessionIdOf,
  setTurnText,
  takeFlushablePrefix,
  takeTurnSend,
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
  /**
   * 定时任务被静默（AI 判定本次无需发送）时的回调：
   * 把「跳过原因」写回对应任务条目，设置页可据此解释「为什么这次没发」。
   */
  onScheduleSilent?: (scheduleId: string, reason: string) => void | Promise<void>;
  logger: Pick<Console, "info" | "warn" | "error">;
}

/** AI 报错提示的限流窗口：同一聊天 60 秒内最多提示一次（连续报错不刷屏）。 */
const ERROR_NOTICE_WINDOW_MS = 60_000;

/** 单个交付文件的体积上限；超限只记日志不发送（QQ 富媒体通道限制较严）。 */
const MAX_DELIVERABLE_BYTES = 30 * 1_048_576;
/** 单个 turn 最多自动外发的交付文件数（防刷屏、防媒体配额被一次吃光）。 */
const MAX_DELIVERABLE_FILES = 5;

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

export function installReplyPump(ctx: unknown, { bots, outbox, quota, logger, onScheduleSilent }: ReplyPumpContext): () => void {
  const bus = ctx as SessionBus;

  const send = async (
    bot: BotRuntime,
    sessionId: string,
    rawText: string,
    recordOverride?: PassiveReplyRecord,
    opts: { noQuote?: boolean } = {},
  ) => {
    // 优先用调用方按 turn 精确取出的记录（recordQueue 出队）：同一聊天并发多条消息时，
    // recordBySession 只保留最新一条，直接读它会把 @ 消息的引用门控字段挤掉。
    const record = recordOverride ?? bot.state.recordBySession.get(sessionId);
    if (!record) return;
    // 生效配置 = 按群覆盖合并（群聊时群覆盖 > 机器人默认；单聊用机器人配置）。
    const config = record.target.scope === "group"
      ? configForGroup(bot.config, record.target.openid)
      : bot.config;
    // 出站净化：剥离模型输出里的 system-reminder / <think> 等隐藏块（防内部内容泄漏）。
    const text = sanitizeOutgoingText(rawText, { enabled: config.sanitizeReplies });
    if (!text) return;
    // ── 定时任务静默 ────────────────────────────────────────────────
    // 模型按「本次没有值得发送的内容」只输出了静默标记 → 不投递、不吵群、不占配额。
    // 放在净化之后判定：标记带空白/换行也能识别（isSilentReply 会先剥离标记再判空）。
    // 预扣的主动消息额度在此归还——调度层已为本次触发扣过一次。
    if (record.silentOk && isSilentReply(text)) {
      bot.typing.stop(record.chatKey);
      await quota?.refund(1, bot.appId);
      logger.info(`[dsh-qqbot] 定时任务静默：本次不发送 chat=${record.chatKey}（模型判定无事可报）`);
      void bot.archiver.append({
        kind: "proactive",
        chat: record.chatKey,
        content: SILENT_MARKER,
        note: "schedule:silent",
      });
      if (record.scheduleId && onScheduleSilent) {
        try {
          await onScheduleSilent(record.scheduleId, "AI 判定本次无需发送（静默）");
        } catch (error) {
          logger.warn("[dsh-qqbot] 回写静默原因失败:", error);
        }
      }
      return;
    }
    // 群被动回复上限：默认 5 次；机器人为该群群主/管理员时平台放宽到 50 次（官方 20261117）。
    // 角色查询带 10 分钟缓存，探测失败/无权限回落 "member"（保守 5 次）且不抛错，不影响正常投递。
    const groupRole = record.target.scope === "group"
      ? await botRoleInGroup(bot.client, bot.appId, record.target.openid, logger)
      : null;
    const limit = effectiveReplyLimit(config.maxRepliesPerMessage, record.target.scope, groupRole);
    if (isGroupAdminRole(groupRole) && limit > PASSIVE_REPLY_LIMIT.group) {
      logger.info(
        `[dsh-qqbot] 群被动回复上限按平台新规放宽 chat=${record.chatKey} 角色=${groupRole} 上限=${limit}`,
      );
    }
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
    const quoteReply = !opts.noQuote
      && record.target.scope === "group"
      && config.quoteReply !== "off"
      && (config.quoteReply === "all" || record.quoteMention)
      && Boolean(record.selfIdx)
      && Boolean(record.msgId);
    logger.info(
      `[dsh-qqbot][diag-quote] chat=${record.chatKey} mode=${config.quoteReply} ` +
      `quoteMention=${record.quoteMention} selfIdx=${record.selfIdx ? "✓" : "∅"} msgId=${record.msgId ? "✓" : "∅"} → quoteReply=${quoteReply}`,
    );
    const chunks = chunkReply(text, config.replyChunkChars, limit, config.replyLocale);
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
    // 排版：按**内容**决定这一片用不用 Markdown（模型写下的语法就是它的排版决定），
    // 而不是全局一刀切——日常闲聊走纯文本更自然，代码/表格/清单才切 Markdown。
    // markdownReply=false 时彻底不用；平台拒绝 Markdown 后本 turn 内不再尝试（见循环内）。
    let markdownAllowed = config.markdownReply;
    // 合成事件（定时任务）没有 msg_id → 整条回复走主动消息，消耗每日配额。
    // 但定时任务的额度已由调度层在触发时预扣 1 次，这里**不再逐片扣费**：
    // 否则「一条分 N 片的定时广播」会被记成 1+N 次主动消息（旧行为，明显超扣）。
    const isProactive = !record.msgId;
    const quotaPrepaid = record.scheduled === true;
    for (const [index, chunk] of chunks.entries()) {
      if (record.nextSeq > limit) {
        logger.warn(`[dsh-qqbot] 消息 ${record.msgId} 被动回复次数已达上限，剩余内容未发送`);
        break;
      }
      if (isProactive && quota && !quotaPrepaid && !(await quota.tryConsume(1, bot.appId))) break;
      const seq = record.nextSeq++;
      const wantMarkdown = markdownAllowed && looksLikeMarkdown(chunk);
      // withQuote=true：被动回复（msg_id + msgSeq）同传引用卡片（message_reference=REFIDX）；
      // false：普通被动回复（msg_id，无卡片）。
      const sendOnce = (withQuote: boolean) =>
        bot.client.sendReply(record.target, chunk, withQuote
          ? { msgId: record.msgId || undefined, msgSeq: seq, markdown: wantMarkdown, quoteMsgId: record.selfIdx, forceVerifyImage: bot.config.forceVerifyImage }
          : { msgId: record.msgId || undefined, msgSeq: seq, markdown: wantMarkdown, forceVerifyImage: bot.config.forceVerifyImage });
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
        // 只在「这次确实要了 Markdown」时降级：否则会把按内容判定走的纯文本误判成平台拒绝。
        if (wantMarkdown && result.mode === "text") markdownAllowed = false;
        // 诊断日志：与手机端「两条重复内容」表现精确关联（每次实际 API 调用一行）。
        logger.info(
          `[dsh-qqbot] 已发送 chat=${record.chatKey} seq=${seq} 通道=${channel} 格式=${result.mode} `
          + `按内容要MD=${wantMarkdown ? "y" : "n"} 消息id=${result.id ?? "-"}`,
        );
        // 记录自己发出的消息 id（供表情撤回 / /撤回 命令使用）。
        if (result.id) rememberSent(bot.state, record.chatKey, result.id);
        bot.state.counters.replies += 1;
      } catch (error) {
        // 主动兜底同样只在「平台明确拒绝」（确定未发送）时进行：
        // 结果不确定的失败重发会造成重复内容，直接入投递出箱由后台处理。
        if (config.proactiveFallback && record.target.scope === "group" && certainNotSent(error)) {
          try {
            // 定时任务同样已预扣过额度，兜底重发不再叠加计费（与主路径一致）。
            if (quota && !quotaPrepaid && !(await quota.tryConsume(1, bot.appId))) throw new Error("主动消息配额已用尽");
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

  /**
   * 每会话一条发送链：同一聊天的多次发送串行化。
   * 「边生成边发」下同一 turn 会有多段发送，串行才能保证：
   *  - msg_seq 不重复（平台对「相同 msg_id + msg_seq」的直接判失败）；
   *  - 群里显示顺序与生成顺序一致。
   * 链在后台运行（不 await），agent 继续执行后续步骤，用户不必等整个 turn 结束。
   */
  const sendChains = new Map<string, Promise<void>>();
  const enqueueSend = (
    bot: BotRuntime,
    sessionId: string,
    text: string,
    recordOverride?: PassiveReplyRecord,
    opts: { noQuote?: boolean } = {},
  ): void => {
    const previous = sendChains.get(sessionId) ?? Promise.resolve();
    const next = previous
      .then(() => send(bot, sessionId, text, recordOverride, opts))
      .catch((error) => {
        logger.error("[dsh-qqbot] 回复发送失败（发送链）:", error);
      })
      .finally(() => {
        if (sendChains.get(sessionId) === next) sendChains.delete(sessionId);
      });
    sendChains.set(sessionId, next);
  };

  /**
   * 「边生成边发」：本 turn 的助手文本攒够阈值，就先把成篇的一段发出去。
   *
   * 只在「群聊 + 有被动凭证 + 非静默定时任务 + 有效上限 ≥ INCREMENTAL_MIN_BUDGET」时启用：
   *  - 官方明确「群消息不支持流式参数」，所以每段就是一条独立的被动回复，各占 1 次回复次数；
   *  - 预算不足（非管理员群只有 5 次）时整条回退到 turn/end 一次性分片发送；
   *  - record.silentOk（定时任务）必须攒到最后，否则「本次无需发送」的静默标记会被提前发出去；
   *  - 切点必须落在自然边界且不在未闭合的代码块里（见 takeFlushablePrefix）。
   */
  const flushEarly = async (bot: BotRuntime, sessionId: string, turn: number): Promise<void> => {
    const record = peekRecord(bot.state, sessionId);
    if (!record || !record.msgId || record.silentOk) return;
    if (record.target.scope !== "group") return;
    const config = configForGroup(bot.config, record.target.openid);
    const role = await botRoleInGroup(bot.client, bot.appId, record.target.openid, logger);
    const limit = effectiveReplyLimit(config.maxRepliesPerMessage, record.target.scope, role);
    if (limit < INCREMENTAL_MIN_BUDGET || record.nextSeq > limit) return;
    const pending = peekTurnText(bot.state, sessionId, turn);
    if (!pending) return;
    const split = takeFlushablePrefix(pending, {
      minChars: INCREMENTAL_FLUSH_CHARS,
      maxChars: config.replyChunkChars,
    });
    if (!split) return;
    // 先同步回写剩余内容再排入发送链：下一条 assistant/message 不会重复读到已发文本。
    setTurnText(bot.state, sessionId, turn, split.rest);
    const { record: bound, first } = beginTurnSend(bot.state, sessionId, turn, record);
    void bot.archiver.append({
      kind: "reply",
      chat: `${record.target.scope}:${record.target.openid}`,
      content: split.head.slice(0, 2000),
      sessionId,
    });
    logger.info(
      `[dsh-qqbot] 边生成边发 chat=${record.chatKey} turn=${turn} `
      + `本段=${split.head.length}字 剩余=${split.rest.length}字 序号=${bound.nextSeq}/${limit}`,
    );
    enqueueSend(bot, sessionId, split.head, bound, { noQuote: !first });
  };

  /**
   * 交付文件自动外发：模型用 `present` 声明了交付物时，DSH 会发会话事件
   * `deliverables/presented`（{ turn, callId, files: [{ path, description }] }），
   * 这里把文件发到对应的 QQ 聊天。
   *
   * 设计取舍：
   *  - **只发模型显式声明为交付物的文件**，不去扫描工作区新建文件——后者会把临时文件、
   *    中间产物一并外发；
   *  - 文件走富媒体通道（**不挂 msg_id**）：既不占被动回复次数，也不会和回复泵的
   *    msg_seq 计数打架（`sendFile` 没有 msgSeq 参数，挂 msg_id 会让序号失去统一管理）；
   *  - 三道闸：敏感文件（.env/*.pem/id_rsa 等）不外发、超体积不发、单 turn 限量，
   *    每一条都写日志说明原因，不静默吞掉。
   */
  const sendPresentedFiles = async (bot: BotRuntime, sessionId: string, data: unknown): Promise<void> => {
    const target = resolveChatTarget(bot.state, sessionId);
    if (!target) return;
    const files = (data as { files?: unknown } | null | undefined)?.files;
    if (!Array.isArray(files) || files.length === 0) return;
    const workspace = bot.config.workspacePath || process.cwd();
    const chatKey = `${target.scope}:${target.openid}`;
    const seen = new Set<string>();
    let sent = 0;
    for (const raw of files) {
      if (sent >= MAX_DELIVERABLE_FILES) {
        logger.warn(`[dsh-qqbot] 交付文件超过 ${MAX_DELIVERABLE_FILES} 个，其余未自动发送 chat=${chatKey}`);
        break;
      }
      const rel = typeof (raw as { path?: unknown } | null)?.path === "string"
        ? (raw as { path: string }).path.trim()
        : "";
      if (!rel) continue;
      const full = isAbsolute(rel) ? rel : join(workspace, rel);
      if (seen.has(full)) continue;
      seen.add(full);
      if (isSensitiveFilePath(full)) {
        logger.warn(`[dsh-qqbot] 交付文件疑似凭据，已跳过不外发：${full}`);
        continue;
      }
      let size = 0;
      try {
        const info = await stat(full);
        if (!info.isFile()) {
          logger.warn(`[dsh-qqbot] 交付路径不是普通文件，跳过：${full}`);
          continue;
        }
        size = info.size;
      } catch {
        logger.warn(`[dsh-qqbot] 交付文件不存在或不可读，跳过：${full}`);
        continue;
      }
      if (size > MAX_DELIVERABLE_BYTES) {
        logger.warn(
          `[dsh-qqbot] 交付文件超过 ${Math.round(MAX_DELIVERABLE_BYTES / 1_048_576)}MB，未自动发送：${full}`,
        );
        continue;
      }
      const description = (raw as { description?: unknown } | null)?.description;
      try {
        await bot.client.sendFile(target, { localPath: full }, {
          fileName: basename(full),
          content: typeof description === "string" && description.trim()
            ? description.trim().slice(0, 100)
            : undefined,
        });
        sent += 1;
        bot.state.counters.proactive += 1;
        logger.info(
          `[dsh-qqbot] 交付文件已发送 chat=${chatKey} 文件=${basename(full)}（${Math.round(size / 1024)}KB）`,
        );
        void bot.archiver.append({
          kind: "proactive",
          chat: chatKey,
          content: `[交付文件] ${basename(full)}`,
          note: "deliverable:present",
        });
      } catch (error) {
        logger.error(
          `[dsh-qqbot] 交付文件发送失败（${basename(full)}）:`,
          error instanceof Error ? error.message : error,
        );
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
          // 边生成边发：攒够阈值就先把成篇的一段发出去，agent 继续执行后续步骤。
          void flushEarly(bot, sessionId, turn);
          return;
        }
        case "deliverables/presented": {
          // 模型用 present 声明了交付文件 → 自动发到对应 QQ 聊天（见 sendPresentedFiles）。
          const sessionId = sessionIdOf(session);
          if (!sessionId) return;
          const bot = bots.botForSession(sessionId);
          if (!bot) return;
          void sendPresentedFiles(bot, sessionId, event.data);
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
          // 按 turn 精确取出触发本次回复的记录（FIFO）：并发消息下避免读到后到消息的记录，
          // 从而保住 @ 消息的引用门控字段（quoteMention/selfIdx/msgId）。队列空则回退最新记录。
          // 本 turn 已提前分段发送过时复用同一条记录（msg_seq 继续往下走），并按对象身份把它
          // 从队列移除——队列按 turn 顺序一一出队，不能重复取走别条消息的记录。
          const sentState = takeTurnSend(bot.state, sessionId, turn);
          const record = sentState?.record
            ?? dequeueRecord(bot.state, sessionId)
            ?? bot.state.recordBySession.get(sessionId);
          if (sentState) removeRecord(bot.state, sessionId, sentState.record);
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
              notice = tr(locale, "reply.aiError") + failure;
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
          enqueueSend(bot, sessionId, content, record ?? undefined, { noQuote: Boolean(sentState) });
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
