"use client";

import { useEffect, useState } from "react";
import { fetchForecast } from "@/lib/api";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ForecastPage() {
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("area");
  const [showConfidence, setShowConfidence] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchForecast();
        setForecast(data);
      } catch (err) {
        console.error("Forecast error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1929] flex items-center justify-center relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-[#4A6FA5]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-[#2D3A5E]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#2D3A5E] border-t-[#4A6FA5] rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-gradient-to-r from-[#4A6FA5] to-[#5B7AB5] rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
          <p className="text-gray-200 mt-4 font-medium">Loading AI Forecast Engine...</p>
          <p className="text-xs text-[#4A6FA5]/70 mt-2">Analyzing cost patterns & trends</p>
        </div>
      </div>
    );
  }

  if (!forecast) {
    return (
      <div className="min-h-screen bg-[#0A1929] flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <p className="text-red-400">Failed to load forecast data</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-sm text-[#4A6FA5] hover:text-[#5B7AB5] transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const {
    model,
    forecast_days,
    forecast: forecastArray,
    predicted_total_30_days,
    forecast_trend_direction,
    confidence_level,
  } = forecast;

  const chartData =
    forecastArray?.map((item: any, index: number) => ({
      day: `Day ${index + 1}`,
      predicted: item.predicted_cost || 0,
      lower: (item.predicted_cost || 0) * 0.9,
      upper: (item.predicted_cost || 0) * 1.1,
    })) || [];

  const predictedTotal = predicted_total_30_days || 0;

  const avgDaily =
    forecast_days > 0 ? predictedTotal / forecast_days : 0;

  const peakValue = chartData.length
    ? Math.max(...chartData.map((d: any) => d.predicted))
    : 0;

  const minValue = chartData.length
    ? Math.min(...chartData.map((d: any) => d.predicted))
    : 0;

  const trendColor =
    forecast_trend_direction === "Increasing"
      ? "text-red-400"
      : forecast_trend_direction === "Decreasing"
      ? "text-emerald-400"
      : "text-gray-400";

  const trendBgColor =
    forecast_trend_direction === "Increasing"
      ? "bg-red-500/10"
      : forecast_trend_direction === "Decreasing"
      ? "bg-emerald-500/10"
      : "bg-gray-500/10";

  const getConfidenceColor = (level: number) => {
    if (level >= 90) return "text-emerald-400";
    if (level >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const getConfidenceBgColor = (level: number) => {
    if (level >= 90) return "bg-emerald-500/10";
    if (level >= 70) return "bg-yellow-500/10";
    return "bg-red-500/10";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0F1F2F] border border-white/10 rounded-lg p-4 shadow-2xl backdrop-blur-xl">
          <p className="text-white text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-gray-400">{entry.name}:</span>
              <span className="text-white font-medium">${entry.value.toFixed(2)}</span>
            </div>
          ))}
          {payload[0] && (
            <p className="text-xs text-gray-500 mt-2 border-t border-white/5 pt-2">
              Confidence: {confidence_level}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const timeframeOptions = ["7d", "14d", "30d", "90d"];

  return (
    <div className="min-h-screen bg-[#0A1929] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 relative">
      
      {/* Premium Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -left-20 w-80 h-80 bg-gradient-to-br from-[#2D3A5E]/20 to-[#4A6FA5]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 -right-20 w-80 h-80 bg-gradient-to-br from-[#4A6FA5]/20 to-[#5B7AB5]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#2D3A5E]/10 via-[#4A6FA5]/10 to-[#5B7AB5]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMGgzMHYzMEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMkQzQTVFIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-20 pointer-events-none"></div>

      {/* ================= PREMIUM HEADER ================= */}
      <div className="relative">
        <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#4A6FA5]/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-[#5B7AB5]/20 rounded-full blur-2xl"></div>
        
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0F1F2F]/50 to-[#1A2A4A]/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4A6FA5] to-[#5B7AB5] rounded-xl blur opacity-50 group-hover:opacity-75 transition"></div>
              <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-[#2D3A5E] to-[#4A6FA5] flex items-center justify-center shadow-2xl">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight">
                  AI Cost Forecast
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceBgColor(confidence_level)} ${getConfidenceColor(confidence_level)} border border-white/10`}>
                  {confidence_level}% Confidence
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#4A6FA5] rounded-full animate-pulse"></span>
                {forecast_days}-day projection using {model}
              </p>
            </div>
          </div>
          
          {/* Model Badge */}
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
            <svg className="w-4 h-4 text-[#4A6FA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-300">Model:</span>
            <span className="text-sm font-bold text-white">{model}</span>
          </div>
        </div>
      </div>

      {/* ================= KPI GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* 30-Day Prediction Card */}
        <div 
          className="group relative bg-gradient-to-br from-[#0F1F2F] to-[#1A2A4A] rounded-2xl border border-white/10 p-6 hover:border-[#4A6FA5]/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#4A6FA5]/20"
          onMouseEnter={() => setHoveredCard("prediction")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A6FA5]/0 via-[#4A6FA5]/5 to-[#4A6FA5]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">30-Day Prediction</p>
                <h2 className="text-3xl font-bold text-white mt-1">
                  ${predictedTotal.toFixed(2)}
                </h2>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-[#4A6FA5] rounded-xl blur opacity-20 group-hover:opacity-30 transition"></div>
                <div className="relative w-12 h-12 rounded-xl bg-[#4A6FA5]/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#4A6FA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400">Across {forecast_days} days</p>
          </div>
        </div>

        {/* Average Daily Card */}
        <div 
          className="group relative bg-gradient-to-br from-[#0F1F2F] to-[#1A2A4A] rounded-2xl border border-white/10 p-6 hover:border-[#4A6FA5]/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#4A6FA5]/20"
          onMouseEnter={() => setHoveredCard("average")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A6FA5]/0 via-[#4A6FA5]/5 to-[#4A6FA5]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Average Daily</p>
                <h2 className="text-3xl font-bold text-white mt-1">
                  ${avgDaily.toFixed(2)}
                </h2>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-[#4A6FA5] rounded-xl blur opacity-20 group-hover:opacity-30 transition"></div>
                <div className="relative w-12 h-12 rounded-xl bg-[#4A6FA5]/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#4A6FA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400">Per day average</p>
          </div>
        </div>

        {/* Trend Card */}
        <div 
          className="group relative bg-gradient-to-br from-[#0F1F2F] to-[#1A2A4A] rounded-2xl border border-white/10 p-6 hover:border-[#4A6FA5]/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#4A6FA5]/20"
          onMouseEnter={() => setHoveredCard("trend")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A6FA5]/0 via-[#4A6FA5]/5 to-[#4A6FA5]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Trend</p>
                <h2 className={`text-3xl font-bold ${trendColor} mt-1`}>
                  {forecast_trend_direction}
                </h2>
              </div>
              <div className={`relative w-12 h-12 rounded-xl ${trendBgColor} flex items-center justify-center`}>
                <div className={`absolute inset-0 ${trendBgColor} rounded-xl blur opacity-20`}></div>
                <svg className={`w-6 h-6 ${trendColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {forecast_trend_direction === "Increasing" ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  ) : forecast_trend_direction === "Decreasing" ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                  )}
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <div className={`w-full h-1.5 bg-white/10 rounded-full overflow-hidden`}>
                <div 
                  className={`h-full rounded-full ${
                    forecast_trend_direction === "Increasing" ? 'bg-red-500' : 
                    forecast_trend_direction === "Decreasing" ? 'bg-emerald-500' : 'bg-gray-500'
                  }`}
                  style={{ width: '70%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Confidence Card */}
        <div 
          className="group relative bg-gradient-to-br from-[#0F1F2F] to-[#1A2A4A] rounded-2xl border border-white/10 p-6 hover:border-[#4A6FA5]/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#4A6FA5]/20"
          onMouseEnter={() => setHoveredCard("confidence")}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A6FA5]/0 via-[#4A6FA5]/5 to-[#4A6FA5]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Confidence</p>
                <h2 className={`text-3xl font-bold ${getConfidenceColor(confidence_level)} mt-1`}>
                  {confidence_level}%
                </h2>
              </div>
              <div className={`relative w-12 h-12 rounded-xl ${getConfidenceBgColor(confidence_level)} flex items-center justify-center`}>
                <div className={`absolute inset-0 ${getConfidenceBgColor(confidence_level)} rounded-xl blur opacity-20`}></div>
                <svg className={`w-6 h-6 ${getConfidenceColor(confidence_level)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Model accuracy</span>
                <span className="text-gray-300">{confidence_level}%</span>
              </div>
              <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${
                    confidence_level >= 90 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                    confidence_level >= 70 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                    'bg-gradient-to-r from-red-500 to-red-400'
                  }`}
                  style={{ width: `${confidence_level}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CHART ================= */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#4A6FA5] to-[#5B7AB5] rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition duration-1000"></div>
        
        <div className="relative bg-gradient-to-br from-[#0F1F2F] to-[#1A2A4A] rounded-xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#2D3A5E] to-[#4A6FA5] rounded-lg blur opacity-50"></div>
                <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-[#2D3A5E] to-[#4A6FA5] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Cost Forecast Projection</h3>
                <p className="text-xs text-gray-400">30-day forward-looking analysis</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
                {[
                  { id: "area", icon: "📈", label: "Area" },
                  { id: "line", icon: "📊", label: "Line" },
                  { id: "bar", icon: "📋", label: "Bar" }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setView(type.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300 flex items-center gap-1 ${
                      view === type.id
                        ? "bg-gradient-to-r from-[#2D3A5E] to-[#4A6FA5] text-white shadow-lg"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span className="hidden sm:inline">{type.label}</span>
                  </button>
                ))}
              </div>

              {/* Confidence Toggle */}
              <button
                onClick={() => setShowConfidence(!showConfidence)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                  showConfidence 
                    ? 'bg-[#4A6FA5]/20 text-[#4A6FA5] border border-[#4A6FA5]/30' 
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  {showConfidence && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4A6FA5] opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${showConfidence ? 'bg-[#4A6FA5]' : 'bg-gray-500'}`}></span>
                </span>
                Confidence Band
              </button>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {view === "area" ? (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4A6FA5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4A6FA5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D3A5E" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2D3A5E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A2A4A" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#6B7280" 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickLine={{ stroke: '#1A2A4A' }}
                  />
                  <YAxis 
                    stroke="#6B7280" 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickLine={{ stroke: '#1A2A4A' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {showConfidence && (
                    <Area
                      type="monotone"
                      dataKey="upper"
                      stroke="transparent"
                      fill="url(#confidenceGradient)"
                      name="Upper Bound"
                    />
                  )}

                  <Area
                    type="monotone"
                    dataKey="predicted"
                    stroke="#4A6FA5"
                    strokeWidth={2}
                    fill="url(#predictedGradient)"
                    name="Predicted Cost"
                    dot={{ fill: '#4A6FA5', r: 2 }}
                    activeDot={{ r: 6, fill: '#4A6FA5', stroke: '#fff', strokeWidth: 2 }}
                  />

                  {showConfidence && (
                    <Area
                      type="monotone"
                      dataKey="lower"
                      stroke="transparent"
                      fill="url(#confidenceGradient)"
                      name="Lower Bound"
                    />
                  )}
                </AreaChart>
              ) : view === "line" ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A2A4A" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#6B7280" 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickLine={{ stroke: '#1A2A4A' }}
                  />
                  <YAxis 
                    stroke="#6B7280" 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickLine={{ stroke: '#1A2A4A' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#4A6FA5"
                    strokeWidth={3}
                    dot={{ fill: '#4A6FA5', r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 8, fill: '#4A6FA5', stroke: '#fff', strokeWidth: 2 }}
                    name="Predicted Cost"
                  />

                  {showConfidence && (
                    <>
                      <Line
                        type="monotone"
                        dataKey="upper"
                        stroke="#2D3A5E"
                        strokeWidth={1}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Upper Bound"
                      />
                      <Line
                        type="monotone"
                        dataKey="lower"
                        stroke="#2D3A5E"
                        strokeWidth={1}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Lower Bound"
                      />
                    </>
                  )}
                </LineChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A2A4A" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#6B7280" 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickLine={{ stroke: '#1A2A4A' }}
                  />
                  <YAxis 
                    stroke="#6B7280" 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    tickLine={{ stroke: '#1A2A4A' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="predicted" 
                    fill="#4A6FA5" 
                    radius={[4, 4, 0, 0]}
                    name="Predicted Cost"
                  >
                    {chartData.map((entry, index) => (
                      <rect
                        key={`bar-${index}`}
                        fill="url(#barGradient)"
                      />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4A6FA5" stopOpacity={1} />
                      <stop offset="100%" stopColor="#2D3A5E" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#4A6FA5]"></div>
                <span className="text-xs text-gray-400">Predicted Cost</span>
              </div>
              {showConfidence && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#2D3A5E]"></div>
                  <span className="text-xs text-gray-400">Confidence Range</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-4 text-xs">
              <div>
                <span className="text-gray-500">Min: </span>
                <span className="text-white font-medium">${minValue.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-500">Max: </span>
                <span className="text-white font-medium">${peakValue.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-500">Range: </span>
                <span className="text-white font-medium">${(peakValue - minValue).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= WARNING BANNER ================= */}
      {peakValue === 0 && (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition duration-1000"></div>
          <div className="relative bg-gradient-to-br from-[#0F1F2F] to-[#1A2A4A] rounded-xl border border-yellow-500/20 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-2xl">
                ⚠️
              </div>
              <div>
                <h4 className="text-yellow-400 font-semibold mb-1">Low Variation Detected</h4>
                <p className="text-gray-300 text-sm">
                  No significant variation detected in forecast. Check historical cost input for better accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STATISTICS SECTION ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Min/Max Range */}
        <div className="bg-gradient-to-br from-[#0F1F2F] to-[#1A2A4A] rounded-xl border border-white/10 p-5">
          <p className="text-xs text-gray-400 mb-2">Forecast Range</p>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-300">Min</span>
            <span className="text-sm text-gray-300">Max</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-xl font-bold text-white">${minValue.toFixed(2)}</span>
            <span className="text-xl font-bold text-white">${peakValue.toFixed(2)}</span>
          </div>
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-gradient-to-r from-[#4A6FA5] to-[#5B7AB5] rounded-full"
              style={{ width: `${(peakValue - minValue) / peakValue * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Volatility Indicator */}
        <div className="bg-gradient-to-br from-[#0F1F2F] to-[#1A2A4A] rounded-xl border border-white/10 p-5">
          <p className="text-xs text-gray-400 mb-2">Forecast Volatility</p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-300">Stability</span>
                <span className="text-sm font-bold text-emerald-400">
                  {((1 - (peakValue - minValue) / peakValue) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="absolute h-full bg-emerald-500 rounded-full"
                  style={{ width: `${((1 - (peakValue - minValue) / peakValue) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs ${
              (peakValue - minValue) / peakValue < 0.2 ? 'bg-emerald-500/10 text-emerald-400' :
              (peakValue - minValue) / peakValue < 0.4 ? 'bg-yellow-500/10 text-yellow-400' :
              'bg-red-500/10 text-red-400'
            }`}>
              {(peakValue - minValue) / peakValue < 0.2 ? 'Low' :
               (peakValue - minValue) / peakValue < 0.4 ? 'Medium' : 'High'}
            </div>
          </div>
        </div>

        {/* Model Info */}
        <div className="bg-gradient-to-br from-[#0F1F2F] to-[#1A2A4A] rounded-xl border border-white/10 p-5">
          <p className="text-xs text-gray-400 mb-2">Model Information</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Algorithm</span>
              <span className="text-sm font-medium text-white">{model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Data Points</span>
              <span className="text-sm font-medium text-white">{chartData.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Last Trained</span>
              <span className="text-sm font-medium text-white">{new Date().toLocaleDateString()}</span>
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
      `}</style>
    </div>
  );
}

function StatCard({ title, value, valueColor = "text-white" }: any) {
  return (
    <div className="bg-[#0F1F2F] border border-white/10 rounded-xl p-5">
      <p className="text-xs text-gray-400 mb-2">{title}</p>
      <p className={`text-xl font-bold ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}
