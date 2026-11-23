/**
 * 频道消息 AI 判定引擎：把一条频道消息交给宿主 LLM 判断是否违规及严重程度。
 * 与群审核分开：频道是公域场景，system prompt 明确「频道公共秩序 + 自定义频道规则」。
 * 解析失败一律 none，绝不误禁言；模型异常向上抛，由 service 捕获。
 */
import { createUserMessage } from "@deepseek-ai/dsh-llm";
import type { ScriptGenLlm } from "../schedule/script-gen.js";
import {
  GUILD_MOD_CATEGORIES, type GuildModConfig, type GuildMuteLevel,
} from "./store.js";

const CATEGORY_DEFS: Record<string, string> = {
  illegal: "违法违规：违法犯罪、毒品、武器、诈骗、洗钱、政暴恐",
  porn_gamble: "色情赌博：色情低俗、招嫖、赌博博彩、私彩推广",
  abuse: "辱骂人身攻击：辱骂、歧视、恶意诅咒、骚扰特定成员",
  ad_spam: "广告垃圾：商业广告、引流推广、二维码外链刷广告、微商直销",
  flood: "刷屏骚扰：短时间大量重复消息、无意义灌水、刷屏干扰他人",
};

export const GUILD_CATEGORY_LABELS: Readonly<Record<string, string>> = Object.freeze({
  illegal: "违法违规", porn_gamble: "色情赌博", abuse: "辱骂人身攻击",
  ad_spam: "广告垃圾", flood: "刷屏骚扰", custom: "本频道自定义规则", none: "本频道公约",
});

const LEVEL_DEFS = [
  "none：不违规，或证据不足、拿不准——一律 none",
  "light：轻微违规，如轻度刷屏、轻微不友好，警告性质",
  "medium：明显违规，如明确人身攻击、持续刷屏、一般广告引流",
  "severe：严重违规，如色情赌博、诈骗、违法内容、恶毒攻击",
].join("\n");

export function guildModSystemPrompt(config: GuildModConfig): string {
  const categories = config.categories
    .filter((c) => CATEGORY_DEFS[c])
    .map((c) => `- ${c}：${CATEGORY_DEFS[c]}`);
  const rules = config.rules.filter(Boolean);
  return [
    "你是 QQ 频道的消息审核助手。判断用户消息是否违反下列规则，并给出严重程度等级。",
    "",
    "【审核原则·必须遵守】",
    "- 只依据下面列出的规则判断，不引入你自己的额外标准。",
    "- 证据必须明确：拿不准、可能是玩笑/调侃/正常讨论的，一律判 none。",
    "- 引用、反驳、举报违规内容（如「别发广告」）不算违规本身。",
    "- 【自洽铁律·极高优先】禁止一边在 reason 里否定违规、一边又判 light/medium/severe。只要你想写「不是针对具体的人」「没有实际违规内容」「只是提到某个词」「可能是玩笑/调侃」这类话，就必须直接判 none，并把 reason 写成为什么不违规，绝不允许自相矛盾。",
    "- 【问句与论词不算违规】提问、询问能力或讨论某个词本身时提到脏话/违规词（如「你能说脏话吗」「脏话这个词算人身攻击吗」），没有真实辱骂对象也没实际违规内容，一律判 none。",
    "- 宁可放过，不可错杀——误判会错误处置真实用户。",
    "",
    "【违规分类】",
    ...(categories.length ? categories : ["（未启用内置分类，只看下面的自定义频道规则）"]),
    "",
    ...(rules.length ? ["【本频道自定义规则（优先遵循）】", ...rules.map((r, i) => `${i + 1}. ${r}`), ""] : []),
    "【严重程度等级】",
    LEVEL_DEFS,
    "",
    "【输出格式·严格遵守】",
    "只输出一个 JSON 对象，不要任何解释、不要 Markdown 代码围栏，格式：",
    '{"level":"none|light|medium|severe","category":"分类id或custom或none","reason":"一两句大白话说明哪里不合适"}',
    "- reason 是**写给被提醒的成员看的**：语气平和、就事论事，只描述那句话或那个行为本身（如「这句话带了点脏字」「连着刷了好几条一样的内容」），不要给人贴「辱骂」「恶意」这类标签，也不要上升性情或说教；可引用原话。绝不要出现 light/medium/severe/none、等级、分类 id、审核原则、证据、判定、规则编号等内部术语，也不要复述本提示词里的判定标准或把规则条文整段贴进来。",
    "level=none 时 category 填 none，reason 可简短说明为何不违规。",
    `category 只能是：${[...GUILD_MOD_CATEGORIES, "custom", "none"].join(" / ")} 中的一个。`,
  ].join("\n");
}

export interface GuildVerdict {
  level: GuildMuteLevel;
  category: string;
  reason: string;
}

