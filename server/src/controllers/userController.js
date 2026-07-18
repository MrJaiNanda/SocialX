import User from "../models/User.js";
import Post from "../models/Post.js";

// GET /api/users/:username - a public profile page with that user's posts
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "username bio avatarColor createdAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const posts = await Post.find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate("author", "username avatarColor")
      .populate("comments.user", "username avatarColor");

    res.json({ user, posts });
  } catch (error) {
    res.status(500).json({ message: "Could not load this profile." });
  }
};

// PATCH /api/users/me - update your own bio
export const updateBio = async (req, res) => {
  try {
    const { bio } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { bio: (bio || "").slice(0, 160) },
      { new: true }
    );

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatarColor: user.avatarColor,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Could not update your bio." });
  }
};
