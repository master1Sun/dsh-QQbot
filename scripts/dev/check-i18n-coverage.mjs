import fs from "node:fs";

// scripts/dev/ 距项目根两级（对齐 scripts 目录 root 约定）。
const root = new URL("../../", import.meta.url);
const idx = fs.readFileSync(new URL("src/client/index.tsx", root), "utf8");
const i18n = fs.readFileSync(new URL("src/client/i18n.ts", root), "utf8");

const zh = (s) => /[\u4e00-\u9fff]/.test(s);

// 1) SWITCH_DEFS / SettingRow 的 label
const labels = [...idx.matchAll(/label: "([^"]+)"/g)].map((m) => m[1]).filter(zh);
// 2) SWITCH_DEFS / SettingRow 的 desc
const descs = [...idx.matchAll(/desc: "([^"]+)"/g)].map((m) => m[1]).filter(zh);
// 3) FIELD_HELP 值（缩进四格的键行）
const helps = [...idx.matchAll(/^    "([^"]+)":$/gm)].map((m) => m[1]).filter(zh);
// 4) FIELD_LABELS 值（单行 "key": "值"）
const fieldVals = [...idx.matchAll(/^\s+\w+: "([^"]+)",$/gm)].map((m) => m[1]).filter(zh);
// 5) select 选项文本（h("option", {...}, "文本")）
const options = [...idx.matchAll(/h\("option", \{[^}]*\}, "([^"]+)"\)/g)].map((m) => m[1]).filter(zh);
// 6) placeholder / aria-label
const placeholders = [...idx.matchAll(/placeholder: "([^"]+)"/g)].map((m) => m[1]).filter(zh);
const arias = [...idx.matchAll(/"aria-label": "([^"]+)"/g)].map((m) => m[1]).filter(zh);
// 7) numSelect 等格式化回调里的固定中文（如 "0（不限）"）
const fixed = [...idx.matchAll(/\? "([^"]*[\u4e00-\u9fff][^"]*)" :/g)].map((m) => m[1]);

const all = [...new Set([...labels, ...descs, ...helps, ...fieldVals, ...options, ...placeholders, ...arias, ...fixed])];
const missing = all.filter((s) => !i18n.includes(`"${s}"`));
console.log("待检 UI 串:", all.length, "| 未入字典:", missing.length);
missing.forEach((s) => console.log("  MISS:", s.slice(0, 120)));
process.exitCode = missing.length ? 1 : 0;
