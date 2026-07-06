# Phase 0.1 — Data Flow Specifications

> **Diploma Institute Management System (DIMS)**  
> Document: Real System Workflows and Data Flow Diagrams

---

## Flow 1: Attendance Recording Flow

**Actors:** Teacher, Students, Attendance Collection, Courses Collection

### Preconditions
- Teacher is authenticated (`entityType: teacher`)
- Teacher has at least one course assigned (`teacher.assignedCourses` contains courseId)
- Students are enrolled in the course's department and batch

### Step-by-Step Flow

```
[Teacher opens Attendance module on dashboard]
          │
          ▼
[Teacher selects: Course + Date]
  → GET /api/courses?teacherId=<teacher._id>
  → Frontend loads assigned course list
          │
          ▼
[System loads student roster]
  → GET /api/students?batchId=<batch>&departmentId=<dept>&semester=<n>
  → Returns: [{ _id, studentId, fullName, photo }]
          │
          ▼
[Teacher marks each student: Present / Absent / Late]
  (frontend toggle interface)
          │
          ▼
[Teacher submits attendance]
  → POST /api/attendance
  Body: {
    courseId: "<id>",
    batchId: "<id>",
    date: "2024-06-15",
    records: [
      { studentId: "<id>", status: "present" },
      { studentId: "<id>", status: "absent", remarks: "Sick" },
      { studentId: "<id>", status: "late" }
    ]
  }
          │
          ▼
[attendance.service.js validates:]
  → teacherId (from req.entityId) exists in teachers collection ✅
  → courseId exists in courses collection ✅
  → courseId is in teacher.assignedCourses ✅
  → batchId exists in batches collection ✅
  → date is not in the future ✅
  → Each studentId belongs to the correct batchId ✅
  → No duplicate record for same studentId + courseId + date ✅
          │
          ▼
[Bulk insert into attendances collection]
  → One document per student per session
          │
          ▼
[Response: { success, recorded: 32, date, course }]
          │
          ▼
[Student views own attendance]
  → GET /api/attendance/my
  → Returns: attendance records per subject with auto-calculated % summary
```

### Attendance Percentage Calculation

```
GET /api/attendance/summary/:studentId

attendance.service.js:
  → Group attendances by courseId where studentId matches
  → For each course:
      totalSessions  = count(all attendance docs for student + course)
      presentCount   = count(status = "present" OR "late")
      attendancePct  = (presentCount / totalSessions) × 100
  → Flag courses where attendancePct < institute_settings.attendanceThreshold
  → Return: [{ courseId, courseName, totalSessions, present, absent, late, percentage, isAtRisk }]
```

---

## Flow 2: Exam Result Entry & Publishing Flow

**Actors:** Teacher, Admin, Exams Collection, Results Collection, Students

### Step 1 — Admin Creates Exam Definition

```
[Admin navigates to Exams module]
          │
          ▼
POST /api/exams
Body: {
  title: "Midterm Exam - CST Semester 3 - 2024",
  examType: "midterm",
  courseId: "<id>",
  departmentId: "<id>",
  batchId: "<id>",
  semester: 3,
  totalMarks: 100,
  passingMarks: 40,
  examDate: "2024-07-10",
  conductedBy: "<teacherId>"
}
          │
          ▼
[Exam document created in exams collection]
[isPublished: false — students cannot see results yet]
```

### Step 2 — Teacher Enters Marks

```
[Teacher navigates to Results → selects exam]
          │
          ▼
GET /api/exams?courseId=<id>
→ Returns list of exams for teacher's assigned courses

GET /api/students?batchId=<id>&semester=3
→ Returns student roster for this batch
          │
          ▼
[Teacher enters marks for each student in the UI grid]
          │
          ▼
POST /api/results
Body: {
  examId: "<id>",
  marks: [
    { studentId: "<id>", marksObtained: 78 },
    { studentId: "<id>", marksObtained: 45 },
    { studentId: "<id>", marksObtained: 32 }
  ]
}
          │
          ▼
[result.service.js validates:]
  → examId exists in exams collection ✅
  → exam.conductedBy === req.entityId (teacher is allowed) ✅
  → Each studentId is in the correct batch/department ✅
  → marksObtained ≤ exam.totalMarks ✅
  → No duplicate entry per studentId + examId ✅
          │
          ▼
[result.service.js auto-calculates per result document:]
  → grade, gradePoint from institute_settings.gradingScale
  → isPassed = marksObtained >= exam.passingMarks
          │
          ▼
[Bulk insert/upsert into results collection]
[isPublished: false on all new results]
          │
          ▼
[Teacher can edit marks before admin publishes]
  → PUT /api/results/:id { marksObtained: <corrected> }
  → grade/gradePoint recalculated on save
```

### Step 3 — Admin Reviews and Publishes

