import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadZone from "../components/UploadZone";
import { FileUp, Info } from "lucide-react";

export default function Upload() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAuditComplete = (auditId, metrics) => {
    localStorage.setItem("auditId", auditId);
    localStorage.setItem("metrics", JSON.stringify(metrics));
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="page">
      <div className="container">

        {/* Page header */}
        <div style={{ marginBottom:40 }} className="anim-fadeup">
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <div style={{
              width:44, height:44, borderRadius:12,
              background:"rgba(124,58,237,0.15)",
              border:"1px solid rgba(124,58,237,0.3)",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <FileUp size={20} color="#a78bfa" />
            </div>
            <div>
              <h2 style={{ margin:0 }}>Upload Dataset</h2>
              <p style={{ margin:0, fontSize:"0.82rem", color:"#475569" }}>
                Step 1 of 2 — select your CSV and configure columns
              </p>
            </div>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:28, alignItems:"flex-start" }}>

          {/* Main upload card */}
          <div className="card anim-fadeup" style={{ padding:32 }}>
            <UploadZone
              onAuditComplete={(id, m) => {
                setLoading(false);
                handleAuditComplete(id, m);
              }}
            />
          </div>

          {/* Info sidebar */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }} className="anim-fadeup anim-delay-1">

            <div className="card" style={{ padding:20 }}>
              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:14 }}>
                <Info size={15} color="#06b6d4" />
                <h4 style={{ margin:0, color:"#06b6d4", fontSize:"0.85rem" }}>How it works</h4>
              </div>
              <ol style={{ paddingLeft:18, display:"flex", flexDirection:"column", gap:10 }}>
                {[
                  "Upload a CSV with outcome and demographic columns",
                  "FairSight reads column names — pick target & sensitive",
                  "Backend computes fairness metrics (disparate impact, etc.)",
                  "Gemini AI generates plain-English explanation + fixes",
                ].map((step, i) => (
                  <li key={i} style={{ color:"#94a3b8", fontSize:"0.82rem", lineHeight:1.55 }}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="card" style={{ padding:20 }}>
              <h4 style={{ margin:"0 0 12px", fontSize:"0.85rem", color:"#a78bfa" }}>📋 Column requirements</h4>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[
                  { name:"Target column",    desc:"Binary outcome (0/1 or hired/not_hired)", color:"#a78bfa" },
                  { name:"Sensitive column", desc:"Demographic group (gender, race, age…)",  color:"#06b6d4" },
                ].map(row => (
                  <div key={row.name} style={{
                    padding:"10px 12px",
                    background:"rgba(255,255,255,0.03)",
                    border:"1px solid rgba(255,255,255,0.07)",
                    borderRadius:8,
                  }}>
                    <p style={{ margin:"0 0 3px", fontSize:"0.78rem", fontWeight:600, color:row.color }}>{row.name}</p>
                    <p style={{ margin:0, fontSize:"0.74rem", color:"#475569" }}>{row.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding:20 }}>
              <h4 style={{ margin:"0 0 12px", fontSize:"0.85rem", color:"#10b981" }}>🔒 Privacy</h4>
              <p style={{ fontSize:"0.8rem", color:"#64748b", lineHeight:1.6, margin:0 }}>
                PII columns (name, email, SSN, phone) are automatically stripped before
                any data is sent to AI services. Your dataset never leaves your session.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}