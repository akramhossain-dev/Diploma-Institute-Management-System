# 06 — Database Design

> **Diploma Institute Management System (DIMS)**  
> Document Type: Database Schema & Design

---

## 1. Database Overview

- **Type:** MongoDB (NoSQL, Document-based)
- **Provider:** MongoDB Atlas
- **ODM:** Mongoose
- **Naming Convention:** camelCase fields, PascalCase collection names (Mongoose model names)
- **Strategy:** Reference-based for cross-entity relationships, embedded for tightly-coupled sub-documents

---

## 2. Collections

### 2.1 `users`

Central authentication collection. All roles share this collection.

```
Field           | Type      | Required | Notes
----------------|-----------|----------|------------------------------------------
_id             | ObjectId  | auto     | Primary key
name            | String    | yes      | Full name
email           | String    | yes      | Unique, lowercase, indexed
password        | String    | yes      | bcrypt hashed
role            | String    | yes      | Enum: admin, teacher, student, accountant, employee
avatar          | String    | no       | Cloudinary URL
phone           | String    | no       |
isActive        | Boolean   | yes      | Default: true
lastLogin       | Date      | no       |
refreshToken    | String    | no       | Stored for refresh flow (hashed)
createdAt       | Date      | auto     |
updatedAt       | Date      | auto     |
```

**Indexes:** `email` (unique), `role`

---

### 2.2 `students`

Extended profile for students. Linked to `users` via `userId`.

```
Field           | Type      | Required | Notes
----------------|-----------|----------|------------------------------------------
_id             | ObjectId  | auto     |
userId          | ObjectId  | yes      | Ref: users
rollNumber      | String    | yes      | Unique, auto-generated (e.g., CSE-2024-001)
departmentId    | ObjectId  | yes      | Ref: departments
batchId         | ObjectId  | yes      | Ref: batches
currentSemester | Number    | yes      | 1–8
session         | String    | yes      | e.g., "2023-24"
fatherName      | String    | yes      |
motherName      | String    | yes      |
dateOfBirth     | Date      | yes      |
gender          | String    | yes      | Enum: Male, Female, Other
religion        | String    | no       |
bloodGroup      | String    | no       |
address         | Object    | yes      | { village, district, division, postCode }
guardianPhone   | String    | yes      |
nid             | String    | no       | National ID or Birth Reg
sscInfo         | Object    | no       | { board, year, gpa, roll }
status          | String    | yes      | Enum: active, suspended, graduated, dropped
admissionDate   | Date      | yes      |
createdAt       | Date      | auto     |
updatedAt       | Date      | auto     |
```

**Indexes:** `userId` (unique), `rollNumber` (unique), `departmentId`, `batchId`

---

### 2.3 `teachers`

Extended profile for teachers. Linked to `users` via `userId`.

```
Field           | Type      | Required | Notes
----------------|-----------|----------|------------------------------------------
_id             | ObjectId  | auto     |
userId          | ObjectId  | yes      | Ref: users
employeeId      | String    | yes      | Unique (e.g., TCH-2023-001)
departmentId    | ObjectId  | yes      | Ref: departments
designation     | String    | yes      | e.g., Lecturer, Senior Lecturer, HOD
qualification   | String    | yes      |
joiningDate     | Date      | yes      |
specialization  | String    | no       |
status          | String    | yes      | Enum: active, on_leave, resigned
courses         | [ObjectId]| no       | Ref: courses (assigned courses)
createdAt       | Date      | auto     |
updatedAt       | Date      | auto     |
```

**Indexes:** `userId` (unique), `employeeId` (unique), `departmentId`

---

### 2.4 `departments`

```
Field           | Type      | Required | Notes
----------------|-----------|----------|------------------------------------------
_id             | ObjectId  | auto     |
name            | String    | yes      | e.g., "Computer Technology"
code            | String    | yes      | Unique (e.g., CST, EET, CET)
headTeacherId   | ObjectId  | no       | Ref: teachers
description     | String    | no       |
isActive        | Boolean   | yes      | Default: true
createdAt       | Date      | auto     |
updatedAt       | Date      | auto     |
```

**Indexes:** `code` (unique)

---

### 2.5 `courses`

Subjects/courses within a department.

```
Field           | Type      | Required | Notes
----------------|-----------|----------|------------------------------------------
_id             | ObjectId  | auto     |
name            | String    | yes      | e.g., "Data Structures"
code            | String    | yes      | Unique (e.g., CST-301)
departmentId    | ObjectId  | yes      | Ref: departments
semester        | Number    | yes      | 1–8
creditHours     | Number    | yes      |
type            | String    | yes      | Enum: theory, practical, both
teacherId       | ObjectId  | no       | Ref: teachers (currently assigned)
isActive        | Boolean   | yes      | Default: true
createdAt       | Date      | auto     |
updatedAt       | Date      | auto     |
```

**Indexes:** `code` (unique), `departmentId`, `semester`

---

### 2.6 `batches`

Represents a student cohort group.

```
Field           | Type      | Required | Notes
----------------|-----------|----------|------------------------------------------
_id             | ObjectId  | auto     |
name            | String    | yes      | e.g., "CST-2024-A"
departmentId    | ObjectId  | yes      | Ref: departments
session         | String    | yes      | e.g., "2024-25"
startYear       | Number    | yes      |
isActive        | Boolean   | yes      | Default: true
createdAt       | Date      | auto     |
```

**Indexes:** `departmentId`

---

### 2.7 `attendance`

One document per student per subject per date.

