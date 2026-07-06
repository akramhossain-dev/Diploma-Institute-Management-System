import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import instituteSettingsService from "./institute.service.js";

const instituteSettingsController = {

  // GET /api/institute-settings
  get: asyncHandler(async (req, res) => {
    const settings = await instituteSettingsService.getSettings();
    return successResponse(res, { statusCode: 200, message: "Institute settings retrieved", data: settings });
  }),

  // POST /api/institute-settings (initial creation — admin only)
  create: asyncHandler(async (req, res) => {
    const settings = await instituteSettingsService.createSettings(req.body, req.entityId);
    return successResponse(res, { statusCode: 201, message: "Institute settings initialized successfully", data: settings });
  }),

  // PATCH /api/institute-settings
  update: asyncHandler(async (req, res) => {
    const settings = await instituteSettingsService.updateSettings(req.body, req.entityId);
    return successResponse(res, { statusCode: 200, message: "Institute settings updated", data: settings });
  }),
};

export default instituteSettingsController;
