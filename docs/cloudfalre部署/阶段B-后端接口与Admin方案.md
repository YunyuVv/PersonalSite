# 阶段 B 方案：后端接口 + Admin 页面 + 写回 GitHub 触发重建

> 目标：在「静态 Cloudflare 部署」原则不变的前提下，增加一个**后端 API 接口**和一个 **`/admin` 页面**。
> 在 admin 页面修改内容并保存时，由**后端接口**把对应数据文件写回 GitHub 仓库，
> 由 Cloudflare 已有的自动构建/部署流水线重新生成静态站点。

---

## 0. 为什么走「后端接口写 GitHub」，而不是阶段 A 文档里的「前端直连 GitHub」

| 维度 | 阶段 A 文档方案（前端直连 GitHub） | 本方案（后端接口写 GitHub） |
|------|-----------------------------------|------------------------------|
| GitHub Token 位置 | **暴露在前端**（localStorage），被盗即用 | **仅存于 Cloudflare secret**，前端永不见 | 
| 安全性 | 低：token 可被任意访客从浏览器拿到 | 高：token 不出服务端 |
| 写文件能力 | 前端直接 PUT 仓库文件 | 后端代理 PUT，可加校验/限流 | 
| 对「静态部署」的影响 | 无 | 无（接口跑在 Worker 里，仍是同一套部署） |
| 复杂度 | 低 | 中（多一个 route handler + secret 配置） |

结论：**后端接口方案更安全、更可控，且完全兼容静态 Cloudflare 部署**。本方案采用它。

---

## 1. 技术前提（已在本项目验证）

- `opennextjs-cloudflare@^1.20.2` 支持 App Router **Route Handler**，会把它编译为 Cloudflare Worker 函数。
- 在 route handler 内可用 `import { getCloudflareContext } from "@opennextjs/cloudflare"` 取得 Worker 绑定：
  ```ts
  const { env } = getCloudflareContext();
  const token = env.GITHUB_TOKEN; // 来自 Cloudflare secret
  ```
- Worker 可对外发起 `fetch`（subrequest），能直接调用 GitHub REST API。
- 现有 `build:worker` / `deploy:worker` 脚本与 `wrangler.jsonc` 无需改部署形态，仅补充 secret/vars。

---

## 2. 架构与数据流

```
┌────────────────┐   ① 打开 /admin（服务端组件，读 Cookie 鉴权）
│  浏览器         │── 未登录/口令不符 ─► 307 重定向到 /admin/login
│  /admin         │── 已登录 ──────────► 读取 site-content.json 预填表单
└────────┬───────┘
         │ ② /admin/login 提交口令 → POST /api/admin/login
         │   校验 env.ADMIN_KEY，成功下发 HttpOnly Cookie（admin_session）
         ▼
┌────────────────┐   ③ 保存：POST /api/admin/update（浏览器自动带 Cookie）
│  Worker        │   ④ 校验 Cookie / x-admin-key（取自 env.ADMIN_KEY）
│  /api/admin/   │   ⑤ GET  GitHub 取文件 sha
│  update        │   ⑥ PUT  GitHub 写回 src/data/site-content.json（base64 + sha）
└────────┬───────┘
         │ ⑦ git push（GitHub 自动收到 commit）
         ▼
┌────────────────┐   ⑧ Cloudflare 自动构建（build:worker）→ 生成新静态站点
│  Cloudflare    │      内容随 JSON 变化而更新
└────────────────┘
```

**鉴权要点（已实现）**：
- 未登录访问 `/admin` → 服务端 `redirect("/admin/login")`，**看不到任何修改界面**。
- 登录后下发 `HttpOnly` + `SameSite=strict` Cookie，**口令不进浏览器 JS、不进 localStorage**。
- `/api/admin/update` 同时接受 `x-admin-key` 请求头与 `admin_session` Cookie，便于脚本调用。

生效延迟：一次保存 ≈ 一次 GitHub commit + 一次 Cloudflare 构建，约 **1–3 分钟**（与阶段 A 一致，非秒级）。

---

## 3. 落地步骤

### 步骤 1：数据外置为单一 JSON（最小改动）
现状：`src/data/profile.ts`、`src/data/homepage.ts` 是 TS 模块，被多个组件在**构建期**静态导入。
为避免在后端做脆弱的「TS 源码字符串替换」，把可编辑内容外置为一个 JSON，再用薄封装兼容现有 import：

