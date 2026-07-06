# Phase F0 — Frontend Architecture Plan
## Diploma Institute Management System

> **Documentation only. No code. Ready for Phase F1 implementation.**

---

## 1. Tech Stack

| Concern | Technology | Rationale |
|---|---|---|
| Framework | Next.js 14+ (App Router) | RSC, layouts, nested routes, streaming |
| Language | TypeScript | Type safety across API types + forms |
| Styling | Tailwind CSS v3 | Utility-first, consistent design tokens |
| Components | Shadcn UI | Accessible, unstyled, copy-owned |
| Server State | TanStack Query v5 | Caching, invalidation, background refetch |
| HTTP Client | Axios | Interceptors for token injection + error normalization |
| Global State | Zustand | Lightweight, UI state only (sidebar, modals) |
| Forms | React Hook Form + Zod | Performance forms, schema-driven validation |
| Icons | Lucide React | Consistent icon set, tree-shakeable |
| Charts | Recharts | Composable, works with React 18 |
| Tables | TanStack Table v8 | Headless, sortable, filterable |
| Date | date-fns | Lightweight, immutable |

---

## 2. Panel Architecture

The system is organized as **5 independent panels**. Each panel has its own layout, navigation, auth context, and route group.

```
Panel A — Public Website      /          (unauthenticated)
Panel B — Admin Panel         /admin/    (admin entity JWT)
Panel C — Student Panel       /student/  (student entity JWT)
Panel D — Teacher Panel       /teacher/  (teacher entity JWT)
Panel E — Accountant Panel    /accountant/ (accountant entity JWT)
```

Each panel is:
- Isolated with its own `layout.tsx`
- Protected by its own entity middleware
- Served its own navigation and dashboard

---

## 3. Folder Structure

