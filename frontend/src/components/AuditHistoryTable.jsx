import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHistory, deleteAudit } from "../api";
import { Trash2, ExternalLink, RefreshCw, Clock } from "lucide-react";

const BADGE = {
  CRITICAL: { bg:"rgba(239,68,68,0.15)",   color:"#ef4444",  border:"rgba(239,68,68,0.3)" },
  HIGH:     { bg:"rgba(245,158,11,0.15)",  color:"#f59e0b",  border:"rgba(245,158,11,0.3)" },
  MEDIUM:   { bg:"rgba(6,182,212,0.12)",   color:"#06b6d4",  border:"rgba(6,182,212,0.3)" },
  LOW:      { bg:"rgba(16,185,129,0.12)",  color:"#10b981",  border:"rgba(16,185,129,0.3)" },
};

function SeverityBadge({ sev }) {
  const s = BADGE[sev] || BADGE.LOW;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center",
      padding:"3px 10px", borderRadius:99,
      fontSize:"0.7rem", fontWeight:700,
      letterSpacing:"0.06em", textTransform:"uppercase",
      background:s.bg, color:s.color, border:`1px solid ${s.border}`,
    }}>
      {sev}
    </span>
  );
}

export default function AuditHistoryTable() {
  const [data,    setData]    = useState({});
  const [loading, setLoading] = useState(false);
  const [deleting,setDeleting]= useState(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    const res = await getHistory();
    setLoading(false);
    setData(res.data || {});
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this audit record?")) return;
    setDeleting(id);
    await deleteAudit(id);
    setDeleting(null);
    load();
  };

  const handleView = (id, metrics) => {
    localStorage.setItem("auditId", id);
    localStorage.setItem("metrics", JSON.stringify(metrics));
    navigate("/dashboard");
  };

  const entries = Object.entries(data);

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <p style={{ margin:0, fontSize:"0.85rem", color:"#64748b" }}>
          {entries.length} audit{entries.length !== 1 ? "s" : ""} stored in session
        </p>
        <button className="btn btn-secondary btn-sm" onClick={load} disabled={loading}>
          <RefreshCw size={13} style={{ animation: loading ? "spin 0.7s linear infinite":"none" }} />
          Refresh
        </button>
      </div>

      {loading && entries.length === 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height:56, borderRadius:10 }} />)}
        </div>
      )}

      {!loading && entries.length === 0 && (
        <div style={emptyState}>
          <Clock size={40} color="#334155" style={{ marginBottom:12 }} />
          <p style={{ color:"#475569", margin:0 }}>No audits yet this session.</p>
          <p style={{ color:"#334155", fontSize:"0.8rem", marginTop:4 }}>Upload a dataset to get started.</p>
        </div>
      )}

      {entries.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Audit ID</th>
                <th>File</th>
                <th>Target</th>
                <th>Sensitive</th>
                <th>DI Score</th>
                <th>Severity</th>
                <th>Timestamp</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(([id, val]) => {
                const m = val.metrics || {};
                return (
                  <tr key={id}>
                    <td style={{ fontFamily:"monospace", fontSize:"0.72rem", color:"#64748b" }}>
                      {id.slice(0, 8)}…
                    </td>
                    <td style={{ color:"#94a3b8", maxWidth:140, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {val.filename || "—"}
                    </td>
                    <td>
                      <code style={{ color:"#a78bfa", fontSize:"0.78rem" }}>{m.target_column || val.target_column}</code>
                    </td>
                    <td>
                      <code style={{ color:"#06b6d4", fontSize:"0.78rem" }}>{m.sensitive_column || val.sensitive_column}</code>
                    </td>
                    <td style={{ fontWeight:700, color: m.disparate_impact >= 0.8 ? "#10b981" : "#ef4444" }}>
                      {m.disparate_impact?.toFixed(3) ?? "—"}
                    </td>
                    <td>
                      <SeverityBadge sev={m.severity || "LOW"} />
                    </td>
                    <td style={{ color:"#475569", fontSize:"0.75rem", whiteSpace:"nowrap" }}>
                      {val.timestamp ? new Date(val.timestamp).toLocaleString() : "—"}
                    </td>
                    <td>
                      <div style={{ display:"flex", gap:6 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleView(id, m)}
                          title="View dashboard"
                        >
                          <ExternalLink size={12} /> View
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(id)}
                          disabled={deleting === id}
                          title="Delete"
                        >
                          <Trash2 size={12} />
                          {deleting === id ? "…" : ""}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const emptyState = {
  display:"flex",
  flexDirection:"column",
  alignItems:"center",
  justifyContent:"center",
  padding:"60px 0",
  borderRadius:16,
  border:"1px dashed rgba(255,255,255,0.08)",
  textAlign:"center",
};