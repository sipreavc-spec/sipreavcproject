# 🧪 Guia de Testes - Dashboard do Paciente

## Aplicação em Execução
**URL**: http://localhost:5175
**Status**: ✅ Rodando
**Porta**: 5175

---

## 📋 Testes a Realizar

### Teste 1: Menu do Paciente
**Objetivo**: Verificar se menu foi removido corretamente

1. Abrir http://localhost:5175
2. Clicar em "Entrar"
3. Selecionar "Paciente"
4. Fazer login

**Verificações**:
- ✅ Menu inferior mostra 5 abas
- ✅ Abas são: Dashboard, Sinais (❤️), Recomendações (💡), Alertas, Config
- ✅ **NÃO** deve aparecer "Histórico"
- ✅ Ordem: Dashboard → Sinais → Recomendações → Alertas → Config

---

### Teste 2: VitalsPage - Sinais Vitais
**Objetivo**: Verificar exibição de sinais e histórico

1. Na dashboard do paciente, clicar em "Sinais" (❤️)
2. Página deve carregar com "Sinais Vitais" no topo

**Verificações Visuais**:
- ✅ Título: "Sinais Vitais"
- ✅ Subtítulo: "Últimas 24 horas de monitoramento"
- ✅ 2 Botões no topo à direita:
  - Botão "Diário" (azul, ativo por padrão)
  - Botão "Semanal" (outline)

**Verificações - Cards de Estatísticas**:
- ✅ 4 Cards em grid responsivo
  1. ❤️ BPM Médio (vermelho) - valor em bpm
  2. 🫁 SpO₂ Médio (azul) - valor em %
  3. 💧 Pressão Média (roxo) - valor em mmHg
  4. 🌡️ Temp Média (laranja) - valor em °C
- ✅ Cards têm borda colorida no topo
- ✅ Valores numéricos exibem

**Verificações - Gráfico de BPM**:
- ✅ Título: "Frequência Cardíaca — Últimas 24h"
- ✅ Gráfico com 24 barras (1 por hora)
- ✅ Barras têm cores:
  - 🔴 Vermelho se BPM > 100
  - 🟡 Laranja se BPM 85-100
  - 🔵 Azul se BPM < 85
- ✅ Interativo: Passar mouse muda opacidade
- ✅ Escala: 00:00 → 06:00 → 12:00 → 18:00 → 23:00

**Verificações - Tabela**:
- ✅ Título: "Histórico Detalhado"
- ✅ 6 Colunas:
  1. Hora (formato HH:MM:SS)
  2. BPM (valores numéricos)
  3. SpO₂ (valores com %)
  4. Pressão (formato SYS/DIA)
  5. Temperatura (valores com °C)
  6. Status (badges coloridas)
- ✅ Até 50 registros
- ✅ Scroll horizontal em mobile
- ✅ Status badges:
  - 🟢 Verde = Normal
  - 🟡 Amarelo = Atenção
  - 🔴 Vermelho = Crítico

---

### Teste 3: VitalsPage - Toggle Daily/Weekly
**Objetivo**: Verificar alternância de período

1. Em "Sinais Vitais", ver botões no topo direito
2. Por padrão, "Diário" deve estar azul (ativo)

**Ação 1: Clicar "Semanal"**
- ✅ Botão "Semanal" fica azul
- ✅ Botão "Diário" fica outline
- ✅ Subtítulo muda: "Últimas 24 horas" → "Últimos 7 dias"
- ✅ Gráfico agora tem **168 barras** (1 por hora × 7 dias)
- ✅ Cards de estatísticas atualizam (valores podem mudar)
- ✅ Tabela exibe novos dados

**Ação 2: Clicar "Diário"**
- ✅ Botão "Diário" volta a ficar azul
- ✅ Botão "Semanal" volta outline
- ✅ Subtítulo: "Últimos 7 dias" → "Últimas 24 horas"
- ✅ Gráfico volta para **24 barras**
- ✅ Cards recalculam para últimas 24h
- ✅ Tabela atualiza para dados diários

---

### Teste 4: RecommendationsPage
**Objetivo**: Verificar recomendações personalizadas

1. Na dashboard do paciente, clicar em "Recomendações" (💡)
2. Página deve carregar com "Recomendações de Saúde"

