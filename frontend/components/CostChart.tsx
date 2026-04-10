"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

type Props = {
  data: {
    date: string;
    amount: number;
  }[];
};

export default function CostChart({ data }: Props) {
  const formatted = data.map((item) => ({
    ...item,
    amount: Math.abs(item.amount),
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl h-[350px]">
      <h2 className="text-sm text-slate-400 mb-6">Cost Trend (Last 30 Days)</h2>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#64748b", fontSize: 12 }}
          />
          <YAxis
            tick={{ fill: "#64748b", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: "8px",
              color: "#fff"
            }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
