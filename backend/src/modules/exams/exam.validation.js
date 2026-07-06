import { body } from "express-validator";

export const createExamValidation = [
  body("name").trim().notEmpty().withMessage("Exam name is required").isLength({ max: 200 }),

  body("examType")
    .notEmpty().withMessage("Exam type is required")
    .isIn(["midterm", "final", "class_test", "practical", "viva", "quiz", "custom"])
    .withMessage("Invalid exam type"),

  body("description").optional({ checkFalsy: true }).trim().isLength({ max: 500 }),

  body("departmentId")
    .notEmpty().withMessage("Department is required")
    .isMongoId().withMessage("departmentId must be a valid ID"),

  body("semesterId")
    .notEmpty().withMessage("Semester is required")
    .isMongoId().withMessage("semesterId must be a valid ID"),

  body("academicSessionId")
    .notEmpty().withMessage("Academic session is required")
    .isMongoId().withMessage("academicSessionId must be a valid ID"),

  body("startDate")
    .optional({ checkFalsy: true })
    .isISO8601().withMessage("startDate must be a valid date").toDate(),

  body("endDate")
    .optional({ checkFalsy: true })
    .isISO8601().withMessage("endDate must be a valid date").toDate()
    .custom((val, { req }) => {
      if (val && req.body.startDate && new Date(val) <= new Date(req.body.startDate)) {
        throw new Error("endDate must be after startDate");
      }
      return true;
    }),

  body("notes").optional({ checkFalsy: true }).trim().isLength({ max: 1000 }),
];

export const updateExamValidation = [
  body("name").optional().trim().notEmpty().isLength({ max: 200 }),
  body("description").optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
  body("examType").optional().isIn(["midterm", "final", "class_test", "practical", "viva", "quiz", "custom"]),
  body("startDate").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("endDate").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("notes").optional({ checkFalsy: true }).trim(),
];

export const updateExamStatusValidation = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["draft", "scheduled", "ongoing", "completed", "published", "cancelled"])
    .withMessage("Invalid exam status"),
];
