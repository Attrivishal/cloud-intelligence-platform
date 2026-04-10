"use client";

import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BarChart({ data, xKey, yKey }: any) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReBarChart data={data}>
        <XAxis dataKey={xKey} stroke="#94A3B8" />
        <YAxis stroke="#94A3B8" />
        <Tooltip />
        <Bar dataKey={yKey} fill="#4A6FA5" />
      </ReBarChart>
    </ResponsiveContainer>
  );
}
