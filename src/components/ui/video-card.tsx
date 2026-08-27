"use client";

import { motion } from "framer-motion";
import { Play, Eye } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { ContentItem } from "@/types/profile";

/** 平台角标：用于卡片封面右下角标识来源 */
const PLATFORM_BADGE: Record<string, { label: string; color: string }> = {
  bilibili: { label: "B 站", color: "#FB7299" },
  douyin: { label: "抖音", color: "#161823" },
  youtube: { label: "YouTube", color: "#FF0000" },
  xiaohongshu: { label: "小红书", color: "#FF2442" },
  wechat: { label: "公众号", color: "#07C160" },
  weibo: { label: "微博", color: "#E6162D" },
};

interface VideoCardProps {
  item: ContentItem;
  index: number;
}

export function VideoCard({ item, index }: VideoCardProps) {
  const reduced = useReducedMotion();
  const badge = PLATFORM_BADGE[item.platform] ?? {
    label: item.platform,
    color: "var(--accent)",
  };
  const initial = item.title.trim().charAt(0);

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={reduced ? undefined : { opacity: 0, y: 32 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group bento-card rounded-2xl overflow-hidden hover:-translate-y-1 flex flex-col"
    >
      {/* 封面区（占位：平台色渐变 + 标题首字，后续可替换为 item.cover 真实截图） */}
      <div className="relative h-44 overflow-hidden">
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${badge.color}22, var(--bg-muted))`,
          }}
        >
          <span
            className="text-6xl font-black leading-none select-none"
            style={{ color: badge.color }}
          >
            {initial}
          </span>
        </div>

        {/* 平台角标 */}
        <span
          className="absolute top-3 left-3 inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium text-white shadow-sm"
          style={{ backgroundColor: badge.color }}
        >
          {badge.label}
        </span>

        {/* 时长 */}
        <span className="absolute bottom-3 right-3 inline-flex items-center px-1.5 py-0.5 rounded bg-black/70 text-white text-[11px] font-mono tracking-wide">
          {item.duration}
        </span>

        {/* hover 播放遮罩 */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 group-hover:bg-black/25 group-hover:opacity-100 transition-all duration-300">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/90 text-[var(--text-primary)] shadow-lg">
            <Play size={20} fill="currentColor" />
          </span>
        </div>
      </div>

      {/* 信息 */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-base font-semibold text-[var(--text-primary)] line-clamp-2 leading-snug">
          {item.title}
        </h3>

        <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1">
            <Eye size={13} />
            {item.views}
          </span>
          <span>{item.date}</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-0.5 text-[11px] rounded-md bg-[var(--bg-muted)] text-[var(--text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}
