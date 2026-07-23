"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { MountainParallax } from "@/components/effects/mountain-parallax";
import { InkParticles } from "@/components/effects/ink-particles";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import profile from "@/data/profile";

export function HeroSection() {
  const reduced = useReducedMotion();
  const [taglineDone, setTaglineDone] = useState(false);

  const nameChars = profile.name.split("");

  // Tagline 打字效果
  const [displayedTagline, setDisplayedTagline] = useState("");
  useEffect(() => {
    if (reduced) {
      setDisplayedTagline(profile.tagline);
      setTaglineDone(true);
      return;
    }

    let i = 0;
    const tagline = profile.tagline;
    const timer = setInterval(() => {
      if (i < tagline.length) {
        setDisplayedTagline(tagline.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setTaglineDone(true);
      }
    }, 80);
    return () => clearInterval(timer);
  }, [reduced]);

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative h-screen min-h-[650px] flex items-center justify-center overflow-hidden bg-[var(--hero-bg)]"
    >
      {/* 背景：山脉视差 */}
      <MountainParallax />

      {/* 背景：墨点粒子 */}
      <InkParticles count={150} />

      {/* 暗色蒙版确保文字可读 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--hero-bg)]/80" />

      {/* 内容层 */}
      <div className="relative z-10 text-center px-4">
        {/* 角色标签 */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block text-xs md:text-sm font-medium text-[var(--gold)] tracking-[0.2em] uppercase mb-6 px-4 py-1.5 border border-[var(--gold)]/30 rounded-full">
            {profile.role}
          </span>
        </motion.div>

        {/* 姓名 */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-wider">
          {nameChars.map((char, i) => (
            <motion.span
              key={i}
              initial={
                reduced
                  ? undefined
                  : { opacity: 0, y: 30 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.3 + i * 0.08,
                ease: "easeOut",
              }}
              className="inline-block text-[var(--hero-text)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        {/* Tagline — 打字机效果 */}
        <motion.p
          initial={reduced ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-lg md:text-xl text-[var(--hero-text-muted)] mb-12 font-light tracking-wide h-8"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {displayedTagline}
          {!taglineDone && !reduced && (
            <span className="inline-block w-0.5 h-5 bg-[var(--gold)] ml-0.5 animate-pulse align-middle" />
          )}
        </motion.p>

        {/* 向下提示 */}
        <motion.button
          initial={reduced ? undefined : { opacity: 0 }}
          animate={
            taglineDone || reduced ? { opacity: 1 } : { opacity: 0 }
          }
          transition={{ delay: 0.5, duration: 0.5 }}
          onClick={scrollToAbout}
          className="mx-auto flex flex-col items-center gap-2 text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors cursor-pointer"
          aria-label="向下滚动"
        >
          <span className="text-xs tracking-widest">了解更多</span>
          <motion.div
            animate={
              reduced ? undefined : { y: [0, 6, 0] }
            }
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
}
