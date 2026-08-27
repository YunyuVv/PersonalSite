# 部署方案调研（PersonalSite / 清正）

> 调研时间：2026-08-27
> 项目：Next.js 16.2.11 + React 19
> 目标：盘点能托管本站的方案，重点确认 **PinMe** 是否可用，并给出推荐路径。

> **🟢 落地状态（2026-08-28）**：本分支已确定并实现了「**Node SSR + Docker**」路线（放弃纯静态导出），以满足「不备案 + 国内流畅 + 后台实时改配置」的最终需求。后台可配置方案与文件映射见 `docs/方案设计/后台配置方案.md §14`。以下 §7.2 的「静态导出」口径已过时，实际采用 §7.2′ 的 SSR Docker 路线。

---

## 0. 结论先行

| 场景 | 推荐方案 | 一句话理由 |
| --- | --- | --- |
| **主站（默认首选）** | Cloudflare Workers（OpenNext） | 项目**已配好且已验证**，零带宽费、全球 CDN、自定义域名免费 SSL |
| **面向国内受众（可备案）** | EdgeOne Pages（腾讯云） | 国内访问最快最稳，中文支持好，适合金融 UP 主 |
| **不备案 / 免 ICP（国内流畅）** | 中国香港节点（腾讯云香港 / 阿里云香港）+ 静态导出 | 免备案、华南访问 ≈20–60ms，明显优于欧美，是「免备案 + 国内流畅」的最佳折中 |
| **临时演示 / 快速分享** | PinMe | 一行命令 `pinme upload`，但 IPFS 持久性/SEO 有短板，**不建议做主站** |
| **最简单稳定** | GitHub Pages | 完全免费稳定，但需改 `next.config` 做静态导出，国内偏慢 |
| **Next.js 原生体验** | Vercel / Netlify | DX 最好，但免费额度有限、国内偶尔抽风 |

**关于 PinMe（你记得的那个）**：能用，它是把**静态文件**直接传到 IPFS 的去中心化部署工具，
`pinme upload <目录>` 一行命令出链接。但本站是 Next.js，需要先导出成纯静态目录再传。
它适合 Demo / 临时分享，**不适合做需要 SEO、稳定域名、长期在线的个人主站**。

---

## 1. 项目当前部署就绪状态（已实测）

本项目**已经为 Cloudflare Workers 做好了全部适配**，且本次已实跑验证：

```bash
pnpm build:worker
# → 生成 .open-next/worker.js + .open-next/assets ✅
# 路由全部预渲染为静态：/、/demo、/map、/icon.svg、/sitemap.xml
```

已落地的配置（详见 `docs/deploy-cloudflare.md`）：

- `package.json` → `scripts`：`build:worker` / `preview:worker` / `deploy:worker`
- `open-next.config.ts`：纯静态资源缓存，无需 KV / R2
- `wrangler.jsonc`：Worker 配置（`main` + `assets` + `nodejs_compat`）
- `.gitignore`：已忽略 `/.open-next/`

> 也就是说，**Cloudflare 这条路已经是“写完代码推上去就上线”的状态**，无需再调研怎么配。

---

## 2. PinMe 专项调研

### 2.1 它是什么

- 去中心化**静态站点**部署工具，底层用 **IPFS**（Glitter Protocol 节点 Pinning）做永久存储。
- 官方仓库：<https://github.com/glitternetwork/pinme>（GitHub 2.7k+ stars）
- 定位：零配置前端部署，免服务器、免账号、免付费即可发布。

### 2.2 怎么用

```bash
npm install -g pinme
cd /path/to/your-site
pinme upload .          # 打包压缩并上传，输出 https://xxx.eth.limo 或 ipfs.io/ipfs/<CID>
```

特点：

- ✅ 一行命令发布，无需 Git / 账号 / 信用卡
- ✅ 零成本托管，全球 CDN（IPFS 网络）加速
- ✅ 去中心化域名：可绑定 `xxx.eth`（ENS）
- ✅ 内容防篡改（CID 哈希校验）
- ✅ 支持整站目录（HTML / CSS / JS / 音视频）

