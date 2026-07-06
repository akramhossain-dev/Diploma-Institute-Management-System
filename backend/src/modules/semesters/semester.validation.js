import { body } from "express-validator";

export const createSemesterValidation = [
  body("name")
    .trim().notEmpty().withMessage("Semester name is required")
    .isLength({ max: 60 }).withMessage("Name must be ≤ 60 characters"),

  body("number")
    .notEmpty().withMessage("Semester number is required")
    .isInt({ min: 1, max: 12 }).withMessage("Semester number must be between 1 and 12")
    .toInt(),

  body("description")
    .optional({ checkFalsy: true }).trim(),
];

export const updateSemesterValidation = [
  body("name")
    .optional().trim().notEmpty().withMessage("Name cannot be empty"),

  body("description")
    .optional({ checkFalsy: true }).trim(),
];
