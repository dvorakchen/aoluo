# Aoluo (傲罗)

A full-stack application template built with SvelteKit 5 + Better Auth + Drizzle ORM, featuring a responsive WebSocket architecture and a complete Docker deployment solution.

## 🌟 Features

- **SvelteKit 5 (Runes)**: Leverages the latest rune system for ultimate reactive performance.
- **Better Auth**: Robust authentication solution supporting email/password, organization management, and phone login.
- **Drizzle ORM**: Type-safe database operations with migration support.
- **WebSocket Architecture**:
  - **Dev Environment**: Vite plugin with manual upgrade handling to separate business WS from HMR.
  - **Production**: Custom Node.js server for high-performance WS support on the same port.
- **Dockerized Deployment**: Multi-stage Dockerfile and optimized Docker Compose configuration.

## 🚀 Quick Start

### 1. Prerequisites

Copy the environment template:

```bash
cp .env.example .env
```

### 2. Development

```bash
pnpm install
pnpm dev
```

URL: `http://localhost:5173`
_WS URL: `ws://localhost:5173/ws`_

### 3. Database

```bash
pnpm db:doall      # Sync schema to database
pnpm db:studio    # Open database GUI
```

## 🐳 Docker Deployment

The project is optimized for Docker. Start the app and database with a single command:

```bash
docker compose up --build -d
```

Default URL: `http://127.0.0.1:3000`

### Critical Environment Variables

In production, ensure these variables are correctly set in `compose.yaml`:

- `ORIGIN`: The primary identity of the SvelteKit app (Required for CSRF checks).
- `BETTER_AUTH_URL`: Base URL for authentication.
- `PUBLIC_ORIGIN`: Base URL for client-side WebSocket connections.
- `ADMIN_DATABASE_URL`: Production database connection string.

## 🛠️ Architecture Details

### WebSocket Implementation

Uses "Path Separation". All business WebSocket connections request the `/ws` path to avoid conflicts with Vite's HMR service during development.

### Custom Entry Point (server.js)

Instead of the standard `node build`, we use `server.js` as the entry point. It manually mounts the WebSocket service and forwards HTTP requests to the SvelteKit Handler.

## 📜 License

Apache-2.0
