# Phase F0 — Frontend Architecture Adaptation Layer

> **Diploma Institute Management System (DIMS)**
> Document: Frontend Architecture — Entity-Based Design (Mirrors Backend Phase 0.1)
> Status: Implementation-Ready for Phase F1

---

## PREAMBLE

This document is the **Frontend Architecture Adaptation Layer** for DIMS.

It does NOT redefine system structure or backend design. It **translates** the backend's entity-based architecture (Phase 0.1) into a complete frontend design that frontend developers must follow strictly.

**Core Principle**: The frontend mirrors backend entity separation with zero unified-user concepts. Admin, Student, Teacher, and Accountant are **four entirely independent entities** — each with its own login, session, panel, routing tree, and API consumption layer.

---

## SECTION 1 — ENTITY MAPPING LAYER

### 1.1 Backend-to-Frontend Entity Translation

The backend defines four independent entities. Each maps to a fully isolated frontend panel:

| Backend Entity | Auth Collection | Frontend Panel | Route Prefix | Token Claim |
|---|---|---|---|---|
| `admins` | `admin_auth` | Admin Panel | `/admin/*` | `entityType: "admin"` |
| `students` | `student_auth` | Student Panel | `/student/*` | `entityType: "student"` |
| `teachers` | `teacher_auth` | Teacher Panel | `/teacher/*` | `entityType: "teacher"` |
| `accountants` | `accountant_auth` | Accountant Panel | `/accountant/*` | `entityType: "accountant"` |

### 1.2 Entity Detection from JWT

When a successful login response is received, the frontend reads the JWT payload's `entityType` claim to determine which entity this session belongs to. The JWT structure from the backend is:

```
{
  "sub":        <auth_collection._id>,
  "entityId":   <entity_collection._id>,
  "entityType": "student" | "teacher" | "accountant" | "admin",
  "rollNumber" / "employeeId" / "staffId" / "adminId": <identifier>,
  "isSuperAdmin": boolean   ← admin only
}
```

**Entity detection rules:**
- `entityType === "admin"` → route to `/admin/dashboard`
- `entityType === "student"` → route to `/student/dashboard`
- `entityType === "teacher"` → route to `/teacher/dashboard`
- `entityType === "accountant"` → route to `/accountant/dashboard`
- Any unrecognized or missing `entityType` → destroy session → redirect to `/auth/login`

**Critical rule**: The `entityType` claim from the JWT is the ONLY source of truth for entity detection. There must be no frontend logic that guesses entity type from any other source.

### 1.3 Session Bootstrap Flow

Session bootstrap is the process executed on every app load (e.g., page refresh, tab reopen) before any panel is rendered.

**Bootstrap sequence:**

```
App Load
  │
  ▼
[1] Read access token from in-memory store (entity-specific slice)
  │
  ├── Token NOT present
  │     → Attempt silent refresh via POST /api/auth/{entity}/refresh (cookie-based)
  │     → If refresh succeeds → proceed to Step 2
  │     → If refresh fails → clear entity store → redirect to /auth/login
  │
  ├── Token present but expired (exp < now)
  │     → Attempt silent refresh (same as above)
  │
  └── Token present and valid
        │
        ▼
[2] Extract entityType from token payload
  │
  ▼
[3] Validate entityType against the current URL prefix
  │
  ├── Mismatch (e.g., entityType=student but URL is /admin/*)
  │     → Redirect entity to their correct panel
  │
  └── Match
        │
        ▼
[4] Hydrate entity-specific Zustand store with profile data
  │
  ▼
[5] Render correct panel layout and dashboard
```

### 1.4 API Request Separation per Entity

API requests are separated by entity through **four independent Axios instances**. Each instance:
- Has a dedicated base URL path affinity
- Injects only the token for its own entity
- Reports errors through entity-scoped error handling

There is **no shared Axios instance** used for authenticated requests. An admin's Axios instance never carries a student token, and vice versa.

---

## SECTION 2 — FRONTEND PANEL ISOLATION MODEL

### 2.1 Route Namespace Isolation

Each entity owns an exclusive route namespace. These namespaces are completely isolated — no component, hook, or state from one namespace leaks into another.

```
/public/*        → Public pages (landing, institute info, admission form)
/auth/*          → Entity login pages (selector + per-entity login forms)
/admin/*         → Admin panel (all admin features)
/student/*       → Student panel (all student features)
/teacher/*       → Teacher panel (all teacher features)
/accountant/*    → Accountant panel (all accountant features)
```

### 2.2 No Cross-Panel Access

Cross-panel access is strictly forbidden at every layer:

| Layer | Enforcement |
|---|---|
| Route level | Next.js middleware blocks unauthorized entity from accessing foreign panel URL |
| Component level | Panel layouts render only their entity's components — no imports across panels |
| API level | Each entity's Axios instance only calls its permitted endpoints |
| State level | Zustand stores are entity-scoped — no shared auth state across panels |

