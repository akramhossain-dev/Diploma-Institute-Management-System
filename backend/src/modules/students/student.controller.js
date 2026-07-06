import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import studentService from "./student.service.js";

const studentController = {

  // POST /api/students
  create: asyncHandler(async (req, res) => {
    const student = await studentService.createStudent(req.body, req.entityId);
    return successResponse(res, {
      statusCode: 201,
      message: "Student created successfully. Login credentials sent to student.",
      data: student,
    });
  }),

  // GET /api/students
  getAll: asyncHandler(async (req, res) => {
    const { students, pagination } = await studentService.getAllStudents(req.query);
    return successResponse(res, {
      statusCode: 200, message: "Students retrieved successfully",
      data: students, pagination,
    });
  }),

  // GET /api/students/me  (called by authenticated student)
  getMe: asyncHandler(async (req, res) => {
    const student = await studentService.getMyProfile(req.entityId);
    return successResponse(res, {
      statusCode: 200, message: "Profile retrieved successfully", data: student,
    });
  }),

  // GET /api/students/:id
  getById: asyncHandler(async (req, res) => {
    const student = await studentService.getStudentById(req.params.id);
    return successResponse(res, {
      statusCode: 200, message: "Student retrieved successfully", data: student,
    });
  }),

  // PATCH /api/students/:id
  update: asyncHandler(async (req, res) => {
    const student = await studentService.updateStudent(req.params.id, req.body);
    return successResponse(res, {
      statusCode: 200, message: "Student updated successfully", data: student,
    });
  }),

  // PATCH /api/students/:id/status
  updateStatus: asyncHandler(async (req, res) => {
    const student = await studentService.updateStatus(req.params.id, req.body.status);
    return successResponse(res, {
      statusCode: 200,
      message: `Student status updated to '${student.status}'`,
      data: student,
    });
  }),
};

export default studentController;
