import { Router } from "express";
import { param, body } from "express-validator";

import admissionController from "./admission.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import {
  createAdmissionValidation,
  updateAdmissionValidation,
  rejectAdmissionValidation,
  convertToStudentValidation,
} from "./admission.validation.js";

const router = Router();

const validateMongoId = [
  param("id").isMongoId().withMessage("Invalid admission ID"),
  handleValidationErrors,
];

// ── PUBLIC: Online admission application (no auth required) ───────────────
// Comment out authenticate + authorizeEntity to make it fully public,
// or add them to require a specific entity type to submit applications.
router.post(
  "/",
  createAdmissionValidation,
  handleValidationErrors,
  admissionController.create
);

// ── ADMIN: List + detail + management ────────────────────────────────────
router.get(
  "/",
  authenticate, authorizeEntity("admin"),
  admissionController.getAll
);

router.get(
  "/:id",
  authenticate, authorizeEntity("admin"),
  validateMongoId,
  admissionController.getById
);

// Update basic info (pending/reviewed states only)
router.patch(
  "/:id",
  authenticate, authorizeEntity("admin"),
  validateMongoId, updateAdmissionValidation, handleValidationErrors,
  admissionController.update
);

// ── Status transitions ────────────────────────────────────────────────────
router.patch(
  "/:id/review",
  authenticate, authorizeEntity("admin"),
  validateMongoId,
  admissionController.markReviewed
);

router.patch(
  "/:id/approve",
  authenticate, authorizeEntity("admin"),
  validateMongoId,
  admissionController.approve
);

router.patch(
  "/:id/reject",
  authenticate, authorizeEntity("admin"),
  validateMongoId, rejectAdmissionValidation, handleValidationErrors,
  admissionController.reject
);

router.patch(
  "/:id/cancel",
  authenticate, authorizeEntity("admin"),
  validateMongoId,
  admissionController.cancel
);

// ── Explicit convert to student (admin only, approved admissions only) ────
router.post(
  "/:id/convert-to-student",
  authenticate, authorizeEntity("admin"),
  validateMongoId, convertToStudentValidation, handleValidationErrors,
  admissionController.convertToStudent
);

export default router;
