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
- `yarn test`: run all workspace tests (both frontend and backend tests are run in parallel)

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Architecture Decisions

The application uses a **Monorepo Architecture** powered by Turborepo. This allows us to share configuration (ESLint, TypeScript) across the frontend and backend, reducing duplication and ensuring consistency.

**Backend (Express + TypeScript + MongoDB)**
- **RESTful API**: Standard HTTP methods and status codes are used for CRUD operations.
- **JWT Authentication**: Selected for stateless, scalable authentication. Tokens are verified via a middleware.
- **Mongoose ORM**: Used for MongoDB data modeling, providing schema validation and type safety.
- **Pagination & Sorting**: Implemented directly at the database level using Mongoose's `limit`, `skip`, and `sort` for optimal performance with large datasets.

**Frontend (React + Vite + Tailwind CSS)**
- **Vite**: Chosen over Create React App for significantly faster HMR and optimized production builds.
- **Redux Toolkit**: Manages global state (authentication and task lists), ensuring predictable state updates and avoiding prop drilling.
- **Tailwind CSS**: Utility-first CSS provides rapid styling and a consistent design system.
- **React Router**: Handles client-side navigation with protected route guards for authenticated areas.

## Deployment Readiness

- Environment variables are externalized via `.env.example`
- Backend has production build/start scripts
- Frontend supports static production build via Vite
