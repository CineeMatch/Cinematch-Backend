import express from 'express';
import { getAllUserBadges, getUserBadgeById, createUserBadge, updateUserBadge, deleteUserBadge, getBadgesByUserId } from '../controllers/userBadgeController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/user-badges').get(authMiddleware, getAllUserBadges);
router.route('/user-badge/:id').get(authMiddleware, getUserBadgeById);
router.route('/user-badge/create').post(authMiddleware, createUserBadge);
router.route('/user-badge/update/:id').put(authMiddleware, updateUserBadge);
router.route('/user-badge/delete/:id').delete(authMiddleware, deleteUserBadge);
router.route('/user-badge/user/:userId').get(authMiddleware, getBadgesByUserId);

export default router;
