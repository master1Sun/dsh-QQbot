/**
 * 按群配置（群级覆盖）编辑弹窗：每个字段空 = 跟随机器人默认。
 * 草稿状态自包含（每次打开重新挂载、按 overrides 初始化）；保存时组装
 * 整份 groupOverrides 并回调 onSave(next, openid)，由父组件落盘并提示。
 *
 * 布局：字段按「群标识 / 触发与阈值 / 回复节奏 / 内容与过滤」四组卡片排列，
 * 组内两列网格（窄屏自动一列）、控件通栏；避免旧版「标签—控件—说明」单列
 * 竖排把弹窗拉成一条长列表、控件只占 260px 而右半边全空。
 */
import * as React from "react";
import { fmt, h, t } from "../i18n/index.js";
import { COOLDOWN_OPTIONS, cooldownLabel } from "../meta.js";
import { TextArea } from "../ui.js";
import { OpenIdPicker, useArchiveChats } from "../id-picker.js";
import type { RpcCall } from "../types.js";

/** 覆盖编辑草稿：字符串形态（空串=跟随默认；开关用 on/off/空）。 */
interface OverrideDraft {
  openid: string;
  groupFullReply: string;
  valueThreshold: string;
  atContextMessages: string;
  groupCooldownMs: string;
  senderCooldownMs: string;
  markdownReply: string;
  memoryEnabled: string;
  replyChunkChars: string;
  maxRepliesPerMessage: string;
  bannedWords: string;
}

/** 从机器人级 groupOverrides 构建编辑草稿（原 openOverrideEdit 的初始化逻辑）。 */
function buildDraft(overrides: Record<string, Record<string, unknown>>, openid: string): OverrideDraft {
  const ov = openid ? overrides[openid] ?? {} : {};
  const tri = (v: unknown): string => (v === undefined || v === null ? "" : v ? "on" : "off");
  const num = (v: unknown): string => (v === undefined || v === null ? "" : String(v));
  return {
    openid,
    groupFullReply: tri(ov.groupFullReply),
    valueThreshold: num(ov.valueThreshold),
    atContextMessages: num(ov.atContextMessages),
    groupCooldownMs: num(ov.groupCooldownMs),
    senderCooldownMs: num(ov.senderCooldownMs),
    markdownReply: tri(ov.markdownReply),
    memoryEnabled: tri(ov.memoryEnabled),
    replyChunkChars: num(ov.replyChunkChars),
    maxRepliesPerMessage: num(ov.maxRepliesPerMessage),
    bannedWords: Array.isArray(ov.bannedWords) ? (ov.bannedWords as string[]).join(", ") : "",
  };
}

/** 保存结果：ok=false 时弹窗保持打开并把 error 内联显示（顶部提示条在长页面滚动后可能不可见）。 */
export interface OverrideSaveResult {
  ok: boolean;
  error?: string;
}

