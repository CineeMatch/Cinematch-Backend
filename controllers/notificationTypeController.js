// This controller handles notification type-related operations
import NotificationType from "../models/notificationType.js";

// This function retrieves all notification types from the database and sends them as a JSON response.
export const getAllNotificationTypes = async (req, res) => {
    try {
        const notificationTypes = await NotificationType.findAll();
        res.status(200).json(notificationTypes);
    } catch (error) {
        console.error("Error fetching notification types:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This function retrieves a specific notification type by its ID from the database and sends it as a JSON response.
export const getNotificationTypeById = async (req, res) => {
    const { id } = req.params;
    try {
        const notificationType = await NotificationType.findByPk(id);
        if (!notificationType) {
            return res.status(404).json({ message: "Notification type not found" });
        }
        res.status(200).json(notificationType);
    } catch (error) {
        console.error("Error fetching notification type:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This function creates a new notification type in the database using the data provided in the request body and sends the created type as a JSON response.
export const createNotificationType = async (req, res) => {
    const { TypeName, messageContent } = req.body;
    try {
        const newNotificationType = await NotificationType.create({ TypeName, messageContent });
        res.status(201).json(newNotificationType);
    } catch (error) {
        console.error("Error creating notification type:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This function updates an existing notification type in the database using the ID provided in the request parameters and the data provided in the request body, and sends the updated type as a JSON response.
export const updateNotificationType = async (req, res) => {
    const { id } = req.params;
    const { TypeName, messageContent } = req.body;
    try {
        const notificationType = await NotificationType.findByPk(id);
        if (!notificationType) {
            return res.status(404).json({ message: "Notification type not found" });
        }
        await notificationType.update({ TypeName, messageContent });
        res.status(200).json(notificationType);
    } catch (error) {
        console.error("Error updating notification type:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This function deletes a notification type from the database using the ID provided in the request parameters and sends a success message as a JSON response.
export const deleteNotificationType = async (req, res) => {
    const { id } = req.params;
    try {
        const notificationType = await NotificationType.findByPk(id);
        if (!notificationType) {
            return res.status(404).json({ message: "Notification type not found" });
        }
        await notificationType.destroy();
        res.status(200).json({ message: "Notification type deleted successfully" });
    } catch (error) {
        console.error("Error deleting notification type:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}