import profile from "@/data/profile";
import homepage from "@/data/homepage";
import { Reveal } from "@/components/ui/reveal";
import { BlurText } from "@/components/reactbits/blur-text";

export function HomeAbout() {
  return (
    <Reveal id="about" className="hm-section hm-hairline">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <span className="hm-eyebrow">关于 / About</span>
        <BlurText
          text={homepage.philosophy}
          className="hm-statement mt-6 max-w-4xl"
          animateBy="words"
          delay={0.06}
          stepDuration={0.4}
        />

        <dl className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-6">
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
              现居
            </dt>
            <dd className="mt-1.5 text-[var(--text-primary)] font-medium">
              {profile.location}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
              状态
            </dt>
            <dd className="mt-1.5 text-[var(--text-primary)] font-medium">
              {homepage.statusBadge}
            </dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
              专注
            </dt>
            <dd className="mt-1.5 text-[var(--text-primary)] font-medium">
              {homepage.focus.join(" · ")}
            </dd>
          </div>
        </dl>
      </div>
    </Reveal>
  );
}
