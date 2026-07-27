"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface DecryptedTextProps {
  text: string;
  /** 每次迭代间隔 ms */
  speed?: number;
  /** 最大迭代次数（非 sequential 模式） */
  maxIterations?: number;
  /** 逐字揭示 */
  sequential?: boolean;
  /** 揭示方向 */
  revealDirection?: "start" | "end" | "center";
  /** 加密字符集 */
  characters?: string;
  className?: string;
  /** 加密字符的 className */
  encryptedClassName?: string;
  /** 触发方式 */
  animateOn?: "view" | "hover" | "click";
}

/**
 * 文字解密效果 — 随机字符逐帧替换为真实文字
 */
export function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = true,
  revealDirection = "start",
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+0123456789",
  className = "",
  encryptedClassName = "",
  animateOn = "view",
}: DecryptedTextProps) {
  const reduced = useReducedMotion();
  const [displayText, setDisplayText] = useState(text);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const availableChars = useMemo(() => characters.split(""), [characters]);

  const shuffleText = useCallback(
    (original: string, revealed: Set<number>) => {
      return original
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (revealed.has(i)) return original[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join("");
    },
    [availableChars]
  );

  const startDecrypt = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setRevealedIndices(new Set());

    let currentIteration = 0;

    if (sequential) {
      const order: number[] = [];
      const len = text.length;
      if (revealDirection === "start") {
        for (let i = 0; i < len; i++) order.push(i);
      } else if (revealDirection === "end") {
        for (let i = len - 1; i >= 0; i--) order.push(i);
      } else {
        const mid = Math.floor(len / 2);
        let offset = 0;
        while (order.length < len) {
          if (offset % 2 === 0) {
            const idx = mid + offset / 2;
            if (idx >= 0 && idx < len) order.push(idx);
          } else {
            const idx = mid - Math.ceil(offset / 2);
            if (idx >= 0 && idx < len) order.push(idx);
          }
          offset++;
        }
      }

      let pointer = 0;
      intervalRef.current = setInterval(() => {
        if (pointer >= order.length) {
          clearInterval(intervalRef.current!);
          setIsAnimating(false);
          setDisplayText(text);
          return;
        }
        setRevealedIndices((prev) => {
          const next = new Set(prev);
          next.add(order[pointer]);
          setDisplayText(shuffleText(text, next));
          return next;
        });
        pointer++;
      }, speed);
    } else {
      intervalRef.current = setInterval(() => {
        currentIteration++;
        if (currentIteration >= maxIterations) {
          clearInterval(intervalRef.current!);
          setIsAnimating(false);
          setDisplayText(text);
          return;
        }
        setRevealedIndices((prev) => {
          setDisplayText(shuffleText(text, prev));
          return prev;
        });
      }, speed);
    }
  }, [isAnimating, text, sequential, revealDirection, speed, maxIterations, shuffleText]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Reduced motion: show plain text
  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  // View observer
  useEffect(() => {
    if (animateOn !== "view" || hasAnimated) return;
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          startDecrypt();
          setHasAnimated(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [animateOn, hasAnimated, startDecrypt]);

  const hoverHandlers =
    animateOn === "hover"
      ? { onMouseEnter: startDecrypt }
      : {};

  const clickHandlers =
    animateOn === "click" ? { onClick: startDecrypt } : {};

  return (
    <span
      ref={containerRef}
      className={`inline-block whitespace-pre-wrap ${className}`}
      {...hoverHandlers}
      {...clickHandlers}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char, i) => {
          const isRevealed = revealedIndices.has(i) || (!isAnimating && hasAnimated);
          return (
            <span key={i} className={isRevealed ? className : encryptedClassName}>
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
}
