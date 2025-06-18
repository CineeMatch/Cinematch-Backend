// This controller handles user badge-related operations
import UserBadge from "../models/userBadge.js";
import Badge from "../models/badge.js";

// This function retrieves all user badges from the database and sends them as a JSON response.
export const getAllUserBadges = async (req, res) => {
    try {
        const userBadges = await UserBadge.findAll();

        if (!userBadges || userBadges.length === 0) {
            return res.status(404).json({ message: "No user badges found" });
        }

        return res.status(200).json(userBadges);
    } catch (error) {
        console.error("Error fetching user badges:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This function retrieves a specific user badge by its ID from the database and sends it as a JSON response.
export const getUserBadgeById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "User badge ID is required" });
        }

        const userBadge = await UserBadge.findByPk(id);

        if (!userBadge) {
            return res.status(404).json({ message: "User badge not found" });
        }

        return res.status(200).json(userBadge);
    } catch (error) {
        console.error("Error fetching user badge:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This function creates a new user badge in the database using the data provided in the request body and sends the created user badge as a JSON response.
export const createUserBadge = async (req, res) => {
    try {
        const { user_id, badge_id } = req.body;

        if (!user_id || !badge_id) {
            return res.status(400).json({ message: "User ID and badge ID are required" });
        }
        const existingUserBadge = await UserBadge.findOne({ where: { user_id, badge_id } });

        if (existingUserBadge) {
            return res.status(400).json({ message: "User badge already exists" });
        }

        const earned_at = new Date(); // Set the earned_at date to the current date and time
        const newUserBadge = await UserBadge.create({ user_id, badge_id, earned_at });
        return res.status(201).json(newUserBadge);
    } catch (error) {
        console.error("Error creating user badge:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This function updates an existing user badge in the database using the ID provided in the request parameters and the data provided in the request body, and sends the updated user badge as a JSON response.
export const updateUserBadge = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, badge_id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "User badge ID is required" });
        }

        const userBadge = await UserBadge.findByPk(id);

        if (!userBadge) {
            return res.status(404).json({ message: "User badge not found" });
        }

        userBadge.user_id = user_id || userBadge.user_id; // Update only if new value is provided
        userBadge.badge_id = badge_id || userBadge.badge_id; // Update only if new value is provided

        await userBadge.update({ user_id, badge_id });
        return res.status(200).json(userBadge);
    } catch (error) {
        console.error("Error updating user badge:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This function deletes a user badge from the database using the ID provided in the request parameters and sends a success message as a JSON response.
export const deleteUserBadge = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "User badge ID is required" });
        }

        const userBadge = await UserBadge.findByPk(id);

        if (!userBadge) {
            return res.status(404).json({ message: "User badge not found" });

        }
        await userBadge.destroy();
        return res.status(200).json({ message: "User badge deleted successfully" });
    } catch (error) {
        console.error("Error deleting user badge:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This function retrieves all badges associated with a specific user ID from the database and sends them as a JSON response.
export const getBadgesByUserId = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const userBadges = await UserBadge.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Badge,
                    as: 'badge'
                }
            ]
        });

        if (!userBadges || userBadges.length === 0) {
            return res.status(200).json({ message: "No badges found for this user" });
        }

        return res.status(200).json({ message: "user badges came succesfully", userBadges });
    } catch (error) {
        console.error("Error fetching badges by user ID:", error);
        return res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
}