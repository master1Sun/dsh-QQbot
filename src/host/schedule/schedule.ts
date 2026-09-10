/**
 * 定时任务（主动消息调度）：schedules.json 持久化 + 30s tick 调度器。
 *
 * 任务类型：daily（HH:mm 上海时间，可选 weekdays）/ interval（≥5 分钟，可选 weekdays）/
 * cron（标准 5 段，可带 tz）/ at（一次性，发完即删）。
 * 执行模式：text（直发）/ ai（prompt 注入会话管线生成回复）/ tool（确定性命令执行，
 * 命令可由 AI 脚本生成器回填）。
 *
 * tool 模式是一条「取数 → 加工 → 门控 → 投递」的确定性流水线：
 *   parsePrompt  加工指令（resultMode=ai 时替代内置的「整理成简洁播报」默认指令）；
 *   gate         发送门控（always / nonempty / changed），未通过则不投递、不占配额；
 * ai 模式则由模型在会话里自主取数加工，并可输出静默标记放弃本次发送（见 SILENT_MARKER）。
 *
 * 说明：不用宿主 dsh-schedule（session-local 提醒，无法无人时主动外发），
 * 这里自建 nextRunAt 落盘 + tick 扫描，触发时按归属机器人把消息推到目标聊天。
 */
import { createHash, randomUUID } from "node:crypto";
import type { BotRuntime } from "../bots.js";
import type { QuotaTracker } from "../infra/quota.js";
import { pluginDataDir, readStoreJson, writeStoreJson } from "../infra/store-file.js";
import { sanitizeOutgoingText } from "../messaging/sanitize.js";
import { SHANGHAI_OFFSET_MS, SHANGHAI_TZ, shanghaiWallClock, toShanghaiISO, toShanghaiISOOrNull } from "../../shared/time.js";
import { isValidCron, nextCronRun, tzOffsetMs } from "../../shared/cron.js";
import { normalizeScriptCommand } from "./command-runner.js";
import { sessionIdOf, webhookDeliveryIdOf } from "../messaging/state.js";

/**
 * 每个群/单聊的定时消息条数**默认上限**（可被 bots.json 的 `scheduleMaxPerChat` 覆盖，0 = 不限）。
 * 仅作为兜底：实际生效值由 ScheduleStore 的 resolver 按机器人配置解析（见 maxPerChat）。
 */
export const MAX_SCHEDULES_PER_CHAT = 15;

/** 定时任务执行类型。 */
export type ScheduleEntryType = "daily" | "interval" | "cron" | "at";

/** 定时任务条目（schedules.json 一行一个对象）。 */
export interface ScheduleEntry {
  id: string;
  createdAt: string;
  scope: "group" | "c2c";
  openid: string;
  type: ScheduleEntryType;
  /** daily：HH:mm（上海时间）。 */
  time?: string;
  /** interval：间隔分钟数（≥5）。 */
  minutes?: number;
  /** cron：标准 5 段表达式。 */
  cron?: string;
  /** cron 使用的 IANA 时区（默认上海）。 */
  tz?: string;
  /** at：一次性触发时刻（ISO）。 */
  at?: string;
  /** 限定星期几执行（0=周日）；interval 类型也生效。 */
  weekdays?: number[];
  /** 执行模式：text 直发 / ai 会话生成 / tool 命令执行。 */
  mode?: "text" | "ai" | "tool";
  /** text=消息内容；ai=生成用 prompt；tool=命令行（优先于 command 字段展示）。 */
  content: string;
  /** tool 模式：规范化后的完整命令。 */
  command?: string;
  /** tool 模式：AI 脚本描述词（非空时走脚本生成流程）。 */
  genPrompt?: string;
  /** AI 脚本生成状态机。 */
  genStatus?: "pending" | "done" | "error";
  genError?: string;
  genStartedAt?: string;
  genDoneAt?: string;
  /** tool 模式：命令工作目录。 */
  cwd?: string;
  /** tool 模式：命令输出处理——raw 原始输出播报 / ai 交给 AI 总结播报。 */
  resultMode?: "raw" | "ai";
  /**
   * 数据加工指令：把取到的数据整理成什么样再发送。
   * tool + resultMode=ai 时替代内置的「整理成简洁播报」默认指令；
   * 留空则用内置默认（见 composeParsePrompt）。
   */
  parsePrompt?: string;
  /**
   * 【任务契约】目标：这条任务服务于什么判断/决策。
   * 供 AI 分诊时理解「为什么发、发给谁看」，ai / tool 模式可用。
   */
  goal?: string;
  /**
   * 【任务契约】通知条件（自然语言）：满足什么才值得发送；不满足则本次静默跳过。
   * 例：「只有涨幅超过 5%、或出现异常时才提醒」。ai / tool 模式可用。
   */
  notifyWhen?: string;
  /**
   * 【任务契约】发送前自校验：
   * tool 模式由**独立模型二次复核**草稿是否满足契约，不达标则不发；
   * ai 模式因内容在会话内生成，降级为**强化的自查指令**。
   */
  verify?: boolean;
  /**
   * 发送门控：投递到 QQ 之前判定「这次值不值得发」。
   * - always（默认）：总是发送；
   * - nonempty：取数结果为空/无实质内容时跳过；
   * - changed：与上次成功发送的内容一致时跳过（适合「有变化才播报」）。
   * 跳过不投递、不消耗主动消息配额，并把原因记入 lastSkipReason。
   */
  gate?: "always" | "nonempty" | "changed";
  /** gate=changed：上次成功发送内容的指纹（sha1 前 16 位），避免明文驻留。 */
  lastDigest?: string;
  /** 最近一次「跳过发送」的时刻（上海时间 ISO）。 */
  lastSkipAt?: string;
  /** 最近一次跳过发送的原因（供界面与排障展示）。 */
  lastSkipReason?: string;
  /** false = 已禁用（调度器跳过、不占配额）。 */
  enabled?: boolean;
  /** 创建来源：chat 命令 / ai 工具 / settings 设置页。 */
  createdBy?: string;
  /** 归属机器人 AppID（缺省走主机器人）。 */
  appId?: string;
  /** 旧版遗留：聊天命令直接给的命令行（tool 模式兼容字段）。 */
  tool?: string;
  /** 旧版遗留：动作参数（tool 模式经动作注册表执行时使用）。 */
  args?: Record<string, unknown>;
  /** 下次触发时刻（上海时区 ISO）。 */
  nextRunAt?: string;
  lastSentAt?: string;
  lastError?: string;
}

