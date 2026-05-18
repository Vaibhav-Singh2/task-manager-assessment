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

## Getting Started (AWS Production Deployment & CI/CD)

**Live Application:** [http://ec2-13-127-200-200.ap-south-1.compute.amazonaws.com](http://ec2-13-127-200-200.ap-south-1.compute.amazonaws.com)

The application features a secure, enterprise-grade deployment strategy designed for AWS EC2, complete with a fully automated GitHub Actions CI/CD pipeline. The stack is deployed inside a unified Docker network with an internal Nginx reverse proxy. **Only ports 22 (SSH) and 80 (HTTP) need to be open to the internet.**

### 1. Configure AWS EC2 Security Group

Ensure the inbound rules on your AWS Security Group are set as follows:

- **SSH (Port 22):** Restricted to `My IP` (or open for remote administration/GitHub runner access).
- **HTTP (Port 80):** Open to `0.0.0.0/0` (Anywhere) for public web access.
- **HTTPS (Port 443):** Open to `0.0.0.0/0` (Anywhere) if SSL certificates are configured.
  _(Note: Ports 5173, 4000, and 27017 do not need to be opened externally; they are secured and routed internally)._

### 2. Prepare EC2 Instance (One-time Setup)

Log into your EC2 instance via SSH and install Docker + Docker Compose:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER
```

_Note: Log out and log back in for your user group changes to apply._

### 3. Add GitHub Repository Secrets

Navigate to your repository on GitHub, then go to `Settings` -> `Secrets and variables` -> `Actions`. Create the following Repository Secrets:

- `EC2_HOST`: The Public IP or Public DNS of your EC2 instance.
- `EC2_USERNAME`: The SSH user (e.g. `ubuntu` or `ec2-user`).
- `EC2_SSH_KEY`: The complete private key (`.pem`) used to authenticate with your EC2 instance.
- `MONGO_URI`: Your MongoDB database connection string (e.g. MongoDB Atlas).
- `JWT_SECRET`: A secure, cryptographically random key used to sign session tokens.

### 4. Trigger Automatic Deployment

Simply push any commit to the `main` branch:

```bash
git add .
git commit -m "deploy: initial production release"
git push origin main
```

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will automatically kick in, test your codebase, securely push the environment variables directly on the instance, spin up the Docker Compose stack with zero-downtime, verify the backend health, and publish a final run summary showing which checks passed, failed, or were skipped.

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

---

## Detailed Documentation

For a deeper dive into the product's architectural specifications, roadmap, and guidelines, please refer to the files in the `docs/` directory:

- [**System Architecture (`docs/ARCHITECTURE.md`)**](./docs/ARCHITECTURE.md) – Detailed system overview, data flow diagrams, security practices, and monorepo structure.
- [**Product Requirements (`docs/PRODUCT_REQUIREMENTS.md`)**](./docs/PRODUCT_REQUIREMENTS.md) – Complete user stories, feature specifications, and UX specifications.
- [**Development Style Guide (`docs/STYLE_GUIDE.md`)**](./docs/STYLE_GUIDE.md) – Coding standards, folder structures, linting guidelines, and code conventions for both API and Web.
- [**Project Roadmap (`docs/ROADMAP.md`)**](./docs/ROADMAP.md) – Future milestones, feature ideas, scalability plans, and expansion plans.
- [**CI/CD Pipeline (`docs/CICD.md`)**](./docs/CICD.md) – Detailed overview of automated quality gates, MongoDB test container services, and EC2 deployment workflows.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
