import { useEffect, useState } from "react";
import { getExplanation } from "../api";

const AIExplanationPanel = ({ auditId }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!auditId) return;

    const load = async () => {
      const res = await getExplanation(auditId);
      setText(res.explanation);
    };

    load();
  }, [auditId]);

  return (
    <div>
      <h3>AI Explanation</h3>
      <p>{text}</p>
    </div>
  );
};

export default AIExplanationPanel;