import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "./Avatar.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 bg-surface border-b border-border">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-xl font-extrabold text-brand tracking-tight">
          SocialX
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <Link
              to={`/profile/${user.username}`}
              className="flex items-center gap-2 text-sm font-medium text-ink hover:text-brand"
            >
              <Avatar username={user.username} color={user.avatarColor} size="sm" />
              <span className="hidden sm:inline">{user.username}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-subtext hover:text-accent transition-colors"
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-ink hover:text-brand">
              Log in
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold bg-brand text-white px-4 py-1.5 rounded-full hover:bg-brand-dark transition-colors"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