**Forbidden pattern (NEVER DO THIS):**
```
// WRONG — admin component imported in student panel
import AdminUserTable from '@/app/(admin)/components/UserTable'
```

**Correct pattern:**
```
// CORRECT — each panel has its own table
import StudentCoursesTable from '@/app/(student)/components/CoursesTable'
```

### 2.3 What is Shared vs. Not Shared

| Category | Shared? | Notes |
|---|---|---|
| UI Components (Button, Input, Modal) | YES | From `/components/ui/*` — no logic, pure presentation |
| Layout primitives (Sidebar shell, Card) | YES | Configurable by panel via props |
| Form validation schemas | NO | Each entity has its own Zod schemas in `/types/{entity}/` |
| Auth hooks (`useStudentAuth`, etc.) | NO | Entity-specific — never mixed |
| API service instances | NO | Four separate instances |
| Zustand stores | NO | Entity-scoped stores |
| React Query keys | NO | Prefixed by entity: `['admin', ...]`, `['student', ...]` |
| Route protection middleware | NO | One middleware function per entity group |

---

## SECTION 3 — API CONSUMPTION ARCHITECTURE

### 3.1 Axios Base Instance Strategy

Four dedicated Axios instances are created, one per entity. All share the same base URL (`NEXT_PUBLIC_API_URL`) but diverge in token injection and error handling.

**Instance naming convention:**
- `adminAxios` — for Admin Panel API calls
- `studentAxios` — for Student Panel API calls
- `teacherAxios` — for Teacher Panel API calls
- `accountantAxios` — for Accountant Panel API calls

**Each instance shares these base properties:**
- `baseURL`: `process.env.NEXT_PUBLIC_API_URL`
- `timeout`: 30,000ms
- `headers.Content-Type`: `application/json`
- `withCredentials: true` — required for httpOnly refresh token cookie

### 3.2 Token Injection Per Entity

Each Axios instance has a **request interceptor** that reads the access token from its corresponding entity Zustand store and injects it into the `Authorization` header:

```
Request Interceptor (adminAxios):
  → Read token from adminAuthStore.accessToken
  → Set header: Authorization: Bearer <token>
  → If no token → proceed without header (protected request will fail at backend with 401)
```

**Critical rule**: Each interceptor reads ONLY from its own entity store. There is never a situation where `studentAxios` reads from `adminAuthStore`.

### 3.3 Refresh Token Interceptor (Per Entity)

Each Axios instance has a **response interceptor** to handle 401 errors:

```
Response Interceptor (e.g., studentAxios):
  1. Catch 401 response
  2. Check if refresh already in-flight (prevent infinite loop)
  3. Call POST /api/auth/student/refresh (cookie carries refresh token)
  4. On success:
       a. Store new access token in studentAuthStore
       b. Retry original request with new token
  5. On failure:
       a. Clear studentAuthStore
       b. Redirect to /auth/student/login
       c. Reject promise
```

### 3.4 Separate API Service Layers

Each panel has a dedicated API service module that groups all API calls for that entity. Services are plain async functions — they do not contain React state logic.

**Service module naming:**
- `/services/admin/` — `adminApi.ts`, `adminStudentsApi.ts`, `adminTeachersApi.ts`, etc.
- `/services/student/` — `studentProfileApi.ts`, `studentAttendanceApi.ts`, etc.
- `/services/teacher/` — `teacherAttendanceApi.ts`, `teacherResultsApi.ts`, etc.
- `/services/accountant/` — `accountantFeesApi.ts`, `accountantReportsApi.ts`, etc.

### 3.5 Error Normalization Strategy

All Axios instances use a shared error normalizer utility that converts backend error responses into a consistent frontend `AppError` object.

**Backend error shape (from Phase 0.1):**
```json
{
  "success": false,
  "message": "Student not found",
  "errorCode": "NOT_FOUND",
  "errors": []
}
```

**Normalized frontend AppError:**
```
{
  message: string,
  errorCode: string,
  statusCode: number,
  fieldErrors: Record<string, string>
}
```

This normalization happens at the service layer — React Query and UI components always receive a clean `AppError` object, never a raw Axios error.

### 3.6 Base URL Management

```
NEXT_PUBLIC_API_URL=https://api.dims.edu.bd/api    ← Production
NEXT_PUBLIC_API_URL=http://localhost:5000/api       ← Development
```

All four Axios instances read from the same environment variable. Separation is achieved through token scoping and service layer structure, not URL differentiation.

---

## SECTION 4 — AUTH FLOW (ENTITY-BASED)

### 4.1 Login Per Entity Type

There is NO single login page. The auth flow presents an entity selector, then routes to entity-specific login forms.

