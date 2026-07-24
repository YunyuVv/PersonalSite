# 个人站点 — 技术实现文档（首页 + 简历子页 · 多页架构）

> 版本：v3.0  
> 最后更新：2026-07-24  
> 配套需求：docs/requirements.md v3.0

---

## 1. 技术选型

### 1.1 核心技术栈

| 类别 | 技术 | 版本 | 选型理由 |
|------|------|------|---------|
| 框架 | Next.js (App Router) | ^16.x | 多路由 SSG，`/` `/resume` `/creative` 各自静态生成，SEO 友好 |
| 语言 | TypeScript | ^5.x | 类型安全 |
| 样式 | Tailwind CSS | ^4.x | 原子化 + CSS 变量主题，无运行时开销 |
| 动画 | framer-motion | ^11.x | `useScroll` / `whileInView` 滚动动画生态最成熟 |
| 图标 | Lucide React | - | 轻量开源 SVG 图标（**禁用 emoji**）|
| 字体 | `next/font` | - | 子集化加载 Inter / Space Grotesk / JetBrains Mono |
| 部署 | Vercel | - | 零配置 + CDN |
| 包管理 | pnpm | ^9.x | 快速安装 |

> ⚠️ 本地构建/启动需 `env -u NODE_OPTIONS` 绕过环境里非法的 `NODE_OPTIONS`（与代码无关）。  
> ⚠️ Next.js 版本有破坏性变更，写代码前先读 `node_modules/next/dist/docs/` 对应指南。

### 1.2 选型决策

| 不引入 | 原因 |
|--------|------|
| Three.js / R3F | 仅创意版用 Canvas，首页/简历页纯 CSS+SVG 足够 |
| GSAP / ScrollTrigger | framer-motion 已覆盖核心场景，避免双动画库冲突 |
| MDX / Contentlayer | 无博客内容，纯 TS 对象即可 |
| 状态管理库 | 仅主题切换等极少客户端状态，React Context 足够 |

---

## 2. 整体架构

### 2.1 路由与渲染

```
┌────────────────────────────────────────────────────┐
│                   Next.js App Router                 │
│                                                      │
│  app/                                                │
│  ├── layout.tsx            ← 根布局（字体+全局metadata）│
│  ├── page.tsx              ← / 首页（个人主页 · 门户）  │
│  ├── resume/               ← /resume 简历子页          │
│  │   └── page.tsx                                  │
│  ├── creative/             ← /creative 互动版（已存在）  │
│  │   ├── page.tsx                                  │
│  │   └── creative.css                               │
│  ├── globals.css           ← 共享设计令牌（CSS 变量）   │
│  └── sitemap.ts            ← / /resume /creative       │
└────────────────────────────────────────────────────┘
```

- **渲染策略**：全部 SSG（构建时生成静态 HTML）
- **数据来源**：`src/data/profile.ts` 构建时内联
- **设计令牌**：`globals.css` 中 `:root` / `.dark` 的 CSS 变量，首页/简历页/创意版共享基础令牌（创意版在其 `creative.css` 内覆盖）

### 2.2 为什么多路由 SSG

- 内容全静态、无 CMS、无数据库
- 三个页面互相独立静态生成，CDN 永久缓存
- 首页轻量（门户），简历页信息密集（Bento），职责分离后各自可独立优化

---

## 3. 目录结构（v3.0）

