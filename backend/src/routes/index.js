import { Router } from "express";

// ── Auth routes ──────────────────────────────────────────────────────────
import studentAuthRoutes    from "../modules/auth/student/studentAuth.routes.js";
import teacherAuthRoutes    from "../modules/auth/teacher/teacherAuth.routes.js";
import accountantAuthRoutes from "../modules/auth/accountant/accountantAuth.routes.js";
import adminAuthRoutes      from "../modules/auth/admin/adminAuth.routes.js";

/**
 * Root API Router
 * All entity module routes are mounted here.
 *
 * Auth:       /api/auth/{student|teacher|accountant|admin}
 * Entities:   /api/{students|teachers|accountants|admins}   (Phase 3)
 * Academic:   /api/{courses|batches|exams|attendance}        (Phase 3)
 * Operations: /api/{results|fees|notices|admissions}         (Phase 3)
 * System:     /api/institute | /api/dashboard | /api/upload  (Phase 3)
 */
const router = Router();

// ── API Index ──────────────────────────────────────────────────────────────
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DIMS API v1.0 — Phase 2 Auth Layer Active",
    authEndpoints: {
      student:    "/api/auth/student/{login|logout|refresh|me|change-password}",
      teacher:    "/api/auth/teacher/{login|logout|refresh|me|change-password}",
      accountant: "/api/auth/accountant/{login|logout|refresh|me|change-password}",
      admin:      "/api/auth/admin/{login|logout|refresh|me|change-password}",
    },
  });
});

// ── Auth routes ────────────────────────────────────────────────────────────
router.use("/auth/student",    studentAuthRoutes);
router.use("/auth/teacher",    teacherAuthRoutes);
router.use("/auth/accountant", accountantAuthRoutes);
router.use("/auth/admin",      adminAuthRoutes);

// ── Entity & operational routes (mounted in Phase 3) ──────────────────────
// router.use("/students",    studentRoutes);
// router.use("/teachers",    teacherRoutes);
// router.use("/courses",     courseRoutes);
// ...

export default router;
