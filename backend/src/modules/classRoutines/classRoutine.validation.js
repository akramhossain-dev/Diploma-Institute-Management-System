import { body } from "express-validator";

// HH:MM 24-hour format validator
const isHHMM = (val) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(val);

export const createRoutineValidation = [
  body("teacherId")
    .notEmpty().withMessage("Teacher is required")
    .isMongoId().withMessage("teacherId must be a valid ID"),

  body("courseId")
    .notEmpty().withMessage("Course is required")
    .isMongoId().withMessage("courseId must be a valid ID"),

  body("departmentId")
    .notEmpty().withMessage("Department is required")
    .isMongoId().withMessage("departmentId must be a valid ID"),

  body("semesterId")
    .notEmpty().withMessage("Semester is required")
    .isMongoId().withMessage("semesterId must be a valid ID"),

  body("academicSessionId")
    .notEmpty().withMessage("Academic session is required")
    .isMongoId().withMessage("academicSessionId must be a valid ID"),

  body("teacherAssignmentId")
    .optional({ checkFalsy: true })
    .isMongoId().withMessage("teacherAssignmentId must be a valid ID"),

  body("dayOfWeek")
    .notEmpty().withMessage("Day of week is required")
    .isIn(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])
    .withMessage("Invalid day of week"),

  body("startTime")
    .notEmpty().withMessage("Start time is required")
    .custom(isHHMM).withMessage("startTime must be in HH:MM format (24h)"),

  body("endTime")
    .notEmpty().withMessage("End time is required")
    .custom(isHHMM).withMessage("endTime must be in HH:MM format (24h)")
    .custom((val, { req }) => {
      if (val <= req.body.startTime) {
        throw new Error("endTime must be after startTime");
      }
      return true;
    }),

  body("section").optional({ checkFalsy: true }).trim(),
  body("shift").optional().isIn(["Morning", "Day", "Evening"]),
  body("room").optional({ checkFalsy: true }).trim(),

  body("effectiveFrom")
    .optional({ checkFalsy: true })
    .isISO8601().withMessage("effectiveFrom must be a valid date").toDate(),

  body("effectiveTo")
    .optional({ checkFalsy: true })
    .isISO8601().withMessage("effectiveTo must be a valid date").toDate()
    .custom((val, { req }) => {
      if (val && req.body.effectiveFrom && val <= new Date(req.body.effectiveFrom)) {
        throw new Error("effectiveTo must be after effectiveFrom");
      }
      return true;
    }),

  body("notes").optional({ checkFalsy: true }).trim(),
];

export const updateRoutineValidation = [
  body("dayOfWeek")
    .optional()
    .isIn(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]),
  body("startTime").optional().custom(isHHMM).withMessage("startTime must be in HH:MM format (24h)"),
  body("endTime").optional().custom(isHHMM).withMessage("endTime must be in HH:MM format (24h)"),
  body("section").optional({ checkFalsy: true }).trim(),
  body("shift").optional().isIn(["Morning", "Day", "Evening"]),
  body("room").optional({ checkFalsy: true }).trim(),
  body("effectiveFrom").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("effectiveTo").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("notes").optional({ checkFalsy: true }).trim(),
];

export const updateRoutineStatusValidation = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["active", "inactive", "cancelled"])
    .withMessage("Status must be: active, inactive, or cancelled"),
];
