/**
 * 标准 5 段 cron 解析与「下一次运行时间」计算，支持 IANA 时区（默认 Asia/Shanghai）。
 *
 * 与本项目时区约定一致：人类可读的「墙钟」以目标时区为准，nextRunFor 返回的是真实瞬时
 * （epoch 毫秒），存储时再经 toShanghaiISO 序列化为带偏移的 ISO 字符串。
 *
 * 本模块为纯计算，不依赖任何运行时状态，host（调度引擎）与 client（设置页预览）均可共用。
 */
import { SHANGHAI_TZ } from "./time.js";

/** 月名 → 数字（cron 允许 JAN-DEC）。 */
const MONTH_NAMES: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};
/** 星期名 → 数字（0=周日）。 */
const DOW_NAMES: Record<string, number> = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
};

/** 给定 epoch（毫秒）与目标时区，返回「墙钟 = epoch + offset」所用的偏移毫秒。 */
export function tzOffsetMs(epochMs: number, tz: string): number {
  try {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const parts = dtf.formatToParts(new Date(epochMs));
    const m: Record<string, string> = {};
    for (const p of parts) if (p.type !== "literal") m[p.type] = p.value;
    let hour = Number(m.hour);
    if (hour === 24) hour = 0; // 某些实现在午夜返回 24
    const wall = Date.UTC(
      Number(m.year),
      Number(m.month) - 1,
      Number(m.day),
      hour,
      Number(m.minute),
      Number(m.second),
    );
    return wall - epochMs;
  } catch {
    // 非法时区：回退上海，避免调度崩溃（上海无夏令时，固定 +08:00）。
    if (tz === SHANGHAI_TZ) return 8 * 60 * 60 * 1000;
    return tzOffsetMs(epochMs, SHANGHAI_TZ);
  }
}

const offsetCache = new Map<string, number>();

/**
 * 把「目标时区的一个墙钟时刻」(y/mo/d/h/mi) 转换为真实 epoch 毫秒。
 * 同一自然日（tz 内）的偏移恒定，故按日缓存，避免每分钟都调用 Intl。
 */
export function wallToEpoch(
  y: number,
  mo: number,
  d: number,
  h: number,
  mi: number,
  tz: string,
): number {
  // key 必须带时区：同一进程内混用多个时区的 cron 时，按日缓存的偏移不能串味。
  const key = `${tz}|${y}-${mo}-${d}`;
  let off = offsetCache.get(key);
  if (off === undefined) {
    off = tzOffsetMs(Date.UTC(y, mo - 1, d, 12, 0, 0), tz);
    offsetCache.set(key, off);
  }
  return Date.UTC(y, mo - 1, d, h, mi, 0, 0) - off;
}

function normalizeTz(tz: string | undefined): string {
  if (tz && tz.trim()) return tz.trim();
  return SHANGHAI_TZ;
}

/** 把字段里可能出现的名称（JAN/Mon/SUN 等）或数字解析为数值。 */
function resolveToken(token: string, names?: Record<string, number>): number | null {
  const s = token.trim().toLowerCase();
  if (/^\d+$/.test(s)) return Number(s);
  if (names && names[s] !== undefined) return names[s];
  return null;
}

/**
 * 解析单个 cron 字段为「允许的取值集合」。
 * 支持：星号（匹配全部）、范围 a-b、带步长 a-b/step、列表 a,b,c，以及上述任意组合（含全部按步长）。
 * 取值范围越界或语法非法返回 null。
 */
function parseField(
  field: string,
  min: number,
  max: number,
  names?: Record<string, number>,
): number[] | null {
  const tokens = field.split(",");
  const result = new Set<number>();
  for (const raw of tokens) {
    const tok = raw.trim();
    if (tok === "") return null;
    let stepStr: string | undefined;
    let range = tok;
    const slash = tok.indexOf("/");
    if (slash >= 0) {
      range = tok.slice(0, slash);
      stepStr = tok.slice(slash + 1);
    }
    const step = stepStr === undefined ? 1 : Number(stepStr);
    if (!Number.isInteger(step) || step < 1) return null;
    let lo: number;
    let hi: number;
    if (range === "*" || range === "?") {
      lo = min;
      hi = max;
    } else if (range.includes("-")) {
      const [a, b] = range.split("-");
      const la = resolveToken(a, names);
      const lb = resolveToken(b, names);
      if (la == null || lb == null || la > lb) return null;
      lo = la;
      hi = lb;
    } else {
      const v = resolveToken(range, names);
      if (v == null) return null;
      lo = hi = v;
    }
    if (lo < min || hi > max) return null;
    for (let i = lo; i <= hi; i += step) result.add(i);
  }
  return [...result].sort((a, b) => a - b);
}

