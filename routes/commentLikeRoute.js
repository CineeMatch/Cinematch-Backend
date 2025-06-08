import { getAllCommentLikes, getCommentLikeById, createCommentLike, deleteCommentLike } from "../controllers/commentLikeController.js";
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/commentlikes").get(authMiddleware, getAllCommentLikes);
router.route("/commentlike/:id").get(authMiddleware, getCommentLikeById);
router.route("/commentlike/create").post(authMiddleware, createCommentLike);
router.route("/commentlike/delete/:id").delete(authMiddleware, deleteCommentLike);

export default router;