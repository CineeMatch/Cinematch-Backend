import express from 'express';
import { getAllBadges, getBadgeById, createBadge, updateBadge, deleteBadge } from '../controllers/badgeController.js';

const router = express.Router();

router.route('/badges').get(getAllBadges);
router.route('/badge/:id').get(getBadgeById);
router.route('/badge/create').post(createBadge);
router.route('/badge/update/:id').put(updateBadge);
router.route('/badge/delete/:id').delete(deleteBadge);

export default router;