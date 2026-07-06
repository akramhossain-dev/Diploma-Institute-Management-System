import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password.
 * @param {string} password
 * @returns {Promise<string>} bcrypt hash
 */
export const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

/**
 * Compare a plain-text password against a stored hash.
 * @param {string} password   - Plain text from request
 * @param {string} hash       - Stored bcrypt hash
 * @returns {Promise<boolean>}
 */
export const comparePassword = (password, hash) => bcrypt.compare(password, hash);
