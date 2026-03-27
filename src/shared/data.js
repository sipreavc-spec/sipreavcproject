export const PATIENTS = [
  { 
    id: 1, 
    patientId: "paciente123", 
    name: "João da Silva", 
    age: 65, 
    bpm: 0, 
    spo2: 0, 
    temp: 0, 
    bp: "0/0", 
    status: "desconhecido", 
    lastUp: "--", 
    doctor: "Dra. Maria Santos" 
  },
];

export const ALERTS = [
  { id: 1, patient: "Ana Ferreira", type: "critical", msg: "BPM crítico: 122 bpm (limite: 100)", time: "14:32" },
  { id: 2, patient: "Ana Ferreira", type: "critical", msg: "SpO₂ baixo: 88% (mínimo: 90%)", time: "14:32" },
  { id: 3, patient: "Ana Ferreira", type: "critical", msg: "Temperatura elevada: 38.2°C", time: "14:31" },
  { id: 4, patient: "Pedro Neto", type: "warning", msg: "BPM elevado: 95 bpm — em observação", time: "14:28" },
  { id: 5, patient: "João da Silva", type: "normal", msg: "Sinais vitais normalizados", time: "14:15" },
  { id: 6, patient: "Luísa Campos", type: "normal", msg: "SpO₂ excelente: 98%", time: "13:55" },
];
