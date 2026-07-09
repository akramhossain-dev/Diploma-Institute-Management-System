import { Router } from "express";
import { param } from "express-validator";
import studentFeeAssignmentController from "./studentFeeAssignment.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import validateStudentOwnership from "../../middlewares/validateStudentOwnership.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import {
  createAssignmentValidation,
  bulkAssignValidation,
  updateAssignmentValidation,
  updateAssignmentStatusValidation,
} from "./studentFeeAssignment.validation.js";

const router = Router();

const validateId        = [param("id").isMongoId().withMessage("Invalid assignment ID"), handleValidationErrors];
const validateStudentId = [param("studentId").isMongoId().withMessage("Invalid student ID"), handleValidationErrors];

// ── IMPORTANT: specific paths before /:id ──────────────────────────────────

// GET ledger/summary — admin, accountant, and the student themselves
router.get(
  "/ledger/students/:studentId",
  authenticate,
  authorizeEntity("admin", "accountant", "student"),
  validateStudentId,
  validateStudentOwnership("studentId"),
  studentFeeAssignmentController.getLedger
);

// Bulk assign — admin only
router.post(
  "/bulk-assign",
  authenticate, authorizeEntity("admin"),
  bulkAssignValidation, handleValidationErrors,
  studentFeeAssignmentController.bulkAssign
);

// Standard CRUD
router.post("/",              authenticate, authorizeEntity("admin"), createAssignmentValidation, handleValidationErrors, studentFeeAssignmentController.create);
router.get("/",               authenticate, authorizeEntity("admin", "accountant"), studentFeeAssignmentController.getAll);
router.get("/:id",            authenticate, authorizeEntity("admin", "accountant"), validateId, studentFeeAssignmentController.getById);
router.patch("/:id",          authenticate, authorizeEntity("admin"), validateId, updateAssignmentValidation, handleValidationErrors, studentFeeAssignmentController.update);
router.patch("/:id/status",   authenticate, authorizeEntity("admin"), validateId, updateAssignmentStatusValidation, handleValidationErrors, studentFeeAssignmentController.updateStatus);

export default router;
