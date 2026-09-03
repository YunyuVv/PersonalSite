## PersonalSite × ThreeUI 组件选型与页面设计

> 文档版本：v1.0 | 更新日期：2026-09-03  
> 项目：YunYu 个人站点 | 技术栈：Next.js 16 (App Router) + React 19 + Tailwind v4 + framer-motion + three 0.185  
> 参考源：<https://threeui.com/> · <https://github.com/MengTo/threeui> （Community 开源版，MIT）

---

### 一、ThreeUI 项目概览

**是什么：** ThreeUI 是 DesignCode（Meng To）出品的 **3D / 着色器 React 组件目录**，分为 Pro / Beta / Community 三档。本项目可免费引入的是 **Community 版**：与官网同一套应用外壳、导航、网格、搜索、主题、变体选择器，但 **Pro / Beta 组件被移除，所有 Community 组件保留其免费变体与控件**。

**规模（Community）：**

- 50 个父组件 / 111 条路由 / 141 条免费变体 + 23 个单例组件（共 164 个浏览结果）
- 技术上覆盖：落地页、Hero、背景、按钮、区块、文字动画、UI 元素、Three.js 场景

**许可证：** MIT（应用代码、Community 组件代码、ThreeUI 自有图片均为 MIT；远程缩略图仍归属 threeui.com，不在仓库内分发）。可商用、可修改、可再分发。

**运行时依赖（已核对 `package.json`）：**

| 类型               | 依赖                                                           | 说明                                |
| ---------------- | ------------------------------------------------------------ | --------------------------------- |
| peerDependencies | `react >=18 <20` / `react-dom >=18 <20` / `three >=0.149 <1` | **仅需这三样**                         |
| dependencies     | `three128`(=three@0.128.0) / `three165`(=three@0.165.0)      | 包内个别组件用的 three 别名实例，**额外体积**      |
| **不需要**          | `@react-three/fiber` / `@react-three/drei`                   | 组件内部自带 three.js 渲染封装，**无需引入 R3F** |



> 关键结论：本项目已装 `react@19.2.4` + `three@0.185.1`，**完全满足 peer 条件，集成零额外图形框架**。唯一代价是包内 `three128`/`three165` 别名会再装两份 three。

**引入方式：**

```bash
pnpm add @designcodeio/threeui
```

```tsx
import { ConstellationField } from "@designcodeio/threeui";        // 总入口
import { ConstellationField } from "@designcodeio/threeui/components/ConstellationField"; // 子路径（最小引入图）
import "@designcodeio/threeui/style.css";                            // 共享样式（sideEffects）
```

**资产注意点（重要）：** 部分组件（多为完整 Landing Page / 场景类）会渲染完整 HTML 文档，**运行时资产需放到与 ThreeUI 预览一致的根相对 URL**。处理方式二选一：

1. 把 `node_modules/@designcodeio/threeui/lib-dist/assets/` 中所需文件复制到本项目 `public/`；
2. 或给组件传 `sourceUrl` / `assetBaseUrl` prop 覆盖路径（部分组件支持）。

> 经验法则：**背景类 / 按钮类 / 文字动画类 / 轻量 UI 元素多为自包含**；**Landing Page / 完整 Three.js 场景 / Gallery / Character 系列通常需要资产**，引入前务必本地起服务看 console 是否 404。

---

### 二、当前 PersonalSite 技术栈与集成可行性

**现状（与本任务直接相关）：**

| 项         | 情况                                                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 框架        | Next.js 16.2.11 App Router，React 19.2.4                                                                                        |
| 图形能力      | 已装 `three@0.185`、`ogl@1.0.11`、`framer-motion`、`gsap`                                                                           |
| 既有 3D 组件库 | `src/components/reactbits`（14 个）、`magic-ui`（shimmer-button）、`effects`（animated-background / ink-particles / mountain-parallax） |
| 既有交互页     | `/creative`（创意作品集）、`/demo`（组件实验场）、`/map`                                                                                       |
| 主题系统      | `next-themes` + CSS 变量（`--bg-primary`/`--accent`/`--accent-light`/`--radius-card` 等），含 `:root` 与 `.dark` 两套                    |
| 无障碍约定     | 全站统一 `useReducedMotion` + `aria-hidden` + `mounted` 守卫（SSR 主题）                                                                 |
| 数据驱动      | `@/data/profile`、`@/data/homepage` 提供 name/role/tagline/projects/social 等                                                      |

**可行性结论：✅ 可直接引入。** 项目已验证 canvas/WebGL 组件在 App Router 下稳定运行（reactbits 即证），且 three 版本满足 ThreeUI peer。ThreeUI 与既有 reactbits/magic-ui 是**互补关系**——后者偏 CSS/Canvas 2D/ogl 轻交互，ThreeUI 偏 three.js 着色器级视觉，定位不冲突。

**集成约定（必须遵守，沿用 reactbits 文档 §4.2）：**

- 所有 ThreeUI 组件包一层本项目自定义 Client 包装（见 §六），统一 `"use client"` + `mounted` 守卫 + `useReducedMotion` 降级。
- WebGL 全屏背景 `pointer-events-none` + `aria-hidden`，避免拦截交互。
- 暗黑模式：ThreeUI 组件内置颜色不一定跟随 `--accent`，需传 prop 或 CSS 变量覆写（见 §七）。
- 不要用 `display:none` 控制显隐（会阻断 IntersectionObserver），用 JS 条件渲染。

---

### 三、ThreeUI Community 组件清单（按 8 大类）

> 以下为从仓库 `src/data/shaders.tsx` 逐字提取的 102 个 Community 组件，按 `READY_SHADER_CATEGORIES` 归类。

