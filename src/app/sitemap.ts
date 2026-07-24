import type { MetadataRoute } from "next";
import profile from "@/data/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = profile.siteConfig.url;
  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/resume`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/creative`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
