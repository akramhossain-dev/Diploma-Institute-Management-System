import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import studentFeeAssignmentService from "./studentFeeAssignment.service.js";

const studentFeeAssignmentController = {

  create: asyncHandler(async (req, res) => {
    const a = await studentFeeAssignmentService.createAssignment(req.body, req.entityId);
    return successResponse(res, { statusCode: 201, message: "Fee assigned to student", data: a });
  }),

  bulkAssign: asyncHandler(async (req, res) => {
    const result = await studentFeeAssignmentService.bulkAssign(req.body, req.entityId);
    return successResponse(res, { statusCode: 201, message: `Assigned: ${result.assigned}, Skipped (already assigned): ${result.skipped}`, data: result });
  }),

  getAll: asyncHandler(async (req, res) => {
    const { assignments, pagination } = await studentFeeAssignmentService.getAllAssignments(req.query);
    return successResponse(res, { statusCode: 200, message: "Fee assignments retrieved", data: assignments, pagination });
  }),

  getById: asyncHandler(async (req, res) => {
    const a = await studentFeeAssignmentService.getAssignmentById(req.params.id);
    return successResponse(res, { statusCode: 200, message: "Fee assignment retrieved", data: a });
  }),

  update: asyncHandler(async (req, res) => {
    const a = await studentFeeAssignmentService.updateAssignment(req.params.id, req.body);
    return successResponse(res, { statusCode: 200, message: "Fee assignment updated", data: a });
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const a = await studentFeeAssignmentService.updateStatus(req.params.id, req.body.status, req.body.notes);
    return successResponse(res, { statusCode: 200, message: `Fee assignment status → '${a.billingStatus}'`, data: a });
  }),

  // GET /api/student-fee-assignments/ledger/students/:studentId
  getLedger: asyncHandler(async (req, res) => {
    const ledger = await studentFeeAssignmentService.getStudentLedger(req.params.studentId, req.query);
    return successResponse(res, { statusCode: 200, message: "Student ledger retrieved", data: ledger });
  }),
};
export default studentFeeAssignmentController;