1. 新建 `src/data/site-content.json`，结构：
   ```json
   {
     "profile": { /* 现有 Profile 全量字段：基础信息/社交/mbti/项目/免责声明... */ },
     "homepage": { /* 现有 Homepage 字段 */ }
   }
   ```
2. `src/data/profile.ts` 改为薄封装（导入方**无需改动**）：
   ```ts
   import raw from "./site-content.json";
   import type { Profile } from "@/types/profile";
   const content = raw as { profile: Profile };
   export default content.profile;
   ```
3. `src/data/homepage.ts` 同理改为 `export default content.homepage;`（类型 `Homepage`）。
4. 校验 `tsconfig` 已开启 `resolveJsonModule`（Next.js 默认开启），类型断言保证组件拿到的仍是原类型。

> 这样：组件代码零改动；admin 后端只需写 `site-content.json` 一个文件；构建时 JSON 被打包进静态产物。

### 步骤 2：后端接口 `POST /api/admin/update` 与登录/登出接口
- `src/app/api/admin/update/route.ts`：
  - **鉴权**：`x-admin-key` 请求头 **或** `admin_session` Cookie 必须等于 `env.ADMIN_KEY`（Cloudflare secret）。不匹配返回 401。
- `src/app/api/admin/login/route.ts`：校验口令后下发 `HttpOnly` + `SameSite=strict` Cookie（7 天）。
- `src/app/api/admin/logout/route.ts`：清除该 Cookie。
- `src/lib/server-env.ts`：统一读取 env（Cloudflare ctx 优先，缺失项补 `process.env`，兼容本地 `next dev`）。
- **入参**：`{ profile?: Partial<Profile>, homepage?: Partial<Homepage> }` 或整包 `content`。
- **写回 GitHub**（GitHub Contents API）：
  1. `GET https://api.github.com/repos/{env.GITHUB_REPO}/contents/src/data/site-content.json?ref={env.GITHUB_BRANCH}` → 取 `sha`。
  2. 合并入参到当前内容（先 GET 全量 JSON，再深合并，避免覆盖其他字段）。
  3. `PUT` 同路径，`body`：`{ message: "chore: update site content via admin", content: base64(json), sha }`。
  4. 返回 `{ ok: true }`。失败返回 4xx/5xx + 错误信息。
- 仅允许写 `src/data/site-content.json` 这一个固定路径，**不做任意路径写**，降低风险。
- 使用 `fetch`（`nodejs_compat` 已开，标准 `fetch` 可用）。

依赖 secret/vars（在 `wrangler.jsonc` 用 `vars` 放非机密项，`wrangler secret put` 放机密项）：
- `GITHUB_TOKEN`：fine-grained PAT，仅授权该仓库 `Contents: Read/Write`，可随时吊销。
- `GITHUB_REPO`：`owner/repo`（如 `wangpenglong/PersonalSite-home`）。
- `GITHUB_BRANCH`：`main`（或你的默认分支）。
- `ADMIN_KEY`：admin 保存时使用的口令。

### 步骤 3：登录页 `/admin/login` 与鉴权网关
- `src/app/admin/login/page.tsx`：**客户端登录页**，输入 ADMIN_KEY → `POST /api/admin/login`，成功后跳转 `/admin`。
- `src/app/admin/page.tsx`：**服务端组件（force-dynamic）**，读取 Cookie `admin_session` 并校验是否等于 `env.ADMIN_KEY`；**未登录或口令不符 → `redirect("/admin/login")`**，因此未认证用户看不到任何修改界面。
- `src/components/admin/admin-form.tsx`：**客户端组件**，表单覆盖：
  - 基础信息（姓名/职位/简介/地点等）
  - 社交链接
  - 性格 / MBTI（type 自动决定 `/mbti/{type}.png` 插画）
  - 项目列表（漂移墙数据：封面/标题/标签/链接）
  - 关于/理念、页脚免责声明
- 保存：组装 `content` → `POST /api/admin/update`（依赖 Cookie，无需手动填 key）→ 显示「已保存，约 1–3 分钟生效」。
- 表单右上角提供「退出登录」按钮 → `POST /api/admin/logout` 清 Cookie。

