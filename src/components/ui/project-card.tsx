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
      initial={reduced ? undefined : { opacity: 0, y: 32 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group bento-card rounded-2xl overflow-hidden hover:-translate-y-1"
    >
      {/* 预览区 */}
      <div className="relative h-40 bg-[var(--bg-muted)] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center">
            <span className="text-xl font-bold text-[var(--accent)]">
              {project.name.charAt(0)}
            </span>
          </div>
        </div>

        {/* hover 浮出的操作按钮 */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="预览"
              className="p-2 rounded-full bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm hover:text-[var(--accent)] cursor-pointer"
            >
              <ExternalLink size={14} />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="源码"
              className="p-2 rounded-full bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm hover:text-[var(--accent)] cursor-pointer"
            >
              <Code2 size={14} />
            </a>
          )}
        </div>
      </div>

      {/* 信息 */}
      <div className="p-5">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">
          {project.name}
        </h3>
        <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
          {project.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-0.5 text-[11px] rounded-md bg-[var(--bg-muted)] text-[var(--text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
