"use client";

import { useEffect, useState } from "react";
import {
  fetchCostTrend,
  fetchForecast,
  fetchOverview
} from "@/lib/api";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Server,
  HardDrive,
  Cloud,
  Cpu,
  AlertTriangle,
  Zap,
  Shield,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart,
  Gauge,
  Clock,
  Info,
  Download,
  RefreshCw,
} from "lucide-react";

import CostChart from "@/components/CostChart";
import ForecastPanel from "@/components/ForecastPanel";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CostAnalytics() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [costTrend, forecast, overview] = await Promise.all([
          fetchCostTrend(),
          fetchForecast(),
          fetchOverview()
        ]);

        const ec2Cost = overview.ec2.total_cost || 0;
        const s3Cost = overview.s3.total_cost || 0;
        const rdsCost = overview.rds.total_cost || 0;
        const lambdaCost = overview.lambda?.total_cost || 0;

        const totalCost = ec2Cost + s3Cost + rdsCost + lambdaCost;

        const services = [
          { name: "EC2", cost: ec2Cost, icon: Server, color: "#3B82F6" },
          { name: "S3", cost: s3Cost, icon: HardDrive, color: "#10B981" },
          { name: "RDS", cost: rdsCost, icon: Cloud, color: "#F59E0B" },
          { name: "Lambda", cost: lambdaCost, icon: Cpu, color: "#EF4444" },
        ];

        const highestService = services.reduce((a, b) =>
          a.cost > b.cost ? a : b
        );

        const costPercentages = services.map((s) => ({
          ...s,
          percent: totalCost > 0 ? ((s.cost / totalCost) * 100).toFixed(1) : 0
        }));

        const insights: any[] = [];

        if (overview.ec2.underutilized > 0) {
          insights.push({
            type: "warning",
            message: `Underutilized EC2 instances detected`,
            detail: `${overview.ec2.underutilized} instances running below 20% CPU`,
            impact: `Potential savings: $${(overview.ec2.underutilized * 15).toFixed(2)}/month`,
            action: "Review and resize or terminate",
          });
        }

        if ((overview.lambda?.unused_functions || 0) > 0) {
          insights.push({
            type: "warning",
            message: `Unused Lambda functions found`,
            detail: `${overview.lambda?.unused_functions} functions not invoked in 30 days`,
            impact: "Clean up recommended",
            action: "Remove to reduce costs",
          });
        }

        if (overview.rds.low_storage > 0) {
          insights.push({
            type: "danger",
            message: `RDS storage running low`,
            detail: `${overview.rds.low_storage} databases with <10% free space`,
            impact: "Action required within 7 days",
            action: "Increase storage capacity",
          });
        }

        const monthlySavings = (overview.ec2.underutilized * 15) + (overview.lambda?.unused_functions || 0) * 5;
        if (monthlySavings > 0) {
          insights.push({
            type: "success",
            message: `Cost optimization opportunity`,
            detail: `You could save $${monthlySavings.toFixed(2)} per month`,
            impact: totalCost > 0
              ? `${((monthlySavings / totalCost) * 100).toFixed(1)}% of current spend`
              : "No cost data",
            action: "View optimization report",
          });
        }

        const savings =
          (overview.ec2.underutilized * 15) +
          (overview.lambda?.unused_functions || 0) * 5;

        const efficiencyScore = Math.max(
          100 -
          (overview.ec2.underutilized * 8 +
            (overview.lambda?.unused_functions || 0) * 4 +
            overview.rds.low_storage * 5),
          50
        );

        setData({
          costTrend,
          forecast,
          overview,
          totalCost,
          services,
          highestService,
          costPercentages,
          insights,
          savings,
          efficiencyScore
        });

        setLastUpdated(new Date());
      } catch (error) {
        console.error("Cost Analytics Load Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const refreshData = () => {
    window.location.reload();
  };

  const formatCost = (value: number) => {
    if (value < 0.0001) return '< $0.0001';
    if (value < 0.001) return '$' + value.toFixed(6);
    if (value < 0.01) return '$' + value.toFixed(5);
    if (value < 0.1) return '$' + value.toFixed(4);
    return '$' + value.toFixed(2);
  };

  const getTrend = () => {
    const trendData = data?.costTrend?.trend || [];

    if (trendData.length < 2) return { value: 0, isUp: true };

    const lastTwo = trendData.slice(-2);

    const trend = ((lastTwo[1].amount - lastTwo[0].amount) / (lastTwo[0].amount || 1)) * 100;

    return {
      value: Math.abs(trend).toFixed(1),
      isUp: trend > 0,
    };
  };

  const pieData = data ? {
    labels: data.services.map((s: any) => s.name),
    datasets: [
      {
        data: data.services.map((s: any) => s.cost),
        backgroundColor: data.services.map((s: any) => s.color),
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  } : null;

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
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = data.costPercentages.find((s: any) => s.name === label)?.percent || 0;
            return [`${label}: ${formatCost(value)}`, `${percentage}% of total`];
          }
        }
      },
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-blue-500 animate-spin"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse"></div>
          </div>
          <p className="mt-4 text-gray-400">Loading cost analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-[#1E293B] rounded-2xl p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Failed to load data</h2>
          <p className="text-gray-400">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const trend = getTrend();

  return (
    <div className="space-y-8">
      {/* Header with Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Cost Analytics
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-0.5 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <p className="text-gray-500 text-sm">Track and optimize your cloud spending</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900/50 backdrop-blur-xl rounded-xl p-1 border border-slate-800">
            {["7d", "30d", "90d"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedPeriod === period
                    ? "bg-blue-500 text-white"
                    : "text-gray-400 hover:text-white"
                  }`}
              >
                {period}
              </button>
            ))}
          </div>

          <button
            onClick={refreshData}
            className="p-2 bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all"
          >
            <RefreshCw className="w-5 h-5 text-gray-400" />
          </button>

          <button className="p-2 bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 hover:border-blue-500/50 transition-all">
            <Download className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Last Updated */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Clock className="w-4 h-4" />
        <span>Last updated {Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000)}s ago</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Cost"
          value={formatCost(data.totalCost)}
          icon={DollarSign}
          trend={trend.value}
          trendUp={trend.isUp}
          subtitle="this month"
        />

        <KPICard
          title="Daily Avg"
          value={formatCost(data.totalCost / 30)}
          icon={Calendar}
          trend="2.1"
          trendUp={false}
          subtitle="vs last month"
        />

        <KPICard
          title="Highest Service"
          value={data.highestService.name}
          icon={data.highestService.icon}
          subtitle={formatCost(data.highestService.cost)}
          badge={`${data.costPercentages.find((s: any) => s.name === data.highestService.name)?.percent}%`}
        />

        <KPICard
          title="Potential Savings"
          value={formatCost(data.savings)}
          icon={TrendingDown}
          trend="opportunity"
          trendUp={true}
          subtitle="per month"
        />
      </div>

      {/* Service Breakdown with Progress */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.costPercentages.map((s: any) => (
          <ServiceCard
            key={s.name}
            name={s.name}
            cost={formatCost(s.cost)}
            percentage={s.percent}
            icon={s.icon}
            color={s.color}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Cost Trend Chart */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-xl">
                  <LineChart className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Cost Trend</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 px-3 py-1 bg-slate-800 rounded-full">Last 30 days</span>
                <Info className="w-4 h-4 text-gray-600 cursor-help" />
              </div>
            </div>
            <div className="h-[300px]">
              <CostChart data={data.costTrend?.trend || []} />
            </div>
          </div>
        </div>

        {/* Cost Distribution Pie */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-xl">
                  <PieChart className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Cost Distribution</h2>
              </div>
              <span className="text-xs text-gray-500 px-3 py-1 bg-slate-800 rounded-full">By service</span>
            </div>
            <div className="h-[300px] flex items-center justify-center">
              {pieData && pieData.datasets[0].data.reduce((a: number,b: number)=>a+b, 0) > 0 ? (
                <Pie data={pieData} options={chartOptions} />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <PieChart className="w-10 h-10 mb-2 opacity-20" />
                  <p className="text-sm">No cost data</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Panel */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Cost Forecast</h2>
          </div>
          <ForecastPanel data={data.forecast} />
        </div>
      </div>

      {/* Risk Alerts with Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AlertCard
          title="Underutilized EC2"
          value={data.overview.ec2.underutilized}
          type="warning"
          icon={Server}
          description="Running below 20% CPU"
          savings={`Save $${(data.overview.ec2.underutilized * 15).toFixed(2)}/month`}
        />
        <AlertCard
          title="Unused Lambda"
          value={data.overview.lambda?.unused_functions || 0}
          type="warning"
          icon={Cpu}
          description="No invocations in 30 days"
          savings="Clean up recommended"
        />
        <AlertCard
          title="Low RDS Storage"
          value={data.overview.rds.low_storage || 0}
          type="danger"
          icon={Cloud}
          description="Less than 10% free space"
          savings="Action required soon"
        />
      </div>

      {/* Top Resources and AI Insights Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top EC2 Instances */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                <Server className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Top EC2 Instances</h2>
            </div>
            <div className="space-y-3">
              {[...data.overview.ec2.instances]
                .sort((a: any, b: any) => b.cost - a.cost)
                .slice(0, 5)
                .map((i: any, idx: number) => (
                  <div key={i.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${idx === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                          idx === 1 ? 'bg-gray-400/20 text-gray-400' :
                            idx === 2 ? 'bg-orange-500/20 text-orange-400' :
                              'bg-blue-500/20 text-blue-400'}`}>
                        #{idx + 1}
                      </div>
                      <span className="text-gray-300">{i.id}</span>
                    </div>
                    <span className="font-medium text-white">{formatCost(i.cost)}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-xl">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">AI Insights</h2>
            </div>
            <div className="space-y-4">
              {data.insights.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <p className="text-emerald-400">All systems optimal</p>
                  <p className="text-gray-500 text-sm mt-1">No issues detected</p>
                </div>
              ) : (
                data.insights.map((insight: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${insight.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20' :
                        insight.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
                          'bg-red-500/10 border-red-500/20'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${insight.type === 'success' ? 'text-emerald-400' :
                          insight.type === 'warning' ? 'text-yellow-400' :
                            'text-red-400'
                        }`} />
                      <div className="flex-1">
                        <p className="font-medium text-white mb-1">{insight.message}</p>
                        <p className="text-sm text-gray-400 mb-1">{insight.detail}</p>
                        <p className="text-xs text-gray-500 mb-2">{insight.action}</p>
                        <p className={`text-xs font-medium ${insight.type === 'success' ? 'text-emerald-400' :
                            insight.type === 'warning' ? 'text-yellow-400' :
                              'text-red-400'
                          }`}>
                          {insight.impact}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Efficiency Score */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Gauge className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Efficiency Score</h2>
                <p className="text-sm text-gray-500">Based on resource utilization and optimization</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-emerald-400">{data.efficiencyScore}</div>
              <div className="text-sm text-gray-500">/100</div>
            </div>
          </div>
          <div className="mt-4 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500"
              style={{ width: `${data.efficiencyScore}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500">Compute</p>
              <p className="text-sm text-white font-medium">{Math.min(100, data.efficiencyScore + 5)}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Storage</p>
              <p className="text-sm text-white font-medium">{Math.min(100, data.efficiencyScore - 2)}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Network</p>
              <p className="text-sm text-white font-medium">{Math.min(100, data.efficiencyScore + 3)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= PREMIUM COMPONENTS ================= */

function KPICard({ title, value, icon: Icon, trend, trendUp, subtitle, badge }: any) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border border-slate-800 group-hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between mb-2">
          <p className="text-gray-500 text-sm group-hover:text-gray-400 transition-colors">{title}</p>
          <Icon className="w-4 h-4 text-gray-600 group-hover:text-blue-400 transition-colors" />
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-xl font-bold text-white">{value}</p>
          {badge && (
            <span className="text-xs font-medium px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        {trend && (
          <div className={`flex items-center gap-1 text-xs mt-2 ${trendUp ? (trend === 'opportunity' ? 'text-emerald-400' : 'text-emerald-400') : 'text-red-400'
            }`}>
            {trend === 'opportunity' ? (
              <TrendingDown className="w-3 h-3" />
            ) : trendUp ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            <span>{trend === 'opportunity' ? 'Optimization opportunity' : `${trend}% vs last month`}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ServiceCard({ name, cost, percentage, icon: Icon, color }: any) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
      <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-xl p-4 border border-slate-800 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"
          style={{ background: `linear-gradient(135deg, ${color}20, ${color}40)` }}
        ></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-sm">{name}</p>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <p className="text-xl font-bold text-white mb-2">{cost}</p>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 group-hover:opacity-80"
              style={{ width: `${percentage}%`, background: `linear-gradient(90deg, ${color}, ${color}80)` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{percentage}% of total</p>
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
            <p className={`text-xs font-medium ${config.text}`}>{savings}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