### 步骤 4：Cloudflare 配置 + 推送触发构建
- 用 `wrangler secret put GITHUB_TOKEN`、`wrangler secret put ADMIN_KEY` 写入机密；
  `GITHUB_REPO` / `GITHUB_BRANCH` 写入 `wrangler.jsonc` 的 `vars`（非机密）。
- 确认 Cloudflare 已接入 Git：push 到 `GITHUB_BRANCH` 即触发 `build:worker` 自动部署（沿用你已有的流水线，无需新增）。
- 本地：`git pull --rebase` 才能同步 admin 产生的提交，否则下次本地提交会冲突（同阶段 A 文档提醒）。

### 步骤 5：安全与本地校验
- `npm run build` 通过，确认 `/api/admin/update` 被编译为 Worker 函数（路由表出现 `ƒ` 动态函数）。
- 本地起 Worker 预览：`npm run preview:worker`，用 curl 验证 401（无 key）/ 200（带 key）路径。
- 不把 `GITHUB_TOKEN` / `ADMIN_KEY` 写进任何仓库文件或 `.env`（仅 Cloudflare secret）。

---

## 4. 文件清单

**新建**
- `src/data/site-content.json` — 可编辑内容的单一数据源
- `src/app/api/admin/update/route.ts` — 后端写回 GitHub 接口
- `src/app/api/admin/login/route.ts` — 登录（下发 HttpOnly Cookie）
- `src/app/api/admin/logout/route.ts` — 登出（清除 Cookie）
- `src/app/admin/page.tsx` — admin 服务端入口（鉴权网关）
- `src/app/admin/login/page.tsx` — 登录页
- `src/components/admin/admin-form.tsx` — admin 客户端表单
- `src/lib/server-env.ts` — 统一读取 env 助手
- `.env.local` — 本地开发用 `ADMIN_KEY`（已被 .gitignore 忽略，**不会提交**）

**修改**
- `src/data/profile.ts` — 改为从 `site-content.json` 薄封装导出
- `src/data/homepage.ts` — 同上
- `wrangler.jsonc` — 增加 `vars`（`GITHUB_REPO` / `GITHUB_BRANCH`）

**不变**
- 所有消费 `profile` / `homepage` 的组件（hero / featured / about / contact / footer / mbti / resume）—— import 路径不变。
- 静态部署形态（opennextjs-cloudflare → Cloudflare Workers）。

---

## 5. 已确认的信息（实现依据）
1. GitHub 仓库：`YunyuVv/PersonalSite`，默认分支 `main` → 已写入 `wrangler.jsonc` 的 `vars`（`GITHUB_REPO` / `GITHUB_BRANCH`）。
2. fine-grained PAT：需你生成（仅需该仓库 `Contents: write`），随后 `wrangler secret put GITHUB_TOKEN`。
3. `ADMIN_KEY` 默认口令：`PersonalSiteBiliww`。本地用 `.env.local` 已写入；线上用 `wrangler secret put ADMIN_KEY`。
4. admin 表单覆盖字段：基础 / 社交 / MBTI / 项目 / 关于·理念 / 页脚，已全部落地。

---

## 6. 风险与权衡
- **生效非实时**：保存后需等一次构建（1–3 分钟）。若必须秒级，需引入 Cloudflare KV 运行时覆盖（会偏离纯静态，本方案不采用）。
- **secret 管理**：token 在 Cloudflare secret，安全；但丢失需重新 `wrangler secret put`。
- **并发覆盖**：若构建途中再次保存，可能基于旧 sha 提交导致 409；后端应对 409 做「重新 GET→合并→再 PUT」重试一次。
- **admin 页面公开**：无 key 无法写，但页面可访问；如需更隐蔽可加简单口令门或直接不公开路由（仍保留接口）。

---

## 7. 验证方法
1. 本地 `npm run build` → 路由表出现 `/api/admin/update  ƒ`（动态函数）。
2. `npm run preview:worker` 起 Worker 预览。
3. `curl -X POST localhost:8787/api/admin/update` 不带 key → 401。
4. 带 key 提交一次小改动（如改简介）→ 检查 GitHub 仓库 `src/data/site-content.json` 出现新 commit → Cloudflare 自动重建 → 首页内容更新。
5. `/admin` 页面表单实测保存闭环。
