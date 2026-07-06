import { body } from "express-validator";

export const createNoticeValidation = [
  body("title")
    .trim().notEmpty().withMessage("Title is required")
    .isLength({ max: 200 }).withMessage("Title must be ≤ 200 characters"),

  body("content")
    .trim().notEmpty().withMessage("Content is required"),

  body("summary")
    .optional({ checkFalsy: true }).trim()
    .isLength({ max: 500 }).withMessage("Summary must be ≤ 500 characters"),

  body("noticeType")
    .optional()
    .isIn(["general", "academic", "exam", "finance", "urgent", "holiday", "other"])
    .withMessage("Invalid notice type"),

  body("priority")
    .optional()
    .isIn(["normal", "high", "urgent"]).withMessage("Priority must be normal, high, or urgent"),

  body("targetAudience")
    .optional()
    .isArray().withMessage("targetAudience must be an array"),
  body("targetAudience.*")
    .optional()
    .isIn(["all", "students", "teachers", "accountants", "admins"])
    .withMessage("Invalid audience value"),

  body("targetDepartmentIds")
    .optional().isArray().withMessage("targetDepartmentIds must be an array"),
  body("targetDepartmentIds.*")
    .optional().isMongoId().withMessage("Each targetDepartmentId must be a valid ID"),

  body("targetSemesterIds")
    .optional().isArray().withMessage("targetSemesterIds must be an array"),
  body("targetSemesterIds.*")
    .optional().isMongoId().withMessage("Each targetSemesterId must be a valid ID"),

  body("targetAcademicSessionIds")
    .optional().isArray().withMessage("targetAcademicSessionIds must be an array"),
  body("targetAcademicSessionIds.*")
    .optional().isMongoId().withMessage("Each targetAcademicSessionId must be a valid ID"),

  body("expiresAt")
    .optional({ checkFalsy: true })
    .isISO8601().withMessage("expiresAt must be a valid date")
    .toDate()
    .custom((val) => {
      if (val && val <= new Date()) throw new Error("Expiry date must be in the future");
      return true;
    }),
];

export const updateNoticeValidation = [
  body("title").optional().trim().notEmpty().isLength({ max: 200 }),
  body("content").optional().trim().notEmpty(),
  body("summary").optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
  body("noticeType").optional().isIn(["general", "academic", "exam", "finance", "urgent", "holiday", "other"]),
  body("priority").optional().isIn(["normal", "high", "urgent"]),
  body("targetAudience").optional().isArray(),
  body("targetAudience.*").optional().isIn(["all", "students", "teachers", "accountants", "admins"]),
  body("targetDepartmentIds").optional().isArray(),
  body("targetDepartmentIds.*").optional().isMongoId(),
  body("targetSemesterIds").optional().isArray(),
  body("targetSemesterIds.*").optional().isMongoId(),
  body("targetAcademicSessionIds").optional().isArray(),
  body("targetAcademicSessionIds.*").optional().isMongoId(),
  body("expiresAt").optional({ checkFalsy: true }).isISO8601().toDate(),
];
