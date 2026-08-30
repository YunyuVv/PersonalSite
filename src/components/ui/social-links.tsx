import profile from "@/data/profile";
import type { SocialLinkItem } from "@/types/profile";
import { getSocialLabel } from "@/lib/social-platforms";
import { getSocialBrand } from "@/lib/social-icons";

interface ResolvedIcon {
  Icon: (p: { size?: number }) => React.ReactElement;
  color: string;
  label: string;
}

/** 解析单个社交项：优先品牌图标，否则通用地球图标 */
function resolveIcon(item: SocialLinkItem): ResolvedIcon {
  const label = getSocialLabel(item.platform, item.label);
  const { Icon, color } = getSocialBrand(item.platform);
  return { Icon, color, label };
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
