export const GLOBAL_STYLES = `
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

  .sdot { width:9px; height:9px; border-radius:50%; display:inline-block; flex-shrink:0; }
  .sdot-ok   { background:#27ae60; }
  .sdot-warn { background:#f39c12; }
  .sdot-crit { background:#e74c3c; animation:shimmer 1.2s ease-in-out infinite; }

  .section-anchor { scroll-margin-top:72px; }
`;
