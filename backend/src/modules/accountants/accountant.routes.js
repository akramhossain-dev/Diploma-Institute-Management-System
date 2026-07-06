import { Router } from "express";
import { param } from "express-validator";

import accountantController from "./accountant.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import {
  createAccountantValidation,
  updateAccountantValidation,
  updateAccountantStatusValidation,
} from "./accountant.validation.js";

const router = Router();

const validateMongoId = [
  param("id").isMongoId().withMessage("Invalid accountant ID"),
  handleValidationErrors,
];

// ── Self-access ───────────────────────────────────────────────────────────
router.get("/me", authenticate, authorizeEntity("accountant"), accountantController.getMe);

// ── Admin: list accountants ───────────────────────────────────────────────
router.get("/",    authenticate, authorizeEntity("admin"), accountantController.getAll);
router.get("/:id", authenticate, authorizeEntity("admin"), validateMongoId, accountantController.getById);

// ── Admin: mutations ──────────────────────────────────────────────────────
router.post(  "/",           authenticate, authorizeEntity("admin"), createAccountantValidation,      handleValidationErrors, accountantController.create);
router.patch( "/:id",        authenticate, authorizeEntity("admin"), validateMongoId, updateAccountantValidation,      handleValidationErrors, accountantController.update);
router.patch( "/:id/status", authenticate, authorizeEntity("admin"), validateMongoId, updateAccountantStatusValidation, handleValidationErrors, accountantController.updateStatus);

export default router;
