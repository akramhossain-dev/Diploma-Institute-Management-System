import { Router } from "express";
import { param } from "express-validator";
import resultController from "./result.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";

const router = Router();

const validateId        = [param("id").isMongoId().withMessage("Invalid result ID"), handleValidationErrors];
const validateExamId    = [param("examId").isMongoId().withMessage("Invalid exam ID"), handleValidationErrors];
const validateStudentId = [param("studentId").isMongoId().withMessage("Invalid student ID"), handleValidationErrors];

// ── Generation (admin only) ───────────────────────────────────────────────
// IMPORTANT: specific routes must come before generic /:id routes
router.post(
  "/generate/exams/:examId/students/:studentId",
  authenticate, authorizeEntity("admin"),
  validateExamId, validateStudentId,
  resultController.generateForStudent
);

router.post(
  "/generate/exams/:examId",
  authenticate, authorizeEntity("admin"),
  validateExamId,
  resultController.bulkGenerateForExam
);

// ── Publish (admin only) ──────────────────────────────────────────────────
router.patch(
  "/publish/exams/:examId",
  authenticate, authorizeEntity("admin"),
  validateExamId,
  resultController.publishExamResults
);

router.patch(
  "/:id/publish",
  authenticate, authorizeEntity("admin"),
  validateId,
  resultController.publishResult
);

// ── Read endpoints ─────────────────────────────────────────────────────────
// Student-exam lookup (before /:id to avoid conflicts)
router.get(
  "/exams/:examId/students/:studentId",
  authenticate,
  authorizeEntity("admin", "teacher", "student"),
  validateExamId, validateStudentId,
  resultController.getByExamAndStudent
);

router.get(
  "/",
  authenticate,
  authorizeEntity("admin", "teacher"),
  resultController.getAll
);

router.get(
  "/:id",
  authenticate,
  authorizeEntity("admin", "teacher", "student"),
  validateId,
  resultController.getById
);

export default router;
