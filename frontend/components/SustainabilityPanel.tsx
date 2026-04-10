"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface Props {
  data: {
    total_running_instances: number;
    estimated_daily_carbon_kg: number;
    sustainability_score: number;
    rating: string;
    recommendation: string;
  };
}

export default function SustainabilityPanel({ data }: Props) {
  const score = Math.round(data.sustainability_score);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">

      {/* Glow Background */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/10 blur-3xl rounded-full" />

      <div className="flex items-center gap-3 mb-6">
        <Leaf className="text-emerald-400" size={20} />
        <h2 className="text-lg font-semibold text-white">
          Sustainability / Carbon Intelligence
        </h2>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 gap-6 mb-8">

        <div>
          <p className="text-slate-400 text-sm">Running Instances</p>
          <p className="text-2xl font-bold text-white">
            {data.total_running_instances}
          </p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">Daily Carbon</p>
          <p className="text-2xl font-bold text-emerald-400">
            {data.estimated_daily_carbon_kg.toFixed(6)} kg
          </p>
        </div>

      </div>

      {/* Circular Score Ring */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-40 h-40">

          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="8"
              fill="none"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="#10b981"
              strokeWidth="8"
              fill="none"
              strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              animate={{ strokeDashoffset: 283 - (283 * score) / 100 }}
              transition={{ duration: 1.2 }}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {score}%
            </span>
            <span className="text-xs text-slate-400">
              Sustainability Score
            </span>
          </div>

        </div>
      </div>

      {/* Rating Badge */}
      <div className="flex justify-center mb-6">
        <span className="px-4 py-1 text-sm rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {data.rating}
        </span>
      </div>

      {/* Recommendation */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm text-slate-300">
        {data.recommendation}
      </div>
              
             {/* Carbon Projection Chart */}
<div className="mt-8 h-60">
  <h3 className="text-sm text-slate-400 mb-4">
    Carbon Reduction Projection
  </h3>

  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      data={[
        {
          name: "Current",
          carbon: data.estimated_daily_carbon_kg
        },
        {
          name: "Optimized",
          carbon: data.estimated_daily_carbon_kg * 0.8
        }
      ]}
    >
      <XAxis dataKey="name" stroke="#64748b" />
      <YAxis stroke="#64748b" />
      <Tooltip />
      <Bar
        dataKey="carbon"
        fill="#10b981"
        radius={[8, 8, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
</div>
    </div>
  );
}
