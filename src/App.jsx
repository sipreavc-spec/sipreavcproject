import { useState, useEffect, useRef } from "react";

/* ─── VIEWPORT META (ensures proper mobile scaling) ───────────────── */
(()=>{
  if(!document.querySelector('meta[name="viewport"]')){
    const m=document.createElement("meta");
    m.name="viewport"; m.content="width=device-width,initial-scale=1,maximum-scale=1";
    document.head.appendChild(m);
  }
})();

/* ─── GLOBAL STYLES ───────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

  :root {
    --bg:      #eaf4fb;
    --bg2:     #d6eaf6;
    --white:   #ffffff;
    --card:    rgba(255,255,255,0.78);
    --blue:    #2980b9;
    --blue2:   #3498db;
    --bluedark:#1a5f8a;
    --teal:    #27aae1;
    --green:   #27ae60;
    --text:    #1a3a52;
    --muted:   #6a96b5;
    --border:  rgba(255,255,255,0.65);
    --shadow:  0 8px 32px rgba(30,90,140,0.10);
    --shadow-lg:0 20px 60px rgba(30,90,140,0.18);
    --danger:  #e74c3c;
    --warning: #f39c12;
    --success: #27ae60;
  }

  body { font-family:'Plus Jakarta Sans',sans-serif; background:var(--bg); color:var(--text); min-height:100vh; }
  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:var(--bg); }
  ::-webkit-scrollbar-thumb { background:var(--teal); border-radius:3px; }

  @keyframes fadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.9)} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes wave    { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes heartbt { 0%,100%{transform:scale(1)} 15%{transform:scale(1.2)} 30%{transform:scale(1)} 45%{transform:scale(1.12)} }
  @keyframes slideR  { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes shimmer { 0%{opacity:.6} 50%{opacity:1} 100%{opacity:.6} }

  .fade-up  { animation:fadeUp .55s cubic-bezier(.22,1,.36,1) both; }
  .fade-in  { animation:fadeIn .4s ease both; }
  .floating { animation:float 4s ease-in-out infinite; }
  .pdot     { animation:pulse 2s ease-in-out infinite; }
  .spinner  { animation:spin .8s linear infinite; }
  .slide-r  { animation:slideR .4s ease both; }
  .hb       { animation:heartbt 1.6s ease-in-out infinite; }

  .glass {
    background:var(--card);
    backdrop-filter:blur(18px);
    -webkit-backdrop-filter:blur(18px);
    border:1px solid var(--border);
    border-radius:20px;
    box-shadow:var(--shadow);
  }

  .btn {
    display:inline-flex; align-items:center; gap:8px;
    padding:12px 24px; border-radius:12px; border:none;
    font-family:'Plus Jakarta Sans',sans-serif;
    font-weight:700; font-size:14px; cursor:pointer;
    transition:all .22s cubic-bezier(.22,1,.36,1);
    text-decoration:none;
  }
  .btn-primary { background:var(--blue); color:#fff; box-shadow:0 4px 20px rgba(41,128,185,.32); }
  .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(41,128,185,.44); background:var(--bluedark); }
  .btn-green { background:var(--green); color:#fff; box-shadow:0 4px 16px rgba(39,174,96,.35); }
  .btn-green:hover { transform:translateY(-2px); }
  .btn-white { background:#fff; color:var(--blue); box-shadow:0 4px 16px rgba(0,0,0,.1); }
  .btn-white:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.15); }
  .btn-outline { background:transparent; border:1.5px solid rgba(41,128,185,.22); color:var(--blue); }
  .btn-outline:hover { background:rgba(41,128,185,.06); border-color:var(--blue); }
  .btn-red { background:#e74c3c; color:#fff; }

  .inp {
    width:100%; padding:13px 16px;
    background:rgba(255,255,255,.88);
    border:1.5px solid rgba(41,128,185,.14);
    border-radius:12px;
    font-family:'Plus Jakarta Sans',sans-serif;
    font-size:14px; color:var(--text);
    outline:none; transition:all .2s;
  }
  .inp:focus { border-color:var(--teal); box-shadow:0 0 0 3px rgba(39,170,225,.12); }
  .inp::placeholder { color:#a8c8de; }

  .badge {
    display:inline-flex; align-items:center; gap:5px;
    padding:4px 12px; border-radius:30px;
    font-size:11px; font-weight:700; letter-spacing:.4px;
  }
  .badge-ok   { background:rgba(39,174,96,.12); color:#1e8449; }
  .badge-crit { background:rgba(231,76,60,.12); color:#c0392b; }
  .badge-warn { background:rgba(243,156,18,.12); color:#d68910; }
  .badge-blue { background:rgba(41,128,185,.1); color:var(--blue2); }
  .badge-teal { background:rgba(39,170,225,.12); color:#1a8ab5; }

  .nav-link { padding:9px 16px; border-radius:10px; cursor:pointer; font-weight:600; font-size:14px; color:var(--muted); transition:all .2s; white-space:nowrap; }
  .nav-link:hover { color:var(--blue); background:rgba(41,128,185,.07); }
  .nav-link.active { color:var(--blue); background:rgba(41,128,185,.1); }

  .snav { display:flex; align-items:center; gap:10px; padding:11px 14px; border-radius:12px; cursor:pointer; font-size:14px; font-weight:600; color:var(--muted); transition:all .2s; }
  .snav:hover { color:var(--blue); background:rgba(41,128,185,.07); }
  .snav.active { color:var(--blue); background:rgba(41,128,185,.1); border-left:3px solid var(--blue); }
  .snav-icon { width:18px; height:18px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

  table { width:100%; border-collapse:collapse; }
  th { padding:12px 16px; font-size:11px; font-weight:700; letter-spacing:.8px; text-transform:uppercase; color:var(--muted); text-align:left; border-bottom:1.5px solid rgba(41,128,185,.08); }
  td { padding:13px 16px; font-size:13px; border-bottom:1px solid rgba(41,128,185,.06); }
  tr:last-child td { border-bottom:none; }
  tr:hover td { background:rgba(41,128,185,.025); }

  .vcard { background:#fff; border-radius:18px; padding:20px; box-shadow:0 4px 24px rgba(30,90,140,.08); transition:transform .2s,box-shadow .2s; position:relative; overflow:hidden; }
  .vcard:hover { transform:translateY(-3px); box-shadow:0 12px 36px rgba(30,90,140,.14); }

  .alert-row { display:flex; align-items:center; gap:14px; padding:14px 16px; border-radius:14px; margin-bottom:8px; }
  .alert-critical { background:rgba(231,76,60,.07); border:1px solid rgba(231,76,60,.2); }
  .alert-warning  { background:rgba(243,156,18,.07); border:1px solid rgba(243,156,18,.2); }
  .alert-normal   { background:rgba(39,174,96,.07); border:1px solid rgba(39,174,96,.2); }

  .ecg-wrap { overflow:hidden; position:relative; }
  .ecg-svg  { position:absolute; top:0; left:0; width:200%; height:100%; animation:wave 2.8s linear infinite; }

  .wcard { background:#fff; border-radius:20px; box-shadow:0 4px 24px rgba(30,90,140,.08); }

  /* ── ICON BOXES (replace emojis in dashboards) ── */
  .ic-box {
    width:36px; height:36px; border-radius:10px;
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0;
  }
  .ic-red    { background:rgba(231,76,60,.12); color:#e74c3c; }
  .ic-blue   { background:rgba(41,128,185,.12); color:var(--blue); }
  .ic-teal   { background:rgba(39,170,225,.12); color:var(--teal); }
  .ic-amber  { background:rgba(243,156,18,.12); color:#f39c12; }
  .ic-green  { background:rgba(39,174,96,.12); color:#27ae60; }
  .ic-purple { background:rgba(142,68,173,.12); color:#8e44ad; }
  .ic-gray   { background:rgba(100,130,155,.1); color:#5a7fa0; }

  /* ── STATUS DOT ── */
  .sdot { width:9px; height:9px; border-radius:50%; display:inline-block; flex-shrink:0; }
  .sdot-ok   { background:#27ae60; }
  .sdot-warn { background:#f39c12; }
  .sdot-crit { background:#e74c3c; animation:shimmer 1.2s ease-in-out infinite; }

  /* ── SECTION ANCHORS ── */
  .section-anchor { scroll-margin-top:72px; }
`;
const styleEl = document.createElement("style");
styleEl.textContent = css;
document.head.appendChild(styleEl);

/* ─── SVG ICONS (no emojis in dashboards) ─────────────────────────── */
const Icon = ({ name, size=16, color="currentColor" }) => {
  const icons = {
    heart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    lungs: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v10M12 5C12 5 7 5 7 10v5a3 3 0 0 0 6 0M12 5c0 0 5 0 5 5v5a3 3 0 0 1-6 0"/></svg>,
    therm: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>,
    bp:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    bell:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    file:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    gear:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    home:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    logout:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    trend: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    warn:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    doc:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    brain: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.14M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.14"/></svg>,
    mail:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    phone: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    map:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    plus:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
    edit:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    wifi:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M10.54 16a3 3 0 0 1 2.92 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
    save:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    sms:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    hosp:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/></svg>,
  };
  return icons[name] || null;
};

/* ─── DATA ────────────────────────────────────────────────────────── */
// Trabalhando com apenas um paciente (dois ESPs enviarão leituras para este patientId)
const PATIENTS = [
  { id:1, patientId:"paciente123", name:"João da Silva", age:65, bpm:0, spo2:0, temp:0, bp:"0/0", status:"desconhecido", lastUp:"--", doctor:"Dra. Maria Santos" },
];
const ALERTS = [
  { id:4, patient:"João da Silva",    type:"warning",  msg:"BPM elevado: 95 bpm — em observação", time:"14:28" },
  { id:5, patient:"João da Silva", type:"normal",   msg:"Sinais vitais normalizados",            time:"14:15" },
  { id:6, patient:"João da Silva",  type:"normal",   msg:"SpO₂ excelente: 98%",                  time:"13:55" },
];

/* ─── ECG ─────────────────────────────────────────────────────────── */
const ECG = ({ color="#27aae1", h=48 }) => (
  <svg className="ecg-svg" viewBox={`0 0 600 ${h}`} preserveAspectRatio="none">
    {[0,300].map(ox=>(
      <polyline key={ox} fill="none" stroke={color} strokeWidth="1.8"
        points={`${ox},${h/2} ${ox+18},${h/2} ${ox+28},${h*.35} ${ox+38},${h*.65} ${ox+48},${h/2} ${ox+60},${h/2} ${ox+64},${h*.08} ${ox+68},${h*.92} ${ox+72},${h/2} ${ox+90},${h/2} ${ox+100},${h*.38} ${ox+110},${h*.62} ${ox+125},${h/2} ${ox+145},${h/2} ${ox+155},${h*.35} ${ox+165},${h*.65} ${ox+175},${h/2} ${ox+185},${h/2} ${ox+189},${h*.08} ${ox+193},${h*.92} ${ox+197},${h/2} ${ox+215},${h/2} ${ox+225},${h*.38} ${ox+235},${h*.62} ${ox+255},${h/2} ${ox+300},${h/2}`}/>
    ))}
  </svg>
);

/* ─── SPARKLINE ───────────────────────────────────────────────────── */
const Sparkline = ({ values = [], color = "#2980b9", h = 48 }) => {
  if (!values || values.length === 0) return <div style={{height:h}} />;
  const w = Math.max(120, values.length * 3);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{width:'100%',height:h,borderRadius:6,background:'rgba(0,0,0,0)'}}>
      <polyline fill="none" stroke={color} strokeWidth="1.6" points={points} />
    </svg>
  );
};

/* ─── NAVBAR ──────────────────────────────────────────────────────── */
const Navbar = ({ page, onNavigate }) => {
  const [mOpen,setMOpen]=useState(false);
  return(
    <nav style={{position:"sticky",top:0,zIndex:200,background:"rgba(234,244,251,.94)",backdropFilter:"blur(18px)",borderBottom:"1px solid rgba(255,255,255,.7)",padding:"0 clamp(16px,4vw,40px)",height:64,display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 2px 20px rgba(30,90,140,.06)"}}>
      <div style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}} onClick={()=>{onNavigate("home");setMOpen(false);}}>
        <div style={{width:37,height:37,borderRadius:10,background:"linear-gradient(135deg,#2980b9,#27aae1)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(39,170,225,.35)"}}>
          <Icon name="brain" size={20} color="#fff"/>
        </div>
        <div>
          <div style={{fontFamily:"'Sora'",fontWeight:800,fontSize:15,color:"var(--blue)",lineHeight:1}}>SIPRE-AVC</div>
          <div style={{fontSize:10,color:"var(--muted)",display:"none"}} className="nav-desktop">Monitoramento Pós-AVC</div>
        </div>
      </div>

      {/* Desktop links */}
      <div className="nav-desktop" style={{display:"flex",alignItems:"center",gap:4}}>
        {[["home","Início"],["sobre","Sobre"],["funcionalidades","Funcionalidades"],["contato","Contato"]].map(([p,l])=>(
          <span key={p} className={`nav-link ${page===p?"active":""}`} onClick={()=>onNavigate(p)}>{l}</span>
        ))}
      </div>

      {/* Desktop right */}
      <div className="nav-desktop" style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(39,174,96,.1)",border:"1px solid rgba(39,174,96,.25)",borderRadius:20,padding:"5px 13px"}}>
          <span className="sdot sdot-ok pdot"/>
          <span style={{fontSize:11,color:"#1e8449",fontWeight:700}}>SISTEMA ATIVO</span>
        </div>
        <button className="btn btn-primary" style={{padding:"9px 20px",fontSize:13}} onClick={()=>onNavigate("login")}>Entrar</button>
      </div>

      {/* Mobile hamburger */}
      <div className="nav-mobile" style={{display:"none",alignItems:"center",gap:10}}>
        <button className="btn btn-primary" style={{padding:"8px 16px",fontSize:12}} onClick={()=>onNavigate("login")}>Entrar</button>
        <button onClick={()=>setMOpen(o=>!o)} style={{background:"none",border:"1.5px solid rgba(41,128,185,.25)",borderRadius:9,width:38,height:38,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,cursor:"pointer",padding:8}}>
          {[0,1,2].map(i=><span key={i} style={{width:"100%",height:2,background:"var(--blue)",borderRadius:1,transition:"all .2s",transform:mOpen&&i===0?"rotate(45deg) translateY(7px)":mOpen&&i===2?"rotate(-45deg) translateY(-7px)":mOpen&&i===1?"scaleX(0)":"none",opacity:mOpen&&i===1?0:1}}/>)}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mOpen&&(
        <div style={{position:"absolute",top:64,left:0,right:0,background:"rgba(234,244,251,.97)",backdropFilter:"blur(18px)",borderBottom:"1px solid rgba(41,128,185,.1)",padding:"12px 16px",display:"flex",flexDirection:"column",gap:4,zIndex:199,boxShadow:"0 8px 24px rgba(30,90,140,.1)"}}>
          {[["home","Início"],["sobre","Sobre"],["funcionalidades","Funcionalidades"],["contato","Contato"]].map(([p,l])=>(
            <span key={p} className={`nav-link ${page===p?"active":""}`} style={{padding:"12px 14px"}} onClick={()=>{onNavigate(p);setMOpen(false);}}>{l}</span>
          ))}
        </div>
      )}
    </nav>
  );
};

/* ─── HOPE IMAGE HERO BACKGROUND ──────────────────────────────────── */
const HeroBg = () => {
  const [imgSrc, setImgSrc] = useState(
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1800&q=85&fit=crop&crop=right"
  );
  const fallbacks = [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1800&q=85&fit=crop",
    "https://images.unsplash.com/photo-1593824476820-7e9b3b9e0f6c?w=1800&q=85&fit=crop",
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1800&q=85&fit=crop",
  ];
  const [fbIdx, setFbIdx] = useState(0);
  const handleError = () => {
    if (fbIdx < fallbacks.length) {
      setImgSrc(fallbacks[fbIdx]);
      setFbIdx(i => i + 1);
    }
  };
  return (
    <div style={{position:"absolute",inset:0,zIndex:0}}>
      <img
        src={imgSrc}
        alt="Paciente pós-AVC recuperando com esperança e cuidado familiar"
        style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"60% center"}}
        onError={handleError}
      />
      {/* Left-side strong fade so text stays legible */}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(95deg, rgba(234,244,251,1) 0%, rgba(220,238,250,0.97) 30%, rgba(200,228,245,0.82) 52%, rgba(174,214,241,0.40) 72%, rgba(133,193,233,0.10) 100%)"}}/>
      {/* Soft top vignette */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:80,background:"linear-gradient(to bottom,rgba(234,244,251,.6),transparent)"}}/>
      {/* Bottom fade for stats bar */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:130,background:"linear-gradient(to top,rgba(214,234,248,.98),rgba(214,234,248,.6),transparent)"}}/>
    </div>
  );
};

/* ─── HOME PAGE ───────────────────────────────────────────────────── */
const HomePage = ({ onNavigate }) => {
  const stats = [{n:"24/7",l:"Monitoramento Contínuo"},{n:"99.9%",l:"Disponibilidade"},{n:"<30s",l:"Tempo de Alerta"},{n:"100+",l:"Pacientes Activos"}];

  const feats = [
    {icon:"heart",t:"Monitoramento Cardíaco",d:"Frequência cardíaca em tempo real via sensor MAX30105. Alertas automáticos para BPM fora dos limites clínicos.",c:"#e74c3c",ic:"ic-red"},
    {icon:"lungs",t:"Saturação de Oxigênio",d:"SpO₂ contínuo com limiar clínico configurável. Notificação imediata quando abaixo de 90%.",c:"#2980b9",ic:"ic-blue"},
    {icon:"therm",t:"Temperatura Corporal",d:"Sensor MLX90614 de alta precisão. Detecção automática de febre e hipotermia.",c:"#f39c12",ic:"ic-amber"},
    {icon:"chart",t:"Dashboard em Tempo Real",d:"Interface web no tablet via Wi-Fi local — funciona 100% offline, sem internet.",c:"#27ae60",ic:"ic-green"},
    {icon:"bell",t:"Alertas Inteligentes",d:"SMS automático via módulo GSM. Notificações push para médicos e familiares.",c:"#8e44ad",ic:"ic-purple"},
    {icon:"file",t:"Relatórios Clínicos",d:"Histórico diário, semanal, mensal. Exportação em PDF/Excel para consultas.",c:"#2980b9",ic:"ic-blue"},
  ];

  return (
    <div>
      {/* ── HERO ── */}
      <section id="home" className="section-anchor" style={{minHeight:"calc(100vh - 64px)",position:"relative",overflow:"hidden",padding:"clamp(40px,6vw,64px) clamp(16px,4vw,40px) 130px",display:"flex",alignItems:"center"}}>
        <HeroBg/>
        <div style={{maxWidth:1200,margin:"0 auto",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(24px,5vw,60px)",alignItems:"center",position:"relative",zIndex:1}} className="hero-grid">
          {/* LEFT */}
          <div className="fade-up">
            <div className="badge badge-teal" style={{marginBottom:22,padding:"7px 16px",fontSize:12,display:"inline-flex",alignItems:"center",gap:6}}>
              <span className="sdot sdot-ok pdot"/>
              Monitoramento em Tempo Real
            </div>
            <h1 className="hero-h1" style={{fontFamily:"'Sora'",fontWeight:800,fontSize:"clamp(36px,4.2vw,66px)",lineHeight:1.07,marginBottom:22,color:"var(--text)"}}>
              Cuidar com<br/>
              <span style={{background:"linear-gradient(135deg,#2980b9,#27aae1)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>tecnologia</span><br/>
              e esperança.
            </h1>
            <p style={{fontSize:15,color:"var(--muted)",lineHeight:1.8,marginBottom:34,maxWidth:440}}>
              O <strong style={{color:"var(--blue)"}}>SIPRE-AVC</strong> é um sistema de monitoramento contínuo para pacientes pós-AVC. Alertas automáticos para médicos e familiares — 24h por dia, 7 dias por semana, sem depender de internet.
            </p>
            {/* ECG decoration */}
            <div style={{width:320,marginBottom:32,height:36,position:"relative"}}>
              <div className="ecg-wrap" style={{height:36,opacity:.55}}>
                <ECG color="var(--blue)" h={36}/>
              </div>
            </div>
            <div className="hero-btns" style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <button className="btn btn-primary" style={{padding:"14px 28px",fontSize:15,gap:10}} onClick={()=>onNavigate("login")}>
                Explorar Sistema <Icon name="arrow" size={16} color="#fff"/>
              </button>
              <button className="btn btn-outline" style={{padding:"14px 28px",fontSize:15}} onClick={()=>onNavigate("funcionalidades")}>
                Ver Funcionalidades
              </button>
            </div>
          </div>

          {/* RIGHT — floating cards */}
          <div className="hero-right" style={{position:"relative",height:490}}>
            <div className="glass" style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:280,padding:22,zIndex:3}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,letterSpacing:.5}}>PACIENTE ACTIVO</div>
                  <div style={{fontFamily:"'Sora'",fontWeight:700,fontSize:16,color:"var(--text)",marginTop:2}}>João da Silva</div>
                </div>
                <span className="badge badge-ok">Normal</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                {[{l:"BPM",v:"79",c:"#e74c3c"},{l:"SpO₂",v:"96%",c:"#2980b9"},{l:"Temp",v:"36.4°",c:"#f39c12"},{l:"Pressão",v:"121/81",c:"#8e44ad"}].map((x,i)=>(
                  <div key={i} style={{background:"rgba(41,128,185,.05)",borderRadius:10,padding:"9px 10px",textAlign:"center"}}>
                    <div style={{fontSize:9,color:"var(--muted)",fontWeight:700,marginBottom:2}}>{x.l}</div>
                    <div style={{fontFamily:"'Sora'",fontWeight:800,fontSize:19,color:x.c,lineHeight:1.2}}>{x.v}</div>
                  </div>
                ))}
              </div>
              <div className="ecg-wrap" style={{height:36,borderRadius:9,background:"rgba(41,128,185,.04)"}}>
                <ECG color="#27aae1" h={36}/>
              </div>
            </div>
            {/* Chip BPM */}
            <div className="glass floating" style={{position:"absolute",top:28,right:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,zIndex:4}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(231,76,60,.12)",display:"flex",alignItems:"center",justifyContent:"center"}} className="hb">
                <Icon name="heart" size={18} color="#e74c3c"/>
              </div>
              <div>
                <div style={{fontFamily:"'Sora'",fontWeight:800,fontSize:22,color:"var(--text)",lineHeight:1}}>79 <span style={{fontSize:12,color:"var(--muted)"}}>bpm</span></div>
                <div style={{fontSize:11,color:"var(--muted)"}}>Freq. Cardíaca</div>
              </div>
            </div>
            {/* Chip SpO2 */}
            <div className="glass floating" style={{position:"absolute",bottom:68,right:-10,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,zIndex:4,animationDelay:".9s"}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(41,128,185,.12)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon name="lungs" size={18} color="#2980b9"/>
              </div>
              <div>
                <div style={{fontFamily:"'Sora'",fontWeight:800,fontSize:22,color:"var(--text)",lineHeight:1}}>96<span style={{fontSize:12,color:"var(--muted)"}}>%</span></div>
                <div style={{fontSize:11,color:"var(--muted)"}}>Saturação O₂</div>
              </div>
            </div>
            {/* Chip years */}
            <div className="glass floating" style={{position:"absolute",top:95,left:-18,padding:"13px 16px",zIndex:4,animationDelay:"1.3s"}}>
              <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,marginBottom:3}}>SISTEMA</div>
              <div style={{fontFamily:"'Sora'",fontWeight:800,fontSize:22,color:"var(--blue)"}}>22 <span style={{fontSize:13}}>Anos</span></div>
              <div style={{fontSize:10,color:"var(--muted)"}}>de Inovação Médica</div>
            </div>
            {/* Alert chip */}
            <div className="floating" style={{position:"absolute",bottom:20,left:8,background:"rgba(231,76,60,.9)",backdropFilter:"blur(10px)",borderRadius:14,padding:"9px 15px",display:"flex",alignItems:"center",gap:10,zIndex:4,boxShadow:"0 4px 16px rgba(231,76,60,.3)",animationDelay:"1.7s"}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon name="warn" size={14} color="#fff"/>
              </div>
              <div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.8)",fontWeight:700}}>ALERTA DETECTADO</div>
                <div style={{fontSize:12,color:"#fff",fontWeight:800}}>Ana F. — BPM: 122</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="stats-bar" style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(255,255,255,.65)",backdropFilter:"blur(14px)",borderTop:"1px solid rgba(255,255,255,.8)",display:"flex",justifyContent:"center",flexWrap:"wrap",zIndex:1}}>
          {stats.map((s,i)=>(
            <div key={i} style={{padding:"18px 48px",textAlign:"center",borderRight:i<stats.length-1?"1px solid rgba(41,128,185,.1)":"none"}}>
              <div style={{fontFamily:"'Sora'",fontWeight:800,fontSize:26,color:"var(--blue)"}}>{s.n}</div>
              <div style={{fontSize:11,color:"var(--muted)",fontWeight:600}}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOBRE ── */}
      <section id="sobre" className="section-anchor section-pad" style={{background:"#fff",padding:"88px 40px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(24px,5vw,64px)",alignItems:"center"}} className="about-grid">
          <div>
            <span className="badge badge-blue" style={{marginBottom:16,fontSize:12}}>SOBRE O PROJECTO</span>
            <h2 style={{fontFamily:"'Sora'",fontWeight:800,fontSize:38,color:"var(--text)",marginBottom:20,lineHeight:1.15}}>
              Sistema Inteligente<br/>de Monitoramento<br/>Pós-AVC
            </h2>
            <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.85,marginBottom:20}}>
              O <strong style={{color:"var(--blue)"}}>SIPRE-AVC</strong> foi desenvolvido para oferecer monitoramento contínuo e acessível a pacientes pós-AVC, combinando um microcontrolador ESP32, sensores físicos de alta precisão e comunicação wireless local.
            </p>
            <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.85,marginBottom:32}}>
              O sistema opera sem necessidade de internet, garantindo funcionamento confiável em ambientes hospitalares e domiciliares, 24 horas por dia, 7 dias por semana.
            </p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:32}}>
              {[{n:"100+",l:"Pacientes Monitorados"},{n:"95%",l:"Taxa de Satisfação"},{n:"200+",l:"Alertas Gerados"},{n:"4",l:"Sinais Vitais"}].map((s,i)=>(
                <div key={i} style={{background:"var(--bg)",borderRadius:14,padding:"16px 18px"}}>
                  <div style={{fontFamily:"'Sora'",fontWeight:800,fontSize:28,color:"var(--blue)"}}>{s.n}</div>
                  <div style={{fontSize:11,color:"var(--muted)",fontWeight:600}}>{s.l}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{padding:"13px 28px",fontSize:14,gap:10}} onClick={()=>onNavigate("login")}>
              Acessar o Sistema <Icon name="arrow" size={15} color="#fff"/>
            </button>
          </div>
          <div style={{position:"relative"}}>
            <div style={{background:"linear-gradient(135deg,#2980b9,#27aae1)",borderRadius:24,padding:40,color:"#fff",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-50,right:-50,width:180,height:180,borderRadius:"50%",background:"rgba(255,255,255,.08)"}}/>
              <div style={{position:"absolute",bottom:-40,left:-40,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,.06)"}}/>
              <div style={{position:"relative",zIndex:1}}>
                <div style={{width:52,height:52,borderRadius:14,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
                  <Icon name="hosp" size={26} color="#fff"/>
                </div>
                <h3 style={{fontFamily:"'Sora'",fontWeight:800,fontSize:22,marginBottom:14,lineHeight:1.3}}>Comprometidos com a saúde e bem-estar</h3>
                <p style={{fontSize:13,opacity:.88,lineHeight:1.75,marginBottom:24}}>Cada paciente merece cuidado contínuo. O SIPRE-AVC garante que nenhum sinal vital passe despercebido, seja em casa ou no hospital.</p>
                <div style={{borderTop:"1px solid rgba(255,255,255,.2)",paddingTop:20,display:"flex",gap:20}}>
                  {[{i:"wifi",l:"Wi-Fi Local"},{i:"bell",l:"Alertas SMS"},{i:"chart",l:"Relatórios"}].map((x,i)=>(
                    <div key={i} style={{textAlign:"center"}}>
                      <div style={{width:36,height:36,borderRadius:10,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 6px"}}>
                        <Icon name={x.i} size={16} color="#fff"/>
                      </div>
                      <div style={{fontSize:11,opacity:.85}}>{x.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FUNCIONALIDADES ── */}
      <section id="funcionalidades" className="section-anchor section-pad" style={{background:"var(--bg)",padding:"88px clamp(16px,4vw,40px)"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:60}}>
            <span className="badge badge-teal" style={{marginBottom:14,fontSize:12}}>FUNCIONALIDADES</span>
            <h2 style={{fontFamily:"'Sora'",fontWeight:800,fontSize:"clamp(28px,4vw,40px)",color:"var(--text)"}}>O que o sistema oferece</h2>
            <p style={{color:"var(--muted)",fontSize:15,marginTop:12,maxWidth:520,margin:"12px auto 0"}}>Tecnologia embarcada de ponta para garantir a segurança e qualidade de vida de pacientes pós-AVC.</p>
          </div>
          <div className="feat-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:18}}>
            {feats.map((f,i)=>(
              <div key={i} style={{background:"#fff",borderRadius:22,padding:28,boxShadow:"0 4px 20px rgba(30,90,140,.07)",transition:"transform .2s,box-shadow .2s",cursor:"default"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 16px 40px rgba(30,90,140,.14)"}}
                onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 4px 20px rgba(30,90,140,.07)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                  <div className={`ic-box ${f.ic}`} style={{width:52,height:52,borderRadius:14}}>
                    <Icon name={f.icon} size={24} color={f.c}/>
                  </div>
                  <div style={{width:32,height:32,borderRadius:"50%",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <Icon name="arrow" size={14} color="var(--blue)"/>
                  </div>
                </div>
                <h3 style={{fontFamily:"'Sora'",fontWeight:700,fontSize:17,color:"var(--text)",marginBottom:9,lineHeight:1.3}}>{f.t}</h3>
                <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.7}}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTATO ── */}
      <section id="contato" className="section-anchor section-pad" style={{background:"#fff",padding:"88px clamp(16px,4vw,40px)"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:60}}>
            <span className="badge badge-blue" style={{marginBottom:14,fontSize:12}}>CONTACTO</span>
            <h2 style={{fontFamily:"'Sora'",fontWeight:800,fontSize:"clamp(28px,4vw,40px)",color:"var(--text)"}}>Fale connosco</h2>
            <p style={{color:"var(--muted)",fontSize:15,marginTop:12}}>Tem dúvidas sobre o sistema? Entre em contacto.</p>
          </div>
          <div className="contact-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,maxWidth:900,margin:"0 auto"}}>
            <div>
              <div style={{display:"flex",flexDirection:"column",gap:20,marginBottom:32}}>
                {[
                  {icon:"phone",label:"Telefone",val:"+244 926 586 504 / 975 360 352",ic:"ic-blue"},
                  {icon:"mail",label:"Email",val:"sipreavc@gmail.com",ic:"ic-teal"},
                  {icon:"map",label:"Localização",val:"Luanda, Angola",ic:"ic-green"},
                ].map((c,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:16}}>
                    <div className={`ic-box ${c.ic}`} style={{width:48,height:48,borderRadius:14,flexShrink:0}}>
                      <Icon name={c.icon} size={20} color={c.ic==="ic-blue"?"var(--blue)":c.ic==="ic-teal"?"var(--teal)":"var(--green)"}/>
                    </div>
                    <div>
                      <div style={{fontSize:11,color:"var(--muted)",fontWeight:700,letterSpacing:.5,marginBottom:2}}>{c.label.toUpperCase()}</div>
                      <div style={{fontSize:14,fontWeight:700,color:"var(--text)"}}>{c.val}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" style={{padding:"13px 28px",gap:10}} onClick={()=>onNavigate("login")}>
                Acessar o Sistema <Icon name="arrow" size={15} color="#fff"/>
              </button>
            </div>
            <div style={{background:"var(--bg)",borderRadius:22,padding:28}}>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div>
                  <label style={{fontSize:11,color:"var(--muted)",display:"block",marginBottom:6,fontWeight:700,letterSpacing:.5}}>NOME</label>
                  <input className="inp" placeholder="O seu nome"/>
                </div>
                <div>
                  <label style={{fontSize:11,color:"var(--muted)",display:"block",marginBottom:6,fontWeight:700,letterSpacing:.5}}>EMAIL</label>
                  <input className="inp" type="email" placeholder="email@exemplo.com"/>
                </div>
                <div>
                  <label style={{fontSize:11,color:"var(--muted)",display:"block",marginBottom:6,fontWeight:700,letterSpacing:.5}}>MENSAGEM</label>
                  <textarea className="inp" rows={4} placeholder="A sua mensagem..." style={{resize:"vertical"}}/>
                </div>
                <button className="btn btn-primary" style={{justifyContent:"center",gap:10}}>
                  Enviar Mensagem <Icon name="arrow" size={15} color="#fff"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{background:"linear-gradient(135deg,#2980b9,#27aae1)",padding:"80px 40px",textAlign:"center"}}>
        <h2 style={{fontFamily:"'Sora'",fontWeight:800,fontSize:40,color:"#fff",marginBottom:14}}>Pronto para começar?</h2>
        <p style={{color:"rgba(255,255,255,.82)",fontSize:15,marginBottom:34}}>Acesse o painel e monitorize os seus pacientes em tempo real</p>
        <button className="btn btn-white" style={{padding:"15px 40px",fontSize:16,gap:10}} onClick={()=>onNavigate("login")}>
          Acessar o Sistema <Icon name="arrow" size={16} color="var(--blue)"/>
        </button>
      </section>
    </div>
  );
};

/* ─── LOGIN ───────────────────────────────────────────────────────── */
const loginCss = `
  @keyframes heartPump {
    0%,100%{ transform:scale(1);   filter:drop-shadow(0 0 0px  rgba(231,76,60,0)) }
    15%    { transform:scale(1.26);filter:drop-shadow(0 0 22px rgba(231,76,60,.75)) }
    30%    { transform:scale(1.04);filter:drop-shadow(0 0 8px  rgba(231,76,60,.3)) }
    45%    { transform:scale(1.16);filter:drop-shadow(0 0 14px rgba(231,76,60,.55)) }
    70%    { transform:scale(1);   filter:drop-shadow(0 0 0px  rgba(231,76,60,0)) }
  }
  @keyframes ring1 { 0%,100%{transform:scale(1);  opacity:.6} 50%{transform:scale(1.25);opacity:.1} }
  @keyframes ring2 { 0%,100%{transform:scale(.8); opacity:.4} 50%{transform:scale(1.4); opacity:.05}}
  @keyframes ring3 { 0%,100%{transform:scale(.6); opacity:.25}50%{transform:scale(1.55);opacity:.03}}
  @keyframes ecgDraw { from{stroke-dashoffset:700} to{stroke-dashoffset:0} }
  @keyframes liftIn  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes tabIn   { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:translateX(0)} }
  @keyframes bgZoom  { from{transform:scale(1)} to{transform:scale(1.04)} }

  .hpump   { animation:heartPump 1.5s ease-in-out infinite; transform-origin:center; }
  .ring1   { animation:ring1 1.5s ease-in-out infinite; }
  .ring2   { animation:ring2 1.5s ease-in-out .12s infinite; }
  .ring3   { animation:ring3 1.5s ease-in-out .24s infinite; }
  .lift-in { animation:liftIn .55s cubic-bezier(.22,1,.36,1) both; }
  .tab-in  { animation:tabIn  .28s ease both; }
  .bg-zoom { animation:bgZoom 18s ease-in-out alternate infinite; }

  /* ── glassmorphism card ── */
  .lcard {
    background: rgba(255,255,255,0.14);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    border: 1.5px solid rgba(255,255,255,0.32);
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.4);
  }

  /* ── tabs inside glass card ── */
  .ltab {
    flex:1; padding:10px; border-radius:11px; border:none; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; font-size:13px;
    transition:all .25s cubic-bezier(.22,1,.36,1);
  }
  .ltab-on  {
    background: rgba(255,255,255,0.9);
    color: #1a3a52;
    box-shadow: 0 4px 14px rgba(0,0,0,.15);
  }
  .ltab-off { background:transparent; color:rgba(255,255,255,.65); }
  .ltab-off:hover { color:#fff; background:rgba(255,255,255,.12); }

  /* ── inputs ── */
  .linp {
    width:100%; padding:13px 14px 13px 44px;
    background: rgba(255,255,255,0.15);
    border: 1.5px solid rgba(255,255,255,0.28);
    border-radius:12px;
    font-family:'Plus Jakarta Sans',sans-serif;
    font-size:14px; color:#fff;
    outline:none; transition:all .22s;
    backdrop-filter:blur(6px);
  }
  .linp:focus {
    border-color: rgba(255,255,255,0.7);
    background: rgba(255,255,255,0.22);
    box-shadow: 0 0 0 3px rgba(255,255,255,0.1);
  }
  .linp::placeholder { color:rgba(255,255,255,.45); }
  .linp option { background:#1a3a52; color:#fff; }

  .lico {
    position:absolute; left:14px; top:50%; transform:translateY(-50%);
    pointer-events:none; opacity:.7;
  }

  /* ── submit btn ── */
  .lbtn {
    width:100%; padding:14px; border:none; border-radius:13px; cursor:pointer;
    font-family:'Plus Jakarta Sans',sans-serif; font-weight:800; font-size:15px;
    background: rgba(255,255,255,0.95);
    color: #1a5f8a;
    box-shadow: 0 6px 24px rgba(0,0,0,0.18), inset 0 1px 0 #fff;
    transition:all .2s;
    display:flex; align-items:center; justify-content:center; gap:8px;
  }
  .lbtn:hover { transform:translateY(-2px); box-shadow:0 10px 30px rgba(0,0,0,.25); background:#fff; }
  .lbtn:disabled { opacity:.6; transform:none; cursor:not-allowed; }

  /* ── demo btns ── */
  .ldemo {
    flex:1; padding:9px; border-radius:10px; cursor:pointer;
    border: 1.5px solid rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.1);
    color:#fff; font-weight:700; font-size:12px;
    font-family:'Plus Jakarta Sans',sans-serif;
    transition:all .2s; backdrop-filter:blur(4px);
  }
  .ldemo:hover { background:rgba(255,255,255,.22); border-color:rgba(255,255,255,.6); }

  /* ════ RESPONSIVE ════ */

  /* Navbar mobile */
  @media (max-width: 768px) {
    .nav-desktop { display:none !important; }
    .nav-mobile  { display:flex !important; }
    .hero-grid   { grid-template-columns:1fr !important; }
    .hero-right  { display:none !important; }
    .about-grid  { grid-template-columns:1fr !important; }
    .feat-grid   { grid-template-columns:1fr !important; }
    .contact-grid{ grid-template-columns:1fr !important; }
    .stats-bar > div { padding:14px 20px !important; }
    .section-pad { padding:56px 20px !important; }
    .hero-pad    { padding:48px 20px 120px !important; }
    .dash-vitals { grid-template-columns:1fr 1fr !important; }
    .dash-bottom { grid-template-columns:1fr !important; }
    .sidebar-wrap{ display:none !important; }
    .topbar-date { display:none !important; }
    .patients-grid{ grid-template-columns:1fr !important; }
    .reports-grid { grid-template-columns:1fr 1fr !important; }
    .settings-grid{ grid-template-columns:1fr !important; }
    .hist-grid    { grid-template-columns:1fr 1fr !important; }
    .summary-grid { grid-template-columns:1fr 1fr !important; }
  }

  @media (max-width: 480px) {
    .dash-vitals  { grid-template-columns:1fr !important; }
    .summary-grid { grid-template-columns:1fr 1fr !important; }
    .reports-grid { grid-template-columns:1fr !important; }
    .hist-grid    { grid-template-columns:1fr 1fr !important; }
    .hero-h1      { font-size:36px !important; }
    .hero-btns    { flex-direction:column !important; }
    .hero-btns > button { width:100% !important; justify-content:center; }
  }

  @media (min-width: 769px) {
    .nav-mobile { display:none !important; }
    .sidebar-wrap { display:flex !important; }
  }

  /* Mobile bottom nav */
  .mobile-nav {
    display:none;
    position:fixed; bottom:0; left:0; right:0; zIndex:300;
    background:rgba(255,255,255,.95);
    backdrop-filter:blur(14px);
    border-top:1px solid rgba(41,128,185,.1);
    padding:8px 0 max(8px,env(safe-area-inset-bottom));
    box-shadow:0 -4px 20px rgba(30,90,140,.08);
  }
  @media(max-width:768px) {
    .mobile-nav { display:flex !important; }
    .main-content { padding-bottom:72px !important; }
  }
  .mnav-item {
    flex:1; display:flex; flex-direction:column; align-items:center; gap:3px;
    padding:4px 8px; cursor:pointer; color:var(--muted);
    font-size:10px; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif;
    transition:color .2s;
  }
  .mnav-item.active { color:var(--blue); }
`;
const lsEl = document.createElement("style");
lsEl.textContent = loginCss;
document.head.appendChild(lsEl);

const LoginPage = ({ onLogin }) => {
  const [tab,setTab]=useState("login");
  const [form,setForm]=useState({email:"",password:"",name:"",role:"patient"});
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [bgIdx,setBgIdx]=useState(0);

  // Multiple reliable Unsplash DNA/medical science background images
  const bgImages = [
    "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=1920&q=90&fit=crop",
    "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=1920&q=90&fit=crop",
    "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1920&q=90&fit=crop",
    "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1920&q=90&fit=crop",
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=90&fit=crop",
  ];

  const submit=()=>{
    setErr("");
    if(!form.email||!form.password){setErr("Preencha todos os campos.");return;}
    setLoading(true);
    setTimeout(()=>{setLoading(false);onLogin(form.email.includes("medico")||form.email.includes("doctor")?"doctor":"patient");},1400);
  };

  return (
    <div style={{minHeight:"calc(100vh - 64px)",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 16px",overflow:"hidden"}}>

      {/* ── BACKGROUND IMAGE with multiple fallbacks ── */}
      <div style={{position:"absolute",inset:0,zIndex:0}}>
        <img
          key={bgIdx}
          src={bgImages[bgIdx]}
          alt="Medical science background"
          className="bg-zoom"
          style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}}
          onError={()=>{ if(bgIdx < bgImages.length-1) setBgIdx(i=>i+1); }}
        />
        {/* Deep blue overlay — keeps text readable over any image */}
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg, rgba(8,28,55,.80) 0%, rgba(18,55,100,.70) 40%, rgba(12,40,75,.75) 100%)"}}/>
        {/* Subtle vignette */}
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.35) 100%)"}}/>
      </div>

      {/* ── CENTERED GLASS FORM ── */}
      <div style={{width:"100%",maxWidth:440,position:"relative",zIndex:1}} className="lift-in">

        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{
            width:62,height:62,borderRadius:18,
            background:"rgba(255,255,255,.15)",
            backdropFilter:"blur(14px)",
            border:"1.5px solid rgba(255,255,255,.3)",
            display:"flex",alignItems:"center",justifyContent:"center",
            margin:"0 auto 14px",
            boxShadow:"0 8px 32px rgba(0,0,0,.25)",
          }}>
            <Icon name="brain" size={30} color="#fff"/>
          </div>
          <div style={{fontFamily:"'Sora'",fontWeight:800,fontSize:24,color:"#fff",letterSpacing:.3,lineHeight:1}}>SIPRE-AVC</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.55)",marginTop:5}}>Sistema de Monitoramento Pós-AVC</div>
        </div>

        {/* Glass card — the form */}
        <div className="lcard" style={{padding:"28px 28px 24px"}}>

          {/* Heading */}
          <h2 style={{fontFamily:"'Sora'",fontWeight:800,fontSize:21,color:"#fff",marginBottom:3,textAlign:"center"}}>
            {tab==="login"?"Bem-vindo de volta":"Crie a sua conta"}
          </h2>
          <p style={{fontSize:12,color:"rgba(255,255,255,.5)",marginBottom:22,textAlign:"center"}}>
            {tab==="login"?"Acesse o painel de monitoramento":"Registe-se no sistema SIPRE-AVC"}
          </p>

          {/* Tabs */}
          <div style={{display:"flex",gap:4,padding:4,background:"rgba(255,255,255,.07)",borderRadius:13,marginBottom:22,border:"1px solid rgba(255,255,255,.12)"}}>
            {["login","register"].map(t=>(
              <button key={t} className={`ltab ${tab===t?"ltab-on":"ltab-off"}`} onClick={()=>{setTab(t);setErr("");}}>
                {t==="login"?"Entrar":"Criar Conta"}
              </button>
            ))}
          </div>

          {/* Error */}
          {err&&(
            <div style={{background:"rgba(231,76,60,.2)",border:"1px solid rgba(231,76,60,.38)",borderRadius:10,padding:"9px 13px",marginBottom:14,fontSize:13,color:"#ffb3ae",display:"flex",alignItems:"center",gap:7}}>
              <Icon name="warn" size={13} color="#ffb3ae"/> {err}
            </div>
          )}

          {/* Fields */}
          <div key={tab} className="tab-in" style={{display:"flex",flexDirection:"column",gap:13}}>
            {tab==="register"&&(
              <>
                <div>
                  <label style={{fontSize:10,color:"rgba(255,255,255,.58)",display:"block",marginBottom:5,fontWeight:700,letterSpacing:.6}}>NOME COMPLETO</label>
                  <div style={{position:"relative"}}>
                    <span className="lico"><Icon name="doc" size={14} color="rgba(255,255,255,.7)"/></span>
                    <input className="linp" placeholder="O seu nome completo" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
                  </div>
                </div>
                <div>
                  <label style={{fontSize:10,color:"rgba(255,255,255,.58)",display:"block",marginBottom:5,fontWeight:700,letterSpacing:.6}}>TIPO DE CONTA</label>
                  <div style={{position:"relative"}}>
                    <span className="lico"><Icon name="users" size={14} color="rgba(255,255,255,.7)"/></span>
                    <select className="linp" value={form.role} onChange={e=>setForm({...form,role:e.target.value})} style={{appearance:"none"}}>
                      <option value="patient">Paciente / Familiar</option>
                      <option value="doctor">Médico / Profissional</option>
                    </select>
                  </div>
                </div>
              </>
            )}
            <div>
              <label style={{fontSize:10,color:"rgba(255,255,255,.58)",display:"block",marginBottom:5,fontWeight:700,letterSpacing:.6}}>EMAIL</label>
              <div style={{position:"relative"}}>
                <span className="lico"><Icon name="mail" size={14} color="rgba(255,255,255,.7)"/></span>
                <input className="linp" type="email" placeholder="email@exemplo.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
              </div>
            </div>
            <div>
              <label style={{fontSize:10,color:"rgba(255,255,255,.58)",display:"block",marginBottom:5,fontWeight:700,letterSpacing:.6}}>SENHA</label>
              <div style={{position:"relative"}}>
                <span className="lico"><Icon name="gear" size={14} color="rgba(255,255,255,.7)"/></span>
                <input className="linp" type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
              </div>
            </div>

            {tab==="login"&&(
              <div style={{textAlign:"right",marginTop:-6}}>
                <span style={{fontSize:12,color:"rgba(255,255,255,.55)",cursor:"pointer",fontWeight:600,transition:"color .2s"}}
                  onMouseEnter={e=>e.target.style.color="#fff"}
                  onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.55)"}>
                  Esqueceu a senha?
                </span>
              </div>
            )}

            <button className="lbtn" style={{marginTop:4}} onClick={submit} disabled={loading}>
              {loading
                ? <><span className="spinner" style={{width:16,height:16,border:"2.5px solid rgba(26,95,138,.35)",borderTopColor:"#1a5f8a",borderRadius:"50%",display:"inline-block"}}/> A entrar...</>
                : tab==="login"
                  ? <>Entrar no Sistema <Icon name="arrow" size={14} color="#1a5f8a"/></>
                  : <>Criar Conta <Icon name="arrow" size={14} color="#1a5f8a"/></>
              }
            </button>
          </div>
        </div>

        {/* Demo quick access */}
        <div style={{marginTop:14,borderRadius:14,padding:"12px 16px",background:"rgba(255,255,255,.07)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,.12)"}}>
          <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginBottom:9,fontWeight:700,letterSpacing:.8}}>ACESSO RÁPIDO — DEMO</div>
          <div style={{display:"flex",gap:8}}>
            <button className="ldemo" onClick={()=>{setForm({...form,email:"paciente@demo.com",password:"demo123"});setTimeout(submit,150);}}>
              Paciente Demo
            </button>
            <button className="ldemo" onClick={()=>onLogin("doctor")}>
              Médico Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── SIDEBAR ─────────────────────────────────────────────────────── */
const NAV_DOCTOR = [
  {icon:"hosp",  l:"Dashboard",     p:"dashboard"},
  {icon:"users", l:"Pacientes",     p:"patients"},
  {icon:"bell",  l:"Alertas",       p:"alerts"},
  {icon:"file",  l:"Relatórios",    p:"reports"},
  {icon:"gear",  l:"Configurações", p:"settings"},
];
const NAV_PATIENT = [
  {icon:"chart", l:"Dashboard",     p:"dashboard"},
  {icon:"heart", l:"Sinais Vitais", p:"vitals"},
  {icon:"bell",  l:"Alertas",       p:"alerts"},
  {icon:"gear",  l:"Configurações", p:"settings"},
];

const Sidebar=({role,active,onNav,onLogout})=>{
  const nav=role==="doctor"?NAV_DOCTOR:NAV_PATIENT;
  return(
    <div style={{width:216,background:"#fff",borderRight:"1px solid rgba(41,128,185,.08)",display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0,flexShrink:0,boxShadow:"2px 0 16px rgba(30,90,140,.05)"}}>
      <div style={{padding:"20px 18px",borderBottom:"1px solid rgba(41,128,185,.07)"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:37,height:37,borderRadius:10,background:"linear-gradient(135deg,#2980b9,#27aae1)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(39,170,225,.28)"}}>
            <Icon name="brain" size={18} color="#fff"/>
          </div>
          <div>
            <div style={{fontFamily:"'Sora'",fontWeight:800,fontSize:14,color:"var(--text)"}}>SIPRE-AVC</div>
            <div style={{fontSize:10,color:"var(--muted)"}}>{role==="doctor"?"Painel Médico":"Painel Paciente"}</div>
          </div>
        </div>
      </div>
      <div style={{padding:"10px 14px",borderBottom:"1px solid rgba(41,128,185,.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(39,174,96,.07)",border:"1px solid rgba(39,174,96,.2)",borderRadius:10,padding:"8px 12px"}}>
          <span className="sdot sdot-ok pdot"/>
          <span style={{fontSize:10,color:"#1e8449",fontWeight:700}}>AO VIVO · ESP32</span>
        </div>
      </div>
      <nav style={{flex:1,padding:"12px 8px",display:"flex",flexDirection:"column",gap:2}}>
        {nav.map(x=>(
          <div key={x.p} className={`snav ${active===x.p?"active":""}`} onClick={()=>onNav(x.p)}>
            <span className="snav-icon"><Icon name={x.icon} size={16} color={active===x.p?"var(--blue)":"var(--muted)"}/></span>
            <span>{x.l}</span>
          </div>
        ))}
      </nav>
      <div style={{padding:"12px 8px",borderTop:"1px solid rgba(41,128,185,.06)"}}>
        <div className="snav" onClick={onLogout} style={{color:"#e74c3c"}}>
          <span className="snav-icon"><Icon name="logout" size={16} color="#e74c3c"/></span>
          <span>Sair</span>
        </div>
      </div>
    </div>
  );
};

const Topbar=({role,onMenuNav})=>(
  <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(255,255,255,.92)",backdropFilter:"blur(14px)",borderBottom:"1px solid rgba(41,128,185,.08)",padding:"0 clamp(14px,3vw,28px)",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 2px 14px rgba(30,90,140,.05)"}}>
    <div className="topbar-date" style={{fontSize:12,color:"var(--muted)",fontWeight:600}}>{new Date().toLocaleDateString("pt-BR",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
    <div style={{display:"flex",alignItems:"center",gap:12}}>
      <div style={{display:"flex",alignItems:"center",gap:6,background:"rgba(39,174,96,.08)",border:"1px solid rgba(39,174,96,.2)",borderRadius:20,padding:"5px 12px"}}>
        <span className="sdot sdot-ok pdot"/>
        <span style={{fontSize:11,color:"#1e8449",fontWeight:700}}>Firebase On</span>
      </div>
      <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#2980b9,#27aae1)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 3px 10px rgba(39,170,225,.28)"}}>
        <Icon name="doc" size={16} color="#fff"/>
      </div>
    </div>
  </div>
);

/* ─── PATIENT DASHBOARD ───────────────────────────────────────────── */
const PatientDashboard=({patientsData, setPatientsData})=>{
  const p = (patientsData && patientsData.length>0) ? patientsData[0] : PATIENTS[0];
  const [metrics,setMetrics]=useState({ bpm: p?.bpm ?? 0, spo2: p?.spo2 ?? 0, temperature: p?.temp ?? 0, bp: p?.bp ?? '0/0' });
  const [history,setHistory]=useState([]);

  useEffect(()=>{
    let mounted=true;

    const fetchBoth = async ()=>{
      try{
        const mod = await import('./services');
        const svc = mod.serverlessService;

        // ESP1: cardio (bpm/spo2)
        const esp1 = await svc.getEsp1({ patientId: p.patientId });
        // ESP2: temperature
        const esp2 = await svc.getEsp2({ patientId: p.patientId });

        if(!mounted) return;

        const e1 = esp1 && esp1.entry ? esp1.entry : null;
        const e2 = esp2 && esp2.entry ? esp2.entry : null;

        // Merge metrics (prefer newest values when available)
        const newMetrics = { ...metrics };
        if(e1){ const m = e1.metrics || e1; newMetrics.bpm = m.bpm ?? newMetrics.bpm; newMetrics.spo2 = m.spo2 ?? newMetrics.spo2; newMetrics.bp = (m.systolic && m.diastolic) ? `${m.systolic}/${m.diastolic}` : newMetrics.bp; }
        if(e2){ const m = e2.metrics || e2; newMetrics.temperature = m.temperature ?? newMetrics.temperature; }
        setMetrics(newMetrics);

        // Also update centralized patientsData so Doctor tab and Patients page reflect changes
        try{
          const lastTs = (e1 && e1.ts) || (e2 && e2.ts) || Date.now();
          setPatientsData(prev => (prev||[]).map(item => {
            if(item.patientId !== p.patientId) return item;
            return {
              ...item,
              bpm: newMetrics.bpm ?? item.bpm,
              spo2: newMetrics.spo2 ?? item.spo2,
              temp: newMetrics.temperature ?? item.temp,
              bp: newMetrics.bp ?? item.bp,
              lastTs,
              lastUp: (()=>{
                const diff = Date.now() - lastTs; const s = Math.floor(diff/1000);
                if(s < 60) return `${s}s`;
                const m = Math.floor(s/60); if(m < 60) return `${m}m`; const h = Math.floor(m/60); return `${h}h`;
              })(),
            };
          }));
        }catch(err){ /* ignore */ }

        // For history, fetch recent entries (use existing history fetch)
        const hist = await svc.getEntries({ patientId: p.patientId, limit: 100 });
        if(!mounted) return;
        setHistory(hist.map(e=>({ ...(e.metrics||e), ts: e.ts })));
      }catch(err){ /* ignore */ }
    };

    // Initial fetch + polling every 500ms (reduced load)
    fetchBoth();
    const iv = setInterval(fetchBoth, 500);
    return ()=>{ mounted=false; clearInterval(iv); };
  },[]);

  const vitals=[
    {icon:"heart",label:"Frequência Cardíaca",value:Math.round(metrics.bpm),unit:"bpm",status:metrics.bpm>100?"critical":metrics.bpm>90?"warning":"normal",color:"#e74c3c",ic:"ic-red",showECG:true,sub:"Limite: 60–100 bpm"},
    {icon:"lungs",label:"Saturação SpO₂",value:Math.round(metrics.spo2),unit:"%",status:metrics.spo2<90?"critical":metrics.spo2<94?"warning":"normal",color:"#2980b9",ic:"ic-blue",sub:"Mínimo: 95%"},
    {icon:"therm",label:"Temperatura Corporal",value:metrics.temperature,unit:"°C",status:metrics.temperature>38?"critical":metrics.temperature>37.5?"warning":"normal",color:"#f39c12",ic:"ic-amber",sub:"Normal: 36.1–37.5°C"},
    {icon:"bp",label:"Pressão Arterial",value:metrics.bp,unit:"mmHg",status:"normal",color:"#8e44ad",ic:"ic-purple",sub:"Última medição"},
  ];

  return(
    <div style={{padding:"clamp(14px,3vw,26px)"}} className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:26,flexWrap:"wrap",gap:10}}>
        <div>
          <h1 style={{fontFamily:"'Sora'",fontWeight:800,fontSize:24,color:"var(--text)"}}>Olá, {p.name.split(" ")[0]}</h1>
          <p style={{color:"var(--muted)",fontSize:13,marginTop:3}}>Monitoramento ativo · Última leitura: há {p.lastUp}</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(39,174,96,.08)",border:"1px solid rgba(39,174,96,.2)",borderRadius:12,padding:"8px 16px"}}>
          <span className="sdot sdot-ok"/>
          <span style={{fontSize:13,color:"#1e8449",fontWeight:700}}>Sinais Normais</span>
        </div>
      </div>

      {/* Vitals */}
      <div className="dash-vitals" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))",gap:14,marginBottom:22}}>
        {vitals.map((v,i)=>(
          <div key={i} className="vcard" style={{borderTop:`3px solid ${v.color}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div className={`ic-box ${v.ic}`} style={{width:40,height:40,borderRadius:11}} >
                <Icon name={v.icon} size={19} color={v.color}/>
              </div>
              <span className={`badge badge-${v.status==="normal"?"ok":v.status==="warning"?"warn":"crit"}`}>
                {v.status==="normal"?"Normal":v.status==="warning"?"Atenção":"Crítico"}
              </span>
            </div>
            <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,marginBottom:4,letterSpacing:.5}}>{v.label.toUpperCase()}</div>
            <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:3}}>
              <span style={{fontFamily:"'Sora'",fontWeight:800,fontSize:36,color:v.color,lineHeight:1}}>{v.value}</span>
              <span style={{fontSize:13,color:"var(--muted)"}}>{v.unit}</span>
            </div>
            <div style={{fontSize:11,color:"#a8c8de",marginBottom:v.showECG?10:0}}>{v.sub}</div>
            {v.showECG&&<div className="ecg-wrap" style={{height:36,borderRadius:8,background:"rgba(231,76,60,.04)"}}><ECG color={v.color} h={36}/></div>}
          </div>
        ))}
      </div>

      {/* History sparkline */}
      <div className="wcard" style={{padding:18,marginTop:8}}>
        <h4 style={{margin:0,fontSize:13,color:"var(--muted)",marginBottom:8}}>Últimas leituras (BPM)</h4>
        <div style={{height:48}}>
          <Sparkline values={history.map(h=>h.bpm).filter(v=>typeof v==='number')} color="#e74c3c" h={48}/>
        </div>
        <div style={{marginTop:10,fontSize:12,color:"var(--muted)"}}>Mostrando até {history.length} leituras</div>
      </div>

      {/* Recomendações de Saúde */}
      <div className="wcard" style={{padding:22,marginTop:18}}>
        <h3 style={{fontFamily:"'Sora'",fontWeight:700,fontSize:16,color:"var(--text)",marginBottom:18,display:"flex",alignItems:"center",gap:8}}>
          <span className="ic-box ic-green" style={{width:30,height:30,borderRadius:8}}><Icon name="check" size={14} color="#27ae60"/></span>
          Dicas de Saúde Personalizadas
        </h3>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {(()=>{
            const recs = [];
            
            // Alimentação
            if(metrics.bpm > 100 || metrics.spo2 < 95) {
              recs.push({icon:'🍽️', titulo:'Reduzir Sódio', desc:'Reduza sal e alimentos processados. Máximo 5g por dia.', color:'#e74c3c', prio:'alta'});
            }
            if(metrics.temperature > 37.5) {
              recs.push({icon:'💧', titulo:'Aumentar Hidratação', desc:'Beba 2.5-3L de água diariamente para regular temperatura corporal.', color:'#3498db', prio:'alta'});
            }
            if(metrics.bpm > 95) {
              recs.push({icon:'☕', titulo:'Evitar Cafeína', desc:'Reduza café, chá e energéticos para diminuir o ritmo cardíaco.', color:'#8b4513', prio:'media'});
            }
            
            // Exercícios
            if(metrics.bpm > 70 && metrics.bpm <= 110) {
              recs.push({icon:'🚶', titulo:'Caminhada Leve', desc:'30 min em ritmo moderado, 2-3 vezes por semana.', color:'#27ae60', prio:'media'});
            }
            if(metrics.spo2 < 96) {
              recs.push({icon:'🧘', titulo:'Respiração Profunda', desc:'Exercícios diafragmáticos por 5-10 min para melhorar SpO2.', color:'#1e90ff', prio:'media'});
            }
            
            // Sono
            recs.push({icon:'😴', titulo:'Manter Rotina de Sono', desc:'Durma 7-9 horas por noite e mantenha horário regular.', color:'#4a0e4e', prio:'media'});
            
            // Monitoramento
            if(metrics.bpm > 110 || metrics.spo2 < 94) {
              recs.push({icon:'📊', titulo:'Monitorar Frequentemente', desc:'Medir sinais vitais a cada 2-3 horas se acima do normal.', color:'#ff6b6b', prio:'alta'});
            }
            
            // Geral
            if(metrics.bpm > 100) {
              recs.push({icon:'🧘‍♂️', titulo:'Gestão de Stress', desc:'Pratique meditação, yoga ou técnicas de relaxamento.', color:'#9b59b6', prio:'media'});
            }
            
            if(metrics.spo2 < 95) {
              recs.push({icon:'☀️', titulo:'Descanso Ativo', desc:'Repouso leve sem esforço intenso. Mantenha ambiente arejado.', color:'#f39c12', prio:'alta'});
            }
            
            recs.push({icon:'🚴', titulo:'Atividade Física Regular', desc:'Mantenha atividade moderada para fortalecer o sistema cardiovascular.', color:'#16a085', prio:'media'});
            
            if(recs.length === 0) {
              recs.push({icon:'✅', titulo:'Parabéns!', desc:'Seus sinais estão normais. Continue monitorando regularmente!', color:'#27ae60', prio:'normal'});
            }
            
            return recs.map((rec,i)=>(
              <div key={i} style={{
                display:"flex",
                alignItems:"flex-start",
                gap:12,
                padding:"14px 14px",
                borderBottom:i < recs.length-1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                borderLeft:`3px solid ${rec.color}`,
                background:i%2===0 ? "rgba(0,0,0,0.01)" : "transparent",
                transition:"all 0.2s"
              }} onMouseEnter={(e)=>{e.currentTarget.style.background=`${rec.color}08`;}} onMouseLeave={(e)=>{e.currentTarget.style.background=i%2===0 ? "rgba(0,0,0,0.01)" : "transparent";}}>
                <div style={{fontSize:22,flexShrink:0,marginTop:2}}>{rec.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <div style={{fontSize:13,fontWeight:700,color:rec.color}}>{rec.titulo}</div>
                    {rec.prio==='alta'&&<span style={{fontSize:9,fontWeight:700,color:'#fff',background:'#e74c3c',padding:'2px 6px',borderRadius:4}}>IMPORTANTE</span>}
                  </div>
                  <div style={{fontSize:12,color:'var(--muted)',lineHeight:1.5}}>{rec.desc}</div>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      
    </div>
  );
};

/* ─── DOCTOR DASHBOARD ────────────────────────────────────────────── */
const DoctorDashboard=({onNav, patientsData, setPatientsData})=>{
  // patientsData is provided by parent App (centralized state)
  const patientsRef = useRef(patientsData);
  useEffect(()=>{ patientsRef.current = patientsData; }, [patientsData]);

  const computeStatus = (p) => {
    if (!p) return 'desconhecido';
    if (p.bpm > 100 || (p.spo2 != null && p.spo2 < 90) || (p.temp != null && p.temp > 38)) return 'critical';
    if (p.bpm > 90 || (p.spo2 != null && p.spo2 < 94) || (p.temp != null && p.temp > 37.5)) return 'warning';
    return 'normal';
  };

  const summaryCards = [
    {l:"Total Pacientes",v:patientsData.length,icon:"users",c:"#2980b9",ic:"ic-blue"},
    {l:"Normais",v:patientsData.filter(p=>computeStatus(p)==='normal').length,icon:"check",c:"#27ae60",ic:"ic-green"},
    {l:"Em Atenção",v:patientsData.filter(p=>computeStatus(p)==='warning').length,icon:"warn",c:"#f39c12",ic:"ic-amber"},
    {l:"Estado Crítico",v:patientsData.filter(p=>computeStatus(p)==='critical').length,icon:"bell",c:"#e74c3c",ic:"ic-red"},
  ];

  // Lista de pacientes em estado crítico (usada para destaque e notificações)
  const critical = (patientsData || []).filter(p => computeStatus(p) === 'critical');

  const formatAgo = (tsMs) => {
    if (!tsMs) return '--';
    const diff = Date.now() - tsMs;
    const s = Math.floor(diff/1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s/60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m/60);
    return `${h}h`;
  };

  useEffect(()=>{
    let mounted = true;
    const fetchAll = async ()=>{
      try{
        const mod = await import('./services');
        const svc = mod.serverlessService;
        const ids = (patientsRef.current||[]).map(p=>p.patientId).join(',');
        const [esp1Res, esp2Res] = await Promise.all([svc.getEsp1({ patientIds: ids }), svc.getEsp2({ patientIds: ids })]);
        if(!mounted) return;
        const entries1 = esp1Res && esp1Res.entries ? esp1Res.entries : {};
        const entries2 = esp2Res && esp2Res.entries ? esp2Res.entries : {};
        const updated = (patientsRef.current||[]).map(p=>{
          const newP = { ...p };
          const e1 = entries1[p.patientId];
          const e2 = entries2[p.patientId];
          if (e1){ const m = e1.metrics || e1; newP.bpm = m.bpm ?? newP.bpm; newP.spo2 = m.spo2 ?? newP.spo2; newP.bp = (m.systolic && m.diastolic) ? `${m.systolic}/${m.diastolic}` : newP.bp; newP.lastTs = e1.ts; }
          if (e2){ const m = e2.metrics || e2; newP.temp = m.temperature ?? newP.temp; newP.lastTs = e2.ts; }
          newP.status = computeStatus(newP);
          newP.lastUp = newP.lastTs ? formatAgo(newP.lastTs) : newP.lastUp;
          return newP;
        });
        setPatientsData(updated);
      }catch(err){ console.warn('Erro ao buscar leituras do backend', err); }
    };
    fetchAll();
    const iv = setInterval(fetchAll, 500);
    return ()=>{ mounted=false; clearInterval(iv); };
  },[]);

  return(
    <div style={{padding:"clamp(14px,3vw,26px)"}} className="fade-in">
      <div style={{marginBottom:26}}>
        <h1 style={{fontFamily:"'Sora'",fontWeight:800,fontSize:24,color:"var(--text)"}}>Dashboard Médico</h1>
        <p style={{color:"var(--muted)",fontSize:13,marginTop:3}}>Monitoramento de {patientsData.length} pacientes activos</p>
      </div>

      <div className="summary-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:14,marginBottom:22}}>
        {summaryCards.map((s,i)=>(
          <div key={i} style={{background:"#fff",borderRadius:18,padding:"20px 22px",boxShadow:"0 4px 20px rgba(30,90,140,.08)",borderTop:`3px solid ${s.c}`}}>
            <div className={`ic-box ${s.ic}`} style={{width:40,height:40,borderRadius:11,marginBottom:12}}>
              <Icon name={s.icon} size={18} color={s.c}/>
            </div>
            <div style={{fontFamily:"'Sora'",fontWeight:800,fontSize:34,color:s.c,lineHeight:1}}>{s.v}</div>
            <div style={{fontSize:12,color:"var(--muted)",fontWeight:600,marginTop:4}}>{s.l}</div>
          </div>
        ))}
      </div>

      {critical.length>0&&(
        <div style={{background:"rgba(231,76,60,.07)",border:"1.5px solid rgba(231,76,60,.22)",borderRadius:16,padding:"14px 20px",marginBottom:18,display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:40,height:40,borderRadius:11,background:"rgba(231,76,60,.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Icon name="warn" size={18} color="#e74c3c"/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,color:"#c0392b",fontSize:14}}>{critical.length} paciente(s) em estado crítico</div>
            <div style={{fontSize:12,color:"#e74c3c",marginTop:2}}>{critical.map(p=>p.name).join(", ")} — SMS enviado automaticamente</div>
          </div>
          <button className="btn btn-red" style={{fontSize:12,padding:"8px 16px",gap:6}} onClick={()=>onNav("patients")}>
            Ver Pacientes <Icon name="arrow" size={13} color="#fff"/>
          </button>
        </div>
      )}

      <div className="wcard" style={{overflow:"hidden"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 22px",borderBottom:"1px solid rgba(41,128,185,.07)"}}>
          <h3 style={{fontFamily:"'Sora'",fontWeight:700,fontSize:17,color:"var(--text)"}}>Pacientes Monitorados</h3>
          <button className="btn btn-outline" style={{fontSize:12,padding:"7px 16px",gap:6}} onClick={()=>onNav("patients")}>
            Ver todos <Icon name="arrow" size={13} color="var(--blue)"/>
          </button>
        </div>
        <div style={{overflowX:"auto"}}>
          <table>
            <thead><tr><th>Paciente</th><th>BPM</th><th>SpO₂</th><th>Temp</th><th>Pressão</th><th>Status</th><th>Última Leitura</th></tr></thead>
            <tbody>
              {patientsData.map(p=>(
                <tr key={p.id}>
                  <td>
                    <div style={{fontWeight:700,color:"var(--text)"}}>{p.name}</div>
                    <div style={{fontSize:11,color:"var(--muted)"}}>{p.age} anos</div>
                  </td>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span className={`sdot ${p.bpm>100?"sdot-crit":p.bpm>90?"sdot-warn":"sdot-ok"}`}/>
                      <span style={{fontFamily:"monospace",fontWeight:700,color:p.bpm>100?"#e74c3c":p.bpm>90?"#f39c12":"var(--text)"}}>{p.bpm}</span>
                    </div>
                  </td>
                  <td style={{fontFamily:"monospace",fontWeight:700,color:p.spo2<90?"#e74c3c":"var(--text)"}}>{p.spo2}%</td>
                  <td style={{fontFamily:"monospace",fontWeight:700,color:p.temp>38?"#e74c3c":"var(--text)"}}>{p.temp}°C</td>
                  <td style={{fontFamily:"monospace",fontWeight:600,color:"var(--text)"}}>{p.bp}</td>
                  <td>
                    <span className={`badge badge-${p.status==="normal"?"ok":p.status==="warning"?"warn":"crit"}`}>
                      {p.status==="normal"?"Normal":p.status==="warning"?"Atenção":"Crítico"}
                    </span>
                  </td>
                  <td style={{fontSize:12,color:"var(--muted)"}}>Há {p.lastUp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ─── VITALS PAGE (Paciente - Sinais Vitais com Histórico) ────────── */
const VitalsPage=({patientsData, setPatientsData})=>{
  const p = (patientsData && patientsData.length>0) ? patientsData[0] : PATIENTS[0];
  const [period, setPeriod] = useState('daily');
  const [esp1History, setEsp1History] = useState([]);
  const [esp2History, setEsp2History] = useState([]);
  const [stats, setStats] = useState({});
  const [metrics, setMetrics] = useState({ bpm: p?.bpm ?? 0, spo2: p?.spo2 ?? 0, temperature: p?.temp ?? 0, bp: p?.bp ?? '0/0' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!p) return;
    
    let mounted = true;
    setLoading(true);
    (async () => {
      try{
        const mod = await import('./services');
        const svc = mod.serverlessService;
        
        // Buscar dados em tempo real
        const esp1 = await svc.getEsp1({ patientId: p.patientId });
        const esp2 = await svc.getEsp2({ patientId: p.patientId });
        
        if(!mounted) return;
        
        // Atualizar métricas atuais
        const e1 = esp1 && esp1.entry ? esp1.entry : null;
        const e2 = esp2 && esp2.entry ? esp2.entry : null;
        
        const newMetrics = { ...metrics };
        if(e1){ const m = e1.metrics || e1; newMetrics.bpm = m.bpm ?? newMetrics.bpm; newMetrics.spo2 = m.spo2 ?? newMetrics.spo2; newMetrics.bp = (m.systolic && m.diastolic) ? `${m.systolic}/${m.diastolic}` : newMetrics.bp; }
        if(e2){ const m = e2.metrics || e2; newMetrics.temperature = m.temperature ?? newMetrics.temperature; }
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
          esp1Data = Array.from({length: period === 'daily' ? 24 : 168}, (_, i) => ({
            ts: new Date(Date.now() - (period === 'daily' ? 24 - i : 168 - i) * 3600000).toISOString(),
            bpm: 70 + Math.floor(Math.random() * 30),
            spo2: 95 + Math.floor(Math.random() * 5),
            systolic: 120 + Math.floor(Math.random() * 20),
            diastolic: 80 + Math.floor(Math.random() * 10)
          }));
        }
        
        if (esp2Data.length === 0) {
          esp2Data = Array.from({length: period === 'daily' ? 24 : 168}, (_, i) => ({
            ts: new Date(Date.now() - (period === 'daily' ? 24 - i : 168 - i) * 3600000).toISOString(),
            temperature: 36.5 + (Math.random() - 0.5)
          }));
        }
        
        // Normalizar dados
        const processedEsp1 = (esp1Data || []).map(e=>({ 
          ts: e.ts || e.timestamp,
          bpm: e.bpm || e.heart_rate,
          spo2: e.spo2 || e.oxygen_saturation,
          systolic: e.systolic || e.sys,
          diastolic: e.diastolic || e.dia,
          bp: e.bp || (e.systolic && e.diastolic ? `${e.systolic}/${e.diastolic}` : null),
          source: 'ESP1'
        }));
        
        const processedEsp2 = (esp2Data || []).map(e=>({ 
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
        
        const avgBpm = validBpm.length > 0 ? Math.round(validBpm.reduce((a,b) => a+b) / validBpm.length) : newMetrics.bpm;
        const avgSpo2 = validSpo2.length > 0 ? Math.round(validSpo2.reduce((a,b) => a+b) / validSpo2.length) : newMetrics.spo2;
        const avgTemp = validTemp.length > 0 ? (validTemp.reduce((a,b) => a+b) / validTemp.length).toFixed(1) : newMetrics.temperature;
        const avgBp = validSys.length > 0 ? {
          sys: Math.round(validSys.reduce((a,b) => a+b.systolic, 0) / validSys.length),
          dia: Math.round(validSys.reduce((a,b) => a+b.diastolic, 0) / validSys.length)
        } : { sys: 120, dia: 80 };
        
        setStats({ 
          bpmAvg: avgBpm, 
          spo2Avg: avgSpo2, 
          tempAvg: avgTemp,
          bpAvg: `${avgBp.sys}/${avgBp.dia}`,
        });
      }catch(err){ 
        console.warn('Erro ao buscar vitals',err);
      } finally {
        setLoading(false);
      }
    })();
    return ()=>{ mounted = false; };
  }, [p, period]);

  const mergedHistory = () => {
    const merged = {};
    esp1History.forEach(e => {
      if(!merged[e.ts]) merged[e.ts] = { ts: e.ts };
      Object.assign(merged[e.ts], e);
    });
    esp2History.forEach(e => {
      if(!merged[e.ts]) merged[e.ts] = { ts: e.ts };
      Object.assign(merged[e.ts], e);
    });
    return Object.values(merged).sort((a, b) => new Date(b.ts) - new Date(a.ts));
  };

  return (
    <div style={{padding:"clamp(14px,3vw,26px)"}} className="fade-in">
      <div style={{marginBottom:26,display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontFamily:"'Sora'",fontWeight:800,fontSize:24,color:"var(--text)"}}>Sinais Vitais</h1>
          <p style={{color:"var(--muted)",fontSize:13,marginTop:3}}>
            {period === 'daily' ? 'Últimas 24 horas' : 'Últimos 7 dias'} de monitoramento
          </p>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button 
            className={`btn ${period==='daily'?"btn-primary":"btn-outline"}`}
            style={{fontSize:13,padding:"8px 16px"}}
            onClick={()=>setPeriod('daily')}
          >
            Diário
          </button>
          <button 
            className={`btn ${period==='weekly'?"btn-primary":"btn-outline"}`}
            style={{fontSize:13,padding:"8px 16px"}}
            onClick={()=>setPeriod('weekly')}
          >
            Semanal
          </button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="hist-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:14,marginBottom:24}}>
        {[
          {l:"BPM Médio",v:stats.bpmAvg,u:"bpm",c:"#e74c3c",ic:"ic-red",i:"heart"},
          {l:"SpO₂ Médio",v:stats.spo2Avg,u:"%",c:"#2980b9",ic:"ic-blue",i:"lungs"},
          {l:"Pressão Média",v:stats.bpAvg,u:"mmHg",c:"#8e44ad",ic:"ic-purple",i:"bp"},
          {l:"Temp Média",v:stats.tempAvg,u:"°C",c:"#f39c12",ic:"ic-amber",i:"therm"}
        ].map((s,i)=>(
          <div key={i} style={{background:"#fff",borderRadius:18,padding:"20px 22px",boxShadow:"0 4px 20px rgba(30,90,140,.08)",borderTop:`3px solid ${s.c}`}}>
            <div className={`ic-box ${s.ic}`} style={{width:36,height:36,borderRadius:10,marginBottom:12}}>
              <Icon name={s.i} size={16} color={s.c}/>
            </div>
            <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,marginBottom:4}}>{s.l}</div>
            <div style={{fontFamily:"'Sora'",fontWeight:800,fontSize:30,color:s.c}}>{s.v} <span style={{fontSize:13}}>{s.u}</span></div>
          </div>
        ))}
      </div>

      {/* Gráfico de BPM */}
      <div className="wcard" style={{padding:24,marginBottom:18}}>
        <h3 style={{fontFamily:"'Sora'",fontWeight:700,fontSize:16,color:"var(--text)",marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
          <span className="ic-box ic-red" style={{width:30,height:30,borderRadius:8}}><Icon name="heart" size={14} color="#e74c3c"/></span>
          Frequência Cardíaca — {period === 'daily' ? 'Últimas 24h' : 'Últimos 7 dias'}
        </h3>
        <div style={{height:100,display:"flex",alignItems:"flex-end",gap:3,padding:"0 4px"}}>
          {esp1History.length > 0 ? esp1History.slice(-(period === 'daily' ? 24 : 168)).map((h,i)=>{
            const v = h.bpm || 78;
            const maxBpm = 120;
            const pct = (v/maxBpm)*100;
            const c = v>100?"#e74c3c":v>85?"#f39c12":"#2980b9";
            return(
              <div key={i} title={`${v} bpm`} style={{flex:1,height:`${pct}%`,background:c,borderRadius:"3px 3px 0 0",opacity:.75,cursor:"pointer",transition:"opacity .2s"}} 
                onMouseEnter={e=>e.currentTarget.style.opacity="1"} 
                onMouseLeave={e=>e.currentTarget.style.opacity=".75"}/>
            );
          }) : Array.from({length:24},(_,i)=>{const v=58+Math.round(Math.random()*32);const h=(v/100)*100;const c=v>100?"#e74c3c":v>85?"#f39c12":"#2980b9";return<div key={i} title={`${i}:00 — ${v} bpm`} style={{flex:1,height:`${h}%`,background:c,borderRadius:"3px 3px 0 0",opacity:.75,cursor:"pointer",transition:"opacity .2s"}} onMouseEnter={e=>e.currentTarget.style.opacity="1"} onMouseLeave={e=>e.currentTarget.style.opacity=".75"}/>;} )}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--muted)",padding:"5px 4px 0"}}><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span></div>
      </div>

      {/* Tabela de Histórico Detalhado */}
      <div className="wcard" style={{padding:24}}>
        <h3 style={{fontFamily:"'Sora'",fontWeight:700,fontSize:16,color:"var(--text)",marginBottom:16}}>Histórico Detalhado</h3>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%"}}>
            <thead>
              <tr style={{fontSize:13,fontWeight:600,borderBottom:"2px solid rgba(41,128,185,.1)"}}>
                <th style={{textAlign:"left",padding:"10px 8px",color:"var(--muted)"}}>Hora</th>
                <th style={{textAlign:"center",padding:"10px 8px",color:"var(--muted)"}}>BPM</th>
                <th style={{textAlign:"center",padding:"10px 8px",color:"var(--muted)"}}>SpO₂</th>
                <th style={{textAlign:"center",padding:"10px 8px",color:"var(--muted)"}}>Pressão</th>
                <th style={{textAlign:"center",padding:"10px 8px",color:"var(--muted)"}}>Temperatura</th>
                <th style={{textAlign:"center",padding:"10px 8px",color:"var(--muted)"}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {mergedHistory().length > 0 ? mergedHistory().slice(0, 50).map((h, i) => {
                const status = (h.bpm > 100 || h.bpm < 50 || h.spo2 < 90) ? 'critical' : (h.bpm > 85 || h.spo2 < 95) ? 'warning' : h.temperature > 38 ? 'warning' : 'normal';
                return (
                  <tr key={i} style={{borderBottom:"1px solid rgba(41,128,185,.06)",fontSize:13}}>
                    <td style={{padding:"10px 8px",color:"var(--muted)",fontSize:12}}>{h.ts ? new Date(h.ts).toLocaleTimeString() : '-'}</td>
                    <td style={{padding:"10px 8px",textAlign:"center",fontFamily:"monospace",fontWeight:700,color:h.bpm>100?"#e74c3c":h.bpm<50?"#e74c3c":"#27ae60"}}>{h.bpm ?? '-'}</td>
                    <td style={{padding:"10px 8px",textAlign:"center",fontFamily:"monospace",fontWeight:700,color:h.spo2<90?"#e74c3c":"#27ae60"}}>{h.spo2 ? `${h.spo2}%` : '-'}</td>
                    <td style={{padding:"10px 8px",textAlign:"center",fontFamily:"monospace",fontWeight:700}}>{h.bp || (h.systolic && h.diastolic ? `${h.systolic}/${h.diastolic}` : '-')}</td>
                    <td style={{padding:"10px 8px",textAlign:"center",fontFamily:"monospace",fontWeight:700,color:h.temperature>38?"#e74c3c":"#27ae60"}}>{h.temperature ? `${h.temperature}°C` : '-'}</td>
                    <td style={{padding:"10px 8px",textAlign:"center"}}>
                      <span className={`badge badge-${status==="normal"?"ok":status==="warning"?"warn":"crit"}`}>
                        {status==="normal"?"Normal":status==="warning"?"Atenção":"Crítico"}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="6" style={{padding:20,textAlign:"center",color:"var(--muted)"}}>Nenhum dado disponível</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ─── RECOMMENDATIONS PAGE ──────────────────────────────────────────── */
const RecommendationsPage=({patientsData})=>{
  const p = (patientsData && patientsData.length>0) ? patientsData[0] : PATIENTS[0];

  // Gerar recomendações baseadas nos sinais vitais
  const generateRecommendations = () => {
    const recs = {
      alimentacao: [],
      exercicios: [],
      gerais: []
    };

    // Recomendações de Alimentação
    if(p.bpm > 100 || p.spo2 < 95) {
      recs.alimentacao.push({
        titulo: "Reduzir Sódio",
        descricao: "Seus níveis de pressão estão elevados. Reduza o consumo de sal e alimentos processados.",
        icon: "apple",
        prioridade: "alta"
      });
    }

    if(p.temp > 37.5) {
      recs.alimentacao.push({
        titulo: "Aumentar Hidratação",
        descricao: "Beba mais água para ajudar a regular a temperatura corporal. Mínimo 2 litros por dia.",
        icon: "drop",
        prioridade: "alta"
      });
    }

    recs.alimentacao.push({
      titulo: "Aumentar Fibras",
      descricao: "Consuma mais vegetais, frutas e grãos integrais. Ricos em nutrientes essenciais.",
      icon: "leaf",
      prioridade: "média"
    });

    recs.alimentacao.push({
      titulo: "Consumir Ômega-3",
      descricao: "Peixe, nozes e sementes de linhaça ajudam na saúde cardiovascular.",
      icon: "fish",
      prioridade: "média"
    });

    // Recomendações de Exercícios
    if(p.bpm > 90 || p.spo2 < 96) {
      recs.exercicios.push({
        titulo: "Caminhadas Regulares",
        descricao: "Faça caminhadas de 30 minutos, 5 vezes por semana. Melhora a circulação.",
        icon: "walk",
        prioridade: "alta",
        duracao: "30 min"
      });
    } else {
      recs.exercicios.push({
        titulo: "Atividades Moderadas",
        descricao: "Pratique yoga, pilates ou natação 3-4 vezes por semana.",
        icon: "dumbbell",
        prioridade: "média",
        duracao: "45 min"
      });
    }

    recs.exercicios.push({
      titulo: "Alongamento Diário",
      descricao: "Dedique 10 minutos por dia para alongar, reduzindo a tensão muscular.",
      icon: "stretch",
      prioridade: "média",
      duracao: "10 min"
    });

    // Recomendações Gerais
    recs.gerais.push({
      titulo: "Dormir Bem",
      descricao: "Mantenha uma rotina de sono regular. Durma 7-8 horas por noite.",
      icon: "moon",
      prioridade: "alta"
    });

    recs.gerais.push({
      titulo: "Controlar Stress",
      descricao: "Pratique meditação ou técnicas de respiração diariamente por 10-15 minutos.",
      icon: "zen",
      prioridade: "alta"
    });

    recs.gerais.push({
      titulo: "Evitar Álcool e Tabaco",
      descricao: "Estes afetam negativamente a pressão arterial e a saúde cardiovascular.",
      icon: "ban",
      prioridade: "alta"
    });

    recs.gerais.push({
      titulo: "Monitoramento Regular",
      descricao: "Verifique seus sinais vitais diariamente. Use o aplicativo para acompanhamento.",
      icon: "chart",
      prioridade: "média"
    });

    return recs;
  };

  const recomendacoes = generateRecommendations();

  const SecaoRecommendacoes = ({titulo, icone, items}) => (
    <div className="wcard" style={{padding:24,marginBottom:20}}>
      <h3 style={{fontFamily:"'Sora'",fontWeight:700,fontSize:18,color:"var(--text)",marginBottom:18,display:"flex",alignItems:"center",gap:10}}>
        <span className="ic-box" style={{width:36,height:36,borderRadius:10,background:"rgba(41,128,185,.1)"}}>
          <Icon name={icone} size={16} color="var(--blue)"/>
        </span>
        {titulo}
      </h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {items.map((item, idx) => (
          <div key={idx} style={{
            background:"#fff",
            border:"1px solid rgba(41,128,185,.1)",
            borderRadius:14,
            padding:18,
            transition:"all .3s",
            cursor:"pointer"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div style={{display:"flex",alignItems:"start",gap:12,marginBottom:12}}>
              <div style={{
                width:40,
                height:40,
                borderRadius:10,
                background: item.prioridade === 'alta' ? "rgba(231,76,60,.1)" : "rgba(41,128,185,.1)",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                flexShrink:0
              }}>
                <Icon name={item.icon} size={18} color={item.prioridade === 'alta' ? "#e74c3c" : "#2980b9"}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Sora'",fontWeight:700,fontSize:14,color:"var(--text)",marginBottom:4}}>
                  {item.titulo}
                </div>
                {item.prioridade && (
                  <span style={{
                    display:"inline-block",
                    fontSize:10,
                    fontWeight:700,
                    padding:"4px 8px",
                    borderRadius:6,
                    background: item.prioridade === 'alta' ? "rgba(231,76,60,.15)" : "rgba(243,156,18,.15)",
                    color: item.prioridade === 'alta' ? "#c0392b" : "#d68910"
                  }}>
                    {item.prioridade === 'alta' ? "🔴 Alta" : "🟡 Média"}
                  </span>
                )}
              </div>
            </div>
            <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.5,margin:0}}>
              {item.descricao}
            </p>
            {item.duracao && (
              <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid rgba(41,128,185,.1)",fontSize:12,color:"var(--muted)",fontWeight:700}}>
                ⏱️ {item.duracao}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{padding:"clamp(14px,3vw,26px)"}} className="fade-in">
      <div style={{marginBottom:26}}>
        <h1 style={{fontFamily:"'Sora'",fontWeight:800,fontSize:24,color:"var(--text)"}}>Recomendações de Saúde</h1>
        <p style={{color:"var(--muted)",fontSize:13,marginTop:3}}>
          Dicas personalizadas para melhorar seu bem-estar baseadas em seus sinais vitais
        </p>
      </div>

      {/* Card de Status */}
      <div className="wcard" style={{padding:24,marginBottom:28,background:"linear-gradient(135deg, rgba(41,128,185,.08) 0%, rgba(39,170,225,.08) 100%)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
          <div>
            <h3 style={{fontFamily:"'Sora'",fontWeight:700,fontSize:16,color:"var(--text)",marginBottom:6}}>
              ✨ Seu Status de Saúde
            </h3>
            <p style={{color:"var(--muted)",fontSize:13,margin:0}}>
              Você está em {p.bpm > 100 ? "estado de atenção" : "ótima forma"}. Siga as recomendações para manter-se saudável.
            </p>
          </div>
          <div style={{
            display:"flex",
            alignItems:"center",
            gap:12,
            background:"rgba(255,255,255,.6)",
            borderRadius:12,
            padding:"12px 16px"
          }}>
            <div style={{fontSize:32}}>
              {p.bpm > 100 ? "⚠️" : p.spo2 < 95 ? "⚠️" : "✅"}
            </div>
            <div>
              <div style={{fontSize:12,color:"var(--muted)",fontWeight:600}}>Status</div>
              <div style={{fontFamily:"'Sora'",fontWeight:800,fontSize:14,color:p.bpm > 100 ? "#e74c3c" : "#27ae60"}}>
                {p.bpm > 100 ? "Sob Atenção" : "Saudável"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recomendações */}
      <SecaoRecommendacoes 
        titulo="🍽️ Recomendações de Alimentação" 
        icone="apple"
        items={recomendacoes.alimentacao}
      />
      
      <SecaoRecommendacoes 
        titulo="🏃 Recomendações de Exercícios" 
        icone="dumbbell"
        items={recomendacoes.exercicios}
      />
      
      <SecaoRecommendacoes 
        titulo="💪 Dicas Gerais de Saúde" 
        icone="heart"
        items={recomendacoes.gerais}
      />
    </div>
  );
};

/* ─── ALERTS PAGE ─────────────────────────────────────────────────── */
const AlertsPage=()=>{
  const [filter,setFilter]=useState("all");
  const all=[...ALERTS
  ];
  const shown=filter==="all"?all:all.filter(a=>a.type===filter);
  return(
    <div style={{padding:"clamp(14px,3vw,26px)"}} className="fade-in">
      <div style={{marginBottom:26}}>
        <h1 style={{fontFamily:"'Sora'",fontWeight:800,fontSize:24,color:"var(--text)"}}>Alertas e Notificações</h1>
        <p style={{color:"var(--muted)",fontSize:13,marginTop:3}}>{all.length} alertas hoje</p>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        {[{k:"all",l:"Todos",n:all.length},{k:"critical",l:"Críticos",n:all.filter(a=>a.type==="critical").length},{k:"warning",l:"Atenção",n:all.filter(a=>a.type==="warning").length},{k:"normal",l:"Normais",n:all.filter(a=>a.type==="normal").length}].map(f=>(
          <button key={f.k} onClick={()=>setFilter(f.k)} style={{padding:"8px 16px",borderRadius:10,border:"1.5px solid",borderColor:filter===f.k?"var(--blue)":"rgba(41,128,185,.15)",background:filter===f.k?"var(--blue)":"#fff",color:filter===f.k?"#fff":"var(--muted)",cursor:"pointer",fontSize:13,fontWeight:700,fontFamily:"'Plus Jakarta Sans'",display:"flex",alignItems:"center",gap:6,transition:"all .2s",boxShadow:filter===f.k?"0 4px 14px rgba(41,128,185,.28)":"none"}}>
            {f.l}
            <span style={{background:filter===f.k?"rgba(255,255,255,.22)":"rgba(41,128,185,.08)",borderRadius:10,padding:"1px 7px",fontSize:11}}>{f.n}</span>
          </button>
        ))}
      </div>
      <div className="wcard" style={{padding:18}}>
        {shown.map(a=>(
          <div key={a.id} className={`alert-row alert-${a.type}`}>
            <div style={{width:34,height:34,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,background:a.type==="critical"?"rgba(231,76,60,.12)":a.type==="warning"?"rgba(243,156,18,.12)":"rgba(39,174,96,.12)"}}>
              <Icon name={a.type==="critical"?"warn":a.type==="warning"?"warn":"check"} size={15} color={a.type==="critical"?"#e74c3c":a.type==="warning"?"#f39c12":"#27ae60"}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:"var(--text)"}}>{a.patient}</div>
              <div style={{fontSize:12,color:"var(--muted)"}}>{a.msg}</div>
            </div>
            <div style={{fontSize:11,color:"var(--muted)",whiteSpace:"nowrap"}}>{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── PATIENTS PAGE ───────────────────────────────────────────────── */
const PatientsPage=({patientsData, setPatientsData, onSelectPatient})=>{
  const [sel,setSel]=useState(null);
  const [q,setQ]=useState("");
  const [liveMap,setLiveMap]=useState({}); // patientId -> latest metrics
  const [selHistory,setSelHistory]=useState([]);

  const shown = (patientsData || []).filter(p=>p.name.toLowerCase().includes(q.toLowerCase()));

  useEffect(()=>{
    // Derive liveMap from centralized patientsData to avoid duplicate network polling
    const map = {};
    shown.forEach(p=>{
      map[p.patientId] = { bpm: p.bpm, spo2: p.spo2, temp: p.temp, bp: p.bp, lastUp: p.lastUp };
    });
    setLiveMap(map);
  },[q, patientsData]);

  // Quando um paciente é selecionado, buscar histórico recente (últimas 100 leituras)
  useEffect(()=>{
    let mounted = true;
    if(!sel){ return; }
    (async ()=>{
      try{
        const mod = await import('./services');
        const svc = mod.serverlessService;
        const entries = await svc.getEntries({ patientId: sel.patientId, limit: 100 });
        if(!mounted) return;
        setSelHistory(entries.map(e=>({ ...(e.metrics||e), ts: e.ts })));
      }catch(err){ console.warn('Erro ao buscar histórico do paciente',err); }
    })();
    return ()=>{ mounted = false; };
  },[sel]);

  return(
    <div style={{padding:"clamp(14px,3vw,26px)"}} className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:26,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontFamily:"'Sora'",fontWeight:800,fontSize:24,color:"var(--text)"}}>Gestão de Pacientes</h1>
          <p style={{color:"var(--muted)",fontSize:13,marginTop:3}}>{PATIENTS.length} pacientes cadastrados</p>
        </div>
        <button className="btn btn-primary" style={{gap:8}}>
          <Icon name="plus" size={14} color="#fff"/> Adicionar Paciente
        </button>
      </div>
      <div style={{marginBottom:16}}><input className="inp" placeholder="Pesquisar paciente..." value={q} onChange={e=>setQ(e.target.value)} style={{maxWidth:310}}/></div>
    <div style={{display:"grid",gridTemplateColumns:sel?"1fr 1fr":"1fr",gap:18}} className="patients-grid">
        <div className="wcard" style={{overflow:"hidden"}}>
          <table>
            <thead><tr><th>Paciente</th><th>BPM</th><th>SpO₂</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {shown.map(p=>(
                <tr key={p.id} style={{cursor:"pointer"}} onClick={()=>setSel(p)}>
                  <td>
                    <div style={{fontWeight:700,color:"var(--text)"}}>{p.name}</div>
                    <div style={{fontSize:11,color:"var(--muted)"}}>{p.age} anos · {p.doctor}</div>
                  </td>
                  <td style={{fontFamily:"monospace",fontWeight:700,color:(liveMap[p.patientId]?.bpm||p.bpm)>100?"#e74c3c":"#27ae60"}}>{liveMap[p.patientId]?.bpm ?? p.bpm}</td>
                  <td style={{fontFamily:"monospace",fontWeight:700,color:(liveMap[p.patientId]?.spo2||p.spo2)<90?"#e74c3c":"#27ae60"}}>{(liveMap[p.patientId]?.spo2 ?? p.spo2)}%</td>
                  <td><span className={`badge badge-${(liveMap[p.patientId]?.status||p.status)==="normal"?"ok":(liveMap[p.patientId]?.status||p.status)==="warning"?"warn":"crit"}`}>{(liveMap[p.patientId]?.status||p.status)==="normal"?"Normal":(liveMap[p.patientId]?.status||p.status)==="warning"?"Atenção":"Crítico"}</span></td>
                  <td><button className="btn btn-outline" style={{fontSize:11,padding:"5px 12px"}} onClick={e=>{e.stopPropagation();setSel(p);}}>Detalhes</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sel&&(
          <div className="wcard slide-r" style={{padding:24}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:18}}>
              <h3 style={{fontFamily:"'Sora'",fontWeight:700,fontSize:17,color:"var(--text)"}}>{sel.name}</h3>
              <button className="btn btn-outline" style={{fontSize:12,padding:"5px 12px"}} onClick={()=>setSel(null)}>Fechar</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
              {[{l:"BPM",v:sel.bpm,c:"#e74c3c",ic:"ic-red",i:"heart"},{l:"SpO₂",v:`${sel.spo2}%`,c:"#2980b9",ic:"ic-blue",i:"lungs"},{l:"Temperatura",v:`${sel.temp}°C`,c:"#f39c12",ic:"ic-amber",i:"therm"},{l:"Pressão",v:sel.bp,c:"#8e44ad",ic:"ic-purple",i:"bp"}].map((x,i)=>(
                <div key={i} style={{background:"var(--bg)",borderRadius:12,padding:"14px",textAlign:"center"}}>
                  <div style={{width:28,height:28,borderRadius:8,margin:"0 auto 6px"}} className={`ic-box ${x.ic}`}>
                    <Icon name={x.i} size={13} color={x.c}/>
                  </div>
                  <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,marginBottom:3}}>{x.l}</div>
                  <div style={{fontFamily:"'Sora'",fontWeight:800,fontSize:22,color:x.c}}>{x.v}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:13,color:"var(--muted)",marginBottom:16}}>Médico: <strong style={{color:"var(--text)"}}>{sel.doctor}</strong></div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-primary" style={{flex:1,fontSize:12,justifyContent:"center",gap:6}} onClick={()=>{onSelectPatient && onSelectPatient(sel);}}>
                <Icon name="chart" size={13} color="#fff"/> Ver Histórico
              </button>
              <button className="btn btn-outline" style={{flex:1,fontSize:12,justifyContent:"center",gap:6}}>
                <Icon name="edit" size={13} color="var(--blue)"/> Editar
              </button>
              <button style={{padding:"8px 12px",borderRadius:10,border:"1px solid rgba(231,76,60,.25)",background:"rgba(231,76,60,.06)",color:"#c0392b",cursor:"pointer",display:"flex",alignItems:"center"}}>
                <Icon name="trash" size={15} color="#c0392b"/>
              </button>
            </div>

            {/* Histórico do paciente */}
            <div style={{marginTop:18}}>
              <h4 style={{margin:0,fontSize:13,color:"var(--muted)",marginBottom:8}}>Histórico Recente</h4>
              <div style={{height:48,marginBottom:8}}>
                <Sparkline values={selHistory.map(h=>h.bpm).filter(v=>typeof v==='number')} color="#e74c3c" h={48}/>
              </div>
              <div style={{maxHeight:220,overflowY:"auto",borderTop:"1px solid rgba(41,128,185,.06)",paddingTop:8}}>
                <table style={{width:"100%"}}>
                  <thead><tr style={{textAlign:"left",fontSize:12,color:"var(--muted)"}}><th>Hora</th><th>BPM</th><th>SpO₂</th><th>Temp</th><th>Pressão</th></tr></thead>
                  <tbody>
                    {selHistory.slice(0,50).map((h,i)=> (
                      <tr key={i} style={{fontSize:13}}>
                        <td style={{fontSize:12,color:"var(--muted)"}}>{new Date(h.ts).toLocaleTimeString()}</td>
                        <td style={{fontFamily:"monospace",fontWeight:700}}>{h.bpm ?? '-'}</td>
                        <td style={{fontFamily:"monospace",fontWeight:700}}>{h.spo2 ? `${h.spo2}%` : '-'}</td>
                        <td style={{fontFamily:"monospace",fontWeight:700}}>{h.temperature ?? '-'}</td>
                        <td style={{fontFamily:"monospace",fontWeight:700}}>{(h.systolic && h.diastolic) ? `${h.systolic}/${h.diastolic}` : (h.bp ?? '-')}</td>
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

/* ─── REPORTS PAGE ────────────────────────────────────────────────── */
const ReportsPage=({patientsData = []})=>(
  <div style={{padding:"clamp(14px,3vw,26px)"}} className="fade-in">
    <div style={{marginBottom:26}}>
      <h1 style={{fontFamily:"'Sora'",fontWeight:800,fontSize:24,color:"var(--text)"}}>Relatórios Clínicos</h1>
      <p style={{color:"var(--muted)",fontSize:13,marginTop:3}}>Análise histórica dos dados</p>
    </div>
    <div className="reports-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:16,marginBottom:26}}>
      {[{t:"Relatório Diário",d:"Resumo das últimas 24h",icon:"chart",c:"#2980b9",ic:"ic-blue"},{t:"Relatório Semanal",d:"Análise dos últimos 7 dias",icon:"trend",c:"#27ae60",ic:"ic-green"},{t:"Relatório Mensal",d:"Visão mensal de evolução",icon:"file",c:"#8e44ad",ic:"ic-purple"},{t:"Exportar PDF/Excel",d:"Download dos relatórios",icon:"save",c:"#f39c12",ic:"ic-amber"}].map((r,i)=>(
        <div key={i} style={{background:"#fff",borderRadius:20,padding:24,boxShadow:"0 4px 20px rgba(30,90,140,.08)",borderTop:`3px solid ${r.c}`,cursor:"pointer",transition:"transform .2s,box-shadow .2s"}}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 32px rgba(30,90,140,.14)"}}
          onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 4px 20px rgba(30,90,140,.08)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
            <div className={`ic-box ${r.ic}`} style={{width:50,height:50,borderRadius:14}}>
              <Icon name={r.icon} size={22} color={r.c}/>
            </div>
            <div style={{width:30,height:30,borderRadius:"50%",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon name="arrow" size={13} color="var(--blue)"/>
            </div>
          </div>
          <h3 style={{fontFamily:"'Sora'",fontWeight:700,fontSize:15,color:"var(--text)",marginBottom:5}}>{r.t}</h3>
          <p style={{fontSize:12,color:"var(--muted)"}}>{r.d}</p>
        </div>
      ))}
    </div>
    <div className="wcard" style={{padding:22}}>
      <h3 style={{fontFamily:"'Sora'",fontWeight:700,fontSize:16,color:"var(--text)",marginBottom:18}}>Evolução dos Pacientes</h3>
      <table>
        <thead><tr><th>Paciente</th><th>BPM Médio</th><th>SpO₂ Médio</th><th>Alertas (7d)</th><th>Evolução</th></tr></thead>
        <tbody>
          {(patientsData || []).map(p=>(
            <tr key={p.id}>
              <td><div style={{fontWeight:700,color:"var(--text)"}}>{p.name}</div></td>
              <td style={{fontFamily:"monospace",fontWeight:700}}>{p.bpm}</td>
              <td style={{fontFamily:"monospace",fontWeight:700}}>{p.spo2}%</td>
              <td>{p.status==="critical"?<span className="badge badge-crit">5 alertas</span>:p.status==="warning"?<span className="badge badge-warn">2 alertas</span>:<span className="badge badge-ok">0 alertas</span>}</td>
              <td style={{fontSize:13,color:"var(--muted)",fontWeight:600}}>{p.status==="normal"?"Estável":p.status==="warning"?"Em observação":"Requer atenção"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/* ─── SETTINGS PAGE ───────────────────────────────────────────────── */
const SettingsPage=({role})=>{
  const [limits,setLimits]=useState({bpmMax:100,bpmMin:50,spo2Min:90,tempMax:38});
  const [saved,setSaved]=useState(false);
  return(
    <div style={{padding:"clamp(14px,3vw,26px)",maxWidth:660}} className="fade-in">
      <div style={{marginBottom:26}}>
        <h1 style={{fontFamily:"'Sora'",fontWeight:800,fontSize:24,color:"var(--text)"}}>Configurações</h1>
        <p style={{color:"var(--muted)",fontSize:13,marginTop:3}}>Personalize os limites e preferências do sistema</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:18}}>
        <div className="wcard" style={{padding:24}}>
          <h3 style={{fontFamily:"'Sora'",fontWeight:700,fontSize:16,color:"var(--text)",marginBottom:18,display:"flex",alignItems:"center",gap:8}}>
            <span className="ic-box ic-amber" style={{width:32,height:32,borderRadius:9}}><Icon name="warn" size={15} color="#f39c12"/></span>
            Limites de Alerta Clínico
          </h3>
          <div className="settings-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {[{k:"bpmMax",l:"BPM Máximo",u:"bpm"},{k:"bpmMin",l:"BPM Mínimo",u:"bpm"},{k:"spo2Min",l:"SpO₂ Mínimo",u:"%"},{k:"tempMax",l:"Temperatura Máxima",u:"°C"}].map(f=>(
              <div key={f.k}>
                <label style={{fontSize:11,color:"var(--muted)",display:"block",marginBottom:5,fontWeight:700,letterSpacing:.5}}>{f.l.toUpperCase()}</label>
                <div style={{display:"flex",gap:8}}>
                  <input className="inp" type="number" value={limits[f.k]} onChange={e=>setLimits({...limits,[f.k]:e.target.value})}/>
                  <span style={{display:"flex",alignItems:"center",color:"var(--muted)",fontSize:12,whiteSpace:"nowrap"}}>{f.u}</span>
                </div>
              </div>
            ))}
          </div>
          {saved&&<div style={{marginTop:14,padding:"10px 14px",background:"rgba(39,174,96,.08)",border:"1px solid rgba(39,174,96,.2)",borderRadius:10,fontSize:13,color:"#1e8449",display:"flex",alignItems:"center",gap:8}}><Icon name="check" size={14} color="#1e8449"/>Limites salvos com sucesso!</div>}
          <button className="btn btn-green" style={{marginTop:16,gap:8}} onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),3000);}}>
            <Icon name="save" size={14} color="#fff"/> Salvar Limites
          </button>
        </div>
        <div className="wcard" style={{padding:24}}>
          <h3 style={{fontFamily:"'Sora'",fontWeight:700,fontSize:16,color:"var(--text)",marginBottom:18,display:"flex",alignItems:"center",gap:8}}>
            <span className="ic-box ic-blue" style={{width:32,height:32,borderRadius:9}}><Icon name="bell" size={15} color="var(--blue)"/></span>
            Notificações
          </h3>
          {[{l:"Alertas SMS automáticos",d:"Enviar SMS em situações críticas",on:true},{l:"Notificações no App",d:"Push notification no dispositivo",on:true},{l:"Relatório automático por email",d:"Resumo diário às 08:00",on:false}].map((x,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 0",borderBottom:i<2?"1px solid rgba(41,128,185,.07)":"none"}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:"var(--text)"}}>{x.l}</div>
                <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>{x.d}</div>
              </div>
              <div style={{width:46,height:26,borderRadius:13,background:x.on?"var(--blue)":"rgba(41,128,185,.12)",cursor:"pointer",position:"relative",flexShrink:0,transition:"background .2s"}}>
                <div style={{position:"absolute",top:3,width:20,height:20,borderRadius:"50%",background:"#fff",boxShadow:"0 2px 6px rgba(0,0,0,.12)",left:x.on?23:3,transition:"left .2s"}}/>
              </div>
            </div>
          ))}
        </div>
        {role==="doctor"&&(
          <div className="wcard" style={{padding:24}}>
            <h3 style={{fontFamily:"'Sora'",fontWeight:700,fontSize:16,color:"var(--text)",marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
              <span className="ic-box ic-teal" style={{width:32,height:32,borderRadius:9}}><Icon name="doc" size={15} color="var(--teal)"/></span>
              Perfil Médico
            </h3>
            <div className="settings-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {["Nome Completo","CRM","Especialidade","Telefone"].map(f=>(
                <div key={f}>
                  <label style={{fontSize:11,color:"var(--muted)",display:"block",marginBottom:5,fontWeight:700,letterSpacing:.5}}>{f.toUpperCase()}</label>
                  <input className="inp" placeholder={f}/>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{marginTop:16,gap:8}}>
              <Icon name="save" size={14} color="#fff"/> Actualizar Perfil
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── ROOT APP ────────────────────────────────────────────────────── */
export default function App() {
  const [screen,setScreen]=useState("home");
  const [role,setRole]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [navPg,setNavPg]=useState("home");
  const [patientsData, setPatientsData] = useState(PATIENTS.map(p=>({ ...p })));
  const [selectedPatient, setSelectedPatient] = useState(null);

  const login=r=>{setRole(r);setPage("dashboard");setScreen("app");};
  const logout=()=>{setRole(null);setScreen("home");setNavPg("home");};

  const homeNav=p=>{
    if(p==="login"){setScreen("login");return;}
    // If already on home, scroll to section
    if(screen==="home"){
      setNavPg(p);
      const el=document.getElementById(p);
      if(el) setTimeout(()=>el.scrollIntoView({behavior:"smooth"}),50);
    } else {
      setScreen("home");
      setNavPg(p);
      setTimeout(()=>{
        const el=document.getElementById(p);
        if(el) el.scrollIntoView({behavior:"smooth"});
      },200);
    }
  };

  // Intersection Observer to update active nav on scroll
  useEffect(()=>{
    if(screen!=="home") return;
    const sections=["home","sobre","funcionalidades","contato"];
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting) setNavPg(e.target.id);});
    },{threshold:.4});
    sections.forEach(id=>{const el=document.getElementById(id);if(el) obs.observe(el);});
    return()=>obs.disconnect();
  },[screen]);

  if(screen==="home")  return <><Navbar page={navPg} onNavigate={homeNav}/><HomePage onNavigate={homeNav}/></>;
  if(screen==="login") return <><Navbar page="login" onNavigate={homeNav}/><LoginPage onLogin={login}/></>;

  const renderPage=()=>{
    if(role==="doctor") switch(page){
      case "dashboard": return <DoctorDashboard onNav={setPage} patientsData={patientsData} setPatientsData={setPatientsData}/>;
      case "patients":  return <PatientsPage patientsData={patientsData} setPatientsData={setPatientsData} onSelectPatient={(p)=>{setSelectedPatient(p); setPage("vitals");}}/>;
      case "alerts":    return <AlertsPage/>;
      case "reports":   return <ReportsPage patientsData={patientsData} setPatientsData={setPatientsData}/>;
      case "vitals":    return <VitalsPage patientsData={patientsData} setPatientsData={setPatientsData}/>;
      case "settings":  return <SettingsPage role={role}/>;
      default:          return <DoctorDashboard onNav={setPage} patientsData={patientsData} setPatientsData={setPatientsData}/>;
    }
    switch(page){
      case "dashboard": return <PatientDashboard patientsData={patientsData} setPatientsData={setPatientsData}/>;
      case "vitals":    return <VitalsPage patientsData={patientsData} setPatientsData={setPatientsData}/>;
      case "alerts":    return <AlertsPage/>;
      case "recommendations": return <RecommendationsPage patientsData={patientsData}/>;
      case "settings":  return <SettingsPage role={role}/>;
      default:          return <PatientDashboard/>;
    }
  };

  return(
    <div style={{display:"flex",minHeight:"100vh",background:"#f3f9fd"}}>
      <div className="sidebar-wrap" style={{display:"flex"}}>
        <Sidebar role={role} active={page} onNav={setPage} onLogout={logout}/>
      </div>
      <main className="main-content" style={{flex:1,overflowY:"auto",minHeight:"100vh"}}>
        <Topbar role={role} onMenuNav={setPage}/>
        {renderPage()}
      </main>
      {/* Mobile bottom nav */}
      <div className="mobile-nav">
        {(role==="doctor"
          ?[{i:"hosp",l:"Dashboard",p:"dashboard"},{i:"users",l:"Pacientes",p:"patients"},{i:"bell",l:"Alertas",p:"alerts"},{i:"file",l:"Relatórios",p:"reports"},{i:"gear",l:"Config",p:"settings"}]
          :[{i:"chart",l:"Dashboard",p:"dashboard"},{i:"heart",l:"Sinais",p:"vitals"},{i:"lightbulb",l:"Recomendações",p:"recommendations"},{i:"bell",l:"Alertas",p:"alerts"},{i:"gear",l:"Config",p:"settings"}]
        ).map(x=>(
          <div key={x.p} className={`mnav-item ${page===x.p?"active":""}`} onClick={()=>setPage(x.p)}>
            <Icon name={x.i} size={20} color={page===x.p?"var(--blue)":"var(--muted)"}/>
            <span>{x.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
