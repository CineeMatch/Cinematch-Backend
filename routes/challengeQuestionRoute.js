import express from 'express';
import { getAllChallengeQuestions, getChallengeQuestionById, createChallengeQuestion, updateChallengeQuestion, deleteChallengeQuestion } from '../controllers/challengeQuestionController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/challenge-questions').get(authMiddleware, getAllChallengeQuestions);
router.route('/challenge-question/:id').get(authMiddleware, getChallengeQuestionById);
router.route('/challenge-question/create').post(authMiddleware, createChallengeQuestion);
router.route('/challenge-question/update/:id').put(authMiddleware, updateChallengeQuestion);
router.route('/challenge-question/delete/:id').delete(authMiddleware, deleteChallengeQuestion);

export default router;
