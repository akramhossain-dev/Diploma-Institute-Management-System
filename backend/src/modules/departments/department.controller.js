import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import departmentService from "./department.service.js";

const departmentController = {

  // POST /api/departments
  create: asyncHandler(async (req, res) => {
    const dept = await departmentService.createDepartment(req.body, req.entityId);
    return successResponse(res, { statusCode: 201, message: "Department created successfully", data: dept });
  }),

  // GET /api/departments
  getAll: asyncHandler(async (req, res) => {
    const { departments, pagination } = await departmentService.getAllDepartments(req.query);
    return successResponse(res, { statusCode: 200, message: "Departments retrieved successfully", data: departments, pagination });
  }),

  // GET /api/departments/:id
  getById: asyncHandler(async (req, res) => {
    const dept = await departmentService.getDepartmentById(req.params.id);
    return successResponse(res, { statusCode: 200, message: "Department retrieved successfully", data: dept });
  }),

  // PATCH /api/departments/:id
  update: asyncHandler(async (req, res) => {
    const dept = await departmentService.updateDepartment(req.params.id, req.body);
    return successResponse(res, { statusCode: 200, message: "Department updated successfully", data: dept });
  }),

  // PATCH /api/departments/:id/status
  toggleStatus: asyncHandler(async (req, res) => {
    const dept = await departmentService.toggleStatus(req.params.id);
    return successResponse(res, {
      statusCode: 200,
      message: `Department ${dept.status === "active" ? "activated" : "deactivated"}`,
      data: dept,
    });
  }),
};

export default departmentController;
