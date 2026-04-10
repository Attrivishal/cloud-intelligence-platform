type Props = {
  totalCost: number;
  optimizationScore: number;
  runningInstances: number;
  sustainabilityScore: number;
};

export default function KPICards({
  totalCost,
  optimizationScore,
  runningInstances,
  sustainabilityScore,
}: Props) {
  const cardStyle =
    "bg-slate-900 border border-slate-800 p-5 rounded-xl";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      <div className={cardStyle}>
        <p className="text-xs text-slate-400">Total Cost</p>
        <h2 className="text-2xl font-semibold mt-2">
          ${Math.abs(totalCost).toFixed(6)}
        </h2>
      </div>

      <div className={cardStyle}>
        <p className="text-xs text-slate-400">Optimization Score</p>
        <h2 className="text-2xl font-semibold mt-2 text-emerald-500">
          {optimizationScore}%
        </h2>
      </div>

      <div className={cardStyle}>
        <p className="text-xs text-slate-400">Running Instances</p>
        <h2 className="text-2xl font-semibold mt-2">
          {runningInstances}
        </h2>
      </div>

      <div className={cardStyle}>
        <p className="text-xs text-slate-400">Sustainability Score</p>
        <h2 className="text-2xl font-semibold mt-2 text-green-400">
          {sustainabilityScore}
        </h2>
      </div>

    </div>
  );
}
