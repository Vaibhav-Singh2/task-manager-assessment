# Task Manager Monorepo

Production-style full-stack task manager built in a Turborepo monorepo.

## Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT

## Workspace Structure

- `apps/web`: Vite frontend application
- `apps/api`: Express REST API
- `packages/eslint-config`: Shared ESLint configurations
- `packages/typescript-config`: Shared TypeScript configurations

---

## Getting Started (Docker Setup - Recommended)

This is the fastest way to run the entire stack (Database, Backend API, and Frontend) fully configured and optimized without needing to install Node.js or MongoDB locally.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Setup and Launch Steps
1. **Configure Environment Variables:**
   Create `.env` files from the examples:
   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

2. **Build and Start all containers:**
   ```bash
   docker compose up -d --build
   ```

3. **Verify the App:**
   - **Frontend UI:** Open [http://localhost:5173](http://localhost:5173) in your browser.
   - **Backend API:** Connects via [http://localhost:4000](http://localhost:4000).

4. **Shutdown:**
   ```bash
   docker compose down
   ```

---

## Getting Started (Manual Setup)

If you prefer to run the application natively on your host machine, follow these instructions.

### Prerequisites
- **Node.js:** v18 or newer (v20+ recommended)
- **Package Manager:** `yarn` (v1.22.x)
- **Database:** MongoDB running locally on port `27017` (e.g., `mongodb://localhost:27017/task-manager`)

### Setup and Launch Steps
1. **Install workspace dependencies:**
   ```bash
   yarn install
   ```

2. **Configure Environment Variables:**
   Copy the example files and modify the values if necessary (e.g. updating `MONGO_URI` or `JWT_SECRET` in `apps/api/.env`):
   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

3. **Run in development mode:**
   ```bash
   yarn dev
   ```

4. **Access the App:**
   - **Frontend UI:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:4000](http://localhost:4000)

---

## Running Tests

Both the frontend client and the backend API have comprehensive test suites validating CRUD operations, authentication guards, user ownership rules, routing, and filtering.

Run all tests in parallel across workspaces:
```bash
yarn test
```

You can also run tests in individual directories:
- **Backend Tests:** `cd apps/api && yarn test`
- **Frontend Tests:** `cd apps/web && yarn test`

---

## Global Workspace Scripts

These global workspace commands are coordinated efficiently by Turborepo:

- `yarn dev`: Launch all development servers in parallel
- `yarn build`: Compile production bundles for all apps
- `yarn test`: Execute both Vitest frontend and backend test suites
- `yarn lint`: Run ESLint across all workspaces
- `yarn check-types`: Run TypeScript compiler checks across all codebases

---

## API Endpoints

- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate a user and receive a JWT token
- `GET /api/tasks` - Fetch user's tasks (supports pagination, sorting, search, and state filtering)
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update an existing task (mark complete, change priority, etc.)
- `DELETE /api/tasks/:id` - Delete a task

---

## Architecture Decisions

The application uses a **Monorepo Architecture** powered by Turborepo. This allows us to share configuration (ESLint, TypeScript) across the frontend and backend, reducing duplication and ensuring consistency.

**Backend (Express + TypeScript + MongoDB)**
- **RESTful API:** Standard HTTP methods and status codes are used for CRUD operations.
- **JWT Authentication:** Selected for stateless, scalable authentication. Tokens are verified via a middleware.
- **Mongoose ORM:** Used for MongoDB data modeling, providing schema validation and type safety.
- **Pagination & Sorting:** Implemented directly at the database level using Mongoose's `limit`, `skip`, and `sort` for optimal performance with large datasets.

**Frontend (React + Vite + Tailwind CSS)**
- **Vite:** Chosen over Create React App for significantly faster HMR and optimized production builds.
- **Redux Toolkit:** Manages global state (authentication and task lists), ensuring predictable state updates and avoiding prop drilling.
- **Tailwind CSS:** Utility-first CSS provides rapid styling and a consistent design system.
- **React Router:** Handles client-side navigation with protected route guards for authenticated areas.
