/**
 * 按群配置（群级覆盖）编辑弹窗：每个字段空 = 跟随机器人默认。
 * 草稿状态自包含（每次打开重新挂载、按 overrides 初始化）；保存时组装
 * 整份 groupOverrides 并回调 onSave(next, openid)，由父组件落盘并提示。
 */
import * as React from "react";
import { h } from "../i18n.js";
import { COOLDOWN_OPTIONS, cooldownLabel } from "../meta.js";
import { TextInput, TextArea, editRow, presetOptions } from "../ui.js";

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
  /** Agent Preset 目录（聊天 Preset 下拉）。 */
  presets: Array<{ id: string; label: string }>;
  onClose: () => void;
  /** 保存：next 为整份 groupOverrides（空覆盖=删除该群键）；返回结果供弹窗决定是否关闭。 */
  onSave: (next: Record<string, Record<string, unknown>>, openid: string) => Promise<OverrideSaveResult> | OverrideSaveResult;
}) {
  const { overrides, editOpenid, presets, onClose, onSave } = props;
  const [draft, setDraft] = React.useState<OverrideDraft>(() => buildDraft(overrides, editOpenid));
  const [error, setError] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const setOverrideField = (key: string, value: string) => {
    setError("");
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const saveOverride = async () => {
    const d = draft;
    const openid = d.openid.trim();
    if (!openid) {
      setError("请填写群 openid");
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
        setError("请至少设置一个覆盖字段：全部「跟随默认」等同于不添加该群覆盖。");
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
        setError(r.error || "保存失败，请稍后重试");
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
          h("div", { className: "qbot-modal qbot-modalWide", role: "dialog", "aria-modal": "true", "aria-label": "按群配置" },
            h("div", { className: "qbot-modalHead" },
              h("div", null,
                h("strong", null, editOpenid ? "编辑群覆盖" : "添加群覆盖"),
                h("p", null, "留空/选择「跟随默认」的字段继续使用机器人级配置，仅此群生效")),
              h("button", { className: "qbot-modalClose", type: "button", "aria-label": "关闭", onClick: onClose }, "×")),
            h("div", { className: "qbot-modalList" },
              h("div", { className: "qbot-editForm" },
                editRow("群 openid", "要单独配置的群 openid（o 开头的长串）。可在群里让 AI 用 /session 查看。",
                  TextInput({
                    className: "qbot-input qbot-mono", value: String(draft.openid ?? ""),
                    placeholder: "群 openid",
                    readOnly: Boolean(editOpenid),
                    onChange: (ev: any) => setOverrideField("openid", ev.target.value),
                    "aria-label": "群 openid",
                  })),
                editRow("群全量回复", "该群非 @ 消息是否参与价值评分并回复。",
                  h("select", {
                    className: "qbot-settingSelect", value: String(draft.groupFullReply),
                    onChange: (ev: any) => setOverrideField("groupFullReply", ev.target.value),
                    "aria-label": "群全量回复",
                  },
                    h("option", { value: "" }, "跟随默认"),
                    h("option", { value: "on" }, "启用"),
                    h("option", { value: "off" }, "停用"))),
                editRow("价值阈值", "仅群全量回复开启时有效：0-10 分，达到阈值才回复。",
                  h("select", {
                    className: "qbot-settingSelect", value: String(draft.valueThreshold),
                    onChange: (ev: any) => setOverrideField("valueThreshold", ev.target.value),
                    "aria-label": "价值阈值",
                  },
                    h("option", { value: "" }, "跟随默认"),
                    [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) =>
                      h("option", { key: n, value: String(n) }, `${n} 分`)))),
                editRow("@ 上下文条数", "@ 机器人时附带的本群最近消息条数。",
                  h("select", {
                    className: "qbot-settingSelect", value: String(draft.atContextMessages),
                    onChange: (ev: any) => setOverrideField("atContextMessages", ev.target.value),
                    "aria-label": "@ 上下文条数",
                  },
                    h("option", { value: "" }, "跟随默认"),
                    [0, 2, 4, 6, 8, 10, 15, 20, 30, 50].map((n) =>
                      h("option", { key: n, value: String(n) }, n === 0 ? "0（关闭）" : `${n} 条`)))),
                editRow("同群冷却", "该群两次全量回复的最小间隔（@ 回复不受限）。",
                  h("select", {
                    className: "qbot-settingSelect", value: String(draft.groupCooldownMs),
                    onChange: (ev: any) => setOverrideField("groupCooldownMs", ev.target.value),
                    "aria-label": "同群冷却",
                  },
                    h("option", { value: "" }, "跟随默认"),
                    COOLDOWN_OPTIONS.map((n) => h("option", { key: n, value: String(n) }, cooldownLabel(n))))),
                editRow("同人冷却", "同一人在该群两次被回复的最小间隔。",
                  h("select", {
                    className: "qbot-settingSelect", value: String(draft.senderCooldownMs),
                    onChange: (ev: any) => setOverrideField("senderCooldownMs", ev.target.value),
                    "aria-label": "同人冷却",
                  },
                    h("option", { value: "" }, "跟随默认"),
                    COOLDOWN_OPTIONS.map((n) => h("option", { key: n, value: String(n) }, cooldownLabel(n))))),
                editRow("分片长度", "单条回复的最大字符数，超过会拆成多条发送。",
                  h("select", {
                    className: "qbot-settingSelect", value: String(draft.replyChunkChars),
                    onChange: (ev: any) => setOverrideField("replyChunkChars", ev.target.value),
                    "aria-label": "分片长度",
                  },
                    h("option", { value: "" }, "跟随默认"),
                    [200, 300, 500, 800, 1000, 1500, 2000, 3000, 4000].map((n) =>
                      h("option", { key: n, value: String(n) }, `${n}`)))),
                editRow("每条消息回复上限", "该群每条用户消息最多被动回复几条（平台上限 5）。",
                  h("select", {
                    className: "qbot-settingSelect", value: String(draft.maxRepliesPerMessage),
                    onChange: (ev: any) => setOverrideField("maxRepliesPerMessage", ev.target.value),
                    "aria-label": "每条消息回复上限",
                  },
                    h("option", { value: "" }, "跟随默认"),
                    [1, 2, 3, 4, 5].map((n) => h("option", { key: n, value: String(n) }, `${n} 条`)))),
                editRow("Markdown 回复", "该群回复是否优先使用 QQ Markdown。",
                  h("select", {
                    className: "qbot-settingSelect", value: String(draft.markdownReply),
                    onChange: (ev: any) => setOverrideField("markdownReply", ev.target.value),
                    "aria-label": "Markdown 回复",
                  },
                    h("option", { value: "" }, "跟随默认"),
                    h("option", { value: "on" }, "启用"),
                    h("option", { value: "off" }, "停用"))),
                editRow("长期记忆", "该群是否维护跨会话长期记忆。",
                  h("select", {
                    className: "qbot-settingSelect", value: String(draft.memoryEnabled),
                    onChange: (ev: any) => setOverrideField("memoryEnabled", ev.target.value),
                    "aria-label": "长期记忆",
                  },
                    h("option", { value: "" }, "跟随默认"),
                    h("option", { value: "on" }, "启用"),
                    h("option", { value: "off" }, "停用"))),
                editRow("聊天 Preset", "该群非 @ 全量消息使用的 Agent Preset（只聊天不执行工具）。留空跟随机器人配置。",
                  h("select", {
                    className: "qbot-settingSelect", value: String(draft.agentPresetChat),
                    onChange: (ev: any) => setOverrideField("agentPresetChat", ev.target.value),
                    "aria-label": "聊天 Preset",
                  },
                    h("option", { value: "" }, "跟随默认"),
                    presetOptions(presets).map((o) =>
                      h("option", { key: o.value, value: o.value }, o.label)))),
                editRow("敏感词列表", "仅该群生效的敏感词（逗号分隔），命中即撤回并跳过回复；与机器人级敏感词叠加。",
                  TextArea({
                    rows: 2, value: String(draft.bannedWords ?? ""),
                    placeholder: "词1, 词2（留空跟随默认）",
                    onChange: (ev: any) => setOverrideField("bannedWords", ev.target.value),
                    "aria-label": "敏感词列表",
                  })))),
            h("div", { className: "qbot-modalFoot" },
              error
                ? h("p", { className: "qbot-footError", role: "alert" }, error)
                : h("span", { className: "qbot-hint" }, "保存后立即生效，无需重启"),
              h("div", { className: "qbot-viewActions" },
                h("button", { className: "qbot-btn", type: "button", disabled: saving, onClick: onClose }, "取消"),
                h("button", {
                  className: "qbot-btn qbot-btnPrimary", type: "button", disabled: saving,
                  onClick: () => void saveOverride(),
                }, saving ? "保存中…" : "保存")))));
}
