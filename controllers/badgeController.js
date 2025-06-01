// This controller handles badge-related operations
import Badge from "../models/badge.js";

// This function retrieves all badges from the database and sends them as a JSON response.
export const getAllBadges = async (req, res) => {
    try {
        const badges = await Badge.findAll();
        res.status(200).json(badges);
    } catch (error) {
        console.error("Error fetching badges:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This function retrieves a specific badge by its ID from the database and sends it as a JSON response.
export const getBadgeById = async (req, res) => {
    const { id } = req.params;
    try {
        const badge = await Badge.findByPk(id);
        if (!badge) {
            return res.status(404).json({ message: "Badge not found" });
        }
        res.status(200).json(badge);
    } catch (error) {
        console.error("Error fetching badge:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This function creates a new badge in the database using the data provided in the request body and sends the created badge as a JSON response.
export const createBadge = async (req, res) => {
    const { name, description, icon } = req.body;
    try {
        const created_at = new Date(); // Set the created_at date to the current date and time
        const newBadge = await Badge.create({ name, description, icon, created_at });
        res.status(201).json(newBadge);
    } catch (error) {
        console.error("Error creating badge:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This function updates an existing badge in the database using the ID from the request parameters and the data from the request body, then sends the updated badge as a JSON response.
export const updateBadge = async (req, res) => {
    const { id } = req.params;
    const { name, description, image_url } = req.body;
    try {
        const badge = await Badge.findByPk(id);
        if (!badge) {
            return res.status(404).json({ message: "Badge not found" });
        }
        badge.name = name;
        badge.description = description;
        badge.image_url = image_url;
        await badge.save();
        res.status(200).json(badge);
    } catch (error) {
        console.error("Error updating badge:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This function deletes a badge from the database using the ID from the request parameters and sends a success message as a JSON response.
export const deleteBadge = async (req, res) => {
    const { id } = req.params;
    try {
        const badge = await Badge.findByPk(id);
        if (!badge) {
            return res.status(404).json({ message: "Badge not found" });
        }
        await badge.destroy();
        res.status(200).json({ message: "Badge deleted successfully" });
    } catch (error) {
        console.error("Error deleting badge:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}