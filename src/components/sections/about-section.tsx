"use client";

import profile from "@/data/profile";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/reactbits/spotlight-card";

export function AboutSection() {
  const paragraphs = profile.bio.split("\n\n").filter(Boolean);

  return (
    <Reveal id="about" className="md:col-span-3 bento-card flex flex-col">
      <SpotlightCard className="p-7 rounded-[var(--radius-card)] flex flex-col h-full" spotlightColor="rgba(91, 141, 239, 0.12)">
        <span className="bento-label">关于 / About</span>
        <div className="mt-4 space-y-3">
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="text-sm md:text-[15px] text-[var(--text-secondary)] leading-relaxed"
            >
              {para}
            </p>
          ))}
        </div>
      </SpotlightCard>
    </Reveal>
  );
}
