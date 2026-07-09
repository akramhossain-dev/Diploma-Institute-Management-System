# API Documentation - DIMS

This document specifies the REST API endpoints exposed by the **Diploma Institute Management System (DIMS)**.

---

## 1. Request & Response Standards

### Base URL
```
Development:  http://localhost:5000/api
Production:   https://api.dims.edu.bd/api
```

### Standard Response Envelopes

#### Success Response (200/201 OK)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "pagination": { "page": 1, "limit": 20, "total": 324, "totalPages": 17 } // Present on list queries only
}
```

#### Error Response (4xx/5xx)
```json
{
  "success": false,
  "message": "Detailed error explanation",
  "errorCode": "ERROR_CODE_STRING",
  "errors": [] // Array of validation error details (if applicable)
}
```

### Authorization Header
For all protected routes, clients must pass the JWT access token in the headers:
```
Authorization: Bearer <entityAccessToken>
```

---

## 2. Health & Utility APIs

### System Health Check
- **Method:** `GET`
- **Endpoint:** `/api/health`
- **Authentication:** Public (None)
- **Purpose:** Verifies backend availability and displays timezone/environment logs.
- **Response Example (200):**
  ```json
  {
    "success": true,
    "message": "DIMS API is running",
    "environment": "development",
    "timestamp": "2026-07-09T12:00:00.000Z"
  }
  ```

---

## 3. Authentication APIs (`/api/auth`)

DIMS segregates authentication by role context. Standard login URLs exist under the format `/api/auth/{role}/login`, where `{role}` is `student`, `teacher`, `accountant`, or `admin`.

### Login User
- **Method:** `POST`
- **Endpoint:** `/api/auth/{student|teacher|accountant|admin}/login`
- **Authentication:** Public (None)
- **Rate Limit:** 10 requests / 15 minutes per IP.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "UserSecurePassword123"
  }
  ```
