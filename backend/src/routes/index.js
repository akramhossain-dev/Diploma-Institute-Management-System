import { Router } from "express";

import studentAuthRoutes    from "../modules/auth/student/studentAuth.routes.js";
import teacherAuthRoutes    from "../modules/auth/teacher/teacherAuth.routes.js";
import accountantAuthRoutes from "../modules/auth/accountant/accountantAuth.routes.js";
import adminAuthRoutes      from "../modules/auth/admin/adminAuth.routes.js";

import adminRoutes           from "../modules/admins/admin.routes.js";
import departmentRoutes      from "../modules/departments/department.routes.js";
import semesterRoutes        from "../modules/semesters/semester.routes.js";
import academicSessionRoutes from "../modules/academicSessions/academicSession.routes.js";
import courseRoutes          from "../modules/courses/course.routes.js";
import batchRoutes           from "../modules/batches/batch.routes.js";

import studentRoutes     from "../modules/students/student.routes.js";
import teacherRoutes     from "../modules/teachers/teacher.routes.js";
import accountantRoutes  from "../modules/accountants/accountant.routes.js";

import admissionRoutes         from "../modules/admissions/admission.routes.js";
import noticeRoutes            from "../modules/notices/notice.routes.js";
import instituteSettingsRoutes from "../modules/institute/institute.routes.js";

import teacherAssignmentRoutes from "../modules/teacherAssignments/teacherAssignment.routes.js";
import classRoutineRoutes      from "../modules/classRoutines/classRoutine.routes.js";
import attendanceRoutes        from "../modules/attendance/attendance.routes.js";

import examRoutes               from "../modules/exams/exam.routes.js";
import examCourseMappingRoutes  from "../modules/examCourseMappings/examCourseMapping.routes.js";
import markRoutes               from "../modules/marks/mark.routes.js";
import resultRoutes             from "../modules/results/result.routes.js";

import feeStructureRoutes          from "../modules/feeStructures/feeStructure.routes.js";
import studentFeeAssignmentRoutes  from "../modules/studentFeeAssignments/studentFeeAssignment.routes.js";
import paymentRoutes               from "../modules/payments/payment.routes.js";

import dashboardRoutes  from "../modules/dashboard/dashboard.routes.js";
import reportRoutes     from "../modules/reports/report.routes.js";
import analyticsRoutes  from "../modules/analytics/analytics.routes.js";
import meRoutes         from "../modules/me/me.routes.js";

import notificationRoutes from "../modules/notifications/notification.routes.js";
import auditLogRoutes     from "../modules/auditLogs/auditLog.routes.js";
import fileRoutes         from "../modules/files/file.routes.js";
import importExportRoutes from "../modules/importExport/importExport.routes.js";
import feeRoutes          from "../modules/fees/fee.routes.js";

const router = Router();

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

router.use("/auth/student",    studentAuthRoutes);
router.use("/auth/teacher",    teacherAuthRoutes);
router.use("/auth/accountant", accountantAuthRoutes);
router.use("/auth/admin",      adminAuthRoutes);

router.use("/admins",            adminRoutes);
router.use("/departments",       departmentRoutes);
router.use("/semesters",         semesterRoutes);
router.use("/academic-sessions", academicSessionRoutes);
router.use("/courses",           courseRoutes);
router.use("/batches",           batchRoutes);

router.use("/students",    studentRoutes);
router.use("/teachers",    teacherRoutes);
router.use("/accountants", accountantRoutes);

router.use("/admissions",        admissionRoutes);
router.use("/notices",           noticeRoutes);
router.use("/institute-settings", instituteSettingsRoutes);

router.use("/teacher-assignments", teacherAssignmentRoutes);
router.use("/class-routines",      classRoutineRoutes);
router.use("/attendance",          attendanceRoutes);

router.use("/exams",                examRoutes);
router.use("/exam-course-mappings", examCourseMappingRoutes);
router.use("/marks",                markRoutes);
router.use("/results",              resultRoutes);

router.use("/fee-structures",          feeStructureRoutes);
router.use("/student-fee-assignments", studentFeeAssignmentRoutes);
router.use("/payments",               paymentRoutes);

router.use("/dashboard",  dashboardRoutes);
router.use("/reports",    reportRoutes);
router.use("/analytics",  analyticsRoutes);
router.use("/me",         meRoutes);

router.use("/notifications", notificationRoutes);
router.use("/audit-logs",    auditLogRoutes);
router.use("/files",         fileRoutes);
router.use("/import-export", importExportRoutes);
router.use("/fees",          feeRoutes);

export default router;
