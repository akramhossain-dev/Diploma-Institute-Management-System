import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import markService from "./mark.service.js";

const markController = {

  bulkUpsert: asyncHandler(async (req, res) => {
    const markerType = req.entityType === "admin" ? "admin" : "teacher";
    const result = await markService.bulkUpsertMarks(req.body, req.entityId, markerType);
    return successResponse(res, { statusCode: 201, message: `Marks saved — inserted: ${result.inserted}, updated: ${result.updated}`, data: result });
  }),

  getAll: asyncHandler(async (req, res) => {
    const { marks, pagination } = await markService.getAllMarks(req.query);
    return successResponse(res, { statusCode: 200, message: "Marks retrieved", data: marks, pagination });
  }),

  getById: asyncHandler(async (req, res) => {
    const mark = await markService.getMarkById(req.params.id);
    return successResponse(res, { statusCode: 200, message: "Mark entry retrieved", data: mark });
  }),

  update: asyncHandler(async (req, res) => {
    const markerType = req.entityType === "admin" ? "admin" : "teacher";
    const mark = await markService.updateMark(req.params.id, req.body, req.entityId, markerType);
    return successResponse(res, { statusCode: 200, message: "Mark entry updated", data: mark });
  }),

  finalizeMarks: asyncHandler(async (req, res) => {
    const result = await markService.finalizeMarks(req.params.examCourseMappingId);
    return successResponse(res, { statusCode: 200, message: `${result.finalizedCount} mark(s) finalized`, data: result });
  }),
};
export default markController;
