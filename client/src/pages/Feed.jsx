import { useEffect, useState } from "react";
import api from "../api/axios.js";
import PostForm from "../components/PostForm.jsx";
import PostCard from "../components/PostCard.jsx";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/posts")
      .then((res) => setPosts(res.data.posts))
      .catch(() => setError("Could not load the feed. Try refreshing the page."))
      .finally(() => setLoading(false));
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <PostForm onPostCreated={handlePostCreated} />

      {loading && <p className="text-center text-subtext py-10">Loading feed...</p>}
      {error && <p className="text-center text-accent py-10">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p className="text-center text-subtext py-10">
          No posts yet. Be the first to share something!
        </p>
      )}

      {posts.map((post) => (
        <PostCard key={post._id} post={post} onPostDeleted={handlePostDeleted} />
      ))}
    </div>
  );
}
