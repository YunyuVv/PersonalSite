# 本地验证 GitHub 提交流程（admin 改文件 → 自动构建）

> 目标：在本地 `npm run dev` 环境跑通「登录 → 保存 → 写回 GitHub 仓库」闭环，而不依赖线上 Cloudflare。

## 为什么需要在 .env.local 配置

`src/lib/server-env.ts` 的取值逻辑：**Cloudflare 绑定环境变量优先，缺失则回退到 `process.env`（即 `.env.local`）**。

- 线上（Worker）：`ADMIN_KEY`/`GITHUB_TOKEN` 来自 `wrangler secret`，`GITHUB_REPO`/`GITHUB_BRANCH` 来自 `wrangler.jsonc` 的 `vars`。
- 本地（`npm run dev`）：没有 Cloudflare 绑定，必须靠 `.env.local` 提供全部四项，否则 `/api/admin/update` 调 GitHub API 时会因缺 `GITHUB_TOKEN` 或拼不出仓库路径而失败。

## 步骤 1：生成 fine-grained PAT（若还没有）

1. GitHub 右上角头像 → **Settings** → 左侧 **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**。
2. **Token name**：`personal-site-admin`（任取）。
3. **Expiration**：按需（建议设定过期，便于轮换）。
4. **Resource owner**：选 `YunyuVv`。
5. **Repository access**：选 **Only select repositories** → 勾选 **`YunyuVv/PersonalSite`**。
6. 点 **+ Add permissions**，在弹窗里搜索或找到 **Contents** 并勾选。
7. 勾选后旁边会出现 **Access** 下拉框，选 **Read and write**。
8. 点击 **Generate token**，**立即复制**（仅显示一次）。

## 步骤 2：填入 .env.local

编辑 `.env.local`（已被 `.gitignore` 忽略，不会进仓库）：

```
ADMIN_KEY=PersonalSiteBiliww
GITHUB_TOKEN=<粘贴上面的 PAT>
GITHUB_REPO=YunyuVv/PersonalSite
GITHUB_BRANCH=main
```

> 当前 `.env.local` 已写好 `ADMIN_KEY`、`GITHUB_REPO`、`GITHUB_BRANCH`，只需把 `GITHUB_TOKEN=__FILL_ME__` 替换成真实 PAT。

## 步骤 3：重启 dev（环境变量在进程启动时加载）

```bash
# 停掉旧的 dev（端口 12001），再启动
npm run dev
```

## 步骤 4：验证登录闭环（已有，快速确认）

```bash
# 错误口令 → 401
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:12001/api/admin/login \
  -H "Content-Type: application/json" -d '{"key":"wrong"}'

# 正确口令 → 200 + Set-Cookie
curl -s -i -X POST http://localhost:12001/api/admin/login \
  -H "Content-Type: application/json" -d '{"key":"PersonalSiteBiliww"}' | grep -iE "^HTTP|set-cookie"
```

## 步骤 5：验证 GitHub 写回（核心）

```bash
# 取登录 Cookie
COOKIE=$(curl -s -i -X POST http://localhost:12001/api/admin/login \
  -H "Content-Type: application/json" -d '{"key":"PersonalSiteBiliww"}' | grep -i set-cookie | sed 's/set-cookie: //I' | cut -d';' -f1)

# 调保存接口，写入一个测试改动（例如把 name 改成 "测试验收"）
curl -s -X POST http://localhost:12001/api/admin/update \
  -b "$COOKIE" \
  -H "Content-Type: application/json" \
  -d '{"profile":{"name":"测试验收"}}'
```

预期返回：`{"ok":true,"sha":"<新sha>","message":"..."}`。

**关键验证点**：去 GitHub 仓库 `YunyuVv/PersonalSite` 的 **Commits** 看是否多出一条 `chore: update site content via admin`，且 `src/data/site-content.json` 中的 `name` 已变为 `测试验收`。

> ⚠️ 注意：**本地 `src/data/site-content.json` 不会变**（改动写到了 GitHub 远端，不是你本地工作区）。要本地同步需 `git pull --rebase`。

## 步骤 6：把改动改回去（验收后清理）

在 GitHub 上把 `name` 改回原值，或本地 `git pull --rebase` 后用原值再保存一次。

## 线上映射（部署后无需 .env.local）

| 变量 | 本地 | 线上 |
|------|------|------|
| `ADMIN_KEY` | `.env.local` | `wrangler secret put ADMIN_KEY` |
| `GITHUB_TOKEN` | `.env.local` | `wrangler secret put GITHUB_TOKEN` |
| `GITHUB_REPO` | `.env.local` | `wrangler.jsonc` 的 `vars`（已配） |
| `GITHUB_BRANCH` | `.env.local` | `wrangler.jsonc` 的 `vars`（已配） |

## 仍无法本地验证的部分（需在 Cloudflare 侧确认）

「保存 → GitHub commit → **Cloudflare 自动重建**」中的**后半段自动重建**，取决于 Cloudflare 是否已与该仓库建立 Git 集成（Workers Builds / 连接仓库）。这一步不在本地可测，需在 Cloudflare 控制台确认：推送后 Build 是否自动触发。若未配置，可改用 `npm run deploy:worker` 手动发布。

## 常见问题

- **401**：`.env.local` 的 `ADMIN_KEY` 与登录口令不符，或 dev 未重启导致未读到新值。
- **500 + "GITHUB_TOKEN required"**：`.env.local` 的 `GITHUB_TOKEN` 仍是 `__FILL_ME__` 或为空。
- **403 from GitHub**：PAT 权限不足（必须 Contents:write）或仓库路径错误。
- **409 conflict**：并发保存导致 sha 过期，接口已内置一次重试；若仍失败，稍后重试即可。