/** ScheduleStore.add 的输入：字段经运行时校验后规范化为 ScheduleEntry。 */
export interface ScheduleAddInput {
  id?: string;
  scope?: string;
  openid?: string;
  type?: string;
  mode?: string;
  content?: string;
  command?: string;
  tool?: string;
  genPrompt?: string;
  cwd?: string;
  resultMode?: string;
  parsePrompt?: string;
  goal?: string;
  notifyWhen?: string;
  verify?: unknown;
  gate?: string;
  weekdays?: unknown;
  time?: string;
  minutes?: unknown;
  cron?: string;
  tz?: string;
  at?: string;
  enabled?: boolean;
  createdBy?: string;
  appId?: string;
  [key: string]: unknown;
}

const SCHEDULES_PATH = () => joinPath(pluginDataDir(), "schedules.json");

function joinPath(dir: string, name: string): string {
  return dir.endsWith("\\") || dir.endsWith("/") ? dir + name : `${dir}/${name}`;
}

export class ScheduleStore {
  #entries: ScheduleEntry[] = [];
  #loaded = false;
  #logger: Pick<Console, "warn" | "error">;
  /** 按机器人解析单聊/单群定时条数上限（bots.json `scheduleMaxPerChat`）；0 = 不限。 */
  #resolveMax: (appId?: string) => number;

  constructor(
    logger: Pick<Console, "warn" | "error">,
    resolveMaxPerChat?: (appId?: string) => number,
  ) {
    this.#logger = logger;
    this.#resolveMax = resolveMaxPerChat ?? (() => MAX_SCHEDULES_PER_CHAT);
  }

  /** 某机器人的单群/单聊定时条数上限（0 = 不限）。 */
  maxPerChat(appId?: string): number {
    const n = this.#resolveMax(appId);
    return Number.isSafeInteger(n) && n >= 0 ? n : MAX_SCHEDULES_PER_CHAT;
  }

