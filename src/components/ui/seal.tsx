"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface SealProps {
  name: string;
  className?: string;
}

export function Seal({ name, className = "" }: SealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? undefined : { scale: 0, rotate: -45 }}
      whileInView={reduced ? undefined : { scale: 1, rotate: [-2, 1, -1, 0] }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        className="overflow-visible"
        aria-label={`${name}印章`}
      >
        {/* 外框 */}
        <rect
          x="3"
          y="3"
          width="74"
          height="74"
          rx="6"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
        />
        {/* 内框 */}
        <rect
          x="9"
          y="9"
          width="62"
          height="62"
          rx="3"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1"
          opacity="0.6"
        />
        {/* 名字（竖排两字） */}
        <text
          x="40"
          y="34"
          textAnchor="middle"
          fill="var(--accent)"
          fontSize="22"
          fontWeight="bold"
          fontFamily="var(--font-serif)"
          letterSpacing="4"
        >
          {name.length >= 2 ? name.slice(0, 2) : name}
        </text>
        {/* 第三个字（如果有） */}
        {name.length >= 3 && (
          <text
            x="40"
            y="56"
            textAnchor="middle"
            fill="var(--accent)"
            fontSize="16"
            fontFamily="var(--font-serif)"
            letterSpacing="2"
          >
            {name.slice(2)}
          </text>
        )}
        {/* "印" 字 */}
        <text
          x="40"
          y={name.length >= 3 ? "72" : "62"}
          textAnchor="middle"
          fill="var(--accent)"
          fontSize="11"
          fontFamily="var(--font-serif)"
          opacity="0.7"
        >
          印
        </text>
      </svg>
    </motion.div>
  );
}
