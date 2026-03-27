import { useState } from "react";
import { Icon } from "../shared/components";
import authService from "../services/authService";

const loginAuthStyles = `
  .bg-zoom { animation: zoom 20s ease-out infinite; }
  @keyframes zoom { from { transform: scale(1); } to { transform: scale(1.05); } }

  .lift-in { animation: liftIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
  @keyframes liftIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

  .lcard {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1.5px solid rgba(255, 255, 255, 0.18);
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .ltab {
    flex: 1;
    padding: 10px 14px;
    border: none;
    border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
    color: rgba(255, 255, 255, 0.4);
    background: transparent;
    letter-spacing: 0.4px;
  }
  .ltab-on {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  .ltab-off { }
  .ltab:hover:not(.ltab-on) { color: rgba(255, 255, 255, 0.6); }

  .tab-in { animation: slideIn 0.3s ease both; }
  @keyframes slideIn { from { opacity: 0; } to { opacity: 1; } }

  .lico {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.6;
  }
  .linp {
    width: 100%;
    padding: 12px 14px 12px 38px;
    background: rgba(255, 255, 255, 0.1);
    border: 1.5px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    color: #fff;
    outline: none;
    transition: all 0.2s;
  }
  .linp::placeholder { color: rgba(255, 255, 255, 0.35); }
  .linp:focus {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08);
  }

  .lbtn {
    width: 100%;
    padding: 13px 16px;
    background: linear-gradient(135deg, #2980b9, #2470a8);
    border: none;
    border-radius: 12px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 8px 24px rgba(41, 128, 185, 0.35);
  }
  .lbtn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(41, 128, 185, 0.45);
  }
  .lbtn:disabled { opacity: 0.6; cursor: not-allowed; }

  .ldemo {
    flex: 1;
    padding: 9px 12px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    transition: all 0.2s;
  }
  .ldemo:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
  }
`;

const lsEl = document.createElement("style");
lsEl.textContent = loginAuthStyles;
document.head.appendChild(lsEl);

