import { Router } from "express";
import rateLimit from "express-rate-limit";
import accountantAuthController from "./accountantAuth.controller.js";
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

router.post("/login", loginLimiter, loginValidation, handleValidationErrors, accountantAuthController.login);
router.post("/refresh", accountantAuthController.refresh);

router.post("/logout",          authenticate, authorizeEntity("accountant"), accountantAuthController.logout);
router.get("/me",               authenticate, authorizeEntity("accountant"), accountantAuthController.getMe);
router.put("/change-password",  authenticate, authorizeEntity("accountant"), changePasswordValidation, handleValidationErrors, accountantAuthController.changePassword);

export default router;
