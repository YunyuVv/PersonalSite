"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface Particle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speedY: number;
  speedX: number;
  life: number;
  maxLife: number;
}

interface InkParticlesProps {
  count?: number;
  className?: string;
}

/** 从 CSS 变量读取颜色并转为 RGB 分量 */
function getCSSVarRGB(varName: string): string {
  if (typeof document === "undefined") return "26, 26, 26";
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  // 尝试解析 hex 颜色 → RGB
  const hexMatch = value.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (hexMatch) {
    const r = parseInt(hexMatch[1], 16);
    const g = parseInt(hexMatch[2], 16);
    const b = parseInt(hexMatch[3], 16);
    return `${r}, ${g}, ${b}`;
  }
  // 解析 rgb(r, g, b) 格式
  const rgbMatch = value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    return `${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}`;
  }
  // fallback：浅色模式用深墨色，深色模式用浅色
  return document.documentElement.classList.contains("dark")
    ? "232, 224, 213"
    : "26, 26, 26";
}

export function InkParticles({
  count = 150,
  className = "",
}: InkParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const rgbRef = useRef("26, 26, 26");
  const reduced = useReducedMotion();
  // 监听主题变化
  const [, setTick] = useState(0);

  const createParticle = useCallback(
    (canvas: HTMLCanvasElement): Particle => {
      return {
        x: Math.random() * canvas.width,
        y: -10 - Math.random() * 50,
        radius: 1 + Math.random() * 5,
        opacity: 0.1 + Math.random() * 0.4,
        speedY: 0.3 + Math.random() * 0.8,
        speedX: (Math.random() - 0.5) * 0.5,
        life: 0,
        maxLife: 300 + Math.random() * 400,
      };
    },
    []
  );

  // 初始化时读取主题颜色
  useEffect(() => {
    rgbRef.current = getCSSVarRGB("--text-primary");

    // 监听 class 变化（深浅主题切换）
    const observer = new MutationObserver(() => {
      rgbRef.current = getCSSVarRGB("--text-primary");
      setTick((t) => t + 1);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener("resize", resize);

    // 初始化粒子
    const maxParticles = width < 768 ? Math.floor(count * 0.5) : count;
    particlesRef.current = [];

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, width, height);

      // 添加新粒子
      if (particlesRef.current.length < maxParticles) {
        if (Math.random() < 0.3) {
          particlesRef.current.push(createParticle(canvas));
        }
      }

      // 更新和绘制粒子
      const rgb = rgbRef.current;
      particlesRef.current = particlesRef.current.filter((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.life++;

        const lifeRatio = 1 - p.life / p.maxLife;
        const currentOpacity = p.opacity * Math.max(0, lifeRatio);

        if (p.life >= p.maxLife || currentOpacity <= 0.01) {
          return false;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${currentOpacity})`;
        ctx.fill();

        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [count, reduced, createParticle]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
