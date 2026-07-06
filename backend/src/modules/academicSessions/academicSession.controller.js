import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import academicSessionService from "./academicSession.service.js";

const academicSessionController = {

  // POST /api/academic-sessions
  create: asyncHandler(async (req, res) => {
    const session = await academicSessionService.createSession(req.body, req.entityId);
    return successResponse(res, { statusCode: 201, message: "Academic session created successfully", data: session });
  }),

  // GET /api/academic-sessions
  getAll: asyncHandler(async (req, res) => {
    const { sessions, pagination } = await academicSessionService.getAllSessions(req.query);
    return successResponse(res, { statusCode: 200, message: "Academic sessions retrieved successfully", data: sessions, pagination });
  }),

  // GET /api/academic-sessions/current
  getCurrent: asyncHandler(async (req, res) => {
    const session = await academicSessionService.getCurrentSession();
    return successResponse(res, { statusCode: 200, message: "Current session retrieved successfully", data: session });
  }),

  // GET /api/academic-sessions/:id
  getById: asyncHandler(async (req, res) => {
    const session = await academicSessionService.getSessionById(req.params.id);
    return successResponse(res, { statusCode: 200, message: "Academic session retrieved successfully", data: session });
  }),

  // PATCH /api/academic-sessions/:id
  update: asyncHandler(async (req, res) => {
    const session = await academicSessionService.updateSession(req.params.id, req.body);
    return successResponse(res, { statusCode: 200, message: "Academic session updated successfully", data: session });
  }),

  // PATCH /api/academic-sessions/:id/set-current
  setCurrent: asyncHandler(async (req, res) => {
    const session = await academicSessionService.setCurrentSession(req.params.id);
    return successResponse(res, { statusCode: 200, message: `'${session.name}' is now the current academic session`, data: session });
  }),
};

export default academicSessionController;
