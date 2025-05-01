import { createChallenge, deleteChallenge, getAllChallenges, getChallengeByID, getChallengesByUser, updateChallengeStatusAnswered, updateChallengeStatusCompleted } from "../controllers/challengeController.js";
import express from "express";

const router = express.Router();

router.route("/challenges").get( getAllChallenges);
router.route("/challenge/:id").get( getChallengeByID);
router.route("/challenges/user").get( getChallengesByUser);
router.route("/challenge/create").post(createChallenge);
router.route("/challenge/delete/:id").delete(deleteChallenge);
router.route("/challenge/update/answered/:id").put(updateChallengeStatusAnswered);
router.route("/challenge/update/completed/:id").put(updateChallengeStatusCompleted);

export default router;