import profile from "@/data/profile";
import { Reveal } from "@/components/ui/reveal";

export function AboutSection() {
  const paragraphs = profile.bio.split("\n\n").filter(Boolean);

  return (
    <Reveal id="about" className="md:col-span-3 bento-card p-7 flex flex-col">
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
    </Reveal>
  );
}
