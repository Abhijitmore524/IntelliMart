import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Attach Token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Session expired or invalid token.");
      localStorage.clear();
      window.location.href = "/login"; // Force re-authentication
    }
    return Promise.reject(error);
  }
);

export default api;