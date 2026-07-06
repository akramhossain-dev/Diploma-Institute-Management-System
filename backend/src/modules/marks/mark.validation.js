import { body } from "express-validator";

export const bulkMarksValidation = [
  body("examCourseMappingId")
    .notEmpty().withMessage("examCourseMappingId is required")
    .isMongoId().withMessage("Must be a valid ID"),

  body("records")
    .notEmpty().withMessage("Records array is required")
    .isArray({ min: 1 }).withMessage("records must be a non-empty array"),

  body("records.*.studentId")
    .notEmpty().withMessage("Each record must have a studentId")
    .isMongoId().withMessage("studentId must be a valid ID"),

  body("records.*.obtainedMarks")
    .notEmpty().withMessage("obtainedMarks is required for each record")
    .isFloat({ min: 0 }).withMessage("obtainedMarks must be non-negative").toFloat(),

  body("records.*.componentMarks").optional().isArray(),
  body("records.*.componentMarks.*.component").optional().trim(),
  body("records.*.componentMarks.*.obtained").optional().isFloat({ min: 0 }).toFloat(),
  body("records.*.componentMarks.*.fullMarks").optional().isFloat({ min: 0 }).toFloat(),

  body("records.*.remarks").optional({ checkFalsy: true }).trim(),
];

export const updateMarkValidation = [
  body("obtainedMarks")
    .optional()
    .isFloat({ min: 0 }).withMessage("obtainedMarks must be non-negative").toFloat(),
  body("componentMarks").optional().isArray(),
  body("componentMarks.*.component").optional().trim(),
  body("componentMarks.*.obtained").optional().isFloat({ min: 0 }).toFloat(),
  body("remarks").optional({ checkFalsy: true }).trim(),
];
