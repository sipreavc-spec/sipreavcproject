import { useState, useEffect, useRef } from "react";
import { Icon } from "../shared/components";

export const DoctorDashboard = ({ onNav, patientsData, setPatientsData }) => {
  const patientsRef = useRef(patientsData);
  useEffect(() => {
    patientsRef.current = patientsData;
  }, [patientsData]);

  const computeStatus = (p) => {
    if (!p) return "desconhecido";
    if (p.bpm > 100 || (p.spo2 != null && p.spo2 < 90) || (p.temp != null && p.temp > 38)) return "critical";
    if (p.bpm > 90 || (p.spo2 != null && p.spo2 < 94) || (p.temp != null && p.temp > 37.5)) return "warning";
    return "normal";
  };

  const summaryCards = [
    { l: "Total Pacientes", v: patientsData.length, icon: "users", c: "#2980b9", ic: "ic-blue" },
    { l: "Normais", v: patientsData.filter(p => computeStatus(p) === "normal").length, icon: "check", c: "#27ae60", ic: "ic-green" },
    { l: "Em Atenção", v: patientsData.filter(p => computeStatus(p) === "warning").length, icon: "warn", c: "#f39c12", ic: "ic-amber" },
    { l: "Estado Crítico", v: patientsData.filter(p => computeStatus(p) === "critical").length, icon: "bell", c: "#e74c3c", ic: "ic-red" },
  ];

  const critical = (patientsData || []).filter(p => computeStatus(p) === "critical");

  const formatAgo = (tsMs) => {
    if (!tsMs) return "--";
    const diff = Date.now() - tsMs;
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    return `${h}h`;
  };

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      try {
        const mod = await import("../services");
        const svc = mod.serverlessService;
        const ids = (patientsRef.current || []).map(p => p.patientId).join(",");
        const [esp1Res, esp2Res] = await Promise.all([svc.getEsp1({ patientIds: ids }), svc.getEsp2({ patientIds: ids })]);
        if (!mounted) return;
        const entries1 = esp1Res && esp1Res.entries ? esp1Res.entries : {};
        const entries2 = esp2Res && esp2Res.entries ? esp2Res.entries : {};
        const updated = (patientsRef.current || []).map(p => {
          const newP = { ...p };
          const e1 = entries1[p.patientId];
          const e2 = entries2[p.patientId];
          if (e1) {
            const m = e1.metrics || e1;
            newP.bpm = m.bpm ?? newP.bpm;
            newP.spo2 = m.spo2 ?? newP.spo2;
            newP.bp = m.systolic && m.diastolic ? `${m.systolic}/${m.diastolic}` : newP.bp;
            newP.lastTs = e1.ts;
          }
          if (e2) {
            const m = e2.metrics || e2;
            newP.temp = m.temperature ?? newP.temp;
            newP.lastTs = e2.ts;
          }
          newP.status = computeStatus(newP);
          newP.lastUp = newP.lastTs ? formatAgo(newP.lastTs) : newP.lastUp;
          return newP;
        });
        setPatientsData(updated);
      } catch (err) {
        console.warn("Erro ao buscar leituras do backend", err);
      }
    };
    fetchAll();
    const iv = setInterval(fetchAll, 500);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, []);

  return (
    <div style={{ padding: "clamp(14px,3vw,26px)" }} className="fade-in">
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontFamily: "'Sora'", fontWeight: 800, fontSize: 24, color: "var(--text)" }}>Dashboard Médico</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 3 }}>Monitoramento de {patientsData.length} pacientes activos</p>
      </div>

      <div className="summary-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 14, marginBottom: 22 }}>
        {summaryCards.map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 18, padding: "20px 22px", boxShadow: "0 4px 20px rgba(30,90,140,.08)", borderTop: `3px solid ${s.c}` }}>
            <div className={`ic-box ${s.ic}`} style={{ width: 40, height: 40, borderRadius: 11, marginBottom: 12 }}>
              <Icon name={s.icon} size={18} color={s.c} />
            </div>
            <div style={{ fontFamily: "'Sora'", fontWeight: 800, fontSize: 34, color: s.c, lineHeight: 1 }}>{s.v}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, marginTop: 4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {critical.length > 0 && (
        <div style={{ background: "rgba(231,76,60,.07)", border: "1.5px solid rgba(231,76,60,.22)", borderRadius: 16, padding: "14px 20px", marginBottom: 18, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(231,76,60,.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="warn" size={18} color="#e74c3c" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, color: "#c0392b", fontSize: 14 }}>{critical.length} paciente(s) em estado crítico</div>
            <div style={{ fontSize: 12, color: "#e74c3c", marginTop: 2 }}>{critical.map(p => p.name).join(", ")} — SMS enviado automaticamente</div>
          </div>
          <button className="btn btn-red" style={{ fontSize: 12, padding: "8px 16px", gap: 6 }} onClick={() => onNav("patients")}>
            Ver Pacientes <Icon name="arrow" size={13} color="#fff" />
          </button>
        </div>
      )}

      <div className="wcard" style={{ overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", borderBottom: "1px solid rgba(41,128,185,.07)" }}>
          <h3 style={{ fontFamily: "'Sora'", fontWeight: 700, fontSize: 17, color: "var(--text)" }}>Pacientes Monitorados</h3>
          <button className="btn btn-outline" style={{ fontSize: 12, padding: "7px 16px", gap: 6 }} onClick={() => onNav("patients")}>
            Ver todos <Icon name="arrow" size={13} color="var(--blue)" />
          </button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>BPM</th>
                <th>SpO₂</th>
                <th>Temp</th>
                <th>Pressão</th>
                <th>Status</th>
                <th>Última Leitura</th>
              </tr>
            </thead>
            <tbody>
              {patientsData.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: "var(--text)" }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{p.age} anos</div>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span className={`sdot ${p.bpm > 100 ? "sdot-crit" : p.bpm > 90 ? "sdot-warn" : "sdot-ok"}`} />
                      <span style={{ fontFamily: "monospace", fontWeight: 700, color: p.bpm > 100 ? "#e74c3c" : p.bpm > 90 ? "#f39c12" : "var(--text)" }}>{p.bpm}</span>
                    </div>
                  </td>
                  <td style={{ fontFamily: "monospace", fontWeight: 700, color: p.spo2 < 90 ? "#e74c3c" : "var(--text)" }}>{p.spo2}%</td>
                  <td style={{ fontFamily: "monospace", fontWeight: 700, color: p.temp > 38 ? "#e74c3c" : "var(--text)" }}>{p.temp}°C</td>
                  <td style={{ fontFamily: "monospace", fontWeight: 600, color: "var(--text)" }}>{p.bp}</td>
                  <td>
                    <span className={`badge badge-${p.status === "normal" ? "ok" : p.status === "warning" ? "warn" : "crit"}`}>
                      {p.status === "normal" ? "Normal" : p.status === "warning" ? "Atenção" : "Crítico"}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: "var(--muted)" }}>há {p.lastUp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
