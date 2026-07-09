import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import resultService from "./result.service.js";

const resultController = {

  generateForStudent: asyncHandler(async (req, res) => {
    const result = await resultService.generateForStudent(req.params.examId, req.params.studentId, req.entityId);
    return successResponse(res, { statusCode: 201, message: "Result generated for student", data: result });
  }),

  bulkGenerateForExam: asyncHandler(async (req, res) => {
    const result = await resultService.bulkGenerateForExam(req.params.examId, req.entityId);
    return successResponse(res, { statusCode: 201, message: `Results generated for ${result.generatedCount} students`, data: result });
  }),

  getAll: asyncHandler(async (req, res) => {
    const { results, pagination } = await resultService.getAllResults(req.query);
    return successResponse(res, { statusCode: 200, message: "Results retrieved", data: results, pagination });
  }),

  getById: asyncHandler(async (req, res) => {
    const result = await resultService.getResultById(req.params.id);
    if (result && req.entityType === "student") {
      const resultStudentId = result.studentId?._id || result.studentId;
      if (String(resultStudentId) !== String(req.entityId)) {
        const { default: ApiError } = await import("../../utils/ApiError.js");
        throw new ApiError(403, "Access denied. You can only view your own result card.", "FORBIDDEN");
      }
    }
    return successResponse(res, { statusCode: 200, message: "Result retrieved", data: result });
  }),

  getByExamAndStudent: asyncHandler(async (req, res) => {
    const result = await resultService.getResultByExamAndStudent(req.params.examId, req.params.studentId);
    return successResponse(res, { statusCode: 200, message: "Result retrieved", data: result });
  }),

  publishResult: asyncHandler(async (req, res) => {
    const result = await resultService.publishResult(req.params.id);
    return successResponse(res, { statusCode: 200, message: "Result published", data: result });
  }),

  publishExamResults: asyncHandler(async (req, res) => {
    const result = await resultService.publishExamResults(req.params.examId);
    return successResponse(res, { statusCode: 200, message: `${result.publishedCount} results published`, data: result });
  }),
};
export default resultController;
