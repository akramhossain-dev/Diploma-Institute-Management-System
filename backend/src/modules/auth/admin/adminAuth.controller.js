import { createAuthController } from "../shared/createAuthController.js";
import adminAuthService from "./adminAuth.service.js";

/**
 * Admin auth controller — all handlers built from shared factory.
 * Extend with Admin-specific handlers here if needed.
 */
const adminAuthController = createAuthController(adminAuthService);

export default adminAuthController;
