# Phase 0.1 — Backend Module Structure

> **Diploma Institute Management System (DIMS)**  
> Document: Modular Backend Folder Architecture

---

## 1. Architecture Philosophy

The backend follows a **feature-module architecture** where each domain entity is an isolated, self-contained module. Modules do not import from each other's internal files — they only reference external IDs.

```
Principle: One module per entity.
           One folder per module.
           Four files per module (minimum).
```

---

## 2. Full Backend Folder Structure

```
server/
├── src/
│   ├── config/
│   │   ├── db.js                        # MongoDB connection setup
│   │   ├── cloudinary.js                # Cloudinary client config
│   │   └── env.js                       # Env variable validation + export
│   │
│   ├── middleware/
│   │   ├── authenticate.js              # JWT verify → attach req.entityId, req.entityType
│   │   ├── authorizeEntity.js           # Entity-type guard factory
│   │   ├── authorizeOwner.js            # Self-access ownership check
│   │   ├── rateLimiter.js               # express-rate-limit configurations
│   │   ├── errorHandler.js              # Global Express error handler
│   │   └── notFound.js                  # 404 catch-all handler
│   │
│   ├── utils/
│   │   ├── ApiError.js                  # Custom error class (message, statusCode, errorCode)
│   │   ├── ApiResponse.js               # Standardized success response builder
│   │   ├── asyncHandler.js              # Async route handler wrapper (eliminates try/catch)
│   │   ├── generateEntityId.js          # Auto-generate studentId, employeeId, etc.
│   │   ├── generateToken.js             # JWT access + refresh token generation
│   │   ├── gradeCalculator.js           # Grade + GPA computation from marks + grading scale
│   │   ├── sendEmail.js                 # Nodemailer wrapper for transactional emails
│   │   └── pagination.js               # Reusable pagination helper
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/                        # Entity-based auth handlers
│   │   │   ├── student/
│   │   │   │   ├── studentAuth.routes.js
│   │   │   │   ├── studentAuth.controller.js
│   │   │   │   ├── studentAuth.service.js
│   │   │   │   └── studentAuth.model.js    # student_auth collection
│   │   │   │
│   │   │   ├── teacher/
│   │   │   │   ├── teacherAuth.routes.js
│   │   │   │   ├── teacherAuth.controller.js
│   │   │   │   ├── teacherAuth.service.js
│   │   │   │   └── teacherAuth.model.js    # teacher_auth collection
│   │   │   │
│   │   │   ├── accountant/
│   │   │   │   ├── accountantAuth.routes.js
│   │   │   │   ├── accountantAuth.controller.js
│   │   │   │   ├── accountantAuth.service.js
│   │   │   │   └── accountantAuth.model.js # accountant_auth collection
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── adminAuth.routes.js
│   │   │       ├── adminAuth.controller.js
│   │   │       ├── adminAuth.service.js
│   │   │       └── adminAuth.model.js      # admin_auth collection
│   │   │
│   │   ├── students/
│   │   │   ├── student.routes.js
│   │   │   ├── student.controller.js
│   │   │   ├── student.service.js
│   │   │   └── student.model.js            # students collection
│   │   │
│   │   ├── teachers/
│   │   │   ├── teacher.routes.js
│   │   │   ├── teacher.controller.js
│   │   │   ├── teacher.service.js
│   │   │   └── teacher.model.js            # teachers collection
│   │   │
│   │   ├── accountants/
│   │   │   ├── accountant.routes.js
│   │   │   ├── accountant.controller.js
│   │   │   ├── accountant.service.js
│   │   │   └── accountant.model.js         # accountants collection
│   │   │
│   │   ├── admins/
│   │   │   ├── admin.routes.js
│   │   │   ├── admin.controller.js
│   │   │   ├── admin.service.js
│   │   │   └── admin.model.js              # admins collection
│   │   │
│   │   ├── departments/
│   │   │   ├── department.routes.js
│   │   │   ├── department.controller.js
│   │   │   ├── department.service.js
│   │   │   └── department.model.js         # departments collection
│   │   │
│   │   ├── batches/
│   │   │   ├── batch.routes.js
│   │   │   ├── batch.controller.js
│   │   │   ├── batch.service.js
│   │   │   └── batch.model.js              # batches collection
│   │   │
│   │   ├── courses/
│   │   │   ├── course.routes.js
│   │   │   ├── course.controller.js
│   │   │   ├── course.service.js
│   │   │   └── course.model.js             # courses collection
│   │   │
│   │   ├── exams/
│   │   │   ├── exam.routes.js
│   │   │   ├── exam.controller.js
│   │   │   ├── exam.service.js
│   │   │   └── exam.model.js               # exams collection
│   │   │
│   │   ├── attendance/
│   │   │   ├── attendance.routes.js
│   │   │   ├── attendance.controller.js
│   │   │   ├── attendance.service.js
│   │   │   └── attendance.model.js         # attendances collection
│   │   │
│   │   ├── results/
│   │   │   ├── result.routes.js
│   │   │   ├── result.controller.js
│   │   │   ├── result.service.js
│   │   │   └── result.model.js             # results collection
│   │   │
│   │   ├── fees/
│   │   │   ├── fee.routes.js
│   │   │   ├── fee.controller.js
│   │   │   ├── fee.service.js
│   │   │   └── fee.model.js                # fees collection
│   │   │
│   │   ├── notices/
│   │   │   ├── notice.routes.js
│   │   │   ├── notice.controller.js
│   │   │   ├── notice.service.js
│   │   │   └── notice.model.js             # notices collection
│   │   │
│   │   ├── admissions/
│   │   │   ├── admission.routes.js
│   │   │   ├── admission.controller.js
│   │   │   ├── admission.service.js
│   │   │   └── admission.model.js          # admissions collection
│   │   │
│   │   └── institute/
│   │       ├── institute.routes.js
│   │       ├── institute.controller.js
│   │       ├── institute.service.js
│   │       └── institute.model.js          # institute_settings collection
│   │
│   ├── routes/
│   │   └── index.js                        # Root router — mounts all module routes
│   │
│   └── app.js                              # Express app setup + middleware chain
│
├── server.js                               # Entry point — HTTP server + DB connect
├── .env
├── .env.example
├── .gitignore
└── package.json
```

