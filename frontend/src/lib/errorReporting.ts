let isSentryInitialized = false;

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  try {
    isSentryInitialized = true;
  } catch (err: any) {
    console.error('[Sentry Client] Failed to initialize:', err.message);
  }
}

export function captureException(error: Error, extraInfo?: Record<string, any>) {
  if (isSentryInitialized) {
    // Report to Sentry in production
  }

  console.error('[Logged Client Error]:', {
    message: error.message,
    stack: error.stack,
    digest: (error as any).digest,
    timestamp: new Date().toISOString(),
    ...extraInfo,
  });
}

const errorReporting = { captureException };
export default errorReporting;

