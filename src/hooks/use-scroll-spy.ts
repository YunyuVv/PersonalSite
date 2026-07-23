"use client";

import { useState, useEffect, useCallback } from "react";

const SECTION_IDS = ["hero", "about", "skills", "projects", "contact"];

export function useScrollSpy() {
  const [activeSection, setActiveSection] = useState("hero");

  const handleScroll = useCallback(() => {
    // 如果在页面顶部，激活 hero
    if (window.scrollY < 100) {
      setActiveSection("hero");
      return;
    }

    // 检查是否在页面底部
    const scrollBottom = window.scrollY + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    if (scrollBottom >= docHeight - 100) {
      setActiveSection("contact");
      return;
    }

    // 从后往前找第一个在视口上方的 section
    for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
      const el = document.getElementById(SECTION_IDS[i]);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4) {
          setActiveSection(SECTION_IDS[i]);
          return;
        }
      }
    }
  }, []);

  useEffect(() => {
    let ticking = false;
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
  }, [handleScroll]);

  return activeSection;
}
