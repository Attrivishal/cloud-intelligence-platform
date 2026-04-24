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

export default function ForecastPanel({ data }: { data: any }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[420px] flex flex-col">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-sm text-slate-400">
          AI Cost Forecast (Next {data.forecast_days} Days)
        </h2>

        <div className="flex items-center gap-3 mt-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400">
            Model: {data.model}
          </span>

          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
            Live Prediction
          </span>
        </div>
      </div>

      {/* CHART */}
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.forecast}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              stroke="#64748b"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              stroke="#64748b"
              tick={{ fontSize: 12 }}
              tickFormatter={(val) => `$${val}`}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "8px"
              }}
              formatter={(value: number | undefined) => `$${value ?? 0}`}
            />

            <Line
              type="monotone"
              dataKey="predicted_cost"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
