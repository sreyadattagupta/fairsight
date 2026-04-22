import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BiasHeatmap from "../components/BiasHeatmap";
import GroupBarChart from "../components/GroupBarChart";
import MetricCard from "../components/MetricCard";
import AIExplanationPanel from "../components/AIExplanationPanel";
import FixPreview from "../components/FixPreview";
import { ArrowLeft, Download, LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  const [auditId,   setAuditId]   = useState(null);
  const [metrics,   setMetrics]   = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedId      = localStorage.getItem("auditId");
    const storedMetrics = localStorage.getItem("metrics");
    if (storedId && storedMetrics) {
      setAuditId(storedId);
      setMetrics(JSON.parse(storedMetrics));
    }
  }, []);

  // Download report as JSON
  const downloadReport = () => {
    const blob = new Blob(
      [JSON.stringify({ auditId, metrics }, null, 2)],
      { type:"application/json" }
    );
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `fairsight-audit-${auditId?.slice(0,8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── No data state ── */
  if (!metrics) {
    return (
      <div className="page">
        <div className="container">
          <div style={{
            display:"flex", flexDirection:"column", alignItems:"center",
            justifyContent:"center", minHeight:400, textAlign:"center", gap:16,
          }}>
            <LayoutDashboard size={56} color="#334155" />
            <h2 style={{ color:"#475569" }}>No audit data found</h2>
            <p style={{ color:"#334155" }}>Run an audit first to view the bias dashboard.</p>
            <button className="btn btn-primary" onClick={() => navigate("/upload")}>
              Go to Upload
            </button>
          </div>
        </div>
      </div>
    );
  }

  const severity = metrics.severity || "LOW";

  return (
    <div className="page">
      <div className="container">

        {/* ── Page header ── */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16, marginBottom:32 }}
          className="anim-fadeup"
        >
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate("/upload")}>
                <ArrowLeft size={13} /> New Audit
              </button>
              <span style={{ color:"#334155", fontSize:"0.8rem" }}>
                ID: <code style={{ color:"#a78bfa" }}>{auditId?.slice(0,8)}…</code>
              </span>
            </div>
            <h2 style={{ margin:0 }}>Bias Dashboard</h2>
            <p style={{ margin:"4px 0 0", fontSize:"0.82rem", color:"#475569" }}>
              Target: <strong style={{ color:"#a78bfa" }}>{metrics.target_column}</strong>
              &nbsp;·&nbsp;Sensitive: <strong style={{ color:"#06b6d4" }}>{metrics.sensitive_column}</strong>
              &nbsp;·&nbsp;{metrics.total_rows} rows
            </p>
          </div>

          <button className="btn btn-secondary" onClick={downloadReport}>
            <Download size={15} /> Export JSON
          </button>
        </div>

        {/* ── Metric cards row ── */}
        <div className="grid-4 anim-fadeup anim-delay-1" style={{ marginBottom:24 }}>
          <MetricCard
            title="Disparate Impact"
            value={metrics.disparate_impact}
            description="≥ 0.8 required (4/5ths rule)"
            threshold={0.8}
            higherIsBetter
          />
          <MetricCard
            title="Parity Gap"
            value={metrics.demographic_parity_gap ?? metrics.demographic_parity}
            description="Max−min outcome rate"
            threshold={0.1}
            higherIsBetter={false}
          />
          <MetricCard
            title="Groups Detected"
            value={metrics.groups?.length ?? 2}
            description="Unique sensitive attribute values"
          />
          <div className="card" style={{ display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:"0.72rem", fontWeight:600, color:"#64748b", textTransform:"uppercase", letterSpacing:"0.06em" }}>Severity</span>
            <span style={{
              fontSize:"1.6rem", fontWeight:800,
              color: severity === "CRITICAL" ? "#ef4444"
                   : severity === "HIGH"     ? "#f59e0b"
                   : severity === "MEDIUM"   ? "#06b6d4"
                   : "#10b981",
            }}>
              {severity}
            </span>
          </div>
        </div>

        {/* ── Charts row ── */}
        <div className="grid-2 anim-fadeup anim-delay-2" style={{ marginBottom:24 }}>
          <BiasHeatmap metrics={metrics} />
          <GroupBarChart metrics={metrics} />
        </div>

        {/* ── AI section ── */}
        <div className="grid-2 anim-fadeup anim-delay-3">
          <AIExplanationPanel auditId={auditId} />
          <FixPreview auditId={auditId} severity={severity} />
        </div>

      </div>
    </div>
  );
}