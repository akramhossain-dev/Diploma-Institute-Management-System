import { Router } from "express";
import { param } from "express-validator";

import attendanceController from "./attendance.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import validateStudentOwnership from "../../middlewares/validateStudentOwnership.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import {
  createSessionValidation,
  updateSessionRecordsValidation,
  attendanceQueryValidation,
} from "./attendance.validation.js";

const router = Router();

const validateSessionId = [
  param("id").isMongoId().withMessage("Invalid session ID"),
  handleValidationErrors,
];

const validateStudentId = [
  param("studentId").isMongoId().withMessage("Invalid student ID"),
  handleValidationErrors,
];

// ── Attendance Sessions ────────────────────────────────────────────────────
// POST /api/attendance/sessions — teacher or admin marks attendance
router.post(
  "/sessions",
  authenticate,
  authorizeEntity("teacher", "admin"),
  createSessionValidation,
  handleValidationErrors,
  attendanceController.createSession
);

// GET /api/attendance/sessions — admin and teacher list sessions
router.get(
  "/sessions",
  authenticate,
  authorizeEntity("admin", "teacher"),
  attendanceQueryValidation,
  handleValidationErrors,
  attendanceController.getAllSessions
);

// GET /api/attendance/sessions/:id — with all student records
router.get(
  "/sessions/:id",
  authenticate,
  authorizeEntity("admin", "teacher"),
  validateSessionId,
  attendanceController.getSessionById
);

// PATCH /api/attendance/sessions/:id — correct records (open sessions only)
router.patch(
  "/sessions/:id",
  authenticate,
  authorizeEntity("teacher", "admin"),
  validateSessionId,
  updateSessionRecordsValidation,
  handleValidationErrors,
  attendanceController.updateSession
);

// PATCH /api/attendance/sessions/:id/finalize — lock session permanently
router.patch(
  "/sessions/:id/finalize",
  authenticate,
  authorizeEntity("teacher", "admin"),
  validateSessionId,
  attendanceController.finalizeSession
);

// ── Student-specific endpoints ─────────────────────────────────────────────
// GET /api/attendance/students/:studentId — student or admin fetches records
router.get(
  "/students/:studentId",
  authenticate,
  authorizeEntity("admin", "teacher", "student"),
  validateStudentId,
  validateStudentOwnership("studentId"),
  attendanceQueryValidation,
  handleValidationErrors,
  attendanceController.getStudentAttendance
);

// GET /api/attendance/summary/students/:studentId — percentage per course
router.get(
  "/summary/students/:studentId",
  authenticate,
  authorizeEntity("admin", "teacher", "student"),
  validateStudentId,
  validateStudentOwnership("studentId"),
  attendanceController.getStudentSummary
);

export default router;
