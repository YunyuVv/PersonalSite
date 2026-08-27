"use client";

import { createContext, useContext } from "react";
import type { SiteConfig } from "./config";

const SiteConfigContext = createContext<SiteConfig | null>(null);

export function SiteConfigProvider({
  value,
  children,
}: {
  value: SiteConfig;
  children: React.ReactNode;
}) {
  return (
    <SiteConfigContext.Provider value={value}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): SiteConfig {
  const c = useContext(SiteConfigContext);
  if (!c) {
    throw new Error("useSiteConfig 必须在 SiteConfigProvider 内使用");
  }
  return c;
}
