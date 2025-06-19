import express from 'express';
import { getAllChallengeQuestions, getChallengeQuestionById, getChallengeQuestionsCurrentUserByChallengeId, createChallengeQuestion, deleteChallengeQuestion, answerChallengeQuestion } from '../controllers/challengeQuestionController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
router.route('/challenge-questions/user').post(authMiddleware, getChallengeQuestionsCurrentUserByChallengeId);

router.route('/challenge-questions').get(authMiddleware, getAllChallengeQuestions);
router.route('/challenge-question/:id').get(authMiddleware, getChallengeQuestionById);
router.route('/challenge-question/create').post(authMiddleware, createChallengeQuestion);
router.route('/challenge-question/answers').put(authMiddleware, answerChallengeQuestion);
router.route('/challenge-question/delete/:id').delete(authMiddleware, deleteChallengeQuestion);

export default router;