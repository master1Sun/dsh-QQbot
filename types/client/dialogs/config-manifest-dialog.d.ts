/**
 * 配置清单弹窗：把当前机器人的全部可配置字段以 JSON 形式展示，用户可直接编辑并保存写回。
 *
 * 能力：
 *  - 打开时拉取 config.get 的生效配置，序列化成格式化 JSON（含全部 54 个字段）；
 *  - 左侧 JSON 编辑器带行号，实时校验：JSON 语法 / 顶层结构 / 未知字段 /
 *    类型 / 枚举 / 数值区间 / 按群覆盖结构，逐条列出「哪个字段、错在哪」；
 *  - 点击错误条目自动定位到编辑器里对应的行；
 *  - 右侧帮助面板按分组列出每个字段的类型、取值与中英说明，支持搜索；
 *  - 校验全部通过后才允许保存，保存写回 config.save（仅作用于当前详情机器人）。
 */
import * as React from "react";
import type { RpcCall } from "../types.js";
export declare function ConfigManifestDialog(props: {
    appId: string;
    rpcCall: RpcCall;
    onClose: () => void;
    /** 保存成功后由父组件刷新配置并提示。 */
    onSaved: () => void;
}): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
