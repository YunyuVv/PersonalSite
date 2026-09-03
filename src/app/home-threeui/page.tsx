"use client";

import "@designcodeio/threeui/style.css";
import dynamic from "next/dynamic";

/**
 * /home-threeui —— 官方「直接 import 包组件」方案
 *
 * 直接 `import { SylvaHero } from "@designcodeio/threeui"`（子路径按需分包，
 * ssr:false 避免 WebGL/iframe 的 SSR 问题），并传入 PageTypographyProps
 * 控制排版：headingFont/bodyFont/headingWeight/bodyWeight/headingSize/bodySize/
 * headingLetterSpacing。排版经 postMessage 注入同源 iframe 的 <head>，
 * 因此仍需 public/landing-pages/inner-green-3d.html 这个资产。
 *
 * 注意：v1.2.0 的 SylvaHero 没有 `variant` 字段（你贴的 skill 里
 * variant="living-green" 属于另一个版本），也没有 name/title 文本 prop——
 * headline 文案仍刻在 HTML 里，已通过 scripts/customize-sylva.py 改成 YunYu 内容。
 * primaryColor 不传，保留 Sylva 原版明亮绿色调。
 *
 * 若该版本不满意，可回退到 /home-threeui-back（threeui-client 包装层方案）。
 */
const SylvaHero = dynamic(
  () =>
    import("@designcodeio/threeui/components/SylvaHero").then((m) => m.SylvaHero),
  { ssr: false },
);

export default function HomeThreeUIPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden">
      <SylvaHero
        className="absolute inset-0 h-full w-full"
        headingFont="lexend"
        bodyFont="lexend"
        headingWeight="300"
        bodyWeight="300"
        headingSize={63}
        bodySize={16.5}
        headingLetterSpacing={-0.006}
      />
    </main>
  );
}