**Auth route structure:**
```
/auth/login              → Entity selector page (choose Admin / Student / Teacher / Accountant)
/auth/admin/login        → Admin login form
/auth/student/login      → Student login form
/auth/teacher/login      → Teacher login form
/auth/accountant/login   → Accountant login form
```

**Each login form:**
- Submits to its dedicated backend endpoint (e.g., `POST /api/auth/student/login`)
- Uses entity-specific Zod validation schema
- On success: stores access token in entity Zustand store → redirects to entity dashboard
- On failure: displays normalized error message — no entity type information leaked

### 4.2 Token Storage Strategy

| Token | Storage Location | Reason |
|---|---|---|
| Access Token | Entity Zustand store (in-memory JS) | Never persisted to localStorage — not accessible to XSS |
| Refresh Token | httpOnly cookie (set by backend) | Not accessible to JavaScript — XSS-proof |
| Entity profile data | Zustand + sessionStorage persist | Fast reload without extra API call |

**Critical rule**: Access tokens must NEVER be stored in `localStorage` or `sessionStorage`.

### 4.3 Route Protection Strategy

**Layer 1: Next.js Middleware** (first line of defense)
- Runs on every request before rendering
- Reads entity indicator cookie (non-httpOnly, set by frontend on login)
- Redirects unauthenticated users to the entity login page

**Layer 2: Panel Layout Guard** (second line of defense)
- Each panel layout component runs a guard hook on mount
- The hook validates in-memory access token and entityType
- If invalid → clears state → redirects to login

**Layer 3: React Query Auth Error Propagation** (third line of defense)
- Global React Query `onError` callback inspects 401 errors
- Triggers entity-specific logout flow if refresh also fails

### 4.4 Unauthorized Handling Flow

```
Unauthorized Event Detected (401 from any entity API)
  │
  ▼
[1] Attempt silent refresh via POST /api/auth/{entity}/refresh
  │
  ├── Refresh success → retry original request → continue normally
  │
  └── Refresh failure
        │
        ▼
[2] Clear entity Zustand store
  │
  ▼
[3] Cancel all in-flight React Query requests for this entity
  │
  ▼
[4] Show toast: "Session expired. Please log in again."
  │
  ▼
[5] Redirect to /auth/{entity}/login
```

**Critical rule**: A student 401 error NEVER triggers admin logout. Each entity's Axios response interceptor handles only its own entity's auth errors.

### 4.5 First Login / Password Change Flow

When an admin creates an account for another entity, the backend returns `requiresPasswordChange: true` on first login. The frontend must:
- Detect this flag in the login response
- Redirect to `/auth/{entity}/change-password` (pre-authenticated route)
- Block access to the main panel until password is changed
- After successful change → backend issues new tokens → bootstrap proceeds normally

---

## SECTION 5 — ROUTE STRATEGY (NEXT.JS APP ROUTER)

### 5.1 Route Group Structure

```
/src/app
  layout.tsx                        ← Root layout (session bootstrap only)

  /(public)/
    layout.tsx                      ← Public layout (no auth)
    page.tsx                        ← Landing page
    /admission/page.tsx             ← Public admission form

  /(auth)/
    layout.tsx                      ← Auth layout (redirect if logged in)
    /login/page.tsx                 ← Entity selector
    /admin/login/page.tsx
    /admin/change-password/page.tsx
    /student/login/page.tsx
    /student/change-password/page.tsx
    /teacher/login/page.tsx
    /teacher/change-password/page.tsx
    /accountant/login/page.tsx
    /accountant/change-password/page.tsx

  /(admin)/
    layout.tsx                      ← Admin panel layout + guard
    /admin/
      /dashboard/page.tsx
      /students/page.tsx
      /students/[id]/page.tsx
      /teachers/page.tsx
      /accountants/page.tsx
      /departments/page.tsx
      /courses/page.tsx
      /batches/page.tsx
      /exams/page.tsx
      /attendance/page.tsx
      /results/page.tsx
      /fees/page.tsx
      /notices/page.tsx
      /admissions/page.tsx
      /institute/page.tsx
      /profile/page.tsx

  /(student)/
    layout.tsx                      ← Student panel layout + guard
    /student/
      /dashboard/page.tsx
      /attendance/page.tsx
      /results/page.tsx
      /fees/page.tsx
      /courses/page.tsx
      /notices/page.tsx
      /profile/page.tsx

  /(teacher)/
    layout.tsx                      ← Teacher panel layout + guard
    /teacher/
      /dashboard/page.tsx
      /attendance/page.tsx
      /attendance/mark/page.tsx
      /results/page.tsx
      /results/enter/page.tsx
      /courses/page.tsx
      /students/page.tsx
      /notices/page.tsx
      /profile/page.tsx

  /(accountant)/
    layout.tsx                      ← Accountant panel layout + guard
    /accountant/
      /dashboard/page.tsx
      /fees/page.tsx
      /fees/[id]/page.tsx
      /fees/payment/page.tsx
      /reports/daily/page.tsx
      /reports/defaulters/page.tsx
      /notices/page.tsx
      /profile/page.tsx
```

