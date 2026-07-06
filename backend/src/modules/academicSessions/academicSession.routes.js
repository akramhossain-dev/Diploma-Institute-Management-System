import { Router } from "express";
import { param } from "express-validator";

import academicSessionController from "./academicSession.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import { createSessionValidation, updateSessionValidation } from "./academicSession.validation.js";

const router = Router();

const validateMongoId = [
  param("id").isMongoId().withMessage("Invalid session ID"),
  handleValidationErrors,
];

// GET /current — MUST be defined before /:id to avoid route shadowing
router.get("/current",          authenticate, authorizeEntity("admin", "teacher", "student", "accountant"), academicSessionController.getCurrent);

// GET — all entities
router.get("/",                 authenticate, authorizeEntity("admin", "teacher", "student", "accountant"), academicSessionController.getAll);
router.get("/:id",              authenticate, authorizeEntity("admin", "teacher", "student", "accountant"), validateMongoId, academicSessionController.getById);

// Mutations — admin only
router.post("/",                authenticate, authorizeEntity("admin"), createSessionValidation, handleValidationErrors, academicSessionController.create);
router.patch("/:id",            authenticate, authorizeEntity("admin"), validateMongoId, updateSessionValidation, handleValidationErrors, academicSessionController.update);
router.patch("/:id/set-current",authenticate, authorizeEntity("admin"), validateMongoId, academicSessionController.setCurrent);

export default router;
