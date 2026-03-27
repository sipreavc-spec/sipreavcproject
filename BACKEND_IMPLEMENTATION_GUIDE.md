# Guia de Implementação Backend - Endpoints ESP1/ESP2 History

## Objetivo
Implementar endpoints no backend para retornar histórico de dados dos sensores ESP1 e ESP2 com suporte a filtro de período (daily/weekly).

## Endpoints Necessários

### 1. GET /vitals/esp1/history
Retorna histórico de dados cardio do sensor ESP1

**URL**: `GET https://backsipreavc.vercel.app/api/vitals/esp1/history`

**Query Parameters**:
- `patientId` (required): String ou Number - ID do paciente
- `period` (optional): 'daily' ou 'weekly' - Padrão: 'daily'
- `limit` (optional): Number - Máximo de registros - Padrão: 100

**Resposta Esperada** (200 OK):
```json
[
  {
    "ts": "2024-01-15T10:30:00Z",
    "bpm": 78,
    "spo2": 97,
    "systolic": 120,
    "diastolic": 80
  },
  {
    "ts": "2024-01-15T10:00:00Z",
    "bpm": 75,
    "spo2": 98,
    "systolic": 118,
    "diastolic": 79
  }
]
```

**Alternativas de Nomes de Campo** (para compatibilidade):
```json
{
  "ts" ou "timestamp": "ISO string",
  "bpm" ou "heart_rate": number,
  "spo2" ou "oxygen_saturation": number (0-100),
  "systolic" ou "sys": number (mmHg),
  "diastolic" ou "dia": number (mmHg)
}
```

---

### 2. GET /vitals/esp2/history
Retorna histórico de dados de temperatura do sensor ESP2

**URL**: `GET https://backsipreavc.vercel.app/api/vitals/esp2/history`

**Query Parameters**:
- `patientId` (required): String ou Number - ID do paciente
- `period` (optional): 'daily' ou 'weekly' - Padrão: 'daily'
- `limit` (optional): Number - Máximo de registros - Padrão: 100

**Resposta Esperada** (200 OK):
```json
[
  {
    "ts": "2024-01-15T10:30:00Z",
    "temperature": 36.5
  },
  {
    "ts": "2024-01-15T10:00:00Z",
    "temperature": 36.4
  }
]
```

**Alternativas de Nomes de Campo** (para compatibilidade):
```json
{
  "ts" ou "timestamp": "ISO string",
  "temperature" ou "temp": number (Celsius)
}
```

---

## Implementação Backend (Node.js/Express)

### Passo 1: Adicionar Rotas

**Arquivo: `backend/src/routes/vitals.js`**

```javascript
const express = require('express');
const router = express.Router();
const db = require('../database'); // Seu módulo de DB

// GET /api/vitals/esp1/history
router.get('/esp1/history', async (req, res) => {
  try {
    const { patientId, period = 'daily', limit = 100 } = req.query;
    
    if (!patientId) {
      return res.status(400).json({ error: 'patientId é obrigatório' });
    }
    
    // Calcular período
    let dateFilter = new Date();
    if (period === 'weekly') {
      dateFilter.setDate(dateFilter.getDate() - 7);
    } else {
      dateFilter.setDate(dateFilter.getDate() - 1);
    }
    
    // Buscar dados do banco
    const data = await db.query(
      `SELECT ts, bpm, spo2, systolic, diastolic 
       FROM esp1_data 
       WHERE patientId = ? AND ts >= ? 
       ORDER BY ts DESC 
       LIMIT ?`,
      [patientId, dateFilter.toISOString(), parseInt(limit)]
    );
    
    // Ordenar por timestamp (mais antigo primeiro)
    data.reverse();
    
    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar ESP1 history:', error);
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

// GET /api/vitals/esp2/history
router.get('/esp2/history', async (req, res) => {
  try {
    const { patientId, period = 'daily', limit = 100 } = req.query;
    
    if (!patientId) {
      return res.status(400).json({ error: 'patientId é obrigatório' });
    }
    
    // Calcular período
    let dateFilter = new Date();
    if (period === 'weekly') {
      dateFilter.setDate(dateFilter.getDate() - 7);
    } else {
      dateFilter.setDate(dateFilter.getDate() - 1);
    }
    
    // Buscar dados do banco
    const data = await db.query(
      `SELECT ts, temperature 
       FROM esp2_data 
       WHERE patientId = ? AND ts >= ? 
       ORDER BY ts DESC 
       LIMIT ?`,
      [patientId, dateFilter.toISOString(), parseInt(limit)]
    );
    
    // Ordenar por timestamp (mais antigo primeiro)
    data.reverse();
    
    res.json(data);
  } catch (error) {
    console.error('Erro ao buscar ESP2 history:', error);
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

module.exports = router;
```

### Passo 2: Registrar Rotas no App Principal

**Arquivo: `backend/src/index.js`**

```javascript
const express = require('express');
const vitalsRouter = require('./routes/vitals');

const app = express();

// ... middleware existing ...

// Registrar rotas de vitals
app.use('/api/vitals', vitalsRouter);

// ... resto do código ...
```

### Passo 3: Verificar Schema do Banco

Garanta que as tabelas existem:

