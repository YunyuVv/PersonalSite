"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface MountainParallaxProps {
  className?: string;
}

export function MountainParallax({ className = "" }: MountainParallaxProps) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // 各层滚动速率
  const layer1Y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const layer2Y = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const layer3Y = useTransform(scrollYProgress, [0, 1], [0, 30]);

  // 鼠标驱动的 X 偏移（不同层不同速率）
  const layer2MouseX = useTransform(smoothMouseX, (v) => v * 1.5);
  const layer3MouseX = useTransform(smoothMouseX, (v) => v * 2);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x * 15);
    mouseY.set(y * 10);
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      onMouseMove={reduced ? undefined : handleMouseMove}
      aria-hidden="true"
    >
      {/* 层 1 — 远山 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        style={{
          y: reduced ? 0 : layer1Y,
          x: reduced ? 0 : smoothMouseX,
        }}
      >
        <svg
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: "50vh", minHeight: "300px" }}
        >
          <path
            d="M0 400 L0 280 Q100 200 250 260 Q400 320 550 240 Q700 160 850 220 Q1000 280 1150 200 Q1300 120 1440 180 L1440 400 Z"
            fill="var(--text-primary)"
            opacity="0.03"
          />
          <path
            d="M0 400 L0 300 Q200 240 400 290 Q600 340 800 270 Q1000 200 1200 250 Q1350 280 1440 240 L1440 400 Z"
            fill="var(--text-primary)"
            opacity="0.04"
          />
        </svg>
      </motion.div>

      {/* 层 2 — 中山 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        style={{
          y: reduced ? 0 : layer2Y,
          x: reduced ? 0 : layer2MouseX,
        }}
      >
        <svg
          viewBox="0 0 1440 350"
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: "40vh", minHeight: "250px" }}
        >
          <path
            d="M0 350 L0 240 Q150 180 300 220 Q500 280 650 200 Q800 120 1000 190 Q1200 260 1350 210 L1440 220 L1440 350 Z"
            fill="var(--text-primary)"
            opacity="0.06"
          />
          <path
            d="M0 350 L0 260 Q250 200 500 250 Q750 300 1000 230 Q1250 160 1440 200 L1440 350 Z"
            fill="var(--text-primary)"
            opacity="0.05"
          />
        </svg>
      </motion.div>

      {/* 层 3 — 近山 / 松枝 */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        style={{
          y: reduced ? 0 : layer3Y,
          x: reduced ? 0 : layer3MouseX,
        }}
      >
        <svg
          viewBox="0 0 1440 250"
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: "30vh", minHeight: "200px" }}
        >
          <path
            d="M0 250 L0 200 Q100 160 200 190 Q350 230 500 180 Q650 130 800 170 Q950 210 1100 160 Q1250 120 1440 150 L1440 250 Z"
            fill="var(--text-primary)"
            opacity="0.08"
          />
        </svg>
      </motion.div>

      {/* 云雾效果 */}
      <CloudDrift reduced={reduced} />
    </div>
  );
}

function CloudDrift({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0">
      {/* 云雾 1 */}
      <motion.div
        className="absolute"
        style={{ top: "15%", left: "-10%" }}
        animate={
          reduced
            ? undefined
            : { x: ["0%", "110%"], opacity: [0.2, 0.4, 0.2] }
        }
        transition={
          reduced
            ? undefined
            : { duration: 30, repeat: Infinity, ease: "linear" }
        }
      >
        <svg width="300" height="60" viewBox="0 0 300 60">
          <ellipse cx="150" cy="30" rx="140" ry="25" fill="var(--text-primary)" opacity="0.04" />
        </svg>
      </motion.div>

      {/* 云雾 2 */}
      <motion.div
        className="absolute"
        style={{ top: "35%", right: "-15%" }}
        animate={
          reduced
            ? undefined
            : { x: ["0%", "-110%"], opacity: [0.15, 0.35, 0.15] }
        }
        transition={
          reduced
            ? undefined
            : { duration: 40, repeat: Infinity, ease: "linear", delay: 5 }
        }
      >
        <svg width="350" height="50" viewBox="0 0 350 50">
          <ellipse cx="175" cy="25" rx="160" ry="20" fill="var(--text-primary)" opacity="0.05" />
        </svg>
      </motion.div>

      {/* 云雾 3 */}
      <motion.div
        className="absolute"
        style={{ top: "55%", left: "20%" }}
        animate={
          reduced
            ? undefined
            : { x: ["0%", "80%"], opacity: [0.1, 0.25, 0.1] }
        }
        transition={
          reduced
            ? undefined
            : { duration: 25, repeat: Infinity, ease: "linear", delay: 12 }
        }
      >
        <svg width="200" height="40" viewBox="0 0 200 40">
          <ellipse cx="100" cy="20" rx="90" ry="15" fill="var(--text-primary)" opacity="0.03" />
        </svg>
      </motion.div>
    </div>
  );
}
