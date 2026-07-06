# Phase 0.1 — Entity Schema Design

> **Diploma Institute Management System (DIMS)**  
> Document: Complete Collection Schemas (Entity-Based)  
> Architecture: No unified users collection. Each entity is independent.

---

## Schema Design Rules

1. Each actor entity (`students`, `teachers`, `accountants`, `admins`) is a standalone collection
2. Auth is stored separately in `*_auth` collections
3. All cross-collection relationships use `ObjectId` references
4. No field named `role` on entity documents (role is implied by the collection itself)
5. `createdAt` / `updatedAt` are auto-managed by Mongoose timestamps

---

## AUTH COLLECTIONS (4)

---

### A1. `student_auth`

Authentication credentials for students.

```
Field           | Type      | Required | Notes
----------------|-----------|----------|----------------------------------------------
_id             | ObjectId  | auto     | Primary key
email           | String    | yes      | Unique, lowercase
passwordHash    | String    | yes      | bcrypt hashed — NEVER returned in responses
studentId       | ObjectId  | yes      | Ref: students (one-to-one)
isActive        | Boolean   | yes      | Default: true — false = login blocked
refreshToken    | String    | no       | Hashed refresh token (select: false)
lastLoginAt     | Date      | no       |
passwordChangedAt | Date    | no       | Used to invalidate old tokens
createdAt       | Date      | auto     |
updatedAt       | Date      | auto     |
```

**Indexes:** `email` (unique), `studentId` (unique)

---

### A2. `teacher_auth`

```
Field           | Type      | Required | Notes
----------------|-----------|----------|----------------------------------------------
_id             | ObjectId  | auto     |
email           | String    | yes      | Unique, lowercase
passwordHash    | String    | yes      | select: false
teacherId       | ObjectId  | yes      | Ref: teachers (one-to-one)
isActive        | Boolean   | yes      | Default: true
refreshToken    | String    | no       | select: false
lastLoginAt     | Date      | no       |
passwordChangedAt | Date    | no       |
createdAt       | Date      | auto     |
updatedAt       | Date      | auto     |
```

**Indexes:** `email` (unique), `teacherId` (unique)

---

### A3. `accountant_auth`

```
Field           | Type      | Required | Notes
----------------|-----------|----------|----------------------------------------------
_id             | ObjectId  | auto     |
email           | String    | yes      | Unique
passwordHash    | String    | yes      | select: false
accountantId    | ObjectId  | yes      | Ref: accountants (one-to-one)
isActive        | Boolean   | yes      | Default: true
refreshToken    | String    | no       | select: false
lastLoginAt     | Date      | no       |
passwordChangedAt | Date    | no       |
createdAt       | Date      | auto     |
updatedAt       | Date      | auto     |
```

**Indexes:** `email` (unique), `accountantId` (unique)

---

### A4. `admin_auth`

```
Field           | Type      | Required | Notes
----------------|-----------|----------|----------------------------------------------
_id             | ObjectId  | auto     |
email           | String    | yes      | Unique
passwordHash    | String    | yes      | select: false
adminId         | ObjectId  | yes      | Ref: admins (one-to-one)
isActive        | Boolean   | yes      | Default: true
refreshToken    | String    | no       | select: false
lastLoginAt     | Date      | no       |
passwordChangedAt | Date    | no       |
createdAt       | Date      | auto     |
updatedAt       | Date      | auto     |
```

**Indexes:** `email` (unique), `adminId` (unique)

---

## ACTOR ENTITY COLLECTIONS (4)

---

### E1. `students`

Core profile for every enrolled student. Contains no auth data.

```
Field             | Type      | Required | Notes
------------------|-----------|----------|--------------------------------------------
_id               | ObjectId  | auto     |
studentId         | String    | yes      | Unique system-generated (e.g., CST-2024-001)
fullName          | String    | yes      |
dateOfBirth       | Date      | yes      |
gender            | String    | yes      | Enum: Male, Female, Other
photo             | String    | no       | Cloudinary URL
phone             | String    | no       |
email             | String    | yes      | Same as student_auth.email (but separate)
address           | Object    | yes      | { village, district, division, postCode }
fatherName        | String    | yes      |
motherName        | String    | yes      |
guardianPhone     | String    | yes      |
religion          | String    | no       |
bloodGroup        | String    | no       |
nidOrBirthReg     | String    | no       |
departmentId      | ObjectId  | yes      | Ref: departments
batchId           | ObjectId  | yes      | Ref: batches
currentSemester   | Number    | yes      | 1–8
session           | String    | yes      | e.g., "2024-25"
sscBoard          | String    | no       |
sscYear           | Number    | no       |
sscGpa            | Number    | no       |
sscRoll           | String    | no       |
enrollmentDate    | Date      | yes      |
status            | String    | yes      | Enum: active, suspended, graduated, dropped
createdAt         | Date      | auto     |
updatedAt         | Date      | auto     |
```

