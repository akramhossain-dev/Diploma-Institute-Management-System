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
import batchRoutes           from "../modules/batches/batch.routes.js";

// ── Phase 4: Core people modules ─────────────────────────────────────────
import studentRoutes     from "../modules/students/student.routes.js";
import teacherRoutes     from "../modules/teachers/teacher.routes.js";
import accountantRoutes  from "../modules/accountants/accountant.routes.js";

// ── Phase 5: Communication & setup modules ────────────────────────────────────────────────────────
import admissionRoutes         from "../modules/admissions/admission.routes.js";
import noticeRoutes            from "../modules/notices/notice.routes.js";
import instituteSettingsRoutes from "../modules/institute/institute.routes.js";

// ── Phase 6: Academic operations modules ────────────────────────────────────────────────────────
import teacherAssignmentRoutes from "../modules/teacherAssignments/teacherAssignment.routes.js";
import classRoutineRoutes      from "../modules/classRoutines/classRoutine.routes.js";
import attendanceRoutes        from "../modules/attendance/attendance.routes.js";

// ── Phase 7: Examination & result modules ────────────────────────────────────────────────────────
import examRoutes               from "../modules/exams/exam.routes.js";
import examCourseMappingRoutes  from "../modules/examCourseMappings/examCourseMapping.routes.js";
import markRoutes               from "../modules/marks/mark.routes.js";
import resultRoutes             from "../modules/results/result.routes.js";

// ── Phase 8: Finance modules ────────────────────────────────────────────────────────
import feeStructureRoutes          from "../modules/feeStructures/feeStructure.routes.js";
import studentFeeAssignmentRoutes  from "../modules/studentFeeAssignments/studentFeeAssignment.routes.js";
import paymentRoutes               from "../modules/payments/payment.routes.js";

// ── Phase 9: Dashboard, Reports, Analytics, Self-service ──────────────────────────
import dashboardRoutes  from "../modules/dashboard/dashboard.routes.js";
import reportRoutes     from "../modules/reports/report.routes.js";
import analyticsRoutes  from "../modules/analytics/analytics.routes.js";
import meRoutes         from "../modules/me/me.routes.js";

// ── Phase 10: Notifications & Audit Logs ──────────────────────────────────────────
import notificationRoutes from "../modules/notifications/notification.routes.js";
import auditLogRoutes     from "../modules/auditLogs/auditLog.routes.js";
import fileRoutes         from "../modules/files/file.routes.js";
import importExportRoutes from "../modules/importExport/importExport.routes.js";

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
router.use("/batches",           batchRoutes);

// ── Phase 4: Core People Modules ──────────────────────────────────────────
router.use("/students",    studentRoutes);
router.use("/teachers",    teacherRoutes);
router.use("/accountants", accountantRoutes);

// ── Phase 5: Communication & Setup ────────────────────────────────────────
router.use("/admissions",        admissionRoutes);
router.use("/notices",           noticeRoutes);
router.use("/institute-settings", instituteSettingsRoutes);

// ── Phase 6: Academic Operations ──────────────────────────────────────────
router.use("/teacher-assignments", teacherAssignmentRoutes);
router.use("/class-routines",      classRoutineRoutes);
router.use("/attendance",          attendanceRoutes);

// ── Phase 7: Examination & Result Processing ──────────────────────────────
router.use("/exams",                examRoutes);
router.use("/exam-course-mappings", examCourseMappingRoutes);
router.use("/marks",                markRoutes);
router.use("/results",              resultRoutes);

// ── Phase 8: Finance ────────────────────────────────────────────────────────
router.use("/fee-structures",          feeStructureRoutes);
router.use("/student-fee-assignments", studentFeeAssignmentRoutes);
router.use("/payments",               paymentRoutes);

// ── Phase 9: Dashboard, Reports, Analytics, Self-service ──────────────────
router.use("/dashboard",  dashboardRoutes);
router.use("/reports",    reportRoutes);
router.use("/analytics",  analyticsRoutes);
router.use("/me",         meRoutes);

// ── Phase 10: Notifications & Audit Logs ──────────────────────────────────
router.use("/notifications", notificationRoutes);
router.use("/audit-logs",    auditLogRoutes);
router.use("/files",         fileRoutes);
router.use("/import-export", importExportRoutes);

export default router;
