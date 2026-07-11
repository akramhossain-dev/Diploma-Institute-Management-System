import { Router } from "express";
import { param, body } from "express-validator";
import notificationController from "./notification.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";
import handleValidationErrors from "../../utils/handleValidationErrors.js";

const router = Router();

const validateId = [
  param("id").isMongoId().withMessage("Invalid notification ID"),
  handleValidationErrors,
];

router.get(
  "/",
  authenticate,
  authorizeEntity("admin"),
  notificationController.getNotifications
);

router.get(
  "/unread-count",
  authenticate,
  authorizeEntity("admin"),
  notificationController.getUnreadCount
);

router.post(
  "/",
  authenticate,
  authorizeEntity("admin"),
  [
    body("recipientType").isIn(["admin", "teacher", "accountant", "student", "all"]).withMessage("Invalid recipientType"),
    body("title").notEmpty().withMessage("title is required").isLength({ max: 200 }),
    body("message").notEmpty().withMessage("message is required").isLength({ max: 1000 }),
    body("type").optional().isIn(["info", "success", "warning", "error"]),
    handleValidationErrors,
  ],
  notificationController.createNotification
);

router.patch(
  "/:id/read",
  authenticate,
  authorizeEntity("admin"),
  validateId,
  notificationController.markAsRead
);

router.post(
  "/read-all",
  authenticate,
  authorizeEntity("admin"),
  notificationController.markAllAsRead
);

router.delete(
  "/:id",
  authenticate,
  authorizeEntity("admin"),
  validateId,
  notificationController.deleteNotification
);

export default router;
