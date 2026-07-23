"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Experience, Education } from "@/types/profile";

interface TimelineProps {
  experiences: Experience[];
  education: Education[];
  className?: string;
}

export function Timeline({
  experiences,
  education,
  className = "",
}: TimelineProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const allItems = [
    ...experiences.map((exp) => ({
      type: "experience" as const,
      ...exp,
    })),
    ...education.map((edu) => ({
      type: "education" as const,
      ...edu,
    })),
  ];

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* 竖线 */}
      <motion.div
        className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[var(--divider)] -translate-x-1/2"
        initial={reduced ? undefined : { scaleY: 0 }}
        animate={
          reduced
            ? undefined
            : isInView
              ? { scaleY: 1 }
              : { scaleY: 0 }
        }
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transformOrigin: "top" }}
      />

      <div className="space-y-8 md:space-y-0">
        {allItems.map((item, index) => {
          const isLeft = index % 2 === 0;

          return (
            <motion.div
              key={`${item.type}-${index}`}
              initial={
                reduced
                  ? undefined
                  : { opacity: 0, x: isLeft ? -30 : 30 }
              }
              animate={
                reduced
                  ? undefined
                  : isInView
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: isLeft ? -30 : 30 }
              }
              transition={{
                duration: 0.5,
                delay: index * 0.12,
                ease: "easeOut",
              }}
              className={`relative md:w-1/2 ${
                isLeft
                  ? "md:pr-12 md:ml-0 md:mr-auto"
                  : "md:pl-12 md:ml-auto md:mr-0"
              } pl-10 md:pl-0`}
            >
              {/* 时间轴节点 */}
              <div
                className={`absolute md:top-0 left-0 md:left-auto md:right-auto flex items-center justify-center ${
                  isLeft
                    ? "md:right-0 md:translate-x-1/2"
                    : "md:left-0 md:-translate-x-1/2"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full border-2 ${
                    item.type === "experience"
                      ? "border-[var(--accent)] bg-[var(--accent)]"
                      : "border-[var(--gold)] bg-[var(--gold)]"
                  }`}
                  style={{
                    boxShadow: `0 0 8px ${
                      item.type === "experience"
                        ? "var(--accent)"
                        : "var(--gold)"
                    }`,
                    opacity: 0.6,
                  }}
                />
              </div>

              {/* 内容卡片 */}
              <div
                className={`p-5 rounded-xl border border-[var(--divider)] bg-[var(--bg-card)] ${
                  isLeft ? "md:text-right" : "md:text-left"
                }`}
              >
                {/* 标签 */}
                <span
                  className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2 ${
                    item.type === "experience"
                      ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                      : "bg-[var(--gold)]/15 text-[var(--gold-dark)]"
                  }`}
                >
                  {item.type === "experience" ? "工作" : "教育"}
                </span>

                {/* 公司/学校 + 职位/学位 */}
                <h4 className="text-base font-semibold text-[var(--text-primary)]">
                  {item.type === "experience"
                    ? item.company
                    : item.school}
                </h4>
                <p className="text-sm text-[var(--text-secondary)] mb-2">
                  {item.type === "experience"
                    ? item.role
                    : `${item.degree} · ${"major" in item ? item.major : ""}`}
                </p>

                {/* 时间 */}
                <p className="text-xs text-[var(--text-muted)] mb-3">
                  {item.type === "experience"
                    ? `${item.startDate} – ${item.endDate}`
                    : `${item.startYear} – ${item.endYear}`}
                </p>

                {/* 要点 */}
                {"highlights" in item && item.highlights.length > 0 && (
                  <ul
                    className={`space-y-1 ${
                      isLeft ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    {item.highlights.map((hl, i) => (
                      <li
                        key={i}
                        className="text-sm text-[var(--text-secondary)] leading-relaxed"
                      >
                        {hl}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
