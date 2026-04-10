"use client";

import {
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  data: { date: string; cost: number }[];
}

export default function AreaChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReAreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="date" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="cost"
          stroke="#4A6FA5"
          fill="#4A6FA5"
          fillOpacity={0.3}
        />
      </ReAreaChart>
    </ResponsiveContainer>
  );
}
