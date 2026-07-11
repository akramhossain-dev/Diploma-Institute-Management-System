import Notification from "./notification.model.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const notificationService = {

  async getNotifications(query = {}) {
    const { page, limit, skip } = getPaginationParams(query);
    const { recipientType, read, type } = query;

    const filter = {};
    if (recipientType && recipientType !== "all") filter.recipientType = recipientType;
    if (read !== undefined) filter.read = read === "true";
    if (type) filter.type = type;

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(filter),
    ]);

    return { notifications, pagination: buildPaginationMeta(total, page, limit) };
  },

  async createNotification({ recipientType, recipientId = null, title, message, type = "info", targetLink = null, createdBy = "system" }) {
    const notification = await Notification.create({
      recipientType,
      recipientId,
      title,
      message,
      type,
      targetLink,
      createdBy,
    });
    return notification;
  },

  async markAsRead(id) {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { $set: { read: true } },
      { new: true }
    );
    if (!notification) throw new ApiError(404, "Notification not found", "NOT_FOUND");
    return notification;
  },

  async markAllAsRead(recipientType) {
    const filter = { read: false };
    if (recipientType && recipientType !== "all") filter.recipientType = recipientType;

    const result = await Notification.updateMany(filter, { $set: { read: true } });
    return { modifiedCount: result.modifiedCount };
  },

  async deleteNotification(id) {
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) throw new ApiError(404, "Notification not found", "NOT_FOUND");
    return notification;
  },

  async getUnreadCount(recipientType) {
    const filter = { read: false };
    if (recipientType && recipientType !== "all") filter.recipientType = recipientType;
    return Notification.countDocuments(filter);
  },
};

export default notificationService;
