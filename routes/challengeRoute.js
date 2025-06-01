import { createChallenge, deleteChallenge, getAllChallenges, getChallengeByID, getChallengesByUser, updateChallengeStatusAnswered, updateChallengeStatusCompleted } from "../controllers/challengeController.js";
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/challenges").get(authMiddleware, getAllChallenges);
router.route("/challenge/:id").get(authMiddleware, getChallengeByID);
router.route("/challenges/user").get(authMiddleware, getChallengesByUser);
router.route("/challenge/create").post(authMiddleware, createChallenge);
router.route("/challenge/delete/:id").delete(authMiddleware, deleteChallenge);
router.route("/challenge/update/answered/:id").put(authMiddleware, updateChallengeStatusAnswered);
router.route("/challenge/update/completed/:id").put(authMiddleware, updateChallengeStatusCompleted);

export default router;