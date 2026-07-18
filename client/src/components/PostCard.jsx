import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "./Avatar.jsx";

// Turns a timestamp into something readable like "3m ago" or "Jul 12".
function formatTime(dateString) {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 60 * 24) return `${Math.floor(diffMins / 60)}h ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function PostCard({ post, onPostDeleted }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const isLiked = user && likes.some((id) => id === user.id || id?._id === user.id);
  const isOwnPost = user && post.author?._id === user.id;

  const handleLike = async () => {
    if (!user) return;
    // Update instantly, then confirm with the server (optimistic update)
    const wasLiked = isLiked;
    setLikes((prev) =>
      wasLiked ? prev.filter((id) => id !== user.id) : [...prev, user.id]
    );
    try {
      await api.post(`/posts/${post._id}/like`);
    } catch {
      // Revert if the request failed
      setLikes((prev) =>
        wasLiked ? [...prev, user.id] : prev.filter((id) => id !== user.id)
      );
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/posts/${post._id}/comments`, { text: commentText });
      setComments(res.data.comments);
      setCommentText("");
    } catch {
      // Silently ignore; the comment box just keeps the typed text
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${post._id}`);
      onPostDeleted(post._id);
    } catch {
      alert("Could not delete this post.");
    }
  };

  return (
    <article className="bg-surface border border-border rounded-2xl p-4 mb-4">
      <div className="flex gap-3">
        <Avatar username={post.author?.username} color={post.author?.avatarColor} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <Link
              to={`/profile/${post.author?.username}`}
              className="font-semibold text-ink hover:underline"
            >
              {post.author?.username || "Unknown"}
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs text-subtext">{formatTime(post.createdAt)}</span>
              {isOwnPost && (
                <button
                  onClick={handleDelete}
                  className="text-xs text-subtext hover:text-accent"
                  aria-label="Delete post"
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          <p className="text-ink mt-1 whitespace-pre-wrap break-words">{post.text}</p>

          <div className="flex items-center gap-5 mt-3 text-sm">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 font-medium transition-colors ${
                isLiked ? "text-accent" : "text-subtext hover:text-accent"
              }`}
            >
              <span aria-hidden="true">{isLiked ? "♥" : "♡"}</span>
              {likes.length > 0 ? likes.length : "Like"}
            </button>
            <button
              onClick={() => setShowComments((s) => !s)}
              className="flex items-center gap-1.5 font-medium text-subtext hover:text-brand transition-colors"
            >
              💬 {comments.length > 0 ? comments.length : "Comment"}
            </button>
          </div>

          {showComments && (
            <div className="mt-3 border-t border-border pt-3 space-y-2">
              {comments.map((c) => (
                <div key={c._id} className="flex gap-2 items-start text-sm">
                  <Avatar username={c.user?.username} color={c.user?.avatarColor} size="sm" />
                  <div className="bg-muted rounded-2xl px-3 py-1.5">
                    <span className="font-semibold text-ink mr-1">{c.user?.username}</span>
                    <span className="text-ink">{c.text}</span>
                  </div>
                </div>
              ))}

              {user && (
                <form onSubmit={handleAddComment} className="flex gap-2 mt-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value.slice(0, 280))}
                    placeholder="Write a comment..."
                    className="flex-1 bg-muted rounded-full px-4 py-1.5 text-sm text-ink placeholder:text-subtext focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="text-sm font-semibold text-brand disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
