import { Router } from "express";
import rateLimit from "express-rate-limit";

import studentAuthController from "./studentAuth.controller.js";
import authenticate from "../../../middlewares/authenticate.js";
import authorizeEntity from "../../../middlewares/authorizeEntity.js";
import {
  loginValidation,
  changePasswordValidation,
  handleValidationErrors,
} from "../shared/authValidation.js";

const router = Router();

// Strict rate limiter for login endpoint (brute-force protection)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts. Please try again in 15 minutes.",
    errorCode: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Public routes ─────────────────────────────────────────────────────────
router.post(
  "/login",
  loginLimiter,
  loginValidation,
  handleValidationErrors,
  studentAuthController.login
);

router.post("/refresh", studentAuthController.refresh);

// ── Protected routes (student must be authenticated) ──────────────────────
router.post(
  "/logout",
  authenticate,
  authorizeEntity("student"),
  studentAuthController.logout
);

router.get(
  "/me",
  authenticate,
  authorizeEntity("student"),
  studentAuthController.getMe
);

router.put(
  "/change-password",
  authenticate,
  authorizeEntity("student"),
  changePasswordValidation,
  handleValidationErrors,
  studentAuthController.changePassword
);

export default router;
