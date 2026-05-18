# Continuous Integration & Continuous Deployment (CI/CD)

This document provides a comprehensive overview of the automated pipeline driving the deployment of the Task Manager application to production.

---

## 1. High-Level Pipeline Architecture

The CI/CD pipeline is built natively using **GitHub Actions** and acts as an automated quality assurance barrier, secure container build mechanism, and EC2 host deployment manager.

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
        │   │         [2] Build & Push to GHCR Job           │   │
        │   │   • Set up Docker Buildx                       │   │
        │   │   • Build API Container (backend/Dockerfile)   │   │
        │   │   • Build Web Container (frontend/Dockerfile)  │   │
        │   │   • Push versioned & latest images to GHCR     │   │
        │   └───────────────────────┬────────────────────────┘   │
        │                           │ (If Images Pushed)         │
        │                           ▼                            │
        │   ┌────────────────────────────────────────────────┐   │
        │   │             [3] Deployment Job                 │   │
        │   │   • SSH Connection to AWS EC2                  │   │
        │   │   • Pull latest commits to host directory      │   │
        │   │   • Secure Environment Variables Injection     │   │
        │   │   • Authenticate EC2 Docker engine to GHCR     │   │
        │   │   • Docker Compose Pull (pre-built images)     │   │
        │   │   • Zero-Downtime Swap (docker compose up -d)  │   │
        │   │   • Storage Pruning (docker image prune)       │   │
        │   │   • Active `/health` Verification Loop         │   │
        │   └────────────────────────────────────────────────┘   │
        │                           │                            │
        │                           ▼                            │
        │   ┌────────────────────────────────────────────────┐   │
        │   │             [4] Pipeline Summary               │   │
        │   │   • Always runs, even when prior jobs fail     │   │
        │   │   • Records lint/type-check/test outcomes      │   │
        │   │   • Records Docker compile & push outcomes     │   │
        │   │   • Records deploy, Docker, and health status   │   │
        │   │   • Writes a GitHub Actions run summary table  │   │
        │   └────────────────────────────────────────────────┘   │
        └────────────────────────────────────────────────────────┘
```

---

## 2. Trigger Configuration & Optimization

To prevent waste of computing resources and avoid unnecessary server restarts, the pipeline employs a **strict path filter**. It will **not** trigger on commits that only contain changes to:

- Markdown files (`*.md`)
- Documentation directory (`docs/**`)
- Licensing and configuration text files (`.gitignore`, `.gitattributes`)

### Configuration Snippet (`.github/workflows/deploy.yml`):

```yaml
on:
  push:
    branches: ["main"]
    paths-ignore:
      - "**.md"
      - "docs/**"
      - "LICENSE"
      - ".gitignore"
      - ".gitattributes"
  workflow_dispatch: # Permits manual triggers from the GitHub Actions UI
```

---

## 3. Detailed Job Pipeline

### Job 1: Quality Gate

This job establishes a modern "shift-left" development strategy to guarantee that only production-grade code reaches the deployment stage.

1. **Caching & Setup:** Spins up a runner on `ubuntu-latest`, configures Node.js v20, and leverages Yarn workspace caching for ultra-fast run times.
2. **Standard Quality Commands:**
   - `yarn lint` – Enforces styling standards across all packages.
   - `yarn check-types` – Validates static typing with TSC.
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

### Job 2: Build & Push Images

Once the quality gate is successfully cleared, the pipeline builds containerized packages and stores them securely inside the **GitHub Container Registry (GHCR)**:

1. **GHCR Authentication:** Securely logs in to `ghcr.io` utilizing standard `secrets.GITHUB_TOKEN`.
2. **Multi-Stage Optimizations:** Set up Docker Buildx configuration inside the runner to optimize layering.
3. **API Container:** Pre-compiles the Node.js API server code (`backend/Dockerfile`) and publishes images tagged as:
   - `ghcr.io/<owner>/task-manager-api:latest`
   - `ghcr.io/<owner>/task-manager-api:<git-sha>`
4. **Web Container:** Compiles static Vite assets, bundles them into Nginx (`frontend/Dockerfile`), and publishes it tagged as:
   - `ghcr.io/<owner>/task-manager-web:latest`
   - `ghcr.io/<owner>/task-manager-web:<git-sha>`
   *Note: Set `VITE_API_URL` to blank `""` during construction to enforce relative base endpoint routing through Nginx.*

---

### Job 3: EC2 Deployment

Once images are successfully pushed, the workflow triggers the deploy phase on the target server.

1. **SSH Connection:** Initiated using `appleboy/ssh-action@v1.2.0` via your secure `.pem` private key.
2. **Monorepo Synchronization:** Pulls the latest commits from the `main` branch to update compose files and server directories.
3. **Secrets Injection:** Securely creates host-level environment configuration files:
   - **API `.env`:** Writes `MONGO_URI`, `JWT_SECRET`, and port configurations.
   - **Web `.env`:** Initializes `VITE_API_URL` to reference relative paths.
4. **Image Pulling & Swap:**
   Logs standard EC2 Docker client to GHCR and pulls the newly pre-built container packages:
   ```bash
   docker compose -f docker-compose.prod.yml pull
   docker compose -f docker-compose.prod.yml up -d
   ```
   Restarts the production system with zero downtime, using the pre-compiled images instead of local build compiles.
5. **Disk Hygiene:** Runs `docker image prune -f` to clean up dangling build layer caches to protect host storage space.

---

### Job 4: Pipeline Summary

The workflow ends with a summary job that always runs, regardless of whether the quality gate, container build, or deployment stage succeeds or fails.

1. **Quality results:** Captures the outcome of dependency install, lint, type-check, and test steps.
2. **Build results:** Records compile and push outcomes to GHCR.
3. **Deployment results:** Captures the SSH deploy step and the post-deploy API health check.
4. **Run summary:** Writes a beautiful, detailed markdown table into the GitHub Actions run panel showing the status of each pipeline stage (`$GITHUB_STEP_SUMMARY`).

This makes the pipeline extremely easy to audit because a failed run still ends with a readable status report instead of stopping at the first broken step.

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

If the API fails to register a `200 OK` status after 60 seconds, the deployment step is marked as failed, warning developers of a potentially unstable runtime state. Even in that failure case, the final summary job still runs and records the deploy and health-check result.

---

## 5. Security Group & Firewall Best Practices

Thanks to the integrated Nginx reverse-proxy setup, **you only need to open two ports on your AWS EC2 Instance Security Group**:

1. **Port 22 (SSH):** Restricted to your local administration IP or GitHub Actions.
2. **Port 80 (HTTP):** Open to `0.0.0.0/0` (Anywhere) for standard web traffic.

Internal systems like the database (`27017`) and API (`4000`) are fully sealed and unreachable from the outside world, creating a secure production perimeter.
