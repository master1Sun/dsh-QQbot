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
import { h } from "../i18n.js";
import type { RpcCall } from "../types.js";
import { TextInput, TextArea, confirmDlg, editRow, errText, formatTime, val } from "../ui.js";
import { OpenIdPicker, useArchiveChats } from "../id-picker.js";
import { isEnglish, localizeText } from "../i18n.js";
import { isValidCron, nextCronRun, tzOffsetMs, wallToEpoch } from "../../shared/cron.js";

/**
 * 周几按钮标签：中文用「日一二三四五六」，英文用两位缩写。
 * 不能把单个汉字当字典 key（「日」「一」…易与其它词条冲突），故按语言直接取值。
 */
const WEEKDAYS = [
  { v: 0, label: "日", en: "Su" },
  { v: 1, label: "一", en: "Mo" },
  { v: 2, label: "二", en: "Tu" },
  { v: 3, label: "三", en: "We" },
  { v: 4, label: "四", en: "Th" },
  { v: 5, label: "五", en: "Fr" },
  { v: 6, label: "六", en: "Sa" },
];

/** 周几按钮当前语言下的短标签。 */
export function wdLabel(v: number): string {
  const hit = WEEKDAYS.find((x) => x.v === v);
  return isEnglish() ? hit?.en ?? String(v) : hit?.label ?? String(v);
}

/** 常用时区（下拉选择，避免手输 IANA 出错）。 */
const TZ_LIST: Array<{ value: string; label: string }> = [
  { value: "Asia/Shanghai", label: "中国标准时间 · Asia/Shanghai（UTC+8）" },
  { value: "Asia/Hong_Kong", label: "中国香港 · Asia/Hong_Kong（UTC+8）" },
  { value: "Asia/Taipei", label: "中国台湾 · Asia/Taipei（UTC+8）" },
  { value: "Asia/Singapore", label: "新加坡 · Asia/Singapore（UTC+8）" },
  { value: "Asia/Tokyo", label: "日本 · Asia/Tokyo（UTC+9）" },
  { value: "Asia/Seoul", label: "韩国 · Asia/Seoul（UTC+9）" },
  { value: "Asia/Kolkata", label: "印度 · Asia/Kolkata（UTC+5:30）" },
  { value: "Asia/Dubai", label: "阿联酋 · Asia/Dubai（UTC+4）" },
  { value: "Europe/Moscow", label: "俄罗斯 · Europe/Moscow（UTC+3）" },
  { value: "Europe/Berlin", label: "中欧 · Europe/Berlin（UTC+1/+2）" },
  { value: "Europe/London", label: "英国 · Europe/London（UTC+0/+1）" },
  { value: "America/Sao_Paulo", label: "巴西 · America/Sao_Paulo（UTC-3）" },
  { value: "America/New_York", label: "美国东部 · America/New_York（UTC-5/-4）" },
  { value: "America/Chicago", label: "美国中部 · America/Chicago（UTC-6/-5）" },
  { value: "America/Denver", label: "美国山地 · America/Denver（UTC-7/-6）" },
  { value: "America/Los_Angeles", label: "美国西部 · America/Los_Angeles（UTC-8/-7）" },
  { value: "Australia/Sydney", label: "澳大利亚 · Australia/Sydney（UTC+10/+11）" },
  { value: "Pacific/Auckland", label: "新西兰 · Pacific/Auckland（UTC+12/+13）" },
  { value: "UTC", label: "协调世界时 · UTC（UTC+0）" },
];

const DEFAULT_TZ = "Asia/Shanghai";
const TZ_CUSTOM = "__custom__";

/** 本机时区（不在常用列表时插入表头，方便一键选中）。 */
function localTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TZ;
  } catch {
    return DEFAULT_TZ;
  }
}

/** 命令模板：一键填入常见脚本形态。 */
const CMD_TEMPLATES: Array<{ label: string; cmd: string }> = [
  { label: "Python", cmd: "python C:/scripts/report.py" },
  { label: "PowerShell", cmd: "powershell -ExecutionPolicy Bypass -File C:/scripts/check.ps1" },
  { label: "bat 批处理", cmd: "C:/scripts/backup.bat" },
  { label: "Node", cmd: "node C:/scripts/sync.mjs" },
  { label: "VBS", cmd: "cscript //Nologo C:/scripts/task.vbs" },
  { label: "Perl", cmd: "perl C:/scripts/task.pl" },
];

