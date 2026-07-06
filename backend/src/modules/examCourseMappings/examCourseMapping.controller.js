import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import examCourseMappingService from "./examCourseMapping.service.js";

const examCourseMappingController = {
  create:        asyncHandler(async (req, res) => { const m = await examCourseMappingService.createMapping(req.body, req.entityId); return successResponse(res, { statusCode: 201, message: "Course mapped to exam", data: m }); }),
  getAll:        asyncHandler(async (req, res) => { const { mappings, pagination } = await examCourseMappingService.getAllMappings(req.query); return successResponse(res, { statusCode: 200, message: "Mappings retrieved", data: mappings, pagination }); }),
  getById:       asyncHandler(async (req, res) => { const m = await examCourseMappingService.getMappingById(req.params.id); return successResponse(res, { statusCode: 200, message: "Mapping retrieved", data: m }); }),
  update:        asyncHandler(async (req, res) => { const m = await examCourseMappingService.updateMapping(req.params.id, req.body); return successResponse(res, { statusCode: 200, message: "Mapping updated", data: m }); }),
  updateStatus:  asyncHandler(async (req, res) => { const m = await examCourseMappingService.updateStatus(req.params.id, req.body.status); return successResponse(res, { statusCode: 200, message: "Mapping status updated", data: m }); }),
  finalizeEntry: asyncHandler(async (req, res) => { const m = await examCourseMappingService.finalizeMarksEntry(req.params.id, req.entityId); return successResponse(res, { statusCode: 200, message: "Marks entry finalized for this course", data: m }); }),
};
export default examCourseMappingController;
