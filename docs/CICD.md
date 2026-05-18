# Continuous Integration & Continuous Deployment (CI/CD)

This document provides a comprehensive overview of the automated pipeline driving the deployment of the Task Manager application to production.

---

## 1. High-Level Pipeline Architecture

The CI/CD pipeline is built natively using **GitHub Actions** and acts as an automated quality assurance barrier and deployment mechanism.

```text
        ┌────────────────────────────────────────────────────────┐
        │                  GITHUB ACTIONS RUNNER                 │
        │                                                        │
        │   ┌────────────────────────────────────────────────┐   │
        │   │             [1] Quality Gate Job               │   │
        │   │   • Yarn Cache & Install                       │   │
        │   │   • ESLint (yarn lint)                         │   │
        │   │   • TypeScript Check (yarn check-types)        │   │
        │   │   • Vitest Suite (+ MongoDB Service Container) │   │
        │   └───────────────────────┬────────────────────────┘   │
        │                           │ (If All Pass)              │
        │                           ▼                            │
        │   ┌────────────────────────────────────────────────┐   │
        │   │             [2] Deployment Job                 │   │
        │   │   • SSH Connection to AWS EC2                  │   │
        │   │   • Git Clone / Pull to Workspace              │   │
        │   │   • Secure Environment Variables Injection     │   │
        │   │   • Docker Compose Build                       │   │
        │   │   • Zero-Downtime Swap (docker compose up -d)  │   │
        │   │   • Storage Pruning (docker image prune)       │   │
        │   │   • Active `/health` Verification Loop         │   │
        │   └────────────────────────────────────────────────┘   │
        └────────────────────────────────────────────────────────┘
```

---

## 2. Trigger Configuration & Optimization

To prevent waste of computing resources and avoid unnecessary server restarts, the pipeline employs a **strict path filter**. It will **not** trigger on commits that only contain changes to:
*   Markdown files (`*.md`)
*   Documentation directory (`docs/**`)
*   Licensing and configuration text files (`.gitignore`, `.gitattributes`)

### Configuration Snippet (`.github/workflows/deploy.yml`):
```yaml
on:
  push:
    branches: ["main"]
    paths-ignore:
      - '**.md'
      - 'docs/**'
      - 'LICENSE'
      - '.gitignore'
      - '.gitattributes'
  workflow_dispatch:  # Permits manual triggers from the GitHub Actions UI
```

---

## 3. Detailed Job Pipeline

### Job 1: Quality Gate
This job establishes a modern "shift-left" development strategy to guarantee that only production-grade code reaches the deployment stage.

1. **Caching & Setup:** Spins up a runner on `ubuntu-latest`, configures Node.js, and leverages Yarn workspace caching for ultra-fast run times.
2. **Standard Quality Commands:**
   *   `yarn lint` – Enforces styling standards.
   *   `yarn check-types` – Validates static typing.
3. **Integration Testing Database:** 
   GitHub Actions provisions an ephemeral, high-fidelity **MongoDB Service Container** running side-by-side with your test runner:
   ```yaml
   services:
     mongodb:
       image: mongo:latest
       ports:
         - 27017:27017
   ```
   During the test run (`yarn test`), the API tests connect securely to `mongodb://localhost:27017/test_db`. When the job finishes, the database is completely destroyed.

---

### Job 2: EC2 Deployment
Upon quality gate approval, the workflow securely accesses the AWS target instance using SSH.

1. **SSH Connection:** Initiated using `appleboy/ssh-action@v1.0.3` via your secure `.pem` private key.
2. **Monorepo Synchronization:** Clones the codebase (if deploying for the first time) or pulls the latest updates from `origin/main`.
3. **Secrets Injection:** Securely creates host-level environment configuration files:
   *   **API `.env`:** Writes `MONGO_URI`, `JWT_SECRET`, and internal port mapping.
   *   **Web `.env`:** Initializes `VITE_API_URL` to an empty string `""` to enforce modern relative routing via Nginx.
4. **Orchestrations:**
   ```bash
   docker compose build --build-arg VITE_API_URL=""
   docker compose up -d
   ```
   Docker Compose recreates the backend, frontend, and database containers in an isolated production-network environment with zero downtime.
5. **Disk Hygiene:** Runs `docker image prune -f` to clean up dangling layers and protect the EC2 host from running out of disk space.

---

## 4. Post-Deployment Verification (Self-Healing Check)

The pipeline terminates with a robust **health check loop** to verify that the Express server successfully loaded its components and handles network requests:

```bash
# Poll health endpoint to ensure the API container is running
for i in $(seq 1 12); do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/health || echo "000")
  if [ "${STATUS}" = "200" ]; then
    echo "✅ Backend API is reachable and healthy"
    exit 0
  fi
  sleep 5
done
exit 1
```

If the API fails to register a `200 OK` status after 60 seconds, the deployment step is marked as failed, warning developers of a potentially unstable runtime state.

---

## 5. Security Group & Firewall Best Practices

Thanks to the integrated Nginx reverse-proxy setup, **you only need to open two ports on your AWS EC2 Instance Security Group**:

1. **Port 22 (SSH):** Restricted to your local administration IP or GitHub Actions.
2. **Port 80 (HTTP):** Open to `0.0.0.0/0` (Anywhere) for standard web traffic.

Internal systems like the database (`27017`) and API (`4000`) are fully sealed and unreachable from the outside world, creating a secure production perimeter.
