## PersonalSite × ReactBits 需求文档

> 文档版本：v1.0 | 更新日期：2026-07-26
> 项目：YunYu 个人站点 | 技术栈：Next.js 16 + Tailwind v4 + framer-motion

---

### 一、项目现状

当前站点包含 5 个页面和 5 个已集成的 reactbits 组件。

**现有页面：**

| 路由 | 名称 | 状态 | 已用 reactbits |
|------|------|------|----------------|
| `/` | 首页 | 完整 | LightRays, ElectricBorder |
| `/resume` | 简历 | 完整 | LogoLoop（SkillsSection） |
| `/creative` | 创意作品集 | 完整 | 无 |
| `/map` | 拓扑图 | 完整 | 无 |
| `/demo` | 组件实验场 | 完整 | FloatingLines, SideRays, LightRays |

**已集成组件：** FloatingLines（three.js）、SideRays（ogl）、LightRays（ogl）、LogoLoop（CSS）、ElectricBorder（Canvas 2D）。

**reactbits 可用组件总量：** Backgrounds 45 个、TextAnimations 23 个、Animations 31 个、Components 40 个，共 139 个。

---

### 二、页面规划

基于现有结构，规划以下增强和新页面，按优先级分为三期。

#### 第一期：现有页面增强（高优先级）

**2.1 首页 `/` — 文字动效升级**

目标：在已有 LightRays 背景基础上，为文字内容增加细腻的入场和滚动动效，提升首屏视觉冲击力。

| 区域 | 推荐组件 | 用途 | 类别 |
|------|----------|------|------|
| 英雄区-名字 | SplitText | 逐字母入场动画，替代当前整体 fade-in | TextAnimations |
| 英雄区-标语 | DecryptedText | 文字解密效果，"以代码写诗，以架构作画"逐字揭示 | TextAnimations |
| 英雄区-角色标签 | ShinyText | 微光扫过效果，突出"全栈工程师" | TextAnimations |
| 精选项目区 | ScrollVelocity | 滚动时标题文字速度变化，增加节奏感 | TextAnimations |
| 关于区域 | BlurText | 文字从模糊到清晰的入场 | TextAnimations |
| 精选项目卡片 | GlareHover | 鼠标悬停时的光泽反射效果 | Animations |
| 精选项目卡片 | StarBorder | 星光边框装饰，替代普通 border | Animations |
| 全局 | ClickSpark | 点击任意位置产生粒子火花 | Animations |

**2.2 简历页 `/resume` — 卡片与数据增强**

目标：增强 Bento Grid 布局的交互深度，让数据展示更生动。

| 区域 | 推荐组件 | 用途 | 类别 |
|------|----------|------|------|
| 技能区域 | MagicBento | 替换当前 Grid，每个技能卡片有独立动效 | Components |
| 经验区域-数字 | CountUp | "5年经验""20+ PR""2k+ 周下载"等数据滚动计数 | TextAnimations |
| 项目卡片 | TiltedCard | 3D 倾斜效果，鼠标跟随透视变换 | Components |
| 时间线 | ScrollStack | 卡片随滚动堆叠展开，替代线性 Timeline | Components |
| 关于区域 | SpotlightCard | 鼠标追光卡片效果 | Components |
| 页面背景 | Silk | 丝滑流动背景，比纯色更有呼吸感 | Backgrounds |

**2.3 创意页 `/creative` — 交互体验强化**

目标：将该页面打造为交互实验秀场，展示前端技术能力。

| 区域 | 推荐组件 | 用途 | 类别 |
|------|----------|------|------|
| 按钮/CTA | Magnet | 磁性吸附效果，鼠标靠近时按钮被吸引 | Animations |
| 项目展示 | CardSwap | 卡片堆叠切换，点击翻转到下一张 | Components |
| 图片画廊 | OrbitImages | 图片环绕鼠标旋转 | Animations |
| 全局光标 | BlobCursor | 粘性液态光标跟随效果 | Animations |
| 英雄标题 | TextPressure | 鼠标压力感应文字变形 | TextAnimations |
| 页面背景 | LetterGlitch | 字符矩阵故障风背景 | Backgrounds |

#### 第二期：新页面开发（中优先级）

**2.4 关于页 `/about` — 个人故事**

