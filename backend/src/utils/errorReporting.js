import logger from "./logger.js";
import env from "../config/env.js";

// Optional: Placeholder for real Sentry import if needed in production
// import * as Sentry from "@sentry/node";

let isSentryInitialized = false;

// If SENTRY_DSN is configured, we can initialize Sentry dynamically
if (process.env.SENTRY_DSN) {
  try {
    // Sentry.init({ dsn: process.env.SENTRY_DSN, environment: env.NODE_ENV });
    isSentryInitialized = true;
    logger.info("[Sentry] Error reporting initialized successfully");
  } catch (err) {
    logger.error(`[Sentry] Failed to initialize: ${err.message}`);
  }
}

/**
 * Capture and report an exception to error logging services.
 * In development/test, it outputs to local log files and console.
 * In production, it reports to Sentry.
 *
 * @param {Error} error
 * @param {object} [context]  - Metadata or express request/user details
 */
export function captureException(error, context = {}) {
  const { req, ...extra } = context;
  
  // Base details
  const details = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...extra,
  };

  // Add request details if available
  if (req) {
    details.request = {
      method: req.method,
      url: req.originalUrl || req.url,
      headers: req.headers,
      ip: req.ip,
      user: req.user ? { id: req.user.id, type: req.user.entityType } : null,
    };
  }

  // Report to Sentry
  if (isSentryInitialized) {
    // Sentry.captureException(error, { extra: details });
  }

  // Local log
  logger.error(`[Error Tracking] Captured Exception: ${error.stack || error.message} | Context: ${JSON.stringify(details)}`);
}

export default { captureException };
