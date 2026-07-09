import { Router } from "express";
import auditLogController from "./auditLog.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";

const router = Router();

// All audit-log endpoints are admin-only

// GET /api/audit-logs — paginated list with filters
router.get(
  "/",
  authenticate,
  authorizeEntity("admin"),
  auditLogController.getAuditLogs
);

// GET /api/audit-logs/filter-options — distinct modules/actions for UI dropdowns
router.get(
  "/filter-options",
  authenticate,
  authorizeEntity("admin"),
  auditLogController.getFilterOptions
);

export default router;
