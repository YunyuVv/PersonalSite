# Docker 部署使用文档



本目录存放站点容器化部署文件，镜像由 GitHub Actions 自动构建并推送到 GHCR，**服务器只负责拉取镜像并启动，不在服务器上编译**。

- 镜像：`ghcr.io/yunyuvv/personal-site:xianyu-qingzheng`（tag 带分支标识，双架构 `linux/amd64` + `linux/arm64`）
- 访问端口：宿主 `12002` → 容器 `3000`
- 后台：`http://<服务器IP>:12002/admin`，登录口令为环境变量 `ADMIN_TOKEN`
- 配置持久化：宿主 `../data` → 容器 `/app/data`（后台改动即时写入 `data/config.json`）

| 文件 | 作用 |
| --- | --- |
| `Dockerfile` | 两阶段构建（builder + runner），产出 Next.js standalone 最小运行镜像 |
| `docker-compose.yml` | 只引用镜像，定义端口 / 挂载 / 环境变量 / 重启策略 |
| `README.md` | 本文档 |

> 路径说明：`docker-compose.yml` 位于 `docker/` 下，其中 `../data` 是**相对 compose 文件本身**的路径，指向仓库根的 `data/`。因此无论你在 `docker/` 目录内执行，还是在仓库根用 `-f docker/docker-compose.yml` 执行，挂载目标都一致。


查看当前服务器公网ip:curl ifconfig.me

curl ip.sb
159.54.172.209

---

## 0. 前置条件

| 项目 | 要求 | 检查命令 |
| --- | --- | --- |
| Docker | 20.10+ | `docker --version` |
| Docker Compose | v2（命令形如 `docker compose`，带空格） | `docker compose version` |
| 网络 | 服务器能访问 `ghcr.io` 与 `registry-1.docker.io` | `curl -I https://ghcr.io` |
| 端口 | `12002` 未被占用且防火墙已放行 | `ss -lntp \| grep 12002` |

### 0.1 GHCR 登录（私有镜像必需）

如果 GHCR 上的包是 **Private**，服务器必须先登录才能拉取：

```bash
# 用 GitHub 个人访问令牌（PAT）登录，需勾选 read:packages 权限
echo "<你的PAT>" | docker login ghcr.io -u YunyuVv --password-stdin
```

登录后凭据保存在 `~/.docker/config.json`，后续 pull 自动使用。

> 若想免登录：在 GitHub 仓库 → Packages → `personal-site` → Package settings → 把可见性改为 **Public**。

---

## 1. 第一次启动（全新服务器）

### 方式 A：服务器上 clone 仓库（推荐，配置随仓库一起管理）

```bash
# 1. 拉取代码并切到部署分支
git clone https://github.com/YunyuVv/PersonalSite.git
cd PersonalSite
git checkout main-xianyu-qingzheng

# 2. 确保配置目录存在（仓库已含 data/config.json；若为空，容器首次启动会写入默认配置）
mkdir -p data

# 3. 修改后台口令（重要！不要用默认口令）
#    编辑 docker/docker-compose.yml 第 16 行：ADMIN_TOKEN=<你的强随机值>
openssl rand -hex 32   # 生成随机口令

# 4. 登录 GHCR（私有镜像时）
echo "<你的PAT>" | docker login ghcr.io -u YunyuVv --password-stdin

# 5. 拉取镜像并后台启动
cd docker
docker compose -p personal-site up -d
```

### 方式 B：只放 compose 文件（最小部署，不 clone 仓库）

适合服务器上只跑容器、不放源码的场景：

```bash
# 1. 建目录：docker-compose.yml 放 docker/，配置放 ../data（即 /opt/personal-site/data）
sudo mkdir -p /opt/personal-site/docker /opt/personal-site/data
# 2. 把本目录的 docker-compose.yml 上传到 /opt/personal-site/docker/
# 3. 启动
cd /opt/personal-site/docker
docker compose -p personal-site-qz up -d
```

> 方式 B 下 `data/` 初始为空，容器首次启动会用内置默认配置写出 `data/config.json`，之后后台改动都会持久化到这里。若你想用仓库里已调好的配置，把 `data/config.json` 一并上传即可。

