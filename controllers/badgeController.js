// This controller handles badge-related operations
import Badge from "../models/badge.js";
import cloudinary from "../configs/cloudinary.js";

// This function retrieves all badges from the database and sends them as a JSON response.
export const getAllBadges = async (req, res) => {
    try {
        const badges = await Badge.findAll();

        if (!badges || badges.length === 0) {
            return res.status(404).json({ message: "No badges found" });
        }

        return res.status(200).json(badges);
    } catch (error) {
        console.error("Error fetching badges:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This function retrieves a specific badge by its ID from the database and sends it as a JSON response.
export const getBadgeById = async (req, res) => {
    try {
        const { id } = req.params;
        const badge = await Badge.findByPk(id);
        if (!badge) {
            return res.status(404).json({ message: "Badge not found" });
        }
        return res.status(200).json(badge);
    } catch (error) {
        console.error("Error fetching badge:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This function creates a new badge in the database using the data provided in the request body and sends the created badge as a JSON response.
export const createBadge = async (req, res) => {
    try {
        const { name, image_url, description } = req.body;
        const newBadge = await Badge.create({ name, image_url, description });
        return res.status(201).json(newBadge);
    } catch (error) {
        console.error("Error creating badge:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This function updates an existing badge in the database using the ID from the request parameters and the data from the request body, then sends the updated badge as a JSON response.
export const updateBadge = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image_url, description } = req.body;
        const badge = await Badge.findByPk(id);
        if (!badge) {
            return res.status(404).json({ message: "Badge not found" });
        }

        badge.name = name || badge.name; // Update only if new value is provided
        badge.image_url = image_url || badge.image_url; // Update only if new value is provided
        badge.description = description || badge.description; // Update only if new value is provided

        await badge.save();
        return res.status(200).json(badge);
    } catch (error) {
        console.error("Error updating badge:", error);
        return res.status(500).json({ message: `Internal server error ${error.message}` });
    }
}

// This function deletes a badge from the database using the ID from the request parameters and sends a success message as a JSON response.
export const deleteBadge = async (req, res) => {
    try {
        const { id } = req.params;
        const badge = await Badge.findByPk(id);
        if (!badge) {
            return res.status(404).json({ message: "Badge not found" });
        }
        await badge.destroy();
        return res.status(200).json({ message: "Badge deleted successfully" });
    } catch (error) {
        console.error("Error deleting badge:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const createBadgeFromFrontend = async (req, res) => {
    try {
        const { name, image, description } = req.body;

        const cloudinaryResult = await cloudinary.v2.uploader.upload(image, {
            folder: "MR-WA-Badge",
            resource_type: "auto",
        });

        const newBadge = await Badge.create({ name, image_url: cloudinaryResult.secure_url, image_url_public_id: cloudinaryResult.public_id, description });
        return res.status(201).json(newBadge);
    } catch (error) {
        console.error("Error creating badge from frontend:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}