import Post from "../models/post.js";

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
    const { userId } = req.params;
    try {
        existingUser = await User.findByPk(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const posts = await Post.findAll({ where: { user_id: userId } });
        if (posts) {
            res.status(200).json(posts);
        } else {
            res.status(404).json({ message: "Posts not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts" });
    }
}

export const createPost = async (req, res) => {
    try {
        const { userId, content } = req.body;
        if (!userId || !content) {
            return res.status(400).json({ message: "userId and content are required." });
        }
        const existingUser = await User.findByPk(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const newPost = await Post.create({ user_id: userId, content });
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: "Error creating post" });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { userId, content } = req.body;
    try {
        const existingUser = await User.findByPk(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!content) {
            return res.status(400).json({ message: "content is required" });
        }
        const post = await Post.findByPk(id);
        if (post) {
            post.content = content;
            await post.save();
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating post" });
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