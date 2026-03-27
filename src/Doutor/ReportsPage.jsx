import { Icon } from "../shared/components";

export const ReportsPage = ({ patientsData = [] }) => (
  <div style={{ padding: "clamp(14px,3vw,26px)" }} className="fade-in">
    <div style={{ marginBottom: 26 }}>
      <h1 style={{ fontFamily: "'Sora'", fontWeight: 800, fontSize: 24, color: "var(--text)" }}>Relatórios Clínicos</h1>
      <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 3 }}>Análise histórica dos dados</p>
    </div>
    <div className="reports-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16, marginBottom: 26 }}>
      {[
        { t: "Relatório Diário", d: "Resumo das últimas 24h", icon: "chart", c: "#2980b9", ic: "ic-blue" },
        { t: "Relatório Semanal", d: "Análise dos últimos 7 dias", icon: "trend", c: "#27ae60", ic: "ic-green" },
        { t: "Relatório Mensal", d: "Visão mensal de evolução", icon: "file", c: "#8e44ad", ic: "ic-purple" },
        { t: "Exportar PDF/Excel", d: "Download dos relatórios", icon: "save", c: "#f39c12", ic: "ic-amber" }
      ].map((r, i) => (
        <div
          key={i}
          style={{
            background: "#fff", borderRadius: 20, padding: 24,
            boxShadow: "0 4px 20px rgba(30,90,140,.08)",
            borderTop: `3px solid ${r.c}`,
            cursor: "pointer", transition: "transform .2s,box-shadow .2s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(30,90,140,.14)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(30,90,140,.08)";
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div className={`ic-box ${r.ic}`} style={{ width: 50, height: 50, borderRadius: 14 }}>
              <Icon name={r.icon} size={22} color={r.c} />
            </div>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="arrow" size={13} color="var(--blue)" />
            </div>
          </div>
          <h3 style={{ fontFamily: "'Sora'", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 5 }}>{r.t}</h3>
          <p style={{ fontSize: 12, color: "var(--muted)" }}>{r.d}</p>
        </div>
      ))}
    </div>
    <div className="wcard" style={{ padding: 22 }}>
      <h3 style={{ fontFamily: "'Sora'", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 18 }}>Evolução dos Pacientes</h3>
      <table>
        <thead>
          <tr>
            <th>Paciente</th>
            <th>BPM Médio</th>
            <th>SpO₂ Médio</th>
            <th>Alertas (7d)</th>
            <th>Evolução</th>
          </tr>
        </thead>
        <tbody>
          {(patientsData || []).map(p => (
            <tr key={p.id}>
              <td>
                <div style={{ fontWeight: 700, color: "var(--text)" }}>{p.name}</div>
              </td>
              <td style={{ fontFamily: "monospace", fontWeight: 700 }}>{p.bpm}</td>
              <td style={{ fontFamily: "monospace", fontWeight: 700 }}>{p.spo2}%</td>
              <td>
                {p.status === "critical" ? (
                  <span className="badge badge-crit">5 alertas</span>
                ) : p.status === "warning" ? (
                  <span className="badge badge-warn">2 alertas</span>
                ) : (
                  <span className="badge badge-ok">0 alertas</span>
                )}
              </td>
              <td style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
                {p.status === "normal" ? "Estável" : p.status === "warning" ? "Em observação" : "Requer atenção"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
