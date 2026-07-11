import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/generateToken.js";

// Auth model registry — maps entityType to its auth Mongoose model
// Each model is lazy-imported to avoid circular dependency issues
const getAuthModel = async (entityType) => {
  switch (entityType) {
    case "student": {
      const { default: M } = await import("../modules/auth/student/studentAuth.model.js");
      return M;
    }
    case "teacher": {
      const { default: M } = await import("../modules/auth/teacher/teacherAuth.model.js");
      return M;
    }
    case "accountant": {
      const { default: M } = await import("../modules/auth/accountant/accountantAuth.model.js");
      return M;
    }
    case "admin": {
      const { default: M } = await import("../modules/auth/admin/adminAuth.model.js");
      return M;
    }
    default:
      return null;
  }
};

/**
 * authenticate — verifies the access token and attaches entity context to req.
 *
 * After this middleware:
 *   req.authId      → ObjectId of the auth collection document
 *   req.entityType  → 'student' | 'teacher' | 'accountant' | 'admin'
 *   req.entityId    → ObjectId of the entity profile document
 *
 * Does NOT load the full entity profile — lightweight by design.
 * Use GET /me or a profile-loading middleware for the full profile.
 */
const authenticate = asyncHandler(async (req, res, next) => {
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Access token is required", "UNAUTHORIZED");
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch {
    throw new ApiError(401, "Invalid or expired access token", "INVALID_TOKEN");
  }

  const { sub: authId, entityType, entityId } = decoded;

  const VALID_ENTITY_TYPES = ["student", "teacher", "accountant", "admin"];
  if (!VALID_ENTITY_TYPES.includes(entityType)) {
    throw new ApiError(401, "Invalid token entity type", "INVALID_TOKEN");
  }

  const AuthModel = await getAuthModel(entityType);
  const authRecord = await AuthModel.findById(authId).select("isActive");

  if (!authRecord) {
    throw new ApiError(401, "Auth record not found", "UNAUTHORIZED");
  }

  if (!authRecord.isActive) {
    throw new ApiError(403, "Your account has been deactivated", "ACCOUNT_INACTIVE");
  }

  req.authId = authId;
  req.entityType = entityType;
  req.entityId = entityId;

  next();
});

export default authenticate;
