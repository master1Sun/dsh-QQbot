// esbuild 构建 dsh-qqbot（默认产出，npm run build）。
// 产物（仅两个文件）：
//   lib/index.js   — Node ESM host 入口；@deepseek-ai/* 运行时由 DSH host 解析，不打包。
//   lib/client.js  — 浏览器入口，DSH 客户端模块格式（window.__ModuleLoader__.load）。
// CLI 与类型声明由独立脚本产出（build:cli / build:types），不进入默认构建，
// 以保证 build 之后 lib/ 下只保留 index.js 与 client.js。
import { build as esbuildBuild } from "esbuild";
import { mkdir, readFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const libDir = join(root, "lib");
const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const PLUGIN_ID = pkg.name;

// 清理尽力而为：WorkBuddy 的 safe-delete 守卫可能拦截递归删除（走回收站失败），
// 但不应阻塞构建——esbuild 会覆盖产物。
try {
  await rm(libDir, { recursive: true, force: true });
} catch { /* 清理失败不影响构建 */ }
await mkdir(libDir, { recursive: true });

// host externals：@deepseek-ai/* 由 host 模块图提供。
// esbuild 的 external 只接受字符串（支持 * 通配符，可跨目录分隔符匹配），不接受 RegExp。
const hostExternal = ["@deepseek-ai/*", "node:*"];

// --- 1) host 入口：lib/index.js（Node ESM）-------------------------------
await esbuildBuild({
  entryPoints: [join(root, "src/host/index.ts")],
  outfile: join(libDir, "index.js"),
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node22",
  charset: "utf8",
  external: [...hostExternal, "@tencent-connect/qqbot-connector", "@tencent-connect/qqbot-nodejs", "qrcode"],
  sourcemap: false,
  logLevel: "info",
});

// --- 2) client 入口：lib/client.js（DSH __ModuleLoader__ 格式，React 桥）---
// react / react/jsx-runtime / @deepseek-ai/* 由 DSH 客户端模块加载器的
// factory `require` 解析，不打入 bundle。
const clientBanner = [
  `window.__ModuleLoader__.load({`,
  `\tid: ${JSON.stringify(PLUGIN_ID)},`,
  `\tfactory: (require) => {`,
  `\t\tvar module = { exports: {} };`,
  `\t\tvar exports = module.exports;`,
].join("\n");
// 必须导出 name —— dsh 0.1.2-rc.1 的客户端模块加载器会读取模块元数据的 name，
// 缺失时会退化成合成的错误 entry（{ code, message, details }），进而触发 React #31。
// dsh-im 正是通过 __toCommonJS 导出 name/apply/inject，这里对齐同样的契约。
const clientFooter = [
  `\t\tmodule.exports = { name, apply, inject };`,
  `\t\treturn module.exports;`,
  `\t}`,
  `});`,
  "",
].join("\n");

await esbuildBuild({
  entryPoints: [join(root, "src/client/index.tsx")],
  outfile: join(libDir, "client.js"),
  bundle: true,
  format: "cjs",
  platform: "browser",
  target: "es2022",
  charset: "utf8",
  jsx: "automatic",
  external: ["react", "react/jsx-runtime", "react-dom", "@deepseek-ai/*"],
  define: { __PLUGIN_VERSION__: JSON.stringify(pkg.version) },
  banner: { js: clientBanner },
  footer: { js: clientFooter },
  sourcemap: false,
  logLevel: "info",
});

console.log(`build 完成：${libDir} 下仅 index.js + client.js`);
