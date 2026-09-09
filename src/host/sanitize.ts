/**
 * 消息净化（对齐 openclaw outbound/sanitize 的防泄漏思路）：
 *
 * 模型回复里可能夹带框架注入的隐藏块（system-reminder、<think> 推理过程等）。
 * 这些内容进入 QQ 聊天既泄漏内部上下文、也会被用户当成机器人"幻觉"。
 * 所有 AI 生成 → 发给 QQ 用户的内容（回复泵 / 定时消息 / AI 主动发送）
 * 在出站前统一剥离这些标签块。
 *
 * 实现：单遍栈式扫描——隐藏标签族的深度计数，深度归零即删除整块；
 * 扫描结束仍在块内（未闭合/截断）则从块起点截断到末尾；
 * 孤立闭标签残留单独清理；其他标签（如 <code>）不受影响。
 * 净化只影响发送内容，归档与模型上下文保留原文。
 * 入站用户消息不净化：保留用户原文（引用/去重指纹/归档依赖原文），
 * 提示注入由 rule.ts 的分层提示词与"外部未信任数据"标注缓解。
 */

/** 需要剥离的隐藏块标签（小写）。system-reminder / previous_response 是宿主注入，
 *  think/thinking/reasoning 是推理模型常见的思考块标签。 */
const HIDDEN_TAGS = ["system-reminder", "previous_response", "think", "thinking", "reasoning"] as const;

const TOKEN = new RegExp(`<\\s*(\\/?)\\s*(?:${HIDDEN_TAGS.join("|")})\\s*>`, "gi");
const CLOSE_ALL = new RegExp(`<\\s*\\/\\s*(?:${HIDDEN_TAGS.join("|")})\\s*>`, "gi");

/** 剥离全部隐藏标签块并清理残留标签；`enabled=false` 时原样返回。 */
export function sanitizeOutgoingText(raw: string, { enabled = true } = {}): string {
  if (!enabled) return raw;
  let text = raw;
  if (text.includes("<")) {
    // 栈式扫描隐藏标签族：记录要删除的 [start, end) 区间。
    const ranges: Array<[number, number]> = [];
    let depth = 0;
    let start = -1;
    TOKEN.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = TOKEN.exec(text)) !== null) {
      if (m[1] !== "/") {
        if (depth === 0) start = m.index;
        depth += 1;
      } else if (depth > 0) {
        depth -= 1;
        if (depth === 0) ranges.push([start, m.index + m[0].length]);
      }
    }
    // 截断：扫描结束仍在块内（未闭合标签，模型截断常见）→ 块起点到末尾全删。
    if (depth > 0 && start >= 0) ranges.push([start, text.length]);
    // 从后往前应用删除区间（前面的区间不受影响）。
    for (let i = ranges.length - 1; i >= 0; i -= 1) {
      const [from, to] = ranges[i]!;
      text = text.slice(0, from) + text.slice(to);
    }
    // 孤立闭标签残留（没有对应开标签）。
    text = text.replace(CLOSE_ALL, "");
  }
  // 压缩多余空行，避免剥离后出现大段空白。
  text = text.replace(/\n{3,}/g, "\n\n");
  return text.trim();
}
