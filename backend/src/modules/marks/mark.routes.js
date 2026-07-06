import { Router } from "express";
import { param } from "express-validator";
import markController from "./mark.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import { bulkMarksValidation, updateMarkValidation } from "./mark.validation.js";

const router = Router();
const validateId    = [param("id").isMongoId().withMessage("Invalid mark ID"), handleValidationErrors];
const validateMapId = [param("examCourseMappingId").isMongoId().withMessage("Invalid examCourseMappingId"), handleValidationErrors];

// Bulk upsert — teacher or admin
router.post("/bulk", authenticate, authorizeEntity("teacher", "admin"), bulkMarksValidation, handleValidationErrors, markController.bulkUpsert);

// Read — admin and teacher
router.get("/",    authenticate, authorizeEntity("admin", "teacher"), markController.getAll);
router.get("/:id", authenticate, authorizeEntity("admin", "teacher"), validateId, markController.getById);

// Update single mark — teacher or admin
router.patch("/:id", authenticate, authorizeEntity("teacher", "admin"), validateId, updateMarkValidation, handleValidationErrors, markController.update);

// Finalize all marks for a mapping — admin only
router.patch("/finalize/:examCourseMappingId", authenticate, authorizeEntity("admin"), validateMapId, markController.finalizeMarks);

export default router;
