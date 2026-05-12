const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const API_BASE = `${API_URL}/dashboard`;
const AWS_BASE = `${API_URL}/aws`;


/* ================= HELPER ================= */

async function apiFetch(endpoint: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  console.log(`Fetching from: ${endpoint}`);
  const res = await fetch(endpoint, {
    mode: "cors",
    credentials: "omit", // Use omit if not using cookies, or include if using cookies
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error ${res.status}: ${errorText || res.statusText}`);
  }
  return res.json();
}


/* ================= OVERVIEW ================= */

export async function fetchOverview() {
  return apiFetch(`${API_BASE}/overview`);
}

/* ================= COST ================= */

export async function fetchCostTrend(days: number = 30) {
  return apiFetch(`${API_BASE}/cost/trend?days=${days}`);
}


/* ================= PERFORMANCE ================= */

export async function fetchCpuTrend() {
  return apiFetch(`${API_BASE}/performance/cpu-trend`);
}

/* ================= OPTIMIZATION ================= */

export async function fetchOptimization() {
  return apiFetch(`${API_BASE}/optimization`);
}

export async function fetchOptimizationSummary() {
  return apiFetch(`${API_BASE}/optimization/summary`);
}

/* ================= INFRASTRUCTURE ================= */

export async function fetchInfrastructure() {
  return apiFetch(`${API_BASE}/infrastructure`);
}

/* ================= FORECAST ================= */

export async function fetchForecast() {
  return apiFetch(`${API_BASE}/forecast`);
}

/* ================= SUSTAINABILITY ================= */

export async function fetchSustainability() {
  return apiFetch(`${API_BASE}/sustainability`);
}

/* ================= RISK ================= */

export async function fetchRiskAnalysis() {
  return apiFetch(`${API_BASE}/risk-analysis`);
}

export async function fetchRiskTrend() {
  return apiFetch(`${API_BASE}/risk-trend`);
}

/* ================= AWS SERVICES ================= */

export async function fetchEC2() {
  const data = await apiFetch(`${AWS_BASE}/ec2/`);
  return data.instances || [];
}

export async function fetchS3() {
  const data = await apiFetch(`${AWS_BASE}/s3/`);
  return data.buckets || [];
}

export async function fetchRDS() {
  const data = await apiFetch(`${AWS_BASE}/rds/`);
  return data.instances || [];
}

export async function fetchLambda() {
  const data = await apiFetch(`${AWS_BASE}/lambda/`);
  return data.functions || [];
}

/* ================= AUTH ================= */

export async function fetchMe(token: string) {
  return apiFetch(`${API_URL}/auth/me?token=${token}`);
}


