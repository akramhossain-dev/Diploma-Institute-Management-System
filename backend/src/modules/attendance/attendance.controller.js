import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import attendanceService from "./attendance.service.js";

const attendanceController = {

  // POST /api/attendance/sessions
  createSession: asyncHandler(async (req, res) => {
    // Determine marker type from the authenticated entity
    const markerType = req.entityType === "admin" ? "admin" : "teacher";
    const session    = await attendanceService.createSessionWithAttendance(req.body, req.entityId, markerType);
    return successResponse(res, {
      statusCode: 201,
      message: "Attendance session created and records marked",
      data: session,
    });
  }),

  // GET /api/attendance/sessions
  getAllSessions: asyncHandler(async (req, res) => {
    const { sessions, pagination } = await attendanceService.getAllSessions(req.query);
    return successResponse(res, { statusCode: 200, message: "Attendance sessions retrieved", data: sessions, pagination });
  }),

  // GET /api/attendance/sessions/:id
  getSessionById: asyncHandler(async (req, res) => {
    const result = await attendanceService.getSessionById(req.params.id);
    return successResponse(res, { statusCode: 200, message: "Attendance session retrieved", data: result });
  }),

  // PATCH /api/attendance/sessions/:id
  updateSession: asyncHandler(async (req, res) => {
    const session = await attendanceService.updateSessionRecords(req.params.id, req.body.records, req.entityId, req.entityType);
    return successResponse(res, { statusCode: 200, message: "Attendance records updated", data: session });
  }),

  // PATCH /api/attendance/sessions/:id/finalize
  finalizeSession: asyncHandler(async (req, res) => {
    const session = await attendanceService.finalizeSession(req.params.id, req.entityId, req.entityType);
    return successResponse(res, { statusCode: 200, message: "Attendance session finalized and locked", data: session });
  }),

  getStudentAttendance: asyncHandler(async (req, res) => {
    const { records, pagination } = await attendanceService.getStudentAttendance(req.params.studentId, req.query);
    return successResponse(res, { statusCode: 200, message: "Student attendance records retrieved", data: records, pagination });
  }),

  getStudentSummary: asyncHandler(async (req, res) => {
    const summary = await attendanceService.getStudentAttendanceSummary(req.params.studentId, req.query);
    return successResponse(res, { statusCode: 200, message: "Student attendance summary retrieved", data: summary });
  }),

  getAdminSummary: asyncHandler(async (req, res) => {
    const summary = await attendanceService.getAdminAttendanceSummary(req.query);
    return successResponse(res, { statusCode: 200, message: "Attendance summary retrieved", data: summary });
  }),

  // GET /api/attendance/reports — admin-level paginated session reports
  getAdminReports: asyncHandler(async (req, res) => {
    const { reports, pagination } = await attendanceService.getAdminAttendanceReports(req.query);
    return successResponse(res, { statusCode: 200, message: "Attendance reports retrieved", data: reports, pagination });
  }),
};

export default attendanceController;
