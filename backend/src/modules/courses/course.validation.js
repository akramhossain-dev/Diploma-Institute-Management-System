import { body } from "express-validator";

export const createCourseValidation = [
  body("title")
    .trim().notEmpty().withMessage("Course title is required")
    .isLength({ max: 150 }).withMessage("Title must be ≤ 150 characters"),

  body("code")
    .trim().notEmpty().withMessage("Course code is required")
    .isLength({ max: 20 }).withMessage("Code must be ≤ 20 characters")
    .matches(/^[A-Za-z0-9\-_]+$/).withMessage("Code can only contain letters, numbers, hyphens, underscores"),

  body("credit")
    .notEmpty().withMessage("Credit hours are required")
    .isFloat({ min: 0.5, max: 10 }).withMessage("Credit must be between 0.5 and 10")
    .toFloat(),

  body("type")
    .optional()
    .isIn(["theory", "practical", "lab", "project", "viva"]).withMessage("Invalid course type"),

  body("departmentId")
    .notEmpty().withMessage("Department is required")
    .isMongoId().withMessage("departmentId must be a valid ID"),

  body("semesterId")
    .notEmpty().withMessage("Semester is required")
    .isMongoId().withMessage("semesterId must be a valid ID"),

  body("description")
    .optional({ checkFalsy: true }).trim(),
];

export const updateCourseValidation = [
  body("title")
    .optional().trim().notEmpty().withMessage("Title cannot be empty")
    .isLength({ max: 150 }),

  body("credit")
    .optional()
    .isFloat({ min: 0.5, max: 10 }).withMessage("Credit must be between 0.5 and 10")
    .toFloat(),

  body("type")
    .optional()
    .isIn(["theory", "practical", "lab", "project", "viva"]).withMessage("Invalid course type"),

  body("departmentId")
    .optional()
    .isMongoId().withMessage("departmentId must be a valid ID"),

  body("semesterId")
    .optional()
    .isMongoId().withMessage("semesterId must be a valid ID"),

  body("description")
    .optional({ checkFalsy: true }).trim(),
];
