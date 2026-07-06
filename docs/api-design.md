# Phase 0.1 — API Design (Entity-Based)

> **Diploma Institute Management System (DIMS)**  
> Document: REST API Endpoint Specification (Entity-Based Architecture)

---

## 1. API Standards

### Base URL
```
Development:  http://localhost:5000/api
Production:   https://api.dims.edu.bd/api
```

### Standard Response Envelope

**Success:**
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": { ... },
  "pagination": { "page": 1, "limit": 20, "total": 324, "totalPages": 17 }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Student not found",
  "errorCode": "NOT_FOUND",
  "errors": []
}
```

### Auth Header
```
Authorization: Bearer <entityAccessToken>
```

### Entity Types in Token
```
entityType: "student" | "teacher" | "accountant" | "admin"
```

---

## 2. Authentication API (`/api/auth`)

### Student Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/student/login` | ❌ Public | Student login |
| POST | `/api/auth/student/refresh` | 🍪 Cookie | Refresh access token |
| POST | `/api/auth/student/logout` | ✅ Student | Logout |
| PUT | `/api/auth/student/change-password` | ✅ Student | Change password |

### Teacher Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/teacher/login` | ❌ Public | Teacher login |
| POST | `/api/auth/teacher/refresh` | 🍪 Cookie | Refresh access token |
| POST | `/api/auth/teacher/logout` | ✅ Teacher | Logout |
| PUT | `/api/auth/teacher/change-password` | ✅ Teacher | Change password |

### Accountant Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/accountant/login` | ❌ Public | Accountant login |
| POST | `/api/auth/accountant/refresh` | 🍪 Cookie | Refresh access token |
| POST | `/api/auth/accountant/logout` | ✅ Accountant | Logout |
| PUT | `/api/auth/accountant/change-password` | ✅ Accountant | Change password |

### Admin Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/admin/login` | ❌ Public | Admin login |
| POST | `/api/auth/admin/refresh` | 🍪 Cookie | Refresh access token |
| POST | `/api/auth/admin/logout` | ✅ Admin | Logout |
| PUT | `/api/auth/admin/change-password` | ✅ Admin | Change password |

---

## 3. Students API (`/api/students`)

| Method | Endpoint | Allowed Entities | Description |
|---|---|---|---|
| POST | `/api/students` | admin | Create student (+ student_auth auto-created) |
| GET | `/api/students` | admin, teacher | List all students (paginated) |
| GET | `/api/students/me` | student | Get own profile |
| GET | `/api/students/:id` | admin, teacher | Get student by ID |
| PUT | `/api/students/:id` | admin | Update student profile |
| PATCH | `/api/students/:id/status` | admin | Change student status |
| DELETE | `/api/students/:id` | admin | Soft-delete student |

**Query Params (GET `/api/students`):**
```
?page=1&limit=20&search=<name>&departmentId=<id>&batchId=<id>&status=active&semester=3
```

---

## 4. Teachers API (`/api/teachers`)

| Method | Endpoint | Allowed Entities | Description |
|---|---|---|---|
| POST | `/api/teachers` | admin | Create teacher (+ teacher_auth auto-created) |
| GET | `/api/teachers` | admin | List all teachers |
| GET | `/api/teachers/me` | teacher | Get own profile |
| GET | `/api/teachers/:id` | admin, teacher | Get teacher by ID |
| PUT | `/api/teachers/:id` | admin | Update teacher profile |
| PATCH | `/api/teachers/:id/status` | admin | Change teacher status |
| POST | `/api/teachers/:id/courses` | admin | Assign courses to teacher |
| DELETE | `/api/teachers/:id/courses/:courseId` | admin | Remove course assignment |

---

## 5. Accountants API (`/api/accountants`)

| Method | Endpoint | Allowed Entities | Description |
|---|---|---|---|
| POST | `/api/accountants` | admin | Create accountant (+ accountant_auth) |
| GET | `/api/accountants` | admin | List all accountants |
| GET | `/api/accountants/me` | accountant | Get own profile |
| GET | `/api/accountants/:id` | admin | Get accountant by ID |
| PUT | `/api/accountants/:id` | admin | Update accountant profile |
| PATCH | `/api/accountants/:id/status` | admin | Change accountant status |

