/**
 * 工作区目录选择弹窗（host: workspace.browse，只读逐级浏览）。
 * 浏览状态自包含：挂载时从 initialPath 开始浏览；选定后回调 onPick(dir)，
 * 由父组件负责保存配置、提示并关闭弹窗。
 */
import * as React from "react";
import { h, t } from "../i18n/index.js";
import type { RpcCall } from "../types.js";
import { FolderGlyph, FolderUpGlyph } from "../glyphs.js";
import { errText, val } from "../ui.js";

interface PickerState {
  path: string;
  parent: string | null;
  dirs: Array<{ path: string; name: string }>;
  /** 单击选中的子文件夹（未选中时"选定此文件夹"作用于当前浏览目录）。 */
  selected: string;
  loading: boolean;
  error: string;
}

export function WorkspacePickerDialog(props: {
  rpcCall: RpcCall;
  /** 打开时浏览的初始目录（机器人当前 workspacePath，空串=从默认根开始）。 */
  initialPath: string;
  onClose: () => void;
  /** 选定目录：父组件保存配置、提示并关闭弹窗。 */
  onPick: (dir: string) => void;
}) {
  const { rpcCall, initialPath, onClose, onPick } = props;
  const [picker, setPicker] = React.useState<PickerState>({
    path: "", parent: null, dirs: [], selected: "", loading: true, error: "",
  });

  const browseTo = async (target?: string) => {
    setPicker((prev) => (prev ? { ...prev, loading: true, error: "", selected: "" } : prev));
    const res = await rpcCall("workspace.browse", target ? { path: target } : {});
    if (res.ok) {
      const v = val(res) ?? {};
      setPicker({
        path: String(v.path ?? ""),
        parent: (v.parent as string | null) ?? null,
        dirs: Array.isArray(v.dirs) ? v.dirs : [],
        selected: "",
        loading: false,
        error: "",
      });
    } else {
      setPicker((prev) => (prev ? { ...prev, loading: false, error: errText(res.error) } : prev));
    }
  };

  const pickDirectory = () => {
    // 优先取单击选中的子文件夹；未选中时选定当前浏览目录。
    const chosen = picker.selected || picker.path;
    if (!chosen) return;
    onPick(chosen);
  };

  // 挂载即浏览（原 openPicker 的初始化逻辑）。
  React.useEffect(() => {
    void browseTo(initialPath || undefined);
  }, []);

    return h("div", { className: "qbot-modalOverlay" },
          h("div", { className: "qbot-modal", role: "dialog", "aria-modal": "true", "aria-label": t("picker.title") },
            h("div", { className: "qbot-modalHead" },
              h("div", null,
                h("strong", null, t("picker.title")),
                h("p", null, t("picker.subtitle"))),
              h("button", { className: "qbot-modalClose", type: "button", "aria-label": t("common.close"), onClick: onClose }, "×")),
            h("div", { className: "qbot-modalPath qbot-mono" },
              picker.loading
                ? t("common.loading")
                : (picker.selected || picker.path || "—")),
            h("div", { className: `qbot-modalList${picker.loading && picker.dirs.length > 0 ? " is-refreshing" : ""}` },
              picker.error
                ? h("div", { className: "qbot-modalState qbot-modalError" }, picker.error)
                : picker.loading && picker.dirs.length === 0
                  ? h("div", { className: "qbot-modalState" }, h("span", { className: "qbot-spinner", "aria-hidden": "true" }), t("picker.loading"))
                  : [
                      picker.parent
                        ? h("button", { key: "__up", type: "button", className: "qbot-dirRow", onClick: () => void browseTo(picker.parent ?? undefined) },
                            h(FolderUpGlyph), t("picker.upOneLevel"))
                        : null,
                      picker.dirs.map((d) =>
                        h("button", {
                          key: d.path, type: "button",
                          className: `qbot-dirRow${picker.selected === d.path ? " is-selected" : ""}`,
                          title: t("picker.rowHint"),
                          onClick: () => setPicker((prev) => (prev ? { ...prev, selected: d.path } : prev)),
                          onDoubleClick: () => void browseTo(d.path),
                        },
                          h(FolderGlyph), d.name)),
                      !picker.loading && picker.dirs.length === 0
                        ? h("div", { className: "qbot-modalState" }, t("picker.emptyDirs"))
                        : null,
                    ]),
            h("div", { className: "qbot-modalFoot" },
              h("span", { className: "qbot-hint" }, t("picker.footerHint")),
              h("div", { className: "qbot-viewActions" },
                h("button", { className: "qbot-btn", type: "button", onClick: onClose }, t("common.cancel")),
                h("button", {
                  className: "qbot-btn qbot-btnPrimary", type: "button",
                  disabled: picker.loading || !picker.path,
                  onClick: pickDirectory,
                }, t("picker.chooseFolder"))))));
}
