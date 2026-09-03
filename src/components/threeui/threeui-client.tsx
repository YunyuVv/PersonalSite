"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useTheme } from "@/components/theme-provider";

/**
 * ThreeUI 组件统一包装层。
 *
 * 职责：
 * 1. 仅在客户端挂载后才渲染（配合 dynamic ssr:false，避免服务端触碰 WebGL/window）
 * 2. 尊重系统「减少动态效果」偏好（useReducedMotion 为 true 时降级为静态 fallback）
 * 3. 统一 aria-hidden，装饰性画布不进入无障碍树
 */
export function ThreeUIClient({
  children,
  fallback = null,
  className = "",
}: {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || reduced) {
    return (
      <div className={className} aria-hidden="true">
        {fallback}
      </div>
    );
  }
  return <div className={className}>{children}</div>;
}

/**
 * 根据站点主题返回 ThreeUI 组件适用的明暗模式。
 * 未挂载前默认 "dark"，避免首帧闪烁。
 */
export function useThreeUIMode(): "light" | "dark" {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return "dark";
  return resolvedTheme === "dark" ? "dark" : "light";
}

/* ────────────────────────────────────────────────────────────
 * 动态引入的 ThreeUI 组件（ssr:false，子路径按需分包）。
 *
 * 落地页类（SylvaHero）：通过 iframe 加载打包 HTML，路径为
 *   /landing-pages/inner-green-3d.html，需复制到 public/landing-pages/。
 *   已把 HTML 内 Sylva 默认文案替换为个人内容，保留全部交互与动效。
 *
 * 场景类（SylvaLivingWorldScene）：纯 Three.js 场景，无模板 UI，
 *   props 仅 variant/className/style，作全屏背景层（无需复制打包 HTML）。
 *
 * 着色器效果类（ConstellationField/NeonTypography 等）：props 仅含
 *   mode/hue/saturation/brightness/className/style，不接收 text/children，
 *   渲染自身内置视觉。
 *
 * 文字/按钮类（SemanticBloom/LiquidMetalButton/LumenCta）：接受自定义
 *   text/label 与受控 onClick，可用于 hero 文案与 CTA（无硬编码外链）。
 * ──────────────────────────────────────────────────────────── */
export const SylvaHero = dynamic(
  () => import("@designcodeio/threeui/components/SylvaHero").then((m) => m.SylvaHero),
  { ssr: false },
);
export const SylvaLivingWorldScene = dynamic(
  () => import("@designcodeio/threeui/components/SylvaLivingWorldScene").then((m) => m.SylvaLivingWorldScene),
  { ssr: false },
);
export const ConstellationField = dynamic(
  () => import("@designcodeio/threeui/components/ConstellationField").then((m) => m.ConstellationField),
  { ssr: false },
);
export const NeonTypography = dynamic(
  () => import("@designcodeio/threeui/components/NeonTypography").then((m) => m.NeonTypography),
  { ssr: false },
);
export const ParticleWordmark = dynamic(
  () => import("@designcodeio/threeui/components/ParticleWordmark").then((m) => m.ParticleWordmark),
  { ssr: false },
);
export const GradientCta = dynamic(
  () => import("@designcodeio/threeui/components/GradientCta").then((m) => m.GradientCta),
  { ssr: false },
);
export const GlassmorphismCta = dynamic(
  () => import("@designcodeio/threeui/components/GlassmorphismCta").then((m) => m.GlassmorphismCta),
  { ssr: false },
);
export const LiquidMetalButton = dynamic(
  () => import("@designcodeio/threeui/components/LiquidMetalButton").then((m) => m.LiquidMetalButton),
  { ssr: false },
);
export const GradientBeamCta = dynamic(
  () => import("@designcodeio/threeui/components/GradientBeamCta").then((m) => m.GradientBeamCta),
  { ssr: false },
);
export const LumenCta = dynamic(
  () => import("@designcodeio/threeui/components/LumenCta").then((m) => m.LumenCta),
  { ssr: false },
);
export const GradientPillButton = dynamic(
  () => import("@designcodeio/threeui/components/GradientPillButton").then((m) => m.GradientPillButton),
  { ssr: false },
);
export const SpinningBorderButton = dynamic(
  () => import("@designcodeio/threeui/components/SpinningBorderButton").then((m) => m.SpinningBorderButton),
  { ssr: false },
);
/* 文字/按钮类：接受自定义 text/label + 受控 onClick，适合 hero 文案与 CTA */
export const SemanticBloom = dynamic(
  () => import("@designcodeio/threeui/components/SemanticBloom").then((m) => m.SemanticBloom),
  { ssr: false },
);