### 2.3 能不能部署本站？

**能，但要多一步“静态导出”。** PinMe 只认静态文件，不认 Next.js 运行时，所以流程是：

1. 让 Next.js 导出纯静态目录：在 `next.config.ts` 加 `output: "export"`，
   构建产物落在 `out/`（注意：本站用了 `next/image`、framer-motion 等，需确认导出后资源路径正确；**本项目是 Next 16，改动前请先查 `node_modules/next/dist/docs/` 确认导出写法**，见下方注意）。
2. `pinme upload ./out` 上传 `out/` 目录即可出链接。

> 或者：直接把 OpenNext 产物 `.open-next/assets` 当静态目录传（`pinme upload .open-next/assets`），
> 但 Worker 入口 `worker.js` 不会被用到，等于只传了静态资源。

### 2.4 为什么不建议做主站

| 维度 | PinMe 表现 | 对“金融 UP 主个人站”的影响 |
| --- | --- | --- |
| **持久性** | 免费层文件遵循 IPFS 网络保留规则，可能被 GC 回收/解绑 | 站点可能**突然打不开**，个人品牌不可控 |
| **域名** | 默认是 `xxx.eth.limo` / `ipfs.io/ipfs/<CID>` 哈希链接；仅 ENS 自定义 | 不利于记忆、不利于品牌、不利于 SEO |
| **SEO** | 哈希 URL + 网关，搜索引擎不友好 | UP 主做内容站，搜索收录是刚需 |
| **国内访问** | 走 IPFS 公共网关，国内速度/可达性不稳 | 目标受众在国内，体验差 |
| **可维护性** | 无后台、无版本管理、无分析 | 长期运营不方便 |

**结论**：PinMe 适合「30 秒把 Demo 发给同事 / 客户 / 黑客松评审」，
**不适合**作为需要长期稳定、可搜索、有品牌域名的个人主站。

---

## 3. 主流方案对比

| 方案 | 是否适配 Next 16 | 免费额度亮点 | 国内访问 | 自定义域名 | 适合度 |
| --- | --- | --- | --- | --- | --- |
| **Cloudflare Workers**（OpenNext） | ✅ 已验证 | 10 万次请求/天，无限带宽 | 中等 | ✅ 免费 SSL | ⭐⭐⭐⭐⭐ 主站首选 |
| **EdgeOne Pages**（腾讯云） | 需确认（支持静态导出/OpenNext 产物） | 免费额度，国内节点 | **快/稳** | ✅ | ⭐⭐⭐⭐⭐ 国内受众首选 |
| **Vercel** | ✅ 原生 | 100GB/月带宽，无限构建 | 偶尔抽风 | ✅ | ⭐⭐⭐⭐ |
| **Netlify** | ✅ OpenNext 适配器 | 100GB/月，300 构建分/月 | 中等 | ✅ | ⭐⭐⭐⭐ |
| **GitHub Pages** | ⚠️ 需 `output:export` | 100GB/月，稳定 | 偏慢 | ✅ | ⭐⭐⭐ |
| **PinMe** | ⚠️ 需静态导出 | 免费（IPFS） | 不稳 | ❌（仅 ENS） | ⭐⭐ 仅演示 |
| **Render / Railway / Firebase** | ✅ / ⚠️ | 各有免费层 | 中等 | ✅ | ⭐⭐⭐ |

---

## 4. 推荐路径与落地建议

### 方案 A：主站走 Cloudflare Workers（推荐，已就绪）
- 直接复用 `docs/deploy-cloudflare.md` 的 GitHub 联动流程：推 `main` → Workers Builds 自动 `pnpm build:worker` → 上线。
- 或本地 `pnpm deploy:worker`（需先 `wrangler login`）。
- 自定义域名：`Worker 设置 → Triggers → Custom Domains`。