  async load(): Promise<ScheduleEntry[]> {
    if (this.#loaded) return this.#entries;
    const data = await readStoreJson<unknown[]>(SCHEDULES_PATH());
    const valid = Array.isArray(data)
      ? (data as ScheduleEntry[]).filter((e) => e && e.id && e.openid && (e.content || e.command || e.tool || e.genPrompt))
      : [];
    if (Array.isArray(data) && valid.length !== data.length) {
      this.#logger.warn(`[dsh-qqbot] 定时消息文件存在 ${data.length - valid.length} 条无效记录，已忽略`);
    }
    this.#entries = valid;
    this.#loaded = true;
    return this.#entries;
  }

  async save(): Promise<void> {
    await writeStoreJson(SCHEDULES_PATH(), this.#entries);
  }

  list(): ScheduleEntry[] {
    return [...this.#entries];
  }

  listForChat(scope: string, openid: string): ScheduleEntry[] {
    return this.#entries.filter((e) => e.scope === scope && e.openid === openid);
  }

  countForChat(scope: string, openid: string): number {
    return this.listForChat(scope, openid).length;
  }

  /** 按 id 取内部引用（可直接 mutate 并 save 落盘）。 */
  findById(id: string): ScheduleEntry | undefined {
    return this.#entries.find((e) => e.id === id);
  }

  /**
   * 添加定时消息；超过单聊上限或参数非法时返回错误文案。
   * 传 id 时为编辑（保留原 id），否则新建。
   */
  async add(input: ScheduleAddInput): Promise<{ ok: boolean; error?: string; entry?: ScheduleEntry }> {
    const scope = input.scope === "c2c" ? "c2c" : input.scope === "group" ? "group" : null;
    if (!scope || !input.openid) return { ok: false, error: "缺少 scope/openid" };
    const type: ScheduleEntryType | null =
      input.type === "daily" ? "daily" : input.type === "interval" ? "interval" : input.type === "cron" ? "cron" : input.type === "at" ? "at" : null;
    if (!type) return { ok: false, error: "type 必须是 daily / interval / cron / at 之一" };
    const mode = input.mode === "ai" ? "ai" : input.mode === "tool" ? "tool" : "text";
    let content = input.content?.toString() ?? "";
    const legacyTool = typeof input.tool === "string" && input.tool.trim() ? input.tool.trim() : "";
    const genPrompt = input.genPrompt?.toString().trim() ?? "";
    const parsePrompt = input.parsePrompt?.toString().trim() ?? "";
    // 任务契约：对 ai / tool 两种「由模型判断」的模式生效，长度做上限保护。
    const goal = input.goal?.toString().trim() ?? "";
    const notifyWhen = input.notifyWhen?.toString().trim() ?? "";
    if (goal.length > 2e2) return { ok: false, error: "任务目标过长（上限 200 字）" };
    if (notifyWhen.length > 5e2) return { ok: false, error: "通知条件过长（上限 500 字）" };
    if (mode !== "tool") {
      content = content.trim();
      if (!content) return { ok: false, error: "内容不能为空" };
      if (content.length > 2e3) return { ok: false, error: "内容过长（上限 2000 字）" };
    } else {
      const cmd = input.command?.toString().trim() ?? "";
      if (!cmd && !legacyTool && !genPrompt) {
        return { ok: false, error: "工具模式必须填写要执行的命令（如 python C:/scripts/report.py），或填写 AI 脚本描述词" };
      }
      if (genPrompt.length > 2e3) return { ok: false, error: "AI 脚本描述词过长（上限 2000 字）" };
      if (input.cwd !== void 0 && typeof input.cwd !== "string") {
        return { ok: false, error: "工作目录（cwd）必须是字符串" };
      }
      if (input.resultMode !== void 0 && input.resultMode !== "raw" && input.resultMode !== "ai") {
        return { ok: false, error: "结果处理（resultMode）必须是 raw 或 ai" };
      }
      if (parsePrompt.length > 2e3) return { ok: false, error: "数据加工指令过长（上限 2000 字）" };
      if (input.gate !== void 0 && input.gate !== "always" && input.gate !== "nonempty" && input.gate !== "changed") {
        return { ok: false, error: "发送门控（gate）必须是 always / nonempty / changed" };
      }
    }
    let weekdays: number[] | undefined;
    if (input.weekdays !== void 0) {
      if (!Array.isArray(input.weekdays) || input.weekdays.length === 0) {
        return { ok: false, error: "weekdays 必须是非空数字数组" };
      }
      const set = new Set<number>();
      for (const w of input.weekdays) {
        const n = Number(w);
        if (!Number.isInteger(n) || n < 0 || n > 6) return { ok: false, error: "weekdays 元素必须是 0-6（0=周日）" };
        set.add(n);
      }
      weekdays = [...set];
    }
    let time: string | undefined;
    let minutes: number | undefined;
    let cron: string | undefined;
    let tz: string | undefined;
    let at: string | undefined;
    if (type === "daily") {
      if (!/^\d{1,2}:\d{2}$/.test(input.time ?? "")) {
        return { ok: false, error: "time 格式应为 HH:mm（上海时间，如 09:30）" };
      }
      time = input.time;
    } else if (type === "interval") {
      const m = Number(input.minutes);
      if (!Number.isSafeInteger(m) || m < 5) return { ok: false, error: "间隔不能小于 5 分钟" };
      minutes = m;
    } else if (type === "cron") {
      if (!isValidCron(input.cron ?? "")) {
        return { ok: false, error: 'cron 表达式非法（标准 5 段，如 "0 9 * * 1-5"）' };
      }
      cron = input.cron;
      tz = input.tz?.trim() || SHANGHAI_TZ;
    } else if (type === "at") {
      const d = new Date(input.at ?? "");
      if (Number.isNaN(d.getTime())) return { ok: false, error: "at 必须是合法 ISO 时间" };
      if (d.getTime() <= Date.now()) return { ok: false, error: "at 时间必须晚于当前时间" };
      at = d.toISOString();
    }
    const existing = input.id ? this.#entries.find((e) => e.id === input.id) : void 0;
    if (input.id && !existing) return { ok: false, error: "未找到该定时任务" };
    const maxPerChat = this.maxPerChat(input.appId);
    // 0 = 不限
    if (!existing && maxPerChat > 0 && this.countForChat(scope, String(input.openid)) >= maxPerChat) {
      return { ok: false, error: `每个群/单聊最多 ${maxPerChat} 条定时任务` };
    }
    const prevGenPrompt = existing?.genPrompt ?? "";
    const regen = Boolean(genPrompt) && (genPrompt !== prevGenPrompt || existing?.genStatus === "error");
    const genStatus = genPrompt ? (regen || !existing ? "pending" : existing?.genStatus ?? "pending") : void 0;
    const entry: ScheduleEntry = {
      ...(existing ?? { id: randomUUID(), createdAt: toShanghaiISO() }),
      scope,
      openid: String(input.openid),
      type,
      time,
      minutes,
      cron,
      tz,
      at,
      weekdays,
      mode,
      content: mode === "tool" ? input.command?.toString() ?? input.content?.toString() ?? legacyTool ?? genPrompt : content,
      // 保存即规范化：解释器与脚本扩展名不匹配（如 powershell -File xxx.vbs）时改写为正确解释器。
      command: mode === "tool" && input.command ? normalizeScriptCommand(input.command.toString()) ?? input.command.toString().trim() : void 0,
      genPrompt: genPrompt || void 0,
      genStatus,
      genError: genStatus === "pending" ? void 0 : existing?.genError,
      genStartedAt: genStatus === "pending" ? toShanghaiISO() : existing?.genStartedAt,
      genDoneAt: genStatus === "done" ? existing?.genDoneAt : void 0,
      cwd: mode === "tool" && input.cwd ? String(input.cwd).trim() || void 0 : void 0,
      resultMode: mode === "tool" ? (input.resultMode === "ai" ? "ai" : "raw") : void 0,
      // 加工指令与发送门控仅对 tool 模式生效：text 内容固定、ai 由模型现场生成，
      // 都不存在「取数 → 加工 → 门控」这一段确定性流水线。
      parsePrompt: mode === "tool" && parsePrompt ? parsePrompt : void 0,
      // 任务契约：ai 与 tool 两种模式都生效（text 是固定句子直发，无分诊/校验）。
      goal: mode !== "text" && goal ? goal : void 0,
      notifyWhen: mode !== "text" && notifyWhen ? notifyWhen : void 0,
      verify: mode !== "text" ? input.verify === true || input.verify === "true" : void 0,
      gate: mode === "tool"
        ? input.gate === "nonempty" ? "nonempty" : input.gate === "changed" ? "changed" : "always"
        : void 0,
      // 编辑已禁用的任务时保留禁用态，避免「改一下内容就被重新启用」。
      enabled: input.enabled === void 0 ? existing?.enabled ?? true : Boolean(input.enabled),
      ...(input.createdBy ? { createdBy: input.createdBy } : {}),
      ...(input.appId ? { appId: input.appId } : {}),
      nextRunAt: void 0,
      lastError: void 0,
    };
    if (mode === "tool" && genPrompt && !regen && existing?.command && !entry.command) {
      entry.command = existing.command;
    }
    if (mode === "tool" && genStatus === "pending" && genPrompt && !input.command?.toString().trim()) {
      entry.command = void 0;
    }
    entry.nextRunAt = entry.enabled ? toShanghaiISOOrNull(nextRunFor(entry, new Date())) : void 0;
    if (existing) {
      Object.assign(existing, entry, { id: existing.id, createdAt: existing.createdAt });
    } else {
      this.#entries.push(entry);
    }
    await this.save();
    return { ok: true, entry };
  }

  /**
   * 启用 / 禁用定时任务（设置页「禁用」按钮 + AI 工具）。
   * 禁用后 dueEntries 不再返回该条目，调度器不会执行它（也不占用主动消息配额）。
   * 重新启用时按当前时刻重算下次运行，避免把禁用期间累积的过期时刻一次性补发。
   */
  async setEnabled(id: string, enabled: boolean): Promise<{ ok: boolean; error?: string; entry?: ScheduleEntry }> {
    await this.load();
    const entry = this.#entries.find((e) => e.id === id);
    if (!entry) return { ok: false, error: "未找到该定时消息" };
    const wasEnabled = entry.enabled !== false;
    entry.enabled = enabled;
    if (!enabled) {
      entry.nextRunAt = void 0;
    } else if (!wasEnabled || !entry.nextRunAt || new Date(entry.nextRunAt).getTime() <= Date.now()) {
      entry.nextRunAt = toShanghaiISOOrNull(nextRunFor(entry, new Date()));
    }
    await this.save();
    return { ok: true, entry };
  }

  /** 按序号（聊天内）或 id 删除。 */
  async remove(scope: string, openid: string, idOrIndex: string): Promise<{ ok: boolean; error?: string; entry?: ScheduleEntry }> {
    const mine = this.listForChat(scope, openid);
    let entry: ScheduleEntry | undefined;
    const index = Number(idOrIndex);
    if (Number.isSafeInteger(index) && index >= 1) {
      entry = mine[index - 1];
    } else {
      entry = mine.find((e) => e.id === idOrIndex);
    }
    if (!entry) return { ok: false, error: `未找到该定时消息（序号 1-${mine.length}）` };
    this.#entries = this.#entries.filter((e) => e.id !== entry!.id);
    await this.save();
    return { ok: true, entry };
  }

  /** 设置页用：仅凭全局 id 删除（无需 scope/openid）。 */
  async removeById(id: string): Promise<{ ok: boolean; error?: string; entry?: ScheduleEntry }> {
    await this.load();
    const entry = this.#entries.find((e) => e.id === id);
    if (!entry) return { ok: false, error: "未找到该定时消息" };
    this.#entries = this.#entries.filter((e) => e.id !== id);
    await this.save();
    return { ok: true, entry };
  }

  /**
   * 记录一次「跳过发送」：门控未通过或 AI 判定静默。
   * 不投递、不消耗主动消息配额，仅留下时间与原因供界面/排障查看
   * （`lastError` 同时清空——跳过不是失败）。
   */
  async markSkipped(id: string, reason: string): Promise<void> {
    const entry = this.#entries.find((e) => e.id === id);
    if (!entry) return;
    entry.lastSkipAt = toShanghaiISO();
    entry.lastSkipReason = reason;
    entry.lastError = void 0;
    await this.save();
  }

  /** 到达执行时间的条目（now 之前）。AI 脚本生成中/失败的任务不执行（等生成完成后按计划继续）。 */
  dueEntries(now: Date): ScheduleEntry[] {
    return this.#entries.filter((e) => {
      if (!e.enabled) return false;
      if (e.genStatus === "pending" || e.genStatus === "error") return false;
      if (!e.nextRunAt) return false;
      return new Date(e.nextRunAt).getTime() <= now.getTime();
    });
  }
}

/**
 * 内容指纹（gate=changed 用）：归一化空白后取 sha1 前 16 位。
 * 存指纹而非明文，避免脚本输出里的敏感内容长期驻留在 schedules.json。
 */
export function contentDigest(text: string): string {
  return createHash("sha1").update((text ?? "").replace(/\s+/g, " ").trim()).digest("hex").slice(0, 16);
}

/**
 * 发送门控判定：返回 null 表示照常投递，否则返回「跳过原因」。
 * 只在 tool 模式（有确定性取数结果）下调用；always 直接放行。
 * 注意：`changed` 命中新内容时会**就地更新** entry.lastDigest，
 * 调用方负责落盘（调度器 tick / 测试执行结束时都会 save）。
 */
export function gateSkipReason(entry: ScheduleEntry, text: string): string | null {
  const gate = entry.gate ?? "always";
  if (gate === "always") return null;
  const body = (text ?? "").trim();
  if (gate === "nonempty") {
    return !body || body === "（无输出）" ? "本次取数没有实质输出，已跳过发送" : null;
  }
  if (gate === "changed") {
    const digest = contentDigest(body);
    if (entry.lastDigest && entry.lastDigest === digest) return "内容与上次一致，已跳过发送";
    entry.lastDigest = digest;
    return null;
  }
  return null;
}

/** daily（HH:mm 上海时间 + 可选 weekdays）的下一次触发时刻。 */export function nextDailyRun(time: string, now: Date, weekdays?: number[]): Date | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  if (hour > 23 || minute > 59) return null;
  const wall = shanghaiWallClock(now);
  const target = new Date(wall);
  target.setUTCHours(hour, minute, 0, 0);
  let realMs = target.getTime() - SHANGHAI_OFFSET_MS;
  if (realMs <= now.getTime()) realMs += 24 * 60 * 60 * 1e3;
  const allowed = weekdays && weekdays.length ? new Set(weekdays.map((w) => ((w % 7) + 7) % 7)) : null;
  if (allowed) {
    let guard = 0;
    while (!allowed.has(new Date(realMs + SHANGHAI_OFFSET_MS).getUTCDay()) && guard < 14) {
      realMs += 24 * 60 * 60 * 1e3;
      guard++;
    }
    if (guard >= 14) return null;
  }
  return new Date(realMs);
}

