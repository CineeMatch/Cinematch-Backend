import { createLike, getLikes, getLikesByPost, getUserLikeOnPost, removeLike } from "../controllers/likeController.js";
import { isAuthenticatedUser } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.route("/likes").get(isAuthenticatedUser, getLikes);
router.route("/likes/:id").get(isAuthenticatedUser, getLikesByPost);
router.route("/like/:id").get(isAuthenticatedUser, getUserLikeOnPost);
router.route("/like/create").post(isAuthenticatedUser,createLike);
router.route("/like/delete/:post_id").delete(isAuthenticatedUser,removeLike);

export default router;