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
  abuse: "辱骂人身攻击：辱骂、人身攻击、歧视、恶意诅咒、骚扰特定成员",
  ad_spam: "广告垃圾：商业广告、引流推广、二维码/外链刷广告、微商直销",
  flood: "刷屏骚扰：短时间大量重复消息、无意义灌水、故意刷屏干扰他人",
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
  "none：不违规，或证据不足、无法确定——拿不准一律 none",
  "light：轻微违规，如轻度刷屏、轻微不友好言辞，警告性质的处置",
  "medium：明显违规，如明确的人身攻击、持续刷屏、一般广告引流",
  "severe：严重违规，如色情赌博、诈骗、违法内容、恶毒攻击",
].join("\n");

/** 构造审核 system prompt。 */
export function moderationSystemPrompt(config: ModerationConfig): string {
  const categories = config.categories
    .filter((c) => CATEGORY_DEFS[c])
    .map((c) => `- ${c}：${CATEGORY_DEFS[c]}`);
  const rules = config.rules.filter(Boolean);
  return [
    "你是 QQ 群的消息审核助手。判断用户消息是否违反下列规则，并给出严重程度等级。",
    "",
    "【审核原则·必须遵守】",
    "- 只依据下面列出的规则判断，不要引入你自己的额外标准。",
    "- 内置分类证据必须明确：拿不准、可能是玩笑/调侃/正常讨论的，一律判 none。",
    "- 引用、反驳、举报某违规内容（如「别发广告」）不算违规本身。",
    "- 宁可放过，不可错杀——误判会错误禁言真实用户。",
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
  return { level: level as MuteLevel, category, reason };
}

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
