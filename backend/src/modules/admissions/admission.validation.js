import { body } from "express-validator";

const addressValidation = (prefix) => [
  body(`${prefix}.village`).optional({ checkFalsy: true }).trim(),
  body(`${prefix}.district`).optional({ checkFalsy: true }).trim(),
  body(`${prefix}.division`).optional({ checkFalsy: true }).trim(),
  body(`${prefix}.postCode`).optional({ checkFalsy: true }).trim(),
];

export const createAdmissionValidation = [
  body("fullName")
    .trim().notEmpty().withMessage("Full name is required")
    .isLength({ max: 100 }),

  body("email")
    .trim().notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email")
    .normalizeEmail(),

  body("phone")
    .trim().notEmpty().withMessage("Phone is required")
    .isMobilePhone().withMessage("Must be a valid phone number"),

  body("gender").optional().isIn(["Male", "Female", "Other"]),
  body("dateOfBirth").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("bloodGroup")
    .optional({ checkFalsy: true })
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),

  body("desiredDepartmentId")
    .notEmpty().withMessage("Desired department is required")
    .isMongoId().withMessage("desiredDepartmentId must be a valid ID"),

  body("targetSemesterId")
    .optional({ checkFalsy: true })
    .isMongoId().withMessage("targetSemesterId must be a valid ID"),

  body("academicSessionId")
    .notEmpty().withMessage("Academic session is required")
    .isMongoId().withMessage("academicSessionId must be a valid ID"),

  body("admissionSource")
    .optional()
    .isIn(["online", "offline", "manual"]).withMessage("Invalid admission source"),

  // Previous education sub-fields
  body("previousEducation.board").optional({ checkFalsy: true }).trim(),
  body("previousEducation.year")
    .optional({ checkFalsy: true })
    .isInt({ min: 1990, max: new Date().getFullYear() })
    .withMessage("Invalid passing year").toInt(),
  body("previousEducation.roll").optional({ checkFalsy: true }).trim(),
  body("previousEducation.registration").optional({ checkFalsy: true }).trim(),
  body("previousEducation.gpa")
    .optional({ checkFalsy: true })
    .isFloat({ min: 0, max: 5 }).withMessage("GPA must be between 0 and 5").toFloat(),
  body("previousEducation.institution").optional({ checkFalsy: true }).trim(),
  body("previousEducation.examType").optional({ checkFalsy: true }).trim(),

  body("guardianName").optional({ checkFalsy: true }).trim(),
  body("guardianPhone").optional({ checkFalsy: true }).trim(),
  body("guardianRelation").optional({ checkFalsy: true }).trim(),

  ...addressValidation("presentAddress"),
  ...addressValidation("permanentAddress"),

  body("notes").optional({ checkFalsy: true }).trim(),
];

export const updateAdmissionValidation = [
  body("fullName").optional().trim().notEmpty().isLength({ max: 100 }),
  body("phone").optional().trim().isMobilePhone(),
  body("gender").optional().isIn(["Male", "Female", "Other"]),
  body("dateOfBirth").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("bloodGroup")
    .optional({ checkFalsy: true })
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  body("previousEducation.gpa")
    .optional({ checkFalsy: true })
    .isFloat({ min: 0, max: 5 }).toFloat(),
  body("guardianName").optional({ checkFalsy: true }).trim(),
  body("guardianPhone").optional({ checkFalsy: true }).trim(),
  body("guardianRelation").optional({ checkFalsy: true }).trim(),
  ...addressValidation("presentAddress"),
  ...addressValidation("permanentAddress"),
  body("notes").optional({ checkFalsy: true }).trim(),
];

export const rejectAdmissionValidation = [
  body("rejectionReason")
    .trim().notEmpty().withMessage("Rejection reason is required")
    .isLength({ max: 500 }),
];

export const convertToStudentValidation = [
  body("password")
    .notEmpty().withMessage("Initial password is required for student account")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];