```
dims-frontend/
│
├── app/                              # Next.js App Router root
│   │
│   ├── (public)/                     # Group: public website (no auth)
│   │   ├── layout.tsx                # Public navbar + footer
│   │   ├── page.tsx                  # Homepage
│   │   ├── about/page.tsx
│   │   ├── departments/page.tsx
│   │   ├── courses/page.tsx
│   │   ├── notices/page.tsx
│   │   ├── admission/
│   │   │   ├── page.tsx              # Application form
│   │   │   └── status/page.tsx       # Track admission status
│   │   ├── loading.tsx
│   │   └── error.tsx
│   │
│   ├── (auth)/                       # Group: login pages (no panel layout)
│   │   ├── layout.tsx                # Centered card layout
│   │   ├── login/
│   │   │   ├── admin/page.tsx
│   │   │   ├── student/page.tsx
│   │   │   ├── teacher/page.tsx
│   │   │   └── accountant/page.tsx
│   │   └── logout/page.tsx           # Token cleanup + redirect
│   │
│   ├── (admin)/                      # Group: admin panel
│   │   ├── layout.tsx                # AdminLayout (sidebar + topbar)
│   │   ├── admin/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── students/
│   │   │   │   ├── page.tsx          # List
│   │   │   │   └── [id]/page.tsx     # Detail
│   │   │   ├── teachers/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── accountants/page.tsx
│   │   │   ├── departments/page.tsx
│   │   │   ├── semesters/page.tsx
│   │   │   ├── sessions/page.tsx
│   │   │   ├── courses/page.tsx
│   │   │   ├── admissions/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── notices/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── routine/page.tsx
│   │   │   ├── attendance/page.tsx
│   │   │   ├── exams/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── results/page.tsx
│   │   │   ├── fees/page.tsx
│   │   │   ├── payments/page.tsx
│   │   │   ├── reports/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   ├── audit-logs/page.tsx
│   │   │   └── files/page.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   │
│   ├── (student)/                    # Group: student panel
│   │   ├── layout.tsx
│   │   └── student/
│   │       ├── dashboard/page.tsx
│   │       ├── profile/page.tsx
│   │       ├── routine/page.tsx
│   │       ├── attendance/page.tsx
│   │       ├── results/page.tsx
│   │       ├── fees/page.tsx
│   │       ├── notices/page.tsx
│   │       └── notifications/page.tsx
│   │
│   ├── (teacher)/                    # Group: teacher panel
│   │   ├── layout.tsx
│   │   └── teacher/
│   │       ├── dashboard/page.tsx
│   │       ├── profile/page.tsx
│   │       ├── courses/page.tsx
│   │       ├── routine/page.tsx
│   │       ├── attendance/
│   │       │   ├── page.tsx
│   │       │   └── [sessionId]/page.tsx
│   │       ├── marks/page.tsx
│   │       ├── notices/page.tsx
│   │       └── notifications/page.tsx
│   │
│   ├── (accountant)/                 # Group: accountant panel
│   │   ├── layout.tsx
│   │   └── accountant/
│   │       ├── dashboard/page.tsx
│   │       ├── profile/page.tsx
│   │       ├── payments/page.tsx
│   │       ├── fees/page.tsx
│   │       ├── ledger/page.tsx
│   │       ├── notices/page.tsx
│   │       └── notifications/page.tsx
│   │
│   ├── layout.tsx                    # Root layout (fonts, providers, toaster)
│   ├── not-found.tsx
│   └── global-error.tsx
│
├── components/                       # Shared, reusable UI components
│   ├── ui/                           # Shadcn primitives (owned copies)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── Sidebar.tsx               # Generic sidebar shell
│   │   ├── Topbar.tsx
│   │   ├── PublicNavbar.tsx
│   │   └── PublicFooter.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx              # Metric card widget
│   │   ├── StatCardGrid.tsx
│   │   ├── ChartCard.tsx             # Recharts wrapper
│   │   ├── RecentActivityList.tsx
│   │   └── QuickActions.tsx
│   ├── data/
│   │   ├── DataTable.tsx             # TanStack Table wrapper
│   │   ├── DataTableToolbar.tsx      # Filters + search
│   │   ├── DataTablePagination.tsx
│   │   └── ColumnHeader.tsx
│   ├── form/
│   │   ├── FormField.tsx             # RHF + Zod field wrapper
│   │   ├── FormSelect.tsx
│   │   ├── FormDatePicker.tsx
│   │   └── FormFileUpload.tsx
│   ├── feedback/
│   │   ├── PageLoader.tsx            # Full-page skeleton
│   │   ├── TableSkeleton.tsx
│   │   ├── EmptyState.tsx
│   │   └── ErrorState.tsx
│   └── common/
│       ├── Avatar.tsx
│       ├── Badge.tsx
│       ├── ConfirmDialog.tsx
│       └── PageHeader.tsx
│
├── services/                         # API service layer (Axios-based)
│   ├── api/
│   │   ├── axiosInstance.ts          # Base Axios instance + interceptors
│   │   └── queryClient.ts            # TanStack Query global client config
│   ├── auth/
│   │   ├── auth.service.ts           # login/logout per entity
│   │   └── auth.types.ts
│   ├── admin/
│   │   ├── students.service.ts
│   │   ├── teachers.service.ts
│   │   ├── departments.service.ts
│   │   ├── admissions.service.ts
│   │   ├── exams.service.ts
│   │   ├── results.service.ts
│   │   ├── fees.service.ts
│   │   ├── payments.service.ts
│   │   ├── reports.service.ts
│   │   ├── analytics.service.ts
│   │   ├── auditLogs.service.ts
│   │   └── dashboard.service.ts
│   ├── student/
│   │   └── student.me.service.ts
│   ├── teacher/
│   │   └── teacher.me.service.ts
│   ├── accountant/
│   │   └── accountant.me.service.ts
│   ├── shared/
│   │   ├── notices.service.ts
│   │   └── notifications.service.ts
│   └── types/
│       ├── api.types.ts              # Global API response types
│       ├── student.types.ts
│       ├── teacher.types.ts
│       ├── exam.types.ts
│       ├── finance.types.ts
│       └── ...
│
├── store/                            # Zustand stores (UI state only)
│   ├── auth.store.ts                 # Active entity session
│   ├── sidebar.store.ts              # Sidebar open/collapse
│   └── ui.store.ts                   # Global modals, toasts
│
├── hooks/                            # Custom React hooks
│   ├── useAuth.ts                    # Auth store wrapper
│   ├── useCurrentEntity.ts           # Typed entity accessor
│   ├── usePaginatedQuery.ts          # TanStack Query paginated helper
│   ├── useDebounce.ts
│   └── useMediaQuery.ts
│
├── lib/
│   ├── utils.ts                      # cn(), formatDate(), formatCurrency()
│   ├── validations/                  # Zod schemas for all forms
│   │   ├── auth.schema.ts
│   │   ├── student.schema.ts
│   │   ├── exam.schema.ts
│   │   └── ...
│   └── constants/
│       ├── routes.ts                 # Typed route constants
│       ├── queryKeys.ts              # TanStack Query key factory
│       └── entityConfig.ts           # Panel config per entity type
│
├── middleware.ts                     # Next.js Edge Middleware (route protection)
│
├── public/
│   ├── logo.svg
│   └── images/
│
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── .env.local
```

