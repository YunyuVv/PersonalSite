// 纯静态导出构建辅助脚本
// 背景：API 路由 /api/admin/config 是 SSR 后台专用，静态导出无法运行服务端逻辑。
// Next 在 output:"export" 下要求路由显式声明 static；但该声明（force-static）
// 会让 SSR 下 POST 鉴权读不到请求头。因此：
//   - 默认构建（SSR/Docker）：路由用 force-dynamic（后台实时鉴权正常）
//   - 静态导出构建：临时把路由改成 force-static 以满足导出要求，构建后恢复原状
import fs from "node:fs";
import { spawnSync } from "node:child_process";

const ROUTE = "src/app/api/admin/config/route.ts";
const DYN_LINE = 'export const dynamic = "force-dynamic";';
const STATIC_LINE = 'export const dynamic = "force-static";';

const original = fs.readFileSync(ROUTE, "utf8");

function restore() {
  const cur = fs.readFileSync(ROUTE, "utf8");
  fs.writeFileSync(ROUTE, cur.replace(STATIC_LINE, DYN_LINE));
}

try {
  // 静态导出期间临时替换动态声明（精确匹配声明行，避免误改注释）
  fs.writeFileSync(ROUTE, original.replace(DYN_LINE, STATIC_LINE));
  const result = spawnSync("npx", ["next", "build"], {
    stdio: "inherit",
    env: { ...process.env, BUILD_STATIC: "1" },
  });
  process.exitCode = result.status ?? 1;
} finally {
  restore();
}
