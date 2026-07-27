"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Brain, Sparkles, EyeOff } from "lucide-react";
import profile from "@/data/profile";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface MBTISectionProps {
  /**
   * 展示变体：
   * - `"hero"` 首页独立区块（全宽，三栏布局含插画）
   * - `"bento"` 简历页 bento 卡片（适配 grid 布局，含小插画）
   */
  variant?: "hero" | "bento";
  className?: string;
}

/** MBTI 人物插画路径，统一存放于 public/images */
const MBTI_IMAGE = "/images/mbti-intp.png";

const STAGGER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const ITEM_FADE = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export function MBTISection({ variant = "hero", className = "" }: MBTISectionProps) {
  const { mbti } = profile;
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
      <motion.section
        id="mbti"
        className={`hm-section hm-hairline ${className}`}
        variants={STAGGER}
        initial={reduced ? undefined : "hidden"}
        whileInView={reduced ? undefined : "show"}
        viewport={{ once: true, margin: "-80px" }}
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.span className="hm-eyebrow" variants={ITEM_FADE}>
            <Brain size={14} />
            性格 / MBTI
          </motion.span>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* 左：人物插画 */}
            <motion.div
              className="lg:col-span-4 flex justify-center lg:justify-start"
              variants={ITEM_FADE}
            >
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72">
                {/* 底部光晕装饰 */}
                <div
                  className="absolute inset-0 rounded-full blur-3xl opacity-20 dark:opacity-30"
                  style={{ background: "var(--accent)" }}
                  aria-hidden
                />
                <Image
                  src={MBTI_IMAGE}
                  alt={`${mbti.type} ${mbti.name} 人物插画`}
                  fill
                  className="object-contain relative z-10"
                  sizes="(max-width: 640px) 224px, (max-width: 1024px) 256px, 288px"
                  priority={false}
                />
              </div>
            </motion.div>

            {/* 中：类型信息 + 标签 */}
            <motion.div
              className="lg:col-span-4 flex flex-col items-start"
              variants={ITEM_FADE}
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display font-bold text-5xl sm:text-6xl tracking-tight text-[var(--text-primary)]">
                  {mbti.type}
                </span>
                <span className="text-lg text-[var(--text-secondary)] font-medium">
                  {mbti.name}
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--text-muted)] font-mono">
                {mbti.nameEn}
              </p>
              <p className="mt-5 text-[var(--text-secondary)] leading-relaxed">
                {mbti.description}
              </p>

              <div className="mt-6 space-y-4 w-full">
                <TagList
                  items={mbti.strengths}
                  icon={<Sparkles size={13} className="text-[var(--accent)]" />}
                  tone="strength"
                />
                <TagList
                  items={mbti.weaknesses}
                  icon={<EyeOff size={13} className="text-[var(--text-muted)]" />}
                  tone="weakness"
                />
              </div>
            </motion.div>

            {/* 右：维度条 */}
            <motion.div className="lg:col-span-4" variants={ITEM_FADE}>
              <DimensionBars />
            </motion.div>
          </div>
        </div>
      </motion.section>
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
            src={MBTI_IMAGE}
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