---

## 3. Module Internal Structure

Every module follows the same 4-file pattern:

### 3.1 `<entity>.model.js`
- Defines the Mongoose Schema for the collection
- Declares all fields, types, validators, defaults
- Declares indexes
- Declares any pre-save hooks (e.g., grade calculation on result save)
- Exports the compiled Mongoose Model

### 3.2 `<entity>.service.js`
- Contains all business logic for the module
- Calls the model for DB operations
- Performs cross-entity ID validation by importing models directly (not other services)
- Returns plain JavaScript objects (not Mongoose documents where possible)
- Throws `ApiError` instances for business rule violations

### 3.3 `<entity>.controller.js`
- Parses and validates incoming `req` data
- Calls the service layer
- Sends structured `ApiResponse` via `res`
- Wrapped in `asyncHandler` — no try/catch needed
- Never contains business logic or DB calls directly

### 3.4 `<entity>.routes.js`
- Defines all HTTP routes for this module
- Applies middleware chains: `authenticate → authorizeEntity → controller`
- Imports nothing from other module's internal files
- Exports a single Express Router

---

## 4. Request Lifecycle per Module

```
Incoming HTTP Request
        │
        ▼
app.js  → Global middleware (helmet, cors, morgan, bodyParser)
        │
        ▼
routes/index.js → Matches to module router
        │
        ▼
<entity>.routes.js → Middleware chain:
        │
        ├── [1] authenticate        (verify JWT, attach req.entityType, req.entityId)
        ├── [2] authorizeEntity()   (check entityType is allowed)
        ├── [3] validateRequest()   (express-validator chain — optional inline)
        │
        ▼
<entity>.controller.js
  → Extracts req.body, req.params, req.query, req.entityId
  → Calls <entity>.service.js function
        │
        ▼
<entity>.service.js
  → Applies business rules
  → Calls <entity>.model.js (and other models by direct import for validation)
  → Returns data object
        │
        ▼
<entity>.controller.js
  → Wraps result in ApiResponse
  → Sends res.status(200).json(response)
```

---

## 5. Cross-Module Dependency Rule

### Allowed: Direct model import for ID validation

```
attendance.service.js may import:
  → attendance.model.js     ✅ (owns it)
  → student.model.js        ✅ (to validate studentId exists)
  → teacher.model.js        ✅ (to validate teacherId exists)
  → course.model.js         ✅ (to validate courseId exists)
```

### Forbidden: Cross-service imports

```
attendance.service.js MUST NOT import:
  → student.service.js      ❌ (creates tight coupling)
  → teacher.service.js      ❌ (creates tight coupling)
  → course.service.js       ❌ (creates tight coupling)
```

**Rationale:** Models are stable data contracts. Services contain business logic that can change. Importing a service from another module couples business logic together, creating a tangled dependency graph that is hard to refactor.

---

## 6. Routes Index (`routes/index.js`)

All module routers are mounted here with their base paths:

```
/api/auth/student       → modules/auth/student/studentAuth.routes.js
/api/auth/teacher       → modules/auth/teacher/teacherAuth.routes.js
/api/auth/accountant    → modules/auth/accountant/accountantAuth.routes.js
/api/auth/admin         → modules/auth/admin/adminAuth.routes.js

/api/students           → modules/students/student.routes.js
/api/teachers           → modules/teachers/teacher.routes.js
/api/accountants        → modules/accountants/accountant.routes.js
/api/admins             → modules/admins/admin.routes.js

/api/departments        → modules/departments/department.routes.js
/api/batches            → modules/batches/batch.routes.js
/api/courses            → modules/courses/course.routes.js
/api/exams              → modules/exams/exam.routes.js

/api/attendance         → modules/attendance/attendance.routes.js
/api/results            → modules/results/result.routes.js
/api/fees               → modules/fees/fee.routes.js
/api/notices            → modules/notices/notice.routes.js
/api/admissions         → modules/admissions/admission.routes.js
/api/institute          → modules/institute/institute.routes.js
```

---

## 7. App Bootstrap Sequence (`server.js`)

```
1. Load environment variables (dotenv)
2. Validate required env variables → fail fast if missing
3. Connect to MongoDB Atlas → log success or exit(1) on failure
4. Initialize Express app (app.js)
5. Apply global middleware stack
6. Mount all module routes via routes/index.js
7. Apply 404 handler (notFound middleware)
8. Apply global error handler (errorHandler middleware)
9. Start HTTP server on PORT
10. Log: "DIMS Server running on port XXXX"
```

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0.1*
