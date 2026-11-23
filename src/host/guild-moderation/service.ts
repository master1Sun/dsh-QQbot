/**
 * 频道 AI 接管服务：频道消息 → AI 判定 → 按配置执行动作（禁言/撤回/警告）→ 日志。
 *
 * 触发前提（全部满足才审）：
 *  1. 该「机器人 + 频道」在 guild-moderation.json 里显式开启 enabled；
 *  2. 发送者不在白名单、不是机器人自己、有文本内容；
 *  3. 配置 channelIds 为空或命中当前子频道；
 *  4. 消息来自 rawEvent 的 AT_MESSAGE_CREATE / MESSAGE_CREATE（频道消息不进会话管线）。
 *
 * 所有动作失败都被吞掉并记进日志，绝不影响消息链路其它部分。
 */
import type { BotRuntime } from "../bots.js";
import { GuildModStore, GUILD_MUTE_CAP_MINUTES, type GuildModConfig, type GuildModLog } from "./store.js";
import {
  GUILD_CATEGORY_LABELS, moderateGuildMessage, minutesForGuildLevel, type GuildModerateDeps,
} from "./engine.js";

function durationText(minutes: number): string {
  if (minutes < 60) return `${minutes} 分钟`;
  if (minutes < 1440) return `${Math.round((minutes / 60) * 10) / 10} 小时`;
  return `${Math.round((minutes / 1440) * 10) / 10} 天`;
}

/**
 * 警告消息（子频道文本），带标签回执格式，与群聊通知一致。
 * 每项都写「判断结果」：违反类别 / 判定理由 / 依据规则 / 违规次数 / 处罚计算，
 * 不贴审核原则、判定尺度这类「判断方式」。语气平静笃定、按规则一视同仁。
 * 理由/规则去尖括号与换行，防注入。
 */
