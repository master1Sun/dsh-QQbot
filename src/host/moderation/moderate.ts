/**
 * AI 群规审核引擎：把一条群消息交给宿主 LLM 判定是否违规及严重程度。
 *
 * 设计原则（误判代价高，宁可放过不可错杀）：
 *  - 只在内部明确启用了审核的群调用（群级开关 + 管理员权限由调用方保证）；
 *  - system prompt 内置违规分类定义 + 用户自定义群规，要求「证据明确才判违规」；
 *  - 模型输出严格 JSON，解析失败一律按 none 处理（绝不会因为模型抽风而误禁言）；
 *  - 模型调用异常向上抛，由调用方捕获并记录，不影响正常消息链路。
 */
import { createUserMessage } from "@deepseek-ai/dsh-llm";
import type { ScriptGenLlm } from "../schedule/script-gen.js";
import { MODERATION_CATEGORIES, type ModerationConfig, type MuteLevel } from "./store.js";

/** 内置分类的可读定义（注入模型，中文，与客户端 dict 文案对应）。 */
const CATEGORY_DEFS: Record<string, string> = {
  illegal: "违法违规：涉及违法犯罪、毒品、武器、诈骗、洗钱、政暴恐等明确违法内容",
  porn_gamble: "色情赌博：色情低俗、招嫖、赌博博彩、私彩平台推广",
  // 误判重灾区：必须是「明确、针对真人、带侮辱意图」，玩笑/调侃/情绪话/讨论脏话都不算。
  abuse: "辱骂人身攻击：明确针对特定成员、用侮辱性词汇或人身贬损进行攻击。注意排除：熟人间的玩笑调侃/互怼、情绪化质问或抱怨（如「你过分了」「你真狠心」）、引用或讨论脏话本身（如「你说句脏话看看」）、复述他人骂人、对事不对人的批评、单独一个语气词——这些都不算辱骂",
  ad_spam: "广告垃圾：商业广告、引流推广、二维码/外链刷广告、微商直销",
  flood: "刷屏骚扰：短时间大量重复消息、无意义灌水、故意刷屏干扰他人",
};

/** 审核尺度：宽松（默认，只判明确违规）/ 标准 / 严格。老配置缺省视为宽松。 */
export type Strictness = "lenient" | "normal" | "strict";

/** 不同尺度下注入模型的判定门槛说明。 */
const STRICTNESS_RULES: Record<Strictness, string> = {
  lenient: "【判定尺度：宽松】只有消息明确、无歧义地违反规则时才判违规。任何拿不准、有多种理解、可能是玩笑/调侃/情绪话的，一律 none。宁可放过十句，不可错杀一句。",
  normal: "【判定尺度：标准】按规则明确含义判断，明显违规照常处理；对存在合理无害解释的语境仍应从宽判 none。",
  strict: "【判定尺度：严格】按规则字面从严判断，只要内容命中违规表述即判违规，语境宽容度最低。",
};

/** 分类中文名（群内 @ 通知与日志用；与客户端 pt.modCat.* 文案对应）。 */
export const CATEGORY_LABELS: Readonly<Record<string, string>> = Object.freeze({
  illegal: "违法违规",
  porn_gamble: "色情赌博",
  abuse: "辱骂人身攻击",
  ad_spam: "广告垃圾",
  flood: "刷屏骚扰",
  custom: "本群自定义群规",
  none: "本群公约",
});

/** 分级定义（注入模型，让模型只输出等级，不决定具体分钟数）。 */
const LEVEL_DEFS = [
  "none：不违规，或证据不足、无法确定、只是玩笑调侃/情绪话——拿不准一律 none",
  "light：明确违规但情节轻，如少量重复刷屏、出现了实质性不友好言辞（必须是确定的，不是「可能不友好」）",
  "medium：明显违规，如明确且带恶意的人身攻击、持续刷屏、一般广告引流",
  "severe：严重违规，如色情赌博、诈骗、违法内容、恶毒攻击；单个语气词/粗口（如「艹」）不算 severe，最多 light",
].join("\n");

