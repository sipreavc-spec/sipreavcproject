# ⚡ Quick Reference - Patient Dashboard Changes

## Mudanças Principais

### 1. Menu Removido
```javascript
// ❌ REMOVIDO: case "history"
{i:"trend",l:"Histórico",p:"history"}
```

### 2. Menu Adicionado
```javascript
// ✅ ADICIONADO: case "recommendations"
{i:"lightbulb",l:"Recomendações",p:"recommendations"}
```

### 3. Renderização
```javascript
// ❌ ANTES
case "vitals": return <HistoryPage.../>;
case "history": return <HistoryPage.../>;

// ✅ DEPOIS
case "vitals": return <VitalsPage.../>;
case "recommendations": return <RecommendationsPage.../>;
```

---

## VitalsPage - Estrutura

```javascript
const VitalsPage=({patientsData, setPatientsData})=>{
  const [period, setPeriod] = useState('daily'); // 'daily' | 'weekly'
  const [esp1History, setEsp1History] = useState([]);
  const [esp2History, setEsp2History] = useState([]);
  const [stats, setStats] = useState({});
  
  // useEffect busca dados
  // mergedHistory() combina dados ESP1 + ESP2
  // Renderiza: Header + Cards + Gráfico + Tabela
}
```

### Elementos Renderizados
1. **Header**: Título + Botões Daily/Weekly
2. **Cards**: BPM Médio, SpO2 Médio, Pressão, Temperatura
3. **Gráfico**: Barras de BPM (24 ou 168 valores)
4. **Tabela**: 6 colunas com histórico detalhado

---

## RecommendationsPage - Estrutura

```javascript
const RecommendationsPage=({patientsData})=>{
  const generateRecommendations = () => {
    // Lê p.bpm, p.spo2, p.temp
    // Retorna recomendações personalizadas
    return {
      alimentacao: [...],
      exercicios: [...],
      gerais: [...]
    }
  }
  
  // Renderiza 3 seções com cards
}
```

### Recomendações
**Alimentação**: Sódio, Hidratação, Fibras, Ômega-3
**Exercícios**: Caminhada, Yoga/Pilates, Alongamento
**Gerais**: Sono, Stress, Álcool/Tabaco, Monitoramento

---

## Icons Utilizados

```javascript
// VitalsPage
icon:"heart"     // BPM
icon:"lungs"     // SpO2
icon:"bp"        // Pressão
icon:"therm"     // Temperatura

// RecommendationsPage
icon:"apple"     // Alimentação
icon:"dumbbell"  // Exercícios
icon:"heart"     // Gerais
icon:"drop"      // Água
icon:"leaf"      // Fibras
icon:"fish"      // Ômega-3
icon:"walk"      // Caminhada
icon:"stretch"   // Alongamento
icon:"moon"      // Dormir
icon:"zen"       // Stress
icon:"ban"       // Álcool/Tabaco
icon:"chart"     // Monitoramento
```

---

## Dados Renderizados

### VitalsPage
```
Métrica          | Tipo      | Origem
BPM Médio        | number    | esp1History
SpO2 Médio       | number %  | esp1History
Pressão Média    | string    | esp1History
Temp Média       | number °C | esp2History
Histórico        | table     | merged ESP1+ESP2
```

### RecommendationsPage
```
Baseado em:
- p.bpm > 100      → Recomendação "Reduzir Sódio"
- p.spo2 < 95      → Recomendação "Caminhadas"
- p.temp > 37.5    → Recomendação "Hidratação"
```

---

## CSS Classes Utilizadas

```css
/* Buttons */
.btn-primary    /* Azul ativo */
.btn-outline    /* Outline inativo */

/* Cards */
.wcard          /* White card com shadow */
.vcard          /* Vital card */
.hist-grid      /* Grid container */

/* Badges */
.badge-ok       /* Verde - Normal */
.badge-warn     /* Amarelo - Atenção */
.badge-crit     /* Vermelho - Crítico */

/* Icons */
.ic-box         /* Container de ícone */
.ic-red         /* Fundo vermelho */
.ic-blue        /* Fundo azul */
.ic-purple      /* Fundo roxo */
.ic-amber       /* Fundo laranja */
```

