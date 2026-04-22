import { useNavigate } from "react-router-dom";
import UploadZone from "../components/UploadZone";
import { useState } from "react";

const Upload = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAuditComplete = (auditId, metrics) => {
    // store in localStorage to pass to dashboard
    localStorage.setItem("auditId", auditId);
    localStorage.setItem("metrics", JSON.stringify(metrics));

    navigate("/dashboard");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Dataset</h2>

      {loading && <p>Processing...</p>}

      <UploadZone
        onAuditComplete={(id, m) => {
          setLoading(false);
          handleAuditComplete(id, m);
        }}
      />
    </div>
  );
};

export default Upload;