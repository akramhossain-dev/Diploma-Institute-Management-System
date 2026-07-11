import crypto from "crypto";
import ApiError from "../../../utils/ApiError.js";
import { comparePassword, hashPassword } from "../../../utils/hashHelper.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../utils/generateToken.js";

/**
 * Hash a refresh token using SHA-256 before storing in the database.
 * The raw token is sent to the client; the hash is stored in MongoDB.
 * This prevents token hijacking if the database is compromised.
 */
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

/**
 * createAuthService — factory that builds a complete auth service
 * for any entity type.
 *
 * Each entity's service.js calls this factory with its own models:
 *   export default createAuthService({
 *     AuthModel: StudentAuth,
 *     EntityModel: Student,
 *     entityIdField: 'studentId',
 *     entityType: 'student',
 *   });
 *
 * @param {object} opts
 * @param {mongoose.Model} opts.AuthModel     - The entity's auth collection model
 * @param {mongoose.Model} opts.EntityModel   - The entity's profile collection model
 * @param {string}         opts.entityIdField - Field on AuthModel referencing EntityModel
 * @param {string}         opts.entityType    - 'student' | 'teacher' | 'accountant' | 'admin'
 */
export const createAuthService = ({ AuthModel, EntityModel, entityIdField, entityType }) => {
  
  const issueTokens = (authId, entityId) => ({
    accessToken: generateAccessToken({ authId, entityType, entityId }),
    refreshToken: generateRefreshToken({ authId, entityType, entityId }),
  });

  return {

    async login(email, password) {
      // 1. Find auth record — explicitly select passwordHash (hidden by default)
      const authRecord = await AuthModel
        .findOne({ email: email.toLowerCase().trim() })
        .select("+passwordHash +refreshToken");

      // Use generic message to prevent user enumeration
      if (!authRecord) {
        throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
      }

      if (!authRecord.isActive) {
        throw new ApiError(403, "Your account has been deactivated. Contact admin.", "ACCOUNT_INACTIVE");
      }

      const isMatch = await comparePassword(password, authRecord.passwordHash);
      if (!isMatch) {
        throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
      }

      const entityId = authRecord[entityIdField];
      const profile = await EntityModel.findById(entityId).lean();

      if (!profile) {
        throw new ApiError(500, "Entity profile not found", "PROFILE_NOT_FOUND");
      }

      const { accessToken, refreshToken } = issueTokens(authRecord._id, entityId);

      // 6. Persist HASHED refresh token + update lastLoginAt
      authRecord.refreshToken = hashToken(refreshToken);
      authRecord.lastLoginAt = new Date();
      await authRecord.save();

      // 7. Return — never expose passwordHash or refreshToken
      return {
        accessToken,
        refreshToken,
        entityType,
        profile: sanitizeProfile(profile),
      };
    },

    async logout(authId) {
      await AuthModel.findByIdAndUpdate(authId, {
        refreshToken: null,
      });
    },

    async refresh(refreshToken) {
      // 1. Verify the refresh token signature and expiry
      let decoded;
      try {
        decoded = verifyRefreshToken(refreshToken);
      } catch {
        throw new ApiError(401, "Invalid or expired refresh token", "INVALID_TOKEN");
      }

      if (decoded.entityType !== entityType) {
        throw new ApiError(401, "Token entity mismatch", "INVALID_TOKEN");
      }

      // 3. Load auth record and confirm stored token hash matches
      const authRecord = await AuthModel
        .findById(decoded.sub)
        .select("+refreshToken +isActive");

      if (!authRecord || authRecord.refreshToken !== hashToken(refreshToken)) {
        throw new ApiError(401, "Refresh token is invalid or already used", "INVALID_TOKEN");
      }

      if (!authRecord.isActive) {
        throw new ApiError(403, "Account is deactivated", "ACCOUNT_INACTIVE");
      }

      // 4. Rotate — issue new token pair, store new hash
      const entityId = authRecord[entityIdField];
      const tokens = issueTokens(authRecord._id, entityId);

      authRecord.refreshToken = hashToken(tokens.refreshToken);
      await authRecord.save();

      const profile = await EntityModel.findById(entityId).lean();
      const sanitizedProfile = profile ? sanitizeProfile(profile) : null;

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        profile: sanitizedProfile,
      };
    },

    // GET ME (load profile for currently authenticated entity)
    
    async getMe(entityId) {
      const profile = await EntityModel.findById(entityId).lean();
      if (!profile) {
        throw new ApiError(404, "Profile not found", "NOT_FOUND");
      }
      return { entityType, profile: sanitizeProfile(profile) };
    },

    async changePassword(authId, currentPassword, newPassword) {
      const authRecord = await AuthModel
        .findById(authId)
        .select("+passwordHash");

      if (!authRecord) {
        throw new ApiError(404, "Auth record not found", "NOT_FOUND");
      }

      const isMatch = await comparePassword(currentPassword, authRecord.passwordHash);
      if (!isMatch) {
        throw new ApiError(401, "Current password is incorrect", "INVALID_CREDENTIALS");
      }

      // Hash new password and invalidate all refresh tokens
      authRecord.passwordHash = await hashPassword(newPassword);
      authRecord.passwordChangedAt = new Date();
      authRecord.refreshToken = null; 
      authRecord.mustChangePassword = false;

      await authRecord.save();
    },
  };
};

const sanitizeProfile = (profile) => {
  const { passwordHash, refreshToken, __v, ...safe } = profile;
  return safe;
};
