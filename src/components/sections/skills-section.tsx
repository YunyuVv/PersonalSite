"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { SkillRadar } from "@/components/ui/skill-radar";
import { BrushDivider } from "@/components/ui/brush-divider";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import profile from "@/data/profile";

export function SkillsSection() {
  const reduced = useReducedMotion();

  return (
    <SectionWrapper id="skills" className="py-24 md:py-32">
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
          技能
        </h2>
        <BrushDivider />
      </motion.div>

      {/* 技能雷达图 */}
      <div className="flex justify-center">
        <SkillRadar skills={profile.skills} />
      </div>

      {/* 底部装饰文字 */}
      <motion.p
        className="text-center text-xs text-[var(--text-muted)] mt-12"
        initial={reduced ? undefined : { opacity: 0 }}
        whileInView={reduced ? undefined : { opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        hover 雷达图或右侧标签查看详情
      </motion.p>
    </SectionWrapper>
  );
}