### 1.1 验证启动

```bash
# 查看容器状态（STATUS 应为 Up）
docker compose -p personal-site-qz ps

# 查看日志，确认无报错
docker compose -p personal-site-qz logs -f site

# 访问验证（服务器上执行，返回 200 即正常）
curl -I http://127.0.0.1:12002/
curl -I http://127.0.0.1:12002/admin
```

浏览器访问 `http://<服务器IP>:12002`，进入后台 `http://<服务器IP>:12002/admin`，输入 `ADMIN_TOKEN` 登录。

---

## 2. 后续升级

镜像已由 GitHub Actions 在 **push 到 `main-xianyu-qingzheng` 分支**时自动构建并推送。升级只需在服务器拉新镜像并重建容器：

```bash
cd /path/to/PersonalSite/docker     # 或 /opt/personal-site/docker

# 1. 拉取最新镜像
docker compose -p personal-site-qz pull

# 2. 用新镜像重建并启动（compose 检测到镜像变化会自动替换容器，秒级切换）
docker compose -p personal-site-qz up -d

# 3. 确认新容器已运行
docker compose -p personal-site-qz ps
docker compose -p personal-site-qz logs --tail=50 site
```

**升级不会丢失配置**：站点配置在宿主的 `data/` 目录，通过 volume 挂载，容器重建不影响数据。

### 2.1 等 CI 构建完成再升级（可选）

```bash
# 需要安装 gh CLI 并登录；监听最近一次 workflow 直到结束
gh run watch

# 或直接查看最近 3 次构建
gh run list --workflow=build-image-xianyu-qingzheng.yml --limit=3
```

### 2.2 一键升级脚本

把下面内容存为 `upgrade.sh`（放在 `docker/` 目录旁），以后只需 `./upgrade.sh`：

```bash
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/docker"
echo "==> 拉取最新镜像"
docker compose -p personal-site pull
echo "==> 重建容器"
docker compose -p personal-site up -d
echo "==> 清理旧镜像"
docker image prune -f
echo "==> 当前状态"
docker compose -p personal-site ps
```

```bash
chmod +x upgrade.sh && ./upgrade.sh
```

---

## 3. 日常运维命令速查

> 以下命令均在 `docker/` 目录执行；为简洁，用 `-p personal-site` 固定项目名。
>
> ⚠️ **项目名必须前后一致**：compose 以「项目名 + 服务名」标识容器。若第一次用 `-p personal-site` 启动，后续所有命令都要带同样的 `-p personal-site`；不带 `-p` 时会用目录名 `docker` 作为项目名，从而**另起一套新容器**（端口冲突、旧容器仍在跑）。一路统一即可。

| 目的 | 命令 |
| --- | --- |
| 启动（后台） | `docker compose -p personal-site up -d` |
| 停止（保留容器） | `docker compose -p personal-site stop` |
| 停止并移除容器 | `docker compose -p personal-site down` |
| 重启 | `docker compose -p personal-site restart` |
| 查看状态 | `docker compose -p personal-site ps` |
| 实时看日志 | `docker compose -p personal-site logs -f site` |
| 看最近 100 行日志 | `docker compose -p personal-site logs --tail=100 site` |
| 拉取新镜像 | `docker compose -p personal-site pull` |
| 进入容器 | `docker compose -p personal-site exec site sh` |
| 查看资源占用 | `docker stats` |
| 清理无用镜像 | `docker image prune -f` |

### 3.1 配置备份与恢复

```bash
# 备份（每天一份，保留在 data 目录旁）
tar czf /opt/backup/site-data-$(date +%F).tar.gz -C /opt/personal-site data

# 恢复：解压回原位后重启容器
tar xzf /opt/backup/site-data-2026-08-28.tar.gz -C /opt/personal-site
docker compose -p personal-site restart
```

### 3.2 修改环境变量后生效

改了 `docker-compose.yml` 里的 `ADMIN_TOKEN`、`PORT` 等，必须**重建容器**才会生效（`restart` 不够）：

