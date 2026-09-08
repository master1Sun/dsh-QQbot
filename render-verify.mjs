// 真实服务端渲染验证：把注册到的 QqbotSettingsTab 用 react-dom/server 渲染一次，
// 若组件里存在“把对象当组件渲染”（React #31），renderToStaticMarkup 会直接抛错。
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
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
const injected0 = injected.find((x) => x.slot === "settings.section");
if (!injected0) { console.error("FAIL: 未注入 settings.section"); process.exit(1); }
injected0.cb();
const component = registered[0]?.component;
if (typeof component !== "function") { console.error("FAIL: 注册的组件不是函数"); process.exit(1); }

try {
  const html = renderToStaticMarkup(React.createElement(component, { rpcCall: async () => ({ ok: true, data: {} }) }));
  if (typeof html !== "string" || html.length === 0) { console.error("FAIL: 渲染结果为空"); process.exit(1); }
  console.log("OK  组件初始渲染成功，HTML 长度 =", html.length);
  console.log("OK  片段预览:", html.slice(0, 200).replace(/\s+/g, " "));
  console.log("\nRENDER CHECK PASSED — 初始渲染无 React #31（无非法元素类型）。");
} catch (e) {
  console.error("FAIL: 渲染抛错（很可能即 React #31）:\n", e.stack || e.message);
  process.exit(1);
}
