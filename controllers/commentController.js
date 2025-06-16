// This controller handles comment-related operations
import Comment from "../models/comment.js";
import CommentLike from "../models/commentLike.js";
import User from "../models/user.js";

// This function retrieves all Comments from the database and sends them as a JSON response.
export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.findAll();

        if (!comments || comments.length === 0) {
            return res.status(404).json({ message: "No comments found" });
        }

        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// This function retrieves a specific comment by its ID from the database and sends it as a JSON response.
export const getCommentById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Comment ID is required" });
        }
        const comment = await Comment.findByPk(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        res.status(200).json(comment);
    } catch (error) {
        console.error("Error fetching comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// This function creates a new comment in the database using the data provided in the request body and sends the created comment as a JSON response.
export const createComment = async (req, res) => {
    try {
        const user_id = req.user.id;
        if (user_id === undefined) {
            return res
                .status(401)
                .json({ message: "Unauthorized: User ID is required" });
        }
        const { post_id, commentText } = req.body;
        if (!post_id || !commentText) {
            return res
                .status(400)
                .json({ message: "Post ID and comment text are required" });
        }
        const created_at = new Date(); // Set the created_at date to the current date and time
        const newComment = await Comment.create({
            post_id,
            user_id,
            commentText,
            created_at,
        });
        const fullComment = await Comment.findOne({
            where: { id: newComment.id },
            include: {
                model: User,
                attributes: ['nickname'],
            },
        });

        res.status(201).json(fullComment);
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// This Function retrieves all comments associated with a specific post ID from the database and sends them as a JSON response.
export const getCommentsByPostId = async (req, res) => {
    const { postId } = req.params;
    try {
        const comments = await Comment.findAll({
            where: { post_id: postId },
            include: [
                {
                    model: User,
                    attributes: ["nickname"],
                },
            ],
            order: [["created_at", "DESC"]],
        });
        if (!comments || comments.length === 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments by post ID:", error);
        res.status(500).json({ message: `Internal server error ${error.message}` });
    }
};

// This function retrieves all comments made by the currently authenticated user from the database and sends them as a JSON response.
export const getCommentsByCurrentUserId = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user_id is obtained from the authenticated user
        if (userId === undefined) {
            return res
                .status(401)
                .json({ message: "Unauthorized: User ID is required" });
        }
        const comments = await Comment.findAll({ where: { user_id: userId } });
        if (!comments || comments.length === 0) {
            return res
                .status(404)
                .json({ message: "No comments found for this user" });
        }
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments by user ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// This function retrieves all comments made by a specific user ID from the database and sends them as a JSON response.
export const getCommentsByUserId = async (req, res) => {
    try {
        const { user_id } = req.params; // Assuming user_id is passed as a parameter
        if (!user_id) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const comments = await Comment.findAll({ where: { user_id } });
        if (!comments || comments.length === 0) {
            return res
                .status(404)
                .json({ message: "No comments found for this user" });
        }
        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments by user ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// This function updates an existing comment in the database using the ID from the request parameters and the data from the request body, then sends the updated comment as a JSON response.
export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Comment ID is required" });
        }
        const { post_id, user_id, commentText } = req.body;
        if (!post_id || !user_id || !commentText) {
            return res
                .status(400)
                .json({ message: "Post ID, user ID, and comment text are required" });
        }
        const comment = await Comment.findByPk(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        comment.post_id = post_id;
        comment.user_id = user_id;
        comment.commentText = commentText;
        comment.updated_at = new Date(); // Update the updated_at date to the current date and time
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// This function deletes a comment from the database using the ID from the request parameters and sends a success message as a JSON response.
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Comment ID is required" });
        }
        const comment = await Comment.findByPk(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        await CommentLike.destroy({ where: { comment_id: id } });
        await comment.destroy();
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: ` Error deleting comment: ${error.message}` });
    }
};