独立的深度自我介绍页面，比首页 About 区域更丰富。

| 区域 | 推荐组件 | 用途 | 类别 |
|------|----------|------|------|
| 页面背景 | Aurora | 极光流动背景，营造沉浸氛围 | Backgrounds |
| 个人卡片 | ProfileCard | 3D 个人名片展示 | Components |
| 技术栈展示 | Lanyard | 挂绳式卡片，拖拽物理模拟 | Components |
| 经历时间线 | AnimatedList | 列表项动画逐条入场 | Components |
| 数据展示 | Counter | 带图标的计数动画 | Components |

**2.5 项目详情页 `/projects/[slug]` — 案例展示**

每个项目的独立详情页，支持深度内容展示。

| 区域 | 推荐组件 | 用途 | 类别 |
|------|----------|------|------|
| 封面图 | GridDistortion | 鼠标悬停时网格扭曲效果 | Backgrounds |
| 技术标签 | Badge + ShinyText | 微光技术栈标签 | TextAnimations |
| 截图画廊 | Carousel | 项目截图轮播 | Components |
| 相关项目 | FlyingPosters | 海报飞出效果，点击跳转到相关项目 | Components |
| 页面顶部 | Orb | 3D 球体装饰 | Backgrounds |

**2.6 博客页 `/blog` — 技术文章（可选）**

如果需要技术分享功能。

| 区域 | 推荐组件 | 用途 | 类别 |
|------|----------|------|------|
| 页面背景 | DotField | 点阵背景，干净且有科技感 | Backgrounds |
| 文章列表 | ScrollReveal | 文章卡片滚动入场 | TextAnimations |
| 导航 | Dock | macOS 风格 Dock 栏分类筛选 | Components |
| 文章封面 | PixelCard | 像素化卡片效果 | Components |

#### 第三期：锦上添花（低优先级）

**2.7 留言板 `/guestbook`**

| 区域 | 推荐组件 | 用途 | 类别 |
|------|----------|------|------|
| 页面背景 | Particles | 粒子漂浮背景 | Backgrounds |
| 留言列表 | BounceCards | 弹性卡片展示留言 | Components |
| 输入框 | CurvedInput | 弧形输入框装饰 | Components |

**2.8 全局增强（可叠加到任意页面）**

| 功能 | 推荐组件 | 用途 | 类别 |
|------|----------|------|------|
| 光标效果 | GhostCursor / PixelTrail | 光标拖尾特效（仅 creative 页） | Animations |
| 页面过渡 | PixelTransition | 像素化页面切换过渡 | Animations |
| 滚动指示 | GradualBlur | 页面顶部/底部渐变模糊指示 | Animations |
| 导航增强 | GooeyNav / PillNav | 液态粘性导航或胶囊导航 | Components |

---

### 三、组件选型评估矩阵

从 139 个组件中筛选出 35 个适合本项目的组件，以下为评估维度。

**评分标准：** 每项 1-5 分，总分 = 视觉 × 0.3 + 性能 × 0.25 + 契合度 × 0.25 + 实现难度 × 0.2（实现难度越高越好，表示越容易集成）。

