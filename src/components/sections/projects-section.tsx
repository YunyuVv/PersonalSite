"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { ProjectCard } from "@/components/ui/project-card";
import { BrushDivider } from "@/components/ui/brush-divider";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import profile from "@/data/profile";

export function ProjectsSection() {
  const reduced = useReducedMotion();

  return (
    <SectionWrapper id="projects" className="py-24 md:py-32">
      {/* 区域标题 */}
      <motion.div
        className="text-center mb-16"
        initial={reduced ? undefined : { opacity: 0, y: 20 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2
          className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          项目作品
        </h2>
        <BrushDivider />
        <p className="text-sm text-[var(--text-muted)] mt-4">
          点击卡片跳转至项目链接
        </p>
      </motion.div>

      {/* 项目卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profile.projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
