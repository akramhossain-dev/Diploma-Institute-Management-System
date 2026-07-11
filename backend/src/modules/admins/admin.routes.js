import { Router } from "express";
import { param } from "express-validator";

import adminController from "./admin.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import { createAdminValidation, updateAdminValidation } from "./admin.validation.js";

const router = Router();

// All admin management routes require authentication as an admin
router.use(authenticate, authorizeEntity("admin"));

const validateMongoId = [
  param("id").isMongoId().withMessage("Invalid admin ID"),
  handleValidationErrors,
];

router.post(   "/",             createAdminValidation, handleValidationErrors, adminController.create);

router.get(    "/",             adminController.getAll);

router.get(    "/:id",          validateMongoId, adminController.getById);

router.patch(  "/:id",          validateMongoId, updateAdminValidation, handleValidationErrors, adminController.update);

router.patch(  "/:id/status",   validateMongoId, adminController.toggleStatus);

export default router;
