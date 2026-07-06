# 10 — System Workflow

> **Diploma Institute Management System (DIMS)**  
> Document Type: Operational Workflow Documentation

---

## 1. Authentication Workflow

```
[User visits login page]
        │
        ▼
[Enter email + password]
        │
        ▼
[POST /api/auth/login]
        │
   ┌────┴────┐
   │ Valid?  │
   └────┬────┘
      No│              Yes
        ▼               ▼
  [Return 401]    [Generate access token (15m)]
                  [Generate refresh token (7d)]
                  [Store hashed refresh token in DB]
                  [Set refresh token in httpOnly cookie]
                  [Return access token + user data]
                        │
                        ▼
                  [Client stores access token in memory]
                  [Redirect to role-based dashboard]
```

---

## 2. Token Refresh Workflow

```
[Client makes API request]
        │
        ▼
[Access token expired? (401 response)]
        │
        ▼
[Axios interceptor catches 401]
        │
        ▼
[POST /api/auth/refresh (cookie sent automatically)]
        │
   ┌────┴──────┐
   │ Valid?    │
   └────┬──────┘
      No│                Yes
        ▼                 ▼
  [Clear auth state] [Issue new access token]
  [Redirect to login] [Retry original request]
```

---

## 3. Student Onboarding Workflow

```
[Admin creates user account]
  → POST /api/users { role: "student", email, password }
        │
        ▼
[Admin creates student profile]
  → POST /api/students { userId, departmentId, batchId, ... }
        │
        ▼
[System auto-generates rollNumber]
  e.g., CST-2024-001
        │
        ▼
[Student receives login credentials]
  (via email or admin share)
        │
        ▼
[Student logs in → sees own dashboard]
  - Attendance, Results, Fees, Notices
```

---

## 4. Admission Application Workflow

```
[Prospective student visits public admission page]
        │
        ▼
[Fills admission form (no login required)]
  - Name, contact, SSC info, desired department
  - Uploads documents (NID, certificates)
        │
        ▼
[POST /api/admissions]
  - Status set to: "pending"
        │
        ▼
[Admin receives notification / sees pending badge on dashboard]
        │
        ▼
[Admin reviews application]
  - Views documents
  - Makes decision
        │
   ┌────┴──────────┐
Approved           Rejected
   │                   │
   ▼                   ▼
[PATCH /api/admissions/:id/approve]   [PATCH /api/admissions/:id/reject]
   │                                      │
   ▼                                      ▼
[System auto-creates]              [Applicant notified by email]
  - user record (role: student)    [Application status = rejected]
  - student profile
  - assigns to department/batch
        │
        ▼
[Applicant receives login credentials by email]
[Admission status = approved]
```

---

## 5. Attendance Recording Workflow

```
[Teacher logs in → navigates to Attendance]
        │
        ▼
[Selects course + date]
        │
        ▼
[System loads student roster for that course]
        │
        ▼
[Teacher marks each student: Present / Absent / Late]
        │
        ▼
[POST /api/attendance]
  { courseId, date, records: [{studentId, status}...] }
        │
        ▼
[System saves attendance records]
[System updates attendance percentage per student per course]
        │
        ▼
[Students can view own attendance on dashboard]
[Admin can view full reports and flag low-attendance students]
```

---

## 6. Result Entry & Publishing Workflow

```
[Teacher logs in → navigates to Results]
        │
        ▼
[Selects course + semester + exam type]
        │
        ▼
[System loads enrolled student list]
        │
        ▼
[Teacher enters marks for each student]
        │
        ▼
[POST /api/results]
  { studentId, courseId, semester, examType, marksObtained, totalMarks }
        │
        ▼
[System calculates grade + grade point automatically]
[Results saved with isPublished = false]
        │
        ▼
[Admin reviews result entries]
        │
        ▼
[Admin approves and publishes results]
  → PATCH /api/results/publish { courseId, semester, examType }
        │
        ▼
[isPublished = true, publishedAt = now, publishedBy = adminId]
        │
        ▼
[Students can now view their published results]
[Optional: Push notification sent to students]
```

---

## 7. Fee Management Workflow

```
[Admin / Accountant defines fee structure]
  → POST /api/fee-structures
  { title, feeType, amount, dueDate, departmentId, semester }
        │
        ▼
[Accountant assigns fee to students]
  → POST /api/fees/assign
  { feeStructureId, studentIds[] OR auto: by department/semester }
        │
        ▼
[Fee records created per student]
  { studentId, feeStructureId, amountDue, paymentStatus: "pending" }
        │
        ▼
[Student views fee on dashboard]
        │
        ▼
[Student pays (cash/bank)]
        │
        ▼
[Accountant records payment]
  → POST /api/fees/:id/payment
  { amount, method, receiptNumber, date }
        │
        ▼
[Payment added to fee.payments array]
[paymentStatus updated: pending → partial → paid]
        │
        ▼
[Student and admin see updated status]
[Accountant can generate daily collection report]
```

---

## 8. Notice Publishing Workflow

```
[Admin creates notice]
  → POST /api/notices
  { title, body, audience, departmentId?, expiresAt?, attachments? }
        │
        ▼
[Notice saved with isActive = true]
        │
        ▼
[Users with matching audience see notice on dashboard]
  - audience: "all" → all logged-in users
  - audience: "teachers" → only teacher role
  - audience: "students" → only student role
  - audience: "department" → students/teachers in that department
        │
        ▼
[Notice auto-deactivated after expiresAt (or manually deleted)]
```

---

## 9. Data Flow Between Modules

```
admissions ──(on approval)──→ users + students
                                    │
                    ┌───────────────┼────────────────┐
                    ▼               ▼                ▼
              attendance         results            fees
                    │               │                │
                    └───────────────┴────────────────┘
                                    │
                              dashboard (admin)
                              (aggregates from all modules)
```

---

## 10. Daily Operational Flow (Typical)

| Time | Who | Action |
|---|---|---|
| Morning | Teacher | Login → Take attendance for each class |
| Afternoon | Teacher | Enter marks for completed exams |
| Anytime | Admin | Review pending admissions |
| Anytime | Accountant | Record fee payments as they come in |
| Weekly | Admin | Publish approved results |
| Monthly | Admin | Review attendance reports, flag defaulters |
| Monthly | Accountant | Generate fee collection summary |
| Occasionally | Admin | Post notices and announcements |

---

*Document maintained by: Architecture Team*  
*Last updated: Phase 0*
