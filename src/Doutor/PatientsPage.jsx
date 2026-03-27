import { useState, useEffect, useRef } from "react";
import { Icon, Sparkline } from "../shared/components";
import { PATIENTS, ALERTS } from "../shared/data";

export const PatientsPage = ({ patientsData, setPatientsData, onSelectPatient }) => {
  const [sel, setSel] = useState(null);
  const [q, setQ] = useState("");
  const [liveMap, setLiveMap] = useState({}); // patientId -> latest metrics
  const [selHistory, setSelHistory] = useState([]);

  const shown = (patientsData || []).filter(p => p.name.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    // Derive liveMap from centralized patientsData to avoid duplicate network polling
    const map = {};
    shown.forEach(p => {
      map[p.patientId] = { bpm: p.bpm, spo2: p.spo2, temp: p.temp, bp: p.bp, lastUp: p.lastUp };
    });
    setLiveMap(map);
  }, [q, patientsData]);

  // Quando um paciente é selecionado, buscar histórico recente (últimas 100 leituras)
  useEffect(() => {
    let mounted = true;
    if (!sel) { return; }
    (async () => {
      try {
        const mod = await import('../services');
        const svc = mod.serverlessService;
        const entries = await svc.getEntries({ patientId: sel.patientId, limit: 100 });
        if (!mounted) return;
        setSelHistory(entries.map(e => ({ ...(e.metrics || e), ts: e.ts })));
      } catch (err) { console.warn('Erro ao buscar histórico do paciente', err); }
    })();
    return () => { mounted = false; };
  }, [sel]);

  return (
    <div style={{ padding: "clamp(14px,3vw,26px)" }} className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Sora'", fontWeight: 800, fontSize: 24, color: "var(--text)" }}>Gestão de Pacientes</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 3 }}>{PATIENTS.length} pacientes cadastrados</p>
        </div>
        <button className="btn btn-primary" style={{ gap: 8 }}>
          <Icon name="plus" size={14} color="#fff" /> Adicionar Paciente
        </button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <input className="inp" placeholder="Pesquisar paciente..." value={q} onChange={e => setQ(e.target.value)} style={{ maxWidth: 310 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: sel ? "1fr 1fr" : "1fr", gap: 18 }} className="patients-grid">
        <div className="wcard" style={{ overflow: "hidden" }}>
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>BPM</th>
                <th>SpO₂</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {shown.map(p => (
                <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => setSel(p)}>
                  <td>
                    <div style={{ fontWeight: 700, color: "var(--text)" }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{p.age} anos · {p.doctor}</div>
                  </td>
                  <td style={{ fontFamily: "monospace", fontWeight: 700, color: (liveMap[p.patientId]?.bpm || p.bpm) > 100 ? "#e74c3c" : "#27ae60" }}>
                    {liveMap[p.patientId]?.bpm ?? p.bpm}
                  </td>
                  <td style={{ fontFamily: "monospace", fontWeight: 700, color: (liveMap[p.patientId]?.spo2 || p.spo2) < 90 ? "#e74c3c" : "#27ae60" }}>
                    {(liveMap[p.patientId]?.spo2 ?? p.spo2)}%
                  </td>
                  <td>
                    <span className={`badge badge-${(liveMap[p.patientId]?.status || p.status) === "normal" ? "ok" : (liveMap[p.patientId]?.status || p.status) === "warning" ? "warn" : "crit"}`}>
                      {(liveMap[p.patientId]?.status || p.status) === "normal" ? "Normal" : (liveMap[p.patientId]?.status || p.status) === "warning" ? "Atenção" : "Crítico"}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline" style={{ fontSize: 11, padding: "5px 12px" }} onClick={e => { e.stopPropagation(); setSel(p); }}>
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sel && (
          <div className="wcard slide-r" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
              <h3 style={{ fontFamily: "'Sora'", fontWeight: 700, fontSize: 17, color: "var(--text)" }}>{sel.name}</h3>
              <button className="btn btn-outline" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => setSel(null)}>
                Fechar
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
              {[
                { l: "BPM", v: sel.bpm, c: "#e74c3c", ic: "ic-red", i: "heart" },
                { l: "SpO₂", v: `${sel.spo2}%`, c: "#2980b9", ic: "ic-blue", i: "lungs" },
                { l: "Temperatura", v: `${sel.temp}°C`, c: "#f39c12", ic: "ic-amber", i: "therm" },
                { l: "Pressão", v: sel.bp, c: "#8e44ad", ic: "ic-purple", i: "bp" }
              ].map((x, i) => (
                <div key={i} style={{ background: "var(--bg)", borderRadius: 12, padding: "14px", textAlign: "center" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, margin: "0 auto 6px" }} className={`ic-box ${x.ic}`}>
                    <Icon name={x.i} size={13} color={x.c} />
                  </div>
                  <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, marginBottom: 3 }}>{x.l}</div>
                  <div style={{ fontFamily: "'Sora'", fontWeight: 800, fontSize: 22, color: x.c }}>{x.v}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
              Médico: <strong style={{ color: "var(--text)" }}>{sel.doctor}</strong>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary" style={{ flex: 1, fontSize: 12, justifyContent: "center", gap: 6 }} onClick={() => { onSelectPatient && onSelectPatient(sel); }}>
                <Icon name="chart" size={13} color="#fff" /> Ver Histórico
              </button>
              <button className="btn btn-outline" style={{ flex: 1, fontSize: 12, justifyContent: "center", gap: 6 }}>
                <Icon name="edit" size={13} color="var(--blue)" /> Editar
              </button>
              <button style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(231,76,60,.25)", background: "rgba(231,76,60,.06)", color: "#c0392b", cursor: "pointer", display: "flex", alignItems: "center" }}>
                <Icon name="trash" size={15} color="#c0392b" />
              </button>
            </div>

            {/* Histórico do paciente */}
            <div style={{ marginTop: 18 }}>
              <h4 style={{ margin: 0, fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>Histórico Recente</h4>
              <div style={{ height: 48, marginBottom: 8 }}>
                <Sparkline values={selHistory.map(h => h.bpm).filter(v => typeof v === 'number')} color="#e74c3c" h={48} />
              </div>
              <div style={{ maxHeight: 220, overflowY: "auto", borderTop: "1px solid rgba(41,128,185,.06)", paddingTop: 8 }}>
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr style={{ textAlign: "left", fontSize: 12, color: "var(--muted)" }}>
                      <th>Hora</th>
                      <th>BPM</th>
                      <th>SpO₂</th>
                      <th>Temp</th>
                      <th>Pressão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selHistory.slice(0, 50).map((h, i) => (
                      <tr key={i} style={{ fontSize: 13 }}>
                        <td style={{ fontSize: 12, color: "var(--muted)" }}>{new Date(h.ts).toLocaleTimeString()}</td>
                        <td style={{ fontFamily: "monospace", fontWeight: 700 }}>{h.bpm ?? '-'}</td>
                        <td style={{ fontFamily: "monospace", fontWeight: 700 }}>{h.spo2 ? `${h.spo2}%` : '-'}</td>
                        <td style={{ fontFamily: "monospace", fontWeight: 700 }}>{h.temperature ?? '-'}</td>
                        <td style={{ fontFamily: "monospace", fontWeight: 700 }}>
                          {(h.systolic && h.diastolic) ? `${h.systolic}/${h.diastolic}` : (h.bp ?? '-')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