---

## 6. Admins API (`/api/admins`)

| Method | Endpoint | Allowed Entities | Description |
|---|---|---|---|
| POST | `/api/admins` | admin (superAdmin) | Create admin account |
| GET | `/api/admins` | admin (superAdmin) | List all admins |
| GET | `/api/admins/me` | admin | Get own profile |
| PUT | `/api/admins/me` | admin | Update own profile |
| PATCH | `/api/admins/:id/status` | admin (superAdmin) | Activate/deactivate admin |

---

## 7. Departments API (`/api/departments`)

| Method | Endpoint | Allowed Entities | Description |
|---|---|---|---|
| POST | `/api/departments` | admin | Create department |
| GET | `/api/departments` | admin, teacher, student, accountant | List departments |
| GET | `/api/departments/:id` | admin, teacher, student | Get department |
| PUT | `/api/departments/:id` | admin | Update department |
| PATCH | `/api/departments/:id/status` | admin | Activate/deactivate |

---

## 8. Batches API (`/api/batches`)

| Method | Endpoint | Allowed Entities | Description |
|---|---|---|---|
| POST | `/api/batches` | admin | Create batch |
| GET | `/api/batches` | admin, teacher | List batches |
| GET | `/api/batches/:id` | admin, teacher | Get batch |
| PUT | `/api/batches/:id` | admin | Update batch |

**Query Params:** `?departmentId=<id>&session=2024-25`

---

## 9. Courses API (`/api/courses`)

| Method | Endpoint | Allowed Entities | Description |
|---|---|---|---|
| POST | `/api/courses` | admin | Create course |
| GET | `/api/courses` | admin, teacher, student | List courses |
| GET | `/api/courses/:id` | admin, teacher, student | Get course |
| PUT | `/api/courses/:id` | admin | Update course |
| DELETE | `/api/courses/:id` | admin | Delete course |

**Query Params:** `?departmentId=<id>&semester=3&type=theory`

---

## 10. Exams API (`/api/exams`)

| Method | Endpoint | Allowed Entities | Description |
|---|---|---|---|
| POST | `/api/exams` | admin | Create exam definition |
| GET | `/api/exams` | admin, teacher | List exams |
| GET | `/api/exams/:id` | admin, teacher | Get exam |
| PUT | `/api/exams/:id` | admin | Update exam |
| PATCH | `/api/exams/:id/publish` | admin | Publish exam (makes results visible) |
| DELETE | `/api/exams/:id` | admin | Delete exam |

**Query Params:** `?courseId=<id>&departmentId=<id>&semester=3&examType=midterm`

---

## 11. Attendance API (`/api/attendance`)

| Method | Endpoint | Allowed Entities | Description |
|---|---|---|---|
| POST | `/api/attendance` | teacher, admin | Record attendance session (bulk) |
| GET | `/api/attendance` | admin | Get all records (filtered) |
| GET | `/api/attendance/my` | student | Get own attendance records |
| GET | `/api/attendance/course/:courseId` | teacher, admin | Attendance for a course |
| GET | `/api/attendance/student/:studentId` | admin, teacher | Attendance for a student |
| GET | `/api/attendance/summary/:studentId` | admin, teacher, student | % summary per course |
| PUT | `/api/attendance/:id` | teacher, admin | Correct single attendance record |

**POST Request Body:**
```json
{
  "courseId": "<id>",
  "batchId": "<id>",
  "date": "2024-06-15",
  "records": [
    { "studentId": "<id>", "status": "present" },
    { "studentId": "<id>", "status": "absent", "remarks": "Unwell" }
  ]
}
```

**Query Params:** `?startDate=2024-01-01&endDate=2024-06-30&courseId=<id>&batchId=<id>`

---

## 12. Results API (`/api/results`)

