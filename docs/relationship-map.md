# Phase 0.1 — Entity Relationship Map

> **Diploma Institute Management System (DIMS)**  
> Document: Cross-Entity Reference Diagram and Relationship Catalog

---

## 1. Full Entity Relationship Map

```
                          ┌─────────────────────┐
                          │   institute_settings  │
                          │  (gradingScale, etc.) │
                          └─────────┬────────────┘
                                    │ read by all modules (grading)
                                    │
┌──────────────────────────────────────────────────────────────────────────┐
│                          ACTOR ENTITIES                                    │
│                                                                            │
│  ┌──────────┐  ←─auth─→  ┌──────────────┐                               │
│  │  admins  │             │  admin_auth  │                               │
│  └──────┬───┘             └──────────────┘                               │
│         │ createdBy / reviewedBy / publishedBy (ref in other collections) │
│         │                                                                  │
│  ┌──────────┐  ←─auth─→  ┌──────────────┐                               │
│  │ teachers │             │ teacher_auth │                               │
│  └──────┬───┘             └──────────────┘                               │
│         │                                                                  │
│  ┌──────────┐  ←─auth─→  ┌────────────────┐                             │
│  │ students │             │  student_auth  │                             │
│  └──────┬───┘             └────────────────┘                             │
│         │                                                                  │
│  ┌─────────────┐  ←─auth─→  ┌──────────────────┐                       │
│  │ accountants │             │ accountant_auth  │                       │
│  └──────┬──────┘             └──────────────────┘                       │
└─────────┼────────────────────────────────────────────────────────────────┘
          │
┌─────────┼────────────────────────────────────────────────────────────────┐
│         │           STRUCTURAL ENTITIES                                    │
│         │                                                                  │
│  ┌──────▼───────────┐                                                    │
│  │   departments    │◄────────────────────────────────────────────────┐ │
│  │ (headTeacherId)  │                                                  │ │
│  └──────┬────────── ┘                                                  │ │
│         │                                                               │ │
│  ┌──────▼──────────────┐                                               │ │
│  │      batches        │◄──────────────────────────────────────────┐  │ │
│  │  (departmentId)     │                                            │  │ │
│  └──────┬──────────────┘                                            │  │ │
│         │                                                            │  │ │
│  ┌──────▼──────────────────────────┐                                │  │ │
│  │          courses                │◄──────────────────────────┐   │  │ │
│  │ (departmentId, teacherId)       │                            │   │  │ │
│  └──────┬──────────────────────────┘                            │   │  │ │
│         │                                                        │   │  │ │
│  ┌──────▼──────────────────────────┐                            │   │  │ │
│  │           exams                 │                            │   │  │ │
│  │ (courseId, departmentId,        │                            │   │  │ │
│  │  batchId, conductedBy)         │                            │   │  │ │
│  └──────┬──────────────────────────┘                            │   │  │ │
└─────────┼────────────────────────────────────────────────────────────────┘
          │
┌─────────┼────────────────────────────────────────────────────────────────┐
│         │           OPERATIONAL ENTITIES                                   │
│         │                                                                  │
│  students ─────────────────────────────────────────────────┐             │
│    ├──► departmentId ──────────────────────────────────────┤ departments │
│    ├──► batchId ───────────────────────────────────────────┤ batches     │
│    │                                                         │             │
│    ├──────────────────┐                                     │             │
│    │                  ▼                                     │             │
│    │           attendances                                   │             │
│    │           ├── studentId ──────────────── ref students  │             │
│    │           ├── courseId ────────────────── ref courses  │             │
│    │           ├── teacherId ─────────────── ref teachers   │             │
│    │           └── batchId ──────────────────── ref batches │             │
│    │                                                         │             │
│    ├──────────────────┐                                     │             │
│    │                  ▼                                     │             │
│    │             results                                     │             │
│    │             ├── studentId ─────────────── ref students │             │
│    │             ├── examId ──────────────────── ref exams  │             │
│    │             ├── courseId ─────────────── ref courses   │             │
│    │             ├── enteredBy ──────────── ref teachers    │             │
│    │             └── publishedBy ─────────────── ref admins │             │
│    │                                                         │             │
│    ├──────────────────┐                                     │             │
│    │                  ▼                                     │             │
│    │               fees                                      │             │
│    │               ├── studentId ─────────── ref students   │             │
│    │               ├── payments[].collectedBy ─ ref accountants           │
│    │               └── createdBy ───────── ref accountants  │             │
│    │                                                         │             │
│    └──────────────────────────────────────────────────────── ┘            │
│                                                                            │
│  admissions                                                                │
│    ├── desiredDepartmentId ──────── ref departments                       │
│    ├── reviewedBy ─────────────────── ref admins                          │
│    └── convertedStudentId ──────────── ref students                       │
│                                                                            │
│  notices                                                                   │
│    ├── departmentId ────────────── ref departments (optional)             │
│    └── createdBy ───────────────────── ref admins                         │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Reference Catalog

Full table of all ObjectId references across collections:

| Source Collection | Field | References | Notes |
|---|---|---|---|
| `student_auth` | `studentId` | `students._id` | 1:1 link |
| `teacher_auth` | `teacherId` | `teachers._id` | 1:1 link |
| `accountant_auth` | `accountantId` | `accountants._id` | 1:1 link |
| `admin_auth` | `adminId` | `admins._id` | 1:1 link |
| `students` | `departmentId` | `departments._id` | Student belongs to dept |
| `students` | `batchId` | `batches._id` | Student belongs to batch |
| `teachers` | `departmentId` | `departments._id` | Teacher belongs to dept |
| `teachers` | `assignedCourses[]` | `courses._id` | Many-to-many |
| `departments` | `headTeacherId` | `teachers._id` | Optional HOD reference |
| `batches` | `departmentId` | `departments._id` | Batch belongs to dept |
| `courses` | `departmentId` | `departments._id` | Course belongs to dept |
| `courses` | `assignedTeacherId` | `teachers._id` | Currently assigned teacher |
| `exams` | `courseId` | `courses._id` | Exam for course |
| `exams` | `departmentId` | `departments._id` | Denormalized for query |
| `exams` | `batchId` | `batches._id` | Exam for batch |
| `exams` | `conductedBy` | `teachers._id` | Teacher conducting exam |
| `exams` | `publishedBy` | `admins._id` | Admin who published |
| `attendances` | `studentId` | `students._id` | Attendance for student |
| `attendances` | `courseId` | `courses._id` | Attendance for course |
| `attendances` | `teacherId` | `teachers._id` | Teacher who recorded |
| `attendances` | `batchId` | `batches._id` | Batch context |
| `results` | `studentId` | `students._id` | Result for student |
| `results` | `examId` | `exams._id` | Result for exam |
| `results` | `courseId` | `courses._id` | Denormalized for query |
| `results` | `enteredBy` | `teachers._id` | Teacher who entered marks |
| `results` | `publishedBy` | `admins._id` | Admin who published |
| `fees` | `studentId` | `students._id` | Fee for student |
| `fees` | `createdBy` | `accountants._id` | Accountant who created |
| `fees` | `payments[].collectedBy` | `accountants._id` | Accountant who collected |
| `notices` | `createdBy` | `admins._id` | Admin author |
| `notices` | `departmentId` | `departments._id` | Optional audience filter |
| `admissions` | `desiredDepartmentId` | `departments._id` | Applied department |
| `admissions` | `reviewedBy` | `admins._id` | Admin reviewer |
| `admissions` | `convertedStudentId` | `students._id` | Set on approval |
| `institute_settings` | `updatedBy` | `admins._id` | Last admin to update |

---

## 3. Cardinality Summary

| Relationship | Type | Description |
|---|---|---|
| student ↔ student_auth | 1:1 | Each student has exactly one auth record |
| teacher ↔ teacher_auth | 1:1 | Each teacher has exactly one auth record |
| student → department | N:1 | Many students in one department |
| student → batch | N:1 | Many students in one batch |
| teacher → department | N:1 | Many teachers in one department |
| teacher → courses | N:M | Teacher can be assigned multiple courses |
| course → department | N:1 | Many courses in one department |
| batch → department | N:1 | Many batches in one department |
| exam → course | N:1 | Many exams per course |
| attendance → student | N:1 | Many attendance records per student |
| attendance → course | N:1 | Many attendance records per course |
| result → student | N:1 | Many results per student |
| result → exam | N:1 | Many results per exam (one per student) |
| fee → student | N:1 | Many fee records per student |
| notice → department | N:1 | Optional dept-targeted notices |
| admission → department | N:1 | Application for a department |

---

## 4. Denormalization Decisions

Fields that are deliberately duplicated for query performance:

| Field | Where Stored | Why Denormalized |
|---|---|---|
| `results.courseId` | Copied from `exams.courseId` | Fast result queries without joining exams |
| `results.semester` | Copied from exam/course | Group results by semester without join |
| `exams.departmentId` | Copied from `courses.departmentId` | List exams by department without join |
| `attendances.batchId` | Redundant with student.batchId | Fast batch-level attendance reports |

---

## 5. Cascade Rules (Application Level)

MongoDB has no foreign key constraints. These rules are enforced in the service layer:

| Trigger | Cascade Action |
|---|---|
| Delete `department` | Block if `students`, `teachers`, `courses`, `batches` reference it |
| Delete `course` | Block if `attendances`, `results`, `exams` reference it |
| Delete `teacher` | Remove from `courses.assignedTeacherId`, remove from `departments.headTeacherId` |
| Delete `batch` | Block if `students` reference it |
| Delete `exam` | Block if `results` reference it |
| Deactivate `student` | Mark all pending `fees` as void (optional business rule) |
| Approve `admission` | Create `student` + `student_auth` atomically (fail both if either fails) |

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0.1*
