import { Router } from "express";

/**
 * Root API Router
 * Mounts all entity module routers under /api
 *
 * Auth routes:
 *   /api/auth/student
 *   /api/auth/teacher
 *   /api/auth/accountant
 *   /api/auth/admin
 *
 * Entity routes:
 *   /api/students
 *   /api/teachers
 *   /api/accountants
 *   /api/admins
 *   /api/departments  (via institute module)
 *   /api/batches
 *   /api/courses
 *   /api/exams
 *   /api/attendance
 *   /api/results
 *   /api/fees
 *   /api/notices
 *   /api/admissions
 *   /api/institute
 *   /api/dashboard
 *   /api/upload
 */

const router = Router();

// ── Placeholder: routes will be imported here in Phase 2 ─────────────────
// import studentAuthRoutes from "../modules/auth/student/studentAuth.routes.js";
// import teacherAuthRoutes from "../modules/auth/teacher/teacherAuth.routes.js";
// import studentRoutes from "../modules/students/student.routes.js";
// ... etc

// ── Temporary index route ─────────────────────────────────────────────────
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DIMS API v1.0 — Phase 1 Foundation Ready",
    modules: [
      "auth/student", "auth/teacher", "auth/accountant", "auth/admin",
      "students", "teachers", "accountants", "admins",
      "departments", "batches", "courses", "exams",
      "attendance", "results", "fees", "notices",
      "admissions", "institute", "dashboard", "upload",
    ],
  });
});

export default router;