export const LoginPage = ({ onLogin }) => {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "", role: "patient" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [bgIdx, setBgIdx] = useState(0);

  const bgImages = [
    "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=1920&q=90&fit=crop",
    "https://images.unsplash.com/photo-1628595351029-c2bf17511435?w=1920&q=90&fit=crop",
    "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1920&q=90&fit=crop",
    "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1920&q=90&fit=crop",
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1920&q=90&fit=crop",
  ];

  const submit = async () => {
    setErr("");
    if (!form.email || !form.password) {
      setErr("Preencha todos os campos.");
      return;
    }
    
    setLoading(true);
    try {
      if (tab === "login") {
        // Login
        const result = await authService.login(form.email, form.password);
        onLogin(result.user.role);
      } else {
        // Registro
        if (!form.name) {
          setErr("Nome é obrigatório para o registo.");
          setLoading(false);
          return;
        }
        const result = await authService.register(
          form.email,
          form.password,
          form.name,
          form.role
        );
        onLogin(result.user.role);
      }
    } catch (error) {
      setErr(error.error || error.message || "Erro ao conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          key={bgIdx}
          src={bgImages[bgIdx]}
          alt="Medical science background"
          className="bg-zoom"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          onError={() => {
            if (bgIdx < bgImages.length - 1) setBgIdx(i => i + 1);
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,28,55,.80) 0%, rgba(18,55,100,.70) 40%, rgba(12,40,75,.75) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.35) 100%)" }} />
      </div>

      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }} className="lift-in">
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 62, height: 62, borderRadius: 18, background: "rgba(255,255,255,.15)", backdropFilter: "blur(14px)", border: "1.5px solid rgba(255,255,255,.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: "0 8px 32px rgba(0,0,0,.25)" }}>
            <Icon name="brain" size={30} color="#fff" />
          </div>
          <div style={{ fontFamily: "'Sora'", fontWeight: 800, fontSize: 24, color: "#fff", letterSpacing: .3, lineHeight: 1 }}>SIPRE-AVC</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", marginTop: 5 }}>Sistema de Monitoramento Pós-AVC</div>
        </div>

        <div className="lcard" style={{ padding: "28px 28px 24px" }}>
          <h2 style={{ fontFamily: "'Sora'", fontWeight: 800, fontSize: 21, color: "#fff", marginBottom: 3, textAlign: "center" }}>
            {tab === "login" ? "Bem-vindo de volta" : "Crie a sua conta"}
          </h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginBottom: 22, textAlign: "center" }}>
            {tab === "login" ? "Acesse o painel de monitoramento" : "Registe-se no sistema SIPRE-AVC"}
          </p>

          <div style={{ display: "flex", gap: 4, padding: 4, background: "rgba(255,255,255,.07)", borderRadius: 13, marginBottom: 22, border: "1px solid rgba(255,255,255,.12)" }}>
            {["login", "register"].map(t => (
              <button key={t} className={`ltab ${tab === t ? "ltab-on" : "ltab-off"}`} onClick={() => { setTab(t); setErr(""); }}>
                {t === "login" ? "Entrar" : "Criar Conta"}
              </button>
            ))}
          </div>

          {err && (
            <div style={{ background: "rgba(231,76,60,.2)", border: "1px solid rgba(231,76,60,.38)", borderRadius: 10, padding: "9px 13px", marginBottom: 14, fontSize: 13, color: "#ffb3ae", display: "flex", alignItems: "center", gap: 7 }}>
              <Icon name="warn" size={13} color="#ffb3ae" /> {err}
            </div>
          )}

          <div key={tab} className="tab-in" style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {tab === "register" && (
              <>
                <div>
                  <label style={{ fontSize: 10, color: "rgba(255,255,255,.58)", display: "block", marginBottom: 5, fontWeight: 700, letterSpacing: .6 }}>NOME COMPLETO</label>
                  <div style={{ position: "relative" }}>
                    <span className="lico"><Icon name="doc" size={14} color="rgba(255,255,255,.7)" /></span>
                    <input className="linp" placeholder="O seu nome completo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 10, color: "rgba(255,255,255,.58)", display: "block", marginBottom: 5, fontWeight: 700, letterSpacing: .6 }}>TIPO DE CONTA</label>
                  <div style={{ position: "relative" }}>
                    <span className="lico"><Icon name="users" size={14} color="rgba(255,255,255,.7)" /></span>
                    <select className="linp" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={{ appearance: "none" }}>
                      <option value="patient">Paciente / Familiar</option>
                      <option value="doctor">Médico / Profissional</option>
                    </select>
                  </div>
                </div>
              </>
            )}
            <div>
              <label style={{ fontSize: 10, color: "rgba(255,255,255,.58)", display: "block", marginBottom: 5, fontWeight: 700, letterSpacing: .6 }}>EMAIL</label>
              <div style={{ position: "relative" }}>
                <span className="lico"><Icon name="mail" size={14} color="rgba(255,255,255,.7)" /></span>
                <input className="linp" type="email" placeholder="email@exemplo.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 10, color: "rgba(255,255,255,.58)", display: "block", marginBottom: 5, fontWeight: 700, letterSpacing: .6 }}>SENHA</label>
              <div style={{ position: "relative" }}>
                <span className="lico"><Icon name="gear" size={14} color="rgba(255,255,255,.7)" /></span>
                <input className="linp" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
            </div>

            {tab === "login" && (
              <div style={{ textAlign: "right", marginTop: -6 }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,.55)", cursor: "pointer", fontWeight: 600, transition: "color .2s" }}
                  onMouseEnter={e => e.target.style.color = "#fff"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.55)"}>
                  Esqueceu a senha?
                </span>
              </div>
            )}

            <button className="lbtn" style={{ marginTop: 4 }} onClick={submit} disabled={loading}>
              {loading
                ? <><span className="spinner" style={{ width: 16, height: 16, border: "2.5px solid rgba(26,95,138,.35)", borderTopColor: "#1a5f8a", borderRadius: "50%", display: "inline-block" }} /> A entrar...</>
                : tab === "login"
                  ? <>Entrar no Sistema <Icon name="arrow" size={14} color="#1a5f8a" /></>
                  : <>Criar Conta <Icon name="arrow" size={14} color="#1a5f8a" /></>
              }
            </button>
          </div>
        </div>

        <div style={{ marginTop: 14, borderRadius: 14, padding: "12px 16px", background: "rgba(255,255,255,.07)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,.12)" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginBottom: 9, fontWeight: 700, letterSpacing: .8 }}>ACESSO RÁPIDO — DEMO</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="ldemo" onClick={() => { setForm({ ...form, email: "paciente@demo.com", password: "demo123" }); setTimeout(submit, 150); }}>
              Paciente Demo
            </button>
            <button className="ldemo" onClick={() => onLogin("doctor")}>
              Médico Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
