// This controller handles user badge-related operations
import UserBadge from "../models/userBadge.js";

// This function retrieves all user badges from the database and sends them as a JSON response.
export const getAllUserBadges = async (req, res) => {
    try {
        const userBadges = await UserBadge.findAll();
        res.status(200).json(userBadges);
    } catch (error) {
        console.error("Error fetching user badges:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This function retrieves a specific user badge by its ID from the database and sends it as a JSON response.
export const getUserBadgeById = async (req, res) => {
    const { id } = req.params;
    try {
        const userBadge = await UserBadge.findByPk(id);
        if (!userBadge) {
            return res.status(404).json({ message: "User badge not found" });
        }
        res.status(200).json(userBadge);
    } catch (error) {
        console.error("Error fetching user badge:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This function creates a new user badge in the database using the data provided in the request body and sends the created user badge as a JSON response.
export const createUserBadge = async (req, res) => {
    const { user_id, badge_id } = req.body;
    try {
        const earned_at = new Date(); // Set the earned_at date to the current date and time
        const newUserBadge = await UserBadge.create({ user_id, badge_id, earned_at });
        res.status(201).json(newUserBadge);
    } catch (error) {
        console.error("Error creating user badge:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This function updates an existing user badge in the database using the ID provided in the request parameters and the data provided in the request body, and sends the updated user badge as a JSON response.
export const updateUserBadge = async (req, res) => {
    const { id } = req.params;
    const { user_id, badge_id } = req.body;
    try {
        const userBadge = await UserBadge.findByPk(id);
        if (!userBadge) {
            return res.status(404).json({ message: "User badge not found" });
        }
        await userBadge.update({ user_id, badge_id });
        res.status(200).json(userBadge);
    } catch (error) {
        console.error("Error updating user badge:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This function deletes a user badge from the database using the ID provided in the request parameters and sends a success message as a JSON response.
export const deleteUserBadge = async (req, res) => {
    const { id } = req.params;
    try {
        const userBadge = await UserBadge.findByPk(id);
        if (!userBadge) {
            return res.status(404).json({ message: "User badge not found" });
        }
        await userBadge.destroy();
        res.status(200).json({ message: "User badge deleted successfully" });
    } catch (error) {
        console.error("Error deleting user badge:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}