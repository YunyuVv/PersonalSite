# Docker 部署使用文档

镜像由 GitHub Actions 自动构建并推送到 GHCR，**服务器只拉取镜像并启动，不编译**。

- 镜像：`ghcr.io/yunyuvv/personal-site:xianyu-qingzheng`（双架构 `linux/amd64` + `linux/arm64`）
- **容器名：`personal-site-qz`**（已在 compose 用 `container_name` 固定）
- **项目名：`personal-site-qz`**（所有命令统一带 `-p personal-site-qz`）
- 访问端口：宿主 `12002` → 容器 `3000`
- 后台：`http://<服务器IP>:12002/admin`，登录口令为环境变量 `ADMIN_TOKEN`
- 配置持久化：宿主 `../data` → 容器 `/app/data`（后台改动即时写入 `data/config.json`）

| 文件 | 作用 |
| --- | --- |
| `Dockerfile` | 两阶段构建，产出 Next.js standalone 最小运行镜像 |
| `docker-compose.yml` | 只引用镜像，定义容器名 / 端口 / 挂载 / 环境变量 / 重启策略 |

> 路径说明：`../data` 是**相对 compose 文件本身**的路径，指向仓库根的 `data/`。无论在 `docker/` 目录内执行，还是在仓库根用 `-f docker/docker-compose.yml` 执行，挂载目标都一致。

---

## 1. 第一次启动

### 1.1 前置检查

```bash
docker --version          # 需 20.10+
docker compose version    # 需 v2（命令带空格）
ss -lntp | grep 12002     # 端口需空闲；同时确认防火墙已放行
```

### 1.2 启动步骤

```bash
# 1. 拉取代码并切到部署分支
git clone https://github.com/YunyuVv/PersonalSite.git
cd PersonalSite
git checkout main-xianyu-qingzheng

# 2. 配置目录（仓库已含 data/config.json）
mkdir -p data

# 3. 改后台口令（重要！不要用默认口令）
openssl rand -hex 32                     # 生成强随机值
#    把结果填进 docker/docker-compose.yml 的 ADMIN_TOKEN

# 4. 登录 GHCR（镜像为 Private 时必需；PAT 需 read:packages 权限）
echo "<你的PAT>" | docker login ghcr.io -u YunyuVv --password-stdin

# 5. 启动
cd docker
docker compose -p personal-site-qz up -d
```

> 若不想在服务器放源码：只把 `docker-compose.yml` 上传到 `/opt/personal-site/docker/`，并建好 `/opt/personal-site/data/`，然后在 `docker/` 目录执行同样的 `up -d` 即可（`../data` 会指向 `/opt/personal-site/data`）。

### 1.3 验证

```bash
# 容器名与状态
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
# 应看到：personal-site-qz   Up ...   0.0.0.0:12002->3000/tcp

# 访问验证（返回 200 即正常）
curl -I http://127.0.0.1:12002/
curl -I http://127.0.0.1:12002/admin
```

浏览器访问 `http://<服务器IP>:12002`；后台 `http://<服务器IP>:12002/admin`，输入 `ADMIN_TOKEN` 登录（登录后 7 天内免重复输入）。

查看服务器公网 IP：`curl ifconfig.me` 或 `curl ip.sb`。

---

## 2. 后续升级

镜像在 **push 到 `main-xianyu-qingzheng` 分支**时由 CI 自动构建推送，服务器只需拉新镜像并重建容器。

```bash
cd /path/to/PersonalSite/docker

# 1. 拉取最新镜像
docker compose -p personal-site-qz pull

# 2. 用新镜像重建容器（秒级切换，容器名不变）
docker compose -p personal-site-qz up -d

# 3. 确认
docker ps --format "table {{.Names}}\t{{.Status}}"
docker compose -p personal-site-qz logs --tail=50 site
```

**升级不丢配置**：配置在宿主的 `data/`，通过挂载保留；容器名固定为 `personal-site-qz`，与拉取镜像互不影响。

想等 CI 跑完再升级（需装 `gh` 并登录）：

```bash
gh run watch
gh run list --workflow=build-image-xianyu-qingzheng.yml --limit=3
```

### 2.1 常用命令

均在 `docker/` 目录执行，项目名固定 `-p personal-site-qz`：

| 目的 | 命令 |
| --- | --- |
| 启动 | `docker compose -p personal-site-qz up -d` |
| 停止并移除 | `docker compose -p personal-site-qz down` |
| 重启 | `docker compose -p personal-site-qz restart` |
| 看状态 | `docker compose -p personal-site-qz ps` |
| 实时日志 | `docker compose -p personal-site-qz logs -f site` |
| 进入容器 | `docker compose -p personal-site-qz exec site sh` |
| 资源占用 | `docker stats personal-site-qz` |
| 清无用镜像 | `docker image prune -f` |

> 改了 `docker-compose.yml`（如 `ADMIN_TOKEN`）后必须 `up -d` 重建才会生效，仅 `restart` 不够。

### 2.2 配置备份

备份宿主的 `data/` 目录：

```bash
# 备份
tar czf site-data-$(date +%F).tar.gz -C /path/to/PersonalSite data

# 恢复后重启
tar xzf site-data-2026-08-29.tar.gz -C /path/to/PersonalSite
docker compose -p personal-site-qz restart
```
