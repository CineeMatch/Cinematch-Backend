import { getAllPosts, getPostById, getPostByUserId, createPost, deletePost, updatePost } from "../controllers/postController.js";
import { Router } from "express";

const router = Router();

router.route("/posts").get(getAllPosts);
router.route("/post/:id").get(getPostById);
router.route("/posts/user/:userId").get(getPostByUserId);
router.route("/post").post(createPost);
router.route("/post/:id").put(updatePost);
router.route("/post/:id").delete(deletePost);

export default router;