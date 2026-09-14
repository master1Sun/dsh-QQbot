/**
 * 引用处理：出站原生引用卡片（message_reference）+ 入站引用上下文。
 *
 * 出站引用：由 reply 泵在 sendReply 时通过 quoteMsgId 携带 `message_reference`，
 * 且走主动消息通道（不传 msg_id）——实测 msg_id 与 message_reference 同传时，
 * 手机端同一条内容会出现两次（电脑端正常）；仅 message_reference 是
 * 「有引用且内容只出现一次」的唯一组合（详见 reply.ts / api.ts 注释）。
 * 入站引用：用户引用了别人的消息时，把本地索引恢复的原文注入模型上下文。
 */
/** 折叠为单行并截断（超长加省略号），供入站引用上下文展示。 */
export declare function quoteBody(content: string, maxChars: number): string;
/**
 * 入站引用上下文：用户引用了聊天里某条消息时，把原文交给模型看。
 * 明确标注为外部未信任数据，避免模型把引用内容当成指令执行。
 */
export declare function formatInboundQuoteContext(entry: {
    senderName: string;
    sender: string;
    content: string;
    timestamp: string;
} | null, maxChars: number): string;
