import express from 'express';
import { getAllNotificationTypes, getNotificationTypeById, createNotificationType, updateNotificationType, deleteNotificationType } from '../controllers/notificationTypeController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/notification-types').get(authMiddleware, getAllNotificationTypes);
router.route('/notification-type/:id').get(authMiddleware, getNotificationTypeById);
router.route('/notification-type/create').post(authMiddleware, createNotificationType);
router.route('/notification-type/update/:id').put(authMiddleware, updateNotificationType);
router.route('/notification-type/delete/:id').delete(authMiddleware, deleteNotificationType);

export default router;