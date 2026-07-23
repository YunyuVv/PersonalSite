# 个人站点 — 技术实现文档（国风数字简历）

> 版本：v2.0  
> 最后更新：2026-07-24

---

## 1. 技术选型

### 1.1 核心技术栈

| 类别 | 技术 | 版本 | 选型理由 |
|------|------|------|---------|
| 框架 | Next.js (App Router) | ^15.x | SSG 生成单页，SEO 友好 |
| 语言 | TypeScript | ^5.x | 类型安全 |
| 样式 | Tailwind CSS | ^4.x | 原子化 CSS，与动画库无冲突 |
| 动画 | framer-motion | ^11.x | `useScroll` / `whileInView` 滚动动画生态最成熟 |
| 图标 | Lucide React | - | 轻量开源 |
| 部署 | Vercel | - | 零配置 + CDN |
| 包管理 | pnpm | ^9.x | 快速安装 |

### 1.2 选型决策——为什么不引入重依赖

| 不考��� | 原因 |
|--------|------|
| Three.js / R3F | 场景只需山脉+粒子，Canvas 2D 足够，3D 增加 150KB+ 且移动端性能差 |
| GSAP / ScrollTrigger | framer-motion 已覆盖核心场景，避免双动画库冲突 |
| MDX / Contentlayer | 无博客内容，数据量极少，纯 JSON/TS 对象即可 |
| Next.js Pages Router | App Router 是未来方向，RSC 对静态生成有加成 |

---

## 2. 整体架构

### 2.1 架构图

```
┌──────────────────────────────────────────┐
│              用户浏览器                     │
│  ┌────────────────────────────────────┐   │
│  │       单页面应用（SPA-like）          │   │
│  │  ┌──────────────────────────────┐  │   │
│  │  │ Section 1: Hero (Canvas 粒子)│  │   │
│  │  │ Section 2: About             │  │   │
│  │  │ Section 3: Skills            │  │   │
│  │  │ Section 4: Projects          │  │   │
│  │  │ Section 5: Contact           │  │   │
│  │  │ Nav (锚点滚动)                │  │   │
│  │  └──────────────────────────────┘  │   │
│  └────────────────────────────────────┘   │
└──────────────────┬───────────────────────┘
                   │ 静态 HTML + CSS + JS
                   ▼
┌──────────────────────────────────────────┐
│           Vercel CDN Edge                 │
└──────────────────────────────────────────┘
```

- **渲染策略**：纯 SSG，整个 `page.tsx` 在构建时渲染为静态 HTML
- **运行时**：客户端动画（framer-motion + Canvas）在浏览器中运行
- **数据来源**：`src/data/profile.ts` 导出 JS 对象，构建时内联到 HTML

### 2.2 为什么纯 SSG 就够了

- 无动态内容，无 CMS，无数据库
- 个人信息和项目数据是静态 JS 对象
- 构建一次，CDN 永久缓存
- 零服务端开销，无限并发

---

## 3. 目录结构

