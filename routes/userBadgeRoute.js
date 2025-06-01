import express from 'express';
import { getAllUserBadges, getUserBadgeById, createUserBadge, updateUserBadge, deleteUserBadge } from '../controllers/userBadgeController.js';

const router = express.Router();

router.route('/user-badges').get(getAllUserBadges);
router.route('/user-badge/:id').get(getUserBadgeById);
router.route('/user-badge/create').post(createUserBadge);
router.route('/user-badge/update/:id').put(updateUserBadge);
router.route('/user-badge/delete/:id').delete(deleteUserBadge);

export default router;
