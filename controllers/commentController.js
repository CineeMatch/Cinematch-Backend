// This controller handles comment-related operations
import Comment from '../models/comment.js';

// This function retrieves all Comments from the database and sends them as a JSON response.
export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.findAll();
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This function retrieves a specific comment by its ID from the database and sends it as a JSON response.
export const getCommentById = async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await Comment.findByPk(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        res.status(200).json(comment);
    } catch (error) {
        console.error("Error fetching comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This function creates a new comment in the database using the data provided in the request body and sends the created comment as a JSON response.
export const createComment = async (req, res) => {
    const { post_id, user_id, commentText } = req.body;
    try {
        const created_at = new Date(); // Set the created_at date to the current date and time
        const newComment = await Comment.create({ post_id, user_id, commentText, created_at });
        res.status(201).json(newComment);
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This function updates an existing comment in the database using the ID from the request parameters and the data from the request body, then sends the updated comment as a JSON response.
export const updateComment = async (req, res) => {
    const { id } = req.params;
    const { post_id, user_id, commentText } = req.body;
    try {
        const comment = await Comment.findByPk(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        comment.post_id = post_id;
        comment.user_id = user_id;
        comment.commentText = commentText;
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// This function deletes a comment from the database using the ID from the request parameters and sends a success message as a JSON response.
export const deleteComment = async (req, res) => {
    const { id } = req.params;
    try {
        const comment = await Comment.findByPk(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        await comment.destroy();
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}