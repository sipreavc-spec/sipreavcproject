// src/hooks/useVitals.js
// Hook que combina dados históricos (REST) + tempo real (Socket.IO)
import { useState, useEffect, useCallback } from "react";
import { vitalsService, alertService } from "../services/index.js";
import { usePatientVitals } from "./useSocket";

export function useVitals(patientId, options = {}) {
  const { pollInterval = 30000, historyLimit = 50 } = options;

  const [history,    setHistory]    = useState([]);
  const [stats,      setStats]      = useState(null);
  const [dbAlerts,   setDbAlerts]   = useState([]);
  const [loadingH,   setLoadingH]   = useState(true);
  const [error,      setError]      = useState(null);

  // Socket.IO em tempo real
  const { vitals: liveVitals, alerts: liveAlerts, status, connected } =
    usePatientVitals(patientId);

  // ── Carregar histórico inicial ───────────────────────────
  const loadHistory = useCallback(async () => {
    if (!patientId) return;
    try {
      setLoadingH(true);
      const [histRes, statsRes, alertRes] = await Promise.all([
        vitalsService.getHistory(patientId, { limit: historyLimit }),
        vitalsService.getStats(patientId, "day"),
        alertService.getAll({ patientId, limit: 20 }),
      ]);
      setHistory(histRes.vitals || []);
      setStats(statsRes);
      setDbAlerts(alertRes.alerts || []);
    } catch (err) {
      setError(err?.error || "Erro ao carregar dados");
    } finally {
      setLoadingH(false);
    }
  }, [patientId, historyLimit]);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  // ── Polling de fallback (caso Socket.IO falhe) ───────────
  useEffect(() => {
    if (!patientId || connected) return;
    const iv = setInterval(async () => {
      try {
        const latest = await vitalsService.getLatest(patientId);
        if (latest) {
          setHistory((prev) => {
            const exists = prev[0]?._id === latest._id;
            return exists ? prev : [latest, ...prev].slice(0, historyLimit);
          });
        }
      } catch {}
    }, pollInterval);
    return () => clearInterval(iv);
  }, [patientId, connected, pollInterval, historyLimit]);

  // ── Adicionar leitura ao vivo ao histórico ───────────────
  useEffect(() => {
    if (!liveVitals) return;
    setHistory((prev) => [{ ...liveVitals, _id: Date.now() }, ...prev].slice(0, historyLimit));
  }, [liveVitals, historyLimit]);

  // Última leitura: tempo real tem prioridade
  const current = liveVitals || history[0] || null;

  // Alertas combinados (sem duplicatas)
  const allAlerts = [
    ...liveAlerts,
    ...dbAlerts.filter((a) => !liveAlerts.find((la) => la._id === a._id)),
  ].slice(0, 30);

  return {
    current,
    history,
    stats,
    alerts: allAlerts,
    status: liveVitals?.status || status,
    connected,
    loading: loadingH,
    error,
    refresh: loadHistory,
  };
}
