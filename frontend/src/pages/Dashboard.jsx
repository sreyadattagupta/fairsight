import { useEffect, useState } from "react";
import BiasHeatmap from "../components/BiasHeatmap";
import GroupBarChart from "../components/GroupBarChart";
import MetricCard from "../components/MetricCard";
import AIExplanationPanel from "../components/AIExplanationPanel";
import FixPreview from "../components/FixPreview";

const Dashboard = () => {
  const [auditId, setAuditId] = useState(null);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem("auditId");
    const storedMetrics = localStorage.getItem("metrics");

    if (storedId && storedMetrics) {
      setAuditId(storedId);
      setMetrics(JSON.parse(storedMetrics));
    }
  }, []);

  if (!metrics) {
    return <p>No audit data found. Please upload dataset first.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bias Dashboard</h2>

      {/* Metrics */}
      <div style={{ display: "flex", gap: "10px" }}>
        <MetricCard
          title="Demographic Parity"
          value={metrics.demographic_parity}
        />
        <MetricCard
          title="Disparate Impact"
          value={metrics.disparate_impact}
        />
      </div>

      {/* Charts */}
      <BiasHeatmap metrics={metrics} />
      <GroupBarChart metrics={metrics} />

      {/* AI */}
      <AIExplanationPanel auditId={auditId} />
      <FixPreview auditId={auditId} />
    </div>
  );
};

export default Dashboard;