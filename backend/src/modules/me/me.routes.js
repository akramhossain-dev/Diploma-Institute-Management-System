import { Router } from "express";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import {
  studentMeController,
  teacherMeController,
  accountantMeController,
  adminMeController,
} from "./me.controller.js";

const router = Router();

// ── /api/me/student/* ──────────────────────────────────────────────────────
const studentRouter = Router();
studentRouter.use(authenticate, authorizeEntity("student"));
studentRouter.get("/profile",    studentMeController.getProfile);
studentRouter.get("/notices",    studentMeController.getNotices);
studentRouter.get("/routine",    studentMeController.getRoutine);
studentRouter.get("/attendance", studentMeController.getAttendance);
studentRouter.get("/results",    studentMeController.getResults);
studentRouter.get("/fees",       studentMeController.getFees);
router.use("/student", studentRouter);

// ── /api/me/teacher/* ──────────────────────────────────────────────────────
const teacherRouter = Router();
teacherRouter.use(authenticate, authorizeEntity("teacher"));
teacherRouter.get("/profile",              teacherMeController.getProfile);
teacherRouter.get("/courses",              teacherMeController.getCourses);
teacherRouter.get("/routine",              teacherMeController.getRoutine);
teacherRouter.get("/notices",              teacherMeController.getNotices);
teacherRouter.get("/attendance-sessions",  teacherMeController.getAttendanceSessions);
teacherRouter.get("/exam-responsibilities", teacherMeController.getExamResponsibilities);
router.use("/teacher", teacherRouter);

// ── /api/me/accountant/* ───────────────────────────────────────────────────
const accountantRouter = Router();
accountantRouter.use(authenticate, authorizeEntity("accountant"));
accountantRouter.get("/profile",  accountantMeController.getProfile);
accountantRouter.get("/payments", accountantMeController.getPayments);
accountantRouter.get("/summary",  accountantMeController.getSummary);
accountantRouter.get("/notices",  accountantMeController.getNotices);
router.use("/accountant", accountantRouter);

// ── /api/me/admin/* ────────────────────────────────────────────────────────
const adminRouter = Router();
adminRouter.use(authenticate, authorizeEntity("admin"));
adminRouter.get("/profile",   adminMeController.getProfile);
adminRouter.get("/notices",   adminMeController.getNotices);
adminRouter.get("/dashboard", adminMeController.getDashboard);
router.use("/admin", adminRouter);

export default router;
