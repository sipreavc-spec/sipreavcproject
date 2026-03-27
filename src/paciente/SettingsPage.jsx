import { useState } from "react";
import { Icon } from "../shared/components";

export const SettingsPage = ({ role }) => {
  const [limits, setLimits] = useState({ bpmMax: 100, bpmMin: 50, spo2Min: 90, tempMax: 38 });
  const [saved, setSaved] = useState(false);

  return (
    <div style={{ padding: "clamp(14px,3vw,26px)", maxWidth: 660 }} className="fade-in">
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontFamily: "'Sora'", fontWeight: 800, fontSize: 24, color: "var(--text)" }}>Configurações</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 3 }}>Personalize os limites e preferências do sistema</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="wcard" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "'Sora'", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
            <span className="ic-box ic-amber" style={{ width: 32, height: 32, borderRadius: 9 }}>
              <Icon name="warn" size={15} color="#f39c12" />
            </span>
            Limites de Alerta Clínico
          </h3>
          <div className="settings-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { k: "bpmMax", l: "BPM Máximo", u: "bpm" },
              { k: "bpmMin", l: "BPM Mínimo", u: "bpm" },
              { k: "spo2Min", l: "SpO₂ Mínimo", u: "%" },
              { k: "tempMax", l: "Temperatura Máxima", u: "°C" }
            ].map(f => (
              <div key={f.k}>
                <label style={{ fontSize: 11, color: "var(--muted)", display: "block", marginBottom: 5, fontWeight: 700, letterSpacing: .5 }}>
                  {f.l.toUpperCase()}
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    className="inp"
                    type="number"
                    value={limits[f.k]}
                    onChange={e => setLimits({ ...limits, [f.k]: e.target.value })}
                  />
                  <span style={{ display: "flex", alignItems: "center", color: "var(--muted)", fontSize: 12, whiteSpace: "nowrap" }}>
                    {f.u}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {saved && (
            <div style={{
              marginTop: 14, padding: "10px 14px",
              background: "rgba(39,174,96,.08)",
              border: "1px solid rgba(39,174,96,.2)",
              borderRadius: 10, fontSize: 13, color: "#1e8449",
              display: "flex", alignItems: "center", gap: 8
            }}>
              <Icon name="check" size={14} color="#1e8449" />
              Limites salvos com sucesso!
            </div>
          )}
          <button
            className="btn btn-green"
            style={{ marginTop: 16, gap: 8 }}
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
          >
            <Icon name="save" size={14} color="#fff" /> Salvar Limites
          </button>
        </div>
        <div className="wcard" style={{ padding: 24 }}>
          <h3 style={{ fontFamily: "'Sora'", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
            <span className="ic-box ic-blue" style={{ width: 32, height: 32, borderRadius: 9 }}>
              <Icon name="bell" size={15} color="var(--blue)" />
            </span>
            Notificações
          </h3>
          {[
            { l: "Alertas SMS automáticos", d: "Enviar SMS em situações críticas", on: true },
            { l: "Notificações no App", d: "Push notification no dispositivo", on: true },
            { l: "Relatório automático por email", d: "Resumo diário às 08:00", on: false }
          ].map((x, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: i < 2 ? "1px solid rgba(41,128,185,.07)" : "none" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{x.l}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{x.d}</div>
              </div>
              <div style={{
                width: 46, height: 26, borderRadius: 13,
                background: x.on ? "var(--blue)" : "rgba(41,128,185,.12)",
                cursor: "pointer", position: "relative", flexShrink: 0,
                transition: "background .2s"
              }}>
                <div style={{
                  position: "absolute", top: 3, width: 20, height: 20,
                  borderRadius: "50%", background: "#fff",
                  boxShadow: "0 2px 6px rgba(0,0,0,.12)",
                  left: x.on ? 23 : 3, transition: "left .2s"
                }} />
              </div>
            </div>
          ))}
        </div>
        {role === "doctor" && (
          <div className="wcard" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: "'Sora'", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <span className="ic-box ic-teal" style={{ width: 32, height: 32, borderRadius: 9 }}>
                <Icon name="doc" size={15} color="var(--teal)" />
              </span>
              Perfil Médico
            </h3>
            <div className="settings-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {["Nome Completo", "CRM", "Especialidade", "Telefone"].map(f => (
                <div key={f}>
                  <label style={{ fontSize: 11, color: "var(--muted)", display: "block", marginBottom: 5, fontWeight: 700, letterSpacing: .5 }}>
                    {f.toUpperCase()}
                  </label>
                  <input className="inp" placeholder={f} />
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ marginTop: 16, gap: 8 }}>
              <Icon name="save" size={14} color="#fff" /> Actualizar Perfil
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
