/**
 * 平台能力（QQ OpenAPI 群管理 + 20260810~20261116 新增接口的设置页入口）：
 *
 * 【分类一 · 群聊管理】从「选择群」开始（步骤 1），选群后自动检测机器人群内权限（GET /bot_state）：
 *  - 子标签：群资料（GET /info）/ 群成员（列表/详情/禁言/解除/移除）/ 群黑名单 /
 *            入群审批（拉取/通过/拒绝）/ 审批策略（创建/启停/增删群/执行/白名单/删除）
 *  未选群时群能力区显示引导空态；无管理员权限时，所有需权限的操作禁用并提示。
 *
 * 【分类二 · 通用能力】与群无关：分享链接 / 自定义菜单 / 素材上传 / 图文卡片，
 *  同样以子标签切换，避免所有卡片平铺造成界面错乱。
 * 两大分类以顶层 tab 切换；AI 操作在 agent 聊天里触发，这里只保留执行记录 Tab。
 *
 * 所有 openid/群 id 都通过 GroupPicker 选择或搜索，避免手抄错。
 */
import * as React from "react";
import type { RpcCall } from "../types.js";
/** 由外层控制台单棵导航树驱动的焦点：指定二级导航项及其三级子 Tab。 */
export interface PlatformFocus {
    nav: string;
    joinTab?: "auto" | "manual" | "records";
    modTab?: "config" | "logs" | "muted";
}
export declare function PlatformTools({ rpcCall, appId, groups, onNotify, focus, embedded, group: groupProp, onGroupChange }: {
    rpcCall: RpcCall;
    appId: string;
    groups: string[];
    /** 只有报错与「操作成功」这类需要用户知道的结果才上报，由详情页在顶部吸顶展示。 */
    onNotify?: (text: string, tone: "error" | "success") => void;
    /** 由外层控制台单棵导航树驱动的焦点；传入后隐藏本组件自带导航。 */
    focus?: PlatformFocus;
    /** 嵌入控制台内容区：隐藏左侧导航与面板内二级 Tab 条。 */
    embedded?: boolean;
    /** 控制台持有的选中群：切换菜单后仍保留，避免每次重新选群。 */
    group?: string;
    onGroupChange?: (g: string) => void;
}): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
