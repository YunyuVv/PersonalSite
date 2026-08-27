# ---- 构建阶段 ----
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
# 防止部分环境下 NODE_OPTIONS=--use-system-ca 导致 Next/Turbopack 构建失败
ENV NODE_OPTIONS=
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# ---- 运行阶段 ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# Next.js standalone 产物：包含最小运行依赖
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/data ./data
EXPOSE 3000
CMD ["node", "server.js"]
