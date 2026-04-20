# Aoluo

AI 驱动的后台管理系统

## 开发 (Dev)

启动 PG 数据库

`docker compose up`

Better-Auth 数据准备

`pnpm auth:schema`

数据库迁移

```sh
pnpm db:generate
pnpm db:migrate
```

启动页面

`pnpm dev --open`
