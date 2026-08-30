import type { ReactElement } from "react";
import { PLATFORM_CATALOG } from "./social-platforms";
import {
  SiBaidu,
  SiBehance,
  SiBluesky,
  SiBytedance,
  SiCsdn,
  SiDiscord,
  SiDouban,
  SiDribbble,
  SiFacebook,
  SiGithub,
  SiJuejin,
  SiMastodon,
  SiMedium,
  SiNeteasecloudmusic,
  SiQq,
  SiReddit,
  SiSinaweibo,
  SiStackoverflow,
  SiTelegram,
  SiThreads,
  SiTiktok,
  SiTwitch,
  SiWechat,
  SiX,
  SiXiaohongshu,
  SiYoutube,
  SiZhihu,
} from "react-icons/si";
import { FaBilibili, FaLinkedin } from "react-icons/fa6";
import { AppWindow, Link2 } from "lucide-react";

type IconComponent = React.ComponentType<{ size?: number | string; className?: string }>;
type IconFn = (p: { size?: number }) => ReactElement;

const makeIcon = (Comp: IconComponent): IconFn => {
  const Icon: IconFn = ({ size = 18 }) => <Comp size={size} />;
  return Icon;
};

/**
 * 通用地球图标：用于「个人网站 / 自定义」兜底。
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

/** 以平台名称首字作为图标的兜底方案（带品牌色圆形背景）。 */
function LetterIcon({ platform, size = 18 }: { platform: string; size?: number }) {
  const meta = PLATFORM_CATALOG[platform];
  const letter = (meta?.label ?? platform).charAt(0);
  const color = meta?.color ?? "var(--accent)";
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill={color} />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fill="#ffffff"
        fontSize={Math.round(size * 0.55)}
        fontWeight="bold"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {letter}
      </text>
    </svg>
  );
}

/** Gitee 官方 logo：红底白 G（取自 gitee.com/static/images/logo.svg）。 */
const GiteeIcon: IconFn = ({ size = 18 }) => (
  <svg viewBox="0 0 90 90" width={size} height={size} aria-hidden="true">
    <circle cx="44.8544363" cy="44.8544363" r="44.8544363" fill="#C71D23" />
    <path
      d="M67.558546,39.8714292 L42.0857966,39.8714292 C40.8627004,39.8720094 39.8710953,40.8633548 39.8701949,42.0864508 L39.8687448,47.623783 C39.867826,48.8471055 40.8592652,49.8390642 42.0825879,49.8393845 L57.5909484,49.838657 C58.8142711,49.8386283 59.8059783,50.830319 59.8059885,52.0536417 L59.8059701,53.161115 C59.8059701,56.8310831 56.8308731,59.80618 53.160905,59.80618 L32.1165505,59.80618 C30.8934034,59.806119 29.9018373,58.8145802 29.9017425,57.5914331 L29.9011625,36.5491188 C29.9008781,32.8791508 32.8758931,29.9039718 36.5458611,29.9038706 L67.5523638,29.9040538 C68.77515,29.9026795 69.7666266,28.9118177 69.7687593,27.6890325 L69.7721938,22.1516997 C69.774326,20.928378 68.7832423,19.9360642 67.5599198,19.9353054 L36.5479677,19.9366784 C27.3730474,19.9366784 19.935305,27.3744208 19.935305,36.549341 L19.935305,67.558546 C19.935305,68.7818687 20.927004,69.7735676 22.1503267,69.7735676 L54.8224984,69.7735676 C63.079746,69.7735676 69.7735676,63.079746 69.7735676,54.8224984 L69.7735676,42.0864509 C69.7735676,40.8631282 68.7818687,39.8714292 67.558546,39.8714292 Z"
      fill="#FFFFFF"
    />
  </svg>
);

