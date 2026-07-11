import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import courseService from "./course.service.js";

const courseController = {

  create: asyncHandler(async (req, res) => {
    const course = await courseService.createCourse(req.body, req.entityId);
    return successResponse(res, { statusCode: 201, message: "Course created successfully", data: course });
  }),

  getAll: asyncHandler(async (req, res) => {
    const { courses, pagination } = await courseService.getAllCourses(req.query);
    return successResponse(res, { statusCode: 200, message: "Courses retrieved successfully", data: courses, pagination });
  }),

  getPublic: asyncHandler(async (req, res) => {
    const { courses, pagination } = await courseService.getAllCourses({ ...req.query, status: "active" });
    return successResponse(res, { statusCode: 200, message: "Courses retrieved successfully", data: courses, pagination });
  }),

  getById: asyncHandler(async (req, res) => {
    const course = await courseService.getCourseById(req.params.id);
    return successResponse(res, { statusCode: 200, message: "Course retrieved successfully", data: course });
  }),

  update: asyncHandler(async (req, res) => {
    const course = await courseService.updateCourse(req.params.id, req.body);
    return successResponse(res, { statusCode: 200, message: "Course updated successfully", data: course });
  }),

  toggleStatus: asyncHandler(async (req, res) => {
    const course = await courseService.toggleStatus(req.params.id);
    return successResponse(res, {
      statusCode: 200,
      message: `Course ${course.status === "active" ? "activated" : "deactivated"}`,
      data: course,
    });
  }),
};

export default courseController;