**Verificações - Header**:
- ✅ Título: "Recomendações de Saúde"
- ✅ Subtítulo: "Dicas personalizadas para melhorar seu bem-estar..."

**Verificações - Card de Status**:
- ✅ Card com fundo azul claro
- ✅ Emoji: ✅ ou ⚠️
- ✅ Status: "Saudável" ou "Sob Atenção"
- ✅ Texto explicativo

**Verificações - Seção Alimentação (🍽️)**:
- ✅ Título: "🍽️ Recomendações de Alimentação"
- ✅ Grid com 4 cards:
  1. 🍎 Reduzir Sódio
  2. 💧 Aumentar Hidratação
  3. 🌿 Aumentar Fibras
  4. 🐟 Consumir Ômega-3
- ✅ Cada card tem:
  - Ícone colorido
  - Título
  - Descrição
  - Badge de prioridade (Alta/Média)

**Verificações - Seção Exercícios (🏃)**:
- ✅ Título: "🏃 Recomendações de Exercícios"
- ✅ Grid com 2-3 cards:
  - Caminhadas Regulares (30 min)
  - Atividades Moderadas (45 min)
  - Alongamento Diário (10 min)
- ✅ Cada card mostra duração (⏱️ XX min)

**Verificações - Seção Gerais (💪)**:
- ✅ Título: "💪 Dicas Gerais de Saúde"
- ✅ Grid com 4 cards:
  1. 🌙 Dormir Bem
  2. 🧘 Controlar Stress
  3. 🚫 Evitar Álcool e Tabaco
  4. 📊 Monitoramento Regular
- ✅ Cada card tem prioridade

**Verificações - Interatividade**:
- ✅ Hover em card: Elevação (translateY)
- ✅ Cursor muda para pointer
- ✅ Transição suave

**Verificações - Prioridades**:
- ✅ Alta: 🔴 Vermelho/Cor quente
- ✅ Média: 🟡 Laranja/Cor neutra
- ✅ Texto "🔴 Alta" ou "🟡 Média" aparece em cada card

---

### Teste 5: Responsividade
**Objetivo**: Verificar funcionamento em diferentes tamanhos

#### Desktop (> 1024px)
- Abrir em navegador normal
- ✅ Sidebar esquerdo visível
- ✅ VitalsPage: Cards em 4 colunas, gráfico grande
- ✅ RecommendationsPage: 3-4 cards por linha

#### Tablet (768-1024px)
- Abrir DevTools (F12) → Device Toolbar
- Selecionar "iPad" ou similar
- ✅ VitalsPage: Cards em 2 colunas
- ✅ RecommendationsPage: 2-3 cards por linha
- ✅ Menu ainda acessível

#### Mobile (< 768px)
- Abrir DevTools → Device Toolbar → "iPhone"
- ✅ Menu inferior (mobile nav) visível
- ✅ VitalsPage: Cards em 1-2 colunas
- ✅ RecommendationsPage: 1-2 cards por linha
- ✅ Tabela com scroll horizontal
- ✅ Botões diário/semanal ainda clicáveis

---

### Teste 6: Dados
**Objetivo**: Verificar se dados estão sendo exibidos

#### Em VitalsPage:
- ✅ Cards mostram valores numéricos (não vazio)
- ✅ Gráfico tem barras coloridas
- ✅ Tabela tem pelo menos 1 registro
- ✅ Status badges aparecem com cores

#### Em RecommendationsPage:
- ✅ Todas as 4 recomendações de alimentação aparecem
- ✅ Todas as 3 recomendações de exercícios aparecem (ou 2 conforme BPM)
- ✅ Todas as 4 dicas gerais aparecem
- ✅ Se BPM alto (>100): "Reduzir Sódio" tem prioridade "Alta"
- ✅ Se Temp elevada (>37.5): "Aumentar Hidratação" aparece

---

### Teste 7: Console (DevTools)
**Objetivo**: Verificar se não há erros

1. Pressionar F12 para abrir DevTools
2. Ir para aba "Console"
3. Navegar por Sinais Vitais e Recomendações

