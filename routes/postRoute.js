import { getAllPosts, getPostById, getPostByUserId, createPost, deletePost, updatePost } from "../controllers/postController.js";
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/posts").get(authMiddleware, getAllPosts);
router.route("/post/:id").get(authMiddleware, getPostById);
router.route("/posts/user/:userId").get(authMiddleware, getPostByUserId);
router.route("/post/create").post(authMiddleware, createPost);
router.route("/post/update/:id").put(authMiddleware, updatePost);
router.route("/post/delete/:id").delete(authMiddleware, deletePost);

export default router;