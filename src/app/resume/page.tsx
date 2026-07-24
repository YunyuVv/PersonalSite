import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import profile from "@/data/profile";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { Reveal } from "@/components/ui/reveal";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ContactSection } from "@/components/sections/contact-section";

export const metadata: Metadata = {
  title: `${profile.name} | 简历`,
  description: `${profile.name} 的完整履历——${profile.role}，专注于 ${profile.skills[0]?.items[0]?.name ?? "前端"} 生态与工程实践。`,
  alternates: { canonical: "/resume" },
};

const STATS = [
  { value: "5+", label: "年经验" },
  { value: "20+", label: "开源 PR" },
  { value: "2k+", label: "周下载" },
];

const FOCUS = ["TypeScript", "React", "Next.js", "Node.js", "CI/CD"];

export default function ResumePage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-28 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5 auto-rows-min">

            {/* Hero */}
            <HeroSection />

            {/* 侧栏：状态 / 数据 / 聚焦 */}
            <div className="md:col-span-2 flex flex-col gap-4 md:gap-5">
              <Reveal className="bento-card p-6">
                <span className="bento-label">现状 / Status</span>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 text-[var(--text-primary)]">
                    <MapPin size={16} className="text-[var(--accent)]" />
                    <span className="text-sm font-medium">{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse-soft" />
                    <span className="text-sm text-[var(--text-secondary)]">
                      求职状态：开放中
                    </span>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.05} className="bento-card p-6 flex-1">
                <span className="bento-label">数据 / Stats</span>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {STATS.map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                        {s.value}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.1} className="bento-card p-6">
                <span className="bento-label">聚焦 / Focus</span>
                <div className="mt-4 flex flex-wrap gap-2">
                  {FOCUS.map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center px-3 py-1 text-[13px] rounded-full bg-[var(--bg-muted)] text-[var(--text-primary)]"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* 关于 + 技能 */}
            <AboutSection />
            <SkillsSection />

            {/* 经历 */}
            <ExperienceSection />

            {/* 项目 */}
            <ProjectsSection />

            {/* 联系 */}
            <ContactSection />
          </div>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
