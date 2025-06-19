import express from 'express';
import { getAllChallengeQuestions, getChallengeQuestionById, getChallengeQuestionsByUserId, createChallengeQuestion, deleteChallengeQuestion, answerChallengeQuestion } from '../controllers/challengeQuestionController.js';

const router = express.Router();

router.route('/challenge-questions').get(getAllChallengeQuestions);
router.route('/challenge-question/:id').get(getChallengeQuestionById);
router.route('/challenge-questions/user').post(getChallengeQuestionsByUserId);
router.route('/challenge-question/create').post(createChallengeQuestion);
router.route('/challenge-question/update/:id').put(answerChallengeQuestion);
router.route('/challenge-question/delete/:id').delete(deleteChallengeQuestion);

export default router;
