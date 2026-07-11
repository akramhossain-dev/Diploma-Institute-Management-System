import { body } from "express-validator";

export const createSettingsValidation = [
  body("instituteName")
    .trim().notEmpty().withMessage("Institute name is required")
    .isLength({ max: 200 }),

  body("shortName").optional({ checkFalsy: true }).trim().isLength({ max: 30 }),
  body("email").optional({ checkFalsy: true }).isEmail().normalizeEmail(),
  body("phone").optional({ checkFalsy: true }).trim().isMobilePhone(),
  body("website").optional({ checkFalsy: true }).isURL().withMessage("Must be a valid URL"),

  body("address.street").optional({ checkFalsy: true }).trim(),
  body("address.city").optional({ checkFalsy: true }).trim(),
  body("address.district").optional({ checkFalsy: true }).trim(),
  body("address.division").optional({ checkFalsy: true }).trim(),
  body("address.postCode").optional({ checkFalsy: true }).trim(),
  body("address.country").optional({ checkFalsy: true }).trim(),

  body("currentAcademicSessionId")
    .optional({ checkFalsy: true })
    .isMongoId().withMessage("currentAcademicSessionId must be a valid ID"),

  body("defaultAdmissionSemesterId")
    .optional({ checkFalsy: true })
    .isMongoId().withMessage("defaultAdmissionSemesterId must be a valid ID"),

  body("defaultCurrency").optional({ checkFalsy: true }).trim().isLength({ max: 10 }),
  body("timezone").optional({ checkFalsy: true }).trim(),

  body("studentIdPrefix").optional({ checkFalsy: true }).trim().isLength({ max: 10 }),
  body("teacherIdPrefix").optional({ checkFalsy: true }).trim().isLength({ max: 10 }),
  body("accountantIdPrefix").optional({ checkFalsy: true }).trim().isLength({ max: 10 }),

  body("minAttendancePercent")
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage("Attendance percent must be 0–100"),

  body("gradingScale")
    .optional()
    .isIn(["4.0", "5.0", "letter", "percentage"]).withMessage("Invalid grading scale"),
];

export const updateSettingsValidation = createSettingsValidation.map((rule) => rule);
