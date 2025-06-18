import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getAllConversations, getConversationById, createConversation, updateConversation, deleteConversation ,getMessagesByChatId} from '../controllers/conversationController.js';

const router = express.Router();

router.route('/conversations').get(getAllConversations);
router.route('/conversation/:id').get(getConversationById);
router.route('/conversation/create').post(createConversation);
router.route('/conversation/update/:id').put(updateConversation);
router.route('/conversation/delete/:id').delete(deleteConversation);
router.route('/conversation/messages/:chatId').get(authMiddleware, getMessagesByChatId);

export default router;