### 5.2 Why Route Groups Are Isolated

- Each route group has its own `layout.tsx` containing panel-specific navigation, sidebar, and auth guard
- A student navigating to `/admin/students` is caught by the admin layout guard and redirected
- Route group isolation means separate loading states and error boundaries per panel
- No parent layout is shared between panels — root layout only handles session bootstrap

### 5.3 Middleware Protection

Next.js `middleware.ts` enforces URL-level access control before any rendering occurs.

**Entity indicator cookie**: A non-sensitive, non-httpOnly cookie (e.g., `dims_entity=student`) set by the frontend on login. Middleware reads this to determine routing — it carries no auth value, only entity routing information. Actual auth remains in httpOnly refresh token and in-memory access token.

**Middleware routing rules:**

```
/admin/*      → Requires dims_entity=admin → else redirect /auth/admin/login
/student/*    → Requires dims_entity=student → else redirect /auth/student/login
/teacher/*    → Requires dims_entity=teacher → else redirect /auth/teacher/login
/accountant/* → Requires dims_entity=accountant → else redirect /auth/accountant/login
/auth/*       → If entity already detected → redirect to entity dashboard
```

### 5.4 Redirect Rules Per Entity

| Trigger | Redirect Destination |
|---|---|
| Unauthenticated request to `/admin/*` | `/auth/admin/login` |
| Unauthenticated request to `/student/*` | `/auth/student/login` |
| Unauthenticated request to `/teacher/*` | `/auth/teacher/login` |
| Unauthenticated request to `/accountant/*` | `/auth/accountant/login` |
| Admin visits `/auth/admin/login` while logged in | `/admin/dashboard` |
| Any entity visits another entity's panel | Entity's own dashboard |
| Root `/` for logged-in admin | `/admin/dashboard` |
| Root `/` for unauthenticated user | `/` (public landing page) |

---

## SECTION 6 — STATE MANAGEMENT STRATEGY

### 6.1 State Management Decision Matrix

| State Category | Tool | Reason |
|---|---|---|
| Auth tokens + entity session | Zustand (in-memory) | Fast, synchronous, not persisted to storage |
| Entity profile data | Zustand + sessionStorage persist | Survives re-renders, cleared on tab close |
| Server data (students, fees, etc.) | TanStack Query | Caching, background refetch, deduplication |
| UI-only state (modal, sidebar, theme) | Zustand | Global UI state not tied to server data |
| Form state | React Hook Form (local) | No global state needed |
| URL/filter/pagination state | Next.js `useSearchParams` | Belongs in URL |

### 6.2 Zustand Auth Store Architecture (Four Independent Stores)

```
adminAuthStore:
  - accessToken: string | null
  - profile: AdminProfile | null
  - isSuperAdmin: boolean
  - setSession(token, profile) → void
  - clearSession() → void

studentAuthStore:
  - accessToken: string | null
  - profile: StudentProfile | null
  - setSession(token, profile) → void
  - clearSession() → void

teacherAuthStore:
  - accessToken: string | null
  - profile: TeacherProfile | null
  - setSession(token, profile) → void
  - clearSession() → void

accountantAuthStore:
  - accessToken: string | null
  - profile: AccountantProfile | null
  - setSession(token, profile) → void
  - clearSession() → void
```

**These four stores MUST NEVER be merged or share a common auth slice.**

```
uiStore (global, shared):
  - sidebarOpen: boolean
  - theme: "light" | "dark"
  - toasts: Toast[]
  - toggleSidebar() → void
  - setTheme(theme) → void
  - addToast(toast) → void
  - removeToast(id) → void
```

### 6.3 TanStack Query Configuration

**Query key convention (entity-prefixed to prevent cache collisions):**
```
Admin:       ['admin', 'students', { page, search }]
             ['admin', 'student', studentId]
             ['admin', 'dashboard']

Student:     ['student', 'profile']
             ['student', 'attendance']
             ['student', 'results']
             ['student', 'fees']

Teacher:     ['teacher', 'courses']
             ['teacher', 'attendance', courseId]

Accountant:  ['accountant', 'fees']
             ['accountant', 'reports', 'daily']
```

**Global QueryClient configuration:**
- `staleTime`: 5 minutes
- `cacheTime`: 10 minutes
- `retry`: 1 (not on 401/403)
- `refetchOnWindowFocus`: true

### 6.4 Storage Rules

