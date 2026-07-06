import ApiError from "../utils/ApiError.js";
import { errorResponse } from "../utils/response.js";
import logger from "../utils/logger.js";
import env from "../config/env.js";

/**
 * Global Express error handler.
 * Must be registered LAST in app.js (after all routes).
 *
 * Handles:
 *  - ApiError (operational errors thrown intentionally)
 *  - Mongoose ValidationError
 *  - Mongoose CastError (invalid ObjectId)
 *  - Mongoose duplicate key error (code 11000)
 *  - JWT errors (reserved for Phase 2)
 *  - Unhandled system errors
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Log the error
  if (env.isProd && !err.isOperational) {
    logger.error(`[UNHANDLED] ${err.stack}`);
  } else {
    logger.error(err.stack || err.message);
  }

  // ── Operational: ApiError thrown intentionally ───────────────────────────
  if (err instanceof ApiError) {
    return errorResponse(res, {
      statusCode: err.statusCode,
      message: err.message,
      errorCode: err.errorCode,
      errors: err.errors,
    });
  }

  // ── Mongoose ValidationError ─────────────────────────────────────────────
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return errorResponse(res, {
      statusCode: 400,
      message: "Validation failed",
      errorCode: "VALIDATION_ERROR",
      errors,
    });
  }

  // ── Mongoose CastError (invalid ObjectId format) ─────────────────────────
  if (err.name === "CastError") {
    return errorResponse(res, {
      statusCode: 400,
      message: `Invalid value for field: ${err.path}`,
      errorCode: "INVALID_ID",
    });
  }

  // ── Mongoose Duplicate Key ────────────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, {
      statusCode: 409,
      message: `${field} already exists`,
      errorCode: "DUPLICATE_ENTRY",
      errors: [{ field, message: `${field} must be unique` }],
    });
  }

  // ── JWT Errors (Phase 2 reserved) ────────────────────────────────────────
  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, {
      statusCode: 401,
      message: "Invalid token",
      errorCode: "INVALID_TOKEN",
    });
  }

  if (err.name === "TokenExpiredError") {
    return errorResponse(res, {
      statusCode: 401,
      message: "Token has expired",
      errorCode: "TOKEN_EXPIRED",
    });
  }

  // ── Unhandled / Unknown Errors ────────────────────────────────────────────
  return errorResponse(res, {
    statusCode: 500,
    message: env.isProd ? "Internal server error" : err.message,
    errorCode: "INTERNAL_SERVER_ERROR",
  });
};

export default errorHandler;
