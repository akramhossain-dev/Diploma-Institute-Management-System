import jwt from "jsonwebtoken";
import env from "../config/env.js";

/**
 * Builds the standard JWT payload for any entity type.
 *
 * @param {object} params
 * @param {string} params.authId     - Auth collection document _id (sub)
 * @param {string} params.entityType - 'student' | 'teacher' | 'accountant' | 'admin'
 * @param {string} params.entityId   - Entity collection document _id
 */
const buildPayload = ({ authId, entityType, entityId }) => ({
  sub: authId.toString(),
  entityType,
  entityId: entityId.toString(),
});

/**
 * Generate a short-lived access token (15m default).
 */
export const generateAccessToken = ({ authId, entityType, entityId }) => {
  return jwt.sign(
    buildPayload({ authId, entityType, entityId }),
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
};

/**
 * Generate a long-lived refresh token (7d default).
 */
export const generateRefreshToken = ({ authId, entityType, entityId }) => {
  return jwt.sign(
    buildPayload({ authId, entityType, entityId }),
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
  );
};

/**
 * Verify an access token. Throws JsonWebTokenError on failure.
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

/**
 * Verify a refresh token. Throws JsonWebTokenError on failure.
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
};
