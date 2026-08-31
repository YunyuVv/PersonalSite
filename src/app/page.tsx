import type { Metadata } from "next";
import profile from "@/data/profile";
import { homepage } from "@/data/homepage";
import { Footer } from "@/components/layout/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { HomeHeroFull } from "@/components/home/home-hero-full";
import { HomeFeatured } from "@/components/home/home-featured";
import { MBTISection } from "@/components/sections/mbti-section";
import { HomeAbout } from "@/components/home/home-about";
import { HomeContact } from "@/components/home/home-contact";

export const metadata: Metadata = {
  title: `${profile.name} · ${profile.role}`,
  description: profile.siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  // 各内容模块开关；缺省（undefined）视为开启
  const m = homepage.modules ?? {};

  return (
    <>
      {/* 首页极简顶栏：仅保留主题切换（原导航栏与首页图标已移除） */}
      <header className="fixed top-0 inset-x-0 z-50 flex justify-end px-4 md:px-8 pt-4">
        <div className="glass rounded-full">
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1">
        {m.hero !== false && <HomeHeroFull />}
        {m.projects !== false && <HomeFeatured />}
        {m.mbti !== false && <MBTISection variant="hero" />}
        {m.about !== false && <HomeAbout />}
        {m.social !== false && <HomeContact />}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
