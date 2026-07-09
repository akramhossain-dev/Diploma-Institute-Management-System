# Development Guide - DIMS

This guide documents the coding style, naming conventions, development guidelines, Git workflow, and procedure for expanding the **Diploma Institute Management System (DIMS)** codebase.

---

## 1. Naming Conventions

### File Naming
- **Backend files:** Use lowercase with dot-separators describing the file type:
  - Modules: `<module-name>.routes.js`, `<module-name>.controller.js`, `<module-name>.service.js`, `<module-name>.model.js`, `<module-name>.validation.js`
  - Middlewares / Configs / Utils: `camelCase` (e.g., `requestLogger.js`, `errorHandler.js`, `db.js`, `apiError.js`).
- **Frontend files:**
  - Routing layout/views (Next.js): Lowercase (e.g., `page.tsx`, `layout.tsx`, `error.tsx`).
  - React components: `PascalCase.tsx` (e.g., `StudentTable.tsx`, `MarkEntryForm.tsx`).
  - Custom React hooks: Starts with `use` (e.g., `useStudents.ts`, `useAuth.ts`).
  - Schemas / Stores / Services: lowercase (e.g., `student.schema.ts`, `authStore.ts`, `axiosInstance.ts`).

### JavaScript & TypeScript Variables
- **Variables & Functions:** `camelCase` (e.g., `studentId`, `getStudentById`, `totalMarks`).
- **Booleans:** Prefix with `is`, `has`, or `can` (e.g., `isActive`, `hasPermission`, `canPublish`).
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `JWT_SECRET`, `MAX_FILE_SIZE`, `DEFAULT_PAGE_SIZE`).
- **Classes / TypeScript Interfaces:** `PascalCase` (e.g., `ApiError`, `StudentProfile`).
- **React Event Handlers:** Prefix with `handle` (e.g., `handleSubmit`, `handleDelete`).

### Database Fields (Mongoose)
- **Collections:** Singular model name in `PascalCase` which Mongoose pluralizes (e.g., model `Student` becomes collection `students`, `FeeStructure` becomes `feestructures`).
- **Fields:** `camelCase` (e.g., `rollNumber`, `registrationNumber`).
- **Date References:** `<action>At` or `<event>Date` (e.g., `createdAt`, `admissionDate`).
- **Relation Fields:** `<referencedModel>Id` (e.g., `departmentId`, `semesterId`).

---

## 2. Coding Standards

### Frontend Development Rules
- **Tailwind CSS v4 & shadcn/ui:** Use utility classes for styling. Headless Radix components from shadcn/ui must be copied into the `components/ui/` directory and customized if needed. Do not inject ad-hoc custom style rules in layouts unless necessary.
- **Client State vs. Server State:**
  - Use **Zustand** only for client UI configurations, user session indicators, and global settings.
  - Use **TanStack Query** for all server-originating data, cache operations, loading indicators, and form submit mutations.
- **Form Handling:** Always implement validation using **Zod schemas** matched to **React Hook Form** resolvers. Display errors inline next to input fields.
- **Responsive Layout:** Test all panel modifications across mobile, tablet, and desktop viewports. Utilize Tailwind's responsive breakpoints (`sm:`, `md:`, `lg:`) to adjust sidebar panels and data grids.

### Backend Development Rules
- **Module Isolation:** Domain modules must be self-contained in separate folders under `src/modules/`. Do not import database models from one module into another. Check entity existence using service helpers and rely on reference IDs passed in headers or payloads.
- **Express Middleware:** Keep routing chains thin. Execute input sanitation and body parsing before reaching controller logic:
  ```
  Request → CORS → Rate Limit → Auth Guard → Validator Middleware → Controller → Service → Database
  ```
- **Error Propagation:** Do not write try/catch blocks within controllers. Wrap endpoints using the `asyncHandler` wrapper utility. Throw exceptions using the `ApiError` constructor, which is automatically parsed and processed by the global error handler middleware.
- **Database Indexing:** Define database indexes inline in your schema files. Compile compound indexes for fields query-filtered in groups:
  ```javascript
  studentSchema.index({ departmentId: 1, semesterId: 1, academicSessionId: 1 });
  ```

---

## 3. Git Workflow

### Branch Naming Conventions
Coordinate branches based on action category and target issue:
- **Production Branch:** `main`
- **Integration Branch:** `dev`
- **Features:** `feature/DIMS-<issue_number>-<slug>` (e.g., `feature/DIMS-24-attendance-taking`)
- **Fixes:** `fix/DIMS-<issue_number>-<slug>` (e.g., `fix/DIMS-89-gpa-rounding`)
- **Documentation:** `docs/<slug>` (e.g., `docs/update-dev-guide`)

### Commit Guidelines (Conventional Commits)
Commits should be formatted as: `<type>(<scope>): <message>`.

| Type | Description |
|---|---|
| `feat` | Adding a new functional feature. |
| `fix` | Correcting a codebase bug. |
| `docs` | Changing markdown documentation files. |
| `refactor` | Restructuring existing code without modifying external behavior. |
| `style` | Layout modifications, formatting, missing semicolons (no logic change). |
| `chore` | Dependency upgrades, environment changes. |

*Example:*
`feat(attendance): add bulk submission route for teachers`

---

## 4. How to Add a New Feature

When creating a new domain entity, follow this checklist:

### Part 1: Backend Implementation
1. **Create Module Folder:** Add a new directory under `backend/src/modules/<feature>`.
2. **Define Database Schema:** Create `<feature>.model.js`. Build fields using `camelCase` and configure necessary mongoose query indexes.
3. **Build Services Layer:** Create `<feature>.service.js` containing MongoDB CRUD calculations and query filters.
4. **Draft Request Validators:** Create `<feature>.validation.js` leveraging `express-validator` rules.
5. **Write Controller:** Create `<feature>.controller.js`. Read validated bodies, trigger service hooks, and return `ApiResponse` envelopes.
6. **Mount Routes:** Create `<feature>.routes.js`. Bind middleware checks (`authenticate`, `authorizeEntity`) and controllers. Import and mount this routes file under the global router index at `backend/src/routes/index.js`.

### Part 2: Frontend Implementation
1. **Design TypeScript Type:** Add interface schemas under `frontend/src/types/<feature>.ts`.
2. **Setup Zod Validations:** Write input forms validation schemas under `frontend/src/app/types/<feature>.schema.ts`.
3. **Build Fetch Hook:** Create a custom hook under `frontend/src/hooks/use<Feature>.ts` calling your backend API endpoints through TanStack Query (`useQuery` / `useMutation`).
4. **Render View Panel:** Add dashboard paths in Next.js under the relevant layout grouping folders `frontend/src/app/(admin)/admin/<feature>/page.tsx`. Use UI elements from `components/ui/` to render dashboards.