export interface CronMatcher {
  minute: number[];
  hour: number[];
  dom: number[];
  month: number[];
  dow: number[];
  /** 原始字段是否为 *（用于 dom/dow 的 OR 语义判断）。 */
  domStar: boolean;
  dowStar: boolean;
}

/** 解析标准 5 段 cron 表达式；非法返回 null。 */
export function parseCron(expr: string): CronMatcher | null {
  const fields = expr.trim().split(/\s+/);
  if (fields.length !== 5) return null;
  const minute = parseField(fields[0], 0, 59);
  const hour = parseField(fields[1], 0, 23);
  const dom = parseField(fields[2], 1, 31);
  const month = parseField(fields[3], 1, 12, MONTH_NAMES);
  const dowRaw = parseField(fields[4], 0, 7, DOW_NAMES);
  if (!minute || !hour || !dom || !month || !dowRaw) return null;
  // cron 约定 7=周日=0
  const dow = dowRaw.map((v) => (v === 7 ? 0 : v));
  return {
    minute,
    hour,
    dom,
    month,
    dow,
    domStar: fields[2] === "*" || fields[2] === "?",
    dowStar: fields[4] === "*" || fields[4] === "?",
  };
}

/** 仅校验语法是否合法。 */
export function isValidCron(expr: string): boolean {
  return parseCron(expr) !== null;
}

/**
 * 判断某个「墙钟时刻」是否满足 cron。
 * 注意：入参是目标时区的墙钟分量（年/月/日/时/分/星期），不是 UTC 瞬时——
 * cron 字段本就以当地墙钟解释，必须与 nextCronRun 在墙钟空间步进保持一致。
 * dom/dow 为 OR 关系，除非其中之一是 *。
 */
function matches(
  c: CronMatcher,
  mo: number,
  d: number,
  h: number,
  mi: number,
  wd: number,
): boolean {
  if (!c.month.includes(mo)) return false;
  const domOk = c.dom.includes(d);
  const dowOk = c.dow.includes(wd);
  let dayOk: boolean;
  if (c.domStar && c.dowStar) dayOk = true;
  else if (c.domStar) dayOk = dowOk;
  else if (c.dowStar) dayOk = domOk;
  else dayOk = domOk || dowOk;
  if (!dayOk) return false;
  return c.hour.includes(h) && c.minute.includes(mi);
}

const MAX_LOOKAHEAD_MINUTES = 5 * 366 * 24 * 60; // 约 5 年，防止极端组合死循环

/**
 * 计算自 now 之后下一次满足 cron 的真实瞬时（epoch 毫秒）。
 * 在目标时区的「墙钟」空间按分钟步进，对每条候选调用 matches。
 * 找不到（如 2 月 30 日这种不可能组合）返回 null。
 */
export function nextCronRun(expr: string, tz: string | undefined, now: Date): Date | null {
  const c = parseCron(expr);
  if (!c) return null;
  const tzz = normalizeTz(tz);
  // 从 now 之后一分钟（目标时区墙钟）开始枚举；cursor 的 UTC 字段即墙钟分量。
  const startWall = new Date(now.getTime() + tzOffsetMs(now.getTime(), tzz) + 60_000);
  let cursor = new Date(startWall.getTime());
  for (let i = 0; i < MAX_LOOKAHEAD_MINUTES; i++) {
    const y = cursor.getUTCFullYear();
    const mo = cursor.getUTCMonth() + 1;
    const d = cursor.getUTCDate();
    const h = cursor.getUTCHours();
    const mi = cursor.getUTCMinutes();
    const epoch = wallToEpoch(y, mo, d, h, mi, tzz);
    if (epoch > now.getTime()) {
      // 星期仅由日历日期决定，与时区无关。
      const wd = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
      if (matches(c, mo, d, h, mi, wd)) return new Date(epoch);
    }
    cursor = new Date(cursor.getTime() + 60_000);
  }
  return null;
}
