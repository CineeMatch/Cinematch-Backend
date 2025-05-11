import express from 'express';
import { getAllComments, getCommentById, createComment, updateComment, deleteComment } from '../controllers/commentController.js';

const router = express.Router()

router.get('/comments', getAllComments);
router.get('/comment/:id', getCommentById);
router.post('/comment/create', createComment);
router.put('/comment/update/:id', updateComment);
router.delete('/comment/delete/:id', deleteComment);

export default router;