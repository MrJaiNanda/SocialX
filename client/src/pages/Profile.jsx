import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "../components/Avatar.jsx";
import PostCard from "../components/PostCard.jsx";

export default function Profile() {
  const { username } = useParams();
  const { user, setUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState("");
  const [savingBio, setSavingBio] = useState(false);

  const isOwnProfile = user && user.username === username;

  useEffect(() => {
    setLoading(true);
    api
      .get(`/users/${username}`)
      .then((res) => {
        setProfile(res.data.user);
        setPosts(res.data.posts);
        setBioDraft(res.data.user.bio || "");
      })
      .catch(() => setError("This profile could not be found."))
      .finally(() => setLoading(false));
  }, [username]);

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  const handleSaveBio = async () => {
    setSavingBio(true);
    try {
      const res = await api.patch("/users/me", { bio: bioDraft });
      setUser(res.data.user); // keep navbar/global state in sync
      setProfile((prev) => ({ ...prev, bio: res.data.user.bio }));
      setEditingBio(false);
    } catch {
      alert("Could not save your bio.");
    } finally {
      setSavingBio(false);
    }
  };

  if (loading) return <p className="text-center text-subtext py-10">Loading profile...</p>;
  if (error) return <p className="text-center text-accent py-10">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-surface border border-border rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-4">
          <Avatar username={profile.username} color={profile.avatarColor} size="lg" />
          <div>
            <h1 className="text-xl font-extrabold text-ink">{profile.username}</h1>
            <p className="text-sm text-subtext">
              Joined {new Date(profile.createdAt).toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {editingBio ? (
          <div className="mt-4">
            <textarea
              value={bioDraft}
              onChange={(e) => setBioDraft(e.target.value.slice(0, 160))}
              rows={2}
              className="w-full border border-border rounded-lg px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSaveBio}
                disabled={savingBio}
                className="text-sm font-semibold bg-brand text-white px-4 py-1.5 rounded-full hover:bg-brand-dark disabled:opacity-50"
              >
                {savingBio ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditingBio(false)}
                className="text-sm font-medium text-subtext hover:text-ink"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-ink">{profile.bio || (isOwnProfile ? "Add a bio to tell people about yourself." : "")}</p>
            {isOwnProfile && (
              <button
                onClick={() => setEditingBio(true)}
                className="text-sm font-medium text-brand hover:underline mt-1"
              >
                Edit bio
              </button>
            )}
          </div>
        )}
      </div>

      <h2 className="text-sm font-semibold text-subtext uppercase tracking-wide mb-3">Posts</h2>

      {posts.length === 0 && (
        <p className="text-center text-subtext py-10">No posts yet.</p>
      )}

      {posts.map((post) => (
        <PostCard key={post._id} post={post} onPostDeleted={handlePostDeleted} />
      ))}
    </div>
  );
}
