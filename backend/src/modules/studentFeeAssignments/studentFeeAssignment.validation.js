import { body } from "express-validator";

export const createAssignmentValidation = [
  body("studentId").notEmpty().isMongoId().withMessage("Valid studentId required"),
  body("feeStructureId").optional({ checkFalsy: true }).isMongoId(),
  body("titleSnapshot").trim().notEmpty().withMessage("Fee title is required"),
  body("feeTypeSnapshot").notEmpty().withMessage("Fee type is required")
    .isIn(["admission", "semester", "exam", "lab", "library", "transport", "hostel", "misc", "custom"]),
  body("sourceType").optional().isIn(["fee_structure", "manual", "admission", "semester_promotion", "exam_fee", "other"]),
  body("amountDue").notEmpty().isFloat({ min: 0 }).withMessage("amountDue must be non-negative").toFloat(),
  body("discountAmount").optional().isFloat({ min: 0 }).toFloat(),
  body("waiverAmount").optional().isFloat({ min: 0 }).toFloat(),
  body("fineAmount").optional().isFloat({ min: 0 }).toFloat(),
  body("currency").optional({ checkFalsy: true }).trim(),
  body("departmentId").notEmpty().isMongoId().withMessage("departmentId required"),
  body("semesterId").notEmpty().isMongoId().withMessage("semesterId required"),
  body("academicSessionId").notEmpty().isMongoId().withMessage("academicSessionId required"),
  body("dueDate").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("notes").optional({ checkFalsy: true }).trim(),
];

export const bulkAssignValidation = [
  body("feeStructureId").notEmpty().isMongoId().withMessage("feeStructureId is required"),
  body("departmentId").notEmpty().isMongoId().withMessage("departmentId is required"),
  body("semesterId").notEmpty().isMongoId().withMessage("semesterId is required"),
  body("academicSessionId").notEmpty().isMongoId().withMessage("academicSessionId is required"),
  body("dueDate").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("discountAmount").optional().isFloat({ min: 0 }).toFloat(),
  body("waiverAmount").optional().isFloat({ min: 0 }).toFloat(),
  body("fineAmount").optional().isFloat({ min: 0 }).toFloat(),
  body("notes").optional({ checkFalsy: true }).trim(),
];

export const updateAssignmentValidation = [
  body("discountAmount").optional().isFloat({ min: 0 }).toFloat(),
  body("waiverAmount").optional().isFloat({ min: 0 }).toFloat(),
  body("fineAmount").optional().isFloat({ min: 0 }).toFloat(),
  body("dueDate").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("notes").optional({ checkFalsy: true }).trim(),
];

export const updateAssignmentStatusValidation = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["unpaid", "waived", "cancelled", "overdue"])
    .withMessage("Manual status must be: unpaid, waived, cancelled, or overdue"),
  body("notes").optional({ checkFalsy: true }).trim(),
];
