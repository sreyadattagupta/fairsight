const BiasHeatmap = ({ metrics }) => {
  if (!metrics) return null;

  const disparity = metrics.demographic_parity;

  const getColor = () => {
    if (disparity > 0.3) return "red";
    if (disparity > 0.1) return "orange";
    return "green";
  };

  return (
    <div>
      <h3>Bias Heatmap</h3>
      <div
        style={{
          width: "200px",
          height: "100px",
          background: getColor(),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        {disparity}
      </div>
    </div>
  );
};

export default BiasHeatmap;