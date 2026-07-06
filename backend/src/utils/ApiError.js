/**
 * ApiError — Custom error class for all application-level errors.
 * Throw this from services or controllers to produce structured error responses.
 *
 * Usage:
 *   throw new ApiError(404, "Student not found", "NOT_FOUND");
 */
class ApiError extends Error {
  constructor(statusCode, message, errorCode = "APP_ERROR", errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    this.isOperational = true; // distinguishes from unexpected system errors

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