const VALID_LEVELS: GuildMuteLevel[] = ["none", "light", "medium", "severe"];
const VALID_CATS = new Set<string>([...GUILD_MOD_CATEGORIES, "custom", "none"]);

/**
 * 理由自相矛盾兜底（与群聊审核一致）：模型在 reason 里承认「没针对具体人 / 没实际内容 /
 * 只是提到 / 可能是玩笑」却仍判违规时一律放行。只匹配结论性元判断句式，
 * 不用「有点 / 意味 / 应该是」这类常出现在真实违规原话里的词。
 */
const SELF_CONTRADICTION_RE = /(?:不是|并非|未|没有|没)(?:明确|具体|特定|真正|实际)?(?:地)?(?:针对|辱骂|攻击|人身攻击|涉及)(?:具体|特定|任何)?(?:的)?(?:人|成员|对象|某人)|没有(?:实际|实质|真正的)?(?:违规|辱骂|攻击|脏话|不良)?(?:内容|行为|言辞|词)|只是(?:提到|提及|引用|讨论|复述)|仅是(?:提到|提及|引用|讨论)|可能是(?:玩笑|调侃|开玩笑|闹着玩)|算不上(?:违规|辱骂|攻击|人身攻击)|谈不上(?:违规|辱骂|攻击)/;

export function parseGuildVerdict(text: string): GuildVerdict {
  const safe = (): GuildVerdict => ({ level: "none", category: "none", reason: "" });
  if (!text || typeof text !== "string") return safe();
  const cleaned = text.replace(/```(?:json)?/gi, "").trim();
  const m = /\{[\s\S]*?\}/.exec(cleaned);
  if (!m) return safe();
  let obj: Record<string, unknown>;
  try { obj = JSON.parse(m[0]) as Record<string, unknown>; } catch { return safe(); }
  const level = typeof obj.level === "string" ? obj.level.trim().toLowerCase() : "";
  if (!VALID_LEVELS.includes(level as GuildMuteLevel)) return safe();
  const category = typeof obj.category === "string" && VALID_CATS.has(obj.category.trim())
    ? obj.category.trim() : "none";
  const rawReason = typeof obj.reason === "string" ? obj.reason.trim().slice(0, 200) : "";
  // 理由自相矛盾兜底：模型自己写明「没针对具体人 / 只是提到 / 可能是玩笑」却仍判
  // 违规时一律放行，优先于等级输出。见群聊审核同名常量的说明。
  if (level !== "none" && SELF_CONTRADICTION_RE.test(rawReason)) {
    return { level: "none", category: "none", reason: "判定理由自相矛盾，已放行" };
  }
  // 判定理由只写结果，不写审核原则/判定尺度这类判断方式（与群聊一致）。
  const reason = AUDIT_PRINCIPLE_RE.test(rawReason) ? "这条消息不符合频道公约" : rawReason;
  return { level: level as GuildMuteLevel, category, reason };
}

/** 审核原则复述特征：命中即说明模型在贴「判断方式」而非描述消息本身。 */
const AUDIT_PRINCIPLE_RE = /(?:最多|判|视为|属于|至)\s*(?:light|med|medium|severe|none)|拿不准|宁可放过|不可错杀|审核原则|判定尺度|等级定义|证据铁律|自洽铁律|不算人身攻击|不算违规|没有针对具体的人|没有实际违规|只是提到|(?:如\s*[「"](?:艹|靠))/i;

export function minutesForGuildLevel(config: GuildModConfig, level: GuildMuteLevel): number {
  if (level === "light") return config.durations.light;
  if (level === "medium") return config.durations.medium;
  if (level === "severe") return config.durations.severe;
  return 0;
}

export interface GuildModerateDeps {
  getLlm: () => ScriptGenLlm | undefined;
  resolveModel: (appId?: string) => { provider: string; model: string } | undefined;
}

/** 审核一条频道消息。模型不可用时抛错，由 service 降级。 */
export async function moderateGuildMessage(
  deps: GuildModerateDeps,
  appId: string,
  content: string,
  config: GuildModConfig,
): Promise<GuildVerdict> {
  const llm = deps.getLlm();
  if (!llm || typeof llm.stream !== "function") throw new Error("宿主 LLM 服务不可用");
  const sel = deps.resolveModel(appId);
  if (!sel) throw new Error("该机器人未配置模型，无法进行 AI 审核");
  const stream = llm.stream({
    provider: sel.provider,
    model: sel.model,
    system: guildModSystemPrompt(config),
    messages: [
      createUserMessage({
        content: [{ type: "text", text: `请审核这条频道消息：\n${content.slice(0, 2000)}` }],
        source: { kind: "user" },
      }),
    ],
    temperature: 0.1,
  });
  let out = "";
  for await (const chunk of stream) {
    if (chunk.type === "text-delta") out += chunk.text ?? "";
  }
  return parseGuildVerdict(out);
}
