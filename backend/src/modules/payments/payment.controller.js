import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import paymentService from "./payment.service.js";

const paymentController = {

  create: asyncHandler(async (req, res) => {
    const collectorType = req.entityType === "admin" ? "admin" : "accountant";
    const payment = await paymentService.createPayment(req.body, req.entityId, collectorType);
    return successResponse(res, { statusCode: 201, message: "Payment recorded successfully", data: payment });
  }),

  getAll: asyncHandler(async (req, res) => {
    const { payments, pagination } = await paymentService.getAllPayments(req.query);
    return successResponse(res, { statusCode: 200, message: "Payments retrieved", data: payments, pagination });
  }),

  getById: asyncHandler(async (req, res) => {
    const payment = await paymentService.getPaymentById(req.params.id);
    return successResponse(res, { statusCode: 200, message: "Payment retrieved", data: payment });
  }),

  reverse: asyncHandler(async (req, res) => {
    const payment = await paymentService.reversePayment(req.params.id, req.body.reversalReason, req.entityId);
    return successResponse(res, { statusCode: 200, message: "Payment reversed and fee assignments restored", data: payment });
  }),
};
export default paymentController;
