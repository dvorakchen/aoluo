# --- 阶段 1: 构建阶段 ---
FROM hub.aiursoft.com/node:24-alpine AS builder

# 安装 pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ENV NODE_ENV=production
ENV PUBLIC_ORG_NAME="公司名称"
ENV ADMIN_DATABASE_URL="postgres://user:password@db:5432/local"
ENV BETTER_AUTH_SECRET="000000000"

RUN corepack enable

WORKDIR /app

# 拷贝依赖定义文件
COPY pnpm-lock.yaml package.json ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 拷贝源码
COPY . .

# 执行构建 (使用 pnpm build)
RUN pnpm build

# --- 阶段 2: 运行阶段 ---
FROM hub.aiursoft.com/node:24-alpine AS runner

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# 设置生产环境标识
ENV NODE_ENV=production

# 拷贝构建产物
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/build ./build
COPY --from=builder /app/server.js ./server.js

# 安装生产依赖
RUN pnpm install --prod --frozen-lockfile

# 暴露端口
EXPOSE 3000

# 启动
CMD ["node", "server.js"]
