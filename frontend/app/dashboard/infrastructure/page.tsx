"use client";

import { useEffect, useState } from "react";
import { fetchInfrastructure } from "../../lib/api";
import {
  Server,
  HardDrive,
  Cloud,
  Cpu,
  Activity,
  Zap,
  AlertTriangle,
  Shield,
  Sparkles,
  Database,
  Clock,
  DollarSign,
  Layers,
  RefreshCw,
} from "lucide-react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function InfrastructurePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchInfrastructure()
      .then((res) => {
        console.log("INFRA DATA:", res);
        setData(res);
        setLastUpdated(new Date());
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const refreshData = () => {
    setLoading(true);
    fetchInfrastructure()
      .then((res) => {
        setData(res);
        setLastUpdated(new Date());
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  const calculateTotalCost = () => {
    if (!data) return 0;
    const ec2Cost = data.ec2.reduce((sum: number, i: any) => sum + (i.cost || 0), 0);
    const s3Cost = data.s3.reduce((sum: number, b: any) => sum + (b.cost || 0), 0);
    const rdsCost = data.rds.reduce((sum: number, db: any) => sum + (db.cost || 0), 0);
    const lambdaCost = data.lambda.reduce((sum: number, fn: any) => sum + (fn.cost || 0), 0);
    return ec2Cost + s3Cost + rdsCost + lambdaCost;
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="relative animate-fade-in">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-blue-500 animate-spin"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse"></div>
          </div>
          <p className="mt-4 text-gray-400">Loading infrastructure...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  /* ================= DATA ================= */

  const { summary, ec2, s3, rds, lambda, insights } = data;
  const totalCost = calculateTotalCost();

  /* ================= CHART DATA ================= */

  const statusData = {
    labels: ["Running", "Stopped"],
    datasets: [
      {
        data: [summary.running_instances, summary.stopped_instances],
        backgroundColor: ["#10B981", "#EF4444"],
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  };

  const serviceData = {
    labels: ["EC2", "S3", "RDS", "Lambda"],
    datasets: [
      {
        label: "Count",
        data: [ec2.length, s3.length, rds.length, lambda.length],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#A855F7"],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: "#94A3B8",
          font: { size: 12, weight: 500 },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: "#1E293B",
        titleColor: "#fff",
        bodyColor: "#94A3B8",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        grid: { color: "#1E293B" },
        ticks: { color: "#64748B" },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#64748B" },
      },
    },
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233B82F6' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}
        />
        <div className="absolute top-20 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header with Live Pulse */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 animate-fade-in">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Infrastructure
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-0.5 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                <p className="text-gray-500 text-sm">
                  Multi-service cloud infrastructure overview
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Live Pulse Indicator */}
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 hover:border-blue-500/40 transition-all duration-300">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm text-green-400 font-medium">Live</span>
              </div>
              
              {/* Last Updated */}
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 hover:border-blue-500/40 transition-all duration-300">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  {Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000)}s ago
                </span>
              </div>
              
              {/* Refresh Button */}
              <button 
                onClick={refreshData}
                className="p-2 bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Total Cost Summary - NEW */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Infrastructure Cost</p>
                  <p className="text-3xl font-bold text-white">${totalCost.toFixed(2)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Across all services</p>
                <p className="text-xs text-green-400 mt-1">● Active</p>
              </div>
            </div>
          </div>

          {/* KPI CARDS with hover effects */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
            <KPICard
              title="Total Instances"
              value={summary.total_instances}
              icon={Server}
              trend="+2"
              trendUp={true}
              color="blue"
            />
            <KPICard
              title="Running"
              value={summary.running_instances}
              icon={Zap}
              trend="+1"
              trendUp={true}
              color="green"
            />
            <KPICard
              title="Stopped"
              value={summary.stopped_instances}
              icon={Activity}
              trend="-1"
              trendUp={false}
              color="red"
            />
            <KPICard
              title="Efficiency"
              value={`${summary.efficiency}/100`}
              icon={Layers}
              badge={summary.efficiency >= 80 ? "Good" : "Needs attention"}
              color="purple"
            />
          </div>

          {/* CHARTS with glass effect */}
          <div className="grid lg:grid-cols-2 gap-6 animate-fade-in">
            <ChartCard
              title="Instance Status"
              icon={Activity}
              color="blue"
              action="Running vs Stopped"
            >
              <div className="h-[250px] flex items-center justify-center">
                {(summary.running_instances + summary.stopped_instances) > 0 ? (
                  <Pie data={statusData} options={chartOptions} />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Activity className="w-10 h-10 mb-2 opacity-20" />
                    <p className="text-sm">No instances</p>
                  </div>
                )}
              </div>
            </ChartCard>

            <ChartCard
              title="Service Distribution"
              icon={Layers}
              color="purple"
              action="By resource count"
            >
              <div className="h-[250px]">
                <Bar data={serviceData} options={barOptions} />
              </div>
            </ChartCard>
          </div>

          {/* EC2 Instances with empty state */}
          <ResourceSection
            title="EC2 Instances"
            icon={Server}
            iconColor="text-blue-400"
            count={ec2.length}
          >
            {ec2.length === 0 ? (
              <EmptyState message="No EC2 instances found" />
            ) : (
              ec2.map((i: any) => (
                <EC2Row
                  key={i.id}
                  id={i.id}
                  type={i.type}
                  state={i.state}
                  cpu={i.cpu}
                  cost={i.cost}
                />
              ))
            )}
          </ResourceSection>

          {/* S3 Buckets with empty state */}
          <ResourceSection
            title="S3 Buckets"
            icon={HardDrive}
            iconColor="text-green-400"
            count={s3.length}
          >
            {s3.length === 0 ? (
              <EmptyState message="No S3 buckets found" />
            ) : (
              s3.map((b: any) => (
                <S3Row
                  key={b.name}
                  name={b.name}
                  objects={b.objects}
                  size={b.size}
                  cost={b.cost}
                />
              ))
            )}
          </ResourceSection>

          {/* RDS Databases with empty state */}
          <ResourceSection
            title="RDS Databases"
            icon={Database}
            iconColor="text-yellow-400"
            count={rds.length}
          >
            {rds.length === 0 ? (
              <EmptyState message="No RDS databases found" />
            ) : (
              rds.map((db: any) => (
                <RDSRow
                  key={db.id}
                  id={db.id}
                  engine={db.engine}
                  storage={db.storage}
                  cost={db.cost}
                />
              ))
            )}
          </ResourceSection>

          {/* Lambda Functions with empty state */}
          <ResourceSection
            title="Lambda Functions"
            icon={Cpu}
            iconColor="text-purple-400"
            count={lambda.length}
          >
            {lambda.length === 0 ? (
              <EmptyState message="No Lambda functions found" />
            ) : (
              lambda.map((fn: any) => (
                <LambdaRow
                  key={fn.name}
                  name={fn.name}
                  runtime={fn.runtime}
                  memory={fn.memory}
                  risk={fn.risk}
                />
              ))
            )}
          </ResourceSection>

          {/* AI INSIGHTS */}
          <InsightsSection insights={insights} />
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

/* ================= PREMIUM COMPONENTS ================= */

function KPICard({ title, value, icon: Icon, trend, trendUp, badge, color }: any) {
  const colors = {
    blue: 'from-blue-500 to-purple-600',
    green: 'from-green-500 to-emerald-600',
    red: 'from-red-500 to-pink-600',
    purple: 'from-purple-500 to-pink-500',
  } as const;

  const iconColors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
  } as const;

  const colorClass = colors[color as keyof typeof colors];
  const iconClass = iconColors[color as keyof typeof iconColors];

  return (
    <div className="group relative animate-fade-in">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${colorClass} rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500`}></div>
      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl p-5 border border-slate-800 hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-500 text-sm group-hover:text-gray-400 transition-colors">{title}</p>
          <Icon className={`w-4 h-4 text-gray-600 group-hover:${iconClass} transition-colors`} />
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold text-white">{value}</p>
          {badge && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              badge === "Good" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
            }`}>
              {badge}
            </span>
          )}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs mt-2 ${
            trendUp ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {trendUp ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            <span>{trend} from last month</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ChartCard({ title, icon: Icon, color, action, children }: any) {
  const colors = {
    blue: 'from-blue-500 to-purple-600',
    purple: 'from-purple-500 to-pink-600',
  } as const;

  const iconColors = {
    blue: 'text-blue-400',
    purple: 'text-purple-400',
  } as const;

  const colorClass = colors[color as keyof typeof colors];
  const iconClass = iconColors[color as keyof typeof iconColors];

  return (
    <div className="group relative animate-fade-in">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${colorClass} rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000`}></div>
      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-${color}-500/10 rounded-xl`}>
              <Icon className={`w-5 h-5 ${iconClass}`} />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <span className="text-xs text-gray-500 px-3 py-1 bg-slate-800 rounded-full">{action}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function ResourceSection({ title, icon: Icon, iconColor, count, children }: any) {
  return (
    <div className="group relative animate-fade-in">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-xl">
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <span className="text-sm text-gray-400">{count} resources</span>
        </div>
        <div className="space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
}

function EC2Row({ id, type, state, cpu, cost }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group/item border border-transparent hover:border-blue-500/20">
      <div className="flex items-center gap-3">
        <Server className="w-4 h-4 text-blue-400" />
        <div>
          <p className="font-medium text-white group-hover/item:text-blue-400 transition-colors">{id}</p>
          <p className="text-xs text-gray-500">{type}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-xs px-2 py-1 rounded-full ${
          state === "running"
            ? "bg-green-500/20 text-green-400"
            : "bg-red-500/20 text-red-400"
        }`}>
          {state}
        </span>
        <span className="text-sm text-gray-300">{cpu}% CPU</span>
        <span className="text-sm font-medium text-white">${cost}</span>
      </div>
    </div>
  );
}

function S3Row({ name, objects, size, cost }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group/item border border-transparent hover:border-green-500/20">
      <div className="flex items-center gap-3">
        <HardDrive className="w-4 h-4 text-green-400" />
        <div>
          <p className="font-medium text-white group-hover/item:text-green-400 transition-colors">{name}</p>
          <p className="text-xs text-gray-500">{objects} objects</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">{(size / 1024 / 1024).toFixed(2)} MB</span>
        <span className="text-sm font-medium text-white">${cost}</span>
      </div>
    </div>
  );
}

function RDSRow({ id, engine, storage, cost }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group/item border border-transparent hover:border-yellow-500/20">
      <div className="flex items-center gap-3">
        <Database className="w-4 h-4 text-yellow-400" />
        <div>
          <p className="font-medium text-white group-hover/item:text-yellow-400 transition-colors">{id}</p>
          <p className="text-xs text-gray-500">{engine}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">{storage} GB</span>
        <span className="text-sm font-medium text-white">${cost}</span>
      </div>
    </div>
  );
}

function LambdaRow({ name, runtime, memory, risk }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group/item border border-transparent hover:border-purple-500/20">
      <div className="flex items-center gap-3">
        <Cpu className="w-4 h-4 text-purple-400" />
        <div>
          <p className="font-medium text-white group-hover/item:text-purple-400 transition-colors">{name}</p>
          <p className="text-xs text-gray-500">{runtime}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">{memory} MB</span>
        <span className={`text-xs px-2 py-1 rounded-full ${
          risk && risk.includes("UNUSED")
            ? "bg-yellow-500/20 text-yellow-400"
            : "bg-green-500/20 text-green-400"
        }`}>
          {risk || "Active"}
        </span>
      </div>
    </div>
  );
}

function InsightsSection({ insights }: any) {
  if (!insights || insights.length === 0) {
    return (
      <div className="group relative animate-fade-in">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">AI Insights</h3>
              <p className="text-emerald-400 text-sm mt-1">All systems optimal</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative animate-fade-in">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/10 rounded-xl">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">AI Insights</h3>
        </div>
        <div className="space-y-3">
          {insights.map((ins: string, i: number) => (
            <div key={i} className="flex items-start gap-2 p-3 bg-slate-800/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-300">{ins}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}

// Helper components for icons
function ArrowUpRight({ className }: { className?: string }) {
  return <ArrowUpRightIcon className={className} />;
}

function ArrowDownRight({ className }: { className?: string }) {
  return <ArrowDownRightIcon className={className} />;
}

// Note: You need to import these at the top
import { ArrowUpRight as ArrowUpRightIcon, ArrowDownRight as ArrowDownRightIcon } from "lucide-react";
