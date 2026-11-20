/**
 * 配置清单弹窗：把当前机器人的全部可配置字段以 JSON 形式展示，用户可直接编辑并保存写回。
 *
 * 能力：
 *  - 打开时拉取 config.get 的生效配置，序列化成格式化 JSON（含全部 54 个字段）；
 *  - 左侧 JSON 编辑器带行号，实时校验：JSON 语法 / 顶层结构 / 未知字段 /
 *    类型 / 枚举 / 数值区间 / 按群覆盖结构，逐条列出「哪个字段、错在哪」；
 *  - 点击错误条目自动定位到编辑器里对应的行；
 *  - 右侧帮助面板按分组列出每个字段的类型、取值与中英说明，支持搜索；
 *  - 校验全部通过后才允许保存，保存写回 config.save（仅作用于当前详情机器人）。
 */
import * as React from "react";
import { fmt, h, t, useLocale } from "../i18n/index.js";
import { confirmDlg, errText, val } from "../ui.js";
import type { RpcCall } from "../types.js";
import {
  CONFIG_FIELDS, CONFIG_GROUPS, expectText, parseAndValidate,
  type ConfigFieldMeta, type ManifestIssue,
} from "../config-manifest.js";

/** 帮助说明用的语言下标：0=中文，1=英文。 */
type Lang = 0 | 1;

function issueText(issue: ManifestIssue, lang: Lang): string {
  switch (issue.code) {
    case "syntax": return fmt("manifest.issue.syntax", issue.detail ?? "");
    case "notObject": return t("manifest.issue.notObject");
    case "unknown": return fmt("manifest.issue.unknown", issue.path);
    case "enum": return fmt("manifest.issue.enum", issue.path, issue.detail ?? "");
    case "range": return fmt("manifest.issue.range", issue.path, issue.detail ?? "");
    case "override": return fmt("manifest.issue.override", issue.path, issue.detail ?? "");
    case "type": {
      const key = issue.path.split(".")[0];
      const meta = CONFIG_FIELDS.find((m) => m.key === key);
      return fmt("manifest.issue.type", issue.path, meta ? expectText(meta, lang) : "");
    }
  }
}

/** 类型徽标的中文/英文短标签。 */
function typeBadge(meta: ConfigFieldMeta, lang: Lang): string {
  switch (meta.type) {
    case "string": return lang === 0 ? "字符串" : "string";
    case "number": return lang === 0 ? "整数" : "integer";
    case "boolean": return "boolean";
    case "string[]": return "string[]";
    case "enum": return lang === 0 ? "枚举" : "enum";
    case "object": return lang === 0 ? "对象" : "object";
  }
}

/** 由元数据自动生成的取值限制值（数字区间 / 枚举可选值）；无则返回空。 */
function limitValue(meta: ConfigFieldMeta): string {
  if (meta.type === "number" && (meta.min !== undefined || meta.max !== undefined)) {
    return `[${meta.min ?? "−∞"}, ${meta.max ?? "∞"}]`;
  }
  if (meta.type === "enum" && meta.options?.length) {
    return meta.options.map((o) => `"${o}"`).join(" / ");
  }
  return "";
}

/** 取值限制的标签与值，连同示例、注意，统一由这组短标签渲染。 */
const HELP_LABELS = {
  range: ["范围", "Range"] as const,
  values: ["可选", "Values"] as const,
  example: ["示例", "Example"] as const,
  note: ["配错会", "If wrong"] as const,
};

