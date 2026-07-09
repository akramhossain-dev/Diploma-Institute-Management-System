import crypto from "crypto";
import env from "../config/env.js";

const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];

/**
 * Double Submit Cookie CSRF Protection Middleware
 *
 * How it works:
 * 1. For all requests (specifically GETs), if the "XSRF-TOKEN" cookie is missing,
 *    we generate a random 32-byte token and set it in the "XSRF-TOKEN" cookie.
 * 2. This cookie is NOT HttpOnly, allowing client-side JS (like Axios) to read it.
 * 3. Axios automatically reads this cookie and includes it in the "X-XSRF-TOKEN" header
 *    on all mutating requests (POST, PUT, PATCH, DELETE).
 * 4. For mutating requests, we verify that the "X-XSRF-TOKEN" header matches the
 *    "XSRF-TOKEN" cookie. If they match, the request is authentic.
 */
export const csrfProtection = (req, res, next) => {
  // 1. Ensure cookie exists
  let csrfToken = req.cookies["XSRF-TOKEN"];
  
  if (!csrfToken) {
    csrfToken = crypto.randomBytes(32).toString("hex");
    // Set cookie, make sure path=/ is set so it works across all routes
    res.cookie("XSRF-TOKEN", csrfToken, {
      path: "/",
      sameSite: "lax",
      secure: env.isProd,
      httpOnly: false, // Must be readable by Axios
    });
  }

  // 2. Bypass safe methods or development environment
  if (SAFE_METHODS.includes(req.method) || env.isDev) {
    return next();
  }

  // 3. Verify token for mutating methods
  const headerToken = req.headers["x-xsrf-token"] || req.headers["x-csrf-token"];

  if (!headerToken || headerToken !== csrfToken) {
    return res.status(403).json({
      success: false,
      message: "CSRF token validation failed or mismatch. Access Denied.",
      errorCode: "CSRF_ERROR",
    });
  }

  next();
};

export default csrfProtection;
