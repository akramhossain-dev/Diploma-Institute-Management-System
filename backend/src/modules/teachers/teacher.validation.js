import { body } from "express-validator";

const addressValidation = (prefix) => [
  body(`${prefix}.village`).optional({ checkFalsy: true }).trim(),
  body(`${prefix}.district`).optional({ checkFalsy: true }).trim(),
  body(`${prefix}.division`).optional({ checkFalsy: true }).trim(),
  body(`${prefix}.postCode`).optional({ checkFalsy: true }).trim(),
];

export const createTeacherValidation = [
  body("fullName")
    .trim().notEmpty().withMessage("Full name is required").isLength({ max: 100 }),

  body("email")
    .trim().notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Must be a valid email").normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  body("phone")
    .optional({ checkFalsy: true }).trim()
    .isMobilePhone().withMessage("Must be a valid phone number"),

  body("gender").optional().isIn(["Male", "Female", "Other"]),
  body("dateOfBirth").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("bloodGroup")
    .optional({ checkFalsy: true })
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),

  body("departmentId")
    .notEmpty().withMessage("Department is required")
    .isMongoId().withMessage("departmentId must be a valid ID"),

  body("designation")
    .trim().notEmpty().withMessage("Designation is required"),

  body("qualification")
    .optional({ checkFalsy: true }).trim(),

  body("specialization")
    .optional({ checkFalsy: true }).trim(),

  body("joiningDate")
    .optional({ checkFalsy: true }).isISO8601().withMessage("Invalid joining date").toDate(),

  ...addressValidation("presentAddress"),
  ...addressValidation("permanentAddress"),

  body("emergencyContact.name").optional({ checkFalsy: true }).trim(),
  body("emergencyContact.phone").optional({ checkFalsy: true }).trim(),
  body("emergencyContact.relationship").optional({ checkFalsy: true }).trim(),

  body("notes").optional({ checkFalsy: true }).trim(),
];

export const updateTeacherValidation = [
  body("fullName").optional().trim().notEmpty().isLength({ max: 100 }),
  body("phone").optional({ checkFalsy: true }).trim().isMobilePhone(),
  body("photo").optional({ checkFalsy: true }).isURL().withMessage("Photo must be a valid URL"),
  body("gender").optional().isIn(["Male", "Female", "Other"]),
  body("dateOfBirth").optional({ checkFalsy: true }).isISO8601().toDate(),
  body("designation").optional().trim().notEmpty(),
  body("qualification").optional({ checkFalsy: true }).trim(),
  body("specialization").optional({ checkFalsy: true }).trim(),
  body("joiningDate").optional({ checkFalsy: true }).isISO8601().toDate(),
  ...addressValidation("presentAddress"),
  ...addressValidation("permanentAddress"),
  body("emergencyContact.name").optional({ checkFalsy: true }).trim(),
  body("emergencyContact.phone").optional({ checkFalsy: true }).trim(),
  body("emergencyContact.relationship").optional({ checkFalsy: true }).trim(),
  body("notes").optional({ checkFalsy: true }).trim(),
];

export const updateTeacherStatusValidation = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["active", "inactive", "on_leave", "resigned"])
    .withMessage("Status must be: active, inactive, on_leave, or resigned"),
];
