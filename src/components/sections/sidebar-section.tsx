"use client";

import { MapPin } from "lucide-react";
import profile from "@/data/profile";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/reactbits/count-up";

const STATS = [
  { value: 5, label: "年经验", suffix: "+" },
  { value: 20, label: "开源 PR", suffix: "+" },
  { value: 2000, label: "周下载", suffix: "+" },
];

const FOCUS = ["TypeScript", "React", "Next.js", "Node.js", "CI/CD"];

/**
 * 简历页侧栏 — 状态、数据、聚焦三个 Bento 卡片
 */
export function SidebarSection() {
  return (
    <div className="md:col-span-2 flex flex-col gap-4 md:gap-5">
      {/* 现状 */}
      <Reveal className="bento-card p-6">
        <span className="bento-label">现状 / Status</span>
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-[var(--text-primary)]">
            <MapPin size={16} className="text-[var(--accent)]" />
            <span className="text-sm font-medium">{profile.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse-soft" />
            <span className="text-sm text-[var(--text-secondary)]">
              求职状态：开放中
            </span>
          </div>
        </div>
      </Reveal>

      {/* 数据 */}
      <Reveal delay={0.05} className="bento-card p-6 flex-1">
        <span className="bento-label">数据 / Stats</span>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <CountUp
                to={s.value}
                from={0}
                duration={2}
                className="text-2xl font-bold text-[var(--text-primary)] tracking-tight"
                suffix={s.suffix}
              />
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* 聚焦 */}
      <Reveal delay={0.1} className="bento-card p-6">
        <span className="bento-label">聚焦 / Focus</span>
        <div className="mt-4 flex flex-wrap gap-2">
          {FOCUS.map((f) => (
            <span
              key={f}
              className="inline-flex items-center px-3 py-1 text-[13px] rounded-full bg-[var(--bg-muted)] text-[var(--text-primary)]"
            >
              {f}
            </span>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
