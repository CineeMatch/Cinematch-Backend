import { createLike, getAllLikes, getLikesByPost, getUserLikeOnPost, removeLike } from "../controllers/likeController.js";
import express from "express";

const router = express.Router();

router.route("/likes").get( getAllLikes);
router.route("/likes/:id").get( getLikesByPost);
router.route("/like/:id").get(getUserLikeOnPost);
router.route("/like/create").post(createLike);
router.route("/like/delete/:id").delete(removeLike);

export default router;