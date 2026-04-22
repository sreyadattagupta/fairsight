const MetricCard = ({ title, value }) => {
  return (
    <div style={{ border: "1px solid #ddd", padding: "10px", margin: "5px" }}>
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
};

export default MetricCard;