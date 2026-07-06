import { Router } from "express";

// ── Phase 2: Auth routes ─────────────────────────────────────────────────
import studentAuthRoutes    from "../modules/auth/student/studentAuth.routes.js";
import teacherAuthRoutes    from "../modules/auth/teacher/teacherAuth.routes.js";
import accountantAuthRoutes from "../modules/auth/accountant/accountantAuth.routes.js";
import adminAuthRoutes      from "../modules/auth/admin/adminAuth.routes.js";

// ── Phase 3: Core institute structure routes ──────────────────────────────
import adminRoutes           from "../modules/admins/admin.routes.js";
import departmentRoutes      from "../modules/departments/department.routes.js";
import semesterRoutes        from "../modules/semesters/semester.routes.js";
import academicSessionRoutes from "../modules/academicSessions/academicSession.routes.js";
import courseRoutes          from "../modules/courses/course.routes.js";

// ── Phase 4: Core people modules ─────────────────────────────────────────
import studentRoutes     from "../modules/students/student.routes.js";
import teacherRoutes     from "../modules/teachers/teacher.routes.js";
import accountantRoutes  from "../modules/accountants/accountant.routes.js";

// ── Phase 5: Communication & setup modules ────────────────────────────────────────────────────────
import admissionRoutes         from "../modules/admissions/admission.routes.js";
import noticeRoutes            from "../modules/notices/notice.routes.js";
import instituteSettingsRoutes from "../modules/institute/institute.routes.js";

/**
 * Root API Router — mounts all module routers under /api
 *
 * Phase 2 (Auth):
 *   /api/auth/{student|teacher|accountant|admin}
 *
 * Phase 3 (Core Structure):
 *   /api/admins
 *   /api/departments
 *   /api/semesters
 *   /api/academic-sessions
 *   /api/courses
 *
 * Phase 4+ (Entity & Operations — coming soon):
 *   /api/students | /api/teachers | /api/attendance
 *   /api/results  | /api/fees     | /api/notices
 *   /api/admissions | /api/institute | /api/dashboard
 */
const router = Router();

// ── API Index ──────────────────────────────────────────────────────────────
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DIMS API v1.0 — Phase 4 People Modules Active",
    endpoints: {
      auth:             "/api/auth/{student|teacher|accountant|admin}",
      admins:           "/api/admins",
      departments:      "/api/departments",
      semesters:        "/api/semesters",
      academicSessions: "/api/academic-sessions",
      courses:          "/api/courses",
      students:         "/api/students",
      teachers:         "/api/teachers",
      accountants:      "/api/accountants",
    },
  });
});

// ── Phase 2: Auth ─────────────────────────────────────────────────────────
router.use("/auth/student",    studentAuthRoutes);
router.use("/auth/teacher",    teacherAuthRoutes);
router.use("/auth/accountant", accountantAuthRoutes);
router.use("/auth/admin",      adminAuthRoutes);

// ── Phase 3: Core Institute Structure ─────────────────────────────────────
router.use("/admins",            adminRoutes);
router.use("/departments",       departmentRoutes);
router.use("/semesters",         semesterRoutes);
router.use("/academic-sessions", academicSessionRoutes);
router.use("/courses",           courseRoutes);

// ── Phase 4: Core People Modules ──────────────────────────────────────────
router.use("/students",    studentRoutes);
router.use("/teachers",    teacherRoutes);
router.use("/accountants", accountantRoutes);

// ── Phase 5: Communication & Setup ────────────────────────────────────────
router.use("/admissions",        admissionRoutes);
router.use("/notices",           noticeRoutes);
router.use("/institute-settings", instituteSettingsRoutes);

// ── Phase 6+ (to be mounted in future phases) ─────────────────────────────
// router.use("/attendance",  attendanceRoutes);
// router.use("/results",     resultRoutes);
// router.use("/fees",        feeRoutes);
// router.use("/dashboard",   dashboardRoutes);
// router.use("/upload",      uploadRoutes);

export default router;
