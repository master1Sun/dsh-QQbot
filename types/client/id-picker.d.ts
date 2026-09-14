/**
 * 接收方 openid 选择器（可搜索下拉）：候选来自消息归档聚合（archive.chats），
 * 每项显示「名称 + openid」，点击填入；同时保留手工输入（归档无记录时可直接粘贴）。
 * - 单聊候选显示用户昵称；群聊平台不下发群名，用该群最近发言者昵称辅助辨认。
 * - 输入框内容即过滤词：按 openid / 名称模糊匹配，清空后展示全部候选。
 */
import * as React from "react";
import type { RpcCall } from "./types.js";
/** 归档会话聚合项（与宿主 ArchivedChat 对应）。 */
export interface ChatOption {
    scope: "group" | "c2c";
    openid: string;
    /** 单聊=用户昵称；群聊为空。 */
    name: string;
    /** 群聊=该群最近一次发言者昵称。 */
    lastSenderName: string;
    lastTs: string;
    count: number;
}
/** 拉取当前机器人的归档会话聚合（archive.chats）；appId 传空走主机器人。 */
export declare function useArchiveChats(rpcCall: RpcCall, appId: string): {
    chats: ChatOption[];
    loading: boolean;
    error: string;
    reload: () => Promise<void>;
};
/**
 * openid 可搜索下拉：input + 绝对定位候选菜单。
 * 候选项 onMouseDown preventDefault 保住输入框焦点，点击后不闪断；Esc 关闭。
 */
export declare function OpenIdPicker(props: {
    chats: ChatOption[];
    scope: "group" | "c2c";
    value: string;
    onChange: (v: string) => void;
    readOnly?: boolean;
    loading?: boolean;
    error?: string;
    placeholder?: string;
    ariaLabel?: string;
}): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
