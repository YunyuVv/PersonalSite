"use client";

import "@designcodeio/threeui/style.css";
import { ThreeUIClient, SylvaHero } from "@/components/threeui/threeui-client";

/**
 * /home-threeui-back —— 当前实现的「备份」页
 *
 * 用 ThreeUI Sylva 完整落地页作 hero，经 threeui-client 包装层（dynamic ssr:false
 * + mounted/reduced-motion 守卫）引入。
 * iframe 内文案已通过 scripts/customize-sylva.py 替换为 YunYu 个人内容，
 * 保留鼠标悬停树枝、视差、卡片、按钮等全部原生动效与明亮色调。
 *
 * 这是 v4「定制 HTML 文本」方案的最终可用版本，保留以防包导入方案不满意时回退。
 */
export default function HomeThreeUIBackPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden">
      <ThreeUIClient
        className="absolute inset-0"
        fallback={<div className="h-full w-full bg-[#4a4d44]" />}
      >
        <SylvaHero className="h-full w-full" />
      </ThreeUIClient>
    </main>
  );
}
