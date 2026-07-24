"use client";

import { useState, useEffect } from "react";

export function useScrollSpy(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? "hero");

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      // 页面顶部 → 第一个区块
      if (window.scrollY < 100) {
        setActiveSection(sectionIds[0] ?? "hero");
        return;
      }

      // 页面底部 → 最后一个区块
      const scrollBottom = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= docHeight - 100) {
        setActiveSection(sectionIds[sectionIds.length - 1] ?? "hero");
        return;
      }

      // 从后往前找第一个进入视口上方的 section
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            setActiveSection(sectionIds[i]);
            return;
          }
        }
      }
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionIds.join(",")]);

  return activeSection;
}