| 类别                       | 组件（community 标识符）                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Landing Pages**        | KageLandingPage、CompleteShelfLandingPage、BestsellersBookShowcase、MengToSketchbookLandingPage                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **Hero**                 | SylvaHero、CompleteShelfLandingPage、BestsellersBookShowcase                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Backgrounds（背景）**      | PredictiveArcCanvas、LiquidFormBackground、CrtBackground、GlobeCollection、SparkBadge、StreamConvergenceBackground、BellFieldBackground、FlowField、ElementsCollection、ElementsBackground、CondensationBackground、GenerativeTree、RibbonFieldBackground、StructureFlowCollection、EmeraldHorizonBackground、OrbitalSphereBackground、DotMatrixBackground、WarpFieldBackground、CloudField、VoidField、ExpanseField、LogicCoreField、DimensionalField、DataField、TopologyField、HalftoneFlow、NebulaBackground、FluidFieldBackground、EmberStorm、ConstellationField、PortalFieldCollection、ParticleDrift、ParticleNetwork、FluxVortex、AmberHalftone、GatewayFlow、ConnectivityGraph、InterfaceLines、WireframeForms、DefenseLines、TopoField、BrandOrbs |
| **Buttons（按钮）**          | ShaderButtons、IgnitionButton、InductionButton、PlasmaButton、TactileButton、ThinkingButton、SlidingTextCta、FloatingDotsCta、LaunchButton、DotBorderButton、GradientCta、SpinningBorderButton、GlassmorphismCta、GenerateButton、GradientPillButton、GradientBeamCta、RectangleButtons、CircleButtons、LiquidMetalButton、LumenCta                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Sections（区块）**         | EditorialIntroSection、NewsletterFooterSection                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Text Animation（文字动画）** | TypographyVortexCanvas、TextPathStudies、OutlineTypeflow、MorphingGlyphCloud、ClothStudy、RippleStudy、BallStudy、NeonTypography、TextAnimationCollection                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **UI Elements**          | ThreeUIIntro、ParticleWordmark、AudioWordmark、GalleryHeading、PerformanceGauges、UplinkLoader、AnimatedTopDock、SkeuomorphicToggleCollection、DiagnosticsPanel                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Three.js 场景 / 其他**     | SylvaLivingWorldScene、TempleNightScene、LandscapeScene、JapaneseTowerLandscape、BookshelfScene、KoiStudies、WovenCloth、SemanticBloom、LaserCollection、CharacterCarousel、CharacterFilmstrip、CharacterWave、Gallery、Sketchbook                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

---

### 四、组件选型分析

#### 4.1 评估维度

每项 1–5 分，**总分 = 视觉×0.3 + 性能×0.25 + 契合×0.25 + 实现容易×0.2**（性能/实现越高表示越省心）。另列「资产」列标注入门前是否需复制 assets。

#### 4.2 推荐组件评估矩阵

| 组件                           | 类别 | 视觉 | 性能 | 契合 | 实现 | 资产  | 总分   | 等级    |
| ---------------------------- | -- | -- | -- | -- | -- | --- | ---- | ----- |
| GradientCta                  | 按钮 | 4  | 5  | 5  | 5  | 自包含 | 4.70 | **S** |
| GlassmorphismCta             | 按钮 | 4  | 5  | 5  | 5  | 自包含 | 4.70 | **S** |
| SpinningBorderButton         | 按钮 | 4  | 5  | 4  | 5  | 自包含 | 4.45 | **S** |
| LumenCta                     | 按钮 | 4  | 5  | 4  | 5  | 自包含 | 4.45 | **S** |
| GradientPillButtonsylva      | 按钮 | 4  | 5  | 4  | 5  | 自包含 | 4.45 | **S** |
| ConstellationField           | 背景 | 4  | 4  | 5  | 4  | 自包含 | 4.25 | **A** |
| ParticleDrift                | 背景 | 4  | 4  | 4  | 4  | 自包含 | 4.00 | **A** |
| LiquidMetalButton            | 按钮 | 5  | 4  | 4  | 4  | 自包含 | 4.30 | **A** |
| GradientBeamCta              | 按钮 | 4  | 5  | 4  | 4  | 自包含 | 4.25 | **A** |
| NeonTypography               | 文字 | 5  | 4  | 4  | 3  | 自包含 | 4.10 | **A** |
| GalleryHeading               | 文字 | 3  | 5  | 4  | 5  | 自包含 | 4.15 | **A** |
| ParticleWordmark             | 文字 | 4  | 4  | 4  | 4  | 自包含 | 4.00 | **A** |
| TextAnimationCollection      | 文字 | 4  | 4  | 4  | 3  | 自包含 | 3.80 | **A** |
| TypographyVortexCanvas       | 文字 | 5  | 3  | 4  | 3  | 自包含 | 3.85 | **A** |
| OrbitalSphereBackground      | 背景 | 5  | 3  | 5  | 3  | 自包含 | 4.10 | **A** |
| NebulaBackground             | 背景 | 5  | 3  | 4  | 3  | 自包含 | 3.85 | **A** |
| LiquidFormBackground         | 背景 | 5  | 3  | 4  | 3  | 自包含 | 3.85 | **A** |
| AnimatedTopDock              | UI | 4  | 5  | 4  | 4  | 自包含 | 4.00 | **A** |
| SkeuomorphicToggleCollection | UI | 4  | 5  | 3  | 4  | 自包含 | 4.00 | **A** |
| ThreeUIIntro                 | UI | 3  | 5  | 4  | 5  | 自包含 | 4.15 | **A** |
| UplinkLoader                 | UI | 4  | 5  | 3  | 5  | 自包含 | 4.20 | **A** |
| EditorialIntroSection        | 区块 | 4  | 5  | 4  | 4  | 自包含 | 4.00 | **A** |
| NewsletterFooterSection      | 区块 | 4  | 4  | 4  | 4  | 自包含 | 4.00 | **A** |
| WarpFieldBackground          | 背景 | 4  | 3  | 4  | 3  | 自包含 | 3.55 | B     |
| CloudField                   | 背景 | 4  | 3  | 4  | 3  | 自包含 | 3.55 | B     |
| Gallery                      | 画廊 | 4  | 3  | 4  | 3  | 待验证 | 3.55 | B     |
| CharacterCarousel            | 画廊 | 4  | 4  | 3  | 3  | 待验证 | 3.55 | B     |
| KoiStudies                   | 场景 | 5  | 3  | 3  | 2  | 待验证 | 3.40 | B     |
| TempleNightScene             | 场景 | 5  | 2  | 3  | 2  | 待验证 | 3.15 | B     |
| LandscapeScene               | 场景 | 5  | 2  | 3  | 2  | 待验证 | 3.15 | B     |
| JapaneseTowerLandscape       | 场景 | 5  | 2  | 3  | 2  | 待验证 | 3.15 | B     |
| SylvaLivingWorldScene        | 场景 | 5  | 2  | 3  | 2  | 待验证 | 3.15 | B     |
| BookshelfScene               | 场景 | 4  | 2  | 3  | 2  | 待验证 | 2.85 | B     |

