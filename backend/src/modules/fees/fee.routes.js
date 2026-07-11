import { Router } from "express";
import feeController from "./fee.controller.js";
import authenticate from "../../middlewares/authenticate.js";

const router = Router();

// All fees endpoints require authentication
router.use(authenticate);

router.get("/", feeController.getStudentFees);
router.get("/payments/history", feeController.getStudentPaymentHistory);
router.get("/summary", feeController.getStudentFeeSummary);

router.get("/overview", feeController.getFeesOverview);

export default router;
