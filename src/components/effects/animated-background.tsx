"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function AnimatedBackground() {
  const reduced = useReducedMotion();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* 光斑 1 — 右上 */}
      <div
        className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[var(--accent)] opacity-[0.04] dark:opacity-[0.08] ${
          reduced ? "" : "animate-[float_20s_ease-in-out_infinite]"
        }`}
      />
      {/* 光斑 2 — 左下 */}
      <div
        className={`absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-[var(--accent)] opacity-[0.03] dark:opacity-[0.06] ${
          reduced ? "" : "animate-[float_25s_ease-in-out_infinite_5s]"
        }`}
      />
      {/* 光斑 3 — 中右 */}
      <div
        className={`absolute top-1/2 -right-20 w-[350px] h-[350px] rounded-full bg-[var(--accent-light)] opacity-[0.02] dark:opacity-[0.04] ${
          reduced ? "" : "animate-[float_18s_ease-in-out_infinite_10s]"
        }`}
      />
    </div>
  );
}