**Indexes:** `studentId` (unique), `departmentId`, `batchId`, `status`

---

### E2. `teachers`

Core profile for teaching faculty. Contains no auth data.

```
Field             | Type      | Required | Notes
------------------|-----------|----------|--------------------------------------------
_id               | ObjectId  | auto     |
employeeId        | String    | yes      | Unique (e.g., TCH-2023-001)
fullName          | String    | yes      |
email             | String    | yes      |
phone             | String    | yes      |
photo             | String    | no       | Cloudinary URL
designation       | String    | yes      | e.g., Lecturer, Senior Lecturer, HOD
qualification     | String    | yes      |
specialization    | String    | no       |
departmentId      | ObjectId  | yes      | Ref: departments
joiningDate       | Date      | yes      |
assignedCourses   | [ObjectId]| no       | Ref: courses (array)
status            | String    | yes      | Enum: active, on_leave, resigned
createdAt         | Date      | auto     |
updatedAt         | Date      | auto     |
```

**Indexes:** `employeeId` (unique), `departmentId`

---

### E3. `accountants`

Financial staff profile.

```
Field             | Type      | Required | Notes
------------------|-----------|----------|--------------------------------------------
_id               | ObjectId  | auto     |
staffId           | String    | yes      | Unique (e.g., ACC-2023-001)
fullName          | String    | yes      |
email             | String    | yes      |
phone             | String    | yes      |
photo             | String    | no       | Cloudinary URL
designation       | String    | yes      | e.g., Accountant, Senior Accountant
joiningDate       | Date      | yes      |
status            | String    | yes      | Enum: active, inactive
createdAt         | Date      | auto     |
updatedAt         | Date      | auto     |
```

**Indexes:** `staffId` (unique)

---

### E4. `admins`

System administrator profile. Typically 1–5 records per institute.

```
Field             | Type      | Required | Notes
------------------|-----------|----------|--------------------------------------------
_id               | ObjectId  | auto     |
adminId           | String    | yes      | Unique (e.g., ADM-001)
fullName          | String    | yes      |
email             | String    | yes      |
phone             | String    | yes      |
photo             | String    | no       | Cloudinary URL
designation       | String    | yes      | e.g., Principal, Vice Principal, IT Admin
isSuperAdmin      | Boolean   | yes      | Default: false (super admin has full access)
joiningDate       | Date      | yes      |
status            | String    | yes      | Enum: active, inactive
createdAt         | Date      | auto     |
updatedAt         | Date      | auto     |
```

**Indexes:** `adminId` (unique), `isSuperAdmin`

---

## ACADEMIC COLLECTIONS (5)

---

### C1. `departments`

```
Field             | Type      | Required | Notes
------------------|-----------|----------|--------------------------------------------
_id               | ObjectId  | auto     |
name              | String    | yes      | e.g., "Computer Technology"
code              | String    | yes      | Unique (e.g., CST, EET, CET, AT)
headTeacherId     | ObjectId  | no       | Ref: teachers
totalSeats        | Number    | no       | Annual intake capacity
description       | String    | no       |
isActive          | Boolean   | yes      | Default: true
createdAt         | Date      | auto     |
updatedAt         | Date      | auto     |
```

**Indexes:** `code` (unique)

---

### C2. `batches`

Student cohort grouping within a department.

```
Field             | Type      | Required | Notes
------------------|-----------|----------|--------------------------------------------
_id               | ObjectId  | auto     |
name              | String    | yes      | e.g., "CST-2024-A"
departmentId      | ObjectId  | yes      | Ref: departments
session           | String    | yes      | e.g., "2024-25"
startYear         | Number    | yes      |
isActive          | Boolean   | yes      | Default: true
createdAt         | Date      | auto     |
```

**Indexes:** `departmentId`, `session`

---

### C3. `courses`

Subject/course definitions per department and semester.

```
Field             | Type      | Required | Notes
------------------|-----------|----------|--------------------------------------------
_id               | ObjectId  | auto     |
name              | String    | yes      | e.g., "Data Structures"
code              | String    | yes      | Unique per department (e.g., CST-301)
departmentId      | ObjectId  | yes      | Ref: departments
semester          | Number    | yes      | 1–8
creditHours       | Number    | yes      |
type              | String    | yes      | Enum: theory, practical, both
assignedTeacherId | ObjectId  | no       | Ref: teachers (currently assigned)
isActive          | Boolean   | yes      | Default: true
createdAt         | Date      | auto     |
updatedAt         | Date      | auto     |
```

