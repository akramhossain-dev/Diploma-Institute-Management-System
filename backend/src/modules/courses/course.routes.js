import { Router } from "express";
import { param } from "express-validator";

import courseController from "./course.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import { createCourseValidation, updateCourseValidation } from "./course.validation.js";

const router = Router();

const validateMongoId = [
  param("id").isMongoId().withMessage("Invalid course ID"),
  handleValidationErrors,
];

// GET — public access
router.get(  "/public",     courseController.getPublic);

// GET — all authenticated entities
router.get(  "/",           authenticate, authorizeEntity("admin", "teacher", "student", "accountant"), courseController.getAll);
router.get(  "/:id",        authenticate, authorizeEntity("admin", "teacher", "student", "accountant"), validateMongoId, courseController.getById);

// Mutations — admin only
router.post( "/",           authenticate, authorizeEntity("admin"), createCourseValidation, handleValidationErrors, courseController.create);
router.patch("/:id",        authenticate, authorizeEntity("admin"), validateMongoId, updateCourseValidation, handleValidationErrors, courseController.update);
router.patch("/:id/status", authenticate, authorizeEntity("admin"), validateMongoId, courseController.toggleStatus);

export default router;
