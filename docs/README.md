# Diploma Institute Management System (DIMS)

The **Diploma Institute Management System (DIMS)** is a modern, production-grade, role-based school management platform designed specifically for diploma-level educational institutes. It provides a centralized digital ecosystem for administrative, academic, financial, and student operations, eliminating paper-based registries and siloed spreadsheets.

---

## 📖 Documentation Index

For detailed instructions and design specifications, please refer to the following guides:

1. 🎯 **[Project Overview](./PROJECT_OVERVIEW.md)**  
   Learn about the core purpose of DIMS, target audience, key modules, and user roles.
2. 🏗️ **[System Architecture](./SYSTEM_ARCHITECTURE.md)**  
   Inspect the system topology, entity-relationship diagrams, folder organization, and authentication/authorization workflows.
3. ⚙️ **[Setup Guide](./SETUP_GUIDE.md)**  
   Find requirements, configuration keys, and step-by-step instructions for local development and production deployments.
4. 🔌 **[API Documentation](./API_DOCUMENTATION.md)**  
   Browse the REST API endpoint specification, including request formats, response envelopes, error codes, and permission rules.
5. 💻 **[Development Guide](./DEVELOPMENT_GUIDE.md)**  
   Read our coding standards, naming conventions, directory guidelines, and branch/commit workflows.

---

## ✨ Core Features

- 🔐 **Stateless Multi-Role Auth:** Individual secure login portals for Admins, Teachers, Students, and Accountants utilizing JWTs and httpOnly cookies.
- 👨‍🎓 **Comprehensive Academics:** Dynamic management of departments, semesters, academic sessions, courses, routine configurations, and class enrollments.
- 📋 **Session-based Attendance:** Subject-wise daily attendance marking for teachers with student-specific monthly percentage calculations.
- 📊 **Exam & Result Engine:** Grade sheet generation following standard GPA systems with midterm, final, practical, and assignment mark processing.
- 💰 **Finance & Fee Ledger:** Custom student fee structures, partial/full payment tracking, cash/bank receipt entries, and daily financial auditing.
- 📢 **Targeted noticeboards:** Global or role-specific announcement banners with Cloudinary file attachments.
- 📝 **Admissions Pipeline:** Public applicant portal for document verification and approval workflows that auto-provision student accounts.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **State Management:** Zustand (v5)
- **Data Fetching:** TanStack React Query (v5)
- **Styling:** Tailwind CSS (v4) + shadcn/ui (Radix primitives)
- **Form Handling:** React Hook Form + Zod

### Backend
- **Framework:** Express.js (ESModules)
- **Runtime:** Node.js (>=18.0.0)
- **Database:** MongoDB (using Mongoose ODM)
- **Security:** Helmet, CORS, Express Rate Limit
- **Utilities:** Winston (structured logging), Nodemailer (emails), Multer (file upload parsing)
- **Storage CDN:** Cloudinary

---

## 👥 System Roles

DIMS defines four primary interactive roles:
1. **Admin:** System owners and principal offices with complete system-wide read/write scopes.
2. **Teacher:** Academic instructors who take attendance, input exam marks, and manage classroom routines.
3. **Student:** Academic consumers who view profiles, review attendance sheets, view published grades, and inspect outstanding fee ledgers.
4. **Accountant:** Financial officers managing fee structures, receiving payments, and auditing collections.
