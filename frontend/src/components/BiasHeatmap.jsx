const SEVERITY_CONFIG = {
  CRITICAL: { label: "CRITICAL", color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", emoji: "🚨" },
  HIGH:     { label: "HIGH",     color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)", emoji: "⚠️" },
  MEDIUM:   { label: "MEDIUM",   color: "#06b6d4", bg: "rgba(6,182,212,0.08)",  border: "rgba(6,182,212,0.25)",  emoji: "🔶" },
  LOW:      { label: "LOW",      color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.25)", emoji: "✅" },
};

export default function BiasHeatmap({ metrics }) {
  if (!metrics?.group_stats) return null;

  const { severity = "LOW", disparate_impact, demographic_parity_gap, group_stats, sensitive_column } = metrics;
  const cfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.LOW;

  // Sort groups by positive rate descending
  const groups = Object.entries(group_stats).sort((a, b) => b[1].positive_rate - a[1].positive_rate);
  const maxRate = groups[0]?.[1]?.positive_rate || 1;

  return (
    <div className="card" style={{ padding: 24 }}>
      {/* Header row */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:24 }}>
        <div>
          <h3 style={{ marginBottom:4 }}>Bias Heatmap</h3>
          <p style={{ fontSize:"0.78rem", color:"#475569" }}>
            Sensitive attribute: <strong style={{ color:"#a78bfa" }}>{sensitive_column}</strong>
          </p>
        </div>
        <div style={{
          display:"flex", alignItems:"center", gap:8,
          padding:"8px 16px",
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          borderRadius: 99,
        }}>
          <span>{cfg.emoji}</span>
          <span style={{ color: cfg.color, fontWeight:700, fontSize:"0.85rem", letterSpacing:"0.05em" }}>
            {cfg.label} BIAS
          </span>
        </div>
      </div>

      {/* Group bars */}
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {groups.map(([name, stat], i) => {
          const pct = (stat.positive_rate / maxRate) * 100;
          const isMin = i === groups.length - 1 && groups.length > 1;
          const barColor = isMin ? cfg.color : "#7c3aed";
          return (
            <div key={name}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:"0.85rem", fontWeight:500, color:"#f1f5f9", display:"flex", alignItems:"center", gap:6 }}>
                  {isMin && <span title="Most disadvantaged">🔻</span>}
                  {name}
                </span>
                <span style={{ fontSize:"0.82rem", color: barColor, fontWeight:700, fontVariantNumeric:"tabular-nums" }}>
                  {(stat.positive_rate * 100).toFixed(1)}%
                  <span style={{ color:"#475569", fontWeight:400, marginLeft:6 }}>n={stat.count}</span>
                </span>
              </div>
              <div style={{ position:"relative", height:10, background:"rgba(255,255,255,0.05)", borderRadius:99, overflow:"hidden" }}>
                <div style={{
                  height:"100%",
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
                  borderRadius: 99,
                  transition: "width 1s ease",
                  boxShadow: `0 0 12px ${barColor}55`,
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Key metrics row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:24 }}>
        <div style={statBox}>
          <span style={statLabel}>Disparate Impact</span>
          <span style={{ ...statVal, color: disparate_impact >= 0.8 ? "#10b981" : "#ef4444" }}>
            {disparate_impact?.toFixed(3)}
          </span>
          <span style={statHint}>≥ 0.8 is fair (4/5ths rule)</span>
        </div>
        <div style={statBox}>
          <span style={statLabel}>Parity Gap</span>
          <span style={{ ...statVal, color: demographic_parity_gap <= 0.1 ? "#10b981" : demographic_parity_gap <= 0.2 ? "#f59e0b" : "#ef4444" }}>
            {demographic_parity_gap?.toFixed(3)}
          </span>
          <span style={statHint}>max − min outcome rate</span>
        </div>
      </div>
    </div>
  );
}

const statBox = {
  background:"rgba(255,255,255,0.03)",
  border:"1px solid rgba(255,255,255,0.07)",
  borderRadius:10,
  padding:"12px 16px",
  display:"flex", flexDirection:"column", gap:4,
};
const statLabel = { fontSize:"0.72rem", color:"#64748b", textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600 };
const statVal   = { fontSize:"1.6rem", fontWeight:800, fontVariantNumeric:"tabular-nums", lineHeight:1.1 };
const statHint  = { fontSize:"0.7rem", color:"#475569" };