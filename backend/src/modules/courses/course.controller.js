import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import courseService from "./course.service.js";

const courseController = {

  // POST /api/courses
  create: asyncHandler(async (req, res) => {
    const course = await courseService.createCourse(req.body, req.entityId);
    return successResponse(res, { statusCode: 201, message: "Course created successfully", data: course });
  }),

  // GET /api/courses
  getAll: asyncHandler(async (req, res) => {
    const { courses, pagination } = await courseService.getAllCourses(req.query);
    return successResponse(res, { statusCode: 200, message: "Courses retrieved successfully", data: courses, pagination });
  }),

  // GET /api/courses/:id
  getById: asyncHandler(async (req, res) => {
    const course = await courseService.getCourseById(req.params.id);
    return successResponse(res, { statusCode: 200, message: "Course retrieved successfully", data: course });
  }),

  // PATCH /api/courses/:id
  update: asyncHandler(async (req, res) => {
    const course = await courseService.updateCourse(req.params.id, req.body);
    return successResponse(res, { statusCode: 200, message: "Course updated successfully", data: course });
  }),

  // PATCH /api/courses/:id/status
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