```
PersonalSite/
├── public/
│   ├── images/
│   │   ├── avatar.jpg
│   │   ├── projects/              # 项目截图
│   │   │   ├── proj-1.webp
│   │   │   └── proj-2.webp
│   │   └── decorations/           # 国风装饰素材
│   │       ├── seal.svg           # 印章 SVG
│   │       ├── mountain-1.svg     # 远山剪影
│   │       ├── mountain-2.svg     # 近山剪影
│   │       ├── cloud.svg          # 云雾
│   │       └── brush-stroke.svg   # 毛笔笔触
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx             # 根布局（字体加载 + metadata）
│   │   ├── page.tsx               # 唯一页面，按 Section 组装
│   │   ├── sitemap.ts             # 站点地图
│   │   └── globals.css            # 全局样式 + Tailwind 指令
│   ├── components/
│   │   ├── layout/
│   │   │   ├── nav.tsx            # 固定导航 + 滚动高亮
│   │   │   └── footer.tsx         # 页脚 + 动画开关
│   │   ├── sections/
│   │   │   ├── hero-section.tsx   # Hero + Canvas 背景
│   │   │   ├── about-section.tsx  # 关于我 + 时间轴
│   │   │   ├── skills-section.tsx # 技能雷达图/云图
│   │   │   ├── projects-section.tsx # 项目卡片网格
│   │   │   └── contact-section.tsx  # 联系方式
│   │   ├── effects/
│   │   │   ├── ink-particles.tsx  # Canvas 墨点粒子
│   │   │   ├── mountain-parallax.tsx # SVG 山脉视差
│   │   │   ├── cloud-drift.tsx    # 云雾漂移动画
│   │   │   └── scroll-progress.tsx # 滚动进度指示器
│   │   ├── ui/
│   │   │   ├── seal.tsx           # 印章组件
│   │   │   ├── brush-divider.tsx  # 毛笔笔触分割线
│   │   │   ├── skill-radar.tsx    # 技能雷达图（SVG）
│   │   │   ├── project-card.tsx   # 项目卡片
│   │   │   ├── timeline.tsx       # 时间轴组件
│   │   │   └── back-to-top.tsx    # 回到顶部按钮
│   │   └── shared/
│   │       ├── section-wrapper.tsx # Section 通用容器（观察器+动画）
│   │       └── social-icons.tsx    # 社交图标
│   ├── data/
│   │   └── profile.ts             # 所有个人信息（TS 对象）
│   ├── hooks/
│   │   ├── use-scroll-spy.ts      # 滚动监听 → 高亮导航
│   │   ├── use-particles.ts       # Canvas 粒子管理
│   │   ├── use-reduced-motion.ts  # 检测动画偏好
│   │   └── use-copy-to-clipboard.ts
│   ├── lib/
│   │   └── utils.ts               # cn() 等工具函数
│   └── types/
│       └── profile.ts             # 数据模型类型定义
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── docs/
    ├── requirements.md
    └── technical-design.md
```

---

## 4. 数据模型

### 4.1 个人资料 (Profile)

```typescript
// src/types/profile.ts
interface Profile {
  name: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  avatar: string;
  bio: string;                    // 100–150 字自述
  social: SocialLinks;
  experiences: Experience[];
  education: Education[];
  skills: SkillCategory[];
  projects: Project[];
  siteConfig: SiteConfig;
}

interface SocialLinks {
  github?: string;
  linkedin?: string;
  juejin?: string;
  zhihu?: string;
  twitter?: string;
  wechat?: string;               // 微信二维码图片路径，为空则不展示
}

interface Experience {
  company: string;
  role: string;
  startDate: string;             // "2020-01"
  endDate: string;               // "2023-06" 或 "至今"
  highlights: string[];          // 2–3 条关键成果
}

interface Education {
  school: string;
  degree: string;
  major: string;
  startYear: number;
  endYear: number;
}

interface SkillCategory {
  name: string;                  // 如"前端"
  items: SkillItem[];
}

interface SkillItem {
  name: string;                  // 如"React"
  level: 1 | 2 | 3 | 4 | 5;    // 熟练度 1–5
}

interface Project {
  id: string;
  name: string;
  description: string;           // 一句话描述
  tags: string[];
  image: string;                 // 缩略图路径
  demoUrl?: string;              // 线上链接
  githubUrl?: string;            // 源码链接
}

interface SiteConfig {
  title: string;
  description: string;
  url: string;
  ogImage: string;
}
```

### 4.2 数据文件示例

