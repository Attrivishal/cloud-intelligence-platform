"use client";

export default function OptimizationSummary({ data }: { data: any }) {
  const score = data.optimization_score ?? 0;
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (circumference * score) / 100;

  return (
    <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-2xl p-6 h-full flex flex-col shadow-lg">

      {/* Title */}
      <h2 className="text-sm font-medium text-slate-400 mb-8 tracking-wide">
        Optimization Summary
      </h2>

      {/* Center Ring */}
      <div className="flex-1 flex items-center justify-center">

        <div className="relative w-44 h-44">

          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 160 160"
          >
            {/* Background Ring */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#1e293b"
              strokeWidth="12"
              fill="transparent"
            />

            {/* Progress Ring */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#22c55e"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>

          {/* Score Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {score}%
            </span>
            <span className="text-xs text-slate-400 mt-1">
              Efficiency Score
            </span>
          </div>
        </div>

      </div>

      {/* Stats Section */}
      <div className="space-y-3 mt-8 text-sm">

        <div className="flex justify-between text-slate-400">
          <span>Total Instances</span>
          <span className="text-white">
            {data.total_instances ?? 0}
          </span>
        </div>

        <div className="flex justify-between text-slate-400">
          <span>Underutilized</span>
          <span className="text-amber-400">
            {data.underutilized ?? 0}
          </span>
        </div>

        <div className="flex justify-between text-slate-400">
          <span>Potential Monthly Savings</span>
          <span className="text-emerald-400">
            ${data.potential_savings ?? 0}
          </span>
        </div>

      </div>

      {/* Button */}
      <button className="mt-8 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition font-medium text-sm">
        Apply AI Recommendations
      </button>

    </div>
  );
}
