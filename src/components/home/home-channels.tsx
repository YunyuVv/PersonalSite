"use client";

import { useSiteConfig } from "@/lib/site-config-context";
import { Reveal } from "@/components/ui/reveal";

/** 平台标识色（与 social-links BRAND 同源，用于卡片图标） */
const CHANNEL_COLOR: Record<string, string> = {
  bilibili: "#FB7299",
  douyin: "#FE2C55",
  youtube: "#FF0000",
  xiaohongshu: "#FF2442",
  wechat: "#07C160",
  weibo: "#E6162D",
};

export function HomeChannels() {
  const config = useSiteConfig();

  if (config.channels.length === 0 && config.credentials.length === 0) {
    return null;
  }

  return (
    <Reveal id="channels" className="hm-section hm-hairline">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <span className="hm-eyebrow">平台与数据 / Platforms &amp; Proof</span>
        <h2 className="hm-h2 mt-4">全平台内容矩阵</h2>

        {/* 平台矩阵入口 */}
        {config.channels.length > 0 && (
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {config.channels.map((ch) => {
              const color = CHANNEL_COLOR[ch.platform] ?? "var(--accent)";
              return (
                <a
                  key={ch.platform}
                  href={ch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bento-card rounded-2xl p-4 flex flex-col items-center text-center hover:-translate-y-1 transition-transform"
                >
                  <span
                    className="w-11 h-11 rounded-xl bg-[var(--bg-muted)] flex items-center justify-center text-lg font-bold"
                    style={{ color }}
                  >
                    {ch.name.charAt(0)}
                  </span>
                  <div className="mt-3 text-sm font-medium text-[var(--text-primary)]">
                    {ch.name}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[var(--text-muted)]">
                    {ch.followers} 粉丝
                  </div>
                  {ch.totalViews && (
                    <div className="text-[11px] text-[var(--text-muted)]">
                      {ch.totalViews} 播放
                    </div>
                  )}
                </a>
              );
            })}
          </div>
        )}

        {/* 资质 / 数据背书 */}
        {config.credentials.length > 0 && (
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {config.credentials.map((c) => (
              <div
                key={c.label}
                className="bento-card rounded-2xl p-5 text-center"
              >
                <div className="text-2xl font-bold text-[var(--accent)]">
                  {c.value}
                </div>
                <div className="text-sm text-[var(--text-primary)] mt-1">
                  {c.label}
                </div>
                {c.desc && (
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    {c.desc}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
}