---

## 4. Entity-Based Authentication Architecture

### 4.1 Core Principle

There is **no unified user model**. Each entity type has:
- A separate login endpoint (`POST /api/auth/{entity}/login`)
- A separate JWT token (same structure, different `entityType` claim)
- A separate panel and protected route space

### 4.2 Token Structure (from backend JWT)

```
{
  entityId:   "64abc...",
  entityType: "admin" | "student" | "teacher" | "accountant",
  iat: ...,
  exp: ...
}
```

### 4.3 Token Storage Strategy

| Token | Storage | Rationale |
|---|---|---|
| Access JWT | `httpOnly` cookie (preferred) OR `localStorage` | Interceptors inject automatically |
| Entity type | Zustand `auth.store` (in-memory) | Derived at session bootstrap |
| Entity profile | TanStack Query cache | Fetched via `/api/me/{entity}/profile` |

> If the backend sends tokens via `httpOnly` cookies, Axios must use `withCredentials: true`. If the backend returns tokens in response body, store in `localStorage` keyed as `dims_token_{entityType}`.

### 4.4 Login Flow (per entity)

```
User → Login page (/login/{entity})
  → POST /api/auth/{entity}/login
  → Store token
  → Fetch profile via /api/me/{entity}/profile
  → Populate Zustand auth store
  → Redirect to /{entity}/dashboard
```

### 4.5 Session Bootstrap (on app load)

```
App starts
  → Read stored token
  → Decode token → entityType
  → Fetch /api/me/{entityType}/profile
  → If success → hydrate auth store, allow access
  → If 401 → clear token, redirect to /login/{entityType}
```

### 4.6 Auth Store Shape (Zustand)

```typescript
interface AuthState {
  entityType: "admin" | "student" | "teacher" | "accountant" | null;
  entityId:   string | null;
  token:      string | null;
  isLoaded:   boolean;    // false until bootstrap complete
  setAuth:    (payload) => void;
  clearAuth:  () => void;
}
```

---

## 5. Route Protection Strategy

### 5.1 Next.js Edge Middleware (`middleware.ts`)

The middleware intercepts every request and:
1. Reads the token from cookie or `Authorization` header
2. Decodes `entityType` from the JWT payload (without verification — verification happens at API level)
3. Checks if the requested path matches the entity's panel prefix
4. Redirects mismatched or unauthenticated users

```
Rule table:
  /admin/*      → requires entityType === "admin"     else → /login/admin
  /student/*    → requires entityType === "student"   else → /login/student
  /teacher/*    → requires entityType === "teacher"   else → /login/teacher
  /accountant/* → requires entityType === "accountant" else → /login/accountant
  /login/*      → if already authenticated → redirect to /{entityType}/dashboard
```