| Item | Storage | Reason |
|---|---|---|
| Access tokens | NOWHERE persistent | In-memory only — cleared on close |
| User theme preference | `localStorage` | Persists across sessions |
| Entity indicator | Cookie (non-httpOnly) | For middleware routing |
| Sidebar state | `localStorage` | UX preference |
| Entity profile | `sessionStorage` (via Zustand) | Survives re-renders; cleared on tab close |

---

## SECTION 7 — SHARED UI DESIGN SYSTEM

### 7.1 Design System Principle

Shared UI components are **entity-agnostic**. They accept data through props only and contain:
- NO business logic
- NO auth checks
- NO entity-specific API calls
- NO entity-specific imports

**Tech stack**: shadcn/ui + Tailwind CSS

### 7.2 Shared Component Inventory

#### Tables
- `DataTable` — sortable, filterable, paginated; column definitions provided by panel
- `TableSkeleton` — loading state

#### Forms
- `FormField` — labeled input with error display
- `FormSelect` — dropdown with loading/empty states
- `FormTextarea`, `FormDatePicker`, `FormFileUpload`
- Panel provides Zod schema + React Hook Form — shared form components are purely presentational

#### Modals
- `ConfirmModal` — confirmation (delete/approve/reject)
- `FormModal` — slide-over or full-screen modal
- `PreviewModal` — document/image preview

#### Sidebars
- `PanelSidebar` — configurable shell; receives `navItems` array as prop
- `SidebarItem` — nav link with icon, label, badge

#### Dashboard Cards
- `StatCard` — metric with trend indicator
- `AlertCard` — warning/notice
- `ProgressCard` — percentage metric (attendance %)
- `QuickActionCard` — action shortcut

#### Charts
- `BarChart`, `LineChart`, `PieChart` — thin wrappers over Recharts
- `AttendanceHeatmap` — weekly attendance grid

#### Loading States
- `PageSkeleton` — full-page loading state
- `TableSkeleton`, `CardSkeleton`, `InlineSpinner`

#### Error / Empty States
- `ErrorBoundary` — React error boundary per panel
- `ApiErrorAlert` — displays normalized AppError
- `EmptyState` — icon + message + optional action
- `NotFoundPage` — 404 view

#### Status Indicators
- `StatusBadge` — active/inactive/pending/approved/rejected
- `EntityBadge` — admin-only entity type label

### 7.3 The Logic Separation Rule

Shared components:
- ACCEPT: data via props, event callbacks (`onSubmit`, `onDelete`)
- HANDLE: their own visual state (hover, focus, animation)
- DO NOT: call APIs, read auth stores, make routing decisions, contain entity business rules

Business logic lives in: panel page components, panel-level custom hooks, panel-level service functions.

---

## SECTION 8 — FRONTEND DATA FLOW ARCHITECTURE

### 8.1 Complete Data Flow — Login to Render

```
[User: Student clicks Login]
  │
  ▼
[1] LoginForm (React Hook Form + Zod)
    → Validates email + password client-side
    → Calls studentAuthApi.login(email, password)
  │
  ▼
[2] studentAxios
    → POST /api/auth/student/login (no token — public endpoint)
  │
  ▼
[3] Backend response
    → { accessToken, entityType: "student", profile: {...} }
    → httpOnly cookie: refreshToken set by backend
  │
  ▼
[4] Entity Detection
    → Decode JWT → entityType === "student" → confirmed
  │
  ▼
[5] studentAuthStore.setSession(accessToken, profile)
    → Access token in-memory
    → Profile in Zustand (sessionStorage persist)
    → dims_entity=student cookie set
  │
  ▼
[6] Panel Routing
    → router.replace('/student/dashboard')
  │
  ▼
[7] Student Dashboard renders
    → useStudentDashboard() hook
    → React Query: ['student', 'dashboard']
    → studentAxios: GET /api/dashboard/student (token injected by interceptor)
  │
  ▼
[8] React Query cache stores response (staleTime: 5 min)
  │
  ▼
[9] UI renders: StatCards, AttendanceChart, RecentNotices
```

### 8.2 Mutation Data Flow

```
[Teacher submits attendance form]
  │
  ▼
[1] Zod schema validates payload
  │
  ▼
[2] useMutation (TanStack Query)
    → teacherAttendanceApi.markAttendance(payload)
    → teacherAxios: POST /api/attendance
  │
  ▼
[3] On success:
    → queryClient.invalidateQueries(['teacher', 'attendance'])
    → React Query refetches → UI updates
    → Success toast shown
  │
  └── On error:
        → Normalized AppError → ApiErrorAlert in form
```

### 8.3 Caching Strategy

| Data Type | staleTime | Notes |
|---|---|---|
| Dashboard aggregates | 5 min | Background refetch on focus |
| Entity lists (students, fees) | 5 min | Invalidated on mutation |
| Own profile | Infinity | Until logout |
| Institute settings | 15 min | Shared across all panels |
| Notices | 3 min | Short cycle |
| Today's attendance | 1 min | Near real-time |

