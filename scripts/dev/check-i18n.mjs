/**
 * i18n 覆盖检查（运行时精确判定）：
 * 1) esbuild 把 src/client/i18n.ts 编译为临时 mjs；
 * 2) 设 translator 为「英文环境」：精确字典未命中时走 translateDynamic；
 * 3) 遍历 src/client 各文件的字符串字面量与模板串（${...} 归一为候选占位，
 *    用多个占位值试探），localizeText(候选) !== 原文 → 已覆盖，否则列出。
 * 用法：node scripts/dev/check-i18n.mjs
 */
import { build } from "esbuild";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = join(process.cwd(), "src", "client");
const tmp = join(process.cwd(), "scripts", "dev", ".i18n.tmp.mjs");
await build({
  entryPoints: [join(root, "i18n.ts")],
  bundle: true, format: "esm", platform: "node", outfile: tmp, logLevel: "silent",
});
const mod = await import(pathToFileURL(tmp).href);
// 模拟宿主 locale.bind：先查 EN 字典，未命中原样返回（与 ctx.locale 语义一致）
mod.setTranslator((k) => (k === "$locale" ? "en" : mod.en[k] ?? k));
const { localizeText } = mod;

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.tsx?$/.test(name)) files.push(p);
  }
})(root);

const CJK = /[\u4e00-\u9fff]/;
// 模板占位试探值：数字/小数/日期时间/任意文本 + 常见枚举值（开/关/不限制/时长/接入方式）
const PROBES = ["1", "12", "1.5", "09:30", "abc", "2026-09-10 09:00", "oABCDEF1234567890", "v1.2.3",
  "开", "关", "不限制", "5 分钟", "30 秒", "5 分", "扫码接入", "手动填写"];
const covered = (text) => localizeText(text) !== text;

/** 去掉块注释与行注释，避免把注释里的中文当代文案。 */
const stripComments = (src) => src
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/(^|[^:"'`\w])\/\/[^\n]*/g, "$1");

const missing = new Set();
for (const file of files) {
  if (file.endsWith("i18n.ts")) continue;
  const rel = file.slice(root.length + 1);
  const src = stripComments(readFileSync(file, "utf8"));
  // ① 普通字符串字面量
  for (const m of src.matchAll(/"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/g)) {
    const raw = m[1] ?? m[2];
    if (!raw || !CJK.test(raw)) continue;
    let text;
    try { text = JSON.parse(`"${raw}"`); } catch { text = raw; }
    if (text.includes("${") || text.includes("\n")) continue;
    if (covered(text)) continue;
    missing.add(`${rel} │ ${text}`);
  }
  // ② 模板字面量：${expr} → 逐个占位值试探
  for (const m of src.matchAll(/`([^`]*)`/g)) {
    const raw = m[1];
    if (!CJK.test(raw) || raw.includes("\n") || raw.length > 120) continue;
    if (!/\$\{/.test(raw)) { if (!covered(raw)) missing.add(`${rel} │ [模板] ${raw}`); continue; }
    const norm = raw.replace(/\$\{[^{}]*(\{[^}]*\}[^{}]*)*\}/g, "§"); // 支持 ${a?{..}:{..}}
    if (!CJK.test(norm)) continue;
    let ok = false;
    for (const probe of PROBES) {
      // 每个探针替换全部 §；多 § 时逐位组合（§ 数量少，指数可接受）
      let slots = [];
      const idx = [...norm.matchAll(/§/g)].length;
      if (idx === 0) { if (covered(norm)) { ok = true; break; } continue; }
      const combo = (n) => {
        const out = [];
        const gen = (i, acc) => {
          if (i === n) { out.push(acc); return; }
          for (const p of PROBES) gen(i + 1, [...acc, p]);
        };
        gen(0, []);
        return out;
      };
      for (const c of combo(Math.min(idx, 3))) {
        let i = 0;
        const candidate = norm.replace(/§/g, () => c[i++] ?? "1");
        if (covered(candidate)) { ok = true; break; }
      }
      if (ok) break;
    }
    if (!ok) missing.add(`${rel} │ [模板] ${norm}`);
  }
}
console.log([...missing].sort().join("\n") || "ALL COVERED");
console.log(`\n共 ${missing.size} 条未覆盖`);