### 5.2 Server Component Guard (Layout-level)

Each panel's `layout.tsx` includes a server-side auth check that:
- Verifies token is present
- Confirms entity type matches panel
- Returns `<Unauthorized />` or redirects if mismatch

### 5.3 Session Expiration

- Axios response interceptor catches `401` responses
- Clears auth store + token
- Redirects to correct `/login/{entityType}` page
- Shows toast: "Session expired. Please log in again."

---

## 6. API Integration Strategy

### 6.1 Axios Instance (`services/api/axiosInstance.ts`)

- `baseURL`: `process.env.NEXT_PUBLIC_API_URL`
- Request interceptor: inject `Authorization: Bearer {token}` from store
- Response interceptor: normalize error format + handle 401 logout
- `withCredentials: true` if using cookies

### 6.2 Error Normalization

Backend always returns:
```json
{ "success": false, "message": "...", "errorCode": "..." }
```

Axios interceptor converts this to a typed `ApiError` thrown to TanStack Query, which surfaces it in `error.message`.

### 6.3 Service Layer Pattern

Each service file exports:
- One function per API endpoint
- Typed request/response using `services/types/`
- No business logic — only HTTP calls

```
Example: services/admin/students.service.ts
  → getStudents(params): Promise<PaginatedResponse<Student>>
  → getStudentById(id): Promise<Student>
  → createStudent(data): Promise<Student>
  → updateStudent(id, data): Promise<Student>
```

---

## 7. Data Fetching Strategy (TanStack Query)

### 7.1 Query Key Factory (`lib/constants/queryKeys.ts`)

All query keys are centralized using factory functions to enable precise invalidation:

```
queryKeys.students.list(filters)     → ["students", "list", filters]
queryKeys.students.detail(id)        → ["students", "detail", id]
queryKeys.dashboard.admin()          → ["dashboard", "admin"]
queryKeys.me.profile("student")      → ["me", "student", "profile"]
queryKeys.payments.list(filters)     → ["payments", "list", filters]
```

### 7.2 Usage Rules

| Scenario | Hook |
|---|---|
| Read list data | `useQuery` |
| Read single item | `useQuery` |
| Create / Update / Delete | `useMutation` |
| Paginated data | `useInfiniteQuery` OR standard `useQuery` with page param |
| Background refetch | Enabled for dashboards (staleTime: 30s) |
| Static data (dept list) | Long staleTime (5min) |

### 7.3 Mutation + Invalidation Pattern

After every mutation that changes a list (create/update/delete):
- `queryClient.invalidateQueries({ queryKey: queryKeys.entity.list() })`
- If detail view affected: `queryClient.invalidateQueries({ queryKey: queryKeys.entity.detail(id) })`

### 7.4 Stale Time Recommendations

| Data type | `staleTime` |
|---|---|
| Dashboard stats | 30 seconds |
| Lists (students, teachers) | 60 seconds |
| Reference data (departments, semesters) | 5 minutes |
| Profile (me/) | 5 minutes |
| Notifications unread count | 15 seconds |

### 7.5 Optimistic Updates

Apply optimistic updates only for:
- Marking notifications as read
- Sidebar toggle state (UI, not server)

All financial and academic mutations use pessimistic updates (wait for server confirmation).

---

## 8. State Management Strategy

| State Category | Tool | Examples |
|---|---|---|
| Server data | TanStack Query | Student lists, exam results, payments |
| Auth session | Zustand `auth.store` | entityType, entityId, token |
| Sidebar state | Zustand `sidebar.store` | isOpen, collapsed sections |
| Modal state | Zustand `ui.store` | activeModal, modalProps |
| Form state | React Hook Form | All form inputs (local) |
| URL-driven state | Next.js `useSearchParams` | Filters, pagination, tab selection |

> **Rule:** Never put server data in Zustand. Never put UI state in TanStack Query.

