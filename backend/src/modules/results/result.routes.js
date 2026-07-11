import { Router } from "express";
import { param } from "express-validator";
import resultController from "./result.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import validateStudentOwnership from "../../middlewares/validateStudentOwnership.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";

const router = Router();

const validateId        = [param("id").isMongoId().withMessage("Invalid result ID"), handleValidationErrors];
const validateExamId    = [param("examId").isMongoId().withMessage("Invalid exam ID"), handleValidationErrors];
const validateStudentId = [param("studentId").isMongoId().withMessage("Invalid student ID"), handleValidationErrors];

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

router.get(
  "/exams/:examId/students/:studentId",
  authenticate,
  authorizeEntity("admin", "teacher", "student"),
  validateExamId, validateStudentId,
  validateStudentOwnership("studentId"),
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
