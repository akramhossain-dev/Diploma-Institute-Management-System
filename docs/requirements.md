# 01 — System Requirements

> **Diploma Institute Management System (DIMS)**  
> Document Type: Requirements Specification

---

## 1. Functional Requirements

### 1.1 Authentication & Authorization

| ID | Requirement |
|---|---|
| FR-AUTH-01 | The system SHALL allow users to register with email and password |
| FR-AUTH-02 | The system SHALL authenticate users via JWT tokens |
| FR-AUTH-03 | The system SHALL support role-based access (Admin, Teacher, Student, Accountant, Employee) |
| FR-AUTH-04 | The system SHALL allow admins to create, deactivate, and manage user accounts |
| FR-AUTH-05 | The system SHALL enforce password hashing using bcrypt |
| FR-AUTH-06 | The system SHALL support token refresh mechanism |
| FR-AUTH-07 | The system SHALL log all authentication events |

---

### 1.2 Student Management

| ID | Requirement |
|---|---|
| FR-STU-01 | The system SHALL allow admins to register new students |
| FR-STU-02 | The system SHALL store student profile: name, email, phone, photo, address, guardian info |
| FR-STU-03 | The system SHALL assign students to departments, batches, and semesters |
| FR-STU-04 | The system SHALL allow student profile updates by admins |
| FR-STU-05 | The system SHALL allow students to view their own profile |
| FR-STU-06 | The system SHALL support student status: Active, Suspended, Graduated, Dropped |
| FR-STU-07 | The system SHALL generate a unique student ID (roll number) |

---

### 1.3 Teacher Management

| ID | Requirement |
|---|---|
| FR-TCH-01 | The system SHALL allow admins to register and manage teacher profiles |
| FR-TCH-02 | The system SHALL store teacher info: name, email, designation, department, joining date |
| FR-TCH-03 | The system SHALL assign teachers to departments and subjects/courses |
| FR-TCH-04 | The system SHALL allow teachers to view their assigned courses |
| FR-TCH-05 | The system SHALL support teacher status: Active, On Leave, Resigned |

---

### 1.4 Department & Course Management

| ID | Requirement |
|---|---|
| FR-DEPT-01 | The system SHALL allow admins to create and manage departments |
| FR-DEPT-02 | The system SHALL allow admins to create and manage courses/subjects per department |
| FR-DEPT-03 | The system SHALL support semester/year structure per department |
| FR-DEPT-04 | The system SHALL allow courses to be assigned to specific batches and semesters |

---

### 1.5 Attendance Management

| ID | Requirement |
|---|---|
| FR-ATT-01 | Teachers SHALL be able to take attendance per class session |
| FR-ATT-02 | Attendance SHALL be recorded per student, per subject, per date |
| FR-ATT-03 | The system SHALL calculate attendance percentage per student per subject |
| FR-ATT-04 | Students SHALL view their own attendance records |
| FR-ATT-05 | Admins SHALL view attendance reports for any student, class, or date range |
| FR-ATT-06 | The system SHALL flag students with attendance below a configurable threshold |

---

### 1.6 Result Management

| ID | Requirement |
|---|---|
| FR-RES-01 | Teachers SHALL enter marks for each student per subject per exam |
| FR-RES-02 | The system SHALL support exam types: Midterm, Final, Viva, Practical, Assignment |
| FR-RES-03 | The system SHALL automatically calculate GPA/grade based on configurable grading rules |
| FR-RES-04 | Admins SHALL approve and publish results |
| FR-RES-05 | Students SHALL view their published results only |
| FR-RES-06 | The system SHALL generate semester result summaries per student |
| FR-RES-07 | The system SHALL prevent duplicate mark entries for same student/exam/subject |

---

### 1.7 Fee Management

| ID | Requirement |
|---|---|
| FR-FEE-01 | Admins/Accountants SHALL define fee structures per semester/department |
| FR-FEE-02 | The system SHALL assign fees to eligible students automatically |
| FR-FEE-03 | Accountants SHALL record manual fee payments with receipt number |
| FR-FEE-04 | The system SHALL track payment status: Pending, Partial, Paid |
| FR-FEE-05 | Students SHALL view their own fee dues and payment history |
| FR-FEE-06 | The system SHALL generate fee receipts (PDF-ready) |
| FR-FEE-07 | Admins SHALL view fee collection reports by date, department, or student |

---

### 1.8 Notice & Announcement Management

