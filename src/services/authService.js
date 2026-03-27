// src/services/authService.js
import api from "./api";

export const authService = {

  /** Registar novo utilizador */
  register: async (data) => {
    const res = await api.post("/auth/register", data);
    _saveSession(res.data);
    return res.data;
  },

  /** Login */
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    _saveSession(res.data);
    return res.data;
  },

  /** Obter perfil do utilizador autenticado */
  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },

  /** Actualizar perfil */
  updateProfile: async (data) => {
    const res = await api.put("/auth/profile", data);
    return res.data;
  },

  /** Alterar password */
  changePassword: async (currentPassword, newPassword) => {
    const res = await api.put("/auth/password", { currentPassword, newPassword });
    return res.data;
  },

  /** Logout */
  logout: () => {
    localStorage.removeItem("sipre_token");
    localStorage.removeItem("sipre_user");
  },

  /** Verificar se está autenticado */
  isAuthenticated: () => !!localStorage.getItem("sipre_token"),

  /** Obter utilizador da sessão */
  getStoredUser: () => {
    try {
      return JSON.parse(localStorage.getItem("sipre_user") || "null");
    } catch { return null; }
  },
};

function _saveSession({ token, user }) {
  if (token) localStorage.setItem("sipre_token", token);
  if (user)  localStorage.setItem("sipre_user", JSON.stringify(user));
}

export default authService;
