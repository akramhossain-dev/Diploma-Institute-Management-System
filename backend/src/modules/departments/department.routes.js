import { Router } from "express";
import { param } from "express-validator";

import departmentController from "./department.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import { createDepartmentValidation, updateDepartmentValidation } from "./department.validation.js";

const router = Router();

const validateMongoId = [
  param("id").isMongoId().withMessage("Invalid department ID"),
  handleValidationErrors,
];

// POST   /api/departments           — Admin only
router.post(  "/",            authenticate, authorizeEntity("admin"), createDepartmentValidation, handleValidationErrors, departmentController.create);

// GET    /api/departments           — Admin, teacher, student (public-facing structure)
router.get(   "/",            authenticate, authorizeEntity("admin", "teacher", "student", "accountant"), departmentController.getAll);

// GET    /api/departments/:id
router.get(   "/:id",         authenticate, authorizeEntity("admin", "teacher", "student", "accountant"), validateMongoId, departmentController.getById);

// PATCH  /api/departments/:id       — Admin only
router.patch( "/:id",         authenticate, authorizeEntity("admin"), validateMongoId, updateDepartmentValidation, handleValidationErrors, departmentController.update);

// PATCH  /api/departments/:id/status — Admin only
router.patch( "/:id/status",  authenticate, authorizeEntity("admin"), validateMongoId, departmentController.toggleStatus);

export default router;
