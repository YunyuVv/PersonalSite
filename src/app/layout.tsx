import type { Metadata } from "next";
import "./globals.css";
import profile from "@/data/profile";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteConfig.url),
  title: profile.siteConfig.title,
  description: profile.siteConfig.description,
  openGraph: {
    title: profile.siteConfig.title,
    description: profile.siteConfig.description,
    url: profile.siteConfig.url,
    siteName: profile.name,
    images: [{ url: profile.siteConfig.ogImage, width: 1200, height: 630 }],
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: profile.siteConfig.title,
    description: profile.siteConfig.description,
    images: [profile.siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* 预连接 Google Fonts（字体按需加载） */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* 思源宋体 + 站酷小薇（国风字体） */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&family=Noto+Serif+SC:wght@400;600;700;900&family=ZCOOL+XiaoWei&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: profile.name,
              jobTitle: profile.role,
              url: profile.siteConfig.url,
              email: profile.email,
              sameAs: [
                profile.social.github,
                profile.social.linkedin,
                profile.social.juejin,
                profile.social.zhihu,
              ].filter(Boolean),
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
