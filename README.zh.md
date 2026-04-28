# Aoluo (傲罗)

基于 SvelteKit 5 + Better Auth + Drizzle ORM 构建的全栈应用模板，集成了响应式 WebSocket 服务和完整的 Docker 部署方案。

## 🌟 特性

- **SvelteKit 5 (Runes)**: 利用最新符文系统实现极致的响应式性能。
- **Better Auth**: 强大的身份验证方案，支持邮件/密码、组织管理及手机号登录。
- **Drizzle ORM**: 类型安全的数据库操作，支持迁移与自动生成。
- **WebSocket 架构**:
  - **开发环境**: Vite 插件实现 HMR 与业务 WS 路径分流。
  - **生产环境**: 自定义 Node.js 服务器，实现高性能 WS 支持。
- **Docker 化部署**: 预设多阶段构建 Dockerfile 及完善的 Compose 配置。

## 🚀 快速开始

### 1. 环境准备

复制环境变量模板并填入必要配置：

```bash
cp .env.example .env
```

### 2. 开发环境启动

```bash
pnpm install
pnpm dev
```

访问地址: `http://localhost:5173`
_WebSocket 地址: `ws://localhost:5173/ws`_

### 3. 数据库操作

```bash
pnpm db:push      # 同步模型到数据库
pnpm db:studio    # 开启可视化数据库管理
```

## 🐳 Docker 生产部署

项目已针对 Docker 进行了深度优化。只需一条命令即可启动应用与数据库：

```bash
docker compose up --build -d
```

默认访问地址: `http://127.0.0.1:3000`

### 关键环境变量

生产环境下，必须确保以下变量在 `compose.yaml` 中正确配置：

- `ORIGIN`: SvelteKit 身份识别地址（必须，解决 CSRF 校验）。
- `BETTER_AUTH_URL`: Better Auth 基础路径。
- `PUBLIC_ORIGIN`: 客户端 WebSocket 连接的基础地址。
- `ADMIN_DATABASE_URL`: 生产环境数据库连接串。

## 🛠️ 技术架构细节

### WebSocket 实现

项目采用了“路径分流”方案（Path Separation）。所有业务 WebSocket 连接统一请求 `/ws` 路径，从而避免在开发环境下与 Vite 的 HMR 热更新服务产生冲突。

### 生产环境入口 (server.js)

不同于标准的 `node build`，我们使用自定义的 `server.js` 作为入口。它手动挂载了 WebSocket 服务并将 HTTP 请求分发给 SvelteKit Handler，确保在 `adapter-node` 部署下 WS 依然可用。

## 📜 许可证

Apache-2.0
