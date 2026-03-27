# SIPRE-AVC Frontend - Estrutura Descentralizada

## 📁 Organização de Diretórios

```
src/
├── App.jsx                 # Arquivo principal - orquestra componentes
├── main.jsx               # Entry point do Vite
│
├── shared/                # Componentes e recursos compartilhados
│   ├── components.jsx     # Icon, ECG, Sparkline
│   ├── styles.js         # Estilos CSS globais
│   ├── data.js           # Dados: PATIENTS, ALERTS
│   └── index.js          # Exportações centralizadas
│
├── auth/                 # Autenticação
│   └── LoginPage.jsx     # Login e Registro
│
├── home/                 # Página inicial
│   ├── HomePage.jsx      # Seções home, sobre, funcionalidades
│   ├── Navbar.jsx        # Navegação principal
│   └── HeroBg.jsx        # Background do hero
│
├── Doutor/               # Componentes para médicos
│   ├── Navigation.jsx    # Sidebar e Topbar (NAV_DOCTOR)
│   ├── DoctorDashboard.jsx
│   ├── PatientsPage.jsx
│   ├── AlertsPage.jsx
│   └── ReportsPage.jsx
│
├── paciente/             # Componentes para pacientes  
│   ├── PatientDashboard.jsx   # Dashboard principal
│   ├── VitalsPage.jsx         # Sinais Vitais com histórico
│   ├── RecommendationsPage.jsx # Recomendações personalizadas
│   ├── AlertsPage.jsx          # Alertas do paciente
│   └── SettingsPage.jsx        # Configurações
│
├── context/              # Context API (se usar)
├── hooks/                # Custom hooks
├── services/             # Serviços API
└── services/             # Utilitários
```

## 🔄 Fluxo de Importações

### Em App.jsx:
```javascript
import { GLOBAL_STYLES, Icon, PATIENTS, ALERTS } from './shared';
import { LoginPage } from './auth/LoginPage';
import { HomePage, Navbar } from './home';
import { Sidebar, Topbar, DoctorDashboard, PatientsPage } from './Doutor/Navigation';
import { PatientDashboard, VitalsPage, RecommendationsPage } from './paciente';
```

### Em componentes do Doutor:
```javascript
import { Icon } from '../shared/components';
import { PATIENTS, ALERTS } from '../shared/data';
```

### Em componentes do Paciente:
```javascript
import { Icon, ECG, Sparkline } from '../shared/components';
```

## ✅ Status de Descentralização

- [x] Componentes compartilhados (shared/)
- [x] Autenticação (auth/)
- [ ] Página inicial (home/) - Em progresso
- [ ] Componentes médico (Doutor/) - Em progresso
- [ ] Componentes paciente (paciente/) - Pendente
- [ ] App.jsx refatorado - Pendente

## 🚀 Próximos Passos

1. Criar todos os arquivos dos diretórios home/, Doutor/, paciente/
2. Atualizar App.jsx para importar dos novos locais
3. Testar funcionalidade completa
4. Remover código duplicado do App.jsx

## 📝 Notas

- Os estilos CSS globais estão em `shared/styles.js`
- Dados estáticos (PATIENTS, ALERTS) em `shared/data.js`
- Componentes compartilhados (Icon, ECG, Sparkline) em `shared/components.jsx`
- Cada feature (auth, home, Doutor, paciente) é independente mas pode importar do shared/

## 🔗 Links Úteis

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
