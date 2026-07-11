import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import instituteSettingsService from "./institute.service.js";

const instituteSettingsController = {

  // GET /api/institute-settings — authenticated
  get: asyncHandler(async (req, res) => {
    const settings = await instituteSettingsService.getSettings();
    return successResponse(res, { statusCode: 200, message: "Institute settings retrieved", data: settings });
  }),

  // GET /api/institute/public — no auth required, public-safe fields only
  getPublic: asyncHandler(async (req, res) => {
    const settings = await instituteSettingsService.getSettings();
    if (!settings) {
      return successResponse(res, { statusCode: 200, message: "Institute settings not configured", data: null });
    }
    const publicData = {
      name:         settings.instituteName,
      code:         settings.shortName,
      established:  settings.established,
      address:      settings.address,
      email:        settings.email,
      phone:        settings.phone,
      website:      settings.website,
      admissionOpen: settings.admissionOpen ?? true,
      history:      settings.history,
      mission:      settings.mission,
      vision:       settings.vision,
    };
    return successResponse(res, { statusCode: 200, message: "Institute info retrieved", data: publicData });
  }),

  create: asyncHandler(async (req, res) => {
    const settings = await instituteSettingsService.createSettings(req.body, req.entityId);
    return successResponse(res, { statusCode: 201, message: "Institute settings initialized successfully", data: settings });
  }),

  update: asyncHandler(async (req, res) => {
    const settings = await instituteSettingsService.updateSettings(req.body, req.entityId);
    return successResponse(res, { statusCode: 200, message: "Institute settings updated", data: settings });
  }),
};

export default instituteSettingsController;
