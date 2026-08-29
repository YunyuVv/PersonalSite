import fs from "fs";
import path from "path";
import type {
  SocialLinks,
  Experience,
  Education,
  SkillCategory,
  Project,
  MBTIDimension,
  Channel,
  ContentItem,
  Credential,
} from "@/types/profile";

export interface MBTIConfig {
  type: string;
  name: string;
  nameEn: string;
  description: string;
  dimensions: MBTIDimension[];
  strengths: string[];
  weaknesses: string[];
}

export interface SiteConfig {
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
  mbti: MBTIConfig;
  siteConfig: {
    title: string;
    description: string;
    url: string;
    ogImage: string;
  };
  statusBadge: string;
  philosophy: string;
  focus: string[];
  channels: Channel[];
  contents: ContentItem[];
  credentials: Credential[];
  disclaimer: string;
}

// 默认种子：首次启动若无 config.json，写入此默认值（与 data/config.json 一致）
const DEFAULT_CONFIG: SiteConfig = {
  name: "清正",
  role: "金融 UP 主 / 投资内容创作者",
  tagline: "用数据拆解市场，让投资回归理性",
  location: "深圳",
  email: "hello@example.com",
  avatar: "/images/avatar.jpg",
  bio: "我是一名专注资产配置与市场解读的金融内容创作者。\n\n我相信好的投资不需要复杂的术语，而是把数据讲清楚、把逻辑理顺畅。无论是基金、股票还是宏观趋势，都希望用普通人能听懂的方式，帮你做出更理性的决策。\n\n内容之外，也在持续学习行为金融与量化方法，让每一期视频和文章都有据可依。",
  social: {
    wechat: "https://mp.weixin.qq.com/",
    xiaohongshu: "https://www.xiaohongshu.com/user/profile/yourname",
    weibo: "https://weibo.com/yourname",
    bilibili: "https://space.bilibili.com/youruid",
    douyin: "https://v.douyin.com/yourid/",
    youtube: "https://www.youtube.com/@yourchannel",
    shipinhao: "",
  },
  experiences: [
    {
      company: "独立财经内容创作",
      role: "金融 UP 主 / 投资内容创作者",
      startDate: "2022-01",
      endDate: "至今",
      highlights: [
        "全网粉丝累计 30万+，单期最高播放 230万",
        "打造「用数据拆解市场」内容体系，覆盖基金 / 股票 / 宏观 / 资产配置",
        "累计直播 200+ 场，搭建粉丝社群与会员体系",
      ],
    },
    {
      company: "某资产管理机构",
      role: "研究员（权益方向）",
      startDate: "2019-06",
      endDate: "2021-12",
      highlights: [
        "负责消费与新能源板块跟踪，输出个股与行业深度报告",
        "搭建量化选股与回测框架，提升研究效率",
        "参与多只公募 / 私募产品的投研支持",
      ],
    },
    {
      company: "财经媒体",
      role: "撰稿 / 特约评论",
      startDate: "2018-03",
      endDate: "2019-05",
      highlights: [
        "撰写市场解读与投教文章，累计阅读量超千万",
        "担任多档财经节目特约嘉宾",
      ],
    },
  ],
  education: [
    {
      school: "XX 大学",
      degree: "本科",
      major: "计算机科学与技术",
      startYear: 2014,
      endYear: 2018,
    },
  ],
  skills: [
    {
      name: "投研能力",
      items: [
        { name: "基本面分析", level: 5 },
        { name: "技术面分析", level: 4 },
        { name: "量化回测", level: 4 },
        { name: "资产配置", level: 5 },
      ],
    },
    {
      name: "内容创作",
      items: [
        { name: "视频脚本", level: 5 },
        { name: "数据可视化", level: 5 },
        { name: "公开演讲", level: 4 },
        { name: "剪辑后期", level: 3 },
      ],
    },
    {
      name: "工具",
      items: [
        { name: "Python", level: 4 },
        { name: "Excel / Wind", level: 5 },
        { name: "Tableau / BI", level: 4 },
        { name: "Notion", level: 4 },
      ],
    },
  ],
  projects: [
    {
      id: "micro-frontend-platform",
      name: "微前端治理平台",
      description: "一站式微前端应用管理、监控与性能分析平台",
      tags: ["React", "TypeScript", "Qiankun", "WebSocket"],
      image: "/images/projects/proj-1.webp",
      demoUrl: "https://micro.example.com",
      githubUrl: "https://github.com/yourname/micro-frontend-platform",
    },
    {
      id: "devops-dashboard",
      name: "DevOps 可视化仪表盘",
      description: "实时 CI/CD 流水线监控与告警面板",
      tags: ["Next.js", "D3.js", "WebSocket", "Docker"],
      image: "/images/projects/proj-2.webp",
      demoUrl: "https://dashboard.example.com",
      githubUrl: "https://github.com/yourname/devops-dashboard",
    },
    {
      id: "open-source-utils",
      name: "xx-utils 工具库",
      description: "轻量级前端工具函数集合，2k+ 周下载量",
      tags: ["TypeScript", "Rollup", "Jest"],
      image: "/images/projects/proj-3.webp",
      githubUrl: "https://github.com/yourname/xx-utils",
    },
    {
      id: "ai-chat-app",
      name: "AI 对话平台",
      description: "基于 LLM 的多轮对话应用，支持流式响应",
      tags: ["Next.js", "OpenAI", "Edge Runtime", "PostgreSQL"],
      image: "/images/projects/proj-4.webp",
      demoUrl: "https://chat.example.com",
      githubUrl: "https://github.com/yourname/ai-chat-app",
    },
    {
      id: "ecommerce-admin",
      name: "电商后台管理系统",
      description: "全栈电商管理后台，RBAC 权限 + 数据大屏",
      tags: ["React", "Node.js", "Ant Design", "MongoDB"],
      image: "/images/projects/proj-5.webp",
      githubUrl: "https://github.com/yourname/ecommerce-admin",
    },
  ],
  mbti: {
    type: "INTP",
    name: "逻辑学家",
    nameEn: "The Logician",
    description:
      "安静灵活的思考者，对理论和抽象想法充满热情。喜欢用逻辑分析一切事物的本质，享受独立解决问题的过程。",
    dimensions: [
      { left: "I", right: "E", leftName: "内向", rightName: "外向", score: 22 },
      { left: "N", right: "S", leftName: "直觉", rightName: "感觉", score: 18 },
      { left: "T", right: "F", leftName: "思考", rightName: "情感", score: 15 },
      { left: "P", right: "J", leftName: "感知", rightName: "判断", score: 28 },
    ],
    strengths: ["逻辑分析", "创造性思维", "客观公正", "适应力强", "求知欲旺盛"],
    weaknesses: ["过度分析", "忽视情感", "难以决策", "容易分心"],
  },
  siteConfig: {
    title: "清正 | 金融 UP 主",
    description:
      "清正 的个人站点——金融内容创作者，专注于投资逻辑、市场解读与资产配置，用数据让理财更简单。",
    url: "https://example.com",
    ogImage: "/images/og.png",
  },
  statusBadge: "",
  philosophy:
    "我是清正，一个坚持用数据说话的金融 UP 主。不追热点、不荐个股，只把复杂的市场逻辑拆给你看——让投资回归理性，让认知真正变现。",
  focus: ["基金", "股票", "宏观", "资产配置"],
  channels: [
    { platform: "bilibili", name: "哔哩哔哩", url: "https://space.bilibili.com/youruid", followers: "12.8万", totalViews: "3200万+" },
    { platform: "douyin", name: "抖音", url: "https://v.douyin.com/yourid/", followers: "8.5万", totalViews: "1800万+" },
    { platform: "youtube", name: "YouTube", url: "https://www.youtube.com/@yourchannel", followers: "1.2万", totalViews: "420万+" },
    { platform: "xiaohongshu", name: "小红书", url: "https://www.xiaohongshu.com/user/profile/yourname", followers: "5.2万", totalViews: "900万+" },
    { platform: "wechat", name: "微信公众号", url: "https://mp.weixin.qq.com/", followers: "3.1万", totalViews: "600万+" },
    { platform: "weibo", name: "微博", url: "https://weibo.com/yourname", followers: "2.4万", totalViews: "1500万+" },
  ],
  contents: [
    { id: "c1", title: "为什么 90% 的人买基金都亏了？", cover: "/images/contents/c1.webp", platform: "bilibili", views: "86万", duration: "12:30", url: "https://www.bilibili.com/video/yourid1", date: "2026-05", tags: ["基金", "科普"] },
    { id: "c2", title: "用数据拆解：茅台到底贵不贵", cover: "/images/contents/c2.webp", platform: "bilibili", views: "142万", duration: "15:08", url: "https://www.bilibili.com/video/yourid2", date: "2026-04", tags: ["股票", "估值"] },
    { id: "c3", title: "普通人如何做资产配置（实操）", cover: "/images/contents/c3.webp", platform: "douyin", views: "230万", duration: "08:42", url: "https://v.douyin.com/yourvideo3/", date: "2026-03", tags: ["资产配置", "实操"] },
    { id: "c4", title: "美联储加息，你的钱包会怎样？", cover: "/images/contents/c4.webp", platform: "bilibili", views: "98万", duration: "11:20", url: "https://www.bilibili.com/video/yourid4", date: "2026-02", tags: ["宏观", "解读"] },
    { id: "c5", title: "3 分钟看懂 ETF，比基金更香？", cover: "/images/contents/c5.webp", platform: "xiaohongshu", views: "45万", duration: "03:11", url: "https://www.xiaohongshu.com/user/profile/yourname", date: "2026-01", tags: ["基金", "ETF"] },
    { id: "c6", title: "可转债打新，年化到底有多少？", cover: "/images/contents/c6.webp", platform: "bilibili", views: "67万", duration: "09:55", url: "https://www.bilibili.com/video/yourid6", date: "2025-12", tags: ["可转债", "打新"] },
  ],
  credentials: [
    { label: "从业经验", value: "6 年+", desc: "权益研究 + 内容创作" },
    { label: "CFA 二级", value: "已通过", desc: "投资分析体系化训练" },
    { label: "全网播放", value: "1.2 亿+", desc: "内容累计触达" },
    { label: "直播场次", value: "200+", desc: "持续与粉丝深度互动" },
  ],
  disclaimer:
    "免责声明：本站所有内容仅代表个人观点，用于知识分享与学习交流，不构成任何投资建议或收益承诺。市场有风险，投资需谨慎，请基于自身风险承受能力独立决策。",
};

