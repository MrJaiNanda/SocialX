import axios from "axios";

// One shared axios instance for the whole app.
// The base URL points at our Express API (see .env -> VITE_API_URL).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach the saved login token (if any) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("socialx_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
