import Post from "../models/Post.js";

// Shared fields to pull in for the post author and comment authors,
// so the client always has an avatar color + username to display.
const AUTHOR_FIELDS = "username avatarColor";

// GET /api/posts - the main feed, newest posts first
export const getFeed = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", AUTHOR_FIELDS)
      .populate("comments.user", AUTHOR_FIELDS);

    res.json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Could not load the feed." });
  }
};

// POST /api/posts - create a new post
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Post text cannot be empty." });
    }

    const post = await Post.create({ author: req.userId, text: text.trim() });
    await post.populate("author", AUTHOR_FIELDS);

    res.status(201).json({ post });
  } catch (error) {
    res.status(500).json({ message: "Could not create your post." });
  }
};

// DELETE /api/posts/:id - only the post's author can delete it
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own posts." });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete the post." });
  }
};

// POST /api/posts/:id/like - toggle a like on a post
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });

    const alreadyLiked = post.likes.some((id) => id.toString() === req.userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.userId);
    } else {
      post.likes.push(req.userId);
    }

    await post.save();
    res.json({ likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: "Could not update the like." });
  }
};

// POST /api/posts/:id/comments - add a comment to a post
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty." });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found." });

    post.comments.push({ user: req.userId, text: text.trim() });
    await post.save();
    await post.populate("comments.user", AUTHOR_FIELDS);

    res.status(201).json({ comments: post.comments });
  } catch (error) {
    res.status(500).json({ message: "Could not add your comment." });
  }
};