| ID | Requirement |
|---|---|
| FR-NOT-01 | Admins SHALL create, edit, and delete notices/announcements |
| FR-NOT-02 | Notices SHALL be targetable: All, Teachers, Students, Department-specific |
| FR-NOT-03 | All authorized users SHALL view active notices on their dashboard |
| FR-NOT-04 | Notices SHALL support file attachments (PDF, images) |
| FR-NOT-05 | Notices SHALL be sorted by creation date with expiry date support |

---

### 1.9 Admission Management

| ID | Requirement |
|---|---|
| FR-ADM-01 | Prospective students SHALL submit online admission requests |
| FR-ADM-02 | The system SHALL store applicant details and document uploads |
| FR-ADM-03 | Admins SHALL review, approve, or reject admission requests |
| FR-ADM-04 | On approval, the system SHALL convert applicant to student automatically |
| FR-ADM-05 | Applicants SHALL receive email notifications on status change |

---

### 1.10 Admin Dashboard & Analytics

| ID | Requirement |
|---|---|
| FR-DASH-01 | Admin SHALL see total counts: students, teachers, departments, active notices |
| FR-DASH-02 | Admin SHALL view pending admissions, unpaid fees, low-attendance alerts |
| FR-DASH-03 | Admin SHALL access quick links to all management modules |
| FR-DASH-04 | Charts/graphs SHALL display enrollment trends, fee collection, attendance rates |

---

## 2. Non-Functional Requirements

### 2.1 Security

| ID | Requirement |
|---|---|
| NFR-SEC-01 | All API endpoints SHALL require valid JWT tokens (except public auth routes) |
| NFR-SEC-02 | Passwords SHALL be hashed with bcrypt (min cost factor: 12) |
| NFR-SEC-03 | Role-based middleware SHALL protect all sensitive routes |
| NFR-SEC-04 | All inputs SHALL be sanitized and validated server-side |
| NFR-SEC-05 | API rate limiting SHALL be enforced (100 requests/15 min per IP) |
| NFR-SEC-06 | HTTPS SHALL be enforced in production |
| NFR-SEC-07 | Sensitive env variables SHALL never be exposed client-side |
| NFR-SEC-08 | File uploads SHALL be validated for type and size (max 5MB) |

---

### 2.2 Performance

| ID | Requirement |
|---|---|
| NFR-PERF-01 | API response time SHALL be < 300ms for standard queries under normal load |
| NFR-PERF-02 | Database queries SHALL use indexing on frequently filtered fields |
| NFR-PERF-03 | Images SHALL be served via CDN (Cloudinary) |
| NFR-PERF-04 | Frontend SHALL achieve Lighthouse score > 85 on Performance |
| NFR-PERF-05 | Pagination SHALL be implemented for all list endpoints (default: 20 per page) |

---

### 2.3 Scalability

| ID | Requirement |
|---|---|
| NFR-SCALE-01 | The architecture SHALL support horizontal scaling of the backend |
| NFR-SCALE-02 | MongoDB Atlas SHALL be used for managed, scalable database hosting |
| NFR-SCALE-03 | Stateless JWT auth SHALL allow multi-instance deployments |
| NFR-SCALE-04 | The system SHALL support multi-department and multi-batch configurations |

---

### 2.4 Reliability & Availability

| ID | Requirement |
|---|---|
| NFR-REL-01 | Target system uptime: 99.5% |
| NFR-REL-02 | All API errors SHALL return structured JSON error responses |
| NFR-REL-03 | Database operations SHALL use transactions for critical multi-step writes |
| NFR-REL-04 | Automated database backups SHALL be configured on MongoDB Atlas |

---

### 2.5 Maintainability

| ID | Requirement |
|---|---|
| NFR-MAIN-01 | Codebase SHALL follow modular architecture (feature-based separation) |
| NFR-MAIN-02 | All API routes SHALL be documented |
| NFR-MAIN-03 | Environment configuration SHALL use `.env` files with clear naming |
| NFR-MAIN-04 | Code SHALL follow consistent naming conventions (see `13-naming-conventions.md`) |

---

### 2.6 Usability

| ID | Requirement |
|---|---|
| NFR-USE-01 | UI SHALL be fully responsive across mobile, tablet, and desktop |
| NFR-USE-02 | UI SHALL support dark mode |
| NFR-USE-03 | User feedback SHALL be provided for all async actions (loading, success, error states) |
| NFR-USE-04 | Forms SHALL show inline validation errors |

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0*
