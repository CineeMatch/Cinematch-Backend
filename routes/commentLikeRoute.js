import { getAllCommentLikes, getCommentLikeById, createCommentLike, deleteCommentLike } from "../controllers/commentLikeController.js";
import { Router } from "express";

const router = Router();

router.route("/commentlikes").get(getAllCommentLikes);
router.route("/commentlike/:id").get(getCommentLikeById);
router.route("/commentlike/create").post(createCommentLike);
router.route("/commentlike/delete/:id").delete(deleteCommentLike);

export default router;