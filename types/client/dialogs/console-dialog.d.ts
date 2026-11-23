/**
 * 机器人管理控制台（点列表卡片弹出的主窗口）。
 *
 * 结构仿 WorkBuddy 设置：Modal 外壳 + 左侧单棵三级导航树 + 右侧内容区。
 *  - 一级：概览 / 运行 / 配置 / 群聊 / 频道 / 管理
 *  - 二级：各分组下的能力项（部分带子项，点开后展开三级）
 *  - 三级：能力项内部的子 Tab（如发言管理下的全员禁言、违规字样处置配置等）
 * 左侧是唯一导航入口，右侧只渲染焦点对应的内容——不再跳详情页、不再开独立窗口、
 * 也不在内嵌组件里重复一套导航（频道/群聊组件以 embedded 模式只出内容）。
 *
 * 所有显示文案走 i18n（console.* / gv.* / pt.*），组件用 useLocale() 跟随宿主语言。
 */
import * as React from "react";
import type { BotInfo, RpcCall } from "../types.js";
type ConfigPane = "session" | "policy" | "tune" | "override" | "manifest";
export declare function ConsoleDialog(props: {
    rpcCall: RpcCall;
    bot: BotInfo | null;
    groups: string[];
    onClose: () => void;
    onNotify: (text: string, tone: "error" | "success") => void;
    /** 配置类分区节点：与详情页共用同一份表单。 */
    configPanes: Record<ConfigPane, React.ReactNode>;
    /** 连接与移除面板：与详情页管理 Tab 共用同一份。 */
    connectionPane: React.ReactNode;
    /** 配置清单保存成功后的回读刷新。 */
    onConfigSaved: () => Promise<void>;
}): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
export {};
