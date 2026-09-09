/**
 * 定时任务命令执行器（tool 模式）：在宿主 shell 里确定性执行命令（不开 LLM），
 * 统一超时/缓冲/编码（UTF-8 优先、GBK 兜底），并负责把 AI 生成脚本回填成
 * 可执行命令（scriptCommandFor）与解释器规范化（normalizeScriptCommand）。
 */
import { exec } from "node:child_process";
import { promisify } from "node:util";
import * as fs from "node:fs";
import * as nodePath from "node:path";

const execAsync = promisify(exec);

const COMMAND_TIMEOUT_DEFAULT_MS = 12e4;
const COMMAND_TIMEOUT_MAX_MS = 6e5;
const MAX_BUFFER = 8 * 1024 * 1024;

/** 脚本扩展名 → 解释器前缀（空串=直接执行）。 */
const SCRIPT_RUNNERS: Record<string, string> = {
  ".py": "python",
  ".ps1": "powershell -NoProfile -ExecutionPolicy Bypass -File",
  ".bat": "",
  ".cmd": "",
  ".vbs": "cscript //Nologo",
  ".wsf": "cscript //Nologo",
  ".mjs": "node",
  ".js": "node",
  ".pl": "perl",
  ".php": "php",
  ".rb": "ruby",
  ".lua": "lua",
  ".sh": "bash",
};

/** 各脚本类型的合法解释器头部（用于判断命令是否已带解释器）。 */
const RUNNER_HEADS: Record<string, string[]> = {
  ".py": ["python", "python3", "py"],
  ".ps1": ["powershell", "pwsh"],
  ".bat": ["cmd"],
  ".cmd": ["cmd"],
  ".vbs": ["cscript"],
  ".wsf": ["cscript"],
  ".mjs": ["node"],
  ".js": ["node"],
  ".pl": ["perl"],
  ".php": ["php"],
  ".rb": ["ruby"],
  ".lua": ["lua"],
  ".sh": ["bash", "sh"],
};

const SCRIPT_EXT_RE = /\.(vbs|wsf|py|ps1|bat|cmd|mjs|js|pl|php|rb|lua|sh)$/i;

function quoteIfNeeded(path: string): string {
  const p = path.trim();
  if (/[\s]/.test(p)) return p.startsWith('"') && p.endsWith('"') ? p : `"${p}"`;
  return p;
}

interface CommandToken {
  text: string;
  quoted: boolean;
  index: number;
  len: number;
}

function tokenizeCommand(cmd: string): CommandToken[] {
  const tokens: CommandToken[] = [];
  const tokenRe = /"([^"]*)"|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = tokenRe.exec(cmd))) {
    tokens.push({ text: (m[1] ?? m[2] ?? "").trim(), quoted: m[1] !== void 0, index: m.index, len: m[0].length });
  }
  return tokens;
}

/** 会被 Windows Store「假 python」遮蔽的解释器名。 */
const SHADOWED_HEADS = new Set(["python", "python3", "py"]);

