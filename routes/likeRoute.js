import { createLike, getAllLikes, getLikesByPost, getUserLikeOnPost, removeLike } from "../controllers/likeController.js";
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/likes").get(authMiddleware, getAllLikes);
router.route("/likes/:id").get(authMiddleware, getLikesByPost);
router.route("/like/:id").get(authMiddleware, getUserLikeOnPost);
router.route("/like/create").post(authMiddleware, createLike);
router.route("/like/delete/:id").delete(authMiddleware, removeLike);

export default router;