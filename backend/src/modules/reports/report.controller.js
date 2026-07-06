import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import reportService from "./report.service.js";

const reportController = {
  students:   asyncHandler(async (req, res) => { const d = await reportService.getStudentReport(req.query);    return successResponse(res, { statusCode: 200, message: "Student report retrieved",    data: d }); }),
  attendance: asyncHandler(async (req, res) => { const d = await reportService.getAttendanceReport(req.query); return successResponse(res, { statusCode: 200, message: "Attendance report retrieved", data: d }); }),
  results:    asyncHandler(async (req, res) => { const d = await reportService.getResultReport(req.query);     return successResponse(res, { statusCode: 200, message: "Result report retrieved",     data: d }); }),
  finance:    asyncHandler(async (req, res) => { const d = await reportService.getFinanceReport(req.query);    return successResponse(res, { statusCode: 200, message: "Finance report retrieved",    data: d }); }),
  admissions: asyncHandler(async (req, res) => { const d = await reportService.getAdmissionReport(req.query); return successResponse(res, { statusCode: 200, message: "Admission report retrieved",  data: d }); }),
};
export default reportController;
