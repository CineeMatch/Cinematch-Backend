import CommentLike from '../models/commentLike.js';
import Comment from '../models/comment.js';
import { createNotification } from './notificationController.js';
import User from '../models/user.js';
import { where } from 'sequelize';

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

export const getCommentLikesByCommentId = async (req, res) => {
    const { commentId} = req.params;
    try {
        const commentLikes = await CommentLike.findAll({
            where: { comment_id: commentId },
        });

        const likeCount = commentLikes.length;

        res.status(200).json({
            comment_id: commentId,
            likeCount,
            likes: commentLikes
        });
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ message: `Error fetching likes for comment ${comment_id}: ${error.message}` });
    }
};


export const getUserCommentLikeOnComment=async(req,res)=>{
    const user=req.user.id
    const { commentId } = req.params;
    try {
        const commentLike=await CommentLike.findOne({where:{comment_id:commentId, user_id:user }});
        return res.status(200).json({"CommentLike":commentLike});
    } catch (error) {
        console.error('Fetch Error:', error);
        return res.status(500).json({ error: 'Like cannot be found.' });
    }
};

export const createCommentLike = async (req, res) => {
    try {
        const userId = req.user.id;
        const {comment_id } = req.body;
        if (!userId || !comment_id) {
            return res.status(400).json({ message: "userId and commentId are required." });
        }
        
        const existingUser = await User.findByPk(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const existingComment = await Comment.findByPk(comment_id);
        if (!existingComment) {
            return res.status(404).json({ message: "Comment Like not found" });
        }
        const existingLike = await CommentLike.findOne({
            where: {
                user_id: userId,
                comment_id: comment_id
            }
        });

        if (existingLike) {
            return res.status(400).json({ message: "You have already liked this comment." });
        }
        const newCommentLike = await CommentLike.create({ user_id: userId, comment_id: comment_id });

        const commentOwnerId = existingComment.user_id;

        if (commentOwnerId !== userId) {
        req.body = {
            reciver_id: commentOwnerId,
            type_id: 2
        };
        console.log("Notification body:", req.body);

        const notification = {
            status: (code) => ({
            json: (data) => console.log(`[Notification] ${code}:`, data)
            })
        };

        await createNotification(req, notification);
        }
        res.status(201).json(newCommentLike);
    } catch (error) {
        res.status(500).json({ message: `Error creating comment like ${error.message} ` });
    }
}

export const deleteCommentLike = async (req, res) => {
    const userId = req.user.id;
    const { comment_id } = req.params;
    try {
        const existingCommentLike = await CommentLike.findOne({
            where: {
                comment_id: comment_id,
                user_id: userId
            }
        });
        if (!existingCommentLike) {
            return res.status(404).json({ message: "Comment like not found" });
        }
        await existingCommentLike.destroy();
        res.status(200).json({ message: "Comment like deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting comment like" });
    }
}