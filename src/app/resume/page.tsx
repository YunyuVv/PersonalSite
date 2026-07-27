import type { Metadata } from "next";
import profile from "@/data/profile";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { HeroSection } from "@/components/sections/hero-section";
import { SidebarSection } from "@/components/sections/sidebar-section";
import { AboutSection } from "@/components/sections/about-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { MBTISection } from "@/components/sections/mbti-section";
import { ContactSection } from "@/components/sections/contact-section";

export const metadata: Metadata = {
  title: `${profile.name} | 简历`,
  description: `${profile.name} 的完整履历——${profile.role}，专注于 ${profile.skills[0]?.items[0]?.name ?? "前端"} 生态与工程实践。`,
  alternates: { canonical: "/resume" },
};

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
            <SidebarSection />

            {/* 关于 + 技能 */}
            <AboutSection />
            <SkillsSection />

            {/* MBTI 性格 */}
            <MBTISection variant="bento" />

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
