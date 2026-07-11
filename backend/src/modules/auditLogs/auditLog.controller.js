import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import auditLogService from "./auditLog.service.js";

const auditLogController = {

  getAuditLogs: asyncHandler(async (req, res) => {
    const { logs, pagination } = await auditLogService.getAuditLogs(req.query);
    return successResponse(res, {
      statusCode: 200,
      message: "Audit logs retrieved",
      data: logs,
      pagination,
    });
  }),

  getFilterOptions: asyncHandler(async (req, res) => {
    const options = await auditLogService.getFilterOptions();
    return successResponse(res, {
      statusCode: 200,
      message: "Audit log filter options retrieved",
      data: options,
    });
  }),
};

export default auditLogController;
