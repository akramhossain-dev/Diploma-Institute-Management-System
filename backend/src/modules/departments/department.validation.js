import { body } from "express-validator";

export const createDepartmentValidation = [
  body("name")
    .trim().notEmpty().withMessage("Department name is required")
    .isLength({ max: 100 }).withMessage("Name must be ≤ 100 characters"),

  body("code")
    .trim().notEmpty().withMessage("Department code is required")
    .isLength({ min: 2, max: 10 }).withMessage("Code must be 2–10 characters")
    .matches(/^[A-Za-z]+$/).withMessage("Code must contain letters only"),

  body("shortName")
    .optional({ checkFalsy: true })
    .trim().isLength({ max: 20 }),

  body("description")
    .optional({ checkFalsy: true })
    .trim(),
];

export const updateDepartmentValidation = [
  body("name")
    .optional().trim().notEmpty().withMessage("Name cannot be empty")
    .isLength({ max: 100 }),

  body("shortName")
    .optional({ checkFalsy: true }).trim(),

  body("description")
    .optional({ checkFalsy: true }).trim(),
];
