import { getAllCommentLikes, getCommentLikeById, createCommentLike, deleteCommentLike, getCommentLikesByCommentId, getUserCommentLikeOnComment } from "../controllers/commentLikeController.js";
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/commentlikes").get(authMiddleware, getAllCommentLikes );
router.route("/commentlike/:id").get(authMiddleware, getCommentLikeById );
router.route('/commentlikes/:commentId').get(authMiddleware, getCommentLikesByCommentId);
router.route('/commentlike/currentUser/:commentId').get(authMiddleware, getUserCommentLikeOnComment);
router.route("/commentlike/create").post(authMiddleware, createCommentLike );
router.route("/commentlike/delete/:comment_id").delete(authMiddleware, deleteCommentLike );

export default router;