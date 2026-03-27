// src/hooks/useSocket.js
// Hook para receber dados em tempo real via Socket.IO
import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "")
  || "http://localhost:3001";

let socketInstance = null;

export function useSocket() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        transports: ["websocket"],
        autoConnect: true,
      });
    }

    socketInstance.on("connect",    () => setConnected(true));
    socketInstance.on("disconnect", () => setConnected(false));

    return () => {
      socketInstance?.off("connect");
      socketInstance?.off("disconnect");
    };
  }, []);

  const joinPatient = useCallback((patientId) => {
    socketInstance?.emit("join_patient", patientId);
  }, []);

  const leavePatient = useCallback((patientId) => {
    socketInstance?.emit("leave_patient", patientId);
  }, []);

  const onVitalsUpdate = useCallback((cb) => {
    socketInstance?.on("vitals_update", cb);
    return () => socketInstance?.off("vitals_update", cb);
  }, []);

  const onNewAlert = useCallback((cb) => {
    socketInstance?.on("new_alert", cb);
    return () => socketInstance?.off("new_alert", cb);
  }, []);

  return { connected, joinPatient, leavePatient, onVitalsUpdate, onNewAlert };
}

// ── usePatientVitals — hook de alto nível para um paciente ────
export function usePatientVitals(patientId) {
  const [vitals,  setVitals]  = useState(null);
  const [alerts,  setAlerts]  = useState([]);
  const [status,  setStatus]  = useState("offline");

  const { connected, joinPatient, leavePatient, onVitalsUpdate, onNewAlert } = useSocket();

  useEffect(() => {
    if (!patientId) return;

    joinPatient(patientId);

    const offVitals = onVitalsUpdate((data) => {
      if (data.patientId === patientId) {
        setVitals(data.vitals);
        setStatus(data.vitals.status);
      }
    });

    const offAlert = onNewAlert((data) => {
      if (data.patientId === patientId) {
        setAlerts((prev) => [data.alert, ...prev].slice(0, 50));
      }
    });

    return () => {
      leavePatient(patientId);
      offVitals?.();
      offAlert?.();
    };
  }, [patientId, joinPatient, leavePatient, onVitalsUpdate, onNewAlert]);

  return { vitals, alerts, status, connected };
}
