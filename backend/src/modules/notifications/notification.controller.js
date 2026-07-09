import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import notificationService from "./notification.service.js";

const notificationController = {

  // GET /api/notifications
  getNotifications: asyncHandler(async (req, res) => {
    const { notifications, pagination } = await notificationService.getNotifications(req.query);
    return successResponse(res, {
      statusCode: 200,
      message: "Notifications retrieved",
      data: notifications,
      pagination,
    });
  }),

  // POST /api/notifications
  createNotification: asyncHandler(async (req, res) => {
    const notification = await notificationService.createNotification(req.body);
    return successResponse(res, {
      statusCode: 201,
      message: "Notification created",
      data: notification,
    });
  }),

  // PATCH /api/notifications/:id/read
  markAsRead: asyncHandler(async (req, res) => {
    const notification = await notificationService.markAsRead(req.params.id);
    return successResponse(res, {
      statusCode: 200,
      message: "Notification marked as read",
      data: notification,
    });
  }),

  // POST /api/notifications/read-all
  markAllAsRead: asyncHandler(async (req, res) => {
    const { recipientType } = req.body;
    const result = await notificationService.markAllAsRead(recipientType);
    return successResponse(res, {
      statusCode: 200,
      message: `Marked ${result.modifiedCount} notifications as read`,
      data: result,
    });
  }),

  // DELETE /api/notifications/:id
  deleteNotification: asyncHandler(async (req, res) => {
    await notificationService.deleteNotification(req.params.id);
    return successResponse(res, {
      statusCode: 200,
      message: "Notification deleted",
      data: null,
    });
  }),

  // GET /api/notifications/unread-count
  getUnreadCount: asyncHandler(async (req, res) => {
    const count = await notificationService.getUnreadCount(req.query.recipientType);
    return successResponse(res, {
      statusCode: 200,
      message: "Unread notification count",
      data: { count },
    });
  }),
};

export default notificationController;
