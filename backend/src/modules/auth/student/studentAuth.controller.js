import { createAuthController } from "../shared/createAuthController.js";
import studentAuthService from "./studentAuth.service.js";

/**
 * Student auth controller — all handlers built from shared factory.
 * Extend with Student-specific handlers here if needed.
 */
const studentAuthController = createAuthController(studentAuthService);

export default studentAuthController;
