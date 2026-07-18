import { useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "./Avatar.jsx";

const MAX_LENGTH = 500;

// The "what's on your mind" box at the top of the feed.
export default function PostForm({ onPostCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    setError("");
    try {
      const res = await api.post("/posts", { text });
      setText("");
      onPostCreated(res.data.post);
    } catch (err) {
      setError(err.response?.data?.message || "Could not post that. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-4 mb-6">
      <div className="flex gap-3">
        <Avatar username={user?.username} color={user?.avatarColor} />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
          placeholder="What's happening?"
          rows={3}
          className="flex-1 resize-none bg-transparent text-ink placeholder:text-subtext focus:outline-none text-base"
        />
      </div>

      {error && <p className="text-accent text-sm mt-2">{error}</p>}

      <div className="flex items-center justify-between mt-2 pl-[52px]">
        <span className="text-xs text-subtext">
          {text.length}/{MAX_LENGTH}
        </span>
        <button
          type="submit"
          disabled={!text.trim() || submitting}
          className="bg-brand text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-brand-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