export function ConfigManifestDialog(props: {
  appId: string;
  rpcCall: RpcCall;
  onClose: () => void;
  /** 保存成功后由父组件刷新配置并提示。 */
  onSaved: () => void;
}) {
  const { appId, rpcCall, onClose, onSaved } = props;
  // useLocale() 只用于订阅语言变化触发重渲染；实际语言以宿主翻译结果为准，
  // 避免宿主 locale id 写法特殊时 useLocale() 与 t() 不同步导致帮助文案中英混排。
  useLocale();
  const lang: Lang = t("common.langProbe") === "简体中文" ? 0 : 1;

  const [text, setText] = React.useState("");
  const [baseline, setBaseline] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [loadErr, setLoadErr] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [notice, setNotice] = React.useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [query, setQuery] = React.useState("");
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const gutterRef = React.useRef<HTMLDivElement | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setLoadErr("");
    setNotice(null);
    try {
      const res = await rpcCall("config.get", { appId });
      if (!res.ok) {
        setLoadErr(errText(res.error));
        return;
      }
      const config = val(res)?.config ?? {};
      const pretty = JSON.stringify(config, null, 2);
      setText(pretty);
      setBaseline(pretty);
    } catch (e) {
      setLoadErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [appId, rpcCall]);

  React.useEffect(() => { void load(); }, [load]);

  // 实时校验：每次编辑立即给出「哪个字段错了」，不等到点保存。
  const result = React.useMemo(() => parseAndValidate(text), [text]);
  const issues = result.issues;
  const dirty = text !== baseline;

  // 出错的行号（语法错误用 detail 里的 line N；字段错误按 "key" 在文本里定位）。
  const errorLines = React.useMemo(() => {
    const lines = new Set<number>();
    const source = text.split("\n");
    for (const issue of issues) {
      if (issue.code === "syntax") {
        const line = /line\s+(\d+)/i.exec(issue.detail ?? "");
        if (line) lines.add(Number(line[1]));
        continue;
      }
      if (!issue.path) continue;
      const leaf = issue.path.split(".").pop() ?? "";
      const idx = source.findIndex((l) => l.includes(`"${leaf}"`));
      if (idx >= 0) lines.add(idx + 1);
    }
    return lines;
  }, [text, issues]);

  // 提示自动收起。
  React.useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 6000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  /** 点击错误条目：定位并选中编辑器里对应的字段名。 */
  const locateIssue = (issue: ManifestIssue) => {
    const ta = textareaRef.current;
    if (!ta) return;
    if (issue.code === "syntax") {
      const line = /line\s+(\d+)/i.exec(issue.detail ?? "");
      if (!line) return;
      const lines = text.split("\n");
      let offset = 0;
      for (let i = 0; i < Number(line[1]) - 1 && i < lines.length; i++) offset += lines[i].length + 1;
      ta.focus();
      ta.setSelectionRange(offset, offset + Math.min(lines[Number(line[1]) - 1]?.length ?? 0, 40));
      return;
    }
    const leaf = issue.path.split(".").pop() ?? "";
    const idx = text.indexOf(`"${leaf}"`);
    if (idx < 0) return;
    ta.focus();
    ta.setSelectionRange(idx, idx + leaf.length + 2);
  };

  const reload = async () => {
    if (dirty && !(await confirmDlg({ message: t("manifest.reloadConfirm") }))) return;
    void load();
  };

  const save = async () => {
    if (!result.ok || issues.length > 0) {
      setNotice({ tone: "error", text: t("manifest.validateBeforeSave") });
      return;
    }
    setSaving(true);
    setNotice(null);
    try {
      const res = await rpcCall("config.save", { appId, ...(result.value ?? {}) });
      if (!res.ok) {
        setNotice({ tone: "error", text: errText(res.error) });
        return;
      }
      setBaseline(text);
      onSaved();
      onClose();
    } catch (e) {
      setNotice({ tone: "error", text: e instanceof Error ? e.message : String(e) });
    } finally {
      setSaving(false);
    }
  };

  // 右侧帮助面板：按分组渲染，随搜索词过滤（字段名 / 中英说明）。
  const q = query.trim().toLowerCase();
  const helpGroups = CONFIG_GROUPS.map((group) => {
    const fields = CONFIG_FIELDS.filter((m) => {
      if (m.group !== group.id) return false;
      if (!q) return true;
      return m.key.toLowerCase().includes(q)
        || m.help[0].toLowerCase().includes(q)
        || m.help[1].toLowerCase().includes(q)
        || (m.example?.[0].toLowerCase().includes(q) ?? false)
        || (m.example?.[1].toLowerCase().includes(q) ?? false)
        || (m.notes?.[0].toLowerCase().includes(q) ?? false)
        || (m.notes?.[1].toLowerCase().includes(q) ?? false);
    });
    return { group, fields };
  }).filter((g) => g.fields.length > 0);

  const lineCount = text.split("\n").length;
  const shownCount = helpGroups.reduce((n, g) => n + g.fields.length, 0);

  /** 单个帮助分组（标题可折叠 + 字段列表）。 */
  const helpGroupNode = ({ group, fields }: { group: typeof CONFIG_GROUPS[number]; fields: ConfigFieldMeta[] }) => {
    const isCollapsed = Boolean(collapsed[group.id]);
    return h("div", { className: "qbot-cmHelpGroup", key: group.id },
      h("button", {
        type: "button", className: "qbot-cmHelpGroupHead",
        onClick: () => setCollapsed((c) => ({ ...c, [group.id]: !c[group.id] })),
      },
        h("span", { className: "qbot-cmHelpChevron" }, isCollapsed ? "▸" : "▾"),
        h("strong", null, group.label[lang]),
        h("span", { className: "qbot-cmHelpGroupCount" }, String(fields.length))),
      !isCollapsed
        ? h("div", { className: "qbot-cmHelpGroupDesc" }, group.desc[lang])
        : null,
      !isCollapsed
        ? h("div", { className: "qbot-cmHelpFields" },
            fields.map((m) => {
              const limit = limitValue(m);
              return h("div", { className: "qbot-cmHelpField", key: m.key },
                h("div", { className: "qbot-cmHelpFieldTop" },
                  h("code", { className: "qbot-cmHelpKey", title: m.key }, m.key),
                  h("span", { className: "qbot-cmHelpType" }, typeBadge(m, lang))),
                h("p", { className: "qbot-cmHelpText" }, m.help[lang]),
                limit
                  ? h("div", { className: "qbot-cmHelpLine" },
                      h("span", { className: "qbot-cmHelpTag qbot-cmHelpTagRange" },
                        (m.type === "enum" ? HELP_LABELS.values : HELP_LABELS.range)[lang]),
                      h("code", { className: "qbot-cmHelpValue" }, limit))
                  : null,
                m.example
                  ? h("div", { className: "qbot-cmHelpLine" },
                      h("span", { className: "qbot-cmHelpTag qbot-cmHelpTagExample" }, HELP_LABELS.example[lang]),
                      h("code", { className: "qbot-cmHelpValue" }, m.example[lang]))
                  : null,
                m.notes
                  ? h("div", { className: "qbot-cmHelpNote" },
                      h("span", { className: "qbot-cmHelpNoteTag" }, HELP_LABELS.note[lang]),
                      h("span", { className: "qbot-cmHelpNoteText" }, m.notes[lang]))
                  : null);
            }))
        : null);
  };

  return h("div", { className: "qbot-modalOverlay" },
    h("div", {
      className: "qbot-modal qbot-cmModal",
      role: "dialog", "aria-modal": "true", "aria-label": t("manifest.title"),
    },
      // ── 头部 ──
      h("div", { className: "qbot-modalHead" },
        h("div", null,
          h("strong", null, t("manifest.title")),
          h("p", null, t("manifest.hint"))),
        h("button", {
          className: "qbot-modalClose", type: "button",
          "aria-label": t("common.close"), onClick: onClose,
        }, "×")),

      // ── 主体：左编辑器 / 右帮助 ──
      h("div", { className: "qbot-cmBody" },
        h("section", { className: "qbot-cmEditorPane" },
          h("div", { className: "qbot-cmPaneHead" },
            h("strong", null, t("manifest.editorTitle")),
            h("span", { className: `qbot-cmStatus${issues.length ? " is-error" : " is-ok"}` },
              issues.length
                ? fmt("manifest.issueCount", String(issues.length))
                : fmt("manifest.validCount", String(Object.keys(result.value ?? {}).length)))),

          h("div", { className: "qbot-cmCodeWrap" },
            h("div", { className: "qbot-cmGutter", ref: gutterRef },
              Array.from({ length: lineCount }, (_, i) =>
                h("div", {
                  key: i,
                  className: errorLines.has(i + 1) ? "is-err" : "",
                }, String(i + 1)))),
            h("textarea", {
              ref: textareaRef,
              className: "qbot-cmCode",
              value: text,
              spellCheck: false,
              "aria-label": t("manifest.editorTitle"),
              onChange: (e: any) => setText(e.target.value),
              onScroll: (e: any) => {
                if (gutterRef.current) gutterRef.current.scrollTop = e.target.scrollTop;
              },
            })),

          // 校验结果列表
          issues.length
            ? h("div", { className: "qbot-cmIssues", role: "alert" },
                issues.map((issue, i) =>
                  h("button", {
                    key: `${issue.code}-${issue.path}-${i}`,
                    type: "button", className: "qbot-cmIssue",
                    title: t("manifest.locateHint"),
                    onClick: () => locateIssue(issue),
                  },
                    h("span", { className: "qbot-cmIssuePath" }, issue.path || t("manifest.jsonRoot")),
                    h("span", { className: "qbot-cmIssueMsg" }, issueText(issue, lang)))))
            : h("div", { className: "qbot-cmIssues is-empty" }, t("manifest.noIssue"))),

        h("section", { className: "qbot-cmHelpPane" },
          h("div", { className: "qbot-cmPaneHead" },
            h("strong", null, t("manifest.helpTitle")),
            h("span", { className: "qbot-cmHelpCount" }, fmt("manifest.fieldTotal", String(shownCount)))),
          h("input", {
            className: "qbot-input qbot-cmSearch",
            type: "search",
            value: query,
            placeholder: t("manifest.searchPlaceholder"),
            "aria-label": t("manifest.searchPlaceholder"),
            onChange: (e: any) => setQuery(e.target.value),
          }),
          h("div", { className: "qbot-cmHelpScroll" },
            helpGroups.map((g) => helpGroupNode(g)),
            shownCount === 0
              ? h("div", { className: "qbot-modalState" }, t("manifest.noHelpMatch"))
              : null))),

      // ── 底部 ──
      h("div", { className: "qbot-modalFoot qbot-cmFoot" },
        h("div", { className: "qbot-cmFootLeft" },
          notice
            ? h("p", { className: notice.tone === "error" ? "qbot-footError" : "qbot-footOk", role: "alert" }, notice.text)
            : h("span", { className: "qbot-hint" }, dirty ? t("manifest.unsavedHint") : t("manifest.saveHint"))),
        h("div", { className: "qbot-viewActions" },
          h("button", {
            className: "qbot-btn", type: "button",
            disabled: loading || saving, onClick: () => void reload(),
          }, t("manifest.reload")),
          h("button", {
            className: "qbot-btn", type: "button",
            disabled: saving, onClick: onClose,
          }, t("common.cancel")),
          h("button", {
            className: "qbot-btn qbot-btnPrimary", type: "button",
            disabled: loading || saving || issues.length > 0,
            title: issues.length ? t("manifest.validateBeforeSave") : undefined,
            onClick: () => void save(),
          }, saving ? t("common.saving") : t("common.save")))),

      // 加载错误覆盖层
      loadErr
        ? h("div", { className: "qbot-cmLoadErr", role: "alert" },
            h("p", null, fmt("manifest.loadFailed", loadErr)),
            h("button", { className: "qbot-btn", type: "button", onClick: () => void load() }, t("common.refresh")))
        : null));
}
