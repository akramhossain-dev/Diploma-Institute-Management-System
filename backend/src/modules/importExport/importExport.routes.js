import { Router } from "express";
import importExportController from "./importExport.controller.js";
import uploadMiddleware from "../upload/upload.middleware.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";

const router = Router();

// Protect all routes
router.use(authenticate, authorizeEntity("admin"));

router.get("/jobs", importExportController.getImportJobs);

router.post(
  "/import/:module",
  uploadMiddleware.single("file"),
  importExportController.triggerImport
);

router.get("/export/:module", importExportController.triggerExport);

export default router;
