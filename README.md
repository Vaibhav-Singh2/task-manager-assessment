# Task Manager Monorepo

Production-style full-stack task manager built in a Turborepo monorepo.

## Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: MongoDB (Mongoose)
- Auth: JWT

## Workspace Structure

- `apps/web`: Vite frontend application
- `apps/api`: Express REST API
- `packages/eslint-config`: shared lint config
- `packages/typescript-config`: shared TS config

## Getting Started

1. Install dependencies:
```bash
yarn install
```
2. Configure env files:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```
3. Run all apps:
```bash
yarn dev
```

## Scripts

- `yarn dev`: run all app dev servers via Turbo
- `yarn build`: build all workspaces
- `yarn check-types`: type-check all workspaces
- `yarn lint`: lint all workspaces
- `yarn test`: run all workspace tests

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Deployment Readiness

- Environment variables are externalized via `.env.example`
- Backend has production build/start scripts
- Frontend supports static production build via Vite
