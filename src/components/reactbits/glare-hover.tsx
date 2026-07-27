"use client";

import { useRef } from "react";

interface GlareHoverProps {
  children?: React.ReactNode;
  className?: string;
  /** 光泽颜色 */
  glareColor?: string;
  /** 光泽不透明度 */
  glareOpacity?: number;
  /** 光泽角度 */
  glareAngle?: number;
  /** 光泽尺寸 % */
  glareSize?: number;
  /** 过渡时长 ms */
  transitionDuration?: number;
  style?: React.CSSProperties;
}

/**
 * 光泽悬停效果 — 鼠标进入时光泽从左下扫到右上
 */
export function GlareHover({
  children,
  className = "",
  glareColor = "#ffffff",
  glareOpacity = 0.15,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  style = {},
}: GlareHoverProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const hex = glareColor.replace("#", "");
  let rgba = glareColor;
  if (/^[\dA-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  }

  const animateIn = () => {
    const el = overlayRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.backgroundPosition = "-100% -100%, 0 0";
    el.style.transition = `${transitionDuration}ms ease`;
    el.style.backgroundPosition = "100% 100%, 0 0";
  };

  const animateOut = () => {
    const el = overlayRef.current;
    if (!el) return;
    el.style.transition = `${transitionDuration}ms ease`;
    el.style.backgroundPosition = "-100% -100%, 0 0";
  };

  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background: `linear-gradient(${glareAngle}deg, hsla(0,0%,0%,0) 60%, ${rgba} 70%, hsla(0,0%,0%,0) 100%)`,
    backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "-100% -100%, 0 0",
    pointerEvents: "none",
    borderRadius: "inherit",
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={style}
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
    >
      <div ref={overlayRef} style={overlayStyle} aria-hidden="true" />
      {children}
    </div>
  );
}