```
PersonalSite/
├── public/
│   ├── images/
│   │   ├── avatar.jpg
│   │   └── projects/              # 项目截图 (webp)
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx             # 根布局（字体加载 + 全局 metadata + 主题）
│   │   ├── page.tsx               # / 首页（个人主页 · 门户）
│   │   ├── resume/
│   │   │   └── page.tsx           # /resume 简历子页（Bento 苹果风）
│   │   ├── creative/
│   │   │   ├── page.tsx           # /creative 互动版（已存在）
│   │   │   └── creative.css
│   │   ├── sitemap.ts
│   │   └── globals.css            # 共享设计令牌 + Tailwind 指令
│   ├── components/
│   │   ├── layout/
│   │   │   ├── nav.tsx            # 固定导航（首页/简历页共用，按路由高亮）
│   │   │   └── footer.tsx
│   │   ├── home/                  # 首页专属区块
│   │   │   ├── home-hero.tsx
│   │   │   ├── home-about.tsx
│   │   │   ├── home-featured.tsx
│   │   │   ├── home-skills.tsx
│   │   │   ├── home-links.tsx
│   │   │   └── home-contact.tsx
│   │   ├── sections/              # 简历页 Bento 区块（从原 page 抽取）
│   │   │   ├── hero-section.tsx
│   │   │   ├── about-section.tsx
│   │   │   ├── skills-section.tsx
│   │   │   ├── experience-section.tsx
│   │   │   ├── projects-section.tsx
│   │   │   └── contact-section.tsx
│   │   ├── ui/
│   │   │   ├── project-card.tsx   # 项目卡（首页/简历页共用）
│   │   │   ├── skill-chip.tsx
│   │   │   ├── reveal.tsx         # 滚动入场（framer whileInView）
│   │   │   └── theme-toggle.tsx
│   │   └── shared/
│   │       └── section-wrapper.tsx
│   ├── data/
│   │   ├── profile.ts            # 共用个人数据
│   │   └── homepage.ts           # 首页门面专属字段（可选）
│   ├── hooks/
│   │   ├── use-scroll-spy.ts
│   │   ├── use-reduced-motion.ts
│   │   └── use-copy-to-clipboard.ts
│   ├── lib/
│   │   └── utils.ts              # cn() 等
│   └── types/
│       └── profile.ts
├── docs/
│   ├── requirements.md
│   └── technical-design.md
└── ... 配置
```

---

## 4. 设计令牌系统（共享）

### 4.1 globals.css 变量

```css
:root {
  --bg-primary: #FAFAFA;
  --bg-card: #FFFFFF;
  --text-primary: #18181B;
  --text-secondary: #52525B;
  --accent: #2563EB;          /* 苹果蓝点缀（与现有 #3b5ccc 可二选一）*/
  --border: #E4E4E7;
  --muted: #E8ECF0;
  --ring: #18181B;
  --radius: 20px;
  --font-sans: "Inter", "PingFang SC", sans-serif;
  --font-display: "Space Grotesk", "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
.dark {
  --bg-primary: #0B0B0F;
  --bg-card: #161618;
  --text-primary: #FAFAFA;
  --text-secondary: #A1A1AA;
  --accent: #5B8DEF;
  --border: #27272A;
  --muted: #1F1F22;
  --ring: #FAFAFA;
}
```

- 所有组件引用变量，禁止硬编码色值（保证深浅双主题与首页/简历一致性）
- 创意版 `/creative` 在其 `creative.css` 内定义独立深色令牌，不污染全局

### 4.2 字体加载

```tsx
// layout.tsx
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
```

---

## 5. 数据模型

### 5.1 复用 Profile（不变）

沿用现有 `src/types/profile.ts` 的 `Profile` 接口（name / role / tagline / location / email / bio / social / experiences / education / skills / projects / siteConfig）。首页与简历页共用同一份 `profile.ts`。

### 5.2 首页门面扩展（可选）

```typescript
// src/data/homepage.ts
interface HomePage {
  monogram: string;                       // 字母 monogram
  statusBadge: string;                    // 状态徽章，如"开放新机会"
  featuredProjectIds: string[];           // 引用 profile.projects 的 id
  quickLinks: { label: string; href: string; icon: string }[];
}
```

---

## 6. 组件设计

### 6.1 首页（个人主页）

```
app/page.tsx
├── Nav (固定毛玻璃，高亮"首页")
├── HomeHero        ← 姓名(Space Grotesk) + 角色 + tagline + monogram + 双 CTA
├── HomeAbout       ← 2-3 行自述 + 状态徽章
├── HomeFeatured    ← 3 张 ProjectCard（首页精选）
├── HomeSkills      ← 分类 chips 速览
├── HomeLinks       ← 快速链接网格（简历/GitHub/社交）
├── HomeContact     ← 整宽联系 CTA
└── Footer
```

### 6.2 简历页（/resume，Bento）

```
app/resume/page.tsx
├── Nav (高亮"简历"，增加"返回首页"链接)
├── Reveal 网格（6 列 Bento）
│   ├── HeroSection (col-span-4)
│   ├── 侧栏：状态/数据/聚焦 (col-span-2)
│   ├── AboutSection (col-span-3)
│   ├── SkillsSection (col-span-3)
│   ├── ExperienceSection (col-span-6)
│   ├── ProjectsSection (col-span-6, 2列网格)
│   └── ContactSection (col-span-6)
└── Footer
```

