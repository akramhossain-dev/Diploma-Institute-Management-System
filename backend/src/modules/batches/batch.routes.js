import { Router } from "express";
import { body, param } from "express-validator";
import batchController from "./batch.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";

const router = Router();

const validateId = [
  param("id").isMongoId().withMessage("Invalid Batch ID"),
  handleValidationErrors,
];

router.use(authenticate, authorizeEntity("admin"));

router.get("/", batchController.getBatches);

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("name is required").trim(),
    body("code").notEmpty().withMessage("code is required").trim().toUpperCase(),
    body("academicSessionId").isMongoId().withMessage("Invalid Academic Session ID"),
    body("departmentId").isMongoId().withMessage("Invalid Department ID"),
    body("status").optional().isIn(["active", "inactive"]),
    handleValidationErrors,
  ],
  batchController.createBatch
);

router.put("/:id", validateId, batchController.updateBatch);

router.delete("/:id", validateId, batchController.deleteBatch);

export default router;
