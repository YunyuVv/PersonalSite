import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/config";
import { Footer } from "@/components/layout/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { HomeHeroFull } from "@/components/home/home-hero-full";
import { HomeFeatured } from "@/components/home/home-featured";
import { MBTISection } from "@/components/sections/mbti-section";
import { HomeAbout } from "@/components/home/home-about";
import { HomeContact } from "@/components/home/home-contact";

// 强制动态渲染：后台修改配置后无需重新构建即可生效。
// 静态导出时由 scripts/build-static.mjs 临时替换为 force-static。
export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const config = getSiteConfig();
  return {
    title: `${config.name} · ${config.role}`,
    description: config.siteConfig.description,
    alternates: { canonical: "/" },
  };
}

export default function HomePage() {
  // 每次渲染重新读取，保证后台改配置后即时生效
  const config = getSiteConfig();
  // 各内容模块开关；缺省（undefined）视为开启，因此空对象 = 全部展示
  const m = config.modules ?? {};

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
        {m.featured !== false && <HomeFeatured />}
        {m.mbti !== false && <MBTISection variant="hero" />}
        {m.about !== false && <HomeAbout />}
        {m.social !== false && <HomeContact />}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
