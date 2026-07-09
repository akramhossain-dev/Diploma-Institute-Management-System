import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import feeService from "./fee.service.js";
import ApiError from "../../utils/ApiError.js";

export const feeController = {
  getStudentFees: asyncHandler(async (req, res) => {
    // Only student role can fetch their own fees
    if (req.entityType !== "student") {
      throw new ApiError(403, "Access denied. Only students can query their fees.", "FORBIDDEN");
    }

    const fees = await feeService.getStudentFees(req.entityId);
    return successResponse(res, {
      statusCode: 200,
      message: "Student fees retrieved successfully",
      data: fees,
    });
  }),

  getStudentPaymentHistory: asyncHandler(async (req, res) => {
    if (req.entityType !== "student") {
      throw new ApiError(403, "Access denied. Only students can query their payment history.", "FORBIDDEN");
    }

    const history = await feeService.getStudentPaymentHistory(req.entityId);
    return successResponse(res, {
      statusCode: 200,
      message: "Student payment history retrieved successfully",
      data: history,
    });
  }),

  getStudentFeeSummary: asyncHandler(async (req, res) => {
    if (req.entityType !== "student") {
      throw new ApiError(403, "Access denied. Only students can query their fee summary.", "FORBIDDEN");
    }

    const summary = await feeService.getStudentFeeSummary(req.entityId);
    return successResponse(res, {
      statusCode: 200,
      message: "Student fee summary retrieved successfully",
      data: summary,
    });
  }),

  getFeesOverview: asyncHandler(async (req, res) => {
    // Only accountant or admin can see the general overview
    if (req.entityType !== "accountant" && req.entityType !== "admin") {
      throw new ApiError(403, "Access denied. Requires accountant or admin privileges.", "FORBIDDEN");
    }

    const overview = await feeService.getFeesOverview();
    return successResponse(res, {
      statusCode: 200,
      message: "Fees billing overview retrieved successfully",
      data: overview,
    });
  }),
};

export default feeController;