| Method | Endpoint | Allowed Entities | Description |
|---|---|---|---|
| POST | `/api/results` | teacher, admin | Enter marks (bulk per exam) |
| GET | `/api/results` | admin | Get all results |
| GET | `/api/results/my` | student | Own published results |
| GET | `/api/results/exam/:examId` | teacher, admin | Results for an exam |
| GET | `/api/results/student/:studentId` | admin, teacher, student | Results for a student |
| PUT | `/api/results/:id` | teacher, admin | Update mark (before publish) |
| DELETE | `/api/results/:id` | admin | Delete result entry |

**POST Request Body:**
```json
{
  "examId": "<id>",
  "marks": [
    { "studentId": "<id>", "marksObtained": 78 },
    { "studentId": "<id>", "marksObtained": 62 }
  ]
}
```

---

## 13. Fees API (`/api/fees`)

| Method | Endpoint | Allowed Entities | Description |
|---|---|---|---|
| POST | `/api/fees` | accountant, admin | Create fee record for student(s) |
| GET | `/api/fees` | accountant, admin | List all fee records |
| GET | `/api/fees/my` | student | Own fee records |
| GET | `/api/fees/student/:studentId` | accountant, admin, student | Fees for a student |
| POST | `/api/fees/:id/payment` | accountant, admin | Record a payment |
| PATCH | `/api/fees/:id/waiver` | admin | Apply waiver/discount |
| GET | `/api/fees/reports/daily` | accountant, admin | Daily collection report |
| GET | `/api/fees/reports/defaulters` | accountant, admin | Students with pending/overdue fees |

**POST Payment Body:**
```json
{
  "amount": 3500,
  "method": "cash",
  "bankRef": null,
  "remarks": "Semester 3 partial payment"
}
```

---

## 14. Notices API (`/api/notices`)

| Method | Endpoint | Allowed Entities | Description |
|---|---|---|---|
| POST | `/api/notices` | admin | Create notice |
| GET | `/api/notices` | all authenticated | Get notices (filtered by entityType) |
| GET | `/api/notices/:id` | all authenticated | Get single notice |
| PUT | `/api/notices/:id` | admin | Update notice |
| PATCH | `/api/notices/:id/status` | admin | Activate/deactivate |
| DELETE | `/api/notices/:id` | admin | Delete notice |

> **Note:** `GET /api/notices` automatically filters by `entityType` from the JWT — students see student-targeted + all notices; teachers see teacher-targeted + all notices.

---

## 15. Admissions API (`/api/admissions`)

| Method | Endpoint | Allowed Entities | Description |
|---|---|---|---|
| POST | `/api/admissions` | ❌ Public | Submit admission application |
| GET | `/api/admissions` | admin | List all applications |
| GET | `/api/admissions/:id` | admin | Get application details |
| PATCH | `/api/admissions/:id/approve` | admin | Approve → auto-create student |
| PATCH | `/api/admissions/:id/reject` | admin | Reject with remarks |

---

## 16. Institute Settings API (`/api/institute`)

| Method | Endpoint | Allowed Entities | Description |
|---|---|---|---|
| GET | `/api/institute` | all authenticated | Get institute info |
| PUT | `/api/institute` | admin | Update institute settings |
| PUT | `/api/institute/grading-scale` | admin | Update grading scale |
| PATCH | `/api/institute/admission-status` | admin | Open/close admissions |

---

## 17. Dashboard API (`/api/dashboard`)

| Method | Endpoint | Allowed Entities | Description |
|---|---|---|---|
| GET | `/api/dashboard/admin` | admin | Admin summary (counts, alerts, activity) |
| GET | `/api/dashboard/teacher` | teacher | Teacher view (courses, today's attendance) |
| GET | `/api/dashboard/student` | student | Student view (attendance %, results, fees) |
| GET | `/api/dashboard/accountant` | accountant | Accountant view (collection, defaults) |

---

## 18. Upload API (`/api/upload`)

| Method | Endpoint | Allowed Entities | Description |
|---|---|---|---|
| POST | `/api/upload/image` | all authenticated | Upload image to Cloudinary |
| POST | `/api/upload/document` | all authenticated | Upload PDF/document to Cloudinary |

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0.1*
