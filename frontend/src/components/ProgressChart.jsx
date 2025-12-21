import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ProgressChart = ({ data }) => {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="module" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
