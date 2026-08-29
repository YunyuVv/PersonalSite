# Cloudflare 变量持久化方案（ADMIN_KEY / GITHUB_TOKEN 重启不丢）

> 问题：通过 admin 保存触发「GitHub 提交 → Cloudflare 自动部署」后，之前在 Cloudflare 控制台设置的 `ADMIN_KEY`、`GITHUB_TOKEN` 丢失。

## 根因

当前 `wrangler.jsonc` 的 `vars` 只有非敏感的 `GITHUB_REPO`、`GITHUB_BRANCH`。`ADMIN_KEY`、`GITHUB_TOKEN` 从没进配置文件，靠手动在控制台填。

Cloudflare 变量有两个维度，容易踩坑：

1. **环境变量 vs Secret**：明文 `vars`（在 `wrangler.jsonc`）随配置带入；Secret（加密）存于边缘，独立于部署包。
2. **Production vs Preview 环境**：两套独立。填错环境，对应部署读不到。
3. **构建变量 vs 运行时变量**：填成「构建变量（Build）」时，Worker 运行时 `env.X` 取不到。

之前能留存的 `GITHUB_REPO`/`GITHUB_BRANCH` 因为在 `wrangler.jsonc`，每次部署都带入；而 `ADMIN_KEY`/`GITHUB_TOKEN` 依赖控制台手动填，在自动部署（Git 触发、走 Production）后失效。

## 推荐方案：用 `wrangler secret put`（一劳永逸）

Secret 加密存储、与部署包解耦，**不受 Git 自动部署影响，永久留存**，且不会进 `wrangler.jsonc`（避免明文进仓库）。

### 步骤（在本地，已登录 wrangler 的前提下）

```bash
cd /Users/wangpenglong/projects/nextjs/PersonalSite-home

# 写入后台登录口令（值 PersonalSiteBiliww，或你自定义）
echo "PersonalSiteBiliww" | npx wrangler secret put ADMIN_KEY

# 写入 GitHub 写回令牌（替换为你的 fine-grained PAT）
echo "<你的 fine-grained PAT>" | npx wrangler secret put GITHUB_TOKEN
```

- 运行时会提示选择环境（Production / Preview），**务必选 Production**（自动部署走的就是 Production）。
- 成功后这两个值会出现在 Cloudflare 控制台 **Workers → personal-site → Settings → Variables → Secrets** 下，且后续任何部署都不会被清掉。

### 验证

部署后再访问 admin 保存一次，确认不再 401 / 500：

```bash
# 重新触发一次保存（已登录的前提下），看 GitHub 是否出现新 commit
curl -s -X POST http://localhost:12001/api/admin/update ...  # 本地验证
# 线上则直接访问 https://<your-worker>.workers.dev/api/admin/update 同源调用
```

或在 Cloudflare 控制台确认 Secrets 列表里能看到 `ADMIN_KEY`、`GITHUB_TOKEN`。

## 方案 B：在 Cloudflare 控制台手动添加（Web UI）

可以。**控制台手动添加 Secret 本身能持久化**，前提是填到正确的位置——之前「丢失」是因为可能填到了 Preview 环境或「构建变量(Build)」而非「运行时 Secret」。

### 操作步骤

1. 打开 Cloudflare 控制台 → **Workers & Pages**（左侧导航）。
2. 找到并点开你的 Worker（本项目预设名 `personal-site`）。
3. 进入 **Settings → Variables**（中文界面可能是「变量」）。
4. 在 **Runtime variables and secrets（运行时变量和密钥）** 区域（不是「Build（构建）」标签），点右上 **+ 添加变量**。
5. 在弹出的「添加环境变量」对话框中填写第一个变量：
   - **密钥**：`ADMIN_KEY`
   - **值**：`PersonalSiteBiliww`（或你自定义的口令）
   - **值右侧的「密钥」复选框**：**必须勾选** ✅（这样 Cloudflare 才会把它当作加密 Secret 存储；不勾选就是明文文本变量，不安全且控制台会明文显示）
6. 点对话框左下的 **+ 添加**，继续添加第二个变量：
   - **密钥**：`GITHUB_TOKEN`
   - **值**：你的 fine-grained PAT（仅 `YunyuVv/PersonalSite` 仓库 Contents:read and write）
   - **值右侧的「密钥」复选框**：**必须勾选** ✅
7. 确认对话框下方的计数变成「添加 2 个变量」，点该蓝色按钮保存/部署。

> ⚠️ 注意：若页面同时有 **Production** 和 **Preview** 两个环境标签，要在 **Production** 下添加；填到 Preview 会导致 Git 自动部署（Production）读不到。

> 🔴 **添加/修改 Secret 后必须重新部署一次！** Cloudflare 的 Secret 是「声明式」的——控制台添加后只是登记到服务，**不会立即注入正在运行的 Worker**。必须再触发一次部署（控制台 Deploy / 重新 push / `wrangler deploy`），新 Secret 才会进入运行时。否则线上 `env.ADMIN_KEY` 仍是旧值（很可能是 `undefined`），导致登录一直 401。这正是「本地 OK、线上 401」的最常见原因。

### 与 `wrangler secret put` 的等价性

- 两种方式写入的 Secret **完全等效**，都加密存储在边缘、与部署包解耦，**不受 Git 自动部署影响、永久留存**。
- 控制台添加的 Secret 也会出现在 `wrangler secret put` 能看到的列表里，二者互通、不冲突。

## 备选 / 对照说明

| 变量 | 放哪 | 是否随自动部署留存 | 是否进仓库 |
|------|------|------------------|-----------|
| `GITHUB_REPO` / `GITHUB_BRANCH` | `wrangler.jsonc` 的 `vars` | ✅ 每次带入 | ⚠️ 明文进仓库（非敏感，可接受） |
| `ADMIN_KEY` / `GITHUB_TOKEN` | `wrangler secret put` | ✅ 永久留存 | ❌ 不进仓库（推荐） |
| 控制台手动填（曾用） | 控制台 Variables | ❌ 易被环境/构建范围弄丢 | — |

## 注意事项

- `wrangler secret put` 不会删除其他已配置的 secret；它与 `wrangler.jsonc` 的 `vars` 互不冲突（secret 优先）。
- 若你的自动部署是「Cloudflare Workers Builds（Git 集成）」，Secrets 同样生效——因为它们是挂在 Worker 服务上的，与构建触发方式无关。
- 若之前控制台残留了错环境的同名变量，可在控制台手动删除，避免混淆。
- 本地 `.env.local` 仍保留一份（仅供本地 `npm run dev`），与线上 secret 互不干扰。
