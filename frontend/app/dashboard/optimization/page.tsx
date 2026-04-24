"use client";

import { useEffect, useState } from "react";
import {
  fetchEC2,
  fetchS3,
  fetchRDS,
  fetchLambda,
} from "../../lib/api";

import {
  Zap,
  AlertTriangle,
  TrendingDown,
  Cpu,
  Database,
  HardDrive,
  Layers,
  DollarSign,
  Server,
  Gauge,
  Sparkles,
  Clock,
  RefreshCw,
  Shield,
  Target,
  Lightbulb,
  Activity,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function OptimizationPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    async function load() {
      try {
        const [ec2, s3, rds, lambda] = await Promise.all([
          fetchEC2(),
          fetchS3(),
          fetchRDS(),
          fetchLambda(),
        ]);

        /* ======================
           EC2 OPTIMIZATION
        ====================== */
        const underutilizedEC2 = ec2.filter(
          (i: any) => i.state === "running"
        ).length;

        const ec2Savings = underutilizedEC2 * 15;

        /* ======================
           S3 OPTIMIZATION
        ====================== */
        const s3Savings = s3.length * 2;

        /* ======================
           RDS OPTIMIZATION
        ====================== */
        const rdsSavings = rds.length * 10;

        /* ======================
           LAMBDA OPTIMIZATION
        ====================== */
        const unusedLambda = lambda.filter(
          (fn: any) => fn.invocations === 0
        ).length;

        const lambdaSavings = unusedLambda * 5;

        /* ======================
           TOTAL
        ====================== */
        const totalSavings =
          ec2Savings + s3Savings + rdsSavings + lambdaSavings;

        const insights: any[] = [];

        if (underutilizedEC2 > 0) {
          insights.push({
            type: "warning",
            message: `${underutilizedEC2} EC2 instances underutilized`,
            action: "Resize or stop instances",
            saving: `$${ec2Savings}/month`,
          });
        }

        if (unusedLambda > 0) {
          insights.push({
            type: "warning",
            message: `${unusedLambda} unused Lambda functions`,
            action: "Delete unused functions",
            saving: `$${lambdaSavings}/month`,
          });
        }

        if (rds.length > 0) {
          insights.push({
            type: "info",
            message: `RDS instances can be optimized`,
            action: "Downgrade instance class",
            saving: `$${rdsSavings}/month`,
          });
        }

        setData({
          ec2,
          s3,
          rds,
          lambda,
          totalSavings,
          ec2Savings,
          s3Savings,
          rdsSavings,
          lambdaSavings,
          underutilizedEC2,
          unusedLambda,
          insights,
          score: Math.max(100 - (underutilizedEC2 * 10 + unusedLambda * 5), 50),
        });

        setLastUpdated(new Date());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const refreshData = () => {
    setLoading(true);
    Promise.all([fetchEC2(), fetchS3(), fetchRDS(), fetchLambda()])
      .then(([ec2, s3, rds, lambda]) => {
        /* ======================
           EC2 OPTIMIZATION
        ====================== */
        const underutilizedEC2 = ec2.filter(
          (i: any) => i.state === "running"
        ).length;

        const ec2Savings = underutilizedEC2 * 15;

        /* ======================
           S3 OPTIMIZATION
        ====================== */
        const s3Savings = s3.length * 2;

        /* ======================
           RDS OPTIMIZATION
        ====================== */
        const rdsSavings = rds.length * 10;

        /* ======================
           LAMBDA OPTIMIZATION
        ====================== */
        const unusedLambda = lambda.filter(
          (fn: any) => fn.invocations === 0
        ).length;

        const lambdaSavings = unusedLambda * 5;

        /* ======================
           TOTAL
        ====================== */
        const totalSavings =
          ec2Savings + s3Savings + rdsSavings + lambdaSavings;

        const insights: any[] = [];

        if (underutilizedEC2 > 0) {
          insights.push({
            type: "warning",
            message: `${underutilizedEC2} EC2 instances underutilized`,
            action: "Resize or stop instances",
            saving: `$${ec2Savings}/month`,
          });
        }

        if (unusedLambda > 0) {
          insights.push({
            type: "warning",
            message: `${unusedLambda} unused Lambda functions`,
            action: "Delete unused functions",
            saving: `$${lambdaSavings}/month`,
          });
        }

        if (rds.length > 0) {
          insights.push({
            type: "info",
            message: `RDS instances can be optimized`,
            action: "Downgrade instance class",
            saving: `$${rdsSavings}/month`,
          });
        }

        setData({
          ec2,
          s3,
          rds,
          lambda,
          totalSavings,
          ec2Savings,
          s3Savings,
          rdsSavings,
          lambdaSavings,
          underutilizedEC2,
          unusedLambda,
          insights,
          score: Math.max(100 - (underutilizedEC2 * 10 + unusedLambda * 5), 50),
        });

        setLastUpdated(new Date());
        setLoading(false);
      })
      .catch(console.error);
  };

  const format = (v: number) => "$" + (v || 0).toFixed(2);

  const getScoreColor = () => {
    if (!data) return "";
    if (data.score > 70) return "text-emerald-400";
    if (data.score > 40) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBgColor = () => {
    if (!data) return "";
    if (data.score > 70) return "bg-emerald-500/10";
    if (data.score > 40) return "bg-yellow-500/10";
    return "bg-red-500/10";
  };

  const getScoreBarColor = () => {
    if (!data) return "";
    if (data.score > 70) return "bg-gradient-to-r from-emerald-500 to-green-500";
    if (data.score > 40) return "bg-gradient-to-r from-yellow-500 to-orange-500";
    return "bg-gradient-to-r from-red-500 to-pink-500";
  };

  // Chart data for savings breakdown
  const chartData = data ? {
    labels: ["EC2", "S3", "RDS", "Lambda"],
    datasets: [
      {
        label: "Monthly Savings ($)",
        data: [data.ec2Savings, data.s3Savings, data.rdsSavings, data.lambdaSavings],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"],
        borderRadius: 8,
        barPercentage: 0.6,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
    plugins: {
      legend: {
        display: false,
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
            return `Savings: $${context.raw.toFixed(2)}/month`;
          }
        }
      },
    },
    scales: {
      y: {
        grid: { color: "#1E293B" },
        ticks: {
          color: "#64748B",
          callback: (value: any) => `$${value}`,
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#64748B" },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse"></div>
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-blue-500 animate-spin"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse"></div>
          </div>
          <p className="mt-4 text-gray-400 animate-pulse">Loading optimization data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20 animate-fade-in"
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
            <div className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Optimization Intelligence
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-0.5 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                  <p className="text-gray-500 text-sm">
                    Identify waste and reduce cloud spend
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 hover:border-blue-500/40 transition-all duration-300 animate-fade-in">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm text-green-400 font-medium">Live</span>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 hover:border-blue-500/40 transition-all duration-300 animate-fade-in animation-delay-100">
                <Clock className="w-4 h-4 text-gray-400 animate-spin-slow" />
                <span className="text-sm text-gray-400">
                  {Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000)}s ago
                </span>
              </div>

              <button
                onClick={refreshData}
                className="p-2 bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300 animate-fade-in animation-delay-200 group"
              >
                <RefreshCw className="w-5 h-5 text-gray-400 group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="animate-fade-in animation-delay-100">
              <KPICard
                title="Total Savings"
                value={format(data.totalSavings)}
                icon={TrendingDown}
                color="emerald"
                subtitle="per month"
              />
            </div>
            <div className="animate-fade-in animation-delay-200">
              <KPICard
                title="Optimization Score"
                value={`${data.score}%`}
                icon={Gauge}
                color={data.score > 70 ? "green" : data.score > 40 ? "yellow" : "red"}
                badge={data.score > 70 ? "Good" : data.score > 40 ? "Fair" : "Poor"}
              />
            </div>
            <div className="animate-fade-in animation-delay-300">
              <KPICard
                title="Underutilized EC2"
                value={data.underutilizedEC2}
                icon={Cpu}
                color="yellow"
                badge={`${Math.round((data.underutilizedEC2 / data.ec2.length) * 100) || 0}%`}
              />
            </div>
            <div className="animate-fade-in animation-delay-400">
              <KPICard
                title="Unused Lambda"
                value={data.unusedLambda}
                icon={Layers}
                color="red"
                badge={`${Math.round((data.unusedLambda / data.lambda.length) * 100) || 0}%`}
              />
            </div>
          </div>

          {/* Savings Breakdown Chart */}
          <div className="group relative animate-slide-up">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Savings Breakdown by Service</h3>
              </div>

              <div className="h-[300px] w-full">
                {chartData && <Bar data={chartData} options={chartOptions} />}
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <Section
            title="AI Insights"
            icon={Sparkles}
            color="purple"
            count={data.insights.length}
            animate="slide-up"
            delay={200}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.insights.map((insight: any, idx: number) => (
                <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                  <InsightCard
                    type={insight.type}
                    title={insight.message}
                    action={insight.action}
                    saving={insight.saving}
                  />
                </div>
              ))}
            </div>
          </Section>

          {/* EC2 Optimization */}
          <Section
            title="EC2 Optimization"
            icon={Cpu}
            color="blue"
            count={data.ec2.length}
            animate="slide-up"
            delay={300}
          >
            {data.ec2.map((i: any, idx: number) => (
              <ResourceRow
                key={i.instance_id}
                name={i.instance_id}
                type={i.instance_type}
                state={i.state}
                extra={i.state === "stopped" ? "STOPPED ⚠️" : "RUNNING"}
                index={idx}
              />
            ))}
          </Section>

          {/* S3 Optimization */}
          <Section
            title="S3 Optimization"
            icon={HardDrive}
            color="green"
            count={data.s3.length}
            animate="slide-up"
            delay={400}
          >
            {data.s3.map((b: any, idx: number) => (
              <S3Row
                key={b.name}
                name={b.name}
                objects={b.object_count}
                size={b.size_bytes}
                extra="Optimize storage"
                index={idx}
              />
            ))}
          </Section>

          {/* RDS Optimization */}
          <Section
            title="RDS Optimization"
            icon={Database}
            color="yellow"
            count={data.rds.length}
            animate="slide-up"
            delay={500}
          >
            {data.rds.map((db: any, idx: number) => (
              <RDSRow
                key={db.db_identifier}
                name={db.db_identifier}
                engine={db.engine}
                storage={db.allocated_storage}
                risk={db.risk}
                index={idx}
              />
            ))}
          </Section>

          {/* Lambda Optimization */}
          <Section
            title="Lambda Optimization"
            icon={Layers}
            color="purple"
            count={data.lambda.length}
            animate="slide-up"
            delay={600}
          >
            {data.lambda.map((fn: any, idx: number) => (
              <LambdaRow
                key={fn.name}
                name={fn.name}
                runtime={fn.runtime}
                memory={fn.memory}
                invocations={fn.invocations}
                index={idx}
              />
            ))}
          </Section>
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

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animation-delay-100 {
          animation-delay: 100ms;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

/* ================= PREMIUM COMPONENTS ================= */

function KPICard({ title, value, icon: Icon, color, badge, subtitle }: any) {
  const colors = {
    blue: 'from-blue-500 to-purple-600',
    green: 'from-green-500 to-emerald-600',
    emerald: 'from-emerald-500 to-teal-600',
    yellow: 'from-yellow-500 to-orange-500',
    red: 'from-red-500 to-pink-500',
    purple: 'from-purple-500 to-pink-500',
  } as const;

  const iconColors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    emerald: 'text-emerald-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
  } as const;

  const badgeColors = {
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    yellow: 'bg-yellow-500/20 text-yellow-400',
    red: 'bg-red-500/20 text-red-400',
    purple: 'bg-purple-500/20 text-purple-400',
  } as const;

  const colorClass = colors[color as keyof typeof colors];
  const iconClass = iconColors[color as keyof typeof iconColors];
  const badgeClass = badgeColors[color as keyof typeof badgeColors];

  return (
    <div className="group relative">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${colorClass} rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500`}></div>
      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl p-5 border border-slate-800 hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-500 text-sm mb-2">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform duration-300">{value}</p>
              {badge && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClass} animate-pulse`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-xl bg-${color}-500/10 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-5 h-5 ${iconClass}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, color, count, children, animate, delay }: any) {
  const iconColors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400',
    red: 'text-red-400',
  } as const;

  const iconClass = iconColors[color as keyof typeof iconColors];

  return (
    <div className={`group relative animate-${animate}`} style={{ animationDelay: delay ? `${delay}ms` : '0ms' }}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Icon className={`w-5 h-5 ${iconClass}`} />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          {count !== undefined && (
            <span className="text-xs text-gray-500 bg-slate-800 px-3 py-1 rounded-full animate-pulse">
              {count} resources
            </span>
          )}
        </div>
        <div className="space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
}

function InsightCard({ type, title, action, saving }: any) {
  const types = {
    warning: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      icon: '⚠️',
      text: 'text-amber-400',
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      icon: '💡',
      text: 'text-blue-400',
    },
    success: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      icon: '✅',
      text: 'text-emerald-400',
    },
  } as const;

  const config = types[type as keyof typeof types] || types.info;

  return (
    <div className={`${config.bg} border ${config.border} rounded-xl p-4 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg group`}>
      <div className="flex items-start gap-3">
        <span className={`${config.text} text-xl group-hover:scale-110 transition-transform duration-300`}>{config.icon}</span>
        <div className="flex-1">
          <p className="text-white text-sm font-medium mb-1">{title}</p>
          <p className="text-gray-400 text-xs mb-2">{action}</p>
          <p className={`${config.text} text-sm font-medium`}>{saving}</p>
        </div>
      </div>
    </div>
  );
}

function ResourceRow({ name, type, state, extra, index }: any) {
  return (
    <div
      className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group/item border border-transparent hover:border-blue-500/20 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-3">
        <Server className="w-4 h-4 text-blue-400" />
        <div>
          <p className="font-medium text-white group-hover/item:text-blue-400 transition-colors duration-300">{name}</p>
          <p className="text-xs text-gray-500">{type}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-xs px-2 py-1 rounded-full ${state === "running"
            ? "bg-green-500/20 text-green-400"
            : "bg-red-500/20 text-red-400"
          }`}>
          {state}
        </span>
        {extra && (
          <span className="text-xs text-gray-500">{extra}</span>
        )}
      </div>
    </div>
  );
}

function S3Row({ name, objects, size, extra, index }: any) {
  const sizeMB = (size / 1024 / 1024).toFixed(2);

  return (
    <div
      className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group/item border border-transparent hover:border-green-500/20 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-3">
        <HardDrive className="w-4 h-4 text-green-400" />
        <div>
          <p className="font-medium text-white group-hover/item:text-green-400 transition-colors duration-300">{name}</p>
          <p className="text-xs text-gray-500">{objects} objects</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">{sizeMB} MB</span>
        <span className="text-xs text-gray-500">{extra}</span>
      </div>
    </div>
  );
}

function RDSRow({ name, engine, storage, risk, index }: any) {
  return (
    <div
      className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group/item border border-transparent hover:border-yellow-500/20 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-3">
        <Database className="w-4 h-4 text-yellow-400" />
        <div>
          <p className="font-medium text-white group-hover/item:text-yellow-400 transition-colors duration-300">{name}</p>
          <p className="text-xs text-gray-500">{engine}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">{storage} GB</span>
        {risk && (
          <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400">
            {risk}
          </span>
        )}
      </div>
    </div>
  );
}

function LambdaRow({ name, runtime, memory, invocations, index }: any) {
  const isUnused = invocations === 0;

  return (
    <div
      className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-all duration-300 group/item border border-transparent hover:border-purple-500/20 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-3">
        <Layers className="w-4 h-4 text-purple-400" />
        <div>
          <p className="font-medium text-white group-hover/item:text-purple-400 transition-colors duration-300">{name}</p>
          <p className="text-xs text-gray-500">{runtime}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">{memory} MB</span>
        <span className={`text-xs px-2 py-1 rounded-full ${isUnused
            ? "bg-red-500/20 text-red-400 animate-pulse"
            : "bg-green-500/20 text-green-400"
          }`}>
          {isUnused ? "UNUSED ⚠️" : "ACTIVE"}
        </span>
      </div>
    </div>
  );
}
