export const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const paths = {
    brain: "M8 1C4.5 1 2 3.5 2 7c0 1.2.4 2.3 1 3.2V12c0 1.1.9 2 2 2h2v1h4v-1h2c1.1 0 2-.9 2-2v-1.8c.6-.9 1-2 1-3.2 0-3.5-2.5-6-6-6z",
    heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
    lungs: "M6 4h12v16H6z M9 7v10 M15 7v10",
    therm: "M14 14.76v1.5a2.5 2.5 0 0 1-5 0v-1.5m1-5V7a3 3 0 0 1 3-3 3 3 0 0 1 3 3v2.76",
    bp: "M3 12h18M3 6h18M3 18h18",
    bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9m1.73 16H4.27",
    doc: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6",
    users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M16 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
    check: "M20 6L9 17l-5-5",
    warn: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
    arrow: "M5 12h14M12 5l7 7-7 7",
    leaf: "M11 22C17.07 22 22 17.07 22 11s-5-11-11-11S0 5 0 11s4.93 11 11 11z",
    activity: "M22 12h-4l-3 9H9l-3-9H2M11 22v-9",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  };
  
  const d = paths[name] || paths.brain;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
};

export const ECG = ({ color = "#27aae1", h = 48 }) => (
  <svg className="ecg-svg" viewBox={`0 0 600 ${h}`} preserveAspectRatio="none">
    {[0, 300].map(ox => (
      <polyline
        key={ox}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        points={`${ox},${h / 2} ${ox + 18},${h / 2} ${ox + 28},${h * 0.35} ${ox + 38},${h * 0.65} ${ox + 48},${h / 2} ${ox + 60},${h / 2} ${ox + 64},${h * 0.08} ${ox + 68},${h * 0.92} ${ox + 72},${h / 2} ${ox + 90},${h / 2} ${ox + 100},${h * 0.38} ${ox + 110},${h * 0.62} ${ox + 125},${h / 2} ${ox + 145},${h / 2} ${ox + 155},${h * 0.35} ${ox + 165},${h * 0.65} ${ox + 175},${h / 2} ${ox + 185},${h / 2} ${ox + 189},${h * 0.08} ${ox + 193},${h * 0.92} ${ox + 197},${h / 2} ${ox + 215},${h / 2} ${ox + 225},${h * 0.38} ${ox + 235},${h * 0.62} ${ox + 255},${h / 2} ${ox + 300},${h / 2}`}
      />
    ))}
  </svg>
);

export const Sparkline = ({ values = [], color = "#2980b9", h = 48 }) => {
  if (!values || values.length === 0) return <div style={{ height: h }} />;
  const w = Math.max(120, values.length * 3);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ")}
      />
    </svg>
  );
};
