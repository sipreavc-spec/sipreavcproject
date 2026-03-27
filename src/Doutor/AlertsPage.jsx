import { useState } from "react";
import { Icon } from "../shared/components";
import { ALERTS } from "../shared/data";

export const AlertsPage = ({ patientName }) => {
  const [filter, setFilter] = useState("all");
  const patientAlerts = ALERTS.filter(a => a.patient === patientName);
  const all = [...patientAlerts,
    { id: 7, patient: patientName, type: "warning", msg: "Temperatura levemente elevada: 37.1°C", time: "13:40" },
    { id: 8, patient: patientName, type: "normal", msg: "BPM estável: 72 bpm", time: "13:20" },
  ].filter(a => a.patient === patientName);
  
  const shown = filter === "all" ? all : all.filter(a => a.type === filter);

  return (
    <div style={{ padding: "clamp(14px,3vw,26px)" }} className="fade-in">
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontFamily: "'Sora'", fontWeight: 800, fontSize: 24, color: "var(--text)" }}>Alertas e Notificações</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 3 }}>{all.length} alertas hoje</p>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { k: "all", l: "Todos", n: all.length },
          { k: "critical", l: "Críticos", n: all.filter(a => a.type === "critical").length },
          { k: "warning", l: "Atenção", n: all.filter(a => a.type === "warning").length },
          { k: "normal", l: "Normais", n: all.filter(a => a.type === "normal").length }
        ].map(f => (
          <button
            key={f.k}
            onClick={() => setFilter(f.k)}
            style={{
              padding: "8px 16px", borderRadius: 10, border: "1.5px solid",
              borderColor: filter === f.k ? "var(--blue)" : "rgba(41,128,185,.15)",
              background: filter === f.k ? "var(--blue)" : "#fff",
              color: filter === f.k ? "#fff" : "var(--muted)",
              cursor: "pointer", fontSize: 13, fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans'",
              display: "flex", alignItems: "center", gap: 6,
              transition: "all .2s",
              boxShadow: filter === f.k ? "0 4px 14px rgba(41,128,185,.28)" : "none"
            }}
          >
            {f.l}
            <span style={{
              background: filter === f.k ? "rgba(255,255,255,.22)" : "rgba(41,128,185,.08)",
              borderRadius: 10, padding: "1px 7px", fontSize: 11
            }}>
              {f.n}
            </span>
          </button>
        ))}
      </div>
      <div className="wcard" style={{ padding: 18 }}>
        {shown.map(a => (
          <div key={a.id} className={`alert-row alert-${a.type}`}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              background: a.type === "critical" ? "rgba(231,76,60,.12)" : a.type === "warning" ? "rgba(243,156,18,.12)" : "rgba(39,174,96,.12)"
            }}>
              <Icon
                name={a.type === "critical" ? "warn" : a.type === "warning" ? "warn" : "check"}
                size={15}
                color={a.type === "critical" ? "#e74c3c" : a.type === "warning" ? "#f39c12" : "#27ae60"}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{a.patient}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{a.msg}</div>
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap" }}>{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
