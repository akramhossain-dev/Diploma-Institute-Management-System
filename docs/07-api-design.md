# 07 — API Design

> **Diploma Institute Management System (DIMS)**  
> Document Type: REST API Specification

---

## 1. API Standards

### Base URL
```
Development: http://localhost:5000/api
Production:  https://api.dims.edu/api
```

### Response Format

**Success:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errorCode": "VALIDATION_ERROR",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

### HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | OK — GET, PUT success |
| 201 | Created — POST success |
| 204 | No Content — DELETE success |
| 400 | Bad Request — Validation error |
| 401 | Unauthorized — No/invalid token |
| 403 | Forbidden — Insufficient role |
| 404 | Not Found |
| 409 | Conflict — Duplicate entry |
| 429 | Too Many Requests — Rate limit hit |
| 500 | Internal Server Error |

### Authentication Header
```
Authorization: Bearer <accessToken>
```

---

## 2. Auth API (`/api/auth`)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/auth/login` | ❌ | Public | Login with email + password |
| POST | `/api/auth/logout` | ✅ | Any | Logout, clear refresh token |
| POST | `/api/auth/refresh` | ❌ | Public | Refresh access token |
| GET | `/api/auth/me` | ✅ | Any | Get current user profile |
| PUT | `/api/auth/change-password` | ✅ | Any | Change own password |

### POST `/api/auth/login`
**Request:**
```json
{ "email": "admin@dims.edu", "password": "SecurePass123!" }
```
**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "user": { "_id": "...", "name": "Admin", "role": "admin", "email": "admin@dims.edu" }
  }
}
```

---

## 3. User API (`/api/users`)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/users` | ✅ | admin | Create a new user |
| GET | `/api/users` | ✅ | admin | List all users (paginated) |
| GET | `/api/users/:id` | ✅ | admin | Get single user |
| PUT | `/api/users/:id` | ✅ | admin | Update user |
| PATCH | `/api/users/:id/status` | ✅ | admin | Activate/deactivate user |
| DELETE | `/api/users/:id` | ✅ | admin | Delete user |

---

## 4. Student API (`/api/students`)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/students` | ✅ | admin | Create student profile |
| GET | `/api/students` | ✅ | admin, teacher | List all students (paginated) |
| GET | `/api/students/me` | ✅ | student | Get own profile |
| GET | `/api/students/:id` | ✅ | admin, teacher | Get student by ID |
| PUT | `/api/students/:id` | ✅ | admin | Update student profile |
| PATCH | `/api/students/:id/status` | ✅ | admin | Change student status |
| GET | `/api/students/:id/attendance` | ✅ | admin, teacher, student | Get student attendance |
| GET | `/api/students/:id/results` | ✅ | admin, teacher, student | Get student results |
| GET | `/api/students/:id/fees` | ✅ | admin, accountant, student | Get student fees |

### Query Params (GET `/api/students`)
```
?page=1&limit=20&search=john&departmentId=xxx&batchId=xxx&status=active&semester=3
```

---

## 5. Teacher API (`/api/teachers`)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/teachers` | ✅ | admin | Create teacher profile |
| GET | `/api/teachers` | ✅ | admin | List all teachers |
| GET | `/api/teachers/me` | ✅ | teacher | Get own profile |
| GET | `/api/teachers/:id` | ✅ | admin, teacher | Get teacher by ID |
| PUT | `/api/teachers/:id` | ✅ | admin | Update teacher profile |
| PATCH | `/api/teachers/:id/status` | ✅ | admin | Change teacher status |
| POST | `/api/teachers/:id/courses` | ✅ | admin | Assign courses to teacher |

---

## 6. Department API (`/api/departments`)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/departments` | ✅ | admin | Create department |
| GET | `/api/departments` | ✅ | Any | List all departments |
| GET | `/api/departments/:id` | ✅ | Any | Get department by ID |
| PUT | `/api/departments/:id` | ✅ | admin | Update department |
| DELETE | `/api/departments/:id` | ✅ | admin | Delete department |

---

## 7. Course API (`/api/courses`)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/courses` | ✅ | admin | Create course |
| GET | `/api/courses` | ✅ | admin, teacher | List courses |
| GET | `/api/courses/:id` | ✅ | admin, teacher | Get course by ID |
| PUT | `/api/courses/:id` | ✅ | admin | Update course |
| DELETE | `/api/courses/:id` | ✅ | admin | Delete course |