---

## 9. Navigation System

### 9.1 Sidebar Architecture

Each panel has a dedicated `Sidebar` configuration object:

```
entityConfig.ts defines per panel:
  - navItems: { label, href, icon, badge? }[]
  - bottomItems: { label, href, icon }[]   (profile, logout)
  - panelLabel: "Admin Panel"
```

### 9.2 Sidebar Behavior

- Collapsible (icon-only mode) on desktop — persisted in Zustand `sidebar.store`
- Drawer mode (overlay) on mobile
- Active route highlighted via `usePathname()`
- Badge support for unread notifications count

### 9.3 Admin Sidebar Sections

```
Institute
  Dashboard, Students, Teachers, Accountants

Academic
  Departments, Semesters, Sessions, Courses

Operations
  Admissions, Notices, Routine, Attendance

Examination
  Exams, Results, Marks

Finance
  Fee Structures, Billing, Payments

System
  Reports, Analytics, Settings, Audit Logs, Files
```

---

## 10. Dashboard System Design

### 10.1 Admin Dashboard

**Stat Cards (top row):**
- Total Students, Active Teachers, Pending Admissions, Today's Collection

**Charts (middle):**
- Student count by department (Bar chart)
- Monthly payment collection trend (Line chart)
- Attendance % overview (Gauge or Radial chart)

**Tables/Lists (bottom):**
- Recent Payments (last 5)
- Recent Admissions (last 5)
- Active Exams

**Quick Actions:**
- Create Notice, Approve Admissions, Bulk Assign Fees, Generate Results

---

### 10.2 Student Dashboard

**Stat Cards:**
- Attendance %, Pending Fees, Results Published, Upcoming Exams

**Lists:**
- Today's Class Routine
- Recent Notices
- Recent Results (last exam)
- Outstanding Fee Assignments

**Quick Links:**
- View Full Routine, Download Results, Pay Fees (link to portal)

---

### 10.3 Teacher Dashboard

**Stat Cards:**
- Assigned Courses, Sessions Marked Today, Pending Mark Entry, Upcoming Exams

**Lists:**
- Today's Classes (from routine)
- Recent Attendance Sessions
- Exam Responsibilities

**Quick Actions:**
- Mark Attendance, Enter Marks

---

### 10.4 Accountant Dashboard

**Stat Cards:**
- Today's Collections, Total Due, Payments This Month, Pending Assignments

**Charts:**
- Collection by payment method (Pie chart)
- Daily collections this month (Bar chart)

**Lists:**
- Recent Payments (own collections)
- High-Due Students

---

## 11. UI Component System

### 11.1 DataTable System

Every list view uses `DataTable.tsx` which wraps TanStack Table:
- Column definitions typed per entity
- Server-side pagination (page, limit from URL params)
- Search field → debounced query param
- Filter dropdowns → query params
- Sort → query params (passed to API)
- Loading state → `TableSkeleton` rows
- Empty state → `EmptyState` component

### 11.2 Form System

All forms use React Hook Form + Zod:
- Schema defined in `lib/validations/{entity}.schema.ts`
- `FormField` wrapper handles label + error display
- Async validation (e.g. check duplicate email) via `refine`
- Submit via `useMutation` with error mapping to toast

### 11.3 Modal / Dialog System

- Shadcn `Dialog` as the base
- `ConfirmDialog` for delete/cancel confirmations
- Form modals for create/edit flows
- `ui.store` holds `{ activeModal: string | null, modalProps: any }`
- Components subscribe to specific modal names

### 11.4 Toast System

- Shadcn `Sonner` (or `useToast`)
- Triggered from mutation `onSuccess` / `onError`
- Standard messages:
  - Success: green + action description
  - Error: red + `error.message` from API
  - Info: neutral + informational text

### 11.5 Loading States

