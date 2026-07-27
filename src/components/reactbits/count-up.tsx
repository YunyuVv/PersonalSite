"use client";

import { useRef, useEffect, useCallback } from "react";
import { useMotionValue, useSpring, useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface CountUpProps {
  /** 目标数值 */
  to: number;
  /** 起始数值 */
  from?: number;
  /** 动画时长（秒） */
  duration?: number;
  /** 延迟（秒） */
  delay?: number;
  className?: string;
  /** 后缀文字，如 "+" */
  suffix?: string;
}

/**
 * 数字滚动计数 — 进入视口时从 from 滚动到 to
 */
export function CountUp({
  to,
  from = 0,
  duration = 2,
  delay = 0,
  className = "",
  suffix = "",
}: CountUpProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);
  const springValue = useSpring(motionValue, { damping, stiffness });

  const formatValue = useCallback((val: number) => {
    const isInt = Number.isInteger(to) && Number.isInteger(from);
    const formatted = isInt
      ? Math.round(val).toLocaleString()
      : val.toFixed(1);
    return formatted + suffix;
  }, [to, from, suffix]);

  // Set initial text
  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(from);
    }
  }, [from, formatValue]);

  // Trigger animation when in view
  useEffect(() => {
    if (isInView) {
      if (reduced) {
        if (ref.current) ref.current.textContent = formatValue(to);
        return;
      }
      const timeout = setTimeout(() => {
        motionValue.set(to);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isInView, reduced, to, delay, motionValue, formatValue]);

  // Listen for spring value changes
  useEffect(() => {
    const unsub = springValue.on("change", (latest: number) => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest);
      }
    });
    return () => unsub();
  }, [springValue, formatValue]);

  return <span className={className} ref={ref} />;
}
