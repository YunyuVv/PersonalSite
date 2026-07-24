import Link from "next/link";
import { ArrowRight } from "lucide-react";
import profile from "@/data/profile";
import homepage from "@/data/homepage";
import { Reveal } from "@/components/ui/reveal";
import { ProjectCard } from "@/components/ui/project-card";

export function HomeFeatured() {
  const featured = profile.projects.filter((p) =>
    homepage.featuredProjectIds.includes(p.id)
  );

  return (
    <Reveal id="work" className="hm-section hm-hairline">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <span className="hm-eyebrow">精选作品 / Selected Work</span>
            <h2 className="hm-h2 mt-4">近期在做的一些东西</h2>
          </div>
          <Link href="/resume#projects" className="hm-more">
            看全部简历
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {featured.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </Reveal>
  );
}
