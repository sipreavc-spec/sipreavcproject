// src/services/api.js — Cliente HTTP base (Axios)
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ── Interceptor: Injectar token JWT em cada pedido ────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sipre_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Interceptor: Tratar erros globais (401 → logout) ─────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("sipre_token");
      localStorage.removeItem("sipre_user");
      window.location.href = "/login";
    }
    return Promise.reject(err.response?.data || err);
  }
);

export default api;