- **Response Example (200):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "accessToken": "eyJhbGciOi...",
      "user": {
        "id": "603d2e1c9f4c3a25b82142e1",
        "email": "user@example.com",
        "fullName": "John Doe",
        "role": "student"
      }
    }
  }
  ```
- **Cookie Set:** `refreshToken` is set as an `HttpOnly`, `Secure` cookie with a 7-day lifetime.

### Refresh Session
- **Method:** `POST`
- **Endpoint:** `/api/auth/{student|teacher|accountant|admin}/refresh`
- **Authentication:** Public (Relies on the client sending the `refreshToken` cookie).
- **Purpose:** Rotates access tokens silently.
- **Response Example (200):**
  ```json
  {
    "success": true,
    "message": "Token refreshed successfully",
    "data": {
      "accessToken": "eyJhbGciOiNewToken..."
    }
  }
  ```

### Logout User
- **Method:** `POST`
- **Endpoint:** `/api/auth/{student|teacher|accountant|admin}/logout`
- **Authentication:** Required (User must match role context).
- **Purpose:** Clears the cookie and invalidates the session.
- **Response Example (200):**
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

### Change Password
- **Method:** `PUT`
- **Endpoint:** `/api/auth/{student|teacher|accountant|admin}/change-password`
- **Authentication:** Required (User must match role context).
- **Request Body:**
  ```json
  {
    "currentPassword": "OldPassword123",
    "newPassword": "NewPassword456!"
  }
  ```
- **Response Example (200):**
  ```json
  {
    "success": true,
    "message": "Password changed successfully"
  }
  ```

---

## 4. Student Management APIs (`/api/students`)

### Create Student Profile
- **Method:** `POST`
- **Endpoint:** `/api/students`
- **Authentication:** Required (`admin` only).
- **Purpose:** Registers a student and generates a linked `student_auth` login.
- **Request Body:**
  ```json
  {
    "fullName": "Kamal Ahmed",
    "email": "kamal@mrist.edu.bd",
    "departmentId": "603d2e1c9f4c3a25b82142e0",
    "semesterId": "603d2e1c9f4c3a25b82142f1",
    "academicSessionId": "603d2e1c9f4c3a25b82142aa"
  }
  ```
- **Response Example (201):**
  ```json
  {
    "success": true,
    "message": "Student created successfully",
    "data": {
      "studentId": "MRIST-STD2026-0001",
      "fullName": "Kamal Ahmed",
      "email": "kamal@mrist.edu.bd",
      "status": "active"
    }
  }
  ```

### List Students
- **Method:** `GET`
- **Endpoint:** `/api/students`
- **Authentication:** Required (`admin` or `teacher`).
- **Query Filters:** `?page=1&limit=20&search=Kamal&departmentId=...&status=active`
- **Response Example (200):**
  ```json
  {
    "success": true,
    "message": "Students retrieved successfully",
    "data": [ ... ],
    "pagination": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
  }
  ```

### Get Own Profile
- **Method:** `GET`
- **Endpoint:** `/api/students/me`
- **Authentication:** Required (`student` only).
- **Purpose:** Allows students to view their dashboard profile info.

---

## 5. Teacher Management APIs (`/api/teachers`)

### Create Teacher Profile
- **Method:** `POST`
- **Endpoint:** `/api/teachers`
- **Authentication:** Required (`admin` only).

### Get Own Profile
- **Method:** `GET`
- **Endpoint:** `/api/teachers/me`
- **Authentication:** Required (`teacher` only).

---

## 6. Academic Setup APIs

### Departments (`/api/departments`)
- `POST /api/departments` — Create department (`admin`).
- `GET /api/departments` — List departments (`admin`, `teacher`, `student`, `accountant`).
- `GET /api/departments/public` — List active departments (Public admission utility).
- `PATCH /api/departments/:id` — Update department info (`admin`).
- `PATCH /api/departments/:id/status` — Toggle status (`admin`).

### Semesters (`/api/semesters`)
- `GET /api/semesters` — Retrieve semesters.
- `POST /api/semesters` — Create semester (`admin`).

### Academic Sessions (`/api/academic-sessions`)
- `GET /api/academic-sessions` — Retrieve academic sessions.
- `POST /api/academic-sessions` — Create academic session (`admin`).

### Courses / Subjects (`/api/courses`)
- `GET /api/courses` — List courses.
- `POST /api/courses` — Create course (`admin`).
- `PATCH /api/courses/:id` — Update course details (`admin`).

---

## 7. Attendance APIs (`/api/attendance`)

### Record Attendance Session (Bulk)
- **Method:** `POST`
- **Endpoint:** `/api/attendance`
- **Authentication:** Required (`teacher` or `admin`).
- **Request Body:**
  ```json
  {
    "courseId": "603d2e1c9f4c3a25b82142b0",
    "semesterId": "603d2e1c9f4c3a25b82142f1",
    "date": "2026-07-09",
    "records": [
      { "studentId": "603d2e1c9f4c3a25b82142e1", "status": "present" },
      { "studentId": "603d2e1c9f4c3a25b82142e2", "status": "absent", "remarks": "Sick" }
    ]
  }
  ```
- **Response Example (201):**
  ```json
  {
    "success": true,
    "message": "Attendance recorded successfully"
  }
  ```

### Get Own Attendance Summary
- **Method:** `GET`
- **Endpoint:** `/api/attendance/my`
- **Authentication:** Required (`student` only).

---

## 8. Grading & Results (`/api/exams`, `/api/marks`, `/api/results`)

### Record Marks in Bulk
- **Method:** `POST`
- **Endpoint:** `/api/marks/bulk`
- **Authentication:** Required (`teacher` or `admin`).
- **Request Body:**
  ```json
  {
    "examCourseMappingId": "603d2e1c9f4c3a25b82142c1",
    "marks": [
      { "studentId": "603d2e1c9f4c3a25b82142e1", "midterm": 18, "final": 52, "practical": 22 },
      { "studentId": "603d2e1c9f4c3a25b82142e2", "midterm": 14, "final": 40, "practical": 20 }
    ]
  }
  ```

### Publish Grade Sheets
- **Method:** `POST`
- **Endpoint:** `/api/results/publish`
- **Authentication:** Required (`admin` only).
- **Purpose:** Calculates total GPA scores and flags letter grades, rendering results visible to students.

---

## 9. Notice Board APIs (`/api/notices`)

### Create Notice
- **Method:** `POST`
- **Endpoint:** `/api/notices`
- **Authentication:** Required (`admin` only).
- **Request Body:**
  ```json
  {
    "title": "Eid Vacation Announcement",
    "body": "The institute will remain closed from July 12th to July 20th.",
    "audience": "all",
    "attachmentUrl": "https://res.cloudinary.com/..."
  }
  ```

### View Notice List
- **Method:** `GET`
- **Endpoint:** `/api/notices`
- **Authentication:** Required (All logged-in roles).
- **Note:** The server auto-filters notice lists depending on the requester's `entityType` in the JWT claim.

---

## 10. Financial Operations APIs

### Create Fee Structure
- **Method:** `POST`
- **Endpoint:** `/api/fee-structures`
- **Authentication:** Required (`admin` or `accountant`).

### Record a Payment
- **Method:** `POST`
- **Endpoint:** `/api/payments`
- **Authentication:** Required (`admin` or `accountant`).
- **Request Body:**
  ```json
  {
    "studentFeeAssignmentId": "603d2e1c9f4c3a25b82142d5",
    "amountPaid": 5000,
    "paymentMethod": "cash",
    "transactionId": "TXN9876543"
  }
  ```

---

## 11. Dashboards & Reports (`/api/dashboard`, `/api/reports`)

### Get Admin Dashboard Summary
- **Method:** `GET`
- **Endpoint:** `/api/dashboard/admin`
- **Authentication:** Required (`admin` only).

### Export Financial report
- **Method:** `GET`
- **Endpoint:** `/api/reports/finance`
- **Authentication:** Required (`admin` or `accountant`).
- **Query Params:** `?startDate=2026-01-01&endDate=2026-07-01`
