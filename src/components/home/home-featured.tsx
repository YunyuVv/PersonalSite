"use client";

import { useSiteConfig } from "@/lib/site-config-context";
import { Reveal } from "@/components/ui/reveal";
import DriftWall from "@/components/ui/drift-wall";

/** 平台角标：用于墙砖左上角标识来源（与 VideoCard 保持一致） */
const PLATFORM_BADGE: Record<string, { label: string; color: string }> = {
  bilibili: { label: "B 站", color: "#FB7299" },
  douyin: { label: "抖音", color: "#161823" },
  youtube: { label: "YouTube", color: "#FF0000" },
  xiaohongshu: { label: "小红书", color: "#FF2442" },
  wechat: { label: "公众号", color: "#07C160" },
  weibo: { label: "微博", color: "#E6162D" },
  shipinhao: { label: "视频号", color: "#07C160" },
};

/** 生成渐变占位封面（与 VideoCard 风格一致）。
 *  当 config.contents[].cover 为真实可访问地址（如远程图床）时直接用 cover；
 *  本地 /images/contents/*.webp 尚未落盘，先用占位图。后续把文件放进
 *  public/images/contents/ 并保留该路径即可自动生效。 */
function coverImage(cover: string, fallbackColor: string, char: string): string {
  if (cover && /^https?:\/\//.test(cover)) return cover;
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
    `<stop offset='0' stop-color='${fallbackColor}' stop-opacity='0.9'/>` +
    `<stop offset='1' stop-color='#0b0b12'/>` +
    `</linearGradient></defs>` +
    `<rect width='600' height='400' fill='url(#g)'/>` +
    `<text x='50%' y='52%' font-size='220' font-family='sans-serif' font-weight='900' ` +
    `fill='#ffffff' fill-opacity='0.92' text-anchor='middle' dominant-baseline='central'>${char}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function HomeFeatured() {
  const config = useSiteConfig();
  const contents = config.contents.slice(0, 8);

  if (contents.length === 0) return null;

  const items = contents.map((c) => {
    const badge = PLATFORM_BADGE[c.platform] ?? { label: c.platform, color: "var(--accent)" };
    const initial = (c.title || "?").trim().charAt(0);
    return {
      image: coverImage(c.cover, badge.color, initial),
      title: c.title,
      href: c.url,
      subtitle: `${c.duration} · ${c.views} · ${c.date}`,
      badge: badge.label,
      badgeColor: badge.color,
    };
  });

  return (
    <Reveal id="work" className="hm-section hm-hairline">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <span className="hm-eyebrow">精选内容 / Featured Content</span>
            <h2 className="hm-h2 mt-4">近期最受关注的内容</h2>
          </div>
        </div>

        {/* 漂移透视墙：无限滚动 + 悬停抬升，契合「精选视频墙」观感 */}
        <div className="h-[560px] w-full overflow-hidden rounded-2xl">
          <DriftWall
            items={items}
            columns={3}
            tileWidth={200}
            tileHeight={132}
            gap={18}
            radius={14}
            tilt={16}
            turn={-14}
            roll={0}
            perspective={1200}
            depth={120}
            speed={16}
            variance={0.45}
            parallax={0.6}
            lift={64}
            fade={0.6}
            dim={0.55}
            overlayColor="#000000"
          />
        </div>
      </div>
    </Reveal>
  );
}
