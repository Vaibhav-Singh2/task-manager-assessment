# Engineering Style Guide & Development Standards

This document establishes the official coding standards, architectural rules, and development practices for the Task Manager project. Adherence to these standards guarantees high code maintainability, strict Type Safety, consistent system conventions, and seamless peer collaboration.

---

## 1. Code Quality Philosophy

*   **Readability Over Cleverness:** Write code that clearly describes its intent. Avoid complex single-line operations if simple, descriptive statements improve comprehension.
*   **Separation of Concerns:** Keep classes, functions, and files focused on single responsibilities. Deconstruct large components or routines into small, isolated utilities.
*   **Self-Documenting Code:** Choose clear, descriptive names for classes, functions, variables, and properties. Add inline comments only to explain non-obvious business decisions or performance workarounds.

---

## 2. Language Standards (TypeScript)

Strict type safety is enforced across both frontend and backend codebases.

### Strict Typing Principles
*   **Avoid `any`:** The use of `any` is prohibited. If a type is genuinely unknown, use `unknown` and perform explicit type guarding.
*   **Explicit Returns:** Declare return types on all public functions, custom hooks, and API request actions.
*   **Interface vs. Type:**
    *   Use `interface` to define object structures, schemas, and API request/response bodies.
    *   Use `type` for unions, intersections, and primitive alias models.

```typescript
// ✅ Good: Clear interface contracts
interface ITaskPayload {
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

// ✅ Good: Type alias for unions
type TaskPriority = 'low' | 'medium' | 'high';
```

---

## 3. Naming Conventions

Maintain strict naming consistency to ensure predictable code structure search patterns:

| Symbol Type | Style Case | Example |
| :--- | :--- | :--- |
| **Variables & Objects** | `camelCase` | `taskDetails`, `isSubmitting` |
| **Classes & Components** | `PascalCase` | `TaskCard`, `DashboardLayout` |
| **Custom Hooks** | `camelCase` (Prefix `use`) | `useAuth`, `useTaskFilters` |
| **Constants** | `UPPER_SNAKE_CASE` | `MAX_TASK_LIMIT`, `JWT_EXPIRES_IN` |
| **Database Models** | `PascalCase` | `UserSchema`, `TaskModel` |
| **Folders & Directories** | `kebab-case` | `task-card`, `shared-components` |
| **Source Files** | Matches symbol definition | `TaskCard.tsx`, `authService.ts` |

---

## 4. Frontend Coding Guidelines (React & Tailwind)

### React Component Construction
*   **Functional Structures:** Write functional components using explicit arrow declarations.
*   **Props Structuring:** Destructure props directly at the function signature level. Declare props using explicit types or interfaces.
*   **Component Length:** Keep components under 150 lines. If a UI starts tracking complex nested states, isolate subsets into clean child elements.

```tsx
// ✅ Good: Self-contained, typed component
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const ActionButton: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary' 
}) => {
  const baseStyle = "px-4 py-2 rounded font-medium transition-colors";
  const variantStyle = variant === 'primary' 
    ? "bg-blue-600 text-white hover:bg-blue-700" 
    : "bg-gray-200 text-gray-800 hover:bg-gray-300";

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${variantStyle}`}
    >
      {label}
    </button>
  );
};
```

### State Management Best Practices
*   **Local State:** Use standard React `useState` for local visual toggles (e.g. dropdown state, active tabs).
*   **Global Application State:** Encapsulate core cross-component domain records (e.g. authentications, core task matrices) inside Redux Toolkit (RTK) slices.
*   **Axios Interception:** Do not trigger raw network requests directly within UI lifecycle loops. Always route requests through typed API services that run Axios clients with central interceptors.

---

## 5. Backend Coding Guidelines (Express.js)

The backend follows the Controller-Service-Repository pattern:

```text
[HTTP Request] ──► [Controller] ──► [Service (Business Logic)] ──► [Mongoose Model]
```

### Routing Layer Rules
*   **Minimal Footprint:** Routing files must only register endpoints and apply security or validation middleware. Keep routing definitions free of business logic.
*   **Route Setup Example:**
    ```typescript
    taskRouter.post(
      '/',
      authGuard,
      validateBody(createTaskSchema),
      TaskController.createTask
    );
    ```

### Controller Layer Rules
*   **Thin Controllers:** Controllers only process request parameters, dispatch inputs to corresponding services, and map JSON success responses with correct HTTP status codes.
*   **Async Wrapper:** Wrap controller actions in an async exception handler to ensure that unexpected errors are handled gracefully by the global Express error middleware.

### Service Layer Rules
*   **Encapsulated Logic:** Put all business computations, validation checks, database queries, and third-party integrations inside isolated Services. Services should remain independent of Express request and response objects.

---

## 6. Standard API Contract

To maintain a consistent API across all endpoints, the server must format JSON payloads according to a standardized structure.

### Standard Success Structure (e.g. 200 OK / 201 Created)
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "603d2ba8...",
    "title": "Build API",
    "completed": true
  }
}
```

### Standard Error Structure (e.g. 400 Bad Request / 401 Unauthorized)
```json
{
  "success": false,
  "message": "Resource validation failed",
  "errors": [
    {
      "field": "dueDate",
      "message": "Due date must be in the future"
    }
  ]
}
```

---

## 7. Database Design & Mongoose Practices

*   **Strict Mongoose Schemas:** Define schemas with strict typing, explicit defaults, and active validations.
*   **Virtuals & Transform Map:** Configure schemas to automatically transform `_id` into a clean `id` string and exclude internal password hash lines when serializing records to JSON.

```typescript
const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    dueDate: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);
```

---

## 8. Git Commit & Workflows

### Branch Naming Conventions
Choose prefix categories for all branch names:
*   `feat/` : Adding a new product feature (e.g. `feat/auth-validation`).
*   `fix/` : Resolving an active issue or bug (e.g. `fix/task-sorting`).
*   `refactor/` : Code improvement that does not change external behavior (e.g. `refactor/api-helper`).
*   `test/` : Adding or updating test suites (e.g. `test/task-services`).
*   `chore/` : Tooling or dependency configurations (e.g. `chore/eslint-setup`).

### Semantic Commit Messages (Conventional Commits 1.0.0)
Structure commit messages as `<type>: <description>` using a short imperative statement.

```text
feat: implement dynamic task filtering on the dashboard
fix: resolve password hashing validation error during register
test: add robust integration tests for auth login route
style: update task status badges for WCAG accessibility compliance
```

---

## 9. Testing Standards

*   **Test Isolation:** Keep tests predictable and deterministic. Mock external network calls, database interfaces, and timing triggers using test harnesses (Jest/Vitest).
*   **Arrange-Act-Assert Pattern:** Write tests using a clean, readable layout:
    ```typescript
    test('should calculate correct completion percentage', () => {
      // 1. Arrange
      const tasks = [
        { completed: true },
        { completed: false }
      ];

      // 2. Act
      const percentage = calculateCompletion(tasks);

      // 3. Assert
      expect(percentage).toBe(50);
    });
    ```
