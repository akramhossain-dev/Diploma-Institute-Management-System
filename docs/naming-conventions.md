# 13 — Naming Conventions

> **Diploma Institute Management System (DIMS)**  
> Document Type: Naming Standards & Code Conventions

---

## 1. General Principles

- **Consistency over cleverness** — predictable names reduce cognitive load
- **Descriptive over brief** — `getUserById` not `getUser`
- **Avoid abbreviations** — except well-known ones (`id`, `url`, `api`, `dto`)
- **English only** — all names in English regardless of project language

---

## 2. File Naming Conventions

### 2.1 Backend Files

| File Type | Convention | Example |
|---|---|---|
| Module route | `<module>.routes.js` | `student.routes.js` |
| Module controller | `<module>.controller.js` | `student.controller.js` |
| Module service | `<module>.service.js` | `student.service.js` |
| Module model | `<module>.model.js` | `student.model.js` |
| Module validation | `<module>.validation.js` | `student.validation.js` |
| Utility file | `<purpose>.js` | `asyncHandler.js`, `generateId.js` |
| Config file | `<service>.js` | `db.js`, `cloudinary.js` |
| Middleware | `<purpose>.js` | `authenticate.js`, `authorize.js` |
| Test file | `<module>.test.js` | `student.test.js` |

### 2.2 Frontend Files

| File Type | Convention | Example |
|---|---|---|
| Page component | `page.jsx` (Next.js App Router) | `app/admin/students/page.jsx` |
| Layout | `layout.jsx` | `app/(dashboard)/layout.jsx` |
| React component | `PascalCase.jsx` | `StudentTable.jsx`, `MarkEntryForm.jsx` |
| Custom hook | `use<Purpose>.js` | `useStudents.js`, `useAuth.js` |
| Service file | `<module>.service.js` | `student.service.js` |
| Schema (Zod) | `<module>.schema.js` | `student.schema.js` |
| Context | `<Name>Context.jsx` | `AuthContext.jsx` |
| Constants | `<category>.js` | `roles.js`, `routes.js`, `enums.js` |
| Utility | `<purpose>.js` | `formatDate.js`, `cn.js` |
| CSS | `globals.css` | `globals.css` (single global file) |

---

## 3. JavaScript / Code Conventions

### 3.1 Variables & Functions

| Type | Convention | Example |
|---|---|---|
| Variable | `camelCase` | `studentId`, `totalMarks`, `isActive` |
| Function | `camelCase` verb-noun | `getStudentById`, `calculateGrade`, `sendEmail` |
| Boolean variable | `is/has/can` prefix | `isActive`, `hasPermission`, `canPublish` |
| Constant | `UPPER_SNAKE_CASE` | `JWT_SECRET`, `MAX_FILE_SIZE`, `DEFAULT_PAGE_SIZE` |
| Class | `PascalCase` | `ApiError`, `ApiResponse`, `StudentService` |
| React component | `PascalCase` | `StudentTable`, `AttendanceSheet` |
| Event handler | `handle<Event>` | `handleSubmit`, `handleDelete`, `handlePageChange` |
| Async function | Explicitly async | `async function getStudentById(id)` |

### 3.2 React Hooks

| Convention | Example |
|---|---|
| Custom hook starts with `use` | `useStudents`, `useAttendance`, `useAuth` |
| Returns clearly named values | `{ students, isLoading, error, refetch }` |
| Query hook: `use<Resource>` | `useStudents()`, `useCourses()` |
| Mutation hook: `use<Action><Resource>` | `useCreateStudent()`, `useUpdateFee()` |

---

## 4. API Naming Conventions

### 4.1 URL Structure Rules

```
/api/<resource>                    → collection
/api/<resource>/:id                → single resource
/api/<resource>/:id/<sub-resource> → nested resource
/api/<resource>/:id/<action>       → action on resource
```

| Pattern | Example |
|---|---|
| List resource | `GET /api/students` |
| Get single | `GET /api/students/:id` |
| Create | `POST /api/students` |
| Update (full) | `PUT /api/students/:id` |
| Update (partial) | `PATCH /api/students/:id` |
| Delete | `DELETE /api/students/:id` |
| Nested resource | `GET /api/students/:id/attendance` |
| Action endpoint | `PATCH /api/admissions/:id/approve` |
| Action endpoint | `PATCH /api/results/publish` |
| Me (own data) | `GET /api/students/me` |

### 4.2 URL Rules

- **Lowercase only**, hyphenated for multi-word resources
- **Plural nouns** for resource collections (`/students`, `/fee-structures`)
- **No verbs** in resource URLs (use HTTP method instead)
- **Verbs allowed** only for non-CRUD action endpoints (`/approve`, `/publish`, `/assign`)

**Correct:**
```
GET  /api/fee-structures
POST /api/admissions/:id/approve
GET  /api/attendance/student/:studentId
```

