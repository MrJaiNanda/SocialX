import express from "express";
import { getUserProfile, updateBio } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/:username", getUserProfile);
router.patch("/me", requireAuth, updateBio);

export default router;