```typescript
// src/data/profile.ts
import { Profile } from '@/types/profile';

const profile: Profile = {
  name: '张三',
  role: '全栈工程师',
  tagline: '以代码写诗，以架构作画',
  location: '深圳',
  email: 'hello@example.com',
  avatar: '/images/avatar.jpg',
  bio: '我是一名在 Web 领域摸爬滚打 5 年的工程师……',
  social: {
    github: 'https://github.com/xxx',
    juejin: 'https://juejin.cn/user/xxx',
  },
  experiences: [
    {
      company: 'XX 科技',
      role: '高级前端工程师',
      startDate: '2021-03',
      endDate: '至今',
      highlights: [
        '主导设计并落地微前端架构，支撑 8 个业务模块独立部署',
        '引入 Rust 工具链将 CI 构建从 12 分钟优化至 3 分钟',
      ],
    },
  ],
  education: [
    {
      school: 'XX 大学',
      degree: '本科',
      major: '计算机科学与技术',
      startYear: 2014,
      endYear: 2018,
    },
  ],
  skills: [
    {
      name: '语言',
      items: [
        { name: 'TypeScript', level: 5 },
        { name: 'JavaScript', level: 5 },
        { name: 'Python', level: 3 },
        { name: 'Go', level: 2 },
      ],
    },
    // ... 更多类别
  ],
  projects: [
    {
      id: 'proj-1',
      name: '微前端治理平台',
      description: '一站式微前端应用管理、监控与性能分析平台',
      tags: ['React', 'TypeScript', 'Qiankun', 'WebSocket'],
      image: '/images/projects/proj-1.webp',
      demoUrl: 'https://micro-frontend.example.com',
      githubUrl: 'https://github.com/xxx/micro-frontend-platform',
    },
    // ... 更多项目
  ],
  siteConfig: {
    title: '张三 | 全栈工程师',
    description: '张三的个人站点——全栈工程师，热爱开源与技术分享',
    url: 'https://example.com',
    ogImage: '/images/og.png',
  },
};

export default profile;
```

---

## 5. 组件设计

### 5.1 页面组装

```
app/page.tsx                    ← 唯一页面
├── Nav                         ← 固定导航
├── HeroSection                 ← 100vh，Canvas 粒子背景 + 多层 SVG 视差
├── BrushDivider                ← 毛笔笔触分割线
├── AboutSection                ← 自述文案 + Timeline
├── BrushDivider
├── SkillsSection               ← SkillRadar / SkillCloud
├── BrushDivider
├── ProjectsSection             ← ProjectCard × N
├── BrushDivider
├── ContactSection              ← 联系方式 + 社交图标 + Seal
├── Footer
└── BackToTop                   ← 浮动返回顶部按钮
```

### 5.2 核心组件规格

#### Nav（导航栏）

```tsx
// 固定在顶部，z-50
// backdrop-blur 渐变：顶部透明 → 滚动后加深
// 滚动监听（useScrollSpy）高亮当前 Section 对应链接
// 移动端：汉堡菜单展开
// 当前 active 链接下方有金色下划线（毛笔笔触风格）
```

#### HeroSection（英雄区）

```
结构：
┌─────────────────────────────┐
│  Canvas 墨点粒子层 (z-0)      │  ← useParticles hook
│  SVG 远山层 (z-10, parallax)  │  ← 0.1x 滚动速率
│  SVG 云雾层 (z-20, drift)     │  ← CSS animation 水平漂移
│  SVG 近山层 (z-30, parallax)  │  ← 0.3x 滚动速率
│  文字层 (z-40)                │  ← 逐字入场动画
│  ┌─────────────────────────┐ │
│  │     张 三               │ │  ← 大号宋体/书法风格
│  │   全栈工程师             │ │  ← 副标题
│  │ 以代码写诗，以架构作画    │ │  ← tagline，打字机效果
│  └─────────────────────────┘ │
│  向下箭头 (z-40)             │  ← 脉动动画，点击滚动到 #about
└─────────────────────────────┘

实现要点：
- Canvas 粒子数量：桌面 150–200，移动端 80–100
- 鼠标移动驱动视差微调（mousemove → translate 小幅度偏移）
- prefers-reduced-motion 时：去掉粒子，只保留静态背景
```

#### AboutSection（关于我）

```
结构：
┌─────────────────────────────┐
│  自述文案（居中）             │  ← 段落淡入
│                             │
│  工作经历                    │
│  ┌─ Timeline ─────────────┐ │
│  │ ● 2021–至今  XX科技     │ │  ← 左侧时间轴节点
│  │   高级前端工程师         │ │  ← 右侧内容卡片
│  │                         │ │
│  │ ● 2018–2021  YY公司     │ │
│  │   前端工程师             │ │
│  └─────────────────────────┘ │
│                             │
│  教育背景（简洁一行）         │
└─────────────────────────────┘

动画：
- Timeline SVG 竖线 stroke-dasharray 从 0 到完整
- 节点逐个亮起（scale: 0→1，朱砂红色）
- 奇数卡片左侧滑入，偶数右侧滑入
```

