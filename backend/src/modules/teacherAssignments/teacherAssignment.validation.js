import { body } from "express-validator";

export const createAssignmentValidation = [
  body("teacherId")
    .notEmpty().withMessage("Teacher is required")
    .isMongoId().withMessage("teacherId must be a valid ID"),

  body("courseId")
    .notEmpty().withMessage("Course is required")
    .isMongoId().withMessage("courseId must be a valid ID"),

  body("departmentId")
    .notEmpty().withMessage("Department is required")
    .isMongoId().withMessage("departmentId must be a valid ID"),

  body("semesterId")
    .notEmpty().withMessage("Semester is required")
    .isMongoId().withMessage("semesterId must be a valid ID"),

  body("academicSessionId")
    .notEmpty().withMessage("Academic session is required")
    .isMongoId().withMessage("academicSessionId must be a valid ID"),

  body("section").optional({ checkFalsy: true }).trim(),
  body("shift").optional().isIn(["Morning", "Day", "Evening"]).withMessage("Invalid shift value"),
  body("group").optional({ checkFalsy: true }).trim(),
  body("notes").optional({ checkFalsy: true }).trim(),
];

export const updateAssignmentValidation = [
  body("section").optional({ checkFalsy: true }).trim(),
  body("shift").optional().isIn(["Morning", "Day", "Evening"]),
  body("group").optional({ checkFalsy: true }).trim(),
  body("notes").optional({ checkFalsy: true }).trim(),
];

export const updateAssignmentStatusValidation = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["active", "inactive", "completed"])
    .withMessage("Status must be: active, inactive, or completed"),
];
