import { useState, useEffect, useRef } from "react";
import { GLOBAL_STYLES } from "./shared/styles";
import { Icon, ECG, Sparkline } from "./shared/components";
import { PATIENTS, ALERTS } from "./shared/data";
import { LoginPage } from "./auth/LoginPage";
import { Sidebar, Topbar, NAV_DOCTOR, NAV_PATIENT } from "./Doutor/Navigation";
import authService from "./services/authService";
// Doutor components
import { DoctorDashboard, PatientsPage, AlertsPage, ReportsPage, SettingsPage as DoctorSettings } from "./Doutor";
// Paciente components
import { PatientDashboard, VitalsPage, RecommendationsPage, SettingsPage as PatientSettings } from "./paciente";

/* ─── VIEWPORT META (ensures proper mobile scaling) ───────────────── */
(()=>{
  if(!document.querySelector('meta[name="viewport"]')){
    const m=document.createElement("meta");
    m.name="viewport"; m.content="width=device-width,initial-scale=1,maximum-scale=1";
    document.head.appendChild(m);
  }
})();

/* ─── GLOBAL STYLES ───────────────────────────────────────────────── */
const css = GLOBAL_STYLES; /* Importado de shared/styles.js */

const styleEl = document.createElement("style");
styleEl.textContent = css;
document.head.appendChild(styleEl);

/* ─── NAVBAR (Home) ─────────────────────────────────────────────────*/
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

/* ─── HOME PAGE SECTIONS ──────────────────────────────────────────── */
const HeroBg = () => {
  const [imgSrc, setImgSrc] = useState("https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1800&q=85&fit=crop&crop=right");
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
      <img src={imgSrc} alt="Paciente pós-AVC recuperando com esperança e cuidado familiar" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"60% center"}} onError={handleError}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(95deg, rgba(234,244,251,1) 0%, rgba(220,238,250,0.97) 30%, rgba(200,228,245,0.82) 52%, rgba(174,214,241,0.40) 72%, rgba(133,193,233,0.10) 100%)"}}/>
      <div style={{position:"absolute",top:0,left:0,right:0,height:80,background:"linear-gradient(to bottom,rgba(234,244,251,.6),transparent)"}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:130,background:"linear-gradient(to top,rgba(214,234,248,.98),rgba(214,234,248,.6),transparent)"}}/>
    </div>
  );
};

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
      <section id="home" className="section-anchor" style={{minHeight:"calc(100vh - 64px)",position:"relative",overflow:"hidden",padding:"clamp(40px,6vw,64px) clamp(16px,4vw,40px) 130px",display:"flex",alignItems:"center"}}>
        <HeroBg/>
        <div style={{maxWidth:1200,margin:"0 auto",width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"clamp(24px,5vw,60px)",alignItems:"center",position:"relative",zIndex:1}} className="hero-grid">
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
          <div className="hero-right" style={{position:"relative",height:490,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div className="glass" style={{position:"relative",width:280,padding:22,zIndex:3}}>
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
              <div key={i} style={{background:"#fff",borderRadius:22,padding:28,boxShadow:"0 4px 20px rgba(30,90,140,.07)",transition:"transform .2s,box-shadow .2s",cursor:"default"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 16px 40px rgba(30,90,140,.14)"}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 4px 20px rgba(30,90,140,.07)"}}>
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

/* ─── ROOT APP ────────────────────────────────────────────────────── */
export default function App() {
  const [screen,setScreen]=useState("home");
  const [role,setRole]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [navPg,setNavPg]=useState("home");
  const [patientsData, setPatientsData] = useState(PATIENTS.map(p=>({ ...p })));
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize authentication state from localStorage on app mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user has stored authentication token
        const storedUser = authService.getStoredUser();
        const token = localStorage.getItem("sipre_token");

        if (token && storedUser) {
          // User is already authenticated, restore session
          setAuthenticatedUser(storedUser);
          setRole(storedUser.role);
          setScreen("app");

          // Fetch fresh user data from server to verify token is still valid
          try {
            const userData = await authService.getMe();
            setAuthenticatedUser(userData);
            setRole(userData.role);
          } catch (error) {
            console.warn("Token validation failed, clearing session:", error);
            authService.logout();
            setAuthenticatedUser(null);
            setRole(null);
            setScreen("home");
          }

          // Fetch patients if user is a doctor
          if (storedUser.role === "doctor") {
            try {
              const patients = await authService.getPatients();
              setPatientsData(patients || PATIENTS.map(p=>({ ...p })));
            } catch (error) {
              console.warn("Failed to fetch patients:", error);
              // Keep using default patients data as fallback
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Silent fail - user will see login screen
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login=r=>{
    const user = authService.getStoredUser();
    setAuthenticatedUser(user);
    setRole(user?.role || r);
    setPage("dashboard");
    setScreen("app");
  };

  const logout=()=>{authService.logout();setAuthenticatedUser(null);setRole(null);setScreen("home");setNavPg("home");};

  const homeNav=p=>{
    if(p==="login"){setScreen("login");return;}
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
    const currentPatient = (patientsData && patientsData.length > 0) ? patientsData[0] : null;
    if(role==="doctor") switch(page){
      case "dashboard": return <DoctorDashboard onNav={setPage} patientsData={patientsData} setPatientsData={setPatientsData}/>;
      case "patients":  return <PatientsPage patientsData={patientsData} setPatientsData={setPatientsData} onSelectPatient={(p)=>{setSelectedPatient(p); setPage("vitals");}}/>;
      case "alerts":    return <AlertsPage patientName={selectedPatient?.name || patientsData[0]?.name}/>;
      case "reports":   return <ReportsPage patientsData={patientsData} setPatientsData={setPatientsData}/>;
      case "vitals":    return <VitalsPage patientsData={patientsData} setPatientsData={setPatientsData}/>;
      case "settings":  return <DoctorSettings role={role}/>;
      default:          return <DoctorDashboard onNav={setPage} patientsData={patientsData} setPatientsData={setPatientsData}/>;
    }
    if(role==="patient") switch(page){
      case "dashboard": return <PatientDashboard patientsData={patientsData} setPatientsData={setPatientsData}/>;
      case "vitals":    return <VitalsPage patientsData={patientsData} setPatientsData={setPatientsData}/>;
      case "recommendations": return <RecommendationsPage patientsData={patientsData}/>;
      case "settings":  return <PatientSettings role={role}/>;
      default:          return <PatientDashboard patientsData={patientsData} setPatientsData={setPatientsData}/>;
    }
    return <DoctorDashboard onNav={setPage} patientsData={patientsData} setPatientsData={setPatientsData}/>;
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