#### SkillsSection（技能展示）

```
可视化方案：雷达图（首选）

┌─────────────────────────────┐
│       技能雷达图              │
│   SVG <polygon> 五边形       │  ← 5 个维度轴
│   每个维度：                  │
│   - 轴线 + 刻度环            │
│   - 填充多边形（半透明朱砂色） │
│   - 顶点标签                  │
│                             │
│   技能标签列表（下方）         │  ← hover 高亮对应雷达维度
│   [React] [TypeScript] ...   │
└─────────────────────────────┘

动画：
- 雷达图从圆心 0 扩展至满值（scale + opacity）
- 标签逐个弹入（spring 弹性动画）
- hover 标签：涟漪扩散效果
```

#### ProjectsSection（项目作品）

```
结构：
┌─────────────────────────────┐
│  精选项目                    │
│                             │
│  ┌────────┐  ┌────────┐    │  ← 2–3 列网格（桌面端）
│  │ 截图    │  │ 截图    │    │  ← hover: 截图 clip-path 揭示
│  │ 标题    │  │ 标题    │    │
│  │ 描述    │  │ 描述    │    │
│  │ [标签]  │  │ [标签]  │    │
│  │ 🔗 外链 │  │ 🔗 外链 │    │  ← <a> 直接跳转
│  └────────┘  └────────┘    │
└─────────────────────────────┘

重要：
- 外链使用 <a target="_blank">，不创建子页面
- 无详情页，无路由跳转
- 卡片 border 使用撕纸效果 SVG 作为 border-image
```

#### ContactSection（联系我）

```
结构：
┌─────────────────────────────┐
│  期待与你交流                 │
│                             │
│  ✉️ hello@example.com       │  ← 点击复制
│  [GitHub] [掘金] [LinkedIn] │  ← 图标 hover 旋转 + 发光
│                             │
│          【印章落款】         │  ← Seal 组件，朱砂红
│        张三 敬上              │
└─────────────────────────────┘
```

### 5.3 国风装饰组件

#### Seal（印章）

```tsx
// SVG 渲染，圆形或方形
// 外层：朱砂红描边（2px）
// 内层：姓名文字（竖排或弧形排列）
// 动画：滚动到区域时 rotate + scale 出现
// 可选：随机微小的位置偏移和旋转角度（模拟真实盖章的不完美）
```

#### BrushDivider（毛笔笔触分割线）

```tsx
// 使用 SVG 或 PNG 毛笔笔触图片
// 水平居中，宽度约 200px
// 颜色：浅灰（浅色模式）或深灰（深色模式）
// 动画：scroll 到视野时 scaleX 从 0 展开到 1
```

#### InkParticles（墨点粒子）

```tsx
// Canvas 2D 实现
// 粒子属性：{ x, y, radius, opacity, speedY, speedX, life }
// 生成规则：随机出现在 Canvas 顶部 20%，缓慢下落，淡出
// 颜色：墨色渐变 (#1a1a1a → transparent)
// 大小：2–8px 随机
// 数量：桌面 150–200，移动 80–100
// 生命周期：从生成到完全淡出约 8–15 秒
// 鼠标交互：鼠标附近粒子轻微排斥/吸引（可选）
```

#### MountainParallax（山脉视差）

```tsx
// 多层 SVG 山脉剪影
// 层 1（远山）：浅色，translateY 速率 0.05x 滚动
// 层 2（中山）：中间色，translateY 速率 0.15x 滚动
// 层 3（近山）：深色，translateY 速率 0.3x 滚动
// mousemove 事件额外偏移（±10px 范围）
// 使用 framer-motion useTransform 驱动
```

---

## 6. 动画架构

### 6.1 动画分层策略

```
层 1：CSS 动画（底层）
  - 云雾漂移（infinite @keyframes）
  - 导航栏 backdrop-blur 过渡
  - hover 微交互（transition）

层 2：framer-motion 滚动驱动（中层）
  - Section 入场动画（whileInView）
  - 山脉视差（useScroll + useTransform）
  - Timeline 描边动画（useScroll + useTransform）
  - 回顶按钮显隐（useScroll）

层 3：Canvas RAF 动画（顶层）
  - 墨点粒子系统
  - 仅在 Hero 区域激活
  - 离开视口时暂停（IntersectionObserver）
```

