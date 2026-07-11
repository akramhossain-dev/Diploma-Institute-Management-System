import { Router } from "express";
import { param } from "express-validator";

import semesterController from "./semester.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import { createSemesterValidation, updateSemesterValidation } from "./semester.validation.js";

const router = Router();

const validateMongoId = [
  param("id").isMongoId().withMessage("Invalid semester ID"),
  handleValidationErrors,
];

// GET — all authenticated entities can list semesters
router.get(  "/",           authenticate, authorizeEntity("admin", "teacher", "student", "accountant"), semesterController.getAll);
router.get(  "/:id",        authenticate, authorizeEntity("admin", "teacher", "student", "accountant"), validateMongoId, semesterController.getById);

router.post( "/",           authenticate, authorizeEntity("admin"), createSemesterValidation, handleValidationErrors, semesterController.create);
router.patch("/:id",        authenticate, authorizeEntity("admin"), validateMongoId, updateSemesterValidation, handleValidationErrors, semesterController.update);
router.patch("/:id/status", authenticate, authorizeEntity("admin"), validateMongoId, semesterController.toggleStatus);

export default router;
