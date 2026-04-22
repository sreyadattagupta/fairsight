import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, BarChart3, Sparkles, Upload } from "lucide-react";

const FEATURES = [
  {
    icon: <Upload size={22} color="#a78bfa" />,
    title: "Upload & Detect",
    desc:  "Drop any CSV dataset or ML prediction output. FairSight instantly parses your data and identifies demographic groups.",
    bg:    "rgba(124,58,237,0.1)",
    border:"rgba(124,58,237,0.25)",
  },
  {
    icon: <BarChart3 size={22} color="#06b6d4" />,
    title: "Visualize Disparities",
    desc:  "Interactive heatmaps and bar charts reveal exactly which groups are disadvantaged and by how much.",
    bg:    "rgba(6,182,212,0.08)",
    border:"rgba(6,182,212,0.25)",
  },
  {
    icon: <Sparkles size={22} color="#f59e0b" />,
    title: "AI-Powered Fixes",
    desc:  "Gemini AI explains the bias in plain English and generates specific, actionable remediation steps.",
    bg:    "rgba(245,158,11,0.08)",
    border:"rgba(245,158,11,0.25)",
  },
  {
    icon: <ShieldCheck size={22} color="#10b981" />,
    title: "Audit Trail",
    desc:  "Every audit is logged with timestamps and severity scores so you can track fairness over time.",
    bg:    "rgba(16,185,129,0.08)",
    border:"rgba(16,185,129,0.25)",
  },
];

const STATS = [
  { label:"Bias Metrics",   value:"6+" },
  { label:"Group Support",  value:"∞"  },
  { label:"AI Powered",     value:"✓"  },
  { label:"PII Safe",       value:"🔒" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight:"calc(100vh - 64px)", overflow:"hidden", position:"relative" }}>

      {/* Background glows */}
      <div style={{
        position:"fixed", width:600, height:600, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
        top:-200, left:-200, pointerEvents:"none", zIndex:0,
      }} />
      <div style={{
        position:"fixed", width:500, height:500, borderRadius:"50%",
        background:"radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
        bottom:-100, right:-100, pointerEvents:"none", zIndex:0,
      }} />

      <div className="container" style={{ position:"relative", zIndex:1, paddingTop:80, paddingBottom:100 }}>

        {/* ── Hero ── */}
        <div style={{ textAlign:"center", marginBottom:80 }} className="anim-fadeup">

          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            padding:"6px 16px", borderRadius:99,
            background:"rgba(124,58,237,0.12)",
            border:"1px solid rgba(124,58,237,0.3)",
            fontSize:"0.78rem", fontWeight:600, color:"#a78bfa",
            marginBottom:28,
          }}>
            ⚖️ AI Bias Detection & Remediation
          </div>

          <h1 style={{ marginBottom:20 }}>
            Detect Hidden Bias in{" "}
            <span className="gradient-text">AI Models</span>
            <br />Before They Harm Real People
          </h1>

          <p style={{ fontSize:"1.1rem", maxWidth:620, margin:"0 auto 36px", color:"#94a3b8", lineHeight:1.7 }}>
            FairSight lets organizations upload datasets or ML prediction outputs,
            automatically detect disparities across demographic groups, and receive
            AI-powered remediation — all in seconds.
          </p>

          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button
              className="btn btn-primary btn-lg"
              id="get-started-btn"
              onClick={() => navigate("/upload")}
            >
              Get Started Free
              <ArrowRight size={18} />
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => navigate("/history")}
            >
              View Audit History
            </button>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(4,1fr)",
          gap:1,
          background:"rgba(255,255,255,0.06)",
          border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:16,
          overflow:"hidden",
          marginBottom:80,
        }} className="anim-fadeup anim-delay-1">
          {STATS.map(s => (
            <div key={s.label} style={{
              padding:"24px 20px",
              textAlign:"center",
              background:"rgba(10,11,15,0.8)",
            }}>
              <div style={{ fontSize:"1.8rem", fontWeight:800, color:"#f1f5f9", lineHeight:1 }}>
                {s.value}
              </div>
              <div style={{ fontSize:"0.75rem", color:"#64748b", marginTop:6, textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:600 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Features ── */}
        <div style={{ marginBottom:80 }}>
          <h2 style={{ textAlign:"center", marginBottom:12 }}>Everything you need to audit AI fairness</h2>
          <p style={{ textAlign:"center", color:"#64748b", marginBottom:48, fontSize:"0.95rem" }}>
            From raw data to actionable insights in one workflow
          </p>

          <div className="grid-2 anim-fadeup anim-delay-2">
            {FEATURES.map(f => (
              <div key={f.title} className="card" style={{ padding:28, transition:"transform 0.25s ease" }}
                onMouseEnter={e => e.currentTarget.style.transform="translateY(-4px)"}
                onMouseLeave={e => e.currentTarget.style.transform="translateY(0)"}
              >
                <div style={{
                  width:48, height:48, borderRadius:12,
                  background:f.bg, border:`1px solid ${f.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  marginBottom:16,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ marginBottom:8 }}>{f.title}</h3>
                <p style={{ fontSize:"0.88rem", lineHeight:1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA banner ── */}
        <div style={{
          background:"linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))",
          border:"1px solid rgba(124,58,237,0.3)",
          borderRadius:20,
          padding:"48px 40px",
          textAlign:"center",
        }} className="anim-fadeup anim-delay-3">
          <h2 style={{ marginBottom:12 }}>Ready to audit your model?</h2>
          <p style={{ color:"#94a3b8", marginBottom:28, maxWidth:480, margin:"0 auto 28px" }}>
            Upload any CSV — hiring decisions, loan approvals, medical triage — and get a full bias report in &lt;10 seconds.
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/upload")}
            id="cta-btn"
          >
            Start Free Audit
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}