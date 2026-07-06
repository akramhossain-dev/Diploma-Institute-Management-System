import { Router } from "express";
import rateLimit from "express-rate-limit";
import teacherAuthController from "./teacherAuth.controller.js";
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
router.post("/login", loginLimiter, loginValidation, handleValidationErrors, teacherAuthController.login);
router.post("/refresh", teacherAuthController.refresh);

// ── Protected ─────────────────────────────────────────────────────────────
router.post("/logout",          authenticate, authorizeEntity("teacher"), teacherAuthController.logout);
router.get("/me",               authenticate, authorizeEntity("teacher"), teacherAuthController.getMe);
router.put("/change-password",  authenticate, authorizeEntity("teacher"), changePasswordValidation, handleValidationErrors, teacherAuthController.changePassword);

export default router;
