/**
 * 按群配置（群级覆盖）编辑弹窗：每个字段空 = 跟随机器人默认。
 * 草稿状态自包含（每次打开重新挂载、按 overrides 初始化）；保存时组装
 * 整份 groupOverrides 并回调 onSave(next, openid)，由父组件落盘并提示。
 */
import * as React from "react";
import { fmt, h, t } from "../i18n/index.js";
import { COOLDOWN_OPTIONS, cooldownLabel } from "../meta.js";
import { TextArea, editRow } from "../ui.js";
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
  agentPresetChat: string;
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
    agentPresetChat: typeof ov.agentPresetChat === "string" ? ov.agentPresetChat : "",
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
    if (d.agentPresetChat.trim()) ov.agentPresetChat = d.agentPresetChat.trim();
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

    return h("div", { className: "qbot-modalOverlay" },
          h("div", { className: "qbot-modal qbot-modalWide", role: "dialog", "aria-modal": "true", "aria-label": t("group.title") },
            h("div", { className: "qbot-modalHead" },
              h("div", null,
                h("strong", null, editOpenid ? t("group.edit") : t("group.add")),
                h("p", null, t("group.dialogHint"))),
              h("button", { className: "qbot-modalClose", type: "button", "aria-label": t("common.close"), onClick: onClose }, "×")),
            h("div", { className: "qbot-modalList" },
              h("div", { className: "qbot-editForm" },
                editRow(t("group.openid"), t("group.openidHintPicker"),
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
                  })),
                editRow(t("group.fullReply"), t("group.fullReplyHint"),
                  h("select", {
                    className: "qbot-settingSelect", value: String(draft.groupFullReply),
                    onChange: (ev: any) => setOverrideField("groupFullReply", ev.target.value),
                    "aria-label": t("group.fullReply"),
                  },
                    h("option", { value: "" }, t("group.followDefault")),
                    h("option", { value: "on" }, t("conn.enable")),
                    h("option", { value: "off" }, t("conn.disable")))),
                editRow(t("group.valueThreshold"), t("group.valueThresholdHint"),
                  h("select", {
                    className: "qbot-settingSelect", value: String(draft.valueThreshold),
                    onChange: (ev: any) => setOverrideField("valueThreshold", ev.target.value),
                    "aria-label": t("group.valueThreshold"),
                  },
                    h("option", { value: "" }, t("group.followDefault")),
                    [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) =>
                      h("option", { key: n, value: String(n) }, fmt("override.scoreOption", n))))),
                editRow(t("group.atContext"), t("group.atContextHint"),
                  h("select", {
                    className: "qbot-settingSelect", value: String(draft.atContextMessages),
                    onChange: (ev: any) => setOverrideField("atContextMessages", ev.target.value),
                    "aria-label": t("group.atContext"),
                  },
                    h("option", { value: "" }, t("group.followDefault")),
                    [0, 2, 4, 6, 8, 10, 15, 20, 30, 50].map((n) =>
                      h("option", { key: n, value: String(n) }, n === 0 ? t("tune.offZero") : fmt("override.countOption", n))))),
                editRow(t("group.groupCooldown"), t("group.groupCooldownHint"),
                  h("select", {
                    className: "qbot-settingSelect", value: String(draft.groupCooldownMs),
                    onChange: (ev: any) => setOverrideField("groupCooldownMs", ev.target.value),
                    "aria-label": t("group.groupCooldown"),
                  },
                    h("option", { value: "" }, t("group.followDefault")),
                    COOLDOWN_OPTIONS.map((n) => h("option", { key: n, value: String(n) }, cooldownLabel(n))))),
                editRow(t("group.senderCooldown"), t("group.senderCooldownHint"),
                  h("select", {
                    className: "qbot-settingSelect", value: String(draft.senderCooldownMs),
                    onChange: (ev: any) => setOverrideField("senderCooldownMs", ev.target.value),
                    "aria-label": t("group.senderCooldown"),
                  },
                    h("option", { value: "" }, t("group.followDefault")),
                    COOLDOWN_OPTIONS.map((n) => h("option", { key: n, value: String(n) }, cooldownLabel(n))))),
                editRow(t("group.chunkLength"), t("group.chunkLengthHint"),
                  h("select", {
                    className: "qbot-settingSelect", value: String(draft.replyChunkChars),
                    onChange: (ev: any) => setOverrideField("replyChunkChars", ev.target.value),
                    "aria-label": t("group.chunkLength"),
                  },
                    h("option", { value: "" }, t("group.followDefault")),
                    [200, 300, 500, 800, 1000, 1500, 2000, 3000, 4000].map((n) =>
                      h("option", { key: n, value: String(n) }, `${n}`)))),
                editRow(t("group.maxReplies"), t("group.maxRepliesHint"),
                  h("select", {
                    className: "qbot-settingSelect", value: String(draft.maxRepliesPerMessage),
                    onChange: (ev: any) => setOverrideField("maxRepliesPerMessage", ev.target.value),
                    "aria-label": t("group.maxReplies"),
                  },
                    h("option", { value: "" }, t("group.followDefault")),
                    [1, 2, 3, 4, 5].map((n) => h("option", { key: n, value: String(n) }, fmt("override.countOption", n))))),
                editRow(t("policy.markdown"), t("group.markdownHint"),
                  h("select", {
                    className: "qbot-settingSelect", value: String(draft.markdownReply),
                    onChange: (ev: any) => setOverrideField("markdownReply", ev.target.value),
                    "aria-label": t("policy.markdown"),
                  },
                    h("option", { value: "" }, t("group.followDefault")),
                    h("option", { value: "on" }, t("conn.enable")),
                    h("option", { value: "off" }, t("conn.disable")))),
                // 长期记忆（memoryEnabled）与聊天 Preset（agentPresetChat）已从界面移除
                //（默认常开/留空跟随 Agent Preset，仅 bots.json 可配）；
                // 草稿仍读取/回写这两个字段，避免保存时丢掉配置文件里已设置的值。
                editRow(t("feature.bannedWords"), t("group.bannedWordsHint"),
                  TextArea({
                    rows: 2, value: String(draft.bannedWords ?? ""),
                    placeholder: t("group.bannedWordsPlaceholder"),
                    onChange: (ev: any) => setOverrideField("bannedWords", ev.target.value),
                    "aria-label": t("feature.bannedWords"),
                  })))),
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
