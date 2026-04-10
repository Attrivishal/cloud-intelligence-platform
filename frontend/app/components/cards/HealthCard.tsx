"use client";

interface Props {
  grade: string;
  score: number;
}

export default function HealthCard({ grade, score }: Props) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
      <p className="text-gray-400 text-sm">Cloud Health</p>

      <h2 className="text-4xl font-bold text-white mt-2">
        {grade}
      </h2>

      <p className="text-xs text-gray-500 mt-1">
        Score {score}
      </p>
    </div>
  );
}
