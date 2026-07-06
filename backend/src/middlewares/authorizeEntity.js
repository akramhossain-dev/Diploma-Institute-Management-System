import ApiError from "../utils/ApiError.js";

/**
 * authorizeEntity — entity-type guard middleware factory.
 *
 * Restricts route access to specific entity types.
 * Must be used AFTER authenticate middleware.
 *
 * Usage:
 *   router.get('/students', authenticate, authorizeEntity('admin', 'teacher'), controller)
 *   router.get('/me',       authenticate, authorizeEntity('student'), controller)
 *
 * @param  {...string} allowedTypes - Allowed entity types
 * @returns Express middleware
 */
const authorizeEntity = (...allowedTypes) => {
  return (req, res, next) => {
    if (!req.entityType) {
      return next(new ApiError(401, "Not authenticated", "UNAUTHORIZED"));
    }

    if (!allowedTypes.includes(req.entityType)) {
      return next(
        new ApiError(
          403,
          `Access denied. This resource requires: ${allowedTypes.join(" or ")}`,
          "FORBIDDEN"
        )
      );
    }

    next();
  };
};

export default authorizeEntity;