```bash
docker compose -p personal-site up -d     # 检测到配置变化会自动 recreate
```

---

## 4. 回滚

镜像 tag `xianyu-qingzheng` 会不断被覆盖，回滚依赖本地已缓存的旧镜像或镜像 digest：

```bash
# 1. 查看本地已拉取的镜像及其 digest
docker images --digests | grep personal-site

# 2. 临时用旧 digest 启动（把 compose 里的 image 换成 digest 形式）
#    image: ghcr.io/yunyuvv/personal-site@sha256:<旧digest>
docker compose -p personal-site up -d

# 3. 确认恢复后，改回 tag 形式或保持锁定
```

> 建议后续给 workflow 加上「同时推送 commit-sha tag」（如 `:xianyu-qingzheng-<sha>`），这样回滚可以直接指定历史 tag，不依赖本地缓存。

---

## 5. 本地构建镜像（可选，不走 CI）

一般不需要——镜像由 CI 自动构建。若要在本地手动构建验证，**构建上下文必须是仓库根目录**（Dockerfile 里 `COPY package.json ...` 等路径都相对仓库根）：

```bash
# 在仓库根目录执行（注意末尾的点 = 当前目录作为上下文）
docker build -f docker/Dockerfile -t ghcr.io/yunyuvv/personal-site:xianyu-qingzheng .

# 构建双架构镜像（需先创建 buildx builder）
docker buildx create --use --name multiarch
docker buildx build -f docker/Dockerfile \
  --platform linux/amd64,linux/arm64 \
  -t ghcr.io/yunyuvv/personal-site:xianyu-qingzheng \
  --push .
```

> `.dockerignore` 位于仓库根目录，Docker 只读取**构建上下文根目录**下的 `.dockerignore`，因此不要把它移入 `docker/`，否则 `node_modules`、`.next`、`.workbuddy` 会被打进镜像。

本地跑一下验证镜像可用：

```bash
docker run --rm -p 12002:3000 -e ADMIN_TOKEN=test ghcr.io/yunyuvv/personal-site:xianyu-qingzheng
```

---

## 6. 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| `pull access denied for ghcr.io/...` | GHCR 包为私有且未登录 / PAT 无 `read:packages` | `docker login ghcr.io -u YunyuVv`，或把包改为 Public |
| `bind source path does not exist: ../data` | 挂载源目录不存在 | `mkdir -p data` 后重新启动 |
| `Error starting userland proxy: listen tcp 0.0.0.0:12002: bind: address already in use` | 宿主 12002 被占用 | 换端口 `"13002:3000"` 或 `ss -lntp \| grep 12002` 找出占用进程停掉 |
| `permission denied` 写 `data/config.json` | 容器内 node 用户无宿主目录写权限 | `chmod 777 data`（或 `chown -R 1000:1000 data`，alpine node 镜像默认 uid 1000） |
| 后台保存返回「未授权」 | 页面输入的 Token 与容器 `ADMIN_TOKEN` 不一致 | 登录时填 `docker-compose.yml` 里的 `ADMIN_TOKEN`；改完需 `up -d` 重建 |
| 改了 compose 但没生效 | 只 `restart` 不会应用配置变更 | 用 `docker compose up -d` 触发 recreate |
| 拉到 `exec format error` | 镜像架构与服务器 CPU 不匹配 | 镜像已含双架构，执行 `docker pull` 重新拉取匹配当前平台的 manifest |
| 升级后页面样式丢失 | 浏览器缓存了旧静态资源 | 强制刷新 `Ctrl/Cmd + Shift + R` |

---

## 7. 部署流程总览

```
本地改代码
   └─> git push origin main-xianyu-qingzheng
          └─> GitHub Actions（.github/workflows/build-image-xianyu-qingzheng.yml）
                 ├─ QEMU + Buildx（linux/amd64, linux/arm64）
                 └─ push  ghcr.io/yunyuvv/personal-site:xianyu-qingzheng
                        └─> 服务器：docker compose pull && docker compose up -d
                                  └─> 站点更新完成（data/ 配置不受影响）
```