/** interval（≥5 分钟）的下一次触发时刻。 */
export function nextIntervalRun(minutes: number, now: Date): Date | null {
  if (!Number.isSafeInteger(minutes) || minutes < 5) return null;
  return new Date(now.getTime() + minutes * 6e4);
}

/** 按任务类型计算下一次触发时刻。 */
export function nextRunFor(entry: ScheduleEntry, now: Date): Date | null {
  if (entry.type === "daily") return nextDailyRun(entry.time ?? "", now, entry.weekdays);
  if (entry.type === "interval") return nextIntervalRun(Number(entry.minutes), now);
  if (entry.type === "cron") return isValidCron(entry.cron ?? "") ? nextCronRun(entry.cron!, entry.tz, now) : null;
  if (entry.type === "at") return entry.at ? new Date(entry.at) : null;
  return null;
}

/** 宿主会话总线（cordis ctx）：仅用 session/event 的订阅与退订。 */
export interface ScheduleBus {
  on(event: "session/event", listener: (session: unknown, event: { type: string; data?: unknown }) => void): unknown;
  off(event: "session/event", listener: (session: unknown, event: { type: string; data?: unknown }) => void): unknown;
}

/**
 * tool 模式的一次执行结果。
 * `skipped=true` 表示本次**没有投递**（发送门控未通过），
 * 调度层据此归还预扣的主动消息配额、且不计入发送计数。
 * （AI 加工 / AI 静默的跳过发生在回复投递阶段，由回复泵归还配额，不在这里返回。）
 */