### 8.4 Invalidation Strategy

| Mutation | Queries Invalidated |
|---|---|
| Admin creates student | `['admin', 'students']`, `['admin', 'dashboard']` |
| Teacher marks attendance | `['teacher', 'attendance', courseId]`, `['student', 'attendance']` |
| Accountant records payment | `['accountant', 'fees']`, `['student', 'fees']` |
| Admin publishes results | `['admin', 'results']`, `['student', 'results']`, `['teacher', 'results']` |
| Admin posts notice | `['admin', 'notices']`, `['student', 'notices']`, `['teacher', 'notices']` |

Cross-entity invalidation is handled through the global `queryClient` instance — not through cross-store communication.

---

## SECTION 9 — FOLDER STRUCTURE

### 9.1 Production-Ready Structure

```
/src
  /app
    layout.tsx                        ← Root layout: session bootstrap only
    /(public)/layout.tsx + pages
    /(auth)/layout.tsx + pages
    /(admin)/layout.tsx
      /admin/dashboard, students, teachers, ...
    /(student)/layout.tsx
      /student/dashboard, attendance, results, fees, ...
    /(teacher)/layout.tsx
      /teacher/dashboard, attendance, results, courses, ...
    /(accountant)/layout.tsx
      /accountant/dashboard, fees, reports, ...

  /components
    /ui/                              ← shadcn/ui base components
    /shared/
      /tables/                        ← DataTable, TableSkeleton
      /forms/                         ← FormField, FormSelect, FormDatePicker
      /modals/                        ← ConfirmModal, FormModal, PreviewModal
      /charts/                        ← BarChart, LineChart, PieChart, Heatmap
      /cards/                         ← StatCard, AlertCard, ProgressCard
      /layout/                        ← PanelSidebar, TopNav, PageHeader
      /feedback/                      ← EmptyState, ErrorBoundary, ApiErrorAlert

  /services
    /admin/
      adminAuthApi.ts
      adminStudentsApi.ts
      adminTeachersApi.ts
      adminAccountantsApi.ts
      adminDepartmentsApi.ts
      adminCoursesApi.ts
      adminFeesApi.ts
      adminExamsApi.ts
      adminAttendanceApi.ts
      adminResultsApi.ts
      adminNoticesApi.ts
      adminAdmissionsApi.ts
      adminInstituteApi.ts
      adminDashboardApi.ts
    /student/
      studentAuthApi.ts
      studentProfileApi.ts
      studentAttendanceApi.ts
      studentResultsApi.ts
      studentFeesApi.ts
      studentCoursesApi.ts
      studentNoticesApi.ts
      studentDashboardApi.ts
    /teacher/
      teacherAuthApi.ts
      teacherProfileApi.ts
      teacherAttendanceApi.ts
      teacherResultsApi.ts
      teacherCoursesApi.ts
      teacherStudentsApi.ts
      teacherNoticesApi.ts
      teacherDashboardApi.ts
    /accountant/
      accountantAuthApi.ts
      accountantProfileApi.ts
      accountantFeesApi.ts
      accountantReportsApi.ts
      accountantNoticesApi.ts
      accountantDashboardApi.ts
    /shared/
      instituteApi.ts
      uploadApi.ts

  /store
    adminAuthStore.ts
    studentAuthStore.ts
    teacherAuthStore.ts
    accountantAuthStore.ts
    uiStore.ts

  /hooks
    /admin/
      useAdminStudents.ts
      useAdminDashboard.ts
      useAdminFees.ts
      useAdminNotices.ts
      (+ one hook file per admin feature)
    /student/
      useStudentProfile.ts
      useStudentAttendance.ts
      useStudentResults.ts
      useStudentFees.ts
    /teacher/
      useTeacherCourses.ts
      useTeacherAttendance.ts
      useTeacherResults.ts
    /accountant/
      useAccountantFees.ts
      useAccountantReports.ts
    /shared/
      useInstitute.ts
      useWindowSize.ts
      useDebounce.ts

  /lib
    adminAxios.ts
    studentAxios.ts
    teacherAxios.ts
    accountantAxios.ts
    queryClient.ts
    normalizeError.ts
    jwtUtils.ts

  /types
    /admin/
      admin.types.ts
      admin.schemas.ts
    /student/
      student.types.ts
      student.schemas.ts
    /teacher/
      teacher.types.ts
      teacher.schemas.ts
    /accountant/
      accountant.types.ts
      accountant.schemas.ts
    /shared/
      api.types.ts                    ← AppError, ApiResponse<T>, PaginatedResponse<T>
      entity.types.ts                 ← EntityType union
      ui.types.ts                     ← Toast, NavItem, TableColumn

  /constants
    routes.constants.ts
    api.constants.ts
    query-keys.constants.ts
    entity.constants.ts

  /utils
    formatters.ts
    validators.ts
    cn.ts
    storage.ts

middleware.ts                         ← Next.js middleware (route protection)
```

