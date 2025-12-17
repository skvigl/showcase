import * as Sentry from "@sentry/node";

const enableSentry = process.env.DISABLE_SENTRY !== "true";

if (enableSentry) {
  if (!process.env.SENTRY_DSN) {
    console.error("❌ SENTRY_DSN is required.");
    process.exit(1);
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    // Add Tracing by setting tracesSampleRate
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}
