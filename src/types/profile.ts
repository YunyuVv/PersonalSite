export interface SocialLinks {
  github?: string;
  linkedin?: string;
  juejin?: string;
  zhihu?: string;
  twitter?: string;
  wechat?: string;
  website?: string;
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
  social: SocialLinks;
  experiences: Experience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  mbti: MBTIProfile;
  siteConfig: SiteConfig;
  /** 全局免责声明（页脚展示） */
  disclaimer: string;
}