/** 间隔快捷值（分钟）。 */
const INTERVAL_PRESETS: Array<{ v: number; label: string }> = [
  { v: 5, label: "5 分" },
  { v: 10, label: "10 分" },
  { v: 15, label: "15 分" },
  { v: 30, label: "30 分" },
  { v: 60, label: "1 小时" },
  { v: 120, label: "2 小时" },
  { v: 360, label: "6 小时" },
  { v: 720, label: "12 小时" },
  { v: 1440, label: "24 小时" },
];

/** datetime-local 字符串（按 tz 墙钟解释）→ ISO 即时。 */
function datetimeLocalToInstant(local: string, tz: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(local);
  if (!m) return null;
  const epoch = wallToEpoch(Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4]), Number(m[5]), tz);
  if (!Number.isFinite(epoch)) return null;
  return new Date(epoch).toISOString();
}

/** ISO 即时（按 tz 墙钟解释）→ datetime-local 字符串。 */
function instantToDatetimeLocal(iso: string, tz: string): string {
  const epoch = new Date(iso).getTime();
  if (!Number.isFinite(epoch)) return "";
  const wd = new Date(epoch + tzOffsetMs(epoch, tz));
  const p = (n: number) => String(n).padStart(2, "0");
  return `${wd.getUTCFullYear()}-${p(wd.getUTCMonth() + 1)}-${p(wd.getUTCDate())}T${p(wd.getUTCHours())}:${p(wd.getUTCMinutes())}`;
}

/** 分区容器：标题 + 说明 + 内容，提供视觉层次。 */
function section(title: string, desc: string, children: any) {
  return h(
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
    resultMode: "raw",
    tool: "",
    args: {} as Record<string, unknown>,
  };
}