### 方案 B：国内受众优先 → EdgeOne Pages（腾讯云）
- 本项目 Next 16，建议用**静态导出**（`output: "export"` → `out/`）或 OpenNext 产物上传。
- EdgeOne 对国内访问最友好，金融 UP 主面向国内粉丝时体验最佳。
- WorkBuddy 内置 `EdgeOne Pages` 连接器，可直接部署。

### 方案 C：临时分享 / Demo → PinMe
```bash
# 1) next.config.ts 加 output:"export" 并构建出 out/
# 2) 一行上传
pinme upload ./out
```
- 仅用于发给别人快速看效果，**不要当生产主站**。

### 方案 D：最省心 → GitHub Pages
- 改 `next.config.ts` 加 `output: "export"`，把 `out/` 推到 `<user>.github.io` 仓库。
- 完全免费稳定，但国内访问慢、且 Next 16 静态导出写法需先查官方文档确认。

---

## 5. 注意事项（Next 16 特定）

本项目是 Next.js 16，与训练数据中的旧版 Next 行为可能不同。任何涉及
`output: "export"`（GitHub Pages / PinMe 路径）或平台适配的改动，
**动手前先读 `node_modules/next/dist/docs/` 下的对应指南**，并留意构建时的 deprecation 提示。

涉及 SSR / ISR / 自定义域名等升级需求时，仍优先参考已验证的
`docs/deploy-cloudflare.md`（OpenNext → Workers 路线）。

---

## 7. 不备案部署方案（中国香港 / 海外节点，免 ICP）

> 适用前提：**不想做 ICP 备案**，但仍希望中国大陆用户能相对流畅打开。
> 核心思路：把域名解析到**中国大陆以外**的节点（中国香港 / 中国澳门 / 新加坡 / 日本 / 欧美），即可免备案；要「国内流畅」则优先选地理最近的**中国香港、中国澳门**或新加坡节点。

### 7.1 国内流畅度排序（不备案前提下）

| 节点 | 国内访问 | 说明 |
| --- | --- | --- |
| **中国香港 / 中国澳门** | ⭐⭐⭐⭐ 最快（华南 ≈20–60ms） | 免备案、地理最近，最佳折中 |
| 新加坡 | ⭐⭐⭐⭐ | 次优，延迟略高 |
| 日本（东京） | ⭐⭐⭐ | 北方用户尚可 |
| 欧美（美西/法兰克福） | ⭐⭐ | Cloudflare/Vercel/Netlify 默认，偏慢 |

### 7.2 推荐落地：方案 E（中国香港静态托管，免备案）

本站已是纯展示型（首页 / 地图 / 原型），无服务端逻辑，**静态导出最省心**：

1. `next.config.ts` 加 `output: "export"`，`pnpm build` 产出 `out/`
   （Next 16 写法务必先查 `node_modules/next/dist/docs/`，见第 5 章）。
2. 把 `out/` 上传到 **中国香港节点**：
   - **腾讯云轻量应用服务器（中国香港）/ 阿里云 ECS（中国香港）**：Nginx 直接指向 `out/`；
   - 或 **腾讯云 COS（中国香港地域）+ CDN（境外/全球加速）**；
   - 或 **阿里云 OSS（中国香港）+ CDN**。
3. 域名：任意后缀（`.com` / `.top` / `.xyz` 等），经**境外注册商**注册可免实名；
   把 A/AAAA 或 CNAME 解析到香港节点 IP，**不要解析到大陆服务器**（否则会被要求备案/阻断）。

### 7.3 其他不备案选项（国内偏慢，仅演示）

| 方案 | 说明 | 国内体验 |
| --- | --- | --- |
| Cloudflare Pages / R2 | 全球 CDN、零成本、自定义域名免费 | 中等，不如香港稳 |
| Vercel / Netlify / GitHub Pages | 海外默认节点 | 偏慢，仅适合临时分享 |

### 7.4 不备案注意事项

