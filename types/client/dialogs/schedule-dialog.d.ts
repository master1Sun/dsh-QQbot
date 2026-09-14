import type { RpcCall } from "../types.js";
export declare function ScheduleDialog(props: {
    rpcCall: RpcCall;
    /** 当前详情机器人：任务归属与新任务默认归属。 */
    detailAppId: string;
    onClose: () => void;
}): import("react").DetailedReactHTMLElement<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
