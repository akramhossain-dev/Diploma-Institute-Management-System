import { Router } from "express";

import instituteSettingsController from "./institute.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import { createSettingsValidation, updateSettingsValidation } from "./institute.validation.js";

const router = Router();

// ── GET — accessible to all authenticated entities for reading config ──────
router.get(
  "/",
  authenticate,
  authorizeEntity("admin", "teacher", "student", "accountant"),
  instituteSettingsController.get
);

// ── POST — initial setup, admin only ──────────────────────────────────────
router.post(
  "/",
  authenticate, authorizeEntity("admin"),
  createSettingsValidation, handleValidationErrors,
  instituteSettingsController.create
);

// ── PATCH — update, admin only ────────────────────────────────────────────
router.patch(
  "/",
  authenticate, authorizeEntity("admin"),
  updateSettingsValidation, handleValidationErrors,
  instituteSettingsController.update
);

export default router;
