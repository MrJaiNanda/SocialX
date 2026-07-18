import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// A small palette of accessible, high-contrast colors we randomly
// assign to new users for their avatar initial.
const AVATAR_COLORS = ["#2D5BFF", "#E1493C", "#0F9D58", "#8C3BFF", "#D97B00"];

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Shape the user object we send back to the client (never send the password hash)
const toPublicUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  bio: user.bio,
  avatarColor: user.avatarColor,
});

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are all required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: "That username or email is already taken." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatarColor,
    });

    const token = createToken(user._id);
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while creating your account." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = createToken(user._id);
    res.json({ token, user: toPublicUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while logging you in." });
  }
};

// Used on app load to check if the saved token is still valid,
// and to fetch the current user's info.
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user: toPublicUser(user) });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};
