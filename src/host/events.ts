/**
 * 原始网关事件处理（SDK rawEvent 透传，覆盖非消息类事件）：
 *
 *  - GROUP_MEMBER_ADD / FRIEND_ADD   → 欢迎语（welcomeEnabled + welcomeMessage，{nick} 占位）；
 *  - MESSAGE_REACTION_ADD            → reactionRecall 开启时，🗑️ 表情回应机器人消息 → 撤回它；
 *  - GROUP_MSG_RECALL / C2C_MSG_RECALL → 仅记归档，不动作。
 *
 * 所有动作走主动消息通道（受每日配额约束），失败只告警不影响主流程。
 */
import type { BotRuntime } from "./bots.js";
import { isOwnSent, rememberSent } from "./state.js";

/** QQ 平台「垃圾桶」表情回应的已知 id（不同端可能用文本名）。 */
const RECALL_EMOJI_IDS = new Set(["129", "trash", "垃圾桶"]);

interface ReactionEventShape {
  group_openid?: string;
  user_openid?: string;
  member_openid?: string;
  target_id?: string;
  emoji?: { id?: string; type?: number };
  emoji_id?: string;
}

interface MemberEventShape {
  group_openid?: string;
  member_openid?: string;
  op_member_openid?: string;
  openid?: string;
}

export interface RawEventOutcome {
  handled: boolean;
  note?: string;
}

/** 分派一个原始事件；永不抛错。 */
export async function handleRawEvent(bot: BotRuntime, eventType: string, data: unknown): Promise<RawEventOutcome> {
  const config = bot.config;
  const payload = (data ?? {}) as Record<string, unknown>;

  // ── 欢迎语 ────────────────────────────────────────────────────────────────
  if (config.welcomeEnabled && (eventType === "GROUP_MEMBER_ADD" || eventType === "FRIEND_ADD")) {
    const member = payload as MemberEventShape;
    const openid = eventType === "FRIEND_ADD"
      ? (member.openid ?? "")
      : (member.member_openid ?? member.op_member_openid ?? "");
    if (!openid && eventType === "FRIEND_ADD") return { handled: false };
    const scope: "group" | "c2c" = eventType === "FRIEND_ADD" ? "c2c" : "group";
    const targetOpenid = eventType === "FRIEND_ADD" ? openid : (member.group_openid ?? "");
    if (!targetOpenid) return { handled: false };
    const nick = openid || "新朋友";
    const text = (config.welcomeMessage || "欢迎 {nick}！@我即可与我对话。").replaceAll("{nick}", nick);
    try {
      const id = await bot.client.sendText({ scope, openid: targetOpenid }, text);
      if (id) rememberSent(bot.state, `${scope}:${targetOpenid}`, id);
      bot.state.counters.proactive += 1;
      return { handled: true, note: `welcome → ${scope}:${targetOpenid}` };
    } catch (error) {
      return { handled: false, note: `welcome 失败: ${error instanceof Error ? error.message : String(error)}` };
    }
  }

  // ── 表情回应撤回 ─────────────────────────────────────────────────────────
  if (config.reactionRecall && eventType === "MESSAGE_REACTION_ADD") {
    const reaction = payload as ReactionEventShape;
    const messageId = reaction.target_id ?? "";
    const group = reaction.group_openid ?? "";
    const chatKey = group ? `group:${group}` : `c2c:${reaction.user_openid ?? ""}`;
    const emojiId = reaction.emoji?.id ?? reaction.emoji_id ?? "";
    if (!messageId || !isOwnSent(bot.state, chatKey, messageId)) return { handled: false };
    if (!RECALL_EMOJI_IDS.has(emojiId) && !RECALL_EMOJI_IDS.has(String(emojiId).toLowerCase())) {
      return { handled: false };
    }
    const target = group
      ? { scope: "group" as const, openid: group }
      : { scope: "c2c" as const, openid: reaction.user_openid ?? "" };
    try {
      await bot.client.recall(target, messageId);
      return { handled: true, note: `reaction-recall ${messageId.slice(0, 12)}…` };
    } catch (error) {
      return {
        handled: false,
        note: `表情撤回失败（需要机器人消息撤回权限）: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  // 撤回事件只记日志（对方撤回无法还原内容，ref-index 中的原文仍有价值）。
  if (eventType === "GROUP_MSG_RECALL" || eventType === "C2C_MSG_RECALL") {
    void bot.archiver.append({ kind: "inbound", event: eventType, chat: groupChatKey(payload), content: "", note: "recalled" });
    return { handled: true, note: eventType };
  }
  return { handled: false };
}

function groupChatKey(payload: Record<string, unknown>): string {
  const group = typeof payload.group_openid === "string" ? payload.group_openid : "";
  const user = typeof payload.user_openid === "string" ? payload.user_openid : "";
  return group ? `group:${group}` : `c2c:${user}`;
}
