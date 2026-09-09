/**
 * 添加机器人视图：分段 Tab（扫码登录 | 手动填写）。
 *
 * 状态自包含：二维码快照与轮询、手动凭据表单、倒计时心跳。
 * 扫码确认 / 凭据保存成功后回调 onBotReady(appId)，由父组件刷新数据
 * 并跳转机器人详情页（本组件随之卸载，状态自动复位）。
 */
import * as React from "react";
import { h } from "./i18n.js";
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
            setNotice(`扫码成功，AppID ${current.appId} 已启用`);
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
      setNotice(`凭据已保存，AppID ${appId} 已启用`);
      await onBotReady(appId);
    } else {
      setNotice(`保存失败：${errText(res.error)}`);
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
      h("span", { className: "qbot-noteTitle" }, "说明"),
      h("ul", null, notes.map((n, i) => h("li", { key: i }, n))));

  const qrStatusText = qr?.status === "success" ? "绑定成功"
    : qr?.status === "failure" ? "扫码失败"
      : qrRefreshing ? "正在刷新二维码"
        : qrPending ? "等待手机 QQ 扫码"
          : "二维码未生成";
  const qrStatusTone = qr?.status === "success" ? "success"
    : qr?.status === "failure" ? "error"
      : qrPending ? "warning"
        : "neutral";

  const qrPane = h("section", { className: "qbot-surfaceCard" },
    h("div", { className: "qbot-surfaceBody qbot-qrLayout" },
      h("div", { className: "qbot-qrColumn" },
        h("div", { className: "qbot-qrFrame" },
          qr?.qrCodeDataUrl
            ? h("img", { src: qr.qrCodeDataUrl, alt: "用于绑定 QQ 机器人的一次性二维码" })
            : h("div", { className: "qbot-qrPlaceholder" },
                h("span", { className: "qbot-qrPlaceholderIcon", "aria-hidden": "true" }, h(QqLogoGlyph)),
                h("strong", null, qrRefreshing ? "正在刷新二维码…" : "还没有生成二维码"),
                h("span", { className: "qbot-qrPlaceholderHint" },
                  qrRefreshing ? "几秒后会自动出现新的一张" : "点击下方「生成二维码」开始"))),
        h("div", { className: "qbot-countdown" },
          h("div", { className: "qbot-countdownTop" },
            h("span", null, "二维码有效时间"),
            h("strong", null, qrPending && qr?.qrCodeDataUrl ? formatRemaining(qrRemaining) : "--:--")),
          h("div", { className: "qbot-progress", style: { "--qbot-progress": `${qrProgress}%` } as any }, h("span"))),
        h("div", { className: "qbot-qrActions" },
          h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: startQr },
            qrPending ? "重新生成二维码" : "生成二维码"),
          qrPending
            ? h("button", { className: "qbot-btn", type: "button", onClick: cancelQr }, "取消扫码")
            : null)),
      h("div", { className: "qbot-qrCopy" },
        StateLabel({ tone: qrStatusTone, text: qrStatusText }),
        h("h3", null, "手机 QQ 扫码接入"),
        h("p", { className: "qbot-qrLead" },
          "推荐方式。扫码后 QQ 会把机器人的 AppID 与 AppSecret 直接下发给本机 dsh，不需要手动复制，保存后立即生效。"),
        guideBlock("操作步骤", [
          { title: "生成二维码", desc: "点击二维码下方的「生成二维码」，出现二维码后开始 5 分钟倒计时。" },
          { title: "手机 QQ 扫一扫", desc: "打开手机 QQ，从右上角「＋」菜单进入「扫一扫」，扫描这张二维码。" },
          { title: "在 QQ 里确认绑定", desc: "按 QQ 页面提示完成确认，把这个机器人授权给本机 dsh 使用。" },
          { title: "等待自动跳转", desc: "本页每 2 秒检查一次结果，绑定成功后会自动进入机器人详情页。" },
        ]),
        qr?.status === "failure" ? h("p", { className: "qbot-qrError" }, qr.error ?? "扫码失败") : null,
        noteList([
          "二维码 5 分钟内有效；过期后会自动换一张新的，不需要手动刷新页面。",
          "扫码期间请保持本设置页打开，关闭页面会中断等待。",
          "凭据会写入 ~/.dsh/qqbot/credentials.json（仅当前用户可读），写入后立即生效，不需要重启 dsh。",
        ]))));

  const manualPane = h("section", { className: "qbot-surfaceCard" },
    h("div", { className: "qbot-surfaceBody qbot-manualPanel" },
      h("div", { className: "qbot-copyHead" },
        h("h3", null, "手动填写 AppID / AppSecret"),
        h("p", null, "适合已经在 QQ 开放平台创建过机器人的情况：先从开放平台把凭据复制出来，再回到这里填写保存。")),
      guideBlock("第 1 步 · 在 QQ 开放平台取得凭据", [
        { title: "打开 QQ 开放平台", desc: "浏览器访问 q.qq.com，用 QQ 登录。" },
        { title: "选择机器人", desc: "在机器人列表里点开要接入的机器人；还没有的话先创建一个。" },
        { title: "复制 AppID 与 AppSecret", desc: "进入该机器人的「开发设置」页面，复制 AppID（机器人 ID）与 AppSecret（机器人密钥）。" },
      ]),
      h("div", { className: "qbot-guideBlock" },
        h("span", { className: "qbot-guideTitle" }, "第 2 步 · 填到这里并保存"),
        h("div", { className: "qbot-credentialForm" },
          Field({ label: "AppID" },
            TextInput({
              value: manual.appId,
              placeholder: "机器人 ID",
              onChange: (e: any) => setManual({ ...manual, appId: e.target.value }),
            })),
          Field({ label: "AppSecret" },
            TextInput({
              type: "password",
              value: manual.appSecret,
              placeholder: "开发设置里的机器人密钥",
              onChange: (e: any) => setManual({ ...manual, appSecret: e.target.value }),
            }))),
        h("div", { className: "qbot-credentialActions" },
          h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: saveManual }, "保存并启用"))),
      noteList([
        "保存后凭据写入 ~/.dsh/qqbot/credentials.json（权限 0600），立即生效，并自动设为当前使用的机器人。",
        "这里不会校验凭据是否正确。保存后请到机器人详情看「连接状态」：显示「运行正常」才是接通；未就绪就点「重试连接」。",
        "消息接收走 WebSocket 长连接，开放平台不需要填回调地址；但机器人回复要走 OpenAPI，需要把本机出口 IP 加进开放平台的 IP 白名单。",
        "AppSecret 保存后不再回显；需要更换时重新填一次保存即可覆盖。",
      ])));

  const addView = h("div", { className: "qbot-channelPage qbot-addView" },
    notice ? h("div", { className: "qbot-infoNotice" }, notice) : null,
    h("div", { className: "qbot-addNav" },
      h("button", { className: "qbot-btn", type: "button", onClick: onBack }, "← 返回列表")),
    h("header", { className: "qbot-addHead" },
      h("h2", null, "添加机器人"),
      h("p", null,
        "两种方式任选其一：扫码由 QQ 自动下发凭据；手动填写需要你先去 QQ 开放平台复制 AppID / AppSecret。接入成功后凭据立即生效，并自动成为当前使用的机器人。")),
    h("div", { className: "qbot-segTabs", role: "tablist" },
      h("button", {
        type: "button", role: "tab", "aria-selected": addTab === "qr",
        onClick: () => setAddTab("qr"),
      }, "扫码接入"),
      h("button", {
        type: "button", role: "tab", "aria-selected": addTab === "manual",
        onClick: () => setAddTab("manual"),
      }, "手动填写")),
    addTab === "qr" ? qrPane : manualPane);

  return addView;
}
