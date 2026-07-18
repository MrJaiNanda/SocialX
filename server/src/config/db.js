import mongoose from "mongoose";

// Connects to MongoDB using the URI from our .env file.
// Called once when the server starts up (see index.js).
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // Stop the server if we can't connect to the DB
  }
};