const CONFIG_PATH = path.join(process.cwd(), "data", "config.json");

interface CacheEntry {
  mtimeMs: number;
  data: SiteConfig;
}

// 缓存挂在 globalThis 上，而非模块级变量。
// 原因：Next.js 下 Route Handler 与 Server Component 可能分属不同的模块实例，
// config.ts 会被加载多次，模块级变量会产生多份互不同步的 cache——
// 表现为「后台保存成功、API 读到新值，但页面渲染仍是旧值」。
// globalThis 是进程级单例，可保证同一进程内所有模块实例共享同一份缓存。
const globalCache = globalThis as unknown as {
  __siteConfigCache?: CacheEntry;
};

export function getSiteConfig(): SiteConfig {
  try {
    const stat = fs.statSync(CONFIG_PATH);
    const cached = globalCache.__siteConfigCache;
    // 命中缓存的前提：文件未被改动（以 mtime 为准）
    if (cached && cached.mtimeMs === stat.mtimeMs) {
      return cached.data;
    }
    const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
    const data = JSON.parse(raw) as SiteConfig;
    globalCache.__siteConfigCache = { mtimeMs: stat.mtimeMs, data };
    return data;
  } catch (err) {
    // 只有「文件确实不存在」时才写入默认种子（首次初始化）。
    // 其余情况（JSON 解析失败、读到半截内容、权限问题等）一律只读不写——
    // 否则一旦读取失败就会用默认值回写覆盖用户已保存的配置，造成不可逆的数据丢失。
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
      saveSiteConfig(DEFAULT_CONFIG);
      return DEFAULT_CONFIG;
    }
    console.error("[config] 读取 data/config.json 失败，本次回退到默认配置（未回写文件）：", err);
    return DEFAULT_CONFIG;
  }
}

// 写穿透：落盘 + 立即刷新缓存，保存后即时生效，无需重启。
// 同时以 mtime 为校验依据，外部直接编辑 config.json（如 Docker 挂载目录改配置）也能被感知。
export function saveSiteConfig(cfg: SiteConfig): void {
  fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
  // 原子写入：先写临时文件再 rename，避免并发读者读到被截断的半截内容
  const tmpPath = `${CONFIG_PATH}.${process.pid}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(cfg, null, 2), "utf-8");
  fs.renameSync(tmpPath, CONFIG_PATH);
  try {
    const stat = fs.statSync(CONFIG_PATH);
    globalCache.__siteConfigCache = { mtimeMs: stat.mtimeMs, data: cfg };
  } catch {
    globalCache.__siteConfigCache = { mtimeMs: Date.now(), data: cfg };
  }
}
