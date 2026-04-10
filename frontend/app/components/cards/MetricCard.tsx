"use client";

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  color = "text-white",
}: Props) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-xl p-5 hover:border-[#4A6FA5]/40 transition-all">
      <p className="text-gray-400 text-sm">{title}</p>

      <h2 className={`text-3xl font-bold mt-2 ${color}`}>
        {value}
      </h2>

      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
