// 独立 CLI 构建（npm run build:cli）：lib/cli.js
// 打包官方 @tencent-connect SDK，可脱离 profile 直接以 `node bin/dsh-qqbot.mjs` 运行。
// 不进入默认 build，以保证 build 之后 lib/ 下只保留 index.js 与 client.js。
import { build as esbuildBuild } from "esbuild";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const libDir = join(root, "lib");

await mkdir(libDir, { recursive: true });

await esbuildBuild({
  entryPoints: [join(root, "src/cli.ts")],
  outfile: join(libDir, "cli.js"),
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node22",
  external: ["node:*"],
  banner: { js: "#!/usr/bin/env node" },
  sourcemap: false,
  logLevel: "info",
});

console.log("build:cli 完成 -> lib/cli.js");
