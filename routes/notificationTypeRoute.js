import express from 'express';
import { getAllNotificationTypes, getNotificationTypeById, createNotificationType, updateNotificationType, deleteNotificationType } from '../controllers/notificationTypeController.js';

const router = express.Router();

router.route('/notification-types').get(getAllNotificationTypes);
router.route('/notification-type/:id').get(getNotificationTypeById);
router.route('/notification-type/create').post(createNotificationType);
router.route('/notification-type/update/:id').put(updateNotificationType);
router.route('/notification-type/delete/:id').delete(deleteNotificationType);

export default router;