export function OverrideDialog(props: {
  /** 机器人级 groupOverrides（保存时基于它组装整份新值）。 */
  overrides: Record<string, Record<string, unknown>>;
  /** 编辑中的群 openid；空串=新增覆盖。 */
  editOpenid: string;
  /** RPC（拉取归档会话聚合做 openid 下拉候选）。 */
  rpcCall: RpcCall;
  /** 当前详情机器人（归档候选按机器人过滤）。 */
  appId: string;
  onClose: () => void;
  /** 保存：next 为整份 groupOverrides（空覆盖=删除该群键）；返回结果供弹窗决定是否关闭。 */
  onSave: (next: Record<string, Record<string, unknown>>, openid: string) => Promise<OverrideSaveResult> | OverrideSaveResult;
}) {
  const { overrides, editOpenid, rpcCall, appId, onClose, onSave } = props;
  const [draft, setDraft] = React.useState<OverrideDraft>(() => buildDraft(overrides, editOpenid));
  const [error, setError] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  // 归档会话聚合：群 openid 下拉候选（id + 最近发言者名称）。
  const archiveChats = useArchiveChats(rpcCall, appId);

  // 内联错误条统一 8 秒后自动收起（与其他 notice 行为一致）；
  // 校验类错误会由用户下一次输入（setOverrideField）立即清掉，不会「说什么都没反应」。
  React.useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 8000);
    return () => clearTimeout(timer);
  }, [error]);

  const setOverrideField = (key: string, value: string) => {
    setError("");
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const saveOverride = async () => {
    const d = draft;
    const openid = d.openid.trim();
    if (!openid) {
      setError(t("group.required"));
      return;
    }
    // 只写入用户显式设置的字段，其余保持跟随机器人默认（原 saveOverride 逻辑）。
    const ov: Record<string, unknown> = {};
    if (d.groupFullReply) ov.groupFullReply = d.groupFullReply === "on";
    if (d.valueThreshold !== "") ov.valueThreshold = Number(d.valueThreshold);
    if (d.atContextMessages !== "") ov.atContextMessages = Number(d.atContextMessages);
    if (d.groupCooldownMs !== "") ov.groupCooldownMs = Number(d.groupCooldownMs);
    if (d.senderCooldownMs !== "") ov.senderCooldownMs = Number(d.senderCooldownMs);
    if (d.markdownReply) ov.markdownReply = d.markdownReply === "on";
    if (d.memoryEnabled) ov.memoryEnabled = d.memoryEnabled === "on";
    if (d.replyChunkChars !== "") ov.replyChunkChars = Number(d.replyChunkChars);
    if (d.maxRepliesPerMessage !== "") ov.maxRepliesPerMessage = Number(d.maxRepliesPerMessage);
    if (d.bannedWords.trim()) {
      ov.bannedWords = d.bannedWords.split(/[,，]/).map((w) => w.trim()).filter(Boolean);
    }
    const next: Record<string, Record<string, unknown>> = { ...overrides };
    if (Object.keys(ov).length === 0) {
      // 新增时一个字段都没设：若照旧「删除该键」，保存会静默无效果（列表不出现、
      // 也无任何提示），用户只会看到「保存不成功」。这里显式拦截并说明该怎么做。
      if (!editOpenid) {
        setError(t("group.overrideRequired"));
        return;
      }
      delete next[openid];
    } else {
      next[openid] = ov;
    }
    setSaving(true);
    try {
      const r = await onSave(next, openid);
      // 失败时保持弹窗打开，错误内联显示在底部（顶部提示条在长页面滚动后可能不可见）。
      if (r && r.ok === false) {
        setError(r.error || t("common.saveFailed"));
        return;
      }
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  // ── 布局辅助 ────────────────────────────────────────────────────────────────

  /** 分组卡：品牌色小方块 + 组名，下方字段网格。 */
  const ovGroup = (groupKey: string, title: string, fields: any[]) =>
    h("section", { className: "qbot-ovGroup", key: groupKey },
      h("header", { className: "qbot-ovGroupHead" },
        h("span", { className: "qbot-ovGroupDot", "aria-hidden": "true" }),
        h("h3", null, title)),
      h("div", { className: "qbot-ovGrid" }, ...fields));

  /** 字段：标签 + 控件 + 一行说明；wide 时跨整行（openid / 敏感词）。 */
  const ovField = (label: string, hint: string, control: any, wide?: boolean) =>
    h("div", { className: `qbot-ovField${wide ? " is-wide" : ""}`, key: label },
      h("span", { className: "qbot-ovLabel" }, label),
      control,
      hint ? h("span", { className: "qbot-ovHint" }, hint) : null);

  /** 下拉：value 取自草稿字段，空串选项 = 跟随默认。 */
  const ovSelect = (field: keyof OverrideDraft, ariaLabel: string, options: any[]) =>
    h("select", {
      className: "qbot-settingSelect",
      value: String(draft[field] ?? ""),
      onChange: (ev: any) => setOverrideField(String(field), ev.target.value),
      "aria-label": ariaLabel,
    }, ...options);

  /** 三态选项：跟随默认 / 启用 / 停用。 */
  const triOptions = (): any[] => [
    h("option", { key: "", value: "" }, t("group.followDefault")),
    h("option", { key: "on", value: "on" }, t("conn.enable")),
    h("option", { key: "off", value: "off" }, t("conn.disable")),
  ];

  /** 数值选项：首项跟随默认，其余按候选生成（标签可定制）。 */
  const numOptions = (candidates: number[], labelFn: (n: number) => string): any[] => [
    h("option", { key: "", value: "" }, t("group.followDefault")),
    ...candidates.map((n) => h("option", { key: n, value: String(n) }, labelFn(n))),
  ];

  const form = h("div", { className: "qbot-ovForm" },
    ovGroup("identity", t("group.secIdentity"), [
      ovField(t("group.openid"), t("group.openidHintPicker"),
        h(OpenIdPicker, {
          chats: archiveChats.chats,
          scope: "group",
          value: String(draft.openid ?? ""),
          readOnly: Boolean(editOpenid),
          loading: archiveChats.loading,
          error: archiveChats.error,
          placeholder: t("group.openid"),
          onChange: (v: string) => setOverrideField("openid", v),
          ariaLabel: t("group.openid"),
        }), true),
    ]),

    ovGroup("trigger", t("group.secTrigger"), [
      ovField(t("group.fullReply"), t("group.fullReplyHint"),
        ovSelect("groupFullReply", t("group.fullReply"), triOptions())),
      ovField(t("group.valueThreshold"), t("group.valueThresholdHint"),
        ovSelect("valueThreshold", t("group.valueThreshold"), numOptions(
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          // 0 = 完全不设限（与机器人级同一语义）；早先从 1 起，群级关不掉阈值。
          (n) => (n === 0 ? t("tune.allZero") : fmt("override.scoreOption", n))))),
      ovField(t("group.atContext"), t("group.atContextHint"),
        ovSelect("atContextMessages", t("group.atContext"), numOptions(
          [0, 2, 4, 6, 8, 10, 15, 20, 30, 50],
          (n) => (n === 0 ? t("tune.offZero") : fmt("override.countOption", n))))),
    ]),

    ovGroup("pacing", t("group.secPacing"), [
      ovField(t("group.groupCooldown"), t("group.groupCooldownHint"),
        ovSelect("groupCooldownMs", t("group.groupCooldown"), numOptions(COOLDOWN_OPTIONS, cooldownLabel))),
      ovField(t("group.senderCooldown"), t("group.senderCooldownHint"),
        ovSelect("senderCooldownMs", t("group.senderCooldown"), numOptions(COOLDOWN_OPTIONS, cooldownLabel))),
      ovField(t("group.chunkLength"), t("group.chunkLengthHint"),
        ovSelect("replyChunkChars", t("group.chunkLength"), numOptions(
          [200, 300, 500, 800, 1000, 1500, 2000, 3000, 4000], (n) => String(n)))),
      ovField(t("group.maxReplies"), t("group.maxRepliesHint"),
        ovSelect("maxRepliesPerMessage", t("group.maxReplies"), numOptions(
          [1, 2, 3, 4, 5], (n) => fmt("override.countOption", n)))),
    ]),

    ovGroup("content", t("group.secContent"), [
      ovField(t("policy.markdown"), t("group.markdownHint"),
        ovSelect("markdownReply", t("policy.markdown"), triOptions())),
      // 长期记忆（memoryEnabled）已从界面移除（默认常开，仅 bots.json 可配）；
      // 草稿仍读取/回写该字段，避免保存时丢掉配置文件里已设置的值。
      ovField(t("feature.bannedWords"), t("group.bannedWordsHint"),
        TextArea({
          rows: 2, value: String(draft.bannedWords ?? ""),
          placeholder: t("group.bannedWordsPlaceholder"),
          onChange: (ev: any) => setOverrideField("bannedWords", ev.target.value),
          "aria-label": t("feature.bannedWords"),
        }), true),
    ]));

  return h("div", { className: "qbot-modalOverlay" },
    h("div", {
      className: "qbot-modal qbot-modalWide qbot-ovModal",
      role: "dialog", "aria-modal": "true", "aria-label": t("group.title"),
    },
      h("div", { className: "qbot-modalHead" },
        h("div", null,
          h("strong", null, editOpenid ? t("group.edit") : t("group.add")),
          h("p", null, t("group.dialogHint"))),
        h("button", { className: "qbot-modalClose", type: "button", "aria-label": t("common.close"), onClick: onClose }, "×")),
      h("div", { className: "qbot-modalList" }, form),
      h("div", { className: "qbot-modalFoot" },
        error
          ? h("p", { className: "qbot-footError", role: "alert" }, error)
          : h("span", { className: "qbot-hint" }, t("group.saveHint")),
        h("div", { className: "qbot-viewActions" },
          h("button", { className: "qbot-btn", type: "button", disabled: saving, onClick: onClose }, t("common.cancel")),
          h("button", {
            className: "qbot-btn qbot-btnPrimary", type: "button", disabled: saving,
            onClick: () => void saveOverride(),
          }, saving ? t("common.saving") : t("common.save"))))));
}
