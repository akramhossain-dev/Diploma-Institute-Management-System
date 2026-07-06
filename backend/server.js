import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import env from "./src/config/env.js";
import logger from "./src/utils/logger.js";

const startServer = async () => {
  // Connect to MongoDB first
  await connectDB();

  // Start HTTP server
  const server = app.listen(env.PORT, () => {
    logger.info(`
────────────────────────────────────────────
  🏫 DIMS Backend Server
  🌐 Port     : ${env.PORT}
  🗄  Database : Connected
  🔧 Mode     : ${env.NODE_ENV}
  📅 Started  : ${new Date().toLocaleString()}
────────────────────────────────────────────`);
  });

  // ── Graceful Shutdown ─────────────────────────────────────────────────
  const shutdown = (signal) => {
    logger.warn(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      logger.info("HTTP server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // ── Unhandled Rejection / Exception Guards ────────────────────────────
  process.on("unhandledRejection", (reason) => {
    logger.error(`Unhandled Promise Rejection: ${reason}`);
    server.close(() => process.exit(1));
  });

  process.on("uncaughtException", (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    process.exit(1);
  });
};

startServer();