**S 级（首屏/核心 CTA，必做）：** GradientCta、GlassmorphismCta、SpinningBorderButton、LumenCta、GradientPillButton  
**A 级（推荐，构成页面骨架）：** ConstellationField、ParticleDrift、OrbitalSphereBackground、NebulaBackground、LiquidFormBackground、LiquidMetalButton、GradientBeamCta、NeonTypography、GalleryHeading、ParticleWordmark、TextAnimationCollection、TypographyVortexCanvas、AnimatedTopDock、SkeuomorphicToggleCollection、ThreeUIIntro、UplinkLoader、EditorialIntroSection、NewsletterFooterSection  
**B 级（展示型，按需，多需资产验证）：** 背景 WarpField/CloudField、Gallery、CharacterCarousel、各 Three.js 场景

#### 4.3 与既有 reactbits / magic-ui 的差异化（避免重复造轮子）

| 用途       | 既有组件                                  | ThreeUI 替代/增补价值                                                          | 决策                                            |
| -------- | ------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------- |
| 全屏背景     | LightRays(ogl)、Silk(本期规划)             | ConstellationField / OrbitalSphereBackground 是 three.js 着色器级星空/轨道，视觉更「深」 | **并存**：ThreeUI 用于新 /demo-threeui 橱窗页与 /home-threeui hero 页，不替换首页 LightRays |
| 主 CTA 按钮 | ShimmerButton(magic-ui)               | LiquidMetalButton / GlassmorphismCta / GradientBeamCta 是玻璃/液态金属/光束质感     | **增补**：新页用 ThreeUI 按钮体现差异                     |
| 文字揭示     | DecryptedText / ShinyText / SplitText | NeonTypography / ParticleWordmark 是 3D 霓虹/粒子字                            | **增补**：新页标题用 ThreeUI 文字                       |
| 顶部导航     | 极简 ThemeToggle header                 | AnimatedTopDock 是 macOS 风动效 Dock                                         | **可选**：替换新页顶栏                                 |
| 主题开关     | ThemeToggle                           | SkeuomorphicToggleCollection 拟物开关                                        | **可选**：展示型，不替换正式开关                            |
| 卡片       | TiltedCard / SpotlightCard            | ThreeUI 无等价轻卡片（Gallery 偏画廊）                                              | **不引入**，沿用 reactbits                          |

> 原则：**ThreeUI 用于「/demo-threeui 组件橱窗页」+「/home-threeui hero 页」与首页背景的可选增强**，不与 reactbits 抢同一位置，保证视觉多样性。

---

### 五、新页面设计方案

#### 5.1 路由与定位

- **新路由：`/demo-threeui`**（独立于 `/creative`、`/demo`，专做 ThreeUI 组件橱窗）与 **`/home-threeui`**（Sylva hero 介绍自己）
- 定位：「3D 视觉实验室」——用 ThreeUI 组件拼出一个有首屏冲击、可滚动浏览、带真实数据（复用 `@/data/profile`）的展示页，同时作为未来首页背景/按钮的「试验田」。

#### 5.2 区块结构（自上而下）

| # | 区块        | 用到的 ThreeUI 组件                                                        | 数据来源                   | 备注                                   |
| - | --------- | --------------------------------------------------------------------- | ---------------------- | ------------------------------------ |
| 0 | 顶栏        | `AnimatedTopDock`（可选，替代极简 header）                                     | 路由链接                   | `aria-hidden` 装饰，链接可点                |
| 1 | Hero 背景   | `ConstellationField`（或 `OrbitalSphereBackground`）                     | —                      | 全屏 `fixed -z-10 pointer-events-none` |
| 2 | Hero 标题   | `NeonTypography`（站点名）+ `ParticleWordmark`（标语）                         | profile.name / tagline | 暗黑模式传色                               |
| 3 | Hero CTA  | `GradientCta` / `GlassmorphismCta` / `SpinningBorderButton`           | —                      | 三个并排演示不同质感                           |
| 4 | 编辑器引言     | `EditorialIntroSection`                                               | profile.bio            | 复用 bio 首段                            |
| 5 | 按钮橱窗      | `LiquidMetalButton` `GradientBeamCta` `LumenCta` `GradientPillButton` | —                      | 网格陈列，hover 演示                        |
| 6 | 文字动画橱窗    | `TypographyVortexCanvas` `TextAnimationCollection` `GalleryHeading`   | profile.projects 名     | 滚动入场                                 |
| 7 | 场景/画廊（可选） | `Gallery` 或 `CharacterCarousel` 或某场景                                  | profile.projects       | **需资产验证**                            |
| 8 | 加载态演示     | `UplinkLoader`                                                        | —                      | 区块间过渡/loading 展示                     |
| 9 | 页脚        | `NewsletterFooterSection`                                             | profile.email / social | 订阅/联系型页脚                             |

#### 5.3 视觉与主题衔接

