import { body } from "express-validator";

const isHHMM = (val) => !val || /^([01]\d|2[0-3]):([0-5]\d)$/.test(val);

export const createMappingValidation = [
  body("examId")
    .notEmpty().withMessage("Exam is required")
    .isMongoId().withMessage("examId must be a valid ID"),

  body("courseId")
    .notEmpty().withMessage("Course is required")
    .isMongoId().withMessage("courseId must be a valid ID"),

  body("teacherId").optional({ checkFalsy: true }).isMongoId(),
  body("teacherAssignmentId").optional({ checkFalsy: true }).isMongoId(),
  body("departmentId").optional({ checkFalsy: true }).isMongoId(),
  body("semesterId").optional({ checkFalsy: true }).isMongoId(),
  body("academicSessionId").optional({ checkFalsy: true }).isMongoId(),

  body("examDate").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("startTime").optional({ checkFalsy: true }).custom(isHHMM).withMessage("startTime must be HH:MM format"),
  body("endTime")
    .optional({ checkFalsy: true }).custom(isHHMM).withMessage("endTime must be HH:MM format")
    .custom((val, { req }) => {
      if (val && req.body.startTime && val <= req.body.startTime) {
        throw new Error("endTime must be after startTime");
      }
      return true;
    }),
  body("room").optional({ checkFalsy: true }).trim(),

  body("fullMarks")
    .notEmpty().withMessage("Full marks is required")
    .isFloat({ min: 1 }).withMessage("fullMarks must be a positive number").toFloat(),

  body("passMarks")
    .notEmpty().withMessage("Pass marks is required")
    .isFloat({ min: 0 }).withMessage("passMarks must be non-negative").toFloat()
    .custom((val, { req }) => {
      if (parseFloat(val) > parseFloat(req.body.fullMarks)) {
        throw new Error("passMarks cannot exceed fullMarks");
      }
      return true;
    }),

  body("marksComponents").optional().isArray(),
  body("marksComponents.*.component").optional().trim().notEmpty(),
  body("marksComponents.*.fullMarks").optional().isFloat({ min: 0 }).toFloat(),
  body("marksComponents.*.passMarks").optional().isFloat({ min: 0 }).toFloat(),

  body("notes").optional({ checkFalsy: true }).trim(),
];

export const updateMappingValidation = [
  body("teacherId").optional({ checkFalsy: true }).isMongoId(),
  body("examDate").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("startTime").optional({ checkFalsy: true }).custom(isHHMM),
  body("endTime").optional({ checkFalsy: true }).custom(isHHMM),
  body("room").optional({ checkFalsy: true }).trim(),
  body("fullMarks").optional().isFloat({ min: 1 }).toFloat(),
  body("passMarks").optional().isFloat({ min: 0 }).toFloat(),
  body("notes").optional({ checkFalsy: true }).trim(),
];

export const updateMappingStatusValidation = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["active", "inactive", "cancelled"]),
];
