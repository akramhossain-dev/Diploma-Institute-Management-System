import { Router } from "express";
import { param } from "express-validator";
import examCourseMappingController from "./examCourseMapping.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import { createMappingValidation, updateMappingValidation, updateMappingStatusValidation } from "./examCourseMapping.validation.js";

const router = Router();
const validateId = [param("id").isMongoId().withMessage("Invalid mapping ID"), handleValidationErrors];

router.get("/",    authenticate, authorizeEntity("admin", "teacher"), examCourseMappingController.getAll);
router.get("/:id", authenticate, authorizeEntity("admin", "teacher"), validateId, examCourseMappingController.getById);

router.post("/",               authenticate, authorizeEntity("admin"), createMappingValidation, handleValidationErrors, examCourseMappingController.create);
router.patch("/:id",           authenticate, authorizeEntity("admin"), validateId, updateMappingValidation, handleValidationErrors, examCourseMappingController.update);
router.patch("/:id/status",    authenticate, authorizeEntity("admin"), validateId, updateMappingStatusValidation, handleValidationErrors, examCourseMappingController.updateStatus);
router.patch("/:id/finalize",  authenticate, authorizeEntity("admin"), validateId, examCourseMappingController.finalizeEntry);

export default router;
