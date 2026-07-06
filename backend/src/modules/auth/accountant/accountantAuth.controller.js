import { createAuthController } from "../shared/createAuthController.js";
import accountantAuthService from "./accountantAuth.service.js";

/**
 * Accountant auth controller — all handlers built from shared factory.
 * Extend with Accountant-specific handlers here if needed.
 */
const accountantAuthController = createAuthController(accountantAuthService);

export default accountantAuthController;
