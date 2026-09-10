/**
 * 添加机器人视图：分段 Tab（扫码登录 | 手动填写）。
 *
 * 状态自包含：二维码快照与轮询、手动凭据表单、倒计时心跳。
 * 扫码确认 / 凭据保存成功后回调 onBotReady(appId)，由父组件刷新数据
 * 并跳转机器人详情页（本组件随之卸载，状态自动复位）。
 */
import * as React from "react";
import { fmt, h, t } from "./i18n/index.js";
import type { QrSnapshot, RpcCall } from "./types.js";
import { QqLogoGlyph } from "./glyphs.js";
import { Field, StateLabel, TextInput, errText, formatRemaining, val } from "./ui.js";

export function AddBotView(props: {
  rpcCall: RpcCall;
  /** 顶部提示条（notice 由父组件持有，跨视图延续显示）。 */
  notice: string;
  setNotice: (text: string) => void;
  /** 接入成功（扫码确认或手动保存）：父组件刷新并跳转详情。 */
  onBotReady: (appId: string) => Promise<void> | void;
  /** 返回列表。 */
  onBack: () => void;
}) {
  const { rpcCall, notice, setNotice, onBotReady, onBack } = props;
  const [addTab, setAddTab] = React.useState<"qr" | "manual">("qr");
  const [qr, setQr] = React.useState<QrSnapshot | null>(null);
  const [manual, setManual] = React.useState({ appId: "", appSecret: "" });
  const [now, setNow] = React.useState(Date.now());
  const pollRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // 扫码进行中：每秒走表，驱动二维码倒计时进度条（对齐 dsh-im QrPanel）。
  React.useEffect(() => {
    if (qr?.status !== "pending") return undefined;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [qr?.status, qr?.expiresAt]);

  // 卸载即停止轮询（原实现挂在设置 tab 级 effect 上，随视图拆分一并迁入）。
  React.useEffect(() => () => {
    if (pollRef.current) clearInterval(pollRef.current);
  }, []);

  // ── 添加机器人：扫码（Tab 1） ────────────────────────────────────────────────
  const startQr = async () => {
    setNotice("");
    const res = await rpcCall("qr.start");
    const snap = (res.ok ? val(res) : { status: "failure", error: errText(res.error) }) as QrSnapshot;
    setQr(snap);
    if (snap.status === "pending" || snap.status === "success") {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(async () => {
        const state = await rpcCall("qr.state");
        const current = (state.ok ? val(state) : { status: "failure" }) as QrSnapshot;
        setQr(current);
        if (current.status === "success" || current.status === "failure" || current.status === "idle") {
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = null;
          if (current.status === "success") {
            setNotice(fmt("notice.qrLinked", current.appId ?? ""));
            await onBotReady(current.appId ?? "");
          }
        }
      }, 2000);
    }
  };

  const cancelQr = async () => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
    const res = await rpcCall("qr.cancel");
    setQr((res.ok ? val(res) : null) as QrSnapshot | null);
  };

  // ── 添加机器人：手动填写（Tab 2） ────────────────────────────────────────────
  const saveManual = async () => {
    setNotice("");
    const res = await rpcCall("credentials.save", manual);
    if (res.ok) {
      const appId = (val(res)?.appId as string) || manual.appId;
      setManual({ appId: "", appSecret: "" });
      setNotice(fmt("notice.credentialsSaved", appId));
      await onBotReady(appId);
    } else {
      setNotice(fmt("notice.saveFailedPrefix", errText(res.error)));
    }
  };

  // ═══ 添加视图（panel 内容，分段 Tab：扫码 | 手动） ══════════════════════════
  // 文案原则：只写界面/服务端真实具备的能力（生成二维码 → 扫码 → 自动落盘 → 跳转详情），
  // 不写未接入的入口（如终端 CLI 命令，本包未注册 bin）。
  const QR_DURATION_MS = 5 * 60_000;
  const qrRemaining = qr?.status === "pending" && qr?.expiresAt ? Math.max(0, qr.expiresAt - now) : 0;
  const qrProgress = Math.round(Math.min(1, qrRemaining / QR_DURATION_MS) * 100);
  const qrPending = qr?.status === "pending";
  /** pending 但图片还没到位：SDK 正在自动换下一张。 */
  const qrRefreshing = qrPending && !qr?.qrCodeDataUrl;

  /**
   * 引导块：小标题 + 编号步骤（每步「动作 + 一句说明」）。
   * 构成页面第二层层次，避免长段文字糊在一起。
   */
  const guideBlock = (title: string, steps: Array<{ title: string; desc: string }>) =>
    h("div", { className: "qbot-guideBlock" },
      h("span", { className: "qbot-guideTitle" }, title),
      h("ol", { className: "qbot-steps is-rich" },
        steps.map((s) => h("li", { key: s.title },
          h("strong", null, s.title),
          h("span", null, s.desc)))));

  /** 补充说明：只陈述真实行为（落盘位置、生效时机、限制），不承诺未实现的能力。 */
  const noteList = (notes: string[]) =>
    h("div", { className: "qbot-noteList" },
      h("span", { className: "qbot-noteTitle" }, t("common.note")),
      h("ul", null, notes.map((n, i) => h("li", { key: i }, n))));

  const qrStatusText = qr?.status === "success" ? t("qr.linked")
    : qr?.status === "failure" ? t("qr.failed")
      : qrRefreshing ? t("qr.refreshing")
        : qrPending ? t("qr.waitingScan")
          : t("qr.notGenerated");
  const qrStatusTone = qr?.status === "success" ? "success"
    : qr?.status === "failure" ? "error"
      : qrPending ? "warning"
        : "neutral";

  const qrPane = h("section", { className: "qbot-surfaceCard" },
    h("div", { className: "qbot-surfaceBody qbot-qrLayout" },
      h("div", { className: "qbot-qrColumn" },
        h("div", { className: "qbot-qrFrame" },
          qr?.qrCodeDataUrl
            ? h("img", { src: qr.qrCodeDataUrl, alt: t("qr.alt") })
            : h("div", { className: "qbot-qrPlaceholder" },
                h("span", { className: "qbot-qrPlaceholderIcon", "aria-hidden": "true" }, h(QqLogoGlyph)),
                h("strong", null, qrRefreshing ? t("qr.refreshingNow") : t("qr.noQrYet")),
                h("span", { className: "qbot-qrPlaceholderHint" },
                  qrRefreshing ? t("qr.soonNewQr") : t("qr.clickGenerate")))),
        h("div", { className: "qbot-countdown" },
          h("div", { className: "qbot-countdownTop" },
            h("span", null, t("qr.validFor")),
            h("strong", null, qrPending && qr?.qrCodeDataUrl ? formatRemaining(qrRemaining) : "--:--")),
          h("div", { className: "qbot-progress", style: { "--qbot-progress": `${qrProgress}%` } as any }, h("span"))),
        h("div", { className: "qbot-qrActions" },
          h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: startQr },
            qrPending ? t("qr.regenerate") : t("qr.generate")),
          qrPending
            ? h("button", { className: "qbot-btn", type: "button", onClick: cancelQr }, t("qr.cancelScan"))
            : null)),
      h("div", { className: "qbot-qrCopy" },
        StateLabel({ tone: qrStatusTone, text: qrStatusText }),
        h("h3", null, t("qr.title")),
        h("p", { className: "qbot-qrLead" },
          t("qr.intro")),
        guideBlock(t("qr.steps"), [
          { title: t("qr.generate"), desc: t("qr.step1") },
          { title: t("qr.stepTitleScan"), desc: t("qr.step2") },
          { title: t("qr.stepTitleConfirm"), desc: t("qr.step3") },
          { title: t("qr.stepTitleRedirect"), desc: t("qr.step4") },
        ]),
        qr?.status === "failure" ? h("p", { className: "qbot-qrError" }, qr.error ?? t("qr.failed")) : null,
        noteList([
          t("qr.note1"),
          t("qr.note2"),
          t("qr.note3"),
        ]))));

  const manualPane = h("section", { className: "qbot-surfaceCard" },
    h("div", { className: "qbot-surfaceBody qbot-manualPanel" },
      h("div", { className: "qbot-copyHead" },
        h("h3", null, t("manual.title")),
        h("p", null, t("manual.intro"))),
      guideBlock(t("manual.step1Title"), [
        { title: t("manual.openPlatform"), desc: t("manual.step1a") },
        { title: t("manual.pickBot"), desc: t("manual.step1b") },
        { title: t("manual.copyCreds"), desc: t("manual.step1c") },
      ]),
      h("div", { className: "qbot-guideBlock" },
        h("span", { className: "qbot-guideTitle" }, t("manual.step2Title")),
        h("div", { className: "qbot-credentialForm" },
          Field({ label: "AppID" },
            TextInput({
              value: manual.appId,
              placeholder: t("manual.appIdPlaceholder"),
              onChange: (e: any) => setManual({ ...manual, appId: e.target.value }),
            })),
          Field({ label: "AppSecret" },
            TextInput({
              type: "password",
              value: manual.appSecret,
              placeholder: t("manual.appSecretPlaceholder"),
              onChange: (e: any) => setManual({ ...manual, appSecret: e.target.value }),
            }))),
        h("div", { className: "qbot-credentialActions" },
          h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: saveManual }, t("manual.saveAndEnable")))),
      noteList([
        t("manual.note1"),
        t("manual.note2"),
        t("manual.note3"),
        t("manual.note4"),
      ])));

  const addView = h("div", { className: "qbot-channelPage qbot-addView" },
    notice ? h("div", { className: "qbot-infoNotice" }, notice) : null,
    h("div", { className: "qbot-addNav" },
      h("button", { className: "qbot-btn", type: "button", onClick: onBack }, t("add.backToList"))),
    h("header", { className: "qbot-addHead" },
      h("h2", null, t("add.title")),
      h("p", null,
        t("add.intro"))),
    h("div", { className: "qbot-segTabs", role: "tablist" },
      h("button", {
        type: "button", role: "tab", "aria-selected": addTab === "qr",
        onClick: () => setAddTab("qr"),
      }, t("qr.tabScan")),
      h("button", {
        type: "button", role: "tab", "aria-selected": addTab === "manual",
        onClick: () => setAddTab("manual"),
      }, t("qr.tabManual"))),
    addTab === "qr" ? qrPane : manualPane);

  return addView;
}
