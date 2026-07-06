import { validationResult } from "express-validator";
import ApiError from "./ApiError.js";

/**
 * handleValidationErrors — shared express-validator result checker.
 * Place after any express-validator chain in a route middleware array.
 *
 * Usage:
 *   router.post('/', myValidation, handleValidationErrors, controller.create);
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field:   e.path,
      message: e.msg,
    }));
    return next(new ApiError(400, "Validation failed", "VALIDATION_ERROR", formatted));
  }
  next();
};

export default handleValidationErrors;
