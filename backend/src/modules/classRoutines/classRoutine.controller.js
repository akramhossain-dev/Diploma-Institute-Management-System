import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import classRoutineService from "./classRoutine.service.js";

const classRoutineController = {

  // POST /api/class-routines
  create: asyncHandler(async (req, res) => {
    const routine = await classRoutineService.createRoutine(req.body, req.entityId);
    return successResponse(res, { statusCode: 201, message: "Class routine created", data: routine });
  }),

  // GET /api/class-routines
  getAll: asyncHandler(async (req, res) => {
    const { routines, pagination } = await classRoutineService.getAllRoutines(req.query);
    return successResponse(res, { statusCode: 200, message: "Class routines retrieved", data: routines, pagination });
  }),

  // GET /api/class-routines/:id
  getById: asyncHandler(async (req, res) => {
    const routine = await classRoutineService.getRoutineById(req.params.id);
    return successResponse(res, { statusCode: 200, message: "Class routine retrieved", data: routine });
  }),

  // PATCH /api/class-routines/:id
  update: asyncHandler(async (req, res) => {
    const routine = await classRoutineService.updateRoutine(req.params.id, req.body);
    return successResponse(res, { statusCode: 200, message: "Class routine updated", data: routine });
  }),

  // PATCH /api/class-routines/:id/status
  updateStatus: asyncHandler(async (req, res) => {
    const routine = await classRoutineService.updateStatus(req.params.id, req.body.status);
    return successResponse(res, {
      statusCode: 200,
      message: `Routine status updated to '${routine.routineStatus}'`,
      data: routine,
    });
  }),
};

export default classRoutineController;