**Verificações**:
- ✅ Nenhum erro em vermelho
- ✅ Warnings são aceitáveis (deprecations do Vite)
- ✅ Se houver fallback, deve ver: "Endpoint getHistoryEsp1 não disponível..."
- ✅ Nenhuma exceção lançada

---

### Teste 8: Transições
**Objetivo**: Verificar animações e transições

Em VitalsPage:
- ✅ Página entra com fade-in
- ✅ Cards têm sombra e border-top colorido
- ✅ Gráfico renderiza suavemente
- ✅ Hover em barra do gráfico: opacidade aumenta

Em RecommendationsPage:
- ✅ Página entra com fade-in
- ✅ Cards têm hover com elevação
- ✅ Transições são suaves (0.3s)

---

## 📝 Checklist de Testes

### Funcionalidade
- [ ] Menu tem "Sinais" em vez de "Histórico"
- [ ] Menu tem "Recomendações"
- [ ] VitalsPage carrega corretamente
- [ ] RecommendationsPage carrega corretamente
- [ ] Toggle Daily/Weekly funciona
- [ ] Dados exibem corretamente
- [ ] Status badges aparecem
- [ ] Prioridades aparecem

### Visual
- [ ] Cores corretas (vermelho/laranja/azul)
- [ ] Ícones aparecem
- [ ] Cards têm shadows
- [ ] Tabela é legível
- [ ] Gráfico renderiza bem

### Responsividade
- [ ] Desktop: Tudo visível e bem distribuído
- [ ] Tablet: Adaptável e ainda legível
- [ ] Mobile: Menu inferior, conteúdo adaptado

### Performance
- [ ] Página carrega rápido (< 2s)
- [ ] Toggle diário/semanal é suave
- [ ] Hover não causa lag
- [ ] Scroll é fluido

### Erros
- [ ] Console limpo (sem erros vermelhos)
- [ ] Nenhuma exceção JavaScript
- [ ] Fallback funciona se backend down

---

## 🐛 Possíveis Problemas e Soluções

### Problema: Botões não aparecem
**Solução**: F5 (recarregar página)

### Problema: Dados vazios
**Solução**: Esperado! Deve exibir dados simulados

### Problema: Menu com 6 abas
**Solução**: Página foi recarregada com cache antigo
- DevTools → Ctrl+Shift+Delete (limpar cache)
- Recarregar (F5)

### Problema: Gráfico não renderiza
**Solução**: Esperar 1-2 segundos
- Se persistir, abrir Console (F12) e procurar erros

### Problema: Cards vazios
**Solução**: Dados pode estar em fallback
- Verificar Console por warnings

---

## ✅ Resultado Esperado

**VitalsPage**:
```
┌─────────────────────────────────────┐
│ Sinais Vitais [Diário] [Semanal]   │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │  ❤️ 78 bpm  🫁 97%            │ │
│ │  💧 120/80  🌡️ 36.5°C         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Gráfico com 24 barras coloridas]  │
│                                     │
│ [Tabela com 6 colunas e 50 linhas] │
└─────────────────────────────────────┘
```

**RecommendationsPage**:
```
┌─────────────────────────────────────┐
│ Recomendações de Saúde              │
├─────────────────────────────────────┤
│ ✅ Seu Status: Saudável             │
├─────────────────────────────────────┤
│ 🍽️ Alimentação:                     │
│ [Card] [Card] [Card] [Card]         │
├─────────────────────────────────────┤
│ 🏃 Exercícios:                      │
│ [Card] [Card] [Card]                │
├─────────────────────────────────────┤
│ 💪 Gerais:                          │
│ [Card] [Card] [Card] [Card]         │
└─────────────────────────────────────┘
```

---

## 📞 Resumo

**Testes Principais**:
1. ✅ Menu atualizado (sem "Histórico")
2. ✅ VitalsPage funciona
3. ✅ RecommendationsPage funciona
4. ✅ Toggle Daily/Weekly funciona
5. ✅ Dados exibem
6. ✅ Responsividade OK
7. ✅ Sem erros console
8. ✅ Transições suaves

**Tempo Estimado**: 10-15 minutos

---

**Aplicação**: http://localhost:5175
**Status**: ✅ Pronta para testes
**Data**: 27 de Março de 2026
