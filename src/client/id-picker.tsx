/**
 * 接收方 openid 选择器（可搜索下拉）：候选来自消息归档聚合（archive.chats），
 * 每项显示「名称 + openid」，点击填入；同时保留手工输入（归档无记录时可直接粘贴）。
 * - 单聊候选显示用户昵称；群聊优先显示归档/平台能力共享缓存里的真实群名 + 人数，
 *   接口未返回时回退用该群最近发言者昵称辅助辨认。
 * - 输入框内容即过滤词：按 openid / 名称 / 真实群名模糊匹配，清空后展示全部候选。
 */
import * as React from "react";
import { useGroupInfos } from "./group-info.js";
import { fmt, h, t } from "./i18n/index.js";
import type { RpcCall } from "./types.js";
import { errText, val } from "./ui.js";

/** 调用方未传 rpcCall 时不拉群资料，仅展示归档原始信息。 */
const NOOP_RPC: RpcCall = async () => ({ ok: false, error: "" });

/** 归档会话聚合项（与宿主 ArchivedChat 对应）。 */
export interface ChatOption {
  scope: "group" | "c2c";
  openid: string;
  /** 单聊=用户昵称；群聊为空。 */
  name: string;
  /** 群聊=该群最近一次发言者昵称。 */
  lastSenderName: string;
  lastTs: string;
  count: number;
}

/** 拉取当前机器人的归档会话聚合（archive.chats）；appId 传空走主机器人。 */
export function useArchiveChats(rpcCall: RpcCall, appId: string) {
  const [chats, setChats] = React.useState<ChatOption[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const reload = React.useCallback(async () => {
    setLoading(true);
    const res = await rpcCall("archive.chats", appId ? { appId } : {});
    if (res.ok) {
      const v = val(res) ?? {};
      setChats(Array.isArray(v.chats) ? (v.chats as ChatOption[]).filter((c) => c && typeof c.openid === "string") : []);
      setError("");
    } else {
      setChats([]);
      setError(errText(res.error));
    }
    setLoading(false);
  }, [rpcCall, appId]);

  React.useEffect(() => {
    void reload();
  }, [reload]);

  return { chats, loading, error, reload };
}

/** 下拉菜单最多直接渲染的候选条数（其余靠输入过滤收敛）。 */
const MAX_RENDER = 50;

/**
 * openid 可搜索下拉：input + 绝对定位候选菜单。
 * 候选项 onMouseDown preventDefault 保住输入框焦点，点击后不闪断；Esc 关闭。
 */
export function OpenIdPicker(props: {
  chats: ChatOption[];
  scope: "group" | "c2c";
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
  loading?: boolean;
  error?: string;
  placeholder?: string;
  ariaLabel?: string;
  /** 传入后自动补齐群资料（真实群名 + 人数）；不传则保持归档原始展示。 */
  rpcCall?: RpcCall;
  appId?: string;
}) {
  const { chats, scope, value, onChange, readOnly, loading, error, placeholder, ariaLabel, rpcCall, appId } = props;
  const [open, setOpen] = React.useState(false);

  const pool = React.useMemo(() => chats.filter((c) => c.scope === scope), [chats, scope]);
  // 与归档弹窗、平台能力群下拉共用缓存，避免重复打群资料接口（官方限频 30 QPM）。
  const groupInfoMap = useGroupInfos(rpcCall ?? NOOP_RPC, appId ?? "", rpcCall ? pool.map((c) => c.openid) : []);
  const q = value.trim().toLowerCase();
  const list = q
    ? pool.filter(
        (c) =>
          c.openid.toLowerCase().includes(q) ||
          (c.name || "").toLowerCase().includes(q) ||
          (c.lastSenderName || "").toLowerCase().includes(q) ||
          (groupInfoMap[c.openid]?.group_name || "").toLowerCase().includes(q),
      )
    : pool;
  const shown = list.slice(0, MAX_RENDER);

  /** 首行标题：群聊优先真实群名，回退「群聊 · 最近发言成员」；单聊显示用户昵称。 */
  const itemTitle = (c: ChatOption): string =>
    scope === "c2c"
      ? c.name || t("idpick.user")
      : groupInfoMap[c.openid]?.group_name
        ? String(groupInfoMap[c.openid].group_name)
        : c.lastSenderName
          ? fmt("idpick.groupRecentSpeaker", c.lastSenderName)
          : t("sched.form.scopeGroup");
  /** 群人数：只在官方接口返回正数时展示徽标。 */
  const memberNum = (c: ChatOption): number => {
    const n = groupInfoMap[c.openid]?.group_member_num;
    return typeof n === "number" && n > 0 ? n : 0;
  };
  /** id 行前缀：显式标注这个 id 是谁的，避免群候选被误认为成员的用户 id。 */
  const idPrefix = scope === "group" ? t("idpick.groupIdLabel") : t("idpick.userIdLabel");

  return h(
    "div",
    { className: "qbot-idPicker", "data-open": open ? "true" : undefined },
    h("input", {
      className: "qbot-input qbot-mono",
      value,
      readOnly: Boolean(readOnly),
      placeholder: placeholder ?? t("sched.form.recipientPlaceholder"),
      autoComplete: "off",
      onFocus: () => setOpen(true),
      onBlur: () => setOpen(false),
      onKeyDown: (ev: any) => {
        if (ev.key === "Escape") setOpen(false);
      },
      onChange: (ev: any) => {
        setOpen(true);
        onChange(ev.target.value);
      },
      "aria-label": ariaLabel ?? t("sched.form.recipient"),
    }),
    open && !readOnly
      ? h(
          "div",
          { className: "qbot-idPickerMenu", role: "listbox", "aria-label": t("idpick.title") },
          loading
            ? h("div", { className: "qbot-idPickerState" }, t("idpick.loading"))
            : error
              ? h("div", { className: "qbot-idPickerState" }, fmt("notice.archiveReadFailed", error))
              : shown.length === 0
                ? h(
                    "div",
                    { className: "qbot-idPickerState" },
                    pool.length === 0
                      ? t("idpick.empty")
                      : t("idpick.noMatch"),
                  )
                : [
                    ...shown.map((c) =>
                      h(
                        "button",
                        {
                          key: `${c.scope}:${c.openid}`,
                          type: "button",
                          role: "option",
                          "aria-selected": c.openid === value,
                          className: `qbot-idPickerItem${c.openid === value ? " is-current" : ""}`,
                          // 阻止 mousedown 默认行为保住输入框焦点，避免 blur 先于 click 关闭菜单。
                          onMouseDown: (ev: any) => ev.preventDefault(),
                          onClick: () => {
                            onChange(c.openid);
                            setOpen(false);
                          },
                        },
                        h("span", { className: "qbot-idPickerHead" },
                          h("span", { className: "qbot-idPickerName" }, itemTitle(c)),
                          scope === "group" && memberNum(c) > 0
                            ? h("span", { className: "qbot-convGroupMembers", title: fmt("archive.groupMemberNum", String(memberNum(c))) },
                                fmt("archive.groupMembersShort", String(memberNum(c))))
                            : null),
                        h("span", { className: "qbot-idPickerId" }, `${idPrefix}${c.openid}`),
                      ),
                    ),
                    list.length > shown.length
                      ? h("div", { className: "qbot-idPickerState" }, fmt("idpick.candidates", list.length))
                      : null,
                  ],
        )
      : null,
  );
}
