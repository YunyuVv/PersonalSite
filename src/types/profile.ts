export interface SocialLinkItem {
  /** 平台标识，对应 PLATFORM_CATALOG 的 key；"custom" 表示自定义 */
  platform: string;
  /** 自定义平台的展示名（platform === "custom" 时必填） */
  label?: string;
  /** 链接地址 */
  url: string;
}

/** 平台矩阵：用于展示各内容平台入口与数据背书 */
export interface Channel {
  /** 平台标识，匹配 PLATFORM_CATALOG 的 key（如 "bilibili"） */
  platform: string;
  /** 平台中文名，如「哔哩哔哩」 */
  name: string;
  /** 主页链接 */
  url: string;
  /** 粉丝数展示文案，如「12.8万」 */
  followers: string;
  /** 总播放 / 阅读量展示文案，如「3200万+」 */
  totalViews?: string;
}

/** 精选视频 / 内容 */
export interface ContentItem {
  id: string;
  /** 标题 */
  title: string;
  /** 封面图地址 */
  cover: string;
  /** 平台标识，匹配 BRAND 的 key（如 "bilibili"） */
  platform: string;
  /** 播放量展示文案，如「86万」 */
  views: string;
  /** 时长展示文案，如「12:30」 */
  duration: string;
  /** 视频链接 */
  url: string;
  /** 发布日期，如「2026-03」 */
  date: string;
  /** 标签，如 ["基金", "科普"] */
  tags: string[];
}

/** 资质 / 实盘 / 数据背书项 */
export interface Credential {
  /** 标签，如「CFA 二级」 */
  label: string;
  /** 主数值 / 短结论，如「已通过」 */
  value: string;
  /** 补充说明（可选） */
  desc?: string;
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface Education {
  school: string;
  degree: string;
  major: string;
  startYear: number;
  endYear: number;
}

export interface SkillItem {
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
}

export interface SkillCategory {
  name: string;
  items: SkillItem[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
}

export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  ogImage: string;
}

export interface MBTIDimension {
  /** 左极标签，如 "I" */
  left: string;
  /** 右极标签，如 "E" */
  right: string;
  /** 左极名称 */
  leftName: string;
  /** 右极名称 */
  rightName: string;
  /** 倾向百分比，0-100，越接近 0 越偏左，越接近 100 越偏右 */
  score: number;
}

export interface MBTIProfile {
  /** 四字母类型，如 "INTP" */
  type: string;
  /** 类型中文名 */
  name: string;
  /** 类型英文名 */
  nameEn: string;
  /** 一句话描述 */
  description: string;
  /** 四个维度 */
  dimensions: [MBTIDimension, MBTIDimension, MBTIDimension, MBTIDimension];
  /** 核心优势 */
  strengths: string[];
  /** 潜在盲区 */
  weaknesses: string[];
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  avatar: string;
  bio: string;
  social: SocialLinkItem[];
  experiences: Experience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  mbti: MBTIProfile;
  siteConfig: SiteConfig;
  /** 平台矩阵与数据背书 */
  channels: Channel[];
  /** 精选视频 / 内容 */
  contents: ContentItem[];
  /** 资质 / 实盘 / 数据背书项 */
  credentials: Credential[];
  /** 全局免责声明（金融内容合规红线） */
  disclaimer: string;
}
