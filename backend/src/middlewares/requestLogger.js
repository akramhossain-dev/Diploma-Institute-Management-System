import morgan from "morgan";
import logger from "../utils/logger.js";
import env from "../config/env.js";

// Stream morgan output into winston logger
const stream = {
  write: (message) => logger.http(message.trim()),
};

// Concise format in prod, verbose in dev
const format = env.isDev ? "dev" : "combined";

const requestLogger = morgan(format, { stream });

export default requestLogger;
