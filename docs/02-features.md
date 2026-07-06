# 02 — Feature Specification

> **Diploma Institute Management System (DIMS)**  
> Document Type: Feature List & MVP Definition

---

## 1. Module Overview

| # | Module | MVP | Advanced |
|---|---|---|---|
| 1 | Authentication & RBAC | ✅ | — |
| 2 | Student Management | ✅ | ✅ |
| 3 | Teacher Management | ✅ | ✅ |
| 4 | Department & Course Management | ✅ | ✅ |
| 5 | Attendance Management | ✅ | ✅ |
| 6 | Result Management | ✅ | ✅ |
| 7 | Fee Management | ✅ | ✅ |
| 8 | Notice & Announcements | ✅ | ✅ |
| 9 | Admission Management | ✅ | ✅ |
| 10 | Admin Dashboard & Analytics | ✅ | ✅ |
| 11 | Notification System | — | ✅ |
| 12 | Timetable / Scheduling | — | ✅ |
| 13 | Bulk Import/Export | — | ✅ |
| 14 | Parent/Guardian Portal | — | ✅ |
| 15 | Audit Logs | — | ✅ |
| 16 | ID Card Generation | — | ✅ |

---

## 2. MVP Features (Phase 1–3)

### 🔐 Module 1: Authentication & RBAC

- User login with email + password
- JWT access tokens (short expiry) + refresh tokens
- Role assignment on user creation (Admin, Teacher, Student, Accountant, Employee)
- Password hashing with bcrypt
- Protected route middleware per role
- Logout and token invalidation

---

### 👨‍🎓 Module 2: Student Management

**MVP:**
- Create student account (admin-only)
- Student profile: name, photo, email, phone, address, guardian info, roll number
- Assign student to department, batch, and semester
- View all students (paginated, searchable, filterable)
- View single student profile
- Update student info
- Deactivate/reactivate student account
- Student status management (Active, Suspended, Graduated, Dropped)

**Advanced (Phase 4+):**
- Student ID card generation (PDF)
- Academic transcript generation
- Bulk student CSV import
- Parent/guardian portal link

---

### 👨‍🏫 Module 3: Teacher Management

**MVP:**
- Create teacher account (admin-only)
- Teacher profile: name, photo, email, designation, department, joining date, qualification
- Assign teacher to department and courses
- View/update teacher profiles
- Teacher status: Active, On Leave, Resigned

**Advanced:**
- Teacher performance analytics
- Leave request management
- Payroll integration stub

---

### 🏫 Module 4: Department & Course Management

**MVP:**
- Create and manage departments (name, code, head teacher)
- Create and manage courses/subjects (name, code, credit hours, department, semester)
- Assign courses to batches and semesters
- Manage batch records (year, semester, department)

**Advanced:**
- Multi-shift support
- Elective course configuration
- Prerequisites mapping

---

### 📋 Module 5: Attendance Management

**MVP:**
- Teachers take attendance per session: student list → Present / Absent / Late
- Attendance stored per student, subject, date, and teacher
- Auto-calculate attendance percentage per subject per student
- Student views own attendance
- Admin views any student/class attendance
- Date-range filter and export (CSV) — *basic*

**Advanced:**
- Bulk attendance correction workflow
- Low-attendance automated email alert
- Monthly attendance report PDF
- Biometric device integration stub

---

### 📊 Module 6: Result Management

**MVP:**
- Teachers enter marks per student, per subject, per exam type
- Exam types: Midterm, Final, Viva, Practical, Assignment
- Configurable grading scale (GPA, letter grades)
- Auto-calculate total marks and grade
- Admin approves and publishes results
- Students view published results only
- Semester result summary per student

**Advanced:**
- BTEB-standard result sheet generation (PDF)
- Grade improvement tracking
- Failed subject carry-forward logic
- Class rank/position calculation

---

### 💰 Module 7: Fee Management

**MVP:**
- Admin/Accountant defines fee structures (admission, semester, exam, misc)
- Auto-assign fees to students by semester/department
- Record manual payments (cash/bank) with receipt number
- Payment status: Pending, Partial, Paid
- Student views own fee dues and history
- Accountant views daily/monthly collection summary

**Advanced:**
- Online payment gateway (SSLCommerz / bKash)
- Automated due date reminders (email/SMS)
- Discount/waiver management
- PDF receipt generation
- Fee defaulter reports

---

### 📢 Module 8: Notice & Announcements

**MVP:**
- Admin creates notices with title, body, attachment, expiry date
- Audience targeting: All / Teachers / Students / Department
- Notices visible on dashboard by role
- Notices sorted by date, filterable by status (active/expired)
- Admin edit and delete notices

**Advanced:**
- Push notification on new notice (Socket.io)
- Email broadcast of notices
- Notice read/acknowledgment tracking

---

### 📝 Module 9: Admission Management

**MVP:**
- Public admission form (no login required)
- Fields: name, email, phone, SSC info, desired department, document upload
- Admin views all admission requests (paginated)
- Admin approves or rejects with remarks
- On approval: auto-create student record
- Status email notification to applicant (basic)

**Advanced:**
- Merit list generation
- Interview scheduling module
- Document verification workflow
- Admission season configuration (open/closed)

---

### 📈 Module 10: Admin Dashboard & Analytics

**MVP:**
- Summary cards: total students, teachers, departments, active notices
- Alerts: pending admissions, due fees, low-attendance students
- Quick navigation to all modules
- Recent activity feed (last 10 actions)

**Advanced:**
- Charts: enrollment trends, fee collection by month, attendance heatmaps
- Department-wise analytics
- Exportable dashboard reports
- Role-specific dashboard variants

---

## 3. Advanced Features (Phase 4+)

### 🔔 Module 11: Notification System
- Real-time in-app notifications (Socket.io)
- Email notifications (Nodemailer / SendGrid)
- Notification preferences per user
- Notification history

### 🗓 Module 12: Timetable & Scheduling
- Weekly class schedule per department and batch
- Teacher schedule view
- Conflict detection on schedule creation
- Exam schedule management

### 📦 Module 13: Bulk Import / Export
- CSV/Excel import for students, teachers, marks
- Export attendance reports, result sheets, fee reports
- Template download for bulk imports

### 👨‍👩‍👧 Module 14: Parent/Guardian Portal
- Separate login for parents
- View child's attendance, results, fee status
- Receive notices and alerts

### 🛡 Module 15: Audit Logs
- System-level logging of all create/update/delete actions
- Who did what and when
- Filterable by user, module, date range

### 🪪 Module 16: ID Card Generation
- Student and teacher ID card template
- PDF export with photo, name, roll, department
- QR code for verification

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0*
