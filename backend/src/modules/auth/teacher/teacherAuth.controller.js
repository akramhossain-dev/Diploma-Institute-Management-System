import { createAuthController } from "../shared/createAuthController.js";
import teacherAuthService from "./teacherAuth.service.js";

/**
 * Teacher auth controller — all handlers built from shared factory.
 * Extend with Teacher-specific handlers here if needed.
 */
const teacherAuthController = createAuthController(teacherAuthService);

export default teacherAuthController;
