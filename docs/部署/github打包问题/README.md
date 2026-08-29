# GitHub 打包 / CI 构建问题排查与解决（main-xianyu-qingzheng）

> 分支：`main-xianyu-qingzheng`
> 技术栈：Next.js 16 (App Router) + React 19 + pnpm 11 + Docker (standalone) + GitHub Actions (GHCR)
> 整理时间：2026-08-28
> 适用对象：本仓库 CI 自动构建 Docker 镜像（`ghcr.io/yunyuvv/personal-site:xianyu-qingzheng`）

本文记录在 GitHub Actions 自动构建 Docker 镜像过程中踩到的所有坑位与最终可用配置。

---

## 0. 问题总览

| # | 问题 | 报错关键字 | 根因 | 修复 |
|---|---|---|---|---|
| 1 | 本地 `pnpm run dev` 端口占用 | `EADDRINUSE :::12002` | 残留 `node` 进程占用 12002 | `kill -9 <pid>` 清理 |
| 2 | push 分支后 CI 镜像构建失败 | `ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` | pnpm 11 不从 package.json 读 `pnpm` 字段；且 Dockerfile 安装阶段未拷贝 `pnpm-workspace.yaml` | overrides 移到 `pnpm-workspace.yaml`；Dockerfile 安装前先 COPY 该文件 |
| 3 | 全新安装构建脚本被拒 | `ERR_PNPM_IGNORED_BUILDS` | pnpm 11 用 `allowBuilds` 做构建审批，旧 `onlyBuiltDependencies` 已失效；`pnpm approve-builds` 生成的占位符不是合法布尔值 | 用 `allowBuilds` 写真实布尔值 |
| 4 | `--frozen-lockfile` 是否可去掉 | 交互式 `Proceed? (Y/n)` | 去掉会触发交互确认 + lockfile 漂移 | **保留** `--frozen-lockfile` |
| 5 | 产物/数据目录误提交 | — | 生成产物与 `.workbuddy` 不应进仓库 | `.gitignore` 加入 `.workbuddy/`、`outputs/` |

---

## 1. 本地端口冲突 EADDRINUSE :12002

**现象**
```
Error: listen EADDRINUSE: address already in use :::12002
```
`pnpm run dev`（脚本为 `next dev -p 12002`）启动失败。

**根因**：上一次开发服务器进程没有被正常回收，仍占用 12002 端口；普通 `kill`（SIGTERM）未能退出，需 `-9`。

**修复**
```bash
# 找到占用进程并强制结束（macOS）
lsof -i tcp:12002        # 或依据终端报错中的 pid
kill -9 <pid>
```

---

## 2. ERR_PNPM_LOCKFILE_CONFIG_MISMATCH（overrides 配置不匹配）

**现象**（GitHub Actions 日志）
```
[ERR_PNPM_LOCKFILE_CONFIG_MISMATCH] Cannot proceed with the frozen installation.
The current "overrides" configuration doesn't match the value found in the lockfile
```
早期还伴随：
```
The "pnpm" field in package.json is no longer read by pnpm.
The following keys were ignored: pnpm.onlyBuiltDependencies, pnpm.overrides
```

**根因**
1. 本项目是 **pnpm workspace**（存在 `pnpm-workspace.yaml`）。pnpm 10/11 **不再读取 `package.json` 里的 `pnpm` 字段**（`onlyBuiltDependencies` / `overrides` 均被忽略）。
2. lockfile（`pnpm-lock.yaml`，lockfileVersion 9.0）是用旧逻辑记录的 `overrides: balanced-match: 4.0.4`。
3. CI 用 `pnpm install --frozen-lockfile` 时，**Dockerfile 在安装阶段只拷贝了 `package.json` 和 `pnpm-lock.yaml`，没有拷贝 `pnpm-workspace.yaml`**（它要到后面的 `COPY . .` 才进镜像）。于是 pnpm 在构建上下文里找不到 `pnpm-workspace.yaml`，读不到 `overrides` → 实际生效 overrides 为空 → 与 lockfile 的 `4.0.4` 冲突。

**修复**
- `package.json`：删除 `pnpm` 字段（overrides / onlyBuiltDependencies 全部移除）。
- `pnpm-workspace.yaml`：把 `overrides` 写到此处（workspace 项目的正确位置）。
- `docker/Dockerfile`：在 `RUN pnpm install --frozen-lockfile` **之前**把 `pnpm-workspace.yaml` 也拷进构建上下文：
  ```dockerfile
  COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
  RUN pnpm install --frozen-lockfile
  COPY . .
  RUN pnpm build
  ```
- 验证：`corepack pnpm@11.24.0 install --lockfile-only` 应与现有 lockfile **无 diff**（说明 override 读取位置正确）。

---

## 3. ERR_PNPM_IGNORED_BUILDS（构建脚本审批）

**现象**（GitHub Actions 日志）
```
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts:
  esbuild@0.25.4, esbuild@0.28.1, sharp@0.34.5, unrs-resolver@1.12.2, workerd@1.20260722.1
Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.
```

