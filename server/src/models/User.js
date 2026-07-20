import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true, // stored as a bcrypt hash
    },
    bio: {
      type: String,
      default: "",
      maxlength: 160,
    },
    avatarColor: {
      // Every user gets a random accent color for their avatar initial.
      type: String,
      default: "#2D5BFF",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