| 组件 | 视觉冲击力 | 性能开销 | 风格契合 | 实现容易 | 总分 | 推荐等级 |
|------|-----------|---------|---------|---------|------|---------|
| SplitText | 4 | 5 | 5 | 5 | 4.7 | S |
| DecryptedText | 5 | 5 | 5 | 4 | 4.8 | S |
| ShinyText | 3 | 5 | 5 | 5 | 4.4 | S |
| CountUp | 3 | 5 | 5 | 5 | 4.4 | S |
| GlareHover | 4 | 5 | 4 | 5 | 4.5 | S |
| ClickSpark | 4 | 4 | 4 | 5 | 4.3 | A |
| MagicBento | 5 | 4 | 4 | 3 | 4.2 | A |
| TiltedCard | 5 | 4 | 4 | 4 | 4.5 | S |
| ScrollVelocity | 4 | 4 | 4 | 4 | 4.1 | A |
| BlurText | 3 | 5 | 4 | 5 | 4.2 | A |
| StarBorder | 4 | 4 | 4 | 4 | 4.1 | A |
| ScrollStack | 5 | 3 | 4 | 3 | 4.0 | A |
| SpotlightCard | 4 | 4 | 4 | 4 | 4.1 | A |
| Silk | 5 | 3 | 4 | 3 | 4.1 | A |
| Aurora | 5 | 3 | 4 | 3 | 4.0 | A |
| LetterGlitch | 5 | 2 | 5 | 3 | 3.9 | A |
| Magnet | 4 | 5 | 3 | 5 | 4.2 | A |
| CardSwap | 5 | 4 | 3 | 3 | 3.9 | A |
| ProfileCard | 4 | 4 | 4 | 4 | 4.1 | A |
| Lanyard | 5 | 3 | 3 | 2 | 3.6 | B |
| BlobCursor | 5 | 3 | 3 | 3 | 3.7 | B |
| OrbitImages | 5 | 3 | 3 | 2 | 3.5 | B |
| TextPressure | 5 | 4 | 3 | 3 | 3.9 | A |
| GridDistortion | 5 | 2 | 3 | 2 | 3.3 | B |
| FlyingPosters | 5 | 3 | 3 | 2 | 3.5 | B |
| Dock | 4 | 4 | 3 | 4 | 3.8 | B |
| Particles | 4 | 3 | 3 | 4 | 3.6 | B |
| BounceCards | 4 | 4 | 3 | 3 | 3.6 | B |
| AnimatedList | 3 | 5 | 4 | 5 | 4.2 | A |
| Carousel | 3 | 4 | 4 | 4 | 3.7 | B |
| Orb | 5 | 2 | 3 | 2 | 3.3 | B |
| DotField | 3 | 4 | 4 | 4 | 3.7 | B |
| PixelTransition | 5 | 3 | 3 | 3 | 3.7 | B |
| GhostCursor | 4 | 4 | 2 | 4 | 3.5 | B |
| GradualBlur | 3 | 5 | 4 | 5 | 4.2 | A |

**S 级（必做）**：SplitText、DecryptedText、ShinyText、CountUp、GlareHover、TiltedCard
**A 级（推荐）**：ClickSpark、MagicBento、ScrollVelocity、BlurText、StarBorder、ScrollStack、SpotlightCard、Silk、Aurora、LetterGlitch、Magnet、CardSwap、ProfileCard、TextPressure、AnimatedList、GradualBlur
**B 级（可选）**：其余组件视时间和需求选用

---

### 四、技术约束与风险

**4.1 性能预算**

WebGL 组件（Backgrounds 类）每页最多同时使用 1 个全屏背景 + 1 个局部效果。纯 CSS / Canvas 2D 动效无此限制。同时需关注 three.js（~600KB）和 ogl（~15KB gzipped）的包体积差异——ogl 系组件（LightRays、SideRays、Silk、Aurora、LiquidChrome）优先于 three.js 系。

**4.2 已知坑点（来自现有文档）**

集成新组件时必须遵循已有约定：`"use client"` + named export + `useReducedMotion` + `aria-hidden` + `className` prop。WebGL 交互组件需要 `pointer-events` 穿透管理。`display:none` 会阻止 IntersectionObserver 初始化，需用 JS 条件渲染替代 CSS 显隐。SSR 主题相关属性需 `mounted` 守卫。

**4.3 依赖管理**

当前已有 three.js 和 ogl。新组件如需额外依赖（如 gsap、matter-js），应评估体积后按需安装。react-icons 已安装用于 LogoLoop。

**4.4 无障碍**

所有装饰性动效组件必须 `aria-hidden="true"`，`useReducedMotion` 为 true 时降级为静态展示。文字动效不能影响屏幕阅读器的文本朗读顺序。

---

### 五、实施路线图

```
第一期（1-2 周）── 现有页面增强
├── 首页：SplitText + DecryptedText + ShinyText + ClickSpark + GlareHover
├── 简历页：CountUp + TiltedCard + SpotlightCard + Silk
└── 创意页：Magnet + BlobCursor + LetterGlitch

第二期（2-3 周）── 新页面开发
├── /about 页面：Aurora + ProfileCard + AnimatedList
├── /projects/[slug] 详情页：GridDistortion + Carousel
└── 全局过渡效果：PixelTransition + GradualBlur

第三期（弹性）── 锦上添花
├── /blog 页面（如需）
├── /guestbook 留言板
└── 导航升级、光标特效等
```