| Context | Component |
|---|---|
| Page navigation | Next.js `loading.tsx` → `PageLoader` skeleton |
| Table data | `TableSkeleton` (5 placeholder rows) |
| Stat cards | `StatCardSkeleton` (pulse animation) |
| Form submit | Button disabled + spinner |
| Full page | `PageLoader` centered spinner |

### 11.6 Empty States

`EmptyState.tsx` accepts:
- `icon`: Lucide icon
- `title`: "No students found"
- `description`: "Try adjusting your filters"
- `action?`: optional CTA button

---

## 12. Error Handling Strategy

### 12.1 Levels

| Level | Handler | Behavior |
|---|---|---|
| API 4xx (validation) | Axios interceptor → toast | Show field errors or toast |
| API 401 | Axios interceptor → clear auth | Redirect to login |
| API 5xx | TanStack Query `onError` → toast | "Something went wrong" |
| React render error | `error.tsx` boundary | Fallback UI per route segment |
| Global crash | `global-error.tsx` | Full page error fallback |

### 12.2 API Error Display

- Field-level: `error.message` mapped to RHF `setError(fieldName)`
- General: toast with `error.message` from API `message` field
- Network timeout: toast "Connection error. Please check your internet."

---

## 13. Route Map Summary

```
PUBLIC
  /                           Homepage
  /about                      About institute
  /departments                Department listing
  /courses                    Course catalog
  /notices                    Public notice board
  /admission                  Application form
  /admission/status           Track application

AUTH
  /login/admin
  /login/student
  /login/teacher
  /login/accountant
  /logout

ADMIN   (all require admin JWT)
  /admin/dashboard
  /admin/students             /admin/students/[id]
  /admin/teachers             /admin/teachers/[id]
  /admin/accountants
  /admin/departments
  /admin/semesters
  /admin/sessions
  /admin/courses
  /admin/admissions           /admin/admissions/[id]
  /admin/notices              /admin/notices/[id]
  /admin/routine
  /admin/attendance
  /admin/exams                /admin/exams/[id]
  /admin/results
  /admin/fees
  /admin/payments
  /admin/reports
  /admin/analytics
  /admin/settings
  /admin/audit-logs
  /admin/files

STUDENT   (require student JWT)
  /student/dashboard
  /student/profile
  /student/routine
  /student/attendance
  /student/results
  /student/fees
  /student/notices
  /student/notifications

TEACHER   (require teacher JWT)
  /teacher/dashboard
  /teacher/profile
  /teacher/courses
  /teacher/routine
  /teacher/attendance
  /teacher/attendance/[sessionId]
  /teacher/marks
  /teacher/notices
  /teacher/notifications

ACCOUNTANT   (require accountant JWT)
  /accountant/dashboard
  /accountant/profile
  /accountant/payments
  /accountant/fees
  /accountant/ledger
  /accountant/notices
  /accountant/notifications
```

---

## 14. Type System Conventions

- All API response types in `services/types/`
- Paginated response: `PaginatedResponse<T>` generic
- API errors: `ApiError { message, errorCode, statusCode }`
- Each entity has its own type file (`student.types.ts`, `exam.types.ts`, etc.)
- Form schemas and types co-located in `lib/validations/`
- No `any` — use `unknown` + type guards for dynamic data

---

## 15. Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=DIMS
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 16. Phase F1 Implementation Priority

| Priority | Module |
|---|---|
| 1 | Root layout, providers, Axios instance, auth store |
| 2 | Login pages (all 4 entities) |
| 3 | Admin panel layout + sidebar |
| 4 | Admin dashboard page |
| 5 | Student/Teacher/Accountant layouts |
| 6 | Entity dashboards |
| 7 | Admin CRUD pages (students, teachers, departments) |
| 8 | Academic modules (exams, results, attendance) |
| 9 | Finance modules (fees, payments, ledger) |
| 10 | Reports, analytics, notifications, audit logs |
| 11 | Public website pages |
| 12 | Polish: loading states, empty states, error boundaries |

---

> **Ready for Phase F1 — Begin implementation with root layout, provider setup, and auth store.**
