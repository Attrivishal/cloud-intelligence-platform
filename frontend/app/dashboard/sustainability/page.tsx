"use client";

import { useEffect, useState } from "react";
import { fetchSustainability } from "@/lib/api";
import Card from "@/components/Card";

export default function SustainabilityPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchSustainability();
        setData(res);
      } catch (err) {
        console.error("Sustainability Load Error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1929] flex items-center justify-center relative overflow-hidden">
        {/* Animated nature-inspired background */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl"></div>
        
        <div className="relative text-center">
          <div className="relative">
            {/* Animated leaf spinner */}
            <div className="w-20 h-20 relative mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
              <div className="absolute inset-2 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full animate-pulse opacity-20"></div>
              <svg className="absolute inset-0 w-full h-full text-emerald-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-200 mt-4 font-medium text-lg">Analyzing sustainability metrics...</p>
          <p className="text-xs text-emerald-400/70 mt-2">Calculating carbon footprint & green efficiency</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const {
    total_running_instances,
    estimated_daily_carbon_kg,
    sustainability_score,
    rating,
    recommendation,
    green_efficiency_level,
  } = data;

  const formattedCarbon =
    estimated_daily_carbon_kg < 0.001
      ? estimated_daily_carbon_kg.toFixed(6)
      : estimated_daily_carbon_kg.toFixed(2);

  // 🔥 Upgrade 2: Dynamic score color
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getRatingColor = (value: string) => {
    if (value === "Excellent") return { 
      text: "text-emerald-400", 
      bg: "bg-emerald-500/10", 
      border: "border-emerald-500/20",
      gradient: "from-emerald-500 to-emerald-400",
      icon: "🌟"
    };
    if (value === "Good") return { 
      text: "text-yellow-400", 
      bg: "bg-yellow-500/10", 
      border: "border-yellow-500/20",
      gradient: "from-yellow-500 to-yellow-400",
      icon: "🌱"
    };
    return { 
      text: "text-red-400", 
      bg: "bg-red-500/10", 
      border: "border-red-500/20",
      gradient: "from-red-500 to-red-400",
      icon: "⚠️"
    };
  };

  const ratingStyle = getRatingColor(rating);

  const getEfficiencyColor = (level: string) => {
    switch(level) {
      case "High": return { text: "text-emerald-400", bg: "bg-emerald-500/10", bar: "bg-emerald-500" };
      case "Medium": return { text: "text-yellow-400", bg: "bg-yellow-500/10", bar: "bg-yellow-500" };
      default: return { text: "text-red-400", bg: "bg-red-500/10", bar: "bg-red-500" };
    }
  };

  const efficiencyStyle = getEfficiencyColor(green_efficiency_level);

  // 🔥 Upgrade 1: Context for carbon
  const getCarbonContext = () => {
    if (estimated_daily_carbon_kg < 0.001) {
      return "Equivalent to charging a smartphone once.";
    }
    if (estimated_daily_carbon_kg < 0.1) {
      return "Extremely low emission footprint.";
    }
    if (estimated_daily_carbon_kg < 1) {
      return "Equivalent to driving 1 mile in a car.";
    }
    return "Significant carbon footprint. Consider optimization.";
  };

  // 🔥 Upgrade 3: Green status badge
  const getGreenStatus = () => {
    if (sustainability_score >= 85) return "🟢 Carbon Efficient";
    if (sustainability_score >= 60) return "🟡 Moderate Impact";
    return "🔴 High Impact";
  };

  return (
    <div className="min-h-screen bg-[#0A1929] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 relative">
      
      {/* Premium Nature-Inspired Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Organic Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMGgzMHYzMEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTBCOC1CIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-20 pointer-events-none"></div>

      {/* ================= PREMIUM HEADER ================= */}
      <div className="relative">
        <div className="absolute -top-6 -left-6 w-20 h-20 bg-emerald-500/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-green-500/20 rounded-full blur-2xl"></div>
        
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0F1F2F]/50 to-[#1A2A4A]/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition"></div>
              <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-2xl">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight">
                  Sustainability Intelligence
                </h1>
                {/* 🔥 Upgrade 3: Green Status Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  sustainability_score >= 85 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  sustainability_score >= 60 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                  'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {getGreenStatus()}
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Monitor carbon footprint & infrastructure sustainability metrics
              </p>
            </div>
          </div>
          
          {/* Green Efficiency Badge */}
          <div className={`px-4 py-2 rounded-xl ${efficiencyStyle.bg} border border-white/10 flex items-center gap-2`}>
            <span className="text-sm font-medium text-gray-300">Green Efficiency:</span>
            <span className={`text-sm font-bold ${efficiencyStyle.text}`}>{green_efficiency_level}</span>
          </div>
        </div>
      </div>

      {/* ================= MAIN KPI GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Sustainability Score Card */}
        <div 
          className="group relative bg-gradient-to-br from-[#0F1F2F] to-[#1A2A4A] rounded-2xl border border-white/10 p-6 hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/20"
          onMouseEnter={() => setHoveredCard("score")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Sustainability Score</p>
                <div className="flex items-baseline gap-2 mt-1">
                  {/* 🔥 Upgrade 2: Dynamic color based on score */}
                  <h2 className={`text-4xl font-bold ${getScoreColor(sustainability_score)}`}>
                    {sustainability_score.toFixed(2)}
                  </h2>
                  <span className="text-xs text-gray-500">/100</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition"></div>
                <div className="relative w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">AI-calculated green index</span>
                <span className="text-gray-300">{sustainability_score.toFixed(1)}%</span>
              </div>
              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${
                    sustainability_score >= 85 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                    sustainability_score >= 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                    'bg-gradient-to-r from-red-500 to-red-400'
                  }`}
                  style={{ width: `${sustainability_score}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>

            {/* Decorative leaf animation */}
            <div className="absolute -bottom-2 -right-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-16 h-16 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Rating Card */}
        <div 
          className="group relative bg-gradient-to-br from-[#0F1F2F] to-[#1A2A4A] rounded-2xl border border-white/10 p-6 hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/20"
          onMouseEnter={() => setHoveredCard("rating")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Overall Rating</p>
                <div className="flex items-center gap-2 mt-1">
                  <h2 className={`text-4xl font-bold ${ratingStyle.text}`}>
                    {rating}
                  </h2>
                  <span className="text-2xl">{ratingStyle.icon}</span>
                </div>
              </div>
              <div className={`relative w-12 h-12 rounded-xl ${ratingStyle.bg} flex items-center justify-center`}>
                <div className={`absolute inset-0 ${ratingStyle.bg} rounded-xl blur opacity-20`}></div>
                <svg className={`w-6 h-6 ${ratingStyle.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
            
            <div className={`inline-flex px-3 py-1 rounded-full text-xs ${efficiencyStyle.bg} ${efficiencyStyle.text} border border-white/10`}>
              Green Efficiency: {green_efficiency_level}
            </div>
          </div>
        </div>

        {/* Running Instances Card */}
        <div 
          className="group relative bg-gradient-to-br from-[#0F1F2F] to-[#1A2A4A] rounded-2xl border border-white/10 p-6 hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/20"
          onMouseEnter={() => setHoveredCard("instances")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Running Instances</p>
                <h2 className="text-4xl font-bold text-white mt-1">
                  {total_running_instances}
                </h2>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition"></div>
                <div className="relative w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Active infrastructure contributing to carbon usage
            </p>
          </div>
        </div>

        {/* Carbon Footprint Card */}
        <div 
          className="group relative bg-gradient-to-br from-[#0F1F2F] to-[#1A2A4A] rounded-2xl border border-white/10 p-6 hover:border-emerald-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/20"
          onMouseEnter={() => setHoveredCard("carbon")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Daily Carbon</p>
                <h2 className="text-3xl font-bold text-white mt-1">
                  {formattedCarbon}
                </h2>
                <p className="text-xs text-gray-400">kg CO₂</p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition"></div>
                <div className="relative w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Carbon impact visualization */}
            <div className="mt-4 flex items-center gap-1">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden"
                >
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.random() * 100}%` }}
                  ></div>
                </div>
              ))}
            </div>

            {/* 🔥 Upgrade 1: Carbon Context */}
            <p className="text-xs text-gray-500 mt-3">
              {getCarbonContext()}
            </p>
          </div>
        </div>
      </div>

      {/* ================= CARBON METRIC DETAIL ================= */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition duration-1000"></div>
        
        <div className="relative bg-gradient-to-br from-[#0F1F2F] to-[#1A2A4A] rounded-xl border border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg blur opacity-50"></div>
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Carbon Footprint Analysis</h3>
              <p className="text-xs text-gray-400">Real-time emission tracking</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Daily Impact */}
            <div className="bg-white/5 rounded-lg p-5 border border-white/10">
              <p className="text-xs text-gray-400 mb-2">Daily Impact</p>
              <p className="text-2xl font-bold text-white">{formattedCarbon} kg CO₂</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-emerald-500 rounded-full"></div>
                </div>
                <span className="text-xs text-gray-400">75%</span>
              </div>
              {/* 🔥 Upgrade 1: Carbon Context */}
              <p className="text-xs text-gray-500 mt-2">
                {getCarbonContext()}
              </p>
            </div>

            {/* Monthly Projection */}
            <div className="bg-white/5 rounded-lg p-5 border border-white/10">
              <p className="text-xs text-gray-400 mb-2">Monthly Projection</p>
              <p className="text-2xl font-bold text-white">
                {(estimated_daily_carbon_kg * 30).toFixed(2)} kg
              </p>
              <p className="text-xs text-emerald-400 mt-2">↓ 12% vs last month</p>
            </div>

            {/* Trees Offset Equivalent */}
            <div className="bg-white/5 rounded-lg p-5 border border-white/10">
              <p className="text-xs text-gray-400 mb-2">Trees Needed to Offset</p>
              <p className="text-2xl font-bold text-white">
                {Math.ceil(estimated_daily_carbon_kg * 0.15)}
              </p>
              <p className="text-xs text-gray-400 mt-2">per day</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= AI RECOMMENDATION ================= */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition duration-1000"></div>
        
        <div className={`relative bg-gradient-to-br from-[#0F1F2F] to-[#1A2A4A] rounded-xl border ${ratingStyle.border} p-8`}>
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-xl"></div>
              <div className={`relative w-16 h-16 rounded-2xl ${ratingStyle.bg} border ${ratingStyle.border} flex items-center justify-center text-3xl`}>
                🌱
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-emerald-400">
                  AI Sustainability Recommendation
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs ${ratingStyle.bg} ${ratingStyle.text}`}>
                  {rating} Rating
                </span>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {recommendation}
              </p>
              
              {/* Impact Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Potential Carbon Reduction</p>
                  <p className="text-lg font-bold text-emerald-400">-15%</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Annual Savings</p>
                  <p className="text-lg font-bold text-emerald-400">$2.4K</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Green Score Impact</p>
                  <p className="text-lg font-bold text-emerald-400">+8 pts</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105">
                  Implement Recommendations
                </button>
                <button className="px-6 py-3 border border-white/10 rounded-xl text-gray-300 hover:bg-white/5 transition-all duration-300">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        @keyframes leaf-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-leaf-float {
          animation: leaf-float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
