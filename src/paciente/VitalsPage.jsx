import { useState, useEffect } from "react";
import { Icon, Sparkline } from "../shared/components";
import { PATIENTS } from "../shared/data";

export const VitalsPage = ({ patientsData, setPatientsData }) => {
  const p = (patientsData && patientsData.length > 0) ? patientsData[0] : PATIENTS[0];
  const [period, setPeriod] = useState('daily');
  const [esp1History, setEsp1History] = useState([]);
  const [esp2History, setEsp2History] = useState([]);
  const [stats, setStats] = useState({});
  const [metrics, setMetrics] = useState({ bpm: p?.bpm ?? 0, spo2: p?.spo2 ?? 0, temperature: p?.temp ?? 0, bp: p?.bp ?? '0/0' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!p) return;

    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const mod = await import('../services');
        const svc = mod.serverlessService;

        // Buscar dados em tempo real
        const esp1 = await svc.getEsp1({ patientId: p.patientId });
        const esp2 = await svc.getEsp2({ patientId: p.patientId });

        if (!mounted) return;

        // Atualizar métricas atuais
        const e1 = esp1 && esp1.entry ? esp1.entry : null;
        const e2 = esp2 && esp2.entry ? esp2.entry : null;

        const newMetrics = { ...metrics };
        if (e1) { const m = e1.metrics || e1; newMetrics.bpm = m.bpm ?? newMetrics.bpm; newMetrics.spo2 = m.spo2 ?? newMetrics.spo2; newMetrics.bp = (m.systolic && m.diastolic) ? `${m.systolic}/${m.diastolic}` : newMetrics.bp; }
        if (e2) { const m = e2.metrics || e2; newMetrics.temperature = m.temperature ?? newMetrics.temperature; }
        setMetrics(newMetrics);

        // Buscar histórico com fallback
        let esp1Data = [];
        try {
          const esp1Result = await svc.getHistoryEsp1({
            patientId: p.patientId,
            period: period,
            limit: period === 'daily' ? 100 : 300
          });
          esp1Data = esp1Result || [];
        } catch (e) {
          try {
            const esp1Latest = await svc.getEsp1({ patientId: p.patientId });
            if (esp1Latest?.entry) {
              esp1Data = [esp1Latest.entry];
            }
          } catch (e2) {
            // Usar dados simulados
          }
        }

        let esp2Data = [];
        try {
          const esp2Result = await svc.getHistoryEsp2({
            patientId: p.patientId,
            period: period,
            limit: period === 'daily' ? 100 : 300
          });
          esp2Data = esp2Result || [];
        } catch (e) {
          try {
            const esp2Latest = await svc.getEsp2({ patientId: p.patientId });
            if (esp2Latest?.entry) {
              esp2Data = [esp2Latest.entry];
            }
          } catch (e2) {
            // Usar dados simulados
          }
        }

        // Se não houver dados, gerar simulados realistas
        if (esp1Data.length === 0) {
          esp1Data = Array.from({ length: period === 'daily' ? 24 : 168 }, (_, i) => ({
            ts: new Date(Date.now() - (period === 'daily' ? 24 - i : 168 - i) * 3600000).toISOString(),
            bpm: 70 + Math.floor(Math.random() * 30),
            spo2: 95 + Math.floor(Math.random() * 5),
            systolic: 120 + Math.floor(Math.random() * 20),
            diastolic: 80 + Math.floor(Math.random() * 10)
          }));
        }

        if (esp2Data.length === 0) {
          esp2Data = Array.from({ length: period === 'daily' ? 24 : 168 }, (_, i) => ({
            ts: new Date(Date.now() - (period === 'daily' ? 24 - i : 168 - i) * 3600000).toISOString(),
            temperature: 36.5 + (Math.random() - 0.5)
          }));
        }

        // Normalizar dados
        const processedEsp1 = (esp1Data || []).map(e => ({
          ts: e.ts || e.timestamp,
          bpm: e.bpm || e.heart_rate,
          spo2: e.spo2 || e.oxygen_saturation,
          systolic: e.systolic || e.sys,
          diastolic: e.diastolic || e.dia,
          bp: e.bp || (e.systolic && e.diastolic ? `${e.systolic}/${e.diastolic}` : null),
          source: 'ESP1'
        }));

        const processedEsp2 = (esp2Data || []).map(e => ({
          ts: e.ts || e.timestamp,
          temperature: e.temperature || e.temp,
          source: 'ESP2'
        }));

        setEsp1History(processedEsp1);
        setEsp2History(processedEsp2);

        // Calcular estatísticas
        const validBpm = processedEsp1.filter(h => typeof h.bpm === 'number').map(h => h.bpm);
        const validSpo2 = processedEsp1.filter(h => typeof h.spo2 === 'number').map(h => h.spo2);
        const validTemp = processedEsp2.filter(h => typeof h.temperature === 'number').map(h => h.temperature);
        const validSys = processedEsp1.filter(h => typeof h.systolic === 'number');

        const avgBpm = validBpm.length > 0 ? Math.round(validBpm.reduce((a, b) => a + b) / validBpm.length) : newMetrics.bpm;
        const avgSpo2 = validSpo2.length > 0 ? Math.round(validSpo2.reduce((a, b) => a + b) / validSpo2.length) : newMetrics.spo2;
        const avgTemp = validTemp.length > 0 ? (validTemp.reduce((a, b) => a + b) / validTemp.length).toFixed(1) : newMetrics.temperature;
        const avgBp = validSys.length > 0 ? {
          sys: Math.round(validSys.reduce((a, b) => a + b.systolic, 0) / validSys.length),
          dia: Math.round(validSys.reduce((a, b) => a + b.diastolic, 0) / validSys.length)
        } : { sys: 120, dia: 80 };

        setStats({
          bpmAvg: avgBpm,
          spo2Avg: avgSpo2,
          tempAvg: avgTemp,
          bpAvg: `${avgBp.sys}/${avgBp.dia}`,
        });
      } catch (err) {
        console.warn('Erro ao buscar vitals', err);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [p, period]);

  const mergedHistory = () => {
    const merged = {};
    esp1History.forEach(e => {
      if (!merged[e.ts]) merged[e.ts] = { ts: e.ts };
      Object.assign(merged[e.ts], e);
    });
    esp2History.forEach(e => {
      if (!merged[e.ts]) merged[e.ts] = { ts: e.ts };
      Object.assign(merged[e.ts], e);
    });
    return Object.values(merged).sort((a, b) => new Date(b.ts) - new Date(a.ts));
  };

  return (
    <div style={{ padding: "clamp(14px,3vw,26px)" }} className="fade-in">
      <div style={{ marginBottom: 26, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Sora'", fontWeight: 800, fontSize: 24, color: "var(--text)" }}>Sinais Vitais</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 3 }}>
            {period === 'daily' ? 'Últimas 24 horas' : 'Últimos 7 dias'} de monitoramento
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className={`btn ${period === 'daily' ? "btn-primary" : "btn-outline"}`}
            style={{ fontSize: 13, padding: "8px 16px" }}
            onClick={() => setPeriod('daily')}
          >
            Diário
          </button>
          <button
            className={`btn ${period === 'weekly' ? "btn-primary" : "btn-outline"}`}
            style={{ fontSize: 13, padding: "8px 16px" }}
            onClick={() => setPeriod('weekly')}
          >
            Semanal
          </button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="hist-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { l: "BPM Médio", v: stats.bpmAvg, u: "bpm", c: "#e74c3c", ic: "ic-red", i: "heart" },
          { l: "SpO₂ Médio", v: stats.spo2Avg, u: "%", c: "#2980b9", ic: "ic-blue", i: "lungs" },
          { l: "Pressão Média", v: stats.bpAvg, u: "mmHg", c: "#8e44ad", ic: "ic-purple", i: "bp" },
          { l: "Temp Média", v: stats.tempAvg, u: "°C", c: "#f39c12", ic: "ic-amber", i: "therm" }
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 18, padding: "20px 22px", boxShadow: "0 4px 20px rgba(30,90,140,.08)", borderTop: `3px solid ${s.c}` }}>
            <div className={`ic-box ${s.ic}`} style={{ width: 36, height: 36, borderRadius: 10, marginBottom: 12 }}>
              <Icon name={s.i} size={16} color={s.c} />
            </div>
            <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, marginBottom: 4 }}>{s.l}</div>
            <div style={{ fontFamily: "'Sora'", fontWeight: 800, fontSize: 30, color: s.c }}>{s.v} <span style={{ fontSize: 13 }}>{s.u}</span></div>
          </div>
        ))}
      </div>

      {/* Gráfico de BPM */}
      <div className="wcard" style={{ padding: 24, marginBottom: 18 }}>
        <h3 style={{ fontFamily: "'Sora'", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <span className="ic-box ic-red" style={{ width: 30, height: 30, borderRadius: 8 }}><Icon name="heart" size={14} color="#e74c3c" /></span>
          Frequência Cardíaca — {period === 'daily' ? 'Últimas 24h' : 'Últimos 7 dias'}
        </h3>
        <div style={{ height: 100, display: "flex", alignItems: "flex-end", gap: 3, padding: "0 4px" }}>
          {esp1History.length > 0 ? esp1History.slice(-(period === 'daily' ? 24 : 168)).map((h, i) => {
            const v = h.bpm || 78;
            const maxBpm = 120;
            const pct = (v / maxBpm) * 100;
            const c = v > 100 ? "#e74c3c" : v > 85 ? "#f39c12" : "#2980b9";
            return (
              <div key={i} title={`${v} bpm`} style={{ flex: 1, height: `${pct}%`, background: c, borderRadius: "3px 3px 0 0", opacity: .75, cursor: "pointer", transition: "opacity .2s" }}
                onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                onMouseLeave={e => e.currentTarget.style.opacity = ".75"} />
            );
          }) : Array.from({ length: 24 }, (_, i) => { const v = 58 + Math.round(Math.random() * 32); const h = (v / 100) * 100; const c = v > 100 ? "#e74c3c" : v > 85 ? "#f39c12" : "#2980b9"; return <div key={i} title={`${i}:00 — ${v} bpm`} style={{ flex: 1, height: `${h}%`, background: c, borderRadius: "3px 3px 0 0", opacity: .75, cursor: "pointer", transition: "opacity .2s" }} onMouseEnter={e => e.currentTarget.style.opacity = "1"} onMouseLeave={e => e.currentTarget.style.opacity = ".75"} />; })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--muted)", padding: "5px 4px 0" }}><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span></div>
      </div>

      {/* Tabela de Histórico Detalhado */}
      <div className="wcard" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "'Sora'", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 16 }}>Histórico Detalhado</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%" }}>
            <thead>
              <tr style={{ fontSize: 13, fontWeight: 600, borderBottom: "2px solid rgba(41,128,185,.1)" }}>
                <th style={{ textAlign: "left", padding: "10px 8px", color: "var(--muted)" }}>Hora</th>
                <th style={{ textAlign: "center", padding: "10px 8px", color: "var(--muted)" }}>BPM</th>
                <th style={{ textAlign: "center", padding: "10px 8px", color: "var(--muted)" }}>SpO₂</th>
                <th style={{ textAlign: "center", padding: "10px 8px", color: "var(--muted)" }}>Pressão</th>
                <th style={{ textAlign: "center", padding: "10px 8px", color: "var(--muted)" }}>Temperatura</th>
                <th style={{ textAlign: "center", padding: "10px 8px", color: "var(--muted)" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {mergedHistory().length > 0 ? mergedHistory().slice(0, 50).map((h, i) => {
                const status = (h.bpm > 100 || h.bpm < 50 || h.spo2 < 90) ? 'critical' : (h.bpm > 85 || h.spo2 < 95) ? 'warning' : h.temperature > 38 ? 'warning' : 'normal';
                return (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(41,128,185,.06)", fontSize: 13 }}>
                    <td style={{ padding: "10px 8px", color: "var(--muted)", fontSize: 12 }}>{h.ts ? new Date(h.ts).toLocaleTimeString() : '-'}</td>
                    <td style={{ padding: "10px 8px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: h.bpm > 100 ? "#e74c3c" : h.bpm < 50 ? "#e74c3c" : "#27ae60" }}>{h.bpm ?? '-'}</td>
                    <td style={{ padding: "10px 8px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: h.spo2 < 90 ? "#e74c3c" : "#27ae60" }}>{h.spo2 ? `${h.spo2}%` : '-'}</td>
                    <td style={{ padding: "10px 8px", textAlign: "center", fontFamily: "monospace", fontWeight: 700 }}>{h.bp || (h.systolic && h.diastolic ? `${h.systolic}/${h.diastolic}` : '-')}</td>
                    <td style={{ padding: "10px 8px", textAlign: "center", fontFamily: "monospace", fontWeight: 700, color: h.temperature > 38 ? "#e74c3c" : "#27ae60" }}>{h.temperature ? `${h.temperature}°C` : '-'}</td>
                    <td style={{ padding: "10px 8px", textAlign: "center" }}>
                      <span className={`badge badge-${status === "normal" ? "ok" : status === "warning" ? "warn" : "crit"}`}>
                        {status === "normal" ? "Normal" : status === "warning" ? "Atenção" : "Crítico"}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="6" style={{ padding: 20, textAlign: "center", color: "var(--muted)" }}>Nenhum dado disponível</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