**Indexes:** `code` (unique), `departmentId`, `semester`

---

### C4. `exams`

Exam event definitions. Results are linked to these.

```
Field             | Type      | Required | Notes
------------------|-----------|----------|--------------------------------------------
_id               | ObjectId  | auto     |
title             | String    | yes      | e.g., "Midterm Exam - Semester 3 - 2024"
examType          | String    | yes      | Enum: midterm, final, viva, practical, assignment
courseId          | ObjectId  | yes      | Ref: courses
departmentId      | ObjectId  | yes      | Ref: departments
semester          | Number    | yes      | 1–8
batchId           | ObjectId  | yes      | Ref: batches
totalMarks        | Number    | yes      |
passingMarks      | Number    | yes      |
examDate          | Date      | yes      |
conductedBy       | ObjectId  | yes      | Ref: teachers
isPublished       | Boolean   | yes      | Default: false (results not visible until true)
publishedAt       | Date      | no       |
publishedBy       | ObjectId  | no       | Ref: admins
createdAt         | Date      | auto     |
updatedAt         | Date      | auto     |
```

**Indexes:** `courseId`, `departmentId`, `semester`, `batchId`, `examType`

---

## OPERATIONAL COLLECTIONS (5)

---

### O1. `attendances`

One document per student per session per course per date.

```
Field             | Type      | Required | Notes
------------------|-----------|----------|--------------------------------------------
_id               | ObjectId  | auto     |
studentId         | ObjectId  | yes      | Ref: students
courseId          | ObjectId  | yes      | Ref: courses
teacherId         | ObjectId  | yes      | Ref: teachers (who recorded this)
batchId           | ObjectId  | yes      | Ref: batches
date              | Date      | yes      | Date only (time stripped)
status            | String    | yes      | Enum: present, absent, late
remarks           | String    | no       |
createdAt         | Date      | auto     |
updatedAt         | Date      | auto     |
```

**Indexes:** `studentId + courseId + date` (compound unique), `teacherId`, `batchId`, `date`

---

### O2. `results`

One mark entry per student per exam.

```
Field             | Type      | Required | Notes
------------------|-----------|----------|--------------------------------------------
_id               | ObjectId  | auto     |
studentId         | ObjectId  | yes      | Ref: students
examId            | ObjectId  | yes      | Ref: exams
courseId          | ObjectId  | yes      | Ref: courses (denormalized for fast query)
semester          | Number    | yes      |
marksObtained     | Number    | yes      |
grade             | String    | no       | Auto-calculated on save
gradePoint        | Number    | no       | Auto-calculated on save
isPassed          | Boolean   | no       | Auto-calculated
remarks           | String    | no       |
enteredBy         | ObjectId  | yes      | Ref: teachers
isPublished       | Boolean   | yes      | Default: false
publishedAt       | Date      | no       |
publishedBy       | ObjectId  | no       | Ref: admins
createdAt         | Date      | auto     |
updatedAt         | Date      | auto     |
```

**Indexes:** `studentId + examId` (compound unique), `courseId`, `semester`, `isPublished`

---

### O3. `fees`

Student fee ledger. One document per fee assignment per student.

```
Field             | Type          | Required | Notes
------------------|---------------|----------|------------------------------------------
_id               | ObjectId      | auto      |
studentId         | ObjectId      | yes       | Ref: students
feeTitle          | String        | yes       | e.g., "Semester 3 Fee - 2024"
feeType           | String        | yes       | Enum: admission, semester, exam, misc
semester          | Number        | no        |
amountDue         | Number        | yes       |
amountPaid        | Number        | yes       | Default: 0
balance           | Number        | yes       | Computed: amountDue - amountPaid
paymentStatus     | String        | yes       | Enum: pending, partial, paid, waived
dueDate           | Date          | yes       |
waiverAmount      | Number        | no        | Discount/waiver granted
waiverReason      | String        | no        |
payments          | [Object]      | no        | Embedded payment transactions
  payments[].transactionId  | String  | Auto-generated receipt number
  payments[].amount         | Number  | Amount paid in this installment
  payments[].paidAt         | Date    |
  payments[].method         | String  | Enum: cash, bank_transfer, mobile_banking
  payments[].bankRef        | String  | Bank transaction reference (optional)
  payments[].collectedBy    | ObjectId | Ref: accountants
  payments[].remarks        | String  |
createdBy         | ObjectId      | yes       | Ref: accountants (who created this record)
createdAt         | Date          | auto      |
updatedAt         | Date          | auto      |
```

