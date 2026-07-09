import { body } from "express-validator";

export const createFeeStructureValidation = [
  body("name").trim().notEmpty().withMessage("Fee title is required").isLength({ max: 200 }),
  body("feeCode").optional({ checkFalsy: true }).trim().isAlphanumeric().isLength({ max: 20 }),
  body("feeType")
    .optional()
    .isIn(["admission", "semester", "exam", "lab", "library", "transport", "hostel", "misc", "custom"]),
  body("description").optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
  body("departmentId").optional({ checkFalsy: true }).isMongoId(),
  body("semesterId").optional({ checkFalsy: true }).isMongoId(),
  body("sessionId").notEmpty().withMessage("Academic session is required").isMongoId(),
  body("amount").notEmpty().withMessage("Amount is required").isFloat({ min: 0 }).toFloat(),
  body("currency").optional({ checkFalsy: true }).trim().isLength({ max: 10 }),
  body("frequency").optional().isIn(["one_time", "monthly", "semesterly", "yearly", "custom"]),
  body("allowPartialPayment").optional().isBoolean().toBoolean(),
  body("effectiveFrom").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("effectiveTo")
    .optional({ checkFalsy: true }).isISO8601().toDate()
    .custom((val, { req }) => {
      if (val && req.body.effectiveFrom && new Date(val) <= new Date(req.body.effectiveFrom))
        throw new Error("effectiveTo must be after effectiveFrom");
      return true;
    }),
];

export const updateFeeStructureValidation = [
  body("name").optional().trim().notEmpty().isLength({ max: 200 }),
  body("description").optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
  body("amount").optional().isFloat({ min: 0 }).toFloat(),
  body("currency").optional({ checkFalsy: true }).trim(),
  body("allowPartialPayment").optional().isBoolean().toBoolean(),
  body("effectiveFrom").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("effectiveTo").optional({ checkFalsy: true }).isISO8601().toDate(),
];

export const updateFeeStructureStatusValidation = [
  body("status").notEmpty().isIn(["active", "inactive", "archived"]).withMessage("Invalid status"),
];
