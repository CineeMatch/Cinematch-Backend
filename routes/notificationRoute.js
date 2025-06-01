import { createNotification, deleteNotification, getNotification, getAllNotifications, getNotificationsForUser, updateNotificationToRead } from "../controllers/notificationController.js";
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/notifications").get(authMiddleware, getAllNotifications);
router.route("/notification/create").post(authMiddleware, createNotification);
router.route("/notification/:id").get(authMiddleware, getNotification);
router.route("/notifications/user").get(authMiddleware, getNotificationsForUser);
router.route("/notification/delete/:id").delete(authMiddleware, deleteNotification);
router.route("/notification/read/:id").put(authMiddleware, updateNotificationToRead);

export default router;