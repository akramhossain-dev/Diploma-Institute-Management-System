import morgan from "morgan";
import logger from "../utils/logger.js";
import env from "../config/env.js";

const stream = {
  write: (message) => logger.http(message.trim()),
};

const format = env.isDev ? "dev" : "combined";

const requestLogger = morgan(format, { stream });

export default requestLogger;