### 6.2 SectionWrapper 通用容器

```tsx
// 每个 Section 包裹此组件
// 功能：
// 1. 提供 id 属性（锚点目标）
// 2. IntersectionObserver 检测进入视口 → 触发子组件入场动画
// 3. 注入 useReducedMotion 状态 → 关闭动画时跳过
// 4. 统一 padding / max-width 约束

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}
```

### 6.3 useScrollSpy（导航高亮）

```tsx
// 监听滚动位置
// 计算当前哪个 Section 处于视口中央
// 返回 activeSection id
// 50ms throttle
// Nav 组件消费 activeSection，高亮对应链接
```

### 6.4 useReducedMotion（动画降级）

```tsx
// 检测依据（按优先级）：
// 1. localStorage 手动关闭标记
// 2. window.matchMedia('(prefers-reduced-motion: reduce)')
// 3. 低端设备检测（可选：通过内存/CPU 核心数判断）
//
// 降级策略：
// - 跳过所有 framer-motion 入场动画（直接显示最终状态）
// - Canvas 粒子完全禁用
// - 视差效果降级为静态层
// - 保留基本 CSS transition（不消耗性能）
```

---

## 7. 样式与主题

### 7.1 Tailwind 扩展配置

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        ink: {
          deep: '#1a1a1a',
          medium: '#4a4a4a',
          light: '#666666',
        },
        rice: {
          paper: '#f5f0e8',
          light: '#faf6f0',
        },
        vermilion: {
          DEFAULT: '#c41e3a',
          dark: '#b22222',
          light: '#d4455a',
        },
        gold: {
          DEFAULT: '#c9a96e',
          dark: '#b8860b',
        },
        celadon: {
          DEFAULT: '#2c5f7c',
          light: '#3a7ca5',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'serif'],
        display: ['"ZCOOL XiaoWei"', '"Noto Serif SC"', 'serif'],
        sans: ['"Noto Sans SC"', '"Source Han Sans SC"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
};
```

### 7.2 深色模式

```css
/* globals.css */
:root {
  --bg-primary: #faf6f0;      /* 宣纸色 */
  --bg-card: #ffffff;
  --text-primary: #1a1a1a;    /* 墨色 */
  --text-secondary: #666666;
  --accent: #c41e3a;          /* 朱砂红 */
  --gold: #c9a96e;
}

.dark {
  --bg-primary: #121212;      /* 墨色底 */
  --bg-card: #1e1e1e;
  --text-primary: #e8e0d5;    /* 浅宣纸色文字 */
  --text-secondary: #999999;
  --accent: #d4455a;          /* 略亮的朱砂红 */
  --gold: #d4af6a;
}
```

### 7.3 响应式断点

| 断点 | 宽度 | 适配策略 |
|------|------|---------|
| `sm` | ≥ 640px | 项目卡片 2 列 |
| `md` | ≥ 768px | 导航展开 / 时间轴完整展示 |
| `lg` | ≥ 1024px | 项目卡片 3 列 / 技能雷达图与标签并排 |
| `xl` | ≥ 1280px | 内容区最大宽度约束 |

### 7.4 移动端适配要点

- Hero 区保持 100vh，但缩小字体（标题 ~2.5rem）
- 时间轴改为垂直居中布局（非左右交替）
- 项目卡片单列堆叠
- 技能雷达图缩小或改为列表展示
- Canvas 粒子数量减半
- 导航改为底部固定或汉堡菜单
- 触屏设备：hover 效果改为 tap 触发

---

## 8. 性能优化

### 8.1 动画性能

| 优化项 | 方案 |
|--------|------|
| GPU 加速 | 所有动画属性限制在 `transform` + `opacity` |
| Canvas 离屏 | `will-change: transform` 在 Hero 容器上 |
| RAF 节流 | 非激活标签页 `document.hidden` 时暂停 |
| 内存管理 | 页面卸载时 `cancelAnimationFrame` + 清空粒子数组 |
| framer-motion | `layout` 动画仅用于必要组件，避免全局 |

### 8.2 静态资源

| 资源 | 优化 |
|------|------|
| 项目截图 | WebP 格式，< 200KB，`next/image` + lazy loading |
| 山脉 SVG | 内联到组件，避免额外 HTTP 请求 |
| 印章 SVG | 内联，< 2KB |
| 字体 | `next/font` 子集化，仅加载页面使用的字符 |
| 装饰图片 | PNG 压缩到 < 50KB，`loading="lazy"` |

### 8.3 首屏关键路径

```
关键路径（按优先级）：
1. HTML 结构（SSG 已生成）
2. 首屏 CSS（Tailwind purge 后极小）
3. 姓名文字渲染（字体 fallback → web font 替换）
4. 首屏 JS（仅 Nav + framer-motion 核心）
5. Canvas 粒子（延迟 200ms 启动）

