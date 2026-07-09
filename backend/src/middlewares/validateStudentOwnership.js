import ApiError from "../utils/ApiError.js";

/**
 * Middleware to validate student ownership of resource params.
 * Prevents IDOR (Insecure Direct Object Reference) leaks between students.
 *
 * @param {string} paramName - Name of the route parameter containing the student ID (default "studentId")
 */
export const validateStudentOwnership = (paramName = "studentId") => {
  return (req, res, next) => {
    if (req.entityType === "student") {
      if (!req.entityId || String(req.entityId) !== String(req.params[paramName])) {
        return next(
          new ApiError(403, "Access denied. You can only view your own records.", "FORBIDDEN")
        );
      }
    }
    next();
  };
};

export default validateStudentOwnership;
