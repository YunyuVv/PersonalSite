import profile from "@/data/profile";
import { Reveal } from "@/components/ui/reveal";

export function SkillsSection() {
  return (
    <Reveal id="skills" className="md:col-span-3 bento-card p-7 flex flex-col">
      <span className="bento-label">技能 / Skills</span>
      <div className="mt-5 space-y-4">
        {profile.skills.map((cat) => (
          <div key={cat.name}>
            <p className="text-xs font-medium text-[var(--text-muted)] mb-2">
              {cat.name}
            </p>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((item) => (
                <span
                  key={item.name}
                  className="inline-flex items-center px-3 py-1 text-[13px] rounded-full bg-[var(--bg-muted)] text-[var(--text-primary)] border border-transparent hover:border-[var(--accent)] transition-colors"
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
