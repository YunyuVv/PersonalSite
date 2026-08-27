import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/config";

// 静态导出要求显式声明缓存策略；sitemap 内容极少变化，两种模式下都用 force-static 固化即可
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteConfig().siteConfig.url;
  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
  ];
}
