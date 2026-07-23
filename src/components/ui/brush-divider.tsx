"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface BrushDividerProps {
  className?: string;
}

export function BrushDivider({ className = "" }: BrushDividerProps) {
  const reduced = useReducedMotion();

  return (
    <div className={`flex justify-center py-2 ${className}`}>
      <motion.svg
        width="180"
        height="12"
        viewBox="0 0 180 12"
        fill="none"
        initial={reduced ? undefined : { scaleX: 0 }}
        whileInView={reduced ? undefined : { scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ transformOrigin: "center" }}
      >
        {/* 毛笔笔触：两端渐细 */}
        <path
          d="M5 6 Q20 2 40 5 Q60 8 90 6 Q120 4 140 7 Q160 10 175 6"
          stroke="var(--gold)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M10 6 Q30 3 50 5.5 Q80 9 110 6 Q140 3 160 6.5 Q170 8 175 6"
          stroke="var(--gold)"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
        />
        {/* 中间墨点 */}
        <circle
          cx="90"
          cy="6"
          r="2"
          fill="var(--gold)"
          opacity="0.4"
        />
      </motion.svg>
    </div>
  );
}