**Indexes:** `studentId`, `paymentStatus`, `dueDate`, `feeType`

---

### O4. `notices`

Institute-wide announcements and communications.

```
Field             | Type      | Required | Notes
------------------|-----------|----------|--------------------------------------------
_id               | ObjectId  | auto     |
title             | String    | yes      |
body              | String    | yes      |
audience          | String    | yes      | Enum: all, students, teachers, accountants, department
departmentId      | ObjectId  | no       | Required when audience = department
attachments       | [String]  | no       | Cloudinary URLs
priority          | String    | yes      | Enum: normal, urgent
expiresAt         | Date      | no       |
isActive          | Boolean   | yes      | Default: true
createdBy         | ObjectId  | yes      | Ref: admins
createdAt         | Date      | auto     |
updatedAt         | Date      | auto     |
```

**Indexes:** `audience`, `isActive`, `createdAt`, `departmentId`

---

### O5. `admissions`

Public admission application records.

```
Field               | Type      | Required | Notes
--------------------|-----------|----------|------------------------------------------
_id                 | ObjectId  | auto     |
applicantName       | String    | yes      |
email               | String    | yes      |
phone               | String    | yes      |
dateOfBirth         | Date      | yes      |
gender              | String    | yes      |
desiredDepartmentId | ObjectId  | yes      | Ref: departments
sscBoard            | String    | yes      |
sscYear             | Number    | yes      |
sscGpa              | Number    | yes      |
sscRoll             | String    | yes      |
fatherName          | String    | yes      |
motherName          | String    | yes      |
guardianPhone       | String    | yes      |
address             | Object    | yes      | { district, division }
documents           | [String]  | no       | Cloudinary URLs
status              | String    | yes      | Enum: pending, approved, rejected
reviewRemarks       | String    | no       |
reviewedBy          | ObjectId  | no       | Ref: admins
reviewedAt          | Date      | no       |
convertedStudentId  | ObjectId  | no       | Ref: students (set on approval)
createdAt           | Date      | auto     |
updatedAt           | Date      | auto     |
```

**Indexes:** `status`, `email`, `desiredDepartmentId`

---

## CONFIGURATION COLLECTION (1)

---

### CF1. `institute_settings`

Single-document collection (or keyed document store) for global config.

```
Field               | Type      | Required | Notes
--------------------|-----------|----------|------------------------------------------
_id                 | ObjectId  | auto     |
instituteName       | String    | yes      |
instituteCode       | String    | yes      | e.g., "DIMS-BD-001"
logo                | String    | no       | Cloudinary URL
address             | Object    | yes      | { line1, city, district, postCode }
phone               | String    | yes      |
email               | String    | yes      |
website             | String    | no       |
principalName       | String    | yes      |
establishedYear     | Number    | yes      |
gradingScale        | [Object]  | yes      | Embedded grading rules array
  gradingScale[].minMarks      | Number  |
  gradingScale[].maxMarks      | Number  |
  gradingScale[].grade         | String  | A+, A, B, C, D, F
  gradingScale[].gradePoint    | Number  |
  gradingScale[].label         | String  | Excellent, Good, etc.
attendanceThreshold | Number    | yes      | Min % required (e.g., 75)
currentSession      | String    | yes      | e.g., "2024-25"
admissionOpen       | Boolean   | yes      | Default: false
feeLateFinePct      | Number    | no       | Late fee fine percentage
updatedBy           | ObjectId  | no       | Ref: admins
createdAt           | Date      | auto     |
updatedAt           | Date      | auto     |
```

---

## Collection Summary

| # | Collection | Type | Docs Expected |
|---|---|---|---|
| 1 | `student_auth` | Auth | ~hundreds |
| 2 | `teacher_auth` | Auth | ~tens |
| 3 | `accountant_auth` | Auth | ~5 |
| 4 | `admin_auth` | Auth | ~3 |
| 5 | `students` | Actor Entity | ~hundreds |
| 6 | `teachers` | Actor Entity | ~tens |
| 7 | `accountants` | Actor Entity | ~5 |
| 8 | `admins` | Actor Entity | ~3 |
| 9 | `departments` | Academic | ~10 |
| 10 | `batches` | Academic | ~30 |
| 11 | `courses` | Academic | ~50 |
| 12 | `exams` | Academic | ~200/year |
| 13 | `attendances` | Operational | millions/year |
| 14 | `results` | Operational | ~thousands/year |
| 15 | `fees` | Operational | ~hundreds/year |
| 16 | `notices` | Operational | ~dozens |
| 17 | `admissions` | Operational | ~hundreds/year |
| 18 | `institute_settings` | Config | 1 |

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0.1*
