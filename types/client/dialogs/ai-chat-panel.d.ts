/**
 * AI 操作执行记录（群聊管理 / 频道管理共用）。
 *
 * 触发入口不在本面板：用户在 agent 聊天里直接说人话，宿主工具 qqbot_manage
 * 会执行并把聊天原话 / 识别来源 / 动作 / 结果留痕；这里只做只读展示。
 */
import * as React from "react";
import type { RpcCall } from "../types.js";
export interface AiEntityLite {
    id: string;
    name: string;
    kind: "member" | "channel" | "role";
}
/** 复用的只读记录面板。context 变化时（换群 / 换频道）由调用方传 key 重挂。 */
export declare function AiOpsLogPanel(props: {
    rpcCall: RpcCall;
    appId: string;
    scope: "group" | "guild";
    groupOpenid?: string;
    guildId?: string;
    channelId?: string;
    /** 兼容旧调用点；记录由宿主直接生成，不再需要客户端传实体表。 */
    entities?: AiEntityLite[];
}): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
/** 兼容旧 import 名。 */
export declare const AiChatPanel: typeof AiOpsLogPanel;
