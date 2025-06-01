// This controller handles conversation-related operations
import Conversation from '../models/conversation.js';

// This function retrieves all conversations from the database and sends them as a JSON response.
export const getAllConversations = async (req, res) => {
    try {
        const conversations = await Conversation.findAll();
        res.status(200).json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This function retrieves a specific conversation by its ID from the database and sends it as a JSON response.
export const getConversationById = async (req, res) => {
    const { id } = req.params;
    try {
        const conversation = await Conversation.findByPk(id);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        res.status(200).json(conversation);
    } catch (error) {
        console.error("Error fetching conversation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This function creates a new conversation in the database using the data provided in the request body and sends the created conversation as a JSON response.
export const createConversation = async (req, res) => {
    const { sender_id, receiver_id, content, is_read } = req.body;
    try {
        const sent_at = new Date(); // Set the sent_at date to the current date and time
        const newConversation = await Conversation.create({ sender_id, receiver_id, content, sent_at, is_read });
        res.status(201).json(newConversation);
    } catch (error) {
        console.error("Error creating conversation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This function updates an existing conversation in the database using the ID provided in the request parameters and the data provided in the request body, and sends the updated conversation as a JSON response.
export const updateConversation = async (req, res) => {
    const { id } = req.params;
    const { sender_id, receiver_id, content, sent_at, is_read } = req.body;
    try {
        const conversation = await Conversation.findByPk(id);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        await conversation.update({ sender_id, receiver_id, content, sent_at, is_read });
        res.status(200).json(conversation);
    } catch (error) {
        console.error("Error updating conversation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This function deletes a conversation from the database using the ID provided in the request parameters and sends a success message as a JSON response.
export const deleteConversation = async (req, res) => {
    const { id } = req.params;
    try {
        const conversation = await Conversation.findByPk(id);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        await conversation.destroy();
        res.status(200).json({ message: "Conversation deleted successfully" });
    } catch (error) {
        console.error("Error deleting conversation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}