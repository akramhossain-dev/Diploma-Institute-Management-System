import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import admissionService from "./admission.service.js";

const admissionController = {

  // POST /api/admissions (public or authenticated)
  create: asyncHandler(async (req, res) => {
    const admission = await admissionService.createAdmission(req.body);
    return successResponse(res, {
      statusCode: 201,
      message: "Admission application submitted successfully",
      data: admission,
    });
  }),

  getAll: asyncHandler(async (req, res) => {
    const { admissions, pagination } = await admissionService.getAllAdmissions(req.query);
    return successResponse(res, { statusCode: 200, message: "Admissions retrieved", data: admissions, pagination });
  }),

  getById: asyncHandler(async (req, res) => {
    const admission = await admissionService.getAdmissionById(req.params.id);
    return successResponse(res, { statusCode: 200, message: "Admission retrieved", data: admission });
  }),

  update: asyncHandler(async (req, res) => {
    const admission = await admissionService.updateAdmission(req.params.id, req.body);
    return successResponse(res, { statusCode: 200, message: "Admission updated", data: admission });
  }),

  markReviewed: asyncHandler(async (req, res) => {
    const admission = await admissionService.markReviewed(req.params.id, req.entityId);
    return successResponse(res, { statusCode: 200, message: "Admission marked as reviewed", data: admission });
  }),

  approve: asyncHandler(async (req, res) => {
    const admission = await admissionService.approveAdmission(req.params.id, req.entityId);
    return successResponse(res, { statusCode: 200, message: "Admission approved successfully", data: admission });
  }),

  reject: asyncHandler(async (req, res) => {
    const { rejectionReason } = req.body;
    const admission = await admissionService.rejectAdmission(req.params.id, req.entityId, rejectionReason);
    return successResponse(res, { statusCode: 200, message: "Admission rejected", data: admission });
  }),

  cancel: asyncHandler(async (req, res) => {
    const admission = await admissionService.cancelAdmission(req.params.id, req.entityId);
    return successResponse(res, { statusCode: 200, message: "Admission cancelled", data: admission });
  }),

  convertToStudent: asyncHandler(async (req, res) => {
    const { password } = req.body;
    const result = await admissionService.convertToStudent(req.params.id, req.entityId, password);
    return successResponse(res, {
      statusCode: 201,
      message: `Admission converted to student successfully. Student ID: ${result.student.studentId}`,
      data: result,
    });
  }),
};

export default admissionController;
