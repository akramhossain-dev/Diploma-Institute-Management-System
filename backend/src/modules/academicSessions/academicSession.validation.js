import { body } from "express-validator";

export const createSessionValidation = [
  body("name")
    .trim().notEmpty().withMessage("Session name is required")
    .isLength({ max: 30 }).withMessage("Name must be ≤ 30 characters"),

  body("startYear")
    .notEmpty().withMessage("Start year is required")
    .isInt({ min: 2000, max: 2100 }).withMessage("Start year must be between 2000 and 2100"),

  body("endYear")
    .notEmpty().withMessage("End year is required")
    .isInt({ min: 2000, max: 2100 }).withMessage("End year must be between 2000 and 2100")
    .custom((endYear, { req }) => {
      if (req.body.startYear && parseInt(endYear, 10) < parseInt(req.body.startYear, 10)) {
        throw new Error("End year must be equal to or greater than start year");
      }
      return true;
    }),

  body("notes")
    .optional({ checkFalsy: true }).trim(),
];

export const updateSessionValidation = [
  body("name")
    .optional().trim().notEmpty().withMessage("Name cannot be empty"),

  body("startYear")
    .optional()
    .isInt({ min: 2000, max: 2100 }).withMessage("Start year must be between 2000 and 2100"),

  body("endYear")
    .optional()
    .isInt({ min: 2000, max: 2100 }).withMessage("End year must be between 2000 and 2100"),

  body("status")
    .optional()
    .isIn(["planned", "active", "completed"]).withMessage("Status must be planned, active, or completed"),

  body("notes")
    .optional({ checkFalsy: true }).trim(),
];
