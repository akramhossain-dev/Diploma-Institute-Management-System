import { Router } from "express";
import dashboardController from "./dashboard.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";

const router = Router();
const adminOnly = [authenticate, authorizeEntity("admin")];

router.get("/",         ...adminOnly, dashboardController.getAdmin);
router.get("/finance",  ...adminOnly, dashboardController.getFinance);
router.get("/academic", ...adminOnly, dashboardController.getAcademic);

export default router;
