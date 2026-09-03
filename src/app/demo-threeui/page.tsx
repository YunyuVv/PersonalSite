"use client";

import "@designcodeio/threeui/style.css";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import profile from "@/data/profile";
import {
  ThreeUIClient,
  useThreeUIMode,
  ConstellationField,
  NeonTypography,
  ParticleWordmark,
  GradientCta,
  GlassmorphismCta,
  LiquidMetalButton,
  GradientBeamCta,
  LumenCta,
  GradientPillButton,
  SpinningBorderButton,
} from "@/components/threeui/threeui-client";

const DISPLAY = { fontFamily: "var(--font-display)" } as const;

/* 着色器按钮（组件内置标签，作为组件演示展示） */
const SHADER_BUTTONS = [
  GradientCta,
  GlassmorphismCta,
  LiquidMetalButton,
  GradientBeamCta,
  LumenCta,
  GradientPillButton,
  SpinningBorderButton,
];

export default function ThreeUIPage() {
  const mode = useThreeUIMode();
  const hue = 220; // 站点强调色（蓝）对应的 HSL 色相

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* ── 全屏背景：星座场 ── */}
      <ThreeUIClient
        className="fixed inset-0 -z-10 pointer-events-none"
        fallback={
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(91,141,239,0.18),transparent_55%)]" />
        }
      >
        <ConstellationField mode={mode} hue={hue} variant="constellation-field" />
      </ThreeUIClient>

      {/* ── 顶栏 ── */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 py-5">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight"
          style={DISPLAY}
        >
          {profile.name.split(" ")[0] || profile.name}
          <span className="text-[var(--accent)]">.</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/home-threeui"
            className="rounded-full border border-[var(--divider)] px-4 py-2 text-sm transition-colors hover:border-[var(--accent)]"
          >
            ThreeUI Hero ↗
          </Link>
          <Link
            href="/creative"
            className="rounded-full border border-[var(--divider)] px-4 py-2 text-sm transition-colors hover:border-[var(--accent)]"
          >
            互动版 ↗
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 mx-auto flex min-h-[82vh] max-w-6xl flex-col justify-center px-6 md:px-12 pt-32">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm uppercase tracking-[0.25em] text-[var(--text-secondary)]"
        >
          ThreeUI · 3D 视觉实验室
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-4 text-5xl font-bold leading-[1.05] md:text-7xl"
          style={DISPLAY}
        >
          {profile.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mt-5 max-w-xl text-lg text-[var(--text-secondary)]"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <Link
            href="/creative"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-medium text-[var(--text-on-accent)] transition-opacity hover:opacity-90"
          >
            查看作品 <ArrowRight size={16} />
          </Link>
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--divider)] px-6 py-3 font-medium transition-colors hover:border-[var(--accent)]"
          >
            简历
          </Link>
        </motion.div>
      </section>

      {/* ── 组件展示 ── */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 md:px-12 py-20">
        <p className="text-sm uppercase tracking-[0.25em] text-[var(--text-secondary)]">
          01 — 文字着色器
        </p>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl" style={DISPLAY}>
          霓虹与粒子字效
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <ThreeUIClient
            className="flex h-44 items-center justify-center overflow-hidden rounded-[var(--radius-card)] border border-[var(--divider)] bg-[var(--bg-card)]"
            fallback={<div className="text-3xl font-bold" style={DISPLAY}>ThreeUI</div>}
          >
            <NeonTypography mode={mode} hue={hue} />
          </ThreeUIClient>
          <ThreeUIClient
            className="flex h-44 items-center justify-center overflow-hidden rounded-[var(--radius-card)] border border-[var(--divider)] bg-[var(--bg-card)]"
            fallback={<div className="text-3xl font-bold" style={DISPLAY}>ThreeUI</div>}
          >
            <ParticleWordmark mode={mode} hue={hue} />
          </ThreeUIClient>
        </div>

        <p className="mt-16 text-sm uppercase tracking-[0.25em] text-[var(--text-secondary)]">
          02 — 按钮着色器
        </p>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl" style={DISPLAY}>
          玻璃 / 液态金属 / 渐变光束
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-[var(--text-secondary)]">
          以下按钮为 ThreeUI 组件内置标签的实时演示（组件不接收自定义文案）。
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          {SHADER_BUTTONS.map((Btn, i) => (
            <ThreeUIClient
              key={i}
              fallback={
                <button className="rounded-full border border-[var(--divider)] px-5 py-3 text-sm">
                  ThreeUI
                </button>
              }
            >
              <Btn mode={mode} hue={hue} />
            </ThreeUIClient>
          ))}
        </div>
      </section>

      {/* ── 页脚 ── */}
      <footer className="relative z-10 border-t border-[var(--divider)] px-6 md:px-12 py-8 text-sm text-[var(--text-secondary)]">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 md:flex-row">
          <span>
            © {new Date().getFullYear()} {profile.name} · {profile.role}
          </span>
          <span>由 ThreeUI Community 组件驱动 · MIT</span>
        </div>
      </footer>
    </main>
  );
}
