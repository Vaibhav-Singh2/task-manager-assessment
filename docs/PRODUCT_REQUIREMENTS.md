# Product Requirements Document (PRD)

## Project: Task Manager Web Application

| Metadata | Value |
| :--- | :--- |
| **Version** | 1.0.0 |
| **Author** | Vaibhav Singh |
| **Status** | Production Ready / Core Specification |
| **Date** | May 2026 |
| **Target Build Duration** | 4–6 Hours |

---

## 1. Executive Summary

The Task Manager is a high-performance productivity application engineered to help professionals organize, schedule, and execute tasks. By providing secure user authentication, an interactive task dashboard, priority categorization, and flexible filtering systems, the application addresses the fragmentation of daily notes into a unified, high-integrity dashboard.

---

## 2. Scope of Work (MoSCoW Framework)

To deliver a high-quality product within the target timelines, the feature scope is organized using the MoSCoW prioritization model:

### Must Have (MVP Core)
*   **Secure Authentication:** Secure registration and login workflows with JWT.
*   **Core Task CRUD:** Complete creation, reading, editing, and deletion operations on user-owned tasks.
*   **Dashboard View:** A clean dashboard listing pending and completed tasks.
*   **Priority & Deadlines:** Categorized task urgency (Low, Medium, High) with due date boundaries.
*   **Data Isolation:** Strict security rules preventing users from accessing, modifying, or deleting other users' tasks.

### Should Have
*   **Task Search & Filters:** Text-based search over task titles and descriptions. Status filtering (All / Completed / Pending) and priority grouping.
*   **Form Validation:** Frontend validation of titles, emails, passwords, and date ranges before network dispatch.
*   **System Responsiveness:** 100% fluid mobile, tablet, and desktop layouts.

### Could Have (Bonus Scope)
*   **Subtasks Framework:** Creating structural subtask lists with hierarchical completion percentages.
*   **Task Tagging System:** [COMPLETED] Assigning customizable labels or tags for multi-project grouping.
*   **Production Deployment:** [COMPLETED] Hosting the database (External Mongo URI), API (AWS EC2 / Docker), and client app (AWS EC2 / Nginx Router) with public URLs and fully automated GitHub Actions CI/CD.

---

## 3. User Persona & User Stories

### Target User Persona
*   **Profile:** Freelancers, developers, and students tracking tasks across active domains.
*   **Needs:** High-velocity interface, quick keyboard-friendly task entries, zero cognitive clutter, and clear indicators of task priorities and deadlines.

### Core User Stories

| ID | User Role | Action | Intended Benefit |
| :--- | :--- | :--- | :--- |
| **US-01** | Registered User | Authenticate securely using email and password | Safeguard task checklists and data integrity. |
| **US-02** | Active User | Create a task with a title, priority level, and due date | Explicitly capture an action item before forgetting. |
| **US-03** | Dashboard User | Filter tasks by completion status or priority level | Focus on high-urgency operations without search drag. |
| **US-04** | Active User | Mark a task as completed or edit its priority/details | Dynamically update work status as the task progresses. |
| **US-05** | Organized User | Delete an obsolete or accidentally created task | Maintain a clean dashboard free of legacy items. |

---

## 4. Functional Specifications

### 4.1 Authentication System
*   **User Registration:**
    *   Form requires `name`, a valid `email` (RFC 5322 compliant), and a secure `password` (minimum 8 characters).
    *   Fails gracefully if the email is already registered, returning a clean UI warning.
*   **User Login:**
    *   Validates credentials, generates a cryptographically signed JWT, and returns it to the client.
    *   Fails on incorrect email/password combinations with generic "Invalid credentials" messages to prevent user enumeration.
*   **Session Persistence:**
    *   Stores the JWT token in secure client-side storage (`localStorage` or secure HTTP-Only cookie).
    *   Authenticates subsequent API requests using the standard HTTP Header: `Authorization: Bearer <JWT_TOKEN>`.
*   **Logout Workflow:**
    *   Destroys the token in local client memory and immediately redirects the user to the Login page.

### 4.2 Task Management
*   **Task Constraints:**
    *   `Title`: Must be provided, trimmed of whitespace, maximum 100 characters.
    *   `Description`: Optional text block, maximum 500 characters.
    *   `Priority`: Low, Medium, or High (Defaults to Medium).
    *   `Due Date`: Required, must be validated as a valid date string.
*   **State Management:**
    *   Tasks default to a state of `completed: false` upon creation.
    *   Users can quickly toggle the completion state from the main dashboard interface.