/** 开源中国官方 logo：绿色 C 形图标（取自 static.oschina.net/new-osc/img/logo_new.svg）。 */
const OschinaIcon: IconFn = ({ size = 18 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
    <path
      d="M14.8015997,20.6197183 C11.6832252,20.6408451 9.14153634,18.6126761 8.9706665,14.8309859 C8.79979666,11.3028169 11.9181712,8.93661972 14.8870346,8.87323944 C18.3044314,8.78873239 20.3548695,12.6760563 20.3548695,12.6760563 L29.1760248,9.44366197 C29.1760248,9.44366197 25.5450408,0.0845070423 15.7200251,0.0845070423 C6.53577131,0.0845070423 0.192228568,6.42253521 0.192228568,15.0211268 C0.192228568,22.6690141 6.1726729,30.2957746 15.5064378,29.9577465 C25.7586281,29.5774648 29.2614598,20.5985915 29.2614598,20.5985915 L20.2053584,17.6197183 C20.2267171,17.5774648 18.3685076,20.6197183 14.8015997,20.6197183"
      fill="#3DAB53"
    />
  </svg>
);

/** 简书 logo：羽毛笔与书页剪影（取自 NViconsLib_Silhouette，CC BY-SA 4.0）。 */
const JianshuIcon: IconFn = ({ size = 18 }) => (
  <svg viewBox="0 0 31 32.031" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path
      d="M9.000,2.000 L7.686,2.442 L6.000,4.000 L12.000,4.000 L13.971,2.578 L16.206,4.884 L8.663,4.884 C10.060,5.518 10.874,6.060 11.108,6.512 C11.339,6.966 11.457,7.281 11.457,7.461 C11.457,7.644 11.363,7.915 11.177,8.275 C10.990,8.638 10.710,8.865 10.339,8.954 C9.966,9.045 9.732,8.774 9.641,8.140 C9.453,7.597 9.244,7.078 9.012,6.580 C8.779,6.084 8.384,5.518 7.825,4.884 L5.730,4.884 C5.077,5.426 4.333,6.152 3.495,7.054 C2.563,8.051 1.492,9.000 0.283,9.903 L0.003,9.496 C1.212,8.231 2.399,6.739 3.565,5.019 C4.728,3.303 5.590,1.628 6.149,-0.000 L9.000,2.000 ZM6.000,14.000 C5.547,24.453 5.509,27.101 6.000,31.000 L3.000,32.000 C3.091,27.842 3.000,24.205 3.000,20.000 C3.000,15.794 3.091,12.448 3.000,11.000 L7.000,12.000 L6.000,14.000 ZM5.870,8.004 C8.011,9.089 9.244,9.882 9.571,10.378 C9.896,10.876 10.060,11.307 10.060,11.667 C10.060,11.938 9.966,12.256 9.781,12.616 C9.593,12.979 9.313,13.250 8.943,13.430 C8.569,13.613 8.336,13.386 8.244,12.752 C8.056,12.209 7.777,11.578 7.406,10.853 C7.033,10.130 6.429,9.361 5.590,8.547 L5.870,8.004 ZM10.000,28.000 C10.414,24.710 10.303,21.857 10.000,19.000 C9.700,16.173 10.099,14.276 10.000,13.000 L12.419,14.300 L18.781,14.300 L19.689,12.829 L22.909,14.784 L21.000,16.000 C21.000,21.788 20.856,25.300 21.697,26.406 L19.000,27.000 L19.000,26.000 L12.000,26.000 L12.419,27.393 L10.000,28.000 ZM21.000,28.000 C22.676,28.180 23.302,28.953 24.000,29.000 C24.698,29.044 24.627,29.089 25.000,29.000 C25.371,28.909 26.000,28.543 26.000,28.000 L26.000,11.000 L16.000,11.000 C15.253,11.000 14.023,11.729 13.000,12.000 L12.016,10.039 L26.262,10.039 L27.519,8.818 L29.475,10.717 L28.000,12.000 L28.000,29.000 C28.000,29.631 28.078,29.686 27.799,30.185 C27.519,30.680 25.659,31.562 24.450,32.016 C24.077,30.659 22.446,29.710 19.562,29.167 L21.000,28.000 ZM12.000,15.000 L12.000,19.000 L19.000,19.000 L19.000,15.000 L12.000,15.000 ZM12.000,20.000 L12.000,25.000 L19.000,25.000 L19.000,20.000 L12.000,20.000 ZM21.793,1.899 L20.536,2.442 L20.000,4.000 L27.000,4.000 L28.777,2.578 L31.011,4.884 L21.793,4.884 C23.469,5.698 24.377,6.264 24.516,6.580 C24.656,6.898 24.726,7.146 24.726,7.326 C24.726,7.508 24.678,7.712 24.586,7.936 C24.492,8.163 24.328,8.367 24.097,8.547 C23.864,8.729 23.700,8.818 23.608,8.818 C23.421,8.818 23.259,8.661 23.120,8.343 C22.980,8.027 22.816,7.553 22.631,6.919 C22.443,6.376 21.978,5.698 21.234,4.884 L18.860,4.884 C17.463,6.332 15.972,7.688 14.390,8.954 L13.971,8.547 C15.368,7.010 16.507,5.450 17.393,3.866 C18.277,2.285 18.905,1.041 19.279,0.136 L21.793,1.899 Z"
      fillRule="evenodd"
    />
  </svg>
);

/** Instagram 官方渐变相机 glyph（紫→红→黄径向渐变）。 */
const InstagramIcon: IconFn = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <defs>
      <radialGradient id="ig-brand-gradient" cx="30%" cy="100%" r="95%">
        <stop offset="0%" stopColor="#FFD600" />
        <stop offset="40%" stopColor="#FF0100" />
        <stop offset="75%" stopColor="#D800B9" />
        <stop offset="100%" stopColor="#6368F5" />
      </radialGradient>
    </defs>
    <path
      fill="url(#ig-brand-gradient)"
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
    />
  </svg>
);

/**
 * 品牌图标映射（优先使用 react-icons 官方 SVG）。
 * 未覆盖到的平台（如开源中国、百度贴吧、豆瓣、简书、网易云音乐、博客园）
 * 会自动回落到 LetterIcon（首字 + 品牌色圆形）。
 */