延迟加载：
- 非首屏 Section 组件（React.lazy + Suspense）
- 项目截图（IntersectionObserver 预加载）
- 动效 JS（页面 load 事件后初始化）
```

### 8.4 打包优化

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
};
```

---

## 9. 数据结构化与 SEO

### 9.1 JSON-LD 结构化数据

```tsx
// app/layout.tsx 中注入
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      jobTitle: profile.role,
      url: profile.siteConfig.url,
      sameAs: [
        profile.social.github,
        profile.social.linkedin,
        profile.social.juejin,
      ].filter(Boolean),
    }),
  }}
/>
```

### 9.2 Metadata

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: profile.siteConfig.title,
  description: profile.siteConfig.description,
  openGraph: {
    title: profile.siteConfig.title,
    description: profile.siteConfig.description,
    url: profile.siteConfig.url,
    siteName: profile.name,
    images: [{ url: profile.siteConfig.ogImage }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: profile.siteConfig.title,
    description: profile.siteConfig.description,
    images: [profile.siteConfig.ogImage],
  },
};
```

---

## 10. 部署

### 10.1 Vercel（推荐）

```bash
# 连接 GitHub 仓库后自动部署
# 自定义域名在 Vercel Dashboard → Domains 配置
# 免费额度：100GB 带宽/月
```

### 10.2 构建命令

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 10.3 环境变量

| 变量 | 说明 | 必填 |
|------|------|------|
| `NEXT_PUBLIC_SITE_URL` | 站点完整 URL | 是 |
| `NEXT_PUBLIC_GA_ID` | Google Analytics（可选）| 否 |

---

## 11. 开发规范

### 11.1 代码规范

- ESLint：`next/core-web-vitals` + TypeScript 规则
- Prettier：统一格式
- 组件命名：`kebab-case` 文件名，`PascalCase` 导出名

### 11.2 提交规范

Conventional Commits：
```
feat: 实现 Hero 区域山脉视差效果
fix: 修复移动端导航菜单溢出
style: 调整技能雷达图配色
perf: 优化 Canvas 粒子渲染性能
```

### 11.3 开发顺序

```
1. 脚手架搭建 → Tailwind 配置 → 字体引入
2. 数据模型 profile.ts 定义 + 填充
3. Nav + 页面骨架 + SectionWrapper
4. HeroSection（先静态再动效）
5. AboutSection + Timeline
6. SkillsSection + SkillRadar
7. ProjectsSection + ProjectCard
8. ContactSection + Seal
9. 动画打磨 + 性能调优
10. 移动端适配
11. SEO + 部署
```

---

## 12. 附录

### 12.1 初始化命令

```bash
pnpm create next-app@latest personal-site \
  --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd personal-site

pnpm add framer-motion lucide-react

pnpm add -D @types/node prettier
```

### 12.2 关键依赖版本（推荐）

```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "framer-motion": "^11.0.0",
  "lucide-react": "^0.400.0"
}
```

### 12.3 变更记录

| 日期 | 版本 | 变更说明 |
|------|------|---------|
| 2026-07-24 | v1.0 | 初始版本（多页面 + 博客架构） |
| 2026-07-24 | v2.0 | 重构为单页国风数字简历；移除博客、MDX、多路由；新增 Canvas 粒子/视差/滚动动画架构；简化数据模型为单一 profile.ts |
