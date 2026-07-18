import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Load .env from the server/ folder explicitly. Without an explicit path,
// dotenv only looks in process.cwd() — the folder you happened to run the
// command from — which silently finds nothing if you start the server from
// anywhere else (the project root, a process manager, etc).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.MONGO_URI) {
  console.error(
    "MONGO_URI is not set. Make sure server/.env exists (copy server/.env.example to server/.env and fill it in)."
  );
  process.exit(1);
}

const app = express();

// --- Middleware ---
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// Simple health check, useful to confirm the server is running
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Catch-all for unknown routes
app.use((req, res) => res.status(404).json({ message: "Route not found." }));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`SocialX API running on http://localhost:${PORT}`));
});
