import ApiError from "../utils/ApiError.js";

/**
 * 404 handler — catches all requests that don't match any route.
 * Must be registered AFTER all routes, BEFORE errorHandler.
 */
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`, "NOT_FOUND"));
};

export default notFound;
