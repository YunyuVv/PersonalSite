export interface SocialLinkItem {
  /** 平台标识，对应 PLATFORM_CATALOG 的 key；"custom" 表示自定义 */
  platform: string;
  /** 自定义平台的展示名（platform === "custom" 时必填） */
  label?: string;
  /** 链接地址 */
  url: string;
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
  /** 首页标题（MaskedHeading）遮罩填充图：本地路径 /images/xxx 或外部 http(s) 链接；为空时回退默认图 */
  maskedHeadingSrc: string;
  bio: string;
  social: SocialLinkItem[];
  experiences: Experience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  mbti: MBTIProfile;
  siteConfig: SiteConfig;
  /** 全局免责声明（页脚展示） */
  disclaimer: string;
  /** 页脚版权文案：留空则自动生成 "© {year} {name}."；支持 {year} 占位符，如 "© {year} YunYu. 保留所有权利" */
  footerCopyright: string;
}