const BRAND: Record<string, { color: string; Icon: IconFn }> = {
  // —— 国内 ——
  wechat: { color: "#07C160", Icon: makeIcon(SiWechat) },
  weibo: { color: "#E6162D", Icon: makeIcon(SiSinaweibo) },
  zhihu: { color: "#0084FF", Icon: makeIcon(SiZhihu) },
  juejin: { color: "#1E80FF", Icon: makeIcon(SiJuejin) },
  csdn: { color: "#FC5531", Icon: makeIcon(SiCsdn) },
  douban: { color: "#007722", Icon: makeIcon(SiDouban) },
  douyin: { color: "#000000", Icon: makeIcon(SiTiktok) },
  bilibili: { color: "#23A9F2", Icon: makeIcon(FaBilibili) },
  xiaohongshu: { color: "#FF2442", Icon: makeIcon(SiXiaohongshu) },
  gitee: { color: "#C71D23", Icon: GiteeIcon },
  oschina: { color: "#3DAB53", Icon: OschinaIcon },
  jianshu: { color: "#EA6F5A", Icon: JianshuIcon },
  tieba: { color: "#2932E1", Icon: makeIcon(SiBaidu) },
  toutiao: { color: "#EE2233", Icon: makeIcon(SiBytedance) },
  wangyiyun: { color: "#C20C0C", Icon: makeIcon(SiNeteasecloudmusic) },
  qq: { color: "#12B7F5", Icon: makeIcon(SiQq) },

  // —— 国外 ——
  github: { color: "#181717", Icon: makeIcon(SiGithub) },
  linkedin: { color: "#0A66C2", Icon: makeIcon(FaLinkedin) },
  twitter: { color: "#000000", Icon: makeIcon(SiX) },
  facebook: { color: "#1877F2", Icon: makeIcon(SiFacebook) },
  instagram: { color: "#D800B9", Icon: InstagramIcon },
  youtube: { color: "#FF0000", Icon: makeIcon(SiYoutube) },
  telegram: { color: "#26A5E4", Icon: makeIcon(SiTelegram) },
  discord: { color: "#5865F2", Icon: makeIcon(SiDiscord) },
  reddit: { color: "#FF4500", Icon: makeIcon(SiReddit) },
  medium: { color: "#000000", Icon: makeIcon(SiMedium) },
  stackoverflow: { color: "#F48024", Icon: makeIcon(SiStackoverflow) },
  dribbble: { color: "#EA4C89", Icon: makeIcon(SiDribbble) },
  behance: { color: "#1769FF", Icon: makeIcon(SiBehance) },
  twitch: { color: "#9146FF", Icon: makeIcon(SiTwitch) },
  threads: { color: "#000000", Icon: makeIcon(SiThreads) },
  bluesky: { color: "#0285FF", Icon: makeIcon(SiBluesky) },
  mastodon: { color: "#6364FF", Icon: makeIcon(SiMastodon) },
};

/** 个人网站 / 博客：lucide AppWindow 浏览器窗口图标。 */

/** 自定义链接：粗链条渐变环（自定义创作 SVG）。 */
const CustomLinkIcon: IconFn = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="none">
    <defs>
      <linearGradient id="cu-brand-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    </defs>
    <path
      d="M8.5 10.5a3.5 3.5 0 0 1 0-5l2-2a3.5 3.5 0 0 1 5 0"
      stroke="url(#cu-brand-gradient)"
      strokeWidth={2.6}
      strokeLinecap="round"
    />
    <path
      d="M15.5 13.5a3.5 3.5 0 0 1 0 5l-2 2a3.5 3.5 0 0 1-5 0"
      stroke="url(#cu-brand-gradient)"
      strokeWidth={2.6}
      strokeLinecap="round"
    />
  </svg>
);

export interface ResolvedBrand {
  color: string;
  Icon: IconFn;
}

/** 解析平台图标：优先 react-icons 品牌 SVG，无 SVG 时用平台首字 + 品牌色圆形兜底，website/custom 用地球。 */
export function getSocialBrand(platform: string): ResolvedBrand {
  const brand = BRAND[platform];
  if (brand) return { color: brand.color, Icon: brand.Icon };
  if (platform === "website") {
    return { color: "#8B5CF6", Icon: makeIcon(AppWindow) };
  }
  if (platform === "custom") {
    return { color: PLATFORM_CATALOG[platform]?.color ?? "var(--accent)", Icon: Globe };
  }
  const color = PLATFORM_CATALOG[platform]?.color ?? "var(--accent)";
  const Icon: IconFn = ({ size }) => <LetterIcon platform={platform} size={size} />;
  return { color, Icon };
}

export function SocialIcon({
  platform,
  size = 18,
  className,
}: {
  platform: string;
  size?: number;
  className?: string;
}) {
  const { color, Icon } = getSocialBrand(platform);
  return (
    <span className={className} style={{ color }} aria-hidden="true">
      <Icon size={size} />
    </span>
  );
}
