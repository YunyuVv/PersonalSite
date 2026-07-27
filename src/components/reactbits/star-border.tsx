"use client";

interface StarBorderProps {
  children?: React.ReactNode;
  className?: string;
  /** 星光颜色 */
  color?: string;
  /** 动画速度 */
  speed?: string;
  /** 边框厚度 px */
  thickness?: number;
  /** HTML 标签 */
  as?: React.ElementType;
  style?: React.CSSProperties;
}

/**
 * 星光边框 — 光点沿边框运动
 * 需要在 globals.css 中定义 star-movement 关键帧
 */
export function StarBorder({
  children,
  className = "",
  color = "var(--accent)",
  speed = "6s",
  thickness = 1,
  as: Component = "div",
  style = {},
}: StarBorderProps) {
  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-[20px] ${className}`}
      style={{ padding: `${thickness}px 0`, ...style }}
    >
      {/* 底部光点 */}
      <div
        className="absolute w-[300%] h-[50%] opacity-70 bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
        aria-hidden="true"
      />
      {/* 顶部光点 */}
      <div
        className="absolute w-[300%] h-[50%] opacity-70 top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed,
        }}
        aria-hidden="true"
      />
      {/* 内容层 */}
      <div className="relative z-[1]">
        {children}
      </div>
    </Component>
  );
}
