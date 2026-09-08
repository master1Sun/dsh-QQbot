// 临时脚本：强制渲染「添加机器人」页（扫码 / 手动填写两个 Tab）生成静态预览 HTML。
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const tmp = path.join(root, ".verify-tmp");
const requireV = createRequire(tmp + "/");

const React = requireV("react");
const jsxRuntime = requireV("react/jsx-runtime");
const { renderToStaticMarkup } = requireV("react-dom/server");

const injected = [];
const registered = [];
const documentMock = { head: { append() {}, remove() {} }, querySelector: () => null, createElement: () => ({ dataset: {}, set textContent(_v) {}, remove() {} }) };
const ctxMock = {
  effect: (fn) => { const d = fn(); return typeof d === "function" ? d : () => {}; },
  slots: {
    inject: (slot, cb) => injected.push({ slot, cb }),
    register: (spec, component) => { registered.push({ spec, component }); return () => {}; },
  },
  connection: { rpc: { call: async () => ({ ok: true, data: {} }) } },
};
const requireMock = (id) => {
  if (id === "react") return React;
  if (id === "react/jsx-runtime") return jsxRuntime;
  return {};
};

const sandbox = {
  window: { __ModuleLoader__: { load: ({ factory }) => { sandbox.__factory = factory; } } },
  document: documentMock,
  require: requireMock,
  console,
  setTimeout, clearTimeout, setInterval, clearInterval,
};
vm.createContext(sandbox);
vm.runInContext(readFileSync(path.join(root, "lib", "client.js"), "utf8"), sandbox, { filename: "client.js" });
const mod = sandbox.__factory(requireMock);
mod.apply(ctxMock);
injected.find((x) => x.slot === "settings.section").cb();
const component = registered[0].component;

const origUseState = React.useState;
function renderWith(page, tab) {
  React.useState = (init) => {
    if (init === "list") return [page, () => {}];
    if (init === "qr") return [tab, () => {}];
    return origUseState(init);
  };
  try {
    return renderToStaticMarkup(React.createElement(component, { rpcCall: async () => ({ ok: true, data: {} }) }));
  } finally {
    React.useState = origUseState;
  }
}

const qrHtml = renderWith("add", "qr");
const manualHtml = renderWith("add", "manual");

const src = readFileSync(path.join(root, "src", "client", "index.tsx"), "utf8");
const css = src.slice(src.indexOf("const CSS_TEXT = `") + "const CSS_TEXT = `".length, src.lastIndexOf("`;"));

const page = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">
<title>DSH-QQBot 添加机器人 · 预览</title>
<style>
  body { margin: 0; padding: 32px; background: #f5f6f8; font-family: -apple-system, "PingFang SC", "Microsoft YaHei", system-ui, sans-serif; }
  /* 模拟 DSH 设置面板的实际宽度（左右分栏后内容区并不宽） */
  .stage { max-width: 520px; margin: 0 auto; }
  .stage-note { margin: 0 0 14px; color: #8f959e; font-size: 12px; }
  .stage + .stage { margin-top: 40px; }
</style>
<style>${css}</style></head>
<body>
<div class="stage"><p class="stage-note">扫码接入（未生成二维码状态）</p>${qrHtml}</div>
<div class="stage"><p class="stage-note">手动填写</p>${manualHtml}</div>
</body></html>`;
writeFileSync(path.join(root, "qqbot-add-preview.html"), page, "utf8");
console.log("preview written, qr len =", qrHtml.length, "manual len =", manualHtml.length);