function warnText(params: {
  senderName: string; category: string; reason: string; rules: string[];
  minutes: number; strikeCount: number;
}): string {
  const clean = (value: string, max = 160) =>
    String(value ?? "").replace(/[\r\n<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) || "—";
  const categoryName = GUILD_CATEGORY_LABELS[params.category] ?? "本频道公约";
  const ruleText = params.rules.filter(Boolean).slice(0, 5)
    .map((r) => clean(r, 60)).join(" / ") || "本频道公约";
  const penalty = params.minutes > 0
    ? `本次禁言 ${durationText(params.minutes)}${params.strikeCount > 1 ? "，重复违规已加重" : ""}`
    : "本次仅提醒，暂不禁言";
  return [
    `@${clean(params.senderName, 40)} 这条消息不符合频道公约，${params.minutes > 0 ? `按频道规则禁言 ${durationText(params.minutes)}，冷静一下再接着聊` : "这次先提醒一下，请留意"}。`,
    "",
    `> 违反类别：${categoryName}`,
    `> 判定理由：${clean(params.reason)}`,
    `> 依据规则：${ruleText}`,
    `> 违规次数：累计第 ${params.strikeCount} 次`,
    `> 处罚计算：${penalty}`,
    "",
    "本频道对违反公约的消息一律按规则处理，反复违反会逐次加重。请大家遵守约定，一起维护频道氛围。",
  ].join("\n");
}

export class GuildModerationService {
  readonly store = new GuildModStore();
  readonly #deps: GuildModerateDeps;
  readonly #logger: Pick<Console, "info" | "warn" | "error">;
  /** 消息去重：eventId/messageId，防 SDK 重复推送同一条导致重复烧 token。 */
  readonly #seen = new Map<string, number>();
  static readonly SEEN_TTL = 10_000;

  constructor(deps: GuildModerateDeps, logger: Pick<Console, "info" | "warn" | "error">) {
    this.#deps = deps;
    this.#logger = logger;
  }

  #dedupe(key: string): boolean {
    if (!key) return false;
    const now = Date.now();
    for (const [k, at] of this.#seen) if (now - at > GuildModerationService.SEEN_TTL) this.#seen.delete(k);
    if (this.#seen.has(key)) return true;
    this.#seen.set(key, now);
    return false;
  }

  /**
   * 审核一条频道消息。返回是否命中违规（actioned = 至少执行了一个动作或判定为违规）。
   * 频道消息不进会话管线，这里返回仅用于日志展示。
   */
  async review(params: {
    bot: BotRuntime;
    guildId: string;
    channelId: string;
    messageId: string;
    sender: string;
    senderName: string;
    content: string;
  }): Promise<{ actioned: boolean; level: string; reason: string }> {
    const { bot, guildId, channelId, messageId, sender, senderName, content } = params;
    const noop = { actioned: false, level: "none", reason: "" };
    if (!guildId || !content.trim()) return noop;

    let cfg: GuildModConfig;
    try { cfg = await this.store.getConfig(bot.appId, guildId); } catch { return noop; }
    if (!cfg.enabled) return noop;
    if (sender && cfg.whitelist.includes(sender)) return noop;
    if (cfg.channelIds.length && channelId && !cfg.channelIds.includes(channelId)) return noop;
    if (this.#dedupe(`${bot.appId}:${messageId || `${guildId}:${sender}:${content.slice(0, 40)}`}`)) return noop;

    let verdict;
    try {
      verdict = await moderateGuildMessage(this.#deps, bot.appId, content, cfg);
    } catch (error) {
      this.#logger.warn("[guild-mod] 模型调用失败:", error instanceof Error ? error.message : error);
      return noop;
    }
    if (verdict.level === "none") return noop;

    const baseMinutes = minutesForGuildLevel(cfg, verdict.level);
    const prev = sender ? await this.store.getStrike(bot.appId, guildId, sender) : undefined;
    const strikeCount = (prev?.count ?? 0) + 1;
    const minutes = Math.min(GUILD_MUTE_CAP_MINUTES, baseMinutes * strikeCount);

    const log: GuildModLog = {
      at: new Date().toISOString(),
      appId: bot.appId,
      guildId,
      channelId,
      messageId,
      sender,
      senderName,
      content: content.slice(0, 500),
      level: verdict.level,
      reason: verdict.reason,
      category: verdict.category,
      minutes,
      actions: [],
      errors: [],
      strikeCount,
      baseMinutes,
    };

    // 动作 1：警告（最稳，几乎所有频道都能发子频道消息）
    if (cfg.actions.warn && channelId) {
      try {
        await bot.client.sendChannelMessage(channelId, warnText({
          senderName: senderName || sender.slice(0, 8),
          category: verdict.category,
          reason: verdict.reason,
          rules: cfg.rules,
          minutes,
          strikeCount,
        }));
        log.actions.push("warn");
      } catch (error) {
        log.errors.push(`warn: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    // 动作 2：撤回违规消息（需管理员/频道主）
    if (cfg.actions.recall && channelId && messageId) {
      try {
        await bot.client.deleteGuildMessage(channelId, messageId, true);
        log.actions.push("recall");
      } catch (error) {
        log.errors.push(`recall: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    // 动作 3：禁言成员（需管理员）
    if (cfg.actions.mute && minutes > 0 && sender) {
      try {
        await bot.client.muteGuildMember(guildId, sender, minutes);
        log.actions.push("mute");
      } catch (error) {
        log.errors.push(`mute: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    if (sender) {
      try { await this.store.recordStrike(bot.appId, guildId, sender, minutes, verdict.level); }
      catch (error) { this.#logger.warn("[guild-mod] 累进记录落盘失败:", error instanceof Error ? error.message : error); }
    }
    try { await this.store.appendLog(log); }
    catch (error) { this.#logger.warn("[guild-mod] 日志落盘失败:", error instanceof Error ? error.message : error); }

    this.#logger.info(
      `[guild-mod] 命中：频道 ${guildId.slice(0, 8)}… 子频道 ${channelId.slice(0, 8)}… `
      + `${senderName || sender.slice(0, 8)} → ${verdict.level}（${verdict.category}）`
      + ` 第 ${strikeCount} 次，动作 [${log.actions.join(",") || "无"}]`
      + (log.errors.length ? ` 失败 [${log.errors.join("; ")}]` : ""),
    );
    return { actioned: log.actions.length > 0, level: verdict.level, reason: verdict.reason };
  }
}
