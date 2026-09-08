/**
 * dsh-qqbot CLI — 终端扫码登录（TUI 模式）。
 *
 *   dsh-qqbot login   终端打印二维码，扫码后凭据写入 ~/.dsh/qqbot/credentials.json
 *                     并立即被运行中的 dsh 插件热加载
 *   dsh-qqbot show    查看已保存凭据（Secret 打码）
 *   dsh-qqbot logout  删除已保存凭据
 */
import { unlink } from "node:fs/promises";
import { qrConnect } from "@tencent-connect/qqbot-connector";
import { credentialsPath, loadCredentials, pluginDataDir, saveCredentials, type StoredCredentials } from "./host/store-file.js";
import { toShanghaiISO } from "./shared/time.js";

const HELP = [
  "dsh-qqbot — QQ 机器人凭据管理（TUI）",
  "",
  "用法：dsh-qqbot <命令>",
  "  login   终端扫码登录，凭据落盘并热生效",
  "  show    查看已保存凭据（Secret 打码）",
  "  logout  删除已保存凭据",
].join("\n");

function mask(secret: string): string {
  if (secret.length <= 8) return "****";
  return `${secret.slice(0, 4)}****${secret.slice(-4)}`;
}

async function main(): Promise<void> {
  const cmd = process.argv[2] ?? "help";
  switch (cmd) {
    case "login": {
      console.log("请使用手机 QQ 扫描下方二维码完成登录…\n");
      try {
        const [credentials] = await qrConnect();
        if (!credentials?.appId || !credentials?.appSecret) {
          console.error("扫码结果缺少凭据，登录失败。");
          process.exitCode = 1;
          return;
        }
        const stored: StoredCredentials = {
          appId: credentials.appId,
          appSecret: credentials.appSecret,
          ...(credentials.userOpenid ? { userOpenid: credentials.userOpenid } : {}),
          savedAt: toShanghaiISO(),
          source: "qr",
        };
        await saveCredentials(stored);
        console.log(`\n登录成功：AppID ${stored.appId}`);
        console.log(`凭据已写入 ${credentialsPath()}`);
        console.log("运行中的 dsh-qqbot 插件会自动热加载，无需重启。");
      } catch (error) {
        console.error("登录失败:", error instanceof Error ? error.message : error);
        process.exitCode = 1;
      }
      return;
    }
    case "show": {
      const saved = await loadCredentials();
      if (!saved) {
        console.log("尚未保存凭据。执行 dsh-qqbot login 扫码登录。");
        return;
      }
      console.log(`AppID:    ${saved.appId}`);
      console.log(`Secret:   ${mask(saved.appSecret)}`);
      console.log(`来源:     ${saved.source}（${saved.savedAt}）`);
      console.log(`存储位置: ${credentialsPath()}`);
      return;
    }
    case "logout": {
      const { rm } = await import("node:fs/promises");
      await rm(credentialsPath(), { force: true });
      console.log(`已删除 ${credentialsPath()}（插件下次解析凭据时将回退到配置/环境变量）。`);
      console.log(`数据目录：${pluginDataDir()}`);
      return;
    }
    default:
      console.log(HELP);
      void unlink;
      void pluginDataDir;
  }
}

await main();
