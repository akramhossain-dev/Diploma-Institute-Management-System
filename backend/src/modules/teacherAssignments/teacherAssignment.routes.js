import { Router } from "express";
import { param } from "express-validator";

import teacherAssignmentController from "./teacherAssignment.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import {
  createAssignmentValidation,
  updateAssignmentValidation,
  updateAssignmentStatusValidation,
} from "./teacherAssignment.validation.js";

const router = Router();

const validateMongoId = [
  param("id").isMongoId().withMessage("Invalid assignment ID"),
  handleValidationErrors,
];

// All routes — admin only
router.post(
  "/",
  authenticate, authorizeEntity("admin"),
  createAssignmentValidation, handleValidationErrors,
  teacherAssignmentController.create
);

// Teachers can view their own assignments
router.get(
  "/",
  authenticate, authorizeEntity("admin", "teacher"),
  teacherAssignmentController.getAll
);

router.get(
  "/:id",
  authenticate, authorizeEntity("admin", "teacher"),
  validateMongoId,
  teacherAssignmentController.getById
);

router.patch(
  "/:id",
  authenticate, authorizeEntity("admin"),
  validateMongoId, updateAssignmentValidation, handleValidationErrors,
  teacherAssignmentController.update
);

router.patch(
  "/:id/status",
  authenticate, authorizeEntity("admin"),
  validateMongoId, updateAssignmentStatusValidation, handleValidationErrors,
  teacherAssignmentController.updateStatus
);

export default router;