```
Field           | Type      | Required | Notes
----------------|-----------|----------|------------------------------------------
_id             | ObjectId  | auto     |
studentId       | ObjectId  | yes      | Ref: students
courseId        | ObjectId  | yes      | Ref: courses
teacherId       | ObjectId  | yes      | Ref: teachers (who took attendance)
date            | Date      | yes      | Date only (no time)
status          | String    | yes      | Enum: present, absent, late
remarks         | String    | no       |
createdAt       | Date      | auto     |
updatedAt       | Date      | auto     |
```

**Indexes:** `studentId + courseId + date` (compound unique), `courseId`, `date`

---

### 2.8 `results`

Mark entry per student per exam per course.

```
Field           | Type      | Required | Notes
----------------|-----------|----------|------------------------------------------
_id             | ObjectId  | auto     |
studentId       | ObjectId  | yes      | Ref: students
courseId        | ObjectId  | yes      | Ref: courses
semester        | Number    | yes      |
examType        | String    | yes      | Enum: midterm, final, viva, practical, assignment
marksObtained   | Number    | yes      |
totalMarks      | Number    | yes      |
grade           | String    | no       | Auto-calculated (A+, A, B, C, D, F)
gradePoint      | Number    | no       | Auto-calculated
enteredBy       | ObjectId  | yes      | Ref: teachers
isPublished     | Boolean   | yes      | Default: false
publishedAt     | Date      | no       |
publishedBy     | ObjectId  | no       | Ref: users (admin)
createdAt       | Date      | auto     |
updatedAt       | Date      | auto     |
```

**Indexes:** `studentId + courseId + examType + semester` (compound unique)

---

### 2.9 `feeStructures`

Defines what fees apply to which group.

```
Field           | Type      | Required | Notes
----------------|-----------|----------|------------------------------------------
_id             | ObjectId  | auto     |
title           | String    | yes      | e.g., "Semester 1 Fee 2024"
departmentId    | ObjectId  | no       | Ref: departments (null = all depts)
semester        | Number    | no       | null = all semesters
feeType         | String    | yes      | Enum: admission, semester, exam, misc
amount          | Number    | yes      |
dueDate         | Date      | yes      |
description     | String    | no       |
isActive        | Boolean   | yes      | Default: true
createdAt       | Date      | auto     |
```

---

### 2.10 `fees`

Payment record per student per fee structure.

```
Field           | Type      | Required | Notes
----------------|-----------|----------|------------------------------------------
_id             | ObjectId  | auto     |
studentId       | ObjectId  | yes      | Ref: students
feeStructureId  | ObjectId  | yes      | Ref: feeStructures
amountDue       | Number    | yes      |
amountPaid      | Number    | yes      | Default: 0
paymentStatus   | String    | yes      | Enum: pending, partial, paid
payments        | [Object]  | no       | Array of payment records (embedded)
  payments[].amount         | Number | Amount paid in this transaction
  payments[].date           | Date   | Payment date
  payments[].method         | String | cash, bank_transfer, online
  payments[].receiptNumber  | String | Unique receipt number
  payments[].collectedBy    | ObjectId | Ref: users (accountant)
createdAt       | Date      | auto     |
updatedAt       | Date      | auto     |
```

**Indexes:** `studentId`, `feeStructureId`, `paymentStatus`

---

### 2.11 `notices`

```
Field           | Type      | Required | Notes
----------------|-----------|----------|------------------------------------------
_id             | ObjectId  | auto     |
title           | String    | yes      |
body            | String    | yes      |
audience        | String    | yes      | Enum: all, teachers, students, department
departmentId    | ObjectId  | no       | Required if audience = department
attachments     | [String]  | no       | Array of Cloudinary URLs
expiresAt       | Date      | no       |
isActive        | Boolean   | yes      | Default: true
createdBy       | ObjectId  | yes      | Ref: users (admin)
createdAt       | Date      | auto     |
updatedAt       | Date      | auto     |
```

**Indexes:** `audience`, `isActive`, `createdAt`

---

### 2.12 `admissions`

Public admission application records.

```
Field           | Type      | Required | Notes
----------------|-----------|----------|------------------------------------------
_id             | ObjectId  | auto     |
applicantName   | String    | yes      |
email           | String    | yes      |
phone           | String    | yes      |
dateOfBirth     | Date      | yes      |
gender          | String    | yes      |
desiredDept     | ObjectId  | yes      | Ref: departments
sscBoard        | String    | yes      |
sscYear         | Number    | yes      |
sscGpa          | Number    | yes      |
sscRoll         | String    | yes      |
documents       | [String]  | no       | Cloudinary URLs
status          | String    | yes      | Enum: pending, approved, rejected
remarks         | String    | no       | Admin remarks on review
reviewedBy      | ObjectId  | no       | Ref: users (admin)
reviewedAt      | Date      | no       |
convertedStudentId | ObjectId | no     | Ref: students (set on approval)
createdAt       | Date      | auto     |
updatedAt       | Date      | auto     |
```

**Indexes:** `status`, `email`

---

## 3. Entity Relationship Summary

```
users ──< students >── departments ──< courses
       ──< teachers >── departments
       
students ──< attendance >── courses
students ──< results >── courses
students ──< fees >── feeStructures

departments ──< batches
departments ──< notices (when audience = department)

admissions ──> departments
admissions ──> students (on approval)

teachers ──> courses (assignment)
teachers ──> attendance (records taken)
teachers ──> results (entered by)
```

---

## 4. Grading Scale (Configurable)

| Marks Range | Grade | Grade Point |
|---|---|---|
| 80–100 | A+ | 4.00 |
| 70–79 | A | 3.50 |
| 60–69 | A- | 3.00 |
| 50–59 | B | 2.50 |
| 40–49 | C | 2.00 |
| 33–39 | D | 1.00 |
| 0–32 | F | 0.00 |

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0*
