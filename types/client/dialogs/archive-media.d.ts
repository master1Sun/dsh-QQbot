/**
 * 归档媒体展示（图片缩略图 / 视频 / 文件）。
 *
 * 媒体本身已由宿主落地到 ~/.dsh/qqbot/archive/<images|videos|files>/
 * （平台的附件地址有实效，事后回看必须靠本地副本），前端通过 RPC 端点
 * archive.media 取回 base64 再渲染。
 *
 * 懒加载：一次归档可能上百条记录，逐个立即拉取会打爆 RPC 通道。这里用
 * IntersectionObserver，只有滚动进视口的媒体才去取数据；图片点击可展开大图。
 *
 * 注意：视频与文件体积可能很大，一律按需取（点开才拉），不做自动预取。
 */
import * as React from "react";
import type { RpcCall } from "../types.js";
interface ArchivedMediaItem {
    kind?: string;
    file?: string;
    name?: string;
    mime?: string;
    size?: number;
}
export declare function ArchivedMediaView(props: {
    rpcCall: RpcCall;
    item: ArchivedMediaItem;
    /** 是否展开（大图 / 播放视频）。 */
    expanded: boolean;
    onToggle: () => void;
}): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> | null;
export {};