- 复用站点 CSS 变量：容器圆角 `var(--radius-card)`、强调色 `var(--accent)` / `var(--accent-light)`、玻璃 `var(--glass-bg)`。
- ThreeUI 组件颜色 props 优先传站点变量值（如 `accent={isDark ? "#7ba3f5" : "#3b5ccc"}`），保证明暗一致；不支持 prop 的用全局 CSS 覆写（`@designcodeio/threeui/style.css` 之后 import 的覆写层）。
- 字体沿用 `--font-display`(Space Grotesk) 作展示标题。

#### 5.4 无障碍与性能

- 每个 WebGL 组件外裹 `ThreeUIClient`（见 §六），`useReducedMotion` 为 true 时渲染静态占位（纯 CSS 渐变 / 文字），不初始化 WebGL。
- `IntersectionObserver` 暂停离屏 canvas（requestAnimationFrame 节流 / `renderer` 暂停），控制全页最多 1 个全屏背景 + 局部组件懒挂载。
- `dpr` 上限设 `Math.min(devicePixelRatio, 2)`；移动端默认降一档质量或改用静态图。
- 全部装饰组件 `aria-hidden="true"`。

#### 5.5 页面代码骨架（实测修正版）

> ⚠️ **实测关键结论（已核对 `lib-dist` 类型定义）：** ThreeUI 的「效果类」组件
> （`ConstellationField` / `NeonTypography` / `GradientCta` / `GlassmorphismCta` 等）
> **props 仅为 `mode` / `hue` / `saturation` / `brightness` / `className` / `style`，
> 不接收 `text` / `children` / `label` / `href`**。它们渲染自身内置视觉，无法注入站点文案。
> 因此本页定位为 **「ThreeUI 组件橱窗 / 实验室」**：真实站点名用自有 `<h1>`，ThreeUI 组件作实时演示。

**组件目录（已落实）：** `src/components/threeui/threeui-client.tsx`
- `ThreeUIClient`：统一 Client 包装（mounted 守卫 + `useReducedMotion` 静态降级 + `aria-hidden`）。
- `useThreeUIMode()`：按站点主题返回 `"light" | "dark"`，驱动组件 `mode` prop。
- 各组件用 `next/dynamic(() => import("@designcodeio/threeui/components/<Name>"), { ssr:false })` 按需引入，避免 SSR 触碰 WebGL/window。

**页面（已落实）：** `src/app/threeui/page.tsx`
- 全屏背景：`ConstellationField`（mode/hue 跟随主题）。
- Hero：自有 `<h1>{profile.name}</h1>` + 真实 CTA 链接（站内外导航用自有按钮）。
- 展示区：`NeonTypography` / `ParticleWordmark`（文字着色器卡片）+ 7 个着色器按钮（GradientCta / GlassmorphismCta / LiquidMetalButton / GradientBeamCta / LumenCta / GradientPillButton / SpinningBorderButton）实时演示。

```tsx
// 真实可用写法（节选）
const ConstellationField = dynamic(
  () => import("@designcodeio/threeui/components/ConstellationField").then((m) => m.ConstellationField),
  { ssr: false },
);
// 背景：仅传模式/色相，不传文案
<ConstellationField mode={mode} hue={220} variant="constellation-field" />
// 标题用站点自身文本，不交给 ThreeUI
<h1>{profile.name}</h1>
// 按钮为组件内置标签的演示
<GradientCta mode={mode} hue={220} />
```

> 注意：`hue` 为 HSL 色相（0–360），站点蓝 `#3b5ccc`≈220。组件标签为内置，无法自定义（已在页面加说明文案）。

---

### 六、集成落地步骤（Checklist）

1. **安装依赖**
   ```bash
   pnpm add @designcodeio/threeui
   ```
   （无需 R3F/drei；three 已由项目提供。）
2. **处理 three 多实例（如报重复实例）**：组件内 `three128`/`three165` 为别名，若出现 context 报错，可在 `next.config.ts` 加 `transpilePackages: ["@designcodeio/threeui"]`；体积敏感可后续用 `resolve.alias` 收敛。
3. **资产复制（仅 B 级场景/画廊需要）**：
   ```bash
   cp -r node_modules/@designcodeio/threeui/lib-dist/assets public/threeui-assets
   ```
   或给组件传 `assetBaseUrl="/threeui-assets"`。
4. **建包装层** `src/components/threeui/threeui-client.tsx`（§5.5）。
5. **建页面** `src/app/threeui/page.tsx`，按 §5.2 区块组装；先只放 S/A 级自包含组件验证跑通。
6. **样式接入**：在 `globals.css` 或页面 css 中 `import "@designcodeio/threeui/style.css"`（注意 sideEffects，确保被打包）。
7. **构建校验**（本项目专属，PersonalSite build 前需先 unset 三个环境变量）：
   ```bash
   unset CODEBUDDY_SAFE_DELETE_BULK_STATE_DIR
   unset CODEBUDDY_TOOL_CALL_ID
   unset NODE_OPTIONS
   pnpm build
   ```
8. **本地预览**：`pnpm dev -p 12001`，浏览器开 `http://localhost:12001/threeui`，看 console 有无 404 资产、hydration warning。

---

### 七、技术约束与风险

| 风险              | 说明                                        | 缓解                                                      |
| --------------- | ----------------------------------------- | ------------------------------------------------------- |
| three 多实例       | 包内 `three128`/`three165` 别名额外体积（约 +数百 KB） | 先观察 bundle；必要时 alias 收敛到项目 three                        |
| SSR / Hydration | WebGL 组件触 `window`/`document`             | 统一 `ThreeUIClient` 的 `mounted` 守卫 + `ssr:false` 动态引入    |
| 资产 404          | 场景/画廊类需复制 assets                          | 先只上自包含组件；B 级引入前本地验证                                     |
| 暗黑模式            | ThreeUI 内置色不跟随 `--accent`                 | 传色 prop 或加覆写 CSS 层                                      |
| 移动端性能           | 全屏着色器背景耗电/掉帧                              | `dpr≤2`、离屏暂停、reduced-motion 降级                          |
| 自定义 Next 版本     | 本项目 Next 16 非训练分布版本（AGENTS.md 提示）         | 写代码前先读 `node_modules/next/dist/docs/` 确认 App Router API |
| Bundle / 首屏     | 多 WebGL 同屏                                | 单页 ≤1 全屏背景 + 局部懒挂载；`next/dynamic` 拆包                    |

