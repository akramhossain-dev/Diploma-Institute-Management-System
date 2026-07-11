import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import noticeService from "./notice.service.js";

const noticeController = {

  create: asyncHandler(async (req, res) => {
    const notice = await noticeService.createNotice(req.body, req.entityId);
    return successResponse(res, { statusCode: 201, message: "Notice created as draft", data: notice });
  }),

  getAll: asyncHandler(async (req, res) => {
    const { notices, pagination } = await noticeService.getAllNotices(req.query);
    return successResponse(res, { statusCode: 200, message: "Notices retrieved", data: notices, pagination });
  }),

  // GET /api/notices/public — no auth required, published notices for public website
  getPublic: asyncHandler(async (req, res) => {
    const { notices, pagination } = await noticeService.getPublicNotices(req.query);
    return successResponse(res, { statusCode: 200, message: "Public notices retrieved", data: notices, pagination });
  }),

  getFeed: asyncHandler(async (req, res) => {
    const context = {
      departmentId:      req.query.departmentId,
      semesterId:        req.query.semesterId,
      academicSessionId: req.query.academicSessionId,
    };
    const { notices, pagination } = await noticeService.getNoticesForEntity(req.entityType, context, req.query);
    return successResponse(res, { statusCode: 200, message: "Notice feed retrieved", data: notices, pagination });
  }),

  getById: asyncHandler(async (req, res) => {
    const notice = await noticeService.getNoticeById(req.params.id);
    return successResponse(res, { statusCode: 200, message: "Notice retrieved", data: notice });
  }),

  update: asyncHandler(async (req, res) => {
    const notice = await noticeService.updateNotice(req.params.id, req.body, req.entityId);
    return successResponse(res, { statusCode: 200, message: "Notice updated", data: notice });
  }),

  publish: asyncHandler(async (req, res) => {
    const notice = await noticeService.publishNotice(req.params.id, req.entityId);
    return successResponse(res, { statusCode: 200, message: "Notice published successfully", data: notice });
  }),

  archive: asyncHandler(async (req, res) => {
    const notice = await noticeService.archiveNotice(req.params.id, req.entityId);
    return successResponse(res, { statusCode: 200, message: "Notice archived", data: notice });
  }),
};

export default noticeController;
