import { useEffect, useState } from "react";
import { getFixSuggestions } from "../api";
import { Wrench, CheckCircle2, RefreshCw, AlertTriangle } from "lucide-react";

const SEVERITY_COLORS = {
  CRITICAL: "#ef4444",
  HIGH:     "#f59e0b",
  MEDIUM:   "#06b6d4",
  LOW:      "#10b981",
};

export default function FixPreview({ auditId, severity }) {
  const [fixes,    setFixes]    = useState([]);
  const [notes,    setNotes]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [fetched,  setFetched]  = useState(false);
  const [error,    setError]    = useState("");
  const [checked,  setChecked]  = useState({});

  const load = async () => {
    if (!auditId) return;
    setLoading(true);
    setError("");
    const res = await getFixSuggestions(auditId);
    setLoading(false);
    setFetched(true);
    if (res.error) { setError(res.error); return; }
    setFixes(res.suggestions || []);
    setNotes(res.ai_notes || "");
  };

  useEffect(() => { load(); }, [auditId]);

  const toggle = (i) => setChecked(prev => ({ ...prev, [i]: !prev[i] }));
  const doneCount = Object.values(checked).filter(Boolean).length;

  const sevColor = SEVERITY_COLORS[severity] || "#94a3b8";

  return (
    <div className="card" style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ ...iconWrap, background:"rgba(245,158,11,0.12)", border:"1px solid rgba(245,158,11,0.3)" }}>
            <Wrench size={16} color="#f59e0b" />
          </div>
          <div>
            <h3 style={{ margin:0 }}>Fix Recommendations</h3>
            <p style={{ fontSize:"0.74rem", color:"#475569", margin:0 }}>AI-generated remediation steps</p>
          </div>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={load}
          disabled={loading}
        >
          <RefreshCw size={13} style={{ animation: loading ? "spin 0.7s linear infinite" : "none" }} />
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {/* Progress bar when fixes exist */}
      {fixes.length > 0 && (
        <div style={{ marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.75rem", color:"#64748b", marginBottom:6 }}>
            <span>Remediation progress</span>
            <span style={{ color: doneCount === fixes.length ? "#10b981" : "#94a3b8" }}>
              {doneCount}/{fixes.length} applied
            </span>
          </div>
          <div style={{ height:5, background:"rgba(255,255,255,0.06)", borderRadius:99, overflow:"hidden" }}>
            <div style={{
              height:"100%",
              width: `${(doneCount / fixes.length) * 100}%`,
              background: doneCount === fixes.length ? "#10b981" : "#7c3aed",
              borderRadius:99,
              transition: "width 0.4s ease",
            }} />
          </div>
        </div>
      )}

      {/* Skeleton */}
      {loading && fixes.length === 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{ display:"flex", gap:12, alignItems:"center" }}>
              <div className="skeleton" style={{ width:22, height:22, borderRadius:6, flexShrink:0 }} />
              <div className="skeleton" style={{ height:16, flex:1 }} />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert alert-error">
          <AlertTriangle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Fix list */}
      {fixes.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {fixes.map((fix, i) => (
            <div
              key={i}
              onClick={() => toggle(i)}
              style={{
                display:"flex",
                alignItems:"flex-start",
                gap:12,
                padding:"12px 14px",
                borderRadius:10,
                background: checked[i] ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${checked[i] ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.07)"}`,
                cursor:"pointer",
                transition:"all 0.2s ease",
                opacity: checked[i] ? 0.6 : 1,
              }}
            >
              <CheckCircle2
                size={18}
                color={checked[i] ? "#10b981" : "#334155"}
                fill={checked[i] ? "rgba(16,185,129,0.2)" : "transparent"}
                style={{ flexShrink:0, marginTop:1, transition:"color 0.2s" }}
              />
              <div style={{ flex:1 }}>
                <span style={{
                  fontSize:"0.3rem",
                  fontWeight:600,
                  color:"#a78bfa",
                  display:"block",
                  marginBottom:3,
                }}>
                  Step {i + 1}
                </span>
                <p style={{
                  margin:0,
                  fontSize:"0.87rem",
                  color: checked[i] ? "#64748b" : "#cbd5e1",
                  textDecoration: checked[i] ? "line-through" : "none",
                  lineHeight:1.55,
                }}>
                  {fix}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All done state */}
      {fixes.length > 0 && doneCount === fixes.length && (
        <div className="alert alert-success anim-fadeup" style={{ marginTop:16 }}>
          <CheckCircle2 size={16} />
          <span>All remediation steps marked as applied! Re-audit your dataset to verify improvement.</span>
        </div>
      )}

      {!loading && fixes.length === 0 && !error && fetched && (
        <p style={{ color:"#475569", fontSize:"0.85rem" }}>No fix suggestions generated yet.</p>
      )}
    </div>
  );
}

const iconWrap = {
  width:36, height:36, borderRadius:10,
  display:"flex", alignItems:"center", justifyContent:"center",
};