export interface ScheduleSkipResult {
  skipped?: boolean;
  reason?: string;
}

export interface SchedulerContext {
  store: ScheduleStore;
  /** 按 appId 取运行时机器人；缺省回落主机器人。 */
  resolveBot: (appId?: string) => BotRuntime | undefined;
  /** 主动消息每日配额（定时任务消耗）。 */
  quota?: QuotaTracker;
  /**
   * AI 模式执行回调：把 prompt 当作合成事件注入 webhookRuntime，返回 deliveryId
   * （供测试执行时等待真实投递结果）。
   */
  generateAndSend?: (entry: ScheduleEntry, bot: BotRuntime) => Promise<string | void>;
  /**
   * tool 模式执行回调：执行命令 / 动作，并按发送门控决定是否投递。
   * 返回 `{ skipped: true }` 表示门控拦下、本次未投递（调度层会归还预扣配额）。
   */
  executeTool?: (entry: ScheduleEntry, bot: BotRuntime) => Promise<ScheduleSkipResult | void>;
  /** 宿主会话总线（测试执行时等待投递结果）。 */
  bus?: ScheduleBus;
  logger: Pick<Console, "info" | "warn" | "error">;
}

export class Scheduler {
  #ctx: SchedulerContext;
  #timer: ReturnType<typeof setInterval> | null = null;
  #running = false;

