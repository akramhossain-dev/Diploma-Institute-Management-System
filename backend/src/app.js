import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import csrfProtection from "./middlewares/csrf.js";
import env from "./config/env.js";
import requestLogger from "./middlewares/requestLogger.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import routes from "./routes/index.js";

const app = express();

// ── Security ──────────────────────────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-xsrf-token", "x-csrf-token"],
  })
);

// ── Scoped Rate Limiting ──────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,                // Global rate limit of 1000 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    errorCode: "RATE_LIMIT_EXCEEDED",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,                  // Stricter limit to prevent brute force attacks on auth endpoints
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
    errorCode: "AUTH_RATE_LIMIT_EXCEEDED",
  },
});

// Apply stricter limit to auth endpoints and global limit to all other api endpoints
app.use("/api/auth", authLimiter);
app.use("/api", globalLimiter);

// ── Body Parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(csrfProtection);

// ── Request Logging ───────────────────────────────────────────────────────
app.use(requestLogger);

// ── Health Check ──────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DIMS API is running",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────
app.use("/api", routes);

// ── 404 Handler ───────────────────────────────────────────────────────────
app.use(notFound);

// ── Global Error Handler (must be last) ──────────────────────────────────
app.use(errorHandler);

export default app;
