"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface SplitTextProps {
  text: string;
  className?: string;
  /** 每个字母之间的延迟（秒） */
  delay?: number;
  /** 单个字母动画时长（秒） */
  duration?: number;
  /** HTML 标签 */
  tag?: "h1" | "h2" | "h3" | "p" | "span";
  /** 动画完成回调 */
  onComplete?: () => void;
}

/**
 * 逐字母入场动画 — framer-motion 轻量实现
 * 替代 reactbits 原版（GSAP SplitText 需要付费插件）
 */
export function SplitText({
  text,
  className = "",
  delay = 0.04,
  duration = 0.5,
  tag = "span",
  onComplete,
}: SplitTextProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [done, setDone] = useState(false);

  const letters = text.split("");

  useEffect(() => {
    if (!ref.current || reduced) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [reduced]);

  const Tag = tag as React.ElementType;

  if (reduced) {
    return (
      <Tag ref={ref} className={`inline-block ${className}`}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={`inline-block ${className}`} aria-label={text}>
      <AnimatePresence>
        {letters.map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={inView ? { opacity: 0, y: 30 } : { opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{
              duration,
              delay: i * delay,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={() => {
              if (i === letters.length - 1 && !done) {
                setDone(true);
                onComplete?.();
              }
            }}
            aria-hidden="true"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </AnimatePresence>
    </Tag>
  );
}
