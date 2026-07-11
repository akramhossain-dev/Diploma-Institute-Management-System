import { Router } from "express";
import { param } from "express-validator";

import classRoutineController from "./classRoutine.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import {
  createRoutineValidation,
  updateRoutineValidation,
  updateRoutineStatusValidation,
} from "./classRoutine.validation.js";

const router = Router();

const validateMongoId = [
  param("id").isMongoId().withMessage("Invalid routine ID"),
  handleValidationErrors,
];

// GET — all authenticated entities can view the schedule
router.get(
  "/",
  authenticate,
  authorizeEntity("admin", "teacher", "student", "accountant"),
  classRoutineController.getAll
);

router.get(
  "/:id",
  authenticate,
  authorizeEntity("admin", "teacher", "student", "accountant"),
  validateMongoId,
  classRoutineController.getById
);

router.post(
  "/",
  authenticate, authorizeEntity("admin"),
  createRoutineValidation, handleValidationErrors,
  classRoutineController.create
);

router.patch(
  "/:id",
  authenticate, authorizeEntity("admin"),
  validateMongoId, updateRoutineValidation, handleValidationErrors,
  classRoutineController.update
);

router.patch(
  "/:id/status",
  authenticate, authorizeEntity("admin"),
  validateMongoId, updateRoutineStatusValidation, handleValidationErrors,
  classRoutineController.updateStatus
);

export default router;
