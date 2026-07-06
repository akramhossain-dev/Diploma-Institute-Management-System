import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import analyticsService from "./analytics.service.js";

const analyticsController = {
  students:   asyncHandler(async (req, res) => { const d = await analyticsService.getStudentAnalytics(req.query);    return successResponse(res, { statusCode: 200, message: "Student analytics retrieved",    data: d }); }),
  attendance: asyncHandler(async (req, res) => { const d = await analyticsService.getAttendanceAnalytics(req.query); return successResponse(res, { statusCode: 200, message: "Attendance analytics retrieved", data: d }); }),
  finance:    asyncHandler(async (req, res) => { const d = await analyticsService.getFinanceAnalytics(req.query);    return successResponse(res, { statusCode: 200, message: "Finance analytics retrieved",    data: d }); }),
  results:    asyncHandler(async (req, res) => { const d = await analyticsService.getResultAnalytics(req.query);     return successResponse(res, { statusCode: 200, message: "Result analytics retrieved",     data: d }); }),
};
export default analyticsController;
