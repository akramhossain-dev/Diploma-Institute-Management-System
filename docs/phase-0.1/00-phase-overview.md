# Phase 0.1 — Entity-Based Architecture Design

> **Diploma Institute Management System (DIMS)**  
> Phase: 0.1 | Type: Architecture Redesign  
> Supersedes: Phase 0 unified-role model

---

## 1. Why Phase 0.1 Exists

Phase 0 established the foundational documentation using a conventional unified `users` collection with a global RBAC system. Phase 0.1 **replaces** that architectural decision with a superior **entity-based model** where every major actor in the system is a fully independent database entity.

This change affects:
- Database schema design (`06-database-design.md` superseded by `phase-0.1/02-entity-schema.md`)
- Authentication architecture (superseded by `phase-0.1/03-auth-design.md`)
- Backend module structure (superseded by `phase-0.1/04-module-structure.md`)
- API design patterns (superseded by `phase-0.1/05-api-design.md`)

---

## 2. Core Architectural Principle

> **Each real-world actor in the institute is an independent collection.  
> There is no shared `users` table. There is no global role field.**

Instead of:
```
users { _id, name, email, password, role: "student" | "teacher" | ... }
```

The system uses:
```
students   { _id, studentId, name, email, ... }
teachers   { _id, employeeId, name, email, ... }
accountants { _id, staffId, name, email, ... }
admins      { _id, adminId, name, email, ... }
```

---

## 3. Entity Inventory

| Entity | Collection | Auth Collection | Description |
|---|---|---|---|
| Student | `students` | `student_auth` | Enrolled students |
| Teacher | `teachers` | `teacher_auth` | Teaching faculty |
| Accountant | `accountants` | `accountant_auth` | Financial staff |
| Admin | `admins` | `admin_auth` | Institute administrators |
| Department | `departments` | — | Academic departments |
| Course | `courses` | — | Subjects per department |
| Attendance | `attendances` | — | Session attendance records |
| Exam | `exams` | — | Exam definitions |
| Result | `results` | — | Mark entries and grades |
| Fee | `fees` | — | Student fee ledger |
| Notice | `notices` | — | Announcements |
| Admission | `admissions` | — | Application records |
| Institute Settings | `institute_settings` | — | Global configuration |

**Total: 13 data collections + 4 auth collections = 17 MongoDB collections**

---

## 4. Phase 0.1 Document Index

| File | Contents |
|---|---|
| `00-phase-overview.md` | This document — context and principles |
| `01-architecture-diagram.md` | Full system architecture with entity relationships |
| `02-entity-schema.md` | All 17 collection schemas with fields |
| `03-auth-design.md` | Entity-based authentication design (Option A vs B) |
| `04-module-structure.md` | Backend modular folder structure |
| `05-api-design.md` | Entity-scoped REST API endpoints |
| `06-data-flows.md` | Real system workflows (attendance, result, fee, admission) |
| `07-relationship-map.md` | Cross-entity reference diagram |

---

## 5. Key Design Decisions

### Decision 1: No Unified Users Collection

**Rejected pattern:**
```
users { role: "student" } → student data as subfields or separate profile
```

**Adopted pattern:**
```
students { ... all student fields here }
student_auth { email, passwordHash, studentId → ref students }
```

**Why:**
- Domain clarity — students and teachers are fundamentally different entities with different fields, lifecycles, and relationships
- Schema flexibility — each entity evolves independently without migration risk
- Query performance — no filter-by-role overhead on every query
- Security isolation — compromising one auth collection does not expose all entity types

---

### Decision 2: Entity-Based Authentication (Option A)

Separate auth collections per entity type (see `03-auth-design.md` for full rationale).

```
student_auth  { email, passwordHash, studentId, ... }
teacher_auth  { email, passwordHash, teacherId, ... }
accountant_auth { email, passwordHash, accountantId, ... }
admin_auth    { email, passwordHash, adminId, ... }
```

---

### Decision 3: Reference-Only Relationships

All cross-collection data links use **ObjectId references only**. No embedding of another entity's document. No denormalization except for performance-critical read-heavy fields.

---

### Decision 4: Module-per-Entity Backend

Every entity has a dedicated backend module:

```
backend/src/modules/students/
backend/src/modules/teachers/
backend/src/modules/accountants/
...
```

No module imports from another module's internal files. Inter-module communication happens only via service layer interfaces.

---

## 6. What Phase 0.1 Does NOT Change

| Aspect | Status |
|---|---|
| Tech stack (Next.js, Express, MongoDB) | Unchanged |
| Deployment strategy | Unchanged |
| UI/UX plan | Unchanged |
| Feature list | Unchanged |
| Naming conventions | Unchanged |

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0.1*