export function ScheduleDialog(props: {
  rpcCall: RpcCall;
  /** 当前详情机器人：scope=current 的任务归属、新任务的默认归属。 */
  detailAppId: string;
  onClose: () => void;
}) {
  const { rpcCall, detailAppId, onClose } = props;

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
    botScope: "current",
    editing: null,
    editError: "",
    saving: false,
    maxPerChat: 15,
  });
  const [scheduleRemoving, setScheduleRemoving] = React.useState("");
  const [scheduleToggling, setScheduleToggling] = React.useState("");
  const [scheduleTesting, setScheduleTesting] = React.useState("");
  const [schedNotice, setSchedNotice] = React.useState<{ ok: boolean; text: string } | null>(null);
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
    void loadSchedules("current");
  }, []);

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
          ? { ok: true, text: `下次运行：${formatTime(next.toISOString())}` }
          : { ok: false, text: "未来 5 年内无匹配，请检查表达式" },
      );
    } else if (e && e.type === "cron" && String(e.cron ?? "").trim()) {
      setCronPreview({ ok: false, text: "表达式还不完整或非法（应为 5 段：分 时 日 月 周）" });
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
              resultMode: entry.resultMode === "ai" ? "ai" : "raw",
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
      setScheduleModal((prev) => (prev ? { ...prev, editError: "请填写接收方 openid（群或用户）" } : prev));
      return;
    }
    if (e.type === "daily" && !/^\d{1,2}:\d{2}$/.test(String(e.time ?? ""))) {
      setScheduleModal((prev) => (prev ? { ...prev, editError: "时间格式应为 HH:mm（如 09:30）" } : prev));
      return;
    }
    if (e.type === "interval" && !(Number(e.minutes) >= 5)) {
      setScheduleModal((prev) => (prev ? { ...prev, editError: "间隔不能小于 5 分钟" } : prev));
      return;
    }
    if (e.type === "cron" && !isValidCron(String(e.cron ?? ""))) {
      setScheduleModal((prev) => (prev ? { ...prev, editError: "cron 表达式非法（标准 5 段，如 0 9 * * 1-5）" } : prev));
      return;
    }
    let atInstant: string | null = null;
    if (e.type === "at") {
      atInstant = datetimeLocalToInstant(String(e.atLocal ?? ""), String(e.tz || DEFAULT_TZ));
      if (!atInstant) {
        setScheduleModal((prev) => (prev ? { ...prev, editError: "请选择有效的 at 时间" } : prev));
        return;
      }
      if (new Date(atInstant).getTime() <= Date.now()) {
        setScheduleModal((prev) => (prev ? { ...prev, editError: "at 时间必须晚于当前时间" } : prev));
        return;
      }
    }
    const tz = String(e.tz || DEFAULT_TZ).trim() || DEFAULT_TZ;
    if ((e.type === "cron" || e.type === "at") && !/^[A-Za-z]+(\/[A-Za-z_+-]+)?$|^UTC$/.test(tz)) {
      setScheduleModal((prev) => (prev ? { ...prev, editError: "时区格式不正确（应为 IANA 时区，如 Asia/Shanghai）" } : prev));
      return;
    }
    if (e.mode === "tool") {
      const aiMode = String(e._cmdMode ?? "manual") === "ai";
      if (aiMode) {
        if (!String(e.genPrompt ?? "").trim()) {
          setScheduleModal((prev) => (prev ? { ...prev, editError: "请填写 AI 脚本描述词（如：抓取某网页今日价格并输出）" } : prev));
          return;
        }
      } else if (!String(e.command ?? "").trim()) {
        setScheduleModal((prev) => (prev ? { ...prev, editError: "请填写要执行的命令（如 python C:/scripts/report.py）" } : prev));
        return;
      }
    } else if (!String(e.content ?? "").trim()) {
      setScheduleModal((prev) => (prev ? { ...prev, editError: "内容不能为空" } : prev));
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
        ? String(e._cmdMode ?? "manual") === "ai"
          ? {
              // AI 生成模式：只传描述词，宿主后台生成脚本后回填 command。
              genPrompt: String(e.genPrompt ?? "").trim(),
              resultMode: e.resultMode === "ai" ? "ai" : "raw",
            }
          : {
              command: String(e.command ?? "").trim(),
              ...(String(e.cwd ?? "").trim() ? { cwd: String(e.cwd).trim() } : {}),
              resultMode: e.resultMode === "ai" ? "ai" : "raw",
            }
        : { content: String(e.content ?? "").trim() }),
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
    if (!(await confirmDlg({ message: localizeText("确定删除这条定时任务？删除后立即停止发送。"), danger: true }))) return;
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
        message: localizeText("确定禁用这条定时任务？禁用后不再执行，可随时重新启用。"),
        confirmLabel: localizeText("确认禁用"),
        danger: true,
      });
      if (!ok) return;
    }
    setScheduleToggling(id);
    const scopeNow = scheduleModal?.botScope ?? "current";
    try {
      const res = await rpcCall("schedule.setEnabled", { id, enabled: !currentlyEnabled });
      if (res.ok) await loadSchedules(scopeNow);
      else setScheduleModal((prev) => (prev ? { ...prev, error: errText(res.error) } : prev));
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
      setSchedNotice({ ok: true, text: typeof v.message === "string" ? v.message : "已测试发送一次" });
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
    return hit && hit.scope === "group" ? `${short}（成员 ${name}）` : `${short}（${name}）`;
  };

  const summarizeType = (e: Record<string, any>): string => {
    if (e.type === "cron") return `cron ${e.cron ?? ""}${e.tz && e.tz !== DEFAULT_TZ ? ` · ${e.tz}` : ""}`;
    if (e.type === "at") return `一次性 ${e.at ? formatTime(e.at) : localizeText("待补算")}`;
    if (e.type === "interval") {
      const m = Number(e.minutes ?? 0);
      return m >= 60 && m % 60 === 0 && m < 1440 ? `每 ${m / 60} 小时` : m === 1440 ? "每 24 小时" : `每 ${m} 分钟`;
    }
    return `每天 ${e.time ?? "--:--"}`;
  };

  /**
   * 周几摘要：中文「周一、三、五」，英文「Mon, Wed, Fri」。
   * 走显式拼接而非「周」+ 汉字字典，避免英文下出现半中半英。
   */
  const weekdayText = (list: number[]): string => {
    if (!list || list.length === 0 || list.length === 7) return localizeText("每天");
    if (isEnglish()) return list.map((w) => WEEKDAYS.find((x) => x.v === w)?.en ?? String(w)).join(", ");
    return `周${list.map((w) => WEEKDAYS.find((x) => x.v === w)?.label ?? String(w)).join("、")}`;
  };

  /** 时区下拉：本机时区置顶，末项「自定义」展开手输。 */
  const tzSelect = (current: string) => {
    const local = localTimeZone();
    const options: Array<{ value: string; label: string }> = [];
    if (!TZ_LIST.some((t) => t.value === local)) {
      options.push({ value: local, label: `本机时区 · ${local}` });
    }
    options.push(...TZ_LIST);
    const isKnown = options.some((o) => o.value === current);
    return h(
      "div",
      { className: "qbot-schedTz" },
      h(
        "select",
        {
          className: "qbot-settingSelect",
          value: isKnown ? String(current) : TZ_CUSTOM,
          onChange: (ev: any) => {
            const v = String(ev.target.value);
            setEditField("tz", v === TZ_CUSTOM ? local : v);
          },
          "aria-label": "时区",
        },
        ...options.map((o) =>
          h(
            "option",
            { key: o.value, value: o.value },
            o.value === local && o.label.startsWith("本机时区") ? o.label : o.label,
          ),
        ),
        h("option", { value: TZ_CUSTOM }, "自定义（手动输入 IANA 时区）"),
      ),
      !isKnown
        ? TextInput({
            className: "qbot-input qbot-mono",
            value: String(current ?? ""),
            placeholder: "Asia/Shanghai",
            onChange: (ev: any) => setEditField("tz", ev.target.value),
            "aria-label": "自定义时区",
          })
        : null,
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
        { className: "qbot-weekdayRow", role: "group", "aria-label": "星期过滤" },
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
        h("button", { type: "button", className: "qbot-miniBtn", onClick: () => setWeekdays([]) }, "每天"),
        h("button", { type: "button", className: "qbot-miniBtn", onClick: () => setWeekdays([1, 2, 3, 4, 5]) }, "工作日"),
        h("button", { type: "button", className: "qbot-miniBtn", onClick: () => setWeekdays([0, 6]) }, "周末"),
        h("span", { className: "qbot-weekdayHint" }, `当前：${weekdayText(list)}`),
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
          "每天发送时间",
          "按所选时区解释；点击输入框可用时间选择器。",
          h("input", {
            type: "time",
            className: "qbot-input qbot-mono",
            value: String(e.time ?? ""),
            onChange: (ev: any) => setEditField("time", ev.target.value),
            "aria-label": "每天发送时间",
          }),
        ),
        editRow("时区", "daily 默认按中国标准时间发送；如需按其他时区，请改用 cron。", tzSelect(String(e.tz || DEFAULT_TZ))),
      );
    }
    if (e.type === "interval") {
      return h(
        "div",
        { className: "qbot-schedFieldRow" },
        editRow(
          "间隔分钟",
          "两次发送之间的间隔，最小 5 分钟。间隔越小消耗的主动消息配额越多。",
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
              "aria-label": "间隔分钟",
            }),
            h("span", { className: "qbot-schedUnit" }, "分钟"),
          ),
        ),
        h(
          "div",
          { className: "qbot-schedPresets" },
          h("span", { className: "qbot-schedPresetLabel" }, "快捷"),
          INTERVAL_PRESETS.map((p) =>
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
          "cron 表达式",
          "标准 5 段：分 时 日 月 周（如 0 9 * * 1-5 = 工作日 9 点）。支持 */步长、范围、列表、月份与星期英文名。",
          TextInput({
            className: "qbot-input qbot-mono",
            value: String(e.cron ?? ""),
            placeholder: "0 9 * * 1-5",
            onChange: (ev: any) => setEditField("cron", ev.target.value),
            "aria-label": "cron 表达式",
          }),
        ),
        editRow("时区", "cron 表达式按该时区解释。", tzSelect(String(e.tz || DEFAULT_TZ))),
      );
    }
    return h(
      "div",
      { className: "qbot-schedFieldRow" },
      editRow(
        "at 时间",
        "一次性触发时间，到点执行一次后自动删除。",
        h("input", {
          type: "datetime-local",
          className: "qbot-input qbot-mono",
          value: String(e.atLocal ?? ""),
          onChange: (ev: any) => setEditField("atLocal", ev.target.value),
          "aria-label": "at 时间",
        }),
      ),
      editRow("时区", "at 时间按该时区解释。", tzSelect(String(e.tz || DEFAULT_TZ))),
    );
  };

  /** 执行内容区：text/ai 为文本，tool 为命令（手写 / AI 生成脚本）+ 结果处理。 */
  const actionField = (e: Record<string, any>) => {
    if (e.mode === "tool") {
      const aiMode = String(e._cmdMode ?? "manual") === "ai";
      return h(
        "div",
        { className: "qbot-schedFieldCol" },
        editRow(
          "命令来源",
          "手写命令=自己写完整命令行；AI 生成脚本=只写任务描述，保存后由 AI 后台生成脚本并自动回填命令。",
          h(
            "div",
            { className: "qbot-schedSeg", role: "group", "aria-label": "命令来源" },
            h(
              "button",
              {
                type: "button",
                className: `qbot-segBtn${!aiMode ? " is-on" : ""}`,
                "aria-pressed": !aiMode,
                onClick: () => setEditField("_cmdMode", "manual"),
              },
              "手写命令",
            ),
            h(
              "button",
              {
                type: "button",
                className: `qbot-segBtn${aiMode ? " is-on" : ""}`,
                "aria-pressed": aiMode,
                onClick: () => setEditField("_cmdMode", "ai"),
              },
              "AI 生成脚本",
            ),
          ),
        ),
        aiMode
          ? [
              editRow(
                "AI 脚本描述词",
                "描述这个定时任务要做的事（如「抓取某网页今日价格并输出一行文本」）。保存后 AI 后台生成脚本：生成期间任务不执行；完成后自动按计划执行（已过的触发时刻不补跑）。",
                TextArea({
                  rows: 3,
                  value: String(e.genPrompt ?? ""),
                  placeholder: "例如：访问 https://example.com/price 抓取今日价格，输出一行「今日价格：xx 元」",
                  onChange: (ev: any) => setEditField("genPrompt", ev.target.value),
                  "aria-label": "AI 脚本描述词",
                }),
              ),
              e.id && String(e.genStatus ?? "") === "pending"
                ? h("div", { className: "qbot-schedGen is-pending" }, "脚本生成中…完成后自动回填命令并按计划执行。")
                : null,
              e.id && String(e.genStatus ?? "") === "done"
                ? h("div", { className: "qbot-schedGen is-done" }, `已生成脚本：${String(e.command ?? "")}。修改描述词并保存会重新生成。`)
                : null,
              e.id && String(e.genStatus ?? "") === "error"
                ? h("div", { className: "qbot-schedGen is-error" }, `上次生成失败：${String(e.genError ?? "未知错误")}。重新保存即重试。`)
                : null,
            ]
          : [
              editRow(
                "要执行的命令",
                "到点由服务端执行这条命令行，捕获 stdout/stderr 与退出码后推送给用户。支持 python / powershell -File / .bat / node / vbs(cscript //Nologo) / perl / php / ruby 等。",
                h(
                  "div",
                  { className: "qbot-schedCmd" },
                  TextArea({
                    rows: 3,
                    className: "qbot-textarea qbot-mono",
                    value: String(e.command ?? ""),
                    placeholder: "python C:/scripts/report.py",
                    onChange: (ev: any) => setEditField("command", ev.target.value),
                    "aria-label": "要执行的命令",
                  }),
                  h(
                    "div",
                    { className: "qbot-schedPresets" },
                    h("span", { className: "qbot-schedPresetLabel" }, "模板"),
                    CMD_TEMPLATES.map((t) =>
                      h("button", { key: t.label, type: "button", className: "qbot-miniBtn", onClick: () => setEditField("command", t.cmd) }, t.label),
                    ),
                  ),
                ),
              ),
              editRow(
                "工作目录（可选）",
                "命令的工作目录；留空则使用插件进程目录。脚本里用相对路径时建议填写。",
                TextInput({
                  className: "qbot-input qbot-mono",
                  value: String(e.cwd ?? ""),
                  placeholder: "例如 C:/scripts",
                  onChange: (ev: any) => setEditField("cwd", ev.target.value),
                  "aria-label": "工作目录",
                }),
              ),
            ],
        editRow(
          "结果处理",
          "raw = 直接把命令输出推送给用户；ai = 先把输出交给 AI 整理成简洁播报再推送（输出很长或含噪音时推荐）。",
          h(
            "select",
            {
              className: "qbot-settingSelect",
              value: e.resultMode === "ai" ? "ai" : "raw",
              onChange: (ev: any) => setEditField("resultMode", ev.target.value),
              "aria-label": "结果处理",
            },
            h("option", { value: "raw" }, "raw：直接推送原始输出"),
            h("option", { value: "ai" }, "ai：交给 AI 整理后推送"),
          ),
        ),
      );
    }
    return editRow(
      "内容",
      e.mode === "ai"
        ? "给 AI 的生成指令（如「播报今天的天气」），到点由 AI 生成内容后发送。"
        : "到点直接发送的文本，上限 2000 字。",
      TextArea({
        rows: 3,
        value: String(e.content ?? ""),
        placeholder: e.mode === "ai" ? "例如：总结今天的待办" : "例如：记得喝水",
        onChange: (ev: any) => setEditField("content", ev.target.value),
        "aria-label": "定时任务内容",
      }),
    );
  };

  return h(
    "div",
    { className: "qbot-modalOverlay" },
    h(
      "div",
      { className: "qbot-modal qbot-modalWide", role: "dialog", "aria-modal": "true", "aria-label": "定时任务管理" },
      h(
        "div",
        { className: "qbot-modalHead" },
        h(
          "div",
          null,
          h("strong", null, "定时任务管理"),
          h("p", null, "支持 daily / interval / cron / at 四种触发条件，以及 文本 / AI 生成 / 执行命令 三种执行方式。"),
        ),
        h("button", { className: "qbot-modalClose", type: "button", "aria-label": "关闭", onClick: onClose }, "×"),
      ),
      ed
        ? [
            h(
              "div",
              { key: "body", className: "qbot-modalBody" },
              h(
                "div",
                { className: "qbot-editForm qbot-schedForm" },
                section(
                  "① 发送给谁",
                  "决定这条任务往哪个群或哪个用户发。",
                  h(
                    "div",
                    { className: "qbot-editGrid" },
                    editRow(
                      "发送范围",
                      "群聊或单聊；改动范围后请确认下方 openid 与之匹配。",
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
                          "aria-label": "发送范围",
                        },
                        h("option", { value: "group" }, "群聊"),
                        h("option", { value: "c2c" }, "单聊"),
                      ),
                    ),
                    editRow(
                      "接收方 openid",
                      "接收消息的群或用户 openid。点击输入框可从消息归档下拉选择：群聊候选显示群 id，单聊候选显示用户 id 与昵称；也可直接粘贴。",
                      h(OpenIdPicker, {
                        chats: archiveChats.chats,
                        scope: ed.scope === "group" ? "group" : "c2c",
                        value: String(ed.openid ?? ""),
                        loading: archiveChats.loading,
                        error: archiveChats.error,
                        onChange: (v: string) => setEditField("openid", v),
                        ariaLabel: "接收方 openid",
                      }),
                    ),
                  ),
                ),
                section(
                  "② 什么时候触发",
                  "选择触发条件并填写对应参数。",
                  h(
                    "div",
                    { className: "qbot-schedFieldCol" },
                    editRow(
                      "触发条件",
                      "每天=指定时刻；间隔=按分钟循环；cron=标准表达式（可带时区）；一次性 at=绝对时间，到点后自动删除。",
                      h(
                        "div",
                        { className: "qbot-schedSeg", role: "group", "aria-label": "触发条件" },
                        (
                          [
                            { v: "daily", label: "每天" },
                            { v: "interval", label: "间隔" },
                            { v: "cron", label: "cron" },
                            { v: "at", label: "一次性 at" },
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
                          "星期过滤（可选）",
                          "仅在这些星期触发；不选 = 每天。0=周日。",
                          weekdayPicker(ed.weekdays),
                        )
                      : null,
                  ),
                ),
                section(
                  "③ 到点做什么",
                  "选择执行方式并填写内容。",
                  h(
                    "div",
                    { className: "qbot-schedFieldCol" },
                    editRow(
                      "执行方式",
                      "文本=到点原样发送；AI 生成=把内容当指令交给 AI 生成后回复；执行命令=到点跑一条命令并把输出推送给用户。",
                      h(
                        "select",
                        {
                          className: "qbot-settingSelect",
                          value: String(ed.mode ?? "text"),
                          onChange: (ev: any) => setEditField("mode", ev.target.value),
                          "aria-label": "执行方式",
                        },
                        h("option", { value: "text" }, "直接发送文本"),
                        h("option", { value: "ai" }, "AI 生成内容"),
                        h("option", { value: "tool" }, "执行命令并推送结果"),
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
                  ? `该任务归属机器人 ${ed.appId.slice(0, 4)}••••${ed.appId.slice(-4)}`
                  : "保存后立即生效并重新计算下次触发时间",
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
                  "取消",
                ),
                h(
                  "button",
                  {
                    className: "qbot-btn qbot-btnPrimary",
                    type: "button",
                    disabled: scheduleModal.saving,
                    onClick: () => void saveScheduleEdit(),
                  },
                  scheduleModal.saving ? "保存中…" : ed.id ? "保存修改" : "创建",
                ),
              ),
            ),
          ]
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
                h(
                  "button",
                  {
                    type: "button",
                    role: "tab",
                    "aria-selected": scheduleModal.botScope === "current",
                    className: `qbot-schedTab${scheduleModal.botScope === "current" ? " is-active" : ""}`,
                    onClick: () => switchScheduleScope("current"),
                  },
                  "当前机器人",
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
                  "所有机器人",
                ),
                h(
                  "button",
                  { type: "button", className: "qbot-btn qbot-btnPrimary qbot-schedAdd", onClick: openScheduleCreate, "aria-label": "新增定时任务" },
                  "＋ 新增",
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
                        "正在读取定时任务…",
                      )
                    : h(
                        "div",
                        { key: "empty", className: "qbot-modalState" },
                        "还没有定时任务。可在聊天里发 /定时 每天 09:00 内容、让 AI 帮你设置，或点上方「＋ 新增」。",
                      )
                  : ([{ scope: "group", title: "群聊任务" }, { scope: "c2c", title: "单聊任务" }] as const).map((g) => {
                      const rows = scheduleModal.items.filter((e: any) => e.scope === g.scope);
                      if (rows.length === 0) return null;
                      return h(
                        "div",
                        { key: g.scope, className: "qbot-schedGroup" },
                        h(
                          "div",
                          { className: "qbot-schedGroupTitle", "data-scope": g.scope },
                          g.title,
                          h("span", { className: "qbot-schedCount" }, `${rows.length}`),
                        ),
                        rows.map((e: any) =>
                          h(
                            "div",
                            { key: String(e.id), className: `qbot-schedRow${e.enabled === false ? " is-disabled" : ""}${e.lastError ? " is-failed" : ""}` },
                            h(
                              "div",
                              { className: "qbot-schedMain" },
                              h(
                                "div",
                                { className: "qbot-schedTop" },
                                e.enabled === false ? h("span", { className: "qbot-chip qbot-chipOff" }, "已禁用") : null,
                                h("span", { className: "qbot-chip is-active" }, summarizeType(e)),
                                e.mode === "ai" ? h("span", { className: "qbot-chip" }, "AI 生成") : null,
                                e.mode === "tool"
                                  ? h(
                                      "span",
                                      { className: "qbot-chip" },
                                      e.resultMode === "ai" ? "命令 → AI 播报" : "命令 → 原始输出",
                                    )
                                  : null,
                                Array.isArray(e.weekdays) && e.weekdays.length
                                  ? h("span", { className: "qbot-chip" }, weekdayText(e.weekdays as number[]))
                                  : null,
                                e.lastError ? h("span", { className: "qbot-chip qbot-chipError" }, "执行失败") : null,
                                e.genStatus === "pending" ? h("span", { className: "qbot-chip qbot-chipInfo" }, "脚本生成中…") : null,
                                e.genStatus === "error" ? h("span", { className: "qbot-chip qbot-chipError" }, "脚本生成失败") : null,
                              ),
                              h(
                                "div",
                                { className: "qbot-schedContent" },
                                e.mode === "tool" && e.genStatus === "pending"
                                  ? `（AI 生成中）${String(e.genPrompt ?? "")}`
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
                                  `${e.scope === "group" ? "群" : "用户"} ${chatLabel(String(e.openid ?? ""))}`,
                                ),
                                h(
                                  "span",
                                  null,
                                  e.createdBy === "settings" ? "来自设置页" : e.createdBy === "ai" ? "来自 AI" : "来自聊天命令",
                                ),
                                h(
                                  "span",
                                  null,
                                  e.enabled === false
                                    ? localizeText("已禁用，不会执行")
                                    : e.genStatus === "pending"
                                      ? localizeText("生成完成后开始执行；已过的触发时刻不补跑")
                                      : `下次 ${e.nextRunAt ? formatTime(e.nextRunAt) : localizeText("待补算")}`,
                                ),
                                e.lastError ? h("span", { className: "qbot-schedError" }, String(e.lastError)) : null,
                              ),
                            ),
                            h(
                              "div",
                              { className: "qbot-schedOps" },
                              h(
                                "button",
                                {
                                  className: "qbot-btn qbot-schedTest",
                                  type: "button",
                                  title: "测试发送一次（不计入主动消息配额）",
                                  disabled: scheduleTesting === String(e.id),
                                  onClick: () => void runOnceSchedule(String(e.id)),
                                },
                                scheduleTesting === String(e.id) ? "测试中…" : "测试",
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
                                    ? "启用中…"
                                    : "禁用中…"
                                  : e.enabled === false
                                    ? "启用"
                                    : "禁用",
                              ),
                              h("button", { className: "qbot-btn qbot-schedEdit", type: "button", onClick: () => openScheduleEdit(e) }, "编辑"),
                              h(
                                "button",
                                {
                                  className: "qbot-btn qbot-btnDanger qbot-schedRemove",
                                  type: "button",
                                  disabled: scheduleRemoving === String(e.id),
                                  onClick: () => void removeSchedule(String(e.id)),
                                },
                                scheduleRemoving === String(e.id) ? "删除中…" : "删除",
                              ),
                            ),
                          ),
                        ),
                      );
                    }),
                ),
            ],
          ),
      !ed
        ? h(
            "div",
            { className: "qbot-modalFoot" },
            h(
              "span",
              { className: "qbot-hint" },
              scheduleModal.maxPerChat > 0
                ? (scheduleModal.botScope === "all"
                  ? `所有机器人共 ${scheduleModal.items.length} 条（每个群/单聊最多 ${scheduleModal.maxPerChat} 条）`
                  : `共 ${scheduleModal.items.length} 条（每个群/单聊最多 ${scheduleModal.maxPerChat} 条）`)
                : (scheduleModal.botScope === "all"
                  ? `所有机器人共 ${scheduleModal.items.length} 条`
                  : `共 ${scheduleModal.items.length} 条`),
            ),
            h(
              "div",
              { className: "qbot-viewActions" },
              h("button", { className: "qbot-btn", type: "button", disabled: scheduleModal.loading, onClick: () => void loadSchedules(scheduleModal.botScope) }, "刷新"),
              h("button", { className: "qbot-btn qbot-btnPrimary", type: "button", onClick: onClose }, "关闭"),
            ),
          )
        : null,
    ),
  );
}