```sql
-- Tabela ESP1 (Dados Cardio)
CREATE TABLE IF NOT EXISTS esp1_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patientId INT NOT NULL,
  ts DATETIME NOT NULL,
  bpm INT,
  spo2 INT,
  systolic INT,
  diastolic INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_patient_ts (patientId, ts DESC)
);

-- Tabela ESP2 (Temperatura)
CREATE TABLE IF NOT EXISTS esp2_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patientId INT NOT NULL,
  ts DATETIME NOT NULL,
  temperature DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_patient_ts (patientId, ts DESC)
);
```

---

## Alternativa: Usar Dados Existentes se Não Houver Tabela Separada

Se os dados estão em uma única tabela:

```javascript
// Modificar a query para filtrar por sensor_type ou similar
router.get('/esp1/history', async (req, res) => {
  const data = await db.query(
    `SELECT ts, bpm, spo2, systolic, diastolic 
     FROM vital_readings 
     WHERE patientId = ? 
     AND sensor_type = 'ESP1' 
     AND ts >= ? 
     ORDER BY ts DESC 
     LIMIT ?`,
    [patientId, dateFilter, limit]
  );
  res.json(data);
});
```

---

## Teste da Implementação

### 1. Teste Local (Postman/Insomnia)

**Request 1 - ESP1 Diário**:
```
GET http://localhost:3000/api/vitals/esp1/history?patientId=1&period=daily&limit=24
```

**Expected Response**:
```json
[
  {
    "ts": "2024-01-15T00:00:00Z",
    "bpm": 72,
    "spo2": 98,
    "systolic": 120,
    "diastolic": 80
  }
]
```

**Request 2 - ESP2 Semanal**:
```
GET http://localhost:3000/api/vitals/esp2/history?patientId=1&period=weekly&limit=168
```

### 2. Teste no Frontend

Após implementar backend:

```javascript
// Abrir DevTools (F12)
// Network tab
// Ir para HistoryPage
// Selecionar um paciente
// Clicar "Diário"

// Deve aparecer requisição para:
// GET https://backsipreavc.vercel.app/api/vitals/esp1/history?patientId=1&period=daily
// GET https://backsipreavc.vercel.app/api/vitals/esp2/history?patientId=1&period=daily

// Status: 200 OK
// Response: Array com dados
```

---

## Tratamento de Erros

### Códigos HTTP Esperados

| Status | Significado | Exemplo |
|--------|------------|---------|
| 200 | Sucesso | Dados retornados |
| 400 | Requisição inválida | patientId ausente |
| 404 | Recurso não encontrado | Paciente sem dados |
| 500 | Erro do servidor | Falha na conexão com BD |

### Frontend Tratará Automaticamente

Se status !== 200:
```javascript
// Console log:
// ⚠️ "Endpoint getHistoryEsp1 não disponível, tentando getEsp1"
// E usará dados simulados como fallback
```

---

## Otimizações Recomendadas

### 1. Adicionar Cache
```javascript
const redis = require('redis');
const client = redis.createClient();

router.get('/esp1/history', async (req, res) => {
  const cacheKey = `esp1_${patientId}_${period}`;
  
  // Verificar cache
  const cached = await client.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));
  
  // Se não em cache, buscar e guardar
  const data = await db.query(...);
  await client.setex(cacheKey, 3600, JSON.stringify(data)); // 1 hora
  
  res.json(data);
});
```

### 2. Adicionar Aggregation (Média Horária para Weekly)
```javascript
if (period === 'weekly') {
  // Agregar dados em média horária
  const aggregated = aggregateByHour(data);
  return res.json(aggregated);
}
```

### 3. Adicionar Paginação
```javascript
const page = req.query.page || 1;
const pageSize = 50;
const offset = (page - 1) * pageSize;

const data = await db.query(
  `SELECT * FROM esp1_data 
   WHERE patientId = ? 
   LIMIT ? OFFSET ?`,
  [patientId, pageSize, offset]
);

res.json({
  data,
  page,
  total: await getTotalCount(patientId)
});
```

---

## Verificação Pós-Implementação

Checklist:

- [ ] Endpoints criados em `backend/src/routes/vitals.js`
- [ ] Rotas registradas em `backend/src/index.js`
- [ ] Tabelas de BD criadas ou verificadas
- [ ] Testes em Postman passando
- [ ] Frontend carregando dados reais (DevTools → Network)
- [ ] Botões diário/semanal alternando dados corretamente
- [ ] Console sem erros
- [ ] Dados exibidos em gráfico e tabela
- [ ] Fallback removido (dados simulados não aparecem)

---

## Rollback se Necessário

Se algo der errado, o frontend **não quebra**:
1. Frontend detecta erro (status !== 200)
2. Console loga warning
3. Usa dados simulados como fallback
4. UX continua funcionando

---

## Conclusão

Com esses endpoints implementados:
✅ Frontend receberá dados reais
✅ Gráficos e tabelas preencherão corretamente
✅ Toggle diário/semanal funcionará com dados reais
✅ Sem mais necessidade de dados simulados
✅ Pronto para produção

**Tempo Estimado**: 30-60 minutos para implementação simples
**Complexidade**: Baixa-Média (queries SQL básicas)

