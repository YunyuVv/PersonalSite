import { ArrowDown, Mail } from "lucide-react";
import profile from "@/data/profile";
import { Reveal } from "@/components/ui/reveal";

export function HeroSection() {
  const p = profile;

  return (
    <Reveal className="md:col-span-4 bento-card p-8 md:p-10 flex flex-col justify-between min-h-[360px]">
      <div>
        <span className="inline-flex items-center gap-2 text-xs font-medium text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse-soft" />
          开放新机会
        </span>

        <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.05]">
          {p.name}
        </h1>
        <p className="mt-3 text-xl md:text-2xl text-[var(--text-secondary)] font-medium">
          {p.role}
        </p>
        <p className="mt-4 text-base md:text-lg text-[var(--text-secondary)] max-w-md leading-relaxed">
          {p.tagline}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="#contact"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--accent)] text-[var(--text-on-accent)] text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Mail size={16} />
          联系我
        </a>
        <a
          href="#projects"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[var(--divider)] text-[var(--text-primary)] text-sm font-medium hover:border-[var(--accent)] transition-colors cursor-pointer"
        >
          查看项目
          <ArrowDown size={16} />
        </a>
      </div>
    </Reveal>
  );
}
