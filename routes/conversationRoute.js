import express from 'express';
import { getAllConversations, getConversationById, createConversation, updateConversation, deleteConversation } from '../controllers/conversationController.js';

const router = express.Router();

router.route('/conversations').get(getAllConversations);
router.route('/conversation/:id').get(getConversationById);
router.route('/conversation/create').post(createConversation);
router.route('/conversation/update/:id').put(updateConversation);
router.route('/conversation/delete/:id').delete(deleteConversation);

export default router;