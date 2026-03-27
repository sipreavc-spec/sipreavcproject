// src/services/authService.js - Autenticação e gestão de pacientes
import api from "./api";

export const authService = {

  /** Registar novo utilizador (Médico/Enfermeiro) */
  register: async (email, password, full_name, role = "doctor", crm, phone, specialization, hospital) => {
    try {
      const res = await api.post("/auth/register", {
        email,
        password,
        full_name,
        role,
        crm,
        phone,
        specialization,
        hospital,
      });
      if (res.data.token) {
        localStorage.setItem("sipre_token", res.data.token);
        localStorage.setItem("sipre_user", JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /** Login */
  login: async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.token) {
        localStorage.setItem("sipre_token", res.data.token);
        localStorage.setItem("sipre_user", JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /** Obter perfil do utilizador autenticado */
  getMe: async () => {
    try {
      const res = await api.get("/auth/me");
      return res.data.user;
    } catch (error) {
      throw error.response?.data || error;
    }
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

  // ─────────────────────────────────────────────────────────
  // GESTÃO DE PACIENTES
  // ─────────────────────────────────────────────────────────

  /** Criar novo paciente */
  createPatient: async (name, age, gender, email, phone, cpf, address, medical_history) => {
    try {
      const res = await api.post("/auth/patients", {
        name,
        age,
        gender,
        email,
        phone,
        cpf,
        address,
        medical_history,
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /** Listar pacientes do médico */
  getPatients: async () => {
    try {
      const res = await api.get("/auth/patients");
      return res.data.patients || [];
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /** Obter dados de um paciente */
  getPatient: async (patientId) => {
    try {
      const res = await api.get(`/auth/patients/${patientId}`);
      return res.data.patient;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /** Atualizar dados do paciente */
  updatePatient: async (patientId, updates) => {
    try {
      const res = await api.put(`/auth/patients/${patientId}`, updates);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /** Obter vitais do paciente */
  getPatientVitals: async (patientId, limit = 100) => {
    try {
      const res = await api.get(`/auth/patients/${patientId}/vitals?limit=${limit}`);
      return res.data.vitals || [];
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default authService;
