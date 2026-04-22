import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>FairSight ⚖️</h1>
      <p>
        Detect bias in AI models before they impact real people.
      </p>

      <button onClick={() => navigate("/upload")}>
        Get Started
      </button>
    </div>
  );
};

export default Landing;