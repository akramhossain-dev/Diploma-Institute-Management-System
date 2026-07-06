import { body } from "express-validator";

// ── Shared address sub-validator ──────────────────────────────────────────
const addressValidation = (prefix) => [
  body(`${prefix}.village`).optional({ checkFalsy: true }).trim(),
  body(`${prefix}.district`).optional({ checkFalsy: true }).trim(),
  body(`${prefix}.division`).optional({ checkFalsy: true }).trim(),
  body(`${prefix}.postCode`).optional({ checkFalsy: true }).trim(),
];

export const createStudentValidation = [
  body("fullName")
    .trim().notEmpty().withMessage("Full name is required")
    .isLength({ max: 100 }),

  body("email")
    .trim().notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  body("phone")
    .optional({ checkFalsy: true }).trim()
    .isMobilePhone().withMessage("Must be a valid phone number"),

  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other"]).withMessage("Gender must be Male, Female, or Other"),

  body("dateOfBirth")
    .optional({ checkFalsy: true })
    .isISO8601().withMessage("Date of birth must be a valid date")
    .toDate(),

  body("bloodGroup")
    .optional({ checkFalsy: true })
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .withMessage("Invalid blood group"),

  body("departmentId")
    .notEmpty().withMessage("Department is required")
    .isMongoId().withMessage("departmentId must be a valid ID"),

  body("semesterId")
    .notEmpty().withMessage("Semester is required")
    .isMongoId().withMessage("semesterId must be a valid ID"),

  body("academicSessionId")
    .notEmpty().withMessage("Academic session is required")
    .isMongoId().withMessage("academicSessionId must be a valid ID"),

  body("shift")
    .optional()
    .isIn(["Morning", "Day", "Evening"]).withMessage("Shift must be Morning, Day, or Evening"),

  body("admissionDate")
    .optional({ checkFalsy: true })
    .isISO8601().withMessage("Admission date must be a valid date")
    .toDate(),

  body("rollNumber")
    .optional({ checkFalsy: true }).trim(),

  body("registrationNumber")
    .optional({ checkFalsy: true }).trim(),

  body("guardianName").optional({ checkFalsy: true }).trim(),
  body("guardianPhone").optional({ checkFalsy: true }).trim(),
  body("guardianRelation").optional({ checkFalsy: true }).trim(),

  ...addressValidation("presentAddress"),
  ...addressValidation("permanentAddress"),

  body("notes").optional({ checkFalsy: true }).trim(),
];

export const updateStudentValidation = [
  body("fullName").optional().trim().notEmpty().withMessage("Full name cannot be empty").isLength({ max: 100 }),
  body("phone").optional({ checkFalsy: true }).trim().isMobilePhone().withMessage("Invalid phone"),
  body("photo").optional({ checkFalsy: true }).isURL().withMessage("Photo must be a valid URL"),
  body("gender").optional().isIn(["Male", "Female", "Other"]),
  body("dateOfBirth").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("bloodGroup").optional({ checkFalsy: true }).isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  body("rollNumber").optional({ checkFalsy: true }).trim(),
  body("registrationNumber").optional({ checkFalsy: true }).trim(),
  body("section").optional({ checkFalsy: true }).trim(),
  body("group").optional({ checkFalsy: true }).trim(),
  body("guardianName").optional({ checkFalsy: true }).trim(),
  body("guardianPhone").optional({ checkFalsy: true }).trim(),
  body("guardianRelation").optional({ checkFalsy: true }).trim(),
  ...addressValidation("presentAddress"),
  ...addressValidation("permanentAddress"),
  body("notes").optional({ checkFalsy: true }).trim(),
];

export const updateStudentStatusValidation = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["active", "inactive", "graduated", "dropped", "suspended"])
    .withMessage("Status must be one of: active, inactive, graduated, dropped, suspended"),
];
