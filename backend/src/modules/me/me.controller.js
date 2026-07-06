import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import studentMeService from "./student.me.service.js";
import teacherMeService from "./teacher.me.service.js";
import accountantMeService from "./accountant.me.service.js";
import adminMeService from "./admin.me.service.js";

// ── Student ────────────────────────────────────────────────────────────────
export const studentMeController = {
  getProfile:    asyncHandler(async (req, res) => { const d = await studentMeService.getProfile(req.entityId);           return successResponse(res, { statusCode: 200, message: "Profile retrieved", data: d }); }),
  getNotices:    asyncHandler(async (req, res) => { const d = await studentMeService.getNotices(req.entityId, req.query); return successResponse(res, { statusCode: 200, message: "Notices retrieved", data: d }); }),
  getRoutine:    asyncHandler(async (req, res) => { const d = await studentMeService.getRoutine(req.entityId, req.query); return successResponse(res, { statusCode: 200, message: "Routine retrieved", data: d }); }),
  getAttendance: asyncHandler(async (req, res) => { const d = await studentMeService.getAttendance(req.entityId, req.query); return successResponse(res, { statusCode: 200, message: "Attendance retrieved", data: d }); }),
  getResults:    asyncHandler(async (req, res) => { const d = await studentMeService.getResults(req.entityId, req.query);    return successResponse(res, { statusCode: 200, message: "Results retrieved", data: d }); }),
  getFees:       asyncHandler(async (req, res) => { const d = await studentMeService.getFees(req.entityId, req.query);       return successResponse(res, { statusCode: 200, message: "Fee ledger retrieved", data: d }); }),
};

// ── Teacher ────────────────────────────────────────────────────────────────
export const teacherMeController = {
  getProfile:           asyncHandler(async (req, res) => { const d = await teacherMeService.getProfile(req.entityId);                    return successResponse(res, { statusCode: 200, message: "Profile retrieved", data: d }); }),
  getCourses:           asyncHandler(async (req, res) => { const d = await teacherMeService.getCourses(req.entityId, req.query);          return successResponse(res, { statusCode: 200, message: "Courses retrieved", data: d }); }),
  getRoutine:           asyncHandler(async (req, res) => { const d = await teacherMeService.getRoutine(req.entityId, req.query);          return successResponse(res, { statusCode: 200, message: "Routine retrieved", data: d }); }),
  getNotices:           asyncHandler(async (req, res) => { const d = await teacherMeService.getNotices(req.query);                       return successResponse(res, { statusCode: 200, message: "Notices retrieved", data: d }); }),
  getAttendanceSessions: asyncHandler(async (req, res) => { const d = await teacherMeService.getAttendanceSessions(req.entityId, req.query); return successResponse(res, { statusCode: 200, message: "Sessions retrieved", data: d }); }),
  getExamResponsibilities: asyncHandler(async (req, res) => { const d = await teacherMeService.getExamResponsibilities(req.entityId, req.query); return successResponse(res, { statusCode: 200, message: "Exam responsibilities retrieved", data: d }); }),
};

// ── Accountant ─────────────────────────────────────────────────────────────
export const accountantMeController = {
  getProfile:  asyncHandler(async (req, res) => { const d = await accountantMeService.getProfile(req.entityId);           return successResponse(res, { statusCode: 200, message: "Profile retrieved", data: d }); }),
  getPayments: asyncHandler(async (req, res) => { const d = await accountantMeService.getPayments(req.entityId, req.query); return successResponse(res, { statusCode: 200, message: "Payments retrieved", data: d }); }),
  getSummary:  asyncHandler(async (req, res) => { const d = await accountantMeService.getSummary(req.entityId);            return successResponse(res, { statusCode: 200, message: "Summary retrieved", data: d }); }),
  getNotices:  asyncHandler(async (req, res) => { const d = await accountantMeService.getNotices(req.query);               return successResponse(res, { statusCode: 200, message: "Notices retrieved", data: d }); }),
};

// ── Admin ──────────────────────────────────────────────────────────────────
export const adminMeController = {
  getProfile:   asyncHandler(async (req, res) => { const d = await adminMeService.getProfile(req.entityId);  return successResponse(res, { statusCode: 200, message: "Profile retrieved", data: d }); }),
  getNotices:   asyncHandler(async (req, res) => { const d = await adminMeService.getNotices(req.query);      return successResponse(res, { statusCode: 200, message: "Notices retrieved", data: d }); }),
  getDashboard: asyncHandler(async (req, res) => { const d = await adminMeService.getDashboard();             return successResponse(res, { statusCode: 200, message: "Dashboard retrieved", data: d }); }),
};
