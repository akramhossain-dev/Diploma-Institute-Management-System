import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import dashboardService from "./dashboard.service.js";

const dashboardController = {
  getAdmin:    asyncHandler(async (req, res) => { const d = await dashboardService.getAdminDashboard();          return successResponse(res, { statusCode: 200, message: "Dashboard data retrieved", data: d }); }),
  getFinance:  asyncHandler(async (req, res) => { const d = await dashboardService.getFinanceDashboard(req.query);  return successResponse(res, { statusCode: 200, message: "Finance dashboard retrieved", data: d }); }),
  getAcademic: asyncHandler(async (req, res) => { const d = await dashboardService.getAcademicDashboard(req.query); return successResponse(res, { statusCode: 200, message: "Academic dashboard retrieved", data: d }); }),
};
export default dashboardController;
