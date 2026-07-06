import { Router } from "express";
import { param } from "express-validator";

import noticeController from "./notice.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import { createNoticeValidation, updateNoticeValidation } from "./notice.validation.js";

const router = Router();

const validateMongoId = [
  param("id").isMongoId().withMessage("Invalid notice ID"),
  handleValidationErrors,
];

// ── IMPORTANT: /feed must be before /:id to prevent route shadowing ───────
// GET /api/notices/feed — entity-specific published notice feed
// All authenticated entities can access their relevant notices
router.get(
  "/feed",
  authenticate,
  authorizeEntity("student", "teacher", "accountant", "admin"),
  noticeController.getFeed
);

// ── Admin: full notice management ─────────────────────────────────────────
router.post(
  "/",
  authenticate, authorizeEntity("admin"),
  createNoticeValidation, handleValidationErrors,
  noticeController.create
);

// GET list — admin sees all; others use /feed
router.get(
  "/",
  authenticate, authorizeEntity("admin"),
  noticeController.getAll
);

// GET by ID — any authenticated entity can read a single notice
router.get(
  "/:id",
  authenticate,
  authorizeEntity("admin", "teacher", "student", "accountant"),
  validateMongoId,
  noticeController.getById
);

router.patch(
  "/:id",
  authenticate, authorizeEntity("admin"),
  validateMongoId, updateNoticeValidation, handleValidationErrors,
  noticeController.update
);

router.patch(
  "/:id/publish",
  authenticate, authorizeEntity("admin"),
  validateMongoId,
  noticeController.publish
);

router.patch(
  "/:id/archive",
  authenticate, authorizeEntity("admin"),
  validateMongoId,
  noticeController.archive
);

export default router;
