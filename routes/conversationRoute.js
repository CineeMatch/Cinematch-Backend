import express from 'express';
import { getAllConversations, getConversationById, createConversation, updateConversation, deleteConversation } from '../controllers/conversationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/conversations').get(authMiddleware, getAllConversations);
router.route('/conversation/:id').get(authMiddleware, getConversationById);
router.route('/conversation/create').post(authMiddleware, createConversation);
router.route('/conversation/update/:id').put(authMiddleware, updateConversation);
router.route('/conversation/delete/:id').delete(authMiddleware, deleteConversation);

export default router;