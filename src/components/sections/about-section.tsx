"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { Timeline } from "@/components/ui/timeline";
import { BrushDivider } from "@/components/ui/brush-divider";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import profile from "@/data/profile";

export function AboutSection() {
  const reduced = useReducedMotion();

  return (
    <SectionWrapper id="about" className="py-24 md:py-32">
      {/* 区域标题 */}
      <motion.div
        className="text-center mb-16"
        initial={reduced ? undefined : { opacity: 0, y: 20 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2
          className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          关于我
        </h2>
        <BrushDivider />
      </motion.div>

      {/* 自述文案 */}
      <motion.div
        className="max-w-2xl mx-auto mb-20"
        initial={reduced ? undefined : { opacity: 0, y: 20 }}
        whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {profile.bio.split("\n\n").map((paragraph, i) => (
          <p
            key={i}
            className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed mb-4 last:mb-0"
          >
            {paragraph}
          </p>
        ))}
      </motion.div>

      {/* 经历时间轴 */}
      <motion.div
        className="mb-12"
        initial={reduced ? undefined : { opacity: 0 }}
        whileInView={reduced ? undefined : { opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3
          className="text-xl font-semibold text-center text-[var(--text-primary)] mb-10"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          经历
        </h3>
        <Timeline
          experiences={profile.experiences}
          education={profile.education}
        />
      </motion.div>
    </SectionWrapper>
  );
}
