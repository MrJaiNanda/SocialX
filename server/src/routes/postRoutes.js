import express from "express";
import {
  getFeed,
  createPost,
  deletePost,
  toggleLike,
  addComment,
} from "../controllers/postController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// All post routes require the user to be logged in
router.use(requireAuth);

router.get("/", getFeed);
router.post("/", createPost);
router.delete("/:id", deletePost);
router.post("/:id/like", toggleLike);
router.post("/:id/comments", addComment);

export default router;
