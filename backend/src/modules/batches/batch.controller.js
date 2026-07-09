import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import batchService from "./batch.service.js";

export const batchController = {
  getBatches: asyncHandler(async (req, res) => {
    const { batches, pagination } = await batchService.getBatches(req.query);
    return successResponse(res, {
      statusCode: 200,
      message: "Batches retrieved successfully",
      data: batches,
      pagination,
    });
  }),

  createBatch: asyncHandler(async (req, res) => {
    const batch = await batchService.createBatch(req.body);
    return successResponse(res, {
      statusCode: 201,
      message: "Batch created successfully",
      data: batch,
    });
  }),

  updateBatch: asyncHandler(async (req, res) => {
    const batch = await batchService.updateBatch(req.params.id, req.body);
    return successResponse(res, {
      statusCode: 200,
      message: "Batch updated successfully",
      data: batch,
    });
  }),

  deleteBatch: asyncHandler(async (req, res) => {
    await batchService.deleteBatch(req.params.id);
    return successResponse(res, {
      statusCode: 200,
      message: "Batch deleted successfully",
      data: null,
    });
  }),
};

export default batchController;
