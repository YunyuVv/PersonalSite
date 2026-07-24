"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Code2,
  FileCode,
  Braces,
  Layout,
  Monitor,
  Palette,
  Server,
  Database,
  Cloud,
  Container,
  Box,
  Network,
  GitBranch,
  Terminal,
  PenTool,
  Globe,
  Cpu,
  Layers,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { SkillCategory } from "@/types/profile";

interface ScrollRevealProps {
  skills: SkillCategory[];
}

/** 技能名 → lucide 图标映射 */
const SKILL_ICONS: Record<string, LucideIcon> = {
  TypeScript: Braces,
  JavaScript: FileCode,
  Python: Terminal,
  Go: Cpu,
  React: Monitor,
  "Next.js": Globe,
  Vue: Layout,
  "Tailwind CSS": Palette,
  "Framer Motion": Layers,
  "Node.js": Server,
  "Express/NestJS": Server,
  PostgreSQL: Database,
  Redis: Database,
  Docker: Container,
  Kubernetes: Box,
  "AWS/腾讯云": Cloud,
  "CI/CD": Network,
  Git: GitBranch,
  Figma: PenTool,
  "VS Code": Code2,
  Vim: Terminal,
  Linux: Terminal,
};

function getSkillIcon(name: string): LucideIcon {
  return SKILL_ICONS[name] ?? Code2;
}

/** 左侧木轴 */
function LeftRoller() {
  return (
    <div className="shrink-0 relative w-9 h-full">
      <svg
        viewBox="0 0 36 360"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="wood-l" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b6b3c" />
            <stop offset="25%" stopColor="#c4a46c" />
            <stop offset="50%" stopColor="#d4b87c" />
            <stop offset="75%" stopColor="#c4a46c" />
            <stop offset="100%" stopColor="#8b6b3c" />
          </linearGradient>
        </defs>
        <rect x="4" y="0" width="28" height="360" rx="6" fill="url(#wood-l)" />
        {/* 轴头 */}
        <rect x="0" y="10" width="36" height="14" rx="4" fill="#a07a4c" />
        <rect x="0" y="336" width="36" height="14" rx="4" fill="#a07a4c" />
      </svg>
    </div>
  );
}

/** 右侧木轴 */
function RightRoller() {
  return (
    <div className="shrink-0 relative w-10 h-full">
      <svg
        viewBox="0 0 40 360"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="wood-r" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8b6b3c" />
            <stop offset="25%" stopColor="#c4a46c" />
            <stop offset="50%" stopColor="#d4b87c" />
            <stop offset="75%" stopColor="#c4a46c" />
            <stop offset="100%" stopColor="#8b6b3c" />
          </linearGradient>
        </defs>
        {/* 主轴（稍粗，因为是卷轴卷绕侧） */}
        <rect x="2" y="0" width="28" height="360" rx="6" fill="url(#wood-r)" />
        {/* 轴头（更粗） */}
        <rect x="0" y="10" width="40" height="16" rx="5" fill="#a07a4c" />
        <rect x="0" y="334" width="40" height="16" rx="5" fill="#a07a4c" />
      </svg>
    </div>
  );
}

/** 单个技能图标卡片 */
function SkillIconCard({
  name,
  level,
  index,
  reduced,
}: {
  name: string;
  level: number;
  index: number;
  reduced: boolean;
}) {
  const Icon = getSkillIcon(name);

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, scale: 0.6 }}
      whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: 0.8 + index * 0.06,
        duration: 0.4,
        ease: "easeOut",
      }}
      whileHover={
        reduced
          ? undefined
          : {
              scale: 1.15,
              y: -4,
              transition: { duration: 0.15 },
            }
      }
      className="flex flex-col items-center gap-2 shrink-0 w-18 cursor-default"
    >
      {/* 图标容器 */}
      <div
        className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-shadow"
        style={{
          backgroundColor: `color-mix(in srgb, var(--lapis) ${20 + level * 16}%, transparent)`,
          boxShadow: level >= 4
            ? "0 2px 8px var(--lapis)"
            : "none",
        }}
      >
        <Icon
          size={22}
          style={{
            color: level >= 4 ? "var(--text-on-accent)" : `color-mix(in srgb, var(--lapis) ${60 + level * 8}%, var(--text-primary))`,
            opacity: 0.6 + level * 0.08,
          }}
          strokeWidth={1.5}
        />
        {/* 熟练度光环 */}
        {level >= 4 && (
          <div
            className="absolute inset-0 rounded-xl ring-1 ring-inset"
            style={{
              borderColor: "var(--lapis)",
              opacity: 0.3,
            }}
          />
        )}
      </div>
      {/* 技能名 */}
      <span
        className="text-[11px] text-center leading-tight max-w-[72px]"
        style={{
          fontFamily: "var(--font-mono)",
          color: level >= 4
            ? "var(--text-primary)"
            : "var(--text-muted)",
          fontWeight: level >= 4 ? 500 : 400,
        }}
      >
        {name}
      </span>
    </motion.div>
  );
}

