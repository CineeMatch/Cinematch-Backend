import CommentLike from '../models/commentLike.js';

export const getAllCommentLikes = async (req, res) => {
    try {
        const commentLikes = await CommentLike.findAll();
        res.status(200).json(commentLikes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching comment likes" });
    }
}

export const getCommentLikeById = async (req, res) => {
    const { id } = req.params;
    try {
        const commentLike = await CommentLike.findByPk(id);
        if (commentLike) {
            res.status(200).json(commentLike);
        } else {
            res.status(404).json({ message: "Comment like not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching comment like" });
    }
}

export const createCommentLike = async (req, res) => {
    try {
        const { userId, commentId } = req.body;
        if (!userId || !commentId) {
            return res.status(400).json({ message: "userId and commentId are required." });
        }

        const existingUser = await User.findByPk(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const existingComment = await Comment.findByPk(commentId);
        if (!existingComment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        const existingLike = await CommentLike.findOne({
            where: {
                user_id: userId,
                comment_id: commentId
            }
        });

        if (existingLike) {
            return res.status(400).json({ message: "You have already liked this comment." });
        }
        const newCommentLike = await CommentLike.create({ user_id: userId, comment_id: commentId });
        res.status(201).json(newCommentLike);
    } catch (error) {
        res.status(500).json({ message: "Error creating comment like" });
    }
}

export const deleteCommentLike = async (req, res) => {
    const { id } = req.params;
    try {
        const existingCommentLike = await CommentLike.findByPk(id);
        if (!existingCommentLike) {
            return res.status(404).json({ message: "Comment like not found" });
        }
        await existingCommentLike.destroy();
        res.status(200).json({ message: "Comment like deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting comment like" });
    }
}