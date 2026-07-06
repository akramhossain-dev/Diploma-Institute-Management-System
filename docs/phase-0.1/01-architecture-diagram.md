# Phase 0.1 — System Architecture Diagram

> **Diploma Institute Management System (DIMS)**  
> Document: Architecture Overview with Entity Relationships

---

## 1. High-Level System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER (Next.js / Vercel)                      │
│                                                                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │   Admin     │  │   Teacher   │  │   Student   │  │   Accountant     │   │
│  │  Dashboard  │  │  Dashboard  │  │  Dashboard  │  │   Dashboard      │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └────────┬─────────┘   │
│         │                │                │                   │              │
│         └───────────────────────┬──────────────────────────────┘             │
│                                 │                                             │
│                    Axios HTTP Client + Interceptors                           │
│                    JWT stored per entity (httpOnly cookie)                    │
└─────────────────────────────────┬────────────────────────────────────────────┘
                                  │ HTTPS REST (JSON)
                                  │ Authorization: Bearer <entity_jwt>
┌─────────────────────────────────▼────────────────────────────────────────────┐
│                        API GATEWAY LAYER (Express.js / Render)                │
│                                                                                │
│   ┌──────────────────────────────────────────────────────────────────────┐   │
│   │                    Global Middleware Stack                             │   │
│   │   helmet │ cors │ morgan │ rateLimiter │ bodyParser │ errorHandler    │   │
│   └──────────────────────────────────────────────────────────────────────┘   │
│                                                                                │
│   /api/auth/student  → student_auth module                                   │
│   /api/auth/teacher  → teacher_auth module                                   │
│   /api/auth/accountant → accountant_auth module                              │
│   /api/auth/admin    → admin_auth module                                     │
│                                                                                │
│   ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────────┐   │
│   │  students  │  │  teachers  │  │accountants │  │      admins        │   │
│   │   module   │  │   module   │  │   module   │  │      module        │   │
│   └────────────┘  └────────────┘  └────────────┘  └────────────────────┘   │
│                                                                                │
│   ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────────┐   │
│   │departments │  │  courses   │  │ attendance │  │       exams        │   │
│   │   module   │  │   module   │  │   module   │  │       module       │   │
│   └────────────┘  └────────────┘  └────────────┘  └────────────────────┘   │
│                                                                                │
│   ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────────┐   │
│   │  results   │  │    fees    │  │  notices   │  │     admissions     │   │
│   │   module   │  │   module   │  │   module   │  │       module       │   │
│   └────────────┘  └────────────┘  └────────────┘  └────────────────────┘   │
│                                                                                │
│                    ┌──────────────────────┐                                   │
│                    │  institute_settings  │                                   │
│                    │       module         │                                   │
│                    └──────────────────────┘                                   │
└─────────────────────────────────┬────────────────────────────────────────────┘
                                  │ Mongoose ODM
┌─────────────────────────────────▼────────────────────────────────────────────┐
│                         DATA LAYER (MongoDB Atlas)                             │
│                                                                                │
│   AUTH COLLECTIONS              │   ENTITY COLLECTIONS                        │
│   ─────────────────             │   ──────────────────                        │
│   student_auth                  │   students                                  │
│   teacher_auth                  │   teachers                                  │
│   accountant_auth               │   accountants                               │
│   admin_auth                    │   admins                                    │
│                                 │                                             │
│   OPERATIONAL COLLECTIONS                                                     │
│   ────────────────────────────────────────────────────────────────────────   │
│   departments │ courses │ attendances │ exams │ results │ fees │ notices      │
│   admissions  │ institute_settings                                            │
└──────────────────────────────────────────────────────────────────────────────┘
                    │                   │               │
         ┌──────────┘          ┌────────┘      ┌───────┘
         ▼                     ▼               ▼
   ┌───────────┐       ┌─────────────┐  ┌──────────────┐
   │Cloudinary │       │  Nodemailer │  │  Socket.io   │
   │ (Files)   │       │  (Email)    │  │  (Realtime)  │
   └───────────┘       └─────────────┘  └──────────────┘
```

---

## 2. Entity Relationship Overview

```
admissions ──(on approval)──────────────────────→ students
                                                       │
                       ┌───────────────────────────────┤
                       │                               │
              student_auth                   ┌─────────┼──────────┐
              { studentId → students._id }   │         │          │
                                        attendances results     fees
                                             │         │          │
                                        courseId   examId    feeStructureId
                                             │         │
                                           courses    exams
                                             │         │
                                        departmentId courseId
                                             │
                                         departments
                                             │
                                        headTeacherId
                                             │
                                          teachers
                                             │
                                        teacher_auth
                                        { teacherId → teachers._id }

admins ──→ admin_auth { adminId → admins._id }
accountants ──→ accountant_auth { accountantId → accountants._id }
```

---

## 3. Entity Isolation Principle

Each entity module is **fully self-contained** and communicates with other modules only through **ID references** passed via request context or service-layer function calls.

```
Module Isolation Rule:
─────────────────────
attendance.module  → KNOWS: courseId (ref), studentId (ref), teacherId (ref)
attendance.module  → DOES NOT IMPORT: student.model, teacher.model, course.model
attendance.module  → RECEIVES: IDs from authenticated request / client payload
attendance.module  → VALIDATES: IDs exist by calling respective service functions
```

---

## 4. Authentication Flow per Entity

```
[Client: Student Login]
        │
        ▼
POST /api/auth/student/login { email, password }
        │
        ▼
student_auth module:
  → find record by email in student_auth collection
  → compare password hash
  → load linked student profile via studentId
        │
        ▼
Issue JWT:
{
  "sub": "student_auth._id",
  "entityId": "students._id",
  "entityType": "student",
  "rollNumber": "CST-2024-001"
}
        │
        ▼
[Client receives access token scoped to student entity]
[Middleware on protected routes: verifies entityType === 'student']
```

---

## 5. Module Interaction Map

```
modules that READ from students collection:
  → attendance module (verify studentId)
  → results module (fetch student results)
  → fees module (student fee ledger)
  → notices module (audience filter)
  → admissions module (on approval → create student)

modules that READ from teachers collection:
  → attendance module (verify teacherId)
  → courses module (assigned teacher)
  → departments module (head teacher)
  → results module (mark entry by teacher)
  → exams module (assigned by teacher)

modules that READ from courses collection:
  → attendance module (courseId)
  → results module (courseId)
  → exams module (courseId)

modules that READ from exams collection:
  → results module (examId)

modules that READ from departments collection:
  → courses module (departmentId)
  → students module (departmentId)
  → teachers module (departmentId)
```

---

## 6. Data Ownership per Module

| Module | Owns (Writes to) | Reads from |
|---|---|---|
| `students` | `students` | `departments`, `courses` |
| `teachers` | `teachers` | `departments`, `courses` |
| `accountants` | `accountants` | — |
| `admins` | `admins` | all collections (read-only aggregation) |
| `departments` | `departments` | `teachers` (head) |
| `courses` | `courses` | `departments`, `teachers` |
| `attendance` | `attendances` | `students`, `teachers`, `courses` |
| `exams` | `exams` | `courses`, `teachers` |
| `results` | `results` | `students`, `exams`, `courses`, `teachers` |
| `fees` | `fees` | `students`, `accountants` |
| `notices` | `notices` | `admins`, `teachers` |
| `admissions` | `admissions`, `students` | `departments` |
| `institute` | `institute_settings` | — |

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0.1*
