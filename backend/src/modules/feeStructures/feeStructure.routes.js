import { Router } from "express";
import { param } from "express-validator";
import feeStructureController from "./feeStructure.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import { createFeeStructureValidation, updateFeeStructureValidation, updateFeeStructureStatusValidation } from "./feeStructure.validation.js";

const router = Router();
const validateId = [param("id").isMongoId().withMessage("Invalid fee structure ID"), handleValidationErrors];

router.get("/",    authenticate, authorizeEntity("admin", "accountant"), feeStructureController.getAll);
router.get("/:id", authenticate, authorizeEntity("admin", "accountant"), validateId, feeStructureController.getById);

router.post("/",           authenticate, authorizeEntity("admin"), createFeeStructureValidation, handleValidationErrors, feeStructureController.create);
router.patch("/:id",       authenticate, authorizeEntity("admin"), validateId, updateFeeStructureValidation, handleValidationErrors, feeStructureController.update);
router.patch("/:id/status", authenticate, authorizeEntity("admin"), validateId, updateFeeStructureStatusValidation, handleValidationErrors, feeStructureController.updateStatus);

export default router;
