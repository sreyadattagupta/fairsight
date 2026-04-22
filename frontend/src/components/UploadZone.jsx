import { useState } from "react";
import { auditDataset } from "../api";

const UploadZone = ({ onAuditComplete }) => {
  const [file, setFile] = useState(null);
  const [target, setTarget] = useState("selected");
  const [sensitive, setSensitive] = useState("gender");

  const handleUpload = async () => {
    if (!file) return alert("Upload a file");

    const res = await auditDataset(file, target, sensitive);

    if (!res.error) {
      onAuditComplete(res.audit_id, res.metrics);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <input
        placeholder="Target Column"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      />

      <input
        placeholder="Sensitive Column"
        value={sensitive}
        onChange={(e) => setSensitive(e.target.value)}
      />

      <button onClick={handleUpload}>Run Audit</button>
    </div>
  );
};

export default UploadZone;