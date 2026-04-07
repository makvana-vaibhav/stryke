# Stryke

Self-Service Deployment Automation Platform (Internal DevOps Tool)

## Goal

Allow developers to deploy apps without manual DevOps intervention for routine flows.

## Initial Monorepo Structure

```text
.
├── apps
│   ├── api
│   │   ├── src
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── dashboard
│   │   ├── src
│   │   │   └── README.md
│   │   └── package.json
│   └── worker
│       ├── src
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── packages
│   ├── config
│   │   ├── src
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── contracts
│       ├── src
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── infra
│   ├── nginx
│   │   └── templates
│   │       └── app.conf.template
│   ├── docker
│   └── scripts
│       └── deploy-steps.md
├── docs
│   ├── architecture.md
│   └── deployment-flow.md
├── deployments
│   └── .gitkeep
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## What each app does

- `apps/dashboard`: frontend for deployment requests + logs/status
- `apps/api`: validates input, creates deployment jobs, exposes APIs
- `apps/worker`: executes deployment pipeline jobs (DNS, SSH, Nginx, SSL)
- `packages/contracts`: shared request/status types
- `packages/config`: shared config loader helpers

## Current mode

- Redis/queue is intentionally disabled for now.
- API runs with in-memory storage for basic testing.

## Run basic API server

1. Go to `apps/api`
2. Run `npm run dev`
3. Test endpoints:
	- `GET /health`
	- `GET /servers`
	- `GET /deployments`
	- `POST /deployments`

## Run dashboard UI

1. Start API first (`apps/api`, `npm run dev`)
2. In another terminal go to `apps/dashboard`
3. Run `npm run dev`
4. Open `http://localhost:3000`

Deployment form currently captures:

- repository URL
- branch (default main)
- server (pre-configured dropdown)
- app name
- domain/subdomain
- internal port
- environment variables (key=value lines)

## Step-by-step plan

1. Bootstrap API (`Fastify`/`Nest`) + health/deploy endpoints.
2. Add queue (`BullMQ` + Redis) between API and worker (later).
3. Build worker pipeline skeleton (mock deployment steps first).
4. Add Cloudflare DNS integration.
5. Add SSH executor + server setup tasks.
6. Add Nginx + SSL automation modules.
7. Build dashboard UI for submit + logs + history.

## Next step (recommended)

Implement Step 1 now: API bootstrap + `/health` and `/deployments` endpoints.
