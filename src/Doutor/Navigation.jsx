import { useState, useEffect, useRef } from "react";
import { Icon } from "../shared/components";
import { PATIENTS, ALERTS } from "../shared/data";

export const NAV_DOCTOR = [
  {icon:"hosp",  l:"Dashboard",     p:"dashboard"},
  {icon:"users", l:"Pacientes",     p:"patients"},
  {icon:"bell",  l:"Alertas",       p:"alerts"},
  {icon:"file",  l:"Relatórios",    p:"reports"},
  {icon:"gear",  l:"Configurações", p:"settings"},
];

export const NAV_PATIENT = [
  {icon:"chart", l:"Dashboard",     p:"dashboard"},
  {icon:"heart", l:"Sinais Vitais", p:"vitals"},
  {icon:"bell",  l:"Alertas",       p:"alerts"},
  {icon:"gear",  l:"Configurações", p:"settings"},
];

export const Sidebar = ({ role, active, onNav, onLogout }) => {
  const nav = role === "doctor" ? NAV_DOCTOR : NAV_PATIENT;
  return (
    <div style={{ width: 216, background: "#fff", borderRight: "1px solid rgba(41,128,185,.08)", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, flexShrink: 0, boxShadow: "2px 0 16px rgba(30,90,140,.05)" }}>
      <div style={{ padding: "20px 18px", borderBottom: "1px solid rgba(41,128,185,.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 37, height: 37, borderRadius: 10, background: "linear-gradient(135deg,#2980b9,#27aae1)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(39,170,225,.28)" }}>
            <Icon name="brain" size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "'Sora'", fontWeight: 800, fontSize: 14, color: "var(--text)" }}>SIPRE-AVC</div>
            <div style={{ fontSize: 10, color: "var(--muted)" }}>{role === "doctor" ? "Painel Médico" : "Painel Paciente"}</div>
          </div>
        </div>
      </div>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(41,128,185,.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(39,174,96,.07)", border: "1px solid rgba(39,174,96,.2)", borderRadius: 10, padding: "8px 12px" }}>
          <span className="sdot sdot-ok pdot" />
          <span style={{ fontSize: 10, color: "#1e8449", fontWeight: 700 }}>AO VIVO · ESP32</span>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "10px 10px", overflowY: "auto" }}>
        {nav.map((n, i) => (
          <button key={i} className={`snav ${active === n.p ? "active" : ""}`} onClick={() => onNav(n.p)} style={{ width: "100%" }}>
            <span className="snav-icon"><Icon name={n.icon} size={16} color="currentColor" /></span>
            <span>{n.l}</span>
          </button>
        ))}
      </nav>
      <div style={{ padding: "10px", borderTop: "1px solid rgba(41,128,185,.07)" }}>
        <button onClick={onLogout} className="snav" style={{ width: "100%", background: "rgba(231,76,60,.08)", color: "#c0392b" }}>
          <span className="snav-icon"><Icon name="log" size={16} /></span>
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export const Topbar = ({ role, onMenuNav }) => (
  <div style={{ height: 64, background: "#fff", borderBottom: "1px solid rgba(41,128,185,.08)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(14px,3vw,26px)", boxShadow: "0 2px 8px rgba(30,90,140,.06)", position: "sticky", top: 0, zIndex: 100 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <button onClick={onMenuNav} style={{ display: "none", border: "none", background: "none", cursor: "pointer", fontSize: 20 }} className="mob-menu-btn"><Icon name="menu" size={20} color="var(--text)" /></button>
      <div style={{ fontFamily: "'Sora'", fontWeight: 800, fontSize: 16, color: "var(--text)" }}>SIPRE-AVC</div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(39,174,96,.08)", border: "1px solid rgba(39,174,96,.2)", borderRadius: 10, padding: "6px 12px" }}>
        <span className="sdot sdot-ok pdot" />
        <span style={{ fontSize: 11, color: "#1e8449", fontWeight: 700 }}>ACTIVO</span>
      </div>
      <div style={{ width: 32, height: 32, borderRadius: 50, background: "rgba(41,128,185,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="user" size={16} color="var(--blue)" />
      </div>
    </div>
  </div>
);
