"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/** 明暗主题切换按钮，基于 next-themes（与 shadcn/ui 共用 .dark 类 + theme 存储键） */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes 在挂载后才得知真实主题，避免 SSR/CSR 不一致
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`p-2 rounded-full glass text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer ${className}`}
      aria-label={mounted ? (isDark ? "切换到浅色模式" : "切换到深色模式") : "切换主题"}
    >
      {mounted ? (
        isDark ? (
          <Sun size={16} />
        ) : (
          <Moon size={16} />
        )
      ) : null}
    </button>
  );
}