function safeExists(p: string): boolean {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

function scanForPython(root: string): string | null {
  if (!safeExists(root)) return null;
  try {
    const dirs = fs
      .readdirSync(root, { withFileTypes: true })
      .filter((e) => e.isDirectory() && /^python\d+/i.test(e.name))
      .map((e) => e.name)
      .sort()
      .reverse();
    for (const d of dirs) {
      const exe = nodePath.join(root, d, "python.exe");
      if (safeExists(exe)) return exe;
    }
  } catch {
    // 读取失败按不存在处理
  }
  return null;
}

/** 找到真实的 python 解释器（绕开 Windows Store 的假 py.exe）。 */
function findRealPython(): string | null {
  const localAppData = process.env.LOCALAPPDATA || "";
  const pyCandidates = [nodePath.join(localAppData, "Programs", "Python", "Launcher", "py.exe"), "C:\\Windows\\py.exe"];
  for (const c of pyCandidates) {
    if (safeExists(c)) return c;
  }
  const searchRoots = [
    nodePath.join(localAppData, "Programs", "Python"),
    "C:\\Python",
    "C:\\Program Files\\Python",
    "C:\\Program Files (x86)\\Python",
  ];
  for (const root of searchRoots) {
    const found = scanForPython(root);
    if (found) return found;
  }
  return null;
}

/** 命令头部是裸 python 时替换为真实解释器全路径；否则原样返回。 */
function maybeResolvePython(cmd: string): string | null {
  const tokens = tokenizeCommand(cmd);
  if (tokens.length === 0) return null;
  const first = tokens[0];
  const head = first.text.replace(/\.exe$/i, "").toLowerCase();
  if (!SHADOWED_HEADS.has(head)) return null;
  if (nodePath.isAbsolute(first.text)) return null;
  const real = findRealPython();
  if (!real) return null;
  const rest = cmd.slice(first.index + first.len);
  return `${quoteIfNeeded(real)}${rest}`;
}

/**
 * 保存时规范化 tool 命令：若命令里出现脚本文件而解释器缺失/不匹配
 * （如 powershell -File xxx.vbs），改写为正确解释器前缀；
 * 命令已可执行（自带解释器或无需解释器）时返回 null（无需改写）。
 */
export function normalizeScriptCommand(command: string): string | null {
  const cmd = command.trim();
  if (!cmd) return null;
  const tokens = tokenizeCommand(cmd);
  if (tokens.length === 0) return null;
  const first = tokens[0];
  const firstHead = first.text.replace(/\.exe$/i, "").replace(/\\/g, "/").toLowerCase();
  for (const t of tokens) {
    const extMatch = SCRIPT_EXT_RE.exec(t.text);
    if (!extMatch) continue;
    const ext = `.${extMatch[1].toLowerCase()}`;
    const runner = SCRIPT_RUNNERS[ext];
    const heads = RUNNER_HEADS[ext] ?? [];
    const rest = cmd.slice(t.index + t.len);
    const rewritten = `${runner ? `${runner} ` : ""}${quoteIfNeeded(t.text)}${rest}`;
    if (t === first) {
      if (heads.includes("cmd")) return null;
      return rewritten;
    }
    const matched = heads.some((h) => firstHead === h || firstHead.endsWith(`/${h}`));
    if (matched) return null;
    return rewritten;
  }
  return null;
}

/** 由脚本绝对路径生成执行命令（AI 脚本生成完成后的回填）。 */
export function scriptCommandFor(absPath: string): string | null {
  const extMatch = SCRIPT_EXT_RE.exec(absPath);
  if (!extMatch) return null;
  const runner = SCRIPT_RUNNERS[`.${extMatch[1].toLowerCase()}`];
  return `${runner ? `${runner} ` : ""}${quoteIfNeeded(absPath)}`;
}

export interface CommandRunOptions {
  timeoutMs?: number;
  cwd?: string;
  env?: Record<string, string>;
}

export interface CommandRunResult {
  ok: boolean;
  exitCode: number | null;
  command: string;
  stdout: string;
  stderr: string;
  durationMs: number;
  timedOut: boolean;
  error?: string;
}

/** 执行一条命令：统一超时/缓冲/windowsHide，输出按 UTF-8 → GBK 解码。 */
export async function runCommand(command: string, options: CommandRunOptions = {}): Promise<CommandRunResult> {
  const startedAt = Date.now();
  const cmd = maybeResolvePython(command.trim()) ?? command.trim();
  const shellOpts: Record<string, unknown> = {
    timeout: normalizeTimeout(options.timeoutMs),
    maxBuffer: MAX_BUFFER,
    windowsHide: true,
    encoding: "buffer",
  };
  if (options.cwd && options.cwd.trim()) shellOpts.cwd = options.cwd.trim();
  if (options.env) shellOpts.env = { ...process.env, ...options.env };
  try {
    const { stdout, stderr } = (await execAsync(cmd, shellOpts)) as unknown as { stdout: Buffer; stderr: Buffer };
    return {
      ok: true,
      exitCode: 0,
      command: cmd,
      stdout: decodeOutput(stdout),
      stderr: decodeOutput(stderr),
      durationMs: Date.now() - startedAt,
      timedOut: false,
    };
  } catch (error) {
    const err = error as { killed?: boolean; signal?: string; code?: unknown; stdout?: Buffer; stderr?: Buffer; message?: string };
    const timedOut = err.killed === true || err.signal === "SIGTERM";
    return {
      ok: false,
      exitCode: typeof err.code === "number" ? err.code : null,
      command: cmd,
      stdout: decodeOutput(err.stdout),
      stderr: decodeOutput(err.stderr),
      durationMs: Date.now() - startedAt,
      timedOut,
      error: timedOut ? `执行超时（${Math.round(Number(shellOpts.timeout) / 1e3)} 秒）已终止` : err.message || String(error),
    };
  }
}

function normalizeTimeout(input: unknown): number {
  const n = Number(input);
  if (!Number.isFinite(n) || n <= 0) return COMMAND_TIMEOUT_DEFAULT_MS;
  return Math.min(Math.round(n), COMMAND_TIMEOUT_MAX_MS);
}

/** 命令输出解码：UTF-8 严格模式失败时回落 GBK（Windows 中文环境常见）。 */
function decodeOutput(value: Buffer | string | undefined | null): string {
  if (value === void 0 || value === null) return "";
  if (typeof value === "string") return value;
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(value);
  } catch {
    try {
      return new TextDecoder("gbk").decode(value);
    } catch {
      return value.toString("utf8");
    }
  }
}

