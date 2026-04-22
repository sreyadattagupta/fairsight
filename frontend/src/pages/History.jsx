import { useNavigate } from "react-router-dom";
import AuditHistoryTable from "../components/AuditHistoryTable";
import { History as HistoryIcon, Plus } from "lucide-react";

export default function History() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="container">

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:36 }}
          className="anim-fadeup"
        >
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{
              width:44, height:44, borderRadius:12,
              background:"rgba(124,58,237,0.15)",
              border:"1px solid rgba(124,58,237,0.3)",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <HistoryIcon size={20} color="#a78bfa" />
            </div>
            <div>
              <h2 style={{ margin:0 }}>Audit History</h2>
              <p style={{ margin:0, fontSize:"0.82rem", color:"#475569" }}>
                All bias audits run this session
              </p>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/upload")}
            id="new-audit-btn"
          >
            <Plus size={16} /> New Audit
          </button>
        </div>

        {/* Table card */}
        <div className="card anim-fadeup anim-delay-1" style={{ padding:28 }}>
          <AuditHistoryTable />
        </div>

        {/* Footer note */}
        <p style={{ textAlign:"center", fontSize:"0.75rem", color:"#334155", marginTop:24 }}>
          ⚠️ Audit history is stored in-memory and resets when the backend restarts.
          Export important reports using the Dashboard → Export JSON button.
        </p>
      </div>
    </div>
  );
}