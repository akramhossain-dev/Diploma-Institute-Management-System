import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import examService from "./exam.service.js";

const examController = {
  create:       asyncHandler(async (req, res) => { const e = await examService.createExam(req.body, req.entityId); return successResponse(res, { statusCode: 201, message: "Exam created", data: e }); }),
  getAll:       asyncHandler(async (req, res) => { const { exams, pagination } = await examService.getAllExams(req.query); return successResponse(res, { statusCode: 200, message: "Exams retrieved", data: exams, pagination }); }),
  getById:      asyncHandler(async (req, res) => { const e = await examService.getExamById(req.params.id); return successResponse(res, { statusCode: 200, message: "Exam retrieved", data: e }); }),
  update:       asyncHandler(async (req, res) => { const e = await examService.updateExam(req.params.id, req.body); return successResponse(res, { statusCode: 200, message: "Exam updated", data: e }); }),
  updateStatus: asyncHandler(async (req, res) => { const e = await examService.updateStatus(req.params.id, req.body.status, req.entityId); return successResponse(res, { statusCode: 200, message: `Exam status → '${e.examStatus}'`, data: e }); }),
};
export default examController;
