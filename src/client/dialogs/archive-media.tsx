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
import { h, t } from "../i18n/index.js";
import type { RpcCall } from "../types.js";

interface ArchivedMediaItem {
  kind?: string;
  file?: string;
  name?: string;
  mime?: string;
  size?: number;
}

/** 已取回媒体的缓存（同一 kind+file 只取一次）。 */
const mediaCache = new Map<string, string>();

function cacheKey(kind: string, file: string): string {
  return `${kind}:${file}`;
}

/** 字节数 → 可读体积。 */
function humanSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function ArchivedMediaView(props: {
  rpcCall: RpcCall;
  item: ArchivedMediaItem;
  /** 是否展开（大图 / 播放视频）。 */
  expanded: boolean;
  onToggle: () => void;
}) {
  const { rpcCall, item, expanded, onToggle } = props;
  const kind = item.kind === "video" || item.kind === "file" ? item.kind : "image";
  const file = String(item.file ?? "");
  const key = cacheKey(kind, file);
  const [src, setSrc] = React.useState<string>(() => mediaCache.get(key) ?? "");
  const [failed, setFailed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const holderRef = React.useRef<HTMLDivElement | null>(null);

  const load = React.useCallback(async () => {
    if (!file || loading) return;
    setLoading(true);
    try {
      const res = await rpcCall("archive.media", { kind, file });
      if (!res.ok) {
        setFailed(true);
        return;
      }
      const data = (res as any).value ?? (res as any).data ?? {};
      const mime = String(data.mime ?? "application/octet-stream");
      const base64 = String(data.base64 ?? "");
      if (!base64) {
        setFailed(true);
        return;
      }
      const url = `data:${mime};base64,${base64}`;
      mediaCache.set(key, url);
      setSrc(url);
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [file, kind, key, loading, rpcCall]);

  // 懒加载：图片进入视口才去宿主取数据；视频与文件等用户点开再取。
  React.useEffect(() => {
    if (src || failed || !file || kind !== "image") return undefined;
    const node = holderRef.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver !== "function") {
      void load();
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        void load();
      }
    }, { rootMargin: "200px" });
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, kind, src, failed]);

  if (!file) return null;

  const label = item.name || (kind === "image" ? t("archive.image") : kind === "video" ? t("archive.video") : t("archive.file"));
  const sizeText = humanSize(Number(item.size ?? 0));

  if (kind === "file") {
    // 文件不做内联预览：给一个可下载的入口（base64 data URL 直接下载）。
    return h("div", { className: "qbot-archMedia is-file", ref: holderRef },
      h("button", {
        type: "button",
        className: "qbot-archMediaBtn is-file",
        onClick: () => {
          if (!src) void load();
          else {
            const a = document.createElement("a");
            a.href = src;
            a.download = label;
            a.click();
          }
        },
        title: label,
        "aria-label": label,
      },
        h("span", { className: "qbot-archMediaIcon", "aria-hidden": "true" }, "⭳"),
        h("span", { className: "qbot-archMediaName" }, label),
        sizeText ? h("span", { className: "qbot-archMediaSize" }, sizeText) : null),
      failed ? h("span", { className: "qbot-archMediaErr" }, t("archive.mediaFailed")) : null);
  }

  if (kind === "video") {
    return h("div", { className: "qbot-archMedia is-video", ref: holderRef },
      expanded
        ? h("video", {
            className: "qbot-archMediaVideo",
            src: src || undefined,
            controls: true,
            preload: "metadata",
            poster: undefined,
          })
        : h("button", {
            type: "button",
            className: "qbot-archMediaBtn is-video",
            onClick: () => {
              onToggle();
              if (!src) void load();
            },
            title: label,
            "aria-label": label,
          },
            h("span", { className: "qbot-archMediaIcon", "aria-hidden": "true" }, "▶"),
            h("span", { className: "qbot-archMediaName" }, label),
            sizeText ? h("span", { className: "qbot-archMediaSize" }, sizeText) : null),
      failed ? h("span", { className: "qbot-archMediaErr" }, t("archive.mediaFailed")) : null);
  }

  // 图片：缩略图 + 点击展开大图。
  return h("div", { className: "qbot-archMedia", ref: holderRef },
    h("button", {
      type: "button",
      className: `qbot-archMediaBtn${expanded ? " is-expanded" : ""}`,
      onClick: onToggle,
      title: label,
      "aria-label": label,
    },
      src
        ? h("img", { className: "qbot-archMediaImg", src, alt: label, loading: "lazy" })
        : h("span", { className: "qbot-archMediaPlaceholder" },
            failed ? t("archive.mediaFailed") : (loading ? t("archive.mediaLoading") : t("archive.image"))),
      h("span", { className: "qbot-archMediaName" }, label)));
}
