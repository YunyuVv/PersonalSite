"use client";

import { motion } from "framer-motion";
import { ExternalLink, Code2 } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Project } from "@/types/profile";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={
        reduced ? undefined : { opacity: 0, y: 40 }
      }
      whileInView={
        reduced ? undefined : { opacity: 1, y: 0 }
      }
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: "easeOut",
      }}
      whileHover={
        reduced ? undefined : { y: -8, transition: { duration: 0.25 } }
      }
      className="group relative bg-[var(--bg-card)] rounded-xl overflow-hidden border border-[var(--divider)] hover:border-[var(--gold)]/40 transition-colors"
    >
      {/* 项目截图区域 */}
      <div className="relative h-44 bg-[var(--bg-muted)] overflow-hidden">
        {/* 占位图：水墨风格 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-[var(--accent)] font-serif">
                {project.name.charAt(0)}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              {project.tags.slice(0, 2).join(" · ")}
            </p>
          </div>
        </div>

        {/* hover 遮罩 */}
        <div className="absolute inset-0 bg-[var(--accent)]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--text-on-accent)] text-[var(--accent)] text-sm font-medium hover:bg-[var(--text-on-accent)]/90 transition-colors"
            >
              <ExternalLink size={14} />
              预览
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--text-on-accent)]/20 text-[var(--text-on-accent)] text-sm font-medium hover:bg-[var(--text-on-accent)]/30 transition-colors"
            >
              <Code2 size={14} />
              源码
            </a>
          )}
          {!project.demoUrl && !project.githubUrl && (
            <span className="text-[var(--text-on-accent)]/60 text-sm">即将上线</span>
          )}
        </div>
      </div>

      {/* 卡片信息 */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
          {project.name}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-0.5 text-[11px] rounded-md bg-[var(--bg-muted)] text-[var(--text-muted)]"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="inline-block px-2 py-0.5 text-[11px] rounded-md bg-[var(--bg-muted)] text-[var(--text-muted)]">
              +{project.tags.length - 4}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
