import ChallangeQuestion from "../models/challengeQuestion.js";

// This function retrieves all Challange Questions from the database and sends them as a JSON response.
export const getAllChallengeQuestions = async (req, res) => {
    try {
        const challengeQuestions = await ChallangeQuestion.findAll();
        return res.status(200).json(challengeQuestions);
    } catch (error) {
        console.error("Error fetching challenge questions:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This function retrieves a specific challenge question by its ID from the database and sends it as a JSON response.
export const getChallengeQuestionById = async (req, res) => {
    const { id } = req.params;
    try {
        const challengeQuestion = await ChallangeQuestion.findByPk(id);
        if (!challengeQuestion) {
            return res.status(404).json({ message: "Challenge question not found" });
        }
        return res.status(200).json(challengeQuestion);
    } catch (error) {
        console.error("Error fetching challenge question:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getChallengeQuestionsByUserId = async (req, res) => {
    try {
        const { userId, challengeId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const challengeQuestions = await ChallangeQuestion.findAll({
            where: { directed_to: userId, challenge_id: challengeId },
        });
        if (challengeQuestions.length === 0) {
            return res.status(404).json({ message: "No challenge questions found for this user" });
        }
        return res.status(200).json(challengeQuestions);
    } catch (error) {
        console.error("Error fetching challenge questions by user ID:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This function creates a new challenge question in the database using the data provided in the request body and sends the created question as a JSON response.
export const createChallengeQuestion = async (req, res) => {
    const created_by = req.user.id;
    const { questionList, challangeId, directed_to } = req.body;
    try {
        if (!created_by) {
            return res.status(400).json({ message: "User ID is required" });
        }
        if (!questionList || questionList.length === 0 || !challangeId || !directed_to) {
            return res.status(400).json({ message: "questionList or challenge or " });
        }

        for (let i = 0; i < questionList.length; i++) {
            const { questionText, correct_answer, selected_answer } = questionList[i];
            if (!questionText || !correct_answer || !selected_answer) {
                return res.status(400).json({ message: "All fields are required for each question" });
            }
            await ChallangeQuestion.create({
                questionText,
                correct_answer,
                selected_answer,
                challenge_id: challangeId,
                directed_to, // Set the answered_at date to the current date and time
            });
        }

        // notification will be created here

        return res.status(201).json({ message: "Challenge questions created successfully" });
    } catch (error) {
        console.error("Error creating challenge question:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This function updates an existing challenge question in the database using the ID from the request parameters and the data from the request body, then sends the updated question as a JSON response.
export const answerChallengeQuestion = async (req, res) => {
    const { challangeQuestionAnswerList } = req.body;
    try {

        for (let i = 0; i < challangeQuestionAnswerList.length; i++) {
            const { id, selected_answer } = challangeQuestionAnswerList[i];
            if (!id || !selected_answer) {
                return res.status(400).json({ message: "ID and selected answer are required for each question" });
            }
            const challengeQuestion = await ChallangeQuestion.findByPk(id);
            if (!challengeQuestion) {
                return res.status(404).json({ message: `Challenge question with ID ${id} not found` });
            }
            challengeQuestion.selected_answer = selected_answer;
            challengeQuestion.answered_at = new Date(); // Set the answered_at date to the current date and time
            await challengeQuestion.save();
        }
        return res.status(200).json({ message: "Challenge questions answered successfully" });
    } catch (error) {
        console.error("Error updating challenge question:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This function deletes a specific challenge question by its ID from the database and sends a success message as a JSON response.
export const deleteChallengeQuestion = async (req, res) => {
    const { id } = req.params;
    try {
        const challengeQuestion = await ChallangeQuestion.findByPk(id);
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