```
[Admin navigates to Results → selects exam]
          │
          ▼
GET /api/results/exam/:examId
→ Returns all result entries with grade summary

[Admin verifies all marks look correct]
          │
          ▼
PATCH /api/exams/:id/publish
→ exam.isPublished = true
→ exam.publishedAt = now
→ exam.publishedBy = req.entityId (admin)
          │
          ▼
[All results for this exam now visible to students]
  → GET /api/results/my returns results where exam.isPublished = true
          │
          ▼
[Optional: Notification sent to students in that batch]
  → Socket.io event: result_published → room: batch:<batchId>
```

---

## Flow 3: Fee Management Flow

**Actors:** Accountant, Admin, Students, Fees Collection

### Step 1 — Create Fee Records

```
[Accountant navigates to Fees module]
          │
          ▼
POST /api/fees
Body: {
  feeTitle: "Semester 3 Fee - 2024",
  feeType: "semester",
  semester: 3,
  amountDue: 5000,
  dueDate: "2024-08-01",
  studentIds: ["<id1>", "<id2>", ...] OR
  assignTo: { departmentId: "<id>", semester: 3, batchId: "<id>" }
}
          │
          ▼
[fee.service.js creates one fee document per student:]
  → { studentId, feeTitle, feeType, amountDue, amountPaid: 0,
      balance: 5000, paymentStatus: "pending", dueDate, createdBy: accountantId }
```

### Step 2 — Record Payment

```
[Student comes to office and pays]
[Accountant selects student → views fee dues]
  → GET /api/fees/student/:studentId
  → Returns all fee records with status
          │
          ▼
POST /api/fees/:feeId/payment
Body: {
  amount: 3000,
  method: "cash",
  bankRef: null,
  remarks: "Partial payment - first installment"
}
          │
          ▼
[fee.service.js updates fee document:]
  → Appends to fee.payments array:
    { transactionId: auto-generated, amount: 3000, paidAt: now,
      method: "cash", collectedBy: accountantId }
  → amountPaid += 3000 → now 3000
  → balance = 5000 - 3000 → 2000
  → paymentStatus = "partial" (balance > 0)
          │
          ▼
[If full payment made: paymentStatus = "paid", balance = 0]
          │
          ▼
[Student views updated fee status]
  → GET /api/fees/my
  → Returns: [{ feeTitle, amountDue: 5000, amountPaid: 3000, balance: 2000, status: "partial" }]
```

### Step 3 — Accountant Reports

```
GET /api/fees/reports/daily?date=2024-07-15
→ Aggregates all payments with paidAt = today
→ Returns: { totalCollected, transactionCount, breakdown: [{ method, amount }] }

GET /api/fees/reports/defaulters
→ Returns students where paymentStatus = "pending" AND dueDate < today
→ Includes student name, rollNumber, department, balance, daysOverdue
```

---

## Flow 4: Admission → Student Creation Flow

**Actors:** Applicant (Public), Admin, Admissions Collection, Students Collection, student_auth Collection

### Step 1 — Applicant Submits Form

```
[Applicant visits public admission page (no login required)]
          │
          ▼
POST /api/admissions
Body: {
  applicantName: "Md. Rahim",
  email: "rahim@gmail.com",
  phone: "01700000000",
  dateOfBirth: "2006-03-15",
  gender: "Male",
  desiredDepartmentId: "<id>",
  sscBoard: "Dhaka",
  sscYear: 2024,
  sscGpa: 4.56,
  sscRoll: "123456",
  fatherName: "Md. Karim",
  motherName: "Sufia Begum",
  guardianPhone: "01800000000",
  address: { district: "Dhaka", division: "Dhaka" },
  documents: ["<cloudinary_url_certificate>", "<cloudinary_url_nid>"]
}
          │
          ▼
[Document saved in admissions collection]
[status: "pending"]
[No login account created yet]
          │
          ▼
[Email confirmation sent to applicant]
  "Your application has been received. We will notify you."
```

### Step 2 — Admin Reviews Application

```
[Admin sees pending badge on dashboard]
[Admin navigates to Admissions module]
  → GET /api/admissions?status=pending
          │
          ▼
[Admin views application detail]
  → GET /api/admissions/:id
  → Sees all form data + uploaded documents
          │
          ▼
[Admin makes decision]
```

### Step 3A — Approval Flow