---

### 八、实施路线图

```
阶段一（落地验证，1–2 天）── 跑通最小闭环
├── 安装 @designcodeio/threeui
├── 建 ThreeUIClient 包装层
├── /threeui 页：ConstellationField(背景) + NeonTypography(标题) + GradientCta/GlassmorphismCta(CTA)
└── pnpm build + localhost:12001 验证无报错

阶段二（橱窗成型，3–5 天）── 补齐 S/A 级自包含组件
├── 按钮橱窗：LiquidMetalButton / GradientBeamCta / LumenCta / GradientPillButton / SpinningBorderButton
├── 文字动画：ParticleWordmark / TypographyVortexCanvas / TextAnimationCollection / GalleryHeading
├── 区块：EditorialIntroSection + NewsletterFooterSection（接 profile 数据）
├── 可选 UI：AnimatedTopDock / SkeuomorphicToggleCollection / ThreeUIIntro / UplinkLoader
└── 全站 reduced-motion 降级 + 暗黑模式色覆写

阶段三（展示增强，按需）── B 级场景/画廊
├── 资产复制 + Gallery / CharacterCarousel
├── 单个 Three.js 场景（如 KoiStudies / TempleNightScene）作页内焦点
└── 性能压测（移动端 dpr / 离屏暂停）
```

**建议下一步：** 先确认是否直接落地 `/threeui` 页（阶段一），还是仅把 ThreeUI 背景/按钮作为「首页可选增强」试用。确认后我可据此把阶段一代码直接写入 `src/`。

---

### 九、实际落地记录（v1 已实施 · 2026-09-03）

> 用户确认：组件落 `src/components/threeui/`，并直接落地 `/threeui` 页面一版。

**已创建/修改文件：**
| 文件 | 说明 |
|------|------|
| `src/components/threeui/threeui-client.tsx` | 统一 Client 包装层 + `useThreeUIMode` + 多个 `dynamic(ssr:false)` 组件再导出（含场景类 SylvaLivingWorldScene、文字类 SemanticBloom、按钮类 LiquidMetalButton/LumenCta 等） |
| `src/app/demo-threeui/page.tsx` | 原 `/threeui` 展示页（已更名）：ConstellationField 背景 + 自有 Hero + NeonTypography/ParticleWordmark 文字卡 + 7 个着色器按钮演示 |
| `package.json` | 新增依赖 `@designcodeio/threeui@1.2.0`（peer 已满足，未新增 R3F） |
| `docs/前端ui/threeui/ThreeUI组件选型与页面设计.md` | 本档 §5.5 修正 + 本节记录 |

**实测要点（与最初设想的偏差）：**
1. 组件为「着色器效果」，无 `text`/`children` 属性 → 页面改为 **组件橱窗**，真实文案用站点自有标签。
2. 采用 `next/dynamic({ ssr:false })` 子路径引入，规避 SSR 期 WebGL/window 访问与 hydration 风险。
3. `mode`（light/dark）+ `hue`（≈220 蓝）跟随站点主题，保证明暗一致。

**验证状态：** ✅ `pnpm build` 已通过（Next 16.2.11 Turbopack，TypeScript 干净，`/threeui` 静态预渲染成功，动态子路径引入均解析正常）。本地预览：`pnpm dev -p 12001` → `http://localhost:12001/threeui`。

**未决 / 待观察：**
- 组件内置按钮标签是否链接到 threeui.com（橱窗页可接受；若上首页需评估）。
- `three128`/`three165` 别名带来的额外 three 体积（构建后看 bundle 报告）。

---

### 九-b、v2 更新（2026-09-03 晚）

> 用户要求：把 Sylva hero（<https://threeui.com/hero/sylva>）做成 `home-threeui` 页面的 hero 介绍自己；原 `/threeui` 页更名 `/demo-threeui`。

**已创建/修改文件：**
| 文件 | 说明 |
|------|------|
| `src/app/demo-threeui/page.tsx` | 由 `src/app/threeui/page.tsx` 更名而来（路由 `/threeui` → `/demo-threeui`），顶栏新增「ThreeUI Hero ↗」互访链接 |
| `src/app/home-threeui/page.tsx` | **新增** hero 页（v2 初版用 `SylvaHero` iframe，已于 v4 改用 `SylvaLivingWorldScene` 场景组件，见 §九-d） |
| `src/components/threeui/threeui-client.tsx` | 新增 `SylvaHero` 的 `dynamic(ssr:false)` 再导出（子路径 `@designcodeio/threeui/components/SylvaHero`） |
| `public/landing-pages/inner-green-3d.html` + `inner-green-assets/` | 从包内 `lib-dist/assets/landing-pages/` 复制（SylvaHero iframe 默认硬编码加载 `/landing-pages/inner-green-3d.html`，资产相对引用已校验全部存在） |

**SylvaHero 实测要点（关键）：**
1. `SylvaHero` 是**落地页型组件**，通过 `<iframe src="/landing-pages/inner-green-3d.html">` 加载打包 HTML；中文案「Sylva — Into the living world」刻进 HTML，**无 props 可改姓名/自我介绍**。
2. 其 props 仅 `className` / `srcDoc` / `style` + 排版项（`primaryColor` / `headingFont` / `headingSize` 等，见 `PageTypographyProps`）——可用于整体换色/换字体，**不改文案**。
3. 因此 `home-threeui` 的定位是：**Sylva 场景作全屏背景，真实姓名/简介用页面自有 DOM 叠加**（白字 + 底部渐隐遮罩保证可读），与 v1 的「组件橱窗 + 自有 h1」模式一致。
4. iframe `sandbox` 含 `allow-scripts allow-same-origin`，由 `ThreeUIClient` 在挂载后渲染（`useReducedMotion` 时降级为绿色径向渐变）。

