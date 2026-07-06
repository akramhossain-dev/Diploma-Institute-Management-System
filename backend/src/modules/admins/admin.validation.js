import { body } from "express-validator";

export const createAdminValidation = [
  body("fullName")
    .trim().notEmpty().withMessage("Full name is required")
    .isLength({ max: 100 }).withMessage("Full name must be ≤ 100 characters"),

  body("email")
    .trim().notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email")
    .normalizeEmail(),

  body("phone")
    .optional({ checkFalsy: true })
    .trim()
    .isMobilePhone().withMessage("Must be a valid phone number"),

  body("designation")
    .trim().notEmpty().withMessage("Designation is required"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),

  body("isSuperAdmin")
    .optional()
    .isBoolean().withMessage("isSuperAdmin must be a boolean"),
];

export const updateAdminValidation = [
  body("fullName")
    .optional().trim().notEmpty().withMessage("Full name cannot be empty")
    .isLength({ max: 100 }),

  body("phone")
    .optional({ checkFalsy: true })
    .trim()
    .isMobilePhone().withMessage("Must be a valid phone number"),

  body("designation")
    .optional().trim().notEmpty().withMessage("Designation cannot be empty"),

  body("photo")
    .optional({ checkFalsy: true })
    .isURL().withMessage("Photo must be a valid URL"),
];
