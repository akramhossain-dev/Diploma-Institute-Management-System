import { Router } from "express";
import analyticsController from "./analytics.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";

const router    = Router();
const adminOnly = [authenticate, authorizeEntity("admin")];

router.get("/students",   ...adminOnly, analyticsController.students);
router.get("/attendance", ...adminOnly, analyticsController.attendance);
router.get("/finance",    ...adminOnly, analyticsController.finance);
router.get("/results",    ...adminOnly, analyticsController.results);

export default router;
