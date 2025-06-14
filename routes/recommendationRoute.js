import { createRecommendation, deleteRecommendation, getRecommendation, getAllRecommendations, updateRecommendationScore, getRecommendationMovieForCurrentUser } from "../controllers/recommendationController.js";
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/recommendation/recommendForUser").get(authMiddleware, getRecommendationMovieForCurrentUser);
router.route("/recommendations").get(authMiddleware, getAllRecommendations);
router.route("/recommendation/:id").get(authMiddleware, getRecommendation);
router.route("/recommendation/create").post(authMiddleware, createRecommendation);
router.route("/recommendation/delete/:id").delete(authMiddleware, deleteRecommendation);
router.route("/recommendation/updateScore/:id").put(authMiddleware, updateRecommendationScore);


export default router;