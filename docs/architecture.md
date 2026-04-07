# Architecture (Initial)

## Core services

- `dashboard`: UI for self-service deployments
- `api`: request validation + orchestration + integrations
- `worker`: queue consumer that executes deployment steps
- `redis` (later): queue broker/backing store

## Primary workflow

1. User creates deployment request from dashboard.
2. API validates and stores request metadata.
3. API enqueues deployment job.
4. Worker processes steps (DNS, SSH setup, app start, nginx, SSL).
5. Worker updates status/log stream.
