# 🔧 QUICK REFERENCE - Código Implementado

## Localização: `src/App.jsx` - HistoryPage Component

---

## 1️⃣ Estado do Período

**Linha ~1571**
```javascript
const [period, setPeriod] = useState('daily'); // 'daily' | 'weekly'
const [esp1History, setEsp1History] = useState([]);
const [esp2History, setEsp2History] = useState([]);
const [stats, setStats] = useState({});
const [loading, setLoading] = useState(false);
```

---

## 2️⃣ useEffect com Fallback (Principal)

**Linha ~1580-1740**
```javascript
useEffect(()=>{
  if(!patient) return;
  
  let mounted = true;
  setLoading(true);
  (async ()=>{
    try{
      const mod = await import('./services');
      const svc = mod.serverlessService;
      
      // ============ ESP1 DATA (Cardio) ============
      let esp1Data = [];
      try {
        const esp1Result = await svc.getHistoryEsp1({ 
          patientId: patient.patientId, 
          period: period,
          limit: period === 'daily' ? 100 : 300 
        });
        esp1Data = esp1Result || [];
      } catch (e) {
        console.warn('Endpoint getHistoryEsp1 não disponível, tentando getEsp1');
        try {
          const esp1Latest = await svc.getEsp1({ patientId: patient.patientId });
          if (esp1Latest && esp1Latest.entries && esp1Latest.entries[patient.patientId]) {
            esp1Data = [esp1Latest.entries[patient.patientId]];
          }
        } catch (e2) {
          console.warn('getEsp1 também falhou', e2);
        }
      }
      
      // ============ ESP2 DATA (Temperatura) ============
      let esp2Data = [];
      try {
        const esp2Result = await svc.getHistoryEsp2({ 
          patientId: patient.patientId, 
          period: period,
          limit: period === 'daily' ? 100 : 300 
        });
        esp2Data = esp2Result || [];
      } catch (e) {
        console.warn('Endpoint getHistoryEsp2 não disponível, tentando getEsp2');
        try {
          const esp2Latest = await svc.getEsp2({ patientId: patient.patientId });
          if (esp2Latest && esp2Latest.entries && esp2Latest.entries[patient.patientId]) {
            esp2Data = [esp2Latest.entries[patient.patientId]];
          }
        } catch (e2) {
          console.warn('getEsp2 também falhou', e2);
        }
      }
      
      if(!mounted) return;
      
      // ============ DADOS SIMULADOS (Fallback 3) ============
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
      
      // ============ NORMALIZAR DADOS ============
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
      
      // ============ CALCULAR ESTATÍSTICAS ============
      const validBpm = processedEsp1.filter(h => typeof h.bpm === 'number').map(h => h.bpm);
      const validSpo2 = processedEsp1.filter(h => typeof h.spo2 === 'number').map(h => h.spo2);
      const validTemp = processedEsp2.filter(h => typeof h.temperature === 'number').map(h => h.temperature);
      const validSys = processedEsp1.filter(h => typeof h.systolic === 'number');
      
      const avgBpm = validBpm.length > 0 ? Math.round(validBpm.reduce((a,b) => a+b) / validBpm.length) : patient.bpm;
      const avgSpo2 = validSpo2.length > 0 ? Math.round(validSpo2.reduce((a,b) => a+b) / validSpo2.length) : patient.spo2;
      const avgTemp = validTemp.length > 0 ? (validTemp.reduce((a,b) => a+b) / validTemp.length).toFixed(1) : patient.temp;
      const avgBp = validSys.length > 0 ? {
        sys: Math.round(validSys.reduce((a,b) => a+b.systolic, 0) / validSys.length),
        dia: Math.round(validSys.reduce((a,b) => a+b.diastolic, 0) / validSys.length)
      } : { sys: 120, dia: 80 };
      
      const criticalCount = processedEsp1.filter(h => 
        (h.bpm > 100 || h.bpm < 50) || (h.spo2 < 90)
      ).length + processedEsp2.filter(h => h.temperature > 38).length;
      
      setStats({ 
        bpmAvg: avgBpm, 
        spo2Avg: avgSpo2, 
        tempAvg: avgTemp,
        bpAvg: `${avgBp.sys}/${avgBp.dia}`,
        alerts: criticalCount 
      });
      setLoading(false);
    }catch(err){ 
      console.warn('Erro ao buscar histórico',err);
      setEsp1History([]);
      setEsp2History([]);
      setLoading(false);
    }
  })();
  return ()=>{ mounted = false; };
},[patient, period]); // ← DEPENDENCY: period!
```

---

## 3️⃣ Merge de Dados

**Linha ~1742-1755**
```javascript
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
```

---

## 4️⃣ Botões Daily/Weekly

**Linha ~1706-1721**
```javascript
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
  <div>
    <h1 style={{fontFamily:"'Sora'",fontWeight:800,fontSize:24,color:"var(--text)"}}>Histórico de {patient.name}</h1>
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
```

---

## 5️⃣ Gráfico de BPM

**Linha ~1757-1780**
```javascript
<div className="wcard" style={{padding:24,marginBottom:18}}>
  <h3 style={{fontFamily:"'Sora'",fontWeight:700,fontSize:16,color:"var(--text)",marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
    <span className="ic-box ic-red" style={{width:30,height:30,borderRadius:8}}>
      <Icon name="heart" size={14} color="#e74c3c"/>
    </span>
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
  <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--muted)",padding:"5px 4px 0"}}>
    <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
  </div>
</div>
```

---

