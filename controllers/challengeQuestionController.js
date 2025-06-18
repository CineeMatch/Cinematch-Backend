// This controller handles challenge question-related operations
import ChallengeQuestion from "../models/challengeQuestion.js";

// This function retrieves all Challange Questions from the database and sends them as a JSON response.
export const getAllChallengeQuestions = async (req, res) => {
    try {
        const challengeQuestions = await ChallengeQuestion.findAll();

        if (challengeQuestions.length === 0) {
            return res.status(404).json({ message: "No challenge questions found" });
        }

        return res.status(200).json(challengeQuestions);
    } catch (error) {
        console.error("Error fetching challenge questions:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This function retrieves a specific challenge question by its ID from the database and sends it as a JSON response.
export const getChallengeQuestionById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Challenge question ID is required" });
        }
        const challengeQuestion = await ChallengeQuestion.findByPk(id);
        if (!challengeQuestion) {
            return res.status(404).json({ message: "Challenge question not found" });
        }
        return res.status(200).json(challengeQuestion);
    } catch (error) {
        console.error("Error fetching challenge question:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This function creates a new challenge question in the database using the data provided in the request body and sends the created question as a JSON response.
export const createChallengeQuestion = async (req, res) => {
    try {
        const created_by = req.user.id; // Get the user ID from the authenticated user
        if (created_by === undefined) {
            return res.status(401).json({ message: "Unauthorized: User ID is required" });
        }
        const { questionText, correct_answer, challenge_id, directed_to } = req.body;
        if (!questionText || !correct_answer || !challenge_id || !directed_to) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const answered_at = new Date(); // Set the answered_at date to the current date and time
        const newChallengeQuestion = await ChallengeQuestion.create({ questionText, correct_answer, challenge_id, created_by, directed_to, answered_at });
        return res.status(201).json(newChallengeQuestion);
    } catch (error) {
        console.error("Error creating challenge question:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This function updates an existing challenge question in the database using the ID from the request parameters and the data from the request body, then sends the updated question as a JSON response.
export const updateChallengeQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Challenge question ID is required" });
        }
        const { questionText, correct_answer, challenge_id, created_by, directed_to } = req.body;
        if (!questionText && !correct_answer && !challenge_id && !created_by && !directed_to) {
            return res.status(400).json({ message: "At least one field is required to update" });
        }
        const challengeQuestion = await ChallengeQuestion.findByPk(id);
        if (!challengeQuestion) {
            return res.status(404).json({ message: "Challenge question not found" });
        }
        challengeQuestion.questionText = questionText || challengeQuestion.questionText;
        challengeQuestion.correct_answer = correct_answer || challengeQuestion.correct_answer;
        challengeQuestion.challenge_id = challenge_id || challengeQuestion.challenge_id;
        challengeQuestion.created_by = created_by || challengeQuestion.created_by;
        challengeQuestion.directed_to = directed_to || challengeQuestion.directed_to;
        await challengeQuestion.save();
        return res.status(200).json(challengeQuestion);
    } catch (error) {
        console.error("Error updating challenge question:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This function deletes a specific challenge question by its ID from the database and sends a success message as a JSON response.
export const deleteChallengeQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        const challengeQuestion = await ChallengeQuestion.findByPk(id);
        if (!challengeQuestion) {
            return res.status(404).json({ message: "Challenge question not found" });
        }
        await challengeQuestion.destroy();
        return res.status(200).json({ message: "Challenge question deleted successfully" });
    } catch (error) {
        console.error("Error deleting challenge question:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