**验证状态：** ✅ `pnpm build` 已通过（Next 16.2.11 Turbopack，TypeScript 干净，`/demo-threeui` 与 `/home-threeui` 均静态预渲染成功，SylvaHero 子路径引入解析正常）。本地预览：`pnpm dev -p 12001` → `http://localhost:12001/home-threeui` 与 `http://localhost:12001/demo-threeui`。

**待观察：**
- 绿色「living world」场景与站点蓝色强调色是否需 `primaryColor` 收敛（当前保留 Sylva 默认绿调以保真，文档已注明可改）。
- Sylva iframe 为完整落地页（含下方 ethos 卡片区），本页仅取其首屏 hero 场景作固定背景，滚动不联动 iframe。
- 场景/画廊类（B 级）仍需复制 `lib-dist/assets` 并本地验证 404。

---

### 九-c、v3 清理 Sylva 模板 UI（2026-09-03 晚）

> 用户反馈：截图显示 Sylva 模板自己的文案/卡片（"Step into the living world"、"Explore the work"、"Our Ethos" 等）与自有内容重叠，要求页面完全改成自己的。

**问题根因**：`SylvaHero` 加载的是完整落地页 HTML，模板导航/标题/描述/卡片/按钮全部写死在 HTML 里，props 无法关闭。

**解决方案**：直接修改复制到 `public/landing-pages/inner-green-3d.html` 的资产，在 `<head>` 末尾注入一段 CSS，把模板 UI 全部隐藏，只保留 `<canvas id="scene">` 3D 场景：

```css
.dock-wrap,
.ghost,
.card,
.headline,
.lede,
.pill-clip,
.play-wrap,
.stat,
.knob-float,
.guides {
  display: none !important;
}
```

**同步调整**：`src/app/home-threeui/page.tsx` 的 hero 叠加层改为 `items-center text-center`，CTA 按钮 `justify-center`，在干净背景下更平衡。

**验证状态：** ✅ `pnpm build` 已通过（Next 16.2.11 Turbopack，TypeScript 干净，`/home-threeui` 静态预渲染成功）。刷新 `http://localhost:12001/home-threeui` 后，Sylva 模板 UI 应已消失，只剩 3D 背景 + 你的姓名/简介/按钮。

**注意**：`inner-green-3d.html` 是经本项目定制后的资产；升级 `@designcodeio/threeui` 时需重新复制并保留这段隐藏 CSS。若未来 ThreeUI 更新导致 DOM 结构变化，需重新核对这些 selector。

---

### 九-d、v4 改用 Sylva 场景组件 + ThreeUI 文字/按钮组件构建 hero（2026-09-03 晚）

> 用户要求：① 删除上一版复制的完整 HTML（`public/landing-pages/`）；② 引入 <https://threeui.com/three-js/sylva-living-world> 这个**场景专用**组件；③ 在该组件之上，用 ThreeUI 的「其他组件」构建符合本项目的 hero 区域。

**① 删除 iframe 资产**
- 已 `rm -rf public/landing-pages`（`inner-green-3d.html` + `inner-green-assets/` 一并移除）。`SylvaHero`（iframe 版）导出同步从 `threeui-client.tsx` 移除。

**② 引入 `SylvaLivingWorldScene`（场景专用）**
- 包内已存在 `@designcodeio/threeui/components/SylvaLivingWorldScene`（import 自 `shaders/sylva-living-world/SylvaLivingWorldScene`）。
- 关键差异 vs `SylvaHero`：**它是纯 Three.js 场景，模板 UI 已移除**（`presentation: fixed / Scene only; source page UI removed`），`variant` 当前仅 `"living-green"`，props 仅 `variant`/`className`/`style`，**无需 iframe、无需复制打包 HTML、无硬编码文案**。
- 子路径已验证可解析（`require.resolve('@designcodeio/threeui/components/SylvaLivingWorldScene')` → OK）。

**③ 用 ThreeUI「其他组件」构建 hero（关键发现：包内存在可自定义文字的组件）**
经核查 `lib-dist` 全部 `.d.ts`，除着色器效果类（无 text/children）外，包内确有**接受自定义文字**的组件，正好用于 hero 文案与 CTA，且**无硬编码外链**（`threeui.com`/`href`/`window.open`/`location.href` 均未出现；`onClick` 仅为受控 prop）：

| 组件 | 自定义文字 prop | 其它关键 prop | 在 hero 中的用途 |
|------|----------------|--------------|------------------|
| `SemanticBloom` | `text?`（默认 "Codex"，渲染传入文字） | `mode:"dark"\|"light"`、`size`（0.55–1.6，控制 `clamp(4rem,12vw,11rem)`）、`opacity` | **姓名**发光标题（自定义 `text={profile.name}`） |
| `LiquidMetalButton` | `text?` | `variant:"pill"\|"circle"\|"play"`、`onClick` | **查看作品** CTA（pill + `router.push('/creative')`） |
| `LumenCta` | `label?`（默认 "Get your card"） | `variant:"primary"\|"ghost"`、`mode:"light"\|"dark"`、`onClick` | **联系我** CTA（`mailto`） |

