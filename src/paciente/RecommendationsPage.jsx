import { Icon } from "../shared/components";
import { PATIENTS } from "../shared/data";

export const RecommendationsPage = ({ patientsData }) => {
  const p = (patientsData && patientsData.length > 0) ? patientsData[0] : PATIENTS[0];

  // Gerar recomendações baseadas nos sinais vitais
  const generateRecommendations = () => {
    const recs = {
      alimentacao: [],
      exercicios: [],
      gerais: []
    };

    // Recomendações de Alimentação
    if (p.bpm > 100 || p.spo2 < 95) {
      recs.alimentacao.push({
        titulo: "Reduzir Sódio",
        descricao: "Seus níveis de pressão estão elevados. Reduza o consumo de sal e alimentos processados.",
        icon: "apple",
        prioridade: "alta"
      });
    }

    if (p.temp > 37.5) {
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
    if (p.bpm > 90 || p.spo2 < 96) {
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

  const SecaoRecommendacoes = ({ titulo, icone, items }) => (
    <div className="wcard" style={{ padding: 24, marginBottom: 20 }}>
      <h3 style={{ fontFamily: "'Sora'", fontWeight: 700, fontSize: 18, color: "var(--text)", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
        <span className="ic-box" style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(41,128,185,.1)" }}>
          <Icon name={icone} size={16} color="var(--blue)" />
        </span>
        {titulo}
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {items.map((item, idx) => (
          <div key={idx} style={{
            background: "#fff",
            border: "1px solid rgba(41,128,185,.1)",
            borderRadius: 14,
            padding: 18,
            transition: "all .3s",
            cursor: "pointer"
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <div style={{ display: "flex", alignItems: "start", gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: item.prioridade === 'alta' ? "rgba(231,76,60,.1)" : "rgba(41,128,185,.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                <Icon name={item.icon} size={18} color={item.prioridade === 'alta' ? "#e74c3c" : "#2980b9"} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Sora'", fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>
                  {item.titulo}
                </div>
                {item.prioridade && (
                  <span style={{
                    display: "inline-block",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "4px 8px",
                    borderRadius: 6,
                    background: item.prioridade === 'alta' ? "rgba(231,76,60,.15)" : "rgba(243,156,18,.15)",
                    color: item.prioridade === 'alta' ? "#c0392b" : "#d68910"
                  }}>
                    {item.prioridade === 'alta' ? "🔴 Alta" : "🟡 Média"}
                  </span>
                )}
              </div>
            </div>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>
              {item.descricao}
            </p>
            {item.duracao && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(41,128,185,.1)", fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>
                ⏱️ {item.duracao}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: "clamp(14px,3vw,26px)" }} className="fade-in">
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontFamily: "'Sora'", fontWeight: 800, fontSize: 24, color: "var(--text)" }}>Recomendações de Saúde</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 3 }}>
          Dicas personalizadas para melhorar seu bem-estar baseadas em seus sinais vitais
        </p>
      </div>

      {/* Card de Status */}
      <div className="wcard" style={{ padding: 24, marginBottom: 28, background: "linear-gradient(135deg, rgba(41,128,185,.08) 0%, rgba(39,170,225,.08) 100%)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h3 style={{ fontFamily: "'Sora'", fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 6 }}>
              ✨ Seu Status de Saúde
            </h3>
            <p style={{ color: "var(--muted)", fontSize: 13, margin: 0 }}>
              Você está em {p.bpm > 100 ? "estado de atenção" : "ótima forma"}. Siga as recomendações para manter-se saudável.
            </p>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(255,255,255,.6)",
            borderRadius: 12,
            padding: "12px 16px"
          }}>
            <div style={{ fontSize: 32 }}>
              {p.bpm > 100 ? "⚠️" : p.spo2 < 95 ? "⚠️" : "✅"}
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>Status</div>
              <div style={{ fontFamily: "'Sora'", fontWeight: 800, fontSize: 14, color: p.bpm > 100 ? "#e74c3c" : "#27ae60" }}>
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
