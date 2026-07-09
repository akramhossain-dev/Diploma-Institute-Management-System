import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import fileService from "./file.service.js";

export const fileController = {
  getFiles: asyncHandler(async (req, res) => {
    const { files, pagination } = await fileService.getFiles(req.query);
    return successResponse(res, {
      statusCode: 200,
      message: "Files retrieved successfully",
      data: files,
      pagination,
    });
  }),

  uploadFile: asyncHandler(async (req, res) => {
    // Determine the name of the user who uploaded the file from auth payload
    const actorName = req.user?.name || req.user?.email || "Admin";
    const { moduleRef } = req.body;

    const fileRecord = await fileService.uploadFile(req.file, moduleRef, actorName);
    
    return successResponse(res, {
      statusCode: 201,
      message: "File uploaded successfully",
      data: fileRecord,
    });
  }),

  deleteFile: asyncHandler(async (req, res) => {
    await fileService.deleteFile(req.params.id);
    return successResponse(res, {
      statusCode: 200,
      message: "File deleted successfully",
      data: null,
    });
  }),
};

export default fileController;
