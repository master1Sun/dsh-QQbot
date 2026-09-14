/**
 * dsh-qqbot 设置界面 — 挂进 DSH 设置页「QQ 机器人」。
 *
 * 界面完全模仿 @xmanrui/dsh-im 的客户端设置面板（无左侧导航栏，仅右侧面板）：
 * 标题栏品牌区 + 卡片 radius 14 + #1677ff 主色 + 状态圆点 + 分段 Tab +
 * 编号步骤列表 + 等宽输入框，配色/字体/阴影全部对齐 dsh-im 的
 * --dsw-alias-* 设计令牌（含浅色回退）。
 *
 * 结构（多机器人）：
 *   机器人列表 → 点击卡片进详情（连接状态 / 行为配置）
 *   「添加机器人」→ 分段 Tab（扫码登录 | 手动填写），配置成功才开放行为配置。
 * 所有可枚举配置（工作区 / 模型 / Preset / 数值参数）均为下拉选择。
 *
 * 通过 connection.rpc 与 host 管理服务通信（/qqbot-settings 通道）。
 * 模块契约对齐 dsh-im / dsh 0.1.5-rc.1：导出 name/apply/inject，
 * ctx.slots.inject("settings.section", () => ctx.slots.register(spec, 函数组件))。
 *
 * 模块拆分（单一入口不变：src/client/index.tsx，esbuild 打包为 lib/client.js）：
 *   types.ts / meta.ts / glyphs.tsx / ui.tsx / styles.ts — 类型、配置元数据、
 *   图标、基础控件与工具、样式表；add-bot-view.tsx — 添加机器人视图；
 *   dialogs/*.tsx — 目录选择 / 定时消息 / 按群覆盖 / 消息归档四个弹窗。
 */
import * as React from "react";
import { type RpcCall } from "./types.js";
export declare const name = "qqbot-settings";
export declare const inject: string[];
export declare function QqbotSettingsTab({ rpcCall }: {
    rpcCall: RpcCall;
}): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
export declare function apply(ctx: any): void;
