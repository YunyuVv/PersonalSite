export type SocialCategory = "国内" | "国外" | "其他";

export interface PlatformMeta {
  /** 展示名称（下拉与选项共用） */
  label: string;
  /** 分组：国内 / 国外 / 其他 */
  category: SocialCategory;
  /** 品牌主色，仅用于图标着色参考；缺省使用主题强调色 */
  color?: string;
}

/**
 * 社交平台目录：覆盖国内外主流平台 + 个人网站 + 自定义。
 * 仅存放与渲染无关的元数据；品牌 SVG 图标在 social-links.tsx 中维护。
 * 新增平台只需在此追加一项，后台下拉与首页渲染会自动生效。
 */
export const PLATFORM_CATALOG: Record<string, PlatformMeta> = {
  // —— 国内 ——
  wechat: { label: "微信 / 公众号", category: "国内", color: "#07C160" },
  weibo: { label: "微博", category: "国内", color: "#E6162D" },
  zhihu: { label: "知乎", category: "国内", color: "#0066FF" },
  juejin: { label: "掘金", category: "国内", color: "#1E80FF" },
  csdn: { label: "CSDN", category: "国内", color: "#FC5531" },
  douyin: { label: "抖音", category: "国内", color: "#000000" },
  bilibili: { label: "哔哩哔哩", category: "国内", color: "#23A9F2" },
  xiaohongshu: { label: "小红书", category: "国内", color: "#FF2442" },
  toutiao: { label: "今日头条", category: "国内", color: "#EE2233" },
  gitee: { label: "Gitee", category: "国内", color: "#C71D23" },
  oschina: { label: "开源中国", category: "国内", color: "#3DAB53" },
  qq: { label: "QQ", category: "国内", color: "#12B7F5" },
  tieba: { label: "百度贴吧", category: "国内", color: "#2932E1" },
  douban: { label: "豆瓣", category: "国内", color: "#007722" },
  jianshu: { label: "简书", category: "国内", color: "#EA6F5A" },
  wangyiyun: { label: "网易云音乐", category: "国内", color: "#C20C0C" },
  cnblogs: { label: "博客园", category: "国内", color: "#2175BC" },

  // —— 国外 ——
  github: { label: "GitHub", category: "国外", color: "#181717" },
  linkedin: { label: "LinkedIn", category: "国外", color: "#0A66C2" },
  twitter: { label: "X (Twitter)", category: "国外", color: "#000000" },
  facebook: { label: "Facebook", category: "国外", color: "#1877F2" },
  instagram: { label: "Instagram", category: "国外", color: "#E4405F" },
  youtube: { label: "YouTube", category: "国外", color: "#FF0000" },
  telegram: { label: "Telegram", category: "国外", color: "#26A5E4" },
  discord: { label: "Discord", category: "国外", color: "#5865F2" },
  reddit: { label: "Reddit", category: "国外", color: "#FF4500" },
  medium: { label: "Medium", category: "国外", color: "#000000" },
  stackoverflow: { label: "Stack Overflow", category: "国外", color: "#F48024" },
  dribbble: { label: "Dribbble", category: "国外", color: "#EA4C89" },
  behance: { label: "Behance", category: "国外", color: "#1769FF" },
  twitch: { label: "Twitch", category: "国外", color: "#9146FF" },
  devto: { label: "Dev.to", category: "国外", color: "#0A0A0A" },

  // —— 其他 ——
  website: { label: "个人网站 / 博客", category: "其他", color: "var(--accent)" },
  custom: { label: "自定义链接", category: "其他", color: "var(--accent)" },
};

/** 下拉分组顺序 */
export const SOCIAL_CATEGORY_ORDER: SocialCategory[] = ["国内", "国外", "其他"];

/** 解析展示名：自定义平台用 label，未知平台回退到 id */
export function getSocialLabel(platform: string, customLabel?: string): string {
  if (platform === "custom") return customLabel?.trim() || "自定义链接";
  return PLATFORM_CATALOG[platform]?.label ?? platform;
}