### Query Params
```
?departmentId=xxx&semester=3&type=theory
```

---

## 8. Batch API (`/api/batches`)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/batches` | ✅ | admin | Create batch |
| GET | `/api/batches` | ✅ | admin, teacher | List batches |
| GET | `/api/batches/:id` | ✅ | admin, teacher | Get batch |
| PUT | `/api/batches/:id` | ✅ | admin | Update batch |

---

## 9. Attendance API (`/api/attendance`)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/attendance` | ✅ | admin, teacher | Record attendance session |
| GET | `/api/attendance` | ✅ | admin | Get all attendance records |
| GET | `/api/attendance/course/:courseId` | ✅ | admin, teacher | Attendance by course |
| GET | `/api/attendance/student/:studentId` | ✅ | admin, teacher, student | Attendance by student |
| PUT | `/api/attendance/:id` | ✅ | admin, teacher | Update single attendance record |
| GET | `/api/attendance/summary/:studentId` | ✅ | admin, teacher, student | Attendance percentage per course |

### POST `/api/attendance` Request Body
```json
{
  "courseId": "xxx",
  "date": "2024-06-15",
  "records": [
    { "studentId": "xxx", "status": "present" },
    { "studentId": "yyy", "status": "absent" }
  ]
}
```

---

## 10. Result API (`/api/results`)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/results` | ✅ | admin, teacher | Enter/update marks |
| GET | `/api/results` | ✅ | admin | Get all results |
| GET | `/api/results/student/:studentId` | ✅ | admin, teacher, student | Results for student |
| GET | `/api/results/course/:courseId` | ✅ | admin, teacher | Results for course |
| PUT | `/api/results/:id` | ✅ | admin, teacher | Update marks (before publish) |
| PATCH | `/api/results/publish` | ✅ | admin | Publish results (batch) |
| DELETE | `/api/results/:id` | ✅ | admin | Delete result entry |

---

## 11. Fee API (`/api/fees`)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/fee-structures` | ✅ | admin, accountant | Create fee structure |
| GET | `/api/fee-structures` | ✅ | admin, accountant | List fee structures |
| PUT | `/api/fee-structures/:id` | ✅ | admin, accountant | Update fee structure |
| POST | `/api/fees/assign` | ✅ | admin, accountant | Assign fees to students |
| GET | `/api/fees` | ✅ | admin, accountant | List all fee records |
| GET | `/api/fees/student/:studentId` | ✅ | admin, accountant, student | Get fees for student |
| POST | `/api/fees/:id/payment` | ✅ | admin, accountant | Record a payment |
| GET | `/api/fees/reports/daily` | ✅ | admin, accountant | Daily collection report |

---

## 12. Notice API (`/api/notices`)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/notices` | ✅ | admin | Create notice |
| GET | `/api/notices` | ✅ | Any | Get notices (filtered by role) |
| GET | `/api/notices/:id` | ✅ | Any | Get single notice |
| PUT | `/api/notices/:id` | ✅ | admin | Update notice |
| DELETE | `/api/notices/:id` | ✅ | admin | Delete notice |

---

## 13. Admission API (`/api/admissions`)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/admissions` | ❌ | Public | Submit admission request |
| GET | `/api/admissions` | ✅ | admin | List all applications |
| GET | `/api/admissions/:id` | ✅ | admin | Get single application |
| PATCH | `/api/admissions/:id/approve` | ✅ | admin | Approve application |
| PATCH | `/api/admissions/:id/reject` | ✅ | admin | Reject application |

---

## 14. Dashboard API (`/api/dashboard`)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/api/dashboard/admin` | ✅ | admin | Admin summary stats |
| GET | `/api/dashboard/teacher` | ✅ | teacher | Teacher summary (assigned classes) |
| GET | `/api/dashboard/student` | ✅ | student | Student summary (attendance, fees, results) |
| GET | `/api/dashboard/accountant` | ✅ | accountant | Fee collection summary |

---

## 15. File Upload API (`/api/upload`)

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/upload/image` | ✅ | Any | Upload image to Cloudinary |
| POST | `/api/upload/document` | ✅ | Any | Upload document (PDF) to Cloudinary |

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0*
