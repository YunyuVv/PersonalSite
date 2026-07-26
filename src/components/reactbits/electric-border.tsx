"use client";

/**
 * ElectricBorder — 电弧发光边框 (Canvas 2D)
 *
 * 来源: react-bits.dev (ElectricBorder)
 * 适配: 项目约定 (named export, useReducedMotion, aria-hidden)
 *
 * 使用示例:
 *   <ElectricBorder color="#5b8def" speed={1} borderRadius={16}>
 *     <div className="p-6">卡片内容</div>
 *   </ElectricBorder>
 */

import React, { useEffect, useRef, useCallback } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/* ─── Types ────────────────────────────────────── */

interface ElectricBorderProps {
  children?: ReactNode;
  /** 边框颜色 (hex/rgb/hsl) */
  color?: string;
  /** 动画速度倍率 */
  speed?: number;
  /** 扭曲强度 (0=无扭曲) */
  chaos?: number;
  /** 圆角 (px) */
  borderRadius?: number;
  /** 自定义 className */
  className?: string;
  /** 内联样式 */
  style?: CSSProperties;
}

/* ─── Helpers ──────────────────────────────────── */

function hexToRgba(hex: string, alpha: number = 1): string {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const int = parseInt(h.slice(0, 6), 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/* ─── Component ────────────────────────────────── */

export function ElectricBorder({
  children,
  color = "#5227FF",
  speed = 1,
  chaos = 0.12,
  borderRadius = 24,
  className,
  style,
}: ElectricBorderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const reduced = useReducedMotion();

  const random = useCallback((x: number): number => {
    return (Math.sin(x * 12.9898) * 43758.5453) % 1;
  }, []);

  const noise2D = useCallback(
    (x: number, y: number): number => {
      const i = Math.floor(x);
      const j = Math.floor(y);
      const fx = x - i;
      const fy = y - j;

      const a = random(i + j * 57);
      const b = random(i + 1 + j * 57);
      const c = random(i + (j + 1) * 57);
      const d = random(i + 1 + (j + 1) * 57);

      const ux = fx * fx * (3.0 - 2.0 * fx);
      const uy = fy * fy * (3.0 - 2.0 * fy);

      return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
    },
    [random]
  );

  const octavedNoise = useCallback(
    (
      x: number, octaves: number, lacunarity: number, gain: number,
      baseAmplitude: number, baseFrequency: number, time: number,
      seed: number, baseFlatness: number
    ): number => {
      let y = 0;
      let amplitude = baseAmplitude;
      let frequency = baseFrequency;

      for (let i = 0; i < octaves; i++) {
        let octaveAmplitude = amplitude;
        if (i === 0) octaveAmplitude *= baseFlatness;
        y += octaveAmplitude * noise2D(frequency * x + seed * 100, time * frequency * 0.3);
        frequency *= lacunarity;
        amplitude *= gain;
      }

      return y;
    },
    [noise2D]
  );

  const getCornerPoint = useCallback(
    (cx: number, cy: number, r: number, start: number, arc: number, p: number) => ({
      x: cx + r * Math.cos(start + p * arc),
      y: cy + r * Math.sin(start + p * arc),
    }),
    []
  );

  const getRoundedRectPoint = useCallback(
    (t: number, left: number, top: number, w: number, h: number, r: number) => {
      const sw = w - 2 * r;
      const sh = h - 2 * r;
      const ca = (Math.PI * r) / 2;
      const total = 2 * sw + 2 * sh + 4 * ca;
      const d = t * total;
      let acc = 0;

      if (d <= acc + sw) return { x: left + r + ((d - acc) / sw) * sw, y: top };
      acc += sw;
      if (d <= acc + ca) return getCornerPoint(left + w - r, top + r, r, -Math.PI / 2, Math.PI / 2, (d - acc) / ca);
      acc += ca;
      if (d <= acc + sh) return { x: left + w, y: top + r + ((d - acc) / sh) * sh };
      acc += sh;
      if (d <= acc + ca) return getCornerPoint(left + w - r, top + h - r, r, 0, Math.PI / 2, (d - acc) / ca);
      acc += ca;
      if (d <= acc + sw) return { x: left + w - r - ((d - acc) / sw) * sw, y: top + h };
      acc += sw;
      if (d <= acc + ca) return getCornerPoint(left + r, top + h - r, r, Math.PI / 2, Math.PI / 2, (d - acc) / ca);
      acc += ca;
      if (d <= acc + sh) return { x: left, y: top + h - r - ((d - acc) / sh) * sh };
      acc += sh;
      return getCornerPoint(left + r, top + r, r, Math.PI, Math.PI / 2, (d - acc) / ca);
    },
    [getCornerPoint]
  );

  /* Canvas 动画循环 */
  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const octaves = 10;
    const lacunarity = 1.6;
    const gain = 0.7;
    const amplitude = chaos;
    const frequency = 10;
    const displacement = 60;
    const borderOffset = 60;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const w = rect.width + borderOffset * 2;
      const h = rect.height + borderOffset * 2;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      return { w, h };
    };

    let { w, h } = updateSize();
    let lastDpr = Math.min(window.devicePixelRatio || 1, 2);

    const draw = (currentTime: number) => {
      if (!canvas || !ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (dpr !== lastDpr) {
        lastDpr = dpr;
        const sz = updateSize();
        w = sz.w;
        h = sz.h;
      }

      const dt = (currentTime - lastFrameTimeRef.current) / 1000;
      timeRef.current += dt * speed;
      lastFrameTimeRef.current = currentTime;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const left = borderOffset;
      const top = borderOffset;
      const bw = w - 2 * borderOffset;
      const bh = h - 2 * borderOffset;
      const maxR = Math.min(bw, bh) / 2;
      const r = Math.min(borderRadius, maxR);

      const perim = 2 * (bw + bh) + 2 * Math.PI * r;
      const samples = Math.floor(perim / 2);

      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const p = i / samples;
        const pt = getRoundedRectPoint(p, left, top, bw, bh, r);

        const xn = octavedNoise(p * 8, octaves, lacunarity, gain, amplitude, frequency, timeRef.current, 0, 0);
        const yn = octavedNoise(p * 8, octaves, lacunarity, gain, amplitude, frequency, timeRef.current, 1, 0);

        const dx = pt.x + xn * displacement;
        const dy = pt.y + yn * displacement;

        if (i === 0) ctx.moveTo(dx, dy);
        else ctx.lineTo(dx, dy);
      }

      ctx.closePath();
      ctx.stroke();
      animationRef.current = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(() => {
      const sz = updateSize();
      w = sz.w;
      h = sz.h;
    });
    ro.observe(container);

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      ro.disconnect();
    };
  }, [color, speed, chaos, borderRadius, octavedNoise, getRoundedRectPoint, reduced]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-visible isolate ${className ?? ""}`}
      style={{ "--electric-border-color": color, borderRadius, ...style } as CSSProperties}
    >
      {/* Canvas 电弧 */}
      {!reduced && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[2]">
          <canvas ref={canvasRef} className="block" aria-hidden="true" />
        </div>
      )}

      {/* 静态辉光层 (始终渲染) */}
      <div className="absolute inset-0 rounded-[inherit] pointer-events-none z-0">
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{ border: `2px solid ${hexToRgba(color, 0.6)}`, filter: "blur(1px)" }}
        />
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{ border: `2px solid ${color}`, filter: "blur(4px)" }}
        />
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none -z-[1] scale-110 opacity-30"
          style={{
            filter: "blur(32px)",
            background: `linear-gradient(-30deg, ${color}, transparent, ${color})`,
          }}
        />
      </div>

      {/* 内容层 */}
      <div className="relative rounded-[inherit] z-[1]">{children}</div>
    </div>
  );
}