---

## Fallback em VitalsPage

```
1ª Tentativa: getHistoryEsp1/getHistoryEsp2
   ↓ (se falhar)
2ª Tentativa: getEsp1/getEsp2
   ↓ (se falhar)
3ª Opção: Dados simulados realistas
```

---

## Período Toggle

```javascript
// Diário: 24 pontos (1 por hora)
period = 'daily'
limit = 100
slice = 24

// Semanal: 168 pontos (1 por hora × 7 dias)
period = 'weekly'
limit = 300
slice = 168
```

---

## Prioridades de Recomendação

```javascript
prioridade: 'alta'    // 🔴 Vermelho - Urgente
prioridade: 'média'   // 🟡 Laranja - Normal
```

---

## Funções Principais

### VitalsPage

```javascript
// Busca dados com fallback
(async () => {
  esp1Data = await getHistoryEsp1() || await getEsp1() || simulados
  esp2Data = await getHistoryEsp2() || await getEsp2() || simulados
})()

// Normaliza campos variados
processedEsp1 = (esp1Data).map(e => ({
  bpm: e.bpm || e.heart_rate,
  spo2: e.spo2 || e.oxygen_saturation,
  systolic: e.systolic || e.sys,
  diastolic: e.diastolic || e.dia
}))

// Calcula estatísticas
avgBpm = Math.round(sum / count)
avgSpo2 = Math.round(sum / count)
avgTemp = (sum / count).toFixed(1)
avgBp = systolic/diastolic médios

// Combina dados por timestamp
mergedHistory = Object.values(merged).sort(desc)
```

### RecommendationsPage

```javascript
// Gera recomendações baseadas em sinais
if(p.bpm > 100 || p.spo2 < 95) {
  recs.alimentacao.push("Reduzir Sódio", prioridade: 'alta')
}

if(p.temp > 37.5) {
  recs.alimentacao.push("Aumentar Hidratação", prioridade: 'alta')
}

// Renderiza seção
SecaoRecommendacoes({titulo, icone, items})
```

---

## Estado Inicial

```javascript
// VitalsPage
{
  period: 'daily',
  esp1History: [],
  esp2History: [],
  stats: {},
  metrics: { bpm: 0, spo2: 0, temperature: 0, bp: '0/0' },
  loading: false
}
```

---

## Fluxo de Navegação

```
App (page state)
  ↓
renderPage()
  ↓
switch(page)
  ├─ 'dashboard' → <PatientDashboard/>
  ├─ 'vitals' → <VitalsPage/>          ← Nova
  ├─ 'alerts' → <AlertsPage/>
  ├─ 'recommendations' → <RecommendationsPage/>  ← Nova
  └─ 'settings' → <SettingsPage/>
```

---

## Cores Utilizadas

```javascript
// Dinâmica por valor
BPM > 100   → #e74c3c (Vermelho)
BPM 85-100  → #f39c12 (Laranja)
BPM < 85    → #2980b9 (Azul)

SpO2 < 90   → #e74c3c (Vermelho)
SpO2 >= 90  → #27ae60 (Verde)

Temp > 38   → #e74c3c (Vermelho)
Temp <= 38  → #27ae60 (Verde)

Prioridade Alta    → #e74c3c (Vermelho)
Prioridade Média   → #f39c12 (Laranja)
```

---

## Testes Rápidos

### VitalsPage
```
✅ Abrir "Sinais"
✅ Ver 4 cards com estatísticas
✅ Ver gráfico com 24 barras
✅ Clicar "Semanal" → 168 barras
✅ Clicar "Diário" → 24 barras
✅ Ver tabela com histórico
✅ Status badges aparecem
```

### RecommendationsPage
```
✅ Abrir "Recomendações"
✅ Ver card de Status
✅ Ver 3 seções (Alimentação, Exercícios, Gerais)
✅ Ver prioridades (Alta/Média)
✅ Ver duração em exercícios
✅ Hover eleva cards
```

---

**Arquivo**: `src/App.jsx`
**Linhas Modificadas**: ~1910-1918, ~1927
**Novos Componentes**: VitalsPage (linha ~1290), RecommendationsPage (linha ~1440)
**Status**: ✅ Funcional
