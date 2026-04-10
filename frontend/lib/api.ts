const API_BASE = "http://127.0.0.1:8000/dashboard";

/* ================= OVERVIEW ================= */

export async function fetchOverview() {
  const res = await fetch(`${API_BASE}/overview`);
  return res.json();
}

/* ================= COST ================= */

export async function fetchCostTrend() {
  const res = await fetch(`${API_BASE}/cost/trend`);
  return res.json();
}

/* ================= PERFORMANCE ================= */

export async function fetchCpuTrend() {
  const res = await fetch(`${API_BASE}/performance/cpu-trend`);
  return res.json();
}

/* ================= OPTIMIZATION ================= */

export async function fetchOptimization() {
  const res = await fetch(`${API_BASE}/optimization`);
  return res.json();
}

export async function fetchOptimizationSummary() {
  const res = await fetch(`${API_BASE}/optimization/summary`);
  return res.json();
}

/* ================= INFRASTRUCTURE ================= */

export async function fetchInfrastructure() {
  const res = await fetch(`${API_BASE}/infrastructure`);
  return res.json();
}

/* ================= FORECAST ================= */

export async function fetchForecast() {
  const res = await fetch(`${API_BASE}/forecast`);
  return res.json();
}

/* ================= SUSTAINABILITY ================= */

export async function fetchSustainability() {
  const res = await fetch(`${API_BASE}/sustainability`);
  return res.json();
}

/* ================= RISK ================= */

export async function fetchRiskAnalysis() {
  const res = await fetch(`${API_BASE}/risk-analysis`);
  return res.json();
}

export async function fetchRiskTrend() {
  const res = await fetch(`${API_BASE}/risk-trend`);
  return res.json();
}
