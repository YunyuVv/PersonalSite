"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Brain, Sparkles, EyeOff } from "lucide-react";
import { useSiteConfig } from "@/lib/site-config-context";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface MBTICardProps {
  className?: string;
}

const mbtiImageOf = (type: string) => `/mbti/${type.toLowerCase()}.png`;

const CONTAINER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const ITEM_FADE = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

function TagList({
  items,
  tone,
}: {
  items: string[];
  tone: "strength" | "weakness";
}) {
  const isStrength = tone === "strength";
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        {isStrength ? (
          <Sparkles size={14} className="text-[var(--accent)]" />
        ) : (
          <EyeOff size={14} className="text-[var(--text-muted)]" />
        )}
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          {isStrength ? "核心优势" : "潜在盲区"}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs transition ${
              isStrength
                ? "border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/15"
                : "border-[var(--divider)] bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]/80"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function DimensionBars() {
  const { mbti } = useSiteConfig();
  const reduced = useReducedMotion();

  return (
    <div className="space-y-4">
      {mbti.dimensions.map((d, i) => {
        const dominantLeft = d.score <= 50;
        const pct = dominantLeft ? 100 - d.score : d.score;
        const dominantLabel = dominantLeft ? d.leftName : d.rightName;
        const dominantLetter = dominantLeft ? d.left : d.right;
        const subLabel = dominantLeft ? d.rightName : d.leftName;
        const subLetter = dominantLeft ? d.right : d.left;

        return (
          <div key={i}>
            <div className="mb-2 flex items-center justify-between text-xs">
              <span
                className={`font-medium ${
                  dominantLeft
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-muted)]"
                }`}
              >
                {d.left}
                <span className="ml-0.5">{d.leftName}</span>
              </span>
              <span
                className={`font-medium ${
                  !dominantLeft
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-muted)]"
                }`}
              >
                <span className="mr-0.5">{d.rightName}</span>
                {d.right}
              </span>
            </div>

            <div className="relative h-2 overflow-hidden rounded-full bg-[var(--bg-muted)]">
              <motion.div
                className="absolute top-0 h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, var(--accent), var(--accent-light))",
                  left: dominantLeft ? 0 : "auto",
                  right: dominantLeft ? "auto" : 0,
                }}
                initial={reduced ? undefined : { width: 0 }}
                whileInView={reduced ? undefined : { width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.9,
                  delay: 0.2 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>

            <div className="mt-1.5 flex items-center justify-between text-[11px]">
              <span className="text-[var(--text-muted)]">
                主导：
                <span className="font-medium text-[var(--accent)]">
                  {dominantLetter} {dominantLabel}
                </span>
              </span>
              <span className="font-mono text-[var(--text-muted)]">{pct}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function MBTICard({ className = "" }: MBTICardProps) {
  const { mbti } = useSiteConfig();
  const mbtiImage = mbtiImageOf(mbti.type);
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={`relative ${className}`}
      variants={CONTAINER}
      initial={reduced ? undefined : "hidden"}
      whileInView={reduced ? undefined : "show"}
      viewport={{ once: true, margin: "-80px" }}
    >
      {/* 左上角 accent 光晕 */}
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full opacity-15 blur-3xl dark:opacity-25"
        style={{ background: "var(--accent)" }}
        aria-hidden
      />

      <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-10">
        {/* 左侧：人物插画 */}
        <motion.div
          className="flex items-center justify-center lg:col-span-5"
          variants={ITEM_FADE}
        >
          <motion.div
            className="relative h-64 w-64 sm:h-72 sm:w-72 lg:h-80 lg:w-80"
            animate={
              reduced
                ? undefined
                : {
                    y: [0, -8, 0],
                  }
            }
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src={mbtiImage}
              alt={`${mbti.type} ${mbti.name} 人物插画`}
              fill
              className="relative z-10 object-contain drop-shadow-2xl"
              sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 320px"
              priority={false}
            />
          </motion.div>
        </motion.div>

        {/* 右侧：类型信息与数据 */}
        <div className="flex flex-col justify-center lg:col-span-7">
          <motion.div variants={ITEM_FADE}>
            <span className="hm-eyebrow inline-flex items-center gap-1.5">
              <Brain size={14} />
              性格 / MBTI
            </span>

            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
                {mbti.type}
              </span>
              <span className="text-lg font-medium text-[var(--text-secondary)]">
                {mbti.name}
              </span>
              <span className="font-mono text-sm text-[var(--text-muted)]">
                {mbti.nameEn}
              </span>
            </div>

            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--text-secondary)]">
              {mbti.description}
            </p>
          </motion.div>

          {/* 维度分析 */}
          <motion.div
            className="mt-7 border-t border-[var(--divider)] pt-5"
            variants={ITEM_FADE}
          >
            <h3 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">
              维度分析
            </h3>
            <DimensionBars />
          </motion.div>

          {/* 标签 */}
          <motion.div
            className="mt-7 grid gap-5 sm:grid-cols-2"
            variants={ITEM_FADE}
          >
            <TagList items={mbti.strengths} tone="strength" />
            <TagList items={mbti.weaknesses} tone="weakness" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
