# Project Overview - Diploma Institute Management System (DIMS)

## 1. Project Purpose

The **Diploma Institute Management System (DIMS)** is a comprehensive web platform designed to streamline, digitize, and unify academic, administrative, and financial operations within a diploma-level educational institution. By providing a single digital directory and dashboard ecosystem, it replaces fragmented spreadsheets, manual paper records, and separate software tools with a single source of truth.

---

## 2. Problem Statement

Diploma institutes in South Asian educational contexts (such as Bangladesh) face recurring operational inefficiencies:

- **Manual Records:** Attendance sheets, academic grading, and student registrations are kept in physical ledgers, exposing them to loss, entry errors, and high processing overheads.
- **Disconnected Data:** Academic records (class assignments, grades) are isolated from administrative registries (enrollments) and accounting offices (fee payments).
- **Communication Latency:** Distributing notice letters and timetable announcements to teachers and students relies on physically pinned papers.
- **Opaque Reporting:** Principal offices and institute administrators have no real-time dashboard visualization for academic status, fee collections, or pending registrations.

DIMS addresses these issues by automating processes, enforcing role-based permissions, and centralizing data in a secure database.

---

## 3. Target Users & Main Modules

DIMS serves four primary groups of users (Admins, Teachers, Students, Accountants). The platform comprises the following core modules:

- 🔐 **Authentication & RBAC:** Stateful credential checking and role-based routing.
- 👨‍🎓 **Registrar Module:** Management of students, departments, teachers, sessions, and academic terms.
- 📅 **Scheduling Module:** Weekly class routines and teacher-subject pairings.
- 📋 **Academic Tracker:** Daily class session attendance logging.
- 📊 **Exam & Grade Registry:** Recording course marks across midterm, final, viva, and assignment exams to calculate GPA.
- 💰 **Billing & Ledger:** Generating payment structures, issuing payments, and generating financial logs.
- 📢 **Bulletins & Notices:** System-wide notice targeting and file attachments.
- 📝 **Admissions Portal:** Online form submission, document validation, and student creation.

---

## 4. User Roles & Features

### 🔑 Admin

The Admin role (typically held by the Institute Principal, Head of Department, or IT Administrator) has system-wide permissions to manage all settings, structures, and profiles.

#### Responsibilities
- System setup, institutional configurations, and academic structures.
- User profile verification and lifecycle management.
- Approving, finalizing, and publishing academic marks.
- Document auditing and financial oversight.

#### Core Features
- **Dashboard & Analytics:** View quick summaries (student/teacher counts, notice statuses) and key notifications (unpaid fees, pending admissions).
- **Institutional Config:** Set up and manage academic semesters, sessions, departments, and course syllabi.
- **Registrar Management:** Create, edit, suspend, or update profiles for students, teachers, and accountants.
- **Admissions Processing:** Audit incoming admission requests, review document uploads, and approve profiles (which auto-creates student logins).
- **Grade Administration:** Review class grade sheets and finalize exam marks to publish GPA records.
- **Global Notices:** Publish global or target-specific notices with attachment support.
- **System Logs:** View system audit logs for administrative actions.

---

### 👨‍🏫 Teacher

The Teacher role represents academic faculty responsible for classroom instructions, student guidance, and initial grade entries.

#### Responsibilities
- Delivering course materials and keeping daily attendance records.
- Evaluating student works and recording initial exam marks.
- Reviewing their assigned class rosters.

#### Core Features
- **Teacher Dashboard:** Check assigned weekly class schedules, course listings, and active notice bulletins.
- **Attendance Logging:** Take class attendance for assigned subjects on a per-session basis (marking students Present, Absent, or Late).
- **Grade Input:** Perform bulk entry and edits of marks (midterm, final, practicals, assignments) for students enrolled in their assigned courses.
- **Student Roster View:** View academic rosters and profiles for students in their classes.

---

### 👨‍🎓 Student

The Student role has read-only access to their own academic history, attendance reports, and billing statements.

#### Responsibilities
- Monitoring personal academic performance.
- Checking notices and class schedule changes.
- Verifying outstanding dues.

#### Core Features
- **Student Dashboard:** View overall attendance percentage, recent grades, and billing alerts.
- **Attendance Tracker:** Review detailed subject-wise attendance logs and monthly summaries.
- **Result Registry:** Inspect published exam scores and letter grades.
- **Financial Ledger:** View history of paid invoices, due structures, and payment receipts.
- **Notice Bulletin:** Access notices targeted at their specific department or the student body as a whole.

---

### 💰 Accountant

The Accountant role manages the financial and collection aspects of the institute.

#### Responsibilities
- Setting up billing categories and payment plans.
- Processing received payments and providing receipts.
- Reviewing unpaid bills and financial collections.

#### Core Features
- **Accountant Dashboard:** View daily/monthly fee collection targets and total outstanding dues.
- **Fee Configuration:** Design specific fee structures for items such as registrations, examinations, and semester programs.
- **Fee Assignment:** Allocate custom billing packages to individual students or entire student sections.
- **Payment Processing:** Record student payments (cash, bank checks) to update their invoice statuses from Pending to Paid.
- **Financial Reports:** Generate daily, weekly, and monthly payment collection reports and export lists of fee defaulters.