> 简历页区块组件从现有 `src/components/sections/*` 直接复用（v2 已实现），仅调整 `page.tsx` 路由与导航链路。

### 6.3 共用组件

- `ProjectCard`：首页与简历页共用，hover 浮出外链按钮
- `Reveal`：framer `whileInView` 滚动入场，支持 `id` 锚点，`useReducedMotion` 降级
- `Nav`：根据当前路由高亮；首页显示"简历"链接，简历页显示"首页"链接；移动端汉堡菜单

---

## 7. 响应式实现

### 7.1 断点

| 断点 | 宽度 | 首页 | 简历页 |
|------|------|------|--------|
| `sm` | 375px | 单列，Hero 字号收敛 | 单列，Bento 单列 |
| `md` | 768px | 精选 2 列，导航展开 | Bento 2 列 |
| `lg` | 1024px | 精选 3 列，Hero 双列 | 完整 6 列 |
| `xl` | 1440px | max-w-6xl 约束 | 同左 |

### 7.2 实现要点

- 全局 `overflow-x: hidden` 兜底，禁止横向滚动
- 触控目标 `min-h-[44px] min-w-[44px]`
- 移动端 hover → `active`/`tap` 触发
- 图片 `next/image` + `loading="lazy"`，预留尺寸防 CLS
- 网格用 Tailwind 响应式前缀（`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`）

---

## 8. 动画架构

```
层 1：CSS 过渡（hover / focus / 主题切换）         ← 零 JS
层 2：framer-motion 滚动驱动（Reveal / 导航高亮）   ← whileInView + useScroll
层 3：创意版 Canvas（仅 /creative）
```

- 入场动画仅播放一次（`whileInView`，`once: true`）
- `useReducedMotion` 关闭所有非必要动画
- 仅动画 `transform` / `opacity`

---

## 9. 性能 / SEO / 部署

### 9.1 性能

- 字体 `next/font` 子集化；非首屏区块 `React.lazy` + Suspense
- 项目截图 WebP < 200KB，`next/image`
- `experimental.optimizePackageImports: ['framer-motion','lucide-react']`

### 9.2 SEO

- 每路由独立 `metadata`（title/description/OpenGraph）
- JSON-LD：`/` → `WebSite`，`/resume` → `Person`
- `sitemap.ts` 包含 `/` `/resume` `/creative`

### 9.3 部署

- Vercel 连接 GitHub 自动部署
- 构建命令：`pnpm build`（本地加 `env -u NODE_OPTIONS`）

---

## 10. 迁移步骤（v2 → v3）

1. 将 `src/app/page.tsx` 整体迁移为 `src/app/resume/page.tsx`（简历页）
2. 新建 `src/app/page.tsx` 作为首页（个人主页），组装 `src/components/home/*`
3. `globals.css` 收敛为统一令牌（见 §4.1），移除旧的国风/独立硬编码
4. `Nav` 增加路由感知与首页↔简历互跳
5. `sitemap.ts` 增加 `/resume`
6. `layout.tsx` 加载 Inter / Space Grotesk / JetBrains Mono
7. 构建验证：`env -u NODE_OPTIONS pnpm build` 零报错

---

## 11. 开发顺序

```
1. globals.css 统一令牌 + layout 字体
2. 简历页迁移到 /resume（抽取 sections/*）
3. 首页骨架 page.tsx + home/* 区块
4. Nav 路由感知 + 互跳 + 移动导航
5. 响应式四档打磨
6. 深浅主题联调
7. SEO + 性能 + 部署
```

---

## 附录

### 变更记录

| 日期 | 版本 | 变更说明 |
|------|------|---------|
| 2026-07-24 | v1.0 | 初始版本（多页面 + 博客） |
| 2026-07-24 | v2.0 | 单页国风数字简历 |
| 2026-07-24 | v3.0 | 多页架构：首页(/) + 简历子页(/resume，Bento 苹果风) + 创意版(/creative)；统一设计令牌；Soft UI Evolution + 苹果蓝；强制响应式四档 |
