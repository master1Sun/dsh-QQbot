// QQ OpenAPI 鉴权诊断工具：直接用 ~/.dsh/qqbot/credentials.json 的凭据调 QQ 接口，
// 依次尝试 QQBot/QQ 前缀与 api.sgroup.qq.com/api.bot.qq.com 组合，首个成功即停。
// 不打印 secret，只打印状态与错误体。用法：node scripts/diag-qq-api.mjs [openid]
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const dshHome = process.env.DSH_HOME || join(homedir(), ".dsh");
const cred = JSON.parse(await readFile(join(dshHome, "qqbot", "credentials.json"), "utf8"));
const openid = process.argv[2] ?? "qq_ec817f15410d4c4bfec543e6";
console.log("[cred] appId =", cred.appId, "| source =", cred.source, "| savedAt =", cred.savedAt);

const tokenRes = await fetch("https://bots.qq.com/app/getAppAccessToken", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ appId: cred.appId, clientSecret: cred.appSecret }),
});
const tokenText = await tokenRes.text();
let tokenBody;
try { tokenBody = JSON.parse(tokenText); } catch { tokenBody = null; }
console.log("[token] HTTP", tokenRes.status, "| expires_in =", tokenBody?.expires_in, "| has access_token =", Boolean(tokenBody?.access_token));
if (!tokenBody?.access_token) {
  console.log("[token] body:", tokenText.slice(0, 400));
  process.exit(1);
}
const token = tokenBody.access_token;

async function attempt(label, base, prefix) {
  try {
    const res = await fetch(`${base}/v2/users/${openid}/messages`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `${prefix} ${token}` },
      body: JSON.stringify({ content: "dsh-qqbot 鉴权诊断测试", msg_type: 0 }),
    });
    const text = await res.text();
    const ok = res.ok || res.status === 204;
    console.log(`[${label}] HTTP ${res.status}${ok ? " ✅" : ""}`, ok ? "" : text.slice(0, 300));
    return ok;
  } catch (error) {
    console.log(`[${label}] network error:`, error?.message ?? error);
    return false;
  }
}

const combos = [
  ["QQBot + api.sgroup.qq.com", "https://api.sgroup.qq.com", "QQBot"],
  ["QQBot + api.bot.qq.com", "https://api.bot.qq.com", "QQBot"],
  ["QQ + api.sgroup.qq.com", "https://api.sgroup.qq.com", "QQ"],
];
for (const [label, base, prefix] of combos) {
  if (await attempt(label, base, prefix)) {
    console.log("[result] 成功组合 →", label);
    break;
  }
}