const COMMAND_OUTPUT_LIMIT = 1600;

function truncateOutput(text: string, limit = COMMAND_OUTPUT_LIMIT): { text: string; truncated: boolean } {
  const clean = (text ?? "").replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trimEnd();
  if (clean.length <= limit) return { text: clean, truncated: false };
  return { text: `${clean.slice(0, limit)}\n…（输出已截断，共 ${clean.length} 字）`, truncated: true };
}

/** 把命令执行结果格式化为可直接播报的文本（resultMode=raw 用）。 */
export function formatCommandResult(result: CommandRunResult, limit = COMMAND_OUTPUT_LIMIT): string {
  const head = result.ok ? "✅ 定时任务执行成功" : "❌ 定时任务执行失败";
  const meta = `${result.command} · ${Math.round(result.durationMs / 100) / 10}s${result.exitCode !== null ? ` · exit ${result.exitCode}` : ""}`;
  const body = result.ok
    ? result.stdout.trim() || (result.stderr.trim() ? `（无标准输出）stderr：\n${result.stderr.trim()}` : "（无输出）")
    : [result.error, result.stderr.trim(), result.stdout.trim()].filter(Boolean).join("\n") ||
      "（无错误输出，可检查脚本文件是否存在/解释器是否安装）";
  const { text } = truncateOutput(body, limit);
  return `${head}\n${meta}\n\n${text}`;
}

/** 生成「命令输出 → AI 播报」的整理用 prompt（resultMode=ai 用）。 */
export function composeParsePrompt(entryTitle: string, result: CommandRunResult, limit = 4e3): string {
  const body = result.ok
    ? result.stdout.trim() || "（命令执行成功，但没有任何输出）"
    : [result.error, result.stderr.trim(), result.stdout.trim()].filter(Boolean).join("\n");
  const { text } = truncateOutput(body, limit);
  return [
    `以下是定时任务「${entryTitle}」所执行命令的输出结果。`,
    "请阅读并将其整理成一段简洁、可直接发送给用户的播报（保留关键数据与结论，去掉噪音与重复）。",
    "要求：只输出播报正文，不要解释你的分析过程，不要使用 Markdown 标题。",
    result.ok ? "" : "注意：该命令执行失败，请在播报中明确说明失败原因。",
    "",
    "命令：",
    result.command,
    "",
    "输出：",
    text,
  ].filter((line) => line !== "").join("\n");
}
