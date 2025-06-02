import { createRecommendation, deleteRecommendation, getRecommendation, getAllRecommendations, updateRecommendationScore } from "../controllers/recommendationController.js";
import express from "express";

const router = express.Router();

router.route("/recommendations").get(getAllRecommendations);
router.route("/recommendation/:id").get(getRecommendation);
router.route("/recommendation/create").post(createRecommendation);
router.route("/recommendation/delete/:id").delete(deleteRecommendation);
router.route("/recommendation/updateScore/:id").put(updateRecommendationScore);

export default router;