/** 类别分隔符 */
function CategorySeparator({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center gap-1 shrink-0 px-2">
      <div className="h-16 w-px bg-[var(--divider)]" />
      <span
        className="text-[10px] tracking-[0.3em] text-[var(--gold)]"
        style={{
          fontFamily: "var(--font-serif)",
          writingMode: "vertical-rl",
        }}
      >
        {name}
      </span>
    </div>
  );
}

export function ScrollReveal({ skills }: ScrollRevealProps) {
  const reduced = useReducedMotion();

  return (
    <div className="relative mx-auto max-w-4xl">
      {/* 内容区 */}
      <div className="flex items-stretch" style={{ height: "360px" }}>
        {/* 左木轴 */}
        <motion.div
          className="h-full"
          initial={reduced ? undefined : { opacity: 0 }}
          whileInView={reduced ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <LeftRoller />
        </motion.div>

        {/* 卷轴画布 — clip-path 从中间向两边展开 */}
        <motion.div
          className="flex-1 relative overflow-hidden rounded-sm"
          initial={
            reduced
              ? undefined
              : { clipPath: "inset(0 50% 0 50%)" }
          }
          whileInView={
            reduced
              ? undefined
              : { clipPath: "inset(0 0% 0 0%)" }
          }
          viewport={{ once: true }}
          transition={{
            duration: 1.2,
            delay: 0.2,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{
            background: `
              linear-gradient(
                90deg,
                var(--bg-card) 0%,
                var(--rice-paper) 20%,
                var(--rice-paper) 80%,
                var(--bg-card) 100%
              )
            `,
          }}
        >
          {/* 宣纸纹理 */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.025]"
            aria-hidden="true"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-px"
                style={{
                  left: `${5 + i * 8}%`,
                  background: "var(--text-primary)",
                }}
              />
            ))}
          </div>

          {/* 技能内容 — 横向排列 */}
          <div className="relative h-full flex items-center px-6 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-1 min-w-max">
              {skills.map((category, ci) => (
                <div key={category.name} className="flex items-center">
                  {/* 类别分隔 */}
                  {ci > 0 && <CategorySeparator name={category.name} />}
                  {/* 首个类别的标题 */}
                  {ci === 0 && (
                    <CategorySeparator name={category.name} />
                  )}
                  {/* 技能图标 */}
                  {category.items.map((item, ii) => (
                    <SkillIconCard
                      key={item.name}
                      name={item.name}
                      level={item.level}
                      index={ci * 10 + ii}
                      reduced={reduced}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* 左侧淡出遮罩 */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--bg-card)] to-transparent pointer-events-none" />
            {/* 右侧淡出遮罩 */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-[var(--bg-card)] pointer-events-none" />
          </div>
        </motion.div>

        {/* 右木轴 */}
        <motion.div
          className="h-full"
          initial={reduced ? undefined : { opacity: 0 }}
          whileInView={reduced ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <RightRoller />
        </motion.div>
      </div>

      {/* 底部提示：可横向滚动 */}
      <motion.p
        className="text-center text-[11px] text-[var(--text-muted)] mt-4"
        initial={reduced ? undefined : { opacity: 0 }}
        whileInView={reduced ? undefined : { opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.2 }}
      >
        左右滑动浏览完整技能图谱
      </motion.p>
    </div>
  );
}
