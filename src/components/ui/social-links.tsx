import profile from "@/data/profile";
import type { SocialLinkItem } from "@/types/profile";
import { PLATFORM_CATALOG, getSocialLabel } from "@/lib/social-platforms";

type IconFn = (p: { size?: number }) => React.ReactElement;

/**
 * 通用地球图标：用于「个人网站 / 自定义」以及尚未登记品牌 SVG 的平台兜底。
 */
const Globe: IconFn = ({ size = 18 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.93 6h-2.95a15.6 15.6 0 0 0-1.38-3.56A8 8 0 0 1 18.93 8ZM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96ZM4.26 14c.16-.64.26-1.31.26-2s-.1-1.36-.26-2h3.38c.08.66.14 1.32.14 2 0 .68-.06 1.34-.14 2H4.26Zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.99 7.99 0 0 1 5.08 16Zm2.95-8H5.08a7.99 7.99 0 0 1 4.33-3.56A15.6 15.6 0 0 0 8.03 8ZM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96ZM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2Zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8 8 0 0 1-4.33 3.56ZM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38Z" />
  </svg>
);

/**
 * 品牌官方彩色图标库（核心平台）。
 * 仅维护几何简单、可准确绘制的品牌；其余平台统一用 Globe 兜底，
 * 配合 chip 变体的中文标签依然清晰可辨。新增平台图标只需在此追加。
 */
const BRAND: Partial<Record<string, { color: string; svg: IconFn }>> = {
  github: {
    color: "var(--text-primary)", // 随主题反色（浅色黑 / 深色白）
    svg: ({ size = 18 }) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  wechat: {
    color: "#07C160",
    svg: ({ size = 18 }) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="#07C160" aria-hidden="true">
        <path d="M8.69 4C4.64 4 1.35 6.66 1.35 9.94c0 1.78.99 3.36 2.55 4.45L3.1 16.2l2.4-1.24c.78.22 1.6.34 2.46.34.22 0 .43-.01.64-.03a5.4 5.4 0 0 1-.28-1.7c0-3.04 2.86-5.5 6.39-5.5.23 0 .46.01.68.03C14.9 6.02 12.08 4 8.69 4Zm-2.3 3.1a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm4.6 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z" />
        <path d="M22.65 14.06c0-2.78-2.66-5.04-5.94-5.04s-5.94 2.26-5.94 5.04 2.66 5.04 5.94 5.04c.7 0 1.38-.1 2-.29l1.92 1-.5-1.64c1.5-.95 2.46-2.39 2.46-4.11Zm-7.86-1.1a.72.72 0 1 1 0 1.44.72.72 0 0 1 0-1.44Zm3.84 0a.72.72 0 1 1 0 1.44.72.72 0 0 1 0-1.44Z" />
      </svg>
    ),
  },
  website: {
    color: "var(--accent)",
    svg: Globe,
  },
  linkedin: {
    color: "#0A66C2",
    svg: ({ size = 18 }) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="#0A66C2" aria-hidden="true">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
      </svg>
    ),
  },
  twitter: {
    color: "#000000",
    svg: ({ size = 18 }) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  youtube: {
    color: "#FF0000",
    svg: ({ size = 18 }) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="#FF0000" aria-hidden="true">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z" />
      </svg>
    ),
  },
  instagram: {
    color: "#E4405F",
    svg: ({ size = 18 }) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.8c-3.15 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.17-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.14.24 1.76.4 2.17.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.17a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.17-.4-1.24-.06-1.59-.07-4.74-.07zm0 3.06A4.98 4.98 0 1 1 7.02 12 4.98 4.98 0 0 1 12 6.98zm0 1.8a3.18 3.18 0 1 0 0 6.36 3.18 3.18 0 0 0 0-6.36zm5.18-.14a1.17 1.17 0 1 1-2.34 0 1.17 1.17 0 0 1 2.34 0z" />
      </svg>
    ),
  },
  telegram: {
    color: "#26A5E4",
    svg: ({ size = 18 }) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="#26A5E4" aria-hidden="true">
        <path d="M11.94 12.66l-1.64 1.55.42 2.64 1.02-1.04 1.6 1.1 2.6-3.86c.5-.74-.04-1.76-.93-1.65l-3.5.55 1.45-1.45-2.02.16zm9.18-6.2c.4.27.63.75.55 1.25-.38 2.34-1.9 8.06-2.66 10.67-.38 1.2-1.13 1.6-1.86 1.64-.8.06-1.4-.24-2.17-.62-1.2-.6-1.88-.98-3.04-1.56-1.35-.68-2.36-1.2-1.45-2.5.42-.58 2.96-2.7 3.1-2.94.03-.05.06-.26-.02-.37-.1-.12-.26-.08-.38-.04-.16.05-2.56 1.62-2.9 1.85-.12.09-.24.13-.43.07-.14-.05-.84-.31-1.57-.57-.62-.24-1.13-.37-1.09-.79.02-.23.34-.46.92-.71 3.56-1.55 5.94-2.58 7.12-3.08 3.4-1.42 4.1-1.66 4.56-1.67.1 0 .34.02.49.14.13.1.17.23.19.34.02.13.02.32.01.5z" />
      </svg>
    ),
  },
  facebook: {
    color: "#1877F2",
    svg: ({ size = 18 }) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="#1877F2" aria-hidden="true">
        <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
      </svg>
    ),
  },
  douyin: {
    color: "#000000",
    svg: ({ size = 18 }) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
        <path d="M16.5 3c.3 2.1 1.5 3.5 3.5 3.7v2.7c-1.3.1-2.5-.3-3.6-1v5.9c0 3.2-2.4 5.5-5.6 5.5-3 0-5.4-2.2-5.4-5 0-3 2.4-5.1 5.6-5.1.3 0 .7 0 1 .1v2.9c-.3-.1-.7-.2-1-.2-1.3 0-2.4 1-2.4 2.3 0 1.3 1 2.3 2.3 2.3 1.4 0 2.4-1.1 2.4-2.7V3h3.6z" />
      </svg>
    ),
  },
};

