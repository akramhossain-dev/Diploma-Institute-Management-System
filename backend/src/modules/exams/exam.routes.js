import { Router } from "express";
import { param } from "express-validator";
import examController from "./exam.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import { createExamValidation, updateExamValidation, updateExamStatusValidation } from "./exam.validation.js";

const router = Router();
const validateId = [param("id").isMongoId().withMessage("Invalid exam ID"), handleValidationErrors];

// Students/teachers can read exams
router.get("/",    authenticate, authorizeEntity("admin", "teacher", "student"), examController.getAll);
router.get("/:id", authenticate, authorizeEntity("admin", "teacher", "student"), validateId, examController.getById);

// Admin-only mutations
router.post("/",          authenticate, authorizeEntity("admin"), createExamValidation, handleValidationErrors, examController.create);
router.patch("/:id",      authenticate, authorizeEntity("admin"), validateId, updateExamValidation, handleValidationErrors, examController.update);
router.patch("/:id/status", authenticate, authorizeEntity("admin"), validateId, updateExamStatusValidation, handleValidationErrors, examController.updateStatus);

export default router;
