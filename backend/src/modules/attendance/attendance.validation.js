import { body, param, query } from "express-validator";

// ── Create session + bulk attendance ──────────────────────────────────────
export const createSessionValidation = [
  body("courseId")
    .notEmpty().withMessage("Course is required")
    .isMongoId().withMessage("courseId must be a valid ID"),

  body("teacherId")
    .notEmpty().withMessage("Teacher is required")
    .isMongoId().withMessage("teacherId must be a valid ID"),

  body("departmentId")
    .notEmpty().withMessage("Department is required")
    .isMongoId().withMessage("departmentId must be a valid ID"),

  body("semesterId")
    .notEmpty().withMessage("Semester is required")
    .isMongoId().withMessage("semesterId must be a valid ID"),

  body("academicSessionId")
    .notEmpty().withMessage("Academic session is required")
    .isMongoId().withMessage("academicSessionId must be a valid ID"),

  body("attendanceDate")
    .notEmpty().withMessage("Attendance date is required")
    .isISO8601().withMessage("attendanceDate must be a valid date")
    .toDate(),

  body("section").optional({ checkFalsy: true }).trim(),
  body("topic").optional({ checkFalsy: true }).trim(),

  body("teacherAssignmentId").optional({ checkFalsy: true }).isMongoId(),
  body("classRoutineId").optional({ checkFalsy: true }).isMongoId(),

  // Bulk attendance records — array of { studentId, status, remarks }
  body("records")
    .notEmpty().withMessage("Attendance records are required")
    .isArray({ min: 1 }).withMessage("records must be a non-empty array"),

  body("records.*.studentId")
    .notEmpty().withMessage("Each record must have a studentId")
    .isMongoId().withMessage("Each studentId must be a valid ID"),

  body("records.*.status")
    .notEmpty().withMessage("Each record must have a status")
    .isIn(["present", "absent", "late", "excused"])
    .withMessage("status must be: present, absent, late, or excused"),

  body("records.*.remarks")
    .optional({ checkFalsy: true }).trim(),
];

// ── Update records (correction flow) ─────────────────────────────────────
export const updateSessionRecordsValidation = [
  body("records")
    .notEmpty().withMessage("Records array is required")
    .isArray({ min: 1 }),

  body("records.*.studentId")
    .notEmpty().isMongoId().withMessage("Valid studentId required"),

  body("records.*.status")
    .notEmpty()
    .isIn(["present", "absent", "late", "excused"])
    .withMessage("status must be: present, absent, late, or excused"),

  body("records.*.remarks").optional({ checkFalsy: true }).trim(),
];

// ── Query filters ─────────────────────────────────────────────────────────
export const attendanceQueryValidation = [
  query("fromDate")
    .optional({ checkFalsy: true })
    .isISO8601().withMessage("fromDate must be a valid date").toDate(),

  query("toDate")
    .optional({ checkFalsy: true })
    .isISO8601().withMessage("toDate must be a valid date").toDate(),
];
