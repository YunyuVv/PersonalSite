"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// 直接复用 next-themes 的 useTheme，保持与原消费方（theme-toggle / nav / hero）的导入路径不变
export { useTheme } from "next-themes";
