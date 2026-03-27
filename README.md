# SIPRE-AVC — Frontend React + Vite

Dashboard web para o sistema de monitoramento pós-AVC.

## 📦 Instalação

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
# (o ficheiro .env já está incluído com valores padrão)
# Edite se o seu backend estiver noutro endereço:
# VITE_API_URL=http://SEU_IP:3001/api

# 3. Iniciar em modo desenvolvimento
npm run dev
# → http://localhost:5173

# 4. Build para produção
npm run build
```

## 🗂️ Estrutura

```
sipre-avc-frontend/
├── index.html
├── vite.config.js
├── package.json
├── .env
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx              ← Entrada React
    ├── App.jsx               ← App principal (todas as páginas)
    ├── context/
    │   └── AuthContext.jsx   ← Estado de autenticação global
    ├── hooks/
    │   ├── useSocket.js      ← Socket.IO tempo real
    │   └── useVitals.js      ← Dados combinados REST + Socket
    └── services/
        ├── api.js            ← Axios base client + interceptores
        ├── authService.js    ← Login / Registo / Sessão
        └── index.js          ← vitals, patients, alerts, reports
```

## 🔑 Contas de demonstração

| Email               | Senha   | Tipo    |
|---------------------|---------|---------|
| medico@demo.com     | demo123 | Médico  |
| paciente@demo.com   | demo123 | Paciente|

> **Nota:** O backend deve estar a correr em `http://localhost:3001`  
> Execute `npm run seed` no backend para criar os dados de demonstração.

## 🔌 Requisitos

- Node.js 18+
- Backend sipre-avc-backend a correr
- MongoDB activo
## 🛰️ Endpoints para ESPs (serverless)

O repositório inclui uma função serverless em `api/vitals` que aceita leituras enviadas pelos ESPs.

- POST `/api/vitals` — Recebe JSON com o `patientId` e dados (p.ex. `bpm`, `spo2`, `systolic`, `diastolic`, `temperature`). Os dados são guardados num buffer circular em memória com capacidade para 100000 entradas.
- GET `/api/vitals?patientId=<id>&limit=<n>&offset=<n>&since=<timestamp>` — Retorna leituras filtradas por paciente, com paginação.

Formato de POST (exemplo):

```json
{
    "patientId": "paciente123",
    "bpm": 72,
    "spo2": 98,
    "systolic": 120,
    "diastolic": 78
}
```

Exemplos `curl`:

```bash
# Enviar leitura (POST)
curl -X POST https://sipreavc.vercel.app/api/vitals \
    -H "Content-Type: application/json" \
    -d '{"patientId":"paciente123","bpm":72,"spo2":98}'

# Obter últimas 200 leituras do paciente
curl "https://sipreavc.vercel.app/api/vitals?patientId=paciente123&limit=200"
```

Observações:
- O buffer é mantido em memória do ambiente serverless — entradas persistem enquanto a instância estiver quente; cold starts podem reiniciar o buffer. Para produção recomenda-se usar um armazenamento persistente (ex.: MongoDB, Redis).
