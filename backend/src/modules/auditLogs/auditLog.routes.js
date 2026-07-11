import { Router } from "express";
import auditLogController from "./auditLog.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";

const router = Router();

router.get(
  "/",
  authenticate,
  authorizeEntity("admin"),
  auditLogController.getAuditLogs
);

router.get(
  "/filter-options",
  authenticate,
  authorizeEntity("admin"),
  auditLogController.getFilterOptions
);

export default router;