/** 构造审核 system prompt。 */
export function moderationSystemPrompt(config: ModerationConfig): string {
  const categories = config.categories
    .filter((c) => CATEGORY_DEFS[c])
    .map((c) => `- ${c}：${CATEGORY_DEFS[c]}`);
  const rules = config.rules.filter(Boolean);
  const strictness = config.strictness === "strict" || config.strictness === "normal" ? config.strictness : "lenient";
  return [
    "你是 QQ 群的消息审核助手。判断用户消息是否违反下列规则，并给出严重程度等级。",
    "",
    STRICTNESS_RULES[strictness],
    "",
    "【审核原则·必须遵守】",
    "- 只依据下面列出的规则判断，不要引入你自己的额外标准。",
    "- 按语境判断真实意图，只看字面不够。熟人间的玩笑、调侃、互怼、撒娇、情绪化质问或抱怨（如「你过分了」「你真狠心啊」），都不算违规。",
    "- 引用、反驳、举报、讨论或复述某类内容（如「你说句脏话看看」「别发广告」）不算违规本身——提到不等于实施。",
    "- 单个语气词、粗口或单独一个字（如「艹」「靠」），没有针对具体的人辱骂，不算人身攻击；最多 light，拿不准判 none。",
    "- 【证据铁律】理由里如果出现「可能」「疑似」「似乎」「或许」「有点」「大概」「意味」等不确定词，说明你也没把握——此时必须判 none，绝不能不确定还处罚。",
    "- 【证据铁律】reason 必须写出消息里确切的违规原话或具体行为；写不出确定依据就判 none，不得用「包含不良信息」这类空话。",
    "- 宁可放过，不可错杀——误判会错误禁言真实用户，代价远大于漏判。",
    "",
    "【违规分类】",
    ...(categories.length ? categories : ["（未启用内置分类，只看下面的自定义群规）"]),
    "",
    ...(rules.length ? [
      "【本群自定义规则（优先遵循）】",
      ...rules.map((r, i) => `${i + 1}. ${r}`),
      "- 每一条都是本群明令禁止的内容。若规则写得很短（只有一个词、一个数字或一个符号，如「1」「+1」「加1」「皮皮涛」），视为禁止发送该词本身或以它为主体的灌水内容，不要因为「太短看不出违规」就判 none。",
      "- 多条规则含义相近时（如同时写了「1」「+1」「加1」），合并理解为同一条禁令，命中任意一种写法即算违规。",
      "- 但仍要避免误伤：对方消息只是在正常语句中恰好包含该词（如「1 楼」「版本 1」「我先 1 下」），并非在刷该内容时，判 none。",
      "- 判定自定义规则命中时，category 填 custom，level 至少 light；若规则本身写明是广告/辱骂/违法等，可填对应分类并给更高等级。",
      "",
    ] : []),
    "【严重程度等级】",
    LEVEL_DEFS,
    "",
    "【输出格式·严格遵守】",
    "只输出一个 JSON 对象，不要任何解释、不要 Markdown 代码围栏，格式：",
    '{"level":"none|light|medium|severe","category":"分类id或custom或none","reason":"一句话说明判定依据"}',
    "level=none 时 category 填 none，reason 可简短说明为何不违规。",
    "再次强调：判违规（light/medium/severe）时 reason 必须引用原文中确切的违规词句；写不出就判 none。",
    `category 只能是：${[...MODERATION_CATEGORIES, "custom", "none"].join(" / ")} 中的一个。`,
  ].join("\n");
}

export interface ModerationVerdict {
  level: MuteLevel;
  category: string;
  reason: string;
}

const VALID_LEVELS: MuteLevel[] = ["none", "light", "medium", "severe"];
const VALID_CATS = new Set<string>([...MODERATION_CATEGORIES, "custom", "none"]);

/**
 * 从模型输出里鲁棒解析 JSON。支持包 ```json``` 围栏、前后解释文字。
 * 解析失败一律返回 none（绝不误禁言）。
 */
export function parseVerdict(text: string): ModerationVerdict {
  const safe = (): ModerationVerdict => ({ level: "none", category: "none", reason: "" });
  if (!text || typeof text !== "string") return safe();
  // 去掉 markdown 代码围栏
  const cleaned = text.replace(/```(?:json)?/gi, "").trim();
  // 抓取第一个 {...} 块
  const m = /\{[\s\S]*?\}/.exec(cleaned);
  if (!m) return safe();
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(m[0]) as Record<string, unknown>;
  } catch {
    return safe();
  }
  const level = typeof obj.level === "string" ? obj.level.trim().toLowerCase() : "";
  if (!VALID_LEVELS.includes(level as MuteLevel)) return safe();
  const category = typeof obj.category === "string" && VALID_CATS.has(obj.category.trim())
    ? obj.category.trim()
    : "none";
  const reason = typeof obj.reason === "string" ? obj.reason.trim().slice(0, 200) : "";
  // 误判保护：模型自己都在理由里用不确定词，说明证据不足——即便它判了违规，也一律放行。
  // 真实违规的理由会引用确切原话（如「包含侮辱词『憨批』」），不含这些词，不受影响。
  if (level !== "none" && UNCERTAIN_RE.test(reason)) {
    return { level: "none", category: "none", reason: "证据不确定，已放行（模型理由含推测措辞）" };
  }
  return { level: level as MuteLevel, category, reason };
}

/** 模型理由中的推测措辞；出现即视为证据不足。 */
const UNCERTAIN_RE = /可能|疑似|似乎|或许|大概|有点|意味|倾向|估计|应该是|不确定|不太好说|某种程度上/;

/** 从配置里取该等级对应的禁言分钟数（0 = 不禁言）。 */
export function minutesForLevel(config: ModerationConfig, level: MuteLevel): number {
  if (level === "light") return config.durations.light;
  if (level === "medium") return config.durations.medium;
  if (level === "severe") return config.durations.severe;
  return 0;
}

export interface ModerateDeps {
  getLlm: () => ScriptGenLlm | undefined;
  resolveModel: (appId?: string) => { provider: string; model: string } | undefined;
}

/** 审核一条消息；返回判定结果。模型不可用时抛错（调用方决定如何降级）。 */
export async function moderateMessage(
  deps: ModerateDeps,
  appId: string,
  content: string,
  config: ModerationConfig,
): Promise<ModerationVerdict> {
  const llm = deps.getLlm();
  if (!llm || typeof llm.stream !== "function") throw new Error("宿主 LLM 服务不可用");
  const sel = deps.resolveModel(appId);
  if (!sel) throw new Error("该机器人未配置模型，无法进行 AI 审核");
  const stream = llm.stream({
    provider: sel.provider,
    model: sel.model,
    system: moderationSystemPrompt(config),
    messages: [
      createUserMessage({
        content: [{ type: "text", text: `请审核这条群消息：\n${content.slice(0, 2000)}` }],
        source: { kind: "user" },
      }),
    ],
    temperature: 0.1,
  });
  let out = "";
  for await (const chunk of stream) {
    if (chunk.type === "text-delta") out += chunk.text ?? "";
  }
  return parseVerdict(out);
}
