import { body } from "express-validator";

export const createSessionValidation = [
  body("name")
    .trim().notEmpty().withMessage("Session name is required")
    .isLength({ max: 30 }).withMessage("Name must be ≤ 30 characters"),

  body("startDate")
    .notEmpty().withMessage("Start date is required")
    .isISO8601().withMessage("Start date must be a valid date (YYYY-MM-DD)")
    .toDate(),

  body("endDate")
    .notEmpty().withMessage("End date is required")
    .isISO8601().withMessage("End date must be a valid date (YYYY-MM-DD)")
    .toDate()
    .custom((endDate, { req }) => {
      if (req.body.startDate && endDate <= new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),

  body("notes")
    .optional({ checkFalsy: true }).trim(),
];

export const updateSessionValidation = [
  body("name")
    .optional().trim().notEmpty().withMessage("Name cannot be empty"),

  body("startDate")
    .optional()
    .isISO8601().withMessage("Start date must be a valid date")
    .toDate(),

  body("endDate")
    .optional()
    .isISO8601().withMessage("End date must be a valid date")
    .toDate(),

  body("status")
    .optional()
    .isIn(["planned", "active", "completed"]).withMessage("Status must be planned, active, or completed"),

  body("notes")
    .optional({ checkFalsy: true }).trim(),
];
