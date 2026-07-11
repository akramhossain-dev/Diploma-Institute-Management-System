import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import adminService from "./admin.service.js";

const adminController = {

  create: asyncHandler(async (req, res) => {
    const admin = await adminService.createAdmin(req.body, req.entityId);
    return successResponse(res, {
      statusCode: 201,
      message: "Admin created successfully. Temporary credentials sent.",
      data: admin,
    });
  }),

  getAll: asyncHandler(async (req, res) => {
    const { admins, pagination } = await adminService.getAllAdmins(req.query);
    return successResponse(res, {
      statusCode: 200,
      message: "Admins retrieved successfully",
      data: admins,
      pagination,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const admin = await adminService.getAdminById(req.params.id);
    return successResponse(res, {
      statusCode: 200,
      message: "Admin retrieved successfully",
      data: admin,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const admin = await adminService.updateAdmin(req.params.id, req.body);
    return successResponse(res, {
      statusCode: 200,
      message: "Admin updated successfully",
      data: admin,
    });
  }),

  toggleStatus: asyncHandler(async (req, res) => {
    const admin = await adminService.toggleStatus(req.params.id);
    return successResponse(res, {
      statusCode: 200,
      message: `Admin ${admin.status === "active" ? "activated" : "deactivated"} successfully`,
      data: admin,
    });
  }),
};

export default adminController;
