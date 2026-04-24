"use client";

import { useEffect, useState } from "react";
import { fetchOverview } from "@/lib/api";
import {
  DollarSign,
  Server,
  Cpu,
  HardDrive,
  Cloud,
  AlertTriangle,
  Zap,
  Activity,
  Calendar,
  TrendingUp,
  Shield,
  Leaf,
  Globe,
  Lock,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CircleDollarSign,
  Gauge,
  LineChart,
  PieChart,
  Boxes,
  Network,
  Clock,
  ArrowRight,
} from "lucide-react";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  Title,
} from "chart.js";

import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  Title
);

interface DashboardData {
  cost: any;
  infrastructure: any;
  performance: any;
  forecast: any;
  optimization: any;
  sustainability: any;
  cloud_health: any;
  s3: any;
  rds: any;
  lambda: any;
  ec2: any;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchOverview()
      .then((res) => {
        const totalCost =
          res.ec2.total_cost +
          res.s3.total_cost +
          res.rds.total_cost +
          (res.lambda?.total_cost || 0);

        const avgCpu =
          res.ec2.instances.reduce(
            (acc: number, i: any) => acc + (i.cpu || 0),
            0
          ) / (res.ec2.instances.length || 1);

        const transformed: DashboardData = {
          ec2: res.ec2,
          s3: res.s3,
          rds: res.rds,
          lambda: res.lambda,

          cost: {
            total_cost: totalCost.toFixed(4),
            average_daily_cost: (totalCost / 30).toFixed(4),
          },

          infrastructure: {
            running_instances: res.ec2.running,
            total_instances: res.ec2.total_instances,
            utilization_rate: Math.round(
              (res.ec2.running / (res.ec2.total_instances || 1)) * 100
            ),
          },

          performance: {
            average_cpu_utilization: avgCpu,
          },

          forecast: {
            forecast: [
              { date: "Day1", predicted_cost: totalCost * 0.9 },
              { date: "Day2", predicted_cost: totalCost },
              { date: "Day3", predicted_cost: totalCost * 1.1 },
            ],
          },

          optimization: {
            total_potential_monthly_savings: (totalCost * 0.2).toFixed(4),
            optimization_score: 75,
          },

          sustainability: {
            carbon: (totalCost * 0.05).toFixed(4),
          },

          cloud_health: {
            score: Math.max(
              100 -
                (res.ec2.underutilized +
                  (res.lambda?.unused_functions || 0)) *
                  10,
              50
            ),
          },
        };

        setData(transformed);
        setLastUpdated(new Date());
        setLoading(false);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatCost = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (num < 0.0001) return '< $0.0001';
    if (num < 0.001) return '$' + num.toFixed(6);
    if (num < 0.01) return '$' + num.toFixed(5);
    if (num < 0.1) return '$' + num.toFixed(4);
    return '$' + num.toFixed(2);
  };

  const formatCPU = (cpu: number) => {
    if (cpu < 0.1) return 'Idle';
    if (cpu < 1) return '~1%';
    return cpu.toFixed(1) + '%';
  };

  const getHealthReasons = () => {
    if (!data) return [];
    const reasons = [];
    if (data.ec2.underutilized > 0) {
      reasons.push(`${data.ec2.underutilized} underutilized EC2`);
    }
    if (data.lambda.unused_functions > 0) {
      reasons.push(`${data.lambda.unused_functions} unused Lambda`);
    }
    if (data.rds.low_storage > 0) {
      reasons.push(`${data.rds.low_storage} RDS low storage`);
    }
    return reasons;
  };

  const getUnderutilizedSavings = () => {
    if (!data) return 0;
    return (data.ec2.underutilized * 15).toFixed(2); // Assuming $15/month savings per underutilized instance
  };

  const getTopCostContributors = () => {
    if (!data) return [];
    return [
      { name: 'RDS', cost: parseFloat(data.rds.total_cost) },
      { name: 'EC2', cost: parseFloat(data.ec2.total_cost) },
      { name: 'Lambda', cost: parseFloat(data.lambda.total_cost) },
      { name: 'S3', cost: parseFloat(data.s3.total_cost) },
    ].sort((a, b) => b.cost - a.cost);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-blue-500 animate-spin"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse"></div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium">
              Loading dashboard
            </p>
            <p className="text-gray-600 text-sm mt-2">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-8 text-center border border-slate-800">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Failed to load dashboard</h2>
            <p className="text-gray-400 mb-6">Please try refreshing the page</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= CHART DATA ================= */
  
  const lineData = {
    labels: data.forecast.forecast.map((f: any) => f.date),
    datasets: [
      {
        label: "Cost Forecast",
        data: data.forecast.forecast.map((f: any) => f.predicted_cost),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#3B82F6",
        pointBorderColor: "#fff",
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "#2563EB",
      },
    ],
  };

  const pieData = {
    labels: ["EC2", "S3", "RDS", "Lambda"],
    datasets: [
      {
        data: [
          data.ec2.total_cost,
          data.s3.total_cost,
          data.rds.total_cost,
          data.lambda.total_cost,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.9)",
          "rgba(16, 185, 129, 0.9)",
          "rgba(245, 158, 11, 0.9)",
          "rgba(239, 68, 68, 0.9)",
        ],
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
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
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== undefined) {
              label += formatCost(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: { color: "#1E293B", display: false },
        ticks: { color: "#64748B" },
      },
      y: {
        grid: { color: "#1E293B" },
        ticks: { color: "#64748B" },
        callback: (value: any) => formatCost(value),
      },
    },
  };

  /* ================= AI INSIGHTS ================= */
  
  const insights = [];
  if (data.ec2.underutilized > 0) {
    insights.push({
      type: "warning",
      message: `You have ${data.ec2.underutilized} EC2 instances running below 20% CPU`,
      action: "→ Recommended: downgrade to t2.micro",
      impact: `💰 Estimated savings: $${getUnderutilizedSavings()}/month`,
    });
  }
  if (data.lambda.unused_functions > 0) {
    insights.push({
      type: "warning",
      message: `${data.lambda.unused_functions} unused Lambda functions found`,
      action: "→ Remove to reduce costs",
      impact: "📦 Clean up recommended",
    });
  }
  if (data.rds.low_storage > 0) {
    insights.push({
      type: "danger",
      message: `${data.rds.low_storage} RDS databases running low on storage`,
      action: "→ Increase storage capacity soon",
      impact: "⚠️ Action required within 7 days",
    });
  }

  /* ================= TOP RESOURCES ================= */
  
  const topEC2 = [...data.ec2.instances]
    .sort((a: any, b: any) => b.cost - a.cost)
    .slice(0, 4);

  const topRDS = [...data.rds.instances]
    .sort((a: any, b: any) => b.cost - a.cost)
    .slice(0, 4);

  const topCostContributors = getTopCostContributors();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Premium background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233B82F6' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}
        />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Premium Header with Last Updated */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div className="group">
              <h1 className="text-4xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                  Cloud Intelligence
                </span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-0.5 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                <p className="text-gray-500 text-sm">Real-time infrastructure overview</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">AWS Connected</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  Updated {Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000)}s ago
                </span>
              </div>
              <button className="p-3 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-all group">
                <Sparkles className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </button>
            </div>
          </div>

          {/* Health Score Card - Premium with Reasons */}
          <div className="mb-8 group">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        Cloud Health Score
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-bold text-white">{data.cloud_health.score}</span>
                      <span className="text-gray-500">/100</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {data.cloud_health.score >= 80 ? (
                        <>
                          <div className="p-1 bg-green-500/20 rounded-lg">
                            <ArrowUpRight className="w-4 h-4 text-green-400" />
                          </div>
                          <span className="text-green-400 text-sm">Excellent health</span>
                        </>
                      ) : (
                        <>
                          <div className="p-1 bg-yellow-500/20 rounded-lg">
                            <ArrowDownRight className="w-4 h-4 text-yellow-400" />
                          </div>
                          <span className="text-yellow-400 text-sm">Needs attention</span>
                        </>
                      )}
                    </div>
                    {/* Health Reasons */}
                    {getHealthReasons().length > 0 && (
                      <div className="mt-4 space-y-1">
                        <p className="text-xs text-gray-500">Reason:</p>
                        {getHealthReasons().map((reason, idx) => (
                          <p key={idx} className="text-sm text-gray-400 flex items-center gap-2">
                            <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                            {reason}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <Gauge className="w-12 h-12 text-blue-400" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin-slow"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Cost Contributors - New Section */}
          <div className="mb-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-500/10 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">🔥 Top Cost Contributors</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {topCostContributors.map((item, idx) => (
                    <div key={item.name} className="p-4 bg-slate-800/50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-400 text-sm">{item.name}</p>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          idx === 0 ? 'bg-red-500/20 text-red-400' :
                          idx === 1 ? 'bg-orange-500/20 text-orange-400' :
                          idx === 2 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          #{idx + 1}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-white">{formatCost(item.cost)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {((item.cost / topCostContributors[0].cost) * 100).toFixed(1)}% of top cost
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* KPI Cards - Premium */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            <KPICard title="Total Cost" value={formatCost(data.cost.total_cost)} icon={CircleDollarSign} />
            <KPICard title="Daily Avg" value={formatCost(data.cost.average_daily_cost)} icon={Calendar} />
            <KPICard title="EC2" value={data.ec2.total_instances} icon={Server} />
            <KPICard title="Running" value={data.ec2.running} icon={Zap} />
            <KPICard title="S3" value={data.s3.total_buckets} icon={HardDrive} />
            <KPICard title="RDS" value={data.rds.total_databases} icon={Cloud} />
            <KPICard title="Lambda" value={data.lambda.total_functions} icon={Cpu} />
            <KPICard title="CPU" value={formatCPU(data.performance.average_cpu_utilization)} icon={Activity} />
          </div>

          {/* Service Costs - Premium */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <CostCard title="EC2 Cost" value={formatCost(data.ec2.total_cost)} icon={Server} color="blue" percentage={45} />
            <CostCard title="S3 Cost" value={formatCost(data.s3.total_cost)} icon={HardDrive} color="green" percentage={25} />
            <CostCard title="RDS Cost" value={formatCost(data.rds.total_cost)} icon={Cloud} color="yellow" percentage={18} />
            <CostCard title="Lambda Cost" value={formatCost(data.lambda.total_cost)} icon={Cpu} color="red" percentage={12} />
          </div>

          {/* Charts - Premium */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl">
                      <LineChart className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Cost Forecast</h3>
                  </div>
                  <span className="text-xs text-gray-500 px-3 py-1 bg-slate-800 rounded-full">Next 3 days</span>
                </div>
                <div className="h-64">
                  <Line data={lineData} options={chartOptions} />
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-xl">
                      <PieChart className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Cost Distribution</h3>
                  </div>
                  <span className="text-xs text-gray-500 px-3 py-1 bg-slate-800 rounded-full">By service</span>
                </div>
                <div className="h-64">
                  {Number(data.cost.total_cost) > 0 ? (
                    <Pie data={pieData} options={chartOptions} />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <PieChart className="w-10 h-10 mb-2 opacity-20" />
                      <p className="text-sm">No cost data yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Risk Alerts - Premium with Savings Impact */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <AlertCard
              title="Underutilized EC2"
              value={data.ec2.underutilized}
              type="warning"
              icon={Server}
              description={`${data.ec2.underutilized} instances below 20% CPU`}
              savings={`Save $${getUnderutilizedSavings()}/month`}
            />
            <AlertCard
              title="Unused Lambda"
              value={data.lambda.unused_functions}
              type="warning"
              icon={Cpu}
              description="No invocations in 30 days"
              savings="Clean up recommended"
            />
            <AlertCard
              title="Low Storage RDS"
              value={data.rds.low_storage}
              type="danger"
              icon={Cloud}
              description="Less than 10% free space"
              savings="Action required soon"
            />
          </div>

          {/* Top Resources and AI Insights - Premium */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-500/10 rounded-xl">
                    <Boxes className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Top EC2 Instances</h3>
                </div>
                <div className="space-y-4">
                  {topEC2.map((i: any, index: number) => (
                    <div key={i.id} className="relative">
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all cursor-pointer group/item">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold
                            ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                              index === 1 ? 'bg-gray-400/20 text-gray-400' :
                              index === 2 ? 'bg-orange-500/20 text-orange-400' :
                              'bg-blue-500/20 text-blue-400'}`}>
                            #{index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-white group-hover/item:text-blue-400 transition-colors">
                              {i.id}
                            </p>
                            <p className="text-xs text-gray-500">CPU: {formatCPU(i.cpu)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">{formatCost(i.cost)}</p>
                          <p className="text-xs text-gray-500">this month</p>
                        </div>
                      </div>
                      {index < topEC2.length - 1 && (
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-500/10 rounded-xl">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">AI Insights</h3>
                </div>
                {insights.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
                      <Shield className="w-10 h-10 text-emerald-400" />
                    </div>
                    <p className="text-emerald-400 font-medium text-lg">All systems optimal</p>
                    <p className="text-gray-500 text-sm mt-2">No issues detected in your infrastructure</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {insights.map((insight, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border ${
                          insight.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
                          'bg-red-500/10 border-red-500/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 ${
                            insight.type === 'warning' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            <AlertTriangle className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-white mb-1">{insight.message}</p>
                            <p className="text-sm text-gray-400">{insight.action}</p>
                            <p className="text-sm text-emerald-400 mt-2">{insight.impact}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RDS Top Resources and Optimization - Premium */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <Network className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Top RDS Instances</h3>
                </div>
                <div className="space-y-4">
                  {topRDS.map((i: any, index: number) => (
                    <div key={i.id} className="relative">
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all cursor-pointer group/item">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold
                            ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                              index === 1 ? 'bg-gray-400/20 text-gray-400' :
                              index === 2 ? 'bg-orange-500/20 text-orange-400' :
                              'bg-blue-500/20 text-blue-400'}`}>
                            #{index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-white group-hover/item:text-blue-400 transition-colors">
                              {i.id}
                            </p>
                            <p className="text-xs text-gray-500">Storage: {i.storage}GB</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">{formatCost(i.cost)}</p>
                          <p className="text-xs text-gray-500">this month</p>
                        </div>
                      </div>
                      {index < topRDS.length - 1 && (
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Optimization Overview - Premium */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-orange-500/10 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Optimization Overview</h3>
                </div>

                <div className="flex items-center justify-center mb-8">
                  <div className="relative">
                    <svg className="w-36 h-36 transform -rotate-90">
                      <circle
                        className="text-slate-800"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="64"
                        cx="72"
                        cy="72"
                      />
                      <circle
                        className="text-transparent"
                        strokeWidth="8"
                        strokeDasharray={402}
                        strokeDashoffset={402 - (402 * data.optimization.optimization_score) / 100}
                        strokeLinecap="round"
                        stroke="url(#gradient)"
                        fill="transparent"
                        r="64"
                        cx="72"
                        cy="72"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-3xl font-bold text-white">{data.optimization.optimization_score}%</span>
                        <p className="text-xs text-gray-500 mt-1">Score</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-slate-800/50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Potential savings</p>
                    <p className="text-xl font-bold text-emerald-400">{formatCost(data.optimization.total_potential_monthly_savings)}</p>
                    <p className="text-xs text-gray-600 mt-1">per month</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Carbon footprint</p>
                    <p className="text-xl font-bold text-green-400">{data.sustainability.carbon} kg</p>
                    <p className="text-xs text-gray-600 mt-1">CO2 equivalent</p>
                  </div>
                </div>

                <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group">
                  <span>View Optimization Report</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Premium Footer */}
          <div className="mt-8 pt-8 border-t border-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">us-east-1</span>
                </div>
                <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Encrypted</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Last updated {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          </div>
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
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s ease infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

/* ================= PREMIUM COMPONENTS ================= */

function KPICard({ title, value, icon: Icon }: any) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border border-slate-800 group-hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-500 text-sm group-hover:text-gray-400 transition-colors">{title}</p>
          <Icon className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors" />
        </div>
        <p className="text-xl font-bold text-white mb-1">{value}</p>
      </div>
    </div>
  );
}

function CostCard({ title, value, icon: Icon, color, percentage }: any) {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-emerald-600',
    yellow: 'from-yellow-500 to-orange-600',
    red: 'from-red-500 to-pink-600',
  } as const;

  const textColors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
  } as const;

  const colorClass = colors[color as keyof typeof colors];
  const textColorClass = textColors[color as keyof typeof textColors];

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
      <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-xl p-4 border border-slate-800 overflow-hidden">
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClass} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity`}></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-sm">{title}</p>
            <Icon className={`w-4 h-4 ${textColorClass}`} />
          </div>
          <p className="text-xl font-bold text-white mb-2">{value}</p>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${colorClass} rounded-full transition-all duration-500 group-hover:opacity-80`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertCard({ title, value, type, icon: Icon, description, savings }: any) {
  const types = {
    warning: {
      bg: 'from-yellow-500 to-orange-500',
      text: 'text-yellow-400',
      border: 'border-yellow-500/20',
      bgLight: 'bg-yellow-500/10',
    },
    danger: {
      bg: 'from-red-500 to-pink-500',
      text: 'text-red-400',
      border: 'border-red-500/20',
      bgLight: 'bg-red-500/10',
    },
  } as const;

  const config = types[type as keyof typeof types] ?? types.warning;

  return (
    <div className="group relative">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${config.bg} rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500`}></div>
      <div className={`relative ${config.bgLight} backdrop-blur-xl rounded-xl p-4 border ${config.border} group-hover:border-opacity-40 transition-all`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${config.bgLight} group-hover:scale-110 transition-transform`}>
            <Icon className={`w-5 h-5 ${config.text}`} />
          </div>
          <div className="flex-1">
            <p className="text-gray-400 text-sm mb-1">{title}</p>
            <p className="text-2xl font-bold text-white mb-1">{value}</p>
            <p className="text-xs text-gray-500 mb-2">{description}</p>
            <p className={`text-xs font-medium ${type === 'warning' ? 'text-yellow-400' : 'text-red-400'}`}>
              {savings}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
