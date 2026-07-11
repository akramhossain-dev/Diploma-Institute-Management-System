import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import importExportService from "./importExport.service.js";

export const importExportController = {
  getImportJobs: asyncHandler(async (req, res) => {
    const jobs = await importExportService.getImportJobs();
    return successResponse(res, {
      statusCode: 200,
      message: "Import jobs retrieved successfully",
      data: jobs,
    });
  }),

  triggerImport: asyncHandler(async (req, res) => {
    const { module: moduleName } = req.params;
    const job = await importExportService.triggerImport(moduleName, req.file);
    return successResponse(res, {
      statusCode: 200,
      message: "Import file parsed and processed",
      data: job,
    });
  }),

  triggerExport: asyncHandler(async (req, res) => {
    const { module: moduleName } = req.params;
    const csvContent = await importExportService.triggerExport(moduleName);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=export_${moduleName}_${Date.now()}.csv`);
    
    return res.status(200).send(csvContent);
  }),
};

export default importExportController;
