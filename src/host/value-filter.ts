/**
 * 群全量消息价值过滤：不是每条消息都值得回复。
 *
 * 启发式评分（0–10），达到阈值才创建会话回复：
 *  加分 — 疑问句、求助/请求词、指向机器人/AI、技术内容、链接/代码痕迹、较长的实质内容；
 *  减分 — 纯表情/单字/纯数字、短噪声、短时间重复消息、同人连续刷屏。
 * 叠加两层冷却：每群最小回复间隔、同一发送者最小回复间隔，防止刷屏。
 *
 * 直接 @机器人（GROUP_AT_MESSAGE_CREATE）与单聊不经过此过滤，始终回复。
 */
import type { GroupBufferEntry, QqMessagePayload } from "../shared/types.js";

export interface ValueFilterConfig {
  /** 是否启用群全量回复。 */
  enabled: boolean;
  /** 评分达到该值才回复（0–10）。 */
  threshold: number;
  /** 同一群两次「全量模式回复」的最小间隔（毫秒）。 */
  groupCooldownMs: number;
  /** 同一发送者两次被回复的最小间隔（毫秒）。 */
  senderCooldownMs: number;
}

export interface ValueFilterState {
  /** groupOpenid → 上次全量回复时间。 */
  lastGroupReplyAt: Map<string, number>;
  /** `${group}:${sender}` → 上次回复时间。 */
  lastSenderReplyAt: Map<string, number>;
  /** groupOpenid → 内容指纹 → 最近出现时间（重复消息识别）。 */
  recentTexts: Map<string, Map<string, number>>;
  /** `${group}:${sender}` → 最近发送时间序列（刷屏识别）。 */
  senderTimes: Map<string, number[]>;
}

export function createValueFilterState(): ValueFilterState {
  return {
    lastGroupReplyAt: new Map(),
    lastSenderReplyAt: new Map(),
    recentTexts: new Map(),
    senderTimes: new Map(),
  };
}

export interface ValueVerdict {
  reply: boolean;
  score: number;
  reasons: string[];
  blockedBy?: "cooldown-group" | "cooldown-sender" | "duplicate" | "below-threshold";
}

