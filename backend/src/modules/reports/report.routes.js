import { Router } from "express";
import reportController from "./report.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";
import { reportQueryValidation } from "./report.validation.js";

const router  = Router();
const adminAcc = [authenticate, authorizeEntity("admin", "accountant")];
const adminOnly = [authenticate, authorizeEntity("admin")];
const q = [...reportQueryValidation, handleValidationErrors];

router.get("/students",   ...adminOnly, q, reportController.students);
router.get("/attendance", ...adminOnly, q, reportController.attendance);
router.get("/results",    ...adminOnly, q, reportController.results);
router.get("/finance",    ...adminAcc,  q, reportController.finance);
router.get("/admissions", ...adminOnly, q, reportController.admissions);

export default router;
