# 03 — User Roles & Permissions

> **Diploma Institute Management System (DIMS)**  
> Document Type: Role & Access Control Specification

---

## 1. Role Overview

DIMS implements **Role-Based Access Control (RBAC)** with 5 system roles. Each role has a defined set of permissions scoped to specific modules and data.

| Role | Code | Description |
|---|---|---|
| **Admin** | `admin` | Full system control — Principal or IT Admin |
| **Teacher** | `teacher` | Academic operations — Class teacher or subject teacher |
| **Student** | `student` | Read-only academic data — Enrolled student |
| **Accountant** | `accountant` | Financial operations — Fee management staff |
| **Employee** | `employee` | Limited non-academic staff access |

---

## 2. Permission Matrix

**Legend:** `✅ Full` | `👁 Read` | `✏️ Own` | `➕ Create` | `❌ No Access`

### 2.1 Authentication Module

| Action | Admin | Teacher | Student | Accountant | Employee |
|---|---|---|---|---|---|
| Login | ✅ | ✅ | ✅ | ✅ | ✅ |
| Change own password | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create user accounts | ✅ | ❌ | ❌ | ❌ | ❌ |
| Deactivate accounts | ✅ | ❌ | ❌ | ❌ | ❌ |
| Assign/change roles | ✅ | ❌ | ❌ | ❌ | ❌ |

---

### 2.2 Student Management

| Action | Admin | Teacher | Student | Accountant | Employee |
|---|---|---|---|---|---|
| Create student | ✅ | ❌ | ❌ | ❌ | ❌ |
| View all students | ✅ | 👁 | ❌ | 👁 | ❌ |
| View own profile | ✅ | — | ✏️ | — | — |
| Update any student | ✅ | ❌ | ❌ | ❌ | ❌ |
| Deactivate student | ✅ | ❌ | ❌ | ❌ | ❌ |
| View student fee info | ✅ | ❌ | ✏️ | ✅ | ❌ |
| View student results | ✅ | 👁 | ✏️ | ❌ | ❌ |

---

### 2.3 Teacher Management

| Action | Admin | Teacher | Student | Accountant | Employee |
|---|---|---|---|---|---|
| Create teacher | ✅ | ❌ | ❌ | ❌ | ❌ |
| View all teachers | ✅ | 👁 | 👁 | ❌ | ❌ |
| View own profile | — | ✏️ | — | — | — |
| Update any teacher | ✅ | ❌ | ❌ | ❌ | ❌ |
| Assign to courses | ✅ | ❌ | ❌ | ❌ | ❌ |

---

### 2.4 Department & Course Management

| Action | Admin | Teacher | Student | Accountant | Employee |
|---|---|---|---|---|---|
| Create department | ✅ | ❌ | ❌ | ❌ | ❌ |
| View departments | ✅ | 👁 | 👁 | 👁 | 👁 |
| Create course | ✅ | ❌ | ❌ | ❌ | ❌ |
| View courses | ✅ | 👁 | 👁 | ❌ | ❌ |
| Assign course to batch | ✅ | ❌ | ❌ | ❌ | ❌ |

---

### 2.5 Attendance Management

| Action | Admin | Teacher | Student | Accountant | Employee |
|---|---|---|---|---|---|
| Take attendance | ✅ | ✅ (assigned) | ❌ | ❌ | ❌ |
| Edit attendance | ✅ | ✅ (own, today) | ❌ | ❌ | ❌ |
| View own attendance | — | — | ✏️ | — | — |
| View any student attendance | ✅ | 👁 (own class) | ❌ | ❌ | ❌ |
| View full attendance report | ✅ | ❌ | ❌ | ❌ | ❌ |

---

### 2.6 Result Management

| Action | Admin | Teacher | Student | Accountant | Employee |
|---|---|---|---|---|---|
| Enter marks | ✅ | ✅ (assigned) | ❌ | ❌ | ❌ |
| Edit marks (before publish) | ✅ | ✅ | ❌ | ❌ | ❌ |
| Approve result | ✅ | ❌ | ❌ | ❌ | ❌ |
| Publish result | ✅ | ❌ | ❌ | ❌ | ❌ |
| View published result | ✅ | 👁 | ✏️ | ❌ | ❌ |
| View unpublished result | ✅ | 👁 (own) | ❌ | ❌ | ❌ |

