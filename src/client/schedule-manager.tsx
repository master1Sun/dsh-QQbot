/**
 * 定时任务管理弹窗（schedule.list / schedule.add(编辑) / schedule.remove）。
 * 列表 / 编辑双视图；范围 Tab（当前机器人 | 所有机器人）。
 * 状态自包含：挂载即拉取当前机器人名下的任务列表。
 *
 * 支持四种定时条件（对标 OpenClaw）：
 *  - daily：每天 HH:mm（可附加 weekdays 周几过滤）
 *  - interval：每 N 分钟（可附加 weekdays 周几过滤）
 *  - cron：标准 5 段表达式 + 时区（下拉选择）
 *  - at：一次性绝对时间，到点后自动删除
 * 与三种执行方式：
 *  - text：直接发送文本
 *  - ai：把内容当指令交给 AI 生成后回复
 *  - tool：到点执行一条命令（py / ps1 / bat / node …），捕获输出后推送给用户
 *    （resultMode=ai 时先把输出交给 AI 整理成播报，再推送）
 */
import * as React from "react";
import type { CSSProperties } from "react";
import { fmt, h, t } from "./i18n/index.js";
import type { RpcCall } from "./types.js";
import { TextInput, TextArea, confirmDlg, editRow, errText, formatTime, val } from "./ui.js";
import { OpenIdPicker, useArchiveChats } from "./id-picker.js";
import { isEnglish, useLocale } from "./i18n/index.js";
import { isValidCron, nextCronRun, tzOffsetMs, wallToEpoch } from "../shared/cron.js";

/**
 * 周几按钮标签：中文用「日一二三四五六」，英文用两位缩写。
 * 不能把单个汉字当字典 key（「日」「一」…易与其它词条冲突），故按语言直接取值。
 */
const WEEKDAYS = [
  { v: 0, label: t("weekday.sun"), en: "Su" },
  { v: 1, label: t("weekday.mon"), en: "Mo" },
  { v: 2, label: t("weekday.tue"), en: "Tu" },
  { v: 3, label: t("weekday.wed"), en: "We" },
  { v: 4, label: t("weekday.thu"), en: "Th" },
  { v: 5, label: t("weekday.fri"), en: "Fr" },
  { v: 6, label: t("weekday.sat"), en: "Sa" },
];

/** 周几按钮当前语言下的短标签。 */
export function wdLabel(v: number): string {
  const hit = WEEKDAYS.find((x) => x.v === v);
  return isEnglish() ? hit?.en ?? String(v) : hit?.label ?? String(v);
}

/** 常用时区（下拉选择，避免手输 IANA 出错）。
 *  刻意做成函数：模块级只求值一次会把标签冻结在首次导入时的语言上。 */
function tzOptions(): Array<{ value: string; label: string }> {
  return [
    { value: "Asia/Shanghai", label: t("tz.shanghai") },
    { value: "Asia/Hong_Kong", label: t("tz.hongkong") },
    { value: "Asia/Taipei", label: t("tz.taipei") },
    { value: "Asia/Singapore", label: t("tz.singapore") },
    { value: "Asia/Tokyo", label: t("tz.tokyo") },
    { value: "Asia/Seoul", label: t("tz.seoul") },
    { value: "Asia/Kolkata", label: t("tz.kolkata") },
    { value: "Asia/Dubai", label: t("tz.dubai") },
    { value: "Europe/Moscow", label: t("tz.moscow") },
    { value: "Europe/Berlin", label: t("tz.berlin") },
    { value: "Europe/London", label: t("tz.london") },
    { value: "America/Sao_Paulo", label: t("tz.saopaulo") },
    { value: "America/New_York", label: t("tz.newyork") },
    { value: "America/Chicago", label: t("tz.chicago") },
    { value: "America/Denver", label: t("tz.denver") },
    { value: "America/Los_Angeles", label: t("tz.losangeles") },
    { value: "Australia/Sydney", label: t("tz.sydney") },
    { value: "Pacific/Auckland", label: t("tz.auckland") },
    { value: "UTC", label: t("tz.utc") },
  ];
}

const DEFAULT_TZ = "Asia/Shanghai";

/** 本机时区（不在常用列表时插入表头，方便一键选中）。 */
function localTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TZ;
  } catch {
    return DEFAULT_TZ;
  }
}

/** 命令模板：一键填入常见脚本形态。 */
/** 命令模板（懒求值：标签含译文，模块级只算一次会冻结语言）。 */
function cmdTemplates(): Array<{ label: string; cmd: string }> {
  return [
    { label: "Python", cmd: "python C:/scripts/report.py" },
    { label: "PowerShell", cmd: "powershell -ExecutionPolicy Bypass -File C:/scripts/check.ps1" },
    { label: t("sched.form.templateBat"), cmd: "C:/scripts/backup.bat" },
    { label: "Node", cmd: "node C:/scripts/sync.mjs" },
    { label: "VBS", cmd: "cscript //Nologo C:/scripts/task.vbs" },
    { label: "Perl", cmd: "perl C:/scripts/task.pl" },
  ];
}

/** 间隔快捷值（分钟，懒求值同上）。 */
function intervalPresets(): Array<{ v: number; label: string }> {
  return [
    { v: 5, label: t("sched.form.quick5m") },
    { v: 10, label: t("sched.form.quick10m") },
    { v: 15, label: t("sched.form.quick15m") },
    { v: 30, label: t("sched.form.quick30m") },
    { v: 60, label: t("sched.form.quick1h") },
    { v: 120, label: t("sched.form.quick2h") },
    { v: 360, label: t("sched.form.quick6h") },
    { v: 720, label: t("sched.form.quick12h") },
    { v: 1440, label: t("sched.form.quick24h") },
  ];
}

/** datetime-local 字符串（按 tz 墙钟解释）→ ISO 即时。 */
function datetimeLocalToInstant(local: string, tz: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(local);
  if (!m) return null;
  const epoch = wallToEpoch(Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4]), Number(m[5]), tz);
  if (!Number.isFinite(epoch)) return null;
  return new Date(epoch).toISOString();
}

/** ISO 即时（按 tz 墙钟解释）→ datetime-local 字符串。 */function instantToDatetimeLocal(iso: string, tz: string): string {
  const epoch = new Date(iso).getTime();
  if (!Number.isFinite(epoch)) return "";
  const wd = new Date(epoch + tzOffsetMs(epoch, tz));
  const p = (n: number) => String(n).padStart(2, "0");
  return `${wd.getUTCFullYear()}-${p(wd.getUTCMonth() + 1)}-${p(wd.getUTCDate())}T${p(wd.getUTCHours())}:${p(wd.getUTCMinutes())}`;
}

/**
 * 解析「每行 KEY=VALUE」格式的环境变量文本为对象。
 * 忽略空行、注释行（# 开头）与不合法的键名；无有效项返回 undefined。
 */
function parseEnvText(text: string): Record<string, string> | undefined {
  const out: Record<string, string> = {};
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const k = line.slice(0, eq).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(k)) continue;
    out[k] = line.slice(eq + 1).trim();
  }
  return Object.keys(out).length ? out : undefined;
}

/** 分区容器：标题 + 说明 + 内容，提供视觉层次。 */
function section(title: string, desc: string, children: any) {  return h(
    "section",
    { className: "qbot-schedSection" },
    h(
      "header",
      { className: "qbot-schedSectionHead" },
      h("span", { className: "qbot-schedSectionTitle" }, title),
      h("span", { className: "qbot-schedSectionDesc" }, desc),
    ),
    h("div", { className: "qbot-schedSectionBody" }, children),
  );
}

