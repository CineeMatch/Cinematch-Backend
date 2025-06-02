import Post from "../models/post.js";
import User from "../models/user.js";

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts" });
    }
}

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
}

export const getPostByUserId = async (req, res) => {
    const userId = req.user.id;
    try {
        const existingUser = await User.findByPk(userId);
        if (!existingUser) {
            console.error("User not found");
            return res.status(404).json({ message: "User not found" });
        }
        const posts = await Post.findAll({ where: { user_id: userId } });
        if (posts) {
            console.log("Posts fetched successfully");
            res.status(200).json(posts);
        } else {
            console.error("Posts not found for this user");
            res.status(404).json({ message: "Posts not found" });
        }
    } catch (error) {
        res.status(500).json({ message: `Error fetching posts, ${error.message}` });
    }
}

export const createPost = async (req, res) => {
    try {
        const userId = req.user.id;;
        const { movie_id, contentText } = req.body;

        if (!userId || !contentText) {
            throw new Error("userId and content are required.");
        }

        const existingUser = await User.findByPk(userId);
        if (!existingUser) {
            throw new Error("User not found");
        }

        const newPost = await Post.create({ user_id: userId, movie_id, contentText: contentText });
        console.log("Post created successfully");
        res.status(201).json(newPost);

    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: `Error creating post: ${error.message}` });
    }
}

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
            console.log("Post updated successfully");
            res.status(200).json(post);
        } else {
            console.error("Post not found");
            res.status(404).json({ message: "Post not found" });
        }
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: `Error updating post ${error.message}` });
    }
}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const existingPost = await Post.findByPk(id);
        if (!existingPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        await existingPost.destroy();
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting post" });
    }
}