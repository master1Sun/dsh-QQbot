/**
 * AI 脚本生成器（tool 模式的 genPrompt 流程）：把用户的「AI 脚本描述词」交给
 * 宿主 LLM 生成可执行脚本，落盘到插件数据目录 scripts/ 下，并把执行命令回填
 * 到定时任务条目（command 字段），之后按计划照常调度执行。
 *
 * 生成状态机（entry.genStatus）：pending（生成中）→ done / error。
 * 生成中/失败的任务不会被调度器执行（dueEntries 过滤），避免跑旧命令或空转。
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createUserMessage } from "@deepseek-ai/dsh-llm";
import type { ScheduleEntry, ScheduleStore } from "./schedule.js";
import { nextRunFor } from "./schedule.js";
import { scriptCommandFor } from "./command-runner.js";
import { pluginDataDir } from "../infra/store-file.js";
import { toShanghaiISO, toShanghaiISOOrNull } from "../../shared/time.js";

/** 从模型输出解析脚本：首行 `### FILE: <文件名>`（可选）+ 代码体（可带围栏）。 */
function parseScriptOutput(raw: string): { filename: string; code: string } | null {
  let text = raw.replace(/\r\n/g, "\n").trim();
  if (!text) return null;
  let filename = "";
  const m = /^\s*#{0,4}\s*FILE\s*:\s*(\S+)\s*\n/i.exec(text);
  if (m) {
    filename = m[1].trim();
    text = text.slice(m[0].length);
  }
  const fence = /^```[^\n]*\n([\s\S]*?)\n?```$/.exec(text.trim());
  if (fence) text = fence[1];
  text = text.trim();
  if (!text) return null;
  if (!filename) {
    // 按语言特征猜测扩展名（模型没写 FILE 行时兜底）。
    if (/<\?php/.test(text)) filename = "script.php";
    else if (/use\s+(strict|warnings)|^\s*my\s+\$\w+|#!\s*\/usr\/bin\/perl/m.test(text)) filename = "script.pl";
    else if (/\bWScript\.Echo\b|\bMsgBox\b|\bWshShell\b|\bCreateObject\(/i.test(text) || /^\s*(Dim|Set)\s+\w+\s*=/im.test(text)) filename = "script.vbs";
    else if (/^\s*require\s+['"]|^\s*puts\s/m.test(text)) filename = "script.rb";
    else if (/\bdef\s+\w+\s*\(|^\s*(import|from)\s+\w+/m.test(text)) filename = "script.py";
    else if (/(^|\n)\s*\$\w+|param\s*\(|Write-Host/.test(text)) filename = "script.ps1";
    else if (/@echo off/i.test(text)) filename = "script.bat";
    else if (/console\.(log|info|error)|require\(|process\.(argv|env|stdout)/.test(text)) filename = "script.mjs";
    else filename = "script.py";
  }
  return { filename: filename.replace(/[^\w.-]/g, "_"), code: text + "\n" };
}

/** 按扩展名决定脚本文件编码：.ps1→UTF-8 BOM（PS5.1 无 BOM 按 ANSI 解码必乱码）、.vbs/.wsf→UTF-16LE BOM（cscript 唯一稳定 Unicode 格式）、其余 UTF-8。 */
function scriptFileBuffer(filename: string, code: string): Buffer {
  const ext = (/\.\w+$/.exec(filename)?.[0] ?? "").toLowerCase();
  if (ext === ".ps1") return Buffer.from(`\uFEFF${code}`, "utf8");
  if (ext === ".vbs" || ext === ".wsf") return Buffer.from(`\uFEFF${code}`, "utf16le");
  return Buffer.from(code, "utf8");
}

const SYSTEM_PROMPT = [
  "你是运行在 Windows 上的定时任务脚本生成器。根据用户的描述写一个可直接执行的脚本来完成该任务。",
  "输出格式（严格遵守）：",
  "第一行必须是 `### FILE: <文件名>`。按任务选择最合适的语言与扩展名：Python 用 .py、PowerShell 用 .ps1、批处理用 .bat、Node 用 .mjs、",
  "VBS（Windows Script Host）用 .vbs、WSF 用 .wsf、Perl 用 .pl、PHP 用 .php、Ruby 用 .rb、Lua 用 .lua、Shell 用 .sh。",
  "之后只输出脚本代码本身，不要 markdown 代码围栏，不要解释，不要执行示例。",
  "脚本要求：输出用 print / Write-Host / echo / WScript.Echo 等产出人类可读的结果文本（该输出会被推送给用户）；",
  "VBS 必须用 WScript.Echo 输出（以 cscript //Nologo 运行），严禁使用 MsgBox / Popup（会弹窗阻塞定时任务）；",
  "任何语言都不交互、不等待输入（禁止 input / Read-Host / pause）；网络请求设置合理超时并处理失败；",
  "失败时以非零退出码结束并输出错误说明；中文输出。",
].join("\n");

/** 宿主 LLM 流式服务的最小接口（避免直接依赖宿主类型）。 */
export interface ScriptGenLlm {
  stream(request: {
    provider: string;
    model: string;
    system: string;
    messages: unknown[];
    temperature?: number;
  }): AsyncIterable<{ type: string; text?: string }>;
}

export interface ScriptGeneratorDeps {
  store: ScheduleStore;
  /** 按机器人 appId 解析当前选择的模型（设置页配置）。 */
  resolveModel: (appId?: string) => { provider: string; model: string } | undefined;
  /** 取宿主 LLM 服务（可能未就绪）。 */
  getLlm: () => ScriptGenLlm | undefined;
  logger: Pick<Console, "info" | "warn" | "error">;
}

export interface ScriptGenerator {
  /** 有新 pending 任务时入队生成（去重：同一任务同时只跑一次）。 */
  enqueue(entry: ScheduleEntry): void;
  /** 启动时扫描全部任务，把遗留的 pending 重新入队。 */
  flushPending(): void;
}

export function createScriptGenerator(deps: ScriptGeneratorDeps): ScriptGenerator {
  const { store, resolveModel, getLlm, logger } = deps;
  const inflight = new Set<string>();
  const markFailed = async (entry: ScheduleEntry, message: string): Promise<void> => {
    entry.genStatus = "error";
    entry.genError = message;
    entry.lastError = `脚本生成失败：${message}`;
    await store.save();
    logger.error(`[dsh-qqbot] 定时任务 ${entry.id} AI 脚本生成失败: ${message}`);
  };
  const run = async (entry: ScheduleEntry): Promise<void> => {
    try {
      const llm = getLlm();
      if (!llm || typeof llm.stream !== "function") {
        await markFailed(entry, "宿主 LLM 服务不可用");
        return;
      }
      const sel = resolveModel(entry.appId);
      if (!sel || !sel.provider || !sel.model) {
        await markFailed(entry, "机器人未配置模型，请先在设置页选择模型后重新保存该任务");
        return;
      }
      entry.genStartedAt = toShanghaiISO();
      await store.save();
      const stream = llm.stream({
        provider: sel.provider,
        model: sel.model,
        system: SYSTEM_PROMPT,
        messages: [
          createUserMessage({
            content: [{ type: "text", text: `定时任务描述：\n${entry.genPrompt ?? ""}` }],
            source: { kind: "user" },
          }),
        ],
        temperature: 0.2,
      });
      let out = "";
      for await (const chunk of stream) {
        if (chunk.type === "text-delta") out += chunk.text ?? "";
      }
      const parsed = parseScriptOutput(out);
      if (!parsed) {
        await markFailed(entry, "模型未返回有效脚本内容");
        return;
      }
      const dir = join(pluginDataDir(), "scripts");
      await mkdir(dir, { recursive: true });
      const absPath = join(dir, `${entry.id}-${parsed.filename}`);
      await writeFile(absPath, scriptFileBuffer(parsed.filename, parsed.code));
      const command = scriptCommandFor(absPath);
      if (!command) {
        await markFailed(entry, `不支持的脚本类型：${parsed.filename}`);
        return;
      }
      entry.command = command;
      entry.genStatus = "done";
      entry.genDoneAt = toShanghaiISO();
      entry.genError = void 0;
      entry.lastError = void 0;
      const now = new Date();
      if (entry.type === "at") {
        // 一次性任务：生成期间触发时刻已过则直接删除，不再补跑。
        const atMs = entry.at ? new Date(entry.at).getTime() : 0;
        if (atMs && atMs <= now.getTime()) {
          await store.removeById(entry.id);
          logger.info(`[dsh-qqbot] 定时任务 ${entry.id} 脚本已生成，但一次性触发时刻已过，任务已删除`);
          return;
        }
      } else if (!entry.nextRunAt || new Date(entry.nextRunAt).getTime() <= now.getTime()) {
        entry.nextRunAt = toShanghaiISOOrNull(nextRunFor(entry, now));
      }
      await store.save();
      logger.info(`[dsh-qqbot] 定时任务 ${entry.id} AI 脚本已生成 → ${absPath}；命令已回填，按计划继续执行`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await markFailed(entry, message);
    }
  };
  const enqueue = (entry: ScheduleEntry): void => {
    if (entry.genStatus !== "pending" || !entry.genPrompt) return;
    if (inflight.has(entry.id)) return;
    inflight.add(entry.id);
    void run(entry).finally(() => inflight.delete(entry.id));
  };
  return {
    enqueue,
    flushPending: () => {
      for (const e of store.list()) enqueue(e);
    },
  };
}
