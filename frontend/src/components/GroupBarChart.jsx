import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const GroupBarChart = ({ metrics }) => {
  if (!metrics) return null;

  const data = [
    { name: metrics.group_1, value: metrics.p_group_1 },
    { name: metrics.group_2, value: metrics.p_group_2 },
  ];

  return (
    <div>
      <h3>Group Comparison</h3>
      <BarChart width={300} height={250} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>
    </div>
  );
};

export default GroupBarChart;