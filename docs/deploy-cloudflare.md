# 部署到 Cloudflare（Next.js 16 → Workers via OpenNext）

## 1. 结论：部署到 Workers，不要走 Pages

| 方案 | 状态 | 对 Next.js 16 的支持 |
| --- | --- | --- |
| **Cloudflare Workers + OpenNext**（`@opennextjs/cloudflare`） | Cloudflare 官方当前主推 | ✅ 支持 Next 16.2.3+（本项目 16.2.11） |
| Cloudflare Pages + `@cloudflare/next-on-pages` | 已退役；Pages 平台进入维护模式 | ❌ 不支持 Next 16 |

要点：
- 旧版 Pages 的 Next.js 适配器 `next-on-pages` 已停止维护，且**不支持 Next.js 16**；Cloudflare 现已把所有新 Next.js 项目导向 OpenNext → Workers。
- Cloudflare **Pages 平台本身进入维护模式**，新项目不建议再选 Pages。
- 本项目是**纯静态展示站**（无 API 路由、无 middleware、无 server actions、无 `next/image`、无 `next/headers`），用 OpenNext 转成 Worker + 静态资源完全兼容；且保留未来加 SSR / API 路由的能力。

> 为什么需要 OpenNext？Next.js 构建产物是 Node.js 服务端代码，而 Workers 运行在 V8 隔离运行时（workerd），不能直接执行。
> OpenNext 是"编译器"，把 `next build` 产物转成 Worker 能跑的包。**它只是仓库里的一个构建依赖，你不需要在本地手动运行它**——Cloudflare 的 Workers Builds 会在它自己的机器上自动调用。

---

## 2. 项目已完成的适配（已提交到仓库）

| 内容 | 说明 |
| --- | --- |
| `package.json` → `devDependencies` | `@opennextjs/cloudflare`、`wrangler` |
| `package.json` → `scripts` | `build:worker` / `preview:worker` / `deploy:worker` |
| `wrangler.jsonc` | Worker 配置（`main`、静态 `assets`、`nodejs_compat`） |
| `open-next.config.ts` | OpenNext 适配器配置（当前用静态资源缓存，无需 KV） |
| `.gitignore` | 已忽略 `/.open-next/`、`/.worker-next/` |
| `package.json` → `pnpm.overrides` | `balanced-match: 4.0.4`（修复依赖冲突，见第 8 节） |

`build:worker` 等价于 `opennextjs-cloudflare build`，它内部会先跑 `next build` 再做 OpenNext 转换。

---

## 3. 通过 GitHub 联动部署（Workers Builds，全程网页端）

无需写 GitHub Actions / workflow 文件，Workers Builds 就是 CI。

1. 把代码推到 GitHub 的 `main` 分支。
2. 打开 Cloudflare 控制台 → **Workers & Pages** → **Create** → **Connect Git**。
3. 授权 GitHub，选择本仓库；生产分支默认 `main`。
4. **配置构建（关键）**：
   - **Build command（构建命令）**：必须手动填写 → `pnpm run build:worker`
     > 默认值通常为空，不填会导致没有 `.open-next` 产物、部署失败。
   - **Deploy command（部署命令）**：**保持默认 `npx wrangler deploy` 即可，无需修改**。
     它会读取仓库里的 `wrangler.jsonc`（`main` + `assets`）完成部署。
   - **包管理器**：自动识别为 `pnpm`（依据 `pnpm-lock.yaml`），无需手动选。
   - **Root directory**：`/`（本项目不是 monorepo）。
5. 点击 **Save and Deploy**。之后每次向 `main` 推送都会自动构建并部署。
6. 非生产分支的推送会自动生成 **Preview URL**（默认命令 `npx wrangler versions upload`，无需改）。
7. 部署完成后会得到一个 `<worker-name>.workers.dev` 域名（本例 `personal-site.workers.dev`）。

---

## 4. 环境变量 / Secrets

- 当前项目**不需要**任何构建期或运行期变量。
- 后续若引入 `NEXT_PUBLIC_*` 或运行时变量：
  - 构建期变量：Worker 设置 → **Settings → Build → Build variables**。
  - 运行时变量/密钥：Worker 设置 → **Settings → Variables & Secrets**。

---

## 5. 本地命令（可选，用于自测）

```bash
pnpm dev              # 本地开发（Node 环境，普通 next dev）
pnpm preview:worker   # 用 workerd 运行时预览，更接近生产（先 build 再起本地 Worker）
pnpm deploy:worker    # 本地构建并部署到 Cloudflare（需要已登录 wrangler）
```

> ⚠️ 本地沙箱注意：某些本地环境会给 `NODE_OPTIONS` 注入 `--use-system-ca`，
> 会导致 Next 16 的 Turbopack 起 Worker 线程时报
> `invalid NODE_OPTIONS env variable: --use-system-ca is not allowed`。
> 只需在本地清掉该变量即可：`NODE_OPTIONS= pnpm run build:worker`。
> **Cloudflare 的构建环境没有这个问题，不影响网页端部署。**

---

## 6. 自定义域名（可选）

Worker 设置 → **Triggers → Custom Domains**，添加已接入 Cloudflare DNS 的域名，
SSL 与路由会自动配置。

---

## 7. 后续加 SSR / API 路由 / ISR

当前 `open-next.config.ts` 使用静态资源缓存（无需额外绑定）。若以后加入：
- 服务端数据获取 / ISR / 按需重新验证（on-demand revalidation），
- 把 `incrementalCache` 换成 `r2IncrementalCache` 并绑定一个 R2 桶（见 OpenNext 官方文档）。

其余 GitHub 联动部署流程**完全不变**，无需改构建/部署命令。

---

## 8. 排错

### 8.1 `brace-expansion` / `balanced-match` 命名导出报错
报错类似：
```
SyntaxError: Named export 'balanced' not found.
The requested module 'balanced-match' is a CommonJS module
```
原因：`@opennextjs/cloudflare → glob@12 → minimatch@10` 链上的 `brace-expansion@5`
按 ESM 命名导入 `balanced-match`，但 pnpm 在该链上把它解析成了 CJS 版 `1.0.2`。
**这个坏解析会写进 `pnpm-lock.yaml`，Cloudflare 网页端构建用的是同一份 lockfile，所以必须修。**

修复（已在 `package.json` 中）：
```json
"pnpm": {
  "overrides": { "balanced-match": "4.0.4" }
}
```
`balanced-match@4.0.4` 同时提供 ESM/CJS 命名导出，覆盖后全局生效。改完执行 `pnpm install`。

### 8.2 部署后白屏 / 404
- 确认 **Build command 是 `opennextjs-cloudflare build`**（不是裸 `next build`），否则不会生成 `.open-next`。
- 确认仓库根目录有 `wrangler.jsonc`，且 `main: .open-next/worker.js`、`assets.directory: .open-next/assets`。

### 8.3 本地 `wrangler dev` 起不来
若提示缺少原生二进制，执行 `pnpm rebuild esbuild workerd` 让其运行安装脚本。
