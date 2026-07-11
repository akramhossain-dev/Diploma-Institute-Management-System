import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import teacherService from "./teacher.service.js";

const teacherController = {

  create: asyncHandler(async (req, res) => {
    const teacher = await teacherService.createTeacher(req.body, req.entityId);
    return successResponse(res, {
      statusCode: 201,
      message: "Teacher created successfully. Login credentials sent to teacher.",
      data: teacher,
    });
  }),

  getAll: asyncHandler(async (req, res) => {
    const { teachers, pagination } = await teacherService.getAllTeachers(req.query);
    return successResponse(res, {
      statusCode: 200, message: "Teachers retrieved successfully",
      data: teachers, pagination,
    });
  }),

  getMe: asyncHandler(async (req, res) => {
    const teacher = await teacherService.getMyProfile(req.entityId);
    return successResponse(res, {
      statusCode: 200, message: "Profile retrieved successfully", data: teacher,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const teacher = await teacherService.getTeacherById(req.params.id);
    return successResponse(res, {
      statusCode: 200, message: "Teacher retrieved successfully", data: teacher,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const teacher = await teacherService.updateTeacher(req.params.id, req.body);
    return successResponse(res, {
      statusCode: 200, message: "Teacher updated successfully", data: teacher,
    });
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const teacher = await teacherService.updateStatus(req.params.id, req.body.status);
    return successResponse(res, {
      statusCode: 200, message: `Teacher status updated to '${teacher.status}'`, data: teacher,
    });
  }),

  assignCourses: asyncHandler(async (req, res) => {
    const teacher = await teacherService.assignCourses(req.params.id, req.body.courseIds);
    return successResponse(res, {
      statusCode: 200, message: "Courses assigned to teacher", data: teacher,
    });
  }),

  removeCourse: asyncHandler(async (req, res) => {
    const teacher = await teacherService.removeCourse(req.params.id, req.params.courseId);
    return successResponse(res, {
      statusCode: 200, message: "Course removed from teacher", data: teacher,
    });
  }),
};

export default teacherController;
