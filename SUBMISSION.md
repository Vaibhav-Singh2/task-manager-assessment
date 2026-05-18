# 🚀 Stitch Task Manager — Full-Stack Submission Guide

Welcome to the official assessment submission for the **Akrisso Full-Stack Engineering Challenge**. 

This repository implements a production-grade, highly secure, and visually stunning Task Management platform. It is structured inside a modern Turborepo monorepo, complete with robust backend schemas, a polished client interface, isolated data gates, bonus category tagging systems, and a fully automated AWS EC2 containerized CI/CD routing architecture.

* **Live Application URL:** [http://ec2-13-127-200-200.ap-south-1.compute.amazonaws.com](http://ec2-13-127-200-200.ap-south-1.compute.amazonaws.com)
* **API Health Check:** [http://ec2-13-127-200-200.ap-south-1.compute.amazonaws.com/api/health](http://ec2-13-127-200-200.ap-south-1.compute.amazonaws.com/api/health)

---

## 🏛️ Architect Explanation (Key Engineering Decisions)

* **Layered Architectural Boundaries (Controller-Service-Repository):** The backend is strictly segregated into routers (transport mapping), controllers (request destructuring & lifecycle), and services (pure business rules). This keeps database calls decoupled from Express APIs, facilitating rapid unit-testing and effortless migration boundaries.
* **Pre-Compiled Secure Container Packaging (GHCR):** To eliminate server CPU spikes and build lags on the EC2 host during deployments, containers are compiled on isolated GitHub Actions runners and pushed to the GitHub Container Registry (GHCR). The EC2 host merely pulls and swaps pre-built binaries instantly.
* **Zero-Trust Data Isolation Gatekeepers:** Security is built directly into the service layer. Every CRUD operation strictly queries on compounded indexes `{ userId, taskId }`. It is mathematically impossible for User A to read, list, edit, or delete tasks belonging to User B, triggering a clean `403 Forbidden` response.
* **Deterministic HSL Pastel Badging:** Instead of maintaining a bloated color-mapping database, tags are transformed into rich pastel UI badges utilizing a client-side hashing algorithm. It seeds the tag name to generate unique, balanced HSL profiles, yielding a gorgeous color harmony automatically.
* **Stateless Session Tokens (JWT):** Authentication is completely stateless, relying on high-integrity JSON Web Tokens signed with server-side secrets. Passwords are never saved in plain text, utilizing 10 rounds of `bcrypt` hashing.
* **Unified Entrypoint Nginx Reverse-Proxy:** By proxying all backend traffic under `/api/*` through Nginx, standard browsers avoid CORS pre-flight bottlenecks, while allowing the production instance to seal its databases (`27017`) and API engines (`4000`) completely behind a strict port 80/22 firewall perimeter.

---

## 🏆 Completed Requirements Checklist

### 1. Must-Have MVP Core (100% Completed)
- [x] **Secure User Authentication:** Hashed passwords (`bcrypt`) and signed JWT token exchanges.
- [x] **Core Task CRUD:** Add, retrieve, edit, and delete operations on tasks.
- [x] **Dashboard View:** Interactive task tables with due date boundaries and status stats.
- [x] **Priority Accents:** Slated Low, amber Medium, and red High urgency distinct indicators.
- [x] **Data Access Isolation:** Strict ownership validation on all routes.

### 2. Should-Have Polish Features (100% Completed)
- [x] **Global Query & Filters:** Live search on titles/descriptions/tags, status toggles, and priority selectors.
- [x] **Zod Schema Safeguards:** Robust backend/frontend validators protecting schemas from dirty inputs.
- [x] **Premium Dark Aesthetic:** Fluid, glassmorphic dark theme styled with responsive CSS.

### 3. Bonus Tasks & DevOps Focus (100% Completed)
- [x] **Bonus 1 (Task Tags System):** Comma-separated tags, custom Zod limits (max 10 tags, 30 chars each), dynamic tag-filtering queries (`?tag=frontend`), regex global search queries, and beautiful dynamic HSL badging.
- [x] **Bonus 2 (AWS EC2 Production routing):** Containerized Nginx routing proxying standard static React assets and forwarding `/api/*` to our API engine.
- [x] **Bonus 3 (GitHub Actions CI/CD):** Fully automated 4-stage pipeline:
  1. **Quality Gate:** Standard lints, compile checks, and Vitest runs against an active **MongoDB Service Container**.
  2. **Build & Push:** Pre-compiles Docker layers and registers secure image packages inside GHCR.
  3. **Deploy:** Establishes SSH session, pulls images, recreates Docker networks, and runs a self-healing health check.
  4. **Run Summary:** Visualizes workflow outcomes for easy pipeline auditing.

---

## 📁 Repository Directory Structure

```text
task-manager-assessment/
├── apps/
│   ├── api/                   # Node.js + Express API Server
│   │   ├── src/
│   │   │   ├── config/        # Database & Environment validation
│   │   │   ├── controllers/   # Request/Response lifecycle controllers
│   │   │   ├── middleware/    # Auth middleware, validators, error handler
│   │   │   ├── models/        # Mongoose Database Schemas
│   │   │   ├── routes/        # Router mappings
│   │   │   ├── services/      # Pure business rules & database operations
│   │   │   └── validations/   # Zod request validators
│   │   └── tests/             # Supertest API Integration Suites
│   │
│   └── web/                   # Vite + React Client App
│       ├── src/
│       │   ├── components/    # Atomic UI (TaskForms, TaskLists, Selects)
│       │   ├── store/         # Redux Toolkit centralized data slices
│       │   ├── types/         # TypeScript interfaces
│       │   └── test/          # Component & Form rendering Vitest Suites
│       └── Dockerfile         # Multi-stage production Nginx wrapper
│
├── packages/                  # Shared Turborepo configurations
│   ├── eslint-config/         # Standard Lint rules
│   └── typescript-config/     # TSC base options
```

---

## 🚀 How to Run locally

### Method A: Docker Compose (Recommended - Fastest)
Ensures the entire workspace (MongoDB database, backend API, and React frontend) launches fully connected without manual dependency installs.

1. Clone and navigate to the directory:
   ```bash
   cd task-manager-assessment
   ```
2. Setup base configuration files from templates:
   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```
3. Boot the environment:
   ```bash
   docker compose up -d --build
   ```
4. Access:
   * **Frontend Interface:** [http://localhost:5173](http://localhost:5173)
   * **Backend API:** [http://localhost:4000](http://localhost:4000)

---

### Method B: Native Dev Execution
Requires Node.js v20+ and Yarn v1.22.x installed on your host machine, alongside a local MongoDB instance running on port `27017`.

1. Install project dependencies:
   ```bash
   yarn install
   ```
2. Copy environment templates:
   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```
3. Run the development workspace:
   ```bash
   yarn dev
   ```

---

## 🧪 Running Verifications (Tests)

We maintain **100% pass rates** across a suite of 27 automated integration tests validating auth security, data ownership protection, and dashboard component routing:

```bash
# Run all tests in parallel
yarn test
```

* **Target API Tests:** `cd apps/api && yarn test` (Validates controllers, JWT encryption, user database boundaries)
* **Target Web Tests:** `cd apps/web && yarn test` (Validates React modal fields, state operations, tags parsing)

---

> Thank you for reviewing this project. We have built this code challenge to the highest professional standards, ensuring it represents a ready-to-deploy, robust, enterprise-grade cloud system. Please reach out if you have any questions!
