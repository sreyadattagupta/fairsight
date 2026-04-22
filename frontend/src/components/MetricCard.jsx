import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MetricCard({ title, value, description, threshold, higherIsBetter = false }) {
  // Determine status colour
  let colour = "#94a3b8";
  let Icon   = Minus;

  if (threshold !== undefined && value !== undefined) {
    const good = higherIsBetter ? value >= threshold : value <= threshold;
    colour = good ? "#10b981" : value >= threshold * 0.9 ? "#f59e0b" : "#ef4444";
    Icon   = good ? TrendingUp : TrendingDown;
  }

  return (
    <div style={styles.card} className="card">
      <div style={styles.header}>
        <span style={styles.title}>{title}</span>
        <Icon size={16} color={colour} />
      </div>

      <div style={{ ...styles.value, color: colour }}>
        {value !== undefined ? Number(value).toFixed(3) : "—"}
      </div>

      {threshold !== undefined && (
        <div style={styles.bar}>
          <div style={{ ...styles.fill, width: `${Math.min(value / 1, 1) * 100}%`, background: colour }} />
          <div style={{ ...styles.thresholdMark, left: `${threshold * 100}%` }} title={`Threshold: ${threshold}`} />
        </div>
      )}

      {description && (
        <p style={styles.desc}>{description}</p>
      )}
    </div>
  );
}

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "0.78rem",
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  value: {
    fontSize: "2.2rem",
    fontWeight: 800,
    lineHeight: 1,
    fontVariantNumeric: "tabular-nums",
  },
  bar: {
    position: "relative",
    height: 4,
    background: "rgba(255,255,255,0.06)",
    borderRadius: 99,
    overflow: "visible",
    marginTop: 4,
  },
  fill: {
    height: "100%",
    borderRadius: 99,
    transition: "width 0.8s ease",
  },
  thresholdMark: {
    position: "absolute",
    top: -4,
    width: 2,
    height: 12,
    background: "rgba(255,255,255,0.3)",
    borderRadius: 1,
    transform: "translateX(-50%)",
  },
  desc: {
    fontSize: "0.76rem",
    color: "#475569",
    marginTop: 4,
  },
};