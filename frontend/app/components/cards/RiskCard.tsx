"use client";

interface Props {
  score: number;
  level: string;
  prediction: string;
}

export default function RiskCard({ score, level, prediction }: Props) {
  const color =
    score > 70
      ? "text-red-500"
      : score > 40
      ? "text-yellow-400"
      : "text-emerald-400";

  return (
    <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
      <p className="text-gray-400 text-sm">Risk Score</p>

      <h2 className={`text-4xl font-bold mt-2 ${color}`}>
        {score}
      </h2>

      <p className="text-sm text-gray-400 mt-1">
        {level}
      </p>

      <div className="mt-4 text-xs text-gray-500 bg-white/5 p-3 rounded-lg">
        {prediction}
      </div>
    </div>
  );
}