const QUESTION_RE = /[?？]|吗[?？。！!~]?$|呢[?？。！!~]?$|^(怎么|为什么|如何|什么|哪些|为啥|多少|几|什么时候|哪里|哪儿|咋|谁|是否|能不能|有没有|是不是)/;
const ASK_RE = /(帮我|帮忙|求助|求教|请教|请问|帮忙看看|帮我看看|翻译一下|总结一下|解释一下|写一个|写个|改一下|推荐一下|有什么建议|怎么办)/;
const AI_RE = /(机器人|人工智能|\bai\b|bot|robot|豆包|deepseek|助手)/i;
const TECH_RE = /(代码|报错|错误|bug|error|异常|程序|部署|安装|配置|编译|运行|服务器|接口|api|数据库|git|python|javascript|typescript|java|golang|rust|sql|linux|docker)/i;
const CODE_URL_RE = /(https?:\/\/|www\.|```|function |def |const |let |var |class |import |#include)/;
const NOISE_RE = /^[\s\p{Extended_Pictographic}\p{Emoji_Presentation}~。.，,!！?？…_\-]+$|^\d{1,4}$/u;

function fingerprint(text: string): string {
  return text.replace(/\s+/g, "").slice(0, 120);
}

/** 群消息价值评估：返回是否回复与评分依据。 */
export function evaluateGroupMessage(
  payload: QqMessagePayload,
  filter: ValueFilterConfig,
  state: ValueFilterState,
  now = Date.now(),
): ValueVerdict {
  const content = (payload.content ?? "").trim();
  const sender = payload.author?.id || payload.author?.member_openid || "";
  const group = payload.group_openid ?? "";
  const reasons: string[] = [];
  let score = 0;

  // —— 内容价值 ——
  if (QUESTION_RE.test(content)) { score += 4; reasons.push("疑问句 +4"); }
  if (ASK_RE.test(content)) { score += 4; reasons.push("求助/请求 +4"); }
  if (AI_RE.test(content)) { score += 2; reasons.push("指向机器人/AI +2"); }
  if (TECH_RE.test(content)) { score += 2; reasons.push("技术内容 +2"); }
  if (CODE_URL_RE.test(content)) { score += 2; reasons.push("链接/代码痕迹 +2"); }
  if (content.length >= 30) { score += 2; reasons.push("内容充实 +2"); }
  else if (content.length >= 12) { score += 1; reasons.push("内容完整 +1"); }

  // —— 噪声惩罚 ——
  if (content.length < 4 || NOISE_RE.test(content)) {
    score -= 4;
    reasons.push("短噪声/纯表情 -4");
  }
  const recent = state.recentTexts.get(group);
  const fp = fingerprint(content);
  const lastSeen = recent?.get(fp);
  if (fp && lastSeen && now - lastSeen < 60_000) {
    score -= 3;
    reasons.push("60 秒内重复消息 -3");
  }
  const senderKey = `${group}:${sender}`;
  const times = (state.senderTimes.get(senderKey) ?? []).filter((t) => now - t < 60_000);
  if (times.length >= 2) {
    score -= 2;
    reasons.push("同人连续刷屏 -2");
  }
  score = Math.max(0, Math.min(10, score));

  // —— 冷却与重复记录（无论是否回复都更新，保证滑动窗口准确） ——
  recent?.set(fp, now);
  if (recent) {
    for (const [key, at] of recent) if (now - at > 120_000) recent.delete(key);
    if (recent.size > 64) recent.clear();
  } else if (group) {
    state.recentTexts.set(group, new Map([[fp, now]]));
  }
  times.push(now);
  state.senderTimes.set(senderKey, times);

  // 指向机器人的消息跳过冷却（用户明确在找机器人）。
  const directed = AI_RE.test(content);
  if (!directed && group) {
    const lastGroup = state.lastGroupReplyAt.get(group) ?? 0;
    if (now - lastGroup < filter.groupCooldownMs) {
      return { reply: false, score, reasons, blockedBy: "cooldown-group" };
    }
    const lastSender = state.lastSenderReplyAt.get(senderKey) ?? 0;
    if (now - lastSender < filter.senderCooldownMs) {
      return { reply: false, score, reasons, blockedBy: "cooldown-sender" };
    }
  }
  if (score < filter.threshold) {
    return { reply: false, score, reasons, blockedBy: "below-threshold" };
  }

  if (group) state.lastGroupReplyAt.set(group, now);
  state.lastSenderReplyAt.set(senderKey, now);
  return { reply: true, score, reasons };
}

/**
 * 全量模式回复使用的提示词：不做任何指令包装，群里收到什么就原样交给模型——
 * 最近群聊记录（含发言者与时间）+ 触发消息本身，最后一行即最新收到的消息。
 */
export function buildGroupFullPrompt(trigger: QqMessagePayload, context: GroupBufferEntry[]): string {
  const lines = context.map((e) => {
    const time = /^\d{4}-\d{2}-\d{2}T(\d{2}:\d{2})/.exec(e.timestamp)?.[1] ?? "";
    const name = e.senderName || e.senderId;
    return `- ${time ? `[${time}] ` : ""}${name}: ${e.content}`;
  });
  const sender = trigger.author?.username || trigger.author?.member_openid || "群成员";
  const triggerLine = `${sender}: ${(trigger.content ?? "").trim()}`;
  // 触发消息在入缓冲后才取 recent，通常已是最后一条，避免重复追加。
  if (lines.length > 0 && lines[lines.length - 1] === triggerLine) return lines.join("\n");
  return [...lines, triggerLine].join("\n");
}
