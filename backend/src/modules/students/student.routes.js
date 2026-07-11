import { Router } from "express";
import { body, param } from "express-validator";

import studentController from "./student.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import {
  createStudentValidation,
  updateStudentValidation,
  updateStudentStatusValidation,
} from "./student.validation.js";

const router = Router();

const validateMongoId = [
  param("id").isMongoId().withMessage("Invalid student ID"),
  handleValidationErrors,
];

// IMPORTANT: /me must be defined before /:id to prevent route shadowing
router.get(
  "/me",
  authenticate,
  authorizeEntity("student"),
  studentController.getMe
);

router.get(
  "/",
  authenticate,
  authorizeEntity("admin", "teacher"),
  studentController.getAll
);

router.get(
  "/:id",
  authenticate,
  authorizeEntity("admin", "teacher"),
  validateMongoId,
  studentController.getById
);

router.post(
  "/",
  authenticate,
  authorizeEntity("admin"),
  createStudentValidation,
  handleValidationErrors,
  studentController.create
);

router.patch(
  "/:id",
  authenticate,
  authorizeEntity("admin"),
  validateMongoId,
  updateStudentValidation,
  handleValidationErrors,
  studentController.update
);

router.patch(
  "/:id/status",
  authenticate,
  authorizeEntity("admin"),
  validateMongoId,
  updateStudentStatusValidation,
  handleValidationErrors,
  studentController.updateStatus
);

export default router;
