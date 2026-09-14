/**
 * 定时任务管理弹窗（schedule.list / schedule.add(编辑) / schedule.remove）。
 * 列表 / 编辑双视图；范围 Tab（当前机器人 | 所有机器人）。
 * 状态自包含：挂载即拉取当前机器人名下的任务列表。
 *
 * 支持四种定时条件（对标 OpenClaw）：
 *  - daily：每天 HH:mm（可附加 weekdays 周几过滤）
 *  - interval：每 N 分钟（可附加 weekdays 周几过滤）
 *  - cron：标准 5 段表达式 + 时区（下拉选择）
 *  - at：一次性绝对时间，到点后自动删除
 * 与三种执行方式：
 *  - text：直接发送文本
 *  - ai：把内容当指令交给 AI 生成后回复
 *  - tool：到点执行一条命令（py / ps1 / bat / node …），捕获输出后推送给用户
 *    （resultMode=ai 时先把输出交给 AI 整理成播报，再推送）
 */
import * as React from "react";
import type { RpcCall } from "./types.js";
/** 周几按钮当前语言下的短标签。 */
export declare function wdLabel(v: number): string;
export declare function ScheduleManager(props: {
    rpcCall: RpcCall;
    /** 当前详情机器人：scope=current 的任务归属、新任务的默认归属。 */
    detailAppId: string;
    /** 嵌入场景（右侧面板）：锁定范围 current=该机器人 / all=所有机器人，并隐藏内部范围切换 Tab。 */
    forceScope?: "current" | "all";
    /** 弹窗场景提供关闭回调；嵌入场景不传则不渲染关闭按钮。 */
    onClose?: () => void;
}): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