  constructor(ctx: SchedulerContext) {
    this.#ctx = ctx;
  }

  start(): void {
    if (this.#timer) return;
    void this.#ctx.store.load().then((entries) => {
      const now = new Date();
      let changed = false;
      for (const entry of entries) {
        if (!entry.enabled) continue;
        const next = new Date(entry.nextRunAt ?? 0);
        if (!entry.nextRunAt || next.getTime() <= now.getTime()) {
          const computed = nextRunFor(entry, now);
          entry.nextRunAt = toShanghaiISOOrNull(computed);
          changed = true;
        }
      }
      if (changed) void this.#ctx.store.save();
    });
    this.#timer = setInterval(() => {
      void this.tick();
    }, 3e4);
    this.#timer.unref?.();
  }

  stop(): void {
    if (this.#timer) clearInterval(this.#timer);
    this.#timer = null;
  }

  async tick(now = new Date()): Promise<void> {
    if (this.#running) return;
    this.#running = true;
    try {
      await this.#ctx.store.load();
      for (const entry of this.#ctx.store.dueEntries(now)) {
        const bot = this.#ctx.resolveBot(entry.appId);
        if (!bot) {
          entry.lastError = `机器人 ${entry.appId ?? "(未指定)"} 不可用（已删除或未启用）`;
          entry.nextRunAt = toShanghaiISOOrNull(nextRunFor(entry, now));
          continue;
        }
        if (this.#ctx.quota && !(await this.#ctx.quota.tryConsume())) {
          // 配额耗尽：5 分钟后重试（不报错误）。
          entry.nextRunAt = toShanghaiISOOrNull(new Date(now.getTime() + 5 * 6e4));
          continue;
        }
        // interval + weekdays：非限定星期跳过本次（顺延到下一个间隔点）。
        if (entry.type === "interval" && entry.weekdays?.length) {
          const off = tzOffsetMs(now.getTime(), entry.tz || SHANGHAI_TZ);
          const wd = new Date(now.getTime() + off).getUTCDay();
          const allowed = new Set(entry.weekdays.map((w) => ((w % 7) + 7) % 7));
          if (!allowed.has(wd)) {
            entry.nextRunAt = toShanghaiISOOrNull(nextRunFor(entry, now));
            continue;
          }
        }
        try {
          let skip: ScheduleSkipResult | void = undefined;
          if (entry.mode === "ai" && this.#ctx.generateAndSend) {
            await this.#ctx.generateAndSend(entry, bot);
          } else if (entry.mode === "tool" && this.#ctx.executeTool) {
            skip = await this.#ctx.executeTool(entry, bot);
          } else if (entry.mode === "tool") {
            throw new Error("tool 执行器未配置，无法运行该定时任务");
          } else {
            await bot.client.sendText(
              { scope: entry.scope, openid: entry.openid },
              sanitizeOutgoingText(entry.content, { enabled: bot.config.sanitizeReplies })
            );
          }
          if (skip?.skipped) {
            // 发送门控拦下：本次没有投递 → 归还预扣配额、不计发送数，只留跳过原因。
            const reason = skip.reason || "本次无需发送，已跳过";
            entry.lastSkipAt = toShanghaiISO(now);
            entry.lastSkipReason = reason;
            entry.lastError = void 0;
            await this.#ctx.quota?.refund();
            this.#ctx.logger.info(
              `[dsh-qqbot] 定时任务跳过发送（机器人 ${bot.appId}，mode=tool，gate=${entry.gate ?? "always"}）：${reason}`
            );
          } else {
            bot.state.counters.proactive += 1;
            entry.lastSentAt = toShanghaiISO(now);
            entry.lastError = void 0;
            entry.lastSkipReason = void 0;
          }
          if (entry.type === "at") {
            // 一次性任务发完即删（跳过也算已触发，避免遗留一条永不生效的任务）。
            await this.#ctx.store.removeById(entry.id);
            this.#ctx.logger.info(`[dsh-qqbot] 一次性定时任务已完成并删除 → ${entry.id}`);
            continue;
          }
          const next = nextRunFor(entry, now);
          entry.nextRunAt = toShanghaiISOOrNull(next);
          this.#ctx.logger.info(
            `[dsh-qqbot] 定时任务已发送（机器人 ${bot.appId}，type=${entry.type}，mode=${entry.mode ?? "text"}）→ ${entry.scope}:${entry.openid}`
          );
        } catch (error) {
          entry.lastError = error instanceof Error ? error.message : String(error);
          const next = nextRunFor(entry, now);
          entry.nextRunAt = toShanghaiISOOrNull(next);
          this.#ctx.logger.error("[dsh-qqbot] 定时任务执行失败:", error);
        }
        void bot.archiver.append({
          kind: "proactive",
          chat: `${entry.scope}:${entry.openid}`,
          content: entry.content,
          note: `schedule:${entry.type}`
        });
      }
      await this.#ctx.store.save();
    } finally {
      this.#running = false;
    }
  }

  /**
   * 手动执行一次（来自设置页「测试」按钮）。
   * 真实发送一次，但：不计入主动消息配额（bot.state.counters.proactive 不 +1）、
   * 不改写 nextRunAt、不删除 at 任务——仅把结果写回 lastError / lastSentAt 供前端展示。
   * AI 模式会等会话管线真实投递完成（或失败/超时）才返回结果；失败也不顺延，仅记录错误。
   */
  async runOnce(id: string): Promise<{ ok: boolean; message: string }> {
    await this.#ctx.store.load();
    const entry = this.#ctx.store.findById(id);
    if (!entry) return { ok: false, message: "定时任务不存在（可能已被删除）" };
    const bot = this.#ctx.resolveBot(entry.appId);
    if (!bot) return { ok: false, message: `机器人 ${entry.appId ?? "(未指定)"} 不可用（已删除或未启用）` };
    try {
      if (entry.mode === "ai" && this.#ctx.generateAndSend) {
        const deliveryId = (await this.#ctx.generateAndSend(entry, bot)) || undefined;
        const res = await this.#awaitDelivery(bot, deliveryId, 6e4);
        if (!res.ok) return { ok: false, message: `测试发送失败：${res.message}` };
      } else if (entry.mode === "tool" && this.#ctx.executeTool) {
        const skip = await this.#ctx.executeTool(entry, bot);
        // 测试执行同样走门控：拦下时如实告知，便于用户调参（测试本就不占配额）。
        if (skip?.skipped) {
          const reason = skip.reason || "本次无需发送，已跳过";
          entry.lastSkipAt = toShanghaiISO(new Date());
          entry.lastSkipReason = reason;
          entry.lastError = void 0;
          await this.#ctx.store.save();
          return { ok: true, message: `发送门控判定本次无需发送，已跳过：${reason}` };
        }
      } else if (entry.mode === "tool") {
        throw new Error("tool 执行器未配置，无法运行该定时任务");
      } else {
        await bot.client.sendText(
          { scope: entry.scope, openid: entry.openid },
          sanitizeOutgoingText(entry.content, { enabled: bot.config.sanitizeReplies })
        );
      }
      entry.lastSentAt = toShanghaiISO(new Date());
      entry.lastError = void 0;
      await this.#ctx.store.save();
      return { ok: true, message: "已测试发送一次（不计入主动消息配额）" };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      entry.lastError = msg;
      await this.#ctx.store.save();
      return { ok: false, message: `测试发送失败：${msg}` };
    }
  }

  /**
   * 等待某条合成事件（按 deliveryId）经会话管线真实投递完成。
   * 监听宿主 session/event：先捕获其绑定的会话，再等该会话 turn/end。
   * - 产出内容 → 视为投递成功；
   * - AI 报错（reason.kind=error）→ 视为失败并带回错误原因；
   * - 超时（默认 60s）→ 按计数器是否变化判断：已发/已错/无响应。
   */
  #awaitDelivery(bot: BotRuntime, deliveryId: string | undefined, timeoutMs: number): Promise<{ ok: boolean; message: string }> {
    const bus = this.#ctx.bus;
    if (!bus) return Promise.resolve({ ok: true, message: "已派发（环境无会话总线，无法确认投递，请稍后查看聊天）" });
    if (!deliveryId) return Promise.resolve({ ok: true, message: "已派发（无 deliveryId，无法确认投递，请稍后查看聊天）" });
    const repliesBefore = bot.state.counters.replies;
    const errorsBefore = bot.state.counters.errors;
    return new Promise((resolve) => {
      let settled = false;
      let boundSessionId: string | null = null;
      let pollTimer: ReturnType<typeof setInterval> | undefined;
      const finish = (ok: boolean, message: string) => {
        if (settled) return;
        settled = true;
        if (pollTimer) clearInterval(pollTimer);
        try {
          bus.off("session/event", onSessionEvent);
        } catch {
          // 总线已销毁等场景：忽略
        }
        resolve({ ok, message });
      };
      // 实际发送在 turn/end 之后异步落计数：轮询 replies/errors 才是「真发出/真失败」。
      const judge = (): boolean => {
        if (bot.state.counters.replies > repliesBefore) {
          finish(true, "已生成并发送");
          return true;
        }
        if (bot.state.counters.errors > errorsBefore) {
          finish(false, "投递失败（详见运行日志 / 群是否开启「机器人主动发言」权限）");
          return true;
        }
        return false;
      };
      const onSessionEvent = (session: unknown, event: { type: string; data?: unknown }) => {
        try {
          if (event.type === "user/message") {
            if (webhookDeliveryIdOf(event.data) === deliveryId) {
              const sid = sessionIdOf(session);
              if (sid) boundSessionId = sid;
            }
          } else if (event.type === "turn/end" && boundSessionId) {
            if (sessionIdOf(session) !== boundSessionId) return;
            const data = event.data as { reason?: { kind?: unknown; error?: { message?: unknown } } } | undefined;
            const reason = data?.reason;
            if (reason && reason.kind === "error") {
              const fm = typeof reason.error?.message === "string" ? reason.error.message : "";
              finish(false, fm ? fm.slice(0, 200) : "AI 生成失败");
              return;
            }
          }
        } catch {
          // 不阻塞其他事件
        }
      };
      bus.on("session/event", onSessionEvent);
      pollTimer = setInterval(() => void judge(), 500);
      setTimeout(() => {
        if (!settled && !judge()) {
          finish(false, "AI 已生成但未能发送（会话未绑定，或群未开启「机器人主动发言」权限）");
        }
      }, timeoutMs);
    });
  }
}
