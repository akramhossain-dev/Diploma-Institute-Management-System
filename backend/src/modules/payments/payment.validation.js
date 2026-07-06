import { body } from "express-validator";

export const createPaymentValidation = [
  body("studentId").notEmpty().isMongoId().withMessage("Valid studentId is required"),
  body("paymentDate").notEmpty().isISO8601().withMessage("paymentDate must be a valid date").toDate(),
  body("paymentMethod")
    .notEmpty().withMessage("Payment method is required")
    .isIn(["cash", "bank_transfer", "mobile_banking", "card", "online", "cheque", "custom"])
    .withMessage("Invalid payment method"),
  body("transactionReference").optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body("totalAmount").notEmpty().isFloat({ min: 0.01 }).withMessage("totalAmount must be > 0").toFloat(),
  body("currency").optional({ checkFalsy: true }).trim(),
  body("remarks").optional({ checkFalsy: true }).trim().isLength({ max: 500 }),

  body("paymentItems")
    .notEmpty().withMessage("paymentItems are required")
    .isArray({ min: 1 }).withMessage("paymentItems must be a non-empty array"),

  body("paymentItems.*.studentFeeAssignmentId")
    .notEmpty().withMessage("Each item must have studentFeeAssignmentId")
    .isMongoId().withMessage("studentFeeAssignmentId must be a valid ID"),

  body("paymentItems.*.amountApplied")
    .notEmpty().withMessage("Each item must have amountApplied")
    .isFloat({ min: 0.01 }).withMessage("amountApplied must be > 0").toFloat(),
];

export const reversePaymentValidation = [
  body("reversalReason")
    .trim().notEmpty().withMessage("Reversal reason is required")
    .isLength({ max: 500 }),
];
