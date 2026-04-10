"use client";

export default function OptimizationTable({ data }: { data: any[] }) {
  return (
    <div className="bg-slate-900/70 backdrop-blur-md  border border-slate-800 rounded-2xl p-6 h-full flex flex-col shadow-lg">

      <h2 className="text-sm text-slate-400 mb-6">
        Compute Optimization Engine
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          {/* HEADER */}
          <thead>
            <tr className="text-slate-500 border-b border-slate-800">
              <th className="text-left py-3 pr-4">Instance ID</th>
              <th className="text-left py-3 pr-4">Type</th>
              <th className="text-left py-3 pr-4">CPU</th>
              <th className="text-left py-3 pr-4">Status</th>
              <th className="text-left py-3 pr-4">Recommendation</th>
              <th className="text-right py-3">Est. Savings</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {data.map((instance, index) => (
              <tr
                key={index}
                className="border-b border-slate-800 hover:bg-slate-800/40 transition"
              >
                {/* INSTANCE ID */}
                <td className="py-4 pr-4 text-slate-300 font-mono">
                  {instance.instance_id}
                </td>

                {/* TYPE */}
                <td className="py-4 pr-4 text-slate-300">
                  {instance.instance_type}
                </td>

                {/* CPU BAR */}
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          instance.average_cpu < 20
                            ? "bg-orange-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${instance.average_cpu}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">
                      {instance.average_cpu}%
                    </span>
                  </div>
                </td>

                {/* STATUS BADGE */}
                <td className="py-4 pr-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      instance.status === "Healthy"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : instance.status === "Underutilized"
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {instance.status}
                  </span>
                </td>

                {/* RECOMMENDATION */}
                <td className="py-4 pr-4 text-slate-400">
                  {instance.recommendation}
                </td>

                {/* SAVINGS */}
                <td className="py-4 text-right text-emerald-400 font-medium">
                  ${instance.estimated_monthly_savings}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}
