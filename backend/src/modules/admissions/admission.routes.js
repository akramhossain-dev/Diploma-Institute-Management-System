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

// Comment out authenticate + authorizeEntity to make it fully public,

router.post(
  "/",
  createAdmissionValidation,
  handleValidationErrors,
  admissionController.create
);

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

router.patch(
  "/:id",
  authenticate, authorizeEntity("admin"),
  validateMongoId, updateAdmissionValidation, handleValidationErrors,
  admissionController.update
);

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

router.post(
  "/:id/convert-to-student",
  authenticate, authorizeEntity("admin"),
  validateMongoId, convertToStudentValidation, handleValidationErrors,
  admissionController.convertToStudent
);

export default router;
