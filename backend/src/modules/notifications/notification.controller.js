import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import notificationService from "./notification.service.js";

const notificationController = {

  getNotifications: asyncHandler(async (req, res) => {
    const { notifications, pagination } = await notificationService.getNotifications(req.query);
    return successResponse(res, {
      statusCode: 200,
      message: "Notifications retrieved",
      data: notifications,
      pagination,
    });
  }),

  createNotification: asyncHandler(async (req, res) => {
    const notification = await notificationService.createNotification(req.body);
    return successResponse(res, {
      statusCode: 201,
      message: "Notification created",
      data: notification,
    });
  }),

  markAsRead: asyncHandler(async (req, res) => {
    const notification = await notificationService.markAsRead(req.params.id);
    return successResponse(res, {
      statusCode: 200,
      message: "Notification marked as read",
      data: notification,
    });
  }),

  markAllAsRead: asyncHandler(async (req, res) => {
    const { recipientType } = req.body;
    const result = await notificationService.markAllAsRead(recipientType);
    return successResponse(res, {
      statusCode: 200,
      message: `Marked ${result.modifiedCount} notifications as read`,
      data: result,
    });
  }),

  deleteNotification: asyncHandler(async (req, res) => {
    await notificationService.deleteNotification(req.params.id);
    return successResponse(res, {
      statusCode: 200,
      message: "Notification deleted",
      data: null,
    });
  }),

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
