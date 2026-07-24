import profile from "@/data/profile";
import { Reveal } from "@/components/ui/reveal";
import { ProjectCard } from "@/components/ui/project-card";

export function ProjectsSection() {
  return (
    <Reveal id="projects" className="md:col-span-6">
      <div className="flex items-end justify-between mb-4 px-1">
        <span className="bento-label">项目 / Projects</span>
        <span className="text-xs text-[var(--text-muted)]">
          {profile.projects.length} 个精选项目
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {profile.projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </Reveal>
  );
}
