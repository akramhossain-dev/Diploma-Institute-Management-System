import { Router } from "express";
import rateLimit from "express-rate-limit";
import adminAuthController from "./adminAuth.controller.js";
import authenticate from "../../../middlewares/authenticate.js";
import authorizeEntity from "../../../middlewares/authorizeEntity.js";
import {
  loginValidation,
  changePasswordValidation,
  handleValidationErrors,
} from "../shared/authValidation.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts.", errorCode: "RATE_LIMIT_EXCEEDED" },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Public ────────────────────────────────────────────────────────────────
router.post("/login", loginLimiter, loginValidation, handleValidationErrors, adminAuthController.login);
router.post("/refresh", adminAuthController.refresh);

// ── Protected ─────────────────────────────────────────────────────────────
router.post("/logout",          authenticate, authorizeEntity("admin"), adminAuthController.logout);
router.get("/me",               authenticate, authorizeEntity("admin"), adminAuthController.getMe);
router.put("/change-password",  authenticate, authorizeEntity("admin"), changePasswordValidation, handleValidationErrors, adminAuthController.changePassword);

export default router;
