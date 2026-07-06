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

// POST   /api/admins         — Create admin (super admin only in future; for now any admin)
router.post(   "/",             createAdminValidation, handleValidationErrors, adminController.create);

// GET    /api/admins         — List all admins
router.get(    "/",             adminController.getAll);

// GET    /api/admins/:id     — Get single admin
router.get(    "/:id",          validateMongoId, adminController.getById);

// PATCH  /api/admins/:id     — Update admin profile
router.patch(  "/:id",          validateMongoId, updateAdminValidation, handleValidationErrors, adminController.update);

// PATCH  /api/admins/:id/status — Toggle active/inactive
router.patch(  "/:id/status",   validateMongoId, adminController.toggleStatus);

export default router;
