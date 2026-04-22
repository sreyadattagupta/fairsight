import { useEffect, useState } from "react";
import { getExplanation } from "../api";
import { Sparkles, RefreshCw } from "lucide-react";

export default function AIExplanationPanel({ auditId }) {
  const [text,    setText]    = useState("");
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [error,   setError]   = useState("");

  const load = async () => {
    if (!auditId) return;
    setLoading(true);
    setError("");
    const res = await getExplanation(auditId);
    setLoading(false);
    setFetched(true);
    if (res.error) { setError(res.error); return; }
    setText(res.explanation || "");
  };

  useEffect(() => {
    load();
  }, [auditId]);

  return (
    <div className="card" style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={iconWrap}>
            <Sparkles size={16} color="#a78bfa" />
          </div>
          <div>
            <h3 style={{ margin:0 }}>AI Explanation</h3>
            <p style={{ fontSize:"0.74rem", color:"#475569", margin:0 }}>Powered by Gemini</p>
          </div>
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={load}
          disabled={loading}
          title="Regenerate"
        >
          <RefreshCw size={13} style={{ animation: loading ? "spin 0.7s linear infinite" : "none" }} />
          {loading ? "Loading…" : "Regenerate"}
        </button>
      </div>

      {/* Content */}
      {loading && !text && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div className="skeleton" style={{ height:16, width:"90%" }} />
          <div className="skeleton" style={{ height:16, width:"75%" }} />
          <div className="skeleton" style={{ height:16, width:"82%" }} />
          <div className="skeleton" style={{ height:16, width:"60%" }} />
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <span>⚠ {error}</span>
        </div>
      )}

      {text && !loading && (
        <div style={prose} className="anim-fadeup">
          {text.split("\n\n").map((para, i) => (
            <p key={i} style={{ marginBottom: i < text.split("\n\n").length - 1 ? 14 : 0 }}>
              {para}
            </p>
          ))}
        </div>
      )}

      {!loading && !text && !error && fetched && (
        <p style={{ color:"#475569", fontSize:"0.85rem" }}>No explanation available.</p>
      )}
    </div>
  );
}

const iconWrap = {
  width:36, height:36, borderRadius:10,
  background:"rgba(124,58,237,0.15)",
  border:"1px solid rgba(124,58,237,0.3)",
  display:"flex", alignItems:"center", justifyContent:"center",
};

const prose = {
  color:"#cbd5e1",
  fontSize:"0.9rem",
  lineHeight:1.75,
  whiteSpace:"pre-wrap",
};