**Incorrect:**
```
GET  /api/getStudents         ← verb in URL
POST /api/student             ← singular
POST /api/approveAdmission    ← verb resource
```

### 4.3 Query Parameter Naming

| Parameter | Convention | Example |
|---|---|---|
| Pagination | `page`, `limit` | `?page=2&limit=20` |
| Search | `search` | `?search=john` |
| Filter by field | `fieldName` | `?departmentId=xxx&status=active` |
| Sort | `sortBy`, `sortOrder` | `?sortBy=createdAt&sortOrder=desc` |
| Date range | `startDate`, `endDate` | `?startDate=2024-01-01&endDate=2024-06-30` |

---

## 5. Database Naming Conventions

### 5.1 Collection Names

- **PascalCase** for Mongoose model names → Mongoose lowercases and pluralizes for collection
- Model name: `Student` → Collection: `students`
- Model name: `FeeStructure` → Collection: `feestructures`

| Model Name | Collection Name |
|---|---|
| `User` | `users` |
| `Student` | `students` |
| `Teacher` | `teachers` |
| `Department` | `departments` |
| `Course` | `courses` |
| `Batch` | `batches` |
| `Attendance` | `attendances` |
| `Result` | `results` |
| `FeeStructure` | `feestructures` |
| `Fee` | `fees` |
| `Notice` | `notices` |
| `Admission` | `admissions` |

### 5.2 Field Names

| Convention | Example |
|---|---|
| All fields: `camelCase` | `studentId`, `rollNumber`, `isPublished` |
| Boolean fields: `is/has` prefix | `isActive`, `isPublished`, `hasGuardian` |
| Date fields: `<event>At` | `createdAt`, `publishedAt`, `reviewedAt` |
| Reference fields: `<model>Id` | `studentId`, `teacherId`, `departmentId` |
| Array of refs: `<model>s` | `courses`, `teachers` |
| Enum fields | `status`, `role`, `audience`, `type` |

### 5.3 Index Naming

Indexes are defined inline in Mongoose schema. Use compound indexes for frequent query combinations:

```javascript
// Single field index
schema.index({ email: 1 }, { unique: true });

// Compound index
schema.index({ studentId: 1, courseId: 1, date: 1 }, { unique: true });

// Text index for search
schema.index({ name: 'text', email: 'text' });
```

---

## 6. Environment Variable Naming

| Convention | Example |
|---|---|
| `UPPER_SNAKE_CASE` | `MONGODB_URI`, `JWT_SECRET` |
| Service prefix for grouped vars | `CLOUDINARY_CLOUD_NAME`, `SMTP_HOST` |
| Frontend public prefix | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` |
| Boolean flags | `ENABLE_RATE_LIMIT=true` |

---

## 7. Git Conventions

### 7.1 Branch Naming

```
main                   → Production branch
staging                → Pre-production
dev                    → Integration branch
feature/<ticket>-<name>  → Feature branches
fix/<ticket>-<name>      → Bug fixes
hotfix/<name>            → Emergency production fixes
docs/<name>              → Documentation changes
```

**Examples:**
```
feature/DIMS-12-student-attendance-module
fix/DIMS-45-fee-calculation-error
hotfix/jwt-refresh-token-bug
docs/update-api-design
```

### 7.2 Commit Messages (Conventional Commits)

Format: `<type>(<scope>): <short description>`

| Type | When to Use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, no logic change |
| `refactor` | Code restructure, no feature/fix |
| `test` | Adding/updating tests |
| `chore` | Build config, dependencies |
| `perf` | Performance improvement |

**Examples:**
```
feat(student): add roll number auto-generation
fix(auth): resolve refresh token expiry edge case
docs(api): add attendance endpoint documentation
refactor(fee): extract payment logic to service layer
chore(deps): upgrade mongoose to v8.1.0
```

---

## 8. Error Code Naming

All API error codes use `UPPER_SNAKE_CASE`:

| Code | HTTP Status |
|---|---|
| `VALIDATION_ERROR` | 400 |
| `INVALID_CREDENTIALS` | 401 |
| `TOKEN_EXPIRED` | 401 |
| `UNAUTHORIZED` | 401 |
| `FORBIDDEN` | 403 |
| `NOT_FOUND` | 404 |
| `DUPLICATE_ENTRY` | 409 |
| `RATE_LIMIT_EXCEEDED` | 429 |
| `INTERNAL_SERVER_ERROR` | 500 |
| `DATABASE_ERROR` | 500 |

---

## 9. Component Props Naming

| Convention | Example |
|---|---|
| Boolean props: no value = true | `<Button disabled />` not `disabled={true}` |
| Event handlers: `on<Event>` | `onClick`, `onChange`, `onSubmit` |
| Data props: descriptive noun | `students`, `totalCount`, `selectedId` |
| Config props: descriptive | `variant`, `size`, `placement` |
| Render prop / children | `children`, `renderHeader` |

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0*
