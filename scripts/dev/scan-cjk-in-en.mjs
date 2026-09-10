// 临时脚本：扫描 i18n 文件中英文译文值里残留的中文字符（扫完即删）
import { readFileSync } from "node:fs";

const files = process.argv.slice(2);
const CJK = /[\u4e00-\u9fff\u3000-\u303f\uff01-\uff5e]/; // 汉字 + 中文标点/全角

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const hits = [];

  // 1) 静态键值对："key": "value"（允许跨行）。值含 CJK 即命中。
  const pairRe = /"((?:[^"\\]|\\.)*)"\s*:\s*(?:\n\s*)?"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = pairRe.exec(src))) {
    if (CJK.test(m[2])) hits.push({ kind: "pair", line: src.slice(0, m.index).split("\n").length, key: m[1], value: m[2] });
  }

  // 2) 动态模板串：return `...`（含 ${}）。反引号内容含 CJK 即命中。
  const tmplRe = /return\s+`((?:[^`\\]|\\.)*)`/g;
  while ((m = tmplRe.exec(src))) {
    const body = m[1].replace(/\$\{[^}]*\}/g, "");
    if (CJK.test(body)) hits.push({ kind: "tmpl", line: src.slice(0, m.index).split("\n").length, value: m[1] });
  }

  console.log(`\n=== ${file} : ${hits.length} 处命中 ===`);
  for (const h of hits) console.log(`L${h.line} [${h.kind}] ${h.key ? JSON.stringify(h.key) + " => " : ""}${JSON.stringify(h.value)}`);
}
