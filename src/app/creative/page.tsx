"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, Mail, Home } from "lucide-react";
import profile from "@/data/profile";
import "./creative.css";

/* ============ 字体 ============ */
function Fonts() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&family=Space+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />
    </>
  );
}

/* ============ 磁吸包裹（按钮/链接） ============ */
function Magnetic({
  children,
  className,
  strength = 0.35,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============ 滚动入场 ============ */
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ============ 横向滚动项目卷轴 ============ */
function ProjectReel() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [desktop, setDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const enabled = desktop && !reduced;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["3%", "-66%"]);

  const cards = profile.projects.map((p, i) => (
    <article
      key={p.id}
      className="c-reel-card shrink-0 w-[82vw] sm:w-[70vw] md:w-[460px] p-8 flex flex-col justify-between min-h-[440px] snap-center"
    >
      <div className="flex justify-between items-start">
        <span className="creative-mono text-sm text-[var(--muted)]">
          {String(i + 1).padStart(2, "0")}
        </span>
        <span className="creative-mono text-xs text-[var(--muted)]">2021—2026</span>
      </div>
      <div>
        <h3 className="creative-display text-3xl md:text-4xl mb-3">{p.name}</h3>
        <p className="text-[var(--muted)] text-base md:text-lg leading-relaxed">{p.description}</p>
        <div className="flex flex-wrap gap-2 mt-5">
          {p.tags.map((t) => (
            <span key={t} className="c-tag px-3 py-1 text-xs creative-mono">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-5 mt-7 creative-mono text-sm">
        {p.demoUrl && (
          <a href={p.demoUrl} data-cursor="hover" className="flex items-center gap-1 hover:creative-grad-text">
            演示 <ArrowUpRight size={15} />
          </a>
        )}
        {p.githubUrl && (
          <a href={p.githubUrl} data-cursor="hover" className="flex items-center gap-1 hover:creative-grad-text">
            代码 <ArrowUpRight size={15} />
          </a>
        )}
      </div>
    </article>
  ));

  if (!enabled) {
    return (
      <div className="c-no-scrollbar overflow-x-auto flex gap-6 snap-x px-6 md:px-12 py-6">
        {cards}
      </div>
    );
  }

  return (
    <section ref={ref} className="relative" style={{ height: "320vh" }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="overflow-hidden">
          <motion.div style={{ x }} className="flex gap-8 px-10 md:px-16 will-change-transform">
            {cards}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ============ 社交图标（官方彩色，GitHub / 微信 / 个人博客） ============ */
function SocialGlyph({ name, size = 16 }: { name: "github" | "wechat" | "website"; size?: number }) {
  if (name === "wechat") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="#07C160" aria-hidden="true">
        <path d="M8.69 4C4.64 4 1.35 6.66 1.35 9.94c0 1.78.99 3.36 2.55 4.45L3.1 16.2l2.4-1.24c.78.22 1.6.34 2.46.34.22 0 .43-.01.64-.03a5.4 5.4 0 0 1-.28-1.7c0-3.04 2.86-5.5 6.39-5.5.23 0 .46.01.68.03C14.9 6.02 12.08 4 8.69 4Zm-2.3 3.1a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm4.6 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z" />
        <path d="M22.65 14.06c0-2.78-2.66-5.04-5.94-5.04s-5.94 2.26-5.94 5.04 2.66 5.04 5.94 5.04c.7 0 1.38-.1 2-.29l1.92 1-.5-1.64c1.5-.95 2.46-2.39 2.46-4.11Zm-7.86-1.1a.72.72 0 1 1 0 1.44.72.72 0 0 1 0-1.44Zm3.84 0a.72.72 0 1 1 0 1.44.72.72 0 0 1 0-1.44Z" />
      </svg>
    );
  }
  if (name === "website") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const SOCIALS: { key: "github" | "wechat" | "website"; label: string; color: string }[] = [
  { key: "github", label: "GitHub", color: "currentColor" },
  { key: "wechat", label: "微信公众号", color: "#07C160" },
  { key: "website", label: "个人博客", color: "#6ea8ff" },
];

/* ============ 页面 ============ */
export default function CreativePage() {
  const bioFirst = profile.bio.split("\n\n")[0];

  const marqueeItems = [
    "开放新机会 · OPEN TO WORK",
    "深圳 / SHENZHEN",
    "全栈 FULLSTACK",
    "REACT · NODE · NEXT",
    "✺",
    "五年深耕 · 5 YEARS",
  ];

  return (
    <div className="creative-root">
      <Fonts />

      {/* 顶部极简导航（mix-blend 保证任意底色可读） */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 mix-blend-difference">
        <a href="/" className="creative-display text-xl" data-cursor="hover">
          YunYu<span className="creative-grad-text">.</span>
        </a>
        <nav className="creative-mono text-sm flex items-center gap-6">
          <a href="/" data-cursor="hover" aria-label="返回首页" className="hover:opacity-70 flex items-center gap-1">
            <Home size={18} /> <span className="hidden md:inline">首页</span>
          </a>
        </nav>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 pt-24 overflow-hidden">
        <div className="c-orb" style={{ width: 520, height: 520, background: "var(--violet)", left: "-120px", top: "8%" }} />
        <div className="c-orb" style={{ width: 460, height: 460, background: "var(--coral)", right: "-100px", bottom: "-40px" }} />

        <p className="creative-mono text-sm md:text-base text-[var(--muted)] mb-6 relative z-10">
          © 2026 — 全栈工程师 / CREATIVE ENGINEER
        </p>
        <h1 className="creative-display text-[22vw] md:text-[12vw] leading-[0.84] relative z-10">
          YunYu
        </h1>
        <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-2 relative z-10">
          <span className="creative-display text-3xl md:text-6xl creative-grad-text">我用代码造东西</span>
          <span className="creative-mono text-sm md:text-lg text-[var(--muted)]">I BUILD THINGS WITH CODE</span>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 relative z-10">
          <Magnetic>
            <a
              href="#contact"
              data-cursor="hover"
              className="creative-display text-lg md:text-xl border border-white/20 rounded-full px-7 py-3 hover:border-white transition-colors"
            >
              联系我 ↗
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#projects"
              data-cursor="hover"
              className="creative-display text-lg md:text-xl rounded-full px-7 py-3 creative-grad-text"
            >
              看项目 →
            </a>
          </Magnetic>
        </div>

        {/* 跑马灯 */}
        <div className="c-marquee mt-20 border-y border-white/10 py-4 relative z-10">
          <div className="c-marquee__track creative-mono text-sm md:text-base">
            {[...marqueeItems, ...marqueeItems].map((m, i) => (
              <span key={i} className="px-8 text-[var(--muted)]">
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 关于 ===== */}
      <section id="about" className="px-6 md:px-12 py-28 md:py-44">
        <Reveal>
          <p className="creative-mono text-[var(--muted)] mb-8">01 — 关于 / ABOUT</p>
          <h2 className="creative-display text-4xl md:text-7xl max-w-4xl leading-[1.02]">
            我写的不只是<span className="creative-grad-text">代码</span>，
            <br />
            是让人舒服的<span className="creative-grad-text">体验</span>。
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-10 max-w-2xl text-lg md:text-2xl text-[var(--muted)] leading-relaxed whitespace-pre-line">
            {bioFirst}
          </p>
        </Reveal>
      </section>

      {/* ===== 项目横向卷轴 ===== */}
      <section id="projects" className="py-16 md:py-24">
        <div className="px-6 md:px-12 mb-10 flex justify-between items-end">
          <h2 className="creative-display text-4xl md:text-6xl">
            项目<span className="creative-grad-text">.</span>
          </h2>
          <p className="creative-mono text-[var(--muted)] hidden md:block">滚动浏览 → SCROLL</p>
        </div>
        <ProjectReel />
      </section>

      {/* ===== 技术栈 磁吸标签云 ===== */}
      <section id="stack" className="px-6 md:px-12 py-28 md:py-40">
        <p className="creative-mono text-[var(--muted)] mb-10">02 — 技术栈 / STACK</p>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
          {profile.skills.map((group) => (
            <div key={group.name}>
              <h3 className="creative-display text-2xl md:text-3xl mb-5">{group.name}</h3>
              <div className="flex flex-wrap gap-3">
                {group.items.map((it) => (
                  <span
                    key={it.name}
                    data-cursor="hover"
                    className="c-tag px-4 py-2 text-lg md:text-xl creative-display"
                  >
                    {it.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 经历 大行 ===== */}
      <section id="experience" className="px-6 md:px-12 py-28 md:py-40">
        <p className="creative-mono text-[var(--muted)] mb-10">03 — 经历 / EXPERIENCE</p>
        <div className="border-t border-white/10">
          {profile.experiences.map((e, i) => (
            <Reveal key={i} className="group border-b border-white/10 py-8 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-12">
              <span className="creative-mono text-[var(--muted)] text-sm w-40 shrink-0">
                {e.startDate} — {e.endDate}
              </span>
              <div className="flex-1">
                <h3 className="creative-display text-2xl md:text-4xl group-hover:creative-grad-text transition-colors duration-300">
                  {e.company}
                </h3>
                <p className="text-[var(--muted)] mt-2 text-base md:text-lg">{e.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== 联系 巨型 CTA ===== */}
      <section id="contact" className="px-6 md:px-12 py-32 md:py-52">
        <Reveal>
          <p className="creative-mono text-[var(--muted)] mb-6">04 — 联系 / CONTACT</p>
          <h2 className="creative-display text-6xl md:text-[9vw] leading-[0.88]">
            一起做点
            <br />
            <span className="creative-grad-text">好玩的？</span>
          </h2>
        </Reveal>

        <div className="mt-12 flex flex-wrap items-center gap-6">
          <Magnetic>
            <a
              href={`mailto:${profile.email}`}
              data-cursor="hover"
              className="creative-display text-2xl md:text-4xl border-b-2 border-white pb-1 hover:creative-grad-text flex items-center gap-2 transition-colors"
            >
              <Mail size={28} className="hidden md:inline" />
              {profile.email}
            </a>
          </Magnetic>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          {SOCIALS.map(({ key, label, color }) => {
            const url = profile.social.find((s) => s.platform === key)?.url;
            if (!url) return null;
            return (
              <a
                key={key}
                href={url}
                data-cursor="hover"
                className="c-tag px-5 py-2.5 creative-mono text-sm flex items-center gap-2"
              >
                <span style={{ color }} className="inline-flex">
                  <SocialGlyph name={key} size={16} />
                </span>
                {label}
              </a>
            );
          })}
        </div>
      </section>

      {/* ===== 页脚 ===== */}
      <footer className="px-6 md:px-12 py-10 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 creative-mono text-xs text-[var(--muted)]">
        <span>© 2026 {profile.name} · {profile.role}</span>
        <span>用代码造东西 / BUILT WITH CODE</span>
      </footer>
    </div>
  );
}
