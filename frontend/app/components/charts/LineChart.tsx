"use client";

import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { name: string; value: number }[];
}

export default function LineChart({ data }: Props) {
  return (
    <div className="w-full h-[350px]"> {/* ✅ FIXED HEIGHT */}
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis dataKey="name" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4ade80"
            strokeWidth={3}
            dot={false}
          />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}
