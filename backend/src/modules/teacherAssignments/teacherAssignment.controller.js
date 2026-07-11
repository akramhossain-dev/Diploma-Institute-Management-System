import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import teacherAssignmentService from "./teacherAssignment.service.js";

const teacherAssignmentController = {

  create: asyncHandler(async (req, res) => {
    const assignment = await teacherAssignmentService.createAssignment(req.body, req.entityId);
    return successResponse(res, { statusCode: 201, message: "Teacher assignment created", data: assignment });
  }),

  getAll: asyncHandler(async (req, res) => {
    const { assignments, pagination } = await teacherAssignmentService.getAllAssignments(req.query);
    return successResponse(res, { statusCode: 200, message: "Assignments retrieved", data: assignments, pagination });
  }),

  getById: asyncHandler(async (req, res) => {
    const assignment = await teacherAssignmentService.getAssignmentById(req.params.id);
    return successResponse(res, { statusCode: 200, message: "Assignment retrieved", data: assignment });
  }),

  update: asyncHandler(async (req, res) => {
    const assignment = await teacherAssignmentService.updateAssignment(req.params.id, req.body);
    return successResponse(res, { statusCode: 200, message: "Assignment updated", data: assignment });
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const assignment = await teacherAssignmentService.updateStatus(req.params.id, req.body.status);
    return successResponse(res, {
      statusCode: 200,
      message: `Assignment status updated to '${assignment.assignmentStatus}'`,
      data: assignment,
    });
  }),
};

export default teacherAssignmentController;
