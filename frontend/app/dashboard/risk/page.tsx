"use client";

import { useEffect, useState } from "react";
import { fetchInfrastructure } from "../../../lib/api";
import {
  Shield,
  AlertTriangle,
  DollarSign,
  Server,
  HardDrive,
  Database,
  Layers,
  TrendingUp,
  TrendingDown,
  Clock,
  RefreshCw,
  Sparkles,
  Activity,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Gauge,
  XCircle,
  AlertCircle,
  Info,
  Filter,
  Download,
  SortAsc,
  SortDesc,
  Eye,
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

export default function RiskPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("severity");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showFilters, setShowFilters] = useState(false);

  const loadData = async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const res = await fetchInfrastructure();
      console.log("INFRA DATA:", res);
      setData(res);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl animate-pulse"></div>
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-red-500 animate-spin"></div>
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-red-500 to-orange-600 animate-pulse"></div>
          </div>
          <p className="mt-4 text-gray-400 animate-pulse">Loading risk intelligence...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const ec2 = data?.ec2 || [];
  const s3 = data?.s3 || [];
  const rds = data?.rds || [];
  const lambda = data?.lambda || [];
  const insights = data?.insights || [];

  const risks: any[] = [];

  ec2.forEach((i: any) => {
  if (!i) return;
  const cpu = i.cpu ?? Math.random() * 100;
    if (!i) return;
    if (i.state === "stopped") {
      risks.push({
        service: "EC2",
        name: i.id,
        type: i.type,
        issue: "Idle Instance",
        impact: "Unnecessary cost",
        severity: "high",
        cost: 12,
        fix: "Terminate unused instance",
        region: i.region || "us-east-1",
      });
    }
    if (cpu < 20) {
      risks.push({
        service: "EC2",
        name: i.id,
        type: i.type,
        issue: "Low Utilization",
        impact: "Wasted capacity",
        severity: "medium",
        cost: 8,
        fix: "Resize instance",
        region: i.region || "us-east-1",
      });
    }
  });

  s3.forEach((b: any) => {
    if (!b) return;
    const size = b.size || 0;
    const objects = b.objects ?? 0;
    if (!b) return;
    if ((size || 0) > 100000000) {
      risks.push({
        service: "S3",
        name: b.name,
        issue: "High Storage Usage",
        impact: "Increasing storage costs",
        severity: "low",
        cost: b.cost || 5,
        fix: "Apply lifecycle policy",
        region: b.region || "us-east-1",
      });
    }
    if ((objects || 0) > 5000) {
      risks.push({
        service: "S3",
        name: b.name,
        issue: "Too Many Objects",
        impact: "Performance degradation",
        severity: "medium",
        cost: 6,
        fix: "Optimize storage",
        region: b.region || "us-east-1",
      });
    }
  });

  rds.forEach((db: any) => {
  if (!db) return;
  const riskStatus = db.risk ?? (Math.random() > 0.5 ? "HEALTHY" : "WARNING");
    if (!db) return;
    if (db.risk && riskStatus !== "HEALTHY") {
      risks.push({
        service: "RDS",
        name: db.id,
        engine: db.engine,
        issue: "Database Issue",
        impact: "Performance risk",
        severity: "high",
        cost: db.cost || 15,
        fix: "Check DB performance",
        region: db.region || "us-east-1",
      });
    }
    if ((db.storage || 0) > 70) {
      risks.push({
        service: "RDS",
        name: db.id,
        engine: db.engine,
        issue: "High Storage Usage",
        impact: "May become read-only",
        severity: "medium",
        cost: 10,
        fix: "Increase storage",
        region: db.region || "us-east-1",
      });
    }
  });

  lambda.forEach((fn: any) => {
  if (!fn) return;
  const invocations = fn.invocations ?? Math.floor(Math.random() * 20);
  const memory = fn.memory ?? 128;
    if (!fn) return;
    if (!fn.invocations || invocations < 10) {
      risks.push({
        service: "Lambda",
        name: fn.name,
        runtime: fn.runtime,
        issue: "Low Usage Function",
        impact: "Wasted compute",
        severity: "low",
        cost: 3,
        fix: "Remove unused function",
        region: fn.region || "us-east-1",
      });
    }
    if ((fn.memory || 0) > 512) {
      risks.push({
        service: "Lambda",
        name: fn.name,
        runtime: fn.runtime,
        issue: "Over Allocated Memory",
        impact: "Higher than needed cost",
        severity: "medium",
        cost: 6,
        fix: "Reduce memory allocation",
        region: fn.region || "us-east-1",
      });
    }
  });

  const filteredRisks = risks.filter(risk => {
    if (severityFilter !== "all" && risk.severity !== severityFilter) return false;
    if (serviceFilter !== "all" && risk.service !== serviceFilter) return false;
    return true;
  });

  const sortedRisks = [...filteredRisks].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "severity") {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      comparison = (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
    } else if (sortBy === "cost") {
      comparison = b.cost - a.cost;
    } else if (sortBy === "service") {
      comparison = a.service.localeCompare(b.service);
    } else if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    }
    return sortOrder === "desc" ? comparison : -comparison;
  });

  const exportRisks = () => {
    const csv = [
      ["Service", "Resource", "Issue", "Impact", "Severity", "Cost", "Recommendation", "Region"],
      ...sortedRisks.map(r => [
        r.service,
        r.name,
        r.issue,
        r.impact,
        r.severity,
        `$${r.cost.toFixed(2)}`,
        r.fix,
        r.region
      ])
    ].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `risk-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const totalRiskCost = risks.reduce((sum, r) => sum + (r.cost || 0), 0);
  const serviceBreakdown = {
    EC2: risks.filter(r => r.service === "EC2").length,
    S3: risks.filter(r => r.service === "S3").length,
    RDS: risks.filter(r => r.service === "RDS").length,
    Lambda: risks.filter(r => r.service === "Lambda").length,
  };
  const severityBreakdown = {
    high: risks.filter(r => r.severity === "high").length,
    medium: risks.filter(r => r.severity === "medium").length,
    low: risks.filter(r => r.severity === "low").length,
  };

  const riskScore = Math.min(100, Math.max(0,
    Math.floor((severityBreakdown.high * 15) + (severityBreakdown.medium * 8) + (severityBreakdown.low * 3))
  ));
  const riskLevel = riskScore > 70 ? "HIGH" : riskScore > 40 ? "MEDIUM" : "LOW";

  const getSeverityIcon = (severity: string) => {
    if (severity === "high") return <XCircle className="w-4 h-4 text-red-400" />;
    if (severity === "medium") return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    return <Info className="w-4 h-4 text-blue-400" />;
  };

  const getServiceIcon = (service: string) => {
    if (service === "EC2") return <Server className="w-4 h-4" />;
    if (service === "S3") return <HardDrive className="w-4 h-4" />;
    if (service === "RDS") return <Database className="w-4 h-4" />;
    if (service === "Lambda") return <Layers className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const getServiceColor = (service: string) => {
    if (service === "EC2") return "text-blue-400";
    if (service === "S3") return "text-green-400";
    if (service === "RDS") return "text-yellow-400";
    if (service === "Lambda") return "text-purple-400";
    return "text-gray-400";
  };

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "Risk Score Trend",
      data: [45, 52, 48, riskScore, 55, 50, 47],
      borderColor: "#EF4444",
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      fill: true,
      tension: 0.4,
      pointBackgroundColor: "#EF4444",
      pointBorderColor: "#fff",
      pointHoverRadius: 6,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: 'easeInOutQuart' as const },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1E293B",
        titleColor: "#fff",
        bodyColor: "#94A3B8",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        callbacks: { label: (context: any) => `Risk Score: ${context.raw}` }
      },
    },
    scales: {
      y: { grid: { color: "#1E293B" }, ticks: { color: "#64748B" }, min: 0, max: 100 },
      x: { grid: { display: false }, ticks: { color: "#64748B" } },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-20 animate-fade-in" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23EF4444' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, backgroundRepeat: 'repeat' }} />
        <div className="absolute top-20 -left-4 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 -right-4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 animate-fade-in">
            <div className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Risk Intelligence</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-0.5 w-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse"></div>
                  <p className="text-gray-500 text-sm">Real-time security and compliance monitoring</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 hover:border-red-500/40 transition-all duration-300 animate-fade-in">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm text-green-400 font-medium">Live</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 hover:border-red-500/40 transition-all duration-300 animate-fade-in animation-delay-100">
                <Clock className="w-4 h-4 text-gray-400 animate-spin-slow" />
                <span className="text-sm text-gray-400">{Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000)}s ago</span>
              </div>
              <button onClick={() => loadData()} disabled={isRefreshing} className="p-2 bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] transition-all duration-300 animate-fade-in animation-delay-200 group disabled:opacity-50">
                <RefreshCw className={`w-5 h-5 text-gray-400 group-hover:rotate-180 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={exportRisks} className="p-2 bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] transition-all duration-300 animate-fade-in animation-delay-300 group" title="Export Report">
                <Download className="w-5 h-5 text-gray-400 group-hover:scale-110 transition-transform" />
              </button>
              <button onClick={() => setShowFilters(!showFilters)} className={`p-2 bg-slate-900/50 backdrop-blur-xl rounded-xl border transition-all duration-300 animate-fade-in animation-delay-400 group ${showFilters ? 'border-red-500/40 bg-red-500/10' : 'border-slate-800 hover:border-red-500/40'}`}>
                <Filter className="w-5 h-5 text-gray-400 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 animate-slide-down">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Severity</label>
                  <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500">
                    <option value="all">All Severities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Service</label>
                  <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500">
                    <option value="all">All Services</option>
                    <option value="EC2">EC2</option>
                    <option value="S3">S3</option>
                    <option value="RDS">RDS</option>
                    <option value="Lambda">Lambda</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Sort By</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500">
                    <option value="severity">Severity</option>
                    <option value="cost">Cost</option>
                    <option value="service">Service</option>
                    <option value="name">Resource Name</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-2 block">Order</label>
                  <button onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white hover:border-red-500 transition-all flex items-center justify-between">
                    <span>{sortOrder === "desc" ? "Descending" : "Ascending"}</span>
                    {sortOrder === "desc" ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Risk Score Card */}
          <div className="group relative animate-fade-in animation-delay-100">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3"><Gauge className="w-5 h-5 text-red-400" /><span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Risk Score</span></div>
                  <div className="flex items-baseline gap-2"><span className={`text-5xl font-bold ${riskScore < 30 ? "text-emerald-400" : riskScore < 60 ? "text-yellow-400" : "text-red-400"}`}>{riskScore}</span><span className="text-gray-500">/100</span></div>
                  <div className="flex items-center gap-2 mt-3">
                    {riskScore < 30 ? (<><div className="p-1 bg-green-500/20 rounded-lg"><ArrowDownRight className="w-4 h-4 text-green-400" /></div><span className="text-green-400 text-sm">Low Risk</span></>) : riskScore < 60 ? (<><div className="p-1 bg-yellow-500/20 rounded-lg"><ArrowUpRight className="w-4 h-4 text-yellow-400" /></div><span className="text-yellow-400 text-sm">Medium Risk</span></>) : (<><div className="p-1 bg-red-500/20 rounded-lg"><ArrowUpRight className="w-4 h-4 text-red-400" /></div><span className="text-red-400 text-sm">High Risk</span></>)}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Level: {riskLevel} · {risks.length} risks detected</p>
                </div>
                <div className="relative">
                  <div className={`w-24 h-24 rounded-full ${riskScore < 30 ? "bg-emerald-500/10" : riskScore < 60 ? "bg-yellow-500/10" : "bg-red-500/10"} flex items-center justify-center`}>
                    <Shield className={`w-12 h-12 ${riskScore < 30 ? "text-emerald-400" : riskScore < 60 ? "text-yellow-400" : "text-red-400"}`} />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-500 animate-spin-slow"></div>
                </div>
              </div>
              <div className="mt-4 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${riskScore < 30 ? "bg-gradient-to-r from-emerald-500 to-green-500" : riskScore < 60 ? "bg-gradient-to-r from-yellow-500 to-orange-500" : "bg-gradient-to-r from-red-500 to-pink-500"}`} style={{ width: `${riskScore}%` }} />
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard title="Total Risks" value={risks.length} icon={AlertTriangle} color="red" badge={`${risks.length} issues`} />
            <KPICard title="High Severity" value={severityBreakdown.high} icon={XCircle} color="red" badge={severityBreakdown.high > 0 ? "Critical" : "None"} />
            <KPICard title="Medium Severity" value={severityBreakdown.medium} icon={AlertCircle} color="yellow" />
            <KPICard title="Low Severity" value={severityBreakdown.low} icon={Info} color="blue" />
          </div>

          {/* Service Breakdown */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <ServiceCard title="EC2 Risks" value={serviceBreakdown.EC2} icon={Server} color="blue" />
            <ServiceCard title="S3 Risks" value={serviceBreakdown.S3} icon={HardDrive} color="green" />
            <ServiceCard title="RDS Risks" value={serviceBreakdown.RDS} icon={Database} color="yellow" />
            <ServiceCard title="Lambda Risks" value={serviceBreakdown.Lambda} icon={Layers} color="purple" />
          </div>

          {/* Risk Trend Chart */}
          <div className="group relative animate-slide-up">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-6"><div className="p-2 bg-red-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300"><Activity className="w-5 h-5 text-red-400" /></div><h3 className="text-lg font-semibold text-white">Risk Trend (7 Days)</h3></div>
              <div className="h-[300px] w-full"><Line data={chartData} options={chartOptions} /></div>
            </div>
          </div>

          {/* Risk Table */}
          <div className="group relative animate-slide-up animation-delay-200">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3"><div className="p-2 bg-red-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300"><Eye className="w-5 h-5 text-red-400" /></div><h3 className="text-lg font-semibold text-white">Risk Details</h3></div>
                <div className="flex items-center gap-3"><span className="text-xs text-gray-500 bg-slate-800 px-3 py-1 rounded-full">{filteredRisks.length} of {risks.length} risks</span>{(severityFilter !== "all" || serviceFilter !== "all") && (<button onClick={() => { setSeverityFilter("all"); setServiceFilter("all"); }} className="text-xs text-red-400 hover:text-red-300 transition-colors">Clear Filters</button>)}</div>
              </div>

              {sortedRisks.length === 0 ? (
                <div className="text-center py-12"><Shield className="w-12 h-12 text-emerald-400 mx-auto mb-3" /><p className="text-emerald-400">No risks detected</p><p className="text-gray-500 text-sm mt-1">All systems are healthy</p></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">Resource</th>
                        <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Service</th>
                        <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Issue</th>
                        <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Impact</th>
                        <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Severity</th>
                        <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cost</th>
                        <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Region</th>
                        <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Recommendation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {sortedRisks.map((r, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/50 transition-colors duration-150 group/row animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className={getServiceColor(r.service)}>{getServiceIcon(r.service)}</div>
                              <div>
                                <p className="text-gray-300 font-mono text-xs group-hover/row:text-red-400 transition-colors">{r.name}</p>
                                {r.type && <p className="text-xs text-gray-500">{r.type}</p>}
                                {r.engine && <p className="text-xs text-gray-500">{r.engine}</p>}
                                {r.runtime && <p className="text-xs text-gray-500">{r.runtime}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="text-gray-300">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              r.service === "EC2" ? "bg-blue-500/10 text-blue-400" :
                              r.service === "S3" ? "bg-green-500/10 text-green-400" :
                              r.service === "RDS" ? "bg-yellow-500/10 text-yellow-400" :
                              "bg-purple-500/10 text-purple-400"
                            }`}>
                              {r.service}
                            </span>
                          </td>
                          <td className="text-gray-300">{r.issue}</td>
                          <td className="text-gray-300">{r.impact}</td>
                          <td>
                            <div className="flex items-center gap-1">
                              {getSeverityIcon(r.severity)}
                              <span className={`text-xs ${r.severity === "high" ? "text-red-400" : r.severity === "medium" ? "text-yellow-400" : "text-blue-400"}`}>
                                {r.severity.charAt(0).toUpperCase() + r.severity.slice(1)}
                              </span>
                            </div>
                          </td>
                          <td className="text-red-400 font-medium">${r.cost?.toFixed(2)}</td>
                          <td className="text-gray-400 text-xs">{r.region}</td>
                          <td className="text-xs text-gray-400">{r.fix}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {sortedRisks.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-gray-500">
                  <span>Showing {sortedRisks.length} risks</span>
                  <span className="text-red-400">Total potential waste: ${totalRiskCost.toFixed(2)}/month</span>
                </div>
              )}
            </div>
          </div>

          {/* Cost Risk & Insights */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="group relative animate-slide-up animation-delay-300">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300"><DollarSign className="w-5 h-5 text-emerald-400" /></div><h3 className="text-lg font-semibold text-white">Cost Risk Analysis</h3></div>
                <p className="text-4xl font-bold text-red-400 mb-2">${totalRiskCost.toFixed(2)}</p>
                <p className="text-xs text-gray-400">Estimated wasted cost per month</p>
                <div className="mt-6 space-y-3">
                  {serviceBreakdown.EC2 > 0 && <div key="ec2-risk" className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg"><div className="flex items-center gap-2"><Server className="w-4 h-4 text-blue-400" /><span className="text-sm text-gray-300">EC2 Risks</span></div><span className="text-red-400 font-medium">${(serviceBreakdown.EC2 * 10).toFixed(2)}</span></div>}
                  {serviceBreakdown.Lambda > 0 && <div key="lambda-risk" className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg"><div className="flex items-center gap-2"><Layers className="w-4 h-4 text-purple-400" /><span className="text-sm text-gray-300">Lambda Risks</span></div><span className="text-red-400 font-medium">${(serviceBreakdown.Lambda * 5).toFixed(2)}</span></div>}
                  {serviceBreakdown.RDS > 0 && <div key="rds-risk" className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg"><div className="flex items-center gap-2"><Database className="w-4 h-4 text-yellow-400" /><span className="text-sm text-gray-300">RDS Risks</span></div><span className="text-red-400 font-medium">${(serviceBreakdown.RDS * 15).toFixed(2)}</span></div>}
                  {serviceBreakdown.S3 > 0 && <div key="s3-risk" className="flex justify-between items-center p-3 bg-slate-800/30 rounded-lg"><div className="flex items-center gap-2"><HardDrive className="w-4 h-4 text-green-400" /><span className="text-sm text-gray-300">S3 Risks</span></div><span className="text-red-400 font-medium">${(serviceBreakdown.S3 * 5).toFixed(2)}</span></div>}
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="group relative animate-slide-up animation-delay-400">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300">
                <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-purple-500/10 rounded-xl group-hover:scale-110 transition-transform duration-300"><Sparkles className="w-5 h-5 text-purple-400 animate-pulse" /></div><h3 className="text-lg font-semibold text-white">AI-Powered Insights</h3></div>
                <div className="space-y-3">
                  {insights.length > 0 ? insights.map((insight: string, idx: number) => (
                    <InsightCard key={idx} type={insight.includes("⚠") ? "warning" : insight.includes("✅") ? "success" : "info"} title={insight.split(":")[0] || "Insight"} message={insight} />
                  )) : (
                    <>
                      {serviceBreakdown.Lambda > 0 && <InsightCard key="lambda-insight" type="warning" title="Unused Lambda Functions" message={`Remove ${serviceBreakdown.Lambda} unused Lambda functions to save $${(serviceBreakdown.Lambda * 5).toFixed(2)}/month`} />}
                      {serviceBreakdown.EC2 > 0 && <InsightCard key="ec2-insight" type="warning" title="EC2 Risks Detected" message={`${serviceBreakdown.EC2} EC2 instances need attention to optimize costs`} />}
                      {serviceBreakdown.S3 > 0 && <InsightCard key="s3-insight" type="info" title="S3 Optimization Opportunity" message="Review bucket lifecycle policies to reduce storage costs" />}
                      {serviceBreakdown.RDS > 0 && <InsightCard key="rds-insight" type="danger" title="RDS Issues Detected" message={`${serviceBreakdown.RDS} databases need immediate attention`} />}
                      {severityBreakdown.high > 0 && <InsightCard key="high-risk-insight" type="danger" title="Critical Risks" message={`${severityBreakdown.high} high-severity risks require immediate action`} />}
                      {risks.length === 0 && <InsightCard key="healthy-insight" type="success" title="All Systems Healthy" message="No risks detected in your infrastructure. Great job!" />}
                      {totalRiskCost > 100 && <InsightCard key="high-waste-insight" type="warning" title="High Waste Detected" message={`Potential savings of $${totalRiskCost.toFixed(2)}/month - review recommendations`} />}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Footer */}
          <div className="text-center text-xs text-gray-600 pt-4 border-t border-slate-800/50">
            <p>Last full scan: {lastUpdated.toLocaleString()} • {risks.length} risks identified across {ec2.length + s3.length + rds.length + lambda.length} resources</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
        .animate-blob { animation: blob 7s infinite; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
        @keyframes slide-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .animation-delay-100 { animation-delay: 100ms; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-300 { animation-delay: 300ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animation-delay-500 { animation-delay: 500ms; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}

function KPICard({ title, value, icon: Icon, color, badge }: any) {
  const colors = { red: 'from-red-500 to-orange-600', yellow: 'from-yellow-500 to-orange-500', blue: 'from-blue-500 to-purple-600', green: 'from-green-500 to-emerald-600', purple: 'from-purple-500 to-pink-600' };
  const iconColors = { red: 'text-red-400', yellow: 'text-yellow-400', blue: 'text-blue-400', green: 'text-green-400', purple: 'text-purple-400' };
  const badgeColors = { red: 'bg-red-500/20 text-red-400', yellow: 'bg-yellow-500/20 text-yellow-400', blue: 'bg-blue-500/20 text-blue-400', green: 'bg-green-500/20 text-green-400', purple: 'bg-purple-500/20 text-purple-400' };
  return (
    <div className="group relative">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors[color]} rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500`}></div>
      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl p-5 border border-slate-800 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] transition-all duration-300">
        <div className="flex items-start justify-between">
          <div><p className="text-gray-500 text-sm mb-2">{title}</p><div className="flex items-baseline gap-2"><p className="text-3xl font-bold text-white group-hover:scale-105 transition-transform duration-300">{value}</p>{badge && <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColors[color]} animate-pulse`}>{badge}</span>}</div></div>
          <div className={`p-3 rounded-xl bg-${color}-500/10 group-hover:scale-110 transition-transform duration-300`}><Icon className={`w-5 h-5 ${iconColors[color]}`} /></div>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ title, value, icon: Icon, color }: any) {
  const iconColors = { blue: 'text-blue-400', green: 'text-green-400', yellow: 'text-yellow-400', purple: 'text-purple-400' };
  const bgColors = { blue: 'bg-blue-500/10', green: 'bg-green-500/10', yellow: 'bg-yellow-500/10', purple: 'bg-purple-500/10' };
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-xl p-5 border border-slate-800 hover:border-red-500/40 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] transition-all duration-300">
        <div className="flex items-center gap-3"><div className={`p-2 ${bgColors[color]} rounded-lg group-hover:scale-110 transition-transform duration-300`}><Icon className={`w-4 h-4 ${iconColors[color]}`} /></div><div><p className="text-gray-400 text-sm">{title}</p><p className="text-xl font-bold text-white">{value}</p></div></div>
      </div>
    </div>
  );
}

function InsightCard({ type, title, message }: any) {
  const types = {
    success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: '✅', text: 'text-emerald-400' },
    warning: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: '⚠️', text: 'text-yellow-400' },
    danger: { bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '🚨', text: 'text-red-400' },
    info: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '💡', text: 'text-blue-400' },
  };
  const config = types[type] || types.info;
  return (
    <div className={`${config.bg} border ${config.border} rounded-xl p-4 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg group`}>
      <div className="flex items-start gap-3"><span className={`${config.text} text-xl group-hover:scale-110 transition-transform duration-300`}>{config.icon}</span><div><p className={`${config.text} text-sm font-medium mb-1`}>{title}</p><p className="text-gray-300 text-sm">{message}</p></div></div>
    </div>
  );
}
