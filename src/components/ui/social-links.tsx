import profile from "@/data/profile";
import type { SocialLinks as SocialLinksType } from "@/types/profile";

/**
 * 官方品牌彩色图标库。
 * - color: 用于统一着色（GitHub 用 currentColor 跟随主题反色，浅色黑/深色白，与官网一致）
 * - svg:   品牌官方 SVG 路径（fill 用 currentColor 或固定品牌色）
 * 后续新增平台（LinkedIn / 掘金 / 知乎 / Twitter 等）只需在此追加一项，
 * 组件会自动渲染，无需改动其他逻辑。
 */
const BRAND: Partial<
  Record<
    keyof SocialLinksType,
    {
      label: string;
      color: string;
      svg: (p: { size?: number }) => React.ReactElement;
    }
  >
> = {
  github: {
    label: "GitHub",
    color: "var(--text-primary)", // 官方标记为黑色，随主题反色（浅色黑 / 深色白）
    svg: ({ size = 18 }) => (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  wechat: {
    label: "微信公众号",
    color: "#07C160", // 微信官方绿
    svg: ({ size = 18 }) => (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="#07C160"
        aria-hidden="true"
      >
        <path d="M8.69 4C4.64 4 1.35 6.66 1.35 9.94c0 1.78.99 3.36 2.55 4.45L3.1 16.2l2.4-1.24c.78.22 1.6.34 2.46.34.22 0 .43-.01.64-.03a5.4 5.4 0 0 1-.28-1.7c0-3.04 2.86-5.5 6.39-5.5.23 0 .46.01.68.03C14.9 6.02 12.08 4 8.69 4Zm-2.3 3.1a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm4.6 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z" />
        <path d="M22.65 14.06c0-2.78-2.66-5.04-5.94-5.04s-5.94 2.26-5.94 5.04 2.66 5.04 5.94 5.04c.7 0 1.38-.1 2-.29l1.92 1-.5-1.64c1.5-.95 2.46-2.39 2.46-4.11Zm-7.86-1.1a.72.72 0 1 1 0 1.44.72.72 0 0 1 0-1.44Zm3.84 0a.72.72 0 1 1 0 1.44.72.72 0 0 1 0-1.44Z" />
      </svg>
    ),
  },
  website: {
    label: "个人博客",
    color: "var(--accent)", // 个人站点，用主题强调色（苹果蓝）
    svg: ({ size = 18 }) => (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16zm2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" />
      </svg>
    ),
  },
};

interface SocialLinksProps {
  /** 社交数据，缺省使用 profile.social */
  social?: SocialLinksType;
  className?: string;
  iconSize?: number;
  /** icon: 圆形图标按钮；chip: 带文字标签的胶囊 */
  variant?: "icon" | "chip";
  targetBlank?: boolean;
}

/**
 * 社交媒体链接组件：只渲染已在 BRAND 库中登记了官方彩色图标的平台，
 * 缺字段或尚未登记图标的平台自动跳过。
 * 模块化、可复用：首页、简历页、页脚均可使用。
 */
export function SocialLinks({
  social = profile.social,
  className = "",
  iconSize = 18,
  variant = "icon",
  targetBlank = true,
}: SocialLinksProps) {
  const entries = (Object.entries(social) as [keyof SocialLinksType, string][]).filter(
    ([key, url]) => Boolean(url) && Boolean(BRAND[key])
  );

  if (entries.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {entries.map(([key, url]) => {
        const brand = BRAND[key]!;
        const Icon = brand.svg;
        const isChip = variant === "chip";
        return (
          <a
            key={key}
            href={url}
            {...(targetBlank ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            aria-label={brand.label}
            title={brand.label}
            className={
              isChip
                ? "inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm border border-[var(--divider)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                : "inline-flex items-center justify-center p-2.5 rounded-full hover:bg-[var(--bg-muted)] hover:scale-110 transition-all cursor-pointer"
            }
          >
            <span
              className="inline-flex items-center justify-center"
              style={{ color: brand.color }}
            >
              <Icon size={iconSize} />
            </span>
            {isChip && <span>{brand.label}</span>}
          </a>
        );
      })}
    </div>
  );
}