**`home-threeui` 新 hero 组合（场景之上叠加）**
```
SylvaLivingWorldScene (variant="living-green")  ← 全屏 3D 背景层（ThreeUIClient / ssr:false / 降级绿色径向渐变）
  └─ SemanticBloom text={profile.name} mode="dark" size={1}   ← 姓名（发光文字，ThreeUI 组件）
  └─ 自有 role·location / tagline / intro（framer-motion DOM）  ← 真实自我介绍
  └─ LiquidMetalButton "查看作品" + LumenCta "联系我" + 自有"简历" Link  ← CTA 区
```
- 姓名处保留一个 `sr-only <h1>{profile.name}</h1>` 保证无障碍/SEO（SemanticBloom 为 `ssr:false` 动态组件，首屏不进 HTML）。
- `SylvaLivingWorldScene` 仍由 `ThreeUIClient` 守卫（`useReducedMotion` 时降级为静态绿色渐变）；姓名/CTA 不在守卫内，reduced-motion 用户仍可见文案与按钮。

**已修改文件**
| 文件 | 说明 |
|------|------|
| `src/components/threeui/threeui-client.tsx` | `SylvaHero` → `SylvaLivingWorldScene`；新增 `SemanticBloom` / `LiquidMetalButton` / `LumenCta` 三个 `dynamic(ssr:false)` 导出；注释同步更新 |
| `src/app/home-threeui/page.tsx` | 重写为「SylvaLivingWorldScene 背景 + SemanticBloom 姓名 + LiquidMetalButton/LumenCta CTA + 自有 role/tagline/intro」的 hero |
| `public/landing-pages/` | **已删除**（不再需要 iframe 资产） |

**验证状态：** ✅ `pnpm build` 已通过（Next 16.2.11 Turbopack，TypeScript 干净，`/home-threeui` 与 `/demo-threeui` 均静态预渲染成功，SylvaLivingWorldScene/SemanticBloom/LiquidMetalButton/LumenCta 子路径引入均解析正常）。本地预览：`pnpm dev -p 12001` → `http://localhost:12001/home-threeui`。

**待你在浏览器确认的点**
- `SemanticBloom` 的 `mode`：`"dark"` 在绿色场景上应为浅色发光字；若偏暗，改 `mode="light"` 或传 `className` 覆盖文字色。
- `SemanticBloom` 的 `size`：默认 1（≈ `clamp(4rem,12vw,11rem)`），长名字可下探到 0.7–0.8 防止溢出。
- `LumenCta` 的 `mode="light"`：在暗绿背景上取亮色 CTA；若对比不足可调 `hue`/`saturation`/`brightness` 或改 `variant="ghost"`。
- `three128`/`three165` 别名带来的额外 three 体积（构建后看 bundle 报告）。

---

### 九-e、v5 回退 SylvaHero iframe 并完整定制落地页文案（2026-09-03 晚）

> 用户反馈：v4 的 `SylvaLivingWorldScene` 场景版「偏暗、不够舒畅」，且叠加的自有内容挡住了背景；更喜欢之前 iframe 完整落地页的明亮色调、粒子、树枝、以及鼠标悬停树枝的动态交互。要求：① 恢复完整 HTML；② 引入 `https://threeui.com/three-js/sylva-living-world` 这个组件（实际仍使用 `SylvaHero` 落地页组件，因为它就是该场景所在的完整页面）；③ 把页面改成自己的内容，而不是在场景上再叠加一层。

**关键决策：回退到 `SylvaHero` iframe，但直接修改 iframe 内的文案**
- `SylvaHero` 加载 `/landing-pages/inner-green-3d.html`（完整落地页 HTML），里面自带鼠标悬停交互、视差卡片、液态金属按钮、入场动画、明亮光照——这些正是用户觉得「舒畅」的来源。
- `SylvaLivingWorldScene` 只是抽离出来的裸 Three.js 场景，因此更暗、更单调、缺少原版的 UI 动效。
- 与其在场景上再叠一层自己的 DOM 造成遮挡，不如**直接修改落地页 HTML 里的默认文案**为自己的内容，保留全部原生交互。

**已修改文件**

| 文件 | 说明 |
|------|------|
| `public/landing-pages/inner-green-3d.html` | **重新复制**并**定制文案**：标题/描述、`headline`（YunYu / 全栈工程师）、`lede`、dock 导航（首页/作品/笔记/联系）、卡片标签与标题、统计数字、按钮文字等，全部改为个人内容 |
| `public/landing-pages/inner-green-assets/` | 重新复制（SylvaHero iframe 的配套静态资源） |
| `scripts/customize-sylva.py` | 新增定制脚本，用可维护的 `old→new` 替换表把 Sylva 默认文案改写为个人内容，便于后续升级 threeui 包后重新运行 |
| `src/components/threeui/threeui-client.tsx` | 恢复 `SylvaHero` 的 `dynamic(ssr:false)` 导出；保留 `SylvaLivingWorldScene` 等其它导出 |
| `src/app/home-threeui/page.tsx` | 简化为只渲染 `SylvaHero` 全屏 iframe，不再叠加任何自有 DOM，避免遮挡原版内容 |

**文案替换明细（由 `scripts/customize-sylva.py` 执行）**

| 原 Sylva 文案 | 替换为 |
|------|------|
| `Sylva — Into the living world` | `YunYu — 全栈工程师` |
| `Restoring wild places...` | `YunYu 的个人站点 — 一名在 Web 开发领域深耕五年的全栈工程师...` |
| Dock: `Grove / Habitats / Journal / Enter` | `首页 / 作品 / 笔记 / 联系` |
| Ghost watermark `SYLVA` | `YUNYU` |
| `Our Ethos` / `Let the wild lead.` | `关于我` / `以代码写诗，以架构作画` |
| `Step into / the living world` | `YunYu / 全栈工程师` |
| `We restore wild places...` | `一名在 Web 开发领域深耕五年的全栈工程师...` |
| `Explore the work` | `查看作品` |
| `Play the film` | `关于我` |
| `Canopy restored / 282 ha` | `Web 开发经验 / 5 年+` |
| `Native species / 43 mapped` | `主要技术栈 / React / Next.js` |
| `Field Note 07 / After the Rain` | `精选项目 / 微前端治理平台` |
| `Discover` | `向下探索` |

