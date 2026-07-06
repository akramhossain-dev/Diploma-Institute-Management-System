# 08 — Folder Structure

> **Diploma Institute Management System (DIMS)**  
> Document Type: Project Folder Architecture

---

## 1. Monorepo Root Structure

```
diploma-institute-management-system/
├── client/                    # Next.js frontend
├── server/                    # Express.js backend
├── docs/                      # Project documentation
├── .gitignore
├── .prettierrc
├── .eslintrc.json
├── README.md
└── package.json               # Root workspace config (optional)
```

---

## 2. Backend (`/server`)

```
server/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   ├── cloudinary.js      # Cloudinary setup
│   │   └── env.js             # Env variable validation
│   │
│   ├── modules/               # Feature-based modular architecture
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.validation.js
│   │   │
│   │   ├── user/
│   │   │   ├── user.routes.js
│   │   │   ├── user.controller.js
│   │   │   ├── user.service.js
│   │   │   ├── user.model.js
│   │   │   └── user.validation.js
│   │   │
│   │   ├── student/
│   │   │   ├── student.routes.js
│   │   │   ├── student.controller.js
│   │   │   ├── student.service.js
│   │   │   ├── student.model.js
│   │   │   └── student.validation.js
│   │   │
│   │   ├── teacher/
│   │   │   ├── teacher.routes.js
│   │   │   ├── teacher.controller.js
│   │   │   ├── teacher.service.js
│   │   │   ├── teacher.model.js
│   │   │   └── teacher.validation.js
│   │   │
│   │   ├── department/
│   │   │   ├── department.routes.js
│   │   │   ├── department.controller.js
│   │   │   ├── department.service.js
│   │   │   ├── department.model.js
│   │   │   └── department.validation.js
│   │   │
│   │   ├── course/
│   │   │   ├── course.routes.js
│   │   │   ├── course.controller.js
│   │   │   ├── course.service.js
│   │   │   ├── course.model.js
│   │   │   └── course.validation.js
│   │   │
│   │   ├── batch/
│   │   │   ├── batch.routes.js
│   │   │   ├── batch.controller.js
│   │   │   ├── batch.service.js
│   │   │   ├── batch.model.js
│   │   │   └── batch.validation.js
│   │   │
│   │   ├── attendance/
│   │   │   ├── attendance.routes.js
│   │   │   ├── attendance.controller.js
│   │   │   ├── attendance.service.js
│   │   │   ├── attendance.model.js
│   │   │   └── attendance.validation.js
│   │   │
│   │   ├── result/
│   │   │   ├── result.routes.js
│   │   │   ├── result.controller.js
│   │   │   ├── result.service.js
│   │   │   ├── result.model.js
│   │   │   └── result.validation.js
│   │   │
│   │   ├── fee/
│   │   │   ├── fee.routes.js
│   │   │   ├── fee.controller.js
│   │   │   ├── fee.service.js
│   │   │   ├── feeStructure.model.js
│   │   │   ├── fee.model.js
│   │   │   └── fee.validation.js
│   │   │
│   │   ├── notice/
│   │   │   ├── notice.routes.js
│   │   │   ├── notice.controller.js
│   │   │   ├── notice.service.js
│   │   │   ├── notice.model.js
│   │   │   └── notice.validation.js
│   │   │
│   │   ├── admission/
│   │   │   ├── admission.routes.js
│   │   │   ├── admission.controller.js
│   │   │   ├── admission.service.js
│   │   │   ├── admission.model.js
│   │   │   └── admission.validation.js
│   │   │
│   │   ├── dashboard/
│   │   │   ├── dashboard.routes.js
│   │   │   ├── dashboard.controller.js
│   │   │   └── dashboard.service.js
│   │   │
│   │   └── upload/
│   │       ├── upload.routes.js
│   │       ├── upload.controller.js
│   │       └── upload.middleware.js
│   │
│   ├── middleware/
│   │   ├── authenticate.js    # JWT token verification
│   │   ├── authorize.js       # RBAC role check factory
│   │   ├── rateLimiter.js     # express-rate-limit config
│   │   ├── errorHandler.js    # Global error handler
│   │   └── notFound.js        # 404 handler
│   │
│   ├── utils/
│   │   ├── ApiError.js        # Custom error class
│   │   ├── ApiResponse.js     # Standard response helper
│   │   ├── asyncHandler.js    # Async try/catch wrapper
│   │   ├── generateToken.js   # JWT generation utils
│   │   ├── gradeCalculator.js # Grade/GPA calculation logic
│   │   ├── generateId.js      # Roll/employee ID generator
│   │   └── sendEmail.js       # Nodemailer wrapper
│   │
│   ├── socket/
│   │   ├── socket.js          # Socket.io setup + auth
│   │   └── socket.events.js   # Event definitions
│   │
│   ├── routes/
│   │   └── index.js           # Root router — mounts all module routes
│   │
│   └── app.js                 # Express app setup (middleware, routes)
│
├── server.js                  # Entry point — HTTP server + DB connect
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 3. Frontend (`/client`)

```
client/
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── images/
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.jsx
│   │   │   └── layout.jsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── layout.jsx            # Shared dashboard layout (sidebar + header)
│   │   │   │
│   │   │   ├── admin/
│   │   │   │   ├── page.jsx          # Admin home
│   │   │   │   ├── students/
│   │   │   │   │   ├── page.jsx      # Student list
│   │   │   │   │   ├── [id]/page.jsx # Student detail
│   │   │   │   │   └── new/page.jsx  # Create student
│   │   │   │   ├── teachers/
│   │   │   │   ├── departments/
│   │   │   │   ├── courses/
│   │   │   │   ├── batches/
│   │   │   │   ├── attendance/
│   │   │   │   ├── results/
│   │   │   │   ├── fees/
│   │   │   │   ├── notices/
│   │   │   │   └── admissions/
│   │   │   │
│   │   │   ├── teacher/
│   │   │   │   ├── page.jsx
│   │   │   │   ├── attendance/
│   │   │   │   └── results/
│   │   │   │
│   │   │   ├── student/
│   │   │   │   ├── page.jsx
│   │   │   │   ├── attendance/
│   │   │   │   ├── results/
│   │   │   │   └── fees/
│   │   │   │
│   │   │   └── accountant/
│   │   │       ├── page.jsx
│   │   │       └── fees/
│   │   │
│   │   ├── (public)/
│   │   │   └── admission/
│   │   │       └── page.jsx          # Public admission form
│   │   │
│   │   ├── layout.jsx                # Root layout (fonts, providers)
│   │   ├── page.jsx                  # Landing/redirect
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx           # Role-aware sidebar
│   │   │   ├── Header.jsx            # Top navigation bar
│   │   │   ├── Footer.jsx
│   │   │   └── PageWrapper.jsx
│   │   │
│   │   ├── common/
│   │   │   ├── DataTable.jsx         # Reusable paginated table
│   │   │   ├── SearchInput.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── AvatarUpload.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── PageHeader.jsx
│   │   │
│   │   ├── students/
│   │   │   ├── StudentForm.jsx
│   │   │   ├── StudentCard.jsx
│   │   │   └── StudentTable.jsx
│   │   │
│   │   ├── attendance/
│   │   │   ├── AttendanceSheet.jsx
│   │   │   └── AttendanceSummary.jsx
│   │   │
│   │   ├── results/
│   │   │   ├── MarkEntryForm.jsx
│   │   │   └── ResultTable.jsx
│   │   │
│   │   ├── fees/
│   │   │   ├── FeeCard.jsx
│   │   │   └── PaymentForm.jsx
│   │   │
│   │   └── dashboard/
│   │       ├── StatCard.jsx
│   │       ├── RecentActivity.jsx
│   │       └── AlertList.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useStudents.js
│   │   ├── useAttendance.js
│   │   ├── useResults.js
│   │   └── useFees.js
│   │
│   ├── context/
│   │   └── AuthContext.jsx           # Global auth state provider
│   │
│   ├── lib/
│   │   ├── axios.js                  # Axios instance + interceptors
│   │   ├── queryClient.js            # TanStack Query client config
│   │   └── utils.js                  # Shared utility functions
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── student.service.js
│   │   ├── teacher.service.js
│   │   ├── attendance.service.js
│   │   ├── result.service.js
│   │   ├── fee.service.js
│   │   ├── notice.service.js
│   │   └── admission.service.js
│   │
│   ├── schemas/
│   │   ├── student.schema.js         # Zod schemas for forms
│   │   ├── teacher.schema.js
│   │   ├── attendance.schema.js
│   │   └── ...
│   │
│   └── constants/
│       ├── roles.js                  # Role constants
│       ├── routes.js                 # Route path constants
│       └── enums.js                  # Shared enum values
│
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

## 4. Documentation (`/docs`)

```
docs/
├── 00-overview.md
├── 01-requirements.md
├── 02-features.md
├── 03-user-roles.md
├── 04-system-architecture.md
├── 05-tech-stack.md
├── 06-database-design.md
├── 07-api-design.md
├── 08-folder-structure.md
├── 09-security-rules.md
├── 10-workflow.md
├── 11-ui-ux-plan.md
├── 12-deployment-plan.md
└── 13-naming-conventions.md
```

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0*
