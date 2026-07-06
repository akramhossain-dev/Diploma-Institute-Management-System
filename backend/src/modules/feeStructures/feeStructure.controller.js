import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import feeStructureService from "./feeStructure.service.js";

const feeStructureController = {
  create:       asyncHandler(async (req, res) => { const fs = await feeStructureService.createFeeStructure(req.body, req.entityId); return successResponse(res, { statusCode: 201, message: "Fee structure created", data: fs }); }),
  getAll:       asyncHandler(async (req, res) => { const { feeStructures, pagination } = await feeStructureService.getAllFeeStructures(req.query); return successResponse(res, { statusCode: 200, message: "Fee structures retrieved", data: feeStructures, pagination }); }),
  getById:      asyncHandler(async (req, res) => { const fs = await feeStructureService.getFeeStructureById(req.params.id); return successResponse(res, { statusCode: 200, message: "Fee structure retrieved", data: fs }); }),
  update:       asyncHandler(async (req, res) => { const fs = await feeStructureService.updateFeeStructure(req.params.id, req.body); return successResponse(res, { statusCode: 200, message: "Fee structure updated", data: fs }); }),
  updateStatus: asyncHandler(async (req, res) => { const fs = await feeStructureService.updateStatus(req.params.id, req.body.status); return successResponse(res, { statusCode: 200, message: `Fee structure status → '${fs.status}'`, data: fs }); }),
};
export default feeStructureController;
