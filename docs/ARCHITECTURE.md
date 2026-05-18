# System Architecture & Technical Design

This document details the architectural design and system topology of the Task Manager full-stack application. Designed as a production-ready system within a modern monorepo structure, this architecture prioritizes strict separation of concerns, scalability, and ease of maintainability.

---

## 1. High-Level System Architecture

The application implements a classic client-server model optimized for high-performance stateless communication. The client layer consumes a secure RESTful API endpoint, which communicates with a persistent data layer.

```text
┌────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                      │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │               React Single Page App            │   │
│   │         (Vite + React Client • Tailwind CSS)   │   │
│   └───────────────────────┬────────────────────────┘   │
└───────────────────────────┼────────────────────────────┘
                            │ HTTPS / JSON REST API
                            ▼
┌────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                  │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │                 Node.js / Express              │   │
│   │    (TypeScript • JWT Auth • Request Validation)│   │
│   └───────────────────────┬────────────────────────┘   │
└───────────────────────────┼────────────────────────────┘
                            │ Mongoose ODM / TCP
                            ▼
┌────────────────────────────────────────────────────────┐
│                       DATA LAYER                       │
│                                                        │
│   ┌────────────────────────────────────────────────┐   │
│   │                    MongoDB                     │   │
│   │          (Task Schema • User Documents)        │   │
│   └────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

---

## 2. Monorepo Organization (Turborepo)

To streamline development and promote reuse of core configurations across frontend and backend boundaries, the repository is managed as a Turborepo monorepo. This allows shared typing and linting parameters to be resolved locally.

```text
task-manager-assessment/
├── apps/
│   ├── web/                     # React Client App (Vite)
│   └── api/                     # Node.js + Express REST API Server
├── packages/
│   ├── eslint-config/           # Shared ESLint configuration
│   └── typescript-config/       # Root & workspace-specific tsconfig bases
├── docs/                        # Project technical documentation
├── package.json                 # Monorepo workspaces & global tasks config
└── turbo.json                   # Cache orchestration & pipeline dependency graph
```

---

## 3. Frontend Architecture

The client side leverages a modular architecture designed to separate styling, UI composition, state tracking, and direct network integration.

### Directory Structure & Segregation
```text
apps/web/
├── src/
│   ├── api/                     # Axios instance & centralized HTTP services
│   ├── components/              # Atomic UI components (Buttons, Inputs, Modals)
│   ├── hooks/                   # Reusable business hooks (useAuth, useTasks)
│   ├── layouts/                 # Screen layouts (DashboardLayout, AuthLayout)
│   ├── pages/                   # Screen views (DashboardPage, TasksPage, etc.)
│   ├── store/                   # Redux Toolkit store (Auth and Task slices)
│   ├── types/                   # Compile-time TypeScript interfaces
│   └── utils/                   # Helper utilities (date formatting, validators)
```

### Core Design Decisions
*   **Centralized API Layer:** Network requests are routed through a configured Axios instance. This instance handles JWT propagation automatically via request interceptors and acts as a central point for error propagation.
*   **State Separation:** UI-specific transient state (e.g., modal visibility, search queries) is encapsulated within local React hooks. Core application state (e.g., current user profile, task collections) is managed via Redux Toolkit to act as a single source of truth.
*   **Accessibility & Semantics:** Pages are built using HTML5 semantic wrappers (`<main>`, `<nav>`, `<article>`) with rigorous WCAG 2.1 AA compliant color contrasts and full screen-reader accessibility.

---

## 4. Backend Layered Architecture

The backend application is structured around a classic layered architecture (Controller-Service-Repository pattern). This architecture separates the transport protocol details (HTTP request/response) from core business rules and direct database manipulation, resulting in a system that is fully unit-testable.

```text
[ HTTP Request ] ────► [ Express Router ] ────► [ Middleware Chain ]
                                                      │ (JWT, Schema Validation)
                                                      ▼
[ Mongoose Document ] ◄── [ Services ] ◄───────── [ Controllers ]
   (Data Models)         (Business Rules)      (Request / Response lifecycle)
```

### Directory Structure & Responsibility
```text
apps/api/
├── src/
│   ├── config/                  # Database connections & environment validation
│   ├── controllers/             # Handles HTTP request/response interfaces
│   ├── middleware/              # JWT verification, logging, global error handler
│   ├── models/                  # Declarative Mongoose schemas
│   ├── routes/                  # Express routes & endpoint mappings
│   ├── services/                # Encapsulated application business logic
│   ├── types/                   # Express request custom typings
│   └── utils/                   # Logging helpers & custom AppErrors
```

### Clean Architecture Components
*   **Express Router:** Translates network paths to specific controllers and runs route-level request validators.
*   **Controllers:** Responsible only for request destructuring, calling the appropriate backend services with explicit inputs, and responding to the client with correct HTTP status codes.
*   **Services:** Contains the heart of the business logic. Completely decoupled from Express `req` and `res` objects to ensure portability and ease of writing isolated unit tests.
*   **Mongoose Models:** Defines schema validation constraints and maps direct data structures.

---

## 5. Security & Auth Architecture

### Authentication Mechanism
Secure, stateless session tracking is established using JSON Web Tokens (JWT).

```text
┌──────────┐                                                   ┌──────────┐
│  Client  │                                                   │  Server  │
└────┬─────┘                                                   └────┬─────┘
     │ 1. POST /api/auth/login (Credentials)                        │
     ├─────────────────────────────────────────────────────────────►│
     │                                                              │
     │ 2. Validate Credentials & Generate JWT Signature            │
     │◄─────────────────────────────────────────────────────────────┤
     │                                                              │
     │ 3. Store JWT in Secure Storage / HTTP-Only Cookie            │
     ├──────────────────────────────────────────────────────────────┤
     │                                                              │
     │ 4. GET /api/tasks (Headers: Bearer <token>)                 │
     ├─────────────────────────────────────────────────────────────►│
     │                                                              │
     │ 5. Middleware Decodes & Authenticates Request                │
     │◄─────────────────────────────────────────────────────────────┤
