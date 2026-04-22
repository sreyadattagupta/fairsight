import { useEffect, useState } from "react";
import { getFixSuggestions } from "../api";

const FixPreview = ({ auditId }) => {
  const [fixes, setFixes] = useState([]);

  useEffect(() => {
    if (!auditId) return;

    const load = async () => {
      const res = await getFixSuggestions(auditId);
      setFixes(res.suggestions || []);
    };

    load();
  }, [auditId]);

  return (
    <div>
      <h3>Fix Suggestions</h3>
      <ul>
        {fixes.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
    </div>
  );
};

export default FixPreview;