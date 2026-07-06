import { query } from "express-validator";

export const reportQueryValidation = [
  query("departmentId").optional({ checkFalsy: true }).isMongoId(),
  query("semesterId").optional({ checkFalsy: true }).isMongoId(),
  query("academicSessionId").optional({ checkFalsy: true }).isMongoId(),
  query("studentId").optional({ checkFalsy: true }).isMongoId(),
  query("teacherId").optional({ checkFalsy: true }).isMongoId(),
  query("examId").optional({ checkFalsy: true }).isMongoId(),
  query("fromDate").optional({ checkFalsy: true }).isISO8601().withMessage("fromDate must be a valid date"),
  query("toDate").optional({ checkFalsy: true }).isISO8601().withMessage("toDate must be a valid date"),
  query("status").optional({ checkFalsy: true }).trim(),
  query("paymentMethod").optional({ checkFalsy: true }).trim(),
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 200 }).toInt(),
];
