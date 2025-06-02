import express from 'express';
import { getAllComments, getCommentById, getCommentsByPostId, getCommentsByCurrentUserId, getCommentsByUserId, createComment, updateComment, deleteComment } from '../controllers/commentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router()

router.route('/comments').get(authMiddleware, getAllComments);
router.route('/comment/:id').get(authMiddleware, getCommentById);
router.route('/comments/post/:postId').get(authMiddleware, getCommentsByPostId);
router.route('comments/current-user/:userId').get(authMiddleware, getCommentsByCurrentUserId);
router.route('/comments/user/:userId').get(authMiddleware, getCommentsByUserId);
router.route('/comment/create').post(authMiddleware, createComment);
router.route('/comment/update/:id').put(authMiddleware, updateComment);
router.route('/comment/delete/:id').delete(authMiddleware, deleteComment);

export default router;