---

### 2.7 Fee Management

| Action | Admin | Teacher | Student | Accountant | Employee |
|---|---|---|---|---|---|
| Define fee structure | ✅ | ❌ | ❌ | ✅ | ❌ |
| Assign fees to students | ✅ | ❌ | ❌ | ✅ | ❌ |
| Record payment | ✅ | ❌ | ❌ | ✅ | ❌ |
| View own fees | — | — | ✏️ | — | — |
| View all fee records | ✅ | ❌ | ❌ | ✅ | ❌ |
| Generate fee reports | ✅ | ❌ | ❌ | ✅ | ❌ |

---

### 2.8 Notice Management

| Action | Admin | Teacher | Student | Accountant | Employee |
|---|---|---|---|---|---|
| Create notice | ✅ | ❌ | ❌ | ❌ | ❌ |
| Edit notice | ✅ | ❌ | ❌ | ❌ | ❌ |
| Delete notice | ✅ | ❌ | ❌ | ❌ | ❌ |
| View notices (targeted) | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### 2.9 Admission Management

| Action | Admin | Teacher | Student | Accountant | Employee |
|---|---|---|---|---|---|
| Submit admission form | Public | Public | Public | Public | Public |
| View all applications | ✅ | ❌ | ❌ | ❌ | ❌ |
| Approve/reject application | ✅ | ❌ | ❌ | ❌ | ❌ |
| View own application | — | — | ✏️ | — | — |

---

### 2.10 System Administration

| Action | Admin | Teacher | Student | Accountant | Employee |
|---|---|---|---|---|---|
| View audit logs | ✅ | ❌ | ❌ | ❌ | ❌ |
| System configuration | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage all user accounts | ✅ | ❌ | ❌ | ❌ | ❌ |
| View analytics dashboard | ✅ | ❌ | ❌ | 👁 | ❌ |

---

## 3. Detailed Role Descriptions

### 3.1 Admin (`admin`)

The highest-privilege role, typically held by the institute's Principal, Vice-Principal, or designated IT Administrator.

**Responsibilities:**
- Full CRUD on all entities (students, teachers, departments, courses)
- Manage all system users and role assignments
- Approve and publish academic results
- Approve or reject admission applications
- Define fee structures and review financial summaries
- Create and manage notices
- Access the analytics dashboard

**Access Scope:** System-wide, unrestricted.

---

### 3.2 Teacher (`teacher`)

Academic staff responsible for class management, attendance, and result entry.

**Responsibilities:**
- Take and manage attendance for assigned courses/classes
- Enter and edit student marks for assigned subjects (before publish)
- View student profiles within their assigned classes
- View published results
- View notices targeted at teachers

**Access Scope:** Limited to assigned departments, courses, and batches. Cannot access financial, admission, or admin configuration modules.

---

### 3.3 Student (`student`)

Enrolled students with read-only access to their own academic data.

**Responsibilities:**
- View own profile, attendance, results (when published), and fee status
- View notices targeted at all students or their department
- Submit admission re-enrollment or profile update requests (future)

**Access Scope:** Own data only. Cannot access other students' records, teacher data, or financial admin.

---

### 3.4 Accountant (`accountant`)

Financial management staff responsible for fee operations.

**Responsibilities:**
- Define and manage fee structures
- Record student fee payments
- View all fee records and generate reports
- View student profiles (for fee lookup)

**Access Scope:** Financial module full access. No academic data write permissions (results, attendance, marks).

---

### 3.5 Employee (`employee`)

General non-teaching, non-financial staff (office staff, librarians, etc.).

**Responsibilities:**
- View department and course listings
- View notices relevant to all staff
- Limited profile access

**Access Scope:** Minimal — primarily a viewer role. Specific permissions may be extended on a case-by-case basis by admin.

---

## 4. RBAC Implementation Approach

```
Request → JWT Middleware (authenticate) → Role Middleware (authorize) → Controller
```

- **`authenticate`** — Validates JWT, attaches `req.user` (id, role, email)
- **`authorize(...roles)`** — Middleware factory that accepts allowed roles and rejects unauthorized requests with `403 Forbidden`
- **Resource-level checks** — For data ownership (e.g., student viewing own record), additional logic in the controller/service layer validates that `req.user.id` matches the requested resource owner

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0*