### 4.3 Task Searching & Filtering
*   **Real-time Search:** Filters tasks dynamically in the UI (or via API query parameters) matching terms inside the `title` or `description`.
*   **Status & Priority Filtering:** Users can choose combinations of priority (`low` | `medium` | `high`) and status (`all` | `completed` | `pending`) to query precise task intersections.
*   **Sorting Mechanics:** Default sort order arranges tasks by `dueDate` ascending (soonest first), with options to toggle by creation timestamp.

---

## 5. UI/UX Requirements

*   **Responsive Fluidity:**
    *   **Mobile (< 768px):** Single-column stack with dynamic menu toggles and simplified controls.
    *   **Tablet & Desktop (>= 768px):** Sidebar navigation layout, multi-column task grids (Kanban or highly readable list views), and persistent stats dashboards.
*   **Visual Architecture & Feedback:**
    *   Clear visual distinctness for task urgency (e.g., subtle red indicators for High priority, amber for Medium, and slate/gray for Low).
    *   Clear empty state states featuring action buttons (e.g., "No tasks found. Create one now!") to guide the user.
    *   Visible loading indicators (spinners or skeleton loaders) during network roundtrips.
*   **Accessibility Standards:**
    *   WCAG 2.1 AA compliant color pairings.
    *   Full keyboard accessibility (tab index, enter key activation) on input forms and task action buttons.

---

## 6. Detailed API Specifications

All endpoints communicate strictly via standard `application/json` payloads.

### Authentication Endpoints

#### `POST /api/auth/register`
*   **Description:** Creates a new user document.
*   **Request Body:**
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "password": "strongPassword123"
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "data": {
        "userId": "603d2b2f...",
        "email": "jane@example.com"
      }
    }
    ```

#### `POST /api/auth/login`
*   **Description:** Authenticates user and issues JWT.
*   **Request Body:**
    ```json
    {
      "email": "jane@example.com",
      "password": "strongPassword123"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Authentication successful",
      "token": "eyJhbGciOiJIUzI1Ni...",
      "user": {
        "id": "603d2b2f...",
        "name": "Jane Doe",
        "email": "jane@example.com"
      }
    }
    ```

---

### Task Endpoints (Requires Bearer Token)

#### `GET /api/tasks`
*   **Description:** Returns authenticated user's tasks.
*   **Query Parameters (Optional):** `status` (completed/pending), `priority` (low/medium/high), `search` (string), `tag` (string).
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "603d2b7f...",
          "title": "Build API Endpoints",
          "description": "Develop and document Express endpoints",
          "priority": "high",
          "dueDate": "2026-05-20T00:00:00.000Z",
          "completed": false,
          "tags": ["backend", "api"],
          "createdAt": "2026-05-17T21:00:00.000Z"
        }
      ]
    }
    ```

#### `POST /api/tasks`
*   **Description:** Inserts a new task document.
*   **Request Body:**
    ```json
    {
      "title": "Review PRD",
      "description": "Finalize core technical criteria",
      "priority": "medium",
      "dueDate": "2026-05-19",
      "tags": ["documentation", "planning"]
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Task created successfully",
      "data": {
        "_id": "603d2ba8...",
        "title": "Review PRD",
        "description": "Finalize core technical criteria",
        "priority": "medium",
        "dueDate": "2026-05-19T00:00:00.000Z",
        "completed": false,
        "tags": ["documentation", "planning"],
        "createdAt": "2026-05-17T21:30:00.000Z"
      }
    }
    ```

#### `PUT /api/tasks/:id`
*   **Description:** Modifies properties of a specific task.
*   **Request Body:** (Supports partial updates)
    ```json
    {
      "completed": true,
      "tags": ["documentation", "completed"]
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Task updated successfully",
      "data": {
        "_id": "603d2ba8...",
        "completed": true
      }
    }
    ```

#### `DELETE /api/tasks/:id`
*   **Description:** Permanently drops a user task document.
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Task deleted successfully"
    }
    ```

---

## 7. Quality & Verification Standards

To pass core production criteria, the codebase maintains robust error boundaries and testing setups:

### Error Handling Protocol
*   **Invalid Payloads (400 Bad Request):** Returns clear errors pointing directly to the missing or invalid field.
*   **Protected Resource Protection (401 Unauthorized):** Issued when a JWT token is missing, expired, or carries an invalid signature.
*   **Resource Access Guardrails (403 Forbidden):** Standard response when a authenticated user tries to query, modify, or delete a task belonging to another database user.
*   **Missing Records (404 Not Found):** Returned if the resource ID does not match any valid document.

### Target Test Matrix
*   **Backend Coverage:** Complete integration tests for security routes (`/api/auth/register`, `/api/auth/login`) and rigorous authorization checks over task CRUD operations using Supertest.
*   **Frontend Coverage:** Component rendering and interactive flow tests (mocking API calls) to verify loading states, form fields, and search filtering triggers.
