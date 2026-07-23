"use client";

import { useState, useEffect } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // 1. 检查 localStorage 手动关闭标记
    const manualOff = localStorage.getItem("animations-disabled") === "true";
    if (manualOff) {
      setReduced(true);
      return;
    }

    // 2. 检查系统偏好
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
