"use client";

import { useSiteConfig } from "@/lib/site-config-context";
import { Reveal } from "@/components/ui/reveal";
import { ProjectCard } from "@/components/ui/project-card";
import { TiltedCard } from "@/components/reactbits/tilted-card";

export function ProjectsSection() {
  const config = useSiteConfig();
  return (
    <Reveal id="projects" className="md:col-span-6">
      <div className="flex items-end justify-between mb-4 px-1">
        <span className="bento-label">项目 / Projects</span>
        <span className="text-xs text-[var(--text-muted)]">
          {config.projects.length} 个精选项目
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {config.projects.map((project, i) => (
          <TiltedCard
            key={project.id}
            containerHeight="280px"
            containerWidth="100%"
            scaleOnHover={1.03}
            rotateAmplitude={10}
          >
            <ProjectCard project={project} index={i} />
          </TiltedCard>
        ))}
      </div>
    </Reveal>
  );
}
