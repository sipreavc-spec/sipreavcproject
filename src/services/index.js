// src/services/vitalsService.js
import api from "./api";

export const vitalsService = {

  /** Histórico de leituras de um paciente */
  getHistory: async (patientId, params = {}) => {
    const res = await api.get(`/vitals/${patientId}`, { params });
    return res.data;   // { vitals: [], total: N }
  },

  /** Última leitura */
  getLatest: async (patientId) => {
    const res = await api.get(`/vitals/${patientId}/latest`);
    return res.data;
  },

  /** Estatísticas (médias, máximos, mínimos) */
  getStats: async (patientId, period = "day") => {
    const res = await api.get(`/vitals/${patientId}/stats`, { params: { period } });
    return res.data;
  },
};

// src/services/patientService.js
export const patientService = {

  /** Listar todos os pacientes (filtrado pelo role do utilizador) */
  getAll: async () => {
    const res = await api.get("/patients");
    return res.data;
  },

  /** Obter um paciente específico */
  getById: async (id) => {
    const res = await api.get(`/patients/${id}`);
    return res.data;
  },

  /** Criar novo paciente */
  create: async (data) => {
    const res = await api.post("/patients", data);
    return res.data;
  },

  /** Actualizar paciente */
  update: async (id, data) => {
    const res = await api.put(`/patients/${id}`, data);
    return res.data;
  },

  /** Actualizar limites de alerta */
  updateThresholds: async (id, thresholds) => {
    const res = await api.put(`/patients/${id}/thresholds`, thresholds);
    return res.data;
  },

  /** Remover paciente (soft delete) */
  remove: async (id) => {
    const res = await api.delete(`/patients/${id}`);
    return res.data;
  },
};

// src/services/alertService.js
export const alertService = {

  /** Listar alertas (com filtros) */
  getAll: async (params = {}) => {
    const res = await api.get("/alerts", { params });
    return res.data;  // { alerts: [], total: N }
  },

  /** Reconhecer (acknowledge) um alerta */
  acknowledge: async (id) => {
    const res = await api.put(`/alerts/${id}/acknowledge`);
    return res.data;
  },

  /** Reconhecer todos os alertas de um paciente */
  acknowledgeAll: async (patientId) => {
    const res = await api.put(`/alerts/acknowledge-all/${patientId}`);
    return res.data;
  },
};

// src/services/reportService.js
export const reportService = {

  /** Gerar relatório de um paciente por período */
  generate: async (patientId, period = "week") => {
    const res = await api.get(`/reports/${patientId}`, { params: { period } });
    return res.data;
  },
};

// src/services/deviceService.js
export const deviceService = {

  /** Listar todos os dispositivos */
  getAll: async () => {
    const res = await api.get("/devices");
    return res.data;
  },

  /** Registar novo dispositivo */
  register: async (data) => {
    const res = await api.post("/devices", data);
    return res.data;
  },

  /** Estado de conectividade de um dispositivo */
  getStatus: async (deviceId) => {
    const res = await api.get(`/devices/${deviceId}/status`);
    return res.data;
  },
};