**根因**
- pnpm 11 引入了新的构建脚本审批机制 **`allowBuilds`**，旧的 `onlyBuiltDependencies`（以及 `ignoredBuiltDependencies`）不再作为构建审批生效（仅 `config get` 能读到，但实际构建门禁不认）。
- 曾经执行过 `pnpm approve-builds`，它会往 `pnpm-workspace.yaml` 写入 `allowBuilds:` 模板，但值是占位符 `"set this to true or false"`，不是合法布尔值 → 审批无效 → 构建脚本被忽略（CI 非交互环境直接报错退出）。

**修复**（`pnpm-workspace.yaml` 示例中可用的最终配置）
```yaml
packages:
  - "."

# pnpm 11 用 allowBuilds 控制依赖构建脚本审批（替代旧版 onlyBuiltDependencies / ignoredBuiltDependencies）
# true = 允许该依赖执行 install/build 脚本；false = 忽略（不执行）
allowBuilds:
  esbuild: true        # 必需：esbuild 需要下载/安装平台二进制
  workerd: true       # 必需：workerd 需要构建
  sharp: false        # 可选：忽略，无需构建
  unrs-resolver: false

# 依赖覆盖（pnpm v10+ workspace 项目必须放在此处）
overrides:
  balanced-match: 4.0.4
```

**验证**（本地以 CI 同款行为复现 + 修复）
```bash
CI=true corepack pnpm@11.24.0 install --frozen-lockfile
# 修复前：EXIT=1，报 ERR_PNPM_IGNORED_BUILDS
# 修复后：EXIT=0，日志出现 "esbuild postinstall: Done" / "workerd postinstall: Done"
```

> ⚠️ 千万别删 `pnpm-workspace.yaml`：删掉会同时丢掉 `overrides`，导致第 2 类错误复发，且构建脚本审批依旧失效。

---

## 4. 是否可以把 `RUN pnpm install --frozen-lockfile` 换成 `RUN pnpm install`？

**结论：不建议。**

- `--frozen-lockfile` 只负责校验 lockfile 不被改动；`ERR_PNPM_IGNORED_BUILDS` 是独立的「构建脚本审批」门禁，与是否 frozen 无关，去掉它仍会报同样的错。
- 去掉 `--frozen-lockfile` 后，本地/CI 安装会触发交互式确认：`The modules directory ... will be removed and reinstalled from scratch. Proceed? (Y/n)`，在无 TTY 的 CI 里会卡住或导致构建不可复现（lockfile 漂移）。
- 真正该修的是构建审批（`allowBuilds`），而不是放松 lockfile 约束。保留 `--frozen-lockfile` 更稳妥。

---

## 5. .gitignore 与产物整理

不应进入仓库的文件：
- `.workbuddy/`（项目数据目录，按规范不提交、不删除）
- `outputs/`（WorkBuddy 生成的调研/可视化产物）

在 `.gitignore` 末尾追加：
```
# project-local data / generated artifacts (do not commit)
.workbuddy/
outputs/
```

---

## 6. 与本分支相关的其他交付物（上下文）

- `docker/Dockerfile`：基础镜像 `node:22-alpine`（多架构），`ENV NODE_OPTIONS=` 规避 Turbopack 的 `--use-system-ca` 问题；双架构构建由 CI 的 `platforms: linux/amd64,linux/arm64` 控制。
- `.github/workflows/build-image-xianyu-qingzheng.yml`：push 到 `main-xianyu-qingzheng` 自动构建并推送 `ghcr.io/yunyuvv/personal-site:xianyu-qingzheng`（支持双架构）。
- `docker/docker-compose.yml`：仅引用镜像（不再本地 build），端口 `12002:3000`，`./data:/app/data` 持久化。
- 镜像名固定带分支标识 `xianyu-qingzheng`；GitHub owner 强制小写（`yunyuvv`）。

## 7. 一键复现验证脚本（本地）

```bash
# 模拟 CI 全新安装（先确保 node_modules 不存在）
CI=true corepack pnpm@11.24.0 install --frozen-lockfile
# 期望：EXIT=0，且出现 esbuild/workerd 的 postinstall: Done

# 校验 overrides 与 lockfile 一致
corepack pnpm@11.24.0 install --lockfile-only   # 期望无 diff
```

---

## 8. 关键教训（Checklist）

1. pnpm workspace 项目的 `overrides` / `allowBuilds` 必须写在 `pnpm-workspace.yaml`，**不是** `package.json` 的 `pnpm` 字段。
2. Dockerfile 中凡是 pnpm 需要读取的配置文件（`pnpm-workspace.yaml`），必须在 `RUN pnpm install` **之前** `COPY` 进构建上下文。
3. pnpm 11 的构建脚本审批用 `allowBuilds`（布尔值），`onlyBuiltDependencies` 已失效；`pnpm approve-builds` 生成的占位符必须手动改回 `true`/`false`。
4. 保留 `--frozen-lockfile` 保证可复现；不要因构建报错就放松该约束。
5. 镜像名带分支标识、owner 小写；GitHub Actions 已声明 `packages: write`。
```
