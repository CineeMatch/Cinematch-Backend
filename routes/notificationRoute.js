import { createNotification, deleteNotification, getNotification, getAllNotifications, getNotificationsForUser, updateNotificationToRead } from "../controllers/notificationController.js";
import express from "express";

const router = express.Router();

router.route("/notifications").get( getAllNotifications);
router.route("/notification/:id").get( getNotification);
router.route("/notifications/user").get( getNotificationsForUser);
router.route("/notification/create").post(createNotification);
router.route("/notification/delete/:id").delete(deleteNotification);
router.route("/notification/read/:id").put(updateNotificationToRead);

export default router;