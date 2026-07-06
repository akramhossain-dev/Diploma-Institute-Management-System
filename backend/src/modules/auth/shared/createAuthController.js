import asyncHandler from "../../../utils/asyncHandler.js";
import { successResponse } from "../../../utils/response.js";

const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

/**
 * createAuthController — factory that builds route handler methods
 * for any entity's auth module.
 *
 * Usage:
 *   import studentAuthService from "./studentAuth.service.js";
 *   export default createAuthController(studentAuthService);
 *
 * @param {object} service - Auth service instance (from createAuthService)
 */
export const createAuthController = (service) => ({
  // ── POST /login ───────────────────────────────────────────────────────────
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await service.login(email, password);

    // Set refresh token in httpOnly cookie
    res.cookie("refreshToken", result.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    return successResponse(res, {
      statusCode: 200,
      message: "Login successful",
      data: {
        accessToken: result.accessToken,
        entityType: result.entityType,
        profile: result.profile,
      },
    });
  }),

  // ── POST /logout ──────────────────────────────────────────────────────────
  logout: asyncHandler(async (req, res) => {
    // req.authId is set by authenticate middleware
    await service.logout(req.authId);

    // Clear the refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return successResponse(res, {
      statusCode: 200,
      message: "Logged out successfully",
      data: null,
    });
  }),

  // ── POST /refresh ─────────────────────────────────────────────────────────
  refresh: asyncHandler(async (req, res) => {
    // Accept refresh token from cookie (preferred) or body
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      const { default: ApiError } = await import("../../../utils/ApiError.js");
      throw new ApiError(401, "Refresh token is required", "UNAUTHORIZED");
    }

    const tokens = await service.refresh(refreshToken);

    // Rotate the cookie
    res.cookie("refreshToken", tokens.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

    return successResponse(res, {
      statusCode: 200,
      message: "Token refreshed successfully",
      data: { accessToken: tokens.accessToken },
    });
  }),

  // ── GET /me ───────────────────────────────────────────────────────────────
  getMe: asyncHandler(async (req, res) => {
    // req.entityId is set by authenticate middleware
    const result = await service.getMe(req.entityId);

    return successResponse(res, {
      statusCode: 200,
      message: "Profile retrieved successfully",
      data: result,
    });
  }),

  // ── PUT /change-password ──────────────────────────────────────────────────
  changePassword: asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    await service.changePassword(req.authId, currentPassword, newPassword);

    // Clear refresh token cookie to force re-login
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return successResponse(res, {
      statusCode: 200,
      message: "Password changed successfully. Please log in again.",
      data: null,
    });
  }),
});
