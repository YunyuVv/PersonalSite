"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface TiltedCardProps {
  children?: React.ReactNode;
  className?: string;
  /** 容器高度 */
  containerHeight?: string;
  /** 容器宽度 */
  containerWidth?: string;
  /** hover 放大倍数 */
  scaleOnHover?: number;
  /** 最大倾斜角度 */
  rotateAmplitude?: number;
  /** 是否显示光泽 */
  showGlare?: boolean;
  style?: React.CSSProperties;
}

const SPRING = { damping: 30, stiffness: 100, mass: 2 };

/**
 * 3D 倾斜卡片 — 鼠标跟随透视变换 + 光泽反射
 */
export function TiltedCard({
  children,
  className = "",
  containerHeight = "300px",
  containerWidth = "100%",
  scaleOnHover = 1.03,
  rotateAmplitude = 12,
  showGlare = true,
  style = {},
}: TiltedCardProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), SPRING);
  const rotateY = useSpring(useMotionValue(0), SPRING);
  const scale = useSpring(1, SPRING);
  const glareX = useSpring(useMotionValue(50), SPRING);
  const glareY = useSpring(useMotionValue(50), SPRING);
  const glareOpacity = useSpring(useMotionValue(0), { damping: 40, stiffness: 200 });

  function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current || reduced) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);

    if (showGlare) {
      glareX.set(((e.clientX - rect.left) / rect.width) * 100);
      glareY.set(((e.clientY - rect.top) / rect.height) * 100);
      glareOpacity.set(0.2);
    }
  }

  function handleEnter() {
    if (reduced) return;
    scale.set(scaleOnHover);
  }

  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    glareOpacity.set(0);
  }

  if (reduced) {
    return (
      <div
        ref={ref}
        className={className}
        style={{ height: containerHeight, width: containerWidth, ...style }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`relative [perspective:800px] flex items-center justify-center ${className}`}
      style={{ height: containerHeight, width: containerWidth, ...style }}
      onMouseMove={handleMouse}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d] rounded-[var(--radius-card)]"
        style={{ rotateX, rotateY, scale }}
      >
        {children}

        {/* 光泽层 */}
        {showGlare && (
          <motion.div
            className="absolute inset-0 rounded-[inherit] pointer-events-none"
            style={{
              opacity: glareOpacity,
              background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.25), transparent 60%)`,
              backgroundSize: "200% 200%",
              transform: "translateZ(1px)",
            }}
            aria-hidden="true"
          />
        )}
      </motion.div>
    </div>
  );
}
