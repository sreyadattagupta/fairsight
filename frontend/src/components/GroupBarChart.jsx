import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, Cell, ResponsiveContainer, ReferenceLine, LabelList,
} from "recharts";

const COLOURS = [
  "#7c3aed","#06b6d4","#f59e0b","#10b981",
  "#ef4444","#ec4899","#8b5cf6","#14b8a6",
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{
      background:"#14172280",
      backdropFilter:"blur(12px)",
      border:"1px solid rgba(255,255,255,0.1)",
      borderRadius:10,
      padding:"10px 14px",
    }}>
      <p style={{ color:"#f1f5f9", fontWeight:600, margin:0 }}>{d.payload.name}</p>
      <p style={{ color: d.fill, margin:"4px 0 0", fontSize:"0.85rem" }}>
        Positive rate: <strong>{(d.value * 100).toFixed(1)}%</strong>
      </p>
    </div>
  );
};

export default function GroupBarChart({ metrics }) {
  if (!metrics?.group_stats) return null;

  const data = Object.entries(metrics.group_stats).map(([name, s]) => ({
    name,
    value: s.positive_rate,
    count: s.count,
  }));

  const maxVal = Math.max(...data.map(d => d.value));

  return (
    <div className="card" style={{ padding: "24px 20px 16px" }}>
      <h3 style={{ marginBottom: 6, fontSize:"1rem" }}>Group Outcome Comparison</h3>
      <p style={{ fontSize:"0.78rem", color:"#475569", marginBottom:20 }}>
        Positive-outcome rate per demographic group
        &nbsp;•&nbsp;sensitive attribute: <strong style={{ color:"#a78bfa" }}>{metrics.sensitive_column}</strong>
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top:20, right:20, bottom:4, left:0 }} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" tick={{ fill:"#94a3b8", fontSize:12 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0,1]} tickFormatter={v => `${(v*100).toFixed(0)}%`} tick={{ fill:"#94a3b8", fontSize:11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill:"rgba(255,255,255,0.03)" }} />
          <ReferenceLine y={0.8} stroke="#f59e0b" strokeDasharray="4 3" label={{ value:"80% threshold", fill:"#f59e0b", fontSize:10 }} />
          <Bar dataKey="value" radius={[6,6,0,0]}>
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={COLOURS[i % COLOURS.length]} />
            ))}
            <LabelList dataKey="value" position="top" formatter={v => `${(v*100).toFixed(1)}%`} style={{ fill:"#94a3b8", fontSize:11 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginTop:8 }}>
        {data.map((d,i) => (
          <div key={d.name} style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ width:10, height:10, borderRadius:3, background:COLOURS[i%COLOURS.length], display:"inline-block" }} />
            <span style={{ fontSize:"0.76rem", color:"#94a3b8" }}>{d.name} (n={d.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}