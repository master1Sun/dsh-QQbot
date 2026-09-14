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
/** 剥离全部隐藏标签块并清理残留标签；`enabled=false` 时原样返回。 */
export declare function sanitizeOutgoingText(raw: string, { enabled }?: {
    enabled?: boolean | undefined;
}): string;