```
PATCH /api/admissions/:id/approve
Body: { batchId: "<id>", session: "2024-25" }
          │
          ▼
[admission.service.js executes atomic transaction:]

  Step 1: Generate studentId (e.g., CST-2024-001)
  Step 2: Create student document:
    {
      studentId: "CST-2024-001",
      fullName: admission.applicantName,
      email: admission.email,
      phone: admission.phone,
      dateOfBirth: admission.dateOfBirth,
      gender: admission.gender,
      departmentId: admission.desiredDepartmentId,
      batchId: payload.batchId,
      currentSemester: 1,
      session: payload.session,
      fatherName: admission.fatherName,
      motherName: admission.motherName,
      guardianPhone: admission.guardianPhone,
      sscBoard: admission.sscBoard,
      sscYear: admission.sscYear,
      sscGpa: admission.sscGpa,
      sscRoll: admission.sscRoll,
      enrollmentDate: today,
      status: "active"
    }
  Step 3: Generate temporary password (random 10 chars)
  Step 4: Hash temporary password (bcrypt cost 12)
  Step 5: Create student_auth document:
    {
      email: admission.email,
      passwordHash: <hashed temp password>,
      studentId: student._id,
      isActive: true
    }
  Step 6: Update admission document:
    { status: "approved", reviewedBy: adminId, reviewedAt: now,
      convertedStudentId: student._id }

  Step 7: Send email to applicant:
    Subject: "Admission Approved — Welcome to DIMS"
    Body: Login credentials (email + temp password) + first-login change password instruction
          │
          ▼
[Response: { success, student: { studentId, name }, message: "Student account created" }]
```

### Step 3B — Rejection Flow

```
PATCH /api/admissions/:id/reject
Body: { reviewRemarks: "GPA below minimum threshold of 3.00" }
          │
          ▼
[admission.service.js:]
  → Update admission: { status: "rejected", reviewRemarks, reviewedBy: adminId, reviewedAt: now }
  → Send rejection email to applicant with reviewRemarks
          │
          ▼
[No student record is created]
```

---

## Flow 5: Notice Publishing and Audience Targeting Flow

```
[Admin creates notice]
  POST /api/notices
  Body: {
    title: "Semester 3 Exam Schedule Released",
    body: "...",
    audience: "students",
    departmentId: "<id>",   ← optional: only CST department students
    priority: "urgent",
    expiresAt: "2024-07-20"
  }
          │
          ▼
[Notice saved in notices collection]
          │
          ▼
[Student logs in and loads dashboard]
  → GET /api/notices
  → Backend filters by:
      entityType from JWT = "student"
      audience IN ["all", "students"]
      If departmentId on notice: student.departmentId must match
      isActive = true
      expiresAt > now OR null
  → Returns filtered notices sorted by createdAt DESC
```

---

## Flow 6: Teacher Account Creation Flow (Admin)

```
[Admin navigates to Teachers module → Add Teacher]
  POST /api/teachers
  Body: {
    fullName: "Md. Anwar Hossain",
    email: "anwar@dims.edu.bd",
    phone: "01711111111",
    designation: "Lecturer",
    qualification: "B.Sc. in CSE",
    departmentId: "<id>",
    joiningDate: "2024-07-01"
  }
          │
          ▼
[teacher.service.js executes:]
  Step 1: Check email is not already in teacher_auth (uniqueness)
  Step 2: Generate employeeId (e.g., TCH-2024-006)
  Step 3: Create teachers document → get teacher._id
  Step 4: Generate temporary password
  Step 5: Hash password
  Step 6: Create teacher_auth document:
    { email, passwordHash, teacherId: teacher._id, isActive: true }
  Step 7: Send welcome email with credentials
          │
          ▼
[Teacher can now log in via POST /api/auth/teacher/login]
[Teacher is prompted to change password on first login]
```

---

## Flow 7: Dashboard Data Aggregation Flow

### Admin Dashboard

```
GET /api/dashboard/admin
          │
          ▼
dashboard.service.js aggregates in parallel:
  → students.countDocuments({ status: "active" })
  → teachers.countDocuments({ status: "active" })
  → departments.countDocuments({ isActive: true })
  → admissions.countDocuments({ status: "pending" })
  → notices.countDocuments({ isActive: true, expiresAt: { $gt: now } })
  → fees.countDocuments({ paymentStatus: { $in: ["pending","partial"] }, dueDate: { $lt: now } })
  → (future) last 10 admin action logs
          │
          ▼
Returns: {
  totalActiveStudents: 324,
  totalActiveTeachers: 42,
  totalDepartments: 8,
  pendingAdmissions: 12,
  activeNotices: 5,
  overdueFeesCount: 45,
  recentActivity: [...]
}
```

### Student Dashboard

```
GET /api/dashboard/student
  (req.entityId = student._id from JWT)
          │
          ▼
dashboard.service.js:
  → Load student profile from students using req.entityId
  → Load attendance summary: aggregate attendances where studentId matches
  → Load published results: results where studentId matches + isPublished = true
  → Load fees: fees where studentId matches
  → Load notices: filtered by entityType + department
          │
          ▼
Returns: {
  student: { name, rollNumber, department, semester },
  attendanceSummary: [{ course, percentage, isAtRisk }],
  recentResults: [{ course, exam, grade, gradePoint }],
  feeStatus: { totalDue, totalPaid, balance, pendingCount },
  notices: [{ title, priority, createdAt }]
}
```

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0.1*
