import { useState, useEffect, useRef } from "react";
import { Icon, Sparkline, ECG } from "../shared/components";
import { PATIENTS } from "../shared/data";

export const PatientDashboard = ({ patientsData, setPatientsData }) => {
  const p = (patientsData && patientsData.length > 0) ? patientsData[0] : PATIENTS[0];
  const [metrics, setMetrics] = useState({ bpm: p?.bpm ?? 0, spo2: p?.spo2 ?? 0, temperature: p?.temp ?? 0, bp: p?.bp ?? '0/0' });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchBoth = async () => {
      try {
        const mod = await import('../services');
        const svc = mod.serverlessService;

        // ESP1: cardio (bpm/spo2)
        const esp1 = await svc.getEsp1({ patientId: p.patientId });
        // ESP2: temperature
        const esp2 = await svc.getEsp2({ patientId: p.patientId });

        if (!mounted) return;

        const e1 = esp1 && esp1.entry ? esp1.entry : null;
        const e2 = esp2 && esp2.entry ? esp2.entry : null;

        // Merge metrics (prefer newest values when available)
        const newMetrics = { ...metrics };
        if (e1) { const m = e1.metrics || e1; newMetrics.bpm = m.bpm ?? newMetrics.bpm; newMetrics.spo2 = m.spo2 ?? newMetrics.spo2; newMetrics.bp = (m.systolic && m.diastolic) ? `${m.systolic}/${m.diastolic}` : newMetrics.bp; }
        if (e2) { const m = e2.metrics || e2; newMetrics.temperature = m.temperature ?? newMetrics.temperature; }
        setMetrics(newMetrics);

        // Also update centralized patientsData so Doctor tab and Patients page reflect changes
        try {
          const lastTs = (e1 && e1.ts) || (e2 && e2.ts) || Date.now();
          setPatientsData(prev => (prev || []).map(item => {
            if (item.patientId !== p.patientId) return item;
            return {
              ...item,
              bpm: newMetrics.bpm ?? item.bpm,
              spo2: newMetrics.spo2 ?? item.spo2,
              temp: newMetrics.temperature ?? item.temp,
              bp: newMetrics.bp ?? item.bp,
              lastTs,
              lastUp: ((() => {
                const diff = Date.now() - lastTs; const s = Math.floor(diff / 1000);
                if (s < 60) return `${s}s`;
                const m = Math.floor(s / 60); if (m < 60) return `${m}m`; const h = Math.floor(m / 60); return `${h}h`;
              })()),
            };
          }));
        } catch (err) { /* ignore */ }

        // For history, fetch recent entries (use existing history fetch)
        const hist = await svc.getEntries({ patientId: p.patientId, limit: 100 });
        if (!mounted) return;
        setHistory(hist.map(e => ({ ...(e.metrics || e), ts: e.ts })));
      } catch (err) { /* ignore */ }
    };

    // Initial fetch + polling every 500ms (reduced load)
    fetchBoth();
    const iv = setInterval(fetchBoth, 500);
    return () => { mounted = false; clearInterval(iv); };
  }, []);

  const vitals = [
    { icon: "heart", label: "Frequência Cardíaca", value: Math.round(metrics.bpm), unit: "bpm", status: metrics.bpm > 100 ? "critical" : metrics.bpm > 90 ? "warning" : "normal", color: "#e74c3c", ic: "ic-red", showECG: true, sub: "Limite: 60–100 bpm" },
    { icon: "lungs", label: "Saturação SpO₂", value: Math.round(metrics.spo2), unit: "%", status: metrics.spo2 < 90 ? "critical" : metrics.spo2 < 94 ? "warning" : "normal", color: "#2980b9", ic: "ic-blue", sub: "Mínimo: 95%" },
    { icon: "therm", label: "Temperatura Corporal", value: metrics.temperature, unit: "°C", status: metrics.temperature > 38 ? "critical" : metrics.temperature > 37.5 ? "warning" : "normal", color: "#f39c12", ic: "ic-amber", sub: "Normal: 36.1–37.5°C" },
    { icon: "bp", label: "Pressão Arterial", value: metrics.bp, unit: "mmHg", status: "normal", color: "#8e44ad", ic: "ic-purple", sub: "Última medição" },
  ];

  return (
    <div style={{ padding: "clamp(14px,3vw,26px)" }} className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontFamily: "'Sora'", fontWeight: 800, fontSize: 24, color: "var(--text)" }}>Olá, {p.name.split(" ")[0]}</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 3 }}>Monitoramento ativo · Última leitura: há {p.lastUp}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(39,174,96,.08)", border: "1px solid rgba(39,174,96,.2)", borderRadius: 12, padding: "8px 16px" }}>
          <span className="sdot sdot-ok" />
          <span style={{ fontSize: 13, color: "#1e8449", fontWeight: 700 }}>Sinais Normais</span>
        </div>
      </div>

      {/* Vitals */}
      <div className="dash-vitals" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(215px,1fr))", gap: 14, marginBottom: 22 }}>
        {vitals.map((v, i) => (
          <div key={i} className="vcard" style={{ borderTop: `3px solid ${v.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div className={`ic-box ${v.ic}`} style={{ width: 40, height: 40, borderRadius: 11 }} >
                <Icon name={v.icon} size={19} color={v.color} />
              </div>
              <span className={`badge badge-${v.status === "normal" ? "ok" : v.status === "warning" ? "warn" : "crit"}`}>
                {v.status === "normal" ? "Normal" : v.status === "warning" ? "Atenção" : "Crítico"}
              </span>
            </div>
            <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, marginBottom: 4, letterSpacing: .5 }}>{v.label.toUpperCase()}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 3 }}>
              <span style={{ fontFamily: "'Sora'", fontWeight: 800, fontSize: 36, color: v.color, lineHeight: 1 }}>{v.value}</span>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>{v.unit}</span>
            </div>
            <div style={{ fontSize: 11, color: "#a8c8de", marginBottom: v.showECG ? 10 : 0 }}>{v.sub}</div>
            {v.showECG && <div className="ecg-wrap" style={{ height: 36, borderRadius: 8, background: "rgba(231,76,60,.04)" }}><ECG color={v.color} h={36} /></div>}
          </div>
        ))}
      </div>

      {/* History sparkline */}
      <div className="wcard" style={{ padding: 18, marginTop: 8 }}>
        <h4 style={{ margin: 0, fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>Últimas leituras (BPM)</h4>
        <div style={{ height: 48 }}>
          <Sparkline values={history.map(h => h.bpm).filter(v => typeof v === 'number')} color="#e74c3c" h={48} />
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: "var(--muted)" }}>Mostrando até {history.length} leituras</div>
      </div>

      <div className="dash-bottom" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 18 }}>
        <div className="wcard" style={{ padding: 22 }}>
          <h3 style={{ fontFamily: "'Sora'", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <span className="ic-box ic-gray" style={{ width: 30, height: 30, borderRadius: 8 }}><Icon name="doc" size={14} color="var(--muted)" /></span>
            Informações
          </h3>
          {[{ l: "Médico", v: p.doctor }, { l: "Próxima Consulta", v: "22/03/2026" }, { l: "Medicação", v: "AAS 100mg, Losartana" }, { l: "Dispositivo", v: "ESP32 #001 · Online" }].map((x, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid rgba(41,128,185,.07)" : "none" }}>
              <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>{x.l}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", textAlign: "right", maxWidth: 160 }}>{x.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