```

### Key Security Safeguards
*   **Password Cryptography:** User passwords are never saved in plain text. They are salted and hashed using `bcrypt` (10 rounds) before persistence.
*   **JWT Integrity:** Tokens are signed using a server-side secret (`JWT_SECRET`) and carry a short time-to-live (e.g., 24 hours).
*   **Input Sanitization & Schema Validation:** To protect against MongoDB injection and malformed payloads, request bodies are programmatically validated against strict TypeScript/Zod structures inside the middleware chain before reaching the business services.
*   **CORS & Security Headers:** Explicit Cross-Origin Resource Sharing rules are enabled on the backend server, coupled with security headers (via Helmet) to prevent cross-site scripting (XSS) and clickjacking.

---

## 6. Database Schema Design

The persistence layer uses a normalized approach for relational consistency inside MongoDB.

### User Schema (`users`)
```typescript
interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;      // Indexed, unique, normalized lowercase
  password: string;   // Hashed payload
  createdAt: Date;
  updatedAt: Date;
}
```

### Task Schema (`tasks`)
```typescript
interface ITask {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Foreign relation index mapping to User
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  completed: boolean;
  tags: string[];                  // Task labels / categories (Max 10 tags, 30 chars each)
  createdAt: Date;
  updatedAt: Date;
}
```

### Database Performance Optimization
*   **Compounded Indexing:** The `tasks` database collection maintains a compound index on `{ userId: 1, completed: 1 }` and `{ userId: 1, dueDate: 1 }` to optimize high-volume queries generated from the user dashboard.

### 6.3 Task Tag Categorization & Filtering
*   **Search Integration:** The tags array is fully indexed. The Express backend integrates search queries directly onto the `tags` array alongside task title and description utilizing Mongoose regex matching (`{ tags: { $regex: query.search, $options: 'i' } }`).
*   **Deterministic Color Hashing:** Rather than storing static colors, the client implements a premium deterministic HSL color-generating hashing algorithm using the tag name as the seed. This guarantees that a unique, harmonious, glassmorphic pastel badge color config (including custom border, background, and text values) is computed on-the-fly for every tag automatically:
    *   **Background:** `hsla(hash, 50%, 25%, 0.25)`
    *   **Text:** `hsl(hash, 75%, 85%)`
    *   **Border:** `hsla(hash, 50%, 45%, 0.2)`

---

## 7. Scaling & Future Extensions

The layered structure of the codebase easily permits the introduction of advanced architecture models as requirements expand:
*   **Redis Cache Tier:** Easily pluggable in front of task fetch services to cache frequently-read collections.
*   **Event-Driven Workers:** Long-running processes (e.g., email task reminders) can be offloaded to background message queues (BullMQ/RabbitMQ).
*   **Relational Migration:** Layered service boundaries allow a transition from MongoDB to PostgreSQL using an ORM like Prisma or TypeORM without mutating core controller layers.

---

## 8. Production Deployment & Routing Architecture

**Live Application URL:** [http://ec2-13-127-200-200.ap-south-1.compute.amazonaws.com](http://ec2-13-127-200-200.ap-south-1.compute.amazonaws.com)

For production environments (e.g. AWS EC2), the system employs a highly secure and optimized containerized routing topology coordinated via **Docker Compose** and **Nginx**:

```text
               [ Public Internet (Port 80/443) ]
                               │
                               ▼
        ┌──────────────────────────────────────────────┐
        │                 EC2 Instance                 │
        │                                              │
        │   ┌──────────────────────────────────────┐   │
        │   │         Nginx Web Container          │   │
        │   │       (Serves React on Port 80)      │   │
        │   └──────────┬────────────────────┬──────┘   │
        │              │                    │          │
        │              │ (static /)         │ (/api)   │
        │              ▼                    ▼          │
        │   ┌────────────────────┐   ┌─────────────────┐
        │   │   React UI Files   │   │   Express API   │
        │   │   (Static Dist)    │   │   (Port 4000)   │
        │   └────────────────────┘   └──────┬──────────┘
        │                                   │          │
        │                                   ▼          │
        │                        ┌────────────────────┐│
        │                        │ MongoDB Collection ││
        │                        │    (Port 27017)    ││
        │                        └────────────────────┘│
        └──────────────────────────────────────────────┘
```

### Key Deployment Characteristics
*   **Unified Entrypoint Routing:** A single Nginx container listens on standard HTTP Port 80 (and optionally 443 HTTPS). It serves static frontend assets directly and acts as a **Reverse Proxy** routing all `/api/*` traffic to the backend container over internal Docker DNS (`http://api:4000`).
*   **Firewall Isolation:** High-security posture by completely shutting down all public inbound rules on AWS except Port 22 (SSH) and Port 80/443 (HTTP/HTTPS). Ports `4000` (API) and `27017` (MongoDB) are completely shielded inside the internal Docker network.
*   **Zero-Downtime Pipeline:** Fully integrated with GitHub Actions CI/CD workflows, facilitating safe workspace setup, environment variables injection on disk, and isolated Docker network recreation.