### 9.2 Why This Separation Exists

| Directory | Reason |
|---|---|
| `/services` | API calls isolated by entity — impossible to accidentally use wrong token |
| `/store` | Four separate auth stores prevent cross-entity state pollution |
| `/hooks` | Student hooks import only `studentAxios` — TypeScript prevents wrong usage |
| `/lib` | Infrastructure configuration — not business logic |
| `/types` | TypeScript-level entity separation — wrong entity type = compile error |
| `/constants` | All magic strings centralized — prevents typos in route strings |

### 9.3 Adding a New Module (Scaling Rule)

When adding a new module (e.g., "Timetable"):

1. **Types**: Add `timetable.types.ts` + `timetable.schemas.ts` per relevant entity in `/types/{entity}/`
2. **Services**: Add `adminTimetableApi.ts`, `teacherTimetableApi.ts` in `/services/{entity}/`
3. **Hooks**: Add `useAdminTimetable.ts`, `useTeacherTimetable.ts` in `/hooks/{entity}/`
4. **Routes**: Add page files in the relevant route group(s) in `/app/(admin)/admin/timetable/`
5. **Constants**: Add route constants and query key factories

No existing files are modified (except adding nav items to the sidebar). Safe, isolated module addition.

---

## SECTION 10 — ERROR + LOADING STRATEGY

### 10.1 Global Error Boundary Strategy

| Level | Scope | Behavior on Error |
|---|---|---|
| Root `layout.tsx` | Entire application | Full-page crash screen with reload button |
| Panel layout | Entire panel | Panel error with navigation intact |
| Page level | Individual page | Page error with "try again"; sidebar works |
| Component level | Data-heavy components | Inline error; rest of page functions |

### 10.2 API Error Handling Standard

```
400 Validation Error    → Field-level errors on form fields; toast: "Check highlighted fields"
401 Unauthorized        → Silent refresh → on failure: logout → redirect to entity login
403 Forbidden           → Toast: "You don't have permission" — no redirect
404 Not Found           → EmptyState or NotFoundPage depending on context
429 Rate Limited        → Toast: "Too many requests. Please wait." + retry button
500 Server Error        → Toast: "Something went wrong. Please try again."
Network Error           → Toast: "Connection lost." + React Query auto-retry once
```

### 10.3 Loading Skeleton System

| Context | Skeleton |
|---|---|
| Full page initial load | `PageSkeleton` (sidebar + content) |
| Data table loading | `TableSkeleton` (N skeleton rows) |
| Dashboard cards | `CardSkeleton` (grid of card shapes) |
| Profile page | `ProfileSkeleton` (avatar + fields) |
| Button submitting | `InlineSpinner` inside button (disabled) |

**Rule**: There must NEVER be a blank white flash during loading.

### 10.4 Empty State System

Every list view that can return zero results must have an `EmptyState` component with:
- Relevant icon
- Descriptive message (context-specific, not generic "No data")
- Optional action button when the user can create the missing item

| Scenario | Message | Action |
|---|---|---|
| No students found | "No students found. Add the first student." | "Add Student" (admin) |
| No attendance records | "No attendance recorded for this course yet." | "Mark Attendance" (teacher) |
| Results not published | "Results are not yet published for this exam." | — (student) |
| No fee records | "No fee records found for this student." | "Create Fee Record" (accountant) |

---

## SECTION 11 — SECURITY + PROTECTION STRATEGY

### 11.1 Three-Layer Route Protection

```
Layer 1: Next.js Middleware (server-side, before rendering)
  → Reads entity indicator cookie
  → Blocks wrong entity or unauthenticated access before any React code runs

Layer 2: Panel Layout Guard (client-side, on mount)
  → Validates in-memory access token: present, not expired, correct entityType
  → Triggers silent refresh or logout on failure

Layer 3: Backend API Validation (server-side, authoritative)
  → Backend verifies JWT on every protected request
  → Returns 401/403 — interceptor handles it
```

### 11.2 Token Validation Strategy

**Client-side (UI checks — NOT security-authoritative):**
- Check `exp` claim: if expired → trigger refresh proactively
- Check `entityType`: if mismatched → redirect to correct panel
- These prevent unnecessary API calls — they are NOT the security boundary

**Server-side (authoritative):**
- Backend validates signature, expiry, entityType on every request
- Frontend trusts server responses unconditionally

**Critical rule**: The frontend NEVER grants UI access based on client-side JWT decode alone. The backend is the authority.

