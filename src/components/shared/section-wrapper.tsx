"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
  /** 是否使用深色背景（Hero、Contact 等用深色） */
  dark?: boolean;
}

export function SectionWrapper({
  id,
  children,
  className = "",
  dark = false,
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const reduced = useReducedMotion();

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={reduced ? undefined : { opacity: 0, y: 30 }}
      animate={
        reduced
          ? undefined
          : isInView
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 30 }
      }
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative px-4 md:px-8 ${
        dark
          ? "bg-[var(--hero-bg)] text-[var(--hero-text)]"
          : "bg-[var(--bg-primary)] text-[var(--text-primary)]"
      } ${className}`}
    >
      <div className="mx-auto max-w-5xl">{children}</div>
    </motion.section>
  );
}