## 6️⃣ Cards de Estatísticas

**Linha ~1783-1800**
```javascript
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
```

---

## 7️⃣ Tabela Detalhada

**Linha ~1803-1850**
```javascript
<div className="wcard" style={{padding:24}}>
  <h3 style={{fontFamily:"'Sora'",fontWeight:700,fontSize:16,color:"var(--text)",marginBottom:16}}>Histórico Detalhado</h3>
  <div style={{overflowX:"auto"}}>
    <table style={{width:"100%"}}>
      <thead>
        <tr style={{fontSize:13,fontWeight:600,borderBottom:"2px solid rgba(41,128,185,.1)"}}>
          <th style={{textAlign:"left",padding:"10px 8px",color:"var(--muted)"}}>Hora</th>
          <th style={{textAlign:"center",padding:"10px 8px",color:"var(--muted)"}}>BPM<br/><span style={{fontSize:10}}>(ESP1)</span></th>
          <th style={{textAlign:"center",padding:"10px 8px",color:"var(--muted)"}}>SpO₂<br/><span style={{fontSize:10}}>(ESP1)</span></th>
          <th style={{textAlign:"center",padding:"10px 8px",color:"var(--muted)"}}>Pressão<br/><span style={{fontSize:10}}>(ESP1)</span></th>
          <th style={{textAlign:"center",padding:"10px 8px",color:"var(--muted)"}}>Temperatura<br/><span style={{fontSize:10}}>(ESP2)</span></th>
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
```

---

## 📝 Serviços em `services/index.js`

### getHistoryEsp1
```javascript
getHistoryEsp1: async ({ patientId, period = 'daily', limit = 100 }) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(
      `${VITE_API_URL}/vitals/esp1/history?patientId=${patientId}&period=${period}&limit=${limit}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    
    if (!response.ok) return [];
    return await response.json();
  } catch (e) {
    console.warn('getHistoryEsp1 error:', e);
    return [];
  }
}
```

### getHistoryEsp2
```javascript
getHistoryEsp2: async ({ patientId, period = 'daily', limit = 100 }) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(
      `${VITE_API_URL}/vitals/esp2/history?patientId=${patientId}&period=${period}&limit=${limit}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);
    
    if (!response.ok) return [];
    return await response.json();
  } catch (e) {
    console.warn('getHistoryEsp2 error:', e);
    return [];
  }
}
```

---

## 🔍 Debug Commands

### Console Logs (F12):
```javascript
// Ver se fallback foi acionado
console.warn('Endpoint getHistoryEsp1 não disponível, tentando getEsp1');

// Ver state
console.log('ESP1 Data:', esp1History);
console.log('ESP2 Data:', esp2History);
console.log('Stats:', stats);
console.log('Period:', period);
```

### Network (DevTools → Network tab):
```
GET /vitals/esp1/history?patientId=1&period=daily
GET /vitals/esp2/history?patientId=1&period=daily
GET /vitals/esp1?patientId=1  // Fallback
GET /vitals/esp2?patientId=1  // Fallback
```

---

## ✅ Validation Checklist

```javascript
// No console:
console.log('✅ period:', period); // 'daily' ou 'weekly'
console.log('✅ esp1History length:', esp1History.length); // > 0
console.log('✅ esp2History length:', esp2History.length); // > 0
console.log('✅ stats:', stats); // Deve ter bpmAvg, spo2Avg, etc
console.log('✅ merged:', mergedHistory().length); // > 0

// No DOM:
// - Botões visíveis: document.querySelectorAll('.btn').length >= 2
// - Gráfico renderizado: document.querySelectorAll('[title*="bpm"]').length > 0
// - Cards renderizados: document.querySelectorAll('.hist-grid > div').length === 4
// - Tabela renderizada: document.querySelectorAll('table tbody tr').length > 0
```

---

## 🚀 Modificações Rápidas

### Remover Dados Simulados (Quando Backend Pronto):
```javascript
// Procure por:
if (esp1Data.length === 0) {
  esp1Data = Array.from(...); // ← Delete these lines
}

// Deixe assim:
if (esp1Data.length === 0) {
  esp1Data = []; // Deixe vazio
}
```

### Mudar Limite de Registros na Tabela:
```javascript
// Procure por:
.slice(0, 50) // ← Mude o número

// Exemplo:
.slice(0, 100) // Mostra 100 registros
.slice(0, 10)  // Mostra apenas 10
```

### Mudar Cores do Gráfico:
```javascript
// Procure por:
const c = v>100?"#e74c3c":v>85?"#f39c12":"#2980b9";

// Mude as cores (hex):
// #e74c3c = Vermelho (BPM alto)
// #f39c12 = Laranja (BPM médio)
// #2980b9 = Azul (BPM baixo)
```

---

## 📊 Dados Esperados

### ESP1 (Cardio)
```json
{
  "ts": "2024-01-15T10:30:00Z",
  "bpm": 78,        // 50-120 (realista)
  "spo2": 97,       // 90-100% (crítico < 90)
  "systolic": 120,  // 100-180 mmHg
  "diastolic": 80   // 60-110 mmHg
}
```

### ESP2 (Temperatura)
```json
{
  "ts": "2024-01-15T10:30:00Z",
  "temperature": 36.5  // 35-38°C (febre > 38)
}
```

---

**Fim do Quick Reference** ✨

Para detalhes completos, veja:
- HISTORY_PAGE_IMPLEMENTATION.md
- BACKEND_IMPLEMENTATION_GUIDE.md
- TEST_GUIDE.md
