# Aoluo

AI-powered back-office management system

[中文版](./README.zh.md)

## Dev

Start PG database

`docker compose up`

Better-Auth data preparation

`pnpm auth:schema`

Database migration

```sh
pnpm db:generate
pnpm db:migrate
```

Start page

`pnpm dev --open`
