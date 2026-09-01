"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Brain, Sparkles, EyeOff } from "lucide-react";
import { useSiteConfig } from "@/lib/site-config-context";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { MBTICard } from "./mbti-card";

interface MBTISectionProps {
  /**
   * 展示变体：
   * - `"hero"` 首页独立区块（使用 MBTICard 卡片组件）
   * - `"bento"` 简历页 bento 卡片（适配 grid 布局，含小插画）
   */
  variant?: "hero" | "bento";
  className?: string;
}

/** MBTI 人物插画路径，统一存放于 public/mbti/{type}.png */
const mbtiImageOf = (type: string) => `/mbti/${type.toLowerCase()}.png`;

export function MBTISection({ variant = "hero", className = "" }: MBTISectionProps) {
  const { mbti } = useSiteConfig();
  const mbtiImage = mbtiImageOf(mbti.type);
  const reduced = useReducedMotion();

  /* ---------- 维度条 ---------- */
  const DimensionBars = () => (
    <div className="space-y-4">
      {mbti.dimensions.map((d, i) => {
        const dominantLeft = d.score <= 50;
        const pct = dominantLeft ? 100 - d.score : d.score;
        const dominantLabel = dominantLeft ? d.leftName : d.rightName;
        const dominantLetter = dominantLeft ? d.left : d.right;

        return (
          <div key={i} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-[var(--text-muted)]">
                {d.leftName}
                <span className="font-semibold ml-0.5 text-[var(--text-secondary)]">
                  {d.left}
                </span>
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                <span className="font-semibold mr-0.5 text-[var(--text-secondary)]">
                  {d.right}
                </span>
                {d.rightName}
              </span>
            </div>

            <div className="relative h-2 rounded-full bg-[var(--bg-muted)] overflow-hidden">
              <motion.div
                className="absolute top-0 h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, var(--accent), var(--accent-light))`,
                  left: dominantLeft ? 0 : "auto",
                  right: dominantLeft ? "auto" : 0,
                }}
                initial={reduced ? undefined : { width: 0 }}
                whileInView={reduced ? undefined : { width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] text-[var(--text-muted)]">
                主导：<span className="text-[var(--accent)] font-medium">{dominantLetter} {dominantLabel}</span>
              </span>
              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                {pct}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );

  /* ---------- 标签列表 ---------- */
  const TagList = ({
    items,
    icon,
    tone,
  }: {
    items: string[];
    icon: React.ReactNode;
    tone: "strength" | "weakness";
  }) => (
    <div>
      <div className="flex items-center gap-1.5 mb-2.5">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          {tone === "strength" ? "核心优势" : "潜在盲区"}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((s) => (
          <span
            key={s}
            className={`inline-flex items-center px-2.5 py-1 text-xs rounded-full border ${
              tone === "strength"
                ? "bg-[var(--accent)]/8 text-[var(--accent)] border-[var(--accent)]/20"
                : "bg-[var(--bg-muted)] text-[var(--text-secondary)] border-[var(--divider)]"
            }`}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );

  /* =================== HERO 变体 =================== */
  if (variant === "hero") {
    return (
      <section id="mbti" className={`hm-section hm-hairline ${className}`}>
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <MBTICard />
        </div>
      </section>
    );
  }

  /* =================== BENTO 变体 =================== */
  return (
    <motion.div
      className={`md:col-span-4 bento-card p-7 flex flex-col ${className}`}
      initial={reduced ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="bento-label flex items-center gap-1.5">
        <Brain size={13} />
        性格 / MBTI
      </span>

      {/* 类型头部 + 小插画 */}
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-3xl tracking-tight text-[var(--text-primary)]">
              {mbti.type}
            </span>
            <span className="text-sm text-[var(--text-secondary)] font-medium">
              {mbti.name}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2 max-w-[200px]">
            {mbti.description}
          </p>
        </div>

        {/* 小插画 */}
        <div className="relative w-20 h-20 shrink-0">
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-15 dark:opacity-25"
            style={{ background: "var(--accent)" }}
            aria-hidden
          />
          <Image
            src={mbtiImage}
            alt={`${mbti.type} 插画`}
            fill
            className="object-contain relative z-10"
            sizes="80px"
          />
        </div>
      </div>

      {/* 维度条 */}
      <div className="mt-5">
        <DimensionBars />
      </div>

      {/* 标签 */}
      <div className="mt-5 space-y-3 flex-1 flex flex-col justify-end">
        <TagList
          items={mbti.strengths}
          icon={<Sparkles size={12} className="text-[var(--accent)]" />}
          tone="strength"
        />
        <TagList
          items={mbti.weaknesses}
          icon={<EyeOff size={12} className="text-[var(--text-muted)]" />}
          tone="weakness"
        />
      </div>
    </motion.div>
  );
}
