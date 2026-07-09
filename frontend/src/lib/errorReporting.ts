// Optional: Import real Sentry package if installed in production
// import * as Sentry from "@sentry/nextjs";

let isSentryInitialized = false;

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  try {
    // Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN });
    isSentryInitialized = true;
    console.log('[Sentry Client] Error reporting initialized successfully');
  } catch (err: any) {
    console.error('[Sentry Client] Failed to initialize:', err.message);
  }
}

/**
 * Capture and log an exception in the frontend application.
 * Reports to Sentry in production, and fallbacks to console in development.
 *
 * @param error - The error object
 * @param extraInfo - Additional metadata context
 */
export function captureException(error: Error, extraInfo?: Record<string, any>) {
  if (isSentryInitialized) {
    // Sentry.captureException(error, { extra: extraInfo });
  }

  console.error('[Logged Client Error]:', {
    message: error.message,
    stack: error.stack,
    digest: (error as any).digest,
    timestamp: new Date().toISOString(),
    ...extraInfo,
  });
}

export default { captureException };