- **不要解析到大陆 IP**：一旦域名指向国内服务器，ICP 备案会被强制要求，否则解析不生效。
- **域名实名**：`.cn` 必须实名；境外注册商的 `.com` 等通常可免实名。
- **静态优先**：`output: "export"` 后无任何服务端依赖，海外/香港节点托管最简单、最不容易出错。
- 本条路线与「方案 A（Cloudflare）/ 方案 B（EdgeOne 大陆）」互斥选择；若后续愿意备案，可平滑切换到 EdgeOne 大陆节点以获得更优国内体验。

### 7.5 实际落地：Node SSR + Docker（推荐，✅ 已实现）

> 本站最终采用「中国香港/海外主机 + Node SSR 容器」满足「不备案 + 国内流畅 + 后台实时」。详见 `docs/方案设计/后台配置方案.md §14`。

- **构建**：`NODE_OPTIONS= pnpm build` → 产出 `.next/standalone/server.js`（`output: "standalone"`）。
- **部署**：`docker compose up -d --build`，镜像基于 `node:22-alpine`，挂载 `./data:/app/data` 持久化配置，端口 `12002:3000`。
- **主机**：跑在中国香港 / 新加坡 / 日本的轻量容器主机（Oracle Always Free 亚洲区、腾讯云香港、阿里云香港均可），免备案。
- **域名**：境外注册商域名，A/AAAA 解析到容器 IP；如需国内加速可叠加 Cloudflare 灰色云（仅解析）/ 香港 CDN。
- **后台实时**：`/admin` 页面 + Bearer Token，`POST /api/admin/config` 写穿 `data/config.json`，页面即时生效，无需重新构建。

---

### 7.6 纯静态导出（build:static，✅ 已实现）

> 除 SSR Docker 外，本项目额外支持纯静态导出，适合「零后端、免备案、国内流畅」的纯前端托管。详见 `docs/方案设计/后台配置方案.md §15`。

- 命令：`pnpm build:static` → 产出 `out/`（配置在构建期烘焙进 HTML，`images` 自动关闭优化）。
- 部署：把 `out/` 上传到任意静态托管（Cloudflare Pages / GitHub Pages / 腾讯云 COS 中国香港 + CDN / Netlify）。
- 限制：后台 `/admin` 实时编辑依赖服务端，静态托管下不可用；改配置需重新 `build:static` 并重新上传 `out/`。
- 与 §7.2 静态方案的区别：§7.2 是「纯静态 + 点按钮重新部署」，本方式是「构建期烘焙」的 `output: "export"`，无需 Worker/CI。

### 7.7 GitHub Actions 自动构建镜像

> push 到 `main-xianyu-qingzheng` 分支即自动构建并推送 Docker 镜像到 `ghcr.io`，`docker-compose.yml` 只引用镜像、不再本地构建。

- 工作流：`.github/workflows/build-image.yml`，触发条件 `push` 到 `main-xianyu-qingzheng`（也支持手动 `workflow_dispatch`）。
- 镜像地址：`ghcr.io/<github-owner>/<repo>:latest`（自动转小写），由 `GITHUB_TOKEN` 推送，无需额外凭据。
- `docker-compose.yml` 已改为 `image: ${IMAGE_NAME:-ghcr.io/<your-github-owner>/personal-site:latest}`，部署时把 `<your-github-owner>` 改成你的 GitHub 用户名/组织名即可。
- 首次使用前需确认仓库 Actions 权限：仓库 Settings → Actions → General → Workflow permissions 勾选「Read and write」以允许推送包。
- 服务器侧只需 `docker compose pull && docker compose up -d` 拉取最新镜像。

## 6. 参考链接

- PinMe：<https://github.com/glitternetwork/pinme>
- Cloudflare Workers：<https://workers.cloudflare.com/>
- EdgeOne Pages（腾讯云）：<https://edgeone.ai/>
- Vercel：<https://vercel.com/>
- Netlify：<https://www.netlify.com/>
- GitHub Pages：<https://pages.github.com/>
- 本项目 Cloudflare 部署手册：`docs/deploy-cloudflare.md`
