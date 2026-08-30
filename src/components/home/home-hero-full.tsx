"use client";

import Link from "next/link";
import { ArrowRight, Mail, Sparkles, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";
import profile from "@/data/profile";
import { SocialLinks } from "@/components/ui/social-links";
import { ShimmerButton } from "@/components/magic-ui/shimmer-button";
import { LightRays } from "@/components/reactbits/light-rays";
import { ElectricBorder } from "@/components/reactbits/electric-border";
import { SplitText } from "@/components/reactbits/split-text";
import { DecryptedText } from "@/components/reactbits/decrypted-text";
import { ShinyText } from "@/components/reactbits/shiny-text";
import { ClickSpark } from "@/components/reactbits/click-spark";

/* ─── Stagger delay helper ─── */
const d = (i: number) => ({ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] as const });

export function HomeHeroFull() {
  const p = profile;
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <section className="relative h-screen min-h-[700px] flex flex-col overflow-hidden bg-[var(--bg-primary)]">
      <ClickSpark sparkCount={8} sparkRadius={20} sparkSize={12} duration={400}>
      {/* ── LightRays 全屏背景 ── */}
      <div className="absolute inset-0 opacity-60 dark:opacity-90" aria-hidden="true">
        <LightRays
          raysOrigin="top-center"
          raysColor={isDark ? "#ffffff" : "#5b8def"}
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          fadeDistance={1}
          saturation={1}
          followMouse
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
        />
      </div>

      {/* ── 底部渐变 ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[var(--bg-primary)] to-transparent z-[1]"
        aria-hidden="true"
      />

      {/* ── 主内容：左右分栏 ── */}
      <div className="relative z-10 flex-1 flex items-start pt-[15vh] lg:pt-[18vh] px-6 sm:px-10 lg:px-16 xl:px-24">
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12 items-center">
          {/* ─ 左侧：文字区 ─ */}
          <div className="max-w-xl">
            {/* 名字 — SplitText 逐字母入场 */}
            <div className="mt-6">
              <SplitText
                text={p.name}
                tag="h1"
                className="text-[clamp(3.5rem,8vw,7rem)] leading-[0.9] font-bold tracking-tight text-[var(--text-primary)]"
                delay={0.05}
                duration={0.5}
              />
            </div>

            {/* 角色 — ShinyText 微光扫过 */}
            <div className="mt-5">
              <ShinyText
                text={p.role}
                className="text-xl sm:text-2xl font-medium"
                color="var(--text-primary)"
                shineColor="var(--accent-light)"
                speed={3}
              />
            </div>

            {/* 标语 — DecryptedText 解密效果 */}
            <p className="mt-3 text-base sm:text-lg text-[var(--text-secondary)]">
              <DecryptedText
                text={p.tagline}
                speed={60}
                sequential
                revealDirection="start"
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
                animateOn="view"
                className="text-[var(--text-secondary)]"
                encryptedClassName="text-[var(--accent)]/60"
              />
            </p>

            {/* 按钮 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={d(4)}
              className="mt-10 flex flex-wrap gap-3"
            >
              <ShimmerButton asChild>
                <Link href="/resume" className="gap-2">
                  查看简历 <ArrowRight size={16} />
                </Link>
              </ShimmerButton>
              <Link href="/creative" className="hm-btn-ghost">
                <Sparkles size={16} />
                互动版
              </Link>
              <a href="#contact" className="hm-btn-ghost">
                <Mail size={16} />
                联系我
              </a>
            </motion.div>

            {/* 社交链接 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-8 inline-block"
            >
              <ElectricBorder
                color={isDark ? "#5b8def" : "#3b5ccc"}
                speed={0.8}
                chaos={0.08}
                borderRadius={999}
                className="px-2 py-1"
              >
                <SocialLinks iconSize={18} />
              </ElectricBorder>
            </motion.div>
          </div>

          {/* ─ 右侧：留白给光柱 ─ */}
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* ── 底部滚动提示 ── */}
      <motion.a
        href="#work"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="relative z-10 flex flex-col items-center pb-6 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] mb-1.5">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.a>
      </ClickSpark>
    </section>
  );
}
