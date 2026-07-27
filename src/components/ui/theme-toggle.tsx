"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * 三态主题切换按钮：浅色 → 深色 → 跟随系统
 * 基于 next-themes，与 shadcn/ui 共用 .dark 类 + theme 存储键
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // 循环切换：system → light → dark → system
  const cycle = () => {
    if (theme === "system") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("system");
  };

  // 图标 & aria-label
  const icon = !mounted ? null : theme === "dark" ? <Sun size={16} /> : theme === "light" ? <Moon size={16} /> : <Monitor size={16} />;

  const label = !mounted
    ? "切换主题"
    : theme === "dark"
      ? "切换到浅色模式"
      : theme === "light"
        ? "切换到深色模式"
        : "跟随系统";

  return (
    <button
      onClick={cycle}
      className={`p-2 rounded-full glass text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer ${className}`}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}
