// 验证构建产物 lib/client.js：
//  1) 模块导出 { name, apply, inject }（对齐 dsh-im / 0.1.2-rc.1 契约）
//  2) apply(ctx) 能执行且不抛错
//  3) ctx.slots.inject("settings.section", cb) 被调用，且 cb() 通过 ctx.slots.register
//     注册了一个【函数】组件（而不是 {code,message,details} 合成错误对象 → React #31）
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { createRequire } from "node:module";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const clientPath = path.join(root, "lib", "client.js");
const profileReact = "C:/Users/sunjuntao/.dsh/profiles/web/node_modules/react";

const requireProfile = createRequire(profileReact + "/");
let React, jsxRuntime;
try {
  React = requireProfile("react");
  jsxRuntime = requireProfile("react/jsx-runtime");
} catch (e) {
  console.error("无法从 profile 加载 react/react-jsr:", e.message);
  process.exit(2);
}

// --- mocks ---
const captured = { id: null, factory: null };
const injected = [];
const registered = [];

const documentMock = {
  head: { append() {}, remove() {} },
  querySelector: () => null,
  createElement() {
    return { dataset: {}, set textContent(_v) {}, remove() {} };
  },
};

const ctxMock = {
  effect: (fn) => {
    const d = fn();
    return typeof d === "function" ? d : () => {};
  },
  slots: {
    inject: (slot, cb) => injected.push({ slot, cb }),
    register: (spec, component) => {
      registered.push({ spec, component });
      return () => {};
    },
  },
  connection: { rpc: { call: async () => ({ ok: true, data: {} }) } },
};

const requireMock = (id) => {
  if (id === "react") return React;
  if (id === "react/jsx-runtime") return jsxRuntime;
  return {};
};

const sandbox = {
  window: { __ModuleLoader__: { load: ({ id, factory }) => { captured.id = id; captured.factory = factory; } } },
  document: documentMock,
  require: requireMock,
  console,
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
};
vm.createContext(sandbox);

const code = readFileSync(clientPath, "utf8");
vm.runInContext(code, sandbox, { filename: "client.js" });

const mod = captured.factory(requireMock);

const fail = (m) => { console.error("FAIL:", m); process.exit(1); };

if (!mod || typeof mod !== "object") fail("module.exports 不是对象");
if (mod.name !== "qqbot-settings") fail(`name 导出错误: ${JSON.stringify(mod.name)}`);
if (typeof mod.apply !== "function") fail("apply 不是函数");
if (!Array.isArray(mod.inject)) fail("inject 不是数组");

console.log("OK  module export:", { name: mod.name, inject: mod.inject, apply: typeof mod.apply });

try {
  mod.apply(ctxMock);
} catch (e) {
  fail(`apply(ctx) 抛错: ${e.stack || e.message}`);
}

if (injected.length !== 1) fail(`slots.inject 被调用 ${injected.length} 次（期望 1）`);
if (injected[0].slot !== "settings.section") fail(`inject 的 slot 不是 settings.section: ${injected[0].slot}`);

const disposer = injected[0].cb();
if (typeof disposer !== "function") fail("inject 回调返回值不是 disposer 函数");

if (registered.length !== 1) fail(`slots.register 被调用 ${registered.length} 次（期望 1）`);
const { spec, component } = registered[0];
if (typeof component !== "function") {
  fail(`注册的组件不是函数，而是: ${JSON.stringify(Object.keys(component || {}))} —— 这正是 React #31 的成因`);
}
if (spec?.name !== "settings.section") fail(`register spec.name 错误: ${spec?.name}`);
if (spec?.id !== "dsh-qqbot") fail(`register spec.id 错误: ${spec?.id}`);

console.log("OK  settings.section 注册:", {
  specName: spec.name,
  specId: spec.id,
  component: typeof component,
  componentName: component.name,
});
console.log("\nALL CHECKS PASSED — 模块契约正确，组件为函数（#31 根因已排除）。");
