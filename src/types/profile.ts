export interface SocialLinks {
  github?: string;
  linkedin?: string;
  juejin?: string;
  zhihu?: string;
  twitter?: string;
  wechat?: string;
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
  siteConfig: SiteConfig;
}
