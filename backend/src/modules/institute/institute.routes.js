import { Router } from "express";

import instituteSettingsController from "./institute.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import { createSettingsValidation, updateSettingsValidation } from "./institute.validation.js";

const router = Router();

router.get(
  "/public",
  instituteSettingsController.getPublic
);

router.get(
  "/",
  authenticate,
  authorizeEntity("admin", "teacher", "student", "accountant"),
  instituteSettingsController.get
);

router.post(
  "/",
  authenticate, authorizeEntity("admin"),
  createSettingsValidation, handleValidationErrors,
  instituteSettingsController.create
);

router.patch(
  "/",
  authenticate, authorizeEntity("admin"),
  updateSettingsValidation, handleValidationErrors,
  instituteSettingsController.update
);

export default router;
