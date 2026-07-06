import { Router } from "express";
import { body, param } from "express-validator";

import teacherController from "./teacher.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import {
  createTeacherValidation,
  updateTeacherValidation,
  updateTeacherStatusValidation,
} from "./teacher.validation.js";

const router = Router();

const validateMongoId = [
  param("id").isMongoId().withMessage("Invalid teacher ID"),
  handleValidationErrors,
];

// ── Self-access: teacher views own profile ────────────────────────────────
router.get("/me", authenticate, authorizeEntity("teacher"), teacherController.getMe);

// ── Admin: list all teachers ───────────────────────────────────────────────
router.get("/",   authenticate, authorizeEntity("admin"), teacherController.getAll);

// ── Admin/Teacher: get single teacher ─────────────────────────────────────
router.get(
  "/:id",
  authenticate,
  authorizeEntity("admin", "teacher"),
  validateMongoId,
  teacherController.getById
);

// ── Admin: create teacher ─────────────────────────────────────────────────
router.post(
  "/",
  authenticate, authorizeEntity("admin"),
  createTeacherValidation, handleValidationErrors,
  teacherController.create
);

// ── Admin: update teacher profile ─────────────────────────────────────────
router.patch(
  "/:id",
  authenticate, authorizeEntity("admin"),
  validateMongoId, updateTeacherValidation, handleValidationErrors,
  teacherController.update
);

// ── Admin: update teacher status ──────────────────────────────────────────
router.patch(
  "/:id/status",
  authenticate, authorizeEntity("admin"),
  validateMongoId, updateTeacherStatusValidation, handleValidationErrors,
  teacherController.updateStatus
);

// ── Admin: assign courses to teacher ──────────────────────────────────────
router.post(
  "/:id/courses",
  authenticate, authorizeEntity("admin"),
  validateMongoId,
  [
    body("courseIds").isArray({ min: 1 }).withMessage("courseIds must be a non-empty array"),
    body("courseIds.*").isMongoId().withMessage("Each courseId must be a valid ID"),
    handleValidationErrors,
  ],
  teacherController.assignCourses
);

// ── Admin: remove course from teacher ─────────────────────────────────────
router.delete(
  "/:id/courses/:courseId",
  authenticate, authorizeEntity("admin"),
  [
    param("id").isMongoId().withMessage("Invalid teacher ID"),
    param("courseId").isMongoId().withMessage("Invalid course ID"),
    handleValidationErrors,
  ],
  teacherController.removeCourse
);

export default router;
