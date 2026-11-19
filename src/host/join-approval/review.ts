/**
 * 入群申请 AI 审核引擎：把一条入群申请的介绍信息交给宿主 LLM，
 * 判断是否满足用户配置的入群要求，决定是否自动通过。
 *
 * 设计原则（误放行代价高，宁可留人工不可错放）：
 *  - 只有模型明确输出 pass=true 才自动通过；解析失败 / 模型抽风一律不通过（保留人工）；
 *  - 只依据用户配置的入群要求 + 明显的风险信号判断，不引入模型自己的额外标准；
 *  - 有官方风险提示（risk_tips）时不自动通过，交人工复核；
 *  - 模型调用异常向上抛，由调用方捕获并记录，不影响其它申请的处理。
 */
import { createUserMessage } from "@deepseek-ai/dsh-llm";
import type { ScriptGenLlm } from "../schedule/script-gen.js";
import type { JoinApprovalConfig } from "./store.js";

export interface JoinReviewDeps {
  getLlm: () => ScriptGenLlm | undefined;
  resolveModel: (appId?: string) => { provider: string; model: string } | undefined;
}

export interface JoinReviewInput {
  username: string;
  /** 入群介绍 / 验证回答。 */
  intro: string;
  /** 官方风险提示（有值则倾向人工复核）。 */
  riskTips: string;
  /** 用户配置的入群要求。 */
  config: JoinApprovalConfig;
}

export interface JoinReviewVerdict {
  /** 是否自动通过。 */
  pass: boolean;
  /** 判定理由（展示在日志 / 提示里）。 */
  reason: string;
}

/** 构造审核 system prompt。 */
export function joinReviewSystemPrompt(config: JoinApprovalConfig): string {
  const reqs = config.requirements.filter(Boolean);
  return [
    "你是 QQ 群的入群申请审核助手。用户申请入群时填写了一段介绍或回答了验证问题，你要判断这段介绍是否满足群主设定的入群要求。",
    "",
    "【审核原则·必须遵守】",
    "- 只依据下面列出的入群要求判断，不要引入你自己的额外标准。",
    "- 介绍明显满足全部要求时 pass=true；不满足、信息不足、或你拿不准时 pass=false。",
    "- 宁可错留人工，不可错放行：判断要保守，符合才放行。",
    "",
    "【入群要求】",
    ...(reqs.length ? reqs.map((r, i) => `${i + 1}. ${r}`) : ["（群主未写具体要求，此时只有介绍内容积极、无任何可疑信息才 pass=true，否则 pass=false）"]),
    "",
    "【输出格式·严格遵守】",
    "只输出一个 JSON 对象，不要任何解释、不要 Markdown 代码围栏，格式：",
    '{"pass":true或false,"reason":"一句话说明判定依据"}',
  ].join("\n");
}

/** 从模型输出里鲁棒解析 JSON；解析失败一律 pass=false（保留人工）。 */
export function parseJoinVerdict(text: string): JoinReviewVerdict {
  const safe = (): JoinReviewVerdict => ({ pass: false, reason: "" });
  if (!text || typeof text !== "string") return safe();
  const cleaned = text.replace(/```(?:json)?/gi, "").trim();
  const m = /\{[\s\S]*?\}/.exec(cleaned);
  if (!m) return safe();
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(m[0]) as Record<string, unknown>;
  } catch {
    return safe();
  }
  const pass = obj.pass === true;
  const reason = typeof obj.reason === "string" ? obj.reason.trim().slice(0, 200) : "";
  return { pass, reason };
}

/** 审核一条入群申请。模型不可用时抛错（调用方决定如何降级）。 */
export async function reviewJoinRequest(
  deps: JoinReviewDeps,
  appId: string,
  input: JoinReviewInput,
): Promise<JoinReviewVerdict> {
  const llm = deps.getLlm();
  if (!llm || typeof llm.stream !== "function") throw new Error("宿主 LLM 服务不可用");
  const sel = deps.resolveModel(appId);
  if (!sel) throw new Error("该机器人未配置模型，无法进行 AI 入群审核");
  const intro = input.intro.slice(0, 2000);
  const lines = [`申请人昵称：${input.username || "（未知）"}`, `入群介绍 / 验证回答：${intro || "（空）"}`];
  if (input.riskTips) lines.push(`平台风险提示：${input.riskTips.slice(0, 300)}`);
  const stream = llm.stream({
    provider: sel.provider,
    model: sel.model,
    system: joinReviewSystemPrompt(input.config),
    messages: [
      createUserMessage({
        content: [{ type: "text", text: `请审核这条入群申请：\n${lines.join("\n")}` }],
        source: { kind: "user" },
      }),
    ],
    temperature: 0.1,
  });
  let out = "";
  for await (const chunk of stream) {
    if (chunk.type === "text-delta") out += chunk.text ?? "";
  }
  const verdict = parseJoinVerdict(out);
  // 官方风险提示存在时不自动通过，交人工复核（保守）。
  if (verdict.pass && input.riskTips.trim()) {
    return { pass: false, reason: `平台提示存在风险，交人工复核${verdict.reason ? `：${verdict.reason}` : ""}` };
  }
  return verdict;
}