### 11.3 Session Expiration Handling

| Scenario | Frontend Behavior |
|---|---|
| Access token expired (refresh valid) | Silent refresh → new token → continue |
| Refresh token expired | Clear all session → redirect to entity login |
| Refresh token revoked (remote logout) | Next API call returns 401 → refresh fails → logout |
| Account disabled (isActive: false) | Backend returns 403 → "Account disabled" message → logout |

### 11.4 Unauthorized Redirect Rules

| Situation | Redirect |
|---|---|
| No session on protected route | `/auth/{entity}/login` |
| Expired session (refresh failed) | `/auth/{entity}/login` |
| Wrong entity on panel | `/{correctEntity}/dashboard` |
| Account disabled | `/auth/{entity}/login` + error message |
| First login (password change required) | `/auth/{entity}/change-password` |

### 11.5 Preventing Cross-Entity Access

| Layer | Mechanism |
|---|---|
| State | Four separate Zustand stores — reading wrong store = TypeScript error |
| Axios | Each panel imports only its Axios instance |
| Components | Panel components import from entity-scoped services only |
| URL | Middleware intercepts cross-entity URL before any component renders |
| API | Backend `authorizeEntity` is the final guard — not bypassable |

### 11.6 Additional Security Rules

| Rule | Implementation |
|---|---|
| No sensitive data in URL | No tokens, no emails in query strings |
| XSS prevention | No `dangerouslySetInnerHTML` with user content; Zod validates all input |
| CSRF protection | httpOnly cookies inaccessible to JS; mutations require JWT in header |
| No tokens in logs | Console.log must never print access tokens |
| Environment variables | No secrets in `NEXT_PUBLIC_*` variables |

---

## APPENDIX A — ENTITY PERMISSION MATRIX (Frontend Reference)

Mirrors backend `authorizeEntity()` rules — determines which UI features to render per entity:

| Feature | Admin | Teacher | Student | Accountant |
|---|---|---|---|---|
| Manage students | Full CRUD | View only | — | — |
| Manage teachers | Full CRUD | Self only | — | — |
| Manage accountants | Full CRUD | — | — | Self only |
| Departments | Full CRUD | View | View | View |
| Courses | Full CRUD | View assigned | View enrolled | — |
| Attendance | Full | Mark + View | Own only | — |
| Exams | Full CRUD | View | — | — |
| Results | Full | Enter marks | Own (published) | — |
| Fees | Full + Waiver | — | Own only | Record payment |
| Notices | Full CRUD | Receive | Receive | Receive |
| Admissions | Approve/Reject | — | Public submission | — |
| Institute settings | Full | — | — | — |
| Fee reports | Full | — | — | View |
| Dashboard | Admin stats | Teacher stats | Student stats | Accountant stats |

---

## APPENDIX B — NAMING CONVENTIONS

| Category | Convention | Example |
|---|---|---|
| Zustand stores | `camelCase` + `Store` | `adminAuthStore`, `uiStore` |
| Axios instances | `camelCase` + `Axios` | `adminAxios`, `studentAxios` |
| Service files | `{entity}{Module}Api.ts` | `adminStudentsApi.ts` |
| Hook files | `use{Entity}{Feature}.ts` | `useAdminStudents.ts` |
| Query keys | Array with entity prefix | `['admin', 'students']` |
| Type files | `{entity}.types.ts` | `admin.types.ts` |
| Schema files | `{entity}.schemas.ts` | `student.schemas.ts` |
| Route constants | `ROUTES.{ENTITY}.{PAGE}` | `ROUTES.ADMIN.STUDENTS` |
| API constants | `API.{MODULE}.{ENDPOINT}` | `API.STUDENTS.LIST` |

---

## APPENDIX C — PHASE F1 READINESS CHECKLIST

Implementation is ready to begin when:

- [ ] All four Axios instances created with request + response interceptors
- [ ] All four Zustand auth stores created (no shared auth state)
- [ ] Next.js middleware implemented for all four panel route groups
- [ ] Session bootstrap logic implemented in root layout
- [ ] Entity detection from JWT working correctly
- [ ] Silent refresh flow working for all four entities
- [ ] Route group structure matches Section 5.1
- [ ] Shared UI components have no auth/entity imports
- [ ] QueryClient configured with entity-prefixed query keys
- [ ] Error normalization utility handles all 4xx and 5xx cases
- [ ] Loading skeletons on all data-fetching pages
- [ ] Empty states on all list pages
- [ ] Cross-entity access blocked at middleware level

---

*Document: Phase F0 — Frontend Architecture Adaptation Layer*
*Project: Diploma Institute Management System (DIMS)*
*Mirrors: Backend Phase 0.1 Entity-Based Architecture*
*Status: Implementation-Ready for Phase F1*
*Maintained by: Architecture Team*
