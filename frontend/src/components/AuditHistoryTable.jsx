import { useEffect, useState } from "react";
import { getHistory } from "../api";

const AuditHistoryTable = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    const load = async () => {
      const res = await getHistory();
      setData(res.data || {});
    };

    load();
  }, []);

  return (
    <div>
      <h3>Audit History</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Audit ID</th>
            <th>Disparate Impact</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([id, val]) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{val.metrics.disparate_impact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditHistoryTable;