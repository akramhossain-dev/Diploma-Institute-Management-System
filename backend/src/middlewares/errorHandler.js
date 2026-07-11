import ApiError from "../utils/ApiError.js";
import { errorResponse } from "../utils/response.js";
import logger from "../utils/logger.js";
import env from "../config/env.js";
import { captureException } from "../utils/errorReporting.js";

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  
  if (env.isProd && !err.isOperational) {
    logger.error(`[UNHANDLED] ${err.stack}`);
    captureException(err, { req, severity: "critical" });
  } else {
    logger.error(err.stack || err.message);
    if (!err.isOperational) {
      captureException(err, { req, severity: "error" });
    }
  }

  if (err instanceof ApiError) {
    return errorResponse(res, {
      statusCode: err.statusCode,
      message: err.message,
      errorCode: err.errorCode,
      errors: err.errors,
    });
  }

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

  if (err.name === "CastError") {
    return errorResponse(res, {
      statusCode: 400,
      message: `Invalid value for field: ${err.path}`,
      errorCode: "INVALID_ID",
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, {
      statusCode: 409,
      message: `${field} already exists`,
      errorCode: "DUPLICATE_ENTRY",
      errors: [{ field, message: `${field} must be unique` }],
    });
  }

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

  return errorResponse(res, {
    statusCode: 500,
    message: env.isProd ? "Internal server error" : err.message,
    errorCode: "INTERNAL_SERVER_ERROR",
  });
};

export default errorHandler;
