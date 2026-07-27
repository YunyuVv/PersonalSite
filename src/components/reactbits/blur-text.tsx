"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface BlurTextProps {
  text: string;
  className?: string;
  /** 每个词/字母之间的延迟（秒） */
  delay?: number;
  /** 按词还是按字母 */
  animateBy?: "words" | "letters";
  /** 入场方向 */
  direction?: "top" | "bottom";
  /** 单步动画时长 */
  stepDuration?: number;
}

/**
 * 模糊到清晰的入场文字动画
 */
export function BlurText({
  text,
  className = "",
  delay = 0.08,
  animateBy = "words",
  direction = "bottom",
  stepDuration = 0.4,
}: BlurTextProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const [inView, setInView] = useState(false);

  const elements = animateBy === "words" ? text.split(" ") : text.split("");

  useEffect(() => {
    if (!ref.current) return;
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
  }, []);

  const yStart = direction === "top" ? -20 : 20;

  if (reduced) {
    return <p ref={ref} className={className}>{text}</p>;
  }

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`}>
      {elements.map((segment, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{ filter: "blur(8px)", opacity: 0, y: yStart }}
          animate={
            inView
              ? { filter: "blur(0px)", opacity: 1, y: 0 }
              : { filter: "blur(8px)", opacity: 0, y: yStart }
          }
          transition={{
            duration: stepDuration,
            delay: index * delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ willChange: "transform, filter, opacity" }}
        >
          {segment === " " ? "\u00A0" : segment}
          {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </p>
  );
}
