import express from 'express';
import { getAllBadges, getBadgeById, createBadge, updateBadge, deleteBadge } from '../controllers/badgeController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/badges').get(authMiddleware, getAllBadges);
router.route('/badge/:id').get(authMiddleware, getBadgeById);
router.route('/badge/create').post(authMiddleware, createBadge);
router.route('/badge/update/:id').put(authMiddleware, updateBadge);
router.route('/badge/delete/:id').delete(authMiddleware, deleteBadge);

export default router;