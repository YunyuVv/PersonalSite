"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { SkillCategory, SkillItem } from "@/types/profile";

const AXIS_LABELS = ["语言", "前端", "后端", "基础设施", "工具"];

// 计算雷达图坐标
function getRadarPoint(
  value: number,
  maxValue: number,
  index: number,
  total: number,
  centerX: number,
  centerY: number,
  radius: number
): { x: number; y: number } {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const r = (value / maxValue) * radius;
  return {
    x: centerX + r * Math.cos(angle),
    y: centerY + r * Math.sin(angle),
  };
}

interface SkillRadarProps {
  skills: SkillCategory[];
  className?: string;
}

export function SkillRadar({ skills, className = "" }: SkillRadarProps) {
  const reduced = useReducedMotion();
  const [hoveredAxis, setHoveredAxis] = useState<number | null>(null);

  const centerX = 140;
  const centerY = 130;
  const radius = 100;
  const maxValue = 5;

  // 计算每个类别的平均分
  const scores = skills.map((cat) => {
    const avg =
      cat.items.reduce((sum, item) => sum + item.level, 0) / cat.items.length;
    return Math.round(avg * 10) / 10;
  });

  // 雷达多边形顶点
  const dataPoints = scores.map((score, i) =>
    getRadarPoint(score, maxValue, i, scores.length, centerX, centerY, radius)
  );
  const polygonPath = dataPoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ") + " Z";

  // 网格线
  const gridLevels = [1, 2, 3, 4, 5];

  return (
    <div className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ${className}`}>
      {/* 雷达图 */}
      <motion.svg
        width="280"
        height="260"
        viewBox="0 0 280 260"
        initial={reduced ? undefined : { opacity: 0, scale: 0.8 }}
        whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* 背景网格 */}
        {gridLevels.map((level) => {
          const gridPoints = Array.from({ length: scores.length }, (_, i) =>
            getRadarPoint(
              level,
              maxValue,
              i,
              scores.length,
              centerX,
              centerY,
              radius
            )
          );
          const gridPath =
            gridPoints
              .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
              .join(" ") + " Z";

          return (
            <path
              key={level}
              d={gridPath}
              fill="none"
              stroke="var(--divider)"
              strokeWidth="0.5"
              opacity="0.5"
            />
          );
        })}

        {/* 轴线 */}
        {scores.map((_, i) => {
          const angle =
            (Math.PI * 2 * i) / scores.length - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="var(--divider)"
              strokeWidth="0.5"
              opacity="0.3"
            />
          );
        })}

        {/* 数据区域 */}
        <motion.path
          d={polygonPath}
          fill="var(--accent)"
          fillOpacity="0.15"
          stroke="var(--accent)"
          strokeWidth="1.5"
          initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
          whileInView={
            reduced ? undefined : { pathLength: 1, opacity: 1 }
          }
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* 数据点 */}
        {dataPoints.map((point, i) => (
          <g key={i}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="var(--accent)"
              stroke="white"
              strokeWidth="2"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredAxis(i)}
              onMouseLeave={() => setHoveredAxis(null)}
            />
            {hoveredAxis === i && (
              <text
                x={point.x}
                y={point.y - 12}
                textAnchor="middle"
                fill="var(--accent)"
                fontSize="12"
                fontWeight="bold"
              >
                {scores[i]}
              </text>
            )}
          </g>
        ))}

        {/* 轴标签 */}
        {AXIS_LABELS.map((label, i) => {
          const angle =
            (Math.PI * 2 * i) / scores.length - Math.PI / 2;
          const labelR = radius + 24;
          const x = centerX + labelR * Math.cos(angle);
          const y = centerY + labelR * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={
                hoveredAxis === i
                  ? "var(--accent)"
                  : "var(--text-secondary)"
              }
              fontSize="12"
              fontFamily="var(--font-sans)"
              className="transition-colors cursor-pointer"
              onMouseEnter={() => setHoveredAxis(i)}
              onMouseLeave={() => setHoveredAxis(null)}
            >
              {label}
            </text>
          );
        })}
      </motion.svg>

      {/* 技能标签列表 */}
      <div className="flex-1 space-y-4">
        {skills.map((category, catIdx) => (
          <motion.div
            key={category.name}
            initial={reduced ? undefined : { opacity: 0, x: 20 }}
            whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catIdx * 0.1 }}
            className={`p-3 rounded-lg transition-colors ${
              hoveredAxis === catIdx
                ? "bg-[var(--accent)]/5 border border-[var(--accent)]/20"
                : "border border-transparent"
            }`}
            onMouseEnter={() => setHoveredAxis(catIdx)}
            onMouseLeave={() => setHoveredAxis(null)}
          >
            <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">
              {category.name}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {category.items.map((item) => (
                <SkillTag key={item.name} item={item} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SkillTag({ item }: { item: SkillItem }) {
  const levelColors = [
    "bg-[var(--bg-muted)] text-[var(--text-muted)]",
    "bg-[var(--bg-muted)] text-[var(--text-secondary)]",
    "bg-[var(--celadon)]/10 text-[var(--celadon)]",
    "bg-[var(--gold)]/15 text-[var(--gold-dark)]",
    "bg-[var(--accent)]/10 text-[var(--accent)]",
  ];

  return (
    <motion.span
      whileHover={{ scale: 1.08 }}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-default ${levelColors[item.level - 1]}`}
    >
      {item.name}
      {/* 熟练度小圆点 */}
      <span className="flex gap-0.5 ml-0.5">
        {Array.from({ length: item.level }, (_, i) => (
          <span
            key={i}
            className="w-1 h-1 rounded-full bg-current opacity-70"
          />
        ))}
      </span>
    </motion.span>
  );
}
