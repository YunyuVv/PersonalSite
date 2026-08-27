import { getSiteConfig } from "@/lib/config";
import { Reveal } from "@/components/ui/reveal";

export function ExperienceSection() {
  const config = getSiteConfig();
  const items = [
    ...config.experiences.map((e) => ({ type: "exp" as const, ...e })),
    ...config.education.map((e) => ({
      type: "edu" as const,
      company: e.school,
      role: `${e.degree} · ${e.major}`,
      startDate: String(e.startYear),
      endDate: String(e.endYear),
      highlights: [] as string[],
    })),
  ];

  return (
    <Reveal className="md:col-span-6 bento-card p-7 md:p-8">
      <span className="bento-label">经历 / Experience</span>

      <div className="mt-6 space-y-6">
        {items.map((item, i) => (
          <div
            key={i}
            className="relative pl-6 border-l border-[var(--divider)] last:border-l-transparent"
          >
            <span
              className="absolute left-0 top-1.5 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[var(--accent)] ring-4 ring-[var(--bg-card)]"
              aria-hidden
            />
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="text-base font-semibold text-[var(--text-primary)]">
                {item.company}
              </h3>
              <span className="text-xs text-[var(--text-muted)] font-mono">
                {item.startDate} – {item.endDate}
              </span>
            </div>
            <p className="text-sm text-[var(--accent)] font-medium mt-0.5">
              {item.role}
            </p>
            {item.highlights.length > 0 && (
              <ul className="mt-2 space-y-1">
                {item.highlights.map((hl, j) => (
                  <li
                    key={j}
                    className="text-sm text-[var(--text-secondary)] leading-relaxed flex gap-2"
                  >
                    <span className="text-[var(--text-muted)] mt-1">—</span>
                    {hl}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </Reveal>
  );
}
