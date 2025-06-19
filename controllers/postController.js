import Post from "../models/post.js";
import User from "../models/user.js";
import Movie from "../models/movie.js";
import Category from "../models/category.js";
import Comment from "../models/comment.js";
import CommentLike from "../models/commentLike.js";
import Like from "../models/like.js";
import Friend from "../models/friend.js";
import { gainBadge } from "../utils/gainBadge.js";
import { gainLevel } from "../utils/gainLevel.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: User, attributes: ["nickname"] },
        { model: Movie, attributes: ["title"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    const formatted = posts.map((post) => ({
      id: post.id,
      contentText: post.contentText,
      nickname: post.User?.nickname,
      movieName: post.Movie?.title,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

export const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
};

export const getPostsByCategoryId = async (req, res) => {
  const categoryId = req.params.categoryId;

  try {
    const posts = await Post.findAll({
      include: [
        {
          model: Movie,
          required: true,
          include: [
            {
              model: Category,
              as: "categories",
              where: { id: categoryId },
              required: true,
              through: { attributes: [] },
            },
          ],
        },
        {
          model: User,
          attributes: ["nickname"],
        },
      ],
    });

    const response = posts.map((post) => ({
      id: post.id,
      contentText: post.contentText,
      nickname: post.User.nickname,
      movieName: post.Movie?.title,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    res
      .status(500)
      .json({ message: `Error fetching posts by category: ${error.message}` });
  }
};

export const getPostByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      console.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    const posts = await Post.findAll({
            where: { user_id: userId },
            include: [
                { model: User, attributes: ["nickname"] },
                { model: Movie, attributes: ["title"] },
            ],
        });
    if (posts) {
      res.status(200).json(posts);
    } else {
      console.error("Posts not found for this user");
      res.status(404).json({ message: "Posts not found" });
    }
  } catch (error) {
    res.status(500).json({ message: `Error fetching posts, ${error.message}` });
  }
};

export const createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { movie_id, contentText } = req.body;

    if (!userId || !contentText) {
      throw new Error("userId and content are required.");
    }

    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      throw new Error("User not found");
    }

    const newPost = await Post.create({
      user_id: userId,
      movie_id,
      contentText: contentText,
    });
    const postCount = await Post.count({ where: { user_id: userId } });

        gainLevel(userId, "comment");

    if ( postCount === 1) {
        gainBadge(userId, "First Post");
    } else if ( postCount === 50) {
        gainBadge(userId, "Sharer");
    } else if ( postCount === 100) {
        gainBadge(userId, "Poster");
    } else if ( postCount === 500) {
        gainBadge(userId, "Post Storm");
    } else if ( postCount === 1000) {
        gainBadge(userId, "Post King");
    }
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: `Error creating post: ${error.message}` });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { contentText } = req.body;
  try {
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!contentText) {
      return res.status(400).json({ message: "content is required" });
    }
    const post = await Post.findByPk(id);
    if (post) {
      post.contentText = contentText;
      await post.save();
      res.status(200).json(post);
    } else {
      console.error("Post not found");
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: `Error updating post ${error.message}` });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const existingPost = await Post.findByPk(id);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comments = await Comment.findAll({ where: { post_id: id } });
    const commentIds = comments.map((c) => c.id);

    await CommentLike.destroy({ where: { comment_id: commentIds } });

    await Comment.destroy({ where: { post_id: id } });

    await Like.destroy({ where: { post_id: id } });

    await existingPost.destroy();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Error deleting post: ${error.message}` });
  }
};

export const getPostsUserByCategoryId = async (req, res) => {
    const userId = req.user.id;
    const categoryId = req.params.categoryId;

    try {
        const posts = await Post.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Movie,
                    required: true,
                    include: [
                        {
                            model: Category,
                            as: "categories",
                            where: { id: categoryId },
                            required: true,
                        },
                    ],
                },
                {
                    model: User,
                    attributes: ["nickname"],
                },
            ],
        });

        const response = posts.map((post) => ({
      Movie: {
        id: post.id,
        contentText: post.contentText,
        nickname: post.User.nickname,
        title: post.Movie?.title,
      }
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching posts by user and category:", error);
    res
      .status(500)
      .json({ message: `Error fetching posts by user and category: ${error.message}` });
  }
}