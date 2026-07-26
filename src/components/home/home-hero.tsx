import Link from "next/link";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import profile from "@/data/profile";
import homepage from "@/data/homepage";
import { Reveal } from "@/components/ui/reveal";
import { Avatar } from "@/components/ui/avatar";
import { SocialLinks } from "@/components/ui/social-links";
import { ShimmerButton } from "@/components/magic-ui/shimmer-button";

export function HomeHero() {
  const p = profile;
  return (
    <Reveal className="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-24">
      <div className="hm-hero-glow" aria-hidden />
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center">
          {/* 文案 */}
          <div>
            <span className="hm-eyebrow">
              <span className="hm-dot" />
              {homepage.statusBadge} · {p.location}
            </span>

            <h1 className="hm-name mt-7">{p.name}</h1>
            <p className="hm-role mt-6">{p.role}</p>
            <p className="hm-lead mt-5 max-w-xl">{p.tagline}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ShimmerButton asChild>
                <Link href="/resume" className="gap-2">
                  查看简历 <ArrowRight size={16} />
                </Link>
              </ShimmerButton>
              <Link href="/creative" className="hm-btn-ghost">
                <Sparkles size={16} />
                互动版
              </Link>
              <a href="#contact" className="hm-btn-ghost">
                <Mail size={16} />
                联系我
              </a>
            </div>

            <div className="mt-9">
              <p className="hm-eyebrow mb-3">关注我 / Social</p>
              <SocialLinks iconSize={18} />
            </div>
          </div>

          {/* 头像 */}
          <div className="order-first lg:order-last flex justify-center lg:justify-end">
            <div className="relative">
              <Avatar size={176} className="shadow-xl" priority />
              <span
                className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-[var(--accent)] ring-4 ring-[var(--bg-primary)]"
                title="开放新机会"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