**跳转逻辑（iframe 内 → 父页面）**
- 所有需要离开当前页的链接/按钮都使用**同源 `top`** 跳转：
  - Dock `<a href="/" target="_top">`、`<a href="/creative" target="_top">`、`<a href="/blog" target="_top">`、`<a href="mailto:..." target="_top">`
  - 按钮 `onclick="top.location.href='/creative'"`
- 因 iframe 与父页面同域（均来自本站），`top.location.href` 与 `target="_top"` 都能正常跳出 iframe。

**视觉与交互保留**
- 原版 Sylva 的明亮光照、绿色苔藓场景、粒子、鼠标悬停树枝发光/视差、液态金属按钮、入场动画、卡片扫描效果全部保留。
- 不再叠加任何外部 DOM，页面内容完全来自 ThreeUI 自己的落地页排版。

**验证状态：** ✅ `pnpm build` 已通过（Next 16.2.11 Turbopack，TypeScript 干净，`/home-threeui` 与 `/demo-threeui` 均静态预渲染成功，`SylvaHero` 子路径引入解析正常）。本地预览：`pnpm dev -p 12001` → `http://localhost:12001/home-threeui`。

**维护提示**
- 升级 `@designcodeio/threeui` 后，需要重新把 `inner-green-3d.html` + `inner-green-assets/` 复制到 `public/landing-pages/`，然后重新运行 `python3 scripts/customize-sylva.py`。
- 若 ThreeUI 改了 HTML 结构导致脚本替换失败，脚本会打印「未匹配」警告，需人工核对 selector。

**待你在浏览器确认**
- iframe 内的中文字体：默认使用 `Lexend`（仅支持拉丁字符），中文会 fallback 到系统字体，可能略细；若需统一，可在 `inner-green-3d.html` 的 `<head>` 中注入中文字体 CSS。
- 暗色模式下页面仍较亮（Sylva 原版设计），若要与站点暗色主题更协调，可给 `SylvaHero` 传 `primaryColor` / `headingFont` / `bodyFont` 等排版项，或在 iframe CSS 中降低整体亮度。

---

### 九-f、v6 拆分「官方包导入」与「当前实现备份」（2026-09-03 晚）

> 用户看到 ThreeUI 官方 skill 示例：`import { SylvaHero } from "@designcodeio/threeui"` + `import "@designcodeio/threeui/style.css"` + 排版 props（variant/headingFont/…），认为「好像引入这个就可以了」。要求：① 把当前实现（v5）新开一个页面保留为「back」；② 用官方包导入方式重写 `/home-threeui`。

**核实结论（实测，推翻 skill 片段里的两处写法）**
- ✅ `SylvaHero` 确实从包**根**导出（`lib-dist/index.d.ts` 第 89 行 `export { SylvaHero } from "./package-components/SylvaHero"`），`style.css` 在 `@designcodeio/threeui/style.css`——「直接 import 即可」成立。
- ⚠️ 已装 v1.2.0 的 `SylvaHero` 真实 props = `LandingPageProps & PageTypographyProps` = `className`/`srcDoc`/`style` + **`headingFont`/`bodyFont`/`headingWeight`/`bodyWeight`/`primaryColor`/`headingSize`/`bodySize`/`headingLetterSpacing`**。**没有 `variant` 字段**（skill 里 `variant="living-green"` 属于另一个 Codex 专用构建，非 Community v1.2.0）。
- ⚠️ 排版 props 经 `postMessage`（`PAGE_CUSTOMIZATION_BRIDGE`）注入**同源 iframe** 的 `<head>` 生效；因此仍需 `public/landing-pages/inner-green-3d.html` 这个资产，且 headline 文字仍刻在 HTML 里（`"Sylva"`），改名字仍需定制 HTML——v5 的 `customize-sylva.py` 已经做了。

**实施**
- `src/app/home-threeui-back/page.tsx`（新增，v5 备份）：内容与 v5 的 `home-threeui` 完全一致——通过 `threeui-client` 的 `SylvaHero`（`dynamic ssr:false` + `ThreeUIClient` mounted/reduced-motion 守卫）渲染全屏 iframe，加载定制后的 `inner-green-3d.html`（YunYu 内容）。保留以防包导入方案不满意时回退。
- `src/app/home-threeui/page.tsx`（重写，官方包导入）：`"use client"` + `import "@designcodeio/threeui/style.css"` + `const SylvaHero = dynamic(() => import("@designcodeio/threeui/components/SylvaHero")..., { ssr:false })`，传入 `headingFont/bodyFont/headingWeight/bodyWeight/headingSize/bodySize/headingLetterSpacing`，**不传 `variant`（v1.2.0 无此字段）、不传 `primaryColor`（保留原版明亮绿调）**。仍加载定制 HTML，故显示 YunYu 内容。
- `public/landing-pages/` 资产（v5 复制的定制 HTML + `inner-green-assets/`）两个页面共用，无需改动。

**验证状态：** ✅ `pnpm build` 已通过（`/home-threeui`、`/home-threeui-back`、`/demo-threeui` 均静态预渲染成功，包根 `SylvaHero` 子路径引入解析正常）。

**待你在浏览器确认**
- 两者视觉应一致（同一份定制 HTML + 同一份场景）；`/home-threeui` 多了排版 props 注入（字体 lexend / 字重 300 / headingSize 63），若与 `/home-threeui-back` 有差异即来自这些 props。
- 如需 `primaryColor` 收敛到站点蓝（`#5b8def`）或压暗，可给 `/home-threeui` 的 `SylvaHero` 加 `primaryColor="#5b8def"` 观察效果。
- 若想验证「纯包导入不定制」的样子：把 `public/landing-pages/inner-green-3d.html` 换成包内原始文件（去掉 `customize-sylva.py` 的改动），会显示默认 "Sylva" 文案——仅作对照，不建议长期保留。

