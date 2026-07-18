import jwt from "jsonwebtoken";

// Protects routes that require the user to be logged in.
// Expects a header: Authorization: Bearer <token>
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided. Please log in." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Attach the user's id to the request for later use
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired session. Please log in again." });
  }
};