// ── serverlessService — comunica com o endpoint serverless `/api/vitals`
export const serverlessService = {
  /** Build API base: prefer VITE_API_URL if set, otherwise default to backsipreavc.vercel.app */
  _apiBase: (() => {
    const DEFAULT = 'https://backsipreavc.vercel.app';
    const b = import.meta.env.VITE_API_URL ?? DEFAULT;
    if (!b) return '';
    return b.replace(/\/$/, '');
  })(),

  _buildUrl(path, params) {
    const base = this._apiBase || ""; // could be empty string
    const prefix = base ? (base.endsWith('/api') ? `${base}` : `${base}/api`) : '/api';
    const q = params ? `?${params.toString()}` : '';
    return `${prefix}${path.startsWith('/')?path:''}/${q}`.replace(/\/\/?\?/, '?').replace(/\/\/$/, '');
  },

  /** Buscar entradas do backend (/api/vitals) */
  getEntries: async ({ patientId = null, limit = 100, offset = 0, since = 0 } = {}) => {
    const params = new URLSearchParams();
    if (patientId) params.append('patientId', patientId);
    params.append('limit', String(limit));
    params.append('offset', String(offset));
    if (since) params.append('since', String(since));

    const base = import.meta.env.VITE_API_URL ?? this._apiBase;
    const b = (base || '').replace(/\/$/, '');
    const url = b.endsWith('/api') ? `${b}/vitals?${params.toString()}` : `${b}/api/vitals?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Erro ao buscar entradas do backend');
    const data = await res.json();
    return data.entries || [];
  },

  /** Buscar último(s) registro(s) - endpoint /api/vitals/latest
   *  Query params: patientId or patientIds (comma separated)
   */
  getLatest: async ({ patientId = null, patientIds = null } = {}) => {
    const params = new URLSearchParams();
    if (patientId) params.append('patientId', patientId);
    if (patientIds) params.append('patientIds', Array.isArray(patientIds) ? patientIds.join(',') : patientIds);

    const base = import.meta.env.VITE_API_URL ?? this._apiBase;
    const b = (base || '').replace(/\/$/, '');
    const url = b.endsWith('/api') ? `${b}/vitals/latest?${params.toString()}` : `${b}/api/vitals/latest?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Erro ao buscar último registro');
    const data = await res.json();
    return data;
  }
,

  /** Get latest from ESP1 (cardio sensor) */
  getEsp1: async ({ patientId = null, patientIds = null } = {}) => {
    try {
      const params = new URLSearchParams();
      if (patientId) params.append('patientId', patientId);
      if (patientIds) params.append('patientIds', Array.isArray(patientIds) ? patientIds.join(',') : patientIds);
      const base = import.meta.env.VITE_API_URL ?? this._apiBase;
      const b = (base || '').replace(/\/$/, '');
      const url = b.endsWith('/api') ? `${b}/vitals/esp1?${params.toString()}` : `${b}/api/vitals/esp1?${params.toString()}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) return { entries: {} };
      return await res.json();
    } catch (err) {
      console.warn('Backend indisponível - retornando dados vazios', err);
      return { entries: {} };
    }
  },

  /** Get latest from ESP2 (temperature sensor) */
  getEsp2: async ({ patientId = null, patientIds = null } = {}) => {
    try {
      const params = new URLSearchParams();
      if (patientId) params.append('patientId', patientId);
      if (patientIds) params.append('patientIds', Array.isArray(patientIds) ? patientIds.join(',') : patientIds);
      const base = import.meta.env.VITE_API_URL ?? this._apiBase;
      const b = (base || '').replace(/\/$/, '');
      const url = b.endsWith('/api') ? `${b}/vitals/esp2?${params.toString()}` : `${b}/api/vitals/esp2?${params.toString()}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) return { entries: {} };
      return await res.json();
    } catch (err) {
      console.warn('Backend indisponível - retornando dados vazios', err);
      return { entries: {} };
    }
  },

  /** Buscar histórico de ESP1 (BPM, SpO2, Pressão) por período */
  getHistoryEsp1: async ({ patientId = null, period = 'daily', limit = 100 } = {}) => {
    try {
      const params = new URLSearchParams();
      if (patientId) params.append('patientId', patientId);
      params.append('period', period); // 'daily' ou 'weekly'
      params.append('limit', String(limit));
      
      const base = import.meta.env.VITE_API_URL ?? this._apiBase;
      const b = (base || '').replace(/\/$/, '');
      const url = b.endsWith('/api') ? `${b}/vitals/esp1/history?${params.toString()}` : `${b}/api/vitals/esp1/history?${params.toString()}`;
      
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) return { entries: [] };
      const data = await res.json();
      return data.entries || [];
    } catch (err) {
      console.warn('Erro ao buscar histórico ESP1', err);
      return [];
    }
  },

  /** Buscar histórico de ESP2 (Temperatura) por período */
  getHistoryEsp2: async ({ patientId = null, period = 'daily', limit = 100 } = {}) => {
    try {
      const params = new URLSearchParams();
      if (patientId) params.append('patientId', patientId);
      params.append('period', period); // 'daily' ou 'weekly'
      params.append('limit', String(limit));
      
      const base = import.meta.env.VITE_API_URL ?? this._apiBase;
      const b = (base || '').replace(/\/$/, '');
      const url = b.endsWith('/api') ? `${b}/vitals/esp2/history?${params.toString()}` : `${b}/api/vitals/esp2/history?${params.toString()}`;
      
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) return { entries: [] };
      const data = await res.json();
      return data.entries || [];
    } catch (err) {
      console.warn('Erro ao buscar histórico ESP2', err);
      return [];
    }
  }
};
