// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(authService.getStoredUser);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Verificar sessão ao montar
  useEffect(() => {
    const init = async () => {
      if (authService.isAuthenticated()) {
        try {
          const me = await authService.getMe();
          setUser(me);
          localStorage.setItem("sipre_user", JSON.stringify(me));
        } catch {
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      return data;
    } catch (err) {
      const msg = err?.error || "Credenciais inválidas";
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const register = useCallback(async (formData) => {
    setError(null);
    try {
      const data = await authService.register(formData);
      setUser(data.user);
      return data;
    } catch (err) {
      const msg = err?.error || "Erro ao registar";
      setError(msg);
      throw new Error(msg);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("sipre_user", JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading, error,
      login, register, logout, updateUser,
      isAuthenticated: !!user,
      isDoctor: user?.role === "doctor",
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
};
