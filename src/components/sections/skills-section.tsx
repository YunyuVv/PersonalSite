"use client";

import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiFramer,
  SiVuedotjs,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiRedis,
  SiDocker,
  SiKubernetes,
  SiGit,
  SiFigma,
  SiPython,
  SiGo,
  SiLinux,
} from "react-icons/si";
import profile from "@/data/profile";
import { Reveal } from "@/components/ui/reveal";
import { LogoLoop, type LogoItem } from "@/components/reactbits/logo-loop";

/* ─── Tech stack logo map ─── */

const TECH_LOGOS: Record<string, { icon: React.ReactNode; color: string }> = {
  TypeScript:  { icon: <SiTypescript />,  color: "#3178C6" },
  JavaScript:  { icon: <SiJavascript />,   color: "#F7DF1E" },
  React:       { icon: <SiReact />,        color: "#61DAFB" },
  "Next.js":   { icon: <SiNextdotjs />,    color: "currentColor" },
  Vue:         { icon: <SiVuedotjs />,     color: "#4FC08D" },
  "Tailwind CSS": { icon: <SiTailwindcss />, color: "#06B6D4" },
  "Framer Motion": { icon: <SiFramer />,   color: "#0055FF" },
  "Node.js":   { icon: <SiNodedotjs />,    color: "#5FA04E" },
  "Express/NestJS": { icon: <SiExpress />, color: "currentColor" },
  PostgreSQL:  { icon: <SiPostgresql />,   color: "#4169E1" },
  Redis:       { icon: <SiRedis />,        color: "#FF4438" },
  Docker:      { icon: <SiDocker />,       color: "#2496ED" },
  Kubernetes:  { icon: <SiKubernetes />,   color: "#326CE5" },
  Git:         { icon: <SiGit />,          color: "#F05032" },
  Figma:       { icon: <SiFigma />,        color: "#F24E1E" },
  Python:      { icon: <SiPython />,       color: "#3776AB" },
  Go:          { icon: <SiGo />,           color: "#00ADD8" },
  Linux:       { icon: <SiLinux />,        color: "#FCC624" },
  "CI/CD":     { icon: <SiGit />,          color: "#F05032" },
  "AWS/腾讯云": { icon: <SiKubernetes />,  color: "#326CE5" },
  "VS Code":   { icon: <SiGit />,          color: "#007ACC" },
};

/* ─── Build LogoItem array from profile.skills ─── */

function buildLogos(): LogoItem[] {
  const seen = new Set<string>();
  const items: LogoItem[] = [];

  for (const cat of profile.skills) {
    for (const skill of cat.items) {
      if (seen.has(skill.name)) continue;
      seen.add(skill.name);

      const tech = TECH_LOGOS[skill.name];
      if (!tech) continue;

      items.push({
        node: (
          <span className="inline-flex items-center gap-2 text-[var(--text-secondary)]">
            <span style={{ color: tech.color, fontSize: "1.5em" }}>{tech.icon}</span>
            <span className="text-sm font-medium whitespace-nowrap">{skill.name}</span>
          </span>
        ),
        title: skill.name,
      });
    }
  }
  return items;
}

/* ─── Component ─── */

export function SkillsSection() {
  const logos = buildLogos();

  return (
    <Reveal id="skills" className="md:col-span-3 bento-card p-7 flex flex-col">
      <span className="bento-label">技能 / Skills</span>

      {/* LogoLoop 技术栈跑马灯 */}
      {logos.length > 0 && (
        <div className="mt-5 h-12 relative">
          <LogoLoop
            logos={logos}
            speed={60}
            direction="left"
            logoHeight={36}
            gap={48}
            hoverSpeed={0}
            scaleOnHover
            fadeOut
            ariaLabel="技术栈"
          />
        </div>
      )}

      {/* 分类标签 (保留原有布局) */}
      <div className="mt-5 space-y-4">
        {profile.skills.map((cat) => (
          <div key={cat.name}>
            <p className="text-xs font-medium text-[var(--text-muted)] mb-2">
              {cat.name}
            </p>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <span
                  key={item.name}
                  className="inline-flex items-center px-3 py-1 text-[13px] rounded-full bg-[var(--bg-muted)] text-[var(--text-primary)] border border-transparent hover:border-[var(--accent)] transition-colors"
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
