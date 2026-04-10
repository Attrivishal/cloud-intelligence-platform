"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function CPUChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="date" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="average_cpu"
          stroke="#22c55e"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