function blankEntry(detailAppId: string) {
  return {
    id: "",
    appId: detailAppId ?? "",
    scope: "group",
    openid: "",
    type: "daily",
    time: "09:00",
    minutes: 30,
    cron: "0 9 * * *",
    tz: localTimeZone(),
    atLocal: "",
    weekdays: [] as number[],
    mode: "text",
    content: "",
    command: "",
    genPrompt: "",
    cwd: "",
    timeoutSec: 120,
    envText: "",
    resultMode: "raw",
    parsePrompt: "",
    gate: "always",
    goal: "",
    notifyWhen: "",
    verify: false,
    tool: "",
    args: {} as Record<string, unknown>,
  };
}

export function ScheduleManager(props: {
  rpcCall: RpcCall;
  /** 当前详情机器人：scope=current 的任务归属、新任务的默认归属。 */
  detailAppId: string;
  /** 嵌入场景（右侧面板）：锁定范围 current=该机器人 / all=所有机器人，并隐藏内部范围切换 Tab。 */
  forceScope?: "current" | "all";
  /** 弹窗场景提供关闭回调；嵌入场景不传则不渲染关闭按钮。 */
  onClose?: () => void;
}) {
  const { rpcCall, detailAppId, forceScope, onClose } = props;
  // 订阅宿主语言切换：本组件也会挂在右侧面板（不在设置页重渲染链路内），需自行刷新文案。
  useLocale();

  const [scheduleModal, setScheduleModal] = React.useState<{
    loading: boolean;
    error: string;
    items: Array<Record<string, any>>;
    botScope: "current" | "all";
    editing: Record<string, any> | null;
    editError: string;
    saving: boolean;
    /** 每个群/单聊的定时条数上限（服务端 scheduleMaxPerChat，默认 15，0=不限）。 */
    maxPerChat: number;
  }>({
    loading: true,
    error: "",
    items: [],
    botScope: (forceScope ?? "current"),
    editing: null,
    editError: "",
    saving: false,
    maxPerChat: 15,
  });
  const [scheduleRemoving, setScheduleRemoving] = React.useState("");
  const [scheduleToggling, setScheduleToggling] = React.useState("");
  const [scheduleTesting, setScheduleTesting] = React.useState("");
  /** 「查看」详情：非 null 时列表区被替换为该任务的执行逻辑流程图。 */
  const [scheduleViewing, setScheduleViewing] = React.useState<Record<string, any> | null>(null);
  const [schedNotice, setSchedNotice] = React.useState<{ ok: boolean; text: string } | null>(null);
  /** 分组折叠态：scope（group / c2c）→ 是否收起。默认全部展开。 */
  const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>({});
  /** 失败原因展开态：任务 id → 是否展开完整报错（默认收起到 3 行）。 */
  const [expandedErrors, setExpandedErrors] = React.useState<Record<string, boolean>>({});
  // 归档会话聚合：为「接收方 openid」提供 id+名称下拉候选（挂载即拉取当前机器人）。
  const archiveChats = useArchiveChats(rpcCall, detailAppId);
  // cron 预览同时记录 ok：样式判定不能依赖中文前缀（英文下前缀会变成 "Next run:"）。
  const [cronPreview, setCronPreview] = React.useState<{ ok: boolean; text: string } | null>(null);

  const loadSchedules = async (botScope: "current" | "all") => {
    setScheduleModal((prev) => (prev ? { ...prev, loading: true, error: "" } : prev));
    const payload = botScope === "current" && detailAppId ? { appId: detailAppId } : { allBots: true };
    const res = await rpcCall("schedule.list", payload);
    if (res.ok) {
      const v = val(res) ?? {};
      setScheduleModal((prev) =>
        prev
          ? {
              ...prev,
              loading: false,
              error: "",
              items: Array.isArray(v.schedules) ? v.schedules : [],
              maxPerChat: Number.isFinite(Number(v.maxPerChat)) ? Number(v.maxPerChat) : prev.maxPerChat,
            }
          : prev,
      );
    } else {
      setScheduleModal((prev) => (prev ? { ...prev, loading: false, error: errText(res.error) } : prev));
    }
  };

  // 提示条自动收起：无论成功还是失败，8 秒后清空（失败原因在列表卡片的错误行里仍可看到）。
  React.useEffect(() => {
    if (!schedNotice) return;
    const timer = setTimeout(() => setSchedNotice(null), 8000);
    return () => clearTimeout(timer);
  }, [schedNotice]);

  React.useEffect(() => {
    const s = forceScope ?? "current";
    setScheduleViewing(null);
    setScheduleModal((prev) => (prev ? { ...prev, botScope: s } : prev));
    void loadSchedules(s);
  }, [forceScope, detailAppId]);

  const switchScheduleScope = (botScope: "current" | "all") => {
    setScheduleModal((prev) =>
      prev && prev.botScope !== botScope
        ? { ...prev, botScope, loading: true, editing: null, editError: "" }
        : prev,
    );
    void loadSchedules(botScope);
  };

  // cron 表达式变化时实时预览下次运行时间。
  React.useEffect(() => {
    const e = scheduleModal?.editing;
    if (e && e.type === "cron" && isValidCron(String(e.cron ?? ""))) {
      const next = nextCronRun(String(e.cron), String(e.tz || DEFAULT_TZ), new Date());
      setCronPreview(
        next
          ? { ok: true, text: fmt("sched.nextRun", formatTime(next.toISOString())) }
          : { ok: false, text: t("sched.form.cronNoMatch") },
      );
    } else if (e && e.type === "cron" && String(e.cron ?? "").trim()) {
      setCronPreview({ ok: false, text: t("sched.form.cronIncomplete") });
    } else {
      setCronPreview(null);
    }
  }, [scheduleModal?.editing?.cron, scheduleModal?.editing?.tz, scheduleModal?.editing?.type]);

  const openScheduleEdit = (entry: Record<string, any>) => {
    const base = blankEntry(typeof entry.appId === "string" ? entry.appId : detailAppId);
    setScheduleModal((prev) =>
      prev
        ? {
            ...prev,
            editing: {
              ...base,
              id: String(entry.id ?? ""),
              appId: typeof entry.appId === "string" ? entry.appId : "",
              scope: entry.scope === "group" ? "group" : "c2c",
              openid: String(entry.openid ?? ""),
              type: ["daily", "interval", "cron", "at"].includes(entry.type) ? entry.type : "daily",
              time: String(entry.time ?? "09:00"),
              minutes: Number(entry.minutes ?? 30),
              cron: String(entry.cron ?? "0 9 * * *"),
              tz: String(entry.tz ?? DEFAULT_TZ),
              atLocal: entry.type === "at" && entry.at ? instantToDatetimeLocal(String(entry.at), String(entry.tz || DEFAULT_TZ)) : "",
              weekdays: Array.isArray(entry.weekdays) ? (entry.weekdays as number[]).slice() : [],
              mode: entry.mode === "ai" ? "ai" : entry.mode === "tool" ? "tool" : "text",
              content: entry.mode === "tool" ? "" : String(entry.content ?? ""),
              command: String(entry.command ?? (entry.mode === "tool" && !entry.genPrompt ? String(entry.content ?? "") : "")),
              genPrompt: String(entry.genPrompt ?? ""),
              // AI 生成子模式：曾用描述词的任务默认仍走 AI 生成。
              _cmdMode: entry.genPrompt ? "ai" : "manual",
              genStatus: String(entry.genStatus ?? ""),
              genError: String(entry.genError ?? ""),
              cwd: String(entry.cwd ?? ""),
              // 超时以「秒」编辑（后端存毫秒），便于非技术用户理解。
              timeoutSec: entry.timeoutMs ? Math.round(Number(entry.timeoutMs) / 1000) : 120,
              // 环境变量：每行 KEY=VALUE，提交时解析成对象。
              envText: entry.env && typeof entry.env === "object"
                ? Object.entries(entry.env as Record<string, string>).map(([k, v]) => `${k}=${v}`).join("\n")
                : "",
              resultMode: entry.resultMode === "ai" ? "ai" : "raw",
              parsePrompt: String(entry.parsePrompt ?? ""),
              gate: entry.gate === "nonempty" ? "nonempty" : entry.gate === "changed" ? "changed" : "always",
              goal: String(entry.goal ?? ""),
              notifyWhen: String(entry.notifyWhen ?? ""),
              verify: entry.verify === true,
              tool: typeof entry.tool === "string" ? entry.tool : "",
              args: entry.args && typeof entry.args === "object" ? { ...entry.args } : {},
            },
            editError: "",
            saving: false,
          }
        : prev,
    );
  };

  const openScheduleCreate = () => {
    setScheduleModal((prev) =>
      prev ? { ...prev, editing: blankEntry(detailAppId ?? ""), editError: "", saving: false } : prev,
    );
  };

  const setEditField = (key: string, value: unknown) => {
    setScheduleModal((prev) => (prev?.editing ? { ...prev, editError: "", editing: { ...prev.editing, [key]: value } } : prev));
  };

  const toggleWeekday = (v: number) => {
    setScheduleModal((prev) => {
      if (!prev?.editing) return prev;
      const cur: number[] = Array.isArray(prev.editing.weekdays) ? (prev.editing.weekdays as number[]) : [];
      const next = cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v].sort((a, b) => a - b);
      return { ...prev, editError: "", editing: { ...prev.editing, weekdays: next } };
    });
  };

  const setWeekdays = (list: number[]) => {
    setScheduleModal((prev) => (prev?.editing ? { ...prev, editError: "", editing: { ...prev.editing, weekdays: [...list] } } : prev));
  };

  const saveScheduleEdit = async () => {
    const e = scheduleModal?.editing;
    if (!e) return;
    if (!String(e.openid ?? "").trim()) {
      setScheduleModal((prev) => (prev ? { ...prev, editError: t("sched.form.recipientRequired") } : prev));
      return;
    }
    if (e.type === "daily" && !/^\d{1,2}:\d{2}$/.test(String(e.time ?? ""))) {
      setScheduleModal((prev) => (prev ? { ...prev, editError: t("sched.form.timeInvalid") } : prev));
      return;
    }
    if (e.type === "interval" && !(Number(e.minutes) >= 5)) {
      setScheduleModal((prev) => (prev ? { ...prev, editError: t("sched.form.intervalTooSmall") } : prev));
      return;
    }
    if (e.type === "cron" && !isValidCron(String(e.cron ?? ""))) {
      setScheduleModal((prev) => (prev ? { ...prev, editError: t("sched.form.cronInvalid") } : prev));
      return;
    }
    let atInstant: string | null = null;
    if (e.type === "at") {
      atInstant = datetimeLocalToInstant(String(e.atLocal ?? ""), String(e.tz || DEFAULT_TZ));
      if (!atInstant) {
        setScheduleModal((prev) => (prev ? { ...prev, editError: t("sched.form.atInvalid") } : prev));
        return;
      }
      if (new Date(atInstant).getTime() <= Date.now()) {
        setScheduleModal((prev) => (prev ? { ...prev, editError: t("sched.form.atMustBeFuture") } : prev));
        return;
      }
    }
    const tz = String(e.tz || DEFAULT_TZ).trim() || DEFAULT_TZ;
    if ((e.type === "cron" || e.type === "at") && !/^[A-Za-z]+(\/[A-Za-z_+-]+)?$|^UTC$/.test(tz)) {
      setScheduleModal((prev) => (prev ? { ...prev, editError: t("sched.form.tzInvalid") } : prev));
      return;
    }
    if (e.mode === "tool") {
      const aiMode = String(e._cmdMode ?? "manual") === "ai";
      if (aiMode) {
        if (!String(e.genPrompt ?? "").trim()) {
          setScheduleModal((prev) => (prev ? { ...prev, editError: t("sched.aiScriptRequired") } : prev));
          return;
        }
      } else if (!String(e.command ?? "").trim()) {
        setScheduleModal((prev) => (prev ? { ...prev, editError: t("sched.form.commandRequired") } : prev));
        return;
      }
    } else if (!String(e.content ?? "").trim()) {
      setScheduleModal((prev) => (prev ? { ...prev, editError: t("sched.form.contentRequired") } : prev));
      return;
    }

    setScheduleModal((prev) => (prev ? { ...prev, saving: true, editError: "" } : prev));
    const payload: Record<string, unknown> = {
      id: e.id,
      scope: e.scope,
      openid: String(e.openid ?? "").trim(),
      type: e.type,
      ...(e.type === "daily" ? { time: String(e.time ?? "").trim() } : {}),
      ...(e.type === "interval" ? { minutes: Number(e.minutes) } : {}),
      ...(e.type === "cron" ? { cron: String(e.cron ?? "").trim(), tz } : {}),
      ...(e.type === "at" ? { at: atInstant, tz } : {}),
      ...(Array.isArray(e.weekdays) && e.weekdays.length ? { weekdays: e.weekdays } : {}),
      mode: e.mode,
      ...(e.mode === "tool"
        ? {
            // 生成方式二选一：AI 生成脚本（只传描述词，宿主后台生成后回填 command）/ 手写命令。
            ...(String(e._cmdMode ?? "manual") === "ai"
              ? { genPrompt: String(e.genPrompt ?? "").trim() }
              : {
                  command: String(e.command ?? "").trim(),
                  ...(String(e.cwd ?? "").trim() ? { cwd: String(e.cwd).trim() } : {}),
                  ...(Number(e.timeoutSec) > 0 ? { timeoutMs: Math.round(Number(e.timeoutSec) * 1000) } : {}),
                  ...(parseEnvText(String(e.envText ?? "")) ? { env: parseEnvText(String(e.envText ?? "")) } : {}),
                }),
            // 「加工 → 门控」两段对两种生成方式都生效（脚本生成完成后走同一条流水线）。
            resultMode: e.resultMode === "ai" ? "ai" : "raw",
            gate: e.gate === "nonempty" || e.gate === "changed" ? e.gate : "always",
            ...(String(e.parsePrompt ?? "").trim() ? { parsePrompt: String(e.parsePrompt).trim() } : {}),
          }
        : { content: String(e.content ?? "").trim() }),
      // 任务契约：ai / tool 模式通用（text 是固定句子直发，无需分诊）。
      ...(e.mode === "ai" || e.mode === "tool"
        ? {
            ...(String(e.goal ?? "").trim() ? { goal: String(e.goal).trim() } : {}),
            ...(String(e.notifyWhen ?? "").trim() ? { notifyWhen: String(e.notifyWhen).trim() } : {}),
            verify: e.verify === true,
          }
        : {}),
      ...(e.appId ? { appId: e.appId } : detailAppId ? { appId: detailAppId } : {}),
    };
    const res = await rpcCall("schedule.add", payload);
    if (res.ok) {
      setScheduleModal((prev) => (prev ? { ...prev, editing: null, saving: false } : prev));
      await loadSchedules(scheduleModal?.botScope ?? "current");
    } else {
      setScheduleModal((prev) => (prev ? { ...prev, saving: false, editError: errText(res.error) } : prev));
    }
  };

  const removeSchedule = async (id: string) => {
    if (!(await confirmDlg({ message: t("sched.removeTaskConfirm"), danger: true }))) return;
    setScheduleRemoving(id);
    const scopeNow = scheduleModal?.botScope ?? "current";
    try {
      const res = await rpcCall("schedule.remove", { id });
      if (res.ok) await loadSchedules(scopeNow);
      else setScheduleModal((prev) => (prev ? { ...prev, error: errText(res.error) } : prev));
    } finally {
      setScheduleRemoving("");
    }
  };

  /** 启用 / 禁用：禁用后调度器跳过该条目，不再发送也不占用主动消息配额。 */
  const toggleSchedule = async (id: string, currentlyEnabled: boolean) => {
    if (currentlyEnabled) {
      const ok = await confirmDlg({
        message: t("sched.disableConfirm"),
        confirmLabel: t("common.confirmDisable"),
        danger: true,
      });
      if (!ok) return;
    }
    setScheduleToggling(id);
    const scopeNow = scheduleModal?.botScope ?? "current";
    try {
      const res = await rpcCall("schedule.setEnabled", { id, enabled: !currentlyEnabled });
      if (res.ok) {
        // 明确回显「下次运行」：启用后不会补跑已错过的触发，只排到下一个周期点，
        // 不给提示的话用户会以为开关没生效。
        const s = (val(res) ?? {}) as { schedule?: { nextRunAt?: string }; nextRunAt?: string };
        const nextAt = s.schedule?.nextRunAt ?? s.nextRunAt;
        setSchedNotice(
          currentlyEnabled
            ? { ok: true, text: t("sched.disabledToast") }
            : nextAt
              ? { ok: true, text: fmt("sched.enabledToast", formatTime(nextAt)) }
              : { ok: false, text: t("sched.enabledNoNext") },
        );
        await loadSchedules(scopeNow);
      } else setScheduleModal((prev) => (prev ? { ...prev, error: errText(res.error) } : prev));
    } finally {
      setScheduleToggling("");
    }
  };

  /** 测试执行一次：真实发送，但不计入主动消息配额、不改下次触发时间。 */
  const runOnceSchedule = async (id: string) => {
    if (!id) return;
    setSchedNotice(null);
    setScheduleTesting(id);
    const res = await rpcCall("schedule.runOnce", { id });
    setScheduleTesting("");
    if (res.ok) {
      const v = val(res) ?? {};
      setSchedNotice({ ok: true, text: typeof v.message === "string" ? v.message : t("sched.testSent") });
    } else {
      setSchedNotice({ ok: false, text: errText(res.error) });
    }
    await loadSchedules(scheduleModal?.botScope ?? "current");
  };

  const ed = scheduleModal.editing;

  /** 归档候选反查展示名：单聊=昵称；群聊平台不下发群名，括号里是「最近发言成员」提示而非 id 归属。 */
  const chatLabel = (openid: string): string => {
    const short = `${openid.slice(0, 16)}${openid.length > 16 ? "…" : ""}`;
    const hit = archiveChats.chats.find((c) => c.openid === openid);
    const name = hit ? (hit.scope === "c2c" ? hit.name : hit.lastSenderName) : "";
    if (!name) return short;
    return hit && hit.scope === "group" ? fmt("idpick.memberSuffix", short, name) : `${short}（${name}）`;
  };

  const summarizeType = (e: Record<string, any>): string => {
    if (e.type === "cron") return `cron ${e.cron ?? ""}${e.tz && e.tz !== DEFAULT_TZ ? ` · ${e.tz}` : ""}`;
    if (e.type === "at") return fmt("sched.form.onceAt", e.at ? formatTime(e.at) : t("sched.pending"));
    if (e.type === "interval") {
      const m = Number(e.minutes ?? 0);
      return m >= 60 && m % 60 === 0 && m < 1440 ? fmt("sched.form.everyHours", m / 60) : m === 1440 ? t("sched.form.every24h") : fmt("sched.form.everyMinutes", m);
    }
    return fmt("sched.form.dailyAt", e.time ?? "--:--");
  };

  /**
   * 周几摘要：中文「周一、三、五」，英文「Mon, Wed, Fri」。
   * 走显式拼接而非「周」+ 汉字字典，避免英文下出现半中半英。
   */
  const weekdayText = (list: number[]): string => {
    if (!list || list.length === 0 || list.length === 7) return t("sched.form.dailyShort");
    if (isEnglish()) return list.map((w) => WEEKDAYS.find((x) => x.v === w)?.en ?? String(w)).join(", ");
    return fmt("sched.form.weekdayPrefix", list.map((w) => WEEKDAYS.find((x) => x.v === w)?.label ?? String(w)).join("、"));
  };

  /** 时区下拉：本机时区置顶 + 常用时区。
   *  只提供候选项，不提供手动输入（手输 IANA 名称极易写错且无法校验）。 */
  const tzSelect = (current: string) => {
    const local = localTimeZone();
    const options: Array<{ value: string; label: string }> = [];
    const list = tzOptions();
    if (!list.some((o) => o.value === local)) {
      options.push({ value: local, label: fmt("sched.form.localTz", local) });
    }
    options.push(...list);
    // 历史数据可能保存了不在候选项里的时区：保留为一个只读选项，避免静默改写既有配置。
    if (!options.some((o) => o.value === current)) {
      options.push({ value: String(current), label: String(current) });
    }
    return h(
      "div",
      { className: "qbot-schedTz" },
      h(
        "select",
        {
          className: "qbot-settingSelect",
          value: String(current),
          onChange: (ev: any) => setEditField("tz", String(ev.target.value)),
          "aria-label": t("sched.form.timezone"),
        },
        ...options.map((o) => h("option", { key: o.value, value: o.value }, o.label)),
      ),
    );
  };

  /** 周几过滤器：按钮 + 快捷组 + 当前结果提示（点击有明确选中态）。 */
  const weekdayPicker = (current: number[]) => {
    const list: number[] = Array.isArray(current) ? current : [];
    return h(
      "div",
      { className: "qbot-weekdayPicker" },
      h(
        "div",
        { className: "qbot-weekdayRow", role: "group", "aria-label": t("sched.form.weekdayFilterShort") },
        WEEKDAYS.map((w) =>
          h(
            "button",
            {
              key: w.v,
              type: "button",
              className: `qbot-weekdayBtn${list.includes(w.v) ? " is-on" : ""}`,
              "aria-pressed": list.includes(w.v),
              onClick: () => toggleWeekday(w.v),
            },
            wdLabel(w.v),
          ),
        ),
      ),
      h(
        "div",
        { className: "qbot-weekdayQuick" },
        h("button", { type: "button", className: "qbot-miniBtn", onClick: () => setWeekdays([]) }, t("sched.form.dailyShort")),
        h("button", { type: "button", className: "qbot-miniBtn", onClick: () => setWeekdays([1, 2, 3, 4, 5]) }, t("sched.form.weekdays")),
        h("button", { type: "button", className: "qbot-miniBtn", onClick: () => setWeekdays([0, 6]) }, t("sched.form.weekend")),
        h("span", { className: "qbot-weekdayHint" }, fmt("sched.current", weekdayText(list))),
      ),
    );
  };

  /** 按定时类型渲染对应的时间字段。 */
  const timeField = (e: Record<string, any>) => {
    if (e.type === "daily") {
      return h(
        "div",
        { className: "qbot-schedFieldRow" },
        editRow(
          t("sched.form.dailyTime"),
          t("sched.form.timeHint"),
          h("input", {
            type: "time",
            className: "qbot-input qbot-mono",
            value: String(e.time ?? ""),
            onChange: (ev: any) => setEditField("time", ev.target.value),
            "aria-label": t("sched.form.dailyTime"),
          }),
        ),
        editRow(t("sched.form.timezone"), t("sched.form.tzDailyHint"), tzSelect(String(e.tz || DEFAULT_TZ))),
      );
    }
    if (e.type === "interval") {
      return h(
        "div",
        { className: "qbot-schedFieldRow" },
        editRow(
          t("sched.form.intervalMinutes"),
          t("sched.form.intervalHint"),
          h(
            "div",
            { className: "qbot-schedNumber" },
            h("input", {
              type: "number",
              className: "qbot-input qbot-mono",
              min: 5,
              step: 1,
              value: String(e.minutes ?? 30),
              onChange: (ev: any) => setEditField("minutes", Number(ev.target.value)),
              "aria-label": t("sched.form.intervalMinutes"),
            }),
            h("span", { className: "qbot-schedUnit" }, t("sched.form.minutesUnit")),
          ),
        ),
        h(
          "div",
          { className: "qbot-schedPresets" },
          h("span", { className: "qbot-schedPresetLabel" }, t("sched.form.quick")),
          intervalPresets().map((p) =>
            h(
              "button",
              {
                key: p.v,
                type: "button",
                className: `qbot-miniBtn${Number(e.minutes) === p.v ? " is-on" : ""}`,
                onClick: () => setEditField("minutes", p.v),
              },
              p.label,
            ),
          ),
        ),
      );
    }
    if (e.type === "cron") {
      return h(
        "div",
        { className: "qbot-schedFieldRow" },
        editRow(
          t("sched.form.cron"),
          t("sched.form.cronHint"),
          TextInput({
            className: "qbot-input qbot-mono",
            value: String(e.cron ?? ""),
            placeholder: "0 9 * * 1-5",
            onChange: (ev: any) => setEditField("cron", ev.target.value),
            "aria-label": t("sched.form.cron"),
          }),
        ),
        editRow(t("sched.form.timezone"), t("sched.form.tzCronHint"), tzSelect(String(e.tz || DEFAULT_TZ))),
      );
    }
    return h(
      "div",
      { className: "qbot-schedFieldRow" },
      editRow(
        t("sched.form.atTime"),
        t("sched.form.atHint"),
        h("input", {
          type: "datetime-local",
          className: "qbot-input qbot-mono",
          value: String(e.atLocal ?? ""),
          onChange: (ev: any) => setEditField("atLocal", ev.target.value),
          "aria-label": t("sched.form.atTime"),
        }),
      ),
      editRow(t("sched.form.timezone"), t("sched.form.tzAtHint"), tzSelect(String(e.tz || DEFAULT_TZ))),
    );
  };

  /** 任务契约（ai / tool 通用）：目标 + 通知条件 + 发送前自校验。 */
  const contractFields = (e: Record<string, any>) => [
    editRow(
      t("sched.form.goal"),
      t("sched.form.goalHint"),
      TextInput({
        className: "qbot-input",
        value: String(e.goal ?? ""),
        placeholder: t("sched.form.goalPlaceholder"),
        onChange: (ev: any) => setEditField("goal", ev.target.value),
        "aria-label": t("sched.form.goalShort"),
      }),
    ),
    editRow(
      t("sched.form.notifyWhen"),
      t("sched.form.notifyWhenHint"),
      TextArea({
        rows: 2,
        value: String(e.notifyWhen ?? ""),
        placeholder: t("sched.form.notifyWhenPlaceholder"),
        onChange: (ev: any) => setEditField("notifyWhen", ev.target.value),
        "aria-label": t("sched.form.notifyWhenShort"),
      }),
    ),
    editRow(
      t("sched.form.selfCheck"),
      t("sched.form.selfCheckHint"),
      h(
        "div",
        { className: "qbot-schedSeg", role: "group", "aria-label": t("sched.form.selfCheck") },
        h(
          "button",
          {
            type: "button",
            className: `qbot-segBtn${e.verify !== true ? " is-on" : ""}`,
            "aria-pressed": e.verify !== true,
            onClick: () => setEditField("verify", false),
          },
          t("sched.form.checkOff"),
        ),
        h(
          "button",
          {
            type: "button",
            className: `qbot-segBtn${e.verify === true ? " is-on" : ""}`,
            "aria-pressed": e.verify === true,
            onClick: () => setEditField("verify", true),
          },
          t("sched.form.checkOn"),
        ),
      ),
    ),
  ];

  /** 执行内容区：text/ai 为文本，tool 为命令（手写 / AI 生成脚本）+ 结果处理。 */
  const actionField = (e: Record<string, any>) => {
    if (e.mode === "tool") {
      const aiMode = String(e._cmdMode ?? "manual") === "ai";
      return h(
        "div",
        { className: "qbot-schedFieldCol" },
        editRow(
          t("sched.commandSource"),
          t("sched.commandSourceHint"),
          h(
            "div",
            { className: "qbot-schedSeg", role: "group", "aria-label": t("sched.commandSource") },
            h(
              "button",
              {
                type: "button",
                className: `qbot-segBtn${!aiMode ? " is-on" : ""}`,
                "aria-pressed": !aiMode,
                onClick: () => setEditField("_cmdMode", "manual"),
              },
              t("sched.commandManual"),
            ),
            h(
              "button",
              {
                type: "button",
                className: `qbot-segBtn${aiMode ? " is-on" : ""}`,
                "aria-pressed": aiMode,
                onClick: () => setEditField("_cmdMode", "ai"),
              },
              t("sched.commandAiScript"),
            ),
          ),
        ),
        aiMode
          ? [
              editRow(
                t("sched.aiScriptPrompt"),
                t("sched.aiScriptPromptHint"),
                TextArea({
                  rows: 3,
                  value: String(e.genPrompt ?? ""),
                  placeholder: t("sched.aiScriptPlaceholder"),
                  onChange: (ev: any) => setEditField("genPrompt", ev.target.value),
                  "aria-label": t("sched.aiScriptPrompt"),
                }),
              ),
              e.id && String(e.genStatus ?? "") === "pending"
                ? h("div", { className: "qbot-schedGen is-pending" }, t("sched.scriptGeneratingHint"))
                : null,
              e.id && String(e.genStatus ?? "") === "done"
                ? h("div", { className: "qbot-schedGen is-done" }, fmt("notice.scriptGenerated", String(e.command ?? "")))
                : null,
              e.id && String(e.genStatus ?? "") === "error"
                ? h("div", { className: "qbot-schedGen is-error" }, fmt("notice.lastGenFailedRetry", String(e.genError ?? t("common.unknownError"))))
                : null,
            ]
          : [
              editRow(
                t("sched.form.command"),
                t("sched.form.commandHint"),
                h(
                  "div",
                  { className: "qbot-schedCmd" },
                  TextArea({
                    rows: 3,
                    className: "qbot-textarea qbot-mono",
                    value: String(e.command ?? ""),
                    placeholder: "python C:/scripts/report.py",
                    onChange: (ev: any) => setEditField("command", ev.target.value),
                    "aria-label": t("sched.form.command"),
                  }),
                  h(
                    "div",
                    { className: "qbot-schedPresets" },
                    h("span", { className: "qbot-schedPresetLabel" }, t("sched.form.templates")),
                    cmdTemplates().map((t) =>
                      h("button", { key: t.label, type: "button", className: "qbot-miniBtn", onClick: () => setEditField("command", t.cmd) }, t.label),
                    ),
                  ),
                ),
              ),
              editRow(
                t("sched.form.cwd"),
                t("sched.form.cwdHint"),
                TextInput({
                  className: "qbot-input qbot-mono",
                  value: String(e.cwd ?? ""),
                  placeholder: t("sched.form.cwdPlaceholder"),
                  onChange: (ev: any) => setEditField("cwd", ev.target.value),
                  "aria-label": t("sched.form.cwdShort"),
                }),
              ),
              editRow(
                t("sched.form.timeout"),
                t("sched.form.timeoutHint"),
                TextInput({
                  className: "qbot-input",
                  type: "number",
                  min: 1,
                  max: 600,
                  value: String(e.timeoutSec ?? 120),
                  placeholder: "120",
                  onChange: (ev: any) => setEditField("timeoutSec", ev.target.value),
                  "aria-label": t("sched.form.timeout"),
                }),
              ),
              editRow(
                t("sched.form.env"),
                t("sched.form.envHint"),
                TextArea({
                  rows: 2,
                  className: "qbot-textarea qbot-mono",
                  value: String(e.envText ?? ""),
                  placeholder: "API_KEY=xxxx\nREPORT_DIR=D:/reports",
                  onChange: (ev: any) => setEditField("envText", ev.target.value),
                  "aria-label": t("sched.form.envShort"),
                }),
              ),
            ],
        editRow(
          t("sched.form.resultMode"),
          t("sched.form.resultModeHint"),
          h(
            "select",
            {
              className: "qbot-settingSelect",
              value: e.resultMode === "ai" ? "ai" : "raw",
              onChange: (ev: any) => setEditField("resultMode", ev.target.value),
              "aria-label": t("sched.form.resultMode"),
            },
            h("option", { value: "raw" }, t("sched.form.resultRaw")),
            h("option", { value: "ai" }, t("sched.form.resultAi")),
          ),
        ),
        e.resultMode === "ai"
          ? editRow(
              t("sched.form.dataInstruction"),
              t("sched.form.dataInstructionHint"),
              TextArea({
                rows: 3,
                value: String(e.parsePrompt ?? ""),
                placeholder: t("sched.form.dataInstructionPlaceholder"),
                onChange: (ev: any) => setEditField("parsePrompt", ev.target.value),
                "aria-label": t("sched.form.dataInstructionShort"),
              }),
            )
          : null,
        editRow(
          t("sched.form.gate"),
          t("sched.form.gateHint"),
          h(
            "select",
            {
              className: "qbot-settingSelect",
              value: e.gate === "nonempty" ? "nonempty" : e.gate === "changed" ? "changed" : "always",
              onChange: (ev: any) => setEditField("gate", ev.target.value),
              "aria-label": t("sched.form.gate"),
            },
            h("option", { value: "always" }, t("sched.form.gateAlways")),
            h("option", { value: "nonempty" }, t("sched.form.gateNonempty")),
            h("option", { value: "changed" }, t("sched.form.gateChanged")),
          ),
        ),
        ...contractFields(e),
      );
    }
    const contentRow = editRow(
      t("sched.form.content"),
      e.mode === "ai"
        ? t("sched.form.aiTaskContentHint")
        : t("sched.form.textContentHint"),
      TextArea({
        rows: 3,
        value: String(e.content ?? ""),
        placeholder: e.mode === "ai" ? t("sched.form.aiTaskPlaceholder") : t("sched.form.legacyPlaceholder2"),
        onChange: (ev: any) => setEditField("content", ev.target.value),
        "aria-label": t("sched.content"),
      }),
    );
    // text 模式是固定句子直发，无分诊/校验，只渲染内容；ai 模式追加任务契约。
    if (e.mode !== "ai") return contentRow;
    return h("div", { className: "qbot-schedFieldCol" }, contentRow, ...contractFields(e));
  };

  // ── 「查看」详情：把执行链路渲染成纵向流程图 ─────────────────────────────
  const flowNode = (kind: string, title: string, detail?: string) =>
    h(
      "div",
      { className: `qbot-flowNode qbot-flowNode--${kind}` },
      h("div", { className: "qbot-flowTitle" }, title),
      detail ? h("div", { className: "qbot-flowDetail" }, detail) : null,
    );

  const flowDecision = (question: string, answer: string, answerClass?: string, note?: string) =>
    h(
      "div",
      { className: "qbot-flowDecision" },
      h("span", { className: "qbot-flowQ", "aria-hidden": "true" }, "?"),
      h(
        "div",
        { className: "qbot-flowDecisionBody" },
        h("div", { className: "qbot-flowDecisionQ" }, question),
        h("span", { className: `qbot-flowAnswer${answerClass ? ` ${answerClass}` : ""}` }, answer),
        note ? h("div", { className: "qbot-flowDetail" }, note) : null,
      ),
    );

  const flowConn = () => h("div", { className: "qbot-flowConn", "aria-hidden": "true" });

  /** 依据任务配置拼出「触发 → 门控 → 执行 → 结果 → 推送」的执行逻辑流程图。 */
  const buildFlow = (e: Record<string, any>) => {
    const enabled = e.enabled !== false;
    const nodes: Array<React.ReactNode> = [];
    const join = () => { if (nodes.length) nodes.push(flowConn()); };

    let typeDesc = summarizeType(e);
    if ((e.type === "daily" || e.type === "interval") && Array.isArray(e.weekdays) && e.weekdays.length) {
      typeDesc += ` · ${weekdayText(e.weekdays)}`;
    }
    nodes.push(flowNode("trigger", t("sched.flow.trigger"), typeDesc));

    join();
    nodes.push(flowDecision(t("sched.flow.enabled"), enabled ? t("sched.flow.yes") : t("sched.flow.no"), enabled ? "" : "is-no", enabled ? undefined : t("sched.flow.skip")));
    if (!enabled) {
      join();
      nodes.push(flowNode("deliver", t("sched.flow.end"), t("sched.flow.disabled")));
      return nodes;
    }

    join();
    nodes.push(flowNode("recipient", t("sched.flow.recipient"), `${e.scope === "group" ? t("sched.form.scopeGroup") : t("sched.form.scopeDm")} · ${chatLabel(String(e.openid ?? ""))}`));

    join();
    const content = String(e.content ?? e.goal ?? "").trim();
    const actionText = e.mode === "tool"
      ? `${t("sched.flow.modeTool")}${e.genPrompt ? `（${t("sched.commandAiScript")}）` : ""}：${String(e.command || e.genPrompt || "").trim() || "—"}`
      : e.mode === "ai"
        ? `${t("sched.flow.modeAi")}：${content || "—"}`
        : `${t("sched.flow.modeText")}：${content || "—"}`;
    nodes.push(flowNode("action", t("sched.flow.action"), actionText));

    if (e.mode === "tool") {
      join();
      nodes.push(flowDecision(t("sched.flow.resultMode"), e.resultMode === "ai" ? t("sched.flow.resultAi") : t("sched.flow.resultRaw"), e.resultMode === "ai" ? "is-warn" : ""));
      join();
      const gate = e.gate === "nonempty" ? t("sched.flow.gateNonempty") : e.gate === "changed" ? t("sched.flow.gateChanged") : t("sched.flow.gateAlways");
      nodes.push(flowDecision(t("sched.flow.gate"), gate, e.gate === "always" ? "" : "is-warn"));
    }
    if ((e.mode === "ai" || e.mode === "tool") && String(e.notifyWhen ?? "").trim()) {
      join();
      nodes.push(flowDecision(t("sched.flow.notify"), String(e.notifyWhen).trim(), "is-warn"));
    }
    if (e.verify === true) {
      join();
      nodes.push(flowDecision(t("sched.flow.verify"), t("sched.flow.yes"), ""));
    }

    join();
    nodes.push(flowNode("deliver", t("sched.flow.deliver"), e.nextRunAt ? fmt("sched.flow.nextRun", formatTime(String(e.nextRunAt))) : t("sched.noNextRun")));
    return nodes;
  };

  const detailView = (e: Record<string, any>) =>
    h(
      "div",
      { className: "qbot-schedDetail" },
      h(
        "div",
        { className: "qbot-schedDetailHead" },
        h("button", { className: "qbot-btn", type: "button", onClick: () => setScheduleViewing(null) }, t("sched.back")),
        h("div", null, h("h3", null, t("sched.detailTitle")), h("p", null, t("sched.detailSubtitle"))),
      ),
      h("div", { className: "qbot-schedDetailBody" }, h("div", { className: "qbot-flow" }, ...buildFlow(e))),
    );

  const ROOT: CSSProperties = { display: "flex", flexDirection: "column", height: "100%", minHeight: 0, boxSizing: "border-box" };
  return h(
    "div",
    { className: "qbot-schedRoot", style: ROOT },
    ed
        ? [
            h(
              "div",
              { key: "body", className: "qbot-modalBody" },
              h(
                "div",
                { className: "qbot-editForm qbot-schedForm" },
                section(
                  t("sched.form.stepRecipient"),
                  t("sched.form.stepRecipientHint"),
                  h(
                    "div",
                    { className: "qbot-editGrid" },
                    editRow(
                      t("sched.form.scope"),
                      t("sched.form.scopeHint2"),
                      h(
                        "select",
                        {
                          className: "qbot-settingSelect",
                          value: String(ed.scope),
                          onChange: (ev: any) => {
                            // 切换范围后旧 openid 必然与新范围不匹配（群 openid ≠ 用户 openid），
                            // 直接清空并收起下拉，避免带着错误候选提交。
                            setEditField("openid", "");
                            setEditField("scope", ev.target.value);
                          },
                          "aria-label": t("sched.form.scope"),
                        },
                        h("option", { value: "group" }, t("sched.form.scopeGroup")),
                        h("option", { value: "c2c" }, t("sched.form.scopeDm")),
                      ),
                    ),
                    editRow(
                      t("sched.form.recipient"),
                      t("sched.form.recipientHintPicker"),
                      h(OpenIdPicker, {
                        chats: archiveChats.chats,
                        scope: ed.scope === "group" ? "group" : "c2c",
                        value: String(ed.openid ?? ""),
                        loading: archiveChats.loading,
                        error: archiveChats.error,
                        onChange: (v: string) => setEditField("openid", v),
                        ariaLabel: t("sched.form.recipient"),
                      }),
                    ),
                  ),
                ),
                section(
                  t("sched.form.stepTrigger"),
                  t("sched.form.stepTriggerHint"),
                  h(
                    "div",
                    { className: "qbot-schedFieldCol" },
                    editRow(
                      t("sched.form.trigger"),
                      t("sched.form.triggerHint"),
                      h(
                        "div",
                        { className: "qbot-schedSeg", role: "group", "aria-label": t("sched.form.trigger") },
                        (
                          [
                            { v: "daily", label: t("sched.form.dailyShort") },
                            { v: "interval", label: t("sched.form.interval") },
                            { v: "cron", label: "cron" },
                            { v: "at", label: t("sched.form.at") },
                          ] as const
                        ).map((t) =>
                          h(
                            "button",
                            {
                              key: t.v,
                              type: "button",
                              className: `qbot-segBtn${ed.type === t.v ? " is-on" : ""}`,
                              "aria-pressed": ed.type === t.v,
                              onClick: () => {
                                setEditField("type", t.v);
                                if (t.v === "interval" && !(Number(ed.minutes) >= 5)) setEditField("minutes", 30);
                                if (t.v === "cron" && !String(ed.cron ?? "").trim()) setEditField("cron", "0 9 * * *");
                              },
                            },
                            t.label,
                          ),
                        ),
                      ),
                    ),
                    timeField(ed),
                    cronPreview
                      ? h(
                          "div",
                          { className: `qbot-schedPreview${cronPreview.ok ? "" : " is-warn"}` },
                          cronPreview.text,
                        )
                      : null,
                    ed.type === "daily" || ed.type === "interval"
                      ? editRow(
                          t("sched.form.weekdayFilter"),
                          t("sched.form.weekdayHint"),
                          weekdayPicker(ed.weekdays),
                        )
                      : null,
                  ),
                ),
                section(
                  t("sched.form.stepAction"),
                  t("sched.form.stepActionHint"),
                  h(
                    "div",
                    { className: "qbot-schedFieldCol" },
                    editRow(
                      t("sched.form.action"),
                      t("sched.form.actionHint"),
                      h(
                        "select",
                        {
                          className: "qbot-settingSelect",
                          value: String(ed.mode ?? "text"),
                          onChange: (ev: any) => setEditField("mode", ev.target.value),
                          "aria-label": t("sched.form.action"),
                        },
                        h("option", { value: "text" }, t("sched.form.text")),
                        h("option", { value: "ai" }, t("sched.form.aiTask")),
                        h("option", { value: "tool" }, t("sched.form.tool")),
                      ),
                    ),
                    actionField(ed),
                  ),
                ),
              ),
            ),
            h(
              "div",
              { key: "foot", className: "qbot-modalFoot" },
              h(
                "span",
                { className: "qbot-hint" },
                ed.appId && ed.appId !== detailAppId
                  ? fmt("sched.ownerBot", `${ed.appId.slice(0, 4)}••••${ed.appId.slice(-4)}`)
                  : t("sched.saveHint"),
              ),
              h(
                "div",
                { className: "qbot-viewActions" },
                h(
                  "button",
                  {
                    className: "qbot-btn",
                    type: "button",
                    disabled: scheduleModal.saving,
                    onClick: () => setScheduleModal((prev) => (prev ? { ...prev, editing: null, editError: "" } : prev)),
                  },
                  t("common.cancel"),
                ),
                h(
                  "button",
                  {
                    className: "qbot-btn qbot-btnPrimary",
                    type: "button",
                    disabled: scheduleModal.saving,
                    onClick: () => void saveScheduleEdit(),
                  },
                  scheduleModal.saving ? t("common.saving") : ed.id ? t("sched.saveChanges") : t("common.create"),
                ),
              ),
            ),
          ]
        : scheduleViewing
          ? detailView(scheduleViewing)
          : h(
            "div",
            { className: `qbot-modalList${scheduleModal.loading && scheduleModal.items.length > 0 ? " is-refreshing" : ""}` },
            [
              schedNotice
                ? h(
                    "div",
                    { key: "notice", className: `qbot-schedNotice is-autoHide${schedNotice.ok ? "" : " is-error"}` },
                    schedNotice.text,
                  )
                : null,
              h(
                "div",
                { key: "tabs", className: "qbot-schedTabs", role: "tablist" },
                forceScope
                  ? null
                  : [
                      h(
                        "button",
                        {
                          type: "button",
                          role: "tab",
                          "aria-selected": scheduleModal.botScope === "current",
                          className: `qbot-schedTab${scheduleModal.botScope === "current" ? " is-active" : ""}`,
                          onClick: () => switchScheduleScope("current"),
                        },
                        t("sched.scopeCurrentBot"),
                      ),
                      h(
                        "button",
                        {
                          type: "button",
                          role: "tab",
                          "aria-selected": scheduleModal.botScope === "all",
                          className: `qbot-schedTab${scheduleModal.botScope === "all" ? " is-active" : ""}`,
                          onClick: () => switchScheduleScope("all"),
                        },
                        t("sched.scopeAllBots"),
                      ),
                    ],
                h(
                  "button",
                  { type: "button", className: "qbot-btn qbot-btnPrimary qbot-schedAdd", onClick: openScheduleCreate, "aria-label": t("sched.newTask") },
                  t("sched.addNew"),
                ),
              ),
              // 吸顶：tabs 与 notice 固定在面板头部，仅此内层滚动。
              h(
                "div",
                { key: "scroll", className: "qbot-modalListScroll" },
                scheduleModal.error
                  ? null
                  : scheduleModal.items.length === 0
                  ? scheduleModal.loading
                    ? h(
                        "div",
                        { key: "loading", className: "qbot-modalState" },
                        h("span", { className: "qbot-spinner", "aria-hidden": "true" }),
                        t("sched.loadingTasks"),
                      )
                    : h(
                        "div",
                        { key: "empty", className: "qbot-modalState" },
                        t("sched.emptyTasks"),
                      )
                  : ([{ scope: "group", title: t("sched.groupTasks") }, { scope: "c2c", title: t("sched.dmTasks") }] as const).map((g) => {
                      const rows = scheduleModal.items.filter((e: any) => e.scope === g.scope);
                      if (rows.length === 0) return null;
                      const collapsed = collapsedGroups[g.scope] === true;
                      return h(
                        "div",
                        { key: g.scope, className: `qbot-schedGroup${collapsed ? " is-collapsed" : ""}` },
                        h(
                          "button",
                          {
                            type: "button",
                            className: "qbot-schedGroupTitle",
                            "data-scope": g.scope,
                            "aria-expanded": !collapsed,
                            title: collapsed ? t("sched.expandGroup") : t("sched.collapseGroup"),
                            onClick: () =>
                              setCollapsedGroups((prev) => ({ ...prev, [g.scope]: !collapsed })),
                          },
                          h("span", { className: "qbot-schedCaret", "aria-hidden": "true" }),
                          g.title,
                          h("span", { className: "qbot-schedCount" }, `${rows.length}`),
                        ),
                        collapsed
                          ? null
                          : rows.map((e: any) =>
                          h(
                            "div",
                            { key: String(e.id), className: `qbot-schedRow${e.enabled === false ? " is-disabled" : ""}${e.lastError ? " is-failed" : ""}` },
                            h(
                              "div",
                              { className: "qbot-schedMain" },
                              h(
                                "div",
                                { className: "qbot-schedTop" },
                                e.enabled === false ? h("span", { className: "qbot-chip qbot-chipOff" }, t("sched.disabled")) : null,
                                h("span", { className: "qbot-chip is-active" }, summarizeType(e)),
                                e.mode === "ai" ? h("span", { className: "qbot-chip" }, t("sched.form.aiTaskShort")) : null,
                                e.mode === "tool"
                                  ? h(
                                      "span",
                                      { className: "qbot-chip" },
                                      e.resultMode === "ai" ? t("sched.form.summaryCommandToAiProcess") : t("sched.form.summaryCommandToRaw"),
                                    )
                                  : null,
                                e.mode === "tool" && e.gate && e.gate !== "always"
                                  ? h(
                                      "span",
                                      { className: "qbot-chip" },
                                      e.gate === "nonempty" ? t("sched.gateEmpty") : t("sched.gateUnchanged"),
                                    )
                                  : null,
                                (e.mode === "ai" || e.mode === "tool") && e.notifyWhen
                                  ? h("span", { className: "qbot-chip" }, t("sched.form.conditional"))
                                  : null,
                                (e.mode === "ai" || e.mode === "tool") && e.verify === true
                                  ? h("span", { className: "qbot-chip" }, t("sched.form.selfCheck"))
                                  : null,
                                Array.isArray(e.weekdays) && e.weekdays.length
                                  ? h("span", { className: "qbot-chip" }, weekdayText(e.weekdays as number[]))
                                  : null,
                                e.lastError ? h("span", { className: "qbot-chip qbot-chipError" }, t("common.runFailed")) : null,
                                e.lastSkipAt ? h("span", { className: "qbot-chip qbot-chipInfo" }, t("sched.lastSkipped")) : null,
                                e.genStatus === "pending" ? h("span", { className: "qbot-chip qbot-chipInfo" }, t("sched.scriptGenerating")) : null,
                                e.genStatus === "error" ? h("span", { className: "qbot-chip qbot-chipError" }, t("sched.scriptFailed")) : null,
                              ),
                              h(
                                "div",
                                { className: "qbot-schedContent" },
                                e.mode === "tool" && e.genStatus === "pending"
                                  ? fmt("sched.aiGenerating", String(e.genPrompt ?? ""))
                                  : e.mode === "tool"
                                    ? String(e.command ?? e.content ?? "")
                                    : String(e.content ?? ""),
                              ),
                              h(
                                "div",
                                { className: "qbot-schedMeta" },
                                h(
                                  "span",
                                  null,
                                  `${t(e.scope === "group" ? "sched.form.scopeGroup" : "idpick.user")} ${chatLabel(String(e.openid ?? ""))}`,
                                ),
                                h(
                                  "span",
                                  null,
                                  e.createdBy === "settings" ? t("sched.sourceSettings") : e.createdBy === "ai" ? t("sched.sourceAi") : t("sched.sourceCommand"),
                                ),
                                h(
                                  "span",
                                  null,
                                  e.enabled === false
                                    ? t("sched.disabledNoRun")
                                    : e.genStatus === "pending"
                                      ? t("sched.scriptReadyHint")
                                      : fmt("sched.next", e.nextRunAt ? formatTime(e.nextRunAt) : t("sched.noNextRun")),
                                ),
                                e.lastError
                                  ? h(
                                      "div",
                                      {
                                        className: `qbot-schedError${expandedErrors[String(e.id)] ? " is-expanded" : ""}`,
                                        title: String(e.lastError),
                                        role: "button",
                                        tabIndex: 0,
                                        "aria-expanded": expandedErrors[String(e.id)] === true,
                                        onClick: () =>
                                          setExpandedErrors((prev) => ({ ...prev, [String(e.id)]: !prev[String(e.id)] })),
                                        onKeyDown: (ev: any) => {
                                          if (ev.key === "Enter" || ev.key === " ") {
                                            ev.preventDefault();
                                            setExpandedErrors((prev) => ({ ...prev, [String(e.id)]: !prev[String(e.id)] }));
                                          }
                                        },
                                      },
                                      String(e.lastError),
                                    )
                                  : null,
                                e.lastSkipAt
                                  ? h(
                                      "span",
                                      null,
                                      t("sched.lastSkippedPrefix"),
                                      formatTime(e.lastSkipAt),
                                      "）：",
                                      String(e.lastSkipReason ?? t("sched.nothingToSend")),
                                    )
                                  : null,
                              ),
                            ),
                            h(
                              "div",
                              { className: "qbot-schedOps" },
                              h(
                                "button",
                                {
                                  className: "qbot-btn qbot-schedView",
                                  type: "button",
                                  onClick: () => setScheduleViewing(e),
                                },
                                t("sched.view"),
                              ),
                              h(
                                "button",
                                {
                                  className: "qbot-btn qbot-schedTest",
                                  type: "button",
                                  title: t("sched.testSendHint"),
                                  disabled: scheduleTesting === String(e.id),
                                  onClick: () => void runOnceSchedule(String(e.id)),
                                },
                                scheduleTesting === String(e.id) ? t("common.testing") : t("common.test"),
                              ),
                              h(
                                "button",
                                {
                                  className: `qbot-btn qbot-schedToggle${e.enabled === false ? " is-off" : ""}`,
                                  type: "button",
                                  "aria-pressed": e.enabled === false,
                                  disabled: scheduleToggling === String(e.id),
                                  onClick: () => void toggleSchedule(String(e.id), e.enabled !== false),
                                },
                                scheduleToggling === String(e.id)
                                  ? e.enabled === false
                                    ? t("sched.enabling")
                                    : t("sched.disabling")
                                  : e.enabled === false
                                    ? t("conn.enable")
                                    : t("sched.disable"),
                              ),
                              h("button", { className: "qbot-btn qbot-schedEdit", type: "button", onClick: () => openScheduleEdit(e) }, t("common.edit")),
                              h("span", { className: "qbot-schedDivider", "aria-hidden": "true" }),
                              h(
                                "button",
                                {
                                  className: "qbot-btn qbot-btnDanger qbot-schedRemove",
                                  type: "button",
                                  disabled: scheduleRemoving === String(e.id),
                                  onClick: () => void removeSchedule(String(e.id)),
                                },
                                scheduleRemoving === String(e.id) ? t("sched.removing") : t("common.delete"),
                              ),
                            ),
                          ),
                        ),
                      );
                    }),
                ),
            ],
          ),
      !ed && !scheduleViewing
        ? h(
            "div",
            { className: "qbot-modalFoot" },
            h(
              "span",
              { className: "qbot-hint" },
              scheduleModal.maxPerChat > 0
                ? (scheduleModal.botScope === "all"
                  ? fmt("sched.allBotsCountPerChatMax", scheduleModal.items.length, scheduleModal.maxPerChat)
                  : fmt("sched.totalCountPerChatMax", scheduleModal.items.length, scheduleModal.maxPerChat))
                : (scheduleModal.botScope === "all"
                  ? fmt("sched.allBotsTotalCount", scheduleModal.items.length)
                  : fmt("sched.totalCount", scheduleModal.items.length)),
            ),
            h(
              "div",
              { className: "qbot-viewActions" },
              h("button", { className: "qbot-btn", type: "button", disabled: scheduleModal.loading, onClick: () => void loadSchedules(scheduleModal.botScope) }, t("common.refresh")),
              onClose ? h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: onClose }, t("common.close")) : null,
            ),
          )
        : null,
  );
}
