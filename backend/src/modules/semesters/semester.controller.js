import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import semesterService from "./semester.service.js";

const semesterController = {

  create: asyncHandler(async (req, res) => {
    const semester = await semesterService.createSemester(req.body);
    return successResponse(res, { statusCode: 201, message: "Semester created successfully", data: semester });
  }),

  getAll: asyncHandler(async (req, res) => {
    const semesters = await semesterService.getAllSemesters();
    return successResponse(res, { statusCode: 200, message: "Semesters retrieved successfully", data: semesters });
  }),

  getById: asyncHandler(async (req, res) => {
    const semester = await semesterService.getSemesterById(req.params.id);
    return successResponse(res, { statusCode: 200, message: "Semester retrieved successfully", data: semester });
  }),

  update: asyncHandler(async (req, res) => {
    const semester = await semesterService.updateSemester(req.params.id, req.body);
    return successResponse(res, { statusCode: 200, message: "Semester updated successfully", data: semester });
  }),

  toggleStatus: asyncHandler(async (req, res) => {
    const semester = await semesterService.toggleStatus(req.params.id);
    return successResponse(res, {
      statusCode: 200,
      message: `Semester ${semester.status === "active" ? "activated" : "deactivated"}`,
      data: semester,
    });
  }),
};

export default semesterController;
