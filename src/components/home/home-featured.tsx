import profile from "@/data/profile";
import { Reveal } from "@/components/ui/reveal";
import DriftWall from "@/components/ui/drift-wall";

/** 封面占位：远程图片直接用，本地/缺图则用渐变 + 首字占位（与参考项目一致风格）。 */
function coverImage(image: string, fallbackColor: string, char: string): string {
  if (image && /^https?:\/\//.test(image)) return image;
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
  const items = profile.projects.slice(0, 12).map((p) => {
    const initial = (p.name || "?").trim().charAt(0);
    return {
      image: coverImage(p.image, "#5b8def", initial),
      title: p.name,
      href: p.demoUrl || p.githubUrl,
      subtitle: p.tags.join(" · "),
      badge: p.tags[0],
      badgeColor: "#5b8def",
    };
  });

  return (
    <Reveal id="work" className="hm-section hm-hairline">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <span className="hm-eyebrow">精选作品 / Selected Work</span>
            <h2 className="hm-h2 mt-4">近期在做的一些东西</h2>
          </div>
        </div>

        {/* 漂移透视墙：无限滚动 + 悬停抬升，契合「精选作品」观感 */}
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
