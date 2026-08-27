import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { getSiteConfig } from "@/lib/config";
import { SiteConfigProvider } from "@/lib/site-config-context";

const config = getSiteConfig();

export const metadata: Metadata = {
  metadataBase: new URL(config.siteConfig.url),
  title: config.siteConfig.title,
  description: config.siteConfig.description,
  openGraph: {
    title: config.siteConfig.title,
    description: config.siteConfig.description,
    url: config.siteConfig.url,
    siteName: config.name,
    images: [{ url: config.siteConfig.ogImage, width: 1200, height: 630 }],
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: config.siteConfig.title,
    description: config.siteConfig.description,
    images: [config.siteConfig.ogImage],
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
        {/* Inter + Noto Sans SC + Space Grotesk(展示) + JetBrains Mono(等宽) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+SC:wght@300;400;500;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: config.name,
              jobTitle: config.role,
              url: config.siteConfig.url,
              email: config.email,
              sameAs: Object.values(config.social).filter(Boolean),
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SiteConfigProvider value={config}>{children}</SiteConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
