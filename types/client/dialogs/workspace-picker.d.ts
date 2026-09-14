/**
 * 工作区目录选择弹窗（host: workspace.browse，只读逐级浏览）。
 * 浏览状态自包含：挂载时从 initialPath 开始浏览；选定后回调 onPick(dir)，
 * 由父组件负责保存配置、提示并关闭弹窗。
 */
import * as React from "react";
import type { RpcCall } from "../types.js";
export declare function WorkspacePickerDialog(props: {
    rpcCall: RpcCall;
    /** 打开时浏览的初始目录（机器人当前 workspacePath，空串=从默认根开始）。 */
    initialPath: string;
    onClose: () => void;
    /** 选定目录：父组件保存配置、提示并关闭弹窗。 */
    onPick: (dir: string) => void;
}): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
