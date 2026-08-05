// lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://mlm.alohomorasol.com/api",
  headers: {
    Accept: "application/json",
  },
});

// Attach token automatically if present
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auto-logout on 401 Unauthorized (except on login/auth requests)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401
    ) {
      const url = error.config?.url || "";
      const isAuthEndpoint = url.includes("/login") || url.includes("/register") || url.includes("/forgot-password");
      const isLoginPage = window.location.pathname === "/login";

      if (!isAuthEndpoint && !isLoginPage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;