interface ResolvedIcon {
  Icon: IconFn;
  color: string;
  label: string;
}

/** 解析单个社交项：优先品牌图标，否则通用地球图标 */
function resolveIcon(item: SocialLinkItem): ResolvedIcon {
  const label = getSocialLabel(item.platform, item.label);
  const brand = BRAND[item.platform];
  if (brand) return { Icon: brand.svg, color: brand.color, label };
  // 其余平台 / 自定义：通用地球图标 + 品牌色（若目录有定义）
  const color = PLATFORM_CATALOG[item.platform]?.color ?? "var(--accent)";
  return { Icon: Globe, color, label };
}

interface SocialLinksProps {
  /** 社交数据，缺省使用 profile.social */
  social?: SocialLinkItem[];
  className?: string;
  iconSize?: number;
  /** icon: 圆形图标按钮；chip: 带文字标签的胶囊 */
  variant?: "icon" | "chip";
  targetBlank?: boolean;
}

/**
 * 社交媒体链接组件：渲染 profile.social 数组中的每一项。
 * 缺 url 的项自动跳过；图标缺失时回退到通用地球图标。
 * 模块化、可复用：首页、简历页、页脚、地图页均可使用。
 */
export function SocialLinks({
  social = profile.social,
  className = "",
  iconSize = 18,
  variant = "icon",
  targetBlank = true,
}: SocialLinksProps) {
  const items = (social ?? []).filter((s) => Boolean(s.url));
  if (items.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {items.map((item, i) => {
        const { Icon, color, label } = resolveIcon(item);
        const isChip = variant === "chip";
        return (
          <a
            key={i}
            href={item.url}
            {...(targetBlank ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            aria-label={label}
            title={label}
            className={
              isChip
                ? "inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm border border-[var(--divider)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                : "inline-flex items-center justify-center p-2.5 rounded-full hover:bg-[var(--bg-muted)] hover:scale-110 transition-all cursor-pointer"
            }
          >
            <span
              className="inline-flex items-center justify-center"
              style={{ color }}
            >
              <Icon size={iconSize} />
            </span>
            {isChip && <span>{label}</span>}
          </a>
        );
      })}
    </div>
  );
}
