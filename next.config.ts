import type { NextConfig } from "next";

// 两种构建产物：
// 1) 默认（SSR + Docker）：output: "standalone"，支持后台实时改配置（/api/admin/config）
// 2) BUILD_STATIC=1（纯静态前端）：output: "export"，产出 out/，可直接丢到任意静态托管
const isStatic = process.env.BUILD_STATIC === "1";

const nextConfig: NextConfig = {
  output: isStatic ? "export" : "standalone",
  // 静态导出无法使用 Next 图片优化服务，需关闭（图片走原图）
  images: {
    unoptimized: isStatic,
  },
  // 允许从环境变量读取端口（Docker 中使用）
  env: {
    PORT: process.env.PORT || "3000",
  },
};

export default nextConfig;
