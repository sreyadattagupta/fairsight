import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, X, CheckCircle, Loader } from "lucide-react";
import { getColumns, auditDataset } from "../api";

export default function UploadZone({ onAuditComplete }) {
  const [file,      setFile]      = useState(null);
  const [columns,   setColumns]   = useState([]);
  const [target,    setTarget]    = useState("");
  const [sensitive, setSensitive] = useState("");
  const [loading,   setLoading]   = useState(false);
  const [stage,     setStage]     = useState("idle"); // idle | cols | auditing | done | error
  const [error,     setError]     = useState("");

  /* ── Drop handler ─────────────────────────────────────── */
  const onDrop = useCallback(async (accepted) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setError("");
    setStage("cols");
    setLoading(true);

    const res = await getColumns(f);
    setLoading(false);

    if (res.error) {
      setError(res.error);
      setStage("error");
      return;
    }
    setColumns(res.columns || []);
    // Auto-select sensible defaults if present
    const cols = res.columns || [];
    const guessTarget    = cols.find(c => ["selected","hired","approved","outcome","label","target"].includes(c.toLowerCase())) || cols[cols.length-1] || "";
    const guessSensitive = cols.find(c => ["gender","sex","race","ethnicity","age","religion"].includes(c.toLowerCase())) || cols[0] || "";
    setTarget(guessTarget);
    setSensitive(guessSensitive);
    setStage("ready");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
  });

  /* ── Run audit ────────────────────────────────────────── */
  const handleAudit = async () => {
    if (!file || !target || !sensitive) return;
    if (target === sensitive) { setError("Target and sensitive columns must differ"); return; }
    setLoading(true);
    setStage("auditing");
    setError("");

    const res = await auditDataset(file, target, sensitive);
    setLoading(false);

    if (res.error) {
      setError(res.error);
      setStage("error");
      return;
    }
    setStage("done");
    onAuditComplete(res.audit_id, res.metrics);
  };

  /* ── Reset ────────────────────────────────────────────── */
  const reset = () => {
    setFile(null); setColumns([]); setTarget(""); setSensitive("");
    setStage("idle"); setError(""); setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        style={{
          ...dropStyle,
          borderColor: isDragActive ? "#a78bfa" : file ? "#10b981" : "rgba(255,255,255,0.12)",
          background:  isDragActive ? "rgba(124,58,237,0.08)" : file ? "rgba(16,185,129,0.05)" : "rgba(255,255,255,0.02)",
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        {file ? (
          <div style={{ textAlign: "center" }}>
            <CheckCircle size={36} color="#10b981" style={{ marginBottom: 8 }} />
            <p style={{ color: "#10b981", fontWeight: 600 }}>{file.name}</p>
            <p style={{ fontSize: "0.78rem", color: "#64748b", marginTop:4 }}>
              {(file.size / 1024).toFixed(1)} KB — click to replace
            </p>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <UploadCloud size={40} color="#7c3aed" style={{ marginBottom: 12 }} />
            <p style={{ fontWeight: 600, color: "#f1f5f9" }}>
              {isDragActive ? "Drop it here!" : "Drag & drop your CSV"}
            </p>
            <p style={{ fontSize:"0.8rem", color:"#64748b", marginTop:4 }}>
              or <span style={{ color:"#a78bfa" }}>browse files</span> — .csv only
            </p>
          </div>
        )}
      </div>

      {/* Column selectors — shown after file parsed */}
      {(stage === "ready" || stage === "auditing" || stage === "done") && columns.length > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }} className="anim-fadeup">

          <div className="form-group">
            <label className="form-label">
              <FileText size={13} style={{ marginRight:4, verticalAlign:"middle" }}/>
              Target Column <span style={{ color:"#ef4444" }}>*</span>
            </label>
            <select
              className="input"
              value={target}
              onChange={e => setTarget(e.target.value)}
            >
              <option value="">— select column —</option>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              <FileText size={13} style={{ marginRight:4, verticalAlign:"middle" }}/>
              Sensitive Attribute <span style={{ color:"#ef4444" }}>*</span>
            </label>
            <select
              className="input"
              value={sensitive}
              onChange={e => setSensitive(e.target.value)}
            >
              <option value="">— select column —</option>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert alert-error anim-fadein">
          <X size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Action row */}
      <div style={{ display:"flex", gap:12, alignItems:"center" }}>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleAudit}
          disabled={loading || !file || !target || !sensitive}
          style={{ flex:1 }}
          id="run-audit-btn"
        >
          {loading ? (
            <><span className="spinner" /> {stage === "cols" ? "Reading file…" : "Running audit…"}</>
          ) : (
            <>⚖️ Run Bias Audit</>
          )}
        </button>

        {file && (
          <button className="btn btn-secondary" onClick={reset} title="Reset">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Hint */}
      <p style={{ fontSize:"0.76rem", color:"#475569", textAlign:"center" }}>
        💡 Try the sample file: <code style={{ color:"#a78bfa" }}>sample_data/hiring_sample.csv</code>
        &nbsp;(target: <code style={{ color:"#06b6d4" }}>selected</code>, sensitive: <code style={{ color:"#06b6d4" }}>gender</code>)
      </p>

    </div>
  );
}

const dropStyle = {
  border: "2px dashed",
  borderRadius: 16,
  padding: "48px 32px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.25s ease",
  minHeight: 180,
};