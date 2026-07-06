import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import accountantService from "./accountant.service.js";

const accountantController = {

  // POST /api/accountants
  create: asyncHandler(async (req, res) => {
    const accountant = await accountantService.createAccountant(req.body, req.entityId);
    return successResponse(res, {
      statusCode: 201,
      message: "Accountant created successfully. Login credentials sent to accountant.",
      data: accountant,
    });
  }),

  // GET /api/accountants
  getAll: asyncHandler(async (req, res) => {
    const { accountants, pagination } = await accountantService.getAllAccountants(req.query);
    return successResponse(res, {
      statusCode: 200, message: "Accountants retrieved successfully",
      data: accountants, pagination,
    });
  }),

  // GET /api/accountants/me
  getMe: asyncHandler(async (req, res) => {
    const accountant = await accountantService.getMyProfile(req.entityId);
    return successResponse(res, {
      statusCode: 200, message: "Profile retrieved successfully", data: accountant,
    });
  }),

  // GET /api/accountants/:id
  getById: asyncHandler(async (req, res) => {
    const accountant = await accountantService.getAccountantById(req.params.id);
    return successResponse(res, {
      statusCode: 200, message: "Accountant retrieved successfully", data: accountant,
    });
  }),

  // PATCH /api/accountants/:id
  update: asyncHandler(async (req, res) => {
    const accountant = await accountantService.updateAccountant(req.params.id, req.body);
    return successResponse(res, {
      statusCode: 200, message: "Accountant updated successfully", data: accountant,
    });
  }),

  // PATCH /api/accountants/:id/status
  updateStatus: asyncHandler(async (req, res) => {
    const accountant = await accountantService.updateStatus(req.params.id, req.body.status);
    return successResponse(res, {
      statusCode: 200, message: `Accountant status updated to '${accountant.status}'`, data: accountant,
    });
  }),
};

export default accountantController;
