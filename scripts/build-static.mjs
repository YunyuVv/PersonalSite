// 纯静态导出构建辅助脚本
// 背景：本站默认以 SSR（standalone / Docker）运行，后台改配置后即时生效，
// 因此全站声明了 force-dynamic。但 Next 的 output:"export" 不支持 force-dynamic，
// 静态导出要求这些段显式声明 static。
//
// 矛盾点：
//   - 若常驻 force-static，SSR 下 POST 鉴权读不到请求头（authorization 为 null），后台失效；
//   - 若常驻 force-dynamic，output:"export" 直接构建失败。
//
// 方案：静态导出构建期间，把这批文件的 force-dynamic 临时替换为 force-static，
// 构建结束后无条件恢复原状。故两处声明必须保持完全一致的写法：
//   export const dynamic = "force-dynamic";
import fs from "node:fs";
import { spawnSync } from "node:child_process";

// 需要在静态导出期间临时切换为 force-static 的文件
const TARGETS = [
  "src/app/api/admin/config/route.ts", // SSR 后台专用路由，静态导出无法运行服务端逻辑
  "src/app/layout.tsx", // 全站动态渲染声明（会被所有子路由继承）
  "src/app/page.tsx", // 首页动态渲染声明
];

const DYN_LINE = 'export const dynamic = "force-dynamic";';
const STATIC_LINE = 'export const dynamic = "force-static";';

const originals = new Map();
for (const file of TARGETS) {
  originals.set(file, fs.readFileSync(file, "utf8"));
}

function restore() {
  for (const file of TARGETS) {
    const cur = fs.readFileSync(file, "utf8");
    // 精确匹配声明行，避免误改注释里的同名字样
    fs.writeFileSync(file, cur.replace(STATIC_LINE, DYN_LINE));
  }
}

try {
  for (const file of TARGETS) {
    const src = originals.get(file);
    if (!src.includes(DYN_LINE)) {
      console.warn(`[build-static] 跳过 ${file}：未找到 ${DYN_LINE}`);
      continue;
    }
    fs.writeFileSync(file, src.replace(DYN_LINE, STATIC_LINE));
  }

  const result = spawnSync("npx", ["next", "build"], {
    stdio: "inherit",
    env: { ...process.env, BUILD_STATIC: "1" },
  });
  process.exitCode = result.status ?? 1;
} finally {
  restore();
  console.log("[build-static] 已恢复 force-dynamic 声明");
}
