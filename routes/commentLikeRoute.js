import { getAllCommentLikes, getCommentLikeById, createCommentLike, deleteCommentLike } from "../controllers/commentLikeController.js";
import { Router } from "express";

const router = Router();

router.route("/commentlikes").get(getAllCommentLikes);
router.route("/commentlikes/:id").get(getCommentLikeById);
router.route("/commentlikes").post(createCommentLike);
router.route("/commentlikes/:id").delete(deleteCommentLike);

export default router;