import { Router } from "express";
import { param } from "express-validator";
import paymentController from "./payment.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import { createPaymentValidation, reversePaymentValidation } from "./payment.validation.js";

const router = Router();
const validateId = [param("id").isMongoId().withMessage("Invalid payment ID"), handleValidationErrors];

router.patch(
  "/:id/reverse",
  authenticate, authorizeEntity("admin"),
  validateId, reversePaymentValidation, handleValidationErrors,
  paymentController.reverse
);

// Accountant or admin can record payments
router.post(
  "/",
  authenticate, authorizeEntity("accountant", "admin"),
  createPaymentValidation, handleValidationErrors,
  paymentController.create
);

// Both can view payments
router.get("/",    authenticate, authorizeEntity("admin", "accountant"), paymentController.getAll);
router.get("/:id", authenticate, authorizeEntity("admin", "accountant"), validateId, paymentController.getById);

export default router;
