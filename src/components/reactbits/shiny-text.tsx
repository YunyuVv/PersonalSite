"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useAnimationFrame } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface ShinyTextProps {
  text: string;
  className?: string;
  /** 文字颜色 */
  color?: string;
  /** 光泽颜色 */
  shineColor?: string;
  /** 动画周期（秒） */
  speed?: number;
  /** 是否禁用动画 */
  disabled?: boolean;
  /** 光泽角度展开度 */
  spread?: number;
}

/**
 * 微光扫过文字效果 — 线性渐变动画
 */
export function ShinyText({
  text,
  className = "",
  color = "var(--text-secondary)",
  shineColor = "var(--accent-light)",
  speed = 3,
  disabled = false,
  spread = 120,
}: ShinyTextProps) {
  const reduced = useReducedMotion();
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  useAnimationFrame((time) => {
    if (disabled || reduced) {
      lastTimeRef.current = null;
      return;
    }
    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += delta;

    const cycleDuration = speed * 1000;
    const cycleTime = elapsedRef.current % cycleDuration;
    const p = (cycleTime / cycleDuration) * 100;
    progress.set(p);
  });

  const backgroundPosition = useTransform(
    progress,
    (p) => `${150 - p * 2.5}% center`
  );

  if (reduced || disabled) {
    return <span className={`inline-block ${className}`} style={{ color }}>{text}</span>;
  }

  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={{ ...gradientStyle, backgroundPosition }}
    >
      {text}
    </motion.span>
  );
}
