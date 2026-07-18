import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

// Wraps the whole app so any component can ask "who is logged in?"
// via the useAuth() hook below.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for a saved session

  // On first load, if there's a saved token, ask the API who it belongs to.
  useEffect(() => {
    const token = localStorage.getItem("socialx_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("socialx_token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("socialx_token", res.data.token);
    setUser(res.data.user);
  };

  const register = async (username, email, password) => {
    const res = await api.post("/auth/register", { username, email, password });
    localStorage.setItem("socialx_token", res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("socialx_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook: const { user, login, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
